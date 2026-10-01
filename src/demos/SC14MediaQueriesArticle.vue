<script setup lang="ts">
import SC14MediaQueries from './SC14MediaQueries.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我把 <code>.layout</code> 的移动端覆盖连同媒体查询一起写在 <code>.layout</code> 的大括号里，编译出来竟是一条规规矩矩的 <code>@media (min-width: 35rem) { .layout { ... } }</code>——媒体查询明明写在嵌套深处，怎么自己「跑」到了最外层？
    </div>

    <h2>响应式条件割裂</h2>
    <p>
      响应式样式的难处在于：「条件」和「组件」天生是一对，却总被拆开写。传统做法是把整个页面所有媒体查询集中到文件底部的一个大块里，从 <code>@media</code> 的角度看，断点一目了然；可代价也在这里：一个组件的基础样式在上、变化条件在下，读代码的人要在两个地方来回跳。
    </p>
    <p>
      更麻烦的是断点数值。每加一个组件，就把 <code>35rem</code>、<code>64rem</code> 再抄一遍；等设计改了断点，你得全局搜索替换，漏掉一处，页面就会在某个尺寸上错位。完全不借助任何机制，你要么长期人工维护这种「同步」，要么忍受响应式逻辑在文件里四处断裂。
    </p>

    <h2>断点集中末尾</h2>
    <p>
      最朴素的做法：把媒体查询集中写在样式表末尾，所有组件的变化都堆在同一处。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>断点集中，一屏可见</strong>。打开文件底部，就能看到整个页面在哪些尺寸上会发生什么；排查「某个尺寸样式错乱」时，目标明确，不用满仓库找断点。
    </p>

    <h2>规则组件脱节</h2>
    <ul>
      <li>规则和它的组件分离，读到 <code>.layout</code> 的基础样式时不知道它何时会变，得翻到文件末尾才能确认。</li>
      <li>组件一多，底部的媒体块越堆越长，哪条规则属于哪个组件全靠人脑记。</li>
      <li>每个组件都要在媒体块里重复写一遍自己的选择器，组件改名就得改多处。</li>
      <li>断点数值以裸数字散落各处，调整时容易漏改，产生不同步的断点。</li>
    </ul>

    <h2>媒体查询冒泡</h2>
    <p>
      第一步，让媒体查询回到组件旁边。Sass 允许把 <code>@media</code> 写进选择器嵌套里，编译时它会<strong>冒泡（bubble）到可输出的位置</strong>——规则仍带着自己的选择器，只是被提升到了能合法输出的层级：
    </p>
    <p>
      <code>.layout { grid-template-columns: 1fr; @media (width &gt;= 35rem) { grid-template-columns: 12rem 1fr; } }</code>
    </p>
    <p>
      编译后，是一条 <code>@media (width &gt;= 35rem)</code> 包着 <code>.layout</code> 覆盖规则的输出，和写在文件底部完全等价，但声明的来源就摆在组件里。读到基础样式时，变化条件就在眼皮底下。
    </p>
    <p>
      第二步，搞清查询的合并。当嵌套中的媒体查询与外层查询可以组合时，Sass 会把条件<strong>合并成一条</strong>，而不是为同一个目标重复输出多个 <code>@media</code>。这正是「就近写」不会拖垮产物体积的关键：你把规则写在组件里，最终产物仍是干净的、合并后的少量查询。
    </p>
    <p>
      第三步，把断点收敛成变量，让数值只有一个来源；同时改用 CSS 范围语法 <code>(width &gt;= 值)</code> 表达临界点，它比 <code>min-width</code> 更贴近「大于等于多少」的直觉：
    </p>
    <table>
      <thead>
        <tr><th>断点名</th><th>区间</th><th>典型用途</th></tr>
      </thead>
      <tbody>
        <tr><td><code>sm</code></td><td><code>(width &gt;= 35rem)</code></td><td>宽屏手机与平板，单列切双列</td></tr>
        <tr><td><code>md</code></td><td><code>(width &gt;= 48rem)</code></td><td>平板横屏，开始容纳侧栏</td></tr>
        <tr><td><code>lg</code></td><td><code>(width &gt;= 64rem)</code></td><td>桌面多列布局</td></tr>
      </tbody>
    </table>
    <p>
      最后一步是验证。改完别急着合入，打开编译产物核对一眼：媒体查询是否按预期被合并、有没有为同一目标重复输出，会不会因为层级关系冒出意料之外的嵌套查询。就近声明的好处只有在产物端确认过，才算真正落地——毕竟冒泡与合并是编译器在替你做决定，你得亲眼确认它决定得对。
    </p>
    <div class="lesson-box warn">
      <strong>克制地加断点：</strong>常用值控制在 2-3 个就够。每多一个断点，需要验证的尺寸组合都会成倍增加。另外，范围语法更直观，但要用它就得确认项目的浏览器兼容目标支持这种写法；响应式 Mixin 也不该被用来隐藏复杂的业务判断，否则换尺寸查样式就成了解谜。
    </div>

    <h2>临界点切双列</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块改变视口宽度，看单列布局在临界点处切换成双列。</figcaption>
      <SC14MediaQueries />
    </figure>

    <h2>条件重回组件</h2>
    <p>
      媒体查询冒泡把「组件」和「条件」重新放回了一起：条件写在组件旁边，编译时提升到可输出位置，可组合的查询再被合并成一条。配上集中定义的少量断点变量和范围语法，响应式规则就能既就近可读、又不重复膨胀。
    </p>
    <div class="lesson-term">
      <span class="term-name">「媒体查询冒泡」</span>指嵌套中的 <code>@media</code>、<code>@supports</code> 等 at-rule 在编译时被提升到可输出的层级，规则本身仍保留自己的选择器；目标一致的可组合查询还会被合并成一条。实践上把断点收敛为 2-3 个变量，并用 <code>(width &gt;= 值)</code> 的范围语法表达临界点，兼顾就近可读与产物清晰。
    </div>
  </LessonArticle>
</template>
