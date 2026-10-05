const n=`// vite.config.ts - 库模式配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      
      // 包名（UMD 格式需要）
      name: 'MyLibrary',
      
      // 输出格式
      formats: ['es', 'cjs', 'umd'],
      
      // 输出文件名
      fileName: (format) => \`my-library.\${format}.js\`
    },
    
    rollupOptions: {
      // 外部化依赖（不打包进产物）
      external: ['vue', 'vue-router'],
      
      output: {
        // UMD 格式下的全局变量映射
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter'
        }
      }
    }
  }
})

// ====================
// 库入口文件示例 (src/index.ts)
// ====================

// 导出组件
export { default as Button } from './components/Button.vue'
export { default as Input } from './components/Input.vue'

// 导出 composable
export { useCounter } from './composables/useCounter'
export { useForm } from './composables/useForm'

// 导出工具函数
export { formatDate, debounce } from './utils'

// 导出类型
export type { ButtonProps, InputProps } from './types'

// ====================
// package.json 配置
// ====================

// {
//   "name": "my-library",
//   "version": "1.0.0",
//   "type": "module",
//   // ESM 入口
//   "module": "./dist/my-library.es.js",
//   // CJS 入口
//   "main": "./dist/my-library.cjs.js",
//   // 类型声明入口
//   "types": "./dist/index.d.ts",
//   // 导出映射
//   "exports": {
//     ".": {
//       "import": "./dist/my-library.es.js",
//       "require": "./dist/my-library.cjs.js",
//       "types": "./dist/index.d.ts"
//     }
//   },
//   // peer dependencies
//   "peerDependencies": {
//     "vue": "^3.0.0"
//   },
//   // 文件发布到 npm
//   "files": ["dist"]
// }

// ====================
// 生成类型声明（配合 vite-plugin-dts）
// ====================

import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      // 输出目录
      outDir: 'dist',
      // 是否插入类型入口
      insertTypesEntry: true,
      // 包含的文件
      include: ['src/**/*.ts', 'src/**/*.vue']
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLibrary',
      formats: ['es', 'cjs']
    }
  }
})`;export{n as default};
