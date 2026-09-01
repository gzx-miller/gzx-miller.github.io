const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref<'lifecycle' | 'hydration' | 'pitfalls'>('lifecycle')

const lifecycleSteps = [
  { step: 1, phase: 'Server', action: '收到 HTTP 请求，创建 Vue 应用实例', detail: '每个请求独立实例，无跨请求污染' },
  { step: 2, phase: 'Server', action: '执行组件 setup，运行 useFetch/useAsyncData', detail: '在服务端完成数据获取，结果序列化到页面 payload' },
  { step: 3, phase: 'Server', action: '渲染组件树为 HTML 字符串', detail: '调用 renderToString 生成完整 HTML' },
  { step: 4, phase: 'Transfer', action: '将 HTML + payload 发送到浏览器', detail: 'payload 包含服务端获取的数据，避免客户端重复请求' },
  { step: 5, phase: 'Client', action: '浏览器解析 HTML，立即显示内容', detail: '用户看到首屏内容（非白屏）' },
  { step: 6, phase: 'Client', action: 'Vue 加载 JS，执行 Hydration', detail: '将静态 HTML "激活"为响应式应用' },
  { step: 7, phase: 'Client', action: 'Hydration 完成，应用可交互', detail: '事件监听器绑定，状态管理生效' },
]

const hydrationIssues = [
  { problem: '服务端和客户端渲染结果不一致', cause: '使用了 Date.now()、Math.random()、window 等仅客户端 API', solution: '用 ClientOnly 包裹，或在 onMounted 中赋值' },
  { problem: '访问浏览器 API 报错', cause: 'setup 在服务端执行，window/document 不存在', solution: '使用 true 判断或 onMounted 后访问' },
  { problem: '第三方库不兼容 SSR', cause: '库内部直接操作 DOM', solution: '动态 import + ClientOnly，或只在插件中 client 端注册' },
  { problem: '内存泄漏', cause: '服务端未正确清理副作用', solution: '确保 onUnmounted 中清理定时器、监听器等' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>服务端渲染 SSR 原理</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'lifecycle' }" @click="activeSection='lifecycle'">请求生命周期</button>
      <button :class="{ active: activeSection === 'hydration' }" @click="activeSection='hydration'">Hydration 过程</button>
      <button :class="{ active: activeSection === 'pitfalls' }" @click="activeSection='pitfalls'">常见问题</button>
    </div>

    <div v-if="activeSection === 'lifecycle'">
      <div class="timeline">
        <div v-for="item in lifecycleSteps" :key="item.step" class="timeline-item" :class="item.phase.toLowerCase()">
          <div class="step-num">{{ item.step }}</div>
          <div class="step-content">
            <div class="step-phase">{{ item.phase }}</div>
            <div class="step-action">{{ item.action }}</div>
            <div class="step-detail">{{ item.detail }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'hydration'">
      <div class="hydration-flow">
        <div class="hydration-box server">
          <strong>服务端渲染</strong>
          <p>HTML 字符串 + Payload 数据</p>
        </div>
        <div class="arrow">→ 传输 →</div>
        <div class="hydration-box client">
          <strong>客户端 Hydration</strong>
          <p>静态 HTML → 响应式应用</p>
        </div>
      </div>
      <div style="margin-top:10px;padding:10px;background:#e3f2fd;border-radius:6px;font-size:13px;">
        <strong>关键点：</strong>Hydration 不是重新渲染，而是"复用"已有 DOM，将 Vue 的虚拟 DOM 与真实 DOM 关联起来。如果 SSR 和 CSR 的 DOM 结构不一致，Vue 会发出 Hydration mismatch 警告。
      </div>
    </div>

    <div v-if="activeSection === 'pitfalls'">
      <table style="width:100%;">
        <thead><tr><th>问题</th><th>原因</th><th>解决方案</th></tr></thead>
        <tbody>
          <tr v-for="(item, i) in hydrationIssues" :key="i">
            <td>{{ item.problem }}</td><td>{{ item.cause }}</td><td>{{ item.solution }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.timeline { padding-left: 10px; }
.timeline-item { display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; }
.step-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #fff; flex-shrink: 0; }
.server .step-num { background: #1565c0; }
.transfer .step-num { background: #e85d04; }
.client .step-num { background: #2e7d32; }
.step-phase { font-size: 11px; font-weight: bold; }
.server .step-phase { color: #1565c0; }
.transfer .step-phase { color: #e85d04; }
.client .step-phase { color: #2e7d32; }
.step-action { font-size: 13px; font-weight: 500; }
.step-detail { font-size: 12px; color: #666; }
.hydration-flow { display: flex; align-items: center; gap: 12px; justify-content: center; }
.hydration-box { padding: 16px; border-radius: 8px; text-align: center; min-width: 180px; }
.hydration-box.server { background: #e3f2fd; border: 2px solid #1565c0; }
.hydration-box.client { background: #e8f5e9; border: 2px solid #2e7d32; }
.arrow { font-size: 16px; font-weight: bold; color: #e85d04; }
table { border-collapse: collapse; }
th, td { padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
</style>
`;export{t as default};
