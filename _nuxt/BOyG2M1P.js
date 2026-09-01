const n=`<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

const NotePanel = defineComponent({
  setup: () => () => h('p', '笔记面板会被 KeepAlive 缓存。'),
})

const PracticePanel = defineComponent({
  setup: () => () => h('p', '练习面板切回来时仍保留组件实例。'),
})

const tabs = {
  note: NotePanel,
  practice: PracticePanel,
}
const currentTab = ref<keyof typeof tabs>('note')
<\/script>

<template>
  <div class="demo-card">
    <h3>学习工作台</h3>
    <div class="button-row">
      <button @click="currentTab = 'note'">笔记</button>
      <button @click="currentTab = 'practice'">练习</button>
    </div>
    <KeepAlive>
      <component :is="tabs[currentTab]" />
    </KeepAlive>
  </div>
</template>
`;export{n as default};
