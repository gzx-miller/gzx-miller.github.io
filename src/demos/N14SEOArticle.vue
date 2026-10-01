<script setup lang="ts">
import N14SEO from './N14SEO.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程详情页里你写了 <code>document.title = course.name</code>，浏览器标签上标题确实跟着课程变了，你以为 SEO 这块已经收工。结果把链接贴进微信，分享卡片显示的却是站点首页那句默认标题和一张通用图；在搜索引擎里搜课程名，收录的也是首页。浏览器里明明看得见的标题，为什么爬虫和分享机器人看不到？
    </div>

    <h2>提出问题</h2>
    <p>
      你要的是让每个页面的标题、描述、分享卡片跟着内容走：课程 A 显示 A，课程 B 显示 B，而且这些信息要能被外部机器读到。
    </p>
    <p>
      旧办法的隐藏成本各有各的形态。用 <code>document.title</code> 和手动新建 meta 标签改 head：<strong>这只在浏览器里执行</strong>，服务端返回的 HTML 里根本没有这些标签，而爬虫与分享机器人不执行你的 JS，抓到的只是一份没有标题、没有描述的 HTML 外壳。把内容写死在入口 HTML 的静态 head 里：全站共用一份，详情页和首页标题一模一样。只在 <code>nuxt.config.ts</code> 的 <code>app.head</code> 中配置：那是一份全局默认值，没法让某个页面就地覆盖。
    </p>
    <p>
      于是问题落到：<strong>怎么让每个页面的 head 内容跟着页面数据走，而且它还要出现在「服务端直出的 HTML」里？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      在页面组件里调用 <code>useHead</code>，把标题和 meta 一次性声明进去，例如 <code>useHead({ title: '课程详情 - 小松鼠举栗子', meta: [{ name: 'description', content: 'Vue3 在线课程' }] })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它不改 DOM，只是向当前渲染上下文「登记」这一页需要哪些 head 标签</strong>。SSR 渲染时这些登记项会被写进返回的 HTML，客户端导航时再同步到 DOM，两端结果一致。你在 setup 里只负责声明「要什么」，什么时候落到哪儿交给框架。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>标题写成死字符串：所有课程页共用同一个标题，内容变了标题却不变。</li>
      <li>想把标题绑到响应式的课程名上——<code>useHead</code> 支持传 <code>ref</code> / <code>computed</code>，但值必须在 setup 期间就能读到；服务端渲染那一刻数据还没到，直出的就是一个空标题。</li>
      <li>分享卡片要用 <code>og:title</code>、<code>og:description</code>、<code>og:image</code>，用 <code>meta</code> 数组逐条手写既要区分 <code>name</code> 与 <code>property</code>，又容易漏字段，结果分享出去还是残缺的。</li>
      <li>往 <code>useHead</code> 里塞异步副作用（顺手发个埋点请求、<code>await</code> 一个接口）：SSR 会等它，拖慢首屏，甚至影响服务端渲染的完成。</li>
      <li>最容易骗到自己的一条：在 DevTools 里看 head 一切正常就以为成了。DevTools 看的是运行后的 DOM，爬虫看的是服务端返回的那份源代码，两者不是一回事。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先<strong>分层</strong>：把全站共用的默认值放进 <code>nuxt.config.ts</code> 的 <code>app.head</code>（站点标题模板、全站描述、keywords），页面级再用 <code>useHead</code> 就地覆盖。默认值打底，页面只写差异，重复配置自然消失。
    </p>
    <p>
      再让它<strong>动起来</strong>：把标题、描述传成 <code>ref</code> 或 <code>computed</code>，状态一变标签自动更新，不需要任何手动触发——这正是「响应式 SEO」的含义。
    </p>
    <p>
      第三步补全搜索与分享所需的标签。改用 <code>useSeoMeta</code> 的短键名，把 <code>title</code>、<code>description</code>、<code>ogTitle</code>、<code>ogDescription</code>、<code>ogImage</code>、<code>ogUrl</code>、<code>twitterCard</code> 一次写全，绕开 <code>name</code> / <code>property</code> 与 <code>og:</code> 前缀这些细节。
    </p>
    <p>
      第四步建立正确的验证方式：SEO 效果以<strong>「查看页面源代码」</strong>为准——那里能看到 SSR 输出的 <code>&lt;title&gt;</code> 与 meta；客户端路由切换后的变化则看 DevTools 的 head。两套机制，结果应当一致。
    </p>
    <div class="lesson-box warn">
      <strong>两个误区：</strong>用浏览器里的 DOM 判断 SEO——DevTools 显示的是 Hydration 之后的 DOM，能骗过你但骗不过爬虫，必须看「查看页面源代码」；在 <code>useHead</code> / <code>useSeoMeta</code> 里做异步请求或埋点——它会挂在服务端渲染的关键路径上，拖慢首屏还可能让输出不完整，副作用应该放到生命周期钩子里去做。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在上方两个输入框里改「页面标题」和「页面描述」，下方「实时预览 head 配置」会立刻跟着变，这就是响应式 SEO；再切换 useHead / 响应式 SEO / useSeoMeta 三个页签，对照三种写法的代码——尤其注意 useSeoMeta 的键名有多短。</figcaption>
      <N14SEO />
    </figure>

    <h2>总结</h2>
    <p>
      head 管理的关键在于「登记而不是改 DOM」：全站默认值放 <code>app.head</code>，页面级用 <code>useHead</code> 覆盖，传 <code>ref</code> / <code>computed</code> 就获得响应式，搜索引擎与分享所需的标签交给 <code>useSeoMeta</code> 的短键名一次写全。验证时只看服务端直出的源代码，别用浏览器里的 DOM 骗自己。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Open Graph（OG 协议）」</span>一套用 <code>&lt;meta property="og:xxx"&gt;</code> 描述「这个页面分享出去该长什么样」的元数据协议，涵盖标题、描述、缩略图、类型与地址，微信、X / Twitter、Slack 等平台的分享卡片都读它；Twitter 另有对应字段 <code>twitter:card</code>，在 Nuxt 里由 <code>useSeoMeta</code> 的 <code>twitterCard</code> 写入。边界：这些标签必须出现在<strong>服务端直出的 HTML</strong> 里才会被分享机器人读到，用 <code>document.title</code> 那种客户端改写对其无效；<code>ogImage</code> 通常还要求是可公开访问的绝对 URL，相对路径很多平台解析不出来。
    </div>
  </LessonArticle>
</template>
