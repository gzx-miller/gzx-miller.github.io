const o=`<script setup lang="ts">
import D16WorkerThreads from './D16WorkerThreads.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给接口加了一个「导出全量报表」功能，跑一次要八秒。上线后第一个用户点了导出，整个服务的健康检查开始超时，负载均衡把实例标记成不健康——一个只用一次的功能，把所有人都拖住了。
    </div>

    <h2>主线程计算独占</h2>
    <p>
      报表导出本身不是慢查询，它是<strong>纯计算</strong>：几百万条记录在内存里做聚合、排序、格式化。可你忘了 Node.js 的一个前提——<strong>一个 Node 进程只有一个主线程，也只有一个事件循环</strong>。事件循环既要跑你的同步代码，也要处理网络 I/O、定时器、各种回调。
    </p>
    <p>
      于是当那段八秒的计算开始跑，事件循环被它一个人占满，其它事情全部排队：健康检查请求进不来，别的接口连轮到的机会都没有。你以前试图绕过这件事，无非三条路：
    </p>
    <ul>
      <li>把大计算切成小片，用 <code>setTimeout</code> 一片一片做——你得手写状态机保存进度，逻辑碎成一地。</li>
      <li>把计算挪到另一个外部服务或命令行工具里——多了一套要部署、要监控、还要走网络的组件。</li>
      <li>干脆接受阻塞——平时没事，一到大任务，P99 延迟直接炸穿。</li>
    </ul>
    <p>
      三条路都不想走，问题就剩一句：<strong>能不能让一段计算离开主线程，但结果还能拿回来？</strong>
    </p>

    <h2>工作线程使用</h2>
    <p>
      能。<code>worker_threads</code> 让你把一段代码放进独立线程里跑。把计算逻辑单独写进一个 worker 文件，主线程用 <code>new Worker('./worker.js')</code> 把它拉起来，两边用消息说话。
    </p>
    <p>
      这个方案做对了一件最关键的事：<strong>计算真的搬到了另一个线程</strong>。主线程的事件循环不再被那段循环占着，健康检查、其它接口该响应就响应。worker 里算完，把结果 <code>postMessage</code> 回主线程；主线程监听 <code>message</code> 事件收到结果，再决定怎么回给用户。
    </p>
    <div class="lesson-box hint">
      <strong>为什么是线程不是进程：</strong>同一个进程内的线程共享进程地址空间，创建与切换都比进程轻；代价是它们<strong>仍然不能共享普通变量</strong>，见下一段。
    </div>

    <h2>创建线程开销</h2>
    <ul>
      <li>每次都 <code>new Worker()</code> 太贵：起一个线程要重新初始化一整套 JS 运行环境。如果任务是「高频、单次不大」，光创建开销就可能超过计算本身。</li>
      <li>想在 worker 里改主线程的一个计数器，做不到。worker 有<strong>自己独立的内存</strong>，你在里面 <code>count++</code>，主线程那个 <code>count</code> 纹丝不动。</li>
      <li>传一个几 MB 的大数组过去，<code>postMessage</code> 会做一次<strong>结构化克隆</strong>——按值深拷贝。数据越大拷贝越慢，反而可能把主线程也拖住。</li>
      <li>worker 里抛出的异常不会自动回到主线程的 <code>try/catch</code>，必须监听 worker 的 <code>error</code> 事件，否则任务静默失败。</li>
      <li>消息里只要带了函数、类实例的方法或 DOM 节点，直接抛 <code>DataCloneError</code>，克隆算法只认「可复制的数据」。</li>
    </ul>

    <h2>线程池与数据传递</h2>
    <p>
      先补<strong>复用</strong>。既然创建线程贵，那就别每次新建——维护一个固定数量的 worker 池，任务来了排队、派给空闲的线程，用完不销毁。<code>Piscina</code> 这类库就是替你把这层池化做掉。之所以先补它，是因为真实业务里的 CPU 计算往往「高频、单次不大」，创建开销才是最吃时间的那一块。
    </p>
    <p>
      再补<strong>大数据的传递方式</strong>。结构化克隆本质是「复制」，复制大对象就一定带着代价，于是有两种更省的通道：
    </p>
    <ul>
      <li><strong>Transferable</strong>：把一个 <code>ArrayBuffer</code> 的所有权「转移」给 worker，转移之后主线程手里那份就失效了——不拷贝，零成本，适合「这份数据之后只有 worker 用」的场景。</li>
      <li><strong>SharedArrayBuffer</strong>：真正被多个线程共享的内存，谁都别传，直接读写同一块。代价是你得自己用 <code>Atomics</code> 处理并发读写。</li>
    </ul>
    <p>
      接着补<strong>生命周期与错误</strong>。worker 的 <code>error</code> 事件捕获线程内未处理的异常，<code>exit</code> 事件告诉你线程结束；<code>terminate()</code> 是最后的兜底，处理超时就强行收掉，别让一个卡死的计算永久占着一条线程。
    </p>
    <p>
      最后记住一条判断边界：<strong>Worker 适合 CPU 密集，不适合 I/O 密集</strong>。I/O 等待本来就靠事件循环天然并发，你把它塞进 worker，无非是把「等网络」换成「占着一条线程在等」，白白浪费线程。
    </p>
    <div class="lesson-box warn">
      <strong>诊断顺序别搞反：</strong>动手之前先用性能分析确认瓶颈<strong>真的是 CPU 密集</strong>。如果慢在等数据库、等下游接口，那是 I/O 问题，加 worker 不但没用，还会因为线程变多让内存和调度更糟。
    </div>

    <h2>阻塞与响应对比</h2>
    <figure class="lesson-figure">
      <figcaption>左右两个按钮算的是同一段素数；先点「主线程阻塞」，感受计算期间主线程被占住、页面短暂失去响应，再点「Worker 线程」对比同一次计算的响应表现。</figcaption>
      <D16WorkerThreads />
    </figure>

    <h2>重计算任务搬迁</h2>
    <p>
      Worker 线程解决的是「单线程事件循环被一段同步计算独占」的问题：把计算搬进独立线程，用消息把结果拿回来，主线程始终留得住响应能力。代价是线程之间不共享普通内存，数据要么复制、要么转移所有权、要么共享 <code>SharedArrayBuffer</code>——这条边界决定了它只值得用在 CPU 密集场景。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结构化克隆」</span>是 <code>postMessage</code> 在两个线程之间传递数据时使用的复制算法：支持对象、数组、<code>Map</code>/<code>Set</code>、<code>ArrayBuffer</code> 与 TypedArray 等，但<strong>无法克隆函数、类原型方法、DOM 节点和 Symbol</strong>，遇到就抛 <code>DataCloneError</code>。正因为它是复制而非共享，worker 之间才不能直接读写对方的普通变量；要免拷贝就用 Transferable 转移 <code>ArrayBuffer</code> 所有权，要双向共享就用 <code>SharedArrayBuffer</code> 并配合 <code>Atomics</code>。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
