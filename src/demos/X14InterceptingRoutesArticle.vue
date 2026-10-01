<script setup lang="ts">
import X14InterceptingRoutes from './X14InterceptingRoutes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>照片墙点击缩略图，希望弹窗看图、不离开列表；可这条大图链接要是发给朋友，点开又应该是一个能全屏看、能被搜索引擎收录的页面——同一个地址，怎么能既是弹窗又是整页？
    </div>

    <h2>弹层与整页双态</h2>
    <p>
      你在做课程站的图片展示区：网格里排着缩略图，点击某张希望在当前页上方弹出一个浮层看大图，关掉后回到原来的位置。同时，这些图片各有自己的地址，用户会复制链接分享，甚至有人从搜索引擎直接点进来。
    </p>
    <p>
      这就出现了一个矛盾：<strong>站内点击希望「不跳走」，站外访问希望「独立成页」</strong>。如果只做弹窗，分享出去的链接打开还是列表页；如果只做整页，站内点击就失去了流畅的浮层体验。
    </p>

    <h2>状态控制的弹窗</h2>
    <p>
      最省事的做法是用状态控制显隐：一个 <code>useState</code> 管住 <code>isOpen</code>，点击缩略图把它设为真，弹层出现；点关闭再设为假。图片地址直接写死在组件里。
    </p>
    <p>
      它把「弹窗」这件事用最少的代码做到了——<strong>交互是即时的，不涉及任何路由跳转</strong>，视觉上完全满足站内浏览的需求。
    </p>

    <h2>仅靠状态的缺陷</h2>
    <ul>
      <li>URL 不变：弹窗打开时地址栏还是列表页，链接无法分享给具体某张图。</li>
      <li>刷新即丢：用户一刷新，弹窗状态没了，直接回到列表。</li>
      <li>前进后退错乱：浏览器历史里没有这一步，点后退会直接离开页面。</li>
      <li>无法深链接：想单独展示一张图，只能再做一套页面，重复劳动。</li>
    </ul>

    <h2>拦截路由的机制</h2>
    <p>
      要同时满足两种体验，思路是：<strong>给同一份内容准备两个版本，由「怎么到达」来决定显示哪个</strong>。Intercepting Routes 正是干这个的——它用一组前缀符号拦截其他路由，让客户端导航命中的是「拦截版」，而直接访问或刷新命中的是「真实版」。
    </p>
    <p>
      具体落地时，真实版就是普通的动态页面：<code>app/photo/[id]/page.tsx</code>，直接访问 <code>/photo/123</code> 时渲染一个全屏页。拦截版放在并行路由的插槽里：<code>app/@modal/(.)photo/[id]/page.tsx</code>，从列表页点 <code>Link</code> 导航过去时命中它，渲染成一个浮层。
    </p>
    <p>
      布局同时接收 <code>children</code> 和 <code>modal</code> 两个插槽，把 <code>modal</code> 叠在 <code>children</code> 之上。拦截版是客户端组件，关闭时调用 <code>router.back()</code>：<strong>退回上一步，URL 也就自然恢复成列表页</strong>，弹层随之消失——不需要手动再维护一个「关掉」的状态。
    </p>
    <p>
      前缀符号的层级关系要记准，它决定「拦截哪一层目录」：
    </p>
    <table>
      <thead>
        <tr><th>前缀</th><th>含义</th></tr>
      </thead>
      <tbody>
        <tr><td><code>(.)</code></td><td>同级拦截</td></tr>
        <tr><td><code>(..)</code></td><td>上一级拦截</td></tr>
        <tr><td><code>(..)(..)</code></td><td>上两级拦截</td></tr>
        <tr><td><code>(...)</code></td><td>从根目录拦截</td></tr>
      </tbody>
    </table>
    <p>
      也别忘了给插槽一个 <code>default.tsx</code>，让它在没有拦截匹配时什么都不渲染（返回 <code>null</code>），这样普通访问页面时就不会凭空多出一个空浮层。
    </p>
    <div class="lesson-box warn">
      <strong>最容易失效的地方：</strong>拦截版目录的层级<strong>必须和真实路径对齐</strong>。<code>(.)</code> 指的是「真实页面所在的那一层目录」，前缀或层级写错了，拦截就不会生效，点击时会直接跳到真实全屏页——而你还以为是别处写错了。改目录结构时，拦截前缀要跟着一起改。
    </div>
    <p>
      使用时还有一个容易忽略的细节：触发弹窗的那次跳转必须是「客户端导航」（例如 <code>Link</code> 组件或 <code>router.push</code>），而浏览器直接输入地址或硬刷新走的是真实版。正是这条分界线，让拦截版与真实版各司其职；联调时也可以用「从列表点」和「直接打开」两种方式分别验证，看是否各自命中预期的那一份内容。
    </p>
    <p>
      这套机制也解释了为什么它常和并行路由一起出现：拦截版需要一个「叠在内容之上」的插槽来承载，而并行路由正好提供了这个位置。两者配合，才让「同一个 URL 的两种打开方式」成立。
    </p>

    <h2>两种到达的对比</h2>
    <figure class="lesson-figure">
      <figcaption>从列表点进去看弹窗效果，再对比直接打开同一地址时的全屏页面。</figcaption>
      <X14InterceptingRoutes />
    </figure>

    <h2>同址分流逻辑</h2>
    <p>
      拦截路由让「点击导航」和「直接访问」走两条不同的渲染分支：客户端导航命中拦截版（弹窗），刷新或直接打开命中真实版（全屏），两者共享同一个可分享的 URL。目录层级要用 <code>(.)</code>、<code>(..)</code>、<code>(...)</code> 与真实路径对齐，关闭时用 <code>router.back()</code> 让浏览器历史替我们收尾。
    </p>
    <div class="lesson-term">
      <span class="term-name">「拦截路由」</span>指用 <code>(.)</code>（同级）、<code>(..)</code>（上级）、<code>(..)(..)</code>（上两级）、<code>(...)</code>（根级）前缀定义的路由版本，用来拦截真实路径。客户端导航时命中拦截版（如模态框），直接访问或刷新时命中真实版（如全屏页），同一 URL 提供两种体验。常配合并行路由的 Modal 插槽使用，关闭时 <code>router.back()</code> 恢复 URL，且目录层级必须与真实路径对齐。
    </div>
  </LessonArticle>
</template>
