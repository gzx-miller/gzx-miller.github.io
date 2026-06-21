<script setup lang="ts">
import { computed, ref } from 'vue'

const activeScenario = ref('modal')

const scenarios = [
  { id: 'modal', name: '弹窗开关', state: '单组件 UI 状态', source: '组件自身', tool: 'ref / useState', why: '只有当前组件用，无需共享' },
  { id: 'cart', name: '购物车', state: '跨页面业务状态', source: '多组件共享', tool: 'Pinia / Zustand / Redux', why: '多个页面读写同一份数据' },
  { id: 'filter', name: '搜索筛选', state: '可分享的 URL 状态', source: '地址栏', tool: '路由 query / URL params', why: '刷新和分享都应保持筛选' },
  { id: 'courses', name: '课程列表', state: '服务端缓存状态', source: 'API 返回', tool: 'TanStack Query / useAsyncData', why: '需缓存失效、请求去重、加载态' },
  { id: 'theme', name: '主题偏好', state: '持久化客户端状态', source: 'localStorage', tool: 'useStorage / 自定义 composable', why: '跨会话保持，无需服务端' },
  { id: 'form', name: '表单草稿', state: '临时客户端状态', source: '组件内部', tool: 'ref / reactive', why: '提交前临时保存，无需全局' },
]

const current = computed(() => scenarios.find(s => s.id === activeScenario.value)!)

const decisionFlow = [
  { q: '数据只在一个组件用？', yes: '组件内 ref / useState', no: '继续往下' },
  { q: '需要刷新后保持？', yes: 'URL 参数 或 localStorage', no: '继续往下' },
  { q: '来自服务端 API？', yes: 'TanStack Query / useFetch', no: '继续往下' },
  { q: '多个组件共享？', yes: 'Pinia / Zustand / Redux', no: '组件内 ref' },
]

const codeExample = `<span style="color:#7c7c99">// 1. 组件本地状态 — ref（Vue）/ useState（React）</span>
const isOpen = ref(false)
const input = useState('input', () => '')

<span style="color:#7c7c99">// 2. URL 状态 — 路由 query（可分享、可刷新）</span>
const route = useRoute()
const keyword = computed(() => route.query.q)

<span style="color:#7c7c99">// 3. 服务端缓存 — TanStack Query（自动缓存 + 失效）</span>
const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: fetchCourses,
})

<span style="color:#7c7c99">// 4. 跨组件共享 — Pinia store</span>
const cart = useCartStore()
cart.addItem(course)
cart.total  <span style="color:#7c7c99">// 计算属性</span>

<span style="color:#7c7c99">// 5. 持久化 — localStorage</span>
const theme = useStorage('theme', 'light')`
</script>

<template>
  <div class="demo-card">
    <h3>状态归属与边界</h3>

    <div style="display:flex;gap:16px;margin-bottom:12px;">
      <div style="flex:1;">
        <h4>业务场景（点击切换）</h4>
        <div class="scenario-list">
          <button
            class="scenario-btn"
            v-for="s in scenarios"
            :key="s.id"
            :class="{ active: activeScenario === s.id }"
            @click="activeScenario = s.id"
          >{{ s.name }}</button>
        </div>

        <div class="result-box">
          <p><strong>状态类型：</strong>{{ current.state }}</p>
          <p><strong>数据来源：</strong>{{ current.source }}</p>
          <p><strong>推荐工具：</strong><code>{{ current.tool }}</code></p>
          <p><strong>原因：</strong><small>{{ current.why }}</small></p>
        </div>
      </div>

      <div style="flex:1;">
        <h4>决策流程</h4>
        <div class="flow-list">
          <div v-for="(f, i) in decisionFlow" :key="i" class="flow-item">
            <span class="flow-num">{{ i + 1 }}</span>
            <div>
              <p><strong>{{ f.q }}</strong></p>
              <p class="yes">是 → {{ f.yes }}</p>
              <p class="no">否 → {{ f.no }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h4>各方案代码对比</h4>
    <pre class="mini-code" v-html="codeExample"></pre>

    <div class="tips-box">
      <p><strong>核心原则：</strong>Store 只承载需要跨组件共享、具有业务生命周期的客户端状态。局部 UI、URL 参数和远程缓存各有更合适的归属。</p>
      <p><strong>常见误区：</strong>把所有状态都塞进全局 store，导致组件无法独立、调试困难。</p>
    </div>
  </div>
</template>

<style scoped>
.mini-code { background: #1e1e2e; color: #e0e0e0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; line-height: 1.5; white-space: pre-wrap; }
.result-box { background: #fff8f0; padding: 10px; border-radius: 6px; border-left: 3px solid #e85d04; margin-top: 8px; }
.tips-box { background: #f0f7ff; padding: 10px; border-radius: 6px; border-left: 3px solid #0891b2; margin-top: 10px; }
.scenario-list { display: flex; flex-wrap: wrap; gap: 6px; }
.scenario-list .scenario-btn { padding: 4px 10px; border: 1px solid #e0a06a !important; border-radius: 4px; background: #fff !important; color: var(--text) !important; cursor: pointer; font-size: 12px; }
.scenario-list .scenario-btn.active { background: #e85d04 !important; color: #fff !important; border-color: #e85d04 !important; }
.flow-list { display: flex; flex-direction: column; gap: 6px; }
.flow-item { display: flex; gap: 8px; background: #fff8f0; padding: 8px; border-radius: 6px; border-left: 3px solid #e85d04; }
.flow-num { width: 22px; height: 22px; line-height: 22px; text-align: center; background: #e85d04; color: #fff; border-radius: 50%; font-size: 12px; flex-shrink: 0; }
.yes { color: #65a30d; font-size: 12px; }
.no { color: #8a6d42; font-size: 12px; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
small { color: #8a6d42; }
</style>
