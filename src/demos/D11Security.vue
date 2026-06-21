<script setup>
import { computed, ref } from 'vue'

const input = ref('avatar.png')
const safe = computed(() => /^[a-z0-9][a-z0-9._-]*$/i.test(input.value) && !input.value.includes('..'))
</script>

<template><div class="demo-card"><label>上传文件名<input v-model="input" /></label><p :class="safe ? 'test-pass' : 'test-fail'">{{ safe ? '✓ 可进入受控目录' : '× 拒绝危险路径' }}</p><small>服务端必须校验输入、规范化路径并限制权限，不能信任客户端文件名。</small></div></template>
