const e=`// 条件路由：用 addConditionalEdges 与 Command 决定下一跳
// 场景：内容质检——不通过回炉重写，通过后生成摘要，超过重试上限强制收尾
import { StateGraph, StateSchema, MessagesValue, START, END, Command } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const MAX_ATTEMPTS = 3

// ═══ 1. 状态：质检流程需要的字段 ═══
// messages 用 MessagesValue，模型回复会按 reducer 追加而不是覆盖
const ReviewState = new StateSchema({
  messages: MessagesValue,
  topic: z.string(),
  outline: z.string().default(''),
  draft: z.string().default(''),
  summary: z.string().default(''),
  attempts: z.number().default(0),
  passed: z.boolean().default(false),
})

// ═══ 2. 节点函数：只读状态、返回局部更新 ═══
async function outlineNode(state: typeof ReviewState.State) {
  const response = await model.invoke(\`为「\${state.topic}」生成三级课程大纲\`)
  return {
    outline: String(response.content),
    messages: [response],
  }
}

async function contentNode(state: typeof ReviewState.State) {
  const response = await model.invoke(
    \`根据大纲写课程正文，这是第 \${state.attempts + 1} 稿：\\n\${state.outline}\`,
  )
  return {
    draft: String(response.content),
    attempts: state.attempts + 1,
    messages: [response],
  }
}

async function reviewNode(state: typeof ReviewState.State) {
  // 质检只看状态，不调用模型，保证同一份状态得到同一个结论
  const passed = state.draft.length >= 500
  return { passed }
}

async function summaryNode(state: typeof ReviewState.State) {
  const response = await model.invoke(\`为以下正文写 100 字摘要：\\n\${state.draft}\`)
  return {
    summary: String(response.content),
    messages: [response],
  }
}

// ═══ 3. 路由函数：纯函数，返回字面量联合类型 ═══
type ReviewRoute = 'content' | 'summary' | typeof END

function routeAfterReview(state: typeof ReviewState.State): ReviewRoute {
  if (state.passed) return 'summary'
  if (state.attempts >= MAX_ATTEMPTS) return END
  return 'content'
}

// ═══ 4. 条件边版本：出口全部写在路径映射里 ═══
const graph = new StateGraph(ReviewState)
  .addNode('outline', outlineNode)
  .addNode('content', contentNode)
  .addNode('review', reviewNode)
  .addNode('summary', summaryNode)
  .addEdge(START, 'outline')
  .addEdge('outline', 'content')
  .addEdge('content', 'review')
  .addConditionalEdges('review', routeAfterReview, {
    content: 'content',
    summary: 'summary',
    [END]: END,
  })
  .addEdge('summary', END)

const app = graph.compile()

// ═══ 5. 执行：recursionLimit 只是防失控，不是业务重试上限 ═══
const result = await app.invoke(
  { topic: 'LangGraph 条件路由', messages: [] },
  { recursionLimit: 12 },
)

console.log('摘要：', result.summary)
console.log('尝试次数：', result.attempts)
console.log('是否通过：', result.passed)

// ═══ 6. 用 updates 流观察每次路由走了哪条边 ═══
for await (const step of await app.stream(
  { topic: 'LangGraph 条件路由', messages: [] },
  { streamMode: 'updates' },
)) {
  const [nodeName, update] = Object.entries(step)[0] as [string, Record<string, unknown>]
  const fields = Object.keys(update).join(', ')
  console.log(\`[节点] \${nodeName} → 更新 \${fields}\`)
}

// ═══ 7. Command 版本：节点把「更新 + 去向」一起返回 ═══
async function reviewWithCommand(state: typeof ReviewState.State) {
  const passed = state.draft.length >= 500
  const update = { passed }

  if (passed) {
    // 结果：通过后直接移交摘要节点
    return new Command({ goto: 'summary', update })
  }

  if (state.attempts >= MAX_ATTEMPTS) {
    // 结果：次数触顶，强制收尾，避免无限循环
    return new Command({ goto: END, update })
  }

  // 结果：不通过则回到正文节点，同时写入判定结果
  return new Command({ goto: 'content', update })
}

const commandGraph = new StateGraph(ReviewState)
  .addNode('outline', outlineNode)
  .addNode('content', contentNode)
  .addNode('review', reviewWithCommand)
  .addNode('summary', summaryNode)
  .addEdge(START, 'outline')
  .addEdge('outline', 'content')
  .addEdge('content', 'review')
  .addEdge('summary', END)

const commandApp = commandGraph.compile()
const commandResult = await commandApp.invoke(
  { topic: 'LangGraph Command 路由', messages: [] },
  { recursionLimit: 12 },
)

console.log('Command 版本摘要：', commandResult.summary)

// ═══ 8. 路由函数单测：不依赖模型与网络 ═══
function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(\`\${label}：期望 \${String(expected)}，实际 \${String(actual)}\`)
  }
}

const passedState = { passed: true, attempts: 1 } as typeof ReviewState.State
const retryState = { passed: false, attempts: 1 } as typeof ReviewState.State
const exhaustedState = { passed: false, attempts: MAX_ATTEMPTS } as typeof ReviewState.State

assertEqual(routeAfterReview(passedState), 'summary', '通过后应去摘要')
assertEqual(routeAfterReview(retryState), 'content', '未通过且未触顶应回炉')
assertEqual(routeAfterReview(exhaustedState), END, '触顶后应强制收尾')
console.log('路由函数 3 条用例全部通过')
`;export{e as default};
