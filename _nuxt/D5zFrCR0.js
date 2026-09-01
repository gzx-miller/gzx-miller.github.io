const n=`<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('postcss')

const contents = {
  postcss: \`// vite.config.ts
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
})

// 或使用 postcss.config.js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}\`,
  preprocessor: \`// Vite 内置支持 Sass、Less、Stylus
// 安装对应预处理器即可
// npm install -D sass

// 在 Vue SFC 中使用
<style lang="scss">
$primary: #1890ff;
.btn { color: $primary; }
</style>

// 全局注入（vite.config.ts）
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \\\`@use "@/styles/variables" as *;\\\`,
      },
    },
  },
})\`,
  modules: \`// CSS Modules（Vue SFC 默认启用）
<style module>
.red { color: red; }
</style>

<template>
  <div :class="$style.red">红色文字</div>
</template>

// 自定义模块名
<style module="classes">
.red { color: red; }
</style>
<template>
  <div :class="classes.red">红色文字</div>
</template>\`,
}
<\/script>

<template>
  <div class="v12">
    <p class="intro">Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v12 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #22c55e; color: #fff; border-color: #22c55e; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
`;export{n as default};
