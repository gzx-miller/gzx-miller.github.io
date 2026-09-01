const n=`<script setup lang="ts">
import { ref } from 'vue'

const model = ref<'content-box' | 'border-box'>('content-box')
const showCollapse = ref(false)
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">盒模型</h3>
    <p class="demo-desc">理解 content-box 与 border-box 的尺寸计算差异，以及外边距折叠现象。</p>

    <div class="controls">
      <button
        :class="['btn', { active: model === 'content-box' }]"
        @click="model = 'content-box'"
      >content-box</button>
      <button
        :class="['btn', { active: model === 'border-box' }]"
        @click="model = 'border-box'"
      >border-box</button>
      <button :class="['btn', { active: showCollapse }]" @click="showCollapse = !showCollapse">切换外边距折叠</button>
    </div>

    <div class="box-row">
      <div class="box-visual" :data-model="model">
        <div class="box-inner">
          <span class="label">width: 200px<br/>padding: 20px<br/>border: 4px</span>
        </div>
        <div class="box-size-label">总宽度 = {{ model === 'content-box' ? '200 + 20×2 + 4×2 = 248px' : '200px（content 被压缩）' }}</div>
      </div>

      <div class="calc-table">
        <div class="calc-row header">
          <span>区域</span><span>content-box</span><span>border-box</span>
        </div>
        <div class="calc-row">
          <span>content</span><span>200px</span><span>172px</span>
        </div>
        <div class="calc-row">
          <span>padding</span><span>20×2 = 40px</span><span>20×2 = 40px</span>
        </div>
        <div class="calc-row">
          <span>border</span><span>4×2 = 8px</span><span>4×2 = 8px</span>
        </div>
        <div class="calc-row total">
          <span>总宽</span><span>248px</span><span>200px</span>
        </div>
      </div>
    </div>

    <div v-if="showCollapse" class="collapse-demo">
      <h4>外边距折叠（Margin Collapse）</h4>
      <div class="collapse-box top">上盒子 margin-bottom: 30px</div>
      <div class="collapse-box bottom">下盒子 margin-top: 20px → 实际间距 = 30px（取较大值）</div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  font-family: system-ui, sans-serif;
  --primary: #e8590c;
  --primary-light: #fff4e6;
  --border: #ffd8a8;
  --text: #333;
}
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }

.controls { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.btn {
  padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px;
  background: #fff; cursor: pointer; font-size: 12px; transition: all 0.2s;
}
.btn:hover { background: var(--primary-light); }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.box-row { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 20px; }

.box-visual[data-model="content-box"] .box-inner {
  box-sizing: content-box;
  width: 200px; padding: 20px; border: 4px solid var(--primary);
  background: var(--primary-light);
}
.box-visual[data-model="border-box"] .box-inner {
  box-sizing: border-box;
  width: 200px; padding: 20px; border: 4px solid var(--primary);
  background: var(--primary-light);
}
.box-inner { transition: all 0.3s; text-align: center; }
.label { font-size: 12px; color: var(--text); line-height: 1.6; }
.box-size-label {
  margin-top: 8px; font-size: 12px; color: var(--primary); font-weight: 600;
  background: var(--primary-light); padding: 4px 8px; border-radius: 4px;
}

.calc-table {
  border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
  font-size: 13px; min-width: 260px;
}
.calc-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid var(--border);
}
.calc-row:last-child { border-bottom: none; }
.calc-row > span { padding: 6px 10px; }
.calc-row.header { background: var(--primary); color: #fff; font-weight: 600; }
.calc-row.total { background: var(--primary-light); font-weight: 700; }

.collapse-demo {
  border: 1px solid var(--border); border-radius: 8px;
  padding: 16px; background: var(--primary-light);
}
.collapse-demo h4 { margin: 0 0 12px; font-size: 14px; color: var(--primary); }
.collapse-box {
  background: #fff; border: 1px solid var(--border); border-radius: 6px;
  padding: 12px; font-size: 13px;
}
.collapse-box.top { margin-bottom: 30px; }
.collapse-box.bottom { margin-top: 20px; }
</style>
`;export{n as default};
