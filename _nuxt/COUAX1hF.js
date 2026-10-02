const o=`<script setup lang="ts">
import TW12BordersEffects from './TW12BordersEffects.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>给课程卡片加一圈选中边框，我用 <code>border-2</code> 一加，卡片竟然整体变宽了、把旁边的卡片顶开；换成阴影后好看多了，可键盘 Tab 过来时，我却完全看不出焦点落在哪张卡上。
    </div>

    <h2>三类视觉需求</h2>
    <p>
      还是那个课程卡片列表。做交互时，你同时冒出三个视觉需求：第一，卡片之间要有一条<strong>静态边界</strong>，让人一眼看出「这是一张独立的卡」；第二，鼠标悬停或卡片被选中时，它要<strong>浮起来</strong>，和背景拉开层次；第三，用户用键盘 Tab 切换时，当前聚焦的卡片必须有<strong>清晰可见的焦点</strong>。
    </p>
    <p>
      三个需求，看起来都能用「加一圈线」解决。但 Tailwind 提供的三件工具——<code>border</code>、<code>outline</code> / <code>ring</code>、<code>box-shadow</code>——并不是一回事。它们在<strong>是否参与布局</strong>、<strong>画在哪里</strong>、<strong>表达什么语义</strong>上有本质差别。搞不清这一点，就会出现「加了边框整块变宽」和「焦点看不见」这类看似矛盾的问题。
    </p>

    <h2>统一边框方案</h2>
    <p>
      最省事的做法，是统一用 <code>border</code>：静态状态写 <code>border border-stone-200</code>，选中状态改成 <code>border-2 border-orange-500</code>。这个方案对的地方在于，它<strong>确实建立了边界</strong>，卡片分组一目了然，静态边界的部分完全达标。
    </p>
    <p>
      问题出在「所有需求都靠 border」这个统一思路上。border 会为选中状态额外增加一条线的宽度，卡片尺寸随之变化；如果还想用阴影表达悬浮，又会发现阴影和边框同时存在时，视觉厚度对不上，像贴了两层皮。
    </p>

    <h2>边框占据布局空间</h2>
    <ul>
      <li><code>border</code> 参与盒模型、占据布局空间，从 1px 加到 2px 会让卡片实际尺寸变化，触发旁边的元素位移。</li>
      <li>用换 border 颜色来表达「选中」，一旦聚焦状态也用 border，两种状态就会互相覆盖、难以共存。</li>
      <li>把 <code>box-shadow</code> 当成焦点提示，常常对比度过低，键盘用户根本看不清焦点在哪。</li>
      <li>界面上到处叠阴影，层级越多越乱，反而削弱了信息结构。</li>
    </ul>

    <h2>工具语义匹配</h2>
    <p>
      不推翻「用线条建立边界」，而是给三个需求各找一件<strong>语义匹配</strong>的工具。三者的分工可以这样理解：<strong>border 参与盒模型、占据布局空间</strong>，是一块元素「实实在在的边框」，因此适合做<strong>静态边界与分组</strong>；<strong>outline 与 ring 绘制在元素外侧、不挤占布局</strong>，所以当你想强调某个元素又不希望它改变尺寸时，它们才是正确选择，<strong>键盘焦点就是最典型的场景</strong>；<strong>box-shadow 表达层级深度</strong>，让元素看起来「离背景多远」，用于浮层与卡片的高度感。
    </p>
    <p>
      顺序上，先用 <code>border</code> 建立静态边界与分组，给卡片一个稳定的轮廓。这一步不追求醒目，<code>border border-stone-200</code> 这类低对比的细线就够。接着处理焦点：用 <code>focus-visible</code> 配 <code>ring</code> 或 <code>outline</code>，提供<strong>高对比、不改变布局</strong>的焦点环。为什么强调 <code>focus-visible</code> 而不是 <code>focus</code>？因为 <code>focus</code> 在鼠标点击时也会触发，会让鼠标用户看到多余的焦点圈；<code>focus-visible</code> 只在浏览器判断「用户确实需要看到焦点」时才出现，键盘用户看得见、鼠标用户不受打扰。
    </p>
    <p>
      第三步才是阴影，而且<strong>只在需要表达浮层高度时才叠加</strong>，并保持层级数量克制。比如卡片默认 <code>shadow-sm</code>，悬停时升到 <code>shadow-lg</code>，形成「抬起来」的感觉。Tailwind 的阴影还可以用<strong>透明度修饰符</strong>降低噪声——写成 <code>shadow-orange-500/30</code>，就是一个带 30% 透明度的橙色阴影，比纯黑阴影更柔和、更贴合品牌色，用在彩色卡片上尤其自然。
    </p>
    <div class="lesson-box warn">
      <strong>两个细节要对齐：</strong>其一，<code>outline</code> 不占布局空间、<code>border</code> 会改变尺寸计算，两者切换时要注意布局是否跳动——例如「默认 border 透明、聚焦时换 outline」，比「聚焦时把 border 加粗」安全得多。其二，<code>ring</code> 默认是以 <code>box-shadow</code> 绘制的，它和 <code>border</code> 叠加时，要留意视觉厚度是否一致，必要时用 <code>ring-offset-*</code> 在两者之间留出空隙。
    </div>
    <p>
      最后回到键盘走查这件事上：<strong>用键盘 Tab 走一遍页面，确认每个可聚焦元素都有清晰可见的焦点样式。</strong>这一步不能省，因为焦点可见性是键盘用户使用产品的前提，而它偏偏是鼠标用户永远不会注意到的地方。
    </p>

    <h2>三种边界对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 border、ring、shadow 三种方式，观察它们对布局的影响与各自承担的视觉语义。</figcaption>
      <TW12BordersEffects />
    </figure>

    <h2>边界焦点与层级</h2>
    <p>
      边界、焦点与层级，是三件不同的事，就该用三件不同的工具。border 参与布局、负责静态边界；outline 与 ring 不占空间、负责焦点；box-shadow 表达深度、负责浮层高度。记住「焦点不能只靠低对比阴影」和「不要堆砌过多阴影层级」，界面就会既清晰又有秩序。
    </p>
    <div class="lesson-term">
      <span class="term-name">「视觉边界三件套」</span>指 <code>border</code>、<code>outline</code> / <code>ring</code> 与 <code>box-shadow</code> 的分工：border 参与盒模型、占布局，用于静态边界与分组；outline 与 ring 绘制在元素外侧、不占布局，适合键盘焦点（配 <code>focus-visible</code>）；box-shadow 表达层级深度，可用透明度修饰符如 <code>shadow-orange-500/30</code> 降低噪声。三者切换时注意布局跳动与视觉厚度一致性。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
