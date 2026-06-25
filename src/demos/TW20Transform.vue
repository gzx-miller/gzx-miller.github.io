<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'transform' | 'transition' | 'animation'>('transform')
const rotateDeg = ref(0)
const scaleSize = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const showCard = ref(true)
const animatingLeaf = ref(false)
const bounceCount = ref(0)

const magicItems = [
  { id: 1, name: '枫叶符咒', emoji: '🍁', effect: 'hover:rotate-12 hover:scale-110' },
  { id: 2, name: '松果护符', emoji: '🌰', effect: 'hover:scale-125 hover:-translate-y-1' },
  { id: 3, name: '橡果宝石', emoji: '💎', effect: 'hover:rotate-180' },
  { id: 4, name: '森林之羽', emoji: '🪶', effect: 'hover:-rotate-12 hover:translate-x-2' },
  { id: 5, name: '萤火灯笼', emoji: '🏮', effect: 'hover:scale-110 hover:translate-y-[-4px]' },
  { id: 6, name: '蘑菇秘药', emoji: '🍄', effect: 'hover:rotate-6 hover:scale-105' },
]

const triggerLeaf = () => {
  animatingLeaf.value = true
  setTimeout(() => {
    animatingLeaf.value = false
  }, 2000)
}

const triggerBounce = () => {
  bounceCount.value++
}

const transformCode = `<span style="color:#7c7c99">// 缩放</span>
<span style="color:#8a8a3a">scale-100 scale-105 scale-110 scale-125</span>
<span style="color:#8a8a3a">scale-x-110 scale-y-90</span>

<span style="color:#7c7c99">// 旋转</span>
<span style="color:#8a8a3a">rotate-0 rotate-45 rotate-90 rotate-180</span>
<span style="color:#8a8a3a">-rotate-12 rotate-6</span>

<span style="color:#7c7c99">// 平移</span>
<span style="color:#8a8a3a">translate-x-4 translate-y-2 -translate-y-1</span>
<span style="color:#8a8a3a">translate-x-1/2 translate-y-full</span>

<span style="color:#7c7c99">// 倾斜</span>
<span style="color:#8a8a3a">skew-x-6 skew-y-3</span>

<span style="color:#7c7c99">// 变换原点</span>
<span style="color:#8a8a3a">origin-center origin-top-left origin-bottom-right</span>`

const transitionCode = `<span style="color:#7c7c99">// 基础过渡</span>
<span style="color:#8a8a3a">transition-all duration-300 ease-in-out</span>

<span style="color:#7c7c99">// 指定属性</span>
<span style="color:#8a8a3a">transition-colors transition-opacity</span>
<span style="color:#8a8a3a">transition-transform</span>

<span style="color:#7c7c99">// 时长</span>
<span style="color:#8a8a3a">duration-75 duration-150 duration-300</span>
<span style="color:#8a8a3a">duration-500 duration-700 duration-1000</span>

<span style="color:#7c7c99">// 缓动函数</span>
<span style="color:#8a8a3a">ease-linear ease-in ease-out ease-in-out</span>

<span style="color:#7c7c99">// 延迟</span>
<span style="color:#8a8a3a">delay-75 delay-150 delay-300 delay-500</span>`

const animationCode = `<span style="color:#7c7c99">// 内置动画</span>
<span style="color:#8a8a3a">animate-spin</span>    <span style="color:#7c7c99">// 旋转加载</span>
<span style="color:#8a8a3a">animate-pulse</span>   <span style="color:#7c7c99">// 脉冲呼吸</span>
<span style="color:#8a8a3a">animate-bounce</span>  <span style="color:#7c7c99">// 弹跳</span>
<span style="color:#8a8a3a">animate-ping</span>    <span style="color:#7c7c99">// 雷达扩散</span>

<span style="color:#7c7c99">// 自定义动画（tailwind.config.js）</span>
module.exports = {
  theme: {
    extend: {
      animation: {
        <span style="color:#8a8a3a">'float'</span>: <span style="color:#a31414">'float 3s ease-in-out infinite'</span>,
        <span style="color:#8a8a3a">'fall'</span>: <span style="color:#a31414">'fall 2s ease-in forwards'</span>,
      },
      keyframes: {
        float: {
          <span style="color:#8a8a3a">'0%, 100%'</span>: { transform: <span style="color:#a31414">'translateY(0)'</span> },
          <span style="color:#8a8a3a">'50%'</span>: { transform: <span style="color:#a31414">'translateY(-10px)'</span> },
        }
      }
    }
  }
}`
</script>

<template>
  <div class="demo-card tw-demo">
    <h3>变换、过渡与动画</h3>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'transform' }" @click="activeTab = 'transform'">Transform 变换</button>
      <button class="tab-btn" :class="{ active: activeTab === 'transition' }" @click="activeTab = 'transition'">Transition 过渡</button>
      <button class="tab-btn" :class="{ active: activeTab === 'animation' }" @click="activeTab = 'animation'">Animation 动画</button>
    </div>

    <div v-if="activeTab === 'transform'">
      <div class="transform-playground">
        <h4>🎮 变换控制台</h4>
        <div class="controls-grid">
          <div class="control-item">
            <label>旋转: {{ rotateDeg }}°</label>
            <input type="range" v-model.number="rotateDeg" min="-180" max="180" />
          </div>
          <div class="control-item">
            <label>缩放: {{ scaleSize.toFixed(2) }}</label>
            <input type="range" v-model.number="scaleSize" min="0.5" max="2" step="0.1" />
          </div>
          <div class="control-item">
            <label>水平位移: {{ translateX }}px</label>
            <input type="range" v-model.number="translateX" min="-100" max="100" />
          </div>
          <div class="control-item">
            <label>垂直位移: {{ translateY }}px</label>
            <input type="range" v-model.number="translateY" min="-50" max="50" />
          </div>
        </div>

        <div class="transform-preview">
          <div class="transform-box"
               :style="{
                 transform: `rotate(${rotateDeg}deg) scale(${scaleSize}) translate(${translateX}px, ${translateY}px)`
               }">
            🍂
          </div>
        </div>

        <button @click="rotateDeg = 0; scaleSize = 1; translateX = 0; translateY = 0" class="reset-btn">
          重置变换
        </button>
      </div>

      <div class="magic-items-section">
        <h4>✨ 魔法道具商店（悬停看效果）</h4>
        <div class="magic-grid">
          <div v-for="item in magicItems" :key="item.id" class="magic-card">
            <div class="magic-emoji transition-all duration-300 ease-out hover:rotate-12 hover:scale-110">
              {{ item.emoji }}
            </div>
            <span class="magic-name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="transformCode"></pre>
      <div class="tips-box">
        <p><strong>Transform 要点：</strong></p>
        <ul>
          <li>变换不会影响布局（不会挤开其他元素），只影响视觉呈现</li>
          <li>可组合使用：同时设置 rotate + scale + translate</li>
          <li>配合 transition 实现平滑的变换动画</li>
          <li>使用 origin-* 调整变换的原点位置</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'transition'">
      <div class="transition-demo">
        <h4>🎨 过渡效果对比</h4>
        <div class="transition-cards">
          <div class="t-card t-card-1">
            <div class="t-card-inner">
              <span class="t-emoji">🐿️</span>
              <span class="t-label">颜色过渡</span>
            </div>
            <small>hover:bg-orange-500</small>
          </div>
          <div class="t-card t-card-2">
            <div class="t-card-inner">
              <span class="t-emoji">🦊</span>
              <span class="t-label">缩放过渡</span>
            </div>
            <small>hover:scale-110</small>
          </div>
          <div class="t-card t-card-3">
            <div class="t-card-inner">
              <span class="t-emoji">🦉</span>
              <span class="t-label">阴影过渡</span>
            </div>
            <small>hover:shadow-xl</small>
          </div>
          <div class="t-card t-card-4">
            <div class="t-card-inner">
              <span class="t-emoji">🦌</span>
              <span class="t-label">位移过渡</span>
            </div>
            <small>hover:-translate-y-2</small>
          </div>
        </div>
      </div>

      <div class="easing-demo">
        <h4>⏱️ 缓动函数对比</h4>
        <div class="easing-row">
          <div class="easing-item">
            <div class="easing-track">
              <div class="easing-ball ball-linear">linear</div>
            </div>
            <span>linear 线性</span>
          </div>
          <div class="easing-item">
            <div class="easing-track">
              <div class="easing-ball ball-ease-in">ease-in</div>
            </div>
            <span>ease-in 加速</span>
          </div>
          <div class="easing-item">
            <div class="easing-track">
              <div class="easing-ball ball-ease-out">ease-out</div>
            </div>
            <span>ease-out 减速</span>
          </div>
          <div class="easing-item">
            <div class="easing-track">
              <div class="easing-ball ball-ease-in-out">ease-in-out</div>
            </div>
            <span>ease-in-out 缓入缓出</span>
          </div>
        </div>
        <button @click="showCard = !showCard" class="toggle-btn">
          {{ showCard ? '隐藏卡片' : '显示卡片' }}
        </button>
        <div v-if="showCard" class="fade-demo">
          <div class="fade-card transition-all duration-500 ease-out">
            <span>🍁 淡入淡出效果</span>
          </div>
        </div>
      </div>

      <pre class="mini-code" v-html="transitionCode"></pre>
      <div class="tips-box">
        <p><strong>Transition 要点：</strong></p>
        <ul>
          <li>使用 <code>transition-all</code> 过渡所有属性，或指定单个属性</li>
          <li>配合 <code>duration-*</code> 设置动画时长（毫秒）</li>
          <li>使用 <code>ease-*</code> 选择合适的缓动曲线</li>
          <li>性能友好：优先过渡 transform 和 opacity</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'animation'">
      <div class="animation-demo">
        <h4>🎬 内置动画演示</h4>
        <div class="anim-grid">
          <div class="anim-item">
            <div class="anim-spinner animate-spin">🌀</div>
            <span>animate-spin 旋转</span>
          </div>
          <div class="anim-item">
            <div class="anim-pulse animate-pulse">💓</div>
            <span>animate-pulse 脉冲</span>
          </div>
          <div class="anim-item">
            <div class="anim-bounce">
              <span :key="bounceCount" class="animate-bounce inline-block">🐿️</span>
            </div>
            <span>animate-bounce 弹跳</span>
            <button @click="triggerBounce" class="replay-btn">重播</button>
          </div>
          <div class="anim-item">
            <div class="ping-wrapper">
              <span class="ping-icon">🔔</span>
              <span class="animate-ping ping-ring"></span>
            </div>
            <span>animate-ping 扩散</span>
          </div>
        </div>
      </div>

      <div class="custom-anim-demo">
        <h4>🍂 自定义动画：落叶</h4>
        <div class="leaf-stage">
          <div v-if="animatingLeaf" class="falling-leaf">🍁</div>
          <div class="ground">～～～～～～～～</div>
        </div>
        <button @click="triggerLeaf" class="trigger-btn">
          让枫叶飘落
        </button>
      </div>

      <div class="float-demo">
        <h4>✨ 悬浮动画组合</h4>
        <div class="float-scene">
          <div class="float-item float-1">🍂</div>
          <div class="float-item float-2">🍃</div>
          <div class="float-item float-3">🌰</div>
          <div class="float-item float-4">🍄</div>
          <div class="float-squirrel">🐿️</div>
        </div>
      </div>

      <pre class="mini-code" v-html="animationCode"></pre>
      <div class="tips-box">
        <p><strong>Animation 要点：</strong></p>
        <ul>
          <li>Tailwind 内置 4 种常用动画：spin / pulse / bounce / ping</li>
          <li>可在配置文件中扩展自定义动画和 keyframes</li>
          <li>动画与过渡的区别：动画可循环、可有关键帧</li>
          <li>适度使用动画，避免过度干扰用户注意力</li>
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

.transform-playground { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.transform-playground h4 { margin: 0 0 12px; color: #7c2d12; }
.controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.control-item { display: flex; flex-direction: column; gap: 4px; }
.control-item label { font-size: 12px; color: #9a3412; font-weight: 500; }
.control-item input[type="range"] { accent-color: #ea580c; }

.transform-preview { height: 180px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fef3c7, #fed7aa); border-radius: 10px; margin-bottom: 12px; position: relative; overflow: hidden; }
.transform-preview::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, #fdba74 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3; }
.transform-box { font-size: 60px; transition: transform 0.1s ease-out; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }

.reset-btn { padding: 8px 16px; background: #fff; border: 2px solid #fed7aa; border-radius: 6px; color: #7c2d12; cursor: pointer; font-size: 13px; transition: all 0.2s; }
.reset-btn:hover { background: #fef3c7; border-color: #fdba74; }

.magic-items-section h4 { margin: 0 0 12px; color: #7c2d12; }
.magic-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.magic-card { background: #fff; border: 1px solid #fed7aa; border-radius: 10px; padding: 16px; text-align: center; }
.magic-emoji { font-size: 40px; margin-bottom: 8px; display: inline-block; }
.magic-name { font-size: 13px; color: #7c2d12; font-weight: 500; }

.transition-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.transition-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.transition-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.t-card { background: #fff; border-radius: 10px; padding: 12px; text-align: center; cursor: pointer; }
.t-card-inner { padding: 20px 0; transition: all 0.3s; }
.t-emoji { font-size: 36px; display: block; margin-bottom: 8px; }
.t-label { font-size: 13px; color: #7c2d12; font-weight: 500; }
.t-card small { display: block; margin-top: 8px; font-size: 11px; color: #a16207; }

.t-card-1:hover .t-card-inner { background: #f97316; color: #fff; border-radius: 8px; }
.t-card-2:hover .t-card-inner { transform: scale(1.1); }
.t-card-3:hover .t-card-inner { box-shadow: 0 10px 25px rgba(249,115,22,0.3); border-radius: 8px; }
.t-card-4:hover .t-card-inner { transform: translateY(-8px); }

.easing-demo { background: #fff7ed; border-radius: 12px; padding: 16px; }
.easing-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.easing-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.easing-item { display: flex; align-items: center; gap: 12px; }
.easing-track { flex: 1; height: 32px; background: #fef3c7; border-radius: 16px; position: relative; overflow: hidden; }
.easing-ball { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; background: linear-gradient(135deg, #fb923c, #f97316); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #fff; font-weight: 600; transition: left 2s; }

.easing-item:hover .ball-linear { left: calc(100% - 24px); transition-timing-function: linear; }
.easing-item:hover .ball-ease-in { left: calc(100% - 24px); transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
.easing-item:hover .ball-ease-out { left: calc(100% - 24px); transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.easing-item:hover .ball-ease-in-out { left: calc(100% - 24px); transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

.easing-item span { font-size: 12px; color: #9a3412; min-width: 100px; }

.toggle-btn { padding: 8px 16px; background: #fff; border: 2px solid #fed7aa; border-radius: 6px; color: #7c2d12; cursor: pointer; font-size: 13px; transition: all 0.2s; margin-bottom: 12px; }
.toggle-btn:hover { background: #fef3c7; }

.fade-demo { overflow: hidden; }
.fade-card { padding: 16px; background: linear-gradient(135deg, #fed7aa, #fdba74); border-radius: 8px; text-align: center; color: #7c2d12; font-weight: 600; }

.animation-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.animation-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.anim-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.anim-item { background: #fff; border-radius: 10px; padding: 16px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.anim-item span { font-size: 12px; color: #7c2d12; }
.anim-spinner { font-size: 36px; }
.anim-pulse { font-size: 36px; }
.anim-bounce { font-size: 36px; height: 48px; }
.replay-btn { padding: 4px 10px; background: #fed7aa; border: none; border-radius: 4px; color: #7c2d12; font-size: 11px; cursor: pointer; }
.ping-wrapper { position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
.ping-icon { font-size: 28px; position: relative; z-index: 1; }
.ping-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #f97316; opacity: 0.4; }

.custom-anim-demo { background: #fff7ed; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; }
.custom-anim-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.leaf-stage { height: 150px; position: relative; background: linear-gradient(to bottom, #fef3c7 0%, #fed7aa 80%, #fdba74 100%); border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
.ground { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); color: #92400e; font-size: 12px; }
.falling-leaf { position: absolute; top: -30px; left: 50%; font-size: 32px; animation: fallLeaf 2s ease-in forwards; }

@keyframes fallLeaf {
  0% { top: -30px; transform: translateX(-50%) rotate(0deg); opacity: 1; }
  25% { transform: translateX(calc(-50% - 30px)) rotate(-45deg); }
  50% { transform: translateX(calc(-50% + 20px)) rotate(30deg); }
  75% { transform: translateX(calc(-50% - 15px)) rotate(-20deg); }
  100% { top: 100px; transform: translateX(-50%) rotate(10deg); opacity: 0.8; }
}

.trigger-btn { padding: 10px 20px; background: linear-gradient(135deg, #fb923c, #f97316); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
.trigger-btn:hover { background: linear-gradient(135deg, #f97316, #ea580c); }

.float-demo { background: #fff7ed; border-radius: 12px; padding: 16px; }
.float-demo h4 { margin: 0 0 12px; color: #7c2d12; }
.float-scene { height: 140px; position: relative; background: linear-gradient(to bottom, #fef3c7, #fed7aa); border-radius: 8px; overflow: hidden; }
.float-item { position: absolute; font-size: 28px; animation: floatAnim 3s ease-in-out infinite; }
.float-1 { top: 20px; left: 15%; animation-delay: 0s; }
.float-2 { top: 35px; left: 35%; animation-delay: 0.5s; }
.float-3 { top: 15px; left: 60%; animation-delay: 1s; }
.float-4 { top: 40px; left: 80%; animation-delay: 1.5s; }
.float-squirrel { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 36px; }

@keyframes floatAnim {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(5deg); }
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } }
@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }

.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-bounce { animation: bounce 1s infinite; }
.animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
</style>
