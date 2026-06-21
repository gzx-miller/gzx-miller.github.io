<script setup lang="ts">
import { computed, reactive } from 'vue'

const headers = reactive({ csp: true, nosniff: true, referrer: false, cache: true })
const ready = computed(() => Object.values(headers).every(Boolean))
</script>

<template>
  <div class="demo-card">
    <h3>发布前安全清单</h3>
    <label><input v-model="headers.csp" type="checkbox" /> Content-Security-Policy</label>
    <label><input v-model="headers.nosniff" type="checkbox" /> X-Content-Type-Options</label>
    <label><input v-model="headers.referrer" type="checkbox" /> Referrer-Policy</label>
    <label><input v-model="headers.cache" type="checkbox" /> 带哈希资源长期缓存</label>
    <p>{{ ready ? '✓ 可以发布' : '仍有发布风险' }}</p>
  </div>
</template>
