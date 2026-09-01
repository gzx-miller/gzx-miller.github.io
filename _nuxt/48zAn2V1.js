const e=`<script setup>
import { ref, computed } from 'vue'

const stores = [
  { name: 'Chroma',   dims: 1536, metric: '余弦相似度', feature: '轻量本地，适合开发调试',      icon: '🟢' },
  { name: 'FAISS',    dims: 1536, metric: 'L2 / 内积',  feature: '高性能单机，Facebook 开源',    icon: '🔵' },
  { name: 'Pinecone', dims: 1536, metric: '余弦 / 点积', feature: '全托管云端，自动扩缩容',       icon: '🟣' },
  { name: 'pgvector', dims: 1536, metric: '余弦 / L2',  feature: '与 PostgreSQL 深度集成',       icon: '🟠' },
]
const selected = ref(0)
const metric = ref('cosine')

const metrics = { cosine: '余弦相似度 = A·B / (|A|·|B|)', dot: '点积 = Σ(Ai·Bi)', l2: 'L2 距离 = √Σ(Ai-Bi)²' }

const queryVec = [0.8, 0.3, 0.5]
const docs = [
  { name: 'Vue3 组合式 API',    vec: [0.75, 0.35, 0.48], score: 0.97 },
  { name: 'React Hooks 详解',   vec: [0.70, 0.28, 0.55], score: 0.89 },
  { name: 'TypeScript 泛型',    vec: [0.60, 0.50, 0.40], score: 0.74 },
  { name: 'Node.js 文件操作',   vec: [0.20, 0.80, 0.30], score: 0.35 },
]
const hybridOn = ref(false)
const filteredDocs = computed(() => {
  if (!hybridOn.value) return docs
  return docs.filter(d => d.score > 0.5).map(d => ({ ...d, score: Math.min(1, d.score + 0.05) }))
})

const storeCode = \`import { Chroma } from '@langchain/community/vectorstores/chroma'
import { OpenAIEmbeddings } from '@langchain/openai'

const embeddings = new OpenAIEmbeddings({ model: 'text-embedding-3-small' })

// 写入向量库
const store = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: 'courses',
})

// 相似度检索
const results = await store.similaritySearch('Vue3 教程', 4)

// 混合检索：向量 + 关键词（MMR 多样性排序）
const mmrResults = await store.maxMarginalRelevanceSearch('Vue3 教程', {
  k: 4, fetchK: 20,
})\`
<\/script>

<template>
  <div class="demo-card">
    <h3>向量存储与检索策略</h3>
    <div class="store-grid">
      <div v-for="(s, i) in stores" :key="s.name" class="store-card" :class="{ active: selected === i }" @click="selected = i">
        <span class="store-icon">{{ s.icon }}</span>
        <strong>{{ s.name }}</strong>
        <span class="store-feat">{{ s.feature }}</span>
      </div>
    </div>
    <div class="info-row">
      <div class="info-box"><span class="lbl">维度</span><span class="val">{{ stores[selected].dims }}</span></div>
      <div class="info-box"><span class="lbl">相似度度量</span><span class="val">{{ stores[selected].metric }}</span></div>
    </div>
    <div class="metric-section">
      <h4>相似度公式对比</h4>
      <div class="metric-tabs">
        <button v-for="(desc, key) in metrics" :key="key" :class="{ active: metric === key }" @click="metric = key">{{ key }}</button>
      </div>
      <div class="formula-box">{{ metrics[metric] }}</div>
    </div>
    <div class="sim-section">
      <h4>相似度检索结果
        <label class="hybrid-label"><input type="checkbox" v-model="hybridOn" /> 混合检索（向量 + 关键词）</label>
      </h4>
      <div v-for="d in filteredDocs" :key="d.name" class="sim-row">
        <span class="sim-name">{{ d.name }}</span>
        <div class="sim-bar-bg"><div class="sim-bar" :style="{ width: (d.score * 100) + '%' }"></div></div>
        <span class="sim-score">{{ (d.score * 100).toFixed(0) }}%</span>
      </div>
    </div>
    <div class="code-section">
      <h4>向量存储代码</h4>
      <pre class="code-block">{{ storeCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.store-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.store-card { display: flex; flex-direction: column; align-items: center; padding: 10px 8px; border: 2px solid #e8c9a0; border-radius: 8px; cursor: pointer; background: #fef9f3; transition: all 0.15s; }
.store-card.active { border-color: #c8703c; background: #fde8d0; }
.store-icon { font-size: 20px; }
.store-card strong { font-size: 13px; color: #5a3e2b; margin: 4px 0 2px; }
.store-feat { font-size: 10px; color: #8b5e3c; text-align: center; }
.info-row { display: flex; gap: 12px; margin-bottom: 12px; }
.info-box { flex: 1; display: flex; justify-content: space-between; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 6px; padding: 8px 12px; }
.lbl { font-size: 12px; color: #8b5e3c; }
.val { font-size: 13px; font-weight: bold; color: #c8703c; }
.metric-section { margin-bottom: 12px; }
.metric-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.metric-tabs { display: flex; gap: 8px; margin-bottom: 8px; }
.metric-tabs button { padding: 5px 12px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 12px; font-family: monospace; }
.metric-tabs button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.formula-box { background: #fff8f0; border: 1px solid #e8c9a0; border-radius: 6px; padding: 10px; font-size: 13px; color: #5a3e2b; font-family: monospace; }
.sim-section { margin-bottom: 12px; }
.sim-section h4 { margin: 0 0 10px; color: #8b5e3c; font-size: 14px; display: flex; align-items: center; gap: 10px; }
.hybrid-label { font-size: 12px; font-weight: normal; color: #5a3e2b; cursor: pointer; display: flex; align-items: center; gap: 4px; }
.sim-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.sim-name { font-size: 12px; color: #5a3e2b; min-width: 130px; }
.sim-bar-bg { flex: 1; height: 10px; background: #f5ebe0; border-radius: 5px; overflow: hidden; }
.sim-bar { height: 100%; background: linear-gradient(90deg, #d4a574, #c8703c); border-radius: 5px; transition: width 0.3s; }
.sim-score { font-size: 12px; font-weight: bold; color: #c8703c; min-width: 36px; text-align: right; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{e as default};
