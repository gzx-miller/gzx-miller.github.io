<script setup lang="ts">
import C02BoxModel from './C02BoxModel.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给卡片写了 <code>width: 200px</code>，可开发者工具量出来的总宽却是 248px，多出来的 48px 是从哪儿冒出来的？
    </div>

    <h2>宽度所指的范围</h2>
    <p>
      你在排一个三列课程卡片：每张卡片写 <code>width: 33.33%</code>、<code>padding: 16px</code>、<code>border: 1px solid</code>，心里想的是「三张正好铺满一行」。可浏览器把第三张挤到了下一行——因为它实际占的宽度比 33.33% 更大。你只好把宽度改小一点凑合，换到窄屏一测，又错位了。
    </p>
    <p>
      代价在于：<strong>尺寸算不准，建立在尺寸之上的东西全都不可靠</strong>。栅格、间距、响应式断点，本质上都是在算盒子的宽高。如果连「我设的宽度到底指哪一段」都没弄清，后面每调一次布局都只能靠试。
    </p>

    <h2>固定宽高的写法</h2>
    <p>
      最省事的做法：要多大就写多大，直接给元素设 <code>width</code> 和 <code>height</code>，再配 <code>padding</code> 和 <code>border</code>。
    </p>
    <p>
      这个做法对在<strong>它把盒子的四层结构摆出来了</strong>：最里面是内容区，外面依次是内边距 padding、边框 border、外边距 margin。想给内容留白就加 padding，想画边界就加 border，思路本身没错。问题只出在「这些层怎么分摊你写下的那个宽度」。
    </p>

    <h2>实际总宽的膨胀</h2>
    <ul>
      <li>设了 <code>width: 200px</code>、<code>padding: 20px</code>、<code>border: 4px</code>，实际总宽成了 <code>200 + 20×2 + 4×2 = 248px</code>，宽度被 padding 和 border 撑开了。</li>
      <li>总宽不可预测：每加一点 padding 就要回头重算一遍 width，改一处牵动一片。</li>
      <li>相邻盒子的间距总是比预期大：上下各写了 20px 的 margin，量出来却不是 40px。</li>
      <li>父子的上下 margin 也会悄悄合到一起，父容器的高度因此变得难以捉摸。</li>
    </ul>

    <h2>尺寸算法的切换</h2>
    <p>
      先解决「宽度指哪一段」的问题，答案由 <code>box-sizing</code> 给出。<strong><code>content-box</code></strong>（默认）里，<code>width</code> 只指内容区，padding 与 border 要另外加在两侧——所以是 248px。<strong><code>border-box</code></strong> 则把 padding 和 border 一起算进 <code>width</code>，总宽就是 200px，内容区被压缩成 172px。一句话记：content-box 是「内容宽度」，border-box 是「外围宽度」。
    </p>
    <p>
      工程上的通用做法是一开始就统一切到 border-box：
    </p>
    <p>
      <code>*, *::before, *::after { box-sizing: border-box; }</code>
    </p>
    <p>
      这里把伪元素 <code>::before</code>、<code>::after</code> 也写进去，是因为它们同样会生成盒子，漏掉就会在个别地方突然多出偏差。<strong>切到 border-box 之后，「我设了宽度实际却更宽」的困扰就消失了</strong>，三列卡片直接写 33.33% 就能并排。
    </p>
    <p>
      举个例子把账算清：同样是 <code>width: 200px; padding: 20px; border: 4px</code>，在 content-box 下，内容区是 200px，左右各加 20px 内边距与 4px 边框，总宽 248px；在 border-box 下，总宽锁在 200px，内边距与边框先占掉 <code>(20 + 4)×2 = 48px</code>，内容区被压到 172px。<strong>开场多出来的那 48px，正是内边距与边框。</strong>
    </p>
    <p>
      顺带记一个常被问到的点：<code>margin</code> 不在这笔账里。它始终是盒子之外的空白，既不占用 <code>width</code>，也不会撑大元素本身，只影响元素与邻居之间的距离。所以想让盒子「自己看着更大」用 padding，想让「盒子之间离得远」用 margin。
    </p>
    <p>
      这里还有个实用的推论：既然 border-box 会压缩内容区，那么当你真的需要「内容区就固定 200px」时，就应该回到 content-box，或者把内容宽写清楚。但绝大多数场景我们关心的是「盒子占多大地方」，所以 border-box 更符合直觉——这也是它成为事实标准的理由。
    </p>
    <p>
      接着处理那个「间距变大了」的现象：<strong>外边距折叠</strong>。在普通文档流里，垂直相邻的两个块级盒，一个的下外边距和另一个的上外边距会合并，取两者中较大的那个。上盒 30px、下盒 20px，实际间距是 30px，不是 50px——这就是「明明写了两个 20px 却量不出 40px」的答案。
    </p>
    <p>
      把折叠的两条边界再说透一点。其一，它只发生在普通文档流的块级盒之间，横向的外边距从不折叠，所以左右两边各写 20px 就是货真价实的 40px；其二，父子之间也会折叠，父元素没有内边距、边框或 BFC 隔离时，子元素的上外边距会「穿透」到父元素外面，父容器的高度因此对不上。遇到疑似折叠，先用开发者工具量一量父容器的实际高度，再决定是给它加 padding，还是改成 <code>display: flow-root</code>。
    </p>
    <div class="lesson-box warn">
      <strong>排查顺序：</strong>发现两个元素间距不对劲，第一反应先怀疑外边距折叠，而不是急着改数值；确认确实需要那样精确的间距，再考虑换成 padding，或者干脆用 <code>gap</code> 交给 Flex/Grid 来管。
    </div>

    <h2>两套算法的对照表</h2>
    <figure class="lesson-figure">
      <figcaption>切换 content-box 与 border-box，对照尺寸表看 padding、border 如何分摊总宽。</figcaption>
      <C02BoxModel />
    </figure>

    <h2>可预测的排版宽度</h2>
    <p>
      盒模型把「一个元素占多大地方」拆成内容、内边距、边框、外边距四层。用 <code>box-sizing: border-box</code> 让 <code>width</code> 直接等于外围宽度，尺寸就变成可预测的；再把外边距折叠只发生在垂直方向这件事记住，间距的意外也就少了一半。
    </p>
    <div class="lesson-term">
      <span class="term-name">「盒模型」</span>把元素拆成 content、padding、border、margin 四层。<code>box-sizing</code> 决定 <code>width</code> 指哪一段：<code>content-box</code> 只含内容区，实际总宽要另加 padding 与 border；<code>border-box</code> 把二者算进 width，宽即外围宽。全局设 <code>* { box-sizing: border-box }</code> 是通用做法。<strong>外边距折叠</strong>指普通流中垂直相邻块级盒的外边距合并取较大值，仅限垂直方向，可用 padding 或 <code>display: flow-root</code> 阻断。
    </div>
  </LessonArticle>
</template>
