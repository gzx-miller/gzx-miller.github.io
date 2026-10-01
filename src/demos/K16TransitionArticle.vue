<script setup lang="ts">
import K16Transition from './K16Transition.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一条提示语「啪」地出现、「啪」地消失，用户根本没看清发生了什么——为什么给元素写好 CSS 过渡，动画还是不着调？
    </div>

    <h2>提出问题</h2>
    <p>
      你做一个学习提醒：用户完成一节课程，页面冒出一条鼓励的提示，几秒后淡出。你还想给待办清单加点手感——新加一条时从右侧滑入，删掉时滑出去。可当状态一变，提示语和列表项都是<strong>瞬间出现、瞬间消失</strong>，界面生硬得像坏了，用户甚至来不及注意到「多了什么、少了什么」。
    </p>
    <p>
      你可能尝试过：给元素写一句 <code>transition: opacity .3s</code>，然后在 JS 里把它插进 DOM。结果发现淡出根本没发生——因为<strong>元素被移除的那一刻，它已经不在了，CSS 无从过渡</strong>。这就是问题真正的难点：让一个「即将被删除的节点」在删除前把动画完整播完，这件事在纯 CSS 里做不到。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：用状态控制元素的显隐，同时手动给元素挂上过渡属性，在插入前后改 <code>class</code> 或 <code>style</code>，让浏览器有前后两帧可比较，从而触发过渡。
    </p>
    <p>
      这个方案做对了一件本质的事：<strong>动画的前提是「同一属性有两个不同取值」</strong>。透明度、位移这些能过渡的属性，必须一帧是初值、一帧是终值，中间才有插值空间。只要满足这一条，简单元素的淡入淡出是能做出来的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>元素<strong>进入</strong>时，你得先把它插进 DOM、强制浏览器重排一次，再改目标值，否则首帧和末帧被合并，动画被吞掉。</li>
      <li>元素<strong>离开</strong>时更难：要在动画播完后才移除节点，你甚至得监听 <code>transitionend</code> 并处理它不触发、被打断的各种情况。</li>
      <li>列表增删时，你根本不知道哪个元素该进、哪个该出、哪个只是移动了位置，逐一判断成本极高。</li>
      <li>这些「插节点、加类名、等结束、删节点」的时序逻辑，每处都要重写一遍，稍有闪失就是动画卡住或节点残留。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「靠两个取值触发过渡」，而是把<strong>节点增删的时机</strong>从你手里接管过去。这就是 <code>Transition</code>：当被它包裹的元素进入或离开时，它会在<strong>正确的时刻</strong>自动添加、移除一组阶段类名，你只需要在 CSS 里针对这些类名写动画，剩下的时序全由 Vue 负责。
    </p>
    <ol class="lesson-steps">
      <li>状态变化让文字<strong>进入</strong> DOM，Vue 立刻挂上 <code>fade-enter-from</code> 与 <code>fade-enter-active</code>。</li>
      <li>下一帧去掉 <code>fade-enter-from</code>，元素从初值过渡到终值，生效的是 <code>fade-enter-to</code>。</li>
      <li>进入结束，Vue 移除全部进入类名，元素回到常态。</li>
      <li>状态变化让文字<strong>离开</strong>时，Vue 先加 <code>fade-leave-from</code> 与 <code>fade-leave-active</code>，<strong>等动画播完才真正把节点移出 DOM</strong>。</li>
    </ol>
    <p>
      把 <code>name</code> 设为 <code>fade</code>，所有类名就自动带上 <code>fade-</code> 前缀——这就是 <code>Transition</code> 的命名契约。你不再关心「什么时候加类、什么时候删节点」，只关心「进入和离开各长什么样」，职责一下子清晰了。
    </p>
    <p>
      单元素的动效解决了，列表还有一层：新增一条要滑入、删除一条要滑出、剩下那些因为位置变化要平滑移动。这属于多元素的场合，交给 <code>TransitionGroup</code>。它和 <code>Transition</code> 共用同一套阶段类名规则，额外多一个 <code>-move</code> 类专门处理<strong>移动</strong>；用 <code>tag</code> 属性可以指定它渲染成什么包裹元素，比如一个无序列表。
    </p>
    <div class="lesson-box warn">
      <strong>列表过渡必须使用稳定 key。</strong>Vue 靠 <code>key</code> 识别每个元素的身份，才能判断谁被添加、谁被移除、谁只是换了位置。如果 <code>key</code> 用了数组下标，增删后下标会整体移动，Vue 会把「在末尾新增」误判成「每一项都变了」，动画立刻错乱。key 应该是数据本身自带的、稳定的唯一标识。
    </div>
    <p>
      还想做更复杂的动效——弹性、物理缓动、路径动画——可以走 <code>Transition</code> 的 JavaScript 钩子：<code>@before-enter</code>、<code>@enter</code>、<code>@leave</code> 会在对应阶段被调用，在钩子里用 GSAP、anime.js 这类库接管动画，做完后调用传入的 <code>done</code> 回调，Vue 才知道这一段结束了。但无论动画多花哨，<strong>状态来源仍要保持清晰</strong>：由 <code>v-if</code> 或列表数据决定元素该不该存在，动画只负责渲染过渡，而不是反过来用动画去驱动状态。
    </p>
    <div class="lesson-box hint">
      <strong>一条尺度：</strong>动画应当服务于理解和反馈——让用户看清「什么进来了、什么离开了」，而不是为了装饰而拖慢操作。动效时长过长、处处都在动，反而会让人分不清主次、觉得卡顿。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「切换提示」看单元素淡入淡出，观察 <code>fade-enter</code> 与 <code>fade-leave</code> 阶段类的挂载时机。</figcaption>
      <K16Transition />
    </figure>

    <h2>总结</h2>
    <p>
      过渡动画要解决的，是「状态变了，但用户没看清」的问题。方案是把节点增删的时序交给 <code>Transition</code>——它在进入和离开的正确时机自动加阶段类名，CSS 只管写动画；列表的多元素增删移动则交给 <code>TransitionGroup</code>，并务必用稳定 key。更复杂的动效走 JavaScript 钩子，但状态来源始终要清晰。
    </p>
    <div class="lesson-term">
      <span class="term-name">「过渡」</span>中，<code>Transition</code> 在元素进入和离开时<strong>自动在正确时机添加阶段类名</strong>（如 <code>fade-enter</code>、<code>fade-leave</code>），CSS 依据这些类名执行动画，节点增删时机由 Vue 接管；<code>TransitionGroup</code> 处理列表中多个元素的增删移动，<strong>必须使用稳定 key</strong>。更复杂的动画可用 <code>@before-enter</code> / <code>@enter</code> / <code>@leave</code> 等 JS 钩子，配合 GSAP、anime.js 实现。
    </div>
  </LessonArticle>
</template>
