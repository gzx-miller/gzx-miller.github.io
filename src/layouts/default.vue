<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import squirrelHero from '../assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories } from '../data/lessons'
import { useTheme } from '../composables/useTheme'
import { useLessonNavigation } from '../composables/useLessonNavigation'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const {
  activeKnowledge,
  activeCategoryName,
  filteredLessons,
  allLessonGroups,
  currentLesson,
  getLessonGroupIndex,
  formatLessonId,
} = useLessonNavigation()

const readyCategoryCount = computed(() => knowledgeCategories.filter((c) => c.status === 'ready').length)
// 使用当前分类的课程数（动态加载，性能更优）
const totalLessonCount = computed(() => {
  return filteredLessons.value.length
})

const isSidebarTemporarilyExpanded = useState('sidebarExpanded', () => true)
const lessonSearchInput = useTemplateRef<HTMLInputElement>('lessonSearchInput')
const searchQuery = ref('')
const popoverVisible = ref<Record<string, boolean>>({})
const popoverPlacement = ref<Record<string, 'start' | 'center' | 'end'>>({})
const tabsRowRef = useTemplateRef<HTMLElement>('tabsRow')
const visibleCount = ref(knowledgeCategories.length)
const moreDropdownVisible = ref(false)
let moreDropdownCloseTimer: ReturnType<typeof setTimeout> | undefined
let tabsRowResizeObserver: ResizeObserver | undefined
let overflowRafId: number | undefined
let overflowScheduled = false

// 与 CSS 中 .knowledge-more-btn 的 max-width 保持一致，预留固定空间
// 避免活动分类名称过长时“更多”按钮被挤出视口
const MORE_BUTTON_MAX_WIDTH = 140

const visibleCategories = computed(() => knowledgeCategories.slice(0, visibleCount.value))
const overflowCategories = computed(() => knowledgeCategories.slice(visibleCount.value))
const activeOverflowCategory = computed(() => {
  return overflowCategories.value.find((category) => category.id === activeKnowledge.value)
})
const moreButtonLabel = computed(() => activeOverflowCategory.value?.name ?? '更多')

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

function toggleSidebar() {
  isSidebarTemporarilyExpanded.value = !isSidebarTemporarilyExpanded.value
}

// 用 requestAnimationFrame 把多次 resize 事件合并为每帧一次。
// 既能保证窗口连续缩窄时持续重算，又避免在单帧内重复触发 DOM 写入。
function scheduleOverflow() {
  if (overflowScheduled) return
  overflowScheduled = true
  overflowRafId = requestAnimationFrame(() => {
    overflowScheduled = false
    overflowRafId = undefined
    void calculateOverflow()
  })
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
  const navGap = parseFloat(getComputedStyle(nav).gap) || 8
  const tabsRowGap = parseFloat(getComputedStyle(container).gap) || 8

  // 固定预留“更多”按钮宽度。CSS 已将其最大宽度限制为 140px，
  // 因此无论按钮标签是“更多”还是活动分类名称，都不会超出此空间。
  const moreBtnWidth = MORE_BUTTON_MAX_WIDTH

  // 分类导航实际可用的宽度 = tabs-row 宽度 - “更多”按钮宽度 - 两者之间的 gap
  const availableNavWidth = containerWidth - moreBtnWidth - tabsRowGap

  let navWidth = 0
  let count = 0

  for (const [index, item] of Array.from(items).entries()) {
    const itemWidth = (item as HTMLElement).offsetWidth
    const newNavWidth = navWidth + itemWidth + (index > 0 ? navGap : 0)

    if (newNavWidth <= availableNavWidth) {
      navWidth = newNavWidth
      count = index + 1
    } else {
      break
    }
  }

  // 全部放得下 → 不需要"更多"按钮
  if (count >= knowledgeCategories.length) {
    visibleCount.value = knowledgeCategories.length
  } else {
    // 至少尝试显示 1 个 tab；如果连 1 个都放不下（极窄宽度），
    // 则显示 0 个，所有类别收入"更多"下拉菜单
    visibleCount.value = Math.max(0, count)
  }
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
  scheduleOverflow()
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', handleResize)
  scheduleOverflow()

  if (typeof ResizeObserver !== 'undefined' && tabsRowRef.value) {
    tabsRowResizeObserver = new ResizeObserver(() => {
      scheduleOverflow()
    })
    tabsRowResizeObserver.observe(tabsRowRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', handleResize)
  if (moreDropdownCloseTimer) clearTimeout(moreDropdownCloseTimer)
  if (tabsRowResizeObserver) {
    tabsRowResizeObserver.disconnect()
    tabsRowResizeObserver = undefined
  }
  if (overflowRafId !== undefined) {
    cancelAnimationFrame(overflowRafId)
    overflowRafId = undefined
    overflowScheduled = false
  }
})

watch(activeKnowledge, () => {
  searchQuery.value = ''
  scheduleOverflow()
})

// 路由切换时关闭"更多"下拉，避免残留。滚动复位由 page 自行处理。
watch(
  () => route.fullPath,
  () => {
    moreDropdownVisible.value = false
  },
)
</script>

<template>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <div class="app-frame">
    <header class="top-nav">
      <div class="top-bar">
        <NuxtLink class="top-brand" to="/vue" no-prefetch aria-label="回到 Vue3 学习首页">
          <img class="brand-avatar" :src="squirrelHero" alt="小松鼠举着栗子" width="48" height="48" fetchpriority="high" />
          <div class="brand-text">
            <strong>小松鼠举栗子 </strong>
            <span class="brand-tagline">gzx_miller@foxmail.com </span>
          </div>
        </NuxtLink>
        <div class="site-intro-group">
          <p class="site-intro">通过独立真实案例学习前端核心技术</p>
          <p class="site-stats">
            <span class="stat-pill">{{ readyCategoryCount }} 大知识分类</span>
            <span class="stat-pill">400+栗子</span>
          </p>
        </div>
        <button
          class="theme-toggle"
          :aria-label="isDark ? '切换浅色主题' : '切换深色主题'"
          :title="isDark ? '切换浅色主题' : '切换深色主题'"
          @click="toggleTheme"
        >
          <Transition name="fade" mode="out-in">
            <svg v-if="isDark" key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg v-else key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
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
              no-prefetch
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
            <svg class="knowledge-more-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <Transition name="fade">
            <div v-if="moreDropdownVisible" id="knowledge-more-menu" class="more-dropdown" role="menu">
              <NuxtLink
                v-for="item in overflowCategories"
                :key="item.id"
                :to="item.status === 'ready' ? item.path : '/vue'"
                no-prefetch
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
      <!-- 进度条轨道：绝对定位悬浮在顶部导航下边缘，不占布局空间 -->
      <div class="nprogress-rail" aria-hidden="true"></div>
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

      <slot />
    </div>
  </div>
</template>
