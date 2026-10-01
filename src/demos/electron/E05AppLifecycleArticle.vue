<script setup lang="ts">
import E05AppLifecycle from './E05AppLifecycle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>app.whenReady()</code> 之前就写了 <code>new BrowserWindow</code>，程序直接报错"应用就绪前不能创建窗口"；另一个更常见的场景是——用户连点五下图标，任务栏里冒出五个一模一样的窗口，一起抢着写同一份配置。为什么"什么时候能做某件事"这么较真？
    </div>

    <h2>生命周期时序约束</h2>
    <p>
      桌面应用有一串绕不开的时序问题：创建窗口前要等应用就绪，退出前要先把数据清理干净，macOS 上关掉窗口并不等于退出应用。这些时机只要有一个踩偏，结果就是白屏、丢数据，或者重复启动好几个实例。
    </p>
    <p>
      如果自己在代码里硬排一个顺序，会立刻撞上三笔隐藏成本：<strong>平台行为不一致，一套逻辑必然在某个系统上出错</strong>——macOS 关窗驻留、Windows 与 Linux 关窗退出；<strong>用户能重复启动，多个实例同时抢同一份资源</strong>；<strong>退出时没有拦截点，正在写盘的数据可能被中途腰斩</strong>。
    </p>
    <p>
      所以要问的是：应用从启动到退出，中间有一串事件，谁在什么时候告诉你"现在可以创建窗口了""现在要走了"？
    </p>

    <h2>就绪后创建窗口</h2>
    <p>
      最朴素的做法：用 <code>app.whenReady()</code> 拿到一个 Promise，在它 resolve 之后才创建第一个窗口——<code>app.whenReady().then(createWindow)</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把"应用初始化完成"这个时机变成了一个可等待的信号</strong>。你不必再猜主进程什么时候能建窗口，等 Promise 就行，报错那句"就绪前不能创建窗口"自然消失。
    </p>

    <h2>全窗关闭后去留</h2>
    <ul>
      <li>只等就绪远远不够：所有窗口关掉之后该干什么？不处理的话，Windows 上窗口关光了进程还挂着，或者 macOS 上本该驻留却被误退。</li>
      <li>用户能重复启动应用：再开一份，两个进程同时写同一份配置或数据库，数据直接互相覆盖。</li>
      <li>退出时想保存数据却无处下手：等察觉到要退出时，清理流程往往已经走完，来不及了。</li>
      <li>如果关窗就真的销毁窗口，那些想做成"点 X 隐藏到托盘继续跑"的常驻应用根本实现不了。</li>
    </ul>

    <h2>平台退出去留判断</h2>
    <p>
      先补最影响正确性的平台退出差异。<code>window-all-closed</code> 里判断平台：<code>process.platform !== 'darwin'</code> 时才 <code>app.quit()</code>，Windows 与 Linux 关窗即退出；macOS 保留进程，并在 <code>activate</code>（点 Dock 图标）时，若发现没有窗口就重建一个。这一条把"关窗"和"退出"从"必然绑定"拆成了"分平台决定"。
    </p>
    <p>
      再补单例，解决重复启动。在启动最开头调用 <code>app.requestSingleInstanceLock()</code>：
    </p>
    <ol class="lesson-steps">
      <li>拿不到锁，说明已有实例在运行，<strong>立刻 <code>app.quit()</code> 并结束</strong>。</li>
      <li>拿到锁，注册 <code>second-instance</code> 事件——第二个实例被启动时会触发它。</li>
      <li>在回调里把已有窗口从最小化状态 <code>restore()</code> 并 <code>focus()</code>，让用户感觉"点图标是把应用叫到前面"。</li>
      <li>第二个实例带来的命令行参数也在这里处理，比如某个要打开的文件路径。</li>
    </ol>
    <p>
      接着补退出链路。<code>before-quit</code> → <code>will-quit</code> → <code>quit</code> 依次触发。要做"退出前保存数据"，就在 <code>before-quit</code> 里 <code>event.preventDefault()</code> 拦住，等清理完成后<strong>再调一次 <code>app.quit()</code></strong>；为避免反复拦截，用一个 <code>isQuitting</code> 标志位记录状态。<code>will-quit</code> 则适合做确定性的收尾，比如统一注销全局快捷键。
    </p>
    <p>
      最后补初始化的幂等与集中。开发期热重载可能让 <code>ready</code> 被触发多次，所以全局资源——托盘、全局快捷键、自动更新——统一放在 <code>ready</code> 之后初始化，并且保证重复执行也安全；否则托盘会被建好几份，快捷键会重复注册。把这一条养成习惯，启动阶段的资源管理就不会失控。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易翻车的地方：</strong><code>before-quit</code> 里的 <code>preventDefault</code> 只能拦一次，若不设标志位就再调 <code>app.quit()</code>，会陷入反复触发；另外，写退出逻辑前先想清楚目标平台——macOS 默认关窗不退出，直接套 Windows 的写法会把用户的应用意外关掉。
    </div>

    <h2>跨平台行为观测</h2>
    <figure class="lesson-figure">
      <figcaption>先在上面切换 macOS / Windows / Linux，再点「模拟生命周期」，观察 <code>window-all-closed</code> 之后是走向 <code>activate</code> 重建窗口，还是走向 <code>quit</code> 直接退出。</figcaption>
      <E05AppLifecycle />
    </figure>

    <h2>启动退出时间表</h2>
    <p>
      应用生命周期是一份时间表：<code>whenReady</code> 之后才创建窗口，<code>window-all-closed</code> 决定去还是留，<code>before-quit</code> 与 <code>will-quit</code> 负责清理，单实例锁拦住重复启动。把每个时机该做的事放对位置，启动和退出这两个最容易出问题的阶段就稳了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「单实例锁」</span>由 <code>app.requestSingleInstanceLock()</code> 获取，用来保证同一时间只有一个应用实例在运行。它的用法有两条硬边界：<strong>拿不到锁就必须立即 <code>app.quit()</code></strong>，否则第二个实例会继续跑下去；<strong>拿到锁后要在 <code>second-instance</code> 里把已有窗口恢复并聚焦</strong>，不然用户以为"启动了"，眼前却什么都没发生。
    </div>
  </LessonArticle>
</template>
