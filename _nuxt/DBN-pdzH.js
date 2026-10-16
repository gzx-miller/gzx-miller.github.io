const t=`<script setup>
import { ref } from 'vue'

const notifications = ref([])
function publishOrder() {
  const id = Math.floor(Math.random() * 9000 + 1000)
  notifications.value.unshift(\`order:paid → 订单 \${id} 已通知库存与邮件服务\`)
}
<\/script>

<template><div class="demo-card"><button @click="publishOrder">发布订单已支付事件</button><ul><li v-for="item in notifications" :key="item">{{ item }}</li></ul><pre class="mini-code"><code>bus.emit('order:paid', order)</code></pre></div></template>
`;export{t as default};
