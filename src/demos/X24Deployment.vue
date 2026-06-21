<script setup lang="ts">
import { ref } from 'vue'

const targets = [
  { name: 'Vercel', type: '全托管', desc: 'Next.js 官方平台，零配置，Edge/Serverless', best: '生产首选', color: '#000000' },
  { name: 'Node.js Server', type: '自托管', desc: 'next start，需 output: "standalone"', best: '自有服务器 / Docker', color: '#65a30d' },
  { name: 'Docker', type: '容器化', desc: '基于 standalone 产物构建镜像', best: 'K8s / 云原生', color: '#0891b2' },
  { name: 'Static Export', type: '纯静态', desc: 'output: "export"，生成纯 HTML', best: 'CDN / GitHub Pages', color: '#d97706' },
]

const deploySteps = [
  '本地构建：next build',
  '验证产物：.next/ 或 .output/',
  '选择部署目标：Vercel / Node / Docker / 静态',
  '配置环境变量（生产环境）',
  '设置 CDN + 域名 + HTTPS',
  '配置监控 / 日志 / 错误上报',
]

const codeExample = `<span style="color:#8a8a3a">// 1. Vercel — 推送即部署</span>
git push origin main  <span style="color:#7c7c99">// Vercel 自动构建部署</span>

<span style="color:#8a8a3a">// 2. Node.js 自托管</span>
<span style="color:#7c7c99">// next.config.js</span>
module.exports = { output: 'standalone' }

<span style="color:#7c7c99">// 构建 + 运行</span>
next build
node .next/standalone/server.js

<span style="color:#8a8a3a">// 3. Docker</span>
<span style="color:#7c7c99">// Dockerfile</span>
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci &amp;&amp; npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

<span style="color:#8a8a3a">// 4. 静态导出</span>
<span style="color:#7c7c99">// next.config.js</span>
module.exports = { output: 'export' }
<span style="color:#7c7c99">// 生成 out/ 目录，托管到任意静态服务器</span>`

const restrictions = [
  '静态导出不支持：动态路由参数、Server Actions、Middleware、Image Optimization',
  'standalone 不含 node_modules，需 COPY 静态资源',
  'Vercel Edge Functions 限制：无 Node API，冷启动快',
]
</script>

<template>
  <div class="demo-card">
    <h3>部署与 Vercel</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>部署目标对比</h4>
        <div v-for="t in targets" :key="t.name" class="target-card" :style="{ borderLeftColor: t.color }">
          <strong>{{ t.name }}</strong>
          <span class="tag" :style="{ background: t.color }">{{ t.type }}</span>
          <p><small>{{ t.desc }}</small></p>
          <p><small>适合：{{ t.best }}</small></p>
        </div>

        <h4 style="margin-top:12px;">部署步骤</h4>
        <ol>
          <li v-for="(s, i) in deploySteps" :key="i"><small>{{ s }}</small></li>
        </ol>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>

        <div class="detail-box">
          <p><strong>限制提醒：</strong></p>
          <ul>
            <li v-for="(r, i) in restrictions" :key="i"><small>{{ r }}</small></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.target-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
.tag { color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
small { color: #8a6d42; }
ol, ul { font-size: 12px; padding-left: 18px; }
</style>
