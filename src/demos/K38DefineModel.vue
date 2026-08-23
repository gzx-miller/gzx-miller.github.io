<script setup lang="ts">
import { computed } from 'vue'

// defineModel 是 Vue 3.4 起提供的编译器宏：让自定义组件像原生表单一样被 v-model 绑定，
// 却无需再手写 modelValue/命名 prop 与 update:xxx 事件。
// 每个 defineModel() 声明都会自动生成对应的 prop 与 update 事件。
const enabled = defineModel<boolean>('enabled', { default: false })
const frequency = defineModel<number>('frequency', { default: 1 })

// 解构出第二个返回值即可读取修饰符：父组件写 v-model:label.trim 时，这里得到 { trim: true }。
const [label, labelModifiers] = defineModel<string>('label', { default: '' })

const frequencyOptions = [
  { value: 1, text: '每天' },
  { value: 2, text: '每周' },
  { value: 3, text: '每月' },
]

const frequencyText = computed(() => frequencyOptions.find((o) => o.value === frequency.value)?.text ?? '—')

function onLabelInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  // 修饰符在组件内部处理，父组件无需重复 trim。
  label.value = labelModifiers?.trim ? raw.trim() : raw
}
</script>

<template>
  <div class="demo-card">
    <section class="panel">
      <header class="panel-head">
        <h3>课程提醒设置</h3>
        <span class="pill">defineModel</span>
      </header>

      <div class="field">
        <label class="switch">
          <input v-model="enabled" type="checkbox" />
          <span>开启学习提醒</span>
        </label>
        <span class="hint">绑定 v-model:enabled</span>
      </div>

      <div class="field">
        <span class="field-label">提醒频率</span>
        <div class="button-row">
          <label v-for="opt in frequencyOptions" :key="opt.value" class="radio">
            <input v-model="frequency" type="radio" :value="opt.value" />
            <span>{{ opt.text }}</span>
          </label>
        </div>
        <span class="hint">绑定 v-model:frequency</span>
      </div>

      <div class="field">
        <label class="text-field">
          <span class="field-label">备注</span>
          <input :value="label" @input="onLabelInput" placeholder="给提醒加个备注" />
        </label>
        <span class="hint">绑定 v-model:label.trim</span>
      </div>

      <footer class="summary">
        当前状态：提醒{{ enabled ? '已开启' : '已关闭' }} · {{ frequencyText }} · 备注「{{ label || '无' }}」
      </footer>
    </section>

    <section class="panel">
      <h4>父组件用法</h4>
      <pre class="code-block">&lt;CourseReminder
  v-model:enabled="reminder.enabled"
  v-model:frequency="reminder.frequency"
  v-model:label.trim="reminder.label"
/&gt;</pre>
    </section>
  </div>
</template>

<style scoped>
.panel {
  display: grid;
  gap: 14px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel h3 {
  margin: 0;
  color: var(--chestnut);
}
.panel h4 {
  margin: 0 0 4px;
  color: var(--chestnut);
}
.pill {
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
}
.field {
  display: grid;
  gap: 6px;
}
.field-label {
  color: var(--muted);
  font-size: 13px;
}
.switch,
.radio {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.switch input,
.radio input {
  accent-color: var(--accent);
}
.hint {
  color: var(--muted);
  font-size: 12px;
}
.text-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
}
.summary {
  border-top: 1px dashed var(--border);
  padding-top: 12px;
  color: var(--accent-strong);
  font-size: 14px;
}
.code-block {
  margin: 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
}
</style>