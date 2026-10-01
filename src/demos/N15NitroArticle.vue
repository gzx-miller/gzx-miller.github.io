<script setup lang="ts">
import N15Nitro from './N15Nitro.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个内容站上有三类页面，诉求正好相反：营销首页几乎不变，博客详情页可以缓存一小时，后台管理必须登录后才敢渲染。你选了整站 SSR：首页每次访问都重新渲染一遍，白耗 CPU。改成整站预渲染：构建时要为每一个详情页生成 HTML，而那份后台的静态外壳谁都能打开。同一套 Vue 代码，为什么没有一种渲染模式能同时照顾好这三类页面？
    </div>

    <h2>渲染策略路径分歧</h2>
    <p>
      你写的是同一套页面代码，但不同路径对「谁来渲染、什么时候渲染、缓存多久」的需求是相互矛盾的：有的路径构建时定死就够，有的希望首次请求渲染、之后一段时间直接用缓存，有的则必须完全跳过服务端。
    </p>
    <p>
      旧办法的成本也很明确。<strong>全站只用一种渲染模式</strong>：总有一类页面被牺牲——要么每次请求都白跑一遍渲染，要么构建时长为所有详情页买单，要么后台被预渲染成谁都能看的静态文件。<strong>想按路径区分就得离开代码</strong>：去改 Nginx、改平台配置、自己写一层代理，渲染策略散落在代码之外，改一处要两边对得上。<strong>想换部署平台</strong>：从 Node 搬到 Cloudflare 或 Vercel，又得重写一遍服务端胶水代码。
    </p>
    <p>
      于是问题落到：<strong>能不能在代码里按路径声明各自的渲染与缓存策略，并且让这份声明还能落到不同的部署目标上？</strong>
    </p>

    <h2>路径级策略声明</h2>
    <p>
      在 <code>nuxt.config.ts</code> 里用 <code>routeRules</code> 按路径声明策略：<code>'/'</code> 配 <code>prerender: true</code>，<code>'/blog/**'</code> 配 <code>swr: 3600</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>渲染策略从「服务器的配置」变成了「项目里与路径一一对应的声明」</strong>。剩下的编译工作交给 Nitro——Nuxt 的服务端引擎，它会把 <code>server/</code> 目录编译成一份独立、自动代码分割的服务端产物，并按这些规则运行。
    </p>

    <h2>通配匹配范围越界</h2>
    <ul>
      <li>只声明了 <code>prerender</code>，<code>'/admin/**'</code> 也会被一起预渲染成静态 HTML：后台外壳谁访问都拿到同一份，登录态没有立足之地。</li>
      <li><code>swr</code> 的「过期后重新生成」需要一个<strong>常驻进程</strong>来接住过期后的第一个请求、在后台重算；如果把它部署到纯静态托管，这条规则会安静地失效，页面停在这一版，你怎么改数据都不变。</li>
      <li>构建目标一换，产物形态就变了：同样是构建，面向 Node 服务和面向纯静态得到的是两种完全不同的东西；选错了目标，服务端 API 与增量再生根本没有运行的地方。</li>
      <li>给 <code>'/static/**'</code> 配了超长缓存头，却没让这些文件真正静态化，命中的仍是动态渲染的结果——缓存头加错了对象。</li>
    </ul>

    <h2>四类路径策略分派</h2>
    <p>
      第一步，先把路径分清楚。用 <code>routeRules</code> 一次声明四类：<code>'/'</code> 走 <code>prerender: true</code>（SSG），<code>'/blog/**'</code> 走 <code>swr: 3600</code>（ISR，缓存一小时），<code>'/admin/**'</code> 走 <code>ssr: false</code>（SPA，仅客户端渲染），<code>'/api/**'</code> 配 <code>cors: true</code>；不匹配任何规则的路径则保持默认的「每次请求服务端渲染」。这就是<strong>混合渲染</strong>：同一个项目里 SSR、SSG、ISR、SPA 各就各位。
    </p>
    <p>
      第二步，决定产物形态。需要服务端运行能力（SSR、增量再生、服务端接口）就用 <code>nuxt build</code> 产出服务端产物；只要一个纯静态站点就用 <code>nuxt generate</code>。这一步选错，后面的策略再对也没地方执行。
    </p>
    <p>
      第三步，选部署预设。同样是构建，按目标挑 <code>preset</code>：<code>node-server</code>、<code>cloudflare-pages</code>、<code>vercel</code>、<code>netlify</code>、<code>deno-server</code>——同一份代码换个 preset 就能换平台。preset 决定产物形态，换目标时要同步核对打包命令与平台上的配置文件。
    </p>
    <p>
      第四步，把 Nitro 顺带提供的能力用起来：<code>server/api/</code> 与 <code>server/routes/</code> 下的文件会自动注册成接口、<code>server/middleware/</code> 自动成为每个请求都经过的服务端中间件、<code>server/utils/</code> 里的函数自动导入；需要跨平台存储时用 <code>useStorage()</code>，底层可以从本地内存换成 Redis 或 Cloudflare KV，而业务代码不用改。再记住 <code>server/</code> 会被编译成独立产物、每个接口与中间件单独打包按需加载，部署时不必带着整个项目一起走。
    </p>
    <p>
      回到开场：三类页面不是靠「选一种模式」解决的，而是靠 <code>routeRules</code> 把它们分开声明——首页交给构建、详情页交给缓存、后台交给浏览器。
    </p>
    <div class="lesson-box warn">
      <strong>两个误区：</strong>以为 <code>routeRules</code> 配了就一定生效——<code>swr</code> 这类增量再生必须有一个持续运行的服务器进程来触发，纯静态托管下它不会工作；以为 <code>preset</code> 只是打包参数——它决定产物的形态与运行环境，切换部署目标时要同时核对构建命令与平台配置，否则会出现「构建成功却跑不起来」。
    </div>

    <h2>预设与部署目标对照</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「核心特性 / 部署目标 / 混合渲染」：先看 Nitro 提供的能力清单，再对照各 preset 与对应的构建命令，最后看 <code>routeRules</code> 的例子和 SSG / ISR / SPA / SSR 四种模式的对照——它演示的正是「一个项目里混着四种渲染策略」。</figcaption>
      <N15Nitro />
    </figure>

    <h2>服务端能力声明化</h2>
    <p>
      Nitro 做的是把服务端这半边变成一件可声明、可移植的事：<code>routeRules</code> 让渲染策略按路径分开写，混合渲染因此成为可能；<code>nuxt build</code> 与 <code>nuxt generate</code> 决定要不要一份能跑的服务端产物；<code>preset</code> 决定这份产物最终落到哪个平台。策略留在代码里，平台只换一个参数。
    </p>
    <div class="lesson-term">
      <span class="term-name">「部署预设（preset）」</span>Nitro 用来决定「服务端产物编译成什么形态、跑在哪个运行时」的构建目标，如 <code>node-server</code>、<code>cloudflare-pages</code>、<code>vercel</code>、<code>netlify</code>、<code>deno-server</code>；产出纯静态站点则走 <code>nuxt generate</code>（对应 <code>static</code> 预设）。边界：同一份源码换 preset 会得到不同的产物与运行环境，切到静态产物后，依赖服务端的能力（<code>swr</code> 增量再生、<code>server/api</code>、Node 原生模块）会失效；因此换部署目标时，构建命令与平台配置文件必须一起核对。
    </div>
  </LessonArticle>
</template>
