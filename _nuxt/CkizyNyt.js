const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

interface DocItem {
  id: number
  text: string
  vector: number[]
  category: string
}

const query = ref('Vue3 响应式原理')

const documents: DocItem[] = [
  { id: 1, text: 'Vue3 使用 Proxy 实现响应式系统，替代了 Vue2 的 Object.defineProperty', vector: [0.9, 0.8, 0.3], category: 'Vue3' },
  { id: 2, text: 'React Hooks 允许在函数组件中使用状态和副作用', vector: [0.3, 0.7, 0.8], category: 'React' },
  { id: 3, text: 'ref 和 reactive 是 Vue3 组合式 API 的核心响应式方法', vector: [0.85, 0.75, 0.2], category: 'Vue3' },
  { id: 4, text: 'TypeScript 泛型可以在函数和类中实现类型参数化', vector: [0.2, 0.4, 0.6], category: 'TypeScript' },
  { id: 5, text: 'computed 和 watch 是 Vue3 中处理派生状态和副作用的工具', vector: [0.8, 0.7, 0.25], category: 'Vue3' },
  { id: 6, text: 'Webpack 和 Vite 是常见的前端构建工具', vector: [0.1, 0.3, 0.5], category: '工程化' },
]

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
}

// 模拟：查询文本通过 Embedding 模型转换为向量
// 真实场景中向量维度为 1536（text-embedding-3-small）或 3072（text-embedding-3-large）
// 此处用 3 维简化演示
const queryVector = computed(() => {
  // 简单模拟：根据查询关键词调整向量方向
  const q = query.value.toLowerCase()
  if (q.includes('vue') || q.includes('响应')) return [0.88, 0.78, 0.25]
  if (q.includes('react') || q.includes('hook')) return [0.3, 0.72, 0.82]
  if (q.includes('type') || q.includes('泛型')) return [0.22, 0.42, 0.62]
  return [0.5, 0.5, 0.5]
})

const searchResults = computed(() => {
  return documents
    .map((doc) => ({
      ...doc,
      score: cosineSimilarity(doc.vector, queryVector.value),
    }))
    .sort((a, b) => b.score - a.score)
})
<\/script>

<template>
  <div class="demo-card">
    <h3>向量检索模拟</h3>
    <p class="hint">此处用 3 维向量简化演示，真实 Embedding 维度为 1536+</p>
    <div class="search-row">
      <input v-model="query" placeholder="输入查询文本" />
      <span class="query-vec">查询向量: [{{ queryVector.map(v => v.toFixed(2)).join(', ') }}]</span>
    </div>
    <div class="results-list">
      <div v-for="doc in searchResults" :key="doc.id" class="result-item" :class="{ top: doc.score > 0.95 }">
        <div class="result-header">
          <span class="result-cat">{{ doc.category }}</span>
          <span class="result-score">相似度: {{ doc.score.toFixed(3) }}</span>
        </div>
        <p>{{ doc.text }}</p>
        <div class="result-vec">向量: [{{ doc.vector.map(v => v.toFixed(1)).join(', ') }}]</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hint { color: #a0623a; font-size: 12px; margin: 0 0 8px; font-style: italic; }
.search-row { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.search-row input { padding: 6px 10px; border: 1px solid #d4a574; border-radius: 4px; flex: 1; min-width: 200px; }
.query-vec { font-size: 12px; color: #a0623a; font-family: monospace; }
.results-list { display: flex; flex-direction: column; gap: 6px; }
.result-item { padding: 10px; border-radius: 6px; border: 1px solid #e8c9a0; background: #fef9f3; }
.result-item.top { border-color: #c8703c; background: #fde8d0; }
.result-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.result-cat { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: #c8703c; color: #fff; }
.result-score { font-size: 12px; font-weight: bold; color: #c8703c; }
.result-item p { margin: 4px 0; font-size: 13px; line-height: 1.5; color: #5a3e2b; }
.result-vec { font-size: 11px; color: #a0623a; font-family: monospace; }
</style>
`;export{e as default};
