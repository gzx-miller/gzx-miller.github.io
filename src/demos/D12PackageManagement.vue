<script setup>
import { computed, ref } from 'vue'

const range = ref('^4.1.0')
const meaning = computed(() => range.value.startsWith('^') ? '允许兼容的次版本与补丁更新' : range.value.startsWith('~') ? '只允许补丁更新' : '固定或自定义范围')
</script>

<template><div class="demo-card"><label>版本范围<select v-model="range"><option>^4.1.0</option><option>~4.1.0</option><option>4.1.0</option></select></label><p>{{ meaning }}</p><pre class="mini-code"><code>pnpm install --frozen-lockfile</code></pre><small>应用应提交锁文件，CI 使用冻结锁文件获得可重复安装。</small></div></template>
