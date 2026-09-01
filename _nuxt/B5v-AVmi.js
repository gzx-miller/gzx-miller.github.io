const n=`<script setup lang="ts">
import { ref } from 'vue'

const pluginType = ref<'auto' | 'client' | 'custom'>('auto')

const pluginExamples = {
  auto: {
    title: '自动注册插件',
    code: \`// plugins/element-plus.ts
import ElementPlus from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus)
})\`,
    desc: 'plugins/ 目录下的文件自动注册，按文件名字母序执行。无需在 nuxt.config.ts 中配置。',
  },
  client: {
    title: '仅客户端插件',
    code: \`// plugins/chart.client.ts
import * as echarts from 'echarts'

export default defineNuxtPlugin((nuxtApp) => {
  // 仅在浏览器环境执行
  nuxtApp.provide('echarts', echarts)
})\`,
    desc: '文件名加 .client 后缀，该插件只在客户端加载和执行，避免 SSR 环境报错。',
  },
  custom: {
    title: '插件注入 provide/inject',
    code: \`// plugins/i18n.ts
export default defineNuxtPlugin((nuxtApp) => {
  const messages = {
    zh: { hello: '你好' },
    en: { hello: 'Hello' },
  }
  
  // 注入全局属性
  nuxtApp.provide('i18n', (key: string, lang = 'zh') => 
    messages[lang]?.[key] ?? key
  )
})

// 组件中使用
const { $i18n } = useNuxtApp()
console.log($i18n('hello')) // 你好\`,
    desc: '通过 nuxtApp.provide 注入的功能，在组件中通过 useNuxtApp().$xxx 访问。',
  },
}

const lifecycleHooks = [
  { hook: 'nuxtApp.hook("vue:setup")', desc: '组件 setup 时' },
  { hook: 'nuxtApp.hook("vue:error")', desc: 'Vue 错误时' },
  { hook: 'nuxtApp.hook("app:created")', desc: '应用创建后' },
  { hook: 'nuxtApp.hook("app:beforeMount")', desc: '挂载前' },
  { hook: 'nuxtApp.hook("app:mounted")', desc: '挂载后' },
  { hook: 'nuxtApp.hook("app:error")', desc: '应用级错误' },
  { hook: 'nuxtApp.hook("page:start")', desc: '页面导航开始' },
  { hook: 'nuxtApp.hook("page:finish")', desc: '页面导航完成' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>插件系统</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button v-for="(val, key) in pluginExamples" :key="key"
              :class="{ active: pluginType === key }"
              @click="pluginType = key as keyof typeof pluginExamples">
        {{ val.title }}
      </button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <pre class="code-block">{{ pluginExamples[pluginType].code }}</pre>
      </div>
      <div style="flex:1;">
        <div class="desc-box">{{ pluginExamples[pluginType].desc }}</div>
      </div>
    </div>

    <h4 style="margin-top:12px;">常用 Nuxt App Hooks</h4>
    <table style="width:100%;">
      <thead><tr><th>Hook</th><th>触发时机</th></tr></thead>
      <tbody>
        <tr v-for="item in lifecycleHooks" :key="item.hook">
          <td><code>{{ item.hook }}</code></td>
          <td>{{ item.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
.desc-box { background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 3px solid #e85d04; min-height: 80px; font-size: 13px; }
table { border-collapse: collapse; }
th, td { padding: 5px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{n as default};
