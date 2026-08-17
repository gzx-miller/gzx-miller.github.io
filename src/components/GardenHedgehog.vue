<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useCritterGarden } from '../composables/useCritterGarden'

const garden = useCritterGarden()

const HOG_W = 62
const HOG_H = 46

const dragging = ref(false)
const crawling = ref(false)
const pinned = ref(false)
const hogRef = useTemplateRef<HTMLButtonElement>('hogRef')

let wanderTimer = 0
let crawlEndTimer = 0
let pollTimer = 0
let dragMoved = false
let startX = 0
let startY = 0
let originX = 0
let originY = 0

// 客户端初始化默认落在屏幕左侧中部（SSR 期间不访问 window）
if (import.meta.client && garden.hedgehogPos.value.x < 0) {
  garden.hedgehogPos.value = { x: 26, y: Math.round(window.innerHeight * 0.42) }
}

const hogStyle = computed(() => ({
  left: `${garden.hedgehogPos.value.x}px`,
  top: `${garden.hedgehogPos.value.y}px`,
}))

function clampPos(x: number, y: number) {
  const maxX = Math.max(8, window.innerWidth - HOG_W - 8)
  const maxY = Math.max(104, window.innerHeight - HOG_H - 10)
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(104, y), maxY),
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function onHogPointerDown(event: PointerEvent) {
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  startX = event.clientX
  startY = event.clientY
  originX = garden.hedgehogPos.value.x
  originY = garden.hedgehogPos.value.y
  dragMoved = false
  dragging.value = true
  pinned.value = true
  window.clearTimeout(wanderTimer)
  window.clearTimeout(crawlEndTimer)
  crawling.value = false
  garden.hedgehogMode.value = 'drag'
}

function onHogPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  if (Math.abs(dx) + Math.abs(dy) > 6) dragMoved = true
  garden.hedgehogPos.value = clampPos(originX + dx, originY + dy)
}

function onHogPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  garden.hedgehogMode.value = 'idle'
  if (!dragMoved && !prefersReducedMotion()) wiggle()
}

function wiggle() {
  hogRef.value?.animate(
    [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-6deg)' },
      { transform: 'rotate(6deg)' },
      { transform: 'rotate(0deg)' },
    ],
    { duration: 460, easing: 'ease-in-out' },
  )
}

function scheduleWander() {
  window.clearTimeout(wanderTimer)
  wanderTimer = window.setTimeout(startCrawl, 6000 + Math.random() * 5000)
}

function startCrawl() {
  if (pinned.value || dragging.value || document.hidden || prefersReducedMotion()) {
    scheduleWander()
    return
  }
  const dy = (60 + Math.random() * 120) * (Math.random() > 0.5 ? 1 : -1)
  const target = clampPos(garden.hedgehogPos.value.x, garden.hedgehogPos.value.y + dy)
  crawling.value = true
  garden.hedgehogMode.value = 'crawl'
  garden.hedgehogPos.value = target
  window.clearTimeout(crawlEndTimer)
  crawlEndTimer = window.setTimeout(() => {
    crawling.value = false
    garden.hedgehogMode.value = 'idle'
    scheduleWander()
  }, 2400)
}

/** 圆形碰撞判定：两个矩形取内切圆，中心距小于半径和即碰撞 */
function circlesOverlap(a: DOMRect, b: DOMRect, slack: number) {
  const ax = a.left + a.width / 2
  const ay = a.top + a.height / 2
  const bx = b.left + b.width / 2
  const by = b.top + b.height / 2
  const ra = Math.min(a.width, a.height) / 2
  const rb = Math.min(b.width, b.height) / 2
  return Math.hypot(ax - bx, ay - by) < ra + rb - slack
}

onMounted(() => {
  garden.hedgehogPos.value = clampPos(garden.hedgehogPos.value.x, garden.hedgehogPos.value.y)
  scheduleWander()
  // 碰撞轮询：扎到松鼠让TA跳开，宝物经过会被粘到刺上
  pollTimer = window.setInterval(() => {
    const hog = hogRef.value
    if (!hog || dragging.value) return
    const hr = hog.getBoundingClientRect()
    const hc = { x: hr.left + hr.width / 2, y: hr.top + hr.height / 2 }
    const squirrel = garden.getSquirrel()
    if (squirrel) {
      const r = squirrel.getRect()
      if (r && circlesOverlap(hr, r, 6)) squirrel.onPrick(hc)
    }
    garden.forEachCollectible((sub) => {
      const r = sub.getRect()
      if (r && circlesOverlap(hr, r, -2)) sub.onStick(hc)
    })
  }, 320)
})

onUnmounted(() => {
  window.clearTimeout(wanderTimer)
  window.clearTimeout(crawlEndTimer)
  window.clearInterval(pollTimer)
})
</script>

<template>
  <ClientOnly>
    <button
      ref="hogRef"
      type="button"
      class="garden-hedgehog"
      :class="{ dragging, crawling }"
      :style="hogStyle"
      aria-label="小刺猬：浑身是刺，可以拖拽移动"
      title="小刺猬"
      @pointerdown="onHogPointerDown"
      @pointermove="onHogPointerMove"
      @pointerup="onHogPointerUp"
      @pointercancel="onHogPointerUp"
    >
      <span class="hog-flip">
        <span class="hog-wobble">
          <svg viewBox="0 0 64 48" width="60" height="45" aria-hidden="true">
            <defs>
              <linearGradient id="hog-coat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#8a5c34" />
                <stop offset="1" stop-color="#5f3d20" />
              </linearGradient>
            </defs>
            <!-- 刺衣 -->
            <path
              d="M16 40 L10 34 L16 32 L11 25 L18 23 L15 15 L23 15 L22 7 L30 11 L32 4 L39 9 L43 3 L47 10 L54 7 L53 15 L59 18 L55 25 L59 31 L52 34 L48 40 Z"
              fill="url(#hog-coat)"
            />
            <g stroke="#a9793f" stroke-width="1.1" stroke-linecap="round" opacity="0.55">
              <path d="M18 30 L14 27" />
              <path d="M26 24 L23 20" />
              <path d="M35 18 L33 13" />
              <path d="M44 15 L44 10" />
              <path d="M50 20 L53 16" />
            </g>
            <!-- 小脸 + 尖鼻子 -->
            <path d="M42 19 C50 18 57 23 60.5 29.5 C57 35 50 38 44 37 C40 33 39 25 42 19 Z" fill="#ecc9a0" />
            <circle cx="59.3" cy="29.5" r="2.1" fill="#3a2415" />
            <circle cx="47" cy="26" r="1.9" fill="#32190f" />
            <circle cx="47.6" cy="25.4" r="0.6" fill="#fffaf2" />
            <circle cx="43.5" cy="18.5" r="2.2" fill="#d9a066" />
            <!-- 小脚 -->
            <ellipse class="hog-foot hog-foot-l" cx="26" cy="42" rx="4" ry="2.4" fill="#8a5a36" />
            <ellipse class="hog-foot hog-foot-r" cx="38" cy="42" rx="4" ry="2.4" fill="#8a5a36" />
          </svg>
        </span>
      </span>
    </button>
  </ClientOnly>
</template>

<style scoped>
.garden-hedgehog {
  position: fixed;
  z-index: 399;
  display: block;
  width: 60px;
  height: 46px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: grab;
  padding: 0;
  font: inherit;
  touch-action: none;
  filter: drop-shadow(0 6px 12px rgba(98, 42, 18, 0.25));
  transition:
    left 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    top 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    filter 0.2s ease;
}

.garden-hedgehog:hover,
.garden-hedgehog:active {
  background: transparent;
}

.garden-hedgehog:hover {
  filter: drop-shadow(0 9px 16px rgba(98, 42, 18, 0.35));
}

.garden-hedgehog.dragging {
  cursor: grabbing;
  transition: filter 0.2s ease;
}

.hog-wobble {
  display: block;
}

.garden-hedgehog.crawling .hog-wobble {
  transform-origin: 50% 100%;
  animation: hog-wobble 0.42s ease-in-out infinite alternate;
}

@keyframes hog-wobble {
  from {
    transform: rotate(-3deg);
  }
  to {
    transform: rotate(3deg);
  }
}

.hog-foot {
  transform-box: fill-box;
}

.garden-hedgehog.crawling .hog-foot-l {
  animation: hog-step 0.42s ease-in-out infinite alternate;
}

.garden-hedgehog.crawling .hog-foot-r {
  animation: hog-step 0.42s ease-in-out infinite alternate-reverse;
}

@keyframes hog-step {
  from {
    transform: translateX(2px);
  }
  to {
    transform: translateX(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .garden-hedgehog.crawling .hog-wobble,
  .garden-hedgehog.crawling .hog-foot-l,
  .garden-hedgehog.crawling .hog-foot-r {
    animation: none;
  }
}
</style>
