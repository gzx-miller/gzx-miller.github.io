import{d as c,b as o,e,F as d,E as p,f as l,r,o as a,M as m,I as u}from"./DutfXOOr.js";const b={class:"v10"},f={class:"tabs"},_=["onClick"],v={class:"code-block"},y=c({__name:"V10Lib",setup(g){const t=r("config"),i={config:`// vite.config.ts - 库模式配置
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',    // 入口文件
      name: 'MyLib',            // 全局变量名（UMD）
      fileName: 'my-lib',       // 输出文件名
    },
    rollupOptions: {
      // 外部化 Vue（使用方提供）
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})`,output:`// 构建产物（同时输出多种格式）
// dist/
// ├── my-lib.es.js     # ESM（供现代打包器使用）
// ├── my-lib.umd.js    # UMD（供 CDN 直接引用）
// ├── my-lib.cjs.js    # CJS（供 Node.js 使用）
// └── types.d.ts        # 类型声明（需额外配置）

// package.json
{
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.es.js",
  "types": "./dist/types.d.ts"
}`,publish:`// 发布到 npm 的完整流程
// 1. 构建
npm run build

// 2. 确保 package.json 包含
{
  "name": "my-lib",
  "version": "1.0.0",
  "files": ["dist"],
  "peerDependencies": { "vue": ">=3.0.0" }
}

// 3. 发布
npm publish

// 使用者：npm install my-lib`};return(j,n)=>(a(),o("div",b,[n[0]||(n[0]=e("p",{class:"intro"},"Vite 库模式可同时输出 ESM、UMD、CJS 格式，适合开发可复用的 npm 包。",-1)),e("div",f,[(a(),o(d,null,p(i,(C,s)=>e("button",{key:s,class:m({active:t.value===s}),onClick:M=>t.value=s},l(s),11,_)),64))]),e("pre",v,[e("code",null,l(i[t.value]),1)])]))}}),D=u(y,[["__scopeId","data-v-975953d4"]]);export{D as default};
