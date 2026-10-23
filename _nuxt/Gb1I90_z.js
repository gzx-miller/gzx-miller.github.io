const n=`import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

// 示例1: 基础 PromptTemplate - 单变量模板
const productTemplate = PromptTemplate.fromTemplate(
  '请为 {productName} 写一句吸引人的广告语，目标用户是 {targetAudience}。'
)

const formattedPrompt = await productTemplate.format({
  productName: '智能手表',
  targetAudience: '年轻运动爱好者',
})
console.log(formattedPrompt)

// 示例2: ChatPromptTemplate - 多角色消息模板
const chatPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个专业的{role}，请用{tone}的语气回答问题。'],
  ['human', '{question}'],
])

const messages = await chatPrompt.formatMessages({
  role: '健身教练',
  tone: '鼓励',
  question: '我今天不想运动怎么办？',
})
console.log(messages)

// 示例3: 使用占位符和消息模板
const chatPrompt2 = ChatPromptTemplate.fromMessages([
  ['system', '你是一个 helpful 的助手。'],
  ['placeholder', '{chat_history}'],
  ['human', '{input}'],
])

// 示例4: Partial Variables - 部分变量预填充
const baseTemplate = PromptTemplate.fromTemplate(
  '请用{language}写一个关于{topic}的简短介绍。'
)

// 先填入部分变量
const partialTemplate = await baseTemplate.partial({ language: '中文' })

// 后续再填入剩余变量
const finalPrompt = await partialTemplate.format({
  topic: '机器学习',
})
console.log(finalPrompt)

// 示例5: 管道组合 - PromptTemplate + Model
const model = new ChatOpenAI({ model: 'gpt-4o-mini' })
const prompt = ChatPromptTemplate.fromTemplate(
  '给我讲一个关于{subject}的简短笑话'
)
const chain = prompt.pipe(model)

const result = await chain.invoke({ subject: '程序员' })
console.log(result.content)

// 示例6: 多变量复杂模板
const reviewTemplate = PromptTemplate.fromTemplate(\`
请根据以下信息写一条产品评价：
产品: {product}
购买时间: {purchaseDate}
使用体验: {experience}
总体评分(1-5星): {rating}星

要求: 语气真实自然，{length}字左右。
\`)

const reviewPrompt = await reviewTemplate.format({
  product: '无线蓝牙耳机',
  purchaseDate: '2024年1月',
  experience: '音质不错，续航也很好',
  rating: 5,
  length: 100,
})`;export{n as default};
