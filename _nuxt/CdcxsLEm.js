import{d as a,b as n,e,F as u,E as p,f as l,r as c,o as r,M as d,I as m}from"./DutfXOOr.js";const f={class:"v15"},v={class:"tabs"},_=["onClick"],g={class:"code-block"},z=a({__name:"V15Perf",setup(b){const o=c("analyze"),s={analyze:`// 构建产物分析
// 安装 rollup-plugin-visualizer
npm install -D rollup-plugin-visualizer

// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      open: true,        // 构建后自动打开报告
      filename: './stats.html',
      gzipSize: true,     // 显示 gzip 后大小
    }),
  ],
})

// 运行构建后会生成 stats.html
// 可视化查看每个模块的大小`,optimize:`// Vite 性能优化清单
// 1. 依赖预构建（自动，首次慢）
//    → 后续构建极快

// 2. 减少依赖体积
import { debounce } from 'lodash-es'  // ❌ 引入整个库
import debounce from 'lodash-es/debounce'  // ✅ 只引入需要的函数

// 3. 使用 CDN（大型库）
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['vue', 'react'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})

// 4. 启用 gzip/brotli 压缩（服务器端）
// npm install -D vite-plugin-compression`,metrics:`// 开发服务器性能监控
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: true,  // 显示编译错误遮罩
    },
  },
  build: {
    reportCompressedSize: true,  // 报告压缩后大小（默认 true）
    chunkSizeWarningLimit: 500,   // chunk 大小警告阈值（KB）
  },
})

// 使用 Chrome DevTools 分析
// 1. 打开 DevTools → Performance
// 2. 录制页面加载
// 3. 查看 Main 线程中的 Vite 相关任务`};return(h,i)=>(r(),n("div",f,[i[0]||(i[0]=e("p",{class:"intro"},"Vite 提供构建产物分析和多种性能优化手段，帮助控制 bundle 体积。",-1)),e("div",v,[(r(),n(u,null,p(s,(C,t)=>e("button",{key:t,class:d({active:o.value===t}),onClick:x=>o.value=t},l(t),11,_)),64))]),e("pre",g,[e("code",null,l(s[o.value]),1)])]))}}),D=m(z,[["__scopeId","data-v-b8f485dd"]]);export{D as default};
