<script setup lang="ts">
import { computed, ref } from 'vue'

const lightness = ref(50)
const color = computed(() => `hsl(22 65% ${lightness.value}%)`)

const colorFunctions = [
  { name: 'lighten($color, 10%)', desc: '让颜色变亮' },
  { name: 'darken($color, 10%)', desc: '让颜色变暗' },
  { name: 'saturate($color, 20%)', desc: '增加饱和度' },
  { name: 'desaturate($color, 20%)', desc: '降低饱和度' },
  { name: 'adjust-hue($color, 30deg)', desc: '调整色相' },
  { name: 'complement($color)', desc: '获取互补色' },
  { name: 'invert($color)', desc: '获取反转色' },
  { name: 'grayscale($color)', desc: '灰度化' },
  { name: 'fade-in($color, 0.3)', desc: '增加透明度' },
  { name: 'fade-out($color, 0.2)', desc: '降低透明度' },
]

const activeFunc = ref(0)
const computedColor = computed(() => {
  const l = lightness.value
  return `hsl(22 ${60 + Math.abs(50 - l) * 0.5}% ${l}%)`
})
</script>

<template>
  <div class="demo-card">
    <h4>🍂 Sass Color 模块</h4>
    <p>Sass 提供了强大的颜色处理函数，支持颜色通道的读取、调整、缩放与混合。</p>

    <label class="lightness-control">
      <span>亮度调节</span>
      <input v-model.number="lightness" type="range" min="20" max="85" />
      <strong>{{ lightness }}%</strong>
    </label>

    <div class="color-preview" :style="{ background: computedColor }">
      <span>当前颜色预览</span>
      <code>{{ computedColor }}</code>
    </div>

    <div class="func-tabs">
      <button
        v-for="(fn, i) in colorFunctions"
        :key="i"
        :class="{ active: activeFunc === i }"
        @click="activeFunc = i"
      >
        {{ fn.name.split('(')[0] }}
      </button>
    </div>

    <div class="func-result">
      <h5>{{ colorFunctions[activeFunc].name }}</h5>
      <p>{{ colorFunctions[activeFunc].desc }}</p>
      <pre class="mini-code">// 示例
$color: #e85d04;
{{ colorFunctions[activeFunc].name }};</pre>
    </div>

    <div class="tips-box">
      <p><strong>注意：</strong>自动生成配色后仍需实际验证对比度，不应假设数学变化等于可访问性保证。</p>
    </div>
  </div>
</template>

<style scoped>
.lightness-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}
.lightness-control input {
  flex: 1;
}
.color-preview {
  margin: 16px 0;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.color-preview span {
  color: #fff;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.color-preview code {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #fff;
}
.func-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0;
}
.func-tabs button {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  font-size: 12px;
  cursor: pointer;
}
.func-tabs button.active {
  background: linear-gradient(135deg, var(--leaf-red), var(--leaf-orange));
  color: #fff;
  border-color: transparent;
}
.func-result {
  background: rgba(246, 193, 90, 0.1);
  border: 1px solid rgba(246, 193, 90, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}
.func-result h5 {
  margin: 0 0 8px;
  color: var(--accent);
  font-family: ui-monospace, monospace;
  font-size: 14px;
}
.func-result p {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 13px;
}
</style>
