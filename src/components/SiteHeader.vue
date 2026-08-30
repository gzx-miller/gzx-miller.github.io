<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import squirrelHero from '../assets/squirrel-chestnut-avatar.webp'
import { knowledgeCategories } from '../data/lessons'
import { useTheme } from '../composables/useTheme'
import { useLessonNavigation } from '../composables/useLessonNavigation'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { activeKnowledge } = useLessonNavigation()

// ---------- 分类 Tab 溢出计算与弹出层 ----------
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

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
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
  <header class="top-nav">
    <div class="top-bar">
      <NuxtLink class="top-brand" to="/" no-prefetch aria-label="回到首页">
        <img class="brand-avatar" :src="squirrelHero" alt="小松鼠举着栗子" width="48" height="48" fetchpriority="high" />
        <div class="brand-text">
          <strong>小松鼠举栗子 </strong>
          <span class="brand-tagline">中文技术知识内容库</span>
        </div>
      </NuxtLink>
      <div class="site-intro-group">
        <p class="site-intro">记录与分享可复用的软件技术内容</p>
        <p class="site-stats">
          <span class="stat-pill">免费开源</span>
          <span class="stat-pill">持续更新</span>
        </p>
      </div>
      <div class="top-actions">
        <a class="contact-mail" href="mailto:gzx_miller@foxmail.com" title="给我发邮件">gzx_miller@foxmail.com</a>
        <a
          class="github-link"
          href="https://github.com/gzx-miller/gzx-miller.github.io"
          target="_blank"
          rel="noopener"
          aria-label="查看开源代码"
          title="查看开源代码"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
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
</template>
