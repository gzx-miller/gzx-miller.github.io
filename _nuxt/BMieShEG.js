const n=`import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { ChatPromptTemplate } from '@langchain/core/prompts'

// 示例1: 定义工具
const searchTool = tool(
  async ({ query }) => {
    // 模拟搜索结果
    const mockResults: Record<string, string> = {
      'LangChain': 'LangChain 是一个用于开发 LLM 应用的开源框架，支持 Python 和 JavaScript。',
      'OpenAI': 'OpenAI 是一家人工智能研究公司，开发了 GPT 系列模型。',
      'RAG': 'RAG (检索增强生成) 是一种结合检索和生成的技术，可以提升 LLM 回答的准确性。',
    }
    return mockResults[query] || \`未找到关于"\${query}"的信息\`
  },
  {
    name: 'web_search',
    description: '搜索网络获取信息。当你需要回答实时性问题或不了解的知识时使用。',
    schema: z.object({
      query: z.string().describe('搜索关键词'),
    }),
  }
)

const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = eval(expression)
      return \`计算结果: \${result}\`
    } catch (e) {
      return '计算错误，请检查表达式'
    }
  },
  {
    name: 'calculator',
    description: '进行数学计算。当你需要做加减乘除等数学运算时使用。',
    schema: z.object({
      expression: z.string().describe('数学表达式，如 "2 + 3 * 4"'),
    }),
  }
)

const tools = [searchTool, calculatorTool]

// 示例2: 创建 ReAct Agent
const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个 helpful 的助手。你可以使用工具来帮助回答问题。'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],
])

const agent = createToolCallingAgent({
  llm: model,
  tools,
  prompt,
})

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true, // 显示思考过程
  maxIterations: 5, // 最大迭代次数，防止无限循环
})

// 示例3: 简单问题（不需要工具）
const result1 = await agentExecutor.invoke({
  input: '你好，请介绍一下你自己',
})
console.log('回答:', result1.output)

// 示例4: 需要搜索的问题
const result2 = await agentExecutor.invoke({
  input: 'LangChain 是什么？',
})
console.log('回答:', result2.output)

// 示例5: 需要计算的问题
const result3 = await agentExecutor.invoke({
  input: '123 乘以 456 等于多少？',
})
console.log('回答:', result3.output)

// 示例6: 多步骤推理问题
const result4 = await agentExecutor.invoke({
  input: 'RAG 是什么？用一句话解释，然后计算 15 的平方是多少？',
})
console.log('回答:', result4.output)

// 示例7: 流式输出 Agent 执行过程
const stream = await agentExecutor.stream({
  input: '搜索 LangChain 的信息，然后用一句话总结',
})

for await (const step of stream) {
  if (step.messages) {
    step.messages.forEach((msg: any) => {
      if (msg._getType() === 'ai' && msg.tool_calls) {
        console.log('工具调用:', msg.tool_calls)
      } else if (msg._getType() === 'tool') {
        console.log('工具结果:', msg.content.slice(0, 50))
      }
    })
  }
  if (step.output) {
    console.log('最终答案:', step.output)
  }
}`;export{n as default};
