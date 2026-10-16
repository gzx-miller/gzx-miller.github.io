const n=`<script setup lang="ts">
import LG01QuickStart from './LG01QuickStart.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想做一个课程咨询机器人。第一版直接调模型，用户问「有没有入门课」它答得头头是道，可一问「《Vue3 组件通信》讲不讲插槽」，它就开始编——课程库里明明有这门课，模型却看不见。你把课程列表塞进提示词，课程一更新答案就过时；想让它自己查，又不知道从哪下手。
    </div>

    <h2>一问一答的边界</h2>
    <p>
      最朴素的做法是一次 <code>invoke</code> 打天下：把用户问题和系统提示交给模型，拿回回答。这方案做对了一件事——<strong>LLM 调用本身是简单的</strong>。但它的天花板很低：模型只会「基于已有信息作答」，它<strong>看不到你的课程库、也查不了实时数据</strong>，缺什么就只能编。
    </p>
    <p>
      更麻烦的是需求会逼着你加码：用户追问「那第二门课适合我吗」——你得先检索、再结合对话历史回答。这条「先查、再答」的路径不是一次调用，而是<strong>一串有依赖的步骤</strong>。
    </p>

    <h2>手写调度器的成本</h2>
    <p>
      自然的补救是写代码当调度员：<code>if</code> 问题里有「课程」就调检索函数，把结果拼进提示词再问模型；不满意就再拼一轮。这套写法把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>规则死板</strong>：什么时机查、查几次全靠 if 判断，新增数据源就要改调度代码。</li>
      <li><strong>循环复杂</strong>：多轮「查了接着查」用 while 写，终止条件稍错就死循环。</li>
      <li><strong>消息难管</strong>：工具结果怎么拼回对话、保留几轮，手工拼接极易丢上下文。</li>
    </ol>
    <p>
      要回答的是：<strong>怎样让模型自己在「思考、调用工具、读结果」之间循环，直到信息足够再回答，而不是由外部代码硬编码调度？</strong>
    </p>

    <h2>ReAct 循环与工具绑定</h2>
    <p>
      不推翻「调用 LLM」，而是给它补上一条通往外部世界的路：<strong>把函数包装成工具（Tool）注册给模型</strong>。每个工具声明名字、描述和参数 Schema；模型推理时如果判断需要数据，就产出一条带 <code>tool_calls</code> 的消息——这不是自然语言请求，而是结构化的「请帮我调用 search_courses，参数 keyword=Vue3」。
    </p>
    <p>
      框架接到 <code>tool_calls</code> 后执行对应函数，把结果包装成 <code>ToolMessage</code> 追加回消息列表，再让模型读着新消息继续推理。这一圈「思考（Thought）→ 行动（Action）→ 观察（Observation）」就是 <strong>ReAct 模式</strong>；信息足够时模型不再请求工具，直接产出最终回答，循环自然结束。
    </p>
    <p>
      把这件事再往前推一步：<strong>这个循环本身可以建模成一张图</strong>——模型节点和工具节点之间有两条边，一条通向工具、一条通向结束。LangGraph 的 <code>createReactAgent</code> 就是这张图的一个预置实现：传给它模型、工具和提示词，返回的已经是一个会自己查、自己答的智能体。
    </p>

    <h2>智能体循环运行轨迹</h2>
    <figure class="lesson-figure">
      <figcaption>输入问题或点快捷问题，观察轨迹里「思考 → 行动 → 观察 → 回答」的循环；再试试问「你好呀」——不涉及课程数据时，它会跳过工具直接作答。注意底部消息序列的追加过程。</figcaption>
      <LG01QuickStart />
    </figure>

    <h2>循环封装为预置图</h2>
    <p>
      智能体不是魔法，是把「模型 + 工具 + 循环」组装成一张可运行的状态图：模型在循环里决定调不调工具，工具结果以消息形式回灌，直到模型给出最终回答。读懂这张图，后面所有课程都是在改这张图——加分支、加记忆、加审批。
    </p>
    <div class="lesson-term">
      <span class="term-name">「ReAct Agent」</span>指把 LLM 放进「思考 → 行动 → 观察」循环的智能体：模型自行判断是否需要调用工具，工具结果以消息形式追加回对话，直到信息足够产出最终回答。<code>createReactAgent</code> 是这个循环的预置实现，传入 <code>llm</code>、<code>tools</code> 和 <code>prompt</code> 即得。要记住的边界：工具的描述与参数 Schema 决定调用准确率；每轮循环都消耗 token，迭代上限要结合预算设置。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
