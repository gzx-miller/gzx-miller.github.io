import{d as p,b as a,e as s,K as w,L as v,a0 as b,r as g,o as e,M as _,f as i,A as c,F as m}from"./CfJSWYGO.js";const h={class:"demo-container"},k={class:"windows-grid"},y={class:"window-actions"},C=["onClick"],W=["onClick"],M=p({__name:"E15MultiWindow",setup(B){const d=g([{id:1,title:"主窗口",type:"main",status:"open"},{id:2,title:"设置窗口",type:"settings",status:"closed"},{id:3,title:"关于窗口",type:"about",status:"closed"}]);function l(o){const n=d.value.find(t=>t.id===o);n&&(n.status="open")}function r(o){const n=d.value.find(t=>t.id===o);n&&(n.status="closed")}function u(){alert('向所有窗口发送消息: "refresh-data"')}return(o,n)=>(e(),a("div",h,[n[0]||(n[0]=s("h2",null,"🌰 多窗口管理",-1)),n[1]||(n[1]=s("p",{class:"desc"},"管理多个应用窗口，实现窗口间通信、数据共享和状态同步。",-1)),s("div",k,[(e(!0),a(w,null,v(d.value,t=>(e(),a("div",{key:t.id,class:_(["window-card",{open:t.status==="open"}])},[s("h3",null,i(t.title),1),s("p",null,"类型: "+i(t.type),1),s("p",null,"状态: "+i(t.status==="open"?"✅ 打开":"❌ 关闭"),1),s("div",y,[t.status==="closed"?(e(),a("button",{key:0,class:"btn",onClick:f=>l(t.id)},"打开",8,C)):c("",!0),t.status==="open"?(e(),a("button",{key:1,class:"btn danger",onClick:f=>r(t.id)},"关闭",8,W)):c("",!0)])],2))),128))]),s("button",{class:"btn broadcast",onClick:u},"广播消息到所有窗口"),n[2]||(n[2]=b(`<div class="code-block" data-v-fbd7467c><h3 data-v-fbd7467c>多窗口管理代码示例</h3><pre data-v-fbd7467c>// 主进程 - 窗口管理
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
})</pre></div><div class="tips" data-v-fbd7467c><h3 data-v-fbd7467c>多窗口管理要点</h3><ul data-v-fbd7467c><li data-v-fbd7467c><strong data-v-fbd7467c>窗口引用管理</strong>: 使用 Map 或对象存储窗口引用</li><li data-v-fbd7467c><strong data-v-fbd7467c>内存泄漏预防</strong>: 窗口 closed 事件中释放引用</li><li data-v-fbd7467c><strong data-v-fbd7467c>窗口间通信</strong>: 通过主进程中转或共享存储</li><li data-v-fbd7467c><strong data-v-fbd7467c>macOS 特殊处理</strong>: 所有窗口关闭后应用仍运行</li></ul></div>`,2))]))}}),x=m(M,[["__scopeId","data-v-fbd7467c"]]);export{x as default};
