<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('config')

const contents = {
  config: `// vite.config.ts
export default defineConfig({
  // Vite 使用 esbuild 转译 TS（很快，但不做类型检查）
  esbuild: {
    loader: 'ts',       // 处理 .ts
    target: 'es2020',   // 目标 ES 版本
  },
})

// TypeScript 类型检查由 IDE 或单独运行 tsc --noEmit 完成
// Vite 不负责类型检查（保证开发服务器速度）`,
  vue: `<!-- Vue SFC 中使用 TypeScript -->
<script lang="ts" setup>
import { ref } from 'vue'

interface User {
  name: string
  age: number
}

const user = ref<User>({ name: '张三', age: 25 })
</script>

<!-- 如果需要类型推导，建议使用 <script setup lang="ts"> -->
<script setup lang="ts">
// 更好的类型推导和 IDE 支持
const count = ref(0) // 自动推导为 Ref<number>
</script>`,
  check: `// 类型检查方案
// 1. IDE 实时检查（推荐）
// VS Code + Volar 扩展

// 2. 构建时检查（慢但安全）
export default defineConfig({
  typescript: {
    enabled: true,  // 默认 false，启用后构建会做类型检查
  },
})

// 3. 单独运行（最灵活）
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "npm run type-check && vite build"
  }
}`,
}
</script>

<template>
  <div class="v13">
    <p class="intro">Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 <code>vue-tsc</code> 单独完成。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v13 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.intro code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
