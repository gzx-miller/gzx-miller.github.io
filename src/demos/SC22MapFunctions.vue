<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'basic' | 'functions' | 'nested'>('basic')
const selectedColor = ref('primary')

const colorMap = {
  primary: { main: '#e85d04', light: '#f4a261', dark: '#c45125' },
  secondary: { main: '#8b4513', light: '#cd853f', dark: '#654321' },
  success: { main: '#16a34a', light: '#4ade80', dark: '#15803d' },
  warning: { main: '#f59e0b', light: '#fcd34d', dark: '#d97706' },
  danger: { main: '#dc2626', light: '#f87171', dark: '#b91c1c' }
}

const colorKeys = Object.keys(colorMap)
const currentColor = computed(() => colorMap[selectedColor.value as keyof typeof colorMap])

const basicCode = `<span style="color:#7c7c99">// Map 基本定义 — 键值对数据结构</span>
$colors: (
  primary: #e85d04,
  secondary: #8b4513,
  success: #16a34a,
  warning: #f59e0b,
  danger: #dc2626
);

$breakpoints: (
  sm: 480px,
  md: 768px,
  lg: 1024px,
  xl: 1280px
);

<span style="color:#7c7c99">// 获取值 — map-get()</span>
.btn-primary {
  background: map-get($colors, primary);  <span style="color:#8a8a3a">// #e85d04</span>
}

<span style="color:#7c7c99">// 配合 @each 批量生成</span>
@each $name, $color in $colors {
  .text-#{$name} { color: $color; }
  .bg-#{$name} { background-color: $color; }
  .border-#{$name} { border-color: $color; }
}`

const functionsCode = `<span style="color:#7c7c99">// Map 常用函数</span>

<span style="color:#7c7c99">// 1. map-get($map, $key) — 获取值</span>
$value: map-get($colors, primary);  <span style="color:#8a8a3a">// #e85d04</span>

<span style="color:#7c7c99">// 2. map-has-key($map, $key) — 检查键是否存在</span>
@function get-color($name) {
  @if not map-has-key($colors, $name) {
    @error "颜色 '#{$name}' 不存在";
  }
  @return map-get($colors, $name);
}

<span style="color:#7c7c99">// 3. map-keys($map) — 获取所有键</span>
$color-names: map-keys($colors);
<span style="color:#8a8a3a">// (primary, secondary, success, warning, danger)</span>

<span style="color:#7c7c99">// 4. map-values($map) — 获取所有值</span>
$color-values: map-values($colors);
<span style="color:#8a8a3a">// (#e85d04, #8b4513, #16a34a, #f59e0b, #dc2626)</span>

<span style="color:#7c7c99">// 5. map-merge($map1, $map2) — 合并 Map</span>
$more-colors: (info: #3b82f6, muted: #6b7280);
$all-colors: map-merge($colors, $more-colors);

<span style="color:#7c7c99">// 6. map-remove($map, $keys...) — 删除键</span>
$basic-colors: map-remove($colors, warning, danger);

<span style="color:#7c7c99">// 7. map.set($map, $key, $value) — 设置值（Sass 1.23+）</span>
$colors: map.set($colors, primary, #f97316);`

const nestedCode = `<span style="color:#7c7c99">// 嵌套 Map — 组织更复杂的数据</span>
$theme-colors: (
  primary: (
    main: #e85d04,
    light: #f4a261,
    dark: #c45125,
    contrast: #ffffff
  ),
  secondary: (
    main: #8b4513,
    light: #cd853f,
    dark: #654321,
    contrast: #ffffff
  )
);

<span style="color:#7c7c99">// 深度获取 — map-get 嵌套调用</span>
@function theme-color($name, $shade: main) {
  $color-group: map-get($theme-colors, $name);
  @if $color-group == null {
    @error "颜色组 '#{$name}' 不存在";
  }
  $color: map-get($color-group, $shade);
  @if $color == null {
    @error "色阶 '#{$shade}' 不存在于 #{$name}";
  }
  @return $color;
}

<span style="color:#7c7c99">// 使用</span>
.btn {
  background: theme-color(primary, main);
  color: theme-color(primary, contrast);
  
  &:hover { background: theme-color(primary, dark); }
  &:disabled { background: theme-color(primary, light); }
}

<span style="color:#7c7c99">// Sass 1.23+ 可用 map.get 深度获取</span>
$color: map.get($theme-colors, primary, light);`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>Map 数据结构与函数</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础用法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'functions' }" @click="activeTab = 'functions'">Map 函数</button>
      <button class="tab-btn" :class="{ active: activeTab === 'nested' }" @click="activeTab = 'nested'">嵌套 Map</button>
    </div>

    <div v-if="activeTab === 'basic'">
      <h4>实时预览：颜色系统</h4>
      <div class="color-tabs" style="margin-bottom:12px;">
        <button v-for="key in colorKeys" :key="key" class="color-tab"
          :class="{ active: selectedColor === key }"
          :style="{ borderColor: colorMap[key as keyof typeof colorMap].main, color: selectedColor === key ? '#fff' : colorMap[key as keyof typeof colorMap].main, background: selectedColor === key ? colorMap[key as keyof typeof colorMap].main : 'transparent' }"
          @click="selectedColor = key">
          {{ key === 'primary' ? '主色' : key === 'secondary' ? '次色' : key === 'success' ? '成功' : key === 'warning' ? '警告' : '危险' }}
        </button>
      </div>
      <div class="color-showcase">
        <div class="shade-row">
          <div class="shade-box" :style="{ background: currentColor.light }">
            <span>Light</span>
            <small>{{ currentColor.light }}</small>
          </div>
          <div class="shade-box main" :style="{ background: currentColor.main }">
            <span>Main</span>
            <small>{{ currentColor.main }}</small>
          </div>
          <div class="shade-box" :style="{ background: currentColor.dark }">
            <span>Dark</span>
            <small>{{ currentColor.dark }}</small>
          </div>
        </div>
      </div>
      <pre class="mini-code" v-html="basicCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'functions'">
      <h4>Map 函数一览</h4>
      <pre class="mini-code" v-html="functionsCode"></pre>
      <div class="tips-box">
        <p><strong>常用函数速查：</strong></p>
        <ul>
          <li><code>map-get()</code> — 取值（最常用）</li>
          <li><code>map-has-key()</code> — 存在性检查</li>
          <li><code>map-keys()</code> / <code>map-values()</code> — 获取键/值列表</li>
          <li><code>map-merge()</code> — 合并（可用于覆盖默认值）</li>
          <li><code>map-remove()</code> — 删除键</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'nested'">
      <h4>嵌套 Map 演示</h4>
      <div class="nested-demo">
        <div v-for="(group, name) in colorMap" :key="name" class="color-group">
          <div class="group-title">{{ name === 'primary' ? '主色' : name === 'secondary' ? '次色' : name === 'success' ? '成功色' : name === 'warning' ? '警告色' : '危险色' }}</div>
          <div class="shades">
            <div v-for="(color, shade) in group" :key="shade" class="shade-dot" :style="{ background: color }" :title="shade + ': ' + color">
              <span v-if="shade === 'main'">M</span>
            </div>
          </div>
        </div>
      </div>
      <pre class="mini-code" v-html="nestedCode" style="margin-top:12px;"></pre>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>Map 的优势：</strong>相比简单变量列表，Map 提供键值语义，更适合组织设计令牌（Design Tokens）、主题系统和配置数据。配合自定义函数封装，可构建出类型安全、可维护的样式系统。</p>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.color-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.color-tab { padding: 6px 14px; border: 2px solid; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
.color-showcase { background: #fffaf1; border-radius: 8px; padding: 16px; }
.shade-row { display: flex; gap: 12px; }
.shade-box { flex: 1; padding: 20px; border-radius: 8px; text-align: center; transition: all 0.3s; }
.shade-box.main { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.shade-box span { font-size: 12px; font-weight: 600; color: #fff; display: block; }
.shade-box small { font-size: 10px; color: rgba(255,255,255,0.8); }
.nested-demo { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
.color-group { padding: 12px; background: #fffaf1; border-radius: 8px; }
.group-title { font-size: 12px; font-weight: 600; color: #8b4513; margin-bottom: 8px; }
.shades { display: flex; gap: 6px; }
.shade-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
</style>
