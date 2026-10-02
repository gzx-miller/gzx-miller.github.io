const e=`<script setup lang="ts">
import E03Table from './E03Table.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表里价格显示成「299」没有货币符号、状态显示成英文的 ongoing，难道每渲染一行，都要在模板里手写一遍拼接和转换吗？
    </div>

    <h2>结构化数据列渲染</h2>
    <p>
      后台里几乎每个页面都有一张列表：课程、订单、用户、权限，字段多、还要按列格式化。价格要拼上货币符号、状态要显示成中文标签、操作列要放按钮、讲师名长了要能自适应。这正是表格组件要解决的核心问题——<strong>把一堆结构化数据，按列声明的方式稳定地渲染成可读的行</strong>。
    </p>
    <p>
      不用组件库的代价是什么？你得亲手写 <code>table</code>、<code>thead</code>、<code>tbody</code>、<code>th</code>、<code>td</code> 一整棵结构，再用 <code>v-for</code> 循环出每一行。列对齐、斑马纹、固定表头、空数据占位、横向滚动，这些细节没有一样是白送的，全都要自己补样式。
    </p>

    <h2>原生表格数据循环</h2>
    <p>
      最朴素的做法：用原生表格元素配 <code>v-for</code> 把数据渲染成行，字段直接输出原文。这个方案做对了一件重要的事——<strong>渲染由数据驱动</strong>，改数据即改视图，比手拼字符串强得多；同时表格的语义结构是原生的，浏览器和读屏软件天然能理解。
    </p>

    <h2>单元格加工代价</h2>
    <ul>
      <li>价格、状态这类字段想加工，就得在模板里写一堆三元表达式，或者提前把数据源改好。</li>
      <li>想让某一列渲染成标签或按钮，原生单元格里没法自然地放组件。</li>
      <li>列宽、斑马纹、空状态、表头对齐，全都要自己写，几个页面各写一份，看起来就不像一家的。</li>
      <li>数据一多就整表全渲染，行数上千时滚动会明显卡顿。</li>
    </ul>

    <h2>列声明与数据解耦</h2>
    <p>
      不推翻「数据驱动」，而是把「数据」和「列定义」分开声明。这正是 <code>el-table</code> 的思路：用 <code>:data</code> 传入数组，再用一个个 <code>el-table-column</code> 声明每一列，<code>prop</code> 绑定字段、<code>label</code> 定义表头。列的顺序就是声明的顺序，一眼可读。
    </p>
    <p>
      默认情况下，单元格直接输出字段原文。一旦某列需要格式化或加控件，就换成<strong>作用域插槽</strong>：用 <code>#default="{ row }"</code> 解构出当前行，再自行渲染。价格列可以拼上货币符号，状态列可以换成带颜色的 <code>el-tag</code>，操作列则放上按钮并传入这一行的 <code>row</code>，让「详情」「报名」精确落到某条记录。
    </p>
    <p>
      更值得坚持的是：<strong>把格式化逻辑抽成纯函数</strong>，例如一个负责金额、一个负责状态映射。模板里只留函数调用，简洁、可复用，也方便单独测试。列表上方的搜索框通过 <code>@input</code> 触发过滤，把结果写回 <code>:data</code> 绑定的数组即可。
    </p>
    <p>
      视觉与性能上还有几个开关：<code>stripe</code> 开启斑马纹，<code>row-key</code> 提供稳定的行标识（用于选择、展开等状态跟踪），列多时给固定列宽、给长文本列 <code>min-width</code> 做自适应。
    </p>
    <div class="lesson-box warn">
      <strong>两个别踩的坑：</strong>自定义单元格里要访问当前行数据，<strong>务必从作用域插槽解构 <code>row</code></strong>，直接引用外层变量会拿到错误的数据；数据量大时应配合分页或虚拟滚动，并且<strong>把排序、筛选交给后端</strong>——在 <code>@sort-change</code> 里带上排序字段重新请求，而不是在前端硬算全量数据。
    </div>

    <h2>金额与状态列渲染</h2>
    <figure class="lesson-figure">
      <figcaption>试着搜索课程名或讲师，观察金额与状态列是怎么被自定义渲染出来的。</figcaption>
      <E03Table />
    </figure>

    <h2>声明式表格组织</h2>
    <p>
      表格的关键，是把「一行行的数据」和「一列列的定义」解耦：数据交给 <code>:data</code>，列交给 <code>el-table-column</code>，需要加工的单元格用作用域插槽自己画。格式化抽成纯函数、排序筛选交给后端、大表配合分页——列表就这样从一堆手写标签，变成了一个可维护、可复用的数据视图。
    </p>
    <div class="lesson-term">
      <span class="term-name">「声明式表格」</span>指用 <code>:data</code> 绑定数据数组、用 <code>el-table-column</code> 逐列声明 <code>prop</code> 与 <code>label</code> 的渲染方式。默认单元格输出字段原文，需要格式化或加控件时用 <code>#default="{ row }"</code> 作用域插槽解构当前行自定义渲染；<code>stripe</code> 控制斑马纹，<code>row-key</code> 提供稳定行标识；排序筛选宜交给后端而非前端硬算。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
