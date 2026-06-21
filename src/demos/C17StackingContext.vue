<script setup lang="ts">
import { ref } from 'vue'
const active = ref('default')
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">层叠上下文</h3>
    <p class="demo-desc">理解 z-index 失效的原因：层叠上下文的创建条件与层级隔离。</p>
    <div class="controls">
      <button :class="['btn', { active: active === 'default' }]" @click="active='default'">默认（z-index 有效）</button>
      <button :class="['btn', { active: active === 'opacity' }]" @click="active='opacity'">opacity &lt; 1 创建上下文</button>
      <button :class="['btn', { active: active === 'transform' }]" @click="active='transform'">transform 创建上下文</button>
    </div>

    <div class="stacking-demo" :class="'mode-' + active">
      <div class="box box-a">A: z-index: 999</div>
      <div class="box box-b">B: z-index: 1<br/><small>（父元素 opacity: 0.9）</small></div>
      <div class="box box-c">C: z-index: 2</div>
    </div>

    <div class="note">
      ⚠️ <strong>关键规律</strong>：子元素的 z-index 只在当前层叠上下文内比较。当父元素创建了新上下文，子元素再高的 z-index 也无法覆盖上下文外的元素。
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>创建层叠上下文的属性</span><span>说明</span></div>
      <div class="prop-row"><span>z-index ≠ auto + position</span><span>最经典的方式</span></div>
      <div class="prop-row"><span>opacity &lt; 1</span><span>半透明即创建</span></div>
      <div class="prop-row"><span>transform ≠ none</span><span>常见陷阱</span></div>
      <div class="prop-row"><span>filter ≠ none</span><span>滤镜也会创建</span></div>
      <div class="prop-row"><span>isolation: isolate</span><span>专门创建上下文（不影响视觉）</span></div>
      <div class="prop-row"><span>flex/grid 子项 + z-index</span><span>直接子元素也会创建</span></div>
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

.stacking-demo { position: relative; height: 200px; border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: var(--primary-light); }
.box { position: absolute; width: 140px; height: 80px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #fff; }
.box-a { background: #c2255c; top: 20px; left: 20px; z-index: 999; }
.box-b { background: var(--primary); top: 50px; left: 80px; z-index: 1; }
.box-c { background: #1971c2; top: 90px; left: 40px; z-index: 2; }
.mode-opacity .box-b { opacity: 0.9; }  /* 创建新层叠上下文，内部 z-index 与外界隔离 */
.mode-transform .box-b { transform: translateZ(0); } /* 同样创建新上下文 */
.note { background: #fff3bf; border: 1px solid #ffd43b; border-radius: 6px; padding: 10px 12px; font-size: 12px; line-height: 1.6; margin-bottom: 16px; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
