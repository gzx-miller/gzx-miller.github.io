const n=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('import')

const contents = {
  import: \`// 显式导入（推荐）
import logo from './assets/logo.png'
// → 开发阶段：/src/assets/logo.png
// → 构建后：/assets/logo.hash.png（自动哈希）

// 图片路径会自动处理
const img = new URL('./assets/bg.png', import.meta.url).href
// → 构建后同样会哈希化\`,
  public: \`// public 目录下的文件（不经过 Vite 处理）
// 直接复制到构建产物的根目录

// 引用方式：绝对路径
<img src="/favicon.svg" />
// → 开发时从 /public/favicon.svg 提供
// → 构建时原样复制到 dist/favicon.svg

// 适合：robots.txt、favicon、不常变更的静态资源\`,
  inline: \`// 小资源自动内联（base64）
// 默认阈值：4KB（可配置）

export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4KB，单位 byte
  },
})

// 小于 4KB 的图片会被内联为 base64
// 减少 HTTP 请求，但增加 bundle 体积\`,
}
<\/script>

<template>
  <div class="v06">
    <p class="intro">Vite 对静态资源有三种处理方式：导入哈希化、public 原样复制、小资源内联。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v06 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #f59e0b; color: #fff; border-color: #f59e0b; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
`;export{n as default};
