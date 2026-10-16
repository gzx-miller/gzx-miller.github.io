const n=`// RAG：把三种检索策略接进 LangGraph 智能体
// 场景：课程知识库问答——向量检索、关键词检索、混合检索对比
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { tool } from '@langchain/core/tools'
import { Document } from '@langchain/core/documents'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

const docs = [
  new Document({ pageContent: '组合式 API 用 setup 组织逻辑，按功能而非选项分组。' }),
  new Document({ pageContent: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。' }),
  new Document({ pageContent: '路由懒加载用动态 import 分包，减小首屏体积。' }),
]

// 示例1: 向量检索——按语义相近找块（问法不同也能命中）
const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

const vectorSearch = tool(async ({ query, k }) => {
  const hits = await vectorStore.similaritySearch(query, k)
  return hits.map((d, i) => \`[\${i + 1}] \${d.pageContent}\`).join('\\n')
}, {
  name: 'vector_search',
  description: '语义相似度检索：适合概念、解释类问题，问法与原文不同也能命中',
  schema: z.object({ query: z.string(), k: z.number().default(3) }),
})

// 示例2: 关键词检索——BM25 风格词频打分，专治「精确术语找不到」
function keywordSearch(query: string, k = 3) {
  const terms = query.toLowerCase().split(/\\s+/)
  return docs
    .map((d) => ({
      doc: d,
      score: terms.reduce((sum, t) => sum + (d.pageContent.toLowerCase().includes(t) ? 1 : 0), 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.doc)
}

const keywordSearchTool = tool(async ({ query, k }) => {
  const hits = keywordSearch(query, k)
  return hits.length ? hits.map((d, i) => \`[\${i + 1}] \${d.pageContent}\`).join('\\n') : '未命中任何文档'
}, {
  name: 'keyword_search',
  description: '关键词检索：适合 API 名称、报错信息等精确术语查询',
  schema: z.object({ query: z.string(), k: z.number().default(3) }),
})

// 示例3: 混合检索——两路各自召回，再用 RRF 融合排名
const hybridSearch = tool(async ({ query }) => {
  const vectorHits = await vectorStore.similaritySearch(query, 3)
  const keywordHits = keywordSearch(query, 3)

  // Reciprocal Rank Fusion：按名次计分（1/(k+rank)），两路都靠前的块排最前
  const scores = new Map<string, number>()
  const K = 60
  vectorHits.forEach((d, i) => scores.set(d.pageContent, (scores.get(d.pageContent) ?? 0) + 1 / (K + i + 1)))
  keywordHits.forEach((d, i) => scores.set(d.pageContent, (scores.get(d.pageContent) ?? 0) + 1 / (K + i + 1)))

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([text], i) => \`[\${i + 1}] \${text}\`)
    .join('\\n')
}, {
  name: 'hybrid_search',
  description: '混合检索：向量 + 关键词双路召回后融合排序，综合表现最稳',
  schema: z.object({ query: z.string() }),
})

// 示例4: 把检索工具交给 Agent——由它按问题类型挑策略
const agent = createReactAgent({
  llm: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools: [vectorSearch, keywordSearchTool, hybridSearch],
  prompt: '你是课程知识库助手。先选择合适的检索工具查证，再基于检索内容回答并标注编号。',
})

const result = await agent.invoke({
  messages: [new HumanMessage('ref 和 reactive 的区别是什么？')],
})
console.log(result.messages.at(-1)?.content)

// 示例5: 图的扩展位——想改用固定流程时，把「检索 → 生成」拆成两个节点
// 在多轮问答里，检索查询还要先做指代消解（用历史改写问题），再进检索节点

// 示例6: 三种策略怎么选
// - 语义问题、自然语言提问 → 向量检索
// - 精确术语、报错原文、人名编号 → 关键词检索
// - 生产环境默认建议 → 混合检索，RRF 融合，几乎没有副作用
`;export{n as default};
