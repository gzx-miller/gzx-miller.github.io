<script setup lang="ts">
import { ref, computed } from 'vue'

type StepState = 'pending' | 'running' | 'passed' | 'failed'

interface E2EStep {
  action: string
  selector: string
  assertion: string
  state: StepState
}

const steps = ref<E2EStep[]>([
  { action: '打开报名页', selector: 'page.goto("/signup")', assertion: '页面标题包含"报名"', state: 'pending' },
  { action: '填写姓名', selector: 'getByLabel("姓名")', assertion: '输入框可见且可编辑', state: 'pending' },
  { action: '选择课程', selector: 'getByRole("combobox")', assertion: '下拉列表出现至少 2 个选项', state: 'pending' },
  { action: '提交表单', selector: 'getByRole("button", { name: "提交" })', assertion: '点击后出现成功提示', state: 'pending' },
  { action: '验证结果', selector: 'getByRole("status")', assertion: '文本包含"报名成功"', state: 'pending' },
])

const failAt = ref<number>(-1)
const finished = computed(() => steps.value.every((s) => s.state === 'passed' || s.state === 'failed'))
const passedCount = computed(() => steps.value.filter((s) => s.state === 'passed').length)

async function runTest() {
  steps.value.forEach((s) => (s.state = 'pending'))

  for (let i = 0; i < steps.value.length; i++) {
    steps.value[i].state = 'running'
    await new Promise((r) => setTimeout(r, 200))

    if (i === failAt.value) {
      steps.value[i].state = 'failed'
      return
    }
    steps.value[i].state = 'passed'
  }
}
</script>

<template>
  <div class="demo-card">
    <p class="demo-hint">端到端测试从用户视角编排完整流程。设置一个失败步骤，观察测试如何精确定位问题。</p>

    <label class="fail-selector">
      模拟失败步骤：
      <select v-model.number="failAt">
        <option :value="-1">全部通过</option>
        <option v-for="(step, i) in steps" :key="i" :value="i">{{ i + 1 }}. {{ step.action }}</option>
      </select>
    </label>

    <ol class="e2e-steps">
      <li
        v-for="(step, i) in steps"
        :key="i"
        class="e2e-step"
        :class="step.state"
      >
        <div class="step-row">
          <span class="step-badge">{{ step.state === 'passed' ? '✓' : step.state === 'failed' ? '×' : step.state === 'running' ? '…' : (i + 1) }}</span>
          <strong>{{ step.action }}</strong>
        </div>
        <code class="step-selector-text">{{ step.selector }}</code>
        <p class="step-assertion">断言：{{ step.assertion }}</p>
        <p v-if="step.state === 'failed'" class="step-error">选择器未匹配或断言失败，测试在此停止。</p>
      </li>
    </ol>

    <p v-if="finished" class="test-result" :class="passedCount === steps.length ? 'all-pass' : 'has-fail'">
      {{ passedCount === steps.length ? `全部 ${passedCount} 步通过` : `${passedCount}/${steps.length} 步通过，定位到失败步骤` }}
    </p>

    <button
      :disabled="steps.some((s) => s.state === 'running')"
      @click="runTest"
    >
      运行 E2E 测试
    </button>
  </div>
</template>

<style scoped>
.fail-selector {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.fail-selector select {
  margin-left: 0.5rem;
}

.e2e-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.e2e-step {
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid var(--border, #ddd);
  transition: border-color 0.2s, background 0.2s;
}

.e2e-step.running {
  border-color: #e8713a;
  background: rgba(232, 113, 58, 0.06);
}

.e2e-step.passed {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.05);
}

.e2e-step.failed {
  border-color: #e53935;
  background: rgba(229, 57, 53, 0.06);
}

.step-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-badge {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.passed .step-badge { background: #4caf50; color: #fff; }
.failed .step-badge { background: #e53935; color: #fff; }

.step-selector-text {
  display: block;
  margin: 0.2rem 0 0 1.9rem;
  font-size: 0.8rem;
  color: #777;
}

.step-assertion {
  margin: 0.2rem 0 0 1.9rem;
  font-size: 0.85rem;
}

.step-error {
  margin: 0.4rem 0 0 1.9rem;
  font-size: 0.85rem;
  color: #e53935;
}

.test-result {
  margin: 0.8rem 0;
  font-weight: 600;
}

.all-pass { color: #4caf50; }
.has-fail { color: #e53935; }
</style>
