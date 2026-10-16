const n=`// vite.config.ts - 基础配置示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// 使用 defineConfig 获得完整类型提示
export default defineConfig({
  // 项目根目录
  root: process.cwd(),
  
  // 开发服务器配置
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015'
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  
  // 插件
  plugins: [vue()]
})

// ====================
// 环境相关配置（函数式）
// ====================

export default defineConfig(({ mode, command }) => {
  // 根据模式返回不同配置
  const isProd = mode === 'production'
  const isBuild = command === 'build'
  
  return {
    plugins: [vue()],
    build: {
      sourcemap: !isProd,
      minify: isProd ? 'terser' : false
    },
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0')
    }
  }
})

// ====================
// 条件加载插件
// ====================

import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const plugins = [vue()]
  
  // 仅在构建分析时添加可视化插件
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true
      })
    )
  }
  
  return { plugins }
})`;export{n as default};
