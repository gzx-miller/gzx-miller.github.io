<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'intro' | 'hooks' | 'demo' | 'custom'>('intro')

const lifecycleHooks = [
  { phase: '开发服务器', hook: 'configureServer', desc: '配置开发服务器，添加中间件等', type: 'vite' },
  { phase: '开发服务器', hook: 'handleHotUpdate', desc: '自定义 HMR 更新逻辑', type: 'vite' },
  { phase: '配置阶段', hook: 'config', desc: '修改 Vite 配置', type: 'vite' },
  { phase: '配置阶段', hook: 'configResolved', desc: '获取最终解析后的配置', type: 'vite' },
  { phase: '构建阶段', hook: 'options', desc: '替换或操作 rollup 选项', type: 'rollup' },
  { phase: '构建阶段', hook: 'buildStart', desc: '构建开始时调用', type: 'rollup' },
  { phase: '构建阶段', hook: 'resolveId', desc: '自定义模块解析', type: 'rollup' },
  { phase: '构建阶段', hook: 'load', desc: '自定义模块加载', type: 'rollup' },
  { phase: '构建阶段', hook: 'transform', desc: '转换模块内容', type: 'rollup' },
  { phase: '构建阶段', hook: 'buildEnd', desc: '构建结束时调用', type: 'rollup' },
  { phase: '输出阶段', hook: 'outputOptions', desc: '替换或操作输出选项', type: 'rollup' },
  { phase: '输出阶段', hook: 'generateBundle', desc: '生成 bundle 时调用', type: 'rollup' },
  { phase: '输出阶段', hook: 'writeBundle', desc: '写入 bundle 后调用', type: 'rollup' },
  { phase: '输出阶段', hook: 'closeBundle', desc: '关闭 bundle 时调用', type: 'rollup' },
]

const selectedHook = ref<string | null>(null)

const pluginDemo = ref({
  name: 'vite-plugin-file-info',
  enabled: true,
  transformCount: 0,
  files: [] as { name: string; size: string; transformed: boolean }[],
})

const customPluginCode = `<span style="color:#7c7c99">// vite-plugin-file-info.ts</span>
<span style="color:#7c7c99">// 一个简单的自定义 Vite 插件</span>
import type { Plugin } from 'vite'

export default function fileInfoPlugin(): Plugin {
  return {
    name: 'vite-plugin-file-info',
    
    <span style="color:#7c7c99">// Vite 特有钩子：配置解析完成</span>
    configResolved(config) {
      console.log('[file-info] 配置已解析')
    },
    
    <span style="color:#7c7c99">// Vite 特有钩子：开发服务器配置</span>
    configureServer(server) {
      console.log('[file-info] 开发服务器已启动')
    },
    
    <span style="color:#7c7c99">// Rollup 钩子：模块转换</span>
    transform(code, id) {
      <span style="color:#7c7c99">// 只处理 .vue 和 .ts 文件</span>
      if (id.endsWith('.vue') || id.endsWith('.ts')) {
        const lines = code.split('\n').length
        console.log(\`[file-info] \${id}: \${lines} 行\`)
        
        <span style="color:#7c7c99">// 可以返回转换后的代码</span>
        return {
          code,
          map: null
        }
      }
    },
    
    <span style="color:#7c7c99">// Rollup 钩子：生成 bundle</span>
    generateBundle(options, bundle) {
      const files = Object.keys(bundle)
      console.log(\`[file-info] 共生成 \${files.length} 个文件\`)
    }
  }
}

<span style="color:#7c7c99">// 使用方式：vite.config.ts</span>
<span style="color:#7c7c99">// import fileInfo from './vite-plugin-file-info'</span>
<span style="color:#7c7c99">// plugins: [vue(), fileInfo()]</span>`

const configCode = `<span style="color:#7c7c99">// vite.config.ts - 插件配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      <span style="color:#7c7c99">// 自动导入 components 目录下的组件</span>
      dirs: ['src/components'],
      dts: true,
    }),
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  build: {
    rollupOptions: {
      <span style="color:#7c7c99">// Rollup 原生配置</span>
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})`

const mockFiles = [
  { name: 'App.vue', size: '2.4 KB' },
  { name: 'main.ts', size: '0.8 KB' },
  { name: 'components/Button.vue', size: '3.2 KB' },
  { name: 'components/Card.vue', size: '2.1 KB' },
  { name: 'views/Home.vue', size: '5.6 KB' },
  { name: 'stores/user.ts', size: '1.9 KB' },
  { name: 'utils/request.ts', size: '1.2 KB' },
]

function runPluginDemo() {
  pluginDemo.value.transformCount = 0
  pluginDemo.value.files = []
  
  let index = 0
  const interval = setInterval(() => {
    if (index >= mockFiles.length) {
      clearInterval(interval)
      return
    }
    
    const file = mockFiles[index]
    const isTransformed = file.name.endsWith('.vue') || file.name.endsWith('.ts')
    
    pluginDemo.value.files.push({
      ...file,
      transformed: isTransformed
    })
    
    if (isTransformed) {
      pluginDemo.value.transformCount++
    }
    
    index++
  }, 300)
}

function resetDemo() {
  pluginDemo.value.transformCount = 0
  pluginDemo.value.files = []
}

const hookFilter = ref<'all' | 'vite' | 'rollup'>('all')

const filteredHooks = computed(() => {
  if (hookFilter.value === 'all') return lifecycleHooks
  return lifecycleHooks.filter(h => h.type === hookFilter.value)
})
</script>

<template>
  <div class="demo-card">
    <h3>V19 · Rollup 插件兼容与构建钩子</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">插件简介</button>
      <button class="tab-btn" :class="{ active: activeTab === 'hooks' }" @click="activeTab = 'hooks'">钩子列表</button>
      <button class="tab-btn" :class="{ active: activeTab === 'custom' }" @click="activeTab = 'custom'">自定义插件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">交互演示</button>
    </div>

    <div v-if="activeTab === 'intro'">
      <div class="intro-section">
        <h4>Vite 插件 = Rollup 插件 + Vite 扩展</h4>
        <p class="intro-text">Vite 插件系统基于 Rollup 插件接口扩展，兼容大多数 Rollup 插件，同时提供 Vite 特有的钩子。</p>
        
        <div class="compare-cards">
          <div class="compare-card">
            <div class="card-header vite">
              <span class="card-icon">⚡</span>
              <strong>Vite 特有钩子</strong>
            </div>
            <ul class="card-list">
              <li>config - 修改配置</li>
              <li>configResolved - 配置解析后</li>
              <li>configureServer - 开发服务器</li>
              <li>transformIndexHtml - 转换 HTML</li>
              <li>handleHotUpdate - HMR 处理</li>
            </ul>
          </div>
          
          <div class="compare-card">
            <div class="card-header rollup">
              <span class="card-icon">📦</span>
              <strong>Rollup 通用钩子</strong>
            </div>
            <ul class="card-list">
              <li>options - 构建选项</li>
              <li>resolveId - 模块解析</li>
              <li>load - 模块加载</li>
              <li>transform - 代码转换</li>
              <li>generateBundle - 生成产物</li>
            </ul>
          </div>
        </div>
      </div>
      
      <h4 style="margin-top:12px;">配置示例</h4>
      <pre class="mini-code" v-html="configCode"></pre>
      
      <div class="tips-box">
        <p><strong>兼容性：</strong>绝大多数 Rollup 插件可以直接在 Vite 中使用，但只在生产构建时生效。开发阶段 Vite 使用 esbuild，部分 Rollup 钩子不会被调用。</p>
      </div>
    </div>

    <div v-if="activeTab === 'hooks'">
      <div class="filter-bar">
        <span>筛选：</span>
        <button :class="{ active: hookFilter === 'all' }" @click="hookFilter = 'all'">全部</button>
        <button :class="{ active: hookFilter === 'vite' }" @click="hookFilter = 'vite'">Vite 特有</button>
        <button :class="{ active: hookFilter === 'rollup' }" @click="hookFilter = 'rollup'">Rollup 通用</button>
      </div>
      
      <div class="hooks-list">
        <div 
          v-for="hook in filteredHooks" 
          :key="hook.hook" 
          class="hook-item"
          :class="{ [hook.type]: true, selected: selectedHook === hook.hook }"
          @click="selectedHook = selectedHook === hook.hook ? null : hook.hook"
        >
          <span class="hook-phase">{{ hook.phase }}</span>
          <code class="hook-name">{{ hook.hook }}</code>
          <span class="hook-type-badge" :class="hook.type">
            {{ hook.type === 'vite' ? 'Vite' : 'Rollup' }}
          </span>
          <p v-if="selectedHook === hook.hook" class="hook-desc">{{ hook.desc }}</p>
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>提示：</strong>点击钩子项可查看详细说明。Vite 特有钩子在开发和构建阶段都可能调用，Rollup 钩子主要在生产构建时调用。</p>
      </div>
    </div>

    <div v-if="activeTab === 'custom'">
      <pre class="mini-code" v-html="customPluginCode"></pre>
      <div class="tips-box">
        <p><strong>插件约定：</strong>插件函数返回一个包含 name 和各种钩子的对象。name 是插件的唯一标识，用于日志和错误提示。</p>
      </div>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="demo-panel">
        <div class="demo-toolbar">
          <span class="demo-title">🔌 {{ pluginDemo.name }}</span>
          <div class="demo-actions">
            <button class="action-btn primary" @click="runPluginDemo">▶ 运行插件</button>
            <button class="action-btn" @click="resetDemo">↺ 重置</button>
          </div>
        </div>
        
        <div class="demo-stats">
          <div class="stat-item">
            <span class="stat-value">{{ pluginDemo.files.length }}</span>
            <span class="stat-label">处理文件数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value highlight">{{ pluginDemo.transformCount }}</span>
            <span class="stat-label">transform 触发</span>
          </div>
        </div>
        
        <div class="file-list">
          <div 
            v-for="(file, idx) in pluginDemo.files" 
            :key="file.name" 
            class="file-item"
            :style="{ animationDelay: idx * 0.1 + 's' }"
          >
            <span class="file-icon">{{ file.name.endsWith('.vue') ? '🟢' : '🔵' }}</span>
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ file.size }}</span>
            <span class="file-status" :class="{ transformed: file.transformed }">
              {{ file.transformed ? 'transform ✓' : '跳过' }}
            </span>
          </div>
          <div v-if="pluginDemo.files.length === 0" class="empty-state">
            点击「运行插件」开始模拟
          </div>
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>观察：</strong>插件只处理 .vue 和 .ts 文件，在 transform 钩子中统计文件行数。实际开发中可以利用钩子做代码注入、资源处理、性能监控等。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.tab-btn { padding: 5px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; color: #5c4033; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.6; white-space: pre-wrap; }
.tips-box { background: #fef3c7; padding: 10px; border-radius: 6px; border-left: 3px solid #d97706; margin-top: 10px; }
.tips-box p { margin: 0; font-size: 13px; color: #78350f; }
.intro-text { font-size: 13px; color: #78350f; margin: 8px 0 12px 0; }
.compare-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.compare-card { background: #fffbeb; border-radius: 6px; overflow: hidden; }
.card-header { display: flex; align-items: center; gap: 8px; padding: 10px 12px; color: #fff; font-size: 14px; }
.card-header.vite { background: linear-gradient(135deg, #f97316, #ea580c); }
.card-header.rollup { background: linear-gradient(135deg, #dc2626, #b91c1c); }
.card-icon { font-size: 18px; }
.card-list { list-style: none; padding: 10px 12px; margin: 0; font-size: 12px; color: #78350f; }
.card-list li { padding: 4px 0; }
.filter-bar { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; font-size: 13px; color: #92400e; }
.filter-bar button { padding: 4px 10px; border: 1px solid #fdba74; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: #92400e; }
.filter-bar button.active { background: #ea580c; color: #fff; border-color: #ea580c; }
.hooks-list { display: flex; flex-direction: column; gap: 4px; }
.hook-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #fffbeb; border-radius: 4px; cursor: pointer; transition: all 0.2s; flex-wrap: wrap; }
.hook-item:hover { background: #fef3c7; }
.hook-item.selected { background: #fed7aa; }
.hook-phase { font-size: 11px; color: #a16207; background: #fef3c7; padding: 2px 6px; border-radius: 3px; }
.hook-name { font-family: monospace; font-size: 13px; color: #c2410c; font-weight: 600; }
.hook-type-badge { font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-left: auto; }
.hook-type-badge.vite { background: #ffedd5; color: #9a3412; }
.hook-type-badge.rollup { background: #fee2e2; color: #991b1b; }
.hook-desc { width: 100%; margin: 6px 0 0 0; font-size: 12px; color: #78350f; }
.demo-panel { background: #fffbeb; border-radius: 8px; padding: 12px; }
.demo-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.demo-title { font-weight: 600; color: #92400e; font-size: 14px; }
.demo-actions { display: flex; gap: 6px; }
.action-btn { padding: 6px 12px; border: 1px solid #fdba74; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: #92400e; }
.action-btn.primary { background: #ea580c; color: #fff; border-color: #ea580c; }
.demo-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.stat-item { background: #fff; padding: 10px; border-radius: 6px; text-align: center; }
.stat-value { display: block; font-size: 24px; font-weight: 700; color: #92400e; }
.stat-value.highlight { color: #ea580c; }
.stat-label { font-size: 12px; color: #a16207; }
.file-list { display: flex; flex-direction: column; gap: 4px; max-height: 220px; overflow-y: auto; }
.file-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: #fff; border-radius: 4px; font-size: 12px; animation: slideIn 0.3s ease forwards; opacity: 0; }
@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
.file-name { flex: 1; color: #78350f; font-family: monospace; }
.file-size { color: #a16207; }
.file-status { font-size: 11px; padding: 2px 6px; border-radius: 3px; background: #f3f4f6; color: #6b7280; }
.file-status.transformed { background: #d1fae5; color: #065f46; }
.empty-state { text-align: center; padding: 30px; color: #a16207; font-size: 13px; }
h4 { color: #92400e; margin: 12px 0 8px 0; font-size: 15px; }
small { color: #8a6d42; }
</style>
