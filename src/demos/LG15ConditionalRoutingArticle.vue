<script setup lang="ts">
import LG15ConditionalRouting from './LG15ConditionalRouting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>质检节点只有「通过 / 不通过」两种结果，流程却要走出三种去向：通过去摘要、不通过回炉重写、改到第三次还不合格就强制收尾。固定边只会一条道走到黑，而这些去向又必须由运行时的状态决定。图该怎么表达「看情况走」？
    </div>

    <h2>线性图的边界</h2>
    <p>
      固定边擅长表达「先做什么、再做什么」，但它假设每一步都必然发生、顺序永远不变。真实业务里更常见的是<strong>分叉与回环</strong>：质检不过要退回上一步，分类不同要走不同分支，重试多次仍失败要换兜底路径。把这些判断塞进节点函数也不行——节点返回的是状态更新，不是「下一跳」，调度权仍然不在自己手里。
    </p>
    <p>
      需要的是一层显式的路由：<strong>状态决定去向，路由函数只负责读状态并给出下一个节点名</strong>。这样分支和循环就不再是特例，而是同一套图结构里的普通边。
    </p>

    <h2>条件边：把下一跳抽成函数</h2>
    <p>
      <code>addConditionalEdges</code> 接收三个参数：起点节点、路由函数、路径映射。路由函数拿到当前状态，返回一个字符串；路径映射把这个字符串翻译成真正的目标节点，也可以直接返回节点名。
    </p>
    <ul>
      <li><strong>路由函数保持只读</strong>：不调用模型、不写数据库、不改状态，只做判断。这样它才能被单测覆盖，也才能在排障时复现。</li>
      <li><strong>路径映射显式列出所有出口</strong>：<code>{ content: 'content', summary: 'summary', failed: END }</code> 让「有哪些可能去向」一眼可见，比在函数里散落字符串更容易审查。</li>
      <li><strong>返回值必须落在映射表内</strong>：拼错节点名不会在编译期报错，而是在运行时才暴露，所以路由函数的返回类型应写成字面量联合。</li>
    </ul>
    <p>
      条件边解决的是「从 A 出发可能去 B 或 C」。当判断条件不止一个字段、或者要把「更新状态」和「决定去向」放在同一个动作里完成时，还有另一种写法：<strong>Command</strong>。节点可以返回一个 <code>Command</code> 对象，同时携带状态更新与目标节点：
      <code>return new Command({ goto: 'content', update: { attempts: 1 } })</code>。框架执行完该节点后，不再查条件边，而是按 <code>goto</code> 继续。这适合「交接」语义——一个节点判断完就把控制权连同修正后的状态一起交给下一个节点。
    </p>
    <p>
      它和条件边的差别不只是写法。<strong>条件边把路由放在图结构里</strong>，画布上能看到所有分叉；<strong>Command 把路由藏进节点返回值</strong>，图更简洁，但静态阅读时不容易看全出口。团队协作里更推荐条件边；只有在节点确实需要「一边更新、一边移交」时才用 Command，并且不要在同一张图里混用两种风格。
    </p>

    <h2>循环必须能停下来</h2>
    <p>
      回环是条件边的自然结果，也是最容易出事的地方。一个「不通过就重写」的环，如果质检标准永远达不到，图会无限执行。终止条件要分三层设计：
    </p>
    <ol class="lesson-steps">
      <li><strong>业务条件</strong>：质检通过、人工放行、拿到足够信息，这是正常的出口。</li>
      <li><strong>次数上限</strong>：状态里维护 <code>attempts</code>，达到上限后路由到兜底节点或 <code>END</code>。这是业务层面的「不再重试」。</li>
      <li><strong>框架兜底</strong>：<code>recursionLimit</code> 限制一次调用最多执行多少超步，触顶时抛错而不是拖垮进程。它只负责防止失控，不能替代业务判断。</li>
    </ol>
    <p>
      <code>recursionLimit</code> 不是重试策略。把它调大只是让错误来得更晚，真正要回答的是「重试几次合理、失败后交给谁」。在演示里，第三次不通过会直接走向 <code>END</code>，这就是业务上限与框架兜底同时存在的样子。
    </p>

    <p>
      <strong>路由函数应当可测试。</strong>它是整张图里性价比最高的测试点：输入一份状态、断言一个去向，不需要模型、不需要网络。至少覆盖三类用例——正常通过、可重试的不通过、次数触顶。把它写成纯函数后，这些用例就是几行断言；如果函数里掺了模型调用或随机数，同样的用例只能变成昂贵的集成测试。
    </p>
    <p>
      还有一条容易被忽略的约束：路由函数读到的是<strong>本节点更新合并之后的状态</strong>。如果节点返回了 <code>{ passed: true }</code>，路由函数里就应该看到 <code>passed === true</code>，而不是上一轮的旧值。依赖旧值做判断，会让分支在边界情况下走错。
    </p>

    <h2>质检路由演示</h2>
    <figure class="lesson-figure">
      <figcaption>先点「质检不通过，打回」，观察 review 如何沿条件边回到 content 并累加循环次数；再点「质检通过，放行」，看路由改走 summary。连续打回三次会触发上限，被强制路由到 END。</figcaption>
      <LG15ConditionalRouting />
    </figure>

    <h2>从顺序执行到状态驱动</h2>
    <p>
      条件路由把「下一步是谁」从代码里的 if-else 提升为图上的显式结构。节点仍然只做业务，路由函数只做判断，循环的出口由业务条件、次数上限和框架兜底共同保证。图因此既能表达分叉，也能表达回环，而不会退化成一张难以推理的意大利面。
    </p>
    <div class="lesson-box warn">
      <strong>三个常见坑：</strong>路由函数里做副作用，导致重跑结果不一致；条件边返回了映射表里不存在的键，直到运行时才报错；把 <code>recursionLimit</code> 当成重试上限，忽视了业务层的失败处理。另外，<code>Command</code> 的 <code>update</code> 仍要遵守状态字段的 reducer 规则，列表字段不加 reducer 依然会被覆盖。
    </div>
    <div class="lesson-term">
      <span class="term-name">「条件路由」</span>让图的下一跳由运行时状态决定：<strong>addConditionalEdges</strong> 用「路由函数 + 路径映射」声明出口，<strong>Command</strong> 让节点用 <code>goto</code> 与 <code>update</code> 同时交出方向与状态。要记住的边界：路由函数必须纯、可测试；所有出口要在映射表里列全；循环必须设计业务终止条件，<code>recursionLimit</code> 只是防失控的兜底，不是重试策略。
    </div>
  </LessonArticle>
</template>
