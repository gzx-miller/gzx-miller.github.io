<script setup lang="ts">
import { ref, computed } from 'vue'

type HookPhase = 'idle' | 'running' | 'done'

interface PluginStep {
  name: string
  hook: string
  action: string
  state: HookPhase
}

const plugins = ref<PluginStep[]>([
  { name: 'banner', hook: 'transform', action: '在文件头部注入版权声明', state: 'idle' },
  { name: 'css-vars', hook: 'transform', action: '把 $primary 替换为 #e8713a', state: 'idle' },
  { name: 'html-minify', hook: 'generateBundle', action: '移除空白符和注释', state: 'idle' },
])

const currentPhase = ref<string>('')

const doneCount = computed(() => plugins.value.filter((p) => p.state === 'done').length)

async function runBuild() {
  plugins.value.forEach((p) => (p.state = 'idle'))
  currentPhase.value = ''

  for (const hook of ['transform', 'generateBundle'] as const) {
    currentPhase.value = hook
    const group = plugins.value.filter((p) => p.hook === hook)
    for (const step of group) {
      step.state = 'running'
      await new Promise((r) => setTimeout(r, 220))
      step.state = 'done'
    }
  }
  currentPhase.value = '完成'
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-hint">Vite 插件通过 Rollup 钩子介入构建流程。点击下方按钮观察各插件在不同钩子阶段的执行顺序。</p>

    <div class="plugin-pipeline">
      <div
        v-for="step in plugins"
        :key="step.name"
        class="plugin-step"
        :class="step.state"
      >
        <div class="step-header">
          <span class="step-icon">{{ step.state === 'done' ? '✓' : step.state === 'running' ? '…' : '○' }}</span>
          <strong>{{ step.name }}</strong>
          <code>{{ step.hook }}</code>
        </div>
        <p class="step-action">{{ step.action }}</p>
      </div>
    </div>

    <p class="phase-indicator">
      当前阶段：<code>{{ currentPhase || '等待开始' }}</code>
      <small v-if="doneCount">（{{ doneCount }}/{{ plugins.length }} 已完成）</small>
    </p>

    <button
      :disabled="plugins.some((p) => p.state === 'running')"
      @click="runBuild"
    >
      模拟构建
    </button>
  </div>
</template>

<style scoped>
.plugin-pipeline {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 1rem 0;
}

.plugin-step {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border, #ddd);
  transition: border-color 0.2s, background 0.2s;
}

.plugin-step.running {
  border-color: #e8713a;
  background: rgba(232, 113, 58, 0.06);
}

.plugin-step.done {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.06);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-icon {
  width: 1.2rem;
  text-align: center;
}

.step-action {
  margin: 0.3rem 0 0 1.7rem;
  font-size: 0.85rem;
  color: #666;
}

.phase-indicator {
  margin: 0.8rem 0;
  font-size: 0.9rem;
}

.phase-indicator code {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1em 0.4em;
  border-radius: 3px;
}
</style>
