const n=`<script setup lang="ts">
import L11Callbacks from './L11Callbacks.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>线上用户抱怨「提了个问题，转了半天圈最后报了个错」。你翻遍日志，只找到一行「调用失败」——到底是检索慢、模型超时，还是输出解析挂了，完全看不出来。
    </div>

    <h2>调用过程黑盒</h2>
    <p>
      你的链是 <code>prompt.pipe(model).pipe(parser)</code>，对外只暴露一个 <code>invoke</code>。它只给你两样东西：最后的返回值，或者一个异常。中间经过了哪些步骤、每一步花了多久、模型吐了多少 token，全都是不可见的黑盒。
    </p>
    <p>
      想定位问题或者算成本，只能在链的每一段前后手写日志和计时。这是最直接的办法，但它把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>日志侵入业务代码</strong>：链一改动，埋在各个角落的打印就得跟着改，忘一处就漏一处。</li>
      <li><strong>模型内部根本插不进手</strong>：你只能包住自己拼的环节，模型真正发请求、逐 token 生成的过程你碰不到。</li>
      <li><strong>并发和嵌套时日志全乱</strong>：一次请求还没跑完，另一次已经涌进来了，几组日志混在一起，谁也分不清哪条属于哪趟调用。</li>
    </ol>
    <p>
      要回答的是：<strong>能不能有一套不侵入业务代码的机制，在链执行的每个阶段自动告诉你「谁开始了、谁结束了、花了多久、吐了什么」？</strong>
    </p>

    <h2>手动埋点与计时</h2>
    <p>
      最朴素的做法：在每一段调用前后手动加计时和打印。调用前记一个 <code>Date.now()</code>，收到结果后再打一条日志，把结果和耗时一起写下来。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「执行过程本身就是一份有用的数据」</strong>。你不只关心最终答案，还关心它是怎么来的——从「只看结果」往前走了一步。
    </p>

    <h2>并发日志混乱</h2>
    <ul>
      <li>你只能包住自己写的环节；模型内部的调用、逐 token 生成的时机，代码里没有任何地方让你插进去。</li>
      <li>同一个链被并发调用两次时，两次的日志交错打印，你无法把「这条日志」和「那次调用」对应起来。</li>
      <li>想统计每次调用的 token 用量，从头到尾都拿不到这个数字，只能另行想办法去捞。</li>
      <li>每个调用点都要复制一遍同样的模板代码，漏掉任意一处就是个监控盲区。</li>
    </ul>

    <h2>框架层回调挂钩</h2>
    <p>
      不推翻「记录过程」，而是把「在哪记」从业务代码里挪到框架层——这就是回调。你实现一个 <code>CallbackHandler</code>，定义好一组约定方法，LangChain 在链执行到对应阶段时会自动调用它们，你的业务代码一行都不用改。
    </p>
    <ol class="lesson-steps">
      <li>实现 <code>CallbackHandler</code>，定义 <code>handleChainStart</code>、<code>handleLLMStart</code>、<code>handleLLMNewToken</code>、<code>handleLLMEnd</code> 等方法。</li>
      <li>把这个 handler 传进 Runnable 的 callbacks 参数，比如 <code>invoke({ concept: '回调' }, { callbacks: [handler] })</code>。</li>
      <li>执行过程中回调自动触发，在每个阶段记录下输入输出和耗时。</li>
      <li>出错时 <code>handleChainError</code> / <code>handleLLMError</code> 被触发，把错误和 runId 一起记下来。</li>
    </ol>
    <p>
      先把「起止事件」补上，因为你最缺的是「卡在哪一步」。<code>handleChainStart</code> 到 <code>handleLLMEnd</code> 把整条时间线画出来，你立刻就能看出慢在检索还是慢在模型。顺序不能反：没有起止，token 再多也拼不出时间线。
    </p>
    <p>
      起止补完，还差「过程」。<code>handleLLMNewToken</code> 会在模型每吐出一个 token 时触发——它既是你算「首 token 延迟」的依据，也是把 token 实时推给前端、做打字机效果的现成通道。这也是为什么流式输出和可观测性会共用同一个回调点。
    </p>
    <p>
      事件一多，还得有一根线把它们串起来。每个事件都带一个 <code>runId</code>，这是框架为每次执行分配的唯一标识；嵌套链里靠它认出父子关系，两组交错的日志才能各归各位。别自己造轮子：<code>ConsoleCallbackHandler</code> 是内置的调试处理器，挂上去就能打出详细执行过程；生产环境则接 LangSmith 或 LangFuse，把整条链路可视化。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须记住的边界：</strong>回调里<strong>不要执行耗时操作</strong>——它跑在调用链路上，同步 IO 或大计算会直接拖慢真实的 LLM 调用；同时，回调只<strong>挂钩</strong>执行过程、<strong>不改变</strong>链的行为，它该返回什么还返回什么。
    </div>

    <h2>时间戳事件流</h2>
    <figure class="lesson-figure">
      <figcaption>点「执行调用」，看一条链从 <code>handleChainStart</code> 开始，依次落下 <code>handleLLMStart</code>、一个个 <code>handleLLMNewToken</code>，最后 <code>handleLLMEnd</code>、<code>handleChainEnd</code>——时间线按真实触发顺序给出时间戳。</figcaption>
      <L11Callbacks />
    </figure>

    <h2>无侵入可观测性</h2>
    <p>
      回调把「LLM 应用的执行过程」从黑盒变成一条带时间戳的事件流。你不用改一行业务代码，就能拿到每个阶段的输入输出、耗时和 token 用量——它同时也是排查线上问题、统计成本与实现流式输出的同一套底座。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可观测性（Observability）」</span>指一个系统能仅凭它对外暴露的信号——日志、指标、链路追踪——被理解内部状态的程度。对应到 LLM 应用，就是「一次调用经过了哪些阶段、每步耗时多少、花了多少 token、错在哪一步」。边界：回调只挂钩、不改变链的行为，所以它属于「观测」而非「控制」；又因为回调跑在调用链路上，里面做耗时操作会直接拖慢真实的 LLM 调用。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
