<script setup lang="ts">
import V11SSR from './V11SSR.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给商城首页做足了 SEO，可在搜索引擎的抓取结果里，页面正文是空的；右键「查看网页源代码」，只看到一行 <code>&lt;div id="app"&gt;&lt;/div&gt;</code>——内容明明在浏览器里显示得好好的，为什么源码里什么都没有？
    </div>

    <h2>提出问题</h2>
    <p>
      页面之所以能看见，是因为浏览器先下载到一段几乎空白的 HTML，再下载 JavaScript，由 Vue 在浏览器里把组件渲染成真实 DOM 挂上去。也就是说，<strong>用户看到的「页面」，是 JS 跑完之后才存在的</strong>。这一路上有两个代价：搜索引擎爬虫拿到的初始 HTML 里没有正文，收录不到内容；弱网或低端设备上，JS 下载与执行完成之前，用户面对的是一段白屏。
    </p>
    <p>
      让「内容在 JS 到达之前就存在」，本质上是问：能不能让第一份 HTML 里就带着渲染好的结果？旧办法要人承担的隐藏成本有三个：把内容写成静态模板，就丧失了组件化与数据驱动；改由后端拼字符串，又等于把 Vue 的逻辑重写一遍；什么都不做，就是把首屏和 SEO 交了出去。于是问题落到一句：<strong>能不能在服务端把 Vue 组件渲染成 HTML，再让浏览器接管？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：在服务端调用 <code>renderToString()</code>，把组件渲染成一段完整的 HTML 字符串，直接返回给浏览器。
    </p>
    <p>
      这个方案做对了一件事：<strong>第一份 HTML 里就带着真实内容</strong>。爬虫能读到正文，用户也能在 JS 到达之前先看到页面，白屏时间被大幅压缩。但此时这份 HTML 是「死」的——它只是字面文本，没有任何交互能力。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>服务端吐出的 HTML 上点按钮毫无反应——事件监听根本没绑上去，它只是一段静态文本。</li>
      <li>服务端没有 <code>window</code>、<code>document</code>，组件里若在渲染期就访问浏览器 API，服务端直接抛错。</li>
      <li><code>onMounted</code> 在服务端不会执行，把首屏数据请求写在这里，服务端渲染出来仍是空数据。</li>
      <li>服务端与客户端如果渲染出了不一样的结果，浏览器接管时会报 Hydration 不匹配警告，甚至回退成整段重渲染。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补「让死 HTML 活过来」。客户端不能再 <code>createApp</code> 从零渲染，而要改用 <code>createSSRApp</code>：它会复用服务端已经生成的那份 HTML，把事件监听与响应式重新挂上去——这一步叫 <strong>Hydration（激活）</strong>。渲染用的还是同一套组件代码，服务端负责「画出来」，客户端负责「连上线」。
    </p>
    <p>
      再补「开发期怎么在同一进程里转换服务端代码」。如果服务端也走一遍完整构建，改一行就要等构建，开发体验直接崩。Vite 的解法是<strong>中间件模式</strong>：用 <code>createServer({ server: { middlewareMode: true } })</code> 启动开发服务器，把它挂到 Express 这类 Node 服务上。这样请求进来时，可以直接调用 <code>ssrLoadModule('/src/entry-server.ts')</code>，让 Vite 就地把源码转好再用，不必预先打包。
    </p>
    <ol class="lesson-steps">
      <li>服务端读取 HTML 模板，经 <code>transformIndexHtml</code> 处理，得到带占位符的页面骨架。</li>
      <li>用 <code>ssrLoadModule</code> 加载服务端入口，调用其中的渲染函数，得到组件渲染出的 HTML。</li>
      <li>把组件 HTML 替换进模板的占位符，返回完整页面给浏览器。</li>
      <li>浏览器下载客户端脚本，由客户端入口 <code>createSSRApp</code> 后 <code>mount</code>，完成 Hydration。</li>
    </ol>
    <p>
      接着补「依赖怎么处理」。服务端代码跑在 Node 里，有些依赖不能被建进 SSR 产物，有些又必须被建进去，于是 <code>ssr.external</code> 与 <code>ssr.noExternal</code> 各管一头：前者让依赖保持外部引用、运行时从 <code>node_modules</code> 加载，后者强制把依赖打进服务端产物——只发 ESM、或需要被转换的库往往必须这样做。
    </p>
    <p>
      最后是「产出与部署」。SSR 应用有两份产物：一份给服务端（渲染用），一份给客户端（Hydration 用），要<strong>分别构建后一起部署</strong>到一个能跑 Node 的服务器上。这也正是它与纯静态站最大的区别——目标环境必须有 Node。顺带一提，本仓库（小松鼠举栗子）本身就是 Nuxt 4 + Vite 的 SSR 应用，Nuxt 就是把上面这一整套流程封装成了开箱即用。
    </p>
    <div class="lesson-box warn">
      <strong>两条最容易踩的线：</strong>依赖浏览器 API 的代码要放进 <code>onMounted</code> 或 <code>&lt;ClientOnly&gt;</code> 里，避免服务端执行时找不到 <code>window</code>；首屏数据的请求要写在支持 SSR 的加载函数中，因为 <code>onMounted</code> 在服务端根本不会执行，写在那里等于服务端渲染的是空数据。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切 concept / setup / nuxt 三个页签：先看清服务端渲染加客户端激活的原理与收益，再看一个最小 SSR 服务器怎么搭，最后了解 Nuxt 如何把这一整套封装成开箱即用。</figcaption>
      <V11SSR />
    </figure>

    <h2>总结</h2>
    <p>
      服务端渲染拆开就是两步：<strong>服务端用 <code>renderToString</code> 把组件画成 HTML，客户端用 <code>createSSRApp</code> 把这份 HTML 接管成活的应用</strong>。前者换来首屏与 SEO，后者换来交互。它不是一个新框架，而是「同一套组件、两个渲染环境」这个约束下的必然产物——也正因为有两个环境，服务端与客户端首次渲染必须一致，浏览器 API 与首屏数据都要放在对的位置。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Hydration（激活）」</span>指客户端拿到服务端渲染出的静态 HTML 后，不从头渲染，而是复用这份已有的 DOM 结构，把事件监听与响应式状态重新挂上去，使其变成可交互的应用。它的前提是<strong>服务端与客户端首次渲染结果完全一致</strong>，哪怕多一个空格都会触发不匹配警告；边界：Hydration 只接管、不重建，所以依赖随机数、时间戳、浏览器 API 的差异渲染，是它最常见的失败来源。
    </div>
  </LessonArticle>
</template>
