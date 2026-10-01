<script setup lang="ts">
import L16LangGraph from './L16LangGraph.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把「课程推荐」的四个步骤用链串成一条直线：分析需求 → 搜索课程 → 排序筛选 → 生成回复。产品临时加了一句「用户没给关键词就直接回复提示语」，就这一个分支，你的链式代码立刻散成一堆 <code>if</code>；更犯难的是，批量任务跑到一半失败，你想只重跑「排序」那一步，却根本找不到从哪一步续上。
    </div>

    <h2>线性链路表达能力</h2>
    <p>
      前面的课里，你已经能用 LCEL 的 <code>.pipe()</code> 把多个步骤连成一条链，数据顺着管道一路往下流。可当流程里出现「根据中间结果决定下一步走哪」「某一步不达标要退回去重做」时，直线管道就撑不住了：它只会从上到下走一遍，走完就结束。
    </p>
    <p>
      旧办法是拿普通函数硬写：节点函数各自算一段，再用 <code>if</code> / <code>else</code> 和 <code>while</code> 在外层当调度器。这套写法把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>状态散在各处</strong>：中间结果装在局部变量里，没法序列化，也就没法存档、没法复现。</li>
      <li><strong>流转靠人盯</strong>：循环什么时候停、迭代几次，全靠你手写判断，改一处条件就可能死循环。</li>
      <li><strong>数据怎么合并没约定</strong>：每个节点各写各的，谁都可能把别人刚更新过的字段覆盖掉。</li>
    </ol>
    <p>
      要回答的是：<strong>怎样把「多步骤、带分支、会循环」的智能体工作流，组织成一份可复用、可观察、可复现的结构，而不是一堆互相耦合的调度代码？</strong>
    </p>

    <h2>状态对象与节点函数</h2>
    <p>
      最朴素的做法：用一个接口定义一份「状态对象」，把流程里要用到的字段都放进去；每个步骤写成一个节点函数，接收状态、返回一份局部更新；再写个调度器，按数组顺序依次调用这些节点。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「流程怎么走」和「每一步干什么」拆开了</strong>。节点只关心自己读到什么、写回什么，不需要知道上一步是谁、下一步去哪——这份状态对象就是它们之间唯一的约定。
    </p>

    <h2>顺序数组表达局限</h2>
    <ul>
      <li>数组表达不了分支：需求为空时本该跳过「搜索课程」直达「生成回复」，数组只能塞 <code>if</code>，分支一多就重新乱成一团。</li>
      <li>数组也表达不了循环：「内容太短要退回去重写」这种需求，要求从后一步指回前一步，顺序数组走完就结束，回不了头。</li>
      <li>状态更新没有约定：节点是就地改状态还是返回新对象？两个节点同时写 <code>messages</code> 这类列表时，后写的会把先写的整段覆盖掉。</li>
      <li>没有「执行到哪一步」的统一记录：跑挂之后，你无法从中断处续跑，只能从头再来。</li>
    </ul>

    <h2>有向状态图建模</h2>
    <p>
      不推翻状态对象和节点函数，而是把「顺序数组」升级成一张<strong>有向状态图</strong>。在 LangGraph 里，这套结构叫 <code>StateGraph</code>：<strong>节点</strong>是执行函数，<strong>边</strong>定义从一个节点到下一个节点的转移，编译之后得到一张可以 <code>invoke</code>、也可以 <code>stream</code> 的图。
    </p>
    <p>
      第一步先把固定顺序变成普通边：<code>addNode</code> 注册节点，<code>addEdge</code> 连固定转移，起点用常量 <code>START</code>、终点用 <code>END</code>。
    </p>
    <p>
      第二步补上<strong>分支</strong>，这是图真正强于链的地方：用 <code>addConditionalEdges</code> 给某个节点挂一个「路由函数」，函数读当前状态、返回下一个节点的名字，框架再按映射表跳转。比如审核节点返回 <code>'content' | 'summary'</code>，就能在「内容不达标」时退回重写、达标时直接去生成摘要。
    </p>
    <p>
      第三步，循环其实是分支的副产品——正因为边可以指回前面的节点，<code>content</code> 重写后能再次经过 <code>review</code>，形成「改到合格为止」的循环。但循环必须配一个终止条件：要么让 <code>review</code> 把 <code>needsReview</code> 置为 <code>false</code>，要么让路径最终走到 <code>END</code>，否则就是死循环。
    </p>
    <p>
      第四步，给状态合并定规矩。<strong>节点返回的是局部更新而不是完整状态</strong>，框架负责把它并回总状态；像 <code>messages</code> 这种列表字段要配一个 <strong>reducer</strong>（比如 <code>concat</code>）做追加合并，否则每次返回都会把历史整段替换掉。
    </p>
    <p>
      第五步，让它可观察、可续跑。编译出来的图支持 <code>stream</code>，你能逐条看到哪个节点在跑、更新了哪些字段；再挂上<strong>检查点（checkpointer）</strong>，就能按 <code>thread_id</code> 把长流程暂停、恢复，实现人机协作审批——审核人没批之前，流程停在那儿等你。
    </p>
    <div class="lesson-box hint">
      <strong>一句话记住这个转向：</strong>链只回答「下一步是谁」，图回答「根据当前状态，下一步该是谁」——正是这个「状态驱动机器」的思路，把分支和循环收进了同一种结构里。
    </div>

    <h2>条件边跳转演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行状态机」，看状态依次点亮「分析需求 → 搜索课程 → 排序筛选 → 生成回复」，下方日志逐行记录每次流转；注意那条虚线条件边——当查询为空时，流程会跳过搜索直达回复。</figcaption>
      <L16LangGraph />
    </figure>

    <h2>节点边职责分工</h2>
    <p>
      LangGraph 把智能体工作流建模成一张有向状态图：节点负责干活、边负责流转、条件边负责按状态分支、reducer 负责合并更新、检查点负责续跑。链条答不了的分支与循环，在图里是同一件事——由当前状态决定下一步去哪。
    </p>
    <div class="lesson-term">
      <span class="term-name">「有向状态图（StateGraph）」</span>是把工作流写成「节点 + 边」的结构：节点是接收当前状态、返回局部状态更新的函数；普通边定义固定转移，条件边按路由函数的返回值动态选择下一个节点，因此能表达线性链做不到的循环与分支。要记住的边界：节点返回的是<strong>局部更新</strong>，列表字段必须配合 reducer 才能追加而不会被覆盖；循环一定要有终止条件（走向 <code>END</code> 或翻转状态标志），否则会无限打转。
    </div>
  </LessonArticle>
</template>
