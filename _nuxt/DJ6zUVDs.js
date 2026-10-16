const n=`<script setup lang="ts">
import LG02StateGraph from './LG02StateGraph.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要做一条「内容生产线」：大纲 → 正文 → 质检 → 摘要。前三步还顺，可质检这一步出了岔子——正文太短要<strong>回炉重写</strong>。线性链只会从上往下走一遍，「退回上一步」这种要求一加上，链路设计立刻塌方。
    </div>

    <h2>回环需求击穿线性链</h2>
    <p>
      上一颗栗子里，Agent 的循环被封装在预置图内部，你没有亲手搭过图。现在轮到自定义工作流：质检不达标要回炉、分支要按内容动态选择——这些需求都在说同一件事，<strong>流程不是一条直线，而是一张有环的网</strong>。线性链表达不了环，而裸写 <code>while</code> 又回到「调度代码和业务逻辑缠在一起」的老路。
    </p>

    <h2>状态对象与节点函数</h2>
    <p>
      先把「流程怎么走」和「每一步做什么」拆开。做法是一份<strong>状态对象</strong>加一组<strong>节点函数</strong>：状态里放流程要用的所有字段（大纲、正文、重试次数、日志），节点函数只做两件事——<strong>读状态、返回一份局部更新</strong>。谁都不许就地改状态，节点之间也不许互相调用，状态对象就是它们之间唯一的约定。
    </p>
    <p>
      这个方案做对了关键的一件事：<strong>每个节点都成了纯函数式的独立单元</strong>——可以单测、可以替换、可以重排。剩下的问题只有一个：用什么结构来编排它们。
    </p>

    <h2>调度器承担隐性契约</h2>
    <ul>
      <li>顺序数组走不回头：「质检不通过就回到正文」需要从后一步指回前一步，数组表达不了。</li>
      <li>合并规则没有约定：多个节点都写 <code>log</code> 时，后写的会把先写的整段覆盖——覆盖还是追加，全凭自觉。</li>
      <li>循环没有刹车：回环一旦成立，「重试到什么时候停」必须显式设计，否则栈会烧穿。</li>
      <li>执行过程不可见：跑到一半失败，没有统一记录「哪个节点写了什么」，无法续跑、无法回放。</li>
    </ul>

    <h2>有向状态图三件套</h2>
    <p>
      不推翻状态与节点，把调度部分升级成 <code>StateGraph</code>：<strong>状态用 Annotation 声明、流转用边描述、执行交给框架</strong>。具体分四步补齐。
    </p>
    <ol class="lesson-steps">
      <li><strong>声明状态与合并规则</strong>：用 <code>Annotation.Root</code> 定义每个字段；列表和计数器这类「会反复更新」的字段必须配 reducer——<code>log</code> 用 <code>concat</code> 追加、<code>attempts</code> 用累加，节点返回的局部更新由 reducer 合并进总状态，覆盖与否不再靠自觉。</li>
      <li><strong>节点照旧是纯函数</strong>：接收当前状态、返回局部更新；正文节点重写时多返回一个 <code>attempts: 1</code>，计数器自己就滚了起来。</li>
      <li><strong>用边描述流转</strong>：普通边 <code>addEdge</code> 连固定顺序，条件边 <code>addConditionalEdges</code> 挂一个路由函数——它读状态、返回下一个节点名。质检不通过返回 <code>'content'</code>，回环就成立了；通过返回 <code>'summary'</code>，流程向前走。</li>
      <li><strong>给循环设终止条件</strong>：回环必须能走出去——要么质检放行、要么迭代数触顶强制走向 <code>END</code>。终止条件不是兜底，是环的一部分。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>编译这一步做了什么：</strong><code>graph.compile()</code> 把散装的节点与边变成一张可执行对象：调用 <code>invoke</code> 跑完整流程，调用 <code>stream</code> 逐步观察每个节点的状态更新——「哪个节点写了什么」从此有了统一账本。
    </div>

    <h2>条件边回环执行演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行状态图」，跟踪 review 节点两次判定的区别：第一次正文 280 字被打回 content，计数器累加；第二次 620 字放行通往 summary。右侧状态快照同步显示字段的每次更新。</figcaption>
      <LG02StateGraph />
    </figure>

    <h2>状态驱动而非顺序驱动</h2>
    <p>
      状态图解决的是「复杂流程的编排」：把流程拆成状态、节点、边三样东西，让框架按「当前状态 → 下一跳」驱动执行。链只回答「下一步是谁」，图回答「根据现在的情况，下一步该是谁」——分支与回环因此收进了同一种结构。
    </p>
    <div class="lesson-term">
      <span class="term-name">「StateGraph」</span>把工作流建模为有向状态图：<strong>状态</strong>用 Annotation 声明字段与合并规则（reducer），<strong>节点</strong>是「读状态、返回局部更新」的函数，<strong>边</strong>分普通边与条件边（路由函数读状态返回下一节点名）。要记住的边界：列表、计数器字段不配 reducer 会被整段覆盖；回环必须设计终止条件；状态字段加得越多，每次检查点序列化的负担越大——只放流程真正需要的。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
