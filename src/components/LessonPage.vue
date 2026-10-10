<script setup lang="ts">
import { computed, h, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import CodeBlock from './CodeBlock.vue'
import { isCommentOnlySource } from '../data/code-quality'
import { useLessonNavigation } from '../composables/useLessonNavigation'
import { useLearningProgress } from '../composables/useLearningProgress'

const { markVisited } = useLearningProgress()

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

// 「关键代码」只在真正有代码时才出现。若源码去掉注释与空行后一行不剩
// （整段写成注释的要点 / 被整段注释掉的示例），直接隐藏该段落，
// 避免留下一个只有标题的「关键代码」空壳。
const showCodeSection = computed(
  () =>
    Boolean(currentLesson.value.code) &&
    !isCommentOnlySource(lessonCode.value, currentLesson.value.language),
)

// 正文渲染策略：
// - 课程带 demoComponent（静态导入的同步组件）时，直接同步渲染，SSG 阶段即可
//   连同嵌套的交互 demo 一起写入 HTML，首屏立刻有完整正文；
// - 旧数据只有 demo（defineAsyncComponent）时，退化为原来的 ClientOnly 方案。
const hasStaticDemo = computed(() => Boolean(currentLesson.value.demoComponent))
const demoVNode = shallowRef<any>(null)

/** 把 lesson.demoComponent + lesson.demoProps 渲染成 vnode（同步） */
function makeDemoVNode() {
  const lesson = currentLesson.value
  if (!lesson.demoComponent) {
    demoVNode.value = null
    return
  }
  demoVNode.value = h(lesson.demoComponent, lesson.demoProps ?? {})
}

// 用 watch(..., { immediate: true, flush: 'sync' }) 代替 computed：
// computed 在 SSR 渲染期间被读取后会保留缓存，而 vnode 被服务端渲染器
// 消费后会打上 vnode.el 标记，跨路由复用同一份缓存会触发水合异常。
// 每次渲染前同步重建 vnode，既保证正文首屏可用，也避免复用已渲染的 vnode。
watch(
  () => currentLesson.value.id,
  makeDemoVNode,
  { immediate: true, flush: 'sync' },
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
    // 记录本页已探索，供首页展示学习进度
    markVisited(currentLesson.value.path)
  },
)

onMounted(() => {
  markVisited(currentLesson.value.path)
})

// 估算阅读时长：把正文级文案（摘要/原理/流程/注意/解决的问题）按中文阅读速度
// 换算成分钟数；代码含量高的内容以 1 分钟起底，避免显示「0 分钟」。
const readingMinutes = computed(() => {
  const lesson = currentLesson.value
  const prose = [
    lesson.summary,
    lesson.principle,
    ...(lesson.flow ?? []),
    ...(lesson.notes ?? []),
    lesson.problem,
  ]
    .filter(Boolean)
    .join('')
  if (!prose) return 0
  return Math.max(1, Math.round(prose.length / 500))
})

const siteUrl = 'https://gzx-miller.github.io'

useHead(() => ({
  title: `${currentLesson.value.navTitle} - 小松鼠举栗子`,
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
  meta: [
    { name: 'og:image:alt', content: currentLesson.value.summary },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: activeCategoryName.value, item: `${siteUrl}/${activeKnowledge.value}` },
          { '@type': 'ListItem', position: 3, name: currentLesson.value.navTitle, item: `${siteUrl}${route.path}` },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: currentLesson.value.title,
        description: currentLesson.value.summary,
        url: `${siteUrl}${route.path}`,
        inLanguage: 'zh-CN',
        learningResourceType: 'CourseContent',
        about: {
          '@type': 'WebSite',
          name: activeCategoryName.value,
          url: `${siteUrl}/${activeKnowledge.value}`,
        },
        isPartOf: {
          '@type': 'WebSite',
          name: '小松鼠举栗子',
          url: `${siteUrl}/`,
        },
      }),
    },
  ],
}))

useSeoMeta({
  description: () => currentLesson.value.summary,
  ogTitle: () => `${currentLesson.value.title} - 小松鼠举栗子`,
  ogDescription: () => currentLesson.value.summary,
  ogType: 'article',
  ogImage: `${siteUrl}/og-image.jpg`,
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/og-image.jpg`,
})
</script>

<template>
  <main
    ref="lessonPageRef"
    id="main-content"
    class="lesson-page"
    :data-category="activeKnowledge"
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
        <p class="eyebrow">
          {{ formatLessonId(getLessonGroupIndex(currentLesson.id)) }} · {{ currentLesson.category }}
          <span v-if="readingMinutes" class="reading-time">约 {{ readingMinutes }} 分钟读完</span>
        </p>
        <h1>{{ currentLesson.title }}</h1>
        <p>{{ currentLesson.summary }}</p>
      </div>
    </header>

    <section v-if="currentLesson.demo || hasStaticDemo" class="lesson-section lesson-demo">
      <component :is="demoVNode" v-if="hasStaticDemo" />
      <ClientOnly v-else>
        <component :is="currentLesson.demo" />
        <template #fallback>
          <div class="demo-card">内容交互加载中...</div>
        </template>
      </ClientOnly>
    </section>

    <section v-if="showCodeSection" class="lesson-section">
      <h2>关键代码</h2>
      <!-- 源码与正文同时到达，这里始终保留与代码块同高的骨架，
           避免「正文已铺开、代码块后弹出」造成的高度跳变。 -->
      <div v-if="lessonCodeStatus === 'pending'" class="code-skeleton" role="status" aria-live="polite">
        <span class="sr-only">正在加载关键代码…</span>
        <div class="code-skeleton-toolbar" aria-hidden="true">
          <span class="code-skeleton-pill" style="width: 52px"></span>
          <span class="code-skeleton-pill" style="width: 64px"></span>
        </div>
        <div class="code-skeleton-body" aria-hidden="true">
          <span v-for="line in 10" :key="line" class="code-skeleton-line" :style="{ width: `${88 - (line * 7) % 46}%` }"></span>
        </div>
      </div>
      <CodeBlock
        v-else-if="lessonCode"
        :code="lessonCode"
        :language="currentLesson.language || 'typescript'"
      />
      <div v-else class="code-loading code-loading-error" role="alert">
        源码加载失败，请刷新后重试。{{ lessonCodeError?.message }}
      </div>
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
          <NuxtLink v-if="previousLesson" prefetch class="previous-lesson-link" :to="previousLesson.path">
            <span>上一颗</span>
            <strong>{{ formatLessonId(getLessonGroupIndex(previousLesson.id)) }} {{ previousLesson.navTitle }}</strong>
          </NuxtLink>
          <NuxtLink v-if="nextLesson" prefetch class="next-lesson-link" :to="nextLesson.path">
            <span>下一颗</span>
            <strong>{{ formatLessonId(getLessonGroupIndex(nextLesson.id)) }} {{ nextLesson.navTitle }}</strong>
          </NuxtLink>
          <span v-else class="category-complete">✓ 本分类已学完</span>
        </div>
      </div>
    </nav>
  </main>
</template>
