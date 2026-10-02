const n=`import { StateGraph, START, END } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: 定义状态接口
interface GraphState {
  topic: string
  difficulty: string
  outline: string
  content: string
  summary: string
  needsReview: boolean
}

// 示例2: 定义节点函数
async function outlineNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '为"{topic}"生成一份课程大纲，难度{difficulty}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const outline = await chain.invoke({ topic: state.topic, difficulty: state.difficulty })
  return { outline }
}

async function contentNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '根据大纲展开详细内容:\\n\\n{outline}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const content = await chain.invoke({ outline: state.outline })
  return { content }
}

async function summaryNode(state: GraphState): Promise<Partial<GraphState>> {
  const prompt = ChatPromptTemplate.fromTemplate(
    '为以下课程内容写一份100字摘要:\\n\\n{content}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  const summary = await chain.invoke({ content: state.content })
  return { summary, needsReview: false }
}

async function reviewNode(state: GraphState): Promise<Partial<GraphState>> {
  // 模拟审核逻辑
  const needsReview = state.content.length < 500
  return { needsReview }
}

// 示例3: 定义条件路由
function routeAfterReview(state: GraphState): 'summary' | 'content' {
  if (state.needsReview) {
    return 'content' // 需要重写内容
  }
  return 'summary' // 直接生成摘要
}

// 示例4: 构建状态图
const graph = new StateGraph<GraphState>({
  channels: {
    topic: null,
    difficulty: null,
    outline: null,
    content: null,
    summary: null,
    needsReview: null,
  } as any,
})

// 添加节点
graph.addNode('outline', outlineNode)
graph.addNode('content', contentNode)
graph.addNode('review', reviewNode)
graph.addNode('summary', summaryNode)

// 添加边
graph.addEdge(START, 'outline')
graph.addEdge('outline', 'content')
graph.addEdge('content', 'review')

// 条件边
graph.addConditionalEdges('review', routeAfterReview, {
  content: 'content',
  summary: 'summary',
})

graph.addEdge('summary', END)

// 编译图
const app = graph.compile()

// 示例5: 执行图
const initialState: GraphState = {
  topic: 'LangChain.js 入门',
  difficulty: '入门级',
  outline: '',
  content: '',
  summary: '',
  needsReview: false,
}

const result = await app.invoke(initialState)
console.log('课程摘要:', result.summary)

// 示例6: 流式输出图执行过程
const stream = await app.stream(initialState)

console.log('\\n=== 图执行过程 ===')
for await (const step of stream) {
  const nodeName = Object.keys(step)[0]
  console.log(\`[节点执行] \${nodeName}\`)
  if (step[nodeName]) {
    const keys = Object.keys(step[nodeName])
    console.log(\`  更新字段: \${keys.join(', ')}\`)
  }
}

// 示例7: 带记忆的对话 Agent 图
interface AgentState {
  messages: (HumanMessage | AIMessage)[]
}

async function agentNode(state: AgentState): Promise<Partial<AgentState>> {
  const response = await model.invoke(state.messages)
  return {
    messages: [response],
  }
}

const agentGraph = new StateGraph<AgentState>({
  channels: {
    messages: {
      default: () => [],
      reducer: (x, y) => x.concat(y),
    },
  } as any,
})

agentGraph.addNode('agent', agentNode)
agentGraph.addEdge(START, 'agent')
agentGraph.addEdge('agent', END)

const agentApp = agentGraph.compile()

const agentResult = await agentApp.invoke({
  messages: [new HumanMessage('你好，请介绍一下 LangGraph')],
})
console.log('\\nAgent 回答:', agentResult.messages.at(-1)?.content)

// 示例8: 检查点（Checkpoint）- 支持暂停和恢复
// import { MemorySaver } from '@langchain/langgraph'
//
// const memorySaver = new MemorySaver()
// const appWithCheckpoint = graph.compile({ checkpointer: memorySaver })
//
// // 第一次执行
// const config = { configurable: { thread_id: '123' } }
// await appWithCheckpoint.invoke(initialState, config)
//
// // 从检查点恢复
// const checkpoint = await memorySaver.get(config)
// console.log('检查点状态:', checkpoint)`;export{n as default};
