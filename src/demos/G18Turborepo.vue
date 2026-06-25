<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'tasks' | 'cache' | 'config'>('tasks')

interface Task {
  name: string
  deps: string[]
  status: 'idle' | 'running' | 'cached' | 'done'
  duration: number
  cachedDuration: number
}

const tasks = ref<Task[]>([
  { name: 'build', deps: ['^build'], status: 'idle', duration: 1200, cachedDuration: 50 },
  { name: 'test', deps: ['build'], status: 'idle', duration: 800, cachedDuration: 30 },
  { name: 'lint', deps: [], status: 'idle', duration: 400, cachedDuration: 20 },
  { name: 'typecheck', deps: ['build'], status: 'idle', duration: 600, cachedDuration: 25 },
  { name: 'dev', deps: [], status: 'idle', duration: 0, cachedDuration: 0 },
])

const packages = [
  { name: '@acme/core', hasCache: true },
  { name: '@acme/ui', hasCache: true },
  { name: '@acme/web', hasCache: false },
  { name: '@acme/docs', hasCache: true },
]

const isRunning = ref(false)
const cacheEnabled = ref(true)
const currentPackage = ref('@acme/web')
const buildLog = ref<string[]>([])

const totalDuration = computed(() => {
  let total = 0
  tasks.value.forEach(t => {
    if (t.status === 'done') {
      total += t.duration
    }
  })
  return total
})

const cachedDuration = computed(() => {
  let total = 0
  tasks.value.forEach(t => {
    if (t.status === 'cached') {
      total += t.cachedDuration
    }
  })
  return total
})

const savedTime = computed(() => {
  let saved = 0
  tasks.value.forEach(t => {
    if (t.status === 'cached') {
      saved += t.duration - t.cachedDuration
    }
  })
  return saved
})

const turboConfigCode = `<span style="color:#8a8a3a">// turbo.json</span>
{
  <span style="color:#cc997a">"$schema"</span>: <span style="color:#a3b380">"https://turbo.build/schema.json"</span>,
  <span style="color:#cc997a">"pipeline"</span>: {
    <span style="color:#cc997a">"build"</span>: {
      <span style="color:#cc997a">"dependsOn"</span>: [<span style="color:#a3b380">"^build"</span>],
      <span style="color:#cc997a">"outputs"</span>: [<span style="color:#a3b380">"dist/**"</span>, <span style="color:#a3b380">".next/**"</span>]
    },
    <span style="color:#cc997a">"test"</span>: {
      <span style="color:#cc997a">"dependsOn"</span>: [<span style="color:#a3b380">"build"</span>],
      <span style="color:#cc997a">"outputs"</span>: [],
      <span style="color:#cc997a">"cache"</span>: <span style="color:#cc6666">true</span>
    },
    <span style="color:#cc997a">"lint"</span>: {
      <span style="color:#cc997a">"outputs"</span>: [],
      <span style="color:#cc997a">"cache"</span>: <span style="color:#cc6666">true</span>
    },
    <span style="color:#cc997a">"dev"</span>: {
      <span style="color:#cc997a">"cache"</span>: <span style="color:#cc6666">false</span>,
      <span style="color:#cc997a">"persistent"</span>: <span style="color:#cc6666">true</span>
    }
  },
  <span style="color:#cc997a">"globalDependencies"</span>: [<span style="color:#a3b380">".env.*"</span>]
}`

const pipelineCode = `<span style="color:#7c7c99"># 运行所有任务</span>
turbo run build test lint

<span style="color:#7c7c99"># 只运行指定包的任务</span>
turbo run build <span style="color:#cc997a">--filter</span> @acme/web

<span style="color:#7c7c99"># 强制重新构建，跳过缓存</span>
turbo run build <span style="color:#cc997a">--force</span>

<span style="color:#7c7c99"># 仅执行命令并生成性能分析</span>
turbo run build <span style="color:#cc997a">--profile</span>

<span style="color:#7c7c99"># 远程缓存登录</span>
turbo <span style="color:#cc997a">login</span>
turbo <span style="color:#cc997a">link</span>`

const taskPipeline = [
  { task: 'build', deps: '^build', desc: '先构建依赖包，再构建当前包', outputs: 'dist/**, .next/**' },
  { task: 'test', deps: 'build', desc: '构建完成后运行测试', outputs: '无（无输出文件' },
  { task: 'lint', deps: '无', desc: '可并行执行代码检查', outputs: '无' },
  { task: 'typecheck', deps: 'build', desc: '构建后类型检查', outputs: '无' },
  { task: 'dev', deps: '无', desc: '开发模式，不缓存', outputs: '—' },
]

async function runPipeline() {
  if (isRunning.value) return
  isRunning.value = true
  buildLog.value = []
  
  tasks.value.forEach(t => t.status = 'idle')
  
  buildLog.value.push('🚀 启动 Turborepo 任务编排...')
  buildLog.value.push(`📦 目标包：${currentPackage.value}`)
  buildLog.value.push(`💾 缓存：${cacheEnabled.value ? '已启用' : '已禁用'}`)
  buildLog.value.push('')

  const orderedTasks = [...tasks.value].filter(t => t.name !== 'dev')
  
  for (const task of orderedTasks) {
    const taskObj = tasks.value.find(t => t.name === task.name)
    if (!taskObj) continue
    
    taskObj.status = 'running'
    buildLog.value.push(`⏳ 正在执行: ${task.name}...`)
    
    await new Promise(r => setTimeout(r, 300))
    
    const shouldCache = cacheEnabled.value && Math.random() > 0.4
    
    if (shouldCache) {
      await new Promise(r => setTimeout(r, taskObj.cachedDuration))
      taskObj.status = 'cached'
      buildLog.value.push(`⚡ 缓存命中: ${task.name} (${taskObj.cachedDuration}ms)`)
    } else {
      await new Promise(r => setTimeout(r, taskObj.duration - 300))
      taskObj.status = 'done'
      buildLog.value.push(`✅ 完成: ${task.name} (${taskObj.duration}ms)`)
    }
    buildLog.value.push('')
  }
  
  buildLog.value.push('🎉 所有任务执行完成！')
  buildLog.value.push(`⏱️  总耗时: ${totalDuration.value + cachedDuration.value}ms`)
  if (savedTime.value > 0) {
    buildLog.value.push(`💰 缓存节省: ${savedTime.value}ms`)
  }
  
  isRunning.value = false
}

function resetTasks() {
  tasks.value.forEach(t => t.status = 'idle')
  buildLog.value = []
}

function getTaskStatusClass(status: string) {
  switch (status) {
    case 'running': return 'status-running'
    case 'cached': return 'status-cached'
    case 'done': return 'status-done'
    default: return 'status-idle'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'running': return '运行中'
    case 'cached': return '缓存命中'
    case 'done': return '已完成'
    default: return '等待中'
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>Turborepo 构建缓存与任务编排</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'tasks' }" @click="activeTab = 'tasks'">任务演示</button>
      <button class="tab-btn" :class="{ active: activeTab === 'cache' }" @click="activeTab = 'cache'">缓存机制</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置文件</button>
    </div>

    <div v-if="activeTab === 'tasks'">
      <p class="demo-hint">Turborepo 按拓扑顺序执行任务，支持增量构建和缓存复用。</p>

      <div class="control-bar">
        <label class="toggle-row">
          <span>目标包：</span>
          <select v-model="currentPackage" :disabled="isRunning">
            <option v-for="p in packages" :key="p.name" :value="p.name">{{ p.name }}</option>
          </select>
        </label>
        <label class="toggle-row">
          <input type="checkbox" v-model="cacheEnabled" :disabled="isRunning" />
          <span>启用缓存</span>
        </label>
      </div>

      <div class="task-list">
        <div v-for="task in tasks" :key="task.name" class="task-item" :class="getTaskStatusClass(task.status)">
          <div class="task-header">
            <strong>{{ task.name }}</strong>
            <span class="task-status">{{ getStatusText(task.status) }}</span>
          </div>
          <div class="task-deps">
            <small>依赖：{{ task.deps.length ? task.deps.join(', ') : '无' }}</small>
          </div>
          <div class="task-progress" v-if="task.status === 'running'">
            <div class="progress-bar"></div>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button @click="runPipeline" :disabled="isRunning">
          {{ isRunning ? '执行中...' : '运行任务流水线' }}
        </button>
        <button @click="resetTasks" :disabled="isRunning" class="btn-secondary">重置</button>
      </div>

      <div v-if="buildLog.length" class="build-log">
        <h4>构建日志</h4>
        <pre><code v-for="(line, i) in buildLog" :key="i">{{ line }}</code></pre>
      </div>

      <div v-if="savedTime > 0" class="stats-box">
        <div class="stat-item">
          <span class="stat-label">总耗时</span>
          <span class="stat-value">{{ totalDuration + cachedDuration }}ms</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缓存节省</span>
          <span class="stat-value highlight">{{ savedTime }}ms</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">效率提升</span>
          <span class="stat-value">{{ totalDuration > 0 ? Math.round(savedTime / (totalDuration + savedTime) * 100) : 0 }}%</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'cache'">
      <p class="demo-hint">Turborepo 通过内容哈希实现增量构建和远程缓存，大幅提升构建速度。</p>

      <div class="cache-flow">
        <div class="cache-step">
          <div class="step-num">1</div>
          <div>
            <strong>输入哈希计算</strong>
            <p><small>源码、依赖、配置文件 → 计算唯一哈希值</small></p>
          </div>
        </div>
        <div class="cache-arrow">↓</div>
        <div class="cache-step">
          <div class="step-num">2</div>
          <div>
            <strong>缓存查找</strong>
            <p><small>本地缓存 → 远程缓存（Vercel/自定义</small></p>
          </div>
        </div>
        <div class="cache-arrow">↓</div>
        <div class="cache-step cache-hit">
          <div class="step-num">3a</div>
          <div>
            <strong>缓存命中 ⚡</strong>
            <p><small>直接复用构建产物，跳过执行</small></p>
          </div>
        </div>
        <div class="cache-step cache-miss">
          <div class="step-num">3b</div>
          <div>
            <strong>缓存未命中</strong>
            <p><small>执行任务，保存结果到缓存</small></p>
          </div>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>缓存 key 组成：</strong></p>
        <ul>
          <li>源码文件内容哈希</li>
          <li>依赖版本（package.json, lockfile）</li>
          <li>全局依赖（.env.*, turbo.json）</li>
          <li>任务参数和环境变量</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <p class="demo-hint">turbo.json 定义任务管道和缓存配置。</p>
      <pre class="mini-code" v-html="turboConfigCode"></pre>
      
      <table style="margin-top:12px;">
        <thead><tr><th>任务</th><th>依赖</th><th>说明</th><th>输出</th></tr></thead>
        <tbody>
          <tr v-for="t in taskPipeline" :key="t.task">
            <td><code>{{ t.task }}</code></td>
            <td><small>{{ t.deps }}</small></td>
            <td><small>{{ t.desc }}</small></td>
            <td><small>{{ t.outputs }}</small></td>
          </tr>
        </tbody>
      </table>

      <pre class="mini-code" v-html="pipelineCode" style="margin-top:12px;"></pre>

      <div class="tips-box">
        <p><strong>^ 符号含义：</strong><code>^build</code> 表示先执行所有依赖包的 build 任务，再执行当前包的 build。</p>
        <p><strong>远程缓存：</strong>配合 Vercel 或自定义缓存服务，实现团队共享构建缓存。</p>
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
.control-bar { display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap; }
.toggle-row { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.toggle-row select { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; }
.task-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.task-item { padding: 10px 12px; border: 2px solid #ddd; border-radius: 6px; transition: all 0.3s; }
.task-item.status-idle { border-color: #ddd; background: #fafafa; }
.task-item.status-running { border-color: #e85d04; background: #fff5eb; }
.task-item.status-cached { border-color: #0891b2; background: #f0f7ff; }
.task-item.status-done { border-color: #65a30d; background: #f7fee7; }
.task-header { display: flex; justify-content: space-between; align-items: center; }
.task-status { font-size: 12px; font-weight: bold; }
.status-running .task-status { color: #e85d04; }
.status-cached .task-status { color: #0891b2; }
.status-done .task-status { color: #65a30d; }
.task-deps { margin-top: 4px; }
.task-progress { margin-top: 8px; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden; }
.progress-bar { height: 100%; width: 100%; background: linear-gradient(90deg, #e85d04, #f4a261); animation: progress 1.5s ease-in-out infinite; background-size: 200% 100%; }
@keyframes progress { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.action-row { display: flex; gap: 8px; margin-bottom: 12px; }
.btn-secondary { background: #fff !important; border: 1px solid #e0a06a !important; color: #e85d04 !important; }
.build-log { background: #1e1e2e; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
.build-log h4 { margin: 0 0 8px 0; color: #e0e0e0; font-size: 13px; }
.build-log pre { margin: 0; white-space: pre-wrap; }
.build-log code { display: block; color: #b8b8b8; font-size: 12px; line-height: 1.6; background: none; padding: 0; }
.stats-box { display: flex; gap: 12px; background: #fff8f0; padding: 12px; border-radius: 6px; }
.stat-item { flex: 1; text-align: center; }
.stat-label { display: block; font-size: 12px; color: #8a6d42; margin-bottom: 4px; }
.stat-value { font-size: 18px; font-weight: bold; color: #e85d04; }
.stat-value.highlight { color: #65a30d; }
.cache-flow { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.cache-step { display: flex; gap: 12px; padding: 10px; background: #fff8f0; border-radius: 6px; border-left: 3px solid #e85d04; }
.cache-step.cache-hit { border-left-color: #0891b2; background: #f0f7ff; }
.cache-step.cache-miss { border-left-color: #dc2626; background: #fef2f2; }
.step-num { width: 28px; height: 28px; line-height: 28px; text-align: center; background: #e85d04; color: #fff; border-radius: 50%; font-size: 13px; flex-shrink: 0; }
.cache-hit .step-num { background: #0891b2; }
.cache-miss .step-num { background: #dc2626; }
.cache-step strong { display: block; margin-bottom: 2px; }
.cache-step p { margin: 0; }
.cache-arrow { text-align: center; color: #e85d04; font-size: 16px; }
</style>
