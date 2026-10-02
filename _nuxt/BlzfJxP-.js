import{d as r,b as n,e as s,M as d,y as e,A as o,a0 as c,r as l,o as i,F as v}from"./CfJSWYGO.js";const p={class:"demo-container"},m={class:"controls"},g={key:0,class:"perf-demo"},y={key:1,class:"perf-demo"},f={key:2,class:"perf-demo"},u={key:3,class:"perf-demo"},k=r({__name:"C20Performance",setup(w){const a=l("will-change");return(C,t)=>(i(),n("div",p,[t[8]||(t[8]=s("h3",{class:"demo-title"},"CSS 性能优化",-1)),t[9]||(t[9]=s("p",{class:"demo-desc"},"理解渲染阻塞、图层提升、动画性能与 content-visibility 等优化手段。",-1)),s("div",m,[s("button",{class:d(["btn",{active:e(a)==="will-change"}]),onClick:t[0]||(t[0]=b=>a.value="will-change")},"will-change",2),s("button",{class:d(["btn",{active:e(a)==="layer"}]),onClick:t[1]||(t[1]=b=>a.value="layer")},"图层提升",2),s("button",{class:d(["btn",{active:e(a)==="content-visibility"}]),onClick:t[2]||(t[2]=b=>a.value="content-visibility")},"content-visibility",2),s("button",{class:d(["btn",{active:e(a)==="best-practice"}]),onClick:t[3]||(t[3]=b=>a.value="best-practice")},"最佳实践",2)]),e(a)==="will-change"?(i(),n("div",g,[...t[4]||(t[4]=[s("div",{class:"perf-box bad"},"未优化：动画导致整页重绘",-1),s("div",{class:"perf-box good"},"优化后：will-change 提前创建图层",-1),s("pre",{class:"code-block"},`/* ❌ 避免滥用 */
.will-change-everything { will-change: transform, opacity, scroll-position; }

/* ✅ 只在需要前设置，用完后移除 */
.animated { will-change: transform; transition: transform 0.3s; }`,-1)])])):o("",!0),e(a)==="layer"?(i(),n("div",y,[...t[5]||(t[5]=[c(`<div class="layer-demo" data-v-b4cebdb6><div class="box layer-promoted" data-v-b4cebdb6>已提升图层（transform: translateZ(0)）</div><div class="box no-layer" data-v-b4cebdb6>未提升（可能触发重绘）</div></div><pre class="code-block" data-v-b4cebdb6>/* 提升为独立合成层（常用技巧）*/
.promote { transform: translateZ(0); }
/* 或 */
.promote { will-change: transform; }</pre><p class="note" data-v-b4cebdb6>⚠️ 图层过多会占用大量 GPU 内存，反而降低性能。</p>`,3)])])):o("",!0),e(a)==="content-visibility"?(i(),n("div",f,[...t[6]||(t[6]=[c(`<pre class="code-block" data-v-b4cebdb6>/* 跳过屏幕外内容的渲染工作 */
.lazy-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* 预留高度，避免滚动跳变 */
}

/* contain 属性：限制渲染范围 */
.contained {
  contain: layout style paint;
}</pre><div class="prop-table" data-v-b4cebdb6><div class="prop-row header" data-v-b4cebdb6><span data-v-b4cebdb6>属性</span><span data-v-b4cebdb6>作用</span></div><div class="prop-row" data-v-b4cebdb6><span data-v-b4cebdb6>content-visibility</span><span data-v-b4cebdb6>跳过离屏元素的渲染</span></div><div class="prop-row" data-v-b4cebdb6><span data-v-b4cebdb6>contain</span><span data-v-b4cebdb6>限制渲染/布局边界</span></div><div class="prop-row" data-v-b4cebdb6><span data-v-b4cebdb6>contain-intrinsic-size</span><span data-v-b4cebdb6>为 content-visibility 预留尺寸</span></div></div>`,2)])])):o("",!0),e(a)==="best-practice"?(i(),n("div",u,[...t[7]||(t[7]=[c(`<div class="tips" data-v-b4cebdb6><div class="tip" data-v-b4cebdb6>🚀 <strong data-v-b4cebdb6>动画优先用 transform / opacity</strong>：这两个属性可由 GPU 合成，不触发重排重绘。</div><div class="tip" data-v-b4cebdb6>📦 <strong data-v-b4cebdb6>减少选择器嵌套深度</strong>：浏览器从右向左解析，深度过大影响匹配速度。</div><div class="tip" data-v-b4cebdb6>🔽 <strong data-v-b4cebdb6>避免 @import</strong>：阻塞渲染，改用 &lt;link&gt; 或打包工具合并。</div><div class="tip" data-v-b4cebdb6>🎯 <strong data-v-b4cebdb6>避免频繁读写布局属性</strong>：会强制同步布局（layout thrashing），应批量读取/写入。</div><div class="tip" data-v-b4cebdb6>🧹 <strong data-v-b4cebdb6>移除未使用的 CSS</strong>：使用 PurgeCSS 或构建工具按需保留。</div></div><pre class="code-block" data-v-b4cebdb6>/* ✅ 高性能动画属性 */
.animate-good { transition: transform 0.3s, opacity 0.3s; }

/* ❌ 触发重排的属性 */
.animate-bad { transition: width 0.3s, height 0.3s, margin 0.3s; }</pre>`,2)])])):o("",!0)]))}}),S=v(k,[["__scopeId","data-v-b4cebdb6"]]);export{S as default};
