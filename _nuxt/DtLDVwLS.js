const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'intro' | 'flow' | 'config' | 'demo' | 'optimize'>('intro')

const deps = ref([
  { name: 'vue', size: '42.3 KB', bundled: true, status: 'cached' },
  { name: 'vue-router', size: '28.1 KB', bundled: true, status: 'cached' },
  { name: 'pinia', size: '18.5 KB', bundled: true, status: 'cached' },
  { name: 'lodash-es', size: '95.2 KB', bundled: true, status: 'new' },
  { name: 'dayjs', size: '6.8 KB', bundled: true, status: 'cached' },
  { name: 'axios', size: '14.3 KB', bundled: false, status: 'native' },
])

const isRebundling = ref(false)
const bundleProgress = ref(100)

const totalSize = computed(() => {
  return deps.value
    .filter(d => d.bundled)
    .reduce((sum, d) => {
      const num = parseFloat(d.size)
      return sum + num
    }, 0)
    .toFixed(1)
})

const configCode = \`<span style="color:#7c7c99">// vite.config.ts - 依赖预构建配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 依赖预构建配置</span>
  optimizeDeps: {
    <span style="color:#7c7c99">// 强制预构建的依赖</span>
    include: [
      'vue',
      'vue-router',
      'pinia',
      'lodash-es',
      'dayjs',
    ],
    
    <span style="color:#7c7c99">// 排除不预构建的依赖</span>
    exclude: ['axios'],
    
    <span style="color:#7c7c99">// 自定义 esbuild 选项</span>
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  <span style="color:#7c7c99">// 强制重新预构建</span>
  <span style="color:#7c7c99">// 命令行: vite --force</span>
})\`

const flowCode = \`<span style="color:#e85d04">┌─────────────────────────────────────┐</span>
<span style="color:#e85d04">│  启动 Vite Dev Server                │</span>
<span style="color:#e85d04">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#d97706">┌─────────────────────────────────────┐</span>
<span style="color:#d97706">│  扫描入口文件，收集依赖              │</span>
<span style="color:#d97706">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#65a30d">┌─────────────────────────────────────┐</span>
<span style="color:#65a30d">│  esbuild 预构建 CommonJS / UMD      │</span>
<span style="color:#65a30d">│  → 转换为 ESM 模块                   │</span>
<span style="color:#65a30d">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#0891b2">┌─────────────────────────────────────┐</span>
<span style="color:#0891b2">│  缓存到 node_modules/.vite          │</span>
<span style="color:#0891b2">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#7c3aed">┌─────────────────────────────────────┐</span>
<span style="color:#7c3aed">│  浏览器直接加载预构建后的 ESM       │</span>
<span style="color:#7c3aed">└─────────────────────────────────────┘</span>\`

const tips = [
  { icon: '⚡', title: '为什么需要预构建', desc: '将 CommonJS/UMD 转换为 ESM，让浏览器能直接加载；将多文件依赖打包成单文件，减少 HTTP 请求数。' },
  { icon: '💾', title: '缓存机制', desc: '预构建产物缓存在 node_modules/.vite 中。依赖不变则复用缓存，仅新依赖或配置变化时才重新构建。' },
  { icon: '🎯', title: 'include 与 exclude', desc: 'include 强制预构建（如某些深层导入的依赖），exclude 排除依赖（如纯 ESM 且模块很多的库，按需加载更好）。' },
  { icon: '🔄', title: '强制重新构建', desc: '使用 vite --force 或删除 node_modules/.vite 目录，可强制重新预构建所有依赖。' },
]

function simulateRebundle() {
  if (isRebundling.value) return
  isRebundling.value = true
  bundleProgress.value = 0
  
  deps.value.forEach(d => {
    if (d.status === 'cached') d.status = 'rebuilding'
  })
  
  const interval = setInterval(() => {
    bundleProgress.value += Math.random() * 15 + 5
    if (bundleProgress.value >= 100) {
      bundleProgress.value = 100
      clearInterval(interval)
      deps.value.forEach(d => {
        if (d.status === 'rebuilding') d.status = 'cached'
      })
      setTimeout(() => {
        isRebundling.value = false
      }, 500)
    }
  }, 200)
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    cached: '已缓存',
    new: '新增',
    native: '原生ESM',
    rebuilding: '构建中',
  }
  return map[status] || status
}

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    cached: 'status-cached',
    new: 'status-new',
    native: 'status-native',
    rebuilding: 'status-rebuilding',
  }
  return map[status] || ''
}
<\/script>

<template>
  <div class="demo-card">
    <h3>V17 · 依赖预构建与优化</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">核心概念</button>
      <button class="tab-btn" :class="{ active: activeTab === 'flow' }" @click="activeTab = 'flow'">构建流程</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置示例</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">交互演示</button>
    </div>

    <div v-if="activeTab === 'intro'">
      <div class="tips-grid">
        <div v-for="tip in tips" :key="tip.title" class="tip-card">
          <span class="tip-icon">{{ tip.icon }}</span>
          <strong>{{ tip.title }}</strong>
          <p><small>{{ tip.desc }}</small></p>
        </div>
      </div>
      <div class="tips-box">
        <p><strong>核心目标：</strong>提升开发启动速度和页面加载性能。将大量小模块的依赖打包成单个文件，将非 ESM 格式转换为 ESM，让浏览器原生模块加载更高效。</p>
      </div>
    </div>

    <div v-if="activeTab === 'flow'">
      <pre class="mini-code" v-html="flowCode"></pre>
      <div class="tips-box">
        <p><strong>第一次启动慢？</strong>首次启动时 Vite 需要扫描并预构建所有依赖，这是正常的。后续启动会直接使用缓存，速度极快。</p>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <pre class="mini-code" v-html="configCode"></pre>
      <div class="tips-box">
        <p><strong>常用场景：</strong>深层导入的依赖未被自动发现时用 include；某些库已经是纯 ESM 且希望按需加载时用 exclude。</p>
      </div>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="demo-header">
        <span>依赖预构建模拟器</span>
        <button class="action-btn" :disabled="isRebundling" @click="simulateRebundle">
          {{ isRebundling ? '构建中...' : '🔄 重新预构建' }}
        </button>
      </div>
      
      <div v-if="isRebundling" class="progress-bar">
        <div class="progress-fill" :style="{ width: bundleProgress + '%' }"></div>
        <span class="progress-text">{{ Math.floor(bundleProgress) }}%</span>
      </div>
      
      <ul class="dep-list">
        <li v-for="dep in deps" :key="dep.name" class="dep-item">
          <span class="dep-name">{{ dep.name }}</span>
          <span class="dep-size">{{ dep.size }}</span>
          <span class="dep-status" :class="getStatusClass(dep.status)">
            {{ getStatusText(dep.status) }}
          </span>
        </li>
      </ul>
      
      <div class="summary-bar">
        <span>预构建总大小：<strong>{{ totalSize }} KB</strong></span>
        <span>已缓存：<strong>{{ deps.filter(d => d.status === 'cached').length }}</strong> / {{ deps.length }}</span>
      </div>
      
      <div class="tips-box">
        <p><strong>观察：</strong>点击「重新预构建」按钮，观察依赖状态变化和进度条。实际项目中缓存存在于 <code>node_modules/.vite</code> 目录。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.tab-btn { padding: 5px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; color: #5c4033; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tip-card { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tip-icon { font-size: 20px; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.6; white-space: pre-wrap; }
.tips-box { background: #fef3c7; padding: 10px; border-radius: 6px; border-left: 3px solid #d97706; margin-top: 10px; }
.tips-box p { margin: 0; font-size: 13px; color: #78350f; }
.tips-box code { background: #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.demo-header span { font-weight: 600; color: #92400e; }
.action-btn { padding: 6px 14px; background: #ea580c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; }
.action-btn:disabled { background: #fbbf24; cursor: not-allowed; }
.progress-bar { position: relative; height: 20px; background: #fed7aa; border-radius: 10px; margin-bottom: 12px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 10px; transition: width 0.2s ease; }
.progress-text { position: absolute; top: 0; left: 50%; transform: translateX(-50%); font-size: 12px; color: #7c2d12; font-weight: 600; line-height: 20px; }
.dep-list { list-style: none; padding: 0; margin: 0 0 12px 0; }
.dep-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fffbeb; border-radius: 4px; margin-bottom: 4px; }
.dep-name { font-weight: 600; color: #92400e; font-family: monospace; }
.dep-size { color: #a16207; font-size: 12px; }
.dep-status { font-size: 11px; padding: 2px 8px; border-radius: 10px; }
.status-cached { background: #d1fae5; color: #065f46; }
.status-new { background: #fef3c7; color: #92400e; }
.status-native { background: #dbeafe; color: #1e40af; }
.status-rebuilding { background: #fed7aa; color: #9a3412; animation: pulse 1s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
.summary-bar { display: flex; justify-content: space-between; padding: 10px 12px; background: #ffedd5; border-radius: 6px; font-size: 13px; color: #7c2d12; }
.summary-bar strong { color: #c2410c; }
small { color: #8a6d42; }
</style>
`;export{n as default};
