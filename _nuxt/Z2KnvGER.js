const n=`<script setup lang="ts">
import N14Transactions from './N14Transactions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程只剩最后 1 个名额，报名逻辑已经包在 <code>manager.transaction</code> 里：先查 <code>enrolled &lt; capacity</code>，再自增。可两个人同时点「报名」，两边都返回成功，课程却多卖了一个。事务不是应该保证「检查与写入一起完成」吗，为什么还是被并发击穿了？
    </div>

    <h2>事务边界与失败回滚</h2>
    <p>
      事务首先解决的是<strong>原子性</strong>：一组写操作要么全部提交，要么全部不发生。TypeORM 里可以用 <code>DataSource.transaction(async (manager) =&gt; { ... })</code> 声明边界，回调内所有语句共用同一个事务管理器；也可以在需要精细控制时用 <code>QueryRunner</code>，手动 <code>startTransaction</code>、<code>commitTransaction</code>、<code>rollbackTransaction</code>。
    </p>
    <p>
      两种写法的关键差别在「谁来收尾」。<code>transaction</code> 回调抛出异常时框架自动回滚，并让异常继续向上传播；<code>QueryRunner</code> 则必须自己写 <code>try / catch / finally</code>：<code>catch</code> 里回滚后要<strong>重新抛出</strong>，<code>finally</code> 里释放连接，否则连接会一直挂在池里。
    </p>
    <p>
      因此事务只保证「一起成功或一起失败」，它<strong>不会自动让并发的检查与写入排队</strong>。这是后面所有问题的起点。
    </p>

    <h2>隔离级别与竞态窗口</h2>
    <p>
      隔离级别决定并发事务之间的可见性。标准定义了四种，越往上一致性越强、并发度越低：
    </p>
    <ul>
      <li><strong>READ UNCOMMITTED</strong>：能读到别的事务尚未提交的数据，即脏读，几乎不用于业务系统。</li>
      <li><strong>READ COMMITTED</strong>：只读已提交数据，避免脏读；但同一事务内两次读同一行可能得到不同结果，即不可重复读，范围查询也可能多出新行。</li>
      <li><strong>REPEATABLE READ</strong>：同一事务内重复读保持一致，避免不可重复读；标准定义下仍可能出现幻读——同一范围查询多出新的行。</li>
      <li><strong>SERIALIZABLE</strong>：让并发事务表现得像串行执行，三类异常都避免，代价是更多阻塞与重试。</li>
    </ul>
    <p>
      要注意数据库实现会加码：InnoDB 默认是 REPEATABLE READ，普通 <code>SELECT</code> 走快照读，看到的是事务开始时的版本；而 <code>SELECT ... FOR UPDATE</code> 走当前读，会加锁并读到最新已提交数据。这也解释了为什么「把查询放进事务」并不等于「查询会看到最新数据」。
    </p>
    <p>
      报名逻辑是典型的 <strong>check-then-act</strong>：读 <code>enrolled</code>、比较 <code>capacity</code>、再写入。三步之间有一个窗口，两个事务都可能在这个窗口里读到同一个旧值 <code>0</code>，都判断「还有名额」，然后各自写入。后写的覆盖先写的，或者两笔报名都落库，最终结果都比真实容量多。
    </p>
    <p>
      提高隔离级别并不总是解药：REPEATABLE READ 下快照读依然可能让两个事务看到同一份旧数据；SERIALIZABLE 虽然能阻止，但会把大量并发变成串行，吞吐和死锁风险都要重新评估。真正对症的是<strong>让「读」也参与并发控制</strong>——悲观锁或乐观锁。
    </p>

    <h2>悲观锁：SELECT ... FOR UPDATE</h2>
    <p>
      悲观锁假设冲突一定会发生。在事务内用 <code>lock: { mode: 'pessimistic_write' }</code> 查询，TypeORM 会生成 <code>SELECT ... FOR UPDATE</code>，数据库对命中的行加排他锁：后到的事务必须等前一个事务提交或回滚，才能读到这一行。检查与写入因此被串成一条队列。
    </p>
    <ul>
      <li>锁的范围与查询条件相关：按主键等值查询只锁目标行；范围条件可能锁住更多行甚至间隙，必须看执行计划。</li>
      <li>锁一直持有到事务结束，事务越长，阻塞越久；要避免在锁内做网络请求、文件读写或等待用户输入。</li>
      <li>多个事务以不同顺序锁多行会形成死锁；统一加锁顺序，并给事务设置合理的超时与重试。</li>
    </ul>
    <p>
      它适合<strong>冲突概率高、写入必须立刻成功</strong>的场景，比如抢最后一个名额、扣减库存。
    </p>

    <h2>乐观锁：版本号与条件更新</h2>
    <p>
      乐观锁假设冲突较少，不在读取时加锁，而是在写入时校验「这行数据还是我读到的那个版本吗」。实体上加 <code>@Version() version</code>，更新时带上 <code>WHERE id = ? AND version = ?</code>，并把 <code>version</code> 加一。
    </p>
    <p>
      判断依据是<strong>受影响行数</strong>：<code>affected === 0</code> 说明版本已经被别人改过，本次更新失败。此时可以选择有限次重试（重新读取、重新计算、再次更新），也可以直接返回 409 让调用方决定。重试必须有上限和退避，否则高冲突下会变成无效的自旋。
    </p>
    <p>
      乐观锁没有长时间持锁，读多写少时吞吐更好；代价是冲突时要多做一轮读与写。冲突率很高时，反复失败的成本可能超过悲观锁的等待成本，选型要看真实并发分布，而不是背结论。
    </p>

    <h2>事务纪律与执行边界</h2>
    <p>
      无论选哪种锁，事务都应该<strong>短、窄、可预测</strong>：
    </p>
    <ul>
      <li>把网络调用、消息发送、第三方接口放到事务之外。它们既无法回滚，又会拉长持锁时间。</li>
      <li>不要在事务里 <code>catch</code> 异常后继续执行，否则该回滚的错误会被吞掉；要么修正后重试，要么让异常冒泡触发回滚。</li>
      <li>同一个事务里的多条语句通常共用一个连接，不要用 <code>Promise.all</code> 并发执行，以免把同一连接上的语句交错。</li>
      <li>为唯一性约束、幂等键留好兜底：锁解决并发窗口，唯一索引解决重复写入，两者互补。</li>
      <li>关注连接池：事务等待锁时也占着连接，长事务堆积会先把池耗尽，再把整个服务拖慢。</li>
    </ul>

    <h2>并发报名模拟</h2>
    <figure class="lesson-figure">
      <figcaption>课程只有 1 个名额。切换「无锁 / 悲观锁 / 乐观锁」，调整并发请求数，观察成功响应与实际落库人数是否一致；无锁模式下会出现明显超卖。</figcaption>
      <N14Transactions />
    </figure>

    <div class="lesson-box warn">
      <strong>三个常见误区：</strong>把「用了事务」当成「并发安全」——原子性不等于隔离性，先查后写仍需锁；以为提高隔离级别就能消灭竞态——快照读仍可能读到旧值，且吞吐代价很高；乐观锁只写 <code>UPDATE</code> 却不检查 <code>affected</code>，冲突被静默忽略，数据照样写错。
    </div>

    <div class="lesson-term">
      <span class="term-name">「事务与并发控制」</span>事务用 <code>DataSource.transaction</code> 或 <code>QueryRunner</code> 圈定原子边界，任一步抛错整体回滚；隔离级别控制脏读、不可重复读与幻读的可见性，但不替代锁。「先查后写」存在竞态窗口，悲观锁用 <code>pessimistic_write</code>（<code>SELECT ... FOR UPDATE</code>）让读参与加锁，乐观锁用 <code>@Version</code> 加条件更新、以受影响行数判断冲突。事务要短，锁内不做网络请求，异常必须冒泡以触发回滚。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
