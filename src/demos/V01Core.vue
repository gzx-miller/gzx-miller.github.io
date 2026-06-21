<script setup lang="ts">
import { ref } from 'vue'

const active = ref('concept')

const concepts = [
  { label: '原生 ESM', desc: '开发阶段直接用浏览器加载 ES 模块，无需打包，启动极快。' },
  { label: '基于 Rollup', desc: '生产构建使用 Rollup，输出高度优化的静态资源。' },
  { label: 'HMR', desc: '基于 ESM 的热更新，只更新修改的模块，速度不受项目规模影响。' },
  { label: '插件系统', desc: '兼容 Rollup 插件接口，同时提供 Vite 特有的钩子。' },
]
</script>

<template>
  <div class="v01">
    <p class="intro">Vite 的核心优势：闪电般的冷启动 + 精准的热更新。</p>
    <div class="tabs">
      <button
        v-for="c in concepts"
        :key="c.label"
        :class="{ active: active === c.label }"
        @click="active = c.label"
      >{{ c.label }}</button>
    </div>
    <div class="panel">
      <p v-for="c in concepts" v-show="active === c.label" :key="c.label">{{ c.desc }}</p>
    </div>
    <pre class="code-block"><code># 快速创建项目
npm create vite@latest my-app
# 开发启动（无需打包）
npm run dev
# 生产构建
npm run build</code></pre>
  </div>
</template>

<style scoped>
.v01 { display: flex; flex-direction: column; gap: 12px; }
.intro { color: #b45309; font-weight: 500; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tabs button { padding: 4px 12px; border: 1px solid #e5c07b; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #b45309; color: #fff; border-color: #b45309; }
.panel { min-height: 48px; padding: 10px; background: #fffbeb; border-radius: 6px; font-size: 13px; color: #92400e; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; }
</style>
