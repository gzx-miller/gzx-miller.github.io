const n=`// vite-plugin-markdown-to-vue.ts - 自定义插件示例
// 将 .md 文件转换为 Vue 组件

import type { Plugin } from 'vite'
import { marked } from 'marked'

export default function markdownPlugin(): Plugin {
  return {
    // 插件名称
    name: 'vite-plugin-markdown-to-vue',
    
    // 插件执行顺序: 'pre' | 'post' | 不设置
    enforce: 'pre',
    
    // 配置钩子 - 修改 Vite 配置
    config(config, { mode }) {
      // 返回部分配置，会被深度合并
      return {
        resolve: {
          extensions: ['.md']
        }
      }
    },
    
    // 配置已解析钩子 - 获取最终配置
    configResolved(resolvedConfig) {
      // 可以在这里保存配置供后续使用
    },
    
    // 开发服务器配置钩子
    configureServer(server) {
      // 添加自定义中间件
      server.middlewares.use('/hello', (req, res) => {
        res.end('Hello from Vite plugin!')
      })
    },
    
    // 转换 index.html
    transformIndexHtml(html) {
      return html.replace(
        '<title>',
        '<title>【插件注入】'
      )
    },
    
    // 解析 ID - 处理虚拟模块
    resolveId(id) {
      if (id === 'virtual:my-module') {
        // \\0 前缀表示虚拟模块，不会被其他插件处理
        return '\\0virtual:my-module'
      }
    },
    
    // 加载模块内容
    load(id) {
      if (id === '\\0virtual:my-module') {
        return 'export default "这是虚拟模块的内容"'
      }
      
      // 处理 .md 文件
      if (id.endsWith('.md')) {
        // 返回 null 让其他插件/默认加载器处理
        return null
      }
    },
    
    // 转换代码
    transform(code, id) {
      // 只处理 .md 文件
      if (!id.endsWith('.md')) return null
      
      // 将 Markdown 转换为 HTML
      const html = marked.parse(code) as string
      
      // 包装为 Vue 组件
      const vueCode = \`
<template>
  <div class="markdown-body">
    \${html}
  </div>
</template>

<style scoped>
.markdown-body {
  line-height: 1.8;
}
.markdown-body h1 { font-size: 2em; margin: 0.67em 0; }
.markdown-body h2 { font-size: 1.5em; margin: 0.83em 0; }
.markdown-body p { margin: 1em 0; }
</style>
      \`
      
      return {
        code: vueCode,
        map: null // 可以提供 source map
      }
    },
    
    // 构建完成钩子
    closeBundle() {
      console.log('构建完成！')
    }
  }
}

// ====================
// 使用自定义插件
// ====================

// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markdownPlugin from './vite-plugin-markdown-to-vue'

export default defineConfig({
  plugins: [
    vue(),
    markdownPlugin()
  ]
})

// 在代码中使用:
// import Readme from './README.md'

// ====================
// 插件命名规范
// ====================

// 命名: vite-plugin-xxx
// 包名: vite-plugin-xxx
// 导出函数: xxxPlugin() 或 default
// name 字段: 'vite-plugin-xxx'
// 提供 TypeScript 类型支持`;export{n as default};
