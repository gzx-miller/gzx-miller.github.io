import{d as r,b as i,e,F as u,E as c,f as a,r as p,o as l,M as d,I as m}from"./DutfXOOr.js";const v={class:"v08"},_={class:"tabs"},f=["onClick"],b={class:"code-block"},h=r({__name:"V08Build",setup(y){const o=p("split"),s={split:`// 代码分割（自动）
// Vite 基于 Rollup，自动进行代码分割
// 每个动态 import() 会生成独立的 chunk

// 手动配置分包策略
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus'],
        },
      },
    },
  },
})`,lazy:`// 路由级懒加载（Vue Router）
const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'),
  },
]

// 每个路由对应一个独立的 JS chunk
// 首屏只加载必要的代码`,minify:`// 压缩配置
export default defineConfig({
  build: {
    // 使用 esbuild 压缩（默认，快）
    minify: 'esbuild',
    // 或使用 terser（慢但压缩率更高）
    // minify: 'terser',
    // terserOptions: { compress: { drop_console: true } },

    // 构建目标
    target: 'es2020',
    // 禁用压缩（调试用）
    // minify: false,
  },
})`};return(C,n)=>(l(),i("div",v,[n[0]||(n[0]=e("p",{class:"intro"},"Vite 基于 Rollup 构建，支持自动代码分割、懒加载和多种压缩策略。",-1)),e("div",_,[(l(),i(u,null,c(s,(k,t)=>e("button",{key:t,class:d({active:o.value===t}),onClick:V=>o.value=t},a(t),11,f)),64))]),e("pre",b,[e("code",null,a(s[o.value]),1)])]))}}),x=m(h,[["__scopeId","data-v-1439993c"]]);export{x as default};
