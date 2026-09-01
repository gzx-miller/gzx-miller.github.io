import{d,b as n,e as t,F as l,E as i,a0 as c,o,f as a,v as g,I as v}from"./DutfXOOr.js";const m={class:"demo-container"},u={class:"storage-grid"},b={class:"use-case"},p=d({__name:"E14Storage",setup(S){const r=[{name:"electron-store",desc:"基于 JSON，适合配置",useCase:"用户设置、应用配置"},{name:"IndexedDB",desc:"浏览器标准，适合结构化数据",useCase:"离线数据、缓存"},{name:"SQLite (better-sqlite3)",desc:"关系型，适合复杂查询",useCase:"本地数据库"},{name:"localStorage",desc:"简单键值对，同步 API",useCase:"临时数据"}];return(_,e)=>(o(),n("div",m,[e[1]||(e[1]=t("h2",null,"🌰 本地数据存储",-1)),e[2]||(e[2]=t("p",{class:"desc"},"对比 electron-store、IndexedDB、SQLite 和 localStorage，掌握 Electron 应用的本地数据存储方案。",-1)),t("div",u,[(o(),n(l,null,i(r,s=>t("div",{key:s.name,class:"storage-card"},[t("h3",null,a(s.name),1),t("p",null,a(s.desc),1),t("div",b,[e[0]||(e[0]=t("strong",null,"适用场景:",-1)),g(" "+a(s.useCase),1)])])),64))]),e[3]||(e[3]=c(`<div class="code-block" data-v-70db2ee7><h3 data-v-70db2ee7>electron-store 示例</h3><pre data-v-70db2ee7>// 安装: npm install electron-store

// 主进程或预加载脚本
import Store from &#39;electron-store&#39;
const store = new Store()

// 读写数据
store.set(&#39;user.name&#39;, &#39;Alice&#39;)
console.log(store.get(&#39;user.name&#39;)) // &#39;Alice&#39;

// 存储对象
store.set(&#39;settings&#39;, { theme: &#39;dark&#39;, lang: &#39;zh&#39; })
console.log(store.get(&#39;settings.theme&#39;)) // &#39;dark&#39;

// 删除
store.delete(&#39;user.name&#39;)

// 清空
store.clear()</pre></div><div class="tips" data-v-70db2ee7><h3 data-v-70db2ee7>选择建议</h3><ul data-v-70db2ee7><li data-v-70db2ee7><strong data-v-70db2ee7>配置数据</strong>: 使用 electron-store（简单、自动加密）</li><li data-v-70db2ee7><strong data-v-70db2ee7>结构化数据</strong>: 使用 IndexedDB（浏览器标准、异步）</li><li data-v-70db2ee7><strong data-v-70db2ee7>关系型数据</strong>: 使用 SQLite（支持复杂查询、事务）</li><li data-v-70db2ee7><strong data-v-70db2ee7>临时数据</strong>: 使用 localStorage（同步、简单）</li></ul></div>`,2))]))}}),x=v(p,[["__scopeId","data-v-70db2ee7"]]);export{x as default};
