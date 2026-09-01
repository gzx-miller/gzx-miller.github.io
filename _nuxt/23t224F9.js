const n=`<script setup lang="ts">
import { ref } from 'vue'
const shape = ref('circle')
const shapes = [
  { id: 'circle', v: 'circle(50%)', label: '圆形' },
  { id: 'ellipse', v: 'ellipse(50% 40%)', label: '椭圆' },
  { id: 'polygon', v: 'polygon(50% 0%, 100% 100%, 0% 100%)', label: '三角形' },
  { id: 'inset', v: 'inset(10% 20% 10% 20%)', label: '内嵌矩形' },
  { id: 'path', v: 'path("M0,0 L100,0 L50,100 Z")', label: '路径' },
]
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">形状与裁剪</h3>
    <p class="demo-desc">用课程封面图理解 clip-path 裁剪与 mask 遮罩的差异与用法。</p>
    <div class="controls">
      <button v-for="s in shapes" :key="s.id"
        :class="['btn', { active: shape===s.id }]"
        @click="shape = s.id">{{ s.label }}</button>
      <button :class="['btn', { active: shape==='mask' }]" @click="shape='mask'">mask 遮罩</button>
    </div>

    <div class="clip-demo">
      <div v-if="shape!=='mask'" class="clip-box" :style="{ clipPath: shapes.find(s=>s.id===shape)?.v }">
        裁剪区域
      </div>
      <div v-else class="clip-box masked">
        mask 遮罩
      </div>
    </div>

    <pre class="code-block" v-if="shape!=='mask'">{{ shapes.find(s=>s.id===shape)?.v }}</pre>
    <pre class="code-block" v-else>/* mask：用渐变或图片作为遮罩 */
mask: linear-gradient(black 0%, transparent 100%);
-webkit-mask: ...;</pre>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>作用</span><span>是否保留布局空间</span></div>
      <div class="prop-row"><span>clip-path</span><span>裁剪可见区域</span><span>✅ 是（不可点击区域被裁剪）</span></div>
      <div class="prop-row"><span>mask</span><span>按透明度遮罩</span><span>✅ 是</span></div>
      <div class="prop-row"><span>border-radius</span><span>圆角裁剪</span><span>✅ 是</span></div>
      <div class="prop-row"><span>overflow: hidden</span><span>矩形溢出裁剪</span><span>✅ 是</span></div>
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
.clip-demo { display: flex; justify-content: center; padding: 16px; margin-bottom: 12px; }
.clip-box { width: 160px; height: 160px; background: linear-gradient(135deg, var(--primary), #ffd43b); color: #fff; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: clip-path 0.3s; }
.clip-box.masked { mask: linear-gradient(black 0%, transparent 100%); -webkit-mask: linear-gradient(black 0%, transparent 100%); }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-bottom: 16px; overflow-x: auto; white-space: pre; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 11px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
