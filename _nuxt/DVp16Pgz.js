const e=`// Deep Agents：开箱的「深度」智能体
// 场景：行业研究报告——自动规划待办、派子智能体调研、沉淀文件
import { createDeepAgent } from 'deepagents'
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { HumanMessage } from '@langchain/core/messages'
import { z } from 'zod'

// 示例1: 造两个子智能体——调研员与数据员，各自持有自己的工具
const researcher = createDeepAgent({
  model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools: [
    tool(async ({ query }) => \`检索完成：「\${query}」的最新资料已整理\`, {
      name: 'search',
      description: '检索公开资料',
      schema: z.object({ query: z.string() }),
    }),
  ],
  systemPrompt: '你是调研员，负责收集事实与数据来源。',
})

const analyst = createDeepAgent({
  model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  tools: [],
  systemPrompt: '你是数据分析员，负责把调研素材整理成结论与图表提纲。',
})

// 示例2: 主智能体一步创建——Deep Agents 自带四件套：
// ① write_todos 规划工具 ② 虚拟文件系统 ③ 子智能体委派 ④ 对话记忆
const deepAgent = createDeepAgent({
  model: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
  subagents: [
    { name: 'researcher', description: '负责调研收集资料', agent: researcher },
    { name: 'analyst', description: '负责整理数据与结论', agent: analyst },
  ],
  systemPrompt: '你是研究主管。先拆解任务，再派出子智能体，最后写入报告。',
})

// 示例3: 一次调用看它自己规划——任务被写进 todo 列表并逐项推进
const result = await deepAgent.invoke({
  messages: [new HumanMessage('写一份《LangGraph 在多智能体编排中的应用》调研报告')],
})

// 示例4: 观察「规划 → 委派 → 沉淀」的完整轨迹
for await (const chunk of await deepAgent.stream({
  messages: [new HumanMessage('写一份《LangGraph 在多智能体编排中的应用》调研报告')],
}, { streamMode: 'updates' })) {
  for (const [node, update] of Object.entries(chunk) as [string, any][]) {
    if (node === 'tools') {
      const calls = (update.messages ?? []).flatMap((m: any) => m.tool_calls ?? [])
      for (const call of calls) {
        if (call.name === 'write_todos') {
          console.log('[更新待办]', call.args.todos?.length ?? 0, '项')
        } else if (call.name === 'task') {
          console.log('[委派子智能体]', call.args.subagent_type, '-', call.args.description)
        } else if (['write_file', 'edit_file'].includes(call.name)) {
          console.log('[写入文件]', call.args.file_path)
        }
      }
    }
  }
}

// 示例5: 读回产出——文件都落在内置虚拟文件系统里，用 read_file / ls 工具找回
const report = await deepAgent.invoke({
  messages: [new HumanMessage('读取 /report.md 并总结要点')],
})
console.log('产出示例: /report.md，包含调研结论与引用')

// 示例6: 用不用 Deep Agents 的判断
// - 单一工具调用、一问一答 → 普通 ReAct Agent 就够
// - 需要「自己列计划、多个专家分工、中途落文件」 → Deep Agents
// - 提醒：组件开箱即用但会多轮消耗 token，先估预算再上生产
`;export{e as default};
