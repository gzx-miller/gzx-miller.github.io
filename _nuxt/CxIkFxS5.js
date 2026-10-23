const n=`// vite.config.ts - 多页面完整配置
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import glob from 'fast-glob'

// 动态获取所有入口文件
async function getEntryPages() {
  const htmlFiles = await glob('src/pages/*/index.html', {
    cwd: __dirname,
    absolute: true
  })
  
  const entries: Record<string, string> = {}
  for (const file of htmlFiles) {
    const match = file.match(/src\\/pages\\/([^/]+)\\/index\\.html$/)
    if (match) {
      entries[match[1]] = file
    }
  }
  return entries
}

export default defineConfig(async () => {
  const pages = await getEntryPages()
  
  return {
    plugins: [vue()],
    
    // 项目根目录
    root: '.',
    
    build: {
      outDir: 'dist',
      
      rollupOptions: {
        input: {
          // 主页面（项目根目录的 index.html）
          main: resolve(__dirname, 'index.html'),
          // 其他页面
          admin: resolve(__dirname, 'src/pages/admin/index.html'),
          login: resolve(__dirname, 'src/pages/login/index.html'),
          about: resolve(__dirname, 'src/pages/about/index.html')
          // 或者使用动态获取的 pages
          // ...pages
        },
        
        output: {
          // 自定义 chunk 命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          
          // 公共依赖提取
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ui-lib': ['element-plus']
          }
        }
      }
    },
    
    server: {
      // 开发服务器的打开页面
      open: '/index.html'
    }
  }
})

// ====================
// 推荐项目结构
// ====================

// project/
//   ├── index.html                    # 主入口
//   ├── src/
//   │   ├── pages/
//   │   │   ├── admin/
//   │   │   │   ├── index.html        # 管理后台入口
//   │   │   │   ├── main.ts           # 管理后台入口脚本
//   │   │   │   ├── App.vue
//   │   │   │   └── views/
//   │   │   ├── login/
//   │   │   │   ├── index.html        # 登录页入口
//   │   │   │   ├── main.ts
//   │   │   │   └── App.vue
//   │   │   └── about/
//   │   │       ├── index.html        # 关于页入口
//   │   │       ├── main.ts
//   │   │       └── App.vue
//   │   ├── components/               # 共享组件
//   │   ├── composables/              # 共享 composables
//   │   ├── utils/                    # 共享工具函数
//   │   ├── stores/                   # 共享状态
//   │   └── assets/                   # 共享资源
//   └── vite.config.ts

// ====================
// HTML 入口模板示例
// ====================

// index.html (主页面)
// <!DOCTYPE html>
// <html lang="zh-CN">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>首页 - 我的应用</title>
// </head>
// <body>
//   <div id="app"></div>
//   <script type="module" src="/src/main.ts"><\/script>
// </body>
// </html>

// src/pages/admin/index.html
// <!DOCTYPE html>
// <html lang="zh-CN">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>管理后台 - 我的应用</title>
// </head>
// <body>
//   <div id="app"></div>
//   <script type="module" src="/src/pages/admin/main.ts"><\/script>
// </body>
// </html>

// ====================
// 共享代码与资源
// ====================

// 所有页面共享:
// - src/components/  公共组件
// - src/utils/       工具函数
// - src/stores/      Pinia 状态管理
// - src/assets/      图片、样式等资源
// - node_modules/    第三方依赖

// Vite 自动处理:
// - 共享依赖自动提取为 common chunk
// - 共享样式不会重复打包
// - 代码分割和 Tree Shaking 正常工作

// ====================
// 开发服务器访问
// ====================

// 启动开发服务器: vite

// 访问地址:
// http://localhost:5173/              →  index.html (主页)
// http://localhost:5173/admin/        →  src/pages/admin/index.html
// http://localhost:5173/login/        →  src/pages/login/index.html
// http://localhost:5173/about/        →  src/pages/about/index.html

// 注意: 访问子目录时需要带尾部斜杠 /
// 或直接访问完整路径: /admin/index.html

// ====================
// 构建产物结构
// ====================

// dist/
//   ├── index.html
//   ├── admin/
//   │   └── index.html
//   ├── login/
//   │   └── index.html
//   ├── about/
//   │   └── index.html
//   └── assets/
//       ├── js/
//       │   ├── main-xxx.js
//       │   ├── admin-xxx.js
//       │   ├── login-xxx.js
//       │   ├── about-xxx.js
//       │   ├── vue-vendor-xxx.js    # 共享 Vue 生态
//       │   └── ui-lib-xxx.js        # 共享 UI 库
//       └── css/
//           ├── main-xxx.css
//           ├── admin-xxx.css
//           └── ...`;export{n as default};
