const n=`import { createAgent, tool } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { MemorySaver } from '@langchain/langgraph'
import { z } from 'zod'

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

// 示例4: 创建带短期记忆的智能体
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

const agent = createAgent({
  model,
  tools,
  systemPrompt: \`你是一个专业的 LangChain 技术支持助手。
你可以使用知识库搜索工具来查找相关信息。
如果知识库中没有答案，请诚实地说你不知道。
请用简洁、专业的中文回答问题。\`,
  checkpointer: new MemorySaver(),
})

// 示例5: 使用 thread_id 区分并持久化会话历史
async function runQABot() {
  const config = { configurable: { thread_id: 'user-001' } }

  console.log('=== 智能问答助手 ===')

  // 第一轮：基础问题
  console.log('\\n用户: 什么是 RAG？')
  const response1 = await agent.invoke(
    { messages: [{ role: 'user', content: '什么是 RAG？' }] },
    config
  )
  console.log('助手:', response1.messages.at(-1)?.content)

  // 第二轮：追问（测试记忆）
  console.log('\\n用户: 它的主要流程是什么？')
  const response2 = await agent.invoke(
    { messages: [{ role: 'user', content: '它的主要流程是什么？' }] },
    config
  )
  console.log('助手:', response2.messages.at(-1)?.content)

  // 第三轮：另一个话题
  console.log('\\n用户: LangChain 的 LCEL 是什么？')
  const response3 = await agent.invoke(
    { messages: [{ role: 'user', content: 'LangChain 的 LCEL 是什么？' }] },
    config
  )
  console.log('助手:', response3.messages.at(-1)?.content)

  // 第四轮：综合问题（需要推理 + 检索）
  console.log('\\n用户: 如何用 LangChain 实现一个 RAG 系统？')
  const response4 = await agent.invoke(
    { messages: [{ role: 'user', content: '如何用 LangChain 实现一个 RAG 系统？' }] },
    config
  )
  console.log('助手:', response4.messages.at(-1)?.content)
}

// 示例6: 流式输出对话
async function streamQABot() {
  const config = { configurable: { thread_id: 'user-002' } }

  const stream = await agent.stream(
    { messages: [{ role: 'user', content: '解释一下 Agent 的工作原理' }] },
    { ...config, streamMode: 'messages' }
  )

  console.log('\\n流式回答:')
  for await (const [message] of stream) {
    if (message.getType() === 'ai') {
      process.stdout.write(message.content.toString())
    }
  }
  console.log()
}
`;export{n as default};
