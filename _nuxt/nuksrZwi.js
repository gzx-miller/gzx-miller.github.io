const n=`<script setup lang="ts">
import { effectScope, onScopeDispose, onUnmounted, ref, watchEffect, type EffectScope } from 'vue'

const workspace = ref('秋季课程组')
const isConnected = ref(false)
const syncCount = ref(0)
const logs = ref<string[]>([])
let workspaceScope: EffectScope | undefined
let timer: ReturnType<typeof setInterval> | undefined

function addLog(message: string) {
  logs.value.unshift(\`\${new Date().toLocaleTimeString()} \${message}\`)
}

function startWorkspace() {
  if (workspaceScope?.active) return

  workspaceScope = effectScope()
  workspaceScope.run(() => {
    isConnected.value = true

    watchEffect(() => {
      addLog(\`正在监听：\${workspace.value}\`)
    })

    timer = setInterval(() => {
      syncCount.value += 1
    }, 1000)

    onScopeDispose(() => {
      if (timer) clearInterval(timer)
      timer = undefined
      isConnected.value = false
      addLog('已统一清理监听与定时器')
    })
  })
}

function stopWorkspace() {
  workspaceScope?.stop()
  workspaceScope = undefined
}

onUnmounted(stopWorkspace)
<\/script>

<template>
  <div class="demo-card scope-demo">
    <div class="scope-status">
      <div>
        <p>工作台订阅</p>
        <h3>{{ workspace }}</h3>
      </div>
      <span :class="{ online: isConnected }">{{ isConnected ? '运行中' : '已停止' }}</span>
    </div>

    <label>
      当前工作区
      <select v-model="workspace">
        <option>秋季课程组</option>
        <option>会员运营组</option>
        <option>内容审核组</option>
      </select>
    </label>

    <div class="metric">
      <span>后台同步次数</span>
      <strong>{{ syncCount }}</strong>
    </div>

    <div class="button-row">
      <button @click="startWorkspace">启动作用域</button>
      <button class="secondary" @click="stopWorkspace">停止并清理</button>
    </div>

    <ul class="scope-log">
      <li v-for="log in logs.slice(0, 4)" :key="log">{{ log }}</li>
      <li v-if="logs.length === 0">尚未启动工作台订阅</li>
    </ul>
  </div>
</template>

<style scoped>
.scope-demo {
  display: grid;
  gap: 14px;
}

.scope-status,
.metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.scope-status p,
.scope-status h3 {
  margin: 0;
}

.scope-status p,
label,
.metric span {
  color: #7c563f;
  font-size: 13px;
}

.scope-status > span {
  border-radius: 999px;
  background: #f1d6bf;
  color: #7c563f;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 700;
}

.scope-status > span.online {
  background: #dcebd7;
  color: #4b6d33;
}

label {
  display: grid;
  gap: 6px;
}

.metric {
  border: 1px solid #efc48d;
  border-radius: 7px;
  background: #fffaf2;
  padding: 12px;
}

.metric strong {
  color: #8f2f18;
  font-size: 22px;
}

.secondary {
  border-color: #b7431f;
  background: transparent;
  color: #8f2f18;
}

.scope-log {
  min-height: 72px;
  margin: 0;
  border-left: 3px solid #f08a24;
  background: #fff8eb;
  padding: 10px 10px 10px 28px;
  color: #7c563f;
  font-size: 13px;
}
</style>
`;export{n as default};
