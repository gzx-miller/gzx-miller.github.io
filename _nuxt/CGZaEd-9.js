const n=`<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
<\/script>

<template>
  <div class="demo-card">
    <h3>全局确认弹窗</h3>
    <button @click="open = true">打开弹窗</button>
    <Teleport to="body">
      <div v-if="open" class="modal-backdrop">
        <div class="modal-panel">
          <h3>确认开始练习？</h3>
          <p>Teleport 让弹窗脱离当前组件层级，挂载到 body。</p>
          <button @click="open = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
`;export{n as default};
