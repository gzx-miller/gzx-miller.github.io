const t=`<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElResult, ElButton } from 'element-plus'

type Status = 'success' | 'warning' | 'error' | 'info'

const status = ref<Status>('success')

const meta: Record<Status, { title: string; desc: string }> = {
  success: { title: '课程提交成功', desc: '讲师已收到通知，预计 2 个工作日内完成审核。' },
  warning: { title: '草稿已保存', desc: '课程内容尚未发布，学员暂时无法看到。' },
  error: { title: '封面上传失败', desc: '图片格式不支持或超过 5MB，请检查后重试。' },
  info: { title: '审核中', desc: '课程正在等待教研组审核，审核通过后将自动上线。' },
}

const current = computed(() => meta[status.value])

function setStatus(s: Status) {
  status.value = s
}
<\/script>

<template>
  <div class="demo-card">
    <p class="demo-kicker">操作反馈</p>
    <h3>课程发布结果页</h3>

    <div class="button-row">
      <ElButton :type="status === 'success' ? 'primary' : ''" @click="setStatus('success')">提交成功</ElButton>
      <ElButton :type="status === 'warning' ? 'warning' : ''" @click="setStatus('warning')">保存草稿</ElButton>
      <ElButton :type="status === 'error' ? 'danger' : ''" @click="setStatus('error')">上传失败</ElButton>
      <ElButton :type="status === 'info' ? 'info' : ''" @click="setStatus('info')">审核中</ElButton>
    </div>

    <ElResult :icon="status" :title="current.title" :sub-title="current.desc">
      <template #extra>
        <ElButton type="primary" @click="setStatus('success')">继续操作</ElButton>
        <ElButton @click="setStatus('info')">查看详情</ElButton>
      </template>
    </ElResult>
  </div>
</template>
`;export{t as default};
