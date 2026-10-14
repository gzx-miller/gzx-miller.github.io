<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface ChatMsg {
  role: 'user' | 'ai'
  text: string
  source?: string
}

const sessions = reactive<Record<string, ChatMsg[]>>({
  'session-1': [],
  'session-2': [],
})
const currentThread = ref('session-1')
const draft = ref('')
const storeProfile = ref<Record<string, string>>({})
const storeWrites = ref<string[]>([])
const thinking = ref(false)

const currentMessages = computed(() => sessions[currentThread.value])

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function strip(text: string) {
  return text.trim()
}

async function send() {
  if (thinking.value || !strip(draft.value)) return
  const text = strip(draft.value)
  draft.value = ''
  sessions[currentThread.value].push({ role: 'user', text })
  thinking.value = true
  await sleep(650)

  const nameMatch = text.match(/我叫([^\s，,。!！]{1,4})/)
  const topicMatch = text.match(/学([^\s，,。!！]{1,12})/)

  if (nameMatch) {
    // 长期记忆写入：从本轮对话中提炼档案并存入 Store
    storeProfile.value.name = nameMatch[1]
    if (topicMatch) storeProfile.value.topic = topicMatch[1]
    storeProfile.value.updated_at = new Date().toLocaleTimeString('zh-CN', { hour12: false })
    storeWrites.value.unshift(`store.put(['profiles','student-01'], { name: '${nameMatch[1]}'${topicMatch ? `, topic: '${topicMatch[1]}'` : ''} })`)
    sessions[currentThread.value].push({
      role: 'ai',
      text: `记住了，${nameMatch[1]}！我已把这条信息写入长期记忆，换个会话我也能想起你。`,
      source: '本轮对话 + 写入 Store',
    })
    thinking.value = false
    return
  }

  const askWho = /我叫什么|我是谁|还记得我|记得我吗/.test(text)
  if (askWho) {
    const fromHistory = currentMessages.value.some((m) => m.role === 'user' && /我叫/.test(m.text))
    if (fromHistory && storeProfile.value.name) {
      sessions[currentThread.value].push({
        role: 'ai',
        text: `你是 ${storeProfile.value.name}${storeProfile.value.topic ? `，正在学 ${storeProfile.value.topic}` : ''}。这是从本次会话的历史消息里读到的。`,
        source: '短期记忆：本 thread 的历史消息',
      })
    } else if (storeProfile.value.name) {
      sessions[currentThread.value].push({
        role: 'ai',
        text: `记得，你是 ${storeProfile.value.name}${storeProfile.value.topic ? `，正在学 ${storeProfile.value.topic}` : ''}。本会话历史是空的，这条信息来自长期记忆。`,
        source: '长期记忆：Store 档案',
      })
    } else {
      sessions[currentThread.value].push({
        role: 'ai',
        text: '会话历史是空的，长期档案里也没有你的信息——我们好像还没正式见过。',
        source: '短期与长期记忆都未命中',
      })
    }
    thinking.value = false
    return
  }

  sessions[currentThread.value].push({
    role: 'ai',
    text: `收到：「${text}」。本次会话里我能记住这段对话（短期记忆）${storeProfile.value.name ? `；也仍然记得你是 ${storeProfile.value.name}（长期记忆）。` : '；但换个会话我就会忘记，除非写入 Store。'}`,
    source: '短期记忆：本 thread 的历史消息',
  })
  thinking.value = false
}
</script>

<template>
  <div class="demo-card">
    <h3>短期与长期记忆</h3>
    <p class="demo-desc">
      先发送「我叫小明，正在学 LangGraph」，再切到会话 2 追问「还记得我是谁吗」：会话历史清空了，但 Store 里的长期档案还在。气泡下方标注了每条回答的记忆来源。
    </p>

    <div class="controls">
      <button
        v-for="thread in ['session-1', 'session-2']"
        :key="thread"
        class="mini-btn"
        :class="{ active: currentThread === thread }"
        type="button"
        @click="currentThread = thread"
      >
        {{ thread === 'session-1' ? '会话 1' : '会话 2（新）' }}
      </button>
      <span class="hint">thread_id 不同 = 短期记忆互不相通</span>
    </div>

    <div class="grid-2">
      <div class="lg-panel">
        <h4>对话窗口（{{ currentThread }}）</h4>
        <div class="lg-chat-log">
          <p v-if="!currentMessages.length" class="hint">本会话还没有消息。{{ currentThread === 'session-2' ? '短期记忆已随切换清空。' : '' }}</p>
          <div v-for="(msg, i) in currentMessages" :key="i" class="lg-chat-msg" :class="msg.role">
            <span class="lg-chat-bubble">{{ msg.text }}</span>
            <span v-if="msg.source" class="lg-chat-source">{{ msg.source }}</span>
          </div>
        </div>
        <div class="controls">
          <input v-model="draft" type="text" :disabled="thinking" placeholder="试着说：我叫小明，正在学 LangGraph" @keydown.enter="send" />
          <button class="btn" type="button" :disabled="thinking" @click="send">{{ thinking ? '思考中…' : '发送' }}</button>
        </div>
      </div>

      <div class="lg-panel">
        <h4>长期记忆 Store（跨会话）</h4>
        <div class="lg-kv"><span>namespace</span><strong>['profiles', 'student-01']</strong></div>
        <div class="lg-kv"><span>name</span><strong>{{ storeProfile.name ?? '（空）' }}</strong></div>
        <div class="lg-kv"><span>topic</span><strong>{{ storeProfile.topic ?? '（空）' }}</strong></div>
        <div class="lg-kv"><span>updated_at</span><strong>{{ storeProfile.updated_at ?? '—' }}</strong></div>
        <h4 style="margin-top: 12px">写入记录</h4>
        <p v-if="!storeWrites.length" class="hint">还没有写入长期记忆。</p>
        <p v-for="(w, i) in storeWrites" :key="i" class="lg-log-line">{{ w }}</p>
        <p class="hint">Store 与 thread 无关：清空对话、更换会话都不影响它，适合放用户偏好、画像这类长期数据。</p>
      </div>
    </div>
  </div>
</template>
