<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'demo' | 'template' | 'areas'>('demo')
const cols = ref(3)
const gapSize = ref(4)
const selectedCabin = ref<number | null>(null)

const cabins = [
  { id: 1, name: '松鼠小筑', size: '标准', price: 299, emoji: '🐿️', rating: 4.8 },
  { id: 2, name: '枫叶木屋', size: '大', price: 499, emoji: '🍁', rating: 4.9 },
  { id: 3, name: '橡果营地', size: '标准', price: 259, emoji: '🌰', rating: 4.6 },
  { id: 4, name: '暖阳树屋', size: '特大', price: 699, emoji: '🌲', rating: 5.0 },
  { id: 5, name: '森林秘境', size: '大', price: 559, emoji: '🦊', rating: 4.7 },
  { id: 6, name: '秋叶小居', size: '标准', price: 279, emoji: '🍂', rating: 4.5 },
]

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cols.value}, minmax(0, 1fr))`,
  gap: `${gapSize.value * 0.25}rem`,
}))

const codeExample = `<span style="color:#7c7c99">// 基础网格布局</span>
<span style="color:#8a8a3a">grid grid-cols-3 gap-4</span>

<span style="color:#7c7c99">// 响应式网格</span>
<span style="color:#8a8a3a">grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4</span>

<span style="color:#7c7c99">// Grid Template Areas</span>
<span style="color:#8a8a3a">grid grid-cols-[1fr_3fr] grid-rows-[auto_1fr_auto] gap-4</span>
<span style="color:#8a8a3a">[&>header]:col-span-2 [&>footer]:col-span-2</span>

<span style="color:#7c7c99">// 自动填充</span>
<span style="color:#8a8a3a">grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4</span>`

const areaLayoutCode = `.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 1rem;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }`
</script>

<template>
  <div class="demo-card tw-demo">
    <h3>Grid 网格布局与 Grid Template</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">小屋预订网格</button>
      <button class="tab-btn" :class="{ active: activeTab === 'template' }" @click="activeTab = 'template'">Template 语法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'areas' }" @click="activeTab = 'areas'">Areas 命名区域</button>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="controls">
        <div class="control-group">
          <label>列数：{{ cols }}</label>
          <input type="range" v-model.number="cols" min="1" max="4" />
        </div>
        <div class="control-group">
          <label>间距：{{ gapSize }}</label>
          <input type="range" v-model.number="gapSize" min="0" max="8" />
        </div>
      </div>

      <div class="cabin-grid" :style="gridStyle">
        <div
          v-for="cabin in cabins"
          :key="cabin.id"
          class="cabin-card"
          :class="{ selected: selectedCabin === cabin.id }"
          @click="selectedCabin = selectedCabin === cabin.id ? null : cabin.id"
        >
          <div class="cabin-emoji">{{ cabin.emoji }}</div>
          <div class="cabin-info">
            <h4>{{ cabin.name }}</h4>
            <div class="cabin-meta">
              <span class="size-tag">{{ cabin.size }}</span>
              <span class="rating">⭐ {{ cabin.rating }}</span>
            </div>
            <div class="price">¥{{ cabin.price }}<small>/晚</small></div>
          </div>
        </div>
      </div>

      <div class="selected-info" v-if="selectedCabin">
        已选择：<strong>{{ cabins.find(c => c.id === selectedCabin)?.name }}</strong>
      </div>

      <pre class="mini-code" v-html="codeExample"></pre>
      <div class="tips-box">
        <p><strong>Grid 布局适用场景：</strong></p>
        <ul>
          <li>二维布局（同时控制行和列）</li>
          <li>卡片墙、图片画廊、产品列表</li>
          <li>复杂页面整体布局（Header/Sidebar/Main/Footer）</li>
          <li>需要精确控制轨道尺寸和对齐方式</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'template'">
      <div class="template-demo">
        <div class="template-grid">
          <div class="t-header">Header（col-span-full）</div>
          <div class="t-sidebar">Sidebar（col-span-1）</div>
          <div class="t-main">Main（col-span-3）</div>
          <div class="t-footer">Footer（col-span-full）</div>
        </div>
      </div>
      <pre class="mini-code" v-html="codeExample"></pre>
      <div class="tips-box">
        <p><strong>Grid Template 常用语法：</strong></p>
        <ul>
          <li><code>grid-cols-3</code> → 3 列等宽</li>
          <li><code>grid-cols-[1fr_2fr_1fr]</code> → 自定义比例</li>
          <li><code>col-span-2</code> → 跨 2 列</li>
          <li><code>grid-rows-4</code> → 4 行等高</li>
          <li><code>row-span-2</code> → 跨 2 行</li>
          <li><code>auto-cols-fr</code> → 自动列宽</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'areas'">
      <div class="areas-demo">
        <div class="areas-grid">
          <div class="a-header">🏠 页面头部</div>
          <div class="a-sidebar">🌲 侧边导航</div>
          <div class="a-main">🍂 主要内容区域</div>
          <div class="a-footer">📝 页脚信息</div>
        </div>
      </div>
      <pre class="mini-code">{{ areaLayoutCode }}</pre>
      <div class="tips-box">
        <p><strong>命名区域优势：</strong>语义化强，布局结构一目了然。使用 <code>grid-template-areas</code> 定义区域，子元素用 <code>grid-area</code> 指定位置。响应式调整时只需修改 template 即可。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.tab-btn { padding: 6px 14px; border: 1px solid #e0a06a; border-radius: 6px; background: #fff; color: #5a2f22; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.tab-btn:hover { background: #fff3e0; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }

.controls { display: flex; gap: 24px; margin-bottom: 16px; padding: 12px; background: #fff7ed; border-radius: 8px; }
.control-group { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.control-group label { font-size: 13px; color: #7c2d12; font-weight: 500; }
.control-group input[type="range"] { accent-color: #ea580c; }

.cabin-grid { display: grid; margin-bottom: 12px; }
.cabin-card { background: linear-gradient(135deg, #fffaf1, #fff0dc); border: 2px solid #f0c38e; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; gap: 12px; }
.cabin-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(155,75,29,0.15); border-color: #ea580c; }
.cabin-card.selected { border-color: #ea580c; box-shadow: 0 0 0 3px rgba(234,88,12,0.2); background: linear-gradient(135deg, #ffedd5, #fed7aa); }
.cabin-emoji { font-size: 40px; text-align: center; }
.cabin-info h4 { margin: 0; font-size: 16px; color: #7c2d12; }
.cabin-meta { display: flex; justify-content: space-between; align-items: center; margin: 6px 0; }
.size-tag { font-size: 11px; padding: 2px 8px; background: #fde68a; color: #92400e; border-radius: 10px; }
.rating { font-size: 12px; color: #b45309; }
.price { font-size: 20px; font-weight: bold; color: #c2410c; }
.price small { font-size: 12px; font-weight: normal; color: #9a3412; }

.selected-info { padding: 10px 14px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px; font-size: 14px; color: #92400e; border-left: 3px solid #f59e0b; }

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }

.template-demo { margin-bottom: 12px; }
.template-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 60px 120px 50px; gap: 8px; }
.t-header { grid-column: 1 / -1; background: #fed7aa; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #7c2d12; font-weight: 600; }
.t-sidebar { grid-column: span 1; background: #fde68a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #92400e; }
.t-main { grid-column: span 3; background: #fff7ed; border: 1px dashed #fdba74; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #c2410c; }
.t-footer { grid-column: 1 / -1; background: #fed7aa; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #7c2d12; font-weight: 600; }

.areas-demo { margin-bottom: 12px; }
.areas-grid { display: grid; grid-template-columns: 120px 1fr; grid-template-rows: 50px 120px 40px; grid-template-areas: "header header" "sidebar main" "footer footer"; gap: 8px; }
.a-header { grid-area: header; background: linear-gradient(135deg, #fb923c, #f97316); border-radius: 8px; display: flex; align-items: center; padding: 0 16px; color: #fff; font-weight: 600; }
.a-sidebar { grid-area: sidebar; background: #fed7aa; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #7c2d12; font-size: 13px; }
.a-main { grid-area: main; background: #fff7ed; border: 1px dashed #fdba74; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #c2410c; }
.a-footer { grid-area: footer; background: #fde68a; border-radius: 8px; display: flex; align-items: center; padding: 0 16px; color: #92400e; font-size: 12px; }
</style>
