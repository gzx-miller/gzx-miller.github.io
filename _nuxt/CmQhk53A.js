const n=`// vite.config.ts - 完整库模式配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    // 自动生成类型声明
    dts({
      outDir: 'dist/types',
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue']
    })
  ],
  
  build: {
    lib: {
      // 入口文件（可以是字符串或对象）
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        button: resolve(__dirname, 'src/components/Button/index.ts')
      },
      
      // UMD 全局变量名
      name: 'MyUILib',
      
      // 输出格式: 'es' | 'cjs' | 'umd' | 'iife'
      formats: ['es', 'cjs', 'umd'],
      
      // 输出文件名
      fileName: (format, entryName) => {
        if (format === 'es') return \`\${entryName}.mjs\`
        if (format === 'cjs') return \`\${entryName}.cjs\`
        return \`\${entryName}.\${format}.js\`
      }
    },
    
    rollupOptions: {
      // 外部化 peer dependencies
      external: ['vue', 'vue-router', 'pinia'],
      
      output: {
        // UMD 模式下的全局变量映射
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          pinia: 'Pinia'
        },
        
        // CSS 输出配置
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css'
          return assetInfo.name || 'assets/[name][extname]'
        }
      }
    },
    
    // 库模式下默认不压缩 CSS
    cssCodeSplit: true,
    
    // 源码映射（便于调试）
    sourcemap: true
  }
})

// ====================
// src/index.ts - 库入口文件
// ====================

// 组件
export { default as Button } from './components/Button/Button.vue'
export { default as Input } from './components/Input/Input.vue'
export { default as Form } from './components/Form/Form.vue'

// Composables
export { useForm } from './composables/useForm'
export { useModal } from './composables/useModal'

// 工具函数
export { debounce, throttle, deepClone } from './utils'

// 类型
export type {
  ButtonProps,
  InputProps,
  FormProps,
  FormRules,
  User
} from './types'

// 样式
import './styles/index.scss'

// ====================
// package.json 完整配置
// ====================

// {
//   "name": "@my-org/ui-lib",
//   "version": "1.0.0",
//   "description": "一个 Vue 3 组件库",
//   "type": "module",
//   
//   // 入口配置
//   "main": "./dist/index.cjs",
//   "module": "./dist/index.mjs",
//   "types": "./dist/types/index.d.ts",
//   
//   // 导出映射（推荐）
//   "exports": {
//     ".": {
//       "import": {
//         "types": "./dist/types/index.d.ts",
//         "default": "./dist/index.mjs"
//       },
//       "require": {
//         "types": "./dist/types/index.d.ts",
//         "default": "./dist/index.cjs"
//       }
//     },
//     "./button": {
//       "import": "./dist/button.mjs",
//       "require": "./dist/button.cjs"
//     },
//     "./style.css": "./dist/index.css"
//   },
//   
//   // 样式
//   "style": "./dist/index.css",
//   
//   // 发布的文件
//   "files": ["dist"],
//   
//   // Peer dependencies
//   "peerDependencies": {
//     "vue": "^3.4.0"
//   },
//   
//   // 脚本
//   "scripts": {
//     "build": "vue-tsc --noEmit && vite build",
//     "type-check": "vue-tsc --noEmit",
//     "prepublishOnly": "npm run build"
//   },
//   
//   // 发布配置
//   "publishConfig": {
//     "access": "public"
//   },
//   
//   // 仓库信息
//   "repository": {
//     "type": "git",
//     "url": "https://github.com/your-org/ui-lib.git"
//   }
// }

// ====================
// 使用方式示例
// ====================

// 1. ESM (推荐)
// import { Button, Input } from '@my-org/ui-lib'
// import '@my-org/ui-lib/style.css'

// 2. CommonJS
// const { Button } = require('@my-org/ui-lib')
// require('@my-org/ui-lib/style.css')

// 3. 按需引入（配合 unplugin-vue-components）
// 自动导入组件，按需打包

// 4. UMD (CDN)
// <script src="https://unpkg.com/vue@3"><\/script>
// <script src="https://unpkg.com/@my-org/ui-lib/dist/index.umd.js"><\/script>
// <link rel="stylesheet" href="https://unpkg.com/@my-org/ui-lib/dist/index.css">
// const { Button } = MyUILib`;export{n as default};
