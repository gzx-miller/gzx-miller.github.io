<script setup lang="ts">
import { computed, ref } from 'vue'

const compact = ref(false)
const utilities = computed(() => compact.value
  ? ['flex', 'items-center', 'gap-2', 'rounded-xl', 'p-3', 'shadow-sm']
  : ['flex', 'items-center', 'gap-4', 'rounded-2xl', 'p-5', 'shadow-lg'])
</script>

<template>
  <div class="demo-card tw-demo">
    <div class="toolbar"><button @click="compact = !compact">切换{{ compact ? '舒展' : '紧凑' }}密度</button></div>
    <div class="course-card" :class="{ compact }">
      <span class="chestnut">🌰</span><div><strong>Vue 响应式精讲</strong><p>把单用途工具类组合成完整课程卡片。</p></div><b>¥39</b>
    </div>
    <div class="class-list"><code v-for="item in utilities" :key="item">{{ item }}</code></div>
    <small>工具类描述单一 CSS 声明；重复组合应抽成组件，而不是急着写自定义类。</small>
  </div>
</template>

<style scoped>
.toolbar{margin-bottom:.8rem}.course-card{display:flex;align-items:center;gap:1rem;padding:1.25rem;border:1px solid #f0c38e;border-radius:1rem;background:linear-gradient(135deg,#fffaf1,#fff0dc);box-shadow:0 12px 28px #9b4b1d18;transition:.2s}.course-card.compact{gap:.5rem;padding:.75rem;border-radius:.7rem;box-shadow:0 4px 12px #9b4b1d12}.course-card p{margin:.25rem 0 0;color:#805d46}.course-card b{margin-left:auto;color:#bd4d22}.chestnut{font-size:2rem}.class-list{display:flex;flex-wrap:wrap;gap:.35rem;margin:.8rem 0}.class-list code{padding:.15rem .4rem;border-radius:.35rem;background:#5a2f22;color:#ffe8c5;font-size:.75rem}
</style>
