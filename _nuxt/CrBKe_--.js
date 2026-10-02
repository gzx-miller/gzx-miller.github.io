const e=`<script setup lang="ts">
import { ref } from 'vue'
const dark = ref(false)
<\/script>

<template>
  <div class="demo-card tw-demo">
    <button @click="dark = !dark">{{ dark ? '☀️ 浅色' : '🌙 深色' }}</button>
    <article class="theme-card" :class="{ dark }"><span>今日进度</span><strong>已完成 6 / 8 栗子</strong><div><i style="width:75%"></i></div><p>颜色随祖先上的 dark 状态切换。</p></article>
    <code>bg-amber-50 text-stone-900 dark:bg-stone-900 dark:text-amber-50</code>
    <small>暗色模式是显式设计分支，不是颜色反转；同时保留足够对比度，并避免首屏主题闪烁。</small>
  </div>
</template>

<style scoped>
.theme-card{display:grid;gap:.55rem;margin:.8rem 0;padding:1.1rem;border-radius:.9rem;background:#fff7e6;color:#342219;transition:.2s}.theme-card.dark{background:#29211e;color:#fff1d0}.theme-card span,.theme-card p{color:#8e6754;margin:0}.theme-card.dark span,.theme-card.dark p{color:#d8bca7}.theme-card div{height:8px;overflow:hidden;border-radius:9px;background:#dfc7b3}.theme-card i{display:block;height:100%;background:#dd652e}.tw-demo>code{font-size:.76rem;overflow-wrap:anywhere}
</style>
`;export{e as default};
