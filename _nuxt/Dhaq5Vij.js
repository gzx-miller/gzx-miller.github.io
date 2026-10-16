const n=`import { ChatOpenAI } from '@langchain/openai'
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
// await demoRAGPipeline()`;export{n as default};
