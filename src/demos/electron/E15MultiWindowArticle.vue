<script setup lang="ts">
import E15MultiWindow from './E15MultiWindow.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户连点了三下「关于」，你屏幕上就叠了三个一模一样的关于窗口——因为你每点一次就 <code>new BrowserWindow</code> 一次。更别扭的是，主窗口把主题切成深色后，设置窗口还亮着白底，两个窗口各说各话，像活在两个应用里。
    </div>

    <h2>提出问题</h2>
    <p>
      多窗口应用比单窗口多出三件必须回答的事。<strong>谁是谁</strong>：同时存在好几个窗口实例，你怎么找到指定的那个、怎么保证同类窗口不重复弹。<strong>窗口之间怎么说话</strong>：主窗口改了主题，别的窗口怎么知道。<strong>窗口长什么样、在哪</strong>：用户拖过位置、调过大小，下次打开还还原不还原。
    </p>
    <p>
      旧办法每一步都有代价：窗口引用散落在全局变量或函数局部变量里，用时找不到、关时清不掉；窗口之间直接互相引用对方的 <code>webContents</code>，一旦其中一个被关掉，另一个再发消息就是发给一个已经销毁的对象，直接报错；每个窗口各存一份全局状态，改一处不同步；窗口位置大小不持久化，用户精心摆好的布局重启就没了。
    </p>
    <p>
      所以要问的是：怎样把「多个窗口」当成一个可管理的整体，让它们找得到、说得上话、状态还不丢？
    </p>

    <h2>最小方案</h2>
    <p>
      主进程里用一个 <code>Map</code> 集中持有所有窗口：创建后 <code>windows.set(win.id, { win, type })</code>，需要哪个窗口就按 <code>id</code> 取。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「窗口实例」变成了一个可查询、可清理的集合</strong>，而不是一堆散落在角落里的变量。有了这张表，「找到某个窗口」和「关掉后把它忘掉」都成了明确的操作。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>没有单例控制：同一个按钮点几下就 <code>new</code> 出几个同类窗口，用户想要的其实只是把已有的那个拉到前面。</li>
      <li><code>closed</code> 事件里不 <code>windows.delete(win.id)</code>：引用一直挂在 Map 上，GC 收不回，还会在你稍后对它 <code>send</code> 时抛错。</li>
      <li>窗口之间直接互相引用 <code>webContents</code>：一个关了，另一个还攥着旧引用，通信时打到死对象上。</li>
      <li>每个窗口各存一份共享状态：主窗口改了，设置窗口不知道，界面就对不上。</li>
      <li>平台差异：macOS 上关掉所有窗口应用仍在运行，「什么时候退出」不能只按 Windows 的直觉写。</li>
      <li>窗口位置大小不保存：用户摆放的布局，重启就回去了。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先把「实例管理」补成可靠的。在 <code>Map</code> 之外加一层<strong>单例判断</strong>：开窗口前先查有没有同类窗口，有就 <code>win.focus()</code>（必要时先 <code>restore()</code>），没有才 <code>new BrowserWindow</code> 并存进 Map。这一步直接解决连点叠窗。
    </p>
    <p>
      接着定「父子关系」。用 <code>new BrowserWindow({ parent: mainWindow })</code> 建立从属：子窗口永远在父窗口之上，父窗口最小化或关闭时子窗口随之隐藏或关闭；需要它挡住父窗口操作时再加 <code>modal: true</code>。同时给窗口类型定下清晰契约——<strong>谁是主窗口、谁负责退出</strong>，避免出现孤儿窗口或互相等待的僵局。
    </p>
    <p>
      再解决通信。这里的关键是<strong>窗口之间不互相直接碰，统一由主进程当中间人</strong>。想给某个窗口发消息，就用 <code>target.webContents.send(channel, data)</code> 定向推送；想通知所有窗口，就遍历 <code>BrowserWindow.getAllWindows()</code> 广播——比如主窗口切了主题，主进程收到后广播给每个窗口，大家步调一致。这样做的好处是：任何一方被关掉都不会连累别人，因为发消息的始终是还活着的主进程。
    </p>
    <p>
      然后是共享状态。<strong>以主进程或存储为单一事实来源</strong>，各个窗口只持有自己的快照：数据改动先到主进程，主进程再决定推给谁。这样关掉任意一个窗口都不会丢全局状态。
    </p>
    <p>
      最后补窗口状态持久化。在窗口 <code>resize</code> / <code>move</code>（或关闭）时把位置和大小记进 <code>electron-store</code> 这类 userData 存储里，下次创建时读取恢复；恢复前<strong>先校验保存的 bounds 是否还落在当前显示器范围内</strong>——用户可能拔掉了那块外接屏，直接 <code>setBounds</code> 会把窗口放到看不见的地方。
    </p>
    <p>
      收尾是清理：每个窗口的 <code>closed</code> 事件里 <code>windows.delete(win.id)</code>，让引用和对象一起被回收；再配合 <code>window-all-closed</code> 处理「所有窗口都关了要不要退出应用」这个平台差异。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点每个窗口卡片上的「打开 / 关闭」管理它的生命周期，再点「广播消息到所有窗口」模拟主进程的定向推送与广播，观察窗口状态如何随开关同步变化。</figcaption>
      <E15MultiWindow />
    </figure>

    <h2>总结</h2>
    <p>
      多窗口管理的三件事各有归属：实例用主进程里的一个 <code>Map</code> 集中管理并加单例判断，通信一律走主进程中转（定向用 <code>webContents.send</code>、批量用 <code>getAllWindows()</code> 广播），共享状态以主进程为单一事实来源，窗口位置用 userData 存储持久化。别忘了在 <code>closed</code> 里删引用——这是不掉进内存泄漏的关键。
    </p>
    <div class="lesson-term">
      <span class="term-name">「父子窗口」</span>通过在 <code>BrowserWindow</code> 选项里传 <code>parent</code> 建立：子窗口永远浮在父窗口之上，父窗口最小化或关闭时子窗口跟随隐藏或关闭；再加 <code>modal: true</code> 会让子窗口阻塞父窗口的交互。边界：父子关系必须<strong>显式传 <code>parent</code></strong>，不能靠窗口创建顺序去推断；而且平台表现不完全一致（macOS 的 modal sheet 行为与 Windows 有差异），macOS 上「关掉所有窗口」也不等于退出应用，退出策略要单独处理。
    </div>
  </LessonArticle>
</template>
