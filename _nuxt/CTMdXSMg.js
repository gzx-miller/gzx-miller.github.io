const n=`<script setup lang="ts">
import C08Transition from './C08Transition.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>按钮悬停时颜色「啪」地一下就变了，想让它平滑一点却不知从何下手；另一边，加载图标要自己一直转，可它根本没有鼠标事件可以触发——这两种变化，是同一回事吗？
    </div>

    <h2>交互反馈两类动效</h2>
    <p>
      你在做一组交互反馈：卡片悬停要微微上浮，按钮按下要柔和变色，加载时那个小圆圈要不停旋转。如果只是把 <code>:hover</code> 里的颜色改掉，界面确实"响应"了，但变化是瞬时的，像被硬生生切换过去，观感生硬；而加载图标更棘手，它的转动不依赖任何用户操作，你连一个触发点都找不到。
    </p>
    <p>
      根子在于：面对"值要变化"这件事，浏览器其实提供了两条完全不同的路径。<strong>一条是补间——在两个状态之间自动算出中间帧；另一条是关键帧——由你直接描述整段变化过程</strong>。分不清这两条路，就会在需要自动播放时硬凑一个触发条件，或者在只有两个状态时煞有介事地画一堆关键帧。
    </p>

    <h2>属性值直接切换</h2>
    <p>
      最省事的做法：直接改属性值。<code>:hover</code> 里写上新的颜色或位置，让元素在两种状态间切换。
    </p>
    <p>
      这个方案做对了最基础的一层：<strong>状态被区分开了</strong>。悬停与未悬停是两个明确的视觉状态，用户能感知到交互发生了。当变化很小、或者你只想要"切换"而非"过渡"时，它简单直接，没有多余成本。
    </p>

    <h2>瞬时切换局限</h2>
    <ul>
      <li>值的变化是<strong>瞬时</strong>的，没有中间过程，观感生硬，缺了过渡的圆润。</li>
      <li>变化必须由状态改变触发（<code>:hover</code>、类名切换等），没有任何事件可挂的持续动效无从下手。</li>
      <li>多阶段的变化——比如弹跳要先上、再下、再上——两个状态根本表达不了。</li>
      <li>想让动效循环播放、反向播放或中途暂停，也无从配置。</li>
    </ul>

    <h2>过渡属性与补间</h2>
    <p>
      第一条路径是 <strong>transition（过渡）</strong>。在起始状态上声明要过渡的属性、时长与缓动函数，浏览器就会在状态切换时<strong>自动补齐中间帧</strong>：
    </p>
    <p>
      <code>.btn { transition: background 0.3s ease, transform 0.2s ease-out; }</code>，配合 <code>.btn:hover { background: #d9480f; transform: translateY(-2px); }</code>。简写顺序是 property / duration / timing-function / delay，例如 <code>transition: all 0.3s ease-in-out 0.1s</code>。
    </p>
    <p>
      但要记住它的边界：transition <strong>只负责两个状态之间的插值</strong>，触发条件必须是状态变化；它一次只连接"起点"和"终点"两点，中间插不进第三个形态。缓动函数（<code>ease</code>、<code>linear</code>、<code>ease-in-out</code> 等）则决定这段补间的节奏是匀速还是先慢后快。
    </p>
    <p>
      第二条路径是 <strong>animation（动画）</strong>。用 <code>@keyframes</code> 定义任意多个关键帧，再用 <code>animation</code> 挂到元素上，它便能<strong>自动播放</strong>，无需任何触发：<code>.spinner { animation: spin 1s linear infinite; }</code>，配合 <code>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</code> 就得到一个转不停的加载圈。关键帧还能写成多阶段，比如弹跳的 <code>0%, 20%, 50%, 80%, 100%</code> 停在原位、<code>40%</code> 抬到最高。
    </p>
    <p>
      动画还有几个过渡没有的能力：<code>forwards</code> 能让它播完后停在最后一帧而不弹回起点，<code>alternate</code> 让往返播放更自然，<code>animation-play-state: paused</code> 可以随时暂停。调试动效时，把 <code>animation-duration</code> 临时调慢到几秒，就能逐步看清关键帧之间是怎么补间的——比盯着飞速闪过的一瞬间去猜可靠得多。时长与缓动函数共同决定观感的流畅与节奏，这也是它俩最值得反复微调的地方。
    </p>
    <p>把两者的能力放在一起对比，选择就清晰了。</p>
    <table>
      <thead>
        <tr><th>能力</th><th>transition</th><th>animation</th></tr>
      </thead>
      <tbody>
        <tr><td>触发方式</td><td>状态变化（<code>:hover</code> 等）</td><td>自动播放 / JS 控制</td></tr>
        <tr><td>关键帧</td><td>不支持，只有起止两点</td><td>支持 <code>@keyframes</code></td></tr>
        <tr><td>循环</td><td>单次</td><td><code>infinite</code> 持续循环</td></tr>
        <tr><td>反向 / 暂停</td><td>不支持</td><td><code>alternate</code> / <code>animation-play-state</code></td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>性能与无障碍：</strong>优先过渡 <code>transform</code> 与 <code>opacity</code>，它们走合成器、开销低且不触发重排；动画里避免动 <code>width</code>、<code>height</code>、<code>margin</code> 这类会引发重排的属性。另外，别忘了用 <code>@media (prefers-reduced-motion: reduce)</code> 为动效提供降级，尊重用户在系统里设置的"减弱动态"偏好。
    </div>

    <h2>两种动效对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 transition 与 animation，再拖动时长滑块，感受「状态补间」与「关键帧循环」的差别。</figcaption>
      <C08Transition />
    </figure>

    <h2>触发与循环分工</h2>
    <p>
      过渡与动画解决的是同一个问题的两面：当变化只是两个状态之间的插值、且由交互触发时，用 transition；当动效需要自动播放、循环、反向或中途暂停时，用 @keyframes 动画。区分开「谁触发、有几帧」，再挑对合成友好的属性，动效就能既流畅又克制。这条判断链其实很短：先问它由谁触发、有几个关键帧，答案自然指向某一条路径。
    </p>
    <div class="lesson-term">
      <span class="term-name">「transition 与 animation」</span><code>transition</code> 在状态变化（如 <code>:hover</code>）时于两个值之间<strong>补间过渡</strong>，只连接起止两点；<code>animation</code> 通过 <code>@keyframes</code> 定义关键帧，可自动播放、<code>infinite</code> 循环、<code>alternate</code> 反向与 <code>animation-play-state</code> 暂停，适合无需用户触发的持续动效。动效优先用 <code>transform</code> 与 <code>opacity</code>，并用 <code>prefers-reduced-motion</code> 提供降级。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
