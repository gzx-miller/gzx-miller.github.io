<script setup lang="ts">
import { ref } from 'vue'

const steps = ref([
  { label: '服务端开始渲染', done: false, slow: false },
  { label: '遇到 <Suspense> 包裹的慢组件', done: false, slow: false },
  { label: '立即返回 fallback UI + 已完成部分', done: false, slow: true },
  { label: '慢组件 resolve 后流式替换', done: false, slow: false },
])
const current = ref(-1)

function run() {
  current.value = -1
  steps.value.forEach(s => s.done = false)
  let i = 0
  const timer = setInterval(() => {
    if (i < steps.value.length) {
      steps.value[i].done = true
      current.value = i
      i++
    } else {
      clearInterval(timer)
    }
  }, 700)
}

const codeExample = `<span style="color:#8a8a3a">// app/page.tsx — 流式渲染</span>
import { Suspense } from 'react'
import SlowList from './SlowList'
import FastHeader from './FastHeader'

export default function Page() {
  return (
    &lt;&gt;
      &lt;FastHeader /&gt;  <span style="color:#7c7c99">{/* 立即返回 */}</span>
      &lt;Suspense fallback={&lt;p&gt;加载列表中...&lt;/p&gt;}&gt;
        &lt;SlowList /&gt;  <span style="color:#7c7c99">{/* 流式替换 */}</span>
      &lt;/Suspense&gt;
    &lt;/&gt;
  )
}

<span style="color:#8a8a3a">// SlowList.tsx — 慢组件（async Server Component）</span>
export default async function SlowList() {
  const data = await fetch('https://api.example.com/slow')
  const items = await data.json()
  return &lt;ul&gt;{items.map(i =&gt; &lt;li key={i.id}&gt;{i.name}&lt;/li&gt;)}&lt;/ul&gt;
}`
</script>

<template>
  <div class="demo-card">
    <h3>Streaming 与 Suspense 流式渲染</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>流式渲染流程</h4>
        <button class="btn" @click="run">▶ 模拟流式渲染</button>
        <ol style="margin-top:8px;">
          <li v-for="(s, i) in steps" :key="i"
              :style="{ opacity: s.done ? 1 : 0.4, color: current===i ? '#e85d04' : 'inherit', fontWeight: current===i ? 'bold' : 'normal', transition: 'all 0.3s' }">
            {{ s.label }}
            <span v-if="s.slow && s.done" class="tag slow">慢</span>
            <span v-else-if="s.done" class="tag ok">✓</span>
          </li>
        </ol>

        <div class="detail-box">
          <p><strong>优势：</strong>用户无需等待最慢的组件，先看到页面骨架。</p>
          <p><strong>原理：</strong>服务端把 HTML 分块发送，Suspense 边界处插入 fallback，数据就绪后流式替换。</p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
        <div class="detail-box" style="margin-top:8px;">
          <p><strong>loading.tsx：</strong>等价于路由级 Suspense，自动包裹页面。</p>
          <p><strong>组合：</strong>多个 Suspense 可并行流式，互不阻塞。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.detail-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.btn { background: #e85d04; color: #fff; border: none; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; }
.btn:hover { background: #c84d00; }
.tag { padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
.tag.ok { background: #65a30d; color: #fff; }
.tag.slow { background: #d97706; color: #fff; }
ol { font-size: 13px; padding-left: 20px; line-height: 2; }
</style>
