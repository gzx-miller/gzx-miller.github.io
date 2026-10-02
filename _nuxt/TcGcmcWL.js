const n=`<script setup lang="ts">
import { ref } from 'vue'

interface Tool {
  name: string
  description: string
  schema: Record<string, string>
  mockCall: (input: string) => string
}

const tools: Tool[] = [
  {
    name: 'search',
    description: '搜索互联网获取最新信息',
    schema: { query: 'string - 搜索关键词' },
    mockCall: (input: string) => \`搜索结果：找到 3 条关于"\${input}"的相关信息。1. 官方文档说明... 2. 社区讨论... 3. 最佳实践...\`,
  },
  {
    name: 'calculator',
    description: '执行数学计算',
    schema: { expression: 'string - 数学表达式' },
    mockCall: (input: string) => {
      // 安全的简单计算模拟（仅支持数字和基本运算符）
      const safe = /^[\\d\\s+\\-*/().]+$/.test(input)
      if (!safe) return '计算错误：仅支持数字和基本运算符 + - * / ( )'
      try {
        const result = new Function('return ' + input)()
        return \`计算结果：\${input} = \${result}\`
      } catch {
        return '计算错误：请输入有效的数学表达式'
      }
    },
  },
  {
    name: 'weather',
    description: '查询指定城市的天气信息',
    schema: { city: 'string - 城市名称' },
    mockCall: (input: string) => \`\${input}今天：晴，温度 22°C，湿度 45%，微风\`,
  },
]

const selectedTool = ref(tools[0])
const toolInput = ref('')
const toolOutput = ref('')

function callTool() {
  if (!toolInput.value.trim()) return
  toolOutput.value = selectedTool.value.mockCall(toolInput.value)
}

const codeExample = \`// LangChain.js 推荐使用 tool 函数定义工具
import { tool } from '@langchain/core/tools'
import { z } from 'zod'

const searchTool = tool(async ({ query }) => {
  // 实际调用搜索 API
  return searchResults
}, {
  name: 'search',
  description: '搜索互联网获取最新信息',
  schema: z.object({
    query: z.string().describe('搜索关键词'),
  }),
})\`
<\/script>

<template>
  <div class="demo-card">
    <h3>工具调用模拟</h3>
    <div class="tool-list">
      <button v-for="tool in tools" :key="tool.name" class="tool-btn" :class="{ active: selectedTool.name === tool.name }" @click="selectedTool = tool; toolOutput = ''">
        {{ tool.name }}
      </button>
    </div>
    <div class="tool-detail">
      <div class="tool-info">
        <h4>{{ selectedTool.name }}</h4>
        <p>{{ selectedTool.description }}</p>
        <div class="tool-schema">
          <strong>参数 Schema:</strong>
          <pre>{{ JSON.stringify(selectedTool.schema, null, 2) }}</pre>
        </div>
      </div>
      <div class="tool-call">
        <input v-model="toolInput" :placeholder="Object.keys(selectedTool.schema)[0]" @keyup.enter="callTool" />
        <button @click="callTool">调用</button>
        <div v-if="toolOutput" class="tool-result">
          <small>输出</small>
          <p>{{ toolOutput }}</p>
        </div>
      </div>
    </div>
    <div class="code-example">
      <h4>tool 函数定义方式</h4>
      <pre>{{ codeExample }}</pre>
    </div>
  </div>
</template>

<style scoped>
.tool-list { display: flex; gap: 8px; margin-bottom: 12px; }
.tool-btn { padding: 6px 14px; border: 1px solid #d4a574; border-radius: 4px; background: #fef9f3; cursor: pointer; font-size: 13px; }
.tool-btn.active { background: #c8703c; color: #fff; border-color: #c8703c; }
.tool-detail { display: flex; gap: 16px; margin-bottom: 12px; }
.tool-info { flex: 1; background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.tool-info h4 { margin: 0 0 6px; color: #c8703c; }
.tool-info p { margin: 0 0 8px; font-size: 13px; color: #5a3e2b; }
.tool-schema strong { font-size: 12px; color: #8b5e3c; }
.tool-schema pre { margin: 4px 0 0; font-size: 12px; background: #fff; padding: 8px; border-radius: 4px; color: #2d5a3a; }
.tool-call { flex: 1; }
.tool-call input { width: 100%; padding: 8px; border: 1px solid #d4a574; border-radius: 4px; margin-bottom: 8px; box-sizing: border-box; }
.tool-call button { padding: 6px 16px; background: #c8703c; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.tool-result { margin-top: 8px; padding: 10px; background: #f0f7f2; border-radius: 6px; border-left: 3px solid #6b9e78; }
.tool-result small { color: #6b9e78; font-size: 11px; }
.tool-result p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #2d5a3a; }
.code-example { background: #fef9f3; border: 1px solid #e8c9a0; border-radius: 8px; padding: 12px; }
.code-example h4 { margin: 0 0 8px; color: #8b5e3c; font-size: 14px; }
.code-example pre { margin: 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; color: #5a3e2b; }
</style>
`;export{n as default};
