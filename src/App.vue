<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAssistantBus } from './composables/useAssistantBus'

const { requestOpen } = useAssistantBus()

/**
 * 松鼠小助手拆成两层：
 *  - SquirrelPet：轻量壳层，同步渲染，只画 SVG 松鼠与处理拖拽爬动；
 *  - SquirrelAssistant：重量层（marked + dompurify + highlight.js 语言包
 *    与整个对话面板，合计约 118KB），只有用户真正点击松鼠时才动态加载。
 *
 * 其余三个悬浮挂件（返回顶部、宝箱、刺猬）同属装饰性内容，不参与首屏信息
 * 呈现，统一延后到浏览器空闲时挂载，把首屏带宽与主线程让给正文。
 * 注意：延后挂载的组件是客户端专属行为，用 v-if 隔开后不会出现在 SSR 输出里。
 */
const SquirrelAssistant = defineAsyncComponent(() => import('./components/SquirrelAssistant.vue'))

const isReady = ref(false)

onMounted(() => {
  // 用户在空闲回调触发前就点了松鼠，立刻加载，不让他等
  const stopWatch = watch(requestOpen, (requested) => {
    if (requested) {
      isReady.value = true
      stopWatch()
    }
  })

  // 用户已经点过（极少数：壳层先于本回调挂载）则直接加载
  if (requestOpen.value) isReady.value = true

  let idleHandle: number
  if (typeof window.requestIdleCallback === 'function') {
    idleHandle = window.requestIdleCallback(() => { isReady.value = true }, { timeout: 2500 })
  } else {
    idleHandle = window.setTimeout(() => { isReady.value = true }, 1200)
  }

  onUnmounted(() => {
    stopWatch()
    if (typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleHandle)
    } else {
      window.clearTimeout(idleHandle)
    }
  })
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <SquirrelPet />

  <template v-if="isReady">
    <SquirrelAssistant />
    <ScrollTopButton />
    <TreasureChest />
    <GardenHedgehog />
  </template>
</template>
