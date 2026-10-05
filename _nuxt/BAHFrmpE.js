import{_ as x}from"./CMaOSCop.js";import{d as w,c as s,h as r,j as e,q as n,k as S,F as b,r as y,t as p,p as v,$ as M,z as f,_ as I,e as P,g as k,f as C,l as h,v as q,a2 as E,a3 as A}from"./ClZcEZ7f.js";const R={class:"demo-container"},D={class:"architecture-diagram"},j={class:"controls"},B={class:"controls"},T={class:"controls"},U={class:"demo-section"},N={class:"ipc-log"},L={class:"msg-from"},$={class:"msg-to"},F={class:"msg-content"},z={key:0,class:"hint"},V=w({__name:"E01Architecture",setup(g){const t=f("main"),l=f([]);function i(d,o,c){l.value.push({from:d,to:o,msg:c})}function u(){l.value=[],i("渲染进程","预加载脚本",'invoke("get-app-version")'),setTimeout(()=>i("预加载脚本","主进程","ipcMain.handle 调用"),300),setTimeout(()=>i("主进程","预加载脚本","返回 app.getVersion()"),600),setTimeout(()=>i("预加载脚本","渲染进程","Promise resolve 版本号"),900)}const a=f({mainProcess:{name:"主进程 (Main Process)",responsibilities:["应用生命周期管理","原生 API 调用","窗口管理","IPC 主进程端"],apis:["app","BrowserWindow","ipcMain","Tray","Menu","dialog"]},preloadScript:{name:"预加载脚本 (Preload Script)",responsibilities:["上下文桥接","API 白名单暴露","Node.js 能力受限访问"],apis:["contextBridge","ipcRenderer（受限）"]},rendererProcess:{name:"渲染进程 (Renderer Process)",responsibilities:["UI 渲染","用户交互","前端框架运行"],apis:["DOM API","window.api（暴露的）","前端框架"]}});return(d,o)=>(s(),r("div",R,[o[13]||(o[13]=e("h2",null,"🌰 Electron 进程模型",-1)),o[14]||(o[14]=e("p",{class:"description"},[n(" Electron 应用由三种进程组成："),e("strong",null,"主进程"),n("管理应用生命周期和原生能力， "),e("strong",null,"渲染进程"),n("运行 Web 页面，"),e("strong",null,"预加载脚本"),n("在上下文隔离下安全桥接两者。 ")],-1)),e("div",D,[e("div",{class:S(["process-card",{active:t.value==="main"}]),onClick:o[0]||(o[0]=c=>t.value="main")},[o[3]||(o[3]=e("h3",null,"🖥️ 主进程",-1)),o[4]||(o[4]=e("p",null,"package.json 的 main 脚本运行在此进程",-1)),e("div",j,[(s(!0),r(b,null,y(a.value.mainProcess.apis,c=>(s(),r("span",{key:c,class:"api-tag"},p(c),1))),128))])],2),o[9]||(o[9]=e("div",{class:"arrow"},"↕️ IPC",-1)),e("div",{class:S(["process-card",{active:t.value==="preload"}]),onClick:o[1]||(o[1]=c=>t.value="preload")},[o[5]||(o[5]=e("h3",null,"🔌 预加载脚本",-1)),o[6]||(o[6]=e("p",null,"在渲染进程加载前运行，可访问两者 API",-1)),e("div",B,[(s(!0),r(b,null,y(a.value.preloadScript.apis,c=>(s(),r("span",{key:c,class:"api-tag"},p(c),1))),128))])],2),o[10]||(o[10]=e("div",{class:"arrow"},"↕️ 上下文桥接",-1)),e("div",{class:S(["process-card",{active:t.value==="renderer"}]),onClick:o[2]||(o[2]=c=>t.value="renderer")},[o[7]||(o[7]=e("h3",null,"🎨 渲染进程",-1)),o[8]||(o[8]=e("p",null,"每个 BrowserWindow 实例一个进程",-1)),e("div",T,[(s(!0),r(b,null,y(a.value.rendererProcess.apis,c=>(s(),r("span",{key:c,class:"api-tag"},p(c),1))),128))])],2)]),e("div",U,[o[12]||(o[12]=e("h3",null,"IPC 通信演示",-1)),e("button",{class:"btn",onClick:u},"模拟 IPC 调用"),e("div",N,[(s(!0),r(b,null,y(l.value,(c,m)=>(s(),r("div",{key:m,class:"ipc-message"},[e("span",L,p(c.from),1),o[11]||(o[11]=e("span",{class:"msg-arrow"},"→",-1)),e("span",$,p(c.to),1),e("span",F,p(c.msg),1)]))),128)),l.value.length===0?(s(),r("p",z,"点击按钮查看 IPC 通信流程")):v("",!0)])]),o[15]||(o[15]=M('<div class="key-points" data-v-49967caa><h3 data-v-49967caa>核心要点</h3><ul data-v-49967caa><li data-v-49967caa><strong data-v-49967caa>主进程唯一</strong>：整个应用只有一个主进程</li><li data-v-49967caa><strong data-v-49967caa>渲染进程隔离</strong>：每个窗口独立进程，崩溃不影响其他窗口</li><li data-v-49967caa><strong data-v-49967caa>上下文隔离</strong>：预加载脚本和运行时的 HTML/JS 运行在不同上下文</li><li data-v-49967caa><strong data-v-49967caa>安全桥接</strong>：通过 contextBridge.exposeInMainWorld 暴露受限 API</li></ul></div>',1))]))}}),H=I(V,[["__scopeId","data-v-49967caa"]]),J={class:"lesson-figure"},K=w({__name:"E01ArchitectureArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n('一个窗口里的页面崩了，另一个窗口照常刷新；可主进程里抛出一个没人接的异常，整个应用却瞬间退出——同样是"崩溃"，为什么一个只死一半，另一个全军覆没？ ')],-1)),l[2]||(l[2]=e("h2",null,"桌面界面与系统能力",-1)),l[3]||(l[3]=e("p",null," 你要做一个桌面应用：它得能画界面，用 HTML / CSS / JavaScript 那一套；同时它又得能读写本地文件、弹系统菜单、开原生窗口。麻烦在于，浏览器给的是沙箱里的一个页面，Node.js 给的是操作系统能力，这两样东西天生不在一起。 ",-1)),l[4]||(l[4]=e("p",null,[n(" 最省事的做法是把 Node 直接塞进页面——"),e("code",null,"nodeIntegration: true"),n("，页面里就能 "),e("code",null,"require('fs')"),n("。但它让你背上两笔隐藏成本："),e("strong",null,"第一，页面里任何一段第三方脚本、任何一次脚本注入，都瞬间拥有删文件、起进程的能力"),n("，一次 XSS 直接升级成本地代码执行；"),e("strong",null,"第二，界面的渲染和系统能力被绑死在同一个执行体里"),n('，一段卡死的渲染代码会拖垮整个应用。你被迫在"页面能用能力"和"能力不出事"之间二选一。 ')],-1)),l[5]||(l[5]=e("p",null," 那么，怎么才能既让页面用上系统能力，又不让页面直接拥有它，还让两者互不拖垮？ ",-1)),l[6]||(l[6]=e("h2",null,"双进程执行模型",-1)),l[7]||(l[7]=e("p",null,[n(" 最朴素的结构：把应用拆成两个执行体。一个叫"),e("strong",null,"主进程"),n("，跑 Node，负责创建窗口、调用系统 API；一个叫"),e("strong",null,"渲染进程"),n("，跑页面，只负责把界面画出来。两者不共享内存，靠一条消息通道传话。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,'它把"系统能力"和"网页内容"在物理上隔开了'),n("。页面里没有 "),e("code",null,"fs"),n("、没有 "),e("code",null,"require"),n('，出了事也只崩在渲染进程里，主进程安然无恙——这正是开场里"崩一半"的底气。 ')],-1)),l[9]||(l[9]=e("p",null,' 可它立刻留下一个空洞：主进程怎么让渲染进程"给我画个窗口"？渲染进程又怎么请求"帮我读个文件"？两个进程的内存互不相通，你没法像调普通函数那样直接调用对方——中间必须有一条通信线。 ',-1)),l[10]||(l[10]=e("h2",null,"内存隔离与调用失效",-1)),l[11]||(l[11]=e("ul",null,[e("li",null,[n("两个进程内存不共享，渲染进程里根本不存在主进程的 "),e("code",null,"fs"),n(" 函数，直接调用只会得到 "),e("code",null,"undefined"),n("。")]),e("li",null,[n('如果为了"能调用"就让渲染进程直接持有 '),e("code",null,"ipcRenderer"),n("、向任意通道发消息，那等于把大门敞开：页面被注入后可以调用主进程注册的任何一个 handler，隔离白做了。")]),e("li",null,"页面完全碰不到 Node，可它又确实需要一点点系统信息，比如版本号、平台名，这些数据得有个合法来源。"),e("li",null,"渲染进程崩溃时主进程未必察觉，若还持着那个窗口的引用，就成了悬空对象。")],-1)),l[12]||(l[12]=e("h2",null,"建立IPC通信通道",-1)),l[13]||(l[13]=e("p",null,[n(' 先补上通信线，因为"跨进程调用"是这套结构成立的前提。主进程用 '),e("code",null,"ipcMain"),n(" 注册处理方法，渲染进程用 "),e("code",null,"ipcRenderer"),n(" 发请求，消息在两个进程间序列化传递；方向也要补齐，除了渲染到主进程的请求，主进程还能用 "),e("code",null,"webContents.send"),n(" 主动向渲染进程推送。 ")],-1)),l[14]||(l[14]=e("p",null,[n(' 但通信线还缺一个"中间人"。谁来当这个中间人？它得能碰到 '),e("code",null,"ipcRenderer"),n("，又要待在渲染进程这一侧的受限环境里，还得在页面脚本执行"),e("strong",null,"之前"),n("就跑起来。于是引入第三个角色——"),e("strong",null,"预加载脚本（Preload）"),n("。它在渲染进程加载页面前运行，是唯一能同时触及受限 Node 子集与 Electron API 的地方；它用 "),e("code",null,"contextBridge.exposeInMainWorld"),n(" 只把白名单方法挂到 "),e("code",null,"window"),n(" 上，页面拿到的是 "),e("code",null,"window.api.getVersion()"),n(" 这样的窄接口，而不是整个 "),e("code",null,"ipcRenderer"),n("。 ")],-1)),l[15]||(l[15]=e("p",null," 到这里三个角色分工成型，一条调用链也串起来了： ",-1)),l[16]||(l[16]=e("ol",{class:"lesson-steps"},[e("li",null,[n("主进程用 "),e("code",null,"new BrowserWindow()"),n(" 启动一个渲染进程并加载页面——窗口"),e("strong",null,"创建于主进程，页面运行于渲染进程"),n("。")]),e("li",null,[n("页面调用预加载脚本暴露的 "),e("code",null,"window.api.xxx"),n("，请求被转发到 "),e("code",null,"ipcRenderer"),n("。")]),e("li",null,"请求经 IPC 通道到达主进程，由注册好的 handler 处理。"),e("li",null,"主进程沿同一条通道返回结果，渲染进程拿回一个 Promise 响应。")],-1)),l[17]||(l[17]=e("p",null,[n(" 三个角色的边界值得记牢："),e("strong",null,"主进程唯一"),n("，它一旦崩溃整个应用退出；"),e("strong",null,"每个窗口对应一个渲染进程"),n("，崩一个不影响别的窗口；"),e("strong",null,"预加载脚本每个渲染进程一份"),n("，夹在两者之间做桥接。至于 Chromium 自带的网络、GPU 等模块，会以独立的 Utility 进程运行，由系统自动管理，通常不需要你介入。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box hint"},[e("strong",null,"自己确认一下："),n("在主进程或页面里打印 "),e("code",null,"process.type"),n("，或在 DevTools 的 Console 里观察，就能看出当前这段代码究竟跑在主进程还是渲染进程里——调试进程相关问题时，这一步最省心。 ")],-1)),l[19]||(l[19]=e("div",{class:"lesson-box warn"},[e("strong",null,"别踩的坑："),n("Electron 20 起默认启用沙箱，渲染进程与预加载脚本都运行在受限环境中，拿不到全部 Node 能力；渲染进程的 Node 集成默认关闭，"),e("code",null,"window.require"),n("、"),e("code",null,"process"),n(" 这些能力必须经预加载脚本按白名单提供，不要在页面里硬引 Node 模块。 ")],-1)),l[20]||(l[20]=e("h2",null,"跨进程调用往返",-1)),e("figure",J,[l[0]||(l[0]=e("figcaption",null,"先点上面三张卡片看清主进程、预加载、渲染进程各自的职责，再点「模拟 IPC 调用」，看一条请求从渲染进程出发、经预加载转发到主进程、再原路返回的完整往返。",-1)),C(H)]),l[21]||(l[21]=e("h2",null,"进程权限边界划分",-1)),l[22]||(l[22]=e("p",null,' Electron 的进程模型，本质上是把"职责"和"权限"做了一次物理切分：主进程管系统能力，渲染进程管界面，预加载脚本当中间的白名单通道。理解了三者各是谁、能碰什么，再回头看一条 IPC 调用链，就不容易把权限和边界记混。 ',-1)),l[23]||(l[23]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「主进程」"),n("是 Electron 应用里唯一的 Node.js 运行环境，由 "),e("code",null,"package.json"),n(" 的 "),e("code",null,"main"),n(" 入口脚本启动，负责应用生命周期、创建 "),e("code",null,"BrowserWindow"),n("、调用系统原生能力，并用 "),e("code",null,"ipcMain"),n(" 响应渲染进程的请求。它是一切渲染进程的父进程："),e("strong",null,"渲染进程崩溃只影响单个窗口，主进程崩溃则整个应用退出"),n("，所以重型或易错的逻辑不要堆在主进程里。 ")],-1))]),_:1})}}}),G={class:"demo-container"},Q={class:"config-panel"},X={class:"config-grid"},Y={class:"lifecycle-demo"},Z={class:"event-log"},_={class:"event-index"},ee={class:"event-name"},ne={key:0,class:"hint"},le={class:"code-example"},oe=w({__name:"E02MainWindow",setup(g){const t=f({width:800,height:600,frame:!0,transparent:!1,alwaysOnTop:!1,resizable:!0,minimizable:!0,maximizable:!0,show:!1,backgroundColor:"#ffffff"}),l=f([]),i=f("");function u(){l.value=[],["new BrowserWindow(options)","ready-to-show","show","focus","resize","minimize","restore","close","closed"].forEach((o,c)=>{setTimeout(()=>{l.value.push(o),i.value=o},c*500)})}const a=f(`// 主进程 main.js
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
})`);return(d,o)=>(s(),r("div",G,[o[15]||(o[15]=e("h2",null,"🌰 BrowserWindow 窗口管理",-1)),o[16]||(o[16]=e("p",{class:"description"},[n(" BrowserWindow 是 Electron 创建原生窗口的核心 API。正确配置 "),e("code",null,"webPreferences"),n(" 是保障应用安全的关键。 ")],-1)),e("div",Q,[o[12]||(o[12]=e("h3",null,"窗口配置",-1)),e("div",X,[e("label",null,[o[6]||(o[6]=n(" 宽度: ",-1)),h(e("input",{type:"number","onUpdate:modelValue":o[0]||(o[0]=c=>t.value.width=c)},null,512),[[q,t.value.width,void 0,{number:!0}]])]),e("label",null,[o[7]||(o[7]=n(" 高度: ",-1)),h(e("input",{type:"number","onUpdate:modelValue":o[1]||(o[1]=c=>t.value.height=c)},null,512),[[q,t.value.height,void 0,{number:!0}]])]),e("label",null,[h(e("input",{type:"checkbox","onUpdate:modelValue":o[2]||(o[2]=c=>t.value.frame=c)},null,512),[[E,t.value.frame]]),o[8]||(o[8]=n(" 显示边框 ",-1))]),e("label",null,[h(e("input",{type:"checkbox","onUpdate:modelValue":o[3]||(o[3]=c=>t.value.alwaysOnTop=c)},null,512),[[E,t.value.alwaysOnTop]]),o[9]||(o[9]=n(" 总是置顶 ",-1))]),e("label",null,[h(e("input",{type:"checkbox","onUpdate:modelValue":o[4]||(o[4]=c=>t.value.resizable=c)},null,512),[[E,t.value.resizable]]),o[10]||(o[10]=n(" 可调整大小 ",-1))]),e("label",null,[h(e("input",{type:"checkbox","onUpdate:modelValue":o[5]||(o[5]=c=>t.value.show=c)},null,512),[[E,t.value.show]]),o[11]||(o[11]=n(" 立即显示 ",-1))])])]),e("div",Y,[o[13]||(o[13]=e("h3",null,"窗口生命周期",-1)),e("button",{class:"btn",onClick:u},"模拟生命周期"),e("div",Z,[(s(!0),r(b,null,y(l.value,(c,m)=>(s(),r("div",{key:m,class:S(["event-item",{active:c===i.value}])},[e("span",_,p(m+1),1),e("span",ee,p(c),1)],2))),128)),l.value.length===0?(s(),r("p",ne,"点击按钮查看窗口生命周期事件")):v("",!0)])]),e("div",le,[o[14]||(o[14]=e("h3",null,"核心代码示例",-1)),e("pre",null,[e("code",null,p(a.value),1)])]),o[17]||(o[17]=M('<div class="security-notice" data-v-994b874c><h3 data-v-994b874c>⚠️ 安全提醒</h3><ul data-v-994b874c><li data-v-994b874c><strong data-v-994b874c>nodeIntegration: false</strong> - 渲染进程不能直接使用 Node.js API</li><li data-v-994b874c><strong data-v-994b874c>contextIsolation: true</strong> - 预加载脚本与渲染进程上下文隔离</li><li data-v-994b874c><strong data-v-994b874c>preload</strong> - 通过预加载脚本安全暴露需要的 API</li><li data-v-994b874c><strong data-v-994b874c>webSecurity: true</strong> - 不要设置为 false（除非本地开发）</li></ul></div>',1))]))}}),te=I(oe,[["__scopeId","data-v-994b874c"]]),se={class:"lesson-figure"},ie=w({__name:"E02MainWindowArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你写了 "),e("code",null,"new BrowserWindow"),n(" 再 "),e("code",null,"loadFile('index.html')"),n("，应用一启动，用户却先看到一块刺眼的白板，过一会儿内容才冒出来——页面明明没问题，那片白到底是哪来的？ ")],-1)),l[2]||(l[2]=e("h2",null,"网页窗口概念缺失",-1)),l[3]||(l[3]=e("p",null,' 你要开一个桌面窗口：它要有尺寸、标题、图标，能被拖动和缩放，还要能在任务栏上分组。可你低头一看 HTML，发现它压根没有"窗口"这个概念——网页不知道自己是"一个操作系统的窗口"，它只是一块画布。 ',-1)),l[4]||(l[4]=e("p",null,[n(" 旧办法是在页面里用 CSS 画一个假标题栏、用 JavaScript 监听鼠标拖动来模拟移动。它带来三笔必须由人承担的成本："),e("strong",null,"外观和真实的窗口行为脱节"),n("，拖动会掉帧；"),e("strong",null,"系统级能力缺失"),n("，任务栏图标、多显示器位置、最大化和全屏都得自己实现；"),e("strong",null,"每个窗口都要重写一遍这套模拟逻辑"),n("，越做越像在造一个残缺的窗口管理器。 ")],-1)),l[5]||(l[5]=e("p",null,' 那谁该来创建这个"系统认识"的原生窗口，并把一个网页装进去？ ',-1)),l[6]||(l[6]=e("h2",null,"创建窗口与加载内容",-1)),l[7]||(l[7]=e("p",null,[n(" 在主进程里 "),e("code",null,"new BrowserWindow({ width: 800, height: 600 })"),n("，再 "),e("code",null,"mainWindow.loadFile('index.html')"),n("。这就是最小可跑的窗口。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"窗口由操作系统创建，网页只是它的内容"),n('。缩放、最大化、任务栏图标、位置记忆这些"窗口自身的属性"全部由系统接管，你再也不用在页面里模拟一遍。 ')],-1)),l[9]||(l[9]=e("p",null,' 但它默认是"先显示、后加载"的：窗口一创建就亮出来，页面还在路上，用户看到的正是开场那片白。 ',-1)),l[10]||(l[10]=e("h2",null,"白屏闪烁与状态复位",-1)),l[11]||(l[11]=e("ul",null,[e("li",null,"默认创建即显示，首屏内容还没准备好就先露出空背景，用户看到白屏一闪。"),e("li",null,'只给尺寸不够：每次启动都回到默认位置和默认大小的窗口，用起来像"新手"，接不上用户上次的工作状态。'),e("li",null,"窗口关闭后若不释放引用，JavaScript 里还死死攥着一个已经销毁的对象，长时间运行会内存泄漏。"),e("li",null,[e("code",null,"webPreferences"),n(" 一旦配错——比如误开 "),e("code",null,"nodeIntegration"),n("——前面辛苦搭起来的安全边界当场崩塌。")])],-1)),l[12]||(l[12]=e("h2",null,"延迟显示避免白屏",-1)),l[13]||(l[13]=e("p",null,[n(' 先补"不闪"这一步，因为它最先影响第一印象。创建时写 '),e("code",null,"show: false"),n(" 让窗口先藏着，再绑上 "),e("code",null,"win.once('ready-to-show', () => win.show())"),n("，等页面首屏准备就绪再显示出来，那片白就被掐掉了。 ")],-1)),l[14]||(l[14]=e("p",null," 接着把窗口的生命周期事件顺序理清，这是后面所有窗口操作的地基： ",-1)),l[15]||(l[15]=e("ol",{class:"lesson-steps"},[e("li",null,[e("code",null,"new BrowserWindow(options)"),n(" 创建窗口。")]),e("li",null,[e("code",null,"ready-to-show"),n(" 页面首屏可渲染——配合 "),e("code",null,"show: false"),n(" 在此之后调用 "),e("code",null,"show()"),n("。")]),e("li",null,[e("code",null,"show"),n("、"),e("code",null,"focus"),n(" 窗口显示并获得焦点。")]),e("li",null,[n("运行期间穿插 "),e("code",null,"resize"),n(" / "),e("code",null,"maximize"),n(" / "),e("code",null,"minimize"),n(" / "),e("code",null,"restore"),n(" 等状态事件。")]),e("li",null,[e("code",null,"close"),n(" 即将关闭，可被 "),e("code",null,"event.preventDefault()"),n(" 拦截（比如做成隐藏到托盘）。")]),e("li",null,[e("code",null,"closed"),n(" 已经关闭，此时窗口对象已销毁，"),e("strong",null,"必须把引用置空"),n("。")])],-1)),l[16]||(l[16]=e("p",null,[n(" 再补安全基线。"),e("code",null,"webPreferences"),n(" 里写死两条："),e("code",null,"nodeIntegration: false"),n(" 与 "),e("code",null,"contextIsolation: true"),n("，"),e("code",null,"preload"),n(" 指向预加载脚本。需要 Node 能力时不放开 "),e("code",null,"nodeIntegration"),n('，而是让预加载脚本按白名单暴露——这条路在别处会展开，这里先记住"生产环境不松这条线"。 ')],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补窗口状态管理：用 "),e("code",null,"getPosition()"),n(" / "),e("code",null,"getSize()"),n(" 读回位置与尺寸，用 "),e("code",null,"maximize()"),n(" / "),e("code",null,"minimize()"),n(" / "),e("code",null,"restore()"),n(" / "),e("code",null,"setFullScreen()"),n(" / "),e("code",null,"setAlwaysOnTop()"),n(' 控制状态。把这些值和用户偏好一起持久化，下次启动读回还原，窗口才有了"接着上次用"的连续感。 ')],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"两个常见误区："),n("其一，"),e("code",null,"webSecurity"),n(" 只在本地开发叠加跨域时才临时关，生产环境必须保持 "),e("code",null,"true"),n("；其二，窗口创建是重操作，多窗口应用创建前应先检查同类窗口是否已存在，存在就聚焦，而不是重复新建。 ")],-1)),l[19]||(l[19]=e("h2",null,"参数组合与事件时序",-1)),e("figure",se,[l[0]||(l[0]=e("figcaption",null,[n("在上面勾选、修改宽度高度与各项窗口配置，感受不同参数组合下窗口的样子；再点「模拟生命周期」，看事件按真实顺序一条条点亮，尤其留意 "),e("code",null,"ready-to-show"),n(" 排在 "),e("code",null,"show"),n(" 之前。")],-1)),C(te)]),l[20]||(l[20]=e("h2",null,"原生窗口安全基线",-1)),l[21]||(l[21]=e("p",null,[e("code",null,"BrowserWindow"),n(' 是把"操作系统窗口"和"一个网页"缝在一起的那层。创建时用 '),e("code",null,"show: false"),n(" 避开白屏，用生命周期事件抓住 "),e("code",null,"ready-to-show"),n(" 与 "),e("code",null,"closed"),n(" 两头，再把 "),e("code",null,"nodeIntegration: false"),n("、"),e("code",null,"contextIsolation: true"),n(" 作为不可动摇的安全基线写进 "),e("code",null,"webPreferences"),n("。 ")],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「BrowserWindow」"),n("是主进程中创建原生窗口的构造函数，一个实例对应一个渲染进程；构造参数既描述外观（尺寸、边框、置顶、背景色），也能用 "),e("code",null,"show: false"),n(" 延迟显示，"),e("code",null,"webPreferences"),n(" 则决定该渲染进程的能力边界。它"),e("strong",null,"只能在主进程里使用"),n("，渲染进程中不存在；窗口触发 "),e("code",null,"closed"),n(" 后对象即被销毁，相关引用必须及时置空。 ")],-1))]),_:1})}}}),re={class:"demo-container"},ae={class:"mode-selector"},de={class:"demo-section"},ue={class:"demo-controls"},ce={class:"ipc-visualization"},pe={class:"process renderer"},me={class:"code-snippet"},we={key:0},ge={key:1},fe={class:"process main"},ve={class:"code-snippet"},be={key:0},ye={key:1},Se={class:"log-panel"},xe={class:"log-entries"},Ie={class:"log-time"},Pe={class:"log-direction"},ke={class:"log-data"},Ce={key:0,class:"hint"},he={class:"code-example"},We=w({__name:"E03IPC",setup(g){const t=f("invoke"),l=f([]),i=f("");function u(c,m){const W=new Date().toLocaleTimeString();l.value.push({time:W,direction:c,data:m})}function a(){l.value=[],u("渲染进程 →",'ipcRenderer.invoke("ping")'),setTimeout(()=>{u("主进程 ←",'ipcMain.handle("ping") 处理中...')},500),setTimeout(()=>{u("主进程 →",'return "pong"')},1e3),setTimeout(()=>{u("渲染进程 ←",'Promise resolve: "pong"')},1500)}function d(){l.value=[],u("渲染进程 →",'ipcRenderer.send("async-message", data)'),setTimeout(()=>{u("主进程 ←",'ipcMain.on("async-message") 接收')},500),setTimeout(()=>{u("主进程 →",'event.reply("async-reply", response)')},1e3),setTimeout(()=>{u("渲染进程 ←",'ipcRenderer.on("async-reply") 接收回复')},1500)}const o={invoke:`// 主进程
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
})`};return(c,m)=>(s(),r("div",re,[m[9]||(m[9]=e("h2",null,"🌰 IPC 进程间通信",-1)),m[10]||(m[10]=e("p",{class:"description"},[n(" Electron 提供多种 IPC 模式："),e("code",null,"invoke/handle"),n("（Promise 风格，推荐）和 "),e("code",null,"send/on"),n("（事件风格，适合单向通信）。 ")],-1)),e("div",ae,[e("button",{class:S({active:t.value==="invoke"}),onClick:m[0]||(m[0]=W=>t.value="invoke")},"invoke/handle 模式（推荐）",2),e("button",{class:S({active:t.value==="send"}),onClick:m[1]||(m[1]=W=>t.value="send")},"send/on 模式",2)]),e("div",de,[m[8]||(m[8]=e("h3",null,"通信演示",-1)),e("div",ue,[h(e("input",{"onUpdate:modelValue":m[2]||(m[2]=W=>i.value=W),placeholder:"输入测试数据...",class:"input"},null,512),[[q,i.value]]),e("button",{class:"btn",onClick:m[3]||(m[3]=W=>t.value==="invoke"?a():d())}," 发送 IPC 消息 ")]),e("div",ce,[e("div",pe,[m[4]||(m[4]=e("h4",null,"渲染进程",-1)),e("div",me,[t.value==="invoke"?(s(),r("pre",we,"ipcRenderer.invoke('channel')")):(s(),r("pre",ge,"ipcRenderer.send('channel', data)"))])]),m[6]||(m[6]=e("div",{class:"ipc-arrow"},"↕️",-1)),e("div",fe,[m[5]||(m[5]=e("h4",null,"主进程",-1)),e("div",ve,[t.value==="invoke"?(s(),r("pre",be,"ipcMain.handle('channel', handler)")):(s(),r("pre",ye,"ipcMain.on('channel', callback)"))])])]),e("div",Se,[m[7]||(m[7]=e("h4",null,"通信日志",-1)),e("div",xe,[(s(!0),r(b,null,y(l.value,(W,O)=>(s(),r("div",{key:O,class:"log-entry"},[e("span",Ie,p(W.time),1),e("span",Pe,p(W.direction),1),e("span",ke,p(W.data),1)]))),128)),l.value.length===0?(s(),r("p",Ce,'点击"发送 IPC 消息"查看通信流程')):v("",!0)])])]),e("div",he,[e("h3",null,"代码示例 - "+p(t.value==="invoke"?"invoke/handle":"send/on")+" 模式",1),e("pre",null,[e("code",null,p(o[t.value]),1)])]),m[11]||(m[11]=M('<div class="best-practices" data-v-e25bfa8c><h3 data-v-e25bfa8c>最佳实践</h3><ul data-v-e25bfa8c><li data-v-e25bfa8c><strong data-v-e25bfa8c>优先使用 invoke/handle</strong>：支持异步返回，错误处理更清晰</li><li data-v-e25bfa8c><strong data-v-e25bfa8c>通道名使用常量</strong>：避免魔法字符串，集中管理</li><li data-v-e25bfa8c><strong data-v-e25bfa8c>不要传递大量数据</strong>：IPC 会序列化/反序列化，大文件用路径</li><li data-v-e25bfa8c><strong data-v-e25bfa8c>预加载脚本封装</strong>：渲染进程不直接使用 ipcRenderer</li></ul></div>',1))]))}}),Me=I(We,[["__scopeId","data-v-e25bfa8c"]]),Ae={class:"lesson-figure"},Ee=w({__name:"E03IPCArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("界面里点一下按钮，想读一个本地配置文件；主进程里明明握着 "),e("code",null,"fs"),n("，你在渲染进程里照着写 "),e("code",null,"fs.readFile"),n(" 却直接报 "),e("code",null,"undefined"),n('——两个进程之间，一次"函数调用"到底是怎么发生的？ ')],-1)),l[2]||(l[2]=e("h2",null,"跨进程函数调用",-1)),l[3]||(l[3]=e("p",null,[n(" 你的界面住在渲染进程里，能力长在主进程里。你真正想做的事只有一件："),e("strong",null,"在页面点一下按钮，跨进程调用一个函数并拿到返回值"),n("。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 可这件事不能像普通函数那样直接做。渲染进程的内存里根本没有主进程的 "),e("code",null,"fs"),n("，你写下 "),e("code",null,"fs.readFile"),n(" 只会拿到 "),e("code",null,"undefined"),n('；两个进程的内存互相独立，"用全局变量共享一下"也根本不成立——各自有不同的全局对象，改了对方看不见。如果为了能直接调用而把两种能力塞进同一个进程，又会把上一课建立的进程隔离整个丢掉。 ')],-1)),l[5]||(l[5]=e("p",null,' 于是问题落到一句上：两个互相看不见内存的进程，怎么才能既"调用并拿到结果"，又"单向地通知对方一件事"？ ',-1)),l[6]||(l[6]=e("h2",null,"字符串通道约定",-1)),l[7]||(l[7]=e("p",null,[n(" 最朴素的做法是约定一个字符串通道名，两边对着它收发消息。渲染进程发："),e("code",null,"ipcRenderer.send('save-data', data)"),n("；主进程收："),e("code",null,"ipcMain.on('save-data', (event, data) => { ... })"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它给了两个进程一条带名字的通道"),n("。数据在通道上被序列化后传输，跨进程第一次有了确定的传话方式，你可以按业务给不同通道起不同名字。 ")],-1)),l[9]||(l[9]=e("p",null,[n(" 但 "),e("code",null,"send/on"),n(' 是单向的——消息一发出去就结束，发的人拿不到"处理完了没、结果是什么"。 ')],-1)),l[10]||(l[10]=e("h2",null,"单向通道缺返回值",-1)),l[11]||(l[11]=e("ul",null,[e("li",null,[n('读文件这类"我要拿到内容"的场景，'),e("code",null,"send/on"),n(" 拿不到返回值，只能让主进程再发一条消息回来（"),e("code",null,"event.reply"),n("），你得写两段代码自己把请求和响应配起来。")]),e("li",null,"手动配对在并发下会串线：连发两次请求，回来两条回复，你分不清哪条对应哪次——如果两次读的是不同文件，结果就错位了。"),e("li",null,"通道名写错不会有任何提示，消息发出去像石沉大海，调试只能靠猜。"),e("li",null,"主进程收到的永远是渲染进程递来的任意数据，一旦当真使用，就等于信任了不可信的一方。")],-1)),l[12]||(l[12]=e("h2",null,"请求响应与数据信封",-1)),l[13]||(l[13]=e("p",null,[n(' 先补"请求-响应"，因为"调用并拿到结果"是最常见的需求。引入一对新 API：渲染进程 '),e("code",null,"ipcRenderer.invoke(channel, ...args)"),n("，主进程 "),e("code",null,"ipcMain.handle(channel, handler)"),n("。"),e("code",null,"invoke"),n(" 返回 Promise，"),e("code",null,"handler"),n(" 的返回值就是它 resolve 出来的值，一次请求自动对应一次响应。 ")],-1)),l[14]||(l[14]=e("ol",{class:"lesson-steps"},[e("li",null,[n("渲染进程调用 "),e("code",null,"invoke('channel', args)"),n("，得到一个挂起的 Promise。")]),e("li",null,[n("请求经通道到达主进程，"),e("code",null,"handle"),n(" 注册的 handler 被执行。")]),e("li",null,"handler 的返回值被序列化后沿原通道送回。"),e("li",null,"渲染进程的 Promise resolve，拿到结果——请求与响应天然成对，不再需要手动配对。")],-1)),l[15]||(l[15]=e("p",null,[n(" 但 "),e("code",null,"send/on"),n(' 并不因此作废。有些消息压根不需要回执，比如"用户已登录，记一笔日志""窗口要最小化了"，用 '),e("code",null,"invoke"),n(" 反而凭空多出一个永远用不上的 Promise。所以两者按需选取："),e("strong",null,[n("需要返回值用 "),e("code",null,"invoke/handle"),n("，纯单向通知用 "),e("code",null,"send/on")]),n("——这正是演示里两个页签的区别所在。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 接着补数据契约和错误处理。主进程的 handler 内部用 "),e("code",null,"try/catch"),n(" 包住逻辑，按统一信封返回，比如 "),e("code",null,"{ ok, data, message }"),n("；不要直接把异常往外抛，异常跨进程序列化后信息会丢，还可能把栈暴露给页面。每个通道两边都约定同一套结构，渲染进程就能统一判断成败。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补主进程到渲染进程的方向：主进程用 "),e("code",null,"target.webContents.send(channel, data)"),n(" 主动推送事件。这里有个边界——"),e("strong",null,"推送前先检查目标窗口是否已销毁"),n("（"),e("code",null,"win.isDestroyed()"),n("），否则向一个已经关掉的窗口发消息会抛异常。参数校验也别省：渲染进程传来的东西一律不可信，主进程 handler 要校验类型与范围，比如把文件操作限制在指定目录内。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"两个容易忽略的点："),n("IPC 会序列化数据，"),e("strong",null,"不要拿它搬运整份大文件"),n("，正确做法是传文件路径、由主进程去读写；另外，渲染进程不要直接裸用 "),e("code",null,"ipcRenderer"),n("，所有 IPC 都应经预加载脚本封装成白名单接口再交给页面。 ")],-1)),l[19]||(l[19]=e("h2",null,"两种通道日志对照",-1)),e("figure",Ae,[l[0]||(l[0]=e("figcaption",null,"切换「invoke/handle」与「send/on」两个模式，各点一次「发送 IPC 消息」，对照日志里请求与响应的往返——注意 invoke 模式能一路等到返回值，send 模式则是发出去就结束。",-1)),C(Me)]),l[20]||(l[20]=e("h2",null,"IPC通道消息模型",-1)),l[21]||(l[21]=e("p",null,[n(' IPC 做的事，是把"跨进程的函数调用"翻译成"带名字的通道消息"。要拿到结果就用 '),e("code",null,"invoke/handle"),n("，只做通知就用 "),e("code",null,"send/on"),n("，通道两端约定统一的数据信封、并默认对方给的数据不可信——通信才会又稳又安全。 ")],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「IPC（进程间通信）」"),n("是渲染进程与主进程交换数据的唯一通道，消息在两个进程间序列化传输。两种基本形态要分清楚："),e("code",null,"invoke/handle"),n(" 是 Promise 风格的请求-响应，渲染进程 "),e("code",null,"invoke"),n("、主进程 "),e("code",null,"handle"),n(" 返回值；"),e("code",null,"send/on"),n(" 是单向事件，想回传信息必须靠 "),e("code",null,"event.reply"),n(" 或 "),e("code",null,"webContents.send"),n(" 另发一条。"),e("strong",null,"边界：通道里只能传可序列化的数据，函数、DOM 节点、大文件对象都过不去"),n("，大文件应改传路径。 ")],-1))]),_:1})}}}),qe={class:"demo-container"},Oe={class:"code-panel"},Re={key:0,class:"log-panel"},De={class:"log-entries"},je=w({__name:"E04Preload",setup(g){const t=f([]);function l(){t.value=[],t.value.push("✅ 预加载脚本中:"),t.value.push('contextBridge.exposeInMainWorld("api", {'),t.value.push('  getVersion: () => ipcRenderer.invoke("get-version"),'),t.value.push('  saveFile: (data) => ipcRenderer.invoke("save-file", data),'),t.value.push("  // 只暴露需要的方法，不暴露整个 ipcRenderer"),t.value.push("})"),t.value.push(""),t.value.push("✅ 渲染进程中:"),t.value.push("const version = await window.api.getVersion()"),t.value.push("await window.api.saveFile(data)")}function i(){t.value=[],t.value.push("❌ 危险做法:"),t.value.push('contextBridge.exposeInMainWorld("api", {'),t.value.push("  ipcRenderer: ipcRenderer  // 暴露整个 ipcRenderer!"),t.value.push("})"),t.value.push(""),t.value.push("❌ 攻击者可:"),t.value.push('window.api.ipcRenderer.invoke("evil-channel", data)'),t.value.push("// 可调用任意 IPC 通道，甚至执行系统命令")}const u=f(`// preload.js - 安全写法
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
`);return(a,d)=>(s(),r("div",qe,[d[6]||(d[6]=e("h2",null,"🌰 预加载脚本与安全桥接",-1)),d[7]||(d[7]=e("p",{class:"description"},[n(" 预加载脚本在渲染进程加载前运行，是唯一能同时访问 Node.js 和 Electron API 的地方。 通过 "),e("code",null,"contextBridge"),n(" 安全暴露 API 是 Electron 安全模型的核心。 ")],-1)),e("div",{class:"comparison"},[e("div",{class:"mode-card safe"},[d[0]||(d[0]=e("h3",null,"✅ 安全写法",-1)),d[1]||(d[1]=e("p",null,"只暴露白名单方法",-1)),e("button",{class:"btn safe-btn",onClick:l},"查看安全示例")]),e("div",{class:"mode-card unsafe"},[d[2]||(d[2]=e("h3",null,"❌ 危险写法",-1)),d[3]||(d[3]=e("p",null,"暴露整个 API 对象",-1)),e("button",{class:"btn unsafe-btn",onClick:i},"查看危险示例")])]),e("div",Oe,[d[4]||(d[4]=e("h3",null,"预加载脚本示例",-1)),e("pre",null,[e("code",null,p(u.value),1)])]),t.value.length>0?(s(),r("div",Re,[d[5]||(d[5]=e("h3",null,"代码示例",-1)),e("div",De,[(s(!0),r(b,null,y(t.value,(o,c)=>(s(),r("div",{key:c,class:S(["log-entry",{error:o.includes("❌"),success:o.includes("✅")}])},p(o),3))),128))])])):v("",!0),d[8]||(d[8]=M('<div class="explanation" data-v-d14d4782><h3 data-v-d14d4782>核心概念</h3><div class="concept-grid" data-v-d14d4782><div class="concept" data-v-d14d4782><h4 data-v-d14d4782>上下文隔离 (Context Isolation)</h4><p data-v-d14d4782>预加载脚本和运行在 renderer 中的 JavaScript 运行在不同的上下文。这意味着预加载脚本访问的 <code data-v-d14d4782>window</code> 对象与渲染进程访问的 <code data-v-d14d4782>window</code> 对象不同。</p></div><div class="concept" data-v-d14d4782><h4 data-v-d14d4782>contextBridge</h4><p data-v-d14d4782>唯一能在隔离上下文之间安全传递数据的方式。通过 <code data-v-d14d4782>exposeInMainWorld</code> 暴露的 API 会自动处理数据类型转换，防止原型链污染攻击。</p></div><div class="concept" data-v-d14d4782><h4 data-v-d14d4782>为什么不能直接暴露 ipcRenderer?</h4><p data-v-d14d4782>如果暴露整个 <code data-v-d14d4782>ipcRenderer</code>，渲染进程（可能被 XSS 攻击）可以调用任意 IPC 通道，甚至触发主进程的敏感操作（如删除文件、执行命令）。</p></div></div></div>',1))]))}}),Be=I(je,[["__scopeId","data-v-d14d4782"]]),Te={class:"lesson-figure"},Ue=w({__name:"E04PreloadArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("预加载脚本里本来只想让页面能读个版本号，图省事多写了一行把整个 "),e("code",null,"ipcRenderer"),n(" 挂到 "),e("code",null,"window"),n(" 上——结果一次第三方脚本注入，就能顺着这个接口删掉你电脑上的文件。同一行代码，为什么把安全边界整个交了出去？ ")],-1)),l[2]||(l[2]=e("h2",null,"页面能力最小授权",-1)),l[3]||(l[3]=e("p",null,[n(" 页面需要一点点原生能力：读个版本号、存取一份配置。但页面本身是"),e("strong",null,"不可信"),n("的——它加载的第三方库、内联的模板、远程拉来的资源，任何一处都可能被注入脚本。能力越方便地交出去，被滥用时的破坏面就越大。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 旧办法是把能力直接摊给页面：要么打开 "),e("code",null,"nodeIntegration"),n(" 让页面自己 "),e("code",null,"require('fs')"),n("，要么把整个 "),e("code",null,"ipcRenderer"),n(" 对象挂到 "),e("code",null,"window"),n(" 上。它同样带来三笔必须由人承担的成本："),e("strong",null,"页面一旦被注入就等于拿到这些能力的完全控制权"),n("；"),e("strong",null,'你无法限定它"只能做你允许的那几件事"'),n("，任意通道名它都能调；"),e("strong",null,"出事后无从审计"),n('，因为压根没有一份"页面被允许做什么"的清单。 ')],-1)),l[5]||(l[5]=e("p",null,' 那怎么才能只交出"刚好够用的那几个函数"，而不是一整串钥匙？ ',-1)),l[6]||(l[6]=e("h2",null,"预加载脚本白名单",-1)),l[7]||(l[7]=e("p",null,[n(" 预加载脚本在渲染进程加载页面"),e("strong",null,"之前"),n("运行，是唯一同时能触及受限 Node 子集与 Electron API 的地方。就在这个时机，把需要的能力一个个挂出去： ")],-1)),l[8]||(l[8]=e("p",null,[e("code",null,"contextBridge.exposeInMainWorld('api', { getVersion: () => ipcRenderer.invoke('app:get-version'), saveFile: (data) => ipcRenderer.invoke('file:save', data) })"),n("。 ")],-1)),l[9]||(l[9]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,[n("页面拿到的是 "),e("code",null,"window.api.getVersion()"),n(" 这样的窄接口，而不是 "),e("code",null,"ipcRenderer")]),n('。能力边界由你亲手划定，页面能碰到的，只有你写进这份对象里的方法。演示里那个"安全写法"面板，展示的正是这一版。 ')],-1)),l[10]||(l[10]=e("h2",null,"整体暴露安全风险",-1)),l[11]||(l[11]=e("ul",null,[e("li",null,[n("如果暴露的是整个 "),e("code",null,"ipcRenderer"),n(" 对象，页面就能 "),e("code",null,"window.api.ipcRenderer.invoke('任意通道')"),n("，连你没打算给它用的通道也一并敞开，边界形同虚设。")]),e("li",null,[n("暴露整个 "),e("code",null,"os"),n("、"),e("code",null,"fs"),n(" 模块，或干脆把 "),e("code",null,"require"),n(" 递给页面，等于把 Node 摊开，最小权限原则被直接违反。")]),e("li",null,[n("暴露出去的若是普通对象，页面能改写它——比如覆盖 "),e("code",null,"window.api.saveFile"),n("，之后再调用就被劫持了。")]),e("li",null,"页面若只加事件监听、从不移除，组件反复挂载会让监听器越堆越多，最终内存泄漏。")],-1)),l[12]||(l[12]=e("h2",null,"暴露粒度与隔离边界",-1)),l[13]||(l[13]=e("p",null,[n(' 先补"暴露粒度"这一步，因为它直接决定攻击面。原则是'),e("strong",null,"逐一暴露方法，绝不暴露容器对象"),n("：页面能拿到 "),e("code",null,"saveFile"),n(" 这个函数，却拿不到 "),e("code",null,"ipcRenderer"),n("、"),e("code",null,"require"),n("、"),e("code",null,"process"),n(" 本体，每个函数内部才把参数整形后转给指定的通道。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 再补这套机制为什么会成立。它靠的是"),e("strong",null,"上下文隔离"),n("（"),e("code",null,"contextIsolation: true"),n("，Electron 12 起默认开启）：预加载脚本访问的 "),e("code",null,"window"),n(" 和页面访问的 "),e("code",null,"window"),n(" 不是同一个对象，"),e("code",null,"exposeInMainWorld"),n(" 是唯一能安全穿过这两个上下文的方式，底层还会自动处理类型转换、防止原型链污染。 ")],-1)),l[15]||(l[15]=e("p",null,[n(' 再补"只给必需 + 接口固定"。按领域给方法分组命名，比如 '),e("code",null,"app:"),n("、"),e("code",null,"file:"),n("、"),e("code",null,"window:"),n(" 前缀，让人一眼看出每个接口属于哪块能力；暴露出去的对象用 "),e("code",null,"Object.freeze"),n(" 固定，防止页面改写。 ")],-1)),l[16]||(l[16]=e("p",null,[n(' 最后补两道收尾。其一，在 preload 里对参数做第一道类型收窄——注意这只是"第一道"，主进程 handler 的校验仍不可省，两者是纵深上的配合而非互相替代。其二，凡是提供 '),e("code",null,"onXxx"),n(" 监听的接口，都配套提供一个 "),e("code",null,"removeXxxListener"),n("，让页面能主动清理监听器，避免堆积。 ")],-1)),l[17]||(l[17]=e("div",{class:"lesson-box warn"},[e("strong",null,"最危险的那一行："),n("把 "),e("code",null,"ipcRenderer"),n(" 整个暴露出去。被注入的页面可借它调用任意通道，进而触发删文件、起进程一类的主进程敏感操作——preload 里只做通道转发与参数整形，复杂业务逻辑留在主进程，才便于测试与安全审计。 ")],-1)),l[18]||(l[18]=e("h2",null,"两种暴露写法对照",-1)),e("figure",Te,[l[0]||(l[0]=e("figcaption",null,[n("先点「查看安全示例」，看白名单逐一暴露长什么样；再点「查看危险示例」，对照把整个 "),e("code",null,"ipcRenderer"),n(" 暴露后，攻击者能顺手调用哪些通道。")],-1)),C(Be)]),l[19]||(l[19]=e("h2",null,"最小权限与桥接通道",-1)),l[20]||(l[20]=e("p",null,[n(' 预加载脚本的关键不在于"它能拿到多少能力"，而在于"它到底交出了多少"。上下文隔离划出两个世界，'),e("code",null,"exposeInMainWorld"),n(" 是唯一的过桥通道，再靠逐方法暴露、只给必需、接口固定三条，让页面的能力"),e("strong",null,"恰好等于你显式授予的那些"),n("。 ")],-1)),l[21]||(l[21]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「contextBridge」"),n("是上下文隔离下唯一能安全跨越两个上下文的桥梁，"),e("code",null,"contextBridge.exposeInMainWorld(key, api)"),n(" 把白名单方法注入渲染进程的 "),e("code",null,"window"),n("，底层自动做类型转换并防止原型污染。它"),e("strong",null,'只是"过桥的通道"，不是权限本身'),n("——真正的安全来自你只写进白名单的那些方法；"),e("code",null,"ipcRenderer"),n("、"),e("code",null,"require"),n(" 这类原始对象绝不能原样递过去。 ")],-1))]),_:1})}}}),Ne={class:"demo-container"},Le={class:"platform-selector"},$e={class:"events"},Fe={key:0,class:"hint"},ze=w({__name:"E05AppLifecycle",setup(g){const t=f([]),l=f("win");function i(){t.value=[],[{name:"app.whenReady()",desc:"Electron 初始化完成"},{name:"browser-window-created",desc:"创建主窗口"},{name:"web-contents-created",desc:"WebContents 创建"},{name:"window-all-closed",desc:"所有窗口关闭"},{name:l.value==="mac"?"app.activate":"app.quit",desc:l.value==="mac"?"Dock 图标点击":"退出应用"},{name:"before-quit",desc:"退出前清理"},{name:"will-quit",desc:"即将退出"},{name:"quit",desc:"应用已退出"}].forEach((a,d)=>{setTimeout(()=>{t.value.push(`✓ ${a.name} - ${a.desc}`)},d*600)})}return(u,a)=>(s(),r("div",Ne,[a[6]||(a[6]=e("h2",null,"🌰 应用生命周期",-1)),a[7]||(a[7]=e("p",{class:"desc"},"掌握 app 模块的生命周期事件，实现正确的启动和退出逻辑。",-1)),e("div",Le,[e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":a[0]||(a[0]=d=>l.value=d),value:"mac"},null,512),[[A,l.value]]),a[3]||(a[3]=n(" macOS",-1))]),e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":a[1]||(a[1]=d=>l.value=d),value:"win"},null,512),[[A,l.value]]),a[4]||(a[4]=n(" Windows",-1))]),e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":a[2]||(a[2]=d=>l.value=d),value:"linux"},null,512),[[A,l.value]]),a[5]||(a[5]=n(" Linux",-1))])]),e("button",{class:"btn",onClick:i},"模拟生命周期"),e("div",$e,[(s(!0),r(b,null,y(t.value,(d,o)=>(s(),r("div",{key:o,class:"event"},p(d),1))),128)),t.value.length===0?(s(),r("p",Fe,"点击按钮查看生命周期事件")):v("",!0)]),a[8]||(a[8]=e("div",{class:"code-block"},[e("h3",null,"单例应用实现"),e("pre",null,`const gotTheLock = app.requestSingleInstanceLock()
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
}`)],-1))]))}}),Ve=I(ze,[["__scopeId","data-v-93a7f86a"]]),He={class:"lesson-figure"},Je=w({__name:"E05AppLifecycleArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你在 "),e("code",null,"app.whenReady()"),n(" 之前就写了 "),e("code",null,"new BrowserWindow"),n('，程序直接报错"应用就绪前不能创建窗口"；另一个更常见的场景是——用户连点五下图标，任务栏里冒出五个一模一样的窗口，一起抢着写同一份配置。为什么"什么时候能做某件事"这么较真？ ')],-1)),l[2]||(l[2]=e("h2",null,"生命周期与时序约束",-1)),l[3]||(l[3]=e("p",null," 桌面应用有一串绕不开的时序问题：创建窗口前要等应用就绪，退出前要先把数据清理干净，macOS 上关掉窗口并不等于退出应用。这些时机只要有一个踩偏，结果就是白屏、丢数据，或者重复启动好几个实例。 ",-1)),l[4]||(l[4]=e("p",null,[n(" 如果自己在代码里硬排一个顺序，会立刻撞上三笔隐藏成本："),e("strong",null,"平台行为不一致，一套逻辑必然在某个系统上出错"),n("——macOS 关窗驻留、Windows 与 Linux 关窗退出；"),e("strong",null,"用户能重复启动，多个实例同时抢同一份资源"),n("；"),e("strong",null,"退出时没有拦截点，正在写盘的数据可能被中途腰斩"),n("。 ")],-1)),l[5]||(l[5]=e("p",null,' 所以要问的是：应用从启动到退出，中间有一串事件，谁在什么时候告诉你"现在可以创建窗口了""现在要走了"？ ',-1)),l[6]||(l[6]=e("h2",null,"就绪事件创建窗口",-1)),l[7]||(l[7]=e("p",null,[n(" 最朴素的做法：用 "),e("code",null,"app.whenReady()"),n(" 拿到一个 Promise，在它 resolve 之后才创建第一个窗口——"),e("code",null,"app.whenReady().then(createWindow)"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,'它把"应用初始化完成"这个时机变成了一个可等待的信号'),n('。你不必再猜主进程什么时候能建窗口，等 Promise 就行，报错那句"就绪前不能创建窗口"自然消失。 ')],-1)),l[9]||(l[9]=e("h2",null,"全部关闭与退出决策",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,"只等就绪远远不够：所有窗口关掉之后该干什么？不处理的话，Windows 上窗口关光了进程还挂着，或者 macOS 上本该驻留却被误退。"),e("li",null,"用户能重复启动应用：再开一份，两个进程同时写同一份配置或数据库，数据直接互相覆盖。"),e("li",null,"退出时想保存数据却无处下手：等察觉到要退出时，清理流程往往已经走完，来不及了。"),e("li",null,'如果关窗就真的销毁窗口，那些想做成"点 X 隐藏到托盘继续跑"的常驻应用根本实现不了。')],-1)),l[11]||(l[11]=e("h2",null,"多平台退出与单实例",-1)),l[12]||(l[12]=e("p",null,[n(" 先补最影响正确性的平台退出差异。"),e("code",null,"window-all-closed"),n(" 里判断平台："),e("code",null,"process.platform !== 'darwin'"),n(" 时才 "),e("code",null,"app.quit()"),n("，Windows 与 Linux 关窗即退出；macOS 保留进程，并在 "),e("code",null,"activate"),n('（点 Dock 图标）时，若发现没有窗口就重建一个。这一条把"关窗"和"退出"从"必然绑定"拆成了"分平台决定"。 ')],-1)),l[13]||(l[13]=e("p",null,[n(" 再补单例，解决重复启动。在启动最开头调用 "),e("code",null,"app.requestSingleInstanceLock()"),n("： ")],-1)),l[14]||(l[14]=e("ol",{class:"lesson-steps"},[e("li",null,[n("拿不到锁，说明已有实例在运行，"),e("strong",null,[n("立刻 "),e("code",null,"app.quit()"),n(" 并结束")]),n("。")]),e("li",null,[n("拿到锁，注册 "),e("code",null,"second-instance"),n(" 事件——第二个实例被启动时会触发它。")]),e("li",null,[n("在回调里把已有窗口从最小化状态 "),e("code",null,"restore()"),n(" 并 "),e("code",null,"focus()"),n('，让用户感觉"点图标是把应用叫到前面"。')]),e("li",null,"第二个实例带来的命令行参数也在这里处理，比如某个要打开的文件路径。")],-1)),l[15]||(l[15]=e("p",null,[n(" 接着补退出链路。"),e("code",null,"before-quit"),n(" → "),e("code",null,"will-quit"),n(" → "),e("code",null,"quit"),n(' 依次触发。要做"退出前保存数据"，就在 '),e("code",null,"before-quit"),n(" 里 "),e("code",null,"event.preventDefault()"),n(" 拦住，等清理完成后"),e("strong",null,[n("再调一次 "),e("code",null,"app.quit()")]),n("；为避免反复拦截，用一个 "),e("code",null,"isQuitting"),n(" 标志位记录状态。"),e("code",null,"will-quit"),n(" 则适合做确定性的收尾，比如统一注销全局快捷键。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 最后补初始化的幂等与集中。开发期热重载可能让 "),e("code",null,"ready"),n(" 被触发多次，所以全局资源——托盘、全局快捷键、自动更新——统一放在 "),e("code",null,"ready"),n(" 之后初始化，并且保证重复执行也安全；否则托盘会被建好几份，快捷键会重复注册。把这一条养成习惯，启动阶段的资源管理就不会失控。 ")],-1)),l[17]||(l[17]=e("div",{class:"lesson-box warn"},[e("strong",null,"两个容易翻车的地方："),e("code",null,"before-quit"),n(" 里的 "),e("code",null,"preventDefault"),n(" 只能拦一次，若不设标志位就再调 "),e("code",null,"app.quit()"),n("，会陷入反复触发；另外，写退出逻辑前先想清楚目标平台——macOS 默认关窗不退出，直接套 Windows 的写法会把用户的应用意外关掉。 ")],-1)),l[18]||(l[18]=e("h2",null,"三平台退出行为对照",-1)),e("figure",He,[l[0]||(l[0]=e("figcaption",null,[n("先在上面切换 macOS / Windows / Linux，再点「模拟生命周期」，观察 "),e("code",null,"window-all-closed"),n(" 之后是走向 "),e("code",null,"activate"),n(" 重建窗口，还是走向 "),e("code",null,"quit"),n(" 直接退出。")],-1)),C(Ve)]),l[19]||(l[19]=e("h2",null,"启动与退出时序",-1)),l[20]||(l[20]=e("p",null,[n(" 应用生命周期是一份时间表："),e("code",null,"whenReady"),n(" 之后才创建窗口，"),e("code",null,"window-all-closed"),n(" 决定去还是留，"),e("code",null,"before-quit"),n(" 与 "),e("code",null,"will-quit"),n(" 负责清理，单实例锁拦住重复启动。把每个时机该做的事放对位置，启动和退出这两个最容易出问题的阶段就稳了。 ")],-1)),l[21]||(l[21]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「单实例锁」"),n("由 "),e("code",null,"app.requestSingleInstanceLock()"),n(" 获取，用来保证同一时间只有一个应用实例在运行。它的用法有两条硬边界："),e("strong",null,[n("拿不到锁就必须立即 "),e("code",null,"app.quit()")]),n("，否则第二个实例会继续跑下去；"),e("strong",null,[n("拿到锁后要在 "),e("code",null,"second-instance"),n(" 里把已有窗口恢复并聚焦")]),n('，不然用户以为"启动了"，眼前却什么都没发生。 ')],-1))]),_:1})}}}),Ke={class:"demo-container"},Ge={class:"menu-demo"},Qe={class:"menu-bar"},Xe={class:"menu-label"},Ye={class:"submenu"},Ze=["onClick"],_e={key:0,class:"result"},en=w({__name:"E06NativeMenu",setup(g){const t=f([{label:"文件",submenu:["新建","打开","保存","---","退出"]},{label:"编辑",submenu:["撤销","重做","---","复制","粘贴"]},{label:"视图",submenu:["刷新","全屏","开发者工具"]},{label:"帮助",submenu:["关于"]}]),l=f("");function i(u){u!=="---"&&(l.value=u)}return(u,a)=>(s(),r("div",Ke,[a[0]||(a[0]=e("h2",null,"🌰 原生菜单",-1)),a[1]||(a[1]=e("p",{class:"desc"},"使用 Menu 和 MenuItem 构建跨平台原生菜单，掌握 role 系统和快捷键。",-1)),e("div",Ge,[e("div",Qe,[(s(!0),r(b,null,y(t.value,d=>(s(),r("div",{key:d.label,class:"menu-item"},[e("span",Xe,p(d.label),1),e("div",Ye,[(s(!0),r(b,null,y(d.submenu,(o,c)=>(s(),r("div",{key:c,class:S(["submenu-item",{separator:o==="---"}]),onClick:m=>i(o)},[o!=="---"?(s(),r(b,{key:0},[n(p(o),1)],64)):v("",!0)],10,Ze))),128))])]))),128))])]),l.value?(s(),r("div",_e," 点击了: "+p(l.value),1)):v("",!0),a[2]||(a[2]=M(`<div class="code-block" data-v-593f5577><h3 data-v-593f5577>Menu 代码示例</h3><pre data-v-593f5577>const menu = Menu.buildFromTemplate([
  {
    label: &#39;文件&#39;,
    submenu: [
      { label: &#39;新建&#39;, accelerator: &#39;CmdOrCtrl+N&#39;, role: &#39;newWindow&#39; },
      { label: &#39;保存&#39;, accelerator: &#39;CmdOrCtrl+S&#39;, click: () =&gt; save() },
      { type: &#39;separator&#39; },
      { label: &#39;退出&#39;, accelerator: &#39;CmdOrCtrl+Q&#39;, role: &#39;quit&#39; }
    ]
  },
  {
    label: &#39;编辑&#39;,
    submenu: [
      { role: &#39;undo&#39; },  // 自动本地化为&quot;撤销&quot;
      { role: &#39;redo&#39; },
      { type: &#39;separator&#39; },
      { role: &#39;copy&#39; },
      { role: &#39;paste&#39; }
    ]
  }
])
Menu.setApplicationMenu(menu)</pre></div><div class="tips" data-v-593f5577><h3 data-v-593f5577>关键要点</h3><ul data-v-593f5577><li data-v-593f5577><strong data-v-593f5577>role</strong> 属性会自动本地化并绑定标准行为，优先使用</li><li data-v-593f5577><strong data-v-593f5577>accelerator</strong> 使用跨平台格式：CmdOrCtrl、Alt、Shift、Plus</li><li data-v-593f5577><strong data-v-593f5577>macOS</strong> 菜单栏与应用绑定，Windows/Linux 与窗口绑定</li><li data-v-593f5577><strong data-v-593f5577>上下文菜单</strong> 使用 Menu.popup() 在右键时显示</li></ul></div>`,2))]))}}),nn=I(en,[["__scopeId","data-v-593f5577"]]),ln={class:"lesson-figure"},on=w({__name:"E06NativeMenuArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你在渲染进程里用 "),e("code",null,"<div>"),n(' 画了一个漂亮的右键菜单，交互看着完全正常——直到用户选中一段文字想"复制"，去点你菜单里的"复制"，剪贴板里却什么都没有；那个浮层还会在别处点击时愣着不消失。 ')],-1)),l[2]||(l[2]=e("h2",null,"手工菜单能力缺口",-1)),l[3]||(l[3]=e("p",null,[n(' 桌面应用想把常用操作摆到用户顺手的地方：顶部一条菜单栏，右键再弹出一组上下文操作。你第一反应是自己画——用 HTML 和 CSS 做菜单，想放什么就放什么。可一旦动手就会发现，菜单栏里的"撤销""复制""粘贴"这些词不是文案，而是'),e("strong",null,"系统已经实现好的动作"),n("：你画出来的只是一个长得像菜单的盒子，点下去不会真的触发系统的编辑行为，也拿不到那些动作的启用/禁用状态。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 自己维护一套菜单还要背上三笔隐藏成本："),e("strong",null,"平台菜单结构不一样"),n('，macOS 顶端第一个菜单是应用名，里面装着"关于 / 服务 / 隐藏 / 退出"，Windows 与 Linux 没有这一项，硬编码一套结构，到了另一个系统就会缺项或重复；'),e("strong",null,"文案与快捷键要自己本地化"),n('，"复制"在英文系统里该显示 Copy、快捷键要按平台显示 ⌘ 或 Ctrl，全靠手写永远对不齐；'),e("strong",null,"启用状态无人托管"),n('，没有选中文字时"复制"本该置灰，这套状态逻辑没人替你维护。 ')],-1)),l[5]||(l[5]=e("p",null," 所以要问的是：有没有一种写法，让操作系统自己去构建这份菜单——包括外观、本地化、快捷键和启用状态？ ",-1)),l[6]||(l[6]=e("h2",null,"模板数组声明菜单",-1)),l[7]||(l[7]=e("p",null,[n(" 最朴素的做法是用 "),e("code",null,"Menu.buildFromTemplate(template)"),n(" 把菜单描述成一个数组，再用 "),e("code",null,"Menu.setApplicationMenu(menu)"),n(" 挂上去。模板就是普通对象："),e("code",null,"{ label: '文件', submenu: [...] }"),n("，子项可以是分隔线 "),e("code",null,"{ type: 'separator' }"),n("，也可以带 "),e("code",null,"accelerator"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,'把菜单从"像素和事件"变成了"结构描述"'),n('。你只声明"这里有一个叫文件的菜单，里面有一项新建"，剩下的渲染外观、快捷键提示、平台细节，全交给操作系统去办；这套代码必须写在'),e("strong",null,"主进程"),n('里，因为菜单是系统资源，渲染进程只负责通过 IPC 请求"弹一下右键菜单"。 ')],-1)),l[9]||(l[9]=e("h2",null,"手写点击失效场景",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n('给"复制"手写 '),e("code",null,"click"),n("：点下去剪贴板里什么都没有——DOM 层拿不到系统的编辑剪贴板，这个动作只能由系统来做。")]),e("li",null,[n("只写 "),e("code",null,"label: '复制'"),n(" 不写 "),e("code",null,"role"),n("：英文系统的用户看到的仍是中文，快捷键提示也不对，翻译还得自己维护。")]),e("li",null,[n("快捷键写死成 "),e("code",null,"'Ctrl+S'"),n("：macOS 用户看到的还是 Ctrl 而不是 ⌘，跨平台直接错位。")]),e("li",null,'菜单树写死一套：macOS 顶部少了应用名菜单，找不到"关于 / 退出"；Windows 上却莫名多出一个重复的"退出"。'),e("li",null,[e("code",null,"click"),n(" 里直接写 "),e("code",null,"mainWindow.show()"),n("：窗口被关掉后再点菜单，操作的是已销毁的窗口，报错或毫无反应。")])],-1)),l[11]||(l[11]=e("h2",null,"标准动作角色声明",-1)),l[12]||(l[12]=e("p",null,[n(" 第一件事是"),e("strong",null,"让标准动作用 role 声明"),n("。撤销、重做、剪切、复制、粘贴、全选、刷新、开发者工具、缩放、全屏、最小化、关闭、退出……这些都有对应的 "),e("code",null,"role"),n("。写下 "),e("code",null,"{ role: 'copy' }"),n("，系统就自动实现行为、本地化文案并绑定默认快捷键，比手写 "),e("code",null,"click"),n(" 又准又省。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 第二步补上平台结构差异。macOS 的第一个菜单应该是应用名，用 "),e("code",null,"process.platform === 'darwin'"),n(" 判断后在模板最前面插入： ")],-1)),l[14]||(l[14]=e("ol",{class:"lesson-steps"},[e("li",null,[n("macOS 专用项："),e("code",null,"{ label: app.name, submenu: [{ role: 'about' }, …, { role: 'quit' }] }"),n("，把关于、服务、隐藏、退出都收在这里。")]),e("li",null,[n("文件菜单末尾的退出项：macOS 用 "),e("code",null,"{ role: 'close' }"),n("（关窗），其他平台用 "),e("code",null,"{ role: 'quit' }"),n("（退出应用）。")]),e("li",null,[n("窗口菜单里，macOS 额外加 "),e("code",null,"{ role: 'front' }"),n("，其他平台用 "),e("code",null,"{ role: 'close' }"),n("。")])],-1)),l[15]||(l[15]=e("p",null,[n(' 第三步才轮到自定义动作。只有系统没有内置的动作——比如"新建文件""打开文件…"——才自己写 '),e("code",null,"click"),n("，并配上跨平台的 "),e("code",null,"accelerator"),n("，例如 "),e("code",null,"'CmdOrCtrl+N'"),n("、"),e("code",null,"'CmdOrCtrl+Shift+S'"),n("；前缀用 "),e("code",null,"CmdOrCtrl"),n("，就能在 macOS 上自动显示成 ⌘、在 Windows/Linux 上显示成 Ctrl。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 第四步处理窗口的安全取用。"),e("code",null,"click"),n(" 里不要直接用某个保存下来的窗口变量（它可能已销毁），而是调用 "),e("code",null,"BrowserWindow.getFocusedWindow()"),n(" 取当前聚焦窗口并判空，取不到就安全返回。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补上下文菜单。右键菜单同样是"),e("strong",null,"一份模板"),n("，只是用 "),e("code",null,"menu.popup({ window, x, y })"),n(" 在指定位置弹出。渲染进程拿不到 "),e("code",null,"Menu"),n("，所以流程是：渲染进程把坐标通过 IPC 发给主进程，主进程用 "),e("code",null,"BrowserWindow.fromWebContents(event.sender)"),n(" 找到发起请求的窗口再弹出。还有一个容易忽略的点："),e("strong",null,'菜单的更新是"重建再挂载"'),n("——要改菜单时，重新 "),e("code",null,"buildFromTemplate"),n(" 一份新的再 "),e("code",null,"setApplicationMenu"),n("，而不是去改已挂载的那个实例。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"两个边界："),e("code",null,"accelerator"),n(" 只在应用聚焦（菜单栏可见）时生效；要让应用未聚焦时也响应按键，得改用 "),e("code",null,"globalShortcut"),n("，两者职责别混。另外，菜单栏归属有平台差异——"),e("strong",null,"macOS 的菜单栏属于应用整体，Windows 与 Linux 的菜单栏属于某个窗口"),n("，这决定了你更新菜单时的影响范围。 ")],-1)),l[19]||(l[19]=e("h2",null,"逐项展开与回调日志",-1)),e("figure",ln,[l[0]||(l[0]=e("figcaption",null,[n('把鼠标移到菜单条上的"文件 / 编辑 / 视图 / 帮助"逐项展开，点任意一项，看它落进下方的"点击了: xxx"——这一刻对应的就是主进程里那项 '),e("code",null,"click"),n(" 回调被触发。")],-1)),C(nn)]),l[20]||(l[20]=e("h2",null,"菜单构建交还系统",-1)),l[21]||(l[21]=e("p",null,[n(' 原生菜单的关键，是把"菜单长什么样、点了做什么"交还给系统：用 '),e("code",null,"buildFromTemplate"),n(" 声明结构、用 "),e("code",null,"setApplicationMenu"),n(" 挂载，标准动作交给 "),e("code",null,"role"),n("，平台差异用 "),e("code",null,"process.platform"),n(" 单独补，自定义动作才写 "),e("code",null,"click"),n(" 和 "),e("code",null,"accelerator"),n('。它必须住在主进程——渲染进程只发一句"请求弹菜单"，真正的构建与系统绑定都发生在主进程。 ')],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「role（角色）」"),n('是 MenuItem 上声明"这一项是系统标准命令"的字段，例如 '),e("code",null,"copy"),n("、"),e("code",null,"paste"),n("、"),e("code",null,"undo"),n("、"),e("code",null,"quit"),n("。它会由系统实现行为、本地化文案并绑定默认快捷键。两条边界要记住："),e("strong",null,[n("设了 "),e("code",null,"role"),n(" 就不该再指望自己的 "),e("code",null,"click"),n(" 生效")]),n("（标准行为已经接管）；而且不是所有动作都有 role，业务动作必须自己写 "),e("code",null,"click"),n("。 ")],-1))]),_:1})}}}),tn={class:"demo-container"},sn={class:"tray-controls"},rn=["disabled"],an=["disabled"],dn={class:"action-log"},un={key:0,class:"hint"},cn=w({__name:"E07Tray",setup(g){const t=f([]),l=f(!1);function i(){l.value=!l.value,t.value.push(l.value?"创建托盘图标":"移除托盘图标")}function u(){l.value&&t.value.push("托盘图标被点击 - 显示/隐藏窗口")}function a(){l.value&&(t.value.push("右键点击托盘 - 显示上下文菜单"),t.value.push('菜单项"显示"被点击'))}return(d,o)=>(s(),r("div",tn,[o[2]||(o[2]=e("h2",null,"🌰 系统托盘",-1)),o[3]||(o[3]=e("p",{class:"desc"},"创建系统托盘图标，实现托盘菜单、气泡通知和点击交互。",-1)),e("div",sn,[e("button",{class:"btn",onClick:i},p(l.value?"移除托盘图标":"创建托盘图标"),1),e("button",{class:"btn secondary",onClick:u,disabled:!l.value}," 模拟左键点击 ",8,rn),e("button",{class:"btn secondary",onClick:a,disabled:!l.value}," 模拟右键点击 ",8,an)]),e("div",{class:S(["tray-visual",{active:l.value}])},[...o[0]||(o[0]=[e("div",{class:"tray-icon"},"📌",-1),e("div",{class:"tray-label"},"My Electron App",-1)])],2),e("div",dn,[o[1]||(o[1]=e("h3",null,"操作日志",-1)),(s(!0),r(b,null,y(t.value,(c,m)=>(s(),r("div",{key:m,class:"log-item"},p(c),1))),128)),t.value.length===0?(s(),r("p",un,"点击按钮查看托盘操作")):v("",!0)]),o[4]||(o[4]=e("div",{class:"code-block"},[e("h3",null,"托盘代码示例"),e("pre",null,`// 主进程
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
})`)],-1))]))}}),pn=I(cn,[["__scopeId","data-v-225b8aab"]]),mn={class:"lesson-figure"},wn=w({__name:"E07TrayArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你在函数里写下 "),e("code",null,"const tray = new Tray(icon)"),n('，刚启动时托盘区确实出现了图标；可过一会儿它自己就消失了，程序没崩、控制台也没有任何报错——一个"常驻"图标怎么会自己溜走？ ')],-1)),l[2]||(l[2]=e("h2",null,"后台常驻入口需求",-1)),l[3]||(l[3]=e("p",null,' 你想做一个能待在后台的应用：用户点了窗口右上角的 ×，程序不退出，而是缩进系统托盘区，需要时再从那里唤回来。可如果没有这个常驻入口，用户一关窗就彻底找不到应用了——任务栏里没了、桌面也看不见，只剩一个还在占内存、占端口的"幽灵进程"，只能去任务管理器把它杀掉。 ',-1)),l[4]||(l[4]=e("p",null,[n(" 想在托盘区放个图标，自己动手会有三笔隐藏成本："),e("strong",null,"图标不是画上去就完事"),n("，它得由系统托管、随时可点击，还要在深浅色主题下都看得清；"),e("strong",null,"关闭语义必须拆开"),n('，"关掉窗口"和"退出应用"是两件事，混在一起要么关不掉、要么误退出丢掉未保存的数据；'),e("strong",null,"点击行为要区分左右键"),n("，左键通常切换窗口显隐，右键要弹出菜单，做成一样用户就懵了。 ")],-1)),l[5]||(l[5]=e("p",null,' 所以要问的是：怎样在系统层面放一个受管理的常驻入口，既能随时唤回窗口，又能把"关窗"和"退出"这两件性质完全不同的事讲清楚？ ',-1)),l[6]||(l[6]=e("h2",null,"托盘实例与菜单挂载",-1)),l[7]||(l[7]=e("p",null,[n(" 最朴素的写法是用 "),e("code",null,"new Tray(icon)"),n(" 创建托盘，再用 "),e("code",null,"setToolTip"),n(" 设悬停提示、用 "),e("code",null,"setContextMenu"),n(" 挂上右键菜单。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它给了应用一个由操作系统托管的常驻入口"),n("。窗口可以藏起来，入口还在；而这一切都在主进程完成，因为托盘是系统资源，渲染进程根本碰不到它。 ")],-1)),l[9]||(l[9]=e("h2",null,"图标回收与引用失效",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("把 "),e("code",null,"Tray"),n(" 实例存在函数局部变量里：函数返回后没有任何强引用，图标被垃圾回收，"),e("strong",null,"悄无声息地消失"),n("，还不报错。")]),e("li",null,"图标随便传一张 256×256 的彩色 PNG：在只有十几像素的托盘区被压得模糊；macOS 上不用黑白模板图，深色菜单栏里几乎看不见。"),e("li",null,[n("只监听 "),e("code",null,"click"),n(" 切换显隐：Windows 上左键和右键都被算作点击，用户想右键看菜单，窗口却被切没了。")]),e("li",null,[n("关窗时无脑 "),e("code",null,"preventDefault()"),n(" 加 "),e("code",null,"hide()"),n('：用户从系统层面关窗、或系统注销时也无法退出，应用"关不掉"。')]),e("li",null,'没提供任何"退出"入口：用户想正常退出只能去杀进程。')],-1)),l[11]||(l[11]=e("h2",null,"模块级引用与退出语义",-1)),l[12]||(l[12]=e("p",null,[n(" 先补最要命的一条——"),e("strong",null,"让引用活着"),n("。把 "),e("code",null,"Tray"),n(' 提升为模块级的全局变量持有（而不是函数里的局部变量），这样它才不会被垃圾回收；这也是官方文档反复强调的"必须保持对 Tray 的引用"。 ')],-1)),l[13]||(l[13]=e("p",null,[n(" 第二步挂上右键菜单："),e("code",null,"tray.setContextMenu(Menu.buildFromTemplate([...]))"),n('，放"显示主窗口 / 隐藏主窗口 / 设置 / 退出"几项。菜单模板和上一课同源，只是挂在托盘上；"退出"这一项要调用 '),e("code",null,"app.quit()"),n("。 ")],-1)),l[14]||(l[14]=e("p",null," 第三步拆开关闭语义，这是托盘应用最核心的一步： ",-1)),l[15]||(l[15]=e("ol",{class:"lesson-steps"},[e("li",null,[n("维护一个 "),e("code",null,"isQuitting"),n(' 标志，从托盘的"退出"菜单进入时先把它置为 '),e("code",null,"true"),n("。")]),e("li",null,[n("拦截窗口的 "),e("code",null,"close"),n("：如果 "),e("code",null,"isQuitting"),n(" 为真，就放行，让窗口真正关闭、应用真正退出。")]),e("li",null,[n("否则 "),e("code",null,"event.preventDefault()"),n(" 并 "),e("code",null,"win.hide()"),n("，把窗口藏进托盘。")]),e("li",null,[n("顺手弹一条 "),e("code",null,"Notification"),n(' 告诉用户"程序仍在托盘继续运行"，免得他以为应用被关掉了。')])],-1)),l[16]||(l[16]=e("p",null,[n(" 第四步补点击行为：单击 "),e("code",null,"click"),n(" 用 "),e("code",null,"mainWindow.isVisible()"),n(" 判断后切换显隐，双击 "),e("code",null,"double-click"),n(" 则显示并聚焦。macOS 上单击通常只弹菜单，双击行为按平台适配即可。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补平台细节。macOS 的托盘图标建议用黑白"),e("strong",null,"模板图像"),n("（并准备 @2x 版本），系统会自动适配深浅色；纯托盘应用还可以用 "),e("code",null,"app.dock.hide()"),n(" 隐藏 Dock 图标，再用 "),e("code",null,"setBadge"),n(" 显示未读角标。通知要在 "),e("code",null,"app.whenReady()"),n(" 之后再弹。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"一个后果常被忽略："),n("一旦拦截了 "),e("code",null,"close"),n("，"),e("code",null,"window-all-closed"),n(' 就不再等于"用户想退出"了——窗口全被藏起来，事件根本不会触发。也就是说，'),e("strong",null,'退出意图只能由显式的"退出"菜单项来传递'),n('；忘了给这个入口，用户就会觉得应用"关不掉"。 ')],-1)),l[19]||(l[19]=e("h2",null,"左右键点击日志",-1)),e("figure",mn,[l[0]||(l[0]=e("figcaption",null,"点「创建托盘图标」，再分别按「模拟左键点击」「模拟右键点击」，看操作日志里图标创建、窗口显隐切换、右键弹出菜单按顺序被记下来。",-1)),C(pn)]),l[20]||(l[20]=e("h2",null,"常驻应用三项职责",-1)),l[21]||(l[21]=e("p",null,[n(" 托盘应用要同时管好三件事：让 "),e("code",null,"Tray"),n(" 实例被全局持有、别被 GC 回收；用 "),e("code",null,"setContextMenu"),n(" 把菜单挂上去、用 "),e("code",null,"click"),n(' 切换窗口显隐；并把"关窗"和"退出"彻底分开——普通关闭只隐藏，只有显式的"退出"才走 '),e("code",null,"app.quit()"),n("。这三条立住，后台常驻才真的可用。 ")],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「模板图像（template image）」"),n("是 macOS 上的一种特殊图标：你提供一张纯黑白（带透明通道）的图并标记为模板，系统会据此在浅色与深色菜单栏中自动反色，让它始终清晰。它的边界是"),e("strong",null,"只对 macOS 有意义"),n("——Windows 与 Linux 请用普通彩色 PNG，并按 16×16 与 32×32（@2x）两档准备尺寸，否则会被拉伸失真。 ")],-1))]),_:1})}}}),gn={class:"demo-container"},fn={class:"dialog-types"},vn={class:"demo-buttons"},bn={key:0,class:"result"},yn={class:"code-block"},Sn={key:0},xn={key:1},In={key:2},Pn=w({__name:"E08Dialog",setup(g){const t=f(""),l=f("open");function i(){t.value="已选择文件: /Users/xxx/Documents/report.pdf"}function u(){t.value="保存位置: /Users/xxx/Desktop/output.json"}function a(){t.value="用户点击了: OK"}return(d,o)=>(s(),r("div",gn,[o[4]||(o[4]=e("h2",null,"🌰 文件对话框",-1)),o[5]||(o[5]=e("p",{class:"desc"},"使用 dialog 模块打开文件选择、保存对话框和消息框。",-1)),e("div",fn,[e("button",{class:S({active:l.value==="open"}),onClick:o[0]||(o[0]=c=>l.value="open")},"打开文件",2),e("button",{class:S({active:l.value==="save"}),onClick:o[1]||(o[1]=c=>l.value="save")},"保存文件",2),e("button",{class:S({active:l.value==="message"}),onClick:o[2]||(o[2]=c=>l.value="message")},"消息框",2)]),e("div",vn,[l.value==="open"?(s(),r("button",{key:0,class:"btn",onClick:i},"打开文件对话框")):v("",!0),l.value==="save"?(s(),r("button",{key:1,class:"btn",onClick:u},"打开保存对话框")):v("",!0),l.value==="message"?(s(),r("button",{key:2,class:"btn",onClick:a},"显示消息框")):v("",!0)]),t.value?(s(),r("div",bn,p(t.value),1)):v("",!0),e("div",yn,[o[3]||(o[3]=e("h3",null,"Dialog API 示例",-1)),l.value==="open"?(s(),r("pre",Sn,`// 打开文件对话框
const result = await dialog.showOpenDialog(mainWindow, {
  title: '选择文件',
  defaultPath: app.getPath('documents'),
  filters: [
    { name: 'JSON', extensions: ['json'] },
    { name: '所有文件', extensions: ['*'] }
  ],
  properties: ['openFile', 'multiSelections']
})

if (!result.canceled) {
  console.log(result.filePaths)
}`)):v("",!0),l.value==="save"?(s(),r("pre",xn,`// 保存文件对话框
const result = await dialog.showSaveDialog(mainWindow, {
  title: '保存文件',
  defaultPath: 'output.json',
  filters: [
    { name: 'JSON', extensions: ['json'] }
  ]
})

if (!result.canceled) {
  fs.writeFileSync(result.filePath, data)
}`)):v("",!0),l.value==="message"?(s(),r("pre",In,`// 消息框
const result = await dialog.showMessageBox(mainWindow, {
  type: 'question',
  title: '确认',
  message: '是否保存更改?',
  buttons: ['保存', '不保存', '取消'],
  defaultId: 0,
  cancelId: 2
})

console.log(result.response) // 0, 1, 2`)):v("",!0)])]))}}),kn=I(Pn,[["__scopeId","data-v-6f9d15cb"]]),Cn={class:"lesson-figure"},hn=w({__name:"E08DialogArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n('用户在选择文件的对话框里点了"取消"，你的代码照常往下走，'),e("code",null,"result.filePaths[0]"),n(" 拿到的是 "),e("code",null,"undefined"),n("，读取文件时当场崩溃——对话框明明返回了结果，为什么它是个空壳？ ")],-1)),l[2]||(l[2]=e("h2",null,"原生对话框路径需求",-1)),l[3]||(l[3]=e("p",null,[n(" 桌面应用经常要向用户要一个文件路径：打开时让他选，保存时让他定位置，做危险操作前还要弹一个确认框。你想在页面里自己实现，很快就会发现寸步难行：用 HTML 的 "),e("code",null,'<input type="file">'),n(" 只能拿到一个浏览器封装的 "),e("code",null,"File"),n(" 对象，"),e("strong",null,"拿不到真实的文件系统绝对路径"),n("，而桌面应用恰恰需要这个路径去读写磁盘。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 自己动手还有两笔成本："),e("strong",null,"原生外观与行为对不上"),n("，macOS 的对话框会像一张便签贴在窗口顶部、Windows 是独立窗口，这些系统样式自绘永远模仿不到位；"),e("strong",null,"模态关系处理不了"),n("，真正的系统对话框弹出时会锁住父窗口，你的自绘浮层挡不住用户去点父窗口，模态就是假的。 ")],-1)),l[5]||(l[5]=e("p",null,[n(" 所以要问的是：怎样向用户要到文件路径或一次确认，并且把结果"),e("strong",null,"可靠地"),n("拿回主进程？ ")],-1)),l[6]||(l[6]=e("h2",null,"打开对话框调用",-1)),l[7]||(l[7]=e("p",null,[n(" 最直接的做法是 "),e("code",null,"await dialog.showOpenDialog(win, { properties: ['openFile'] })"),n("，再从返回结果里取 "),e("code",null,"filePaths"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"拿到的是真实的文件系统绝对路径，而且对话框由操作系统原生绘制、自带真正的模态"),n("。它必须写在主进程——"),e("code",null,"dialog"),n(" 是主进程模块，渲染进程里根本没有它。 ")],-1)),l[9]||(l[9]=e("h2",null,"判空缺失与字段误读",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("不判断 "),e("code",null,"result.canceled"),n('：用户点"取消"时 '),e("code",null,"filePaths"),n(" 是空数组，"),e("code",null,"filePaths[0]"),n(" 得到 "),e("code",null,"undefined"),n("，下游拿去读文件直接崩。")]),e("li",null,[n("把 "),e("code",null,"dialog"),n(" 写在渲染进程：那里没有这个模块，导入就是 "),e("code",null,"undefined"),n("，调用即报错；它也不该接触系统资源。")]),e("li",null,[n("三个 API 的返回值混用：打开返回 "),e("code",null,"{ canceled, filePaths }"),n("、保存返回 "),e("code",null,"{ canceled, filePath }"),n("（注意是单数）、消息框返回 "),e("code",null,"{ response }"),n("，取错字段就静默出错。")]),e("li",null,[n("用了 "),e("code",null,"showOpenDialogSync"),n(" 这类同步版本：它"),e("strong",null,"阻塞主进程"),n("，对话框还开着的时候整个应用都不响应。")]),e("li",null,"调用时不传窗口参数：对话框不附着到任何窗口，父窗口还能被操作，模态名存实亡。")],-1)),l[11]||(l[11]=e("h2",null,"三类结果结构差异",-1)),l[12]||(l[12]=e("p",null,[n(" 第一件事是"),e("strong",null,"把三个 API 的返回结构分清楚，并且永远先判空"),n("： ")],-1)),l[13]||(l[13]=e("ol",{class:"lesson-steps"},[e("li",null,[e("code",null,"showOpenDialog"),n(" → "),e("code",null,"{ canceled, filePaths }"),n("，"),e("code",null,"filePaths"),n(" 是数组，支持多选。")]),e("li",null,[e("code",null,"showSaveDialog"),n(" → "),e("code",null,"{ canceled, filePath }"),n("，注意是单数，返回用户敲定的完整路径。")]),e("li",null,[e("code",null,"showMessageBox"),n(" → "),e("code",null,"{ response, checkboxChecked }"),n("，"),e("code",null,"response"),n(" 是被点中按钮的索引。")]),e("li",null,[n("拿到结果后的第一句永远是 "),e("code",null,"if (result.canceled) return null"),n("，判空之后再取字段。")])],-1)),l[14]||(l[14]=e("p",null,[n(" 第二步补筛选与行为控制。用 "),e("code",null,"filters"),n(" 限定可选扩展名，例如 "),e("code",null,"{ name: '文本文件', extensions: ['txt', 'md'] }"),n("；用 "),e("code",null,"properties"),n(" 控制行为："),e("code",null,"'openFile'"),n(" 选文件、"),e("code",null,"'openDirectory'"),n(" 选目录、"),e("code",null,"'multiSelections'"),n(" 允许多选、"),e("code",null,"'showHiddenFiles'"),n(" 显示隐藏文件。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 第三步把消息框的按钮讲准。"),e("code",null,"buttons"),n(" 数组决定文案与顺序，"),e("code",null,"defaultId"),n(" 指定默认高亮的按钮，"),e("code",null,"cancelId"),n(' 指定按 ESC 时命中哪个按钮（通常指向"取消"）；'),e("code",null,"type"),n(" 决定图标语义（"),e("code",null,"info"),n(" / "),e("code",null,"error"),n(" / "),e("code",null,"question"),n(" / "),e("code",null,"warning"),n('）；需要"不再提示"时加 '),e("code",null,"checkboxLabel"),n("，结果里的 "),e("code",null,"checkboxChecked"),n(" 会告诉你用户怎么选的。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 第四步补模态归属：调用时把窗口实例作为"),e("strong",null,"第一个参数"),n("传进去——"),e("code",null,"dialog.showOpenDialog(win, ...)"),n("。窗口实例从 IPC 里用 "),e("code",null,"BrowserWindow.fromWebContents(event.sender)"),n(" 拿回来，这样对话框才会正确附着在发起请求的那个窗口上（macOS 上会以 sheet 形式贴着窗口出现），多窗口应用里才不会弹错地方。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补边界封装：对话框只在主进程调用，通过 preload + IPC 暴露成"),e("strong",null,"语义化"),n("的单一方法（"),e("code",null,"openFile"),n(" / "),e("code",null,"saveFile"),n(" / "),e("code",null,"confirm"),n("），渲染进程只拿到最终路径或 "),e("code",null,"null"),n("，完全不感知 "),e("code",null,"dialog"),n(" 的存在；同时坚决避开 "),e("code",null,"*Sync"),n(" 同步版本，别让它阻塞主进程。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"记住两条硬边界："),n("渲染进程不能直接使用 "),e("code",null,"dialog"),n("，必须经 preload + IPC 交给主进程；同步版本（"),e("code",null,"showOpenDialogSync"),n(" 等）会阻塞主进程，一律避免。 ")],-1)),l[19]||(l[19]=e("h2",null,"三个页签结果对照",-1)),e("figure",Cn,[l[0]||(l[0]=e("figcaption",null,'切换「打开文件 / 保存文件 / 消息框」三个页签各点一次，看下方返回的是路径还是按钮索引——然后想象点"取消"时这些值会变成什么样。',-1)),C(kn)]),l[20]||(l[20]=e("h2",null,"返回语义与调用封装",-1)),l[21]||(l[21]=e("p",null,[n(' 原生对话框把"向用户要路径、要一次确认"交给系统，但代价是你必须读懂它的返回结构：打开取 '),e("code",null,"filePaths"),n("、保存取 "),e("code",null,"filePath"),n("、消息框取 "),e("code",null,"response"),n("，且"),e("strong",null,[n("每一步都先看 "),e("code",null,"canceled")]),n("。把窗口实例传进去让对话框正确附着，再用 preload + IPC 把它封成渲染进程只认的简单方法，这套机制就既好用又安全。 ")],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「模态对话框（modal dialog）」"),n("指弹出后会阻止用户与父窗口交互、直到它被关闭的对话框。它的关键边界是"),e("strong",null,"附着关系：把窗口作为第一个参数传入，对话框才会真正绑定到该窗口"),n("（macOS 上以 sheet 形式贴附），父窗口才会被正确锁住；不传窗口参数时，行为会退化成孤立弹窗，多窗口场景下容易弹错窗口。 ")],-1))]),_:1})}}}),Wn={class:"demo-container"},Mn={class:"shortcut-list"},An=["checked","onChange"],En=["onClick"],qn=w({__name:"E09Shortcuts",setup(g){const t=f([]),l=["CmdOrCtrl+Shift+K","CmdOrCtrl+Alt+N","F11","CmdOrCtrl+Space"];function i(a){t.value.includes(a)?t.value=t.value.filter(d=>d!==a):t.value.push(a)}function u(a){alert(`快捷键触发: ${a}`)}return(a,d)=>(s(),r("div",Wn,[d[1]||(d[1]=e("h2",null,"🌰 全局快捷键",-1)),d[2]||(d[2]=e("p",{class:"desc"},"注册全局快捷键（即使应用未聚焦）和菜单快捷键。",-1)),e("div",Mn,[d[0]||(d[0]=e("h3",null,"常用快捷键",-1)),(s(),r(b,null,y(l,o=>e("div",{key:o,class:"shortcut-item"},[e("label",null,[e("input",{type:"checkbox",checked:t.value.includes(o),onChange:c=>i(o)},null,40,An),e("code",null,p(o),1)]),t.value.includes(o)?(s(),r("button",{key:0,class:"trigger-btn",onClick:c=>u(o)}," 模拟触发 ",8,En)):v("",!0)])),64))]),d[3]||(d[3]=e("div",{class:"code-block"},[e("h3",null,"globalShortcut 示例"),e("pre",null,`// 注册全局快捷键
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
])`)],-1)),d[4]||(d[4]=e("div",{class:"tips"},[e("h3",null,"注意事项"),e("ul",null,[e("li",null,"全局快捷键可能与其他应用冲突，注册前应检查"),e("li",null,"macOS 的 Cmd 对应 Windows/Linux 的 Ctrl"),e("li",null,"应用退出时必须调用 unregisterAll() 释放快捷键"),e("li",null,"菜单快捷键通过 accelerator 属性定义，自动注册")])],-1))]))}}),On=I(qn,[["__scopeId","data-v-546047fa"]]),Rn={class:"lesson-figure"},Dn=w({__name:"E09ShortcutsArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n('你给应用做了个"按 Ctrl+Shift+K 唤起窗口"的功能，用 '),e("code",null,"globalShortcut.register"),n(" 注册。上线后有人反馈按了没反应——那个组合被输入法抢先占用了，而 "),e("code",null,"register"),n(" 返回的 "),e("code",null,"false"),n(" 你根本没看；更糟的是，有人退出应用后这个键在别的软件里也失灵了，只能重启电脑。 ")],-1)),l[2]||(l[2]=e("h2",null,"未聚焦唤起需求",-1)),l[3]||(l[3]=e("p",null,[n(" 你希望应用不在前台时也能被一个按键唤起——比如全局截图、快速记一笔。但渲染进程里能监听的只有 "),e("code",null,"keydown"),n("，而它"),e("strong",null,"只在窗口聚焦时收到事件"),n("：用户一切到别的软件，你的按键监听就是死的。 ")],-1)),l[4]||(l[4]=e("p",null,[n(' 想让"未聚焦也响应"就得去系统层注册按键，这里有三笔隐藏成本：'),e("strong",null,"跨平台没有统一的自建接口"),n("，各系统的全局钩子 API 完全不同，自己写等于维护三套；"),e("strong",null,"键位是全局共享资源"),n("，你占了别的应用就用不了，不检测冲突就会静默失败、或者霸占别人的常用键；"),e("strong",null,"注册了就必须释放"),n("，忘了注销，应用退出后那条按键绑定还留在系统里，别的软件按这个键也没反应，用户只能重启。 ")],-1)),l[5]||(l[5]=e("p",null," 所以要问的是：怎样让按键在应用未聚焦时也能触发，并且不抢占、不残留？ ",-1)),l[6]||(l[6]=e("h2",null,"系统级按键注册",-1)),l[7]||(l[7]=e("p",null,[n(" 最直接的写法是在主进程里调 "),e("code",null,"globalShortcut.register('CommandOrControl+Shift+K', callback)"),n("，放在 "),e("code",null,"app.whenReady()"),n(" 之后注册。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它拿到的是系统级的按键监听，应用不在前台也能被触发"),n("。"),e("code",null,"CommandOrControl"),n(" 前缀还能自动跨平台——macOS 上是 ⌘、其他系统是 Ctrl。 ")],-1)),l[9]||(l[9]=e("h2",null,"键位冲突与重复注册",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("不看 "),e("code",null,"register"),n(" 的返回值：键位被别的应用占用时返回 "),e("code",null,"false"),n("，回调根本不触发，而你毫不知情，用户按了没反应只能来投诉。")]),e("li",null,"不检测是否已注册：同一个键位注册两次，第二次静默失败或覆盖，行为变得不确定。"),e("li",null,"退出时不注销：应用关了，系统里的按键绑定还在，别的软件按这个键也没反应，直到重启电脑。"),e("li",null,[n("在渲染进程里注册："),e("code",null,"keydown"),n(' 只在窗口聚焦时触发，切走就失效——想要"全局"却写错了地方。')]),e("li",null,[n("用系统保留键（如 "),e("code",null,"Ctrl+Alt+Delete"),n("）：操作系统自己占用，永远注册不上。")]),e("li",null,"回调里直接操作某个窗口变量：用户切走期间窗口可能已被关闭，回调触发时操作的是已销毁的窗口。")],-1)),l[11]||(l[11]=e("h2",null,"注册校验与退出注销",-1)),l[12]||(l[12]=e("p",null,[n(" 第一步，"),e("strong",null,"注册前检查、注册后校验"),n("。先用 "),e("code",null,"globalShortcut.isRegistered(accel)"),n(" 看这个键是否已被占用，再调 "),e("code",null,"register"),n(' 并用它的布尔返回值确认是否成功；一旦失败，就给用户一个降级提示（换个键、或告知"该键已被占用"），'),e("strong",null,"绝不强行覆盖别人的键位"),n("。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 第二步，确认注册地点。"),e("code",null,"globalShortcut"),n(" 只能在主进程使用；如果键位要由用户界面触发注册，就经 preload + IPC 把键位传给主进程去注册，触发时主进程再决定是直接执行动作、还是把事件回传渲染进程。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 第三步，"),e("strong",null,"退出时务必释放"),n("。在 "),e("code",null,"will-quit"),n(" 里调用 "),e("code",null,"globalShortcut.unregisterAll()"),n("（或逐个 "),e("code",null,"unregister"),n("）。这是硬性要求——不释放，残留的系统级绑定会一直占着那个键。 ")],-1)),l[15]||(l[15]=e("p",null," 第四步，把两种快捷键分清楚，这是本课最容易混的地方： ",-1)),l[16]||(l[16]=e("ol",{class:"lesson-steps"},[e("li",null,[e("strong",null,[n("菜单 "),e("code",null,"accelerator")]),n("：写在 MenuItem 上，由菜单系统自动注册，会显示在菜单里，只在应用聚焦（菜单栏可见）时生效。")]),e("li",null,[e("strong",null,[n("全局快捷键 "),e("code",null,"globalShortcut")]),n("：系统级，应用未聚焦也能触发，不显示在任何界面上，需要你自己管生命周期（注册、检查、注销）。")]),e("li",null,[n("同一个功能不要两处都绑：既写 "),e("code",null,"accelerator"),n(" 又用 "),e("code",null,"globalShortcut"),n(" 注册同一个键，会互相冲突。")])],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补可配置与健壮性。把用户的键位存进配置，启动时统一注册；改键时"),e("strong",null,"先注销旧绑定、再注册新绑定"),n("；回调里操作窗口前先确认它仍然存在（必要时重建），不要假设用户切走的这段时间里窗口一直可用。 ")],-1)),l[18]||(l[18]=e("div",{class:"lesson-box warn"},[e("strong",null,"别混淆这两者："),e("code",null,"accelerator"),n(' 只在应用聚焦时生效，需要"未聚焦也响应"就必须用 '),e("code",null,"globalShortcut"),n("；而全局快捷键是系统级资源，注册失败时应给出降级提示，而不是强行抢占。 ")],-1)),l[19]||(l[19]=e("h2",null,"快捷键勾选触发",-1)),e("figure",Rn,[l[0]||(l[0]=e("figcaption",null,[n("勾选几个常用快捷键，再点「模拟触发」看它像主进程回调那样被唤起；取消勾选就相当于注销——正好对应 "),e("code",null,"register"),n(" 与 "),e("code",null,"unregister"),n(" 这一对动作。")],-1)),C(On)]),l[20]||(l[20]=e("h2",null,"全局注册归属边界",-1)),l[21]||(l[21]=e("p",null,[n(" 要让按键在应用未聚焦时也生效，就得用主进程的 "),e("code",null,"globalShortcut"),n("：注册前用 "),e("code",null,"isRegistered"),n(" 查冲突、用返回值确认成败，退出时在 "),e("code",null,"will-quit"),n(" 里 "),e("code",null,"unregisterAll"),n(" 释放。它和菜单上的 "),e("code",null,"accelerator"),n(" 是两回事——前者是系统级资源、要自己管生命周期，后者交给菜单系统、只在聚焦时生效。 ")],-1)),l[22]||(l[22]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「accelerator（加速度键）」"),n("是写在 MenuItem 上、用来声明快捷键的字符串，如 "),e("code",null,"CmdOrCtrl+Shift+K"),n("；用 "),e("code",null,"CmdOrCtrl"),n(" 前缀即可跨平台，菜单系统会自动注册并把它显示在菜单项右侧。它的边界是"),e("strong",null,"只在应用聚焦时生效、也不等于全局快捷键"),n("；若要应用未聚焦也响应，必须另用 "),e("code",null,"globalShortcut"),n(" 注册，且不要让两者绑定同一个键位。 ")],-1))]),_:1})}}}),jn={class:"demo-container"},Bn={class:"status-panel"},Tn={class:"event-log"},Un={key:0,class:"hint"},Nn=w({__name:"E10AutoUpdate",setup(g){const t=f("idle"),l=f([]);function i(){l.value=[],t.value="checking",l.value.push("checking-for-update"),setTimeout(()=>{t.value="available",l.value.push("update-available: v2.0.0")},1e3),setTimeout(()=>{t.value="downloading",l.value.push("download-progress: 45%")},2e3),setTimeout(()=>{t.value="downloaded",l.value.push("update-downloaded"),l.value.push("提示用户重启应用完成更新")},3500)}return(u,a)=>(s(),r("div",jn,[a[1]||(a[1]=e("h2",null,"🌰 自动更新",-1)),a[2]||(a[2]=e("p",{class:"desc"},"使用 autoUpdater 实现应用自动更新，掌握更新事件处理。",-1)),e("button",{class:"btn",onClick:i},"检查更新"),e("div",Bn,[e("div",{class:S(["status",t.value])}," 状态: "+p(t.value),3)]),e("div",Tn,[a[0]||(a[0]=e("h3",null,"更新事件",-1)),(s(!0),r(b,null,y(l.value,(d,o)=>(s(),r("div",{key:o,class:"event"},p(d),1))),128)),l.value.length===0?(s(),r("p",Un,'点击"检查更新"查看更新流程')):v("",!0)]),a[3]||(a[3]=M(`<div class="code-block" data-v-3965d59a><h3 data-v-3965d59a>autoUpdater 事件</h3><pre data-v-3965d59a>// 主进程
const { autoUpdater } = require(&#39;electron-updater&#39;)

autoUpdater.setFeedURL(&#39;https://update.example.com&#39;)

autoUpdater.on(&#39;checking-for-update&#39;, () =&gt; {
  console.log(&#39;正在检查更新...&#39;)
})

autoUpdater.on(&#39;update-available&#39;, (info) =&gt; {
  console.log(&#39;发现新版本:&#39;, info.version)
})

autoUpdater.on(&#39;download-progress&#39;, (progress) =&gt; {
  console.log(&#39;下载进度:&#39;, progress.percent)
})

autoUpdater.on(&#39;update-downloaded&#39;, () =&gt; {
  // 提示用户重启
  dialog.showMessageBox({
    type: &#39;info&#39;,
    title: &#39;更新就绪&#39;,
    message: &#39;新版本已下载，重启后生效&#39;,
    buttons: [&#39;重启&#39;, &#39;稍后&#39;]
  }).then(result =&gt; {
    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})</pre></div><div class="tips" data-v-3965d59a><h3 data-v-3965d59a>更新服务器配置</h3><ul data-v-3965d59a><li data-v-3965d59a><strong data-v-3965d59a>macOS</strong>: 需要代码签名和公证</li><li data-v-3965d59a><strong data-v-3965d59a>Windows</strong>: 需要 Authenticode 签名</li><li data-v-3965d59a><strong data-v-3965d59a>Linux</strong>: 使用 AppImage 或 deb/rpm</li><li data-v-3965d59a><strong data-v-3965d59a>推荐</strong>: 使用 electron-builder 的 electron-updater</li></ul></div>`,2))]))}}),Ln=I(Nn,[["__scopeId","data-v-3965d59a"]]),$n={class:"lesson-figure"},Fn=w({__name:"E10AutoUpdateArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n('你给应用接好了自动更新，测试时一路顺利：发现新版本、下载、提示重启。可正式版发给用户后，macOS 用户点了"重启安装"，应用反而起不来了，系统提示"应用已损坏"。你在本机怎么都复现不出来——因为问题根本不在你那几行代码里。 ')],-1)),l[2]||(l[2]=e("h2",null,"上线后更新诉求",-1)),l[3]||(l[3]=e("p",null,[n(' 桌面应用一旦发出去，你就再也没法像网页那样"改一下就刷新"。想让用户拿到修复和新功能，只能靠更新。而让用户'),e("strong",null,"手动"),n("去官网下载新安装包重装，几乎等于没有更新——安全补丁发出去也没人装，旧版本会一直留在用户机器上。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 自己想办法推更新又会踩三笔成本："),e("strong",null,"直接覆盖正在运行的程序文件"),n("在 Windows 上会被占用锁死，覆盖到一半断电就成了半损坏的安装；"),e("strong",null,"更新源不可信就无法验证来源"),n("，一旦服务器被劫持，你等于把任意代码安静地装进了用户机器，这是最严重的一条；"),e("strong",null,"升级时机不受控"),n("，下载完就强制重启会打断用户正在做的事。 ")],-1)),l[5]||(l[5]=e("p",null," 所以要问的是：怎样让应用自己发现新版本、安全地下载、验证来源、并在合适的时机完成升级？ ",-1)),l[6]||(l[6]=e("h2",null,"更新组件接入方式",-1)),l[7]||(l[7]=e("p",null,[n(" 生产环境推荐用 electron-builder 配套的 "),e("strong",null,"electron-updater"),n("：主进程里用 "),e("code",null,"autoUpdater.setFeedURL(...)"),n(" 指向发布服务，再调 "),e("code",null,"checkForUpdatesAndNotify()"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它把更新拆成了一条由事件驱动的流水线"),n("。应用会自己去发布服务读取 "),e("code",null,"latest.yml"),n(" 元数据、比对版本号、按需下载差量包——你不用像用 Electron 内置 "),e("code",null,"autoUpdater"),n(" 那样自建一套更新服务器。整条流程发生在主进程，渲染进程只负责展示进度、接收状态。 ")],-1)),l[9]||(l[9]=e("h2",null,"签名公证与生效条件",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("在开发环境里调用：应用没打包时 "),e("code",null,"autoUpdater"),n(" 直接报错，本地根本走不通，容易误判成代码有问题。")]),e("li",null,'macOS 更新包没签名、没公证：下载完在安装阶段被系统拒绝，用户看到的就是那句"应用已损坏"。'),e("li",null,"Windows 更新包没做 Authenticode 签名：既会被 SmartScreen 拦截，也无法检出被篡改的包。"),e("li",null,"不处理下载进度：一个几十上百 MB 的包在后台静默下载，用户以为程序卡死了，只能强行结束进程。"),e("li",null,"下载完立刻重启：用户正在编辑的内容被强制中断，这是最招骂的做法。"),e("li",null,[n("不监听 "),e("code",null,"error"),n("：网络断了、服务器返回 404，整条流程静默死掉，既不重试也不提示。")])],-1)),l[11]||(l[11]=e("h2",null,"生效范围与事件链路",-1)),l[12]||(l[12]=e("p",null,[n(" 第一步，"),e("strong",null,"先限定生效范围"),n("。用 "),e("code",null,"app.isPackaged"),n(" 判断，只有打包后的安装版才启用自动更新，开发环境直接跳过。这样既避免了报错，也让你明白：自动更新本来就不是给开发环境用的。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 第二步，确定更新源。"),e("code",null,"setFeedURL"),n("（或在 electron-builder 的 "),e("code",null,"publish"),n(" 配置里）指向发布服务，服务端提供 "),e("code",null,"latest.yml"),n('——里面有版本号、安装包哈希和增量更新的 blockmap。这就是"更新从哪里来、怎么判断有没有新版"的依据。 ')],-1)),l[14]||(l[14]=e("p",null," 第三步，把事件流水线按顺序串起来，这是本课的主干： ",-1)),l[15]||(l[15]=e("ol",{class:"lesson-steps"},[e("li",null,[e("code",null,"checking-for-update"),n("：开始检查。")]),e("li",null,[e("code",null,"update-available"),n("：发现新版本，"),e("code",null,"info.version"),n(" 给出目标版本；若无更新则走 "),e("code",null,"update-not-available"),n("。")]),e("li",null,[e("code",null,"download-progress"),n("：下载中，"),e("code",null,"progress.percent"),n(" 与 "),e("code",null,"bytesPerSecond"),n(" 可以回传渲染进程做进度条。")]),e("li",null,[e("code",null,"update-downloaded"),n("：下载完成，此时才提示用户。")]),e("li",null,[n("用户确认后调用 "),e("code",null,"autoUpdater.quitAndInstall()"),n("，退出并安装。")])],-1)),l[16]||(l[16]=e("p",null,[n(' 第四步，补上安全校验——这是自动更新能不能"装了不害怕"的前提。更新包必须签名：'),e("strong",null,"macOS 要做代码签名并 notarization（公证），Windows 要做 Authenticode 签名"),n("。electron-updater 会结合签名与 "),e("code",null,"latest.yml"),n(' 中记录的哈希来判断包是否可信，拒绝不符的更新。回看开场那个"应用已损坏"，根子就在这里——不是你的逻辑错，而是包没通过系统的签名校验。 ')],-1)),l[17]||(l[17]=e("p",null,[n(" 最后补用户体验与失败处理。"),e("code",null,"update-downloaded"),n(" 之后不要直接重启，弹一个 "),e("code",null,"dialog"),n(' 让用户选"立即重启"还是"稍后"（'),e("code",null,"response === 0"),n(" 才调 "),e("code",null,"quitAndInstall"),n("）；监听 "),e("code",null,"error"),n(" 把失败信息回传并允许重试；下载期间用进度事件给用户可见的反馈。 ")],-1)),l[18]||(l[18]=e("p",null,[n(" 发布侧的"),e("strong",null,"灰度与回滚"),n("也在这一步落地：灰度是不要一次把新版本推给所有人，而是先推给一小部分渠道或比例，观察崩溃率与反馈稳定后再逐步放量；回滚则是保留上一版本的安装包与版本元数据，一旦新版本出错率升高，就停止放量、把更新源切回旧版本，让用户能退回。这两件事由发布服务控制，应用端只负责按事件流水线去检查、下载、安装。 ")],-1)),l[19]||(l[19]=e("div",{class:"lesson-box warn"},[e("strong",null,"两个前提条件："),n("自动更新只在打包后的安装版中生效，开发环境调用会直接报错，接入前先用 "),e("code",null,"app.isPackaged"),n(" 判断；另外，macOS 未签名、未公证的包，Windows 未做 Authenticode 签名的包，都会在安装阶段被系统拒绝——签名不是可选项。 ")],-1)),l[20]||(l[20]=e("h2",null,"事件日志推进顺序",-1)),e("figure",$n,[l[0]||(l[0]=e("figcaption",null,[n("点「检查更新」，看事件日志按 "),e("code",null,"checking-for-update"),n(" → "),e("code",null,"update-available"),n(" → "),e("code",null,"download-progress"),n(" → "),e("code",null,"update-downloaded"),n(" 依次追加，状态色块同步变化——这正是主进程里那条更新流水线。")],-1)),C(Ln)]),l[21]||(l[21]=e("h2",null,"主进程事件流水线",-1)),l[22]||(l[22]=e("p",null,[n(" 自动更新是一条住在主进程里的事件流水线：用 "),e("code",null,"setFeedURL"),n("（或 electron-builder 的 "),e("code",null,"publish"),n("）定好更新源，按 "),e("code",null,"checking-for-update"),n(" → "),e("code",null,"update-available"),n(" → "),e("code",null,"download-progress"),n(" → "),e("code",null,"update-downloaded"),n(" 依次推进，最后由用户确认触发 "),e("code",null,"quitAndInstall"),n("。而它真正的地基是签名与 "),e("code",null,"latest.yml"),n(" 校验——没有签名，更新根本装不上，装了也不敢用。 ")],-1)),l[23]||(l[23]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「灰度发布（渐进式发布）」"),n("指不把新版本一次性推给全部用户，而是先推给一小部分（按比例、渠道或人群），观察稳定后再逐步扩大范围的发布策略。它的边界是"),e("strong",null,"必须与回滚配套"),n("：要保留上一版本的安装包与版本元数据，一旦新版本出错率升高就停止放量、把更新源切回旧版本；而且灰度是发布侧（更新源给哪些版本）的控制手段，应用端只负责按事件流水线检查、下载、安装。 ")],-1))]),_:1})}}}),zn={class:"demo-container"},Vn={class:"platform-selector"},Hn={class:"config-panel"},Jn={class:"code-block"},Kn=w({__name:"E11Packaging",setup(g){const t=f("win"),l=f({appId:"com.example.app",productName:"My Electron App",directories:{output:"dist"}});return(i,u)=>(s(),r("div",zn,[u[7]||(u[7]=e("h2",null,"🌰 打包与分发",-1)),u[8]||(u[8]=e("p",{class:"desc"},"使用 electron-builder 打包跨平台应用。",-1)),e("div",Vn,[e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":u[0]||(u[0]=a=>t.value=a),value:"mac"},null,512),[[A,t.value]]),u[3]||(u[3]=n(" macOS",-1))]),e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":u[1]||(u[1]=a=>t.value=a),value:"win"},null,512),[[A,t.value]]),u[4]||(u[4]=n(" Windows",-1))]),e("label",null,[h(e("input",{type:"radio","onUpdate:modelValue":u[2]||(u[2]=a=>t.value=a),value:"linux"},null,512),[[A,t.value]]),u[5]||(u[5]=n(" Linux",-1))])]),e("div",Hn,[u[6]||(u[6]=e("h3",null,"electron-builder 配置",-1)),e("pre",Jn,`{
  "appId": "`+p(l.value.appId)+`",
  "productName": "`+p(l.value.productName)+`",
  "directories": {
    "output": "`+p(l.value.directories.output)+`"
  },
  "mac": {
    "category": "public.app-category.productivity",
    "icon": "build/icon.icns",
    "hardenedRuntime": true,
    "gatekeeperAssess": false
  },
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico",
    "publisherName": "Example Inc."
  },
  "linux": {
    "target": ["AppImage", "deb", "rpm"],
    "category": "Utility"
  }
}`,1)]),u[9]||(u[9]=M(`<div class="tips" data-v-219f1cc4><h3 data-v-219f1cc4>打包要点</h3><ul data-v-219f1cc4><li data-v-219f1cc4><strong data-v-219f1cc4>macOS</strong>: 需要在 macOS 机器上打包，需要开发者证书和公证</li><li data-v-219f1cc4><strong data-v-219f1cc4>Windows</strong>: 需要代码签名证书（Authenticode），推荐使用 NSIS 安装包</li><li data-v-219f1cc4><strong data-v-219f1cc4>Linux</strong>: 推荐同时提供 AppImage、deb、rpm 三种格式</li><li data-v-219f1cc4><strong data-v-219f1cc4>CI/CD</strong>: 使用 GitHub Actions 或 Jenkins 自动化打包流程</li></ul></div><div class="code-block" data-v-219f1cc4><h3 data-v-219f1cc4>package.json 配置</h3><pre data-v-219f1cc4>{
  &quot;scripts&quot;: {
    &quot;pack&quot;: &quot;electron-builder --dir&quot;,
    &quot;dist&quot;: &quot;electron-builder&quot;,
    &quot;dist:mac&quot;: &quot;electron-builder --mac&quot;,
    &quot;dist:win&quot;: &quot;electron-builder --win&quot;,
    &quot;dist:linux&quot;: &quot;electron-builder --linux&quot;
  },
  &quot;build&quot;: {
    &quot;extends&quot;: null,
    // 上面配置...
  }
}</pre></div>`,2))]))}}),Gn=I(Kn,[["__scopeId","data-v-219f1cc4"]]),Qn={class:"lesson-figure"},Xn=w({__name:"E11PackagingArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你在本机 "),e("code",null,"electron ."),n(" 跑得好好的应用，打包发给同事，他双击安装包——Windows 上弹出「未知发布者」，macOS 上直接说「应用已损坏，打不开」。你在 Windows 机器上敲 "),e("code",null,"electron-builder --mac"),n("，它还当场报错退出。 ")],-1)),l[2]||(l[2]=e("h2",null,"交付形态落差",-1)),l[3]||(l[3]=e("p",null,[n(" 开发态的运行方式（直接加载源码目录）和用户拿到的产物之间，隔着一条你平时看不见的鸿沟。用户不会 "),e("code",null,"git clone"),n(" 再 "),e("code",null,"npm install"),n("，他要的是「双击就能装、装完能用、能卸载」的东西。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 如果直接把源码交出去，问题立刻来：源码里带着完整的 "),e("code",null,"node_modules"),n("，动辄几百 MB，还把你没打算公开的实现原样交出去；没有图标、没有版本号、没有系统识别用的应用标识，双击后图标还是默认的 Electron 图标，窗口名字还是开发目录名；更麻烦的是每个系统的「安装」形态根本不一样——macOS 认 "),e("code",null,"dmg"),n(" 与 "),e("code",null,"app"),n("，Windows 认 "),e("code",null,"nsis"),n(" 安装程序，Linux 认 "),e("code",null,"AppImage"),n(" / "),e("code",null,"deb"),n(" / "),e("code",null,"rpm"),n("，同一份源码你得手工拼三套。 ")],-1)),l[5]||(l[5]=e("p",null," 于是问题落到：怎样把开发态的项目，变成各平台「可安装、可分发的产物」，而且最好只写一份配置？ ",-1)),l[6]||(l[6]=e("h2",null,"构建配置与声明",-1)),l[7]||(l[7]=e("p",null,[n(" 先给一个真的能跑的办法：装 "),e("code",null,"electron-builder"),n("，在 "),e("code",null,"package.json"),n(" 里加一个 "),e("code",null,"build"),n(" 字段声明 "),e("code",null,"appId"),n("、"),e("code",null,"productName"),n(" 与 "),e("code",null,"mac"),n(" / "),e("code",null,"win"),n(" / "),e("code",null,"linux"),n(" 各自的 "),e("code",null,"target"),n("，然后跑一条 "),e("code",null,"electron-builder"),n(" 命令。它会自动收集应用代码、生成对应平台的安装包，送进 "),e("code",null,"directories.output"),n(" 指定的目录。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"把「平台差异」从一堆手工命令收敛成一份声明式配置"),n("。三个平台字段各管自己要出什么产物、用哪个图标，底层那些格式与打包细节由工具替你处理。 ")],-1)),l[9]||(l[9]=e("h2",null,"体积与签名门槛",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("打包默认会把整个 "),e("code",null,"node_modules"),n(" 收进去，体积远超实际需要；源码原样躺进产物目录，也等于把实现全暴露。")]),e("li",null,"产物散落成成千上万个小文件，安装和启动时逐个读盘，首启明显变慢。"),e("li",null,"macOS 包没签名、没公证：Gatekeeper 直接拦下，用户看到的就是那句「应用已损坏」。"),e("li",null,"Windows 包没做 Authenticode 签名：SmartScreen 提示「未知发布者」，装完还可能被安全软件误杀。"),e("li",null,[n("想跨平台一把梭："),e("code",null,"electron-builder --mac"),n(" 在 Windows 上会失败，macOS 产物必须在 macOS（或跑在 macOS 的 CI）上构建。")]),e("li",null,[n("版本号、"),e("code",null,"productName"),n("、"),e("code",null,"appId"),n(" 打包前没定稳：后续升级靠版本号判定、系统靠 "),e("code",null,"appId"),n(" 识别，改一次就要付迁移成本。")])],-1)),l[11]||(l[11]=e("h2",null,"源码归档与产物结构",-1)),l[12]||(l[12]=e("p",null,[n(" 先从「产物形态」补起，因为它决定后面所有平台配置的底色。默认情况下，应用源码会被打进一个叫 "),e("strong",null,"asar"),n(" 的归档（"),e("code",null,"resources/app.asar"),n("），上万个小文件合并成一个——源码不再裸露、读盘的小 IO 也少了。但 asar 里的文件是只读的，外部进程拿不到真实路径去执行，随包携带的原生二进制（比如 ffmpeg）这类东西要单独放出来：用 "),e("code",null,"extraResources"),n(" 复制到 resources 目录下、或用 "),e("code",null,"asarUnpack"),n(" 从归档里解出。先记住这条边界："),e("strong",null,"能待在 asar 里的就待着，需要被原生程序按真实路径访问的才解出来"),n("。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 接着按平台声明 "),e("code",null,"target"),n("，这是「一份配置出三种产物」的核心：macOS 出 "),e("code",null,"dmg"),n(" 与 "),e("code",null,"zip"),n("；Windows 出 "),e("code",null,"nsis"),n(" 安装程序，也可以再给一个便携的 "),e("code",null,"portable"),n(" exe；Linux 同时给 "),e("code",null,"AppImage"),n("、"),e("code",null,"deb"),n("、"),e("code",null,"rpm"),n("，兼顾免安装与发行版安装。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 再补签名与公证，它决定了「装了敢不敢用」。macOS 要在打包机（一定是 macOS）上配置 Developer ID 证书、打开 "),e("code",null,"hardenedRuntime"),n("，并做 "),e("code",null,"notarization"),n(" 公证；Windows 要配置 Authenticode 证书。回头看开场那句「应用已损坏」——产物本身没坏，是系统不敢认它。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 最后补流程。在 "),e("code",null,"scripts"),n(" 里定义 "),e("code",null,"pack"),n("（配 "),e("code",null,"--dir"),n("，只出免安装目录，便于本地快速走查）和一组 "),e("code",null,"dist:mac"),n(" / "),e("code",null,"dist:win"),n(" / "),e("code",null,"dist:linux"),n("；真正的跨平台构建交给 CI，用 GitHub Actions 起三台不同系统的机器分别打包。产物拿到手后本地完整走一遍："),e("strong",null,"安装 → 启动 → 升级覆盖 → 卸载"),n("，确认图标、菜单、文件关联都对。 ")],-1)),l[16]||(l[16]=e("h2",null,"三平台产物配置对照",-1)),e("figure",Qn,[l[0]||(l[0]=e("figcaption",null,"切换 macOS / Windows / Linux 三个平台，对照上方 electron-builder 的 build 配置与「打包要点」，看每个平台各自需要什么 target、什么图标、什么签名准备。",-1)),C(Gn)]),l[17]||(l[17]=e("h2",null,"分发产物构成",-1)),l[18]||(l[18]=e("p",null,[n(" 打包分发要回答的其实是「用户拿到的到底是什么」。用一份 electron-builder 配置声明各平台产物，把源码收进 asar、把需要原生访问的文件用 "),e("code",null,"extraResources"),n(" 放出来，再用签名与公证让系统愿意认——这条链走完，开发态才算真正变成可分发的应用。 ")],-1)),l[19]||(l[19]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「asar」"),n("是 Electron 的归档格式，把应用源码合并成单个文件打包进 "),e("code",null,"resources"),n(" 目录，避免源码直接暴露、减少小文件读盘开销。边界：asar 内文件"),e("strong",null,"只读"),n("，需要被外部进程按真实路径访问的文件（原生二进制等）要用 "),e("code",null,"extraResources"),n(" 或 "),e("code",null,"asarUnpack"),n(" 解出来；而且 asar "),e("strong",null,"不等于加密"),n("，防篡改要靠代码签名。 ")],-1))]),_:1})}}}),Yn={class:"demo-container"},Zn={class:"security-check"},_n={class:"icon"},el={class:"check-info"},nl=w({__name:"E12Security",setup(g){const t=f([{name:"nodeIntegration: false",passed:!0,desc:"渲染进程不能直接使用 Node.js API"},{name:"contextIsolation: true",passed:!0,desc:"预加载脚本与渲染进程上下文隔离"},{name:"webSecurity: true",passed:!0,desc:"不允许跨域请求和禁用安全特性"},{name:"CSP 已配置",passed:!1,desc:"Content-Security-Policy 限制资源加载"},{name:"依赖无已知漏洞",passed:!1,desc:"定期运行 npm audit"},{name:"不允许加载远程代码",passed:!0,desc:"避免从远程 URL 加载脚本"}]);return(l,i)=>(s(),r("div",Yn,[i[1]||(i[1]=e("h2",null,"🌰 安全最佳实践",-1)),i[2]||(i[2]=e("p",{class:"desc"},"Electron 安全核心原则：最小权限、上下文隔离、内容安全策略。",-1)),e("div",Zn,[i[0]||(i[0]=e("h3",null,"安全检查清单",-1)),(s(!0),r(b,null,y(t.value,u=>(s(),r("div",{key:u.name,class:S(["check-item",{passed:u.passed,failed:!u.passed}])},[e("span",_n,p(u.passed?"✅":"❌"),1),e("div",el,[e("strong",null,p(u.name),1),e("p",null,p(u.desc),1)])],2))),128))]),i[3]||(i[3]=M(`<div class="code-block" data-v-2bef83c6><h3 data-v-2bef83c6>安全配置示例</h3><pre data-v-2bef83c6>// 主进程 - 正确的 BrowserWindow 配置
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,      // ✅ 必须关闭
    contextIsolation: true,       // ✅ 必须开启
    webSecurity: true,            // ✅ 必须开启
    preload: path.join(__dirname, &#39;preload.js&#39;)
  }
})

// HTML - CSP 配置（必须放在 &lt;head&gt; 最顶部）
&lt;meta http-equiv=&quot;Content-Security-Policy&quot;
      content=&quot;default-src &#39;self&#39;;
               script-src &#39;self&#39;;
               style-src &#39;self&#39; &#39;unsafe-inline&#39;;
               img-src &#39;self&#39; data:;&quot;&gt;</pre></div><div class="tips" data-v-2bef83c6><h3 data-v-2bef83c6>安全原则</h3><ul data-v-2bef83c6><li data-v-2bef83c6><strong data-v-2bef83c6>最小权限</strong>: 只给渲染进程需要的 API</li><li data-v-2bef83c6><strong data-v-2bef83c6>上下文隔离</strong>: 防止渲染进程访问 Node.js</li><li data-v-2bef83c6><strong data-v-2bef83c6>CSP</strong>: 防止 XSS 攻击升级为 RCE</li><li data-v-2bef83c6><strong data-v-2bef83c6>依赖审计</strong>: 定期检查依赖漏洞</li><li data-v-2bef83c6><strong data-v-2bef83c6>代码签名</strong>: 确保应用完整性</li></ul></div>`,2))]))}}),ll=I(nl,[["__scopeId","data-v-2bef83c6"]]),ol={class:"lesson-figure"},tl=w({__name:"E12SecurityArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你做了个笔记应用，正文是富文本编辑器。测试时同事粘进来一段从网页复制的 HTML，里面藏了一个看不见的 "),e("code",null,`<img src=x onerror="require('child_process').exec('calc')">`),n("。保存、刷新——你本机的计算器弹了出来。一个网页里的 XSS，凭什么能在你的应用里执行系统命令？ ")],-1)),l[2]||(l[2]=e("h2",null,"脚本注入风险升级",-1)),l[3]||(l[3]=e("p",null,[n(" Electron 的渲染进程本质就是一个 Chromium 窗口，里面跑着你的页面和用户的输入。只要这里有 XSS，就等于有人在你的应用里执行任意脚本。真正决定后果的是另一件事："),e("strong",null,"这段脚本手里有多少权限"),n("。如果渲染进程还带着 Node 能力，那它就能直接 "),e("code",null,"require('child_process')"),n(" 执行系统命令——XSS 升级成了 RCE（远程代码执行），而主进程是唯一还能信任的边界。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 旧办法的毛病都出在「默认太宽松」：渲染进程默认能碰 Node，"),e("code",null,"require"),n(" 随手可用，一个注入点就直通系统；"),e("code",null,"preload"),n(" 脚本和页面共享同一个全局上下文，页面能篡改 preload 暴露出来的对象；没有 CSP，内联脚本、远程脚本想加载就加载；页面里的新窗口和跳转没人管，一点就可能把窗口带到任意站点上。 ")],-1)),l[5]||(l[5]=e("p",null," 所以问题变成：怎样把渲染进程的能力收得只剩「渲染」，同时把注入与导航都挡在边界之外？ ",-1)),l[6]||(l[6]=e("h2",null,"渲染进程能力关闭",-1)),l[7]||(l[7]=e("p",null,[n(" 最直接的一步：创建窗口时改 "),e("code",null,"webPreferences"),n("——"),e("code",null,"nodeIntegration: false"),n("、"),e("code",null,"contextIsolation: true"),n("、"),e("code",null,"webSecurity: true"),n("，需要的能力只通过 "),e("code",null,"preload"),n(" 加 "),e("code",null,"contextBridge"),n(" 显式暴露。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它把「渲染进程能不能碰 Node」从默认开放改成了默认关闭"),n("，你要什么再明确开口。渲染进程从此只是一个网页，页面里跑再怪的脚本也拿不到 "),e("code",null,"require"),n("。 ")],-1)),l[9]||(l[9]=e("h2",null,"隔离失效与防护漏洞",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("只关 "),e("code",null,"nodeIntegration"),n(" 不够："),e("code",null,"contextIsolation"),n(" 若为 "),e("code",null,"false"),n("，页面和 preload 在同一上下文里，页面可以污染 "),e("code",null,"Object.prototype"),n(" 之类的原型，让你写在校验里的判断悄悄失效。")]),e("li",null,[n("没有 CSP：隔离做得再好，页面里照样能内联执行 "),e("code",null,"<script>"),n("、从远程拉脚本，XSS 本身还在。")]),e("li",null,[n("不拦新窗口与导航：页面里一个 "),e("code",null,'<a target="_blank">'),n(" 或一次 "),e("code",null,"location"),n(" 跳转，就能把窗口带到任意站点，钓鱼页可以做得和你的应用一模一样。")]),e("li",null,[n("为本地调试把 "),e("code",null,"webSecurity"),n(" 关掉：跨域与 "),e("code",null,"file://"),n(" 读取全部放开，等于把刚锁上的门又开了。")]),e("li",null,[e("code",null,"shell.openExternal"),n(" 直接吃用户给的 URL：一旦有人传 "),e("code",null,"file://"),n(" 或自定义协议进来，就可能触发本机命令执行。")]),e("li",null,"依赖不体检：某个包爆出已知漏洞你不会知道，攻击面在悄悄扩大。")],-1)),l[11]||(l[11]=e("h2",null,"最小权限与内容安全",-1)),l[12]||(l[12]=e("p",null,[n(" 第一步先把「最小权限」落进 "),e("code",null,"webPreferences"),n("："),e("code",null,"nodeIntegration: false"),n("、"),e("code",null,"contextIsolation: true"),n("、"),e("code",null,"webSecurity: true"),n("，"),e("code",null,"sandbox"),n(" 保持默认开启。这是地基，后面所有措施都建立在「渲染进程没有额外权限」之上。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 第二步把能力搬进 preload 里显式暴露。有了上下文隔离，preload 与页面跑在不同的 V8 世界里，"),e("code",null,"contextBridge.exposeInMainWorld('api', { ... })"),n(" 是唯一的桥；桥这边只暴露一个个具体方法，"),e("strong",null,"不要把 ipcRenderer 整个对象挂上去"),n("——那等于把钥匙串整串交出去。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 第三步补 CSP，它是「就算脚本被注入也让它施展不开」的兜底。在 "),e("code",null,"<head>"),n(" 最顶部写一条 meta，把 "),e("code",null,"default-src 'self'"),n("、"),e("code",null,"script-src 'self'"),n(" 收紧，"),e("strong",null,[n("禁止 "),e("code",null,"unsafe-inline"),n(" 与 "),e("code",null,"unsafe-eval")]),n("（样式上留一个可控的 "),e("code",null,"'unsafe-inline'"),n(" 一般可以接受）。这样内联脚本和 "),e("code",null,"eval"),n(" 直接失效，注入的执行链被掐断。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 第四步把「导航」也拦起来。用 "),e("code",null,"webContents.setWindowOpenHandler(() => ({ action: 'deny' }))"),n(" 拒绝页面自作主张开新窗口；确实要开外链，就显式改走 "),e("code",null,"shell.openExternal"),n("，"),e("strong",null,"并且对协议和域名做白名单校验"),n("，只放行 "),e("code",null,"https:"),n("。再用 "),e("code",null,"will-navigate"),n(" 拦下窗口自身的跳转，凡是跳去非本应用源的地址一律阻止——这一步防的是「把用户带到伪造页面上」。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 第五步补运维习惯：只加载可信内容、不加载远程脚本，定期跑 "),e("code",null,"npm audit"),n(" / "),e("code",null,"npm outdated"),n(" 做依赖体检。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 最后一条最容易被漏掉："),e("strong",null,"渲染进程要当成「随时可能被攻破」来对待"),n("，所以主进程是信任边界——所有经 IPC 传进主进程的参数都要校验，不能因为「这是我自己页面发的」就照单全收。 ")],-1)),l[18]||(l[18]=e("h2",null,"安全清单逐项核对",-1)),e("figure",ol,[l[0]||(l[0]=e("figcaption",null,[n("逐条对照安全检查清单（绿勾=已达标、红叉=待修），再读下方代码示例中 BrowserWindow 与 CSP 的正确写法，确认 "),e("code",null,"nodeIntegration"),n(" / "),e("code",null,"contextIsolation"),n(" / "),e("code",null,"webSecurity"),n(" 与 CSP 各自该设成什么。")],-1)),C(ll)]),l[19]||(l[19]=e("h2",null,"信任边界与权限收敛",-1)),l[20]||(l[20]=e("p",null," 安全加固的核心，是把渲染进程的权限压到最小：默认关掉 Node、开启上下文隔离、用 preload 白名单暴露能力，再用 CSP、导航拦截与依赖审计把注入的后果封死在渲染进程里。记住主进程是信任边界，渲染进程送来的一切都要当成不可信。 ",-1)),l[21]||(l[21]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「上下文隔离（contextIsolation）」"),n("把 preload 脚本与页面 JS 跑在"),e("strong",null,"两个独立的 V8 上下文"),n("里，两者不能直接改对方的全局对象，唯一的通道是 "),e("code",null,"contextBridge"),n("。它自 Electron 12 起默认开启；一旦关成 "),e("code",null,"false"),n("，页面就和 preload 共享上下文，可以污染原型链绕过你的校验。开启后 preload 里不能再直接往 "),e("code",null,"window"),n(" 挂属性，必须走 "),e("code",null,"contextBridge.exposeInMainWorld"),n("。 ")],-1))]),_:1})}}}),sl={class:"demo-container"},il={class:"tips-grid"},rl=w({__name:"E13Performance",setup(g){const t=f([{title:"启动优化",items:["延迟加载非关键模块","使用骨架屏","避免在主进程中执行同步 I/O"]},{title:"内存优化",items:["限制渲染进程数量","及时释放引用","使用 Web Workers 处理计算"]},{title:"渲染优化",items:["虚拟滚动长列表","节流防抖事件","使用 CSS 硬件加速"]}]);return(l,i)=>(s(),r("div",sl,[i[0]||(i[0]=e("h2",null,"🌰 性能优化",-1)),i[1]||(i[1]=e("p",{class:"desc"},"优化 Electron 应用启动速度、内存占用和渲染性能。",-1)),e("div",il,[(s(!0),r(b,null,y(t.value,u=>(s(),r("div",{key:u.title,class:"tip-card"},[e("h3",null,p(u.title),1),e("ul",null,[(s(!0),r(b,null,y(u.items,a=>(s(),r("li",{key:a},p(a),1))),128))])]))),128))]),i[2]||(i[2]=e("div",{class:"code-block"},[e("h3",null,"启动优化示例"),e("pre",null,`// 延迟加载
app.whenReady().then(() => {
  createWindow()
  // 延迟加载耗时模块
  setTimeout(() => {
    require('heavy-module')
  }, 3000)
})

// 监控内存
setInterval(() => {
  const mem = process.memoryUsage()
  console.log('RSS:', Math.round(mem.rss / 1024 / 1024), 'MB')
}, 30000)`)],-1))]))}}),al=I(rl,[["__scopeId","data-v-7bccc96e"]]),dl={class:"lesson-figure"},ul=w({__name:"E13PerformanceArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("应用冷启动要八秒，白屏一直挂在那儿。你在创建窗口前后打了时间戳，发现"),e("code",null,"new BrowserWindow"),n(" 本身只花了不到两百毫秒——那多出来的七秒多，凭什么也算在「启动」头上？ ")],-1)),l[2]||(l[2]=e("h2",null,"启动内存与渲染瓶颈",-1)),l[3]||(l[3]=e("p",null,[n(" 「慢」其实不是一个问题，而是三个："),e("strong",null,"启动慢"),n("（从双击到首屏出现）、"),e("strong",null,"内存高"),n("（多开几个窗口就上 GB）、"),e("strong",null,"渲染卡"),n("（长列表一滚就掉帧）。用同一把尺子量这三件事，必然优化错地方。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 旧办法的毛病也很典型：凭感觉优化，哪儿慢就随手加个缓存，改完也不知道到底有没有用；把所有逻辑都堆在启动路径上，"),e("code",null,"app.whenReady()"),n(" 之前就同步读了一堆文件、"),e("code",null,"require"),n(" 了一堆重模块，把主进程启动堵死，窗口根本没机会露面；每开一个窗口就新建渲染进程、关掉又不释放引用，内存只涨不降；长列表则把上万行一次全渲染进 DOM。 ")],-1)),l[5]||(l[5]=e("p",null," 于是问题变成：怎么先把「慢在哪」量出来，再分别对症下药？ ",-1)),l[6]||(l[6]=e("h2",null,"性能指标采样",-1)),l[7]||(l[7]=e("p",null,[n(" 先别急着改代码，先量。主进程里用 "),e("code",null,"process.memoryUsage()"),n(" 定时采样 "),e("code",null,"rss"),n("（常驻内存），再用一张时间线把「双击 → 主进程 ready → 窗口创建 → 首屏渲染」几个关键点记下来；渲染侧就用 DevTools 的 Performance 面板录一段启动和关键交互。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它把「先测量、后优化」定成了顺序"),n("。有了数据，你会立刻发现那七秒根本不在创建窗口那一步，而在它前面被你同步堵住的主进程启动阶段。 ")],-1)),l[9]||(l[9]=e("h2",null,"采样缺失与资源泄漏",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("只测 "),e("code",null,"createWindow"),n(" 的耗时：漏掉了启动阶段那些同步 I/O 和 "),e("code",null,"require"),n(" 的阻塞，首帧其实是被它们拖住的。")]),e("li",null,"每个额外打开的渲染进程都有几十 MB 量级的内存成本，窗口随意堆叠很快把内存吃光。"),e("li",null,[n("窗口与 "),e("code",null,"WebContents"),n(" 关闭后引用没释放：GC 收不回，内存只涨不降。")]),e("li",null,"长列表一次性渲染全部行：DOM 节点上万，滚动必然卡。"),e("li",null,"后台窗口里的定时器和动画还在照常跑：白白耗 CPU 和电，用户却看不见。")],-1)),l[11]||(l[11]=e("h2",null,"主进程启动优化",-1)),l[12]||(l[12]=e("p",null,[n(" 先切启动路径，因为首屏速度是用户最直观的感受。两条：主进程里"),e("strong",null,"避免同步 I/O"),n("——能异步就异步，或者延后到窗口出现之后再做；"),e("strong",null,"非关键模块延迟加载"),n("——别在 "),e("code",null,"app.whenReady()"),n(" 之前 "),e("code",null,"require"),n(" 全量模块，等首屏出来、系统空闲时再动态 "),e("code",null,"import()"),n("。在渲染进程里，把不影响首屏的任务交给 "),e("code",null,"requestIdleCallback"),n("，让浏览器挑空闲帧去跑，别和首屏抢主线程。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 接着松开「首屏必须等数据」这个执念：首屏不必等全部数据就绪。先用骨架屏把窗口尽快显示出来，真实内容再渐进填充——"),e("strong",null,"让窗口尽早可见，比把所有启动逻辑一次前置更有效"),n("。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 再补内存这条线。定时用 "),e("code",null,"process.memoryUsage()"),n(" 采样 "),e("code",null,"rss"),n("，定位异常增长；窗口关闭时主动释放对窗口和 "),e("code",null,"WebContents"),n(" 的引用；控制同时打开的窗口数量。想精确定位就打开 DevTools 的 Memory 面板拍堆快照，对比两次快照找出泄漏的对象。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 然后是渲染这条线。长列表用"),e("strong",null,"虚拟滚动"),n("，只渲染当前视口里的那几行、滚动时复用节点；事件用防抖 / 节流；能交给 GPU 的动画用 CSS 硬件加速；重计算丢给 Web Worker 或子进程，别卡住 UI。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 最后说一个容易被忽略的开关 "),e("code",null,"backgroundThrottling"),n("。窗口失焦、切到后台后，Chromium 默认会节流它里面的定时器和动画（"),e("code",null,"backgroundThrottling"),n(" 默认为 "),e("code",null,"true"),n("），省下不少 CPU 和电。"),e("strong",null,"只有当后台窗口仍需精确计时"),n("（比如一个计时类应用）时才考虑把它关掉——代价是后台也照常耗资源，大多数应用保持默认就好。 ")],-1)),l[17]||(l[17]=e("h2",null,"三类优化逐项对照",-1)),e("figure",dl,[l[0]||(l[0]=e("figcaption",null,"对照三张优化卡片（启动 / 内存 / 渲染），再读示例里「延迟加载重模块」与「定时采样 RSS」两段代码，看每条优化各自对应哪条性能线、该在哪一步动手。",-1)),C(al)]),l[18]||(l[18]=e("h2",null,"瓶颈定位与对症优化",-1)),l[19]||(l[19]=e("p",null,[n(" 性能优化不是「哪里慢改哪里」，而是先分线再对症：用 "),e("code",null,"process.memoryUsage()"),n(" 和 DevTools 把瓶颈量出来，启动上砍同步 I/O、延迟加载重模块、首屏先给骨架，内存在窗口关闭时释放引用，渲染上用虚拟滚动与 "),e("code",null,"requestIdleCallback"),n(" 把工作挪出主线程。慢的往往不是你以为的那一步。 ")],-1)),l[20]||(l[20]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「虚拟列表（虚拟滚动）」"),n("只渲染当前视口里可见的少量行，滚动时按 "),e("code",null,"scrollTop"),n(" 换算出可见区间、复用 DOM 节点，把 DOM 数量从「数据总量」降到「视口行数」。边界：需要每行等高或能预估高度；被虚拟掉的节点不在 DOM 里，所以浏览器原生页内查找（Ctrl+F）找不到它们，锚点跳转和「滚动到第 N 行」也得自己算偏移量。 ")],-1))]),_:1})}}}),cl={class:"demo-container"},pl={class:"storage-grid"},ml={class:"use-case"},wl=w({__name:"E14Storage",setup(g){const t=[{name:"electron-store",desc:"基于 JSON，适合配置",useCase:"用户设置、应用配置"},{name:"IndexedDB",desc:"浏览器标准，适合结构化数据",useCase:"离线数据、缓存"},{name:"SQLite (better-sqlite3)",desc:"关系型，适合复杂查询",useCase:"本地数据库"},{name:"localStorage",desc:"简单键值对，同步 API",useCase:"临时数据"}];return(l,i)=>(s(),r("div",cl,[i[1]||(i[1]=e("h2",null,"🌰 本地数据存储",-1)),i[2]||(i[2]=e("p",{class:"desc"},"对比 electron-store、IndexedDB、SQLite 和 localStorage，掌握 Electron 应用的本地数据存储方案。",-1)),e("div",pl,[(s(),r(b,null,y(t,u=>e("div",{key:u.name,class:"storage-card"},[e("h3",null,p(u.name),1),e("p",null,p(u.desc),1),e("div",ml,[i[0]||(i[0]=e("strong",null,"适用场景:",-1)),n(" "+p(u.useCase),1)])])),64))]),i[3]||(i[3]=M(`<div class="code-block" data-v-f6b7cfa6><h3 data-v-f6b7cfa6>electron-store 示例</h3><pre data-v-f6b7cfa6>// 安装: npm install electron-store

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
store.clear()</pre></div><div class="tips" data-v-f6b7cfa6><h3 data-v-f6b7cfa6>选择建议</h3><ul data-v-f6b7cfa6><li data-v-f6b7cfa6><strong data-v-f6b7cfa6>配置数据</strong>: 使用 electron-store（简单、自动加密）</li><li data-v-f6b7cfa6><strong data-v-f6b7cfa6>结构化数据</strong>: 使用 IndexedDB（浏览器标准、异步）</li><li data-v-f6b7cfa6><strong data-v-f6b7cfa6>关系型数据</strong>: 使用 SQLite（支持复杂查询、事务）</li><li data-v-f6b7cfa6><strong data-v-f6b7cfa6>临时数据</strong>: 使用 localStorage（同步、简单）</li></ul></div>`,2))]))}}),gl=I(wl,[["__scopeId","data-v-f6b7cfa6"]]),fl={class:"lesson-figure"},vl=w({__name:"E14StorageArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("你把用户设置写进 "),e("code",null,"path.join(__dirname, 'config.json')"),n("，在开发机上一直好好的。打包成安装版发给用户，他改了主题、重启——设置全没了。去翻安装目录才发现，文件根本写不进去，那个目录在 Windows 上是 "),e("code",null,"Program Files"),n(" 下的只读位置。 ")],-1)),l[2]||(l[2]=e("h2",null,"数据落点选择",-1)),l[3]||(l[3]=e("p",null," 桌面应用总要「记住」点什么：窗口大小、上次登录的用户、离线缓存的数据。看着都是「存个文件」，可旧办法到处是坑。 ",-1)),l[4]||(l[4]=e("p",null,[n(" 第一是"),e("strong",null,"路径硬编码"),n("：开发时和安装后的目录不一样，而且安装目录（打包后 "),e("code",null,"resources"),n(" 下那类）通常是只读的，往里写要么失败、要么下次升级就被覆盖。第二是"),e("strong",null,"自己处理 JSON"),n("：解析、并发写、文件损坏后的恢复，全得手写，稍不留神就写坏一个文件。第三是"),e("strong",null,"不分数据形态"),n("：一份几十字节的配置和几万条离线记录，用同一套读写方式，迟早一边被拖垮。第四是"),e("strong",null,"多窗口并发写"),n("：两个窗口同时改同一个文件，后写的把先写的盖掉。 ")],-1)),l[5]||(l[5]=e("p",null," 所以真正的问题是：不同形态的本地数据，各自该落在哪、用什么存，才能兼顾正确的落点、合适的性能和并发安全？ ",-1)),l[6]||(l[6]=e("h2",null,"配置对象存储选型",-1)),l[7]||(l[7]=e("p",null,[n(" 配置这类小对象，用 "),e("code",null,"electron-store"),n("。它默认把 JSON 落到 "),e("code",null,"app.getPath('userData')"),n("——一个各平台都正确的、当前用户可写的目录——然后给你键路径读写："),e("code",null,"store.set('user.name', 'Alice')"),n("、"),e("code",null,"store.get('user.name')"),n("，存对象就是 "),e("code",null,"store.set('settings', { theme: 'dark' })"),n("。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它把「存到哪个平台的哪个目录」和「JSON 读写」这两件琐事标准化了"),n("。你不再猜路径，也不再手写解析和写盘。 ")],-1)),l[9]||(l[9]=e("h2",null,"整文件读写开销",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[e("code",null,"electron-store"),n(" 是"),e("strong",null,"整文件读写"),n("：数据量一大、或写入很频繁时，每次都要序列化整个文件，效率跟不上。")]),e("li",null,[n("它默认"),e("strong",null,"不加密"),n("：密码、令牌这类敏感字段得自己处理，别以为落进 userData 就安全了。")]),e("li",null,[n("渲染进程里的 "),e("code",null,"localStorage"),n(" / "),e("code",null,"IndexedDB"),n(" 主进程"),e("strong",null,"访问不到"),n("：想让主进程也读同一份数据，必须经 IPC。")]),e("li",null,[e("code",null,"userData"),n(" 在 Windows 与 macOS 上路径不同：硬编码磁盘路径，换个平台就错。")]),e("li",null,"多窗口并发写同一个文件：没有串行化，就会互相覆盖。"),e("li",null,"数据结构升级了（比如配置里新增一个字段）却没有版本号：老用户的数据读出来可能直接崩。")],-1)),l[11]||(l[11]=e("h2",null,"按数据形态分路",-1)),l[12]||(l[12]=e("p",null,[n(" 先按数据形态分路，这是本课的主干：配置 / 设置这类小对象用 "),e("code",null,"electron-store"),n("，图的是简单、落点正确；需要异步访问的高结构化数据（离线缓存）用 "),e("code",null,"IndexedDB"),n("，浏览器标准的异步存储；临时的小键值数据用 "),e("code",null,"localStorage"),n("，同步、简单，但只适合临时数据；有复杂查询、多表关联需求的，才用 "),e("code",null,"better-sqlite3"),n(" 或 "),e("code",null,"sql.js"),n(" 这类 SQLite，关系型、支持事务。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 接着把落点统一。所有落盘位置都从 "),e("code",null,"app.getPath('userData')"),n(" 取——Windows 在 "),e("code",null,"AppData\\Roaming"),n(" 下、macOS 在 "),e("code",null,"~/Library/Application Support"),n(" 下，代码里"),e("strong",null,"绝不硬编码"),n("。顺带记住一条边界：这个目录名跟 "),e("code",null,"productName"),n(" / "),e("code",null,"appId"),n(" 绑定，产品名改一次，老用户的数据就可能「找不到」了。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 然后是跨进程共享。把各存储方案封装成主进程里的服务模块，统一经 IPC 对外——渲染进程不直接持有文件句柄，主进程是数据的"),e("strong",null,"单一事实来源"),n("。这样做还有个附带好处：以后想换存储实现，只动主进程这一层。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 再解决并发。多窗口写同一份数据时，把写入"),e("strong",null,"串行化到主进程"),n("里排队，而不是让每个窗口各写各的文件；用 SQLite 的话，事务和 "),e("code",null,"better-sqlite3"),n(" 的同步 API 本身就是串行的，天然安全。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 最后加迁移与容错。给数据配一个 schema 版本号，启动时比对版本号决定要不要迁移；读文件用 "),e("code",null,"try / catch"),n(" 兜住，遇到损坏就先备份原文件、重建一份默认值，别让一个坏文件把应用卡死在启动阶段。 ")],-1)),l[17]||(l[17]=e("h2",null,"四种存储方案对照",-1)),e("figure",fl,[l[0]||(l[0]=e("figcaption",null,[n("对照四张存储卡片，比较 electron-store / IndexedDB / SQLite / localStorage 各自的定位，再读 "),e("code",null,"electron-store"),n(" 的键路径读写示例，体会「配置用 store、大数据用 SQLite」这套取舍。")],-1)),C(gl)]),l[18]||(l[18]=e("h2",null,"存储形态与落点",-1)),l[19]||(l[19]=e("p",null,[n(" 本地存储的取舍，本质是先分清数据形态，再各归各的落点：配置走 "),e("code",null,"electron-store"),n("、异步结构化数据走 "),e("code",null,"IndexedDB"),n("、复杂查询走 SQLite、临时数据走 "),e("code",null,"localStorage"),n("；落点一律用 "),e("code",null,"app.getPath('userData')"),n("，跨进程共享统一经主进程，多窗口写入串行化，并给数据留一个版本号来做迁移。 ")],-1)),l[20]||(l[20]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「userData 目录」"),n("是 Electron 约定的「每个用户、每个应用可写数据目录」，由 "),e("code",null,"app.getPath('userData')"),n(" 返回（Windows 在 "),e("code",null,"AppData\\Roaming\\<应用名>"),n("，macOS 在 "),e("code",null,"~/Library/Application Support/<应用名>"),n("）。边界：安装目录（打包后 "),e("code",null,"resources"),n(" 下）通常"),e("strong",null,"只读"),n("，绝不能往里写业务数据；该目录名与 "),e("code",null,"productName"),n(" / "),e("code",null,"appId"),n(" 绑定，改名或换 "),e("code",null,"appId"),n(" 会让老数据看似「丢失」，需要自己处理迁移。 ")],-1))]),_:1})}}}),bl={class:"demo-container"},yl={class:"windows-grid"},Sl={class:"controls"},xl=["onClick"],Il=["onClick"],Pl=w({__name:"E15MultiWindow",setup(g){const t=f([{id:1,title:"主窗口",type:"main",status:"open"},{id:2,title:"设置窗口",type:"settings",status:"closed"},{id:3,title:"关于窗口",type:"about",status:"closed"}]);function l(a){const d=t.value.find(o=>o.id===a);d&&(d.status="open")}function i(a){const d=t.value.find(o=>o.id===a);d&&(d.status="closed")}function u(){alert('向所有窗口发送消息: "refresh-data"')}return(a,d)=>(s(),r("div",bl,[d[0]||(d[0]=e("h2",null,"🌰 多窗口管理",-1)),d[1]||(d[1]=e("p",{class:"desc"},"管理多个应用窗口，实现窗口间通信、数据共享和状态同步。",-1)),e("div",yl,[(s(!0),r(b,null,y(t.value,o=>(s(),r("div",{key:o.id,class:S(["window-card",{open:o.status==="open"}])},[e("h3",null,p(o.title),1),e("p",null,"类型: "+p(o.type),1),e("p",null,"状态: "+p(o.status==="open"?"✅ 打开":"❌ 关闭"),1),e("div",Sl,[o.status==="closed"?(s(),r("button",{key:0,class:"btn",onClick:c=>l(o.id)},"打开",8,xl)):v("",!0),o.status==="open"?(s(),r("button",{key:1,class:"btn danger",onClick:c=>i(o.id)},"关闭",8,Il)):v("",!0)])],2))),128))]),e("button",{class:"btn broadcast",onClick:u},"广播消息到所有窗口"),d[2]||(d[2]=M(`<div class="code-block" data-v-60ca9521><h3 data-v-60ca9521>多窗口管理代码示例</h3><pre data-v-60ca9521>// 主进程 - 窗口管理
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
})</pre></div><div class="tips" data-v-60ca9521><h3 data-v-60ca9521>多窗口管理要点</h3><ul data-v-60ca9521><li data-v-60ca9521><strong data-v-60ca9521>窗口引用管理</strong>: 使用 Map 或对象存储窗口引用</li><li data-v-60ca9521><strong data-v-60ca9521>内存泄漏预防</strong>: 窗口 closed 事件中释放引用</li><li data-v-60ca9521><strong data-v-60ca9521>窗口间通信</strong>: 通过主进程中转或共享存储</li><li data-v-60ca9521><strong data-v-60ca9521>macOS 特殊处理</strong>: 所有窗口关闭后应用仍运行</li></ul></div>`,2))]))}}),kl=I(Pl,[["__scopeId","data-v-60ca9521"]]),Cl={class:"lesson-figure"},hl=w({__name:"E15MultiWindowArticle",setup(g){return(t,l)=>{const i=x;return s(),P(i,null,{default:k(()=>[l[1]||(l[1]=e("div",{class:"lesson-question"},[e("strong",null,"开场问题："),n("用户连点了三下「关于」，你屏幕上就叠了三个一模一样的关于窗口——因为你每点一次就 "),e("code",null,"new BrowserWindow"),n(" 一次。更别扭的是，主窗口把主题切成深色后，设置窗口还亮着白底，两个窗口各说各话，像活在两个应用里。 ")],-1)),l[2]||(l[2]=e("h2",null,"多窗口三类难题",-1)),l[3]||(l[3]=e("p",null,[n(" 多窗口应用比单窗口多出三件必须回答的事。"),e("strong",null,"谁是谁"),n("：同时存在好几个窗口实例，你怎么找到指定的那个、怎么保证同类窗口不重复弹。"),e("strong",null,"窗口之间怎么说话"),n("：主窗口改了主题，别的窗口怎么知道。"),e("strong",null,"窗口长什么样、在哪"),n("：用户拖过位置、调过大小，下次打开还还原不还原。 ")],-1)),l[4]||(l[4]=e("p",null,[n(" 旧办法每一步都有代价：窗口引用散落在全局变量或函数局部变量里，用时找不到、关时清不掉；窗口之间直接互相引用对方的 "),e("code",null,"webContents"),n("，一旦其中一个被关掉，另一个再发消息就是发给一个已经销毁的对象，直接报错；每个窗口各存一份全局状态，改一处不同步；窗口位置大小不持久化，用户精心摆好的布局重启就没了。 ")],-1)),l[5]||(l[5]=e("p",null," 所以要问的是：怎样把「多个窗口」当成一个可管理的整体，让它们找得到、说得上话、状态还不丢？ ",-1)),l[6]||(l[6]=e("h2",null,"窗口映射与集中管理",-1)),l[7]||(l[7]=e("p",null,[n(" 主进程里用一个 "),e("code",null,"Map"),n(" 集中持有所有窗口：创建后 "),e("code",null,"windows.set(win.id, { win, type })"),n("，需要哪个窗口就按 "),e("code",null,"id"),n(" 取。 ")],-1)),l[8]||(l[8]=e("p",null,[n(" 这个方案做对了一件事："),e("strong",null,"它把「窗口实例」变成了一个可查询、可清理的集合"),n("，而不是一堆散落在角落里的变量。有了这张表，「找到某个窗口」和「关掉后把它忘掉」都成了明确的操作。 ")],-1)),l[9]||(l[9]=e("h2",null,"单例缺失与引用残留",-1)),l[10]||(l[10]=e("ul",null,[e("li",null,[n("没有单例控制：同一个按钮点几下就 "),e("code",null,"new"),n(" 出几个同类窗口，用户想要的其实只是把已有的那个拉到前面。")]),e("li",null,[e("code",null,"closed"),n(" 事件里不 "),e("code",null,"windows.delete(win.id)"),n("：引用一直挂在 Map 上，GC 收不回，还会在你稍后对它 "),e("code",null,"send"),n(" 时抛错。")]),e("li",null,[n("窗口之间直接互相引用 "),e("code",null,"webContents"),n("：一个关了，另一个还攥着旧引用，通信时打到死对象上。")]),e("li",null,"每个窗口各存一份共享状态：主窗口改了，设置窗口不知道，界面就对不上。"),e("li",null,"平台差异：macOS 上关掉所有窗口应用仍在运行，「什么时候退出」不能只按 Windows 的直觉写。"),e("li",null,"窗口位置大小不保存：用户摆放的布局，重启就回去了。")],-1)),l[11]||(l[11]=e("h2",null,"主进程转发与单例控制",-1)),l[12]||(l[12]=e("p",null,[n(" 先把「实例管理」补成可靠的。在 "),e("code",null,"Map"),n(" 之外加一层"),e("strong",null,"单例判断"),n("：开窗口前先查有没有同类窗口，有就 "),e("code",null,"win.focus()"),n("（必要时先 "),e("code",null,"restore()"),n("），没有才 "),e("code",null,"new BrowserWindow"),n(" 并存进 Map。这一步直接解决连点叠窗。 ")],-1)),l[13]||(l[13]=e("p",null,[n(" 接着定「父子关系」。用 "),e("code",null,"new BrowserWindow({ parent: mainWindow })"),n(" 建立从属：子窗口永远在父窗口之上，父窗口最小化或关闭时子窗口随之隐藏或关闭；需要它挡住父窗口操作时再加 "),e("code",null,"modal: true"),n("。同时给窗口类型定下清晰契约——"),e("strong",null,"谁是主窗口、谁负责退出"),n("，避免出现孤儿窗口或互相等待的僵局。 ")],-1)),l[14]||(l[14]=e("p",null,[n(" 再解决通信。这里的关键是"),e("strong",null,"窗口之间不互相直接碰，统一由主进程当中间人"),n("。想给某个窗口发消息，就用 "),e("code",null,"target.webContents.send(channel, data)"),n(" 定向推送；想通知所有窗口，就遍历 "),e("code",null,"BrowserWindow.getAllWindows()"),n(" 广播——比如主窗口切了主题，主进程收到后广播给每个窗口，大家步调一致。这样做的好处是：任何一方被关掉都不会连累别人，因为发消息的始终是还活着的主进程。 ")],-1)),l[15]||(l[15]=e("p",null,[n(" 然后是共享状态。"),e("strong",null,"以主进程或存储为单一事实来源"),n("，各个窗口只持有自己的快照：数据改动先到主进程，主进程再决定推给谁。这样关掉任意一个窗口都不会丢全局状态。 ")],-1)),l[16]||(l[16]=e("p",null,[n(" 最后补窗口状态持久化。在窗口 "),e("code",null,"resize"),n(" / "),e("code",null,"move"),n("（或关闭）时把位置和大小记进 "),e("code",null,"electron-store"),n(" 这类 userData 存储里，下次创建时读取恢复；恢复前"),e("strong",null,"先校验保存的 bounds 是否还落在当前显示器范围内"),n("——用户可能拔掉了那块外接屏，直接 "),e("code",null,"setBounds"),n(" 会把窗口放到看不见的地方。 ")],-1)),l[17]||(l[17]=e("p",null,[n(" 收尾是清理：每个窗口的 "),e("code",null,"closed"),n(" 事件里 "),e("code",null,"windows.delete(win.id)"),n("，让引用和对象一起被回收；再配合 "),e("code",null,"window-all-closed"),n(" 处理「所有窗口都关了要不要退出应用」这个平台差异。 ")],-1)),l[18]||(l[18]=e("h2",null,"开关切换与消息广播",-1)),e("figure",Cl,[l[0]||(l[0]=e("figcaption",null,"点每个窗口卡片上的「打开 / 关闭」管理它的生命周期，再点「广播消息到所有窗口」模拟主进程的定向推送与广播，观察窗口状态如何随开关同步变化。",-1)),C(kl)]),l[19]||(l[19]=e("h2",null,"三项职责归属",-1)),l[20]||(l[20]=e("p",null,[n(" 多窗口管理的三件事各有归属：实例用主进程里的一个 "),e("code",null,"Map"),n(" 集中管理并加单例判断，通信一律走主进程中转（定向用 "),e("code",null,"webContents.send"),n("、批量用 "),e("code",null,"getAllWindows()"),n(" 广播），共享状态以主进程为单一事实来源，窗口位置用 userData 存储持久化。别忘了在 "),e("code",null,"closed"),n(" 里删引用——这是不掉进内存泄漏的关键。 ")],-1)),l[21]||(l[21]=e("div",{class:"lesson-term"},[e("span",{class:"term-name"},"「父子窗口」"),n("通过在 "),e("code",null,"BrowserWindow"),n(" 选项里传 "),e("code",null,"parent"),n(" 建立：子窗口永远浮在父窗口之上，父窗口最小化或关闭时子窗口跟随隐藏或关闭；再加 "),e("code",null,"modal: true"),n(" 会让子窗口阻塞父窗口的交互。边界：父子关系必须"),e("strong",null,[n("显式传 "),e("code",null,"parent")]),n("，不能靠窗口创建顺序去推断；而且平台表现不完全一致（macOS 的 modal sheet 行为与 Windows 有差异），macOS 上「关掉所有窗口」也不等于退出应用，退出策略要单独处理。 ")],-1))]),_:1})}}}),Wl=()=>Promise.resolve(`// ========== 1. 主进程入口 main.js ==========
// 主进程管理应用生命周期和所有原生能力
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 主进程单例，负责创建窗口、管理生命周期
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

// ========== 2. 预加载脚本 preload.js ==========
// 预加载脚本在渲染进程加载前运行，可同时访问 Node.js 和 DOM API
const { contextBridge, ipcRenderer } = require('electron')

// 通过 contextBridge 安全暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onMessage: (callback) => ipcRenderer.on('message', (_event, data) => callback(data))
})

// ========== 3. 渲染进程 renderer.js ==========
// 渲染进程运行 Web 页面，只能访问预加载脚本暴露的 API
console.log('Electron 版本:', window.electronAPI)

async function getVersion() {
  const version = await window.electronAPI.getAppVersion()
  console.log('App 版本:', version)
}

// ========== 4. 进程模型说明 ==========
// 主进程 (Main)       -> 1个，管理应用、窗口、原生 API
// 渲染进程 (Renderer)  -> 每个窗口一个，运行 Web 页面
// 预加载脚本 (Preload) -> 每个渲染进程一个，桥接主进程与渲染进程
// Utility 进程         -> 可选，运行 CPU 密集任务

// ========== 5. package.json 配置 ==========
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}

// ========== 6. 进程间通信模式 ==========
// 1. invoke/handle: 渲染进程 -> 主进程（请求-响应）
// 2. send/on:       渲染进程 -> 主进程（单向）
// 3. sendToWebContents: 主进程 -> 渲染进程
// 4. MessagePort:   渲染进程之间直接通信（通过主进程中转端口）`),Ml=()=>Promise.resolve(`// ========== 1. 基本窗口创建 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createMainWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '我的 Electron 应用',
    icon: path.join(__dirname, 'assets/icon.png'),
    // 窗口初始位置
    x: 100,
    y: 100,
    // 是否可调整大小
    resizable: true,
    // 是否可最大化
    maximizable: true,
    // 是否可最小化
    minimizable: true,
    // 是否可关闭
    closable: true,
    // 是否聚焦
    focusable: true,
    // 透明窗口
    transparent: false,
    // 无边框窗口
    frame: true,
    // 自动隐藏菜单栏
    autoHideMenuBar: false,
    // 背景色
    backgroundColor: '#ffffff',
    webPreferences: {
      // 预加载脚本路径
      preload: path.join(__dirname, 'preload.js'),
      // 开启上下文隔离（安全，默认 true）
      contextIsolation: true,
      // 关闭 Node.js 集成（安全，默认 false）
      nodeIntegration: false,
      // 开启沙箱模式
      sandbox: false,
      // 允许使用 remote 模块（不推荐）
      enableRemoteModule: false,
      // 开启 web 安全（默认 true）
      webSecurity: true
    }
  })

  // 加载本地 HTML 文件
  mainWindow.loadFile('index.html')

  // 加载远程 URL
  // mainWindow.loadURL('https://example.com')

  // 打开开发者工具
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

// ========== 2. 窗口生命周期事件 ==========
function setupWindowEvents(win) {
  // 页面加载完成
  win.webContents.on('did-finish-load', () => {
    console.log('页面加载完成')
  })

  // 窗口准备好显示时（配合 show: false 避免闪烁）
  win.once('ready-to-show', () => {
    win.show()
  })

  // 窗口获得焦点
  win.on('focus', () => {
    console.log('窗口获得焦点')
  })

  // 窗口失去焦点
  win.on('blur', () => {
    console.log('窗口失去焦点')
  })

  // 窗口最大化
  win.on('maximize', () => {
    console.log('窗口最大化')
  })

  // 窗口最小化
  win.on('minimize', () => {
    console.log('窗口最小化')
  })

  // 窗口关闭前
  win.on('close', (event) => {
    console.log('窗口即将关闭')
    // 可以阻止关闭
    // event.preventDefault()
  })

  // 窗口已关闭（释放引用）
  win.on('closed', () => {
    console.log('窗口已关闭')
    // win = null
  })
}

// ========== 3. 无边框窗口 + 自定义拖拽 ==========
// main.js 中创建无边框窗口
function createFramelessWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框
    transparent: true, // 透明
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  return win
}

// 渲染进程中设置可拖拽区域 CSS
// .title-bar { -webkit-app-region: drag; }
// .title-bar button { -webkit-app-region: no-drag; }

// ========== 4. 窗口状态管理 ==========
function windowStateExample(win) {
  // 获取窗口位置
  const [x, y] = win.getPosition()
  console.log(\`窗口位置: \${x}, \${y}\`)

  // 获取窗口大小
  const [width, height] = win.getSize()
  console.log(\`窗口大小: \${width}x\${height}\`)

  // 最大化
  win.maximize()

  // 最小化
  win.minimize()

  // 恢复
  win.restore()

  // 全屏
  win.setFullScreen(true)

  // 始终置顶
  win.setAlwaysOnTop(true, 'screen-saver')

  // 设置进度条（任务栏）
  win.setProgressBar(0.5)
}

// ========== 5. 应用启动时创建窗口 ==========
app.whenReady().then(() => {
  const mainWindow = createMainWindow()
  setupWindowEvents(mainWindow)

  // macOS 上点击 Dock 图标且没有窗口时重新创建
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// 所有窗口关闭时退出（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})`),Al=()=>Promise.resolve(`// ========== 1. 主进程 IPC: ipcMain.handle (推荐) ==========
// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs/promises')

// 注册 IPC 处理函数（渲染进程用 invoke 调用）
ipcMain.handle('read-user-data', async (_event, fileName) => {
  try {
    const userDataPath = app.getPath('userData')
    const filePath = path.join(userDataPath, fileName)
    const content = await fs.readFile(filePath, 'utf-8')
    return { success: true, data: content }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// 同步 IPC（不推荐，会阻塞渲染进程）
ipcMain.on('sync-message', (event, arg) => {
  console.log('收到同步消息:', arg)
  event.returnValue = '同步响应'
})

// ========== 2. 预加载脚本: 暴露 IPC API ==========
// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 调用主进程方法（Promise 方式）
  readUserData: (fileName) => ipcRenderer.invoke('read-user-data', fileName),

  // 发送单向消息
  sendNotification: (message) => ipcRenderer.send('send-notification', message),

  // 监听主进程事件
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', (_event, data) => callback(data))
  },

  // 一次性监听
  onceUpdateDownloaded: (callback) => {
    ipcRenderer.once('update-downloaded', (_event, data) => callback(data))
  },

  // 移除监听器
  removeUpdateListener: () => {
    ipcRenderer.removeAllListeners('update-available')
  }
})

// ========== 3. 渲染进程调用 ==========
// renderer.js
async function loadSettings() {
  const result = await window.electronAPI.readUserData('settings.json')
  if (result.success) {
    console.log('设置:', JSON.parse(result.data))
  } else {
    console.error('读取失败:', result.error)
  }
}

// 发送单向消息
window.electronAPI.sendNotification('用户已登录')

// 监听主进程事件
window.electronAPI.onUpdateAvailable((version) => {
  console.log('发现新版本:', version)
})

// ========== 4. 主进程向渲染进程发送消息 ==========
// main.js
function sendMessageToRenderer(win, channel, data) {
  // 向指定窗口发送
  win.webContents.send(channel, data)
}

// 向所有窗口广播
function broadcastToAll(channel, data) {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach(win => {
    win.webContents.send(channel, data)
  })
}

// 示例: 发送更新通知
ipcMain.on('send-notification', (event, message) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.send('notification-received', {
    from: 'system',
    message
  })
})

// ========== 5. 窗口间通信（通过主进程中转） ==========
// main.js
const windowMap = new Map()

// 注册窗口
ipcMain.handle('register-window', (event, windowId) => {
  windowMap.set(windowId, event.sender)
  return { success: true }
})

// 向指定窗口发送消息
ipcMain.handle('send-to-window', (_event, { targetId, message }) => {
  const target = windowMap.get(targetId)
  if (target) {
    target.send('window-message', message)
    return { success: true }
  }
  return { success: false, error: '窗口不存在' }
})

// ========== 6. MessagePort 直接通信 ==========
// preload.js
contextBridge.exposeInMainWorld('messagePort', {
  // 请求端口
  requestPort: () => ipcRenderer.invoke('request-port'),
  // 接收端口
  onPort: (callback) => {
    ipcRenderer.on('port', (event) => {
      callback(event.ports[0])
    })
  }
})

// main.js
ipcMain.handle('request-port', (event) => {
  const portPair = new MessageChannel()
  // 把 port2 发送给另一个窗口
  // anotherWin.webContents.postMessage('port', null, [portPair.port2])
  // 返回 port1 给请求方
  event.sender.postMessage('port', null, [portPair.port1])
  return { success: true }
})

// ========== 7. IPC 安全最佳实践 ==========
// 1. 不要直接暴露 ipcRenderer 整个对象
// 2. 验证参数类型和范围
// 3. 使用白名单通道
// 4. 不要返回敏感数据给不可信的渲染进程
// 5. 对于文件操作，限制在特定目录内

// 示例: 参数验证
ipcMain.handle('read-file', async (_event, filePath) => {
  // 验证参数类型
  if (typeof filePath !== 'string') {
    throw new Error('文件路径必须是字符串')
  }
  // 限制在用户数据目录内（防止路径穿越）
  const userDataPath = app.getPath('userData')
  const resolvedPath = path.resolve(userDataPath, filePath)
  if (!resolvedPath.startsWith(userDataPath)) {
    throw new Error('不允许访问该目录')
  }
  // ... 读取文件
})`),El=()=>Promise.resolve(`// ========== 1. 基础预加载脚本 preload.js ==========
const { contextBridge, ipcRenderer } = require('electron')

// 使用 contextBridge 安全暴露 API
// 只有在这里显式暴露的方法，渲染进程才能访问
contextBridge.exposeInMainWorld('myAPI', {
  // 暴露方法
  ping: () => ipcRenderer.invoke('ping'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // 暴露事件监听
  onCounterUpdate: (callback) => {
    ipcRenderer.on('counter-update', (_event, value) => callback(value))
  },

  // 移除监听器的方法（防止内存泄漏）
  removeCounterListener: () => {
    ipcRenderer.removeAllListeners('counter-update')
  }
})

// ========== 2. 主进程对应实现 main.js ==========
const { ipcMain } = require('electron')

ipcMain.handle('ping', () => 'pong')
ipcMain.handle('get-app-version', () => app.getVersion())

// ========== 3. 渲染进程使用 renderer.js ==========
// 调用暴露的 API
async function test() {
  const result = await window.myAPI.ping()
  console.log(result) // 'pong'

  const version = await window.myAPI.getAppVersion()
  console.log('版本:', version)
}

// 监听事件
window.myAPI.onCounterUpdate((count) => {
  console.log('计数器:', count)
})

// ========== 4. 完整示例: 文件操作 API ==========
// preload.js
contextBridge.exposeInMainWorld('fileAPI', {
  // 读取文件
  readFile: (fileName) => ipcRenderer.invoke('file:read', fileName),
  // 写入文件
  writeFile: (fileName, content) => ipcRenderer.invoke('file:write', fileName, content),
  // 删除文件
  deleteFile: (fileName) => ipcRenderer.invoke('file:delete', fileName),
  // 列出目录
  listDir: (dirPath) => ipcRenderer.invoke('file:list', dirPath)
})

// main.js - 实现文件操作（带安全限制）
const fs = require('fs/promises')
const path = require('path')

const USER_DATA_DIR = app.getPath('userData')

function safeJoin(base, target) {
  const resolved = path.resolve(base, target)
  if (!resolved.startsWith(base)) {
    throw new Error('路径越界')
  }
  return resolved
}

ipcMain.handle('file:read', async (_event, fileName) => {
  const filePath = safeJoin(USER_DATA_DIR, fileName)
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.handle('file:write', async (_event, fileName, content) => {
  const filePath = safeJoin(USER_DATA_DIR, fileName)
  await fs.writeFile(filePath, content, 'utf-8')
  return { success: true }
})

// ========== 5. 暴露 Node.js 模块的子集 ==========
// preload.js - 安全地暴露部分功能
const os = require('os')

contextBridge.exposeInMainWorld('systemInfo', {
  // 只暴露部分属性，不暴露整个 os 模块
  platform: process.platform,
  arch: process.arch,
  hostname: os.hostname(),
  totalMem: os.totalmem(),
  cpusCount: os.cpus().length,
  // 暴露方法但做包装
  getUptime: () => os.uptime()
})

// ========== 6. 多预加载脚本 ==========
// main.js 中可以使用多个 preload 脚本
// 注意: Electron 只支持一个 preload，需要手动合并
// 推荐模式: 一个主 preload，内部导入其他模块

// preload.js 内部模块化
// const apiModuleA = require('./preload/a')
// const apiModuleB = require('./preload/b')
// contextBridge.exposeInMainWorld('moduleA', apiModuleA)
// contextBridge.exposeInMainWorld('moduleB', moduleB)

// ========== 7. 上下文隔离下的类型定义 ==========
// TypeScript 环境下，需要声明全局类型
// src/global.d.ts
// export interface ElectronAPI {
//   ping: () => Promise<string>
//   getAppVersion: () => Promise<string>
//   onCounterUpdate: (callback: (value: number) => void) => void
// }
//
// declare global {
//   interface Window {
//     myAPI: ElectronAPI
//   }
// }
//
// export {}

// ========== 8. 安全最佳实践 ==========
// 1. 开启 contextIsolation: true（Electron 12+ 默认开启）
// 2. 不要直接暴露 ipcRenderer 对象
// 3. 不要暴露 require 或 Node.js 模块的原始引用
// 4. 只暴露必要的 API，遵循最小权限原则
// 5. 对所有传入参数进行验证
// 6. 提供移除监听器的方法防止内存泄漏
// 7. 不要在预加载脚本中存储敏感数据
// 8. 避免原型污染（Object.freeze 暴露的对象）

// ========== 9. 禁用 contextIsolation 的危险模式（不推荐） ==========
// webPreferences: {
//   contextIsolation: false,  // 关闭上下文隔离（不安全）
//   nodeIntegration: true,    // 开启 Node.js 集成（不安全）
// }
// 渲染进程可直接访问 Node.js
// const fs = require('fs')  // 但这会带来严重安全风险`),ql=()=>Promise.resolve(`// ========== 1. 应用生命周期事件 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow = null

// 应用即将开始加载（最早的事件）
app.on('will-finish-launching', () => {
  console.log('应用即将完成启动')
  // macOS 上在此处注册 open-file / open-url 事件
})

// 应用就绪（可以创建窗口了）
app.whenReady().then(() => {
  console.log('应用已就绪')
  mainWindow = createMainWindow()
})

// 所有窗口都关闭时
app.on('window-all-closed', () => {
  console.log('所有窗口已关闭')
  // macOS 上应用通常保持运行
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// macOS 上点击 Dock 图标激活应用
app.on('activate', () => {
  console.log('应用被激活')
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow()
  }
})

// 应用即将退出（可以阻止）
app.on('before-quit', (event) => {
  console.log('应用即将退出')
  // 可以阻止退出
  // event.preventDefault()
})

// 应用所有窗口已关闭，即将退出（不能阻止）
app.on('will-quit', (event) => {
  console.log('应用将要退出')
  // 在此执行清理工作
})

// 应用已退出
app.on('quit', (event, exitCode) => {
  console.log(\`应用已退出，退出码: \${exitCode}\`)
})

// ========== 2. 单例应用 ==========
// 确保只有一个应用实例在运行
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 如果没拿到锁，说明已有实例在运行，直接退出
  app.quit()
} else {
  // 第二个实例启动时触发
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 聚焦已有窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
    // 可以处理第二个实例传来的参数（比如打开文件）
    console.log('第二个实例启动，命令行参数:', commandLine)
  })
}

// ========== 3. 深度链接 (自定义协议) ==========
// 注册自定义协议，如 myapp://
app.setAsDefaultProtocolClient('myapp')

// macOS: 通过 URL 打开应用
app.on('open-url', (event, url) => {
  event.preventDefault()
  console.log('通过 URL 打开:', url)
  // 解析 URL 并导航到对应页面
  // myapp://page/dashboard?tab=1
})

// macOS: 通过文件打开应用
app.on('open-file', (event, filePath) => {
  event.preventDefault()
  console.log('通过文件打开:', filePath)
})

// Windows/Linux: 在 second-instance 中处理协议
// commandLine 参数中包含 URL

// ========== 4. 启动参数解析 ==========
// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(1) // 第一个是可执行文件路径
  console.log('命令行参数:', args)

  // 查找特定参数
  const hasDevMode = args.includes('--dev')
  const hasPort = args.some(a => a.startsWith('--port='))

  return { hasDevMode, hasPort }
}

// ========== 5. 开机自启动 ==========
// 设置开机自启动
app.setLoginItemSettings({
  openAtLogin: true,
  // 启动参数
  args: ['--from-startup'],
  // macOS 隐藏启动
  openAsHidden: false
})

// 检查开机自启动状态
const loginSettings = app.getLoginItemSettings()
console.log('开机自启:', loginSettings.openAtLogin)

// ========== 6. 应用 ID 和名称 ==========
app.name = 'My Electron App'
app.setAppUserModelId('com.mycompany.myapp') // Windows 任务栏分组

// ========== 7. 优雅退出 ==========
let isQuitting = false

app.on('before-quit', (event) => {
  if (!isQuitting) {
    event.preventDefault()
    // 执行清理工作
    cleanup().then(() => {
      isQuitting = true
      app.quit()
    })
  }
})

async function cleanup() {
  console.log('执行清理...')
  // 保存数据
  // 关闭连接
  // 释放资源
  return Promise.resolve()
}

// 窗口关闭时的处理
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('index.html')

  // 窗口关闭时
  win.on('close', (event) => {
    // 如果是退出应用，直接关闭
    if (isQuitting) return

    // 否则隐藏到托盘（如果有托盘）
    event.preventDefault()
    win.hide()
  })

  return win
}

// ========== 8. 应用路径 ==========
function getAppPaths() {
  // 用户数据目录
  console.log('userData:', app.getPath('userData'))
  // 应用安装目录
  console.log('appData:', app.getPath('appData'))
  // 桌面目录
  console.log('desktop:', app.getPath('desktop'))
  // 文档目录
  console.log('documents:', app.getPath('documents'))
  // 临时目录
  console.log('temp:', app.getPath('temp'))
  // 可执行文件目录
  console.log('exe:', app.getPath('exe'))
}`),Ol=()=>Promise.resolve(`// ========== 1. 应用菜单 main.js ==========
const { app, BrowserWindow, Menu, MenuItem, shell } = require('electron')
const path = require('path')

// 构建菜单模板
function createMenu() {
  const template = [
    // App 菜单（macOS 专用，放在第一位）
    ...(process.platform === 'darwin' ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建文件',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            console.log('新建文件')
          }
        },
        {
          label: '打开文件...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            // 打开文件对话框
          }
        },
        { type: 'separator' },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            console.log('保存')
          }
        },
        {
          label: '另存为...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {}
        },
        { type: 'separator' },
        // 不同平台的退出位置
        process.platform === 'darwin'
          ? { role: 'close' }
          : { role: 'quit' }
      ]
    },

    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },      // 撤销
        { role: 'redo' },      // 重做
        { type: 'separator' },
        { role: 'cut' },       // 剪切
        { role: 'copy' },      // 复制
        { role: 'paste' },     // 粘贴
        { role: 'selectAll' }, // 全选
        { type: 'separator' },
        {
          label: '查找',
          accelerator: 'CmdOrCtrl+F',
          click: () => {}
        }
      ]
    },

    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },

    // 窗口菜单
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin' ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },

    // 帮助菜单
    {
      label: '帮助',
      submenu: [
        {
          label: '官方文档',
          click: async () => {
            await shell.openExternal('https://www.electronjs.org/docs')
          }
        },
        {
          label: '关于',
          click: () => {
            // 显示关于对话框
          }
        }
      ]
    }
  ]

  // 构建菜单
  const menu = Menu.buildFromTemplate(template)
  // 设置为应用菜单
  Menu.setApplicationMenu(menu)

  return menu
}

// ========== 2. 动态添加菜单项 ==========
function addDynamicMenuItem() {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  const fileMenu = menu.items.find(item => item.label === '文件')
  if (fileMenu && fileMenu.submenu) {
    fileMenu.submenu.append(new MenuItem({
      label: '最近打开',
      submenu: [
        { label: 'file1.txt', click: () => {} },
        { label: 'file2.txt', click: () => {} }
      ]
    }))
    // 重新设置菜单
    Menu.setApplicationMenu(menu)
  }
}

// ========== 3. 上下文菜单（右键菜单） ==========
// 方式一: 主进程中创建，通过 IPC 调用
function showContextMenu(win, x, y) {
  const contextMenu = Menu.buildFromTemplate([
    { label: '复制', role: 'copy' },
    { label: '粘贴', role: 'paste' },
    { type: 'separator' },
    {
      label: '自定义操作',
      click: () => {
        console.log('执行自定义操作')
      }
    },
    {
      label: '在浏览器中打开链接',
      click: async () => {
        await shell.openExternal('https://example.com')
      }
    }
  ])

  contextMenu.popup({
    window: win,
    x,
    y
  })
}

// preload.js 暴露 API
// contextBridge.exposeInMainWorld('menuAPI', {
//   showContextMenu: (x, y) => ipcRenderer.invoke('show-context-menu', x, y)
// })

// main.js 处理调用
// ipcMain.handle('show-context-menu', (event, x, y) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   showContextMenu(win, x, y)
// })

// 方式二: 渲染进程中使用 @electron/remote（不推荐）
// 推荐用 IPC 方式

// ========== 4. 菜单项类型 ==========
const menuItemTypes = [
  { type: 'normal', label: '普通菜单项' },
  { type: 'separator' }, // 分隔线
  { type: 'submenu', label: '子菜单', submenu: [] },
  { type: 'checkbox', label: '复选框', checked: true },
  { type: 'radio', label: '单选按钮' }
]

// ========== 5. 快捷键 (accelerator) ==========
// 格式: 修饰符+键名
// 修饰符: Command / Cmd, Control / Ctrl, CommandOrControl / CmdOrCtrl,
//         Alt, Option, Shift, Super (Windows键/Command键)
// 常用键: A-Z, 0-9, F1-F24, Space, Enter, Backspace, Delete,
//         Up, Down, Left, Right, Home, End, PageUp, PageDown, Escape

const acceleratorExamples = [
  'CmdOrCtrl+A',         // 全选
  'CmdOrCtrl+Shift+S',   // 另存为
  'Alt+F4',              // 关闭窗口
  'F5',                  // 刷新
  'CmdOrCtrl+Shift+I',   // 开发者工具
  'Shift+F10'            // 右键菜单
]

// ========== 6. 动态切换菜单 ==========
function updateMenuForLoginState(isLoggedIn) {
  const template = [
    {
      label: '账户',
      submenu: isLoggedIn
        ? [
            { label: '个人中心', click: () => {} },
            { label: '设置', click: () => {} },
            { type: 'separator' },
            { label: '退出登录', click: () => {} }
          ]
        : [
            { label: '登录', click: () => {} },
            { label: '注册', click: () => {} }
          ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// ========== 7. 应用启动时设置菜单 ==========
app.whenReady().then(() => {
  createMenu()
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  win.loadFile('index.html')
})`),Rl=()=>Promise.resolve(`// ========== 1. 系统托盘 main.js ==========
const { app, BrowserWindow, Tray, Menu, Notification, nativeImage } = require('electron')
const path = require('path')

let tray = null
let mainWindow = null

// 创建系统托盘
function createTray() {
  // 托盘图标（推荐使用 16x16 和 32x32 的 PNG）
  const iconPath = path.join(__dirname, 'assets/tray-icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath)

  tray = new Tray(trayIcon)

  // 设置托盘提示文字
  tray.setToolTip('我的 Electron 应用')

  // 设置托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      label: '隐藏主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.hide()
        }
      }
    },
    { type: 'separator' },
    {
      label: '设置',
      click: () => {
        console.log('打开设置')
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // 单击托盘图标事件
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  // 双击托盘图标事件
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // 右键点击（通常显示上下文菜单，Electron 已自动处理）
  tray.on('right-click', () => {
    tray.popUpContextMenu()
  })
}

// ========== 2. 更新托盘图标 ==========
function updateTrayIcon(hasNotification) {
  if (!tray) return

  const iconName = hasNotification ? 'tray-icon-unread.png' : 'tray-icon.png'
  const iconPath = path.join(__dirname, 'assets', iconName)
  tray.setImage(nativeImage.createFromPath(iconPath))
}

// ========== 3. 系统通知 ==========
// 简单通知
function showNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
    // 图标
    icon: path.join(__dirname, 'assets/notification-icon.png'),
    // 声音（macOS）
    silent: false,
    // 超时时间
    timeoutType: 'default' // 'default' 或 'never'
  })

  notification.show()

  // 通知被点击
  notification.on('click', () => {
    console.log('通知被点击')
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    }
  })

  // 通知关闭
  notification.on('close', () => {
    console.log('通知已关闭')
  })

  // 通知操作按钮（仅部分平台支持）
  // notification.on('action', (event, index) => {
  //   console.log('点击了操作按钮:', index)
  // })
}

// 通知示例
function showDownloadComplete() {
  showNotification(
    '下载完成',
    '文件已经下载完成，点击查看'
  )
}

// ========== 4. 完整的托盘应用模式 ==========
// 关闭窗口时最小化到托盘，而不是退出
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // 初始不显示，等 ready-to-show
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('index.html')

  // 准备好再显示
  win.once('ready-to-show', () => {
    win.show()
  })

  // 窗口关闭时隐藏到托盘（不退出应用）
  win.on('close', (event) => {
    // 如果是用户主动退出应用（通过托盘菜单退出），则真的关闭
    if (app.isQuiting) {
      return
    }

    // 否则隐藏到托盘
    event.preventDefault()
    win.hide()

    // 显示通知告知用户
    showNotification('应用已最小化', '程序在系统托盘中继续运行')
  })

  return win
}

// 自定义退出方法
function quitApp() {
  app.isQuiting = true
  app.quit()
}

// ========== 5. macOS Dock 图标隐藏 ==========
// 纯托盘应用可以隐藏 Dock 图标
function setupDock() {
  if (process.platform === 'darwin') {
    // 隐藏 Dock 图标
    app.dock.hide()

    // 或者显示 Dock 图标
    // app.dock.show()

    // 设置 Dock 菜单
    const dockMenu = Menu.buildFromTemplate([
      {
        label: '新窗口',
        click: () => {}
      }
    ])
    app.dock.setMenu(dockMenu)

    // 设置 Dock 图标徽章（数字角标）
    app.dock.setBadge('5')

    // 弹跳 Dock 图标
    // app.dock.bounce('critical') // 一直弹直到点击
    // app.dock.bounce('informational') // 弹一下
  }
}

// ========== 6. Windows 任务栏气球通知 ==========
// Windows 上 Tray 也可以显示气球提示
function showTrayBalloon() {
  if (tray && process.platform === 'win32') {
    tray.displayBalloon({
      title: '通知标题',
      content: '这是气球通知内容',
      icon: path.join(__dirname, 'assets/tray-icon.png'),
      noSound: false,
      respectQuietTime: false
    })

    // 气球被点击
    tray.on('balloon-click', () => {
      console.log('气球通知被点击')
    })
  }
}

// ========== 7. 预加载脚本暴露通知 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('notificationAPI', {
//   showNotification: (title, body) =>
//     ipcRenderer.invoke('notification:show', title, body),
//   updateTrayBadge: (count) =>
//     ipcRenderer.invoke('tray:update-badge', count)
// })

// main.js 对应实现
// ipcMain.handle('notification:show', (_event, title, body) => {
//   showNotification(title, body)
// })
//
// ipcMain.handle('tray:update-badge', (_event, count) => {
//   if (process.platform === 'darwin') {
//     app.dock.setBadge(count > 0 ? String(count) : '')
//   }
// })

// ========== 8. 应用启动时初始化 ==========
app.whenReady().then(() => {
  mainWindow = createMainWindow()
  createTray()
  setupDock()
})

// macOS 激活时
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show()
  }
})`),Dl=()=>Promise.resolve(`// ========== 1. 文件选择对话框 main.js ==========
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

// 打开文件选择对话框
async function showOpenDialog(win) {
  const result = await dialog.showOpenDialog(win, {
    // 对话框标题
    title: '选择文件',
    // 默认打开的目录
    defaultPath: app.getPath('documents'),
    // 文件名输入框默认值
    defaultPath: 'default.txt',
    // 文件类型过滤器
    filters: [
      { name: '文本文件', extensions: ['txt', 'md'] },
      { name: '图片', extensions: ['jpg', 'png', 'gif', 'webp'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    // 对话框属性
    properties: [
      'openFile',       // 允许选择文件
      'openDirectory',  // 允许选择目录
      'multiSelections', // 允许多选
      'showHiddenFiles' // 显示隐藏文件
    ],
    // 自定义按钮标签（macOS）
    buttonLabel: '选择'
  })

  if (!result.canceled) {
    console.log('选择的文件:', result.filePaths)
    return result.filePaths
  }
  return null
}

// ========== 2. 保存文件对话框 ==========
async function showSaveDialog(win, defaultName = 'untitled.txt') {
  const result = await dialog.showSaveDialog(win, {
    title: '保存文件',
    defaultPath: path.join(app.getPath('documents'), defaultName),
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: 'JSON', extensions: ['json'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    // 如果文件名已存在，是否显示确认提示（默认 true）
    showsTagField: false
  })

  if (!result.canceled && result.filePath) {
    console.log('保存到:', result.filePath)
    return result.filePath
  }
  return null
}

// ========== 3. 消息对话框 ==========
// 信息提示框
async function showInfoBox(win, title, message) {
  const result = await dialog.showMessageBox(win, {
    type: 'info',          // 'none', 'info', 'error', 'question', 'warning'
    title: title,
    message: message,
    detail: '这是详细信息',
    buttons: ['确定', '取消'],
    defaultId: 0,          // 默认按钮索引
    cancelId: 1,           // 按 ESC 时触发的按钮索引
    icon: path.join(__dirname, 'assets/icon.png'),
    // 复选框
    checkboxLabel: '不再提示',
    checkboxChecked: false
  })

  console.log('点击的按钮:', result.response)
  console.log('复选框状态:', result.checkboxChecked)
  return result
}

// 错误对话框
async function showErrorBox(title, message) {
  await dialog.showErrorBox(title, message)
}

// 确认对话框
async function showConfirmBox(win, message) {
  const result = await dialog.showMessageBox(win, {
    type: 'question',
    title: '确认',
    message: message,
    buttons: ['确定', '取消'],
    defaultId: 1,
    cancelId: 1
  })
  return result.response === 0 // 0 是确定
}

// ========== 4. 完整使用示例 ==========
async function handleFileOperations(win) {
  // 打开文件
  const filePaths = await showOpenDialog(win)
  if (filePaths && filePaths.length > 0) {
    // 读取文件内容...
  }

  // 保存文件
  const savePath = await showSaveDialog(win, 'my-file.txt')
  if (savePath) {
    // 写入文件...
  }

  // 确认退出
  const confirmed = await showConfirmBox(win, '确定要退出吗？未保存的更改将丢失。')
  if (confirmed) {
    app.quit()
  }

  // 显示错误
  // showErrorBox('操作失败', '无法连接到服务器')
}

// ========== 5. 通过 IPC 暴露给渲染进程 ==========
// main.js
ipcMain.handle('dialog:openFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const result = await dialog.showOpenDialog(win, {
    title: options.title || '选择文件',
    defaultPath: options.defaultPath || app.getPath('documents'),
    filters: options.filters || [{ name: '所有文件', extensions: ['*'] }],
    properties: options.properties || ['openFile']
  })
  return result
})

ipcMain.handle('dialog:saveFile', async (event, options = {}) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return await dialog.showSaveDialog(win, {
    title: options.title || '保存文件',
    defaultPath: options.defaultPath,
    filters: options.filters
  })
})

ipcMain.handle('dialog:messageBox', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return await dialog.showMessageBox(win, options)
})

// ========== 6. preload.js 暴露 API ==========
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('dialogAPI', {
//   openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
//   saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
//   showMessage: (options) => ipcRenderer.invoke('dialog:messageBox', options),
//   confirm: (message) =>
//     ipcRenderer.invoke('dialog:messageBox', {
//       type: 'question',
//       title: '确认',
//       message: message,
//       buttons: ['确定', '取消'],
//       defaultId: 1,
//       cancelId: 1
//     }).then(r => r.response === 0)
// })

// ========== 7. 渲染进程使用 ==========
// async function selectAndReadFile() {
//   const result = await window.dialogAPI.openFile({
//     filters: [{ name: '文本文件', extensions: ['txt', 'md'] }],
//     properties: ['openFile']
//   })
//
//   if (!result.canceled) {
//     const filePath = result.filePaths[0]
//     // 然后通过另一个 IPC 读取文件内容
//   }
// }
//
// async function saveDocument() {
//   const confirmed = await window.dialogAPI.confirm('确定保存？')
//   if (!confirmed) return
//
//   const result = await window.dialogAPI.saveFile({
//     filters: [{ name: 'JSON', extensions: ['json'] }],
//     defaultPath: 'data.json'
//   })
//
//   if (!result.canceled && result.filePath) {
//     // 保存文件
//   }
// }

// ========== 8. 同步对话框（不推荐，会阻塞主进程） ==========
function syncDialogExample(win) {
  // showOpenDialog 同步版本
  // const result = dialog.showOpenDialogSync(win, { ... })
  // if (result) {
  //   console.log(result) // 返回文件路径数组
  // }

  // showSaveDialog 同步版本
  // const filePath = dialog.showSaveDialogSync(win, { ... })

  // showMessageBox 同步版本
  // const buttonIndex = dialog.showMessageBoxSync(win, { ... })
}

// ========== 9. 应用启动示例 ==========
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  win.loadFile('index.html')
})`),jl=()=>Promise.resolve(`// ========== 1. 全局快捷键 main.js ==========
const { app, BrowserWindow, globalShortcut, Menu } = require('electron')
const path = require('path')

// 注册全局快捷键
function registerGlobalShortcuts() {
  // 注册单个快捷键
  const ret = globalShortcut.register('CommandOrControl+Alt+K', () => {
    console.log('用户按下了 Ctrl+Alt+K')
    // 显示/隐藏窗口
    toggleWindow()
  })

  if (!ret) {
    console.log('快捷键注册失败（可能被其他应用占用）')
  }

  // 检查快捷键是否注册成功
  console.log('快捷键已注册:', globalShortcut.isRegistered('CommandOrControl+Alt+K'))

  // 注册媒体快捷键
  globalShortcut.register('MediaPlayPause', () => {
    console.log('播放/暂停')
  })

  globalShortcut.register('MediaNextTrack', () => {
    console.log('下一首')
  })

  globalShortcut.register('MediaPreviousTrack', () => {
    console.log('上一首')
  })
}

// 切换窗口显示/隐藏
let mainWindow = null
function toggleWindow() {
  if (!mainWindow) return

  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

// ========== 2. 注销快捷键 ==========
function unregisterShortcuts() {
  // 注销单个快捷键
  globalShortcut.unregister('CommandOrControl+Alt+K')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
}

// 应用退出时必须注销
app.on('will-quit', () => {
  unregisterShortcuts()
})

// ========== 3. 菜单快捷键（accelerator） ==========
// 菜单快捷键不需要手动注册，定义在 MenuItem 中即可
function createMenuWithShortcuts() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            console.log('新建文件')
          }
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => {}
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {}
        },
        {
          label: '另存为',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {}
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', accelerator: 'CmdOrCtrl+Z' },
        { role: 'redo', accelerator: 'CmdOrCtrl+Shift+Z' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload()
            }
          }
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          // 或 accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools()
            }
          }
        },
        {
          label: '全屏',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen())
            }
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// ========== 4. 快捷键格式详解 ==========
// 修饰符（Modifier keys）:
//   Command (或 Cmd)      - macOS Command 键
//   Control (或 Ctrl)     - Control 键
//   CommandOrControl      - macOS 上是 Cmd，其他是 Ctrl（推荐跨平台）
//   Alt                   - Alt 键
//   Option                - 同 Alt（macOS 叫法）
//   Shift                 - Shift 键
//   Super                 - Windows 键 / macOS Command 键
//
// 功能键:
//   F1 - F24              - 功能键
//   Space                 - 空格键
//   Enter / Return        - 回车键
//   Backspace             - 退格键
//   Delete                - 删除键
//   Escape / Esc          - 退出键
//   Tab                   - 制表键
//
// 方向键:
//   Up, Down, Left, Right
//   Home, End, PageUp, PageDown
//
// 其他:
//   PrintScreen, ScrollLock, Pause
//   Insert
//   MediaPlayPause, MediaNextTrack, MediaPreviousTrack, MediaStop
//   VolumeUp, VolumeDown, VolumeMute

// 示例组合:
const shortcutExamples = [
  'CmdOrCtrl+A',
  'CmdOrCtrl+Shift+P',
  'Alt+Tab',
  'CmdOrCtrl+Shift+Alt+M',
  'F5',
  'Shift+F10',
  'Ctrl+Alt+Delete' // 注意：系统快捷键可能无法注册
]

// ========== 5. 渲染进程监听键盘事件 ==========
// 渲染进程可以用普通的 Web API 监听键盘事件
// 但全局快捷键必须通过主进程注册

// renderer.js 中的键盘监听
// document.addEventListener('keydown', (e) => {
//   // Ctrl+S
//   if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//     e.preventDefault()
//     console.log('保存')
//   }
//
//   // F5 刷新
//   if (e.key === 'F5') {
//     e.preventDefault()
//     location.reload()
//   }
// })

// ========== 6. 通过 IPC 动态注册快捷键 ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('shortcutAPI', {
//   register: (accelerator, actionId) =>
//     ipcRenderer.invoke('shortcut:register', accelerator, actionId),
//   unregister: (accelerator) =>
//     ipcRenderer.invoke('shortcut:unregister', accelerator),
//   onTrigger: (callback) =>
//     ipcRenderer.on('shortcut:trigger', (_event, actionId) => callback(actionId))
// })

// main.js 实现
// const shortcutHandlers = new Map()
//
// ipcMain.handle('shortcut:register', (_event, accelerator, actionId) => {
//   const success = globalShortcut.register(accelerator, () => {
//     // 触发时通知渲染进程
//     _event.sender.send('shortcut:trigger', actionId)
//   })
//   if (success) {
//     shortcutHandlers.set(accelerator, actionId)
//   }
//   return success
// })
//
// ipcMain.handle('shortcut:unregister', (_event, accelerator) => {
//   globalShortcut.unregister(accelerator)
//   shortcutHandlers.delete(accelerator)
//   return true
// })

// ========== 7. 快捷键冲突处理 ==========
function safeRegister(accelerator, callback) {
  // 先检查是否已被注册
  if (globalShortcut.isRegistered(accelerator)) {
    console.warn(\`快捷键 \${accelerator} 已被占用\`)
    return false
  }

  const success = globalShortcut.register(accelerator, callback)
  if (!success) {
    console.error(\`注册快捷键失败: \${accelerator}\`)
  }
  return success
}

// ========== 8. 应用启动时初始化 ==========
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })
  mainWindow.loadFile('index.html')

  // 注册全局快捷键
  registerGlobalShortcuts()

  // 创建菜单（菜单内的快捷键会自动生效）
  createMenuWithShortcuts()
})

// 应用失焦时（可选，看需求决定是否注销）
// app.on('browser-window-blur', () => {
//   unregisterShortcuts()
// })
//
// app.on('browser-window-focus', () => {
//   registerGlobalShortcuts()
// })`),Bl=()=>Promise.resolve(`// ========== 1. 原生 autoUpdater (基础) main.js ==========
const { app, autoUpdater, dialog } = require('electron')

// 配置更新服务器地址
// 服务器需要返回正确格式的更新元数据
const updateServer = 'https://your-update-server.com/updates/latest'

autoUpdater.setFeedURL({
  url: updateServer
})

// 检查更新
function checkForUpdates() {
  autoUpdater.checkForUpdates()
}

// ========== 2. autoUpdater 事件 ==========
// 正在检查更新
autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...')
})

// 发现新版本
autoUpdater.on('update-available', (info) => {
  console.log('发现新版本:', info.version)
  console.log('发布日期:', info.releaseDate)
  // 可以通知用户
})

// 当前已是最新版本
autoUpdater.on('update-not-available', (info) => {
  console.log('当前已是最新版本')
})

// 正在下载更新
autoUpdater.on('update-downloading', (event) => {
  console.log('正在下载更新...')
  console.log('进度:', event.percent)
})

// 更新下载完成
autoUpdater.on('update-downloaded', (event) => {
  console.log('更新已下载完成')
  console.log('版本:', event.version)

  // 询问用户是否立即更新
  const dialogOpts = {
    type: 'info',
    buttons: ['立即重启', '稍后'],
    title: '应用更新',
    message: \`新版本 \${event.version} 已下载完成\`,
    detail: '点击"立即重启"安装更新'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      // 退出并安装更新
      autoUpdater.quitAndInstall()
    }
  })
})

// 更新出错
autoUpdater.on('error', (error) => {
  console.error('更新出错:', error.message)
})

// ========== 3. 使用 electron-updater (推荐, electron-builder 内置) ==========
// 安装: npm install electron-updater
// const { autoUpdater } = require('electron-updater')
//
// autoUpdater.checkForUpdatesAndNotify()
//
// autoUpdater.on('update-available', (info) => {
//   console.log('发现更新:', info.version)
// })
//
// autoUpdater.on('download-progress', (progress) => {
//   console.log(\`下载进度: \${progress.percent}%\`)
//   console.log(\`速度: \${progress.bytesPerSecond} B/s\`)
// })
//
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// ========== 4. 更新服务器配置 (electron-builder) ==========
// package.json 中的 build 配置
// {
//   "build": {
//     "appId": "com.myapp.id",
//     "productName": "MyApp",
//     "publish": {
//       "provider": "generic",
//       "url": "https://your-server.com/updates"
//     },
//     "mac": {
//       "category": "public.app-category.productivity"
//     },
//     "win": {
//       "target": "nsis"
//     },
//     "linux": {
//       "target": "AppImage"
//     }
//   }
// }
//
// 发布到 GitHub:
// "publish": {
//   "provider": "github",
//   "owner": "username",
//   "repo": "repo-name"
// }

// ========== 5. 通过 IPC 暴露更新状态 ==========
// main.js
const { ipcMain, BrowserWindow } = require('electron')

let mainWindow = null

function sendUpdateStatus(type, data) {
  if (mainWindow) {
    mainWindow.webContents.send('update-status', { type, data })
  }
}

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatus('checking', {})
})

autoUpdater.on('update-available', (info) => {
  sendUpdateStatus('available', { version: info.version })
})

autoUpdater.on('update-not-available', () => {
  sendUpdateStatus('not-available', {})
})

autoUpdater.on('update-downloaded', (info) => {
  sendUpdateStatus('downloaded', { version: info.version })
})

autoUpdater.on('error', (error) => {
  sendUpdateStatus('error', { message: error.message })
})

// 渲染进程触发检查更新
ipcMain.handle('update:check', () => {
  autoUpdater.checkForUpdates()
})

// 渲染进程触发安装更新
ipcMain.handle('update:install', () => {
  autoUpdater.quitAndInstall()
})

// ========== 6. preload.js ==========
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('updateAPI', {
//   checkForUpdates: () => ipcRenderer.invoke('update:check'),
//   installUpdate: () => ipcRenderer.invoke('update:install'),
//   onUpdateStatus: (callback) => {
//     ipcRenderer.on('update-status', (_event, status) => {
//       callback(status)
//     })
//   }
// })

// ========== 7. 渲染进程使用 ==========
// function setupAutoUpdate() {
//   window.updateAPI.onUpdateStatus((status) => {
//     switch (status.type) {
//       case 'checking':
//         console.log('正在检查更新...')
//         break
//       case 'available':
//         console.log('发现新版本:', status.data.version)
//         break
//       case 'not-available':
//         console.log('已是最新版本')
//         break
//       case 'downloaded':
//         console.log('更新已下载，点击安装')
//         // window.updateAPI.installUpdate()
//         break
//       case 'error':
//         console.error('更新失败:', status.data.message)
//         break
//     }
//   })
//
//   // 手动检查更新
//   // window.updateAPI.checkForUpdates()
// }

// ========== 8. 手动更新检查 ==========
function manualUpdateCheck() {
  // 启动时检查
  app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: 'preload.js',
        contextIsolation: true
      }
    })
    mainWindow.loadFile('index.html')

    // 延迟一会儿再检查（避免影响启动速度）
    setTimeout(() => {
      checkForUpdates()
    }, 3000)
  })
}

// ========== 9. 更新注意事项 ==========
// 1. macOS 需要代码签名才能启用自动更新
// 2. Windows 推荐使用代码签名证书
// 3. 更新包需要放到服务器上
// 4. 不同平台的更新格式不同:
//    - macOS: .dmg, .zip
//    - Windows: .exe (NSIS), nupkg (Squirrel)
//    - Linux: AppImage, deb, rpm
// 5. 自动更新需要在打包后的应用中测试
// 6. 提供手动下载入口作为备选

// ========== 10. 版本号比较 ==========
// semver 示例: 1.2.3 < 1.2.4 < 1.3.0 < 2.0.0
// 更新服务器返回的版本号必须符合 semver 规范

// 简单版本比较
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number)
  const parts2 = v2.split('.').map(Number)
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0
    const p2 = parts2[i] || 0
    if (p1 > p2) return 1
    if (p1 < p2) return -1
  }
  return 0
}`),Tl=()=>Promise.resolve(`// ========== 1. electron-builder package.json 配置 ==========
// 安装: npm install electron-builder --save-dev
//
// package.json:
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mw"
  },
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.company.myapp",
    "productName": "My App",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "index.html",
      "renderer.js",
      "assets/**"
    ],
    "extraResources": [
      {
        "from": "extra/",
        "to": "extra/"
      }
    ],
    "asar": true,
    "asarUnpack": [
      "assets/icons/*"
    ]
  }
}

// ========== 2. macOS 打包配置 ==========
// build.mac:
// {
//   "target": [
//     {
//       "target": "dmg",
//       "arch": ["x64", "arm64"]
//     },
//     {
//       "target": "zip",
//       "arch": ["x64", "arm64"]
//     }
//   ],
//   "category": "public.app-category.productivity",
//   "icon": "build/icon.icns",
//   "hardenedRuntime": true,
//   "gatekeeperAssess": false,
//   "entitlements": "build/entitlements.mac.plist",
//   "entitlementsInherit": "build/entitlements.mac.plist"
// }
//
// entitlements.mac.plist 内容:
// <?xml version="1.0" encoding="UTF-8"?>
// <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
//   "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
// <plist version="1.0">
// <dict>
//   <key>com.apple.security.app-sandbox</key>
//   <false/>
//   <key>com.apple.security.network.client</key>
//   <true/>
// </dict>
// </plist>

// ========== 3. Windows 打包配置 ==========
// build.win:
// {
//   "target": [
//     {
//       "target": "nsis",
//       "arch": ["x64"]
//     },
//     {
//       "target": "portable",
//       "arch": ["x64"]
//     }
//   ],
//   "icon": "build/icon.ico",
//   "artifactName": "\${productName}-\${version}-setup.\${ext}"
// }
//
// build.nsis:
// {
//   "oneClick": false,
//   "allowToChangeInstallationDirectory": true,
//   "installerIcon": "build/icon.ico",
//   "uninstallerIcon": "build/icon.ico",
//   "installerHeaderIcon": "build/icon.ico",
//   "createDesktopShortcut": true,
//   "createStartMenuShortcut": true,
//   "shortcutName": "My App"
// }

// ========== 4. Linux 打包配置 ==========
// build.linux:
// {
//   "target": [
//     { "target": "AppImage", "arch": ["x64"] },
//     { "target": "deb", "arch": ["x64"] },
//     { "target": "rpm", "arch": ["x64"] }
//   ],
//   "icon": "build/icons",
//   "category": "Utility",
//   "maintainer": "dev@company.com"
// }
//
// build.deb:
// {
//   "depends": ["libgtk-3-0", "libnotify4", "libnss3"]
// }

// ========== 5. 代码签名配置 ==========
// macOS 签名 (需要 Apple Developer 账号):
//
// 环境变量:
//   CSC_LINK=证书文件路径或名称
//   CSC_KEY_PASSWORD=证书密码
//   APPLE_ID=Apple ID 邮箱
//   APPLE_APP_SPECIFIC_PASSWORD=应用专用密码
//   APPLE_TEAM_ID=Team ID
//
// build.mac 中:
// {
//   "identity": "Developer ID Application: Your Name (TEAMID)",
//   "notarize": true
// }

// Windows 签名:
//
// 环境变量:
//   CSC_LINK=pfx 证书路径
//   CSC_KEY_PASSWORD=证书密码
//
// build.win 中:
// {
//   "certificateFile": "certificate.pfx",
//   "certificatePassword": "password"
// }

// ========== 6. 自动更新发布配置 ==========
// build.publish:
// {
//   "provider": "generic",
//   "url": "https://your-server.com/updates",
//   "channel": "latest"
// }
//
// 或发布到 GitHub:
// {
//   "provider": "github",
//   "owner": "username",
//   "repo": "repo-name",
//   "private": false
// }
//
// 环境变量 GH_TOKEN=你的 GitHub token

// ========== 7. 应用图标 ==========
// 需要准备不同尺寸的图标:
//
// macOS:
//   icon.icns (包含 16x16 到 512x512@2x)
//
// Windows:
//   icon.ico (包含 16x16 到 256x256)
//
// Linux:
//   icons/ (目录，各尺寸 png)
//
// 推荐使用 electron-icon-builder 生成:
//   npx electron-icon-builder --input=./icon.png --output=./build/icons

// ========== 8. 环境变量配置 ==========
// .env 文件示例:
//
// # 通用
// ELECTRON_CACHE=~/.cache/electron
// ELECTRON_BUILDER_CACHE=~/.cache/electron-builder
//
// # macOS 签名
// CSC_LINK=cert.p12
// CSC_KEY_PASSWORD=your-password
// APPLE_ID=your@apple.com
// APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
// APPLE_TEAM_ID=TEAMID12345
//
// # Windows 签名
// CSC_LINK=certificate.pfx
// CSC_KEY_PASSWORD=your-password
//
// # GitHub 发布
// GH_TOKEN=ghp_xxxxxxxxxxxxxxxxx

// ========== 9. CI/CD 配置 (GitHub Actions 示例) ==========
// .github/workflows/build.yml:
//
// name: Build Electron App
//
// on:
//   push:
//     tags:
//       - 'v*'
//
// jobs:
//   build:
//     runs-on: \${{ matrix.os }}
//     strategy:
//       matrix:
//         os: [macos-latest, windows-latest, ubuntu-latest]
//
//     steps:
//       - uses: actions/checkout@v4
//
//       - uses: actions/setup-node@v4
//         with:
//           node-version: '20'
//
//       - name: Install dependencies
//         run: npm ci
//
//       - name: Build
//         env:
//           GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
//           CSC_LINK: \${{ secrets.CSC_LINK }}
//           CSC_KEY_PASSWORD: \${{ secrets.CSC_KEY_PASSWORD }}
//         run: npm run build
//
//       - name: Upload artifacts
//         uses: actions/upload-artifact@v4
//         with:
//           name: \${{ runner.os }}-build
//           path: dist/

// ========== 10. 打包前检查清单 ==========
// [ ] 更新版本号 (package.json)
// [ ] 准备好应用图标 (icns, ico, png)
// [ ] 配置代码签名证书
// [ ] 测试应用在各平台运行正常
// [ ] 配置自动更新服务器 (如果需要)
// [ ] 检查 package.json 中 files 字段是否包含所有必要文件
// [ ] 确认 asar 打包不会导致问题（原生模块可能需要 asarUnpack）
// [ ] 编写更新日志 (CHANGELOG.md)

// ========== 11. 常见打包问题 ==========
// 1. 原生模块需要重新编译:
//    npm install electron-rebuild --save-dev
//    npx electron-rebuild
//
// 2. 路径问题:
//    使用 __dirname 相对于当前文件
//    使用 app.getAppPath() 获取应用根目录
//    生产环境路径可能在 asar 包内
//
// 3. 读写文件:
//    不要写入应用安装目录（可能只读）
//    使用 app.getPath('userData') 存储用户数据
//
// 4. 白屏问题:
//    检查路径是否正确
//    打开开发者工具调试
//    用 win.webContents.openDevTools()

// ========== 12. electron-forge 简介 (替代方案) ==========
// electron-forge 是另一个打包工具，封装了 electron-packager
//
// 初始化:
//   npm create electron-app@latest my-app -- --template=vite
//
// 配置在 forge.config.js 中:
// module.exports = {
//   packagerConfig: {},
//   makers: [
//     { name: '@electron-forge/maker-squirrel', config: {} },
//     { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
//     { name: '@electron-forge/maker-deb', config: {} },
//     { name: '@electron-forge/maker-rpm', config: {} }
//   ]
// }`),Ul=()=>Promise.resolve(`// ========== 1. 安全配置基线 main.js ==========
const { app, BrowserWindow, session } = require('electron')
const path = require('path')

function createSecureWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // 开启上下文隔离（默认 true，显式声明更安全）
      contextIsolation: true,
      // 关闭 Node.js 集成（默认 false，必须关闭）
      nodeIntegration: false,
      // 启用沙箱（进一步限制渲染进程）
      sandbox: true,
      // 指定预加载脚本
      preload: path.join(__dirname, 'preload.js'),
      // 开启 Web 安全（默认 true）
      webSecurity: true,
      // 禁止使用 remote 模块
      enableRemoteModule: false,
      // 禁用 <webview> 标签（如不需要）
      webviewTag: false,
      // 限制新窗口
      nativeWindowOpen: true
    }
  })

  // 加载本地文件
  win.loadFile('index.html')

  return win
}

// ========== 2. 内容安全策略 (CSP) ==========
// 方式一: 在 HTML 的 <meta> 标签中设置
// index.html:
// <head>
//   <meta
//     http-equiv="Content-Security-Policy"
//     content="
//       default-src 'self';
//       script-src 'self';
//       style-src 'self' 'unsafe-inline';
//       img-src 'self' data:;
//       connect-src 'self' https://api.example.com;
//       font-src 'self';
//       object-src 'none';
//       base-uri 'self';
//       form-action 'self';
//       frame-ancestors 'none';
//     "
//   >
// </head>

// 方式二: 在主进程中通过 session 设置
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
        ]
      }
    })
  })
})

// 常用 CSP 指令:
// default-src    - 默认策略
// script-src     - 脚本来源
// style-src      - 样式来源
// img-src        - 图片来源
// connect-src    - 网络请求 (XHR, WebSocket, fetch)
// font-src       - 字体来源
// object-src     - 插件来源 (通常设为 'none')
// media-src      - 音视频来源
// frame-src      - iframe 来源
// frame-ancestors - 可嵌入的父页面 (通常设为 'none')

// ========== 3. 预加载脚本安全实践 ==========
// preload.js - 正确示例
const { contextBridge, ipcRenderer } = require('electron')

// 只暴露必要的 API，不要暴露整个 ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  // 白名单通道，每个通道单独暴露
  getUserSettings: () => ipcRenderer.invoke('settings:get'),
  saveUserSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  // 事件监听也要有对应的移除方法
  onNotification: (callback) => {
    ipcRenderer.on('notification', (_event, data) => callback(data))
  },
  removeNotificationListener: () => {
    ipcRenderer.removeAllListeners('notification')
  }
})

// ❌ 错误做法: 直接暴露 ipcRenderer
// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

// ❌ 错误做法: 暴露任意通道的发送方法
// send: (channel, data) => ipcRenderer.send(channel, data)

// ========== 4. IPC 安全验证 ==========
// main.js - IPC 处理时进行参数验证和权限检查

const fs = require('fs/promises')

// 白名单通道
const ALLOWED_CHANNELS = new Set([
  'settings:get',
  'settings:save',
  'file:read',
  'file:write'
])

// 参数验证
function validateSettings(settings) {
  if (!settings || typeof settings !== 'object') return false
  if (typeof settings.theme !== 'string') return false
  if (typeof settings.autoSave !== 'boolean') return false
  return true
}

// 路径安全检查（防止路径穿越）
function safeUserDataPath(fileName) {
  const userData = app.getPath('userData')
  const resolved = path.resolve(userData, fileName)
  if (!resolved.startsWith(userData)) {
    throw new Error('路径越界: 不允许访问用户数据目录外的文件')
  }
  return resolved
}

// IPC 处理
ipcMain.handle('settings:save', async (event, settings) => {
  // 验证输入
  if (!validateSettings(settings)) {
    throw new Error('无效的设置数据')
  }

  // 安全写入
  const filePath = safeUserDataPath('settings.json')
  await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8')
  return { success: true }
})

// ========== 5. 权限请求处理 ==========
// 控制渲染进程的权限请求
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      // permission 可能值:
      // 'media' (摄像头/麦克风), 'geolocation', 'notifications',
      // 'midiSysex', 'pointerLock', 'fullscreen', 'openExternal'

      const url = webContents.getURL()

      // 只允许本地页面请求通知权限
      if (permission === 'notifications' && url.startsWith('file://')) {
        callback(true) // 允许
        return
      }

      // 默认拒绝
      callback(false)
    }
  )
})

// ========== 6. 新窗口创建拦截 ==========
function createWindow() {
  const win = new BrowserWindow({...})

  // 拦截新窗口创建
  win.webContents.setWindowOpenHandler(({ url }) => {
    // 只允许打开特定域名
    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.origin === 'https://trusted.com') {
        return { action: 'allow' }
      }
    } catch {}

    // 在默认浏览器中打开外部链接
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 拦截导航
  win.webContents.on('will-navigate', (event, url) => {
    // 阻止跳转到不可信的域名
    if (!url.startsWith('file://') && !url.startsWith('https://trusted.com')) {
      event.preventDefault()
    }
  })
}

// ========== 7. 加载远程内容的安全 ==========
// 如果必须加载远程网页，使用 <webview> 或 BrowserView
// 但要严格限制权限

// webview 示例 (不推荐，尽量避免):
// <webview
//   src="https://example.com"
//   nodeintegration="false"
//   contextisolation="true"
//   sandbox="true"
//   preload="webview-preload.js"
// ></webview>

// ========== 8. 依赖安全审计 ==========
// 定期运行:
//   npm audit
//   npm audit fix
//   npm outdated
//
// 锁定依赖版本:
//   package-lock.json 或 pnpm-lock.yaml
//   CI 中使用 npm ci 或 pnpm install --frozen-lockfile
//
// 工具:
//   snyk, dependabot, renovate

// ========== 9. 代码混淆与反调试（可选） ==========
// 注意: 这些不是真正的安全，只是增加逆向难度
//
// 代码混淆:
//   javascript-obfuscator, bytenode
//
// 反调试:
//   检测 DevTools 打开（但可以被绕过）

// ========== 10. 安全检查清单 ==========
// [ ] contextIsolation: true
// [ ] nodeIntegration: false
// [ ] 使用 contextBridge 暴露有限 API
// [ ] 设置合理的 CSP
// [ ] webSecurity: true (生产环境)
// [ ] IPC 参数验证
// [ ] 路径穿越防护
// [ ] 权限请求处理
// [ ] 依赖定期审计
// [ ] 代码签名 (macOS/Windows)
// [ ] 自动更新签名验证
// [ ] 禁用不必要的功能 (webview, remote 等)

// ========== 11. Electron 安全官方建议 ==========
// 1. 只加载可信内容
// 2. 禁用 Node.js 集成
// 3. 启用上下文隔离
// 4. 启用进程沙箱
// 5. 设置内容安全策略
// 6. 不要禁用 webSecurity
// 7. 验证所有 IPC 消息
// 8. 使用 secure 变量处理 cookie
// 9. 限制新窗口和导航
// 10. 使用最新版 Electron`),Nl=()=>Promise.resolve(`// ========== 1. 启动性能优化 main.js ==========
const { app, BrowserWindow } = require('electron')
const path = require('path')

// 优化一: 尽早创建窗口（利用 ready 之前的时间）
// 但要等 app.whenReady() 之后
let mainWindow = null

app.whenReady().then(() => {
  createMainWindow()
})

// 优化二: 使用 ready-to-show 避免白屏闪烁
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // 先不显示
    backgroundColor: '#f0f0f0', // 设置背景色，减少视觉闪烁
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      // 优化: 启用 V8 代码缓存
      // 默认已启用
    }
  })

  // 加载页面
  mainWindow.loadFile('index.html')

  // DOM 准备好后再显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  return mainWindow
}

// ========== 2. V8 内存调优 ==========
// 启动参数调整 V8 堆内存（在 package.json 或主进程中设置）
// 注意: 应在 app 就绪前设置
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')

// 其他有用的 Chromium 开关:
// 禁用硬件加速（如果有渲染问题）
// app.disableHardwareAcceleration()
//
// 禁用 GPU 进程
// app.commandLine.appendSwitch('disable-gpu')
//
// 启用高 DPI 支持
// app.commandLine.appendSwitch('high-dpi-support', '1')

// ========== 3. 内存监控 ==========
function monitorMemory() {
  // 主进程内存
  const mem = process.memoryUsage()
  console.log('主进程内存:')
  console.log(\`  RSS: \${Math.round(mem.rss / 1024 / 1024)} MB\`)
  console.log(\`  堆总量: \${Math.round(mem.heapTotal / 1024 / 1024)} MB\`)
  console.log(\`  堆已用: \${Math.round(mem.heapUsed / 1024 / 1024)} MB\`)

  // 渲染进程内存（通过 webContents）
  // mainWindow.webContents.getProcessMemoryInfo().then(info => {
  //   console.log('渲染进程内存:', info)
  // })
}

// 定时监控
setInterval(monitorMemory, 30000) // 每 30 秒

// ========== 4. 渲染进程性能优化 ==========
// 4.1 懒加载模块
// renderer.js:
// async function loadHeavyModule() {
//   // 动态 import，首屏不加载
//   const heavyModule = await import('./heavy-module.js')
//   heavyModule.doWork()
// }

// 4.2 虚拟列表（大数据量表格/列表）
// 使用虚拟滚动，只渲染可视区域的 DOM
// 库: vue-virtual-scroller, react-window

// 4.3 减少重排重绘
// - 用 transform 代替 top/left 动画
// - 批量修改 DOM
// - 使用 will-change 提示浏览器

// ========== 5. IPC 性能优化 ==========
// 5.1 避免频繁的小消息
// ❌ 不好: 每次按键都发 IPC
// ✅ 好: 使用防抖/节流

// 5.2 大文件不要通过 IPC 传整个内容
// ❌ 不好: ipcRenderer.invoke('read-file') 返回整个文件内容
// ✅ 好: 传递文件路径，渲染进程通过其他方式（如 fetch file://）读取
//       或用流方式分片传输

// 5.3 批量操作合并
// 把多次 IPC 合并为一次
// ipcMain.handle('batch-ops', async (_event, operations) => {
//   const results = []
//   for (const op of operations) {
//     results.push(await executeOp(op))
//   }
//   return results
// })

// ========== 6. 窗口管理优化 ==========
// 6.1 及时释放窗口引用，防止内存泄漏
const windowMap = new Map()

function createWindow(id) {
  const win = new BrowserWindow({...})
  windowMap.set(id, win)

  win.on('closed', () => {
    windowMap.delete(id) // 重要: 移除引用
  })

  return win
}

// 6.2 隐藏非活动窗口而不是销毁
// （如果用户会频繁切换）
function hideWindow(win) {
  win.hide() // 隐藏，不销毁，下次显示更快
}

function showWindow(win) {
  win.show()
}

// 6.3 限制渲染进程数量
// 每个新窗口约占用 30-50MB 内存
// 考虑复用窗口或使用单窗口 + 多 Tab

// ========== 7. 主进程性能优化 ==========
// 7.1 避免主进程阻塞
// CPU 密集任务放到:
// - Utility 进程 (UtilityProcess)
// - Worker 线程 (worker_threads)
// - 子进程 (child_process)

// 7.2 使用 Utility 进程 (Electron 14+)
// const { UtilityProcess } = require('electron')
//
// function runHeavyTask(data) {
//   const child = new UtilityProcess()
//   child.start({
//     scriptPath: path.join(__dirname, 'heavy-task.js'),
//     args: [JSON.stringify(data)]
//   })
//
//   child.on('message', (result) => {
//     console.log('计算结果:', result)
//   })
// }

// 7.3 使用 Node.js Worker 线程
// const { Worker } = require('worker_threads')
//
// function runInWorker(scriptPath, data) {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(scriptPath, { workerData: data })
//     worker.on('message', resolve)
//     worker.on('error', reject)
//     worker.on('exit', (code) => {
//       if (code !== 0) reject(new Error(\`Worker 退出码: \${code}\`))
//     })
//   })
// }

// ========== 8. 性能分析工具 ==========
// 8.1 Chrome DevTools (渲染进程)
// - Performance 面板: 分析运行时性能
// - Memory 面板: 分析内存泄漏
// - Lighthouse: 网页性能审计

// 8.2 主进程调试
// 启动时加 --inspect:
//   electron --inspect=5858 .
// 然后在 chrome://inspect 中调试

// 8.3 进程内存
// 任务管理器 (开发中)
// 或: process.memoryUsage()

// 8.4 启动时间分析
// 打开 DevTools Performance 面板，勾选 Screenshots，重新加载

// ========== 9. 打包优化 ==========
// 9.1 asar 打包（默认开启，加速文件读取）
// 9.2 代码分割 (Webpack/Vite/Rollup)
// 9.3 Tree shaking
// 9.4 图片资源压缩
// 9.5 只打包需要的文件 (package.json build.files)

// ========== 10. 性能优化检查清单 ==========
// [ ] 显示骨架屏/背景色避免白屏
// [ ] 首屏只加载必要代码
// [ ] 懒加载非关键模块
// [ ] 大列表用虚拟滚动
// [ ] 避免主进程执行 CPU 密集任务
// [ ] 及时释放窗口引用
// [ ] IPC 消息防抖/节流
// [ ] 大文件不通过 IPC 传输
// [ ] 定期检查内存泄漏
// [ ] 使用最新版 Electron 和 Chromium`),Ll=()=>Promise.resolve(`// ========== 1. electron-store (配置存储) ==========
// 安装: npm install electron-store
// 特点: 简单 JSON 文件存储，适合配置项

// 方式一: 主进程中使用
// main.js
const Store = require('electron-store')

// 初始化 store
const store = new Store({
  // 配置项
  name: 'config',        // 文件名 (默认 config)
  defaults: {            // 默认值
    window: {
      width: 800,
      height: 600
    },
    theme: 'light',
    autoSave: true,
    lastOpenFiles: []
  },
  // 加密 (可选，敏感数据)
  // encryptionKey: 'your-secret-key'
})

// 读取
function getSettings() {
  const theme = store.get('theme')
  const windowSize = store.get('window')
  const isAutoSave = store.get('autoSave', true) // 带默认值
  return { theme, windowSize, isAutoSave }
}

// 写入
function saveSettings(settings) {
  store.set('theme', settings.theme)
  store.set('window', settings.window)
  // 或批量设置
  // store.set({ theme: 'dark', autoSave: false })
}

// 删除
function resetSettings() {
  store.delete('theme')
  // 清空所有
  // store.clear()
}

// 监听变化
store.onDidChange('theme', (newValue, oldValue) => {
  console.log(\`主题从 \${oldValue} 变为 \${newValue}\`)
})

// 文件位置
console.log('配置文件路径:', store.path)

// ========== 2. IndexedDB (渲染进程，结构化数据) ==========
// renderer.js - 浏览器标准 API，适合大量结构化数据

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1)

    // 数据库升级（首次或版本变更）
    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // 创建对象仓库（类似表）
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
        // 创建索引
        notesStore.createIndex('title', 'title', { unique: false })
        notesStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

// 添加/更新数据
async function saveNote(db, note) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readwrite')
    const store = transaction.objectStore('notes')
    const request = store.put(note) // put = insert or update
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 查询数据
async function getAllNotes(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readonly')
    const store = transaction.objectStore('notes')
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 按索引查询
async function getNoteByTitle(db, title) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readonly')
    const store = transaction.objectStore('notes')
    const index = store.index('title')
    const request = index.get(title)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// 删除数据
async function deleteNote(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['notes'], 'readwrite')
    const store = transaction.objectStore('notes')
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ========== 3. localStorage (简单键值对) ==========
// renderer.js - 同步 API，适合小数据量

// 存储
localStorage.setItem('username', 'john')
localStorage.setItem('lastVisit', Date.now().toString())

// 读取
const username = localStorage.getItem('username')
const lastVisit = localStorage.getItem('lastVisit')

// 删除
localStorage.removeItem('lastVisit')

// 清空
// localStorage.clear()

// 注意事项:
// - 容量限制约 5MB
// - 同步 API，大量数据会阻塞
// - 只存储字符串（对象需 JSON.stringify）

// ========== 4. SQLite (关系型数据) ==========
// 方案 A: better-sqlite3 (同步 API，性能好，主进程使用)
// 安装: npm install better-sqlite3
//
// main.js:
// const Database = require('better-sqlite3')
// const path = require('path')
//
// function initDatabase() {
//   const dbPath = path.join(app.getPath('userData'), 'app.db')
//   const db = new Database(dbPath)
//
//   // 创建表
//   db.exec(\`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       email TEXT UNIQUE,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   \`)
//
//   return db
// }
//
// function addUser(db, name, email) {
//   const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
//   const result = stmt.run(name, email)
//   return result.lastInsertRowid
// }
//
// function getUser(db, id) {
//   const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
//   return stmt.get(id)
// }
//
// function listUsers(db) {
//   const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC')
//   return stmt.all()
// }

// 方案 B: sql.js (纯 JS，不需要原生编译，渲染进程也能用)
// 安装: npm install sql.js
// 适合: 不需要很高性能，避免原生模块编译问题

// ========== 5. 主进程文件存储 (Node.js fs) ==========
// main.js - 完全控制，适合自定义格式
const fs = require('fs/promises')

async function saveDataToFile(filename, data) {
  const userData = app.getPath('userData')
  const filePath = path.join(userData, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

async function loadDataFromFile(filename) {
  const userData = app.getPath('userData')
  const filePath = path.join(userData, filename)
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null // 文件不存在
    }
    throw error
  }
}

// ========== 6. 存储方案对比 ==========
//
// | 方案          | 位置       | 容量    | 适用场景               | 同步/异步 |
// |---------------|------------|---------|------------------------|-----------|
// | electron-store| 主进程     | 无限制  | 配置项、小型数据       | 同步      |
// | IndexedDB     | 渲染进程   | 很大    | 大量结构化数据         | 异步      |
// | localStorage  | 渲染进程   | ~5MB    | 简单键值对、临时数据   | 同步      |
// | SQLite        | 主进程     | 很大    | 复杂查询、关系型数据   | 同步/异步 |
// | fs 直接读写   | 主进程     | 无限制  | 自定义格式、大文件     | 异步      |
// | sessionStorage| 渲染进程   | ~5MB    | 会话级临时数据         | 同步      |

// ========== 7. 通过 IPC 暴露存储 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('storageAPI', {
//   // 配置存储
//   getConfig: (key) => ipcRenderer.invoke('config:get', key),
//   setConfig: (key, value) => ipcRenderer.invoke('config:set', key, value),
//
//   // 数据库操作
//   addItem: (item) => ipcRenderer.invoke('db:add', item),
//   listItems: () => ipcRenderer.invoke('db:list'),
//   deleteItem: (id) => ipcRenderer.invoke('db:delete', id)
// })

// main.js
// ipcMain.handle('config:get', (_event, key) => store.get(key))
// ipcMain.handle('config:set', (_event, key, value) => store.set(key, value))

// ========== 8. 数据存储最佳实践 ==========
// 1. 用户数据存在 app.getPath('userData') 目录
// 2. 不要存在应用安装目录（可能只读）
// 3. 重要数据定期备份
// 4. 敏感数据加密存储
// 5. 大文件用文件系统，不要塞 JSON
// 6. JSON 存储不适合频繁写入（每次全量读写）
// 7. 数据库迁移（Schema 变更时）
// 8. 提供导出/导入功能`),$l=()=>Promise.resolve(`// ========== 1. 多窗口管理器 main.js ==========
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// 窗口引用管理（使用 Map，不要用全局变量）
const windowManager = {
  windows: new Map(), // id -> window
  nextId: 1,

  // 创建窗口
  create(type, options = {}) {
    const id = \`\${type}-\${this.nextId++}\`

    const win = new BrowserWindow({
      width: options.width || 800,
      height: options.height || 600,
      title: options.title || '新窗口',
      x: options.x,
      y: options.y,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true
      },
      ...options.windowOptions
    })

    // 存储窗口元数据
    win.data = {
      id,
      type,
      createdAt: Date.now()
    }

    // 加载对应页面
    const pageMap = {
      main: 'index.html',
      editor: 'editor.html',
      preview: 'preview.html',
      settings: 'settings.html'
    }
    win.loadFile(pageMap[type] || 'index.html')

    // 窗口关闭时移除引用
    win.on('closed', () => {
      this.windows.delete(id)
      console.log(\`窗口 \${id} 已关闭，剩余 \${this.windows.size} 个窗口\`)
    })

    this.windows.set(id, win)
    console.log(\`创建窗口 \${id}，共 \${this.windows.size} 个窗口\`)

    return { id, win }
  },

  // 获取窗口
  get(id) {
    return this.windows.get(id)
  },

  // 获取所有窗口
  getAll() {
    return Array.from(this.windows.values())
  },

  // 按类型获取窗口
  getByType(type) {
    return Array.from(this.windows.values()).filter(w => w.data.type === type)
  },

  // 关闭所有窗口
  closeAll() {
    this.getAll().forEach(win => win.close())
  },

  // 广播消息给所有窗口
  broadcast(channel, data, excludeId = null) {
    this.windows.forEach((win, id) => {
      if (id !== excludeId) {
        win.webContents.send(channel, data)
      }
    })
  }
}

// ========== 2. 窗口间通信（通过主进程中转） ==========
// 模式一: 广播消息
ipcMain.handle('window:broadcast', (event, { channel, data }) => {
  const senderWin = BrowserWindow.fromWebContents(event.sender)
  const senderId = senderWin?.data?.id
  windowManager.broadcast(channel, data, senderId)
  return { success: true }
})

// 模式二: 发送给指定窗口
ipcMain.handle('window:sendTo', (event, { targetId, channel, data }) => {
  const targetWin = windowManager.get(targetId)
  if (targetWin) {
    targetWin.webContents.send(channel, {
      from: event.sender.data?.id,
      data
    })
    return { success: true }
  }
  return { success: false, error: '目标窗口不存在' }
})

// 模式三: 获取窗口列表
ipcMain.handle('window:list', () => {
  return windowManager.getAll().map(win => ({
    id: win.data.id,
    type: win.data.type,
    title: win.getTitle(),
    isFocused: win.isFocused()
  }))
})

// ========== 3. 创建子窗口示例 ==========
// 方式一: 从主进程创建
ipcMain.handle('window:create', (event, { type, options }) => {
  const { id, win } = windowManager.create(type, options)
  return { id }
})

// 方式二: window.open (渲染进程)
// 注意: 需要 nativeWindowOpen: true
// renderer.js:
// const newWindow = window.open('editor.html', '_blank', 'width=600,height=400')

// ========== 4. 预加载脚本暴露窗口管理 API ==========
// preload.js
// const { contextBridge, ipcRenderer } = require('electron')
//
// contextBridge.exposeInMainWorld('windowAPI', {
//   // 创建新窗口
//   createWindow: (type, options) =>
//     ipcRenderer.invoke('window:create', { type, options }),
//
//   // 获取窗口列表
//   listWindows: () => ipcRenderer.invoke('window:list'),
//
//   // 广播消息
//   broadcast: (channel, data) =>
//     ipcRenderer.invoke('window:broadcast', { channel, data }),
//
//   // 发送给指定窗口
//   sendTo: (targetId, channel, data) =>
//     ipcRenderer.invoke('window:sendTo', { targetId, channel, data }),
//
//   // 接收消息
//   onWindowMessage: (channel, callback) => {
//     ipcRenderer.on(channel, (_event, data) => callback(data))
//   },
//
//   // 关闭当前窗口
//   close: () => window.close(),
//
//   // 最小化
//   minimize: () => ipcRenderer.invoke('window:minimize'),
//
//   // 最大化/还原
//   toggleMaximize: () => ipcRenderer.invoke('window:toggle-maximize')
// })

// main.js 对应实现
// ipcMain.handle('window:minimize', (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   win?.minimize()
// })
//
// ipcMain.handle('window:toggle-maximize', (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   if (!win) return
//   if (win.isMaximized()) {
//     win.unmaximize()
//   } else {
//     win.maximize()
//   }
// })

// ========== 5. 渲染进程使用示例 ==========
// async function openEditor() {
//   const result = await window.windowAPI.createWindow('editor', {
//     title: '编辑器',
//     width: 1000,
//     height: 700
//   })
//   console.log('新窗口 ID:', result.id)
// }
//
// async function sendMessageToAll() {
//   await window.windowAPI.broadcast('chat-message', {
//     from: 'user1',
//     text: '大家好！'
//   })
// }
//
// // 监听消息
// window.windowAPI.onWindowMessage('chat-message', (msg) => {
//   console.log(\`收到 \${msg.from} 的消息: \${msg.text}\`)
// })

// ========== 6. 父子窗口 (BrowserWindow parent) ==========
function createChildWindow(parentWin) {
  const childWin = new BrowserWindow({
    width: 400,
    height: 300,
    parent: parentWin, // 父窗口
    modal: true,        // 模态窗口（阻塞父窗口）
    webPreferences: {
      contextIsolation: true
    }
  })
  childWin.loadFile('dialog.html')
  return childWin
}

// ========== 7. 窗口位置记忆 ==========
const Store = require('electron-store')
const store = new Store({ name: 'window-state' })

function createWindowWithState() {
  const savedState = store.get('mainWindow') || {}

  const win = new BrowserWindow({
    width: savedState.width || 1200,
    height: savedState.height || 800,
    x: savedState.x,
    y: savedState.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  })

  // 如果之前是最大化，恢复最大化
  if (savedState.isMaximized) {
    win.maximize()
  }

  win.loadFile('index.html')

  // 关闭时保存状态
  win.on('close', () => {
    if (!win.isMaximized()) {
      const [x, y] = win.getPosition()
      const [width, height] = win.getSize()
      store.set('mainWindow', { x, y, width, height, isMaximized: false })
    } else {
      store.set('mainWindow.isMaximized', true)
    }
  })

  return win
}

// ========== 8. 内存泄漏预防 ==========
// 1. 窗口关闭后一定要从 Map 中删除引用
// 2. 移除所有事件监听器
// 3. 清除定时器
// 4. 断开 IPC 连接

// 错误示例 ❌
// const windows = [] // 全局数组
// function createWin() {
//   const win = new BrowserWindow()
//   windows.push(win) // 只加不删 -> 内存泄漏
// }

// 正确示例 ✅
// const windows = new Map()
// function createWin(id) {
//   const win = new BrowserWindow()
//   windows.set(id, win)
//   win.on('closed', () => {
//     windows.delete(id) // 关闭时删除
//   })
// }

// ========== 9. 多窗口应用的启动逻辑 ==========
app.whenReady().then(() => {
  // 创建主窗口
  windowManager.create('main', {
    title: '主窗口',
    width: 1200,
    height: 800
  })

  // macOS 激活时
  app.on('activate', () => {
    if (windowManager.windows.size === 0) {
      windowManager.create('main')
    }
  })
})

// 所有窗口关闭时
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ========== 10. 多窗口数据共享方案 ==========
// 方案 1: 主进程作为数据源 (推荐)
// - 所有数据存储在主进程
// - 渲染进程通过 IPC 读写
// - 数据变更时主进程广播通知
//
// 方案 2: 共享存储 (electron-store / SQLite)
// - 多个窗口读写同一个存储
// - 需要处理数据同步和冲突
//
// 方案 3: MessageChannel (直接通信)
// - 性能好，但建立连接麻烦
// - 适合高频大量数据传输
//
// 方案 4: BroadcastChannel (同源渲染进程)
// - 浏览器标准 API
// - 简单易用，但只能在同源页面间使用`),Vl=[{id:"EL_01",title:"Electron 架构与进程模型",navTitle:"架构模型",category:"基础架构",path:"/electron/e-1/architecture",summary:"理解 Electron 的主进程、渲染进程、预加载脚本三个角色如何分工，以及三者之间的一条 IPC 调用链是怎样串联起来的。",demo:null,demoComponent:K,code:Wl,language:"javascript",principle:"Electron 把 Chromium 与 Node.js 融合进同一个桌面运行时：主进程（Main）是唯一的，负责应用生命周期、窗口创建与系统原生能力；每个 BrowserWindow 实例对应一个渲染进程（Renderer）运行 Web 页面；预加载脚本（Preload）运行在两者之间，通过 contextBridge 把受限 API 暴露给渲染进程。",flow:["主进程通过 BrowserWindow 启动渲染进程并加载页面（创建于主进程、运行于渲染进程）。","渲染进程调用预加载脚本暴露的 API，请求经 IPC 转发到主进程。","主进程处理完成后沿同一条 IPC 通道返回结果，渲染进程拿到 Promise 响应。","在控制台输出 process.type 或在 DevTools 中观察，确认当前代码运行在主进程还是渲染进程。"],notes:["一个窗口对应一个渲染进程，窗口崩溃不影响其他窗口；但主进程一旦崩溃，整个应用会退出。","Electron 20 起默认启用沙箱：渲染进程与预加载脚本均运行在受限环境中，无法直接访问全部 Node.js 能力。","Chromium 内置的网络、GPU 等模块会以独立的 Utility/辅助进程运行，由系统自动管理，通常无需开发者介入。","渲染进程的 Node 集成默认关闭：window.require、process 等能力需经预加载脚本按白名单提供，不要试图在页面里直接引入 Node 模块。"],problem:'解决"Electron 应用由哪些进程组成、各进程职责是什么、以及如何安全地进行进程间通信"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/tutorial/process-model"},{id:"EL_02",title:"主进程与 BrowserWindow",navTitle:"窗口管理",category:"基础架构",path:"/electron/e-2/main-window",summary:"用 BrowserWindow 创建、配置并管理应用窗口，掌握窗口生命周期事件顺序与 webPreferences 的安全配置。",demo:null,demoComponent:ie,code:Ml,language:"javascript",principle:"BrowserWindow 是主进程中创建原生窗口的构造函数，构造参数既描述外观（尺寸、边框、置顶）也可用 show: false 延迟显示；webPreferences 决定渲染进程能力，其中 nodeIntegration: false 与 contextIsolation: true 是安全基线；窗口生命周期按 ready-to-show → show → focus → close → closed 依次触发。",flow:["在主进程中使用 new BrowserWindow(options) 创建窗口，并配置 webPreferences（nodeIntegration: false、contextIsolation: true、preload 指向预加载脚本）。","用 show: false 创建窗口，在 ready-to-show 事件后再调用 show()，避免白屏闪烁。","监听 close / closed 事件，在窗口关闭后将 JavaScript 引用置空，释放对象防止内存泄漏。","把窗口尺寸与位置持久化到用户偏好，下次启动时读回还原，保持桌面应用的连续使用体验。"],notes:["生产环境必须关闭 nodeIntegration，如需 Node 能力只能通过 preload 暴露受限 API（contextIsolation 保持开启）。","show: false 配合 ready-to-show 是避免首屏白屏/闪烁的常见做法。","webSecurity: false 只用于本地开发叠加跨域场景，生产环境必须保持为 true。","窗口创建是重操作：多窗口应用应复用实例，创建前先检查同类窗口是否已存在，存在则聚焦而不是重复新建。"],problem:'解决"如何创建原生桌面窗口、如何配置渲染进程安全策略、以及如何管理窗口生命周期"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/browser-window"},{id:"EL_03",title:"IPC 进程间通信",navTitle:"IPC 通信",category:"进程通信",path:"/electron/e-3/ipc",summary:"掌握 ipcMain.handle + ipcRenderer.invoke 与 ipcMain.on + ipcRenderer.send 两种 IPC 模式，理解请求-响应与单向事件的区别。",demo:null,demoComponent:Ee,code:Al,language:"javascript",principle:"IPC（进程间通信）是渲染进程与主进程交换数据的唯一通道：invoke/handle 是 Promise 风格的请求-响应（渲染进程 invoke、主进程 handle 返回值）；send/on 是单向事件，需要通过 event.reply 或 webContents.send 才能回传；所有 IPC 都要经预加载脚本封装，主进程收到的是不可信的渲染进程数据。",flow:["主进程用 ipcMain.handle(channel, handler) 注册可调用的方法，或用 ipcMain.on 监听单向事件。","预加载脚本通过 contextBridge 把 ipcRenderer.invoke/send 封装成白名单 API。","渲染进程只调用暴露的 API：invoke 返回 Promise 拿到结果，事件回调里收到 reply。","为每个通道约定统一的数据结构与错误信封（如 { ok, data, message }），handler 内部 try/catch 后按信封返回。"],notes:["优先用 invoke/handle 处理需要返回值的请求；send/on 适合纯单向通知（如上报日志）。","渲染进程传来的参数不可信，主进程 handler 内必须校验类型与范围，如限制目录浏览。","IPC 会序列化数据：不要传递整份大文件内容，宜传文件路径再由主进程读写。","用 webContents.send 推送前先检查目标窗口是否已销毁（win.isDestroyed()），避免向已关闭窗口发送导致异常。"],problem:'解决"渲染进程如何调用主进程的本地能力、主进程如何向渲染进程推送事件、以及如何避免 IPC 通信的安全风险"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/tutorial/ipc"},{id:"EL_04",title:"预加载脚本与安全桥接",navTitle:"预加载脚本",category:"进程通信",path:"/electron/e-4/preload",summary:'编写预加载脚本，用 contextBridge.exposeInMainWorld 安全暴露白名单 API，理解上下文隔离与"绝不整对象暴露"的安全边界。',demo:null,demoComponent:Ue,code:El,language:"javascript",principle:"预加载脚本在渲染进程加载前运行，是唯一能同时触及受限 Node 子集与 Electron API 的地方；contextBridge.exposeInMainWorld(key, api) 只把白名单方法注入渲染进程的 window 对象，并在底层做类型隔离，成为上下文隔离下渲染进程使用原生能力的唯一入口。",flow:["创建 preload 脚本，从 electron 引入 contextBridge（沙箱下无法 require 完整 Node 模块）。",'用 contextBridge.exposeInMainWorld("api", {...}) 逐一暴露需要的函数，每个函数内部封装 ipcRenderer.invoke/send。',"渲染进程中通过 window.api.xxx 调用，渲染进程自身接触不到 ipcRenderer 或 Node.js。","按领域（文件、设置、窗口）分组命名 API，并在 preload 内对参数做第一道类型收窄。"],notes:["不要直接暴露整个 ipcRenderer 或 require：否则被 XSS 攻击的渲染进程可任意调用主进程 IPC 通道。","每个窗口的 webPreferences.preload 只能指向一个脚本；需要拆分时应在单个 preload 内手动合并模块。","暴露对象应保持最小，必要时用 Object.freeze 固定，避免渲染进程改写接口。","preload 中只做通道转发与参数整形，不放业务逻辑：复杂逻辑留在主进程，便于测试与安全审计。"],problem:'解决"如何在开启上下文隔离的前提下让渲染进程安全使用 Electron API、如何避免直接暴露 Node.js 能力、以及如何设计合理的 API 边界"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/tutorial/context-isolation"},{id:"EL_05",title:"应用生命周期与事件",navTitle:"应用生命周期",category:"应用管理",path:"/electron/e-5/app-lifecycle",summary:"梳理 app 模块的生命周期事件先后顺序（启动、激活、退出），并据此实现单例锁定与优雅退出。",demo:null,demoComponent:Je,code:ql,language:"javascript",principle:"app 模块驱动整个应用的生命周期：whenReady 后才可创建窗口；window-all-closed 决定退出还是驻留（macOS 驻留）；activate 在 macOS 点击 Dock 时触发；before-quit/will-quit 走退出清理；requestSingleInstanceLock 保证单实例，第二次启动触发 second-instance。",flow:["依次监听 app.whenReady、browser-window-created、web-contents-created 等事件，理解启动顺序。","在 window-all-closed 中判断：Windows/Linux 退出，macOS 保留，并在 activate 时重建最后一个窗口。","退出链路 before-quit → will-quit → quit：在 before-quit 里做清理，并通过 requestSingleInstanceLock 实现单例。","全局资源（托盘、快捷键、自动更新）统一在 ready 之后初始化，确保依赖 app 就绪的能力都在这时注册。"],notes:["生命周期先触发后，不同平台退出行为差别很大：macOS 关窗不退出，Windows/Linux 默认退出。","app.requestSingleInstanceLock() 拿不到锁就应立刻 app.quit()；拿到锁后在 second-instance 中聚焦已有窗口。","before-quit 可被 event.preventDefault() 拦截用于保存数据，确认后再 app.quit() 完成退出。","开发期热重载可能多次触发 ready：初始化逻辑要幂等，或借助单实例锁避免全局资源被重复注册。"],problem:'解决"如何控制 Electron 应用的启动流程、如何实现单例应用、如何处理不同平台的退出行为差异、以及如何响应系统协议"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/app"},{id:"EL_06",title:"原生菜单与上下文菜单",navTitle:"原生菜单",category:"原生能力",path:"/electron/e-6/native-menu",summary:"用 Menu.buildFromTemplate 构建并挂载应用原生菜单，掌握 role 复用与 accelerator 快捷键。",demo:null,demoComponent:on,code:Ol,language:"javascript",principle:"Menu 模块负责构造原生菜单：buildFromTemplate 接收菜单项描述结构，setApplicationMenu 把它挂到应用/窗口菜单栏；标准操作（撤销、剪切、复制、粘贴、全屏、退出等）优先用 role 声明，由系统自动本地化并绑定行为；菜单项上的 accelerator 说明该动作的快捷键展示与绑定。",flow:["用 Menu.buildFromTemplate([...]) 把 文件/编辑/视图/窗口/帮助 的菜单树写成模板。","对标准动作使用 role 而非手写 click，让系统处理本地化与行为。","通过 Menu.setApplicationMenu(menu) 挂载；需要右键菜单时用 menu.popup() 在对应位置弹出。","菜单项 click 中先用 BrowserWindow.getFocusedWindow() 取当前窗口并判空，再执行对应动作，避免操作到错误或已销毁的窗口。"],notes:["role 是首选：它给出系统标准行为的自动实现与本地化文案，避免重复造轮子。","菜单栏归属有平台差异：macOS 与应用绑定，Windows/Linux 与窗口绑定。",'菜单更新是"重建再挂载"：改动菜单时重新 buildFromTemplate 并 setApplicationMenu，而不是修改已挂载实例。',"accelerator 只在应用聚焦时生效，全局按键需另用 globalShortcut 注册，两者职责不要混淆。"],problem:'解决"如何构建跨平台原生菜单、如何实现右键上下文菜单、如何通过 role 复用系统标准行为、以及如何绑定快捷键"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/menu"},{id:"EL_07",title:"系统托盘与通知",navTitle:"系统托盘",category:"原生能力",path:"/electron/e-7/tray-notification",summary:"创建系统托盘图标并挂上菜单，通过 click/右键交互切换窗口显示，实现后台常驻。",demo:null,demoComponent:wn,code:Rl,language:"javascript",principle:"Tray 在系统菜单栏/任务栏角落放一个常驻图标：new Tray(icon) 创建，setContextMenu 挂右键菜单，setToolTip 设悬浮提示；监听 click/double-click 切换主窗口显隐；配合 window close 事件隐藏而非退出，即可做成常驻后台的托盘应用。",flow:["在主进程用 new Tray(nativeImage.createFromPath(...)) 创建托盘，并用全局变量持有实例。","用 setToolTip 设提示、setContextMenu 挂右键菜单，再监听 click 做窗口显示/隐藏切换。",'拦截窗口 close：普通关闭只 hide 到托盘，仅在用户主动选"退出"时才真正 app.quit()。','维护 isQuitting 标志：从托盘菜单选"退出"时先置位再关闭窗口，让 close 拦截放行真正的退出路径。'],notes:["Tray/NativeImage 必须被全局引用持有，否则会被 GC 回收导致图标消失。","macOS 托盘图标建议用黑白 template 图（@2x），系统能自动适配深浅色模式。","需要通知配合时，用 Notification 在 app.whenReady() 之后弹出，引导用户从托盘恢复窗口。",'窗口 close 被拦截后，window-all-closed 不再代表用户想退出；退出意图必须由显式的"退出"菜单项传递，避免应用"关不掉"。'],problem:'解决"如何创建系统托盘应用、如何实现最小化到托盘、如何发送系统通知、以及如何处理托盘图标的点击事件"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/tray"},{id:"EL_08",title:"文件对话框与系统对话框",navTitle:"文件对话框",category:"原生能力",path:"/electron/e-8/dialog",summary:"使用 dialog 模块打开原生文件选择、保存对话框与消息框，掌握异步 API 的返回值结构（canceled/filePaths）。",demo:null,demoComponent:hn,code:Dl,language:"javascript",principle:"dialog 模块提供与系统一致的原生对话框：showOpenDialog 选择文件/目录，showSaveDialog 指定保存路径，showMessageBox 弹出消息/提问；三者均为异步（返回 Promise），必须用 await 拿到结果并先判断 result.canceled。",flow:["主进程调用 await dialog.showOpenDialog(win, {...}) 弹出生效对话框。","用 filters 限定可选文件类型，用 properties 控制行为（openFile、multiSelections）。","先判断 result.canceled 再处理返回值：打开对话框取 filePaths，保存对话框取 filePath，消息框取 response 按钮索引。","把对话框封装成 preload 暴露的单一方法，渲染进程只拿最终路径或 null，不感知 dialog 细节。"],notes:["dialog 的异步版本普遍带 canceled 标记，务必判空后再取路径；同步版本（*Sync）会阻塞主进程，应避免。","渲染进程不能直接用 dialog，需经 preload + IPC 调用主进程封装的方法。","消息框定位经典按钮：defaultId 设默认按钮、cancelId 设按 ESC 时命中的按钮。","把窗口实例作为第一个参数传入对话框调用，让对话框正确附着在该窗口上（macOS 上以 sheet 形式呈现），父子关系更清晰。"],problem:'解决"如何打开原生文件选择器、如何保存文件到指定位置、如何显示确认对话框、以及如何获取用户选择的路径"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/dialog"},{id:"EL_09",title:"全局快捷键与菜单快捷键",navTitle:"快捷键",category:"原生能力",path:"/electron/e-9/shortcuts",summary:"注册 globalShortcut 全局快捷键（应用未聚焦也能触发）与菜单 accelerator，掌握冲突检查与退出时的资源释放。",demo:null,demoComponent:Dn,code:jl,language:"javascript",principle:"globalShortcut 注册系统级全局快捷键，renderer 未聚焦也能捕获；register 前应先 isRegistered 检查占用，成功后返回布尔值；菜单快捷键则只需在 MenuItem 上写 accelerator 即可由菜单系统自动注册。",flow:['用 globalShortcut.register("CmdOrCtrl+Shift+K", callback) 注册全局快捷键，并校验注册返回值是否成功。',"对可能冲突的按键先用 globalShortcut.isRegistered() 检查是否已被别的应用占用。","应用退出时在 will-quit 中调用 globalShortcut.unregisterAll() 释放所有注册的快捷键。","为用户提供快捷键自定义入口：键位存入配置，启动时统一注册，改键时先注销旧绑定再注册新绑定。"],notes:["全局快捷键是系统级资源，可能与其他应用冲突，注册失败时给出降级提示而不要强行覆盖。","accelerator 用 CmdOrCtrl 前缀实现跨平台；菜单快捷键定义在 MenuItem 的 accelerator 上，无需手动与 globalShortcut 重复注册。","必须在应用退出前注销全局快捷键，否则残留的系统级绑定会一直占用按键。","快捷键回调触发弹窗或聚焦窗口前，先确认窗口仍存在、必要时重建，不要假设用户切走期间窗口一直可用。"],problem:'解决"如何实现全局快捷键、如何避免快捷键冲突、如何动态注册/注销快捷键、以及如何在菜单中显示快捷键提示"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/global-shortcut"},{id:"EL_10",title:"自动更新机制",navTitle:"自动更新",category:"分发部署",path:"/electron/e-10/auto-update",summary:"用 electron-updater 实现应用自动更新，掌握检查→发现→下载→提示重启的更新事件流水线。",demo:null,demoComponent:Fn,code:Bl,language:"javascript",principle:"生产环境推荐用 electron-builder 配套的 electron-updater：主进程依次监听 checking-for-update、update-available、download-progress、update-downloaded，最终调 quitAndInstall 重启；更新源用 setFeedURL 指向发布服务（下载对应的 latest.yml 元数据），而不像 Electron 内置的 autoUpdater 那样需要自建更新服务器。",flow:["用 autoUpdater.setFeedURL(...) 指定更新服务器与发布配置。","依次监听 checking-for-update、update-available、download-progress、update-downloaded，让更新流程按事件推进。",'update-downloaded 后弹窗提示用户，选择"重启"时调用 autoUpdater.quitAndInstall() 完成升级。',"把 download-progress 的进度回传渲染进程展示，让长下载过程对用户可见、可感知。"],notes:["macOS 发布更新前必须对安装包代码签名并做 notarization（公证），否则更新会被系统拒绝。","Windows 更新需有效的 Authenticode 签名，并配合 latest.yml 的 blockmap 做增量更新，减少下载量。","与 Electron 内置 autoUpdater 的最大差异：electron-updater 覆盖自动更新服务器选择、签名验证与跨平台打包产物，落地更省事。","自动更新只在打包后的安装版中生效：开发环境调用会直接报错，接入前先用 app.isPackaged 判断再启用。"],problem:'解决"如何实现桌面应用的自动更新、如何配置更新服务器、如何验证更新包完整性、以及如何处理更新失败"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/auto-updater"},{id:"EL_11",title:"打包与分发",navTitle:"打包分发",category:"分发部署",path:"/electron/e-11/packaging",summary:"用 electron-builder 把应用打包成各平台安装包，掌握 build 配置、代码签名与平台差异。",demo:null,demoComponent:Xn,code:Tl,language:"javascript",principle:"electron-builder 读取 package.json 的 build 字段（appId、productName、mac/win/linux 各 target）后产出安装包：mac 出 dmg/zip（需签名与公证），win 出 nsis 安装程序或便携化 exe（需 Authenticode 证书），linux 出 AppImage/deb/rpm；跨平台产物无法在本机通用打包（尤其 macOS 只能在 macOS 上构建）。",flow:["在 package.json 的 build 字段配置 appId、productName，并为 mac/win/linux 分别声明 target 与图标。","在 scripts 中定义 pack（--dir 免安装包目录产物）与 dist 系列命令按平台打包。","为发布准备签名/公证资源（macOS 证书与公证、Windows 证书），并通过 CI 自动构建各平台。","产物本地完整走查一遍：安装、启动、升级覆盖与卸载路径，确认图标、菜单和文件关联都正确。"],notes:["macOS 安装包必须在 macOS（或跑在 macOS 的 CI）上构建，跨平台交叉编译受限。","Windows 用 NSIS 目标出安装程序，可定制安装步骤与卸载逻辑。","Linux 建议同时产出 AppImage、deb、rpm，兼顾免安装与发行版安装。","appId、版本号与 productName 打包前就要定稳：版本号决定升级判定与 latest.yml 匹配，appId 决定系统识别与后续迁移成本。"],problem:'解决"如何打包跨平台 Electron 应用、如何处理各平台的打包差异、如何配置代码签名、以及如何自动化发布流程"的问题。',officialUrl:"https://www.electron.build/"},{id:"EL_12",title:"安全最佳实践",navTitle:"安全实践",category:"安全与性能",path:"/electron/e-12/security",summary:"建立 Electron 应用的安全基线：关闭 nodeIntegration、开启 contextIsolation、配置 CSP 并审计依赖，收紧渲染进程能力。",demo:null,demoComponent:tl,code:Ul,language:"javascript",principle:"Electron 的安全要点是把资源最小权限落实到渲染进程：webPreferences 里 nodeIntegration: false、contextIsolation: true、sandbox 保持默认开启；用 Content-Security-Policy 限制可加载的资源，防止注入脚本；只加载可信内容并定期审计依赖，避免 XSS 升级为对主进程的远程代码执行。",flow:["逐项核对 webPreferences：nodeIntegration 关闭、contextIsolation 开启、webSecurity 开启，并通过 preload 暴露所需 API。","在页面 <head> 最顶部加入 CSP meta（default-src/script-src 都收紧为 self），限制可加载资源。","不加载远程脚本，并对依赖执行 npm audit，及时发现并升级有已知漏洞的包。","开发期观察 Electron 输出的安全警告（security-warnings），把不安全配置与用法尽早暴露出来。"],notes:["渲染进程被认为可被攻破，因此主进程是信任边界，一切 IPC 入参都要校验。","CSP 至少要收紧 script-src：禁止 script 的 unsafe-inline 与 unsafe-eval（样式留个可控的 unsafe-inline 可接受）。","不在能加载远程内容的页面放开敏感能力，并定期跑 npm audit/npm outdated 做依赖体检。","shell.openExternal 打开外链前必须白名单校验协议与域名，防止被注入 file:// 或自定义协议导致命令执行。"],problem:'解决"如何防止 Electron 应用被注入恶意代码、如何限制渲染进程的 native 能力、如何防止 XSS 攻击升级为远程代码执行、以及如何管理依赖安全"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/tutorial/security"},{id:"EL_13",title:"性能优化",navTitle:"性能优化",category:"安全与性能",path:"/electron/e-13/performance",summary:"从启动、内存、渲染三条线优化 Electron 应用，掌握延迟加载、引用释放与内存监控。",demo:null,demoComponent:ul,code:Nl,language:"javascript",principle:"Electron 性能主要看三条线：启动优化（主进程避免同步 I/O、非关键模块延迟加载、首屏骨架屏）、内存优化（控制渲染进程数量、及时释放不再需要的引用）、渲染优化（长列表虚拟滚动、事件防抖节流、CSS 硬件加速）；主进程可用 process.memoryUsage() 观察 RSS 等水位。",flow:["启动阶段：在 app.whenReady() 后才创建窗口，把耗时模块放到首屏空闲后再动态加载。","运行阶段：定时用 process.memoryUsage() 采样 RSS 水位，定位内存异常增长。","对已知开销大的任务拆分时机或放到 WebWorker/子进程，避免阻塞 UI 与主进程。","用 DevTools 的 Performance 面板录制启动与关键交互，先量化瓶颈位置，再决定优化手段。"],notes:["每个额外打开的渲染进程都会带来几十 MB 的内存量级成本，窗口不要随意堆叠。","窗口/WebContents 对象关闭后要主动释放引用，否则 GC 无法回收导致内存持续上涨。","用 Chrome DevTools 的 Performance 与 Memory 面板分别定位渲染与内存瓶颈。","首屏不必等全部数据就绪：骨架屏与渐进渲染让窗口尽快可见，比把所有启动逻辑前置更有效。"],problem:'解决"Electron 应用启动慢、内存占用高、渲染卡顿、以及如何定位性能瓶颈"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/tutorial/performance"},{id:"EL_14",title:"本地数据存储",navTitle:"数据存储",category:"数据管理",path:"/electron/e-14/storage",summary:"对比 electron-store、IndexedDB、SQLite 与 localStorage 的适用场景，按数据形态选对本地存储方案。",demo:null,demoComponent:vl,code:Ll,language:"javascript",principle:"Electron 本地存储按数据形态分四路：electron-store 读写 JSON 文件、适合配置与设置；IndexedDB 是 Web 标准异步存储、适合结构化离线数据；localStorage 同步键值、只适合临时小数据；SQLite（如 better-sqlite3）关系型、承载复杂查询与筛选。",flow:["配置/设置这类小对象优先用 electron-store：自动落到 userData 下的 JSON，键路径读写。","需要异步的高结构化数据（离线缓存）用 IndexedDB；同步临时的用 localStorage。","涉及复杂查询与多表关联再用 better-sqlite3/sql.js，按 IPC 交给主进程执行。","把各存储方案的读写封装成主进程服务模块、经 IPC 统一对外，便于后续替换实现。"],notes:['electron-store 默认落在 app.getPath("userData") 目录；但它本身并不自动加密，敏感字段需自行加密处理。',"electron-store 是整文件读写，数据量大时效率低，不适合频繁写入的大数据。","渲染进程里的 Web 存储（IndexedDB/localStorage）无法供主进程直接访问，共享数据要经 IPC。","userData 路径在 Windows 与 macOS 上不同，不要在代码里硬编码磁盘路径，统一用 app.getPath 获取。"],problem:'解决"Electron 应用应该如何存储本地数据、不同存储方案的适用场景、如何保证数据持久化、以及如何在主进程和渲染进程间共享数据"的问题。',officialUrl:"https://github.com/sindresorhus/electron-store"},{id:"EL_15",title:"多窗口管理与通信",navTitle:"多窗口管理",category:"数据管理",path:"/electron/e-15/multi-window",summary:"用集中式 Map 管理多个窗口，通过主进程中转与 webContents.send 实现窗口间通信并预防内存泄漏。",demo:null,demoComponent:hl,code:$l,language:"javascript",principle:"多窗口应用用一个 Map 集中持有窗口引用（new BrowserWindow 后 set、closed 后 delete）；窗口间通信不互相直接触碰，而是由主进程作为中转，用 target.webContents.send(channel, data) 定向推送或用 BrowserWindow.getAllWindows() 遍历广播；closed 时清引用是防止内存泄漏的关键。",flow:["在主进程维护 const windows = new Map()，创建窗口后 windows.set(win.id, { win, type })。","需要通信时向目标窗口的 webContents.send(channel, data)，批量则遍历 getAllWindows() 广播。","每个窗口的 closed 事件里 windows.delete(win.id)，及时释放引用，避免对象泄漏。","为窗口类型定义清晰契约（谁是主窗口、谁负责退出），避免出现孤儿窗口或互相等待的僵局。"],notes:["不要把窗口引用散落在全局变量里，统一用 Map 管理，便于查找与清理。","窗口间通信优先走主进程中转或共享存储，避免直接跨窗口 chrome 指针操作。","macOS 上关掉所有窗口应用仍在运行，多窗口设计与退出策略需按平台区分处理。","跨窗口共享数据以主进程或存储为单一事实来源，窗口只持有快照，关闭任一窗口不丢全局状态。"],problem:'解决"如何管理多个窗口、如何实现窗口间数据传递、如何避免窗口引用导致的内存泄漏、以及如何处理多窗口应用的生命周期"的问题。',officialUrl:"https://www.electronjs.org/docs/latest/api/browser-window"}];export{Vl as lessons};
