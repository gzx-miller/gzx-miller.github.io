<script setup lang="ts">
import { ref } from 'vue'

const renderTypes = [
  { type: '静态渲染', timing: '构建时', when: '默认行为', example: '博客文章、产品页', color: '#65a30d' },
  { type: '动态渲染', timing: '请求时', when: '使用了动态函数', example: '用户 dashboard、搜索', color: '#e85d04' },
]

const dynamicSignals = [
  { signal: 'cookies()', desc: '读取 Cookie', force: '动态' },
  { signal: 'headers()', desc: '读取请求头', force: '动态' },
  { signal: 'searchParams', desc: 'URL 查询参数', force: '动态' },
  { signal: "fetch(..., { cache: 'no-store' })", desc: '禁用缓存', force: '动态' },
  { signal: "fetch(..., { next: { revalidate: 0 } })", desc: '零秒重新验证', force: '动态' },
  { signal: 'noStore()', desc: '明确 opt-out 缓存', force: '动态' },
]

const staticSignals = [
  { signal: 'fetch() 默认', desc: 'force-cache（构建时缓存）', force: '静态' },
  { signal: "fetch(..., { next: { revalidate: 60 } })", desc: 'ISR，60 秒重新验证', force: '静态' },
  { signal: 'generateStaticParams()', desc: '预生成动态路由', force: '静态' },
]

const codeExample = `<span style="color:#8a8a3a">// 静态渲染（默认）— 构建时生成 HTML</span>
export default async function Page() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return &lt;PostList posts={posts} /&gt;
}

<span style="color:#8a8a3a">// 动态渲染 — 每次请求重新执行</span>
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const token = cookies().get('token')?.value  <span style="color:#7c7c99">// 触发动态</span>
  const user = await getUser(token)
  return &lt;Profile user={user} /&gt;
}`
</script>

<template>
  <div class="demo-card">
    <h3>静态与动态渲染</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>两种渲染模式</h4>
        <div v-for="r in renderTypes" :key="r.type" class="render-card" :style="{ borderLeftColor: r.color }">
          <strong>{{ r.type }}</strong>
          <span class="tag" :style="{ background: r.color }">{{ r.timing }}</span>
          <p><small>触发：{{ r.when }}</small></p>
          <p><small>示例：{{ r.example }}</small></p>
        </div>

        <h4 style="margin-top:12px;">强制动态的信号</h4>
        <ul>
          <li v-for="s in dynamicSignals" :key="s.signal">
            <code>{{ s.signal }}</code> — {{ s.desc }}
          </li>
        </ul>

        <h4>保持静态的信号</h4>
        <ul>
          <li v-for="s in staticSignals" :key="s.signal">
            <code>{{ s.signal }}</code> — {{ s.desc }}
          </li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码对比</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>判断规则：</strong>只要组件树中使用了任何动态函数，整个路由就变成动态渲染。</p>
          <p><strong>Next.js 14+：</strong>默认尽量静态，按需动态（Partial Prerendering 实验中）。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.render-card { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 8px; }
.tag { color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
