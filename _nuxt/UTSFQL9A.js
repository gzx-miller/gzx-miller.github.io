import{d as i,b as r,e as t,F as u,E as d,f as a,a0 as m,r as f,o as l,M as v,I as g}from"./DutfXOOr.js";const y={class:"demo-card"},A={style:{display:"flex",gap:"16px","margin-bottom":"12px"}},_={style:{flex:"1"}},x=["onClick"],b={class:"step-num"},C={style:{flex:"1"}},k={class:"mini-code"},S=`<span style="color:#8a8a3a">&lt;!-- App.vue 单文件组件 --&gt;</span>
&lt;script setup lang="ts"&gt;
import { ref } from 'vue'
const count = ref(0)
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="count++"&gt;{{ count }}&lt;/button&gt;
&lt;/template&gt;

&lt;style scoped&gt;
button { color: #e85d04; }
&lt;/style&gt;`,E=`<span style="color:#8a8a3a">// main.ts — 完整入口</span>
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

<span style="color:#7c7c99">// 注册插件（顺序：先依赖，后业务）</span>
app.use(createPinia())
app.use(router)

<span style="color:#7c7c99">// 全局错误处理</span>
app.config.errorHandler = (err) => {
  console.error('Vue 错误：', err)
}

<span style="color:#7c7c99">// 挂载到 DOM</span>
app.mount('#app')`,F=i({__name:"K01AppEntry",setup(P){const o=f(0),p=[{title:"createApp",desc:"创建独立的应用实例，隔离全局配置",code:`import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)`},{title:"注册插件",desc:"Router、Pinia 等跨页面能力在此接入",code:`import router from './router'
import { createPinia } from 'pinia'

app.use(router)
app.use(createPinia())`},{title:"挂载",desc:"把 Vue 接管到 #app 挂载点",code:"app.mount('#app')"}];function c(){o.value=(o.value+1)%p.length}return(V,e)=>(l(),r("div",y,[e[2]||(e[2]=t("h3",null,"应用创建、入口挂载、SFC 结构",-1)),t("div",A,[t("div",_,[e[0]||(e[0]=t("h4",null,"启动三步曲（点击下一步）",-1)),(l(),r(u,null,d(p,(n,s)=>t("div",{class:v(["step-card",{active:o.value===s}]),key:s,onClick:M=>o.value=s},[t("span",b,a(s+1),1),t("strong",null,a(n.title),1),t("p",null,[t("small",null,a(n.desc),1)])],10,x)),64)),t("button",{class:"btn",onClick:c},"下一步 →")]),t("div",C,[e[1]||(e[1]=t("h4",null,"当前步骤代码",-1)),t("pre",k,a(p[o.value].code),1)])]),e[3]||(e[3]=t("h4",null,"完整入口文件",-1)),t("pre",{class:"mini-code",innerHTML:E}),e[4]||(e[4]=t("h4",null,"单文件组件 (SFC) 结构",-1)),t("pre",{class:"mini-code",innerHTML:S}),e[5]||(e[5]=m('<div class="tips-box" data-v-27664fc0><p data-v-27664fc0><strong data-v-27664fc0>要点：</strong></p><ul data-v-27664fc0><li data-v-27664fc0><code data-v-27664fc0>createApp</code> 创建独立实例，多个应用互不干扰</li><li data-v-27664fc0><code data-v-27664fc0>app.use()</code> 注册插件，必须在 <code data-v-27664fc0>mount</code> 之前</li><li data-v-27664fc0>入口只放装配逻辑，不放业务流程</li><li data-v-27664fc0>SFC 把 template/script/style 放同一文件，是 Vue 的最小组件单元</li></ul></div>',1))]))}}),H=g(F,[["__scopeId","data-v-27664fc0"]]);export{H as default};
