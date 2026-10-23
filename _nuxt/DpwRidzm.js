const n=`<script setup lang="ts">
import { ref } from 'vue'

const cacheOptions = [
  { option: "cache: 'force-cache'", desc: '显式开启持久缓存（fetch 默认 auto no cache）', when: '静态内容', color: '#65a30d' },
  { option: "cache: 'no-store'", desc: '不缓存，每次请求都重新获取', when: '实时数据', color: '#e85d04' },
  { option: "next: { revalidate: 60 }", desc: 'ISR，60 秒后重新验证', when: '半静态内容', color: '#d97706' },
  { option: "next: { tags: ['posts'] }", desc: '按标签缓存，可主动失效', when: '按需更新', color: '#0891b2' },
]

const codeExample = \`<span style="color:#8a8a3a">// 1. 显式持久缓存（静态）</span>
const res = await fetch('https://api.example.com/posts', {
  cache: 'force-cache'
})
<span style="color:#7c7c99">// fetch 默认 auto no cache，需要缓存时必须显式声明</span>

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
revalidateTag('posts', 'max')  <span style="color:#7c7c99">// 后台刷新该标签缓存</span>\`

const fetchFacts = [
  'Next.js 扩展了原生 fetch，同一次渲染内自动去重',
  'fetch 默认 auto no cache，需要持久缓存时显式声明',
  'Server Component 中直接 await fetch，无需 useEffect',
  '缓存存储在服务端，跨请求共享',
]
<\/script>

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

.tag { color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
ul { font-size: 12px; padding-left: 16px; }
</style>
`;export{n as default};
