const e=`<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'

interface Note {
  id: number
  content: string
  mood: 'happy' | 'calm' | 'melancholy' | 'energetic'
  createdAt: number
}

const useJournalStore = defineStore('journal', () => {
  const notes = ref<Note[]>([
    { id: 1, content: '今天在林间散步，落叶铺满了小径', mood: 'calm', createdAt: Date.now() - 86400000 },
    { id: 2, content: '喝了一杯暖暖的肉桂拿铁，幸福满满', mood: 'happy', createdAt: Date.now() - 3600000 },
  ])
  const currentMood = ref<'happy' | 'calm' | 'melancholy' | 'energetic'>('calm')
  const themeName = ref<'forest' | 'sunset' | 'autumn'>('autumn')

  function addNote(content: string, mood: Note['mood']) {
    notes.value.unshift({
      id: Date.now(),
      content,
      mood,
      createdAt: Date.now(),
    })
  }

  function deleteNote(id: number) {
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx > -1) notes.value.splice(idx, 1)
  }

  function setMood(mood: Note['mood']) {
    currentMood.value = mood
  }

  function setTheme(name: typeof themeName.value) {
    themeName.value = name
  }

  return { notes, currentMood, themeName, addNote, deleteNote, setMood, setTheme }
})

const store = useJournalStore()
const { notes, currentMood, themeName } = storeToRefs(store)

interface HistoryEntry {
  id: number
  action: string
  state: any
  timestamp: number
}

const history = ref<HistoryEntry[]>([])
const historyIndex = ref(-1)
const isTimeTraveling = ref(false)
const newNoteContent = ref('')
const selectedMood = ref<Note['mood']>('happy')
const activeTab = ref<'app' | 'timeline' | 'inspector'>('app')
const showCode = ref(false)

function captureState(action: string) {
  if (isTimeTraveling.value) return
  const state = JSON.parse(JSON.stringify({
    notes: notes.value,
    currentMood: currentMood.value,
    themeName: themeName.value,
  }))
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push({ id: Date.now(), action, state, timestamp: Date.now() })
  historyIndex.value = history.value.length - 1
  if (history.value.length > 20) {
    history.value.shift()
    historyIndex.value--
  }
}

watch(() => notes.value.length, () => !isTimeTraveling.value && captureState('notes 更新'))
watch(currentMood, () => !isTimeTraveling.value && captureState('mood 变更'))
watch(themeName, () => !isTimeTraveling.value && captureState('theme 切换'))

function travelTo(index: number) {
  if (index < 0 || index >= history.value.length) return
  isTimeTraveling.value = true
  const entry = history.value[index]
  store.$patch(entry.state)
  historyIndex.value = index
  setTimeout(() => { isTimeTraveling.value = false }, 50)
}

function timeTravel(direction: -1 | 1) {
  travelTo(historyIndex.value + direction)
}

function addNote() {
  if (!newNoteContent.value.trim()) return
  store.addNote(newNoteContent.value.trim(), selectedMood.value)
  newNoteContent.value = ''
}

const moodEmoji = (mood: string) => ({
  happy: '😊', calm: '🍂', melancholy: '🌧️', energetic: '🔥'
} as any)[mood] || '🍁'

const moodLabel = (mood: string) => ({
  happy: '开心', calm: '平静', melancholy: '忧郁', energetic: '元气'
} as any)[mood] || mood

const themeLabel = (t: string) => ({
  forest: '森林', sunset: '日落', autumn: '秋意'
} as any)[t] || t

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const currentState = computed(() => {
  if (historyIndex.value >= 0 && history.value[historyIndex.value]) {
    return JSON.stringify(history.value[historyIndex.value].state, null, 2)
  }
  return '{}'
})
<\/script>

<template>
  <div class="demo-card">
    <h4>🕰️ Pinia DevTools 与时间旅行调试</h4>
    <p>秋日心情日记 — 模拟 DevTools 的时间旅行、状态快照与状态检查</p>

    <div class="tab-row">
      <button :class="{ active: activeTab === 'app' }" @click="activeTab = 'app'">
        📝 应用界面
      </button>
      <button :class="{ active: activeTab === 'timeline' }" @click="activeTab = 'timeline'">
        ⏳ 时间线
      </button>
      <button :class="{ active: activeTab === 'inspector' }" @click="activeTab = 'inspector'">
        🔍 状态检查
      </button>
    </div>

    <div v-if="activeTab === 'app'" class="app-section">
      <div class="mood-selector">
        <span class="label">今天的心情：</span>
        <div class="mood-btns">
          <button
            v-for="mood in ['happy', 'calm', 'melancholy', 'energetic']"
            :key="mood"
            :class="{ active: currentMood === mood }"
            class="mood-btn"
            @click="store.setMood(mood as any)"
          >
            {{ moodEmoji(mood) }} {{ moodLabel(mood) }}
          </button>
        </div>
      </div>

      <div class="theme-selector">
        <span class="label">主题：</span>
        <div class="theme-btns">
          <button
            v-for="t in ['forest', 'sunset', 'autumn']"
            :key="t"
            :class="{ active: themeName === t }"
            class="theme-btn"
            @click="store.setTheme(t as any)"
          >
            {{ themeLabel(t) }}
          </button>
        </div>
      </div>

      <div class="note-input">
        <input v-model="newNoteContent" placeholder="记录今天的秋日心情..." @keyup.enter="addNote" />
        <select v-model="selectedMood" class="mood-select">
          <option value="happy">😊 开心</option>
          <option value="calm">🍂 平静</option>
          <option value="melancholy">🌧️ 忧郁</option>
          <option value="energetic">🔥 元气</option>
        </select>
        <button @click="addNote">添加笔记</button>
      </div>

      <div class="notes-list">
        <h5>📒 日记列表 ({{ notes.length }}篇)</h5>
        <div v-if="notes.length === 0" class="empty-tip">还没有笔记，写点什么吧~</div>
        <div v-else class="notes">
          <article v-for="note in notes" :key="note.id" class="note-card">
            <div class="note-header">
              <span class="note-mood">{{ moodEmoji(note.mood) }}</span>
              <span class="note-time">{{ formatTime(note.createdAt) }}</span>
            </div>
            <p class="note-content">{{ note.content }}</p>
            <button class="delete-btn" @click="store.deleteNote(note.id)">删除</button>
          </article>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'timeline'" class="timeline-section">
      <div class="timeline-controls">
        <button @click="timeTravel(-1)" :disabled="historyIndex <= 0">⏮ 上一步</button>
        <span class="timeline-pos">
          {{ historyIndex + 1 }} / {{ history.length }}
        </span>
        <button @click="timeTravel(1)" :disabled="historyIndex >= history.length - 1">下一步 ⏭</button>
      </div>

      <div v-if="history.length === 0" class="empty-tip">暂无历史记录，先去应用界面操作吧~</div>
      <div v-else class="timeline-list">
        <div
          v-for="(entry, idx) in history"
          :key="entry.id"
          class="timeline-item"
          :class="{ active: idx === historyIndex, future: idx > historyIndex }"
          @click="travelTo(idx)"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-info">
            <span class="timeline-action">{{ entry.action }}</span>
            <span class="timeline-time">{{ formatTime(entry.timestamp) }}</span>
          </div>
          <span class="timeline-badge" v-if="idx === historyIndex">📍 当前</span>
        </div>
      </div>
    </div>

    <div v-else class="inspector-section">
      <h5>📊 当前状态快照</h5>
      <pre class="state-inspector"><code>{{ currentState }}</code></pre>
      <div class="inspector-info">
        <p>📍 历史位置：{{ historyIndex + 1 }} / {{ history.length }}</p>
        <p>📝 笔记数量：{{ notes.length }}</p>
        <p>😊 当前心情：{{ moodEmoji(currentMood) }} {{ moodLabel(currentMood) }}</p>
        <p>🎨 当前主题：{{ themeLabel(themeName) }}</p>
      </div>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 DevTools 原理' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Pinia DevTools 核心能力
// 1. 状态订阅 — 监听所有状态变更
store.$subscribe((mutation, state) =&gt; {
  console.log(\`[\${mutation.type}]\`, state)
  // 保存状态快照用于时间旅行
  saveSnapshot(mutation.type, state)
})

// 2. Action 订阅 — 监听 Action 调用
store.$onAction(({ name, args, after, onError }) =&gt; {
  console.log(\`Action: \${name}\`, args)
  after(result =&gt; console.log(\`\${name} 完成:\`, result))
  onError(error =&gt; console.error(\`\${name} 失败:\`, error))
})

// 3. 热更新 — 开发时修改 Store 不丢状态
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}

// 4. 时间旅行 — 恢复到任意历史状态
function travelTo(snapshot) {
  store.$patch(snapshot.state)
}

// 5. 插件机制 — 为所有 Store 统一添加能力
pinia.use(({ store }) =&gt; {
  store.$onAction(({ name }) =&gt; {
    console.log(\`[DevTools] \${store.$id}.\${name}\`)
  })
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>$subscribe</strong>：订阅状态变化，可用于持久化、日志、时间旅行</li>
        <li><strong>$onAction</strong>：监听 Action 调用，支持 before/after/error 钩子</li>
        <li><strong>时间旅行</strong>：DevTools 通过状态快照实现撤销/重做</li>
        <li><strong>HMR 支持</strong>：修改 Store 代码时热更新，状态不丢失</li>
        <li><strong>插件生态</strong>：通过 pinia.use() 统一扩展所有 Store 能力</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tab-row {
  display: flex;
  gap: 6px;
}
.tab-row button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #efc48d;
  background: #fffaf2;
  color: #7c563f;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s;
}
.tab-row button.active {
  background: linear-gradient(135deg, #d94b26, #f08a24);
  color: #fff;
  border-color: #b7431f;
}

.mood-selector, .theme-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.label { color: #7c563f; font-size: 13px; font-weight: 600; }
.mood-btns, .theme-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.mood-btn, .theme-btn {
  padding: 6px 12px !important;
  font-size: 13px !important;
  border-radius: 999px !important;
  background: #fff !important;
  color: #7b351d !important;
  border: 1px solid #efc48d !important;
}
.mood-btn.active, .theme-btn.active {
  background: linear-gradient(135deg, #f08a24, #d94b26) !important;
  color: #fff !important;
  border-color: #b7431f !important;
}

.note-input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.note-input input { flex: 1; }
.mood-select {
  width: auto !important;
  padding: 8px 12px !important;
}

.notes-list h5 { margin: 0 0 10px; color: #7b351d; }
.notes { display: grid; gap: 10px; }
.note-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  position: relative;
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.note-mood { font-size: 24px; }
.note-time { font-size: 12px; color: #9c7a5f; }
.note-content { margin: 0; color: #5a3d2b; line-height: 1.6; }
.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px !important;
  font-size: 12px !important;
  background: transparent !important;
  color: #dc2626 !important;
  border: 1px solid #dc2626 !important;
  opacity: 0;
  transition: opacity 0.2s;
}
.note-card:hover .delete-btn { opacity: 1; }

.timeline-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border-radius: 10px;
  border: 1px solid #efc48d;
}
.timeline-pos {
  font-family: ui-monospace, monospace;
  font-weight: 700;
  color: #7b351d;
  min-width: 60px;
  text-align: center;
}

.timeline-list {
  position: relative;
  padding-left: 24px;
}
.timeline-list::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: #efc48d;
}
.timeline-item {
  position: relative;
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  cursor: pointer;
  transition: all 0.2s;
}
.timeline-item:hover { border-color: #f08a24; background: #fff5ee; }
.timeline-item.active {
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border-color: #f08a24;
}
.timeline-item.future { opacity: 0.5; }
.timeline-dot {
  position: absolute;
  left: -21px;
  top: 14px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #efc48d;
  border: 2px solid #fffaf2;
}
.timeline-item.active .timeline-dot {
  background: #d94b26;
  box-shadow: 0 0 0 3px rgba(217, 75, 38, 0.3);
}
.timeline-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timeline-action { font-weight: 600; color: #7b351d; font-size: 13px; }
.timeline-time { font-size: 12px; color: #9c7a5f; font-family: ui-monospace, monospace; }
.timeline-badge {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d94b26;
  color: #fff;
}

.state-inspector {
  margin: 0;
  padding: 16px;
  border-radius: 10px;
  background: linear-gradient(180deg, #fff8e8 0%, #fff4df 100%);
  border: 1px solid #efc48d;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #7b351d;
  max-height: 240px;
  overflow: auto;
}
.inspector-info {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.inspector-info p { margin: 0; font-size: 13px; color: #7c563f; }

.empty-tip { text-align: center; color: #9c7a5f; padding: 30px 0; }

.code-toggle { text-align: center; }
.code-block pre { margin: 0; }
.code-block code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #7b351d;
}

.knowledge-points {
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f0f8e8, #e0eec8);
  border-left: 4px solid #4b6d33;
}
.knowledge-points h5 { margin: 0 0 8px; color: #4b6d33; }
.knowledge-points ul { margin: 0; padding-left: 20px; }
.knowledge-points li { font-size: 13px; color: #5a6d40; line-height: 1.7; }
.knowledge-points code {
  background: #fffaf2;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #b7431f;
}
</style>
`;export{e as default};
