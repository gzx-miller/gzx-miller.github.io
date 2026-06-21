<script setup lang="ts">
import { ref } from 'vue'
const mode = ref('x-mandatory')
const colors = ['#ff8787', '#ffc078', '#ffd43b', '#69db7c', '#66d9e8', '#a29bfe']
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS Scroll Snap</h3>
    <p class="demo-desc">实现精准的滚动定位，适合轮播、图片画廊和分页滚动。</p>

    <div class="controls">
      <button :class="['btn', { active: mode === 'x-mandatory' }]" @click="mode='x-mandatory'">水平强制</button>
      <button :class="['btn', { active: mode === 'x-proximity' }]" @click="mode='x-proximity'">水平接近</button>
      <button :class="['btn', { active: mode === 'y-mandatory' }]" @click="mode='y-mandatory'">垂直强制</button>
    </div>

    <div :class="['scroll-demo', 'mode-' + mode]">
      <div v-for="i in 6" :key="i" class="snap-item" :style="{ background: colors[i % colors.length] }">
        {{ i }}
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>说明</span></div>
      <div class="prop-row"><span>scroll-snap-type</span><span>容器：定义滚动方向和对齐严格度</span></div>
      <div class="prop-row"><span>scroll-snap-align</span><span>子项：start / center / end 对齐点</span></div>
      <div class="prop-row"><span>scroll-snap-stop</span><span>是否允许跳过对齐点（always / normal）</span></div>
      <div class="prop-row"><span>scroll-padding</span><span>考虑固定导航栏的偏移</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #4263eb; --primary-light: #edf2ff; --border: #bac8ff; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.scroll-demo {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: var(--primary-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: auto;
  scroll-behavior: smooth;
}
.mode-x-mandatory { scroll-snap-type: x mandatory; }
.mode-x-proximity { scroll-snap-type: x proximity; }
.mode-y-mandatory { scroll-snap-type: y mandatory; flex-direction: column; height: 300px; }

.snap-item {
  flex-shrink: 0;
  width: 200px;
  height: 140px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  scroll-snap-align: center;
}
.mode-y-mandatory .snap-item { width: 100%; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; margin-top: 16px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
