import{d as i,b as a,e,v as l,F as r,E as u,f as d,r as _,o as c,M as p,I as m}from"./DutfXOOr.js";const f={class:"v07"},v={class:"tabs"},b=["onClick"],g={class:"code-block"},E=i({__name:"V07PreBundle",setup(S){const s=_("why"),t={why:`// 为什么需要依赖预构建？
// 1. CommonJS / UMD 模块需要转换成 ESM
// 2. 大型依赖（如 lodash-es）有数百个文件，
//    直接加载会导致大量 HTTP 请求

// Vite 使用 Esbuild 预构建依赖
// 将 lodash-es 合并为单个 ESM 模块
// 启动时间从秒级降到毫秒级`,config:`// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // 强制预构建的包
    include: ['vue', 'vue-router'],
    // 排除预构建的包
    exclude: ['your-local-package'],
    // 强制重新预构建（清除缓存）
    // $ rm -rf node_modules/.vite
  },
})

// 预构建产物缓存位置
// node_modules/.vite/`,esbuild:`// Vite 使用 Esbuild 进行：
// 1. 依赖预构建（极快）
// 2. TypeScript 转译（不类型检查）

export default defineConfig({
  esbuild: {
    // 删除 console.log（生产构建）
    drop: ['console', 'debugger'],
    // 目标浏览器
    target: 'es2020',
    // JSX 转换（React）
    jsxFactory: 'React.createElement',
  },
})`};return(x,n)=>(c(),a("div",f,[n[0]||(n[0]=e("p",{class:"intro"},[l("Vite 使用 Esbuild 预构建 "),e("code",null,"node_modules"),l(" 中的依赖，将 CommonJS/大量 ESM 转为单个 ESM 文件。")],-1)),e("div",v,[(c(),a(r,null,u(t,(C,o)=>e("button",{key:o,class:p({active:s.value===o}),onClick:h=>s.value=o},d(o),11,b)),64))]),e("pre",g,[e("code",null,d(t[s.value]),1)])]))}}),V=m(E,[["__scopeId","data-v-d7a3bd1f"]]);export{V as default};
