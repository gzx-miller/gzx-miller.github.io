const n=`<script setup lang="ts">
import { ref } from 'vue'

interface Course { id: number; title: string }
interface CourseDetail extends Course { teacher: string; duration: number }

// 函数重载：根据参数类型返回不同类型
function fetchCourse(id: number): CourseDetail
function fetchCourse(ids: number[]): Course[]
function fetchCourse(input: number | number[]): CourseDetail | Course[] {
  if (typeof input === 'number') {
    return { id: input, title: \`课程\${input}\`, teacher: '松松', duration: 120 }
  }
  return input.map(id => ({ id, title: \`课程\${id}\` }))
}

// 断言函数：运行时校验，调用后自动收窄类型
function assertCourse(obj: unknown): asserts obj is Course {
  if (typeof obj !== 'object' || obj === null) throw new Error('不是对象')
  if (!('id' in obj && 'title' in obj)) throw new Error('缺少课程字段')
}

const result = ref('')
const rawInput = ref('')

function loadSingle() {
  const detail = fetchCourse(1)
  result.value = \`\${detail.title}（\${detail.teacher}，\${detail.duration}分钟）\`
}

function loadMultiple() {
  const list = fetchCourse([1, 2, 3])
  result.value = \`共 \${list.length} 门：\${list.map(c => c.title).join('、')}\`
}

function validateInput() {
  try {
    const parsed: unknown = JSON.parse(rawInput.value)
    assertCourse(parsed)
    result.value = \`校验通过：\${parsed.title}\`
  } catch (e: any) {
    result.value = \`校验失败：\${e.message}\`
  }
}
<\/script>

<template>
  <div class="demo-card">
    <div class="button-row">
      <button @click="loadSingle">获取单门课程</button>
      <button @click="loadMultiple">获取课程列表</button>
    </div>
    <label>JSON 校验<input v-model="rawInput" placeholder='{"id":1,"title":"测试"}' /></label>
    <button @click="validateInput">断言校验</button>
    <p>{{ result }}</p>
    <small>函数重载让同一函数根据入参返回不同类型，asserts 断言在调用后自动收窄</small>
  </div>
</template>
`;export{n as default};
