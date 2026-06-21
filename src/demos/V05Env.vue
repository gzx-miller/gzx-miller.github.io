<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('files')

const contents = {
  files: `# 环境变量文件（按优先级从低到高）
.env                # 所有环境加载
.env.development    # npm run dev 时加载
.env.production     # npm run build 时加载
.env.local          # 本地覆盖，git 忽略`,
  usage: `// 在 vite.config.ts 中读取
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    define: {
      __API__: JSON.stringify(env.VITE_API_URL),
    },
  }
})

// 在代码中读取（仅 VITE_ 前缀暴露到客户端）
const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE`,
  prefix: `// .env
VITE_API_URL=https://api.example.com   ✅ 暴露到客户端
DB_PASSWORD=secret                      ❌ 不暴露（服务端专用）

// 服务端代码中可读取所有变量
// 客户端代码中只能读取 VITE_ 前缀的变量

// TypeScript 类型提示（vite-env.d.ts）
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 更多环境变量...
}`,
}
</script>

<template>
  <div class="v05">
    <p class="intro">Vite 使用 <code>dotenv</code> 加载环境变量，<code>VITE_</code> 前缀的变量会暴露到客户端。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v05 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.intro code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #8b5cf6; color: #fff; border-color: #8b5cf6; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
