const t=`<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mountedValue = ref('服务端渲染：等待中…')
const clientOnlyValue = ref('')
const now = ref('')
const isClient = ref(false)

onMounted(() => {
  mountedValue.value = '客户端挂载：✅ onMounted 已执行'
  now.value = new Date().toLocaleString('zh-CN')
  isClient.value = true
})

const codeExample = \`<!-- 方式1：ClientOnly 组件 -->
<ClientOnly>
  <ChartComponent />
  <template #fallback>
    <p>加载中…</p>
  </template>
</ClientOnly>

<!-- 方式2：import.meta.client 判断 -->
<div v-if="true">
  仅客户端渲染的内容
</div>

<!-- 方式3：onMounted 中赋值 -->
const browserInfo = ref('')
onMounted(() => {
  browserInfo.value = navigator.userAgent
})

<!-- 方式4：插件中仅客户端注册 -->
// plugins/chart.client.ts
// 文件名加 .client 后缀，仅在客户端加载\`
<\/script>

<template>
  <div class="demo-card">
    <h3>ClientOnly 与客户端专属渲染</h3>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>演示：SSR vs CSR 内容</h4>
        <div class="demo-box">
          <div class="item">
            <span class="label">SSR + CSR：</span>
            <span>{{ mountedValue }}</span>
          </div>
          <div class="item">
            <span class="label">仅客户端：</span>
            <span v-if="isClient">{{ now || '加载中…' }}</span>
            <span v-else style="color:#999;">[服务端跳过]</span>
          </div>
        </div>

        <h4 style="margin-top:12px;">使用场景</h4>
        <table style="width:100%;">
          <thead><tr><th>场景</th><th>推荐方式</th></tr></thead>
          <tbody>
            <tr><td>图表库（ECharts/D3）</td><td>ClientOnly 包裹</td></tr>
            <tr><td>浏览器 API（window/navigator）</td><td>true 判断</td></tr>
            <tr><td>第三方库不兼容 SSR</td><td>.client.ts 插件</td></tr>
            <tr><td>动态内容（时间/随机数）</td><td>onMounted 中赋值</td></tr>
          </tbody>
        </table>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="code-block">{{ codeExample }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-box { background: #f9f9f9; padding: 12px; border-radius: 8px; }
.demo-box .item { margin-bottom: 8px; }
.label { font-weight: bold; font-size: 13px; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
</style>
`;export{t as default};
