const n=`<script setup lang="ts">
import { ref } from 'vue'
const type = ref<'linear' | 'radial' | 'conic'>('linear')
const angle = ref(135)
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">渐变与背景</h3>
    <p class="demo-desc">用课程卡片背景理解 linear / radial / conic-gradient 的语法与效果。</p>
    <div class="controls">
      <button :class="['btn', { active: type==='linear' }]" @click="type='linear'">linear</button>
      <button :class="['btn', { active: type==='radial' }]" @click="type='radial'">radial</button>
      <button :class="['btn', { active: type==='conic' }]" @click="type='conic'">conic</button>
      <label v-if="type==='linear'">角度：<input type="range" min="0" max="360" v-model.number="angle" />{{ angle }}°</label>
    </div>

    <div class="gradient-showcase">
      <div v-if="type==='linear'" class="gradient-box" :style="{ background: \`linear-gradient(\${angle}deg, #e8590c, #ffd43b)\` }">
        linear-gradient({{ angle }}deg, #e8590c, #ffd43b)
      </div>
      <div v-else-if="type==='radial'" class="gradient-box" style="background: radial-gradient(circle, #e8590c, #ffd43b, #69db7c);">
        radial-gradient(circle, #e8590c, #ffd43b, #69db7c)
      </div>
      <div v-else class="gradient-box" style="background: conic-gradient(from 0deg, #e8590c, #ffd43b, #69db7c, #1971c2, #e8590c);">
        conic-gradient(from 0deg, #e8590c, #ffd43b, #69db7c, #1971c2, #e8590c)
      </div>
    </div>

    <div class="gradient-presets">
      <div class="preset" style="background: linear-gradient(135deg, #e8590c, #ffd43b);">暖色卡片</div>
      <div class="preset" style="background: radial-gradient(circle at top right, #1971c2, #5f3dc4);">冷色圆形</div>
      <div class="preset" style="background: conic-gradient(from 0deg, #e8590c, #ffd43b, #69db7c, #1971c2, #e8590c);">色轮</div>
      <div class="preset" style="background: linear-gradient(180deg, transparent, rgba(0,0,0,0.6));">遮罩渐变</div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>函数</span><span>语法要点</span></div>
      <div class="prop-row"><span>linear-gradient</span><span>方向（角度或 to 关键字）+ 色标</span></div>
      <div class="prop-row"><span>radial-gradient</span><span>形状（circle/ellipse）+ 位置 at + 色标</span></div>
      <div class="prop-row"><span>conic-gradient</span><span>起点 from + 中心 at + 色标</span></div>
      <div class="prop-row"><span>background-size</span><span>控制背景图尺寸，可设置百分比</span></div>
      <div class="prop-row"><span>多重背景</span><span>逗号分隔多个 gradient，先写的在上层</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 12px; margin-bottom: 16px; }
.btn { padding: 6px 12px; border: 1px solid #ffd8a8; border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.controls input[type="range"] { width: 100px; }
.gradient-showcase { margin-bottom: 16px; }
.gradient-box { height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
.gradient-presets { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
.preset { height: 80px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
.prop-table { border: 1px solid #ffd8a8; border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid #ffd8a8; }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
