import{d as r,b as s,e,F as c,E as d,f as l,r as p,o as a,M as u,I as m}from"./DutfXOOr.js";const f={class:"v16"},v={class:"tabs"},g=["onClick"],_={class:"code-block"},x=r({__name:"V16PluginDev",setup(V){const t=p("hooks"),i={hooks:`// Vite 插件结构（兼容 Rollup 插件）
export function myPlugin(options) {
  return {
    name: 'vite-plugin-my',  // 插件名（在 warning 中显示）
    // Vite 独有钩子
    config() {},              // 修改 Vite 配置
    configResolved(config) {}, // 配置已解析
    configureServer(server) {}, // 配置开发服务器
    transformIndexHtml(html) {}, // 转换 index.html
    handleHotUpdate(ctx) {},  // 处理 HMR 更新

    // Rollup 兼容钩子
    resolveId(id) {},         // 解析模块 ID
    load(id) {},             // 加载模块内容
    transform(code, id) {},   // 转换模块代码
  }
}`,example:`// 自定义插件示例：注入全局变量
export function injectGlobalVar(options) {
  return {
    name: 'vite-inject-var',
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.vue')) {
        return code.replace(
          /__APP_VERSION__/g,
          JSON.stringify(options.version),
        )
      }
      return null
    },
  }
}

// 使用
import { injectGlobalVar } from './plugins/my-plugin'
export default defineConfig({
  plugins: [injectGlobalVar({ version: '1.0.0' })],
})`,publish:`// 发布 Vite 插件到 npm
// 1. 命名规范：vite-plugin-xxx
// 2. package.json
{
  "name": "vite-plugin-my",
  "keywords": ["vite-plugin", "vite"],
  "main": "dist/index.js",
  "files": ["dist"]
}

// 3. 插件应支持直接导入（ESM）
export default function myPlugin() { ... }

// 4. 测试插件
// 在测试项目中：npm link 或 pnpm add link:../my-plugin`};return(h,o)=>(a(),s("div",f,[o[0]||(o[0]=e("p",{class:"intro"},"Vite 插件兼容 Rollup 插件接口，同时提供 Vite 独有的钩子。",-1)),e("div",v,[(a(),s(c,null,d(i,(y,n)=>e("button",{key:n,class:u({active:t.value===n}),onClick:b=>t.value=n},l(n),11,g)),64))]),e("pre",_,[e("code",null,l(i[t.value]),1)])]))}}),j=m(x,[["__scopeId","data-v-ff5ac076"]]);export{j as default};
