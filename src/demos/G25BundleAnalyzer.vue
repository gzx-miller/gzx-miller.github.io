<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'analyzer' | 'split' | 'optimize'

interface BundleModule {
  name: string
  size: number
  gzipSize: number
  category: 'vendor' | 'app' | 'style' | 'asset'
  color: string
}

interface SplitChunk {
  name: string
  reason: string
  size: number
  strategy: string
}

const activeTab = ref<TabKey>('analyzer')
const viewMode = ref<'treemap' | 'list'>('list')
const showGzip = ref(true)

const modules: BundleModule[] = [
  { name: 'vue', size: 135, gzipSize: 42, category: 'vendor', color: '#42b883' },
  { name: 'vue-router', size: 48, gzipSize: 15, category: 'vendor', color: '#42b883' },
  { name: 'pinia', size: 28, gzipSize: 9, category: 'vendor', color: '#42b883' },
  { name: 'element-plus', size: 520, gzipSize: 168, category: 'vendor', color: '#409eff' },
  { name: 'echarts', size: 780, gzipSize: 245, category: 'vendor', color: '#ff4d6d' },
  { name: 'lodash', size: 68, gzipSize: 22, category: 'vendor', color: '#3492cb' },
  { name: 'axios', size: 18, gzipSize: 6, category: 'vendor', color: '#5a29e4' },
  { name: 'dayjs', size: 8, gzipSize: 3, category: 'vendor', color: '#ff6b35' },
  { name: 'app main', size: 45, gzipSize: 12, category: 'app', color: '#e85d04' },
  { name: 'views/ Dashboard', size: 32, gzipSize: 9, category: 'app', color: '#e85d04' },
  { name: 'views/ UserList', size: 25, gzipSize: 7, category: 'app', color: '#e85d04' },
  { name: 'views/ Settings', size: 18, gzipSize: 5, category: 'app', color: '#e85d04' },
  { name: 'components/ common', size: 28, gzipSize: 8, category: 'app', color: '#e85d04' },
  { name: 'components/ business', size: 42, gzipSize: 11, category: 'app', color: '#e85d04' },
  { name: 'global styles', size: 45, gzipSize: 12, category: 'style', color: '#c356d3' },
  { name: 'element-plus css', size: 85, gzipSize: 18, category: 'style', color: '#409eff' },
  { name: 'images / icons', size: 85, gzipSize: 85, category: 'asset', color: '#6b8e23' },
  { name: 'fonts', size: 120, gzipSize: 120, category: 'asset', color: '#8b7355' },
]

const splitChunks: SplitChunk[] = [
  { name: 'vue-vendor', reason: 'Vue 核心框架，稳定不常变', size: 211, strategy: '按框架分离' },
  { name: 'ui-vendor', reason: 'UI 组件库，体积大独立缓存', size: 605, strategy: '按库分离' },
  { name: 'chart-vendor', reason: '图表库按需加载，首屏不加载', size: 780, strategy: '按需加载' },
  { name: 'utils-vendor', reason: '工具函数库，稳定依赖', size: 94, strategy: '按功能分离' },
  { name: 'common-chunk', reason: '多页面共享的业务代码', size: 70, strategy: '共享提取' },
]

const totalSize = computed(() => modules.reduce((sum, m) => sum + m.size, 0))
const totalGzipSize = computed(() => modules.reduce((sum, m) => sum + m.gzipSize, 0))

const vendorSize = computed(() => modules.filter(m => m.category === 'vendor').reduce((s, m) => s + m.size, 0))
const appSize = computed(() => modules.filter(m => m.category === 'app').reduce((s, m) => s + m.size, 0))
const styleSize = computed(() => modules.filter(m => m.category === 'style').reduce((s, m) => s + m.size, 0))
const assetSize = computed(() => modules.filter(m => m.category === 'asset').reduce((s, m) => s + m.size, 0))

const configExample = `<span style="color:#8a8a3a">// vite.config.ts 代码分割配置</span>
<span style="color:#c586c0">import</span> { defineConfig } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'vite'</span>
<span style="color:#c586c0">import</span> vue <span style="color:#c586c0">from</span> <span style="color:#ce9178">'@vitejs/plugin-vue'</span>

<span style="color:#c586c0">export default</span> <span style="color:#dcdcaa">defineConfig</span>({
  <span style="color:#9cdcfe">plugins</span>: [<span style="color:#dcdcaa">vue</span>()],
  <span style="color:#9cdcfe">build</span>: {
    <span style="color:#9cdcfe">rollupOptions</span>: {
      <span style="color:#9cdcfe">output</span>: {
        <span style="color:#7c7c99">// 手动分包策略</span>
        <span style="color:#9cdcfe">manualChunks</span>: {
          <span style="color:#ce9178">'vue-vendor'</span>: [<span style="color:#ce9178">'vue'</span>, <span style="color:#ce9178">'vue-router'</span>, <span style="color:#ce9178">'pinia'</span>],
          <span style="color:#ce9178">'ui-vendor'</span>: [<span style="color:#ce9178">'element-plus'</span>, <span style="color:#ce9178">'@element-plus/icons-vue'</span>],
          <span style="color:#ce9178">'utils-vendor'</span>: [<span style="color:#ce9178">'lodash-es'</span>, <span style="color:#ce9178">'dayjs'</span>, <span style="color:#ce9178">'axios'</span>],
        },

        <span style="color:#7c7c99">// 资源文件命名</span>
        <span style="color:#9cdcfe">chunkFileNames</span>: <span style="color:#ce9178">'assets/js/[name]-[hash].js'</span>,
        <span style="color:#9cdcfe">entryFileNames</span>: <span style="color:#ce9178">'assets/js/[name]-[hash].js'</span>,
        <span style="color:#9cdcfe">assetFileNames</span>: <span style="color:#ce9178">'assets/[ext]/[name]-[hash].[ext]'</span>,
      },
    },

    <span style="color:#7c7c99">// 压缩与产物优化</span>
    <span style="color:#9cdcfe">minify</span>: <span style="color:#ce9178">'esbuild'</span>,
    <span style="color:#9cdcfe">cssCodeSplit</span>: <span style="color:#569cd6">true</span>,
    <span style="color:#9cdcfe">sourcemap</span>: <span style="color:#569cd6">false</span>,
    <span style="color:#9cdcfe">reportCompressedSize</span>: <span style="color:#569cd6">false</span>,

    <span style="color:#7c7c99">// chunk 大小警告（超过 500KB 警告）</span>
    <span style="color:#9cdcfe">chunkSizeWarningLimit</span>: <span style="color:#b5cea8">500</span>,
  },
})

<span style="color:#8a8a3a">// 路由级代码分割</span>
<span style="color:#c586c0">const</span> routes = [
  {
    <span style="color:#9cdcfe">path</span>: <span style="color:#ce9178">'/dashboard'</span>,
    <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'Dashboard'</span>,
    <span style="color:#7c7c99">// 动态导入，访问时才加载</span>
    <span style="color:#9cdcfe">component</span>: () => <span style="color:#c586c0">import</span>(<span style="color:#ce9178">'@/views/Dashboard.vue'</span>),
  },
  {
    <span style="color:#9cdcfe">path</span>: <span style="color:#ce9178">'/charts'</span>,
    <span style="color:#9cdcfe">name</span>: <span style="color:#ce9178">'Charts'</span>,
    <span style="color:#7c7c99">// 图表页面单独分包，首屏不加载</span>
    <span style="color:#9cdcfe">component</span>: () => <span style="color:#dcdcaa">import</span>(
      <span style="color:#ce9178">/* @vite-ignore */</span>
      <span style="color:#ce9178">/* webpackChunkName: "charts" */</span>
      <span style="color:#ce9178">'@/views/Charts.vue'</span>
    ),
  },
]`

const optimizeTips = [
  { title: '路由级代码分割', desc: '使用动态 import()，每个路由页面独立打包，访问时才加载', icon: '📂' },
  { title: '大库按需加载', desc: 'ECharts、Lodash、Moment 等大库使用按需引入，避免全量打包', icon: '🎯' },
  { title: '框架独立缓存', desc: 'Vue、React 等框架单独分包，长期缓存不随业务代码变化', icon: '📦' },
  { title: 'Tree Shaking', desc: '使用 ESM 模块，打包时自动移除未使用的代码', icon: '🌳' },
  { title: '图片优化', desc: '使用 WebP/AVIF 格式，小图转 base64，大图懒加载', icon: '🖼️' },
  { title: '预加载策略', desc: '关键资源 preload，次关键 prefetch，平衡加载速度与带宽', icon: '⚡' },
]

const sortedModules = computed(() => [...modules].sort((a, b) => b.size - a.size))

const getSizeDisplay = (size: number, gzip: number) => {
  return showGzip.value ? `${gzip} KB` : `${size} KB`
}

const getPercent = (size: number) => {
  return ((size / totalSize.value) * 100).toFixed(1)
}
</script>

<template>
  <div class="demo-card">
    <h3>打包体积分析与代码分割策略</h3>
    <p class="demo-hint">构建产物体积直接影响首屏加载速度。通过 Bundle 分析和合理的代码分割策略，可以显著提升应用性能。</p>

    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'analyzer' }" @click="activeTab = 'analyzer'">体积分析</button>
      <button class="tab-btn" :class="{ active: activeTab === 'split' }" @click="activeTab = 'split'">代码分割</button>
      <button class="tab-btn" :class="{ active: activeTab === 'optimize' }" @click="activeTab = 'optimize'">优化策略</button>
    </div>

    <div v-if="activeTab === 'analyzer'">
      <div class="analyzer-header">
        <div class="size-total">
          <span class="total-label">总大小</span>
          <span class="total-value">{{ showGzip ? totalGzipSize : totalSize }} KB</span>
          <span class="total-hint">{{ showGzip ? 'Gzip 压缩后' : '原始大小' }}</span>
        </div>
        <div class="view-controls">
          <label class="toggle-label">
            <input type="checkbox" v-model="showGzip" />
            显示 Gzip 大小
          </label>
        </div>
      </div>

      <div class="size-bars">
        <div class="bar-row">
          <span class="bar-label">依赖库</span>
          <div class="bar-track">
            <div class="bar-fill vendor" :style="{ width: (vendorSize / totalSize * 100) + '%' }"></div>
          </div>
          <span class="bar-value">{{ vendorSize }} KB</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">业务代码</span>
          <div class="bar-track">
            <div class="bar-fill app" :style="{ width: (appSize / totalSize * 100) + '%' }"></div>
          </div>
          <span class="bar-value">{{ appSize }} KB</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">样式文件</span>
          <div class="bar-track">
            <div class="bar-fill style" :style="{ width: (styleSize / totalSize * 100) + '%' }"></div>
          </div>
          <span class="bar-value">{{ styleSize }} KB</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">静态资源</span>
          <div class="bar-track">
            <div class="bar-fill asset" :style="{ width: (assetSize / totalSize * 100) + '%' }"></div>
          </div>
          <span class="bar-value">{{ assetSize }} KB</span>
        </div>
      </div>

      <table style="margin-top: 12px;">
        <thead>
          <tr>
            <th>模块</th>
            <th>原始大小</th>
            <th>Gzip 大小</th>
            <th>占比</th>
            <th>类别</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in sortedModules" :key="m.name">
            <td><code>{{ m.name }}</code></td>
            <td>{{ m.size }} KB</td>
            <td>{{ m.gzipSize }} KB</td>
            <td>
              <div class="percent-cell">
                <div class="percent-bar">
                  <div class="percent-fill" :style="{ width: getPercent(m.size) + '%', background: m.color }"></div>
                </div>
                <span class="percent-text">{{ getPercent(m.size) }}%</span>
              </div>
            </td>
            <td>
              <span class="category-tag" :style="{ background: m.color + '20', color: m.color }">
                {{ m.category === 'vendor' ? '依赖' : m.category === 'app' ? '业务' : m.category === 'style' ? '样式' : '资源' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'split'">
      <pre class="mini-code" v-html="configExample"></pre>
      <div class="chunks-demo" style="margin-top: 12px;">
        <h4>分包结果示例</h4>
        <div class="chunk-list">
          <div v-for="chunk in splitChunks" :key="chunk.name" class="chunk-item">
            <div class="chunk-header">
              <span class="chunk-name">{{ chunk.name }}.js</span>
              <span class="chunk-size">{{ chunk.size }} KB</span>
            </div>
            <p class="chunk-reason">{{ chunk.reason }}</p>
            <span class="chunk-strategy">{{ chunk.strategy }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'optimize'">
      <div class="optimize-grid">
        <div v-for="tip in optimizeTips" :key="tip.title" class="optimize-card">
          <span class="optimize-icon">{{ tip.icon }}</span>
          <h4>{{ tip.title }}</h4>
          <p>{{ tip.desc }}</p>
        </div>
      </div>
      <div class="tips-box" style="margin-top: 12px;">
        <p><strong>性能目标参考：</strong></p>
        <ul>
          <li>首屏 JS < 200KB (gzip)</li>
          <li>首屏 CSS < 50KB (gzip)</li>
          <li>LCP (最大内容绘制) < 2.5s</li>
          <li>TTI (可交互时间) < 3.8s</li>
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
.analyzer-header { display: flex; justify-content: space-between; align-items: center; background: #fffaf5; padding: 12px 16px; border-radius: 6px; border: 1px solid #e0d5c8; margin-bottom: 12px; }
.size-total { display: flex; align-items: baseline; gap: 10px; }
.total-label { font-size: 13px; color: #6b5a45; }
.total-value { font-size: 22px; font-weight: bold; color: #e85d04; }
.total-hint { font-size: 11px; color: #999; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b5a45; cursor: pointer; }
.size-bars { display: flex; flex-direction: column; gap: 8px; }
.bar-row { display: flex; align-items: center; gap: 10px; }
.bar-label { width: 60px; font-size: 12px; color: #6b5a45; }
.bar-track { flex: 1; height: 20px; background: #f5f0eb; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
.bar-fill.vendor { background: linear-gradient(90deg, #42b883, #35a070); }
.bar-fill.app { background: linear-gradient(90deg, #e85d04, #d45000); }
.bar-fill.style { background: linear-gradient(90deg, #c356d3, #a040b0); }
.bar-fill.asset { background: linear-gradient(90deg, #6b8e23, #556b2f); }
.bar-value { width: 70px; text-align: right; font-size: 12px; color: #6b5a45; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: middle; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.percent-cell { display: flex; align-items: center; gap: 8px; }
.percent-bar { flex: 1; height: 8px; background: #f0e8e0; border-radius: 4px; overflow: hidden; }
.percent-fill { height: 100%; border-radius: 4px; }
.percent-text { width: 45px; font-size: 11px; color: #666; text-align: right; }
.category-tag { padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.chunks-demo h4 { margin: 0 0 10px 0; font-size: 14px; color: #6b5a45; }
.chunk-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.chunk-item { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 6px; padding: 10px 12px; }
.chunk-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.chunk-name { font-family: monospace; font-size: 13px; font-weight: bold; color: #e85d04; }
.chunk-size { font-size: 12px; color: #6b5a45; font-weight: bold; }
.chunk-reason { margin: 0 0 6px 0; font-size: 12px; color: #6b5a45; }
.chunk-strategy { display: inline-block; font-size: 11px; padding: 2px 8px; background: rgba(232, 93, 4, 0.1); color: #e85d04; border-radius: 10px; }
.optimize-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.optimize-card { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 6px; padding: 12px; }
.optimize-icon { font-size: 24px; display: block; margin-bottom: 6px; }
.optimize-card h4 { margin: 0 0 4px 0; font-size: 14px; color: #e85d04; }
.optimize-card p { margin: 0; font-size: 12px; color: #6b5a45; line-height: 1.5; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box p { margin: 4px 0; font-size: 13px; }
.tips-box ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
.tips-box li { margin: 2px 0; }
</style>
