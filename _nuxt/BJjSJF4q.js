const n=`// vite.config.ts - 常用插件配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    // Vue 单文件组件支持
    vue(),
    
    // Vue JSX 支持
    vueJsx(),
    
    // 自动导入 API（ref, computed 等）
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ]
})

// ====================
// 插件执行顺序
// ====================

import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // enforce: 'pre' - 在 Vite 核心插件之前执行
    {
      name: 'pre-plugin',
      enforce: 'pre',
      transform(code, id) {
        // 最早执行的转换
        return code
      }
    },
    
    // 普通插件 - 在 Vite 核心插件之后执行
    {
      name: 'normal-plugin',
      transform(code, id) {
        return code
      }
    },
    
    // enforce: 'post' - 在所有其他插件之后执行
    {
      name: 'post-plugin',
      enforce: 'post',
      transform(code, id) {
        // 最后执行的转换
        return code
      }
    }
  ]
})

// ====================
// 条件应用插件
// ====================

export default defineConfig(({ command }) => {
  const plugins = [vue()]
  
  // 仅在开发模式生效
  if (command === 'serve') {
    plugins.push(devOnlyPlugin())
  }
  
  // 仅在构建模式生效
  if (command === 'build') {
    plugins.push(buildOnlyPlugin())
  }
  
  return { plugins }
})`;export{n as default};
