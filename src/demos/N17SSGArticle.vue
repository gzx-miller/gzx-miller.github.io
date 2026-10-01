<script setup lang="ts">
import N17SSG from './N17SSG.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你做了一个 Nuxt 内容站，<code>nuxt build</code> 打包上传到 GitHub Pages，构建日志一路绿色。可打开首页一看，<code>view-source</code> 里的首屏 HTML 几乎是空的——只有一行「加载中」，真正的内容要等浏览器下载完 JS 再渲染出来。同一个页面在 <code>nuxt dev</code> 下明明就是好好的，为什么部署之后变成了一个空壳？
    </div>

    <h2>提出问题</h2>
    <p>
      问题出在「谁在什么时候把页面渲染成 HTML」。默认的服务端渲染模式下，HTML 是每次请求到达服务器时才现算出来的；可你把它部署到纯静态托管上，那里根本没有一个会跑 Vue 的服务器，浏览器拿到的只是一段等着执行的脚本。对用户来说首屏变慢，对搜索引擎来说页面等于没有内容。
    </p>
    <p>
      要解决它，就得<strong>在构建阶段把页面真正渲染一遍</strong>，把成品 HTML 产出来。旧办法是自己搭一套静态站点生成器：用模板引擎或 Markdown 工具在构建时生成 HTML，但页面模板、路由、交互又要另写一套，同一份页面逻辑维护两遍；数据也得在构建脚本里单独拉。成本全压在「两套体系要对得上」这件事上。
    </p>
    <p>
      于是问题落到：<strong>能不能让你已经写好的那套 Vue 页面，在构建阶段被真的渲染成完整 HTML，直接交给任意静态托管？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      跑一次 <code>nuxt generate</code>。它会在构建时启动一次内部 SSR：遍历需要预渲染的路由，逐个渲染成 HTML，连同 JS、CSS、图片等静态资源一起收进 <code>.output/public/</code>，这个目录可以直接丢到 GitHub Pages 之类的纯静态托管上。
    </p>
    <p>
      这个方案做对了一件事：<strong>交付出去的 HTML 里真的有内容</strong>。首屏不再等 JS，搜索引擎抓到的也是渲染完的结果，而且页面代码一行没改——你复用还是那套 Vue 组件。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>默认只预渲染<strong>能从入口顺着链接发现的路由</strong>。一个不在任何页面里被链接到的详情页（比如链接是运行时用接口数据拼出来的），不会被生成，访问它就是 404。</li>
      <li>某个路由在预渲染时抛了错，默认会让整个构建失败——一个页面的临时问题拖垮全部产出。</li>
      <li>依赖实时接口或登录态的页面，构建期数据还没就绪，生成出来的静态 HTML 是空的，或者停在构建那一刻的旧数据。</li>
      <li>如果无差别地把所有页面都当静态处理，后台管理这种要登录的页面也被生成了谁都能打开的静态文件。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「构建时渲染」，而是<strong>把「渲染哪些、怎么渲染」逐步说清楚</strong>。
    </p>
    <p>
      先补预渲染清单。在 <code>nuxt.config.ts</code> 的 <code>nitro.prerender</code> 里，用 <code>routes</code> 手动列出构建期发现不到的路径，比如 <code>['/', '/about', '/products']</code>；再打开 <code>crawlLinks: true</code>，让 Nitro 沿页面内的链接自动发现并预渲染更多路由。至于个别路由失败，可以用 <code>failOnError: false</code> 让构建不被中断——但要清楚代价：<strong>失败的页面会被静默跳过</strong>，你得自己回头核对清单。
    </p>
    <p>
      再补按路径区分的策略。用 <code>routeRules</code> 给不同路径不同待遇：<code>'/'</code> 配 <code>prerender: true</code> 走 SSG，<code>'/blog/**'</code> 配 <code>swr: 3600</code> 走 ISR（缓存一小时），<code>'/admin/**'</code> 配 <code>ssr: false</code> 走纯客户端 SPA，不匹配任何规则的路径保持默认的每次请求 SSR。<strong>混合渲染</strong>就是同一个项目里让这几类页面各就各位，而不必为了后台登录态牺牲整站的静态化。
    </p>
    <p>
      接着想清楚<strong>部署环境能承载什么</strong>。GitHub Pages 这类纯静态托管只支持 SSG；ISR 与 SSR 必须运行在带服务器的环境里，因为 <code>swr</code> 的「过期后重新生成」需要一个常驻进程去接住过期后的第一个请求、在后台重算。顺便记住 <code>swr</code> 的时间以<strong>秒</strong>为单位，值设得过小会造成频繁的后台重新生成，增加服务器压力。
    </p>
    <p>
      最后一步是<strong>核对产出</strong>：构建完成后打开 <code>.output/public/</code>，把生成的 HTML 清单和预渲染配置逐项对照——配置说该生成的，目录里就得有。这是排查「部署后某个页面 404」最快的手段，因为它直接把「配置以为生成了」和「实际生成了」这两个事实摆在一起。
    </p>
    <div class="lesson-box warn">
      <strong>一条硬边界：</strong>预渲染路由所需的数据必须在<strong>构建期就绪</strong>。依赖登录态或实时接口的页面应当改用 SSR 或 SPA，否则构建出来的静态 HTML 不是空的，就是一份再也更新不了的旧快照——这类页面越是想静态，越容易被静态化反噬。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「SSG / ISR / 混合渲染」：SSG 页签里看六步构建流程和常见部署目标对照表，ISR 页签看四步再生原理与 <code>swr</code> 配置，混合渲染页签看 <code>routeRules</code> 如何把 <code>prerender</code> / <code>swr</code> / <code>ssr: false</code> 分配到不同路径上，并对照四种模式各自适合的页面。</figcaption>
      <N17SSG />
    </figure>

    <h2>总结</h2>
    <p>
      静态生成要回答的其实是「哪些页面可以提前算好」：<code>nuxt generate</code> 在构建阶段把这些页面渲染成完整 HTML，<code>prerender.routes</code> 与 <code>crawlLinks</code> 决定清单里都有谁，<code>routeRules</code> 则让同一份代码里可以混着 SSG、ISR、SPA 与 SSR。想清楚每个页面「数据什么时候就绪」，也就决定了它该走哪种渲染。
    </p>
    <div class="lesson-term">
      <span class="term-name">「增量静态再生（ISR）」</span>一种折中的渲染策略：<strong>首次请求时</strong>由服务端渲染并缓存结果，后续请求直接返回缓存快速响应；<strong>超过 <code>swr</code> 指定的秒数后</strong>，在后台重新生成，新的请求就能拿到更新后的页面。它让静态页获得有限度的「新鲜度」。<strong>边界</strong>：ISR 必须有一个持续运行的服务器进程，纯静态托管（如 GitHub Pages）无法执行；<code>swr</code> 的单位是秒，值过小会触发频繁的后台重算并推高服务器压力。
    </div>
  </LessonArticle>
</template>
