import{s as R}from"./CLeGk598.js";import{d as V,b as n,e,M as r,a0 as B,v as f,A as c,F as h,E as y,f as a,r as m,g as x,o as i,z,I as H}from"./DutfXOOr.js";const $={class:"demo-card"},I={class:"tab-bar"},P={key:0},L={key:1},T={class:"filter-bar"},K={class:"hooks-list"},S=["onClick"],M={class:"hook-phase"},U={class:"hook-name"},D={key:0,class:"hook-desc"},W={key:2},F={key:3},N={class:"demo-panel"},w={class:"demo-toolbar"},E={class:"demo-title"},O={class:"demo-stats"},j={class:"stat-item"},A={class:"stat-value"},q={class:"stat-item"},G={class:"stat-value highlight"},J={class:"file-list"},Q={class:"file-icon"},X={class:"file-name"},Y={class:"file-size"},Z={key:0,class:"empty-state"},ee=`<span style="color:#7c7c99">// vite-plugin-file-info.ts</span>
<span style="color:#7c7c99">// 一个简单的自定义 Vite 插件</span>
import type { Plugin } from 'vite'

export default function fileInfoPlugin(): Plugin {
  return {
    name: 'vite-plugin-file-info',
    
    <span style="color:#7c7c99">// Vite 特有钩子：配置解析完成</span>
    configResolved(config) {
      console.log('[file-info] 配置已解析')
    },
    
    <span style="color:#7c7c99">// Vite 特有钩子：开发服务器配置</span>
    configureServer(server) {
      console.log('[file-info] 开发服务器已启动')
    },
    
    <span style="color:#7c7c99">// Rollup 钩子：模块转换</span>
    transform(code, id) {
      <span style="color:#7c7c99">// 只处理 .vue 和 .ts 文件</span>
      if (id.endsWith('.vue') || id.endsWith('.ts')) {
        const lines = code.split('
').length
        console.log(\`[file-info] \${id}: \${lines} 行\`)
        
        <span style="color:#7c7c99">// 可以返回转换后的代码</span>
        return {
          code,
          map: null
        }
      }
    },
    
    <span style="color:#7c7c99">// Rollup 钩子：生成 bundle</span>
    generateBundle(options, bundle) {
      const files = Object.keys(bundle)
      console.log(\`[file-info] 共生成 \${files.length} 个文件\`)
    }
  }
}

<span style="color:#7c7c99">// 使用方式：vite.config.ts</span>
<span style="color:#7c7c99">// import fileInfo from './vite-plugin-file-info'</span>
<span style="color:#7c7c99">// plugins: [vue(), fileInfo()]</span>`,se=`<span style="color:#7c7c99">// vite.config.ts - 插件配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      <span style="color:#7c7c99">// 自动导入 components 目录下的组件</span>
      dirs: ['src/components'],
      dts: true,
    }),
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  build: {
    rollupOptions: {
      <span style="color:#7c7c99">// Rollup 原生配置</span>
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})`,te=V({__name:"V19RollupPlugin",setup(oe){const o=m("intro"),b=[{phase:"开发服务器",hook:"configureServer",desc:"配置开发服务器，添加中间件等",type:"vite"},{phase:"开发服务器",hook:"handleHotUpdate",desc:"自定义 HMR 更新逻辑",type:"vite"},{phase:"配置阶段",hook:"config",desc:"修改 Vite 配置",type:"vite"},{phase:"配置阶段",hook:"configResolved",desc:"获取最终解析后的配置",type:"vite"},{phase:"构建阶段",hook:"options",desc:"替换或操作 rollup 选项",type:"rollup"},{phase:"构建阶段",hook:"buildStart",desc:"构建开始时调用",type:"rollup"},{phase:"构建阶段",hook:"resolveId",desc:"自定义模块解析",type:"rollup"},{phase:"构建阶段",hook:"load",desc:"自定义模块加载",type:"rollup"},{phase:"构建阶段",hook:"transform",desc:"转换模块内容",type:"rollup"},{phase:"构建阶段",hook:"buildEnd",desc:"构建结束时调用",type:"rollup"},{phase:"输出阶段",hook:"outputOptions",desc:"替换或操作输出选项",type:"rollup"},{phase:"输出阶段",hook:"generateBundle",desc:"生成 bundle 时调用",type:"rollup"},{phase:"输出阶段",hook:"writeBundle",desc:"写入 bundle 后调用",type:"rollup"},{phase:"输出阶段",hook:"closeBundle",desc:"关闭 bundle 时调用",type:"rollup"}],v=m(null),l=m({name:"vite-plugin-file-info",enabled:!0,transformCount:0,files:[]}),g=[{name:"App.vue",size:"2.4 KB"},{name:"main.ts",size:"0.8 KB"},{name:"components/Button.vue",size:"3.2 KB"},{name:"components/Card.vue",size:"2.1 KB"},{name:"views/Home.vue",size:"5.6 KB"},{name:"stores/user.ts",size:"1.9 KB"},{name:"utils/request.ts",size:"1.2 KB"}];function k(){l.value.transformCount=0,l.value.files=[];let d=0;const s=R(()=>{if(d>=g.length){clearInterval(s);return}const t=g[d],p=t.name.endsWith(".vue")||t.name.endsWith(".ts");l.value.files.push({...t,transformed:p}),p&&l.value.transformCount++,d++},300)}function _(){l.value.transformCount=0,l.value.files=[]}const u=m("all"),C=x(()=>u.value==="all"?b:b.filter(d=>d.type===u.value));return(d,s)=>(i(),n("div",$,[s[15]||(s[15]=e("h3",null,"V19 · Rollup 插件兼容与构建钩子",-1)),e("div",I,[e("button",{class:r(["tab-btn",{active:o.value==="intro"}]),onClick:s[0]||(s[0]=t=>o.value="intro")},"插件简介",2),e("button",{class:r(["tab-btn",{active:o.value==="hooks"}]),onClick:s[1]||(s[1]=t=>o.value="hooks")},"钩子列表",2),e("button",{class:r(["tab-btn",{active:o.value==="custom"}]),onClick:s[2]||(s[2]=t=>o.value="custom")},"自定义插件",2),e("button",{class:r(["tab-btn",{active:o.value==="demo"}]),onClick:s[3]||(s[3]=t=>o.value="demo")},"交互演示",2)]),o.value==="intro"?(i(),n("div",P,[s[7]||(s[7]=B('<div class="intro-section" data-v-96fe37be><h4 data-v-96fe37be>Vite 插件 = Rollup 插件 + Vite 扩展</h4><p class="intro-text" data-v-96fe37be>Vite 插件系统基于 Rollup 插件接口扩展，兼容大多数 Rollup 插件，同时提供 Vite 特有的钩子。</p><div class="compare-cards" data-v-96fe37be><div class="compare-card" data-v-96fe37be><div class="card-header vite" data-v-96fe37be><span class="card-icon" data-v-96fe37be>⚡</span><strong data-v-96fe37be>Vite 特有钩子</strong></div><ul class="card-list" data-v-96fe37be><li data-v-96fe37be>config - 修改配置</li><li data-v-96fe37be>configResolved - 配置解析后</li><li data-v-96fe37be>configureServer - 开发服务器</li><li data-v-96fe37be>transformIndexHtml - 转换 HTML</li><li data-v-96fe37be>handleHotUpdate - HMR 处理</li></ul></div><div class="compare-card" data-v-96fe37be><div class="card-header rollup" data-v-96fe37be><span class="card-icon" data-v-96fe37be>📦</span><strong data-v-96fe37be>Rollup 通用钩子</strong></div><ul class="card-list" data-v-96fe37be><li data-v-96fe37be>options - 构建选项</li><li data-v-96fe37be>resolveId - 模块解析</li><li data-v-96fe37be>load - 模块加载</li><li data-v-96fe37be>transform - 代码转换</li><li data-v-96fe37be>generateBundle - 生成产物</li></ul></div></div></div><h4 style="margin-top:12px;" data-v-96fe37be>配置示例</h4>',2)),e("pre",{class:"mini-code",innerHTML:se}),s[8]||(s[8]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"兼容性："),f("绝大多数 Rollup 插件可以直接在 Vite 中使用，但只在生产构建时生效。开发阶段 Vite 使用 esbuild，部分 Rollup 钩子不会被调用。")])],-1))])):c("",!0),o.value==="hooks"?(i(),n("div",L,[e("div",T,[s[9]||(s[9]=e("span",null,"筛选：",-1)),e("button",{class:r({active:u.value==="all"}),onClick:s[4]||(s[4]=t=>u.value="all")},"全部",2),e("button",{class:r({active:u.value==="vite"}),onClick:s[5]||(s[5]=t=>u.value="vite")},"Vite 特有",2),e("button",{class:r({active:u.value==="rollup"}),onClick:s[6]||(s[6]=t=>u.value="rollup")},"Rollup 通用",2)]),e("div",K,[(i(!0),n(h,null,y(C.value,t=>(i(),n("div",{key:t.hook,class:r(["hook-item",{[t.type]:!0,selected:v.value===t.hook}]),onClick:p=>v.value=v.value===t.hook?null:t.hook},[e("span",M,a(t.phase),1),e("code",U,a(t.hook),1),e("span",{class:r(["hook-type-badge",t.type])},a(t.type==="vite"?"Vite":"Rollup"),3),v.value===t.hook?(i(),n("p",D,a(t.desc),1)):c("",!0)],10,S))),128))]),s[10]||(s[10]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"提示："),f("点击钩子项可查看详细说明。Vite 特有钩子在开发和构建阶段都可能调用，Rollup 钩子主要在生产构建时调用。")])],-1))])):c("",!0),o.value==="custom"?(i(),n("div",W,[e("pre",{class:"mini-code",innerHTML:ee}),s[11]||(s[11]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"插件约定："),f("插件函数返回一个包含 name 和各种钩子的对象。name 是插件的唯一标识，用于日志和错误提示。")])],-1))])):c("",!0),o.value==="demo"?(i(),n("div",F,[e("div",N,[e("div",w,[e("span",E,"🔌 "+a(l.value.name),1),e("div",{class:"demo-actions"},[e("button",{class:"action-btn primary",onClick:k},"▶ 运行插件"),e("button",{class:"action-btn",onClick:_},"↺ 重置")])]),e("div",O,[e("div",j,[e("span",A,a(l.value.files.length),1),s[12]||(s[12]=e("span",{class:"stat-label"},"处理文件数",-1))]),e("div",q,[e("span",G,a(l.value.transformCount),1),s[13]||(s[13]=e("span",{class:"stat-label"},"transform 触发",-1))])]),e("div",J,[(i(!0),n(h,null,y(l.value.files,(t,p)=>(i(),n("div",{key:t.name,class:"file-item",style:z({animationDelay:p*.1+"s"})},[e("span",Q,a(t.name.endsWith(".vue")?"🟢":"🔵"),1),e("span",X,a(t.name),1),e("span",Y,a(t.size),1),e("span",{class:r(["file-status",{transformed:t.transformed}])},a(t.transformed?"transform ✓":"跳过"),3)],4))),128)),l.value.files.length===0?(i(),n("div",Z," 点击「运行插件」开始模拟 ")):c("",!0)])]),s[14]||(s[14]=e("div",{class:"tips-box"},[e("p",null,[e("strong",null,"观察："),f("插件只处理 .vue 和 .ts 文件，在 transform 钩子中统计文件行数。实际开发中可以利用钩子做代码注入、资源处理、性能监控等。")])],-1))])):c("",!0)]))}}),ae=H(te,[["__scopeId","data-v-96fe37be"]]);export{ae as default};
