const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'intro' | 'config' | 'demo' | 'structure'>('intro')

const pages = [
  { id: 'home', name: '首页', path: '/index.html', entry: 'src/main.ts', icon: '🏠' },
  { id: 'admin', name: '管理后台', path: '/admin.html', entry: 'src/admin/main.ts', icon: '⚙️' },
  { id: 'docs', name: '文档中心', path: '/docs.html', entry: 'src/docs/main.ts', icon: '📚' },
  { id: 'mobile', name: '移动端', path: '/mobile.html', entry: 'src/mobile/main.ts', icon: '📱' },
]

const selectedPage = ref('home')

const currentPage = computed(() => {
  return pages.find(p => p.id === selectedPage.value) || pages[0]
})

const configCode = \`<span style="color:#7c7c99">// vite.config.ts - 多页面配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    rollupOptions: {
      <span style="color:#7c7c99">// 配置多页面入口</span>
      input: {
        <span style="color:#7c7c99">// 首页</span>
        main: resolve(__dirname, 'index.html'),
        
        <span style="color:#7c7c99">// 管理后台</span>
        admin: resolve(__dirname, 'admin.html'),
        
        <span style="color:#7c7c99">// 文档中心</span>
        docs: resolve(__dirname, 'docs.html'),
        
        <span style="color:#7c7c99">// 移动端</span>
        mobile: resolve(__dirname, 'mobile.html'),
      },
      
      output: {
        <span style="color:#7c7c99">// 按页面拆分 chunk</span>
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('element-plus')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  
  server: {
    <span style="color:#7c7c99">// 开发服务器打开指定页面</span>
    open: '/index.html',
  },
})\`

const htmlCode = \`<span style="color:#7c7c99">&lt;!-- admin.html --&gt;</span>
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;link rel="icon" type="image/svg+xml" href="/favicon.ico" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;title&gt;管理后台&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="admin-app"&gt;&lt;/div&gt;
  &lt;script type="module" src="/src/admin/main.ts"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;

<span style="color:#7c7c99">&lt;!-- src/admin/main.ts --&gt;</span>
import { createApp } from 'vue'
import AdminApp from './AdminApp.vue'
import router from './router'
import store from './store'

createApp(AdminApp)
  .use(router)
  .use(store)
  .mount('#admin-app')\`

const structureCode = \`project-root/
├── index.html           <span style="color:#7c7c99"># 首页入口</span>
├── admin.html           <span style="color:#7c7c99"># 管理后台入口</span>
├── docs.html            <span style="color:#7c7c99"># 文档中心入口</span>
├── mobile.html          <span style="color:#7c7c99"># 移动端入口</span>
├── vite.config.ts
├── package.json
└── src/
    ├── main.ts          <span style="color:#7c7c99"># 首页入口脚本</span>
    ├── App.vue
    ├── components/      <span style="color:#7c7c99"># 共享组件</span>
    │   ├── Button.vue
    │   └── Card.vue
    ├── utils/           <span style="color:#7c7c99"># 共享工具</span>
    │   └── request.ts
    ├── stores/          <span style="color:#7c7c99"># 共享状态</span>
    │   └── user.ts
    ├── admin/           <span style="color:#7c7c99"># 管理后台模块</span>
    │   ├── main.ts
    │   ├── AdminApp.vue
    │   ├── router/
    │   └── views/
    ├── docs/            <span style="color:#7c7c99"># 文档中心模块</span>
    │   ├── main.ts
    │   ├── DocsApp.vue
    │   └── pages/
    └── mobile/          <span style="color:#7c7c99"># 移动端模块</span>
        ├── main.ts
        ├── MobileApp.vue
        └── views/\`

const buildDemo = ref({
  isBuilding: false,
  progress: 0,
  currentStep: '',
  outputFiles: [] as { name: string; size: string; type: string }[],
})

const buildSteps = [
  '🔍 解析多页面入口...',
  '📦 打包首页资源...',
  '📦 打包管理后台...',
  '📦 打包文档中心...',
  '📦 打包移动端...',
  '🎨 提取公共样式...',
  '🔗 拆分共享代码...',
  '✅ 构建完成！',
]

const outputFilesTemplate = [
  { name: 'index.html', size: '1.2 KB', type: 'html' },
  { name: 'admin.html', size: '1.1 KB', type: 'html' },
  { name: 'docs.html', size: '1.0 KB', type: 'html' },
  { name: 'mobile.html', size: '1.0 KB', type: 'html' },
  { name: 'assets/main-abc123.js', size: '68.4 KB', type: 'js' },
  { name: 'assets/admin-def456.js', size: '85.2 KB', type: 'js' },
  { name: 'assets/docs-ghi789.js', size: '52.1 KB', type: 'js' },
  { name: 'assets/mobile-jkl012.js', size: '45.8 KB', type: 'js' },
  { name: 'assets/vendor-vue-mno345.js', size: '125.6 KB', type: 'vendor' },
  { name: 'assets/style-pqr678.css', size: '24.3 KB', type: 'css' },
]

async function startBuild() {
  if (buildDemo.value.isBuilding) return
  
  buildDemo.value.isBuilding = true
  buildDemo.value.progress = 0
  buildDemo.value.outputFiles = []
  
  for (let i = 0; i < buildSteps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 250))
    buildDemo.value.currentStep = buildSteps[i]
    buildDemo.value.progress = ((i + 1) / buildSteps.length) * 100
    
    if (i === 1) {
      buildDemo.value.outputFiles.push(outputFilesTemplate[0])
      buildDemo.value.outputFiles.push(outputFilesTemplate[4])
    }
    if (i === 2) {
      buildDemo.value.outputFiles.push(outputFilesTemplate[1])
      buildDemo.value.outputFiles.push(outputFilesTemplate[5])
    }
    if (i === 3) {
      buildDemo.value.outputFiles.push(outputFilesTemplate[2])
      buildDemo.value.outputFiles.push(outputFilesTemplate[6])
    }
    if (i === 4) {
      buildDemo.value.outputFiles.push(outputFilesTemplate[3])
      buildDemo.value.outputFiles.push(outputFilesTemplate[7])
    }
    if (i === 6) {
      buildDemo.value.outputFiles.push(outputFilesTemplate[8])
      buildDemo.value.outputFiles.push(outputFilesTemplate[9])
    }
  }
  
  setTimeout(() => {
    buildDemo.value.isBuilding = false
  }, 500)
}

function getFileIcon(type: string) {
  const map: Record<string, string> = {
    html: '📄',
    js: '📜',
    css: '🎨',
    vendor: '📦',
  }
  return map[type] || '📁'
}

function getFileTypeLabel(type: string) {
  const map: Record<string, string> = {
    html: 'HTML',
    js: '页面 JS',
    css: '样式',
    vendor: '公共依赖',
  }
  return map[type] || type
}

const pageSwitcher = ref('home')

const pageContent: Record<string, { title: string; desc: string; features: string[] }> = {
  home: {
    title: '首页',
    desc: '面向普通用户的主站点，展示产品介绍、新闻资讯等内容。',
    features: ['响应式设计', 'SEO 优化', '内容管理'],
  },
  admin: {
    title: '管理后台',
    desc: '运营人员使用的后台管理系统，包含数据统计、用户管理等功能。',
    features: ['权限控制', '数据可视化', '批量操作'],
  },
  docs: {
    title: '文档中心',
    desc: '产品文档和 API 文档站点，提供搜索、导航等功能。',
    features: ['全文搜索', '版本管理', '代码高亮'],
  },
  mobile: {
    title: '移动端',
    desc: '针对手机端优化的 H5 页面，提供类原生的交互体验。',
    features: ['触摸优化', '轻量快速', '离线缓存'],
  },
}

const currentPageContent = computed(() => pageContent[pageSwitcher.value])
<\/script>

<template>
  <div class="demo-card">
    <h3>V21 · 多页面应用配置与入口管理</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">适用场景</button>
      <button class="tab-btn" :class="{ active: activeTab === 'structure' }" @click="activeTab = 'structure'">目录结构</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置示例</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">构建演示</button>
    </div>

    <div v-if="activeTab === 'intro'">
      <p class="intro-text">
        多页面应用（MPA）是指有多个独立 HTML 入口页面的应用。Vite 通过配置多个入口，支持多页面同时开发和构建。
      </p>
      
      <div class="page-switcher">
        <button 
          v-for="page in pages" 
          :key="page.id"
          class="page-tab"
          :class="{ active: pageSwitcher === page.id }"
          @click="pageSwitcher = page.id"
        >
          <span class="page-icon">{{ page.icon }}</span>
          <span>{{ page.name }}</span>
        </button>
      </div>
      
      <div class="page-preview">
        <div class="preview-header">
          <span class="preview-title">{{ currentPage.icon }} {{ currentPageContent.title }}</span>
          <code class="preview-path">{{ currentPage.path }}</code>
        </div>
        <div class="preview-body">
          <p class="preview-desc">{{ currentPageContent.desc }}</p>
          <div class="preview-features">
            <span v-for="f in currentPageContent.features" :key="f" class="feature-tag">
              ✓ {{ f }}
            </span>
          </div>
          <div class="preview-entry">
            <span>入口文件：</span>
            <code>{{ currentPage.entry }}</code>
          </div>
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>适用场景：</strong>一个项目包含多个独立应用（如前台 + 后台）、需要 SEO 的页面、不同端的入口页面等。共享组件和工具可放在公共目录复用。</p>
      </div>
    </div>

    <div v-if="activeTab === 'structure'">
      <h4>推荐目录结构</h4>
      <pre class="mini-code" v-html="structureCode"></pre>
      <div class="tips-box">
        <p><strong>最佳实践：</strong>共享的组件、工具函数、状态管理放在根目录的 <code>src/components</code>、<code>src/utils</code>、<code>src/stores</code> 中，各页面独立模块放在各自目录下。</p>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <pre class="mini-code" v-html="configCode"></pre>
      <h4 style="margin-top:12px;">HTML 入口示例</h4>
      <pre class="mini-code" v-html="htmlCode"></pre>
      <div class="tips-box">
        <p><strong>注意：</strong>每个 HTML 文件需要有对应的入口脚本（main.ts），mount 到不同的 DOM 元素（如 #app、#admin-app）以避免冲突。</p>
      </div>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="build-demo">
        <div class="build-header">
          <span class="build-title">🏗️ 多页面构建模拟器</span>
          <button class="action-btn primary" :disabled="buildDemo.isBuilding" @click="startBuild">
            {{ buildDemo.isBuilding ? '构建中...' : '▶ 开始构建' }}
          </button>
        </div>
        
        <div v-if="buildDemo.isBuilding || buildDemo.progress > 0" class="build-progress">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: buildDemo.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ buildDemo.currentStep }}</span>
        </div>
        
        <div v-if="buildDemo.outputFiles.length > 0" class="output-section">
          <h5>📁 输出文件 (dist/)</h5>
          <ul class="output-list">
            <li v-for="file in buildDemo.outputFiles" :key="file.name" class="output-item">
              <span class="file-icon">{{ getFileIcon(file.type) }}</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <span class="type-tag">{{ getFileTypeLabel(file.type) }}</span>
            </li>
          </ul>
          
          <div class="build-summary">
            <div class="summary-item">
              <span class="summary-value">{{ buildDemo.outputFiles.filter(f => f.type === 'html').length }}</span>
              <span class="summary-label">HTML 页面</span>
            </div>
            <div class="summary-item">
              <span class="summary-value">{{ buildDemo.outputFiles.filter(f => f.type === 'js').length }}</span>
              <span class="summary-label">页面脚本</span>
            </div>
            <div class="summary-item">
              <span class="summary-value highlight">{{ buildDemo.outputFiles.filter(f => f.type === 'vendor').length }}</span>
              <span class="summary-label">共享依赖</span>
            </div>
          </div>
        </div>
        
        <div v-if="buildDemo.outputFiles.length === 0 && !buildDemo.isBuilding" class="empty-state">
          点击「开始构建」模拟多页面打包过程
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>代码分割：</strong>使用 <code>manualChunks</code> 将共享依赖（如 vue、组件库）提取为单独的 chunk，多个页面共享缓存，减少重复加载。</p>
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
.tips-box code { background: #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
.intro-text { font-size: 13px; color: #78350f; margin: 0 0 12px 0; }
.page-switcher { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.page-tab { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid #fdba74; border-radius: 6px; background: #fff; cursor: pointer; font-size: 13px; color: #92400e; transition: all 0.2s; }
.page-tab:hover { background: #fff7ed; }
.page-tab.active { background: #ea580c; color: #fff; border-color: #ea580c; }
.page-icon { font-size: 16px; }
.page-preview { background: #fffbeb; border-radius: 8px; overflow: hidden; }
.preview-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #fed7aa; }
.preview-title { font-weight: 600; color: #92400e; font-size: 14px; }
.preview-path { font-size: 11px; color: #c2410c; background: #ffedd5; padding: 2px 8px; border-radius: 4px; }
.preview-body { padding: 14px; }
.preview-desc { margin: 0 0 10px 0; font-size: 13px; color: #78350f; }
.preview-features { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.feature-tag { font-size: 12px; padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 4px; }
.preview-entry { font-size: 12px; color: #a16207; display: flex; align-items: center; gap: 6px; }
.preview-entry code { background: #fef3c7; padding: 2px 6px; border-radius: 3px; font-size: 11px; color: #92400e; }
.build-demo { background: #fffbeb; border-radius: 8px; padding: 12px; }
.build-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.build-title { font-weight: 600; color: #92400e; font-size: 14px; }
.action-btn { padding: 6px 12px; border: 1px solid #fdba74; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: #92400e; }
.action-btn.primary { background: #ea580c; color: #fff; border-color: #ea580c; }
.action-btn:disabled { background: #fbbf24; cursor: not-allowed; }
.build-progress { margin-bottom: 12px; }
.progress-track { height: 8px; background: #fed7aa; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 4px; transition: width 0.3s ease; }
.progress-text { display: block; font-size: 12px; color: #92400e; margin-top: 6px; }
.output-section h5 { margin: 0 0 8px 0; color: #92400e; font-size: 13px; }
.output-list { list-style: none; padding: 0; margin: 0 0 12px 0; display: flex; flex-direction: column; gap: 4px; max-height: 200px; overflow-y: auto; }
.output-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: #fff; border-radius: 4px; font-size: 12px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.file-name { flex: 1; color: #78350f; font-family: monospace; font-size: 11px; }
.file-size { color: #a16207; }
.type-tag { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: #fef3c7; color: #92400e; }
.build-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding-top: 10px; border-top: 1px solid #fed7aa; }
.summary-item { text-align: center; background: #fff; padding: 8px; border-radius: 4px; }
.summary-value { display: block; font-size: 20px; font-weight: 700; color: #92400e; }
.summary-value.highlight { color: #ea580c; }
.summary-label { font-size: 11px; color: #a16207; }
.empty-state { text-align: center; padding: 30px; color: #a16207; font-size: 13px; }
h4 { color: #92400e; margin: 12px 0 8px 0; font-size: 15px; }
</style>
`;export{n as default};
