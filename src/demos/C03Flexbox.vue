<script setup lang="ts">
import { ref } from 'vue'

const direction = ref<'row' | 'column'>('row')
const justify = ref<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'>('flex-start')
const align = ref<'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'>('stretch')
const wrap = ref<'nowrap' | 'wrap' | 'wrap-reverse'>('nowrap')
const gap = ref(8)
const justifies = ['flex-start','center','flex-end','space-between','space-around','space-evenly'] as const
const aligns = ['flex-start','center','flex-end','stretch','baseline'] as const
const wraps = ['nowrap','wrap','wrap-reverse'] as const
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">Flexbox 布局</h3>
    <p class="demo-desc">用课程卡片列表理解 Flex 容器与项目的主轴、交叉轴对齐方式。</p>

    <div class="controls">
      <label>flex-direction:
        <select v-model="direction"><option value="row">row</option><option value="column">column</option></select>
      </label>
      <label>justify-content:
        <select v-model="justify"><option v-for="j in justifies" :key="j" :value="j">{{ j }}</option></select>
      </label>
      <label>align-items:
        <select v-model="align"><option v-for="a in aligns" :key="a" :value="a">{{ a }}</option></select>
      </label>
      <label>flex-wrap:
        <select v-model="wrap"><option v-for="w in wraps" :key="w" :value="w">{{ w }}</option></select>
      </label>
      <label>gap: <input type="range" min="0" max="24" v-model.number="gap" /> {{ gap }}px</label>
    </div>

    <div class="flex-container" :style="{
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap,
      gap: gap + 'px'
    }">
      <div class="flex-item" v-for="i in 6" :key="i" :style="{ order: i === 3 ? -1 : 0 }">
        <span class="item-num">{{ i === 3 ? 'order:-1' : i }}</span>
        课程 {{ i }}
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>作用</span></div>
      <div class="prop-row"><span>justify-content</span><span>主轴对齐</span></div>
      <div class="prop-row"><span>align-items</span><span>交叉轴对齐</span></div>
      <div class="prop-row"><span>flex-wrap</span><span>是否换行</span></div>
      <div class="prop-row"><span>gap</span><span>项目间距</span></div>
      <div class="prop-row"><span>order</span><span>排列顺序</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }

.controls { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; font-size: 12px; align-items: center; }
.controls label { display: flex; align-items: center; gap: 4px; }
.controls select, .controls input { padding: 2px 4px; border: 1px solid var(--border); border-radius: 4px; font-size: 12px; }

.flex-container {
  display: flex;
  background: var(--primary-light);
  border: 2px dashed var(--primary);
  border-radius: 8px;
  padding: 12px;
  min-height: 160px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.flex-item {
  background: var(--primary);
  color: #fff;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
  transition: all 0.3s;
}
.item-num { display: block; font-size: 10px; opacity: 0.8; margin-bottom: 2px; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 13px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
