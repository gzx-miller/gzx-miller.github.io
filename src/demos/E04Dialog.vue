<script setup lang="ts">
import { ref } from 'vue'
import { ElDialog, ElButton, ElInput, ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const courseName = ref('')

function openBasic() {
  dialogVisible.value = true
}

function openForm() {
  courseName.value = ''
  dialogVisible2.value = true
}

function openAdvanced() {
  dialogVisible3.value = true
}

function handleConfirm() {
  if (!courseName.value.trim()) {
    ElMessage.warning('请输入课程名称')
    return
  }
  ElMessage.success(`课程「${courseName.value}」创建成功！`)
  dialogVisible2.value = false
}
</script>

<template>
  <div class="demo-card">
    <h3>对话框 Dialog</h3>
    <div class="button-row">
      <ElButton type="primary" @click="openBasic">基础对话框</ElButton>
      <ElButton type="success" @click="openForm">表单对话框</ElButton>
      <ElButton type="warning" @click="openAdvanced">信息揭示框</ElButton>
    </div>

    <!-- 基础对话框 -->
    <ElDialog
      v-model="dialogVisible"
      title="欢迎学习"
      width="400px"
    >
      <p>这是 Element Plus 基础对话框组件。支持标题、内容和底栏按钮的自定义。</p>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="dialogVisible = false">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 表单对话框 -->
    <ElDialog
      v-model="dialogVisible2"
      title="创建新课程"
      width="420px"
    >
      <div class="form-item">
        <label>课程名称</label>
        <ElInput v-model="courseName" placeholder="请输入课程名称" clearable />
      </div>
      <template #footer>
        <ElButton @click="dialogVisible2 = false">取消</ElButton>
        <ElButton type="primary" @click="handleConfirm">创建</ElButton>
      </template>
    </ElDialog>

    <!-- 信息揭示框 -->
    <ElDialog
      v-model="dialogVisible3"
      title="提示"
      width="360px"
      :show-close="false"
    >
      <div class="tip-content">
        <p>此操作将消耗 1 积分，是否继续？</p>
      </div>
      <template #footer>
        <ElButton size="large" @click="dialogVisible3 = false">取消</ElButton>
        <ElButton type="warning" size="large" @click="dialogVisible3 = false">确定</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

