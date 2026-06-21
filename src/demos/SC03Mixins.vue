<script setup lang="ts">
import { ref } from 'vue'
const size = ref<'sm'|'md'|'lg'>('md')
</script>
<template><div class="demo-card sass-demo"><div class="choices"><button v-for="item in ['sm','md','lg']" :key="item" @click="size = item as typeof size">{{ item }}</button></div><button class="cta" :class="size">报名工作坊</button><pre>@mixin button-size($py, $px) { padding: $py $px; }
.button { @include button-size(...); }</pre><small>Mixin 适合复用带参数的声明块；@content 可让调用方注入规则。无参数的纯样式复用先考虑普通类。</small></div></template>
<style scoped>.choices{display:flex;gap:.4rem}.cta{display:block;margin:1rem 0;background:#b84d22;color:#fff;border:0}.cta.sm{padding:.35rem .65rem}.cta.md{padding:.6rem 1rem}.cta.lg{padding:.85rem 1.4rem}pre{white-space:pre-wrap;font-size:.76rem}</style>
