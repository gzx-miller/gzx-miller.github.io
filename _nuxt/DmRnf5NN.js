const n=`<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  saved: [value: string]
}>()

const draft = ref(props.title ?? 'Vue3 组件卡片')
const savedTitle = ref(draft.value)

function save() {
  savedTitle.value = draft.value
  emit('saved', draft.value)
}
<\/script>

<template>
  <div class="demo-card">
    <h3>{{ savedTitle }}</h3>
    <input v-model="draft" aria-label="标题" />
    <button @click="save">保存标题</button>
  </div>
</template>
`;export{n as default};
