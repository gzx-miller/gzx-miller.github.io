<script setup lang="ts">
import SC11Color from './SC11Color.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想给品牌色做一个「悬浮时亮一点」的按钮，写下 <code>lighten($brand, 10%)</code>，浅色主题下挺自然——可一到深色主题就糊成一团。同样的「变亮 10%」，怎么就不灵了？
    </div>

    <h2>单一主色派生</h2>
    <p>
      一套设计系统通常只有一个品牌主色，比如 <code>#e85d04</code>。但界面需要的颜色远不止一个：按钮要有默认态和悬浮态，提示框要有柔和背景，边框要比背景略深。你不希望每加一个状态就让设计师再手挑一个色值，于是想<strong>从这一个色值里算法派生出其余的颜色</strong>。
    </p>
    <p>
      这条路不是偷懒，而是必要：如果每个状态色都靠人工指定，主色一改，整套配色就得跟着手工重调，一致性很快崩塌。真正的难点在于，派生的方式选错了，颜色看着「对了一点」，却可能同时踩坏对比度和可访问性。
    </p>

    <h2>亮度旋钮调节</h2>
    <p>
      最直接的做法是给颜色「拧一个旋钮」：想让按钮亮一点就 <code>lighten($brand, 10%)</code>，想让背景柔和就 <code>lighten($brand, 40%)</code>。这类旧全局函数还包括 <code>darken</code>、<code>saturate</code>、<code>adjust-hue</code> 等，它们把颜色当成一个可调节的亮度盘。
    </p>
    <p>
      它做对了一件事：<strong>承认颜色可以被算法派生</strong>，不必每个色值都人工手挑。在只有浅色主题、状态也简单的早期项目里，这套写法确实能跑。
    </p>

    <h2>固定增量失真</h2>
    <ul>
      <li><code>lighten</code> / <code>darken</code> / <code>saturate</code> 等旧全局颜色函数已进入弃用流程，新代码不该再依赖。</li>
      <li>固定加 10% 亮度的语义在不同基底上结果差异巨大：浅底上「亮一点」很自然，深底上直接失真。</li>
      <li><code>color.adjust</code> 与 <code>color.scale</code> 语义不同——一个是固定增减通道量，一个是按比例缩放，混用会产生难以解释的色差。</li>
      <li>数学上「更亮」不等于视觉上「对比度足够」，派生色可能直接违反可访问性要求。</li>
      <li>同一套算法用在深色模式上并不等价，忘记分别验证就会得到一版看不清的配色。</li>
    </ul>

    <h2>颜色空间转换</h2>
    <p>
      不推翻「从品牌色派生」，而是换成 <code>sass:color</code> 模块的函数，在<strong>明确的颜色空间</strong>里读取和转换通道。三个最常用的函数各有清晰语义：
    </p>
    <ul>
      <li><code>color.scale</code>：在某个通道上<strong>按比例缩放</strong>，越接近极值变化越小——这更贴近人眼对「亮一点」的感知。</li>
      <li><code>color.mix</code>：按权重把两种颜色<strong>混合</strong>，用来从主色调出柔和的背景色。</li>
      <li><code>color.adjust</code>：给某个通道<strong>增减固定量</strong>，适合确实需要「抬升固定数值」的场景。</li>
    </ul>
    <p>
      换用之后，一个按钮的派生流程大致是这样：
    </p>
    <ol class="lesson-steps">
      <li>以单一品牌色令牌为来源，不再散落手挑的色值。</li>
      <li>用 <code>color.scale</code> 控制明度，用 <code>color.mix</code> 混出柔和背景。</li>
      <li>对派生结果执行<strong>实际对比度验证</strong>，而不是假设数学变化等于视觉安全。</li>
      <li>把通过验证的派生色固化为令牌，避免每次使用都重新计算、也避免算法一改全线漂移。</li>
    </ol>
    <p>
      这里有一个关键的心态转变：函数只是<strong>生成候选色</strong>的工具，最终能不能用，要靠对比度检查来裁决。把生成的色值固化成令牌之后，它就和手挑的颜色一样稳定，后续改动也有据可查。
    </p>
    <div class="lesson-box warn">
      <strong>数学派生不能保证视觉可访问性。</strong><code>color.scale</code> 与 <code>color.adjust</code> 语义不同，混用会得到难以解释的色差；深浅两种主题下的派生色必须<strong>分别验证</strong>，因为同一算法在深色底上的对比度并不等价。
    </div>

    <h2>通道缩放混合</h2>
    <figure class="lesson-figure">
      <figcaption>拖动亮度滑块、切换不同的颜色函数，感受通道缩放与混合如何改变同一个基色。</figcaption>
      <SC11Color />
    </figure>

    <h2>令牌扩展算法</h2>
    <p>
      配色派生的意义，是把有限的品牌令牌扩展成完整的界面配色，同时不被「手挑色值」拖垮一致性。做法是用 <code>sass:color</code> 的 <code>scale</code> / <code>mix</code> / <code>adjust</code> 在明确的颜色空间里操作通道，再对结果做对比度验证，最后把合格的色值固化成令牌。
    </p>
    <div class="lesson-term">
      <span class="term-name">「颜色派生」</span>指从有限的品牌令牌出发，用算法生成状态色与背景色的做法。<code>sass:color</code> 中 <code>color.scale</code> 按比例缩放通道、<code>color.mix</code> 按权重混合、<code>color.adjust</code> 固定增减通道量，三者语义不同不可混用；旧全局函数（如 <code>lighten</code> / <code>darken</code>）已弃用。派生只是生成候选色，<strong>必须再做对比度验证</strong>，深浅主题需分别检查。
    </div>
  </LessonArticle>
</template>
