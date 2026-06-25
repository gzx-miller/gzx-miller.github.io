<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'compare' | 'scenarios' | 'decision'>('compare')
const layoutMode = ref<'flex' | 'grid'>('flex')
const showScenario = ref<'nav' | 'tags' | 'cards' | 'form'>('nav')

interface GearItem {
  id: number
  name: string
  emoji: string
  price: number
  category: string
}

const gearItems: GearItem[] = [
  { id: 1, name: '登山背包', emoji: '🎒', price: 399, category: '装备' },
  { id: 2, name: '枫叶指南针', emoji: '🧭', price: 89, category: '工具' },
  { id: 3, name: '松果手电筒', emoji: '🔦', price: 129, category: '工具' },
  { id: 4, name: '保暖毛毯', emoji: '🧣', price: 159, category: '服饰' },
  { id: 5, name: '野营炉具', emoji: '🔥', price: 299, category: '装备' },
  { id: 6, name: '森林望远镜', emoji: '🔭', price: 459, category: '工具' },
]

const navItems = ['首页', '装备', '路线', '攻略', '关于我们']
const tags = ['秋日限定', '热门推荐', '新品上市', '限时折扣', '松鼠精选', '枫叶系列']

const flexCode = `<span style="color:#7c7c99">// Flex 布局 - 一维排列</span>
<span style="color:#8a8a3a">flex items-center justify-between</span>
<span style="color:#8a8a3a">flex-wrap gap-2</span>

<span style="color:#7c7c99">// 典型场景：导航栏</span>
&lt;nav <span style="color:#8a8a3a">class="flex items-center justify-between px-4 py-3"</span>&gt;
  &lt;div <span style="color:#8a8a3a">class="flex items-center gap-3"</span>&gt;
    &lt;Logo /&gt;
    &lt;span&gt;小松鼠探险&lt;/span&gt;
  &lt;/div&gt;
  &lt;ul <span style="color:#8a8a3a">class="flex items-center gap-6"</span>&gt;
    &lt;li v-for="item in nav" :key="item"&gt;{{ item }}&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;`

const gridCode = `<span style="color:#7c7c99">// Grid 布局 - 二维排列</span>
<span style="color:#8a8a3a">grid grid-cols-3 gap-4</span>

<span style="color:#7c7c99">// 典型场景：商品卡片网格</span>
&lt;div <span style="color:#8a8a3a">class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"</span>&gt;
  &lt;div v-for="item in products" :key="item.id"
       <span style="color:#8a8a3a">class="p-4 rounded-xl bg-orange-50 border border-orange-200"</span>&gt;
    &lt;div class="text-4xl"&gt;{{ item.emoji }}&lt;/div&gt;
    &lt;h3&gt;{{ item.name }}&lt;/h3&gt;
    &lt;p&gt;¥{{ item.price }}&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;`

const decisionTable = [
  { scenario: '导航栏 / 工具栏', flex: '✅ 非常适合', grid: '⚠️ 可以但没必要', reason: '一维排列，内容驱动宽度' },
  { scenario: '标签 / 面包屑', flex: '✅ 非常适合', grid: '❌ 不推荐', reason: '内容数量不定，自动换行' },
  { scenario: '卡片墙 / 产品列表', flex: '⚠️ flex-wrap 可做', grid: '✅ 最佳选择', reason: '二维对齐，行列规整' },
  { scenario: '整体页面布局', flex: '⚠️ 嵌套 flex 可做', grid: '✅ 最佳选择', reason: '命名区域，结构清晰' },
  { scenario: '表单排列', flex: '✅ 适合简单表单', grid: '✅ 适合复杂表单', reason: '根据复杂度选择' },
  { scenario: '居中对齐单个元素', flex: '✅ 最简单', grid: '✅ 也简单', reason: '两者都可以，flex 更常用' },
]
</script>

<template>
  <div class="demo-card tw-demo">
    <h3>Flexbox 与 Grid 布局对比选择</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">实时对比</button>
      <button class="tab-btn" :class="{ active: activeTab === 'scenarios' }" @click="activeTab = 'scenarios'">场景演示</button>
      <button class="tab-btn" :class="{ active: activeTab === 'decision' }" @click="activeTab = 'decision'">决策指南</button>
    </div>

    <div v-if="activeTab === 'compare'">
      <div class="mode-switch">
        <button :class="{ active: layoutMode === 'flex' }" @click="layoutMode = 'flex'">Flex 模式</button>
        <button :class="{ active: layoutMode === 'grid' }" @click="layoutMode = 'grid'">Grid 模式</button>
      </div>

      <div class="demo-area">
        <div class="demo-label">
          <span class="mode-badge" :class="layoutMode">{{ layoutMode === 'flex' ? 'Flexbox' : 'Grid' }}</span>
          <span class="demo-title">森林探险装备展示</span>
        </div>

        <div v-if="layoutMode === 'flex'" class="flex-demo">
          <div class="flex-items">
            <div v-for="item in gearItems" :key="item.id" class="gear-card">
              <div class="gear-emoji">{{ item.emoji }}</div>
              <div class="gear-name">{{ item.name }}</div>
              <div class="gear-price">¥{{ item.price }}</div>
            </div>
          </div>
        </div>

        <div v-else class="grid-demo">
          <div class="grid-items">
            <div v-for="item in gearItems" :key="item.id" class="gear-card">
              <div class="gear-emoji">{{ item.emoji }}</div>
              <div class="gear-name">{{ item.name }}</div>
              <div class="gear-price">¥{{ item.price }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="code-compare">
        <div class="code-col">
          <h4>Flex 代码</h4>
          <pre class="mini-code" v-html="flexCode"></pre>
        </div>
        <div class="code-col">
          <h4>Grid 代码</h4>
          <pre class="mini-code" v-html="gridCode"></pre>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>核心区别：</strong>Flex 是<strong>一维</strong>布局（一次处理一行或一列），Grid 是<strong>二维</strong>布局（同时处理行和列）。Flex 偏内容驱动，Grid 偏布局驱动。</p>
      </div>
    </div>

    <div v-if="activeTab === 'scenarios'">
      <div class="scenario-tabs">
        <button v-for="s in ['nav', 'tags', 'cards', 'form']" :key="s"
                :class="{ active: showScenario === s }"
                @click="showScenario = s as any">
          {{ s === 'nav' ? '导航栏' : s === 'tags' ? '标签云' : s === 'cards' ? '卡片网格' : '表单布局' }}
        </button>
      </div>

      <div class="scenario-demo">
        <div v-if="showScenario === 'nav'" class="nav-demo">
          <div class="nav-bar">
            <div class="nav-brand">
              <span class="brand-emoji">🐿️</span>
              <span>小松鼠探险</span>
            </div>
            <ul class="nav-links">
              <li v-for="item in navItems" :key="item">{{ item }}</li>
            </ul>
            <button class="nav-btn">登录</button>
          </div>
          <div class="scenario-note">
            <strong>推荐：Flex</strong> — 一维横向排列，内容宽度自适应，左右两端对齐最简单。
          </div>
        </div>

        <div v-if="showScenario === 'tags'" class="tags-demo">
          <div class="tag-cloud">
            <span v-for="tag in tags" :key="tag" class="tag-item">{{ tag }}</span>
          </div>
          <div class="scenario-note">
            <strong>推荐：Flex</strong> — 标签数量不定，flex-wrap 自动换行，间距均匀。
          </div>
        </div>

        <div v-if="showScenario === 'cards'" class="cards-demo">
          <div class="card-grid">
            <div v-for="item in gearItems" :key="item.id" class="card-item">
              <div class="card-emoji">{{ item.emoji }}</div>
              <div class="card-info">
                <h5>{{ item.name }}</h5>
                <span class="card-cat">{{ item.category }}</span>
              </div>
              <div class="card-price">¥{{ item.price }}</div>
            </div>
          </div>
          <div class="scenario-note">
            <strong>推荐：Grid</strong> — 二维卡片墙，行列对齐规整，响应式调整列数最方便。
          </div>
        </div>

        <div v-if="showScenario === 'form'" class="form-demo">
          <div class="form-grid">
            <label>
              <span>姓名</span>
              <input type="text" placeholder="请输入姓名" />
            </label>
            <label>
              <span>电话</span>
              <input type="tel" placeholder="请输入电话" />
            </label>
            <label class="full">
              <span>地址</span>
              <input type="text" placeholder="请输入详细地址" />
            </label>
            <label>
              <span>入住日期</span>
              <input type="date" />
            </label>
            <label>
              <span>离开日期</span>
              <input type="date" />
            </label>
          </div>
          <div class="scenario-note">
            <strong>推荐：Grid</strong> — 复杂表单多列布局，col-span 控制跨列，对齐精准。
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'decision'">
      <table class="decision-table">
        <thead>
          <tr>
            <th>场景</th>
            <th>Flex</th>
            <th>Grid</th>
            <th>原因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in decisionTable" :key="row.scenario">
            <td><strong>{{ row.scenario }}</strong></td>
            <td><span :class="row.flex.startsWith('✅') ? 'good' : row.flex.startsWith('⚠️') ? 'okay' : 'bad'">{{ row.flex }}</span></td>
            <td><span :class="row.grid.startsWith('✅') ? 'good' : row.grid.startsWith('⚠️') ? 'okay' : 'bad'">{{ row.grid }}</span></td>
            <td><small>{{ row.reason }}</small></td>
          </tr>
        </tbody>
      </table>

      <div class="tips-box">
        <p><strong>选择口诀：</strong></p>
        <ul>
          <li>一维排列选 <strong>Flex</strong>（行内/列内元素排列）</li>
          <li>二维布局选 <strong>Grid</strong>（行列同时控制）</li>
          <li>内容驱动选 <strong>Flex</strong>（元素大小决定布局）</li>
          <li>布局驱动选 <strong>Grid</strong>（布局轨道决定元素位置）</li>
          <li>两者可以<strong>组合使用</strong>，大布局用 Grid，内部细节用 Flex</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.tab-btn { padding: 6px 14px; border: 1px solid #e0a06a; border-radius: 6px; background: #fff; color: #5a2f22; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.tab-btn:hover { background: #fff3e0; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }

.mode-switch { display: flex; gap: 8px; margin-bottom: 12px; }
.mode-switch button { flex: 1; padding: 8px; border: 2px solid #fed7aa; border-radius: 8px; background: #fff; color: #7c2d12; cursor: pointer; font-weight: 600; transition: all 0.2s; }
.mode-switch button:hover { background: #fff7ed; }
.mode-switch button.active { background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border-color: #ea580c; }

.demo-area { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.demo-label { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.mode-badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.mode-badge.flex { background: #fde68a; color: #92400e; }
.mode-badge.grid { background: #fed7aa; color: #c2410c; }
.demo-title { font-size: 14px; color: #7c2d12; font-weight: 600; }

.flex-demo .flex-items { display: flex; flex-wrap: wrap; gap: 12px; }
.grid-demo .grid-items { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }

.gear-card { background: #fff; border: 1px solid #fed7aa; border-radius: 10px; padding: 12px; text-align: center; min-width: 100px; flex: 1 1 120px; transition: all 0.2s; }
.gear-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(155,75,29,0.15); }
.gear-emoji { font-size: 32px; margin-bottom: 6px; }
.gear-name { font-size: 13px; color: #7c2d12; font-weight: 500; }
.gear-price { font-size: 14px; color: #c2410c; font-weight: 700; margin-top: 4px; }

.code-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.code-col h4 { margin: 0 0 6px; font-size: 13px; color: #7c2d12; }

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 11px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }

.scenario-tabs { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.scenario-tabs button { padding: 5px 12px; border: 1px solid #fed7aa; border-radius: 6px; background: #fff; color: #9a3412; cursor: pointer; font-size: 12px; }
.scenario-tabs button.active { background: #f97316; color: #fff; border-color: #ea580c; }

.scenario-demo { background: #fff7ed; border-radius: 12px; padding: 16px; }
.scenario-note { margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 13px; color: #92400e; border-left: 3px solid #f59e0b; }

.nav-bar { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg, #fb923c, #f97316); padding: 10px 16px; border-radius: 10px; }
.nav-brand { display: flex; align-items: center; gap: 8px; color: #fff; font-weight: 600; }
.brand-emoji { font-size: 24px; }
.nav-links { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }
.nav-links li { color: #fff; font-size: 13px; cursor: pointer; opacity: 0.9; }
.nav-links li:hover { opacity: 1; }
.nav-btn { padding: 6px 14px; background: #fff; color: #ea580c; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }

.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; background: #fff; padding: 16px; border-radius: 10px; }
.tag-item { padding: 5px 12px; background: linear-gradient(135deg, #fed7aa, #fdba74); color: #7c2d12; border-radius: 16px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
.tag-item:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(234,88,12,0.2); }

.card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.card-item { display: flex; align-items: center; gap: 10px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #fed7aa; }
.card-emoji { font-size: 28px; }
.card-info { flex: 1; min-width: 0; }
.card-info h5 { margin: 0; font-size: 13px; color: #7c2d12; }
.card-cat { font-size: 11px; color: #a16207; }
.card-price { font-size: 14px; font-weight: 700; color: #c2410c; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #fff; padding: 16px; border-radius: 10px; }
.form-grid label { display: flex; flex-direction: column; gap: 4px; }
.form-grid label.full { grid-column: 1 / -1; }
.form-grid span { font-size: 12px; color: #7c2d12; font-weight: 500; }
.form-grid input { padding: 8px 10px; border: 1px solid #fed7aa; border-radius: 6px; font-size: 13px; outline: none; }
.form-grid input:focus { border-color: #f97316; box-shadow: 0 0 0 2px rgba(249,115,22,0.2); }

.decision-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.decision-table th, .decision-table td { padding: 10px 8px; border: 1px solid #fed7aa; text-align: left; }
.decision-table th { background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; font-weight: 600; }
.decision-table td { background: #fff7ed; }
.decision-table .good { color: #15803d; font-weight: 600; }
.decision-table .okay { color: #b45309; font-weight: 600; }
.decision-table .bad { color: #b91c1c; font-weight: 600; }
.decision-table small { color: #9a3412; }
</style>
