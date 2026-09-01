import{d as g,b as i,e as o,v as n,K as s,L as m,a2 as r,F as y,E as x,A as h,f,a0 as W,r as d,o as u,M as k,I as V}from"./DutfXOOr.js";const E={class:"demo-container"},I={class:"config-panel"},z={class:"config-grid"},B={class:"lifecycle-demo"},C={class:"event-log"},T={class:"event-index"},U={class:"event-name"},M={key:0,class:"hint"},N={class:"code-example"},P=g({__name:"E02MainWindow",setup(j){const t=d({width:800,height:600,frame:!0,transparent:!1,alwaysOnTop:!1,resizable:!0,minimizable:!0,maximizable:!0,show:!1,backgroundColor:"#ffffff"}),a=d([]),v=d("");function w(){a.value=[],["new BrowserWindow(options)","ready-to-show","show","focus","resize","minimize","restore","close","closed"].forEach((e,l)=>{setTimeout(()=>{a.value.push(e),v.value=e},l*500)})}const b=d(`// 主进程 main.js
const { BrowserWindow } = require('electron')

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false, // 先隐藏，ready-to-show 后再显示
  webPreferences: {
    nodeIntegration: false,    // 必须关闭
    contextIsolation: true,     // 必须开启
    preload: path.join(__dirname, 'preload.js')
  }
})

// 避免白屏：ready-to-show 后再显示
mainWindow.once('ready-to-show', () => {
  mainWindow.show()
})

// 关闭时释放引用（防止内存泄漏）
mainWindow.on('closed', () => {
  mainWindow = null
})`);return(c,e)=>(u(),i("div",E,[e[15]||(e[15]=o("h2",null,"🌰 BrowserWindow 窗口管理",-1)),e[16]||(e[16]=o("p",{class:"description"},[n(" BrowserWindow 是 Electron 创建原生窗口的核心 API。正确配置 "),o("code",null,"webPreferences"),n(" 是保障应用安全的关键。 ")],-1)),o("div",I,[e[12]||(e[12]=o("h3",null,"窗口配置",-1)),o("div",z,[o("label",null,[e[6]||(e[6]=n(" 宽度: ",-1)),s(o("input",{type:"number","onUpdate:modelValue":e[0]||(e[0]=l=>t.value.width=l)},null,512),[[m,t.value.width,void 0,{number:!0}]])]),o("label",null,[e[7]||(e[7]=n(" 高度: ",-1)),s(o("input",{type:"number","onUpdate:modelValue":e[1]||(e[1]=l=>t.value.height=l)},null,512),[[m,t.value.height,void 0,{number:!0}]])]),o("label",null,[s(o("input",{type:"checkbox","onUpdate:modelValue":e[2]||(e[2]=l=>t.value.frame=l)},null,512),[[r,t.value.frame]]),e[8]||(e[8]=n(" 显示边框 ",-1))]),o("label",null,[s(o("input",{type:"checkbox","onUpdate:modelValue":e[3]||(e[3]=l=>t.value.alwaysOnTop=l)},null,512),[[r,t.value.alwaysOnTop]]),e[9]||(e[9]=n(" 总是置顶 ",-1))]),o("label",null,[s(o("input",{type:"checkbox","onUpdate:modelValue":e[4]||(e[4]=l=>t.value.resizable=l)},null,512),[[r,t.value.resizable]]),e[10]||(e[10]=n(" 可调整大小 ",-1))]),o("label",null,[s(o("input",{type:"checkbox","onUpdate:modelValue":e[5]||(e[5]=l=>t.value.show=l)},null,512),[[r,t.value.show]]),e[11]||(e[11]=n(" 立即显示 ",-1))])])]),o("div",B,[e[13]||(e[13]=o("h3",null,"窗口生命周期",-1)),o("button",{class:"btn",onClick:w},"模拟生命周期"),o("div",C,[(u(!0),i(y,null,x(a.value,(l,p)=>(u(),i("div",{key:p,class:k(["event-item",{active:l===v.value}])},[o("span",T,f(p+1),1),o("span",U,f(l),1)],2))),128)),a.value.length===0?(u(),i("p",M,"点击按钮查看窗口生命周期事件")):h("",!0)])]),o("div",N,[e[14]||(e[14]=o("h3",null,"核心代码示例",-1)),o("pre",null,[o("code",null,f(b.value),1)])]),e[17]||(e[17]=W('<div class="security-notice" data-v-f9cb6f1e><h3 data-v-f9cb6f1e>⚠️ 安全提醒</h3><ul data-v-f9cb6f1e><li data-v-f9cb6f1e><strong data-v-f9cb6f1e>nodeIntegration: false</strong> - 渲染进程不能直接使用 Node.js API</li><li data-v-f9cb6f1e><strong data-v-f9cb6f1e>contextIsolation: true</strong> - 预加载脚本与渲染进程上下文隔离</li><li data-v-f9cb6f1e><strong data-v-f9cb6f1e>preload</strong> - 通过预加载脚本安全暴露需要的 API</li><li data-v-f9cb6f1e><strong data-v-f9cb6f1e>webSecurity: true</strong> - 不要设置为 false（除非本地开发）</li></ul></div>',1))]))}}),L=V(P,[["__scopeId","data-v-f9cb6f1e"]]);export{L as default};
