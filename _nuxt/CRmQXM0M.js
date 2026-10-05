import{d as g,c as o,h as p,j as l,k as v,F as C,r as x,t as i,q as e,p as V,z as b,_ as E,e as R,g as L,f as I,x as P,I as O,l as z,v as B,$ as U,a0 as T}from"./ClZcEZ7f.js";import{r as N}from"./Be6Ok07Q.js";import{_ as w}from"./CMaOSCop.js";import{s as J}from"./C1sxV64O.js";const F={class:"demo-card"},q={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},K={key:0},X={class:"concept-grid"},W={class:"concept-icon"},_={key:1},G={key:2},Y=`<span style="color:#7c7c99">// vite.config.ts</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 开发服务器</span>
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001'  <span style="color:#7c7c99">// 代理后端</span>
    }
  },
  
  <span style="color:#7c7c99">// 路径别名</span>
  resolve: {
    alias: { '@': '/src' }
  },
  
  <span style="color:#7c7c99">// 生产构建优化</span>
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})`,Z=`<span style="color:#7c7c99">// Vite 两大阶段</span>

<span style="color:#e85d04">┌─────────────────────────────────┐</span>
<span style="color:#e85d04">│     开发阶段 (dev)              │</span>
<span style="color:#e85d04">│  浏览器 ←ESM→ Vite Dev Server   │</span>
<span style="color:#e85d04">│  按需加载，不打包               │</span>
<span style="color:#e85d04">│  HMR: 只更新变化的模块          │</span>
<span style="color:#e85d04">└─────────────────────────────────┘</span>

<span style="color:#65a30d">┌─────────────────────────────────┐</span>
<span style="color:#65a30d">│     生产构建 (build)            │</span>
<span style="color:#65a30d">│  Rollup 打包 + Tree Shaking     │</span>
<span style="color:#65a30d">│  代码分割 + 压缩                │</span>
<span style="color:#65a30d">│  输出 dist/ 静态资源            │</span>
<span style="color:#65a30d">└─────────────────────────────────┘</span>`,Q=g({__name:"V01Core",setup(a){const t=b("concept"),n=[{label:"原生 ESM",icon:"⚡",desc:"开发阶段直接用浏览器加载 ES 模块，无需打包。浏览器按需请求文件，冷启动不受项目规模影响。"},{label:"基于 Rollup",icon:"📦",desc:"生产构建使用 Rollup，输出高度优化的静态资源：Tree Shaking、代码分割、压缩一应俱全。"},{label:"HMR 热更新",icon:"🔥",desc:"基于 ESM 的热更新，只更新修改的模块，保留组件状态，速度极快（毫秒级）。"},{label:"插件系统",icon:"🔌",desc:"兼容 Rollup 插件接口，同时提供 Vite 特有钩子（config、configureServer 等）。"}],m=[{aspect:"开发启动",vite:"毫秒级（原生 ESM）",webpack:"秒级（需打包）"},{aspect:"HMR 速度",vite:"毫秒级（单模块）",webpack:"秒级（重打包）"},{aspect:"冷启动",vite:"不受项目规模影响",webpack:"随规模变慢"},{aspect:"生产构建",vite:"Rollup",webpack:"webpack 自身"},{aspect:"配置复杂度",vite:"简洁",webpack:"复杂"},{aspect:"生态成熟度",vite:"快速成长中",webpack:"非常成熟"}];return(r,c)=>(o(),p("div",F,[c[8]||(c[8]=l("h3",null,"Vite 核心：开发与构建双引擎",-1)),l("div",q,[l("button",{class:v(["tab-btn",{active:t.value==="concept"}]),onClick:c[0]||(c[0]=d=>t.value="concept")},"核心概念",2),l("button",{class:v(["tab-btn",{active:t.value==="compare"}]),onClick:c[1]||(c[1]=d=>t.value="compare")},"对比 Webpack",2),l("button",{class:v(["tab-btn",{active:t.value==="config"}]),onClick:c[2]||(c[2]=d=>t.value="config")},"配置示例",2)]),t.value==="concept"?(o(),p("div",K,[l("div",X,[(o(),p(C,null,x(n,d=>l("div",{key:d.label,class:"concept-card"},[l("span",W,i(d.icon),1),l("strong",null,i(d.label),1),l("p",null,[l("small",null,i(d.desc),1)])])),64))]),c[3]||(c[3]=l("h4",{style:{"margin-top":"12px"}},"两大阶段",-1)),l("pre",{class:"mini-code",innerHTML:Z}),c[4]||(c[4]=l("pre",{class:"mini-code",style:{"margin-top":"10px"}},[l("span",{style:{color:"#7c7c99"}},"# 快速创建项目"),e(`
npm create vite@latest my-app
`),l("span",{style:{color:"#7c7c99"}},"# 开发启动（无需打包）"),e(`
npm run dev
`),l("span",{style:{color:"#7c7c99"}},"# 生产构建"),e(`
npm run build`)],-1))])):V("",!0),t.value==="compare"?(o(),p("div",_,[l("table",null,[c[5]||(c[5]=l("thead",null,[l("tr",null,[l("th",null,"维度"),l("th",null,"Vite"),l("th",null,"Webpack")])],-1)),l("tbody",null,[(o(),p(C,null,x(m,d=>l("tr",{key:d.aspect},[l("td",null,[l("strong",null,i(d.aspect),1)]),l("td",null,[l("small",null,i(d.vite),1)]),l("td",null,[l("small",null,i(d.webpack),1)])])),64))])]),c[6]||(c[6]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"为什么 Vite 快："),e("开发阶段利用浏览器原生 ESM，每个模块独立请求，无需打包成 bundle。Webpack 必须先打包再启动。")])],-1))])):V("",!0),t.value==="config"?(o(),p("div",G,[l("pre",{class:"mini-code",innerHTML:Y}),c[7]||(c[7]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"常用配置："),e("plugins（框架插件）、server.proxy（代理）、resolve.alias（路径别名）、build.rollupOptions（分包）。")])],-1))])):V("",!0)]))}}),h=E(Q,[["__scopeId","data-v-04e4e624"]]),ll={class:"lesson-figure"},el=g({__name:"V01CoreArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("新同事克隆完仓库敲下 "),l("code",null,"npm run dev"),e("，两秒不到页面就开了；你随后敲 "),l("code",null,"npm run build"),e("，进度条却跑了半分钟才结束——同一个工具，为什么启动快得离谱、打包又慢得像在干活？ ")],-1)),n[2]||(n[2]=l("h2",null,"全量依赖重构建",-1)),n[3]||(n[3]=l("p",null,[e(" 你接手一个已经很大的前端项目，光源码目录就有几千个模块。用传统打包器时，每次改一行代码都要先把整张依赖图重新打成一个 bundle，冷启动按秒计，改得越多等得越久。真正折磨人的不是第一次启动，而是"),l("strong",null,"它把「打包」这件事排在了你写代码之前"),e("：你只是想看一个按钮的颜色，却要为整个项目的打包时间买单。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 更麻烦的是，这些成本都得由人扛：依赖图越大启动越慢、改一行触发全量重编译、日常开发的时间被机器吃掉。根子在于传统工具只把源码当成「构建的输入」——它预设了必须先打包，浏览器才能运行。可浏览器真的需要你替它打包吗？"),l("strong",null,"能不能让浏览器自己按需取用源码？")],-1)),n[5]||(n[5]=l("h2",null,"原生ESM按需加载",-1)),n[6]||(n[6]=l("p",null,[e(" 顺着这个问句往下想，最朴素的做法是：干脆不打包，把源码原样交给浏览器。现代浏览器早就原生支持 ES 模块，你在文件里写 "),l("code",null,"import"),e("，它自己就会去请求那个模块。于是启动时服务器不做任何编译，"),l("strong",null,"模块按需加载，用到哪个才请求哪个"),e("。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"放开了「先打包再运行」这个并不必要的前置依赖"),e("。冷启动因此不再随项目规模增长，改一个文件也只需要重新处理那一个文件。 ")],-1)),n[8]||(n[8]=l("h2",null,"裸模块名解析",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("浏览器不认识「裸模块名」：你在源码里写 "),l("code",null,"import { ref } from 'vue'"),e("，浏览器不知道 "),l("code",null,"vue"),e(" 该去哪里找，直接抛 "),l("code",null,"Failed to resolve module specifier"),e("。")]),l("li",null,[e("浏览器不认识 "),l("code",null,".vue"),e(" 和 "),l("code",null,".ts"),e("：这些不是它能执行的文件类型，原样返回只会得到语法错误。")]),l("li",null,"依赖包动辄包含成百上千个小文件，逐个发请求会把网络压垮，开发服务器自己也可能被请求风暴拖死。"),l("li",null,"生产环境不能沿用这套：让每个用户按需拉几百个请求，首屏体验会很差。")],-1)),n[10]||(n[10]=l("h2",null,"依赖预构建编译",-1)),n[11]||(n[11]=l("p",null,[e(" 不推翻「源码直接交给浏览器」，而是按顺序补掉它跑不通的地方。第一个要解决的是「裸模块名找不到」，因为那是页面上第一个报错。Vite 启动时会用 esbuild 把依赖预先处理一遍，并把源码里的 "),l("code",null,"import 'vue'"),e(" 改写成指向 "),l("code",null,"/node_modules/.vite/deps/vue.js"),e(" 的真实路径——这一步就是"),l("strong",null,"依赖预构建"),e("，只在依赖或锁文件变化时重做一次。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 第二个要解决的是「浏览器不认识 "),l("code",null,".vue"),e(" / "),l("code",null,".ts"),e("」。既然浏览器只认 JS，服务器就在这个请求上"),l("strong",null,"即时编译"),e("：请求 "),l("code",null,"/src/App.vue"),e("，Vite 当场把它编译成 JS 模块再返回。"),l("span",{class:"lesson-kv"},"只编译被请求到的那一个模块"),e("，而不是整个项目，这才是冷启动快的原因。 ")],-1)),n[13]||(n[13]=l("ol",{class:"lesson-steps"},[l("li",null,[e("浏览器发起 "),l("code",null,'<script type="module">'),e("，向开发服务器请求入口模块。")]),l("li",null,"Vite 拦截请求，遇到裸模块名就改写为预构建后的依赖路径。"),l("li",null,[e("遇到 "),l("code",null,".vue"),e(" / "),l("code",null,".ts"),e(" 等非 JS 文件，按需即时编译成 ESM 返回。")]),l("li",null,[e("浏览器解析到这个模块的 "),l("code",null,"import"),e("，再发起下一批请求，如此逐层展开。")])],-1)),n[14]||(n[14]=l("p",null,[e(" 但开发阶段跑通了，生产阶段却不能照搬。生产环境里用户隔着网络，几百个模块请求是灾难，而且没有 Tree Shaking、没有压缩、也没有代码分割。于是 Vite 在构建阶段切换成"),l("strong",null,"另一个引擎"),e("：用 Rollup 把整个依赖图打好包，做 Tree Shaking 剔除死代码、做代码分割、做压缩，输出到 "),l("code",null,"dist/"),e("。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 到这里整个工具的形状才清晰："),l("strong",null,"Vite 不是一个打包器，而是开发与生产两套引擎挂在同一份配置上"),e("。开发用原生 ESM 加按需编译换速度，生产用 Rollup 换体积与兼容性。你写的那份 "),l("code",null,"vite.config.ts"),e("，同时驱动这两条链路。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"常见误区："),e("说「Vite 开发时完全不打包」并不准确——依赖会被预构建，只是你的源码不打包。预构建是一次性成本，"),l("span",{class:"lesson-kv"},"冷启动不受项目规模影响，代价是首次启动多一次依赖预构建"),e("。 ")],-1)),n[17]||(n[17]=l("div",{class:"lesson-box hint"},[l("strong",null,"部署前先验证："),l("code",null,"npm run build"),e(" 之后用 "),l("code",null,"vite preview"),e(" 以生产行为跑一遍 "),l("code",null,"dist/"),e("。开发服务器和生产产物的行为可能不同，别等到上线才发现。 ")],-1)),n[18]||(n[18]=l("h2",null,"双引擎差异对照",-1)),l("figure",ll,[n[0]||(n[0]=l("figcaption",null,"在三个页签间切换：先看核心概念卡片，再对着对比表看 Vite 与 Webpack 在启动、HMR、冷启动上的差距，最后读一眼驱动两个引擎的那份配置长什么样。",-1)),I(h)]),n[19]||(n[19]=l("h2",null,"开发生产双链路",-1)),n[20]||(n[20]=l("p",null,[e(" Vite 快，不是因为把打包做得更快，而是因为"),l("strong",null,"开发阶段根本不需要打包"),e("。它把工程拆成两条链路：开发用浏览器原生 ESM 按需加载源码、就地即时编译，生产才切回 Rollup 做完整的优化打包。理解了这个「双引擎」结构，后面的配置、插件、HMR 都只是往这两条链路上加东西。 ")],-1)),n[21]||(n[21]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「依赖预构建」"),e("指 Vite 在开发启动时用 esbuild 把 "),l("code",null,"node_modules"),e(" 里的依赖预先打成少量 ESM 包，并改写源码中的裸模块名指向它们，结果缓存在 "),l("code",null,"node_modules/.vite"),e("。边界：它只处理"),l("strong",null,"依赖"),e("，你的源码不参与；依赖或锁文件变化时会自动重做，否则直接复用缓存。 ")],-1))]),_:1})}}}),nl={class:"v02"},tl={class:"tabs"},sl=["onClick"],ol={class:"code-block"},ul=g({__name:"V02Config",setup(a){const t=b("basic"),n={basic:`// vite.config.ts
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
// 只暴露 VITE_ 前缀的变量到客户端`};return(m,r)=>(o(),p("div",nl,[r[0]||(r[0]=l("p",{class:"intro"},[e("Vite 配置文件使用 "),l("code",null,"defineConfig"),e(" 获得类型提示。")],-1)),l("div",tl,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,sl)),64))]),l("pre",ol,[l("code",null,i(n[t.value]),1)])]))}}),il=E(ul,[["__scopeId","data-v-71e534aa"]]),dl={class:"lesson-figure"},rl=g({__name:"V02ConfigArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("本地调试想要 sourcemap 和固定端口，线上却必须关掉 sourcemap、换个压缩器。每次发版前你都手动翻配置文件改这几行，直到有一次忘了关 sourcemap，把整份源码映射连同 "),l("code",null,".map"),e(" 一起传上了 CDN。 ")],-1)),n[2]||(n[2]=l("h2",null,"多环境分支配置",-1)),n[3]||(n[3]=l("p",null,[e(" 这类需求看起来很小：开发时想要热更新友好、能定位到源码；生产时想要体积小、不暴露内部结构。可它们全落在同一个文件里——"),l("code",null,"vite.config.ts"),e("。配置项少时你还能靠记忆改；一旦有了 "),l("code",null,"server"),e("、"),l("code",null,"build"),e("、"),l("code",null,"resolve"),e("、"),l("code",null,"css"),e(" 几十个字段，"),l("strong",null,"「不同环境要不同设置」就变成了一场手工切换"),e("。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 手工切换的成本是隐性的：改配置容易漏掉某个字段；维护两份配置文件又得在命令里加 "),l("code",null,"--config"),e(" 切换，很容易跑错；把环境判断散写成一堆三元表达式，读起来也不知道哪段属于哪个环境。说到底，问题是："),l("strong",null,"能不能用一份配置，按当前环境自动给出不同的结果？")],-1)),n[5]||(n[5]=l("h2",null,"配置对象导出",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：在项目根目录建一个 "),l("code",null,"vite.config.ts"),e("，导出一个普通对象，把 "),l("code",null,"server"),e("、"),l("code",null,"build"),e("、"),l("code",null,"resolve.alias"),e("、"),l("code",null,"plugins"),e(" 一次写清楚。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把散落在命令行参数里的配置收拢到了一个入口"),e("。Vite 启动时会自动找到它，不需要你额外指定路径。配置项有了统一的归属，这是后面一切的前提。 ")],-1)),n[8]||(n[8]=l("h2",null,"静态取值局限",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("静态对象没法按环境分支："),l("code",null,"build.sourcemap"),e(" 只能写死成 "),l("code",null,"true"),e(" 或 "),l("code",null,"false"),e("，开发想要、生产不想要的需求直接卡住。")]),l("li",null,[e("写成 "),l("code",null,[e("sourcemap: process.env"),l("span",null,".NODE_ENV !== 'production'")]),e(" 这类表达式，会散落到每个字段上，字段一多就没人看得懂。")]),l("li",null,[e("手写对象没有类型约束，把 "),l("code",null,"outDir"),e(" 拼成 "),l("code",null,"outdir"),e("，Vite 不报错，只会在构建时默默用了默认值。")]),l("li",null,"想「构建分析时才加可视化插件」，静态对象里根本没有地方放这段条件逻辑。")],-1)),n[10]||(n[10]=l("h2",null,"类型推导与分支",-1)),n[11]||(n[11]=l("p",null,[e(" 先解决「配置要有类型」。用 Vite 导出的 "),l("code",null,"defineConfig"),e(" 把对象包起来，返回值会获得完整的类型推导，字段拼错时编辑器当场标红，而不是等到构建才发现被静默忽略。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着解决「按环境分支」。把导出的值从对象换成一个函数，函数接收 "),l("code",null,"{ command, mode }"),e("："),l("code",null,"command"),e(" 区分是 "),l("code",null,"serve"),e("（开发）还是 "),l("code",null,"build"),e("（构建），"),l("code",null,"mode"),e(" 区分当前模式（如 "),l("code",null,"development"),e(" / "),l("code",null,"production"),e("）。在函数体内判断这两个值，返回不同的配置。"),l("strong",null,"它返回的对象会与 Vite 的默认配置深度合并"),e("——这点很关键，你不必把默认值抄一遍，只写差异部分。 ")],-1)),n[13]||(n[13]=l("ol",{class:"lesson-steps"},[l("li",null,"写静态对象，先把通用配置摆好。"),l("li",null,[e("套上 "),l("code",null,"defineConfig"),e("，拿到类型提示。")]),l("li",null,[e("把对象改成 "),l("code",null,"({ command, mode }) => {...}"),e(" 形式的函数，函数内按环境返回分支配置。")]),l("li",null,"返回值与默认配置深度合并，只有你写到的字段会被覆盖。")],-1)),n[14]||(n[14]=l("p",null,[e(" 再解决「条件追加插件」。既然已经是函数，就能在里面写普通 JS："),l("code",null,"if (process.env.ANALYZE) plugins.push(visualizer())"),e("，只在需要分析包体积时才把可视化插件挂上去。环境差异写进函数、敏感值交给环境变量，配置文件里不该出现密钥或绝对路径。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"常见误区："),e("配置字段拼写错误不会报错，会被"),l("strong",null,"静默忽略"),e("。改完配置后用 "),l("code",null,"vite --debug"),e(" 查看最终解析结果，确认字段真的生效了。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box hint"},[l("strong",null,"两个高频字段："),l("code",null,"resolve.alias"),e(" 用来配 "),l("code",null,"@"),e(" 之类的路径别名；"),l("code",null,"css.preprocessorOptions"),e(" 可以往每个 SCSS 文件里注入全局变量或 "),l("code",null,"@use"),e("。函数式配置返回空对象也不会丢默认行为，因为深度合并只在「你写了的字段」上覆盖。 ")],-1)),n[17]||(n[17]=l("h2",null,"基础进阶对照",-1)),l("figure",dl,[n[0]||(n[0]=l("figcaption",null,"切换 basic / advanced / env 三个页签，对照看基础配置、别名与分包这类进阶配置，以及环境变量是怎么接进配置里的。",-1)),I(il)]),n[18]||(n[18]=l("h2",null,"函数式配置返回",-1)),n[19]||(n[19]=l("p",null,[e(" 配置文件是 Vite 的项目级入口，真正让它灵活的转折，是从「导出一个对象」变成「导出一个函数」。函数接收 "),l("code",null,"{ command, mode }"),e("，按环境返回不同配置，返回值再由 Vite 与默认配置深度合并。于是开发与生产的分歧集中在一个地方表达，不再散落成一堆没人看得懂的三元表达式。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「函数式配置」"),e("指 "),l("code",null,"defineConfig"),e(" 接收一个 "),l("code",null,"({ command, mode }) => UserConfig"),e(" 形式的函数，Vite 在启动时执行它并深度合并返回值。边界：函数在每次启动（dev 或 build）时执行一次，只有返回值里写到的字段才会覆盖默认值；返回空对象是合法的，不会清空默认配置。 ")],-1))]),_:1})}}}),pl={class:"v03"},al={class:"list"},ml=g({__name:"V03Plugins",setup(a){const t=[{name:"@vitejs/plugin-vue",desc:"Vue 3 支持（SFC 编译、HMR）"},{name:"@vitejs/plugin-vue-jsx",desc:"Vue JSX / TSX 支持"},{name:"@vitejs/plugin-react",desc:"React 支持（自动 JSX 转换、Fast Refresh）"},{name:"unplugin-vue-components",desc:"Vue 组件自动按需引入"},{name:"unplugin-auto-import",desc:"API 自动按需引入（ref、computed 等）"},{name:"vite-plugin-pwa",desc:"PWA 支持（离线缓存、Service Worker）"}];return(n,m)=>(o(),p("div",pl,[m[0]||(m[0]=l("p",{class:"intro"},[e("Vite 插件兼容 Rollup 插件接口，在 "),l("code",null,"vite.config.ts"),e(" 的 "),l("code",null,"plugins"),e(" 数组中注册。")],-1)),l("ul",al,[(o(),p(C,null,x(t,r=>l("li",{key:r.name},[l("code",null,i(r.name),1),l("span",null,i(r.desc),1)])),64))]),m[1]||(m[1]=l("pre",{class:"code-block"},[l("code",null,`// vite.config.ts
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    vue(),
    Components({ /* 配置 */ }),
  ],
})`)],-1))]))}}),cl=E(ml,[["__scopeId","data-v-1984cf5f"]]),vl={class:"lesson-figure"},gl=g({__name:"V03PluginsArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你写了个插件想给源码里的某个函数名做替换，注册进 "),l("code",null,"plugins"),e(" 数组后毫无反应；同事几乎一样的插件却生效了。把两份配置一对比，唯一的差别是注册的先后位置。 ")],-1)),n[2]||(n[2]=l("h2",null,"日常重复自动化",-1)),n[3]||(n[3]=l("p",null,[e(" 日常开发里重复劳动很多：每写一个组件都要手写一行 "),l("code",null,"import"),e("；"),l("code",null,"ref"),e("、"),l("code",null,"computed"),e(" 每次都得从 "),l("code",null,"vue"),e(" 里引；想让某个功能只在开发阶段生效，又得手动增删代码。你希望把这些重复动作"),l("strong",null,"交给工具自动完成"),e("，同时保留「按阶段启用」的能力。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 但真正的难点不在「怎么挂上插件」，而在"),l("strong",null,"「谁先谁后」"),e("。Vite 内部本身就有一批核心插件，负责编译 Vue、处理样式与资源。如果你的插件想在它们之前读到原始源码、或在它们之后修改产物，靠数组里的位置去排是很脆弱的：以后加一个插件，顺序就变了。所以问题是："),l("strong",null,"插件的执行顺序，能不能被显式声明？")],-1)),n[5]||(n[5]=l("h2",null,"插件数组声明",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：往配置的 "),l("code",null,"plugins"),e(" 数组里塞插件即可。例如 "),l("code",null,"plugins: [vue()]"),e(" 就能让 "),l("code",null,".vue"),e(" 文件被正确编译；需要 JSX 就再加一个 "),l("code",null,"vueJsx()"),e("。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把「扩展 Vite」统一成了「往一个数组里加东西」"),e("，不需要改 Vite 源码，插件的组合因此是可插拔的。 ")],-1)),n[8]||(n[8]=l("h2",null,"注册位置敏感",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("顺序敏感：把转换插件写在 "),l("code",null,"vue()"),e(" 后面，拿到的可能已经是 SFC 编译后的代码，结果和预期不符。")]),l("li",null,"想「跑在核心插件之前」只能靠数组位置表达，加一个插件就可能把顺序撞乱。"),l("li",null,[e("自动按需引入会生成 "),l("code",null,"auto-imports.d.ts"),e(" / "),l("code",null,"components.d.ts"),e("，没加进 "),l("code",null,"tsconfig"),e(" 的 "),l("code",null,"include"),e("，编辑器会报「变量未定义」。")]),l("li",null,"插件一旦抛错会中断整个 dev server，报错里往往只有插件名，定位只能靠猜。")],-1)),n[10]||(n[10]=l("h2",null,"三段执行排序",-1)),n[11]||(n[11]=l("p",null,[e(" 先解决顺序。Vite 借用了 Rollup 的插件接口，并加了几个特有钩子；同时每个插件可以声明 "),l("code",null,"enforce"),e(" 字段。于是插件被分成三段排序："),l("code",null,"enforce: 'pre'"),e(" 的排在 Vite 核心插件"),l("strong",null,"之前"),e("，未声明的普通插件排在核心插件"),l("strong",null,"之后"),e("，"),l("code",null,"enforce: 'post'"),e(" 的排在所有这些"),l("strong",null,"之后"),e("。你的转换插件该站哪一段，用 "),l("code",null,"enforce"),e(" 一句话声明，不再依赖数组下标。 ")],-1)),n[12]||(n[12]=l("ol",{class:"lesson-steps"},[l("li",null,"pre 阶段：在所有核心插件之前执行，适合最早接触原始源码。"),l("li",null,"核心阶段：Vite 内置插件，负责编译 Vue、处理样式与资源。"),l("li",null,"普通阶段：未声明 enforce 的插件，在核心插件之后运行。"),l("li",null,[e("post 阶段：最后由 "),l("code",null,"enforce: 'post'"),e(" 的插件收尾。")])],-1)),n[13]||(n[13]=l("p",null,[e(" 再解决「按阶段启用」。既然配置能写成函数，就能按 "),l("code",null,"command"),e(" 判断："),l("code",null,"command === 'serve'"),e(" 时只 push 开发插件，"),l("code",null,"command === 'build'"),e(" 时只 push 构建插件，启用与否变成了普通的分支逻辑。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 最后一块拼图是「为什么插件能通用」。Vite 插件"),l("strong",null,"兼容 Rollup 的插件接口"),e("——"),l("code",null,"transform"),e("、"),l("code",null,"resolveId"),e(" 这些钩子含义一致，所以一个 Rollup 插件稍作调整就能用在 Vite 上。社区里大量插件用 "),l("code",null,"vite-plugin-"),e(" 或 "),l("code",null,"unplugin-"),e(" 前缀分发，后者还能同时适配多个打包器；自动按需引入组件与 API 的 "),l("code",null,"unplugin-vue-components"),e("、"),l("code",null,"unplugin-auto-import"),e(" 就是这类。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"记得补类型文件："),e("自动引入生成的 "),l("code",null,"dts"),e(" 声明文件要加进 "),l("code",null,"tsconfig.json"),e(" 的 "),l("code",null,"include"),e("，否则编辑器不认识自动引入的变量。插件执行出错会中断 dev server，报错信息里的插件名就是最快的定位线索。 ")],-1)),n[16]||(n[16]=l("h2",null,"清单与数组对照",-1)),l("figure",vl,[n[0]||(n[0]=l("figcaption",null,[e("翻一遍插件清单，认出哪些是你项目里已经在用的；再看下面那段注册代码，对照 "),l("code",null,"plugins"),e(" 数组的写法，想清楚每个插件大致站在哪一段。")],-1)),I(cl)]),n[17]||(n[17]=l("h2",null,"钩子顺序与接口",-1)),n[18]||(n[18]=l("p",null,[e(" 插件机制把「扩展 Vite」变成了往 "),l("code",null,"plugins"),e(" 数组里加东西，而顺序这个最容易出错的部分，被 "),l("code",null,"enforce"),e(" 显式化成了 pre / 普通 / post 三段。又因为接口与 Rollup 兼容，你写一次的转换逻辑，往往能跨越打包器复用。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「enforce」"),e("是插件上的一个字段，用来声明执行阶段："),l("code",null,"enforce: 'pre'"),e(" 排在 Vite 核心插件之前，"),l("code",null,"enforce: 'post'"),e(" 排在所有插件之后，不声明则位于核心插件之后。边界：它只调整「同一阶段内」的相对顺序，不能越过阶段；它本身也不启用或禁用插件，只负责排序。 ")],-1))]),_:1})}}}),fl={class:"v04"},bl={class:"tabs"},yl=["onClick"],Sl={class:"code-block"},Vl=g({__name:"V04HMR",setup(a){const t=b("hmr"),n={hmr:`// Vite HMR API（手动处理边界情况）
if (import.meta.hot) {
  // 模块热更新
  import.meta.hot.accept((mod) => {
    console.log('模块更新:', mod)
  })

  // 模块销毁时清理
  import.meta.hot.dispose(() => {
    console.log('模块即将被替换')
  })
}`,vue:`<span class="cm">&lt;!-- Vue SFC 的 HMR 是开箱即用的 --&gt;</span>
<span class="cm">&lt;!-- @vitejs/plugin-vue 会自动处理： --&gt;</span>
<span class="cm">&lt;!-- - template 更新 → 不丢失状态 --&gt;</span>
<span class="cm">&lt;!-- - script 更新 → 保留组件状态 --&gt;</span>
<span class="cm">&lt;!-- - style 更新 → 样式热替换 --&gt;</span>

<span class="tag">&lt;script</span> <span class="attr">setup</span> <span class="attr">lang</span>=<span class="str">"ts"</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref } <span class="keyword">from</span> <span class="str">'vue'</span>
<span class="keyword">const</span> count = ref(<span class="num">0</span>) <span class="cm">// HMR 时这个值会被保留</span>
<span class="tag">&lt;/script&gt;</span>`,react:`// React Fast Refresh（@vitejs/plugin-react）
// 自动支持：
// - 函数组件更新 → 保留 React 状态
// - Hook 顺序不变 → 状态不丢失
// - 导出组件 → 精准更新

// 需要在组件顶部添加（某些版本需要）：
// @refresh reset  // 强制重置状态`};return(m,r)=>(o(),p("div",fl,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 的 HMR 基于原生 ESM，只更新变化的模块，速度极快。",-1)),l("div",bl,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,yl)),64))]),l("pre",Sl,[l("code",null,i(n[t.value]),1)])]))}}),Cl=E(Vl,[["__scopeId","data-v-98b85452"]]),xl={class:"lesson-figure"},kl=g({__name:"V04HMRArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你在一个多步表单里填了半小时，最后只改了一行 CSS 的颜色，保存后整页刷新——所有输入、展开的折叠面板、滚到的位置，全部回到初始状态。 ")],-1)),n[2]||(n[2]=l("h2",null,"传统刷新根因",-1)),n[3]||(n[3]=l("p",null," 这个体验的根源是传统刷新：文件一改，整个页面重新加载，运行时的所有状态随之清零。你只是想看一个颜色的变化，却被迫重新走一遍操作路径。更隐蔽的代价在调试上——复现一个偶发问题时，你通常要点开三四层菜单、填一堆值，页面一刷新，这些前置动作全部白做。 ",-1)),n[4]||(n[4]=l("p",null,[e(" 能不能「只换掉改动的那个模块」，让页面其余部分和它的运行时状态原封不动？难点在于：一个模块被改动后，"),l("strong",null,"谁该被替换、谁必须保留、状态又该挂在哪里"),e("——没有一套边界规则，根本说不清替换的范围。 ")],-1)),n[5]||(n[5]=l("h2",null,"实时整页刷新",-1)),n[6]||(n[6]=l("p",null," 最省事的做法：文件保存后就让浏览器整页刷新（live reload）。新代码立刻可见，行为也完全可预期。 ",-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它保证了「你看到的永远是改完后的代码」"),e("，不会出现新旧代码混用的假象。只要你不介意丢失状态，它就够用。 ")],-1)),n[8]||(n[8]=l("h2",null,"运行时状态清零",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("运行时状态全丢："),l("code",null,"ref"),e(" 里的值、表单输入、滚动位置、弹窗开关，全部回到初始值。")]),l("li",null,"层级越深的页面刷新越慢，一个改样式的动作要等整棵树重建完。"),l("li",null,"它无法只重建某个组件——哪怕你只动了 CSS，整个应用也要重来一遍。"),l("li",null,"调试偶发问题时，每次刷新都得重做一遍前置操作，效率极低。")],-1)),n[10]||(n[10]=l("h2",null,"模块替换粒度",-1)),n[11]||(n[11]=l("p",null,[e(" 不推翻「替换成新代码」，而是把替换的"),l("strong",null,"粒度"),e("从「整页」缩小到「模块」。Vite 的 HMR 建立在原生 ESM 的模块边界上：每个模块都是一条边界，文件改动后，服务器沿着 "),l("code",null,"import"),e(" 链"),l("strong",null,"向上"),e("寻找最近的「接受者」。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 先补「谁来接受」。一个模块只要写下 "),l("code",null,"import.meta.hot.accept()"),e("，就声明了自己可以被热替换；如果一路往上都找不到任何接受者，更新就会持续冒泡，最终退化成整页刷新。这是理解 HMR 的第一条规则："),l("strong",null,"替换范围由接受者决定，而不是由文件决定"),e("。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「框架为什么开箱即用」。你写 Vue 时从没手动写过 "),l("code",null,"accept"),e("，是因为 "),l("code",null,"@vitejs/plugin-vue"),e(" 已经为每个 SFC 注入了接受逻辑；React 侧则由 "),l("code",null,"@vitejs/plugin-react"),e(" 的 Fast Refresh 负责。框架插件替你标好了边界。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 接着补「状态怎么跨更新存活」。新模块会生成新的导出，如果状态保存在模块级变量里，你需要用 "),l("code",null,"import.meta.hot.dispose()"),e(" 在替换前清理旧模块，再在 "),l("code",null,"accept"),e(" 回调里把新导出接到旧的引用上；更稳妥的做法是把状态放进 Pinia 这类独立 store，因为 "),l("strong",null,"store 不在被替换的模块里，自然不受影响"),e("。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补不同文件类型的行为差异。Vue SFC 里，改 "),l("code",null,"<template>"),e(" 或 "),l("code",null,"<style>"),e(" 通常不丢状态；而改 "),l("code",null,"<script setup>"),e(" 的逻辑时会重建组件实例，模块级状态会重置。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两个必记的坑："),e("手动 HMR 代码一定要包在 "),l("code",null,"if (import.meta.hot)"),e(" 守卫里，因为生产构建中 "),l("code",null,"import.meta.hot"),e(" 是 "),l("code",null,"undefined"),e("，不加守卫会直接报错；其次，"),l("code",null,"accept"),e(" 的回调里要"),l("strong",null,"主动应用新模块的导出"),e("，只写个空回调，界面不会随更新变化。 ")],-1)),n[17]||(n[17]=l("h2",null,"三类热更新差异",-1)),l("figure",xl,[n[0]||(n[0]=l("figcaption",null,"切换 hmr / vue / react 三个页签，看手动声明接受者的写法、Vue SFC 三种代码块的更新差异，以及 React Fast Refresh 的规则。",-1)),I(Cl)]),n[18]||(n[18]=l("h2",null,"更新冒泡与回退",-1)),n[19]||(n[19]=l("p",null,[e(" 热更新的本质，是给「替换」划一条边界。模块用 "),l("code",null,"accept"),e(" 声明自己可以接受更新，更新就沿 "),l("code",null,"import"),e(" 链向上冒泡到最近的边界为止；找不到边界，才退化成整页刷新。想让状态活下来，就把它放到边界之外——比如 Pinia store。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「HMR 边界」"),e("指一个模块通过 "),l("code",null,"import.meta.hot.accept"),e(" 声明自己可被热替换（或可接受某个依赖的更新）后所形成的替换范围。边界：更新沿 import 链向上传播，遇到最近的边界即停止，没有边界就整页刷新；这套代码只在 "),l("code",null,"if (import.meta.hot)"),e(" 内有效，生产构建中该对象不存在。 ")],-1))]),_:1})}}}),Ml={class:"v05"},$l={class:"tabs"},Tl=["onClick"],El={class:"code-block"},Rl=g({__name:"V05Env",setup(a){const t=b("files"),n={files:`# 环境变量文件（按优先级从低到高）
.env                # 所有环境加载
.env.development    # npm run dev 时加载
.env.production     # npm run build 时加载
.env.local          # 本地覆盖，git 忽略`,usage:`// 在 vite.config.ts 中读取
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    define: {
      __API__: JSON.stringify(env.VITE_API_URL),
    },
  }
})

// 在代码中读取（仅 VITE_ 前缀暴露到客户端）
const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE`,prefix:`// .env
VITE_API_URL=https://api.example.com   ✅ 暴露到客户端
DB_PASSWORD=secret                      ❌ 不暴露（服务端专用）

// 服务端代码中可读取所有变量
// 客户端代码中只能读取 VITE_ 前缀的变量

// TypeScript 类型提示（vite-env.d.ts）
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 更多环境变量...
}`};return(m,r)=>(o(),p("div",Ml,[r[0]||(r[0]=l("p",{class:"intro"},[e("Vite 使用 "),l("code",null,"dotenv"),e(" 加载环境变量，"),l("code",null,"VITE_"),e(" 前缀的变量会暴露到客户端。")],-1)),l("div",$l,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Tl)),64))]),l("pre",El,[l("code",null,i(n[t.value]),1)])]))}}),Ll=E(Rl,[["__scopeId","data-v-99e0ce4a"]]),Il={class:"lesson-figure"},wl=g({__name:"V05EnvArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你把数据库连接串写进 "),l("code",null,".env"),e("，本以为它只在服务端使用；结果打包上线后，打开浏览器 DevTools 的 Network 面板，那串密码明晃晃地躺在 JS 产物里。 ")],-1)),n[2]||(n[2]=l("h2",null,"多环境变量差异",-1)),n[3]||(n[3]=l("p",null," 同一套代码要跑在开发、测试、生产三套环境上，API 地址、开关、版本号都不一样。硬编码进代码意味着每次发布都要改一遍源码，漏改一处就是线上事故。自然的想法是：把差异抽成「环境变量」，运行时按环境注入。 ",-1)),n[4]||(n[4]=l("p",null,[e(" 但前端有个特殊之处："),l("strong",null,"代码最终跑在用户的浏览器里，而浏览器没有任何「服务端环境」可言"),e("。于是两个问题同时冒出来：变量怎么按环境加载、相互覆盖的优先级是什么？以及——哪些变量能进入客户端，哪些一旦进去就等于公开？后者没处理好，就是开头那场泄漏。 ")],-1)),n[5]||(n[5]=l("h2",null,"环境文件格式",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：建一个 "),l("code",null,".env"),e(" 文件，按 "),l("code",null,"KEY=VALUE"),e(" 的格式写好变量，代码里读出来用。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把「随环境变化的配置」从源码里剥离了出来"),e("，同一份代码配上不同的 "),l("code",null,".env"),e(" 就能适配不同环境，不必再改代码。 ")],-1)),n[8]||(n[8]=l("h2",null,"密钥暴露风险",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("浏览器里没有 "),l("code",null,"process"),e("，直接写 "),l("code",null,"process.env.API_URL"),e(" 拿到的是 "),l("code",null,"undefined"),e("，甚至连 "),l("code",null,"process"),e(" 本身都不存在。")]),l("li",null,[e("如果 "),l("code",null,".env"),e(" 里所有变量都注入客户端，数据库密码这类服务端专用凭据会被一起打进产物，人人可见。")]),l("li",null,[e("不同环境要不同值，但一个 "),l("code",null,".env"),e(" 只有一份，开发沿用生产地址就会连错后端。")]),l("li",null,[e("改完 "),l("code",null,".env"),e(" 不重启开发服务器，浏览器里读到的还是旧值。")])],-1)),n[10]||(n[10]=l("h2",null,"构建时静态替换",-1)),n[11]||(n[11]=l("p",null,[e(" 先解决「浏览器没有 process」。Vite 不在运行时注入变量，而是在"),l("strong",null,"构建时做静态替换"),e("：把代码里的 "),l("code",null,"import.meta.env.VITE_API_URL"),e(" 直接替换成字符串字面量。这也是为什么它必须在构建前就确定，运行时改不了。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 再解决「谁有资格进客户端」。Vite 加了一道前缀白名单："),l("strong",null,[e("只有 "),l("code",null,"VITE_"),e(" 开头的变量会被替换进客户端代码")]),e("，其余变量仅对配置文件的 Node 侧逻辑可见。把数据库密码写成不带前缀的 "),l("code",null,"DB_PASSWORD"),e("，它从机制上就进不了浏览器——这才是防泄漏的正确姿势，而不是靠自觉。 ")],-1)),n[13]||(n[13]=l("p",null," 接着解决「多环境如何取不同值」。Vite 按固定优先级加载文件，后者覆盖前者： ",-1)),n[14]||(n[14]=l("ol",{class:"lesson-steps"},[l("li",null,[l("code",null,".env"),e("：所有环境都会加载的公共变量。")]),l("li",null,[l("code",null,".env.local"),e("：本机覆盖，通常加入 "),l("code",null,".gitignore"),e("。")]),l("li",null,[l("code",null,".env.[mode]"),e("：当前模式专属，如 "),l("code",null,".env.development"),e("、"),l("code",null,".env.production"),e("。")]),l("li",null,[l("code",null,".env.[mode].local"),e("：模式专属的本机覆盖，优先级最高。")])],-1)),n[15]||(n[15]=l("p",null,[e(" 这里的 "),l("code",null,"mode"),e(" 默认是 "),l("code",null,"development"),e("（"),l("code",null,"dev"),e(" 时）或 "),l("code",null,"production"),e("（"),l("code",null,"build"),e(" 时），可用 "),l("code",null,"--mode"),e(" 覆盖。除自定义变量外，Vite 还内置了 "),l("code",null,"import.meta.env.MODE"),e("、"),l("code",null,"DEV"),e("、"),l("code",null,"PROD"),e("、"),l("code",null,"SSR"),e("，可以直接判断当前运行模式。 ")],-1)),n[16]||(n[16]=l("p",null,[e(" 再往前一步，配置文件里有时也需要读变量，比如给 "),l("code",null,"server.proxy"),e(" 配后端地址。这时用 "),l("code",null,"loadEnv(mode, process.cwd())"),e(" 读取；注意默认它"),l("strong",null,[e("只返回带 "),l("code",null,"VITE_"),e(" 前缀的变量")]),e("，第三个参数传空字符串 "),l("code",null,"''"),e(" 才能把不带前缀的也读出来——因为这段逻辑跑在 Node 侧、不进浏览器，是安全的。 ")],-1)),n[17]||(n[17]=l("p",null,[e(" 最后补上类型提示。在 "),l("code",null,"vite-env.d.ts"),e(" 里扩展 "),l("code",null,"ImportMetaEnv"),e(" 接口，声明你自定义的变量，编辑器里 "),l("code",null,"import.meta.env.XXX"),e(" 才有补全和类型检查。 ")],-1)),n[18]||(n[18]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),e("敏感信息"),l("strong",null,"绝不能"),e("加 "),l("code",null,"VITE_"),e(" 前缀，它会原样进入客户端产物；变量在构建时被静态写死，多环境意味着各自构建一份，无法在运行时切换。另外，改完 "),l("code",null,".env"),e(" 记得重启开发服务器，已注入的旧值不会热更新。 ")],-1)),n[19]||(n[19]=l("h2",null,"变量文件加载顺序",-1)),l("figure",Il,[n[0]||(n[0]=l("figcaption",null,[e("切 files / usage / prefix 三个页签：先看变量文件按优先级排列，再看配置文件与代码里分别怎么读，最后看 "),l("code",null,"VITE_"),e(" 前缀如何决定一个变量暴不暴露给客户端。")],-1)),I(Ll)]),n[20]||(n[20]=l("h2",null,"优先级与白名单",-1)),n[21]||(n[21]=l("p",null,[e(" 环境变量这件事，关键是分清两件事："),l("strong",null,"加载有优先级，暴露有白名单"),e("。Vite 按 "),l("code",null,".env"),e(" → "),l("code",null,".env.local"),e(" → "),l("code",null,".env.[mode]"),e(" → "),l("code",null,".env.[mode].local"),e(" 依次覆盖，最终值在构建时静态替换进代码；而只有 "),l("code",null,"VITE_"),e(" 前缀的变量会进入客户端，其余留在 Node 侧。记住这两条，多环境配置和密钥泄漏就都能守住。 ")],-1)),n[22]||(n[22]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「VITE_ 前缀」"),e("是 Vite 用来区分客户端与服务端变量的白名单：只有以 "),l("code",null,"VITE_"),e(" 开头的变量才会被静态替换进客户端代码，通过 "),l("code",null,[e("import.meta"),l("span",null,".env")]),e(" 访问；不带前缀的变量仅对 "),l("code",null,"vite.config.ts"),e(" 等 Node 侧代码可见。边界：前缀是唯一判据，与变量是否「敏感」无关，所以密钥要刻意"),l("strong",null,"不加"),e("前缀。 ")],-1))]),_:1})}}}),Dl={class:"v06"},Hl={class:"tabs"},Al=["onClick"],Pl={class:"code-block"},jl=g({__name:"V06Assets",setup(a){const t=b("import"),n={import:`// 显式导入（推荐）
import logo from './assets/logo.png'
// → 开发阶段：/src/assets/logo.png
// → 构建后：/assets/logo.hash.png（自动哈希）

// 图片路径会自动处理
const img = new URL('./assets/bg.png', import.meta.url).href
// → 构建后同样会哈希化`,public:`// public 目录下的文件（不经过 Vite 处理）
// 直接复制到构建产物的根目录

// 引用方式：绝对路径
<img src="/favicon.svg" />
// → 开发时从 /public/favicon.svg 提供
// → 构建时原样复制到 dist/favicon.svg

// 适合：robots.txt、favicon、不常变更的静态资源`,inline:`// 小资源自动内联（base64）
// 默认阈值：4KB（可配置）

export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // 4KB，单位 byte
  },
})

// 小于 4KB 的图片会被内联为 base64
// 减少 HTTP 请求，但增加 bundle 体积`};return(m,r)=>(o(),p("div",Dl,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 对静态资源有三种处理方式：导入哈希化、public 原样复制、小资源内联。",-1)),l("div",Hl,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Al)),64))]),l("pre",Pl,[l("code",null,i(n[t.value]),1)])]))}}),Ol=E(jl,[["__scopeId","data-v-1c4bc43c"]]),Jl={class:"lesson-figure"},zl=g({__name:"V06AssetsArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你写 "),l("code",null,`<img :src="'./assets/' + name + '.png'">`),e(" 按名字动态切图，本地开发张张正常；构建上线后全部变成裂图——因为产物里的文件名已经变成了 "),l("code",null,"logo.2d3a5b1c.png"),e("，而你的字符串还停在 "),l("code",null,"logo.png"),e("。 ")],-1)),n[2]||(n[2]=l("h2",null,"资源路径解析",-1)),n[3]||(n[3]=l("p",null," 图片、字体、favicon 这些静态资源，在你的源码里是「文件」，交给浏览器时却必须变成「URL」。开发阶段 Vite 直接按源码路径把文件喂给浏览器，所见即所得；可生产构建之后，文件可能被复制到别的目录、被重命名、被压缩，甚至被整个内联进 JS。 ",-1)),n[4]||(n[4]=l("p",null,[e(" 于是同一份资源，在「源码里的路径」和「最终产物的 URL」之间裂开了一道鸿沟。如果资源全交给人工维护——手动拷进某个目录、手写最终路径——你必须替构建工具记住三件事："),l("strong",null,"每个文件最后会叫什么名字、放在哪个目录、以文件还是内联的形式存在"),e("。任何一件记错，就是开头那样的 404。所以真正的问题是：当你只写了一句资源引用，究竟由谁来决定它最终的名字、位置和存在形式？ ")],-1)),n[5]||(n[5]=l("h2",null,"公共目录引用",-1)),n[6]||(n[6]=l("p",null,[e(" 最省事的做法：把所有图片、图标统统丢进 "),l("code",null,"public/"),e(" 目录，代码里一律用绝对路径引用，比如 "),l("code",null,"/logo.png"),e("。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"URL 完全稳定、完全由人掌控"),e("。你在源码里写什么地址，产物里就是什么地址，中间不经过任何加工，脑子里的路径和浏览器的路径永远一致。 ")],-1)),n[8]||(n[8]=l("h2",null,"旧图缓存未更新",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("改图不生效：新版 "),l("code",null,"logo.png"),e(" 覆盖旧文件后文件名没变，浏览器和 CDN 仍命中旧缓存，用户看到的还是旧图。")]),l("li",null,"体积失控：几百 KB 的大图和 1KB 的小图标都得各发一次请求，想让小图标省掉请求也做不到。"),l("li",null,"构建工具「看不见」它：public 里的文件不参与模块图，不会被压缩、内联或 Tree Shaking；文件名写错了构建期不报错，上线才 404。")],-1)),n[10]||(n[10]=l("h2",null,"内容哈希指纹",-1)),n[11]||(n[11]=l("p",null,[e(" 先补第一层：让构建工具接管资源。改用 "),l("code",null,"import"),e(" 导入，例如 "),l("code",null,"import logo from './assets/logo.png'"),e("。导入之后资源被纳入模块图，Vite 会按文件"),l("strong",null,"内容生成哈希文件名"),e("（如 "),l("code",null,"logo.2d3a5b1c.png"),e("）再输出，并把最终 URL 返回给你的变量。内容一变文件名就变，缓存天然被绕过；反过来内容不变文件名就不变，可以放心为产物设置长期强缓存。这是引用资源的第一选择。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补第二层：小资源内联。每次引用一个小图标都发一次请求，图标一多首屏就是几十次请求。于是 Vite 设了一个阈值 "),l("code",null,"assetsInlineLimit"),e("（默认 "),l("code",null,"4096"),e(" 字节，即 4KB）："),l("strong",null,"小于阈值的资源会被内联成 base64 data URL"),e("，直接嵌进 JS/CSS，省掉一次请求。但内联不是白捡的——base64 会让体积增大约 33%，而且没法单独缓存，所以大图不该走这条路。 ")],-1)),n[13]||(n[13]=l("p",null," 再补第三层：给单个资源显式指定处理方式，覆盖默认阈值。在导入后缀上标注即可： ",-1)),n[14]||(n[14]=l("ol",{class:"lesson-steps"},[l("li",null,[l("code",null,"?url"),e("：强制返回 URL，即使小于阈值也不内联。")]),l("li",null,[l("code",null,"?inline"),e("：强制内联，即使大于阈值也内联。")]),l("li",null,[l("code",null,"?raw"),e("：不当作资源，直接作为字符串把文件内容读进来。")]),l("li",null,[l("code",null,"?worker"),e("：作为 Web Worker 导入。")])],-1)),n[15]||(n[15]=l("p",null,[e(" 最后一层是「分家住」，也是开头那个 404 的正解。public 不是被淘汰，而是有了明确分工："),l("strong",null,"它只适合 favicon、robots.txt 这类「不常变更、不参与构建、必须待在根路径」的文件"),e("，原样复制到 dist 根目录，引用时必须写绝对路径 "),l("code",null,"/favicon.ico"),e("；其余资源一律放 "),l("code",null,"src/assets"),e(" 走 import。此外，静态导入图片要有类型提示，需在 "),l("code",null,"vite-env.d.ts"),e(" 中声明资源模块类型（引入 "),l("code",null,"vite/client"),e(" 即可）。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),e("base64 内联会让体积涨约 33% 且无法独立缓存，大图务必让它走 URL 而不是内联；public 目录里的文件名写错了构建期不会报错，上线才 404，引用时必须写绝对路径且拼写完全一致。 ")],-1)),n[17]||(n[17]=l("h2",null,"三种引用对照",-1)),l("figure",Jl,[n[0]||(n[0]=l("figcaption",null,"切 import / public / inline 三个页签，分别看三种资源处理方式在源码里怎么写、构建后的路径和形式会发生什么变化。",-1)),I(Ol)]),n[18]||(n[18]=l("h2",null,"构建可见性优先",-1)),n[19]||(n[19]=l("p",null,[e(" 静态资源的取舍可以收成一句话："),l("strong",null,"能被构建工具看见的（import）优先，看不见的（public）只留给必须放根路径的少数文件，小到不值得一次请求的（内联）才内联"),e("。哈希命名负责缓存，阈值负责请求数，分工清楚之后，路径 404 和「改图不生效」就都消失了。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「内容哈希」"),e("指 Vite 用文件"),l("strong",null,"内容"),e("算出的短哈希拼进产物文件名（如 "),l("code",null,"logo.2d3a5b1c.png"),e("）。内容不变则哈希不变，内容一变哈希就变，因此可以安全地为产物设置长期强缓存。边界：哈希依赖资源被 "),l("code",null,"import"),e(" 走构建管线，"),l("code",null,"public"),e(" 目录里的文件原样复制、没有哈希，缓存策略要自己管。 ")],-1))]),_:1})}}}),Bl={class:"v07"},Ul={class:"tabs"},Nl=["onClick"],Fl={class:"code-block"},ql=g({__name:"V07PreBundle",setup(a){const t=b("why"),n={why:`// 为什么需要依赖预构建？
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
})`};return(m,r)=>(o(),p("div",Bl,[r[0]||(r[0]=l("p",{class:"intro"},[e("Vite 使用 Esbuild 预构建 "),l("code",null,"node_modules"),e(" 中的依赖，将 CommonJS/大量 ESM 转为单个 ESM 文件。")],-1)),l("div",Ul,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Nl)),64))]),l("pre",Fl,[l("code",null,i(n[t.value]),1)])]))}}),Kl=E(ql,[["__scopeId","data-v-070ba8b0"]]),Xl={class:"lesson-figure"},Wl=g({__name:"V07PreBundleArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你 "),l("code",null,"npm install lodash"),e(" 后写下 "),l("code",null,"import debounce from 'lodash/debounce'"),e("，本地一刷新直接白屏，控制台甩出一句 "),l("code",null,"require is not defined"),e("——浏览器明明支持 ESM，为什么一个正常安装的包会当场崩掉？ ")],-1)),n[2]||(n[2]=l("h2",null,"依赖格式转换",-1)),n[3]||(n[3]=l("p",null,[e(" 浏览器只认 ESM，而 npm 上大量包是用 CommonJS/UMD 写的——它们内部用的是 "),l("code",null,"require"),e(" 和 "),l("code",null,"module.exports"),e("，浏览器不认识。麻烦还不止格式：很多包内部被拆成了成百上千个小模块（比如 "),l("code",null,"lodash-es"),e(" 一个函数一个文件），就算格式没问题，浏览器也得为它们发起成百上千次请求。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 如果退回「把依赖整体打包」的老办法，人要付出的隐藏成本是：每次冷启动都要"),l("strong",null,"重新打包整个依赖图"),e("，项目越大启动越慢；任何一个文件改动都要重新构建，热更新的延迟随依赖规模一起增长。于是问题变成：能不能既保留原生 ESM 的按需加载，又同时避开 CommonJS 和模块碎片这两个坑？ ")],-1)),n[5]||(n[5]=l("h2",null,"启动期依赖转译",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的想法：启动时先把 "),l("code",null,"node_modules"),e(" 里的依赖统一「翻译」一遍，用极快的 esbuild 把 CommonJS/UMD 统统转成 ESM。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"让浏览器有办法加载任何来源的包"),e("，无论它是 CommonJS 还是 UMD，转换之后都能当作标准 ESM 被 "),l("code",null,"import"),e(" 进来。 ")],-1)),n[8]||(n[8]=l("h2",null,"模块碎片化请求",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("只转格式不够："),l("code",null,"lodash-es"),e(" 内部几百个文件转完还是几百个，浏览器仍要发几百次请求，Network 面板像瀑布一样往下排，首屏照样慢。")]),l("li",null,"每次启动都跑一遍，冷启动并没有变快，只是把代价从「打包业务源码」转移到了「处理依赖」。"),l("li",null,[e("动态 "),l("code",null,"import()"),e(" 的路径是运行时拼出来的，静态扫描发现不了，运行时才报 404。")]),l("li",null,"有些包本就是规整 ESM、模块又少，硬走一遍预构建反而多此一举。")],-1)),n[10]||(n[10]=l("h2",null,"合并与缓存复用",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「格式化」。预构建的第一件事确实是格式转换：esbuild 把 CommonJS/UMD 转成浏览器能直接加载的 ESM，"),l("code",null,"require is not defined"),e(" 就此消失。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「合并」。光转格式治不了模块碎片，于是预构建会把一个依赖的"),l("strong",null,"众多内部模块合并成单个文件"),e("——"),l("code",null,"lodash-es"),e(" 的几百个文件被打成一个 "),l("code",null,"lodash-es.js"),e("，浏览器一次请求就拿到全部。这正是「100+ 次请求变成 1 次」背后的机制。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「缓存」。每次都重新合并显然是浪费，于是 Vite 把预构建产物"),l("strong",null,[e("带 hash 缓存在 "),l("code",null,"node_modules/.vite/deps/")]),e("。启动时它算一遍依赖指纹，与缓存里的元数据比对，一致就直接复用，跳过预构建。指纹会覆盖依赖与配置的变化，任一变动即整份失效重算： ")],-1)),n[14]||(n[14]=l("ul",null,[l("li",null,[l("code",null,"package.json"),e(" 里的依赖列表变化。")]),l("li",null,[e("lockfile（"),l("code",null,"package-lock.json"),e(" / "),l("code",null,"yarn.lock"),e(" / "),l("code",null,"pnpm-lock.yaml"),e("）变化。")]),l("li",null,[l("code",null,"vite.config.ts"),e(" 中 "),l("code",null,"optimizeDeps"),e(" 配置变化。")]),l("li",null,[l("code",null,"NODE_ENV"),e(" 变化。")])],-1)),n[15]||(n[15]=l("p",null,[e(" 需要手动放弃缓存时，删掉 "),l("code",null,"node_modules/.vite"),e(" 或启动时加 "),l("code",null,"vite --force"),e(" 即可强制重建。 ")],-1)),n[16]||(n[16]=l("p",null,[e(" 再往下补「谁来预构建」。默认 Vite 会扫描源码里的 import 自动发现依赖，但动态 "),l("code",null,"import()"),e(" 的路径是拼出来的，扫不到——这类依赖要手动加进 "),l("code",null,"optimizeDeps.include"),e(" 强制预构建，否则运行时 404。反向地，本来就是规整 ESM、模块又少的包，可以用 "),l("code",null,"optimizeDeps.exclude"),e(" 排除，省掉一次没必要的预构建。 ")],-1)),n[17]||(n[17]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条边界："),e("预构建只处理"),l("strong",null,"第三方依赖"),e("，业务源码不参与，所以 "),l("code",null,"include"),e(" 里绝不能写 "),l("code",null,"src"),e(" 下的路径；产物是带 hash 的缓存，依赖升级或行为诡异时，先把 "),l("code",null,"node_modules/.vite"),e(" 删掉再重启，能排除一大半「改了没生效」的怪问题。 ")],-1)),n[18]||(n[18]=l("h2",null,"预构建动机与配置",-1)),l("figure",Xl,[n[0]||(n[0]=l("figcaption",null,[e("切 why / config / esbuild 三个页签，看预构建为什么必要、在 "),l("code",null,"optimizeDeps"),e(" 里怎么配置，以及底层的 esbuild 还能做哪些转换。")],-1)),I(Kl)]),n[19]||(n[19]=l("h2",null,"开发期依赖预处理",-1)),n[20]||(n[20]=l("p",null," 依赖预构建是开发服务器为第三方依赖做的一次性「预处理」：用极快的 esbuild 把 CommonJS 转成 ESM、把碎片模块合并成单文件，再把结果按 hash 缓存起来供后续启动复用。它只服务于开发阶段的加载效率，业务源码不参与，生产构建也不走这条路。 ",-1)),n[21]||(n[21]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「依赖预构建」"),e("指首次启动时用 esbuild 把 "),l("code",null,"node_modules"),e(" 中的依赖转成 ESM 并合并成单个文件，产物缓存在 "),l("code",null,"node_modules/.vite"),e("。它既解决了 CommonJS/UMD 无法被浏览器加载的问题，也压掉了海量模块请求。边界："),l("strong",null,"只处理第三方依赖"),e("、不处理业务源码；缓存随依赖与配置的 hash 失效，异常时用 "),l("code",null,"--force"),e(" 或删除缓存强制重建。 ")],-1))]),_:1})}}}),_l={class:"v08"},Gl={class:"tabs"},Yl=["onClick"],Zl={class:"code-block"},Ql=g({__name:"V08Build",setup(a){const t=b("split"),n={split:`// 代码分割（自动）
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
})`};return(m,r)=>(o(),p("div",_l,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 基于 Rollup 构建，支持自动代码分割、懒加载和多种压缩策略。",-1)),l("div",Gl,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Yl)),64))]),l("pre",Zl,[l("code",null,i(n[t.value]),1)])]))}}),hl=E(Ql,[["__scopeId","data-v-436bb5ae"]]),le={class:"lesson-figure"},ee=g({__name:"V08BuildArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你只改了一个页面的文案，重新构建上线；用户刷新后，浏览器却把整个 2MB 的入口包从头下载了一遍——为什么改一个字，要让所有人把整个应用重下？ ")],-1)),n[2]||(n[2]=l("h2",null,"开发生产差异",-1)),n[3]||(n[3]=l("p",null,[e(" 开发阶段 Vite 按模块加载源码，生产阶段要切换成 Rollup，把源码打包成少量静态文件。可一旦打包，所有代码就被塞进了少数几个 bundle，于是两个后果同时出现："),l("strong",null,"任意一处改动都会改变整个 bundle 的内容哈希，用户手里的缓存全部失效"),e("；"),l("strong",null,"首屏必须下载整个 bundle"),e("，哪怕其中大部分页面和组件当前根本用不到。 ")],-1)),n[4]||(n[4]=l("p",null," 退回「全部打进一个 bundle」的老办法，人要付出的隐藏成本是：首屏体积随功能线性膨胀；一次小改动就让全局缓存作废；低频页面也没法延迟到真正访问时再加载。于是问题很清楚：怎么让「改动的部分」和「没改动的部分」，在产物层面对应成不同的文件？ ",-1)),n[5]||(n[5]=l("h2",null,"单包默认行为",-1)),n[6]||(n[6]=l("p",null," 最直接的做法：交给 Rollup 的默认行为，把入口打包成一个 bundle 就行。 ",-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把散落的源码模块收敛成少数静态文件"),e("，浏览器不再为每个源码文件各发一次请求，加载变得可控。 ")],-1)),n[8]||(n[8]=l("h2",null,"整包缓存粒度",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,"单一大 bundle：首屏必须把它整包下完才能渲染，里面却混着大量当前页面用不到的代码。"),l("li",null,"缓存粒度是整包：改一行文案，bundle 的内容哈希就变，用户缓存全部作废。"),l("li",null,[e("依赖与业务代码混在一起：升级一次业务逻辑，连没变的 "),l("code",null,"vue"),e("、UI 库也要跟着重下。")]),l("li",null,"无法按需加载：像「关于我们」这类低频页面，没必要在首页就下载。")],-1)),n[10]||(n[10]=l("h2",null,"动态导入分割",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「按需加载」。代码分割的入口是动态 "),l("code",null,"import()"),e("：把路由组件改成 "),l("code",null,"() => import('./views/Home.vue')"),e("，Rollup 就会为每个动态 import 生成一个独立 chunk，首屏只加载首屏需要的部分，其余页面等用户真正进入时再下。这是所有分割的前提——"),l("strong",null,[e("缺少动态 "),l("code",null,"import()"),e("，Rollup 只能产出单一大 chunk")]),e("。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「分包策略」。动态 import 按页面切了，可多个页面往往都要用 "),l("code",null,"vue"),e("、UI 库这些公共依赖，若每个页面各自带一份就重复了。于是用 "),l("code",null,"rollupOptions.output.manualChunks"),e(" 把依赖按组拆开，例如把 "),l("code",null,"vue"),e(" 生态归入 "),l("code",null,"vue-vendor"),e("、UI 库单列、工具库归入 "),l("code",null,"utils"),e("。分完之后，"),l("code",null,"vue-vendor"),e(" 只有在框架真正升级、内容变化时哈希才变；平时改业务代码，用户浏览器里这份大依赖的缓存纹丝不动。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「压缩」。分割决定「下多少个文件」，压缩决定「每个文件传多小」。默认 "),l("code",null,"minify: 'esbuild'"),e("，胜在快；想要更高压缩率、还想顺手删掉 "),l("code",null,"console"),e("，就切到 "),l("code",null,"minify: 'terser'"),e(" 并配 "),l("code",null,"terserOptions.compress.drop_console"),e("。这是速度与体积的权衡：esbuild 快而够用，terser 慢一点但更小。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 最后定「阈值与目标」。"),l("code",null,"chunkSizeWarningLimit"),e("（默认 500kb）只控制构建时的体积警告，"),l("strong",null,"并不改变分包行为"),e("，看到某个 chunk 超过阈值不等于它必须被拆——但要去查是哪个依赖把它撑起来的。"),l("code",null,"build.target"),e(" 决定语法降级的目标，面向现代浏览器时可以适当提高，少做降级，产物更小。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"两点提醒："),e("分包不是越细越好，拆得过散会让请求数暴涨，建议按「变更频率」归组（框架 / UI 库 / 工具库分开即可，不必每个包一个 chunk）；"),l("code",null,"chunkSizeWarningLimit"),e(" 只影响警告，不改实际产物，别把它当成分包开关。 ")],-1)),n[16]||(n[16]=l("h2",null,"分包与压缩取舍",-1)),l("figure",le,[n[0]||(n[0]=l("figcaption",null,"切 split / lazy / minify 三个页签，分别看手动分包怎么写、路由懒加载怎么配，以及 esbuild 与 terser 两种压缩方式怎么取舍。",-1)),I(hl)]),n[17]||(n[17]=l("h2",null,"按变更频率分块",-1)),n[18]||(n[18]=l("p",null,[e(" 生产构建优化串起来是一条线：用动态 "),l("code",null,"import()"),e(" 让页面按需加载，用 "),l("code",null,"manualChunks"),e(" 把稳定的大依赖单独成块以便长期缓存，用 "),l("code",null,"minify"),e(" 决定每个文件的最终大小。核心判断只有一个——"),l("strong",null,"设法让「会变的东西」和「不变的东西」输出成不同的文件"),e("。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「代码分割」"),e("指把打包产物切成多个 chunk，让浏览器按需加载而不是一次性下载整个应用。触发方式是动态 "),l("code",null,"import()"),e("，"),l("code",null,"manualChunks"),e(" 决定依赖如何归组。边界：每个动态 import 都会新增一次网络请求，"),l("strong",null,"分割不是越多越好"),e("；缓存收益的关键在于按「变更频率」归组，而不是把包拆到最细。 ")],-1))]),_:1})}}}),ne={class:"v09"},te={class:"tabs"},se=["onClick"],oe={class:"code-block"},ue=g({__name:"V09MPA",setup(a){const t=b("config"),n={config:`// vite.config.ts - 多页面应用配置
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})

// 每个 HTML 文件都是独立的入口
// 共享的依赖会被提取为 common chunk`,structure:`my-mpa-app/
├── index.html        # 首页入口
├── about.html       # 关于页入口
├── contact.html     # 联系页入口
├── src/
│   ├── main.ts     # 首页 JS
│   ├── about.ts    # 关于页 JS
│   └── shared/     # 共享代码
└── vite.config.ts

// 每个 HTML 文件直接使用
// &lt;script type="module" src="/src/main.ts"&gt;&lt;/script&gt;`,compare:`// MPA vs SPA
// MPA：每个页面独立 HTML，适合 SEO 要求高的场景
// SPA：单 HTML + 前端路由，适合 Web App

// Vite 同时支持两种模式
// MPA：配置多个入口
// SPA：默认行为，一个 index.html`},m=P(()=>n[t.value]||""),r=c=>{(c==="config"||c==="structure"||c==="compare")&&(t.value=c)};return(c,d)=>(o(),p("div",ne,[d[0]||(d[0]=l("p",{class:"hint"},"Vite 支持多页面应用（MPA），每个 HTML 文件都是独立入口，共享依赖自动提取。",-1)),l("div",te,[(o(),p(C,null,x(n,(y,k)=>l("button",{key:k,class:v({active:t.value===k}),onClick:A=>r(k)},i(k),11,se)),64))]),l("pre",oe,[l("code",null,i(m.value),1)])]))}}),ie=E(ue,[["__scopeId","data-v-0337abe2"]]),de={class:"lesson-figure"},re=g({__name:"V09MPAArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你把官网和后台做进同一个 SPA，用前端路由分了 "),l("code",null,"/home"),e(" 和 "),l("code",null,"/admin"),e("。结果访客打开官网首页，浏览器却把整个后台——连同它依赖的表格组件和图表库——一起下载了下来，只因为它们住在同一个 "),l("code",null,"index.html"),e(" 里。 ")],-1)),n[2]||(n[2]=l("h2",null,"独立页面与SPA",-1)),n[3]||(n[3]=l("p",null,[e(" 有些场景天然就是「几个彼此独立的页面」：官网、管理后台、登录页，结构不同、SEO 要求不同，甚至由不同团队分开维护、分开发布。而 SPA 只有一个 "),l("code",null,"index.html"),e("，所有页面都靠前端路由在里面切换。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 把这几个页面硬塞进同一个 SPA，人要付出的隐藏成本是：所有页面的代码被打进同一份产物，访客被迫下载用不到的部分；想单独发布后台，就得连官网一起重新构建；需要被搜索引擎抓取的页面，也拿不到独立、可直接渲染的 HTML。于是问题落在一句话上："),l("strong",null,"怎么让每个页面拥有自己的 HTML 入口和产物，同时又不必重复打包公共依赖？")],-1)),n[5]||(n[5]=l("h2",null,"HTML多入口声明",-1)),n[6]||(n[6]=l("p",null," 最直接的想法：每个页面放一个独立的 HTML 文件，各自引各自的 JS。 ",-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"页面之间在产物层面被彻底隔离"),e("，官网的访客不会为后台的代码买单，两个页面也能各自构建、各自发布。 ")],-1)),n[8]||(n[8]=l("h2",null,"手工维护风险",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,"手工维护多个 HTML 容易漏：新增页面要记得加文件、加引用、加构建配置，任何一处漏了都构建不出来或线上 404。"),l("li",null,[e("公共依赖被重复打包：每个页面各引一次 "),l("code",null,"vue"),e("，若不处理，"),l("code",null,"vue"),e(" 会被复制进每个页面的产物，总下载量反而变大。")]),l("li",null,"dev 与 build 的行为要对得上：本地能访问的页面，构建产物里不一定存在（或反过来）。"),l("li",null,"资源引用若都用绝对路径，部署到子目录时整站 404。")],-1)),n[10]||(n[10]=l("h2",null,"多入口键值声明",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「把入口声明出来」。Vite 用 "),l("code",null,"build.rollupOptions.input"),e(" 接管这件事，以键值对列出每个 HTML 入口，例如 "),l("code",null,"main"),e(" 指向 "),l("code",null,"index.html"),e("、"),l("code",null,"admin"),e(" 指向 "),l("code",null,"admin/index.html"),e("、"),l("code",null,"login"),e(" 指向 "),l("code",null,"login/index.html"),e("。Rollup 会为每个入口分别产出 HTML 与对应的入口 JS，不再需要人手动拼构建命令。每个 HTML 用 "),l("code",null,'<script type="module" src="/src/admin/main.ts"><\/script>'),e(" 引自己的入口脚本，路径要与 input 的键名对得上。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「共享依赖」。多个入口都要用 "),l("code",null,"vue"),e("、公共组件怎么办？Vite 会"),l("strong",null,"把跨页面共享的依赖自动提取成一个 common chunk"),e("，各页面复用它，不会在每个页面里各打一份。这样「页面隔离」和「依赖复用」就同时成立了。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「项目结构约定」。按「页面」来组织目录，每个页面一个「HTML + 入口脚本 + 组件」的组合，公共代码抽进 "),l("code",null,"shared"),e("： ")],-1)),n[14]||(n[14]=l("ol",{class:"lesson-steps"},[l("li",null,[e("每个页面的 HTML 放在自己的目录下（如 "),l("code",null,"admin/index.html"),e("）。")]),l("li",null,[e("每个页面对应一个入口脚本（如 "),l("code",null,"src/admin/main.ts"),e("）。")]),l("li",null,[e("跨页面共用的代码集中放进 "),l("code",null,"src/shared"),e("。")]),l("li",null,[e("在 "),l("code",null,"vite.config.ts"),e(" 的 "),l("code",null,"input"),e(" 里把这几个 HTML 一一登记。")])],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「开发与部署的路径细节」。开发服务器下访问子页面要带尾部斜杠（"),l("code",null,"/admin/"),e("）才会命中它的 "),l("code",null,"index.html"),e("，因为 "),l("code",null,"/admin"),e(" 会被当成一个路径而不是目录；部署到子目录时，用 "),l("code",null,"base"),e(" 统一调整各页面的资源路径，避免绝对路径 404。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),e("dev 下访问子页面必须带尾部斜杠 "),l("code",null,"/admin/"),e("，否则命中不到对应的 "),l("code",null,"index.html"),e("；部署到子目录时记得配 "),l("code",null,"base"),e("，否则所有页面的绝对路径资源会集体 404。 ")],-1)),n[17]||(n[17]=l("h2",null,"MPA与SPA对照",-1)),l("figure",de,[n[0]||(n[0]=l("figcaption",null,"切 config / structure / compare 三个页签，看多入口怎么声明、目录该怎么组织，以及 MPA 与 SPA 各自适合什么场景。",-1)),I(ie)]),n[18]||(n[18]=l("h2",null,"入口隔离与共用",-1)),n[19]||(n[19]=l("p",null,[e(" MPA 的本质，是让每个页面拥有自己的 HTML 入口和产物：用 "),l("code",null,"rollupOptions.input"),e(" 声明多个入口，Vite 为每个入口独立产出 HTML 与 JS，再把公共依赖自动提成一个共享 chunk。页面之间隔离、公共依赖复用，两件事同时成立。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「多页面应用（MPA）」"),e("指构建时声明多个 HTML 入口，每个页面各自产出独立的 HTML 与入口 JS，跨页面共享的依赖被提取为 common chunk 而非重复打包。边界：MPA 的页面切换是"),l("strong",null,"整页跳转"),e("，不做前端路由；它换来产物隔离、可按页发布和更好的 SEO，代价是页面之间不再有 SPA 那种无刷新切换的体验。 ")],-1))]),_:1})}}}),pe={class:"v10"},ae={class:"tabs"},me=["onClick"],ce={class:"code-block"},ve=g({__name:"V10Lib",setup(a){const t=b("config"),n={config:`// vite.config.ts - 库模式配置
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

// 使用者：npm install my-lib`};return(m,r)=>(o(),p("div",pe,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 库模式可同时输出 ESM、UMD、CJS 格式，适合开发可复用的 npm 包。",-1)),l("div",ae,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,me)),64))]),l("pre",ce,[l("code",null,i(n[t.value]),1)])]))}}),ge=E(ve,[["__scopeId","data-v-9c2c9ccf"]]),fe={class:"lesson-figure"},be=g({__name:"V10LibArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你发布了一个 Vue 组件库。同事装进项目后，组件能显示但交互全乱——点按钮没反应。排查半天才发现：页面上同时加载了"),l("strong",null,"两份 Vue"),e("，一份是他的应用自带的，一份是你的库打包进去的。 ")],-1)),n[2]||(n[2]=l("h2",null,"消费环境未知",-1)),n[3]||(n[3]=l("p",null,[e(" 你要写一个「给别人用」的库，而别人的环境是未知的：有人用 Vite/webpack 按 ESM 引入，有人直接在 HTML 里挂 CDN 的 "),l("code",null,"<script>"),e("，还有人在 Node 里 "),l("code",null,"require"),e("。同时，一个 Vue 组件库有个绝不能踩的雷——"),l("strong",null,"Vue 不能被你自己打进库里"),e("，否则使用方的应用和你的库各带一份 Vue，两套响应式系统互不认识，交互就会像开头那样全部错乱。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 若照搬打包应用的方式去构建库，人要付出的隐藏成本是：产物格式单一，只有一种引用方式能用；框架依赖被整份打进去，制造多实例；类型声明与包入口字段要人手工对齐，漏一个使用者就报错。于是问题变成："),l("strong",null,"怎么一次构建同时产出多种模块格式，并把框架依赖留给使用方提供？")],-1)),n[5]||(n[5]=l("h2",null,"应用式产物局限",-1)),n[6]||(n[6]=l("p",null," 最直接的想法：像打包应用一样构建，产出一个 bundle 发出去。 ",-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"库的代码确实被收敛成了可发布的文件"),e("，能装进任意项目里被引用。 ")],-1)),n[8]||(n[8]=l("h2",null,"产物格式单一",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("格式单一：产物若是 CJS，CDN 的 "),l("code",null,"<script>"),e(" 用不了；若是 UMD，Node 的 "),l("code",null,"require"),e(" 又要绕。使用者被格式绑死。")]),l("li",null,[e("框架重复："),l("code",null,"vue"),e(" 被打进库产物，使用方自己也有一份，页面上出现两个 Vue 实例，响应式与插件注册全部错乱。")]),l("li",null,[e("UMD 全局名没映射：库内部 "),l("code",null,"import 'vue'"),e("，打到 UMD 里得去全局找一个叫 "),l("code",null,"Vue"),e(" 的变量，不告诉它名字就报 "),l("code",null,"Vue is not defined"),e("。")]),l("li",null,[e("类型与入口对不上：有产物却没有 "),l("code",null,".d.ts"),e("，或 "),l("code",null,"package.json"),e(" 的入口字段指向不存在的文件，使用者一装就红。")])],-1)),n[10]||(n[10]=l("h2",null,"多格式并行输出",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「一次输出多种格式」。Vite 的 "),l("code",null,"build.lib"),e(" 让你一次构建产出多种模块格式，用 "),l("code",null,"formats"),e(" 列出 "),l("code",null,"['es', 'cjs', 'umd']"),e("，用 "),l("code",null,"fileName"),e(" 按格式生成文件名。三种格式各有归属："),l("strong",null,"ESM"),e(" 给现代打包器按需引入，"),l("strong",null,"UMD"),e(" 给 CDN 的 "),l("code",null,"<script>"),e(" 直接用，"),l("strong",null,"CJS"),e(" 给 Node 的 "),l("code",null,"require"),e("。一份源码，三种消费方式。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「把框架外部化」。要解决多实例，就得告诉 Rollup："),l("code",null,"vue"),e(" 不要打进来，交给使用方提供。这就是 "),l("code",null,"rollupOptions.external"),e("，把 "),l("code",null,"vue"),e(" 填进去它就不再进入产物；UMD 场景下还要配 "),l("code",null,"output.globals"),e("，把库里的模块名 "),l("code",null,"vue"),e(" 映射成全局变量 "),l("code",null,"Vue"),e("，否则 CDN 引用时会报 "),l("code",null,"Vue is not defined"),e("。映射关系就是「模块名 → 全局变量名」。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「告诉使用方这是依赖，而不是塞给他」。产物的入口字段要写清楚，让构建工具知道去哪找不同格式，并声明框架由使用方提供：用 "),l("code",null,"package.json"),e(" 的 "),l("code",null,"module"),e(" 指向 ESM 产物、"),l("code",null,"main"),e(" 指向 CJS/UMD，用 "),l("code",null,"exports"),e(" 的条件映射分别对应 "),l("code",null,"import"),e(" / "),l("code",null,"require"),e(" / "),l("code",null,"types"),e("；再用 "),l("code",null,"peerDependencies"),e(" 声明 "),l("code",null,"vue"),e("，从声明层面杜绝多实例。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 最后补「类型声明与 CSS」。类型声明 Rollup 不会自动生成，要用 "),l("code",null,"vite-plugin-dts"),e(" 生成 "),l("code",null,".d.ts"),e("，并保证 "),l("code",null,"exports"),e(" 的 "),l("code",null,"types"),e(" 指向它；而库里的 CSS 会被单独产出一个文件，需要使用者手动引入，例如 "),l("code",null,"import 'my-lib/dist/style.css'"),e("——这一条一定要写进文档，否则使用者会看到一堆没有样式的组件。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条必守的线："),e("框架依赖要用 "),l("code",null,"external"),e(" 加 "),l("code",null,"peerDependencies"),e(" 双保险，绝不能打进产物，否则使用方页面会出现两份 Vue；库的 CSS 不会随 JS 自动生效，必须由使用方手动引入，务必写进文档。 ")],-1)),n[16]||(n[16]=l("h2",null,"发布字段与格式",-1)),l("figure",fe,[n[0]||(n[0]=l("figcaption",null,[e("切 config / output / publish 三个页签，看 "),l("code",null,"lib"),e(" 配置怎么写、会产出哪几种格式，以及发布到 npm 需要哪些 "),l("code",null,"package.json"),e(" 字段。")],-1)),I(ge)]),n[17]||(n[17]=l("h2",null,"外部化依赖处理",-1)),n[18]||(n[18]=l("p",null,[e(" 库模式做的事，是让一份源码适配所有消费环境：用 "),l("code",null,"build.lib"),e(" 一次输出 ESM / UMD / CJS 三种格式，用 "),l("code",null,"external"),e(" 加 "),l("code",null,"globals"),e(" 把框架依赖让给使用方，用 "),l("code",null,"package.json"),e(" 的入口字段与 "),l("code",null,"peerDependencies"),e(" 把「从哪引、谁提供依赖」交代清楚。库不是应用，它的产物要服务于你见不到的使用者。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「外部化（external）」"),e("指打包时把某个依赖排除出产物、交由使用方提供；UMD 场景再配合 "),l("code",null,"output.globals"),e(" 把模块名映射为全局变量，避免同一依赖被打包多份。边界："),l("code",null,"external"),e(" 只保证「不打包」，"),l("strong",null,"并不保证运行时能找到"),e("——使用方必须自行安装并正确引入；框架类依赖还应同时在 "),l("code",null,"peerDependencies"),e(" 里声明。 ")],-1))]),_:1})}}}),ye={class:"v11"},Se={class:"tabs"},Ve=["onClick"],Ce={class:"code-block"},xe=g({__name:"V11SSR",setup(a){const t=b("concept"),n={concept:`// Vite SSR 工作原理
// 1. 服务端渲染：在服务器上运行 Vue 组件，生成 HTML
// 2. 客户端激活（Hydration）：在浏览器中接管静态 HTML

// 优势
// - SEO 友好（搜索引擎可抓取完整 HTML）
// - 首屏速度快（无需等待 JS 下载执行）
// - 低端设备体验更好`,setup:`// vite.config.ts
export default defineConfig({
  ssr: {
    // SSR 外部化依赖（不打包到服务端 bundle）
    external: ['vue', 'vue-router'],
  },
})

// server.ts - 简易 SSR 服务器
import { createServer } from 'vite'
import { renderToString } from 'vue/server-renderer'

const vite = await createServer({ ssr: true })
const html = await vite.transformIndexHtml(url, template)
const app = createSSRApp(App)
const rendered = await renderToString(app)`,nuxt:`// Nuxt 3 基于 Vite + Vue 3 的 SSR 框架
// 零配置 SSR、自动路由、文件系统路由

// Nuxt 内置了：
// - Vite 作为构建工具
// - Vue 3 SSR
// - 自动代码分割
// - 静态站点生成（SSG）

// 本仓库就是使用 Nuxt 4 + Vite 构建的！`};return(m,r)=>(o(),p("div",ye,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 原生支持 SSR，Nuxt 3/4 就是基于 Vite + Vue 3 SSR 构建的。",-1)),l("div",Se,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Ve)),64))]),l("pre",Ce,[l("code",null,i(n[t.value]),1)])]))}}),ke=E(xe,[["__scopeId","data-v-96083b83"]]),Me={class:"lesson-figure"},$e=g({__name:"V11SSRArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你给商城首页做足了 SEO，可在搜索引擎的抓取结果里，页面正文是空的；右键「查看网页源代码」，只看到一行 "),l("code",null,'<div id="app"></div>'),e("——内容明明在浏览器里显示得好好的，为什么源码里什么都没有？ ")],-1)),n[2]||(n[2]=l("h2",null,"客户端渲染空壳",-1)),n[3]||(n[3]=l("p",null,[e(" 页面之所以能看见，是因为浏览器先下载到一段几乎空白的 HTML，再下载 JavaScript，由 Vue 在浏览器里把组件渲染成真实 DOM 挂上去。也就是说，"),l("strong",null,"用户看到的「页面」，是 JS 跑完之后才存在的"),e("。这一路上有两个代价：搜索引擎爬虫拿到的初始 HTML 里没有正文，收录不到内容；弱网或低端设备上，JS 下载与执行完成之前，用户面对的是一段白屏。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 让「内容在 JS 到达之前就存在」，本质上是问：能不能让第一份 HTML 里就带着渲染好的结果？旧办法要人承担的隐藏成本有三个：把内容写成静态模板，就丧失了组件化与数据驱动；改由后端拼字符串，又等于把 Vue 的逻辑重写一遍；什么都不做，就是把首屏和 SEO 交了出去。于是问题落到一句："),l("strong",null,"能不能在服务端把 Vue 组件渲染成 HTML，再让浏览器接管？")],-1)),n[5]||(n[5]=l("h2",null,"服务端直出HTML",-1)),n[6]||(n[6]=l("p",null,[e(" 最朴素的做法：在服务端调用 "),l("code",null,"renderToString()"),e("，把组件渲染成一段完整的 HTML 字符串，直接返回给浏览器。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"第一份 HTML 里就带着真实内容"),e("。爬虫能读到正文，用户也能在 JS 到达之前先看到页面，白屏时间被大幅压缩。但此时这份 HTML 是「死」的——它只是字面文本，没有任何交互能力。 ")],-1)),n[8]||(n[8]=l("h2",null,"静态标记无交互",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,"服务端吐出的 HTML 上点按钮毫无反应——事件监听根本没绑上去，它只是一段静态文本。"),l("li",null,[e("服务端没有 "),l("code",null,"window"),e("、"),l("code",null,"document"),e("，组件里若在渲染期就访问浏览器 API，服务端直接抛错。")]),l("li",null,[l("code",null,"onMounted"),e(" 在服务端不会执行，把首屏数据请求写在这里，服务端渲染出来仍是空数据。")]),l("li",null,"服务端与客户端如果渲染出了不一样的结果，浏览器接管时会报 Hydration 不匹配警告，甚至回退成整段重渲染。")],-1)),n[10]||(n[10]=l("h2",null,"激活与接管流程",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「让死 HTML 活过来」。客户端不能再 "),l("code",null,"createApp"),e(" 从零渲染，而要改用 "),l("code",null,"createSSRApp"),e("：它会复用服务端已经生成的那份 HTML，把事件监听与响应式重新挂上去——这一步叫 "),l("strong",null,"Hydration（激活）"),e("。渲染用的还是同一套组件代码，服务端负责「画出来」，客户端负责「连上线」。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 再补「开发期怎么在同一进程里转换服务端代码」。如果服务端也走一遍完整构建，改一行就要等构建，开发体验直接崩。Vite 的解法是"),l("strong",null,"中间件模式"),e("：用 "),l("code",null,"createServer({ server: { middlewareMode: true } })"),e(" 启动开发服务器，把它挂到 Express 这类 Node 服务上。这样请求进来时，可以直接调用 "),l("code",null,"ssrLoadModule('/src/entry-server.ts')"),e("，让 Vite 就地把源码转好再用，不必预先打包。 ")],-1)),n[13]||(n[13]=l("ol",{class:"lesson-steps"},[l("li",null,[e("服务端读取 HTML 模板，经 "),l("code",null,"transformIndexHtml"),e(" 处理，得到带占位符的页面骨架。")]),l("li",null,[e("用 "),l("code",null,"ssrLoadModule"),e(" 加载服务端入口，调用其中的渲染函数，得到组件渲染出的 HTML。")]),l("li",null,"把组件 HTML 替换进模板的占位符，返回完整页面给浏览器。"),l("li",null,[e("浏览器下载客户端脚本，由客户端入口 "),l("code",null,"createSSRApp"),e(" 后 "),l("code",null,"mount"),e("，完成 Hydration。")])],-1)),n[14]||(n[14]=l("p",null,[e(" 接着补「依赖怎么处理」。服务端代码跑在 Node 里，有些依赖不能被建进 SSR 产物，有些又必须被建进去，于是 "),l("code",null,"ssr.external"),e(" 与 "),l("code",null,"ssr.noExternal"),e(" 各管一头：前者让依赖保持外部引用、运行时从 "),l("code",null,"node_modules"),e(" 加载，后者强制把依赖打进服务端产物——只发 ESM、或需要被转换的库往往必须这样做。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后是「产出与部署」。SSR 应用有两份产物：一份给服务端（渲染用），一份给客户端（Hydration 用），要"),l("strong",null,"分别构建后一起部署"),e("到一个能跑 Node 的服务器上。这也正是它与纯静态站最大的区别——目标环境必须有 Node。顺带一提，本仓库（小松鼠举栗子）本身就是 Nuxt 4 + Vite 的 SSR 应用，Nuxt 就是把上面这一整套流程封装成了开箱即用。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条最容易踩的线："),e("依赖浏览器 API 的代码要放进 "),l("code",null,"onMounted"),e(" 或 "),l("code",null,"<ClientOnly>"),e(" 里，避免服务端执行时找不到 "),l("code",null,"window"),e("；首屏数据的请求要写在支持 SSR 的加载函数中，因为 "),l("code",null,"onMounted"),e(" 在服务端根本不会执行，写在那里等于服务端渲染的是空数据。 ")],-1)),n[17]||(n[17]=l("h2",null,"最小SSR服务器",-1)),l("figure",Me,[n[0]||(n[0]=l("figcaption",null,"切 concept / setup / nuxt 三个页签：先看清服务端渲染加客户端激活的原理与收益，再看一个最小 SSR 服务器怎么搭，最后了解 Nuxt 如何把这一整套封装成开箱即用。",-1)),I(ke)]),n[18]||(n[18]=l("h2",null,"同构渲染两端",-1)),n[19]||(n[19]=l("p",null,[e(" 服务端渲染拆开就是两步："),l("strong",null,[e("服务端用 "),l("code",null,"renderToString"),e(" 把组件画成 HTML，客户端用 "),l("code",null,"createSSRApp"),e(" 把这份 HTML 接管成活的应用")]),e("。前者换来首屏与 SEO，后者换来交互。它不是一个新框架，而是「同一套组件、两个渲染环境」这个约束下的必然产物——也正因为有两个环境，服务端与客户端首次渲染必须一致，浏览器 API 与首屏数据都要放在对的位置。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「Hydration（激活）」"),e("指客户端拿到服务端渲染出的静态 HTML 后，不从头渲染，而是复用这份已有的 DOM 结构，把事件监听与响应式状态重新挂上去，使其变成可交互的应用。它的前提是"),l("strong",null,"服务端与客户端首次渲染结果完全一致"),e("，哪怕多一个空格都会触发不匹配警告；边界：Hydration 只接管、不重建，所以依赖随机数、时间戳、浏览器 API 的差异渲染，是它最常见的失败来源。 ")],-1))]),_:1})}}}),Te={class:"v12"},Ee={class:"tabs"},Re=["onClick"],Le={class:"code-block"},Ie=g({__name:"V12CSS",setup(a){const t=b("postcss"),n={postcss:`// vite.config.ts
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
})

// 或使用 postcss.config.js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,preprocessor:`// Vite 内置支持 Sass、Less、Stylus
// 安装对应预处理器即可
// npm install -D sass

// 在 Vue SFC 中使用
<style lang="scss">
$primary: #1890ff;
.btn { color: $primary; }
</style>

// 全局注入（vite.config.ts）
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: \`@use "@/styles/variables" as *;\`,
      },
    },
  },
})`,modules:`// CSS Modules（Vue SFC 默认启用）
<style module>
.red { color: red; }
</style>

<template>
  <div :class="$style.red">红色文字</div>
</template>

// 自定义模块名
<style module="classes">
.red { color: red; }
</style>
<template>
  <div :class="classes.red">红色文字</div>
</template>`};return(m,r)=>(o(),p("div",Te,[r[0]||(r[0]=l("p",{class:"intro"},"Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。",-1)),l("div",Ee,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Re)),64))]),l("pre",Le,[l("code",null,i(n[t.value]),1)])]))}}),we=E(Ie,[["__scopeId","data-v-e0e56851"]]),De={class:"lesson-figure"},He=g({__name:"V12CSSArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你只在登录按钮的样式里写了 "),l("code",null,".btn { border-radius: 8px }"),e("，本意是只改那一个按钮；结果整个站点里所有用 "),l("code",null,".btn"),e(" 的按钮全变了圆角——你改的是「一个组件」，却动了「一份全局规则」。 ")],-1)),n[2]||(n[2]=l("h2",null,"变量嵌套与作用域",-1)),n[3]||(n[3]=l("p",null,[e(" 样式里有三种反复出现的诉求："),l("strong",null,"把品牌色、间距收进变量"),e("，改一处生效全局；"),l("strong",null,"用嵌套写清层级"),e("，不再手写一长串选择器；"),l("strong",null,"让组件之间互不污染"),e("，一个按钮的改动不牵连别人。可惜浏览器早年对这三种诉求都不给支持——CSS 里没有变量也没有嵌套，而「隔离」只能靠人肉约定命名前缀。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 于是需要引入一条"),l("strong",null,"「样式编译管线」"),e("：源码里写「给人看的样式」，经过一串转换，输出「浏览器认识、兼容各版本、类名已隔离」的 CSS。旧办法要人承担的成本很明确：每个兼容前缀都得手写一遍；变量要在每个文件里手动 import；类名全靠自觉，谁写错了前缀谁就制造全局污染。 ")],-1)),n[5]||(n[5]=l("h2",null,"PostCSS处理链",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的入口是 "),l("strong",null,"PostCSS"),e("：它本身不处理任何语法，只负责「把 CSS 喂给一串插件、再把插件处理过的 CSS 吐出来」。Vite 会自动读取项目根目录的 "),l("code",null,"postcss.config.js"),e("（或 "),l("code",null,"vite.config.ts"),e(" 里的 "),l("code",null,"css.postcss"),e("），把里面的插件链应用到"),l("strong",null,"所有"),e("样式上。例如挂上 "),l("code",null,"autoprefixer"),e("，它会按目标浏览器自动补齐 "),l("code",null,"-webkit-"),e("、"),l("code",null,"-moz-"),e(" 前缀。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把「写给人看的 CSS」和「发给浏览器的 CSS」拆成了两步"),e("。你只管写，兼容与生成交给插件链。 ")],-1)),n[8]||(n[8]=l("h2",null,"预处理器语法转换",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("PostCSS 只认识 CSS。你在样式里写 "),l("code",null,"$brand"),e("，或者写 "),l("code",null,"&:hover"),e(" 这种嵌套语法，它既不认识，浏览器也不认识。")]),l("li",null,[e("变量想在组件之间共享，仍只能每个样式文件手动 import 一次，漏一个就报 "),l("code",null,"$brand is undefined"),e("。")]),l("li",null,[e("类名依旧全局：登录页的 "),l("code",null,".btn"),e(" 和后台的 "),l("code",null,".btn"),e(" 会互相覆盖，正是开场那场「改一个按钮，全站变圆角」。")]),l("li",null,[e("若把实际样式（而不是变量）塞进 "),l("code",null,"additionalData"),e("，它会被重复注入到每一个样式文件，产物里同一段规则出现几十遍。")])],-1)),n[10]||(n[10]=l("h2",null,"全局变量共享",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「预处理器」。装一个 "),l("code",null,"sass"),e("，就能直接在 "),l("code",null,'<style lang="scss">'),e(" 里写变量与嵌套，Vite 会自动把它编译成 CSS 再交给 PostCSS。注意这是一条"),l("strong",null,"两级管线"),e("：预处理器在前（Sass/Less 编译成 CSS），PostCSS 在后（普通 CSS 变成兼容 CSS）。也正因为 Vite 不内置编译器，预处理器必须自己安装，没装 "),l("code",null,"sass"),e(" 时写 "),l("code",null,'<style lang="scss">'),e(" 会直接报错。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 再补「全局变量注入」。用 "),l("code",null,"css.preprocessorOptions.scss.additionalData"),e(" 在每个样式文件"),l("strong",null,"开头自动插入"),e("一行 "),l("code",null,'@use "@/styles/variables" as *;'),e("，这样任何组件都能直接用 "),l("code",null,"$brand"),e("，不必逐个 import。 ")],-1)),n[13]||(n[13]=l("div",{class:"lesson-box warn"},[l("strong",null,"一条硬边界："),l("code",null,"additionalData"),e(" 只该放"),l("strong",null,"变量与 mixin 定义"),e("。放实际样式会被重复输出到每个文件，产物凭空膨胀；要注入的是「定义」，不是「规则」。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 接着补「隔离」。组件级隔离其实 Vite 早就给了："),l("code",null,"<style scoped>"),e(" 会为选择器附加唯一属性，天然把样式框在当前组件内，"),l("strong",null,"普通项目用它就够了，不必上 CSS Modules"),e("。只有当你要把类名当数据传给 JS、或需要更明确的局部命名时，才用 "),l("code",null,"<style module>"),e("：样式在 "),l("code",null,':class="$style.xxx"'),e(" 里引用，Vite 会生成 "),l("code",null,"[name]__[local]___[hash]"),e(" 形式的局部类名，全局绝不会撞车。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「可调试」。开发阶段打开 "),l("code",null,"css.devSourcemap"),e("，浏览器 DevTools 里看到的样式就能直接定位回源码文件，而不是编译后的中间产物。另外，Tailwind 这类工具链"),l("strong",null,"走 PostCSS 接入即可"),e("，不需要再额外安装专门的 Vite 插件。 ")],-1)),n[16]||(n[16]=l("h2",null,"隔离方式对比",-1)),l("figure",De,[n[0]||(n[0]=l("figcaption",null,"切 postcss / preprocessor / modules 三个页签：先看 PostCSS 插件链怎么写，再看 Sass 变量如何全局注入，最后看 CSS Modules 的类名是怎么被隔离的。",-1)),I(we)]),n[17]||(n[17]=l("h2",null,"样式编译管线",-1)),n[18]||(n[18]=l("p",null,[e(" 样式这件事，Vite 给的是"),l("strong",null,"一条可插拔的编译管线"),e("：预处理器把 Sass/Less 变成 CSS，PostCSS 插件链再把 CSS 变成兼容可用的 CSS，而隔离则由 "),l("code",null,"scoped"),e(" 或 "),l("code",null,"module"),e(" 承担。你要做的判断很简单——"),l("strong",null,"变量与嵌套交给人写，兼容与隔离交给管线"),e("，别把实际样式塞进注入配置里。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「PostCSS」"),e("是一个用 JavaScript 插件转换 CSS 的工具：它本身不做任何事，能力全部来自插件链（"),l("code",null,"autoprefixer"),e(" 补齐前缀、"),l("code",null,"tailwindcss"),e(" 生成原子类等）。Vite 会自动读取 "),l("code",null,"postcss.config.js"),e(" 或 "),l("code",null,"css.postcss"),e("，把插件链应用到所有样式。边界：它处理的是 CSS，"),l("strong",null,"不认识 Sass/Less 语法"),e("，所以预处理器必须排在它前面先编译；而 "),l("code",null,"additionalData"),e(" 只该放变量与 mixin，放规则会被重复输出。 ")],-1))]),_:1})}}}),Ae={class:"v13"},Pe={class:"tabs"},je=["onClick"],Oe={class:"code-block"},Je=g({__name:"V13TypeScript",setup(a){const t=b("config"),n={config:`// vite.config.ts
export default defineConfig({
  // Vite 使用 esbuild 转译 TS（很快，但不做类型检查）
  esbuild: {
    loader: 'ts',       // 处理 .ts
    target: 'es2020',   // 目标 ES 版本
  },
})

// TypeScript 类型检查由 IDE 或单独运行 tsc --noEmit 完成
// Vite 不负责类型检查（保证开发服务器速度）`,vue:`<span class="cm">&lt;!-- Vue SFC 中使用 TypeScript --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="keyword">import</span> { ref } <span class="keyword">from</span> <span class="str">'vue'</span>

<span class="keyword">interface</span> <span class="type">User</span> {
  name: string
  age: number
}

<span class="keyword">const</span> user = ref(<span class="type">User</span>)({ name: <span class="str">'张三'</span>, age: 25 })
<span class="tag">&lt;/script&gt;</span>

<span class="cm">&lt;!-- 如果需要类型推导，建议使用 &lt;script setup lang="ts"&gt; --&gt;</span>
<span class="tag">&lt;script</span> <span class="attr">lang</span>=<span class="str">"ts"</span> <span class="attr">setup</span><span class="tag">&gt;</span>
<span class="cm">// 更好的类型推导和 IDE 支持</span>
<span class="keyword">const</span> count = ref(<span class="num">0</span>) <span class="cm">// 自动推导为 Ref&lt;number&gt;</span>
<span class="tag">&lt;/script&gt;</span>`,check:`// 类型检查方案
// 1. IDE 实时检查（推荐）
// VS Code + Volar 扩展

// 2. 构建时检查（慢但安全）
export default defineConfig({
  typescript: {
    enabled: true,  // 默认 false，启用后构建会做类型检查
  },
})

// 3. 单独运行（最灵活）
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "npm run type-check && vite build"
  }
}`};return(m,r)=>(o(),p("div",Ae,[r[0]||(r[0]=l("p",{class:"intro"},[e("Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 "),l("code",null,"vue-tsc"),e(" 单独完成。")],-1)),l("div",Pe,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,je)),64))]),l("pre",Oe,[l("code",null,i(n[t.value]),1)])]))}}),ze=E(Je,[["__scopeId","data-v-86c362ee"]]),Be={class:"lesson-figure"},Ue=g({__name:"V13TypeScriptArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你把 "),l("code",null,"user.name"),e(" 手滑写成了 "),l("code",null,"user.nmae"),e("，编辑器里红波浪线一片；你以为构建铁定过不了，结果 "),l("code",null,"vite build"),e(" 一路绿灯，直到线上用户看到页面上一片空白——类型错误明明标出来了，为什么构建完全不理它？ ")],-1)),n[2]||(n[2]=l("h2",null,"全量类型检查",-1)),n[3]||(n[3]=l("p",null,[e(" 想用 TypeScript，图的就是类型安全：接口写错、字段拼错、传参不匹配，最好在"),l("strong",null,"运行之前"),e("就被拦下。但类型检查是要花时间的——它得把整个项目的类型图扫一遍，才能判断某处调用是否成立。如果每次你改一行代码，开发服务器都先做一次全量类型检查再响应，那「秒级热更新」就没了。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 于是 Vite 必须回答一个取舍："),l("strong",null,"把 TypeScript 变成 JavaScript（转译）和判断类型对不对（检查），要不要合成一件事？"),e("旧的打包器把两者合在一起做——安全，但慢；而日常开发里，你绝大多数的编辑只是想刷新一下看看效果，为此每次都付出全量检查的代价并不划算。 ")],-1)),n[5]||(n[5]=l("h2",null,"esbuild只转译",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：交给 "),l("code",null,"esbuild"),e(" 只做转译——把类型注解整体擦掉，输出纯 JavaScript，一个类型都不看。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把「让代码能跑」这件事做到了毫秒级"),e("。esbuild 用 Go 编写、多核并行，转译速度远快于传统 JS 实现的工具，于是开发服务器可以做到改一行、几乎立刻响应。 ")],-1)),n[8]||(n[8]=l("h2",null,"构建跳过类型",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[l("code",null,"user.nmae"),e(" 这种拼写错误，esbuild 压根不看，dev 不报、build 也不报——构建通过不等于类型无误。")]),l("li",null,"接口改了字段名，所有旧调用点都错了，但项目照常构建成功，问题一路留到线上才暴露。"),l("li",null,[e("别名 "),l("code",null,"@/utils"),e(" 在 "),l("code",null,"tsconfig.json"),e(" 里配了、编辑器里能跳转，运行时却报找不到模块——因为两边配置没对齐。")]),l("li",null,[l("code",null,[e("import.meta"),l("span",null,".env"),e(".VITE_XXX")]),e(" 和 "),l("code",null,".vue"),e(" 文件没有类型声明，编辑器满屏「找不到模块 / 属性不存在」。")])],-1)),n[10]||(n[10]=l("h2",null,"转译与检查分离",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「把检查找回来，但不拖慢转译」。这里不推翻最小方案，而是"),l("strong",null,"给转译和检查各自分派合适的工具"),e("：转译仍交给 esbuild 保速度，检查交给 "),l("code",null,"vue-tsc --noEmit"),e(" 保正确性。"),l("code",null,"--noEmit"),e(" 表示只报类型错误、不产出文件，正好补上 esbuild 留下的那块空白。 ")],-1)),n[12]||(n[12]=l("p",null," 再补「检查什么时候跑」。既然它慢，就不该压在每次热更新上，而要挂在两道关口： ",-1)),n[13]||(n[13]=l("ol",{class:"lesson-steps"},[l("li",null,[e("构建脚本："),l("code",null,'"build": "vue-tsc --noEmit && vite build"'),e("，类型不过就不产出产物。")]),l("li",null,[e("CI 流水线：单独跑一条 "),l("code",null,"type-check"),e("，类型不通过就不允许合入与部署。")])],-1)),n[14]||(n[14]=l("p",null,[e(" 接着补「类型声明」。在 "),l("code",null,"vite-env.d.ts"),e(" 里加一行 "),l("code",null,'/// <reference types="vite/client" />'),e(" 引入 Vite 自带的类型，再声明 "),l("code",null,"*.vue"),e(" 模块和 "),l("code",null,"ImportMetaEnv"),e(" 接口，编辑器对 "),l("code",null,".vue"),e(" 导入与 "),l("code",null,[e("import.meta"),l("span",null,".env")]),e(" 才有补全和检查。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「一致性」。"),l("code",null,"tsconfig.json"),e(" 的 "),l("code",null,"paths"),e(" 别名必须和 "),l("code",null,"vite.config.ts"),e(" 的 "),l("code",null,"resolve.alias"),e(),l("strong",null,"指向同一处"),e("：只配一边，就会出现「编辑器能跳转、运行时找不到模块」的割裂。如果本地 "),l("code",null,"vue-tsc"),e(" 的报错和 IDE 对不上，先核对两者依赖与插件版本是否一致。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两个容易忽略的限制："),e("第一，"),l("strong",null,"构建成功不等于类型无误"),e("，务必把 "),l("code",null,"type-check"),e(" 接进构建或 CI；第二，esbuild 并非支持全部 TS 特性——"),l("code",null,"const enum"),e("、"),l("code",null,"export ="),e("、装饰器的 "),l("code",null,"emitDecoratorMetadata"),e(" 它都不支持，遇到要改成兼容写法。 ")],-1)),n[17]||(n[17]=l("h2",null,"三类检查对照",-1)),l("figure",Be,[n[0]||(n[0]=l("figcaption",null,[e("切 config / vue / check 三个页签：先看 esbuild 的转译配置，再看 "),l("code",null,'<script setup lang="ts">'),e(" 里怎么用接口与泛型，最后对比 "),l("code",null,"vue-tsc"),e(" 的三种类型检查方案。")],-1)),I(ze)]),n[18]||(n[18]=l("h2",null,"工具与时机协作",-1)),n[19]||(n[19]=l("p",null,[e(" Vite 对 TypeScript 的态度可以概括成一句："),l("strong",null,"转译和检查是两件事，交给两个工具、跑在两个时刻"),e("。esbuild 负责把 TS 极速转成 JS（只擦类型、不检查），"),l("code",null,"vue-tsc --noEmit"),e(" 负责在构建与 CI 里把关类型。理解了这一点，你就不会再把「构建成功」当成「类型没问题」。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「类型擦除（Type Erasure）」"),e("指 TypeScript 的类型只存在于编译期，转译时被整体删除，运行时的 JavaScript 里不含任何类型信息。这正是 esbuild 能极速转译的根本原因，也解释了它为什么「不做类型检查」——类型在输出前就没了，运行时无从校验。边界：因为类型被擦除，你不能在运行时 "),l("code",null,"instanceof"),e(" 一个接口，也不能依赖 "),l("code",null,"const enum"),e(" 之类的实现细节；类型安全只能在构建前由 "),l("code",null,"vue-tsc"),e(" / "),l("code",null,"tsc"),e(" 保证。 ")],-1))]),_:1})}}}),Ne={class:"v14"},Fe={class:"tabs"},qe=["onClick"],Ke={class:"code-block"},Xe=g({__name:"V14Proxy",setup(a){const t=b("basic"),n={basic:`// vite.config.ts - 开发代理配置
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
})`};return(m,r)=>(o(),p("div",Ne,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 开发服务器内置代理，解决开发环境跨域问题，无需配置 CORS。",-1)),l("div",Fe,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,qe)),64))]),l("pre",Ke,[l("code",null,i(n[t.value]),1)])]))}}),We=E(Xe,[["__scopeId","data-v-67ac9002"]]),_e={class:"lesson-figure"},Ge=g({__name:"V14ProxyArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("本地前端跑在 "),l("code",null,"5173"),e("、后端跑在 "),l("code",null,"3000"),e("，浏览器控制台一条红色报错——"),l("code",null,"No 'Access-Control-Allow-Origin' header"),e("；可你把同一个接口地址粘进浏览器地址栏敲回车，数据却好好地返回了。同样的请求，为什么地址栏行、页面里的 JS 却不行？ ")],-1)),n[2]||(n[2]=l("h2",null,"同源策略与预检",-1)),n[3]||(n[3]=l("p",null,[e(" 这背后的规则叫"),l("strong",null,"同源策略"),e("：浏览器只允许页面读取「协议 + 域名 + 端口」完全一致的资源，只要有一项不同就算跨源。跨源的请求会被浏览器拦下——简单请求拦截响应，复杂请求还要先发一次 "),l("code",null,"OPTIONS"),e(" 预检。所以地址栏能打开（它不执行脚本、不受这条策略约束），页面里的 JS 却拿不到数据。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 要绕开它，无非两条路：让后端同意你跨源，或者让请求「看起来是同源的」。第一条路每次联调都要后端配合改 CORS 配置，沟通成本高；允许来源写宽了还会把线上暴露给任意站点；带上 Cookie 的凭证请求更要多处理一个头，极易踩坑。第二条路得在开发服务器上做文章——问题是，"),l("strong",null,"怎么让浏览器以为它在请求自己？")],-1)),n[5]||(n[5]=l("h2",null,"前缀代理规则",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：在 Vite 开发服务器的 "),l("code",null,"server.proxy"),e(" 里，把以 "),l("code",null,"/api"),e(" 开头的请求转发到后端 "),l("code",null,"http://localhost:3000"),e("。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,[e("浏览器眼里，请求始终是发给 "),l("code",null,"5173"),e(" 的同源地址")]),e("，跨源从源头上就不成立。转发发生在开发服务器与后端这两台服务器之间，而"),l("strong",null,"服务器之间的请求不受浏览器同源策略约束"),e("——这正是代理能绕开跨域的根本原因。 ")],-1)),n[8]||(n[8]=l("h2",null,"虚拟主机匹配",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("后端用虚拟主机识别站点，收到 "),l("code",null,"Host: localhost:5173"),e(" 会匹配不到站点，返回 404 或错误页。")]),l("li",null,[e("后端真实路径可能就是 "),l("code",null,"/users"),e("，不带 "),l("code",null,"/api"),e(" 前缀，原样转发过去直接 404。")]),l("li",null,[e("WebSocket 连接不会被这个 HTTP 代理顺带转发，"),l("code",null,"ws://"),e(" 请求直接失败。")]),l("li",null,[e("代理只在 "),l("code",null,"vite dev"),e(" 生效：打包上线后它消失了，前端请求 "),l("code",null,"/api"),e(" 会打到静态服务器上 404。")]),l("li",null,[e("要在几个后端环境之间切换，只能每次回来手改 "),l("code",null,"target"),e("。")])],-1)),n[10]||(n[10]=l("h2",null,"请求头与路径改写",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「Host」。加上 "),l("code",null,"changeOrigin: true"),e("，代理会把请求头的 "),l("code",null,"Host"),e(" 改成 "),l("code",null,"target"),e(" 的域名，虚拟主机后端才认得出该返回哪个站点。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 再补「路径」。用 "),l("code",null,"rewrite"),e(" 改写转发路径，例如 "),l("code",null,"rewrite: (path) => path.replace(/^\\/api/, '')"),e(" 把前缀去掉。注意正则作用于"),l("strong",null,"带前缀的完整路径"),e("，要用 "),l("code",null,"^"),e(" 锚定，否则路径中间出现的 "),l("code",null,"/api"),e(" 也会被误改。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 接着补「WebSocket」。给那条规则加上 "),l("code",null,"ws: true"),e("，代理才会转发 "),l("code",null,"ws://"),e(" 连接。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 再补「多环境切换」。把配置改成函数式，用 "),l("code",null,"loadEnv"),e(" 读取环境变量，让 "),l("code",null,"target"),e(" 指向 "),l("code",null,"env.VITE_API_TARGET"),e("。这样切换后端只改环境变量，前端代码始终统一写相对路径 "),l("code",null,"/api/user"),e("，一行都不用动。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「可观察」。在 "),l("code",null,"configure(proxy, options)"),e(" 回调里挂上 "),l("code",null,"proxy.on('proxyReq', ...)"),e("，把每次实际转发的请求打到日志，联调时能直接看出请求到底发去了哪里。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"一条必须记住的边界："),e("代理"),l("strong",null,"只解决开发环境"),e("。生产环境没有 vite dev server，跨域要么由后端配置 CORS，要么用 Nginx 反向代理，要么把前后端部署在同一域名下。所以前端代码要统一写相对路径，把「后端是谁」这件事完全交给环境配置。 ")],-1)),n[17]||(n[17]=l("h2",null,"三种跨域方案",-1)),l("figure",_e,[n[0]||(n[0]=l("figcaption",null,[e("切 basic / ws / cors 三个页签：先看最常用的前缀代理与 "),l("code",null,"rewrite"),e(" 写法，再看 WebSocket 怎么转发，最后对比代理、后端 CORS 与自定义中间件三种跨域方案。")],-1)),I(We)]),n[18]||(n[18]=l("h2",null,"跨源转同源转发",-1)),n[19]||(n[19]=l("p",null,[e(" 开发代理的本质，是把「浏览器发出的跨源请求」改成「开发服务器替你发出的同源请求」：浏览器只看到 "),l("code",null,"5173"),e("，转发由服务器完成，于是同源策略天然不触发。要记住的判断只有两条——"),l("strong",null,"代理只在开发环境生效，生产要靠服务端方案"),e("；以及 "),l("code",null,"changeOrigin"),e(" 改的是 Host 头、"),l("code",null,"rewrite"),e(" 改的是路径，别把两者混为一谈。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「同源策略（Same-Origin Policy）」"),e("是浏览器的一项安全机制：只有「协议 + 域名 + 端口」三者完全一致才视为同源，脚本才能读取该资源；跨源请求会被拦截响应或先触发 "),l("code",null,"OPTIONS"),e(" 预检。关键边界有两条：它约束的是"),l("strong",null,"浏览器发起的读取"),e("，服务器之间的转发不受其限制，所以开发代理能绕开跨域；它也只存在于浏览器环境，"),l("strong",null,"生产环境没有代理可依赖"),e("，仍要由后端 CORS 或反向代理来解决。 ")],-1))]),_:1})}}}),Ye={class:"v15"},Ze={class:"tabs"},Qe=["onClick"],he={class:"code-block"},ln=g({__name:"V15Perf",setup(a){const t=b("analyze"),n={analyze:`// 构建产物分析
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
// 3. 查看 Main 线程中的 Vite 相关任务`};return(m,r)=>(o(),p("div",Ye,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 提供构建产物分析和多种性能优化手段，帮助控制 bundle 体积。",-1)),l("div",Ze,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,Qe)),64))]),l("pre",he,[l("code",null,i(n[t.value]),1)])]))}}),en=E(ln,[["__scopeId","data-v-5c5c43c2"]]),nn={class:"lesson-figure"},tn=g({__name:"V15PerfArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("三个月里产物从 "),l("code",null,"800KB"),e(" 涨到了 "),l("code",null,"3MB"),e("，首屏肉眼可见地变慢；你凭经验删掉几处 "),l("code",null,"console"),e("、又把一张大图压小，重新构建，体积数字几乎没动——那两兆的增长，根本不在你以为的地方。 ")],-1)),n[2]||(n[2]=l("h2",null,"产物体积构成",-1)),n[3]||(n[3]=l("p",null,[e(" 想优化体积，可 bundle 是一个（或几个）黑盒文件：你只看到总大小，看不到"),l("strong",null,"「哪一块占了多少」"),e("。于是只能凭经验猜——怀疑是 UI 库、怀疑是某张图、怀疑是压缩没开——猜中纯属运气。旧办法要人承担的成本有三项：没有数据只能反复试错；改完无法量化，不知道到底有没有变小；没有参照，也就无从判断「多大才算超标」。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 所以问题必须先转向测量："),l("strong",null,"怎么先量出「哪个依赖占了多大」，再对症下药？"),e("不先归因就优化，等于蒙着眼睛修 bug。 ")],-1)),n[5]||(n[5]=l("h2",null,"可视化体积分析",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：先测量。用 "),l("code",null,"rollup-plugin-visualizer"),e(" 在构建后生成一份 "),l("code",null,"stats.html"),e(" 报告，它是张 treemap——每个模块用一块矩形的面积表示体积占比，一眼就能看出谁大谁小。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把黑盒拆成了可归因的构成"),e("。在此之前你只有「3MB」这一个数字；在此之后，你知道这 3MB 里有多少是框架、多少是被整包导入的工具库、多少是图片。优化这件事，从此有了靶子。 ")],-1)),n[8]||(n[8]=l("h2",null,"整包导入开销",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("报告只告诉你「谁大」，不告诉你「为什么大」——"),l("code",null,"lodash-es"),e(" 占了 500KB，是因为整包导入，而不是它本身必须这么大。")]),l("li",null,"测量本身有成本：visualizer 每次构建都跑，会拖慢日常开发和 CI。"),l("li",null,"产物体积是压缩后的，只看总大小看不出 gzip / brotli 传输时到底多大。"),l("li",null,"开发阶段「首次访问某页要等依赖转译」的慢，和构建产物的体积是两码事，用一套办法治不了。"),l("li",null,"改完没有留底对比，下次只会重新猜一遍。")],-1)),n[10]||(n[10]=l("h2",null,"按需开启测量",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「只在需要时测量」。把 visualizer 放进 "),l("code",null,"if (process.env.ANALYZE)"),e(" 里，日常构建不生成报告，避免拖慢 CI；要分析时执行 "),l("code",null,"ANALYZE=true vite build"),e("。同时开启 "),l("code",null,"gzipSize"),e("，报告里就能看到传输时更真实的压缩后大小。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 再补「读懂报告」。打开 "),l("code",null,"stats.html"),e("，按面积从大到小往下找，通常就是两类问题："),l("strong",null,"整包导入"),e("的大依赖，和"),l("strong",null,"被顺带打包"),e("、其实用不到的库。 ")],-1)),n[13]||(n[13]=l("p",null," 接着补「对症下药」，对应三种典型手段： ",-1)),n[14]||(n[14]=l("ol",{class:"lesson-steps"},[l("li",null,"改按需引入：把整包导入换成只引入用到的那一个函数，例如直接 import 单文件路径。"),l("li",null,[e("换成更轻的替代库：如把体积偏大的 "),l("code",null,"moment"),e(" 换成 "),l("code",null,"dayjs"),e("。")]),l("li",null,[e("外部化交给 CDN：用 "),l("code",null,"rollupOptions.external"),e(" 把大型库排除出产物，再配 "),l("code",null,"output.globals"),e(" 映射到全局变量。")])],-1)),n[15]||(n[15]=l("p",null,[e(" 再补「复核」。改完用 "),l("code",null,"manualChunks"),e(" 重新分包，再跑一次报告，把优化前后两份"),l("strong",null,"并排对比"),e("，用数据确认收益；同时设 "),l("code",null,"chunkSizeWarningLimit"),e(" 作为体积警戒线，防止以后悄悄反弹。 ")],-1)),n[16]||(n[16]=l("p",null,[e(" 最后补「开发侧的那条线」。构建体积和开发启动是两回事：用 "),l("code",null,"server.warmup.clientFiles"),e(" 预热高频入口（如 "),l("code",null,"main.ts"),e("、"),l("code",null,"App.vue"),e("、"),l("code",null,"router/index.ts"),e("），用 "),l("code",null,"optimizeDeps.include"),e(" 提前预构建常用依赖，把「首次访问某页要等转译」的等待压下去。 ")],-1)),n[17]||(n[17]=l("div",{class:"lesson-box warn"},[l("strong",null,"一条最容易被忽略的方法论："),e("优化前先存一份报告，改完再存一份，"),l("strong",null,"用两份报告对比来证明收益"),e("，而不是凭感觉说「应该小了吧」。另外，visualizer 平时不要常驻插件数组——它是分析工具，不是构建必需品。 ")],-1)),n[18]||(n[18]=l("h2",null,"报告与体积优化",-1)),l("figure",nn,[n[0]||(n[0]=l("figcaption",null,"切 analyze / optimize / metrics 三个页签：先看可视化报告怎么生成与阅读，再看三种体积优化手段怎么写，最后看构建与开发两侧的性能指标该如何监控。",-1)),I(en)]),n[19]||(n[19]=l("h2",null,"先测量再归因",-1)),n[20]||(n[20]=l("p",null,[e(" 性能优化这件事，顺序不能反："),l("strong",null,"先测量，再归因，最后对症下药"),e("。visualizer 的 treemap 把黑盒拆成可归因的构成，你据此决定是改按需引入、换更轻的库，还是外部化交给 CDN；改完再用报告复核，用数据而不是感觉确认收益。别忘了一件事——构建体积和开发启动是两条独立的线，各有各的优化手段。 ")],-1)),n[21]||(n[21]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「treemap（矩形树图）」"),e("是 "),l("code",null,"rollup-plugin-visualizer"),e(" 生成的报告形式：用嵌套矩形的"),l("strong",null,"面积"),e("表示各模块在 bundle 中的体积占比，面积越大说明它占得越多，便于从大到小定位「体积大户」。边界：它展示的是打包产物的体积构成，"),l("strong",null,"不等于运行时开销"),e("，也不代表某块大就一定该优化——要结合它是否真的被用到、能否按需引入来判断；"),l("code",null,"gzipSize"),e(" 打开后看到的是传输时的压缩大小，和磁盘上的原始体积并不相同。 ")],-1))]),_:1})}}}),sn={class:"v16"},on={class:"tabs"},un=["onClick"],dn={class:"code-block"},rn=g({__name:"V16PluginDev",setup(a){const t=b("hooks"),n={hooks:`// Vite 插件结构（兼容 Rollup 插件）
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
// 在测试项目中：npm link 或 pnpm add link:../my-plugin`};return(m,r)=>(o(),p("div",sn,[r[0]||(r[0]=l("p",{class:"hint"},"Vite 插件兼容 Rollup 插件接口，同时提供 Vite 独有的钩子。",-1)),l("div",on,[(o(),p(C,null,x(n,(c,d)=>l("button",{key:d,class:v({active:t.value===d}),onClick:y=>t.value=d},i(d),11,un)),64))]),l("pre",dn,[l("code",null,i(n[t.value]),1)])]))}}),pn=E(rn,[["__scopeId","data-v-e7ec9322"]]),an={class:"lesson-figure"},mn=g({__name:"V16PluginDevArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你想在构建时把版本号注入代码，顺手写了个只在 "),l("code",null,"transform"),e(" 里做一次字符串替换的插件。挂上去之后本地开发从秒开变成了十几秒才响应，改一行样式要转半天——这个插件明明只替换了"),l("strong",null,"一个"),e("占位符，怎么会把整个项目拖垮？ ")],-1)),n[2]||(n[2]=l("h2",null,"构建期信息注入",-1)),n[3]||(n[3]=l("p",null,[e(" 你遇到的需求都很具体：想在代码里直接 "),l("code",null,"import"),e(" 一个 "),l("code",null,".md"),e(" 文件把它当组件渲染，想把版本号这类信息在构建时注进去，想给开发服务器加一个自定义接口。这些事现有插件都办不到，因为它们不在别人的设计目标里。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 退回到「手写一个构建脚本」的老办法，人要承担的隐藏成本有三样：脚本逻辑散落在各个文件里，改一处要满仓库找；它只能跑在命令行里，"),l("strong",null,"进不了开发服务器"),e("，于是 dev 和 build 的行为各写一套、迟早对不上；而且它没法像插件那样挂到 Vite 的流程里，别人也复用不了。于是问题落在一句话上："),l("strong",null,"能不能有一种统一的东西，既能改配置、又能改代码、还能挂到开发服务器上？")],-1)),n[5]||(n[5]=l("h2",null,"插件函数结构",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的想法：写一个函数，返回一个带 "),l("code",null,"name"),e(" 和 "),l("code",null,"transform"),e(" 的对象，塞进 "),l("code",null,"plugins"),e(" 数组。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它把「对模块代码的批量改写」收进了一个标准接口"),e("。开发时每个模块请求都会经过它，构建时也会经过它；不再需要脚本、不再需要两套逻辑。 ")],-1)),n[8]||(n[8]=l("h2",null,"逐模块转换成本",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[l("code",null,"transform"),e(" 会被"),l("strong",null,"每个模块"),e("调用一次。只按后缀判断就处理，等于连 "),l("code",null,"node_modules"),e(" 里的依赖也要过一遍正则——这正是开场里开发服务器变慢的原因。")]),l("li",null,[e("光改代码不够：想给 "),l("code",null,"resolve.extensions"),e(" 加一项、想加一个开发接口，"),l("code",null,"transform"),e(" 全都做不到。")]),l("li",null,[e("想 "),l("code",null,"import"),e(" 一个磁盘上根本不存在的路径，"),l("code",null,"transform"),e(" 也没地方把它的内容吐出来。")]),l("li",null,[e("插件没写 "),l("code",null,"name"),e(" 或与别人重名，报错时日志里只有一句无名的 warning，根本定位不到是谁干的。")])],-1)),n[10]||(n[10]=l("h2",null,"两类钩子职责",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「钩子分类」。插件对象能挂两类钩子，各管一摊："),l("strong",null,"Vite 独有钩子"),e("服务于开发服务器、HTML 与 HMR——"),l("code",null,"config"),e(" 改配置、"),l("code",null,"configResolved"),e(" 拿最终配置、"),l("code",null,"configureServer"),e(" 加中间件、"),l("code",null,"transformIndexHtml"),e(" 改 HTML、"),l("code",null,"handleHotUpdate"),e(" 处理热更新；"),l("strong",null,"Rollup 兼容钩子"),e("服务于模块的解析、加载与转换——"),l("code",null,"resolveId"),e("、"),l("code",null,"load"),e("、"),l("code",null,"transform"),e("。一次模块请求流经的先后顺序大致是： ")],-1)),n[12]||(n[12]=l("ol",{class:"lesson-steps"},[l("li",null,[e("模块请求进来，先由 "),l("code",null,"resolveId"),e(" 决定这个 "),l("code",null,"id"),e(" 到底指向谁。")]),l("li",null,[e("再由 "),l("code",null,"load"),e(" 给出这个模块的源码。")]),l("li",null,[e("最后由 "),l("code",null,"transform"),e(" 把源码改写一遍。")]),l("li",null,[e("开发服务器启动与 HTML 处理这些事，则由 "),l("code",null,"configureServer"),e("、"),l("code",null,"transformIndexHtml"),e(" 等 Vite 独有钩子负责。")])],-1)),n[13]||(n[13]=l("p",null,[e(" 接着补「虚拟模块」。要 "),l("code",null,"import"),e(" 一个并不存在的路径，就用 "),l("code",null,"resolveId"),e(" 拦截这个 "),l("code",null,"id"),e("，返回一个以 "),l("code",null,"\\0"),e(" 开头的虚拟 id；再用 "),l("code",null,"load"),e(" 识别这个 id、直接返回它的源码字符串。那个 "),l("code",null,"\\0"),e(" 前缀是给其它插件看的约定标记——"),l("strong",null,"表示这是一个虚拟模块，别去磁盘上找"),e("。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 再补「性能边界」。既然 "),l("code",null,"transform"),e(" 是高频钩子，它必须"),l("strong",null,"第一行就过滤"),e("：先看 "),l("code",null,"id"),e(" 是否命中目标后缀，不命中的立刻 "),l("code",null,"return null"),e(" 交回默认流程。开场那个慢，缺的就是这一步——一个不做过滤的 "),l("code",null,"transform"),e("，会让每个请求、每个模块都白跑一遍。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「命名与调试」。插件按 "),l("code",null,"vite-plugin-xxx"),e(" 的规范命名，导出函数返回插件对象，"),l("code",null,"name"),e(" 字段与之同名；排查钩子是否被调用、按什么顺序调用，用 "),l("code",null,"vite --debug"),e(" 看调用日志，比在钩子里到处打 "),l("code",null,"console"),e(" 快得多。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条必守的线："),l("code",null,"transform"),e(" 是高频钩子，务必先按 "),l("code",null,"id"),e(" 过滤、非目标文件立即 "),l("code",null,"return null"),e("，否则一个无关插件就能拖慢整个开发服务器；插件 "),l("code",null,"name"),e(" 必须唯一，否则报错时你根本分不清是哪个插件出的问题。 ")],-1)),n[17]||(n[17]=l("h2",null,"骨架结构与发布",-1)),l("figure",an,[n[0]||(n[0]=l("figcaption",null,"切 hooks / example / publish 三个页签，看一个插件骨架里有哪些钩子、注入版本号的最小示例怎么写，以及发布到 npm 的命名与包结构规范。",-1)),I(pn)]),n[18]||(n[18]=l("h2",null,"函数式插件实现",-1)),n[19]||(n[19]=l("p",null,[e(" 自定义插件就是「返回一个带 "),l("code",null,"name"),e(" 与钩子对象的函数」：Vite 独有钩子管开发服务器、HTML 与 HMR，Rollup 兼容钩子管模块的解析、加载与转换。写它的关键不在堆钩子，而在两件事——用 "),l("code",null,"resolveId"),e(" 加 "),l("code",null,"load"),e(" 造出虚拟模块，以及让高频的 "),l("code",null,"transform"),e(" 先把无关文件挡在门外。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「虚拟模块」"),e("指由插件在 "),l("code",null,"resolveId"),e(" 与 "),l("code",null,"load"),e(" 里凭空「造」出来的模块，它不对应磁盘上的任何真实文件，通常以 "),l("code",null,"\\0"),e(" 前缀作为标识，让其它插件跳过它。边界：虚拟模块只有在登记它的插件上下文里才存在，那个 "),l("code",null,"id"),e(" 不能当作文件路径去读；"),l("code",null,"load"),e(" 必须能对同一个 "),l("code",null,"id"),e(" 返回内容，否则解析得到、加载不到，依然报错。 ")],-1))]),_:1})}}}),cn={class:"demo-card"},vn={class:"tab-bar"},gn={key:0},fn={class:"tips-grid"},bn={class:"tip-icon"},yn={key:1},Sn={key:2},Vn={key:3},Cn={class:"demo-header"},xn=["disabled"],kn={key:0,class:"progress-bar"},Mn={class:"progress-text"},$n={class:"dep-list"},Tn={class:"dep-name"},En={class:"dep-size"},Rn={class:"summary-bar"},Ln=`<span style="color:#7c7c99">// vite.config.ts - 依赖预构建配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  
  <span style="color:#7c7c99">// 依赖预构建配置</span>
  optimizeDeps: {
    <span style="color:#7c7c99">// 强制预构建的依赖</span>
    include: [
      'vue',
      'vue-router',
      'pinia',
      'lodash-es',
      'dayjs',
    ],
    
    <span style="color:#7c7c99">// 排除不预构建的依赖</span>
    exclude: ['axios'],
    
    <span style="color:#7c7c99">// 自定义 esbuild 选项</span>
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  <span style="color:#7c7c99">// 强制重新预构建</span>
  <span style="color:#7c7c99">// 命令行: vite --force</span>
})`,In=`<span style="color:#e85d04">┌─────────────────────────────────────┐</span>
<span style="color:#e85d04">│  启动 Vite Dev Server                │</span>
<span style="color:#e85d04">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#d97706">┌─────────────────────────────────────┐</span>
<span style="color:#d97706">│  扫描入口文件，收集依赖              │</span>
<span style="color:#d97706">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#65a30d">┌─────────────────────────────────────┐</span>
<span style="color:#65a30d">│  esbuild 预构建 CommonJS / UMD      │</span>
<span style="color:#65a30d">│  → 转换为 ESM 模块                   │</span>
<span style="color:#65a30d">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#0891b2">┌─────────────────────────────────────┐</span>
<span style="color:#0891b2">│  缓存到 node_modules/.vite          │</span>
<span style="color:#0891b2">└──────────────┬──────────────────────┘</span>
               ↓
<span style="color:#7c3aed">┌─────────────────────────────────────┐</span>
<span style="color:#7c3aed">│  浏览器直接加载预构建后的 ESM       │</span>
<span style="color:#7c3aed">└─────────────────────────────────────┘</span>`,wn=g({__name:"V17DependencyPrebundle",setup(a){const t=b("intro"),n=b([{name:"vue",size:"42.3 KB",bundled:!0,status:"cached"},{name:"vue-router",size:"28.1 KB",bundled:!0,status:"cached"},{name:"pinia",size:"18.5 KB",bundled:!0,status:"cached"},{name:"lodash-es",size:"95.2 KB",bundled:!0,status:"new"},{name:"dayjs",size:"6.8 KB",bundled:!0,status:"cached"},{name:"axios",size:"14.3 KB",bundled:!1,status:"native"}]),m=b(!1),r=b(100),c=P(()=>n.value.filter(M=>M.bundled).reduce((M,s)=>{const u=parseFloat(s.size);return M+u},0).toFixed(1)),d=[{icon:"⚡",title:"为什么需要预构建",desc:"将 CommonJS/UMD 转换为 ESM，让浏览器能直接加载；将多文件依赖打包成单文件，减少 HTTP 请求数。"},{icon:"💾",title:"缓存机制",desc:"预构建产物缓存在 node_modules/.vite 中。依赖不变则复用缓存，仅新依赖或配置变化时才重新构建。"},{icon:"🎯",title:"include 与 exclude",desc:"include 强制预构建（如某些深层导入的依赖），exclude 排除依赖（如纯 ESM 且模块很多的库，按需加载更好）。"},{icon:"🔄",title:"强制重新构建",desc:"使用 vite --force 或删除 node_modules/.vite 目录，可强制重新预构建所有依赖。"}];function y(){if(m.value)return;m.value=!0,r.value=0,n.value.forEach(s=>{s.status==="cached"&&(s.status="rebuilding")});const M=J(()=>{r.value+=Math.random()*15+5,r.value>=100&&(r.value=100,clearInterval(M),n.value.forEach(s=>{s.status==="rebuilding"&&(s.status="cached")}),setTimeout(()=>{m.value=!1},500))},200)}function k(M){return{cached:"已缓存",new:"新增",native:"原生ESM",rebuilding:"构建中"}[M]||M}function A(M){return{cached:"status-cached",new:"status-new",native:"status-native",rebuilding:"status-rebuilding"}[M]||""}return(M,s)=>(o(),p("div",cn,[s[11]||(s[11]=l("h3",null,"V17 · 依赖预构建与优化",-1)),l("div",vn,[l("button",{class:v(["tab-btn",{active:t.value==="intro"}]),onClick:s[0]||(s[0]=u=>t.value="intro")},"核心概念",2),l("button",{class:v(["tab-btn",{active:t.value==="flow"}]),onClick:s[1]||(s[1]=u=>t.value="flow")},"构建流程",2),l("button",{class:v(["tab-btn",{active:t.value==="config"}]),onClick:s[2]||(s[2]=u=>t.value="config")},"配置示例",2),l("button",{class:v(["tab-btn",{active:t.value==="demo"}]),onClick:s[3]||(s[3]=u=>t.value="demo")},"交互演示",2)]),t.value==="intro"?(o(),p("div",gn,[l("div",fn,[(o(),p(C,null,x(d,u=>l("div",{key:u.title,class:"tip-card"},[l("span",bn,i(u.icon),1),l("strong",null,i(u.title),1),l("p",null,[l("small",null,i(u.desc),1)])])),64))]),s[4]||(s[4]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"核心目标："),e("提升开发启动速度和页面加载性能。将大量小模块的依赖打包成单个文件，将非 ESM 格式转换为 ESM，让浏览器原生模块加载更高效。")])],-1))])):V("",!0),t.value==="flow"?(o(),p("div",yn,[l("pre",{class:"mini-code",innerHTML:In}),s[5]||(s[5]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"第一次启动慢？"),e("首次启动时 Vite 需要扫描并预构建所有依赖，这是正常的。后续启动会直接使用缓存，速度极快。")])],-1))])):V("",!0),t.value==="config"?(o(),p("div",Sn,[l("pre",{class:"mini-code",innerHTML:Ln}),s[6]||(s[6]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"常用场景："),e("深层导入的依赖未被自动发现时用 include；某些库已经是纯 ESM 且希望按需加载时用 exclude。")])],-1))])):V("",!0),t.value==="demo"?(o(),p("div",Vn,[l("div",Cn,[s[7]||(s[7]=l("span",null,"依赖预构建模拟器",-1)),l("button",{class:"action-btn",disabled:m.value,onClick:y},i(m.value?"构建中...":"🔄 重新预构建"),9,xn)]),m.value?(o(),p("div",kn,[l("div",{class:"progress-fill",style:O({width:r.value+"%"})},null,4),l("span",Mn,i(Math.floor(r.value))+"%",1)])):V("",!0),l("ul",$n,[(o(!0),p(C,null,x(n.value,u=>(o(),p("li",{key:u.name,class:"dep-item"},[l("span",Tn,i(u.name),1),l("span",En,i(u.size),1),l("span",{class:v(["dep-status",A(u.status)])},i(k(u.status)),3)]))),128))]),l("div",Rn,[l("span",null,[s[8]||(s[8]=e("预构建总大小：",-1)),l("strong",null,i(c.value)+" KB",1)]),l("span",null,[s[9]||(s[9]=e("已缓存：",-1)),l("strong",null,i(n.value.filter(u=>u.status==="cached").length),1),e(" / "+i(n.value.length),1)])]),s[10]||(s[10]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"观察："),e("点击「重新预构建」按钮，观察依赖状态变化和进度条。实际项目中缓存存在于 "),l("code",null,"node_modules/.vite"),e(" 目录。")])],-1))])):V("",!0)]))}}),Dn=E(wn,[["__scopeId","data-v-eca5a90a"]]),Hn={class:"lesson-figure"},An=g({__name:"V17DependencyPrebundleArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你把某个依赖升级了一个版本，"),l("code",null,"package.json"),e(" 和 lockfile 都改过了，重启开发服务器——行为还是旧的。你翻遍业务代码也找不到线索，最后抱着试试看的心态删掉整个 "),l("code",null,"node_modules/.vite"),e("，一重启，新版本生效了。明明依赖变了，Vite 为什么没察觉？ ")],-1)),n[2]||(n[2]=l("h2",null,"缓存复用成本",-1)),n[3]||(n[3]=l("p",null,[e(" 上一课你已经知道：预构建把依赖转成 ESM 合并成单文件，是为了让开发服务器快。但「快」是有代价的——它把结果"),l("strong",null,"缓存"),e("下来复用，而不是每次启动都重算。缓存一旦存在，就必须回答一个问题：这份产物还代表当前的依赖吗？ ")],-1)),n[4]||(n[4]=l("p",null,[e(" 如果每次启动都重算，冷启动永远慢，「预构建」的意义也就没了；如果永远信任缓存，依赖升级了却读到旧产物，就会像开场那样「改了没生效」。于是核心问题不是「怎么预构建」，而是"),l("strong",null,"怎么判断一份预构建缓存还能不能用"),e("。 ")],-1)),n[5]||(n[5]=l("h2",null,"指纹比对机制",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的想法：把产物写进 "),l("code",null,"node_modules/.vite"),e("，同时记一份说明，启动时比对说明和当前情况，一致就跳过预构建。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它让第二次启动不必重算"),e("。开销被一次性付掉，后续启动直接读现成的文件。 ")],-1)),n[8]||(n[8]=l("h2",null,"动态导入漏判",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("比对用的「说明」覆盖不全就会漏判：动态 "),l("code",null,"import()"),e(" 的依赖静态扫描发现不了，它压根不在缓存清单里，运行时才报 404。")]),l("li",null,"缓存是「要么整份有效、要么整份重算」，一条输入变了就全废，看不出是哪条引起的。"),l("li",null,[e("既然缓存能长期有效，人就会误以为「改了就会生效」——手工改过的 "),l("code",null,"node_modules"),e("、本地 "),l("code",null,"link"),e(" 的包根本不在比对范围内。")]),l("li",null,"启动变慢时，人第一反应是怀疑 CPU 或磁盘，很少想到是缓存失效后被反复重算。")],-1)),n[10]||(n[10]=l("h2",null,"失效条件构成",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「缓存里到底存了什么」。"),l("code",null,"node_modules/.vite/deps/"),e(" 下每个依赖一个 "),l("code",null,".js"),e(" 加一份 "),l("code",null,".js.map"),e("，另有一份 "),l("code",null,"_metadata.json"),e("，记录当时的依赖列表与 hash、以及配置的指纹。启动时 Vite 拿当前情况算出指纹，和这份元数据一比：相同就跳过预构建，不同就整份重建。 ")],-1)),n[12]||(n[12]=l("p",null," 接着补「什么会让指纹变化」。这组输入就是缓存失效的条件，任一条变动都会作废整份缓存： ",-1)),n[13]||(n[13]=l("ul",null,[l("li",null,[l("code",null,"package.json"),e(" 里的依赖列表变化。")]),l("li",null,[e("lockfile（"),l("code",null,"package-lock.json"),e(" / "),l("code",null,"yarn.lock"),e(" / "),l("code",null,"pnpm-lock.yaml"),e("）变化。")]),l("li",null,[l("code",null,"vite.config.ts"),e(" 中 "),l("code",null,"optimizeDeps"),e(" 配置变化。")]),l("li",null,[l("code",null,"NODE_ENV"),e("，以及配置文件里用到的 "),l("code",null,"VITE_"),e(" 环境变量变化。")]),l("li",null,[e("显式设置 "),l("code",null,"force"),e(" 或启动时加 "),l("code",null,"--force"),e("。")])],-1)),n[14]||(n[14]=l("p",null,[e(" 那为什么开场里依赖变了却还读到旧行为？因为指纹只覆盖它算进去的输入。手工改过的文件、本地 "),l("code",null,"link"),e(" 进来的包不在其中，这时唯一的办法就是"),l("strong",null,"强制重算"),e("。手动控制缓存有三种等价手段：删掉 "),l("code",null,"node_modules/.vite"),e("、启动时 "),l("code",null,"vite --force"),e("、或配置 "),l("code",null,"optimizeDeps.force = true"),e("。 ")],-1)),n[15]||(n[15]=l("p",null," 再补「排障清单」。既然预构建的问题大多能归到「缓存」或「哪些依赖参与」两类，可以照症状对症： ",-1)),n[16]||(n[16]=l("ol",{class:"lesson-steps"},[l("li",null,[e("某个包运行时 404：多半是动态 "),l("code",null,"import()"),e(" 没被扫到，把它加进 "),l("code",null,"optimizeDeps.include"),e(" 强制预构建。")]),l("li",null,[e("CommonJS 包报 "),l("code",null,"require is not defined"),e("：通常 esbuild 能自动转，个别包仍出错就加进 "),l("code",null,"include"),e(" 再试。")]),l("li",null,[e("启动太慢：先确认缓存是否有效（无效会被反复重算），再减少 "),l("code",null,"include"),e(" 里不必要的项。")]),l("li",null,[e("依赖更新没生效：优先 "),l("code",null,"--force"),e(" 或删缓存，先排除缓存因素再怀疑代码。")])],-1)),n[17]||(n[17]=l("p",null,[e(" 最后补「monorepo 场景」。本地 "),l("code",null,"link"),e(" 的包不在依赖指纹的自然覆盖里，建议加入 "),l("code",null,"include"),e(" 强制预构建，并配上 "),l("code",null,"resolve.dedupe"),e("，避免同一个依赖被打出多份实例。 ")],-1)),n[18]||(n[18]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),l("code",null,"include"),e(" 里只能写第三方依赖，绝不能写 "),l("code",null,"src"),e(" 下的业务路径——预构建压根不处理业务源码；遇到「改了没生效」这类诡异现象，先 "),l("code",null,"--force"),e(" 重算一次，能排除一大半缓存问题，再回头看代码。 ")],-1)),n[19]||(n[19]=l("h2",null,"预构建状态流转",-1)),l("figure",Hn,[n[0]||(n[0]=l("figcaption",null,"切 核心概念 / 构建流程 / 配置示例 / 交互演示 四个页签，在演示里点「重新预构建」，看每个依赖的状态从「已缓存」经「构建中」再回到「已缓存」，以及进度条与总大小的变化。",-1)),I(Dn)]),n[20]||(n[20]=l("h2",null,"排障与重建策略",-1)),n[21]||(n[21]=l("p",null,[e(" 预构建快，是因为它把结果缓存了下来；缓存可信，是因为它记了一份指纹来比对。理解「哪些输入会让指纹失效」以及「哪些变化根本不在指纹里」，就握住了 "),l("code",null,"optimizeDeps"),e(" 的大部分排障钥匙——多数「改了没生效」，答案都是清缓存或 "),l("code",null,"--force"),e("。 ")],-1)),n[22]||(n[22]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「缓存失效（cache invalidation）」"),e("指判断一份缓存是否还能代表当前真实输入的过程：命中就复用，失效就重建。Vite 用依赖列表、lockfile、"),l("code",null,"optimizeDeps"),e(" 配置、"),l("code",null,"NODE_ENV"),e(" 等一组输入来判定预构建缓存是否有效。边界：失效判断只覆盖它"),l("strong",null,"算进去"),e("的输入，手工改动的 "),l("code",null,"node_modules"),e("、本地 "),l("code",null,"link"),e(" 的包都不在其中，所以「改了没生效」时强制重算才是第一诊断手段。 ")],-1))]),_:1})}}}),Pn={class:"demo-card"},jn={class:"tab-bar"},On={key:0},Jn={class:"grid-2"},zn={class:"feature-icon"},Bn={class:"stat-fast"},Un={key:1},Nn={key:2},Fn={class:"code-editor"},qn={class:"mini-code"},Kn={key:3},Xn={class:"grid-2"},Wn={class:"editor-pane"},_n={class:"editor-header"},Gn=["disabled"],Yn={class:"editor-pane"},Zn={class:"editor-header"},Qn={class:"badge output-badge"},hn={class:"mini-code output-code"},lt=`<span style="color:#7c7c99">// vite.config.ts - esbuild 配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),  <span style="color:#7c7c99">// Vue JSX 支持</span>
  ],
  
  <span style="color:#7c7c99">// esbuild 全局配置</span>
  esbuild: {
    <span style="color:#7c7c99">// JSX 配置（React 风格）</span>
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    
    <span style="color:#7c7c99">// 目标环境</span>
    target: 'es2020',
    
    <span style="color:#7c7c99">// 构建时移除 console/debugger</span>
    pure: ['console.log', 'debugger'],
    
    <span style="color:#7c7c99">// 依赖预构建的 esbuild 选项</span>
  },
  
  optimizeDeps: {
    esbuildOptions: {
      <span style="color:#7c7c99">// 预构建专用配置</span>
      target: 'es2020',
    }
  }
})`,et=`<span style="color:#7c7c99">// tsconfig.json</span>
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",  <span style="color:#7c7c99">// JSX 保留给 Vite/esbuild</span>
    "esModuleInterop": true,
    "skipLibCheck": true,
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}`,nt=g({__name:"V18Esbuild",setup(a){const t=b("intro"),n=[{icon:"⚡",title:"极速编译",desc:"esbuild 用 Go 编写，比传统 JS 工具快 10-100 倍，毫秒级完成 TS/JSX 转换。"},{icon:"🎯",title:"TypeScript 支持",desc:"直接编译 .ts/.tsx 文件，只做类型擦除，不做类型检查（类型检查交给 IDE 或 tsc）。"},{icon:"🧩",title:"JSX 转换",desc:"支持 React JSX、Vue JSX 等多种 JSX 风格，可通过配置自定义 pragma 和 Fragment。"},{icon:"📦",title:"依赖预构建",desc:"Vite 使用 esbuild 进行依赖预构建，将 CommonJS/UMD 转换为 ESM 模块。"}],m=b(`// TypeScript 示例
interface User {
  id: number
  name: string
  email: string
}

function greet(user: User): string {
  const message: string = \`你好，\${user.name}！\`
  return message
}

const user: User = {
  id: 1,
  name: '小明',
  email: 'xiaoming@example.com'
}

console.log(greet(user))`),r=b(`// Vue JSX 示例
import { defineComponent, ref } from 'vue'

interface CounterProps {
  initialValue?: number
  title?: string
}

export default defineComponent({
  name: 'Counter',
  props: {
    initialValue: { type: Number, default: 0 },
    title: { type: String, default: '计数器' }
  },
  setup(props: CounterProps) {
    const count = ref(props.initialValue || 0)
    const increment = () => count.value++
    const decrement = () => count.value--
    
    return () => (
      <div class="counter-card">
        <h3>{props.title}</h3>
        <div class="count-display">{count.value}</div>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    )
  }
})`),c=P(()=>m.value.replace(/interface\s+\w+\s*\{[^}]*\}/g,"").replace(/:\s*\w+(\[\])?/g,"").replace(/<[^>]+>/g,"").replace(/^\s*\/\/.*$/gm,M=>M)),d=b([{name:"TypeScript 编译",esbuild:"12ms",webpack:"1,200ms",babel:"850ms"},{name:"JSX 转换",esbuild:"8ms",webpack:"650ms",babel:"420ms"},{name:"依赖预构建",esbuild:"230ms",webpack:"3,500ms",babel:"2,800ms"}]);let y=null;const k=b(!1);function A(){k.value=!0,y&&clearTimeout(y),y=window.setTimeout(()=>{k.value=!1},300)}return(M,s)=>(o(),p("div",Pn,[s[15]||(s[15]=l("h3",null,"V18 · esbuild 转换与 JSX/TS 处理",-1)),l("div",jn,[l("button",{class:v(["tab-btn",{active:t.value==="intro"}]),onClick:s[0]||(s[0]=u=>t.value="intro")},"核心特性",2),l("button",{class:v(["tab-btn",{active:t.value==="ts"}]),onClick:s[1]||(s[1]=u=>t.value="ts")},"TypeScript",2),l("button",{class:v(["tab-btn",{active:t.value==="jsx"}]),onClick:s[2]||(s[2]=u=>t.value="jsx")},"JSX 支持",2),l("button",{class:v(["tab-btn",{active:t.value==="demo"}]),onClick:s[3]||(s[3]=u=>t.value="demo")},"实时转换",2)]),t.value==="intro"?(o(),p("div",On,[l("div",Jn,[(o(),p(C,null,x(n,u=>l("div",{key:u.title,class:"feature-card"},[l("span",zn,i(u.icon),1),l("strong",null,i(u.title),1),l("p",null,[l("small",null,i(u.desc),1)])])),64))]),s[6]||(s[6]=l("h4",{style:{"margin-top":"12px"}},"性能对比",-1)),l("table",null,[s[5]||(s[5]=l("thead",null,[l("tr",null,[l("th",null,"任务"),l("th",null,"esbuild"),l("th",null,"webpack"),l("th",null,"babel")])],-1)),l("tbody",null,[(o(!0),p(C,null,x(d.value,u=>(o(),p("tr",{key:u.name},[l("td",null,[l("strong",null,i(u.name),1)]),l("td",null,[l("span",Bn,i(u.esbuild),1)]),l("td",null,[l("small",null,i(u.webpack),1)]),l("td",null,[l("small",null,i(u.babel),1)])]))),128))])]),s[7]||(s[7]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"注意："),e("esbuild 只做语法转换，不做类型检查。类型检查请使用 "),l("code",null,"tsc --noEmit"),e(" 或 IDE 的 TypeScript 支持。")])],-1))])):V("",!0),t.value==="ts"?(o(),p("div",Un,[l("pre",{class:"mini-code",innerHTML:lt}),s[8]||(s[8]=l("h4",{style:{"margin-top":"12px"}},"tsconfig 配置",-1)),l("pre",{class:"mini-code",innerHTML:et}),s[9]||(s[9]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"类型检查："),e("Vite 开发时不做类型检查以保证速度。建议在构建前或 CI 中运行 "),l("code",null,"vue-tsc --noEmit"),e(" 进行类型检查。")])],-1))])):V("",!0),t.value==="jsx"?(o(),p("div",Nn,[l("div",Fn,[s[10]||(s[10]=l("div",{class:"editor-header"},[l("span",null,"Vue JSX 示例"),l("span",{class:"badge"},".tsx")],-1)),l("pre",qn,[l("code",null,i(r.value),1)])]),s[11]||(s[11]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"Vue JSX 插件："),e("使用 "),l("code",null,"@vitejs/plugin-vue-jsx"),e(" 启用 Vue JSX 支持，支持 v-model、v-on 等指令的 JSX 写法。")])],-1))])):V("",!0),t.value==="demo"?(o(),p("div",Kn,[l("div",Xn,[l("div",Wn,[l("div",_n,[s[12]||(s[12]=l("span",null,"TypeScript 输入",-1)),l("button",{class:"transform-btn",onClick:A,disabled:k.value},i(k.value?"转换中...":"⚡ 转换"),9,Gn)]),z(l("textarea",{"onUpdate:modelValue":s[4]||(s[4]=u=>m.value=u),class:"code-textarea",onInput:A,spellcheck:"false"},null,544),[[B,m.value]])]),l("div",Yn,[l("div",Zn,[s[13]||(s[13]=l("span",null,"JavaScript 输出",-1)),l("span",Qn,i(k.value?"转换中":"已转换"),1)]),l("pre",hn,[l("code",null,i(c.value),1)])])]),s[14]||(s[14]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"体验："),e("在左侧编辑 TypeScript 代码，右侧实时显示转换后的 JavaScript。实际项目中 esbuild 转换发生在请求时，速度极快。")])],-1))])):V("",!0)]))}}),tt=E(nt,[["__scopeId","data-v-802efbde"]]),st={class:"lesson-figure"},ot=g({__name:"V18EsbuildArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("同一份 TypeScript，用 "),l("code",null,"tsc"),e(" 编译要等好几秒，而你在 Vite 里保存文件几乎立刻就热更新了。可与此同时你发现：代码里明明写着一个类型错误，开发服务器照样跑得好好的，页面也正常渲染。为什么它这么快，又为什么它「假装没看见」错误？ ")],-1)),n[2]||(n[2]=l("h2",null,"编译器职责边界",-1)),n[3]||(n[3]=l("p",null," 开发时每改一个文件，工具都得把 TypeScript 和 JSX 转成浏览器能跑的 JavaScript。转译本身没多难，难的是「顺带做多少事」：如果让一个全能编译器一次完成转译、类型检查、打包，它每次都要把整套类型系统重跑一遍，改一行就要等几秒。而热更新追求的是「保存即刷新」，这几秒的等待是不可接受的。 ",-1)),n[4]||(n[4]=l("p",null,[e(" 于是问题变成："),l("strong",null,"开发阶段真的需要每次转译都做完整类型检查吗？"),e("转译要的其实是「让代码能被浏览器执行」，而类型检查要的是「保证代码在类型上说得通」——这本来就是两件事，能不能把它们拆开？ ")],-1)),n[5]||(n[5]=l("h2",null,"类型擦除与转译",-1)),n[6]||(n[6]=l("p",null," 最直接的做法：只管转译，不管检查。把类型标注擦掉、把 JSX 转成函数调用、按目标环境降级语法，然后立刻交给浏览器。 ",-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"它换来了速度"),e("。esbuild 用 Go 编写、多个核心并行，比传统用 JavaScript 实现的转换工具快上一到两个数量级，模块请求能在毫秒级返回，这正是开场里「保存即刷新」的来源——它压根没做类型检查。 ")],-1)),n[8]||(n[8]=l("h2",null,"跳过类型检查",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,"不做类型检查，类型错误不会被拦截。你把一个字符串传进了只接受数字的函数，转译照样通过，直到运行时才炸。"),l("li",null,[e("它不认识某些 TypeScript 特性。"),l("code",null,"const enum"),e(" 跨模块的内联行为与 "),l("code",null,"tsc"),e(" 不同，用了可能在内联处取值异常。")]),l("li",null,[l("code",null,"export ="),e(" 与 "),l("code",null,"import ="),e(" 这种 CommonJS 风格的写法也不在其中。")]),l("li",null,[e("依赖装饰器元数据的框架会卡住：esbuild 不支持 "),l("code",null,"emitDecoratorMetadata"),e("，靠反射读类型的地方拿不到信息。")])],-1)),n[10]||(n[10]=l("h2",null,"双流水线分工",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「职责分离」。既然转译和检查是两件事，就把它们拆成两条独立流水线：esbuild 负责"),l("strong",null,"随时转译"),e("，追求快；类型检查交给 "),l("code",null,"vue-tsc --noEmit"),e("（或 "),l("code",null,"tsc --noEmit"),e("），追求准，放在构建前或 CI 里跑。这样开发不被检查拖慢，类型安全也不会丢。"),l("code",null,"package.json"),e(" 里把它接在 "),l("code",null,"build"),e(" 前面，或单独留一个 "),l("code",null,"type-check"),e(" 脚本给 CI。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「JSX 怎么转」。浏览器不认识 JSX 语法，esbuild 把它转成函数调用。经典模式会转成 "),l("code",null,"React.createElement(...)"),e("；在 Vue 里则配置 "),l("code",null,"jsxFactory: 'h'"),e("、"),l("code",null,"jsxFragment: 'Fragment'"),e("，再用 "),l("code",null,"jsxInject"),e(" 自动注入一行 "),l("code",null,"import { h, Fragment } from 'vue'"),e("，省去每个文件手写。"),l("code",null,"tsconfig.json"),e(" 里那把 "),l("code",null,"jsx"),e(" 设成 "),l("code",null,'"preserve"'),e("，意思就是「别让 "),l("code",null,"tsc"),e(" 动 JSX，保留原样交给 Vite/esbuild 处理」。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「按目标降级」。"),l("code",null,"target"),e(" 决定语法降级到哪个版本，比如 "),l("code",null,"es2020"),e("；"),l("code",null,"drop: ['console', 'debugger']"),e(" 让构建时把调试代码抹掉；"),l("code",null,"platform"),e(" 区分 "),l("code",null,"browser"),e(" / "),l("code",null,"node"),e(" / "),l("code",null,"neutral"),e("。这是一处权衡："),l("strong",null,"目标越现代，产物越小、跑得越快，但能兼容的浏览器越窄"),e("，要按你的用户来决定。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 最后补「遇到不支持的 TS 特性怎么办」。思路是"),l("strong",null,"顺着 esbuild 能理解的语法写"),e("："),l("code",null,"const enum"),e(" 换成普通 "),l("code",null,"enum"),e("；"),l("code",null,"export ="),e(" / "),l("code",null,"import ="),e(" 改成 ES Module 语法；依赖 "),l("code",null,"emitDecoratorMetadata"),e(" 的场景，转交给 Babel 插件链或官方插件处理。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条必记的线："),e("转译通过"),l("strong",null,"不等于"),e("类型正确，构建成功也别当类型没问题——类型回归得靠 "),l("code",null,"vue-tsc --noEmit"),e(" 在构建前或 CI 里拦；写代码时避开 "),l("code",null,"const enum"),e("、"),l("code",null,"export ="),e(" 与装饰器元数据这几类 esbuild 不支持的写法。 ")],-1)),n[16]||(n[16]=l("h2",null,"实时转译观测",-1)),l("figure",st,[n[0]||(n[0]=l("figcaption",null,"切 核心特性 / TypeScript / JSX / 实时转换 四个页签，在「实时转换」里编辑左侧的 TypeScript，看右侧怎样一层层剥掉类型标注、只留下能跑的 JavaScript。",-1)),I(tt)]),n[17]||(n[17]=l("h2",null,"速度与类型安全",-1)),n[18]||(n[18]=l("p",null,[e(" Vite 之所以快，是因为 esbuild 走的是一条「只转译、不检查」的快速通道：擦掉类型、转好 JSX、按目标降级，然后立刻交给浏览器。类型安全则交给 "),l("code",null,"vue-tsc"),e(" 在另一条线上把关。把这两件事彻底分开，再用能兼容的语法避开 esbuild 的盲区，速度与正确性就能同时拿到。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「类型擦除（type erasure）」"),e("指转译时把 TypeScript 的类型标注、"),l("code",null,"interface"),e(" 等只在编译期存在的信息整段删掉，产出不含任何类型信息的 JavaScript。esbuild 的转译本质就是类型擦除加语法降级。边界：擦除之后类型在运行时"),l("strong",null,"完全不存在"),e("，任何靠类型做运行时判断的写法都得不到信息；也正因为不做检查，类型错误只会在独立跑 "),l("code",null,"tsc"),e(" / "),l("code",null,"vue-tsc"),e(" 时才暴露。 ")],-1))]),_:1})}}}),ut={class:"demo-card"},it={class:"tab-bar"},dt={key:0},rt={key:1},pt={class:"filter-bar"},at={class:"hooks-list"},mt=["onClick"],ct={class:"hook-phase"},vt={class:"hook-name"},gt={key:0,class:"hook-desc"},ft={key:2},bt={key:3},yt={class:"demo-panel"},St={class:"demo-toolbar"},Vt={class:"demo-title"},Ct={class:"demo-stats"},xt={class:"stat-item"},kt={class:"stat-value"},Mt={class:"stat-item"},$t={class:"stat-value highlight"},Tt={class:"file-list"},Et={class:"file-icon"},Rt={class:"file-name"},Lt={class:"file-size"},It={key:0,class:"empty-state"},wt=`<span style="color:#7c7c99">// vite-plugin-file-info.ts</span>
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
<span style="color:#7c7c99">// plugins: [vue(), fileInfo()]</span>`,Dt=`<span style="color:#7c7c99">// vite.config.ts - 插件配置</span>
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
})`,Ht=g({__name:"V19RollupPlugin",setup(a){const t=b("intro"),n=[{phase:"开发服务器",hook:"configureServer",desc:"配置开发服务器，添加中间件等",type:"vite"},{phase:"开发服务器",hook:"handleHotUpdate",desc:"自定义 HMR 更新逻辑",type:"vite"},{phase:"配置阶段",hook:"config",desc:"修改 Vite 配置",type:"vite"},{phase:"配置阶段",hook:"configResolved",desc:"获取最终解析后的配置",type:"vite"},{phase:"构建阶段",hook:"options",desc:"替换或操作 rollup 选项",type:"rollup"},{phase:"构建阶段",hook:"buildStart",desc:"构建开始时调用",type:"rollup"},{phase:"构建阶段",hook:"resolveId",desc:"自定义模块解析",type:"rollup"},{phase:"构建阶段",hook:"load",desc:"自定义模块加载",type:"rollup"},{phase:"构建阶段",hook:"transform",desc:"转换模块内容",type:"rollup"},{phase:"构建阶段",hook:"buildEnd",desc:"构建结束时调用",type:"rollup"},{phase:"输出阶段",hook:"outputOptions",desc:"替换或操作输出选项",type:"rollup"},{phase:"输出阶段",hook:"generateBundle",desc:"生成 bundle 时调用",type:"rollup"},{phase:"输出阶段",hook:"writeBundle",desc:"写入 bundle 后调用",type:"rollup"},{phase:"输出阶段",hook:"closeBundle",desc:"关闭 bundle 时调用",type:"rollup"}],m=b(null),r=b({name:"vite-plugin-file-info",enabled:!0,transformCount:0,files:[]}),c=[{name:"App.vue",size:"2.4 KB"},{name:"main.ts",size:"0.8 KB"},{name:"components/Button.vue",size:"3.2 KB"},{name:"components/Card.vue",size:"2.1 KB"},{name:"views/Home.vue",size:"5.6 KB"},{name:"stores/user.ts",size:"1.9 KB"},{name:"utils/request.ts",size:"1.2 KB"}];function d(){r.value.transformCount=0,r.value.files=[];let M=0;const s=J(()=>{if(M>=c.length){clearInterval(s);return}const u=c[M],S=u.name.endsWith(".vue")||u.name.endsWith(".ts");r.value.files.push({...u,transformed:S}),S&&r.value.transformCount++,M++},300)}function y(){r.value.transformCount=0,r.value.files=[]}const k=b("all"),A=P(()=>k.value==="all"?n:n.filter(M=>M.type===k.value));return(M,s)=>(o(),p("div",ut,[s[15]||(s[15]=l("h3",null,"V19 · Rollup 插件兼容与构建钩子",-1)),l("div",it,[l("button",{class:v(["tab-btn",{active:t.value==="intro"}]),onClick:s[0]||(s[0]=u=>t.value="intro")},"插件简介",2),l("button",{class:v(["tab-btn",{active:t.value==="hooks"}]),onClick:s[1]||(s[1]=u=>t.value="hooks")},"钩子列表",2),l("button",{class:v(["tab-btn",{active:t.value==="custom"}]),onClick:s[2]||(s[2]=u=>t.value="custom")},"自定义插件",2),l("button",{class:v(["tab-btn",{active:t.value==="demo"}]),onClick:s[3]||(s[3]=u=>t.value="demo")},"交互演示",2)]),t.value==="intro"?(o(),p("div",dt,[s[7]||(s[7]=U('<div class="intro-section" data-v-aebb0c88><h4 data-v-aebb0c88>Vite 插件 = Rollup 插件 + Vite 扩展</h4><p class="intro-text" data-v-aebb0c88>Vite 插件系统基于 Rollup 插件接口扩展，兼容大多数 Rollup 插件，同时提供 Vite 特有的钩子。</p><div class="grid-2" data-v-aebb0c88><div class="compare-card" data-v-aebb0c88><div class="card-header vite" data-v-aebb0c88><span class="card-icon" data-v-aebb0c88>⚡</span><strong data-v-aebb0c88>Vite 特有钩子</strong></div><ul class="card-list" data-v-aebb0c88><li data-v-aebb0c88>config - 修改配置</li><li data-v-aebb0c88>configResolved - 配置解析后</li><li data-v-aebb0c88>configureServer - 开发服务器</li><li data-v-aebb0c88>transformIndexHtml - 转换 HTML</li><li data-v-aebb0c88>handleHotUpdate - HMR 处理</li></ul></div><div class="compare-card" data-v-aebb0c88><div class="card-header rollup" data-v-aebb0c88><span class="card-icon" data-v-aebb0c88>📦</span><strong data-v-aebb0c88>Rollup 通用钩子</strong></div><ul class="card-list" data-v-aebb0c88><li data-v-aebb0c88>options - 构建选项</li><li data-v-aebb0c88>resolveId - 模块解析</li><li data-v-aebb0c88>load - 模块加载</li><li data-v-aebb0c88>transform - 代码转换</li><li data-v-aebb0c88>generateBundle - 生成产物</li></ul></div></div></div><h4 style="margin-top:12px;" data-v-aebb0c88>配置示例</h4>',2)),l("pre",{class:"mini-code",innerHTML:Dt}),s[8]||(s[8]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"兼容性："),e("绝大多数 Rollup 插件可以直接在 Vite 中使用，但只在生产构建时生效。开发阶段 Vite 使用 esbuild，部分 Rollup 钩子不会被调用。")])],-1))])):V("",!0),t.value==="hooks"?(o(),p("div",rt,[l("div",pt,[s[9]||(s[9]=l("span",null,"筛选：",-1)),l("button",{class:v({active:k.value==="all"}),onClick:s[4]||(s[4]=u=>k.value="all")},"全部",2),l("button",{class:v({active:k.value==="vite"}),onClick:s[5]||(s[5]=u=>k.value="vite")},"Vite 特有",2),l("button",{class:v({active:k.value==="rollup"}),onClick:s[6]||(s[6]=u=>k.value="rollup")},"Rollup 通用",2)]),l("div",at,[(o(!0),p(C,null,x(A.value,u=>(o(),p("div",{key:u.hook,class:v(["hook-item",{[u.type]:!0,selected:m.value===u.hook}]),onClick:S=>m.value=m.value===u.hook?null:u.hook},[l("span",ct,i(u.phase),1),l("code",vt,i(u.hook),1),l("span",{class:v(["hook-type-badge",u.type])},i(u.type==="vite"?"Vite":"Rollup"),3),m.value===u.hook?(o(),p("p",gt,i(u.desc),1)):V("",!0)],10,mt))),128))]),s[10]||(s[10]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"提示："),e("点击钩子项可查看详细说明。Vite 特有钩子在开发和构建阶段都可能调用，Rollup 钩子主要在生产构建时调用。")])],-1))])):V("",!0),t.value==="custom"?(o(),p("div",ft,[l("pre",{class:"mini-code",innerHTML:wt}),s[11]||(s[11]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"插件约定："),e("插件函数返回一个包含 name 和各种钩子的对象。name 是插件的唯一标识，用于日志和错误提示。")])],-1))])):V("",!0),t.value==="demo"?(o(),p("div",bt,[l("div",yt,[l("div",St,[l("span",Vt,"🔌 "+i(r.value.name),1),l("div",{class:"controls"},[l("button",{class:"action-btn primary",onClick:d},"▶ 运行插件"),l("button",{class:"action-btn",onClick:y},"↺ 重置")])]),l("div",Ct,[l("div",xt,[l("span",kt,i(r.value.files.length),1),s[12]||(s[12]=l("span",{class:"stat-label"},"处理文件数",-1))]),l("div",Mt,[l("span",$t,i(r.value.transformCount),1),s[13]||(s[13]=l("span",{class:"stat-label"},"transform 触发",-1))])]),l("div",Tt,[(o(!0),p(C,null,x(r.value.files,(u,S)=>(o(),p("div",{key:u.name,class:"file-item",style:O({animationDelay:S*.1+"s"})},[l("span",Et,i(u.name.endsWith(".vue")?"🟢":"🔵"),1),l("span",Rt,i(u.name),1),l("span",Lt,i(u.size),1),l("span",{class:v(["file-status",{transformed:u.transformed}])},i(u.transformed?"transform ✓":"跳过"),3)],4))),128)),r.value.files.length===0?(o(),p("div",It," 点击「运行插件」开始模拟 ")):V("",!0)])]),s[14]||(s[14]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"观察："),e("插件只处理 .vue 和 .ts 文件，在 transform 钩子中统计文件行数。实际开发中可以利用钩子做代码注入、资源处理、性能监控等。")])],-1))])):V("",!0)]))}}),At=E(Ht,[["__scopeId","data-v-aebb0c88"]]),Pt={class:"lesson-figure"},jt=g({__name:"V19RollupPluginArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你按文档装了 "),l("code",null,"rollup-plugin-visualizer"),e("，想在开发时随时看看体积。结果本地跑了一下午，终端一条日志都没有，报告文件也没生成；直到你执行一次 "),l("code",null,"vite build"),e("，报告立刻出现在 "),l("code",null,"dist"),e(" 里。同一份配置、同一个插件，为什么它在开发时「隐身」了？ ")],-1)),n[2]||(n[2]=l("h2",null,"生态插件复用",-1)),n[3]||(n[3]=l("p",null," 你要在产物上加一道处理——生成体积报告、压缩图片、产出清单——而社区里早就有人把它写成了 Rollup 插件。可 Vite 的开发服务器根本不是 Rollup 在跑：开发阶段它基于原生 ESM 按需转换，只有生产构建才切换到 Rollup。 ",-1)),n[4]||(n[4]=l("p",null,[e(" 如果为了同时支持两个阶段，就分别写两套插件，人要付出的隐藏成本是：逻辑重复维护两遍，两边的行为还容易悄悄跑偏；生态里现成的 Rollup 插件全都用不上，每个功能都从零写。于是问题落在："),l("strong",null,"一套插件接口，怎么同时服务「开发服务器」和「生产构建」这两个形态完全不同的阶段？")],-1)),n[5]||(n[5]=l("h2",null,"插件接口兼容",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：让 Vite 直接兼容 Rollup 的插件接口，Rollup 插件原样塞进 "),l("code",null,"plugins"),e(" 数组就能用。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"生态复用"),e("。Rollup 上已经成熟的插件不用重写，拿来即用；你不必学两套体系，只学一套就能同时理解两边的插件。 ")],-1)),n[8]||(n[8]=l("h2",null,"产物钩子缺位",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("并不是所有钩子在两个阶段都会被调用。依赖「产物」的钩子——比如 "),l("code",null,"generateBundle"),e("、"),l("code",null,"writeBundle"),e("——只在构建时触发，开发时自然一声不响。这正是开场里插件「隐身」的原因。")]),l("li",null,[e("开发阶段 Vite 用 esbuild 做转换，与 Rollup 的 "),l("code",null,"transform"),e(" 路径并不完全等同，部分插件在 dev 下行为会和 build 不一致。")]),l("li",null,"一个只在构建才需要的重插件，如果无条件挂上，会把开发启动也一起拖慢。"),l("li",null,"分不清哪些钩子属于 Vite、哪些属于 Rollup，就很容易把逻辑写在错误的阶段，调试时一头雾水。")],-1)),n[10]||(n[10]=l("h2",null,"两类钩子归属",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「钩子分两类」。Vite 特有钩子服务于开发服务器与 HTML/HMR："),l("code",null,"config"),e("、"),l("code",null,"configResolved"),e("、"),l("code",null,"configureServer"),e("、"),l("code",null,"transformIndexHtml"),e("、"),l("code",null,"handleHotUpdate"),e("。Rollup 兼容钩子服务于模块与产物："),l("code",null,"resolveId"),e("、"),l("code",null,"load"),e("、"),l("code",null,"transform"),e(" 在开发和构建都会跑；而 "),l("code",null,"options"),e("、"),l("code",null,"buildStart"),e("、"),l("code",null,"generateBundle"),e("、"),l("code",null,"writeBundle"),e("、"),l("code",null,"closeBundle"),e(" 这批「产物类」钩子只在构建时跑。记住这条分界，就能解释插件为什么会在某个阶段沉默。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「用 "),l("code",null,"apply"),e(" 控制生效阶段」。插件对象可以声明 "),l("code",null,"apply: 'serve'"),e(" 只在开发生效，或 "),l("code",null,"apply: 'build'"),e(" 只在构建生效；也可以写成一个函数 "),l("code",null,"apply(config, { command })"),e(" 返回布尔值，按条件决定挂不挂。这样，开场那个只在构建产出报告的插件，就该标上 "),l("code",null,"apply: 'build'"),e("，开发它本就不该介入。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「执行顺序」。当多个插件都想改写同一段代码，谁先谁后就有讲究了。同一个插件数组里，标了 "),l("code",null,"enforce: 'pre'"),e(" 的排在最前，普通插件居中，标了 "),l("code",null,"enforce: 'post'"),e(" 的排在最后。理解这个顺序，转换才能按你预期一层层叠上去，而不是被别人的输出盖掉。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 最后补「写一个两边都用的通用插件」。一个插件完全可以两种钩子都用：用 Vite 特有钩子做开发侧的事（比如 "),l("code",null,"configureServer"),e(" 挂个中间件），用 Rollup 钩子做构建侧的事（比如 "),l("code",null,"transform"),e(" 改代码、"),l("code",null,"generateBundle"),e(" 统计产物）。两边各司其职，互不干扰，一个插件就同时服务了两个阶段。 ")],-1)),n[15]||(n[15]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),e("产物类钩子只在构建触发，开发时别指望它们有反应；接入社区插件前先核对它支持的最低 Vite 版本、以及是否需要限定阶段，用 "),l("code",null,"apply"),e(" 或条件判断把「只在 build 用」的重插件挡在 dev 之外，避免拖慢开发。 ")],-1)),n[16]||(n[16]=l("h2",null,"筛选钩子分类",-1)),l("figure",Pt,[n[0]||(n[0]=l("figcaption",null,[e("切 插件简介 / 钩子列表 / 自定义插件 / 交互演示 四个页签，在钩子列表里用「Vite 特有 / Rollup 通用」筛选，点开每一项看它属于哪个阶段；再运行插件演示，看哪些文件触发 "),l("code",null,"transform"),e("、哪些被跳过。")],-1)),I(At)]),n[17]||(n[17]=l("h2",null,"钩子体系构成",-1)),n[18]||(n[18]=l("p",null,[e(" Vite 的插件系统就是「Rollup 插件 + Vite 扩展」：Rollup 钩子负责构建期的模块处理与产物生成，Vite 独有钩子负责开发服务器、HTML 与 HMR；再用 "),l("code",null,"apply"),e(" 与 "),l("code",null,"enforce"),e(" 把插件放到正确的阶段和顺序上。这样既能白拿整个 Rollup 生态，又不会让「只在构建用」的东西拖慢开发。 ")],-1)),n[19]||(n[19]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「插件钩子（plugin hook）」"),e("指插件对象上的一组约定方法，由 Rollup/Vite 在生命周期的特定时点回调，用来插入自定义逻辑；钩子分同步、异步、串行、并行等调用约定。边界：钩子的触发时机与所属阶段绑定——Rollup 兼容钩子在开发模式下"),l("strong",null,"并非全部执行"),e("（如 "),l("code",null,"generateBundle"),e(" 只在 build 触发），所以绝不能假设某个钩子在两种模式下都会跑。 ")],-1))]),_:1})}}}),Ot={class:"demo-card"},Jt={class:"tab-bar"},zt={key:0},Bt={class:"grid-2"},Ut=["onClick"],Nt={class:"format-icon"},Ft={class:"format-ext"},qt={class:"publish-steps"},Kt={class:"step-num"},Xt={class:"step-content"},Wt={key:0},_t={key:1},Gt={key:1},Yt={key:2},Zt={key:3},Qt={class:"build-demo"},ht={class:"build-header"},ls=["disabled"],es={key:0,class:"build-progress"},ns={class:"progress-track"},ts={class:"progress-text"},ss={key:1,class:"output-section"},os={class:"output-list"},us={class:"file-icon"},is={class:"file-name"},ds={class:"file-size"},rs={class:"format-tag"},ps={key:2,class:"empty-state"},as=`<span style="color:#7c7c99">// vite.config.ts - 库模式配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    <span style="color:#7c7c99">// 启用库模式</span>
    lib: {
      <span style="color:#7c7c99">// 入口文件</span>
      entry: resolve(__dirname, 'src/index.ts'),
      
      <span style="color:#7c7c99">// 库名（UMD/IIFE 时的全局变量名）</span>
      name: 'MyComponentLib',
      
      <span style="color:#7c7c99">// 输出格式，支持数组指定多种</span>
      formats: ['es', 'cjs', 'umd'],
      
      <span style="color:#7c7c99">// 输出文件名（可选）</span>
      fileName: (format) => \`my-lib.\${format}.js\`,
    },
    
    rollupOptions: {
      <span style="color:#7c7c99">// 外部化依赖，不打包进库中</span>
      external: ['vue', 'vue-router'],
      
      output: {
        <span style="color:#7c7c99">// UMD/IIFE 格式下的全局变量映射</span>
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
      },
    },
    
    <span style="color:#7c7c99">// 是否生成 source map</span>
    sourcemap: true,
    
    <span style="color:#7c7c99">// 清空输出目录</span>
    emptyOutDir: true,
  },
})`,ms=`<span style="color:#7c7c99">// package.json 配置</span>
{
  "name": "my-component-lib",
  "version": "1.0.0",
  "type": "module",
  
  <span style="color:#7c7c99">// 入口文件声明</span>
  "main": "./dist/my-lib.cjs.js",    <span style="color:#7c7c99">// CommonJS</span>
  "module": "./dist/my-lib.es.js",   <span style="color:#7c7c99">// ES Module</span>
  "unpkg": "./dist/my-lib.umd.js",   <span style="color:#7c7c99">// UMD for CDN</span>
  "jsdelivr": "./dist/my-lib.umd.js",
  
  <span style="color:#7c7c99">// TypeScript 类型声明</span>
  "types": "./dist/index.d.ts",
  
  <span style="color:#7c7c99">// 导出映射（推荐）</span>
  "exports": {
    ".": {
      "import": "./dist/my-lib.es.js",
      "require": "./dist/my-lib.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  
  <span style="color:#7c7c99">// 发布到 npm 的文件</span>
  "files": ["dist"],
  
  <span style="color:#7c7c99">// peerDependencies</span>
  "peerDependencies": {
    "vue": "^3.3.0"
  }
}`,cs=`<span style="color:#7c7c99">// src/index.ts - 库入口文件</span>
import type { App } from 'vue'
import Button from './components/Button.vue'
import Card from './components/Card.vue'
import Input from './components/Input.vue'

<span style="color:#7c7c99">// 单独导出组件</span>
export { Button, Card, Input }

<span style="color:#7c7c99">// 导出类型</span>
export type { ButtonProps, CardProps } from './types'

<span style="color:#7c7c99">// 默认导出插件形式</span>
export default {
  install(app: App) {
    app.component('MyButton', Button)
    app.component('MyCard', Card)
    app.component('MyInput', Input)
  }
}`,vs=g({__name:"V20LibraryMode",setup(a){const t=b("intro"),n=[{name:"ES Module",ext:".es.js",icon:"📦",desc:"现代 ESM 格式，支持 Tree Shaking，推荐用于现代打包工具"},{name:"CommonJS",ext:".cjs.js",icon:"📄",desc:"Node.js 传统格式，用于 require() 引入"},{name:"UMD",ext:".umd.js",icon:"🌐",desc:"通用格式，可直接在浏览器通过 script 标签使用"},{name:"IIFE",ext:".iife.js",icon:"⚡",desc:"立即执行函数，适合直接在浏览器引用的单文件"}],m=b("es"),r=b({isBuilding:!1,progress:0,outputFiles:[],currentStep:""}),c=["🔍 解析入口文件...","📦 打包组件源码...","🎨 处理样式文件...","🏷️  生成类型声明...","📝 生成 ES Module 格式...","📝 生成 CommonJS 格式...","📝 生成 UMD 格式...","✅ 构建完成！"],d=[{name:"my-lib.es.js",size:"45.2 KB",format:"es"},{name:"my-lib.cjs.js",size:"47.8 KB",format:"cjs"},{name:"my-lib.umd.js",size:"52.1 KB",format:"umd"},{name:"style.css",size:"8.3 KB",format:"css"},{name:"index.d.ts",size:"3.1 KB",format:"types"}];async function y(){if(!r.value.isBuilding){r.value.isBuilding=!0,r.value.progress=0,r.value.outputFiles=[],r.value.currentStep=c[0];for(let s=0;s<c.length;s++){if(await new Promise(u=>setTimeout(u,400+Math.random()*300)),r.value.currentStep=c[s],r.value.progress=(s+1)/c.length*100,s>=4&&s<=6){const u=s-4;d[u]&&r.value.outputFiles.push(d[u])}s===6&&(r.value.outputFiles.push(d[3]),r.value.outputFiles.push(d[4]))}setTimeout(()=>{r.value.isBuilding=!1},500)}}function k(s){return{es:"📦",cjs:"📄",umd:"🌐",css:"🎨",types:"🏷️"}[s]||"📁"}function A(s){return{es:"ES Module",cjs:"CommonJS",umd:"UMD",css:"样式",types:"类型声明"}[s]||s}const M=[{step:1,title:"构建库",desc:"npm run build",cmd:!0},{step:2,title:"登录 npm",desc:"npm login",cmd:!0},{step:3,title:"检查包名",desc:"确保包名唯一且符合规范",cmd:!1},{step:4,title:"发布包",desc:"npm publish",cmd:!0},{step:5,title:"验证安装",desc:"npm install your-package",cmd:!0}];return(s,u)=>(o(),p("div",Ot,[u[12]||(u[12]=l("h3",null,"V20 · 库模式与组件打包发布",-1)),l("div",Jt,[l("button",{class:v(["tab-btn",{active:t.value==="intro"}]),onClick:u[0]||(u[0]=S=>t.value="intro")},"输出格式",2),l("button",{class:v(["tab-btn",{active:t.value==="config"}]),onClick:u[1]||(u[1]=S=>t.value="config")},"配置示例",2),l("button",{class:v(["tab-btn",{active:t.value==="package"}]),onClick:u[2]||(u[2]=S=>t.value="package")},"package.json",2),l("button",{class:v(["tab-btn",{active:t.value==="demo"}]),onClick:u[3]||(u[3]=S=>t.value="demo")},"构建演示",2)]),t.value==="intro"?(o(),p("div",zt,[u[4]||(u[4]=l("p",{class:"intro-text"}," Vite 库模式用于打包组件库、工具函数等，支持多种输出格式，可发布到 npm 供其他项目使用。 ",-1)),l("div",Bt,[(o(),p(C,null,x(n,(S,H)=>l("div",{key:S.name,class:v(["format-card",{selected:m.value===["es","cjs","umd","iife"][H]}]),onClick:f=>m.value=["es","cjs","umd","iife"][H]},[l("span",Nt,i(S.icon),1),l("strong",null,i(S.name),1),l("code",Ft,i(S.ext),1),l("p",null,[l("small",null,i(S.desc),1)])],10,Ut)),64))]),u[5]||(u[5]=l("h4",{style:{"margin-top":"12px"}},"发布流程",-1)),l("div",qt,[(o(),p(C,null,x(M,S=>l("div",{key:S.step,class:"publish-step"},[l("span",Kt,i(S.step),1),l("div",Xt,[l("strong",null,i(S.title),1),S.cmd?(o(),p("code",Wt,i(S.desc),1)):(o(),p("small",_t,i(S.desc),1))])])),64))])])):V("",!0),t.value==="config"?(o(),p("div",Gt,[l("pre",{class:"mini-code",innerHTML:as}),u[6]||(u[6]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"关键点："),e("使用 "),l("code",null,"build.lib"),e(" 启用库模式，"),l("code",null,"external"),e(" 外部化 vue 等依赖（避免重复打包），"),l("code",null,"globals"),e(" 为 UMD 格式指定全局变量名。")])],-1)),u[7]||(u[7]=l("h4",{style:{"margin-top":"12px"}},"入口文件示例",-1)),l("pre",{class:"mini-code",innerHTML:cs})])):V("",!0),t.value==="package"?(o(),p("div",Yt,[l("pre",{class:"mini-code",innerHTML:ms}),u[8]||(u[8]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"推荐配置："),e("使用 "),l("code",null,"exports"),e(" 字段声明导出，比 main/module 更灵活。"),l("code",null,"peerDependencies"),e(" 声明依赖的宿主库版本范围。")])],-1))])):V("",!0),t.value==="demo"?(o(),p("div",Zt,[l("div",Qt,[l("div",ht,[u[9]||(u[9]=l("span",{class:"build-title"},"🏗️ 库模式构建模拟器",-1)),l("button",{class:"action-btn primary",disabled:r.value.isBuilding,onClick:y},i(r.value.isBuilding?"构建中...":"▶ 开始构建"),9,ls)]),r.value.isBuilding||r.value.progress>0?(o(),p("div",es,[l("div",ns,[l("div",{class:"progress-fill",style:O({width:r.value.progress+"%"})},null,4)]),l("span",ts,i(r.value.currentStep),1)])):V("",!0),r.value.outputFiles.length>0?(o(),p("div",ss,[u[10]||(u[10]=l("h5",null,"📁 输出文件 (dist/)",-1)),l("ul",os,[(o(!0),p(C,null,x(r.value.outputFiles,S=>(o(),p("li",{key:S.name,class:"output-item"},[l("span",us,i(k(S.format)),1),l("span",is,i(S.name),1),l("span",ds,i(S.size),1),l("span",rs,i(A(S.format)),1)]))),128))])])):V("",!0),r.value.outputFiles.length===0&&!r.value.isBuilding?(o(),p("div",ps," 点击「开始构建」模拟库模式打包过程 ")):V("",!0)]),u[11]||(u[11]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"实际项目："),e("运行 "),l("code",null,"vite build"),e(" 后，dist 目录会生成多种格式的产物、样式文件和类型声明（需配置 vite-plugin-dts）。")])],-1))])):V("",!0)]))}}),gs=E(vs,[["__scopeId","data-v-b796bc4f"]]),fs={class:"lesson-figure"},bs=g({__name:"V20LibraryModeArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你的组件库发到了 npm，同事只想用其中的一个 "),l("code",null,"Button"),e("。他写下 "),l("code",null,"import { Button } from '@my-org/ui-lib/button'"),e("，Vite 当场报 "),l("code",null,"Failed to resolve entry for package"),e("——"),l("code",null,"button"),e(" 明明就在包里，为什么这个子路径解析不了？ ")],-1)),n[2]||(n[2]=l("h2",null,"按需引入子路径",-1)),n[3]||(n[3]=l("p",null,[e(" 你已经知道库要一次输出多种格式、把 "),l("code",null,"vue"),e(" 外部化。可一个库长大后会被拆成很多块，使用者往往只想按需引其中一小片；而安装到别人机器上时，构建工具手里只有一个包名，它得靠 "),l("code",null,"package.json"),e(" 的字段决定「这个路径该去取哪个文件」。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 如果只产出「整包一个入口」，人要付出的隐藏成本是：使用者没法按子路径引，只能整包引入再指望 Tree Shaking 兜底，包一大就救不回来；多种格式的文件名和入口字段对不上，使用方一装就报「找不到模块」；框架依赖没声明清楚，使用方可能重复安装甚至整出多实例；发布时没配清单，源码、测试、配置一起被推上 npm。于是问题落在："),l("strong",null,"怎么让一个包的产物能被「按入口、按格式、按依赖关系」正确地引用？")],-1)),n[5]||(n[5]=l("h2",null,"单入口输出局限",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：用 "),l("code",null,"build.lib"),e(" 配一个入口、几样格式，把 "),l("code",null,"dist"),e(" 发出去。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"库变成了一个可以被安装的包"),e("，整包 "),l("code",null,"import"),e(" 这一条路是通的。 ")],-1)),n[8]||(n[8]=l("h2",null,"子路径解析失败",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,[e("子路径不可达：包里只有整包入口，"),l("code",null,"@my-org/ui-lib/button"),e(" 这类路径找不到任何文件，于是报 "),l("code",null,"Failed to resolve entry"),e("。")]),l("li",null,[e("条件导出缺失："),l("code",null,"exports"),e(" 没写，Node 与现代打包器只能回退到 "),l("code",null,"main"),e(" / "),l("code",null,"module"),e("，取到的格式可能和当前运行环境对不上。")]),l("li",null,[l("code",null,"external"),e(" 只做了一半：它让 "),l("code",null,"vue"),e(" 不进产物，可使用方要是根本没装 "),l("code",null,"vue"),e("（或装了个错版本），运行时还是一样找不到。")]),l("li",null,[e("发布清单失控：没配 "),l("code",null,"files"),e("，"),l("code",null,"src"),e("、测试、配置文件全被打进包里，体积和暴露面都白白变大。")])],-1)),n[10]||(n[10]=l("h2",null,"对象式入口映射",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「多入口」。"),l("code",null,"build.lib.entry"),e(" 除了传字符串，还可以传一个对象，"),l("strong",null,"键名就是入口名、也就是子路径名"),e("——比如 "),l("code",null,"index"),e(" 指向主入口、"),l("code",null,"button"),e(" 指向 "),l("code",null,"Button"),e(" 的入口文件。再配一个 "),l("code",null,"fileName(format, entryName)"),e("，让每个入口按各自格式产出自己的文件（如 "),l("code",null,"button.mjs"),e(" / "),l("code",null,"button.cjs"),e("）。这样 "),l("code",null,"./button"),e(" 这条子路径就有实体文件可指了。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「条件导出把入口和子路径串起来」。"),l("code",null,"package.json"),e(" 的 "),l("code",null,"exports"),e(" 用条件映射，把每条路径对应到正确的文件："),l("code",null,'"."'),e(" 同时给出 "),l("code",null,"import"),e(" / "),l("code",null,"require"),e(" / "),l("code",null,"types"),e("，"),l("code",null,'"./button"'),e(" 指向对应的 "),l("code",null,".mjs"),e(" 与 "),l("code",null,".cjs"),e("，"),l("code",null,'"./style.css"'),e(" 指向样式文件。这里有个顺序要求："),l("code",null,"types"),e(" 条件要写在前面，否则 TypeScript 解析不到类型。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「"),l("code",null,"external"),e(" 与 "),l("code",null,"peerDependencies"),e(" 是一对」。"),l("code",null,"external"),e(" 让框架依赖不进产物，避免多实例；"),l("code",null,"peerDependencies"),e(" 声明它「由使用方提供、版本范围是这些」——两者必须配套：只 "),l("code",null,"external"),e(" 不声明，使用方可能不知道要装；只声明不 "),l("code",null,"external"),e("，包又会自带一份。UMD 场景还要在 "),l("code",null,"output.globals"),e(" 里把模块名映射成全局变量名。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 再补「CSS 与类型声明也是产物」。库的 CSS 会单独产出一个文件，可以用 "),l("code",null,"assetFileNames"),e(" 把它重命名成 "),l("code",null,"index.css"),e(" 并把路径写进文档；类型声明 Rollup 不会自动生成，要用 "),l("code",null,"vite-plugin-dts"),e(" 产出 "),l("code",null,".d.ts"),e("，并让 "),l("code",null,"exports"),e(" 的 "),l("code",null,"types"),e(" 指过去。为什么强调这两样？因为使用者看不到你的源码，只能靠「入口文件 + 类型 + CSS 路径」这三张路标找到路。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「发布前用 "),l("code",null,"npm pack"),e(" 验收」。它会打出 tar 包但不真正发布，正好用来先看一眼"),l("strong",null,"究竟会发出去哪些文件"),e("；再用 "),l("code",null,'files: ["dist"]'),e(" 把范围收干净；把构建、类型检查、打包串进 "),l("code",null,"prepublishOnly"),e(" 钩子，避免把一个没构建或类型有错的版本推上去。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条必守的线："),l("code",null,"external"),e(" 管「不打包」，"),l("code",null,"peerDependencies"),e(" 管「由谁提供」，缺一个都会出问题；"),l("code",null,"exports"),e(" 的 "),l("code",null,"types"),e(" 条件要放在 "),l("code",null,"import"),e(" / "),l("code",null,"require"),e(" 之前，而且没有在 "),l("code",null,"exports"),e(" 里登记的子路径，使用者根本 import 不进来。 ")],-1)),n[17]||(n[17]=l("h2",null,"多格式构建演示",-1)),l("figure",fs,[n[0]||(n[0]=l("figcaption",null,[e("切 输出格式 / 配置示例 / package.json / 构建演示 四个页签；点「开始构建」，看 "),l("code",null,"dist"),e(" 里依次产出 ES / CJS / UMD 三种格式、样式文件与类型声明，并留意发布流程的五步。")],-1)),I(gs)]),n[18]||(n[18]=l("h2",null,"条件导出映射",-1)),n[19]||(n[19]=l("p",null,[e(" 发布一个库的难点不在写代码，而在把「产物如何被引用」交代清楚：多入口让子路径可达，"),l("code",null,"exports"),e(" 把每条路径与条件映射到正确文件，"),l("code",null,"external"),e(" 加 "),l("code",null,"peerDependencies"),e(" 把框架依赖交还给使用方，"),l("code",null,"files"),e(" 与 "),l("code",null,"prepublishOnly"),e(" 保证发出去的是一份构建过、清单干净、带类型的产物。库不是应用，它的产物要服务于你见不到的使用者。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「条件导出（conditional exports）」"),e("指 "),l("code",null,"package.json"),e(" 的 "),l("code",null,"exports"),e(" 字段用 "),l("code",null,"import"),e(" / "),l("code",null,"require"),e(" / "),l("code",null,"types"),e(" 等条件，为同一条模块路径指定不同文件，让 ESM 与 CJS 环境各取所需。边界：条件的匹配是"),l("strong",null,"从上到下、先命中先返回"),e("，所以 "),l("code",null,"types"),e(" 必须写在 "),l("code",null,"import"),e(" / "),l("code",null,"require"),e(" 之前；一旦声明了 "),l("code",null,"exports"),e("，未列入其中的路径将不再可达，任何子路径都必须显式登记。 ")],-1))]),_:1})}}}),ys={class:"demo-card"},Ss={class:"tab-bar"},Vs={key:0},Cs={class:"page-switcher"},xs=["onClick"],ks={class:"page-icon"},Ms={class:"page-preview"},$s={class:"preview-header"},Ts={class:"preview-title"},Es={class:"preview-path"},Rs={class:"preview-body"},Ls={class:"preview-desc"},Is={class:"preview-features"},ws={class:"preview-entry"},Ds={key:1},Hs={key:2},As={key:3},Ps={class:"build-demo"},js={class:"build-header"},Os=["disabled"],Js={key:0,class:"build-progress"},zs={class:"progress-track"},Bs={class:"progress-text"},Us={key:1,class:"output-section"},Ns={class:"output-list"},Fs={class:"file-icon"},qs={class:"file-name"},Ks={class:"file-size"},Xs={class:"type-tag"},Ws={class:"build-summary"},_s={class:"summary-item"},Gs={class:"summary-value"},Ys={class:"summary-item"},Zs={class:"summary-value"},Qs={class:"summary-item"},hs={class:"summary-value highlight"},lo={key:2,class:"empty-state"},eo=`<span style="color:#7c7c99">// vite.config.ts - 多页面配置</span>
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  build: {
    rollupOptions: {
      <span style="color:#7c7c99">// 配置多页面入口</span>
      input: {
        <span style="color:#7c7c99">// 首页</span>
        main: resolve(__dirname, 'index.html'),
        
        <span style="color:#7c7c99">// 管理后台</span>
        admin: resolve(__dirname, 'admin.html'),
        
        <span style="color:#7c7c99">// 文档中心</span>
        docs: resolve(__dirname, 'docs.html'),
        
        <span style="color:#7c7c99">// 移动端</span>
        mobile: resolve(__dirname, 'mobile.html'),
      },
      
      output: {
        <span style="color:#7c7c99">// 按页面拆分 chunk</span>
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('element-plus')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  
  server: {
    <span style="color:#7c7c99">// 开发服务器打开指定页面</span>
    open: '/index.html',
  },
})`,no=`<span style="color:#7c7c99">&lt;!-- admin.html --&gt;</span>
&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8" /&gt;
  &lt;link rel="icon" type="image/svg+xml" href="/favicon.ico" /&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0" /&gt;
  &lt;title&gt;管理后台&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="admin-app"&gt;&lt;/div&gt;
  &lt;script type="module" src="/src/admin/main.ts"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;

<span style="color:#7c7c99">&lt;!-- src/admin/main.ts --&gt;</span>
import { createApp } from 'vue'
import AdminApp from './AdminApp.vue'
import router from './router'
import store from './store'

createApp(AdminApp)
  .use(router)
  .use(store)
  .mount('#admin-app')`,to=`project-root/
├── index.html           <span style="color:#7c7c99"># 首页入口</span>
├── admin.html           <span style="color:#7c7c99"># 管理后台入口</span>
├── docs.html            <span style="color:#7c7c99"># 文档中心入口</span>
├── mobile.html          <span style="color:#7c7c99"># 移动端入口</span>
├── vite.config.ts
├── package.json
└── src/
    ├── main.ts          <span style="color:#7c7c99"># 首页入口脚本</span>
    ├── App.vue
    ├── components/      <span style="color:#7c7c99"># 共享组件</span>
    │   ├── Button.vue
    │   └── Card.vue
    ├── utils/           <span style="color:#7c7c99"># 共享工具</span>
    │   └── request.ts
    ├── stores/          <span style="color:#7c7c99"># 共享状态</span>
    │   └── user.ts
    ├── admin/           <span style="color:#7c7c99"># 管理后台模块</span>
    │   ├── main.ts
    │   ├── AdminApp.vue
    │   ├── router/
    │   └── views/
    ├── docs/            <span style="color:#7c7c99"># 文档中心模块</span>
    │   ├── main.ts
    │   ├── DocsApp.vue
    │   └── pages/
    └── mobile/          <span style="color:#7c7c99"># 移动端模块</span>
        ├── main.ts
        ├── MobileApp.vue
        └── views/`,so=g({__name:"V21MultiPage",setup(a){const t=b("intro"),n=[{id:"home",name:"首页",path:"/index.html",entry:"src/main.ts",icon:"🏠"},{id:"admin",name:"管理后台",path:"/admin.html",entry:"src/admin/main.ts",icon:"⚙️"},{id:"docs",name:"文档中心",path:"/docs.html",entry:"src/docs/main.ts",icon:"📚"},{id:"mobile",name:"移动端",path:"/mobile.html",entry:"src/mobile/main.ts",icon:"📱"}],m=b("home"),r=P(()=>n.find(H=>H.id===m.value)||n[0]),c=b({isBuilding:!1,progress:0,currentStep:"",outputFiles:[]}),d=["🔍 解析多页面入口...","📦 打包首页资源...","📦 打包管理后台...","📦 打包文档中心...","📦 打包移动端...","🎨 提取公共样式...","🔗 拆分共享代码...","✅ 构建完成！"],y=[{name:"index.html",size:"1.2 KB",type:"html"},{name:"admin.html",size:"1.1 KB",type:"html"},{name:"docs.html",size:"1.0 KB",type:"html"},{name:"mobile.html",size:"1.0 KB",type:"html"},{name:"assets/main-abc123.js",size:"68.4 KB",type:"js"},{name:"assets/admin-def456.js",size:"85.2 KB",type:"js"},{name:"assets/docs-ghi789.js",size:"52.1 KB",type:"js"},{name:"assets/mobile-jkl012.js",size:"45.8 KB",type:"js"},{name:"assets/vendor-vue-mno345.js",size:"125.6 KB",type:"vendor"},{name:"assets/style-pqr678.css",size:"24.3 KB",type:"css"}];async function k(){if(!c.value.isBuilding){c.value.isBuilding=!0,c.value.progress=0,c.value.outputFiles=[];for(let H=0;H<d.length;H++)await new Promise(f=>setTimeout(f,350+Math.random()*250)),c.value.currentStep=d[H],c.value.progress=(H+1)/d.length*100,H===1&&(c.value.outputFiles.push(y[0]),c.value.outputFiles.push(y[4])),H===2&&(c.value.outputFiles.push(y[1]),c.value.outputFiles.push(y[5])),H===3&&(c.value.outputFiles.push(y[2]),c.value.outputFiles.push(y[6])),H===4&&(c.value.outputFiles.push(y[3]),c.value.outputFiles.push(y[7])),H===6&&(c.value.outputFiles.push(y[8]),c.value.outputFiles.push(y[9]));setTimeout(()=>{c.value.isBuilding=!1},500)}}function A(H){return{html:"📄",js:"📜",css:"🎨",vendor:"📦"}[H]||"📁"}function M(H){return{html:"HTML",js:"页面 JS",css:"样式",vendor:"公共依赖"}[H]||H}const s=b("home"),u={home:{title:"首页",desc:"面向普通用户的主站点，展示产品介绍、新闻资讯等内容。",features:["响应式设计","SEO 优化","内容管理"]},admin:{title:"管理后台",desc:"运营人员使用的后台管理系统，包含数据统计、用户管理等功能。",features:["权限控制","数据可视化","批量操作"]},docs:{title:"文档中心",desc:"产品文档和 API 文档站点，提供搜索、导航等功能。",features:["全文搜索","版本管理","代码高亮"]},mobile:{title:"移动端",desc:"针对手机端优化的 H5 页面，提供类原生的交互体验。",features:["触摸优化","轻量快速","离线缓存"]}},S=P(()=>u[s.value]);return(H,f)=>(o(),p("div",ys,[f[17]||(f[17]=l("h3",null,"V21 · 多页面应用配置与入口管理",-1)),l("div",Ss,[l("button",{class:v(["tab-btn",{active:t.value==="intro"}]),onClick:f[0]||(f[0]=$=>t.value="intro")},"适用场景",2),l("button",{class:v(["tab-btn",{active:t.value==="structure"}]),onClick:f[1]||(f[1]=$=>t.value="structure")},"目录结构",2),l("button",{class:v(["tab-btn",{active:t.value==="config"}]),onClick:f[2]||(f[2]=$=>t.value="config")},"配置示例",2),l("button",{class:v(["tab-btn",{active:t.value==="demo"}]),onClick:f[3]||(f[3]=$=>t.value="demo")},"构建演示",2)]),t.value==="intro"?(o(),p("div",Vs,[f[5]||(f[5]=l("p",{class:"intro-text"}," 多页面应用（MPA）是指有多个独立 HTML 入口页面的应用。Vite 通过配置多个入口，支持多页面同时开发和构建。 ",-1)),l("div",Cs,[(o(),p(C,null,x(n,$=>l("button",{key:$.id,class:v(["page-tab",{active:s.value===$.id}]),onClick:wo=>s.value=$.id},[l("span",ks,i($.icon),1),l("span",null,i($.name),1)],10,xs)),64))]),l("div",Ms,[l("div",$s,[l("span",Ts,i(r.value.icon)+" "+i(S.value.title),1),l("code",Es,i(r.value.path),1)]),l("div",Rs,[l("p",Ls,i(S.value.desc),1),l("div",Is,[(o(!0),p(C,null,x(S.value.features,$=>(o(),p("span",{key:$,class:"feature-tag"}," ✓ "+i($),1))),128))]),l("div",ws,[f[4]||(f[4]=l("span",null,"入口文件：",-1)),l("code",null,i(r.value.entry),1)])])]),f[6]||(f[6]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"适用场景："),e("一个项目包含多个独立应用（如前台 + 后台）、需要 SEO 的页面、不同端的入口页面等。共享组件和工具可放在公共目录复用。")])],-1))])):V("",!0),t.value==="structure"?(o(),p("div",Ds,[f[7]||(f[7]=l("h4",null,"推荐目录结构",-1)),l("pre",{class:"mini-code",innerHTML:to}),f[8]||(f[8]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"最佳实践："),e("共享的组件、工具函数、状态管理放在根目录的 "),l("code",null,"src/components"),e("、"),l("code",null,"src/utils"),e("、"),l("code",null,"src/stores"),e(" 中，各页面独立模块放在各自目录下。")])],-1))])):V("",!0),t.value==="config"?(o(),p("div",Hs,[l("pre",{class:"mini-code",innerHTML:eo}),f[9]||(f[9]=l("h4",{style:{"margin-top":"12px"}},"HTML 入口示例",-1)),l("pre",{class:"mini-code",innerHTML:no}),f[10]||(f[10]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"注意："),e("每个 HTML 文件需要有对应的入口脚本（main.ts），mount 到不同的 DOM 元素（如 #app、#admin-app）以避免冲突。")])],-1))])):V("",!0),t.value==="demo"?(o(),p("div",As,[l("div",Ps,[l("div",js,[f[11]||(f[11]=l("span",{class:"build-title"},"🏗️ 多页面构建模拟器",-1)),l("button",{class:"action-btn primary",disabled:c.value.isBuilding,onClick:k},i(c.value.isBuilding?"构建中...":"▶ 开始构建"),9,Os)]),c.value.isBuilding||c.value.progress>0?(o(),p("div",Js,[l("div",zs,[l("div",{class:"progress-fill",style:O({width:c.value.progress+"%"})},null,4)]),l("span",Bs,i(c.value.currentStep),1)])):V("",!0),c.value.outputFiles.length>0?(o(),p("div",Us,[f[15]||(f[15]=l("h5",null,"📁 输出文件 (dist/)",-1)),l("ul",Ns,[(o(!0),p(C,null,x(c.value.outputFiles,$=>(o(),p("li",{key:$.name,class:"output-item"},[l("span",Fs,i(A($.type)),1),l("span",qs,i($.name),1),l("span",Ks,i($.size),1),l("span",Xs,i(M($.type)),1)]))),128))]),l("div",Ws,[l("div",_s,[l("span",Gs,i(c.value.outputFiles.filter($=>$.type==="html").length),1),f[12]||(f[12]=l("span",{class:"summary-label"},"HTML 页面",-1))]),l("div",Ys,[l("span",Zs,i(c.value.outputFiles.filter($=>$.type==="js").length),1),f[13]||(f[13]=l("span",{class:"summary-label"},"页面脚本",-1))]),l("div",Qs,[l("span",hs,i(c.value.outputFiles.filter($=>$.type==="vendor").length),1),f[14]||(f[14]=l("span",{class:"summary-label"},"共享依赖",-1))])])])):V("",!0),c.value.outputFiles.length===0&&!c.value.isBuilding?(o(),p("div",lo," 点击「开始构建」模拟多页面打包过程 ")):V("",!0)]),f[16]||(f[16]=l("div",{class:"tips-box"},[l("p",null,[l("strong",null,"代码分割："),e("使用 "),l("code",null,"manualChunks"),e(" 将共享依赖（如 vue、组件库）提取为单独的 chunk，多个页面共享缓存，减少重复加载。")])],-1))])):V("",!0)]))}}),oo=E(so,[["__scopeId","data-v-3ce24298"]]),uo={class:"lesson-figure"},io=g({__name:"V21MultiPageArticle",setup(a){return(t,n)=>{const m=w;return o(),R(m,null,{default:L(()=>[n[1]||(n[1]=l("div",{class:"lesson-question"},[l("strong",null,"开场问题："),e("你按上一课给多页面手工登记了入口，当时只有 3 个页面，一切正常。半年后页面涨到 20 个，每次加一页都要改配置、加 HTML、加脚本、加引用。最吓人的一次是：新人复制了一份页面模板，忘了在配置里登记——本地开发跑得好好的，直到上线后那个页面整页 404，因为它从来没进过构建产物。 ")],-1)),n[2]||(n[2]=l("h2",null,"手工登记入口",-1)),n[3]||(n[3]=l("p",null,[e(" 手工维护入口表在页面少时没毛病，页面一多就变成一场「配置项和文件树对齐」的体力活，而且这种对齐"),l("strong",null,"没有任何机制保证"),e("：漏登记不会报错，只会在构建产物里静默缺席。与此同时，多个页面共享的依赖怎么分包，直接决定每个页面的首屏体积和缓存复用率。 ")],-1)),n[4]||(n[4]=l("p",null,[e(" 旧办法的隐藏成本有三样：入口与文件树靠人肉同步，必然漂移；共享依赖分包策略失控——要么每个页面各带一份 "),l("code",null,"vue"),e("，总下载量不降反升，要么全塞进一个巨大 vendor，任何小依赖变动都让整包缓存失效；每个页面的 HTML、入口脚本、挂载节点还得一一对上，错一个就白屏。于是问题落在："),l("strong",null,"能不能让入口表从目录结构自动「长出来」，并让共享依赖按一份清晰的策略分包？")],-1)),n[5]||(n[5]=l("h2",null,"目录扫描生成入口",-1)),n[6]||(n[6]=l("p",null,[e(" 最直接的做法：用 glob 扫描约定目录下的 HTML，把扫到的目录名当作入口名，动态拼出一张 "),l("code",null,"input"),e(" 表。 ")],-1)),n[7]||(n[7]=l("p",null,[e(" 这个方案做对了一件事："),l("strong",null,"入口表不再靠人手写"),e("。因为配置文件可以导出异步函数，扫描能在配置阶段完成；新增页面只要把目录建出来，配置一个字都不用动。 ")],-1)),n[8]||(n[8]=l("h2",null,"匹配范围失控",-1)),n[9]||(n[9]=l("ul",null,[l("li",null,"扫描模式太宽会误纳：把测试页、废弃的 HTML 也扫进来，构建出一堆没人要的页面，白占体积。"),l("li",null,"入口产物命名不加控制，JS 与 HTML 的名字会混乱，缓存策略和线上排查都变得困难。"),l("li",null,[e("只解决入口还不够：共享依赖若不分包，每个页面各带一份 "),l("code",null,"vue"),e("，总下载量反而更大。")]),l("li",null,[e("各页面若都把挂载节点写成 "),l("code",null,"#app"),e("，多个入口混排时容易互相冲突；HTML 和入口脚本也要严格一一对应。")])],-1)),n[10]||(n[10]=l("h2",null,"动态入口约定",-1)),n[11]||(n[11]=l("p",null,[e(" 先补「动态入口」。约定每个页面独占一个目录、目录里有 "),l("code",null,"index.html"),e("，然后用 "),l("code",null,"fast-glob"),e(" 扫描形如 "),l("code",null,"src/pages/*/index.html"),e(" 的文件；从每个路径里正则取出目录名作为 key，拼成一张 "),l("code",null,"main"),e(" / "),l("code",null,"admin"),e(" / "),l("code",null,"login"),e(" 之类的映射，整个传给 "),l("code",null,"build.rollupOptions.input"),e("。因为 "),l("code",null,"vite.config.ts"),e(" 支持导出异步函数，这套扫描可以在配置被解析时同步完成，随后立刻参与构建。 ")],-1)),n[12]||(n[12]=l("p",null,[e(" 接着补「把边界收紧」。glob 的模式一定要精确到约定目录，比如只匹配 "),l("code",null,"src/pages/*/index.html"),e("，把测试页、模板目录排除在外。约定目录之外哪怕有 HTML，也不会被误纳入构建——这正是防止「页面莫名其妙多出来」的那道闸。 ")],-1)),n[13]||(n[13]=l("p",null,[e(" 再补「共享 chunk 策略」。用 "),l("code",null,"manualChunks"),e(" 把跨页面共享的依赖按用途分组："),l("code",null,"vue"),e("、"),l("code",null,"vue-router"),e("、"),l("code",null,"pinia"),e(" 归成 "),l("code",null,"vue-vendor"),e("，UI 库归成 "),l("code",null,"ui-lib"),e("。为什么按用途、而不按单个依赖来拆？因为拆分的依据是"),l("strong",null,"变更频率"),e("：框架版本很少动，单独成块就能长期命中浏览器缓存；业务代码常改，单独成块，改了只作废自己那一块。拆得过细会把一次请求变成好几次，反而更慢。 ")],-1)),n[14]||(n[14]=l("p",null,[e(" 再补「产物命名与目录结构」。用 "),l("code",null,"entryFileNames"),e("、"),l("code",null,"chunkFileNames"),e("、"),l("code",null,"assetFileNames"),e(" 把页面 JS、公共依赖、CSS 与图片分到 "),l("code",null,"assets/js"),e("、"),l("code",null,"assets/css"),e(" 之类的子目录里，产物结构一目了然，也方便按目录制定缓存策略。 ")],-1)),n[15]||(n[15]=l("p",null,[e(" 最后补「每个入口的 HTML 与挂载点」。每个页面自己的 "),l("code",null,"index.html"),e(" 用 "),l("code",null,'<script type="module" src="/src/pages/admin/main.ts"><\/script>'),e(" 引自己的入口脚本，脚本再挂到各自独立的 DOM 节点（如 "),l("code",null,"#admin-app"),e("），别都挤在 "),l("code",null,"#app"),e(" 上。"),l("code",null,"src"),e(" 路径要与 "),l("code",null,"input"),e(" 的键名对应；开发时访问子目录记得带尾部斜杠，才会命中它的 "),l("code",null,"index.html"),e("。 ")],-1)),n[16]||(n[16]=l("div",{class:"lesson-box warn"},[l("strong",null,"两条容易踩的线："),e("glob 模式务必精确到约定目录，否则测试页、废弃页面会被悄悄纳入构建；"),l("code",null,"manualChunks"),e(" 按「变更频率」分组、不是越细越好——把每个包都单开一块，会把一次请求打散成好几次。 ")],-1)),n[17]||(n[17]=l("h2",null,"四页面产物演示",-1)),l("figure",uo,[n[0]||(n[0]=l("figcaption",null,[e("切 适用场景 / 目录结构 / 配置示例 / 构建演示 四个页签；点「开始构建」，看 "),l("code",null,"dist"),e(" 里四个 HTML、各页面 JS、共享 vendor chunk 与提取出的 CSS 依次出现，底部三个统计数字正好对应「HTML 页面 / 页面脚本 / 共享依赖」。")],-1)),I(oo)]),n[18]||(n[18]=l("h2",null,"入口自动生成",-1)),n[19]||(n[19]=l("p",null,[e(" 多页面进阶要解决的是「页面变多之后」的两件事：入口表用 glob 从目录里自动长出来，边界收在约定目录内，新增页面零改动配置；共享依赖用 "),l("code",null,"manualChunks"),e(" 按变更频率分组，让框架长期命中缓存、业务改动只作废自己那一块。入口自动化加上清晰的分包策略，MPA 才能在页面数量增长后依然可维护。 ")],-1)),n[20]||(n[20]=l("div",{class:"lesson-term"},[l("span",{class:"term-name"},"「manualChunks」"),e("是 "),l("code",null,"rollupOptions.output"),e(" 下用来手动指定依赖归入哪个 chunk 的配置，可写成对象或函数，按「模块路径到 chunk 名」的规则把依赖分到不同产物中。边界：它做的是"),l("strong",null,"归组而非拆包命令"),e("，函数返回 "),l("code",null,"undefined"),e(" 时交回默认策略；分组粒度应按变更频率来定，而不是给每个包单开一块，否则请求数上升会抵消缓存收益。 ")],-1))]),_:1})}}}),j=["import","meta","env"].join("."),ro=Object.assign({"../../demos/vite-code/V01Code.ts.txt":()=>T(()=>import("./C74LsaxI.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V02Code.ts.txt":()=>T(()=>import("./DNBiWk62.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V03Code.ts.txt":()=>T(()=>import("./BJjSJF4q.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V04Code.ts.txt":()=>T(()=>import("./CEuM4PlO.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V05Code.ts.txt":()=>T(()=>import("./CwfJnCsU.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V06Code.ts.txt":()=>T(()=>import("./DDPan-_w.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V07Code.ts.txt":()=>T(()=>import("./CPm-px7u.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V08Code.ts.txt":()=>T(()=>import("./CYMz88XG.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V09Code.ts.txt":()=>T(()=>import("./0sofhyxn.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V10Code.ts.txt":()=>T(()=>import("./C_K6GmhE.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V11Code.ts.txt":()=>T(()=>import("./IA13rLLa.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V12Code.ts.txt":()=>T(()=>import("./DDHeg2zT.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V13Code.ts.txt":()=>T(()=>import("./R25RdCaN.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V14Code.ts.txt":()=>T(()=>import("./Bc9h8kSO.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V15Code.ts.txt":()=>T(()=>import("./CpDo8Que.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V16Code.ts.txt":()=>T(()=>import("./C3l4RCSS.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V17Code.ts.txt":()=>T(()=>import("./DQoAI04G.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V18Code.ts.txt":()=>T(()=>import("./DziyU3mS.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V19Code.ts.txt":()=>T(()=>import("./BIibdT4J.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V20Code.ts.txt":()=>T(()=>import("./CmQhk53A.js"),[],import.meta.url).then(a=>a.default),"../../demos/vite-code/V21Code.ts.txt":()=>T(()=>import("./CxIkFxS5.js"),[],import.meta.url).then(a=>a.default)});function D(a){const t=ro[`../../demos/${a}`];if(!t)throw new Error(`未找到内容源码：${a}`);return()=>t().then(N)}const po=D("vite-code/V01Code.ts.txt"),ao=D("vite-code/V02Code.ts.txt"),mo=D("vite-code/V03Code.ts.txt"),co=D("vite-code/V04Code.ts.txt"),vo=D("vite-code/V05Code.ts.txt"),go=D("vite-code/V06Code.ts.txt"),fo=D("vite-code/V07Code.ts.txt"),bo=D("vite-code/V08Code.ts.txt"),yo=D("vite-code/V09Code.ts.txt"),So=D("vite-code/V10Code.ts.txt"),Vo=D("vite-code/V11Code.ts.txt"),Co=D("vite-code/V12Code.ts.txt"),xo=D("vite-code/V13Code.ts.txt"),ko=D("vite-code/V14Code.ts.txt"),Mo=D("vite-code/V15Code.ts.txt"),$o=D("vite-code/V16Code.ts.txt"),To=D("vite-code/V17Code.ts.txt"),Eo=D("vite-code/V18Code.ts.txt"),Ro=D("vite-code/V19Code.ts.txt"),Lo=D("vite-code/V20Code.ts.txt"),Io=D("vite-code/V21Code.ts.txt"),jo=[{id:"V_01",title:"Vite 核心概念",navTitle:"核心概念",category:"基础",path:"/vite/v-1/core",summary:"理解 Vite 的两个阶段：开发服务器（原生 ESM）和生产构建（Rollup）。",demo:null,demoComponent:el,code:po,language:"typescript",principle:"Vite 把工程分为开发与构建两个阶段：开发阶段利用浏览器原生 ESM 对源码做按需即时编译，无需打包成 bundle，HMR 只更新发生变化的模块；生产阶段切换 Rollup 打包，做 Tree Shaking、代码分割与压缩，输出高度优化的静态产物。",flow:["通过核心概念卡片理解原生 ESM、Rollup 构建、HMR 与插件系统。","对比 Vite 与传统打包器（Webpack）的差异。","查看常用配置示例，了解 dev server、代理、别名与分包。","启动一个最小项目，对比 dev 冷启动与生产构建产物的差异。"],notes:["冷启动不受项目规模影响，代价是一次性的依赖预构建。","HMR 基于原生 ESM，只精确实时更新发生变化的模块。","开发阶段按需加载源文件本身，生产阶段才做打包压缩优化。","vite preview 可在本地以生产行为预览 dist 产物，部署前先验证。"],problem:'解决"传统打包器冷启动慢、HMR 更新延迟、依赖图膨胀拖慢日常开发"的问题。'},{id:"V_02",title:"Vite 配置文件",navTitle:"配置文件",category:"配置",path:"/vite/v-2/config",summary:"使用 defineConfig 获得类型提示，掌握基础配置与常用选项。",demo:null,demoComponent:rl,code:ao,language:"typescript",principle:"vite.config.ts 是 Vite 的项目级配置入口：用 defineConfig 包装可获得完整的类型推导与提示；既可导出静态对象，也可导出接收 { mode, command } 的函数，在函数内按环境返回不同配置，或在条件成立时动态追加插件。",flow:["用 defineConfig 编写 server、build、resolve.alias 等基础配置。","把配置改为函数形式，接收 { mode, command } 按环境返回不同配置。","在函数内按环境变量（如 ANALYZE）条件性添加插件或调整构建选项。","环境差异放函数式配置、敏感值放环境变量，避免把密钥或路径硬编码进配置文件。"],notes:["使用 defineConfig 可获得完整类型提示，避免手写配置时字段拼错或被静默忽略。","resolve.alias 设置路径别名，css.preprocessorOptions 可注入全局样式。","函数式配置的返回值会与默认配置深度合并，返回空对象也不会丢失默认行为。","配置字段拼写错误可能被静默忽略，改动后用 vite --debug 检查最终解析结果。"],problem:'解决"开发/生产需要不同的 server、minify、sourcemap 等设置，手动改配置文件既繁琐又容易漏改"的问题。'},{id:"V_03",title:"插件系统",navTitle:"插件系统",category:"插件",path:"/vite/v-3/plugins",summary:"理解 Vite 插件兼容 Rollup 插件接口，掌握常用插件的使用。",demo:null,demoComponent:gl,code:mo,language:"typescript",principle:"在 vite.config.ts 的 plugins 数组中注册即可扩展 Vite 功能；常用插件覆盖 Vue 支持、Vue JSX、组件与 API 自动按需引入、PWA 等，社区插件多以 vite-plugin 或 unplugin 前缀分发。",flow:["在 plugins 数组中注册 vue()、vueJsx() 等基础插件。","用 AutoImport 与 Components 配置 API 与组件的自动按需引入。","通过 enforce: pre/post 或条件判断控制插件执行顺序与生效阶段。","仅安装项目实际需要的插件，避免为演示性功能引入过重的依赖。"],notes:["插件在 plugins 数组中按声明顺序执行，配合 enforce: pre/post 可调整先后。","unplugin-vue-components 与 unplugin-auto-import 可自动按需引入组件与 API。","自动引入会生成 dts 声明文件，需加入 tsconfig 的 include，否则编辑器报变量未定义。","插件执行出错会中断 dev server，报错信息一般带插件名，可据此快速定位。"],problem:'解决"每写一个组件都要手动 import，或需要按开发/构建阶段启用不同插件"的问题。'},{id:"V_04",title:"HMR 热更新",navTitle:"HMR",category:"开发体验",path:"/vite/v-4/hmr",summary:"理解 Vite HMR 基于原生 ESM 的实现原理，以及 Vue/React 的框架集成。",demo:null,demoComponent:kl,code:co,language:"typescript",principle:"Vite HMR 依托原生 ESM 的模块边界实现：文件修改后服务器沿 import 链向上寻找最近的“接受者”（import.meta.hot.accept 声明的模块），只替换该模块而不刷新页面；Vue/React 插件会为每个组件自动注入接受逻辑并尽量保留组件状态。",flow:["在模块中用 import.meta.hot.accept 声明自身可热替换，并处理状态迁移。","用 accept(dep, cb) 接受依赖模块更新，用 dispose 做替换前清理。","观察 Vue SFC 中 template、script、style 分别更新时的页面行为差异。","热替换代码要包在 if (import.meta.hot) 守卫内，生产构建中该对象不存在。"],notes:["Vue SFC 的 template 与 style 更新不丢失状态，<script setup> 的逻辑变更会重建组件实例。","HMR 只沿模块边界替换，状态保存在 Pinia store 或模块级变量中才能跨更新存活。","模块未声明 accept 时更新会沿依赖链冒泡，找不到边界就整页刷新。","手动 accept 的回调里要主动应用新模块导出，否则界面不会随更新变化。"],problem:'解决"改一行样式页面就整页刷新、表单输入与展开状态被重置，要反复操作才能复现问题"的问题。'},{id:"V_05",title:"环境变量与模式",navTitle:"环境变量",category:"配置",path:"/vite/v-5/env",summary:`使用 .env 文件和 ${j} 管理不同环境下的变量。`,demo:null,demoComponent:wl,code:vo,language:"typescript",principle:`Vite 内置 dotenv，按 .env → .env.local → .env.[mode] → .env.[mode].local 的优先级加载变量并以后者覆盖前者；只有 VITE_ 前缀的变量会被静态替换进客户端代码（通过 ${j} 访问），其余变量仅对配置文件的 Node 侧逻辑可见，从机制上避免密钥泄漏到浏览器。`,flow:["创建 .env.development / .env.production，写入带 VITE_ 前缀的变量。",`在业务代码中用 ${j}.VITE_API_BASE_URL 读取变量。`,"在 vite.config.ts 中用 loadEnv 读取变量配置 proxy，并在 vite-env.d.ts 中补充类型声明。","把 .env.local 与 .env.*.local 加入 .gitignore，个人覆盖与敏感值不进仓库。"],notes:[`${j}.MODE / DEV / PROD 等内置变量可判断当前运行模式。`,"敏感信息（如数据库密码）不应使用 VITE_ 前缀，因为它会被打进客户端产物。","修改 .env 后需要重启开发服务器才会生效，已注入的旧值不会热更新。","变量在构建时静态替换进代码，多环境需要各自构建，无法运行时切换。"],problem:'解决"开发/测试/生产需要不同的 API 地址与开关，硬编码在代码里每次发布都要手改"的问题。'},{id:"V_06",title:"静态资源处理",navTitle:"静态资源",category:"资源",path:"/vite/v-6/assets",summary:"理解导入哈希化、public 目录和 base64 内联三种资源处理方式。",demo:null,demoComponent:zl,code:go,language:"typescript",principle:"Vite 对静态资源有三条处理路径：import 导入的资源进入模块图，按内容哈希命名后输出并返回最终 URL；public 目录的文件不经过构建管线、原样复制到产物根目录；小于 assetsInlineLimit（默认 4096 字节）的资源会被内联为 base64 data URL，省去一次请求。",flow:['用 import logo from "./assets/logo.png" 导入图片，观察产物文件名带内容哈希。',"把 favicon、robots.txt 放进 public 目录，用绝对路径 /favicon.ico 引用。","调整 assetsInlineLimit 或用 ?url、?inline、?raw 后缀显式控制单个资源。","确认 vite-env.d.ts 声明了资源模块类型，静态导入图片才有类型提示。"],notes:["优先使用导入方式引用资源，可获得哈希缓存与压缩等构建优化。","public 目录适合不常变更的静态文件（favicon、robots.txt），引用时必须写绝对路径。","内联为 base64 会增大约 33% 体积且无法单独缓存，大图应调低阈值避免被打进 JS/CSS。","哈希由文件内容生成，内容不变文件名不变，可放心为产物设置长期强缓存。"],problem:'解决"构建后图片路径 404、小图标产生大量请求拖慢首屏，或不知该把资源放 assets 还是 public"的问题。'},{id:"V_07",title:"依赖预构建",navTitle:"预构建",category:"性能",path:"/vite/v-7/pre-bundle",summary:"理解 Vite 使用 Esbuild 预构建 node_modules 依赖的原因和配置方式。",demo:null,demoComponent:Wl,code:fo,language:"typescript",principle:"首次启动时 Vite 用 Esbuild 把 node_modules 中的依赖预构建为单个 ESM 文件：既将 CommonJS/UMD 转换为浏览器可加载的 ESM，又把一个包的内部模块合并，避免开发时产生成百上千次模块请求；产物按依赖与配置的 hash 缓存在 node_modules/.vite 中复用。",flow:["启动开发服务器，观察终端输出的 Pre-bundling dependencies 日志。","把动态导入未被扫描到的依赖加入 optimizeDeps.include 强制预构建。","修改 lockfile 或执行 vite --force，验证缓存失效后依赖重新预构建。","用 optimizeDeps.exclude 排除已是 ESM 的大包，减少不必要的预构建开销。"],notes:["预构建只处理第三方依赖，业务源码不参与，include 中不要写 src 下的路径。","预构建产物缓存在 node_modules/.vite/ 下，删除缓存可强制重新预构建。","动态 import 的路径若无法被静态扫描，运行时会出现 404，需要手动加入 include。","依赖升级或行为异常时，删除 node_modules/.vite 缓存后重启可排除缓存问题。"],problem:'解决"依赖内部模块过多导致开发服务器卡顿，或引入 CommonJS 包时报 require is not defined"的问题。'},{id:"V_08",title:"构建优化",navTitle:"构建优化",category:"构建",path:"/vite/v-8/build",summary:"掌握代码分割、懒加载、压缩等 Vite 生产构建优化手段。",demo:null,demoComponent:ee,code:bo,language:"typescript",principle:"Vite 生产构建基于 Rollup：每个动态 import() 会生成独立 chunk 实现按需加载；rollupOptions.output.manualChunks 可把依赖按组拆分以获得更好的缓存复用；压缩默认用 Esbuild（速度快），可切换 Terser（压缩率更高、可配置 drop_console 等选项）。",flow:['在路由中用 () => import("../views/Home.vue") 配置路由级懒加载。',"在 rollupOptions.output.manualChunks 中按框架、UI 库、工具库分组依赖。","切换 minify 为 terser 并配置 drop_console，对比产物体积变化。","用可视化插件查看各 chunk 的体积构成，验证分包是否达到预期。"],notes:["动态 import() 是代码分割的基础，缺少它时 Rollup 只能产出单一大 chunk。","分包不是越细越好，拆得过散会增加请求数，建议按“变更频率”归组。","chunkSizeWarningLimit 只影响警告阈值，不代表超过阈值的 chunk 一定需要拆分。","build.target 决定语法降级目标，面向现代浏览器可适当提高以减少产物体积。"],problem:'解决"首屏需要下载的 chunk 过大、大依赖与业务代码混在一起导致上线后缓存全部失效"的问题。'},{id:"V_09",title:"多页面应用（MPA）",navTitle:"MPA",category:"构建",path:"/vite/v-9/mpa",summary:"配置多个 HTML 入口，构建多页面应用。",demo:null,demoComponent:re,code:yo,language:"typescript",principle:"Vite 通过 build.rollupOptions.input 声明多个 HTML 入口构建多页面应用：每个 HTML 是独立入口页，Vite 会为其分别产出 HTML 与入口 JS，同时把跨页面共享的依赖自动提取为 common chunk，避免重复打包。",flow:["在 rollupOptions.input 中以 { main, admin, login } 的键值对声明多个 HTML 入口。","按“HTML + 入口脚本 + 组件”为每个页面组织目录，把共享代码放入 shared 目录。","执行构建，检查 dist 中每个页面的 HTML 与共享 chunk 产物结构。","在 dev 下逐一访问各入口页面，确认脚本独立加载、互不干扰。"],notes:['每个 HTML 用 <script type="module" src="..."> 引入自己的入口 JS，路径需与 input 键名对应。',"共享依赖自动提取为公共 chunk，不会在每个页面里重复打包。","dev 服务器下访问子页面需带尾部斜杠（/admin/）才能命中其 index.html。","部署到子目录时统一用 base 调整各页面资源路径，避免绝对路径 404。"],problem:'解决"官网与管理后台需要完全隔离的独立页面，用 SPA 前端路由硬拼在一起既臃肿又不好按页发布"的问题。'},{id:"V_10",title:"库模式",navTitle:"库模式",category:"构建",path:"/vite/v-10/lib",summary:"使用 Vite 构建可发布的 npm 包，同时输出 ESM/UMD/CJS 格式。",demo:null,demoComponent:be,code:So,language:"typescript",principle:"Vite 库模式通过 build.lib 配置一次输出多种格式：ESM 供现代打包器按需引入、UMD 供 CDN <script> 直接使用、CJS 供 Node.js require；框架依赖用 rollupOptions.external 外部化，UMD 下再通过 output.globals 映射为全局变量避免重复打包。",flow:['在 build.lib 中配置 entry、name 与 formats: ["es", "cjs", "umd"]。',"用 rollupOptions.external 外部化 vue 等依赖，并配置 globals 映射。","配置 package.json 的 module/main/exports 与 files 字段后发布到 npm。","用 npm pack 或本地 link 在示例项目中试用产物，逐一验证各格式可用。"],notes:["使用 peerDependencies 声明框架依赖（如 vue），避免打包多份 Vue 实例。","package.json 的 module/main/exports 字段应分别指向对应格式产物与类型声明。","类型声明不会自动生成，需要 vite-plugin-dts 或手写，并保证与 exports 的 types 字段一致。","库内的 CSS 会单独产出文件，需要使用者手动引入，记得在文档中说明。"],problem:'解决"组件库既要被 Vite 项目按 ESM import、又要能用 CDN <script> 直接引入，还要带正确的类型声明"的问题。'},{id:"V_11",title:"服务端渲染（SSR）",navTitle:"SSR",category:"进阶",path:"/vite/v-11/ssr",summary:"理解 Vite SSR 工作原理，以及 Nuxt 3/4 如何基于 Vite 实现 SSR。",demo:null,demoComponent:$e,code:Vo,language:"typescript",principle:"SSR 在服务端用 renderToString 把组件渲染为完整 HTML 返回，浏览器先展示静态内容，再由客户端入口 mount 完成 Hydration（激活）绑定事件；Vite 以中间件模式与 ssrLoadModule 在同一进程转换服务端代码，并分别构建服务端与客户端两份产物，Nuxt 3/4 即基于这套机制内置了完整的 SSR 支持。",flow:["用 createServer({ server: { middlewareMode: true } }) 启动 Vite 中间件并挂到 Express。","服务端用 transformIndexHtml 与 ssrLoadModule 渲染 HTML，客户端 createSSRApp 后 mount 完成 Hydration。","用 ssr.noExternal / external 控制哪些依赖需要打包进 SSR 产物。","分别执行客户端与服务端构建，把两份产物一起部署到 Node 服务。"],notes:["SSR 有利于 SEO 和首屏速度，但需要 Node 服务端运行环境；本仓库（小松鼠举栗子）就是 Nuxt 4 + Vite 的 SSR 应用。","服务端与客户端首次渲染结果必须一致，否则会触发 Hydration 不匹配警告。","依赖浏览器 API 的代码要放到 onMounted 或 ClientOnly 中，避免服务端执行报错。","数据请求要放在支持 SSR 的加载函数中，mounted 钩子在服务端不会执行。"],problem:'解决"纯客户端渲染的商城首页不被搜索引擎收录、弱网设备首屏长时间白屏"的问题。'},{id:"V_12",title:"CSS 与 PostCSS",navTitle:"CSS处理",category:"样式",path:"/vite/v-12/css",summary:"Vite 内置支持 PostCSS、Sass/Less/Stylus 预处理器和 CSS Modules。",demo:null,demoComponent:He,code:Co,language:"typescript",principle:'Vite 自动读取 postcss.config.js 或 css.postcss 中的插件链并应用于全部样式；安装 sass/less 后即可直接在 <style lang="scss"> 中书写预处理器语法，css.preprocessorOptions 可向每个样式文件注入共享变量；CSS Modules 在 SFC 的 <style module> 中开箱即用。',flow:["在 postcss.config.js（或 css.postcss）中配置 autoprefixer、tailwindcss 等插件。",'安装 sass 后书写 <style lang="scss">，用 preprocessorOptions.additionalData 注入全局变量。','在 <style module> 中书写样式，通过 :class="$style.xxx" 使用局部类名。',"开发阶段开启 css.devSourcemap，浏览器调试样式时可直接定位到源文件。"],notes:["Vue SFC 的 <style scoped> 已提供组件级样式隔离，普通场景不必再用 CSS Modules。","预处理器需要单独安装（npm install -D sass），Vite 不内置编译器。","additionalData 只能注入变量与 mixin 定义，放入实际样式会被重复输出到每个文件。","Tailwind 等工具链通过 PostCSS 接入即可，不必额外安装专门的 Vite 插件。"],problem:'解决"全局样式逐步失控、希望统一接入 Tailwind、Sass 变量与组件级样式隔离"的问题。'},{id:"V_13",title:"TypeScript 集成",navTitle:"TypeScript",category:"类型",path:"/vite/v-13/typescript",summary:"Vite 使用 Esbuild 极速转译 TypeScript，类型检查由 IDE 或 vue-tsc 单独完成。",demo:null,demoComponent:Ue,code:xo,language:"typescript",principle:"Vite 用 Esbuild 转译 TypeScript：仅擦除类型注解并做目标语法降级，不做类型检查，因此类型错误不会阻断 dev 与 build；完整的类型安全由 IDE 实时提示与 vue-tsc --noEmit 在构建脚本或 CI 中把关。",flow:['在 package.json 中配置 "type-check": "vue-tsc --noEmit" 并接在构建脚本前。','在 <script setup lang="ts"> 中编写带接口、泛型的组件逻辑。',`在 vite-env.d.ts 中补充 .vue 模块与 ${j} 的类型声明。`,"把 type-check 接入 CI 流水线，类型不过就不允许合入与部署。"],notes:["Vite 不负责类型检查（保证开发服务器速度），构建通过不代表类型无误。","建议配置 type-check 脚本在构建前或 CI 中运行，拦截类型回归。","tsconfig.json 的 paths 别名要与 vite.config.ts 的 resolve.alias 保持一致，否则编辑器能跳转但运行时报找不到模块。","本地 vue-tsc 报错与 IDE 不一致时，核对插件与依赖版本是否对齐。"],problem:'解决"Vite 项目写 TS 时类型错误不阻断构建、上线才发现问题，以及别名与环境变量缺类型提示"的问题。'},{id:"V_14",title:"代理与跨域",navTitle:"代理跨域",category:"开发体验",path:"/vite/v-14/proxy",summary:"使用 Vite 开发服务器代理解决开发环境跨域问题。",demo:null,demoComponent:Ge,code:ko,language:"typescript",principle:"server.proxy 基于 http-proxy 中间件：开发服务器把匹配前缀或正则的请求转发到 target，浏览器只看到同源请求，从机制上绕开 CORS 限制；rewrite 可改写转发路径，changeOrigin 修改 Host 头，ws: true 开启 WebSocket 转发。",flow:["在 server.proxy 中把 /api 转发到 http://localhost:3000 并设置 changeOrigin: true。","用 rewrite 去掉或重写路径前缀，用 configure 钩子追加或修改请求头。","用 ws: true 转发 WebSocket，或在函数式配置中按 loadEnv 切换不同后端地址。","前端请求统一走相对路径（如 /api/user），后端地址切换只改代理配置。"],notes:["changeOrigin: true 会把请求头的 Host 改为 target 的域名，配合虚拟主机后端时必须开启。","代理只在 vite dev 生效，生产环境需要后端 CORS、Nginx 反向代理或同域部署。","rewrite 的正则作用于带前缀的完整路径，注意用 ^ 锚定避免误改其他请求。","在 configure 回调里挂日志可看到实际转发请求，联调排错更直观。"],problem:'解决"本地开发时前端 5173 端口请求后端 3000 端口被 CORS 拦截，或联调时需在不同后端环境间切换"的问题。'},{id:"V_15",title:"性能分析",navTitle:"性能分析",category:"性能",path:"/vite/v-15/perf",summary:"使用可视化工具和最佳实践分析和优化 Vite 构建产物。",demo:null,demoComponent:tn,code:Mo,language:"typescript",principle:"优化从“测量”开始：用 rollup-plugin-visualizer 生成 treemap 报告，定位占比最大的依赖；再对症下药——按需引入或替换超大依赖（如 moment 换 dayjs）、把大型库外部化交给 CDN、用 manualChunks 合理分包，同时用 server.warmup 与 optimizeDeps 缩短开发启动时间。",flow:["安装 rollup-plugin-visualizer，在 ANALYZE 变量下执行构建产出 stats.html 并查看占比。","针对报告中的体积大户改为按需引入，或替换为更轻的替代库。","用 manualChunks 复测分包效果，并设定 chunkSizeWarningLimit 防止反弹。","用 server.warmup 预热高频入口模块，缩短开发阶段首次访问的等待。"],notes:["定期分析 bundle 大小，及时发现体积膨胀趋势。","大型库（如 lodash-es）应使用按需引入，避免整体导入。","visualizer 只在分析时加入插件数组，日常构建不必生成报告以免拖慢 CI。","优化前后各存一份报告做对比，用数据确认收益，避免凭感觉调整。"],problem:'解决"构建产物体积持续膨胀却找不到是哪个依赖导致，优化效果无法量化对比"的问题。'},{id:"V_16",title:"自定义插件开发",navTitle:"插件开发",category:"进阶",path:"/vite/v-16/plugin-dev",summary:"理解 Vite 插件结构，动手开发一个简单的自定义插件。",demo:null,demoComponent:mn,code:$o,language:"typescript",principle:"自定义插件是返回插件对象（含 name 与各钩子）的函数：既有 Rollup 兼容的 resolveId、load、transform，也有 Vite 独有的 config、configureServer、transformIndexHtml、handleHotUpdate，以此参与开发与构建流程。",flow:["编写返回 Plugin 对象的函数，注册 name 与 transform、config、configureServer 等钩子。","在 transform 中按文件后缀过滤并改写代码（如把 .md 内容包装成 Vue 组件）。","用 resolveId/load 暴露虚拟模块，或在 plugins 中接入项目验证效果。","为插件写示例或单测，验证各钩子的执行时机与产出是否符合预期。"],notes:["插件命名规范为 vite-plugin-xxx，导出函数返回插件对象。","可利用 transform 钩子改写模块代码，例如注入版本号等全局信息。","transform 会被高频调用，务必先按 id 过滤目标文件、快速 return null，避免拖慢开发与构建。","调试插件可用 vite --debug 查看钩子调用日志，快速定位执行顺序问题。"],problem:'解决"现有插件无法满足需求，比如想直接 import .md 文件、或在构建时把版本号注入代码"的问题。'},{id:"V_17",title:"依赖预构建与缓存优化",navTitle:"依赖预构建",category:"性能",path:"/vite/v-17/dependency-prebundle",summary:"理解 Vite 使用 esbuild 预构建依赖的原理，掌握缓存优化和配置。",demo:null,demoComponent:An,code:To,language:"typescript",principle:"Vite 在首次启动时用 esbuild 预构建 node_modules 中的依赖：把 CommonJS/UMD 模块统一转换成 ESM，并把一个依赖的众多内部模块合并成单个文件，避免浏览器发起成百上千次请求造成瀑布式加载。构建结果带 hash 缓存到 node_modules/.vite，依赖或配置变化才重新构建，二次启动直接复用缓存。",flow:["首次启动 Vite 时扫描依赖并预构建。","构建结果缓存到 node_modules/.vite。","后续启动直接读取缓存，依赖变化时重新构建。","观察启动日志中是否出现 Pre-bundling，异常时用 --force 强制重新构建。"],notes:["预构建只处理第三方依赖，源码不预构建。","optimizeDeps.include 可以强制预构建某些包。","缓存失效会自动检测并重新构建。","monorepo 本地链接的包建议加入 include 并设置 resolve.dedupe，避免多实例问题。"],problem:'解决"大量依赖下启动慢、CommonJS 模块无法直接在浏览器运行"的问题。'},{id:"V_18",title:"esbuild 转换与 JSX/TS 处理",navTitle:"esbuild 转换",category:"基础",path:"/vite/v-18/esbuild",summary:"了解 Vite 使用 esbuild 进行极速语法转换的机制，以及 TypeScript 和 JSX 的处理策略。",demo:null,demoComponent:ot,code:Eo,language:"typescript",principle:"Vite 用 esbuild 处理 TypeScript 与 JSX 的语法转换：esbuild 以 Go 编写、多核并行，速度比传统 JS 实现的工具快 10-100 倍；转换只剥离类型标注，不做类型检查，因此开发服务器能在毫秒级响应模块请求。类型检查的正确性由 vue-tsc/tsc 在构建前或 CI 中单独保证。",flow:["源码中的 .ts/.tsx 文件请求到达 Vite 开发服务器。","esbuild 进行语法转换，输出纯 JS。","浏览器直接运行转换后的 ESM 模块。","构建前运行 vue-tsc --noEmit，把类型错误拦截在 CI 阶段。"],notes:["开发环境与依赖预构建都由 esbuild 快速做语法转换，不做类型检查。","esbuild 不支持 const enum、export = 等 TS 特性，需改用兼容写法。","完整类型检查交给 tsc 或 vue-tsc，在构建前或 CI 中执行。","esbuild 不支持 emitDecoratorMetadata，依赖装饰器元数据的框架需改用官方插件链。"],problem:'解决"传统构建工具 TS/JSX 编译速度慢，改一次代码要等数秒才看到效果"的问题。'},{id:"V_19",title:"Rollup 插件兼容与构建钩子",navTitle:"Rollup 插件",category:"插件",path:"/vite/v-19/rollup-plugin",summary:"理解 Vite 与 Rollup 插件的兼容性，掌握 Vite 特有钩子和插件使用方式。",demo:null,demoComponent:jt,code:Ro,language:"typescript",principle:"Vite 构建时基于 Rollup，因此大部分 Rollup 插件（如 visualizer、imagemin）可直接复用；同时扩展了 config、configResolved、configureServer、transformIndexHtml、handleHotUpdate 等 Vite 特有钩子，并支持 apply 字段让插件只在 serve 或 build 阶段生效。",flow:["在 vite.config.ts 的 plugins 数组中添加 Rollup 插件并观察构建效果。",'用 apply: "serve" / "build" 或钩子类型区分插件在开发与构建阶段的行为。',"编写同时使用 Vite 特有钩子与 Rollup 兼容钩子的通用插件。","评估插件对构建耗时的影响，用 apply 限定生效阶段避免波及 dev。"],notes:["并非所有 Rollup 插件都能在开发模式下工作，产物类钩子主要在构建时触发。",'插件可通过 apply: "serve" | "build" 只在开发或构建阶段生效。',"Vite 特有钩子负责开发服务器、HTML 与 HMR，Rollup 钩子负责模块解析、加载与转换。","接入社区插件前核对兼容性与最低 Vite 版本，避免因版本错配导致构建失败。"],problem:'解决"构建工具生态碎片化、Rollup 与 Vite 插件 API 不一、需要学习多套体系"的问题。'},{id:"V_20",title:"库模式与组件打包发布",navTitle:"库模式",category:"构建",path:"/vite/v-20/library-mode",summary:"使用 Vite 库模式打包组件库或工具库，支持多格式输出和发布到 npm。",demo:null,demoComponent:bs,code:Lo,language:"typescript",principle:"Vite 的库模式可以把项目打包成可发布的 npm 包：build.lib 一次输出 ESM、CJS、UMD 等多种格式，框架依赖通过 external 外部化交由使用方提供；CSS 会单独产出文件，类型声明则需借助 vite-plugin-dts 等工具生成后随包发布。",flow:["在 vite.config.ts 中配置 build.lib 选项。","指定入口文件、输出格式和 UMD 包名，并配置 external 与 exports 映射。","运行 vite build 生成可发布的 dist 目录。","用 npm pack 检查产物清单，确认入口、类型声明与文件齐全后再发布。"],notes:["库模式下外部化 Vue 等 peer dependencies。","需要单独配置 d.ts 生成或使用 vite-plugin-dts。","注意输出格式兼容性和 Tree Shaking 支持。","发布时开启 sourcemap，便于使用方在调试依赖问题时直接定位到源码。"],problem:'解决"组件库与工具库打包配置复杂、输出格式不统一、类型声明缺失"的问题。'},{id:"V_21",title:"多页面应用配置与入口管理",navTitle:"多页面应用",category:"构建",path:"/vite/v-21/multi-page",summary:"配置 Vite 多页面应用，管理多个 HTML 入口和共享资源。",demo:null,demoComponent:io,code:Io,language:"typescript",principle:"多页面应用通过 build.rollupOptions.input 声明多个 HTML 入口；本课重点是动态收集入口、用 manualChunks 按页面拆分共享依赖，并规划公共目录与各页面独立模块的目录结构。入口自动化与分包策略让 MPA 在页面数量增长后依然可维护，构建结果也能按页面精准缓存。",flow:["用 fast-glob 扫描 src/pages/*/index.html 动态生成入口表并传给 rollupOptions.input。","为每个页面配置 index.html + main.ts + App.vue 的独立目录，公共代码集中到共享目录。","用 manualChunks 提取跨页面共享依赖，构建后核对各页面 HTML 与公共 chunk。","新增页面只需创建目录结构，入口扫描会自动纳入，无需改动配置文件。"],notes:["多页面可共享公共组件、工具与状态，Vite 会提取为公共 chunk。","每个 HTML 入口对应各自的入口脚本，可挂载到不同 DOM 节点。","配合 manualChunks 把 vue、UI 库等共享依赖单独分包，利于缓存复用。","入口扫描的模式要排除无关目录，避免把组件测试页等 HTML 误纳入构建。"],problem:'解决"传统 MPA 构建配置复杂、入口手工维护、公共资源管理困难"的问题。'}];export{jo as lessons};
