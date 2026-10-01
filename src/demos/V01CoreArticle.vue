<script setup lang="ts">
import V01Core from './V01Core.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>新同事克隆完仓库敲下 <code>npm run dev</code>，两秒不到页面就开了；你随后敲 <code>npm run build</code>，进度条却跑了半分钟才结束——同一个工具，为什么启动快得离谱、打包又慢得像在干活？
    </div>

    <h2>整图重建的开销</h2>
    <p>
      你接手一个已经很大的前端项目，光源码目录就有几千个模块。用传统打包器时，每次改一行代码都要先把整张依赖图重新打成一个 bundle，冷启动按秒计，改得越多等得越久。真正折磨人的不是第一次启动，而是<strong>它把「打包」这件事排在了你写代码之前</strong>：你只是想看一个按钮的颜色，却要为整个项目的打包时间买单。
    </p>
    <p>
      更麻烦的是，这些成本都得由人扛：依赖图越大启动越慢、改一行触发全量重编译、日常开发的时间被机器吃掉。根子在于传统工具只把源码当成「构建的输入」——它预设了必须先打包，浏览器才能运行。可浏览器真的需要你替它打包吗？<strong>能不能让浏览器自己按需取用源码？</strong>
    </p>

    <h2>源码直出浏览器</h2>
    <p>
      顺着这个问句往下想，最朴素的做法是：干脆不打包，把源码原样交给浏览器。现代浏览器早就原生支持 ES 模块，你在文件里写 <code>import</code>，它自己就会去请求那个模块。于是启动时服务器不做任何编译，<strong>模块按需加载，用到哪个才请求哪个</strong>。
    </p>
    <p>
      这个方案做对了一件事：<strong>放开了「先打包再运行」这个并不必要的前置依赖</strong>。冷启动因此不再随项目规模增长，改一个文件也只需要重新处理那一个文件。
    </p>

    <h2>裸模块名盲区</h2>
    <ul>
      <li>浏览器不认识「裸模块名」：你在源码里写 <code>import { ref } from 'vue'</code>，浏览器不知道 <code>vue</code> 该去哪里找，直接抛 <code>Failed to resolve module specifier</code>。</li>
      <li>浏览器不认识 <code>.vue</code> 和 <code>.ts</code>：这些不是它能执行的文件类型，原样返回只会得到语法错误。</li>
      <li>依赖包动辄包含成百上千个小文件，逐个发请求会把网络压垮，开发服务器自己也可能被请求风暴拖死。</li>
      <li>生产环境不能沿用这套：让每个用户按需拉几百个请求，首屏体验会很差。</li>
    </ul>

    <h2>依赖预构建补位</h2>
    <p>
      不推翻「源码直接交给浏览器」，而是按顺序补掉它跑不通的地方。第一个要解决的是「裸模块名找不到」，因为那是页面上第一个报错。Vite 启动时会用 esbuild 把依赖预先处理一遍，并把源码里的 <code>import 'vue'</code> 改写成指向 <code>/node_modules/.vite/deps/vue.js</code> 的真实路径——这一步就是<strong>依赖预构建</strong>，只在依赖或锁文件变化时重做一次。
    </p>
    <p>
      第二个要解决的是「浏览器不认识 <code>.vue</code> / <code>.ts</code>」。既然浏览器只认 JS，服务器就在这个请求上<strong>即时编译</strong>：请求 <code>/src/App.vue</code>，Vite 当场把它编译成 JS 模块再返回。<span class="lesson-kv">只编译被请求到的那一个模块</span>，而不是整个项目，这才是冷启动快的原因。
    </p>
    <ol class="lesson-steps">
      <li>浏览器发起 <code>&lt;script type="module"&gt;</code>，向开发服务器请求入口模块。</li>
      <li>Vite 拦截请求，遇到裸模块名就改写为预构建后的依赖路径。</li>
      <li>遇到 <code>.vue</code> / <code>.ts</code> 等非 JS 文件，按需即时编译成 ESM 返回。</li>
      <li>浏览器解析到这个模块的 <code>import</code>，再发起下一批请求，如此逐层展开。</li>
    </ol>
    <p>
      但开发阶段跑通了，生产阶段却不能照搬。生产环境里用户隔着网络，几百个模块请求是灾难，而且没有 Tree Shaking、没有压缩、也没有代码分割。于是 Vite 在构建阶段切换成<strong>另一个引擎</strong>：用 Rollup 把整个依赖图打好包，做 Tree Shaking 剔除死代码、做代码分割、做压缩，输出到 <code>dist/</code>。
    </p>
    <p>
      到这里整个工具的形状才清晰：<strong>Vite 不是一个打包器，而是开发与生产两套引擎挂在同一份配置上</strong>。开发用原生 ESM 加按需编译换速度，生产用 Rollup 换体积与兼容性。你写的那份 <code>vite.config.ts</code>，同时驱动这两条链路。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>说「Vite 开发时完全不打包」并不准确——依赖会被预构建，只是你的源码不打包。预构建是一次性成本，<span class="lesson-kv">冷启动不受项目规模影响，代价是首次启动多一次依赖预构建</span>。
    </div>
    <div class="lesson-box hint">
      <strong>部署前先验证：</strong><code>npm run build</code> 之后用 <code>vite preview</code> 以生产行为跑一遍 <code>dist/</code>。开发服务器和生产产物的行为可能不同，别等到上线才发现。
    </div>

    <h2>引擎对比与配置</h2>
    <figure class="lesson-figure">
      <figcaption>在三个页签间切换：先看核心概念卡片，再对着对比表看 Vite 与 Webpack 在启动、HMR、冷启动上的差距，最后读一眼驱动两个引擎的那份配置长什么样。</figcaption>
      <V01Core />
    </figure>

    <h2>开发阶段免打包</h2>
    <p>
      Vite 快，不是因为把打包做得更快，而是因为<strong>开发阶段根本不需要打包</strong>。它把工程拆成两条链路：开发用浏览器原生 ESM 按需加载源码、就地即时编译，生产才切回 Rollup 做完整的优化打包。理解了这个「双引擎」结构，后面的配置、插件、HMR 都只是往这两条链路上加东西。
    </p>
    <div class="lesson-term">
      <span class="term-name">「依赖预构建」</span>指 Vite 在开发启动时用 esbuild 把 <code>node_modules</code> 里的依赖预先打成少量 ESM 包，并改写源码中的裸模块名指向它们，结果缓存在 <code>node_modules/.vite</code>。边界：它只处理<strong>依赖</strong>，你的源码不参与；依赖或锁文件变化时会自动重做，否则直接复用缓存。
    </div>
  </LessonArticle>
</template>
