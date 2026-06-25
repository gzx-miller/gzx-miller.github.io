<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'intro' | 'ts' | 'jsx' | 'demo'>('intro')

const features = [
  { icon: '⚡', title: '极速编译', desc: 'esbuild 用 Go 编写，比传统 JS 工具快 10-100 倍，毫秒级完成 TS/JSX 转换。' },
  { icon: '🎯', title: 'TypeScript 支持', desc: '直接编译 .ts/.tsx 文件，只做类型擦除，不做类型检查（类型检查交给 IDE 或 tsc）。' },
  { icon: '🧩', title: 'JSX 转换', desc: '支持 React JSX、Vue JSX 等多种 JSX 风格，可通过配置自定义 pragma 和 Fragment。' },
  { icon: '📦', title: '依赖预构建', desc: 'Vite 使用 esbuild 进行依赖预构建，将 CommonJS/UMD 转换为 ESM 模块。' },
]

const tsInput = ref(`// TypeScript 示例
interface User {
  id: number
  name: string
  email: string
}

function greet(user: User): string {
  const message: string = \`你好，\${user.name}！\`
  return message
}

const user: User = {
  id: 1,
  name: '小明',
  email: 'xiaoming@example.com'
}

console.log(greet(user))`)

const jsxInput = ref(`// Vue JSX 示例
import { defineComponent, ref } from 'vue'

interface CounterProps {
  initialValue?: number
  title?: string
}

export default defineComponent({
  name: 'Counter',
  props: {
    initialValue: { type: Number, default: 0 },
    title: { type: String, default: '计数器' }
  },
  setup(props: CounterProps) {
    const count = ref(props.initialValue || 0)
    const increment = () => count.value++
    const decrement = () => count.value--
    
    return () => (
      <div class="counter-card">
        <h3>{props.title}</h3>
        <div class="count-display">{count.value}</div>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    )
  }
})`)

const tsOutput = computed(() => {
  return tsInput.value
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    .replace(/:\s*\w+(\[\])?/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s*\/\/.*$/gm, (m) => m)
})

const jsxOutput = computed(() => {
  return jsxInput.value
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    .replace(/:\s*\w+(\[\])?/g, '')
    .replace(/<([a-zA-Z][^>]*)>/g, 'h("$1", ')
    .replace(/<\/([a-zA-Z][^>]*)>/g, ')')
    .replace(/\s+onClick=\{([^}]+)\}/g, ', { onClick: $1 }')
})

const buildStats = ref([
  { name: 'TypeScript 编译', esbuild: '12ms', webpack: '1,200ms', babel: '850ms' },
  { name: 'JSX 转换', esbuild: '8ms', webpack: '650ms', babel: '420ms' },
  { name: '依赖预构建', esbuild: '230ms', webpack: '3,500ms', babel: '2,800ms' },
])

const configCode = `<span style="color:#7c7c99">// vite.config.ts - esbuild 配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),  <span style="color:#7c7c99">// Vue JSX 支持</span>
  ],
  
  <span style="color:#7c7c99">// esbuild 全局配置</span>
  esbuild: {
    <span style="color:#7c7c99">// JSX 配置（React 风格）</span>
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    
    <span style="color:#7c7c99">// 目标环境</span>
    target: 'es2020',
    
    <span style="color:#7c7c99">// 构建时移除 console/debugger</span>
    pure: ['console.log', 'debugger'],
    
    <span style="color:#7c7c99">// 依赖预构建的 esbuild 选项</span>
  },
  
  optimizeDeps: {
    esbuildOptions: {
      <span style="color:#7c7c99">// 预构建专用配置</span>
      target: 'es2020',
    }
  }
})`

const tsConfigCode = `<span style="color:#7c7c99">// tsconfig.json</span>
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",  <span style="color:#7c7c99">// JSX 保留给 Vite/esbuild</span>
    "esModuleInterop": true,
    "skipLibCheck": true,
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}`

let transfromTimer: number | null = null
const isTransforming = ref(false)

function triggerTransform() {
  isTransforming.value = true
  if (transfromTimer) clearTimeout(transfromTimer)
  transfromTimer = window.setTimeout(() => {
    isTransforming.value = false
  }, 300)
}
</script>

<template>
  <div class="demo-card">
    <h3>V18 · esbuild 转换与 JSX/TS 处理</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">核心特性</button>
      <button class="tab-btn" :class="{ active: activeTab === 'ts' }" @click="activeTab = 'ts'">TypeScript</button>
      <button class="tab-btn" :class="{ active: activeTab === 'jsx' }" @click="activeTab = 'jsx'">JSX 支持</button>
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">实时转换</button>
    </div>

    <div v-if="activeTab === 'intro'">
      <div class="feature-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <span class="feature-icon">{{ f.icon }}</span>
          <strong>{{ f.title }}</strong>
          <p><small>{{ f.desc }}</small></p>
        </div>
      </div>
      
      <h4 style="margin-top:12px;">性能对比</h4>
      <table>
        <thead>
          <tr>
            <th>任务</th>
            <th>esbuild</th>
            <th>webpack</th>
            <th>babel</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in buildStats" :key="s.name">
            <td><strong>{{ s.name }}</strong></td>
            <td><span class="stat-fast">{{ s.esbuild }}</span></td>
            <td><small>{{ s.webpack }}</small></td>
            <td><small>{{ s.babel }}</small></td>
          </tr>
        </tbody>
      </table>
      
      <div class="tips-box">
        <p><strong>注意：</strong>esbuild 只做语法转换，不做类型检查。类型检查请使用 <code>tsc --noEmit</code> 或 IDE 的 TypeScript 支持。</p>
      </div>
    </div>

    <div v-if="activeTab === 'ts'">
      <pre class="mini-code" v-html="configCode"></pre>
      <h4 style="margin-top:12px;">tsconfig 配置</h4>
      <pre class="mini-code" v-html="tsConfigCode"></pre>
      <div class="tips-box">
        <p><strong>类型检查：</strong>Vite 开发时不做类型检查以保证速度。建议在构建前或 CI 中运行 <code>vue-tsc --noEmit</code> 进行类型检查。</p>
      </div>
    </div>

    <div v-if="activeTab === 'jsx'">
      <div class="code-editor">
        <div class="editor-header">
          <span>Vue JSX 示例</span>
          <span class="badge">.tsx</span>
        </div>
        <pre class="mini-code"><code>{{ jsxInput }}</code></pre>
      </div>
      <div class="tips-box">
        <p><strong>Vue JSX 插件：</strong>使用 <code>@vitejs/plugin-vue-jsx</code> 启用 Vue JSX 支持，支持 v-model、v-on 等指令的 JSX 写法。</p>
      </div>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="transform-demo">
        <div class="editor-pane">
          <div class="editor-header">
            <span>TypeScript 输入</span>
            <button class="transform-btn" @click="triggerTransform" :disabled="isTransforming">
              {{ isTransforming ? '转换中...' : '⚡ 转换' }}
            </button>
          </div>
          <textarea 
            v-model="tsInput" 
            class="code-textarea"
            @input="triggerTransform"
            spellcheck="false"
          ></textarea>
        </div>
        
        <div class="editor-pane">
          <div class="editor-header">
            <span>JavaScript 输出</span>
            <span class="badge output-badge">{{ isTransforming ? '转换中' : '已转换' }}</span>
          </div>
          <pre class="mini-code output-code"><code>{{ tsOutput }}</code></pre>
        </div>
      </div>
      
      <div class="tips-box">
        <p><strong>体验：</strong>在左侧编辑 TypeScript 代码，右侧实时显示转换后的 JavaScript。实际项目中 esbuild 转换发生在请求时，速度极快。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.tab-btn { padding: 5px 12px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; color: #5c4033; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.feature-card { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.feature-icon { font-size: 20px; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.6; white-space: pre-wrap; }
.tips-box { background: #fef3c7; padding: 10px; border-radius: 6px; border-left: 3px solid #d97706; margin-top: 10px; }
.tips-box p { margin: 0; font-size: 13px; color: #78350f; }
.tips-box code { background: #fde68a; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
.stat-fast { color: #16a34a; font-weight: 600; }
small { color: #8a6d42; }
.code-editor { margin-bottom: 10px; }
.editor-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fed7aa; border-radius: 6px 6px 0 0; font-size: 13px; font-weight: 600; color: #92400e; }
.badge { font-size: 11px; padding: 2px 8px; background: #ea580c; color: #fff; border-radius: 10px; font-weight: 500; }
.output-badge { background: #16a34a; }
.transform-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.editor-pane { display: flex; flex-direction: column; }
.code-textarea { flex: 1; min-height: 200px; padding: 12px; font-family: monospace; font-size: 12px; border: none; border-radius: 0 0 6px 6px; background: #1e1e2e; color: #e0e0e0; resize: vertical; line-height: 1.6; }
.code-textarea:focus { outline: none; }
.output-code { border-radius: 0 0 6px 6px; margin: 0; min-height: 200px; }
.transform-btn { padding: 4px 10px; background: #ea580c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
.transform-btn:disabled { background: #fbbf24; cursor: not-allowed; }
</style>
