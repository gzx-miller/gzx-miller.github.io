const n=`<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const memberId = computed(() => {
  const directMemberId = route.params.memberId
  if (typeof directMemberId === 'string') {
    return directMemberId
  }

  const slug = route.params.slug
  if (Array.isArray(slug) && slug.length > 3) {
    return slug[slug.length - 1] ?? 'lee'
  }

  return 'lee'
})
<\/script>

<template>
  <div class="demo-card">
    <h3>成员详情路由</h3>
    <p>当前成员参数：{{ memberId }}</p>
    <div class="button-row">
      <NuxtLink to="/vue/k-12/routing/lee">查看 Lee</NuxtLink>
      <NuxtLink to="/vue/k-12/routing/ming">查看 Ming</NuxtLink>
    </div>
  </div>
</template>
`;export{n as default};
