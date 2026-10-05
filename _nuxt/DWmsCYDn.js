const n=`<script setup lang="ts">
import L12QABot from './L12QABot.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户第一句问「Vue3 用什么做状态管理」，你答「Pinia」。第二句他只问「它跟 Vuex 比呢？」——检索系统拿着「它跟 Vuex 比」这几个字去查知识库，检回来的全是噪声，回答当场飘掉。
    </div>

    <h2>问答三个环节</h2>
    <p>
      你要做一个能答技术问题的机器人：答案必须来自你自己维护的知识库（不能让模型瞎编），还要能一轮接一轮地聊下去。拆开看，这里其实压着三件不同的事——知识从哪来（检索）、这一步要不要查、查完怎么用（推理）、上一轮说了什么（记忆）。
    </p>
    <p>
      每件事单独看都有现成组件，难点在于<strong>它们怎么串起来</strong>。如果各自独立地硬接，会有三笔成本落回你身上：
    </p>
    <ol class="lesson-steps">
      <li><strong>知识一更新就得改提示词</strong>：把文档贴进提示词，库一变，提示词就得跟着改，二者越缠越死。</li>
      <li><strong>历史得每轮手工拼</strong>：想让机器人接住上文，就得自己在调用前把过往对话拼进去，格式全靠手维护。</li>
      <li><strong>流程写死、拦不住浪费</strong>：不管问题要不要查都硬检索一遍，寒暄也去翻库，白花延迟和成本。</li>
    </ol>
    <p>
      要回答的是：<strong>能不能让机器人自己判断「这步要不要去查知识库」，同时自动接住多轮对话里的指代？</strong>
    </p>

    <h2>固定两步链路</h2>
    <p>
      最朴素的做法：把几段知识贴进提示词，再写一条固定的两步链——收到问题先把 <code>top-k</code> 文档检索出来，再把问题和检索结果一起交给模型生成。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「有依据地回答」变成了一条固定流水线</strong>。检索负责找证据，生成负责组织语言；对单轮提问、问题明确、知识边界稳定的场景，这条链已经能跑起来。
    </p>

    <h2>四类追问处理缺口</h2>
    <ul>
      <li>「它跟 Vuex 比呢」这类带代词的追问，原样丢给检索器会检出一堆无关文档——检索需要的是「Pinia 对比 Vuex」，拿到的却是「它」。</li>
      <li>「你好」「谢谢」这种寒暄也被强制检索一遍，白白多出一次查询延迟和成本。</li>
      <li>复杂问题常常要查好几次、甚至先看 A 的结果再决定查不查 B，固定两步链的流程被写死，做不到这种来回。</li>
      <li>多轮对话里模型看不到历史，「那第二个呢」这种省略式追问直接接不住。</li>
    </ul>

    <h2>流水线代理化</h2>
    <p>
      不推翻「检索 + 生成」，而是把这条固定流水线升级成一个<strong>能自己决定动作的执行者</strong>，再给整条环路补上记忆。
    </p>
    <p>
      第一步补<strong>记忆</strong>，因为它是后面所有环节的前提。用 <code>RunnableWithMessageHistory</code> 按 <code>sessionId</code> 注入历史消息，底层用 <code>ChatMessageHistory</code> 存每一轮问答。先补它，是因为代词的指代对象就藏在历史里——没有历史，连「它」是谁都无从谈起。
    </p>
    <p>
      第二步把<strong>检索包装成工具</strong>，把决定权交给 Agent。Retriever 不再被无条件调用，而是封装成一个带名字和描述的工具（如 <code>knowledge_base_search</code>），交给 <code>createToolCallingAgent</code>。Agent 先推理「这个问题要不要查、该查什么」，再决定是否调用工具、调几次。这样寒暄就不查库，复杂问题能来回查多轮。
    </p>
    <p>
      第三步补<strong>带记忆的 Agent</strong>：用 <code>AgentExecutor</code> 执行，外面再套一层 <code>RunnableWithMessageHistory</code>，把历史注入到 <code>chat_history</code> 占位符，<code>agent_scratchpad</code> 则留给 Agent 记录自己的思考与工具调用轨迹。至此，整条环路按下面的顺序转起来：
    </p>
    <ol class="lesson-steps">
      <li>从 Memory 中取出该会话的历史，让 Agent 知道用户之前问过什么、代词指向谁。</li>
      <li>Agent 判断是否需要检索；需要就通过 Retriever 从 VectorStore 查回相关文档片段。</li>
      <li>Agent 结合检索结果与历史上下文，推理生成最终答案。</li>
      <li>把本轮问答写回 Memory，供下一轮继续引用。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>上线前必须认清的两个瓶颈：</strong>检索质量是 RAG 成败的关键——文档切分和检索策略（k 的大小、重排、混合检索）对最终答案的影响，往往比换模型更大；多轮对话里检索查询要结合历史做改写（指代消解），否则代词会让检索跑偏。此外，Agent 本身不是 100% 可靠，生产环境要准备降级：Agent 失败时回退到简单的链式问答，别让整条路一起挂。
    </div>

    <h2>四个执行阶段</h2>
    <figure class="lesson-figure">
      <figcaption>输入问题点「提问」，看它依次走过 Memory 检索、Retriever 检索、Agent 推理、生成回答四个阶段，最后给出答案——逐阶段点亮的过程，正是「先取记忆、再检索、再推理」的顺序。</figcaption>
      <L12QABot />
    </figure>

    <h2>三项能力协同</h2>
    <p>
      一个真实的问答机器人不是某一个组件，而是三件事的拼装：记忆负责「接住上文」，检索负责「给出依据」，Agent 负责「决定要不要查、怎么用」。把它们串成一条带反馈的环路——取记忆、检索、推理、写回——才算把 RAG 从 demo 做成应用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「检索增强生成（RAG）」</span>指在生成之前先从外部知识库检索出相关文档，把它们作为上下文一并交给模型，用来缓解模型知识过时和幻觉。边界：检索质量是它的天花板，文档切分与检索策略往往比模型选择更关键；对带代词的追问，检索查询需先结合历史改写，否则会检偏；检索到的内容也不保证被正确使用，模型仍可能忽略证据自行编造。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
