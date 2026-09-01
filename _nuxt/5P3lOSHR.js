const e=`<script setup>
import { ref, computed } from 'vue'

const cache = ref([
  { prompt: '推荐 Vue3 入门课程',     response: '推荐：Vue3 组合式 API 实战...', hash: 'a3f8c2' },
  { prompt: '推荐 Vue3 基础教程',     response: null, hash: 'a3f8c1', hit: false },
  { prompt: 'TypeScript 泛型怎么用',  response: '泛型允许你定义可复用的类型...',  hash: 'b7e1d4' },
])
const testPrompt = ref('推荐 Vue3 入门教程')
const threshold = ref(0.85)
const hitResult = computed(() => {
  if (!testPrompt.value) return null
  const best = cache.value.reduce((a, b) =>
    sim(testPrompt.value, b.prompt) > sim(testPrompt.value, a.prompt) ? b : a
  )
  const s = sim(testPrompt.value, best.prompt)
  return { entry: best, score: s, hit: s >= threshold.value }
})

function sim(a, b) {
  const sa = new Set(a), sb = new Set(b)
  const inter = [...sa].filter(c => sb.has(c)).length
  return inter / Math.max(sa.size, sb.size)
}

const tokenBudget = ref(2000)
const costPerK = 0.002
const estimatedCost = computed(() => (tokenBudget.value / 1000 * costPerK).toFixed(4))

const deployCode = \`// 语义缓存：相似 prompt 复用历史响应
import { OpenAIEmbeddings } from '@langchain/openai'
import { cosineSimilarity } from 'langchain/util'

const cache = new Map()  // hash → { response, embedding }

async function cachedCall(prompt) {
  const embed = await embeddings.embedQuery(prompt)
  for (const [key, entry] of cache) {
    if (cosineSimilarity(embed, entry.embedding) > 0.92) {
      return { response: entry.response, cached: true }
    }
  }
  const response = await llm.invoke(prompt)
  cache.set(hash(prompt), { response, embedding: embed })
  return { response, cached: false }
}

// SSE 流式响应
app.get('/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  const stream = await chain.stream({ input: req.query.q })
  for await (const chunk of stream) {
    res.write(\\\`data: \\\${JSON.stringify(chunk)}\\\\n\\\\n\\\`)
  }
  res.end()
})\`
<\/script>

<template>
  <div class="demo-card">
    <h3>部署优化与缓存</h3>

    <div class="section">
      <h4>语义缓存模拟</h4>
      <div class="cache-entries">
        <div v-for="(c, i) in cache" :key="i" class="cache-item">
          <span class="cache-hash">#{{ c.hash }}</span>
          <span class="cache-prompt">{{ c.prompt }}</span>
          <span class="cache-hit" :class="c.hit === false ? 'miss' : 'hit'">{{ c.hit === false ? 'MISS' : 'HIT' }}</span>
        </div>
      </div>
      <div class="test-row">
        <input v-model="testPrompt" placeholder="输入测试 prompt..." class="test-input" />
        <div class="threshold-ctrl">
          <label>阈值 {{ threshold.toFixed(2) }}</label>
          <input type="range" v-model.number="threshold" min="0.5" max="1" step="0.05" />
        </div>
      </div>
      <div v-if="hitResult" class="hit-result" :class="hitResult.hit ? 'hit' : 'miss'">
        <span>{{ hitResult.hit ? '✅ 缓存命中' : '❌ 缓存未命中' }}</span>
        <span class="hit-detail">最相似："{{ hitResult.entry.prompt }}"（相似度 {{ (hitResult.score * 100).toFixed(0) }}%）</span>
      </div>
    </div>

    <div class="section budget-section">
      <h4>Token 预算与成本估算</h4>
      <div class="budget-row">
        <label>Token 预算：{{ tokenBudget }}</label>
        <input type="range" v-model.number="tokenBudget" min="500" max="8000" step="100" />
        <span class="cost-val">≈ \${{ estimatedCost }} / 请求</span>
      </div>
    </div>

    <div class="code-section">
      <h4>语义缓存 + SSE 流式代码</h4>
      <pre class="code-block">{{ deployCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.section { margin-bottom: 14px; }
.section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.cache-entries { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.cache-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 4px; font-size: 12px; }
.cache-hash { font-family: monospace; color: #a0623a; min-width: 52px; }
.cache-prompt { flex: 1; color: #5a3e2b; }
.cache-hit { font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; }
.cache-hit.hit { background: #e8f5ec; color: #6b9e78; }
.cache-hit.miss { background: #fef0ee; color: #c8503c; }
.test-row { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
.test-input { flex: 1; padding: 6px 10px; border: 1px solid #d4a574; border-radius: 4px; font-size: 13px; background: #fff; color: #5a3e2b; }
.threshold-ctrl { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8b5e3c; }
.threshold-ctrl input[type=range] { width: 80px; }
.hit-result { padding: 8px 12px; border-radius: 6px; font-size: 13px; }
.hit-result.hit { background: #e8f5ec; color: #4a7a5a; }
.hit-result.miss { background: #fef0ee; color: #c8503c; }
.hit-detail { display: block; font-size: 11px; margin-top: 3px; color: #8b5e3c; }
.budget-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.budget-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #5a3e2b; }
.budget-row input[type=range] { flex: 1; }
.cost-val { font-weight: bold; color: #c8703c; white-space: nowrap; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{e as default};
