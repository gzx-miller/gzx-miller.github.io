const n=`// 流式界面：把图的执行事件接到前端 UI
// 场景：Vue 聊天页——token 边生成边显示，节点进度实时可见
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0, streaming: true }),
  tools: [
    tool(async ({ keyword }) => \`检索到 3 门「\${keyword}」课程\`, {
      name: 'search_courses',
      description: '搜索课程库',
      schema: z.object({ keyword: z.string() }),
    }),
  ],
  prompt: '你是课程助手，回答前先检索课程库。',
})

// 示例1: messages 模式——逐 token 输出模型生成内容，接打字机效果
const tokenStream = await agent.stream(
  { messages: [new HumanMessage('推荐三门 Vue3 课程')] },
  { streamMode: 'messages' },
)

for await (const [messageChunk, meta] of tokenStream) {
  // meta.langgraph_node 标注这段 token 出自哪个节点
  if (meta?.langgraph_node === 'agent' && typeof messageChunk.content === 'string') {
    process.stdout.write(messageChunk.content)
  }
}

// 示例2: updates 模式——节点级进度，适合渲染「正在检索…」这类步骤条
const updateStream = await agent.stream(
  { messages: [new HumanMessage('推荐三门 Vue3 课程')] },
  { streamMode: 'updates' },
)

for await (const chunk of updateStream) {
  const [nodeName, update] = Object.entries(chunk)[0] as [string, any]
  const hasToolCall = (update.messages ?? []).some((m: any) => m.tool_calls?.length)
  console.log(\`[进度] \${nodeName} \${hasToolCall ? '→ 决定调用工具' : '→ 产出消息'}\`)
}

// 示例3: 两种模式同时订阅——LLM 只要一份输出，UI 可以两路都用
// （真实项目用 stream 组合模式数组，这里演示各自用法）

// 示例4: HTTP 转发——服务端把事件流转成 SSE，前端 EventSource 消费
// 服务端（Node 侧）：
//   for await (const event of updateStream) res.write(\`data: \${JSON.stringify(event)}\\n\\n\`)
// Vue 前端：
//   const es = new EventSource('/api/chat/stream')
//   es.onmessage = (e) => appendToken(JSON.parse(e.data))

// 示例5: 前端状态设计——把事件映射成三种 UI 状态
type UiEvent =
  | { kind: 'nodeStart'; node: string } // 步骤条：点亮节点
  | { kind: 'token'; text: string } // 气泡：追加文字
  | { kind: 'done' } // 收尾：移除「停止」按钮

function toUiEvent(nodeName: string, update: any): UiEvent[] {
  if (nodeName === 'tools') return [{ kind: 'nodeStart', node: '检索课程库' }]
  const token = (update.messages ?? []).map((m: any) => m.content).join('')
  return token ? [{ kind: 'token', text: token }] : []
}

// 示例6: 边界处理
// - 停止生成：AbortController 中断 stream 迭代，避免用户等完
// - 错误事件：try/catch 包住 for await，断流时降级为整段轮询
// - 顺序保证：两种流可能交错到达，UI 用同一事件序号时间线对齐
console.log(toUiEvent('tools', {}))
`;export{n as default};
