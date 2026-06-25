<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'config' | 'coverage' | 'mock'

interface CoverageItem {
  file: string
  statements: number
  branches: number
  functions: number
  lines: number
}

interface TestSuite {
  name: string
  status: 'idle' | 'running' | 'pass' | 'fail'
  tests: number
  passed: number
  duration: number
}

const activeTab = ref<TabKey>('config')
const isRunning = ref(false)

const coverageData: CoverageItem[] = [
  { file: 'src/utils/format.ts', statements: 95, branches: 88, functions: 100, lines: 96 },
  { file: 'src/utils/validate.ts', statements: 82, branches: 75, functions: 90, lines: 84 },
  { file: 'src/composables/useAuth.ts', statements: 91, branches: 85, functions: 95, lines: 92 },
  { file: 'src/stores/user.ts', statements: 78, branches: 70, functions: 82, lines: 80 },
  { file: 'src/components/Button.vue', statements: 100, branches: 95, functions: 100, lines: 100 },
]

const testSuites = ref<TestSuite[]>([
  { name: 'utils/format.test.ts', status: 'idle', tests: 12, passed: 0, duration: 450 },
  { name: 'utils/validate.test.ts', status: 'idle', tests: 18, passed: 0, duration: 520 },
  { name: 'composables/useAuth.test.ts', status: 'idle', tests: 8, passed: 0, duration: 380 },
  { name: 'stores/user.test.ts', status: 'idle', tests: 15, passed: 0, duration: 600 },
  { name: 'components/Button.test.ts', status: 'idle', tests: 10, passed: 0, duration: 420 },
])

const totalTests = computed(() => testSuites.value.reduce((sum, s) => sum + s.tests, 0))
const totalPassed = computed(() => testSuites.value.reduce((sum, s) => sum + s.passed, 0))
const totalDuration = computed(() => testSuites.value.reduce((sum, s) => sum + (s.status === 'pass' ? s.duration : 0), 0))

const getCoverageColor = (val: number) => {
  if (val >= 90) return '#65a30d'
  if (val >= 80) return '#e8a05a'
  return '#dc2626'
}

const getCoverageBg = (val: number) => {
  if (val >= 90) return 'rgba(101, 163, 13, 0.1)'
  if (val >= 80) return 'rgba(232, 160, 90, 0.1)'
  return 'rgba(220, 38, 38, 0.1)'
}

const configExample = `<span style="color:#8a8a3a">// vitest.config.ts</span>
<span style="color:#c586c0">import</span> { defineConfig } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'vitest/config'</span>
<span style="color:#c586c0">import</span> Vue <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@vitejs/plugin-vue'</span>

<span style="color:#c586c0">export default</span> <span style="color:#dcdcaa">defineConfig</span>({
  <span style="color:#9cdcfe">plugins</span>: [<span style="color:#dcdcaa">Vue</span>()],
  <span style="color:#9cdcfe">test</span>: {
    <span style="color:#9cdcfe">environment</span>: <span style="color:#ce9178">'jsdom'</span>,
    <span style="color:#9cdcfe">globals</span>: <span style="color:#569cd6">true</span>,
    <span style="color:#9cdcfe">include</span>: [<span style="color:#ce9178">'src/**/*.{test,spec}.{ts,vue}'</span>],
    <span style="color:#9cdcfe">setupFiles</span>: [<span style="color:#ce9178">'./src/test/setup.ts'</span>],

    <span style="color:#7c7c99">// 覆盖率配置</span>
    <span style="color:#9cdcfe">coverage</span>: {
      <span style="color:#9cdcfe">provider</span>: <span style="color:#ce9178">'v8'</span>,
      <span style="color:#9cdcfe">reporter</span>: [<span style="color:#ce9178">'text'</span>, <span style="color:#ce9178">'html'</span>, <span style="color:#ce9178">'lcov'</span>],
      <span style="color:#9cdcfe">include</span>: [<span style="color:#ce9178">'src/**/*.{ts,vue}'</span>],
      <span style="color:#9cdcfe">exclude</span>: [
        <span style="color:#ce9178">'src/**/*.d.ts'</span>,
        <span style="color:#ce9178">'src/main.ts'</span>,
        <span style="color:#ce9178">'src/router/index.ts'</span>,
      ],
      <span style="color:#9cdcfe">thresholds</span>: {
        <span style="color:#9cdcfe">statements</span>: <span style="color:#b5cea8">80</span>,
        <span style="color:#9cdcfe">branches</span>: <span style="color:#b5cea8">75</span>,
        <span style="color:#9cdcfe">functions</span>: <span style="color:#b5cea8">80</span>,
        <span style="color:#9cdcfe">lines</span>: <span style="color:#b5cea8">80</span>,
      },
    },

    <span style="color:#7c7c99">// 别名配置（与 Vite 保持一致）</span>
    <span style="color:#9cdcfe">alias</span>: {
      <span style="color:#ce9178">'@'</span>: <span style="color:#dcdcaa">resolve</span>(__dirname, <span style="color:#ce9178">'./src'</span>),
    },
  },
})`

const mockExample = `<span style="color:#8a8a3a">// useAuth.test.ts</span>
<span style="color:#c586c0">import</span> { describe, it, expect, vi, beforeEach } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'vitest'</span>
<span style="color:#c586c0">import</span> { useAuth } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@/composables/useAuth'</span>

<span style="color:#7c7c99">// Mock 整个模块</span>
vi.<span style="color:#dcdcaa">mock</span>(<span style="color:#ce9178">'@/api/auth'</span>, () => ({
  <span style="color:#dcdcaa">login</span>: vi.<span style="color:#dcdcaa">fn</span>().<span style="color:#dcdcaa">mockResolvedValue</span>({
    <span style="color:#9cdcfe">token</span>: <span style="color:#ce9178">'fake-token'</span>,
    <span style="color:#9cdcfe">user</span>: { <span style="color:#9cdcfe">id</span>: <span style="color:#b5cea8">1</span>, <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'Test User'</span> },
  }),
}))

<span style="color:#dcdcaa">describe</span>(<span style="color:#ce9178">'useAuth'</span>, () => {
  <span style="color:#dcdcaa">beforeEach</span>(() => {
    vi.<span style="color:#dcdcaa">clearAllMocks</span>()
    localStorage.<span style="color:#dcdcaa">clear</span>()
  })

  <span style="color:#dcdcaa">it</span>(<span style="color:#ce9178">'登录成功后存储 token'</span>, <span style="color:#569cd6">async</span> () => {
    <span style="color:#c586c0">const</span> { login, isAuthenticated, user } = <span style="color:#dcdcaa">useAuth</span>()

    <span style="color:#c586c0">await</span> <span style="color:#dcdcaa">login</span>(<span style="color:#ce9178">'test@example.com'</span>, <span style="color:#ce9178">'password'</span>)

    <span style="color:#4ec9b0">expect</span>(isAuthenticated.value).<span style="color:#dcdcaa">toBe</span>(<span style="color:#569cd6">true</span>)
    <span style="color:#4ec9b0">expect</span>(user.value?.name).<span style="color:#dcdcaa">toBe</span>(<span style="color:#ce9178">'Test User'</span>)
    <span style="color:#4ec9b0">expect</span>(localStorage.<span style="color:#dcdcaa">getItem</span>(<span style="color:#ce9178">'token'</span>)).<span style="color:#dcdcaa">toBe</span>(<span style="color:#ce9178">'fake-token'</span>)
  })

  <span style="color:#dcdcaa">it</span>(<span style="color:#ce9178">'登出后清除认证状态'</span>, () => {
    <span style="color:#c586c0">const</span> { logout, isAuthenticated } = <span style="color:#dcdcaa">useAuth</span>()
    localStorage.<span style="color:#dcdcaa">setItem</span>(<span style="color:#ce9178">'token'</span>, <span style="color:#ce9178">'old-token'</span>)

    <span style="color:#dcdcaa">logout</span>()

    <span style="color:#4ec9b0">expect</span>(isAuthenticated.value).<span style="color:#dcdcaa">toBe</span>(<span style="color:#569cd6">false</span>)
    <span style="color:#4ec9b0">expect</span>(localStorage.<span style="color:#dcdcaa">getItem</span>(<span style="color:#ce9178">'token'</span>)).<span style="color:#dcdcaa">toBeNull</span>()
  })
})`

async function runTests() {
  if (isRunning.value) return
  isRunning.value = true
  testSuites.value.forEach(s => { s.status = 'idle'; s.passed = 0 })

  for (const suite of testSuites.value) {
    suite.status = 'running'
    await new Promise(r => setTimeout(r, suite.duration))
    suite.status = 'pass'
    suite.passed = suite.tests
  }

  isRunning.value = false
}

function resetTests() {
  testSuites.value.forEach(s => { s.status = 'idle'; s.passed = 0 })
}
</script>

<template>
  <div class="demo-card">
    <h3>Vitest 高级配置与覆盖率报告</h3>
    <p class="demo-hint">Vitest 是基于 Vite 的极速单元测试框架，支持 HMR、原生 ESM、覆盖率报告等特性。合理配置可以大幅提升测试效率。</p>

    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置详解</button>
      <button class="tab-btn" :class="{ active: activeTab === 'coverage' }" @click="activeTab = 'coverage'">覆盖率报告</button>
      <button class="tab-btn" :class="{ active: activeTab === 'mock' }" @click="activeTab = 'mock'">Mock 测试</button>
    </div>

    <div v-if="activeTab === 'config'">
      <pre class="mini-code" v-html="configExample"></pre>
      <div class="tips-box">
        <p><strong>配置要点：</strong></p>
        <ul>
          <li><code>environment: 'jsdom'</code>：测试 Vue 组件时需要浏览器环境</li>
          <li><code>globals: true</code>：全局注入 describe/it/expect，无需手动导入</li>
          <li><code>setupFiles</code>：测试前执行的初始化文件（如全局 mock）</li>
          <li><code>thresholds</code>：设置覆盖率门禁，低于阈值测试失败</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'coverage'">
      <div class="coverage-summary">
        <div class="coverage-stat">
          <span class="stat-label">语句覆盖率</span>
          <span class="stat-value" style="color: #65a30d;">89.2%</span>
          <div class="progress-bar"><div class="progress-fill" style="width: 89.2%; background: #65a30d;"></div></div>
        </div>
        <div class="coverage-stat">
          <span class="stat-label">分支覆盖率</span>
          <span class="stat-value" style="color: #e8a05a;">82.6%</span>
          <div class="progress-bar"><div class="progress-fill" style="width: 82.6%; background: #e8a05a;"></div></div>
        </div>
        <div class="coverage-stat">
          <span class="stat-label">函数覆盖率</span>
          <span class="stat-value" style="color: #65a30d;">93.4%</span>
          <div class="progress-bar"><div class="progress-fill" style="width: 93.4%; background: #65a30d;"></div></div>
        </div>
        <div class="coverage-stat">
          <span class="stat-label">行覆盖率</span>
          <span class="stat-value" style="color: #65a30d;">90.5%</span>
          <div class="progress-bar"><div class="progress-fill" style="width: 90.5%; background: #65a30d;"></div></div>
        </div>
      </div>

      <table style="margin-top: 12px;">
        <thead>
          <tr>
            <th>文件</th>
            <th>语句</th>
            <th>分支</th>
            <th>函数</th>
            <th>行</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in coverageData" :key="item.file">
            <td><code>{{ item.file }}</code></td>
            <td :style="{ color: getCoverageColor(item.statements), background: getCoverageBg(item.statements) }">{{ item.statements }}%</td>
            <td :style="{ color: getCoverageColor(item.branches), background: getCoverageBg(item.branches) }">{{ item.branches }}%</td>
            <td :style="{ color: getCoverageColor(item.functions), background: getCoverageBg(item.functions) }">{{ item.functions }}%</td>
            <td :style="{ color: getCoverageColor(item.lines), background: getCoverageBg(item.lines) }">{{ item.lines }}%</td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>覆盖率阈值建议：</strong>语句 ≥ 80%，分支 ≥ 75%。核心模块（工具函数、状态管理）应追求更高覆盖率。</p>
      </div>
    </div>

    <div v-if="activeTab === 'mock'">
      <div class="test-runner">
        <div class="test-header">
          <strong>测试运行</strong>
          <div class="test-summary">
            <span class="pass-count">{{ totalPassed }}/{{ totalTests }}</span>
            <span v-if="totalDuration > 0" class="duration">{{ totalDuration }}ms</span>
          </div>
        </div>
        <div class="suite-list">
          <div v-for="suite in testSuites" :key="suite.name" class="suite-item" :class="suite.status">
            <span class="suite-icon">
              {{ suite.status === 'pass' ? '✓' : suite.status === 'fail' ? '✗' : suite.status === 'running' ? '◐' : '○' }}
            </span>
            <span class="suite-name">{{ suite.name }}</span>
            <span class="suite-tests">{{ suite.passed || 0 }}/{{ suite.tests }}</span>
            <span v-if="suite.status === 'pass'" class="suite-duration">{{ suite.duration }}ms</span>
          </div>
        </div>
        <div class="test-actions">
          <button @click="runTests" :disabled="isRunning">
            {{ isRunning ? '运行中...' : '运行测试' }}
          </button>
          <button class="secondary" @click="resetTests" :disabled="isRunning">重置</button>
        </div>
      </div>
      <pre class="mini-code" v-html="mockExample" style="margin-top: 12px;"></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-hint { color: #8a6d42; font-size: 13px; margin-bottom: 12px; }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box p { margin: 4px 0; font-size: 13px; }
.tips-box ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
.tips-box li { margin: 2px 0; }
.tips-box code { background: rgba(232, 93, 4, 0.1); padding: 1px 4px; border-radius: 3px; }
.coverage-summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.coverage-stat { background: #fffaf5; padding: 10px 12px; border-radius: 6px; border: 1px solid #e0d5c8; }
.stat-label { display: block; font-size: 12px; color: #8a6d42; margin-bottom: 4px; }
.stat-value { font-size: 18px; font-weight: bold; }
.progress-bar { height: 6px; background: #f0e8e0; border-radius: 3px; margin-top: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.test-runner { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 8px; padding: 14px; }
.test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e8d5c0; }
.test-summary { display: flex; gap: 10px; font-size: 13px; align-items: center; }
.pass-count { color: #65a30d; font-weight: bold; }
.duration { color: #999; }
.suite-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.suite-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 4px; background: #fff; border: 1px solid #e8e0d8; transition: all 0.2s; }
.suite-item.running { border-color: #e8713a; background: rgba(232, 113, 58, 0.08); }
.suite-item.pass { border-color: #65a30d; background: rgba(101, 163, 13, 0.06); }
.suite-icon { width: 20px; text-align: center; font-size: 14px; }
.suite-item.running .suite-icon { color: #e85d04; animation: spin 1s linear infinite; }
.suite-item.pass .suite-icon { color: #65a30d; }
.suite-name { flex: 1; font-size: 13px; font-family: monospace; }
.suite-tests { font-size: 12px; color: #666; }
.suite-duration { font-size: 11px; color: #999; }
.test-actions { display: flex; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 5px; background: #e85d04; color: #fff; cursor: pointer; font-size: 13px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.secondary { background: #f5f0eb; color: #6b5a45; border: 1px solid #d4c4b0; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
