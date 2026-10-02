const n=`<script setup lang="ts">
import { reactive, ref } from 'vue'

const count = ref(1)
const profile = reactive({
  name: '林青',
  level: '初级前端',
})

function promote() {
  count.value += 1
  profile.level = count.value > 3 ? 'Vue3 熟练者' : '初级前端'
}
<\/script>

<template>
  <div class="demo-card">
    <h3>{{ profile.name }} 的学习进度</h3>
    <p>完成章节：{{ count }}</p>
    <p>当前阶段：{{ profile.level }}</p>
    <button @click="promote">完成一章</button>
  </div>
</template>
`;export{n as default};
