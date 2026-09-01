import{d as u,b as s,e as n,v as t,f as i,F as f,E as b,A as m,a0 as h,r,o,M as g,I as x}from"./DutfXOOr.js";const R={class:"demo-container"},w={class:"code-panel"},I={key:0,class:"log-panel"},k={class:"log-entries"},B=u({__name:"E04Preload",setup(C){const e=r([]);function l(){e.value=[],e.value.push("✅ 预加载脚本中:"),e.value.push('contextBridge.exposeInMainWorld("api", {'),e.value.push('  getVersion: () => ipcRenderer.invoke("get-version"),'),e.value.push('  saveFile: (data) => ipcRenderer.invoke("save-file", data),'),e.value.push("  // 只暴露需要的方法，不暴露整个 ipcRenderer"),e.value.push("})"),e.value.push(""),e.value.push("✅ 渲染进程中:"),e.value.push("const version = await window.api.getVersion()"),e.value.push("await window.api.saveFile(data)")}function p(){e.value=[],e.value.push("❌ 危险做法:"),e.value.push('contextBridge.exposeInMainWorld("api", {'),e.value.push("  ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer!"),e.value.push("})"),e.value.push(""),e.value.push("❌ 攻击者可:"),e.value.push('window.api.ipcRenderer.invoke("evil-channel", data)'),e.value.push("// 可调用任意 IPC 通道，甚至执行系统命令")}const v=r(`// preload.js - 安全写法
const { contextBridge, ipcRenderer } = require('electron')

// ✅ 只暴露需要的方法
contextBridge.exposeInMainWorld('api', {
  // 应用信息
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPlatform: () => process.platform,

  // 文件操作
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
  openFile: () => ipcRenderer.invoke('file:open'),

  // 窗口操作
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close')
})

// ❌ 危险写法 - 不要这样做!
// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer
// })
`);return(P,a)=>(o(),s("div",R,[a[6]||(a[6]=n("h2",null,"🌰 预加载脚本与安全桥接",-1)),a[7]||(a[7]=n("p",{class:"description"},[t(" 预加载脚本在渲染进程加载前运行，是唯一能同时访问 Node.js 和 Electron API 的地方。 通过 "),n("code",null,"contextBridge"),t(" 安全暴露 API 是 Electron 安全模型的核心。 ")],-1)),n("div",{class:"comparison"},[n("div",{class:"mode-card safe"},[a[0]||(a[0]=n("h3",null,"✅ 安全写法",-1)),a[1]||(a[1]=n("p",null,"只暴露白名单方法",-1)),n("button",{class:"btn safe-btn",onClick:l},"查看安全示例")]),n("div",{class:"mode-card unsafe"},[a[2]||(a[2]=n("h3",null,"❌ 危险写法",-1)),a[3]||(a[3]=n("p",null,"暴露整个 API 对象",-1)),n("button",{class:"btn unsafe-btn",onClick:p},"查看危险示例")])]),n("div",w,[a[4]||(a[4]=n("h3",null,"预加载脚本示例",-1)),n("pre",null,[n("code",null,i(v.value),1)])]),e.value.length>0?(o(),s("div",I,[a[5]||(a[5]=n("h3",null,"代码示例",-1)),n("div",k,[(o(!0),s(f,null,b(e.value,(d,c)=>(o(),s("div",{key:c,class:g(["log-entry",{error:d.includes("❌"),success:d.includes("✅")}])},i(d),3))),128))])])):m("",!0),a[8]||(a[8]=h('<div class="explanation" data-v-6660b7f3><h3 data-v-6660b7f3>核心概念</h3><div class="concept-grid" data-v-6660b7f3><div class="concept" data-v-6660b7f3><h4 data-v-6660b7f3>上下文隔离 (Context Isolation)</h4><p data-v-6660b7f3>预加载脚本和运行在 renderer 中的 JavaScript 运行在不同的上下文。这意味着预加载脚本访问的 <code data-v-6660b7f3>window</code> 对象与渲染进程访问的 <code data-v-6660b7f3>window</code> 对象不同。</p></div><div class="concept" data-v-6660b7f3><h4 data-v-6660b7f3>contextBridge</h4><p data-v-6660b7f3>唯一能在隔离上下文之间安全传递数据的方式。通过 <code data-v-6660b7f3>exposeInMainWorld</code> 暴露的 API 会自动处理数据类型转换，防止原型链污染攻击。</p></div><div class="concept" data-v-6660b7f3><h4 data-v-6660b7f3>为什么不能直接暴露 ipcRenderer?</h4><p data-v-6660b7f3>如果暴露整个 <code data-v-6660b7f3>ipcRenderer</code>，渲染进程（可能被 XSS 攻击）可以调用任意 IPC 通道，甚至触发主进程的敏感操作（如删除文件、执行命令）。</p></div></div></div>',1))]))}}),E=x(B,[["__scopeId","data-v-6660b7f3"]]);export{E as default};
