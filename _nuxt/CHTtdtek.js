const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

type Mode = 'basic' | 'param'
type Line = { text: string; type: string }

const basicSteps: Line[] = [
  { text: "调用 log_decorator(my_func)", type: '' },
  { text: "  → 返回内部函数 wrapper（原函数被包住）", type: '' },
  { text: "调用 my_func() —— 实际执行的是 wrapper", type: 'warning' },
  { text: "[wrapper] 进入：打印 before 日志", type: 'success' },
  { text: "  wrapper 内部调用真正的 my_func(body)", type: 'success' },
  { text: "  函数体：my_func 正在工作", type: 'success' },
  { text: "[wrapper] 退出：打印 after 日志", type: 'success' },
  { text: "返回原函数的返回值，调用结束", type: '' },
]

const paramSteps: Line[] = [
  { text: "调用 repeat(2)", type: '' },
  { text: "  → 返回 decorator（记住参数 n=2）", type: '' },
  { text: "调用 decorator(my_func) —— 这个函数是装饰器本身", type: '' },
  { text: "  → 返回内部函数 wrapper（闭包记住了 n）", type: '' },
  { text: "调用 my_func() —— 实际执行的是 wrapper", type: 'warning' },
  { text: "  wrapper 内部循环 2 次", type: 'success' },
  { text: "  第 1 次：my_func 工作", type: 'success' },
  { text: "  第 2 次：my_func 工作", type: 'success' },
  { text: "返回最后一次的结果，调用结束", type: '' },
]

const codeByMode: Record<Mode, string> = {
  basic: \`def log_decorator(func):
    def wrapper(*args, **kwargs):
        print("before")
        result = func(*args, **kwargs)
        print("after")
        return result
    return wrapper

@log_decorator
def my_func():
    print("my_func 正在工作")

my_func()\`,
  param: \`def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(2)
def my_func():
    print("my_func 工作")

my_func()\`,
}

const mode = ref<Mode>('basic')
const step = ref(0)

const steps = computed<Line[]>(() => (mode.value === 'basic' ? basicSteps : paramSteps))
const revealed = computed(() => steps.value.slice(0, step.value))
const done = computed(() => step.value >= steps.value.length)

function switchMode(next: Mode) {
  mode.value = next
  step.value = 0
}

function nextStep() {
  if (step.value < steps.value.length) step.value += 1
}

function reset() {
  step.value = 0
}
<\/script>

<template>
  <div class="demo-container">
    <div class="demo-card">
      <h4>装饰器：逐行跟踪包裹过程</h4>
      <p class="hint">点「下一步」单步执行，看装饰器如何一层层把函数包起来。</p>

      <div class="tab-bar" style="margin-top: 10px;">
        <button class="tab-btn" :class="{ active: mode === 'basic' }" @click="switchMode('basic')">基础装饰器</button>
        <button class="tab-btn" :class="{ active: mode === 'param' }" @click="switchMode('param')">带参数的装饰器</button>
      </div>

      <pre class="mini-code">{{ codeByMode[mode] }}</pre>

      <div class="row" style="margin-top: 10px;">
        <button class="mini-btn" @click="nextStep" :disabled="done">下一步</button>
        <button class="mini-btn" @click="reset">重置</button>
        <span class="badge" :class="done ? 'success' : ''">
          {{ done ? '执行完成' : \`第 \${step} / \${steps.length} 步\` }}
        </span>
      </div>

      <div class="log-panel" style="margin-top: 10px;">
        <p v-for="(line, index) in revealed" :key="index" class="log-line" :class="line.type">{{ line.text }}</p>
        <p v-if="!revealed.length" class="hint">还没有开始，点击「下一步」观察装饰器的包裹与调用顺序。</p>
      </div>

      <div class="tips-box">
        <strong>带参数的装饰器</strong>比基础版多一层嵌套：最外层 <code>repeat(n)</code> 收参数并返回 <code>decorator</code>，
        <code>decorator</code> 再收函数返回 <code>wrapper</code>。三层分别对应「配置」「接入原函数」「真正执行」。
      </div>
    </div>
  </div>
</template>
`;export{e as default};
