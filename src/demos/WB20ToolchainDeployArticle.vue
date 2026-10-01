<script setup lang="ts">
import WB20ToolchainDeploy from './WB20ToolchainDeploy.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你照教程把一段 C 代码用 Emscripten 编译出来，输出目录里除了 <code>.wasm</code>，还躺着一个同名 <code>.js</code>，开了线程的话还多一个 worker 脚本——你不知道该把哪些传上 CDN；换成 Rust 用 <code>wasm-pack build</code>，又冒出一个 <code>pkg/</code> 目录，里面 <code>.js</code>、<code>.wasm</code>、<code>.d.ts</code> 一应俱全。同样是「编译成 Wasm」，为什么不同工具链产出的文件长得完全不一样，上线时我到底要交付哪些？
    </div>

    <h2>提出问题</h2>
    <p>
      因为 Wasm 从来不是「一个文件」，而是<strong>一包产物</strong>。Wasm 的运行时模型很克制：它只有整数、浮点和一块线性内存，<strong>没有字符串、没有对象、也不能直接碰 DOM</strong>。任何真实业务都要用到这些东西，于是工具链不得不额外生成一层 JS「<strong>胶水</strong>」，把 Wasm 的能力翻译给前端世界。不同语言、不同工具链需要翻译的东西多寡不同，产出的文件自然就不一样。
    </p>
    <p>
      旧认知的隐藏成本就在这里：你以为产物只有一个 <code>.wasm</code>，于是<strong>只把 <code>.wasm</code> 传上线，漏掉了胶水 JS，页面直接报错</strong>；你不知道 CDN 要为它配什么响应头，<code>instantiateStreaming</code> 因 MIME 不对被拒；你也分不清「模块（Module）」和「实例（Instance）」，不知道同一份产物能不能安全地加载多次。问题于是收敛成一句：<strong>从源码到线上，一份 Wasm 应用到底经过哪几步、每一环产出什么文件、上线交付哪些、服务器又要配什么？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      走最短的链路：手写一段 WAT，用 <code>wat2wasm</code> 编译出一个 <code>.wasm</code>，前端 <code>fetch</code> 回来交给 <code>instantiateStreaming</code> 加载，调用导出的函数。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「源码 → 二进制 → 可调用的实例」这条最短链路完整打通了，而且产物只有一个文件</strong>。理解了这一条，后面所有的「胶水」都只是围绕它做的补全。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>真实业务几乎不可能手写 WAT：字符串处理、结构体、内存分配、和 DOM 或 JS 的交互，用底层指令写一遍的成本和风险都高得离谱。</li>
      <li>一旦换成 C/C++ 或 Rust，工具链就会<strong>额外产出 JS 胶水</strong>，产物从一个文件变成一包，你得先知道每个文件扮演什么角色，才不会漏传。</li>
      <li>若用 <code>-pthread</code> 开了线程，还会多出 <strong>Worker 脚本</strong>，并连带依赖共享内存与 COOP/COEP 响应头，部署面一下子变宽。</li>
      <li>服务器 MIME 配错，<code>instantiateStreaming</code> 会拒绝加载；打包器也未必认识 <code>.wasm</code>，需要单独配置成静态资源规则。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补<strong>编译这一步的运行原理，再逐一看各工具链的产出形态</strong>。链路本身是一样的：源码 → 编译器 → <code>.wasm</code> → <code>compile</code> 得到 Module → <code>instantiate</code> 注入导入得到实例 → 随静态资源部署。差别全在「用哪条工具链」上。
    </p>
    <ol class="lesson-steps">
      <li>写源码：C/C++、Rust、AssemblyScript，或手写 WAT。</li>
      <li>用 <code>clang</code>、<code>rustc</code>、<code>asc</code> 或 <code>wat2wasm</code> 编译成 <code>.wasm</code>。</li>
      <li>用 <code>WebAssembly.instantiateStreaming</code> 边下载边编译并实例化。</li>
      <li>调用 <code>exports.add</code> 等导出的函数，最后随静态资源部署上线。</li>
    </ol>
    <p>
      具体到产物，值得把三条常见路径对照着记。<strong>WAT 走 <code>wat2wasm</code></strong>：直出单个 <code>.wasm</code>，最干净，适合学习与最小示例。<strong>C/C++ 走 Emscripten（<code>emcc</code>）</strong>：除了 <code>.wasm</code>，还会生成一个 JS 胶水，负责初始化内存、提供导入（如 <code>env</code>）、把 C 函数映射成模块的 <code>exports</code>；一旦加 <code>-pthread</code>，还会多出 worker 脚本，并要求页面处于跨源隔离。<strong>Rust 走 <code>wasm-bindgen</code></strong>：它额外生成一层 JS 绑定，专门解决「Wasm 只认数字」这件事——字符串、数组、结构体过边界时的编解码都由这层完成；再上一层的 <code>wasm-pack build</code> 会把这一切收进 <code>pkg/</code> 目录，除了 <code>.js</code> 与 <code>.wasm</code>，还附上 <code>.d.ts</code> 类型声明，让前端可以直接按 ES 模块引入。AssemblyScript 则用 <code>asc</code>，语法接近 TypeScript，同样直出 <code>.wasm</code> 并配套加载器。
    </p>
    <div class="lesson-box hint">
      <strong>一句话抓住重点：</strong>胶水 JS 不是「多余的东西」，它是把 Wasm「只有数字和线性内存」这块短板补齐的翻译层。语言越靠近前端（如 AssemblyScript）、逻辑越简单（如纯 WAT），需要的胶水越少；语言越底层、越要碰字符串和宿主对象（如 C++、Rust 调 DOM），胶水就越多、越重要。
    </div>
    <p>
      再补<strong>「模块」与「实例」的区分，它直接决定怎么部署和复用</strong>。<code>WebAssembly.compile</code> 得到的是一个 <code>WebAssembly.Module</code>——<strong>不可变、与运行时状态无关</strong>；<code>instantiate</code> 注入导入、生成的是实例，实例才带内存和全局变量。所以<strong>同一份产物可以安全地实例化多次，各自互不干扰</strong>——这正是上一课「多个 Worker 各自实例化同一份模块」的前提，也是缓存复用的基础：把编译好的 Module 存起来，下次直接实例化，跳过编译。
    </p>
    <p>
      再补<strong>上网前的两个网络要素</strong>。第一是 <strong>MIME</strong>：服务器必须以 <code>application/wasm</code> 返回 <code>.wasm</code>，否则 <code>instantiateStreaming</code> 会拒绝加载，退回到需要完整 ArrayBuffer 的 <code>instantiate</code>。第二是<strong>缓存</strong>：生产环境推荐用 <code>instantiateStreaming</code> 做流式加载，同时给 <code>.wasm</code> 配内容哈希文件名加长缓存，或把 Module 缓存进 <code>IndexedDB</code>，让二次访问免去重复编译。若产物依赖线程或共享内存，还要额外配上 COOP/COEP。
    </p>
    <p>
      最后补<strong>与打包器对接</strong>。多数场景下 <code>.wasm</code> 不作为 JS 模块被引入，而是当作<strong>静态资源</strong>：由打包器拷贝到输出目录并给出一个 URL，你在运行时 <code>fetch</code> 它；也可以借助 <code>vite-plugin-wasm</code> 这类插件把加载都替你处理掉。而 Emscripten 或 <code>wasm-pack</code> 生成的<strong>胶水 JS 则按普通的 ES 模块引入</strong>，它会自己去加载同目录的 <code>.wasm</code>——这也是为什么这些文件必须一起部署、且相对路径要对上。
    </p>
    <div class="lesson-box warn">
      <strong>三个最常见的上线事故：</strong>其一，只部署了 <code>.wasm</code>，漏掉工具链生成的胶水 JS，页面加载即报错；其二，服务器 MIME 没配成 <code>application/wasm</code>，<code>instantiateStreaming</code> 被拒，你却在本地开发服务器上「一切正常」；其三，用了 <code>-pthread</code> 线程产物，却忘了配 COOP/COEP，线程直接起不来。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>照着上图五步的进度走一遍：它演示了一条完整的「源码 → 编译器 → 二进制 → 编译为 Module → 实例化 Instance → 部署调用」链路，最后用 <code>instantiateStreaming</code> 边下载边编译，并调用 <code>add(2, 3)</code> 返回结果。留意顶部那个「模块体积」标记——它提醒你，这一环产出的字节数，正是上一课要优化的对象。</figcaption>
      <WB20ToolchainDeploy />
    </figure>

    <h2>总结</h2>
    <p>
      一份 Wasm 应用的链路是「源码 → 编译器 → <code>.wasm</code> → <code>compile</code> 得 Module → <code>instantiate</code> 得实例 → 部署」。不同工具链的产物形态不同，差别全在胶水层：WAT 最干净，Emscripten 会带一个 JS 胶水（开线程再加 worker 脚本），Rust 的 <code>wasm-bindgen</code> 加 <code>wasm-pack</code> 会产出一个含 <code>.js</code>、<code>.wasm</code>、<code>.d.ts</code> 的 <code>pkg/</code> 目录。交付时要<strong>整包一起部署</strong>，服务器配好 <code>application/wasm</code> 与缓存，用 <code>instantiateStreaming</code> 加载；并牢记 Module 不可变、实例才带状态，同一份产物可被安全地多次实例化。
    </p>
    <div class="lesson-term">
      <span class="term-name">「胶水代码（glue code）」</span>指工具链在 <code>.wasm</code> 之外额外生成的 JS 层，用来弥补 WebAssembly 只支持整数、浮点与线性内存，无法直接处理字符串、对象与 DOM 的短板：它负责内存初始化、提供导入（如 <code>env</code>）、对字符串与结构体做跨边界编解码，并把宿主能力暴露给模块。边界与例外：手写 WAT 或简单场景的产物可以几乎没有胶水；Emscripten 生成单个 JS 胶水（开 <code>-pthread</code> 时另加 worker 脚本），Rust 的 <code>wasm-bindgen</code> 与 <code>wasm-pack</code> 则会产出一个含 <code>.js</code>、<code>.wasm</code>、<code>.d.ts</code> 的 <code>pkg/</code> 目录；部署时必须与 <code>.wasm</code> 一起交付并保持相对路径一致，否则实例化会因缺少导入而失败。
    </div>
  </LessonArticle>
</template>
