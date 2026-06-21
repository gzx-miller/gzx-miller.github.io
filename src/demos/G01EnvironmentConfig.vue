<script setup lang="ts">
import { computed, ref } from 'vue'

type Environment = 'development' | 'production'
const environment = ref<Environment>('development')
const apiBase = computed(() => environment.value === 'production' ? 'https://api.example.com' : 'http://localhost:3001')
</script>

<template>
  <div class="demo-card">
    <label>运行环境<select v-model="environment"><option value="development">开发</option><option value="production">生产</option></select></label>
    <p>API 地址：<code>{{ apiBase }}</code></p>
    <small>公开配置可进客户端；密钥必须只保留在服务端。</small>
  </div>
</template>
