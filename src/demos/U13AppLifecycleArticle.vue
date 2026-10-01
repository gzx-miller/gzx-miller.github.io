<script setup lang="ts">
import U13AppLifecycle from './U13AppLifecycle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>App.vue</code> 里写「启动时从缓存恢复登录态」，测试时一切正常。可用户把 App 切到后台、几个小时后切回来，token 明明已经在服务端过期了，你的恢复逻辑却一点反应都没有——同一段代码，冷启动管用，切回前台就失灵。
    </div>

    <h2>提出问题</h2>
    <p>
      原因是：应用有它自己的「一生」，和单个页面的一生<strong>不是一回事</strong>。页面会被创建、显示、隐藏、销毁，一个页面可以反复进出；而应用只在启动时被创建一次，之后就是「进前台 / 退后台」的循环。你的登录态恢复写在了「只发生一次」的那个时刻，自然管不住「每次回到前台」的那件事。
    </p>
    <p>
      旧办法习惯把应用级的事塞进页面里，代价同样藏在三处。第一，<strong>全局初始化被放进了某个页面</strong>，比如写在首页的 <code>onLoad</code>，可用户从扫码直达详情页时，首页压根没执行，初始化全部落空。第二，<strong>跨页面要共享的数据被塞进某个页面的 <code>data</code></strong>，别的页面读不到，只好各自再请求一次。第三，<strong>异常没有统一出口</strong>，线上白屏了却拿不到任何日志。
    </p>
    <p>
      问题于是分成两半：<strong>应用的启动与前后台切换，该在哪一层处理？跨页面要共享的那些数据，又该放在哪里？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：挑一个「用户一定会经过」的页面，在它的 <code>onLoad</code> 里做初始化，把用户信息挂到一个模块级的变量上，别处 <code>import</code> 进来读。
    </p>
    <p>
      这个方案做对了一件事：<strong>它至少把初始化收敛到了一个点</strong>，不再让每个页面各初始化一遍。当应用只有一个入口、初始化也只做一次时，这样写是能跑的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>用户从扫码/分享链接直达详情页，作为「入口」的那个首页 <code>onLoad</code> 根本没执行，初始化整个落空。</li>
      <li>把登录态校验写在 <code>onLaunch</code> 里，热启动（从后台切回）不会重跑它，token 过期了也毫无察觉。</li>
      <li>用户信息存进某个页面的 <code>data</code>，换个页面就读不到，只能每个页面再发一次请求，数据还容易不一致。</li>
      <li>未捕获的异常没有兜底，真机上白屏了，日志里却什么都没有，问题根本无从查起。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「收敛初始化」，而是把「应用的一生」正式交给应用入口 <code>App.vue</code>。它承载四个<strong>应用级生命周期</strong>：
    </p>
    <ol class="lesson-steps">
      <li><code>onLaunch</code>：应用初始化完成时触发，<strong>全局只执行一次</strong>。放一辈子只做一次的事——读本地缓存、初始化全局状态、检查版本更新。</li>
      <li><code>onShow</code>：应用进入前台，<strong>首次启动和从后台切回都会触发</strong>。</li>
      <li><code>onHide</code>：应用进入后台，用来做收尾，如保存草稿。</li>
      <li><code>onError</code>：捕获未处理的异常，统一上报。</li>
    </ol>
    <p>
      接着要理解它们的<strong>层次关系</strong>：应用生命周期<strong>包住</strong>页面生命周期。<strong>冷启动</strong>时，顺序大致是 <code>App.onLaunch</code> → <code>App.onShow</code> → 首个页面的 <code>onLoad</code> → <code>onShow</code> → <code>onReady</code>；而<strong>热启动</strong>（从后台切回）只触发 <code>App.onShow</code>——页面实例还活着，不会重新 <code>onLoad</code>，<code>onLaunch</code> 也不会重跑。这条推论直接决定了逻辑该放哪：<strong>「一辈子只做一次」的放 <code>onLaunch</code>，「每次回到前台都要做」的放 <code>onShow</code></strong>。开场那个失灵的登录态恢复，正确位置就是 <code>onShow</code>，而不是 <code>onLaunch</code>。
    </p>
    <p>
      再解决「跨页面共享数据放哪」。挂在应用实例上的 <code>globalData</code> 可以用 <code>getApp().globalData</code> 在任意页面读写，正适合用户信息、登录态这类「要跨页面、但不怎么频繁变」的数据。但它有一条必须记住的边界：<strong><code>globalData</code> 不是响应式的</strong>，改它不会自动刷新视图——页面要用，得在 <code>onShow</code> 里把它同步一份到自己的 <code>data</code> / <code>ref</code>。所以凡是高频共享、需要驱动视图的状态，应该交给 Pinia 或全局 store，而不是硬塞进 <code>globalData</code>。
    </p>
    <p>
      再往下，把「必做的两件事」落到具体钩子上：<strong>登录态恢复</strong>——<code>onLaunch</code> 里读缓存、<code>onShow</code> 里每次复核（因为热启动只走 <code>onShow</code>）；<strong>版本更新</strong>——小程序端用 <code>uni.getUpdateManager()</code> 探测新版本并提示用户重启。这两件事不写在 <code>App.vue</code>，就一定要在某个入口页里重复写，而入口页是会被绕过的。
    </p>
    <p>
      最后一个容易混的点：<strong><code>App.vue</code> 是入口，不是配置中心</strong>。<code>appid</code>、页面路由、窗口样式这些配置写在 <code>pages.json</code> / <code>manifest.json</code> 里；<code>App.vue</code> 只放全局逻辑和全局样式。
    </p>
    <div class="lesson-box warn">
      <strong>两条最常踩的边界：</strong><code>onLaunch</code> 只在<strong>冷启动</strong>执行一次，「从后台切回前台」不会重跑它，把登录态校验、数据刷新写在 <code>onLaunch</code>，热启动时就会全部失效，这类逻辑要放到 <code>onShow</code>；另外 <code>globalData</code> 的改动<strong>不会触发视图更新</strong>，别拿它当响应式状态用。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>依次点「启动」「切后台」「回前台」：日志里 <code>onLaunch</code> 只会出现一次，而 <code>onShow</code> / <code>onHide</code> 会反复出现；右侧面板显示的，就是页面侧用 <code>getApp().globalData</code> 能读到的共享数据。</figcaption>
      <U13AppLifecycle />
    </figure>

    <h2>总结</h2>
    <p>
      应用生命周期和页面生命周期是两个层次：应用只出生一次，之后在前后台之间往返；页面会反复被创建和销毁。<strong>把「只做一次」的初始化放 <code>onLaunch</code>、「每次回前台」的逻辑放 <code>onShow</code>、异常兜底放 <code>onError</code></strong>，跨页面数据用 <code>getApp().globalData</code>，并记住它不响应式——这样冷启动、热启动、直达页三条路径才不会各漏一块。
    </p>
    <div class="lesson-term">
      <span class="term-name">「冷启动与热启动」</span>冷启动指应用进程不存在、从零拉起，会完整走一遍 <code>App.onLaunch</code> 与 <code>App.onShow</code>，并创建首个页面（<code>onLoad</code> → <code>onShow</code> → <code>onReady</code>）；热启动指应用已被系统保留在后台，再次打开<strong>只触发 <code>App.onShow</code></strong>，页面实例与 <code>globalData</code> 都还在，<code>onLaunch</code> 不会重跑。边界：依赖「启动时执行一次」的逻辑必须放 <code>onLaunch</code>，「每次回到前台都要做」的逻辑必须放 <code>onShow</code>，否则热启动必然漏掉。
    </div>
  </LessonArticle>
</template>
