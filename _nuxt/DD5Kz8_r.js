const o=`<script setup lang="ts">
import X01ProjectStructure from './X01ProjectStructure.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>刚拉下一个 Next.js 项目，<code>app/</code> 里躺着 <code>page.tsx</code>、<code>layout.tsx</code>、<code>loading.tsx</code>、<code>error.tsx</code> 一堆同名文件——为什么首页入口叫 <code>page.tsx</code> 而不是 <code>index.tsx</code>，这些文件分别归谁管？
    </div>

    <h2>手写路由表负担</h2>
    <p>
      你想给课程站加一个「关于我们」页面。在熟悉的单页应用里，你会打开路由配置文件，手写一条 <code>path: '/about'</code> 的记录，再把组件挂上去。可到了 Next.js 的项目里，你翻遍目录都找不到那张路由表，只看到一层层文件夹和几个名字固定的文件。于是第一个真实的困惑就是：<strong>页面到底写在哪、目录里的每个文件又各自承担什么职责？</strong>
    </p>
    <p>
      再往深一层想，一个页面从来不只有自己的内容。它还要顶着全站的头部导航、踩着底部版权，中间可能还要处理「数据没回来时的加载态」、「出错时的兜底界面」、「路径不存在时的 404」。如果每个页面都各自抄一遍这些东西，重复且容易走样。所以框架需要的不是一张手势维护的路由表，而是一套<strong>用目录结构表达页面归属与共享外壳</strong>的约定。
    </p>

    <h2>单组件条件渲染</h2>
    <p>
      最朴素的做法，是把 <code>app/</code> 当成一个普通文件夹：只写一个入口组件，在组件里用一个变量记下「当前想看哪个页面」，再用条件判断决定渲染哪一段 JSX。这套纯客户端 SPA 的思路确实做对了一件事——<strong>它承认页面可以被抽象成组件</strong>，UI 因此变得可拆分、可组合。
    </p>
    <p>
      代价是它把「路由」这件本可以写在结构里的事，藏进了运行时的判断分支。你新增一个页面，就得回去改那个 <code>if / else</code>；共享的头部、加载态、错误兜底，也只能靠每个页面自觉去拼。
    </p>

    <h2>约定缺失与重复</h2>
    <ul>
      <li>URL 与代码之间没有稳定的对应关系：加一个页面就要动一处分支逻辑，漏改就漏页。</li>
      <li>共享外壳靠手动重复：头部、底部、面包屑在几十个页面里各写一份，风格漂移难以收敛。</li>
      <li>加载态、错误态、404 没有统一落点，只能每个页面各写各的。</li>
      <li>没有按路径切分的天然边界，打包时无法按路由做代码分割，路径越多首包越臃肿。</li>
      <li>服务端无法根据请求路径直接输出对应的 HTML，首屏要等 JavaScript 下载并执行完才看得到内容。</li>
    </ul>

    <h2>目录即路由表</h2>
    <p>
      不推翻「页面是组件」，而是把路由提升为<strong>目录约定</strong>：文件系统的目录层级，直接映射为 URL 层级。你不再维护路由表，<strong>目录结构本身就是路由表</strong>。<code>app/page.tsx</code> 对应 <code>/</code>，<code>app/about/page.tsx</code> 对应 <code>/about</code>，想加页面就新建一个目录加一个 <code>page.tsx</code>。
    </p>
    <p>
      这个约定里，<strong>只有 <code>page.tsx</code> 是路由入口</strong>，其余文件都是围绕它的布局与状态约定。要先立住的是根布局 <code>app/layout.tsx</code>：它是必需的，且必须自带 <code>&lt;html&gt;</code> 和 <code>&lt;body&gt;</code> 标签，全局样式也在这里引入。所有页面都会被它包裹，于是「全站共享外壳」第一次有了唯一落点。
    </p>
    <p>
      接着把状态也变成文件约定，各归其位：
    </p>
    <table>
      <thead>
        <tr><th>文件</th><th>职责</th></tr>
      </thead>
      <tbody>
        <tr><td><code>layout.tsx</code></td><td>共享布局，导航时保持挂载；根布局必须含 <code>&lt;html&gt;</code>／<code>&lt;body&gt;</code></td></tr>
        <tr><td><code>page.tsx</code></td><td>路由的唯一入口，目录层级即 URL</td></tr>
        <tr><td><code>loading.tsx</code></td><td>路由切换时自动显示的加载界面</td></tr>
        <tr><td><code>error.tsx</code></td><td>错误边界，必须是客户端组件，提供 <code>reset</code> 重试</td></tr>
        <tr><td><code>not-found.tsx</code></td><td>路径或数据不存在时的 404 界面</td></tr>
      </tbody>
    </table>
    <p>
      其中 <code>error.tsx</code> 需要特别留意：因为它要处理「重试」这类交互，所以文件顶部必须写 <code>'use client'</code>，组件会收到 <code>error</code> 与 <code>reset</code> 两个参数，前者用于上报日志（常见做法是在 <code>useEffect</code> 里打印），后者用于重新渲染出错的那一段。
    </p>
    <p>
      除了 <code>app/</code>，项目根还有两个常被问到的位置：<code>public/</code> 放静态资源，目录下的文件可以直接通过 <code>/</code> 访问（例如 <code>public/logo.png</code> 对应 <code>/logo.png</code>）；<code>next.config.js</code> 则是框架配置文件，像允许远程图片域名、开启严格模式这类开关都写在这里。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，<code>pages/</code> 目录仍能运行，但已逐步淘汰，新项目请统一用 <code>app/</code>；其二，迁移期间 <code>pages/</code> 与 <code>app/</code> 可以并存，<strong>但同一条路径不能在两处同时定义</strong>，否则会在构建时冲突报错。
    </div>

    <h2>文件职责归属</h2>
    <figure class="lesson-figure">
      <figcaption>点目录树里的节点，看看 <code>app/</code> 下每个文件到底归谁管。</figcaption>
      <X01ProjectStructure />
    </figure>

    <h2>路由迁入目录结构</h2>
    <p>
      项目结构这一课，真正的转变是「路由从配置文件搬进了目录结构」：目录层级即 URL，<code>page.tsx</code> 是唯一入口，<code>layout</code>／<code>loading</code>／<code>error</code>／<code>not-found</code> 则把共享外壳与各种状态收进约定文件名。你不再维护路由表，只需要按约定摆放文件。
    </p>
    <div class="lesson-term">
      <span class="term-name">「App Router」</span>是 Next.js 基于文件系统的路由方案：以 <code>app/</code> 目录组织代码，目录层级即 URL 层级，<code>page.tsx</code> 是唯一的路由入口，<code>layout.tsx</code> 提供共享布局（根布局必须含 <code>&lt;html&gt;</code> 与 <code>&lt;body&gt;</code>），<code>loading</code>／<code>error</code>／<code>not-found</code> 分别约定加载、错误与 404 状态。<code>pages/</code> 仍可运行但已逐步淘汰，两者并存时同一路径不可重复定义。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
