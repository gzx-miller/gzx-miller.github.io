<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'selector' | 'property' | 'url'>('selector')
const themeName = ref<'autumn' | 'forest' | 'sunset'>('autumn')
const propertyName = ref('background')

const themes = {
  autumn: { primary: '#e85d04', secondary: '#f4a261', bg: '#fff3df', text: '#8b4513' },
  forest: { primary: '#2d6a4f', secondary: '#74c69d', bg: '#e8f5e9', text: '#1b4332' },
  sunset: { primary: '#d62828', secondary: '#f77f00', bg: '#fff0e6', text: '#9d0208' }
}

const currentTheme = computed(() => themes[themeName.value])

const selectorCode = `<span style="color:#7c7c99">// 使用 #{} 插值语法生成动态选择器</span>
$themes: autumn, forest, sunset;

@each $theme in $themes {
  .theme-#{$theme} {
    --primary: #{map-get($theme-colors, $theme, primary)};
    --bg: #{map-get($theme-colors, $theme, bg)};
    background: var(--bg);
    color: var(--primary);
  }
}

<span style="color:#7c7c99">// 编译结果：</span>
.theme-autumn { --primary: #e85d04; --bg: #fff3df; ... }
.theme-forest { --primary: #2d6a4f; --bg: #e8f5e9; ... }
.theme-sunset { --primary: #d62828; --bg: #fff0e6; ... }`

const propertyCode = `<span style="color:#7c7c99">// 动态属性名插值</span>
@mixin position($prop, $value) {
  #{$prop}: $value;
}

.element {
  @include position(top, 20px);
  @include position(border-left, 3px solid #e85d04);
}

<span style="color:#7c7c99">// 编译结果：</span>
.element {
  top: 20px;
  border-left: 3px solid #e85d04;
}

<span style="color:#7c7c99">// 与变量结合的高级用法</span>
$properties: (
  margin: 16px,
  padding: 12px,
  border-radius: 8px
);

.card {
  @each $prop, $val in $properties {
    #{$prop}: $val;
  }
}`

const urlCode = `<span style="color:#7c7c99">// 路径与 URL 插值</span>
$asset-path: '../assets/images';
$cdn-url: 'https://cdn.example.com';

.logo {
  background-image: url('#{$asset-path}/logo.png');
}

.banner {
  background-image: url('#{$cdn-url}/banners/autumn.jpg');
}

<span style="color:#7c7c99">// 与 @for 结合生成精灵图</span>
@for $i from 1 through 5 {
  .icon-#{$i} {
    background-position: 0 (-$i * 32px);
  }
}

<span style="color:#7c7c99">// 编译结果：</span>
.icon-1 { background-position: 0 -32px; }
.icon-2 { background-position: 0 -64px; }
.icon-3 { background-position: 0 -96px; }
...`

const cardStyle = computed(() => ({
  '--primary': currentTheme.value.primary,
  '--secondary': currentTheme.value.secondary,
  '--bg': currentTheme.value.bg,
  '--text': currentTheme.value.text,
  background: currentTheme.value.bg,
  borderColor: currentTheme.value.primary,
  color: currentTheme.value.text
}))
</script>

<template>
  <div class="demo-card sass-demo">
    <h3>Sass 插值语法与动态选择器</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'selector' }" @click="activeTab = 'selector'">选择器插值</button>
      <button class="tab-btn" :class="{ active: activeTab === 'property' }" @click="activeTab = 'property'">属性名插值</button>
      <button class="tab-btn" :class="{ active: activeTab === 'url' }" @click="activeTab = 'url'">路径插值</button>
    </div>

    <div v-if="activeTab === 'selector'">
      <h4>实时预览：主题切换</h4>
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button v-for="(t, key) in themes" :key="key" class="theme-btn"
          :style="{ borderColor: t.primary, color: themeName === key ? '#fff' : t.primary, background: themeName === key ? t.primary : 'transparent' }"
          @click="themeName = key as any">
          {{ key === 'autumn' ? '秋日' : key === 'forest' ? '森林' : '日落' }}
        </button>
      </div>
      <div class="theme-card" :style="cardStyle">
        <h5 :style="{ color: currentTheme.primary }">{{ themeName === 'autumn' ? '秋日主题' : themeName === 'forest' ? '森林主题' : '日落主题' }}</h5>
        <p>这是通过 <code>#{$theme}</code> 插值动态生成的主题样式。</p>
      </div>
      <pre class="mini-code" v-html="selectorCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'property'">
      <h4>实时预览：动态属性</h4>
      <div style="display:flex;gap:8px;margin-bottom:12px;align-items:center;">
        <label>属性：</label>
        <select v-model="propertyName">
          <option value="background">background</option>
          <option value="border-left">border-left</option>
          <option value="border-radius">border-radius</option>
          <option value="padding">padding</option>
        </select>
      </div>
      <div class="prop-demo" :style="{ [propertyName]: propertyName.includes('border') ? '3px solid #e85d04' : propertyName === 'background' ? '#fff3df' : '20px' }">
        <p>属性名通过 <code>#{$prop}</code> 动态插入</p>
      </div>
      <pre class="mini-code" v-html="propertyCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'url'">
      <h4>代码示例</h4>
      <pre class="mini-code" v-html="urlCode"></pre>
      <div class="tips-box">
        <p><strong>插值语法 <code>#{} </code> 的常见用途：</strong></p>
        <ul>
          <li>动态生成选择器名称（主题、状态、尺寸变体）</li>
          <li>在属性名位置插入变量</li>
          <li>构建 URL 和文件路径</li>
          <li>在注释或字符串中嵌入变量值</li>
          <li>与 <code>@each</code> / <code>@for</code> 配合批量生成样式</li>
        </ul>
      </div>
    </div>

    <div class="tips-box" style="margin-top:12px;">
      <p><strong>注意事项：</strong>插值 <code>#{} </code> 在 Sass 中是编译期运算，变量值在编译时确定。不要与 CSS 变量（运行时）混淆。插值常用于构建设计系统的工具类、主题变体和精灵图。</p>
    </div>
  </div>
</template>

<style scoped>
.sass-demo label { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.sass-demo select { padding: 4px 8px; border: 1px solid #e0a06a; border-radius: 4px; background: #fff; font-size: 13px; }
.theme-btn { padding: 6px 16px; border: 2px solid; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.theme-btn:hover { opacity: 0.8; }
.theme-card { padding: 16px; border-left: 4px solid; border-radius: 8px; transition: all 0.3s; }
.theme-card h5 { margin: 0 0 8px 0; font-size: 16px; }
.theme-card p { margin: 0; font-size: 13px; }
.prop-demo { padding: 16px; background: #fffaf1; border-radius: 8px; min-height: 60px; display: flex; align-items: center; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5e6; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
ul { padding-left: 18px; font-size: 12px; margin: 6px 0; }
h4 { margin: 12px 0 8px 0; font-size: 14px; color: #8b4513; }
h5 { margin: 0; }
</style>
