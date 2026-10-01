<script setup lang="ts">
import WB19Performance from './WB19Performance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把 PDF 工具里的一段解析算法换成 Wasm，本地测执行快了 3 倍，于是安心上线。结果用户抱怨「第一次打开要转好几秒按钮才出来」——你打开 Network 面板，那个 <code>.wasm</code> 有 2.6 MB，而且下载完之后还有一段肉眼可见的「编译中」停顿。一个明明让<strong>执行</strong>更快的技术，为什么反而让页面的<strong>第一次可用</strong>变得这么慢？
    </div>

    <h2>三段性能构成</h2>
    <p>
      问题出在把「性能」当成了一个数。<strong>用户感知的性能其实是三段时间之和：下载 + 编译 + 执行。</strong>你量的只是最后一段，还被本地的高性能机器和缓存掩盖了前两段。旧认知的隐藏成本有三层：只在本地量执行耗时，忽略了用户第一次要<strong>先等下载、再等编译</strong>；以为「Wasm 快」就该全面替换 JS，却没分清哪些是<strong>一次性的启动成本</strong>、哪些是<strong>每次调用都要付的成本</strong>；也不知道优化等级和加载方式会同时改变体积与首屏时间。
    </p>
    <p>
      于是问题收敛成一句：<strong>怎么把 Wasm 的体积和「从下载到可用」这段时间压下来，同时不牺牲真正跑起来之后的执行速度？</strong>
    </p>

    <h2>即时编译流程</h2>
    <p>
      最直接的写法：<code>fetch</code> 回一个 <code>ArrayBuffer</code>，交给 <code>WebAssembly.instantiate</code> 编译并实例化，然后调用导出的函数。
    </p>
    <p>
      这个方案做对了一件事：<strong>它是一条完整、正确的链路</strong>——一段字节进去，一个可调用的实例出来，功能上没有任何缺口。后面所有优化都建立在它之上，也都要拿它当对照基线。
    </p>

    <h2>包体膨胀原因</h2>
    <ul>
      <li>产出的 <code>.wasm</code> 可能<strong>比预估大得多</strong>：默认优化等级下，没被调用的函数、调试段、为通用性保留的代码都还在里面，几百 KB 到几 MB 都常见。</li>
      <li><code>instantiate</code> 必须<strong>等整个 ArrayBuffer 下载完</strong>才能开始编译，下载和编译两段时间是<strong>串行相加</strong>的，用户在中间干等。</li>
      <li>每次进页面都<strong>重新编译一遍</strong>同一份模块，而编译结果本身是不变的，等于把上一次的劳动白白扔掉。</li>
      <li><strong>拿执行耗时选型会误导</strong>：一段算法跑得快，不代表用户第一次看到界面快；两笔账混在一起，就会做出「越快越慢」的上线决定。</li>
    </ul>

    <h2>编译器优化等级</h2>
    <p>
      先补<strong>最上游、也最有效的一环——编译器的优化等级</strong>。C/C++ 用 <code>-O3</code> 让编译器把内联、循环优化、自动向量化都做上；Rust 则用 <code>--release</code> 并把 <code>opt-level</code> 调到 <code>3</code>（或按体积折中取 <code>"s"</code>）。这一步直接决定了产物的体积与执行速度取向，是后面所有手段的地基。
    </p>
    <p>
      接着补<strong>在编译器之上再过一遍 <code>wasm-opt</code>（Binaryen）</strong>。它针对 <code>.wasm</code> 再做死代码消除、内联、常量折叠，能把<strong>用不到的导出和函数真正砍掉</strong>。同样用它，方向可以选：偏体积用 <code>-Oz</code>，偏速度用 <code>-O3</code>。首屏敏感的模块按体积优化，重计算的模块按速度优化，得分开定，不能一刀切。
    </p>
    <p>
      再补<strong>裁剪导出与调试信息</strong>。Wasm 里「导出即保留」，所以只导出真正要从 JS 调用的那几个函数，其余留着就会一起被打包；上线构建把名称表和调试段 <code>strip</code> 掉，体积还能再降一截。
    </p>
    <p>
      然后补<strong>改变加载方式：改用 <code>WebAssembly.instantiateStreaming</code></strong>。它直接接受 <code>fetch</code> 回来的 <code>Response</code>，<strong>一边下载一边编译</strong>，让这两段本应相加的时间<strong>重叠</strong>起来，比「等 ArrayBuffer 下载完再 <code>instantiate</code>」明显要快。但它有个硬前提：服务器必须返回正确的 MIME <code>application/wasm</code>，否则它会直接拒绝，你就得回退到 <code>instantiate</code>——这也是很多人「以为用了流式、其实没有」的原因。
    </p>
    <p>
      再补<strong>缓存编译结果</strong>。<code>WebAssembly.compile</code> 产出的 <code>WebAssembly.Module</code> 是<strong>不可变、且可结构化克隆</strong>的，可以放进 <code>IndexedDB</code> 缓存；用户再次访问时把它取出来直接 <code>instantiate</code>，<strong>整段编译跳过</strong>，首屏只剩下下载或读缓存。到这一步，「启动时间」这笔账基本就压到位了。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易配错的地方：</strong>其一，别为了体积把重计算模块也一律改成 <code>-Oz</code>——有些模块在 <code>-Oz</code> 下执行会明显变慢，省下的几十 KB 换不回用户多等的计算时间，要按模块分别定位；其二，<code>instantiateStreaming</code> 对 MIME 非常敏感，服务器没配好 <code>application/wasm</code> 时它会静默回退或直接失败，务必在真实响应头下验证，而不是只看本地开发服务器。
    </div>
    <p>
      最后回到「执行」这另一半账。前面解决的是「第一次要等多久」，而「跑起来之后快不快」是另一回事：Wasm 是预编译的字节码，执行路径接近机器码、更可预测；JS 依赖 JIT 对热点做内联和优化，<strong>需要预热</strong>。所以测量执行耗时要<strong>先预热、再多次取样取最小值</strong>，剔除 JIT 的波动，否则结论会被单次抖动带偏。还有一个每次调用都要付的成本别忘了：<strong>跨 Wasm/JS 边界有固定开销</strong>，小函数被高频调用反而更慢，所以优化的方向是尽量<strong>把计算留在模块内部</strong>，而不是频繁跨边界来回。
    </p>

    <h2>预热取样对比</h2>
    <figure class="lesson-figure">
      <figcaption>调整 <code>fib</code> 参数和「取样次数」，点「重新测量」：它会先预热再跑多次、只取最小耗时，用柱状图对比 Wasm 与 JS，并校验两版结果一致。注意这里量的是<strong>执行阶段</strong>的耗时——而且刻意用「取最小值」排掉了 JIT 波动。心里要清楚：用户第一次打开时，在这根柱子出现之前，已经先付了「下载 + 编译」那一段，那正是这节课要你优化的部分。</figcaption>
      <WB19Performance />
    </figure>

    <h2>启动时间优化链</h2>
    <p>
      性能不是「跑得多快」，而是「下载 + 编译 + 执行」三段时间之和。要压启动时间，从上游到下游依次是：<code>-O3</code> 或 Rust release 定基调，<code>wasm-opt</code> 消死代码并按 <code>-Oz</code> 或 <code>-O3</code> 定取向，裁剪导出与调试信息，再用 <code>instantiateStreaming</code> 把下载与编译重叠、用 <code>WebAssembly.Module</code> 加 <code>IndexedDB</code> 跳过二次编译。执行这一半则要预热取样、取最小值，并记住跨边界调用有固定开销——把计算留在模块内。
    </p>
    <div class="lesson-term">
      <span class="term-name">「流式实例化（WebAssembly.instantiateStreaming）」</span>指直接接收 <code>fetch</code> 返回的 <code>Response</code>，在下载字节流的同时进行编译并实例化，使下载与编译两段时间<strong>重叠</strong>，优于「先等 ArrayBuffer 全部下载、再 <code>instantiate</code>」的串行方式。边界与例外：它要求响应头 <code>Content-Type</code> 为 <code>application/wasm</code>，否则会拒绝，需回退到 <code>WebAssembly.instantiate</code>；编译结果 <code>WebAssembly.Module</code> 不可变且可结构化克隆，可存入 <code>IndexedDB</code> 缓存以跳过后续编译；它只优化「加载与启动」，不影响执行速度，执行侧仍需预热取样，并注意跨边界调用的固定开销。
    </div>
  </LessonArticle>
</template>
