const e=`<script setup lang="ts">
import { computed, defineComponent, h, inject, provide, ref, type Ref } from 'vue'

const theme = ref('青色')
provide('courseTheme', theme)

const ThemePreview = defineComponent({
  setup() {
    const injectedTheme = inject<Ref<string>>('courseTheme', ref('默认主题'))
    const message = computed(() => \`子组件读取到主题：\${injectedTheme.value}\`)

    return () => h('p', message.value)
  },
})
<\/script>

<template>
  <div class="demo-card">
    <h3>课程主题同步</h3>
    <select v-model="theme">
      <option>青色</option>
      <option>绿色</option>
      <option>红色</option>
    </select>
    <ThemePreview />
  </div>
</template>
`;export{e as default};
