<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'currentcolor' | 'stroke' | 'sprite'>('currentcolor')
const iconColor = ref('#ea580c')
const iconSize = ref(24)
const strokeWidth = ref(2)
const selectedIcon = ref('acorn')

interface IconItem {
  name: string
  label: string
  svg: string
}

const iconList: IconItem[] = [
  {
    name: 'acorn',
    label: '橡果',
    svg: `<path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 2.5 1 3.5C5 12.5 3 15 3 19c0 2.5 2 3 9 3s9-.5 9-3c0-4-2-6.5-4-7.5.5-1 1-2 1-3.5 0-3.5-2.5-6-6-6z"/>`
  },
  {
    name: 'leaf',
    label: '枫叶',
    svg: `<path d="M21 12c-1-1-2-1.5-3-1.5v-2c0-.5-.5-1-1-1h-2V5c0-.5-.5-1-1-1H10c-.5 0-1 .5-1 1v2.5H7c-.5 0-1 .5-1 1v2c-1 0-2 .5-3 1.5C2 13 2 15 3 16l5 5c1 1 3 1 4 0l5-5c1-1 1-3 0-4z"/>`
  },
  {
    name: 'tree',
    label: '松树',
    svg: `<path d="M12 2L4 12h4l-4 6h5v4h6v-4h5l-4-6h4L12 2z"/>`
  },
  {
    name: 'mushroom',
    label: '蘑菇',
    svg: `<path d="M12 3C7 3 3 7 3 12h18c0-5-4-9-9-9zm-3 10v6c0 1.5 1.5 3 3 3s3-1.5 3-3v-6H9z"/>`
  },
  {
    name: 'squirrel',
    label: '松鼠',
    svg: `<circle cx="8" cy="10" r="3"/><path d="M12 8c2-1 5 0 5 4s-2 6-5 6c-1 0-2-.5-3-1 2-1 3-3 3-5s-1-3-3-4z"/><path d="M6 14c-2 1-3 3-3 5 0 2 1 3 3 3 2 0 3-2 3-4H6c-.5 0-1-.5-1-1s.5-1 1-1h2c-.5-1-1.5-2-2-2z"/>`
  },
  {
    name: 'campfire',
    label: '篝火',
    svg: `<path d="M12 3c-2 3-4 4-4 7 0 3 2 5 4 5s4-2 4-5c0-3-2-4-4-7z"/><path d="M6 17c-2 0-3 1-3 2s1 2 3 2h12c2 0 3-1 3-2s-1-2-3-2H6z"/>`
  },
  {
    name: 'tent',
    label: '帐篷',
    svg: `<path d="M12 3L2 21h20L12 3zm0 6l7 12H5l7-12z"/>`
  },
  {
    name: 'lantern',
    label: '灯笼',
    svg: `<rect x="9" y="3" width="6" height="2" rx="1"/><path d="M7 7c0-2 2-3 5-3s5 1 5 3v8c0 2-2 4-5 4s-5-2-5-4V7z"/><rect x="10" y="18" width="4" height="3" rx="1"/>`
  },
]

const colorOptions = [
  { name: '暖橙', color: '#ea580c' },
  { name: '枫红', color: '#dc2626' },
  { name: '松绿', color: '#16a34a' },
  { name: '琥珀', color: '#d97706' },
  { name: '棕褐', color: '#92400e' },
  { name: '深棕', color: '#78350f' },
]

const currentColorCode = `<span style="color:#7c7c99">// SVG 图标使用 currentColor</span>
&lt;svg <span style="color:#8a8a3a">fill="currentColor"</span>
     viewBox="0 0 24 24"&gt;
  &lt;path d="M12 2L4 12h4l-4 6h5v4h6v-4h5l-4-6h4L12 2z"/&gt;
&lt;/svg&gt;

<span style="color:#7c7c99">// 通过 color 属性控制颜色</span>
&lt;svg <span style="color:#8a8a3a">class="w-6 h-6 text-orange-500"</span> ...&gt;

<span style="color:#7c7c99">// 状态变化自动变色</span>
&lt;button class="text-gray-500 hover:text-orange-500"&gt;
  &lt;svg fill="currentColor" ...&gt;
  &lt;span&gt;收藏&lt;/span&gt;
&lt;/button&gt;`

const strokeCode = `<span style="color:#7c7c99">// 描边风格图标</span>
&lt;svg <span style="color:#8a8a3a">stroke="currentColor"</span>
     <span style="color:#8a8a3a">fill="none"</span>
     <span style="color:#8a8a3a">stroke-width="2"</span>
     <span style="color:#8a8a3a">stroke-linecap="round"</span>
     <span style="color:#8a8a3a">stroke-linejoin="round"</span>
     viewBox="0 0 24 24"&gt;
  &lt;path d="M12 2v20M2 12h20"/&gt;
&lt;/svg&gt;

<span style="color:#7c7c99">// 控制描边宽度</span>
<span style="color:#8a8a3a">stroke-1 stroke-2 stroke-[1.5px]</span>

<span style="color:#7c7c99">// 描边端点和连接</span>
<span style="color:#8a8a3a">stroke-round stroke-square stroke-butt</span>
<span style="color:#8a8a3a">stroke-join-round stroke-join-miter</span>`

const spriteCode = `<span style="color:#7c7c99">// SVG Sprite 图标系统</span>
<span style="color:#7c7c99">// 1. 定义 symbol 组件</span>
<span style="color:#a31414">// components/icons/IconSprite.vue</span>
&lt;svg width="0" height="0" style="position:absolute"&gt;
  &lt;symbol id="icon-acorn" viewBox="0 0 24 24"&gt;
    &lt;path d="M12 2C8.5 2..."/&gt;
  &lt;/symbol&gt;
  &lt;symbol id="icon-leaf" viewBox="0 0 24 24"&gt;
    &lt;path d="M21 12c-1..."/&gt;
  &lt;/symbol&gt;
&lt;/svg&gt;

<span style="color:#7c7c99">// 2. 使用 use 引用</span>
&lt;svg <span style="color:#8a8a3a">class="w-6 h-6 text-orange-500"</span>&gt;
  &lt;use href="#icon-acorn"/&gt;
&lt;/svg&gt;

<span style="color:#7c7c99">// 3. 封装成组件</span>
&lt;Icon name="acorn" <span style="color:#8a8a3a">class="w-5 h-5 text-red-500"</span> /&gt;`
</script>

<template>
  <div class="demo-card tw-demo">
    <h3>SVG 图标与当前颜色</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'currentcolor' }" @click="activeTab = 'currentcolor'">CurrentColor</button>
      <button class="tab-btn" :class="{ active: activeTab === 'stroke' }" @click="activeTab = 'stroke'">Stroke 描边</button>
      <button class="tab-btn" :class="{ active: activeTab === 'sprite' }" @click="activeTab = 'sprite'">Sprite 精灵图</button>
    </div>

    <div v-if="activeTab === 'currentcolor'">
      <div class="icon-playground">
        <h4>🎨 图标颜色与大小控制</h4>
        <div class="icon-preview-area">
          <div class="big-icon" :style="{ color: iconColor, fontSize: `${iconSize * 2}px` }">
            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
              <path v-html="iconList.find(i => i.name === selectedIcon)?.svg" />
            </svg>
          </div>
          <div class="icon-name">{{ iconList.find(i => i.name === selectedIcon)?.label }}</div>
        </div>

        <div class="control-section">
          <div class="ctrl-row">
            <span class="ctrl-label">颜色</span>
            <div class="color-options">
              <button v-for="c in colorOptions" :key="c.color"
                      :style="{ backgroundColor: c.color }"
                      :class="{ active: iconColor === c.color }"
                      class="color-dot"
                      @click="iconColor = c.color"
                      :title="c.name">
              </button>
              <input type="color" v-model="iconColor" class="color-picker-input" />
            </div>
          </div>
          <div class="ctrl-row">
            <span class="ctrl-label">大小: {{ iconSize }}px</span>
            <input type="range" v-model.number="iconSize" min="16" max="64" class="size-slider" />
          </div>
        </div>

        <div class="icon-gallery">
          <h5>秋日森林图标库</h5>
          <div class="icons-grid">
            <button v-for="icon in iconList" :key="icon.name"
                    :class="{ active: selectedIcon === icon.name }"
                    class="icon-item"
                    :style="{ color: selectedIcon === icon.name ? iconColor : '#78350f' }"
                    @click="selectedIcon = icon.name">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path v-html="icon.svg" />
              </svg>
              <span>{{ icon.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="use-case-demo">
        <h4>💡 实际应用：带图标按钮</h4>
        <div class="icon-buttons">
          <button class="icon-btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>收藏</span>
          </button>
          <button class="icon-btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            <span>分享</span>
          </button>
          <button class="icon-btn btn-outline">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>已完成</span>
          </button>
        </div>
      </div>

      <pre class="mini-code" v-html="currentColorCode"></pre>
      <div class="tips-box">
        <p><strong>CurrentColor 优势：</strong></p>
        <ul>
          <li>图标颜色跟随父元素 <code>color</code> 属性，自动继承</li>
          <li>悬停、选中、禁用等状态下自动变色，无需单独设置</li>
          <li>统一管理颜色，保持图标与文字颜色一致</li>
          <li>配合 Tailwind 的 <code>text-*</code> 工具类使用最方便</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'stroke'">
      <div class="stroke-demo">
        <h4>✏️ 描边风格图标</h4>
        <div class="stroke-preview">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"
               :style="{ color: iconColor, width: `${iconSize * 2}px`, height: `${iconSize * 2}px` }">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </div>

        <div class="stroke-controls">
          <div class="ctrl-row">
            <span class="ctrl-label">描边宽度: {{ strokeWidth }}px</span>
            <input type="range" v-model.number="strokeWidth" min="1" max="4" step="0.5" />
          </div>
          <div class="ctrl-row">
            <span class="ctrl-label">端点样式</span>
            <div class="stroke-cap-demo">
              <div class="cap-item">
                <svg width="60" height="20" stroke="#ea580c" stroke-width="4" stroke-linecap="round">
                  <line x1="5" y1="10" x2="55" y2="10"/>
                </svg>
                <span>round</span>
              </div>
              <div class="cap-item">
                <svg width="60" height="20" stroke="#ea580c" stroke-width="4" stroke-linecap="butt">
                  <line x1="5" y1="10" x2="55" y2="10"/>
                </svg>
                <span>butt</span>
              </div>
              <div class="cap-item">
                <svg width="60" height="20" stroke="#ea580c" stroke-width="4" stroke-linecap="square">
                  <line x1="5" y1="10" x2="55" y2="10"/>
                </svg>
                <span>square</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stroke-icons">
          <h5>描边图标集合</h5>
          <div class="stroke-icons-grid">
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>时钟</span>
            </div>
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>消息</span>
            </div>
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>星星</span>
            </div>
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>心形</span>
            </div>
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>搜索</span>
            </div>
            <div class="stroke-icon-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>加号</span>
            </div>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="strokeCode"></pre>
      <div class="tips-box">
        <p><strong>描边图标要点：</strong></p>
        <ul>
          <li><code>fill="none"</code> 不填充，<code>stroke="currentColor"</code> 描边颜色继承</li>
          <li><code>stroke-width</code> 控制线条粗细，支持任意值</li>
          <li><code>stroke-linecap</code> 控制端点形状（圆头/方头/平头）</li>
          <li><code>stroke-linejoin</code> 控制转角连接方式</li>
          <li>描边风格更轻盈，适合现代简约设计</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'sprite'">
      <div class="sprite-demo">
        <h4>🗂️ SVG Sprite 图标系统</h4>

        <div class="sprite-example">
          <div class="sprite-title">实际效果演示</div>
          <div class="sprite-icons-row">
            <div v-for="icon in iconList.slice(0, 6)" :key="icon.name" class="sprite-icon-item">
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" style="color: #ea580c">
                <path v-html="icon.svg" />
              </svg>
              <span>{{ icon.label }}</span>
            </div>
          </div>
        </div>

        <div class="sprite-workflow">
          <h5>📋 实现步骤</h5>
          <div class="step-list">
            <div class="step-item">
              <span class="step-num">1</span>
              <div class="step-content">
                <strong>创建图标组件库</strong>
                <p>将所有 SVG 图标统一管理，每个图标是一个 symbol</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-num">2</span>
              <div class="step-content">
                <strong>封装 Icon 组件</strong>
                <p>通过 name 属性动态引用图标，支持 size、color 等 props</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-num">3</span>
              <div class="step-content">
                <strong>全局注册使用</strong>
                <p>在项目中任意位置使用 &lt;Icon name="acorn" /&gt;</p>
              </div>
            </div>
            <div class="step-item">
              <span class="step-num">4</span>
              <div class="step-content">
                <strong>配合 Tailwind</strong>
                <p>使用 text-* 控制颜色，w-*/h-* 控制大小</p>
              </div>
            </div>
          </div>
        </div>

        <div class="icon-component-demo">
          <h5>📦 封装后的组件用法</h5>
          <div class="component-examples">
            <div class="comp-example">
              <div class="comp-preview">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="color: #6b7280">
                  <path v-html="iconList[2].svg" />
                </svg>
                <span>默认大小颜色</span>
              </div>
              <code>&lt;Icon name="tree" /&gt;</code>
            </div>
            <div class="comp-example">
              <div class="comp-preview">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" style="color: #ea580c">
                  <path v-html="iconList[0].svg" />
                </svg>
                <span>大号橙色</span>
              </div>
              <code>&lt;Icon name="acorn" class="w-8 h-8 text-orange-500" /&gt;</code>
            </div>
            <div class="comp-example">
              <div class="comp-preview hover-demo">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style="color: #dc2626">
                  <path v-html="iconList[1].svg" />
                </svg>
                <span>悬停变色</span>
              </div>
              <code>class="text-red-500 hover:text-red-700"</code>
            </div>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="spriteCode"></pre>
      <div class="tips-box">
        <p><strong>SVG Sprite 优势：</strong></p>
        <ul>
          <li>图标只需加载一次，通过 use 引用，性能更好</li>
          <li>统一管理，易于维护和更新</li>
          <li>支持按需引入或全量引入</li>
          <li>配合 currentColor，颜色大小完全可控</li>
          <li>比字体图标更灵活，支持多色、渐变等</li>
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

.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; margin-top: 12px; }
.tips-box { background: #fff7ed; padding: 12px; border-radius: 6px; border-left: 3px solid #ea580c; margin-top: 10px; }
.tips-box p { margin: 0 0 6px; color: #7c2d12; font-weight: 600; }
.tips-box ul { margin: 0; padding-left: 20px; color: #9a3412; font-size: 13px; }
.tips-box li { margin: 4px 0; }
.tips-box code { background: #fed7aa; padding: 1px 5px; border-radius: 3px; color: #7c2d12; font-size: 11px; }

.icon-playground { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.icon-playground h4 { margin: 0 0 12px; color: #7c2d12; }
.icon-preview-area { text-align: center; padding: 24px; background: #fff; border-radius: 10px; margin-bottom: 16px; }
.big-icon { display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s; }
.icon-name { margin-top: 12px; font-size: 14px; color: #7c2d12; font-weight: 600; }

.control-section { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.ctrl-row { display: flex; align-items: center; gap: 12px; }
.ctrl-label { font-size: 13px; color: #7c2d12; font-weight: 500; min-width: 80px; }
.color-options { display: flex; gap: 8px; align-items: center; }
.color-dot { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #fff; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s; }
.color-dot:hover { transform: scale(1.1); }
.color-dot.active { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #ea580c; }
.color-picker-input { width: 32px; height: 24px; border: none; border-radius: 4px; cursor: pointer; padding: 0; }
.size-slider { flex: 1; accent-color: #ea580c; }

.icon-gallery h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.icons-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.icon-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px; background: #fff; border: 2px solid transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.icon-item:hover { background: #fff7ed; }
.icon-item.active { border-color: #ea580c; background: #ffedd5; }
.icon-item span { font-size: 11px; }

.use-case-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.use-case-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.icon-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.icon-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
.btn-primary { background: #f97316; color: #fff; }
.btn-primary:hover { background: #ea580c; }
.btn-secondary { background: #fed7aa; color: #7c2d12; }
.btn-secondary:hover { background: #fdba74; }
.btn-outline { background: #fff; color: #16a34a; border: 2px solid #16a34a !important; }
.btn-outline:hover { background: #f0fdf4; }

.stroke-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.stroke-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.stroke-preview { text-align: center; padding: 24px; background: #fff; border-radius: 10px; margin-bottom: 16px; }
.stroke-controls { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.stroke-cap-demo { display: flex; gap: 16px; }
.cap-item { display: flex; flex-direction: column; align-items: center; gap: 4px; background: #fff; padding: 8px; border-radius: 6px; }
.cap-item span { font-size: 11px; color: #7c2d12; }

.stroke-icons h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.stroke-icons-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
.stroke-icon-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px; background: #fff; border-radius: 8px; color: #ea580c; }
.stroke-icon-item span { font-size: 11px; color: #7c2d12; }

.sprite-demo { background: #fff7ed; border-radius: 12px; padding: 16px; }
.sprite-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.sprite-example { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.sprite-title { font-size: 13px; color: #7c2d12; font-weight: 600; margin-bottom: 12px; }
.sprite-icons-row { display: flex; justify-content: space-around; }
.sprite-icon-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.sprite-icon-item span { font-size: 12px; color: #7c2d12; }

.sprite-workflow { margin-bottom: 16px; }
.sprite-workflow h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.step-list { display: flex; flex-direction: column; gap: 8px; }
.step-item { display: flex; gap: 12px; padding: 10px; background: #fff; border-radius: 8px; }
.step-num { width: 24px; height: 24px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.step-content strong { display: block; color: #7c2d12; font-size: 13px; margin-bottom: 2px; }
.step-content p { margin: 0; font-size: 12px; color: #9a3412; }

.icon-component-demo h5 { margin: 0 0 10px; color: #7c2d12; font-size: 14px; }
.component-examples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.comp-example { background: #fff; border-radius: 8px; padding: 12px; text-align: center; }
.comp-preview { display: flex; flex-direction: column; align-items: center; gap: 6px; margin-bottom: 8px; font-size: 12px; color: #7c2d12; }
.hover-demo { color: #dc2626; }
.comp-example code { display: block; font-size: 11px; background: #fff7ed; padding: 6px; border-radius: 4px; color: #7c2d12; word-break: break-all; }
</style>
