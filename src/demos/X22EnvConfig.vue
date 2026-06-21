<script setup lang="ts">
import { ref } from 'vue'

const envTypes = [
  { prefix: 'NEXT_PUBLIC_', scope: '客户端 + 服务端', example: 'NEXT_PUBLIC_API_URL', exposed: '✅ 打包进前端', color: '#65a30d' },
  { prefix: '（无前缀）', scope: '仅服务端', example: 'DATABASE_URL', exposed: '❌ 不会泄露', color: '#e85d04' },
]

const configOptions = [
  { option: 'reactStrictMode', desc: '开启 React 严格模式', default: 'true' },
  { option: 'images.remotePatterns', desc: '远程图片域名白名单', default: '[]' },
  { option: 'experimental.serverActions', desc: '启用 Server Actions', default: '已默认启用' },
  { option: 'rewrites', desc: 'URL 重写（代理）', default: '—' },
  { option: 'redirects', desc: 'URL 重定向', default: '—' },
  { option: 'headers', desc: '自定义响应头', default: '—' },
  { option: 'output: "export"', desc: '纯静态导出', default: '—' },
  { option: 'output: "standalone"', desc: '独立部署包', default: '—' },
]

const codeExample = `<span style="color:#8a8a3a">// .env 文件</span>
NEXT_PUBLIC_API_URL=https://api.example.com  <span style="color:#7c7c99">// 客户端可见</span>
DATABASE_URL=postgresql://...               <span style="color:#7c7c99">// 仅服务端</span>
SECRET_KEY=xxx                              <span style="color:#7c7c99">// 仅服务端</span>

<span style="color:#8a8a3a">// 文件优先级（高→低）</span>
.env.local        <span style="color:#7c7c99">// 本地覆盖（gitignore）</span>
.env.[development|production]
.env

<span style="color:#8a8a3a">// next.config.js</span>
<span style="color:#e85d04">/** @type {import('next').NextConfig} */</span>
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }]
  },
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: 'https://backend.example.com/:path*' }
    ]
  },
  output: 'standalone',
}
module.exports = nextConfig

<span style="color:#8a8a3a">// 读取运行时配置（服务端）</span>
import { db } from '@/lib/db'  <span style="color:#7c7c99">// process.env.DATABASE_URL</span>`
</script>

<template>
  <div class="demo-card">
    <h3>环境变量与 next.config</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>环境变量前缀规则</h4>
        <div v-for="e in envTypes" :key="e.prefix" class="env-card" :style="{ borderLeftColor: e.color }">
          <code>{{ e.prefix }}</code>
          <span class="tag" :style="{ background: e.color }">{{ e.exposed }}</span>
          <p><small>范围：{{ e.scope }}</small></p>
          <p><small>示例：<code>{{ e.example }}</code></small></p>
        </div>

        <h4 style="margin-top:12px;">常用配置项</h4>
        <table>
          <thead><tr><th>选项</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="c in configOptions" :key="c.option">
              <td><code>{{ c.option }}</code></td>
              <td><small>{{ c.desc }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>安全：</strong>密钥绝不加 NEXT_PUBLIC_ 前缀，否则会打包进前端 bundle。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.env-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
.tag { color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
small { color: #8a6d42; }
</style>
