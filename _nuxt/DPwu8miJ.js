const n=`<script setup lang="ts">
import LG09Parallel from './LG09Parallel.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>作业批改 Agent 要审三个维度：语法、逻辑、文风。你写成三个节点依次执行，一份作业批改要等三份时间——可这三个审查明明互不依赖，都在读同一份作文。用户在等待条前干等，你在账单上看它在空转。
    </div>

    <h2>线性执行的等待浪费</h2>
    <p>
      顺序执行是最容易写对的，但也是等待最贵的：三个互不依赖的子任务占满了一条时间线，总耗时是三者之和。LLM 调用动辄几秒，串行三段就是十几秒；而它们的输入完全相同，<strong>没有任何依赖要求它们排队</strong>。
    </p>
    <p>
      要回答的是：<strong>互不依赖的步骤如何同时推进、又在哪里正确地合流？</strong>
    </p>

    <h2>扇出、合流与三种并发形态</h2>
    <p>
      状态图天然支持并发：<strong>一个节点把边指向多个下游，就是扇出</strong>——框架会把下游节点并发调度；<strong>多条边汇聚到同一个节点，就是 fan-in</strong>——框架等所有上游完成后才执行它。合流节点的 reducer 负责把各分支的更新合并进状态，这也是为什么「每个分支各写各的 key」在并发下尤其重要。
    </p>
    <p>
      按「分支数量是否可预知」，并发有三档形态：
    </p>
    <ol class="lesson-steps">
      <li><strong>节点并发（分支数固定）</strong>：像三个审查维度这样，扇出几条边就是几个分支，直接画在图上。</li>
      <li><strong>Send / Map-reduce（分支数运行时决定）</strong>：要按数据条目逐个处理时（比如「每条评论都过一遍过滤」），用一个路由函数为每项生成 <code>new Send('reviewSingle', item)</code>，框架按需创建分支实例，再统一汇入合并节点。</li>
      <li><strong>子图（整段流程复用）</strong>：把一张编译好的图当作另一张图的节点——并发批改这份「能力」被封装成一个组件，外层图不必关心它的内部结构。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>并发安全的两条底线：</strong>并行分支写同一个字段时，要么各写各的 key 由 reducer 合并（<code>{ ...left, ...right }</code>），要么全部走追加型 reducer；否则后完成的会覆盖先完成的，而且这种 bug 只在并发下偶发，最难排查。另外——并行执行不是必须的优化：分支间存在依赖、或下游有限流约束时，串行反而更稳。
    </div>

    <h2>并行与串行耗时对比演示</h2>
    <figure class="lesson-figure">
      <figcaption>默认并行跑一次：三个分支同时点亮、各自计时，最慢的 1300ms 完成后立即 fan-in 汇总；切到「串行对比」再跑，会是三段时间加起来。看右侧日志里两组「完成于 +xxx ms」的差别。</figcaption>
      <LG09Parallel />
    </figure>

    <h2>并发提速与正确合流</h2>
    <p>
      并行执行解决的是「互不依赖的子任务如何提速」：固定分支用扇出、运行时分支数用 Send、可复用的流程打包成子图；合流点由框架等待全部分支，reducer 负责正确合并。并发的收益是延迟，代价是合并规则必须先定对。
    </p>
    <div class="lesson-term">
      <span class="term-name">「扇出 / 合流 / Send」</span>是状态图并发的三件工具：扇出（一条边指向多个节点）让框架并发调度分支；fan-in（多条边汇入一个节点）保证等所有分支完成再合并；<code>Send</code> 在运行时按数据条数动态创建分支实例（Map-reduce）。要记住的边界：并行分支写同名字段必须靠 reducer 或分 key 隔离，否则并发覆盖；合流后的状态是全部分支的合并结果，合并顺序不保证——reducer 要写成顺序无关的；分支内抛错会让整个合流失败，重要分支要自己做兜底。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
