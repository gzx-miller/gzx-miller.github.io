const n=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'official' | 'custom' | 'typography'>('official')
const pluginType = ref('forms')

const officialPlugins = [
  { name: '@tailwindcss/forms', desc: '表单元素美化重置', icon: '📝', status: '官方' },
  { name: '@tailwindcss/typography', desc: '排版样式 prose 类', icon: '📖', status: '官方' },
  { name: '@tailwindcss/aspect-ratio', desc: '宽高比工具类', icon: '📐', status: '官方' },
  { name: '@tailwindcss/line-clamp', desc: '文本截断（已内置）', icon: '✂️', status: '已内置' },
  { name: '@tailwindcss/container-queries', desc: '容器查询 @container', icon: '📦', status: '官方' },
]

const customPluginCode = \`/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    <span style="color:#7c7c99">// 自定义插件函数</span>
    plugin(function({ addUtilities, addComponents, theme }) {

      <span style="color:#7c7c99">// 1. 添加自定义工具类</span>
      addUtilities({
        <span style="color:#8a8a3a">'.content-auto'</span>: {
          contentVisibility: <span style="color:#a31414">'auto'</span>,
        },
        <span style="color:#8a8a3a">'.text-shadow'</span>: {
          textShadow: <span style="color:#a31414">'0 2px 4px rgba(0,0,0,0.1)'</span>,
        },
      })

      <span style="color:#7c7c99">// 2. 添加组件类</span>
      addComponents({
        <span style="color:#8a8a3a">'.btn-primary'</span>: {
          padding: <span style="color:#a31414">'0.5rem 1rem'</span>,
          borderRadius: <span style="color:#a31414">'0.5rem'</span>,
          fontWeight: <span style="color:#a31414">'600'</span>,
          backgroundColor: theme(<span style="color:#a31414">'colors.orange.500'</span>),
          color: <span style="color:#a31414">'#fff'</span>,
          <span style="color:#8a8a3a">'&:hover'</span>: {
            backgroundColor: theme(<span style="color:#a31414">'colors.orange.600'</span>),
          },
        },
        <span style="color:#8a8a3a">'.card-autumn'</span>: {
          padding: <span style="color:#a31414">'1.5rem'</span>,
          borderRadius: <span style="color:#a31414">'1rem'</span>,
          background: <span style="color:#a31414">'linear-gradient(135deg, #fffaf1, #fff0dc)'</span>,
          border: <span style="color:#a31414">'1px solid #f0c38e'</span>,
          boxShadow: <span style="color:#a31414">'0 4px 12px rgba(155,75,29,0.1)'</span>,
        },
      })

      <span style="color:#7c7c99">// 3. 添加变体</span>
      addVariant(<span style="color:#a31414">'hocus'</span>, [<span style="color:#a31414">'&:hover'</span>, <span style="color:#a31414">'&:focus'</span>])
      addVariant(<span style="color:#a31414">'group-hocus'</span>, [<span style="color:#a31414">'.group:hover &'</span>, <span style="color:#a31414">'.group:focus &'</span>])
    })
  ]
}\`

const pluginInstallCode = \`<span style="color:#7c7c99"># 安装插件</span>
npm install @tailwindcss/forms
npm install @tailwindcss/typography

<span style="color:#7c7c99">// tailwind.config.js 中注册</span>
module.exports = {
  plugins: [
    require(<span style="color:#a31414">'@tailwindcss/forms'</span>),
    require(<span style="color:#a31414">'@tailwindcss/typography'</span>),
  ]
}\`

const typographyDemo = [
  { title: '秋日森林漫步指南', level: 'h1' },
  { title: '第一章：准备出发', level: 'h2' },
  { title: '秋天是森林最美的季节，阳光透过枫叶洒下金色光斑。小松鼠在树枝间跳跃，收集着过冬的坚果。空气中弥漫着松果和泥土的清香。', level: 'p' },
  { title: '装备清单', level: 'h3' },
  { title: '• 舒适的登山鞋\\n• 足够的饮用水\\n• 秋日保暖外套\\n• 相机记录美景', level: 'list' },
  { title: '注意事项', level: 'h3' },
  { title: '请注意保护环境，<strong>不要留下垃圾</strong>，让森林保持它原本的美丽。', level: 'p' },
]
<\/script>

<template>
  <div class="demo-card tw-demo">
    <h3>插件系统与自定义插件开发</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'official' }" @click="activeTab = 'official'">官方插件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'custom' }" @click="activeTab = 'custom'">自定义插件</button>
      <button class="tab-btn" :class="{ active: activeTab === 'typography' }" @click="activeTab === 'typography'">Typography</button>
    </div>

    <div v-if="activeTab === 'official'">
      <div class="plugin-intro">
        <h4>🔌 Tailwind 官方插件</h4>
        <p>Tailwind CSS 提供了一系列官方插件，扩展基础功能。通过 npm 安装后在配置文件中引入即可使用。</p>
      </div>

      <div class="plugin-grid">
        <div v-for="plugin in officialPlugins" :key="plugin.name"
             class="plugin-card"
             :class="{ builtin: plugin.status === '已内置' }">
          <div class="plugin-icon">{{ plugin.icon }}</div>
          <div class="plugin-info">
            <h5>{{ plugin.name }}</h5>
            <p>{{ plugin.desc }}</p>
          </div>
          <span class="plugin-status" :class="plugin.status === '官方' ? 'official' : 'builtin'">
            {{ plugin.status }}
          </span>
        </div>
      </div>

      <div class="install-section">
        <h5>📦 安装与使用</h5>
        <pre class="mini-code" v-html="pluginInstallCode"></pre>
      </div>

      <div class="plugin-demos">
        <div class="demo-switch">
          <button v-for="t in ['forms', 'aspect', 'container']" :key="t"
                  :class="{ active: pluginType === t }"
                  @click="pluginType = t as any">
            {{ t === 'forms' ? 'Forms 表单' : t === 'aspect' ? 'Aspect Ratio' : 'Container Queries' }}
          </button>
        </div>

        <div v-if="pluginType === 'forms'" class="plugin-demo-area">
          <div class="demo-form">
            <label class="form-label">
              <span>姓名</span>
              <input type="text" placeholder="请输入姓名" class="form-input" />
            </label>
            <label class="form-label">
              <span>邮箱</span>
              <input type="email" placeholder="squirrel@forest.com" class="form-input" />
            </label>
            <label class="form-label">
              <span>预约日期</span>
              <input type="date" class="form-input" />
            </label>
            <label class="form-label">
              <span>选择套餐</span>
              <select class="form-select">
                <option>基础套餐 - ¥199</option>
                <option>标准套餐 - ¥399</option>
                <option>豪华套餐 - ¥699</option>
              </select>
            </label>
            <div class="form-checkbox">
              <input type="checkbox" id="agree" class="form-check" />
              <label for="agree">我同意活动条款</label>
            </div>
            <button class="form-btn">立即预约</button>
          </div>
          <small class="demo-note">@tailwindcss/forms 提供统一的表单样式重置</small>
        </div>

        <div v-if="pluginType === 'aspect'" class="plugin-demo-area">
          <div class="aspect-demo">
            <div class="aspect-item">
              <div class="aspect-box aspect-square">
                <span>1:1 正方形</span>
              </div>
              <code>aspect-square</code>
            </div>
            <div class="aspect-item">
              <div class="aspect-box aspect-video">
                <span>16:9 视频</span>
              </div>
              <code>aspect-video</code>
            </div>
            <div class="aspect-item">
              <div class="aspect-box aspect-43">
                <span>4:3 图片</span>
              </div>
              <code>aspect-[4/3]</code>
            </div>
          </div>
          <small class="demo-note">@tailwindcss/aspect-ratio 提供宽高比工具（现已内置）</small>
        </div>

        <div v-if="pluginType === 'container'" class="plugin-demo-area">
          <div class="cq-demo">
            <div class="cq-container">
              <div class="cq-card">
                <div class="cq-emoji">🏕️</div>
                <div class="cq-content">
                  <h6>森林露营</h6>
                  <p>在星空下入睡，被鸟鸣唤醒</p>
                  <span class="cq-price">¥399/晚</span>
                </div>
              </div>
            </div>
            <div class="cq-container cq-small">
              <div class="cq-card">
                <div class="cq-emoji">🏕️</div>
                <div class="cq-content">
                  <h6>森林露营</h6>
                  <p>在星空下入睡，被鸟鸣唤醒</p>
                  <span class="cq-price">¥399/晚</span>
                </div>
              </div>
            </div>
          </div>
          <small class="demo-note">@tailwindcss/container-queries 容器查询，根据容器宽度调整样式</small>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'custom'">
      <div class="custom-plugin-intro">
        <h4>🛠️ 自定义插件开发</h4>
        <p>Tailwind 插件系统允许你通过 JavaScript 扩展 Tailwind 的功能，添加自定义工具类、组件、变体等。</p>
      </div>

      <div class="custom-demos">
        <div class="custom-demo-section">
          <h5>1. 自定义组件类 - 秋日卡片</h5>
          <div class="custom-demo-preview">
            <div class="autumn-card">
              <div class="card-header">
                <span class="card-emoji">🍁</span>
                <h6>枫叶套餐</h6>
              </div>
              <p>包含森林徒步 + 枫叶摄影 + 秋日野餐</p>
              <div class="card-footer">
                <span class="price">¥499</span>
                <button class="btn-autumn">立即预订</button>
              </div>
            </div>
          </div>
        </div>

        <div class="custom-demo-section">
          <h5>2. 自定义工具类 - 文字阴影</h5>
          <div class="custom-demo-preview text-shadow-demo">
            <span class="text-shadow-example">秋日森林 🌲</span>
          </div>
        </div>

        <div class="custom-demo-section">
          <h5>3. 自定义变体 - hocus (hover + focus)</h5>
          <div class="custom-demo-preview">
            <button class="hocus-btn">悬停或聚焦试试</button>
          </div>
        </div>
      </div>

      <div class="plugin-api-section">
        <h5>📚 插件 API 一览</h5>
        <div class="api-grid">
          <div class="api-item">
            <code>addUtilities()</code>
            <span>添加工具类</span>
          </div>
          <div class="api-item">
            <code>addComponents()</code>
            <span>添加组件类</span>
          </div>
          <div class="api-item">
            <code>addBase()</code>
            <span>添加基础样式</span>
          </div>
          <div class="api-item">
            <code>addVariant()</code>
            <span>添加变体</span>
          </div>
          <div class="api-item">
            <code>theme()</code>
            <span>获取主题配置</span>
          </div>
          <div class="api-item">
            <code>e()</code>
            <span>转义类名</span>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="customPluginCode"></pre>

      <div class="tips-box">
        <p><strong>自定义插件适用场景：</strong></p>
        <ul>
          <li>项目中重复使用的组件样式（按钮、卡片、徽章等）</li>
          <li>设计系统中需要封装的可复用模式</li>
          <li>CSS 新特性的工具类封装</li>
          <li>团队内部的样式规范封装</li>
          <li>第三方 UI 库的 Tailwind 适配</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'typography'">
      <div class="typo-intro">
        <h4>📖 Typography 排版插件</h4>
        <p>@tailwindcss/typography 提供 prose 类，为长文本内容提供美观的排版样式。非常适合博客文章、文档内容等。</p>
      </div>

      <div class="prose-demo">
        <div class="prose-custom">
          <h1>秋日森林漫步指南</h1>
          <p class="lead">秋天是森林最美的季节，让我们一起探索这片金色的秘境。</p>
          
          <h2>第一章：准备出发</h2>
          <p>秋天是森林最美的季节，阳光透过枫叶洒下金色光斑。小松鼠在树枝间跳跃，收集着过冬的坚果。空气中弥漫着松果和泥土的清香。</p>
          
          <blockquote>
            "秋日的森林，每一步都是一幅画。" — 小松鼠日记
          </blockquote>
          
          <h3>装备清单</h3>
          <ul>
            <li>舒适的登山鞋 — 走得远才看得多</li>
            <li>足够的饮用水 — 保持水分很重要</li>
            <li>秋日保暖外套 — 早晚温差大</li>
            <li>相机 — 记录美丽瞬间</li>
          </ul>
          
          <h3>注意事项</h3>
          <p>请注意保护环境，<strong>不要留下垃圾</strong>，让森林保持它原本的美丽。看到小动物请<strong>保持距离</strong>，不要投喂。</p>
          
          <h2>第二章：最佳路线</h2>
          <p>我们推荐从东门进入，沿着枫叶小径一路向北，途中会经过三个观景台，每个都有不同的秋日景色。</p>
          
          <ol>
            <li>东门入口 — 枫叶大道起点</li>
            <li>第一观景台 — 俯瞰枫叶谷</li>
            <li>松鼠谷 — 可能遇到小松鼠</li>
            <li>第二观景台 — 拍摄日落最佳点</li>
            <li>森林咖啡馆 — 休息补给站</li>
          </ol>
          
          <h4>小贴士</h4>
          <p>下午三点后光线最柔和，是摄影的黄金时间。如果运气好，还能看到<span style="background:#fef3c7; padding:2px 6px; border-radius:4px;">🦊 小狐狸</span>出没哦！</p>
        </div>
      </div>

      <div class="prose-options">
        <h5>🎨 Prose 尺寸变体</h5>
        <div class="prose-sizes">
          <span class="size-badge">prose-sm</span>
          <span class="size-badge">prose-base</span>
          <span class="size-badge active">prose-lg</span>
          <span class="size-badge">prose-xl</span>
          <span class="size-badge">prose-2xl</span>
        </div>
        <h5 style="margin-top:12px">🎨 主题颜色</h5>
        <div class="prose-colors">
          <span class="color-badge gray">prose-gray</span>
          <span class="color-badge slate">prose-slate</span>
          <span class="color-badge zinc">prose-zinc</span>
          <span class="color-badge stone">prose-stone</span>
          <span class="color-badge neutral">prose-neutral</span>
        </div>
      </div>

      <div class="tips-box">
        <p><strong>Typography 插件优势：</strong></p>
        <ul>
          <li>零配置即可获得美观的长文本排版</li>
          <li>支持多种尺寸和颜色主题</li>
          <li>自动处理标题、段落、列表、引用、代码块等</li>
          <li>可自定义样式覆盖默认设计</li>
          <li>非常适合 Markdown 渲染内容</li>
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

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 11px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }

.plugin-intro { background: #fff7ed; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
.plugin-intro h4 { margin: 0 0 6px; color: #7c2d12; }
.plugin-intro p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; }

.plugin-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.plugin-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: #fff7ed; border-radius: 10px; border: 1px solid #fed7aa; }
.plugin-card.builtin { opacity: 0.8; }
.plugin-icon { font-size: 28px; }
.plugin-info { flex: 1; }
.plugin-info h5 { margin: 0 0 2px; color: #7c2d12; font-size: 14px; }
.plugin-info p { margin: 0; font-size: 12px; color: #9a3412; }
.plugin-status { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
.plugin-status.official { background: #dbeafe; color: #1d4ed8; }
.plugin-status.builtin { background: #dcfce7; color: #15803d; }

.install-section h5 { margin: 0 0 8px; color: #7c2d12; font-size: 14px; }

.plugin-demos { margin-top: 16px; }
.demo-switch { display: flex; gap: 6px; margin-bottom: 12px; }
.demo-switch button { padding: 6px 12px; border: 1px solid #fed7aa; border-radius: 6px; background: #fff; color: #7c2d12; cursor: pointer; font-size: 12px; }
.demo-switch button.active { background: #f97316; color: #fff; border-color: #ea580c; }
.plugin-demo-area { background: #fff7ed; border-radius: 10px; padding: 16px; }

.demo-form { display: flex; flex-direction: column; gap: 10px; max-width: 320px; margin: 0 auto; }
.form-label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #7c2d12; font-weight: 500; }
.form-input, .form-select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; }
.form-input:focus, .form-select:focus { outline: none; border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.2); }
.form-checkbox { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #7c2d12; }
.form-check { width: 16px; height: 16px; accent-color: #f97316; }
.form-btn { padding: 10px; background: #f97316; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
.form-btn:hover { background: #ea580c; }
.demo-note { display: block; text-align: center; margin-top: 10px; color: #a16207; }

.aspect-demo { display: flex; gap: 16px; justify-content: center; align-items: flex-start; }
.aspect-item { text-align: center; }
.aspect-box { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fed7aa, #fdba74); border-radius: 8px; color: #7c2d12; font-weight: 600; font-size: 13px; }
.aspect-square { width: 100px; aspect-ratio: 1 / 1; }
.aspect-video { width: 160px; aspect-ratio: 16 / 9; }
.aspect-43 { width: 120px; aspect-ratio: 4 / 3; }
.aspect-item code { display: block; margin-top: 6px; font-size: 11px; color: #9a3412; background: #fef3c7; padding: 2px 6px; border-radius: 4px; }

.cq-demo { display: flex; gap: 16px; align-items: flex-start; }
.cq-container { background: #fff; border-radius: 8px; padding: 12px; }
.cq-container.cq-small { width: 200px; }
.cq-card { display: flex; gap: 10px; align-items: center; }
.cq-emoji { font-size: 36px; }
.cq-content h6 { margin: 0 0 2px; color: #7c2d12; font-size: 14px; }
.cq-content p { margin: 0 0 4px; font-size: 12px; color: #9a3412; }
.cq-price { font-size: 14px; font-weight: 700; color: #c2410c; }

.custom-plugin-intro { background: #fff7ed; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
.custom-plugin-intro h4 { margin: 0 0 6px; color: #7c2d12; }
.custom-plugin-intro p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; }

.custom-demos { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
.custom-demo-section h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.custom-demo-preview { background: #fff7ed; border-radius: 8px; padding: 16px; display: flex; justify-content: center; align-items: center; }

.autumn-card { padding: 16px; border-radius: 12px; background: linear-gradient(135deg, #fffaf1, #fff0dc); border: 1px solid #f0c38e; box-shadow: 0 4px 12px rgba(155,75,29,0.1); width: 260px; }
.card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.card-emoji { font-size: 32px; }
.card-header h6 { margin: 0; color: #7c2d12; font-size: 16px; }
.autumn-card p { margin: 0 0 12px; font-size: 13px; color: #9a3412; line-height: 1.5; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-footer .price { font-size: 20px; font-weight: 700; color: #c2410c; }
.btn-autumn { padding: 6px 14px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
.btn-autumn:hover { background: linear-gradient(135deg, #f97316, #ea580c); }

.text-shadow-demo { background: linear-gradient(135deg, #f97316, #dc2626) !important; }
.text-shadow-example { font-size: 28px; font-weight: 800; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.3); }

.hocus-btn { padding: 10px 20px; background: #fff; color: #7c2d12; border: 2px solid #fed7aa; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.hocus-btn:hover, .hocus-btn:focus { background: #f97316; color: #fff; border-color: #ea580c; outline: none; }

.plugin-api-section { margin: 16px 0; }
.plugin-api-section h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.api-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.api-item { background: #fff7ed; padding: 10px; border-radius: 8px; text-align: center; }
.api-item code { display: block; color: #c2410c; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
.api-item span { font-size: 11px; color: #9a3412; }

.typo-intro { background: #fff7ed; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
.typo-intro h4 { margin: 0 0 6px; color: #7c2d12; }
.typo-intro p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; }

.prose-demo { background: #fff; border-radius: 10px; padding: 24px; margin-bottom: 16px; max-height: 400px; overflow-y: auto; }
.prose-custom { color: #7c2d12; line-height: 1.75; }
.prose-custom h1 { font-size: 24px; font-weight: 800; color: #7c2d12; margin: 0 0 12px; }
.prose-custom h2 { font-size: 20px; font-weight: 700; color: #9a3412; margin: 20px 0 10px; }
.prose-custom h3 { font-size: 17px; font-weight: 600; color: #b45309; margin: 16px 0 8px; }
.prose-custom h4 { font-size: 15px; font-weight: 600; color: #b45309; margin: 14px 0 6px; }
.prose-custom p { margin: 10px 0; font-size: 14px; }
.prose-custom .lead { font-size: 15px; color: #9a3412; font-style: italic; }
.prose-custom blockquote { border-left: 4px solid #f97316; padding: 10px 16px; margin: 16px 0; background: #fff7ed; border-radius: 0 8px 8px 0; color: #9a3412; font-style: italic; }
.prose-custom ul, .prose-custom ol { margin: 10px 0; padding-left: 24px; }
.prose-custom li { margin: 6px 0; font-size: 14px; }
.prose-custom strong { color: #c2410c; }

.prose-options h5 { margin: 0 0 8px; color: #7c2d12; font-size: 13px; }
.prose-sizes, .prose-colors { display: flex; gap: 6px; flex-wrap: wrap; }
.size-badge, .color-badge { padding: 4px 10px; background: #fff7ed; border-radius: 6px; font-size: 11px; color: #7c2d12; border: 1px solid #fed7aa; }
.size-badge.active { background: #f97316; color: #fff; border-color: #ea580c; }
</style>
`;export{n as default};
