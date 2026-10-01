<script setup lang="ts">
import X16LoadingError from './X16LoadingError.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台点进某篇文章详情，接口忽然挂了——为什么整页直接白屏，连一句「出错了，请重试」都不给，反而要用户自己刷新整个网站？
    </div>

    <h2>三种异常状态</h2>
    <p>
      任意一个真实页面，除了「正常显示」之外，至少还有三种状态：<strong>还在加载、出错了、内容不存在</strong>。课程站里这些场景天天发生——列表数据要等、接口偶尔超时、用户点进一个已删除的文章。如果只写了「成功」这一条路径，剩下三种状态就全砸在用户脸上了。
    </p>
    <p>
      更糟的是「白屏」：当组件里抛出一个没人接住的错误，React 会卸载整棵子树，用户看到的是一片空白，连发生了什么都不知道。一个成熟的站，必须让页面学会<strong>体面地失败</strong>。
    </p>

    <h2>页面内自管状态</h2>
    <p>
      最省事的做法是在每个页面里自己管状态：加一个 <code>loading</code> 变量，请求前置真、请求完置假；再 <code>try/catch</code> 一下错误，捕获到就把 <code>error</code> 渲染成一句提示。
    </p>
    <p>
      它做对的地方是<strong>意识到状态不止一种</strong>——页面不只是「有数据」和「没数据」，还有中间那段等待、以及处理失败的余地。这个认知是一切的基础。
    </p>

    <h2>手写状态样板重复</h2>
    <ul>
      <li>样板重复：每个页面都要重写一遍 loading 与 error 的变量和判断。</li>
      <li>接不住抛错：组件渲染过程中抛出的错误，<code>try/catch</code> 管不到，直接白屏。</li>
      <li>404 无处统一：内容不存在时，缺少一个标准、可复用的「未找到」处理。</li>
      <li>根布局兜底缺失：如果连最外层布局都出错，上面页面级的处理都来不及生效。</li>
    </ul>

    <h2>约定文件就近接管</h2>
    <p>
      与其在每个页面里重复这套逻辑，不如<strong>把几种状态交给一组约定文件去接管</strong>。它们按目录就近匹配，写法固定，放在哪一层就在哪一层生效。
    </p>
    <p>
      第一个是<strong>加载</strong>：在同目录放一个 <code>loading.tsx</code>，它会自动把一个 Suspense 边界包在 <code>page.tsx</code> 外面，导航时先显示这里的内容。它等价于手写 <code>&lt;Suspense fallback={...}&gt;&lt;Page /&gt;&lt;/Suspense&gt;</code>，只是由约定替你写好。
    </p>
    <p>
      第二个是<strong>错误</strong>：<code>error.tsx</code> 是一个错误边界，能接住子组件里抛出的错误。它有两个必须记住的约束——文件顶部必须写 <code>'use client'</code>（因为要用 <code>reset</code> 做交互，属于客户端组件）；它<strong>不会捕获同一层 <code>layout</code> 的错误</strong>，只负责它下面的子内容。
    </p>
    <p>
      它接收 <code>error</code> 和 <code>reset</code> 两个参数：前者用于把错误记录到监控服务，后者能把这一段重新渲染一次，也就是「重试」按钮背后的动作。
    </p>
    <p>
      第三个是<strong>未找到</strong>：<code>not-found.tsx</code> 负责 404。它既能被不存在的路径触发，也能被主动调用——在页面里查到数据为空时，直接执行 <code>notFound()</code>，就会渲染最近的 404 页面，把「数据不存在」和「地址错了」统一成同一种体验。
    </p>
    <p>
      第四个是<strong>根级兜底</strong>：<code>global-error.tsx</code> 专门接住根布局自身的错误。因为它出场时根布局可能已经坏了，所以它<strong>必须自带 <code>html</code> 和 <code>body</code> 标签</strong>，自己完成整份文档的渲染。
    </p>
    <p>
      这四者是<strong>就近匹配、逐层向上冒泡</strong>的关系：错误先找离它最近的 <code>error.tsx</code>，那里没有就继续往上找，最后才轮到 <code>global-error.tsx</code>。所以通常只在真正需要的层级放这些文件，而不是每层都摆一份。
    </p>
    <p>
      落地时建议按「就近」来放：只在真正需要独立骨架或容错的那一层加，而不是每个目录都摆一份。层级越近，接管的范围越小、影响面越可控；放得过高，反而会让本来能正常显示的兄弟区域一起被错误边界兜走，得不偿失。
    </p>
    <div class="lesson-box warn">
      <strong>重试按钮的边界：</strong><code>reset</code> 只会重新渲染出错的那一段，能治好「偶发的网络抖动」。但如果失败的根因一直存在（比如后端持续返回 500），用户会陷入「点了又错」的循环。这种时候要做的是<strong>降级</strong>——给一段静态提示或备用内容，而不是无限重试同一个必然失败的请求。
    </div>

    <h2>四类异常接管归属</h2>
    <figure class="lesson-figure">
      <figcaption>分别在加载、出错、404 与根级崩溃四种情况下，看哪一个约定文件接管了界面。</figcaption>
      <X16LoadingError />
    </figure>

    <h2>按目录就近兜底</h2>
    <p>
      让页面「体面地失败」，靠的不是在每个页面里重复写状态判断，而是四个按目录就近匹配的约定文件：<code>loading.tsx</code> 管加载、<code>error.tsx</code> 管错误与重试、<code>not-found.tsx</code> 管 404、<code>global-error.tsx</code> 管根布局兜底。错误逐层向上冒泡，<code>error.tsx</code> 必须是客户端组件且接不住同级布局的错误；重试治的是偶发故障，持续故障要靠降级。
    </p>
    <div class="lesson-term">
      <span class="term-name">「加载与错误约定文件」</span>是 App Router 用文件名约定的一组状态 UI：<code>loading.tsx</code> 自动为 page 创建 Suspense 边界；<code>error.tsx</code> 捕获子组件错误（必须为 Client Component，提供 <code>reset</code> 重试，但不捕获同级 layout 的错误）；<code>not-found.tsx</code> 处理 404，可用 <code>notFound()</code> 主动触发；<code>global-error.tsx</code> 是根布局出错时的兜底，需自带 <code>html</code> 与 <code>body</code>。错误就近匹配、逐层向上冒泡。
    </div>
  </LessonArticle>
</template>
