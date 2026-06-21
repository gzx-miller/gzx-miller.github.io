<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'demo' | 'mapping' | 'extract'>('demo')
const compact = ref(false)

const utilities = computed(() => compact.value
  ? ['flex', 'items-center', 'gap-2', 'rounded-xl', 'p-3', 'shadow-sm']
  : ['flex', 'items-center', 'gap-4', 'rounded-2xl', 'p-5', 'shadow-lg'])

const categoryMap = [
  { category: '布局', classes: 'flex, grid, block, inline-flex, items-center, justify-between', css: 'display, align-items, justify-content' },
  { category: '间距', classes: 'p-4, px-6, mt-2, gap-4, space-y-2', css: 'padding, margin, gap' },
  { category: '尺寸', classes: 'w-full, h-screen, max-w-md, min-h-0', css: 'width, height, max-width' },
  { category: '颜色', classes: 'bg-orange-500, text-white, border-gray-200', css: 'background, color, border-color' },
  { category: '排版', classes: 'text-lg, font-bold, leading-relaxed, tracking-wide', css: 'font-size, font-weight, line-height' },
  { category: '圆角', classes: 'rounded, rounded-lg, rounded-full, rounded-xl', css: 'border-radius' },
  { category: '阴影', classes: 'shadow, shadow-md, shadow-lg, shadow-none', css: 'box-shadow' },
  { category: '响应式', classes: 'md:flex, lg:grid-cols-3, sm:text-xl', css: '媒体查询前缀' },
  { category: '状态', classes: 'hover:bg-blue-500, focus:ring-2, disabled:opacity-50', css: '伪类变体' },
]

const extractCode = `<span style="color:#7c7c99">// ✅ 推荐：抽成 Vue 组件（结构复用）</span>
&lt;template&gt;
  &lt;CourseCard :course="course" /&gt;
&lt;/template&gt;

<span style="color:#7c7c99">// CourseCard.vue — 组件内部用工具类</span>
&lt;template&gt;
  &lt;div class="flex items-center gap-4 rounded-2xl p-5 shadow-lg"&gt;
    &lt;span class="text-2xl"&gt;🌰&lt;/span&gt;
    &lt;div&gt;
      &lt;strong class="text-lg"&gt;{{ course.name }}&lt;/strong&gt;
      &lt;p class="text-sm text-gray-500"&gt;{{ course.desc }}&lt;/p&gt;
    &lt;/div&gt;
    &lt;b class="text-orange-500"&gt;¥{{ course.price }}&lt;/b&gt;
  &lt;/div&gt;
&lt;/template&gt;

<span style="color:#7c7c99">// ❌ 不推荐：用 @apply 堆自定义类</span>
<span style="color:#7c7c99">/* 不要这样 */</span>
.my-card {
  @apply flex items-center gap-4 rounded-2xl p-5 shadow-lg;
  @apply text-lg font-bold;
  <span style="color:#e85d04">/* 类名丢失了工具类的自描述性 */</span>
}`

const utilityCode = `<span style="color:#7c7c99">// 传统 CSS 写法</span>
.course-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,.1);
}

<span style="color:#7c7c99">// Tailwind 工具类写法（等价）</span>
&lt;div class="flex items-center gap-4 p-5 rounded-2xl shadow-lg"&gt;
  ...
&lt;/div&gt;

<span style="color:#7c7c99">// 每个类对应一条 CSS 声明</span>
<span style="color:#8a8a3a">flex</span>      → display: flex
<span style="color:#8a8a3a">items-center</span> → align-items: center
<span style="color:#8a8a3a">gap-4</span>      → gap: 1rem
<span style="color:#8a8a3a">p-5</span>        → padding: 1.25rem
<span style="color:#8a8a3a">rounded-2xl</span> → border-radius: 1rem
<span style="color:#8a8a3a">shadow-lg</span>   → box-shadow: 0 10px 24px ...`
</script>

<template>
  <div class="demo-card tw-demo">
    <h3>Utility-First：工具类优先</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">实时演示</button>
      <button :class="{ active: activeTab === 'mapping' }" @click="activeTab = 'mapping'">类名映射</button>
      <button :class="{ active: activeTab === 'extract' }" @click="activeTab = 'extract'">何时抽取组件</button>
    </div>

    <div v-if="activeTab === 'demo'">
      <div class="toolbar">
        <button @click="compact = !compact">切换{{ compact ? '舒展' : '紧凑' }}密度</button>
      </div>
      <div class="course-card" :class="{ compact }">
        <span class="chestnut">🌰</span>
        <div>
          <strong>Vue 响应式精讲</strong>
          <p>把单用途工具类组合成完整课程卡片。</p>
        </div>
        <b>¥39</b>
      </div>
      <div class="class-list">
        <code v-for="item in utilities" :key="item">{{ item }}</code>
      </div>
      <pre class="mini-code" v-html="utilityCode" style="margin-top:10px;"></pre>
      <small>工具类描述单一 CSS 声明；重复组合应抽成组件，而不是急着写自定义类。</small>
    </div>

    <div v-if="activeTab === 'mapping'">
      <table>
        <thead><tr><th>分类</th><th>常用工具类</th><th>对应 CSS</th></tr></thead>
        <tbody>
          <tr v-for="m in categoryMap" :key="m.category">
            <td><strong>{{ m.category }}</strong></td>
            <td><code>{{ m.classes }}</code></td>
            <td><small>{{ m.css }}</small></td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box">
        <p><strong>设计令牌：</strong>Tailwind 的间距、颜色、字号都基于预定义的令牌系统（如 <code>p-4 = 1rem</code>），保证全站一致性。</p>
      </div>
    </div>

    <div v-if="activeTab === 'extract'">
      <pre class="mini-code" v-html="extractCode"></pre>
      <div class="tips-box">
        <p><strong>抽取时机：</strong></p>
        <ul>
          <li>同一段工具类组合<strong>重复 3 次以上</strong> → 抽成组件</li>
          <li>有<strong>业务语义</strong>（如"课程卡片"）→ 抽成组件</li>
          <li>仅缩短 class 长度 → <strong>不要</strong>用 <code>@apply</code>，保留工具类的自描述性</li>
          <li>样式共置在组件中，比散落在 CSS 文件更易维护</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.toolbar { margin-bottom: 0.8rem; }
.toolbar button { padding: 5px 14px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.toolbar button:hover { background: #fff3e0; }
button.active { background: #e85d04; color: #fff; border-color: #e85d04; }
button { padding: 5px 14px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.course-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border: 1px solid #f0c38e; border-radius: 1rem; background: linear-gradient(135deg, #fffaf1, #fff0dc); box-shadow: 0 12px 28px rgba(155,75,29,0.09); transition: all 0.2s; }
.course-card.compact { gap: 0.5rem; padding: 0.75rem; border-radius: 0.7rem; box-shadow: 0 4px 12px rgba(155,75,29,0.07); }
.course-card p { margin: 0.25rem 0 0; color: #805d46; }
.course-card b { margin-left: auto; color: #bd4d22; }
.chestnut { font-size: 2rem; }
.class-list { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.8rem 0; }
.class-list code { padding: 0.15rem 0.4rem; border-radius: 0.35rem; background: #5a2f22; color: #ffe8c5; font-size: 0.75rem; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
small { color: #8a6d42; }
ul { padding-left: 18px; font-size: 12px; }
</style>
