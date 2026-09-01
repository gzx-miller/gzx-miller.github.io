const t=`<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'dirs' | 'auto' | 'config'>('dirs')

const dirs = [
  { dir: 'pages/', desc: '文件路由，每个 .vue 文件自动映射为路由' },
  { dir: 'components/', desc: '自动导入，无需手动 import 即可在模板使用' },
  { dir: 'composables/', desc: '自动导入，以 use 开头的函数全局可用' },
  { dir: 'layouts/', desc: '布局模板，页面通过 definePageMeta 指定' },
  { dir: 'plugins/', desc: '插件自动注册，文件名即插件执行顺序' },
  { dir: 'middleware/', desc: '路由中间件，命名后直接在页面中引用' },
  { dir: 'server/', desc: 'Nitro 服务端目录，api/ 和 routes/ 自动注册' },
  { dir: 'public/', desc: '静态资源，直接通过根路径访问' },
  { dir: 'assets/', desc: '构建资源，需通过 ~/assets/ 引入并经过构建处理' },
  { dir: 'utils/', desc: '工具函数自动导入，无需手动 import' },
]

const autoImports = [
  { from: 'vue', items: 'ref, reactive, computed, watch, onMounted…' },
  { from: 'vue-router', items: 'useRoute, useRouter, onBeforeRouteLeave…' },
  { from: '#app', items: 'useFetch, useAsyncData, useState, useHead…' },
  { from: 'components/', items: '目录下所有 .vue 组件' },
  { from: 'composables/', items: '以 use 开头的导出函数' },
  { from: 'utils/', items: '所有具名导出函数' },
]

const configSections = [
  { key: 'srcDir', desc: '指定源码目录，如 srcDir: "src/" 将源码移到 src 下' },
  { key: 'modules', desc: 'Nuxt 模块列表，如 @pinia/nuxt 自动集成 Pinia' },
  { key: 'css', desc: '全局样式文件，构建时注入所有页面' },
  { key: 'app.head', desc: '全局 <head> 配置，每个页面可用 useHead 覆盖' },
  { key: 'nitro', desc: '服务端引擎配置，如预渲染路由、代理等' },
  { key: 'runtimeConfig', desc: '运行时配置，公钥暴露客户端，私钥仅服务端' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>Nuxt 项目结构、自动导入与核心配置</h3>
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeTab === 'dirs' }" @click="activeTab = 'dirs'">目录约定</button>
      <button :class="{ active: activeTab === 'auto' }" @click="activeTab = 'auto'">自动导入</button>
      <button :class="{ active: activeTab === 'config' }" @click="activeTab = 'config'">核心配置</button>
    </div>

    <div v-if="activeTab === 'dirs'">
      <table>
        <thead><tr><th>目录</th><th>职责</th></tr></thead>
        <tbody>
          <tr v-for="item in dirs" :key="item.dir">
            <td><code>{{ item.dir }}</code></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'auto'">
      <p>以下内容无需手动 import 即可使用：</p>
      <table>
        <thead><tr><th>来源</th><th>自动导入项</th></tr></thead>
        <tbody>
          <tr v-for="item in autoImports" :key="item.from">
            <td><code>{{ item.from }}</code></td>
            <td>{{ item.items }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'config'">
      <p><code>nuxt.config.ts</code> 核心配置项：</p>
      <table>
        <thead><tr><th>配置项</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="item in configSections" :key="item.key">
            <td><code>{{ item.key }}</code></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 6px 10px; border: 1px solid #ddd; text-align: left; font-size: 13px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 2px 5px; border-radius: 3px; font-size: 12px; }
</style>
`;export{t as default};
