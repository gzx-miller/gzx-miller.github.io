<script setup lang="ts">
import { computed, ref } from 'vue'

// 设计稿以 750 为基准；屏幕宽度恒等于 750rpx
const screenPx = ref(375)
const scale = computed(() => screenPx.value / 750)

const bars = [
  { label: '750rpx', width: 750, full: true },
  { label: '375rpx', width: 375, full: false },
  { label: '250rpx', width: 250, full: false },
]
</script>

<template>
  <div class="demo-card">
    <label class="slider">
      <span>模拟设备宽度</span>
      <input v-model.number="screenPx" type="range" min="280" max="480" />
      <span>{{ screenPx }}px</span>
    </label>

    <div class="board" :style="{ maxWidth: `${screenPx}px` }">
      <div
        v-for="b in bars"
        :key="b.label"
        class="bar"
        :class="{ full: b.full }"
        :style="{ width: `${b.width * scale}px` }"
      >
        {{ b.label }}
      </div>
    </div>

    <p class="hint">
      无论设备多宽，屏幕始终等于 750rpx；rpx 数值不变，实际像素随宽度等比缩放。
    </p>
  </div>
</template>

<style scoped>
.slider {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}
.slider input {
  width: auto;
}
.board {
  display: grid;
  gap: 8px;
  margin: 0 auto;
  border: 1px dashed var(--border);
  border-radius: 10px;
  padding: 14px;
  transition: max-width 0.2s ease;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border-radius: 6px;
  background: var(--leaf-gold);
  color: var(--text);
  font-size: 12px;
  white-space: nowrap;
  transition: width 0.2s ease;
}
.bar.full {
  background: var(--leaf-red);
  color: #fff;
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
</style>