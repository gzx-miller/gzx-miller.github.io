import type { Component } from 'vue'
import type { Lesson } from '../lessons'
import { restoreCodeSource } from '../code-restore'
import L01LLMCall from '../../demos/L01LLMCallArticle.vue'
import L02PromptTemplate from '../../demos/L02PromptTemplateArticle.vue'
import L03OutputParser from '../../demos/L03OutputParserArticle.vue'
import L04LCEL from '../../demos/L04LCELArticle.vue'
import L05Chains from '../../demos/L05ChainsArticle.vue'
import L06DocSplitter from '../../demos/L06DocSplitterArticle.vue'
import L07VectorRetrieval from '../../demos/L07VectorRetrievalArticle.vue'
import L08Agent from '../../demos/L08AgentArticle.vue'
import L09Tools from '../../demos/L09ToolsArticle.vue'
import L10Memory from '../../demos/L10MemoryArticle.vue'
import L11Callbacks from '../../demos/L11CallbacksArticle.vue'
import L12QABot from '../../demos/L12QABotArticle.vue'
import L13Streaming from '../../demos/L13StreamingArticle.vue'
import L14Evaluation from '../../demos/L14EvaluationArticle.vue'
import L15StructuredOutput from '../../demos/L15StructuredOutputArticle.vue'
import L16LangGraph from '../../demos/L16LangGraphArticle.vue'
import L17VectorStore from '../../demos/L17VectorStoreArticle.vue'
import L18Deploy from '../../demos/L18DeployArticle.vue'
import L19RagPipeline from '../../demos/L19RagPipelineArticle.vue'
import L20MultiModal from '../../demos/L20MultiModalArticle.vue'
import L21FunctionCalling from '../../demos/L21FunctionCallingArticle.vue'
import L22PromptEngineering from '../../demos/L22PromptEngineeringArticle.vue'
import L23Guardrails from '../../demos/L23GuardrailsArticle.vue'

const langchainCodeModules = import.meta.glob<string>('../../demos/langchain-code/*', { query: '?raw', import: 'default' })

function createCodeLoader(path: string) {
  const loader = langchainCodeModules[`../../demos/${path}`]
  if (!loader) throw new Error(`未找到内容源码：${path}`)
  return () => loader().then(restoreCodeSource)
}

const L1Code = createCodeLoader('langchain-code/L1Code.ts.txt')
const L2Code = createCodeLoader('langchain-code/L2Code.ts.txt')
const L3Code = createCodeLoader('langchain-code/L3Code.ts.txt')
const L4Code = createCodeLoader('langchain-code/L4Code.ts.txt')
const L5Code = createCodeLoader('langchain-code/L5Code.ts.txt')
const L6Code = createCodeLoader('langchain-code/L6Code.ts.txt')
const L7Code = createCodeLoader('langchain-code/L7Code.ts.txt')
const L8Code = createCodeLoader('langchain-code/L8Code.ts.txt')
const L9Code = createCodeLoader('langchain-code/L9Code.ts.txt')
const L10Code = createCodeLoader('langchain-code/L10Code.ts.txt')
const L11Code = createCodeLoader('langchain-code/L11Code.ts.txt')
const L12Code = createCodeLoader('langchain-code/L12Code.ts.txt')
const L13Code = createCodeLoader('langchain-code/L13Code.ts.txt')
const L14Code = createCodeLoader('langchain-code/L14Code.ts.txt')
const L15Code = createCodeLoader('langchain-code/L15Code.ts.txt')
const L16Code = createCodeLoader('langchain-code/L16Code.ts.txt')
const L17Code = createCodeLoader('langchain-code/L17Code.ts.txt')
const L18Code = createCodeLoader('langchain-code/L18Code.ts.txt')
const L19Code = createCodeLoader('langchain-code/L19Code.ts.txt')
const L20Code = createCodeLoader('langchain-code/L20Code.ts.txt')
const L21Code = createCodeLoader('langchain-code/L21Code.ts.txt')
const L22Code = createCodeLoader('langchain-code/L22Code.ts.txt')
const L23Code = createCodeLoader('langchain-code/L23Code.ts.txt')

export const lessons: Lesson[] = [
{
    id: 'L_1',
    title: 'LLM 调用：ChatOpenAI、invoke、streaming',
    navTitle: '入门调用',
    category: '基础入门',
    path: '/langchain/l-1/llm-call',
    summary: '用智能问答模拟器展示 ChatOpenAI 的基本调用、模型配置和流式输出。',
    demo: null,
    demoComponent: L01LLMCall,
    code: L1Code,
    language: 'typescript',
    principle:
      'ChatOpenAI 是 LangChain.js 中最常用的聊天模型封装。通过构造函数传入模型名称和参数（temperature、maxTokens 等），调用 invoke 获取完整回复，调用 stream 获取逐 token 的流式输出。temperature 控制输出的随机性，maxTokens 限制输出长度。',
    flow: [
      '创建 ChatOpenAI 实例，通过 model 指定模型名，并配置 temperature、maxTokens 等参数。',
      '调用 invoke(messages) 获取完整回复，或调用 stream(messages) 逐 token 接收。',
      '模型返回 AIMessage 对象，通过 .content 获取文本内容。',
      '多个输入可用 batch 并行调用，一次拿到全部结果。',
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
    demo: null,
    demoComponent: L02PromptTemplate,
    code: L2Code,
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
      '变量值来自用户输入时注意转义与长度限制，防止用户内容破坏模板结构。',
    ],
    problem: '解决"提示词里的可变部分靠字符串拼接维护，修改一处容易改错、复用困难"的问题。',
  },
{
    id: 'L_3',
    title: 'Output Parsers：输出解析与结构化',
    navTitle: '输出解析',
    category: '输出处理',
    path: '/langchain/l-3/output-parser',
    summary: '用课程推荐展示 StringOutputParser 和基于 Zod 的结构化输出解析。',
    demo: null,
    demoComponent: L03OutputParser,
    code: L3Code,
    language: 'typescript',
    principle:
      'LLM 返回的是纯文本，Output Parser 将其转换为程序可处理的结构化数据。StringOutputParser 提取纯文本，基于 Zod schema 的 StructuredOutputParser 将输出解析为带类型的 JSON 对象。LangChain.js 推荐使用 Zod 定义输出结构。',
    flow: [
      'LLM 返回 AIMessage 对象，.content 是原始文本。',
      'StringOutputParser 直接提取 .content 字符串。',
      '基于 Zod schema 的 StructuredOutputParser 将文本解析为带类型的 JSON 对象。',
      '把 parser 接在链尾：prompt.pipe(model).pipe(parser)，invoke 后直接得到结构化结果。',
    ],
    notes: [
      'StructuredOutputParser 会自动在提示词中追加格式指令，告诉模型输出格式。',
      '解析失败时应提供兜底逻辑，例如重试或返回默认值。',
      'LangChain.js 推荐使用 Zod schema 定义输出结构，类型更安全且与 TypeScript 天然集成。',
      '温度调低可减少格式偏差，要求模型输出 JSON 时建议控制在 0-0.2。',
    ],
    problem: '解决"LLM 输出是自由文本，程序无法直接消费，人工搬运数据既慢又容易出错"的问题。',
  },
{
    id: 'L_4',
    title: 'LCEL：LangChain Expression Language',
    navTitle: 'LCEL',
    category: '核心概念',
    path: '/langchain/l-4/lcel',
    summary: '用管道执行器展示 LCEL 的 prompt.pipe(model).pipe(parser) 链式组合和数据流转。',
    demo: null,
    demoComponent: L04LCEL,
    code: L4Code,
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
      '调试时可把链路拆成两截，先验证上游输出再拼接，快速定位是哪一步出了问题。',
    ],
    problem: '解决"LLM 应用各处理步骤零散、手工串联调用链导致难以复用和维护"的问题。',
  },
{
    id: 'L_5',
    title: 'Chains：链式调用与多步处理',
    navTitle: '链式调用',
    category: '核心概念',
    path: '/langchain/l-5/chains',
    summary: '用课程大纲生成展示 LCEL 多步骤链式处理：大纲生成 → 内容展开 → 摘要提炼。',
    demo: null,
    demoComponent: L05Chains,
    code: L5Code,
    language: 'typescript',
    principle:
      'Chain 将多个 LLM 调用和处理步骤串联成完整业务流程。前一步的输出作为后一步的输入，每步专注于单一职责，整体完成复杂任务。链式结构让流程可以逐段调试与复用，也便于在任一步单独替换模型或提示词。LangChain.js 推荐使用 LCEL 的 .pipe() 组合各步骤。',
    flow: [
      '第一步链根据主题生成课程大纲。',
      '第二步链接收大纲，展开详细内容。',
      '第三步链接收详细内容，提炼核心摘要。',
      '每步的中间结果保留为独立字段，便于单独检查质量或缓存复用。',
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
    demo: null,
    demoComponent: L06DocSplitter,
    code: L6Code,
    language: 'typescript',
    principle:
      'RAG 的第一步是把长文档切分为适合检索与向量化的小块。RecursiveCharacterTextSplitter 会按分隔符层级（段落、换行、句子、标点）递归切分，在尽量接近 chunkSize 的同时保持内容的语义连贯；chunkOverlap 使相邻块留有重叠，维持被切分处上下文的连续性。',
    flow: [
      '加载原始文档（TextLoader、PDFLoader 等）。',
      '配置 RecursiveCharacterTextSplitter 的 chunkSize、chunkOverlap 和 separators。',
      '调用 splitter.splitDocuments(documents) 得到切分后的文档块列表。',
      '抽查切分结果：检查块的开头结尾，确认没有在关键句中间断裂。',
    ],
    notes: [
      'chunkSize 通常在 500-1500 字符之间，太小丢失上下文，太大降低检索精度。',
      'chunkOverlap 建议设为 chunkSize 的 10%-20%。',
      '不同文档类型可使用不同的 splitter，例如代码用 Language-specific splitter。',
      '为每个块补充来源元数据（文件名、章节），检索命中后才能回溯到出处。',
    ],
    problem: '解决"整篇长文档直接向量化导致检索粒度过粗，问题答案淹没在大块文本里"的问题。',
  },
{
    id: 'L_7',
    title: 'RAG 进阶：向量存储与相似度检索',
    navTitle: '向量检索',
    category: 'RAG',
    path: '/langchain/l-7/vector-retrieval',
    summary: '用知识库搜索展示文档嵌入、余弦相似度计算和 Top-K 检索结果排序。',
    demo: null,
    demoComponent: L07VectorRetrieval,
    code: L7Code,
    language: 'typescript',
    principle:
      '向量检索是 RAG 的核心。文档通过 Embedding 模型转换为高维向量（如 text-embedding-3-small 输出 1536 维），查询同样被转换为向量，通过余弦相似度等度量找到最相关的文档块。VectorStore 封装了存储和检索逻辑。',
    flow: [
      '将文档块通过 Embedding 模型转换为向量。',
      '存入 VectorStore（MemoryVectorStore、FAISS、Pinecone 等）。',
      '查询时将问题转为向量，调用 similaritySearch 返回最相关的 K 个文档块。',
      '把检索到的文档块拼进提示词模板，交给 LLM 生成带依据的回答。',
    ],
    notes: [
      'Embedding 模型的选择直接影响检索质量，OpenAI 的 text-embedding-3-small 是常用选择。',
      '真实 Embedding 向量维度通常为 1536 或 3072，本 demo 用 text-embedding-3-small 生成真实高维向量参与检索，并非简化为低维示例。',
      'similaritySearchWithScore 返回的分数反映查询与文档的相近程度，不同存储后端在分数方向与取值范围上可能不同。',
      '生产环境推荐使用持久化向量数据库，如 Pinecone、Weaviate 或 Chroma。',
      '检索结果数量 K 值需要根据场景调优，通常 3-5 个即可。',
    ],
    problem: '解决"知识库文档数量庞大时，如何快速找到与用户问题最相关的内容"的问题。',
  },
{
    id: 'L_8',
    title: 'Agent：智能代理与 ReAct 推理',
    navTitle: '智能代理',
    category: 'Agent',
    path: '/langchain/l-8/agent',
    summary: '用推理过程展示 Agent 的 ReAct 循环：思考 → 行动 → 观察 → 回答。',
    demo: null,
    demoComponent: L08Agent,
    code: L8Code,
    language: 'typescript',
    principle:
      'Agent 是能够自主决策的 LLM 应用：模型根据用户目标自行决定是否调用工具、调用哪个工具。ReAct 模式让 Agent 每一步先思考当前已知信息（Thought），选择工具执行行动（Action），读取工具返回的观察结果（Observation），再进入下一轮循环，直到信息足够生成最终答案；AgentExecutor 负责驱动这个循环并拼接中间消息。',
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
      '每轮推理都消耗 token，迭代上限要结合成本预算设置，并记录每轮日志便于回放。',
    ],
    problem: '解决"多步任务里 LLM 需要根据中间结果自主选择工具、逐步推理完成目标"的问题。',
  },
{
    id: 'L_9',
    title: 'Tools：工具定义与调用',
    navTitle: '工具定义',
    category: 'Agent',
    path: '/langchain/l-9/tools',
    summary: '用工具注册表展示 tool 函数的定义、Zod 参数 Schema 和调用过程。',
    demo: null,
    demoComponent: L09Tools,
    code: L9Code,
    language: 'typescript',
    principle:
      'Tool 是 Agent 与外部世界交互的接口。每个工具定义名称、描述和参数 Schema，Agent 根据描述判断何时调用哪个工具。LangChain.js 推荐使用 tool 函数配合 Zod schema 定义工具，提供类型安全的方式。',
    flow: [
      '使用 tool 函数定义工具名称、描述和 Zod 参数 Schema。',
      '实现工具的执行函数，接收参数并返回结果。',
      '将工具注册到 Agent，Agent 在推理时自动选择和调用。',
      '在工具执行函数中处理异常参数与超时，把可读的错误信息返回给模型。',
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
    summary: '用对话面板展示完整历史、最近 k 轮窗口、历史摘要三种记忆策略及 RunnableWithMessageHistory。',
    demo: null,
    demoComponent: L10Memory,
    code: L10Code,
    language: 'typescript',
    principle:
      'Memory 让 LLM 应用记住对话上下文。核心是底层存储 ChatMessageHistory，配合 MessagesPlaceholder 占位符把历史消息拼接到提示词；当对话过长时只保留最近 k 轮窗口，或把历史压缩为摘要，在上下文长度和记忆完整性之间取舍。LangChain.js 当前推荐用 RunnableWithMessageHistory 按 sessionId 自动注入历史，旧版 Memory 类已不再推荐。',
    flow: [
      '用 ChatMessageHistory 记录每轮用户与 AI 消息。',
      '用 MessagesPlaceholder 在提示词中预留历史位置，把历史注入模板。',
      '历史过长时只保留最近 k 轮窗口，或用前缀消息压缩为摘要。',
      '通过 RunnableWithMessageHistory 按 sessionId 维护每个会话的历史。',
    ],
    notes: [
      '对话轮数多时完整历史会超出 token 上限，需要改用窗口或摘要记忆。',
      '摘要记忆需要额外的 LLM 调用来压缩历史，会增加延迟和成本。',
      'ChatMessageHistory 是底层存储，可替换为 Redis、数据库等持久化后端。',
      'RunnableWithMessageHistory 通过 configurable.sessionId 区分会话，生产环境建议使用持久化存储。',
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
    demo: null,
    demoComponent: L11Callbacks,
    code: L11Code,
    language: 'typescript',
    principle:
      'Callbacks 是 LangChain 的可观测性机制。通过注册回调处理器，可以在 Runnable 执行的各个阶段（链开始、LLM 调用开始、生成 token、调用结束、出错）执行自定义逻辑，用于日志、监控、调试和流式输出。回调只挂钩执行过程、不改变链路行为，是排查线上问题与统计 token 消耗的第一手数据。',
    flow: [
      '实现 CallbackHandler，定义 handleChainStart、handleLLMStart、handleLLMNewToken、handleLLMEnd 等方法。',
      '将 handler 传入 Runnable 的 callbacks 参数。',
      '执行过程中回调自动触发，记录每个阶段的输入输出和耗时。',
      '结合 handleLLMNewToken 把 token 实时推送前端，实现打字机效果。',
    ],
    notes: [
      '生产环境建议集成 LangSmith 或 LangFuse 进行链路追踪。',
      'handleLLMNewToken 是实现流式输出的关键回调。',
      'handleChainError 用于捕获链执行中的错误，实现错误监控和告警。',
      '回调中不要执行耗时操作，避免阻塞 LLM 调用流程。',
    ],
    problem: '解决"LLM 应用执行过程不透明，调用出错难以定位、token 成本难以统计"的问题。',
  },
{
    id: 'L_12',
    title: '综合实战：Retriever + Agent + Memory 智能问答',
    navTitle: '智能问答',
    category: '综合实战',
    path: '/langchain/l-12/qa-bot',
    summary: '用智能问答助手展示 Retriever 检索、Agent 推理和对话记忆的综合应用。',
    demo: null,
    demoComponent: L12QABot,
    code: L12Code,
    language: 'typescript',
    principle:
      '真实 LLM 应用通常需要组合多种能力：Retriever 把知识库封装成可调用的检索工具，Agent 在推理中自主决定何时检索、如何追问；Memory（RunnableWithMessageHistory）按 sessionId 注入历史消息，让多轮对话能接住代词与省略指代。三者组装后的问答机器人既有知识库依据，又保持对话连贯性。',
    flow: [
      '从 Memory 中检索对话上下文，了解用户历史意图。',
      '通过 Retriever 从 VectorStore 检索与当前问题相关的文档片段。',
      'Agent 结合检索结果和上下文，推理生成最终答案。',
      '把本轮问答写回 Memory，供下一轮对话继续引用。',
    ],
    notes: [
      '检索质量是 RAG 应用的关键瓶颈，投入精力优化文档切分和检索策略。',
      'Agent 的可靠性需要通过测试和监控持续改进。',
      '生产环境要考虑降级策略：Agent 失败时回退到简单 Chain。',
      '多轮对话里检索查询要结合历史改写（如指代消解），否则代词会让检索跑偏。',
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
    demo: null,
    demoComponent: L13Streaming,
    code: L13Code,
    language: 'typescript',
    principle:
      'LangChain.js 提供三种执行方式：invoke 等待完整响应后返回；stream 逐 token 流式返回，适合实时展示生成过程；astream_events 提供事件级流式输出，包含 run_id、tags 等元数据，适合复杂链路的细粒度监控和调试。',
    flow: [
      'invoke：调用后阻塞等待，一次性返回完整结果。适合短文本或不需要流式展示的场景。',
      'stream：返回异步迭代器，逐 token 输出。适合聊天界面等需要实时展示的场景。',
      'astream_events：返回事件流，包含链开始/结束、LLM 开始/结束、token 输出等事件。适合调试和监控。',
      '需要过程可视化时，astream_events 可按 run_id 区分父子链路，定位到具体节点。',
    ],
    notes: [
      'stream 是最常用的流式方式，API 简洁且性能好。',
      'astream_events 的 version 必须指定为 "v2"，v1 已废弃。',
      'invoke 和 stream 都支持 batch 方法（batch/abatch），用于并行处理多个输入。',
      '生产环境推荐 stream + handleLLMNewToken 回调实现流式输出。',
    ],
    problem: '解决"聊天界面首 token 延迟高、长链路难以调试时，不知何时用 invoke、何时用 stream 或 astream_events"的问题。',
  },
{
    id: 'L_14',
    title: '评估与测试：输出质量评估',
    navTitle: '评估测试',
    category: '工程实践',
    path: '/langchain/l-14/evaluation',
    summary: '用问答质量评估展示 LLM-as-Judge 评估模式和人工评分对比。',
    demo: null,
    demoComponent: L14Evaluation,
    code: L14Code,
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
    problem: '解决"LLM 输出质量波动难以察觉，缺少客观评估标准与持续监控手段"的问题。',
  },
{
    id: 'L_15', title: '结构化输出与 Zod Schema', navTitle: '结构化输出', category: '输出控制',
    path: '/langchain/l-15/structured-output', summary: '用 Zod Schema 约束 LLM 输出为结构化数据，对比 JSON Mode 和函数调用。',
    demo: null,
    demoComponent: L15StructuredOutput,
    code: L15Code,
    language: 'typescript',
    principle: '结构化输出让 LLM 直接返回可编程消费的数据：withStructuredOutput 底层走函数调用，模型按 Zod Schema 生成参数对象并由 Schema 校验；JSON Mode 只保证输出是合法 JSON，字段结构仍靠提示词约束。字段越多、层级越深，函数调用的可靠性优势越明显；Zod 同时提供运行时校验与 TypeScript 类型推导。',
    flow: ['用 Zod 定义输出结构，给每个字段加 describe 说明语义。', '调用 withStructuredOutput(schema)，或在请求中开启 JSON Mode。', 'invoke 后直接拿到类型安全的对象（函数调用），或手动 JSON.parse 再校验（JSON Mode）。', '解析失败时捕获错误并重试或降级，Zod 的校验结果就是补救依据。'],
    notes: ['函数调用模式的格式可靠性高于 JSON Mode。', 'Zod Schema 同时提供运行时校验和类型推导。', '模型不支持函数调用时才回退到 JSON Mode，提示词中要明确字段结构与只输出 JSON 的约束。', 'describe 说明会进入模型可见的 Schema 描述，字段含义写清楚能显著降低填错率。'],
    problem: '解决"如何让 LLM 稳定返回可解析的结构化数据而非自由文本"的问题。',
  },
{
    id: 'L_16', title: 'LangGraph 多智能体编排', navTitle: 'LangGraph', category: '智能体',
    path: '/langchain/l-16/langgraph', summary: '用状态图编排课程推荐智能体，掌握节点、边和条件路由。',
    demo: null,
    demoComponent: L16LangGraph,
    code: L16Code,
    language: 'typescript',
    principle: 'LangGraph 把智能体工作流建模为有向状态图：节点是执行函数，接收当前状态并返回状态更新；普通边定义固定转移，条件边根据状态动态选择下一个节点，从而表达循环与分支。状态通过 channel 在节点间共享并按 reducer 合并更新；编译后的图支持流式观察每个节点执行过程，并可挂载检查点实现暂停与恢复。',
    flow: ['用接口定义图状态，节点函数接收状态并返回局部更新。', 'addNode/addEdge 搭建流程，addConditionalEdges 按状态动态路由。', 'compile 后 invoke 初始状态执行，用 stream 观察各节点执行顺序。', '配置 checkpointer 后可按 thread_id 暂停、恢复长流程，实现人机协作审批。'],
    notes: ['LangGraph 支持检查点，可暂停和恢复执行。', '条件边使工作流能根据中间结果动态分支。', '节点返回的是局部状态更新而非完整状态，messages 这类列表字段需要配合 reducer（如 concat）追加合并。', '图复杂后建议把节点拆成独立文件并补单测，状态流转比线性链更依赖测试保障。'],
    problem: '解决"多步骤智能体工作流的流转与分支难以控制、难以复现和调试"的问题。',
  },
{
    id: 'L_17', title: '向量存储与检索策略', navTitle: '向量存储', category: 'RAG',
    path: '/langchain/l-17/vector-store', summary: '比较 Chroma、FAISS、Pinecone 和 pgvector 的适用场景与检索策略。',
    demo: null,
    demoComponent: L17VectorStore,
    code: L17Code,
    language: 'typescript',
    principle: '向量存储把文本嵌入为高维向量，用余弦相似度等度量做近邻检索，是 RAG 的检索底座。后端选择取决于规模与运维条件：MemoryVectorStore 仅供开发验证，Chroma/FAISS 适合本地与中小规模，Pinecone 等托管服务面向生产，pgvector 适合已有 PostgreSQL 的团队。检索侧还要选择策略：纯相似度、MMR（兼顾多样性）以及元数据过滤与混合检索（向量+关键词）。',
    flow: ['按规模与运维条件选择后端：开发用 MemoryVectorStore，生产用 Chroma/Pinecone/pgvector。', '配置嵌入模型与 topK，用 similaritySearchWithScore 观察分数分布。', '加入元数据过滤或 MMR 提升结果质量，评估是否需要混合检索。', '文档更新后按相同嵌入模型增量重建索引，保证新旧向量口径一致。'],
    notes: ['小规模实验用 Chroma/FAISS，生产环境考虑 Pinecone/pgvector。', '混合检索（向量+关键词）通常比纯向量效果更好。', '更换嵌入模型后必须重建全部向量索引，新旧向量不可混用。', 'topK 与相似度阈值要联合调优：先看分数分布再定阈值，避免过滤后结果为空。'],
    problem: '解决"如何按规模与运维条件选择合适的向量存储，并设计高效的 RAG 检索策略"的问题。',
  },
{
    id: 'L_18', title: '部署优化与语义缓存', navTitle: '部署优化', category: '工程实践',
    path: '/langchain/l-18/deploy', summary: '掌握 LLM 应用的缓存、流式输出、Token 预算和成本控制策略。',
    demo: null,
    demoComponent: L18Deploy,
    code: L18Code,
    language: 'typescript',
    principle: 'LLM 应用部署需要同时平衡三件事：延迟（用语义缓存复用近似问题的答案，降低重复调用）、成本（管理 Token 预算、按任务选择模型并估算调用费用）和可靠性（对限流做指数退避重试、为长请求设置超时上限、在模型不可用时降级到备用模型），任何一项失守都会直接反映到用户体验与运营账单上。',
    flow: ['用语义缓存复用近似问题，命中相似度阈值即返回缓存答案。', '通过 Token 预算管理和模型成本估算控制开销。', '使用指数退避重试、超时保护和降级策略保障生产可靠性。', '把延迟、成本、错误率做成监控指标，持续观察并据此调整阈值与上限。'],
    notes: ['语义缓存的相似度阈值需要调优，过高难命中、过低易误命中。', '对限流（429）错误做重试，非可重试错误应立即抛出，避免无限等待。', '语义缓存会长期保留历史问答，涉及用户私有数据的场景需按用户隔离或设置过期策略。', '超时上限按业务容忍度设置，长请求可先流式返回再继续生成，避免用户干等。'],
    problem: '解决"LLM 应用上线后延迟高、token 成本失控、限流故障频发"的生产化问题。',
  },
{
    id: 'L_19', title: 'RAG 完整流水线实现', navTitle: 'RAG 流水线', category: 'RAG',
    path: '/langchain/l-19/rag-pipeline', summary: '端到端实现文档加载、切分、向量化、存储、检索、重排、生成的完整 RAG 流水线。',
    demo: null,
    demoComponent: L19RagPipeline,
    code: L19Code,
    language: 'typescript',
    principle: 'RAG（检索增强生成）把外部知识接进 LLM：离线阶段把文档加载、切分、向量化后存入向量库，在线阶段把用户提问向量化并检索相关块、重排精选后连同问题一起放进提示词，让模型基于真实资料作答。加载、切分、向量化、存储、检索、重排、生成七个环节逐级传递，任何一环质量不足都会让最终回答失真，因此需要端到端测量与调优。',
    flow: ['文档加载和清洗，去除无效内容', '按语义切分文档块，控制大小和重叠', '向量化后存入向量数据库', '用户提问时检索相关文档，重排后送给 LLM 生成回答'],
    notes: ['文档切分策略对检索质量影响很大', '检索结果不是越多越好，要精准', '加入重排（rerank）可以显著提升相关性', '离线阶段记录文档来源与更新时间，在线回答时便于标注依据、判断时效性'],
    problem: '解决"LLM 知识过时、无法访问私有数据、回答容易凭空编造且无法溯源"的问题。',
  },
{
    id: 'L_20', title: '多模态模型与视觉理解', navTitle: '多模态', category: '模型能力',
    path: '/langchain/l-20/multi-modal', summary: '使用多模态模型同时理解文本和图像，实现图像描述、图表分析、OCR 等视觉任务。',
    demo: null,
    demoComponent: L20MultiModal,
    code: L20Code,
    language: 'typescript',
    principle: '多模态模型（如 GPT-4o 系列）可以同时理解文本与图像：LangChain 在 HumanMessage 的 content 数组中混排 text 与 image_url 内容块，图片既可传 URL 也可传 base64 data URL。模型据此完成图像描述、视觉问答、图表解读与 OCR 等任务，还可与 Zod Schema 结合输出结构化的图像分析结果。',
    flow: ['使用支持视觉输入的多模态模型（如 GPT-4o 系列）', '在 HumanMessage 中同时携带 text 与 image_url（支持图片 URL 或 base64 编码）内容块', '模型理解图像后返回文本描述、分析结果或符合 Zod Schema 的结构化数据', '图像较大时先压缩再转 base64，控制请求体积与 token 消耗'],
    notes: ['图像可以是 URL 或 base64 编码', '图像清晰度和提示词质量影响理解效果', '适合截图分析、图表解读、照片描述等场景', '图片会按尺寸折算 token，批量分析前先估算成本'],
    problem: '解决"传统 LLM 只能处理文本，看不懂截图、图表等视觉信息"的能力局限问题。',
  },
{
    id: 'L_21', title: '函数调用与工具扩展', navTitle: '函数调用', category: '工具与代理',
    path: '/langchain/l-21/function-calling', summary: '通过 Function Calling 让 LLM 调用外部工具，扩展实时数据获取和操作执行能力。',
    demo: null,
    demoComponent: L21FunctionCalling,
    code: L21Code,
    language: 'typescript',
    principle: '函数调用让 LLM 突破知识截止与封闭环境：应用先用 Zod Schema 描述工具参数，模型在对话中返回结构化的 tool_calls（工具名+参数），宿主代码执行对应函数后把 ToolMessage 结果回传，模型再基于结果生成最终回答。LangChain 的 tool 抽象把定义、校验与执行统一起来，Agent 在此之上自动编排多轮调用。',
    flow: ['定义工具的名称、描述和参数 schema', '将工具注册给模型或 Agent', '模型判断需要调用工具时返回工具调用指令', '执行工具后将结果返回给模型继续生成'],
    notes: ['工具描述的清晰度直接影响模型调用的准确性', '工具参数用 Zod schema 定义可以做运行时校验', '常用工具：搜索、计算器、数据库查询、API 调用', '并行工具调用需保证执行幂等，失败重试不能造成重复下单、重复扣款等副作用'],
    problem: '解决"LLM 知识有截止日期、无法访问实时数据和外部系统、难以执行动作"的问题。',
  },
{
    id: 'L_22', title: '提示词工程最佳实践', navTitle: '提示词工程', category: '提示工程',
    path: '/langchain/l-22/prompt-engineering', summary: '掌握角色设定、清晰指令、示例引导、思维链、结构化输出等提示词工程核心技巧。',
    demo: null,
    demoComponent: L22PromptEngineering,
    code: L22Code,
    language: 'typescript',
    principle: '提示词工程通过设计输入来引导模型行为，核心手段包括：角色设定（system 提示框定专家身份）、清晰指令与输出格式约束、Few-shot 示例（用样例对齐判别标准）、思维链（引导分步推理提升复杂任务准确率）、以及结构化输出要求。它本质上是在补偿模型缺失的上下文与约束，需要针对真实样例迭代验证。',
    flow: ['明确角色定位，让模型进入对应领域专家状态', '给出清晰的任务描述和输出格式要求', '提供少量示例（Few-shot）帮助模型理解意图', '用思维链（CoT）引导模型分步推理'],
    notes: ['提示词需要迭代优化，不要期望一次就完美', '好的提示词应该具体、可评估、可复用', '温度参数控制随机性，事实类任务调低温度', '提示词变更要像代码一样做版本管理与回归测试，防止新改动劣化旧场景'],
    problem: '解决"模型输出质量不稳定、回答不符合预期、格式不统一难以后处理"的问题。',
  },
{
    id: 'L_23', title: '输出护栏与安全验证', navTitle: '输出护栏', category: '安全与治理',
    path: '/langchain/l-23/guardrails', summary: '在 LLM 输出前后进行验证和修正，确保输出符合业务规则、格式要求和安全政策。',
    demo: null,
    demoComponent: L23Guardrails,
    code: L23Code,
    language: 'typescript',
    principle: '输出护栏在 LLM 调用前后插入校验层：输入侧检查提示注入与有害内容，输出侧用 Zod 校验格式、用审核提示词检查合规与业务范围，不通过则重试、改写或返回降级话术。护栏把不可控的生成约束成符合业务规则的输出，所有拦截都应有日志以便审计与迭代。',
    flow: ['定义验证规则：格式校验、内容安全、业务约束', '输入护栏检查用户提问是否合法', '输出护栏校验模型回答，不通过则重试或修正', '记录所有拦截和修正用于审计'],
    notes: ['护栏不是越多越好，平衡安全和用户体验', '结构化输出配合 Zod 校验是最常用的护栏', '敏感领域（医疗、法律）需要更严格的护栏', '护栏规则要可配置、可灰度，误伤正常提问时能快速调整阈值与话术'],
    problem: '解决"LLM 输出不可控、格式不稳定、可能产生有害内容的安全风险"的问题。',
  }
]
