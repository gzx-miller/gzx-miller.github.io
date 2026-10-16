const e=`<script setup lang="ts">
import N11Middleware from './N11Middleware.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>middleware/auth.ts</code> 里写好了「没登录就跳登录页」的判断，文件规规矩矩放在 <code>middleware/</code> 目录下。可切到 <code>/admin</code> 一试——没登录照样进去了，控制台连一条中间件日志都没有。文件名对了、目录对了、逻辑也没写错，它为什么一声不吭地被跳过了？
    </div>

    <h2>导航拦截时机</h2>
    <p>
      你要处理的是同一类需求：进后台之前先看登录态，进详情页之前先看权限，每次导航顺手记一次埋点。它们有个共同点——<strong>都得发生在「页面开始渲染」之前</strong>，判断得早，才不会先渲染出一个不该被看到的页面再补救。
    </p>
    <p>
      旧办法各有各的代价。<strong>写进每个页面的 setup</strong>：判断散落在各页，顺序各写各的，新加一个页面就容易漏；而且拦截发生在页面已经开始渲染之后，时机偏晚。<strong>用路由的全局守卫一刀切</strong>（比如 <code>router.beforeEach</code>）：登录页、404、公开文章也全被拦下来，白名单得自己维护，注册位置还和页面文件分处两地，很容易对不上。<strong>交给布局组件或后端</strong>：布局只管怎么渲染，管不了「导航要不要发生」。
    </p>
    <p>
      于是问题落到：<strong>能不能有一种「写在文件里、由页面按需挂载、在导航前执行」的拦截方式？</strong>
    </p>

    <h2>中间件文件定义</h2>
    <p>
      先在 <code>middleware/</code> 下建一个文件，默认导出 <code>defineNuxtRouteMiddleware((to, from) =&gt; { ... })</code>，在函数里写判断；再在需要用它的页面里写 <code>definePageMeta({ middleware: 'auth' })</code>，把文件名当成名字引用过来。
    </p>
    <p>
      这个方案做对了一件事：<strong>约定即注册</strong>。文件放进 <code>middleware/</code> 就自动被收录，文件名就是它的名字，页面按名引用即可，不用再去维护一张路由表，也不用在配置文件里登记。逻辑集中在一处，页面按需挂载。
    </p>

    <h2>页面声明与挂载</h2>
    <ul>
      <li><strong>命名中间件默认不生效。</strong>文件放对目录不等于会执行，页面必须在 <code>definePageMeta</code> 里声明它；漏了声明不报错，只是安静地不跑——开场那一幕就是这么来的。</li>
      <li>一个页面要跑多个判断，就得写成数组 <code>middleware: ['auth', 'admin']</code>，执行顺序就是数组顺序；写反了（先查权限、后查登录）时，前面的中间件拿不到已经确定的登录态而误判。</li>
      <li>「每次导航都要跑」的统计逻辑如果也用命名中间件，就得每个页面声明一遍；新加的页面忘了写，那一页的埋点就丢了。</li>
      <li>名字对不上同样不报错：文件叫 <code>auth.ts</code>，页面里却引用 <code>'authGuard'</code>，中间件被安静地跳过。</li>
    </ul>

    <h2>全局中间件注册</h2>
    <p>
      先补上「全站都要跑」的那一类。把无差别生效的逻辑放进以 <code>.global</code> 结尾的文件，例如 <code>middleware/stats.global.ts</code>，它会自动对所有路由生效，不需要任何页面声明。至此三类中间件的顺序也定下来了：<strong>全局中间件 → 页面声明的命名中间件（按数组顺序）→ 内联中间件</strong>。
    </p>
    <p>
      接着补上「只跟这一个页面强相关、不值得单独建文件」的判断：<strong>内联中间件</strong>，直接把函数写进 <code>definePageMeta</code> 的 <code>middleware</code> 数组里。比如详情页判断 <code>to.params.id === 'forbidden'</code> 就 <code>navigateTo('/')</code>，就地收尾。
    </p>
    <p>
      然后统一「放行与中止」的语义，这四种返回值要记牢：
    </p>
    <ol class="lesson-steps">
      <li>什么都不返回 → <strong>放行</strong>，继续走后面的中间件与正式的导航流程。</li>
      <li><code>return navigateTo('/login')</code> → <strong>重定向</strong>到新路由。</li>
      <li><code>return abortNavigation()</code> → <strong>原地中止</strong>，停在当前页面不动。</li>
      <li><code>return abortNavigation(new Error('无权限'))</code> → 中止并抛出错误，交给错误处理。</li>
    </ol>
    <p>
      把开场那条完整的拦截链串起来：中间件里读 <code>to.meta</code> 与登录态，构造出「未登录访问后台 → 重定向登录页」，登录后放行、权限不足则中止。判断逻辑只有一处，页面只负责声明它需要哪几道关卡。
    </p>
    <p>
      最后是这条链路最容易翻车的一点：<strong>中间件在服务端渲染与客户端导航中都会执行</strong>，两端必须跑得通。要判断登录态，读的数据源也得在两端都存在——用 cookie 或 <code>useState</code>，而不要只读 <code>localStorage</code>，它在服务端根本不存在，服务端那一次执行会直接判成「未登录」甚至报错。同理，全局中间件对每条路由都跑，公开页面要自己显式放行。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>用返回布尔值冒充结果——<strong>放行就是「不返回」</strong>，拦截要用 <code>navigateTo</code> 或 <code>abortNavigation</code>，返回 <code>true</code> / <code>false</code> 不会产生任何拦截效果；把只有浏览器才有的 API（<code>window</code>、<code>localStorage</code>）写进中间件——客户端导航时看着正常，服务端渲染那一次会直接出错。
    </div>

    <h2>三类中间件对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「命名中间件 / 全局中间件 / 页面内联中间件」三个页签，对照它们的定义代码与使用方式，就能看清「哪种放哪个目录、要不要在页面里声明」；下方表格列出 <code>navigateTo</code> 与 <code>abortNavigation</code> 三个导航控制方法的用法。</figcaption>
      <N11Middleware />
    </figure>

    <h2>执行顺序与放行规则</h2>
    <p>
      路由中间件把「跳转前该跑的逻辑」从每个页面里抽出来，集中到 <code>middleware/</code> 一处：命名中间件由页面用 <code>definePageMeta</code> 按需挂载，<code>.global</code> 后缀让它对全站生效，内联中间件承接一时之需。执行顺序是全局 → 命名 → 内联，放行靠「不返回」、拦截靠 <code>navigateTo</code> / <code>abortNavigation</code>，而这一切都要在两端都成立。
    </p>
    <div class="lesson-term">
      <span class="term-name">「同构（isomorphic）」</span>指同一段代码同时运行在服务端与客户端两套环境里，并保持行为一致。Nuxt 的路由中间件就是同构执行的：SSR 首屏那一次导航与后续的客户端路由跳转都会调用它。边界：同构意味着中间件里<strong>不能依赖只有一端存在的 API</strong>（<code>window</code>、<code>localStorage</code>、<code>document</code>），两端都要读的数据应放在 cookie 或 <code>useState</code> 里；「同构」也不等于「两端结果必然相同」，涉及当前时间、随机数、端侧存储时仍需显式区分。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
