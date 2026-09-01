const e=`<script setup lang="ts">
import { computed, ref } from 'vue'

type ParserType = 'string' | 'list' | 'structured'

const activeParser = ref<ParserType>('structured')

const rawOutput = \`以下是推荐的三门课程：

1. Vue3 组合式 API 实战 - 适合有 Vue2 基础的开发者
2. TypeScript 类型体操 - 深入理解高级类型
3. 前端工程化实践 - 构建到部署全流程\`

// StringOutputParser: 直接提取 AIMessage.content 纯文本
// OutputParser + Zod: 用 Zod schema 定义结构，让 LLM 按 schema 输出
const parsedResults: Record<ParserType, { label: string; data: unknown }> = {
  string: {
    label: 'StringOutputParser',
    data: rawOutput,
  },
  list: {
    label: 'Zod array 解析',
    data: ['Vue3 组合式 API 实战', 'TypeScript 类型体操', '前端工程化实践'],
  },
  structured: {
    label: 'StructuredOutputParser (Zod)',
    data: [
      { name: 'Vue3 组合式 API 实战', level: '中级', audience: '有 Vue2 基础' },
      { name: 'TypeScript 类型体操', level: '高级', audience: '有 TS 基础' },
      { name: '前端工程化实践', level: '中级', audience: '前端开发者' },
    ],
  },
}

const currentResult = computed(() => parsedResults[activeParser.value])

const zodSchema = \`z.array(z.object({
  name: z.string().describe("课程名称"),
  level: z.enum(["初级","中级","高级"]),
  audience: z.string().describe("适合人群"),
}))\`
<\/script>

<template>
  <div class="demo-card">
    <h3>输出解析器</h3>
    <div class="parser-tabs">
      <button v-for="key in (['string', 'list', 'structured'] as ParserType[])" :key="key" :class="{ active: activeParser === key }" @click="activeParser = key">
        {{ key === 'string' ? 'String' : key === 'list' ? 'List (Zod)' : 'Structured (Zod)' }}
      </button>
    </div>
    <div class="parser-columns">
      <div class="parser-col">
        <h4>LLM 原始输出</h4>
        <pre class="raw-output">{{ rawOutput }}</pre>
      </div>
      <div class="parser-arrow">→</div>
      <div class="parser-col">
        <h4>{{ currentResult.label }} 解析结果</h4>
        <pre class="parsed-output">{{ JSON.stringify(currentResult.data, null, 2) }}</pre>
      </div>
    </div>
    <div v-if="activeParser === 'structured'" class="zod-schema">
      <h4>对应 Zod Schema</h4>
      <pre>{{ zodSchema }}</pre>
    </div>
  </div>
</template>

<style scoped>
.parser-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.parser-tabs button { padding: 6px 14px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 13px; }
.parser-tabs button.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.parser-columns { display: flex; gap: 12px; align-items: flex-start; }
.parser-col { flex: 1; }
.parser-col h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.parser-arrow { font-size: 24px; color: #c8703c; padding-top: 28px; }
.raw-output { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 6px; padding: 10px; font-size: 12px; line-height: 1.6; white-space: pre-wrap; margin: 0; color: #5a3e2b; }
.parsed-output { background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 6px; padding: 10px; font-size: 12px; line-height: 1.6; white-space: pre-wrap; margin: 0; color: #2d5a3a; }
.zod-schema { margin-top: 12px; background: #f0f7f2; border: 1px solid #a8d5b8; border-radius: 8px; padding: 12px; }
.zod-schema h4 { margin: 0 0 8px; color: #2d5a3a; font-size: 14px; }
.zod-schema pre { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #2d5a3a; }
</style>
`;export{e as default};
