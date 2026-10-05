<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useAssistantBus } from '../composables/useAssistantBus'
import { useCritterGarden } from '../composables/useCritterGarden'
import { useTheme } from '../composables/useTheme'

/**
 * 悬浮松鼠的轻量壳层。
 *
 * 它只做三件事：画 SVG 松鼠、处理拖拽/爬动/说气泡、被点击时请求打开对话面板。
 * 面板本身连同 marked / dompurify / highlight.js 语言包都在 SquirrelAssistant
 * 里按需加载 —— 那些依赖合计约 118KB，不该让每个访客都为一次可能不发生的
 * 提问买单。点击后由 useAssistantBus 通知重量层，加载完成即直接展开面板。
 */

const { requestAssistantOpen, requestOpen } = useAssistantBus()
const garden = useCritterGarden()
const { isDark } = useTheme()

const POS_KEY = 'squirrel-pet-pos'
const PET_SIZE = 76

// ---------- 宠物位置与拖拽 ----------
const pos = ref({ x: -1, y: -1 })
const dragging = ref(false)
/** 用户拖过之后就不再随机爬动 */
let userPinned = false
let dragMoved = false
let startX = 0
let startY = 0
let originX = 0
let originY = 0

const petStyle = computed(() => {
  if (pos.value.x < 0) return {}
  return {
    left: `${pos.value.x}px`,
    top: `${pos.value.y}px`,
    right: 'auto',
    transform: 'none',
  }
})

const hintOnRight = computed(() => {
  if (pos.value.x < 0) return false
  return pos.value.x + PET_SIZE / 2 < window.innerWidth / 2
})

function clampPos(x: number, y: number) {
  const maxX = Math.max(8, window.innerWidth - PET_SIZE - 8)
  const maxY = Math.max(8, window.innerHeight - PET_SIZE - 8)
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  }
}

function savePos() {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(pos.value))
  } catch {
    /* 忽略隐私模式写入失败 */
  }
}

function onPetPointerDown(event: PointerEvent) {
  if (pos.value.x < 0) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    pos.value = { x: rect.left, y: rect.top }
  }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  startX = event.clientX
  startY = event.clientY
  originX = pos.value.x
  originY = pos.value.y
  dragMoved = false
  dragging.value = true
  window.clearTimeout(crawlEndTimer)
  crawling.value = false
  pauseTip()
}

function onPetPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  if (Math.abs(dx) + Math.abs(dy) > 6) dragMoved = true
  pos.value = clampPos(originX + dx, originY + dy)
}

function onPetPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  if (dragMoved) {
    userPinned = true
    savePos()
  } else {
    requestAssistantOpen()
  }
  if (!userPinned) scheduleWander()
  scheduleTip(3200)
}

function handleWindowResize() {
  if (pos.value.x >= 0) {
    pos.value = clampPos(pos.value.x, pos.value.y)
  }
}

// ---------- 睡眠状态：暗主题入睡，点击 AI 或切回浅色主题苏醒 ----------
const aiWoken = ref(false)
const sleeping = computed(() => isDark.value && !aiWoken.value)

// 再次进入暗主题时清除 AI 唤醒标记，让松鼠重新入睡
watch(isDark, (dark) => {
  if (dark) aiWoken.value = false
})

watch(sleeping, (asleep) => {
  if (asleep) {
    window.clearTimeout(wanderTimer)
    window.clearTimeout(crawlEndTimer)
    crawling.value = false
    pauseTip()
  } else {
    window.clearTimeout(wanderTimer)
    window.clearTimeout(crawlEndTimer)
    if (!dragging.value && !requestOpen.value) scheduleWander()
    scheduleTip(2600)
  }
})

// 面板打开期间停止闲逛，关闭后恢复
watch(requestOpen, (opening) => {
  if (opening) {
    window.clearTimeout(wanderTimer)
    window.clearTimeout(crawlEndTimer)
    crawling.value = false
  } else {
    aiWoken.value = true
    if (!dragging.value) scheduleWander()
  }
})

// ---------- 空闲爬动 ----------
const crawling = ref(false)
const petRef = useTemplateRef<HTMLButtonElement>('petRef')
let wanderTimer = 0
let crawlEndTimer = 0

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scheduleWander() {
  window.clearTimeout(wanderTimer)
  if (sleeping.value) return
  wanderTimer = window.setTimeout(startCrawl, 9000 + Math.random() * 7000)
}

function startCrawl() {
  if (sleeping.value) return
  if (dragging.value || requestOpen.value || document.hidden || prefersReducedMotion()) {
    scheduleWander()
    return
  }
  const petEl = petRef.value
  if (!petEl) {
    scheduleWander()
    return
  }
  if (pos.value.x < 0) {
    const rect = petEl.getBoundingClientRect()
    pos.value = { x: rect.left, y: rect.top }
  }
  const dy = (60 + Math.random() * 120) * (Math.random() > 0.5 ? 1 : -1)
  const target = clampPos(pos.value.x, pos.value.y + dy)
  crawling.value = true
  pos.value = target
  savePos()
  window.clearTimeout(crawlEndTimer)
  crawlEndTimer = window.setTimeout(() => {
    crawling.value = false
    scheduleWander()
  }, 2300)
}

// ---------- 被小刺猬扎到：赶紧跳开 ----------
const pricked = ref(false)
let lastPrickAt = 0
let unprickTimer = 0

function onPrick(hedgehogCenter: { x: number; y: number }) {
  const now = Date.now()
  if (now - lastPrickAt < 2600 || dragging.value || requestOpen.value) return
  const el = petRef.value
  if (!el) return
  lastPrickAt = now
  const rect = el.getBoundingClientRect()
  if (pos.value.x < 0) pos.value = { x: rect.left, y: rect.top }
  // 沿“刺猬 → 松鼠”方向弹开
  let dx = rect.left + rect.width / 2 - hedgehogCenter.x
  let dy = rect.top + rect.height / 2 - hedgehogCenter.y
  const len = Math.hypot(dx, dy) || 1
  dx /= len
  dy /= len
  pos.value = clampPos(pos.value.x + dx * 160, pos.value.y + dy * 160 - 46)
  savePos()
  window.clearTimeout(crawlEndTimer)
  crawling.value = false
  if (!userPinned) scheduleWander()
  pricked.value = true
  window.clearTimeout(unprickTimer)
  unprickTimer = window.setTimeout(() => {
    pricked.value = false
  }, 700)
  shout('痛死我了！')
}

// ---------- 说话气泡：快速渐显，停留三秒后渐隐，随机换台词 ----------
const TIP_MESSAGES = [
  '有什么问题吗？',
  '今天想啃哪颗栗子呀？',
  '集齐五件宝物会有惊喜哦 ✨',
  '我的尾巴够蓬松吗？',
  '前端知识，一颗一颗慢慢啃～',
  '点我就能问我问题啦',
  '这个栗子好吃吗？',
  '我在这儿等你提问哦',
  '暗色模式下我会睡觉呢',
  '拖一拖我，我会换地方待着',
]

const tipText = ref('')
const tipVisible = ref(false)
const greeting = ref(false)

let tipShowTimer = 0
let tipHideTimer = 0
let tipWaveTimer = 0
let tipLastIndex = -1

function pickRandom(list: readonly string[], avoidIndex = -1) {
  if (list.length === 1) return list[0]
  let index = avoidIndex
  while (index === avoidIndex) {
    index = Math.floor(Math.random() * list.length)
  }
  return list[index]
}

function pauseTip() {
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  tipVisible.value = false
  greeting.value = false
}

function scheduleTip(delay = 2600) {
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  tipShowTimer = window.setTimeout(() => {
    if (sleeping.value || dragging.value || requestOpen.value || document.hidden) {
      scheduleTip(4200)
      return
    }
    const next = pickRandom(TIP_MESSAGES, tipLastIndex)
    tipLastIndex = TIP_MESSAGES.indexOf(next)
    tipText.value = next
    tipVisible.value = true
    greeting.value = true
    window.clearTimeout(tipWaveTimer)
    tipWaveTimer = window.setTimeout(() => {
      greeting.value = false
    }, 1600)
    tipHideTimer = window.setTimeout(() => {
      tipVisible.value = false
      scheduleTip(9000 + Math.random() * 6000)
    }, 3200)
  }, delay)
}

/** 被扎时喊一句 */
function shout(text: string) {
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  tipText.value = text
  tipVisible.value = true
  greeting.value = true
  window.clearTimeout(tipWaveTimer)
  tipWaveTimer = window.setTimeout(() => {
    greeting.value = false
  }, 1600)
  tipHideTimer = window.setTimeout(() => {
    tipVisible.value = false
  }, 2600)
}

onMounted(() => {
  try {
    const savedPos = localStorage.getItem(POS_KEY)
    if (savedPos) {
      const parsed = JSON.parse(savedPos)
      pos.value = clampPos(Number(parsed.x) || 0, Number(parsed.y) || 0)
    }
  } catch {
    /* 本地数据损坏时忽略 */
  }
  scheduleWander()
  scheduleTip(1200)
  garden.registerSquirrel({
    getRect: () => petRef.value?.getBoundingClientRect() ?? null,
    onPrick,
  })
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  window.clearTimeout(wanderTimer)
  window.clearTimeout(crawlEndTimer)
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  window.clearTimeout(tipWaveTimer)
  window.clearTimeout(unprickTimer)
  garden.unregisterSquirrel()
})
</script>

<template>
  <!-- 悬浮松鼠宠物 -->
  <button
    ref="petRef"
    type="button"
    class="squirrel-pet"
    :class="{ dragging, crawling, waving: greeting, pricked, sleeping, 'hint-on-right': hintOnRight }"
    :style="petStyle"
    aria-label="松鼠小助手：点击提问，拖拽移动"
    title="点我提问，拖拽移动"
    @pointerdown="onPetPointerDown"
    @pointermove="onPetPointerMove"
    @pointerup="onPetPointerUp"
    @pointercancel="onPetPointerUp"
  >
    <span class="pet-inner" aria-hidden="true">
      <span class="pet-ai-badge">AI</span>
      <span class="pet-zzz" aria-hidden="true">z<span>z</span><span>z</span></span>
      <span class="pet-flip">
        <span class="pet-wobble">
          <svg viewBox="0 0 136 120" width="68" height="60">
            <defs>
              <linearGradient id="sq-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f0904a" />
                <stop offset="1" stop-color="#d95a24" />
              </linearGradient>
              <linearGradient id="sq-tail" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stop-color="#c1441e" />
                <stop offset="1" stop-color="#f5a040" />
              </linearGradient>
            </defs>
            <!-- 蓬松大尾巴：从背后高高翘起，毛流细节，根部被身体压住不脱节 -->
            <g class="pet-tail">
              <path
                d="M58 96 C96 106 122 86 122 50 C121.5 30 112 13 97 8 C83 3.5 72.5 9 71.5 17.5 C70.8 24 74.5 28.5 76.5 33.5 C63 44 58 66 56.5 86 C56 92 57 95 58 96 Z"
                fill="url(#sq-tail)"
              />
              <path d="M76 88 C96 80 106 58 99 40 C105 58 98 80 82 90 Z" fill="#f6c15a" opacity="0.5" />
            </g>
            <!-- 后脚（爬行时交替迈步） -->
            <ellipse class="pet-foot pet-foot-l" cx="41.4" cy="107" rx="9.6" ry="5.4" fill="#b7431f" />
            <ellipse class="pet-foot pet-foot-r" cx="64.6" cy="107" rx="9.6" ry="5.4" fill="#b7431f" />
            <!-- 圆润胖身体与浅色肚皮 -->
            <ellipse cx="52" cy="84" rx="27" ry="27" fill="url(#sq-body)" />
            <ellipse cx="51" cy="90" rx="16" ry="17" fill="#ffe3c2" opacity="0.95" />
            <!-- 尖耳朵带粉色内耳：缩小，基部埋进脑袋由头盖住，不脱节 -->
            <path d="M33.5 38 L38.5 12 L48 27 Z" fill="#d95a24" stroke="#d95a24" stroke-width="3" stroke-linejoin="round" />
            <path d="M36.8 30.5 L39 17 L44 25.5 Z" fill="#f2a582" />
            <path d="M70.5 38 L65.5 12 L56 27 Z" fill="#d95a24" stroke="#d95a24" stroke-width="3" stroke-linejoin="round" />
            <path d="M67.2 30.5 L65 17 L60 25.5 Z" fill="#f2a582" />
            <!-- 圆脑袋 + 鼓脸颊 -->
            <circle cx="52" cy="47" r="22" fill="url(#sq-body)" />
            <circle cx="33" cy="54" r="9.5" fill="#e8793c" />
            <circle cx="71" cy="54" r="9.5" fill="#e8793c" />
            <circle cx="41" cy="53" r="4" fill="#f6c15a" opacity="0.6" />
            <circle cx="63" cy="53" r="4" fill="#f6c15a" opacity="0.6" />
            <!-- 胡须 -->
            <g stroke="#b7431f" stroke-width="0.9" stroke-linecap="round" opacity="0.7">
              <path d="M32 50 L25 49" />
              <path d="M32 54 L25 55" />
              <path d="M32.5 58 L26 60" />
              <path d="M72 50 L79 49" />
              <path d="M72 54 L79 55" />
              <path d="M71.5 58 L78 60" />
            </g>
            <g class="pet-eyes">
              <circle cx="44" cy="44" r="3.4" fill="#32190f" />
              <circle cx="45" cy="43" r="1.1" fill="#fffaf2" />
              <circle cx="60" cy="44" r="3.4" fill="#32190f" />
              <circle cx="61" cy="43" r="1.1" fill="#fffaf2" />
            </g>
            <!-- 开心表情：眯眯眼 + 脸红，说话挥手时出现 -->
            <g class="pet-face-happy">
              <path d="M40.5 44.5 Q44 40.5 47.5 44.5" fill="none" stroke="#32190f" stroke-width="2" stroke-linecap="round" />
              <path d="M56.5 44.5 Q60 40.5 63.5 44.5" fill="none" stroke="#32190f" stroke-width="2" stroke-linecap="round" />
              <circle cx="36" cy="50.5" r="2.8" fill="#f0806e" opacity="0.6" />
              <circle cx="68" cy="50.5" r="2.8" fill="#f0806e" opacity="0.6" />
            </g>
            <!-- 睡觉表情：闭眼 -->
            <g class="pet-face-sleep">
              <path d="M40.5 45 Q44 47.5 47.5 45" fill="none" stroke="#32190f" stroke-width="2" stroke-linecap="round" />
              <path d="M56.5 45 Q60 47.5 63.5 45" fill="none" stroke="#32190f" stroke-width="2" stroke-linecap="round" />
            </g>
            <!-- 口鼻：浅色吻部 + 鼻子 + 门牙 -->
            <ellipse cx="52" cy="55" rx="9" ry="7" fill="#ffe3c2" />
            <ellipse cx="52" cy="50.5" rx="2.4" ry="1.8" fill="#7b351d" />
            <path d="M48.5 54.5 Q52 57.5 55.5 54.5" fill="none" stroke="#7b351d" stroke-width="1.4" stroke-linecap="round" />
            <rect x="50.2" y="56.4" width="1.6" height="2.6" rx="0.5" fill="#fffdf6" />
            <rect x="52.2" y="56.4" width="1.6" height="2.6" rx="0.5" fill="#fffdf6" />
            <!-- 抱在胸前的左爪 -->
            <ellipse cx="39.6" cy="74.6" rx="5.5" ry="7.2" fill="#c1441e" transform="rotate(18 39.6 74.6)" />
            <ellipse cx="40" cy="80.4" rx="3.6" ry="2.4" fill="#f0a06a" />
            <!-- 挥手打招呼的右爪 -->
            <g class="pet-arm">
              <ellipse cx="66.4" cy="71.6" rx="5.4" ry="7" fill="#c1441e" transform="rotate(-24 66.4 71.6)" />
              <circle cx="69.2" cy="66.4" r="2.8" fill="#d95a24" />
              <circle cx="71.4" cy="63.8" r="1.7" fill="#d95a24" />
            </g>
          </svg>
        </span>
      </span>
    </span>
    <span class="pet-hint" :class="{ show: tipVisible }" aria-hidden="true"><span class="pet-hint-text">{{ tipText }}</span></span>
  </button>
</template>

<style scoped>
/* ---------- 悬浮宠物 ---------- */
.squirrel-pet {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  width: 76px;
  height: 76px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: grab;
  touch-action: none;
  user-select: none;
  filter: drop-shadow(0 8px 16px rgba(98, 42, 18, 0.28));
  transition:
    left 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    top 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    filter 0.2s ease;
}

.squirrel-pet:hover {
  filter: drop-shadow(0 10px 20px rgba(98, 42, 18, 0.4));
}

.squirrel-pet.dragging {
  cursor: grabbing;
  filter: drop-shadow(0 14px 24px rgba(98, 42, 18, 0.45));
  transition: filter 0.2s ease;
}

.pet-inner {
  position: relative;
  display: block;
  animation: pet-bob 3.2s ease-in-out infinite;
}

/* 头顶 AI 艺术字：鎏金渐变 + 深棕描边，hover 时晃动并扫光锃亮 */
.pet-ai-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  transform-origin: 50% 100%;
  font-size: 19px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 1px;
  line-height: 1;
  background: linear-gradient(180deg, #ffe9a8 0%, #f6c15a 35%, #d99a2b 55%, #fff3c4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 0.9px #8f2f18;
  paint-order: stroke fill;
  color: transparent;
  filter: drop-shadow(0 2px 3px rgba(98, 42, 18, 0.45));
  pointer-events: none;
  transition: filter 0.25s ease;
}

.squirrel-pet:hover .pet-ai-badge {
  /* 白金高光条随渐变位移动画扫过，配合金色光晕形成"锃亮"感 */
  background: linear-gradient(
    110deg,
    #f6c15a 0%,
    #ffe9a8 20%,
    #ffffff 38%,
    #ffe9a8 55%,
    #d99a2b 75%,
    #f6c15a 100%
  );
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  filter: drop-shadow(0 0 6px rgba(246, 193, 90, 0.9)) drop-shadow(0 2px 3px rgba(98, 42, 18, 0.45));
  animation:
    ai-swing 0.62s ease-in-out infinite,
    ai-shine 1.4s linear infinite;
}

@keyframes ai-swing {
  0%,
  100% {
    transform: translateX(-50%) rotate(-9deg) scale(1.06);
  }
  50% {
    transform: translateX(-50%) rotate(9deg) scale(1.06);
  }
}

@keyframes ai-shine {
  from {
    background-position: 120% 0;
  }
  to {
    background-position: -120% 0;
  }
}

/* 被刺猬扎到：吓一跳弹起再落地 */
.squirrel-pet.pricked .pet-inner {
  animation: prick-jump 0.68s cubic-bezier(0.3, 0.9, 0.4, 1);
}

@keyframes prick-jump {
  0% {
    transform: translateY(0) scale(1);
  }
  28% {
    transform: translateY(-30px) scale(1.07);
  }
  52% {
    transform: translateY(-20px) scale(1.02) rotate(-5deg);
  }
  76% {
    transform: translateY(2px) scale(0.96, 0.88);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.squirrel-pet.dragging .pet-inner,
.squirrel-pet.dragging .pet-ai-badge,
.squirrel-pet.dragging .pet-arm,
.squirrel-pet.dragging .pet-tail,
.squirrel-pet.dragging .pet-eyes,
.squirrel-pet.dragging .pet-face-happy,
.squirrel-pet.dragging .pet-hint-text,
.squirrel-pet.dragging .pet-foot-l,
.squirrel-pet.dragging .pet-foot-r {
  animation-play-state: paused;
}

/* 爬行时双脚交替迈步 */
.pet-foot {
  transform-box: fill-box;
}

.squirrel-pet.crawling .pet-foot-l {
  animation: foot-step 0.42s ease-in-out infinite alternate;
}

.squirrel-pet.crawling .pet-foot-r {
  animation: foot-step 0.42s ease-in-out infinite alternate-reverse;
}

@keyframes foot-step {
  from {
    transform: translate(2.5px, -1.2px) rotate(3deg);
  }
  to {
    transform: translate(-2.5px, 1.2px) rotate(-3deg);
  }
}

/* 爬行：身体左右摇摆 */
.pet-wobble {
  display: block;
}

.squirrel-pet.crawling .pet-wobble {
  transform-origin: 50% 100%;
  animation: crawl-wobble 0.42s ease-in-out infinite alternate;
}

@keyframes crawl-wobble {
  from {
    transform: rotate(-4deg) translateX(1.5px);
  }
  to {
    transform: rotate(4deg) translateX(-1.5px);
  }
}

/* 挥手打招呼的小爪子：说话时挥动 */
.pet-arm {
  transform-box: fill-box;
  transform-origin: 50% 90%;
}

.squirrel-pet.waving .pet-arm {
  animation: arm-wave 1.1s ease-in-out infinite;
}

@keyframes arm-wave {
  0%, 100% { transform: rotate(0deg); }
  30% { transform: rotate(-46deg); }
  55% { transform: rotate(10deg); }
  80% { transform: rotate(-36deg); }
}

/* 开心表情：说话挥手时切换眯眯眼 + 脸红 */
.pet-face-happy,
.pet-eyes {
  transition: opacity 0.2s ease;
}

.pet-face-happy {
  opacity: 0;
}

.squirrel-pet.waving .pet-face-happy {
  opacity: 1;
}

.squirrel-pet.waving .pet-eyes {
  opacity: 0;
}

/* ---------- 睡觉状态：闭眼、停止浮动与摇尾、冒 zzz ---------- */
.pet-face-sleep {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.squirrel-pet.sleeping .pet-eyes,
.squirrel-pet.sleeping .pet-face-happy {
  opacity: 0;
}

.squirrel-pet.sleeping .pet-face-sleep {
  opacity: 1;
}

.squirrel-pet.sleeping .pet-inner,
.squirrel-pet.sleeping .pet-tail,
.squirrel-pet.sleeping .pet-eyes {
  animation: none;
}

.pet-zzz {
  position: absolute;
  top: -16px;
  right: -14px;
  z-index: 3;
  display: inline-flex;
  gap: 3px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  line-height: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.squirrel-pet.sleeping .pet-zzz {
  opacity: 1;
}

.pet-zzz span {
  display: inline-block;
  animation: pet-zzz-float 2.4s ease-in-out infinite;
}

.pet-zzz span:nth-child(2) {
  animation-delay: 0.4s;
}

.pet-zzz span:nth-child(3) {
  animation-delay: 0.8s;
}

@keyframes pet-zzz-float {
  0% {
    transform: translateY(0) scale(0.6);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(-14px) scale(1.15);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .squirrel-pet.sleeping .pet-zzz span {
    animation: none;
    opacity: 1;
  }
}

.pet-tail {
  transform-box: fill-box;
  transform-origin: bottom left;
  animation: tail-wag 2.6s ease-in-out infinite;
}

.pet-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: pet-blink 4.4s ease-in-out infinite;
}

/* 说话气泡：挂在松鼠左侧，不挡脸；快速渐显 → 停留三秒 → 渐隐 */
.pet-hint {
  position: absolute;
  top: 6px;
  right: calc(100% + 10px);
  width: max-content;
  max-width: 170px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  line-height: 1.6;
  color: #fffaf2;
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  box-shadow: 0 4px 10px rgba(143, 47, 24, 0.35);
  opacity: 0;
  transform: translateX(8px) scale(0.9);
  transform-origin: 100% 70%;
  pointer-events: none;
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 气泡小尾巴：指向松鼠 */
.pet-hint::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 100%;
  border: 5px solid transparent;
  border-left: 7px solid #e0652f;
}

.pet-hint.show {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.pet-hint-text {
  display: inline-block;
}

/* 松鼠在屏幕左侧时，气泡改到右侧 */
.squirrel-pet.hint-on-right .pet-hint {
  right: auto;
  left: calc(100% + 10px);
  transform-origin: 0% 70%;
  transform: translateX(-8px) scale(0.9);
}

.squirrel-pet.hint-on-right .pet-hint.show {
  transform: translateX(0) scale(1);
}

.squirrel-pet.hint-on-right .pet-hint::after {
  left: auto;
  right: 100%;
  border: 5px solid transparent;
  border-right: 7px solid #e0652f;
  border-left: none;
}

/* 讲话时文字轻轻起伏，模拟说话的节奏 */
.pet-hint.show .pet-hint-text {
  animation: tip-talk 0.8s ease-in-out infinite;
}

@keyframes tip-talk {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1px) scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  .squirrel-pet.waving .pet-arm {
    animation: none;
  }

  .squirrel-pet:hover .pet-ai-badge {
    animation: none;
  }

  .squirrel-pet.crawling .pet-wobble,
  .squirrel-pet.crawling .pet-foot-l,
  .squirrel-pet.crawling .pet-foot-r {
    animation: none;
  }

  .pet-hint.show .pet-hint-text {
    animation: none;
  }
}

@keyframes pet-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes tail-wag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}

@keyframes pet-blink {
  0%, 93%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.12); }
}
</style>
