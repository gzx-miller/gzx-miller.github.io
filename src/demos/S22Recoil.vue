<script setup lang="ts">
import { ref, computed, provide, inject, readonly } from 'vue'

interface Atom<T> {
  key: string
  default: T
}

interface SelectorOptions<T> {
  key: string
  get: () => T
}

const atomRegistry = ref<Record<string, any>>({})

function useRecoilState<T>(atom: Atom<T>): [T, (val: T | ((prev: T) => T)) => void] {
  if (!(atom.key in atomRegistry.value)) {
    atomRegistry.value[atom.key] = ref(atom.default)
  }
  const stateRef = atomRegistry.value[atom.key]
  const setter = (val: T | ((prev: T) => T)) => {
    if (typeof val === 'function') {
      stateRef.value = (val as (prev: T) => T)(stateRef.value)
    } else {
      stateRef.value = val
    }
  }
  return [stateRef.value, setter]
}

function useRecoilValue<T>(atomOrSelector: Atom<T> | SelectorOptions<T>): T {
  if ('get' in atomOrSelector) {
    return atomOrSelector.get()
  }
  if (!(atomOrSelector.key in atomRegistry.value)) {
    atomRegistry.value[atomOrSelector.key] = ref(atomOrSelector.default)
  }
  return atomRegistry.value[atomOrSelector.key].value
}

const userNameAtom: Atom<string> = { key: 'userName', default: '秋日旅人' }
const userMoodAtom: Atom<string> = { key: 'userMood', default: '平静' }
const forestVisitsAtom: Atom<number> = { key: 'forestVisits', default: 12 }
const collectedLeavesAtom: Atom<string[]> = { key: 'collectedLeaves', default: ['枫叶', '银杏叶', '橡树叶'] }

const greetingSelector: SelectorOptions<string> = {
  key: 'greeting',
  get: () => {
    const name = useRecoilValue(userNameAtom)
    const mood = useRecoilValue(userMoodAtom)
    return `你好，${name}！今天心情${mood}，适合去林间走走~`
  }
}

const leafCountSelector: SelectorOptions<number> = {
  key: 'leafCount',
  get: () => {
    const leaves = useRecoilValue(collectedLeavesAtom)
    return leaves.length
  }
}

const explorerLevelSelector: SelectorOptions<string> = {
  key: 'explorerLevel',
  get: () => {
    const visits = useRecoilValue(forestVisitsAtom)
    if (visits >= 50) return '森林大师 🏆'
    if (visits >= 30) return '资深探险家 ⭐'
    if (visits >= 15) return '林间漫步者 🍂'
    if (visits >= 5) return '初入森林 🌱'
    return '新手探险者 🌿'
  }
}

const progressPercentSelector: SelectorOptions<number> = {
  key: 'progressPercent',
  get: () => {
    const visits = useRecoilValue(forestVisitsAtom)
    return Math.min(100, Math.round((visits / 50) * 100))
  }
}

const [userName, setUserName] = useRecoilState(userNameAtom)
const [userMood, setUserMood] = useRecoilState(userMoodAtom)
const [forestVisits, setForestVisits] = useRecoilState(forestVisitsAtom)
const [collectedLeaves, setCollectedLeaves] = useRecoilState(collectedLeavesAtom)

const greeting = useRecoilValue(greetingSelector)
const leafCount = useRecoilValue(leafCountSelector)
const explorerLevel = useRecoilValue(explorerLevelSelector)
const progressPercent = useRecoilValue(progressPercentSelector)

const newLeafName = ref('')
const activeTab = ref<'demo' | 'atoms' | 'selectors'>('demo')
const showCode = ref(false)

const moods = ['开心', '平静', '兴奋', '悠闲', '沉思', '温暖']

function addLeaf() {
  if (!newLeafName.value.trim()) return
  if (!collectedLeaves.includes(newLeafName.value.trim())) {
    setCollectedLeaves([...collectedLeaves, newLeafName.value.trim()])
  }
  newLeafName.value = ''
}

function removeLeaf(leaf: string) {
  setCollectedLeaves(collectedLeaves.filter(l => l !== leaf))
}

function addVisit() {
  setForestVisits((prev: number) => prev + 1)
}

function resetAtoms() {
  setUserName('秋日旅人')
  setUserMood('平静')
  setForestVisits(12)
  setCollectedLeaves(['枫叶', '银杏叶', '橡树叶'])
}
</script>

<template>
  <div class="demo-card">
    <h4>⚛️ Recoil 原子状态与 Selector</h4>
    <p>秋日森林探险家 — 模拟 Recoil 的 Atom 原子状态与 Selector 派生状态</p>

    <div class="tab-row">
      <button :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">
        🎮 交互演示
      </button>
      <button :class="{ active: activeTab === 'atoms' }" @click="activeTab = 'atoms'">
        🔬 Atoms 原子
      </button>
      <button :class="{ active: activeTab === 'selectors' }" @click="activeTab = 'selectors'">
        🧩 Selectors 派生
      </button>
    </div>

    <div v-if="activeTab === 'demo'" class="demo-section">
      <div class="greeting-box">
        <p class="greeting-text">{{ greeting }}</p>
        <p class="level-badge">等级：{{ explorerLevel }}</p>
      </div>

      <div class="profile-section">
        <h5>👤 探险者档案</h5>
        <div class="form-row">
          <label>
            昵称
            <input :value="userName" @input="setUserName(($event.target as HTMLInputElement).value)" />
          </label>
        </div>
        <div class="form-row">
          <label>今日心情</label>
          <div class="mood-buttons">
            <button
              v-for="mood in moods"
              :key="mood"
              :class="{ active: userMood === mood }"
              class="mood-btn"
              @click="setUserMood(mood)"
            >
              {{ mood }}
            </button>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <h5>🌲 森林探险进度</h5>
          <span>已访问 {{ forestVisits }} 次</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <p class="progress-hint">距离「森林大师」还需 {{ Math.max(0, 50 - forestVisits) }} 次访问</p>
        <button @click="addVisit">➕ 记录一次森林访问</button>
      </div>

      <div class="leaves-section">
        <div class="section-header">
          <h5>🍁 树叶收藏 ({{ leafCount }}种)</h5>
        </div>
        <div class="leaf-input">
          <input v-model="newLeafName" placeholder="输入树叶名称..." @keyup.enter="addLeaf" />
          <button @click="addLeaf">添加</button>
        </div>
        <div class="leaf-tags">
          <span v-for="leaf in collectedLeaves" :key="leaf" class="leaf-tag">
            {{ leaf }}
            <button class="remove-tag" @click="removeLeaf(leaf)">×</button>
          </span>
        </div>
      </div>

      <div class="reset-row">
        <button class="reset-btn" @click="resetAtoms">🔄 重置所有状态</button>
      </div>
    </div>

    <div v-else-if="activeTab === 'atoms'" class="atoms-section">
      <h5>🔬 Atom 原子状态一览</h5>
      <p class="section-desc">Atom 是 Recoil 的最小状态单元，可以独立更新和订阅</p>
      
      <div class="atom-list">
        <div class="atom-card">
          <div class="atom-head">
            <code class="atom-key">userNameAtom</code>
            <span class="atom-type">string</span>
          </div>
          <p class="atom-desc">用户昵称</p>
          <p class="atom-value">当前值：<code>{{ userName }}</code></p>
        </div>

        <div class="atom-card">
          <div class="atom-head">
            <code class="atom-key">userMoodAtom</code>
            <span class="atom-type">string</span>
          </div>
          <p class="atom-desc">用户心情</p>
          <p class="atom-value">当前值：<code>{{ userMood }}</code></p>
        </div>

        <div class="atom-card">
          <div class="atom-head">
            <code class="atom-key">forestVisitsAtom</code>
            <span class="atom-type">number</span>
          </div>
          <p class="atom-desc">森林访问次数</p>
          <p class="atom-value">当前值：<code>{{ forestVisits }}</code></p>
        </div>

        <div class="atom-card">
          <div class="atom-head">
            <code class="atom-key">collectedLeavesAtom</code>
            <span class="atom-type">string[]</span>
          </div>
          <p class="atom-desc">收藏的树叶列表</p>
          <p class="atom-value">当前值：<code>{{ collectedLeaves.length }} 项</code></p>
        </div>
      </div>
    </div>

    <div v-else class="selectors-section">
      <h5>🧩 Selector 派生状态一览</h5>
      <p class="section-desc">Selector 是纯函数，从 Atom 或其他 Selector 派生出新状态</p>
      
      <div class="selector-list">
        <div class="selector-card">
          <div class="selector-head">
            <code class="selector-key">greetingSelector</code>
            <span class="selector-type">string</span>
          </div>
          <p class="selector-desc">组合用户名和心情的问候语</p>
          <p class="selector-value">结果：<code>{{ greeting }}</code></p>
          <p class="selector-deps">依赖：userNameAtom, userMoodAtom</p>
        </div>

        <div class="selector-card">
          <div class="selector-head">
            <code class="selector-key">leafCountSelector</code>
            <span class="selector-type">number</span>
          </div>
          <p class="selector-desc">树叶收藏数量</p>
          <p class="selector-value">结果：<code>{{ leafCount }}</code></p>
          <p class="selector-deps">依赖：collectedLeavesAtom</p>
        </div>

        <div class="selector-card">
          <div class="selector-head">
            <code class="selector-key">explorerLevelSelector</code>
            <span class="selector-type">string</span>
          </div>
          <p class="selector-desc">根据访问次数计算探险等级</p>
          <p class="selector-value">结果：<code>{{ explorerLevel }}</code></p>
          <p class="selector-deps">依赖：forestVisitsAtom</p>
        </div>

        <div class="selector-card">
          <div class="selector-head">
            <code class="selector-key">progressPercentSelector</code>
            <span class="selector-type">number</span>
          </div>
          <p class="selector-desc">进度百分比（到50次为100%）</p>
          <p class="selector-value">结果：<code>{{ progressPercent }}%</code></p>
          <p class="selector-deps">依赖：forestVisitsAtom</p>
        </div>
      </div>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 Recoil 代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Recoil: Atom 定义
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

// 1. Atom — 最小状态单元
const userNameAtom = atom({
  key: 'userName',
  default: '秋日旅人',
})

const forestVisitsAtom = atom({
  key: 'forestVisits',
  default: 12,
})

const collectedLeavesAtom = atom({
  key: 'collectedLeaves',
  default: ['枫叶', '银杏叶', '橡树叶'],
})

// 2. Selector — 派生状态
const greetingSelector = selector({
  key: 'greeting',
  get: ({ get }) =&gt; {
    const name = get(userNameAtom)
    const mood = get(userMoodAtom)
    return `你好，${name}！今天心情${mood}~`
  },
})

const leafCountSelector = selector({
  key: 'leafCount',
  get: ({ get }) =&gt; get(collectedLeavesAtom).length,
})

// 3. 组件中使用
function ExplorerProfile() {
  const [userName, setUserName] = useRecoilState(userNameAtom)
  const greeting = useRecoilValue(greetingSelector)
  return &lt;div&gt;{greeting}&lt;/div&gt;
}

// 4. 异步 Selector
const userDataSelector = selector({
  key: 'userData',
  get: async ({ get }) =&gt; {
    const userId = get(userIdAtom)
    const res = await fetch(`/api/users/${userId}`)
    return res.json()
  },
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>Atom</strong>：最小状态单元，可被任意组件订阅和更新，自动触发重渲染</li>
        <li><strong>Selector</strong>：纯函数派生状态，可依赖 Atom 或其他 Selector</li>
        <li><strong>按需渲染</strong>：组件只订阅自己用到的 Atom/Selector，精准更新</li>
        <li><strong>异步 Selector</strong>：get 函数支持 async，天然处理异步数据流</li>
        <li><strong>Key 唯一</strong>：每个 Atom/Selector 的 key 必须全局唯一</li>
        <li><strong>React 生态</strong>：Recoil 由 Meta 开发，专为 React 设计</li>
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

.greeting-box {
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff1d8, #ffe0ac);
  border: 1px solid #efc48d;
  text-align: center;
  margin-bottom: 16px;
}
.greeting-text {
  font-size: 18px;
  color: #7b351d;
  margin: 0 0 8px;
  font-weight: 600;
}
.level-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f08a24, #d94b26);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  margin: 0;
}

.profile-section, .progress-section, .leaves-section {
  padding: 16px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  margin-bottom: 12px;
}
.profile-section h5, .progress-section h5, .leaves-section h5 {
  margin: 0 0 12px;
  color: #7b351d;
}

.form-row {
  margin-bottom: 12px;
}
.form-row label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #7c563f;
  font-weight: 500;
}
.mood-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.mood-btn {
  padding: 6px 12px !important;
  font-size: 13px !important;
  border-radius: 999px !important;
  background: #fff !important;
  color: #7b351d !important;
  border: 1px solid #efc48d !important;
}
.mood-btn.active {
  background: linear-gradient(135deg, #f08a24, #d94b26) !important;
  color: #fff !important;
  border-color: #b7431f !important;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.progress-header span {
  font-size: 13px;
  color: #7c563f;
  font-weight: 500;
}
.progress-bar {
  height: 12px;
  border-radius: 999px;
  background: #ffe6c0;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f08a24, #d94b26);
  transition: width 0.3s ease;
}
.progress-hint {
  font-size: 12px;
  color: #9c7a5f;
  margin: 0 0 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.leaf-input {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.leaf-input input { flex: 1; }
.leaf-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.leaf-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  color: #7b351d;
  font-size: 12px;
  border: 1px solid #efc48d;
}
.remove-tag {
  width: 18px; height: 18px;
  padding: 0 !important;
  border-radius: 50% !important;
  font-size: 12px !important;
  background: transparent !important;
  color: #b7431f !important;
  border: none !important;
  cursor: pointer;
}

.reset-row {
  text-align: center;
}
.reset-btn {
  padding: 8px 20px !important;
  font-size: 13px !important;
  background: transparent !important;
  color: #7c563f !important;
  border: 1px solid #efc48d !important;
}

.section-desc {
  font-size: 13px;
  color: #7c563f;
  margin: 0 0 14px;
}

.atom-list, .selector-list {
  display: grid;
  gap: 10px;
}
.atom-card, .selector-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
}
.atom-head, .selector-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.atom-key, .selector-key {
  font-family: ui-monospace, monospace;
  font-size: 13px;
  color: #b7431f;
  font-weight: 600;
}
.atom-type, .selector-type {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff1d8;
  color: #7b351d;
}
.atom-desc, .selector-desc {
  font-size: 13px;
  color: #5a3d2b;
  margin: 0 0 6px;
}
.atom-value, .selector-value {
  font-size: 12px;
  color: #7c563f;
  margin: 0 0 4px;
}
.atom-value code, .selector-value code {
  background: #fff1d8;
  padding: 1px 6px;
  border-radius: 4px;
  color: #b7431f;
  font-size: 12px;
}
.selector-deps {
  font-size: 11px;
  color: #9c7a5f;
  margin: 0;
  font-style: italic;
}

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
