const e=`<script setup lang="ts">
import TW18FlexGrid from './TW18FlexGrid.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程卡片墙我用 <code>flex flex-wrap</code> 排得挺整齐，可最后一行只剩两张卡时，它们被拉得比上面一排宽出一大截——同样一排卡片，为什么一换行就散架？
    </div>

    <h2>导航与卡片墙结构</h2>
    <p>
      你在做一个装备展示页，结构很简单：顶部一条导航（左边 Logo、右边菜单），中间一片商品卡片墙。第一次写的时候你只学了一个布局工具：让父元素 <code>flex</code>，再 <code>flex-wrap</code> 允许换行，卡片各给一个 <code>flex-1</code> 让它自己撑开。导航栏这样写确实漂亮，Logo 靠左、菜单靠右，一行就搞定，于是你顺手把这套写法套到了卡片墙上。
    </p>
    <p>
      问题就出在「顺手」上。导航是一行固定数量的元素，而卡片墙是「数量不定、还要成行成列对齐」的网格。表面看两边都能排出整齐的样子，实际约束完全不同：一边只有横向一个方向，另一边同时要管行和列。所以真正要回答的不是「Flex 和 Grid 哪个更好」，而是<strong>这个布局到底有几个维度、由谁决定尺寸</strong>。
    </p>

    <h2>统一弹性布局方案</h2>
    <p>
      最朴素的做法，是把一切布局都交给 Flex：容器 <code>flex flex-wrap gap-4</code>，卡片给 <code>flex-1 basis-56</code>，让它自己有最小宽度又能伸展。导航栏这么做是对的，卡片墙第一眼也没毛病。
    </p>
    <p>
      这个方案做对了最关键的一件事：<strong>它承认了「一维排列」这种最常见的需求</strong>。元素排成一行、间距均匀、两端对齐，Flex 用 <code>justify-between</code> 与 <code>items-center</code> 一句话就能表达，比手写浮动或绝对定位清爽太多。只要布局是一维的，Flex 就是最短路径，不必舍近求远。
    </p>

    <h2>末行拉伸与高度参差</h2>
    <p>可当卡片墙真的用起来，Flex 的短板一条条冒出来：</p>
    <ul>
      <li>最后一行不满时，<code>flex-1</code> 会让剩下的卡片按剩余空间强行拉伸，宽度和其他行对不齐。</li>
      <li>卡片描述长短不一时，同一行里卡片高度参差，靠 <code>items-stretch</code> 只能勉强撑平，跨行仍然错位。</li>
      <li>要让「某张卡跨两列」这种需求，Flex 根本没有对应的表达方式。</li>
      <li>响应式换列时，得在每张卡上重复写宽度规则，改一次列数要动所有卡片。</li>
      <li>表单那种「姓名、电话各占一列，地址占满整行」的栅格，Flex 拼出来很别扭。</li>
    </ul>
    <p>
      根因其实只有一个：<strong>Flex 是内容驱动、一维的</strong>。子项的尺寸由内容与分配规则决定，容器再按主轴把它们排开；它天生就不负责「行列同时对齐」这件事。你越是要强行让它对齐成网格，写的补偿样式就越多。
    </p>

    <h2>一维流与二维网格</h2>
    <p>
      不推翻 Flex，而是给布局分个类：<strong>一维流用 Flex，二维网格用 Grid</strong>。判断标准很好记——如果你关心的是「这一行里的元素怎么排、怎么对齐」，那是内容驱动的 Flex；如果你关心的是「这个位置该放第几行第几列」，那是布局驱动的 Grid。
    </p>
    <p>
      于是卡片墙换成 Grid：容器写 <code>grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4</code>，列数由容器声明一次，卡片不需要再写任何宽度。轨道一旦定义好，每张卡就被放进固定的格子，最后一行不足时也保持列宽，不会像 Flex 那样被拉开。需要跨列时，给子项加 <code>col-span-2</code> 即可，这是 Flex 给不了的表达力。
    </p>
    <div class="lesson-box hint">
      <strong>两者不互斥，而是分工：</strong>页面骨架、卡片墙这类二维结构交给 Grid 划区域，而每个卡片<strong>内部</strong>的排列——标题在上、描述居中、按钮压到底——再用 Flex 做。<code>flex flex-col justify-between</code> 让按钮在不同高度的卡片里始终贴底，正是 Grid 外层配 Flex 内层的典型组合。
    </div>
    <p>
      再补两个常被忽略的小判断。第一，单独把一个元素水平垂直居中时，<code>flex items-center justify-center</code> 就够了，完全不必为了居中而动用一个 Grid。第二，调布局时与其反复改背景色，不如给容器临时加一个 <code>outline</code> 类描出真实边界——描边不占布局空间，比边框更直观，也更接近你实际想核对的「轨道在哪、有没有溢出」。
    </p>
    <table>
      <thead>
        <tr><th>场景</th><th>推荐</th><th>原因</th></tr>
      </thead>
      <tbody>
        <tr><td>导航栏 / 工具栏</td><td>Flex</td><td>一维横向排列，内容宽度自适应</td></tr>
        <tr><td>标签 / 面包屑</td><td>Flex</td><td>数量不定，靠 flex-wrap 自动换行</td></tr>
        <tr><td>卡片墙 / 商品列表</td><td>Grid</td><td>二维对齐，行列规整</td></tr>
        <tr><td>复杂表单栅格</td><td>Grid</td><td>轨道控制跨列，对齐精准</td></tr>
        <tr><td>单元素居中</td><td>Flex</td><td>items-center 配 justify-center 最省事</td></tr>
      </tbody>
    </table>

    <h2>两种模式四类场景</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Flex 与 Grid 两种模式，再把导航、标签、卡片、表单四个场景都点一遍。</figcaption>
      <TW18FlexGrid />
    </figure>

    <h2>维度选型判断标准</h2>
    <p>
      Flex 与 Grid 不是二选一，而是各自擅长一个维度。先问自己「这个布局有几个方向要同时对齐」：一维流交给 Flex，用 <code>justify-*</code> 与 <code>items-*</code> 控制主轴交叉轴；二维网格交给 Grid，用 <code>grid-cols-*</code> 与 <code>col-span-*</code> 控制轨道。大框架用 Grid、内部对齐用 Flex，两者嵌套是常态而非妥协。
    </p>
    <div class="lesson-term">
      <span class="term-name">「内容驱动 vs 布局驱动」</span>是选择布局方式的第一判据。<strong>Flex 是内容驱动的一维布局</strong>：子项按内容换行伸缩，容器沿主轴把它们排开，适合导航、标签、居中与简单对齐。<strong>Grid 是布局驱动的二维布局</strong>：先声明行列轨道，再把子项放进网格，位置由轨道决定，适合卡片墙、表单栅格与页面骨架。二者可嵌套组合。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
