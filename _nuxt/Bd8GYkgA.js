const e=`<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

interface ForestZone {
  id: string
  name: string
  description: string
  unlocked: boolean
  visitCount: number
  features: string[]
}

interface Explorer {
  name: string
  level: number
  experience: number
  energy: number
  maxEnergy: number
}

interface InventoryItem {
  id: string
  name: string
  type: string
  count: number
  rarity: '普通' | '稀有' | '史诗' | '传说'
}

interface AppState {
  explorer: Explorer
  zones: ForestZone[]
  inventory: InventoryItem[]
  currentZoneId: string | null
}

const state = reactive<AppState>({
  explorer: {
    name: '秋日探险家',
    level: 2,
    experience: 120,
    energy: 80,
    maxEnergy: 100,
  },
  zones: [
    {
      id: 'maple',
      name: '枫林小径',
      description: '铺满金色枫叶的幽静小路',
      unlocked: true,
      visitCount: 5,
      features: ['枫叶', '松鼠', '野果'],
    },
    {
      id: 'deep',
      name: '深林秘境',
      description: '古老树木参天的神秘森林',
      unlocked: true,
      visitCount: 2,
      features: ['蘑菇', '小鹿', '苔藓'],
    },
    {
      id: 'river',
      name: '清溪河畔',
      description: '清澈小溪流过的静谧之地',
      unlocked: false,
      visitCount: 0,
      features: ['鱼群', '鹅卵石', '水草'],
    },
    {
      id: 'mountain',
      name: '秋山远眺',
      description: '可以俯瞰整片森林的山顶',
      unlocked: false,
      visitCount: 0,
      features: ['雄鹰', '奇石', '山风'],
    },
  ],
  inventory: [
    { id: 'maple_leaf', name: '红枫叶', type: '植物', count: 12, rarity: '普通' },
    { id: 'acorn', name: '橡树果', type: '植物', count: 8, rarity: '普通' },
    { id: 'mushroom', name: '红蘑菇', type: '蘑菇', count: 3, rarity: '稀有' },
    { id: 'crystal', name: '秋日水晶', type: '矿石', count: 1, rarity: '史诗' },
  ],
  currentZoneId: null,
})

const getters = {
  currentZone: computed(() => state.zones.find(z => z.id === state.currentZoneId) || null),
  unlockedZones: computed(() => state.zones.filter(z => z.unlocked)),
  lockedZones: computed(() => state.zones.filter(z => !z.unlocked)),
  totalVisits: computed(() => state.zones.reduce((sum, z) => sum + z.visitCount, 0)),
  inventoryValue: computed(() => {
    const rarityValue: Record<string, number> = { '普通': 1, '稀有': 10, '史诗': 50, '传说': 200 }
    return state.inventory.reduce((sum, item) => sum + item.count * rarityValue[item.rarity], 0)
  }),
  expToNextLevel: computed(() => state.explorer.level * 200),
  expProgress: computed(() => Math.round((state.explorer.experience / (state.explorer.level * 200)) * 100)),
  inventoryByType: computed(() => {
    const map: Record<string, InventoryItem[]> = {}
    state.inventory.forEach(item => {
      if (!map[item.type]) map[item.type] = []
      map[item.type].push(item)
    })
    return map
  }),
  rareItems: computed(() => state.inventory.filter(i => i.rarity !== '普通')),
}

const actions = {
  enterZone(zoneId: string) {
    const zone = state.zones.find(z => z.id === zoneId)
    if (zone && zone.unlocked && state.explorer.energy >= 10) {
      state.currentZoneId = zoneId
      state.explorer.energy -= 10
      zone.visitCount++
      actions.gainExp(5)
      actions.collectRandomItem()
    }
  },
  leaveZone() {
    state.currentZoneId = null
  },
  collectRandomItem() {
    const zone = getters.currentZone.value
    if (!zone) return
    const features = zone.features
    const randomFeature = features[Math.floor(Math.random() * features.length)]
    const existing = state.inventory.find(i => i.name.includes(randomFeature))
    if (existing) {
      existing.count++
    } else {
      const rarities: Array<InventoryItem['rarity']> = ['普通', '普通', '普通', '稀有', '稀有', '史诗']
      const rarity = rarities[Math.floor(Math.random() * rarities.length)]
      state.inventory.push({
        id: \`item_\${Date.now()}\`,
        name: randomFeature,
        type: zone.features.indexOf(randomFeature) % 2 === 0 ? '植物' : '矿石',
        count: 1,
        rarity,
      })
    }
  },
  gainExp(amount: number) {
    state.explorer.experience += amount
    while (state.explorer.experience >= getters.expToNextLevel.value) {
      state.explorer.experience -= getters.expToNextLevel.value
      state.explorer.level++
      state.explorer.maxEnergy += 20
      state.explorer.energy = state.explorer.maxEnergy
      
      const locked = getters.lockedZones.value
      if (locked.length > 0 && state.explorer.level % 2 === 0) {
        locked[0].unlocked = true
      }
    }
  },
  rest() {
    state.explorer.energy = state.explorer.maxEnergy
  },
  renameExplorer(name: string) {
    if (name.trim()) state.explorer.name = name.trim()
  },
}

const activeTab = ref<'zones' | 'inventory' | 'structure'>('zones')
const newName = ref('')
const showCode = ref(false)
const exploreResult = ref('')

function explore(zoneId: string) {
  const before = state.explorer.level
  actions.enterZone(zoneId)
  const zone = getters.currentZone.value
  if (zone) {
    const leveledUp = state.explorer.level > before
    exploreResult.value = leveledUp 
      ? \`🎉 升级了！当前等级 Lv.\${state.explorer.level}\`
      : \`🍂 在\${zone.name}探索了一圈\`
    setTimeout(() => { actions.leaveZone(); exploreResult.value = '' }, 1500)
  }
}

const rarityColor = (rarity: string) => ({
  '普通': '#6b7280',
  '稀有': '#3b82f6',
  '史诗': '#8b5cf6',
  '传说': '#f59e0b',
} as any)[rarity] || '#6b7280'
<\/script>

<template>
  <div class="demo-card">
    <h4>🌳 Overmind 分形状态管理</h4>
    <p>秋日森林大地图 — 演示 Overmind 的分形状态结构：state / getters / actions</p>

    <div class="explorer-bar">
      <div class="explorer-info">
        <div class="avatar">🍂</div>
        <div>
          <div class="name-row">
            <strong>{{ state.explorer.name }}</strong>
            <span class="level-badge">Lv.{{ state.explorer.level }}</span>
          </div>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: getters.expProgress.value + '%' }"></div>
            <span class="exp-text">{{ state.explorer.experience }} / {{ getters.expToNextLevel.value }} EXP</span>
          </div>
        </div>
      </div>
      <div class="energy-box">
        <div class="energy-label">⚡ 体力</div>
        <div class="energy-value">{{ state.explorer.energy }} / {{ state.explorer.maxEnergy }}</div>
        <button @click="actions.rest()" :disabled="state.explorer.energy === state.explorer.maxEnergy">休息</button>
      </div>
    </div>

    <div v-if="exploreResult" class="explore-toast">
      {{ exploreResult }}
    </div>

    <div class="tab-row">
      <button :class="{ active: activeTab === 'zones' }" @click="activeTab = 'zones'">
        🗺️ 森林区域
      </button>
      <button :class="{ active: activeTab === 'inventory' }" @click="activeTab = 'inventory'">
        🎒 背包
      </button>
      <button :class="{ active: activeTab === 'structure' }" @click="activeTab = 'structure'">
        🏗️ 状态结构
      </button>
    </div>

    <div v-if="activeTab === 'zones'" class="zones-section">
      <p class="section-hint">点击已解锁区域进行探索（消耗10体力）</p>
      <div class="zone-grid">
        <div
          v-for="zone in state.zones"
          :key="zone.id"
          class="zone-card"
          :class="{ unlocked: zone.unlocked, locked: !zone.unlocked, active: state.currentZoneId === zone.id }"
        >
          <div class="zone-icon">
            {{ zone.unlocked ? (zone.id === 'maple' ? '🍁' : zone.id === 'deep' ? '🌲' : zone.id === 'river' ? '🏞️' : '⛰️') : '🔒' }}
          </div>
          <h5 class="zone-name">{{ zone.unlocked ? zone.name : '???' }}</h5>
          <p class="zone-desc">{{ zone.unlocked ? zone.description : '升级解锁新区域' }}</p>
          <div v-if="zone.unlocked" class="zone-meta">
            <span>已访问 {{ zone.visitCount }} 次</span>
          </div>
          <div v-if="zone.unlocked" class="zone-features">
            <span v-for="f in zone.features" :key="f" class="feature-tag">{{ f }}</span>
          </div>
          <button
            v-if="zone.unlocked"
            class="explore-btn"
            @click="explore(zone.id)"
            :disabled="state.explorer.energy < 10"
          >
            {{ state.explorer.energy < 10 ? '体力不足' : '探索 (-10体力)' }}
          </button>
        </div>
      </div>

      <div class="rename-row">
        <input v-model="newName" placeholder="修改探险家名字..." @keyup.enter="actions.renameExplorer(newName); newName = ''" />
        <button @click="actions.renameExplorer(newName); newName = ''">修改名字</button>
      </div>
    </div>

    <div v-else-if="activeTab === 'inventory'" class="inventory-section">
      <div class="inv-summary">
        <div class="inv-stat">
          <span class="stat-num">{{ state.inventory.length }}</span>
          <span class="stat-label">物品种类</span>
        </div>
        <div class="inv-stat">
          <span class="stat-num">{{ state.inventory.reduce((s, i) => s + i.count, 0) }}</span>
          <span class="stat-label">物品总数</span>
        </div>
        <div class="inv-stat">
          <span class="stat-num">{{ getters.rareItems.value.length }}</span>
          <span class="stat-label">稀有以上</span>
        </div>
        <div class="inv-stat value">
          <span class="stat-num">{{ getters.inventoryValue.value }}</span>
          <span class="stat-label">收藏价值</span>
        </div>
      </div>

      <div class="inv-list">
        <div v-for="(items, type) in getters.inventoryByType.value" :key="type" class="type-group">
          <h6 class="type-title">{{ type }}</h6>
          <div class="type-items">
            <div
              v-for="item in items"
              :key="item.id"
              class="item-card"
              :style="{ borderColor: rarityColor(item.rarity) + '40' }"
            >
              <div class="item-icon">
                {{ item.type === '植物' ? '🌿' : item.type === '矿石' ? '💎' : '🍄' }}
              </div>
              <div class="item-info">
                <div class="item-name" :style="{ color: rarityColor(item.rarity) }">{{ item.name }}</div>
                <div class="item-rarity" :style="{ color: rarityColor(item.rarity) }">{{ item.rarity }}</div>
              </div>
              <div class="item-count">×{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="structure-section">
      <h5>🏗️ Overmind 分形状态结构</h5>
      <p class="section-desc">Overmind 将状态组织成分形结构：每个模块都有自己的 state / getters / actions</p>
      
      <div class="structure-tree">
        <div class="tree-node root">
          <span class="node-label">app (根模块)</span>
          <div class="node-children">
            <div class="tree-node">
              <span class="node-label state">state</span>
              <div class="node-children">
                <div class="tree-leaf"><span>explorer</span></div>
                <div class="tree-leaf"><span>zones[]</span></div>
                <div class="tree-leaf"><span>inventory[]</span></div>
                <div class="tree-leaf"><span>currentZoneId</span></div>
              </div>
            </div>
            <div class="tree-node">
              <span class="node-label getter">getters</span>
              <div class="node-children">
                <div class="tree-leaf"><span>currentZone</span></div>
                <div class="tree-leaf"><span>unlockedZones</span></div>
                <div class="tree-leaf"><span>totalVisits</span></div>
                <div class="tree-leaf"><span>expProgress</span></div>
                <div class="tree-leaf"><span>inventoryByType</span></div>
              </div>
            </div>
            <div class="tree-node">
              <span class="node-label action">actions</span>
              <div class="node-children">
                <div class="tree-leaf"><span>enterZone()</span></div>
                <div class="tree-leaf"><span>collectItem()</span></div>
                <div class="tree-leaf"><span>gainExp()</span></div>
                <div class="tree-leaf"><span>rest()</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="structure-info">
        <div class="info-card">
          <h6>📦 模块化</h6>
          <p>状态按功能模块划分，每个模块独立管理自己的 state、getters、actions</p>
        </div>
        <div class="info-card">
          <h6>🔄 可组合</h6>
          <p>模块可以嵌套组合，形成分形结构，大应用也能清晰组织</p>
        </div>
        <div class="info-card">
          <h6>🧩 可复用</h6>
          <p>相同模式的模块可以复用，支持多实例状态管理</p>
        </div>
      </div>
    </div>

    <div class="code-toggle">
      <button @click="showCode = !showCode">{{ showCode ? '收起代码' : '查看 Overmind 代码' }}</button>
    </div>

    <div v-if="showCode" class="code-block">
      <pre><code>// Overmind: 分形状态管理
import { createOvermind } from 'overmind'
import { createMixin } from 'overmind-vue'

// 1. 定义状态模块
const config = {
  state: {
    explorer: { name: '秋日探险家', level: 2, energy: 80 },
    zones: [],
    inventory: [],
  },
  getters: {
    currentZone: ({ state }) =&gt; 
      state.zones.find(z =&gt; z.id === state.currentZoneId),
    unlockedZones: ({ state }) =&gt; 
      state.zones.filter(z =&gt; z.unlocked),
    expProgress: ({ state }) =&gt; 
      Math.round((state.explorer.experience / (state.explorer.level * 200)) * 100),
    inventoryByType: ({ state }) =&gt; {
      const map = {}
      state.inventory.forEach(item =&gt; {
        if (!map[item.type]) map[item.type] = []
        map[item.type].push(item)
      })
      return map
    },
  },
  actions: {
    enterZone: ({ state, actions }, zoneId) =&gt; {
      const zone = state.zones.find(z =&gt; z.id === zoneId)
      if (zone &amp;&amp; zone.unlocked &amp;&amp; state.explorer.energy &gt;= 10) {
        state.currentZoneId = zoneId
        state.explorer.energy -= 10
        zone.visitCount++
        actions.gainExp(5)
        actions.collectRandomItem()
      }
    },
    gainExp: ({ state, getters }, amount) =&gt; {
      state.explorer.experience += amount
      while (state.explorer.experience &gt;= getters.expToNextLevel) {
        state.explorer.experience -= getters.expToNextLevel
        state.explorer.level++
      }
    },
    rest: ({ state }) =&gt; {
      state.explorer.energy = state.explorer.maxEnergy
    },
  },
}

// 2. 创建实例
const overmind = createOvermind(config)

// 3. 组件中使用
import { useOvermind } from 'overmind-vue'

export default {
  setup() {
    const { state, actions, getters } = useOvermind()
    return { state, actions, getters }
  }
}</code></pre>
    </div>

    <div class="knowledge-points">
      <h5>💡 知识点</h5>
      <ul>
        <li><strong>分形结构</strong>：每个模块都有 state / getters / actions，结构一致可嵌套</li>
        <li><strong>模块化组织</strong>：按功能域划分模块，大型应用状态更清晰</li>
        <li><strong>派生状态</strong>：getters 支持同步/异步，可依赖其他 getters</li>
        <li><strong>动作追踪</strong>：内置 devtools，支持时间旅行和动作重放</li>
        <li><strong>框架无关</strong>：核心独立，可适配 React / Vue / Angular 等</li>
        <li><strong>效果系统</strong>：effects 层处理副作用（API、路由、存储等），逻辑更清晰</li>
      </ul>
    </div>
  </div>
</template>`;export{e as default};
