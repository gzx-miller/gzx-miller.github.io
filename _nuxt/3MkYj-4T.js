const e=`<script setup>
import { computed, ref } from 'vue'

const method = ref('GET')
const path = ref('/api/courses')
const response = computed(() => method.value === 'GET' && path.value === '/api/courses'
  ? '200 { "courses": 3 }'
  : '404 { "message": "Not Found" }')
<\/script>

<template><div class="demo-card"><label>方法<select v-model="method"><option>GET</option><option>POST</option></select></label><label>路径<input v-model="path" /></label><p>响应：<code>{{ response }}</code></p><pre class="mini-code"><code>createServer((request, response) =&gt; { /* route */ })</code></pre></div></template>
`;export{e as default};
