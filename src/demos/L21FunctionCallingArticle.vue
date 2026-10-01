<script setup lang="ts">
import L21FunctionCalling from './L21FunctionCalling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给模型绑好了一个查天气的工具，满心以为它会自己去调接口，结果日志里模型只吐出一段 JSON：<code>{ "name": "getWeather", "args": { "city": "北京" } }</code>——它根本没请求任何接口，只是把「我想调这个函数」写成了一张申请单。
    </div>

    <h2>模型知识的边界</h2>
    <p>
      LLM 像一颗读过很多书、却从不迈出家门的脑子：它的知识有截止日期，碰不到你公司的数据库，也没法替你下单、发邮件、改工单。你问它「北京现在几度」，它只能报出记忆里某个旧数字，或者干脆说不知道。
    </p>
    <p>
      旧办法是把实时数据硬拼进提示词：先自己查好天气，再写成一句话喂给模型。这样做的代价全部压在人身上：
    </p>
    <ul>
      <li>你得提前猜这次对话会用到哪些数据，猜错了模型照样答不上。</li>
      <li>数据源每加一个，提示词的拼装逻辑就改一次，越长越难维护。</li>
      <li>模型永远只能「读」，不能「做」——下单、发信这类动作它碰不到。</li>
    </ul>
    <p>
      要回答的是：<strong>能不能别让人预判，而是让模型自己决定「这一步我需要哪个函数、要传什么参数」，再由我们的代码去执行？</strong>
    </p>

    <h2>函数清单交付</h2>
    <p>
      最直接的做法：把可用的函数当成一份「菜单」交给模型——每个函数写明<strong>名字、用途描述、参数结构</strong>；模型在需要时不再吐自然语言，而是返回一段结构化的<strong>调用申请</strong>（工具名 + 参数）。在 LangChain 里用 <code>tool()</code> 配合 Zod schema 定义，再用 <code>model.bindTools(tools)</code> 把菜单注册给模型。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「什么时候需要外部数据、需要哪些参数」的判断权交还给了模型</strong>。你不用再预判用户会问什么，模型读到问题后自己举手：「我要查北京天气，单位用摄氏度。」
    </p>

    <h2>调用申请的空转</h2>
    <ul>
      <li>模型发出的只是一张申请，没人执行。如果你的代码不读 <code>tool_calls</code>、不运行函数、不回传结果，模型会一直停在「好的，我来帮你查一下」，永远给不出答案。</li>
      <li>参数可能是错的：模型可能把城市写成「北京市」而不是「北京」，可能漏传单位，也可能编造一个 schema 里根本没有的字段，把脏参数直接送进你的函数。</li>
      <li>一次可能申请多个：模型在一轮里返回两条 <code>tool_calls</code>（比如同时查天气和距离）。如果这两条恰好是「下单」「扣款」这类有副作用的操作，重复执行就会造成真实损失。</li>
      <li>结果回喂时对不上号：你把工具结果当普通回复塞回对话，模型分不清哪条结果对应哪次申请，一轮多调用时尤其混乱。</li>
      <li>有些函数不该被随便调：退款、删除账户这类高危操作，交给模型的自由裁量权太大了。</li>
    </ul>

    <h2>执行闭环补齐</h2>
    <p>
      不推翻「让模型举手申请」，而是补上它缺的那半边——一个由宿主代码负责的<strong>执行闭环</strong>。缺了这一环，函数调用只是一张没人受理的申请单。
    </p>
    <ol class="lesson-steps">
      <li><strong>定义</strong>：用 <code>tool()</code> 写清函数的名字、描述与 Zod 参数 schema。</li>
      <li><strong>注册</strong>：用 <code>bindTools()</code> 把工具菜单连同模型一起送进对话。</li>
      <li><strong>申请</strong>：模型判断需要工具时，返回带 <code>name</code> 与 <code>args</code> 的 <code>tool_calls</code>。</li>
      <li><strong>执行并回传</strong>：宿主按名字找到工具、运行、用带 <code>tool_call_id</code> 的 <code>ToolMessage</code> 把结果送回对话。</li>
    </ol>
    <p>
      第 4 步之后，让模型再读一遍带结果的对话。如果它不再返回 <code>tool_calls</code>，说明它能答了；如果还在申请，就重复「申请—执行—回传」。这个循环就是<strong>多轮工具调用</strong>，也是 Agent 编排的雏形。循环必须设一个上限（如 <code>maxIterations</code>），否则模型可能来回打转。
    </p>
    <p>
      接着补<strong>参数校验</strong>。Zod schema 不只是给模型看的说明书，它还是运行时的守门人：参数先过 <code>schema.parse()</code>，类型不对、字段缺失、枚举越界都会在执行前被拦下，脏参数进不了真正的函数。
    </p>
    <p>
      再往下是<strong>并行与幂等</strong>。一轮里的多条 <code>tool_calls</code> 应并发执行，每条结果都要配上自己的 <code>tool_call_id</code> 回传，模型才能一一对上。<strong>但只要有副作用，就必须幂等</strong>——查询可以重跑，下单、扣款不行；网络失败重试时，第二次必须能识别出「这一单已经下过」。
    </p>
    <p>
      最后一层是<strong>调用控制</strong>。用 <code>tool_choice</code> 决定这一轮「允不允许调、必须调、还是只能调某个」：<code>auto</code> 让模型自己判断，<code>none</code> 禁用调用（只许它用已有上下文作答），<code>required</code> 强制至少调一个，也可以直接指定某个工具名。把「能不能调」从模型的自由裁量变成可配置的策略，高危工具就能被排除在候选之外。
    </p>
    <div class="lesson-box warn">
      <strong>别把「模型说调用了」当成「已经调用了」：</strong>模型只负责产出调用申请，真正的执行、校验、幂等与重试全在你的代码里。工具的描述写得越含糊，模型选错工具或填错参数的概率越高。
    </div>

    <h2>工具调用全流程</h2>
    <figure class="lesson-figure">
      <figcaption>在对话里输入「北京今天天气怎么样」，看模型先回一句「我来查询」，再依次吐出工具调用的参数、工具返回结果，最后基于结果给出最终回答；也可以切到「工具列表」关掉某个工具，观察模型改口。</figcaption>
      <L21FunctionCalling />
    </figure>

    <h2>申请与执行分离</h2>
    <p>
      函数调用不是「模型去调用函数」，而是模型产出一张结构化的调用申请，由你的代码执行、校验、回传，再让模型接着往下答。补上执行闭环、参数校验、并行幂等与 <code>tool_choice</code> 控制，模型才从「知道」变成「能动手」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数调用（Function Calling）」</span>指模型返回结构化的 <code>tool_calls</code>（工具名 + 参数）作为调用申请，<strong>自身并不执行任何函数</strong>；执行、校验与结果回传由宿主代码完成，结果用带 <code>tool_call_id</code> 的 <code>ToolMessage</code> 送回对话。边界：必须实现执行闭环与循环上限；参数要用 schema 做运行时校验；并行调用只要有副作用就必须幂等；用 <code>tool_choice</code> 控制可调用的工具范围。
    </div>
  </LessonArticle>
</template>
