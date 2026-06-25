<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'if' | 'for' | 'each' | 'while'>('if')
const spacingLevel = ref(3)
const colorCount = ref(5)

const autumnColors = ['#e85d04', '#f4a261', '#e9c46a', '#2a9d8f', '#264653', '#8b4513', '#cd853f', '#d2691e']

const displayColors = computed(() => autumnColors.slice(0, colorCount.value))

const spacingValues = computed(() => {
  const result = []
  for (let i = 1; i <= 6; i++) {
    result.push({ level: i, value: i * 8 })
  }
  return result
})

const ifCode = `<span style="color:#7c7c99">// @if / @else if / @else — 条件判断</span>
@mixin button-variant($type) {
  @if $type == primary {
    background: #e85d04;
    color: #fff;
    &:hover { background: #c45125; }
  } @else if $type == secondary {
    background: #fff;
    color: #8b4513;
    border: 2px solid #e0a06a;
  } @else if $type == danger {
    background: #dc2626;
    color: #fff;
  } @else {
    @warn "未知按钮类型: #{$type}";
    background: #ccc;
  }
}

.btn-primary { @include button-variant(primary); }
.btn-secondary { @include button-variant(secondary); }
.btn-danger { @include button-variant(danger); }

<span style="color:#7c7c99">// 三元表达式 — 简单条件</span>
$is-dark: true;
.text { color: if($is-dark, #fff, #333); }`

const forCode = `<span style="color:#7c7c99">// @for — 循环（从数字到数字）</span>
<span style="color:#8a8a3a">// through: 包含结束值 | to: 不包含结束值</span>

<span style="color:#7c7c99">// 生成间距工具类</span>
@for $i from 1 through 6 {
  .m-#{$i} { margin: #{$i * 8}px; }
  .mt-#{$i} { margin-top: #{$i * 8}px; }
  .mb-#{$i} { margin-bottom: #{$i * 8}px; }
  .p-#{$i} { padding: #{$i * 8}px; }
}

<span style="color:#7c7c99">// 编译结果</span>
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
...
.m-6 { margin: 48px; }

<span style="color:#7c7c99">// 生成宽度百分比类</span>
@for $i from 1 through 12 {
  .w-#{$i}-12 { width: percentage($i / 12); }
}`

const eachCode = `<span style="color:#7c7c99">// @each — 遍历列表或 Map（最常用）</span>

<span style="color:#7c7c99">// 遍历列表</span>
$colors: primary #e85d04, secondary #f4a261, danger #dc2626;

@each $name, $color in $colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name} { background: $color; }
  .border-#{$name} { border-color: $color; }
}

<span style="color:#7c7c99">// 遍历 Map（更清晰）</span>
$breakpoints: (
  sm: 480px,
  md: 768px,
  lg: 1024px,
  xl: 1280px
);

@each $name, $width in $breakpoints {
  @media (min-width: $width) {
    .hidden-#{$name} { display: none; }
  }
}

<span style="color:#7c7c99">// 多值遍历</span>
$icons: home "\f015", user "\f007", search "\f002";
@each $name, $code in $icons {
  .icon-#{$name}:before { content: $code; }
}`

const whileCode = `<span style="color:#7c7c99">// @while — 条件循环（较少用）</span>
$i: 1;
@while $i <= 6 {
  .fs-#{$i} { font-size: 12px + $i * 2; }
  $i: $i + 1;
}

<span style="color:#7c7c99">// 编译结果</span>
.fs-1 { font-size: 14px; }
.fs-2 { font-size: 16px; }
.fs-3 { font-size: 18px; }
.fs-4 { font-size: 20px; }
.fs-5 { font-size: 22px; }
.fs-6 { font-size: 24px; }

<span style="color:#7c7c99">// 注意事项</span>
• 容易写错导致无限循环
• 大多数场景 @for / @each 更清晰
• 适合需要动态步长的场景`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>控制流：@if / @for / @each / @while</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
      <button class="tab-btn" :class="{ active: activeTab === 'if' }" @click="activeTab = 'if'">@if 条件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'for' }" @click="activeTab = 'for'">@for 循环</button>
      <button class="tab-btn" :class="{ active: activeTab === 'each' }" @click="activeTab = 'each'">@each 遍历</button>
      <button class="tab-btn" :class="{ active: activeTab === 'while' }" @click="activeTab = 'while'">@while 循环</button>
    </div>

    <div v-if="activeTab === 'if'">
      <h4>实时预览：按钮变体</h4>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <button class="demo-btn primary">主按钮</button>
        <button class="demo-btn secondary">次按钮</button>
        <button class="demo-btn danger">危险按钮</button>
        <button class="demo-btn default">默认按钮</button>
      </div>
      <pre class="mini-code" v-html="ifCode"></pre>
    </div>

    <div v-if="activeTab === 'for'">
      <h4>实时预览：间距系统</h4>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <label>间距级别：</label>
        <input v-model.number="spacingLevel" type="range" min="1" max="6" style="flex:1;" />
        <span class="level-tag">m-{{ spacingLevel }} = {{ spacingLevel * 8 }}px</span>
      </div>
      <div class="spacing-demo">
        <div class="spacing-box" :style="{ padding: spacingLevel * 8 + 'px' }">
          <span>内边距 p-{{ spacingLevel }}</span>
        </div>
      </div>
      <div class="spacing-row" style="margin-top:12px;">
        <div v-for="s in spacingValues" :key="s.level" class="spacing-item">
          <span>.m-{{ s.level }}</span>
          <small>{{ s.value }}px</small>
        </div>
      </div>
      <pre class="mini-code" v-html="forCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'each'">
      <h4>实时预览：颜色系统</h4>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <label>颜色数量：</label>
        <input v-model.number="colorCount" type="range" min="3" max="8" style="flex:1;" />
        <span class="level-tag">{{ colorCount }} 种</span>
      </div>
      <div class="color-grid">
        <div v-for="(color, i) in displayColors" :key="i" class="color-item" :style="{ background: color }">
          <span>颜色 {{ i + 1 }}</span>
          <small>{{ color }}</small>
        </div>
      </div>
      <pre class="mini-code" v-html="eachCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'while'">
      <h4>代码示例</h4>
      <pre class="mini-code" v-html="whileCode"></pre>
      <div class="tips-box">
        <p><strong>@while 使用建议：</strong></p>
        <ul>
          <li>优先使用 <code>@for</code> 或 <code>@each</code>，可读性更好</li>
          <li>使用 @while 时务必确保计数器正确递增</li>
          <li>适合需要动态计算步长的复杂循环</li>
          <li>可配合 <code>@debug</code> 输出循环变量值调试</li>
        </ul>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>选择指南：</strong></p>
      <ul>
        <li><strong>@if</strong>：条件分支、变体判断</li>
        <li><strong>@for</strong>：已知次数的数字循环（间距、网格、z-index）</li>
        <li><strong>@each</strong>：遍历列表/Map 生成类（颜色、断点、图标）—— 最常用</li>
        <li><strong>@while</strong>：需要动态条件或步长的循环（少用）</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.demo-btn { padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 13px; border: 2px solid transparent; }
.demo-btn.primary { background: #e85d04; color: #fff; }
.demo-btn.secondary { background: #fff; color: #8b4513; border-color: #e0a06a; }
.demo-btn.danger { background: #dc2626; color: #fff; }
.demo-btn.default { background: #ccc; color: #666; }
.level-tag { padding: 2px 10px; background: #fff3df; border-radius: 4px; font-size: 12px; color: #8b4513; font-weight: 600; }
.spacing-demo { background: #fffaf1; border-radius: 8px; padding: 4px; }
.spacing-box { background: #fff3df; border-radius: 6px; text-align: center; transition: all 0.2s; }
.spacing-box span { font-size: 12px; color: #8b4513; }
.spacing-row { display: flex; gap: 8px; flex-wrap: wrap; }
.spacing-item { padding: 8px 12px; background: #fff; border: 1px solid #e0a06a; border-radius: 6px; text-align: center; min-width: 60px; }
.spacing-item span { font-size: 12px; font-weight: 600; color: #8b4513; display: block; }
.spacing-item small { font-size: 10px; color: #a08060; }
.color-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.color-item { padding: 16px; border-radius: 8px; text-align: center; }
.color-item span { font-size: 12px; font-weight: 600; display: block; }
.color-item small { font-size: 10px; opacity: 0.9; }
.color-item:nth-child(1) span, .color-item:nth-child(2) span, .color-item:nth-child(3) span,
.color-item:nth-child(7) span, .color-item:nth-child(8) span { color: #fff; }
.color-item:nth-child(4) span, .color-item:nth-child(5) span, .color-item:nth-child(6) span { color: #fff; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
input[type="range"] { accent-color: #e85d04; }
</style>
