import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { Lesson } from '../lessons'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[`../../demos/${name}.vue`]
  if (!loader) throw new Error(`未找到案例组件：${name}`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到案例源码：${path}`)
  return loader
}

const L01LLMCall = createDemo('L01LLMCall')
const L01Code = createCodeLoader('L01LLMCall.vue')
const L02PromptTemplate = createDemo('L02PromptTemplate')
const L02Code = createCodeLoader('L02PromptTemplate.vue')
const L03OutputParser = createDemo('L03OutputParser')
const L03Code = createCodeLoader('L03OutputParser.vue')
const L04LCEL = createDemo('L04LCEL')
const L04Code = createCodeLoader('L04LCEL.vue')
const L05Chains = createDemo('L05Chains')
const L05Code = createCodeLoader('L05Chains.vue')
const L06DocSplitter = createDemo('L06DocSplitter')
const L06Code = createCodeLoader('L06DocSplitter.vue')
const L07VectorRetrieval = createDemo('L07VectorRetrieval')
const L07Code = createCodeLoader('L07VectorRetrieval.vue')
const L08Agent = createDemo('L08Agent')
const L08Code = createCodeLoader('L08Agent.vue')
const L09Tools = createDemo('L09Tools')
const L09Code = createCodeLoader('L09Tools.vue')
const L10Memory = createDemo('L10Memory')
const L10Code = createCodeLoader('L10Memory.vue')
const L11Callbacks = createDemo('L11Callbacks')
const L11Code = createCodeLoader('L11Callbacks.vue')
const L12QABot = createDemo('L12QABot')
const L12Code = createCodeLoader('L12QABot.vue')
const L13Streaming = createDemo('L13Streaming')
const L13Code = createCodeLoader('L13Streaming.vue')
const L14Evaluation = createDemo('L14Evaluation')
const L14Code = createCodeLoader('L14Evaluation.vue')
const L15StructuredOutput = createDemo('L15StructuredOutput')
const L15Code = createCodeLoader('L15StructuredOutput.vue')
const L16LangGraph = createDemo('L16LangGraph')
const L16Code = createCodeLoader('L16LangGraph.vue')
const L17VectorStore = createDemo('L17VectorStore')
const L17Code = createCodeLoader('L17VectorStore.vue')
const L18Deploy = createDemo('L18Deploy')
const L18Code = createCodeLoader('L18Deploy.vue')
const L19RagPipeline = createDemo('L19RagPipeline')
const L19Code = createCodeLoader('L19RagPipeline.vue')
const L20MultiModal = createDemo('L20MultiModal')
const L20Code = createCodeLoader('L20MultiModal.vue')
const L21FunctionCalling = createDemo('L21FunctionCalling')
const L21Code = createCodeLoader('L21FunctionCalling.vue')
const L22PromptEngineering = createDemo('L22PromptEngineering')
const L22Code = createCodeLoader('L22PromptEngineering.vue')
const L23Guardrails = createDemo('L23Guardrails')
const L23Code = createCodeLoader('L23Guardrails.vue')


export const lessons: Lesson[] = [
{
    id: 'L_1',
    title: 'LLM 调用：ChatOpenAI、invoke、streaming',
    navTitle: '入门调用',
    category: '基础入门',
    path: '/langchain/l-1/llm-call',
    summary: '用智能问答模拟器展示 ChatOpenAI 的基本调用、模型配置和流式输出。',
    demo: L01LLMCall,
    code: L01Code,
    language: 'vue',
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
    code: L02Code,
    language: 'vue',
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
    code: L03Code,
    language: 'vue',
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
    code: L04Code,
    language: 'vue',
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
    code: L05Code,
    language: 'vue',
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
    code: L06Code,
    language: 'vue',
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
    code: L07Code,
    language: 'vue',
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
    code: L08Code,
    language: 'vue',
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
    code: L09Code,
    language: 'vue',
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
    code: L10Code,
    language: 'vue',
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
    code: L11Code,
    language: 'vue',
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
    code: L12Code,
    language: 'vue',
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
    code: L13Code,
    language: 'vue',
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
    code: L14Code,
    language: 'vue',
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
    demo: L15StructuredOutput, code: L15Code, language: 'vue',
    principle: '结构化输出通过 Schema 定义强制 LLM 返回指定格式的数据；JSON Mode 适合简单结构，函数调用（withStructuredOutput）提供更可靠的格式保证和校验。',
    flow: ['用 Zod 定义输出数据的 Schema。', '选择 JSON Mode 或函数调用模式。', '验证并解析返回的结构化结果。'],
    notes: ['函数调用模式的格式可靠性高于 JSON Mode。', 'Zod Schema 同时提供运行时校验和类型推导。'],
    problem: '解决"如何让 LLM 稳定返回可解析的结构化数据而非自由文本"的问题。',
  },
{
    id: 'L_16', title: 'LangGraph 多智能体编排', navTitle: 'LangGraph', category: '智能体',
    path: '/langchain/l-16/langgraph', summary: '用状态图编排课程推荐智能体，掌握节点、边和条件路由。',
    demo: L16LangGraph, code: L16Code, language: 'vue',
    principle: 'LangGraph 把智能体工作流建模为有向图：节点执行计算，边定义转移，条件边根据状态动态路由；状态在节点间共享并支持检查点和回溯。',
    flow: ['定义状态接口和节点函数。', '用条件边连接节点形成工作流。', '编译图并传入初始状态执行。'],
    notes: ['LangGraph 支持检查点，可暂停和恢复执行。', '条件边使工作流能根据中间结果动态分支。'],
    problem: '解决"如何把复杂智能体工作流建模为可控、可调试的状态图"的问题。',
  },
{
    id: 'L_17', title: '向量存储与检索策略', navTitle: '向量存储', category: 'RAG',
    path: '/langchain/l-17/vector-store', summary: '比较 Chroma、FAISS、Pinecone 和 pgvector 的适用场景与检索策略。',
    demo: L17VectorStore, code: L17Code, language: 'vue',
    principle: '向量存储把文本嵌入为高维向量并按相似度检索；不同后端在规模、延迟、混合搜索和部署复杂度上各有取舍，检索策略需结合关键词和语义。',
    flow: ['选择合适的向量数据库。', '配置嵌入模型和相似度度量。', '结合关键词过滤实现混合检索。'],
    notes: ['小规模实验用 Chroma/FAISS，生产环境考虑 Pinecone/pgvector。', '混合检索（向量+关键词）通常比纯向量效果更好。'],
    problem: '解决"如何选择合适的向量存储并设计高效的 RAG 检索策略"的问题。',
  },
{
    id: 'L_18', title: '部署优化与语义缓存', navTitle: '部署优化', category: '工程实践',
    path: '/langchain/l-18/deploy', summary: '掌握 LLM 应用的缓存、流式输出、Token 预算和成本控制策略。',
    demo: L18Deploy, code: L18Code, language: 'vue',
    principle: 'LLM 应用部署需要关注延迟（语义缓存、流式输出）、成本（Token 预算、模型选择）和可靠性（重试、降级），优化策略直接影响用户体验和运营成本。',
    flow: ['实现语义缓存减少重复调用。', '使用 SSE 流式输出降低感知延迟。', '设置 Token 预算和成本监控。'],
    notes: ['语义缓存的相似度阈值需要调优。', '流式输出需要前端配合逐块渲染。'],
    problem: '解决"LLM 应用如何优化延迟、控制成本并保证生产可靠性"的问题。',
  },
{
    id: 'L_19', title: 'RAG 完整流水线实现', navTitle: 'RAG 流水线', category: 'RAG',
    path: '/langchain/l-19/rag-pipeline', summary: '端到端实现文档加载、切分、向量化、存储、检索、重排、生成的完整 RAG 流水线。',
    demo: L19RagPipeline, code: L19Code, language: 'vue',
    principle: 'RAG（检索增强生成）完整流水线包括文档加载、切分、向量化、存储、检索、重排、生成七个环节，每个环节的质量都会影响最终回答效果，需要端到端优化。',
    flow: ['文档加载和清洗，去除无效内容', '按语义切分文档块，控制大小和重叠', '向量化后存入向量数据库', '用户提问时检索相关文档，重排后送给 LLM 生成回答'],
    notes: ['文档切分策略对检索质量影响很大', '检索结果不是越多越好，要精准', '加入重排（rerank）可以显著提升相关性'],
    problem: '解决 LLM 知识过时、无法访问私有数据、回答不准确的问题。',
  },
{
    id: 'L_20', title: '多模态模型与视觉理解', navTitle: '多模态', category: '模型能力',
    path: '/langchain/l-20/multi-modal', summary: '使用多模态模型同时理解文本和图像，实现图像描述、图表分析、OCR 等视觉任务。',
    demo: L20MultiModal, code: L20Code, language: 'vue',
    principle: '多模态模型可以同时理解文本和图像，LangChain 通过 ChatMessage 中的 image_url 内容类型支持视觉理解，适合图像描述、图表分析、OCR 等场景。',
    flow: ['使用支持多模态的模型（如 GPT-4V、Claude 3）', '构建包含 text 和 image_url 的消息内容', '模型理解图像后返回文本描述或分析结果'],
    notes: ['图像可以是 URL 或 base64 编码', '图像清晰度和提示词质量影响理解效果', '适合截图分析、图表解读、照片描述等场景'],
    problem: '解决传统 LLM 只能处理文本、无法理解视觉信息的问题。',
  },
{
    id: 'L_21', title: '函数调用与工具扩展', navTitle: '函数调用', category: '工具与代理',
    path: '/langchain/l-21/function-calling', summary: '通过 Function Calling 让 LLM 调用外部工具，扩展实时数据获取和操作执行能力。',
    demo: L21FunctionCalling, code: L21Code, language: 'vue',
    principle: '函数调用（Function Calling）让 LLM 可以调用外部工具获取实时数据或执行操作，LangChain 通过 Tool 抽象统一管理工具，Agent 自动决定何时调用哪个工具。',
    flow: ['定义工具的名称、描述和参数 schema', '将工具注册给模型或 Agent', '模型判断需要调用工具时返回工具调用指令', '执行工具后将结果返回给模型继续生成'],
    notes: ['工具描述的清晰度直接影响模型调用的准确性', '工具参数用 Zod schema 定义可以做运行时校验', '常用工具：搜索、计算器、数据库查询、API 调用'],
    problem: '解决 LLM 知识有截止日期、无法访问实时数据和外部系统的问题。',
  },
{
    id: 'L_22', title: '提示词工程最佳实践', navTitle: '提示词工程', category: '提示工程',
    path: '/langchain/l-22/prompt-engineering', summary: '掌握角色设定、清晰指令、示例引导、思维链、结构化输出等提示词工程核心技巧。',
    demo: L22PromptEngineering, code: L22Code, language: 'vue',
    principle: '提示词工程是通过设计高质量输入来引导 LLM 产出更好结果的技术，核心原则包括：角色设定、清晰指令、示例引导、思维链、结构化输出等。',
    flow: ['明确角色定位，让模型进入对应领域专家状态', '给出清晰的任务描述和输出格式要求', '提供少量示例（Few-shot）帮助模型理解意图', '用思维链（CoT）引导模型分步推理'],
    notes: ['提示词需要迭代优化，不要期望一次就完美', '好的提示词应该具体、可评估、可复用', '温度参数控制随机性，事实类任务调低温度'],
    problem: '解决模型输出质量不稳定、回答不符合预期、格式不统一的问题。',
  },
{
    id: 'L_23', title: '输出护栏与安全验证', navTitle: '输出护栏', category: '安全与治理',
    path: '/langchain/l-23/guardrails', summary: '在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策。',
    demo: L23Guardrails, code: L23Code, language: 'vue',
    principle: '输出护栏（Guardrails）在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策，避免有害内容、格式错误和越权回答。',
    flow: ['定义验证规则：格式校验、内容安全、业务约束', '输入护栏检查用户提问是否合法', '输出护栏校验模型回答，不通过则重试或修正', '记录所有拦截和修正用于审计'],
    notes: ['护栏不是越多越好，平衡安全和用户体验', '结构化输出配合 Zod 校验是最常用的护栏', '敏感领域（医疗、法律）需要更严格的护栏'],
    problem: '解决 LLM 输出不可控、格式不稳定、可能产生有害内容的安全风险问题。',
  }
]
