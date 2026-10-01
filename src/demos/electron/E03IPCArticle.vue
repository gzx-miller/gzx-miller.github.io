<script setup lang="ts">
import E03IPC from './E03IPC.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>界面里点一下按钮，想读一个本地配置文件；主进程里明明握着 <code>fs</code>，你在渲染进程里照着写 <code>fs.readFile</code> 却直接报 <code>undefined</code>——两个进程之间，一次"函数调用"到底是怎么发生的？
    </div>

    <h2>提出问题</h2>
    <p>
      你的界面住在渲染进程里，能力长在主进程里。你真正想做的事只有一件：<strong>在页面点一下按钮，跨进程调用一个函数并拿到返回值</strong>。
    </p>
    <p>
      可这件事不能像普通函数那样直接做。渲染进程的内存里根本没有主进程的 <code>fs</code>，你写下 <code>fs.readFile</code> 只会拿到 <code>undefined</code>；两个进程的内存互相独立，"用全局变量共享一下"也根本不成立——各自有不同的全局对象，改了对方看不见。如果为了能直接调用而把两种能力塞进同一个进程，又会把上一课建立的进程隔离整个丢掉。
    </p>
    <p>
      于是问题落到一句上：两个互相看不见内存的进程，怎么才能既"调用并拿到结果"，又"单向地通知对方一件事"？
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法是约定一个字符串通道名，两边对着它收发消息。渲染进程发：<code>ipcRenderer.send('save-data', data)</code>；主进程收：<code>ipcMain.on('save-data', (event, data) =&gt; { ... })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给了两个进程一条带名字的通道</strong>。数据在通道上被序列化后传输，跨进程第一次有了确定的传话方式，你可以按业务给不同通道起不同名字。
    </p>
    <p>
      但 <code>send/on</code> 是单向的——消息一发出去就结束，发的人拿不到"处理完了没、结果是什么"。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>读文件这类"我要拿到内容"的场景，<code>send/on</code> 拿不到返回值，只能让主进程再发一条消息回来（<code>event.reply</code>），你得写两段代码自己把请求和响应配起来。</li>
      <li>手动配对在并发下会串线：连发两次请求，回来两条回复，你分不清哪条对应哪次——如果两次读的是不同文件，结果就错位了。</li>
      <li>通道名写错不会有任何提示，消息发出去像石沉大海，调试只能靠猜。</li>
      <li>主进程收到的永远是渲染进程递来的任意数据，一旦当真使用，就等于信任了不可信的一方。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补"请求-响应"，因为"调用并拿到结果"是最常见的需求。引入一对新 API：渲染进程 <code>ipcRenderer.invoke(channel, ...args)</code>，主进程 <code>ipcMain.handle(channel, handler)</code>。<code>invoke</code> 返回 Promise，<code>handler</code> 的返回值就是它 resolve 出来的值，一次请求自动对应一次响应。
    </p>
    <ol class="lesson-steps">
      <li>渲染进程调用 <code>invoke('channel', args)</code>，得到一个挂起的 Promise。</li>
      <li>请求经通道到达主进程，<code>handle</code> 注册的 handler 被执行。</li>
      <li>handler 的返回值被序列化后沿原通道送回。</li>
      <li>渲染进程的 Promise resolve，拿到结果——请求与响应天然成对，不再需要手动配对。</li>
    </ol>
    <p>
      但 <code>send/on</code> 并不因此作废。有些消息压根不需要回执，比如"用户已登录，记一笔日志""窗口要最小化了"，用 <code>invoke</code> 反而凭空多出一个永远用不上的 Promise。所以两者按需选取：<strong>需要返回值用 <code>invoke/handle</code>，纯单向通知用 <code>send/on</code></strong>——这正是演示里两个页签的区别所在。
    </p>
    <p>
      接着补数据契约和错误处理。主进程的 handler 内部用 <code>try/catch</code> 包住逻辑，按统一信封返回，比如 <code>{ ok, data, message }</code>；不要直接把异常往外抛，异常跨进程序列化后信息会丢，还可能把栈暴露给页面。每个通道两边都约定同一套结构，渲染进程就能统一判断成败。
    </p>
    <p>
      最后补主进程到渲染进程的方向：主进程用 <code>target.webContents.send(channel, data)</code> 主动推送事件。这里有个边界——<strong>推送前先检查目标窗口是否已销毁</strong>（<code>win.isDestroyed()</code>），否则向一个已经关掉的窗口发消息会抛异常。参数校验也别省：渲染进程传来的东西一律不可信，主进程 handler 要校验类型与范围，比如把文件操作限制在指定目录内。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的点：</strong>IPC 会序列化数据，<strong>不要拿它搬运整份大文件</strong>，正确做法是传文件路径、由主进程去读写；另外，渲染进程不要直接裸用 <code>ipcRenderer</code>，所有 IPC 都应经预加载脚本封装成白名单接口再交给页面。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换「invoke/handle」与「send/on」两个模式，各点一次「发送 IPC 消息」，对照日志里请求与响应的往返——注意 invoke 模式能一路等到返回值，send 模式则是发出去就结束。</figcaption>
      <E03IPC />
    </figure>

    <h2>总结</h2>
    <p>
      IPC 做的事，是把"跨进程的函数调用"翻译成"带名字的通道消息"。要拿到结果就用 <code>invoke/handle</code>，只做通知就用 <code>send/on</code>，通道两端约定统一的数据信封、并默认对方给的数据不可信——通信才会又稳又安全。
    </p>
    <div class="lesson-term">
      <span class="term-name">「IPC（进程间通信）」</span>是渲染进程与主进程交换数据的唯一通道，消息在两个进程间序列化传输。两种基本形态要分清楚：<code>invoke/handle</code> 是 Promise 风格的请求-响应，渲染进程 <code>invoke</code>、主进程 <code>handle</code> 返回值；<code>send/on</code> 是单向事件，想回传信息必须靠 <code>event.reply</code> 或 <code>webContents.send</code> 另发一条。<strong>边界：通道里只能传可序列化的数据，函数、DOM 节点、大文件对象都过不去</strong>，大文件应改传路径。
    </div>
  </LessonArticle>
</template>
