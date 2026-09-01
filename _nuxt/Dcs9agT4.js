const n=`<script setup lang="ts">
import { useCountdown } from '../composables/useCountdown'

const { seconds, isFinished, start, reset } = useCountdown(5)
<\/script>

<template>
  <div class="demo-card">
    <h3>验证码倒计时</h3>
    <strong>{{ isFinished ? '可以重新发送' : \`\${seconds} 秒后可重发\` }}</strong>
    <button @click="start">发送验证码</button>
    <button @click="reset">重置</button>
  </div>
</template>
`;export{n as default};
