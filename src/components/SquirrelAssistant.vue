<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useAssistantBus } from '../composables/useAssistantBus'
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

const HISTORY_KEY = 'squirrel-chat-history'
const MODEL_KEY = 'squirrel-chat-model'
const HISTORY_LIMIT = 50

// ---------- 面板与对话状态 ----------
const { requestOpen, consumeOpenRequest } = useAssistantBus()
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
              '你是「小松鼠举栗子」中文技术知识内容库网站的 AI 小助手，擅长 Vue3、Nuxt、TypeScript、Node.js 等前后端技术。请用简洁清晰的中文回答，代码示例保持简短可读。',
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
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) history.value = JSON.parse(savedHistory)
    const savedModel = localStorage.getItem(MODEL_KEY)
    if (savedModel && (MODELS as readonly string[]).includes(savedModel)) {
      selectedModel.value = savedModel
    }
  } catch {
    /* 本地数据损坏时忽略 */
  }
  // 松鼠壳层在用户点击时置位 requestOpen，这里消费掉并直接展开面板，
  // 让「一次点击 → 面板出现」在观感上仍然是即时的。
  if (consumeOpenRequest()) openPanel()
})

// 关闭面板时复位信号，并通知壳层恢复闲逛
watch(open, (isOpen) => {
  if (!isOpen) requestOpen.value = false
})

watch(selectedModel, (value) => {
  try {
    localStorage.setItem(MODEL_KEY, value)
  } catch {
    /* 忽略 */
  }
})

onUnmounted(() => {
  abortCtrl?.abort()
})

// 面板已加载后，壳层再次点击松鼠时直接展开（此时无需再走动态加载）
watch(requestOpen, (requested) => {
  if (requested && !open.value) openPanel()
})
</script>

<template>
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
