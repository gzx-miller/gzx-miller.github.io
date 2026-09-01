const n=`<script setup lang="ts">
import { ref } from 'vue'
const active = ref('bfc')
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">格式化上下文</h3>
    <p class="demo-desc">理解 BFC（块格式化上下文）与 IFC（行内格式化上下文）的创建方式与布局影响。</p>
    <div class="controls">
      <button :class="['btn', { active: active === 'bfc' }]" @click="active='bfc'">BFC 演示</button>
      <button :class="['btn', { active: active === 'ifc' }]" @click="active='ifc'">IFC 演示</button>
      <button :class="['btn', { active: active === 'collapse' }]" @click="active='collapse'">外边距折叠</button>
    </div>

    <div v-if="active === 'bfc'" class="bfc-demo">
      <div class="bfc-box bfc-trigger">
        <p>这个 div 通过 <code>overflow: hidden</code> 创建了 BFC。</p>
        <p>内部浮动元素会被 BFC 包裹（清除浮动）。</p>
      </div>
      <div class="bfc-box no-bfc">
        <p>这个 div 没有创建 BFC，浮动元素会溢出。</p>
      </div>
    </div>

    <div v-if="active === 'ifc'" class="ifc-demo">
      <p class="ifc-text">这是一段行内格式化上下文示例，<span class="ifc-highlight">高亮文字</span>在 IFC 内排列，<strong>粗体</strong>也是行内元素，它们在同一行内按基线对齐。</p>
    </div>

    <div v-if="active === 'collapse'" class="collapse-demo">
      <div class="collapse-top">上盒 margin-bottom: 30px</div>
      <div class="collapse-bottom">下盒 margin-top: 20px → 实际间距 = 30px（取大值）</div>
      <p class="collapse-note">BFC 可以阻止外边距折叠：将其中一个盒子放入新 BFC 容器即可。</p>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>概念</span><span>创建方式</span><span>作用</span></div>
      <div class="prop-row"><span>BFC（块）</span><span>overflow≠visible / float / flex 容器等</span><span>包裹浮动、阻止外边距折叠</span></div>
      <div class="prop-row"><span>IFC（行内）</span><span>仅含行内级元素</span><span>行盒排列、基线对齐</span></div>
      <div class="prop-row"><span>FFC（弹性）</span><span>display: flex / inline-flex</span><span>Flex 布局上下文</span></div>
      <div class="prop-row"><span>GFC（网格）</span><span>display: grid / inline-grid</span><span>Grid 布局上下文</span></div>
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

.bfc-demo { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.bfc-box { border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 12px; line-height: 1.6; }
.bfc-trigger { overflow: hidden; background: var(--primary-light); }
.no-bfc { background: #f8f9fa; }
.bfc-box code { background: #ffd43b44; padding: 0 3px; border-radius: 3px; }

.ifc-demo { margin-bottom: 16px; }
.ifc-text { font-size: 14px; line-height: 1.8; }
.ifc-highlight { background: var(--primary); color: #fff; padding: 1px 4px; border-radius: 3px; }

.collapse-demo { margin-bottom: 16px; }
.collapse-top { background: var(--primary-light); border: 1px solid var(--primary); border-radius: 6px; padding: 10px; margin-bottom: 30px; font-size: 12px; }
.collapse-bottom { background: #e7f5ff; border: 1px solid #1971c2; border-radius: 6px; padding: 10px; margin-top: 20px; font-size: 12px; }
.collapse-note { font-size: 12px; color: #666; margin-top: 8px; background: #fff3bf; padding: 6px 10px; border-radius: 4px; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
