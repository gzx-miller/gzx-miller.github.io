<script setup lang="ts">
import X08StreamingSuspense from './X08StreamingSuspense.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>仪表盘上顶部标题和几个统计数字早就该出来了，可整页就是白屏不动，非要等最慢的那个图表接口返回才一起显示——为什么快的部分要被慢的拖住，不能先给用户看点东西？
    </div>

    <h2>快慢模块共存</h2>
    <p>
      一个页面里往往混着快慢悬殊的模块。头部标题几乎瞬间就绪，统计数字查一次数据库就能回来，而营收图表可能要调很慢的第三方接口。如果服务端坚持「把数据拿齐再一起发给浏览器」，那么<strong>整页的首屏时间就被最慢的那一环决定</strong>：快的部分明明能马上用，却只能陪着一起等。
    </p>
    <p>
      矛盾在于：服务端渲染天然是「先算完、再输出 HTML」的线性流程，而各部分的就绪时间并不一致。要让用户尽早看到内容，就得允许 HTML <strong>分批地、按到达顺序</strong>送到浏览器，而不是攒成一大块。问题是，怎么在代码里表达「这一块可以先等、那一块先发」？
    </p>

    <h2>整页等待策略</h2>
    <p>
      最小的一步，是承认「数据必须等」，于是整页一起 <code>await</code> 完再返回。它做对了一件事——<strong>实现简单、结果确定</strong>，页面要么完整出现，要么干脆还没出现，不会出现半成品。
    </p>
    <p>
      但代价是把所有模块绑成同一根时间线：一个慢请求就会堵住整页，用户面对的是长时间白屏，而不是「先看到框架、再逐块填满」。
    </p>

    <h2>最慢模块拖累</h2>
    <ul>
      <li>首屏被最慢的组件拖住，快组件只能陪跑，用户等待体感很差。</li>
      <li>没有「部分已就绪」的表达，无法先给用户一个骨架。</li>
      <li>页面级 <code>loading.tsx</code> 只覆盖整条路由的等待，粒度太粗，管不了页面内部的慢模块。</li>
      <li>多个互不依赖的数据块仍按串行等待，浪费并行的时间。</li>
    </ul>

    <h2>流式渲染改造</h2>
    <p>
      不推翻「服务端渲染」，而是把输出方式从「一次性」改为<strong>流式（Streaming）</strong>：服务端把已渲染的 HTML 分块发出去，浏览器边收边渲染。用户因此能很早看到骨架与已就绪的内容，慢的部分准备好再补上。
    </p>
    <p>
      用来划分「哪一块可以先等」的工具，是 React 的 <code>&lt;Suspense&gt;</code> 边界。把慢的异步组件用 <code>&lt;Suspense&gt;</code> 包起来并给一个 <code>fallback</code>：渲染到这里时，若该组件的数据还没回来，就<strong>先把 <code>fallback</code>（通常是一个骨架屏）发出去</strong>，继续渲染后面的内容；等数据就绪，再把真正的 HTML <strong>流式替换</strong>进去。
    </p>
    <ol class="lesson-steps">
      <li>把快速组件直接渲染，它会出现在最早的一批 HTML 里。</li>
      <li>把慢组件用 <code>&lt;Suspense fallback={骨架屏}&gt;</code> 包裹。</li>
      <li>服务端遇到该边界时，先输出 <code>fallback</code>，不在这里阻塞。</li>
      <li>慢组件数据 <code>resolve</code> 后，把真实内容流式发送并替换掉骨架。</li>
    </ol>
    <p>
      这套机制能成立，前提是慢组件本身是<strong>异步的 Server Component</strong>，内部用 <code>await</code> 取数据。服务端渲染遇到未就绪的异步组件时要「先跳过、稍后回来补」，只有异步组件才提供了可被挂起、等待后继续的机会。
    </p>
    <p>
      路由级的整页加载则用 <code>loading.tsx</code>：它相当于路由级 <code>&lt;Suspense&gt;</code>，会自动包裹同目录的 <code>page</code>，导航时自动显示其中的加载界面，不必手动写一层 <code>&lt;Suspense&gt;</code>。页面外层的等待用它，页面内部的慢模块用显式边界，两者各管一层。
    </p>
    <p>
      更实用的是<strong>多个边界并行</strong>。把图表、统计、订单三个互不依赖的数据块各自用 <code>&lt;Suspense&gt;</code> 包一层，它们会独立加载、互不阻塞：谁先准备好谁先显示，用户不必等三个都到齐。这也是流式渲染收益最明显的场景。
    </p>
    <table>
      <thead>
        <tr><th>手段</th><th>作用范围</th></tr>
      </thead>
      <tbody>
        <tr><td><code>&lt;Suspense fallback&gt;</code></td><td>页面内部某个慢组件或数据块</td></tr>
        <tr><td><code>loading.tsx</code></td><td>整条路由，导航时自动显示</td></tr>
        <tr><td>多个 <code>&lt;Suspense&gt;</code></td><td>各数据块并行加载、互不阻塞</td></tr>
      </tbody>
    </table>
    <div class="lesson-box hint">
      <strong>一个直接收益：</strong>把慢组件用 <code>&lt;Suspense&gt;</code> 隔离，让快速部分优先输出，能明显改善 LCP（最大内容绘制）等指标——用户更早看到主要内容，而不是盯着白屏。
    </div>
    <div class="lesson-box warn">
      <strong>边界粒度要拿捏：</strong>拆分应<strong>按数据依赖</strong>来划，而不是越细越好。把一整段内容切成一堆极小的 <code>&lt;Suspense&gt;</code>，会产生大量小分块，增加调度与替换开销，反而拖慢。合理做法是把「同一份数据驱动的区域」放进一个边界。
    </div>

    <h2>骨架占位与替换</h2>
    <figure class="lesson-figure">
      <figcaption>运行一遍流式过程，看骨架先返回、慢组件数据就绪后再被替换。</figcaption>
      <X08StreamingSuspense />
    </figure>

    <h2>分块输出与边界</h2>
    <p>
      流式渲染这一课，核心是让服务端「分块输出」而不是「攒完再发」：用 <code>&lt;Suspense&gt;</code> 边界把慢组件隔离出去，先返回 <code>fallback</code>，数据就绪后再流式替换。路由级的等待用 <code>loading.tsx</code>，页面内的慢模块用显式边界，多个边界并行还能让各区块各显各的。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Streaming 与 Suspense」</span>中 Streaming 指服务端把渲染好的 HTML 分块发送给浏览器、让其边收边渲染；<code>&lt;Suspense&gt;</code> 是划分边界的工具：慢的异步 Server Component 被包裹后，服务端先返回 <code>fallback</code>（骨架屏），数据 <code>resolve</code> 后再流式替换成真实内容。<code>loading.tsx</code> 是<strong>路由级 Suspense 的语法糖</strong>，会自动包裹同目录的 <code>page</code>。流式依赖异步 Server Component 配合 <code>await</code>；边界粒度应按数据依赖划分，过细会产生大量小块、增加调度开销。
    </div>
  </LessonArticle>
</template>
