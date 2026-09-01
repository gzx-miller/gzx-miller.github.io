const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'colors' | 'tokens' | 'preset'>('colors')
const selectedTheme = ref('autumn')
const showCustom = ref(false)

const themes = [
  {
    id: 'autumn',
    name: '秋日森林',
    emoji: '🍁',
    primary: '#ea580c',
    secondary: '#d97706',
    accent: '#dc2626',
    bg: '#fff7ed',
    text: '#7c2d12',
    description: '暖橙调，枫叶红，松果棕'
  },
  {
    id: 'spring',
    name: '春日新绿',
    emoji: '🌱',
    primary: '#16a34a',
    secondary: '#0891b2',
    accent: '#7c3aed',
    bg: '#f0fdf4',
    text: '#14532d',
    description: '嫩绿芽，溪水蓝，紫花绽'
  },
  {
    id: 'summer',
    name: '夏日晴空',
    emoji: '☀️',
    primary: '#2563eb',
    secondary: '#0ea5e9',
    accent: '#f59e0b',
    bg: '#eff6ff',
    text: '#1e3a8a',
    description: '天空蓝，阳光黄，海风吹'
  },
  {
    id: 'winter',
    name: '冬日暖阳',
    emoji: '❄️',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f43f5e',
    bg: '#eef2ff',
    text: '#312e81',
    description: '靛蓝紫，玫红暖，白雪皑'
  },
]

const currentTheme = computed(() => themes.find(t => t.id === selectedTheme.value) || themes[0])

const colorScales = [
  { name: '50', light: true },
  { name: '100', light: true },
  { name: '200', light: true },
  { name: '300', light: false },
  { name: '400', light: false },
  { name: '500', light: false },
  { name: '600', light: false },
  { name: '700', light: false },
  { name: '800', light: false },
  { name: '900', light: false },
  { name: '950', light: false },
]

const orangeShades = [
  '#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c',
  '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'
]

const designTokens = [
  { category: '间距', tokens: [
    { name: 'spacing.0', value: '0px', example: 'p-0' },
    { name: 'spacing.1', value: '0.25rem (4px)', example: 'p-1' },
    { name: 'spacing.2', value: '0.5rem (8px)', example: 'p-2' },
    { name: 'spacing.4', value: '1rem (16px)', example: 'p-4' },
    { name: 'spacing.8', value: '2rem (32px)', example: 'p-8' },
  ]},
  { category: '字号', tokens: [
    { name: 'fontSize.xs', value: '0.75rem (12px)', example: 'text-xs' },
    { name: 'fontSize.sm', value: '0.875rem (14px)', example: 'text-sm' },
    { name: 'fontSize.base', value: '1rem (16px)', example: 'text-base' },
    { name: 'fontSize.lg', value: '1.125rem (18px)', example: 'text-lg' },
    { name: 'fontSize.xl', value: '1.25rem (20px)', example: 'text-xl' },
  ]},
  { category: '圆角', tokens: [
    { name: 'borderRadius.sm', value: '0.25rem (4px)', example: 'rounded-sm' },
    { name: 'borderRadius.md', value: '0.375rem (6px)', example: 'rounded-md' },
    { name: 'borderRadius.lg', value: '0.5rem (8px)', example: 'rounded-lg' },
    { name: 'borderRadius.xl', value: '0.75rem (12px)', example: 'rounded-xl' },
    { name: 'borderRadius.full', value: '9999px', example: 'rounded-full' },
  ]},
  { category: '阴影', tokens: [
    { name: 'boxShadow.sm', value: '0 1px 2px rgb(0 0 0 / 0.05)', example: 'shadow-sm' },
    { name: 'boxShadow.md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', example: 'shadow-md' },
    { name: 'boxShadow.lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', example: 'shadow-lg' },
    { name: 'boxShadow.xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', example: 'shadow-xl' },
  ]},
]

const presetCode = \`/** @type {import('tailwindcss').Config} */
module.exports = {
  <span style="color:#7c7c99">// 扩展预设主题</span>
  theme: {
    extend: {
      <span style="color:#7c7c99">// 自定义颜色</span>
      colors: {
        <span style="color:#8a8a3a">autumn</span>: {
          50: <span style="color:#a31414">'#fff7ed'</span>,
          100: <span style="color:#a31414">'#ffedd5'</span>,
          200: <span style="color:#a31414">'#fed7aa'</span>,
          300: <span style="color:#a31414">'#fdba74'</span>,
          400: <span style="color:#a31414">'#fb923c'</span>,
          500: <span style="color:#a31414">'#f97316'</span>,
          600: <span style="color:#a31414">'#ea580c'</span>,
          700: <span style="color:#a31414">'#c2410c'</span>,
          800: <span style="color:#a31414">'#9a3412'</span>,
          900: <span style="color:#a31414">'#7c2d12'</span>,
        },
        <span style="color:#8a8a3a">forest</span>: <span style="color:#a31414">'#166534'</span>,
      },

      <span style="color:#7c7c99">// 自定义字体</span>
      fontFamily: {
        <span style="color:#8a8a3a">sans</span>: [<span style="color:#a31414">'Inter'</span>, <span style="color:#a31414">'system-ui'</span>, <span style="color:#a31414">'sans-serif'</span>],
        <span style="color:#8a8a3a">serif</span>: [<span style="color:#a31414">'Merriweather'</span>, <span style="color:#a31414">'serif'</span>],
      },

      <span style="color:#7c7c99">// 自定义间距</span>
      spacing: {
        <span style="color:#8a8a3a">'128'</span>: <span style="color:#a31414">'32rem'</span>,
        <span style="color:#8a8a3a">'144'</span>: <span style="color:#a31414">'36rem'</span>,
      },

      <span style="color:#7c7c99">// 自定义动画</span>
      animation: {
        <span style="color:#8a8a3a">'float'</span>: <span style="color:#a31414">'float 3s ease-in-out infinite'</span>,
      },
      keyframes: {
        float: {
          <span style="color:#8a8a3a">'0%, 100%'</span>: { transform: <span style="color:#a31414">'translateY(0)'</span> },
          <span style="color:#8a8a3a">'50%'</span>: { transform: <span style="color:#a31414">'translateY(-10px)'</span> },
        }
      }
    }
  }
}\`

const designSystemCode = \`<span style="color:#7c7c99">// 设计系统配置示例</span>
<span style="color:#7c7c99">// tailwind.config.js</span>
module.exports = {
  theme: {
    extend: {
      <span style="color:#7c7c99">// 色彩系统</span>
      colors: {
        primary: { ... },   <span style="color:#7c7c99">// 主色</span>
        secondary: { ... }, <span style="color:#7c7c99">// 辅色</span>
        accent: { ... },    <span style="color:#7c7c99">// 强调色</span>
        neutral: { ... },   <span style="color:#7c7c99">// 中性色</span>
        success: { ... },   <span style="color:#7c7c99">// 成功色</span>
        warning: { ... },   <span style="color:#7c7c99">// 警告色</span>
        danger: { ... },    <span style="color:#7c7c99">// 危险色</span>
      },

      <span style="color:#7c7c99">// 字体系统</span>
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
      },

      <span style="color:#7c7c99">// 间距系统（4px 基准）</span>
      spacing: {
        'xs': '0.25rem',   <span style="color:#7c7c99">// 4px</span>
        'sm': '0.5rem',    <span style="color:#7c7c99">// 8px</span>
        'md': '1rem',      <span style="color:#7c7c99">// 16px</span>
        'lg': '1.5rem',    <span style="color:#7c7c99">// 24px</span>
        'xl': '2rem',      <span style="color:#7c7c99">// 32px</span>
      },

      <span style="color:#7c7c99">// 圆角系统</span>
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
        'pill': '9999px',
      },

      <span style="color:#7c7c99">// 阴影系统</span>
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    }
  }
}\`
<\/script>

<template>
  <div class="demo-card tw-demo">
    <h3>主题预设与设计系统配置</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'colors' }" @click="activeTab = 'colors'">色彩系统</button>
      <button class="tab-btn" :class="{ active: activeTab === 'tokens' }" @click="activeTab = 'tokens'">设计令牌</button>
      <button class="tab-btn" :class="{ active: activeTab === 'preset' }" @click="activeTab = 'preset'">Preset 配置</button>
    </div>

    <div v-if="activeTab === 'colors'">
      <div class="theme-selector">
        <h4>🎨 主题切换演示</h4>
        <div class="theme-buttons">
          <button v-for="theme in themes" :key="theme.id"
                  class="theme-btn"
                  :class="{ active: selectedTheme === theme.id }"
                  :style="{ '--theme-primary': theme.primary }"
                  @click="selectedTheme = theme.id">
            <span class="theme-emoji">{{ theme.emoji }}</span>
            <span>{{ theme.name }}</span>
          </button>
        </div>
      </div>

      <div class="theme-preview" :style="{
        '--primary': currentTheme.primary,
        '--secondary': currentTheme.secondary,
        '--accent': currentTheme.accent,
        '--bg': currentTheme.bg,
        '--text': currentTheme.text,
      }">
        <div class="preview-header">
          <h5>{{ currentTheme.emoji }} {{ currentTheme.name }}</h5>
          <p>{{ currentTheme.description }}</p>
        </div>

        <div class="preview-content">
          <div class="preview-card main">
            <div class="pc-icon">🏕️</div>
            <h6>森林露营</h6>
            <p>体验秋日森林的宁静与美好</p>
            <button class="preview-btn primary">立即预订</button>
          </div>
          <div class="preview-card secondary">
            <div class="pc-icon">🍂</div>
            <h6>枫叶漫步</h6>
            <p>踏着金色落叶走进深秋</p>
            <button class="preview-btn secondary">了解更多</button>
          </div>
          <div class="preview-card accent">
            <div class="pc-icon">🔥</div>
            <h6>篝火晚会</h6>
            <p>星光下的温暖聚会</p>
            <button class="preview-btn accent">参加活动</button>
          </div>
        </div>

        <div class="preview-colors">
          <div class="color-swatch" :style="{ backgroundColor: currentTheme.primary }">
            <span>Primary</span>
          </div>
          <div class="color-swatch" :style="{ backgroundColor: currentTheme.secondary }">
            <span>Secondary</span>
          </div>
          <div class="color-swatch" :style="{ backgroundColor: currentTheme.accent }">
            <span>Accent</span>
          </div>
        </div>
      </div>

      <div class="color-scale-demo">
        <h4>🌈 色彩色阶（以橙色为例）</h4>
        <div class="color-scale">
          <div v-for="(shade, i) in colorScales" :key="shade.name"
               class="scale-item"
               :style="{ backgroundColor: orangeShades[i] }"
               :class="{ light: shade.light }">
            <span class="scale-name">{{ shade.name }}</span>
            <span class="scale-hex">{{ orangeShades[i] }}</span>
          </div>
        </div>
        <small class="scale-note">Tailwind 默认提供 11 级色阶（50-950），数值越大颜色越深</small>
      </div>

      <div class="tips-box">
        <p><strong>色彩系统设计要点：</strong></p>
        <ul>
          <li>主色（Primary）：品牌识别色，用于主要按钮、强调元素</li>
          <li>辅色（Secondary）：衬托主色，用于次要操作、装饰元素</li>
          <li>强调色（Accent）：突出重要信息，如警示、促销标签</li>
          <li>中性色（Neutral）：文字、背景、边框，占比最大</li>
          <li>功能色：成功（绿）、警告（黄）、危险（红）、信息（蓝）</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'tokens'">
      <div class="tokens-intro">
        <h4>🔖 设计令牌（Design Tokens）</h4>
        <p>设计令牌是设计系统的最小单元，将颜色、间距、字号、圆角等抽象为可复用的变量，确保设计一致性。</p>
      </div>

      <div class="tokens-sections">
        <div v-for="section in designTokens" :key="section.category" class="token-section">
          <h5>{{ section.category }}</h5>
          <table class="token-table">
            <thead>
              <tr>
                <th>令牌名</th>
                <th>值</th>
                <th>类名示例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="token in section.tokens" :key="token.name">
                <td><code>{{ token.name }}</code></td>
                <td>{{ token.value }}</td>
                <td><code class="example">{{ token.example }}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="token-visual">
        <h5>📐 间距系统可视化</h5>
        <div class="spacing-demo">
          <div class="spacing-item">
            <div class="spacing-box p-1">p-1</div>
            <span>4px</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-box p-2">p-2</div>
            <span>8px</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-box p-4">p-4</div>
            <span>16px</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-box p-6">p-6</div>
            <span>24px</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-box p-8">p-8</div>
            <span>32px</span>
          </div>
        </div>
      </div>

      <div class="token-visual">
        <h5>🔵 圆角系统可视化</h5>
        <div class="radius-demo">
          <div class="radius-item">
            <div class="radius-box rounded-sm">sm</div>
            <span>4px</span>
          </div>
          <div class="radius-item">
            <div class="radius-box rounded-md">md</div>
            <span>6px</span>
          </div>
          <div class="radius-item">
            <div class="radius-box rounded-lg">lg</div>
            <span>8px</span>
          </div>
          <div class="radius-item">
            <div class="radius-box rounded-xl">xl</div>
            <span>12px</span>
          </div>
          <div class="radius-item">
            <div class="radius-box rounded-2xl">2xl</div>
            <span>16px</span>
          </div>
          <div class="radius-item">
            <div class="radius-box rounded-full">full</div>
            <span>9999px</span>
          </div>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>设计令牌优势：</strong></p>
        <ul>
          <li>一致性：全站使用统一的设计规范</li>
          <li>可维护：修改令牌即全局生效</li>
          <li>可扩展：新增主题只需扩展令牌</li>
          <li>协作：设计与开发共享同一套语言</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'preset'">
      <div class="preset-intro">
        <h4>⚙️ Tailwind Preset 预设</h4>
        <p>Preset 是可复用的 Tailwind 配置包，可以将设计系统封装成预设，在多个项目间共享。</p>
      </div>

      <div class="preset-workflow">
        <div class="wf-step">
          <span class="wf-num">1</span>
          <div class="wf-content">
            <strong>创建预设包</strong>
            <p>将主题配置、插件、自定义工具类打包成 npm 包</p>
          </div>
        </div>
        <div class="wf-arrow">→</div>
        <div class="wf-step">
          <span class="wf-num">2</span>
          <div class="wf-content">
            <strong>项目中引用</strong>
            <p>在 tailwind.config.js 的 presets 数组中引入</p>
          </div>
        </div>
        <div class="wf-arrow">→</div>
        <div class="wf-step">
          <span class="wf-num">3</span>
          <div class="wf-content">
            <strong>项目级覆盖</strong>
            <p>项目配置可以覆盖和扩展预设中的设置</p>
          </div>
        </div>
      </div>

      <div class="config-tabs">
        <button :class="{ active: !showCustom }" @click="showCustom = false">基础扩展</button>
        <button :class="{ active: showCustom }" @click="showCustom = true">设计系统</button>
      </div>

      <pre class="mini-code" v-html="showCustom ? designSystemCode : presetCode"></pre>

      <div class="preset-examples">
        <h5>📦 常用预设包</h5>
        <div class="preset-list">
          <div class="preset-item">
            <span class="preset-icon">🎨</span>
            <div>
              <strong>tailwindcss/themes</strong>
              <p>多主题切换预设</p>
            </div>
          </div>
          <div class="preset-item">
            <span class="preset-icon">📐</span>
            <div>
              <strong>tailwindcss/typography</strong>
              <p>排版样式预设</p>
            </div>
          </div>
          <div class="preset-item">
            <span class="preset-icon">🌈</span>
            <div>
              <strong>@tailwindcss/forms</strong>
              <p>表单样式预设</p>
            </div>
          </div>
          <div class="preset-item">
            <span class="preset-icon">🏢</span>
            <div>
              <strong>企业自定义预设</strong>
              <p>公司内部设计系统</p>
            </div>
          </div>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>Preset 使用技巧：</strong></p>
        <ul>
          <li><code>presets</code> 数组可以包含多个预设，后面的优先级更高</li>
          <li>项目配置总是覆盖预设中的相同配置</li>
          <li>预设可以嵌套其他预设，构建层级化的配置体系</li>
          <li>适合大型团队、多项目复用设计系统</li>
          <li>配合 Monorepo 管理多个预设包更高效</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.tab-btn { padding: 6px 14px; border: 1px solid #e0a06a; border-radius: 6px; background: #fff; color: #5a2f22; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.tab-btn:hover { background: #fff3e0; }
.tab-btn.active { background: #e85d04; color: #fff; border-color: #e85d04; }

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 11px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; margin-top: 12px; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }

.theme-selector { background: #fff7ed; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.theme-selector h4 { margin: 0 0 12px; color: #7c2d12; }
.theme-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.theme-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; background: #fff; border: 2px solid #fed7aa; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
.theme-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(155,75,29,0.15); }
.theme-btn.active { border-color: var(--theme-primary); background: #fff; box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary) 20%, transparent); }
.theme-emoji { font-size: 28px; }
.theme-btn span { font-size: 13px; color: #7c2d12; font-weight: 500; }

.theme-preview { background: var(--bg); border-radius: 12px; padding: 16px; margin-bottom: 16px; transition: all 0.3s; }
.preview-header { text-align: center; margin-bottom: 16px; }
.preview-header h5 { margin: 0 0 4px; color: var(--text); font-size: 18px; }
.preview-header p { margin: 0; font-size: 13px; color: var(--text); opacity: 0.7; }

.preview-content { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
.preview-card { background: #fff; border-radius: 10px; padding: 14px; text-align: center; }
.preview-card.main { border-top: 4px solid var(--primary); }
.preview-card.secondary { border-top: 4px solid var(--secondary); }
.preview-card.accent { border-top: 4px solid var(--accent); }
.pc-icon { font-size: 32px; margin-bottom: 8px; }
.preview-card h6 { margin: 0 0 4px; color: var(--text); font-size: 14px; }
.preview-card p { margin: 0 0 10px; font-size: 12px; color: var(--text); opacity: 0.7; }
.preview-btn { padding: 6px 14px; border: none; border-radius: 6px; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
.preview-btn.primary { background: var(--primary); }
.preview-btn.secondary { background: var(--secondary); }
.preview-btn.accent { background: var(--accent); }

.preview-colors { display: flex; gap: 8px; justify-content: center; }
.color-swatch { width: 80px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.color-swatch span { font-size: 11px; color: #fff; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }

.color-scale-demo { background: #fff7ed; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
.color-scale-demo h4 { margin: 0 0 12px; color: #7c2d12; font-size: 15px; }
.color-scale { display: flex; border-radius: 8px; overflow: hidden; }
.scale-item { flex: 1; padding: 10px 4px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.scale-item.light .scale-name, .scale-item.light .scale-hex { color: #7c2d12; }
.scale-item:not(.light) .scale-name, .scale-item:not(.light) .scale-hex { color: #fff; }
.scale-name { font-size: 11px; font-weight: 700; }
.scale-hex { font-size: 9px; opacity: 0.8; }
.scale-note { display: block; text-align: center; margin-top: 10px; color: #a16207; font-size: 12px; }

.tokens-intro { background: #fff7ed; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.tokens-intro h4 { margin: 0 0 6px; color: #7c2d12; }
.tokens-intro p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; }

.tokens-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.token-section h5 { margin: 0 0 8px; color: #7c2d12; font-size: 14px; }
.token-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.token-table th, .token-table td { padding: 8px 10px; border: 1px solid #fed7aa; text-align: left; }
.token-table th { background: #fed7aa; color: #7c2d12; font-weight: 600; }
.token-table td { background: #fff; color: #7c2d12; }
.token-table code { background: #fff7ed; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #c2410c; }
.token-table code.example { background: #fef3c7; color: #92400e; }

.token-visual { background: #fff7ed; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
.token-visual h5 { margin: 0 0 12px; color: #7c2d12; font-size: 14px; }
.spacing-demo, .radius-demo { display: flex; gap: 16px; align-items: flex-end; justify-content: center; flex-wrap: wrap; }
.spacing-item, .radius-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.spacing-box { background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
.p-1 { padding: 4px 8px; }
.p-2 { padding: 8px 12px; }
.p-4 { padding: 16px 20px; }
.p-6 { padding: 24px 28px; }
.p-8 { padding: 32px 36px; }
.spacing-item span, .radius-item span { font-size: 11px; color: #9a3412; }

.radius-box { width: 60px; height: 60px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; }
.rounded-sm { border-radius: 4px; }
.rounded-md { border-radius: 6px; }
.rounded-lg { border-radius: 8px; }
.rounded-xl { border-radius: 12px; }
.rounded-2xl { border-radius: 16px; }
.rounded-full { border-radius: 9999px; }

.preset-intro { background: #fff7ed; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.preset-intro h4 { margin: 0 0 6px; color: #7c2d12; }
.preset-intro p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; }

.preset-workflow { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.wf-step { flex: 1; min-width: 120px; background: #fff7ed; border-radius: 10px; padding: 12px; display: flex; gap: 10px; align-items: flex-start; }
.wf-num { width: 24px; height: 24px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.wf-content strong { display: block; color: #7c2d12; font-size: 13px; margin-bottom: 2px; }
.wf-content p { margin: 0; font-size: 11px; color: #9a3412; line-height: 1.4; }
.wf-arrow { font-size: 20px; color: #ea580c; font-weight: bold; }

.config-tabs { display: flex; gap: 6px; margin-bottom: 10px; }
.config-tabs button { padding: 6px 12px; border: 1px solid #fed7aa; border-radius: 6px; background: #fff; color: #7c2d12; cursor: pointer; font-size: 12px; }
.config-tabs button.active { background: #f97316; color: #fff; border-color: #ea580c; }

.preset-examples { margin-top: 16px; }
.preset-examples h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.preset-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.preset-item { display: flex; gap: 12px; padding: 12px; background: #fff7ed; border-radius: 10px; }
.preset-icon { font-size: 28px; }
.preset-item strong { display: block; color: #7c2d12; font-size: 13px; margin-bottom: 2px; }
.preset-item p { margin: 0; font-size: 12px; color: #9a3412; }
</style>
`;export{n as default};
