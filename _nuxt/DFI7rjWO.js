const n=`<script setup lang="ts">
import { ref } from 'vue'
import { ElUpload, ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'

// 模拟上传：不真正发送请求
const fileList = ref<UploadFile[]>([])

function handleExceed() {
  ElMessage.warning('最多上传 3 个文件')
}

function beforeUpload(file: File) {
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'text/markdown']
  if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
    ElMessage.error('仅支持 PDF、图片和 Markdown 文件')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB')
    return false
  }
  return true
}

function handleRemove(file: UploadFile) {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
}

const uploadCode = \`// ElUpload 关键属性
<ElUpload
  drag                    // 拖拽上传
  :auto-upload="false"    // 手动触发上传
  :limit="3"              // 最大文件数
  :before-upload="beforeUpload"  // 上传前校验
  :on-exceed="handleExceed"      // 超出限制回调
  accept=".pdf,.png,.jpg,.md"    // 接受的文件类型
>
  <ElButton type="primary">点击上传</ElButton>
</ElUpload>\`
<\/script>

<template>
  <div class="demo-card">
    <h3>文件上传 Upload</h3>

    <h4>拖拽上传</h4>
    <ElUpload
      v-model:file-list="fileList"
      drag
      :auto-upload="false"
      :limit="3"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      accept=".pdf,.png,.jpg,.md"
    >
      <div class="upload-inner">
        <p class="upload-icon">📁</p>
        <p>将课程资料拖到此处，或<em>点击上传</em></p>
        <p class="upload-hint">支持 PDF / PNG / JPG / Markdown，不超过 5MB，最多 3 个</p>
      </div>
    </ElUpload>

    <div class="code-section">
      <h4>关键代码</h4>
      <pre class="code-block">{{ uploadCode }}</pre>
    </div>
  </div>
</template>

`;export{n as default};
