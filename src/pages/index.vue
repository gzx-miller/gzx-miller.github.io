<script setup lang="ts">
import { knowledgeCategories, getLessonsByCategory } from '../data/lessons'

definePageMeta({ layout: 'home' })

useHead({
  title: '小松鼠举栗子 - 通过独立真实案例学习软件技术',
})

useSeoMeta({
  description: '小松鼠举栗子中文技术知识案例库：Vue3、TypeScript、React、Node.js、CSS 等 19 大分类 400+ 真实案例，每个栗子只讲一个知识点。',
  ogTitle: '小松鼠举栗子',
  ogDescription: '通过独立真实案例学习软件技术，400+ 颗栗子等你来摘。',
  ogType: 'website',
  twitterCard: 'summary',
})

// 为每个分类挑选一枚贴合气质的徽标
const categoryEmojis: Record<string, string> = {
  javascript: '⚡',
  typescript: '📘',
  vue: '💚',
  'element-plus': '🧩',
  nestjs: '🦁',
  nuxt: '🌲',
  nodejs: '🍃',
  engineering: '🛠️',
  css: '🎨',
  'tailwind-css': '💨',
  sass: '💗',
  vite: '🚀',
  react: '⚛️',
  nextjs: '▲',
  langchain: '🦜',
  cpp: '⚙️',
  electron: '🪟',
  ffmpeg: '🎬',
}

// 构建期统计各分类栗子数与总数（结果进入 payload，客户端无需重复加载）
const { data: categoryCounts } = await useAsyncData('home-category-counts', async () => {
  const counts: Record<string, number> = {}
  let total = 0
  for (const category of knowledgeCategories) {
    const lessons = await getLessonsByCategory(category.id)
    counts[category.id] = lessons.length
    total += lessons.length
  }
  return { counts, total }
})

const totalLessons = computed(() => categoryCounts.value?.total ?? 0)
const readyCount = computed(() => knowledgeCategories.filter((c) => c.status === 'ready').length)

function categoryCount(id: string): number | null {
  const count = categoryCounts.value?.counts?.[id]
  return count ?? null
}

</script>

<template>
  <main id="main-content" class="home-page" tabindex="-1">
    <section class="home-section">
      <div class="category-grid">
        <NuxtLink
          v-for="item in knowledgeCategories"
          :key="item.id"
          :to="item.status === 'ready' ? item.path : '/vue'"
          class="category-card"
          :class="{ planned: item.status !== 'ready' }"
        >
          <div class="category-card-head">
            <span class="category-emoji" aria-hidden="true">{{ categoryEmojis[item.id] ?? '🌰' }}</span>
            <h3 class="category-name">{{ item.name }}</h3>
            <span v-if="categoryCount(item.id) !== null" class="category-count">{{ categoryCount(item.id) }} 颗</span>
          </div>
          <p class="category-intro">{{ item.intro }}</p>
          <span class="category-go">进入学习 →</span>
        </NuxtLink>
      </div>
    </section>

    <footer class="home-footer">
      <p>gzx_miller@foxmail.com · <a href="https://github.com/gzx-miller/gzx-miller.github.io" target="_blank" rel="noopener">GitHub</a></p>
    </footer>
  </main>
</template>
