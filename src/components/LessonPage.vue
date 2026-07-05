<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import CodeBlock from './CodeBlock.vue'
import { useLessonNavigation } from '../composables/useLessonNavigation'

const route = useRoute()
const {
  activeKnowledge,
  activeCategory,
  activeCategoryName,
  orderedLessons,
  currentLesson,
  getLessonGroupIndex,
  formatLessonId,
} = useLessonNavigation()

const lessonPageRef = ref<HTMLElement | null>(null)

const {
  data: lessonCode,
  status: lessonCodeStatus,
  error: lessonCodeError,
} = await useAsyncData(
  () => `lesson-code-${currentLesson.value.id}`,
  () => currentLesson.value.code ? currentLesson.value.code() : Promise.resolve(null),
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

// 路由切换时把正文滚动回顶部并聚焦，便于继续阅读。
watch(
  () => route.fullPath,
  async () => {
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
  <main
    ref="lessonPageRef"
    id="main-content"
    class="lesson-page"
    tabindex="-1"
  >
    <nav class="breadcrumb" aria-label="面包屑">
      <NuxtLink :to="`/${activeKnowledge}`" no-prefetch>{{ activeCategoryName }}</NuxtLink>
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

    <section v-if="currentLesson.demo" class="lesson-section">
      <h2>案例演示</h2>
      <ClientOnly>
        <component :is="currentLesson.demo" />
        <template #fallback>
          <div class="demo-card">案例交互加载中...</div>
        </template>
      </ClientOnly>
    </section>

    <section v-if="currentLesson.code" class="lesson-section">
      <h2>关键代码</h2>
      <CodeBlock
        v-if="lessonCode"
        :code="lessonCode"
        :language="currentLesson.language || 'typescript'"
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
      <article v-if="currentLesson.flow?.length">
        <h2>处理流程</h2>
        <ol>
          <li v-for="step in currentLesson.flow" :key="step">{{ step }}</li>
        </ol>
      </article>
      <article v-if="currentLesson.notes?.length">
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
</template>
