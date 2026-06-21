<script setup lang="ts">
import { ref } from 'vue'
const active = ref('static')
const positions = ['static','relative','absolute','fixed','sticky']
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">定位机制</h3>
    <p class="demo-desc">理解 static / relative / absolute / fixed / sticky 的偏移基准与脱离文档流行为。</p>

    <div class="controls">
      <button v-for="p in positions" :key="p"
        :class="['btn', { active: active === p }]"
        @click="active = p">{{ p }}</button>
    </div>

    <div class="pos-viewport">
      <div class="pos-scroll-area">
        <div class="pos-reference">
          <span class="ref-label">相对定位参考框</span>
          <div :class="['pos-box', 'pos-' + active]">{{ active }}
            <span class="pos-note" v-if="active==='relative'">相对原位置偏移</span>
            <span class="pos-note" v-if="active==='absolute'">相对最近定位祖先</span>
            <span class="pos-note" v-if="active==='fixed'">相对视口</span>
            <span class="pos-note" v-if="active==='sticky'">滚动到阈值后固定</span>
          </div>
        </div>
        <div class="pos-spacer"></div>
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>值</span><span>脱离文档流</span><span>参考基准</span></div>
      <div class="prop-row"><span>static</span><span>❌</span><span>无（默认）</span></div>
      <div class="prop-row"><span>relative</span><span>❌</span><span>自身原位置</span></div>
      <div class="prop-row"><span>absolute</span><span>✅</span><span>最近定位祖先</span></div>
      <div class="prop-row"><span>fixed</span><span>✅</span><span>视口</span></div>
      <div class="prop-row"><span>sticky</span><span>❌（滚动时转 fixed）</span><span>滚动祖先 + 阈值</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

.pos-viewport { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
.pos-scroll-area { height: 220px; overflow-y: auto; padding: 16px; }
.pos-reference { position: relative; background: var(--primary-light); border: 2px dashed var(--border); border-radius: 8px; padding: 40px 16px 16px; min-height: 180px; }
.ref-label { position: absolute; top: 6px; left: 8px; font-size: 10px; color: var(--primary); background: #fff; padding: 1px 6px; border-radius: 3px; }
.pos-spacer { height: 400px; }

.pos-box { padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; color: #fff; background: var(--primary); transition: all 0.3s; }
.pos-note { display: block; font-size: 10px; font-weight: 400; margin-top: 4px; opacity: 0.9; }
.pos-static { position: static; }
.pos-relative { position: relative; top: -8px; left: 16px; }
.pos-absolute { position: absolute; top: 8px; right: 8px; }
.pos-fixed { position: fixed; bottom: 16px; right: 16px; z-index: 100; }
.pos-sticky { position: sticky; top: 0; z-index: 10; }

.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 8px; word-break: break-all; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
