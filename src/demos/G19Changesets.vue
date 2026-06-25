<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'workflow' | 'changeset' | 'publish'>('workflow')

interface PkgVersion {
  name: string
  current: string
  next: string
  bumpType: 'major' | 'minor' | 'patch' | 'none'
  changes: string[]
}

const packages = ref<PkgVersion[]>([
  {
    name: '@acme/core',
    current: '1.2.0',
    next: '1.3.0',
    bumpType: 'minor',
    changes: ['新增 useLocalStorage 组合式函数', '优化深拷贝性能'],
  },
  {
    name: '@acme/ui',
    current: '0.8.0',
    next: '0.9.0',
    bumpType: 'minor',
    changes: ['新增 Button 组件 variant 属性', '修复 Modal 关闭动画'],
  },
  {
    name: '@acme/web',
    current: '2.0.0',
    next: '2.1.0',
    bumpType: 'minor',
    changes: ['集成新版 UI 组件库', '用户中心页面重构'],
  },
  {
    name: '@acme/docs',
    current: '1.0.0',
    next: '1.0.1',
    bumpType: 'patch',
    changes: ['修复文档链接错误'],
  },
])

interface Changeset {
  id: string
  package: string
  type: 'major' | 'minor' | 'patch'
  summary: string
  released: boolean
}

const changesets = ref<Changeset[]>([
  { id: 'silver-dolphins-jump', package: '@acme/core', type: 'minor', summary: '新增 useLocalStorage 组合式函数', released: false },
  { id: 'orange-tigers-sing', package: '@acme/ui', type: 'minor', summary: '新增 Button 组件 variant 属性', released: false },
  { id: 'blue-whales-swim', package: '@acme/core', type: 'patch', summary: '优化深拷贝性能', released: false },
  { id: 'green-trees-grow', package: '@acme/docs', type: 'patch', summary: '修复文档链接错误', released: false },
])

const currentStep = ref(0)
const isPublishing = ref(false)

const workflowSteps = [
  { step: '开发', desc: '开发者在功能分支编写代码' },
  { step: '创建 changeset', desc: 'pnpm changeset 选择包和版本类型' },
  { step: '提交 PR', desc: 'changeset 文件随代码一起提交' },
  { step: '版本升级', desc: 'changeset version 生成 CHANGELOG 并更新版本' },
  { step: '发布', desc: 'changeset publish 发布到 npm' },
]

const newChangeset = ref({
  package: '@acme/core',
  type: 'patch' as 'major' | 'minor' | 'patch',
  summary: '',
})

const changesetConfigCode = `<span style="color:#8a8a3a"># .changeset/config.json</span>
{
  <span style="color:#cc997a">"$schema"</span>: <span style="color:#a3b380">"https://unpkg.com/@changesets/config@3.0.0/schema.json"</span>,
  <span style="color:#cc997a">"changelog"</span>: <span style="color:#a3b380">"@changesets/cli/changelog"</span>,
  <span style="color:#cc997a">"commit"</span>: <span style="color:#cc6666">false</span>,
  <span style="color:#cc997a">"fixed"</span>: [],
  <span style="color:#cc997a">"linked"</span>: [],
  <span style="color:#cc997a">"access"</span>: <span style="color:#a3b380">"restricted"</span>,
  <span style="color:#cc997a">"baseBranch"</span>: <span style="color:#a3b380">"main"</span>,
  <span style="color:#cc997a">"updateInternalDependencies"</span>: <span style="color:#a3b380">"patch"</span>,
  <span style="color:#cc997a">"ignore"</span>: []
}`

const changesetFileCode = `<span style="color:#8a8a3a"># .changeset/silver-dolphins-jump.md</span>
---
<span style="color:#cc997a">"@acme/core"</span>: minor
---

新增 useLocalStorage 组合式函数

支持持久化存储、SSR 兼容、
自定义序列化器等特性。`

const commandsCode = `<span style="color:#7c7c99"># 初始化 changesets</span>
pnpm add -Dw @changesets/cli
pnpm changeset init

<span style="color:#7c7c99"># 创建新的 changeset</span>
pnpm changeset

<span style="color:#7c7c99"># 升级版本并生成 CHANGELOG</span>
pnpm changeset version

<span style="color:#7c7c99"># 发布到 npm</span>
pnpm changeset publish

<span style="color:#7c7c99"># 查看待发布的 changeset</span>
pnpm changeset status`

const unreleasedCount = computed(() => changesets.value.filter(c => !c.released).length)

function addChangeset() {
  if (!newChangeset.value.summary.trim()) return
  
  const id = `${['silver', 'orange', 'blue', 'green', 'pink', 'purple'][Math.floor(Math.random() * 6)]}-${['dolphins', 'tigers', 'whales', 'trees', 'flowers', 'birds'][Math.floor(Math.random() * 6)]}-${['jump', 'sing', 'swim', 'grow', 'bloom', 'fly'][Math.floor(Math.random() * 6)]}`
  
  changesets.value.push({
    id,
    package: newChangeset.value.package,
    type: newChangeset.value.type,
    summary: newChangeset.value.summary,
    released: false,
  })
  
  newChangeset.value.summary = ''
}

function nextStep() {
  if (currentStep.value < workflowSteps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function runVersionBump() {
  isPublishing.value = true
  
  await new Promise(r => setTimeout(r, 800))
  
  changesets.value.forEach(c => {
    c.released = true
  })
  
  packages.value.forEach(p => {
    p.current = p.next
    p.bumpType = 'none'
    p.changes = []
  })
  
  isPublishing.value = false
}

function resetDemo() {
  currentStep.value = 0
  isPublishing.value = false
  changesets.value = [
    { id: 'silver-dolphins-jump', package: '@acme/core', type: 'minor', summary: '新增 useLocalStorage 组合式函数', released: false },
    { id: 'orange-tigers-sing', package: '@acme/ui', type: 'minor', summary: '新增 Button 组件 variant 属性', released: false },
    { id: 'blue-whales-swim', package: '@acme/core', type: 'patch', summary: '优化深拷贝性能', released: false },
    { id: 'green-trees-grow', package: '@acme/docs', type: 'patch', summary: '修复文档链接错误', released: false },
  ]
  packages.value = [
    { name: '@acme/core', current: '1.2.0', next: '1.3.0', bumpType: 'minor', changes: ['新增 useLocalStorage 组合式函数', '优化深拷贝性能'] },
    { name: '@acme/ui', current: '0.8.0', next: '0.9.0', bumpType: 'minor', changes: ['新增 Button 组件 variant 属性', '修复 Modal 关闭动画'] },
    { name: '@acme/web', current: '2.0.0', next: '2.1.0', bumpType: 'minor', changes: ['集成新版 UI 组件库', '用户中心页面重构'] },
    { name: '@acme/docs', current: '1.0.0', next: '1.0.1', bumpType: 'patch', changes: ['修复文档链接错误'] },
  ]
}

function getBumpColor(type: string) {
  switch (type) {
    case 'major': return '#dc2626'
    case 'minor': return '#e85d04'
    case 'patch': return '#65a30d'
    default: return '#888'
  }
}

function getBumpLabel(type: string) {
  switch (type) {
    case 'major': return '主版本'
    case 'minor': return '次版本'
    case 'patch': return '补丁'
    default: return '无'
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>Changesets 版本管理与发布流程</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'workflow' }" @click="activeTab = 'workflow'">工作流</button>
      <button class="tab-btn" :class="{ active: activeTab === 'changeset' }" @click="activeTab = 'changeset'">Changeset 管理</button>
      <button class="tab-btn" :class="{ active: activeTab === 'publish' }" @click="activeTab = 'publish'">版本发布</button>
    </div>

    <div v-if="activeTab === 'workflow'">
      <p class="demo-hint">Changesets 提供了一套规范的多包版本管理流程，从开发到发布层层递进。</p>

      <div class="workflow-steps">
        <div
          v-for="(step, i) in workflowSteps"
          :key="i"
          class="workflow-step"
          :class="{ active: currentStep === i, done: currentStep > i }"
        >
          <div class="step-circle">{{ i + 1 }}</div>
          <div class="step-content">
            <strong>{{ step.step }}</strong>
            <p><small>{{ step.desc }}</small></p>
          </div>
          <div v-if="i < workflowSteps.length - 1" class="step-line"></div>
        </div>
      </div>

      <div class="step-detail">
        <h4>{{ workflowSteps[currentStep].step }}</h4>
        <p>{{ workflowSteps[currentStep].desc }}</p>
        
        <div v-if="currentStep === 1" class="step-demo">
          <p><small>执行命令：</small></p>
          <pre class="mini-code"><code>pnpm changeset</code></pre>
          <p style="margin-top:8px;"><small>交互式选择要升级的包和版本类型，生成 changeset 文件。</small></p>
        </div>

        <div v-if="currentStep === 3" class="step-demo">
          <p><small>执行命令：</small></p>
          <pre class="mini-code"><code>pnpm changeset version</code></pre>
          <p style="margin-top:8px;"><small>自动读取所有 changeset，更新 package.json 版本号，生成 CHANGELOG.md。</small></p>
        </div>
      </div>

      <div class="step-nav">
        <button @click="prevStep" :disabled="currentStep === 0" class="btn-secondary">上一步</button>
        <span>{{ currentStep + 1 }} / {{ workflowSteps.length }}</span>
        <button @click="nextStep" :disabled="currentStep === workflowSteps.length - 1">下一步</button>
      </div>
    </div>

    <div v-if="activeTab === 'changeset'">
      <p class="demo-hint">每个 changeset 描述一个变更，包括影响的包、版本类型和变更说明。</p>

      <div class="add-changeset">
        <h4>新增 Changeset</h4>
        <div class="form-row">
          <label>
            <span>包名</span>
            <select v-model="newChangeset.package">
              <option v-for="p in packages" :key="p.name" :value="p.name">{{ p.name }}</option>
            </select>
          </label>
          <label>
            <span>版本类型</span>
            <select v-model="newChangeset.type">
              <option value="patch">patch - 补丁</option>
              <option value="minor">minor - 次版本</option>
              <option value="major">major - 主版本</option>
            </select>
          </label>
        </div>
        <div class="form-row">
          <label style="flex:1;">
            <span>变更说明</span>
            <input v-model="newChangeset.summary" type="text" placeholder="简要描述变更内容..." />
          </label>
          <button @click="addChangeset" :disabled="!newChangeset.summary.trim()">添加</button>
        </div>
      </div>

      <div class="changeset-list">
        <h4>待发布 Changesets ({{ unreleasedCount }})</h4>
        <div v-if="changesets.filter(c => !c.released).length === 0" class="empty-state">
          <p>暂无待发布的变更</p>
        </div>
        <div
          v-for="cs in changesets.filter(c => !c.released)"
          :key="cs.id"
          class="changeset-item"
        >
          <div class="cs-header">
            <span class="cs-id">{{ cs.id }}.md</span>
            <span class="cs-type" :style="{ color: getBumpColor(cs.type) }">
              {{ getBumpLabel(cs.type) }}
            </span>
          </div>
          <p class="cs-pkg"><code>{{ cs.package }}</code></p>
          <p class="cs-summary">{{ cs.summary }}</p>
        </div>
      </div>

      <pre class="mini-code" v-html="changesetFileCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'publish'">
      <p class="demo-hint">版本发布时自动更新版本号、生成 CHANGELOG、发布到 npm。</p>

      <div class="version-preview">
        <h4>版本变更预览</h4>
        <table>
          <thead><tr><th>包名</th><th>当前版本</th><th></th><th>下一版本</th><th>变更类型</th></tr></thead>
          <tbody>
            <tr v-for="p in packages" :key="p.name">
              <td><code>{{ p.name }}</code></td>
              <td>v{{ p.current }}</td>
              <td>→</td>
              <td><strong style="color: #65a30d;">v{{ p.next }}</strong></td>
              <td><span :style="{ color: getBumpColor(p.bumpType) }">{{ getBumpLabel(p.bumpType) }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="publish-actions">
        <button @click="runVersionBump" :disabled="isPublishing || unreleasedCount === 0">
          {{ isPublishing ? '发布中...' : '执行版本升级并发布' }}
        </button>
        <button @click="resetDemo" class="btn-secondary">重置演示</button>
      </div>

      <pre class="mini-code" v-html="commandsCode" style="margin-top:12px;"></pre>
      <pre class="mini-code" v-html="changesetConfigCode" style="margin-top:8px;"></pre>

      <div class="tips-box">
        <p><strong>语义化版本 (SemVer)：</strong></p>
        <ul>
          <li><span style="color:#dc2626">major</span> - 不兼容的 API 变更</li>
          <li><span style="color:#e85d04">minor</span> - 向下兼容的功能新增</li>
          <li><span style="color:#65a30d">patch</span> - 向下兼容的问题修复</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box ul { margin: 4px 0 0 16px; padding: 0; }
.tips-box li { font-size: 12px; margin: 2px 0; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
.demo-hint { font-size: 13px; color: #8a6d42; margin-bottom: 10px; }
.workflow-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; position: relative; }
.workflow-step { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 20px; }
.workflow-step:last-child { padding-bottom: 0; }
.step-circle { width: 32px; height: 32px; border-radius: 50%; background: #ddd; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; z-index: 1; }
.workflow-step.active .step-circle { background: #e85d04; }
.workflow-step.done .step-circle { background: #65a30d; }
.step-content { flex: 1; padding-top: 4px; }
.step-content strong { display: block; }
.step-content p { margin: 2px 0 0 0; }
.step-line { position: absolute; left: 15px; top: 32px; width: 2px; height: calc(100% - 12px); background: #ddd; }
.workflow-step.done .step-line { background: #65a30d; }
.step-detail { background: #fff8f0; padding: 16px; border-radius: 6px; margin-bottom: 12px; }
.step-detail h4 { margin: 0 0 8px 0; color: #e85d04; }
.step-detail p { margin: 0; font-size: 13px; }
.step-demo { margin-top: 12px; }
.step-nav { display: flex; justify-content: space-between; align-items: center; }
.step-nav span { font-size: 13px; color: #8a6d42; }
.btn-secondary { background: #fff !important; border: 1px solid #e0a06a !important; color: #e85d04 !important; }
.add-changeset { background: #fff8f0; padding: 12px; border-radius: 6px; margin-bottom: 12px; }
.add-changeset h4 { margin: 0 0 10px 0; color: #e85d04; font-size: 14px; }
.form-row { display: flex; gap: 12px; margin-bottom: 10px; }
.form-row label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
.form-row input, .form-row select { padding: 6px 8px; border: 1px solid #e0a06a; border-radius: 4px; font-size: 13px; }
.form-row button { align-self: flex-end; padding: 6px 16px; }
.changeset-list h4 { margin: 12px 0 8px 0; color: #e85d04; font-size: 14px; }
.changeset-item { background: #fff; border: 1px solid #e0a06a; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; }
.cs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.cs-id { font-family: monospace; font-size: 12px; color: #8a6d42; }
.cs-type { font-size: 12px; font-weight: bold; }
.cs-pkg { margin: 4px 0; }
.cs-summary { margin: 4px 0 0 0; font-size: 13px; }
.empty-state { text-align: center; padding: 20px; color: #8a6d42; background: #fafafa; border-radius: 6px; }
.version-preview h4 { margin: 0 0 10px 0; color: #e85d04; font-size: 14px; }
.publish-actions { display: flex; gap: 8px; margin: 12px 0; }
</style>
