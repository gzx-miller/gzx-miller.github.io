const o=`<script setup lang="ts">
import C18FormattingContext from './C18FormattingContext.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>父容器里明明塞了几个浮动子元素，它自己的高度却塌成了 0，背景色一块都看不见——父元素为什么「包不住」亲生骨肉？
    </div>

    <h2>高度塌陷与重叠</h2>
    <p>
      你在做一个经典的两栏页：左侧用 <code>float</code> 做侧栏，右侧放正文自适应剩余宽度；正文里几个相邻段落之间，间距也莫名地「消失」了一层。父容器的高度塌陷、侧栏与正文重叠、段落间距少了一截——三个看似无关的怪现象，其实是同一个东西在背后作祟。
    </p>
    <p>
      这个东西叫<strong>格式化上下文</strong>：它规定了「盒子内部的元素按什么规则排布」。浮动元素脱离常规流、相邻外边距互相折叠、行内元素按基线对齐，全都由所在上下文的规则决定。<strong>不看清这层规则，你就会一直对着现象打补丁</strong>——加个空标签、写死一个高度，问题暂时消失，下次换个场景又冒出来。
    </p>

    <h2>应急补救写法</h2>
    <p>
      最省事的做法是「看现象出招」：父容器塌了，就给它写死一个 <code>height</code>；浮动影响了下文，就插一个 <code>&lt;div style=&quot;clear: both&quot;&gt;</code> 的空标签。这套办法做对了一件事：<strong>它确实让当前这块页面立刻好看起来</strong>，改起来也直观。
    </p>
    <p>
      只要内容高度固定、布局不再变动，这就算是「解决」了。问题出在「内容固定」这个假设上。
    </p>

    <h2>写死高度溢出</h2>
    <ul>
      <li>写死的高度不会随内容变化，内容一多就溢出、一少就留白。</li>
      <li>插入空标签清除浮动会污染 DOM，语义上毫无意义的节点越攒越多。</li>
      <li>换成 <code>overflow: hidden</code> 虽然能包裹浮动，却会连带裁掉真正需要溢出的内容，还可能影响滚动行为。</li>
      <li>相邻段落的外边距为什么会合并，这套做法一个字都解释不了，只能靠记忆硬背。</li>
    </ul>

    <h2>浮动脱离常规流</h2>
    <p>
      不推翻「临时补救」，而是去理解规则本身：浮动元素<strong>会脱离常规流</strong>，不再参与父容器的高度计算，所以父容器自然包不住它；而块级元素上下相邻的<strong>外边距会折叠</strong>，取两者中的较大值，于是 30px 配 20px 只剩 30px。要改变这两个行为，就得让父容器建立一个<strong>新的布局规则</strong>——也就是创建一个新的格式化上下文。
    </p>
    <p>
      最常见的是块级格式化上下文（BFC）。它一建立，父容器就会<strong>把内部的浮动元素重新纳入高度计算</strong>，同时<strong>阻断自身与外部、以及内部相邻盒之间的外边距折叠</strong>。创建方式有很多，但副作用差别很大：
    </p>
    <ul>
      <li><code>overflow</code> 取非 <code>visible</code>：有效，但可能裁掉溢出内容。</li>
      <li><code>float</code> 取非 <code>none</code>：会连自己都脱离常规流。</li>
      <li><code>position: absolute</code> 或 <code>fixed</code>：同样会脱离文档流。</li>
      <li><code>display: flow-root</code>：<strong>专门用来创建 BFC，且没有任何附带副作用</strong>，是当下的首选。</li>
      <li>flex / grid 容器：本身就会建立对应的格式化上下文。</li>
    </ul>
    <p>
      BFC 的三个经典用途，正好一一对应开场那三个怪现象：<strong>包裹浮动</strong>，让父容器重新量到自己孩子的高度；<strong>阻止外边距折叠</strong>，让段落间距如实生效；<strong>不与浮动重叠</strong>，让自适应宽度的正文自动避开侧栏，形成真正的两栏。<span class="lesson-kv">display: flow-root</span> 一写上，这三件事同时解决，而且不留后患。
    </p>
    <p>
      接着把家族补齐。行内元素也有自己的上下文：一行文字里，文字、<code>span</code>、<code>strong</code> 这些行内级元素会落在同一个<strong>行盒</strong>里，按<strong>基线</strong>对齐，由 <code>line-height</code> 和 <code>vertical-align</code> 决定它们怎么站队——这就是行内格式化上下文（IFC）。它是<strong>自然形成</strong>的：只要一个块里只含行内级元素，这块内容就处于 IFC 之中，不需要你手动创建。
    </p>
    <p>
      而当你写下 <code>display: flex</code> 或 <code>display: grid</code>，容器内部就分别切换成弹性格式化上下文（FFC）和网格格式化上下文（GFC）——它们不再遵循块级那套上下堆叠的规则，而是由主轴、交叉轴或网格轨道接管布局。换句话说，<strong>FFC 与 GFC 本质上就是 flex / grid 容器内部默认建立的格式化上下文</strong>，只是平时我们习惯说「用了 flex 布局」，而没意识到这一步同时也换掉了内部的布局规则。
    </p>
    <table>
      <thead>
        <tr><th>类型</th><th>创建方式</th><th>主要作用</th></tr>
      </thead>
      <tbody>
        <tr><td>BFC（块格式化上下文）</td><td><code>overflow</code> 非 <code>visible</code>、<code>display: flow-root</code>、<code>float</code> 非 <code>none</code>、绝对定位、flex / grid 容器</td><td>包裹浮动、阻止外边距折叠、不与浮动重叠</td></tr>
        <tr><td>IFC（行内格式化上下文）</td><td>块容器内只含行内级元素时自然形成</td><td>行盒排列、基线对齐</td></tr>
        <tr><td>FFC（弹性格式化上下文）</td><td><code>display: flex</code> / <code>inline-flex</code></td><td>按主轴与交叉轴排布子项</td></tr>
        <tr><td>GFC（网格格式化上下文）</td><td><code>display: grid</code> / <code>inline-grid</code></td><td>按网格轨道排布子项</td></tr>
      </tbody>
    </table>
    <div class="lesson-box hint">
      <strong>一条可长期沿用的结论：</strong>需要创建 BFC 时，优先写 <code>display: flow-root</code>。它既能把浮动包住、把外边距折叠挡住，又不像 <code>overflow: hidden</code> 那样暗中裁剪内容或改变滚动行为——用「副作用最小」的方式解决老问题。
    </div>

    <h2>BFC与IFC对照</h2>
    <figure class="lesson-figure">
      <figcaption>对比「有 BFC」与「无 BFC」两个盒子里浮动的包裹差异，再看行内元素如何在 IFC 内按基线排列。</figcaption>
      <C18FormattingContext />
    </figure>

    <h2>格式化上下文归属</h2>
    <p>
      格式化上下文规定盒子内部的布局规则。BFC 能包裹浮动、阻断外边距折叠，<code>display: flow-root</code> 是最干净的创建方式；IFC 决定一行内行内元素的排列与基线对齐；<code>display: flex</code> / <code>grid</code> 则分别建立 FFC 与 GFC，各自接管主轴与网格布局。把浮动溢出、外边距折叠、行内对齐这三类老问题，统一归到「当前处于哪种上下文」里去想，解法就清楚了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「格式化上下文」</span>规定盒子内部元素的布局规则：BFC（块格式化上下文）可包裹浮动、阻断外边距折叠，常见创建方式有 <code>overflow</code> 非 <code>visible</code>、<code>display: flow-root</code>、<code>float</code> 非 <code>none</code>、绝对定位以及 flex / grid 容器，其中 <code>display: flow-root</code> 是建立 BFC 又无副作用的首选；IFC（行内格式化上下文）决定一行内行内元素的排列与基线对齐，当块容器只含行内级元素时自然形成；<code>display: flex</code> / <code>grid</code> 分别建立 FFC 与 GFC。浮动元素会脱离常规流，父容器包不住时用 BFC 包裹是经典解法。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
