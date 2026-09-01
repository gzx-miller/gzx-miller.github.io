import{d as _,b as a,e,v as r,M as u,K as h,L as y,F as b,E as C,A as I,f as d,a0 as x,r as c,o as i,I as M}from"./DutfXOOr.js";const T={class:"demo-container"},P={class:"mode-selector"},R={class:"demo-section"},w={class:"demo-controls"},E={class:"ipc-visualization"},N={class:"process renderer"},S={class:"code-snippet"},V={key:0},B={key:1},D={class:"process main"},L={class:"code-snippet"},A={key:0},F={key:1},$={class:"log-panel"},z={class:"log-entries"},J={class:"log-time"},K={class:"log-direction"},O={class:"log-data"},U={key:0,class:"hint"},W={class:"code-example"},j=_({__name:"E03IPC",setup(q){const t=c("invoke"),l=c([]),p=c("");function o(v,n){const s=new Date().toLocaleTimeString();l.value.push({time:s,direction:v,data:n})}function m(){l.value=[],o("渲染进程 →",'ipcRenderer.invoke("ping")'),setTimeout(()=>{o("主进程 ←",'ipcMain.handle("ping") 处理中...')},500),setTimeout(()=>{o("主进程 →",'return "pong"')},1e3),setTimeout(()=>{o("渲染进程 ←",'Promise resolve: "pong"')},1500)}function g(){l.value=[],o("渲染进程 →",'ipcRenderer.send("async-message", data)'),setTimeout(()=>{o("主进程 ←",'ipcMain.on("async-message") 接收')},500),setTimeout(()=>{o("主进程 →",'event.reply("async-reply", response)')},1e3),setTimeout(()=>{o("渲染进程 ←",'ipcRenderer.on("async-reply") 接收回复')},1500)}const f={invoke:`// 主进程
ipcMain.handle('get-app-info', async (event, args) => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform
  }
})

// 预加载脚本
contextBridge.exposeInMainWorld('api', {
  getAppInfo: () => ipcRenderer.invoke('get-app-info')
})

// 渲染进程
const info = await window.api.getAppInfo()`,send:`// 主进程
ipcMain.on('save-data', (event, data) => {
  fs.writeFileSync(path, JSON.stringify(data))
  event.reply('save-data-reply', { success: true })
})

// 渲染进程
ipcRenderer.send('save-data', formData)
ipcRenderer.on('save-data-reply', (event, result) => {
  console.log('保存结果:', result)
})`};return(v,n)=>(i(),a("div",T,[n[9]||(n[9]=e("h2",null,"🌰 IPC 进程间通信",-1)),n[10]||(n[10]=e("p",{class:"description"},[r(" Electron 提供多种 IPC 模式："),e("code",null,"invoke/handle"),r("（Promise 风格，推荐）和 "),e("code",null,"send/on"),r("（事件风格，适合单向通信）。 ")],-1)),e("div",P,[e("button",{class:u({active:t.value==="invoke"}),onClick:n[0]||(n[0]=s=>t.value="invoke")},"invoke/handle 模式（推荐）",2),e("button",{class:u({active:t.value==="send"}),onClick:n[1]||(n[1]=s=>t.value="send")},"send/on 模式",2)]),e("div",R,[n[8]||(n[8]=e("h3",null,"通信演示",-1)),e("div",w,[h(e("input",{"onUpdate:modelValue":n[2]||(n[2]=s=>p.value=s),placeholder:"输入测试数据...",class:"input"},null,512),[[y,p.value]]),e("button",{class:"btn",onClick:n[3]||(n[3]=s=>t.value==="invoke"?m():g())}," 发送 IPC 消息 ")]),e("div",E,[e("div",N,[n[4]||(n[4]=e("h4",null,"渲染进程",-1)),e("div",S,[t.value==="invoke"?(i(),a("pre",V,"ipcRenderer.invoke('channel')")):(i(),a("pre",B,"ipcRenderer.send('channel', data)"))])]),n[6]||(n[6]=e("div",{class:"ipc-arrow"},"↕️",-1)),e("div",D,[n[5]||(n[5]=e("h4",null,"主进程",-1)),e("div",L,[t.value==="invoke"?(i(),a("pre",A,"ipcMain.handle('channel', handler)")):(i(),a("pre",F,"ipcMain.on('channel', callback)"))])])]),e("div",$,[n[7]||(n[7]=e("h4",null,"通信日志",-1)),e("div",z,[(i(!0),a(b,null,C(l.value,(s,k)=>(i(),a("div",{key:k,class:"log-entry"},[e("span",J,d(s.time),1),e("span",K,d(s.direction),1),e("span",O,d(s.data),1)]))),128)),l.value.length===0?(i(),a("p",U,'点击"发送 IPC 消息"查看通信流程')):I("",!0)])])]),e("div",W,[e("h3",null,"代码示例 - "+d(t.value==="invoke"?"invoke/handle":"send/on")+" 模式",1),e("pre",null,[e("code",null,d(f[t.value]),1)])]),n[11]||(n[11]=x('<div class="best-practices" data-v-9be1af92><h3 data-v-9be1af92>最佳实践</h3><ul data-v-9be1af92><li data-v-9be1af92><strong data-v-9be1af92>优先使用 invoke/handle</strong>：支持异步返回，错误处理更清晰</li><li data-v-9be1af92><strong data-v-9be1af92>通道名使用常量</strong>：避免魔法字符串，集中管理</li><li data-v-9be1af92><strong data-v-9be1af92>不要传递大量数据</strong>：IPC 会序列化/反序列化，大文件用路径</li><li data-v-9be1af92><strong data-v-9be1af92>预加载脚本封装</strong>：渲染进程不直接使用 ipcRenderer</li></ul></div>',1))]))}}),H=M(j,[["__scopeId","data-v-9be1af92"]]);export{H as default};
