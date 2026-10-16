const e=`<script setup lang="ts">
import { ref } from 'vue'
import { vFocus } from '../directives/focus'

const query = ref('')
<\/script>

<template>
  <div class="demo-card">
    <h3>课程搜索指令</h3>
    <input v-focus v-model="query" placeholder="自动聚焦搜索框" />
    <p>搜索关键词：{{ query || '暂无' }}</p>
  </div>
</template>
`;export{e as default};
