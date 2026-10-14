<script setup lang="ts">
import LG03Middleware from './LG03Middleware.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程助手的内容跑通了，运营接连提了四个需求：预算用完自动停；对话太长要截断；手机号不能发给模型；广告禁用词不能出现在回复里。你照单执行——加四个节点、重连六条边。第三个需求进来时，图已经没人看得懂了。
    </div>

    <h2>横切需求污染图结构</h2>
    <p>
      预算、安全、脱敏这些需求有个共同特征：<strong>它们不属于任何一条业务路径，却要在每条路径上都生效</strong>。这类「横切关注点」用节点去实现，必然和业务节点混杂在一起，带来三笔账：
    </p>
    <ul>
      <li>图越来越难读：业务流转里插着预算检查、敏感词过滤，谁是主干谁是补丁分不清。</li>
      <li>复用靠复制：另一个智能体也要预算控制，只能把节点加边整段抄。</li>
      <li>顺序靠猜：过滤节点插在模型前还是后，行为完全不同，调整一次要重连一次边。</li>
    </ul>
    <p>
      要回答的是：<strong>怎样让这些横切逻辑挂进工作流，却不动主干图的一根边？</strong>
    </p>

    <h2>给执行过程预留钩子</h2>
    <p>
      换一个思路：不往图里加节点，而是在「模型调用」这个动作的生命周期上<strong>预留钩子</strong>——就像 Git 的 hook 或前端框架的生命周期函数。LangGraph 1.0 把这套机制正式化为<strong>中间件（Middleware）</strong>：一个中间件就是一个声明式对象，标好自己要挂的钩子，剩下的接入工作由框架完成。
    </p>
    <p>
      最常用的四个钩子正好对应四类需求：
    </p>
    <ol class="lesson-steps">
      <li><code>beforeModel</code>：模型调用<strong>之前</strong>执行。适合一刀切的决策——预算超限直接熔断，本次调用根本不会发生，这是最省钱的一种「拒绝」。</li>
      <li><code>wrapModelCall</code>：<strong>包裹</strong>模型调用。拿到请求对象再放行，可以改请求（消息截断、PII 脱敏）或改响应，像洋葱一样层层包裹。</li>
      <li><code>afterModel</code>：模型调用<strong>之后</strong>执行。适合检查刚生成的内容——敏感词过滤、格式校验，不合格就替换或标记。</li>
      <li>同类还有 <code>wrapToolCall</code>、<code>beforeAgent</code>、<code>afterAgent</code>，分别对应工具调用与整轮 Agent 循环的时机。</li>
    </ol>
    <p>
      挂载方式就是在创建智能体时传一个 <code>middleware</code> 数组：<code>createAgent({ model, tools, middleware: [...] })</code>。图的主干没变、边没变——<strong>扩展与被扩展彻底解耦</strong>，中间件可以独立开发、独立开关、跨智能体复用。
    </p>
    <div class="lesson-box hint">
      <strong>执行顺序要记住：</strong>多个中间件按数组顺序叠加，wrap 类钩子「先注册的在最外层」——请求依次进入、响应原路返回。预算熔断放最前面，能挡住后面所有开销。
    </div>

    <h2>四类钩子链路演示</h2>
    <figure class="lesson-figure">
      <figcaption>四个中间件各挂一个钩子。默认四个全开，点「运行调用链」看它们依次生效：手机号被脱敏、敏感词被替换；把「预算状态」切到耗尽，beforeModel 会直接熔断，后面所有步骤不再执行；关掉某个开关，对比跳过后的结果差异。</figcaption>
      <LG03Middleware />
    </figure>

    <h2>钩子接入代替图中加节点</h2>
    <p>
      中间件解决的是「横切逻辑如何进工作流」：不改主干图，把预算、安全、脱敏挂到模型调用生命周期的钩子上。它的代价转移得明明白白——接受约定的钩子时机（而非任意位置），换来图结构与横切逻辑的彻底解耦。
    </p>
    <div class="lesson-term">
      <span class="term-name">「中间件（Middleware）」</span>是挂在执行生命周期钩子上的可复用逻辑单元：<code>beforeModel</code> 在调用前决策（可熔断）、<code>wrapModelCall</code> 包裹请求与响应（可改写）、<code>afterModel</code> 检查生成结果（可过滤），另有工具与整轮循环的对应钩子。要记住的边界：钩子时机是框架约定好的，选错钩子做错事——比如把脱敏放进 afterModel，敏感数据早已发出；多个中间件按注册顺序叠加，熔断类要放最外层。
    </div>
  </LessonArticle>
</template>
