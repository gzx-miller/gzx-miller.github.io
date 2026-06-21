<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import squirrelHero from '../assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories, lessons, type Lesson } from '../data/lessons'
import CodeBlock from './CodeBlock.vue'

const route = useRoute()

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

const activeCategory = computed(() => knowledgeCategories.find((category) => category.id === activeKnowledge.value))
const activeCategoryName = computed(() => activeCategory.value?.name ?? activeKnowledge.value)

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

const lessonGroups = computed(() => {
  const groups = new Map<string, Lesson[]>()

  for (const lesson of visibleLessons.value) {
    const group = groups.get(lesson.category) ?? []
    group.push(lesson)
    groups.set(lesson.category, group)
  }

  return Array.from(groups, ([title, groupLessons]) => ({ title, lessons: groupLessons }))
})

function getLessonGroupIndex(lessonId: string): number {
  let offset = 0
  for (const group of lessonGroups.value) {
    const idx = group.lessons.findIndex((l) => l.id === lessonId)
    if (idx !== -1) return offset + idx
    offset += group.lessons.length
  }
  return 0
}

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

function formatLessonId(index: number) {
  return `🌰${index + 1}`
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
              <p class="popover-intro">{{ item.intro }}</p>
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
          <section v-for="group in lessonGroups" :key="group.title" class="lesson-group">
            <h2 class="lesson-group-title">{{ group.title }}</h2>
            <NuxtLink
              v-for="lesson in group.lessons"
              :key="lesson.id"
              :to="lesson.path"
              class="lesson-link"
              :class="{ active: lesson.id === currentLesson.id }"
              :aria-label="`${formatLessonId(getLessonGroupIndex(lesson.id))} ${lesson.navTitle}`"
              :aria-current="lesson.id === currentLesson.id ? 'page' : undefined"
              :title="lesson.navTitle"
            >
              <span>{{ formatLessonId(getLessonGroupIndex(lesson.id)) }}</span>
              <strong>{{ lesson.navTitle }}</strong>
            </NuxtLink>
          </section>
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
            <p class="eyebrow">{{ formatLessonId(getLessonGroupIndex(currentLesson.id)) }} · {{ currentLesson.category }}</p>
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
              v-if="activeCategory?.officialUrl"
              :href="activeCategory.officialUrl"
              target="_blank"
              rel="noopener"
              class="official-link"
            >
              {{ activeCategoryName }} 官网 →
            </a>
            <div class="lesson-pager">
              <NuxtLink v-if="previousLesson" class="previous-lesson-link" :to="previousLesson.path">
                <span>上一颗</span>
                <strong>{{ formatLessonId(getLessonGroupIndex(previousLesson.id)) }} {{ previousLesson.navTitle }}</strong>
              </NuxtLink>
              <NuxtLink v-if="nextLesson" class="next-lesson-link" :to="nextLesson.path">
                <span>下一颗</span>
                <strong>{{ formatLessonId(getLessonGroupIndex(nextLesson.id)) }} {{ nextLesson.navTitle }}</strong>
              </NuxtLink>
              <span v-else class="category-complete">✓ 本分类已学完</span>
            </div>
          </div>
        </nav>
      </main>
    </div>
  </div>
</template>
