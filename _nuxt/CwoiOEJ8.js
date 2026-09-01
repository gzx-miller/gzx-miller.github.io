import{d as l,b as c,e as s,F as r,E as i,f as o,r as m,o as p,M as d,I as u}from"./DutfXOOr.js";const _={class:"v04"},g={class:"tabs"},v=["onClick"],f={class:"code-block"},h=l({__name:"V04HMR",setup(R){const t=m("hmr"),e={hmr:`// Vite HMR API（手动处理边界情况）
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
// @refresh reset  // 强制重置状态`};return(M,n)=>(p(),c("div",_,[n[0]||(n[0]=s("p",{class:"intro"},"Vite 的 HMR 基于原生 ESM，只更新变化的模块，速度极快。",-1)),s("div",g,[(p(),c(r,null,i(e,(k,a)=>s("button",{key:a,class:d({active:t.value===a}),onClick:H=>t.value=a},o(a),11,v)),64))]),s("pre",f,[s("code",null,o(e[t.value]),1)])]))}}),y=u(h,[["__scopeId","data-v-b8778391"]]);export{y as default};
