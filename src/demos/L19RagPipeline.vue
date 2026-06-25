<script setup lang="ts">
import { ref, computed } from 'vue'

interface Document {
  id: number
  title: string
  content: string
  source: string
}

interface RagStep {
  id: number
  name: string
  description: string
  status: 'pending' | 'running' | 'done'
  detail?: string
}

interface RetrievedDoc {
  id: number
  title: string
  snippet: string
  score: number
}

const knowledgeBase = ref<Document[]>([
  {
    id: 1,
    title: '秋日森林生态系统',
    content: '秋日森林是温带落叶阔叶林的典型代表，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红金黄等丰富色彩，是森林一年中最美的季节。森林中的动物如松鼠、黑熊等会在秋季储存食物以备冬眠。',
    source: '自然百科全书'
  },
  {
    id: 2,
    title: '枫叶变色原理',
    content: '枫叶在秋季变红是由于叶绿素分解，露出了类胡萝卜素和花青素。随着气温下降和日照时间减少，树木停止生产叶绿素，原本被掩盖的红色素和黄色素显现出来，形成壮观的秋色。',
    source: '植物生理学'
  },
  {
    id: 3,
    title: '森林碳汇功能',
    content: '森林是地球上最重要的碳汇之一，通过光合作用吸收二氧化碳并释放氧气。成熟的秋日森林每年每公顷可吸收约15-20吨二氧化碳，在应对气候变化中发挥着关键作用。',
    source: '环境科学报告'
  },
  {
    id: 4,
    title: '森林旅游经济',
    content: '秋日森林旅游已成为重要的生态经济模式。以加拿大枫叶大道为例，每年秋季吸引数百万游客，带动当地餐饮、住宿、手工艺品等相关产业发展，创造大量就业机会。',
    source: '旅游经济研究'
  }
])

const userQuery = ref('秋日森林有什么特点？')
const activeTab = ref<'process' | 'code' | 'knowledge'>('process')
const isRunning = ref(false)
const finalAnswer = ref('')
const showAnswer = ref(false)

const ragSteps = ref<RagStep[]>([
  { id: 1, name: '查询理解', description: '分析用户问题意图', status: 'pending' },
  { id: 2, name: '向量检索', description: '在知识库中匹配相关文档', status: 'pending' },
  { id: 3, name: '文档重排', description: '对检索结果进行相关性排序', status: 'pending' },
  { id: 4, name: '上下文构建', description: '组装检索到的文档片段', status: 'pending' },
  { id: 5, name: 'LLM 生成', description: '基于上下文生成回答', status: 'pending' }
])

const retrievedDocs = ref<RetrievedDoc[]>([])

const mockRetrievedDocs: RetrievedDoc[] = [
  { id: 1, title: '秋日森林生态系统', snippet: '秋日森林是温带落叶阔叶林的典型代表，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红金黄等丰富色彩...', score: 0.92 },
  { id: 2, title: '枫叶变色原理', snippet: '枫叶在秋季变红是由于叶绿素分解，露出了类胡萝卜素和花青素。随着气温下降和日照时间减少...', score: 0.78 },
  { id: 3, title: '森林碳汇功能', snippet: '森林是地球上最重要的碳汇之一，通过光合作用吸收二氧化碳并释放氧气...', score: 0.65 }
]

const mockAnswer = '秋日森林具有以下显著特点：\n\n1. **植被特征**：属于温带落叶阔叶林，主要树种包括橡树、枫树、山毛榉等。秋季时树叶呈现橙红、金黄等丰富色彩，是森林一年中最美的季节。\n\n2. **变色原理**：秋季气温下降和日照减少导致叶绿素分解，类胡萝卜素和花青素显现，形成壮观的秋色景观。\n\n3. **生态价值**：作为重要的碳汇，每年每公顷可吸收约15-20吨二氧化碳，在应对气候变化中发挥关键作用。\n\n4. **经济价值**：秋日森林旅游带动了餐饮、住宿、手工艺品等相关产业发展，创造了大量就业机会。'

const codeExample = `// RAG 完整流水线实现
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'

// 1. 文档加载与切分
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50
})
const chunks = await splitter.splitDocuments(documents)

// 2. 构建向量知识库
const vectorStore = await MemoryVectorStore.fromDocuments(
  chunks,
  new OpenAIEmbeddings()
)

// 3. 创建检索器
const retriever = vectorStore.asRetriever({ k: 3 })

// 4. 构建 RAG 链
const combineChain = await createStuffDocumentsChain({
  llm,
  prompt: ragPrompt
})

const ragChain = await createRetrievalChain({
  retriever,
  combineDocsChain: combineChain
})

// 5. 执行查询
const result = await ragChain.invoke({
  input: userQuestion
})`

const knowledgePoints = [
  { title: '什么是 RAG', content: 'RAG (Retrieval-Augmented Generation) 即检索增强生成，是一种结合信息检索与大语言模型的技术框架，通过外部知识库增强模型回答的准确性和时效性。' },
  { title: '核心流程', content: '用户提问 → 查询向量化 → 向量检索 → 文档重排 → 上下文构建 → LLM 生成回答 → 返回结果' },
  { title: '主要优势', content: '1. 减少幻觉，提高准确性\n2. 支持私有知识库问答\n3. 信息可溯源\n4. 降低模型微调成本' },
  { title: '优化方向', content: '• 嵌入模型选择\n• 分块策略优化\n• 多路召回策略\n• 重排序模型\n• 提示词工程' }
]

async function runRagPipeline() {
  if (isRunning.value || !userQuery.value.trim()) return
  isRunning.value = true
  showAnswer.value = false
  finalAnswer.value = ''
  retrievedDocs.value = []
  ragSteps.value.forEach(s => { s.status = 'pending'; s.detail = '' })

  for (let i = 0; i < ragSteps.value.length; i++) {
    ragSteps.value[i].status = 'running'
    await new Promise(r => setTimeout(r, 800))

    if (i === 0) {
      ragSteps.value[i].detail = `检测到问题类型：知识查询，涉及关键词：秋日森林、特点`
    } else if (i === 1) {
      ragSteps.value[i].detail = `在 ${knowledgeBase.value.length} 篇文档中检索，找到 3 篇相关文档`
      retrievedDocs.value = mockRetrievedDocs
    } else if (i === 2) {
      ragSteps.value[i].detail = `使用相似度评分排序，Top 1 得分：0.92`
    } else if (i === 3) {
      ragSteps.value[i].detail = `已组装 3 段上下文，总字符数：约 600 字`
    }

    ragSteps.value[i].status = 'done'
    await new Promise(r => setTimeout(r, 400))
  }

  showAnswer.value = true
  let i = 0
  const timer = setInterval(() => {
    if (i < mockAnswer.length) {
      finalAnswer.value += mockAnswer[i]
      i++
    } else {
      clearInterval(timer)
      isRunning.value = false
    }
  }, 20)
}

function resetPipeline() {
  ragSteps.value.forEach(s => { s.status = 'pending'; s.detail = '' })
  finalAnswer.value = ''
  showAnswer.value = false
  retrievedDocs.value = []
}
</script>

<template>
  <div class="demo-card">
    <h3>RAG 完整流水线</h3>
    <p class="subtitle">基于秋日森林知识库的检索增强生成演示</p>

    <div class="query-section">
      <input v-model="userQuery" placeholder="请输入您的问题..." @keyup.enter="runRagPipeline" />
      <div class="btn-group">
        <button :disabled="isRunning" class="primary" @click="runRagPipeline">{{ isRunning ? '执行中...' : '运行 RAG' }}</button>
        <button :disabled="isRunning" @click="resetPipeline">重置</button>
      </div>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'process' }" @click="activeTab = 'process'">执行过程</button>
      <button :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">代码示例</button>
      <button :class="{ active: activeTab === 'knowledge' }" @click="activeTab = 'knowledge'">知识点</button>
    </div>

    <div v-if="activeTab === 'process'" class="tab-content">
      <div class="steps-container">
        <div v-for="step in ragSteps" :key="step.id" class="rag-step" :class="step.status">
          <div class="step-left">
            <span class="step-badge">{{ step.id }}</span>
          </div>
          <div class="step-right">
            <div class="step-title-row">
              <span class="step-name">{{ step.name }}</span>
              <span class="step-status-icon">
                {{ step.status === 'done' ? '✓' : step.status === 'running' ? '⟳' : '○' }}
              </span>
            </div>
            <p class="step-desc">{{ step.description }}</p>
            <p v-if="step.detail" class="step-detail">{{ step.detail }}</p>
          </div>
        </div>
      </div>

      <div v-if="retrievedDocs.length > 0" class="retrieved-section">
        <h4>检索到的文档</h4>
        <div v-for="doc in retrievedDocs" :key="doc.id" class="doc-item">
          <div class="doc-header">
            <span class="doc-title">{{ doc.title }}</span>
            <span class="doc-score">相似度 {{ (doc.score * 100).toFixed(0) }}%</span>
          </div>
          <p class="doc-snippet">{{ doc.snippet }}</p>
        </div>
      </div>

      <div v-if="showAnswer" class="answer-section">
        <h4>生成回答</h4>
        <div class="answer-box">
          <p class="answer-text" style="white-space: pre-wrap;">{{ finalAnswer }}</p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'code'" class="tab-content">
      <div class="code-example">
        <pre>{{ codeExample }}</pre>
      </div>
    </div>

    <div v-if="activeTab === 'knowledge'" class="tab-content">
      <div class="knowledge-grid">
        <div v-for="(point, index) in knowledgePoints" :key="index" class="knowledge-card">
          <h5>{{ point.title }}</h5>
          <p style="white-space: pre-wrap;">{{ point.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  border: 1px solid #e8c9a0;
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #fef9f3 0%, #fdf2e6 100%);
}
h3 {
  margin: 0 0 4px;
  color: #8b5e3c;
  font-size: 18px;
}
.subtitle {
  margin: 0 0 16px;
  color: #a0623a;
  font-size: 13px;
}
.query-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.query-section input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d4a574;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  color: #5a3e2b;
}
.btn-group {
  display: flex;
  gap: 8px;
}
.btn-group button {
  padding: 10px 16px;
  border: 1px solid #d4a574;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  color: #8b5e3c;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-group button.primary {
  background: #c8703c;
  color: #fff;
  border-color: #c8703c;
}
.btn-group button:hover:not(:disabled) {
  transform: translateY(-1px);
}
.btn-group button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e8c9a0;
}
.tabs button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #a0623a;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.tabs button.active {
  color: #c8703c;
  border-bottom-color: #c8703c;
  font-weight: bold;
}
.tab-content {
  min-height: 200px;
}
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.rag-step {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e8c9a0;
  background: #fff;
  transition: all 0.3s;
}
.rag-step.running {
  border-color: #c8703c;
  background: #fde8d0;
}
.rag-step.done {
  border-color: #6b9e78;
  background: #f0f7f2;
}
.step-left {
  flex-shrink: 0;
}
.step-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8c9a0;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
}
.rag-step.running .step-badge {
  background: #c8703c;
  animation: pulse 1s infinite;
}
.rag-step.done .step-badge {
  background: #6b9e78;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.step-right {
  flex: 1;
}
.step-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.step-name {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 14px;
}
.step-status-icon {
  color: #a0623a;
  font-size: 14px;
}
.rag-step.running .step-status-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.step-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8b5e3c;
}
.step-detail {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b9e78;
  padding: 6px 8px;
  background: #f0f7f2;
  border-radius: 4px;
}
.retrieved-section {
  margin-bottom: 16px;
}
.retrieved-section h4 {
  margin: 0 0 10px;
  color: #8b5e3c;
  font-size: 14px;
}
.doc-item {
  padding: 10px 12px;
  border: 1px solid #e8c9a0;
  border-radius: 6px;
  background: #fff;
  margin-bottom: 8px;
}
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.doc-title {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 13px;
}
.doc-score {
  font-size: 11px;
  color: #6b9e78;
  background: #f0f7f2;
  padding: 2px 8px;
  border-radius: 10px;
}
.doc-snippet {
  margin: 0;
  font-size: 12px;
  color: #8b5e3c;
  line-height: 1.5;
}
.answer-section h4 {
  margin: 0 0 10px;
  color: #8b5e3c;
  font-size: 14px;
}
.answer-box {
  padding: 14px;
  background: #fff;
  border: 1px solid #c8703c;
  border-left: 4px solid #c8703c;
  border-radius: 6px;
}
.answer-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #5a3e2b;
}
.code-example {
  background: #fef9f3;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
}
.code-example pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #5a3e2b;
  font-family: Consolas, Monaco, monospace;
}
.knowledge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.knowledge-card {
  padding: 14px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
}
.knowledge-card h5 {
  margin: 0 0 8px;
  color: #c8703c;
  font-size: 14px;
}
.knowledge-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #5a3e2b;
}
</style>
