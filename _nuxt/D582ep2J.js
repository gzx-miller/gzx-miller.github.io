const e=`<script setup lang="ts">
import { ref } from 'vue'

const patterns = [
  { name: '交互组件', trigger: 'onClick / onChange 等事件', action: '标记 "use client"' },
  { name: '状态组件', trigger: 'useState / useReducer', action: '标记 "use client"' },
  { name: '生命周期', trigger: 'useEffect / useLayoutEffect', action: '标记 "use client"' },
  { name: '浏览器 API', trigger: 'window / document / localStorage', action: '标记 "use client"' },
  { name: '数据展示', trigger: '纯渲染 props 数据', action: '保持 Server Component' },
  { name: '数据获取', trigger: 'async 组件 + await', action: '保持 Server Component' },
]

const codeExample = \`<span style="color:#8a8a3a">// app/page.tsx — Server Component</span>
import SearchBox from './SearchBox'  <span style="color:#7c7c99">// Client</span>

export default async function Page() {
  const data = await fetch('...').then(r =&gt; r.json())
  return (
    &lt;&gt;
      &lt;h1&gt;{data.title}&lt;/h1&gt;       <span style="color:#7c7c99">{/* Server 渲染 */}</span>
      &lt;SearchBox initial={data.q} /&gt; <span style="color:#7c7c99">{/* Client 交互 */}</span>
    &lt;/&gt;
  )
}

<span style="color:#8a8a3a">// app/SearchBox.tsx — Client Component</span>
<span style="color:#e85d04">'use client'</span>
import { useState } from 'react'

export default function SearchBox({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial)
  return &lt;input value={q} onChange={e =&gt; setQ(e.target.value)} /&gt;
}\`

const hooksClient = ['useState', 'useReducer', 'useEffect', 'useRef', 'useLayoutEffect', 'useCallback', 'useMemo', 'useContext', 'useImperativeHandle', 'useTransition', 'useDeferredValue', 'useSyncExternalStore']
<\/script>

<template>
  <div class="demo-card">
    <h3>Client Components：客户端组件</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>何时使用 "use client"</h4>
        <table>
          <thead><tr><th>场景</th><th>触发条件</th><th>处理方式</th></tr></thead>
          <tbody>
            <tr v-for="p in patterns" :key="p.name">
              <td><strong>{{ p.name }}</strong></td>
              <td>{{ p.trigger }}</td>
              <td><code>{{ p.action }}</code></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">仅客户端可用的 Hooks</h4>
        <div class="hooks-box">
          <span v-for="h in hooksClient" :key="h" class="hook-tag">{{ h }}</span>
        </div>
      </div>

      <div style="flex:1;">
        <h4>Server 与 Client 组合</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>数据流向：</strong>Server 获取数据 → 作为 props 传给 Client → Client 接管交互</p>
          <p><strong>注意：</strong>"use client" 标记会向下传递，导入的子组件也变成 Client</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.hooks-box { display: flex; flex-wrap: wrap; gap: 4px; }
.hook-tag { background: #fff3e0; color: #e85d04; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-family: monospace; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
