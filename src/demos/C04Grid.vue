<script setup lang="ts">
import { ref } from 'vue'

const columns = ref('repeat(3, 1fr)')
const rows = ref('auto')
const gap = ref(8)
const area = ref(false)

const gridAreas = {
  header: 'header',
  sidebar: 'sidebar',
  main: 'content',
  footer: 'footer',
}
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">Grid 布局</h3>
    <p class="demo-desc">用课程仪表盘理解二维网格的轨道定义、放置与对齐。</p>

    <div class="controls">
      <label>grid-template-columns:
        <select v-model="columns">
          <option value="repeat(3, 1fr)">3 等列</option>
          <option value="200px 1fr 200px">固定-弹性-固定</option>
          <option value="repeat(auto-fill, minmax(120px, 1fr))">自动填充</option>
        </select>
      </label>
      <label>gap: <input type="range" min="0" max="24" v-model.number="gap" />{{ gap }}px</label>
      <label><input type="checkbox" v-model="area" /> 启用 grid-area</label>
    </div>

    <div v-if="!area" class="grid-demo" :style="{ gridTemplateColumns: columns, gap: gap + 'px' }">
      <div class="cell" v-for="i in 9" :key="i">课程 {{ i }}</div>
    </div>

    <div v-else class="grid-demo" :style="{ gap: gap + 'px' }" style="grid-template-areas: 'header header header' 'sidebar content content' 'footer footer footer'; grid-template-columns: 160px 1fr 1fr; min-height: 200px;">
      <div class="cell area-header">页头 header</div>
      <div class="cell area-sidebar">侧栏 sidebar</div>
      <div class="cell area-main">主内容 content</div>
      <div class="cell area-footer">页脚 footer</div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>作用</span></div>
      <div class="prop-row"><span>grid-template-columns</span><span>定义列轨道</span></div>
      <div class="prop-row"><span>grid-template-rows</span><span>定义行轨道</span></div>
      <div class="prop-row"><span>grid-template-areas</span><span>区域命名布局</span></div>
      <div class="prop-row"><span>gap</span><span>轨道间距</span></div>
      <div class="prop-row"><span>grid-column / row</span><span>项目放置位置</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; font-size: 12px; align-items: center; }
.controls label { display: flex; align-items: center; gap: 4px; }
.controls select, .controls input[type="range"] { padding: 2px 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px; }

.grid-demo {
  display: grid;
  background: var(--primary-light);
  border: 2px dashed var(--primary);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  transition: all 0.3s;
}
.cell {
  background: var(--primary);
  color: #fff;
  border-radius: 6px;
  padding: 10px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s;
}
.area-header { grid-area: header; background: #c2255c; }
.area-sidebar { grid-area: sidebar; background: #1971c2; }
.area-main { grid-area: content; background: #2f9e44; }
.area-footer { grid-area: footer; background: #5f3dc4; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 13px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; word-break: break-all; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
