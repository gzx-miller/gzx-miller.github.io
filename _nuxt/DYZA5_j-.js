const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref<'ssg' | 'isr' | 'hybrid'>('ssg')

const ssgSteps = [
  { step: 1, action: 'nuxt generate 启动构建' },
  { step: 2, action: 'Nitro 启动内部服务器执行 SSR' },
  { step: 3, action: '遍历预渲染路由，生成 HTML 文件' },
  { step: 4, action: '收集所有 JS/CSS/图片等静态资源' },
  { step: 5, action: '输出到 .output/public/ 目录' },
  { step: 6, action: '部署到任意静态托管服务' },
]

const ssgConfig = \`// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,     // 自动爬取页面内的链接
      routes: ['/', '/about', '/products'],
      failOnError: false,   // 预渲染失败不中断
    },
  },
})\`

const isrConfig = \`// nuxt.config.ts - ISR (增量静态再生)
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { swr: 3600 },     // 1小时后重新验证
    '/products/**': { swr: 86400 }, // 1天后重新验证
    '/': { prerender: true },       // 构建时预渲染
  },
})\`

const hybridConfig = \`// nuxt.config.ts - 混合渲染
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },              // SSG
    '/blog/**': { swr: 3600 },             // ISR
    '/admin/**': { ssr: false },           // SPA
    '/api/**': { cors: true },             // API CORS
    '/dashboard': { ssr: true },           // SSR
  },
})\`

const deploymentTargets = [
  { target: 'GitHub Pages', cmd: 'npx nuxi generate', note: '纯静态，部署 .output/public' },
  { target: 'Vercel', cmd: '自动检测', note: '零配置部署' },
  { target: 'Cloudflare Pages', cmd: 'npx nuxi build', note: 'preset: cloudflare-pages' },
  { target: 'Node.js 服务器', cmd: 'npx nuxi build', note: 'preset: node-server' },
  { target: 'Deno Deploy', cmd: 'npx nuxi build', note: 'preset: deno-server' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>静态站点生成与混合渲染</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'ssg' }" @click="activeSection='ssg'">SSG</button>
      <button :class="{ active: activeSection === 'isr' }" @click="activeSection='isr'">ISR</button>
      <button :class="{ active: activeSection === 'hybrid' }" @click="activeSection='hybrid'">混合渲染</button>
    </div>

    <div v-if="activeSection === 'ssg'">
      <div style="display:flex;gap:16px;">
        <div style="flex:1;">
          <h4>SSG 构建流程</h4>
          <div v-for="item in ssgSteps" :key="item.step" class="step-row">
            <span class="step-num">{{ item.step }}</span> {{ item.action }}
          </div>
          <h4 style="margin-top:12px;">部署目标</h4>
          <table style="width:100%;">
            <thead><tr><th>目标</th><th>命令</th><th>说明</th></tr></thead>
            <tbody>
              <tr v-for="item in deploymentTargets" :key="item.target">
                <td>{{ item.target }}</td><td><code>{{ item.cmd }}</code></td><td>{{ item.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="flex:1;">
          <pre class="code-block">{{ ssgConfig }}</pre>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'isr'">
      <div style="display:flex;gap:16px;">
        <div style="flex:1;">
          <pre class="code-block">{{ isrConfig }}</pre>
        </div>
        <div style="flex:1;">
          <div class="desc-box">
            <h4>ISR 原理</h4>
            <ol style="font-size:13px;">
              <li>首次请求时服务端渲染并缓存</li>
              <li>后续请求直接返回缓存（快速响应）</li>
              <li>超过 swr 时间后，后台重新生成</li>
              <li>新请求获得更新后的页面</li>
            </ol>
            <p style="font-size:13px;margin-top:8px;">💡 ISR 需要服务器运行环境（非纯静态托管）</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'hybrid'">
      <pre class="code-block">{{ hybridConfig }}</pre>
      <div style="margin-top:8px;font-size:13px;">
        <strong>渲染模式对照：</strong>
        <ul>
          <li><code>prerender: true</code> — SSG：构建时生成，零服务器成本</li>
          <li><code>swr: 秒</code> — ISR：缓存 + 定时刷新，适合内容站</li>
          <li><code>ssr: false</code> — SPA：纯客户端，适合后台管理</li>
          <li>默认 — SSR：每次请求渲染，最灵活</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.step-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; }
.step-num { width: 22px; height: 22px; border-radius: 50%; background: #e85d04; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
.desc-box { background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{n as default};
