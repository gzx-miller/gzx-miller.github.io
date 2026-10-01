<script setup lang="ts">
import L15StructuredOutput from './L15StructuredOutput.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要从用户的一段话里抽出「课程名、讲师、时长、标签」填进表单，让模型返回 JSON。它回了一段「好的，以下是提取结果」，外面还裹着 Markdown 代码块，末尾加了句「希望对你有所帮助」——你的 <code>JSON.parse</code> 当场崩掉。
    </div>

    <h2>模型输出可控性</h2>
    <p>
      你希望模型的输出能被程序直接消费：一个对象，字段固定、类型明确。可模型只会「说话」——它会加寒暄、加 Markdown 代码块、把数字写成「45 分钟」这样的字符串。
    </p>
    <p>
      旧办法是在提示词里写上「请只返回 JSON」，收到后手动 <code>JSON.parse</code>。它把三笔成本留给了你：
    </p>
    <ol class="lesson-steps">
      <li><strong>全靠模型自觉</strong>：格式随时可能变，今天听话明天加一句话，解析就崩。</li>
      <li><strong>失败只能整个重试</strong>：解析一挂就得重发一次请求，白烧一次调用。</li>
      <li><strong>字段类型没人把关</strong>：就算侥幸解析成功，时长是 number 还是 string，得等到下游用的时候才炸。</li>
    </ol>
    <p>
      要回答的是：<strong>怎么才能让模型不是「尽量」返回结构化数据，而是保证返回的对象符合你定义的结构？</strong>
    </p>

    <h2>语法合法基本保证</h2>
    <p>
      最朴素的做法：打开 <strong>JSON Mode</strong>——在请求里把 <code>response_format</code> 设为 <code>json_object</code>，在提示词里把字段结构写清楚，收到后 <code>JSON.parse</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它用模型层的能力兜住了「合法 JSON」这条底线</strong>。输出至少是能解析的 JSON，不再夹带 Markdown 代码块和寒暄。
    </p>

    <h2>字段正确性的盲区</h2>
    <ul>
      <li>JSON Mode 只保证「是合法 JSON」，不保证「字段对不对」：它完全可能把时长写成字符串「45 分钟」，或干脆漏掉讲师字段。</li>
      <li>字段结构全靠提示词里的文字约束，字段一多、层级一深，模型就开始漏字段、改字段名。</li>
      <li>解析成功不等于数据可用——类型错了要等下游才炸，报错点离现场很远。</li>
      <li>每次拿到结果都得手写一层运行时校验，重复且容易漏。</li>
    </ul>

    <h2>机器可读的结构声明</h2>
    <p>
      不推翻「用 JSON 传结构」，而是把「结构」从提示词里的自然语言，升级成机器可读的 schema——用 <strong>Zod</strong> 定义。
    </p>
    <p>
      第一步用 <strong>Zod 定义输出结构</strong>，给每个字段加上 <code>describe</code> 说明语义。这里的关键是：<code>describe</code> 的文字会进入模型可见的 schema 描述，字段含义写清楚能显著降低填错率；同时这份 schema 还顺带给出 TypeScript 类型推导——一个定义，运行时校验和编译期类型两用。
    </p>
    <p>
      第二步，既然 schema 已经是机器可读的，就该把它<strong>直接交给模型</strong>，而不是翻译成提示词文字——用 <code>withStructuredOutput(schema)</code>。它底层走<strong>函数调用</strong>：把 schema 当作「工具的参数定义」发给模型，模型按参数结构生成对象，框架再按 schema 校验。因为格式约束来自模型侧的参数协议，而不是一句自然语言的请求，可靠性明显更高。</p>
    <p>
      第三步，<strong>选型</strong>：字段越多、层级越深（嵌套对象、数组、枚举），函数调用的可靠性优势越明显；只有在模型不支持函数调用时，才回退到 JSON Mode，并在提示词里明确字段结构和「只输出 JSON」的约束。
    </p>
    <ol class="lesson-steps">
      <li>用 Zod 定义输出结构，给每个字段加 <code>describe</code> 说明语义。</li>
      <li>调用 <code>withStructuredOutput(schema)</code>，或在请求中开启 JSON Mode。</li>
      <li>invoke 后直接拿到类型安全的对象（函数调用），或手动 <code>JSON.parse</code> 再校验（JSON Mode）。</li>
      <li>解析失败时捕获错误并重试或降级，Zod 的校验结果就是补救依据。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>别把「能解析」当成「数据正确」：</strong>JSON Mode 与函数调用不是等价的替代品——前者只保证「是 JSON」，字段结构仍由提示词约束；后者由 schema 驱动，格式可靠性更高。结构化输出也不是 100% 成功，模型偶尔仍会填错类型或漏字段，所以第四步的失败处理不能省。
    </div>

    <h2>两种模式解析对照</h2>
    <figure class="lesson-figure">
      <figcaption>点「JSON Mode」与「Function Calling」，看同一段原始文本在两种模式下解析出的结果；再点「模拟校验失败」，看 Zod 在时长不是 number、标签不是字符串数组时，怎么把问题精确定位出来。</figcaption>
      <L15StructuredOutput />
    </figure>

    <h2>可解析与正确的差距</h2>
    <p>
      结构化输出解决的是「让模型吐出程序能直接吃的数据」。要点是把结构从提示词里的文字描述，升级成机器可读的 schema：用 Zod 定义一次，既做运行时校验又做类型推导；优先走 <code>withStructuredOutput</code> 的函数调用路径，必要时才回退 JSON Mode，并为解析失败留好重试的路。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数调用（Function Calling / Tool Calling）」</span>指让模型按预先声明的函数名与参数 schema，直接生成结构化参数对象的能力，本质上把「输出自由文本」变成了「按协议填参数」。边界：它只保证参数的结构与类型符合 schema，不保证内容正确、也不保证业务语义合理；并且并非所有模型都支持，不支持时只能回退到 JSON Mode，由提示词去约束字段。
    </div>
  </LessonArticle>
</template>
