const e=`<script setup>
import { ref } from 'vue'

const files = ref(['courses.json', 'users.json', 'settings.json'])
const status = ref('等待读取')
async function readFiles() {
  status.value = '使用 fs/promises 并发读取…'
  await new Promise((resolve) => setTimeout(resolve, 320))
  status.value = \`读取完成：\${files.value.length} 个文件\`
}
<\/script>

<template><div class="demo-card"><button @click="readFiles">读取配置目录</button><p role="status">{{ status }}</p><pre class="mini-code"><code>await Promise.all(names.map(name =&gt; readFile(name, 'utf8')))</code></pre></div></template>
`;export{e as default};
