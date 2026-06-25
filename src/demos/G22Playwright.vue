<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'locator' | 'assertion' | 'fixture'

interface LocatorMethod {
  name: string
  selector: string
  description: string
  recommended: boolean
}

interface TestStep {
  id: number
  action: string
  status: 'idle' | 'running' | 'pass' | 'fail'
  duration: number
}

const activeTab = ref<TabKey>('locator')
const isRunning = ref(false)
const currentTestIndex = ref(0)

const locatorMethods: LocatorMethod[] = [
  { name: 'getByRole', selector: 'page.getByRole("button", { name: "提交" })', description: '按 ARIA 角色和名称定位，最推荐', recommended: true },
  { name: 'getByLabel', selector: 'page.getByLabel("用户名")', description: '按表单 label 文本定位', recommended: true },
  { name: 'getByPlaceholder', selector: 'page.getByPlaceholder("请输入邮箱")', description: '按 placeholder 文本定位', recommended: true },
  { name: 'getByText', selector: 'page.getByText("欢迎回来")', description: '按元素文本内容定位', recommended: false },
  { name: 'getByTestId', selector: 'page.getByTestId("submit-btn")', description: '按 data-testid 属性定位', recommended: false },
  { name: 'locator (CSS)', selector: 'page.locator(".btn-primary")', description: 'CSS 选择器，不推荐用于不稳定 UI', recommended: false },
]

const testSteps = ref<TestStep[]>([
  { id: 1, action: '导航到登录页', status: 'idle', duration: 300 },
  { id: 2, action: '填写用户名: test@example.com', status: 'idle', duration: 400 },
  { id: 3, action: '填写密码: ********', status: 'idle', duration: 400 },
  { id: 4, action: '点击"登录"按钮', status: 'idle', duration: 350 },
  { id: 5, action: '断言URL包含 /dashboard', status: 'idle', duration: 250 },
  { id: 6, action: '断言页面包含"欢迎回来"', status: 'idle', duration: 200 },
])

const passedCount = computed(() => testSteps.value.filter(s => s.status === 'pass').length)
const failedCount = computed(() => testSteps.value.filter(s => s.status === 'fail').length)

const codeExample = `<span style="color:#8a8a3a">// login.spec.ts</span>
<span style="color:#c586c0">import</span> { test, expect } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@playwright/test'</span>

<span style="color:#c586c0">test</span>(<span style="color:#ce9178">'用户登录流程'</span>, <span style="color:#569cd6">async</span> ({ page }) => {
  <span style="color:#7c7c99">// 1. 导航到登录页</span>
  <span style="color:#c586c0">await</span> page.<span style="color:#dcdcaa">goto</span>(<span style="color:#ce9178">'/login'</span>)

  <span style="color:#7c7c99">// 2. 使用 getByLabel 定位输入框（推荐）</span>
  <span style="color:#c586c0">await</span> page.<span style="color:#dcdcaa">getByLabel</span>(<span style="color:#ce9178">'用户名'</span>).<span style="color:#dcdcaa">fill</span>(<span style="color:#ce9178">'test@example.com'</span>)
  <span style="color:#c586c0">await</span> page.<span style="color:#dcdcaa">getByLabel</span>(<span style="color:#ce9178">'密码'</span>).<span style="color:#dcdcaa">fill</span>(<span style="color:#ce9178">'password123'</span>)

  <span style="color:#7c7c99">// 3. 使用 getByRole 定位按钮（最推荐）</span>
  <span style="color:#c586c0">await</span> page.<span style="color:#dcdcaa">getByRole</span>(<span style="color:#ce9178">'button'</span>, { <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'登录'</span> }).<span style="color:#dcdcaa">click</span>()

  <span style="color:#7c7c99">// 4. 断言跳转成功</span>
  <span style="color:#c586c0">await</span> <span style="color:#4ec9b0">expect</span>(page).<span style="color:#dcdcaa">toHaveURL</span>(<span style="color:#ce9178">/\/dashboard/</span>)
  <span style="color:#c586c0">await</span> <span style="color:#4ec9b0">expect</span>(page.<span style="color:#dcdcaa">getByText</span>(<span style="color:#ce9178">'欢迎回来'</span>)).<span style="color:#dcdcaa">toBeVisible</span>()
})

<span style="color:#8a8a3a">// playwright.config.ts</span>
<span style="color:#c586c0">import</span> { defineConfig, devices } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@playwright/test'</span>

<span style="color:#c586c0">export default</span> <span style="color:#dcdcaa">defineConfig</span>({
  <span style="color:#9cdcfe">testDir</span>: <span style="color:#ce9178">'./tests/e2e'</span>,
  <span style="color:#9cdcfe">fullyParallel</span>: <span style="color:#569cd6">true</span>,
  <span style="color:#9cdcfe">use</span>: {
    <span style="color:#9cdcfe">baseURL</span>: <span style="color:#ce9178">'http://localhost:5173'</span>,
    <span style="color:#9cdcfe">trace</span>: <span style="color:#ce9178">'on-first-retry'</span>,
  },
  <span style="color:#9cdcfe">projects</span>: [
    { <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'chromium'</span>, <span style="color:#9cdcfe">use</span>: { ...devices[<span style="color:#ce9178">'Desktop Chrome'</span>] } },
    { <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'firefox'</span>, <span style="color:#9cdcfe">use</span>: { ...devices[<span style="color:#ce9178">'Desktop Firefox'</span>] } },
  ],
})`

async function runTest() {
  if (isRunning.value) return
  isRunning.value = true
  testSteps.value.forEach(s => s.status = 'idle')

  for (const step of testSteps.value) {
    step.status = 'running'
    await new Promise(r => setTimeout(r, step.duration))
    step.status = 'pass'
  }

  isRunning.value = false
}

function resetTest() {
  testSteps.value.forEach(s => s.status = 'idle')
}
</script>

<template>
  <div class="demo-card">
    <h3>Playwright E2E 测试与元素定位</h3>
    <p class="demo-hint">Playwright 是现代 E2E 测试框架，支持多浏览器、自动等待、追踪录制等特性。掌握正确的元素定位策略是写出稳定测试的关键。</p>

    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'locator' }" @click="activeTab = 'locator'">定位策略</button>
      <button class="tab-btn" :class="{ active: activeTab === 'assertion' }" @click="activeTab = 'assertion'">断言方法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'fixture' }" @click="activeTab = 'fixture'">测试演示</button>
    </div>

    <div v-if="activeTab === 'locator'">
      <div class="locator-list">
        <div v-for="method in locatorMethods" :key="method.name" class="locator-item" :class="{ recommended: method.recommended }">
          <div class="locator-header">
            <strong>{{ method.name }}</strong>
            <span v-if="method.recommended" class="badge">推荐</span>
            <span v-else class="badge secondary">备用</span>
          </div>
          <code class="selector">{{ method.selector }}</code>
          <p class="desc">{{ method.description }}</p>
        </div>
      </div>
      <div class="tips-box">
        <p><strong>定位优先级：</strong>getByRole > getByLabel > getByPlaceholder > getByText > getByTestId > CSS选择器</p>
        <p><strong>核心原则：</strong>优先使用用户可感知的方式（角色、文本）定位，测试更贴近真实使用场景。</p>
      </div>
    </div>

    <div v-if="activeTab === 'assertion'">
      <table>
        <thead><tr><th>断言方法</th><th>用途</th><th>自动等待</th></tr></thead>
        <tbody>
          <tr><td><code>expect(locator).toBeVisible()</code></td><td>元素可见</td><td><span class="ok">✅</span></td></tr>
          <tr><td><code>expect(locator).toHaveText()</code></td><td>元素包含文本</td><td><span class="ok">✅</span></td></tr>
          <tr><td><code>expect(locator).toBeEnabled()</code></td><td>元素可交互</td><td><span class="ok">✅</span></td></tr>
          <tr><td><code>expect(page).toHaveURL()</code></td><td>页面URL匹配</td><td><span class="ok">✅</span></td></tr>
          <tr><td><code>expect(page).toHaveTitle()</code></td><td>页面标题匹配</td><td><span class="ok">✅</span></td></tr>
          <tr><td><code>expect(locator).toHaveCount()</code></td><td>元素数量匹配</td><td><span class="ok">✅</span></td></tr>
        </tbody>
      </table>
      <pre class="mini-code" v-html="codeExample" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'fixture'">
      <div class="test-runner">
        <div class="test-header">
          <strong>登录流程测试</strong>
          <div class="test-stats">
            <span class="pass-stat">通过: {{ passedCount }}</span>
            <span class="fail-stat">失败: {{ failedCount }}</span>
          </div>
        </div>
        <div class="test-steps">
          <div v-for="step in testSteps" :key="step.id" class="test-step" :class="step.status">
            <span class="step-icon">
              {{ step.status === 'pass' ? '✓' : step.status === 'fail' ? '✗' : step.status === 'running' ? '◐' : '○' }}
            </span>
            <span class="step-text">{{ step.action }}</span>
            <span v-if="step.status === 'pass'" class="step-duration">{{ step.duration }}ms</span>
          </div>
        </div>
        <div class="test-actions">
          <button @click="runTest" :disabled="isRunning">
            {{ isRunning ? '运行中...' : '运行测试' }}
          </button>
          <button class="secondary" @click="resetTest" :disabled="isRunning">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-hint { color: #8a6d42; font-size: 13px; margin-bottom: 12px; }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.locator-list { display: flex; flex-direction: column; gap: 10px; }
.locator-item { padding: 10px 12px; border-radius: 6px; border: 1px solid #e0d5c8; background: #fffaf5; }
.locator-item.recommended { border-color: #e8a05a; background: #fff5eb; }
.locator-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; background: #e85d04; color: #fff; }
.badge.secondary { background: #999; }
.selector { display: block; padding: 6px 8px; background: #1e1e2e; color: #ce9178; border-radius: 4px; font-size: 12px; margin-bottom: 6px; }
.desc { margin: 0; font-size: 12px; color: #6b5a45; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box p { margin: 4px 0; font-size: 13px; }
.tips-box code { background: rgba(232, 93, 4, 0.1); padding: 1px 4px; border-radius: 3px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.ok { color: #65a30d; font-weight: bold; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.test-runner { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 8px; padding: 14px; }
.test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e8d5c0; }
.test-stats { display: flex; gap: 12px; font-size: 13px; }
.pass-stat { color: #65a30d; font-weight: bold; }
.fail-stat { color: #dc2626; font-weight: bold; }
.test-steps { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.test-step { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 4px; background: #fff; border: 1px solid #e8e0d8; transition: all 0.2s; }
.test-step.running { border-color: #e8713a; background: rgba(232, 113, 58, 0.08); }
.test-step.pass { border-color: #65a30d; background: rgba(101, 163, 13, 0.06); }
.test-step.fail { border-color: #dc2626; background: rgba(220, 38, 38, 0.06); }
.step-icon { width: 20px; text-align: center; font-size: 14px; }
.test-step.running .step-icon { color: #e85d04; animation: spin 1s linear infinite; }
.test-step.pass .step-icon { color: #65a30d; }
.test-step.fail .step-icon { color: #dc2626; }
.step-text { flex: 1; font-size: 13px; }
.step-duration { font-size: 11px; color: #999; }
.test-actions { display: flex; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 5px; background: #e85d04; color: #fff; cursor: pointer; font-size: 13px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.secondary { background: #f5f0eb; color: #6b5a45; border: 1px solid #d4c4b0; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
