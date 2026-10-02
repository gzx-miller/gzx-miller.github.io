const n=`<script setup lang="ts">
import N10ScheduleTask from './N10ScheduleTask.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>需求是「每天早上 8 点生成昨日订单日报」。你在服务启动时挂了个 <code>setInterval</code>，第一次能跑，重启后时间就漂了，多开一个实例还出了两份表——定时这件事，为什么不能自己算？
    </div>

    <h2>时间触发型任务</h2>
    <p>
      日报表、心跳上报、会话清理、周报汇总，这类需求有一个共同点：<strong>它们不由用户触发，而由时间触发</strong>。没有请求进来的时候，代码也得被叫醒一次。更麻烦的是触发条件往往是「日历上的某个时刻」——每天 8 点、每周一 9 点，而不是「每隔 86400 秒」。
    </p>
    <p>
      如果框架不管这件事，你就得在应用里自己写一套计时逻辑，还得自己处理重启、异常、多实例这些边界。代价不是「多写几行代码」，而是<strong>这套计时逻辑本身就是一台容易出错的调度器</strong>——出错的时机还偏偏在半夜。
    </p>

    <h2>固定间隔定时器</h2>
    <p>
      最朴素的做法：在某个服务启动时调一次 <code>setInterval</code>，间隔设成 24 小时，回调里聚合昨日订单并落库。
    </p>
    <p>
      它做对了一件关键的事：<strong>任务真的被自动执行了</strong>，而且回调就是个普通方法，可以直接 <code>this.orderService.aggregateYesterday()</code>，天然复用依赖注入。这一点不可替代——比起在服务器上单独挂一个外部 crontab 脚本，服务内的定时任务能直接调用业务代码、直接用容器里的连接池，不需要再维护一份独立的环境。
    </p>

    <h2>重启漂移与实例重复</h2>
    <ul>
      <li><code>setInterval</code> 只认「固定间隔」，表达不了「每天 08:00」这种日历时刻。间隔设成 24 小时后，执行时间由启动时刻决定，服务凌晨重启一次，日报表就永久漂到凌晨。</li>
      <li>进程一重启，计时器直接丢失，下一次触发要从启动时刻重新算起。</li>
      <li>回调抛异常时任务可能再也不跑，而且没有任何记录，看起来「一直在运行」。</li>
      <li>部署两个实例时每个实例各跑一遍，同一份报表被生成两次。</li>
      <li>运行时想查看任务、临时增删某一个，没有任何入口。</li>
    </ul>

    <h2>声明式触发规则</h2>
    <p>
      不推翻「服务内定时执行」，而是把「自己算时间」换成「声明触发规则」。引入 <code>@nestjs/schedule</code> 之后，一个装饰器就能声明任务，调度器负责计算下一次触发点。它提供三种调度方式，对应三种完全不同的时间语义：
    </p>
    <table>
      <thead>
        <tr><th>装饰器</th><th>时间表达方式</th><th>触发次数</th><th>典型场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>@Cron</code></td><td>cron 表达式（日历时刻）</td><td>按表达式周期重复</td><td>每天 08:00 生成日报表</td></tr>
        <tr><td><code>@Interval</code></td><td>固定毫秒间隔</td><td>每隔 N 毫秒重复</td><td>每 5 分钟上报一次健康心跳</td></tr>
        <tr><td><code>@Timeout</code></td><td>延迟毫秒数</td><td>只执行一次</td><td>启动后延迟 10 秒做预热</td></tr>
      </tbody>
    </table>
    <p>
      三者的选择逻辑很清晰：<strong>要绑定到日历上的具体时刻，用 <code>@Cron</code>；只关心「隔多久跑一次」，用 <code>@Interval</code>；只需要跑一次，用 <code>@Timeout</code></strong>。「每天早上 8 点」属于第一类，只能交给 cron 表达，用毫秒间隔是凑不出来的。
    </p>
    <p>
      cron 表达式在 NestJS 里是<strong>六段</strong>格式，依次是「秒 分 时 日 月 周」。所以 <code>@Cron('0 0 8 * * *')</code> 读作：第 0 秒、第 0 分、8 时、每天、每月、不限星期——即每天 08:00:00。常用通配符有三类：<code>*</code> 表示任意值，<code>*/5</code> 表示每 5 个单位，<code>?</code> 表示不指定。周字段的取值范围是 0 到 7，其中 0 和 7 都代表周日，写周一时就是 1。
    </p>
    <ol class="lesson-steps">
      <li>应用启动时扫描 <code>@Cron</code> / <code>@Interval</code> / <code>@Timeout</code> 装饰器，把它们注册成调度任务。</li>
      <li>调度器按触发器类型计算下一次触发时间，日报表任务落在明天的 08:00。</li>
      <li>到点调用对应方法，日报表任务聚合昨日订单并落库。</li>
      <li>任务抛出的异常由调度器记录，默认不会中断后续调度。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，cron 默认按<strong>服务器本地时区</strong>计算，跨时区部署时不显式指定 <code>timezone</code>，触发点会整体偏移，报表就错点了；其二，任务失败默认只写日志、没有告警，看起来一直在跑，其实早就没出数了——关键任务建议在方法内用 <code>try / catch</code> 包一层，失败时主动上报。
    </div>
    <p>
      还有两点值得记住。测试或临时运维时，可以用 <code>SchedulerRegistry</code> 在运行时列出、动态增删任务，也可以把任务替换成 mock 来单测，不必真的等到早上八点。而最棘手的是<strong>分布式部署</strong>：调度器是进程内的，每个实例都会扫描到同一份 <code>@Cron</code>，同一份日报表被生成多次。解决办法要么是加分布式锁——例如用 Redis 的 SETNX，抢到锁的实例才执行；要么把定时任务收敛到单独的调度实例上，其它实例不加载它。
    </p>

    <h2>单次触发与全量扫描</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行一次」看单个任务的触发过程，或点「模拟一轮调度」观察调度器扫描全部任务的方式。</figcaption>
      <N10ScheduleTask />
    </figure>

    <h2>调度语义精确表达</h2>
    <p>
      定时任务要解决的核心问题是「<strong>把时间语义写清楚</strong>」：<code>@Cron</code> 表达日历时刻，<code>@Interval</code> 表达固定间隔，<code>@Timeout</code> 表达只跑一次。任务挂在可注入的服务上，调度器负责计算与触发，异常处理与运行时管理都有对应手段。唯一需要额外警惕的是多实例——进程内调度在集群下会重复执行，必须用分布式锁或单实例收敛来解决。
    </p>
    <div class="lesson-term">
      <span class="term-name">「定时任务调度」</span>用 <code>@nestjs/schedule</code> 把方法声明为任务：<code>@Cron</code> 按六段 cron 表达式「秒 分 时 日 月 周」周期执行，<code>@Interval</code> 按固定毫秒间隔执行，<code>@Timeout</code> 延迟执行一次。周字段取 0-7（0 与 7 均为周日），<code>?</code> 表示不指定；时区默认取服务器本地，跨时区部署需显式配置 <code>timezone</code>。任务失败默认只记日志，可用 <code>SchedulerRegistry</code> 动态管理任务；集群下需分布式锁避免重复触发。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
