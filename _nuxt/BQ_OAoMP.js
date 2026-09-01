const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

interface ImageSample {
  id: number
  name: string
  description: string
  tags: string[]
  scene: string
}

interface AnalysisResult {
  type: string
  label: string
  content: string
  confidence: number
}

const imageSamples = ref<ImageSample[]>([
  {
    id: 1,
    name: '秋日林间小径',
    description: '铺满落叶的森林小路，阳光透过树叶洒下金色光斑',
    tags: ['森林', '小径', '秋季', '阳光'],
    scene: 'forest'
  },
  {
    id: 2,
    name: '枫叶特写',
    description: '红色枫叶的微距拍摄，展现叶片纹理和秋季色彩',
    tags: ['枫叶', '特写', '红色', '纹理'],
    scene: 'leaf'
  },
  {
    id: 3,
    name: '山间湖泊秋色',
    description: '群山环抱的湖泊，岸边树木倒映在平静的湖面上',
    tags: ['湖泊', '山峦', '倒影', '秋景'],
    scene: 'lake'
  }
])

const selectedImage = ref<ImageSample>(imageSamples.value[0])
const analysisMode = ref<'caption' | 'tags' | 'detail' | 'ocr'>('caption')
const isAnalyzing = ref(false)
const analysisResults = ref<AnalysisResult[]>([])
const activeTab = ref<'demo' | 'code' | 'knowledge'>('demo')

const mockResults: Record<string, AnalysisResult[]> = {
  forest_caption: [
    { type: 'caption', label: '图像描述', content: '这是一幅秋日森林的景象，一条蜿蜒的小径穿过树林，地上铺满了金黄和橙红色的落叶。阳光从高大树木的枝叶间穿透下来，在地面上形成斑驳的光影。整个画面充满了温暖的秋日氛围。', confidence: 0.95 }
  ],
  forest_tags: [
    { type: 'tag', label: '场景识别', content: '森林、小径、秋季、落叶、阳光、树木、自然景观', confidence: 0.92 },
    { type: 'tag', label: '主色调', content: '金黄色、橙红色、棕色、深绿色', confidence: 0.88 }
  ],
  forest_detail: [
    { type: 'detail', label: '场景元素', content: '• 前景：铺满落叶的小径，落叶颜色从金黄到橙红渐变\\n• 中景：两侧高大的落叶乔木，树枝交错\\n• 背景：森林深处，光线逐渐变暗\\n• 光影：丁达尔效应，阳光穿透树叶形成光束', confidence: 0.94 },
    { type: 'detail', label: '氛围分析', content: '宁静、温暖、诗意、自然、治愈系', confidence: 0.90 }
  ],
  forest_ocr: [
    { type: 'ocr', label: '文字检测', content: '未检测到明显文字内容', confidence: 0.99 }
  ],
  leaf_caption: [
    { type: 'caption', label: '图像描述', content: '这是一张枫叶的微距特写照片。叶片呈现出鲜艳的深红色，边缘带有锯齿状。叶脉清晰可见，从叶柄向四周辐射开来。叶片表面有自然的光泽，背景虚化突出了主体。', confidence: 0.96 }
  ],
  leaf_tags: [
    { type: 'tag', label: '物体识别', content: '枫叶、叶片、植物、自然', confidence: 0.97 },
    { type: 'tag', label: '视觉特征', content: '红色、特写、微距、纹理、叶脉', confidence: 0.93 }
  ],
  leaf_detail: [
    { type: 'detail', label: '叶片分析', content: '• 种类：掌状枫叶，5个裂片\\n• 颜色：深红色，带有少量橙色渐变\\n• 边缘：锯齿状叶缘\\n• 叶脉：网状脉序，主脉清晰\\n• 状态：成熟秋季叶片', confidence: 0.95 },
    { type: 'detail', label: '摄影分析', content: '微距拍摄、浅景深、逆光或侧光、主体突出、背景虚化（bokeh效果）', confidence: 0.89 }
  ],
  leaf_ocr: [
    { type: 'ocr', label: '文字检测', content: '未检测到文字内容', confidence: 0.98 }
  ],
  lake_caption: [
    { type: 'caption', label: '图像描述', content: '一幅壮丽的山间湖泊秋景图。平静的湖水如镜面般倒映着周围的山峦和树木。岸边的树木呈现出丰富的秋季色彩，有金黄、橙红、深绿等多种颜色。远处的山峰层峦叠嶂，天空晴朗。', confidence: 0.94 }
  ],
  lake_tags: [
    { type: 'tag', label: '场景识别', content: '湖泊、山脉、秋季、自然风光、倒影、树林', confidence: 0.93 },
    { type: 'tag', label: '构图特点', content: '对称构图、水平线、层次感、广角视野', confidence: 0.87 }
  ],
  lake_detail: [
    { type: 'detail', label: '景观层次', content: '• 前景：湖边的芦苇和灌木，呈现金黄色\\n• 中景：平静的湖面，清晰倒映着岸边景色\\n• 背景：连绵的山峦，山坡上五彩斑斓的树林\\n• 天空：晴朗的蓝天，少量白云', confidence: 0.92 },
    { type: 'detail', label: '季节特征', content: '典型的秋季景观，树叶变色丰富，湖水清澈，天气晴朗，是秋季摄影的黄金时节。', confidence: 0.91 }
  ],
  lake_ocr: [
    { type: 'ocr', label: '文字检测', content: '未检测到文字内容', confidence: 0.97 }
  ]
}

const codeExample = \`// LangChain.js 多模态模型调用
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0.2
})

// 1. 基础图像理解
const response = await model.invoke([
  new HumanMessage({
    content: [
      { type: 'text', text: '请描述这张图片' },
      {
        type: 'image_url',
        image_url: { url: 'data:image/png;base64,...' }
      }
    ]
  })
])

// 2. 多图对比分析
const multiImageResponse = await model.invoke([
  new HumanMessage({
    content: [
      { type: 'text', text: '比较这两张图片的异同' },
      { type: 'image_url', image_url: { url: image1Url } },
      { type: 'image_url', image_url: { url: image2Url } }
    ]
  })
])

// 3. 使用提示模板
import { ChatPromptTemplate } from '@langchain/core/prompts'

const visionPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一位专业的图像分析专家。'],
  ['human', [
    { type: 'text', text: '{question}' },
    { type: 'image_url', image_url: { url: '{imageUrl}' } }
  ]]
])

const chain = visionPrompt.pipe(model)
const result = await chain.invoke({
  question: '分析这张图片的构图和色彩',
  imageUrl: imageUrl
})\`

const knowledgePoints = [
  { title: '什么是多模态模型', content: '多模态模型是指能够同时处理和理解多种类型数据（如文本、图像、音频、视频等）的人工智能模型，它能将不同模态的信息进行关联和融合。' },
  { title: '视觉理解能力', content: '• 图像描述与字幕生成\\n• 物体检测与识别\\n• 场景理解与分类\\n• 光学字符识别（OCR）\\n• 图像问答（VQA）\\n• 视觉推理与分析' },
  { title: '典型应用场景', content: '1. 智能相册：自动标签、人脸识别、场景分类\\n2. 医疗影像：辅助诊断、病灶检测\\n3. 自动驾驶：环境感知、障碍物识别\\n4. 电商平台：商品搜索、以图搜图\\n5. 教育领域：作业批改、图表理解' },
  { title: 'LangChain 视觉支持', content: '• 支持 GPT-4o、Claude 3 等多模态模型\\n• 可传入 base64 图片或图片 URL\\n• 支持多图输入和对比分析\\n• 可与 RAG、Agent 等模式结合\\n• 支持结构化输出解析' }
]

const modeOptions = [
  { value: 'caption', label: '图像描述' },
  { value: 'tags', label: '标签识别' },
  { value: 'detail', label: '详细分析' },
  { value: 'ocr', label: '文字检测' }
]

async function analyzeImage() {
  if (isAnalyzing.value) return
  isAnalyzing.value = true
  analysisResults.value = []

  await new Promise(r => setTimeout(r, 1200))

  const key = \`\${selectedImage.value.scene}_\${analysisMode.value}\`
  const results = mockResults[key] || []

  for (let i = 0; i < results.length; i++) {
    await new Promise(r => setTimeout(r, 500))
    analysisResults.value.push(results[i])
  }

  isAnalyzing.value = false
}

function selectImage(img: ImageSample) {
  selectedImage.value = img
  analysisResults.value = []
}
<\/script>

<template>
  <div class="demo-card">
    <h3>多模态视觉理解</h3>
    <p class="subtitle">基于秋日森林主题的图像智能分析演示</p>

    <div class="tabs">
      <button :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">交互演示</button>
      <button :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">代码示例</button>
      <button :class="{ active: activeTab === 'knowledge' }" @click="activeTab = 'knowledge'">知识点</button>
    </div>

    <div v-if="activeTab === 'demo'" class="tab-content">
      <div class="main-content">
        <div class="image-panel">
          <div class="image-display">
            <div class="image-placeholder" :class="selectedImage.scene">
              <div class="image-icon">
                <span v-if="selectedImage.scene === 'forest'">🌲🍂🌳</span>
                <span v-else-if="selectedImage.scene === 'leaf'">🍁</span>
                <span v-else>🏞️</span>
              </div>
              <p class="image-name">{{ selectedImage.name }}</p>
            </div>
          </div>
          <div class="image-list">
            <div
              v-for="img in imageSamples"
              :key="img.id"
              class="image-thumb"
              :class="{ active: selectedImage.id === img.id }"
              @click="selectImage(img)"
            >
              <span class="thumb-icon">
                <span v-if="img.scene === 'forest'">🌲</span>
                <span v-else-if="img.scene === 'leaf'">🍁</span>
                <span v-else>🏞️</span>
              </span>
              <span class="thumb-name">{{ img.name }}</span>
            </div>
          </div>
        </div>

        <div class="control-panel">
          <div class="mode-selector">
            <h4>分析模式</h4>
            <div class="mode-buttons">
              <button
                v-for="mode in modeOptions"
                :key="mode.value"
                :class="{ active: analysisMode === mode.value }"
                @click="analysisMode = mode.value as any"
              >
                {{ mode.label }}
              </button>
            </div>
          </div>

          <button class="analyze-btn" :disabled="isAnalyzing" @click="analyzeImage">
            {{ isAnalyzing ? '分析中...' : '开始分析' }}
          </button>

          <div v-if="analysisResults.length > 0" class="results-section">
            <h4>分析结果</h4>
            <div v-for="(result, index) in analysisResults" :key="index" class="result-card">
              <div class="result-header">
                <span class="result-label">{{ result.label }}</span>
                <span class="result-confidence">置信度 {{ (result.confidence * 100).toFixed(0) }}%</span>
              </div>
              <p class="result-content" style="white-space: pre-wrap;">{{ result.content }}</p>
            </div>
          </div>
        </div>
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
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #a0623a;
  cursor: pointer;
  font-size: 14px;
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
  min-height: 300px;
}
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.image-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.image-display {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-placeholder {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.image-placeholder.forest {
  background: linear-gradient(180deg, #f4d03f 0%, #e67e22 50%, #8b4513 100%);
}
.image-placeholder.leaf {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #922b21 100%);
}
.image-placeholder.lake {
  background: linear-gradient(180deg, #5dade2 0%, #3498db 40%, #f39c12 70%, #d68910 100%);
}
.image-icon {
  font-size: 48px;
}
.image-name {
  margin: 0;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}
.image-list {
  display: flex;
  gap: 8px;
}
.image-thumb {
  flex: 1;
  padding: 10px 8px;
  background: #fff;
  border: 2px solid #e8c9a0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}
.image-thumb:hover {
  border-color: #d4a574;
  transform: translateY(-2px);
}
.image-thumb.active {
  border-color: #c8703c;
  background: #fde8d0;
}
.thumb-icon {
  font-size: 24px;
}
.thumb-name {
  font-size: 11px;
  color: #5a3e2b;
  text-align: center;
}
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mode-selector h4 {
  margin: 0 0 10px;
  color: #8b5e3c;
  font-size: 14px;
}
.mode-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mode-buttons button {
  padding: 8px 12px;
  border: 1px solid #d4a574;
  border-radius: 6px;
  background: #fff;
  color: #8b5e3c;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.mode-buttons button:hover {
  border-color: #c8703c;
}
.mode-buttons button.active {
  background: #c8703c;
  color: #fff;
  border-color: #c8703c;
}
.analyze-btn {
  padding: 12px 24px;
  background: #c8703c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}
.analyze-btn:hover:not(:disabled) {
  background: #b06030;
  transform: translateY(-1px);
}
.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.results-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.results-section h4 {
  margin: 0;
  color: #8b5e3c;
  font-size: 14px;
}
.result-card {
  padding: 12px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-left: 3px solid #c8703c;
  border-radius: 6px;
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.result-label {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 13px;
}
.result-confidence {
  font-size: 11px;
  color: #6b9e78;
  background: #f0f7f2;
  padding: 2px 8px;
  border-radius: 10px;
}
.result-content {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #5a3e2b;
}
.code-example {
  background: #fef9f3;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
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
`;export{n as default};
