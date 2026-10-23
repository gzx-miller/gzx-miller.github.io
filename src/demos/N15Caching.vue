<script setup lang="ts">
import { computed, ref } from 'vue'

interface CacheRow {
  time: string
  request: string
  status: string
  source: string
  tone: 'success' | 'warning' | 'error'
}

const ttl = ref(5)
const gap = ref(3)
const concurrency = ref(4)
const clock = ref(0)
const expiresAt = ref(-1)
const totalRequests = ref(0)
const hits = ref(0)
const loads = ref(0)
const rows = ref<CacheRow[]>([])

const ttlOptions = [2, 5, 10]
const gapOptions = [1, 3, 8]

const hitRate = computed(() =>
  totalRequests.value === 0 ? 0 : Math.round((hits.value / totalRequests.value) * 100),
)
const remainingTtl = computed(() => Math.max(0, expiresAt.value - clock.value))
const cacheState = computed(() =>
  expiresAt.value > clock.value ? `有效，剩余 ${remainingTtl.value}s` : '为空或已过期',
)
const cacheKey = 'course:v2:42:zh-CN:public'

const sampleCode = `const key = buildKey(id, locale)   // course:v2:42:zh-CN:public

const cached = await this.cache.get<CourseDetail>(key)
if (cached !== undefined) return cached   // null 也算命中

const course = await this.repo.findOneBy({ id })
if (!course) {
  await this.cache.set(key, null, 30_000)  // 空值短 TTL，挡住穿透
  return null
}

const jitter = Math.floor(Math.random() * 5_000)
await this.cache.set(key, detail, 60_000 + jitter)  // TTL 抖动`

function record(row: CacheRow) {
  rows.value.push(row)
  if (rows.value.length > 24) rows.value = rows.value.slice(-24)
}

function runRound() {
  clock.value += gap.value
  const alive = clock.value < expiresAt.value
  let loading = false

  for (let i = 1; i <= concurrency.value; i++) {
    totalRequests.value += 1
    const request = `#${totalRequests.value}`

    if (alive) {
      hits.value += 1
      record({ time: `t=${clock.value}s`, request, status: '命中', source: '缓存直接返回', tone: 'success' })
    } else if (!loading) {
      loading = true
      loads.value += 1
      expiresAt.value = clock.value + ttl.value
      record({ time: `t=${clock.value}s`, request, status: '未命中 → 回源', source: '查询数据库并写缓存', tone: 'error' })
    } else {
      hits.value += 1
      record({ time: `t=${clock.value}s`, request, status: 'single-flight 合并', source: '等待同一次回源', tone: 'warning' })
    }
  }
}

function resetAndRun() {
  clock.value = 0
  expiresAt.value = -1
  totalRequests.value = 0
  hits.value = 0
  loads.value = 0
  rows.value = []
  runRound()
}

function chooseTtl(value: number) {
  ttl.value = value
  resetAndRun()
}

function chooseGap(value: number) {
  gap.value = value
  resetAndRun()
}

function clearCache() {
  expiresAt.value = -1
  record({
    time: `t=${clock.value}s`,
    request: '—',
    status: '手动删除缓存键',
    source: 'cache.del(key)',
    tone: 'warning',
  })
}

runRound()
</script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h3>🌰 课程详情缓存 · 命中率与回源</h3>
      <p class="hint" style="margin-bottom: 12px">
        课程 42 的详情接口先查缓存、未命中再查数据库。调整 TTL、请求间隔与并发数，
        观察每一轮请求里谁命中、谁回源，以及总回源次数。
      </p>

      <div class="tab-bar">
        <span class="hint">TTL</span>
        <button
          v-for="value in ttlOptions"
          :key="value"
          class="tab-btn"
          :class="{ active: ttl === value }"
          @click="chooseTtl(value)"
        >
          {{ value }}s
        </button>
      </div>

      <div class="tab-bar">
        <span class="hint">请求间隔</span>
        <button
          v-for="value in gapOptions"
          :key="value"
          class="tab-btn"
          :class="{ active: gap === value }"
          @click="chooseGap(value)"
        >
          {{ value }}s
        </button>
      </div>

      <div class="controls">
        <label>
          每轮并发
          <select v-model.number="concurrency" @change="resetAndRun">
            <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <button class="mini-btn" @click="runRound">再来一轮请求</button>
        <button class="mini-btn" @click="clearCache">删除缓存键</button>
      </div>

      <div class="grid-3" style="margin-bottom: 12px">
        <div class="demo-panel">
          总请求
          <strong style="display: block; font-size: 20px">{{ totalRequests }}</strong>
        </div>
        <div class="demo-panel">
          命中
          <strong style="display: block; font-size: 20px">{{ hits }}</strong>
        </div>
        <div class="demo-panel">
          回源次数
          <strong style="display: block; font-size: 20px">{{ loads }}</strong>
        </div>
      </div>

      <p class="status-panel">
        当前 t={{ clock }}s · 缓存{{ cacheState }} · 命中率
        <span class="badge" :class="hitRate >= 60 ? 'success' : 'warning'">{{ hitRate }}%</span>
      </p>

      <div class="prop-table" style="margin-top: 12px">
        <table>
          <thead>
            <tr>
              <th>时刻</th>
              <th>请求</th>
              <th>结果</th>
              <th>数据来源</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td>{{ row.time }}</td>
              <td>{{ row.request }}</td>
              <td>
                <span class="badge" :class="row.tone">{{ row.status }}</span>
              </td>
              <td>{{ row.source }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 style="margin: 16px 0 8px">🔧 缓存键与写缓存</h4>
      <pre class="mini-code"><code>// 键必须覆盖影响结果的全部维度
{{ cacheKey }}

{{ sampleCode }}</code></pre>

      <div class="tips-box">
        <strong>三种失效要分开处理：</strong>穿透是查不存在的数据，用空值短 TTL 或布隆过滤器挡住；
        击穿是热点键过期瞬间的并发回源，用进程内 single-flight 或分布式互斥合并请求；
        雪崩是大量键同时过期，用 TTL 随机抖动、多级缓存与限流降级兜底。
      </div>
    </div>
  </div>
</template>
