<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('hooks')

const contents = {
  hooks: `// Vite 插件结构（兼容 Rollup 插件）
export function myPlugin(options) {
  return {
    name: 'vite-plugin-my',  // 插件名（在 warning 中显示）
    // Vite 独有钩子
    config() {},              // 修改 Vite 配置
    configResolved(config) {}, // 配置已解析
    configureServer(server) {}, // 配置开发服务器
    transformIndexHtml(html) {}, // 转换 index.html
    handleHotUpdate(ctx) {},  // 处理 HMR 更新

    // Rollup 兼容钩子
    resolveId(id) {},         // 解析模块 ID
    load(id) {},             // 加载模块内容
    transform(code, id) {},   // 转换模块代码
  }
}`,
  example: `// 自定义插件示例：注入全局变量
export function injectGlobalVar(options) {
  return {
    name: 'vite-inject-var',
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.vue')) {
        return code.replace(
          /__APP_VERSION__/g,
          JSON.stringify(options.version),
        )
      }
      return null
    },
  }
}

// 使用
import { injectGlobalVar } from './plugins/my-plugin'
export default defineConfig({
  plugins: [injectGlobalVar({ version: '1.0.0' })],
})`,
  publish: `// 发布 Vite 插件到 npm
// 1. 命名规范：vite-plugin-xxx
// 2. package.json
{
  "name": "vite-plugin-my",
  "keywords": ["vite-plugin", "vite"],
  "main": "dist/index.js",
  "files": ["dist"]
}

// 3. 插件应支持直接导入（ESM）
export default function myPlugin() { ... }

// 4. 测试插件
// 在测试项目中：npm link 或 pnpm add link:../my-plugin`,
}
</script>

<template>
  <div class="v16">
    <p class="intro">Vite 插件兼容 Rollup 插件接口，同时提供 Vite 独有的钩子。</p>
    <div class="tabs">
      <button v-for="(v,k) in contents" :key="k" :class="{active: tab===k}" @click="tab=k">{{ k }}</button>
    </div>
    <pre class="code-block"><code>{{ contents[tab as keyof typeof contents] }}</code></pre>
  </div>
</template>

<style scoped>
.v16 { display: flex; flex-direction: column; gap: 10px; }
.intro { font-size: 13px; color: #64748b; }
.tabs { display: flex; gap: 6px; }
.tabs button { padding: 4px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; }
.tabs .active { background: #059669; color: #fff; border-color: #059669; }
.code-block { background: #1e1e2e; color: #cdd6f4; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
</style>
