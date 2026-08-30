<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'useHead' | 'seo' | 'og'>('useHead')

const pageTitle = ref('课程详情')
const pageDescription = ref('Vue3 入门到精通在线课程')

const headResult = computed(() => ({
  title: `${pageTitle.value} - 小松鼠举栗子`,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
  ],
}))

const useHeadCode = `// 组合式 API 方式
useHead({
  title: '课程详情 - 小松鼠举栗子',
  meta: [
    { name: 'description', content: '课程描述' },
    { property: 'og:title', content: '课程详情' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ],
  style: [{ children: 'body { margin: 0 }' }],
  script: [
    { src: 'https://cdn.example.com/analytics.js', defer: true }
  ],
})`

const seoCode = `// 响应式 SEO（标题随状态变化）
const course = ref({ name: 'Nuxt 实战', desc: '学习 Nuxt 全栈' })

useHead(computed(() => ({
  title: course.value.name,
  meta: [
    { name: 'description', content: course.value.desc },
  ],
})))

// nuxt.config.ts 全局 SEO
export default defineNuxtConfig({
  app: {
    head: {
      title: '小松鼠举栗子',
      meta: [
        { name: 'description', content: '中文前端知识内容库' },
        { name: 'keywords', content: 'Vue3, Nuxt, 前端' },
      ],
    },
  },
})`

const ogCode = `<!-- 使用 useSeoMeta 简化 OG 标签 -->
useSeoMeta({
  title: '课程详情',
  ogTitle: '课程详情 - 小松鼠举栗子',
  description: '学习 Vue3 核心知识',
  ogDescription: '学习 Vue3 核心知识',
  ogImage: 'https://example.com/cover.jpg',
  ogUrl: 'https://example.com/course/1',
  twitterCard: 'summary_large_image',
})`
</script>

<template>
  <div class="demo-card">
    <h3>SEO 与 useHead</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeTab === 'useHead' }" @click="activeTab='useHead'">useHead</button>
      <button :class="{ active: activeTab === 'seo' }" @click="activeTab='seo'">响应式 SEO</button>
      <button :class="{ active: activeTab === 'og' }" @click="activeTab='og'">useSeoMeta</button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>实时预览 head 配置</h4>
        <div class="form-group">
          <label>页面标题：</label>
          <input v-model="pageTitle" style="width:100%;" />
        </div>
        <div class="form-group">
          <label>页面描述：</label>
          <input v-model="pageDescription" style="width:100%;" />
        </div>
        <div class="head-preview">
          <p><strong>&lt;title&gt;</strong> {{ headResult.title }}</p>
          <p v-for="meta in headResult.meta" :key="meta.property || meta.name">
            <code>{{ meta.property ? `property="${meta.property}"` : `name="${meta.name}"` }}</code>
            content="{{ meta.content }}"
          </p>
        </div>
      </div>

      <div style="flex:1;">
        <pre class="code-block" v-if="activeTab === 'useHead'">{{ useHeadCode }}</pre>
        <pre class="code-block" v-if="activeTab === 'seo'">{{ seoCode }}</pre>
        <pre class="code-block" v-if="activeTab === 'og'">{{ ogCode }}</pre>
      </div>
    </div>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 Nuxt 的 <code>useHead</code> 基于 Unhead 实现，支持响应式值（computed/ref）。SSR 时自动将 head 标签注入 HTML，CSR 时动态更新 DOM。全局默认在 <code>nuxt.config.ts</code> 的 <code>app.head</code> 配置。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.form-group { margin-bottom: 8px; }
.form-group label { font-size: 13px; font-weight: 500; display: block; margin-bottom: 2px; }
.head-preview { background: #f9f9f9; padding: 10px; border-radius: 6px; font-size: 12px; }
.head-preview p { margin: 4px 0; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
