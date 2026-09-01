const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'intro' | 'config' | 'package' | 'demo'>('intro')

const libFormats = [
  { name: 'ES Module', ext: '.es.js', icon: '📦', desc: '现代 ESM 格式，支持 Tree Shaking，推荐用于现代打包工具' },
  { name: 'CommonJS', ext: '.cjs.js', icon: '📄', desc: 'Node.js 传统格式，用于 require() 引入' },
  { name: 'UMD', ext: '.umd.js', icon: '🌐', desc: '通用格式，可直接在浏览器通过 script 标签使用' },
  { name: 'IIFE', ext: '.iife.js', icon: '⚡', desc: '立即执行函数，适合直接在浏览器引用的单文件' },
]

const selectedFormat = ref('es')

const configCode = \`<span style="color:#7c7c99">// vite.config.ts - 库模式配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    <span style="color:#7c7c99">// 启用库模式</span>
    lib: {
      <span style="color:#7c7c99">// 入口文件</span>
      entry: resolve(__dirname, 'src/index.ts'),
      
      <span style="color:#7c7c99">// 库名（UMD/IIFE 时的全局变量名）</span>
      name: 'MyComponentLib',
      
      <span style="color:#7c7c99">// 输出格式，支持数组指定多种</span>
      formats: ['es', 'cjs', 'umd'],
      
      <span style="color:#7c7c99">// 输出文件名（可选）</span>
      fileName: (format) => \\\`my-lib.\\\${format}.js\\\`,
    },
    
    rollupOptions: {
      <span style="color:#7c7c99">// 外部化依赖，不打包进库中</span>
      external: ['vue', 'vue-router'],
      
      output: {
        <span style="color:#7c7c99">// UMD/IIFE 格式下的全局变量映射</span>
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
    
    <span style="color:#7c7c99">// 是否生成 source map</span>
    sourcemap: true,
    
    <span style="color:#7c7c99">// 清空输出目录</span>
    emptyOutDir: true,
  },
})\`

const packageJsonCode = \`<span style="color:#7c7c99">// package.json 配置</span>
{
  "name": "my-component-lib",
  "version": "1.0.0",
  "type": "module",
  
  <span style="color:#7c7c99">// 入口文件声明</span>
  "main": "./dist/my-lib.cjs.js",    <span style="color:#7c7c99">// CommonJS</span>
  "module": "./dist/my-lib.es.js",   <span style="color:#7c7c99">// ES Module</span>
  "unpkg": "./dist/my-lib.umd.js",   <span style="color:#7c7c99">// UMD for CDN</span>
  "jsdelivr": "./dist/my-lib.umd.js",
  
  <span style="color:#7c7c99">// TypeScript 类型声明</span>
  "types": "./dist/index.d.ts",
  
  <span style="color:#7c7c99">// 导出映射（推荐）</span>
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  
  <span style="color:#7c7c99">// 发布到 npm 的文件</span>
  "files": ["dist"],
  
  <span style="color:#7c7c99">// peerDependencies</span>
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}\`

const entryCode = \`<span style="color:#7c7c99">// src/index.ts - 库入口文件</span>
import type { App } from 'vue'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Input from './components/Input.vue'

<span style="color:#7c7c99">// 单独导出组件</span>
export { Button, Card, Input }

<span style="color:#7c7c99">// 导出类型</span>
export type { ButtonProps, CardProps } from './types'

<span style="color:#7c7c99">// 默认导出插件形式</span>
export default {
  install(app: App) {
    app.component('MyButton', Button)
    app.component('MyCard', Card)
    app.component('MyInput', Input)
  }
}\`

const buildDemo = ref({
  isBuilding: false,
  progress: 0,
  outputFiles: [] as { name: string; size: string; format: string }[],
  currentStep: '',
})

const buildSteps = [
  '🔍 解析入口文件...',
  '📦 打包组件源码...',
  '🎨 处理样式文件...',
  '🏷️  生成类型声明...',
  '📝 生成 ES Module 格式...',
  '📝 生成 CommonJS 格式...',
  '📝 生成 UMD 格式...',
  '✅ 构建完成！',
]

const outputFileTemplates = [
  { name: 'my-lib.es.js', size: '45.2 KB', format: 'es' },
  { name: 'my-lib.cjs.js', size: '47.8 KB', format: 'cjs' },
  { name: 'my-lib.umd.js', size: '52.1 KB', format: 'umd' },
  { name: 'style.css', size: '8.3 KB', format: 'css' },
  { name: 'index.d.ts', size: '3.1 KB', format: 'types' },
]

async function startBuild() {
  if (buildDemo.value.isBuilding) return
  
  buildDemo.value.isBuilding = true
  buildDemo.value.progress = 0
  buildDemo.value.outputFiles = []
  buildDemo.value.currentStep = buildSteps[0]
  
  for (let i = 0; i < buildSteps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
    buildDemo.value.currentStep = buildSteps[i]
    buildDemo.value.progress = ((i + 1) / buildSteps.length) * 100
    
    if (i >= 4 && i <= 6) {
      const fileIndex = i - 4
      if (outputFileTemplates[fileIndex]) {
        buildDemo.value.outputFiles.push(outputFileTemplates[fileIndex])
      }
    }
    
    if (i === 6) {
      buildDemo.value.outputFiles.push(outputFileTemplates[3])
      buildDemo.value.outputFiles.push(outputFileTemplates[4])
    }
  }
  
  setTimeout(() => {
    buildDemo.value.isBuilding = false
  }, 500)
}

function getFormatIcon(format: string) {
  const map: Record<string, string> = {
    es: '📦',
    cjs: '📄',
    umd: '🌐',
    css: '🎨',
    types: '🏷️',
  }
  return map[format] || '📁'
}

function getFormatLabel(format: string) {
  const map: Record<string, string> = {
    es: 'ES Module',
    cjs: 'CommonJS',
    umd: 'UMD',
    css: '样式',
    types: '类型声明',
  }
  return map[format] || format
}

const publishSteps = [
  { step: 1, title: '构建库', desc: 'npm run build', cmd: true },
  { step: 2, title: '登录 npm', desc: 'npm login', cmd: true },
  { step: 3, title: '检查包名', desc: '确保包名唯一且符合规范', cmd: false },
  { step: 4, title: '发布包', desc: 'npm publish', cmd: true },
  { step: 5, title: '验证安装', desc: 'npm install your-package', cmd: true },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>V20 · 库模式与组件打包发布</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">输出格式</button>
      <button class="tab-btn" :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">配置示例</button>
      <button class="tab-btn" :class="{ active: activeTab === 'package' }" @click="activeTab = 'package'">package.json</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">构建演示</button>
    </div>

    <div v-if="activeTab === 'intro'">
      <p class="intro-text">
        Vite 库模式用于打包组件库、工具函数等，支持多种输出格式，可发布到 npm 供其他项目使用。
      </p>
      
      <div class="format-grid">
        <div 
          v-for="(fmt, idx) in libFormats" 
          :key="fmt.name"
          class="format-card"
          :class="{ selected: selectedFormat === ['es', 'cjs', 'umd', 'iife'][idx] }"
          @click="selectedFormat = ['es', 'cjs', 'umd', 'iife'][idx]"
        >
          <span class="format-icon">{{ fmt.icon }}</span>
          <strong>{{ fmt.name }}</strong>
          <code class="format-ext">{{ fmt.ext }}</code>
          <p><small>{{ fmt.desc }}</small></p>
        </div>
      </div>
      
      <h4 style="margin-top:12px;">发布流程</h4>
      <div class="publish-steps">
        <div v-for="s in publishSteps" :key="s.step" class="publish-step">
          <span class="step-num">{{ s.step }}</span>
          <div class="step-content">
            <strong>{{ s.title }}</strong>
            <code v-if="s.cmd">{{ s.desc }}</code>
            <small v-else>{{ s.desc }}</small>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'config'">
      <pre class="mini-code" v-html="configCode"></pre>
      <div class="tips-box">
        <p><strong>关键点：</strong>使用 <code>build.lib</code> 启用库模式，<code>external</code> 外部化 vue 等依赖（避免重复打包），<code>globals</code> 为 UMD 格式指定全局变量名。</p>
      </div>
      
      <h4 style="margin-top:12px;">入口文件示例</h4>
      <pre class="mini-code" v-html="entryCode"></pre>
    </div>

    <div v-if="activeTab === 'package'">
      <pre class="mini-code" v-html="packageJsonCode"></pre>
      <div class="tips-box">
        <p><strong>推荐配置：</strong>使用 <code>exports</code> 字段声明导出，比 main/module 更灵活。<code>peerDependencies</code> 声明依赖的宿主库版本范围。</p>
      </div>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="build-demo">
        <div class="build-header">
          <span class="build-title">🏗️ 库模式构建模拟器</span>
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
              <span class="file-icon">{{ getFormatIcon(file.format) }}</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
              <span class="format-tag">{{ getFormatLabel(file.format) }}</span>
            </li>
          </ul>
        </div>
        
        <div v-if="buildDemo.outputFiles.length === 0 && !buildDemo.isBuilding" class="empty-state">
          点击「开始构建」模拟库模式打包过程
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>实际项目：</strong>运行 <code>vite build</code> 后，dist 目录会生成多种格式的产物、样式文件和类型声明（需配置 vite-plugin-dts）。</p>
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
.format-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.format-card { background: #fffbeb; padding: 12px; border-radius: 6px; border-left: 3px solid #fed7aa; cursor: pointer; transition: all 0.2s; }
.format-card:hover { background: #fef3c7; }
.format-card.selected { background: #ffedd5; border-left-color: #ea580c; }
.format-icon { font-size: 24px; }
.format-card strong { display: block; color: #92400e; margin-top: 4px; }
.format-ext { font-size: 11px; color: #c2410c; background: #fed7aa; padding: 2px 6px; border-radius: 3px; margin-top: 4px; display: inline-block; }
.format-card p { margin: 6px 0 0 0; }
.publish-steps { display: flex; flex-direction: column; gap: 8px; }
.publish-step { display: flex; gap: 10px; align-items: flex-start; background: #fffbeb; padding: 10px 12px; border-radius: 6px; }
.step-num { width: 24px; height: 24px; background: #ea580c; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.step-content { flex: 1; }
.step-content strong { color: #92400e; font-size: 13px; display: block; }
.step-content code { display: block; margin-top: 4px; font-size: 12px; color: #c2410c; background: #fed7aa; padding: 3px 8px; border-radius: 4px; }
.step-content small { color: #a16207; font-size: 12px; }
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
.output-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.output-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #fff; border-radius: 4px; font-size: 12px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.file-name { flex: 1; color: #78350f; font-family: monospace; }
.file-size { color: #a16207; }
.format-tag { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: #fef3c7; color: #92400e; }
.empty-state { text-align: center; padding: 30px; color: #a16207; font-size: 13px; }
h4 { color: #92400e; margin: 12px 0 8px 0; font-size: 15px; }
small { color: #8a6d42; }
</style>
`;export{n as default};
