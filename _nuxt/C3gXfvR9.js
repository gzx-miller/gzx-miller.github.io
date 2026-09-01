const e=`<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref<'modules' | 'create' | 'ecosystem'>('modules')

const builtInModules = [
  { module: '@pinia/nuxt', desc: 'Pinia 状态管理集成', features: '自动导入 store、DevTools 支持' },
  { module: '@nuxtjs/tailwindcss', desc: 'Tailwind CSS 集成', features: '自动扫描类名、JIT 模式' },
  { module: '@nuxtjs/color-mode', desc: '主题切换', features: '自动持久化、系统偏好检测' },
  { module: '@nuxt/image', desc: '图片优化', features: '自动压缩、懒加载、CDN 支持' },
  { module: '@nuxtjs/i18n', desc: '国际化', features: '路由前缀、SEO 友好、自动检测' },
  { module: '@nuxt/content', desc: '内容管理', features: 'Markdown 渲染、CMS 功能' },
  { module: '@nuxt/ui', desc: 'UI 组件库', features: '基于 Tailwind、暗色模式' },
  { module: '@nuxt/devtools', desc: '开发者工具', features: '组件检查、状态查看、路由图' },
]

const moduleStructure = \`// 模块目录结构
my-module/
├── src/
│   ├── module.ts          # 模块入口（defineNuxtModule）
│   ├── runtime/           # 运行时代码
│   │   ├── plugin.ts      # 插件
│   │   ├── composables/   # 组合式函数
│   │   └── components/    # 组件
│   └── types.ts           # 类型定义
├── package.json
└── README.md\`

const moduleCode = \`// src/module.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    enabled: true,
    prefix: 'My',
  },
  setup(options, nuxt) {
    if (!options.enabled) return
    
    const { resolve } = createResolver(import.meta.url)
    
    // 注册插件
    addPlugin(resolve('./runtime/plugin'))
    
    // 注册 composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve('./runtime/composables'))
    })
    
    // 添加运行时配置
    nuxt.options.runtimeConfig.public.myModule = {
      prefix: options.prefix,
    }
  },
})\`

const ecosystemTips = [
  { tip: '查找模块', desc: '访问 nuxt.com/modules 浏览官方和社区模块' },
  { tip: '安装模块', desc: 'pnpm add @nuxtjs/xxx，然后在 nuxt.config.ts 的 modules 中添加' },
  { tip: '模块顺序', desc: 'modules 数组中的顺序决定注册顺序，有依赖关系的需注意' },
  { tip: '本地模块', desc: '使用 nuxt.config.ts 的 modulesDir 或直接引用本地路径' },
  { tip: '模块配置', desc: '通过 nuxt.config.ts 的同名键配置模块选项' },
  { tip: '开发模式', desc: 'nuxt prepare 生成 .nuxt/ 类型声明，辅助模块开发' },
]
<\/script>

<template>
  <div class="demo-card">
    <h3>模块系统与生态</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: activeSection === 'modules' }" @click="activeSection='modules'">常用模块</button>
      <button :class="{ active: activeSection === 'create' }" @click="activeSection='create'">开发模块</button>
      <button :class="{ active: activeSection === 'ecosystem' }" @click="activeSection='ecosystem'">生态指南</button>
    </div>

    <div v-if="activeSection === 'modules'">
      <table style="width:100%;">
        <thead><tr><th>模块</th><th>说明</th><th>核心能力</th></tr></thead>
        <tbody>
          <tr v-for="item in builtInModules" :key="item.module">
            <td><code>{{ item.module }}</code></td>
            <td>{{ item.desc }}</td>
            <td>{{ item.features }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeSection === 'create'">
      <div style="display:flex;gap:16px;">
        <div style="flex:1;">
          <h4>模块结构</h4>
          <pre class="code-block">{{ moduleStructure }}</pre>
        </div>
        <div style="flex:1;">
          <h4>模块入口</h4>
          <pre class="code-block" style="font-size:11px;">{{ moduleCode }}</pre>
        </div>
      </div>
    </div>

    <div v-if="activeSection === 'ecosystem'">
      <table style="width:100%;">
        <thead><tr><th>提示</th><th>说明</th></tr></thead>
        <tbody>
          <tr v-for="item in ecosystemTips" :key="item.tip">
            <td><strong>{{ item.tip }}</strong></td>
            <td>{{ item.desc }}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:10px;padding:10px;background:#fff8f0;border-radius:6px;font-size:13px;">
        💡 Nuxt 模块在构建时执行（setup 函数），用于扩展 Nuxt 的能力：注册插件、添加组件、修改配置、钩入构建流程等。运行时代码放在 <code>runtime/</code> 目录。
      </div>
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.code-block { background: #f5f0eb; padding: 10px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
table { border-collapse: collapse; width: 100%; }
th, td { padding: 6px 8px; border: 1px solid #ddd; font-size: 12px; }
th { background: #fff3e0; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
