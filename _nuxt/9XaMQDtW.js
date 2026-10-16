const e=`<script setup>
import { computed, ref } from 'vue'

const environment = ref('development')
const config = computed(() => ({ port: environment.value === 'production' ? 8080 : 3000, logLevel: environment.value === 'production' ? 'info' : 'debug' }))
<\/script>

<template><div class="demo-card"><label>NODE_ENV<select v-model="environment"><option value="development">development</option><option value="production">production</option></select></label><p>端口 {{ config.port }} · 日志 {{ config.logLevel }}</p><small>环境变量进入应用后应立即校验并转换成类型明确的配置。</small></div></template>
`;export{e as default};
