<script setup lang="ts">
import E12Security from './E12Security.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你做了个笔记应用，正文是富文本编辑器。测试时同事粘进来一段从网页复制的 HTML，里面藏了一个看不见的 <code>&lt;img src=x onerror="require('child_process').exec('calc')"&gt;</code>。保存、刷新——你本机的计算器弹了出来。一个网页里的 XSS，凭什么能在你的应用里执行系统命令？
    </div>

    <h2>脚本注入风险升级</h2>
    <p>
      Electron 的渲染进程本质就是一个 Chromium 窗口，里面跑着你的页面和用户的输入。只要这里有 XSS，就等于有人在你的应用里执行任意脚本。真正决定后果的是另一件事：<strong>这段脚本手里有多少权限</strong>。如果渲染进程还带着 Node 能力，那它就能直接 <code>require('child_process')</code> 执行系统命令——XSS 升级成了 RCE（远程代码执行），而主进程是唯一还能信任的边界。
    </p>
    <p>
      旧办法的毛病都出在「默认太宽松」：渲染进程默认能碰 Node，<code>require</code> 随手可用，一个注入点就直通系统；<code>preload</code> 脚本和页面共享同一个全局上下文，页面能篡改 preload 暴露出来的对象；没有 CSP，内联脚本、远程脚本想加载就加载；页面里的新窗口和跳转没人管，一点就可能把窗口带到任意站点上。
    </p>
    <p>
      所以问题变成：怎样把渲染进程的能力收得只剩「渲染」，同时把注入与导航都挡在边界之外？
    </p>

    <h2>渲染进程能力关闭</h2>
    <p>
      最直接的一步：创建窗口时改 <code>webPreferences</code>——<code>nodeIntegration: false</code>、<code>contextIsolation: true</code>、<code>webSecurity: true</code>，需要的能力只通过 <code>preload</code> 加 <code>contextBridge</code> 显式暴露。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「渲染进程能不能碰 Node」从默认开放改成了默认关闭</strong>，你要什么再明确开口。渲染进程从此只是一个网页，页面里跑再怪的脚本也拿不到 <code>require</code>。
    </p>

    <h2>隔离失效与防护漏洞</h2>
    <ul>
      <li>只关 <code>nodeIntegration</code> 不够：<code>contextIsolation</code> 若为 <code>false</code>，页面和 preload 在同一上下文里，页面可以污染 <code>Object.prototype</code> 之类的原型，让你写在校验里的判断悄悄失效。</li>
      <li>没有 CSP：隔离做得再好，页面里照样能内联执行 <code>&lt;script&gt;</code>、从远程拉脚本，XSS 本身还在。</li>
      <li>不拦新窗口与导航：页面里一个 <code>&lt;a target="_blank"&gt;</code> 或一次 <code>location</code> 跳转，就能把窗口带到任意站点，钓鱼页可以做得和你的应用一模一样。</li>
      <li>为本地调试把 <code>webSecurity</code> 关掉：跨域与 <code>file://</code> 读取全部放开，等于把刚锁上的门又开了。</li>
      <li><code>shell.openExternal</code> 直接吃用户给的 URL：一旦有人传 <code>file://</code> 或自定义协议进来，就可能触发本机命令执行。</li>
      <li>依赖不体检：某个包爆出已知漏洞你不会知道，攻击面在悄悄扩大。</li>
    </ul>

    <h2>最小权限与内容安全</h2>
    <p>
      第一步先把「最小权限」落进 <code>webPreferences</code>：<code>nodeIntegration: false</code>、<code>contextIsolation: true</code>、<code>webSecurity: true</code>，<code>sandbox</code> 保持默认开启。这是地基，后面所有措施都建立在「渲染进程没有额外权限」之上。
    </p>
    <p>
      第二步把能力搬进 preload 里显式暴露。有了上下文隔离，preload 与页面跑在不同的 V8 世界里，<code>contextBridge.exposeInMainWorld('api', { ... })</code> 是唯一的桥；桥这边只暴露一个个具体方法，<strong>不要把 ipcRenderer 整个对象挂上去</strong>——那等于把钥匙串整串交出去。
    </p>
    <p>
      第三步补 CSP，它是「就算脚本被注入也让它施展不开」的兜底。在 <code>&lt;head&gt;</code> 最顶部写一条 meta，把 <code>default-src 'self'</code>、<code>script-src 'self'</code> 收紧，<strong>禁止 <code>unsafe-inline</code> 与 <code>unsafe-eval</code></strong>（样式上留一个可控的 <code>'unsafe-inline'</code> 一般可以接受）。这样内联脚本和 <code>eval</code> 直接失效，注入的执行链被掐断。
    </p>
    <p>
      第四步把「导航」也拦起来。用 <code>webContents.setWindowOpenHandler(() =&gt; ({ action: 'deny' }))</code> 拒绝页面自作主张开新窗口；确实要开外链，就显式改走 <code>shell.openExternal</code>，<strong>并且对协议和域名做白名单校验</strong>，只放行 <code>https:</code>。再用 <code>will-navigate</code> 拦下窗口自身的跳转，凡是跳去非本应用源的地址一律阻止——这一步防的是「把用户带到伪造页面上」。
    </p>
    <p>
      第五步补运维习惯：只加载可信内容、不加载远程脚本，定期跑 <code>npm audit</code> / <code>npm outdated</code> 做依赖体检。
    </p>
    <p>
      最后一条最容易被漏掉：<strong>渲染进程要当成「随时可能被攻破」来对待</strong>，所以主进程是信任边界——所有经 IPC 传进主进程的参数都要校验，不能因为「这是我自己页面发的」就照单全收。
    </p>

    <h2>安全清单逐项核对</h2>
    <figure class="lesson-figure">
      <figcaption>逐条对照安全检查清单（绿勾=已达标、红叉=待修），再读下方代码示例中 BrowserWindow 与 CSP 的正确写法，确认 <code>nodeIntegration</code> / <code>contextIsolation</code> / <code>webSecurity</code> 与 CSP 各自该设成什么。</figcaption>
      <E12Security />
    </figure>

    <h2>信任边界与权限收敛</h2>
    <p>
      安全加固的核心，是把渲染进程的权限压到最小：默认关掉 Node、开启上下文隔离、用 preload 白名单暴露能力，再用 CSP、导航拦截与依赖审计把注入的后果封死在渲染进程里。记住主进程是信任边界，渲染进程送来的一切都要当成不可信。
    </p>
    <div class="lesson-term">
      <span class="term-name">「上下文隔离（contextIsolation）」</span>把 preload 脚本与页面 JS 跑在<strong>两个独立的 V8 上下文</strong>里，两者不能直接改对方的全局对象，唯一的通道是 <code>contextBridge</code>。它自 Electron 12 起默认开启；一旦关成 <code>false</code>，页面就和 preload 共享上下文，可以污染原型链绕过你的校验。开启后 preload 里不能再直接往 <code>window</code> 挂属性，必须走 <code>contextBridge.exposeInMainWorld</code>。
    </div>
  </LessonArticle>
</template>
