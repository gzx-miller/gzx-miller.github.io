<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useCritterGarden } from '../composables/useCritterGarden'
import { useObfuscatedKey } from '../composables/useObfuscatedKey'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import csharp from 'highlight.js/lib/languages/csharp'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cs', csharp)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('jsx', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)

marked.use({ gfm: true, breaks: true })

// dompurify 在 Node/SSR 下导出的是工厂函数，仅在客户端初始化
let purifyReady = false
function initPurify() {
  if (!import.meta.client || purifyReady) return
  purifyReady = true
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

// 回答的 Markdown 渲染 + XSS 净化
const renderedAnswer = computed(() => {
  if (!import.meta.client || !currentAnswer.value) return ''
  initPurify()
  const raw = marked.parse(currentAnswer.value, { async: false }) as string
  return DOMPurify.sanitize(raw)
})

// 流式结束后给代码块做语法高亮
async function highlightAnswer() {
  if (!import.meta.client) return
  await nextTick()
  const root = answerRef.value
  if (!root) return
  root.querySelectorAll<HTMLElement>('pre code:not(.hljs)').forEach((el) => {
    try {
      hljs.highlightElement(el)
    } catch {
      /* 单个代码块高亮失败不影响整体 */
    }
  })
}

interface ChatRecord {
  id: number
  question: string
  answer: string
  reasoning?: string
  model: string
  time: number
}

const MODELS = ['GLM-4.7-Flash', 'glm-4.5-air', 'glm-4.1v-thinking-flashx', 'glm-4.7'] as const
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
// 从 runtimeConfig 读取混淆后的 key，运行时解码还原
const { zhipuApiKey: obfuscatedKey } = useRuntimeConfig().public
const API_KEY = useObfuscatedKey(obfuscatedKey)

const POS_KEY = 'squirrel-pet-pos'
const HISTORY_KEY = 'squirrel-chat-history'
const MODEL_KEY = 'squirrel-chat-model'
const HISTORY_LIMIT = 50
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
    openPanel()
  }
  if (!userPinned) scheduleWander()
  scheduleTip(3200)
}

function handleWindowResize() {
  if (pos.value.x >= 0) {
    pos.value = clampPos(pos.value.x, pos.value.y)
  }
}

// ---------- 空闲爬动 ----------
const crawling = ref(false)
const crawlLeft = ref(false)
const petRef = useTemplateRef<HTMLButtonElement>('petRef')
let wanderTimer = 0
let crawlEndTimer = 0

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scheduleWander() {
  window.clearTimeout(wanderTimer)
  wanderTimer = window.setTimeout(startCrawl, 9000 + Math.random() * 7000)
}

function startCrawl() {
  if (dragging.value || open.value || document.hidden || prefersReducedMotion()) {
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
  const dx = (70 + Math.random() * 130) * (Math.random() > 0.5 ? 1 : -1)
  const dy = (Math.random() - 0.5) * 90
  const target = clampPos(pos.value.x + dx, pos.value.y + dy)
  crawlLeft.value = target.x < pos.value.x
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
const garden = useCritterGarden()
const pricked = ref(false)
let lastPrickAt = 0
let unprickTimer = 0

function onPrick(hedgehogCenter: { x: number; y: number }) {
  const now = Date.now()
  if (now - lastPrickAt < 2600 || dragging.value || open.value) return
  const el = petRef.value
  if (!el) return
  lastPrickAt = now
  const rect = el.getBoundingClientRect()
  if (pos.value.x < 0) pos.value = { x: rect.left, y: rect.top }
  // 沿"刺猬 → 松鼠"方向弹开
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
  '嘿嘿，李子和花生分你一半！',
  '学累了？趴一会儿再出发～',
  '宝箱里藏了好多金币！',
  '欢迎来到小松鼠举栗子 🌰',
  '嘘——我在囤冬粮，别声张 🤫',
]
const tipText = ref('')
const tipVisible = ref(false)
const greeting = ref(false)
let tipShowTimer = 0
let tipHideTimer = 0
let tipWaveTimer = 0
let lastTipIndex = -1

function scheduleTip(delay: number) {
  window.clearTimeout(tipShowTimer)
  tipShowTimer = window.setTimeout(showTip, delay)
}

function showTip() {
  // 拖拽 / 开面板 / 标签页隐藏时先不出声，稍后再试
  if (dragging.value || open.value || document.hidden) {
    scheduleTip(2600)
    return
  }
  let index = Math.floor(Math.random() * TIP_MESSAGES.length)
  if (index === lastTipIndex) index = (index + 1) % TIP_MESSAGES.length
  lastTipIndex = index
  tipText.value = TIP_MESSAGES[index]
  tipVisible.value = true
  greeting.value = true
  window.clearTimeout(tipWaveTimer)
  tipWaveTimer = window.setTimeout(() => {
    greeting.value = false
  }, 2900)
  window.clearTimeout(tipHideTimer)
  // 三秒后渐隐，随机间隔后说下一句
  tipHideTimer = window.setTimeout(() => {
    tipVisible.value = false
    scheduleTip(2400 + Math.random() * 2400)
  }, 3000)
}

function pauseTip() {
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  tipVisible.value = false
  greeting.value = false
}

/** 大喊一句：插播台词，喊完恢复闲聊节奏 */
function shout(text: string) {
  window.clearTimeout(tipShowTimer)
  window.clearTimeout(tipHideTimer)
  window.clearTimeout(tipWaveTimer)
  greeting.value = false
  tipText.value = text
  tipVisible.value = true
  tipHideTimer = window.setTimeout(() => {
    tipVisible.value = false
    scheduleTip(2600)
  }, 1900)
}

// ---------- 面板与对话状态 ----------
const open = ref(false)
const input = ref('')
const selectedModel = ref<string>(MODELS[0])
const streaming = ref(false)
const currentQuestion = ref('')
const currentAnswer = ref('')
const currentReasoning = ref('')
const errorMsg = ref('')
const historyOpen = ref(false)
const history = ref<ChatRecord[]>([])

const inputRef = useTemplateRef<HTMLInputElement>('chatInput')
const answerRef = useTemplateRef<HTMLElement>('answerBody')
let abortCtrl: AbortController | undefined

const hasConversation = computed(
  () => Boolean(currentQuestion.value || currentAnswer.value || errorMsg.value || streaming.value),
)

function openPanel() {
  open.value = true
  historyOpen.value = false
  void nextTick(() => inputRef.value?.focus())
}

function closePanel() {
  open.value = false
  historyOpen.value = false
}

function clearInput() {
  input.value = ''
  inputRef.value?.focus()
}

function stopStreaming() {
  abortCtrl?.abort()
}

function formatTime(time: number) {
  const d = new Date(time)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function persistHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value.slice(0, HISTORY_LIMIT)))
  } catch {
    /* 存储超限时静默失败 */
  }
}

function saveRecord() {
  if (!currentQuestion.value || (!currentAnswer.value && !errorMsg.value)) return
  history.value.unshift({
    id: Date.now(),
    question: currentQuestion.value,
    answer: currentAnswer.value || errorMsg.value,
    reasoning: currentReasoning.value || undefined,
    model: selectedModel.value,
    time: Date.now(),
  })
  if (history.value.length > HISTORY_LIMIT) history.value.length = HISTORY_LIMIT
  persistHistory()
}

function viewRecord(record: ChatRecord) {
  if (streaming.value) stopStreaming()
  currentQuestion.value = record.question
  currentAnswer.value = record.answer
  currentReasoning.value = record.reasoning ?? ''
  errorMsg.value = ''
  historyOpen.value = false
  void highlightAnswer()
}

function removeRecord(id: number) {
  history.value = history.value.filter((item) => item.id !== id)
  persistHistory()
}

function clearHistory() {
  history.value = []
  persistHistory()
}

async function send() {
  const question = input.value.trim()
  if (!question || streaming.value) return

  input.value = ''
  historyOpen.value = false
  currentQuestion.value = question
  currentAnswer.value = ''
  currentReasoning.value = ''
  errorMsg.value = ''
  streaming.value = true
  abortCtrl = new AbortController()

  // 携带最近 3 条历史作为上下文，保持对话连贯
  const contextMessages = history.value
    .slice(0, 3)
    .reverse()
    .flatMap((item) => [
      { role: 'user' as const, content: item.question },
      { role: 'assistant' as const, content: item.answer },
    ])

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel.value,
        stream: true,
        messages: [
          {
            role: 'system',
            content:
              '你是「小松鼠举栗子」中文技术知识案例库网站的 AI 小助手，擅长 Vue3、Nuxt、TypeScript、Node.js 等前后端技术。请用简洁清晰的中文回答，代码示例保持简短可读。',
          },
          ...contextMessages,
          { role: 'user', content: question },
        ],
      }),
      signal: abortCtrl.signal,
    })

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => '')
      throw new Error(`请求失败（${res.status}）${detail ? `：${detail.slice(0, 120)}` : ''}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const payload = trimmed.slice(5).trim()
        if (!payload || payload === '[DONE]') continue
        try {
          const json = JSON.parse(payload)
          const delta = json.choices?.[0]?.delta
          if (delta?.reasoning_content) currentReasoning.value += delta.reasoning_content
          if (delta?.content) currentAnswer.value += delta.content
        } catch {
          /* 忽略无法解析的分片 */
        }
      }
    }
    void highlightAnswer()
    saveRecord()
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      if (currentAnswer.value) {
        void highlightAnswer()
        saveRecord()
      }
    } else {
      errorMsg.value = err instanceof Error ? err.message : '网络异常，请稍后重试'
      saveRecord()
    }
  } finally {
    streaming.value = false
    abortCtrl = undefined
  }
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closePanel()
}

// 点击历史浮层之外的区域时收起历史列表
function handlePanelClick(event: MouseEvent) {
  if (!historyOpen.value) return
  const target = event.target as HTMLElement | null
  if (!target?.closest('.input-zone')) {
    historyOpen.value = false
  }
}

// 流式输出时自动滚动到底部
watch(currentAnswer, async () => {
  await nextTick()
  const el = answerRef.value
  if (el) el.scrollTop = el.scrollHeight
})

// 思考过程流式输出时同步滚动
watch(currentReasoning, async () => {
  await nextTick()
  const pre = answerRef.value?.querySelector('.answer-reasoning pre')
  if (pre) pre.scrollTop = pre.scrollHeight
})

onMounted(() => {
  try {
    const savedPos = localStorage.getItem(POS_KEY)
    if (savedPos) {
      const parsed = JSON.parse(savedPos)
      pos.value = clampPos(Number(parsed.x) || 0, Number(parsed.y) || 0)
    }
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) history.value = JSON.parse(savedHistory)
    const savedModel = localStorage.getItem(MODEL_KEY)
    if (savedModel && (MODELS as readonly string[]).includes(savedModel)) {
      selectedModel.value = savedModel
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

watch(selectedModel, (value) => {
  try {
    localStorage.setItem(MODEL_KEY, value)
  } catch {
    /* 忽略 */
  }
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
  abortCtrl?.abort()
})
</script>

<template>
  <!-- 悬浮松鼠宠物 -->
  <button
    ref="petRef"
    type="button"
    class="squirrel-pet"
    :class="{ dragging, crawling, 'crawl-left': crawlLeft, waving: greeting, pricked }"
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
              <g stroke="#f6c15a" stroke-width="1.6" stroke-linecap="round" opacity="0.75" fill="none">
                <path d="M114 93 L121 99" />
                <path d="M124 70 L132 72" />
                <path d="M126 45 L134 44" />
                <path d="M119 22 L126 16" />
                <path d="M105 8 L109 1" />
                <path d="M91 4 L93 -2" />
              </g>
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

  <!-- 对话浮层 -->
  <Teleport to="body">
    <Transition name="assistant-fade">
      <div
        v-if="open"
        class="assistant-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="松鼠小助手对话面板"
        @click.self="closePanel"
        @keydown="handlePanelKeydown"
      >
        <div class="assistant-panel" @click="handlePanelClick">
          <button type="button" class="panel-close" aria-label="关闭对话面板" @click="closePanel">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>

          <div class="panel-header">
            <span class="panel-title">🌰 松鼠小助手</span>
            <div class="model-chips" role="radiogroup" aria-label="切换 AI 模型">
              <button
                v-for="model in MODELS"
                :key="model"
                type="button"
                class="model-chip"
                :class="{ active: model === selectedModel }"
                role="radio"
                :aria-checked="model === selectedModel"
                @click="selectedModel = model"
              >
                {{ model }}
              </button>
            </div>
          </div>

          <div class="input-zone">
            <div class="chat-input-bar">
              <button
                type="button"
                class="bar-btn history-btn"
                :class="{ active: historyOpen }"
                aria-label="展开历史记录"
                title="历史记录"
                @click="historyOpen = !historyOpen"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15.5 14" />
                </svg>
              </button>
              <input
                ref="chatInput"
                v-model="input"
                type="text"
                class="chat-input"
                placeholder="问小松鼠一个问题…"
                autocomplete="off"
                @keydown.enter="send"
              />
              <Transition name="assistant-fade">
                <button
                  v-if="input"
                  type="button"
                  class="bar-btn clear-btn"
                  aria-label="清空输入"
                  title="清空"
                  @click="clearInput"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="9" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </button>
              </Transition>
              <button
                type="button"
                class="send-btn"
                :disabled="!input.trim() || streaming"
                aria-label="发送问题"
                title="发送"
                @click="send"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>

            <!-- 历史记录列表 -->
            <Transition name="assistant-fade">
              <div v-if="historyOpen" class="history-panel">
                <div class="history-head">
                  <span>历史记录（{{ history.length }}）</span>
                  <button v-if="history.length" type="button" class="history-clear" @click="clearHistory">
                    清空
                  </button>
                </div>
                <p v-if="!history.length" class="history-empty">还没有问过问题，快来第一个提问吧～</p>
                <ul v-else class="history-list">
                  <li v-for="record in history" :key="record.id" class="history-item">
                    <button type="button" class="history-item-main" @click="viewRecord(record)">
                      <span class="history-question">{{ record.question }}</span>
                      <span class="history-meta">{{ formatTime(record.time) }} · {{ record.model }}</span>
                    </button>
                    <button
                      type="button"
                      class="history-delete"
                      :aria-label="`删除记录：${record.question}`"
                      @click="removeRecord(record.id)"
                    >
                      ×
                    </button>
                  </li>
                </ul>
              </div>
            </Transition>
          </div>

          <!-- 回答区域 -->
          <Transition name="assistant-fade">
            <div v-if="hasConversation" ref="answerBody" class="answer-card">
              <div v-if="currentQuestion" class="answer-question">
                <span class="answer-tag">问</span>
                <p>{{ currentQuestion }}</p>
              </div>
              <details v-if="currentReasoning" class="answer-reasoning" :open="streaming">
                <summary>{{ streaming ? '思考过程（实时输出中…）' : '思考过程' }}</summary>
                <pre>{{ currentReasoning }}<span v-if="streaming && !currentAnswer" class="stream-cursor" /></pre>
              </details>
              <div class="answer-content">
                <span v-if="errorMsg" class="answer-error">{{ errorMsg }}</span>
                <template v-else>
                  <p v-if="!currentAnswer && streaming" class="answer-thinking">小松鼠正在翻找栗子…</p>
                  <div v-else class="answer-text md-body" v-html="renderedAnswer"></div>
                  <span v-if="streaming && currentAnswer" class="stream-cursor" />
                </template>
              </div>
              <div class="answer-footer">
                <span class="answer-model">{{ selectedModel }}</span>
                <button v-if="streaming" type="button" class="stop-btn" @click="stopStreaming">停止生成</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
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

/* 爬行：朝向翻转 + 身体左右摇摆 */
.pet-flip,
.pet-wobble {
  display: block;
}

.squirrel-pet.crawl-left .pet-flip {
  transform: scaleX(-1);
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

/* ---------- 遮罩与面板 ---------- */
.assistant-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 9vh 16px 24px;
  background: rgba(50, 25, 15, 0.35);
  backdrop-filter: blur(3px);
}

[data-theme='dark'] .assistant-backdrop {
  background: rgba(0, 0, 0, 0.55);
}

.assistant-panel {
  position: relative;
  width: min(860px, 100%);
  padding: 24px 28px 26px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.panel-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}

.panel-close:hover {
  color: var(--accent-strong);
  background: var(--surface-soft);
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  padding-right: 36px;
  margin-bottom: 14px;
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-strong);
}

.model-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.model-chip {
  padding: 4px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 13px;
  line-height: 1.7;
  color: var(--muted);
  background: var(--surface-soft);
  cursor: pointer;
  transition: all 0.15s ease;
}

.model-chip:hover {
  border-color: var(--leaf-gold);
  color: var(--text);
}

.model-chip.active {
  border-color: transparent;
  color: #fffaf2;
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  box-shadow: 0 4px 10px rgba(143, 47, 24, 0.28);
}

/* ---------- 输入区 ---------- */
.input-zone {
  position: relative;
}

.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 6px 12px;
  border-radius: 999px;
  border: 1.5px solid var(--border);
  background: var(--bg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.chat-input-bar:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--leaf-orange) 26%, transparent);
}

.bar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  line-height: 1;
  border: none;
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
}

.bar-btn svg {
  display: block;
  width: 18px;
  height: 18px;
}

.bar-btn:hover,
.bar-btn.active {
  color: var(--accent-strong);
  background: var(--surface-soft);
}

.chat-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--text);
  background: transparent;
}

.chat-input::placeholder {
  color: var(--muted);
  opacity: 0.75;
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 38px;
  height: 38px;
  padding: 0;
  line-height: 1;
  border: none;
  border-radius: 999px;
  color: #fffaf2;
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  box-shadow: 0 4px 12px rgba(143, 47, 24, 0.32);
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.send-btn svg {
  display: block;
  width: 20px;
  height: 20px;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.06);
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

/* ---------- 历史记录 ---------- */
.history-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 360px;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-strong);
  border-bottom: 1px solid var(--border);
}

.history-clear {
  border: none;
  font-size: 12px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
}

.history-clear:hover {
  color: var(--leaf-red);
}

.history-empty {
  margin: 0;
  padding: 18px 14px;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
}

.history-list {
  margin: 0;
  padding: 6px;
  list-style: none;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 10px;
}

.history-item:hover {
  background: var(--surface-soft);
}

.history-item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border: none;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.history-question {
  font-size: 13px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-meta {
  font-size: 11px;
  color: var(--muted);
}

.history-delete {
  flex: none;
  width: 26px;
  height: 26px;
  margin-right: 6px;
  border: none;
  border-radius: 50%;
  font-size: 15px;
  line-height: 1;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
}

.history-delete:hover {
  color: #fffaf2;
  background: var(--leaf-red);
}

/* ---------- 回答卡片 ---------- */
.answer-card {
  margin-top: 16px;
  max-height: 58vh;
  overflow-y: auto;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.answer-question {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dashed var(--border);
}

.answer-question p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  word-break: break-word;
}

.answer-tag {
  flex: none;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fffaf2;
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
}

.answer-reasoning {
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--muted);
}

.answer-reasoning summary {
  cursor: pointer;
  font-weight: 600;
}

.answer-reasoning pre {
  margin: 6px 0 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--surface-soft);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  max-height: 180px;
  overflow-y: auto;
}

.answer-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text);
  white-space: normal;
  word-break: break-word;
}

.answer-thinking {
  margin: 0;
  font-size: 15px;
  color: var(--muted);
  animation: thinking-pulse 1.4s ease-in-out infinite;
}

@keyframes thinking-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.stream-cursor {
  display: inline-block;
  width: 8px;
  height: 16px;
  margin-left: 2px;
  vertical-align: -2px;
  border-radius: 2px;
  background: linear-gradient(180deg, var(--leaf-red), var(--leaf-orange));
  animation: cursor-blink 0.9s steps(2) infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.answer-error {
  font-size: 14px;
  color: var(--leaf-red);
}

.answer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}

.answer-model {
  font-size: 11px;
  color: var(--muted);
}

.stop-btn {
  padding: 3px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 12px;
  color: var(--muted);
  background: var(--surface);
  cursor: pointer;
  transition: all 0.15s ease;
}

.stop-btn:hover {
  color: var(--leaf-red);
  border-color: var(--leaf-red);
}

/* ---------- 过渡动画 ---------- */
.assistant-fade-enter-active,
.assistant-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.assistant-fade-enter-from,
.assistant-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .assistant-backdrop {
    padding-top: 8vh;
  }

  .assistant-panel {
    padding: 16px 14px 18px;
  }

  .squirrel-pet {
    width: 64px;
    height: 64px;
  }
}
</style>

<!-- Markdown 正文样式：v-html 注入的内容无法命中 scoped 选择器，故使用非 scoped 块 -->
<style>
.md-body {
  white-space: normal;
}

.md-body > :first-child {
  margin-top: 0;
}

.md-body > :last-child {
  margin-bottom: 0;
}

.md-body p {
  margin: 0.55em 0;
}

.md-body h1,
.md-body h2,
.md-body h3,
.md-body h4,
.md-body h5,
.md-body h6 {
  margin: 0.95em 0 0.45em;
  line-height: 1.4;
  color: var(--accent-strong);
}

.md-body h1 { font-size: 1.35em; }
.md-body h2 { font-size: 1.24em; }
.md-body h3 { font-size: 1.12em; }
.md-body h4 { font-size: 1.05em; }
.md-body h5,
.md-body h6 { font-size: 1em; }

.md-body ul,
.md-body ol {
  margin: 0.5em 0;
  padding-left: 1.6em;
}

.md-body ul { list-style: disc; }
.md-body ol { list-style: decimal; }
.md-body li { margin: 0.28em 0; }
.md-body li > ul,
.md-body li > ol { margin: 0.2em 0; }

.md-body code {
  font-family: Consolas, 'SFMono-Regular', Menlo, 'Courier New', monospace;
  font-size: 0.88em;
  padding: 0.15em 0.42em;
  border-radius: 6px;
  background: var(--surface-soft);
  color: var(--chestnut);
}

.md-body pre {
  margin: 0.7em 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface-soft);
  overflow-x: auto;
}

.md-body pre code {
  display: block;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  line-height: 1.7;
}

.md-body blockquote {
  margin: 0.7em 0;
  padding: 6px 14px;
  border-left: 3px solid var(--leaf-gold);
  border-radius: 0 10px 10px 0;
  background: var(--surface-soft);
  color: var(--muted);
}

.md-body blockquote p { margin: 0.3em 0; }

.md-body a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.md-body table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  margin: 0.7em 0;
  font-size: 0.95em;
}

.md-body th,
.md-body td {
  border: 1px solid var(--border);
  padding: 6px 10px;
  text-align: left;
}

.md-body th {
  background: var(--surface-soft);
  font-weight: 600;
}

.md-body hr {
  border: none;
  border-top: 1px dashed var(--border);
  margin: 1em 0;
}

.md-body img {
  max-width: 100%;
  border-radius: 10px;
}

/* 暗色主题下覆盖 github.css 的浅色高亮 token */
[data-theme='dark'] .md-body .hljs-comment,
[data-theme='dark'] .md-body .hljs-quote { color: #8b949e; }
[data-theme='dark'] .md-body .hljs-keyword,
[data-theme='dark'] .md-body .hljs-selector-tag,
[data-theme='dark'] .md-body .hljs-tag { color: #ff7b72; }
[data-theme='dark'] .md-body .hljs-string,
[data-theme='dark'] .md-body .hljs-attr,
[data-theme='dark'] .md-body .hljs-template-tag { color: #a5d6ff; }
[data-theme='dark'] .md-body .hljs-number,
[data-theme='dark'] .md-body .hljs-literal,
[data-theme='dark'] .md-body .hljs-built_in,
[data-theme='dark'] .md-body .hljs-symbol { color: #79c0ff; }
[data-theme='dark'] .md-body .hljs-function,
[data-theme='dark'] .md-body .hljs-title,
[data-theme='dark'] .md-body .hljs-title.function_,
[data-theme='dark'] .md-body .hljs-params { color: #d2a8ff; }
[data-theme='dark'] .md-body .hljs-variable,
[data-theme='dark'] .md-body .hljs-template-variable,
[data-theme='dark'] .md-body .hljs-attribute { color: #ffa657; }
[data-theme='dark'] .md-body .hljs-name,
[data-theme='dark'] .md-body .hljs-selector-class { color: #7ee787; }
[data-theme='dark'] .md-body .hljs-meta,
[data-theme='dark'] .md-body .hljs-type { color: #79c0ff; }
[data-theme='dark'] .md-body .hljs-emphasis { font-style: italic; }
[data-theme='dark'] .md-body .hljs-strong { font-weight: 700; }
</style>
