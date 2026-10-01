<script setup lang="ts">
import TW13Motion from './TW13Motion.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给「保存成功」的提示加了入场动画，效果挺好，可开启系统的「减少动态效果」后，它也照动不误——我怎么知道该给哪些动效留出口？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个学习进度页。点击「标记为已学」后，右上角弹出一个「已保存学习进度」的提示条。为了让它不那么生硬，你打算给它加入场效果：从下方滑上来、同时淡入。这个小动效确实让交互「活」了起来。
    </p>
    <p>
      但动效这件事，从来不只是「让它动」。第一，动效必须<strong>解释一个状态变化</strong>——提示条是「出现了」，所以它该从无到有地淡入，而不是毫无理由地旋转。第二，动效要有<strong>性能意识</strong>：有些属性一动就触发浏览器重新计算布局，代价高昂。第三，也是最容易被忽略的：有些人会因为动效感到不适，浏览器为此提供了「减少动态效果」的系统偏好，你的动效应当尊重它。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，是给元素加 <code>transition-all duration-300</code>，然后切换一个类名来触发变化。这个方案对的地方在于，它<strong>建立了状态之间的连续性</strong>：元素不是瞬间跳变，而是平滑过渡，交互感受立刻提升。
    </p>
    <p>
      问题藏在 <code>transition-all</code> 这四个字里。「全部属性都参与过渡」听起来很省心，实际却意味着你放弃了「哪些属性该动、哪些不该动」的控制权——连那些你根本没打算动画的属性，也可能被卷进去，产生意料之外的抖动，或者触发昂贵的重排。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>transition-all</code> 掩盖了属性边界，哪些属性在动变得不可控，调试时无从下手。</li>
      <li>只考虑「让它动」，没有为偏好减少动态的用户提供静态替代方案。</li>
      <li>时长与缓动随手填，这次 200ms、下次 500ms，界面整体显得不协调。</li>
      <li>让布局属性（如宽高、位置）参与动画，一帧要重排，页面容易卡顿。</li>
      <li>大量元素同时动画时，它们会抢占主线程，拖慢整个页面的响应。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「让状态变化平滑」，而是把它组织成两件分工明确的工具：<strong><code>transition</code> 定义「属性状态之间如何过渡」——哪些属性参与、持续多久、用什么缓动；<code>animate</code> 则应用 <code>@keyframes</code> 关键帧动画</strong>，用于那些需要循环或分阶段演绎的效果。前者服务于「状态连续性」，后者服务于「过程性强调」，用途不同，别混着用。
    </p>
    <p>
      第一步，明确动效要解释的<strong>状态变化</strong>，而不是为装饰而动画。提示条是「出现」，那就让 <code>opacity</code> 与 <code>transform</code> 一起变化；按钮按下是「反馈」，那就让它轻微缩放。先想清楚「这个动效在告诉用户什么」，再决定用哪些属性。
    </p>
    <p>
      第二步，<strong>优先动画 <code>transform</code> 与 <code>opacity</code>，并把时长控制在 150-300ms</strong>。为什么是这两个属性？因为它们的变化可以被浏览器交给合成层处理，通常不触发重新布局和重绘，性能最稳。相反，如果让 <code>width</code>、<code>top</code>、<code>margin</code> 这类布局属性参与动画，每一帧浏览器都要重新计算布局，代价高得多。时长上，150-300ms 是一个「足够被感知、又不拖泥带水」的区间；统一在这个区间里取几档（如 <code>duration-150</code> / <code>duration-200</code> / <code>duration-300</code>），比到处填随机数协调得多。
    </p>
    <div class="lesson-box warn">
      <strong>不要用 <code>transition-all</code> 掩盖属性边界。</strong>写成 <code>transition duration-200</code> 或更明确的 <code>transition-transform</code>、<code>transition-opacity</code>，你就能一眼看出这个元素到底在动画什么。此外，持续闪烁和大幅位移可能引发不适，尤其是对光敏感或前庭敏感的用户。
    </div>
    <p>
      第三步，用 <code>motion-reduce</code> 为偏好减少动态的用户提供<strong>静态替代</strong>。它的底层依据是 CSS 媒体查询 <code>prefers-reduced-motion</code>：当用户在系统里打开了「减少动态效果」，<code>motion-reduce:</code> 前缀下的样式就会生效。与之配套的还有 <code>motion-safe:</code>，表示「仅在用户未开启减少动态时才应用」。例如一个循环跳动的图标，可以写成 <code>motion-safe:animate-bounce motion-reduce:transition-none</code>：正常用户看到跳动，开启了减少动态的用户则看到一个静止的图标。
    </p>
    <p>
      最后一步，注意<strong>并发动画的数量</strong>。大量元素同时动画会一起抢占主线程，即使每个都只动画 <code>transform</code>，叠加起来也可能造成掉帧。控制同时动画的元素个数、缩短总时长，比事后优化更有效。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>勾选「模拟减少动态效果」再切换提示，观察同一段动效如何切换到静态替代方案。</figcaption>
      <TW13Motion />
    </figure>

    <h2>总结</h2>
    <p>
      动效的价值在于「解释状态变化」，而不是「看起来花哨」。用 <code>transition</code> 处理状态之间的连续性，用 <code>animate</code> 做关键帧演绎；始终优先动画 <code>transform</code> 与 <code>opacity</code>、把时长收进一个窄区间，并用 <code>motion-reduce</code> 给用户留一个关闭的出口——这样的动效既好看，又不冒犯任何人。
    </p>
    <div class="lesson-term">
      <span class="term-name">「运动可访问性」</span>指用 <code>motion-reduce</code> / <code>motion-safe</code> 变体（底层是 <code>prefers-reduced-motion</code> 媒体查询）为偏好减少动态的用户提供静态替代。核心约定：<code>transition</code> 定义参与过渡的属性、时长与缓动，<code>animate</code> 应用 <code>@keyframes</code>；优先动画 <code>transform</code> 与 <code>opacity</code>，时长控制在 150-300ms；不要用 <code>transition-all</code> 掩盖属性边界。
    </div>
  </LessonArticle>
</template>
