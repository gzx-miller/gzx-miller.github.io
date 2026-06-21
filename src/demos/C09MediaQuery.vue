<script setup lang="ts">
import { ref } from 'vue'
const width = ref(1200)
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">媒体查询与响应式</h3>
    <p class="demo-desc">拖动滑块模拟不同视口宽度，观察课程卡片的响应式变化。</p>
    <div class="controls">
      <label>模拟视口宽度：<input type="range" min="320" max="1200" v-model.number="width" />{{ width }}px（{{ width < 640 ? '手机' : width < 1024 ? '平板' : '桌面' }}）</label>
    </div>

    <div class="viewport-simulator" :style="{ width: width + 'px' }">
      <div class="sim-header">页头</div>
      <div class="sim-body">
        <div class="sim-card" v-for="i in 4" :key="i">课程 {{ i }}</div>
      </div>
      <div class="sim-footer">页脚</div>
    </div>

    <pre class="code-block">/* 移动优先 */
.grid { grid-template-columns: 1fr; }

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}</pre>

    <div class="prop-table">
      <div class="prop-row header"><span>断点</span><span>典型值</span><span>用途</span></div>
      <div class="prop-row"><span>sm</span><span>640px</span><span>手机横屏</span></div>
      <div class="prop-row"><span>md</span><span>768px</span><span>平板</span></div>
      <div class="prop-row"><span>lg</span><span>1024px</span><span>小桌面</span></div>
      <div class="prop-row"><span>xl</span><span>1280px</span><span>大桌面</span></div>
      <div class="prop-row"><span>其他媒体特性</span><span>prefers-color-scheme 等</span><span>暗色模式、减少动画</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { margin-bottom: 16px; font-size: 12px; }
.controls input[type="range"] { width: 200px; vertical-align: middle; }
.viewport-simulator { border: 2px solid var(--border); border-radius: 8px; overflow: hidden; transition: width 0.3s; margin: 0 auto 16px; background: var(--primary-light); }
.sim-header, .sim-footer { background: var(--primary); color: #fff; padding: 8px 12px; font-size: 12px; font-weight: 600; }
.sim-body { display: grid; gap: 8px; padding: 12px; grid-template-columns: 1fr; }
/* 响应式：模拟 @media */
.viewport-simulator[data-w="640"] .sim-body,
.viewport-simulator[style*="640"], .viewport-simulator[style*="700"], .viewport-simulator[style*="800"],
.viewport-simulator[style*="900"], .viewport-simulator[style*="1000"] .sim-body { grid-template-columns: repeat(2, 1fr); }
.viewport-simulator[style*="1024"], .viewport-simulator[style*="1100"], .viewport-simulator[style*="1200"] .sim-body { grid-template-columns: repeat(4, 1fr); }
.sim-card { background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 12px; font-size: 12px; font-weight: 600; text-align: center; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-bottom: 16px; overflow-x: auto; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
