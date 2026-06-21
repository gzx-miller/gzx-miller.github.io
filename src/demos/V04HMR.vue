<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('hmr')

const contents = {
  hmr: `// Vite HMR API（手动处理边界情况）
if (import.meta.hot) {
  // 模块热更新
  import.meta.hot.accept((mod) => {
    console.log('模块更新:', mod)
  })

  // 模块销毁时清理
  import.meta.hot.dispose(() => {
    console.log('模块即将被替换')
  })
}`,
  vue: `<!-- Vue SFC 的 HMR 是开箱即用的 -->
<!-- @vitejs/plugin-vue 会自动处理： -->
<!-- - template 更新 → 不丢失状态 -->
<!-- - script 更新 → 保留组件状态 -->
<!-- - style 更新 → 样式热替换 -->

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0) // HMR 时这个值会被保留
</script>`,
  react: `// React Fast Refresh（@vitejs/plugin-react）
// 自动支持：
// - 函数组件更新 → 保留 React 状态
// - Hook 顺序不变 → 状态不丢失
// - 导出组件 → 精准更新

// 需要在组件顶部添加（某些版本需要）：
// @refresh reset  // 强制重置状态`,
}
</script>

<template>
  <div class="v04">
    <p class="intro">Vite 的 HMR 基于原生 ESM，只更新变化的模块，速度极快。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v04 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #10b981; color: #fff; border-color: #10b981; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
