<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import squirrelHero from '../assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories, lessons } from '../data/lessons'
import CodeBlock from './CodeBlock.vue'
import { useTheme } from '../composables/useTheme'
import { createLessonOrderMap, flattenLessonGroups, groupLessons } from '../utils/lessonNavigation'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()

const isSidebarTemporarilyExpanded = useState('sidebarExpanded', () => true)
const lessonPageRef = ref<HTMLElement | null>(null)
const lessonSearchInput = useTemplateRef<HTMLInputElement>('lessonSearchInput')
const searchQuery = ref('')
const popoverVisible = ref<Record<string, boolean>>({})
const popoverPlacement = ref<Record<string, 'start' | 'center' | 'end'>>({})
const tabsRowRef = useTemplateRef<HTMLElement>('tabsRow')
const visibleCount = ref(knowledgeCategories.length)
const moreDropdownVisible = ref(false)
let moreDropdownCloseTimer: ReturnType<typeof setTimeout> | undefined

const visibleCategories = computed(() => knowledgeCategories.slice(0, visibleCount.value))
const overflowCategories = computed(() => knowledgeCategories.slice(visibleCount.value))
const activeOverflowCategory = computed(() => {
  return overflowCategories.value.find((category) => category.id === activeKnowledge.value)
})
const moreButtonLabel = computed(() => activeOverflowCategory.value?.name ?? '更多')

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

function handleMoreFocusOut(event: FocusEvent) {
  const wrapper = event.currentTarget as HTMLElement
  const nextTarget = event.relatedTarget as Node | null

  if (!nextTarget || !wrapper.contains(nextTarget)) {
    moreDropdownVisible.value = false
  }
}

function openMoreDropdown() {
  if (moreDropdownCloseTimer) clearTimeout(moreDropdownCloseTimer)
  moreDropdownCloseTimer = undefined
  moreDropdownVisible.value = true
}

function scheduleMoreDropdownClose() {
  if (moreDropdownCloseTimer) clearTimeout(moreDropdownCloseTimer)
  moreDropdownCloseTimer = setTimeout(() => {
    moreDropdownVisible.value = false
    moreDropdownCloseTimer = undefined
  }, 100)
}

function toggleMoreDropdown() {
  if (moreDropdownCloseTimer) clearTimeout(moreDropdownCloseTimer)
  moreDropdownCloseTimer = undefined
  moreDropdownVisible.value = !moreDropdownVisible.value
}

async function openMoreMenuAndFocus() {
  openMoreDropdown()
  await nextTick()
  tabsRowRef.value?.querySelector<HTMLElement>('.more-dropdown-item')?.focus()
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

const allLessonGroups = computed(() => groupLessons(filteredLessons.value))
const orderedLessons = computed(() => flattenLessonGroups(allLessonGroups.value))
const lessonOrderMap = computed(() => createLessonOrderMap(orderedLessons.value))

const lessonGroups = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('zh-CN')

  if (!query) return allLessonGroups.value

  return allLessonGroups.value
    .map((group) => ({
      ...group,
      lessons: group.lessons.filter((lesson) => {
        return [lesson.navTitle, lesson.title, lesson.category, lesson.summary]
          .some((value) => value.toLocaleLowerCase('zh-CN').includes(query))
      }),
    }))
    .filter((group) => group.lessons.length > 0)
})

function getLessonGroupIndex(lessonId: string): number {
  return lessonOrderMap.value.get(lessonId) ?? 0
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
  return orderedLessons.value.findIndex((lesson) => lesson.id === currentLesson.value.id)
})
const lessonProgress = computed(() => {
  if (currentLessonIndex.value < 0 || orderedLessons.value.length === 0) return 0
  return Math.round(((currentLessonIndex.value + 1) / orderedLessons.value.length) * 100)
})

const previousLesson = computed(() => {
  return currentLessonIndex.value > 0 ? orderedLessons.value[currentLessonIndex.value - 1] : null
})

const nextLesson = computed(() => {
  const nextIndex = currentLessonIndex.value + 1
  return nextIndex > 0 && nextIndex < orderedLessons.value.length ? orderedLessons.value[nextIndex] : null
})

function formatLessonId(index: number) {
  return `🌰${index + 1}`
}

function toggleSidebar() {
  isSidebarTemporarilyExpanded.value = !isSidebarTemporarilyExpanded.value
}

async function calculateOverflow() {
  await nextTick()
  const container = tabsRowRef.value
  if (!container) return

  // 先显示全部以获取真实宽度
  visibleCount.value = knowledgeCategories.length
  await nextTick()

  const nav = container.querySelector('.knowledge-tabs') as HTMLElement | null
  if (!nav) return

  const containerWidth = container.clientWidth
  const items = nav.querySelectorAll('.knowledge-tab-wrapper')
  const activeCategoryIndex = knowledgeCategories.findIndex((category) => category.id === activeKnowledge.value)
  const activeTabWidth = activeCategoryIndex >= 0
    ? (items[activeCategoryIndex] as HTMLElement | undefined)?.offsetWidth ?? 0
    : 0

  let totalWidth = 0
  let count = 0

  for (const [index, item] of Array.from(items).entries()) {
    const itemWidth = (item as HTMLElement).offsetWidth + 8 // 8px = gap
    const nextCount = index + 1
    const hasOverflow = nextCount < knowledgeCategories.length
    const activeCategoryWillOverflow = activeCategoryIndex >= nextCount
    const moreBtnWidth = hasOverflow
      ? activeCategoryWillOverflow ? Math.max(80, activeTabWidth + 18) : 80
      : 0

    if (totalWidth + itemWidth + moreBtnWidth <= containerWidth) {
      totalWidth += itemWidth
      count++
    } else {
      break
    }
  }

  // 至少显示一个，如果全部都放得下则不显示"更多"
  visibleCount.value = count >= knowledgeCategories.length ? knowledgeCategories.length : Math.max(1, count)
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

  if (event.key === 'Escape') {
    if (isSidebarTemporarilyExpanded.value) {
      isSidebarTemporarilyExpanded.value = false
      lessonSearchInput.value?.blur()
    }
    moreDropdownVisible.value = false
  }
}

function handleResize() {
  calculateOverflow()
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', handleResize)
  calculateOverflow()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', handleResize)
  if (moreDropdownCloseTimer) clearTimeout(moreDropdownCloseTimer)
})

watch(activeKnowledge, () => {
  searchQuery.value = ''
  calculateOverflow()
})

watch(
  () => route.fullPath,
  async () => {
    moreDropdownVisible.value = false
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
      <div class="top-bar">
        <NuxtLink class="top-brand" to="/vue" aria-label="回到 Vue3 学习首页">
          <img class="brand-avatar" :src="squirrelHero" alt="小松鼠举着栗子" />
          <div>
            <strong>小松鼠举栗子</strong>
            <span >gzx_miller@foxmail.com</span>
          </div>
        </NuxtLink>
        <p class="site-intro">中文前端知识案例库 · 通过独立真实案例学习前端核心技术</p>
        <button
          class="theme-toggle"
          :aria-label="isDark ? '切换浅色主题' : '切换深色主题'"
          :title="isDark ? '切换浅色主题' : '切换深色主题'"
          @click="toggleTheme"
        >
          <Transition name="fade" mode="out-in">
            <svg v-if="isDark" key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </Transition>
        </button>
      </div>

      <div ref="tabsRow" class="tabs-row">
        <nav class="knowledge-tabs" aria-label="知识类别导航">
          <div
            v-for="item in visibleCategories"
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
        <div
          v-if="overflowCategories.length > 0"
          class="knowledge-more-wrapper"
          @mouseenter="openMoreDropdown"
          @mouseleave="scheduleMoreDropdownClose"
          @focusin="openMoreDropdown"
          @focusout="handleMoreFocusOut"
        >
          <button
            class="knowledge-more-btn"
            :class="{ active: activeOverflowCategory }"
            :aria-label="activeOverflowCategory ? `当前类别：${moreButtonLabel}，展开更多知识类别` : '展开更多知识类别'"
            aria-haspopup="menu"
            :aria-expanded="moreDropdownVisible"
            aria-controls="knowledge-more-menu"
            @click="toggleMoreDropdown"
            @keydown.down.prevent="openMoreMenuAndFocus"
          >
            <span>{{ moreButtonLabel }}</span>
            <span class="knowledge-more-chevron" aria-hidden="true">▾</span>
          </button>
          <Transition name="fade">
            <div v-if="moreDropdownVisible" id="knowledge-more-menu" class="more-dropdown" role="menu">
              <NuxtLink
                v-for="item in overflowCategories"
                :key="item.id"
                :to="item.status === 'ready' ? item.path : '/vue'"
                class="more-dropdown-item"
                role="menuitem"
                :class="{ active: item.id === activeKnowledge, planned: item.status === 'planned' }"
                :aria-disabled="item.status === 'planned'"
                :aria-current="item.id === activeKnowledge ? 'page' : undefined"
                @click="moreDropdownVisible = false"
              >
                {{ item.name }}
                <small v-if="item.status === 'planned'">规划中</small>
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </div>
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
          <p v-if="lessonGroups.length === 0" class="lesson-empty">没有匹配的课程</p>
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
          <small>{{ currentLessonIndex + 1 }} / {{ orderedLessons.length }}</small>
        </nav>
        <div
          class="lesson-progress"
          role="progressbar"
          :aria-label="`${activeCategoryName} 学习进度`"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="lessonProgress"
        >
          <span :style="{ width: `${lessonProgress}%` }"></span>
        </div>
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
