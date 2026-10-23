const n=`// 课程报名并发控制：DataSource 事务边界、悲观锁与乐观锁的完整服务实现

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import {
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Repository,
  Unique,
  Version,
} from 'typeorm'

// ═══ 1. 实体：@Version 支撑乐观锁，唯一约束兜底重复报名 ═══
@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  title: string

  @Column({ default: 0 })
  capacity: number

  @Column({ default: 0 })
  enrolled: number

  @Version()
  version: number            // 说明：每次成功更新自动加一，作为乐观锁的版本号
}

@Entity('enrollments')
@Unique(['courseId', 'userId'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  courseId: number

  @Column()
  userId: string
}

// ═══ 2. 事务边界：检查、扣减、写报名记录三者原子 ═══
@Injectable()
export class EnrollmentService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async enroll(courseId: number, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const course = await manager.findOne(Course, { where: { id: courseId } })
      if (!course) throw new NotFoundException('课程不存在')
      if (course.enrolled >= course.capacity) throw new BadRequestException('名额已满')

      await manager.increment(Course, { id: courseId }, 'enrolled', 1)
      await manager.insert(Enrollment, { courseId, userId })

      return { courseId, remaining: course.capacity - course.enrolled - 1 }
      // 结果：任一步抛错，increment 与 insert 一起回滚，不会留下半笔报名
    })
  }

  // ═══ 3. 悲观锁：让读取也排队，适合高冲突写入 ═══
  async enrollWithPessimisticLock(courseId: number, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const course = await manager.findOne(Course, {
        where: { id: courseId },
        lock: { mode: 'pessimistic_write' },   // 说明：生成 SELECT ... FOR UPDATE，锁持有到事务结束
      })
      if (!course) throw new NotFoundException('课程不存在')
      if (course.enrolled >= course.capacity) throw new BadRequestException('名额已满')

      await manager.increment(Course, { id: courseId }, 'enrolled', 1)
      await manager.insert(Enrollment, { courseId, userId })

      return { courseId, remaining: course.capacity - course.enrolled - 1 }
      // 结果：后到的事务被行锁挡住，读到的 enrolled 一定是前一个事务提交后的值
    })
  }

  // ═══ 4. 乐观锁：条件更新 + 受影响行数判断 ═══
  async enrollWithOptimisticLock(courseId: number, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const course = await manager.findOneByOrFail(Course, { id: courseId })
      if (course.enrolled >= course.capacity) throw new BadRequestException('名额已满')

      const result = await manager
        .createQueryBuilder()
        .update(Course)
        .set({ enrolled: () => 'enrolled + 1', version: () => 'version + 1' })
        .where('id = :id AND version = :version', {
          id: courseId,
          version: course.version,
        })
        .execute()

      if (result.affected === 0) {
        throw new ConflictException('课程已被其他请求修改，请重试')
        // 结果：版本不匹配，条件更新影响 0 行，不会覆盖别人的写入
      }

      await manager.insert(Enrollment, { courseId, userId })
      return { courseId, remaining: course.capacity - course.enrolled - 1 }
    })
  }

  // ═══ 5. QueryRunner：需要手动控制提交与回滚时使用 ═══
  async enrollWithQueryRunner(courseId: number, userId: string) {
    const runner = this.dataSource.createQueryRunner()
    await runner.connect()
    await runner.startTransaction()

    try {
      const course = await runner.manager.findOne(Course, {
        where: { id: courseId },
        lock: { mode: 'pessimistic_write' },
      })
      if (!course) throw new NotFoundException('课程不存在')
      if (course.enrolled >= course.capacity) throw new BadRequestException('名额已满')

      await runner.manager.increment(Course, { id: courseId }, 'enrolled', 1)
      await runner.manager.insert(Enrollment, { courseId, userId })
      await runner.commitTransaction()

      return { courseId, remaining: course.capacity - course.enrolled - 1 }
    } catch (error) {
      await runner.rollbackTransaction()
      throw error                              // 说明：回滚后继续抛出，交给全局异常过滤器
    } finally {
      await runner.release()                   // 说明：连接必须归还连接池，否则会耗尽池
    }
  }

  // ═══ 6. 调试辅助：读取当前落库状态，便于压测后核对 ═══
  async findCourse(courseId: number) {
    const course = await this.courseRepo.findOneBy({ id: courseId })
    if (!course) throw new NotFoundException('课程不存在')
    return {
      id: course.id,
      capacity: course.capacity,
      enrolled: course.enrolled,
      version: course.version,
      oversold: Math.max(0, course.enrolled - course.capacity),
    }
  }
}

// ═══ 7. 控制器：三种策略分别暴露接口，便于并发压测对照 ═══
@Controller('courses')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':id/enroll')
  enroll(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: string },
  ) {
    return this.enrollmentService.enroll(id, body.userId)
  }

  @Post(':id/enroll/pessimistic')
  enrollPessimistic(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: string },
  ) {
    return this.enrollmentService.enrollWithPessimisticLock(id, body.userId)
  }

  @Post(':id/enroll/optimistic')
  enrollOptimistic(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: string },
  ) {
    return this.enrollmentService.enrollWithOptimisticLock(id, body.userId)
  }
}

// ═══ 8. 模块装配：TypeORM 仓储与业务服务交给 DI 容器 ═══
@Module({
  imports: [TypeOrmModule.forFeature([Course, Enrollment])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
`;export{n as default};
