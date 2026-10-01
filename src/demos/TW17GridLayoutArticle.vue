<script setup lang="ts">
import TW17GridLayout from './TW17GridLayout.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>小屋预订列表要「移动端一列、平板两列、桌面三列」，我用百分比宽度加 <code>float</code> 拼了半天，一到换行就参差不齐，列与列之间的缝隙也总对不齐——有没有更靠谱的做法？
    </div>

    <h2>卡片网格需求</h2>
    <p>
      你在做一个「小屋预订」页面：一排小屋卡片，每张有封面、名字、标签和价格，需要整齐地排成网格。要求很明确——移动端单列、平板双列、桌面三列；卡片之间留出均匀的间距；还要支持「某张卡跨两列」这类突出展示。
    </p>
    <p>
      这其实是一个<strong>二维</strong>问题：既要控制「一行几列」，又要控制「跨几行几列」。用只擅长一维的布局去硬凑，就会陷入「算宽度、算外边距、算百分比」的泥潭。而 CSS Grid 天生就是为二维布局设计的：<strong>先声明行列轨道，再把子项放进网格</strong>，位置由轨道决定，而不是由内容宽度反推。
    </p>

    <h2>百分比宽度凑列</h2>
    <p>
      最省事的做法，是给每张卡片一个百分比宽度（比如 <code>w-1/3</code>），再用外边距把它们「推」开。这个方案对的地方在于，<strong>它确实形成了多列排布</strong>，在数量正好、宽度正好整除的情况下，看上去还挺整齐。
    </p>
    <p>
      但它没有任何「轨道」概念，所有的对齐都是靠数值凑出来的。一旦卡片数量不是列数的整数倍，最后一行就会孤零零地缺角；外边距又会把宽度撑出 100%，导致本应换行的卡片被挤下去。你花了大量时间在调数值，却始终得不到稳定的结果。
    </p>

    <h2>总宽溢出与换行</h2>
    <ul>
      <li>用百分比宽度加外边距凑列，总宽度容易超过 100%，触发意外换行。</li>
      <li>没有真正的行列概念，无法表达「跨列」「跨行」这类二维需求。</li>
      <li>响应式切换列数时，每一处宽度与边距都要重算，维护成本高。</li>
      <li>垂直方向无法对齐，各卡片高度不一时底部参差不齐。</li>
      <li>整页骨架（页头、侧栏、主内容、页脚）用一维布局描述非常别扭。</li>
    </ul>

    <h2>轨道网格思维</h2>
    <p>
      不推翻「排成多列」，而是换用一套<strong>轨道思维</strong>。Grid 的基本套路非常清晰：用 <code>grid-cols-*</code> 声明列轨道、<code>grid-rows-*</code> 声明行轨道，用 <code>gap-*</code> 设定轨道之间的间距，然后交给子项去「落位」。卡片墙只需要 <code>grid grid-cols-3 gap-4</code> 三个类，间距和对齐就全有了——因为 <code>gap</code> 是在轨道之间统一插入的，不会像外边距那样叠加，也不可能撑破容器。
    </p>
    <p>
      接着处理「跨列跨行」。子项用 <code>col-span-*</code> / <code>row-span-*</code> 就能横跨多列或多行；想用自定义比例，写成 <code>grid-cols-[1fr_3fr]</code> 这样的任意值即可。<strong>需要特别记住的是：跨行跨列类（<code>col-span-*</code>、<code>col-start-*</code>）只对 Grid 容器的直系子项生效</strong>——如果中间又套了一层 <code>&lt;div&gt;</code>，跨列就不会起作用，这是初学者最常卡住的地方。
    </p>
    <p>
      第三步，用<strong>命名区域</strong>描述整页骨架。对于「页头、侧栏、主内容、页脚」这种结构，用 <code>grid-template-areas</code> 定义区域、再用 <code>grid-area</code> 把每个子项放进对应区域，可读性远高于数格子。好处是：改布局时只需改一处模板——把 <code>areas</code> 的顺序调一下，整页就重排了，不必去动每个子项的跨列数字。
    </p>
    <div class="lesson-box hint">
      <strong>两个实用技巧：</strong>其一，<code>grid-cols-[repeat(auto-fill,minmax(200px,1fr))]</code> 能生成「自动填充」的等宽卡片墙，无需手动指定列数，卡片会自动换行并保持最小宽度。其二，用 <code>place-items-center</code> 可以让所有网格子项一次性水平垂直居中，省掉对每个子项单独设置的麻烦。至于 <code>auto-fill</code> 与 <code>auto-fit</code>，差异在于对空轨道的处理：<strong>需要卡片保持最小宽度时用 <code>auto-fill</code></strong>，希望空轨道被吸收、卡片拉满则用 <code>auto-fit</code>。
    </div>
    <p>
      最后是响应式切换。Grid 的列数同样可以加断点前缀：<code>grid-cols-1 md:grid-cols-2 lg:grid-cols-3</code>，一句话就表达了「移动端一列、平板两列、桌面三列」。因为轨道由容器决定，切换列数时卡片会自动重排，你不需要像 percentages 方案那样重算任何宽度。
    </p>
    <p>
      把它整理成一条流程：<strong>先用 <code>grid-cols-*</code> 定列数、<code>gap</code> 定轨道间距搭建二维网格 → 用 <code>col-span-*</code> / <code>row-span-*</code> 控制跨列跨行或自定义比例 → 整页骨架用 <code>grid-template-areas</code> 加 <code>grid-area</code> 命名区域 → 收窄窗口验证列数与跨列行为按断点平滑切换。</strong>
    </p>

    <h2>列数与命名区域</h2>
    <figure class="lesson-figure">
      <figcaption>拖动列数与间距滑块，并在三个标签页间切换，观察 Grid 轨道、Template 语法与命名区域的实际效果。</figcaption>
      <TW17GridLayout />
    </figure>

    <h2>声明轨道式布局</h2>
    <p>
      Grid 的思维方式，是从「拼凑宽度」转向「声明轨道」：先定行列，再让子项落位、按需跨列跨行，最后用响应式前缀切换列数。整页骨架交给命名区域，组件内部再用 Flex 做流式对齐。跨列类只认直系子项、<code>auto-fill</code> 与 <code>auto-fit</code> 的差异——记住这两点，二维布局就再没有难缠的角落。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Grid 网格布局」</span>指用 <code>grid-cols-*</code> / <code>grid-rows-*</code> 声明行列轨道，<code>gap-*</code> 设轨道间距，<code>col-span-*</code> / <code>row-span-*</code> 控制子项跨列跨行，<code>grid-template-areas</code> 加 <code>grid-area</code> 用命名区域描述整页骨架，<code>place-items-*</code> 控制对齐。约定：跨行跨列类只对 Grid 容器直系子项生效；<code>grid-cols-[repeat(auto-fill,minmax(200px,1fr))]</code> 可自动填充等宽卡片墙，需要保持最小宽度时用 <code>auto-fill</code>。
    </div>
  </LessonArticle>
</template>
