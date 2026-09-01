const r=`<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

// errorCaptured 捕获后代组件错误
const errorLog = ref<{ message: string; source: string; time: string }[]>([])
const hasError = ref(false)
const errorSource = ref('')

// onErrorCaptured 钩子：捕获后代组件抛出的错误
// 返回 false 阻止错误继续向上传播
onErrorCaptured((err, instance, _info) => {
  const source = instance?.$options?.name || instance?.$options?.__name || '未知组件'
  errorLog.value.unshift({
    message: String(err),
    source: String(source),
    time: new Date().toLocaleTimeString(),
  })
  hasError.value = true
  errorSource.value = String(source)
  // 返回 false 阻止错误继续冒泡到全局 errorHandler
  return false
})

// 模拟会出错的子组件
const shouldThrow = ref(false)
const throwError = () => {
  shouldThrow.value = true
}

function recover() {
  hasError.value = false
  shouldThrow.value = false
}

function clearLog() {
  errorLog.value = []
}

// 全局错误处理说明
const globalHandlerCode = \`// main.ts 中注册全局错误处理器
app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err)
  // 上报错误到监控服务
  reportError(err, info)
}\`
<\/script>

<template>
  <div class="demo-card">
    <h3>错误处理</h3>

    <!-- 错误边界演示 -->
    <div class="demo-section">
      <h4>errorCaptured 错误边界</h4>
      <div v-if="hasError" class="error-boundary">
        <p class="error-msg">⚠ 捕获到来自「{{ errorSource }}」的错误</p>
        <button class="recover-btn" @click="recover">恢复组件</button>
      </div>
      <div v-else class="safe-zone">
        <p>子组件正常运行中</p>
        <button class="trigger-btn" @click="throwError">模拟子组件错误</button>
      </div>
      <!-- 模拟子组件抛错 -->
      <div v-if="shouldThrow" class="error-child">
        {{ (() => { throw new Error('子组件渲染失败：数据格式异常') })() }}
      </div>
    </div>

    <!-- 错误日志 -->
    <div class="log-section">
      <h4>错误日志 <button class="clear-btn" @click="clearLog">清空</button></h4>
      <div v-if="errorLog.length === 0" class="empty-log">暂无错误</div>
      <div v-for="(log, i) in errorLog" :key="i" class="log-item">
        <span class="log-time">{{ log.time }}</span>
        <span class="log-source">{{ log.source }}</span>
        <span class="log-msg">{{ log.message }}</span>
      </div>
    </div>

    <!-- 全局错误处理代码 -->
    <div class="code-section">
      <h4>全局错误处理器</h4>
      <pre class="code-block">{{ globalHandlerCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
h4 { margin: 0 0 10px; color: #8b5e3c; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.error-boundary { background: #fef2f2; border: 1px solid #f5a3a3; border-radius: 6px; padding: 12px; }
.error-msg { color: #c8503c; font-weight: bold; margin: 0 0 8px; }
.recover-btn { padding: 6px 14px; background: #6b9e78; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.safe-zone { display: flex; align-items: center; gap: 12px; }
.safe-zone p { margin: 0; color: #5a3e2b; }
.trigger-btn { padding: 6px 14px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.log-section { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.empty-log { color: #8b5e3c; font-size: 13px; font-style: italic; }
.clear-btn { padding: 2px 8px; font-size: 11px; border: 1px solid #a8d5b8; border-radius: 4px; background: #fff; cursor: pointer; }
.log-item { display: flex; gap: 8px; padding: 4px 0; border-bottom: 1px solid #d4e8d4; font-size: 12px; }
.log-time { color: #8b5e3c; font-family: monospace; min-width: 70px; }
.log-source { color: #c8703c; font-weight: bold; min-width: 80px; }
.log-msg { color: #5a3e2b; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-block { margin: 8px 0 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{r as default};
