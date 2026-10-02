const n=`<script setup lang="ts">
import { ref } from 'vue'

const features = [
  { feat: '运行环境', sc: '服务端', cc: '客户端' },
  { feat: 'JS Bundle', sc: '不打包进前端', cc: '打包进前端' },
  { feat: '可用 API', sc: 'fs、数据库、密钥', cc: 'useState、DOM、事件' },
  { feat: '交互事件', sc: '❌ 不可用', cc: '✅ onClick 等' },
  { feat: 'Hooks', sc: '❌ useState/useEffect', cc: '✅ 全部可用' },
  { feat: '数据获取', sc: '直接 async/await', cc: '需 useEffect 或 SWR' },
  { feat: '默认类型', sc: '✅ 默认就是', cc: '需 "use client" 声明' },
]

const scCode = \`<span style="color:#8a8a3a">// app/products/page.tsx — Server Component（默认）</span>
import { db } from '@/lib/db'

<span style="color:#7c7c99">// 直接 await 数据库查询，不会进入前端 bundle</span>
export default async function ProductsPage() {
  const products = await db.product.findMany()
  return (
    &lt;ul&gt;
      {products.map(p =&gt; (
        &lt;li key={p.id}&gt;{p.name} - ¥{p.price}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  )
}\`

const ccCode = \`<span style="color:#8a8a3a">// app/components/Counter.tsx — Client Component</span>
<span style="color:#e85d04">'use client'</span>

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;
      点击 {count} 次
    &lt;/button&gt;
  )
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>Server Components：服务端组件</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>Server vs Client 对比</h4>
        <table>
          <thead><tr><th>特性</th><th>Server Component</th><th>Client Component</th></tr></thead>
          <tbody>
            <tr v-for="f in features" :key="f.feat">
              <td><strong>{{ f.feat }}</strong></td>
              <td>{{ f.sc }}</td>
              <td>{{ f.cc }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="flex:1;">
        <h4>Server Component 示例</h4>
        <pre class="mini-code" v-html="scCode"></pre>
        <h4 style="margin-top:8px;">Client Component 示例</h4>
        <pre class="mini-code" v-html="ccCode"></pre>
      </div>
    </div>

    <div class="detail-box">
      <p><strong>组合规则：</strong>Server 可导入 Client，但 Client 不能导入 Server（只能作为 children 传入）。</p>
      <p><strong>边界：</strong>把 "use client" 放在组件树尽量靠下的位置，让更多组件留在服务端。</p>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
</style>
`;export{n as default};
