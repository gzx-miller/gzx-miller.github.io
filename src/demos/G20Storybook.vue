<script setup lang="ts">
import { computed, ref } from 'vue'

const activeTab = ref<'preview' | 'stories' | 'addons'>('preview')

const buttonVariant = ref<'primary' | 'secondary' | 'outline' | 'ghost'>('primary')
const buttonSize = ref<'sm' | 'md' | 'lg'>('md')
const buttonDisabled = ref(false)
const buttonLoading = ref(false)
const buttonText = ref('点击按钮')

const currentStory = ref('primary')

const stories = [
  { id: 'primary', name: 'Primary', desc: '主要操作按钮', category: '基础' },
  { id: 'secondary', name: 'Secondary', desc: '次要操作按钮', category: '基础' },
  { id: 'outline', name: 'Outline', desc: '描边样式按钮', category: '基础' },
  { id: 'ghost', name: 'Ghost', desc: '幽灵按钮', category: '基础' },
  { id: 'sizes', name: 'Sizes', desc: '不同尺寸', category: '变体' },
  { id: 'states', name: 'States', desc: '禁用/加载状态', category: '状态' },
  { id: 'with-icon', name: 'With Icon', desc: '带图标按钮', category: '进阶' },
]

const storyCode = `<span style="color:#8a8a3a">// Button.stories.ts</span>
<span style="color:#7c7c99">// 引入组件和类型</span>
<span style="color:#cc6666">import</span> type { Meta, StoryObj } <span style="color:#cc6666">from</span> <span style="color:#a3b380">'@storybook/vue3'</span>
<span style="color:#cc6666">import</span> Button <span style="color:#cc6666">from</span> <span style="color:#a3b380">'./Button.vue'</span>

<span style="color:#7c7c99">// 元数据配置</span>
<span style="color:#cc6666">const</span> meta = {
  title: <span style="color:#a3b380">'Components/Button'</span>,
  component: Button,
  tags: [<span style="color:#a3b380">'autodocs'</span>],
  argTypes: {
    variant: {
      control: <span style="color:#a3b380">'select'</span>,
      options: [<span style="color:#a3b380">'primary'</span>, <span style="color:#a3b380">'secondary'</span>, <span style="color:#a3b380">'outline'</span>, <span style="color:#a3b380">'ghost'</span>],
    },
    size: {
      control: <span style="color:#a3b380">'select'</span>,
      options: [<span style="color:#a3b380">'sm'</span>, <span style="color:#a3b380">'md'</span>, <span style="color:#a3b380">'lg'</span>],
    },
    disabled: { control: <span style="color:#a3b380">'boolean'</span> },
  },
} <span style="color:#cc6666">satisfies</span> Meta<<span style="color:#cc6666">typeof</span> Button>

<span style="color:#cc6666">export default</span> meta

<span style="color:#7c7c99">// 定义 Story 类型</span>
<span style="color:#cc6666">type</span> Story = StoryObj<<span style="color:#cc6666">typeof</span> Button>

<span style="color:#7c7c99">// Primary 故事</span>
<span style="color:#cc6666">export const</span> Primary: Story = {
  args: {
    variant: <span style="color:#a3b380">'primary'</span>,
    size: <span style="color:#a3b380">'md'</span>,
    label: <span style="color:#a3b380">'Button'</span>,
  },
}

<span style="color:#7c7c99">// Secondary 故事</span>
<span style="color:#cc6666">export const</span> Secondary: Story = {
  args: {
    variant: <span style="color:#a3b380">'secondary'</span>,
    label: <span style="color:#a3b380">'Button'</span>,
  },
}

<span style="color:#7c7c99">// 带图标的故事</span>
<span style="color:#cc6666">export const</span> WithIcon: Story = {
  render: () <span style="color:#cc6666">=></span> ({
    components: { Button },
    template: <span style="color:#a3b380">\`
      <Button variant="primary">
        <template #icon>⭐</template>
        收藏
      </Button>
    \`</span>,
  }),
}`

const addonList = [
  { name: '@storybook/addon-controls', desc: '实时交互控制面板' },
  { name: '@storybook/addon-docs', desc: '自动生成组件文档' },
  { name: '@storybook/addon-actions', desc: '记录事件触发日志' },
  { name: '@storybook/addon-viewport', desc: '响应式布局预览' },
  { name: '@storybook/addon-backgrounds', desc: '切换背景色' },
  { name: '@storybook/addon-a11y', desc: '无障碍检测' },
  { name: '@storybook/addon-interactions', desc: '组件交互测试' },
  { name: 'storybook-addon-pseudo-states', desc: '伪状态预览（hover/focus等）' },
]

const configCode = `<span style="color:#8a8a3a">// .storybook/main.ts</span>
<span style="color:#cc6666">import</span> type { StorybookConfig } <span style="color:#cc6666">from</span> <span style="color:#a3b380">'@storybook/vue3-vite'</span>

<span style="color:#cc6666">const</span> config: StorybookConfig = {
  stories: [
    <span style="color:#a3b380">"../src/**/*.stories.@(js|jsx|ts|tsx)"</span>,
  ],
  addons: [
    <span style="color:#a3b380">"@storybook/addon-links"</span>,
    <span style="color:#a3b380">"@storybook/addon-essentials"</span>,
    <span style="color:#a3b380">"@storybook/addon-interactions"</span>,
  ],
  framework: {
    name: <span style="color:#a3b380">"@storybook/vue3-vite"</span>,
    options: {},
  },
  docs: {
    autodocs: <span style="color:#cc6666">true</span>,
  },
}

<span style="color:#cc6666">export default</span> config`

const commandCode = `<span style="color:#7c7c99"># 初始化 Storybook</span>
npx storybook@latest init

<span style="color:#7c7c99"># 启动开发服务器</span>
pnpm storybook

<span style="color:#7c7c99"># 构建静态文档</span>
pnpm build-storybook

<span style="color:#7c7c99"># 运行交互测试</span>
pnpm test-storybook`

function selectStory(id: string) {
  currentStory.value = id
  const story = stories.find(s => s.id === id)
  if (story) {
    switch (id) {
      case 'primary':
        buttonVariant.value = 'primary'
        buttonText.value = '主要按钮'
        break
      case 'secondary':
        buttonVariant.value = 'secondary'
        buttonText.value = '次要按钮'
        break
      case 'outline':
        buttonVariant.value = 'outline'
        buttonText.value = '描边按钮'
        break
      case 'ghost':
        buttonVariant.value = 'ghost'
        buttonText.value = '幽灵按钮'
        break
      case 'sizes':
        buttonVariant.value = 'primary'
        buttonText.value = '按钮'
        break
      case 'states':
        buttonVariant.value = 'primary'
        buttonText.value = '按钮'
        buttonDisabled.value = false
        buttonLoading.value = false
        break
    }
  }
}

const buttonClass = computed(() => [
  'storybook-button',
  `storybook-button--${buttonVariant.value}`,
  `storybook-button--${buttonSize.value}`,
  {
    'storybook-button--disabled': buttonDisabled.value,
    'storybook-button--loading': buttonLoading.value,
  },
])
</script>

<template>
  <div class="demo-card">
    <h3>Storybook 组件文档与可视化测试</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button class="tab-btn" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">组件预览</button>
      <button class="tab-btn" :class="{ active: activeTab === 'stories' }" @click="activeTab = 'stories'">Stories</button>
      <button class="tab-btn" :class="{ active: activeTab === 'addons' }" @click="activeTab = 'addons'">Addons</button>
    </div>

    <div v-if="activeTab === 'preview'">
      <p class="demo-hint">Storybook 提供隔离的组件开发环境，支持实时预览和交互调试。</p>

      <div class="storybook-layout">
        <div class="sidebar">
          <div class="sidebar-header">📚 组件库</div>
          <div class="sidebar-section">
            <div class="section-title">Components</div>
            <div class="section-item">
              <span class="folder-icon">📁</span> Button
              <div class="story-list">
                <div
                  v-for="story in stories"
                  :key="story.id"
                  class="story-item"
                  :class="{ active: currentStory === story.id }"
                  @click="selectStory(story.id)"
                >
                  <span class="story-icon">📄</span>
                  {{ story.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="canvas-area">
          <div class="canvas-toolbar">
            <span class="canvas-title">Canvas</span>
            <div class="canvas-actions">
              <button class="icon-btn" title="全屏">⛶</button>
              <button class="icon-btn" title="测量">📏</button>
            </div>
          </div>
          <div class="canvas-content">
            <div v-if="currentStory === 'sizes'" class="size-demo">
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--sm']">Small</button>
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--md']">Medium</button>
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--lg']">Large</button>
            </div>
            <div v-else-if="currentStory === 'states'" class="state-demo">
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--md']">Normal</button>
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--md', 'storybook-button--disabled']" disabled>Disabled</button>
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--md', 'storybook-button--loading']">
                <span class="spinner"></span> Loading
              </button>
            </div>
            <div v-else-if="currentStory === 'with-icon'" class="icon-demo">
              <button :class="['storybook-button', 'storybook-button--primary', 'storybook-button--md']">
                ⭐ 收藏
              </button>
              <button :class="['storybook-button', 'storybook-button--secondary', 'storybook-button--md']">
                ❤️ 喜欢
              </button>
              <button :class="['storybook-button', 'storybook-button--outline', 'storybook-button--md']">
                🔗 分享
              </button>
            </div>
            <button v-else :class="buttonClass" :disabled="buttonDisabled">
              <span v-if="buttonLoading" class="spinner"></span>
              {{ buttonText }}
            </button>
          </div>
        </div>

        <div class="controls-panel">
          <div class="panel-header">Controls</div>
          <div class="control-group">
            <label class="control-label">variant</label>
            <select v-model="buttonVariant" class="control-input">
              <option value="primary">primary</option>
              <option value="secondary">secondary</option>
              <option value="outline">outline</option>
              <option value="ghost">ghost</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">size</label>
            <select v-model="buttonSize" class="control-input">
              <option value="sm">sm</option>
              <option value="md">md</option>
              <option value="lg">lg</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label">label</label>
            <input v-model="buttonText" type="text" class="control-input" />
          </div>
          <div class="control-group">
            <label class="control-label">
              <input type="checkbox" v-model="buttonDisabled" />
              disabled
            </label>
          </div>
          <div class="control-group">
            <label class="control-label">
              <input type="checkbox" v-model="buttonLoading" />
              loading
            </label>
          </div>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>核心价值：</strong></p>
        <ul>
          <li>隔离开发：组件在独立环境中开发，不受业务页面干扰</li>
          <li>可视化文档：自动生成组件文档和使用示例</li>
          <li>状态全覆盖：轻松模拟各种边界状态和边缘场景</li>
          <li>协作效率：设计师、产品、开发基于同一组件库沟通</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'stories'">
      <p class="demo-hint">每个 .stories.ts 文件定义组件的多个故事，展示不同状态和用法。</p>
      
      <pre class="mini-code" v-html="storyCode"></pre>

      <div class="story-table">
        <h4>故事列表</h4>
        <table>
          <thead><tr><th>故事名</th><th>分类</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="s in stories" :key="s.id">
              <td><code>{{ s.name }}</code></td>
              <td><small>{{ s.category }}</small></td>
              <td><small>{{ s.desc }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>

      <pre class="mini-code" v-html="configCode" style="margin-top:12px;"></pre>
    </div>

    <div v-if="activeTab === 'addons'">
      <p class="demo-hint">Storybook 拥有丰富的插件生态，可扩展各种功能。</p>

      <div class="addon-grid">
        <div v-for="addon in addonList" :key="addon.name" class="addon-card">
          <div class="addon-icon">🧩</div>
          <div>
            <strong class="addon-name">{{ addon.name }}</strong>
            <p class="addon-desc">{{ addon.desc }}</p>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="commandCode" style="margin-top:12px;"></pre>

      <div class="tips-box">
        <p><strong>典型工作流：</strong></p>
        <ol>
          <li>在 Storybook 中开发组件，编写各种状态的故事</li>
          <li>使用 Controls 插件调整参数，验证组件表现</li>
          <li>使用 Interactions 插件编写交互测试用例</li>
          <li>构建静态文档站点，部署供团队查阅</li>
          <li>配合 Chromatic 进行视觉回归测试</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box ul, .tips-box ol { margin: 4px 0 0 16px; padding: 0; }
.tips-box li { font-size: 12px; margin: 2px 0; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { padding: 6px 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
.demo-hint { font-size: 13px; color: #8a6d42; margin-bottom: 10px; }

.storybook-layout {
  display: flex;
  gap: 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  height: 420px;
}

.sidebar {
  width: 180px;
  background: #fafafa;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.sidebar-header {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 13px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.sidebar-section {
  padding: 8px 0;
}

.section-title {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: bold;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-item {
  padding: 2px 0;
}

.folder-icon {
  margin-right: 4px;
  font-size: 12px;
}

.section-item > span {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 13px;
  cursor: pointer;
}

.story-list {
  margin-top: 2px;
}

.story-item {
  display: flex;
  align-items: center;
  padding: 4px 12px 4px 28px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.story-item:hover {
  background: #f0f0f0;
}

.story-item.active {
  background: #e8f4fd;
  color: #1890ff;
}

.story-icon {
  margin-right: 4px;
  font-size: 11px;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}

.canvas-title {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.canvas-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #eee;
}

.canvas-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: repeating-conic-gradient(#f8f8f8 0% 25%, #fff 0% 50%) 50% / 20px 20px;
}

.controls-panel {
  width: 220px;
  background: #fafafa;
  border-left: 1px solid #eee;
  overflow-y: auto;
}

.panel-header {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 13px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.control-group {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.control-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #444;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
}

.control-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  background: #fff;
}

.storybook-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.storybook-button--primary {
  background: #e85d04;
  color: #fff;
}
.storybook-button--primary:hover:not(:disabled) {
  background: #d45400;
}

.storybook-button--secondary {
  background: #fff3e0;
  color: #e85d04;
}
.storybook-button--secondary:hover:not(:disabled) {
  background: #ffe8cc;
}

.storybook-button--outline {
  background: #fff;
  color: #e85d04;
  border: 1px solid #e85d04 !important;
}
.storybook-button--outline:hover:not(:disabled) {
  background: #fff5eb;
}

.storybook-button--ghost {
  background: transparent;
  color: #e85d04;
}
.storybook-button--ghost:hover:not(:disabled) {
  background: #fff5eb;
}

.storybook-button--sm {
  padding: 4px 12px;
  font-size: 12px;
}

.storybook-button--md {
  padding: 8px 16px;
  font-size: 14px;
}

.storybook-button--lg {
  padding: 12px 24px;
  font-size: 16px;
}

.storybook-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.storybook-button--loading {
  opacity: 0.8;
  cursor: progress;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.size-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.state-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.icon-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.story-table h4 {
  margin: 12px 0 8px 0;
  color: #e85d04;
  font-size: 14px;
}

.addon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}

.addon-card {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: #fff8f0;
  border-radius: 6px;
  border: 1px solid #f4e0c8;
}

.addon-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.addon-name {
  display: block;
  font-size: 12px;
  color: #e85d04;
  font-family: monospace;
  margin-bottom: 2px;
}

.addon-desc {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}
</style>
