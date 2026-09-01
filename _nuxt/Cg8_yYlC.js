import{d as v,b as s,e as n,K as i,aW as d,v as u,F as f,E as w,A as b,r as p,o,f as y,I as k}from"./DutfXOOr.js";const E={class:"demo-container"},L={class:"platform-selector"},W={class:"events"},g={key:0,class:"hint"},q=v({__name:"E05AppLifecycle",setup(x){const l=p([]),t=p("win");function r(){l.value=[],[{name:"app.whenReady()",desc:"Electron 初始化完成"},{name:"browser-window-created",desc:"创建主窗口"},{name:"web-contents-created",desc:"WebContents 创建"},{name:"window-all-closed",desc:"所有窗口关闭"},{name:t.value==="mac"?"app.activate":"app.quit",desc:t.value==="mac"?"Dock 图标点击":"退出应用"},{name:"before-quit",desc:"退出前清理"},{name:"will-quit",desc:"即将退出"},{name:"quit",desc:"应用已退出"}].forEach((e,a)=>{setTimeout(()=>{l.value.push(`✓ ${e.name} - ${e.desc}`)},a*600)})}return(c,e)=>(o(),s("div",E,[e[6]||(e[6]=n("h2",null,"🌰 应用生命周期",-1)),e[7]||(e[7]=n("p",{class:"desc"},"掌握 app 模块的生命周期事件，实现正确的启动和退出逻辑。",-1)),n("div",L,[n("label",null,[i(n("input",{type:"radio","onUpdate:modelValue":e[0]||(e[0]=a=>t.value=a),value:"mac"},null,512),[[d,t.value]]),e[3]||(e[3]=u(" macOS",-1))]),n("label",null,[i(n("input",{type:"radio","onUpdate:modelValue":e[1]||(e[1]=a=>t.value=a),value:"win"},null,512),[[d,t.value]]),e[4]||(e[4]=u(" Windows",-1))]),n("label",null,[i(n("input",{type:"radio","onUpdate:modelValue":e[2]||(e[2]=a=>t.value=a),value:"linux"},null,512),[[d,t.value]]),e[5]||(e[5]=u(" Linux",-1))])]),n("button",{class:"btn",onClick:r},"模拟生命周期"),n("div",W,[(o(!0),s(f,null,w(l.value,(a,m)=>(o(),s("div",{key:m,class:"event"},y(a),1))),128)),l.value.length===0?(o(),s("p",g,"点击按钮查看生命周期事件")):b("",!0)]),e[8]||(e[8]=n("div",{class:"code-block"},[n("h3",null,"单例应用实现"),n("pre",null,`const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.whenReady().then(createWindow)
  app.on('second-instance', (e, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}`)],-1))]))}}),C=k(q,[["__scopeId","data-v-a842ca80"]]);export{C as default};
