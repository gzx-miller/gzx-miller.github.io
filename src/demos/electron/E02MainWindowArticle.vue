<script setup lang="ts">
import E02MainWindow from './E02MainWindow.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了 <code>new BrowserWindow</code> 再 <code>loadFile('index.html')</code>，应用一启动，用户却先看到一块刺眼的白板，过一会儿内容才冒出来——页面明明没问题，那片白到底是哪来的？
    </div>

    <h2>网页窗口概念缺失</h2>
    <p>
      你要开一个桌面窗口：它要有尺寸、标题、图标，能被拖动和缩放，还要能在任务栏上分组。可你低头一看 HTML，发现它压根没有"窗口"这个概念——网页不知道自己是"一个操作系统的窗口"，它只是一块画布。
    </p>
    <p>
      旧办法是在页面里用 CSS 画一个假标题栏、用 JavaScript 监听鼠标拖动来模拟移动。它带来三笔必须由人承担的成本：<strong>外观和真实的窗口行为脱节</strong>，拖动会掉帧；<strong>系统级能力缺失</strong>，任务栏图标、多显示器位置、最大化和全屏都得自己实现；<strong>每个窗口都要重写一遍这套模拟逻辑</strong>，越做越像在造一个残缺的窗口管理器。
    </p>
    <p>
      那谁该来创建这个"系统认识"的原生窗口，并把一个网页装进去？
    </p>

    <h2>创建窗口与加载内容</h2>
    <p>
      在主进程里 <code>new BrowserWindow({ width: 800, height: 600 })</code>，再 <code>mainWindow.loadFile('index.html')</code>。这就是最小可跑的窗口。
    </p>
    <p>
      这个方案做对了一件事：<strong>窗口由操作系统创建，网页只是它的内容</strong>。缩放、最大化、任务栏图标、位置记忆这些"窗口自身的属性"全部由系统接管，你再也不用在页面里模拟一遍。
    </p>
    <p>
      但它默认是"先显示、后加载"的：窗口一创建就亮出来，页面还在路上，用户看到的正是开场那片白。
    </p>

    <h2>白屏闪烁与状态复位</h2>
    <ul>
      <li>默认创建即显示，首屏内容还没准备好就先露出空背景，用户看到白屏一闪。</li>
      <li>只给尺寸不够：每次启动都回到默认位置和默认大小的窗口，用起来像"新手"，接不上用户上次的工作状态。</li>
      <li>窗口关闭后若不释放引用，JavaScript 里还死死攥着一个已经销毁的对象，长时间运行会内存泄漏。</li>
      <li><code>webPreferences</code> 一旦配错——比如误开 <code>nodeIntegration</code>——前面辛苦搭起来的安全边界当场崩塌。</li>
    </ul>

    <h2>延迟显示避免白屏</h2>
    <p>
      先补"不闪"这一步，因为它最先影响第一印象。创建时写 <code>show: false</code> 让窗口先藏着，再绑上 <code>win.once('ready-to-show', () =&gt; win.show())</code>，等页面首屏准备就绪再显示出来，那片白就被掐掉了。
    </p>
    <p>
      接着把窗口的生命周期事件顺序理清，这是后面所有窗口操作的地基：
    </p>
    <ol class="lesson-steps">
      <li><code>new BrowserWindow(options)</code> 创建窗口。</li>
      <li><code>ready-to-show</code> 页面首屏可渲染——配合 <code>show: false</code> 在此之后调用 <code>show()</code>。</li>
      <li><code>show</code>、<code>focus</code> 窗口显示并获得焦点。</li>
      <li>运行期间穿插 <code>resize</code> / <code>maximize</code> / <code>minimize</code> / <code>restore</code> 等状态事件。</li>
      <li><code>close</code> 即将关闭，可被 <code>event.preventDefault()</code> 拦截（比如做成隐藏到托盘）。</li>
      <li><code>closed</code> 已经关闭，此时窗口对象已销毁，<strong>必须把引用置空</strong>。</li>
    </ol>
    <p>
      再补安全基线。<code>webPreferences</code> 里写死两条：<code>nodeIntegration: false</code> 与 <code>contextIsolation: true</code>，<code>preload</code> 指向预加载脚本。需要 Node 能力时不放开 <code>nodeIntegration</code>，而是让预加载脚本按白名单暴露——这条路在别处会展开，这里先记住"生产环境不松这条线"。
    </p>
    <p>
      最后补窗口状态管理：用 <code>getPosition()</code> / <code>getSize()</code> 读回位置与尺寸，用 <code>maximize()</code> / <code>minimize()</code> / <code>restore()</code> / <code>setFullScreen()</code> / <code>setAlwaysOnTop()</code> 控制状态。把这些值和用户偏好一起持久化，下次启动读回还原，窗口才有了"接着上次用"的连续感。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>其一，<code>webSecurity</code> 只在本地开发叠加跨域时才临时关，生产环境必须保持 <code>true</code>；其二，窗口创建是重操作，多窗口应用创建前应先检查同类窗口是否已存在，存在就聚焦，而不是重复新建。
    </div>

    <h2>参数组合与事件时序</h2>
    <figure class="lesson-figure">
      <figcaption>在上面勾选、修改宽度高度与各项窗口配置，感受不同参数组合下窗口的样子；再点「模拟生命周期」，看事件按真实顺序一条条点亮，尤其留意 <code>ready-to-show</code> 排在 <code>show</code> 之前。</figcaption>
      <E02MainWindow />
    </figure>

    <h2>原生窗口安全基线</h2>
    <p>
      <code>BrowserWindow</code> 是把"操作系统窗口"和"一个网页"缝在一起的那层。创建时用 <code>show: false</code> 避开白屏，用生命周期事件抓住 <code>ready-to-show</code> 与 <code>closed</code> 两头，再把 <code>nodeIntegration: false</code>、<code>contextIsolation: true</code> 作为不可动摇的安全基线写进 <code>webPreferences</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「BrowserWindow」</span>是主进程中创建原生窗口的构造函数，一个实例对应一个渲染进程；构造参数既描述外观（尺寸、边框、置顶、背景色），也能用 <code>show: false</code> 延迟显示，<code>webPreferences</code> 则决定该渲染进程的能力边界。它<strong>只能在主进程里使用</strong>，渲染进程中不存在；窗口触发 <code>closed</code> 后对象即被销毁，相关引用必须及时置空。
    </div>
  </LessonArticle>
</template>
