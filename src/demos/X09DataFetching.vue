<script setup lang="ts">
import { ref } from 'vue'

const cacheOptions = [
  { option: "cache: 'force-cache'", desc: '默认，构建时缓存，永久有效', when: '静态内容', color: '#65a30d' },
  { option: "cache: 'no-store'", desc: '不缓存，每次请求都重新获取', when: '实时数据', color: '#e85d04' },
  { option: "next: { revalidate: 60 }", desc: 'ISR，60 秒后重新验证', when: '半静态内容', color: '#d97706' },
  { option: "next: { tags: ['posts'] }", desc: '按标签缓存，可主动失效', when: '按需更新', color: '#0891b2' },
]

const codeExample = `<span style="color:#8a8a3a">// 1. 默认缓存（静态）</span>
const res = await fetch('https://api.example.com/posts')
<span style="color:#7c7c99">// 等价于 fetch(url, { cache: 'force-cache' })</span>

<span style="color:#8a8a3a">// 2. 禁用缓存（动态）</span>
const res = await fetch('https://api.example.com/live', {
  cache: 'no-store'
})

<span style="color:#8a8a3a">// 3. ISR — 定时重新验证</span>
const res = await fetch('https://api.example.com/news', {
  next: { revalidate: 60 }  <span style="color:#7c7c99">// 60秒</span>
})

<span style="color:#8a8a3a">// 4. 按标签缓存 + 主动失效</span>
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
})

<span style="color:#8a8a3a">// 在 Server Action 或 Route Handler 中失效</span>
import { revalidateTag } from 'next/cache'
revalidateTag('posts')  <span style="color:#7c7c99">// 清除该标签缓存</span>`

const fetchFacts = [
  'Next.js 扩展了原生 fetch，自动去重和缓存',
  '同一渲染周期内相同 URL 的 fetch 只执行一次',
  'Server Component 中直接 await fetch，无需 useEffect',
  '缓存存储在服务端，跨请求共享',
]
</script>

<template>
  <div class="demo-card">
    <h3>数据获取与 fetch 缓存</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>fetch 缓存选项</h4>
        <div v-for="c in cacheOptions" :key="c.option" class="cache-card" :style="{ borderLeftColor: c.color }">
          <code>{{ c.option }}</code>
          <span class="tag" :style="{ background: c.color }">{{ c.when }}</span>
          <p><small>{{ c.desc }}</small></p>
        </div>

        <h4 style="margin-top:12px;">关键事实</h4>
        <ul>
          <li v-for="(f, i) in fetchFacts" :key="i"><small>{{ f }}</small></li>
        </ul>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="mini-code" v-html="codeExample"></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.cache-card { background: #fff8f0; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-bottom: 6px; }
.tag { color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
