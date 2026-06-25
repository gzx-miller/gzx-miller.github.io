<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'workspace' | 'affected' | 'cache'

interface Project {
  name: string
  type: 'app' | 'lib'
  tags: string[]
  affected: boolean
  status: 'idle' | 'building' | 'success' | 'failed'
}

interface Task {
  id: number
  project: string
  target: string
  status: 'pending' | 'running' | 'success' | 'failed'
  duration: number
}

const activeTab = ref<TabKey>('workspace')
const isRunning = ref(false)
const modifiedFile = ref('shared-ui')

const projects = ref<Project[]>([
  { name: 'admin-app', type: 'app', tags: ['scope:admin', 'type:app'], affected: false, status: 'idle' },
  { name: 'customer-app', type: 'app', tags: ['scope:customer', 'type:app'], affected: false, status: 'idle' },
  { name: 'shared-ui', type: 'lib', tags: ['scope:shared', 'type:ui'], affected: true, status: 'idle' },
  { name: 'shared-utils', type: 'lib', tags: ['scope:shared', 'type:utils'], affected: false, status: 'idle' },
  { name: 'auth-feature', type: 'lib', tags: ['scope:auth', 'type:feature'], affected: true, status: 'idle' },
  { name: 'data-access', type: 'lib', tags: ['scope:shared', 'type:data'], affected: true, status: 'idle' },
])

const tasks = ref<Task[]>([
  { id: 1, project: 'shared-ui', target: 'build', status: 'pending', duration: 300 },
  { id: 2, project: 'shared-utils', target: 'build', status: 'pending', duration: 250 },
  { id: 3, project: 'data-access', target: 'test', status: 'pending', duration: 400 },
  { id: 4, project: 'auth-feature', target: 'build', status: 'pending', duration: 350 },
  { id: 5, project: 'auth-feature', target: 'test', status: 'pending', duration: 450 },
  { id: 6, project: 'admin-app', target: 'build', status: 'pending', duration: 600 },
])

const affectedProjects = computed(() => projects.value.filter(p => p.affected))
const unaffectedProjects = computed(() => projects.value.filter(p => !p.affected))

const completedTasks = computed(() => tasks.value.filter(t => t.status === 'success').length)
const totalDuration = computed(() => tasks.value.filter(t => t.status === 'success').reduce((sum, t) => sum + t.duration, 0))

const workspaceJson = `<span style="color:#8a8a3a">// nx.json</span>
{
  <span style="color:#9cdcfe">"$schema"</span>: <span style="color:#ce9178">"./node_modules/nx/schemas/nx-schema.json"</span>,
  <span style="color:#9cdcfe">"targetDefaults"</span>: {
    <span style="color:#9cdcfe">"build"</span>: {
      <span style="color:#9cdcfe">"dependsOn"</span>: [<span style="color:#ce9178">"^build"</span>],
      <span style="color:#9cdcfe">"outputs"</span>: [<span style="color:#ce9178">"{projectRoot}/dist"</span>]
    },
    <span style="color:#9cdcfe">"test"</span>: {
      <span style="color:#9cdcfe">"dependsOn"</span>: [<span style="color:#ce9178">"build"</span>],
      <span style="color:#9cdcfe">"outputs"</span>: [<span style="color:#ce9178">"{projectRoot}/coverage"</span>]
    }
  },
  <span style="color:#9cdcfe">"cacheDirectory"</span>: <span style="color:#ce9178">".nx/cache"</span>,
  <span style="color:#9cdcfe">"namedInputs"</span>: {
    <span style="color:#9cdcfe">"default"</span>: [<span style="color:#ce9178">"{projectRoot}/**/*"</span>, <span style="color:#ce9178">"sharedGlobals"</span>],
    <span style="color:#9cdcfe">"production"</span>: [<span style="color:#ce9178">"default"</span>, <span style="color:#ce9178">"!{projectRoot}/**/*.spec.ts"</span>]
  }
}

<span style="color:#8a8a3a">// project.json (shared-ui)</span>
{
  <span style="color:#9cdcfe">"name"</span>: <span style="color:#ce9178">"shared-ui"</span>,
  <span style="color:#9cdcfe">"$schema"</span>: <span style="color:#ce9178">"../node_modules/nx/schemas/project-schema.json"</span>,
  <span style="color:#9cdcfe">"sourceRoot"</span>: <span style="color:#ce9178">"libs/shared/ui/src"</span>,
  <span style="color:#9cdcfe">"projectType"</span>: <span style="color:#ce9178">"library"</span>,
  <span style="color:#9cdcfe">"tags"</span>: [<span style="color:#ce9178">"scope:shared"</span>, <span style="color:#ce9178">"type:ui"</span>],
  <span style="color:#9cdcfe">"targets"</span>: {
    <span style="color:#9cdcfe">"build"</span>: {
      <span style="color:#9cdcfe">"executor"</span>: <span style="color:#ce9178">"@nx/vite:build"</span>,
      <span style="color:#9cdcfe">"outputs"</span>: [<span style="color:#ce9178">"{options.outputPath}"</span>],
      <span style="color:#9cdcfe">"options"</span>: {
        <span style="color:#9cdcfe">"outputPath"</span>: <span style="color:#ce9178">"dist/libs/shared/ui"</span>
      }
    },
    <span style="color:#9cdcfe">"test"</span>: {
      <span style="color:#9cdcfe">"executor"</span>: <span style="color:#ce9178">"@nx/vite:test"</span>,
      <span style="color:#9cdcfe">"outputs"</span>: [<span style="color:#ce9178">"{projectRoot}/coverage"</span>]
    }
  }
}`

const eslintRules = `<span style="color:#8a8a3a">// .eslintrc.json</span>
{
  <span style="color:#9cdcfe">"root"</span>: <span style="color:#569cd6">true</span>,
  <span style="color:#9cdcfe">"ignorePatterns"</span>: [<span style="color:#ce9178">"**/*"</span>],
  <span style="color:#9cdcfe">"plugins"</span>: [<span style="color:#ce9178">"@nx"</span>],
  <span style="color:#9cdcfe">"overrides"</span>: [
    {
      <span style="color:#9cdcfe">"files"</span>: [<span style="color:#ce9178">"*.ts"</span>, <span style="color:#ce9178">"*.tsx"</span>, <span style="color:#ce9178">"*.js"</span>, <span style="color:#ce9178">"*.jsx"</span>],
      <span style="color:#9cdcfe">"rules"</span>: {
        <span style="color:#9cdcfe">"@nx/enforce-module-boundaries"</span>: [
          <span style="color:#ce9178">"error"</span>,
          {
            <span style="color:#9cdcfe">"enforceBuildableLibDependency"</span>: <span style="color:#569cd6">true</span>,
            <span style="color:#9cdcfe">"allow"</span>: [],
            <span style="color:#9cdcfe">"depConstraints"</span>: [
              {
                <span style="color:#9cdcfe">"sourceTag"</span>: <span style="color:#ce9178">"type:app"</span>,
                <span style="color:#9cdcfe">"onlyDependOnLibsWithTags"</span>: [
                  <span style="color:#ce9178">"type:feature"</span>,
                  <span style="color:#ce9178">"type:ui"</span>,
                  <span style="color:#ce9178">"type:utils"</span>,
                  <span style="color:#ce9178">"type:data"</span>
                ]
              },
              {
                <span style="color:#9cdcfe">"sourceTag"</span>: <span style="color:#ce9178">"scope:admin"</span>,
                <span style="color:#9cdcfe">"onlyDependOnLibsWithTags"</span>: [
                  <span style="color:#ce9178">"scope:admin"</span>,
                  <span style="color:#ce9178">"scope:shared"</span>
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}`

function setModified(projectName: string) {
  modifiedFile.value = projectName
  updateAffected()
}

function updateAffected() {
  const affected = new Set<string>()
  
  const directAffected = projects.value.filter(p => p.name === modifiedFile.value)
  directAffected.forEach(p => affected.add(p.name))
  
  if (modifiedFile.value === 'shared-ui' || modifiedFile.value === 'shared-utils' || modifiedFile.value === 'data-access') {
    affected.add('admin-app')
    affected.add('customer-app')
    affected.add('auth-feature')
  }
  
  if (modifiedFile.value === 'auth-feature') {
    affected.add('admin-app')
    affected.add('customer-app')
  }
  
  projects.value.forEach(p => {
    p.affected = affected.has(p.name) || p.name === modifiedFile.value
    p.status = 'idle'
  })
}

async function runAffectedBuild() {
  if (isRunning.value) return
  isRunning.value = true
  
  tasks.value.forEach(t => t.status = 'pending')
  projects.value.forEach(p => p.status = 'idle')
  
  const affectedNames = new Set(affectedProjects.value.map(p => p.name))
  
  for (const task of tasks.value) {
    if (!affectedNames.has(task.project)) continue
    
    task.status = 'running'
    const project = projects.value.find(p => p.name === task.project)
    if (project) project.status = 'building'
    
    await new Promise(r => setTimeout(r, task.duration))
    task.status = 'success'
  }
  
  affectedProjects.value.forEach(p => p.status = 'success')
  
  isRunning.value = false
}

function resetTasks() {
  tasks.value.forEach(t => t.status = 'pending')
  projects.value.forEach(p => p.status = 'idle')
}

updateAffected()
</script>

<template>
  <div class="demo-card">
    <h3>Nx 工作区与受影响项目检测</h3>
    <p class="demo-hint">Nx 是智能 monorepo 构建系统，通过依赖图分析和计算缓存，只构建受影响的项目，大幅提升 CI/CD 效率。</p>

    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'workspace' }" @click="activeTab = 'workspace'">工作区结构</button>
      <button class="tab-btn" :class="{ active: activeTab === 'affected' }" @click="activeTab = 'affected'">受影响检测</button>
      <button class="tab-btn" :class="{ active: activeTab === 'cache' }" @click="activeTab = 'cache'">缓存与约束</button>
    </div>

    <div v-if="activeTab === 'workspace'">
      <div class="workspace-graph">
        <div class="layer">
          <div class="layer-title">应用层 (Apps)</div>
          <div class="project-row">
            <div v-for="p in projects.filter(x => x.type === 'app')" :key="p.name" class="project-node app">
              <span class="node-icon">📱</span>
              <span class="node-name">{{ p.name }}</span>
              <span class="node-type">app</span>
            </div>
          </div>
        </div>
        <div class="connector">↓ 依赖 ↓</div>
        <div class="layer">
          <div class="layer-title">功能层 (Feature Libs)</div>
          <div class="project-row">
            <div v-for="p in projects.filter(x => x.name.includes('feature'))" :key="p.name" class="project-node lib">
              <span class="node-icon">⚡</span>
              <span class="node-name">{{ p.name }}</span>
              <span class="node-type">lib</span>
            </div>
          </div>
        </div>
        <div class="connector">↓ 依赖 ↓</div>
        <div class="layer">
          <div class="layer-title">共享层 (Shared Libs)</div>
          <div class="project-row">
            <div v-for="p in projects.filter(x => x.name.startsWith('shared') || x.name === 'data-access')" :key="p.name" class="project-node lib">
              <span class="node-icon">📦</span>
              <span class="node-name">{{ p.name }}</span>
              <span class="node-type">lib</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tips-box">
        <p><strong>分层原则：</strong>上层依赖下层，禁止反向依赖。每个库有明确的 scope 和 type 标签，确保架构边界清晰。</p>
      </div>
    </div>

    <div v-if="activeTab === 'affected'">
      <div class="affected-demo">
        <div class="file-selector">
          <span class="selector-label">选择修改的文件：</span>
          <div class="file-buttons">
            <button
              v-for="p in projects"
              :key="p.name"
              class="file-btn"
              :class="{ active: modifiedFile === p.name }"
              @click="setModified(p.name)"
            >
              {{ p.name }}
            </button>
          </div>
        </div>

        <div class="affected-result">
          <div class="result-section">
            <h4>受影响项目 ({{ affectedProjects.length }})</h4>
            <div class="project-list">
              <div
                v-for="p in affectedProjects"
                :key="p.name"
                class="project-item affected"
                :class="p.status"
              >
                <span class="item-icon">
                  {{ p.status === 'success' ? '✓' : p.status === 'building' ? '◐' : '●' }}
                </span>
                <span class="item-name">{{ p.name }}</span>
                <span class="item-type">{{ p.type }}</span>
              </div>
            </div>
          </div>
          <div class="result-section">
            <h4>不受影响 ({{ unaffectedProjects.length }})</h4>
            <div class="project-list">
              <div v-for="p in unaffectedProjects" :key="p.name" class="project-item unaffected">
                <span class="item-icon">○</span>
                <span class="item-name">{{ p.name }}</span>
                <span class="item-type">{{ p.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="task-runner">
          <div class="task-header">
            <strong>构建任务</strong>
            <span class="task-stats">完成: {{ completedTasks }}/{{ tasks.length }}</span>
          </div>
          <div class="task-list">
            <div v-for="task in tasks" :key="task.id" class="task-item" :class="task.status">
              <span class="task-icon">
                {{ task.status === 'success' ? '✓' : task.status === 'running' ? '◐' : '○' }}
              </span>
              <span class="task-name">{{ task.project }}:{{ task.target }}</span>
              <span v-if="task.status === 'success'" class="task-time">{{ task.duration }}ms</span>
            </div>
          </div>
          <div class="task-actions">
            <button @click="runAffectedBuild" :disabled="isRunning">
              {{ isRunning ? '构建中...' : '运行受影响构建' }}
            </button>
            <button class="secondary" @click="resetTasks" :disabled="isRunning">重置</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'cache'">
      <pre class="mini-code" v-html="workspaceJson"></pre>
      <pre class="mini-code" v-html="eslintRules" style="margin-top: 10px;"></pre>
      <div class="tips-box">
        <p><strong>Nx 核心能力：</strong></p>
        <ul>
          <li><strong>计算缓存</strong>：相同输入复用输出，跳过已执行任务</li>
          <li><strong>受影响检测</strong>：基于 Git 变更 + 依赖图，只构建受影响项目</li>
          <li><strong>模块边界</strong>：通过 ESLint 规则强制架构约束，防止跨层依赖</li>
          <li><strong>任务编排</strong>：自动按依赖顺序并行执行任务</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-hint { color: #8a6d42; font-size: 13px; margin-bottom: 12px; }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.workspace-graph { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 8px; padding: 16px; }
.layer { margin-bottom: 8px; }
.layer-title { font-size: 12px; color: #8a6d42; margin-bottom: 8px; font-weight: bold; }
.project-row { display: flex; gap: 10px; flex-wrap: wrap; }
.project-node { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 6px; font-size: 13px; }
.project-node.app { background: #fef3c7; border: 1px solid #f59e0b; }
.project-node.lib { background: #dbeafe; border: 1px solid #3b82f6; }
.node-icon { font-size: 14px; }
.node-name { font-weight: bold; }
.node-type { font-size: 11px; padding: 1px 6px; border-radius: 10px; background: rgba(0,0,0,0.1); }
.connector { text-align: center; color: #e85d04; font-size: 12px; padding: 4px 0; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box p { margin: 4px 0; font-size: 13px; }
.tips-box ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
.tips-box li { margin: 2px 0; }
.tips-box strong { color: #e85d04; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.affected-demo { display: flex; flex-direction: column; gap: 14px; }
.file-selector { background: #fffaf5; padding: 12px; border-radius: 6px; border: 1px solid #e0d5c8; }
.selector-label { font-size: 13px; font-weight: bold; display: block; margin-bottom: 8px; color: #6b5a45; }
.file-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
.file-btn { padding: 4px 12px; border: 1px solid #d4c4b0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: #6b5a45; }
.file-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.affected-result { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.result-section h4 { margin: 0 0 8px 0; font-size: 13px; color: #6b5a45; }
.project-list { display: flex; flex-direction: column; gap: 4px; }
.project-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 4px; font-size: 12px; }
.project-item.affected { background: rgba(232, 93, 4, 0.1); border: 1px solid rgba(232, 93, 4, 0.3); }
.project-item.affected.building .item-icon { animation: spin 1s linear infinite; color: #e85d04; }
.project-item.affected.success { background: rgba(101, 163, 13, 0.1); border-color: rgba(101, 163, 13, 0.3); }
.project-item.affected.success .item-icon { color: #65a30d; }
.project-item.unaffected { background: #f5f0eb; border: 1px solid #e8e0d8; color: #999; }
.item-icon { width: 16px; text-align: center; }
.item-name { flex: 1; font-family: monospace; }
.item-type { font-size: 10px; padding: 1px 6px; border-radius: 10px; background: rgba(0,0,0,0.08); }
.task-runner { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 6px; padding: 12px; }
.task-header { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #e8d5c0; }
.task-stats { font-size: 12px; color: #6b5a45; }
.task-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.task-item { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 4px; font-size: 12px; background: #fff; border: 1px solid #e8e0d8; }
.task-item.running { border-color: #e8713a; background: rgba(232, 113, 58, 0.06); }
.task-item.running .task-icon { color: #e85d04; animation: spin 1s linear infinite; }
.task-item.success { border-color: #65a30d; background: rgba(101, 163, 13, 0.06); }
.task-item.success .task-icon { color: #65a30d; }
.task-icon { width: 16px; text-align: center; }
.task-name { flex: 1; font-family: monospace; }
.task-time { font-size: 11px; color: #999; }
.task-actions { display: flex; gap: 10px; }
button { padding: 8px 18px; border: none; border-radius: 5px; background: #e85d04; color: #fff; cursor: pointer; font-size: 13px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.secondary { background: #f5f0eb; color: #6b5a45; border: 1px solid #d4c4b0; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
