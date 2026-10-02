const n=`<script setup lang="ts">
import { ref } from 'vue'

const slots = [
  { name: '@main', content: '主内容区', example: 'app/@main/page.tsx' },
  { name: '@sidebar', content: '侧边栏', example: 'app/@sidebar/page.tsx' },
  { name: '@analytics', content: '统计面板', example: 'app/@analytics/page.tsx' },
]

const codeExample = \`<span style="color:#8a8a3a">// app/layout.tsx — 并行路由</span>
export default function Layout({
  children,     <span style="color:#7c7c99">// @main 或默认</span>
  sidebar,      <span style="color:#7c7c99">// @sidebar 插槽</span>
  analytics,    <span style="color:#7c7c99">// @analytics 插槽</span>
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    &lt;div className="grid"&gt;
      &lt;main&gt;{children}&lt;/main&gt;
      &lt;aside&gt;{sidebar}&lt;/aside&gt;
      &lt;footer&gt;{analytics}&lt;/footer&gt;
    &lt;/div&gt;
  )
}

<span style="color:#8a8a3a">// 目录结构</span>
app/
├── layout.tsx
├── @main/page.tsx
├── @sidebar/page.tsx
└── @analytics/page.tsx

<span style="color:#8a8a3a">// default.tsx — 插槽未匹配时的默认内容</span>
<span style="color:#7c7c99">// app/@analytics/default.tsx</span>
export default function Default() {
  return &lt;p&gt;暂无数据&lt;/p&gt;
}\`

const useCases = [
  '仪表盘：多个独立数据块并行加载',
  '模态框：配合 Intercepting Routes 实现弹窗',
  '条件渲染：不同子路由展示不同插槽组合',
  '独立加载：每个插槽有自己的 loading 状态',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Parallel Routes：并行路由</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>插槽 (@) 概念</h4>
        <div class="layout-preview">
          <div class="slot main">@main</div>
          <div class="slot side">@sidebar</div>
          <div class="slot analytics">@analytics</div>
        </div>

        <h4 style="margin-top:12px;">插槽列表</h4>
        <ul>
          <li v-for="s in slots" :key="s.name">
            <code>{{ s.name }}</code> — {{ s.content }}
            <br/><small><code>{{ s.example }}</code></small>
          </li>
        </ul>

        <h4 style="margin-top:12px;">适用场景</h4>
        <ul>
          <li v-for="(u, i) in useCases" :key="i"><small>{{ u }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>关键：</strong>插槽用 @ 前缀命名，作为 props 传入 layout。</p>
          <p><strong>default.tsx：</strong>当插槽没有匹配的子路由时显示的默认内容。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.layout-preview { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 4px; height: 120px; }
.slot { display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 12px; font-family: monospace; }
.slot.main { grid-row: 1 / 3; background: #ffe0b2; border: 2px solid #e85d04; }
.slot.side { background: #fff3e0; border: 2px solid #d97706; }
.slot.analytics { background: #fff8f0; border: 2px solid #ca8a04; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{n as default};
