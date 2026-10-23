const e=`<script setup>
import { ref } from 'vue'

const log = ref(null)
function simulateFailure() {
  log.value = { level: 'error', code: 'COURSE_NOT_FOUND', requestId: crypto.randomUUID().slice(0, 8), message: '课程不存在' }
}
<\/script>

<template><div class="demo-card"><button @click="simulateFailure">模拟请求失败</button><pre v-if="log" class="mini-code"><code>{{ JSON.stringify(log, null, 2) }}</code></pre><small>错误日志记录稳定代码和关联 ID，不泄露堆栈或敏感数据给客户端。</small></div></template>
`;export{e as default};
