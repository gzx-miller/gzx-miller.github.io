const t=`<script setup lang="ts">
import C05Position from './C05Position.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给商品卡片的「热卖」角标写了 <code>position: absolute; top: 0; right: 0</code>，结果角标没待在卡片角上，反而飞到了整个页面的右上角——它到底相对谁在定位？
    </div>

    <h2>多场景定位需求</h2>
    <p>
      同一个页面里还有别的需求：顶部导航要在滚动时一直吸在视口顶端；右下角要有一个悬浮的客服按钮；卡片里的角标要牢牢贴住卡片右上角。这三件事看起来都是「挪个位置」，但要求并不一样——有的要跟着页面滚，有的滚动到某处才吸住，有的只能待在父级内部。
    </p>
    <p>
      代价是<strong>元素会「乱飞」并且挤乱邻居</strong>：偏移基准没搞清，写下的 top/left 就会以你意想不到的参照物生效；而一旦元素脱离文档流不再占位，后面的兄弟会紧接着往上挤，原本对齐的版面瞬间错位。更烦的是「吸顶失效」这类问题，往往改来改去找不到原因。
    </p>
    <p>
      这三个需求的差别，其实落在两个问题上：<strong>元素偏移时以谁为原点，偏移之后它还算不算「原来那个位置」</strong>。把这两问想清楚，五种定位的选用就是水到渠成的事。
    </p>

    <h2>负边距位移方案</h2>
    <p>
      最朴素的做法：用负的 <code>margin</code> 或 <code>transform: translate</code> 把元素硬挪过去。比如角标就用 <code>margin-top: -8px; margin-left: -8px</code> 往外拉一点。
    </p>
    <p>
      它做对了<strong>「位移可以不影响布局」这一层</strong>：<code>transform</code> 只改变绘制位置，不改变元素占的空间，做微调时非常省心。
    </p>

    <h2>裁剪与基准局限</h2>
    <ul>
      <li>往外挪会被父容器的 <code>overflow: hidden</code> 裁掉，或者把父容器撑出滚动条。</li>
      <li>基准是「元素自己原来的位置」：卡片一旦换了位置，写死的偏移量就全错了。</li>
      <li>做不到「跟随视口固定」，也做不到「滚动到某处才吸住」。</li>
      <li>复杂场景下（角标贴父级右上角、弹层居中）没法用位移简单表达。</li>
    </ul>

    <h2>偏移与脱离文档流</h2>
    <p>
      不推翻「位移」，而是用 <code>position</code> 一次说清两件事：<strong>偏移的参考系是谁，以及它是否脱离文档流</strong>。五种取值各有分工：
    </p>
    <ul>
      <li><code>static</code>：默认值，正常文档流，top/right/bottom/left 一律不生效。</li>
      <li><code>relative</code>：相对<strong>自身原来的位置</strong>偏移，但仍保留原来的占位，邻居不会受影响。它更大的用途，是给子级的 absolute 提供一个参考框。</li>
      <li><code>absolute</code>：<strong>脱离文档流</strong>、不占空间，相对最近的<strong>非 static 祖先</strong>定位。</li>
      <li><code>fixed</code>：脱离文档流，相对<strong>视口</strong>固定，页面怎么滚它都不动，适合吸顶导航和悬浮按钮。</li>
      <li><code>sticky</code>：越过阈值之前保留原位、像普通元素一样跟着滚；越过阈值后像 fixed 一样吸住，特别适合吸附式表头。</li>
    </ul>
    <table>
      <thead>
        <tr><th>取值</th><th>是否脱离文档流</th><th>参考基准</th></tr>
      </thead>
      <tbody>
        <tr><td><code>static</code></td><td>不脱离</td><td>无（默认，偏移不生效）</td></tr>
        <tr><td><code>relative</code></td><td>不脱离</td><td>自身原位置</td></tr>
        <tr><td><code>absolute</code></td><td>脱离</td><td>最近的非 static 祖先</td></tr>
        <tr><td><code>fixed</code></td><td>脱离</td><td>视口</td></tr>
        <tr><td><code>sticky</code></td><td>不脱离（滚动时转为固定效果）</td><td>滚动祖先 + 阈值</td></tr>
      </tbody>
    </table>
    <p>
      拿着这张表回看开场：角标飞走的根因，是卡片本身没有建立参考系。<code>absolute</code> 必须依托一个非 static 的祖先，否则它会一路向上找到视口，于是角标就跑到了页面右上角。正确写法是给卡片加一句 <code>position: relative</code>，角标立刻回到卡片角上。
    </p>
    <p>
      日常最常用的一对组合就是「父 relative、子 absolute」：父元素本身往往不需要移动，只是把 <code>position: relative</code> 当作一个「定位锚点」挂在那里，让子元素的 top/right 有了参照物。养成习惯——要放角标、遮罩、关闭按钮时，先给容器补上这句锚点。
    </p>
    <p>
      还有一个容易被忽略的副作用：<code>position</code> 一旦不是 <code>static</code>，元素就获得了参与 <code>z-index</code> 比较的资格，也就是说定位往往和「谁压住谁」绑在一起。吸顶导航给一个 <code>z-index: 100</code>，就是为了在滚上去时压住下面的内容。层级问题的完整规则在 C_17，这里先记住「定位会打开层级比较的大门」就够了。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见坑：</strong>其一，<code>sticky</code> 必须同时给出 top/bottom/left/right 中的至少一个，只写 <code>position: sticky</code> 是不会生效的；而且它在父容器的高度用尽之后会随容器滚出视口，并非常久吸顶。其二，<code>fixed</code> 默认相对视口，但如果祖先带有 <code>transform</code>、<code>filter</code> 这类属性，它会被当作包含块而不再是视口——这也是弹层偶尔「位置突然不对」的原因。
    </div>

    <h2>五种定位对照</h2>
    <figure class="lesson-figure">
      <figcaption>依次切换五种定位值，观察盒子位置、占位与滚动行为的变化。</figcaption>
      <C05Position />
    </figure>

    <h2>基准与占位差异</h2>
    <p>
      定位要同时回答两个问题：<strong>相对谁偏移，以及是否还占原来的位置</strong>。relative 保留占位、absolute 脱离流并找最近的非 static 祖先、fixed 认准视口、sticky 到阈值才吸住——把参考系和占位这两条理清，元素乱飞与吸顶失效就都有了答案。
    </p>
    <div class="lesson-term">
      <span class="term-name">「定位」</span>由 <code>position</code> 决定偏移参考系与是否脱离文档流：<code>static</code> 不定位；<code>relative</code> 相对自身原位置偏移且保留占位；<code>absolute</code> 脱离文档流、相对最近的非 static 祖先定位；<code>fixed</code> 脱离文档流、相对视口固定；<code>sticky</code> 越过阈值前保留原位、越过阈值后吸住（须给定 top/left 等）。注意祖先的 <code>transform</code>/<code>filter</code> 会改变 fixed 的包含块。
    </div>
  </LessonArticle>
</template>
`;export{t as default};
