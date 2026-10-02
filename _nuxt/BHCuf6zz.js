const n=`<script setup lang="ts">
import { ref } from 'vue'

const source = ref('{"name":"栗子课","count":12}')
const result = ref('等待校验')

function isCourseData(value: unknown): value is { name: string; count: number } {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.name === 'string' && typeof record.count === 'number'
}

function validate() {
  try {
    const data: unknown = JSON.parse(source.value)
    result.value = isCourseData(data) ? \`\${data.name}：\${data.count} 节\` : '字段结构不合法'
  } catch {
    result.value = '不是有效 JSON'
  }
}
<\/script>

<template>
  <div class="demo-card">
    <label>导入内容<input v-model="source" /></label>
    <button @click="validate">安全解析</button>
    <p>{{ result }}</p>
  </div>
</template>
`;export{n as default};
