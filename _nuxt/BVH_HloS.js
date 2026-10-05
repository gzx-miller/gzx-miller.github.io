const n=`<script setup lang="ts">
import D08Concurrency from './D08Concurrency.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要给五千个用户批量发通知，一句 <code>Promise.all(users.map(send))</code> 让它们全部同时发出；结果下游短信网关当场限流把请求打了回来，本机还因为打开的文件连接太多报了 <code>EMFILE</code>。把并发降到「同时最多十个」，总耗时却几乎没变——并发更高，为什么反而更慢、还会把下游压垮？
    </div>

    <h2>异步任务批量发起</h2>
    <p>
      你面前有一批互相独立的异步任务：批量发通知、批量读文件、批量调接口。逐个 <code>await</code> 要等前一个结束才做下一个，太慢；索性用 <code>Promise.all</code> 让它们一起出发，又换来另一种麻烦。
    </p>
    <p>
      无界并发把成本都转移到了看不见的地方：<strong>每个在途任务都占着一份稀缺资源</strong>——socket、文件句柄、数据库连接，数量一多就耗尽；<strong>下游有容量上限</strong>，瞬间涌入超出它承受范围的请求，轻则排队变慢，重则触发限流甚至雪崩；<strong>一个任务失败，<code>Promise.all</code> 会立刻整体 reject</strong>，已经成功的结果也一起丢掉；而且<strong>所有任务的中间状态同时挂在内存里</strong>，任务越多、内存压力越大。
    </p>
    <p>
      问题落到一句话：怎样在不牺牲太多吞吐的前提下，把「同时在做的事」控制在一个安全的数量以内？
    </p>

    <h2>固定并发任务池</h2>
    <p>
      用<strong>任务池</strong>的思路：准备一个任务队列，起固定数量的 worker（比如 2 个或 10 个），每个 worker 循环「从队列取一个任务 → <code>await</code> 它完成 → 再取下一个」，直到队列取空。
    </p>
    <p>
      这个方案做对了一件核心的事：<strong>它把「无界并发」变成了「有界并发」</strong>。任意时刻在途的任务数恒等于 worker 数，与队列里还剩多少任务完全无关。
    </p>

    <h2>并发度容量估算</h2>
    <ul>
      <li>worker 数量拍脑袋定：设太大下游照样被打垮，设太小吞吐上不去，必须结合下游容量压测来定。</li>
      <li>任务失败若直接抛出，会让这个 worker 提前退出、后面没人继续取任务，一个「毒丸任务」就能阻塞整条流水线。</li>
      <li>用 <code>Promise.all</code> 收集结果，单个失败就把全部已完成结果一起丢掉。</li>
      <li>把 CPU 密集任务丢进池里没用：它们是同步占满线程的，并发控制既不提速、又白白阻塞事件循环。</li>
      <li>worker 与队列的收尾没写干净，可能出现队列都空了、worker 还在空转等待。</li>
    </ul>

    <h2>拉取循环与有界并发</h2>
    <p>
      先<strong>固定 worker 数量</strong>：用 N 个并发的「拉取循环」替换掉一次性 <code>map</code>。为什么先做它——这是把并发从无界变有界的核心动作，后面所有优化都建立在它之上。
    </p>
    <p>
      再让 worker <strong>完成一个、再领下一个</strong>，也就是 pull 模型，而不是事先把任务平均切分给每个 worker。因为任务耗时长短不一，固定切分会造成有人早早干完、有人还在排长队；pull 让快的人自然多干活，自动实现负载均衡。
    </p>
    <p>
      再处理<strong>单个任务的失败</strong>：在 worker 内部用 <code>try ... catch</code>，记录错误后继续取下一个任务，绝不让一次失败熔断整批任务。
    </p>
    <p>
      再用<strong>「收集而非短路」</strong>的方式汇总结果：每个任务包一层、返回成功值或失败原因，整批跑完后统一汇总，单个失败不影响其余结果——这正是 <code>Promise.allSettled</code> 的思路。
    </p>
    <p>
      再按<strong>下游容量定并发上限</strong>：观察下游的错误率与延迟随并发上升的变化，找到一个「再高就开始变差」的拐点，把上限设在它之前，而不是凭感觉拍一个数字。
    </p>
    <p>
      最后<strong>区分任务类型</strong>：这套池子适合等待型的 I/O 任务；CPU 密集的计算任务再多「并发」也没用，要交给 Worker Threads 或子进程（那是后面单独一节课的内容），别混进同一个 Promise 池里。
    </p>
    <div class="lesson-box warn">
      <strong>两个隐蔽的坑：</strong>无界的 <code>Promise.all</code> 不是「更快」，而是把压力转移给了下游与操作系统，可能触发限流或 <code>EMFILE</code>；而失败隔离做不到位时，一个任务抛错就会让整批停摆——并发控制的收益，一半来自提速，另一半来自这种「坏一个不坏一批」的稳健。
    </div>

    <h2>在途任务数对照</h2>
    <figure class="lesson-figure">
      <figcaption>点「以并发 2 执行任务」，盯着「执行中」的数字看——它始终不超过 2，说明同时在途的任务被 worker 数量卡住了，而不是 6 个任务一起冲出去。</figcaption>
      <D08Concurrency />
    </figure>

    <h2>保护下游与并发上限</h2>
    <p>
      任务池把「并发」从一个形容词变成了一个可配置的数字：<strong>固定 worker 数、pull 领取任务、失败不中断、上限按下游容量定</strong>。提速的前提，是先保护下游。
    </p>
    <div class="lesson-term">
      <span class="term-name">「有界并发（bounded concurrency）」</span>指用固定数量的 worker 从队列领取任务，使任意时刻在途任务数不超过上限，从而限制对文件句柄、数据库连接和下游带宽的占用。边界与例外：上限应结合下游容量压测确定，不是越大越好；单个任务失败要记录后继续，避免毒丸任务阻塞整条流水线；它适合等待型的 I/O 任务，CPU 密集任务应交给 Worker Threads 或子进程。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
