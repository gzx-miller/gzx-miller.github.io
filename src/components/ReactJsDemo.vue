<script setup lang="ts">
import { computed, ref } from 'vue'
import { createReactDemoDocument } from '../utils/reactDemo'

const props = defineProps<{
  code: string
  title: string
}>()

const isLoaded = ref(false)
const srcdoc = computed(() => createReactDemoDocument(props.code))
</script>

<template>
  <div class="react-demo-shell">
    <div v-if="!isLoaded" class="react-demo-loading">正在加载 React 19.2 演示...</div>
    <iframe
      :title="title"
      :srcdoc="srcdoc"
      sandbox="allow-scripts"
      loading="eager"
      @load="isLoaded = true"
    />
    <p class="react-runtime-note">
      运行环境：React 19.2 ES Module，通过 JavaScript URL 引入；未向 Vue3 工程安装 React 依赖。
    </p>
  </div>
</template>

<style scoped>
.react-demo-shell {
  display: grid;
  gap: 8px;
}

.react-demo-shell iframe {
  width: 100%;
  height: 330px;
  border: 1px solid #efc48d;
  border-radius: 7px;
  background: #fffaf2;
}

.react-demo-loading,
.react-runtime-note {
  margin: 0;
  color: #7c563f;
  font-size: 12px;
}

.react-demo-loading {
  position: absolute;
  padding: 12px;
}

@media (max-width: 520px) {
  .react-demo-shell iframe {
    height: 390px;
  }
}
</style>
