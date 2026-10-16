const n=`// 调试与部署：langgraph dev 调试页、追踪与上线检查
// 场景：把开发好的课程助手从本地调试推进到生产

// 示例1: langgraph.json——声明图入口与依赖，langgraph CLI 据此工作
// {
//   "dependencies": ["."],
//   "graphs": {
//     "course_agent": "./src/agents/course-agent.ts:agent"
//   },
//   "env": ".env"
// }

// 示例2: 启动调试页——打开 Studio，可视化每一步的输入输出
// 终端执行：
//   npx @langchain/langgraph-cli dev
// 浏览器打开 http://localhost:2024：
//   - 左侧列出所有图，点击进入画布
//   - 输入初始状态点击「Submit」，逐节点回放
//   - 每个节点可展开查看「输入状态 / 输出更新 / 耗时」
//   - 支持编辑状态后「从这里重跑」，不必从头再来

// 示例3: 结构化日志——本地没有 Studio 时，用 stream 自己打印追踪
import { createReactAgent } from '@langchain/langgraph/prebuilt'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

const agent = createReactAgent({
  llm: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools: [],
  prompt: '你是课程助手。',
})

const startedAt = Date.now()
for await (const chunk of await agent.stream(
  { messages: [new HumanMessage('介绍一门入门课')] },
  { streamMode: 'updates' },
)) {
  const [node, update] = Object.entries(chunk)[0] as [string, any]
  const elapsed = Date.now() - startedAt
  const keys = Object.keys(update).join(',')
  // 关键字段：节点名、耗时、更新的字段、消息条数——排障三件套
  console.log(\`[trace] node=\${node} t=+\${elapsed}ms updated=\${keys} messages=\${update.messages?.length ?? 0}\`)
}

// 示例4: LangSmith 追踪——设置环境变量后无需改代码，全链路自动上报
// export LANGCHAIN_TRACING_V2=true
// export LANGCHAIN_API_KEY=<your-key>
// export LANGCHAIN_PROJECT=course-agent
// 之后每次 invoke 都会在 LangSmith 生成一条 trace：
// 树形展示「节点 → 模型调用 → 工具调用」，附带完整输入输出与 token 用量

// 示例5: 上线前的检查清单
const releaseChecklist = [
  'checkpointer 从 MemorySaver 换成持久化实现（Postgres/Redis），重启不丢会话',
  'store 同样持久化，长期记忆跨发布保留',
  '为模型与外部工具设置超时、重试与降级话术',
  '开启 LangSmith 采样追踪，留存失败案例用于回归',
  '线程并发压测：确认同一 thread 的写入不会互相覆盖',
]
console.log(releaseChecklist.join('\\n'))

// 示例6: 部署形态选择
// - 长驻服务（Node/Fastify）：把编译好的图暴露为 HTTP 接口，SSE 推流
// - Serverless：注意 MemorySaver 不适用，必须外部存储 checkpointer
// - 无论是哪种，部署产物只依赖「编译后的图 + 环境变量」，开发时的 Studio 不带走
`;export{n as default};
