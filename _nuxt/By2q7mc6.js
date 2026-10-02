const e=`<script setup lang="ts">
import C04Grid from './C04Grid.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>后台仪表盘要「页头横跨整宽、左边固定侧栏、右边内容自适应、页脚压底」，我用 flex 横排竖排套了三层，侧栏和内容的高度却怎么也对不齐——为什么？
    </div>

    <h2>后台骨架分区需求</h2>
    <p>
      你在搭一个课程运营后台的骨架：顶部一条页头，下面左边是导航侧栏、右边是内容区，最底下一行页脚。页头要横跨整宽，侧栏又要从页头下面一直延伸到页脚上面——这是一个「同时要管行、又要管列」的结构，可横跨和纵跨两件事，恰好是单方向模型最难表达的。
    </p>
    <p>
      代价是<strong>骨架会被表达方式反过来绑架</strong>：套得越深，层级越多，每个断点都要重排一遍嵌套关系；改一处结构要动好几层容器，可读性和可维护性都随之下滑。
    </p>
    <p>
      关键差异在于：flex 的排列是「顺着一个方向流下去」，而仪表盘这种结构需要的是「先把版面切成格子，再把元素放进去」。前者描述过程，后者描述结果——这就是为什么二维布局需要另一个模型。
    </p>

    <h2>浮动与弹性拼接</h2>
    <p>
      用 flex 硬拼：外层横排，装下侧栏和主区；主区里再竖排，装下页头、内容、页脚。或者更老派一点，用 <code>float</code> 把侧栏浮起来、给内容留出边距。
    </p>
    <p>
      它做对了<strong>「先分区、再排列」这个大方向</strong>：先把页面切成几块，再逐块排列。当结构只有简单的头尾两段式时，这套写法是够用的。
    </p>

    <h2>一维模型表达局限</h2>
    <ul>
      <li>行列交叉的需求表达不了：页头要横跨两列、侧栏要纵跨两行，一维模型里没有「跨」这个概念。</li>
      <li>层级被迫加深：为了拼出二维效果，容器要一层套一层，结构越复杂嵌套越深。</li>
      <li>对齐是间接的：想让左右两块的基线或是高度对齐，只能靠额外的属性去凑。</li>
      <li>响应式要重排嵌套：每换一次断点，可能连容器层级都要重写。</li>
      <li>浮动的老写法还要清浮动，父容器包不住子元素时就出问题。</li>
    </ul>

    <h2>网格布局二维模型</h2>
    <p>
      不推翻「分区排列」，而是换一个天然二维的模型：<code>display: grid</code>。它直接承认行和列同时存在，用 <code>grid-template-columns</code> 和 <code>grid-template-rows</code> 定义<strong>轨道</strong>，也就是一条条行线和列线划出的格子。
    </p>
    <p>
      轨道里的宽度有个专有单位 <code>fr</code>，表示「剩余可用空间的一份」。它能和固定像素混用：<code>200px 1fr 200px</code> 就是左右各锁死 200px、中间吃掉全部剩余。<code>repeat(3, 1fr)</code> 把重复的轨道写简，<code>minmax(120px, 1fr)</code> 给一列同时设下限与弹性上限，而 <code>repeat(auto-fill, minmax(120px, 1fr))</code> 会让列数<strong>随容器宽度自动增减</strong>——这已经是一种不用写媒体查询的响应式了。轨道之间留缝用 <code>gap</code>，一次设定横向纵向的间距。
    </p>
    <p>
      轨道定好之后，并非所有格子都要你亲手画。当你用 <code>grid-area</code> 把元素放到显式轨道之外时，浏览器会自动生成新的行或列来接住它，这部分叫<strong>隐式网格</strong>，<code>grid-auto-rows</code> 可以规定这些自动行的高度。理解了这一点，就不会奇怪「我明明只定义了三列，第四列为什么会自己冒出来」。
    </p>
    <p>
      真正解决开场那个「横跨又纵跨」的，是区域命名布局：
    </p>
    <p>
      <code>grid-template-areas</code> 里写上 <code>"header header"</code>、<code>"sidebar main"</code>、<code>"footer footer"</code> 三行，就相当于把骨架<strong>画</strong>了出来——同一个名字横着占两格就是横跨。子元素只要写 <code>grid-area: header</code> 就自动归位，页头自然横跨整宽、侧栏自然纵跨页头与页脚之间。好处是骨架的这几行字符串一眼可读，改结构只改这几行，不用再去挪嵌套。
    </p>
    <p>
      如果不想命名，也可以用网格线定位：<code>grid-column: 1 / 3</code> 表示从第 1 条列线跨到第 3 条列线，即占两列；<code>grid-row: span 2</code> 表示向下跨两行。
    </p>
    <div class="lesson-box hint">
      <strong>与 Flexbox 的分工：</strong>Grid 负责页面级的二维骨架，Flexbox 负责组件内部的一维排列。用 fr 混搭固定像素前，先想清楚哪些维度该随窗口伸缩、哪些该锁死——这一点想清楚了，轨道怎么写就是顺理成章的事。
    </div>
    <p>
      Grid 同样能管对齐。<code>justify-items</code> 控制项目在格子内的水平位置，<code>align-items</code> 控制垂直位置，两者都设在容器上；只想调某一个项目时，就写在项目自己身上。它们的默认值是 <code>stretch</code>，所以格子里的元素往往会被拉满——这也是为什么有时「明明没设宽度，卡片却铺满了整格」。
    </p>

    <h2>列轨道与区域对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换列轨道与区域命名，看二维骨架如何被一次定义、子项自动归位。</figcaption>
      <C04Grid />
    </figure>

    <h2>行列并重布局能力</h2>
    <p>
      Grid 把「同时控制行和列」变成了第一等公民：用轨道定义格子尺寸，用 fr 分配空间、minmax 与 auto-fill 做自适应，用区域命名把页面骨架写成可读的图形。遇到横跨纵跨的二维结构，就不必再用一层层 flex 去凑了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Grid」</span>是二维布局模型：<code>grid-template-columns/rows</code> 定义轨道，<code>fr</code> 分配可用空间比例，<code>repeat()</code> 简化重复，<code>minmax()</code> 设上下限，<code>repeat(auto-fill, minmax(120px, 1fr))</code> 让列数随宽度自动增减；<code>grid-template-areas</code> 用命名区域语义化描述页面骨架，子元素以 <code>grid-area</code> 归位。二维整体布局交给 Grid，一维的组件内部仍用 Flexbox。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
