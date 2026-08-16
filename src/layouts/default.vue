<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useLessonNavigation } from '../composables/useLessonNavigation'

const {
  activeCategoryName,
  allLessonGroups,
  currentLesson,
  getLessonGroupIndex,
  formatLessonId,
} = useLessonNavigation()

const isSidebarTemporarilyExpanded = useState('sidebarExpanded', () => true)
const lessonSearchInput = useTemplateRef<HTMLInputElement>('lessonSearchInput')
const searchQuery = ref('')

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

function toggleSidebar() {
  isSidebarTemporarilyExpanded.value = !isSidebarTemporarilyExpanded.value
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
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <a class="skip-link" href="#main-content">跳到正文</a>
  <div class="app-frame">
    <SiteHeader />

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

    <SiteFooter />
  </div>
</template>
