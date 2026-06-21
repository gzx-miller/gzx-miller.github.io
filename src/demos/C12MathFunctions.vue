<script setup lang="ts">
import { ref } from 'vue'
const method = ref<'calc' | 'min' | 'max' | 'clamp'>('clamp')
const val1 = ref(200)
const val2 = ref(600)
const val3 = ref(400)
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS 数学函数</h3>
    <p class="demo-desc">用课程卡片自适应宽度理解 calc / min / max / clamp 在实际布局中的用法。</p>
    <div class="controls">
      <button :class="['btn', { active: method==='calc' }]" @click="method='calc'">calc()</button>
      <button :class="['btn', { active: method==='min' }]" @click="method='min'">min()</button>
      <button :class="['btn', { active: method==='max' }]" @click="method='max'">max()</button>
      <button :class="['btn', { active: method==='clamp' }]" @click="method='clamp'">clamp()</button>
    </div>

    <div class="math-demo">
      <div class="math-box" :style="{
        width: method==='calc' ? `calc(100% - ${val1}px)` :
               method==='min' ? `min(${val1}px, 80%)` :
               method==='max' ? `max(${val1}px, 60%)` :
               `clamp(${val1}px, 50%, ${val2}px)`
      }">
        {{ method }}(...)
      </div>
    </div>

    <pre class="code-block">{{ method==='calc'
  ? `/* calc：四则运算 */\nwidth: calc(100% - ${val1}px);`
  : method==='min'
  ? `/* min：取最小值 */\nwidth: min(${val1}px, 80%);`
  : method==='max'
  ? `/* max：取最大值 */\nwidth: max(${val1}px, 60%);`
  : `/* clamp：最小值 | 理想值 | 最大值 */\nwidth: clamp(${val1}px, 50%, ${val2}px);` }}</pre>

    <div class="prop-table">
      <div class="prop-row header"><span>函数</span><span>含义</span><span>典型场景</span></div>
      <div class="prop-row"><span>calc()</span><span>混合单位计算</span><span>width: calc(100% - 32px)</span></div>
      <div class="prop-row"><span>min()</span><span>取最小值</span><span>max-width: min(600px, 90%)</span></div>
      <div class="prop-row"><span>max()</span><span>取最大值</span><span>font-size: max(14px, 1.2vw)</span></div>
      <div class="prop-row"><span>clamp()</span><span>区间限制</span><span>font-size: clamp(16px, 2vw, 24px)</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.math-demo { margin-bottom: 16px; background: var(--primary-light); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.math-box { background: var(--primary); color: #fff; border-radius: 6px; padding: 10px; font-size: 12px; font-weight: 600; text-align: center; transition: width 0.3s; min-width: 40px; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-bottom: 16px; overflow-x: auto; white-space: pre; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
