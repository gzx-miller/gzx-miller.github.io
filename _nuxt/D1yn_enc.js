const n=`<script setup lang="ts">
import { ref } from 'vue'

const navApis = [
  { api: '<Link href="/about">', desc: '客户端导航，预取目标路由', client: true },
  { api: "useRouter().push('/x')", desc: '编程式跳转', client: true },
  { api: "useRouter().replace('/x')", desc: '替换当前历史', client: true },
  { api: "useRouter().back()", desc: '后退', client: true },
  { api: "useRouter().refresh()", desc: '刷新当前路由数据', client: true },
  { api: "useRouter().prefetch('/x')", desc: '手动预取', client: true },
  { api: 'redirect("/x")', desc: '服务端重定向', client: false },
  { api: 'usePathname()', desc: '获取当前路径', client: true },
  { api: 'useSearchParams()', desc: '获取查询参数', client: true },
]

const codeExample = \`<span style="color:#8a8a3a">// next/link — 客户端导航</span>
import Link from 'next/link'

&lt;Link href="/about" prefetch&gt;关于&lt;/Link&gt;
&lt;Link href="/blog/1" prefetch={false}&gt;条件预取&lt;/Link&gt;

<span style="color:#8a8a3a">// useRouter — 编程式导航（Client Component）</span>
<span style="color:#e85d04">'use client'</span>
import { useRouter } from 'next/navigation'

export default function Nav() {
  const router = useRouter()
  return &lt;button onClick={() =&gt; router.push('/dashboard')}&gt;
    进入后台
  &lt;/button&gt;
}

<span style="color:#8a8a3a">// redirect — 服务端重定向</span>
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  if (!user) redirect('/login')  <span style="color:#7c7c99">// 服务端 307</span>
  return &lt;Dashboard /&gt;
}

<span style="color:#8a8a3a">// 获取路由信息</span>
import { usePathname, useSearchParams } from 'next/navigation'
const pathname = usePathname()      <span style="color:#7c7c99">// "/about"</span>
const search = useSearchParams()    <span style="color:#7c7c99">// URLSearchParams</span>\`

const prefetchBehavior = [
  'Link 默认 prefetch：预取 RSC payload',
  '静态路由：链接进入视口即预取',
  '动态路由：仅在点击时预取',
  'prefetch={false}：禁用自动预取',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>next/link 与导航</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>导航 API 一览</h4>
        <table>
          <thead><tr><th>API</th><th>说明</th><th>端</th></tr></thead>
          <tbody>
            <tr v-for="a in navApis" :key="a.api">
              <td><code>{{ a.api }}</code></td>
              <td><small>{{ a.desc }}</small></td>
              <td><span :class="a.client ? 'tag client' : 'tag server'">{{ a.client ? 'Client' : 'Server' }}</span></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">预取行为</h4>
        <ul>
          <li v-for="(p, i) in prefetchBehavior" :key="i"><small>{{ p }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>关键：</strong>App Router 的导航 API 从 next/navigation 导入（非 next/router）。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
.tag { padding: 1px 6px; border-radius: 3px; font-size: 10px; color: #fff; }
.tag.client { background: #0891b2; }
.tag.server { background: #e85d04; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{n as default};
