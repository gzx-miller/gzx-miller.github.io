const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'states' | 'group' | 'pseudo'>('states')
const likeCount = ref(128)
const isLiked = ref(false)
const isLoading = ref(false)
const formData = ref({ name: '', email: '' })
const agreeTerms = ref(false)
const quantity = ref(1)
const activeColor = ref('orange')

const colorOptions = [
  { name: '暖橙', value: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-500' },
  { name: '枫红', value: 'red', bg: 'bg-red-500', ring: 'ring-red-500' },
  { name: '松绿', value: 'green', bg: 'bg-green-600', ring: 'ring-green-600' },
  { name: '琥珀', value: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
]

const handleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

const handleSubmit = () => {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    alert('报名成功！小松鼠会联系你 🌰')
  }, 1500)
}

const statesCode = \`<span style="color:#7c7c99">// 悬停状态</span>
<span style="color:#8a8a3a">hover:bg-orange-600 hover:scale-105</span>

<span style="color:#7c7c99">// 焦点状态</span>
<span style="color:#8a8a3a">focus:ring-2 focus:ring-orange-500 focus:outline-none</span>

<span style="color:#7c7c99">// 激活状态</span>
<span style="color:#8a8a3a">active:scale-95</span>

<span style="color:#7c7c99">// 禁用状态</span>
<span style="color:#8a8a3a">disabled:opacity-50 disabled:cursor-not-allowed</span>

<span style="color:#7c7c99">// 选中状态</span>
<span style="color:#8a8a3a">checked:bg-orange-500 checked:border-orange-500</span>\`

const groupCode = \`<span style="color:#7c7c99">// Group 悬停 - 父元素加 group</span>
&lt;div <span style="color:#8a8a3a">class="group p-4 rounded-xl border-2</span>
       <span style="color:#8a8a3a">border-orange-200 hover:border-orange-500</span>
       <span style="color:#8a8a3a">transition-all cursor-pointer"</span>&gt;
  &lt;h3 <span style="color:#8a8a3a">class="group-hover:text-orange-600</span>
       <span style="color:#8a8a3a">transition-colors"</span>&gt;
    卡片标题
  &lt;/h3&gt;
  &lt;button <span style="color:#8a8a3a">class="opacity-0 group-hover:opacity-100</span>
          <span style="color:#8a8a3a">transition-opacity"</span>&gt;
    查看详情 →
  &lt;/button&gt;
&lt;/div&gt;\`

const pseudoCode = \`<span style="color:#7c7c99">// 首元素 / 尾元素</span>
<span style="color:#8a8a3a">first:rounded-t-lg last:rounded-b-lg</span>

<span style="color:#7c7c99">// 奇偶行</span>
<span style="color:#8a8a3a">odd:bg-orange-50 even:bg-white</span>

<span style="color:#7c7c99">// 空元素</span>
<span style="color:#8a8a3a">empty:hidden</span>

<span style="color:#7c7c99">// 占位符样式</span>
<span style="color:#8a8a3a">placeholder:text-orange-300</span>

<span style="color:#7c7c99">// 选择文本颜色</span>
<span style="color:#8a8a3a">selection:bg-orange-200 selection:text-orange-900</span>\`
<\/script>

<template>
  <div class="demo-card tw-demo">
    <h3>交互状态与组(Group)状态</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'states' }" @click="activeTab = 'states'">状态变体</button>
      <button class="tab-btn" :class="{ active: activeTab === 'group' }" @click="activeTab = 'group'">Group 组状态</button>
      <button class="tab-btn" :class="{ active: activeTab === 'pseudo' }" @click="activeTab = 'pseudo'">其他伪类</button>
    </div>

    <div v-if="activeTab === 'states'">
      <div class="states-demo">
        <div class="demo-section">
          <h4>🍂 秋日活动报名</h4>
          <div class="form-demo">
            <div class="form-row">
              <label class="field-label">
                <span>姓名</span>
                <input type="text" v-model="formData.name" placeholder="请输入您的姓名"
                       class="input-field" />
              </label>
              <label class="field-label">
                <span>邮箱</span>
                <input type="email" v-model="formData.email" placeholder="squirrel@forest.com"
                       class="input-field" />
              </label>
            </div>
            <div class="form-row">
              <div class="qty-control">
                <button @click="quantity = Math.max(1, quantity - 1)"
                        :disabled="quantity <= 1"
                        class="qty-btn">−</button>
                <span class="qty-value">{{ quantity }}</span>
                <button @click="quantity++"
                        :disabled="quantity >= 10"
                        class="qty-btn">+</button>
              </div>
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" />
                <span>我同意参加秋日森林探险 🌲</span>
              </label>
            </div>
            <button @click="handleSubmit"
                    :disabled="!agreeTerms || isLoading || !formData.name"
                    class="submit-btn">
              <span v-if="isLoading">报名中...</span>
              <span v-else>立即报名</span>
            </button>
          </div>
        </div>

        <div class="demo-section">
          <h4>❤️ 点赞互动</h4>
          <div class="like-demo">
            <button @click="handleLike" class="like-btn" :class="{ liked: isLiked }">
              <span class="heart">{{ isLiked ? '❤️' : '🤍' }}</span>
              <span>{{ likeCount }}</span>
            </button>
            <p class="like-hint">点击体验悬停、激活、选中状态</p>
          </div>
        </div>

        <div class="demo-section">
          <h4>🎨 主题色选择</h4>
          <div class="color-picker">
            <button v-for="color in colorOptions" :key="color.value"
                    class="color-btn"
                    :class="[color.bg, { selected: activeColor === color.value }]"
                    :style="{ '--ring-color': color.value === 'orange' ? '#ea580c' : color.value === 'red' ? '#dc2626' : color.value === 'green' ? '#16a34a' : '#d97706' }"
                    @click="activeColor = color.value">
              {{ color.name }}
            </button>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="statesCode"></pre>
      <div class="tips-box">
        <p><strong>常用状态变体：</strong></p>
        <ul>
          <li><code>hover:</code> 鼠标悬停 — 按钮高亮、卡片上浮</li>
          <li><code>focus:</code> 获得焦点 — 输入框描边、无障碍</li>
          <li><code>active:</code> 按下激活 — 按钮按压效果</li>
          <li><code>disabled:</code> 禁用状态 — 置灰不可点击</li>
          <li><code>checked:</code> 选中状态 — 复选框/单选框</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'group'">
      <div class="group-demo">
        <div class="cards-row">
          <div class="group-card group">
            <div class="card-icon">🏕️</div>
            <h4 class="group-hover:text-orange-600 transition-colors">森林露营</h4>
            <p class="card-desc">在星空下入睡，被鸟鸣唤醒</p>
            <button class="card-btn opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              了解详情 →
            </button>
          </div>

          <div class="group-card group">
            <div class="card-icon">🍁</div>
            <h4 class="group-hover:text-red-600 transition-colors">枫叶漫步</h4>
            <p class="card-desc">踏着金色落叶走进深秋</p>
            <button class="card-btn opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              了解详情 →
            </button>
          </div>

          <div class="group-card group">
            <div class="card-icon">🌰</div>
            <h4 class="group-hover:text-amber-600 transition-colors">采撷松果</h4>
            <p class="card-desc">和小松鼠一起收集秋日宝藏</p>
            <button class="card-btn opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              了解详情 →
            </button>
          </div>
        </div>

        <div class="group-table-demo">
          <h4>📋 活动列表（行悬停高亮）</h4>
          <table class="group-table">
            <thead>
              <tr>
                <th>活动名称</th>
                <th>时间</th>
                <th>名额</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, i) in [
                { name: '秋日摄影之旅', time: '10月15日', spots: 8 },
                { name: '森林徒步探险', time: '10月22日', spots: 12 },
                { name: '手工松果制作', time: '10月29日', spots: 6 },
              ]" :key="i" class="group">
                <td>{{ activity.name }}</td>
                <td>{{ activity.time }}</td>
                <td>剩余 {{ activity.spots }} 位</td>
                <td>
                  <button class="row-btn opacity-0 group-hover:opacity-100 transition-opacity">
                    立即报名
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <pre class="mini-code" v-html="groupCode"></pre>
      <div class="tips-box">
        <p><strong>Group 状态技巧：</strong></p>
        <ul>
          <li>父元素加 <code>group</code>，子元素用 <code>group-hover:</code> 监听父级悬停</li>
          <li>可用于卡片、表格行、列表项等容器的联动效果</li>
          <li>常配合 <code>opacity</code>、<code>translate</code>、<code>transition</code> 实现优雅动画</li>
          <li>支持嵌套：<code>group/name</code> 命名组避免冲突</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'pseudo'">
      <div class="pseudo-demo">
        <div class="demo-section">
          <h4>📝 奇偶行斑马纹</h4>
          <ul class="zebra-list">
            <li v-for="n in 6" :key="n">第 {{ n }} 条森林小知识 - 松鼠每年会藏几千颗坚果</li>
          </ul>
        </div>

        <div class="demo-section">
          <h4>✏️ 文本选择效果</h4>
          <p class="select-demo">
            选中这段文字试试！秋日森林里，阳光透过枫叶洒下金色光斑，小松鼠在树枝间跳跃，
            空气中弥漫着松果和泥土的清香。这是一年中最美的季节，每一片落叶都写着诗意。
          </p>
        </div>

        <div class="demo-section">
          <h4>🔍 占位符样式</h4>
          <input type="text" class="placeholder-input" placeholder="搜索森林里的秘密..." />
        </div>

        <div class="demo-section">
          <h4>📦 first/last 圆角</h4>
          <div class="stacked-cards">
            <div v-for="n in 4" :key="n" class="stack-item">
              堆叠卡片 {{ n }}
            </div>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="pseudoCode"></pre>
      <div class="tips-box">
        <p><strong>更多伪类变体：</strong></p>
        <ul>
          <li><code>first:</code> / <code>last:</code> — 首/尾元素特殊样式</li>
          <li><code>odd:</code> / <code>even:</code> — 奇偶元素交替样式</li>
          <li><code>empty:</code> — 空元素隐藏</li>
          <li><code>placeholder:</code> — 输入框占位符样式</li>
          <li><code>selection:</code> — 选中文本的背景和颜色</li>
          <li><code>required:</code> / <code>valid:</code> / <code>invalid:</code> — 表单验证状态</li>
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

.states-demo, .group-demo, .pseudo-demo { display: flex; flex-direction: column; gap: 16px; }
.demo-section { background: #fff7ed; padding: 16px; border-radius: 10px; }
.demo-section h4 { margin: 0 0 12px; color: #7c2d12; font-size: 15px; }

.form-demo { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.field-label { flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 4px; }
.field-label span { font-size: 12px; color: #9a3412; font-weight: 500; }
.input-field { padding: 8px 12px; border: 2px solid #fed7aa; border-radius: 8px; font-size: 13px; outline: none; transition: all 0.2s; background: #fff; }
.input-field:hover { border-color: #fdba74; }
.input-field:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.2); }

.qty-control { display: flex; align-items: center; gap: 0; border: 2px solid #fed7aa; border-radius: 8px; overflow: hidden; }
.qty-btn { width: 32px; height: 36px; border: none; background: #fff7ed; color: #c2410c; font-size: 18px; cursor: pointer; transition: all 0.15s; }
.qty-btn:hover:not(:disabled) { background: #fed7aa; }
.qty-btn:active:not(:disabled) { background: #fdba74; }
.qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.qty-value { width: 40px; text-align: center; font-weight: 600; color: #7c2d12; background: #fff; }

.checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #7c2d12; }
.checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: #f97316; cursor: pointer; }

.submit-btn { padding: 10px 24px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; align-self: flex-start; }
.submit-btn:hover:not(:disabled) { background: linear-gradient(135deg, #f97316, #ea580c); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.like-demo { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.like-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #fff; border: 2px solid #fed7aa; border-radius: 999px; cursor: pointer; font-size: 15px; color: #7c2d12; transition: all 0.2s; }
.like-btn:hover { border-color: #f97316; background: #fff7ed; }
.like-btn:active { transform: scale(0.95); }
.like-btn.liked { border-color: #f87171; background: #fef2f2; }
.heart { font-size: 20px; transition: transform 0.2s; }
.like-btn:hover .heart { transform: scale(1.2); }
.like-hint { margin: 0; font-size: 12px; color: #a16207; }

.color-picker { display: flex; gap: 10px; flex-wrap: wrap; }
.color-btn { padding: 8px 18px; border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; }
.color-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.color-btn:active { transform: translateY(0); }
.color-btn.selected { box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--ring-color); }

.cards-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.group-card { background: #fff; border: 2px solid #fed7aa; border-radius: 12px; padding: 16px; text-align: center; transition: all 0.3s; cursor: pointer; }
.group-card:hover { border-color: #f97316; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(249,115,22,0.15); }
.card-icon { font-size: 40px; margin-bottom: 8px; }
.group-card h4 { margin: 0 0 4px; color: #7c2d12; font-size: 16px; }
.card-desc { margin: 0 0 12px; font-size: 12px; color: #9a3412; }
.card-btn { padding: 6px 14px; background: #f97316; color: #fff; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }

.group-table-demo h4 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.group-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 8px; overflow: hidden; }
.group-table th { background: #fed7aa; padding: 10px 12px; text-align: left; color: #7c2d12; font-weight: 600; }
.group-table td { padding: 10px 12px; border-bottom: 1px solid #fed7aa; color: #7c2d12; }
.group-table tr:hover td { background: #fff7ed; }
.row-btn { padding: 4px 12px; background: #f97316; color: #fff; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; }

.zebra-list { list-style: none; margin: 0; padding: 0; border-radius: 8px; overflow: hidden; }
.zebra-list li { padding: 10px 14px; font-size: 13px; color: #7c2d12; }
.zebra-list li:nth-child(odd) { background: #fff7ed; }
.zebra-list li:nth-child(even) { background: #fff; }

.select-demo { margin: 0; padding: 14px; background: #fff; border-radius: 8px; line-height: 1.7; font-size: 13px; color: #7c2d12; }
.select-demo::selection { background: #fed7aa; color: #7c2d12; }

.placeholder-input { width: 100%; padding: 10px 14px; border: 2px solid #fed7aa; border-radius: 8px; font-size: 13px; outline: none; transition: border-color 0.2s; }
.placeholder-input:focus { border-color: #f97316; }
.placeholder-input::placeholder { color: #fdba74; }

.stacked-cards { display: flex; flex-direction: column; gap: 0; }
.stack-item { padding: 12px 16px; background: #fff; border: 1px solid #fed7aa; border-bottom: none; font-size: 13px; color: #7c2d12; }
.stack-item:first-child { border-radius: 8px 8px 0 0; }
.stack-item:last-child { border-radius: 0 0 8px 8px; border-bottom: 1px solid #fed7aa; }

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; margin-top: 12px; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }
</style>
`;export{n as default};
