<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { knowledgeCategories, knowledgeCategoryMap, getLessonsByCategory } from '../data/lessons'
import { useLearningProgress } from '../composables/useLearningProgress'

const { isVisited } = useLearningProgress()

// 仅保留可序列化的课程元数据，避免把 demo 组件 / code 加载函数塞进预渲染 payload
interface LessonMeta {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
  // 预计算的小写检索键，运行时搜索无需重复 toLocaleLowerCase
  searchKey: string
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

// 首页精选：横跨前端框架 / 类型 / 后端 / 图形 / AI / 系统的代表性内容
const featuredPaths = [
  '/vue/k-3/reactivity',
  '/typescript/t-4/generics',
  '/react/r-2/state-updates',
  '/css/c-3/flexbox',
  '/nestjs/n-1/modules-di',
  '/nodejs/d-5/streams',
  '/langchain/l-1/llm-call',
  '/webgl/w-1/context-pipeline',
  '/webassembly/wb-1/what-is-wasm',
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
        searchKey: [lesson.navTitle, lesson.title, lesson.category, lesson.summary]
          .join(' ')
          .toLocaleLowerCase('zh-CN'),
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

// 一次性统计每个分类的已探索课程数，避免逐卡片对全量课程做线性过滤。
// 依赖 visitedPaths（响应式），首页浏览进度变化时自动重算。
const visitedByCategory = computed(() => {
  const lessons = data.value?.allLessons ?? []
  const map = new Map<string, number>()
  for (const lesson of lessons) {
    if (isVisited(lesson.path)) {
      const id = categoryIdOf(lesson)
      map.set(id, (map.get(id) ?? 0) + 1)
    }
  }
  return map
})

// 分类内已探索课程数
function categoryVisitedCount(id: string): number {
  return visitedByCategory.value.get(id) ?? 0
}

// 分类完成度：已探索 / 总课程，供卡片进度条展示
function categoryProgress(id: string): number {
  const count = categoryCount(id)
  if (!count) return 0
  const visited = categoryVisitedCount(id)
  return Math.round((visited / count) * 100)
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
const searchInputRef = useTemplateRef<HTMLInputElement>('searchInput')
const activeIndex = ref(0)

const searchResults = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('zh-CN')
  if (!query) return []
  return (data.value?.allLessons ?? [])
    .filter((lesson) => lesson.searchKey.includes(query))
    .slice(0, 8)
})

// 结果变化时回到首项，保证始终有一个默认选中项
watch(searchResults, () => {
  activeIndex.value = 0
})

function moveActive(step: number) {
  const len = searchResults.value.length
  if (!len) return
  activeIndex.value = (activeIndex.value + step + len) % len
}

function goToActive() {
  const lesson = searchResults.value[activeIndex.value]
  if (!lesson) return
  clearSearch()
  navigateTo(lesson.path)
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    goToActive()
  } else if (event.key === 'Escape') {
    clearSearch()
  }
}

// 点击右侧搜索按钮：有结果则跳转到当前选中项，否则聚焦输入框
function onSearchSubmit() {
  if (searchResults.value.length) {
    goToActive()
  } else {
    searchInputRef.value?.focus()
  }
}

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
      <div class="hero-decors" aria-hidden="true">
        <span class="hero-decor hero-decor-leaf leaf-one">🍁</span>
        <span class="hero-decor hero-decor-leaf leaf-two">🍂</span>
        <span class="hero-decor hero-decor-squirrel">🐿️</span>
      </div>
      <div class="hero-inner">
        <h1 class="hero-title"><span class="hero-title-brand">小松鼠举栗子</span> 🌰</h1>
        <p class="hero-subtitle">
          通过独立的内容，学懂 Vue3、TypeScript、React、Node.js、CSS、AI 等软件技术 ——
          每一颗栗子只讲一个知识点。
        </p>
        <div class="hero-stats" aria-label="站点统计">
          <span class="hero-stat"><strong>{{ readyCount }}</strong><em>大分类</em></span>
          <span class="hero-stat"><strong>{{ totalLessons }}</strong><em>颗栗子</em></span>
          <!-- <span class="hero-stat"><strong>开源</strong><em>免费复制</em></span> -->
        </div>
        <div ref="searchWrap" class="search-box-wrap">
          <div class="search-box">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              placeholder="全站搜索内容…（如：Vue、React、WebGL）"
              autocomplete="off"
              aria-label="全站搜索内容"
              @focus="searchFocused = true"
              @blur="onSearchBlur"
              @keydown="onSearchKeydown"
            />
            <button type="button" class="search-submit" aria-label="搜索" @click="onSearchSubmit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
          <Transition name="fade">
            <ul v-if="searchFocused && searchResults.length" class="search-results">
              <li
                v-for="(lesson, index) in searchResults"
                :key="lesson.path"
                :class="{ active: index === activeIndex }"
                @mouseenter="activeIndex = index"
              >
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
          <div v-if="categoryCount(item.id) !== null" class="category-progress" role="progressbar" :aria-label="`${item.name} 学习进度`" :aria-valuenow="categoryProgress(item.id)" aria-valuemin="0" aria-valuemax="100">
            <span class="category-progress-track"><span class="category-progress-bar" :style="{ width: `${categoryProgress(item.id)}%` }"></span></span>
            <span class="category-progress-text">{{ categoryVisitedCount(item.id) }} / {{ categoryCount(item.id) }} 已探索</span>
          </div>
          <span class="category-go">进入学习 →</span>
        </NuxtLink>
      </div>
    </section>

    <footer class="home-footer">
      <p>gzx_miller@foxmail.com · <a href="https://github.com/gzx-miller/gzx-miller.github.io" target="_blank" rel="noopener">GitHub</a></p>
    </footer>
  </main>
</template>