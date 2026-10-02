const n=`import { OpenAIEmbeddings } from '@langchain/openai'
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
console.log('\\nRAG 回答:', answer)`;export{n as default};
