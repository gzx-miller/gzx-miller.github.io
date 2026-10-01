<script setup lang="ts">
import V09MPA from './V09MPA.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把官网和后台做进同一个 SPA，用前端路由分了 <code>/home</code> 和 <code>/admin</code>。结果访客打开官网首页，浏览器却把整个后台——连同它依赖的表格组件和图表库——一起下载了下来，只因为它们住在同一个 <code>index.html</code> 里。
    </div>

    <h2>提出问题</h2>
    <p>
      有些场景天然就是「几个彼此独立的页面」：官网、管理后台、登录页，结构不同、SEO 要求不同，甚至由不同团队分开维护、分开发布。而 SPA 只有一个 <code>index.html</code>，所有页面都靠前端路由在里面切换。
    </p>
    <p>
      把这几个页面硬塞进同一个 SPA，人要付出的隐藏成本是：所有页面的代码被打进同一份产物，访客被迫下载用不到的部分；想单独发布后台，就得连官网一起重新构建；需要被搜索引擎抓取的页面，也拿不到独立、可直接渲染的 HTML。于是问题落在一句话上：<strong>怎么让每个页面拥有自己的 HTML 入口和产物，同时又不必重复打包公共依赖？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的想法：每个页面放一个独立的 HTML 文件，各自引各自的 JS。
    </p>
    <p>
      这个方案做对了一件事：<strong>页面之间在产物层面被彻底隔离</strong>，官网的访客不会为后台的代码买单，两个页面也能各自构建、各自发布。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>手工维护多个 HTML 容易漏：新增页面要记得加文件、加引用、加构建配置，任何一处漏了都构建不出来或线上 404。</li>
      <li>公共依赖被重复打包：每个页面各引一次 <code>vue</code>，若不处理，<code>vue</code> 会被复制进每个页面的产物，总下载量反而变大。</li>
      <li>dev 与 build 的行为要对得上：本地能访问的页面，构建产物里不一定存在（或反过来）。</li>
      <li>资源引用若都用绝对路径，部署到子目录时整站 404。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补「把入口声明出来」。Vite 用 <code>build.rollupOptions.input</code> 接管这件事，以键值对列出每个 HTML 入口，例如 <code>main</code> 指向 <code>index.html</code>、<code>admin</code> 指向 <code>admin/index.html</code>、<code>login</code> 指向 <code>login/index.html</code>。Rollup 会为每个入口分别产出 HTML 与对应的入口 JS，不再需要人手动拼构建命令。每个 HTML 用 <code>&lt;script type="module" src="/src/admin/main.ts"&gt;&lt;/script&gt;</code> 引自己的入口脚本，路径要与 input 的键名对得上。
    </p>
    <p>
      接着补「共享依赖」。多个入口都要用 <code>vue</code>、公共组件怎么办？Vite 会<strong>把跨页面共享的依赖自动提取成一个 common chunk</strong>，各页面复用它，不会在每个页面里各打一份。这样「页面隔离」和「依赖复用」就同时成立了。
    </p>
    <p>
      再补「项目结构约定」。按「页面」来组织目录，每个页面一个「HTML + 入口脚本 + 组件」的组合，公共代码抽进 <code>shared</code>：
    </p>
    <ol class="lesson-steps">
      <li>每个页面的 HTML 放在自己的目录下（如 <code>admin/index.html</code>）。</li>
      <li>每个页面对应一个入口脚本（如 <code>src/admin/main.ts</code>）。</li>
      <li>跨页面共用的代码集中放进 <code>src/shared</code>。</li>
      <li>在 <code>vite.config.ts</code> 的 <code>input</code> 里把这几个 HTML 一一登记。</li>
    </ol>
    <p>
      最后补「开发与部署的路径细节」。开发服务器下访问子页面要带尾部斜杠（<code>/admin/</code>）才会命中它的 <code>index.html</code>，因为 <code>/admin</code> 会被当成一个路径而不是目录；部署到子目录时，用 <code>base</code> 统一调整各页面的资源路径，避免绝对路径 404。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong>dev 下访问子页面必须带尾部斜杠 <code>/admin/</code>，否则命中不到对应的 <code>index.html</code>；部署到子目录时记得配 <code>base</code>，否则所有页面的绝对路径资源会集体 404。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切 config / structure / compare 三个页签，看多入口怎么声明、目录该怎么组织，以及 MPA 与 SPA 各自适合什么场景。</figcaption>
      <V09MPA />
    </figure>

    <h2>总结</h2>
    <p>
      MPA 的本质，是让每个页面拥有自己的 HTML 入口和产物：用 <code>rollupOptions.input</code> 声明多个入口，Vite 为每个入口独立产出 HTML 与 JS，再把公共依赖自动提成一个共享 chunk。页面之间隔离、公共依赖复用，两件事同时成立。
    </p>
    <div class="lesson-term">
      <span class="term-name">「多页面应用（MPA）」</span>指构建时声明多个 HTML 入口，每个页面各自产出独立的 HTML 与入口 JS，跨页面共享的依赖被提取为 common chunk 而非重复打包。边界：MPA 的页面切换是<strong>整页跳转</strong>，不做前端路由；它换来产物隔离、可按页发布和更好的 SEO，代价是页面之间不再有 SPA 那种无刷新切换的体验。
    </div>
  </LessonArticle>
</template>
