<script setup lang="ts">
import { ref } from 'vue'
const active = ref('demo')
</script>

<template>
  <div class="demo-container">
    <h3 class="demo-title">CSS :has() 选择器</h3>
    <p class="demo-desc">用 :has() 实现"父元素选择器"效果，根据子元素状态样式化容器。</p>

    <div class="cards">
      <div class="card" :class="{ highlighted: active === 'has' }">
        <span class="badge error">错误</span>
        <p>表单 A：有错误提示</p>
      </div>
      <div class="card">
        <span class="badge success">成功</span>
        <p>表单 B：无错误</p>
      </div>
      <div class="card" :class="{ highlighted: active === 'has' }">
        <span class="badge error">错误</span>
        <p>表单 C：有错误提示</p>
      </div>
    </div>

    <div class="note" v-if="active === 'has'">
      ✅ <strong>:has() 生效</strong>：含有 .error 徽章的卡片被高亮了！
    </div>

    <style v-if="active === 'has'">
      .cards:has(.error) .card {
        opacity: 0.4;
      }
      .cards:has(.error) .card:has(.error) {
        opacity: 1;
        border-color: #e03131;
        background: #fff5f5;
      }
    </style>

    <div class="controls" style="margin-top: 16px;">
      <button :class="['btn', { active: active === 'has' }]" @click="active = 'has'">启用 :has() 高亮</button>
      <button :class="['btn', { active: active === 'demo' }]" @click="active = 'demo'">重置</button>
    </div>

    <div class="prop-table" style="margin-top: 16px;">
      <div class="prop-row header"><span>选择器</span><span>含义</span></div>
      <div class="prop-row"><span>div:has(p)</span><span>含有 &lt;p&gt; 的 div</span></div>
      <div class="prop-row"><span>form:has(.error)</span><span>含有 .error 的表单</span></div>
      <div class="prop-row"><span>article:not(:has(img))</span><span>不含 img 的文章</span></div>
      <div class="prop-row"><span>h2:has(+ p)</span><span>后面紧跟 p 的 h2</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.cards { display: flex; gap: 12px; flex-wrap: wrap; }
.card { border: 2px solid var(--border); border-radius: 8px; padding: 12px 16px; background: var(--primary-light); transition: all 0.3s; flex: 1; min-width: 150px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 8px; }
.badge.error { background: #ffe3e3; color: #c92a2a; }
.badge.success { background: #d3f9d8; color: #2b8a3e; }
.controls { display: flex; gap: 6px; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.note { background: #fff3bf; border: 1px solid #ffd43b; border-radius: 6px; padding: 10px 12px; font-size: 12px; line-height: 1.6; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
