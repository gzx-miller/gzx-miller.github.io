const n=`<script setup lang="ts">
import N16Queues from './N16Queues.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>支付回调里依次写订单、发邮件、生成海报，接口要等三件事都做完才返回。某天邮件服务超时，用户钱已经付了，回调却返回 500，重试又把订单写了两遍——这些「必须做、但不该让用户等」的工作，为什么不能先从请求链路里拿出去？
    </div>

    <h2>请求链路之外的耗时工作</h2>
    <p>
      一个下单请求真正必须同步完成的，只有「校验、扣库存、写订单」这几步。发确认邮件、生成分享海报、同步数据到报表仓库，这些工作要么耗时，要么依赖外部服务，和用户能否立刻看到「下单成功」没有直接关系。
    </p>
    <p>
      把它们留在请求链路里，接口响应时间就等于所有下游服务耗时之和，其中最慢的那个决定整体体验。更隐蔽的问题是<strong>失败语义被混在一起</strong>：邮件发不出去，到底算下单失败还是成功？如果算失败，订单已经落库；如果算成功，用户又收不到回执。请求线程里同时承担「业务写入」和「后续通知」，责任边界从一开始就模糊了。
    </p>
    <p>
      正确的拆分是：请求只完成必须同步的部分，然后把「稍后要做的事」包装成一条消息投递出去，立刻返回 <code>202 Accepted</code>。客户端拿到任务编号，需要结果时再查询任务状态。
    </p>

    <h2>同步等待的三重代价</h2>
    <ul>
      <li><strong>延迟叠加。</strong>邮件服务一次调用 800ms，海报生成 2s，用户就要多等近 3 秒；流量高峰时下游变慢，请求线程被长期占用，连接池很快耗尽。</li>
      <li><strong>失败即丢失。</strong>进程重启、下游超时、网络抖动都会让「还没执行的通知」直接消失，没有任何补做机制。</li>
      <li><strong>重试放大。</strong>为了不丢消息，只能在请求里手写重试循环，可重试又会拖长响应时间；上游等不及先超时，用户再点一次，订单和通知都可能重复。</li>
    </ul>
    <p>
      这些问题不是靠「多加几个 try / catch」能解决的，因为它们来自同一个结构缺陷：<strong>把异步工作塞进了同步链路</strong>。
    </p>

    <h2>生产者与消费者解耦</h2>
    <p>
      消息队列把一次工作拆成两个角色：<strong>生产者</strong>只负责把任务描述写入队列，<strong>消费者</strong>从队列取出任务并执行。两者通过队列名和任务数据格式约定契约，彼此不需要知道对方部署在哪、有多少实例。
    </p>
    <p>
      NestJS 通过 <code>@nestjs/bullmq</code> 接入 BullMQ，底层使用 Redis 保存队列。根模块用 <code>BullModule.forRoot</code> 配置连接，业务模块用 <code>registerQueue</code> 声明自己使用的队列。队列名是生产与消费两侧唯一的约定，改名就等于换了一条队列。
    </p>
    <p>
      队列带来的直接收益是<strong>削峰</strong>：突发流量先把任务堆在队列里，消费者按自己的处理能力慢慢取，下游不会因为瞬时并发被打垮。任务也不会因为一次失败就消失，而是留在队列中等待下一次尝试。
    </p>

    <h2>注册队列与 WorkerHost</h2>
    <p>
      一个完整的队列模块需要三部分：模块里注册队列、服务里注入 <code>Queue</code> 投递任务、处理器继承 <code>WorkerHost</code> 消费任务。处理器本身也是 Provider，必须登记在模块的 <code>providers</code> 中，容器才会启动它。
    </p>
    <table>
      <thead>
        <tr><th>角色</th><th>关键写法</th><th>职责</th></tr>
      </thead>
      <tbody>
        <tr><td>模块</td><td><code>BullModule.registerQueue({ name: 'mail' })</code></td><td>声明队列并配置默认任务选项。</td></tr>
        <tr><td>生产者</td><td><code>@InjectQueue('mail') queue: Queue</code></td><td>用 <code>queue.add(name, data, opts)</code> 投递任务。</td></tr>
        <tr><td>消费者</td><td><code>@Processor('mail') class MailProcessor extends WorkerHost</code></td><td>实现 <code>process(job)</code>，处理单条任务。</td></tr>
      </tbody>
    </table>
    <p>
      <code>process</code> 正常返回即视为任务完成，抛异常则视为失败。消费者不接触 HTTP 请求上下文，因此任务数据必须<strong>自包含</strong>：订单号、收件地址都要放进 <code>job.data</code>，而不是依赖当前登录用户或请求对象。
    </p>

    <h2>至少一次与消费者幂等</h2>
    <p>
      主流队列提供的是 <strong>at-least-once（至少一次）</strong>语义，而不是「恰好一次」。消费者可能已经执行完业务逻辑，但在向队列确认之前进程崩溃，队列就会把同一条任务再投一次。网络分区、消费者重启也会造成同样的结果。
    </p>
    <p>
      既然重复不可避免，消费者就必须<strong>幂等</strong>：同一个业务键执行一次和执行多次，结果一致。最常用的做法是给业务动作建立唯一键，例如以 <code>orderId</code> 作为回执表的唯一索引，处理前先查、处理中靠数据库唯一约束兜底。这样即使两个消费者同时处理同一条任务，也只有一个能写入成功。
    </p>
    <p>
      <code>jobId</code> 也常被用来去重：相同 <code>jobId</code> 的任务在记录保留期间不会被重复加入队列。但它只覆盖「入队」阶段，任务完成记录被清理后仍可再次入队，所以<strong>不能把 <code>jobId</code> 当成永久的幂等方案</strong>。真正的幂等键必须落在业务数据里。
    </p>

    <h2>重试、死信与限流</h2>
    <p>
      失败并不可怕，可怕的是失败后既没有重试，也没有记录。BullMQ 用三个选项描述重试策略：<code>attempts</code> 是最大尝试次数（含首次执行），<code>backoff</code> 决定两次尝试之间等多久，<code>removeOnFail</code> 决定失败记录保留多久。
    </p>
    <ul>
      <li><strong>指数退避。</strong><code>backoff: { type: 'exponential', delay: 1000 }</code> 让等待时间按 1s、2s、4s 递增，给下游恢复的时间，避免立刻重试把对方再次打垮。</li>
      <li><strong>最大尝试次数。</strong>次数用尽后任务进入失败状态。失败记录不要立刻删除，否则问题现场就没了。</li>
      <li><strong>死信队列。</strong>在 <code>failed</code> 事件里判断是否已耗尽尝试，把任务数据转投到专门的死信队列，后续人工排查或批量重放。</li>
      <li><strong>并发与限流。</strong><code>@Processor('mail', { concurrency: 5, limiter: { max: 100, duration: 60000 } })</code> 控制单实例并发和每分钟处理上限，保护下游配额。</li>
    </ul>
    <p>
      还有一个容易被忽略的边界：<strong>数据库写入与任务投递是两次独立操作</strong>。如果先投递后提交事务，事务回滚时任务已经发出；如果先提交后投递，投递前进程崩溃，任务又丢了。可靠做法是把任务先写进业务库的 outbox 表，与业务数据同事务提交，再由后台轮询转投队列。
    </p>

    <figure class="lesson-figure">
      <figcaption>投递任务、模拟失败，观察尝试次数、指数退避与死信队列的变化。</figcaption>
      <N16Queues />
    </figure>

    <div class="lesson-box warn">
      <strong>两个最容易踩的坑：</strong>其一，消费者里直接写「发邮件」却不做去重，重复投递就会给用户发两封；正确做法是以业务唯一键先查后写，并用数据库唯一约束兜底。其二，处理器忘记登记到模块的 <code>providers</code>，队列有任务却永远没人消费——<code>@Processor</code> 只负责标记，注册仍然要靠模块。
    </div>

    <div class="lesson-term">
      <span class="term-name">「消息队列与异步任务」</span>把耗时或易失败的工作从请求链路剥离：生产者用 <code>Queue.add</code> 投递，消费者用 <code>@Processor</code> + <code>WorkerHost.process</code> 处理。队列提供至少一次投递，因此消费者必须按业务唯一键幂等；失败通过 <code>attempts</code> 与指数退避重试，耗尽后转入死信队列人工处理；<code>concurrency</code> 与 <code>limiter</code> 负责削峰限流；数据库与队列的双写要用 outbox 模式保证一致。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
