<script setup lang="ts">
import WB16MultiThreading from './WB16MultiThreading.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给一张 4K 图片做批量滤镜，把重活交给了 Wasm，结果点下按钮的瞬间页面整个冻住，滚动条都拖不动；你以为是没并行，于是开 4 个 Worker 想提速，可在这台 8 核机器上总耗时只快了不到 2 倍——为什么「用了 Wasm」和「开了多线程」这两件事，都没拿到你预期的那几倍速度？
    </div>

    <h2>单线程执行事实</h2>
    <p>
      先说清一个容易被宣传语盖住的事实：<strong>Wasm 模块本身是单线程执行的</strong>。一个实例永远只跑在一个线程上，你把它放进主线程，它就老老实实占住主线程；单核的活儿，谁跑都变不出并行。真正让你用上多核的不是 Wasm，而是<strong>把多个 Wasm 实例分别放进多个 Web Worker</strong>——每个 Worker 是一个独立线程，各自实例化同一份模块，同时开工。
    </p>
    <p>
      可一旦真去开多线程，旧办法的隐藏成本全冒了出来：直接在主线程里算，<strong>UI 被整段计算堵死</strong>，用户以为页面崩了；只开一个 Worker，<strong>八核里只用一核</strong>，加速比封顶在 1；随手 <code>new Worker</code> 一开一大堆，<strong>每个线程都要重新下载并编译同一份 .wasm</strong>，这份编译开销还没算进总账；而如果这些线程要协同处理<strong>同一份数据</strong>，默认的 Worker 之间根本不共享内存，只能靠 <code>postMessage</code> 把大数组来回拷贝，拷贝的代价常常比计算还大。问题于是收敛成一句：<strong>怎么把 N 个 Worker 组织成一个可复用的线程池，让同一份 Wasm 模块在每个线程里各自实例化、共享同一块内存，协同把一件活干完？</strong>
    </p>

    <h2>计算移入工作线程</h2>
    <p>
      最朴素但真能跑的做法：把那段计算从主线程里整段搬进<strong>一个</strong> Worker。主线程只负责发任务、收结果，计算全在线程内部完成。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把计算和 UI 分到了两个线程</strong>。主线程腾出手来继续响应点击、继续渲染，那个转圈的进度条终于能动了。当计算量不大、也不急着变快时，单 Worker 就是够用的。
    </p>

    <h2>单核利用瓶颈</h2>
    <ul>
      <li>单 Worker 只占用一个核，任务再重也<strong>用不到机器剩下的核</strong>，总耗时不会随核数变短。</li>
      <li>每个显式创建的 Worker 都要<strong>重新获取并编译同一份 .wasm</strong>，模块越大、开的线程越多，这份重复编译的固定开销越显眼。</li>
      <li>Worker 之间默认<strong>不共享内存</strong>，想让它们一起写同一份数据，只能 <code>postMessage</code> 整个数组拷来拷去，大数组光拷贝就很贵。</li>
      <li>真去共享内存时会撞上环境墙：页面没有启用<strong>跨源隔离</strong>（COOP/COEP 响应头）时，<code>SharedArrayBuffer</code> 根本创建不出来，<code>self.crossOriginIsolated</code> 是 <code>false</code>。</li>
      <li>手写的 Worker 创建、消息往返与回收散在各处，任务一多就难管，退出页面还容易留下没 <code>terminate</code> 的线程。</li>
    </ul>

    <h2>线程池的预建</h2>
    <p>
      先补<strong>线程池</strong>。不再「来一个任务开一个 Worker」，而是启动时按核数预建一批常驻 Worker，数量取 <code>navigator.hardwareConcurrency</code>（别超过它，超了只是排队，收益递减）。每个 Worker 内部<strong>只实例化一次</strong>模块并常驻等待任务，主线程把活切成片分发给池子，干完不销毁、下个任务继续用。这样既吃满了多核，又把重复编译的开销摊平到整个会话。
    </p>
    <p>
      接着补<strong>共享内存这条数据通路</strong>。与其让每个 Worker 各自带一份内存、靠拷贝对不齐进度，不如让主线程先建一块 <code>SharedArrayBuffer</code>，把它作为内存注入到每个 Worker 各自的实例里——于是 N 个线程读写的是<strong>同一块内存的同一批地址</strong>，大数组不再来回复制。这里只需记住与线程池直接相关的边界：这块内存要在模块里声明为 <code>shared</code>，且 <code>min = max</code>、<strong>不可增长</strong>，容量得在开工前定死。（它内部怎样保证不丢更新是原子指令的事，本课不展开。）
    </p>
    <p>
      再往下，得看你<strong>编译产物走的是哪条路</strong>，这决定了线程是谁帮你开的。如果你用 C/C++ 且代码里用了 <code>pthread</code>，Emscripten 要加 <code>-pthread</code>（旧写法 <code>-s USE_PTHREADS=1</code>）；它会把创建线程、锁、条件变量这些都编译进 Wasm，生成的是一份<strong>依赖线程特性、内部会去拉起 Worker 并共享内存</strong>的产物，和单线程版本完全不是一回事。如果你手写 WAT 或用 Rust，则要显式打开线程与共享内存：给 Wasm 目标加上 <code>atomics</code>、<code>bulk-memory</code> 特性，并让链接器产出 <code>shared</code> 内存段。走错产物形态，会得到一个看起来能跑、却永远只用单核的假线程版。
    </p>
    <p>
      然后补<strong>两组必须同时满足的环境前提</strong>。模块侧：内存标了 <code>shared</code>；页面侧：必须处于跨源隔离状态，也就是响应头同时带上 <code>Cross-Origin-Opener-Policy: same-origin</code> 与 <code>Cross-Origin-Embedder-Policy: require-corp</code>，此时 <code>self.crossOriginIsolated</code> 才会是 <code>true</code>，<code>SharedArrayBuffer</code> 才可用。少任何一个，要么内存不是共享的，要么连 Worker 都跑不起来。
    </p>
    <div class="lesson-box warn">
      <strong>两个高频误区：</strong>其一，以为「用了 Wasm 就自动并行」——不是，单个实例永远单线程，并行来自「多实例 + 多 Worker」；其二，以为「代码里写了 pthread 就多线程」——不是，编译时没开线程特性，那些 pthread 调用会被降级成空壳，产物照样单核跑。另外，开了 <code>COEP: require-corp</code> 之后，页面里原来能加载的跨源图片、脚本会因为没有 CORP 头而被拦下，这是跨源隔离最常见的连带回归。
    </div>
    <p>
      最后补<strong>通信的顺手程度</strong>。主线程与 Worker 之间来回 <code>postMessage</code>、手动对 requestId 的写法很啰嗦，真实项目里常用 <code>comlink</code> 这类库把它包成「像调用普通函数一样」，省掉手写消息协议；至于「所有 Worker 都干完了吗」，用一个完成计数器汇总，收齐 N 个完成信号后再去读共享内存里的最终值，对比预期即可。
    </p>

    <h2>并发补货对账</h2>
    <figure class="lesson-figure">
      <figcaption>设好「店员数」和「每人补货次数」，点「并发补货」：看每个 Worker 各自实例化模块、并发开工并回报完成，最终共享库存精确等于「店员数 × 次数」。若顶部出现跨源隔离的警告，说明当前页面没开启 COOP/COEP，<code>SharedArrayBuffer</code> 不可用，这个并发演示就跑不起来——这正好印证了它有多依赖那两组响应头。</figcaption>
      <WB16MultiThreading />
    </figure>

    <h2>多实例并行方案</h2>
    <p>
      Wasm 自己不并行，并行靠的是把「多个实例」分发到「多个 Worker」。要做成可复用的能力，就得预建线程池、让每个线程各自实例化一次模块、让它们共享同一块内存来省掉拷贝；而这一切的地基是跨源隔离——没有 COOP/COEP，共享内存和线程池都无从谈起。编译产物也要对：pthread 或线程特性没开，写再多 Worker 组织代码也只是单核在跑。
    </p>
    <div class="lesson-term">
      <span class="term-name">「跨源隔离（cross-origin isolation）」</span>指页面通过响应头 <code>Cross-Origin-Opener-Policy: same-origin</code> 与 <code>Cross-Origin-Embedder-Policy: require-corp</code> 声明自己与外界隔离，从而解锁需要 <code>SharedArrayBuffer</code> 的能力（多线程、高精度计时等），此时 <code>self.crossOriginIsolated</code> 为 <code>true</code>。边界与例外：两个响应头缺一不可；开启后页面内的跨源资源必须带跨域资源策略（CORP）头或走 CORS 与凭证，否则会被拦截；<code>COEP</code> 还可用 <code>credentialless</code> 放宽无凭证的跨源请求。
    </div>
  </LessonArticle>
</template>
