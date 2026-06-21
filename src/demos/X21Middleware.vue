<script setup lang="ts">
import { ref } from 'vue'

const features = [
  { feat: '执行时机', desc: '每个请求、缓存前，Edge Runtime 运行' },
  { feat: '位置', desc: '项目根或 src/ 下的 middleware.ts' },
  { feat: '能力', desc: '重写、重定向、改请求头、改响应头' },
  { feat: '限制', desc: '不能访问 Node API，依赖需兼容 Edge' },
]

const useCases = [
  { case: '认证鉴权', example: '检查 token，未登录跳 /login' },
  { case: 'A/B 测试', example: '按 Cookie 分流到不同版本' },
  { case: 'i18n', example: '按 Accept-Language 重定向到对应语言' },
  { case: '灰度发布', example: '按用户标识切换新旧版本' },
  { case: '地理重定向', example: '按地区跳转不同子站' },
]

const codeExample = `<span style="color:#8a8a3a">// middleware.ts — 项目根或 src/ 下</span>
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  <span style="color:#7c7c99">// 未登录 → 重定向到登录页</span>
  if (!token &amp;&amp; request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  <span style="color:#7c7c99">// 注入请求头，供下游读取</span>
  const response = NextResponse.next()
  response.headers.set('x-user-id', token || '')
  return response
}

<span style="color:#8a8a3a">// 限定匹配路径（性能优化）</span>
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    <span style="color:#7c7c99">// 排除静态资源</span>
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}`
</script>

<template>
  <div class="demo-card">
    <h3>Middleware 中间件</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>核心特性</h4>
        <div v-for="f in features" :key="f.feat" class="feat-card">
          <strong>{{ f.feat }}</strong>
          <p><small>{{ f.desc }}</small></p>
        </div>

        <h4 style="margin-top:12px;">典型场景</h4>
        <table>
          <thead><tr><th>场景</th><th>示例</th></tr></thead>
          <tbody>
            <tr v-for="u in useCases" :key="u.case">
              <td><strong>{{ u.case }}</strong></td>
              <td><small>{{ u.example }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>性能：</strong>用 matcher 限定路径，避免对所有请求执行。</p>
          <p><strong>注意：</strong>middleware 在 Edge Runtime，慎用重依赖。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.feat-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
small { color: #8a6d42; }
</style>
