<script setup lang="ts">
import { ref, computed } from 'vue'

interface PromptTechnique {
  id: string
  name: string
  icon: string
  description: string
  template: string
  example: string
  output: string
}

interface ComparisonTest {
  id: number
  technique: string
  prompt: string
  result: string
  score: number
}

const techniques = ref<PromptTechnique[]>([
  {
    id: 'basic',
    name: '基础提示',
    icon: '📝',
    description: '最简单直接的提问方式，只说明需求',
    template: '请写一段关于{主题}的介绍。',
    example: '请写一段关于秋日森林的介绍。',
    output: '秋日森林是一年中最美丽的季节之一。树叶变成金黄色、橙色和红色，构成了一幅绚丽的画卷。许多游客会在这个季节前往森林欣赏美景。森林里的动物也在为冬天做准备。'
  },
  {
    id: 'role',
    name: '角色设定',
    icon: '🎭',
    description: '为模型设定专业角色，提升回答的专业性',
    template: '你是一位{角色}。请以专业的角度回答关于{主题}的问题。',
    example: '你是一位资深的自然摄影师。请以专业的角度介绍秋日森林的拍摄技巧。',
    output: '作为一名有20年经验的自然摄影师，我来分享秋日森林的拍摄心得：\n\n**最佳光线时段**：黄金时段（日出后和日落前1小时）的侧光能最好地展现树叶的通透感和层次感。\n\n**构图技巧**：利用引导线（如林间小径）引导视线；尝试前景虚化增加纵深感；寻找色彩对比（红枫与青松）。\n\n**器材建议**：使用偏振镜消除树叶反光，增加色彩饱和度；三脚架保证慢门拍摄水流的丝滑效果。'
  },
  {
    id: 'fewshot',
    name: '少样本学习',
    icon: '📚',
    description: '提供几个示例，让模型学习输出格式和风格',
    template: '以下是几个示例：\n示例1：{示例1}\n示例2：{示例2}\n请按照相同格式回答：{输入}',
    example: '以下是几个森林相关的诗句：\n示例1："停车坐爱枫林晚，霜叶红于二月花。" —— 杜牧\n示例2："空山新雨后，天气晚来秋。" —— 王维\n请再写一句类似风格的秋日森林诗句。',
    output: '"层林尽染秋意浓，落叶飘零满径红。山静似太古，日长如小年。"\n\n这句诗描绘了秋日森林的绚烂色彩和宁静氛围，与前面两句的意境相呼应。'
  },
  {
    id: 'cot',
    name: '思维链',
    icon: '🧠',
    description: '引导模型逐步推理，展示思考过程',
    template: '请一步步思考并解决这个问题：{问题}\n\n第一步：分析问题\n第二步：列出关键因素\n第三步：给出结论',
    example: '请一步步思考：为什么秋日森林的树叶会变色？\n\n第一步：分析问题\n第二步：列出关键因素\n第三步：给出结论',
    output: '**第一步：分析问题**\n树叶变色是秋季的典型自然现象，涉及植物生理学和化学变化。需要从色素变化的角度来解释。\n\n**第二步：列出关键因素**\n1. 叶绿素：叶片中的主要色素，呈绿色，负责光合作用\n2. 类胡萝卜素：黄色和橙色色素，平时被叶绿素掩盖\n3. 花青素：红色和紫色色素，秋季糖分积累时合成\n4. 环境因素：气温下降、日照时间缩短\n\n**第三步：给出结论**\n树叶变色的原因是：秋季气温降低、日照减少，树木停止生产叶绿素，绿色逐渐褪去。原本被掩盖的类胡萝卜素（黄橙色）显现出来，同时部分树种因糖分积累合成花青素（红色），形成五彩斑斓的秋色。'
  },
  {
    id: 'structured',
    name: '结构化输出',
    icon: '📋',
    description: '指定输出格式，如 JSON、表格等结构化数据',
    template: '请以JSON格式输出关于{主题}的信息，包含以下字段：{字段列表}',
    example: '请以JSON格式输出关于秋日森林的旅游信息，包含以下字段：最佳观赏时间、推荐景点、必备物品、注意事项。',
    output: '```json\n{\n  "最佳观赏时间": "10月中旬至11月上旬",\n  "推荐景点": [\n    "枫叶大道",\n    "国家森林公园",\n    "高山湖泊风景区",\n    "红枫谷"\n  ],\n  "必备物品": [\n    "防风保暖外套",\n    "防滑徒步鞋",\n    "相机及备用电池",\n    "保温杯",\n    "应急药品"\n  ],\n  "注意事项": [\n    "早晚温差大，注意添减衣物",\n    "秋季干燥，注意森林防火",\n    "部分山区可能有雾，注意安全",\n    "建议提前预订住宿"\n  ]\n}\n```'
  }
])

const selectedTechnique = ref(techniques.value[0])
const userTopic = ref('秋日森林')
const isGenerating = ref(false)
const generatedOutput = ref('')
const activeTab = ref<'techniques' | 'comparison' | 'code' | 'knowledge'>('techniques')

const comparisonTests = ref<ComparisonTest[]>([])

const comparisonResults: Record<string, { result: string; score: number }> = {
  basic: {
    result: '秋日森林很美，有很多树，叶子变黄了。',
    score: 65
  },
  role: {
    result: '从植物学角度来看，秋日森林的叶色变化是温带落叶林的典型特征，主要由叶绿素分解和类胡萝卜素、花青素的显现所导致...',
    score: 82
  },
  fewshot: {
    result: '秋天的森林像一幅被打翻的调色盘，金黄的银杏、火红的枫叶、深绿的松柏交织在一起。漫步其中，脚下是沙沙作响的落叶地毯...',
    score: 88
  },
  cot: {
    result: '要了解秋日森林的魅力，我们可以从以下几个维度来分析：\n1. 视觉层面：色彩丰富度、层次感...\n2. 听觉层面：落叶声、鸟鸣...\n3. 嗅觉层面：松针、泥土、果实...\n\n综上，秋日森林通过多感官的沉浸体验...',
    score: 90
  },
  structured: {
    result: '```json\n{\n  "景观特色": "层林尽染，五彩斑斓",\n  "生态价值": "碳汇、生物多样性",\n  "旅游经济": "带动周边产业发展"\n}\n```',
    score: 85
  }
}

const codeExample = `// LangChain.js 提示词工程实践
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0.7 })

// 1. 基础提示模板
const basicPrompt = ChatPromptTemplate.fromTemplate('请写一段关于{topic}的介绍。')
const basicChain = basicPrompt.pipe(model)
const basicResult = await basicChain.invoke({ topic: '秋日森林' })

// 2. 角色设定
const rolePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一位资深的{role}，请以专业的角度回答问题。'],
  ['human', '{question}']
])
const roleChain = rolePrompt.pipe(model)
const roleResult = await roleChain.invoke({
  role: '自然摄影师',
  question: '秋日森林怎么拍才好看？'
})

// 3. 少样本提示
const examples = [
  { input: '春天', output: '万物复苏，春暖花开，一片生机勃勃的景象。' },
  { input: '夏天', output: '绿树成荫，蝉鸣阵阵，充满热情与活力。' }
]
const examplePrompt = ChatPromptTemplate.fromMessages([
  ['human', '{input}'],
  ['ai', '{output}']
])
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
  prefix: '请用诗意的语言描述季节：',
  suffix: ['human', '{input}'],
  inputVariables: ['input']
})
const fewShotChain = fewShotPrompt.pipe(model)

// 4. 结构化输出
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    bestTime: z.string().describe('最佳观赏时间'),
    attractions: z.array(z.string()).describe('推荐景点'),
    tips: z.array(z.string()).describe('旅游建议')
  })
)
const structuredPrompt = ChatPromptTemplate.fromTemplate(
  '请提供关于{topic}的旅游信息。\\n{format_instructions}'
)
const structuredChain = structuredPrompt.pipe(model).pipe(parser)
const structuredResult = await structuredChain.invoke({
  topic: '秋日森林',
  format_instructions: parser.getFormatInstructions()
})`

const knowledgePoints = [
  { title: '什么是提示词工程', content: '提示词工程（Prompt Engineering）是一门设计和优化提示词的艺术与科学，旨在让大语言模型更好地理解和执行任务，产出更高质量、更符合预期的结果。' },
  { title: '核心原则', content: '1. 明确具体：避免模糊不清的表述\n2. 提供上下文：给出必要的背景信息\n3. 设定角色：让模型以特定身份回答\n4. 示例引导：用示例说明期望的输出\n5. 分步思考：引导模型逐步推理' },
  { title: '常用技巧', content: '• 角色设定（Role Prompting）\n• 少样本学习（Few-shot Learning）\n• 思维链（Chain of Thought）\n• 结构化输出（Structured Output）\n• 自我一致性（Self-Consistency）\n• 思维树（Tree of Thoughts）' },
  { title: 'LangChain 支持', content: '• ChatPromptTemplate：消息模板\n• FewShotPromptTemplate：少样本模板\n• 输出解析器：JSON、列表、日期等\n• 提示词序列化：加载/保存模板\n• Hub 集成：分享和复用提示词' }
]

function selectTechnique(tech: PromptTechnique) {
  selectedTechnique.value = tech
  generatedOutput.value = ''
}

async function generateOutput() {
  if (isGenerating.value) return
  isGenerating.value = true
  generatedOutput.value = ''

  await new Promise(r => setTimeout(r, 800))

  const output = selectedTechnique.value.output
  let i = 0
  const timer = setInterval(() => {
    if (i < output.length) {
      generatedOutput.value += output[i]
      i++
    } else {
      clearInterval(timer)
      isGenerating.value = false
    }
  }, 15)
}

async function runComparison() {
  comparisonTests.value = []
  for (let i = 0; i < techniques.value.length; i++) {
    const tech = techniques.value[i]
    const result = comparisonResults[tech.id] || { result: '...', score: 0 }
    await new Promise(r => setTimeout(r, 400))
    comparisonTests.value.push({
      id: i + 1,
      technique: tech.name,
      prompt: tech.example,
      result: result.result,
      score: result.score
    })
  }
}

const scoreColor = (score: number) => {
  if (score >= 85) return '#6b9e78'
  if (score >= 70) return '#e6a23c'
  return '#c8703c'
}
</script>

<template>
  <div class="demo-card">
    <h3>提示词工程最佳实践</h3>
    <p class="subtitle">掌握高质量提示词的设计技巧与方法</p>

    <div class="tabs">
      <button :class="{ active: activeTab === 'techniques' }" @click="activeTab = 'techniques'">技巧演示</button>
      <button :class="{ active: activeTab === 'comparison' }" @click="activeTab = 'comparison'">效果对比</button>
      <button :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">代码示例</button>
      <button :class="{ active: activeTab === 'knowledge' }" @click="activeTab = 'knowledge'">知识点</button>
    </div>

    <div v-if="activeTab === 'techniques'" class="tab-content">
      <div class="tech-layout">
        <div class="tech-sidebar">
          <h4>提示词技巧</h4>
          <div class="tech-list">
            <div
              v-for="tech in techniques"
              :key="tech.id"
              class="tech-item"
              :class="{ active: selectedTechnique.id === tech.id }"
              @click="selectTechnique(tech)"
            >
              <span class="tech-icon">{{ tech.icon }}</span>
              <span class="tech-name">{{ tech.name }}</span>
            </div>
          </div>
        </div>

        <div class="tech-main">
          <div class="tech-header">
            <h4>{{ selectedTechnique.icon }} {{ selectedTechnique.name }}</h4>
            <p class="tech-desc">{{ selectedTechnique.description }}</p>
          </div>

          <div class="prompt-section">
            <label>提示词模板</label>
            <div class="prompt-template">
              <pre>{{ selectedTechnique.template }}</pre>
            </div>
          </div>

          <div class="prompt-section">
            <label>示例输入</label>
            <div class="prompt-example">
              <pre>{{ selectedTechnique.example }}</pre>
            </div>
          </div>

          <button class="generate-btn" :disabled="isGenerating" @click="generateOutput">
            {{ isGenerating ? '生成中...' : '运行示例' }}
          </button>

          <div v-if="generatedOutput" class="output-section">
            <label>生成结果</label>
            <div class="output-box">
              <pre style="white-space: pre-wrap;">{{ generatedOutput }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'comparison'" class="tab-content">
      <div class="comparison-header">
        <p>对比不同提示词技巧的输出效果</p>
        <button class="compare-btn" @click="runComparison">运行对比测试</button>
      </div>

      <div v-if="comparisonTests.length > 0" class="comparison-grid">
        <div v-for="test in comparisonTests" :key="test.id" class="comparison-card">
          <div class="comparison-card-header">
            <span class="comparison-tech">{{ test.technique }}</span>
            <span class="comparison-score" :style="{ color: scoreColor(test.score) }">
              {{ test.score }} 分
            </span>
          </div>
          <div class="score-bar">
            <div
              class="score-fill"
              :style="{ width: test.score + '%', backgroundColor: scoreColor(test.score) }"
            ></div>
          </div>
          <div class="comparison-result">
            <p>{{ test.result }}</p>
          </div>
        </div>
      </div>

      <div v-else class="empty-comparison">
        <p class="empty-icon">📊</p>
        <p>点击上方按钮运行对比测试</p>
      </div>
    </div>

    <div v-if="activeTab === 'code'" class="tab-content">
      <div class="code-example">
        <pre>{{ codeExample }}</pre>
      </div>
    </div>

    <div v-if="activeTab === 'knowledge'" class="tab-content">
      <div class="knowledge-grid">
        <div v-for="(point, index) in knowledgePoints" :key="index" class="knowledge-card">
          <h5>{{ point.title }}</h5>
          <p style="white-space: pre-wrap;">{{ point.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  border: 1px solid #e8c9a0;
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #fef9f3 0%, #fdf2e6 100%);
}
h3 {
  margin: 0 0 4px;
  color: #8b5e3c;
  font-size: 18px;
}
.subtitle {
  margin: 0 0 16px;
  color: #a0623a;
  font-size: 13px;
}
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e8c9a0;
}
.tabs button {
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: #a0623a;
  cursor: pointer;
  font-size: 13px;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}
.tabs button.active {
  color: #c8703c;
  border-bottom-color: #c8703c;
  font-weight: bold;
}
.tab-content {
  min-height: 400px;
}
.tech-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
}
.tech-sidebar h4 {
  margin: 0 0 12px;
  color: #8b5e3c;
  font-size: 14px;
}
.tech-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tech-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.tech-item:hover {
  border-color: #d4a574;
}
.tech-item.active {
  background: #fde8d0;
  border-color: #c8703c;
}
.tech-icon {
  font-size: 18px;
}
.tech-name {
  font-size: 13px;
  color: #5a3e2b;
  font-weight: 500;
}
.tech-main {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tech-header h4 {
  margin: 0 0 6px;
  color: #5a3e2b;
  font-size: 16px;
}
.tech-desc {
  margin: 0;
  font-size: 13px;
  color: #8b5e3c;
  line-height: 1.6;
}
.prompt-section label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #a0623a;
  font-weight: bold;
}
.prompt-template, .prompt-example {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 6px;
  padding: 12px;
}
.prompt-template pre, .prompt-example pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #5a3e2b;
  font-family: Consolas, Monaco, monospace;
}
.generate-btn {
  padding: 10px 24px;
  background: #c8703c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}
.generate-btn:hover:not(:disabled) {
  background: #b06030;
  transform: translateY(-1px);
}
.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.output-section label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #a0623a;
  font-weight: bold;
}
.output-box {
  background: #f0f7f2;
  border: 1px solid #b8d4bf;
  border-radius: 6px;
  padding: 14px;
}
.output-box pre {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #2d5a3a;
  font-family: inherit;
}
.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.comparison-header p {
  margin: 0;
  color: #8b5e3c;
  font-size: 14px;
}
.compare-btn {
  padding: 8px 20px;
  background: #c8703c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.compare-btn:hover {
  background: #b06030;
}
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.comparison-card {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
}
.comparison-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.comparison-tech {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 13px;
}
.comparison-score {
  font-size: 14px;
  font-weight: bold;
}
.score-bar {
  height: 6px;
  background: #f3e5d0;
  border-radius: 3px;
  margin-bottom: 10px;
  overflow: hidden;
}
.score-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}
.comparison-result p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #5a3e2b;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.empty-comparison {
  text-align: center;
  padding: 60px 20px;
  color: #a0623a;
}
.empty-icon {
  font-size: 48px;
  margin: 0 0 12px;
}
.code-example {
  background: #fef9f3;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
  max-height: 500px;
  overflow-y: auto;
}
.code-example pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #5a3e2b;
  font-family: Consolas, Monaco, monospace;
}
.knowledge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.knowledge-card {
  padding: 14px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
}
.knowledge-card h5 {
  margin: 0 0 8px;
  color: #c8703c;
  font-size: 14px;
}
.knowledge-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #5a3e2b;
}
</style>
