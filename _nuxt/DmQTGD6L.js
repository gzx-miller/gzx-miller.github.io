const n=`import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 })
const parser = new StringOutputParser()

// 示例1: 基础图像理解 - URL 方式
async function describeImageUrl(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的图像描述助手，请用中文详细描述图片内容。'),
    new HumanMessage({
      content: [
        { type: 'text', text: '请描述这张图片' },
        {
          type: 'image_url',
          image_url: { url: imageUrl },
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 使用示例
// const description = await describeImageUrl('https://example.com/image.jpg')
// console.log(description)

// 示例2: Base64 编码图像
import * as fs from 'fs'
import * as path from 'path'

function imageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath)
  const base64 = imageBuffer.toString('base64')
  const ext = path.extname(imagePath).slice(1)
  return \`data:image/\${ext};base64,\${base64}\`
}

async function describeLocalImage(imagePath: string): Promise<string> {
  const base64Image = imageToBase64(imagePath)
  
  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: '请详细描述这张图片的内容' },
        {
          type: 'image_url',
          image_url: { url: base64Image },
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例3: 图像问答（VQA）
async function askAboutImage(imageUrl: string, question: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的视觉问答助手，请根据图片内容回答问题。'),
    new HumanMessage({
      content: [
        { type: 'text', text: question },
        {
          type: 'image_url',
          image_url: { url: imageUrl, detail: 'high' }, // low/auto/high
        },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 使用示例
// const answer = await askAboutImage(
//   'https://example.com/chart.png',
//   '这张图表显示了什么趋势？'
// )

// 示例4: 多图对比
async function compareImages(imageUrl1: string, imageUrl2: string): Promise<string> {
  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: '请对比这两张图片，描述它们的主要区别' },
        { type: 'image_url', image_url: { url: imageUrl1 } },
        { type: 'image_url', image_url: { url: imageUrl2 } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例5: 图表分析
async function analyzeChart(imageUrl: string): Promise<string> {
  const prompt = \`
请分析这张图表：
1. 这是什么类型的图表？
2. 图表显示的主要数据是什么？
3. 有什么明显的趋势或规律？
4. 最高值和最低值分别是多少？
5. 请总结图表的核心信息
\`

  const messages = [
    new HumanMessage({
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例6: OCR - 文字识别
async function extractTextFromImage(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个 OCR 助手，请准确提取图片中的所有文字。保持原格式。'),
    new HumanMessage({
      content: [
        { type: 'text', text: '请提取这张图片中的所有文字' },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}

// 示例7: 结构化图像理解 + Zod
import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'

const imageAnalysisSchema = z.object({
  imageType: z.string().describe('图片类型，如风景、人物、图表、产品等'),
  mainSubject: z.string().describe('图片主要内容描述'),
  colors: z.array(z.string()).describe('主要颜色列表'),
  objects: z.array(z.string()).describe('识别到的主要物体'),
  quality: z.enum(['high', 'medium', 'low']).describe('图片质量'),
  textContent: z.string().describe('图片中的文字内容，如果没有则填"无"'),
})

async function structuredImageAnalysis(imageUrl: string): Promise<any> {
  const parser = StructuredOutputParser.fromZodSchema(imageAnalysisSchema)
  const formatInstructions = parser.getFormatInstructions()

  const messages = [
    new HumanMessage({
      content: [
        {
          type: 'text',
          text: \`请分析这张图片。\\n\\n\${formatInstructions}\`,
        },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return parser.parse(response.content as string)
}

// 示例8: 多模态链式调用
const multimodalPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个专业的产品分析助手。'],
  [
    'human',
    [
      { type: 'text', text: '请分析这张产品图片，生成一份简短的产品描述' },
      { type: 'image_url', image_url: '{image_url}' },
    ],
  ],
])

// 注意：多模态模板需要特殊处理，直接用消息数组更直观
async function analyzeProduct(imageUrl: string): Promise<string> {
  const messages = [
    new SystemMessage('你是一个专业的产品文案撰写助手。'),
    new HumanMessage({
      content: [
        {
          type: 'text',
          text: '请根据产品图片，生成一段吸引人的产品营销文案，100字左右',
        },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    }),
  ]

  const response = await model.invoke(messages)
  return response.content as string
}`;export{n as default};
