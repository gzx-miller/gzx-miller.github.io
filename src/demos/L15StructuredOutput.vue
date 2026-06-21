<script setup>
import { ref, computed } from 'vue'

const mode = ref('json')
const rawText = `{ "title": "Vue3 组合式 API", "teacher": "李老师", "duration": 45, "tags": ["Vue3", "Composition API", "前端"] }`
const parsed = { title: 'Vue3 组合式 API', teacher: '李老师', duration: 45, tags: ['Vue3', 'Composition API', '前端'] }
const parseError = ref(false)

const display = computed(() => {
  if (parseError.value) return '❌ Zod 校验失败：duration 必须为 number，tags 必须为 string[]'
  return mode.value === 'json'
    ? JSON.stringify(parsed, null, 2)
    : `Function: extract_course\nArgs: ${JSON.stringify(parsed)}`
})

const schemaCode = `import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'

const courseSchema = z.object({
  title:    z.string().describe('课程名称'),
  teacher:  z.string().describe('讲师姓名'),
  duration: z.number().describe('时长（分钟）'),
  tags:     z.array(z.string()).describe('标签列表'),
})

const llm = new ChatOpenAI({ model: 'gpt-4o-mini' })

// JSON 模式：withStructuredOutput 内部选 JSON mode
const structuredLlm = llm.withStructuredOutput(courseSchema)
const result = await structuredLlm.invoke('提取课程信息')

// Function Calling 模式：显式指定 method
const fnLlm = llm.withStructuredOutput(courseSchema, { method: 'functionCalling' })
const fnResult = await fnLlm.invoke('提取课程信息')`
</script>

<template>
  <div class="demo-card">
    <h3>结构化输出与 Zod</h3>
    <div class="mode-row">
      <button :class="{ active: mode === 'json' }" @click="mode = 'json'">JSON Mode</button>
      <button :class="{ active: mode === 'fn' }" @click="mode = 'fn'">Function Calling</button>
      <button class="err-btn" :class="{ active: parseError }" @click="parseError = !parseError">模拟校验失败</button>
    </div>
    <div class="panels">
      <div class="panel raw-panel">
        <span class="label">LLM 原始文本</span>
        <pre>{{ rawText }}</pre>
      </div>
      <div class="arrow">→</div>
      <div class="panel result-panel" :class="{ error: parseError }">
        <span class="label">{{ parseError ? 'Zod 校验结果' : (mode === 'json' ? 'JSON Mode 解析结果' : 'Function Calling 解析结果') }}</span>
        <pre>{{ display }}</pre>
      </div>
    </div>
    <div class="code-section">
      <h4>Zod Schema + withStructuredOutput</h4>
      <pre class="code-block">{{ schemaCode }}</pre>
    </div>
  </div>
</template>

<style scoped>
.mode-row { display: flex; gap: 8px; margin-bottom: 12px; }
.mode-row button { padding: 6px 14px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 13px; }
.mode-row button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.err-btn.active { background: #c8503c !important; border-color: #c8503c !important; }
.panels { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.panel { flex: 1; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 6px; padding: 12px; }
.panel pre { margin: 6px 0 0; font-size: 12px; line-height: 1.6; color: #5a3e2b; white-space: pre-wrap; }
.label { font-size: 11px; font-weight: bold; color: #8b5e3c; }
.arrow { font-size: 22px; color: #c8703c; }
.result-panel.error { border-color: #c8503c; background: #fef0ee; }
.result-panel.error pre { color: #c8503c; }
.code-section { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-section h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-block { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
