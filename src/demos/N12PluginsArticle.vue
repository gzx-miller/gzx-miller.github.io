<script setup lang="ts">
import N12Plugins from './N12Plugins.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你按文档把 UI 组件库装进应用，顺手写在了 <code>App.vue</code> 的 setup 里：<code>app.use(ElementPlus)</code>。开发时每改几次代码，控制台就冒出一串「Plugin has already been applied to target app」；换成需要 <code>window</code> 的图表库写在同一个位置，一开 SSR 直接 500。都只是「启动时初始化一次」这种小事，为什么放哪儿都不太对？
    </div>

    <h2>应用启动全局工作</h2>
    <p>
      应用启动阶段总有一批与具体页面无关、只该做一次的全局活：安装 Vue 插件、初始化第三方库、注册一个到处都能用的工具函数（金额格式化、i18n、日志上报）。它们既不属于某个页面，也不该被某个组件「顺便」带出来。
    </p>
    <p>
      旧办法的成本主要有三笔。写在 <code>App.vue</code> 或布局组件的 setup 里：<strong>组件是会重复挂载的</strong>，导航、热更新都可能再跑一遍，于是插件被重复安装、库被反复初始化，而且这里并不总能拿到「整个应用的实例」。在各个用到的地方各自 import 一遍初始化代码：调用方到处复制同一份逻辑，配置一改要满仓库找，想统一提供一个 <code>$format</code> 更无从谈起。浏览器专属的库自己写 <code>typeof(window)</code> 判断来跳过服务端：判断散落各处，初始化时机也没法绑在「应用启动」这一刻。
    </p>
    <p>
      于是问题落到：<strong>有没有一个固定的位置，专门承载「应用启动时、只跑一次、还能声明只在哪一端跑」的全局逻辑？</strong>
    </p>

    <h2>目录约定自动注册</h2>
    <p>
      在 <code>plugins/</code> 目录下建一个文件，默认导出 <code>defineNuxtPlugin((nuxtApp) =&gt; { ... })</code>，在函数体里完成安装，例如 <code>nuxtApp.vueApp.use(ElementPlus)</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>约定即注册</strong>。<code>plugins/</code> 下的文件会被自动扫描并执行，不需要在 <code>nuxt.config.ts</code> 里手写一张插件清单；而且它们在组件树之外运行，属于应用级的一次性初始化，不受任何组件重复挂载的影响。
    </p>

    <h2>字母序执行顺序</h2>
    <ul>
      <li><strong>执行顺序由文件名的字母序决定</strong>，不由你想要的依赖顺序决定：<code>analytics.ts</code> 排在 <code>i18n.ts</code> 前面，如果 analytics 要用 i18n 注入的能力，此刻拿到的是 <code>undefined</code>。</li>
      <li>把依赖 <code>window</code> 的库（如 echarts）放进普通的 <code>.ts</code> 插件，服务端那份产物也会执行到这里，直接 <code>window is not defined</code>。</li>
      <li>插件里想读某个组件 provide 出来的值，写 <code>inject()</code> 会失败——此刻组件上下文还不存在，注入链根本没建立。</li>
      <li>在插件里 <code>provide('i18n', fn)</code>，组件里按 <code>useNuxtApp().i18n</code> 去取却取不到：注入的键会被自动加上 <code>$</code> 前缀。</li>
    </ul>

    <h2>数字前缀与端侧后缀</h2>
    <p>
      先给顺序一个显式的说法：<strong>用数字前缀命名</strong>，<code>01-setup.ts</code>、<code>02-analytics.ts</code>，把依赖关系直接写进文件名，字母序就变成了你要的顺序。
    </p>
    <p>
      再用后缀声明「在哪一端跑」：需要在浏览器里初始化的库命名为 <code>chart.client.ts</code>，它只在客户端加载；只在服务端跑的用 <code>.server.ts</code>。这样就不必在代码里手写 <code>typeof(window)</code> 判断，端侧限制由文件名一次说清。
    </p>
    <p>
      接着解决「怎么给组件用」。用 <code>nuxtApp.provide('i18n', fn)</code> 把能力注入进去，组件里写 <code>const { $i18n } = useNuxtApp()</code> 就能直接调用，<code>$</code> 前缀是 Nuxt 自动加的，不用自己拼。
    </p>
    <p>
      然后把握「时机」这件事。除了默认的启动执行，还可以通过 <code>nuxtApp.hook(...)</code> 把副作用挂到应用生命周期的具体节点上：<code>app:created</code> 应用创建后、<code>app:beforeMount</code> 挂载前、<code>app:mounted</code> 挂载后、<code>page:start</code> 页面导航开始、<code>page:finish</code> 导航完成，另有 <code>vue:setup</code>、<code>vue:error</code>、<code>app:error</code> 这类组件与错误钩子。选对钩子，前置初始化和后置埋点就不会互相打架。
    </p>
    <p>
      最后是纪律：<strong>插件在整个应用生命周期只初始化一次</strong>，它属于「应用」而不属于「某个组件」。所以插件里不要访问具体的组件实例、不要依赖 props；如果某段逻辑天然跟组件绑定（比如依赖组件状态、要在 setup 里用），那它就该是一个 composable，而不是插件。再补一句实践细节：装 Vue 插件用 <code>nuxtApp.vueApp.use()</code>，注入全局能力用 <code>nuxtApp.provide()</code>，两者别混着用。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见错误：</strong>在插件里用 <code>inject()</code>——插件运行在组件上下文之外，依赖注入在这里只能单向 <code>provide</code>，要读组件提供的值请放到 composable 或组件里；把插件当成「每个组件都能拿到自己实例」的地方——它只保证每个应用实例执行一次，需要按组件隔离的状态应该写在 setup 里。
    </div>

    <h2>三类插件写法对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「自动注册插件 / 仅客户端插件 / provide 注入」三个页签，左侧看写法、右侧看它为什么这么写；下面的表格列出 8 个 NuxtApp 钩子各自对应的触发时机，可以对着选自己该用哪一个。</figcaption>
      <N12Plugins />
    </figure>

    <h2>启动逻辑集中注册</h2>
    <p>
      插件系统给「应用启动时要做的全局事」找了一个固定归处：文件放进 <code>plugins/</code> 就自动注册，数字前缀管顺序，<code>.client.ts</code> / <code>.server.ts</code> 管端侧，<code>nuxtApp.provide()</code> 把能力注入出去、组件用 <code>useNuxtApp().$xxx</code> 取回来。它只在启动时跑一次，所以要把「应用级」的活放这里，把「组件级」的活留给 composable。
    </p>
    <div class="lesson-term">
      <span class="term-name">「provide / inject（依赖注入）」</span>Vue 的一对 API：祖先通过 <code>provide</code> 向下提供值，任意后代用 <code>inject</code> 按 key 取用，中间不必逐层透传 props。在 Nuxt 插件里它只有一半可用——插件处于组件上下文之外，<strong>只能 <code>provide</code> 不能 <code>inject</code></strong>，且插件注入的 key 会被自动加上 <code>$</code> 前缀，组件侧用 <code>useNuxtApp().$key</code> 读取。边界：它传递的是运行时提供的值而非编译期常量，key 拼错不会报错、只会取到 <code>undefined</code>，排查时先核对 <code>$</code> 前缀与拼写。
    </div>
  </LessonArticle>
</template>
