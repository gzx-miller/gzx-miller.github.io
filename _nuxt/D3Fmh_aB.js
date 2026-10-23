const n=`<script setup lang="ts">
import LG05Memory from './LG05Memory.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>学习助手上线第一周好评不断，第二周被差评淹没——「昨天刚说我基础差要讲慢点，今天又问我要不要从入门讲起」。你打开代码一看：每次请求都是独立的一问一答，用户昨天说过什么，今天的助手根本不知道。
    </div>

    <h2>无记忆对话的体验断裂</h2>
    <p>
      没有记忆的 LLM 应用像一位「十分钟失忆」的顾问：每轮对话都从零开始，用户被迫反复交代背景，代词「它」「那门课」全部悬空。要让对话连贯，模型在生成前必须重新「看见」之前发生过什么——<strong>记忆的本质，是把历史上下文找回来、送进这一次的模型调用</strong>。
    </p>
    <p>
      但粗暴地「什么都记住」会付出代价：对话越长上下文越贵，token 预算撑不住；而把记忆一股脑塞进上下文，还会让关键信息被淹没。所以记忆要分两层来设计。
    </p>

    <h2>两种记忆各管一段</h2>
    <p>
      LangGraph 把记忆拆成职责清晰的两层，用两个机制分别承载。
    </p>
    <ol class="lesson-steps">
      <li><strong>短期记忆 = checkpointer + thread_id</strong>：编译图时挂上 checkpointer，每次 invoke 传入同一个 <code>thread_id</code>，框架自动把该线程的历史消息注入本轮状态。<strong>会话内的连贯性靠它</strong>——同一个 thread 的每一轮都能读到之前的消息；换了 thread，短期记忆就清零。</li>
      <li><strong>长期记忆 = Store + namespace</strong>：<code>store.put(['profiles', id], {...})</code> 把用户画像、偏好这类跨会话的信息存进命名空间；下次任何线程启动时用 <code>store.get / search</code> 读回来。<strong>跨会话的身份与偏好靠它</strong>——不清除就一直在。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>写入时机是设计问题：</strong>短期记忆由框架自动累积；长期记忆需要明确的写入决策——可以是节点里的一句规则（「检测到用户自述就更新档案」），也可以交给模型用工具自主决定。写入越克制，召回越精准：把每句闲聊都存进去，档案只会稀释成噪音。
    </div>

    <h2>短期与长期记忆演示</h2>
    <figure class="lesson-figure">
      <figcaption>在会话 1 里说「我叫小明，正在学 LangGraph」，切到会话 2 再问「还记得我是谁吗」——聊天记录是空的，但右侧 Store 档案还在，助手照样认得你；回到会话 1 追问，则能看到回答切到了「本线程历史」来源。对比两种气泡的标注。</figcaption>
      <LG05Memory />
    </figure>

    <h2>目录分层：线程内连贯、跨会话认人</h2>
    <p>
      记忆解决的是「对话如何连贯」：短期记忆由 checkpointer 按 <code>thread_id</code> 自动累积，管会话内的上下文；长期记忆由 Store 按命名空间持久化，管跨会话的画像与偏好。两层各管一段，互不越界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「短期记忆与长期记忆」</span>是 LangGraph 记忆体系的两个机制：短期记忆用 checkpointer 按 <code>thread_id</code> 保存线程内消息历史（换 thread 即清零），长期记忆用 Store 按 namespace 保存跨会话数据（可 get / search / put）。要记住的边界：短期记忆的 token 成本随对话轮数增长，长会话要配合截断或摘要；长期记忆写入要有策略（规则或工具），否则噪音稀释召回；生产环境两者都应换成持久化后端，内存实现重启即丢。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
