import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

const L01LLMCall = createDemo('L01LLMCall')
const L02PromptTemplate = createDemo('L02PromptTemplate')
const L03OutputParser = createDemo('L03OutputParser')
const L04LCEL = createDemo('L04LCEL')
const L05Chains = createDemo('L05Chains')
const L06DocSplitter = createDemo('L06DocSplitter')
const L07VectorRetrieval = createDemo('L07VectorRetrieval')
const L08Agent = createDemo('L08Agent')
const L09Tools = createDemo('L09Tools')
const L10Memory = createDemo('L10Memory')
const L11Callbacks = createDemo('L11Callbacks')
const L12QABot = createDemo('L12QABot')
const L13Streaming = createDemo('L13Streaming')
const L14Evaluation = createDemo('L14Evaluation')
const L15StructuredOutput = createDemo('L15StructuredOutput')
const L16LangGraph = createDemo('L16LangGraph')
const L17VectorStore = createDemo('L17VectorStore')
const L18Deploy = createDemo('L18Deploy')
const L19RagPipeline = createDemo('L19RagPipeline')
const L20MultiModal = createDemo('L20MultiModal')
const L21FunctionCalling = createDemo('L21FunctionCalling')
const L22PromptEngineering = createDemo('L22PromptEngineering')
const L23Guardrails = createDemo('L23Guardrails')

export const lessons: Lesson[] = [
{
    id: 'L_1',
    title: 'LLM 调用：ChatOpenAI、invoke、streaming',
    navTitle: '入门调用',
    category: '基础入门',
    path: '/langchain/l-1/llm-call',
    summary: '用智能问答模拟器展示 ChatOpenAI 的基本调用、模型配置和流式输出。',
    demo: L01LLMCall,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// 示例1: 基础调用 - 创建 ChatOpenAI 实例并调用 invoke
const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
})

const response = await model.invoke([
  new SystemMessage('你是一个 helpful 的 AI 助手。'),
  new HumanMessage('什么是 LangChain?'),
])
console.log(response.content)

// 示例2: 配置不同温度参数
const creativeModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 1.0, // 高温度，输出更随机
})

const preciseModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0, // 低温度，输出更确定
})

// 示例3: 流式输出 stream
const streamModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.5,
})

const stream = await streamModel.stream([
  new HumanMessage('写一首关于编程的短诗'),
])

let fullText = ''
for await (const chunk of stream) {
  fullText += chunk.content
  console.log('收到 token:', chunk.content)
}

// 示例4: 批量调用 batch
const batchModel = new ChatOpenAI({ model: 'gpt-4o-mini' })
const batchResponses = await batchModel.batch([
  [new HumanMessage('1+1等于几?')],
  [new HumanMessage('2+2等于几?')],
  [new HumanMessage('3+3等于几?')],
])
batchResponses.forEach((res, i) => {
  console.log(\`问题\${i + 1}: \${res.content}\`)
})

// 示例5: 使用字符串消息（简化写法）
const simpleModel = new ChatOpenAI({ model: 'gpt-4o-mini' })
const simpleResponse = await simpleModel.invoke('你好，请用一句话介绍自己')
console.log(simpleResponse.content)`),
    language: 'typescript',
    principle:
      'ChatOpenAI 是 LangChain.js 中最常用的聊天模型封装。通过构造函数传入模型名称和参数（temperature、maxTokens 等），调用 invoke 获取完整回复，调用 stream 获取逐 token 的流式输出。temperature 控制输出的随机性，maxTokens 限制输出长度。',
    flow: [
      '创建 ChatOpenAI 实例，配置 modelName、temperature 和 maxTokens。',
      '调用 invoke(messages) 获取完整回复，或调用 stream(messages) 逐 token 接收。',
      '模型返回 AIMessage 对象，通过 .content 获取文本内容。',
    ],
    notes: [
      '生产环境应通过环境变量管理 API Key，不要硬编码在代码中。',
      'streaming 适合长文本生成场景，能显著改善用户等待体验。',
      'temperature 越高输出越随机，越低越确定；代码生成建议 0-0.2，创意写作建议 0.7-1.0。',
      'maxTokens 用于控制输出长度，避免生成过长内容浪费 token。',
    ],
    problem: '解决"如何用 LangChain.js 调用 LLM 并获取回复"的入门问题。',
  },
{
    id: 'L_2',
    title: 'Prompt Template：提示词模板与变量注入',
    navTitle: '提示模板',
    category: '提示工程',
    path: '/langchain/l-2/prompt-template',
    summary: '用产品文案生成器展示 PromptTemplate 的变量注入、ChatPromptTemplate 的消息序列和 Partial Variables。',
    demo: L02PromptTemplate,
    code: () => Promise.resolve(`import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

// 示例1: 基础 PromptTemplate - 单变量模板
const productTemplate = PromptTemplate.fromTemplate(
  '请为 {productName} 写一句吸引人的广告语，目标用户是 {targetAudience}。'
)

const formattedPrompt = await productTemplate.format({
  productName: '智能手表',
  targetAudience: '年轻运动爱好者',
})
console.log(formattedPrompt)

// 示例2: ChatPromptTemplate - 多角色消息模板
const chatPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个专业的{role}，请用{tone}的语气回答问题。'],
  ['human', '{question}'],
])

const messages = await chatPrompt.formatMessages({
  role: '健身教练',
  tone: '鼓励',
  question: '我今天不想运动怎么办？',
})
console.log(messages)

// 示例3: 使用占位符和消息模板
const chatPrompt2 = ChatPromptTemplate.fromMessages([
  ['system', '你是一个 helpful 的助手。'],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
])

// 示例4: Partial Variables - 部分变量预填充
const baseTemplate = PromptTemplate.fromTemplate(
  '请用{language}写一个关于{topic}的简短介绍。'
)

// 先填入部分变量
const partialTemplate = await baseTemplate.partial({ language: '中文' })

// 后续再填入剩余变量
const finalPrompt = await partialTemplate.format({
  topic: '机器学习',
})
console.log(finalPrompt)

// 示例5: 管道组合 - PromptTemplate + Model
const model = new ChatOpenAI({ model: 'gpt-4o-mini' })
const prompt = ChatPromptTemplate.fromTemplate(
  '给我讲一个关于{subject}的简短笑话'
)
const chain = prompt.pipe(model)

const result = await chain.invoke({ subject: '程序员' })
console.log(result.content)

// 示例6: 多变量复杂模板
const reviewTemplate = PromptTemplate.fromTemplate(\`
请根据以下信息写一条产品评价：
产品: {product}
购买时间: {purchaseDate}
使用体验: {experience}
总体评分(1-5星): {rating}星

要求: 语气真实自然，{length}字左右。
\`)

const reviewPrompt = await reviewTemplate.format({
  product: '无线蓝牙耳机',
  purchaseDate: '2024年1月',
  experience: '音质不错，续航也很好',
  rating: 5,
  length: 100,
})`),
    language: 'typescript',
    principle:
      'PromptTemplate 将提示词中的可变部分抽取为模板变量，通过 format 时传入具体值生成最终提示。ChatPromptTemplate 按消息角色（system/human/ai）组织提示序列，适合对话场景。Partial Variables 支持先填入部分变量，后续补全其余变量。',
    flow: [
      '定义模板字符串，用 {variable} 标记可变位置。',
      '调用 template.format({ variable: value }) 生成完整提示词。',
      'ChatPromptTemplate.fromMessages 按角色组织消息，formatMessages 返回消息数组。',
      'Partial Variables 允许分步注入变量，适合部分参数延迟获取的场景。',
    ],
    notes: [
      '模板变量名应语义清晰，避免使用单字母或模糊名称。',
      '复杂提示应拆分为 system 指令 + human 输入，让模型更好理解上下文。',
      '模板支持 partial 格式化，可以先填入部分变量，后续再补全。',
    ],
    problem: '解决"提示词中可变部分如何管理，避免字符串拼接"的问题。',
  },
{
    id: 'L_3',
    title: 'Output Parsers：输出解析与结构化',
    navTitle: '输出解析',
    category: '输出处理',
    path: '/langchain/l-3/output-parser',
    summary: '用课程推荐展示 StringOutputParser 和基于 Zod 的结构化输出解析。',
    demo: L03OutputParser,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: StringOutputParser - 提取纯文本
const prompt1 = ChatPromptTemplate.fromTemplate(
  '用一句话解释{concept}是什么'
)
const stringParser = new StringOutputParser()

const chain1 = prompt1.pipe(model).pipe(stringParser)
const textResult = await chain1.invoke({ concept: 'RAG' })
console.log('纯文本结果:', textResult)

// 示例2: Zod 结构化输出 - 课程推荐
const courseSchema = z.object({
  courseName: z.string().describe('课程名称'),
  category: z.string().describe('课程分类'),
  difficulty: z.enum(['入门', '中级', '高级']).describe('难度等级'),
  duration: z.number().describe('课程时长（小时）'),
  description: z.string().describe('课程简介'),
  prerequisites: z.array(z.string()).describe('前置知识要求'),
})

const parser2 = StructuredOutputParser.fromZodSchema(courseSchema)

const prompt2 = ChatPromptTemplate.fromTemplate(\`
请推荐一门适合学习{topic}的课程。

{format_instructions}
\`)

const chain2 = prompt2.pipe(model).pipe(parser2)
const courseResult = await chain2.invoke({ topic: '机器学习' })
console.log('结构化课程:', courseResult.courseName, courseResult.difficulty)

// 示例3: 数组输出解析
const listSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    })
  ).describe('推荐列表'),
})

const parser3 = StructuredOutputParser.fromZodSchema(listSchema)

const prompt3 = ChatPromptTemplate.fromTemplate(\`
请推荐3本关于{genre}的经典书籍。

{format_instructions}
\`)

const chain3 = prompt3.pipe(model).pipe(parser3)
const booksResult = await chain3.invoke({ genre: '科幻小说' })
booksResult.recommendations.forEach((book, i) => {
  console.log(\`\${i + 1}. \${book.title}: \${book.reason}\`)
})

// 示例4: 链式调用中的 parser 组合
const prompt4 = ChatPromptTemplate.fromTemplate(
  '列出{count}个{category}的名称，用逗号分隔'
)

const chain4 = prompt4
  .pipe(model)
  .pipe(new StringOutputParser())
  .pipe((text) => text.split(',').map(s => s.trim()))

const listResult = await chain4.invoke({ count: 5, category: '编程语言' })
console.log('编程语言列表:', listResult)`),
    language: 'typescript',
    principle:
      'LLM 返回的是纯文本，Output Parser 将其转换为程序可处理的结构化数据。StringOutputParser 提取纯文本，基于 Zod schema 的 StructuredOutputParser 将输出解析为带类型的 JSON 对象。LangChain.js 推荐使用 Zod 定义输出结构。',
    flow: [
      'LLM 返回 AIMessage 对象，.content 是原始文本。',
      'StringOutputParser 直接提取 .content 字符串。',
      '基于 Zod schema 的 StructuredOutputParser 将文本解析为带类型的 JSON 对象。',
    ],
    notes: [
      'StructuredOutputParser 会自动在提示词中追加格式指令，告诉模型输出格式。',
      '解析失败时应提供兜底逻辑，例如重试或返回默认值。',
      'LangChain.js 推荐使用 Zod schema 定义输出结构，类型更安全且与 TypeScript 天然集成。',
    ],
    problem: '解决"LLM 输出是自由文本，如何可靠地转换为结构化数据"的问题。',
  },
{
    id: 'L_4',
    title: 'LCEL：LangChain Expression Language',
    navTitle: 'LCEL',
    category: '核心概念',
    path: '/langchain/l-4/lcel',
    summary: '用管道执行器展示 LCEL 的 prompt.pipe(model).pipe(parser) 链式组合和数据流转。',
    demo: L04LCEL,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough, RunnableParallel } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })

// 示例1: 基础 pipe 链式 - prompt -> model -> parser
const prompt1 = ChatPromptTemplate.fromTemplate(
  '用简洁的语言解释{concept}'
)
const parser = new StringOutputParser()

const chain1 = prompt1.pipe(model).pipe(parser)
const result1 = await chain1.invoke({ concept: 'LCEL' })
console.log('基础链结果:', result1)

// 示例2: RunnableSequence.from 数组形式
const chain2 = RunnableSequence.from([
  prompt1,
  model,
  parser,
])
const result2 = await chain2.invoke({ concept: 'RAG' })
console.log('Sequence 形式:', result2)

// 示例3: RunnablePassthrough - 透传输入
const prompt3 = ChatPromptTemplate.fromTemplate(\`
问题: {question}

请用中文回答，并说明你的推理过程。
\`)

const chain3 = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
  },
  prompt3,
  model,
  parser,
])

const result3 = await chain3.invoke('什么是向量检索？')
console.log('Passthrough 结果:', result3)

// 示例4: RunnableParallel - 并行执行多个分支
const analysisChain = RunnableParallel({
  summary: RunnableSequence.from([
    ChatPromptTemplate.fromTemplate('用一句话总结: {text}'),
    model,
    parser,
  ]),
  keywords: RunnableSequence.from([
    ChatPromptTemplate.fromTemplate('提取3个关键词，用逗号分隔: {text}'),
    model,
    parser,
    (text) => text.split(',').map(k => k.trim()),
  ]),
  sentiment: RunnableSequence.from([
    ChatPromptTemplate.fromTemplate('判断情感倾向(正面/负面/中性): {text}'),
    model,
    parser,
  ]),
})

const analysisResult = await analysisChain.invoke({
  text: '这家餐厅的服务很好，菜品也很美味，下次还会再来！',
})
console.log('摘要:', analysisResult.summary)
console.log('关键词:', analysisResult.keywords)
console.log('情感:', analysisResult.sentiment)

// 示例5: 自定义 Runnable
import { Runnable } from '@langchain/core/runnables'

const upperCaseRunnable = new Runnable({
  invoke: async (input: string) => input.toUpperCase(),
})

const chain5 = prompt1
  .pipe(model)
  .pipe(parser)
  .pipe(upperCaseRunnable)

const result5 = await chain5.invoke({ concept: '自定义 runnable' })
console.log('大写结果:', result5)

// 示例6: batch 批量调用
const chain6 = prompt1.pipe(model).pipe(parser)
const batchResults = await chain6.batch([
  { concept: '机器学习' },
  { concept: '深度学习' },
  { concept: '强化学习' },
])
batchResults.forEach((res, i) => console.log(\`\${i + 1}. \${res}\`))`),
    language: 'typescript',
    principle:
      'LCEL 是 LangChain 的表达式语言，通过 .pipe() 方法将 Runnable 组件串联。每个 Runnable 接收上游输出作为输入，处理后传给下游，形成声明式的数据处理管道。也可以用 RunnableSequence.from 数组形式组合。',
    flow: [
      '定义 prompt、model、parser 三个 Runnable 组件。',
      '用 .pipe() 串联：const chain = prompt.pipe(model).pipe(parser)。',
      '或用 RunnableSequence.from([prompt, model, parser]) 等价组合。',
      '调用 chain.invoke({ input }) 执行整个管道，数据依次流过每个组件。',
    ],
    notes: [
      'LCEL 是 LangChain 推荐的组件组合方式，替代了旧版 Chain 类。',
      'RunnablePassthrough 用于透传输入，RunnableParallel 用于并行执行多个分支。',
      '管道中的每个组件都支持 invoke、stream、batch 三种调用方式。',
    ],
    problem: '解决"如何声明式地组合 LLM 应用的各个处理步骤"的问题。',
  },
{
    id: 'L_5',
    title: 'Chains：链式调用与多步处理',
    navTitle: '链式调用',
    category: '核心概念',
    path: '/langchain/l-5/chains',
    summary: '用课程大纲生成展示 LCEL 多步骤链式处理：大纲生成 → 内容展开 → 摘要提炼。',
    demo: L05Chains,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 })
const parser = new StringOutputParser()

// 示例1: 三步链式 - 大纲生成 -> 内容展开 -> 摘要提炼
const outlinePrompt = ChatPromptTemplate.fromTemplate(\`
请为"{topic}"生成一份课程大纲，包含5个主要章节。
用数字编号列出每个章节的标题。
\`)

const contentPrompt = ChatPromptTemplate.fromTemplate(\`
根据以下课程大纲，为每个章节展开详细内容：

{outline}

请详细描述每个章节的核心知识点。
\`)

const summaryPrompt = ChatPromptTemplate.fromTemplate(\`
根据以下课程内容，提炼一份100字以内的课程摘要：

{content}
\`)

// 串联三个步骤
const fullChain = RunnableSequence.from([
  {
    outline: outlinePrompt.pipe(model).pipe(parser),
    topic: new RunnablePassthrough(),
  },
  {
    content: (input) => contentPrompt.pipe(model).pipe(parser).invoke({ outline: input.outline }),
    outline: (input) => input.outline,
  },
  {
    summary: (input) => summaryPrompt.pipe(model).pipe(parser).invoke({ content: input.content }),
    outline: (input) => input.outline,
    content: (input) => input.content,
  },
])

const result = await fullChain.invoke('LangChain.js 入门')
console.log('大纲:', result.outline)
console.log('摘要:', result.summary)

// 示例2: 顺序链 - 前一步输出作为后一步输入
const step1Prompt = ChatPromptTemplate.fromTemplate(
  '把这句话翻译成英文: {text}'
)
const step2Prompt = ChatPromptTemplate.fromTemplate(
  '把这句话改写得更诗意: {text}'
)
const step3Prompt = ChatPromptTemplate.fromTemplate(
  '为这句话配一个标题: {text}'
)

const sequentialChain = step1Prompt
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ text }))
  .pipe(step2Prompt)
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ text }))
  .pipe(step3Prompt)
  .pipe(model)
  .pipe(parser)

const title = await sequentialChain.invoke({ text: '春天来了，花儿都开了。' })
console.log('诗意标题:', title)

// 示例3: 分支链 - 根据条件选择不同路径
import { RunnableBranch } from '@langchain/core/runnables'

const classifyPrompt = ChatPromptTemplate.fromTemplate(\`
判断用户问题属于哪个类别（只返回类别名）：
- 技术问题
- 产品咨询
- 投诉建议
- 其他

问题: {question}
\`)

const techChain = ChatPromptTemplate.fromTemplate(
  '作为技术支持工程师，回答: {question}'
).pipe(model).pipe(parser)

const productChain = ChatPromptTemplate.fromTemplate(
  '作为产品顾问，回答: {question}'
).pipe(model).pipe(parser)

const complaintChain = ChatPromptTemplate.fromTemplate(
  '作为客服经理，诚恳地回应: {question}'
).pipe(model).pipe(parser)

const defaultChain = ChatPromptTemplate.fromTemplate(
  '作为通用助手，回答: {question}'
).pipe(model).pipe(parser)

const branch = RunnableBranch.from([
  [(input) => input.category === '技术问题', techChain],
  [(input) => input.category === '产品咨询', productChain],
  [(input) => input.category === '投诉建议', complaintChain],
  defaultChain,
])

const classifier = classifyPrompt.pipe(model).pipe(parser)

const fullBranchChain = RunnableSequence.from([
  {
    question: (input: { question: string }) => input.question,
    category: (input) => classifier.invoke({ question: input.question }),
  },
  branch,
])

const answer = await fullBranchChain.invoke({ question: '如何重置密码？' })
console.log('回答:', answer)`),
    language: 'typescript',
    principle:
      'Chain 将多个 LLM 调用和处理步骤串联成完整业务流程。前一步的输出作为后一步的输入，每步专注于单一职责，整体完成复杂任务。LangChain.js 推荐使用 LCEL 的 .pipe() 组合各步骤。',
    flow: [
      '第一步链根据主题生成课程大纲。',
      '第二步链接收大纲，展开详细内容。',
      '第三步链接收详细内容，提炼核心摘要。',
    ],
    notes: [
      '每步链应职责单一，避免在单个链中处理过多逻辑。',
      '链的中间结果可以缓存，避免重复调用 LLM。',
      'LangChain.js 推荐用 LCEL pipe 组合链，旧版 LLMChain/SequentialChain 已废弃。',
      '复杂流程可使用 LCEL 的 RunnableBranch 实现条件分支。',
    ],
    problem: '解决"复杂任务需要多步 LLM 处理，如何组织步骤间的数据传递"的问题。',
  },
{
    id: 'L_6',
    title: 'RAG 基础：文档加载与文本切分',
    navTitle: '文档切分',
    category: 'RAG',
    path: '/langchain/l-6/doc-splitter',
    summary: '用文档切分器展示 RecursiveCharacterTextSplitter 的块大小和重叠量配置。',
    demo: L06DocSplitter,
    code: () => Promise.resolve(`import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Document } from '@langchain/core/documents'

// 示例1: 基础文本切分
const longText = \`
LangChain 是一个用于开发由语言模型驱动的应用程序的框架。
它使应用程序能够：
1. 将语言模型与外部数据源连接起来
2. 允许语言模型与其环境进行交互

LangChain 的核心价值主张是：
- 组件：用于处理语言模型的抽象概念，以及每个抽象概念的实现集合。组件是模块化且易于使用的，无论您是否使用 LangChain 框架的其余部分。
- 即用型链：用于完成特定更高级别任务的组件的结构化组合。即用型链让您可以轻松上手。对于更复杂的应用程序和细致入微的用例，组件可以轻松自定义链。

主要模块包括：
- Models: 各种类型的模型和模型集成
- Prompts: 提示词管理、提示词优化等
- Memory: 短期记忆、长期记忆等
- Chains: 各种链式调用
- Agents: 代理、工具等
- Retrieval: 检索增强生成
- Callbacks: 回调系统
\`

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 40,
  separators: ['\\n\\n', '\\n', '。', '，', ' '],
})

const docs = await splitter.createDocuments([longText])
console.log(\`切分为 \${docs.length} 个块\`)
docs.forEach((doc, i) => {
  console.log(\`块\${i + 1} (\${doc.pageContent.length}字符): \${doc.pageContent.slice(0, 50)}...\`)
})

// 示例2: 配置不同的 chunkSize 和 chunkOverlap
const splitterSmall = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
})

const splitterLarge = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
})

// 示例3: 带元数据的文档切分
const docsWithMetadata = [
  new Document({
    pageContent: '这是文档的第一部分内容...',
    metadata: { source: 'chapter1', page: 1 },
  }),
  new Document({
    pageContent: '这是文档的第二部分内容...',
    metadata: { source: 'chapter1', page: 2 },
  }),
]

const splitDocs = await splitter.splitDocuments(docsWithMetadata)
console.log('切分后元数据保留:', splitDocs[0].metadata)

// 示例4: 从文件加载并切分 (TextLoader)
// const loader = new TextLoader('path/to/document.txt')
// const rawDocs = await loader.load()
// const splitDocs = await splitter.splitDocuments(rawDocs)

// 示例5: 按字符切分 CharacterTextSplitter
import { CharacterTextSplitter } from 'langchain/text_splitter'

const charSplitter = new CharacterTextSplitter({
  separator: '\\n',
  chunkSize: 200,
  chunkOverlap: 20,
})

// 示例6: 切分代码 - 使用语言特定的切分器
import { SupportedTextSplitterLanguages } from 'langchain/text_splitter'

// 查看支持的语言
console.log('支持的语言:', SupportedTextSplitterLanguages)

// 示例: JavaScript 代码切分
const jsCode = \`
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

class DataProcessor {
  constructor(data) {
    this.data = data;
  }

  process() {
    return this.data.map(item => item * 2);
  }
}

const numbers = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers));
\`

const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage('js', {
  chunkSize: 150,
  chunkOverlap: 30,
})

const jsChunks = await jsSplitter.createDocuments([jsCode])
console.log(\`JS代码切分为 \${jsChunks.length} 块\`)
`),
    language: 'typescript',
    principle:
      'RAG 的第一步是将长文档切分为适合检索的小块。RecursiveCharacterTextSplitter 按字符数切分，保留块间重叠以维持上下文连续性。chunkSize 控制块大小，chunkOverlap 控制重叠量。',
    flow: [
      '加载原始文档（TextLoader、PDFLoader 等）。',
      '配置 RecursiveCharacterTextSplitter 的 chunkSize 和 chunkOverlap。',
      '调用 splitter.splitDocuments(documents) 得到切分后的文档块列表。',
    ],
    notes: [
      'chunkSize 通常在 500-1500 字符之间，太小丢失上下文，太大降低检索精度。',
      'chunkOverlap 建议设为 chunkSize 的 10%-20%。',
      '不同文档类型可使用不同的 splitter，例如代码用 Language-specific splitter。',
    ],
    problem: '解决"长文档如何切分为适合向量检索的小块"的问题。',
  },
{
    id: 'L_7',
    title: 'RAG 进阶：向量存储与相似度检索',
    navTitle: '向量检索',
    category: 'RAG',
    path: '/langchain/l-7/vector-retrieval',
    summary: '用知识库搜索展示文档嵌入、余弦相似度计算和 Top-K 检索结果排序。',
    demo: L07VectorRetrieval,
    code: () => Promise.resolve(`import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// 示例1: 创建向量存储并添加文档
const documents = [
  new Document({
    pageContent: 'LangChain 是一个用于开发 LLM 应用的框架，提供模型调用、提示模板、链式调用等能力。',
    metadata: { category: '框架介绍' },
  }),
  new Document({
    pageContent: 'RAG (检索增强生成) 通过从知识库中检索相关文档，将其作为上下文提供给 LLM，提升回答准确性。',
    metadata: { category: 'RAG' },
  }),
  new Document({
    pageContent: '向量数据库将文本转换为高维向量，通过相似度计算快速检索相关文档。',
    metadata: { category: '向量存储' },
  }),
  new Document({
    pageContent: 'LCEL 是 LangChain 的表达式语言，通过 .pipe() 方法组合各种 Runnable 组件。',
    metadata: { category: 'LCEL' },
  }),
  new Document({
    pageContent: 'Agent 是能够自主决策的 LLM 应用，可以选择工具并逐步推理完成复杂任务。',
    metadata: { category: 'Agent' },
  }),
]

const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
})

const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings
)

// 示例2: 相似度检索 similaritySearch
const query1 = '如何用 LangChain 做 RAG？'
const results1 = await vectorStore.similaritySearch(query1, 2)
console.log('检索结果:')
results1.forEach((doc, i) => {
  console.log(\`\${i + 1}. [\${doc.metadata.category}] \${doc.pageContent.slice(0, 50)}...\`)
})

// 示例3: 带分数的相似度检索
const resultsWithScore = await vectorStore.similaritySearchWithScore(
  '什么是向量数据库？',
  3
)
console.log('\\n带分数的检索结果:')
resultsWithScore.forEach(([doc, score], i) => {
  console.log(\`\${i + 1}. 相似度: \${score.toFixed(4)} - \${doc.pageContent.slice(0, 40)}...\`)
})

// 示例4: 按元数据过滤检索
const filteredResults = await vectorStore.similaritySearch(
  'LLM 应用开发',
  2,
  { category: 'RAG' } // 过滤条件
)
console.log('\\n过滤后结果:', filteredResults.length)

// 示例5: 使用 Retriever 接口
const retriever = vectorStore.asRetriever({
  k: 2,
  searchType: 'similarity', // 或 'mmr'
})

const retrieverResults = await retriever.invoke('什么是 Agent？')
console.log('\\nRetriever 结果数量:', retrieverResults.length)

// 示例6: MMR (最大边际相关性) 检索 - 兼顾相关性和多样性
const mmrResults = await vectorStore.maxMarginalRelevanceSearch(
  'LangChain 的核心概念',
  {
    k: 3,
    fetchK: 10, // 先取 10 个最相关的
    lambda: 0.5, // 0=最大多样性, 1=最大相关性
  }
)
console.log('\\nMMR 结果数量:', mmrResults.length)

// 示例7: 完整 RAG 流程 - 检索 + 生成
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })

const ragPrompt = ChatPromptTemplate.fromTemplate(\`
根据以下上下文回答问题：

{context}

问题: {question}

请用简洁的语言回答。如果上下文中没有相关信息，请说"我不知道"。
\`)

function formatDocs(docs: Document[]) {
  return docs.map(doc => doc.pageContent).join('\\n\\n')
}

const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocs),
    question: new RunnablePassthrough(),
  },
  ragPrompt,
  model,
  new StringOutputParser(),
])

const answer = await ragChain.invoke('RAG 是什么？')
console.log('\\nRAG 回答:', answer)`),
    language: 'typescript',
    principle:
      '向量检索是 RAG 的核心。文档通过 Embedding 模型转换为高维向量（如 text-embedding-3-small 输出 1536 维），查询同样被转换为向量，通过余弦相似度等度量找到最相关的文档块。VectorStore 封装了存储和检索逻辑。',
    flow: [
      '将文档块通过 Embedding 模型转换为向量。',
      '存入 VectorStore（MemoryVectorStore、FAISS、Pinecone 等）。',
      '查询时将问题转为向量，调用 similaritySearch 返回最相关的 K 个文档块。',
    ],
    notes: [
      'Embedding 模型的选择直接影响检索质量，OpenAI 的 text-embedding-3-small 是常用选择。',
      '真实 Embedding 向量维度通常为 1536 或 3072，本 demo 用 3 维简化演示。',
      '生产环境推荐使用持久化向量数据库，如 Pinecone、Weaviate 或 Chroma。',
      '检索结果数量 K 值需要根据场景调优，通常 3-5 个即可。',
    ],
    problem: '解决"如何从大量文档中快速找到与问题最相关的内容"的问题。',
  },
{
    id: 'L_8',
    title: 'Agent：智能代理与 ReAct 推理',
    navTitle: '智能代理',
    category: 'Agent',
    path: '/langchain/l-8/agent',
    summary: '用推理过程展示 Agent 的 ReAct 循环：思考 → 行动 → 观察 → 回答。',
    demo: L08Agent,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate } from '@langchain/core/prompts'

// 示例1: 定义工具
const searchTool = tool(
  async ({ query }) => {
    // 模拟搜索结果
    const mockResults: Record<string, string> = {
      'LangChain': 'LangChain 是一个用于开发 LLM 应用的开源框架，支持 Python 和 JavaScript。',
      'OpenAI': 'OpenAI 是一家人工智能研究公司，开发了 GPT 系列模型。',
      'RAG': 'RAG (检索增强生成) 是一种结合检索和生成的技术，可以提升 LLM 回答的准确性。',
    }
    return mockResults[query] || \`未找到关于"\${query}"的信息\`
  },
  {
    name: 'web_search',
    description: '搜索网络获取信息。当你需要回答实时性问题或不了解的知识时使用。',
    schema: z.object({
      query: z.string().describe('搜索关键词'),
    }),
  }
)

const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = eval(expression)
      return \`计算结果: \${result}\`
    } catch (e) {
      return '计算错误，请检查表达式'
    }
  },
  {
    name: 'calculator',
    description: '进行数学计算。当你需要做加减乘除等数学运算时使用。',
    schema: z.object({
      expression: z.string().describe('数学表达式，如 "2 + 3 * 4"'),
    }),
  }
)

const tools = [searchTool, calculatorTool]

// 示例2: 创建 ReAct Agent
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个 helpful 的助手。你可以使用工具来帮助回答问题。'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
])

const agent = createToolCallingAgent({
  llm: model,
  tools,
  prompt,
})

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true, // 显示思考过程
  maxIterations: 5, // 最大迭代次数，防止无限循环
})

// 示例3: 简单问题（不需要工具）
const result1 = await agentExecutor.invoke({
  input: '你好，请介绍一下你自己',
})
console.log('回答:', result1.output)

// 示例4: 需要搜索的问题
const result2 = await agentExecutor.invoke({
  input: 'LangChain 是什么？',
})
console.log('回答:', result2.output)

// 示例5: 需要计算的问题
const result3 = await agentExecutor.invoke({
  input: '123 乘以 456 等于多少？',
})
console.log('回答:', result3.output)

// 示例6: 多步骤推理问题
const result4 = await agentExecutor.invoke({
  input: 'RAG 是什么？用一句话解释，然后计算 15 的平方是多少？',
})
console.log('回答:', result4.output)

// 示例7: 流式输出 Agent 执行过程
const stream = await agentExecutor.stream({
  input: '搜索 LangChain 的信息，然后用一句话总结',
})

for await (const step of stream) {
  if (step.messages) {
    step.messages.forEach((msg: any) => {
      if (msg._getType() === 'ai' && msg.tool_calls) {
        console.log('工具调用:', msg.tool_calls)
      } else if (msg._getType() === 'tool') {
        console.log('工具结果:', msg.content.slice(0, 50))
      }
    })
  }
  if (step.output) {
    console.log('最终答案:', step.output)
  }
}`),
    language: 'typescript',
    principle:
      'Agent 是能够自主决策的 LLM 应用。ReAct 模式让 Agent 在每一步先思考需要做什么，然后选择工具执行行动，观察结果后再决定下一步，直到得出最终答案。',
    flow: [
      'Agent 接收用户问题，进入推理循环。',
      '思考阶段：分析当前信息，决定下一步行动。',
      '行动阶段：选择工具并执行，获取观察结果。',
      '重复思考和行动，直到信息足够生成最终答案。',
    ],
    notes: [
      'Agent 的推理过程不可预测，需要设置最大迭代次数防止无限循环。',
      '工具描述的清晰程度直接影响 Agent 选择工具的准确性。',
      '简单任务不需要 Agent，直接用 Chain 更可控。',
    ],
    problem: '解决"LLM 如何根据问题自主选择工具并逐步推理"的问题。',
  },
{
    id: 'L_9',
    title: 'Tools：工具定义与调用',
    navTitle: '工具定义',
    category: 'Agent',
    path: '/langchain/l-9/tools',
    summary: '用工具注册表展示 tool 函数的定义、Zod 参数 Schema 和调用过程。',
    demo: L09Tools,
    code: () => Promise.resolve(`import { tool, Tool } from '@langchain/core/tools'
import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'

// 示例1: 使用 tool 函数定义工具（推荐方式）
const weatherTool = tool(
  async ({ city, date }) => {
    const mockWeather: Record<string, any> = {
      '北京': { temp: 25, condition: '晴', humidity: 45 },
      '上海': { temp: 28, condition: '多云', humidity: 65 },
      '深圳': { temp: 32, condition: '雷阵雨', humidity: 80 },
    }
    const weather = mockWeather[city] || { temp: 20, condition: '未知', humidity: 50 }
    return \`\${city} \${date} 天气: \${weather.condition}, 温度 \${weather.temp}°C, 湿度 \${weather.humidity}%\`
  },
  {
    name: 'get_weather',
    description: '获取指定城市的天气信息。查询天气预报时使用。',
    schema: z.object({
      city: z.string().describe('城市名称，如"北京"、"上海"'),
      date: z.string().describe('日期，格式 YYYY-MM-DD'),
    }),
  }
)

console.log('工具名称:', weatherTool.name)
console.log('工具描述:', weatherTool.description)

// 示例2: 直接调用工具
const result = await weatherTool.invoke({ city: '北京', date: '2024-07-01' })
console.log('调用结果:', result)

// 示例3: 定义多个工具
const searchTool = tool(
  async ({ query }) => {
    return \`搜索"\${query}"的结果：...\`
  },
  {
    name: 'web_search',
    description: '搜索网络获取信息',
    schema: z.object({
      query: z.string().describe('搜索关键词'),
    }),
  }
)

const calculatorTool = tool(
  async ({ a, b, operation }) => {
    let result: number
    switch (operation) {
      case 'add': result = a + b; break
      case 'subtract': result = a - b; break
      case 'multiply': result = a * b; break
      case 'divide': result = a / b; break
      default: result = 0
    }
    return \`\${a} \${operation} \${b} = \${result}\`
  },
  {
    name: 'calculator',
    description: '执行基础数学运算',
    schema: z.object({
      a: z.number().describe('第一个数字'),
      b: z.number().describe('第二个数字'),
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('运算类型'),
    }),
  }
)

const tools = [weatherTool, searchTool, calculatorTool]

// 示例4: 模型调用工具（Function Calling）
const model = new ChatOpenAI({ model: 'gpt-4o-mini' }).bind({
  tools: tools.map(t => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: (t as any).schema ? (t as any).schema : {},
    },
  })),
})

// 示例5: 使用 withStructuredOutput 实现工具调用
const modelWithTools = new ChatOpenAI({ model: 'gpt-4o-mini' }).bindTools(tools)

const response = await modelWithTools.invoke([
  { role: 'user', content: '北京今天天气怎么样？' }
])

// 检查是否有工具调用
if (response.tool_calls && response.tool_calls.length > 0) {
  console.log('工具调用:', response.tool_calls)
  // 执行工具调用
  for (const toolCall of response.tool_calls) {
    const toolInstance = tools.find(t => t.name === toolCall.name)
    if (toolInstance) {
      const toolResult = await toolInstance.invoke(toolCall.args)
      console.log('工具结果:', toolResult)
    }
  }
}

// 示例6: 继承 Tool 类定义工具（旧方式）
class CustomSearchTool extends Tool {
  name = 'custom_search'
  description = '自定义搜索工具'

  async _call(input: string): Promise<string> {
    return \`搜索结果: \${input}\`
  }
}

const customTool = new CustomSearchTool()

// 示例7: 工具的元数据和标签
const taggedTool = tool(
  async ({ query }) => \`结果: \${query}\`,
  {
    name: 'tagged_search',
    description: '带标签的搜索工具',
    schema: z.object({ query: z.string() }),
    tags: ['search', 'production'],
    metadata: { version: '1.0.0' },
  }
)
console.log('工具标签:', taggedTool.tags)
console.log('工具元数据:', taggedTool.metadata)`),
    language: 'typescript',
    principle:
      'Tool 是 Agent 与外部世界交互的接口。每个工具定义名称、描述和参数 Schema，Agent 根据描述判断何时调用哪个工具。LangChain.js 推荐使用 tool 函数配合 Zod schema 定义工具，提供类型安全的方式。',
    flow: [
      '使用 tool 函数定义工具名称、描述和 Zod 参数 Schema。',
      '实现工具的执行函数，接收参数并返回结果。',
      '将工具注册到 Agent，Agent 在推理时自动选择和调用。',
    ],
    notes: [
      '工具描述要清晰具体，说明适用场景和输入格式。',
      '工具执行应有超时和错误处理，避免阻塞 Agent 推理。',
      '参数 Schema 越精确，Agent 传参错误越少。',
      'LangChain.js 推荐使用 tool 函数 + Zod schema，旧版 DynamicTool 已不推荐。',
    ],
    problem: '解决"Agent 如何与外部系统交互，以及如何定义可被 LLM 理解的工具接口"的问题。',
  },
{
    id: 'L_10',
    title: 'Memory：对话记忆与历史管理',
    navTitle: '对话记忆',
    category: '对话管理',
    path: '/langchain/l-10/memory',
    summary: '用对话面板展示 BufferMemory、BufferWindowMemory 和 SummaryMemory 三种记忆策略。',
    demo: L10Memory,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages'
import { ChatMessageHistory } from 'langchain/stores/message/in_memory'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })

// 示例1: ChatMessageHistory - 基础消息历史
const history = new ChatMessageHistory()

// 添加消息
await history.addMessage(new HumanMessage('你好，我叫小明'))
await history.addMessage(new AIMessage('你好小明！有什么我可以帮助你的吗？'))
await history.addMessage(new HumanMessage('我喜欢编程'))
await history.addMessage(new AIMessage('太棒了！你最喜欢哪种编程语言？'))

// 获取历史消息
const messages = await history.getMessages()
console.log('历史消息数:', messages.length)
messages.forEach(msg => {
  console.log(\`[\${msg._getType()}] \${msg.content}\`)
})

// 示例2: 带记忆的对话链 - 完整历史
const promptWithHistory = ChatPromptTemplate.fromMessages([
  ['system', '你是一个友好的 AI 助手，请用中文回答问题。'],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
])

const chainWithHistory = RunnableSequence.from([
  {
    input: (input: { input: string; chat_history: any[] }) => input.input,
    chat_history: (input) => input.chat_history,
  },
  promptWithHistory,
  model,
  new StringOutputParser(),
])

async function chatWithFullMemory() {
  const history = new ChatMessageHistory()
  
  // 第一轮对话
  await history.addUserMessage('你好，我叫小红')
  const response1 = await chainWithHistory.invoke({
    input: '你好，我叫小红',
    chat_history: await history.getMessages(),
  })
  await history.addAIChatMessage(response1)
  console.log('AI 1:', response1)

  // 第二轮对话 - 模型应该记得名字
  const response2 = await chainWithHistory.invoke({
    input: '我叫什么名字？',
    chat_history: await history.getMessages(),
  })
  await history.addAIChatMessage(response2)
  console.log('AI 2:', response2)
}

// 示例3: BufferWindowMemory - 只保留最近 k 轮
async function getWindowMessages(history: ChatMessageHistory, k: number) {
  const allMessages = await history.getMessages()
  // 保留最近 k 轮对话（2*k 条消息）
  return allMessages.slice(-2 * k)
}

async function chatWithWindowMemory() {
  const history = new ChatMessageHistory()
  
  // 添加多轮对话
  await history.addUserMessage('第一轮问题')
  await history.addAIChatMessage('第一轮回答')
  await history.addUserMessage('第二轮问题')
  await history.addAIChatMessage('第二轮回答')
  await history.addUserMessage('第三轮问题')
  await history.addAIChatMessage('第三轮回答')

  const windowMessages = await getWindowMessages(history, 2)
  console.log('窗口记忆消息数:', windowMessages.length) // 应该是 4 条（2轮）
}

// 示例4: ConversationSummaryMemory - 摘要记忆
const summarizePrompt = ChatPromptTemplate.fromTemplate(\`
请将以下对话历史压缩为一段简洁的摘要：

{conversation}

摘要:
\`)

async function summarizeHistory(history: ChatMessageHistory) {
  const messages = await history.getMessages()
  const conversation = messages
    .map(m => \`\${m._getType().toUpperCase()}: \${m.content}\`)
    .join('\\n')
  
  const summaryChain = summarizePrompt.pipe(model).pipe(new StringOutputParser())
  return summaryChain.invoke({ conversation })
}

async function chatWithSummaryMemory() {
  const history = new ChatMessageHistory()
  let summary = ''

  // 对话
  await history.addUserMessage('你好，我在学习 LangChain')
  await history.addAIChatMessage('很好！LangChain 是构建 LLM 应用的强大框架')
  await history.addUserMessage('它支持哪些功能？')
  await history.addAIChatMessage('支持模型调用、提示模板、链式调用、Agent、RAG 等')

  // 当历史太长时，生成摘要
  const allMessages = await history.getMessages()
  if (allMessages.length > 10) {
    summary = await summarizeHistory(history)
    // 清空历史，只保留摘要
    await history.clear()
    await history.addMessage(new SystemMessage(\`之前对话的摘要: \${summary}\`))
  }
}

// 示例5: 使用 RunnableWithMessageHistory
import { RunnableWithMessageHistory } from '@langchain/core/runnables'

const simplePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个 helpful 的助手。'],
  new MessagesPlaceholder('history'),
  ['human', '{input}'],
])

const chain = simplePrompt.pipe(model).pipe(new StringOutputParser())

const messageHistories: Record<string, ChatMessageHistory> = {}

function getMessageHistory(sessionId: string) {
  if (!messageHistories[sessionId]) {
    messageHistories[sessionId] = new ChatMessageHistory()
  }
  return messageHistories[sessionId]
}

const chainWithHistory2 = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory,
  inputMessagesKey: 'input',
  historyMessagesKey: 'history',
})

async function testRunnableHistory() {
  const sessionId = 'user-123'
  
  const res1 = await chainWithHistory2.invoke(
    { input: '我叫小明' },
    { configurable: { sessionId } }
  )
  console.log('回答1:', res1)

  const res2 = await chainWithHistory2.invoke(
    { input: '我叫什么名字？' },
    { configurable: { sessionId } }
  )
  console.log('回答2:', res2)
}`),
    language: 'typescript',
    principle:
      'Memory 让 LLM 应用记住之前的对话。BufferMemory 保留完整历史，ConversationBufferWindowMemory 只保留最近 k 轮，ConversationSummaryMemory 将历史压缩为摘要。不同策略在上下文长度和记忆完整性之间取舍。',
    flow: [
      '每次对话后将消息存入 Memory（底层使用 ChatMessageHistory）。',
      '下次调用 LLM 前从 Memory 读取历史，拼接到提示词中。',
      '根据场景选择合适的记忆策略：短对话用 Buffer，长对话用 Window 或 Summary。',
    ],
    notes: [
      '对话轮数多时 BufferMemory 会超出 token 限制，需要切换为 Window 或 Summary。',
      'SummaryMemory 需要额外的 LLM 调用来生成摘要，增加延迟和成本。',
      'ChatMessageHistory 是底层存储，支持持久化到 Redis、数据库等后端。',
      '生产环境建议使用持久化存储而非内存存储。',
    ],
    problem: '解决"LLM 应用如何记住之前的对话，并在 token 限制内保持上下文"的问题。',
  },
{
    id: 'L_11',
    title: 'Callbacks：回调与可观测性',
    navTitle: '回调追踪',
    category: '工程实践',
    path: '/langchain/l-11/callbacks',
    summary: '用事件时间线展示 handleChainStart、handleLLMStart、handleLLMNewToken、handleLLMEnd 等回调的触发时机。',
    demo: L11Callbacks,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { BaseCallbackHandler } from '@langchain/core/callbacks/base'

// 示例1: 自定义 CallbackHandler
class MyCallbackHandler extends BaseCallbackHandler {
  name = 'my_callback_handler'

  // 链开始时触发
  async handleChainStart(chain: any, inputs: any, runId: string) {
    console.log(\`[链开始] runId: \${runId}\`)
    console.log(\`  输入: \${JSON.stringify(inputs).slice(0, 100)}\`)
  }

  // 链结束时触发
  async handleChainEnd(outputs: any, runId: string) {
    console.log(\`[链结束] runId: \${runId}\`)
    console.log(\`  输出: \${JSON.stringify(outputs).slice(0, 100)}\`)
  }

  // LLM 调用开始时触发
  async handleLLMStart(llm: any, prompts: string[], runId: string) {
    console.log(\`[LLM 开始] runId: \${runId}\`)
    console.log(\`  提示词数量: \${prompts.length}\`)
  }

  // LLM 生成新 token 时触发
  async handleLLMNewToken(token: string, idx: number, runId: string) {
    console.log(\`[新 Token] \${token}\`)
  }

  // LLM 调用结束时触发
  async handleLLMEnd(output: any, runId: string) {
    console.log(\`[LLM 结束] runId: \${runId}\`)
    const tokenUsage = output.llmOutput?.tokenUsage
    if (tokenUsage) {
      console.log(\`  Token 使用: prompt=\${tokenUsage.promptTokens}, completion=\${tokenUsage.completionTokens}, total=\${tokenUsage.totalTokens}\`)
    }
  }

  // 错误时触发
  async handleChainError(error: Error, runId: string) {
    console.error(\`[链错误] runId: \${runId}, 错误: \${error.message}\`)
  }

  async handleLLMError(error: Error, runId: string) {
    console.error(\`[LLM 错误] runId: \${runId}, 错误: \${error.message}\`)
  }

  // 工具调用回调
  async handleToolStart(tool: any, input: string, runId: string) {
    console.log(\`[工具开始] 工具名: \${tool.name}, 输入: \${input.slice(0, 50)}\`)
  }

  async handleToolEnd(output: string, runId: string) {
    console.log(\`[工具结束] 输出: \${output.slice(0, 50)}\`)
  }
}

const myHandler = new MyCallbackHandler()

// 示例2: 在 invoke 中使用回调
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const prompt = ChatPromptTemplate.fromTemplate('解释{concept}')
const parser = new StringOutputParser()

const chain = prompt.pipe(model).pipe(parser)

const result = await chain.invoke(
  { concept: '回调函数' },
  { callbacks: [myHandler] }
)
console.log('最终结果:', result)

// 示例3: 在 stream 中使用回调（handleLLMNewToken）
const streamResult = await chain.stream(
  { concept: '流式输出' },
  { callbacks: [myHandler] }
)

let fullText = ''
for await (const chunk of streamResult) {
  fullText += chunk
}
console.log('完整文本:', fullText)

// 示例4: 创建模型时指定回调
const modelWithCallback = new ChatOpenAI({
  model: 'gpt-4o-mini',
  callbacks: [myHandler],
})

// 示例5: 使用标签和元数据
const chainWithTags = prompt.pipe(model).pipe(parser)

const resultWithTags = await chainWithTags.invoke(
  { concept: '标签系统' },
  {
    tags: ['production', 'v1.0'],
    metadata: { user: 'user123', feature: 'explanation' },
  }
)

// 示例6: 计算执行时间的回调
class TimingCallbackHandler extends BaseCallbackHandler {
  name = 'timing_handler'
  private startTime: Record<string, number> = {}

  async handleChainStart(_chain: any, _inputs: any, runId: string) {
    this.startTime[runId] = Date.now()
    console.log(\`[开始] runId: \${runId}\`)
  }

  async handleChainEnd(_outputs: any, runId: string) {
    const duration = Date.now() - this.startTime[runId]
    console.log(\`[结束] runId: \${runId}, 耗时: \${duration}ms\`)
    delete this.startTime[runId]
  }
}

const timingHandler = new TimingCallbackHandler()

const timingResult = await chain.invoke(
  { concept: '性能监控' },
  { callbacks: [timingHandler] }
)

// 示例7: ConsoleCallbackHandler（内置调试用）
import { ConsoleCallbackHandler } from '@langchain/core/tracers/console'

const consoleHandler = new ConsoleCallbackHandler()

// 用于调试时查看详细执行过程
// const debugResult = await chain.invoke(
//   { concept: '调试' },
//   { callbacks: [consoleHandler] }
// )`),
    language: 'typescript',
    principle:
      'Callbacks 是 LangChain 的可观测性机制。通过注册回调处理器，可以在 Runnable 执行的各个阶段（链开始、LLM 调用开始、生成 token、调用结束、出错）执行自定义逻辑，用于日志、监控、调试和流式输出。',
    flow: [
      '实现 CallbackHandler，定义 handleChainStart、handleLLMStart、handleLLMNewToken、handleLLMEnd 等方法。',
      '将 handler 传入 Runnable 的 callbacks 参数。',
      '执行过程中回调自动触发，记录每个阶段的输入输出和耗时。',
    ],
    notes: [
      '生产环境建议集成 LangSmith 或 LangFuse 进行链路追踪。',
      'handleLLMNewToken 是实现流式输出的关键回调。',
      'handleChainError 用于捕获链执行中的错误，实现错误监控和告警。',
      '回调中不要执行耗时操作，避免阻塞 LLM 调用流程。',
    ],
    problem: '解决"LLM 应用执行过程不透明，如何监控和调试"的问题。',
  },
{
    id: 'L_12',
    title: '综合实战：Retriever + Agent + Memory 智能问答',
    navTitle: '智能问答',
    category: '综合实战',
    path: '/langchain/l-12/qa-bot',
    summary: '用智能问答助手展示 Retriever 检索、Agent 推理和对话记忆的综合应用。',
    demo: L12QABot,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { ChatMessageHistory } from 'langchain/stores/message/in_memory'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'

// 示例1: 准备知识库文档
const knowledgeDocs = [
  new Document({
    pageContent: 'LangChain 是一个用于开发 LLM 应用的开源框架，支持 Python 和 JavaScript。核心概念包括 Models、Prompts、Chains、Agents、Memory、Retrieval 等。',
    metadata: { topic: 'LangChain 基础' },
  }),
  new Document({
    pageContent: 'RAG（检索增强生成）是一种结合检索系统和 LLM 的技术。流程包括：文档加载、文本切分、向量化、存储、检索、生成。可以有效解决 LLM 知识过时的问题。',
    metadata: { topic: 'RAG' },
  }),
  new Document({
    pageContent: 'Agent 是能够自主决策的 LLM 应用。ReAct 模式是最常用的 Agent 模式，包括思考(Thought)、行动(Action)、观察(Observation)三个步骤循环。',
    metadata: { topic: 'Agent' },
  }),
  new Document({
    pageContent: 'LangChain.js 提供了 LCEL（LangChain Expression Language），通过 .pipe() 方法组合各种 Runnable 组件，实现声明式的链式调用。',
    metadata: { topic: 'LCEL' },
  }),
  new Document({
    pageContent: '向量数据库用于存储文本的向量表示，支持相似度检索。常用的有 Chroma、Pinecone、Weaviate、FAISS 等。OpenAI 的 text-embedding-3-small 输出 1536 维向量。',
    metadata: { topic: '向量存储' },
  }),
]

// 示例2: 创建向量存储和检索器
const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
const vectorStore = await MemoryVectorStore.fromDocuments(knowledgeDocs, embeddings)
const retriever = vectorStore.asRetriever({ k: 3 })

// 示例3: 定义检索工具
const searchTool = tool(
  async ({ query }) => {
    const docs = await retriever.invoke(query)
    return docs.map((doc, i) => \`[\${i + 1}] \${doc.pageContent}\`).join('\\n\\n')
  },
  {
    name: 'knowledge_base_search',
    description: '从知识库中搜索相关信息。回答关于 LangChain、RAG、Agent 等技术问题时使用。',
    schema: z.object({
      query: z.string().describe('搜索查询'),
    }),
  }
)

const tools = [searchTool]

// 示例4: 创建带记忆的 Agent
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

const prompt = ChatPromptTemplate.fromMessages([
  ['system', \`你是一个专业的 LangChain 技术支持助手。
你可以使用知识库搜索工具来查找相关信息。
如果知识库中没有答案，请诚实地说你不知道。
请用简洁、专业的中文回答问题。\`],
  new MessagesPlaceholder('chat_history'),
  ['human', '{input}'],
  new MessagesPlaceholder('agent_scratchpad'),
])

const agent = createToolCallingAgent({ llm: model, tools, prompt })
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
  maxIterations: 5,
})

// 示例5: 添加对话记忆
const messageHistories: Record<string, ChatMessageHistory> = {}

function getMessageHistory(sessionId: string) {
  if (!messageHistories[sessionId]) {
    messageHistories[sessionId] = new ChatMessageHistory()
  }
  return messageHistories[sessionId]
}

const agentWithMemory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory,
  inputMessagesKey: 'input',
  historyMessagesKey: 'chat_history',
})

// 示例6: 使用智能问答助手
async function runQABot() {
  const sessionId = 'user-001'

  console.log('=== 智能问答助手 ===')

  // 第一轮：基础问题
  console.log('\\n用户: 什么是 RAG？')
  const response1 = await agentWithMemory.invoke(
    { input: '什么是 RAG？' },
    { configurable: { sessionId } }
  )
  console.log('助手:', response1.output)

  // 第二轮：追问（测试记忆）
  console.log('\\n用户: 它的主要流程是什么？')
  const response2 = await agentWithMemory.invoke(
    { input: '它的主要流程是什么？' },
    { configurable: { sessionId } }
  )
  console.log('助手:', response2.output)

  // 第三轮：另一个话题
  console.log('\\n用户: LangChain 的 LCEL 是什么？')
  const response3 = await agentWithMemory.invoke(
    { input: 'LangChain 的 LCEL 是什么？' },
    { configurable: { sessionId } }
  )
  console.log('助手:', response3.output)

  // 第四轮：综合问题（需要推理 + 检索）
  console.log('\\n用户: 如何用 LangChain 实现一个 RAG 系统？')
  const response4 = await agentWithMemory.invoke(
    { input: '如何用 LangChain 实现一个 RAG 系统？' },
    { configurable: { sessionId } }
  )
  console.log('助手:', response4.output)
}

// 示例7: 流式输出对话
async function streamQABot() {
  const sessionId = 'user-002'

  const stream = await agentWithMemory.stream(
    { input: '解释一下 Agent 的工作原理' },
    { configurable: { sessionId } }
  )

  console.log('\\n流式回答:')
  for await (const step of stream) {
    if (step.output) {
      process.stdout.write(step.output)
    }
  }
  console.log()
}`),
    language: 'typescript',
    principle:
      '真实 LLM 应用通常需要组合多种能力。Retriever 从 VectorStore 检索相关文档，Agent 提供推理决策，Memory 提供上下文记忆。三者协同构成完整的智能问答系统：先检索相关文档，再推理生成答案，同时维护对话历史。',
    flow: [
      '从 Memory 中检索对话上下文，了解用户历史意图。',
      '通过 Retriever 从 VectorStore 检索与当前问题相关的文档片段。',
      'Agent 结合检索结果和上下文，推理生成最终答案。',
    ],
    notes: [
      '检索质量是 RAG 应用的关键瓶颈，投入精力优化文档切分和检索策略。',
      'Agent 的可靠性需要通过测试和监控持续改进。',
      '生产环境要考虑降级策略：Agent 失败时回退到简单 Chain。',
    ],
    problem: '解决"如何将 RAG、Agent、Memory 组合为完整的智能问答系统"的问题。',
  },
{
    id: 'L_13',
    title: '流式输出深入：invoke、stream、astream_events',
    navTitle: '流式输出',
    category: '核心概念',
    path: '/langchain/l-13/streaming',
    summary: '用三种流式策略对比展示 invoke、stream 和 astream_events 的差异和适用场景。',
    demo: L13Streaming,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })
const prompt = ChatPromptTemplate.fromTemplate(
  '用生动的语言描述{scene}，不少于200字'
)
const parser = new StringOutputParser()
const chain = prompt.pipe(model).pipe(parser)

// 示例1: invoke - 等待完整响应
async function demoInvoke() {
  console.log('=== invoke 方式 ===')
  const startTime = Date.now()
  
  const result = await chain.invoke({ scene: '春天的花园' })
  
  const duration = (Date.now() - startTime) / 1000
  console.log(\`等待时间: \${duration.toFixed(2)}秒\`)
  console.log(\`结果长度: \${result.length}字\`)
  console.log('完整结果:', result.slice(0, 100) + '...')
}

// 示例2: stream - 逐 token 流式输出
async function demoStream() {
  console.log('\\n=== stream 方式 ===')
  const startTime = Date.now()
  let firstTokenTime: number | null = null
  let tokenCount = 0
  let fullText = ''

  const stream = await chain.stream({ scene: '夏日海边' })

  for await (const chunk of stream) {
    if (!firstTokenTime) {
      firstTokenTime = Date.now()
      console.log(\`首 token 延迟: \${((firstTokenTime - startTime) / 1000).toFixed(2)}秒\`)
      process.stdout.write('流式输出: ')
    }
    fullText += chunk
    tokenCount++
    process.stdout.write(chunk)
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log()
  console.log(\`总耗时: \${totalDuration}秒\`)
  console.log(\`总 token 数: \${tokenCount}\`)
}

// 示例3: astream_events - 事件级流式输出（v2）
async function demoAstreamEvents() {
  console.log('\\n=== astream_events 方式 ===')

  const eventStream = await chain.astream_events(
    { scene: '秋天的森林' },
    { version: 'v2' }
  )

  let eventCount = 0
  for await (const event of eventStream) {
    eventCount++
    if (event.event === 'on_chat_model_start') {
      console.log(\`[事件\${eventCount}] LLM 开始调用\`)
    } else if (event.event === 'on_chat_model_stream') {
      const token = event.data?.chunk?.content || ''
      if (token) {
        process.stdout.write(token)
      }
    } else if (event.event === 'on_chat_model_end') {
      console.log()
      console.log(\`[事件\${eventCount}] LLM 调用结束\`)
    } else if (event.event === 'on_chain_start') {
      console.log(\`[事件\${eventCount}] 链开始: \${event.name}\`)
    } else if (event.event === 'on_chain_end') {
      console.log(\`[事件\${eventCount}] 链结束: \${event.name}\`)
    }
  }
  console.log(\`总事件数: \${eventCount}\`)
}

// 示例4: batch - 批量处理
async function demoBatch() {
  console.log('\\n=== batch 方式 ===')
  const startTime = Date.now()

  const inputs = [
    { scene: '春天的花园' },
    { scene: '夏日海边' },
    { scene: '秋天的森林' },
  ]

  const results = await chain.batch(inputs, {
    maxConcurrency: 3, // 最大并发数
  })

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(\`批量处理 \${results.length} 个请求，耗时: \${duration}秒\`)
  results.forEach((res, i) => {
    console.log(\`结果\${i + 1}长度: \${res.length}字\`)
  })
}

// 示例5: stream_log - 流式获取中间步骤日志
async function demoStreamLog() {
  console.log('\\n=== stream_log 方式 ===')

  const logStream = await chain.streamLog({ scene: '冬天的雪山' })

  for await (const log of logStream) {
    if (log.ops && log.ops.length > 0) {
      log.ops.forEach((op: any) => {
        if (op.value?.content) {
          process.stdout.write(op.value.content)
        }
      })
    }
  }
  console.log()
}

// 示例6: 控制流式输出的速率（节流）
async function demoThrottledStream() {
  console.log('\\n=== 节流流式输出 ===')

  const stream = await chain.stream({ scene: '城市夜景' })
  let buffer = ''
  let lastFlush = Date.now()

  for await (const chunk of stream) {
    buffer += chunk
    const now = Date.now()
    // 每 100ms 刷新一次
    if (now - lastFlush >= 100) {
      process.stdout.write(buffer)
      buffer = ''
      lastFlush = now
    }
  }
  // 输出剩余内容
  if (buffer) {
    process.stdout.write(buffer)
  }
  console.log()
}

// 示例7: 取消流式请求
async function demoAbortStream() {
  console.log('\\n=== 取消流式请求 ===')

  const controller = new AbortController()

  // 3 秒后取消
  setTimeout(() => {
    console.log('\\n[取消请求]')
    controller.abort()
  }, 3000)

  try {
    const stream = await chain.stream(
      { scene: '写一篇很长的故事' },
      { signal: controller.signal }
    )

    for await (const chunk of stream) {
      process.stdout.write(chunk)
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('\\n请求已取消')
    } else {
      throw error
    }
  }
}`),
    language: 'typescript',
    principle:
      'LangChain.js 提供三种执行方式：invoke 等待完整响应后返回；stream 逐 token 流式返回，适合实时展示生成过程；astream_events 提供事件级流式输出，包含 run_id、tags 等元数据，适合复杂链路的细粒度监控和调试。',
    flow: [
      'invoke：调用后阻塞等待，一次性返回完整结果。适合短文本或不需要流式展示的场景。',
      'stream：返回异步迭代器，逐 token 输出。适合聊天界面等需要实时展示的场景。',
      'astream_events：返回事件流，包含链开始/结束、LLM 开始/结束、token 输出等事件。适合调试和监控。',
    ],
    notes: [
      'stream 是最常用的流式方式，API 简洁且性能好。',
      'astream_events 的 version 必须指定为 "v2"，v1 已废弃。',
      'invoke 和 stream 都支持 batch 方法（batch/abatch），用于并行处理多个输入。',
      '生产环境推荐 stream + handleLLMNewToken 回调实现流式输出。',
    ],
    problem: '解决"不同场景下如何选择合适的流式输出策略"的问题。',
  },
{
    id: 'L_14',
    title: '评估与测试：输出质量评估',
    navTitle: '评估测试',
    category: '工程实践',
    path: '/langchain/l-14/evaluation',
    summary: '用问答质量评估展示 LLM-as-Judge 评估模式和人工评分对比。',
    demo: L14Evaluation,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: LLM-as-Judge 基础评估
const evaluationPrompt = ChatPromptTemplate.fromTemplate(\`
请评估以下回答的质量，从1-5分打分。

问题: {question}
回答: {answer}

请从以下三个维度评分：
1. 相关性：回答与问题的相关程度
2. 准确性：回答内容的事实准确性
3. 完整性：回答是否完整覆盖了问题

输出格式：
相关性: X分
准确性: X分
完整性: X分
总分: X分
评价: 简短的评价说明
\`)

const evaluationChain = evaluationPrompt.pipe(model).pipe(parser)

async function evaluateAnswer(question: string, answer: string) {
  const result = await evaluationChain.invoke({ question, answer })
  return result
}

// 使用示例
const evalResult = await evaluateAnswer(
  '什么是 RAG？',
  'RAG 是检索增强生成技术，可以提升 LLM 回答的准确性。'
)
console.log('评估结果:\\n', evalResult)

// 示例2: 结构化评估输出（Zod Schema）
import { StructuredOutputParser } from 'langchain/output_parsers'

const evaluationSchema = z.object({
  relevance: z.number().min(1).max(5).describe('相关性评分 1-5'),
  accuracy: z.number().min(1).max(5).describe('准确性评分 1-5'),
  completeness: z.number().min(1).max(5).describe('完整性评分 1-5'),
  totalScore: z.number().describe('总分'),
  feedback: z.string().describe('评价说明'),
})

const structuredParser = StructuredOutputParser.fromZodSchema(evaluationSchema)

const structuredEvalPrompt = ChatPromptTemplate.fromTemplate(\`
请评估以下问答对的质量。

问题: {question}
回答: {answer}
参考答案: {referenceAnswer}

评估维度：
- 相关性：回答与问题的相关程度
- 准确性：回答内容的事实准确性，与参考答案对比
- 完整性：回答是否完整覆盖了问题

{format_instructions}
\`)

const structuredEvalChain = structuredEvalPrompt.pipe(model).pipe(structuredParser)

async function structuredEvaluate(
  question: string,
  answer: string,
  referenceAnswer: string
) {
  return structuredEvalChain.invoke({
    question,
    answer,
    referenceAnswer,
  })
}

const structuredResult = await structuredEvaluate(
  'LangChain 是什么？',
  'LangChain 是一个开发 LLM 应用的框架。',
  'LangChain 是一个用于开发由语言模型驱动的应用程序的框架，支持 Python 和 JavaScript，提供模型调用、提示模板、链式调用、Agent、RAG 等能力。'
)
console.log('\\n结构化评估:', JSON.stringify(structuredResult, null, 2))

// 示例3: 批量评估测试集
interface TestCase {
  question: string
  answer: string
  referenceAnswer: string
  category: string
}

const testCases: TestCase[] = [
  {
    question: '什么是 RAG？',
    answer: 'RAG 是检索增强生成技术。',
    referenceAnswer: 'RAG（检索增强生成）是一种结合检索系统和 LLM 的技术，通过从知识库中检索相关文档作为上下文，提升回答的准确性和时效性。',
    category: '概念理解',
  },
  {
    question: 'LangChain 支持哪些语言？',
    answer: '支持 Python 和 JavaScript。',
    referenceAnswer: 'LangChain 主要支持 Python 和 JavaScript/TypeScript 两种语言，两个版本功能大致对齐。',
    category: '事实知识',
  },
  {
    question: '如何提高 RAG 的检索效果？',
    answer: '优化文档切分策略，调整 chunk size，使用更好的 embedding 模型。',
    referenceAnswer: '可以从以下方面优化：1) 优化文档切分策略和 chunk size；2) 选择高质量的 embedding 模型；3) 使用 MMR 或重排提升多样性和相关性；4) 加入元数据过滤；5) 实现混合检索（向量+关键词）。',
    category: '实践方法',
  },
]

async function evaluateTestCases(testCases: TestCase[]) {
  const results = []
  let totalScore = 0

  for (const testCase of testCases) {
    const evalResult = await structuredEvaluate(
      testCase.question,
      testCase.answer,
      testCase.referenceAnswer
    )
    results.push({ ...testCase, evaluation: evalResult })
    totalScore += evalResult.totalScore
  }

  const avgScore = totalScore / testCases.length
  console.log(\`\\n平均总分: \${avgScore.toFixed(2)}/5\`)
  
  // 按分类统计
  const categoryScores: Record<string, number[]> = {}
  results.forEach(r => {
    if (!categoryScores[r.category]) {
      categoryScores[r.category] = []
    }
    categoryScores[r.category].push(r.evaluation.totalScore)
  })

  console.log('\\n各分类平均分:')
  Object.entries(categoryScores).forEach(([cat, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    console.log(\`  \${cat}: \${avg.toFixed(2)}/5\`)
  })

  return results
}

// 示例4: 对比评估（两个回答哪个更好）
const comparisonPrompt = ChatPromptTemplate.fromTemplate(\`
请对比以下两个回答，判断哪个更好。

问题: {question}
参考答案: {referenceAnswer}

回答A: {answerA}
回答B: {answerB}

请从相关性、准确性、完整性三个方面对比，选择更好的回答。
输出格式：
更好的回答: A 或 B
理由: 说明为什么这个回答更好
\`)

const comparisonChain = comparisonPrompt.pipe(model).pipe(parser)

async function compareAnswers(
  question: string,
  answerA: string,
  answerB: string,
  referenceAnswer: string
) {
  return comparisonChain.invoke({ question, answerA, answerB, referenceAnswer })
}

// 示例5: 自定义评估标准
const customEvalPrompt = ChatPromptTemplate.fromTemplate(\`
请评估以下回答是否符合安全规范。

回答: {answer}

检查项：
1. 是否包含有害内容
2. 是否泄露敏感信息
3. 是否产生误导性信息
4. 是否保持中立客观

输出格式：
是否安全: 是/否
风险点: 列出存在的风险点（如果没有则填"无"）
\`)

const safetyEvalChain = customEvalPrompt.pipe(model).pipe(parser)

async function evaluateSafety(answer: string) {
  return safetyEvalChain.invoke({ answer })
}`),
    language: 'typescript',
    principle:
      'LLM 输出质量评估是生产部署的关键环节。LLM-as-Judge 模式使用另一个 LLM 对输出打分，评估相关性、准确性和完整性等维度。结合人工评分可以校准自动评估的偏差。LangChain 提供了 StringEvaluator 和 QA 评估器等工具。',
    flow: [
      '定义评估维度：相关性、准确性、完整性等。',
      '使用 LLM-as-Judge 自动评分：构造评估提示词，让 LLM 对输出打分。',
      '人工评分校准：对比自动评分和人工评分的差异，调整评估提示词。',
      '持续监控：在生产环境中定期抽样评估，追踪输出质量变化。',
    ],
    notes: [
      'LLM-as-Judge 的评估提示词需要精心设计，避免评估 LLM 的偏见。',
      '评估维度应根据业务场景定制，不同应用关注点不同。',
      '人工评分是校准自动评估的金标准，至少抽样 50-100 条。',
      'LangSmith 提供了内置的评估和追踪功能，推荐在生产环境使用。',
    ],
    problem: '解决"LLM 输出质量如何客观评估，以及如何持续监控"的问题。',
  },
{
    id: 'L_15', title: '结构化输出与 Zod Schema', navTitle: '结构化输出', category: '输出控制',
    path: '/langchain/l-15/structured-output', summary: '用 Zod Schema 约束 LLM 输出为结构化数据，对比 JSON Mode 和函数调用。',
    demo: L15StructuredOutput,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: withStructuredOutput - 函数调用方式（推荐）
const userSchema = z.object({
  name: z.string().describe('用户姓名'),
  age: z.number().describe('用户年龄'),
  email: z.string().describe('用户邮箱'),
  interests: z.array(z.string()).describe('兴趣爱好列表'),
})

const modelWithStructuredOutput = model.withStructuredOutput(userSchema, {
  name: 'extract_user_info',
})

const result1 = await modelWithStructuredOutput.invoke([
  ['human', '提取用户信息：张三，25岁，邮箱 zhangsan@example.com，喜欢编程、阅读、打篮球'],
])
console.log('函数调用方式:', JSON.stringify(result1, null, 2))

// 示例2: JSON Mode 方式
const jsonModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  modelKwargs: { response_format: { type: 'json_object' } },
})

const jsonPrompt = ChatPromptTemplate.fromTemplate(\`
请以 JSON 格式返回以下信息。

用户描述: {userDescription}

JSON 格式要求：
{{
  "name": "姓名",
  "age": 年龄数字,
  "email": "邮箱",
  "interests": ["兴趣1", "兴趣2"]
}}
\`)

const jsonChain = jsonPrompt.pipe(jsonModel).pipe(async (msg) => {
  return JSON.parse(msg.content as string)
})

const result2 = await jsonChain.invoke({
  userDescription: '李四，30岁，lisi@test.com，喜欢旅游和摄影',
})
console.log('JSON Mode:', JSON.stringify(result2, null, 2))

// 示例3: StructuredOutputParser 方式
const parser = StructuredOutputParser.fromZodSchema(userSchema)

const prompt = ChatPromptTemplate.fromTemplate(\`
提取用户信息。

用户描述: {userDescription}

{format_instructions}
\`)

const chain = prompt.pipe(model).pipe(parser)

const result3 = await chain.invoke({
  userDescription: '王五，28岁，wangwu@example.com，喜欢音乐、电影、健身',
})
console.log('StructuredOutputParser:', JSON.stringify(result3, null, 2))

// 示例4: 嵌套结构
const addressSchema = z.object({
  city: z.string().describe('城市'),
  district: z.string().describe('区'),
  street: z.string().describe('街道地址'),
})

const personSchema = z.object({
  name: z.string().describe('姓名'),
  age: z.number().describe('年龄'),
  address: addressSchema.describe('地址信息'),
  phoneNumbers: z.array(z.string()).describe('电话号码列表'),
})

const modelWithPerson = model.withStructuredOutput(personSchema)

const result4 = await modelWithPerson.invoke([
  ['human', '赵六，35岁，住在北京市朝阳区建国路88号，电话：13800138000 和 010-12345678'],
])
console.log('嵌套结构:', JSON.stringify(result4, null, 2))

// 示例5: 数组输出
const productSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().describe('产品ID'),
      name: z.string().describe('产品名称'),
      price: z.number().describe('价格'),
      category: z.string().describe('分类'),
    })
  ).describe('产品列表'),
})

const modelWithProducts = model.withStructuredOutput(productSchema)

const result5 = await modelWithProducts.invoke([
  ['human', '列出3款常见电子产品及其价格'],
])
console.log('数组输出:')
result5.products.forEach((p: any) => {
  console.log(\`  - \${p.name}: ¥\${p.price}\`)
})

// 示例6: 枚举类型
const ticketSchema = z.object({
  title: z.string().describe('工单标题'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).describe('优先级'),
  category: z.enum(['bug', 'feature', 'question', 'other']).describe('分类'),
  description: z.string().describe('问题描述'),
})

const modelWithTicket = model.withStructuredOutput(ticketSchema)

const result6 = await modelWithTicket.invoke([
  ['human', '创建一个工单：用户无法登录系统，账号密码正确但总是提示错误，这个问题很紧急'],
])
console.log('工单分类:', result6.category)
console.log('工单优先级:', result6.priority)

// 示例7: 可选字段和默认值
const articleSchema = z.object({
  title: z.string().describe('文章标题'),
  author: z.string().optional().describe('作者（可选）'),
  tags: z.array(z.string()).default([]).describe('标签列表'),
  published: z.boolean().describe('是否已发布'),
})

const modelWithArticle = model.withStructuredOutput(articleSchema)

const result7 = await modelWithArticle.invoke([
  ['human', '写一篇关于 TypeScript 的文章，已发布，标签有编程、前端'],
])
console.log('文章结构:', JSON.stringify(result7, null, 2))`),
    language: 'typescript',
    principle: '结构化输出通过 Schema 定义强制 LLM 返回指定格式的数据；JSON Mode 适合简单结构，函数调用（withStructuredOutput）提供更可靠的格式保证和校验。',
    flow: ['用 Zod 定义输出数据的 Schema。', '选择 JSON Mode 或函数调用模式。', '验证并解析返回的结构化结果。'],
    notes: ['函数调用模式的格式可靠性高于 JSON Mode。', 'Zod Schema 同时提供运行时校验和类型推导。'],
    problem: '解决"如何让 LLM 稳定返回可解析的结构化数据而非自由文本"的问题。',
  },
{
    id: 'L_16', title: 'LangGraph 多智能体编排', navTitle: 'LangGraph', category: '智能体',
    path: '/langchain/l-16/langgraph', summary: '用状态图编排课程推荐智能体，掌握节点、边和条件路由。',
    demo: L16LangGraph,
    code: () => Promise.resolve(`import { StateGraph, START, END } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: 定义状态接口
interface GraphState {
  topic: string
  difficulty: string
  outline: string
  content: string
  summary: string
  needsReview: boolean
}

// 示例2: 定义节点函数
async function outlineNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '为"{topic}"生成一份课程大纲，难度{difficulty}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const outline = await chain.invoke({ topic: state.topic, difficulty: state.difficulty })
  return { outline }
}

async function contentNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '根据大纲展开详细内容:\\n\\n{outline}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const content = await chain.invoke({ outline: state.outline })
  return { content }
}

async function summaryNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '为以下课程内容写一份100字摘要:\\n\\n{content}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const summary = await chain.invoke({ content: state.content })
  return { summary, needsReview: false }
}

async function reviewNode(state: GraphState): Promise<Partial<GraphState>> {
  // 模拟审核逻辑
  const needsReview = state.content.length < 500
  return { needsReview }
}

// 示例3: 定义条件路由
function routeAfterReview(state: GraphState): 'summary' | 'content' {
  if (state.needsReview) {
    return 'content' // 需要重写内容
  }
  return 'summary' // 直接生成摘要
}

// 示例4: 构建状态图
const graph = new StateGraph<GraphState>({
  channels: {
    topic: null,
    difficulty: null,
    outline: null,
    content: null,
    summary: null,
    needsReview: null,
  } as any,
})

// 添加节点
graph.addNode('outline', outlineNode)
graph.addNode('content', contentNode)
graph.addNode('review', reviewNode)
graph.addNode('summary', summaryNode)

// 添加边
graph.addEdge(START, 'outline')
graph.addEdge('outline', 'content')
graph.addEdge('content', 'review')

// 条件边
graph.addConditionalEdges('review', routeAfterReview, {
  content: 'content',
  summary: 'summary',
})

graph.addEdge('summary', END)

// 编译图
const app = graph.compile()

// 示例5: 执行图
const initialState: GraphState = {
  topic: 'LangChain.js 入门',
  difficulty: '入门级',
  outline: '',
  content: '',
  summary: '',
  needsReview: false,
}

const result = await app.invoke(initialState)
console.log('课程摘要:', result.summary)

// 示例6: 流式输出图执行过程
const stream = await app.stream(initialState)

console.log('\\n=== 图执行过程 ===')
for await (const step of stream) {
  const nodeName = Object.keys(step)[0]
  console.log(\`[节点执行] \${nodeName}\`)
  if (step[nodeName]) {
    const keys = Object.keys(step[nodeName])
    console.log(\`  更新字段: \${keys.join(', ')}\`)
  }
}

// 示例7: 带记忆的对话 Agent 图
interface AgentState {
  messages: (HumanMessage | AIMessage)[]
}

async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
  const response = await model.invoke(state.messages)
  return {
    messages: [response],
  }
}

const agentGraph = new StateGraph<AgentState>({
  channels: {
    messages: {
      default: () => [],
      reducer: (x, y) => x.concat(y),
    },
  } as any,
})

agentGraph.addNode('agent', agentNode)
agentGraph.addEdge(START, 'agent')
agentGraph.addEdge('agent', END)

const agentApp = agentGraph.compile()

const agentResult = await agentApp.invoke({
  messages: [new HumanMessage('你好，请介绍一下 LangGraph')],
})
console.log('\\nAgent 回答:', agentResult.messages.at(-1)?.content)

// 示例8: 检查点（Checkpoint）- 支持暂停和恢复
// import { MemorySaver } from '@langchain/langgraph'
//
// const memorySaver = new MemorySaver()
// const appWithCheckpoint = graph.compile({ checkpointer: memorySaver })
//
// // 第一次执行
// const config = { configurable: { thread_id: '123' } }
// await appWithCheckpoint.invoke(initialState, config)
//
// // 从检查点恢复
// const checkpoint = await memorySaver.get(config)
// console.log('检查点状态:', checkpoint)`),
    language: 'typescript',
    principle: 'LangGraph 把智能体工作流建模为有向图：节点执行计算，边定义转移，条件边根据状态动态路由；状态在节点间共享并支持检查点和回溯。',
    flow: ['定义状态接口和节点函数。', '用条件边连接节点形成工作流。', '编译图并传入初始状态执行。'],
    notes: ['LangGraph 支持检查点，可暂停和恢复执行。', '条件边使工作流能根据中间结果动态分支。'],
    problem: '解决"如何把复杂智能体工作流建模为可控、可调试的状态图"的问题。',
  },
{
    id: 'L_17', title: '向量存储与检索策略', navTitle: '向量存储', category: 'RAG',
    path: '/langchain/l-17/vector-store', summary: '比较 Chroma、FAISS、Pinecone 和 pgvector 的适用场景与检索策略。',
    demo: L17VectorStore,
    code: () => Promise.resolve(`import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })

// 示例1: MemoryVectorStore - 内存向量存储（开发/测试用）
const documents = [
  new Document({
    pageContent: 'LangChain 是一个用于开发 LLM 应用的开源框架。',
    metadata: { source: 'doc1', category: '框架' },
  }),
  new Document({
    pageContent: 'Chroma 是一个轻量级的向量数据库，适合本地开发和原型验证。',
    metadata: { source: 'doc2', category: '向量数据库' },
  }),
  new Document({
    pageContent: 'Pinecone 是托管式向量数据库，支持大规模扩展和高并发查询。',
    metadata: { source: 'doc3', category: '向量数据库' },
  }),
  new Document({
    pageContent: 'FAISS 是 Facebook 开发的向量相似度搜索库，性能优秀。',
    metadata: { source: 'doc4', category: '向量数据库' },
  }),
  new Document({
    pageContent: 'pgvector 是 PostgreSQL 的向量扩展，可以在关系数据库中存储和查询向量。',
    metadata: { source: 'doc5', category: '向量数据库' },
  }),
]

const memoryVectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings
)

// 基础相似度搜索
const results1 = await memoryVectorStore.similaritySearch('什么是向量数据库？', 3)
console.log('MemoryVectorStore 检索结果:')
results1.forEach((doc, i) => {
  console.log(\`  \${i + 1}. \${doc.pageContent.slice(0, 50)}...\`)
})

// 示例2: 相似度搜索带分数
const resultsWithScore = await memoryVectorStore.similaritySearchWithScore(
  'LangChain 是什么？',
  2
)
console.log('\\n带分数检索:')
resultsWithScore.forEach(([doc, score], i) => {
  console.log(\`  \${i + 1}. 相似度: \${score.toFixed(4)} - \${doc.pageContent.slice(0, 40)}...\`)
})

// 示例3: MMR 检索 - 最大边际相关性
const mmrResults = await memoryVectorStore.maxMarginalRelevanceSearch(
  '向量数据库有哪些？',
  {
    k: 3,
    fetchK: 10,
    lambda: 0.5, // 0=最大多样性, 1=最大相关性
  }
)
console.log('\\nMMR 结果数量:', mmrResults.length)

// 示例4: 元数据过滤
const filteredResults = await memoryVectorStore.similaritySearch(
  '数据库',
  10,
  { category: '向量数据库' }
)
console.log('\\n过滤后结果数:', filteredResults.length)

// 示例5: 使用 Retriever 接口
const retriever = memoryVectorStore.asRetriever({
  k: 2,
  searchType: 'similarity', // 'similarity' | 'mmr'
  // filter: { category: '框架' }, // 可选过滤
})

const retrieverResults = await retriever.invoke('什么是 LangChain？')
console.log('\\nRetriever 结果数:', retrieverResults.length)

// 示例6: 添加新文档
const newDoc = new Document({
  pageContent: 'Weaviate 是一个开源向量数据库，支持混合检索和 GraphQL 查询。',
  metadata: { source: 'doc6', category: '向量数据库' },
})
await memoryVectorStore.addDocuments([newDoc])
console.log('\\n添加新文档后总数:', (await memoryVectorStore.similaritySearch('', 100)).length)

// 示例7: Chroma 向量数据库（需要安装 chromadb）
// import { Chroma } from '@langchain/community/vectorstores/chroma'
//
// const chromaStore = await Chroma.fromDocuments(
//   documents,
//   embeddings,
//   {
//     collectionName: 'my_collection',
//     url: 'http://localhost:8000', // Chroma 服务地址
//   }
// )
// const chromaResults = await chromaStore.similaritySearch('查询', 3)

// 示例8: FAISS 向量数据库（需要安装 faiss-node）
// import { FAISS } from '@langchain/community/vectorstores/faiss'
//
// const faissStore = await FAISS.fromDocuments(documents, embeddings)
// // 保存到本地
// await faissStore.save('./faiss-index')
// // 从本地加载
// const loadedFaissStore = await FAISS.load('./faiss-index', embeddings)

// 示例9: 完整 RAG 检索链
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })

const ragPrompt = ChatPromptTemplate.fromTemplate(\`
根据以下上下文回答问题。如果上下文没有答案，请说"我不知道"。

上下文:
{context}

问题: {question}

回答:
\`)

function formatContext(docs: Document[]) {
  return docs.map((doc, i) => \`[\${i + 1}] \${doc.pageContent}\`).join('\\n\\n')
}

const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatContext),
    question: new RunnablePassthrough(),
  },
  ragPrompt,
  model,
  new StringOutputParser(),
])

const answer = await ragChain.invoke('Pinecone 是什么？')
console.log('\\nRAG 回答:', answer)`),
    language: 'typescript',
    principle: '向量存储把文本嵌入为高维向量并按相似度检索；不同后端在规模、延迟、混合搜索和部署复杂度上各有取舍，检索策略需结合关键词和语义。',
    flow: ['选择合适的向量数据库。', '配置嵌入模型和相似度度量。', '结合关键词过滤实现混合检索。'],
    notes: ['小规模实验用 Chroma/FAISS，生产环境考虑 Pinecone/pgvector。', '混合检索（向量+关键词）通常比纯向量效果更好。'],
    problem: '解决"如何选择合适的向量存储并设计高效的 RAG 检索策略"的问题。',
  },
{
    id: 'L_18', title: '部署优化与语义缓存', navTitle: '部署优化', category: '工程实践',
    path: '/langchain/l-18/deploy', summary: '掌握 LLM 应用的缓存、流式输出、Token 预算和成本控制策略。',
    demo: L18Deploy,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: 简单内存缓存
const cache = new Map<string, string>()

async function getAnswerWithCache(question: string): Promise<string> {
  if (cache.has(question)) {
    console.log('缓存命中!')
    return cache.get(question)!
  }
  
  const prompt = ChatPromptTemplate.fromTemplate('回答问题: {question}')
  const chain = prompt.pipe(model).pipe(parser)
  const answer = await chain.invoke({ question })
  
  cache.set(question, answer)
  return answer
}

// 使用示例
console.log('第一次调用（无缓存）:')
const answer1 = await getAnswerWithCache('什么是 LLM？')
console.log(answer1.slice(0, 50) + '...')

console.log('\\n第二次调用（命中缓存）:')
const answer2 = await getAnswerWithCache('什么是 LLM？')
console.log(answer2.slice(0, 50) + '...')

// 示例2: 语义缓存 - 基于向量相似度
const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
const semanticCacheStore = await MemoryVectorStore.fromDocuments([], embeddings)
const semanticCache = new Map<string, string>() // id -> answer

async function getAnswerWithSemanticCache(
  question: string,
  threshold: number = 0.9
): Promise<{ answer: string; fromCache: boolean }> {
  // 先搜索是否有相似问题
  const results = await semanticCacheStore.similaritySearchWithScore(question, 1)
  
  if (results.length > 0 && results[0][1] >= threshold) {
    const cachedDoc = results[0][0]
    const cacheKey = cachedDoc.metadata.cacheKey as string
    console.log(\`语义缓存命中! (相似度: \${results[0][1].toFixed(4)})\`)
    return { answer: semanticCache.get(cacheKey)!, fromCache: true }
  }
  
  // 没有命中，生成答案
  const prompt = ChatPromptTemplate.fromTemplate('回答问题: {question}')
  const chain = prompt.pipe(model).pipe(parser)
  const answer = await chain.invoke({ question })
  
  // 存入语义缓存
  const cacheKey = \`cache_\${Date.now()}\`
  semanticCache.set(cacheKey, answer)
  await semanticCacheStore.addDocuments([
    new Document({
      pageContent: question,
      metadata: { cacheKey },
    }),
  ])
  
  return { answer, fromCache: false }
}

// 示例3: Token 预算控制
class TokenBudgetManager {
  private budget: number
  private used: number = 0
  private resetInterval: number
  private lastReset: number

  constructor(budget: number, resetIntervalMs: number = 3600000) {
    this.budget = budget
    this.resetInterval = resetIntervalMs
    this.lastReset = Date.now()
  }

  private checkReset() {
    if (Date.now() - this.lastReset > this.resetInterval) {
      this.used = 0
      this.lastReset = Date.now()
    }
  }

  canAfford(tokens: number): boolean {
    this.checkReset()
    return this.used + tokens <= this.budget
  }

  consume(tokens: number): boolean {
    this.checkReset()
    if (this.used + tokens > this.budget) {
      return false
    }
    this.used += tokens
    return true
  }

  getUsage(): { used: number; budget: number; remaining: number } {
    this.checkReset()
    return {
      used: this.used,
      budget: this.budget,
      remaining: this.budget - this.used,
    }
  }
}

// 使用 Token 预算
const budgetManager = new TokenBudgetManager(100000) // 每小时 100k token
console.log('Token 使用情况:', budgetManager.getUsage())

// 示例4: 指数退避重试
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error
      
      // 只有限流错误才重试
      if (error.status !== 429 && error.code !== 'rate_limit_exceeded') {
        throw error
      }
      
      const delay = baseDelay * Math.pow(2, i)
      console.log(\`限流，\${delay}ms 后重试 (\${i + 1}/\${maxRetries})\`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// 使用重试
// const result = await retryWithBackoff(() => 
//   model.invoke('你好')
// )

// 示例5: 降级策略
async function getAnswerWithFallback(question: string): Promise<string> {
  const prompt = ChatPromptTemplate.fromTemplate('回答问题: {question}')
  const advancedChain = prompt.pipe(new ChatOpenAI({ model: 'gpt-4o' })).pipe(parser)
  const basicChain = prompt.pipe(new ChatOpenAI({ model: 'gpt-4o-mini' })).pipe(parser)
  
  try {
    // 先尝试高级模型
    return await advancedChain.invoke({ question })
  } catch (error) {
    console.log('高级模型失败，降级到基础模型')
    // 降级到基础模型
    return await basicChain.invoke({ question })
  }
}

// 示例6: 请求超时控制
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

// 使用超时
try {
  const result = await withTimeout(
    model.invoke('写一篇长文'),
    10000 // 10秒超时
  )
} catch (error: any) {
  console.log('超时处理:', error.message)
}

// 示例7: 成本估算
function estimateCost(
  promptTokens: number,
  completionTokens: number,
  model: string = 'gpt-4o-mini'
): number {
  const prices: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  }
  
  const price = prices[model] || prices['gpt-4o-mini']
  const inputCost = (promptTokens / 1000) * price.input
  const outputCost = (completionTokens / 1000) * price.output
  
  return inputCost + outputCost
}

// 估算成本示例
const cost = estimateCost(1000, 500, 'gpt-4o-mini')
console.log(\`估算成本: $ \${cost.toFixed(6)}\`)`),
    language: 'typescript',
    principle: 'LLM 应用部署需要关注延迟（语义缓存、流式输出）、成本（Token 预算、模型选择）和可靠性（重试、降级），优化策略直接影响用户体验和运营成本。',
    flow: ['实现语义缓存减少重复调用。', '使用 SSE 流式输出降低感知延迟。', '设置 Token 预算和成本监控。'],
    notes: ['语义缓存的相似度阈值需要调优。', '流式输出需要前端配合逐块渲染。'],
    problem: '解决"LLM 应用如何优化延迟、控制成本并保证生产可靠性"的问题。',
  },
{
    id: 'L_19', title: 'RAG 完整流水线实现', navTitle: 'RAG 流水线', category: 'RAG',
    path: '/langchain/l-19/rag-pipeline', summary: '端到端实现文档加载、切分、向量化、存储、检索、重排、生成的完整 RAG 流水线。',
    demo: L19RagPipeline,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

// 示例1: 完整 RAG 流水线类
class RAGPipeline {
  private vectorStore: MemoryVectorStore | null = null
  private embeddings: OpenAIEmbeddings
  private model: ChatOpenAI
  private textSplitter: RecursiveCharacterTextSplitter

  constructor() {
    this.embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
    this.model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
      separators: ['\\n\\n', '\\n', '。', '！', '？', '，', ' ', ''],
    })
  }

  // 第一步：文档加载
  async loadDocuments(texts: string[], metadatas: Record<string, any>[] = []): Promise<Document[]> {
    const docs = texts.map((text, i) => 
      new Document({
        pageContent: text,
        metadata: metadatas[i] || { id: i },
      })
    )
    console.log(\`加载了 \${docs.length} 个文档\`)
    return docs
  }

  // 第二步：文本切分
  async splitDocuments(docs: Document[]): Promise<Document[]> {
    const splitDocs = await this.textSplitter.splitDocuments(docs)
    console.log(\`切分为 \${splitDocs.length} 个块\`)
    return splitDocs
  }

  // 第三步：向量化并存储
  async indexDocuments(docs: Document[]): Promise<void> {
    this.vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      this.embeddings
    )
    console.log('文档已索引到向量存储')
  }

  // 第四步：检索
  async retrieve(query: string, k: number = 4): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('向量存储未初始化')
    }
    const docs = await this.vectorStore.similaritySearch(query, k)
    console.log(\`检索到 \${docs.length} 个相关文档\`)
    return docs
  }

  // 第五步：重排（简单实现：基于相关性分数重新排序）
  async rerank(query: string, docs: Document[]): Promise<Document[]> {
    // 实际项目中可使用 Cohere Rerank 或交叉编码器
    // 这里简单返回原顺序作为示例
    console.log(\`重排 \${docs.length} 个文档\`)
    return docs
  }

  // 第六步：生成回答
  async generate(query: string, docs: Document[]): Promise<string> {
    const context = docs
      .map((doc, i) => \`[文档\${i + 1}] \${doc.pageContent}\`)
      .join('\\n\\n')

    const prompt = ChatPromptTemplate.fromTemplate(\`
你是一个专业的问答助手。请根据以下上下文回答用户的问题。
如果上下文中没有答案，请诚实地说"根据现有资料无法回答这个问题"。

上下文：
{context}

用户问题：{question}

回答：
\`)

    const chain = prompt.pipe(this.model).pipe(new StringOutputParser())
    const answer = await chain.invoke({
      context,
      question: query,
    })
    return answer
  }

  // 端到端查询
  async query(question: string): Promise<{
    answer: string
    retrievedDocs: Document[]
  }> {
    // 1. 检索
    const retrievedDocs = await this.retrieve(question)
    
    // 2. 重排
    const rerankedDocs = await this.rerank(question, retrievedDocs)
    
    // 3. 生成
    const answer = await this.generate(question, rerankedDocs)
    
    return { answer, retrievedDocs: rerankedDocs }
  }

  // 批量索引
  async buildIndex(texts: string[], metadatas: Record<string, any>[] = []): Promise<void> {
    const docs = await this.loadDocuments(texts, metadatas)
    const splitDocs = await this.splitDocuments(docs)
    await this.indexDocuments(splitDocs)
  }
}

// 示例2: 使用 RAG 流水线
async function demoRAGPipeline() {
  const rag = new RAGPipeline()

  // 准备知识库
  const knowledgeBase = [
    \`
LangChain 是一个用于开发由语言模型驱动的应用程序的框架。
它提供了以下核心能力：
1. 模型抽象：统一的接口调用各种 LLM
2. 提示模板：管理和优化提示词
3. 链式调用：组合多个处理步骤
4. 记忆系统：维护对话历史
5. 检索增强：RAG 支持
6. 代理系统：自主决策 Agent

LangChain 支持 Python 和 JavaScript/TypeScript 两种主要语言版本。
    \`,
    \`
RAG（检索增强生成）是一种结合检索系统和大型语言模型的技术架构。
RAG 的主要优势：
1. 解决知识过时问题：可以检索最新信息
2. 减少幻觉：基于真实文档生成回答
3. 可解释性：可以追溯答案来源
4. 成本效益：比微调更经济

RAG 典型流程：
文档加载 → 文本切分 → 向量化 → 存储 → 检索 → 生成
    \`,
    \`
向量数据库是专门用于存储和查询高维向量的数据库系统。
常见的向量数据库：
1. Chroma：轻量级，适合开发和原型
2. Pinecone：托管式，大规模生产级
3. Weaviate：开源，功能丰富
4. FAISS：Facebook 开源库，性能优秀
5. pgvector：PostgreSQL 扩展

选择因素：规模、性能要求、部署方式、成本
    \`,
    \`
Agent 是能够自主感知环境、做出决策并执行行动的智能系统。
ReAct 模式是最流行的 Agent 实现方式：
- Thought（思考）：分析当前状态
- Action（行动）：选择并执行工具
- Observation（观察）：获取行动结果

循环以上步骤直到任务完成或达到最大迭代次数。
    \`,
  ]

  const metadatas = [
    { topic: 'LangChain 基础', source: 'doc1' },
    { topic: 'RAG 原理', source: 'doc2' },
    { topic: '向量数据库', source: 'doc3' },
    { topic: 'Agent 原理', source: 'doc4' },
  ]

  // 构建索引
  await rag.buildIndex(knowledgeBase, metadatas)

  // 查询测试
  const questions = [
    '什么是 RAG？它有什么优势？',
    '向量数据库有哪些常见选择？',
    'LangChain 支持哪些语言？',
    'ReAct 模式的工作原理是什么？',
  ]

  for (const question of questions) {
    console.log(\`\\n=== 问题: \${question} ===\`)
    const result = await rag.query(question)
    console.log('回答:', result.answer)
    console.log('引用文档数:', result.retrievedDocs.length)
  }
}

// 示例3: 带源引用的 RAG
class RAGWithSources extends RAGPipeline {
  async queryWithSources(question: string): Promise<{
    answer: string
    sources: string[]
  }> {
    const { answer, retrievedDocs } = await this.query(question)
    
    const sources = retrievedDocs.map(doc => 
      doc.metadata.source || doc.metadata.topic || '未知来源'
    )
    
    return { answer, sources }
  }
}

// 运行示例
// await demoRAGPipeline()`),
    language: 'typescript',
    principle: 'RAG（检索增强生成）完整流水线包括文档加载、切分、向量化、存储、检索、重排、生成七个环节，每个环节的质量都会影响最终回答效果，需要端到端优化。',
    flow: ['文档加载和清洗，去除无效内容', '按语义切分文档块，控制大小和重叠', '向量化后存入向量数据库', '用户提问时检索相关文档，重排后送给 LLM 生成回答'],
    notes: ['文档切分策略对检索质量影响很大', '检索结果不是越多越好，要精准', '加入重排（rerank）可以显著提升相关性'],
    problem: '解决 LLM 知识过时、无法访问私有数据、回答不准确的问题。',
  },
{
    id: 'L_20', title: '多模态模型与视觉理解', navTitle: '多模态', category: '模型能力',
    path: '/langchain/l-20/multi-modal', summary: '使用多模态模型同时理解文本和图像，实现图像描述、图表分析、OCR 等视觉任务。',
    demo: L20MultiModal,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: 基础图像理解 - URL 方式
async function describeImageUrl(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的图像描述助手，请用中文详细描述图片内容。'),
    new HumanMessage({
      content: [
        { type: 'text', text: '请描述这张图片' },
        {
          type: 'image_url',
          image_url: { url: imageUrl },
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 使用示例
// const description = await describeImageUrl('https://example.com/image.jpg')
// console.log(description)

// 示例2: Base64 编码图像
import * as fs from 'fs'
import * as path from 'path'

function imageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath)
  const base64 = imageBuffer.toString('base64')
  const ext = path.extname(imagePath).slice(1)
  return \`data:image/\${ext};base64,\${base64}\`
}

async function describeLocalImage(imagePath: string): Promise<string> {
  const base64Image = imageToBase64(imagePath)
  
  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: '请详细描述这张图片的内容' },
        {
          type: 'image_url',
          image_url: { url: base64Image },
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例3: 图像问答（VQA）
async function askAboutImage(imageUrl: string, question: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的视觉问答助手，请根据图片内容回答问题。'),
    new HumanMessage({
      content: [
        { type: 'text', text: question },
        {
          type: 'image_url',
          image_url: { url: imageUrl, detail: 'high' }, // low/auto/high
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 使用示例
// const answer = await askAboutImage(
//   'https://example.com/chart.png',
//   '这张图表显示了什么趋势？'
// )

// 示例4: 多图对比
async function compareImages(imageUrl1: string, imageUrl2: string): Promise<string> {
  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: '请对比这两张图片，描述它们的主要区别' },
        { type: 'image_url', image_url: { url: imageUrl1 } },
        { type: 'image_url', image_url: { url: imageUrl2 } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例5: 图表分析
async function analyzeChart(imageUrl: string): Promise<string> {
  const prompt = \`
请分析这张图表：
1. 这是什么类型的图表？
2. 图表显示的主要数据是什么？
3. 有什么明显的趋势或规律？
4. 最高值和最低值分别是多少？
5. 请总结图表的核心信息
\`

  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例6: OCR - 文字识别
async function extractTextFromImage(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个 OCR 助手，请准确提取图片中的所有文字。保持原格式。'),
    new HumanMessage({
      content: [
        { type: 'text', text: '请提取这张图片中的所有文字' },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例7: 结构化图像理解 + Zod
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'

const imageAnalysisSchema = z.object({
  imageType: z.string().describe('图片类型，如风景、人物、图表、产品等'),
  mainSubject: z.string().describe('图片主要内容描述'),
  colors: z.array(z.string()).describe('主要颜色列表'),
  objects: z.array(z.string()).describe('识别到的主要物体'),
  quality: z.enum(['high', 'medium', 'low']).describe('图片质量'),
  textContent: z.string().describe('图片中的文字内容，如果没有则填"无"'),
})

async function structuredImageAnalysis(imageUrl: string): Promise<any> {
  const parser = StructuredOutputParser.fromZodSchema(imageAnalysisSchema)
  const formatInstructions = parser.getFormatInstructions()

  const messages = [
    new HumanMessage({
      content: [
        {
          type: 'text',
          text: \`请分析这张图片。\\n\\n\${formatInstructions}\`,
        },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return parser.parse(response.content as string)
}

// 示例8: 多模态链式调用
const multimodalPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个专业的产品分析助手。'],
  [
    'human',
    [
      { type: 'text', text: '请分析这张产品图片，生成一份简短的产品描述' },
      { type: 'image_url', image_url: '{image_url}' },
    ],
  ],
])

// 注意：多模态模板需要特殊处理，直接用消息数组更直观
async function analyzeProduct(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的产品文案撰写助手。'),
    new HumanMessage({
      content: [
        {
          type: 'text',
          text: '请根据产品图片，生成一段吸引人的产品营销文案，100字左右',
        },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}`),
    language: 'typescript',
    principle: '多模态模型可以同时理解文本和图像，LangChain 通过 ChatMessage 中的 image_url 内容类型支持视觉理解，适合图像描述、图表分析、OCR 等场景。',
    flow: ['使用支持多模态的模型（如 GPT-4V、Claude 3）', '构建包含 text 和 image_url 的消息内容', '模型理解图像后返回文本描述或分析结果'],
    notes: ['图像可以是 URL 或 base64 编码', '图像清晰度和提示词质量影响理解效果', '适合截图分析、图表解读、照片描述等场景'],
    problem: '解决传统 LLM 只能处理文本、无法理解视觉信息的问题。',
  },
{
    id: 'L_21', title: '函数调用与工具扩展', navTitle: '函数调用', category: '工具与代理',
    path: '/langchain/l-21/function-calling', summary: '通过 Function Calling 让 LLM 调用外部工具，扩展实时数据获取和操作执行能力。',
    demo: L21FunctionCalling,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { HumanMessage, AIMessage, ToolMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: 定义工具函数
const getWeatherTool = tool(
  async ({ city, unit }) => {
    const mockData: Record<string, { temp: number; condition: string }> = {
      '北京': { temp: 25, condition: '晴' },
      '上海': { temp: 28, condition: '多云' },
      '广州': { temp: 32, condition: '雷阵雨' },
      '深圳': { temp: 30, condition: '晴' },
    }
    
    const data = mockData[city] || { temp: 20, condition: '未知' }
    const temp = unit === 'fahrenheit' ? (data.temp * 9 / 5) + 32 : data.temp
    
    return JSON.stringify({
      city,
      temperature: temp,
      unit: unit || 'celsius',
      condition: data.condition,
      humidity: 65,
      windSpeed: 10,
    })
  },
  {
    name: 'get_current_weather',
    description: '获取指定城市的当前天气信息。查询天气时使用此工具。',
    schema: z.object({
      city: z.string().describe('城市名称，例如：北京、上海、深圳'),
      unit: z.enum(['celsius', 'fahrenheit']).optional().describe('温度单位，默认摄氏度'),
    }),
  }
)

// 示例2: 定义多个工具
const searchTool = tool(
  async ({ query, numResults }) => {
    const mockResults = [
      { title: \`\${query} - 百度百科\`, snippet: \`这是关于\${query}的百科介绍...\` },
      { title: \`\${query}最新动态\`, snippet: \`\${query}的最新消息和动态...\` },
      { title: \`\${query}使用教程\`, snippet: \`详细的\${query}使用指南...\` },
    ]
    return JSON.stringify(mockResults.slice(0, numResults || 3))
  },
  {
    name: 'web_search',
    description: '搜索网络获取最新信息。当你需要实时信息、最新动态或不了解的知识时使用。',
    schema: z.object({
      query: z.string().describe('搜索关键词'),
      numResults: z.number().optional().describe('返回结果数量，默认3'),
    }),
  }
)

const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = eval(expression)
      return JSON.stringify({ expression, result })
    } catch (e) {
      return JSON.stringify({ error: '计算错误，请检查表达式' })
    }
  },
  {
    name: 'calculator',
    description: '执行数学计算。当需要进行数学运算时使用此工具。',
    schema: z.object({
      expression: z.string().describe('数学表达式，例如 "2 + 3 * 4"'),
    }),
  }
)

const tools = [getWeatherTool, searchTool, calculatorTool]

// 示例3: 单次工具调用流程
async function singleToolCallExample() {
  console.log('=== 单次工具调用 ===')
  
  // 第一步：用户提问
  const messages = [
    new HumanMessage('北京今天天气怎么样？'),
  ]
  
  // 第二步：模型决定是否调用工具
  const modelWithTools = model.bindTools(tools)
  const response = await modelWithTools.invoke(messages)
  
  console.log('模型响应:', response.content)
  console.log('工具调用:', response.tool_calls)
  
  // 第三步：执行工具
  if (response.tool_calls && response.tool_calls.length > 0) {
    messages.push(response) // 添加 AI 消息
    
    for (const toolCall of response.tool_calls) {
      const toolInstance = tools.find(t => t.name === toolCall.name)
      if (toolInstance) {
        const toolResult = await toolInstance.invoke(toolCall.args)
        messages.push(new ToolMessage({
          tool_call_id: toolCall.id,
          content: toolResult,
        }))
        console.log('工具结果:', toolResult)
      }
    }
    
    // 第四步：模型根据工具结果生成最终回答
    const finalResponse = await modelWithTools.invoke(messages)
    console.log('最终回答:', finalResponse.content)
  }
}

// 示例4: 多轮工具调用
async function multiToolCallExample() {
  console.log('\\n=== 多轮工具调用 ===')
  
  const modelWithTools = model.bindTools(tools)
  const messages: any[] = [
    new HumanMessage('北京的天气怎么样？那里的气温换算成华氏度是多少？'),
  ]
  
  let iteration = 0
  const maxIterations = 5
  
  while (iteration < maxIterations) {
    iteration++
    console.log(\`\\n--- 第 \${iteration} 轮 ---\`)
    
    const response = await modelWithTools.invoke(messages)
    messages.push(response)
    
    // 如果没有工具调用，说明任务完成
    if (!response.tool_calls || response.tool_calls.length === 0) {
      console.log('最终回答:', response.content)
      break
    }
    
    console.log('工具调用:', response.tool_calls.map((tc: any) => tc.name))
    
    // 执行所有工具调用
    for (const toolCall of response.tool_calls) {
      const toolInstance = tools.find(t => t.name === toolCall.name)
      if (toolInstance) {
        const result = await toolInstance.invoke(toolCall.args)
        messages.push(new ToolMessage({
          tool_call_id: toolCall.id,
          content: result,
        }))
      }
    }
  }
}

// 示例5: 使用 withStructuredOutput 实现函数调用
const userInfoSchema = z.object({
  name: z.string().describe('用户姓名'),
  age: z.number().describe('年龄'),
  city: z.string().describe('所在城市'),
  hobbies: z.array(z.string()).describe('兴趣爱好'),
})

const modelWithUserExtraction = model.withStructuredOutput(userInfoSchema, {
  name: 'extract_user_info',
})

async function extractUserInfo(text: string) {
  const result = await modelWithUserExtraction.invoke([
    ['human', \`从以下文本中提取用户信息: \${text}\`],
  ])
  return result
}

// 示例6: 工具调用 + RAG 结合
async function ragWithTools(question: string) {
  const modelWithTools = model.bindTools(tools)
  
  const messages = [
    new SystemMessage('你是一个 helpful 的助手。可以使用工具来获取最新信息。'),
    new HumanMessage(question),
  ]
  
  const response = await modelWithTools.invoke(messages)
  
  if (response.tool_calls && response.tool_calls.length > 0) {
    // 有工具调用，执行工具
    messages.push(response)
    
    for (const toolCall of response.tool_calls) {
      const toolInstance = tools.find(t => t.name === toolCall.name)
      if (toolInstance) {
        const result = await toolInstance.invoke(toolCall.args)
        messages.push(new ToolMessage({
          tool_call_id: toolCall.id,
          content: result,
        }))
      }
    }
    
    const finalResponse = await modelWithTools.invoke(messages)
    return finalResponse.content
  }
  
  return response.content
}

// 运行示例
// await singleToolCallExample()
// await multiToolCallExample()
// const userInfo = await extractUserInfo('我叫张三，今年25岁，住在北京，喜欢编程和篮球')
// console.log('提取的用户信息:', userInfo)`),
    language: 'typescript',
    principle: '函数调用（Function Calling）让 LLM 可以调用外部工具获取实时数据或执行操作，LangChain 通过 Tool 抽象统一管理工具，Agent 自动决定何时调用哪个工具。',
    flow: ['定义工具的名称、描述和参数 schema', '将工具注册给模型或 Agent', '模型判断需要调用工具时返回工具调用指令', '执行工具后将结果返回给模型继续生成'],
    notes: ['工具描述的清晰度直接影响模型调用的准确性', '工具参数用 Zod schema 定义可以做运行时校验', '常用工具：搜索、计算器、数据库查询、API 调用'],
    problem: '解决 LLM 知识有截止日期、无法访问实时数据和外部系统的问题。',
  },
{
    id: 'L_22', title: '提示词工程最佳实践', navTitle: '提示词工程', category: '提示工程',
    path: '/langchain/l-22/prompt-engineering', summary: '掌握角色设定、清晰指令、示例引导、思维链、结构化输出等提示词工程核心技巧。',
    demo: L22PromptEngineering,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 })
const parser = new StringOutputParser()

// 示例1: 角色设定 (Role Prompting)
const rolePrompt = ChatPromptTemplate.fromMessages([
  ['system', \`你是一位资深的前端架构师，拥有10年开发经验。
你擅长 Vue、React、TypeScript 等技术栈。
回答问题时请：
1. 先给出简洁的结论
2. 然后详细解释原理
3. 最后提供实践建议
请用专业但易懂的中文回答。\`],
  ['human', '{question}'],
])

const roleChain = rolePrompt.pipe(model).pipe(parser)

const roleResult = await roleChain.invoke({
  question: '前端项目应该选择 Vue 还是 React？',
})
console.log('角色设定结果:\\n', roleResult.slice(0, 200) + '...')

// 示例2: 清晰指令 + 输出格式约束
const formatPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个技术文档写作助手。'],
  ['human', \`
请为以下技术概念写一段解释：

概念: {concept}

要求:
1. 用通俗的语言解释，让初学者能理解
2. 字数控制在 200-300 字
3. 分为三段：
   - 第一段：定义和核心作用
   - 第二段：工作原理
   - 第三段：应用场景
4. 不要使用过于专业的术语，如果必须使用请解释
\`],
])

const formatChain = formatPrompt.pipe(model).pipe(parser)

const formatResult = await formatChain.invoke({
  concept: '虚拟 DOM',
})
console.log('\\n格式约束结果:\\n', formatResult)

// 示例3: Few-shot 示例引导
const examples = [
  { input: '产品质量很好，物流也快', output: '正面' },
  { input: '包装破损了，有点失望', output: '负面' },
  { input: '还可以吧，中规中矩', output: '中性' },
  { input: '性价比超高，强烈推荐！', output: '正面' },
]

const examplePrompt = ChatPromptTemplate.fromMessages([
  ['human', '{input}'],
  ['ai', '{output}'],
])

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
  prefix: '请判断以下评论的情感倾向（正面/负面/中性）：',
  suffix: ['human', '{input}'],
})

const sentimentPrompt = ChatPromptTemplate.fromMessages([
  fewShotPrompt,
])

const sentimentChain = sentimentPrompt.pipe(model).pipe(parser)

const sentimentResult = await sentimentChain.invoke({
  input: '用了一个月了，质量真的不错，下次还买',
})
console.log('\\nFew-shot 情感分析:', sentimentResult)

// 示例4: 思维链 (Chain of Thought, CoT)
const cotPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个逻辑推理助手。请逐步思考后给出答案。'],
  ['human', \`
问题: {question}

请按以下步骤回答：
1. 首先，明确问题是什么
2. 然后，列出已知条件
3. 接着，逐步推导
4. 最后，给出结论

让我们一步一步来思考。
\`],
])

const cotChain = cotPrompt.pipe(model).pipe(parser)

const cotResult = await cotChain.invoke({
  question: '一个水池有进水管和出水管，单独开进水管6小时可以注满，单独开出水管8小时可以放完。如果同时打开两个水管，需要多少小时可以注满水池？',
})
console.log('\\n思维链结果:\\n', cotResult.slice(0, 300) + '...')

// 示例5: 结构化输出提示
const structuredPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个信息提取助手。'],
  ['human', \`
请从以下文本中提取关键信息，以 JSON 格式输出：

文本: {text}

JSON 格式要求：
{{
  "人名": [],
  "地点": [],
  "时间": [],
  "事件": "",
  "关键词": []
}}

只输出 JSON，不要其他解释。
\`],
])

const structuredChain = structuredPrompt.pipe(model).pipe(parser)

const structuredResult = await structuredChain.invoke({
  text: '2024年3月15日，张三和李四在北京参加了一场技术大会，主题是人工智能的发展趋势。',
})
console.log('\\n结构化输出:\\n', structuredResult)

// 示例6: 自我一致性 (Self-Consistency)
async function selfConsistency(question: string, numSamples: number = 3): Promise<string> {
  const cotPrompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一个数学题解答助手。请详细写出解题步骤。'],
    ['human', '{question}\\n\\n请逐步解答：'],
  ])
  
  const cotChain = cotPrompt.pipe(model).pipe(parser)
  
  // 生成多个答案
  const answers = []
  for (let i = 0; i < numSamples; i++) {
    const answer = await cotChain.invoke({ question })
    answers.push(answer)
    console.log(\`答案 \${i + 1}: ...\`)
  }
  
  // 用 LLM 选择最一致的答案
  const judgePrompt = ChatPromptTemplate.fromTemplate(\`
以下是对同一个问题的多个解答，请选出最合理的一个答案：

问题: {question}

解答1:
{answer1}

解答2:
{answer2}

解答3:
{answer3}

请选择最合理的解答，并说明理由。
\`)
  
  const judgeChain = judgePrompt.pipe(model).pipe(parser)
  
  const finalAnswer = await judgeChain.invoke({
    question,
    answer1: answers[0],
    answer2: answers[1],
    answer3: answers[2],
  })
  
  return finalAnswer
}

// 示例7: 提示词迭代优化对比
async function comparePrompts() {
  const question = '什么是闭包？'
  
  // 版本1: 简单提问
  const simplePrompt = ChatPromptTemplate.fromTemplate('{question}')
  const simpleChain = simplePrompt.pipe(model).pipe(parser)
  const simpleResult = await simpleChain.invoke({ question })
  console.log('=== 简单提问 ===')
  console.log(simpleResult.slice(0, 100) + '...')
  
  // 版本2: 角色 + 结构
  const betterPrompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一位资深的 JavaScript 讲师，擅长把复杂概念讲得通俗易懂。'],
    ['human', \`
请解释 "{concept}" 这个概念：

要求：
1. 用大白话解释，让初学者能懂
2. 举一个生活中的类比
3. 写一段简单的代码示例
4. 说明它的常见用途
\`],
  ])
  const betterChain = betterPrompt.pipe(model).pipe(parser)
  const betterResult = await betterChain.invoke({ concept: question })
  console.log('\\n=== 优化后 ===')
  console.log(betterResult.slice(0, 150) + '...')
}`),
    language: 'typescript',
    principle: '提示词工程是通过设计高质量输入来引导 LLM 产出更好结果的技术，核心原则包括：角色设定、清晰指令、示例引导、思维链、结构化输出等。',
    flow: ['明确角色定位，让模型进入对应领域专家状态', '给出清晰的任务描述和输出格式要求', '提供少量示例（Few-shot）帮助模型理解意图', '用思维链（CoT）引导模型分步推理'],
    notes: ['提示词需要迭代优化，不要期望一次就完美', '好的提示词应该具体、可评估、可复用', '温度参数控制随机性，事实类任务调低温度'],
    problem: '解决模型输出质量不稳定、回答不符合预期、格式不统一的问题。',
  },
{
    id: 'L_23', title: '输出护栏与安全验证', navTitle: '输出护栏', category: '安全与治理',
    path: '/langchain/l-23/guardrails', summary: '在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策。',
    demo: L23Guardrails,
    code: () => Promise.resolve(`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 })
const parser = new StringOutputParser()

// 示例1: 输入护栏 - 内容安全检查
const inputCheckPrompt = ChatPromptTemplate.fromTemplate(\`
请检查以下用户输入是否包含有害内容。

检查项：
1. 是否包含暴力或仇恨言论
2. 是否包含色情或露骨内容
3. 是否包含违法违规信息
4. 是否包含人身攻击或辱骂
5. 是否诱导危险行为

用户输入: {input}

请回答：
是否安全: 是/否
风险类别: 如果不安全，列出风险类别
风险等级: 低/中/高
\`)

const inputCheckChain = inputCheckPrompt.pipe(model).pipe(parser)

async function checkInputSafety(input: string): Promise<{
  isSafe: boolean
  riskCategory?: string
  riskLevel?: string
}> {
  const result = await inputCheckChain.invoke({ input })
  
  // 解析结果
  const isSafe = result.includes('是否安全: 是') || result.includes('安全: 是')
  
  return {
    isSafe,
  }
}

// 示例2: 输出护栏 - 格式验证 (Zod)
const outputSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.enum(['电子产品', '服装', '食品', '图书', '其他']),
  description: z.string().max(500),
  inStock: z.boolean(),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

async function safeGenerateProduct(productDesc: string): Promise<any> {
  const prompt = ChatPromptTemplate.fromTemplate(\`
根据以下描述生成产品信息：

{description}

{format_instructions}
\`)

  const chain = prompt.pipe(model).pipe(outputParser)
  
  try {
    const result = await chain.invoke({
      description: productDesc,
      format_instructions: outputParser.getFormatInstructions(),
    })
    return { success: true, data: result }
  } catch (error) {
    console.log('输出格式验证失败，重试...')
    // 重试一次
    try {
      const result = await chain.invoke({
        description: productDesc,
        format_instructions: outputParser.getFormatInstructions(),
      })
      return { success: true, data: result }
    } catch (retryError) {
      return { success: false, error: '输出格式验证失败' }
    }
  }
}

// 示例3: 内容护栏 - 检查输出是否有敏感信息
const outputCheckPrompt = ChatPromptTemplate.fromTemplate(\`
请检查以下 AI 输出是否符合安全规范。

检查项：
1. 是否泄露机密或敏感信息
2. 是否包含虚假或误导性信息
3. 是否有不当建议或危险引导
4. 是否有偏见或歧视性内容
5. 是否偏离主题或拒绝回答

AI 输出: {output}

请回答：
是否合规: 是/否
问题点: 列出存在的问题（如果没有则填"无"）
修改建议: 如果不合规，给出修改建议
\`)

const outputCheckChain = outputCheckPrompt.pipe(model).pipe(parser)

async function checkOutputSafety(output: string): Promise<{
  isCompliant: boolean
  issues?: string
  suggestion?: string
}> {
  const result = await outputCheckChain.invoke({ output })
  const isCompliant = result.includes('是否合规: 是')
  return { isCompliant }
}

// 示例4: 带护栏的完整链
async function guardedGeneration(userInput: string): Promise<{
  success: boolean
  output?: string
  error?: string
}> {
  // 第一步：输入检查
  const inputSafety = await checkInputSafety(userInput)
  if (!inputSafety.isSafe) {
    return { success: false, error: '输入包含不安全内容' }
  }

  // 第二步：生成回答
  const prompt = ChatPromptTemplate.fromTemplate(
    '请用专业的方式回答以下问题：\\n{question}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  let output = await chain.invoke({ question: userInput })

  // 第三步：输出检查
  const outputSafety = await checkOutputSafety(output)
  if (!outputSafety.isCompliant) {
    // 重试：加入安全约束重新生成
    const safePrompt = ChatPromptTemplate.fromTemplate(\`
请用安全、专业、客观的方式回答以下问题。
确保回答准确无误，不包含任何不当内容。

问题: {question}
\`)
    const safeChain = safePrompt.pipe(model).pipe(parser)
    output = await safeChain.invoke({ question: userInput })
    
    // 再次检查
    const recheck = await checkOutputSafety(output)
    if (!recheck.isCompliant) {
      return { success: false, error: '输出无法通过安全检查' }
    }
  }

  return { success: true, output }
}

// 示例5: 主题护栏 - 确保回答在业务范围内
const topicGuardPrompt = ChatPromptTemplate.fromTemplate(\`
请判断以下问题是否属于我们的业务范围。

我们的业务范围：
- 产品咨询
- 技术支持
- 订单查询
- 售后服务

用户问题: {question}

是否属于业务范围: 是/否
如果不属于，请生成一句礼貌的拒绝话术。
\`)

const topicGuardChain = topicGuardPrompt.pipe(model).pipe(parser)

async function checkTopicRelevance(question: string): Promise<{
  isRelevant: boolean
  rejectionMessage?: string
}> {
  const result = await topicGuardChain.invoke({ question })
  const isRelevant = result.includes('是')
  return { isRelevant }
}

// 示例6: 重试机制 + 护栏
async function generateWithGuardrails(
  input: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError = ''
  
  for (let i = 0; i < maxRetries; i++) {
    console.log(\`第 \${i + 1} 次生成...\`)
    
    // 输入检查
    const inputSafe = await checkInputSafety(input)
    if (!inputSafe.isSafe) {
      throw new Error('输入不安全')
    }
    
    // 生成
    const prompt = ChatPromptTemplate.fromTemplate(\`
请回答以下问题：{question}

要求：
- 回答要专业、客观、准确
- 不包含任何敏感或不当内容
- 如果不确定，请说明不确定的原因
\`)
    const chain = prompt.pipe(model).pipe(parser)
    const output = await chain.invoke({ question: input })
    
    // 输出检查
    const outputSafe = await checkOutputSafety(output)
    if (outputSafe.isCompliant) {
      return output
    }
    
    lastError = '输出不合规'
  }
  
  throw new Error(\`经过 \${maxRetries} 次重试仍无法通过安全检查: \${lastError}\`)
}

// 示例7: 降级响应
function getFallbackResponse(reason: string): string {
  const responses: Record<string, string> = {
    unsafe_input: '抱歉，您的问题包含敏感内容，我无法回答。',
    unsafe_output: '抱歉，我无法生成合适的回答。请尝试换一种问法。',
    off_topic: '抱歉，这个问题超出了我的业务范围。我可以帮您解答产品相关的问题。',
    error: '抱歉，服务暂时出现问题，请稍后再试。',
  }
  return responses[reason] || responses.error
}`),
    language: 'typescript',
    principle: '输出护栏（Guardrails）在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策，避免有害内容、格式错误和越权回答。',
    flow: ['定义验证规则：格式校验、内容安全、业务约束', '输入护栏检查用户提问是否合法', '输出护栏校验模型回答，不通过则重试或修正', '记录所有拦截和修正用于审计'],
    notes: ['护栏不是越多越好，平衡安全和用户体验', '结构化输出配合 Zod 校验是最常用的护栏', '敏感领域（医疗、法律）需要更严格的护栏'],
    problem: '解决 LLM 输出不可控、格式不稳定、可能产生有害内容的安全风险问题。',
  }
]
