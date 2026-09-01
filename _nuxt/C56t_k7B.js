import{d,b as o,e as t,F as a,E as r,o as s,f as l,I as c}from"./DutfXOOr.js";const f={class:"demo-card"},u={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},m={style:{flex:"1"}},y=`<span style="color:#8a8a3a">// app/layout.tsx — 使用 Google 字体</span>
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',          <span style="color:#7c7c99">// 先 fallback 再切换</span>
  variable: '--font-inter', <span style="color:#7c7c99">// 生成 CSS 变量</span>
})

export default function RootLayout({ children }) {
  return (
    &lt;html className={inter.variable}&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  )
}

<span style="color:#8a8a3a">// 本地字体</span>
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
  variable: '--font-my',
})

<span style="color:#8a8a3a">// CSS 中使用变量</span>
<span style="color:#7c7c99">/* globals.css */</span>
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
.title {
  font-family: var(--font-my), serif;
}`,x=d({__name:"X18NextFont",setup(b){const i=[{benefit:"自动自托管",desc:"字体文件下载并自托管，无第三方请求"},{benefit:"零布局抖动",desc:"size-adjust 自动调整，消除 FOUT/FOIT"},{benefit:"FOUT 优化",desc:"先用 fallback 显示，加载后平滑切换"},{benefit:"subset",desc:"自动按需子集化，减小体积"}],p=[{aspect:"加载方式",nextFont:"构建时下载自托管",trad:"运行时请求 Google CDN"},{aspect:"隐私",nextFont:"✅ 无第三方请求",trad:"❌ 泄露用户信息给 Google"},{aspect:"CLS",nextFont:"✅ 零抖动",trad:"❌ 字体切换抖动"},{aspect:"性能",nextFont:"✅ 预连接 + 预加载",trad:"⚠️ 需手动优化"}];return(g,n)=>(s(),o("div",f,[n[4]||(n[4]=t("h3",null,"next/font 字体优化",-1)),t("div",u,[t("div",m,[n[1]||(n[1]=t("h4",null,"核心优势",-1)),(s(),o(a,null,r(i,e=>t("div",{key:e.benefit,class:"feat-card"},[t("strong",null,l(e.benefit),1),t("p",null,[t("small",null,l(e.desc),1)])])),64)),n[2]||(n[2]=t("h4",{style:{"margin-top":"12px"}},"对比传统 @import",-1)),t("table",null,[n[0]||(n[0]=t("thead",null,[t("tr",null,[t("th",null,"维度"),t("th",null,"next/font"),t("th",null,"@import CDN")])],-1)),t("tbody",null,[(s(),o(a,null,r(p,e=>t("tr",{key:e.aspect},[t("td",null,l(e.aspect),1),t("td",null,l(e.nextFont),1),t("td",null,l(e.trad),1)])),64))])])]),t("div",{style:{flex:"1"}},[n[3]||(n[3]=t("h4",null,"代码示例",-1)),t("pre",{class:"mini-code",innerHTML:y})])])]))}}),v=c(x,[["__scopeId","data-v-4e6012b3"]]);export{v as default};
