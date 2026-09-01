const n=`<script setup lang="ts">
import { useTemplateRef } from 'vue'
import K28SearchPanel from './K28SearchPanel.vue'

const searchPanel = useTemplateRef<InstanceType<typeof K28SearchPanel>>('searchPanel')

function focusChildSearch() {
  searchPanel.value?.focusSearch()
}

function clearChildSearch() {
  searchPanel.value?.clearSearch()
}
<\/script>

<template>
  <div class="demo-card expose-demo">
    <div>
      <p class="demo-kicker">受控的组件实例能力</p>
      <h3>课程检索控制台</h3>
    </div>

    <K28SearchPanel ref="searchPanel" />

    <div class="button-row">
      <button @click="focusChildSearch">聚焦子组件输入框</button>
      <button class="secondary" @click="clearChildSearch">清空并重新聚焦</button>
    </div>

    <p class="demo-note">
      父组件只能访问 defineExpose 明确公开的方法，子组件内部状态仍保持封装。
    </p>
  </div>
</template>

<style scoped>
.expose-demo {
  display: grid;
  gap: 14px;
}

.expose-demo h3,
.demo-kicker,
.demo-note {
  margin: 0;
}

.demo-kicker {
  color: #8f2f18;
  font-size: 12px;
  font-weight: 700;
}

.secondary {
  border-color: #b7431f;
  background: transparent;
  color: #8f2f18;
}

.demo-note {
  color: #7c563f;
  font-size: 13px;
  line-height: 1.6;
}
</style>
`;export{n as default};
