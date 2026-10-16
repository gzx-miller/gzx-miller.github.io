const n=`<script setup lang="ts">
const checks = [
  '组件只暴露必要的 props 和 emits',
  '组合式函数可以独立测试',
  'Store 的 action 和 getter 有确定输入输出',
]
<\/script>

<template>
  <div class="demo-card">
    <h3>可维护性检查清单</h3>
    <ul>
      <li v-for="check in checks" :key="check">{{ check }}</li>
    </ul>
  </div>
</template>
`;export{n as default};
