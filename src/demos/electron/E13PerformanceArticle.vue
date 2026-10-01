<script setup lang="ts">
import E13Performance from './E13Performance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>应用冷启动要八秒，白屏一直挂在那儿。你在创建窗口前后打了时间戳，发现<code>new BrowserWindow</code> 本身只花了不到两百毫秒——那多出来的七秒多，凭什么也算在「启动」头上？
    </div>

    <h2>提出问题</h2>
    <p>
      「慢」其实不是一个问题，而是三个：<strong>启动慢</strong>（从双击到首屏出现）、<strong>内存高</strong>（多开几个窗口就上 GB）、<strong>渲染卡</strong>（长列表一滚就掉帧）。用同一把尺子量这三件事，必然优化错地方。
    </p>
    <p>
      旧办法的毛病也很典型：凭感觉优化，哪儿慢就随手加个缓存，改完也不知道到底有没有用；把所有逻辑都堆在启动路径上，<code>app.whenReady()</code> 之前就同步读了一堆文件、<code>require</code> 了一堆重模块，把主进程启动堵死，窗口根本没机会露面；每开一个窗口就新建渲染进程、关掉又不释放引用，内存只涨不降；长列表则把上万行一次全渲染进 DOM。
    </p>
    <p>
      于是问题变成：怎么先把「慢在哪」量出来，再分别对症下药？
    </p>

    <h2>最小方案</h2>
    <p>
      先别急着改代码，先量。主进程里用 <code>process.memoryUsage()</code> 定时采样 <code>rss</code>（常驻内存），再用一张时间线把「双击 → 主进程 ready → 窗口创建 → 首屏渲染」几个关键点记下来；渲染侧就用 DevTools 的 Performance 面板录一段启动和关键交互。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「先测量、后优化」定成了顺序</strong>。有了数据，你会立刻发现那七秒根本不在创建窗口那一步，而在它前面被你同步堵住的主进程启动阶段。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>只测 <code>createWindow</code> 的耗时：漏掉了启动阶段那些同步 I/O 和 <code>require</code> 的阻塞，首帧其实是被它们拖住的。</li>
      <li>每个额外打开的渲染进程都有几十 MB 量级的内存成本，窗口随意堆叠很快把内存吃光。</li>
      <li>窗口与 <code>WebContents</code> 关闭后引用没释放：GC 收不回，内存只涨不降。</li>
      <li>长列表一次性渲染全部行：DOM 节点上万，滚动必然卡。</li>
      <li>后台窗口里的定时器和动画还在照常跑：白白耗 CPU 和电，用户却看不见。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先切启动路径，因为首屏速度是用户最直观的感受。两条：主进程里<strong>避免同步 I/O</strong>——能异步就异步，或者延后到窗口出现之后再做；<strong>非关键模块延迟加载</strong>——别在 <code>app.whenReady()</code> 之前 <code>require</code> 全量模块，等首屏出来、系统空闲时再动态 <code>import()</code>。在渲染进程里，把不影响首屏的任务交给 <code>requestIdleCallback</code>，让浏览器挑空闲帧去跑，别和首屏抢主线程。
    </p>
    <p>
      接着松开「首屏必须等数据」这个执念：首屏不必等全部数据就绪。先用骨架屏把窗口尽快显示出来，真实内容再渐进填充——<strong>让窗口尽早可见，比把所有启动逻辑一次前置更有效</strong>。
    </p>
    <p>
      再补内存这条线。定时用 <code>process.memoryUsage()</code> 采样 <code>rss</code>，定位异常增长；窗口关闭时主动释放对窗口和 <code>WebContents</code> 的引用；控制同时打开的窗口数量。想精确定位就打开 DevTools 的 Memory 面板拍堆快照，对比两次快照找出泄漏的对象。
    </p>
    <p>
      然后是渲染这条线。长列表用<strong>虚拟滚动</strong>，只渲染当前视口里的那几行、滚动时复用节点；事件用防抖 / 节流；能交给 GPU 的动画用 CSS 硬件加速；重计算丢给 Web Worker 或子进程，别卡住 UI。
    </p>
    <p>
      最后说一个容易被忽略的开关 <code>backgroundThrottling</code>。窗口失焦、切到后台后，Chromium 默认会节流它里面的定时器和动画（<code>backgroundThrottling</code> 默认为 <code>true</code>），省下不少 CPU 和电。<strong>只有当后台窗口仍需精确计时</strong>（比如一个计时类应用）时才考虑把它关掉——代价是后台也照常耗资源，大多数应用保持默认就好。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对照三张优化卡片（启动 / 内存 / 渲染），再读示例里「延迟加载重模块」与「定时采样 RSS」两段代码，看每条优化各自对应哪条性能线、该在哪一步动手。</figcaption>
      <E13Performance />
    </figure>

    <h2>总结</h2>
    <p>
      性能优化不是「哪里慢改哪里」，而是先分线再对症：用 <code>process.memoryUsage()</code> 和 DevTools 把瓶颈量出来，启动上砍同步 I/O、延迟加载重模块、首屏先给骨架，内存在窗口关闭时释放引用，渲染上用虚拟滚动与 <code>requestIdleCallback</code> 把工作挪出主线程。慢的往往不是你以为的那一步。
    </p>
    <div class="lesson-term">
      <span class="term-name">「虚拟列表（虚拟滚动）」</span>只渲染当前视口里可见的少量行，滚动时按 <code>scrollTop</code> 换算出可见区间、复用 DOM 节点，把 DOM 数量从「数据总量」降到「视口行数」。边界：需要每行等高或能预估高度；被虚拟掉的节点不在 DOM 里，所以浏览器原生页内查找（Ctrl+F）找不到它们，锚点跳转和「滚动到第 N 行」也得自己算偏移量。
    </div>
  </LessonArticle>
</template>
