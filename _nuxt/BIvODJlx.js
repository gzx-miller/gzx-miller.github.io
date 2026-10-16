const n=`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 })
const parser = new StringOutputParser()

// 示例1: 角色设定 (Role Prompting)
const rolePrompt = ChatPromptTemplate.fromMessages([
  ['system', \`你是一位资深的前端架构师，拥有10年开发经验。
你擅长 Vue、React、TypeScript 等技术栈。
回答问题时请：
1. 先给出简洁的结论
2. 然后详细解释原理
3. 最后提供实践建议
请用专业但易懂的中文回答。\`],
  ['human', '{question}'],
])

const roleChain = rolePrompt.pipe(model).pipe(parser)

const roleResult = await roleChain.invoke({
  question: '前端项目应该选择 Vue 还是 React？',
})
console.log('角色设定结果:\\n', roleResult.slice(0, 200) + '...')

// 示例2: 清晰指令 + 输出格式约束
const formatPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个技术文档写作助手。'],
  ['human', \`
请为以下技术概念写一段解释：

概念: {concept}

要求:
1. 用通俗的语言解释，让初学者能理解
2. 字数控制在 200-300 字
3. 分为三段：
   - 第一段：定义和核心作用
   - 第二段：工作原理
   - 第三段：应用场景
4. 不要使用过于专业的术语，如果必须使用请解释
\`],
])

const formatChain = formatPrompt.pipe(model).pipe(parser)

const formatResult = await formatChain.invoke({
  concept: '虚拟 DOM',
})
console.log('\\n格式约束结果:\\n', formatResult)

// 示例3: Few-shot 示例引导
const examples = [
  { input: '产品质量很好，物流也快', output: '正面' },
  { input: '包装破损了，有点失望', output: '负面' },
  { input: '还可以吧，中规中矩', output: '中性' },
  { input: '性价比超高，强烈推荐！', output: '正面' },
]

const examplePrompt = ChatPromptTemplate.fromMessages([
  ['human', '{input}'],
  ['ai', '{output}'],
])

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
  prefix: '请判断以下评论的情感倾向（正面/负面/中性）：',
  suffix: ['human', '{input}'],
})

const sentimentPrompt = ChatPromptTemplate.fromMessages([
  fewShotPrompt,
])

const sentimentChain = sentimentPrompt.pipe(model).pipe(parser)

const sentimentResult = await sentimentChain.invoke({
  input: '用了一个月了，质量真的不错，下次还买',
})
console.log('\\nFew-shot 情感分析:', sentimentResult)

// 示例4: 思维链 (Chain of Thought, CoT)
const cotPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个逻辑推理助手。请逐步思考后给出答案。'],
  ['human', \`
问题: {question}

请按以下步骤回答：
1. 首先，明确问题是什么
2. 然后，列出已知条件
3. 接着，逐步推导
4. 最后，给出结论

让我们一步一步来思考。
\`],
])

const cotChain = cotPrompt.pipe(model).pipe(parser)

const cotResult = await cotChain.invoke({
  question: '一个水池有进水管和出水管，单独开进水管6小时可以注满，单独开出水管8小时可以放完。如果同时打开两个水管，需要多少小时可以注满水池？',
})
console.log('\\n思维链结果:\\n', cotResult.slice(0, 300) + '...')

// 示例5: 结构化输出提示
const structuredPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个信息提取助手。'],
  ['human', \`
请从以下文本中提取关键信息，以 JSON 格式输出：

文本: {text}

JSON 格式要求：
{{
  "人名": [],
  "地点": [],
  "时间": [],
  "事件": "",
  "关键词": []
}}

只输出 JSON，不要其他解释。
\`],
])

const structuredChain = structuredPrompt.pipe(model).pipe(parser)

const structuredResult = await structuredChain.invoke({
  text: '2024年3月15日，张三和李四在北京参加了一场技术大会，主题是人工智能的发展趋势。',
})
console.log('\\n结构化输出:\\n', structuredResult)

// 示例6: 自我一致性 (Self-Consistency)
async function selfConsistency(question: string, numSamples: number = 3): Promise<string> {
  const cotPrompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一个数学题解答助手。请详细写出解题步骤。'],
    ['human', '{question}\\n\\n请逐步解答：'],
  ])
  
  const cotChain = cotPrompt.pipe(model).pipe(parser)
  
  // 生成多个答案
  const answers = []
  for (let i = 0; i < numSamples; i++) {
    const answer = await cotChain.invoke({ question })
    answers.push(answer)
    console.log(\`答案 \${i + 1}: ...\`)
  }
  
  // 用 LLM 选择最一致的答案
  const judgePrompt = ChatPromptTemplate.fromTemplate(\`
以下是对同一个问题的多个解答，请选出最合理的一个答案：

问题: {question}

解答1:
{answer1}

解答2:
{answer2}

解答3:
{answer3}

请选择最合理的解答，并说明理由。
\`)
  
  const judgeChain = judgePrompt.pipe(model).pipe(parser)
  
  const finalAnswer = await judgeChain.invoke({
    question,
    answer1: answers[0],
    answer2: answers[1],
    answer3: answers[2],
  })
  
  return finalAnswer
}

// 示例7: 提示词迭代优化对比
async function comparePrompts() {
  const question = '什么是闭包？'
  
  // 版本1: 简单提问
  const simplePrompt = ChatPromptTemplate.fromTemplate('{question}')
  const simpleChain = simplePrompt.pipe(model).pipe(parser)
  const simpleResult = await simpleChain.invoke({ question })
  console.log('=== 简单提问 ===')
  console.log(simpleResult.slice(0, 100) + '...')
  
  // 版本2: 角色 + 结构
  const betterPrompt = ChatPromptTemplate.fromMessages([
    ['system', '你是一位资深的 JavaScript 讲师，擅长把复杂概念讲得通俗易懂。'],
    ['human', \`
请解释 "{concept}" 这个概念：

要求：
1. 用大白话解释，让初学者能懂
2. 举一个生活中的类比
3. 写一段简单的代码示例
4. 说明它的常见用途
\`],
  ])
  const betterChain = betterPrompt.pipe(model).pipe(parser)
  const betterResult = await betterChain.invoke({ concept: question })
  console.log('\\n=== 优化后 ===')
  console.log(betterResult.slice(0, 150) + '...')
}`;export{n as default};
