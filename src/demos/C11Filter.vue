<script setup lang="ts">
import { ref } from 'vue'
const filter = ref('none')
const filters = [
  { id: 'none', label: '无', v: 'none' },
  { id: 'blur', label: 'blur(3px)', v: 'blur(3px)' },
  { id: 'grayscale', label: 'grayscale(80%)', v: 'grayscale(80%)' },
  { id: 'sepia', label: 'sepia(60%)', v: 'sepia(60%)' },
  { id: 'brightness', label: 'brightness(1.4)', v: 'brightness(1.4)' },
  { id: 'contrast', label: 'contrast(1.5)', v: 'contrast(1.5)' },
  { id: 'hue-rotate', label: 'hue-rotate(90deg)', v: 'hue-rotate(90deg)' },
  { id: 'drop-shadow', label: 'drop-shadow', v: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.4))' },
]
const blend = ref<'normal' | 'multiply' | 'screen' | 'overlay' | 'difference'>('normal')
const blends = ['normal','multiply','screen','overlay','difference'] as const
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">滤镜与混合模式</h3>
    <p class="demo-desc">用课程封面图理解 filter 视觉效果与 mix-blend-mode 色彩混合。</p>
    <div class="controls">
      <label>filter：
        <select v-model="filter"><option v-for="f in filters" :key="f.id" :value="f.id">{{ f.label }}</option></select>
      </label>
      <label>mix-blend-mode：
        <select v-model="blend"><option v-for="b in blends" :key="b" :value="b">{{ b }}</option></select>
      </label>
    </div>

    <div class="demo-row">
      <div class="img-box">
        <img :style="{ filter: filters.find(f=>f.id===filter)?.v }" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect fill='%23e8590c' width='200' height='120'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18'%3E封面图%3C/text%3E%3C/svg%3E" />
        <span class="img-label">filter: {{ filters.find(f=>f.id===filter)?.label }}</span>
      </div>
      <div class="blend-box">
        <div class="blend-bg"></div>
        <div class="blend-text" :style="{ mixBlendMode: blend }">课程标题</div>
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>常用值</span></div>
      <div class="prop-row"><span>filter</span><span>blur / grayscale / brightness 等</span></div>
      <div class="prop-row"><span>backdrop-filter</span><span>同 filter，但只作用于背景</span></div>
      <div class="prop-row"><span>mix-blend-mode</span><span>multiply / screen / overlay 等</span></div>
      <div class="prop-row"><span>background-blend-mode</span><span>多背景图的混合模式</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; font-size: 12px; margin-bottom: 16px; }
.controls select { padding: 2px 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px; }
.demo-row { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.img-box { text-align: center; }
.img-box img { border-radius: 8px; display: block; }
.img-label { display: block; font-size: 11px; color: #868e96; margin-top: 4px; }
.blend-box { position: relative; width: 200px; height: 120px; border-radius: 8px; overflow: hidden; }
.blend-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #e8590c, #1971c2); }
.blend-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: white; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
