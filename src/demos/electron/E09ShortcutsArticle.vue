<script setup lang="ts">
import E09Shortcuts from './E09Shortcuts.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给应用做了个"按 Ctrl+Shift+K 唤起窗口"的功能，用 <code>globalShortcut.register</code> 注册。上线后有人反馈按了没反应——那个组合被输入法抢先占用了，而 <code>register</code> 返回的 <code>false</code> 你根本没看；更糟的是，有人退出应用后这个键在别的软件里也失灵了，只能重启电脑。
    </div>

    <h2>提出问题</h2>
    <p>
      你希望应用不在前台时也能被一个按键唤起——比如全局截图、快速记一笔。但渲染进程里能监听的只有 <code>keydown</code>，而它<strong>只在窗口聚焦时收到事件</strong>：用户一切到别的软件，你的按键监听就是死的。
    </p>
    <p>
      想让"未聚焦也响应"就得去系统层注册按键，这里有三笔隐藏成本：<strong>跨平台没有统一的自建接口</strong>，各系统的全局钩子 API 完全不同，自己写等于维护三套；<strong>键位是全局共享资源</strong>，你占了别的应用就用不了，不检测冲突就会静默失败、或者霸占别人的常用键；<strong>注册了就必须释放</strong>，忘了注销，应用退出后那条按键绑定还留在系统里，别的软件按这个键也没反应，用户只能重启。
    </p>
    <p>
      所以要问的是：怎样让按键在应用未聚焦时也能触发，并且不抢占、不残留？
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的写法是在主进程里调 <code>globalShortcut.register('CommandOrControl+Shift+K', callback)</code>，放在 <code>app.whenReady()</code> 之后注册。
    </p>
    <p>
      这个方案做对了一件事：<strong>它拿到的是系统级的按键监听，应用不在前台也能被触发</strong>。<code>CommandOrControl</code> 前缀还能自动跨平台——macOS 上是 ⌘、其他系统是 Ctrl。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>不看 <code>register</code> 的返回值：键位被别的应用占用时返回 <code>false</code>，回调根本不触发，而你毫不知情，用户按了没反应只能来投诉。</li>
      <li>不检测是否已注册：同一个键位注册两次，第二次静默失败或覆盖，行为变得不确定。</li>
      <li>退出时不注销：应用关了，系统里的按键绑定还在，别的软件按这个键也没反应，直到重启电脑。</li>
      <li>在渲染进程里注册：<code>keydown</code> 只在窗口聚焦时触发，切走就失效——想要"全局"却写错了地方。</li>
      <li>用系统保留键（如 <code>Ctrl+Alt+Delete</code>）：操作系统自己占用，永远注册不上。</li>
      <li>回调里直接操作某个窗口变量：用户切走期间窗口可能已被关闭，回调触发时操作的是已销毁的窗口。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      第一步，<strong>注册前检查、注册后校验</strong>。先用 <code>globalShortcut.isRegistered(accel)</code> 看这个键是否已被占用，再调 <code>register</code> 并用它的布尔返回值确认是否成功；一旦失败，就给用户一个降级提示（换个键、或告知"该键已被占用"），<strong>绝不强行覆盖别人的键位</strong>。
    </p>
    <p>
      第二步，确认注册地点。<code>globalShortcut</code> 只能在主进程使用；如果键位要由用户界面触发注册，就经 preload + IPC 把键位传给主进程去注册，触发时主进程再决定是直接执行动作、还是把事件回传渲染进程。
    </p>
    <p>
      第三步，<strong>退出时务必释放</strong>。在 <code>will-quit</code> 里调用 <code>globalShortcut.unregisterAll()</code>（或逐个 <code>unregister</code>）。这是硬性要求——不释放，残留的系统级绑定会一直占着那个键。
    </p>
    <p>
      第四步，把两种快捷键分清楚，这是本课最容易混的地方：
    </p>
    <ol class="lesson-steps">
      <li><strong>菜单 <code>accelerator</code></strong>：写在 MenuItem 上，由菜单系统自动注册，会显示在菜单里，只在应用聚焦（菜单栏可见）时生效。</li>
      <li><strong>全局快捷键 <code>globalShortcut</code></strong>：系统级，应用未聚焦也能触发，不显示在任何界面上，需要你自己管生命周期（注册、检查、注销）。</li>
      <li>同一个功能不要两处都绑：既写 <code>accelerator</code> 又用 <code>globalShortcut</code> 注册同一个键，会互相冲突。</li>
    </ol>
    <p>
      最后补可配置与健壮性。把用户的键位存进配置，启动时统一注册；改键时<strong>先注销旧绑定、再注册新绑定</strong>；回调里操作窗口前先确认它仍然存在（必要时重建），不要假设用户切走的这段时间里窗口一直可用。
    </p>
    <div class="lesson-box warn">
      <strong>别混淆这两者：</strong><code>accelerator</code> 只在应用聚焦时生效，需要"未聚焦也响应"就必须用 <code>globalShortcut</code>；而全局快捷键是系统级资源，注册失败时应给出降级提示，而不是强行抢占。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>勾选几个常用快捷键，再点「模拟触发」看它像主进程回调那样被唤起；取消勾选就相当于注销——正好对应 <code>register</code> 与 <code>unregister</code> 这一对动作。</figcaption>
      <E09Shortcuts />
    </figure>

    <h2>总结</h2>
    <p>
      要让按键在应用未聚焦时也生效，就得用主进程的 <code>globalShortcut</code>：注册前用 <code>isRegistered</code> 查冲突、用返回值确认成败，退出时在 <code>will-quit</code> 里 <code>unregisterAll</code> 释放。它和菜单上的 <code>accelerator</code> 是两回事——前者是系统级资源、要自己管生命周期，后者交给菜单系统、只在聚焦时生效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「accelerator（加速度键）」</span>是写在 MenuItem 上、用来声明快捷键的字符串，如 <code>CmdOrCtrl+Shift+K</code>；用 <code>CmdOrCtrl</code> 前缀即可跨平台，菜单系统会自动注册并把它显示在菜单项右侧。它的边界是<strong>只在应用聚焦时生效、也不等于全局快捷键</strong>；若要应用未聚焦也响应，必须另用 <code>globalShortcut</code> 注册，且不要让两者绑定同一个键位。
    </div>
  </LessonArticle>
</template>
