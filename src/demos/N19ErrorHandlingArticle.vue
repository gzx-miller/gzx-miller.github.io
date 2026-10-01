<script setup lang="ts">
import N19ErrorHandling from './N19ErrorHandling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户访问了一个不存在的地址，看到的是你站点完全没见过的默认英文报错页；另一个同事改坏了一个组件，线上用户页面直接白屏，而你的监控里安安静静——明明都叫「出错了」，一个发生在你没写的页面里，一个发生在你写的组件里，为什么它们落到了完全不同的地方，你一个都没接住？
    </div>

    <h2>三类错误来源</h2>
    <p>
      一个 Nuxt 应用里的错误来自<strong>至少三个互不相同的层</strong>：路由层的 404 与 500（访问了不存在的路由，或服务端渲染时抛错）、Vue 组件的运行时错误（某次渲染或响应的执行里抛了异常）、以及接口请求的错误（请求后端失败或后端返回了错误状态）。
    </p>
    <p>
      旧办法是在每个组件里 <code>try/catch</code>，或者用 <code>if</code> 去判断数据有没有。它有两三笔必须由人承担的成本。第一，<strong>重复且分散</strong>：每个取数据的地方都要复写一遍同样的判断，业务逻辑被错误处理淹没。第二，<strong>根本拦不到</strong>：路由级错误（一个不存在的 URL、一次服务端渲染崩溃）压根不在你写的组件里，组件级的 <code>try/catch</code> 没有机会执行，用户就只能吃框架默认的丑陋页面。第三，<strong>错了之后回不来</strong>：没有一个统一的入口把用户从错误状态里带回正常页面。
    </p>
    <p>
      于是问题落到：<strong>404/500、组件运行时错误与接口错误分别该由谁来接，怎么让错误页长成自己的样子，又怎么在出错后把人送回正常流程？</strong>
    </p>

    <h2>全局错误页放置</h2>
    <p>
      在项目根目录放一个 <code>error.vue</code>，它接收一个包含 <code>statusCode</code>、<code>statusMessage</code>、<code>url</code> 的 <code>error</code> prop，用它统一渲染路由级错误页。
    </p>
    <p>
      这个方案做对了一件事：<strong>错误页从「框架默认」变成了「你定义的一页」</strong>。所有路由级错误有了一个统一出口，你可以决定它长什么样、给什么文案、放什么操作按钮。
    </p>

    <h2>错误页脱离布局</h2>
    <ul>
      <li><code>error.vue</code> <strong>不经过常规布局渲染</strong>：直接放进去的页面缺少导航栏和页脚，看起来像是从站点里掉出来的一页。</li>
      <li>它只接路由与渲染级错误。Vue 组件运行时抛的异常未必走到这里，你没有机会知道它，更别说上报。</li>
      <li>接口错误的形态又不一样：<code>useFetch</code> 把错误放在 <code>error</code> 属性里而不抛出，<code>$fetch</code> 却会抛出异常——两种写法混用，就会漏掉其中一半。</li>
      <li>想把用户从错误页带回首页，需要「清除错误状态 + 导航」两个动作，没有现成入口就只能让用户自己点返回。</li>
    </ul>

    <h2>三层错误逐层拦截</h2>
    <p>
      不推翻 <code>error.vue</code>，而是<strong>按错误的层次逐层接住</strong>。
    </p>
    <p>
      第一步，路由级继续交给 <code>error.vue</code>，但在它内部<strong>按 <code>error.statusCode</code> 区分 404 与 500</strong>，分别给出「页面不存在」与「服务异常」的文案——把两种性质截然不同的失败混成一句「出错了」，用户和排查的人都失去了线索。同时记住它不套常规布局，需要自行组织页面所需的布局结构。
    </p>
    <p>
      第二步，捕获组件运行时错误。在插件里用 <code>nuxtApp.hook('vue:error', (error, instance, info) =&gt; { ... })</code> 捕获，为它接上监控上报；应用级的错误则用 <code>app:error</code> hook。这一步的意义是<strong>让错误不再无声无息</strong>——生产环境应当接入 Sentry 之类的服务，而不是只打 <code>console</code>，否则你就只能等用户来告诉你白屏了。
    </p>
    <p>
      第三步，就地处理接口错误，并且分清两种写法。用 <code>useFetch</code> 时把 <code>const { data, error, pending } = await useFetch('/api/users')</code> 解构出来，模板里先判 <code>error</code>、再判 <code>pending</code>、最后渲染 <code>data</code>；要做命令式的流程控制就用 <code>$fetch</code> 配 <code>try/catch</code>。如果你希望请求错误和响应错误分开处理，<code>useFetch</code> 还提供 <code>onRequestError</code> 与 <code>onResponseError</code> 两个回调，分别在请求失败和响应状态异常时触发。
    </p>
    <p>
      第四步，把「主动报错」和「清除错误」补齐。服务端需要表达错误时用 <code>createError({ statusCode: 404, statusMessage: '资源不存在' })</code> 抛出；用户点「返回首页」时用 <code>clearError({ redirect: '/' })</code> 清除错误状态并导航——<strong>不传 <code>redirect</code> 就留在当前页面</strong>，这一点决定了按钮点下去是「回到首页」还是「原地重试」。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的点：</strong>一是生产环境不要只依赖 <code>console</code> 日志，组件运行时错误必须通过 <code>vue:error</code> 之类钩子送到监控服务，否则线上白屏你无从知晓；二是 <code>error.vue</code> 里务必按 <code>statusCode</code> 分开处理，把 500 当成 404 展示，会让用户以为是自己输错了地址，也让排查失去最重要的那条线索。
    </div>

    <h2>类型速查表对照</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「错误页面 / 错误钩子 / API 错误」，右侧固定一张「错误类型速查」表，把 404、500、API Error、Hydration Mismatch、Vue Runtime Error 各自「由谁接住」列了出来。先看每个页签的代码，再回到表里找它的行——用这张表就能把「哪一层错误归哪个机制管」对上号。</figcaption>
      <N19ErrorHandling />
    </figure>

    <h2>分层错误处理链</h2>
    <p>
      Nuxt 的错误处理是一条分层的链，而不是一个万能兜底：路由级 404/500 交给 <code>error.vue</code>，组件运行时错误经 <code>vue:error</code> 钩子捕获并上报，接口错误用 <code>useFetch</code> 的 <code>error</code> 或 <code>$fetch</code> 的 <code>try/catch</code> 就地处理，主动报错与状态清除则由 <code>createError</code> 和 <code>clearError</code> 成对完成。先问「这个错误发生在哪一层」，再选对应的出口。
    </p>
    <div class="lesson-term">
      <span class="term-name">「createError」</span>Nuxt 与 h3 提供的主动抛错工具，接收 <code>{ statusCode, statusMessage, message, data }</code> 等字段，抛出后由框架统一转换成带状态码的错误响应，或触发错误页。<strong>边界</strong>：在服务端 API 里它决定响应的 HTTP 状态码，不指定就退化成 500「服务器内部错误」；在客户端调用会触发错误页；它与负责「清除错误状态并可 <code>redirect</code> 导航」的 <code>clearError</code> 配套使用，二者一抛一清，构成完整的错误生命周期。
    </div>
  </LessonArticle>
</template>
