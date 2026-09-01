import{d as c,b as a,e,F as l,E as p,f as i,r as d,o as n,M as u,I as f}from"./DutfXOOr.js";const h={class:"v14"},_={class:"tabs"},g=["onClick"],v={class:"code-block"},x=c({__name:"V14Proxy",setup(m){const s=d("basic"),o={basic:`// vite.config.ts - 开发代理配置
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写（代理到单个目标）
      '/api': 'http://localhost:3000',

      // 完整配置
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,    // 修改请求头中的 Origin
        rewrite: (path) => path.replace(/^/api/, ''),
      },
    },
  },
})

// 前端请求 /api/users → 代理到 http://localhost:3000/users`,ws:`// WebSocket 代理
export default defineConfig({
  server: {
    proxy: {
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,  // 启用 WebSocket 代理
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})`,cors:`// CORS 问题处理（开发环境）
// 方式 1：使用 Vite 代理（推荐）
proxy: { '/api': { target: '...', changeOrigin: true } }

// 方式 2：后端设置 CORS 头
// Express 示例
app.use(cors({ origin: 'http://localhost:5173' }))

// 方式 3：Vite 开发服务器自定义中间件
export default defineConfig({
  server: {
    hmr: { overlay: false },  // 禁用错误遮罩
    middlewareMode: true,       // 中间件模式
  },
})`};return(C,r)=>(n(),a("div",h,[r[0]||(r[0]=e("p",{class:"intro"},"Vite 开发服务器内置代理，解决开发环境跨域问题，无需配置 CORS。",-1)),e("div",_,[(n(),a(l,null,p(o,(b,t)=>e("button",{key:t,class:u({active:s.value===t}),onClick:w=>s.value=t},i(t),11,g)),64))]),e("pre",v,[e("code",null,i(o[s.value]),1)])]))}}),O=f(x,[["__scopeId","data-v-af43247c"]]);export{O as default};
