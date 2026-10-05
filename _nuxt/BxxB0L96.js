const n=`<script setup lang="ts">
import { ref } from 'vue'

const showDone = ref(true)
const tasks = ref([
  { id: 1, title: '搭建 Vue3 项目', done: true },
  { id: 2, title: '学习 v-for 的 key', done: false },
  { id: 3, title: '整理条件渲染笔记', done: true },
])
<\/script>

<template>
  <div class="demo-card">
    <h3>学习任务看板</h3>
    <label><input v-model="showDone" type="checkbox" /> 显示已完成</label>
    <ul>
      <li v-for="task in tasks" v-show="showDone || !task.done" :key="task.id">
        <span v-if="task.done">已完成</span>
        <span v-else>进行中</span>
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>
`;export{n as default};
