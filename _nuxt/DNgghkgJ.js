const n=`import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

// 示例1: 基础调用 - 创建 ChatOpenAI 实例并调用 invoke
const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
})

const response = await model.invoke([
  new SystemMessage('你是一个 helpful 的 AI 助手。'),
  new HumanMessage('什么是 LangChain?'),
])
console.log(response.content)

// 示例2: 配置不同温度参数
const creativeModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 1.0, // 高温度，输出更随机
})

const preciseModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0, // 低温度，输出更确定
})

// 示例3: 流式输出 stream
const streamModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.5,
})

const stream = await streamModel.stream([
  new HumanMessage('写一首关于编程的短诗'),
])

let fullText = ''
for await (const chunk of stream) {
  fullText += chunk.content
  console.log('收到 token:', chunk.content)
}

// 示例4: 批量调用 batch
const batchModel = new ChatOpenAI({ model: 'gpt-4o-mini' })
const batchResponses = await batchModel.batch([
  [new HumanMessage('1+1等于几?')],
  [new HumanMessage('2+2等于几?')],
  [new HumanMessage('3+3等于几?')],
])
batchResponses.forEach((res, i) => {
  console.log(\`问题\${i + 1}: \${res.content}\`)
})

// 示例5: 使用字符串消息（简化写法）
const simpleModel = new ChatOpenAI({ model: 'gpt-4o-mini' })
const simpleResponse = await simpleModel.invoke('你好，请用一句话介绍自己')
console.log(simpleResponse.content)`;export{n as default};
