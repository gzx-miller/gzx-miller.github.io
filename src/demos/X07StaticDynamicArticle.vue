<script setup lang="ts">
import X07StaticDynamic from './X07StaticDynamic.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>博客列表页构建一次就一直显示旧文章，可后台那个「欢迎回来，某某」的页面每次刷新都能读出当前登录的人——同样是页面，为什么一个像印好的海报，一个像每次都现场重画的菜单？
    </div>

    <h2>提出问题</h2>
    <p>
      同一个站点里的页面，对「新」的要求并不一致。文章列表、营销落地页这类内容可能几天才变一次，用户没必要每次都等服务器现算；而登录后的仪表盘、带用户身份或依赖当前查询串的页面，则<strong>必须针对每次请求重新计算</strong>，否则就会把 A 用户的数据显示给 B 用户。
    </p>
    <p>
      这对性能与正确性影响都很大。全都「每次现算」，服务器压力大、首屏慢，也没法交给 CDN 缓存；全都「提前算好」，带用户身份的内容又会串味。真正要回答的是：<strong>框架凭什么判断一个页面该在构建时生成，还是该在每次请求时执行？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的思路，是把「渲染时机」当成人手动指定的配置：想让页面随请求变化就自己去标注，否则一律提前生成。它做对了一件事——<strong>承认两种渲染时机确实需要共存</strong>，而不是非此即彼。
    </p>
    <p>
      但纯靠人记很容易出错：新加了一行读取用户 Cookie 的代码，却忘了把页面改成动态，结果内容被缓存下来串了用户，排查十分隐蔽。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>手工标注渲染时机易漏：改了数据来源却忘了改配置，就会拿错缓存。</li>
      <li>不清楚哪些写法会「意外」让页面变得不能缓存，性能悄悄退化。</li>
      <li>没办法一眼看出某条路由当前是静态还是动态，只能靠猜。</li>
      <li>内容偶尔变化时，纯静态会让用户长期看到旧内容，纯动态又太浪费。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「两种时机共存」，而是让框架<strong>根据代码里用到的能力</strong>自动判断，并给需要强制干预的场景留出开关。
    </p>
    <p>
      默认情况下，路由若不包含任何与「当前请求」相关的信息，Next.js 会做<strong>静态渲染</strong>：构建时生成 HTML，之后所有用户拿到同一份，可被 CDN 缓存，首屏最快。反过来，只要组件树里用到了<strong>动态函数</strong>——例如 <code>cookies()</code> 读取 Cookie、<code>headers()</code> 读取请求头，或读取 <code>searchParams</code>——整条路由就转为<strong>动态渲染</strong>，在每次请求时执行。
    </p>
    <table>
      <thead>
        <tr><th>触发条件</th><th>渲染类型</th></tr>
      </thead>
      <tbody>
        <tr><td>不含动态 API、数据可缓存</td><td>静态渲染（构建时生成）</td></tr>
        <tr><td>调用 <code>cookies()</code> 或 <code>headers()</code>、读取 <code>searchParams</code></td><td>动态渲染（每次请求）</td></tr>
        <tr><td>显式 <code>cache: 'no-store'</code></td><td>动态渲染（每次请求）</td></tr>
      </tbody>
    </table>
    <p>
      这里容易踩空：<strong>「用了动态函数」是路由级的</strong>。不是只有用到它的组件变动态，而是组件树里<strong>任意一处</strong>用了 <code>cookies()</code> 或 <code>headers()</code>，整条路由都会跟着变动态。因为这些值在构建时根本不存在，框架无法把结果提前固化。
    </p>
    <p>
      接着是版本差异。<strong>早期版本里 <code>fetch</code> 默认会缓存</strong>，不加参数也会命中；<strong>较新版本（15+）中 <code>fetch</code> 默认不再缓存</strong>。因此，若希望数据是可缓存的静态内容，就要显式声明缓存策略。Next.js 16 进一步引入 Cache Components（<code>use cache</code>）的思路，把「哪些部分可静态、哪些随请求变化」表达得更显式，支持「静态外壳 + 动态内容」的组合。
    </p>
    <p>
      自动判断不满足时，可用路由级配置强制干预：导出 <code>dynamic = 'force-static'</code> 会强制静态（此时用了动态函数会直接报错，等于把问题提前暴露），导出 <code>dynamic = 'force-dynamic'</code> 则强制每次请求都执行，默认值 <code>'auto'</code> 交给框架判断。
    </p>
    <p>
      最后解决「内容偶尔才变」的中间地带，用的是增量静态再生成（ISR）：通过 <code>export const revalidate = 60</code> 或给单个 <code>fetch</code> 加 <code>next: { revalidate: 60 }</code>，让静态页面每隔一段时间在后台重新生成一次。这样大多数请求命中缓存、速度很快，内容又不会长期滞留。配合 <code>generateStaticParams</code>，还能为一批动态路由预先静态化，未列出的再按需生成。
    </p>
    <div class="lesson-box hint">
      <strong>排查小贴士：</strong>执行 <code>next build</code> 后会输出一张路由表，用标记区分渲染类型——<code>○</code> 表示静态、<code>λ</code> 表示动态。想确认某页面属于哪种，看这张表比凭直觉猜可靠。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换页面用到的能力，看它是被判定为构建时生成的静态页，还是每次请求的动态页。</figcaption>
      <X07StaticDynamic />
    </figure>

    <h2>总结</h2>
    <p>
      静态与动态渲染这一课，重点是「渲染时机由代码依赖决定」：不含请求相关信息、数据可缓存的路由做静态渲染，交给 CDN 缓存；一旦用到 <code>cookies()</code>／<code>headers()</code>／<code>searchParams</code> 或显式禁用缓存，整条路由转为动态。需要干预时用 <code>dynamic</code> 强制，需要折中时用 <code>revalidate</code> 做 ISR。
    </p>
    <div class="lesson-term">
      <span class="term-name">「静态与动态渲染」</span>指同一框架下的两种渲染时机：静态渲染在构建时生成 HTML，可被 CDN 缓存、首屏最快；动态渲染在每次请求时执行，适合依赖用户身份或查询串的内容。只要组件树中<strong>任意一处</strong>使用了 <code>cookies()</code>、<code>headers()</code>、<code>searchParams</code> 或 <code>cache: 'no-store'</code>，整条路由即转为动态。可用 <code>export const dynamic</code> 强制指定，用 <code>export const revalidate</code> 或 <code>next.revalidate</code> 做增量静态再生成。较新版本 <code>fetch</code> 默认不再缓存，需要缓存时应显式声明。
    </div>
  </LessonArticle>
</template>
