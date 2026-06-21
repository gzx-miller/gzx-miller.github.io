<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CSSProperties } from 'vue'
type ObjectFit = CSSProperties['objectFit']
const fitMode = ref<ObjectFit>('cover')
const showRatio = ref(false)
const imgStyle = computed<CSSProperties>(() => ({ objectFit: fitMode.value }))
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">aspect-ratio 与 object-fit</h3>
    <p class="demo-desc">控制媒体宽高比和填充方式，解决图片变形和布局偏移问题。</p>

    <div class="section">
      <h4>aspect-ratio：固定宽高比</h4>
      <button class="btn" @click="showRatio = !showRatio">{{ showRatio ? '隐藏' : '显示' }}比值演示</button>
      <div v-if="showRatio" class="ratio-demo">
        <div class="ratio-box" style="aspect-ratio: 16/9">16/9</div>
        <div class="ratio-box" style="aspect-ratio: 4/3">4/3</div>
        <div class="ratio-box" style="aspect-ratio: 1/1">1/1</div>
        <div class="ratio-box" style="aspect-ratio: 3/2">3/2</div>
      </div>
    </div>

    <div class="section">
      <h4>object-fit：图片填充方式</h4>
      <div class="controls">
        <button v-for="m in ['fill','contain','cover','none','scale-down']" :key="m"
          :class="['btn', { active: fitMode === m }]" @click="fitMode = m">{{ m }}</button>
      </div>
      <div class="img-demo">
        <div class="img-frame">
          <img class="img-demo-img" :style="imgStyle" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23099268'/%3E%3C/svg%3E" alt="demo" />
        </div>
        <p style="text-align:center; font-size:12px; color:#868e96;">object-fit: {{ fitMode }}</p>
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>属性</span><span>说明</span></div>
      <div class="prop-row"><span>aspect-ratio: 16/9</span><span>宽度决定高度，保持 16:9</span></div>
      <div class="prop-row"><span>aspect-ratio: auto</span><span>由内容自然决定（默认）</span></div>
      <div class="prop-row"><span>object-fit: cover</span><span>填满容器，超出部分裁剪（最常用）</span></div>
      <div class="prop-row"><span>object-fit: contain</span><span>完整显示，可能有留白</span></div>
      <div class="prop-row"><span>object-fit: fill</span><span>拉伸填满（可能变形）</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #099268; --primary-light: #ebfbee; --border: #63e6be; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.section { margin-bottom: 20px; }
.section h4 { font-size: 14px; margin-bottom: 8px; color: var(--primary); }
.controls { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.ratio-demo { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; }
.ratio-box {
  width: 120px;
  background: var(--primary);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.img-demo { margin-top: 12px; }
.img-frame {
  width: 100%;
  max-width: 300px;
  height: 180px;
  border: 2px dashed var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto;
}
.img-demo-img {
  width: 100%;
  height: 100%;
  display: block;
}

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; margin-top: 16px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
