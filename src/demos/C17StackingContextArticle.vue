<script setup lang="ts">
import C17StackingContext from './C17StackingContext.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>弹层已经写了 <code>z-index: 9999</code>，却还是被外面一个 <code>z-index: 2</code> 的元素压在底下——这么大的数字，为什么一点用都没有？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一张卡片，卡片入场时加了一段 <code>transform</code> 动画，卡片里的「更多」按钮点开后弹出一层浮层，浮层给了 <code>z-index: 9999</code>。按理说这个数已经大得离谱，可它偏偏被卡片外面一个 <code>z-index: 2</code> 的兄弟元素盖住了，用户根本点不到。
    </p>
    <p>
      这类 bug 最折磨人的地方在于：<strong>代码完全没错，数字也够大，可结果就是不对</strong>。真正支配层级的不是数字的大小，而是数字<strong>在哪个范围里比较</strong>。不搞清这层「范围」，你会一直在盲目地把 <code>z-index</code> 往上加，越加越乱。
    </p>

    <h2>最小方案</h2>
    <p>
      最直觉的理解：<code>z-index</code> 是层级高度，数字越大越靠上。<code>9999</code> 必然压过 <code>2</code>，写就完事了。这个理解做对了一件事：<strong>在同一批元素里，它确实成立</strong>——同层兄弟之间，谁的数字大谁在上面，规律简单可靠。
    </p>
    <p>
      但只要你跨出「同一批元素」这个圈子，它立刻失灵。而真实页面里，元素几乎从来不是干净地待在同一批里。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>它解释不了「子元素数字再大也翻不过外部元素」——仿佛有一道看不见的墙挡住了层级比较。</li>
      <li>它没提 <code>z-index</code> 只在定位元素上生效：<code>position: static</code> 的元素写了也是白写。</li>
      <li>它无法说明为什么「加了个入场动画」，层级表现就悄悄变了。</li>
      <li>按这个模型调试，只能不断加数字，永远找不到根因。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「数字决定层级」，而是给它补上<strong>比较范围</strong>：每个元素都归属于某个<strong>层叠上下文</strong>，<code>z-index</code> 的这个数字，<strong>只在同一个上下文内部的兄弟及其后代之间比较</strong>。而一个创建了新上下文的元素，它连同它所有后代，会被打包成<strong>一个整体</strong>，再参与到父级上下文的排序里。
    </p>
    <p>
      这就解释了开场那个例子：卡片因为 <code>transform</code> 而创建了新的层叠上下文，于是弹层的 <code>9999</code> 只能<strong>在卡片内部</strong>称王。对外部而言，卡片整体只有它自己所处的那一个层级，弹层再高也迈不出这道门。所以正确的做法不是加数字，而是意识到「这是一道边界」。
    </p>
    <p>
      那么谁来创建上下文？触发条件比想象中多，<strong>很多并非为了层级而写，却是常见的隐形陷阱</strong>：
    </p>
    <table>
      <thead>
        <tr><th>创建方式</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr><td><code>z-index</code> 非 <code>auto</code> + 定位</td><td>最经典的方式</td></tr>
        <tr><td><code>opacity</code> 小于 1</td><td>只要半透明就创建</td></tr>
        <tr><td><code>transform</code> 非 <code>none</code></td><td>动画中最常见，极易无意引入</td></tr>
        <tr><td><code>filter</code> 非 <code>none</code></td><td>滤镜同样创建</td></tr>
        <tr><td><code>isolation: isolate</code></td><td>专门创建，且无视觉副作用</td></tr>
        <tr><td><code>will-change</code> 指定相关属性</td><td>声明即将变化时也创建</td></tr>
        <tr><td>flex / grid 子项带 <code>z-index</code></td><td>直接子元素也会创建</td></tr>
      </tbody>
    </table>
    <p>
      在一个上下文内部，绘制并不是简单按 <code>z-index</code> 排序，而是有固定的顺序，从低到高依次是：
    </p>
    <ol class="lesson-steps">
      <li>元素的<strong>背景和边框</strong>。</li>
      <li><strong>负 <code>z-index</code></strong> 的后代。</li>
      <li><strong>块级</strong>元素。</li>
      <li><strong>浮动</strong>元素。</li>
      <li><strong>行内 / 行内块</strong>元素。</li>
      <li><code>z-index</code> 为 <code>0</code> 或 <code>auto</code> 的定位元素。</li>
      <li><strong>正 <code>z-index</code></strong> 的定位元素。</li>
    </ol>
    <p>
      拿着这套模型回头看，就能得出几条稳定的实践：调试层级时，<strong>只应比较同一上下文内的兄弟及其后代</strong>，别跨边界硬加数字；动画里用到的 <code>transform</code>、<code>opacity</code>、<code>filter</code> 随时可能凭空造出边界，改层级前先查一眼；需要主动隔离而又不想有任何视觉副作用时，用 <code>isolation: isolate</code> 最干净。
    </p>
    <div class="lesson-box hint">
      <strong>弹层的最佳实践：</strong>模态、下拉、Popover 这类需要「永远在最上层」的组件，尽量挂到 <code>body</code> 下渲染（也就是常说的传送门 / Portal），从根本上避开祖先层叠上下文的束缚，比在组件树里死磕 <code>z-index</code> 稳得多。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先在默认模式看 999 &gt; 2 &gt; 1 的正常排序，再给 B 的父元素加上 opacity 或 transform，看它如何被整体隔离。</figcaption>
      <C17StackingContext />
    </figure>

    <h2>总结</h2>
    <p>
      <code>z-index</code> 只在定位元素上生效，而且比较范围被限制在同一个层叠上下文内。父元素一旦创建上下文，子元素再大的 <code>z-index</code> 也翻不过那道边界。<code>opacity</code> 小于 1、<code>transform</code> 非 <code>none</code>、<code>filter</code> 非 <code>none</code>、<code>isolation: isolate</code>、flex / grid 子项带 <code>z-index</code> 等都会创建新上下文——记住这一点，层级问题就不再靠猜。
    </p>
    <div class="lesson-term">
      <span class="term-name">「层叠上下文」</span>是一个独立的层级比较范围：<code>z-index</code> 仅在<strong>同一上下文内</strong>比较，创建了新上下文的元素会连同其后代被当作一个整体参与父级排序，因此子元素再高的 <code>z-index</code> 也无法越过上下文边界与外部元素比较。常见创建条件包括 <code>z-index</code> 非 <code>auto</code> + 定位、<code>opacity</code> 小于 1、<code>transform</code> / <code>filter</code> 非 <code>none</code>、<code>isolation: isolate</code>、<code>will-change</code> 及 flex / grid 子项带 <code>z-index</code>；其中 <code>isolation: isolate</code> 是最干净且无视觉副作用的主动建上下文手段。
    </div>
  </LessonArticle>
</template>
