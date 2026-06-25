<script setup lang="ts">
import { ref, computed } from 'vue'

type TabKey = 'lifecycle' | 'cache' | 'manifest'

interface LifeCycleEvent {
  name: string
  description: string
  status: 'idle' | 'active' | 'done'
}

interface CacheItem {
  name: string
  type: 'static' | 'runtime' | 'fallback'
  items: string[]
  strategy: string
}

const activeTab = ref<TabKey>('lifecycle')
const currentStep = ref(-1)
const isPlaying = ref(false)
const isOnline = ref(true)

const lifecycleEvents = ref<LifeCycleEvent[]>([
  { name: '注册 Service Worker', description: '浏览器检测到 SW 文件，开始注册', status: 'idle' },
  { name: '下载 SW 文件', description: '下载并解析 service-worker.js', status: 'idle' },
  { name: 'install 事件', description: '缓存静态资源，预缓存 App Shell', status: 'idle' },
  { name: 'waiting 状态', description: '旧版 SW 仍在控制页面，新版等待', status: 'idle' },
  { name: 'activate 事件', description: '清理旧缓存，新版 SW 激活', status: 'idle' },
  { name: 'fetch 拦截', description: 'SW 接管所有网络请求，提供离线能力', status: 'idle' },
])

const cacheStrategies: CacheItem[] = [
  {
    name: 'Pre-cache (预缓存)',
    type: 'static',
    items: ['index.html', 'app.js', 'main.css', 'logo.png'],
    strategy: 'CacheFirst - 缓存优先',
  },
  {
    name: 'Runtime cache (运行时缓存)',
    type: 'runtime',
    items: ['/api/products', '/api/user', 'avatars/*.jpg'],
    strategy: 'StaleWhileRevalidate - 缓存优先，后台更新',
  },
  {
    name: 'Fallback (离线降级)',
    type: 'fallback',
    items: ['offline.html', 'offline.png'],
    strategy: 'NetworkFirst - 网络优先，失败回退',
  },
]

const manifestExample = `{
  <span style="color:#9cdcfe">"name"</span>: <span style="color:#ce9178">"秋日森林 - PWA 应用"</span>,
  <span style="color:#9cdcfe">"short_name"</span>: <span style="color:#ce9178">"秋日森林"</span>,
  <span style="color:#9cdcfe">"description"</span>: <span style="color:#ce9178">"一个温暖的秋日森林主题 PWA 应用"</span>,
  <span style="color:#9cdcfe">"start_url"</span>: <span style="color:#ce9178">"/"</span>,
  <span style="color:#9cdcfe">"scope"</span>: <span style="color:#ce9178">"/"</span>,
  <span style="color:#9cdcfe">"display"</span>: <span style="color:#ce9178">"standalone"</span>,
  <span style="color:#9cdcfe">"orientation"</span>: <span style="color:#ce9178">"portrait"</span>,
  <span style="color:#9cdcfe">"background_color"</span>: <span style="color:#ce9178">"#fffaf5"</span>,
  <span style="color:#9cdcfe">"theme_color"</span>: <span style="color:#ce9178">"#e85d04"</span>,
  <span style="color:#9cdcfe">"lang"</span>: <span style="color:#ce9178">"zh-CN"</span>,
  <span style="color:#9cdcfe">"icons"</span>: [
    {
      <span style="color:#9cdcfe">"src"</span>: <span style="color:#ce9178">"/icons/icon-192.png"</span>,
      <span style="color:#9cdcfe">"sizes"</span>: <span style="color:#ce9178">"192x192"</span>,
      <span style="color:#9cdcfe">"type"</span>: <span style="color:#ce9178">"image/png"</span>
    },
    {
      <span style="color:#9cdcfe">"src"</span>: <span style="color:#ce9178">"/icons/icon-512.png"</span>,
      <span style="color:#9cdcfe">"sizes"</span>: <span style="color:#569cd6">512x512</span>,
      <span style="color:#9cdcfe">"type"</span>: <span style="color:#ce9178">"image/png"</span>,
      <span style="color:#9cdcfe">"purpose"</span>: <span style="color:#ce9178">"any maskable"</span>
    }
  ],
  <span style="color:#9cdcfe">"shortcuts"</span>: [
    {
      <span style="color:#9cdcfe">"name"</span>: <span style="color:#ce9178">"打开首页"</span>,
      <span style="color:#9cdcfe">"url"</span>: <span style="color:#ce9178">"/"</span>,
      <span style="color:#9cdcfe">"icons"</span>: [{ <span style="color:#9cdcfe">"src"</span>: <span style="color:#ce9178">"/icons/home.png"</span>, <span style="color:#9cdcfe">"sizes"</span>: <span style="color:#ce9178">"96x96"</span> }]
    }
  ]
}`

const swCodeExample = `<span style="color:#8a8a3a">// service-worker.js (使用 Workbox)</span>
<span style="color:#c586c0">import</span> { <span style="color:#dcdcaa">registerRoute</span> } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'workbox-routing'</span>
<span style="color:#c586c0">import</span> {
  <span style="color:#dcdcaa">CacheFirst</span>,
  <span style="color:#dcdcaa">StaleWhileRevalidate</span>,
  <span style="color:#dcdcaa">NetworkFirst</span>,
} <span style="color:#c586c0">from</span> <span style="color:#ce9178">'workbox-strategies'</span>
<span style="color:#c586c0">import</span> { <span style="color:#dcdcaa">precacheAndRoute</span> } <span style="color:#c586c0">from</span> <span style="color:#ce9178">'workbox-precaching'</span>

<span style="color:#7c7c99">// 1. 预缓存构建产物（由 Workbox 注入）</span>
<span style="color:#dcdcaa">precacheAndRoute</span>(self.__WB_MANIFEST)

<span style="color:#7c7c99">// 2. 静态资源 - 缓存优先</span>
<span style="color:#dcdcaa">registerRoute</span>(
  ({ <span style="color:#9cdcfe">request</span> }) => <span style="color:#9cdcfe">request</span>.destination === <span style="color:#ce9178">'script'</span> ||
                    <span style="color:#9cdcfe">request</span>.destination === <span style="color:#ce9178">'style'</span>,
  <span style="color:#c586c0">new</span> <span style="color:#dcdcaa">CacheFirst</span>({
    <span style="color:#9cdcfe">cacheName</span>: <span style="color:#ce9178">'static-assets'</span>,
  })
)

<span style="color:#7c7c99">// 3. API 请求 - 网络优先，失败回退缓存</span>
<span style="color:#dcdcaa">registerRoute</span>(
  ({ <span style="color:#9cdcfe">url</span> }) => <span style="color:#9cdcfe">url</span>.pathname.<span style="color:#dcdcaa">startsWith</span>(<span style="color:#ce9178">'/api/'</span>),
  <span style="color:#c586c0">new</span> <span style="color:#dcdcaa">NetworkFirst</span>({
    <span style="color:#9cdcfe">cacheName</span>: <span style="color:#ce9178">'api-cache'</span>,
    <span style="color:#9cdcfe">networkTimeoutSeconds</span>: <span style="color:#b5cea8">5</span>,
  })
)

<span style="color:#7c7c99">// 4. 图片资源 - 缓存优先，后台更新</span>
<span style="color:#dcdcaa">registerRoute</span>(
  ({ <span style="color:#9cdcfe">request</span> }) => <span style="color:#9cdcfe">request</span>.destination === <span style="color:#ce9178">'image'</span>,
  <span style="color:#c586c0">new</span> <span style="color:#dcdcaa">StaleWhileRevalidate</span>({
    <span style="color:#9cdcfe">cacheName</span>: <span style="color:#ce9178">'image-cache'</span>,
  })
)

<span style="color:#7c7c99">// 5. 离线降级页面</span>
self.<span style="color:#dcdcaa">addEventListener</span>(<span style="color:#ce9178">'fetch'</span>, (event) => {
  <span style="color:#c586c0">if</span> (event.request.mode === <span style="color:#ce9178">'navigate'</span>) {
    event.<span style="color:#dcdcaa">respondWith</span>(
      <span style="color:#dcdcaa">fetch</span>(event.request).<span style="color:#dcdcaa">catch</span>(() =>
        caches.<span style="color:#dcdcaa">match</span>(<span style="color:#ce9178">'/offline.html'</span>)
      )
    )
  }
})`

const activeStepName = computed(() => {
  if (currentStep.value < 0) return '等待开始'
  if (currentStep.value >= lifecycleEvents.value.length) return '已完成'
  return lifecycleEvents.value[currentStep.value].name
})

async function playLifecycle() {
  if (isPlaying.value) return
  isPlaying.value = true
  currentStep.value = -1
  
  lifecycleEvents.value.forEach(e => e.status = 'idle')
  
  for (let i = 0; i < lifecycleEvents.value.length; i++) {
    currentStep.value = i
    lifecycleEvents.value[i].status = 'active'
    await new Promise(r => setTimeout(r, 900))
    lifecycleEvents.value[i].status = 'done'
  }
  
  currentStep.value = lifecycleEvents.value.length
  isPlaying.value = false
}

function resetLifecycle() {
  currentStep.value = -1
  lifecycleEvents.value.forEach(e => e.status = 'idle')
}

function toggleNetwork() {
  isOnline.value = !isOnline.value
}
</script>

<template>
  <div class="demo-card">
    <h3>PWA 离线应用与 Service Worker</h3>
    <p class="demo-hint">PWA (Progressive Web App) 通过 Service Worker 实现离线访问、推送通知、添加到桌面等能力，让 Web 应用拥有接近原生 App 的体验。</p>

    <div class="tabs">
      <button class="tab-btn" :class="{ active: activeTab === 'lifecycle' }" @click="activeTab = 'lifecycle'">生命周期</button>
      <button class="tab-btn" :class="{ active: activeTab === 'cache' }" @click="activeTab = 'cache'">缓存策略</button>
      <button class="tab-btn" :class="{ active: activeTab === 'manifest' }" @click="activeTab = 'manifest'">Manifest 配置</button>
    </div>

    <div v-if="activeTab === 'lifecycle'">
      <div class="lifecycle-demo">
        <div class="demo-header">
          <div class="network-status" :class="{ online: isOnline, offline: !isOnline }">
            <span class="status-dot"></span>
            {{ isOnline ? '在线' : '离线' }}
          </div>
          <button class="network-toggle" @click="toggleNetwork">
            {{ isOnline ? '模拟离线' : '恢复在线' }}
          </button>
        </div>

        <div class="lifecycle-flow">
          <div v-for="(event, index) in lifecycleEvents" :key="event.name" class="lifecycle-step" :class="event.status">
            <div class="step-circle">
              {{ event.status === 'done' ? '✓' : index + 1 }}
            </div>
            <div class="step-content">
              <strong>{{ event.name }}</strong>
              <p>{{ event.description }}</p>
            </div>
            <div v-if="index < lifecycleEvents.length - 1" class="step-line" :class="{ active: event.status === 'done' }"></div>
          </div>
        </div>

        <div class="demo-status">
          当前阶段：<code>{{ activeStepName }}</code>
        </div>

        <div class="demo-actions">
          <button @click="playLifecycle" :disabled="isPlaying">
            {{ isPlaying ? '播放中...' : '播放生命周期' }}
          </button>
          <button class="secondary" @click="resetLifecycle" :disabled="isPlaying">重置</button>
        </div>

        <div v-if="!isOnline" class="offline-preview">
          <div class="offline-card">
            <div class="offline-icon">📴</div>
            <h4>当前处于离线状态</h4>
            <p>Service Worker 正在为您提供离线缓存内容</p>
            <div class="offline-features">
              <span class="feature-item">✓ 已访问页面可离线查看</span>
              <span class="feature-item">✓ 静态资源从缓存加载</span>
              <span class="feature-item">✓ API 数据使用最后缓存</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'cache'">
      <div class="cache-strategies">
        <div v-for="cache in cacheStrategies" :key="cache.name" class="cache-card" :class="cache.type">
          <div class="cache-header">
            <h4>{{ cache.name }}</h4>
            <span class="cache-type">
              {{ cache.type === 'static' ? '静态' : cache.type === 'runtime' ? '运行时' : '降级' }}
            </span>
          </div>
          <div class="cache-items">
            <code v-for="item in cache.items" :key="item" class="cache-item">{{ item }}</code>
          </div>
          <p class="cache-strategy">{{ cache.strategy }}</p>
        </div>
      </div>
      <pre class="mini-code" v-html="swCodeExample" style="margin-top: 12px;"></pre>
      <div class="tips-box">
        <p><strong>缓存策略选择：</strong></p>
        <ul>
          <li><strong>CacheFirst</strong>：不常变化的静态资源（JS、CSS、图片）</li>
          <li><strong>NetworkFirst</strong>：需要实时性的数据（API 请求）</li>
          <li><strong>StaleWhileRevalidate</strong>：允许稍旧但要快速响应（头像、封面）</li>
        </ul>
      </div>
    </div>

    <div v-if="activeTab === 'manifest'">
      <pre class="mini-code" v-html="manifestExample"></pre>
      <div class="manifest-features">
        <div class="feature-card">
          <span class="feature-icon">📱</span>
          <h5>添加到桌面</h5>
          <p>用户可将网站添加到主屏幕，像 App 一样启动</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🖥️</span>
          <h5>独立窗口</h5>
          <p>standalone 模式下无浏览器地址栏，全屏体验</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎨</span>
          <h5>主题颜色</h5>
          <p>自定义状态栏和启动画面的主题色</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🔔</span>
          <h5>推送通知</h5>
          <p>结合 Push API 实现离线推送通知</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-hint { color: #8a6d42; font-size: 13px; margin-bottom: 12px; }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tab-btn { padding: 5px 14px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 13px; }
.tab-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.lifecycle-demo { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 8px; padding: 14px; }
.demo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.network-status { display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
.network-status.online { background: rgba(101, 163, 13, 0.1); color: #65a30d; }
.network-status.offline { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.network-toggle { padding: 4px 12px; border: 1px solid #d4c4b0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; color: #6b5a45; }
.lifecycle-flow { position: relative; padding: 10px 0; }
.lifecycle-step { display: flex; gap: 12px; align-items: flex-start; position: relative; padding-bottom: 18px; }
.lifecycle-step:last-child { padding-bottom: 0; }
.step-circle { width: 32px; height: 32px; border-radius: 50%; background: #e8e0d8; color: #999; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; flex-shrink: 0; position: relative; z-index: 1; transition: all 0.3s; }
.lifecycle-step.active .step-circle { background: #e85d04; color: #fff; animation: pulse 1s ease-in-out infinite; }
.lifecycle-step.done .step-circle { background: #65a30d; color: #fff; }
.step-content { flex: 1; }
.step-content strong { display: block; font-size: 13px; color: #333; margin-bottom: 2px; }
.step-content p { margin: 0; font-size: 12px; color: #8a6d42; }
.step-line { position: absolute; left: 15px; top: 32px; bottom: -2px; width: 2px; background: #e8e0d8; transition: background 0.3s; }
.step-line.active { background: #65a30d; }
.demo-status { text-align: center; padding: 10px; background: #fff; border-radius: 4px; margin: 10px 0; font-size: 13px; }
.demo-status code { background: #f5f0eb; padding: 2px 8px; border-radius: 3px; }
.demo-actions { display: flex; gap: 10px; justify-content: center; }
button { padding: 8px 18px; border: none; border-radius: 5px; background: #e85d04; color: #fff; cursor: pointer; font-size: 13px; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.secondary { background: #f5f0eb; color: #6b5a45; border: 1px solid #d4c4b0; }
.offline-preview { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e8d5c0; }
.offline-card { background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%); border: 1px solid #f0c090; border-radius: 8px; padding: 20px; text-align: center; }
.offline-icon { font-size: 40px; margin-bottom: 8px; }
.offline-card h4 { margin: 0 0 6px 0; color: #e85d04; }
.offline-card p { margin: 0 0 10px 0; font-size: 13px; color: #8a6d42; }
.offline-features { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.feature-item { font-size: 12px; color: #65a30d; }
.cache-strategies { display: flex; flex-direction: column; gap: 10px; }
.cache-card { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 6px; padding: 12px; }
.cache-card.static { border-left: 3px solid #42b883; }
.cache-card.runtime { border-left: 3px solid #e85d04; }
.cache-card.fallback { border-left: 3px solid #c356d3; }
.cache-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cache-header h4 { margin: 0; font-size: 14px; color: #333; }
.cache-type { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: rgba(232, 93, 4, 0.1); color: #e85d04; }
.cache-items { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.cache-item { padding: 3px 8px; background: #1e1e2e; color: #ce9178; border-radius: 4px; font-size: 11px; font-family: monospace; }
.cache-strategy { margin: 0; font-size: 12px; color: #6b5a45; font-weight: bold; }
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.tips-box { background: #fff5eb; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 10px; }
.tips-box p { margin: 4px 0; font-size: 13px; }
.tips-box ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
.tips-box li { margin: 2px 0; }
.tips-box strong { color: #e85d04; }
.manifest-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
.feature-card { background: #fffaf5; border: 1px solid #e0d5c8; border-radius: 6px; padding: 12px; text-align: center; }
.feature-icon { font-size: 24px; display: block; margin-bottom: 6px; }
.feature-card h5 { margin: 0 0 4px 0; font-size: 13px; color: #e85d04; }
.feature-card p { margin: 0; font-size: 11px; color: #6b5a45; line-height: 1.4; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style>
