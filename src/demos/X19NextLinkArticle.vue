<script setup lang="ts">
import X19NextLink from './X19NextLink.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台列表里筛好条件、翻到第三页，点进一条详情再点返回，筛选条件全没了、又回到第一页——为什么只是换个页面，整站却像被重新打开了一遍？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做后台管理，左边是侧边栏，右边是内容区。用户的实际操作是「列表 → 详情 → 返回列表」这样来回跳，节奏很快。你一开始用的是普通链接和按钮，能用，但每一次跳转都伴随着一次白屏，之后所有数据重新请求，滚动位置和筛选状态也一起丢了。
    </p>
    <p>
      这背后是一个容易忽略的事实：<strong>传统的页面跳转是「重新下载一整页」</strong>。浏览器向服务器请求新文档，清空当前页面，从头渲染。可内容是前端应用渲染的，真正变化的往往只有中间那一小块——导航栏、侧边栏、甚至滚动状态，本不该跟着重来一遍。所以问题的实质是：<strong>能不能只更新变化的部分，而不是重启整个页面</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法就是用原生 <code>&lt;a&gt;</code> 标签。写清楚目标地址，浏览器负责跳转，不用写任何 JavaScript。它的优点是可靠、可被爬虫理解，新标签页打开、复制链接这些行为也天然正确。
    </p>
    <p>
      但它的代价也正来自「可靠」：每次跳转都是一次完整的文档请求。对于靠前端路由运转的应用来说，这相当于<strong>用整页刷新的代价，换取一次局部内容的更新</strong>，大部分工作都是白做的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>跳转时整页重载，用户先看到白屏，再看到内容，体验明显断裂。</li>
      <li>公共外壳（导航、侧边栏）每次都被重建，理论上不该重来的部分也跟着重来。</li>
      <li>前端组件的状态、输入框里的内容、滚动位置在跳转后全部丢失。</li>
      <li>所有资源要重新解析与请求，首屏之后每次导航都付一次全量成本。</li>
      <li>没有「提前准备下一屏」的机会，用户感受不到任何加速。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      换用 <code>next/link</code> 的 <code>Link</code> 组件。它渲染出来仍然是可点击、可复制、对爬虫友好的链接，但会<strong>拦截站内点击，改由前端路由接管</strong>：只向服务器取当前路由需要的数据，然后就地更新页面，公共外壳保持不动。这就是客户端导航。
    </p>
    <p>
      客户端导航还带来一个隐形加速：<strong>预取</strong>。默认情况下，静态路由的链接一旦进入视口，框架就会在后台提前取好目标路由的数据；动态路由则倾向在点击时才发起。想手动控制时可以用 <code>prefetch</code> 属性显式打开或关闭——对「用户很可能点」的链接提前准备，对「顺带出现在页面里」的链接省下流量。
    </p>
    <p>
      几个常用属性也值得记住：<code>replace</code> 会让跳转替换当前历史记录而不是新增一条，适合「登录后跳首页」这类不该回退到的场景；<code>scroll</code> 控制跳转后是否回到顶部。
    </p>
    <p>
      有些跳转无法写成链接，比如提交表单成功后跳转、或根据条件决定去向。这时用 <code>useRouter</code> 做程序式导航：<code>push</code> 新增一条历史、<code>replace</code> 替换当前、<code>back</code> 与 <code>forward</code> 对应浏览器前进后退，<code>refresh</code> 则重新拉取当前路由的数据以清除客户端缓存。
    </p>
    <p>
      导航还需要知道「我现在在哪」。用 <code>usePathname</code> 读取当前路径，就能给命中的导航项加上高亮；用 <code>useSearchParams</code> 读取查询串，可以做「搜索关键词回填」这类联动。注意这些 Hook 都只能用在客户端组件里。
    </p>
    <p>
      最后是服务端重定向：<code>redirect</code> 与 <code>permanentRedirect</code>。它们适合在服务端判断后再跳，比如未登录访问后台就跳到登录页。有一点必须记住：
    </p>
    <div class="lesson-box warn">
      <strong>两个必踩的坑：</strong>App Router 里这些导航 API 一律从 <code>next/navigation</code> 导入，而不是旧版的 <code>next/router</code>，导错包会直接报错；另外 <code>redirect</code> 是靠<strong>抛出一个特殊异常</strong>来中断渲染的，如果把它放进 <code>try/catch</code> 里又恰好把异常捕获了，重定向就会失效——它应当放在数据校验之后、且不要被异常捕获包住。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点几下示例里的链接与按钮，感受客户端导航、预取与程序式跳转的差别。</figcaption>
      <X19NextLink />
    </figure>

    <h2>总结</h2>
    <p>
      导航优化的核心判断只有一句：<strong>能局部更新，就不要整页重来</strong>。<code>Link</code> 负责站内快速跳转并顺带预取，<code>useRouter</code> 负责需要程序控制的场合，<code>redirect</code> 负责服务端判断后的改道。选错 API 或导错包，会让这份优化瞬间落空。
    </p>
    <div class="lesson-term">
      <span class="term-name">「客户端导航」</span><code>next/link</code> 的 <code>Link</code> 拦截站内点击，改由前端路由局部更新页面并自动预取（静态路由进视口预取、动态路由点击时预取）；<code>useRouter</code> 提供 <code>push</code>/<code>replace</code>/<code>back</code>/<code>refresh</code> 等程序式导航，<code>redirect</code> 与 <code>permanentRedirect</code> 用于服务端重定向。App Router 的导航 API 一律从 <code>next/navigation</code> 导入，且 <code>redirect</code> 不要放进 <code>try/catch</code>。
    </div>
  </LessonArticle>
</template>
