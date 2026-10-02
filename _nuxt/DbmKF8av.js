import{d as i,b as t,e,M as n,y as d,a0 as o,A as v,r as p,o as c,F as l}from"./CfJSWYGO.js";const m={class:"demo-container"},b={class:"controls"},u={key:0,class:"method-demo"},S={key:1,class:"method-demo"},_={key:2,class:"method-demo"},f=i({__name:"C19BEM",setup(g){const s=p("bem");return(C,a)=>(c(),t("div",m,[a[6]||(a[6]=e("h3",{class:"demo-title"},"CSS 架构方法论",-1)),a[7]||(a[7]=e("p",{class:"demo-desc"},"用课程卡片组件理解 BEM / OOCSS / SMACSS 的命名与组织思路。",-1)),e("div",b,[e("button",{class:n(["btn",{active:d(s)==="bem"}]),onClick:a[0]||(a[0]=r=>s.value="bem")},"BEM",2),e("button",{class:n(["btn",{active:d(s)==="oocss"}]),onClick:a[1]||(a[1]=r=>s.value="oocss")},"OOCSS",2),e("button",{class:n(["btn",{active:d(s)==="smacss"}]),onClick:a[2]||(a[2]=r=>s.value="smacss")},"SMACSS",2)]),d(s)==="bem"?(c(),t("div",u,[...a[3]||(a[3]=[o(`<div class="card card--hot" data-v-ea24c072><div class="card__header" data-v-ea24c072>Vue3 组合式 API</div><div class="card__body" data-v-ea24c072>深入理解 setup 与响应式原理。</div><span class="card__badge" data-v-ea24c072>热门</span></div><pre class="code-block" data-v-ea24c072>/* BEM：Block__Element--Modifier */
.card { /* 块 */ }
.card__header { /* 元素 */ }
.card--hot { /* 修饰符 */ }
.card__badge { /* 子元素 */ }</pre><div class="rules" data-v-ea24c072><p data-v-ea24c072>✅ 优点：类名语义清晰、无嵌套、可预测</p><p data-v-ea24c072>⚠️ 缺点：类名较长、HTML 较重</p></div>`,3)])])):v("",!0),d(s)==="oocss"?(c(),t("div",S,[...a[4]||(a[4]=[o(`<div class="media flex-row bg-white" data-v-ea24c072><img class="media__img rounded" src="data:image/svg+xml,%3Csvg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;48&#39; height=&#39;48&#39;%3E%3Crect fill=&#39;%23e8590c&#39; width=&#39;48&#39; height=&#39;48&#39; rx=&#39;8&#39;/%3E%3C/svg%3E" data-v-ea24c072><div class="media__body" data-v-ea24c072><div class="text-bold" data-v-ea24c072>课程标题</div><div class="text-muted" data-v-ea24c072>描述文字</div></div></div><pre class="code-block" data-v-ea24c072>/* OOCSS：结构与皮肤分离 */
.flex-row { display: flex; gap: 8px; }  /* 结构 */
.bg-white { background: #fff; }        /* 皮肤 */
.text-bold { font-weight: 700; }        /* 修饰 */
.text-muted { color: #868e96; }       /* 修饰 */</pre>`,2)])])):v("",!0),d(s)==="smacss"?(c(),t("div",_,[...a[5]||(a[5]=[o(`<pre class="code-block" data-v-ea24c072>/* SMACSS：按角色分 5 类 */
/* l- 布局 */
.l-sidebar { grid-area: sidebar; }

/* m- 模块 */
.m-course-card { border: 1px solid #ffd8a8; }

/* s- 状态 */
.s-is-active { background: #e8590c; color: #fff; }

/* t- 主题 */
.t-dark .m-course-card { background: #333; }

/* 基础样式 */
h3, p { margin: 0 0 8px; }</pre><div class="prop-table" data-v-ea24c072><div class="prop-row header" data-v-ea24c072><span data-v-ea24c072>方法</span><span data-v-ea24c072>核心思想</span><span data-v-ea24c072>适用场景</span></div><div class="prop-row" data-v-ea24c072><span data-v-ea24c072>BEM</span><span data-v-ea24c072>块 / 元素 / 修饰符</span><span data-v-ea24c072>组件化项目</span></div><div class="prop-row" data-v-ea24c072><span data-v-ea24c072>OOCSS</span><span data-v-ea24c072>结构与皮肤分离</span><span data-v-ea24c072>可复用 UI 库</span></div><div class="prop-row" data-v-ea24c072><span data-v-ea24c072>SMACSS</span><span data-v-ea24c072>按角色分类选择器</span><span data-v-ea24c072>大型遗留项目</span></div><div class="prop-row" data-v-ea24c072><span data-v-ea24c072>CSS Modules</span><span data-v-ea24c072>局部作用域（哈希）</span><span data-v-ea24c072>现代工程化项目</span></div></div>`,2)])])):v("",!0)]))}}),w=l(f,[["__scopeId","data-v-ea24c072"]]);export{w as default};
