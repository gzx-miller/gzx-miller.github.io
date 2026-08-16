<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const visible = ref(false)
let scrollEl: HTMLElement | null = null
let rafId = 0

// 页面内容在 <main> 内滚动（.lesson-page / .home-page），返回顶部作用于该容器
function bindScrollTarget() {
  scrollEl = document.querySelector<HTMLElement>('main#main-content')
}

function updateVisibility() {
  if (!scrollEl) return
  visible.value = scrollEl.scrollTop > 360
}

function onScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    updateVisibility()
  })
}

function scrollToTop() {
  if (!scrollEl) return
  scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
}

const route = useRoute()
watch(() => route.fullPath, () => {
  bindScrollTarget()
  updateVisibility()
})

onMounted(() => {
  bindScrollTarget()
  updateVisibility()
  document.addEventListener('scroll', onScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('scroll', onScroll, true)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      class="scroll-top-btn"
      type="button"
      aria-label="回到顶部"
      title="回到顶部"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
      </svg>
    </button>
  </Transition>
</template>
