import{d as l,b as i,e as s,M as o,y as n,A as e,a0 as r,r as v,o as d,I as p}from"./DutfXOOr.js";const f={class:"demo-container"},m={class:"controls"},b={key:0,class:"perf-demo"},g={key:1,class:"perf-demo"},y={key:2,class:"perf-demo"},u={key:3,class:"perf-demo"},k=l({__name:"C20Performance",setup(w){const t=v("will-change");return(C,a)=>(d(),i("div",f,[a[8]||(a[8]=s("h3",{class:"demo-title"},"CSS 性能优化",-1)),a[9]||(a[9]=s("p",{class:"demo-desc"},"理解渲染阻塞、图层提升、动画性能与 content-visibility 等优化手段。",-1)),s("div",m,[s("button",{class:o(["btn",{active:n(t)==="will-change"}]),onClick:a[0]||(a[0]=c=>t.value="will-change")},"will-change",2),s("button",{class:o(["btn",{active:n(t)==="layer"}]),onClick:a[1]||(a[1]=c=>t.value="layer")},"图层提升",2),s("button",{class:o(["btn",{active:n(t)==="content-visibility"}]),onClick:a[2]||(a[2]=c=>t.value="content-visibility")},"content-visibility",2),s("button",{class:o(["btn",{active:n(t)==="best-practice"}]),onClick:a[3]||(a[3]=c=>t.value="best-practice")},"最佳实践",2)]),n(t)==="will-change"?(d(),i("div",b,[...a[4]||(a[4]=[s("div",{class:"perf-box bad"},"未优化：动画导致整页重绘",-1),s("div",{class:"perf-box good"},"优化后：will-change 提前创建图层",-1),s("pre",{class:"code-block"},`/* ❌ 避免滥用 */
.will-change-everything { will-change: transform, opacity, scroll-position; }

/* ✅ 只在需要前设置，用完后移除 */
.animated { will-change: transform; transition: transform 0.3s; }`,-1)])])):e("",!0),n(t)==="layer"?(d(),i("div",g,[...a[5]||(a[5]=[r(`<div class="layer-demo" data-v-cd696a9f><div class="box layer-promoted" data-v-cd696a9f>已提升图层（transform: translateZ(0)）</div><div class="box no-layer" data-v-cd696a9f>未提升（可能触发重绘）</div></div><pre class="code-block" data-v-cd696a9f>/* 提升为独立合成层（常用技巧）*/
.promote { transform: translateZ(0); }
/* 或 */
.promote { will-change: transform; }</pre><p class="note" data-v-cd696a9f>⚠️ 图层过多会占用大量 GPU 内存，反而降低性能。</p>`,3)])])):e("",!0),n(t)==="content-visibility"?(d(),i("div",y,[...a[6]||(a[6]=[r(`<pre class="code-block" data-v-cd696a9f>/* 跳过屏幕外内容的渲染工作 */
.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* 预留高度，避免滚动跳变 */
}

/* contain 属性：限制渲染范围 */
.contained {
  contain: layout style paint;
}</pre><div class="prop-table" data-v-cd696a9f><div class="prop-row header" data-v-cd696a9f><span data-v-cd696a9f>属性</span><span data-v-cd696a9f>作用</span></div><div class="prop-row" data-v-cd696a9f><span data-v-cd696a9f>content-visibility</span><span data-v-cd696a9f>跳过离屏元素的渲染</span></div><div class="prop-row" data-v-cd696a9f><span data-v-cd696a9f>contain</span><span data-v-cd696a9f>限制渲染/布局边界</span></div><div class="prop-row" data-v-cd696a9f><span data-v-cd696a9f>contain-intrinsic-size</span><span data-v-cd696a9f>为 content-visibility 预留尺寸</span></div></div>`,2)])])):e("",!0),n(t)==="best-practice"?(d(),i("div",u,[...a[7]||(a[7]=[r(`<div class="tips" data-v-cd696a9f><div class="tip" data-v-cd696a9f>🚀 <strong data-v-cd696a9f>动画优先用 transform / opacity</strong>：这两个属性可由 GPU 合成，不触发重排重绘。</div><div class="tip" data-v-cd696a9f>📦 <strong data-v-cd696a9f>减少选择器嵌套深度</strong>：浏览器从右向左解析，深度过大影响匹配速度。</div><div class="tip" data-v-cd696a9f>🔽 <strong data-v-cd696a9f>避免 @import</strong>：阻塞渲染，改用 &lt;link&gt; 或打包工具合并。</div><div class="tip" data-v-cd696a9f>🎯 <strong data-v-cd696a9f>避免频繁读写布局属性</strong>：会强制同步布局（layout thrashing），应批量读取/写入。</div><div class="tip" data-v-cd696a9f>🧹 <strong data-v-cd696a9f>移除未使用的 CSS</strong>：使用 PurgeCSS 或构建工具按需保留。</div></div><pre class="code-block" data-v-cd696a9f>/* ✅ 高性能动画属性 */
.animate-good { transition: transform 0.3s, opacity 0.3s; }

/* ❌ 触发重排的属性 */
.animate-bad { transition: width 0.3s, height 0.3s, margin 0.3s; }</pre>`,2)])])):e("",!0)]))}}),S=p(k,[["__scopeId","data-v-cd696a9f"]]);export{S as default};
