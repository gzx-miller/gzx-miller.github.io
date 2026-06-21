<script setup lang="ts">
import { ref } from 'vue'
const effect = ref<'transition' | 'animation'>('transition')
const prop = ref('all')
const duration = ref(300)
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">过渡与动画</h3>
    <p class="demo-desc">用课程卡片的显隐与交互动效理解 transition 与 animation 的差异。</p>
    <div class="controls">
      <button :class="['btn', { active: effect==='transition' }]" @click="effect='transition'">transition</button>
      <button :class="['btn', { active: effect==='animation' }]" @click="effect='animation'">animation</button>
      <label v-if="effect==='transition'">属性：
        <select v-model="prop"><option value="all">all</option><option value="opacity">opacity</option><option value="transform">transform</option></select>
      </label>
      <label>时长：<input type="range" min="100" max="2000" step="100" v-model.number="duration" />{{ duration }}ms</label>
    </div>

    <div class="anim-area">
      <div v-if="effect==='transition'" class="box transition-box" :style="{ transition: `${prop} ${duration}ms ease` }">悬浮触发过渡</div>
      <div v-else class="box animation-box" :style="{ animation: `bounce ${duration}ms ease infinite alternate` }">循环动画</div>
    </div>

    <pre class="code-block">{{ effect === 'transition'
  ? `.box { transition: ${prop} ${duration}ms ease; }\n.box:hover { transform: scale(1.1); }`
  : `@keyframes bounce {\n  from { transform: translateY(0); }\n  to { transform: translateY(-12px); }\n}\n.box { animation: bounce ${duration}ms ease infinite alternate; }` }}</pre>

    <div class="prop-table">
      <div class="prop-row header"><span>特性</span><span>transition</span><span>animation</span></div>
      <div class="prop-row"><span>触发方式</span><span>状态变化（hover 等）</span><span>自动 / JS 控制</span></div>
      <div class="prop-row"><span>关键帧</span><span>❌</span><span>✅ @keyframes</span></div>
      <div class="prop-row"><span>循环</span><span>❌（单次）</span><span>✅ infinite</span></div>
      <div class="prop-row"><span>中途暂停</span><span>❌</span><span>✅ animation-play-state</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 12px; margin-bottom: 16px; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.controls select { padding: 2px 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px; }
.controls input[type="range"] { width: 80px; }
.anim-area { display: flex; justify-content: center; padding: 24px; margin-bottom: 12px; }
.box { width: 120px; height: 80px; background: var(--primary); color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; cursor: pointer; }
.transition-box:hover { transform: scale(1.1); opacity: 0.85; }
.animation-box { animation: bounce 600ms ease infinite alternate; }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); } }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-bottom: 16px; overflow-x: auto; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
