const n=`<script setup lang="ts">
import { ref } from 'vue'

const showTip = ref(true)
const goals = ref(['读完 🌰16', '写一个过渡动画'])
<\/script>

<template>
  <div class="demo-card">
    <h3>学习提醒</h3>
    <button @click="showTip = !showTip">切换提示</button>
    <Transition name="fade">
      <p v-if="showTip">过渡用于让进入和离开的 DOM 有状态变化。</p>
    </Transition>
    <TransitionGroup name="list" tag="ul">
      <li v-for="goal in goals" :key="goal">{{ goal }}</li>
    </TransitionGroup>
  </div>
</template>
`;export{n as default};
