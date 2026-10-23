const n=`// MCP Server：用标准协议把外部工具接进 LangGraph
// 场景：课程助手接入两个 MCP 服务——本地文件系统 + 远程课程数据库
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

// 示例1: 配置多个 MCP Server——stdio 本地进程与 HTTP 远程服务可以混用
const client = new MultiServerMCPClient({
  math: {
    transport: 'stdio',
    command: 'node',
    args: ['./mcp-servers/math-server.js'],
  },
  courseDb: {
    transport: 'http',
    url: 'https://mcp.example.com/course-db',
    headers: { Authorization: 'Bearer <token>' },
  },
})

// 示例2: 一次拉取所有 Server 暴露的工具，自动转换为 LangChain 工具
// 每个工具的命名空间会加上 Server 前缀，如 math__calculate、courseDb__query
const tools = await client.getTools()
console.log('已接入工具:', tools.map((t) => t.name).join(', '))

// 示例3: 把 MCP 工具直接交给 createAgent，与本地工具用法完全一致
const agent = createAgent({
  model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools,
  systemPrompt: '你可以使用 MCP 工具查询课程数据库与执行计算，请先查证再回答。',
})

const result = await agent.invoke({
  messages: [new HumanMessage('《LangGraph 入门》这门课总共几章？每章平均多少页？')],
})
console.log('回答:', result.messages.at(-1)?.content)

// 示例4: 观察 MCP 调用过程——工具名带 Server 前缀，一眼看出跨了哪个服务
for await (const chunk of await agent.stream(
  { messages: [new HumanMessage('《LangGraph 入门》这门课总共几章？每章平均多少页？')] },
  { streamMode: 'updates' },
)) {
  const [node, update] = Object.entries(chunk)[0] as [string, any]
  const calls = (update.messages ?? []).flatMap((m: any) => m.tool_calls ?? [])
  if (calls.length) {
    console.log(\`[\${node}] 调用:\`)
    for (const call of calls) {
      console.log(\`  - \${call.name}(\${JSON.stringify(call.args)})\`)
    }
  }
}

// 示例5: 用完显式关闭，释放 stdio 子进程与 HTTP 连接
await client.close()

// 示例6: MCP 的价值——工具不再写死在应用里
// 换一个 MCP Server 就是换一套工具，Agent 代码一行不用改；
// Claude Desktop、IDE、LangGraph 共享同一批 Server 定义。
`;export{n as default};
