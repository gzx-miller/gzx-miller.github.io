const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

const currentPath = ref('/courses/3')
const courses = [
  { id: 1, name: 'Vue3 入门', price: 99 },
  { id: 2, name: 'Nuxt 实战', price: 129 },
  { id: 3, name: 'TypeScript 进阶', price: 149 },
  { id: 4, name: 'Pinia 状态管理', price: 79 },
]

const matchResult = computed(() => {
  const match = currentPath.value.match(/^\\/courses\\/(\\d+)$/)
  if (!match) return { matched: false, params: null, course: null }
  const id = Number(match[1])
  const course = courses.find(c => c.id === id)
  return { matched: true, params: { id }, course: course ?? null }
})

const catchAllPath = ref('/docs/guide/installation')
const catchAllResult = computed(() => {
  const match = catchAllPath.value.match(/^\\/docs\\/(.*)$/)
  if (!match) return { matched: false, slug: null, segments: [] }
  const slug = match[1]
  return { matched: true, slug, segments: slug.split('/') }
})
<\/script>

<template>
  <div class="demo-card">
    <h3>动态路由与路由参数</h3>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>动态参数 <code>[id].vue</code></h4>
        <p>模拟路径：<code>/courses/:id</code></p>
        <input v-model="currentPath" placeholder="/courses/3" style="width:100%;margin-bottom:8px;" />
        <div class="result-box">
          <p>匹配：{{ matchResult.matched ? '✅ 是' : '❌ 否' }}</p>
          <p v-if="matchResult.matched">参数 <code>id</code> = {{ matchResult.params?.id }}</p>
          <p v-if="matchResult.course">课程：{{ matchResult.course.name }}（¥{{ matchResult.course.price }}）</p>
          <p v-if="matchResult.matched && !matchResult.course" style="color:#c62828;">⚠ 未找到 id={{ matchResult.params?.id }} 的课程</p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>Catch-all <code>[...slug].vue</code></h4>
        <p>模拟路径：<code>/docs/:slug(.*)*</code></p>
        <input v-model="catchAllPath" placeholder="/docs/guide/installation" style="width:100%;margin-bottom:8px;" />
        <div class="result-box">
          <p>匹配：{{ catchAllResult.matched ? '✅ 是' : '❌ 否' }}</p>
          <p v-if="catchAllResult.matched">slug = <code>{{ catchAllResult.slug }}</code></p>
          <p v-if="catchAllResult.segments.length">路径段：{{ catchAllResult.segments.join(' → ') }}</p>
        </div>
      </div>
    </div>

    <div style="margin-top:12px;padding:10px;background:#fff8f0;border-radius:6px;">
      <strong>代码示例：</strong>
      <pre style="font-size:12px;margin:4px 0;">// pages/courses/[id].vue
const route = useRoute()
const id = route.params.id  // 字符串类型

// pages/docs/[...slug].vue
const slug = route.params.slug  // 字符串数组</pre>
    </div>
  </div>
</template>

<style scoped>
.result-box { background: #f9f9f9; padding: 8px; border-radius: 6px; min-height: 80px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
