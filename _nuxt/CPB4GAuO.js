import{d as w,b as s,e as d,F as v,E as b,a0 as f,r as g,o as a,M as _,f as i,A as c,I as m}from"./DutfXOOr.js";const h={class:"demo-container"},k={class:"windows-grid"},y={class:"window-actions"},C=["onClick"],W=["onClick"],E=w({__name:"E15MultiWindow",setup(M){const o=g([{id:1,title:"主窗口",type:"main",status:"open"},{id:2,title:"设置窗口",type:"settings",status:"closed"},{id:3,title:"关于窗口",type:"about",status:"closed"}]);function l(e){const n=o.value.find(t=>t.id===e);n&&(n.status="open")}function r(e){const n=o.value.find(t=>t.id===e);n&&(n.status="closed")}function u(){alert('向所有窗口发送消息: "refresh-data"')}return(e,n)=>(a(),s("div",h,[n[0]||(n[0]=d("h2",null,"🌰 多窗口管理",-1)),n[1]||(n[1]=d("p",{class:"desc"},"管理多个应用窗口，实现窗口间通信、数据共享和状态同步。",-1)),d("div",k,[(a(!0),s(v,null,b(o.value,t=>(a(),s("div",{key:t.id,class:_(["window-card",{open:t.status==="open"}])},[d("h3",null,i(t.title),1),d("p",null,"类型: "+i(t.type),1),d("p",null,"状态: "+i(t.status==="open"?"✅ 打开":"❌ 关闭"),1),d("div",y,[t.status==="closed"?(a(),s("button",{key:0,class:"btn",onClick:p=>l(t.id)},"打开",8,C)):c("",!0),t.status==="open"?(a(),s("button",{key:1,class:"btn danger",onClick:p=>r(t.id)},"关闭",8,W)):c("",!0)])],2))),128))]),d("button",{class:"btn broadcast",onClick:u},"广播消息到所有窗口"),n[2]||(n[2]=f(`<div class="code-block" data-v-2dcb89dd><h3 data-v-2dcb89dd>多窗口管理代码示例</h3><pre data-v-2dcb89dd>// 主进程 - 窗口管理
const windows = new Map()

function createWindow(type: string) {
  const win = new BrowserWindow({...})
  windows.set(win.id, { window: win, type })
  
  win.on(&#39;closed&#39;, () =&gt; {
    windows.delete(win.id) // 释放引用
  })
  
  return win
}

// 窗口间通信
function broadcastToAll(channel: string, data: any) {
  windows.forEach(({ window }) =&gt; {
    window.webContents.send(channel, data)
  })
}

// 渲染进程 - 接收广播
ipcRenderer.on(&#39;refresh-data&#39;, (event, data) =&gt; {
  console.log(&#39;收到广播:&#39;, data)
})</pre></div><div class="tips" data-v-2dcb89dd><h3 data-v-2dcb89dd>多窗口管理要点</h3><ul data-v-2dcb89dd><li data-v-2dcb89dd><strong data-v-2dcb89dd>窗口引用管理</strong>: 使用 Map 或对象存储窗口引用</li><li data-v-2dcb89dd><strong data-v-2dcb89dd>内存泄漏预防</strong>: 窗口 closed 事件中释放引用</li><li data-v-2dcb89dd><strong data-v-2dcb89dd>窗口间通信</strong>: 通过主进程中转或共享存储</li><li data-v-2dcb89dd><strong data-v-2dcb89dd>macOS 特殊处理</strong>: 所有窗口关闭后应用仍运行</li></ul></div>`,2))]))}}),x=m(E,[["__scopeId","data-v-2dcb89dd"]]);export{x as default};
