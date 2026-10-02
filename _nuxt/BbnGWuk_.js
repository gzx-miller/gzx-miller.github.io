const n=`<script setup lang="ts">
import C12MathFunctions from './C12MathFunctions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>内容区要「占满剩下的宽度」，可旁边还有一条固定 240px 的侧栏——写 <code>width: 100%</code> 会溢出，写死像素又不随屏幕变化，这两种量难道不能写在同一条声明里？
    </div>

    <h2>相对量与临界点</h2>
    <p>
      你在排一个经典的左右布局：左侧栏宽度固定，右侧内容区吃掉剩余空间，四周还要留一点内边距。类似的需求到处都是——标题字号要随视口增长，但别在超大屏上失控；正文宽度要舒服，小屏铺满、大屏收口。
    </p>
    <p>
      这些需求有个共同点：<strong>尺寸既要"相对"，又要"有界"</strong>。可纯 CSS 的一个属性值，过去只能表达其中一样——要么是像 <code>100%</code> 这样的相对量，要么是像 <code>240px</code> 这样的绝对值。想让它们组合，或者给一个相对值套上上下限，你只能靠一堆媒体查询分段兜底，尺寸一变就要同步改好几处，漏一个就错位。
    </p>

    <h2>百分比打底写法</h2>
    <p>
      最朴素的做法：用百分比打底，再用媒体查询在几个临界点分段修正。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它同时表达了相对量和临界点</strong>。在每段尺寸区间里用固定的规则，结果是可预测的、纯 CSS 的，不依赖任何脚本。当尺寸只有简单两三档时，这套写法直观又稳。
    </p>

    <h2>混合单位运算缺失</h2>
    <ul>
      <li>像 <code>100% 减去 32px</code> 这种<strong>混合单位</strong>的运算，在属性值里根本写不出来。</li>
      <li>每一个「不超过」或「不小于」的界限，都要单独配一条媒体查询。</li>
      <li>字号想「随视口增长但封顶 24px」，要拆成好几段来写，段与段的衔接还容易跳变。</li>
      <li>公式一旦调整，所有相关断点都得跟着改，维护成本随尺寸数量上升。</li>
    </ul>

    <h2>算式写进属性值</h2>
    <p>
      不推翻「相对量加临界点」，而是把这层计算<strong>直接写进属性值</strong>——CSS 提供了一组数学函数。
    </p>
    <p>
      <strong><code>calc()</code></strong> 支持混合单位的四则运算，最典型的就是「百分比减去一个固定值」：<code>width: calc(100% - 32px)</code>。它还能读变量：<code>width: calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols))</code>。
    </p>
    <p>
      <strong><code>min()</code></strong> 取所有参数里较小的那个，天然担任宽度上限：<code>width: min(90%, 1200px)</code>——小屏按 90% 铺满，大屏最多 1200px。<strong><code>max()</code></strong> 取较大者，实现"最小值的响应式字号"：<code>font-size: max(14px, 1.5vw)</code>，字号随视口增长，但不会小于 14px。
    </p>
    <p>
      <strong><code>clamp(min, ideal, max)</code></strong> 则一步到位地把理想值<strong>限定在区间内</strong>：<code>font-size: clamp(14px, 2vw, 24px)</code>，理想值是 2vw，但最低不少于 14px、最高不超过 24px。它本质就是 <code>min</code> 与 <code>max</code> 的组合，常用来写响应的字号与间距，例如 <code>padding: clamp(16px, 4vw, 48px)</code>。这些函数还能互相嵌套：<code>min(max(300px, 50%), 600px)</code>。
    </p>
    <p>
      它们和 CSS 变量是天然的搭档：把上限、下限、间距抽成变量，公式本身就能复用——<code>width: min(100% - 2rem, var(--content-max))</code>，换一套令牌就等于换掉整套自适应逻辑。写完公式后，别只看浏览器画出来的宽度，去开发者工具里确认这个值<strong>被解析成了具体的计算值</strong>而不是原样保留的表达式；如果它显示为无效，多半是单位没对上，或者 <code>calc()</code> 的加减号两边少了空格。
    </p>
    <p>四个函数的含义与典型场景放在一起看，选择就很直接。</p>
    <table>
      <thead>
        <tr><th>函数</th><th>含义</th><th>典型场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>calc()</code></td><td>混合单位四则运算</td><td><code>width: calc(100% - 32px)</code></td></tr>
        <tr><td><code>min()</code></td><td>取最小值（上限）</td><td><code>width: min(90%, 1200px)</code></td></tr>
        <tr><td><code>max()</code></td><td>取最大值（下限）</td><td><code>font-size: max(14px, 1.5vw)</code></td></tr>
        <tr><td><code>clamp()</code></td><td>把理想值约束在区间</td><td><code>font-size: clamp(14px, 2vw, 24px)</code></td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>最常写错的语法：</strong><code>calc()</code> 中 <code>+</code> 和 <code>-</code> 两侧<strong>必须留空格</strong>，否则会被当成符号而非运算符；<code>*</code> 和 <code>/</code> 没有这个限制。另外，<code>clamp()</code> 的理想值通常用视口单位（如 <code>vw</code>），上下界用固定值；公式出错时，多数情况是<strong>单位没对上</strong>——在开发者工具里确认结果被解析成了具体的计算值，而不是原样保留的表达式。
    </div>

    <h2>四种函数对照</h2>
    <figure class="lesson-figure">
      <figcaption>依次切换 calc、min、max、clamp，拖动参数看盒子如何在"相减"与"区间约束"之间变化。</figcaption>
      <C12MathFunctions />
    </figure>

    <h2>数学函数职责</h2>
    <p>
      数学函数把「相对量 + 临界点」这件事收进了一条声明：<code>calc()</code> 负责混合单位运算，<code>min()</code> 给上限、<code>max()</code> 给下限，<code>clamp()</code> 一步限定区间。它们还能配合 CSS 变量，把自适应尺寸写成可复用的公式——过去要靠好几段媒体查询拼出来的响应式，现在一行就能表达。它们不只是省代码的语法糖，而是把响应式里「相对量加边界」的意图，直接写进了属性值本身。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CSS 数学函数」</span><code>calc()</code> 支持混合单位的四则运算（<code>+</code>、<code>-</code> 两侧必须留空格），常用于「100% 减固定值」；<code>min()</code> 取较小者，天然担任宽度上限；<code>max()</code> 取较大者，实现响应式字号的下限；<code>clamp(min, ideal, max)</code> 把理想值约束在区间内，理想值常用视口单位、上下界用固定值。它们可嵌套，也能与 CSS 变量组合成自适应公式。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
