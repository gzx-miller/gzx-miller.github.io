<script setup lang="ts">
import D16WorkerThreads from './D16WorkerThreads.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给一个「导出全量报表」的功能加了一段纯计算，跑一次要八秒。上线后某个用户点了导出，整个实例的健康检查却开始超时——这段没有任何并发调用的代码，怎么会把毫不相干的接口一起拖住？
    </div>

    <h2>一个事件循环管所有事</h2>
    <p>
      报表导出并不是慢查询，它是<strong>纯计算</strong>：几百万条记录在内存里做聚合、排序、格式化。而 Node.js 有个前提：<strong>一个进程只有一个主线程、只有一个事件循环</strong>，同步代码、网络 I/O、定时器、各种回调都得在这条循环上排队。
    </p>
    <p>
      当那段八秒的计算一开始跑，它就独占了整条循环，别的事情全部插不进来：健康检查进不来、其它接口连轮到的机会都没有。这不是计算本身有多慢，而是「<strong>同步计算占满线程</strong>」这件事和「事件循环要照顾所有人」天生冲突。
    </p>

    <h2>绕开阻塞的旧办法</h2>
    <ul>
      <li>把大计算切成小片，用 <code>setTimeout</code> 一片一片地做——代价是你得手写状态机保存进度，逻辑碎成一地。</li>
      <li>把计算挪到另一个外部服务或命令行工具——凭空多出一套要部署、要监控、还要走网络的组件。</li>
      <li>干脆接受阻塞——平时没事，一遇到大任务，P99 延迟直接炸穿。</li>
    </ul>
    <p>
      三条路都不理想，问题就剩一句：能不能让一段计算离开主线程，跑完再把结果交回来？
    </p>

    <h2>把计算搬进 worker 线程</h2>
    <p>
      能。<code>node:worker_threads</code> 让你把一段代码放进独立线程里执行。做法是把计算逻辑单独写进一个 worker 文件，主线程用 <code>new Worker()</code> 把它拉起来，两边用消息对话：worker 里算完调 <code>postMessage</code> 把结果发回，主线程用 <code>worker.on('message', ...)</code> 收听。
    </p>
    <p>
      它做对的关键一件事，是<strong>计算真的挪到了另一个线程</strong>。主线程的事件循环不再被那段循环占着，健康检查、其它接口该响应照样响应——这正是开场那台实例最缺的能力。选线程而非进程，是因为同进程内的线程共享地址空间，创建与切换都更轻。
    </p>

    <h2>主线程与 worker 的分工</h2>
    <p>
      同一个文件可以两个角色都用：<code>isMainThread</code> 用来区分自己此刻跑在主线程还是 worker 里。主线程这边负责建线程、派活、收结果；worker 那边拿到的初始参数则通过 <code>workerData</code> 传进去，作为计算的输入。
    </p>
    <p>
      因为线程之间<strong>不共享普通内存</strong>，两边只能靠消息来往。这也意味着 worker 有自己的独立内存：想在里面把主线程的一个计数器 <code>count++</code>，主线程那份纹丝不动。要在 worker 里改一个 <code>for</code> 循环共享的变量，或者靠「改一个对象」来传结果，都会落空。
    </p>

    <h2>数据怎么传才不亏</h2>
    <p>
      <code>postMessage</code> 默认走<strong>结构化克隆</strong>，也就是按值做一次深拷贝。拷一份几 MB 的大数组，拷贝本身就可能把主线程拖慢，于是有两条更省的通道：
    </p>
    <ul>
      <li><strong>Transferable</strong>：把一个 <code>ArrayBuffer</code> 的所有权「移交」给 worker。移交之后主线程手里那份就失效了——不复制、几乎零成本，适合「这份数据往后只有 worker 用」。</li>
      <li><strong>SharedArrayBuffer</strong>：真正被多个线程共享的同一块内存，谁都不用传，直接读写即可。代价是要自己用 <code>Atomics</code> 处理并发读写。</li>
    </ul>
    <p>
      另外两条硬约束：函数、类实例的方法、DOM 节点这类东西没法被克隆，塞进消息里会直接抛 <code>DataCloneError</code>；worker 里抛出的异常也不会自动冒泡回主线程的 <code>try/catch</code>，必须监听 worker 的 <code>error</code> 事件，否则任务会静默失败。
    </p>

    <h2>复用线程与适用边界</h2>
    <p>
      每次都 <code>new Worker()</code> 太贵——起一个线程要重新初始化一整套 JS 运行环境，任务若是「高频、单次不大」，光创建开销就可能盖过计算本身。所以真实项目里更常见的是维护一个固定数量的 worker <strong>池</strong>，任务来了排队、派给空闲线程、用完不销毁；<code>Piscina</code> 这类库就是替你把池化这层做掉。
    </p>
    <p>
      再给生命周期收个尾：worker 的 <code>exit</code> 事件告诉你线程结束，<code>terminate()</code> 是最后的兜底——某个计算卡死时强行收掉它，别让它永久占着一条线程。
    </p>
    <div class="lesson-box warn">
      <strong>动手之前先做性能分析：</strong>Worker 只解决「<strong>CPU 密集</strong>」，解决不了 I/O。如果慢在等数据库、等下游接口，那是 I/O 问题——它本来就靠事件循环天然并发，把它挪进 worker 无非是把「等网络」换成「占着一条线程在等」，白白浪费线程。用 profiling 确认瓶颈真的是算力，再谈搬迁。
    </div>

    <h2>阻塞与响应的对比</h2>
    <figure class="lesson-figure">
      <figcaption>左右两个按钮算的是同一段素数；先点「主线程阻塞」，感受计算期间主线程被占住、页面短暂失去响应，再点「Worker 线程」对比同一次计算的响应表现。</figcaption>
      <D16WorkerThreads />
    </figure>

    <h2>把重计算搬离事件循环</h2>
    <p>
      Worker 线程对付的是「单线程事件循环被一段同步计算独占」：把计算搬进独立线程、用消息把结果带回，主线程就始终留得住响应能力。代价是线程之间不共享普通内存，数据要么复制、要么移交所有权、要么共享 <code>SharedArrayBuffer</code>——这条边界同时决定了它只值得用在 CPU 密集的场景。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结构化克隆」</span>是 <code>postMessage</code> 在两个线程之间传数据时所用的复制算法：支持对象、数组、<code>Map</code> / <code>Set</code>、<code>ArrayBuffer</code> 与 TypedArray 等，但<strong>无法克隆函数、类原型方法、DOM 节点与 Symbol</strong>，碰到就抛 <code>DataCloneError</code>。正因为它复制而不共享，worker 之间才不能直接读写对方的普通变量；要免拷贝就用 Transferable 移交 <code>ArrayBuffer</code> 所有权，要双向共享就用 <code>SharedArrayBuffer</code> 并配合 <code>Atomics</code>。
    </div>
  </LessonArticle>
</template>
