<script setup lang="ts">
import E04Preload from './E04Preload.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>预加载脚本里本来只想让页面能读个版本号，图省事多写了一行把整个 <code>ipcRenderer</code> 挂到 <code>window</code> 上——结果一次第三方脚本注入，就能顺着这个接口删掉你电脑上的文件。同一行代码，为什么把安全边界整个交了出去？
    </div>

    <h2>页面能力最小供给</h2>
    <p>
      页面需要一点点原生能力：读个版本号、存取一份配置。但页面本身是<strong>不可信</strong>的——它加载的第三方库、内联的模板、远程拉来的资源，任何一处都可能被注入脚本。能力越方便地交出去，被滥用时的破坏面就越大。
    </p>
    <p>
      旧办法是把能力直接摊给页面：要么打开 <code>nodeIntegration</code> 让页面自己 <code>require('fs')</code>，要么把整个 <code>ipcRenderer</code> 对象挂到 <code>window</code> 上。它同样带来三笔必须由人承担的成本：<strong>页面一旦被注入就等于拿到这些能力的完全控制权</strong>；<strong>你无法限定它"只能做你允许的那几件事"</strong>，任意通道名它都能调；<strong>出事后无从审计</strong>，因为压根没有一份"页面被允许做什么"的清单。
    </p>
    <p>
      那怎么才能只交出"刚好够用的那几个函数"，而不是一整串钥匙？
    </p>

    <h2>预加载白名单</h2>
    <p>
      预加载脚本在渲染进程加载页面<strong>之前</strong>运行，是唯一同时能触及受限 Node 子集与 Electron API 的地方。就在这个时机，把需要的能力一个个挂出去：
    </p>
    <p>
      <code>contextBridge.exposeInMainWorld('api', { getVersion: () =&gt; ipcRenderer.invoke('app:get-version'), saveFile: (data) =&gt; ipcRenderer.invoke('file:save', data) })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>页面拿到的是 <code>window.api.getVersion()</code> 这样的窄接口，而不是 <code>ipcRenderer</code></strong>。能力边界由你亲手划定，页面能碰到的，只有你写进这份对象里的方法。演示里那个"安全写法"面板，展示的正是这一版。
    </p>

    <h2>整体暴露的危险</h2>
    <ul>
      <li>如果暴露的是整个 <code>ipcRenderer</code> 对象，页面就能 <code>window.api.ipcRenderer.invoke('任意通道')</code>，连你没打算给它用的通道也一并敞开，边界形同虚设。</li>
      <li>暴露整个 <code>os</code>、<code>fs</code> 模块，或干脆把 <code>require</code> 递给页面，等于把 Node 摊开，最小权限原则被直接违反。</li>
      <li>暴露出去的若是普通对象，页面能改写它——比如覆盖 <code>window.api.saveFile</code>，之后再调用就被劫持了。</li>
      <li>页面若只加事件监听、从不移除，组件反复挂载会让监听器越堆越多，最终内存泄漏。</li>
    </ul>

    <h2>暴露粒度控制</h2>
    <p>
      先补"暴露粒度"这一步，因为它直接决定攻击面。原则是<strong>逐一暴露方法，绝不暴露容器对象</strong>：页面能拿到 <code>saveFile</code> 这个函数，却拿不到 <code>ipcRenderer</code>、<code>require</code>、<code>process</code> 本体，每个函数内部才把参数整形后转给指定的通道。
    </p>
    <p>
      再补这套机制为什么会成立。它靠的是<strong>上下文隔离</strong>（<code>contextIsolation: true</code>，Electron 12 起默认开启）：预加载脚本访问的 <code>window</code> 和页面访问的 <code>window</code> 不是同一个对象，<code>exposeInMainWorld</code> 是唯一能安全穿过这两个上下文的方式，底层还会自动处理类型转换、防止原型链污染。
    </p>
    <p>
      再补"只给必需 + 接口固定"。按领域给方法分组命名，比如 <code>app:</code>、<code>file:</code>、<code>window:</code> 前缀，让人一眼看出每个接口属于哪块能力；暴露出去的对象用 <code>Object.freeze</code> 固定，防止页面改写。
    </p>
    <p>
      最后补两道收尾。其一，在 preload 里对参数做第一道类型收窄——注意这只是"第一道"，主进程 handler 的校验仍不可省，两者是纵深上的配合而非互相替代。其二，凡是提供 <code>onXxx</code> 监听的接口，都配套提供一个 <code>removeXxxListener</code>，让页面能主动清理监听器，避免堆积。
    </p>
    <div class="lesson-box warn">
      <strong>最危险的那一行：</strong>把 <code>ipcRenderer</code> 整个暴露出去。被注入的页面可借它调用任意通道，进而触发删文件、起进程一类的主进程敏感操作——preload 里只做通道转发与参数整形，复杂业务逻辑留在主进程，才便于测试与安全审计。
    </div>

    <h2>安全危险示例对照</h2>
    <figure class="lesson-figure">
      <figcaption>先点「查看安全示例」，看白名单逐一暴露长什么样；再点「查看危险示例」，对照把整个 <code>ipcRenderer</code> 暴露后，攻击者能顺手调用哪些通道。</figcaption>
      <E04Preload />
    </figure>

    <h2>能力交出边界</h2>
    <p>
      预加载脚本的关键不在于"它能拿到多少能力"，而在于"它到底交出了多少"。上下文隔离划出两个世界，<code>exposeInMainWorld</code> 是唯一的过桥通道，再靠逐方法暴露、只给必需、接口固定三条，让页面的能力<strong>恰好等于你显式授予的那些</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「contextBridge」</span>是上下文隔离下唯一能安全跨越两个上下文的桥梁，<code>contextBridge.exposeInMainWorld(key, api)</code> 把白名单方法注入渲染进程的 <code>window</code>，底层自动做类型转换并防止原型污染。它<strong>只是"过桥的通道"，不是权限本身</strong>——真正的安全来自你只写进白名单的那些方法；<code>ipcRenderer</code>、<code>require</code> 这类原始对象绝不能原样递过去。
    </div>
  </LessonArticle>
</template>
