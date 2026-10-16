const n=`<script setup lang="ts">
import LG13StreamingUi from './LG13StreamingUi.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>Agent 后端跑得挺流畅，前端却在「转圈」：用户点下发送，要等整个过程跑完——检索几秒、生成几秒——十几秒后答案整段蹦出来。用户盯着空白的对话区，以为程序死掉了，刷新键按了三次。
    </div>

    <h2>批式响应与实时感的落差</h2>
    <p>
      前面的课程都在解决「后端怎么把事做对」，这一课解决「结果怎么让用户看见」。<code>invoke</code> 是批式的：等整张图跑完才返回最终结果。但图的执行其实是<strong>一系列有条理的中间步骤</strong>——检索开始、检索完成、开始生成、逐 token 输出——这些中间步骤白白浪费了。
    </p>
    <p>
      要回答的是：<strong>怎么把图执行过程中的中间状态「实时吐出来」，让界面从「等结果」变成「看过程」？</strong>
    </p>

    <h2>两种流模式：进度与内容</h2>
    <p>
      把 <code>invoke</code> 换成 <code>stream</code>，并指定关心的模式，LangGraph 就能把执行过程一条条交出来：
    </p>
    <ol class="lesson-steps">
      <li><strong>messages 模式——逐 token 的“内容流”</strong>：模型每生成一段就产出一条 token 事件，附带 <code>langgraph_node</code> 元信息标明出自哪个节点。前端拿它做打字机效果，用户立刻看到「它在思考、在写」。</li>
      <li><strong>updates 模式——节点级的“进度流”</strong>：每个节点完成时产出「节点名 + 该节点的状态更新」。前端拿它做步骤条：「正在检索课程库 → 正在生成回答」。它也是调试时最好用的一双眼睛。</li>
      <li><strong>交付到浏览器——SSE</strong>：服务端把事件循环写成 SSE（<code>text/event-stream</code>），前端用 <code>EventSource</code> 或 fetch 流读取，一条条消费。协议很朴素：每个事件一行 <code>data:</code>，断线由浏览器自动重连。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>前端把事件映射成状态，而不是直接拼 DOM：</strong>推荐先定义 UI 状态（步骤条当前节点、气泡累计文本、是否生成中），再把事件<strong>翻译</strong>成状态变更——token 事件改变气泡文本，updates 事件改变步骤条。两种流交错到达时，状态机保证界面永远自洽。
    </div>
    <div class="lesson-box warn">
      <strong>三个必须处理的边界：</strong>停止生成（用 <code>AbortController</code> 中断读取，服务端也要终止图执行，否则 token 照样在烧）；断流降级（网络中断时把已收到文本保留，提示重试）；错误事件（图内节点抛错要以事件形式送达，UI 才能从「生成中」态退出，而不是永远转圈）。
    </div>

    <h2>事件流驱动界面演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「发送」：上方步骤条随 updates 事件从「检索课程库」走到「生成回答」，气泡里的文字随 messages 事件逐字浮现；生成中点「停止生成」，看流如何被中断——右侧事件流面板记录了两类事件的到达顺序。</figcaption>
      <LG13StreamingUi />
    </figure>

    <h2>把执行过程还给用户</h2>
    <p>
      流式界面解决的是「执行过程的可视化」：messages 流给内容、updates 流给进度，经 SSE 送到前端，由状态机翻译成打字机与步骤条。首字即反馈、过程即进度——用户等的每一秒都能看见意义。
    </p>
    <div class="lesson-term">
      <span class="term-name">「流式输出（Streaming）」</span>指用 <code>stream</code> 替代 <code>invoke</code>，按模式消费执行过程：<code>messages</code> 逐 token 输出内容（打字机），<code>updates</code> 逐节点输出状态更新（进度条），服务端经 SSE 推送、前端按状态机消费。要记住的边界：停止生成要同时中断前端读取与后端执行；断流时保留已收文本并支持重试；错误要以事件送达，别让 UI 停在「生成中」；token 事件可能早于/晚于节点事件到达，界面状态要写成可乱序的。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
