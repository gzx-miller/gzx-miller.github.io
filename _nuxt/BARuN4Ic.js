const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref<'filters' | 'blend' | 'backdrop'>('filters')
const brightness = ref(100)
const contrast = ref(100)
const saturate = ref(100)
const sepia = ref(0)
const blur = ref(0)
const selectedBlend = ref<'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'>('normal')

const blendModes = [
  { mode: 'normal' as const, name: '正常' },
  { mode: 'multiply' as const, name: '正片叠底' },
  { mode: 'screen' as const, name: '滤色' },
  { mode: 'overlay' as const, name: '叠加' },
  { mode: 'darken' as const, name: '变暗' },
  { mode: 'lighten' as const, name: '变亮' },
  { mode: 'color-dodge' as const, name: '颜色减淡' },
  { mode: 'color-burn' as const, name: '颜色加深' },
  { mode: 'hard-light' as const, name: '强光' },
  { mode: 'soft-light' as const, name: '柔光' },
  { mode: 'difference' as const, name: '差值' },
  { mode: 'exclusion' as const, name: '排除' },
]

const filterStyle = computed(() => ({
  filter: \`brightness(\${brightness.value}%) contrast(\${contrast.value}%) saturate(\${saturate.value}%) sepia(\${sepia.value}%) blur(\${blur.value}px)\`,
}))

const filterCode = \`<span style="color:#7c7c99">// 滤镜工具类</span>
<span style="color:#8a8a3a">blur-sm</span>      <span style="color:#7c7c99">// 4px 模糊</span>
<span style="color:#8a8a3a">blur-md</span>      <span style="color:#7c7c99">// 12px 模糊</span>
<span style="color:#8a8a3a">blur-lg</span>      <span style="color:#7c7c99">// 16px 模糊</span>

<span style="color:#8a8a3a">brightness-50</span> <span style="color:#7c7c99">// 亮度 50%</span>
<span style="color:#8a8a3a">brightness-100</span><span style="color:#7c7c99">// 亮度 100%</span>
<span style="color:#8a8a3a">brightness-125</span><span style="color:#7c7c99">// 亮度 125%</span>

<span style="color:#8a8a3a">contrast-50</span>   <span style="color:#7c7c99">// 对比度 50%</span>
<span style="color:#8a8a3a">sepia-0</span>      <span style="color:#7c7c99">// 无复古色调</span>
<span style="color:#8a8a3a">sepia-100</span>    <span style="color:#7c7c99">// 完全复古</span>

<span style="color:#8a8a3a">saturate-50</span>   <span style="color:#7c7c99">// 饱和度 50%</span>
<span style="color:#8a8a3a">saturate-200</span>  <span style="color:#7c7c99">// 饱和度 200%</span>

<span style="color:#8a8a3a">grayscale-0</span>    <span style="color:#7c7c99">// 彩色</span>
<span style="color:#8a8a3a">grayscale-100</span>  <span style="color:#7c7c99">// 灰度</span>

<span style="color:#8a8a3a">invert-0</span>       <span style="color:#7c7c99">// 正常色</span>
<span style="color:#8a8a3a">invert-100</span>     <span style="color:#7c7c99">// 反色</span>

<span style="color:#7c7c99">// 任意值</span>
<span style="color:#8a8a3a">blur-[8px] brightness-[1.2]</span>\`

const blendCode = \`<span style="color:#7c7c99">// 混合模式</span>
<span style="color:#8a8a3a">mix-blend-normal</span>      <span style="color:#7c7c99">// 正常</span>
<span style="color:#8a8a3a">mix-blend-multiply</span>    <span style="color:#7c7c99">// 正片叠底</span>
<span style="color:#8a8a3a">mix-blend-screen</span>      <span style="color:#7c7c99">// 滤色</span>
<span style="color:#8a8a3a">mix-blend-overlay</span>     <span style="color:#7c7c99">// 叠加</span>
<span style="color:#8a8a3a">mix-blend-darken</span>      <span style="color:#7c7c99">// 变暗</span>
<span style="color:#8a8a3a">mix-blend-lighten</span>     <span style="color:#7c7c99">// 变亮</span>
<span style="color:#8a8a3a">mix-blend-color-dodge</span> <span style="color:#7c7c99">// 颜色减淡</span>
<span style="color:#8a8a3a">mix-blend-color-burn</span>  <span style="color:#7c7c99">// 颜色加深</span>
<span style="color:#8a8a3a">mix-blend-hard-light</span>  <span style="color:#7c7c99">// 强光</span>
<span style="color:#8a8a3a">mix-blend-soft-light</span>  <span style="color:#7c7c99">// 柔光</span>
<span style="color:#8a8a3a">mix-blend-difference</span>  <span style="color:#7c7c99">// 差值</span>
<span style="color:#8a8a3a">mix-blend-hue</span>         <span style="color:#7c7c99">// 色相</span>
<span style="color:#8a8a3a">mix-blend-saturation</span>  <span style="color:#7c7c99">// 饱和度</span>
<span style="color:#8a8a3a">mix-blend-color</span>       <span style="color:#7c7c99">// 颜色</span>
<span style="color:#8a8a3a">mix-blend-luminosity</span>  <span style="color:#7c7c99">// 明度</span>\`

const backdropCode = \`<span style="color:#7c7c99">// 背景滤镜（毛玻璃效果）</span>
<span style="color:#8a8a3a">backdrop-blur-sm</span>   <span style="color:#7c7c99">// 背景模糊 4px</span>
<span style="color:#8a8a3a">backdrop-blur-md</span>   <span style="color:#7c7c99">// 背景模糊 12px</span>
<span style="color:#8a8a3a">backdrop-blur-lg</span>   <span style="color:#7c7c99">// 背景模糊 16px</span>
<span style="color:#8a8a3a">backdrop-blur-xl</span>   <span style="color:#7c7c99">// 背景模糊 24px</span>

<span style="color:#8a8a3a">backdrop-brightness-50</span>  <span style="color:#7c7c99">// 背景亮度</span>
<span style="color:#8a8a3a">backdrop-contrast-125</span>  <span style="color:#7c7c99">// 背景对比度</span>
<span style="color:#8a8a3a">backdrop-saturate-150</span>  <span style="color:#7c7c99">// 背景饱和度</span>
<span style="color:#8a8a3a">backdrop-sepia-50</span>       <span style="color:#7c7c99">// 背景复古</span>
<span style="color:#8a8a3a">backdrop-grayscale</span>     <span style="color:#7c7c99">// 背景灰度</span>

<span style="color:#7c7c99">// 毛玻璃卡片示例</span>
&lt;div <span style="color:#8a8a3a">class="backdrop-blur-md bg-white/30</span>
     <span style="color:#8a8a3a">border border-white/40 rounded-xl"</span>&gt;
  毛玻璃卡片内容
&lt;/div&gt;\`
<\/script>

<template>
  <div class="demo-card tw-demo">
    <h3>滤镜与混合模式</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'filters' }" @click="activeTab = 'filters'">Filter 滤镜</button>
      <button class="tab-btn" :class="{ active: activeTab === 'blend' }" @click="activeTab = 'blend'">Mix Blend 混合</button>
      <button class="tab-btn" :class="{ active: activeTab === 'backdrop' }" @click="activeTab = 'backdrop'">Backdrop 背景滤镜</button>
    </div>

    <div v-if="activeTab === 'filters'">
      <div class="filter-playground">
        <h4>🎨 滤镜控制台 - 秋日森林照片</h4>
        <div class="filter-preview">
          <div class="filter-image" :style="filterStyle">
            <div class="forest-scene">
              <div class="sun">☀️</div>
              <div class="trees">
                <span v-for="n in 7" :key="n" class="tree">🌲</span>
              </div>
              <div class="ground">
                <span v-for="n in 10" :key="n" class="leaf">🍂</span>
              </div>
              <div class="squirrel">🐿️</div>
            </div>
          </div>
        </div>

        <div class="filter-controls">
          <div class="f-control">
            <label>亮度: {{ brightness }}%</label>
            <input type="range" v-model.number="brightness" min="0" max="200" />
          </div>
          <div class="f-control">
            <label>对比度: {{ contrast }}%</label>
            <input type="range" v-model.number="contrast" min="0" max="200" />
          </div>
          <div class="f-control">
            <label>饱和度: {{ saturate }}%</label>
            <input type="range" v-model.number="saturate" min="0" max="200" />
          </div>
          <div class="f-control">
            <label>复古: {{ sepia }}%</label>
            <input type="range" v-model.number="sepia" min="0" max="100" />
          </div>
          <div class="f-control">
            <label>模糊: {{ blur }}px</label>
            <input type="range" v-model.number="blur" min="0" max="10" />
          </div>
        </div>

        <button @click="brightness = 100; contrast = 100; saturate = 100; sepia = 0; blur = 0" class="reset-btn">
          重置滤镜
        </button>
      </div>

      <div class="preset-filters">
        <h4>🖼️ 预设滤镜效果（悬停对比）</h4>
        <div class="preset-grid">
          <div class="preset-item">
            <div class="preset-img original">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>原图</span>
          </div>
          <div class="preset-item">
            <div class="preset-img grayscale">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>灰度</span>
          </div>
          <div class="preset-item">
            <div class="preset-img sepia-effect">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>复古</span>
          </div>
          <div class="preset-item">
            <div class="preset-img brightness-up">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>高亮</span>
          </div>
          <div class="preset-item">
            <div class="preset-img contrast-up">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>高对比</span>
          </div>
          <div class="preset-item">
            <div class="preset-img blur-effect">
              <span class="preset-emoji">🏕️</span>
            </div>
            <span>模糊</span>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="filterCode"></pre>
      <div class="tips-box">
        <p><strong>Filter 滤镜要点：</strong></p>
        <ul>
          <li>CSS filter 属性的工具类封装，可组合使用</li>
          <li>常用于图片处理、悬停动效、特殊视觉效果</li>
          <li>模糊、亮度、对比度、饱和度、灰度、复古、反色</li>
          <li>性能注意：滤镜会消耗 GPU，大量使用时注意优化</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'blend'">
      <div class="blend-demo">
        <h4>🎭 混合模式演示</h4>
        <div class="blend-stage">
          <div class="blend-bg">
            <div class="bg-gradient"></div>
            <div class="bg-pattern">
              <span v-for="n in 20" :key="n">🍁</span>
            </div>
          </div>
          <div class="blend-overlay" :style="{ mixBlendMode: selectedBlend }">
            <div class="overlay-text">
              秋日森林
              <small>AUTUMN FOREST</small>
            </div>
          </div>
        </div>

        <div class="blend-modes">
          <button v-for="b in blendModes" :key="b.mode"
                  :class="{ active: selectedBlend === b.mode }"
                  @click="selectedBlend = b.mode"
                  class="blend-mode-btn">
            {{ b.name }}
          </button>
        </div>
      </div>

      <div class="blend-cards-demo">
        <h4>✨ 混合模式应用场景</h4>
        <div class="blend-examples">
          <div class="blend-example-card">
            <div class="example-bg bg-1">
              <div class="example-text multiply">正片叠底文字</div>
            </div>
            <span>multiply - 文字融入背景</span>
          </div>
          <div class="blend-example-card">
            <div class="example-bg bg-2">
              <div class="example-text screen">滤色发光效果</div>
            </div>
            <span>screen - 发光文字效果</span>
          </div>
          <div class="blend-example-card">
            <div class="example-bg bg-3">
              <div class="example-text overlay">叠加层次感</div>
            </div>
            <span>overlay - 增强对比</span>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="blendCode"></pre>
      <div class="tips-box">
        <p><strong>Mix Blend 混合模式要点：</strong></p>
        <ul>
          <li>控制元素内容与下方背景如何混合</li>
          <li>常用于文字特效、图片叠加、创意设计</li>
          <li>需要考虑背景颜色才能看出效果</li>
          <li>isolation: isolate 可创建新的堆叠上下文</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'backdrop'">
      <div class="backdrop-demo">
        <h4>🔮 毛玻璃效果（Backdrop Filter）</h4>
        <div class="backdrop-scene">
          <div class="backdrop-bg">
            <div class="bg-autumn">
              <div class="bg-sun">🌞</div>
              <div class="bg-trees">
                <span v-for="n in 8" :key="n">🌲</span>
              </div>
              <div class="bg-leaves">
                <span v-for="n in 12" :key="n">🍂</span>
              </div>
            </div>
          </div>

          <div class="glass-cards">
            <div class="glass-card glass-1">
              <h5>轻模糊</h5>
              <p>backdrop-blur-sm</p>
              <small>bg-white/30</small>
            </div>
            <div class="glass-card glass-2">
              <h5>中模糊</h5>
              <p>backdrop-blur-md</p>
              <small>bg-white/40</small>
            </div>
            <div class="glass-card glass-3">
              <h5>重模糊</h5>
              <p>backdrop-blur-xl</p>
              <small>bg-white/50</small>
            </div>
          </div>
        </div>
      </div>

      <div class="backdrop-use-cases">
        <h4>💡 常见应用场景</h4>
        <div class="use-cases-grid">
          <div class="use-case">
            <div class="uc-icon">🪟</div>
            <h5>导航栏毛玻璃</h5>
            <p>滚动时背景模糊，保持内容可读性</p>
          </div>
          <div class="use-case">
            <div class="uc-icon">🪟</div>
            <h5>弹窗遮罩</h5>
            <p>模态框背景模糊，突出前景内容</p>
          </div>
          <div class="use-case">
            <div class="uc-icon">🪟</div>
            <h5>卡片悬浮</h5>
            <p>图片上的文字卡片，毛玻璃提升质感</p>
          </div>
          <div class="use-case">
            <div class="uc-icon">🪟</div>
            <h5>控制面板</h5>
            <p>视频/图片上的控制栏，半透明模糊</p>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="backdropCode"></pre>
      <div class="tips-box">
        <p><strong>Backdrop 背景滤镜要点：</strong></p>
        <ul>
          <li>对元素<strong>背后</strong>的内容应用滤镜，不是元素本身</li>
          <li>需要配合半透明背景色才能看出效果（如 bg-white/30）</li>
          <li>毛玻璃效果 = backdrop-blur + 半透明背景 + 边框</li>
          <li>注意浏览器兼容性（现代浏览器均支持）</li>
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

.filter-playground { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.filter-playground h4 { margin: 0 0 12px; color: #7c2d12; }
.filter-preview { border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.filter-image { width: 100%; }
.forest-scene { height: 180px; position: relative; background: linear-gradient(to bottom, #fef3c7 0%, #fed7aa 60%, #fdba74 100%); overflow: hidden; }
.sun { position: absolute; top: 20px; right: 30px; font-size: 40px; }
.trees { position: absolute; bottom: 35px; left: 0; right: 0; display: flex; justify-content: space-around; font-size: 50px; }
.ground { position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: linear-gradient(to bottom, #d97706, #92400e); display: flex; justify-content: space-around; align-items: center; }
.leaf { font-size: 18px; }
.squirrel { position: absolute; bottom: 38px; left: 30%; font-size: 30px; }

.filter-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px; }
.f-control { display: flex; flex-direction: column; gap: 4px; }
.f-control label { font-size: 12px; color: #9a3412; font-weight: 500; }
.f-control input[type="range"] { accent-color: #ea580c; }

.reset-btn { padding: 8px 16px; background: #fff; border: 2px solid #fed7aa; border-radius: 6px; color: #7c2d12; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.reset-btn:hover { background: #fef3c7; }

.preset-filters h4 { margin: 0 0 12px; color: #7c2d12; }
.preset-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
.preset-item { text-align: center; }
.preset-img { height: 80px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; background: linear-gradient(135deg, #fef3c7, #fdba74); }
.preset-emoji { font-size: 36px; }
.preset-item span { font-size: 12px; color: #7c2d12; }

.grayscale { filter: grayscale(100%); }
.sepia-effect { filter: sepia(80%); }
.brightness-up { filter: brightness(1.3); }
.contrast-up { filter: contrast(1.4); }
.blur-effect { filter: blur(2px); }

.blend-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.blend-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.blend-stage { position: relative; height: 160px; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
.blend-bg { position: absolute; inset: 0; }
.bg-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, #f97316, #ea580c, #dc2626); }
.bg-pattern { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(5, 1fr); place-items: center; font-size: 32px; opacity: 0.5; }
.blend-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.85); }
.overlay-text { text-align: center; font-size: 32px; font-weight: 800; color: #7c2d12; }
.overlay-text small { display: block; font-size: 14px; font-weight: 400; letter-spacing: 4px; color: #9a3412; }

.blend-modes { display: flex; flex-wrap: wrap; gap: 6px; }
.blend-mode-btn { padding: 5px 10px; border: 1px solid #fed7aa; border-radius: 6px; background: #fff; color: #7c2d12; cursor: pointer; font-size: 12px; transition: all 0.2s; }
.blend-mode-btn:hover { background: #fef3c7; }
.blend-mode-btn.active { background: #f97316; color: #fff; border-color: #ea580c; }

.blend-cards-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.blend-examples { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.blend-example-card { text-align: center; }
.example-bg { height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; position: relative; overflow: hidden; }
.bg-1 { background: linear-gradient(135deg, #fb923c, #f97316); }
.bg-2 { background: linear-gradient(135deg, #7c2d12, #431407); }
.bg-3 { background: linear-gradient(135deg, #fef3c7, #fdba74); }
.example-text { font-size: 18px; font-weight: 700; color: #fff; }
.example-text.multiply { mix-blend-mode: multiply; color: #000; }
.example-text.screen { mix-blend-mode: screen; }
.example-text.overlay { mix-blend-mode: overlay; }
.blend-example-card span { font-size: 12px; color: #7c2d12; }

.backdrop-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.backdrop-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.backdrop-scene { position: relative; border-radius: 10px; overflow: hidden; }
.backdrop-bg { height: 200px; }
.bg-autumn { height: 100%; position: relative; background: linear-gradient(to bottom, #fef3c7 0%, #fed7aa 50%, #fdba74 100%); }
.bg-sun { position: absolute; top: 15px; right: 25px; font-size: 36px; }
.bg-trees { position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: space-around; font-size: 42px; }
.bg-leaves { position: absolute; bottom: 0; left: 0; right: 0; height: 35px; background: linear-gradient(to bottom, #d97706, #92400e); display: flex; justify-content: space-around; align-items: center; font-size: 16px; }

.glass-cards { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; gap: 12px; }
.glass-card { padding: 14px 18px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.5); min-width: 90px; }
.glass-card h5 { margin: 0 0 4px; color: #7c2d12; font-size: 14px; }
.glass-card p { margin: 0 0 2px; font-size: 11px; color: #9a3412; font-weight: 500; }
.glass-card small { font-size: 10px; color: #a16207; }

.glass-1 { background: rgba(255,255,255,0.3); backdrop-filter: blur(4px); }
.glass-2 { background: rgba(255,255,255,0.4); backdrop-filter: blur(12px); }
.glass-3 { background: rgba(255,255,255,0.5); backdrop-filter: blur(24px); }

.backdrop-use-cases h4 { margin: 0 0 12px; color: #7c2d12; }
.use-cases-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.use-case { background: #fff7ed; padding: 14px; border-radius: 10px; text-align: center; }
.uc-icon { font-size: 32px; margin-bottom: 8px; }
.use-case h5 { margin: 0 0 4px; color: #7c2d12; font-size: 13px; }
.use-case p { margin: 0; font-size: 11px; color: #9a3412; line-height: 1.4; }
</style>
`;export{n as default};
