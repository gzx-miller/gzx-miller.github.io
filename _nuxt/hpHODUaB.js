const n=`<script setup lang="ts">
import L13Streaming from './L13Streaming.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户提了个问题，模型其实两秒就吐出了第一个字，可界面上整整转了八秒白屏，然后「唰」地一下整段答案全冒出来——用户以为卡死了，直接关掉了页面。
    </div>

    <h2>整段返回等待</h2>
    <p>
      问题出在你用的是 <code>await chain.invoke(...)</code>：它要等模型<strong>把整段话生成完</strong>才返回。一个两百字的回答，用户得盯着一片空白等好几秒；首 token 其实早就出来了，只是被 invoke 攒在手里，一个都没交给你。
    </p>
    <p>
      更麻烦的是，当你改成长链路去看「到底哪一步慢」时，又会撞上第二堵墙。旧的排查方式——自己在各段之间打时间戳、逐条翻日志——有三笔成本：
    </p>
    <ol class="lesson-steps">
      <li><strong>慢在哪全靠猜</strong>：只看到总耗时，分不清是检索慢还是模型慢。</li>
      <li><strong>链路一长就失明</strong>：检索、生成、解析串在一起，中间步骤完全看不到。</li>
      <li><strong>想调试只能拆开手动跑</strong>：把整条链拆散一段段执行，跟真实运行已经不是一个东西了。</li>
    </ol>
    <p>
      要回答的是：<strong>一次调用到底该「一口气等结果」，还是「边生成边拿」？如果要边拿，怎么拿、又怎么知道手里这块是什么？</strong>
    </p>

    <h2>完整字符串返回</h2>
    <p>
      最朴素的方案：用 <code>invoke</code>。调用、等待、拿到一个完整的字符串。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给了「请求—响应」最直接的心智模型</strong>。一次调用换一个结果，代码最简单，短文本或不需要实时展示的场景毫无问题。
    </p>

    <h2>首字传输延迟</h2>
    <ul>
      <li>首 token 早就生成了，invoke 却压着不发，用户端只能看到白屏，主观上就是慢。</li>
      <li>想显示「生成中」的光标、想让用户中途打断，invoke 都不给这个时机。</li>
      <li>链路变成「检索 → 生成 → 解析」多步后，你分不清这次慢在检索还是慢在模型。</li>
      <li>要处理多个输入时，在循环里一次次 <code>await invoke</code>，全是串行，总耗时线性叠加。</li>
    </ul>

    <h2>过程颗粒度分层</h2>
    <p>
      不推翻 invoke，而是按「你需要多细的过程」一层层往上加。
    </p>
    <p>
      第一层，只关心最终文本、但想让它<strong>早点开始出现</strong>——用 <code>stream</code>。它返回一个异步迭代器，模型每吐出一块就 yield 一块，你 <code>for await</code> 逐块拿到，边收边渲染。首 token 一到就能上屏，主观延迟从「整段生成完」降到「第一个字出现」。这是最常用的一层：API 简洁、性能好，聊天界面基本都用它。
    </p>
    <p>
      第二层，链路变复杂后，光有 token 还不够，你要知道<strong>这块 token 是哪个环节吐的</strong>——用 <code>astream_events</code>。注意它的 <code>version</code> 必须指定为 <code>'v2'</code>，v1 已废弃。它返回的不是字符而是<strong>事件流</strong>：<code>on_chain_start</code>、<code>on_chat_model_start</code>、<code>on_chat_model_stream</code>、<code>on_chat_model_end</code>、<code>on_chain_end</code>……每个事件带 <code>name</code>、<code>run_id</code>、<code>tags</code> 等元数据。按 <code>run_id</code> 区分父子链路，就能定位到具体节点——这一层是给调试和监控用的，不是给最终用户看的。
    </p>
    <p>
      第三层，补两个常被忽略的执行方式。一是 <code>batch</code>——<code>invoke</code> 和 <code>stream</code> 都有对应的 <code>batch</code> / <code>abatch</code>，传入一组输入并用 <code>maxConcurrency</code> 控制并发，比循环 await 快得多。二是取消——把 <code>AbortController</code> 的 <code>signal</code> 传进调用，用户关页面时可以主动 abort，别为一个没人看的回答继续烧 token。
    </p>
    <div class="lesson-box hint">
      <strong>生产环境最常见的组合：</strong><code>stream</code> 拿 token + <code>handleLLMNewToken</code> 回调把 token 推给前端（回调与流式共用同一个触发点）。如果 token 来得比屏幕刷新还快，逐块更新 DOM 反而更卡，可以在回调里<strong>节流</strong>——攒够一小段再统一 flush 一次。
    </div>

    <h2>三种调用方式</h2>
    <figure class="lesson-figure">
      <figcaption>切换 invoke / stream / astream_events 三个页签各点一次「运行」：invoke 会先静默两秒再整段蹦出，stream 逐字浮现，astream_events 则会在右侧日志里打出带 <code>run_id</code> 的 start / llm_chunk / end 事件。</figcaption>
      <L13Streaming />
    </figure>

    <h2>调用颗粒度选择</h2>
    <p>
      invoke、stream、astream_events 不是三选一的竞品，而是同一件事的三个颗粒度：只要结果用 invoke，要实时上屏用 stream，要看清链路每一步用 astream_events。选哪一层，取决于你需要多细的过程。
    </p>
    <div class="lesson-term">
      <span class="term-name">「首 token 延迟（TTFT，Time To First Token）」</span>指从发出请求到收到第一个 token 所经过的时间，是流式场景下用户感知速度的核心指标。它的边界在于：它和总耗时是两回事——流式并不减少总生成时间，只是把首 token 更早交到你手里、缩短主观等待；因此选型时要分别看 TTFT 与总时延，别把「感觉快了」当成「真的更快了」。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
