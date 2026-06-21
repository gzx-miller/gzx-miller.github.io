<script setup lang="ts">
import { ref } from 'vue'
const theme = ref<'warm' | 'cool'>('warm')
const spacing = ref(16)
const themes = {
  warm: { '--primary': '#e8590c', '--primary-light': '#fff4e6', '--border': '#ffd8a8' },
  cool: { '--primary': '#1971c2', '--primary-light': '#e7f5ff', '--border': '#a5d8ff' },
}
</script>

<template>
  <div class="demo-container" :style="themes[theme]">
    <h3 class="demo-title">CSS 变量（自定义属性）</h3>
    <p class="demo-desc">用主题切换理解自定义属性的声明、读取与动态更新。</p>
    <div class="controls">
      <button :class="['btn', { active: theme === 'warm' }]" @click="theme='warm'">暖色</button>
      <button :class="['btn', { active: theme === 'cool' }]" @click="theme='cool'">冷色</button>
      <label>间距：<input type="range" min="4" max="32" v-model.number="spacing" />{{ spacing }}px</label>
    </div>
    <div class="var-demo" :style="{ '--spacing': spacing + 'px' }">
      <div class="var-card">
        <h4>卡片标题</h4>
        <p>使用 <code>var(--primary)</code> 和 <code>var(--spacing)</code> 控制外观。</p>
        <button class="var-btn">操作按钮</button>
      </div>
    </div>
    <div class="prop-table">
      <div class="prop-row header"><span>特性</span><span>说明</span></div>
      <div class="prop-row"><span>声明</span><span>--name: value</span></div>
      <div class="prop-row"><span>读取</span><span>var(--name, fallback)</span></div>
      <div class="prop-row"><span>JS 访问</span><span>element.style.setProperty('--name', val)</span></div>
      <div class="prop-row"><span>继承</span><span>可继承（不同于普通属性）</span></div>
    </div>
  </div>
</template>

<style scoped>
.demo-container { font-family: system-ui, sans-serif; --primary: #e8590c; --primary-light: #fff4e6; --border: #ffd8a8; }
.demo-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; color: var(--primary); }
.demo-desc { font-size: 13px; color: #868e96; margin-bottom: 16px; }
.controls { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; font-size: 12px; }
.btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; background: #fff; cursor: pointer; font-size: 12px; }
.btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.controls input[type="range"] { width: 80px; }
.var-demo { border: 1px solid var(--border); border-radius: 8px; padding: var(--spacing, 16px); background: var(--primary-light); margin-bottom: 16px; }
.var-card { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.var-card h4 { color: var(--primary); margin: 0 0 8px; }
.var-card code { background: var(--primary-light); padding: 1px 4px; border-radius: 3px; font-size: 11px; }
.var-btn { background: var(--primary); color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; }
.prop-table { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-size: 12px; }
.prop-row { display: grid; grid-template-columns: 1fr 2fr; border-bottom: 1px solid var(--border); }
.prop-row:last-child { border-bottom: none; }
.prop-row > span { padding: 5px 10px; }
.prop-row.header { background: var(--primary); color: #fff; font-weight: 600; }
</style>
