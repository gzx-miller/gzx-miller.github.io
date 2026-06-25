<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tool {
  name: string
  description: string
  icon: string
  enabled: boolean
  schema: string
}

interface ChatMessage {
  id: number
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolName?: string
  toolResult?: string
}

const tools = ref<Tool[]>([
  {
    name: 'getWeather',
    description: '获取指定城市的实时天气信息',
    icon: '🌤️',
    enabled: true,
    schema: '{\n  "name": "getWeather",\n  "parameters": {\n    "city": "城市名称，如北京、上海",\n    "unit": "温度单位：celsius/fahrenheit"\n  }\n}'
  },
  {
    name: 'searchForestInfo',
    description: '搜索秋日森林相关的知识信息',
    icon: '🌲',
    enabled: true,
    schema: '{\n  "name": "searchForestInfo",\n  "parameters": {\n    "query": "搜索关键词",\n    "category": "类别：生态/植物/动物/旅游"\n  }\n}'
  },
  {
    name: 'calculateDistance',
    description: '计算两个地点之间的距离',
    icon: '📏',
    enabled: true,
    schema: '{\n  "name": "calculateDistance",\n  "parameters": {\n    "from": "起点城市",\n    "to": "终点城市",\n    "unit": "单位：km/mile"\n  }\n}'
  },
  {
    name: 'bookHotel',
    description: '预订指定日期和地点的酒店',
    icon: '🏨',
    enabled: false,
    schema: '{\n  "name": "bookHotel",\n  "parameters": {\n    "city": "城市名称",\n    "checkIn": "入住日期",\n    "checkOut": "离店日期",\n    "guests": "入住人数"\n  }\n}'
  }
])

const userInput = ref('')
const messages = ref<ChatMessage[]>([])
const isProcessing = ref(false)
const activeTab = ref<'chat' | 'tools' | 'code' | 'knowledge'>('chat')
let messageId = 0

const mockResponses: Record<string, { toolCalls: { name: string; args: any }[]; response: string }> = {
  '北京今天天气怎么样': {
    toolCalls: [{ name: 'getWeather', args: { city: '北京', unit: 'celsius' } }],
    response: '好的，我来查询一下北京今天的天气。'
  },
  '秋日森林有什么好玩的': {
    toolCalls: [{ name: 'searchForestInfo', args: { query: '秋日森林 旅游', category: '旅游' } }],
    response: '让我搜索一下秋日森林的旅游信息。'
  },
  '从上海到杭州有多远': {
    toolCalls: [{ name: 'calculateDistance', args: { from: '上海', to: '杭州', unit: 'km' } }],
    response: '我来计算一下上海到杭州的距离。'
  },
  'default': {
    toolCalls: [],
    response: '你好！我可以帮你查询天气、搜索森林信息、计算距离等。有什么我可以帮你的吗？'
  }
}

const mockToolResults: Record<string, string> = {
  getWeather: '北京今日天气：晴转多云，气温 12°C ~ 20°C，西北风 3-4 级。空气质量良好，适合户外活动。早晚温差较大，建议携带外套。',
  searchForestInfo: '秋日森林旅游推荐：\n\n1. 最佳观赏期：10月中旬至11月上旬\n2. 推荐景点：\n   - 枫叶大道：绵延800公里的壮丽秋色\n   - 国家森林公园：丰富的植被和野生动物\n   - 山间湖泊：倒影如画的静谧美景\n3. 活动推荐：徒步、摄影、露营、观鸟\n4. 注意事项：早晚温差大，注意保暖；穿防滑徒步鞋',
  calculateDistance: '上海到杭州的距离约为 175 公里。\n\n交通方式参考：\n- 高铁：约 1 小时\n- 自驾：约 2.5 小时\n- 大巴：约 3 小时'
}

const codeExample = `// LangChain.js 函数调用与工具使用
import { ChatOpenAI } from '@langchain/openai'
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents'

// 1. 定义工具
const getWeatherTool = tool(
  async ({ city, unit }) => {
    const weather = await fetchWeatherAPI(city)
    return \`\${city}天气：\${weather.temp}\${unit === 'celsius' ? '°C' : '°F'}\`
  },
  {
    name: 'getWeather',
    description: '获取指定城市的天气信息',
    schema: z.object({
      city: z.string().describe('城市名称'),
      unit: z.enum(['celsius', 'fahrenheit']).describe('温度单位')
    })
  }
)

const searchTool = tool(
  async ({ query }) => {
    const results = await searchAPI(query)
    return results.map(r => r.title + ': ' + r.snippet).join('\\n')
  },
  {
    name: 'searchForestInfo',
    description: '搜索秋日森林相关信息',
    schema: z.object({
      query: z.string().describe('搜索关键词')
    })
  }
)

// 2. 创建 Agent
const tools = [getWeatherTool, searchTool]

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是一个乐于助人的助手，善于使用工具解决问题。'],
  ['human', '{input}'],
  ['assistant', '{agent_scratchpad}']
])

const model = new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
const agent = await createOpenAIToolsAgent({ llm: model, tools, prompt })
const agentExecutor = new AgentExecutor({ agent, tools, verbose: true })

// 3. 执行 Agent
const result = await agentExecutor.invoke({
  input: '北京今天天气怎么样？适合去森林玩吗？'
})

console.log(result.output)`

const knowledgePoints = [
  { title: '什么是函数调用', content: '函数调用（Function Calling）是大语言模型的一种能力，模型可以根据用户意图，判断是否需要调用外部工具/函数来获取信息或执行操作，并生成符合格式的调用参数。' },
  { title: '工具调用的价值', content: '• 突破模型知识截止日期限制\n• 接入实时数据和私有数据\n• 执行具体操作（发邮件、订酒店等）\n• 接入专业系统和 API\n• 构建复杂的多步骤工作流' },
  { title: 'LangChain 工具生态', content: 'LangChain 提供了丰富的内置工具：\n- 搜索引擎：Tavily、SerpAPI、DuckDuckGo\n- 数据库：SQL 数据库、向量数据库\n- 文件处理：PDF、Excel、CSV 读取\n- 代码执行：Python REPL、Bash\n- 第三方 API：天气、地图、电商等' },
  { title: 'Agent 与工具', content: 'Agent 是基于函数调用的更高阶抽象：\n1. 思考：分析问题，规划步骤\n2. 行动：选择并调用合适的工具\n3. 观察：获取工具执行结果\n4. 循环：根据结果继续思考或给出最终答案' }
]

const suggestedQuestions = [
  '北京今天天气怎么样',
  '秋日森林有什么好玩的',
  '从上海到杭州有多远'
]

function getMockResponse(query: string) {
  for (const key of Object.keys(mockResponses)) {
    if (key !== 'default' && query.includes(key.substring(0, 5))) {
      return mockResponses[key]
    }
  }
  return mockResponses['default']
}

async function sendMessage() {
  if (!userInput.value.trim() || isProcessing.value) return

  const userMsg: ChatMessage = {
    id: ++messageId,
    role: 'user',
    content: userInput.value
  }
  messages.value.push(userMsg)

  const query = userInput.value
  userInput.value = ''
  isProcessing.value = true

  await new Promise(r => setTimeout(r, 800))

  const mock = getMockResponse(query)

  const assistantMsg: ChatMessage = {
    id: ++messageId,
    role: 'assistant',
    content: mock.response,
    toolName: mock.toolCalls.length > 0 ? mock.toolCalls[0].name : undefined
  }
  messages.value.push(assistantMsg)

  if (mock.toolCalls.length > 0) {
    await new Promise(r => setTimeout(r, 1000))

    const toolCall = mock.toolCalls[0]
    const toolMsg: ChatMessage = {
      id: ++messageId,
      role: 'tool',
      content: `调用工具: ${toolCall.name}`,
      toolName: toolCall.name,
      toolResult: JSON.stringify(toolCall.args, null, 2)
    }
    messages.value.push(toolMsg)

    await new Promise(r => setTimeout(r, 1200))

    const result = mockToolResults[toolCall.name] || '工具执行完成'
    const resultMsg: ChatMessage = {
      id: ++messageId,
      role: 'tool',
      content: `工具结果: ${toolCall.name}`,
      toolName: toolCall.name,
      toolResult: result
    }
    messages.value.push(resultMsg)

    await new Promise(r => setTimeout(r, 600))

    const finalMsg: ChatMessage = {
      id: ++messageId,
      role: 'assistant',
      content: result
    }
    messages.value.push(finalMsg)
  }

  isProcessing.value = false
}

function useSuggestion(q: string) {
  userInput.value = q
  sendMessage()
}

function toggleTool(tool: Tool) {
  tool.enabled = !tool.enabled
}

function clearChat() {
  messages.value = []
}
</script>

<template>
  <div class="demo-card">
    <h3>函数调用与工具扩展</h3>
    <p class="subtitle">通过 LangChain Tools 为大模型赋予外部能力</p>

    <div class="tabs">
      <button :class="{ active: activeTab === 'chat' }" @click="activeTab = 'chat'">对话演示</button>
      <button :class="{ active: activeTab === 'tools' }" @click="activeTab = 'tools'">工具列表</button>
      <button :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">代码示例</button>
      <button :class="{ active: activeTab === 'knowledge' }" @click="activeTab = 'knowledge'">知识点</button>
    </div>

    <div v-if="activeTab === 'chat'" class="tab-content">
      <div class="chat-container">
        <div class="chat-messages">
          <div v-if="messages.length === 0" class="empty-state">
            <p class="empty-icon">🤖</p>
            <p class="empty-text">你好！我可以调用各种工具来帮你解决问题。</p>
            <div class="suggestions">
              <p class="suggestion-label">试试这些问题：</p>
              <div class="suggestion-buttons">
                <button v-for="q in suggestedQuestions" :key="q" @click="useSuggestion(q)">
                  {{ q }}
                </button>
              </div>
            </div>
          </div>

          <div v-for="msg in messages" :key="msg.id" class="message" :class="msg.role">
            <div class="message-bubble">
              <div v-if="msg.role === 'user'" class="msg-content user-msg">
                {{ msg.content }}
              </div>
              <div v-else-if="msg.role === 'assistant'" class="msg-content assistant-msg">
                <span v-if="msg.toolName" class="tool-indicator">
                  <span class="tool-dot"></span>
                  正在调用 {{ msg.toolName }}...
                </span>
                {{ msg.content }}
              </div>
              <div v-else class="msg-content tool-msg">
                <div class="tool-header">
                  <span class="tool-icon">🔧</span>
                  <span class="tool-title">{{ msg.content }}</span>
                </div>
                <pre class="tool-result">{{ msg.toolResult }}</pre>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <input
            v-model="userInput"
            placeholder="输入你的问题..."
            @keyup.enter="sendMessage"
          />
          <button :disabled="isProcessing" @click="sendMessage">
            {{ isProcessing ? '处理中...' : '发送' }}
          </button>
          <button class="clear-btn" @click="clearChat">清空</button>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'tools'" class="tab-content">
      <div class="tools-grid">
        <div v-for="tool in tools" :key="tool.name" class="tool-card" :class="{ disabled: !tool.enabled }">
          <div class="tool-card-header">
            <span class="tool-icon">{{ tool.icon }}</span>
            <div class="tool-info">
              <h5>{{ tool.name }}</h5>
              <p>{{ tool.description }}</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="tool.enabled" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="tool-schema">
            <small>参数定义</small>
            <pre>{{ tool.schema }}</pre>
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
  min-height: 350px;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  overflow: hidden;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a0623a;
}
.empty-icon {
  font-size: 48px;
  margin: 0 0 12px;
}
.empty-text {
  margin: 0 0 20px;
  font-size: 14px;
}
.suggestions {
  margin-top: 16px;
}
.suggestion-label {
  font-size: 12px;
  color: #8b5e3c;
  margin: 0 0 10px;
}
.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.suggestion-buttons button {
  padding: 6px 14px;
  background: #fde8d0;
  border: 1px solid #d4a574;
  border-radius: 16px;
  color: #8b5e3c;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.suggestion-buttons button:hover {
  background: #f5d5b0;
}
.message {
  display: flex;
}
.message.user {
  justify-content: flex-end;
}
.message-bubble {
  max-width: 80%;
}
.msg-content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.6;
}
.user-msg {
  background: #c8703c;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.assistant-msg {
  background: #fef9f3;
  color: #5a3e2b;
  border: 1px solid #e8c9a0;
  border-bottom-left-radius: 4px;
}
.tool-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b9e78;
  margin-bottom: 6px;
  font-weight: bold;
}
.tool-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b9e78;
  animation: pulse-dot 1.5s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.tool-msg {
  background: #f0f7f2;
  border: 1px solid #b8d4bf;
  border-radius: 8px;
  padding: 10px 12px;
}
.tool-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.tool-title {
  font-weight: bold;
  font-size: 12px;
  color: #2d5a3a;
}
.tool-result {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: #3d6b4a;
  white-space: pre-wrap;
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
}
.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e8c9a0;
  background: #fef9f3;
}
.chat-input-area input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d4a574;
  border-radius: 6px;
  font-size: 14px;
}
.chat-input-area button {
  padding: 10px 18px;
  background: #c8703c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.chat-input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.clear-btn {
  background: #fff !important;
  color: #8b5e3c !important;
  border: 1px solid #d4a574 !important;
}
.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.tool-card {
  background: #fff;
  border: 1px solid #e8c9a0;
  border-radius: 8px;
  padding: 14px;
  transition: all 0.2s;
}
.tool-card.disabled {
  opacity: 0.6;
}
.tool-card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}
.tool-card .tool-icon {
  font-size: 28px;
}
.tool-info {
  flex: 1;
}
.tool-info h5 {
  margin: 0 0 4px;
  color: #5a3e2b;
  font-size: 14px;
}
.tool-info p {
  margin: 0;
  font-size: 12px;
  color: #8b5e3c;
  line-height: 1.5;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
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
  transform: translateX(20px);
}
.tool-schema small {
  color: #a0623a;
  font-size: 11px;
  margin-bottom: 4px;
  display: block;
}
.tool-schema pre {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  color: #5a3e2b;
  background: #fef9f3;
  padding: 8px;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
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
