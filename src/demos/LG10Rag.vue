<script setup lang="ts">
import { computed, ref } from 'vue'

interface Hit {
  id: string
  text: string
  score: string
}

interface StrategyResult {
  hits: Hit[]
  answer: string
  note: string
}

interface Scenario {
  label: string
  query: string
  vector: StrategyResult
  keyword: StrategyResult
  hybrid: StrategyResult
}

const scenarios: Scenario[] = [
  {
    label: '语义型提问',
    query: '数据改了页面自己变，是怎么实现的？',
    vector: {
      hits: [
        { id: 'd2', text: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。', score: '0.88' },
        { id: 'd4', text: 'ref 适合基本类型，取值需 .value；reactive 适合对象，访问无需 .value。', score: '0.61' },
      ],
      answer: '数据改动自动更新，靠的是响应式系统：ref 与 reactive 通过 Proxy 追踪依赖——读取时收集依赖，修改时触发更新（来源 [d2]）。',
      note: '换了说法也能按语义召回，这正是向量的强项。',
    },
    keyword: {
      hits: [],
      answer: '未命中任何文档：查询里没有出现「响应式」「ref」等字面词，尽管知识库里明明有答案。',
      note: '关键词检索只认字面词——换个说法就全瞎。',
    },
    hybrid: {
      hits: [
        { id: 'd2', text: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。', score: 'RRF 0.032' },
        { id: 'd4', text: 'ref 适合基本类型，取值需 .value；reactive 适合对象，访问无需 .value。', score: 'RRF 0.016' },
      ],
      answer: '数据自动更新来自响应式系统：ref 与 reactive 通过 Proxy 收集依赖、触发更新（来源 [d2][d4]）。语义召回补上了关键词的盲区。',
      note: '一路失手没关系，另一路仍然稳。',
    },
  },
  {
    label: '术语型提问',
    query: 'ref 和 reactive 有什么区别？',
    vector: {
      hits: [
        { id: 'd2', text: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。', score: '0.84' },
        { id: 'd4', text: 'ref 适合基本类型，取值需 .value；reactive 适合对象，访问无需 .value。', score: '0.83' },
      ],
      answer: 'ref 与 reactive 都基于 Proxy 追踪依赖；区别在于 ref 适合基本类型、取值需 .value，reactive 适合对象、访问无需 .value（来源 [d2][d4]）。',
      note: '术语在库里，语义命中没问题。',
    },
    keyword: {
      hits: [
        { id: 'd2', text: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。', score: '命中 2 词' },
        { id: 'd4', text: 'ref 适合基本类型，取值需 .value；reactive 适合对象，访问无需 .value。', score: '命中 2 词' },
      ],
      answer: 'ref 与 reactive 的区别：ref 适合基本类型、需 .value；reactive 适合对象、无需 .value（来源 [d2][d4]）。',
      note: '精确术语一抓一个准。',
    },
    hybrid: {
      hits: [
        { id: 'd4', text: 'ref 适合基本类型，取值需 .value；reactive 适合对象，访问无需 .value。', score: 'RRF 0.033' },
        { id: 'd2', text: '响应式原理：ref 与 reactive 通过 Proxy 追踪依赖，触发更新。', score: 'RRF 0.032' },
      ],
      answer: 'ref 与 reactive 都通过 Proxy 追踪依赖；用法上 ref 适合基本类型（需 .value）、reactive 适合对象（无需 .value）（来源 [d2][d4]）。两路召回一致指向同一对文档，结论最稳。',
      note: '双路一致时置信度最高。',
    },
  },
]

const activeIndex = ref(0)
const running = ref(false)
const visible = ref({ vector: 0, keyword: 0, hybrid: 0 })

const scenario = computed(() => scenarios[activeIndex.value])

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  if (running.value) return
  running.value = true
  visible.value = { vector: 0, keyword: 0, hybrid: 0 }

  const order: ('vector' | 'keyword' | 'hybrid')[] = ['vector', 'keyword', 'hybrid']
  for (const key of order) {
    const hits = scenario.value[key].hits
    for (let i = 0; i < Math.max(hits.length, 1); i++) {
      await sleep(360)
      visible.value[key] = i + 1
    }
    await sleep(260)
  }
  running.value = false
}

const strategies = [
  { key: 'vector' as const, name: '向量检索', sub: '按语义相似度召回' },
  { key: 'keyword' as const, name: '关键词检索', sub: '按字面词频打分' },
  { key: 'hybrid' as const, name: '混合检索', sub: '双路召回 + RRF 融合' },
]
</script>

<template>
  <div class="demo-card demo-container">
    <h3>三种检索策略同题对比</h3>
    <p class="demo-desc">
      同一个问题分别交给向量、关键词与混合检索。切换提问方式再跑一次：语义型提问看关键词如何失手，术语型提问看两路如何互证。
    </p>

    <div class="controls">
      <button
        v-for="(s, i) in scenarios"
        :key="s.label"
        class="mini-btn"
        :class="{ active: activeIndex === i }"
        type="button"
        :disabled="running"
        @click="activeIndex = i"
      >
        {{ s.label }}
      </button>
      <button class="btn" type="button" :disabled="running" @click="run">{{ running ? '检索中…' : '运行三路检索' }}</button>
    </div>
    <p class="hint">当前查询：「{{ scenario.query }}」</p>

    <div class="grid-3">
      <div v-for="s in strategies" :key="s.key" class="demo-panel">
        <h4>{{ s.name }} <small>{{ s.sub }}</small></h4>
        <p v-if="!visible[s.key]" class="hint">等待检索…</p>
        <div v-for="hit in scenario[s.key].hits.slice(0, visible[s.key])" :key="hit.id" class="log-line">
          <code>[{{ hit.id }}]</code>
          <span>{{ hit.text }}</span>
          <span class="badge warning">{{ hit.score }}</span>
        </div>
        <p v-if="visible[s.key] && !scenario[s.key].hits.length" class="log-line">
          <span class="badge error">未命中</span>
        </p>
        <div v-if="visible[s.key]" class="tips-box">
          <strong>回答：</strong>{{ scenario[s.key].answer }}
          <p class="hint" style="margin-top: 6px">{{ scenario[s.key].note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
