<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'basic' | 'functions' | 'utility'>('basic')
const fontSizeIndex = ref(2)
const borderRadiusIndex = ref(2)

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']
const borderRadius = ['2px', '4px', '6px', '8px', '12px', '16px', '20px', '24px']

const sampleTextSizes = computed(() => fontSizes.slice(0, 6))
const sampleRadius = computed(() => borderRadius.slice(0, 6))

const basicCode = `<span style="color:#7c7c99">// List 基本定义 — 有序值序列</span>

<span style="color:#7c7c99">// 空格分隔</span>
$font-sizes: 12px 14px 16px 18px 20px 24px;

<span style="color:#7c7c99">// 逗号分隔</span>
$breakpoints: 480px, 768px, 1024px, 1280px;

<span style="color:#7c7c99">// 嵌套列表（二维）</span>
$font-stacks:
  "Inter" "Helvetica Neue" Arial sans-serif,
  "Georgia" "Times New Roman" serif;

<span style="color:#7c7c99">// 访问元素 — nth($list, $n)</span>
<span style="color:#8a8a3a">// 注意：Sass 索引从 1 开始！</span>
$base-size: nth($font-sizes, 3);  <span style="color:#8a8a3a">// 16px</span>
$sm-breakpoint: nth($breakpoints, 1);  <span style="color:#8a8a3a">// 480px</span>

<span style="color:#7c7c99">// 遍历 — 与 @each 配合</span>
@each $size in $font-sizes {
  .text-#{$size} { font-size: $size; }
}

<span style="color:#7c7c99">// 多值列表遍历</span>
$colors: primary #e85d04, secondary #8b4513, danger #dc2626;
@each $name, $color in $colors {
  .bg-#{$name} { background: $color; }
}`

const functionsCode = `<span style="color:#7c7c99">// List 常用函数</span>

<span style="color:#7c7c99">// 1. length($list) — 长度</span>
$count: length($font-sizes);  <span style="color:#8a8a3a">// 6</span>

<span style="color:#7c7c99">// 2. nth($list, $n) — 按索引取值（从1开始）</span>
$third: nth($font-sizes, 3);  <span style="color:#8a8a3a">// 16px</span>
$last: nth($font-sizes, -1);  <span style="color:#8a8a3a">// 24px（负数从末尾数）</span>

<span style="color:#7c7c99">// 3. set-nth($list, $n, $value) — 设置第N个值</span>
$new-sizes: set-nth($font-sizes, 3, 15px);

<span style="color:#7c7c99">// 4. join($list1, $list2, $separator) — 合并</span>
$more-sizes: 28px 32px;
$all-sizes: join($font-sizes, $more-sizes);
$comma-list: join(480px 768px, 1024px 1280px, comma);

<span style="color:#7c7c99">// 5. append($list, $val, $sep) — 追加元素</span>
$updated: append($font-sizes, 36px);

<span style="color:#7c7c99">// 6. index($list, $value) — 查找索引</span>
$idx: index($font-sizes, 16px);  <span style="color:#8a8a3a">// 3</span>

<span style="color:#7c7c99">// 7. zip($lists...) — 压缩多列表</span>
$names: primary secondary danger;
$colors: #e85d04 #8b4513 #dc2626;
$pairs: zip($names, $colors);
<span style="color:#8a8a3a">// (primary #e85d04, secondary #8b4513, danger #dc2626)</span>

<span style="color:#7c7c99">// 8. list-separator($list) — 获取分隔符</span>
$sep: list-separator($breakpoints);  <span style="color:#8a8a3a">// comma</span>`

const utilityCode = `<span style="color:#7c7c99">// 实战：构建间距工具类系统</span>
$spacing-scale: 0 4px 8px 12px 16px 24px 32px 48px 64px;

<span style="color:#7c7c99">// 生成 margin/padding 工具类</span>
@for $i from 1 through length($spacing-scale) {
  $val: nth($spacing-scale, $i);
  
  .m-#{$i - 1} { margin: $val; }
  .mt-#{$i - 1} { margin-top: $val; }
  .mb-#{$i - 1} { margin-bottom: $val; }
  .ml-#{$i - 1} { margin-left: $val; }
  .mr-#{$i - 1} { margin-right: $val; }
  
  .p-#{$i - 1} { padding: $val; }
  .pt-#{$i - 1} { padding-top: $val; }
  .pb-#{$i - 1} { padding-bottom: $val; }
}

<span style="color:#7c7c99">// 实战：断点系统</span>
$breakpoints: (
  xs: 0,
  sm: 480px,
  md: 768px,
  lg: 1024px,
  xl: 1280px
);

@mixin respond-up($size) {
  $width: map-get($breakpoints, $size);
  @if $width > 0 {
    @media (min-width: $width) { @content; }
  } @else {
    @content;
  }
}

<span style="color:#7c7c99">// 实战：阴影层级</span>
$shadows: (
  sm: 0 1px 2px rgba(0,0,0,.05),
  md: 0 4px 6px rgba(0,0,0,.08),
  lg: 0 10px 15px rgba(0,0,0,.1),
  xl: 0 20px 25px rgba(0,0,0,.15)
);

@each $name, $shadow in $shadows {
  .shadow-#{$name} { box-shadow: $shadow; }
}`
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>List 数据结构与函数</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'basic' }" @click="activeTab = 'basic'">基础用法</button>
      <button class="tab-btn" :class="{ active: activeTab === 'functions' }" @click="activeTab = 'functions'">List 函数</button>
      <button class="tab-btn" :class="{ active: activeTab === 'utility' }" @click="activeTab = 'utility'">实战应用</button>
    </div>

    <div v-if="activeTab === 'basic'">
      <h4>实时预览：字号序列</h4>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <label>字号级别：</label>
        <input v-model.number="fontSizeIndex" type="range" min="0" max="7" style="flex:1;" />
        <span class="level-tag">{{ fontSizes[fontSizeIndex] }}</span>
      </div>
      <div class="text-preview" :style="{ fontSize: fontSizes[fontSizeIndex] }">
        秋日森林的阳光透过树叶洒下斑驳光影
      </div>
      <div class="size-row" style="margin-top:12px;">
        <div v-for="(size, i) in sampleTextSizes" :key="i" class="size-item"
          :class="{ active: fontSizeIndex === i }"
          :style="{ fontSize: size }"
          @click="fontSizeIndex = i">
          {{ i }}
        </div>
      </div>
      <pre class="mini-code" v-html="basicCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'functions'">
      <h4>实时预览：圆角序列</h4>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <label>圆角级别：</label>
        <input v-model.number="borderRadiusIndex" type="range" min="0" max="7" style="flex:1;" />
        <span class="level-tag">{{ borderRadius[borderRadiusIndex] }}</span>
      </div>
      <div class="radius-preview" :style="{ borderRadius: borderRadius[borderRadiusIndex] }">
        <span>圆角预览</span>
        <small>border-radius: {{ borderRadius[borderRadiusIndex] }}</small>
      </div>
      <pre class="mini-code" v-html="functionsCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'utility'">
      <h4>实战：工具类系统</h4>
      <pre class="mini-code" v-html="utilityCode"></pre>
      <div class="tips-box">
        <p><strong>List vs Map 选择：</strong></p>
        <ul>
          <li>有序序列、需要按索引访问 → <strong>List</strong></li>
          <li>键值对、按名称查找 → <strong>Map</strong></li>
          <li>简单值列表（字号、间距、圆角）→ List 更简洁</li>
          <li>命名配置（颜色、断点、阴影）→ Map 更清晰</li>
        </ul>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>注意事项：</strong>Sass List 索引从 <strong>1</strong> 开始（不是 0！），这是常见陷阱。List 是不可变的，所有操作函数返回新列表。可以用空格或逗号作为分隔符，用 <code>list-separator()</code> 检测。</p>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.level-tag { padding: 2px 10px; background: #fff3df; border-radius: 4px; font-size: 12px; color: #8b4513; font-weight: 600; }
.text-preview { padding: 16px; background: #fffaf1; border-radius: 8px; color: #8b4513; transition: font-size 0.2s; }
.size-row { display: flex; gap: 6px; align-items: flex-end; }
.size-item { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e0a06a; border-radius: 6px; cursor: pointer; color: #8b4513; transition: all 0.2s; }
.size-item.active { background: #e85d04; color: #fff; border-color: #e85d04; }
.radius-preview { padding: 24px; background: linear-gradient(135deg, #fff3df, #f4a261); text-align: center; transition: border-radius 0.3s; }
.radius-preview span { font-size: 14px; font-weight: 600; color: #fff; display: block; }
.radius-preview small { font-size: 11px; color: rgba(255,255,255,0.85); }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
input[type="range"] { accent-color: #e85d04; }
</style>
