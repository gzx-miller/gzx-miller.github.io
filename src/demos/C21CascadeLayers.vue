<script setup lang="ts">
import { ref } from 'vue'
const active = ref('default')
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS 层叠层（@layer）</h3>
    <p class="demo-desc">用 @layer 显式控制样式优先级，解决第三方样式覆盖问题。</p>
    <div class="controls">
      <button :class="['btn', { active: active === 'default' }]" @click="active='default'">默认（无 @layer）</button>
      <button :class="['btn', { active: active === 'layers' }]" @click="active='layers'">使用 @layer</button>
    </div>

    <div class="demo-preview" :class="'mode-' + active">
      <style v-if="active === 'layers'">
        @layer reset, components, utilities;
        @layer reset {
          .layer-box { background: #e9ecef; border: 2px solid #adb5bd; }
        }
        @layer components {
          .layer-box { background: #d0bfff; border-color: #7048e8; }
        }
        @layer utilities {
          .layer-box { background: #ffc9c9; border-color: #e03131; }
        }
      </style>
      <style v-else>
        .layer-box-default.reset { background: #e9ecef; border: 2px solid #adb5bd; }
        .layer-box-default.components { background: #d0bfff; border-color: #7048e8; }
        .layer-box-default.utilities { background: #ffc9c9; border-color: #e03131; }
      </style>
      <div :class="active === 'layers' ? 'layer-box' : 'layer-box-default components'" style="padding: 16px; border-radius: 8px; transition: all 0.3s;">
        同一个元素的背景色：reset → components → utilities<br/>
        <small>@layer 让 utilities 层始终优先，无论 CSS 文件顺序</small>
      </div>
    </div>

    <div class="prop-table">
      <div class="prop-row header"><span>特性</span><span>说明</span></div>
      <div class="prop-row"><span>层声明</span><span>@layer reset, components, utilities</span></div>
      <div class="prop-row"><span>层优先级</span><span>靠后声明的层优先级更高</span></div>
      <div class="prop-row"><span>跨文件排序</span><span>@import url(...) layer(utilities)</span></div>
      <div class="prop-row"><span>未分层样式</span><span>优先级高于所有 @layer</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #7048e8; --primary-light: #f3f0ff; --border: #b197fc; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; margin-top: 16px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
