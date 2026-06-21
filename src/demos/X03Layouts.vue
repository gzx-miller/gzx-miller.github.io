<script setup lang="ts">
import { ref } from 'vue'

const layoutTypes = [
  { name: '根布局', file: 'app/layout.tsx', scope: '全站', desc: '必需，包含 <html> <body>，所有页面共享', required: true },
  { name: '嵌套布局', file: 'app/blog/layout.tsx', scope: '子路由', desc: 'blog/ 下所有页面共享，套在根布局内', required: false },
  { name: '路由组布局', file: 'app/(dashboard)/layout.tsx', scope: '路由组', desc: '同一路径下不同布局，不影响 URL', required: false },
  { name: '模板', file: 'app/template.tsx', scope: '全站', desc: '类似布局但每次导航都重新挂载', required: false },
]

const selected = ref(0)

const codeExample = `<span style="color:#7c7c99">// app/layout.tsx — 根布局</span>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    &lt;html lang="zh"&gt;
      &lt;body&gt;
        &lt;Header /&gt;
        &lt;main&gt;{children}&lt;/main&gt;
        &lt;Footer /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#7c7c99">// app/blog/layout.tsx — 嵌套布局</span>
export default function BlogLayout({ children }) {
  return (
    &lt;div className="blog-shell"&gt;
      &lt;aside&gt;分类导航&lt;/aside&gt;
      &lt;article&gt;{children}&lt;/article&gt;
    &lt;/div&gt;
  )
}`
</script>

<template>
  <div class="demo-card">
    <h3>布局与模板：共享 UI 的层级</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>布局类型</h4>
        <ul>
          <li v-for="(l, i) in layoutTypes" :key="l.name"
              :style="{ cursor:'pointer', fontWeight: selected===i?'bold':'normal', color: selected===i?'#e85d04':'inherit', padding:'6px 0' }"
              @click="selected=i">
            <strong>{{ l.name }}</strong>
            <span v-if="l.required" class="tag">必需</span>
            <br/><small><code>{{ l.file }}</code> · {{ l.scope }}</small>
          </li>
        </ul>
        <div class="detail-box">
          <p><strong>{{ layoutTypes[selected].name }}</strong></p>
          <p>{{ layoutTypes[selected].desc }}</p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>布局嵌套示意</h4>
        <div class="nest-box">
          <div class="nest-layer root">根布局 layout.tsx<br/><small>Header + Footer</small></div>
          <div class="nest-layer nested">嵌套布局 blog/layout.tsx<br/><small>侧边栏</small></div>
          <div class="nest-layer page">页面 page.tsx<br/><small>具体内容</small></div>
        </div>

        <h4 style="margin-top:12px;">代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
      </div>
    </div>

    <small>布局在导航时保持状态不重新挂载；template.tsx 则每次导航重新创建，适合需要重置状态的场景。</small>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 8px; }
.tag { background: #e85d04; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
.nest-box { display: flex; flex-direction: column; gap: 6px; }
.nest-layer { padding: 10px; border-radius: 6px; text-align: center; font-size: 13px; }
.root { background: #ffe0b2; border: 2px solid #e85d04; }
.nested { background: #fff3e0; border: 2px solid #d97706; margin: 0 16px; }
.page { background: #fff8f0; border: 2px solid #ca8a04; margin: 0 32px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
</style>
