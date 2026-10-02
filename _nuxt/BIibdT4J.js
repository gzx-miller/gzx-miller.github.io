const n=`// vite.config.ts - Rollup 插件使用示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import image from '@rollup/plugin-image'

export default defineConfig({
  plugins: [
    vue(),
    // Rollup 插件可以直接在 Vite 中使用
    visualizer({
      filename: 'dist/stats.html'
    }),
    image()
  ]
})

// ====================
// Vite 特有钩子 vs Rollup 钩子
// ====================

// Vite 特有钩子（开发和构建都可能用到）:
// - config              修改 Vite 配置
// - configResolved      配置解析完成
// - configureServer     配置开发服务器
// - transformIndexHtml  转换 index.html
// - handleHotUpdate     处理 HMR 更新
// - configurePreviewServer  配置预览服务器
// - resolveId (开发时)  解析模块 ID
// - load (开发时)       加载模块
// - transform (开发时)  转换模块

// Rollup 兼容钩子（主要在构建时使用）:
// - options             构建选项
// - buildStart          构建开始
// - resolveId           解析模块 ID
// - load                加载模块
// - transform           转换代码
// - moduleParsed        模块解析完成
// - resolveDynamicImport  解析动态导入
// - buildEnd            构建结束
// - outputOptions       输出选项
// - renderStart         渲染开始
// - renderChunk         渲染 chunk
// - generateBundle      生成 bundle
// - writeBundle         写入 bundle
// - closeBundle         关闭 bundle

// ====================
// 插件应用阶段控制
// ====================

import type { Plugin } from 'vite'

function myPlugin(): Plugin {
  return {
    name: 'my-plugin',
    
    // 只在开发时生效
    apply: 'serve',
    // 或只在构建时生效
    // apply: 'build',
    // 或根据条件决定
    // apply(config, { command }) {
    //   return command === 'serve' && !config.build.ssr
    // },
    
    configureServer(server) {
      // 只有开发模式才会执行
    },
    
    generateBundle() {
      // 只有构建模式才会执行
    }
  }
}

// ====================
// 插件执行顺序
// ====================

// 1. Alias 插件
// 2. enforce: 'pre' 的用户插件
// 3. Vite 核心插件
// 4. 普通用户插件
// 5. Vite 构建插件
// 6. enforce: 'post' 的用户插件
// 7. Vite 后置构建插件（压缩、manifest 等）

// 示例:
// plugins: [
//   { name: 'pre-plugin', enforce: 'pre', ... },
//   { name: 'normal-plugin', ... },
//   { name: 'post-plugin', enforce: 'post', ... }
// ]

// ====================
// 条件应用 Rollup 插件
// ====================

export default defineConfig(({ command }) => {
  const plugins = [vue()]
  
  // 仅在构建时使用的 Rollup 插件
  if (command === 'build') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html'
      })
    )
  }
  
  return { plugins }
})

// ====================
// 编写兼容 Vite 和 Rollup 的插件
// ====================

import type { Plugin } from 'vite'

function universalPlugin(): Plugin {
  return {
    name: 'universal-plugin',
    
    // Vite 特有钩子（开发模式）
    configureServer(server) {
      // 开发模式下的逻辑
    },
    
    // Rollup 兼容钩子（构建模式 + 开发模式转换）
    transform(code, id) {
      // 开发和构建模式都执行
      if (!id.endsWith('.custom')) return null
      
      return {
        code: transformCustomCode(code),
        map: null
      }
    },
    
    // 仅构建时执行
    generateBundle(options, bundle) {
      // 构建产物生成时的逻辑
    }
  }
}

function transformCustomCode(code: string): string {
  // 转换逻辑
  return code
}`;export{n as default};
