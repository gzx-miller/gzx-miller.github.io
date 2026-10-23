const n=`// 网络搜索：让智能体接入实时信息
// 场景：热点资讯助手——搜索新闻 → 去重 → 带引用来源回答
import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

// 示例1: Tavily 搜索工具——专为 LLM 设计的搜索 API，直接返回结构化结果
const tavilySearch = tool(async ({ query, maxResults }) => {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: maxResults,
      include_answer: false,
    }),
  })
  const data = await response.json()
  // 只把标题、片段、URL 交给模型，控制 token 消耗
  return data.results
    .map((r: any, i: number) => \`[\${i + 1}] \${r.title}\\n\${r.content}\\n来源: \${r.url}\`)
    .join('\\n\\n')
}, {
  name: 'web_search',
  description: '联网搜索实时信息，返回标题、摘要与来源链接',
  schema: z.object({
    query: z.string().describe('搜索词，尽量具体'),
    maxResults: z.number().default(5),
  }),
})

// 示例2: 去重——同一新闻被多家媒体转载时，按标题相似度合并，避免刷占结果位
function dedupeByTitle(items: { title: string; url: string }[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.title.replace(/[\\s「」【】\\-—|]/g, '').slice(0, 18)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 示例3: 约束「引用格式」——把编号来源的写法写进提示词
const agent = createAgent({
  model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools: [tavilySearch],
  systemPrompt: \`你是资讯助手。回答前必须调用 web_search 查证：
- 只依据搜索结果回答，不编造
- 每个关键结论后用 [编号] 标注来源
- 多个来源冲突时，说明分歧并给出时间最新的说法\`,
})

const result = await agent.invoke({
  messages: [new HumanMessage('LangGraph 1.0 是什么时候发布的？有哪些新特性？')],
})
console.log(result.messages.at(-1)?.content)

// 示例4: 观察搜索轨迹——看模型如何改写搜索词、翻了几轮
for await (const chunk of await agent.stream({
  messages: [new HumanMessage('LangGraph 1.0 是什么时候发布的？有哪些新特性？')],
}, { streamMode: 'updates' })) {
  const [node, update] = Object.entries(chunk)[0] as [string, any]
  const calls = (update.messages ?? []).flatMap((m: any) => m.tool_calls ?? [])
  for (const call of calls) {
    console.log(\`[搜索] \${call.args.query}（最多 \${call.args.maxResults ?? 5} 条）\`)
  }
}

// 示例5: 换搜索源——DDGS（免 Key）、Exa（语义搜索）、甚至 Exa MCP Server
// 都只是替换一个工具实现，Agent 与提示词不变

// 示例6: 工程注意
// - 搜索结果进上下文要限长：只保留 2-3 句片段，别把整页塞进去
// - 引用来源要随答案展示，用户才能自行核对
// - 对金融、医疗等高风险信息，加一道「必须双源交叉验证」的提示约束
`;export{n as default};
