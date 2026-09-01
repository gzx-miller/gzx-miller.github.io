import{d as c,b as a,e,v as i,F as d,E as u,f as l,r as p,o as r,M as v,I as f}from"./DutfXOOr.js";const _={class:"v02"},m={class:"tabs"},g=["onClick"],C={class:"code-block"},b=c({__name:"V02Config",setup(V){const t=p("basic"),o={basic:`// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 },
  build: { outDir: 'dist' },
})`,advanced:`// vite.config.ts - 高级配置
export default defineConfig({
  resolve: {
    alias: { '@': '/src' },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: \`@use "@/styles" as *;\` },
    },
  },
  build: {
    rollupOptions: {
      output: { manualChunks: { vue: ['vue'] } },
    },
  },
})`,env:`// 环境变量
// .env.development
VITE_API_URL=http://localhost:3000

// 代码中读取
const apiUrl = import.meta.env.VITE_API_URL
// 只暴露 VITE_ 前缀的变量到客户端`};return(I,n)=>(r(),a("div",_,[n[0]||(n[0]=e("p",{class:"intro"},[i("Vite 配置文件使用 "),e("code",null,"defineConfig"),i(" 获得类型提示。")],-1)),e("div",m,[(r(),a(d,null,u(o,(h,s)=>e("button",{key:s,class:v({active:t.value===s}),onClick:x=>t.value=s},l(s),11,g)),64))]),e("pre",C,[e("code",null,l(o[t.value]),1)])]))}}),k=f(b,[["__scopeId","data-v-9f5c3680"]]);export{k as default};
