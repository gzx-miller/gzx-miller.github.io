<script setup lang="ts">
import { computed, ref } from 'vue'

const scenario = ref('modal')
const recommendations: Record<string, { scope: string; choice: string }> = {
  modal: { scope: '单组件 UI 状态', choice: '组件 ref / useState' },
  cart: { scope: '跨页面客户端业务状态', choice: 'Pinia / Zustand / Redux' },
  filter: { scope: '可分享的 URL 状态', choice: '路由 query' },
  courses: { scope: '服务端缓存状态', choice: 'TanStack Query / useAsyncData' },
}
const result = computed(() => recommendations[scenario.value])
</script>

<template><div class="demo-card"><label>业务场景<select v-model="scenario"><option value="modal">弹窗开关</option><option value="cart">购物车</option><option value="filter">搜索筛选</option><option value="courses">远程课程列表</option></select></label><p><strong>{{ result.scope }}</strong></p><p>优先选择：{{ result.choice }}</p></div></template>
