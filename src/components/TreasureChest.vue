<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useCritterGarden } from '../composables/useCritterGarden'

type CollectibleId = 'chestnut' | 'plum' | 'peanut' | 'cherry' | 'walnut'

interface Collectible {
  id: CollectibleId
  label: string
  rot: string
  delay: string
}

const COLLECTIBLES: Collectible[] = [
  { id: 'chestnut', label: '栗子', rot: '-16deg', delay: '0.5s' },
  { id: 'plum', label: '李子', rot: '12deg', delay: '1.5s' },
  { id: 'peanut', label: '花生', rot: '6deg', delay: '2.5s' },
  { id: 'cherry', label: '樱桃', rot: '-8deg', delay: '3.4s' },
  { id: 'walnut', label: '核桃', rot: '16deg', delay: '4.2s' },
]

const STORAGE_KEY = 'squirrel-harvest'
const collected = ref<CollectibleId[]>([])
const hintShown = ref(false)
const hintText = ref('')
// idle（待命）→ shaking（集齐激动）→ opening（开箱爆金币）→ gone（消失）→ idle
const chestState = ref<'idle' | 'shaking' | 'opening' | 'gone'>('idle')

const chestEl = useTemplateRef<HTMLButtonElement>('chestEl')
const itemEls: Partial<Record<CollectibleId, HTMLElement | null>> = {}
let hintTimer = 0
let stateTimer = 0
let stopFollowWatch: (() => void) | null = null

// ---------- 宝物位置：随机撒落 + 拖拽固定 + 被刺猬粘住 ----------
const garden = useCritterGarden()
const hedgehogMode = garden.hedgehogMode
const ITEM_SIZE = 44
const positions = ref<Record<CollectibleId, { x: number; y: number }>>({
  chestnut: { x: -120, y: -120 },
  plum: { x: -120, y: -120 },
  peanut: { x: -120, y: -120 },
  cherry: { x: -120, y: -120 },
  walnut: { x: -120, y: -120 },
})
/** 被粘住时相对刺猬中心的偏移 */
const stuckItems = ref<Partial<Record<CollectibleId, { dx: number; dy: number }>>>({})
/** 用户拖过的宝物不再参与随机撒落 */
const pinnedIds = new Set<CollectibleId>()
const spawnedAt: Partial<Record<CollectibleId, number>> = {}
const itemDrags = new Map<CollectibleId, { startX: number; startY: number; ox: number; oy: number; moved: boolean }>()

const collectedCount = computed(() => collected.value.length)
const pileScale = computed(() => 0.3 + collectedCount.value * 0.25)

const chestLabel = computed(() => {
  if (chestState.value === 'gone') return '宝箱休息中'
  if (chestState.value === 'opening') return '宝箱打开啦，金币满天飞'
  const n = collectedCount.value
  return n === 0 ? '松鼠的宝箱，捡起漂浮的宝物放进来吧' : `松鼠的宝箱，已收 ${n}/${COLLECTIBLES.length} 个宝物`
})

function isCollected(id: CollectibleId) {
  return collected.value.includes(id)
}

function setItemEl(id: CollectibleId, el: unknown) {
  itemEls[id] = (el as HTMLElement | null) ?? null
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collected.value))
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pointDist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * 拒绝采样生成随机位置：要求与所有参考点（原位置、其他宝物新位置）至少相距 minGap，
 * 空间不足时退回离参考点最远的候选，保证每次撒落都真正换位且彼此错开。
 */
function randomItemPos(refs: { x: number; y: number }[], minGap: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const spanX = Math.max(60, vw - 190)
  const spanY = Math.max(60, vh - 300)
  let best = { x: 70 + Math.random() * spanX, y: 120 + Math.random() * spanY }
  let bestDist = -1
  for (let i = 0; i < 28; i++) {
    const cand = { x: 70 + Math.random() * spanX, y: 120 + Math.random() * spanY }
    let nearest = Infinity
    for (const r of refs) nearest = Math.min(nearest, pointDist(cand, r))
    if (nearest >= minGap) return cand
    if (nearest > bestDist) {
      bestDist = nearest
      best = cand
    }
  }
  return best
}

function clampItemPos(x: number, y: number) {
  const maxX = Math.max(8, window.innerWidth - ITEM_SIZE - 10)
  const maxY = Math.max(104, window.innerHeight - ITEM_SIZE - 66)
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(104, y), maxY),
  }
}

/** 爆金币后重新撒落：未被抓取过的宝物换到远离原位、彼此错开的新位置 */
function randomizePositions() {
  const taken: { x: number; y: number }[] = []
  for (const c of COLLECTIBLES) {
    if (pinnedIds.has(c.id) || isCollected(c.id)) continue
    const next = randomItemPos([...taken, positions.value[c.id]], 130)
    taken.push(next)
    positions.value[c.id] = next
    spawnedAt[c.id] = Date.now()
  }
}

function itemStyle(id: CollectibleId) {
  const p = positions.value[id]
  return { left: `${p.x}px`, top: `${p.y}px` }
}

/** 被粘住后跟随刺猬移动 */
function applyStuckPos(id: CollectibleId) {
  const off = stuckItems.value[id]
  if (!off) return
  const cx = garden.hedgehogPos.value.x + 30
  const cy = garden.hedgehogPos.value.y + 23
  positions.value[id] = clampItemPos(cx + off.dx - ITEM_SIZE / 2, cy + off.dy - ITEM_SIZE / 2)
}

function onStickItem(id: CollectibleId, hedgehogCenter: { x: number; y: number }) {
  if (isCollected(id) || stuckItems.value[id] || chestState.value !== 'idle') return
  // 刚撒落的一瞬间不粘，避免刷在刺猬身上
  if (Date.now() - (spawnedAt[id] ?? 0) < 1200) return
  const off = { dx: (Math.random() - 0.5) * 26, dy: -12 - Math.random() * 10 }
  stuckItems.value[id] = off
  positions.value[id] = clampItemPos(
    hedgehogCenter.x + off.dx - ITEM_SIZE / 2,
    hedgehogCenter.y + off.dy - ITEM_SIZE / 2,
  )
}

function onItemPointerDown(event: PointerEvent, item: Collectible) {
  if (isCollected(item.id) || chestState.value === 'opening' || chestState.value === 'gone') return
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  itemDrags.set(item.id, {
    startX: event.clientX,
    startY: event.clientY,
    ox: positions.value[item.id].x,
    oy: positions.value[item.id].y,
    moved: false,
  })
}

function onItemPointerMove(event: PointerEvent, item: Collectible) {
  const d = itemDrags.get(item.id)
  if (!d) return
  const dx = event.clientX - d.startX
  const dy = event.clientY - d.startY
  if (Math.abs(dx) + Math.abs(dy) > 6) {
    d.moved = true
    // 挣脱刺猬的刺
    if (stuckItems.value[item.id]) delete stuckItems.value[item.id]
    positions.value[item.id] = clampItemPos(d.ox + dx, d.oy + dy)
  }
}

function onItemPointerUp(event: PointerEvent, item: Collectible) {
  const d = itemDrags.get(item.id)
  if (!d) return
  itemDrags.delete(item.id)
  if (d.moved) {
    pinnedIds.add(item.id)
  } else {
    collect(item)
  }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved: unknown = JSON.parse(raw)
      if (Array.isArray(saved)) {
        const valid = saved.filter((id): id is CollectibleId =>
          typeof id === 'string' && COLLECTIBLES.some((c) => c.id === id),
        )
        if (valid.length === COLLECTIBLES.length) {
          collected.value = []
          persist()
        } else {
          collected.value = valid
        }
      }
    }
  } catch {
    /* 忽略损坏的存储数据 */
  }
  // 首次撒落位置随机
  randomizePositions()
  for (const c of COLLECTIBLES) {
    garden.registerCollectible(c.id, {
      getRect: () => itemEls[c.id]?.getBoundingClientRect() ?? null,
      onStick: (hc) => onStickItem(c.id, hc),
    })
  }
  // 粘在刺上的宝物跟随刺猬
  stopFollowWatch = watch(garden.hedgehogPos, () => {
    for (const id of Object.keys(stuckItems.value)) {
      applyStuckPos(id as CollectibleId)
    }
  })
});

onUnmounted(() => {
  window.clearTimeout(hintTimer)
  window.clearTimeout(stateTimer)
  for (const c of COLLECTIBLES) {
    garden.unregisterCollectible(c.id)
  }
  stopFollowWatch?.()
})

function collect(item: Collectible) {
  if (isCollected(item.id) || chestState.value !== 'idle') return
  const fromRect = itemEls[item.id]?.getBoundingClientRect()
  const chestRect = chestEl.value?.getBoundingClientRect()
  delete stuckItems.value[item.id]
  collected.value = [...collected.value, item.id]

  if (fromRect && chestRect && !prefersReducedMotion()) {
    flyToChest(item.id, fromRect, chestRect)
  } else {
    landOnChest()
  }
}

/** 克隆宝物图标，用 Web Animations API 沿弧线飞进宝箱 */
function flyToChest(id: CollectibleId, from: DOMRect, to: DOMRect) {
  const source = itemEls[id]?.querySelector('svg')
  const cloneWrap = document.createElement('span')
  cloneWrap.className = 'harvest-fly'
  if (source) {
    cloneWrap.appendChild(source.cloneNode(true))
  } else {
    cloneWrap.textContent = '🌰'
  }
  cloneWrap.style.left = `${from.left + from.width / 2}px`
  cloneWrap.style.top = `${from.top + from.height / 2}px`
  document.body.appendChild(cloneWrap)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height * 0.45 - (from.top + from.height / 2)
  const anim = cloneWrap.animate(
    [
      { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1 },
      {
        transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 70}px)) rotate(200deg) scale(1.15)`,
        opacity: 1,
        offset: 0.55,
      },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(380deg) scale(0.3)`, opacity: 0.4 },
    ],
    { duration: 680, easing: 'cubic-bezier(0.5, 0, 0.6, 1)' },
  )
  anim.addEventListener('finish', () => {
    cloneWrap.remove()
    landOnChest()
  })
  anim.addEventListener('cancel', () => cloneWrap.remove())
}

function landOnChest() {
  bounceChest()
  if (collected.value.length === COLLECTIBLES.length) {
    window.clearTimeout(stateTimer)
    chestState.value = 'shaking'
    stateTimer = window.setTimeout(openChest, prefersReducedMotion() ? 80 : 680)
  }
}

function openChest() {
  chestState.value = 'opening'
  if (!prefersReducedMotion()) burstCoins()
  stateTimer = window.setTimeout(() => {
    // 爆完金币，宝箱消失，宝物重新撒落到新位置，游戏回到初始状态
    chestState.value = 'gone'
    collected.value = []
    stuckItems.value = {}
    randomizePositions()
    persist()
    stateTimer = window.setTimeout(() => {
      chestState.value = 'idle'
    }, 1100)
  }, prefersReducedMotion() ? 250 : 1400)
}

/** 开箱时金币喷泉：向上抛出后受"重力"下落 */
function burstCoins() {
  const rect = chestEl.value?.getBoundingClientRect()
  if (!rect) return
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height * 0.32
  const total = 14
  for (let i = 0; i < total; i++) {
    const sparkle = i % 4 === 3
    const coin = document.createElement('span')
    coin.className = sparkle ? 'harvest-sparkle' : 'harvest-coin'
    if (sparkle) coin.textContent = '✨'
    coin.style.left = `${cx}px`
    coin.style.top = `${cy}px`
    document.body.appendChild(coin)

    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9
    const power = 90 + Math.random() * 120
    const dx = Math.cos(angle) * power
    const dyUp = Math.sin(angle) * power
    const gravity = 260 + Math.random() * 160
    const anim = coin.animate(
      [
        { transform: 'translate(-50%, -50%) translateY(0) rotateY(0deg)', opacity: 1 },
        {
          transform: `translate(-50%, -50%) translate(${dx * 0.6}px, ${dyUp * 0.75}px) rotateY(180deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(-50%, -50%) translate(${dx}px, ${dyUp + gravity}px) rotateY(400deg)`,
          opacity: 0,
        },
      ],
      { duration: 950 + Math.random() * 350, easing: 'cubic-bezier(0.2, 0.5, 0.4, 1)', delay: 120 + i * 40 },
    )
    anim.addEventListener('finish', () => coin.remove())
    anim.addEventListener('cancel', () => coin.remove())
  }
}

function bounceChest() {
  if (prefersReducedMotion()) return
  chestEl.value?.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }],
    { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  )
}

function handleChestClick() {
  if (chestState.value !== 'idle') return
  const remain = COLLECTIBLES.length - collectedCount.value
  hintText.value = remain === COLLECTIBLES.length ? '去捡漂浮的宝物吧～' : `还差 ${remain} 个就集齐啦`
  hintShown.value = true
  window.clearTimeout(hintTimer)
  hintTimer = window.setTimeout(() => {
    hintShown.value = false
  }, 2000)
  if (!prefersReducedMotion()) {
    chestEl.value?.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-4deg)' },
        { transform: 'rotate(4deg)' },
        { transform: 'rotate(0deg)' },
      ],
      { duration: 420, easing: 'ease-in-out' },
    )
  }
}
</script>

<template>
  <ClientOnly>
    <div class="harvest-root">
      <Transition v-for="item in COLLECTIBLES" :key="item.id" name="harvest-pop" appear>
        <button
          v-if="!isCollected(item.id)"
          :ref="(el) => setItemEl(item.id, el)"
          class="harvest-item"
          :class="{ stuck: !!stuckItems[item.id], 'follow-instant': hedgehogMode === 'drag' }"
          :style="itemStyle(item.id)"
          type="button"
          :aria-label="`收集${item.label}`"
          :title="`收集${item.label}（可拖拽）`"
          @pointerdown="onItemPointerDown($event, item)"
          @pointermove="onItemPointerMove($event, item)"
          @pointerup="onItemPointerUp($event, item)"
          @pointercancel="onItemPointerUp($event, item)"
        >
          <span
            class="harvest-item-ico"
            :style="{ '--harvest-rot': item.rot, animationDelay: item.delay }"
            aria-hidden="true"
          >
            <svg v-if="item.id === 'chestnut'" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="ches-shell" cx="0.38" cy="0.3" r="0.9">
                  <stop offset="0" stop-color="#c9793a" />
                  <stop offset="0.55" stop-color="#96501f" />
                  <stop offset="1" stop-color="#6f3a13" />
                </radialGradient>
              </defs>
              <path
                d="M20 3 C21.6 6 22.4 8.4 22.5 10.8 C27.9 13.2 31.6 18.8 31.6 24.8 C31.6 31.6 26.5 36.8 20 36.8 C13.5 36.8 8.4 31.6 8.4 24.8 C8.4 18.8 12.1 13.2 17.5 10.8 C17.6 8.4 18.4 6 20 3 Z"
                fill="url(#ches-shell)"
              />
              <path d="M20 25 C26 25 30.6 27.6 31.4 31.4 C29.6 34.7 25.2 36.8 20 36.8 C14.8 36.8 10.4 34.7 8.6 31.4 C9.4 27.6 14 25 20 25 Z" fill="#e8c48f" />
              <path d="M13.5 30.5 Q16 29 18 29.6 M22 29.6 Q24 29 26.5 30.5 M17 33.5 Q20 32.4 23 33.5" fill="none" stroke="#c9a06a" stroke-width="0.7" opacity="0.8" />
              <path d="M13 9.5 C11.2 12 10.2 15 10.2 18.2 C10.2 20.6 10.7 22.6 11.6 24.2 C10.4 20.4 10.8 15.4 13 9.5 Z" fill="#ffffff" opacity="0.25" />
              <circle cx="25.5" cy="16" r="3" fill="#ffffff" opacity="0.12" />
            </svg>
            <svg v-else-if="item.id === 'plum'" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="plum-g" cx="0.35" cy="0.28" r="1">
                  <stop offset="0" stop-color="#a86ad4" />
                  <stop offset="0.55" stop-color="#7c3fa6" />
                  <stop offset="1" stop-color="#4a2060" />
                </radialGradient>
              </defs>
              <!-- 紫色李子：果柄 + 果脐 + 果粉高光 + 一片叶 -->
              <path d="M20 9.5 C19.5 6.5 18.5 4.5 17 3.2" fill="none" stroke="#6f4a24" stroke-width="1.8" stroke-linecap="round" />
              <ellipse cx="25.5" cy="5" rx="5" ry="2.4" fill="#6f9c48" transform="rotate(-22 25.5 5)" />
              <path d="M23.5 6.5 C24 5.5 25 4.6 26.2 4.2" fill="none" stroke="#567a36" stroke-width="0.8" />
              <circle cx="20" cy="23.5" r="14" fill="url(#plum-g)" />
              <path d="M20 9.5 C19.8 11 19.8 12.4 20 13.5" fill="none" stroke="#5c3a75" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
              <ellipse cx="14.5" cy="16.5" rx="4.2" ry="2.4" fill="#ffffff" opacity="0.3" transform="rotate(-32 14.5 16.5)" />
              <ellipse cx="26.5" cy="31.5" rx="2.2" ry="1.2" fill="#c9a0e8" opacity="0.45" transform="rotate(30 26.5 31.5)" />
              <path d="M11 14.5 C10 17 9.8 20 10.5 23" stroke="#e8d0f6" stroke-width="1.4" opacity="0.35" fill="none" stroke-linecap="round" />
            </svg>
            <svg v-else-if="item.id === 'peanut'" viewBox="0 0 40 40">
              <defs>
                <linearGradient id="pea-shell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stop-color="#eec388" />
                  <stop offset="1" stop-color="#d8a55e" />
                </linearGradient>
              </defs>
              <!-- 顶底带不明显尖头的双瓣花生 -->
              <path
                d="M20 3.4 C23 5 25.4 6.4 26.6 9 C28 12 28 16.4 25.9 19 C28 21.6 28 26 26.6 29 C25.4 31.6 23 33 20 34.6 C17 33 14.6 31.6 13.4 29 C12 26 12 21.6 14.1 19 C12 16.4 12 12 13.4 9 C14.6 6.4 17 5 20 3.4 Z"
                fill="url(#pea-shell)"
                stroke="#c08a45"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
              <path d="M14.6 18.2 Q20 16.4 25.4 18.2 M14.6 19.8 Q20 21.6 25.4 19.8" fill="none" stroke="#c08a45" stroke-width="0.9" />
              <g fill="none" stroke="#c08a45" stroke-width="0.7" opacity="0.85">
                <path d="M14.6 9.6 Q17 11.4 19.6 12.6" />
                <path d="M17.2 7 Q19.6 8.8 22.2 10" />
                <path d="M25.4 9.6 Q23 11.4 20.4 12.6" />
                <path d="M22.8 7 Q20.4 8.8 17.8 10" />
                <path d="M16 14.2 Q18 15.4 20 16.2" />
                <path d="M24 14.2 Q22 15.4 20 16.2" />
                <path d="M14.6 24.4 Q17 26.2 19.6 27.4" />
                <path d="M25.4 24.4 Q23 26.2 20.4 27.4" />
                <path d="M16 29 Q18 30.2 20 31" />
                <path d="M24 29 Q22 30.2 20 31" />
              </g>
              <path d="M19 3.8 Q20 2.2 21 3.8" fill="none" stroke="#c08a45" stroke-width="1" stroke-linecap="round" />
              <path d="M14.8 8.6 Q13.4 12 13.4 15.6" stroke="#ffffff" stroke-width="1.4" opacity="0.3" fill="none" stroke-linecap="round" />
            </svg>
            <svg v-else-if="item.id === 'cherry'" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="cherry-g" cx="0.35" cy="0.3" r="0.95">
                  <stop offset="0" stop-color="#e8455a" />
                  <stop offset="0.6" stop-color="#c22036" />
                  <stop offset="1" stop-color="#8f1226" />
                </radialGradient>
              </defs>
              <!-- 一根果枝分出两个果柄，各挂一颗樱桃 -->
              <g fill="none" stroke="#5a7a3a" stroke-width="1.8" stroke-linecap="round">
                <path d="M21.5 4 C18.5 8 16 13 15.2 19" />
                <path d="M21.5 4 C24 8.5 26 13.5 26.8 19.6" />
                <path d="M21.5 4 C22.6 3.2 24 2.8 25.2 3" />
              </g>
              <ellipse cx="25" cy="2.8" rx="2.6" ry="1.3" fill="#6f9c48" transform="rotate(-18 25 2.8)" />
              <circle cx="14.8" cy="26.5" r="7.6" fill="url(#cherry-g)" />
              <circle cx="27.2" cy="27.5" r="7.6" fill="url(#cherry-g)" />
              <ellipse cx="12.2" cy="23.4" rx="2.5" ry="1.7" fill="#ffffff" opacity="0.35" transform="rotate(-24 12.2 23.4)" />
              <ellipse cx="24.6" cy="24.4" rx="2.3" ry="1.6" fill="#ffffff" opacity="0.3" transform="rotate(-24 24.6 24.4)" />
            </svg>
            <svg v-else viewBox="0 0 40 40">
              <defs>
                <radialGradient id="walnut-g" cx="0.38" cy="0.3" r="0.95">
                  <stop offset="0" stop-color="#b98a55" />
                  <stop offset="0.55" stop-color="#96683a" />
                  <stop offset="1" stop-color="#6e4a24" />
                </radialGradient>
              </defs>
              <!-- 核桃壳：两瓣合抱 + 中缝 + 皱褶 -->
              <path d="M20 4.5 C29 4.5 34.5 11 34.5 19.5 C34.5 28.5 28.5 35.5 20 35.5 C11.5 35.5 5.5 28.5 5.5 19.5 C5.5 11 11 4.5 20 4.5 Z" fill="url(#walnut-g)" stroke="#5c3d1e" stroke-width="1.1" />
              <path d="M20 5 C17 11 16.5 20 17.5 28 C18 31.5 19 34 20 35.5" fill="none" stroke="#5c3d1e" stroke-width="1.4" opacity="0.8" />
              <g fill="none" stroke="#6e4a24" stroke-width="1" opacity="0.7" stroke-linecap="round">
                <path d="M11 12 C13.5 13.5 14.5 16 14 18.5" />
                <path d="M9.5 18 C12 19 13 21 12.5 23.5" />
                <path d="M29 12 C26.5 13.5 25.5 16 26 18.5" />
                <path d="M30.5 18 C28 19 27 21 27.5 23.5" />
                <path d="M14 27 C16.5 27.5 18 29 18.5 31" />
                <path d="M26 27 C23.5 27.5 22 29 21.5 31" />
              </g>
              <path d="M12 9.5 C10.5 12 9.8 14.5 10 17" stroke="#e8c48f" stroke-width="1.6" opacity="0.4" fill="none" stroke-linecap="round" />
            </svg>
          </span>
        </button>
      </Transition>

      <Transition name="chest-appear">
        <button
          v-if="chestState !== 'gone'"
          ref="chestEl"
          class="treasure-chest"
          :class="{ open: chestState === 'opening', shaking: chestState === 'shaking', 'has-items': collectedCount > 0 }"
          type="button"
          :aria-label="chestLabel"
          title="松鼠的宝箱"
          @click="handleChestClick"
        >
          <span class="chest-hint" :class="{ show: hintShown }" aria-hidden="true">{{ hintText }}</span>
          <svg viewBox="0 0 104 84" class="chest-svg" aria-hidden="true">
            <defs>
              <linearGradient id="chest-wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#a8713f" />
                <stop offset="1" stop-color="#7d4e2a" />
              </linearGradient>
              <linearGradient id="chest-lid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#bd8449" />
                <stop offset="1" stop-color="#8f5a30" />
              </linearGradient>
              <linearGradient id="chest-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#f6c15a" />
                <stop offset="1" stop-color="#d99a2b" />
              </linearGradient>
            </defs>

            <!-- 箱身：木板 + 板缝 + 底脚 + 金属包边 -->
            <g class="chest-body-g">
              <rect x="10" y="40" width="84" height="33" rx="6" fill="url(#chest-wood)" />
              <line x1="14" y1="51" x2="90" y2="51" stroke="#6a3f1f" stroke-width="1.1" opacity="0.45" />
              <line x1="12" y1="62" x2="92" y2="62" stroke="#6a3f1f" stroke-width="1.1" opacity="0.45" />
              <rect x="15" y="71" width="12" height="5" rx="1.6" fill="#5c3418" />
              <rect x="77" y="71" width="12" height="5" rx="1.6" fill="#5c3418" />
              <path d="M10 46 a6 6 0 0 1 6 -6 h4.5 v33 h-4.5 a6 6 0 0 1 -6 -6 z" fill="url(#chest-gold)" />
              <path d="M94 46 a6 6 0 0 0 -6 -6 h-4.5 v33 h4.5 a6 6 0 0 0 6 -6 z" fill="url(#chest-gold)" />
              <circle cx="17.2" cy="45.5" r="1.2" fill="#8a5a1a" />
              <circle cx="17.2" cy="66.5" r="1.2" fill="#8a5a1a" />
              <circle cx="86.8" cy="45.5" r="1.2" fill="#8a5a1a" />
              <circle cx="86.8" cy="66.5" r="1.2" fill="#8a5a1a" />
              <!-- 中央锁板 + 钥匙孔 -->
              <rect x="45" y="46" width="14" height="13" rx="3" fill="url(#chest-gold)" stroke="#8a5a1a" stroke-width="0.8" />
              <circle cx="52" cy="50.6" r="2" fill="#6a3f1f" />
              <path d="M51.1 51.6 L52 56.4 L52.9 51.6 Z" fill="#6a3f1f" />
            </g>

            <!-- 箱口内部（开盖时露出，金光宝物堆随收集进度长高） -->
            <g class="chest-inside">
              <path d="M16 40 v-2 C16 22 32 13 52 13 C72 13 88 22 88 38 v2 Z" fill="#3f2010" />
              <g class="chest-pile" :style="{ transform: `scaleX(${pileScale})` }">
                <ellipse cx="52" cy="35" rx="17" ry="7.5" fill="url(#chest-gold)" />
                <ellipse cx="52" cy="33" rx="10.5" ry="5" fill="#ffe9a8" opacity="0.9" />
              </g>
            </g>

            <!-- 拱形箱盖：板缝 + 盖沿金属条 + 锁鼻 -->
            <g class="chest-lid-g">
              <path d="M12 40 v-3 C12 17 30 6.5 52 6.5 C74 6.5 92 17 92 37 v3 Z" fill="url(#chest-lid)" />
              <path d="M31 39 C31 25 39 14.5 45.5 10.6" fill="none" stroke="#6a3f1f" stroke-width="1" opacity="0.4" />
              <path d="M73 39 C73 25 65 14.5 58.5 10.6" fill="none" stroke="#6a3f1f" stroke-width="1" opacity="0.4" />
              <rect x="12" y="33.4" width="80" height="3.4" rx="1.7" fill="url(#chest-gold)" opacity="0.95" />
              <rect x="46" y="34" width="12" height="8.6" rx="2.5" fill="url(#chest-gold)" stroke="#8a5a1a" stroke-width="0.8" />
              <circle cx="52" cy="37.4" r="1.7" fill="#6a3f1f" />
              <path d="M22 36 C22 22 32 12.6 44 9" fill="none" stroke="#ffe9c2" stroke-width="1.6" opacity="0.35" stroke-linecap="round" />
            </g>

            <!-- 装了宝物时箱缝透出的金光 -->
            <rect class="chest-seam" x="14" y="38.4" width="76" height="2.8" rx="1.4" fill="#ffe9a8" />
          </svg>
        </button>
      </Transition>
    </div>
  </ClientOnly>
</template>

<style scoped>
/* ── 全局漂浮宝物（纯 SVG，无底色）── */

.harvest-item {
  position: fixed;
  z-index: 400;
  display: block;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: grab;
  padding: 0;
  touch-action: none;
  filter: drop-shadow(0 6px 10px rgba(98, 42, 18, 0.22));
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
}

.harvest-item:hover,
.harvest-item:active {
  background: transparent;
}

.harvest-item:hover {
  transform: scale(1.16) rotate(-4deg);
  filter: drop-shadow(0 10px 16px rgba(217, 75, 38, 0.32));
}

.harvest-item:active {
  transform: scale(0.92);
}

.harvest-item-ico {
  display: block;
  width: 100%;
  height: 100%;
  animation: harvest-float 5.5s ease-in-out infinite;
}

.harvest-item-ico svg {
  display: block;
  width: 100%;
  height: 100%;
}

@keyframes harvest-float {
  0%, 100% {
    transform: translateY(0) rotate(var(--harvest-rot, 0deg));
  }
  50% {
    transform: translateY(-12px) rotate(calc(var(--harvest-rot, 0deg) + 8deg));
  }
}

/* 粘在刺猬背上：跟随移动（与刺猬爬行同节奏的过渡） */
.harvest-item.stuck {
  z-index: 402;
  transform: scale(0.88) rotate(-8deg);
  transition:
    left 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    top 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95),
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    filter 0.25s ease;
}

/* 刺猬被拖拽时立即贴附，不使用过渡 */
.harvest-item.stuck.follow-instant {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
}

/* 收集 / 重新撒落时的弹跳入场 */
.harvest-pop-enter-active {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.harvest-pop-enter-from {
  transform: scale(0) rotate(-40deg);
  opacity: 0;
}

/* ── 松鼠的宝箱 ── */

.treasure-chest {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 400;
  display: grid;
  justify-items: center;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.treasure-chest:hover,
.treasure-chest:active {
  background: transparent;
}

.chest-svg {
  display: block;
  width: 66px;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 8px 14px rgba(98, 42, 18, 0.25));
  animation: chest-bob 3.4s ease-in-out infinite;
  transition: filter 0.3s ease;
}

.treasure-chest:hover .chest-svg {
  filter: drop-shadow(0 10px 18px rgba(217, 75, 38, 0.35));
}

.treasure-chest.has-items .chest-svg {
  filter: drop-shadow(0 0 12px rgba(246, 193, 90, 0.55)) drop-shadow(0 8px 14px rgba(98, 42, 18, 0.25));
}

@keyframes chest-bob {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.chest-lid-g {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.treasure-chest.open .chest-lid-g {
  transform: translateY(-15px) rotate(-13deg) scaleY(0.62);
}

.chest-pile {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chest-seam {
  opacity: 0;
  filter: blur(1px);
  transition: opacity 0.3s ease;
}

.treasure-chest.has-items:not(.open) .chest-seam {
  animation: seam-pulse 1.8s ease-in-out infinite;
}

@keyframes seam-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.treasure-chest.shaking {
  animation: chest-shake 0.62s ease-in-out;
}

@keyframes chest-shake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-4deg); }
  40% { transform: rotate(4deg); }
  60% { transform: rotate(-3deg); }
  80% { transform: rotate(3deg); }
}

/* 宝箱消失 / 重现 */
.chest-appear-enter-active {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.chest-appear-leave-active {
  transition: transform 0.5s cubic-bezier(0.6, -0.05, 0.7, 0.4), opacity 0.45s ease;
}

.chest-appear-enter-from {
  transform: scale(0) rotate(-8deg);
  opacity: 0;
}

.chest-appear-leave-to {
  transform: scale(0.1) rotate(10deg) translateY(10px);
  opacity: 0;
}

/* 点击宝箱的提示气泡 */
.chest-hint {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  width: max-content;
  max-width: 176px;
  transform: translateX(-50%) translateY(4px);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  box-shadow: 0 6px 18px rgba(98, 42, 18, 0.18);
  color: var(--text);
  font-size: 12px;
  opacity: 0;
  padding: 5px 10px;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.chest-hint.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── 飞行克隆体 / 金币（挂在 body 上，需全局样式）── */

:global(.harvest-fly) {
  position: fixed;
  z-index: 1200;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  pointer-events: none;
}

:global(.harvest-fly svg) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 14px rgba(98, 42, 18, 0.35));
}

:global(.harvest-coin) {
  position: fixed;
  z-index: 1200;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffe9a8 0%, #f6c15a 55%, #c9891e 100%);
  box-shadow: inset 0 0 0 2px rgba(201, 137, 30, 0.65), 0 2px 6px rgba(138, 90, 26, 0.4);
  pointer-events: none;
}

:global(.harvest-sparkle) {
  position: fixed;
  z-index: 1200;
  font-size: 15px;
  line-height: 1;
  pointer-events: none;
}

/* ── 响应式：窄屏移到右下角，避开回到顶部按钮的常规位 ── */

@media (max-width: 920px) {
  .treasure-chest {
    right: 16px;
    bottom: 16px;
    left: auto;
  }

  .harvest-item {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 520px) {
  .harvest-item {
    width: 36px;
    height: 36px;
  }

  .chest-svg {
    width: 56px;
  }
}
</style>
