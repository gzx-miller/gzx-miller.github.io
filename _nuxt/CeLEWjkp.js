const n=`<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElButtonGroup, ElIcon } from 'element-plus'
import { Search, Edit, Check, Message, Delete, Star, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const loading = ref(false)

function handleLoadingClick() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
<\/script>

<template>
  <div class="demo-card">
    <h3>基础按钮</h3>
    <div class="button-row">
      <ElButton>默认按钮</ElButton>
      <ElButton type="primary">主要按钮</ElButton>
      <ElButton type="success">成功按钮</ElButton>
      <ElButton type="warning">警告按钮</ElButton>
      <ElButton type="danger">危险按钮</ElButton>
      <ElButton type="info">信息按钮</ElButton>
    </div>

    <h3>幽灵按钮</h3>
    <div class="button-row">
      <ElButton plain>朴素按钮</ElButton>
      <ElButton type="primary" plain>主要按钮</ElButton>
      <ElButton type="success" plain>成功按钮</ElButton>
      <ElButton type="warning" plain>警告按钮</ElButton>
      <ElButton type="danger" plain>危险按钮</ElButton>
    </div>

    <h3>圆角与尺寸</h3>
    <div class="button-row">
      <ElButton round>圆角按钮</ElButton>
      <ElButton type="primary" round>主要圆角</ElButton>
      <ElButton size="large">大尺寸</ElButton>
      <ElButton size="small">小尺寸</ElButton>
      <ElButton size="small" round>小圆角</ElButton>
    </div>

    <h3>图标按钮与加载态</h3>
    <div class="button-row">
      <ElButton :icon="Search" circle />
      <ElButton type="primary" :icon="Edit" circle />
      <ElButton type="success" :icon="Check" circle />
      <ElButton type="warning" :icon="Message" circle />
      <ElButton type="danger" :icon="Delete" circle />
      <ElButton type="info" :icon="Star" circle />
      <ElButton type="primary" :loading="loading" @click="handleLoadingClick">
        {{ loading ? '加载中...' : '点击加载' }}
      </ElButton>
    </div>

    <h3>按钮组</h3>
    <ElButtonGroup>
      <ElButton type="primary" :icon="ArrowLeft">上一页</ElButton>
      <ElButton type="primary">
        下一页<ElIcon class="el-icon--right"><ArrowRight /></ElIcon>
      </ElButton>
    </ElButtonGroup>
  </div>
</template>
`;export{n as default};
