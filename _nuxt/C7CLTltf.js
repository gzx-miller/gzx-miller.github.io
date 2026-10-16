const n=`import { ChatOpenAI } from '@langchain/openai'
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
}`;export{n as default};
