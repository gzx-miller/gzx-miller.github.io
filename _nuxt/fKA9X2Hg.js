const n=`<script setup lang="ts">
import { ref } from 'vue'
const unit = ref('vw')
const units = [
  { id: 'vw', label: 'vw（视口宽度）', desc: '1vw = 视口宽度的 1%' },
  { id: 'vh', label: 'vh（视口高度）', desc: '1vh = 视口高度的 1%' },
  { id: 'dvh', label: 'dvh（动态视口高度）', desc: '会随浏览器工具栏变化而调整' },
  { id: 'cqw', label: 'cqw（容器宽度）', desc: '1cqw = 容器宽度的 1%' },
  { id: 'rem', label: 'rem（根字号）', desc: '1rem = 根元素 font-size' },
  { id: 'ch', label: 'ch（字符宽）', desc: '1ch ≈ 数字 0 的宽度' },
]
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">视口与容器单位</h3>
    <p class="demo-desc">理解 vw / vh / dvh / cqw / rem / ch 的适用场景与差异。</p>
    <div class="controls">
      <button v-for="u in units" :key="u.id"
        :class="['btn', { active: unit===u.id }]"
        @click="unit = u.id">{{ u.label.split('（')[0] }}</button>
    </div>

    <div class="unit-demo">
      <div v-if="unit==='vw'" class="demo-box" style="width: 50vw; height: 60px;">width: 50vw</div>
      <div v-else-if="unit==='vh'" class="demo-box" style="height: 20vh; width: 100%;">height: 20vh</div>
      <div v-else-if="unit==='dvh'" class="demo-box" style="height: 30dvh; width: 100%;">height: 30dvh</div>
      <div v-else-if="unit==='cqw'" class="container-query-demo">
        <div class="inner" style="width: 50cqw;">width: 50cqw</div>
      </div>
      <div v-else-if="unit==='rem'" class="demo-box" style="font-size: 1.5rem; width: 100%;">font-size: 1.5rem</div>
      <div v-else class="demo-box" style="width: 20ch;">width: 20ch（约 20 个字符宽）</div>
    </div>

    <div class="unit-info">
      <strong>{{ units.find(u=>u.id===unit)?.label }}</strong>
      <span>{{ units.find(u=>u.id===unit)?.desc }}</span>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>单位</span><span>基准</span><span>典型用途</span></div>
      <div class="prop-row"><span>vw / vh</span><span>视口尺寸</span><span>全屏布局、标题字号</span></div>
      <div class="prop-row"><span>dvh / svh / lvh</span><span>动态/小/大视口</span><span>移动端全屏（避工具栏）</span></div>
      <div class="prop-row"><span>cqw / cqh</span><span>容器尺寸</span><span>容器查询内自适应</span></div>
      <div class="prop-row"><span>rem</span><span>根字号</span><span>可缩放的全局尺寸</span></div>
      <div class="prop-row"><span>ch</span><span>字符 0 宽度</span><span>输入框宽度（按字符数）</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.unit-demo { background: var(--primary-light); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 12px; min-height: 80px; }
.demo-box { background: var(--primary); color: #fff; border-radius: 6px; padding: 10px; font-size: 12px; font-weight: 600; text-align: center; transition: all 0.3s; }
.container-query-demo { container-type: inline-size; border: 1px dashed var(--primary); border-radius: 6px; padding: 8px; }
.inner { background: var(--primary); color: #fff; border-radius: 6px; padding: 8px; font-size: 12px; font-weight: 600; text-align: center; }
.unit-info { background: var(--primary-light); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; font-size: 12px; margin-bottom: 16px; display: flex; gap: 8px; align-items: baseline; }
.unit-info strong { color: var(--primary); white-space: nowrap; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
