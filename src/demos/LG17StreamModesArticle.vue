<script setup lang="ts">
import LG17StreamModes from './LG17StreamModes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程助手回答一段 600 字的内容要八秒，前端只能盯着转圈。你想先把「正在检索」「正在生成」推给页面，再把回答一个字一个字吐出来。可 <code>invoke</code> 只会在全部结束后返回一个完整结果——执行过程中的信息，根本没有出口。
    </div>

    <h2>invoke 与 stream 的分工</h2>
    <p>
      <code>invoke</code> 是「等图跑完，拿最终状态」，适合后台任务、批处理和不关心中间过程的调用。<code>stream</code> 是「每推进一步就交出一个事件」，适合任何需要即时反馈的场景。两者执行的是同一张图、同一份状态，区别只在<strong>结果交付的节奏</strong>。
    </p>
    <p>
      要强调的是：流式不是把最终结果切成几段发出去。<code>stream</code> 交出的是<strong>执行过程本身</strong>——哪个节点跑完了、状态更新了哪些字段、模型吐出了哪段 token。前端能做什么，取决于服务端选择暴露哪一种粒度。
    </p>

    <h2>四种 streamMode 的语义</h2>
    <ul>
      <li><strong>values</strong>：每个超步结束后给一份完整状态。字段最全，传输量最大。适合调试面板与「最终结果预览」，不适合高频推给前端。</li>
      <li><strong>updates</strong>：每个节点执行完只给该节点写入的增量，形如 <code>{ 'review': { passed: true } }</code>。这是步骤条、节点状态灯最合用的粒度。</li>
      <li><strong>messages</strong>：模型每产出一段内容就推一个消息块，附带 <code>langgraph_node</code> 等元数据。它回答的是「哪个节点正在说什么」，用于 token 级输出。</li>
      <li><strong>custom</strong>：节点通过 writer 主动写入任意结构的事件。进度百分比、引用来源、业务告警都可以，格式完全由你定义。</li>
    </ul>
    <p>
      四种模式不是互斥的开关，而是四种观察角度。同一张图可以先用 <code>updates</code> 推进度，再用 <code>messages</code> 填内容；也可以在需要时把多个模式放进数组同时订阅，每个事件以 <code>[mode, chunk]</code> 的形式到达。
    </p>

    <h2>异步迭代是消费入口</h2>
    <p>
      <code>stream</code> 返回的是异步可迭代对象，用 <code>for await...of</code> 逐条消费。这意味着事件是<strong>边产生边到达</strong>的，不必等全部结束；也意味着消费端要负责节奏——处理太慢会产生背压，提前退出要显式中断，否则服务端可能继续算完。
    </p>
    <p>
      一个常见误区是把 <code>stream</code> 的结果先 <code>await</code> 成数组再遍历。<code>await app.stream(...)</code> 拿到的是迭代器本身，不是所有事件的集合；真正的等待发生在每次迭代。写成数组会丢掉流式的意义，还可能让连接一直挂到结束。
    </p>

    <h2>messages 模式与 token 级输出</h2>
    <p>
      要让 <code>messages</code> 模式真正逐 token 到达，模型调用本身必须开启流式（例如构造模型时设置 <code>streaming: true</code>），并且节点要把模型返回的消息写回状态。框架才能在模型产出内容块时转发事件。每个事件除了内容块，还有元数据：<code>langgraph_node</code> 告诉你这段 token 出自哪个节点，便于前端把文字放进正确的气泡。
    </p>
    <p>
      反过来，如果节点用的是一次性 <code>invoke</code> 拿完整回复，<code>messages</code> 模式仍然会工作，但只会在模型调用结束时给你一整块——看起来和普通消息没有区别。流式的粒度由最内层的模型调用决定，不是由 streamMode 单独决定的。
    </p>

    <p>
      <strong>custom 模式由节点主动写入。</strong><code>values</code>、<code>updates</code>、<code>messages</code> 都描述框架已知的结构，<code>custom</code> 则留给业务自己。节点通过运行时配置里的 writer 写事件，例如 <code>config.writer?.({ type: 'progress', percent: 60 })</code>。这些事件不会进入图状态，也不会被检查点保存，它们只是一次性的旁路通知。
    </p>
    <p>
      正因为不进状态，custom 事件要遵守两条约束：<strong>结构稳定</strong>（前端按 <code>type</code> 分发，字段缺失会导致渲染失败）、<strong>不承载关键业务数据</strong>（断流重连后无法从检查点补发）。需要可恢复的信息，仍然要写进状态。
    </p>

    <h2>把流交给前端：只谈边界</h2>
    <p>
      浏览器无法直接消费服务端的异步迭代器。中间必须有一层传输协议，最常见的是 SSE：服务端把每条事件序列化为 <code>event:</code> 与 <code>data:</code> 行，保持连接不关闭，按到达顺序写出；前端按事件类型分发。服务端要处理的是<strong>序列化、事件命名、断连清理与心跳</strong>，前端要处理的是<strong>追加、去重与中断</strong>。
    </p>
    <p>
      这条边界上最容易出错的是「把内部结构直接透传」。<code>values</code> 的完整状态可能包含不该给前端的字段，<code>messages</code> 的消息块也不是纯文本。服务端应当在边界处做一次投影：只发 UI 需要的字段，并给每类事件一个稳定的名字。前端实现不在本章展开。
    </p>

    <h2>四种模式对照演示</h2>
    <figure class="lesson-figure">
      <figcaption>切换四个页签，同一段「大纲 → 正文 → 摘要」的执行会呈现完全不同的输出行：values 给全量快照，updates 给节点增量，messages 给 token 块，custom 给业务事件。点「重放输出」观察事件逐条到达的顺序。</figcaption>
      <LG17StreamModes />
    </figure>

    <p>
      <strong>流式是一种交付契约。</strong>服务端流式输出的核心不是「用 stream 替换 invoke」，而是选择一套事件契约：哪些粒度给前端、每类事件叫什么、断流后如何恢复。streamMode 提供了四种现成的观察角度，custom 补上业务事件；SSE 只是把这些事件送到浏览器的通道。契约设计清楚，前端才能稳定地把事件映射成界面状态。
    </p>
    <div class="lesson-box warn">
      <strong>四个注意点：</strong>模型未开启流式时，messages 模式拿不到真正的 token 粒度；同时订阅多种模式会增加序列化与传输开销，按需选择；custom 事件不进检查点，不能作为恢复依据；断连后要停止服务端迭代或标记取消，避免用户已经离开、后台还在消耗 token。
    </div>
    <div class="lesson-term">
      <span class="term-name">「streamMode」</span>决定 <code>stream</code> 交出什么粒度的事件：<strong>values</strong> 是完整状态、<strong>updates</strong> 是节点增量、<strong>messages</strong> 是 token 块、<strong>custom</strong> 是节点主动写入的业务事件。用 <code>for await...of</code> 逐条消费，可按数组组合多种模式。要记住的边界：token 粒度取决于模型是否流式；custom 不进状态与检查点；交给前端前要在服务端做字段投影，并通过 SSE 之类的通道传输。
    </div>
  </LessonArticle>
</template>
