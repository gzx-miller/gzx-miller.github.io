const e=`<script setup lang="ts">
import { ref } from 'vue'

// 模拟 useState 行为
const sharedCount = ref(0)
const theme = ref<'light' | 'dark'>('light')

function incrementShared() { sharedCount.value++ }
function toggleTheme() { theme.value = theme.value === 'light' ? 'dark' : 'light' }

const codeExample = \`// useState 基本用法
const count = useState('counter', () => 0)
count.value++  // 跨组件共享

// 组件 A
const theme = useState('theme', () => 'light')

// 组件 B（自动同步）
const theme = useState('theme')

// 与 Pinia 对比
// useState: 轻量、SSR 友好、无 action/getter
// Pinia: 完整状态管理、插件生态、DevTools 支持\`

const ssrFlow = [
  { step: 'Server', action: 'useState 初始化默认值，随请求创建' },
  { step: 'Server', action: '数据序列化到 payload，发送到客户端' },
  { step: 'Client', action: '从 payload 恢复 useState 的值（不重复初始化）' },
  { step: 'Client', action: '后续修改仅客户端生效，不会跨请求污染' },
]

const piniaComparison = [
  { feature: 'SSR 支持', useState: '✅ 内置', pinia: '✅ 需配置' },
  { feature: '跨组件共享', useState: '✅ 通过 key', pinia: '✅ 通过 store' },
  { feature: 'DevTools', useState: '❌ 无', pinia: '✅ 完整支持' },
  { feature: '插件生态', useState: '❌ 无', pinia: '✅ 丰富' },
  { feature: 'Getters/Actions', useState: '❌ 需手动', pinia: '✅ 内置' },
  { feature: '适用场景', useState: '轻量共享状态', pinia: '复杂业务状态' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>useState：跨组件状态共享</h3>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>交互演示</h4>
        <div class="demo-section">
          <p>共享计数器：<strong>{{ sharedCount }}</strong></p>
          <button @click="incrementShared">+1（模拟组件 A 操作）</button>
          <button @click="incrementShared">+1（模拟组件 B 操作）</button>
        </div>

        <div class="demo-section">
          <p>主题：<strong>{{ theme }}</strong></p>
          <button @click="toggleTheme">切换主题</button>
        </div>

        <h4 style="margin-top:8px;">SSR 数据流</h4>
        <div v-for="(item, i) in ssrFlow" :key="i" class="flow-item">
          <span class="badge" :class="item.step.toLowerCase()">{{ item.step }}</span>
          {{ item.action }}
        </div>
      </div>

      <div style="flex:1;">
        <h4>代码示例</h4>
        <pre class="code-block">{{ codeExample }}</pre>

        <h4 style="margin-top:8px;">useState vs Pinia</h4>
        <table style="width:100%;">
          <thead><tr><th>特性</th><th>useState</th><th>Pinia</th></tr></thead>
          <tbody>
            <tr v-for="item in piniaComparison" :key="item.feature">
              <td>{{ item.feature }}</td>
              <td>{{ item.useState }}</td>
              <td>{{ item.pinia }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-section { background: #f9f9f9; padding: 10px; border-radius: 6px; margin-bottom: 8px; }
.flow-item { font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.badge { font-size: 11px; padding: 2px 6px; border-radius: 3px; color: #fff; }
.badge.server { background: #1565c0; }
.badge.client { background: #2e7d32; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
</style>
`;export{e as default};
