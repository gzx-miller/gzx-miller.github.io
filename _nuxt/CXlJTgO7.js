const n=`// LangGraph 快速入门：第一个 ReAct Agent
// 场景：课程咨询助手——根据学生问题自动决定是否检索课程库
import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

// 示例1: 用 tool + Zod 定义可被模型调用的工具
const searchCourses = tool(
  async ({ keyword }) => {
    // 真实项目在这里查询课程数据库或向量库
    return \`找到 3 门与「\${keyword}」相关的课程：Vue3 入门、Vue3 组件通信、Vue3 组合式 API\`
  },
  {
    name: 'search_courses',
    description: '按关键词搜索课程库，返回匹配的课程列表',
    schema: z.object({
      keyword: z.string().describe('要搜索的课程关键词'),
    }),
  },
)

// 示例2: 创建模型实例
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例3: createAgent 一步组装「模型 + 工具 + 系统提示词」
// 它是 LangChain 的 Agent 抽象，构建在 LangGraph 之上：模型节点与工具节点之间循环流转
const agent = createAgent({
  model,
  tools: [searchCourses],
  systemPrompt: '你是一名课程咨询助手。回答课程问题前先调用 search_courses 检索课程库。',
})

// 示例4: invoke 执行完整 ReAct 循环，拿到最终回答
const result = await agent.invoke({
  messages: [new HumanMessage('有没有适合入门的 Vue3 课程？')],
})
console.log('最终回答:', result.messages.at(-1)?.content)

// 示例5: stream 逐步观察「思考 → 行动 → 观察」的每一步
// 模型先产出一条带 tool_calls 的 AIMessage（决定调用 search_courses），
// 框架执行工具后把 ToolMessage 追加回消息列表，再让模型继续推理。
const stream = await agent.stream(
  { messages: [new HumanMessage('有没有适合入门的 Vue3 课程？')] },
  { streamMode: 'updates' },
)

for await (const chunk of stream) {
  const [nodeName, update] = Object.entries(chunk)[0] as [string, any]
  console.log(\`[节点] \${nodeName}\`)
  for (const msg of update.messages ?? []) {
    if (msg.tool_calls?.length) {
      console.log('  决定调用工具:', msg.tool_calls.map((c: any) => c.name).join(', '))
    } else {
      console.log('  消息:', String(msg.content).slice(0, 60))
    }
  }
}

// 示例6: ReAct 循环产出的完整消息序列
// HumanMessage → AIMessage(带 tool_calls) → ToolMessage(工具结果) → AIMessage(最终回答)
const sequence = result.messages.map((m: any) => m.constructor.name)
console.log('消息序列:', sequence.join(' → '))
`;export{n as default};
