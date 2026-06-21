<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import squirrelHero from '../assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories, lessons } from '../data/lessons'
import CodeBlock from './CodeBlock.vue'

const route = useRoute()

const categoryDetails: Record<string, { intro: string; officialUrl: string }> = {
  vue: {
    intro:
      'Vue3 是渐进式 JavaScript 框架，适合从单个交互组件逐步扩展到完整前端应用。本分类用真实小业务场景拆解组合式 API、组件、路由、状态管理和工程实践。',
    officialUrl: 'https://vuejs.org/',
  },
  typescript: {
    intro: 'TypeScript 为 JavaScript 增加静态类型系统，帮助团队在编码阶段发现接口、数据结构和重构风险。',
    officialUrl: 'https://www.typescriptlang.org/',
  },
  react: {
    intro: 'React 通过组件、状态和声明式渲染组织界面，适合构建交互复杂、状态变化频繁的前端应用。',
    officialUrl: 'https://react.dev/',
  },
  engineering: {
    intro: '工程化关注构建、测试、规范、部署和性能等协作基础，让前端项目在规模变大后仍然可维护。',
    officialUrl: 'https://vite.dev/',
  },
  langchain: {
    intro: 'LangChain.js 是构建 LLM 应用的开源框架，提供模型调用、提示模板、链式调用、RAG 检索增强生成等核心能力，帮助开发者快速搭建智能应用。',
    officialUrl: 'https://js.langchain.com/',
  },
  'element-plus': {
    intro: 'Element Plus 是基于 Vue 3 的组件库，提供丰富的表单、表格、弹窗等企业级组件，帮助快速搭建中后台界面。',
    officialUrl: 'https://element-plus.org/',
  },
  nuxt: {
    intro: 'Nuxt 是基于 Vue 3 的全栈框架，内置文件路由、自动导入、SSR/SSG、服务端 API 等能力，让 Vue 项目从单页应用升级为全栈应用。',
    officialUrl: 'https://nuxt.com/',
  },
}

const isSidebarTemporarilyExpanded = ref(false)
const lastKnownWidth = ref(0)
const lessonPageRef = ref<HTMLElement | null>(null)
const lessonSearchInput = useTemplateRef<HTMLInputElement>('lessonSearchInput')
const searchQuery = ref('')
const popoverVisible = ref<Record<string, boolean>>({})
const popoverPlacement = ref<Record<string, 'start' | 'center' | 'end'>>({})

function showPopover(id: string, event: Event) {
  const trigger = event.currentTarget as HTMLElement
  const rect = trigger.getBoundingClientRect()
  const panelWidth = Math.min(300, window.innerWidth - 24)
  const panelLeft = rect.left + rect.width / 2 - panelWidth / 2
  const panelRight = rect.left + rect.width / 2 + panelWidth / 2

  if (panelLeft < 12) {
    popoverPlacement.value[id] = 'start'
  } else if (panelRight > window.innerWidth - 12) {
    popoverPlacement.value[id] = 'end'
  } else {
    popoverPlacement.value[id] = 'center'
  }

  popoverVisible.value[id] = true
}

function hidePopover(id: string) {
  popoverVisible.value[id] = false
}

const activeKnowledge = computed(() => {
  const category = route.path.split('/').filter(Boolean)[0]
  return knowledgeCategories.some((item) => item.id === category) ? category : 'vue'
})

const activeCategoryName = computed(() => {
  return knowledgeCategories.find((category) => category.id === activeKnowledge.value)?.name ?? activeKnowledge.value
})

const filteredLessons = computed(() => {
  return lessons.filter((lesson) => lesson.path.startsWith(`/${activeKnowledge.value}/`))
})

const visibleLessons = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('zh-CN')

  if (!query) return filteredLessons.value

  return filteredLessons.value.filter((lesson) => {
    return [lesson.navTitle, lesson.title, lesson.category, lesson.summary]
      .some((value) => value.toLocaleLowerCase('zh-CN').includes(query))
  })
})

const currentLesson = computed(() => {
  if (route.path.startsWith('/vue/k-12/routing/')) {
    return lessons.find((lesson) => lesson.id === 'K_12') ?? lessons[0]
  }

  return lessons.find((lesson) => lesson.path === route.path) ?? lessons[0]
})

const {
  data: lessonCode,
  status: lessonCodeStatus,
  error: lessonCodeError,
} = await useAsyncData(
  () => `lesson-code-${currentLesson.value.id}`,
  () => currentLesson.value.code(),
  { watch: [() => currentLesson.value.id] },
)

const currentLessonIndex = computed(() => {
  return filteredLessons.value.findIndex((lesson) => lesson.id === currentLesson.value.id)
})

const previousLesson = computed(() => {
  return currentLessonIndex.value > 0 ? filteredLessons.value[currentLessonIndex.value - 1] : null
})

const nextLesson = computed(() => {
  const nextIndex = currentLessonIndex.value + 1
  return nextIndex > 0 && nextIndex < filteredLessons.value.length ? filteredLessons.value[nextIndex] : null
})

function getCategoryDetails(id: string) {
  const details = categoryDetails[id]
  return details ?? { intro: '', officialUrl: '' }
}

function formatLessonId(id: string) {
  return id.replace(/^[A-Z]_/, '🌰')
}

function toggleSidebar() {
  isSidebarTemporarilyExpanded.value = !isSidebarTemporarilyExpanded.value
}

function handleResize() {
  const newWidth = window.innerWidth
  if (newWidth !== lastKnownWidth.value) {
    isSidebarTemporarilyExpanded.value = false
  }
  lastKnownWidth.value = newWidth
}

async function handleGlobalKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]')

  if (event.key === '/' && !isTyping) {
    event.preventDefault()
    isSidebarTemporarilyExpanded.value = true
    await nextTick()
    lessonSearchInput.value?.focus()
  }
}

onMounted(() => {
  lastKnownWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('keydown', handleGlobalKeydown)
})

watch(activeKnowledge, () => {
  searchQuery.value = ''
})

watch(
  () => route.fullPath,
  async () => {
    isSidebarTemporarilyExpanded.value = false
    await nextTick()
    lessonPageRef.value?.scrollTo({ top: 0, left: 0 })
    lessonPageRef.value?.focus({ preventScroll: true })
  },
)

useHead(() => ({
  title: `${currentLesson.value.navTitle} - 小松鼠举栗子`,
}))

useSeoMeta({
  description: () => currentLesson.value.summary,
  ogTitle: () => `${currentLesson.value.title} - 小松鼠举栗子`,
  ogDescription: () => currentLesson.value.summary,
  ogType: 'article',
  twitterCard: 'summary',
})
</script>

<template>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <div class="app-frame">
    <header class="top-nav">
      <NuxtLink class="top-brand" to="/vue" aria-label="回到 Vue3 学习首页">
        <img class="brand-avatar" :src="squirrelHero" alt="小松鼠举着栗子" />
        <div>
          <strong>小松鼠举栗子</strong>
          <span >gzx_miller@foxmail.com</span>
        </div>
      </NuxtLink>

      <nav class="knowledge-tabs" aria-label="知识类别导航">
        <div
          v-for="item in knowledgeCategories"
          :key="item.id"
          class="knowledge-tab-wrapper"
        >
          <NuxtLink
            :to="item.status === 'ready' ? item.path : '/vue'"
            class="knowledge-tab"
            :class="{ active: item.id === activeKnowledge, planned: item.status === 'planned' }"
            :aria-disabled="item.status === 'planned'"
            :aria-current="item.id === activeKnowledge ? 'page' : undefined"
            @mouseenter="showPopover(item.id, $event)"
            @mouseleave="hidePopover(item.id)"
            @focus="showPopover(item.id, $event)"
            @blur="hidePopover(item.id)"
          >
            <span>{{ item.name }}</span>
            <small v-if="item.status === 'planned'">规划中</small>
          </NuxtLink>
          <Transition name="fade">
            <div
              v-if="popoverVisible[item.id]"
              class="popover-panel"
              :class="`popover-panel-${popoverPlacement[item.id] ?? 'center'}`"
              role="tooltip"
            >
              <p class="popover-intro">{{ item.intro || getCategoryDetails(item.id).intro }}</p>
            </div>
          </Transition>
        </div>
      </nav>
    </header>

    <div class="app-shell" :class="{ 'sidebar-expanded': isSidebarTemporarilyExpanded }">
      <aside class="sidebar" :class="{ 'sidebar-temporarily-expanded': isSidebarTemporarilyExpanded }" :aria-label="`${activeCategoryName} 知识点导航`">
        <div class="sidebar-heading">
          <button
            class="sidebar-toggle"
            :class="{ expanded: isSidebarTemporarilyExpanded }"
            @click="toggleSidebar"
            :aria-label="isSidebarTemporarilyExpanded ? '收起侧边栏' : '展开侧边栏'"
          >
            <span class="toggle-icon" aria-hidden="true"></span>
            <strong v-if="isSidebarTemporarilyExpanded" class="sidebar-toggle-label">
              {{ activeCategoryName }}
            </strong>
          </button>
          <label v-if="isSidebarTemporarilyExpanded" class="lesson-search">
            <span class="sr-only">搜索当前分类课程</span>
            <input
              ref="lessonSearchInput"
              v-model="searchQuery"
              type="search"
              placeholder="搜索课程…"
              autocomplete="off"
            />
            <kbd>/</kbd>
          </label>
        </div>

        <nav class="lesson-nav">
          <NuxtLink
            v-for="lesson in visibleLessons"
            :key="lesson.id"
            :to="lesson.path"
            class="lesson-link"
            :class="{ active: lesson.id === currentLesson.id }"
            :aria-label="`${formatLessonId(lesson.id)} ${lesson.navTitle}`"
            :aria-current="lesson.id === currentLesson.id ? 'page' : undefined"
            :title="lesson.navTitle"
          >
            <span>{{ formatLessonId(lesson.id) }}</span>
            <strong>{{ lesson.navTitle }}</strong>
          </NuxtLink>
          <p v-if="visibleLessons.length === 0" class="lesson-empty">没有匹配的课程</p>
        </nav>
      </aside>

      <main
        ref="lessonPageRef"
        id="main-content"
        class="lesson-page"
        tabindex="-1"
      >
        <nav class="breadcrumb" aria-label="面包屑">
          <NuxtLink :to="`/${activeKnowledge}`">{{ activeCategoryName }}</NuxtLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ currentLesson.navTitle }}</span>
          <small>{{ currentLessonIndex + 1 }} / {{ filteredLessons.length }}</small>
        </nav>
        <header class="lesson-header">
          <div class="lesson-copy">
            <p class="eyebrow">{{ formatLessonId(currentLesson.id) }} · {{ currentLesson.category }}</p>
            <h1>{{ currentLesson.title }}</h1>
            <p>{{ currentLesson.summary }}</p>
          </div>
        </header>

        <section class="lesson-section">
          <h2>案例演示</h2>
          <ClientOnly>
            <component :is="currentLesson.demo" />
            <template #fallback>
              <div class="demo-card">案例交互加载中...</div>
            </template>
          </ClientOnly>
        </section>

        <section class="lesson-section">
          <h2>关键代码</h2>
          <CodeBlock
            v-if="lessonCode"
            :code="lessonCode"
            :language="currentLesson.language"
          />
          <div v-else-if="lessonCodeStatus === 'pending'" class="code-loading" role="status">
            正在加载当前案例源码…
          </div>
          <div v-else class="code-loading code-loading-error" role="alert">
            源码加载失败，请刷新后重试。{{ lessonCodeError?.message }}
          </div>
        </section>

        <section class="lesson-details">
          <article v-if="currentLesson.principle">
            <h2>原理</h2>
            <p>{{ currentLesson.principle }}</p>
          </article>
          <article v-if="currentLesson.flow.length">
            <h2>处理流程</h2>
            <ol>
              <li v-for="step in currentLesson.flow" :key="step">{{ step }}</li>
            </ol>
          </article>
          <article v-if="currentLesson.notes.length">
            <h2>注意事项</h2>
            <ul>
              <li v-for="note in currentLesson.notes" :key="note">{{ note }}</li>
            </ul>
          </article>
          <article v-if="currentLesson.problem">
            <h2>解决的问题</h2>
            <p>{{ currentLesson.problem }}</p>
          </article>
        </section>
        <nav class="lesson-next" aria-label="下一章节">
          <div class="bottom-nav-row">
            <a
              v-if="getCategoryDetails(activeKnowledge).officialUrl"
              :href="getCategoryDetails(activeKnowledge).officialUrl"
              target="_blank"
              rel="noopener"
              class="official-link"
            >
              {{ getCategoryDetails(activeKnowledge).intro?.includes('Element') ? 'Element Plus 官网' : `${activeKnowledge.charAt(0).toUpperCase() + activeKnowledge.slice(1)} 官网` }} →
            </a>
            <div class="lesson-pager">
              <NuxtLink v-if="previousLesson" class="previous-lesson-link" :to="previousLesson.path">
                <span>上一颗</span>
                <strong>{{ formatLessonId(previousLesson.id) }} {{ previousLesson.navTitle }}</strong>
              </NuxtLink>
              <NuxtLink v-if="nextLesson" class="next-lesson-link" :to="nextLesson.path">
                <span>下一颗</span>
                <strong>{{ formatLessonId(nextLesson.id) }} {{ nextLesson.navTitle }}</strong>
              </NuxtLink>
              <span v-else class="category-complete">✓ 本分类已学完</span>
            </div>
          </div>
        </nav>
      </main>
    </div>
  </div>
</template>
