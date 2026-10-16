const n=`<script setup lang="ts">
import { ref } from 'vue'

const result = ref('点按钮运行一段代码，看它是「语句」还是「表达式」。')
let total = 0

function runExpression() {
  result.value = \`表达式有值：单价 12 × 数量 3 = \${12 * 3}，结果可以直接赋给变量。\`
}

function runStatement() {
  if (12 * 3 > 30) {
    total = 12 * 3
  }
  result.value = \`语句本身没有值，只产生副作用：total 被更新为 \${total}。\`
}
<\/script>

<template>
  <div class="demo-card">
    <div class="button-row">
      <button @click="runExpression">求值表达式</button>
      <button @click="runStatement">执行语句</button>
    </div>
    <p>{{ result }}</p>
    <small>表达式会产出一个值，语句则是让程序「做一件事」。</small>
  </div>
</template>
`;export{n as default};
