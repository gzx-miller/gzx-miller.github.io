<script setup lang="ts">
import TW20Transform from './TW20Transform.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给按钮加了 <code>hover:scale-105</code>，鼠标移上去却「啪」地一下变大又一下变回去，毫无过渡——明明写了放大，为什么看起来像卡了一帧？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做课程卡片列表，想做点小反馈让页面不死板：鼠标悬停卡片时轻微上浮、按钮按下时缩小一点、加载时转个圈、活动卡片揭晓时轻轻滑入。需求都不复杂，但动手时你会发现它们其实是三种不同的东西：<strong>悬停放大</strong>是元素自身形态的改变，<strong>上浮并停留</strong>是形态加上随时间平滑变化的过渡，<strong>转圈与滑入</strong>则是一段自己会跑的动画。
    </p>
    <p>
      如果把这三件事混作一谈，写出来的效果就会自相矛盾：要么变化来得太生硬，要么动画把布局搅乱，要么本该流畅的循环在低端机上掉帧。要理清，得先区分三个概念——<strong>变换</strong>决定元素变成什么样，<strong>过渡</strong>决定状态切换时怎么平滑过去，<strong>动画</strong>决定一段独立于状态的关键帧序列。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法是只写变化本身：卡片给 <code>hover:scale-105</code>，按钮给 <code>active:scale-95</code>。元素确实会变，逻辑也最简单，一个类就表达完了。
    </p>
    <p>
      它做对的是<strong>选对了变换这件事</strong>：<code>scale</code> 只改绘制效果，不改变元素在文档流里占的位置，旁边的元素不会跟着被推来推去。对于只需要「有反馈」的场景，这样写已经可用。真正缺的不是变换，而是<strong>从 A 到 B 之间的时间</strong>——浏览器默认不过渡，是一步到位的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>没有过渡，状态一变就是瞬移，观感生硬，也没法表达「从哪里来、到哪里去」。</li>
      <li>一着急补上 <code>transition-all</code>，结果把颜色、边框、布局属性全都拖进过渡，出现意想不到的抖动。</li>
      <li>有人图省事去动画 <code>width</code> 或 <code>height</code>，每一帧都触发布局重排，小列表还好，长列表立刻卡顿。</li>
      <li>缩放和旋转一起用时，结果和预期对不上——<code>transform</code> 里函数的书写顺序会影响最终结果。</li>
      <li>想让多个元素错开滑入，光有 <code>hover</code> 触发不了，缺一段能自己播放的关键帧。</li>
      <li>对系统里开了「减少动态效果」的用户没有任何照顾，动画照放不误。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先把「变形」这套工具用全。<code>scale-*</code> 缩放、<code>rotate-*</code> 旋转、<code>translate-*</code> 位移、<code>skew-*</code> 倾斜，它们会被合并进同一条 <code>transform</code> 声明，并且都<strong>不改变布局占位</strong>。配合 <code>origin-*</code> 控制变换原点，可以让旋转绕左上角、缩放从底部展开，观感差别很大。这就是「优先动画 <code>transform</code> 与 <code>opacity</code>」的由来——它们通常只触发合成，不惊动布局与绘制。
    </p>
    <p>
      再补上时间：加 <code>transition</code> 声明哪些属性参与过渡，配 <code>duration-*</code> 定时长、<code>ease-*</code> 定缓动。关键约定是<strong>用明确的属性，不要一律 <code>transition-all</code></strong>——要过渡位移就用 <code>transition-transform</code>，只过渡颜色就用 <code>transition-colors</code>。写清楚边界，既避免副作用，也让「什么会动」一眼可读。交互反馈的时长控制在 150～300ms 之间比较舒服，而且整站最好收敛到少数几个档位，随意的时长会让界面显得不协调。
    </p>
    <div class="lesson-box hint">
      <strong>v4 里怎么自定义动画：</strong>在 CSS 中用 <code>@theme</code> 声明 <code>--animate-*</code> 变量，再配一段 <code>@keyframes</code>，就能生成自己的 <code>animate-*</code> 工具类；旧式的 <code>tailwind.config</code> 写法需要通过 <code>@config</code> 加载。
    </div>
    <p>
      接着是关键帧动画。<code>animate-spin</code> 适合加载转圈，<code>animate-ping</code> 适合雷达扩散的提示点，<code>animate-pulse</code> 适合骨架屏呼吸，<code>animate-bounce</code> 适合引导注意。它们与 <code>hover</code> 触发无关，是「自己会跑」的。入场那种错开的滑入，则要靠自定义 <code>@keyframes</code> 把透明度与位移一起写进去，而不是硬用过渡去模拟。
    </p>
    <p>
      最后别忘两个纪律。一是<strong>写作顺序</strong>：旋转与缩放写在一条 <code>transform</code> 里，顺序不同结果可能明显不同，固定一个习惯（比如先位移、再旋转、后缩放）能省掉很多猜谜。二是<strong>性能预算</strong>：大量元素同时动画会抢占主线程，动画数量要有节制，并且要为用户提供「减少动态效果」的替代方案。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>scale</code> / <code>rotate</code> / <code>translate</code> / <code>skew</code> 与 <code>origin-*</code> 定义要呈现的变换。</li>
      <li>加 <code>transition</code> 与 <code>duration-*</code> / <code>ease-*</code> 让状态变化平滑过渡，用 <code>hover:</code> / <code>active:</code> 触发。</li>
      <li>循环或阶段性动效用 <code>animate-*</code>（内置 spin / ping / pulse / bounce）或自定义 <code>@keyframes</code>。</li>
      <li>打开动画面板确认动画只涉及 <code>transform</code> 与 <code>opacity</code>，未触发布局重排。</li>
    </ol>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在「Transform 变换」页拖动滑块观察参数变化，再去过渡与动画页签看缓动和关键帧的差别。</figcaption>
      <TW20Transform />
    </figure>

    <h2>总结</h2>
    <p>
      变换、过渡、动画是三件不同的事：变换决定变成什么样，过渡决定怎么平滑过去，动画决定自己怎么跑。做法上抓住两条即可——优先动画 <code>transform</code> 与 <code>opacity</code> 保证性能，时长与缓动收敛到少量档位保持一致；用明确属性而非 <code>transition-all</code>，顺手为「减少动态效果」的用户留一条安静的路。
    </p>
    <div class="lesson-term">
      <span class="term-name">「合成友好的变换」</span>指优先让动画只涉及 <code>transform</code> 与 <code>opacity</code>——它们通常只触发合成，不引起布局重排与重绘，因此最流畅。<code>scale</code> / <code>rotate</code> / <code>translate</code> / <code>skew</code> 会合并成一条 <code>transform</code> 且不改变元素占位；相反，动画 <code>width</code> / <code>height</code> 等布局属性容易导致卡顿，应尽量避免。
    </div>
  </LessonArticle>
</template>
