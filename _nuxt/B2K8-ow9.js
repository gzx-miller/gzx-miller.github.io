const n=`<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

interface ForestItem {
  id: number
  name: string
  type: '植物' | '动物' | '矿石' | '蘑菇'
  rarity: '普通' | '稀有' | '史诗' | '传说'
  discovered: boolean
  count: number
  description: string
}

class ForestExplorer {
  items: ForestItem[] = reactive([
    { id: 1, name: '枫叶', type: '植物', rarity: '普通', discovered: true, count: 24, description: '秋日最常见的红叶' },
    { id: 2, name: '松鼠', type: '动物', rarity: '普通', discovered: true, count: 5, description: '林间穿梭的小精灵' },
    { id: 3, name: '橡树果', type: '植物', rarity: '普通', discovered: true, count: 12, description: '小松鼠的最爱' },
    { id: 4, name: '红蘑菇', type: '蘑菇', rarity: '稀有', discovered: true, count: 3, description: '色彩鲜艳的毒蘑菇' },
    { id: 5, name: '琥珀', type: '矿石', rarity: '史诗', discovered: false, count: 0, description: '封存远古记忆的宝石' },
    { id: 6, name: '白狐', type: '动物', rarity: '传说', discovered: false, count: 0, description: '传说中的森林守护者' },
    { id: 7, name: '灵芝', type: '植物', rarity: '稀有', discovered: false, count: 0, description: '珍贵的药用菌类' },
    { id: 8, name: '水晶', type: '矿石', rarity: '稀有', discovered: true, count: 2, description: '晶莹剔透的矿石' },
    { id: 9, name: '鹿', type: '动物', rarity: '稀有', discovered: true, count: 1, description: '优雅的森林居民' },
    { id: 10, name: '人参', type: '植物', rarity: '史诗', discovered: false, count: 0, description: '百草之王' },
  ])

  explorerName = '秋日探险家'
  energy = 100
  maxEnergy = 100
  level = 3
  experience = 240
  nextLevelExp = 500

  get discoveredCount() {
    return this.items.filter(i => i.discovered).length
  }

  get totalCount() {
    return this.items.length
  }

  get discoveryProgress() {
    return Math.round((this.discoveredCount / this.totalCount) * 100)
  }

  get discoveredItems() {
    return this.items.filter(i => i.discovered)
  }

  get rareItems() {
    return this.items.filter(i => i.discovered && (i.rarity === '稀有' || i.rarity === '史诗' || i.rarity === '传说'))
  }

  get itemsByType() {
    const map: Record<string, ForestItem[]> = {}
    this.items.forEach(item => {
      if (!map[item.type]) map[item.type] = []
      map[item.type].push(item)
    })
    return map
  }

  get totalCollected() {
    return this.items.reduce((sum, i) => sum + i.count, 0)
  }

  get expProgress() {
    return Math.round((this.experience / this.nextLevelExp) * 100)
  }

  discoverItem(id: number) {
    if (this.energy < 10) return false
    const item = this.items.find(i => i.id === id)
    if (!item) return false
    
    this.energy -= 10
    
    if (!item.discovered) {
      item.discovered = true
      item.count = 1
      this.gainExp(item.rarity === '传说' ? 100 : item.rarity === '史诗' ? 50 : item.rarity === '稀有' ? 20 : 5)
    } else {
      item.count++
      this.gainExp(2)
    }
    return true
  }

  gainExp(amount: number) {
    this.experience += amount
    while (this.experience >= this.nextLevelExp) {
      this.experience -= this.nextLevelExp
      this.level++
      this.nextLevelExp = Math.round(this.nextLevelExp * 1.5)
      this.maxEnergy += 20
      this.energy = this.maxEnergy
    }
  }

  rest() {
    this.energy = this.maxEnergy
  }

  setName(name: string) {
    this.explorerName = name
  }
}

const store = reactive(new ForestExplorer())

const activeTab = ref<'explore' | 'collection' | 'stats'>('explore')
const activeFilter = ref<'全部' | '植物' | '动物' | '矿石' | '蘑菇'>('全部')
const newName = ref('')
const showCode = ref(false)
const discoverLog = ref<string[]>([])
const isExploring = ref(false)

const filteredItems = computed(() => {
  if (activeFilter.value === '全部') return store.items
  return store.itemsByType[activeFilter.value] || []
})

const rarityColor = (rarity: string) => ({
  '普通': '#6b7280',
  '稀有': '#3b82f6',
  '史诗': '#8b5cf6',
  '传说': '#f59e0b',
} as any)[rarity] || '#6b7280'

async function exploreRandom() {
  if (store.energy < 10 || isExploring.value) return
  isExploring.value = true
  
  await new Promise(r => setTimeout(r, 800))
  
  const undiscovered = store.items.filter(i => !i.discovered)
  const pool = undiscovered.length > 0 && Math.random() > 0.4 ? undiscovered : store.items
  const randomItem = pool[Math.floor(Math.random() * pool.length)]
  
  const wasNew = !randomItem.discovered
  store.discoverItem(randomItem.id)
  
  if (wasNew) {
    discoverLog.value.unshift(\`🎉 发现新物种：\${randomItem.name}（\${randomItem.rarity}）！\`)
  } else {
    discoverLog.value.unshift(\`🍂 又发现了 \${randomItem.name}\`)
  }
  
  if (discoverLog.value.length > 8) discoverLog.value.pop()
  
  isExploring.value = false
}

function updateName() {
  if (newName.value.trim()) {
    store.setName(newName.value.trim())
    newName.value = ''
  }
}
<\/script>

<template>
  <div class="demo-card">
    <h4>🌲 MobX 响应式状态与 Observable</h4>
    <p>秋日森林图鉴 — 模拟 MobX 的 observable、action、computed 响应式模型</p>

    <div class="profile-bar">
      <div class="profile-info">
        <div class="avatar">🦊</div>
        <div>
          <div class="name-row">
            <strong>{{ store.explorerName }}</strong>
            <span class="level-badge">Lv.{{ store.level }}</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: store.expProgress + '%' }"></div>
            <span class="exp-text">{{ store.experience }} / {{ store.nextLevelExp }} EXP</span>
          </div>
        </div>
      </div>
      <div class="energy-box">
        <div class="energy-label">⚡ 体力</div>
        <div class="energy-value">{{ store.energy }} / {{ store.maxEnergy }}</div>
        <button @click="store.rest()" :disabled="store.energy === store.maxEnergy">休息恢复</button>
      </div>
    </div>

    <div class="tab-row">
      <button :class="{ active: activeTab === 'explore' }" @click="activeTab = 'explore'">
        🔍 探索
      </button>
      <button :class="{ active: activeTab === 'collection' }" @click="activeTab = 'collection'">
        📖 图鉴
      </button>
      <button :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">
        📊 统计
      </button>
    </div>

    <div v-if="activeTab === 'explore'" class="explore-section">
      <div class="explore-area">
        <div class="explore-scene">
          <div class="scene-decor">🍂 🌲 🍄 🌿 🦊 🍁 🌲</div>
          <button class="explore-btn" @click="exploreRandom" :disabled="store.energy < 10 || isExploring">
            {{ isExploring ? '探索中...' : store.energy < 10 ? '体力不足' : '🌿 开始探索 (-10体力)' }}
          </button>
          <p class="explore-hint">在秋日森林中寻找各种动植物和矿石</p>
        </div>
      </div>

      <div class="explore-log">
        <h5>📜 探索日志</h5>
        <div v-if="discoverLog.length === 0" class="empty-log">还没有探索记录，去探索吧~</div>
        <div v-else class="log-list">
          <div v-for="(log, idx) in discoverLog" :key="idx" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>

      <div class="name-edit">
        <input v-model="newName" placeholder="修改探险家名称..." @keyup.enter="updateName" />
        <button @click="updateName">修改名称</button>
      </div>
    </div>

    <div v-else-if="activeTab === 'collection'" class="collection-section">
      <div class="filter-row">
        <button
          v-for="t in ['全部', '植物', '动物', '矿石', '蘑菇']"
          :key="t"
          :class="{ active: activeFilter === t }"
          class="filter-btn"
          @click="activeFilter = t as any"
        >
          {{ t }}
        </button>
        <span class="progress-text">
          发现进度: {{ store.discoveredCount }} / {{ store.totalCount }} ({{ store.discoveryProgress }}%)
        </span>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: store.discoveryProgress + '%' }"></div>
      </div>

      <div class="collection-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          :class="{ discovered: item.discovered, locked: !item.discovered }"
        >
          <div class="item-rarity" :style="{ background: rarityColor(item.rarity) }">
            {{ item.rarity }}
          </div>
          <div class="item-icon">{{ item.discovered ? (item.type === '植物' ? '🌿' : item.type === '动物' ? '🦊' : item.type === '矿石' ? '💎' : '🍄') : '❓' }}</div>
          <div class="item-name">{{ item.discovered ? item.name : '???' }}</div>
          <div class="item-type">{{ item.type }}</div>
          <div class="item-count" v-if="item.discovered">已收集 ×{{ item.count }}</div>
          <div class="item-desc" v-if="item.discovered">{{ item.description }}</div>
        </div>
      </div>
    </div>

    <div v-else class="stats-section">
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-num">{{ store.discoveredCount }}</span>
          <span class="stat-label">已发现物种</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ store.discoveryProgress }}%</span>
          <span class="stat-label">图鉴完成度</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ store.totalCollected }}</span>
          <span class="stat-label">总收集数</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">{{ store.rareItems.length }}</span>
          <span class="stat-label">稀有以上</span>
        </div>
      </div>

      <div class="type-stats">
        <h5>📂 分类统计</h5>
        <div class="type-list">
          <div v-for="(items, type) in store.itemsByType" :key="type" class="type-row">
            <span class="type-name">{{ type }}</span>
            <div class="type-bar">
              <div
                class="type-fill"
                :style="{ width: Math.round(items.filter(i => i.discovered).length / items.length * 100) + '%' }"
              ></div>
            </div>
            <span class="type-count">
              {{ items.filter(i => i.discovered).length }} / {{ items.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 MobX 代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// MobX: observable + action + computed
import { makeObservable, observable, action, computed } from 'mobx'

class ForestExplorer {
  items: ForestItem[] = []
  explorerName = '秋日探险家'
  energy = 100
  level = 3

  constructor() {
    makeObservable(this, {
      items: observable,
      explorerName: observable,
      energy: observable,
      level: observable,
      
      discoveredCount: computed,
      discoveryProgress: computed,
      rareItems: computed,
      itemsByType: computed,
      
      discoverItem: action,
      gainExp: action,
      rest: action,
      setName: action,
    })
  }

  get discoveredCount() {
    return this.items.filter(i =&gt; i.discovered).length
  }

  get discoveryProgress() {
    return Math.round((this.discoveredCount / this.items.length) * 100)
  }

  get itemsByType() {
    const map: Record&lt;string, ForestItem[]&gt; = {}
    this.items.forEach(item =&gt; {
      if (!map[item.type]) map[item.type] = []
      map[item.type].push(item)
    })
    return map
  }

  discoverItem(id: number) {
    if (this.energy &lt; 10) return false
    const item = this.items.find(i =&gt; i.id === id)
    if (!item) return false
    this.energy -= 10
    if (!item.discovered) {
      item.discovered = true
      item.count = 1
      this.gainExp(50)
    } else {
      item.count++
    }
    return true
  }

  gainExp(amount: number) {
    this.experience += amount
    if (this.experience &gt;= this.nextLevelExp) {
      this.level++
      this.experience = 0
    }
  }

  rest() {
    this.energy = this.maxEnergy
  }
}

// React 组件中使用（observer HOC）
import { observer } from 'mobx-react-lite'

const ExplorerPanel = observer(() =&gt; {
  const store = useForestStore()
  return (
    &lt;div&gt;
      &lt;h3&gt;{store.explorerName}&lt;/h3&gt;
      &lt;p&gt;进度: {store.discoveryProgress}%&lt;/p&gt;
      &lt;button onClick={() =&gt; store.discoverItem(1)}&gt;探索&lt;/button&gt;
    &lt;/div&gt;
  )
})</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>Observable</strong>：可观察状态，使用 <code>observable</code> 标记，修改时自动通知</li>
        <li><strong>Computed</strong>：派生值，使用 <code>computed</code> 定义，自动缓存和追踪依赖</li>
        <li><strong>Action</strong>：状态修改方法，使用 <code>action</code> 标记，统一管理状态变更</li>
        <li><strong>响应式追踪</strong>：MobX 自动追踪函数中访问的 observable，变化时重新执行</li>
        <li><strong>observer</strong>：React 组件用 <code>observer</code> 包裹，自动响应 observable 变化</li>
        <li><strong>面向对象</strong>：MobX 倾向于面向对象风格，状态和逻辑封装在类中</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.profile-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff1d8, #ffe0ac);
  border: 1px solid #efc48d;
  margin-bottom: 14px;
}
.profile-info { display: flex; gap: 12px; align-items: center; flex: 1; }
.avatar {
  width: 48px; height: 48px;
  display: grid; place-items: center;
  font-size: 28px;
  background: #fffaf2;
  border-radius: 50%;
  border: 2px solid #f08a24;
}
.name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.name-row strong { color: #7b351d; font-size: 16px; }
.level-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f08a24, #d94b26);
  color: #fff;
  font-weight: 600;
}
.exp-bar {
  position: relative;
  width: 180px;
  height: 16px;
  background: #fffaf2;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #efc48d;
}
.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #f08a24, #d94b26);
  transition: width 0.3s;
}
.exp-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: #5a3d2b;
  font-weight: 500;
}
.energy-box { text-align: center; }
.energy-label { font-size: 12px; color: #7c563f; margin-bottom: 4px; }
.energy-value { font-size: 18px; font-weight: 800; color: #b7431f; margin-bottom: 6px; }

.tab-row {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
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

.explore-scene {
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(180deg, #e8f5e9 0%, #fff8e1 100%);
  border: 1px solid #a5d6a7;
  text-align: center;
  margin-bottom: 14px;
}
.scene-decor { font-size: 24px; letter-spacing: 8px; margin-bottom: 16px; }
.explore-btn {
  padding: 14px 32px !important;
  font-size: 16px !important;
  border-radius: 999px !important;
}
.explore-hint { font-size: 13px; color: #5a6d40; margin: 12px 0 0; }

.explore-log {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  margin-bottom: 14px;
}
.explore-log h5 { margin: 0 0 10px; color: #7b351d; }
.empty-log { text-align: center; color: #9c7a5f; padding: 16px 0; }
.log-list { display: grid; gap: 6px; max-height: 160px; overflow-y: auto; }
.log-item {
  font-size: 13px;
  color: #5a3d2b;
  padding: 6px 10px;
  background: #fff8e8;
  border-radius: 6px;
}

.name-edit { display: flex; gap: 8px; }
.name-edit input { flex: 1; }

.filter-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}
.filter-btn {
  padding: 5px 12px !important;
  font-size: 12px !important;
  border-radius: 999px !important;
  background: #fff !important;
  color: #7b351d !important;
  border: 1px solid #efc48d !important;
}
.filter-btn.active {
  background: linear-gradient(135deg, #f08a24, #d94b26) !important;
  color: #fff !important;
  border-color: #b7431f !important;
}
.progress-text {
  margin-left: auto;
  font-size: 12px;
  color: #7c563f;
  font-weight: 500;
}

.progress-bar {
  height: 8px;
  border-radius: 999px;
  background: #ffe6c0;
  overflow: hidden;
  margin-bottom: 14px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4b6d33, #7ab556);
  transition: width 0.3s;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.item-card {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
  text-align: center;
  position: relative;
  transition: all 0.2s;
}
.item-card.locked {
  opacity: 0.5;
  filter: grayscale(0.5);
}
.item-card.discovered:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 75, 38, 0.15);
}
.item-rarity {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  font-weight: 600;
}
.item-icon { font-size: 32px; margin: 8px 0; }
.item-name { font-weight: 600; color: #7b351d; font-size: 14px; margin-bottom: 4px; }
.item-type { font-size: 11px; color: #9c7a5f; margin-bottom: 6px; }
.item-count { font-size: 12px; color: #b7431f; font-weight: 600; margin-bottom: 4px; }
.item-desc { font-size: 11px; color: #7c563f; line-height: 1.4; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.stat-card {
  text-align: center;
  padding: 16px 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fff1d8, #ffe6c0);
  border: 1px solid #efc48d;
}
.stat-num { display: block; font-size: 24px; font-weight: 800; color: #8f2f18; margin-bottom: 4px; }
.stat-label { font-size: 12px; color: #7c563f; }

.type-stats {
  padding: 14px;
  border-radius: 10px;
  background: #fffaf2;
  border: 1px solid #efc48d;
}
.type-stats h5 { margin: 0 0 12px; color: #7b351d; }
.type-list { display: grid; gap: 10px; }
.type-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.type-name { width: 50px; font-size: 13px; color: #5a3d2b; font-weight: 500; }
.type-bar {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #fff1d8;
  overflow: hidden;
}
.type-fill {
  height: 100%;
  background: linear-gradient(90deg, #f08a24, #d94b26);
  transition: width 0.3s;
}
.type-count { width: 60px; text-align: right; font-size: 12px; color: #7c563f; font-family: ui-monospace, monospace; }

.code-toggle { text-align: center; }
.code-block pre { margin: 0; }
.code-block code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
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
`;export{n as default};
