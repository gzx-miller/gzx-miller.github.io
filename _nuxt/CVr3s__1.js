import{d as c,b as s,e as n,F as m,E as g,o as r,f as p,A as C,r as b,I as v}from"./DutfXOOr.js";const f={class:"demo-container"},S={class:"shortcut-list"},h=["checked","onChange"],k=["onClick"],_=c({__name:"E09Shortcuts",setup(O){const e=b([]),i=["CmdOrCtrl+Shift+K","CmdOrCtrl+Alt+N","F11","CmdOrCtrl+Space"];function a(t){e.value.includes(t)?e.value=e.value.filter(l=>l!==t):e.value.push(t)}function u(t){alert(`快捷键触发: ${t}`)}return(t,l)=>(r(),s("div",f,[l[1]||(l[1]=n("h2",null,"🌰 全局快捷键",-1)),l[2]||(l[2]=n("p",{class:"desc"},"注册全局快捷键（即使应用未聚焦）和菜单快捷键。",-1)),n("div",S,[l[0]||(l[0]=n("h3",null,"常用快捷键",-1)),(r(),s(m,null,g(i,o=>n("div",{key:o,class:"shortcut-item"},[n("label",null,[n("input",{type:"checkbox",checked:e.value.includes(o),onChange:d=>a(o)},null,40,h),n("code",null,p(o),1)]),e.value.includes(o)?(r(),s("button",{key:0,class:"trigger-btn",onClick:d=>u(o)}," 模拟触发 ",8,k)):C("",!0)])),64))]),l[3]||(l[3]=n("div",{class:"code-block"},[n("h3",null,"globalShortcut 示例"),n("pre",null,`// 注册全局快捷键
globalShortcut.register('CmdOrCtrl+Shift+K', () => {
  console.log('全局快捷键触发')
  mainWindow.show()
})

// 检查是否已注册
if (globalShortcut.isRegistered('CmdOrCtrl+K')) {
  console.log('快捷键已被注册')
}

// 退出时注销所有快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// 菜单快捷键（无需手动注册）
const menu = Menu.buildFromTemplate([
  {
    label: '视图',
    submenu: [
      {
        label: '开发者工具',
        accelerator: 'CmdOrCtrl+Option+I',
        click: () => mainWindow.webContents.toggleDevTools()
      }
    ]
  }
])`)],-1)),l[4]||(l[4]=n("div",{class:"tips"},[n("h3",null,"注意事项"),n("ul",null,[n("li",null,"全局快捷键可能与其他应用冲突，注册前应检查"),n("li",null,"macOS 的 Cmd 对应 Windows/Linux 的 Ctrl"),n("li",null,"应用退出时必须调用 unregisterAll() 释放快捷键"),n("li",null,"菜单快捷键通过 accelerator 属性定义，自动注册")])],-1))]))}}),x=v(_,[["__scopeId","data-v-990edda5"]]);export{x as default};
