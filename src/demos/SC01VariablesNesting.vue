<script setup lang="ts">
import { ref } from 'vue'
const accent = ref('#c45125')
</script>
<template><div class="demo-card sass-demo" :style="{ '--accent': accent }"><label>主题色 <input v-model="accent" type="color"></label><article class="course"><strong>Sass 基础</strong><p>变量集中表达复用值，嵌套保持选择器上下文。</p><button>加入课程</button></article><code>$accent: {{ accent }}; .course { button { color: $accent; } }</code><small>嵌套应保持浅层；超过两三层通常意味着选择器与 DOM 结构耦合过深。</small></div></template>
<style scoped>.course{margin:.8rem 0;padding:1rem;border-left:4px solid var(--accent);border-radius:.6rem;background:#fff3df}.course p{color:#805f4d}.course button{color:var(--accent)}.sass-demo>code{font-size:.76rem}</style>
