const n=`// 监督者模式：把子智能体包装成工具，由监督者调度
// 场景：市场调研团队——监督者把任务分派给「研究员」和「写作员」
import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: 先造两个「专家」——各自是独立的 Agent，职责单一
const researcher = createAgent({
  model,
  tools: [
    tool(async ({ question }) => \`关于「\${question}」的调研结论：LangGraph 适合有状态的复杂智能体编排。\`, {
      name: 'search_web',
      description: '搜索资料',
      schema: z.object({ question: z.string() }),
    }),
  ],
  systemPrompt: '你是市场调研员，负责收集事实与数据，输出要点清单。',
})

const writer = createAgent({
  model,
  tools: [],
  systemPrompt: '你是技术写作员，把调研要点改写成通顺的短文，不添加未提供的事实。',
})

// 示例2: 把子智能体包装成「工具」——这是常用的 subagents-as-tools 模式
// 工具 description 写清楚边界，监督者据此决定何时派给谁
const researchAgentTool = tool(async ({ task }) => {
  const result = await researcher.invoke({ messages: [new HumanMessage(task)] })
  return String(result.messages.at(-1)?.content)
}, {
  name: 'research_agent',
  description: '派给调研员：收集事实、数据与要点清单。适合需要查阅资料的子任务。',
  schema: z.object({ task: z.string().describe('要调研的具体任务描述') }),
})

const writingAgentTool = tool(async ({ task }) => {
  const result = await writer.invoke({ messages: [new HumanMessage(task)] })
  return String(result.messages.at(-1)?.content)
}, {
  name: 'writing_agent',
  description: '派给写作员：把已收集的要点改写成通顺短文。只做改写，不查资料。',
  schema: z.object({ task: z.string().describe('写作任务，需附上要点素材') }),
})

// 示例3: 监督者本身也是一个智能体——它的「工具」就是团队里的成员
const supervisor = createAgent({
  model,
  tools: [researchAgentTool, writingAgentTool],
  systemPrompt: \`你是团队负责人。把用户目标拆成最小必要步骤：
- 需要事实与资料 → 派给 research_agent
- 需要成文输出 → 派给 writing_agent（把调研要点一并附上）
任务完成后，用一段话总结交付。不要自己编造资料。\`,
})

// 示例4: 用户只提一个目标，监督者自动完成拆分与接力
const result = await supervisor.invoke({
  messages: [new HumanMessage('帮我写一篇 200 字的文章，说明 LangGraph 的适用场景。')],
})
console.log('交付:', result.messages.at(-1)?.content)

// 示例5: 观察调度轨迹——每次「Action」都是一次跨智能体的任务分派
for await (const chunk of await supervisor.stream({
  messages: [new HumanMessage('帮我写一篇 200 字的文章，说明 LangGraph 的适用场景。')],
}, { streamMode: 'updates' })) {
  const [node, update] = Object.entries(chunk)[0] as [string, any]
  const calls = (update.messages ?? []).flatMap((m: any) => m.tool_calls ?? [])
  if (calls.length) console.log(\`[监督者 → \${calls.map((c: any) => c.name).join(', ')}]\`)
}

// 示例6: 为什么用「子智能体当工具」而不是手写 if-else——
// 分派决策交还给监督者的模型推理；新增成员只需加一个工具，不改调度代码。
// 边界：工具 description 是分派的唯一依据，写含糊了成员就会被误派活。
`;export{n as default};
