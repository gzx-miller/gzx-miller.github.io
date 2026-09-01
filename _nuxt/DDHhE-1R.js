const n=`<script setup lang="ts">
import { ref, computed } from 'vue'

const scenario = ref<'basic' | 'dedupe' | 'transform' | 'lazy'>('basic')

const scenarios = {
  basic: {
    title: '基本用法',
    code: \`const { data, pending, error, refresh } = 
  await useAsyncData('users', () => $fetch('/api/users'))\`,
    desc: '手动指定 key，控制缓存和去重逻辑。key 相同的请求会复用结果。',
  },
  dedupe: {
    title: '去重策略',
    code: \`const { data } = await useAsyncData('users', 
  () => $fetch('/api/users'), 
  { dedupe: 'defer' }  // 或 'cancel'
)\`,
    desc: 'defer：已有相同 key 的请求进行中，则等待其完成共享结果。cancel：取消前一个请求，发起新请求。',
  },
  transform: {
    title: '数据转换',
    code: \`const { data } = await useAsyncData('products', 
  () => $fetch('/api/products'),
  { 
    transform: (data) => data.map(p => ({
      ...p, price: (p.price / 100).toFixed(2)
    })),
    default: () => [],  // 初始默认值
  }
)\`,
    desc: '在服务端获取原始数据后，用 transform 处理格式；default 提供 data 的初始值，避免 undefined。',
  },
  lazy: {
    title: 'Lazy 模式',
    code: \`// 不等待 SSR，客户端再请求
const { data, pending } = useLazyAsyncData(
  'analytics', 
  () => $fetch('/api/analytics')
)\`,
    desc: 'useLazyAsyncData 不会阻塞导航，数据到达前 data 为 undefined、pending 为 true。适合非核心内容。',
  },
}
<\/script>

<template>
  <div class="demo-card">
    <h3>useAsyncData：异步数据管理</h3>

    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <button v-for="(val, key) in scenarios" :key="key"
              :class="{ active: scenario === key }"
              @click="scenario = key as keyof typeof scenarios">
        {{ val.title }}
      </button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <pre class="code-block">{{ scenarios[scenario].code }}</pre>
      </div>
      <div style="flex:1;">
        <div class="desc-box">
          <p>{{ scenarios[scenario].desc }}</p>
        </div>
      </div>
    </div>

    <h4 style="margin-top:12px;">useFetch vs useAsyncData 对比</h4>
    <table style="width:100%;">
      <thead><tr><th>特性</th><th>useFetch</th><th>useAsyncData</th></tr></thead>
      <tbody>
        <tr><td>Key 管理</td><td>自动从 URL 生成</td><td>手动指定</td></tr>
        <tr><td>底层实现</td><td>封装 useAsyncData</td><td>底层 API</td></tr>
        <tr><td>适用场景</td><td>简单 HTTP 请求</td><td>复杂异步逻辑、自定义缓存</td></tr>
        <tr><td>灵活性</td><td>适中</td><td>更高</td></tr>
      </tbody>
    </table>

    <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
      💡 <code>useFetch</code> 是 <code>useAsyncData</code> 的语法糖。需要自定义 key 或组合多个异步操作时，直接使用 <code>useAsyncData</code>。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
.desc-box { background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 3px solid #e85d04; min-height: 80px; }
table { border-collapse: collapse; }
th, td { padding: 6px 10px; border: 1px solid #ddd; font-size: 13px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{n as default};
