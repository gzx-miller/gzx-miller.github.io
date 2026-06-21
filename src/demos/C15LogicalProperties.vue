<script setup lang="ts">
import { ref } from 'vue'
const lang = ref<'ltr' | 'rtl'>('ltr')
</script>

<template>
  <div class="demo-container" :dir="lang">
    <h3 class="demo-title">逻辑属性</h3>
    <p class="demo-desc">用课程卡片的中英文/rtl 布局理解物理属性与逻辑属性的差异。</p>
    <div class="controls">
      <button :class="['btn', { active: lang === 'ltr' }]" @click="lang='ltr'">LTR（从左到右）</button>
      <button :class="['btn', { active: lang === 'rtl' }]" @click="lang='rtl'">RTL（从右到左）</button>
    </div>

    <div class="prop-compare">
      <div class="compare-col">
        <h4>物理属性（固定方向）</h4>
        <div class="demo-card physical">
          <div class="badge">热门</div>
          课程标题
          <p class="desc">使用 margin-left / text-align: left 等，在 RTL 下不会自动适配。</p>
        </div>
        <pre class="code-block">.badge { right: 8px; }
.desc { margin-left: 16px; }
.title { text-align: left; }</pre>
      </div>
      <div class="compare-col">
        <h4>逻辑属性（跟随书写方向）</h4>
        <div class="demo-card logical">
          <div class="badge">热门</div>
          课程标题
          <p class="desc">使用 inset-inline-end / margin-inline-start / text-align: start 等，自动适配 LTR/RTL。</p>
        </div>
        <pre class="code-block">.badge { inset-inline-end: 8px; }
.desc { margin-inline-start: 16px; }
.title { text-align: start; }</pre>
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>物理属性</span><span>逻辑属性</span><span>含义</span></div>
      <div class="prop-row"><span>margin-left</span><span>margin-inline-start</span><span>行首间距</span></div>
      <div class="prop-row"><span>margin-right</span><span>margin-inline-end</span><span>行尾间距</span></div>
      <div class="prop-row"><span>top / bottom</span><span>inset-block-start / end</span><span>块首/块尾</span></div>
      <div class="prop-row"><span>width</span><span>inline-size</span><span>行尺寸</span></div>
      <div class="prop-row"><span>height</span><span>block-size</span><span>块尺寸</span></div>
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

.prop-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.compare-col h4 { font-size: 13px; color: var(--primary); margin-bottom: 8px; }
.demo-card { position: relative; border: 1px solid var(--border); border-radius: 8px; padding: 16px; font-size: 12px; line-height: 1.6; }
.demo-card.physical { background: #fff5f5; }
.demo-card.logical { background: var(--primary-light); }
.badge { position: absolute; top: 8px; right: 8px; background: var(--primary); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 4px; }
[dir="rtl"] .demo-card.logical .badge { right: auto; left: 8px; }
.desc { margin-top: 8px; color: #666; }
.demo-card.physical .desc { margin-left: 16px; }
.demo-card.logical .desc { margin-inline-start: 16px; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 8px 12px; border-radius: 6px; font-size: 11px; line-height: 1.5; overflow-x: auto; white-space: pre; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
