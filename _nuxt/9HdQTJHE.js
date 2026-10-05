const n=`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.7 })
const parser = new StringOutputParser()

// 示例1: 输入护栏 - 内容安全检查
const inputCheckPrompt = ChatPromptTemplate.fromTemplate(\`
请检查以下用户输入是否包含有害内容。

检查项：
1. 是否包含暴力或仇恨言论
2. 是否包含色情或露骨内容
3. 是否包含违法违规信息
4. 是否包含人身攻击或辱骂
5. 是否诱导危险行为

用户输入: {input}

请回答：
是否安全: 是/否
风险类别: 如果不安全，列出风险类别
风险等级: 低/中/高
\`)

const inputCheckChain = inputCheckPrompt.pipe(model).pipe(parser)

async function checkInputSafety(input: string): Promise<{
  isSafe: boolean
  riskCategory?: string
  riskLevel?: string
}> {
  const result = await inputCheckChain.invoke({ input })
  
  // 解析结果
  const isSafe = result.includes('是否安全: 是') || result.includes('安全: 是')
  
  return {
    isSafe,
  }
}

// 示例2: 输出护栏 - 格式验证 (Zod)
const outputSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.enum(['电子产品', '服装', '食品', '图书', '其他']),
  description: z.string().max(500),
  inStock: z.boolean(),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

async function safeGenerateProduct(productDesc: string): Promise<any> {
  const prompt = ChatPromptTemplate.fromTemplate(\`
根据以下描述生成产品信息：

{description}

{format_instructions}
\`)

  const chain = prompt.pipe(model).pipe(outputParser)
  
  try {
    const result = await chain.invoke({
      description: productDesc,
      format_instructions: outputParser.getFormatInstructions(),
    })
    return { success: true, data: result }
  } catch (error) {
    console.log('输出格式验证失败，重试...')
    // 重试一次
    try {
      const result = await chain.invoke({
        description: productDesc,
        format_instructions: outputParser.getFormatInstructions(),
      })
      return { success: true, data: result }
    } catch (retryError) {
      return { success: false, error: '输出格式验证失败' }
    }
  }
}

// 示例3: 内容护栏 - 检查输出是否有敏感信息
const outputCheckPrompt = ChatPromptTemplate.fromTemplate(\`
请检查以下 AI 输出是否符合安全规范。

检查项：
1. 是否泄露机密或敏感信息
2. 是否包含虚假或误导性信息
3. 是否有不当建议或危险引导
4. 是否有偏见或歧视性内容
5. 是否偏离主题或拒绝回答

AI 输出: {output}

请回答：
是否合规: 是/否
问题点: 列出存在的问题（如果没有则填"无"）
修改建议: 如果不合规，给出修改建议
\`)

const outputCheckChain = outputCheckPrompt.pipe(model).pipe(parser)

async function checkOutputSafety(output: string): Promise<{
  isCompliant: boolean
  issues?: string
  suggestion?: string
}> {
  const result = await outputCheckChain.invoke({ output })
  const isCompliant = result.includes('是否合规: 是')
  return { isCompliant }
}

// 示例4: 带护栏的完整链
async function guardedGeneration(userInput: string): Promise<{
  success: boolean
  output?: string
  error?: string
}> {
  // 第一步：输入检查
  const inputSafety = await checkInputSafety(userInput)
  if (!inputSafety.isSafe) {
    return { success: false, error: '输入包含不安全内容' }
  }

  // 第二步：生成回答
  const prompt = ChatPromptTemplate.fromTemplate(
    '请用专业的方式回答以下问题：\\n{question}'
  )
  const chain = prompt.pipe(model).pipe(parser)
  let output = await chain.invoke({ question: userInput })

  // 第三步：输出检查
  const outputSafety = await checkOutputSafety(output)
  if (!outputSafety.isCompliant) {
    // 重试：加入安全约束重新生成
    const safePrompt = ChatPromptTemplate.fromTemplate(\`
请用安全、专业、客观的方式回答以下问题。
确保回答准确无误，不包含任何不当内容。

问题: {question}
\`)
    const safeChain = safePrompt.pipe(model).pipe(parser)
    output = await safeChain.invoke({ question: userInput })
    
    // 再次检查
    const recheck = await checkOutputSafety(output)
    if (!recheck.isCompliant) {
      return { success: false, error: '输出无法通过安全检查' }
    }
  }

  return { success: true, output }
}

// 示例5: 主题护栏 - 确保回答在业务范围内
const topicGuardPrompt = ChatPromptTemplate.fromTemplate(\`
请判断以下问题是否属于我们的业务范围。

我们的业务范围：
- 产品咨询
- 技术支持
- 订单查询
- 售后服务

用户问题: {question}

是否属于业务范围: 是/否
如果不属于，请生成一句礼貌的拒绝话术。
\`)

const topicGuardChain = topicGuardPrompt.pipe(model).pipe(parser)

async function checkTopicRelevance(question: string): Promise<{
  isRelevant: boolean
  rejectionMessage?: string
}> {
  const result = await topicGuardChain.invoke({ question })
  const isRelevant = result.includes('是')
  return { isRelevant }
}

// 示例6: 重试机制 + 护栏
async function generateWithGuardrails(
  input: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError = ''
  
  for (let i = 0; i < maxRetries; i++) {
    console.log(\`第 \${i + 1} 次生成...\`)
    
    // 输入检查
    const inputSafe = await checkInputSafety(input)
    if (!inputSafe.isSafe) {
      throw new Error('输入不安全')
    }
    
    // 生成
    const prompt = ChatPromptTemplate.fromTemplate(\`
请回答以下问题：{question}

要求：
- 回答要专业、客观、准确
- 不包含任何敏感或不当内容
- 如果不确定，请说明不确定的原因
\`)
    const chain = prompt.pipe(model).pipe(parser)
    const output = await chain.invoke({ question: input })
    
    // 输出检查
    const outputSafe = await checkOutputSafety(output)
    if (outputSafe.isCompliant) {
      return output
    }
    
    lastError = '输出不合规'
  }
  
  throw new Error(\`经过 \${maxRetries} 次重试仍无法通过安全检查: \${lastError}\`)
}

// 示例7: 降级响应
function getFallbackResponse(reason: string): string {
  const responses: Record<string, string> = {
    unsafe_input: '抱歉，您的问题包含敏感内容，我无法回答。',
    unsafe_output: '抱歉，我无法生成合适的回答。请尝试换一种问法。',
    off_topic: '抱歉，这个问题超出了我的业务范围。我可以帮您解答产品相关的问题。',
    error: '抱歉，服务暂时出现问题，请稍后再试。',
  }
  return responses[reason] || responses.error
}`;export{n as default};
