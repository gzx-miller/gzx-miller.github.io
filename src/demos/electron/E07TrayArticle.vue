<script setup lang="ts">
import E07Tray from './E07Tray.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在函数里写下 <code>const tray = new Tray(icon)</code>，刚启动时托盘区确实出现了图标；可过一会儿它自己就消失了，程序没崩、控制台也没有任何报错——一个"常驻"图标怎么会自己溜走？
    </div>

    <h2>后台常驻入口需求</h2>
    <p>
      你想做一个能待在后台的应用：用户点了窗口右上角的 ×，程序不退出，而是缩进系统托盘区，需要时再从那里唤回来。可如果没有这个常驻入口，用户一关窗就彻底找不到应用了——任务栏里没了、桌面也看不见，只剩一个还在占内存、占端口的"幽灵进程"，只能去任务管理器把它杀掉。
    </p>
    <p>
      想在托盘区放个图标，自己动手会有三笔隐藏成本：<strong>图标不是画上去就完事</strong>，它得由系统托管、随时可点击，还要在深浅色主题下都看得清；<strong>关闭语义必须拆开</strong>，"关掉窗口"和"退出应用"是两件事，混在一起要么关不掉、要么误退出丢掉未保存的数据；<strong>点击行为要区分左右键</strong>，左键通常切换窗口显隐，右键要弹出菜单，做成一样用户就懵了。
    </p>
    <p>
      所以要问的是：怎样在系统层面放一个受管理的常驻入口，既能随时唤回窗口，又能把"关窗"和"退出"这两件性质完全不同的事讲清楚？
    </p>

    <h2>托盘实例与菜单挂载</h2>
    <p>
      最朴素的写法是用 <code>new Tray(icon)</code> 创建托盘，再用 <code>setToolTip</code> 设悬停提示、用 <code>setContextMenu</code> 挂上右键菜单。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给了应用一个由操作系统托管的常驻入口</strong>。窗口可以藏起来，入口还在；而这一切都在主进程完成，因为托盘是系统资源，渲染进程根本碰不到它。
    </p>

    <h2>图标回收与引用失效</h2>
    <ul>
      <li>把 <code>Tray</code> 实例存在函数局部变量里：函数返回后没有任何强引用，图标被垃圾回收，<strong>悄无声息地消失</strong>，还不报错。</li>
      <li>图标随便传一张 256×256 的彩色 PNG：在只有十几像素的托盘区被压得模糊；macOS 上不用黑白模板图，深色菜单栏里几乎看不见。</li>
      <li>只监听 <code>click</code> 切换显隐：Windows 上左键和右键都被算作点击，用户想右键看菜单，窗口却被切没了。</li>
      <li>关窗时无脑 <code>preventDefault()</code> 加 <code>hide()</code>：用户从系统层面关窗、或系统注销时也无法退出，应用"关不掉"。</li>
      <li>没提供任何"退出"入口：用户想正常退出只能去杀进程。</li>
    </ul>

    <h2>模块级引用与退出语义</h2>
    <p>
      先补最要命的一条——<strong>让引用活着</strong>。把 <code>Tray</code> 提升为模块级的全局变量持有（而不是函数里的局部变量），这样它才不会被垃圾回收；这也是官方文档反复强调的"必须保持对 Tray 的引用"。
    </p>
    <p>
      第二步挂上右键菜单：<code>tray.setContextMenu(Menu.buildFromTemplate([...]))</code>，放"显示主窗口 / 隐藏主窗口 / 设置 / 退出"几项。菜单模板和上一课同源，只是挂在托盘上；"退出"这一项要调用 <code>app.quit()</code>。
    </p>
    <p>
      第三步拆开关闭语义，这是托盘应用最核心的一步：
    </p>
    <ol class="lesson-steps">
      <li>维护一个 <code>isQuitting</code> 标志，从托盘的"退出"菜单进入时先把它置为 <code>true</code>。</li>
      <li>拦截窗口的 <code>close</code>：如果 <code>isQuitting</code> 为真，就放行，让窗口真正关闭、应用真正退出。</li>
      <li>否则 <code>event.preventDefault()</code> 并 <code>win.hide()</code>，把窗口藏进托盘。</li>
      <li>顺手弹一条 <code>Notification</code> 告诉用户"程序仍在托盘继续运行"，免得他以为应用被关掉了。</li>
    </ol>
    <p>
      第四步补点击行为：单击 <code>click</code> 用 <code>mainWindow.isVisible()</code> 判断后切换显隐，双击 <code>double-click</code> 则显示并聚焦。macOS 上单击通常只弹菜单，双击行为按平台适配即可。
    </p>
    <p>
      最后补平台细节。macOS 的托盘图标建议用黑白<strong>模板图像</strong>（并准备 @2x 版本），系统会自动适配深浅色；纯托盘应用还可以用 <code>app.dock.hide()</code> 隐藏 Dock 图标，再用 <code>setBadge</code> 显示未读角标。通知要在 <code>app.whenReady()</code> 之后再弹。
    </p>
    <div class="lesson-box warn">
      <strong>一个后果常被忽略：</strong>一旦拦截了 <code>close</code>，<code>window-all-closed</code> 就不再等于"用户想退出"了——窗口全被藏起来，事件根本不会触发。也就是说，<strong>退出意图只能由显式的"退出"菜单项来传递</strong>；忘了给这个入口，用户就会觉得应用"关不掉"。
    </div>

    <h2>左右键点击日志</h2>
    <figure class="lesson-figure">
      <figcaption>点「创建托盘图标」，再分别按「模拟左键点击」「模拟右键点击」，看操作日志里图标创建、窗口显隐切换、右键弹出菜单按顺序被记下来。</figcaption>
      <E07Tray />
    </figure>

    <h2>常驻应用三项职责</h2>
    <p>
      托盘应用要同时管好三件事：让 <code>Tray</code> 实例被全局持有、别被 GC 回收；用 <code>setContextMenu</code> 把菜单挂上去、用 <code>click</code> 切换窗口显隐；并把"关窗"和"退出"彻底分开——普通关闭只隐藏，只有显式的"退出"才走 <code>app.quit()</code>。这三条立住，后台常驻才真的可用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模板图像（template image）」</span>是 macOS 上的一种特殊图标：你提供一张纯黑白（带透明通道）的图并标记为模板，系统会据此在浅色与深色菜单栏中自动反色，让它始终清晰。它的边界是<strong>只对 macOS 有意义</strong>——Windows 与 Linux 请用普通彩色 PNG，并按 16×16 与 32×32（@2x）两档准备尺寸，否则会被拉伸失真。
    </div>
  </LessonArticle>
</template>
