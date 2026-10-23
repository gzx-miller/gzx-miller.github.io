const e=`// 子图与模块化组合：把研究流程编译成子图，再作为父图节点复用
// 场景：课程调研——父图管拆解与成稿，子图管 plan / search / synthesize
import { StateGraph, StateSchema, MessagesValue, START, END, MemorySaver } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// ═══ 1. 子图状态：内部字段不出现在父图 ═══
const ResearchState = new StateSchema({
  messages: MessagesValue,
  topic: z.string(),
  questions: z.array(z.string()).default(() => []),
  sources: z.array(z.string()).default(() => []),
  notes: z.string().default(''),
})

// 输入 / 输出 schema：父图只需提供 topic，子图只回传 sources
const ResearchInput = new StateSchema({
  topic: z.string(),
})

const ResearchOutput = new StateSchema({
  sources: z.array(z.string()),
})

// ═══ 2. 子图节点 ═══
async function planNode(state: typeof ResearchState.State) {
  const response = await model.invoke(\`把研究主题拆成 3 个检索问题：\${state.topic}\`)
  const questions = String(response.content)
    .split('\\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)

  return {
    questions,
    messages: [response],
  }
}

async function searchNode(state: typeof ResearchState.State) {
  const query = state.questions.join('；')
  const response = await model.invoke(\`检索课程库，关键词：\${query}\`)

  const sources = ['Vue3 入门', 'Vue3 组件通信', '组合式 API']
  return {
    sources,
    messages: [response],
  }
}

async function synthesizeNode(state: typeof ResearchState.State) {
  const response = await model.invoke(
    \`根据以下资料归纳 5 条要点：\\n\${state.sources.join('\\n')}\`,
  )

  return {
    notes: String(response.content),
    messages: [response],
  }
}

// ═══ 3. 编译子图：声明输入 / 输出映射，中间字段留在内部 ═══
const researchGraph = new StateGraph({
  schema: ResearchState,
  input: ResearchInput,
  output: ResearchOutput,
})
  .addNode('plan', planNode)
  .addNode('search', searchNode)
  .addNode('synthesize', synthesizeNode)
  .addEdge(START, 'plan')
  .addEdge('plan', 'search')
  .addEdge('search', 'synthesize')
  .addEdge('synthesize', END)

const researchApp = researchGraph.compile()

// ═══ 4. 父图状态：只保留对外约定 ═══
const ParentState = new StateSchema({
  messages: MessagesValue,
  topic: z.string(),
  sources: z.array(z.string()).default(() => []),
  draft: z.string().default(''),
})

async function intakeNode(state: typeof ParentState.State) {
  const response = await model.invoke(\`把需求拆成检索任务：\${state.topic}\`)
  return { messages: [response] }
}

async function writeNode(state: typeof ParentState.State) {
  const response = await model.invoke(
    \`根据资料写一份课程调研初稿：\\n\${state.sources.join('\\n')}\`,
  )

  return {
    draft: String(response.content),
    messages: [response],
  }
}

// ═══ 5. 编译后的子图直接作为父图节点 ═══
const parentGraph = new StateGraph(ParentState)
  .addNode('intake', intakeNode)
  .addNode('research', researchApp)
  .addNode('write', writeNode)
  .addEdge(START, 'intake')
  .addEdge('intake', 'research')
  .addEdge('research', 'write')
  .addEdge('write', END)

const parentApp = parentGraph.compile({
  checkpointer: new MemorySaver(),
})

// ═══ 6. 执行：父图调子图，子图结束后只映射 sources ═══
const config = { configurable: { thread_id: 'research-01' } }

const result = await parentApp.invoke(
  {
    topic: 'LangGraph 子图与模块化',
    messages: [new HumanMessage('调研 LangGraph 子图怎么用')],
  },
  config,
)

console.log('父图结果字段：', Object.keys(result))
// 结果：包含 topic / sources / draft，不含子图的 questions / notes

console.log('检索到的资料：', result.sources)
console.log('初稿长度：', result.draft.length)

// ═══ 7. 父图状态：默认看不到子图内部中间状态 ═══
const parentState = await parentApp.getState(config)
console.log('父图 next：', parentState.next)
console.log('父图可见值：', Object.keys(parentState.values))

// ═══ 8. 子图检查点挂在独立命名空间 ═══
const childConfig = {
  configurable: {
    thread_id: 'research-01',
    checkpoint_ns: 'research:8f2a',
  },
}

const childState = await parentApp.getState(childConfig)
console.log('子图内部字段：', Object.keys(childState.values))
console.log('子图历史条数：', childState.metadata?.step)

// ═══ 9. 子图复用：换一个父图仍然挂同一个编译产物 ═══
const batchParent = new StateGraph(ParentState)
  .addNode('intake', intakeNode)
  .addNode('research', researchApp)
  .addNode('write', writeNode)
  .addEdge(START, 'intake')
  .addEdge('intake', 'research')
  .addEdge('research', 'write')
  .addEdge('write', END)
  .compile()

const batchResult = await batchParent.invoke({
  topic: 'Vue3 组合式 API',
  messages: [new HumanMessage('调研 Vue3 组合式 API')],
})

console.log('复用子图的第二个结果：', batchResult.sources)
// 说明：researchApp 只编译一次，两个父图共享同一份实现

// ═══ 10. 拆分层级建议：只加必要的层级 ═══
interface GraphLayer {
  name: string
  nodes: number
  reusable: boolean
}

const layers: GraphLayer[] = [
  { name: '父图', nodes: 3, reusable: false },
  { name: 'research 子图', nodes: 3, reusable: true },
]

const shouldSplit = (layer: GraphLayer): boolean => layer.reusable || layer.nodes >= 5

console.log(
  layers.map((layer) => \`\${layer.name}：\${shouldSplit(layer) ? '值得独立' : '留在父图'}\`).join('\\n'),
)
// 结果：research 子图因可复用而独立，父图保持薄薄一层

// ═══ 11. 排障时按命名空间展开，而不是去父图里找中间值 ═══
const trace = {
  threadId: config.configurable.thread_id,
  parentNodes: parentState.next,
  childNamespace: childConfig.configurable.checkpoint_ns,
  childFields: Object.keys(childState.values),
}

console.log('两级追踪：', trace)
`;export{e as default};
