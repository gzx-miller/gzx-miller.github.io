<script setup lang="ts">
import { ref } from 'vue'

const specialFiles = [
  { file: 'loading.tsx', scope: '路由级', desc: '加载 UI，自动包裹 Suspense', color: '#d97706' },
  { file: 'error.tsx', scope: '路由级', desc: '错误 UI，必须 Client Component', color: '#e85d04' },
  { file: 'not-found.tsx', scope: '路由级', desc: '404 UI，匹配不到时显示', color: '#ca8a04' },
  { file: 'global-error.tsx', scope: '全局', desc: '根 layout 出错时的兜底', color: '#dc2626' },
  { file: 'default.tsx', scope: '插槽', desc: 'Parallel Route 未匹配的默认', color: '#0891b2' },
  { file: 'template.tsx', scope: '路由级', desc: '类似 layout 但每次重新挂载', color: '#65a30d' },
]

const codeExample = `<span style="color:#8a8a3a">// app/dashboard/loading.tsx</span>
export default function Loading() {
  return (
    &lt;div className="skeleton"&gt;
      &lt;div className="pulse" /&gt;
      &lt;div className="pulse" /&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// app/dashboard/error.tsx — 必须是 Client Component</span>
<span style="color:#e85d04">'use client'</span>

export default function Error({
  error,    <span style="color:#7c7c99">// Error 实例</span>
  reset,    <span style="color:#7c7c99">// 重置函数，重试渲染</span>
}: {
  error: Error & { digest?: string }
  reset: () =&gt; void
}) {
  return (
    &lt;div&gt;
      &lt;h2&gt;出错了：{error.message}&lt;/h2&gt;
      &lt;button onClick={reset}&gt;重试&lt;/button&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// app/not-found.tsx</span>
export default function NotFound() {
  return &lt;h1&gt;404 - 页面不存在&lt;/h1&gt;
}`

const rules = [
  'loading.tsx 自动创建 Suspense 边界，包裹同目录 page',
  'error.tsx 必须是 Client Component（需要 reset 交互）',
  'error.tsx 只捕获子组件错误，不捕获 layout 错误',
  'global-error.tsx 替换整个根 layout，需自带 html/body',
  'error 层级向上冒泡，最近的 error.tsx 捕获',
]
</script>

<template>
  <div class="demo-card">
    <h3>Loading 与 Error UI</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>特殊文件约定</h4>
        <table>
          <thead><tr><th>文件</th><th>范围</th><th>作用</th></tr></thead>
          <tbody>
            <tr v-for="f in specialFiles" :key="f.file">
              <td><code :style="{ color: f.color }">{{ f.file }}</code></td>
              <td>{{ f.scope }}</td>
              <td><small>{{ f.desc }}</small></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">规则要点</h4>
        <ul>
          <li v-for="(r, i) in rules" :key="i"><small>{{ r }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>层级关系：</strong>loading → error → not-found，就近匹配，向上冒泡。</p>
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
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
