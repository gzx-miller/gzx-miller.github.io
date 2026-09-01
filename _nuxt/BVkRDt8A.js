import{d as x,b as l,e as t,M as d,f as r,F as i,E as p,A as c,v as g,a0 as y,r as u,g as b,o,I as f}from"./DutfXOOr.js";const w={class:"demo-card tw-demo"},h={style:{display:"flex",gap:"8px","margin-bottom":"12px"}},C={key:0},k={class:"toolbar"},S={class:"class-list"},T={key:1},V={key:2},_=`<span style="color:#7c7c99">// ✅ 推荐：抽成 Vue 组件（结构复用）</span>
&lt;template&gt;
  &lt;CourseCard :course="course" /&gt;
&lt;/template&gt;

<span style="color:#7c7c99">// CourseCard.vue — 组件内部用工具类</span>
&lt;template&gt;
  &lt;div class="flex items-center gap-4 rounded-2xl p-5 shadow-lg"&gt;
    &lt;span class="text-2xl"&gt;🌰&lt;/span&gt;
    &lt;div&gt;
      &lt;strong class="text-lg"&gt;{{ course.name }}&lt;/strong&gt;
      &lt;p class="text-sm text-gray-500"&gt;{{ course.desc }}&lt;/p&gt;
    &lt;/div&gt;
    &lt;b class="text-orange-500"&gt;¥{{ course.price }}&lt;/b&gt;
  &lt;/div&gt;
&lt;/template&gt;

<span style="color:#7c7c99">// ❌ 不推荐：用 @apply 堆自定义类</span>
<span style="color:#7c7c99">/* 不要这样 */</span>
.my-card {
  @apply flex items-center gap-4 rounded-2xl p-5 shadow-lg;
  @apply text-lg font-bold;
  <span style="color:#e85d04">/* 类名丢失了工具类的自描述性 */</span>
}`,F=`<span style="color:#7c7c99">// 传统 CSS 写法</span>
.course-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,.1);
}

<span style="color:#7c7c99">// Tailwind 工具类写法（等价）</span>
&lt;div class="flex items-center gap-4 p-5 rounded-2xl shadow-lg"&gt;
  ...
&lt;/div&gt;

<span style="color:#7c7c99">// 每个类对应一条 CSS 声明</span>
<span style="color:#8a8a3a">flex</span>      → display: flex
<span style="color:#8a8a3a">items-center</span> → align-items: center
<span style="color:#8a8a3a">gap-4</span>      → gap: 1rem
<span style="color:#8a8a3a">p-5</span>        → padding: 1.25rem
<span style="color:#8a8a3a">rounded-2xl</span> → border-radius: 1rem
<span style="color:#8a8a3a">shadow-lg</span>   → box-shadow: 0 10px 24px ...`,M=x({__name:"TW01UtilityFirst",setup(N){const a=u("demo"),n=u(!1),m=b(()=>n.value?["flex","items-center","gap-2","rounded-xl","p-3","shadow-sm"]:["flex","items-center","gap-4","rounded-2xl","p-5","shadow-lg"]),v=[{category:"布局",classes:"flex, grid, block, inline-flex, items-center, justify-between",css:"display, align-items, justify-content"},{category:"间距",classes:"p-4, px-6, mt-2, gap-4, space-y-2",css:"padding, margin, gap"},{category:"尺寸",classes:"w-full, h-screen, max-w-md, min-h-0",css:"width, height, max-width"},{category:"颜色",classes:"bg-orange-500, text-white, border-gray-200",css:"background, color, border-color"},{category:"排版",classes:"text-lg, font-bold, leading-relaxed, tracking-wide",css:"font-size, font-weight, line-height"},{category:"圆角",classes:"rounded, rounded-lg, rounded-full, rounded-xl",css:"border-radius"},{category:"阴影",classes:"shadow, shadow-md, shadow-lg, shadow-none",css:"box-shadow"},{category:"响应式",classes:"md:flex, lg:grid-cols-3, sm:text-xl",css:"媒体查询前缀"},{category:"状态",classes:"hover:bg-blue-500, focus:ring-2, disabled:opacity-50",css:"伪类变体"}];return($,e)=>(o(),l("div",w,[e[9]||(e[9]=t("h3",null,"Utility-First：工具类优先",-1)),t("div",h,[t("button",{class:d(["tab-btn",{active:a.value==="demo"}]),onClick:e[0]||(e[0]=s=>a.value="demo")},"实时演示",2),t("button",{class:d(["tab-btn",{active:a.value==="mapping"}]),onClick:e[1]||(e[1]=s=>a.value="mapping")},"类名映射",2),t("button",{class:d(["tab-btn",{active:a.value==="extract"}]),onClick:e[2]||(e[2]=s=>a.value="extract")},"何时抽取组件",2)]),a.value==="demo"?(o(),l("div",C,[t("div",k,[t("button",{class:"compact-btn",onClick:e[3]||(e[3]=s=>n.value=!n.value)},"切换"+r(n.value?"舒展":"紧凑")+"密度",1)]),t("div",{class:d(["course-card",{compact:n.value}])},[...e[4]||(e[4]=[t("span",{class:"chestnut"},"🌰",-1),t("div",null,[t("strong",null,"Vue 响应式精讲"),t("p",null,"把单用途工具类组合成完整课程卡片。")],-1),t("b",null,"¥39",-1)])],2),t("div",S,[(o(!0),l(i,null,p(m.value,s=>(o(),l("code",{key:s},r(s),1))),128))]),t("pre",{class:"mini-code",innerHTML:F,style:{"margin-top":"10px"}}),e[5]||(e[5]=t("small",null,"工具类描述单一 CSS 声明；重复组合应抽成组件，而不是急着写自定义类。",-1))])):c("",!0),a.value==="mapping"?(o(),l("div",T,[t("table",null,[e[6]||(e[6]=t("thead",null,[t("tr",null,[t("th",null,"分类"),t("th",null,"常用工具类"),t("th",null,"对应 CSS")])],-1)),t("tbody",null,[(o(),l(i,null,p(v,s=>t("tr",{key:s.category},[t("td",null,[t("strong",null,r(s.category),1)]),t("td",null,[t("code",null,r(s.classes),1)]),t("td",null,[t("small",null,r(s.css),1)])])),64))])]),e[7]||(e[7]=t("div",{class:"tips-box"},[t("p",null,[t("strong",null,"设计令牌："),g("Tailwind 的间距、颜色、字号都基于预定义的令牌系统（如 "),t("code",null,"p-4 = 1rem"),g("），保证全站一致性。")])],-1))])):c("",!0),a.value==="extract"?(o(),l("div",V,[t("pre",{class:"mini-code",innerHTML:_}),e[8]||(e[8]=y('<div class="tips-box" data-v-58e8c4a4><p data-v-58e8c4a4><strong data-v-58e8c4a4>抽取时机：</strong></p><ul data-v-58e8c4a4><li data-v-58e8c4a4>同一段工具类组合<strong data-v-58e8c4a4>重复 3 次以上</strong> → 抽成组件</li><li data-v-58e8c4a4>有<strong data-v-58e8c4a4>业务语义</strong>（如&quot;课程卡片&quot;）→ 抽成组件</li><li data-v-58e8c4a4>仅缩短 class 长度 → <strong data-v-58e8c4a4>不要</strong>用 <code data-v-58e8c4a4>@apply</code>，保留工具类的自描述性</li><li data-v-58e8c4a4>样式共置在组件中，比散落在 CSS 文件更易维护</li></ul></div>',1))])):c("",!0)]))}}),L=f(M,[["__scopeId","data-v-58e8c4a4"]]);export{L as default};
