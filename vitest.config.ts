import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // element-plus 的按需样式（es/components/*/style/css）是带副作用 import 的 ESM 模块，
    // 其内部再 import theme-chalk 下的 .css 文件。若这些包被外部化交给 Node 直接加载，
    // Node 会因不认识 .css 抛 "Unknown file extension '.css'"，连带让 element-plus
    // 分类数据加载失败。交由 Vite 处理这些依赖后，CSS 会被正确 stub。
    server: {
      deps: {
        inline: ['element-plus', '@element-plus/icons-vue'],
      },
    },
  },
})
