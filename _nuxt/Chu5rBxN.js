const n=`import { OpenAIEmbeddings } from '@langchain/openai'
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
console.log('\\nRAG 回答:', answer)`;export{n as default};
