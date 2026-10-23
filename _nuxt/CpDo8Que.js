const n=`// vite.config.ts - 性能分析配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const plugins = [vue()]
  
  // 构建分析（仅在 ANALYZE 模式下启用）
  if (process.env.ANALYZE) {
    plugins.push(
      visualizer({
        // 输出文件名
        filename: 'dist/stats.html',
        // 自动打开
        open: true,
        // 可视化类型: 'sunburst' | 'treemap' | 'network'
        template: 'treemap',
        // 显示 gzip 大小
        gzipSize: true,
        // 显示 brotli 大小
        brotliSize: true
      })
    )
  }
  
  return {
    plugins,
    build: {
      // 生成 sourcemap 便于分析
      sourcemap: true,
      
      // 手动分包
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            utils: ['lodash-es', 'dayjs']
          }
        }
      }
    }
  }
})

// 运行分析:
// ANALYZE=true vite build
// 或在 package.json 中: "analyze": "cross-env ANALYZE=true vite build"

// ====================
// 构建性能优化配置
// ====================

export default defineConfig({
  build: {
    // 使用 esbuild 压缩（更快）
    minify: 'esbuild',
    
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 目标为现代浏览器（更快、更小）
    target: 'es2020',
    
    // CSS 代码分割
    cssCodeSplit: true,
    
    rollupOptions: {
      output: {
        // 压缩 rollup 输出
        compact: true
      }
    }
  },
  
  // 依赖预构建优化
  optimizeDeps: {
    // 强制预构建大型依赖
    include: ['lodash-es', 'echarts'],
    // 使用 esbuild 插件加速
    esbuildOptions: {
      target: 'es2020'
    }
  }
})

// ====================
// 开发服务器性能优化
// ====================

export default defineConfig({
  server: {
    // 预热常用模块
    warmup: {
      clientFiles: [
        './src/main.ts',
        './src/App.vue',
        './src/router/index.ts'
      ]
    }
  },
  
  // 预构建优化
  optimizeDeps: {
    // 提前预构建所有依赖
    include: ['vue', 'vue-router', 'pinia', 'axios', 'dayjs']
  }
})

// ====================
// 图片优化（vite-plugin-imagemin）
// ====================

import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: {
        plugins: [{ name: 'removeViewBox' }]
      }
    })
  ]
})`;export{n as default};
