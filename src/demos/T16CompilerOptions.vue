<script setup lang="ts">
import { ref, computed } from 'vue'

const options = ref({
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
})

const target = ref<'ES5' | 'ES2015' | 'ESNext'>('ESNext')
const moduleRes = ref<'node' | 'bundler'>('bundler')

interface OptionEffect {
  code: string
  pass: string
  fail: string
}

const effects: Record<string, OptionEffect> = {
  strict: {
    code: 'function greet(name) { return "Hi " + name }',
    pass: '开启 strict 后，所有严格检查子项自动启用',
    fail: '关闭 strict 时，隐式 any 和 null 检查均被放宽',
  },
  noImplicitAny: {
    code: 'function add(a, b) { return a + b }',
    pass: '参数缺少类型注解 → 报错：implicitly has an any type',
    fail: '关闭后参数默认为 any，不会报错',
  },
  strictNullChecks: {
    code: 'const el: HTMLElement | null = document.getElementById("app")\nel.textContent = "hello"',
    pass: '严格空检查开启时，直接访问可空对象会报错',
    fail: '关闭后 null/undefined 可赋给任意类型',
  },
}

const activeOption = ref<keyof typeof options.value>('strict')

const currentEffect = computed(() => effects[activeOption.value])

const resultText = computed(() => {
  const on = options.value[activeOption.value]
  const eff = currentEffect.value
  return on ? eff.pass : eff.fail
})
</script>

<template>
  <div class="demo-card">
    <h4>tsconfig 编译配置探索器</h4>

    <div class="button-row">
      <button
        v-for="(_, key) in options"
        :key="key"
        :class="{ active: activeOption === key }"
        @click="activeOption = key"
      >
        {{ key }}
      </button>
    </div>

    <label class="toggle-row">
      <input type="checkbox" v-model="options[activeOption]" />
      {{ activeOption }}: {{ options[activeOption] ? '开启' : '关闭' }}
    </label>

    <pre class="code-block">{{ currentEffect.code }}</pre>
    <p :class="options[activeOption] ? 'text-error' : 'text-ok'">{{ resultText }}</p>

    <div class="extra-options">
      <label>target：<select v-model="target">
        <option value="ES5">ES5</option>
        <option value="ES2015">ES2015</option>
        <option value="ESNext">ESNext</option>
      </select></label>
      <label>moduleResolution：<select v-model="moduleRes">
        <option value="node">node</option>
        <option value="bundler">bundler</option>
      </select></label>
    </div>

    <small>strict 是多个子选项的总开关；target 决定输出 JS 版本，moduleResolution 决定模块查找策略</small>
  </div>
</template>
