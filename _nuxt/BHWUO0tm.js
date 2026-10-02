import{d as u,b as n,e as d,v as t,f as i,K as f,L as m,A as h,a0 as g,r,o as s,M as x,F as R}from"./CfJSWYGO.js";const w={class:"demo-container"},I={class:"code-panel"},k={key:0,class:"log-panel"},B={class:"log-entries"},C=u({__name:"E04Preload",setup(P){const e=r([]);function l(){e.value=[],e.value.push("✅ 预加载脚本中:"),e.value.push('contextBridge.exposeInMainWorld("api", {'),e.value.push('  getVersion: () => ipcRenderer.invoke("get-version"),'),e.value.push('  saveFile: (data) => ipcRenderer.invoke("save-file", data),'),e.value.push("  // 只暴露需要的方法，不暴露整个 ipcRenderer"),e.value.push("})"),e.value.push(""),e.value.push("✅ 渲染进程中:"),e.value.push("const version = await window.api.getVersion()"),e.value.push("await window.api.saveFile(data)")}function c(){e.value=[],e.value.push("❌ 危险做法:"),e.value.push('contextBridge.exposeInMainWorld("api", {'),e.value.push("  ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer!"),e.value.push("})"),e.value.push(""),e.value.push("❌ 攻击者可:"),e.value.push('window.api.ipcRenderer.invoke("evil-channel", data)'),e.value.push("// 可调用任意 IPC 通道，甚至执行系统命令")}const p=r(`// preload.js - 安全写法
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
`);return(b,a)=>(s(),n("div",w,[a[6]||(a[6]=d("h2",null,"🌰 预加载脚本与安全桥接",-1)),a[7]||(a[7]=d("p",{class:"description"},[t(" 预加载脚本在渲染进程加载前运行，是唯一能同时访问 Node.js 和 Electron API 的地方。 通过 "),d("code",null,"contextBridge"),t(" 安全暴露 API 是 Electron 安全模型的核心。 ")],-1)),d("div",{class:"comparison"},[d("div",{class:"mode-card safe"},[a[0]||(a[0]=d("h3",null,"✅ 安全写法",-1)),a[1]||(a[1]=d("p",null,"只暴露白名单方法",-1)),d("button",{class:"btn safe-btn",onClick:l},"查看安全示例")]),d("div",{class:"mode-card unsafe"},[a[2]||(a[2]=d("h3",null,"❌ 危险写法",-1)),a[3]||(a[3]=d("p",null,"暴露整个 API 对象",-1)),d("button",{class:"btn unsafe-btn",onClick:c},"查看危险示例")])]),d("div",I,[a[4]||(a[4]=d("h3",null,"预加载脚本示例",-1)),d("pre",null,[d("code",null,i(p.value),1)])]),e.value.length>0?(s(),n("div",k,[a[5]||(a[5]=d("h3",null,"代码示例",-1)),d("div",B,[(s(!0),n(f,null,m(e.value,(o,v)=>(s(),n("div",{key:v,class:x(["log-entry",{error:o.includes("❌"),success:o.includes("✅")}])},i(o),3))),128))])])):h("",!0),a[8]||(a[8]=g('<div class="explanation" data-v-fd5756c8><h3 data-v-fd5756c8>核心概念</h3><div class="concept-grid" data-v-fd5756c8><div class="concept" data-v-fd5756c8><h4 data-v-fd5756c8>上下文隔离 (Context Isolation)</h4><p data-v-fd5756c8>预加载脚本和运行在 renderer 中的 JavaScript 运行在不同的上下文。这意味着预加载脚本访问的 <code data-v-fd5756c8>window</code> 对象与渲染进程访问的 <code data-v-fd5756c8>window</code> 对象不同。</p></div><div class="concept" data-v-fd5756c8><h4 data-v-fd5756c8>contextBridge</h4><p data-v-fd5756c8>唯一能在隔离上下文之间安全传递数据的方式。通过 <code data-v-fd5756c8>exposeInMainWorld</code> 暴露的 API 会自动处理数据类型转换，防止原型链污染攻击。</p></div><div class="concept" data-v-fd5756c8><h4 data-v-fd5756c8>为什么不能直接暴露 ipcRenderer?</h4><p data-v-fd5756c8>如果暴露整个 <code data-v-fd5756c8>ipcRenderer</code>，渲染进程（可能被 XSS 攻击）可以调用任意 IPC 通道，甚至触发主进程的敏感操作（如删除文件、执行命令）。</p></div></div></div>',1))]))}}),F=R(C,[["__scopeId","data-v-fd5756c8"]]);export{F as default};
