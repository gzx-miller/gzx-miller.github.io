const e=`<script setup lang="ts">
import { ref } from 'vue'

const currentLayout = ref<'default' | 'custom'>('default')

const layouts = [
  { name: 'default', file: 'layouts/default.vue', desc: '默认布局，包含 NuxtPage 插槽' },
  { name: 'custom', file: 'layouts/custom.vue', desc: '自定义布局，如带侧边栏的后台' },
]

const pageMetaCode = \`// 在页面组件中指定布局
definePageMeta({
  layout: 'custom'
})\`

const defaultLayoutCode = \`<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <header>网站导航栏</header>
    <main><slot /></main>
    <footer>底部信息</footer>
  </div>
</template>\`

const customLayoutCode = \`<!-- layouts/custom.vue -->
<template>
  <div class="layout">
    <aside>侧边菜单</aside>
    <main><slot /></main>
  </div>
</template>\`
<\/script>

<template>
  <div class="demo-card">
    <h3>布局系统：Layout 与 definePageMeta</h3>

    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button :class="{ active: currentLayout === 'default' }" @click="currentLayout='default'">Default 布局</button>
      <button :class="{ active: currentLayout === 'custom' }" @click="currentLayout='custom'">Custom 布局</button>
    </div>

    <div style="display:flex;gap:16px;">
      <div style="flex:1;">
        <h4>布局预览</h4>
        <div class="layout-preview" v-if="currentLayout === 'default'">
          <div class="layout-header">🌐 导航栏 (Header)</div>
          <div class="layout-body">
            <div class="layout-slot">📂 页面内容 <code>&lt;slot /&gt;</code></div>
          </div>
          <div class="layout-footer">📝 底部 (Footer)</div>
        </div>
        <div class="layout-preview" v-else>
          <div class="layout-sidebar">📋 侧边菜单 (Sidebar)</div>
          <div class="layout-body" style="flex:1;">
            <div class="layout-slot">📂 页面内容 <code>&lt;slot /&gt;</code></div>
          </div>
        </div>
      </div>

      <div style="flex:1;">
        <h4>布局代码</h4>
        <pre class="code-block" v-if="currentLayout === 'default'">{{ defaultLayoutCode }}</pre>
        <pre class="code-block" v-else>{{ customLayoutCode }}</pre>

        <h4 style="margin-top:8px;">页面指定布局</h4>
        <pre class="code-block">{{ pageMetaCode }}</pre>
      </div>
    </div>

    <div style="margin-top:10px;font-size:13px;color:#666;">
      💡 布局通过 <code>&lt;slot /&gt;</code> 接收页面内容；页面通过 <code>definePageMeta({ layout })</code> 选择布局；不指定则使用 default。
    </div>
  </div>
</template>

<style scoped>
.active { background: #e85d04; color: #fff; }
.layout-preview { border: 2px solid #e85d04; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; min-height: 180px; }
.layout-preview:has(.layout-sidebar) { flex-direction: row; }
.layout-header, .layout-footer { background: #fff3e0; padding: 8px; text-align: center; font-size: 13px; }
.layout-sidebar { background: #f5e6d3; padding: 12px; width: 100px; font-size: 13px; }
.layout-body { flex: 1; display: flex; align-items: center; justify-content: center; padding: 8px; }
.layout-slot { background: #fff8f0; border: 1px dashed #e85d04; border-radius: 4px; padding: 16px; text-align: center; }
.code-block { background: #f5f0eb; padding: 8px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; }
code { background: #f5f0eb; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
`;export{e as default};
