import{d as S,b as n,e as a,M as i,F as v,E as f,f as t,a0 as m,z as p,A as y,r as g,g as C,o as c,I as _}from"./DutfXOOr.js";const T={class:"demo-card tw-demo"},j={class:"tab-bar"},z={key:0},P={class:"theme-selector"},H={class:"theme-buttons"},R=["onClick"],$={class:"theme-emoji"},M={class:"preview-header"},W={class:"preview-colors"},N={class:"color-scale-demo"},A={class:"color-scale"},B={class:"scale-name"},F={class:"scale-hex"},I={key:1},L={class:"tokens-sections"},V={class:"token-table"},D={class:"example"},E={key:2},Y={class:"config-tabs"},q=["innerHTML"],G=`/** @type {import('tailwindcss').Config} */
module.exports = {
  <span style="color:#7c7c99">// 扩展预设主题</span>
  theme: {
    extend: {
      <span style="color:#7c7c99">// 自定义颜色</span>
      colors: {
        <span style="color:#8a8a3a">autumn</span>: {
          50: <span style="color:#a31414">'#fff7ed'</span>,
          100: <span style="color:#a31414">'#ffedd5'</span>,
          200: <span style="color:#a31414">'#fed7aa'</span>,
          300: <span style="color:#a31414">'#fdba74'</span>,
          400: <span style="color:#a31414">'#fb923c'</span>,
          500: <span style="color:#a31414">'#f97316'</span>,
          600: <span style="color:#a31414">'#ea580c'</span>,
          700: <span style="color:#a31414">'#c2410c'</span>,
          800: <span style="color:#a31414">'#9a3412'</span>,
          900: <span style="color:#a31414">'#7c2d12'</span>,
        },
        <span style="color:#8a8a3a">forest</span>: <span style="color:#a31414">'#166534'</span>,
      },

      <span style="color:#7c7c99">// 自定义字体</span>
      fontFamily: {
        <span style="color:#8a8a3a">sans</span>: [<span style="color:#a31414">'Inter'</span>, <span style="color:#a31414">'system-ui'</span>, <span style="color:#a31414">'sans-serif'</span>],
        <span style="color:#8a8a3a">serif</span>: [<span style="color:#a31414">'Merriweather'</span>, <span style="color:#a31414">'serif'</span>],
      },

      <span style="color:#7c7c99">// 自定义间距</span>
      spacing: {
        <span style="color:#8a8a3a">'128'</span>: <span style="color:#a31414">'32rem'</span>,
        <span style="color:#8a8a3a">'144'</span>: <span style="color:#a31414">'36rem'</span>,
      },

      <span style="color:#7c7c99">// 自定义动画</span>
      animation: {
        <span style="color:#8a8a3a">'float'</span>: <span style="color:#a31414">'float 3s ease-in-out infinite'</span>,
      },
      keyframes: {
        float: {
          <span style="color:#8a8a3a">'0%, 100%'</span>: { transform: <span style="color:#a31414">'translateY(0)'</span> },
          <span style="color:#8a8a3a">'50%'</span>: { transform: <span style="color:#a31414">'translateY(-10px)'</span> },
        }
      }
    }
  }
}`,J=`<span style="color:#7c7c99">// 设计系统配置示例</span>
<span style="color:#7c7c99">// tailwind.config.js</span>
module.exports = {
  theme: {
    extend: {
      <span style="color:#7c7c99">// 色彩系统</span>
      colors: {
        primary: { ... },   <span style="color:#7c7c99">// 主色</span>
        secondary: { ... }, <span style="color:#7c7c99">// 辅色</span>
        accent: { ... },    <span style="color:#7c7c99">// 强调色</span>
        neutral: { ... },   <span style="color:#7c7c99">// 中性色</span>
        success: { ... },   <span style="color:#7c7c99">// 成功色</span>
        warning: { ... },   <span style="color:#7c7c99">// 警告色</span>
        danger: { ... },    <span style="color:#7c7c99">// 危险色</span>
      },

      <span style="color:#7c7c99">// 字体系统</span>
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
      },

      <span style="color:#7c7c99">// 间距系统（4px 基准）</span>
      spacing: {
        'xs': '0.25rem',   <span style="color:#7c7c99">// 4px</span>
        'sm': '0.5rem',    <span style="color:#7c7c99">// 8px</span>
        'md': '1rem',      <span style="color:#7c7c99">// 16px</span>
        'lg': '1.5rem',    <span style="color:#7c7c99">// 24px</span>
        'xl': '2rem',      <span style="color:#7c7c99">// 32px</span>
      },

      <span style="color:#7c7c99">// 圆角系统</span>
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
        'pill': '9999px',
      },

      <span style="color:#7c7c99">// 阴影系统</span>
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    }
  }
}`,K=S({__name:"TW24Preset",setup(O){const l=g("colors"),u=g("autumn"),r=g(!1),x=[{id:"autumn",name:"秋日森林",emoji:"🍁",primary:"#ea580c",secondary:"#d97706",accent:"#dc2626",bg:"#fff7ed",text:"#7c2d12",description:"暖橙调，枫叶红，松果棕"},{id:"spring",name:"春日新绿",emoji:"🌱",primary:"#16a34a",secondary:"#0891b2",accent:"#7c3aed",bg:"#f0fdf4",text:"#14532d",description:"嫩绿芽，溪水蓝，紫花绽"},{id:"summer",name:"夏日晴空",emoji:"☀️",primary:"#2563eb",secondary:"#0ea5e9",accent:"#f59e0b",bg:"#eff6ff",text:"#1e3a8a",description:"天空蓝，阳光黄，海风吹"},{id:"winter",name:"冬日暖阳",emoji:"❄️",primary:"#6366f1",secondary:"#8b5cf6",accent:"#f43f5e",bg:"#eef2ff",text:"#312e81",description:"靛蓝紫，玫红暖，白雪皑"}],d=C(()=>x.find(h=>h.id===u.value)||x[0]),w=[{name:"50",light:!0},{name:"100",light:!0},{name:"200",light:!0},{name:"300",light:!1},{name:"400",light:!1},{name:"500",light:!1},{name:"600",light:!1},{name:"700",light:!1},{name:"800",light:!1},{name:"900",light:!1},{name:"950",light:!1}],b=["#fff7ed","#ffedd5","#fed7aa","#fdba74","#fb923c","#f97316","#ea580c","#c2410c","#9a3412","#7c2d12","#431407"],k=[{category:"间距",tokens:[{name:"spacing.0",value:"0px",example:"p-0"},{name:"spacing.1",value:"0.25rem (4px)",example:"p-1"},{name:"spacing.2",value:"0.5rem (8px)",example:"p-2"},{name:"spacing.4",value:"1rem (16px)",example:"p-4"},{name:"spacing.8",value:"2rem (32px)",example:"p-8"}]},{category:"字号",tokens:[{name:"fontSize.xs",value:"0.75rem (12px)",example:"text-xs"},{name:"fontSize.sm",value:"0.875rem (14px)",example:"text-sm"},{name:"fontSize.base",value:"1rem (16px)",example:"text-base"},{name:"fontSize.lg",value:"1.125rem (18px)",example:"text-lg"},{name:"fontSize.xl",value:"1.25rem (20px)",example:"text-xl"}]},{category:"圆角",tokens:[{name:"borderRadius.sm",value:"0.25rem (4px)",example:"rounded-sm"},{name:"borderRadius.md",value:"0.375rem (6px)",example:"rounded-md"},{name:"borderRadius.lg",value:"0.5rem (8px)",example:"rounded-lg"},{name:"borderRadius.xl",value:"0.75rem (12px)",example:"rounded-xl"},{name:"borderRadius.full",value:"9999px",example:"rounded-full"}]},{category:"阴影",tokens:[{name:"boxShadow.sm",value:"0 1px 2px rgb(0 0 0 / 0.05)",example:"shadow-sm"},{name:"boxShadow.md",value:"0 4px 6px -1px rgb(0 0 0 / 0.1)",example:"shadow-md"},{name:"boxShadow.lg",value:"0 10px 15px -3px rgb(0 0 0 / 0.1)",example:"shadow-lg"},{name:"boxShadow.xl",value:"0 20px 25px -5px rgb(0 0 0 / 0.1)",example:"shadow-xl"}]}];return(h,e)=>(c(),n("div",T,[e[18]||(e[18]=a("h3",null,"主题预设与设计系统配置",-1)),a("div",j,[a("button",{class:i(["tab-btn",{active:l.value==="colors"}]),onClick:e[0]||(e[0]=s=>l.value="colors")},"色彩系统",2),a("button",{class:i(["tab-btn",{active:l.value==="tokens"}]),onClick:e[1]||(e[1]=s=>l.value="tokens")},"设计令牌",2),a("button",{class:i(["tab-btn",{active:l.value==="preset"}]),onClick:e[2]||(e[2]=s=>l.value="preset")},"Preset 配置",2)]),l.value==="colors"?(c(),n("div",z,[a("div",P,[e[5]||(e[5]=a("h4",null,"🎨 主题切换演示",-1)),a("div",H,[(c(),n(v,null,f(x,s=>a("button",{key:s.id,class:i(["theme-btn",{active:u.value===s.id}]),style:p({"--theme-primary":s.primary}),onClick:o=>u.value=s.id},[a("span",$,t(s.emoji),1),a("span",null,t(s.name),1)],14,R)),64))])]),a("div",{class:"theme-preview",style:p({"--primary":d.value.primary,"--secondary":d.value.secondary,"--accent":d.value.accent,"--bg":d.value.bg,"--text":d.value.text})},[a("div",M,[a("h5",null,t(d.value.emoji)+" "+t(d.value.name),1),a("p",null,t(d.value.description),1)]),e[9]||(e[9]=m('<div class="preview-content" data-v-98ad6cef><div class="preview-card main" data-v-98ad6cef><div class="pc-icon" data-v-98ad6cef>🏕️</div><h6 data-v-98ad6cef>森林露营</h6><p data-v-98ad6cef>体验秋日森林的宁静与美好</p><button class="preview-btn primary" data-v-98ad6cef>立即预订</button></div><div class="preview-card secondary" data-v-98ad6cef><div class="pc-icon" data-v-98ad6cef>🍂</div><h6 data-v-98ad6cef>枫叶漫步</h6><p data-v-98ad6cef>踏着金色落叶走进深秋</p><button class="preview-btn secondary" data-v-98ad6cef>了解更多</button></div><div class="preview-card accent" data-v-98ad6cef><div class="pc-icon" data-v-98ad6cef>🔥</div><h6 data-v-98ad6cef>篝火晚会</h6><p data-v-98ad6cef>星光下的温暖聚会</p><button class="preview-btn accent" data-v-98ad6cef>参加活动</button></div></div>',1)),a("div",W,[a("div",{class:"color-swatch",style:p({backgroundColor:d.value.primary})},[...e[6]||(e[6]=[a("span",null,"Primary",-1)])],4),a("div",{class:"color-swatch",style:p({backgroundColor:d.value.secondary})},[...e[7]||(e[7]=[a("span",null,"Secondary",-1)])],4),a("div",{class:"color-swatch",style:p({backgroundColor:d.value.accent})},[...e[8]||(e[8]=[a("span",null,"Accent",-1)])],4)])],4),a("div",N,[e[10]||(e[10]=a("h4",null,"🌈 色彩色阶（以橙色为例）",-1)),a("div",A,[(c(),n(v,null,f(w,(s,o)=>a("div",{key:s.name,class:i(["scale-item",{light:s.light}]),style:p({backgroundColor:b[o]})},[a("span",B,t(s.name),1),a("span",F,t(b[o]),1)],6)),64))]),e[11]||(e[11]=a("small",{class:"scale-note"},"Tailwind 默认提供 11 级色阶（50-950），数值越大颜色越深",-1))]),e[12]||(e[12]=a("div",{class:"tips-box"},[a("p",null,[a("strong",null,"色彩系统设计要点：")]),a("ul",null,[a("li",null,"主色（Primary）：品牌识别色，用于主要按钮、强调元素"),a("li",null,"辅色（Secondary）：衬托主色，用于次要操作、装饰元素"),a("li",null,"强调色（Accent）：突出重要信息，如警示、促销标签"),a("li",null,"中性色（Neutral）：文字、背景、边框，占比最大"),a("li",null,"功能色：成功（绿）、警告（黄）、危险（红）、信息（蓝）")])],-1))])):y("",!0),l.value==="tokens"?(c(),n("div",I,[e[14]||(e[14]=a("div",{class:"tokens-intro"},[a("h4",null,"🔖 设计令牌（Design Tokens）"),a("p",null,"设计令牌是设计系统的最小单元，将颜色、间距、字号、圆角等抽象为可复用的变量，确保设计一致性。")],-1)),a("div",L,[(c(),n(v,null,f(k,s=>a("div",{key:s.category,class:"token-section"},[a("h5",null,t(s.category),1),a("table",V,[e[13]||(e[13]=a("thead",null,[a("tr",null,[a("th",null,"令牌名"),a("th",null,"值"),a("th",null,"类名示例")])],-1)),a("tbody",null,[(c(!0),n(v,null,f(s.tokens,o=>(c(),n("tr",{key:o.name},[a("td",null,[a("code",null,t(o.name),1)]),a("td",null,t(o.value),1),a("td",null,[a("code",D,t(o.example),1)])]))),128))])])])),64))]),e[15]||(e[15]=m('<div class="token-visual" data-v-98ad6cef><h5 data-v-98ad6cef>📐 间距系统可视化</h5><div class="spacing-demo" data-v-98ad6cef><div class="spacing-item" data-v-98ad6cef><div class="spacing-box p-1" data-v-98ad6cef>p-1</div><span data-v-98ad6cef>4px</span></div><div class="spacing-item" data-v-98ad6cef><div class="spacing-box p-2" data-v-98ad6cef>p-2</div><span data-v-98ad6cef>8px</span></div><div class="spacing-item" data-v-98ad6cef><div class="spacing-box p-4" data-v-98ad6cef>p-4</div><span data-v-98ad6cef>16px</span></div><div class="spacing-item" data-v-98ad6cef><div class="spacing-box p-6" data-v-98ad6cef>p-6</div><span data-v-98ad6cef>24px</span></div><div class="spacing-item" data-v-98ad6cef><div class="spacing-box p-8" data-v-98ad6cef>p-8</div><span data-v-98ad6cef>32px</span></div></div></div><div class="token-visual" data-v-98ad6cef><h5 data-v-98ad6cef>🔵 圆角系统可视化</h5><div class="radius-demo" data-v-98ad6cef><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-sm" data-v-98ad6cef>sm</div><span data-v-98ad6cef>4px</span></div><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-md" data-v-98ad6cef>md</div><span data-v-98ad6cef>6px</span></div><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-lg" data-v-98ad6cef>lg</div><span data-v-98ad6cef>8px</span></div><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-xl" data-v-98ad6cef>xl</div><span data-v-98ad6cef>12px</span></div><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-2xl" data-v-98ad6cef>2xl</div><span data-v-98ad6cef>16px</span></div><div class="radius-item" data-v-98ad6cef><div class="radius-box rounded-full" data-v-98ad6cef>full</div><span data-v-98ad6cef>9999px</span></div></div></div><div class="tips-box" data-v-98ad6cef><p data-v-98ad6cef><strong data-v-98ad6cef>设计令牌优势：</strong></p><ul data-v-98ad6cef><li data-v-98ad6cef>一致性：全站使用统一的设计规范</li><li data-v-98ad6cef>可维护：修改令牌即全局生效</li><li data-v-98ad6cef>可扩展：新增主题只需扩展令牌</li><li data-v-98ad6cef>协作：设计与开发共享同一套语言</li></ul></div>',3))])):y("",!0),l.value==="preset"?(c(),n("div",E,[e[16]||(e[16]=m('<div class="preset-intro" data-v-98ad6cef><h4 data-v-98ad6cef>⚙️ Tailwind Preset 预设</h4><p data-v-98ad6cef>Preset 是可复用的 Tailwind 配置包，可以将设计系统封装成预设，在多个项目间共享。</p></div><div class="preset-workflow" data-v-98ad6cef><div class="wf-step" data-v-98ad6cef><span class="wf-num" data-v-98ad6cef>1</span><div class="wf-content" data-v-98ad6cef><strong data-v-98ad6cef>创建预设包</strong><p data-v-98ad6cef>将主题配置、插件、自定义工具类打包成 npm 包</p></div></div><div class="wf-arrow" data-v-98ad6cef>→</div><div class="wf-step" data-v-98ad6cef><span class="wf-num" data-v-98ad6cef>2</span><div class="wf-content" data-v-98ad6cef><strong data-v-98ad6cef>项目中引用</strong><p data-v-98ad6cef>在 tailwind.config.js 的 presets 数组中引入</p></div></div><div class="wf-arrow" data-v-98ad6cef>→</div><div class="wf-step" data-v-98ad6cef><span class="wf-num" data-v-98ad6cef>3</span><div class="wf-content" data-v-98ad6cef><strong data-v-98ad6cef>项目级覆盖</strong><p data-v-98ad6cef>项目配置可以覆盖和扩展预设中的设置</p></div></div></div>',2)),a("div",Y,[a("button",{class:i({active:!r.value}),onClick:e[3]||(e[3]=s=>r.value=!1)},"基础扩展",2),a("button",{class:i({active:r.value}),onClick:e[4]||(e[4]=s=>r.value=!0)},"设计系统",2)]),a("pre",{class:"mini-code",innerHTML:r.value?J:G},null,8,q),e[17]||(e[17]=m('<div class="preset-examples" data-v-98ad6cef><h5 data-v-98ad6cef>📦 常用预设包</h5><div class="preset-list" data-v-98ad6cef><div class="preset-item" data-v-98ad6cef><span class="preset-icon" data-v-98ad6cef>🎨</span><div data-v-98ad6cef><strong data-v-98ad6cef>tailwindcss/themes</strong><p data-v-98ad6cef>多主题切换预设</p></div></div><div class="preset-item" data-v-98ad6cef><span class="preset-icon" data-v-98ad6cef>📐</span><div data-v-98ad6cef><strong data-v-98ad6cef>tailwindcss/typography</strong><p data-v-98ad6cef>排版样式预设</p></div></div><div class="preset-item" data-v-98ad6cef><span class="preset-icon" data-v-98ad6cef>🌈</span><div data-v-98ad6cef><strong data-v-98ad6cef>@tailwindcss/forms</strong><p data-v-98ad6cef>表单样式预设</p></div></div><div class="preset-item" data-v-98ad6cef><span class="preset-icon" data-v-98ad6cef>🏢</span><div data-v-98ad6cef><strong data-v-98ad6cef>企业自定义预设</strong><p data-v-98ad6cef>公司内部设计系统</p></div></div></div></div><div class="tips-box" data-v-98ad6cef><p data-v-98ad6cef><strong data-v-98ad6cef>Preset 使用技巧：</strong></p><ul data-v-98ad6cef><li data-v-98ad6cef><code data-v-98ad6cef>presets</code> 数组可以包含多个预设，后面的优先级更高</li><li data-v-98ad6cef>项目配置总是覆盖预设中的相同配置</li><li data-v-98ad6cef>预设可以嵌套其他预设，构建层级化的配置体系</li><li data-v-98ad6cef>适合大型团队、多项目复用设计系统</li><li data-v-98ad6cef>配合 Monorepo 管理多个预设包更高效</li></ul></div>',2))])):y("",!0)]))}}),U=_(K,[["__scopeId","data-v-98ad6cef"]]);export{U as default};
