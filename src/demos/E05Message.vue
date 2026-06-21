<script setup lang="ts">
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'

function showSuccess() {
  ElMessage.success('课程创建成功！')
}

function showWarning() {
  ElMessage.warning('积分不足，请充值后再试')
}

function showError() {
  ElMessage.error('网络请求失败，请检查网络连接')
}

function showInfo() {
  ElMessage.info('当前版本为 v2.14.1，发现新版本 v2.15.0')
}

async function showConfirm() {
  try {
    await ElMessageBox.confirm(
      '此操作将消耗 1 积分，是否继续？',
      '积分提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--warning',
      }
    )
    ElMessage.success('操作已确认')
  } catch {
    ElMessage.info('已取消操作')
  }
}

async function showPrompt() {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入新课程名称：',
      '创建课程',
      {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputPlaceholder: '例如：Vue3 实战',
      }
    )
    ElMessage.success(`课程「${value}」已创建`)
  } catch {
    ElMessage.info('已取消')
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>消息提示与对话框</h3>

    <h4>ElMessage 消息提示</h4>
    <div class="button-row">
      <ElButton type="success" @click="showSuccess">成功</ElButton>
      <ElButton type="warning" @click="showWarning">警告</ElButton>
      <ElButton type="danger" @click="showError">错误</ElButton>
      <ElButton @click="showInfo">信息</ElButton>
    </div>

    <h4>ElMessageBox 确认与输入</h4>
    <div class="button-row">
      <ElButton type="warning" @click="showConfirm">确认对话框</ElButton>
      <ElButton type="primary" @click="showPrompt">输入对话框</ElButton>
    </div>
  </div>
</template>

