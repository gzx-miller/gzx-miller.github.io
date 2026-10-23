const n=`import { createAgent } from 'langchain'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: StringOutputParser - 提取纯文本
const prompt1 = ChatPromptTemplate.fromTemplate(
  '用一句话解释{concept}是什么'
)
const stringParser = new StringOutputParser()

const chain1 = prompt1.pipe(model).pipe(stringParser)
const textResult = await chain1.invoke({ concept: 'RAG' })
console.log('纯文本结果:', textResult)

// 示例2: withStructuredOutput + Zod - 课程推荐（v1 推荐写法）
const courseSchema = z.object({
  courseName: z.string().describe('课程名称'),
  category: z.string().describe('课程分类'),
  difficulty: z.enum(['入门', '中级', '高级']).describe('难度等级'),
  duration: z.number().describe('课程时长（小时）'),
  description: z.string().describe('课程简介'),
  prerequisites: z.array(z.string()).describe('前置知识要求'),
})

const modelWithCourse = model.withStructuredOutput(courseSchema, {
  name: 'recommend_course',
})

const courseResult = await modelWithCourse.invoke([
  ['human', '请推荐一门适合学习机器学习的课程。'],
])
console.log('结构化课程:', courseResult.courseName, courseResult.difficulty)

// 示例3: 数组输出
const listSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    })
  ).describe('推荐列表'),
})

const modelWithBooks = model.withStructuredOutput(listSchema)

const booksResult = await modelWithBooks.invoke([
  ['human', '请推荐3本关于科幻小说的经典书籍。'],
])
booksResult.recommendations.forEach((book, i) => {
  console.log(\`\${i + 1}. \${book.title}: \${book.reason}\`)
})

// 示例4: 保留字符串解析器的链式组合
const prompt4 = ChatPromptTemplate.fromTemplate(
  '列出{count}个{category}的名称，用逗号分隔'
)

const chain4 = prompt4
  .pipe(model)
  .pipe(new StringOutputParser())
  .pipe((text) => text.split(',').map(s => s.trim()))

const listResult = await chain4.invoke({ count: 5, category: '编程语言' })
console.log('编程语言列表:', listResult)

// 示例5: 智能体的结构化输出 - createAgent 的 responseFormat
const agent = createAgent({
  model,
  tools: [],
  responseFormat: courseSchema,
})

const agentResult = await agent.invoke({
  messages: [{ role: 'user', content: '推荐一门适合学习机器学习的课程。' }],
})
console.log('智能体结构化输出:', agentResult.structuredResponse)
`;export{n as default};
