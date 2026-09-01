import{d as x,b as u,e,M as d,F as r,E as a,A as i,f as o,v as p,r as f,o as n,I as v}from"./DutfXOOr.js";const y={class:"demo-card"},b={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},g={key:0},k={style:{width:"100%"}},M={key:1},C={key:2},N={style:{width:"100%"}},_=`// 模块目录结构
my-module/
├── src/
│   ├── module.ts          # 模块入口（defineNuxtModule）
│   ├── runtime/           # 运行时代码
│   │   ├── plugin.ts      # 插件
│   │   ├── composables/   # 组合式函数
│   │   └── components/    # 组件
│   └── types.ts           # 类型定义
├── package.json
└── README.md`,S=`// src/module.ts
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  defaults: {
    enabled: true,
    prefix: 'My',
  },
  setup(options, nuxt) {
    if (!options.enabled) return
    
    const { resolve } = createResolver(import.meta.url)
    
    // 注册插件
    addPlugin(resolve('./runtime/plugin'))
    
    // 注册 composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve('./runtime/composables'))
    })
    
    // 添加运行时配置
    nuxt.options.runtimeConfig.public.myModule = {
      prefix: options.prefix,
    }
  },
})`,w=x({__name:"N20Modules",setup(T){const l=f("modules"),m=[{module:"@pinia/nuxt",desc:"Pinia 状态管理集成",features:"自动导入 store、DevTools 支持"},{module:"@nuxtjs/tailwindcss",desc:"Tailwind CSS 集成",features:"自动扫描类名、JIT 模式"},{module:"@nuxtjs/color-mode",desc:"主题切换",features:"自动持久化、系统偏好检测"},{module:"@nuxt/image",desc:"图片优化",features:"自动压缩、懒加载、CDN 支持"},{module:"@nuxtjs/i18n",desc:"国际化",features:"路由前缀、SEO 友好、自动检测"},{module:"@nuxt/content",desc:"内容管理",features:"Markdown 渲染、CMS 功能"},{module:"@nuxt/ui",desc:"UI 组件库",features:"基于 Tailwind、暗色模式"},{module:"@nuxt/devtools",desc:"开发者工具",features:"组件检查、状态查看、路由图"}],c=[{tip:"查找模块",desc:"访问 nuxt.com/modules 浏览官方和社区模块"},{tip:"安装模块",desc:"pnpm add @nuxtjs/xxx，然后在 nuxt.config.ts 的 modules 中添加"},{tip:"模块顺序",desc:"modules 数组中的顺序决定注册顺序，有依赖关系的需注意"},{tip:"本地模块",desc:"使用 nuxt.config.ts 的 modulesDir 或直接引用本地路径"},{tip:"模块配置",desc:"通过 nuxt.config.ts 的同名键配置模块选项"},{tip:"开发模式",desc:"nuxt prepare 生成 .nuxt/ 类型声明，辅助模块开发"}];return(j,t)=>(n(),u("div",y,[t[8]||(t[8]=e("h3",null,"模块系统与生态",-1)),e("div",b,[e("button",{class:d({active:l.value==="modules"}),onClick:t[0]||(t[0]=s=>l.value="modules")},"常用模块",2),e("button",{class:d({active:l.value==="create"}),onClick:t[1]||(t[1]=s=>l.value="create")},"开发模块",2),e("button",{class:d({active:l.value==="ecosystem"}),onClick:t[2]||(t[2]=s=>l.value="ecosystem")},"生态指南",2)]),l.value==="modules"?(n(),u("div",g,[e("table",k,[t[3]||(t[3]=e("thead",null,[e("tr",null,[e("th",null,"模块"),e("th",null,"说明"),e("th",null,"核心能力")])],-1)),e("tbody",null,[(n(),u(r,null,a(m,s=>e("tr",{key:s.module},[e("td",null,[e("code",null,o(s.module),1)]),e("td",null,o(s.desc),1),e("td",null,o(s.features),1)])),64))])])])):i("",!0),l.value==="create"?(n(),u("div",M,[e("div",{style:{display:"flex",gap:"16px"}},[e("div",{style:{flex:"1"}},[t[4]||(t[4]=e("h4",null,"模块结构",-1)),e("pre",{class:"code-block"},o(_))]),e("div",{style:{flex:"1"}},[t[5]||(t[5]=e("h4",null,"模块入口",-1)),e("pre",{class:"code-block",style:{"font-size":"11px"}},o(S))])])])):i("",!0),l.value==="ecosystem"?(n(),u("div",C,[e("table",N,[t[6]||(t[6]=e("thead",null,[e("tr",null,[e("th",null,"提示"),e("th",null,"说明")])],-1)),e("tbody",null,[(n(),u(r,null,a(c,s=>e("tr",{key:s.tip},[e("td",null,[e("strong",null,o(s.tip),1)]),e("td",null,o(s.desc),1)])),64))])]),t[7]||(t[7]=e("div",{style:{"margin-top":"10px",padding:"10px",background:"#fff8f0","border-radius":"6px","font-size":"13px"}},[p(" 💡 Nuxt 模块在构建时执行（setup 函数），用于扩展 Nuxt 的能力：注册插件、添加组件、修改配置、钩入构建流程等。运行时代码放在 "),e("code",null,"runtime/"),p(" 目录。 ")],-1))])):i("",!0)]))}}),E=v(w,[["__scopeId","data-v-05c77233"]]);export{E as default};
