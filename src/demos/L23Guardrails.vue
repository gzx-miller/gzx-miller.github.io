<script setup lang="ts">
import { ref, computed } from 'vue'

interface GuardrailRule {
  id: string
  name: string
  icon: string
  description: string
  enabled: boolean
  severity: 'low' | 'medium' | 'high'
}

interface ValidationResult {
  rule: string
  passed: boolean
  message: string
  severity: 'low' | 'medium' | 'high'
}

interface TestCase {
  id: number
  title: string
  input: string
  expectedRisk: string
  category: string
}

const guardrailRules = ref<GuardrailRule[]>([
  {
    id: 'toxic',
    name: '有害内容检测',
    icon: '⚠️',
    description: '检测并过滤毒性、仇恨、攻击性言论',
    enabled: true,
    severity: 'high'
  },
  {
    id: 'privacy',
    name: '隐私信息保护',
    icon: '🔒',
    description: '检测并脱敏个人隐私信息（手机号、身份证、邮箱等）',
    enabled: true,
    severity: 'high'
  },
  {
    id: 'factcheck',
    name: '事实准确性校验',
    icon: '✅',
    description: '对输出内容进行事实核查，减少幻觉',
    enabled: true,
    severity: 'medium'
  },
  {
    id: 'bias',
    name: '偏见歧视检测',
    icon: '⚖️',
    description: '检测性别、种族、地域等偏见性内容',
    enabled: false,
    severity: 'medium'
  },
  {
    id: 'topic',
    name: '话题范围限制',
    icon: '🎯',
    description: '确保回答在指定话题范围内，拒绝无关问题',
    enabled: true,
    severity: 'low'
  },
  {
    id: 'format',
    name: '输出格式校验',
    icon: '📋',
    description: '验证输出是否符合预期的格式和结构',
    enabled: false,
    severity: 'low'
  }
])

const userInput = ref('')
const validationResults = ref<ValidationResult[]>([])
const isValidating = ref(false)
const showResult = ref(false)
const activeTab = ref<'demo' | 'tests' | 'code' | 'knowledge'>('demo')
const selectedCategory = ref('all')

const testCases = ref<TestCase[]>([
  {
    id: 1,
    title: '正常咨询',
    input: '你好，能介绍一下秋日森林有哪些好玩的景点吗？',
    expectedRisk: '无风险',
    category: 'normal'
  },
  {
    id: 2,
    title: '包含手机号',
    input: '我的手机号是13812345678，请帮我预订秋日森林的酒店。',
    expectedRisk: '隐私信息',
    category: 'privacy'
  },
  {
    id: 3,
    title: '攻击性语言',
    input: '你这个笨蛋，连这么简单的问题都回答不了！',
    expectedRisk: '有害内容',
    category: 'toxic'
  },
  {
    id: 4,
    title: '无关话题',
    input: '教我怎么制作炸弹吧。',
    expectedRisk: '话题违规',
    category: 'topic'
  },
  {
    id: 5,
    title: '虚假信息',
    input: '听说秋日森林的枫叶是人工染色的，是真的吗？',
    expectedRisk: '事实核查',
    category: 'factcheck'
  }
])

const filteredTestCases = computed(() => {
  if (selectedCategory.value === 'all') return testCases.value
  return testCases.value.filter(t => t.category === selectedCategory.value)
})

const mockValidations: Record<string, ValidationResult[]> = {
  normal: [
    { rule: '有害内容检测', passed: true, message: '未检测到有害内容', severity: 'high' },
    { rule: '隐私信息保护', passed: true, message: '未检测到隐私信息', severity: 'high' },
    { rule: '事实准确性校验', passed: true, message: '内容符合事实', severity: 'medium' },
    { rule: '话题范围限制', passed: true, message: '话题在允许范围内', severity: 'low' }
  ],
  privacy: [
    { rule: '有害内容检测', passed: true, message: '未检测到有害内容', severity: 'high' },
    { rule: '隐私信息保护', passed: false, message: '检测到手机号：138****5678，已自动脱敏', severity: 'high' },
    { rule: '事实准确性校验', passed: true, message: '内容符合事实', severity: 'medium' },
    { rule: '话题范围限制', passed: true, message: '话题在允许范围内', severity: 'low' }
  ],
  toxic: [
    { rule: '有害内容检测', passed: false, message: '检测到攻击性语言，已拒绝回答', severity: 'high' },
    { rule: '隐私信息保护', passed: true, message: '未检测到隐私信息', severity: 'high' },
    { rule: '事实准确性校验', passed: true, message: '无需校验', severity: 'medium' },
    { rule: '话题范围限制', passed: false, message: '内容违规，终止处理', severity: 'low' }
  ],
  topic: [
    { rule: '有害内容检测', passed: true, message: '未检测到有害内容', severity: 'high' },
    { rule: '隐私信息保护', passed: true, message: '未检测到隐私信息', severity: 'high' },
    { rule: '事实准确性校验', passed: true, message: '无需校验', severity: 'medium' },
    { rule: '话题范围限制', passed: false, message: '话题超出允许范围，拒绝回答', severity: 'low' }
  ],
  factcheck: [
    { rule: '有害内容检测', passed: true, message: '未检测到有害内容', severity: 'high' },
    { rule: '隐私信息保护', passed: true, message: '未检测到隐私信息', severity: 'high' },
    { rule: '事实准确性校验', passed: false, message: '检测到不实信息：枫叶并非人工染色，是自然的季节变化', severity: 'medium' },
    { rule: '话题范围限制', passed: true, message: '话题在允许范围内', severity: 'low' }
  ]
}

const codeExample = `// LangChain.js 输出护栏与安全验证
import { ChatOpenAI } from '@langchain/openai'
import {
  PromptLayerChatOpenAI
} from '@langchain/community/chat_models/promptlayer'
import {
  StringOutputParser
} from '@langchain/core/output_parsers'
import {
  ChatPromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'

// 1. 内容安全护栏
const safetyPrompt = ChatPromptTemplate.fromMessages([
  ['system', \`你是一个内容安全审核员。请判断以下内容是否违反安全政策。
违反政策的类型包括：
- 有害内容：仇恨言论、暴力、歧视等
- 隐私泄露：包含个人敏感信息
- 危险行为：教唆犯罪、自残等

如果内容安全，回复 "SAFE"；如果不安全，回复 "UNSAFE: 原因"\`],
  ['human', '{content}']
])

const safetyChecker = safetyPrompt.pipe(model).pipe(new StringOutputParser())

// 2. 隐私信息脱敏
function maskPrivacyInfo(text: string): string {
  return text
    .replace(/(\\d{3})\\d{4}(\\d{4})/g, '$1****$2')  // 手机号
    .replace(/[\\w.-]+@[\\w.-]+\\.\\w+/g, '***@***.***')  // 邮箱
    .replace(/\\d{17}[\\dXx]/g, '********************')  // 身份证
}

// 3. 构建带护栏的链
const answerPrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个乐于助人的助手。'],
  ['human', '{question}']
])

const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser())

const guardedChain = RunnableSequence.from([
  {
    input: (input: { question: string }) => input.question,
    check: async (input) => {
      const result = await safetyChecker.invoke({ content: input.question })
      if (result.startsWith('UNSAFE')) {
        throw new Error('内容违反安全政策：' + result.substring(7))
      }
      return input.question
    }
  },
  async (input, config) => {
    const answer = await answerChain.invoke({ question: input.check }, config)
    return maskPrivacyInfo(answer)
  }
])

// 4. 使用
try {
  const result = await guardedChain.invoke({
    question: '你好，介绍一下秋日森林'
  })
  console.log(result)
} catch (e) {
  console.error('被护栏拦截:', e.message)
}`

const knowledgePoints = [
  { title: '什么是输出护栏', content: '输出护栏（Guardrails）是指在大语言模型的输入和输出环节设置的安全检查机制，用于确保模型生成的内容符合安全、合规、伦理等要求，防止有害、错误或不当内容的产生。' },
  { title: '输入护栏', content: '• 内容安全审核：检测有害、违法内容\n•  Prompt 注入防护：防止提示词注入攻击\n• 话题范围控制：限定问答领域\n• 用户身份验证：确保授权访问\n• 频率限制：防止滥用和攻击' },
  { title: '输出护栏', content: '• 有害内容过滤：毒性、仇恨、暴力等\n• 事实准确性校验：减少幻觉和错误信息\n• 隐私信息脱敏：手机号、身份证、邮箱等\n• 偏见检测：性别、种族、地域歧视\n• 格式校验：确保输出结构符合预期' },
  { title: '实现方式', content: '1. 基于规则：关键词匹配、正则表达式\n2. 基于分类器：小模型分类、Embedding 相似度\n3. 基于 LLM：用大模型自身做审核\n4. 混合方案：多层防护，逐层过滤\n5. 第三方服务：Azure Content Safety、Perspective API 等' }
]

const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: 'normal', label: '正常' },
  { value: 'privacy', label: '隐私' },
  { value: 'toxic', label: '有害' },
  { value: 'topic', label: '话题' },
  { value: 'factcheck', label: '事实' }
]

function detectCategory(input: string): string {
  if (/1[3-9]\\d{9}/.test(input)) return 'privacy'
  if (/笨蛋|蠢货|垃圾|去死/.test(input)) return 'toxic'
  if (/炸弹|毒品|杀人|自杀/.test(input)) return 'topic'
  if (/假的|骗人|谣言|听说.*吗/.test(input)) return 'factcheck'
  return 'normal'
}

async function validateInput() {
  if (!userInput.value.trim() || isValidating.value) return

  isValidating.value = true
  showResult.value = false
  validationResults.value = []

  await new Promise(r => setTimeout(r, 600))

  const category = detectCategory(userInput.value)
  const results = mockValidations[category] || mockValidations.normal

  for (let i = 0; i < results.length; i++) {
    await new Promise(r => setTimeout(r, 300))
    validationResults.value.push(results[i])
  }

  showResult.value = true
  isValidating.value = false
}

function runTestCase(testCase: TestCase) {
  userInput.value = testCase.input
  validateInput()
}

function toggleRule(rule: GuardrailRule) {
  rule.enabled = !rule.enabled
}

const severityColor = (severity: string) => {
  switch (severity) {
    case 'high': return '#c8703c'
    case 'medium': return '#e6a23c'
    case 'low': return '#6b9e78'
    default: return '#8b5e3c'
  }
}

const overallPassed = computed(() => {
  if (validationResults.value.length === 0) return true
  return validationResults.value.every(r => r.passed)
})
</script>

<template>
  <div class="demo-card">
    <h3>输出护栏与安全验证</h3>
    <p class="subtitle">为 LLM 应用构建多层安全防护体系</p>

    <div class="tabs">
      <button :class="{ active: activeTab === 'demo' }" @click="activeTab = 'demo'">实时检测</button>
      <button :class="{ active: activeTab === 'tests' }" @click="activeTab = 'tests'">测试用例</button>
      <button :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">代码示例</button>
      <button :class="{ active: activeTab === 'knowledge' }" @click="activeTab = 'knowledge'">知识点</button>
    </div>

    <div v-if="activeTab === 'demo'" class="tab-content">
      <div class="guardrails-layout">
        <div class="rules-panel">
          <h4>护栏规则</h4>
          <div class="rules-list">
            <div v-for="rule in guardrailRules" :key="rule.id" class="rule-item">
              <div class="rule-header">
                <span class="rule-icon">{{ rule.icon }}</span>
                <div class="rule-info">
                  <span class="rule-name">{{ rule.name }}</span>
                  <span class="rule-severity" :style="{ color: severityColor(rule.severity) }">
                    {{ rule.severity === 'high' ? '高' : rule.severity === 'medium' ? '中' : '低' }}
                  </span>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="rule.enabled" />
                  <span class="slider"></span>
                </label>
              </div>
              <p class="rule-desc">{{ rule.description }}</p>
            </div>
          </div>
        </div>

        <div class="validation-panel">
          <div class="input-section">
            <h4>输入内容</h4>
            <textarea
              v-model="userInput"
              placeholder="请输入要检测的内容..."
              rows="4"
            ></textarea>
            <button class="validate-btn" :disabled="isValidating" @click="validateInput">
              {{ isValidating ? '检测中...' : '开始检测' }}
            </button>
          </div>

          <div v-if="showResult" class="results-section">
            <div class="result-summary" :class="{ passed: overallPassed, failed: !overallPassed }">
              <span class="summary-icon">{{ overallPassed ? '✅' : '⚠️' }}</span>
              <span class="summary-text">
                {{ overallPassed ? '内容安全，通过所有检测' : '检测到问题，需要处理' }}
              </span>
            </div>

            <div class="results-list">
              <div
                v-for="(result, index) in validationResults"
                :key="index"
                class="result-item"
                :class="{ passed: result.passed, failed: !result.passed }"
              >
                <div class="result-left">
                  <span class="result-icon">{{ result.passed ? '✓' : '✗' }}</span>
                  <span class="result-rule">{{ result.rule }}</span>
                </div>
                <span class="result-severity" :style="{ color: severityColor(result.severity) }">
                  {{ result.severity === 'high' ? '高' : result.severity === 'medium' ? '中' : '低' }}
                </span>
              </div>
              <div
                v-for="(result, index) in validationResults"
                :key="'msg-' + index"
                class="result-message"
                :class="{ failed: !result.passed }"
              >
                {{ result.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'tests'" class="tab-content">
      <div class="test-header">
        <h4>测试用例库</h4>
        <div class="category-filter">
          <button
            v-for="cat in categoryOptions"
            :key="cat.value"
            :class="{ active: selectedCategory === cat.value }"
            @click="selectedCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <div class="test-cases-grid">
        <div v-for="test in filteredTestCases" :key="test.id" class="test-case-card">
          <div class="test-case-header">
            <span class="test-title">{{ test.title }}</span>
            <span class="test-risk" :class="test.category">{{ test.expectedRisk }}</span>
          </div>
          <p class="test-input">{{ test.input }}</p>
          <button class="run-test-btn" @click="runTestCase(test)">运行测试</button>
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
.guardrails-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}
.rules-panel h4,
.validation-panel h4 {
  margin: 0 0 12px;
  color: #8b5e3c;
  font-size: 14px;
}
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rule-item {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 12px;
}
.rule-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.rule-icon {
  font-size: 20px;
}
.rule-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.rule-name {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 13px;
}
.rule-severity {
  font-size: 11px;
  font-weight: bold;
}
.rule-desc {
  margin: 0;
  font-size: 11px;
  color: #8b5e3c;
  line-height: 1.5;
  padding-left: 30px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d4a574;
  transition: .3s;
  border-radius: 22px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #6b9e78;
}
input:checked + .slider:before {
  transform: translateX(18px);
}
.input-section textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d4a574;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  background: #fff;
  color: #5a3e2b;
  box-sizing: border-box;
  margin-bottom: 12px;
  font-family: inherit;
}
.validate-btn {
  width: 100%;
  padding: 12px;
  background: #c8703c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.validate-btn:hover:not(:disabled) {
  background: #b06030;
}
.validate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.results-section {
  margin-top: 16px;
}
.result-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-weight: bold;
}
.result-summary.passed {
  background: #f0f7f2;
  border: 1px solid #b8d4bf;
  color: #2d5a3a;
}
.result-summary.failed {
  background: #fdf0e8;
  border: 1px solid #e8c9a0;
  color: #8b5e3c;
}
.summary-icon {
  font-size: 24px;
}
.summary-text {
  font-size: 14px;
}
.results-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 6px;
}
.result-item.passed {
  border-left: 3px solid #6b9e78;
}
.result-item.failed {
  border-left: 3px solid #c8703c;
}
.result-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.result-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}
.result-item.passed .result-icon {
  background: #6b9e78;
}
.result-item.failed .result-icon {
  background: #c8703c;
}
.result-rule {
  font-size: 13px;
  color: #5a3e2b;
}
.result-severity {
  font-size: 11px;
  font-weight: bold;
}
.result-message {
  padding: 8px 12px 8px 44px;
  font-size: 12px;
  color: #8b5e3c;
  background: #fef9f3;
  border-radius: 0 0 6px 6px;
  margin-top: -4px;
}
.result-message.failed {
  color: #c8703c;
  background: #fdf0e8;
}
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.test-header h4 {
  margin: 0;
  color: #8b5e3c;
  font-size: 14px;
}
.category-filter {
  display: flex;
  gap: 4px;
}
.category-filter button {
  padding: 6px 14px;
  border: 1px solid #d4a574;
  background: #fff;
  color: #8b5e3c;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.category-filter button.active {
  background: #c8703c;
  color: #fff;
  border-color: #c8703c;
}
.test-cases-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.test-case-card {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
}
.test-case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.test-title {
  font-weight: bold;
  color: #5a3e2b;
  font-size: 14px;
}
.test-risk {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: bold;
}
.test-risk.normal {
  background: #f0f7f2;
  color: #2d5a3a;
}
.test-risk.privacy {
  background: #fef3cd;
  color: #8b6914;
}
.test-risk.toxic {
  background: #fde2e2;
  color: #991b1b;
}
.test-risk.topic {
  background: #fdf0e8;
  color: #9a3412;
}
.test-risk.factcheck {
  background: #e0e7ff;
  color: #3730a3;
}
.test-input {
  margin: 0 0 12px;
  font-size: 12px;
  color: #8b5e3c;
  line-height: 1.6;
  padding: 10px;
  background: #fef9f3;
  border-radius: 6px;
}
.run-test-btn {
  width: 100%;
  padding: 8px;
  background: #fff;
  color: #c8703c;
  border: 1px solid #c8703c;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.run-test-btn:hover {
  background: #fde8d0;
}
.code-example {
  background: #fef9f3;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
  max-height: 550px;
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
