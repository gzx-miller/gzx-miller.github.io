const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'concept' | 'compare' | 'config'>('concept')

const concepts = [
  { label: '原生 ESM', icon: '⚡', desc: '开发阶段直接用浏览器加载 ES 模块，无需打包。浏览器按需请求文件，冷启动不受项目规模影响。' },
  { label: '基于 Rollup', icon: '📦', desc: '生产构建使用 Rollup，输出高度优化的静态资源：Tree Shaking、代码分割、压缩一应俱全。' },
  { label: 'HMR 热更新', icon: '🔥', desc: '基于 ESM 的热更新，只更新修改的模块，保留组件状态，速度极快（毫秒级）。' },
  { label: '插件系统', icon: '🔌', desc: '兼容 Rollup 插件接口，同时提供 Vite 特有钩子（config、configureServer 等）。' },
]

const compareRows = [
  { aspect: '开发启动', vite: '毫秒级（原生 ESM）', webpack: '秒级（需打包）' },
  { aspect: 'HMR 速度', vite: '毫秒级（单模块）', webpack: '秒级（重打包）' },
  { aspect: '冷启动', vite: '不受项目规模影响', webpack: '随规模变慢' },
  { aspect: '生产构建', vite: 'Rollup', webpack: 'webpack 自身' },
  { aspect: '配置复杂度', vite: '简洁', webpack: '复杂' },
  { aspect: '生态成熟度', vite: '快速成长中', webpack: '非常成熟' },
]

const configCode = \`<span style="color:#7c7c99">// vite.config.ts</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 开发服务器</span>
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'  <span style="color:#7c7c99">// 代理后端</span>
    }
  },
  
  <span style="color:#7c7c99">// 路径别名</span>
  resolve: {
    alias: { '@': '/src' }
  },
  
  <span style="color:#7c7c99">// 生产构建优化</span>
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})\`

const lifecycleCode = \`<span style="color:#7c7c99">// Vite 两大阶段</span>

<span style="color:#e85d04">┌─────────────────────────────────┐</span>
<span style="color:#e85d04">│     开发阶段 (dev)              │</span>
<span style="color:#e85d04">│  浏览器 ←ESM→ Vite Dev Server   │</span>
<span style="color:#e85d04">│  按需加载，不打包               │</span>
<span style="color:#e85d04">│  HMR: 只更新变化的模块          │</span>
<span style="color:#e85d04">└─────────────────────────────────┘</span>

<span style="color:#65a30d">┌─────────────────────────────────┐</span>
<span style="color:#65a30d">│     生产构建 (build)            │</span>
<span style="color:#65a30d">│  Rollup 打包 + Tree Shaking     │</span>
<span style="color:#65a30d">│  代码分割 + 压缩                │</span>
<span style="color:#65a30d">│  输出 dist/ 静态资源            │</span>
<span style="color:#65a30d">└─────────────────────────────────┘</span>\`
<\/script>

<template>
  <div class="demo-card">
    <h3>Vite 核心：开发与构建双引擎</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'concept' }" @click="activeTab = 'concept'">核心概念</button>
      <button class="tab-btn" :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">对比 Webpack</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置示例</button>
    </div>

    <div v-if="activeTab === 'concept'">
      <div class="concept-grid">
        <div v-for="c in concepts" :key="c.label" class="concept-card">
          <span class="concept-icon">{{ c.icon }}</span>
          <strong>{{ c.label }}</strong>
          <p><small>{{ c.desc }}</small></p>
        </div>
      </div>
      <h4 style="margin-top:12px;">两大阶段</h4>
      <pre class="mini-code" v-html="lifecycleCode"></pre>
      <pre class="mini-code" style="margin-top:10px;"><span style="color:#7c7c99"># 快速创建项目</span>
npm create vite@latest my-app
<span style="color:#7c7c99"># 开发启动（无需打包）</span>
npm run dev
<span style="color:#7c7c99"># 生产构建</span>
npm run build</pre>
    </div>

    <div v-if="activeTab === 'compare'">
      <table>
        <thead><tr><th>维度</th><th>Vite</th><th>Webpack</th></tr></thead>
        <tbody>
          <tr v-for="r in compareRows" :key="r.aspect">
            <td><strong>{{ r.aspect }}</strong></td>
            <td><small>{{ r.vite }}</small></td>
            <td><small>{{ r.webpack }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>为什么 Vite 快：</strong>开发阶段利用浏览器原生 ESM，每个模块独立请求，无需打包成 bundle。Webpack 必须先打包再启动。</p>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <pre class="mini-code" v-html="configCode"></pre>
      <div class="tips-box">
        <p><strong>常用配置：</strong>plugins（框架插件）、server.proxy（代理）、resolve.alias（路径别名）、build.rollupOptions（分包）。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.concept-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.concept-card { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.concept-icon { font-size: 20px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
small { color: #8a6d42; }
</style>
`;export{n as default};
