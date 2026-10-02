const n=`<script setup lang="ts">
import { ref } from 'vue'

const interceptionTypes = [
  { symbol: '.', name: '当前层级', example: '(.)photo', desc: '拦截同级 /photo' },
  { symbol: '..', name: '上一层级', example: '(..)photo', desc: '拦截父级 /photo' },
  { symbol: '(..)(..)', name: '上两层', example: '(..)(..)photo', desc: '拦截祖父级 /photo' },
  { symbol: '(...)', name: '根层级', example: '(...)photo', desc: '拦截根 /photo' },
]

const codeExample = \`<span style="color:#8a8a3a">// 场景：点击图片在当前页弹窗显示，直接访问则全屏页</span>

<span style="color:#7c7c99">// 目录结构</span>
app/
├── feed/
│   ├── page.tsx           <span style="color:#7c7c99">// /feed 列表页</span>
│   └── (..)photo/[id]/
│       └── page.tsx       <span style="color:#7c7c99">// 拦截 /photo/:id → 弹窗</span>
├── photo/[id]/
│   └── page.tsx           <span style="color:#7c7c99">// 真实 /photo/:id → 全屏</span>
└── layout.tsx

<span style="color:#8a8a3a">// app/feed/(..)photo/[id]/page.tsx — 拦截版</span>
import { Modal } from '@/components/Modal'

export default function InterceptedPhoto({ params }) {
  return (
    &lt;Modal&gt;
      &lt;Photo id={params.id} /&gt;
    &lt;/Modal&gt;
  )
}

<span style="color:#8a8a3a">// app/photo/[id]/page.tsx — 直接访问版</span>
export default function PhotoPage({ params }) {
  return &lt;Photo id={params.id} fullscreen /&gt;
}\`

const flow = [
  '用户在 /feed 点击图片链接',
  '路由被 (..)photo/[id] 拦截 → 弹窗展示',
  'URL 变为 /photo/123（可分享、可刷新）',
  '刷新页面 → 命中真实 photo/[id] → 全屏页',
  '浏览器后退 → 回到 /feed（弹窗关闭）',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Intercepting Routes：拦截路由</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>拦截符号</h4>
        <table>
          <thead><tr><th>符号</th><th>层级</th><th>示例</th></tr></thead>
          <tbody>
            <tr v-for="t in interceptionTypes" :key="t.symbol">
              <td><code>{{ t.symbol }}</code></td>
              <td>{{ t.name }}</td>
              <td><code>{{ t.example }}</code></td>
            </tr>
          </tbody>
        </table>

        <h4 style="margin-top:12px;">典型流程（图片弹窗）</h4>
        <ol>
          <li v-for="(f, i) in flow" :key="i"><small>{{ f }}</small></li>
        </ol>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box">
          <p><strong>核心价值：</strong>同一 URL，客户端导航时弹窗、直接访问时全屏，体验与可分享性兼得。</p>
          <p><strong>配合：</strong>通常和 Parallel Routes 的 Modal 插槽一起用。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 5px 8px; border: 1px solid #ddd; text-align: left; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ol { font-size: 12px; padding-left: 18px; }
</style>
`;export{n as default};
