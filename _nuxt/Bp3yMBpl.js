const n=`import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })

// 示例1: withStructuredOutput - 函数调用方式（推荐）
const userSchema = z.object({
  name: z.string().describe('用户姓名'),
  age: z.number().describe('用户年龄'),
  email: z.string().describe('用户邮箱'),
  interests: z.array(z.string()).describe('兴趣爱好列表'),
})

const modelWithStructuredOutput = model.withStructuredOutput(userSchema, {
  name: 'extract_user_info',
})

const result1 = await modelWithStructuredOutput.invoke([
  ['human', '提取用户信息：张三，25岁，邮箱 zhangsan@example.com，喜欢编程、阅读、打篮球'],
])
console.log('函数调用方式:', JSON.stringify(result1, null, 2))

// 示例2: JSON Mode 方式
const jsonModel = new ChatOpenAI({
  model: 'gpt-4o-mini',
  modelKwargs: { response_format: { type: 'json_object' } },
})

const jsonPrompt = ChatPromptTemplate.fromTemplate(\`
请以 JSON 格式返回以下信息。

用户描述: {userDescription}

JSON 格式要求：
{{
  "name": "姓名",
  "age": 年龄数字,
  "email": "邮箱",
  "interests": ["兴趣1", "兴趣2"]
}}
\`)

const jsonChain = jsonPrompt.pipe(jsonModel).pipe(async (msg) => {
  return JSON.parse(msg.content as string)
})

const result2 = await jsonChain.invoke({
  userDescription: '李四，30岁，lisi@test.com，喜欢旅游和摄影',
})
console.log('JSON Mode:', JSON.stringify(result2, null, 2))

// 示例3: StructuredOutputParser 方式
const parser = StructuredOutputParser.fromZodSchema(userSchema)

const prompt = ChatPromptTemplate.fromTemplate(\`
提取用户信息。

用户描述: {userDescription}

{format_instructions}
\`)

const chain = prompt.pipe(model).pipe(parser)

const result3 = await chain.invoke({
  userDescription: '王五，28岁，wangwu@example.com，喜欢音乐、电影、健身',
})
console.log('StructuredOutputParser:', JSON.stringify(result3, null, 2))

// 示例4: 嵌套结构
const addressSchema = z.object({
  city: z.string().describe('城市'),
  district: z.string().describe('区'),
  street: z.string().describe('街道地址'),
})

const personSchema = z.object({
  name: z.string().describe('姓名'),
  age: z.number().describe('年龄'),
  address: addressSchema.describe('地址信息'),
  phoneNumbers: z.array(z.string()).describe('电话号码列表'),
})

const modelWithPerson = model.withStructuredOutput(personSchema)

const result4 = await modelWithPerson.invoke([
  ['human', '赵六，35岁，住在北京市朝阳区建国路88号，电话：13800138000 和 010-12345678'],
])
console.log('嵌套结构:', JSON.stringify(result4, null, 2))

// 示例5: 数组输出
const productSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().describe('产品ID'),
      name: z.string().describe('产品名称'),
      price: z.number().describe('价格'),
      category: z.string().describe('分类'),
    })
  ).describe('产品列表'),
})

const modelWithProducts = model.withStructuredOutput(productSchema)

const result5 = await modelWithProducts.invoke([
  ['human', '列出3款常见电子产品及其价格'],
])
console.log('数组输出:')
result5.products.forEach((p: any) => {
  console.log(\`  - \${p.name}: ¥\${p.price}\`)
})

// 示例6: 枚举类型
const ticketSchema = z.object({
  title: z.string().describe('工单标题'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).describe('优先级'),
  category: z.enum(['bug', 'feature', 'question', 'other']).describe('分类'),
  description: z.string().describe('问题描述'),
})

const modelWithTicket = model.withStructuredOutput(ticketSchema)

const result6 = await modelWithTicket.invoke([
  ['human', '创建一个工单：用户无法登录系统，账号密码正确但总是提示错误，这个问题很紧急'],
])
console.log('工单分类:', result6.category)
console.log('工单优先级:', result6.priority)

// 示例7: 可选字段和默认值
const articleSchema = z.object({
  title: z.string().describe('文章标题'),
  author: z.string().optional().describe('作者（可选）'),
  tags: z.array(z.string()).default([]).describe('标签列表'),
  published: z.boolean().describe('是否已发布'),
})

const modelWithArticle = model.withStructuredOutput(articleSchema)

const result7 = await modelWithArticle.invoke([
  ['human', '写一篇关于 TypeScript 的文章，已发布，标签有编程、前端'],
])
console.log('文章结构:', JSON.stringify(result7, null, 2))`;export{n as default};
