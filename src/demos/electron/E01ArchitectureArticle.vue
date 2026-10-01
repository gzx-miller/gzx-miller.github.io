<script setup lang="ts">
import E01Architecture from './E01Architecture.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个窗口里的页面崩了，另一个窗口照常刷新；可主进程里抛出一个没人接的异常，整个应用却瞬间退出——同样是"崩溃"，为什么一个只死一半，另一个全军覆没？
    </div>

    <h2>提出问题</h2>
    <p>
      你要做一个桌面应用：它得能画界面，用 HTML / CSS / JavaScript 那一套；同时它又得能读写本地文件、弹系统菜单、开原生窗口。麻烦在于，浏览器给的是沙箱里的一个页面，Node.js 给的是操作系统能力，这两样东西天生不在一起。
    </p>
    <p>
      最省事的做法是把 Node 直接塞进页面——<code>nodeIntegration: true</code>，页面里就能 <code>require('fs')</code>。但它让你背上两笔隐藏成本：<strong>第一，页面里任何一段第三方脚本、任何一次脚本注入，都瞬间拥有删文件、起进程的能力</strong>，一次 XSS 直接升级成本地代码执行；<strong>第二，界面的渲染和系统能力被绑死在同一个执行体里</strong>，一段卡死的渲染代码会拖垮整个应用。你被迫在"页面能用能力"和"能力不出事"之间二选一。
    </p>
    <p>
      那么，怎么才能既让页面用上系统能力，又不让页面直接拥有它，还让两者互不拖垮？
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的结构：把应用拆成两个执行体。一个叫<strong>主进程</strong>，跑 Node，负责创建窗口、调用系统 API；一个叫<strong>渲染进程</strong>，跑页面，只负责把界面画出来。两者不共享内存，靠一条消息通道传话。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把"系统能力"和"网页内容"在物理上隔开了</strong>。页面里没有 <code>fs</code>、没有 <code>require</code>，出了事也只崩在渲染进程里，主进程安然无恙——这正是开场里"崩一半"的底气。
    </p>
    <p>
      可它立刻留下一个空洞：主进程怎么让渲染进程"给我画个窗口"？渲染进程又怎么请求"帮我读个文件"？两个进程的内存互不相通，你没法像调普通函数那样直接调用对方——中间必须有一条通信线。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>两个进程内存不共享，渲染进程里根本不存在主进程的 <code>fs</code> 函数，直接调用只会得到 <code>undefined</code>。</li>
      <li>如果为了"能调用"就让渲染进程直接持有 <code>ipcRenderer</code>、向任意通道发消息，那等于把大门敞开：页面被注入后可以调用主进程注册的任何一个 handler，隔离白做了。</li>
      <li>页面完全碰不到 Node，可它又确实需要一点点系统信息，比如版本号、平台名，这些数据得有个合法来源。</li>
      <li>渲染进程崩溃时主进程未必察觉，若还持着那个窗口的引用，就成了悬空对象。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补上通信线，因为"跨进程调用"是这套结构成立的前提。主进程用 <code>ipcMain</code> 注册处理方法，渲染进程用 <code>ipcRenderer</code> 发请求，消息在两个进程间序列化传递；方向也要补齐，除了渲染到主进程的请求，主进程还能用 <code>webContents.send</code> 主动向渲染进程推送。
    </p>
    <p>
      但通信线还缺一个"中间人"。谁来当这个中间人？它得能碰到 <code>ipcRenderer</code>，又要待在渲染进程这一侧的受限环境里，还得在页面脚本执行<strong>之前</strong>就跑起来。于是引入第三个角色——<strong>预加载脚本（Preload）</strong>。它在渲染进程加载页面前运行，是唯一能同时触及受限 Node 子集与 Electron API 的地方；它用 <code>contextBridge.exposeInMainWorld</code> 只把白名单方法挂到 <code>window</code> 上，页面拿到的是 <code>window.api.getVersion()</code> 这样的窄接口，而不是整个 <code>ipcRenderer</code>。
    </p>
    <p>
      到这里三个角色分工成型，一条调用链也串起来了：
    </p>
    <ol class="lesson-steps">
      <li>主进程用 <code>new BrowserWindow()</code> 启动一个渲染进程并加载页面——窗口<strong>创建于主进程，页面运行于渲染进程</strong>。</li>
      <li>页面调用预加载脚本暴露的 <code>window.api.xxx</code>，请求被转发到 <code>ipcRenderer</code>。</li>
      <li>请求经 IPC 通道到达主进程，由注册好的 handler 处理。</li>
      <li>主进程沿同一条通道返回结果，渲染进程拿回一个 Promise 响应。</li>
    </ol>
    <p>
      三个角色的边界值得记牢：<strong>主进程唯一</strong>，它一旦崩溃整个应用退出；<strong>每个窗口对应一个渲染进程</strong>，崩一个不影响别的窗口；<strong>预加载脚本每个渲染进程一份</strong>，夹在两者之间做桥接。至于 Chromium 自带的网络、GPU 等模块，会以独立的 Utility 进程运行，由系统自动管理，通常不需要你介入。
    </p>
    <div class="lesson-box hint">
      <strong>自己确认一下：</strong>在主进程或页面里打印 <code>process.type</code>，或在 DevTools 的 Console 里观察，就能看出当前这段代码究竟跑在主进程还是渲染进程里——调试进程相关问题时，这一步最省心。
    </div>
    <div class="lesson-box warn">
      <strong>别踩的坑：</strong>Electron 20 起默认启用沙箱，渲染进程与预加载脚本都运行在受限环境中，拿不到全部 Node 能力；渲染进程的 Node 集成默认关闭，<code>window.require</code>、<code>process</code> 这些能力必须经预加载脚本按白名单提供，不要在页面里硬引 Node 模块。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先点上面三张卡片看清主进程、预加载、渲染进程各自的职责，再点「模拟 IPC 调用」，看一条请求从渲染进程出发、经预加载转发到主进程、再原路返回的完整往返。</figcaption>
      <E01Architecture />
    </figure>

    <h2>总结</h2>
    <p>
      Electron 的进程模型，本质上是把"职责"和"权限"做了一次物理切分：主进程管系统能力，渲染进程管界面，预加载脚本当中间的白名单通道。理解了三者各是谁、能碰什么，再回头看一条 IPC 调用链，就不容易把权限和边界记混。
    </p>
    <div class="lesson-term">
      <span class="term-name">「主进程」</span>是 Electron 应用里唯一的 Node.js 运行环境，由 <code>package.json</code> 的 <code>main</code> 入口脚本启动，负责应用生命周期、创建 <code>BrowserWindow</code>、调用系统原生能力，并用 <code>ipcMain</code> 响应渲染进程的请求。它是一切渲染进程的父进程：<strong>渲染进程崩溃只影响单个窗口，主进程崩溃则整个应用退出</strong>，所以重型或易错的逻辑不要堆在主进程里。
    </div>
  </LessonArticle>
</template>
