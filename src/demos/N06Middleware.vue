<script setup lang="ts">
import { ref } from 'vue'

const running = ref(false)
const steps = ref<string[]>([])

const layerLabels = [
  '① 中间件（LoggerMiddleware）：记录请求日志，调用 next()',
  '② 守卫（JwtAuthGuard）：校验 token 是否放行',
  '③ 拦截器前置（TransformInterceptor）：记录开始时间',
  '④ 管道（ValidationPipe）：校验 /transform 请求体参数',
  '⑤ 处理器（CourseController → CourseService）：执行业务',
  '⑥ 拦截器后置（map）：包装统一响应结构',
]

async function sendRequest() {
  if (running.value) return
  running.value = true
  steps.value = []
  for (const step of layerLabels) {
    steps.value.push(step)
    await new Promise((r) => setTimeout(r, 350))
  }
  steps.value.push('🟢 响应沿原路返回客户端')
  running.value = false
}
</script>

<template>
  <div class="demo-card">
    <h3>🌰 请求链路 · 洋葱模型</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      点击"发送请求"，观察一次 <code>POST /courses</code> 请求如何层层穿过的完整生命周期：
    </p>

    <div style="display: flex; gap: 8px; margin-bottom: 12px">
      <button class="tab-btn active" :disabled="running" @click="sendRequest">
        {{ running ? '请求处理中…' : '发送请求 POST /courses' }}
      </button>
    </div>

    <div v-if="steps.length" class="onion">
      <p
        v-for="(step, i) in steps"
        :key="i"
        class="onion-line"
        :class="{ current: running && i === steps.length - 1, done: !running || i < steps.length - 1 }"
      >
        {{ step }}
      </p>
    </div>

    <div class="layers">
      <p v-for="(layer, i) in layerLabels" :key="i" class="layer-item">{{ layer }}</p>
    </div>

    <p class="note">
      <strong>执行顺序：</strong>中间件 → 守卫 → 拦截器前置 → 管道 → 处理器 → 拦截器后置。
      越靠外越"通用"，越靠内越"业务"。
    </p>
  </div>
</template>

<style scoped>
.onion {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
  margin-bottom: 12px;
}

.onion-line {
  margin: 5px 0;
  font-size: 13px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.onion-line.current {
  color: var(--accent-strong);
  font-weight: 700;
}

.onion-line.done {
  color: var(--muted);
}

.layers {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px dashed var(--border);
  background: var(--surface);
}

.layer-item {
  margin: 3px 0;
  font-size: 12px;
  color: var(--muted);
}

.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
