const n=`<script setup lang="ts">
import { ref } from 'vue'

// 声明合并演示：同名接口自动合并属性
interface AppConfig {
  apiBase: string
  timeout: number
}

// 模拟模块扩展：给已有接口追加自定义字段
interface AppConfig {
  theme: 'light' | 'dark'
  locale: string
}

// 合并后 AppConfig 拥有所有四个属性
const config: AppConfig = {
  apiBase: '/api/v1',
  timeout: 3000,
  theme: 'light',
  locale: 'zh-CN',
}

// 扩展 Window 接口（全局增强）
declare global {
  interface Window {
    __APP_VERSION__: string
  }
}

const info = ref('点击查看详情')

function showMergedConfig() {
  info.value = \`API: \${config.apiBase}，超时: \${config.timeout}ms，主题: \${config.theme}，语言: \${config.locale}\`
}

function showGlobalExt() {
  // window.__APP_VERSION__ 可在运行时赋值
  window.__APP_VERSION__ = '1.0.0'
  info.value = \`全局版本号：\${window.__APP_VERSION__}\`
}
<\/script>

<template>
  <div class="demo-card">
    <h4>声明合并与模块扩展</h4>
    <div class="button-row">
      <button @click="showMergedConfig">查看合并后的配置</button>
      <button @click="showGlobalExt">查看全局扩展</button>
    </div>
    <p>{{ info }}</p>
    <small>同名接口自动合并属性，declare module 可扩展第三方库类型，declare global 增强全局对象</small>
  </div>
</template>
`;export{n as default};
