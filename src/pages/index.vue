<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { knowledgeCategories, knowledgeCategoryMap, getLessonsByCategory } from '../data/lessons'

// 仅保留可序列化的课程元数据，避免把 demo 组件 / code 加载函数塞进预渲染 payload
interface LessonMeta {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
}

definePageMeta({ layout: 'home' })

useHead({
  title: '小松鼠举栗子 - 通过独立真实内容学习软件技术',
})

useSeoMeta({
  description: '小松鼠举栗子中文技术知识内容库：Vue3、TypeScript、React、Node.js、CSS、WebGL、C++、uni-app 等 22 大分类 500+ 真实内容，每个栗子只讲一个知识点。',
  ogTitle: '小松鼠举栗子',
  ogDescription: '通过独立真实内容学习软件技术，500+ 颗栗子等你来摘。',
  ogType: 'website',
  ogImage: 'https://gzx-miller.github.io/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://gzx-miller.github.io/og-image.jpg',
})

// 为每个分类挑选一枚贴合气质的徽标
const categoryEmojis: Record<string, string> = {
  javascript: '⚡',
  typescript: '📘',
  vue: '💚',
  'element-plus': '🧩',
  'vue-flow': '🕸️',
  nestjs: '🦁',
  nuxt: '🌲',
  nodejs: '🍃',
  css: '🎨',
  'tailwind-css': '💨',
  sass: '💗',
  vite: '🚀',
  react: '⚛️',
  nextjs: '▲',
  langchain: '🦜',
  'llm-principles': '🧠',
  cpp: '⚙️',
  electron: '🪟',
  ffmpeg: '🎬',
  webgl: '🎮',
  webassembly: '🧬',
  'uni-app': '📱',
}

// 首页精选：横跨前端框架 / 类型 / 后端 / AI 的代表性内容
const featuredPaths = [
  '/vue/k-3/reactivity',
  '/typescript/t-4/generics',
  '/react/r-2/state-updates',
  '/css/c-3/flexbox',
  '/nestjs/n-1/modules-di',
  '/langchain/l-1/llm-call',
]

// 构建期统计分类栗子数与总数、并加载全站课程元数据用于搜索与精选
const { data } = await useAsyncData('home-overview', async () => {
  const counts: Record<string, number> = {}
  const allLessons: LessonMeta[] = []
  let total = 0
  for (const category of knowledgeCategories) {
    const lessons = await getLessonsByCategory(category.id)
    counts[category.id] = lessons.length
    total += lessons.length
    for (const lesson of lessons) {
      allLessons.push({
        id: lesson.id,
        title: lesson.title,
        navTitle: lesson.navTitle,
        category: lesson.category,
        path: lesson.path,
        summary: lesson.summary,
      })
    }
  }
  return { counts, total, allLessons }
})

const totalLessons = computed(() => data.value?.total ?? 0)
const readyCount = computed(() => knowledgeCategories.filter((c) => c.status === 'ready').length)

function categoryCount(id: string): number | null {
  return data.value?.counts?.[id] ?? null
}

// 从课程路径首段推断所属知识分类（lesson.category 是分类内的子分组标签）
function categoryIdOf(lesson: LessonMeta): string {
  return lesson.path.split('/')[1] ?? ''
}
function categoryNameOf(lesson: LessonMeta): string {
  return knowledgeCategoryMap.get(categoryIdOf(lesson))?.name ?? categoryIdOf(lesson)
}

// 精选内容：按路径稳定映射，路径失效时优雅忽略
const lessonPathMap = computed(() => {
  const map = new Map<string, LessonMeta>()
  for (const lesson of data.value?.allLessons ?? []) {
    map.set(lesson.path, lesson)
  }
  return map
})
const featuredLessons = computed(() =>
  featuredPaths.map((path) => lessonPathMap.value.get(path)).filter((l): l is LessonMeta => !!l),
)

// 全站搜索
const searchQuery = ref('')
const searchFocused = ref(false)
const searchWrapRef = useTemplateRef<HTMLElement>('searchWrap')

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('zh-CN')
  if (!query) return []
  return (data.value?.allLessons ?? [])
    .filter((lesson) =>
      [lesson.navTitle, lesson.title, lesson.category, lesson.summary].some((value) =>
        value.toLocaleLowerCase('zh-CN').includes(query),
      ),
    )
    .slice(0, 8)
})

function onSearchBlur(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (!next || !searchWrapRef.value?.contains(next)) {
    searchFocused.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
  searchFocused.value = false
}
</script>

<template>
  <main id="main-content" class="home-page" tabindex="-1">
    <section class="hero">
      <div class="hero-inner">
        <h1 class="hero-title">小松鼠举栗子 🌰</h1>
        <p class="hero-subtitle">
          通过独立真实的小内容，学懂 Vue3、TypeScript、React、Node.js、CSS、AI 等软件技术 ——
          每一颗栗子只讲一个知识点。
        </p>
        <div class="hero-stats" aria-label="站点统计">
          <span class="hero-stat"><strong>{{ readyCount }}</strong><em>大分类</em></span>
          <span class="hero-stat"><strong>{{ totalLessons }}</strong><em>颗内容</em></span>
          <span class="hero-stat"><strong>开源</strong><em>免费复制</em></span>
        </div>
        <div ref="searchWrap" class="search-box-wrap">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="全站搜索内容…（如：响应式、泛型、Flexbox）"
              autocomplete="off"
              aria-label="全站搜索内容"
              @focus="searchFocused = true"
              @blur="onSearchBlur"
            />
          </div>
          <Transition name="fade">
            <ul v-if="searchFocused && searchResults.length" class="search-results">
              <li v-for="lesson in searchResults" :key="lesson.path">
                <NuxtLink :to="lesson.path" no-prefetch @click="clearSearch">
                  <span class="search-cat">{{ categoryNameOf(lesson) }}</span>
                  <span class="search-title">{{ lesson.navTitle }}</span>
                  <span class="search-summary">{{ lesson.summary }}</span>
                </NuxtLink>
              </li>
            </ul>
          </Transition>
          <p v-if="searchFocused && searchQuery.trim() && !searchResults.length" class="search-empty">
            没有找到匹配的内容
          </p>
        </div>
      </div>
    </section>

    <section v-if="featuredLessons.length" class="home-section">
      <h2 class="section-title">精选内容</h2>
      <div class="featured-grid">
        <NuxtLink
          v-for="lesson in featuredLessons"
          :key="lesson.path"
          :to="lesson.path"
          class="featured-card"
        >
          <span class="featured-cat">{{ categoryNameOf(lesson) }}</span>
          <h3 class="featured-title">{{ lesson.title }}</h3>
          <p class="featured-summary">{{ lesson.summary }}</p>
          <span class="featured-go">开始学习 →</span>
        </NuxtLink>
      </div>
    </section>

    <section class="home-section">
      <h2 class="section-title">知识分类</h2>
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