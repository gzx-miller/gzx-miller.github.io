const e=`<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref<'overview' | 'presets' | 'deployment'>('overview')

const nitroFeatures = [
  { feature: '自动代码分割', desc: '每个 API 路由和中间件独立打包，按需加载' },
  { feature: '多目标部署', desc: '同一代码可部署到 Node.js、Cloudflare、Vercel、Deno 等' },
  { feature: '文件路由 API', desc: 'server/api/ 和 server/routes/ 自动注册为 API 端点' },
  { feature: '服务端中间件', desc: 'server/middleware/ 自动注册，每个请求都经过' },
  { feature: '静态资源服务', desc: 'public/ 目录自动作为静态资源，支持缓存策略' },
  { feature: '混合渲染', desc: '支持 SSR、SSG、SWR、ISR 等多种渲染模式混合' },
  { feature: '自动导入', desc: 'server/utils/ 下的函数自动导入，无需手动 import' },
  { feature: '存储层抽象', desc: '统一存储 API，支持本地、Redis、Cloudflare KV 等' },
]

const presets = [
  { preset: 'node-server', target: 'Node.js 服务器', cmd: 'npx nitro build --preset=node-server' },
  { preset: 'cloudflare-pages', target: 'Cloudflare Pages', cmd: 'npx nitro build --preset=cloudflare-pages' },
  { preset: 'vercel', target: 'Vercel', cmd: 'npx nitro build --preset=vercel' },
  { preset: 'netlify', target: 'Netlify', cmd: 'npx nitro build --preset=netlify' },
  { preset: 'deno-server', target: 'Deno', cmd: 'npx nitro build --preset=deno-server' },
  { preset: 'static', target: '纯静态站点', cmd: 'npx nuxi generate' },
]

const routeRules = \`// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/'],  // 预渲染路由
    },
  },
  routeRules: {
    '/': { prerender: true },           // SSG
    '/api/**': { cors: true },          // CORS
    '/blog/**': { swr: 3600 },          // ISR: 1小时缓存
    '/admin/**': { ssr: false },        // 仅客户端渲染
    '/static/**': { headers: { 'Cache-Control': 'max-age=31536000' } },
  },
})\`
<\/script>

<template>
  <div class="demo-card">
    <h3>Nitro 服务端引擎</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'overview' }" @click="activeSection='overview'">核心特性</button>
      <button :class="{ active: activeSection === 'presets' }" @click="activeSection='presets'">部署目标</button>
      <button :class="{ active: activeSection === 'deployment' }" @click="activeSection='deployment'">混合渲染</button>
    </div>

    <div v-if="activeSection === 'overview'">
      <table style="width:100%;">
        <thead><tr><th>特性</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="item in nitroFeatures" :key="item.feature">
            <td><strong>{{ item.feature }}</strong></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeSection === 'presets'">
      <table style="width:100%;">
        <thead><tr><th>Preset</th><th>目标</th><th>构建命令</th></tr></thead>
        <tbody>
          <tr v-for="item in presets" :key="item.preset">
            <td><code>{{ item.preset }}</code></td>
            <td>{{ item.target }}</td>
            <td><code>{{ item.cmd }}</code></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeSection === 'deployment'">
      <pre class="code-block">{{ routeRules }}</pre>
      <div style="margin-top:8px;font-size:13px;">
        <strong>渲染模式：</strong>
        <ul>
          <li><code>prerender: true</code> → SSG：构建时生成静态 HTML</li>
          <li><code>swr: 秒数</code> → ISR：缓存过期后重新生成</li>
          <li><code>ssr: false</code> → SPA：仅客户端渲染</li>
          <li>默认 → SSR：每次请求服务端渲染</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
