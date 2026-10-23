const e=`// 场景：订单支付成功后异步发送回执邮件，失败按指数退避重试，最终失败转入死信队列。
// 结构：Module 装配队列与 Provider，Controller 只负责接收请求，Service 投递任务，Processor 消费任务。

// ═══ 1. 共享契约与基础设施 Provider ═══
import { Body, Controller, HttpCode, Inject, Injectable, Logger, Module, Param, Post } from '@nestjs/common'
import { BullModule, InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { IsEmail } from 'class-validator'
import { DataSource } from 'typeorm'
import type { Job, Queue } from 'bullmq'

export interface SendReceiptPayload {
  orderId: string
  email: string
}

export interface MailTransport {
  sendMail(message: { to: string; subject: string }): Promise<void>
}

@Injectable()
export class SmtpMailTransport implements MailTransport {
  async sendMail(message: { to: string; subject: string }): Promise<void> {
    // 说明：真实项目在这里调用 SMTP 客户端或第三方邮件 API
    void message
  }
}

@Injectable()
export class MailReceiptRepository {
  constructor(private readonly dataSource: DataSource) {}

  async wasSent(orderId: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      'SELECT 1 FROM mail_receipt WHERE order_id = $1 LIMIT 1',
      [orderId],
    )
    return rows.length > 0
  }

  async markSent(orderId: string): Promise<void> {
    await this.dataSource.query(
      \`INSERT INTO mail_receipt (order_id, sent_at)
       VALUES ($1, NOW())
       ON CONFLICT (order_id) DO NOTHING\`, // 结果：并发重复写入被唯一约束吸收
      [orderId],
    )
  }
}

@Injectable()
export class MailerService {
  constructor(@Inject('MAIL_TRANSPORT') private readonly transport: MailTransport) {}

  async sendReceipt(email: string, orderId: string): Promise<void> {
    await this.transport.sendMail({
      to: email,
      subject: \`订单 \${orderId} 的回执\`,
    })
  }
}

// ═══ 2. 生产者：Service 投递任务，Controller 立即返回 202 ═══
@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail')
    private readonly mailQueue: Queue<SendReceiptPayload>,
  ) {}

  async enqueueReceipt(orderId: string, email: string) {
    return this.mailQueue.add(
      'send-receipt',
      { orderId, email },
      {
        jobId: \`receipt:\${orderId}\`, // 说明：记录保留期间相同 jobId 不会重复入队
      },
    )
  }

  async getJobState(jobId: string) {
    return this.mailQueue.getJob(jobId) // 结果：可按 jobId 查询任务当前状态
  }
}

export class NotifyDto {
  @IsEmail()
  email!: string
}

@Controller('orders')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(':id/notify')
  @HttpCode(202)
  async notify(@Param('id') orderId: string, @Body() dto: NotifyDto) {
    const job = await this.mailService.enqueueReceipt(orderId, dto.email)
    return { accepted: true, jobId: job.id } // 结果：客户端拿到任务编号，不再等待邮件发送
  }
}

// ═══ 3. Processor：WorkerHost 消费任务并做业务幂等 ═══
@Processor('mail', {
  concurrency: 5,                           // 结果：单实例最多 5 条任务并行
  limiter: { max: 100, duration: 60_000 },  // 结果：每分钟最多处理 100 条，保护邮件服务配额
})
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name)

  constructor(
    private readonly mailer: MailerService,
    private readonly receipts: MailReceiptRepository,
    @InjectQueue('mail-dead-letter')
    private readonly deadLetterQueue: Queue,
  ) {
    super()
  }

  async process(job: Job<SendReceiptPayload>): Promise<void> {
    const { orderId, email } = job.data
    if (await this.receipts.wasSent(orderId)) {
      this.logger.warn(\`订单 \${orderId} 已发送过回执，跳过重复任务 \${job.id}\`)
      return // 结果：重复投递直接短路，不再发第二封邮件
    }

    await this.mailer.sendReceipt(email, orderId)
    await this.receipts.markSent(orderId) // 说明：唯一约束保证并发下也只写入一次
    this.logger.log(\`第 \${job.attemptsMade + 1} 次尝试成功：\${job.id}\`)
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<SendReceiptPayload>, error: Error): Promise<void> {
    this.logger.error(\`任务 \${job.id} 第 \${job.attemptsMade} 次失败：\${error.message}\`)
    const maxAttempts = job.opts.attempts ?? 1
    if (job.attemptsMade >= maxAttempts) {
      await this.deadLetterQueue.add('send-receipt-dead', {
        ...job.data,
        failedReason: error.message,
      })
      this.logger.error(\`任务 \${job.id} 已耗尽尝试次数，转入死信队列\`)
    }
  }
}

// ═══ 4. 业务写入与任务投递的一致性：outbox ═══
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name)

  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async markPaid(orderId: string, email: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['PAID', orderId],
      )
      await manager.query(
        'INSERT INTO mail_outbox (order_id, email, created_at) VALUES ($1, $2, NOW())',
        [orderId, email],
      )
    })
    this.logger.log(\`订单 \${orderId} 已支付，outbox 记录等待独立轮询任务转投队列\`)
  }

  async relayOutbox(): Promise<number> {
    const rows = await this.dataSource.query(
      \`SELECT id, order_id, email
       FROM mail_outbox
       WHERE published_at IS NULL
       ORDER BY id
       LIMIT 50\`,
    )
    for (const row of rows) {
      await this.mailService.enqueueReceipt(row.order_id, row.email)
      await this.dataSource.query(
        'UPDATE mail_outbox SET published_at = NOW() WHERE id = $1',
        [row.id],
      )
    }
    return rows.length // 结果：返回本轮转投数量，供调度器记录
  }
}

// ═══ 5. Module 装配：队列、Controller、Processor 与基础设施 ═══
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',                         // 说明：队列名是生产者与消费者的唯一约定
      defaultJobOptions: {
        attempts: 4,                        // 结果：首次执行 + 3 次重试
        backoff: { type: 'exponential', delay: 1000 }, // 结果：重试间隔 1s、2s、4s
        removeOnComplete: 1000,             // 说明：只保留最近 1000 条完成记录
        removeOnFail: 5000,                 // 说明：保留失败现场，供排查与重放
      },
    }),
    BullModule.registerQueue({ name: 'mail-dead-letter' }),
  ],
  controllers: [MailController],
  providers: [
    MailService,
    MailProcessor,
    MailerService,
    MailReceiptRepository,
    PaymentService,
    { provide: 'MAIL_TRANSPORT', useClass: SmtpMailTransport },
  ],
  exports: [MailService],
})
export class MailModule {}

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
    }),
    MailModule,
  ],
})
export class AppModule {}
`;export{e as default};
