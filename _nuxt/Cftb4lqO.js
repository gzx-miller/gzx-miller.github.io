const e=`<script setup lang="ts">
import { ref, computed } from 'vue'

const activeSection = ref<'config' | 'env' | 'usage'>('config')

const publicApiKey = ref('pk_live_abc123')
const secretKey = ref('sk_live_xxx')
const appVersion = ref('1.0.0')

const runtimeConfigCode = \`// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有配置（仅服务端）
    secretKey: process.env.SECRET_KEY || 'dev-secret',
    dbUrl: process.env.DATABASE_URL,
    
    // 公有配置（客户端 + 服务端）
    public: {
      apiKey: process.env.PUBLIC_API_KEY || '',
      appVersion: '1.0.0',
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
    },
  },
})\`

const envFileCode = \`# .env 文件
SECRET_KEY=my-super-secret-key
DATABASE_URL=postgresql://localhost:5432/mydb
PUBLIC_API_KEY=pk_live_abc123
PUBLIC_BASE_URL=https://example.com

# .env.production
SECRET_KEY=prod-secret-key
PUBLIC_API_KEY=pk_live_prod\`

const usageCode = \`// 服务端 API 中使用
// server/api/data.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  // 可以访问所有配置
  const secret = config.secretKey
  const dbUrl = config.dbUrl
  const apiKey = config.public.apiKey
})

// 客户端组件中使用
const config = useRuntimeConfig()
// 只能访问 public 下的配置
console.log(config.public.apiKey)  // ✅
console.log(config.public.appVersion)  // ✅
// console.log(config.secretKey)  // ❌ undefined

// 使用 useAppConfig（编译时配置）
const appConfig = useAppConfig()
console.log(appConfig.theme)  // 不可在运行时修改\`

const appConfigCode = \`// app.config.ts（编译时配置）
export default defineAppConfig({
  theme: {
    primaryColor: '#e85d04',
    borderRadius: '8px',
  },
  features: {
    darkMode: true,
    analytics: false,
  },
})

// 与 runtimeConfig 区别：
// app.config.ts → 构建时确定，不可用环境变量
// runtimeConfig → 运行时确定，可用环境变量\`

const configComparison = [
  { feature: '定义位置', runtimeConfig: 'nuxt.config.ts', appConfig: 'app.config.ts' },
  { feature: '环境变量', runtimeConfig: '✅ 支持', appConfig: '❌ 不支持' },
  { feature: '运行时修改', runtimeConfig: '❌ 不可', appConfig: '❌ 不可' },
  { feature: '服务端私有值', runtimeConfig: '✅ 支持', appConfig: '❌ 全部暴露' },
  { feature: '使用方式', runtimeConfig: 'useRuntimeConfig()', appConfig: 'useAppConfig()' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>运行时配置</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'config' }" @click="activeSection='config'">配置定义</button>
      <button :class="{ active: activeSection === 'env' }" @click="activeSection='env'">环境变量</button>
      <button :class="{ active: activeSection === 'usage' }" @click="activeSection='usage'">使用方式</button>
    </div>

    <div v-if="activeSection === 'config'">
      <div style="display:flex;gap:16px;">
        <div style="flex:1;">
          <pre class="code-block">{{ runtimeConfigCode }}</pre>
        </div>
        <div style="flex:1;">
          <div class="security-note">
            <h4>安全模型</h4>
            <div class="lock-demo">
              <div class="lock-row">
                <span class="lock-icon">🔒</span>
                <span><strong>secretKey</strong> → 仅服务端可访问</span>
              </div>
              <div class="lock-row">
                <span class="lock-icon">🔓</span>
                <span><strong>public.apiKey</strong> → 客户端可访问</span>
              </div>
            </div>
          </div>
          <h4 style="margin-top:8px;">对比 app.config.ts</h4>
          <pre class="code-block" style="font-size:11px;">{{ appConfigCode }}</pre>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'env'">
      <div style="display:flex;gap:16px;">
        <div style="flex:1;">
          <pre class="code-block">{{ envFileCode }}</pre>
        </div>
        <div style="flex:1;">
          <div class="desc-box">
            <p><strong>环境变量命名规则：</strong></p>
            <ul style="font-size:13px;">
              <li>私有配置：<code>NUXT_SECRET_KEY</code> → <code>config.secretKey</code></li>
              <li>公有配置：<code>NUXT_PUBLIC_API_KEY</code> → <code>config.public.apiKey</code></li>
              <li>也可直接在 <code>.env</code> 中用 <code>process.env</code> 引用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'usage'">
      <pre class="code-block">{{ usageCode }}</pre>
      <h4 style="margin-top:8px;">runtimeConfig vs appConfig</h4>
      <table style="width:100%;">
        <thead><tr><th>特性</th><th>runtimeConfig</th><th>appConfig</th></tr></thead>
        <tbody>
          <tr v-for="item in configComparison" :key="item.feature">
            <td>{{ item.feature }}</td><td>{{ item.runtimeConfig }}</td><td>{{ item.appConfig }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
.security-note { background: #e8f5e9; padding: 12px; border-radius: 6px; }
.lock-demo { margin-top: 8px; }
.lock-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 13px; }
.desc-box { background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 3px solid #e85d04; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
