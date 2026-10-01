<script setup lang="ts">
import N08TypeOrmDb from './N08TypeOrmDb.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名接口先查询课程、判断名额、再把报名人数加一，三步分开写。两个人同时抢最后一个名额，为什么两边都提示「报名成功」，课程却超卖了？
    </div>

    <h2>名额检查与计数递增</h2>
    <p>
      课程报名这件事，落到数据库上就是一句话：<strong>确认已报名人数还没到容量，然后把已报名人数加一</strong>。看起来是「查一下、判一下、写一下」，三步都很普通。
    </p>
    <p>
      可当请求并发到来时，问题就藏在这三步之间的缝隙里。两个请求可能<strong>交替执行</strong>：A 读到「还剩 1 个名额」，还没来得及写回，B 也读到了同样的「还剩 1 个名额」——两边都通过了检查，都执行了加一，于是容量被击穿，报名人数超过了上限。不解决它，你要付的代价是：<strong>校验逻辑在并发下形同虚设，数据被悄悄写坏</strong>。
    </p>

    <h2>仓储顺序调用</h2>
    <p>
      最省事的做法，是顺序调用仓储（Repository）：<code>findOneBy(Course, { id })</code> 查出课程，判断 <code>enrolled</code> 是否够用，再用 <code>increment</code> 把人数加一。TypeORM 的实体用装饰器描述表结构，Repository 则提供类型安全的增删改查：
    </p>
    <p>
      <code>@Entity('courses')</code><br />
      <code>export class Course {</code><br />
      <code>&nbsp;&nbsp;@PrimaryGeneratedColumn() id: number</code><br />
      <code>&nbsp;&nbsp;@Column({ length: 100 }) title: string</code><br />
      <code>&nbsp;&nbsp;@Column({ default: 0 }) capacity: number</code><br />
      <code>&nbsp;&nbsp;@Column({ default: 0 }) enrolled: number</code><br />
      <code>}</code>
    </p>
    <p>
      它做对了两件事：<strong>表结构被清晰地写在了类上，读写走的是类型安全的 API</strong>，不用自己拼字符串 SQL，字段写错编译期就能发现。单请求、无并发的场景下，这个顺序写法完全正确。
    </p>

    <h2>检查写入竞态窗口</h2>
    <ul>
      <li>「查 → 判 → 写」三步之间存在窗口，并发请求会互相插队，检查形同虚设。</li>
      <li>中途任一步失败时，前面已经写下的改动不会自动撤销，数据可能停在半截状态。</li>
      <li>手动 <code>new</code> 一个 Repository 既啰嗦又难以测试，依赖关系也不透明。</li>
      <li>表结构变更靠手工改库，容易和实体定义脱节，上线时对不上。</li>
    </ul>

    <h2>事务原子边界</h2>
    <p>
      不推翻「检查后写入」，而是给这组写操作<strong>加一个原子边界</strong>，让它们要么全部成功、要么整体不发生。分三步补齐。
    </p>
    <p>
      第一步，解决「Repository 从哪来」。用 <code>@InjectRepository(Course)</code> 注入实体对应的仓储，交给依赖注入容器管理，无需手动 <code>new</code>：
    </p>
    <p>
      <code>constructor(</code><br />
      <code>&nbsp;&nbsp;@InjectRepository(Course)</code><br />
      <code>&nbsp;&nbsp;private readonly courseRepo: Repository&lt;Course&gt;,</code><br />
      <code>) {}</code>
    </p>
    <p>
      第二步，也是最关键的一步，用<strong>事务</strong>把多步写操作包起来。<code>manager.transaction</code> 接收一个回调，回调内的所有语句都在同一个数据库事务中执行：任一步抛错，整笔操作<strong>整体回滚</strong>；全部走完，才统一提交。
    </p>
    <p>
      <code>await this.courseRepo.manager.transaction(async (manager) =&gt; {</code><br />
      <code>&nbsp;&nbsp;const course = await manager.findOneBy(Course, { id: courseId })</code><br />
      <code>&nbsp;&nbsp;if (!course) throw new NotFoundException('课程不存在')</code><br />
      <code>&nbsp;&nbsp;if (course.enrolled &gt;= course.capacity) throw new BadRequestException('课程名额已满')</code><br />
      <code>&nbsp;&nbsp;await manager.increment(Course, { id: courseId }, 'enrolled', 1)</code><br />
      <code>})</code>
    </p>
    <p>
      报名流程因此变成一条清晰的链路：
    </p>
    <ol class="lesson-steps">
      <li>请求携带 <code>courseId</code> 到达报名接口。</li>
      <li>事务开启，查询课程并检查 <code>enrolled</code> 是否小于 <code>capacity</code>。</li>
      <li>名额充足则自增 <code>enrolled</code>；不足则抛出 <code>BadRequestException</code>，整笔回滚。</li>
      <li>事务提交，返回报名成功；若中途异常，则返回 400 且数据库没有任何改动。</li>
    </ol>
    <p>
      第三步是收尾：把表结构的变更交给<strong>迁移（Migration）</strong>管理，而不是手工改库；复杂查询则用 <code>QueryBuilder</code> 链式拼装，比如 <code>createQueryBuilder('course').where('c.capacity &gt; :n', { n: 0 }).getMany()</code>。此外，课程与学员这类「一对多」「多对多」的关系，用 <code>@OneToMany</code> / <code>@ManyToMany</code> 加关联选项描述，实体就能表达出表之间的关系。
    </p>
    <div class="lesson-box warn">
      事务保证的是「一组写操作要么全做要么全不做」，但它<strong>并不能自动消除竞态</strong>：即使包在事务里，「先查询再判断再写入」仍是两个请求可能同时读到剩余 1 个名额、同时通过检查。生产环境要用 <code>SELECT ... FOR UPDATE</code> 悲观锁，或乐观锁（<code>@Version</code> 列）来保证并发一致性。
    </div>

    <h2>报名事务分步观察</h2>
    <figure class="lesson-figure">
      <figcaption>点课程上的「报名」，观察事务中「检查名额 → 扣减 → 提交或回滚」的原子过程。</figcaption>
      <N08TypeOrmDb />
    </figure>

    <h2>多步写入原子约束</h2>
    <p>
      用 TypeORM 处理写业务，关键不在会写几张表的增删改查，而在<strong>把多步写操作放进同一个原子边界</strong>：实体负责描述结构，<code>@InjectRepository</code> 负责拿到仓储，事务负责让「检查后写入」要么全成、要么全退。最后再补上并发这一课——事务解决的是原子性，锁解决的才是一致性，两者各司其职。
    </p>
    <div class="lesson-term">
      <span class="term-name">「实体、仓储与事务」</span>TypeORM 用 <code>@Entity</code> 加 <code>@Column</code> 等装饰器把类映射为表；<code>@InjectRepository(Course)</code> 注入 <code>Repository&lt;Course&gt;</code>，无需手动 <code>new</code>。多步写操作放进 <code>manager.transaction(async (manager) =&gt; ...)</code>，回调内所有语句同属一个事务，任一步抛错整体回滚。复杂查询用 <code>QueryBuilder</code>，表结构变更用迁移（Migration）管理。注意事务只保证原子性，「先查再判再写」的并发竞态还需 <code>SELECT ... FOR UPDATE</code> 悲观锁或 <code>@Version</code> 乐观锁。
    </div>
  </LessonArticle>
</template>
