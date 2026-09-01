import{d as v,b as a,e as n,f as o,M as y,F as m,E as b,A as _,r as i,o as l,I as f}from"./DutfXOOr.js";const h={class:"demo-container"},k={class:"tray-controls"},T=["disabled"],g=["disabled"],C={class:"action-log"},w={key:0,class:"hint"},M=v({__name:"E07Tray",setup(x){const s=i([]),t=i(!1);function r(){t.value=!t.value,s.value.push(t.value?"创建托盘图标":"移除托盘图标")}function c(){t.value&&s.value.push("托盘图标被点击 - 显示/隐藏窗口")}function u(){t.value&&(s.value.push("右键点击托盘 - 显示上下文菜单"),s.value.push('菜单项"显示"被点击'))}return(A,e)=>(l(),a("div",h,[e[2]||(e[2]=n("h2",null,"🌰 系统托盘",-1)),e[3]||(e[3]=n("p",{class:"desc"},"创建系统托盘图标，实现托盘菜单、气泡通知和点击交互。",-1)),n("div",k,[n("button",{class:"btn",onClick:r},o(t.value?"移除托盘图标":"创建托盘图标"),1),n("button",{class:"btn secondary",onClick:c,disabled:!t.value}," 模拟左键点击 ",8,T),n("button",{class:"btn secondary",onClick:u,disabled:!t.value}," 模拟右键点击 ",8,g)]),n("div",{class:y(["tray-visual",{active:t.value}])},[...e[0]||(e[0]=[n("div",{class:"tray-icon"},"📌",-1),n("div",{class:"tray-label"},"My Electron App",-1)])],2),n("div",C,[e[1]||(e[1]=n("h3",null,"操作日志",-1)),(l(!0),a(m,null,b(s.value,(d,p)=>(l(),a("div",{key:p,class:"log-item"},o(d),1))),128)),s.value.length===0?(l(),a("p",w,"点击按钮查看托盘操作")):_("",!0)]),e[4]||(e[4]=n("div",{class:"code-block"},[n("h3",null,"托盘代码示例"),n("pre",null,`// 主进程
const { Tray, Menu } = require('electron')
const path = require('path')

const tray = new Tray(path.join(__dirname, 'icon.png'))

const contextMenu = Menu.buildFromTemplate([
  { label: '显示', click: () => mainWindow.show() },
  { label: '关于', click: () => showAbout() },
  { type: 'separator' },
  { label: '退出', click: () => app.quit() }
])

tray.setToolTip('My Electron App')
tray.setContextMenu(contextMenu)

// 点击托盘图标切换窗口显示
tray.on('click', () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
})`)],-1))]))}}),W=f(M,[["__scopeId","data-v-cacb1d01"]]);export{W as default};
