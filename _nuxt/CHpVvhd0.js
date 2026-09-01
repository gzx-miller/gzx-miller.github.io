const n=`<script setup lang="ts">
import { ref } from 'vue'
const containerWidth = ref(400)
<\/script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">容器查询</h3>
    <p class="demo-desc">拖动滑块改变容器宽度，观察卡片内部布局如何根据容器尺寸（而非视口）响应变化。</p>
    <div class="controls">
      <label>容器宽度：<input type="range" min="200" max="800" v-model.number="containerWidth" />{{ containerWidth }}px</label>
    </div>

    <div class="cq-container" :style="{ width: containerWidth + 'px' }">
      <div class="cq-card">
        <img class="cq-img" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e8590c' width='80' height='80' rx='8'/%3E%3C/svg%3E" />
        <div class="cq-body">
          <h4 class="cq-title">Vue3 响应式原理</h4>
          <p class="cq-desc">深入理解 Proxy 与 Effect 追踪。</p>
          <span class="cq-tag">热门</span>
        </div>
      </div>
    </div>

    <pre class="code-block">/* 在父容器上声明容器类型 */
.cq-container { container-type: inline-size; }

/* 基于容器宽度（而非视口）响应 */
@container (min-width: 400px) {
  .cq-card { flex-direction: row; }
}</pre>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>作用</span></div>
      <div class="prop-row"><span>container-type</span><span>声明容器（inline-size / size）</span></div>
      <div class="prop-row"><span>container-name</span><span>为容器命名，区分多个容器</span></div>
      <div class="prop-row"><span>@container</span><span>容器查询条件（类似 @media）</span></div>
      <div class="prop-row"><span>与 @media 区别</span><span>@media 看视口；@container 看容器</span></div>
      <div class="prop-row"><span>单位 cqw / cqh</span><span>相对于容器宽/高的百分比单位</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { margin-bottom: 16px; font-size: 12px; }
.controls input[type="range"] { width: 180px; vertical-align: middle; }

.cq-container {
  container-type: inline-size;
  border: 2px dashed var(--border);
  border-radius: 8px;
  padding: 16px;
  transition: width 0.3s;
  margin-bottom: 16px;
}
.cq-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s;
}
@container (min-width: 400px) {
  .cq-card { flex-direction: row; }
}
.cq-img { width: 80px; height: 80px; border-radius: 8px; flex-shrink: 0; }
.cq-body { min-width: 0; }
.cq-title { font-size: 14px; font-weight: 600; margin: 0 0 4px; color: #333; }
.cq-desc { font-size: 12px; color: #868e96; margin: 0 0 6px; }
.cq-tag { background: var(--primary); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 4px; }

.code-block { background: #1e1e2e; color: #cdd6f4; padding: 10px 12px; border-radius: 6px; font-size: 11px; line-height: 1.5; margin-bottom: 16px; overflow-x: auto; white-space: pre; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
`;export{n as default};
