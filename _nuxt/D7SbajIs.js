const n=`<script setup lang="ts">
import { ref } from 'vue'

const plugins = [
  { name: '@vitejs/plugin-vue', desc: 'Vue 3 支持（SFC 编译、HMR）' },
  { name: '@vitejs/plugin-vue-jsx', desc: 'Vue JSX / TSX 支持' },
  { name: '@vitejs/plugin-react', desc: 'React 支持（自动 JSX 转换、Fast Refresh）' },
  { name: 'unplugin-vue-components', desc: 'Vue 组件自动按需引入' },
  { name: 'unplugin-auto-import', desc: 'API 自动按需引入（ref、computed 等）' },
  { name: 'vite-plugin-pwa', desc: 'PWA 支持（离线缓存、Service Worker）' },
]
<\/script>

<template>
  <div class="v03">
    <p class="intro">Vite 插件兼容 Rollup 插件接口，在 <code>vite.config.ts</code> 的 <code>plugins</code> 数组中注册。</p>
    <ul class="list">
      <li v-for="p in plugins" :key="p.name">
        <code>{{ p.name }}</code>
        <span>{{ p.desc }}</span>
      </li>
    </ul>
    <pre class="code-block"><code>// vite.config.ts
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ /* 配置 */ }),
  ],
})</code></pre>
  </div>
</template>

<style scoped>
.v03 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.intro code { background: #f1f5f9; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
.list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.list li { display: flex; gap: 10px; align-items: baseline; font-size: 13px; padding: 6px 10px; background: #f8fafc; border-radius: 4px; }
.list code { color: #0ea5e9; font-size: 12px; white-space: nowrap; }
.list span { color: #475569; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; }
</style>
`;export{n as default};
