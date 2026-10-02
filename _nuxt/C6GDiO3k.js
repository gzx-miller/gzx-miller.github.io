const n=`<script setup lang="ts">
import { nextTick, ref } from 'vue'

const keyword = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

async function focusSearch() {
  await nextTick()
  inputRef.value?.focus()
}

function clearSearch() {
  keyword.value = ''
  focusSearch()
}

defineExpose({
  clearSearch,
  focusSearch,
})
<\/script>

<template>
  <div class="search-panel">
    <label for="course-search">课程搜索</label>
    <input
      id="course-search"
      ref="inputRef"
      v-model="keyword"
      placeholder="输入课程名称"
    />
    <p>{{ keyword ? \`正在搜索：\${keyword}\` : '等待输入关键词' }}</p>
  </div>
</template>

<style scoped>
.search-panel {
  display: grid;
  gap: 8px;
  border: 1px solid #efc48d;
  border-radius: 7px;
  background: #fffaf2;
  padding: 14px;
}

label {
  color: #7c563f;
  font-size: 13px;
}

p {
  margin: 0;
  color: #8f2f18;
  font-size: 13px;
}
</style>
`;export{n as default};
