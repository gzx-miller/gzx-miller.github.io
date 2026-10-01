<script setup lang="ts">
import E08Dialog from './E08Dialog.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户在选择文件的对话框里点了"取消"，你的代码照常往下走，<code>result.filePaths[0]</code> 拿到的是 <code>undefined</code>，读取文件时当场崩溃——对话框明明返回了结果，为什么它是个空壳？
    </div>

    <h2>原生对话框路径需求</h2>
    <p>
      桌面应用经常要向用户要一个文件路径：打开时让他选，保存时让他定位置，做危险操作前还要弹一个确认框。你想在页面里自己实现，很快就会发现寸步难行：用 HTML 的 <code>&lt;input type="file"&gt;</code> 只能拿到一个浏览器封装的 <code>File</code> 对象，<strong>拿不到真实的文件系统绝对路径</strong>，而桌面应用恰恰需要这个路径去读写磁盘。
    </p>
    <p>
      自己动手还有两笔成本：<strong>原生外观与行为对不上</strong>，macOS 的对话框会像一张便签贴在窗口顶部、Windows 是独立窗口，这些系统样式自绘永远模仿不到位；<strong>模态关系处理不了</strong>，真正的系统对话框弹出时会锁住父窗口，你的自绘浮层挡不住用户去点父窗口，模态就是假的。
    </p>
    <p>
      所以要问的是：怎样向用户要到文件路径或一次确认，并且把结果<strong>可靠地</strong>拿回主进程？
    </p>

    <h2>打开对话框调用</h2>
    <p>
      最直接的做法是 <code>await dialog.showOpenDialog(win, { properties: ['openFile'] })</code>，再从返回结果里取 <code>filePaths</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>拿到的是真实的文件系统绝对路径，而且对话框由操作系统原生绘制、自带真正的模态</strong>。它必须写在主进程——<code>dialog</code> 是主进程模块，渲染进程里根本没有它。
    </p>

    <h2>判空缺失与字段误读</h2>
    <ul>
      <li>不判断 <code>result.canceled</code>：用户点"取消"时 <code>filePaths</code> 是空数组，<code>filePaths[0]</code> 得到 <code>undefined</code>，下游拿去读文件直接崩。</li>
      <li>把 <code>dialog</code> 写在渲染进程：那里没有这个模块，导入就是 <code>undefined</code>，调用即报错；它也不该接触系统资源。</li>
      <li>三个 API 的返回值混用：打开返回 <code>{ canceled, filePaths }</code>、保存返回 <code>{ canceled, filePath }</code>（注意是单数）、消息框返回 <code>{ response }</code>，取错字段就静默出错。</li>
      <li>用了 <code>showOpenDialogSync</code> 这类同步版本：它<strong>阻塞主进程</strong>，对话框还开着的时候整个应用都不响应。</li>
      <li>调用时不传窗口参数：对话框不附着到任何窗口，父窗口还能被操作，模态名存实亡。</li>
    </ul>

    <h2>三类结果结构差异</h2>
    <p>
      第一件事是<strong>把三个 API 的返回结构分清楚，并且永远先判空</strong>：
    </p>
    <ol class="lesson-steps">
      <li><code>showOpenDialog</code> → <code>{ canceled, filePaths }</code>，<code>filePaths</code> 是数组，支持多选。</li>
      <li><code>showSaveDialog</code> → <code>{ canceled, filePath }</code>，注意是单数，返回用户敲定的完整路径。</li>
      <li><code>showMessageBox</code> → <code>{ response, checkboxChecked }</code>，<code>response</code> 是被点中按钮的索引。</li>
      <li>拿到结果后的第一句永远是 <code>if (result.canceled) return null</code>，判空之后再取字段。</li>
    </ol>
    <p>
      第二步补筛选与行为控制。用 <code>filters</code> 限定可选扩展名，例如 <code>{ name: '文本文件', extensions: ['txt', 'md'] }</code>；用 <code>properties</code> 控制行为：<code>'openFile'</code> 选文件、<code>'openDirectory'</code> 选目录、<code>'multiSelections'</code> 允许多选、<code>'showHiddenFiles'</code> 显示隐藏文件。
    </p>
    <p>
      第三步把消息框的按钮讲准。<code>buttons</code> 数组决定文案与顺序，<code>defaultId</code> 指定默认高亮的按钮，<code>cancelId</code> 指定按 ESC 时命中哪个按钮（通常指向"取消"）；<code>type</code> 决定图标语义（<code>info</code> / <code>error</code> / <code>question</code> / <code>warning</code>）；需要"不再提示"时加 <code>checkboxLabel</code>，结果里的 <code>checkboxChecked</code> 会告诉你用户怎么选的。
    </p>
    <p>
      第四步补模态归属：调用时把窗口实例作为<strong>第一个参数</strong>传进去——<code>dialog.showOpenDialog(win, ...)</code>。窗口实例从 IPC 里用 <code>BrowserWindow.fromWebContents(event.sender)</code> 拿回来，这样对话框才会正确附着在发起请求的那个窗口上（macOS 上会以 sheet 形式贴着窗口出现），多窗口应用里才不会弹错地方。
    </p>
    <p>
      最后补边界封装：对话框只在主进程调用，通过 preload + IPC 暴露成<strong>语义化</strong>的单一方法（<code>openFile</code> / <code>saveFile</code> / <code>confirm</code>），渲染进程只拿到最终路径或 <code>null</code>，完全不感知 <code>dialog</code> 的存在；同时坚决避开 <code>*Sync</code> 同步版本，别让它阻塞主进程。
    </p>
    <div class="lesson-box warn">
      <strong>记住两条硬边界：</strong>渲染进程不能直接使用 <code>dialog</code>，必须经 preload + IPC 交给主进程；同步版本（<code>showOpenDialogSync</code> 等）会阻塞主进程，一律避免。
    </div>

    <h2>三个页签结果对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「打开文件 / 保存文件 / 消息框」三个页签各点一次，看下方返回的是路径还是按钮索引——然后想象点"取消"时这些值会变成什么样。</figcaption>
      <E08Dialog />
    </figure>

    <h2>返回语义与调用封装</h2>
    <p>
      原生对话框把"向用户要路径、要一次确认"交给系统，但代价是你必须读懂它的返回结构：打开取 <code>filePaths</code>、保存取 <code>filePath</code>、消息框取 <code>response</code>，且<strong>每一步都先看 <code>canceled</code></strong>。把窗口实例传进去让对话框正确附着，再用 preload + IPC 把它封成渲染进程只认的简单方法，这套机制就既好用又安全。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模态对话框（modal dialog）」</span>指弹出后会阻止用户与父窗口交互、直到它被关闭的对话框。它的关键边界是<strong>附着关系：把窗口作为第一个参数传入，对话框才会真正绑定到该窗口</strong>（macOS 上以 sheet 形式贴附），父窗口才会被正确锁住；不传窗口参数时，行为会退化成孤立弹窗，多窗口场景下容易弹错窗口。
    </div>
  </LessonArticle>
</template>
