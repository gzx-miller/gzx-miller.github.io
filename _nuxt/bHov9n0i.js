import{d as m,b as l,e,F as o,E as p,o as n,f as s,I as c}from"./DutfXOOr.js";const d={class:"demo-card"},g={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},u={style:{flex:"1"}},x=`<span style="color:#8a8a3a">// 本地图片 — 需 import</span>
import Image from 'next/image'
import hero from '@/public/hero.jpg'

export default function Hero() {
  return (
    &lt;Image
      src={hero}            <span style="color:#7c7c99">// 导入对象，自带尺寸</span>
      alt="封面图"
      priority              <span style="color:#7c7c99">// 首屏预加载</span>
      placeholder="blur"    <span style="color:#7c7c99">// 模糊占位</span>
    /&gt;
  )
}

<span style="color:#8a8a3a">// 远程图片 — 需配置 next.config.js 域名白名单</span>
&lt;Image
  src="https://cdn.example.com/photo.jpg"
  alt="远程图"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/&gt;

<span style="color:#8a8a3a">// next.config.js</span>
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' }
    ],
    formats: ['image/avif', 'image/webp'],
  }
}`,f=m({__name:"X17NextImage",setup(I){const r=[{feat:"自动优化",desc:"WebP/AVIF 格式转换，按设备生成合适尺寸"},{feat:"懒加载",desc:'默认 loading="lazy"，进入视口才加载'},{feat:"防抖动",desc:"需指定 width/height 或 fill，避免 CLS"},{feat:"响应式",desc:"sizes 属性配合 srcset 生成多档"},{feat:"优先级",desc:"priority 属性用于首屏 LCP 图片预加载"},{feat:"占位符",desc:"blurDataURL 生成低质量模糊预览"}],i=[{aspect:"优化",nextImage:"✅ 自动",plainImg:"❌ 手动"},{aspect:"懒加载",nextImage:"✅ 默认",plainImg:"❌ 需手写"},{aspect:"格式",nextImage:"✅ AVIF/WebP",plainImg:"❌ 原图"},{aspect:"尺寸",nextImage:"✅ 响应式",plainImg:"❌ 固定"},{aspect:"CLS",nextImage:"✅ 防抖动",plainImg:"❌ 易抖动"}];return(y,t)=>(n(),l("div",d,[t[4]||(t[4]=e("h3",null,"next/image 图片优化",-1)),e("div",g,[e("div",u,[t[1]||(t[1]=e("h4",null,"核心能力",-1)),(n(),l(o,null,p(r,a=>e("div",{key:a.feat,class:"feat-card"},[e("strong",null,s(a.feat),1),e("p",null,[e("small",null,s(a.desc),1)])])),64)),t[2]||(t[2]=e("h4",{style:{"margin-top":"12px"}},"vs 原生 <img>",-1)),e("table",null,[t[0]||(t[0]=e("thead",null,[e("tr",null,[e("th",null,"维度"),e("th",null,"next/image"),e("th",null,"<img>")])],-1)),e("tbody",null,[(n(),l(o,null,p(i,a=>e("tr",{key:a.aspect},[e("td",null,s(a.aspect),1),e("td",null,s(a.nextImage),1),e("td",null,s(a.plainImg),1)])),64))])])]),e("div",{style:{flex:"1"}},[t[3]||(t[3]=e("h4",null,"代码示例",-1)),e("pre",{class:"mini-code",innerHTML:x})])])]))}}),b=c(f,[["__scopeId","data-v-b4ae4676"]]);export{b as default};
