<script setup lang="ts">
import E06NativeMenu from './E06NativeMenu.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在渲染进程里用 <code>&lt;div&gt;</code> 画了一个漂亮的右键菜单，交互看着完全正常——直到用户选中一段文字想"复制"，去点你菜单里的"复制"，剪贴板里却什么都没有；那个浮层还会在别处点击时愣着不消失。
    </div>

    <h2>提出问题</h2>
    <p>
      桌面应用想把常用操作摆到用户顺手的地方：顶部一条菜单栏，右键再弹出一组上下文操作。你第一反应是自己画——用 HTML 和 CSS 做菜单，想放什么就放什么。可一旦动手就会发现，菜单栏里的"撤销""复制""粘贴"这些词不是文案，而是<strong>系统已经实现好的动作</strong>：你画出来的只是一个长得像菜单的盒子，点下去不会真的触发系统的编辑行为，也拿不到那些动作的启用/禁用状态。
    </p>
    <p>
      自己维护一套菜单还要背上三笔隐藏成本：<strong>平台菜单结构不一样</strong>，macOS 顶端第一个菜单是应用名，里面装着"关于 / 服务 / 隐藏 / 退出"，Windows 与 Linux 没有这一项，硬编码一套结构，到了另一个系统就会缺项或重复；<strong>文案与快捷键要自己本地化</strong>，"复制"在英文系统里该显示 Copy、快捷键要按平台显示 ⌘ 或 Ctrl，全靠手写永远对不齐；<strong>启用状态无人托管</strong>，没有选中文字时"复制"本该置灰，这套状态逻辑没人替你维护。
    </p>
    <p>
      所以要问的是：有没有一种写法，让操作系统自己去构建这份菜单——包括外观、本地化、快捷键和启用状态？
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法是用 <code>Menu.buildFromTemplate(template)</code> 把菜单描述成一个数组，再用 <code>Menu.setApplicationMenu(menu)</code> 挂上去。模板就是普通对象：<code>{ label: '文件', submenu: [...] }</code>，子项可以是分隔线 <code>{ type: 'separator' }</code>，也可以带 <code>accelerator</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>把菜单从"像素和事件"变成了"结构描述"</strong>。你只声明"这里有一个叫文件的菜单，里面有一项新建"，剩下的渲染外观、快捷键提示、平台细节，全交给操作系统去办；这套代码必须写在<strong>主进程</strong>里，因为菜单是系统资源，渲染进程只负责通过 IPC 请求"弹一下右键菜单"。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>给"复制"手写 <code>click</code>：点下去剪贴板里什么都没有——DOM 层拿不到系统的编辑剪贴板，这个动作只能由系统来做。</li>
      <li>只写 <code>label: '复制'</code> 不写 <code>role</code>：英文系统的用户看到的仍是中文，快捷键提示也不对，翻译还得自己维护。</li>
      <li>快捷键写死成 <code>'Ctrl+S'</code>：macOS 用户看到的还是 Ctrl 而不是 ⌘，跨平台直接错位。</li>
      <li>菜单树写死一套：macOS 顶部少了应用名菜单，找不到"关于 / 退出"；Windows 上却莫名多出一个重复的"退出"。</li>
      <li><code>click</code> 里直接写 <code>mainWindow.show()</code>：窗口被关掉后再点菜单，操作的是已销毁的窗口，报错或毫无反应。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      第一件事是<strong>让标准动作用 role 声明</strong>。撤销、重做、剪切、复制、粘贴、全选、刷新、开发者工具、缩放、全屏、最小化、关闭、退出……这些都有对应的 <code>role</code>。写下 <code>{ role: 'copy' }</code>，系统就自动实现行为、本地化文案并绑定默认快捷键，比手写 <code>click</code> 又准又省。
    </p>
    <p>
      第二步补上平台结构差异。macOS 的第一个菜单应该是应用名，用 <code>process.platform === 'darwin'</code> 判断后在模板最前面插入：
    </p>
    <ol class="lesson-steps">
      <li>macOS 专用项：<code>{ label: app.name, submenu: [{ role: 'about' }, …, { role: 'quit' }] }</code>，把关于、服务、隐藏、退出都收在这里。</li>
      <li>文件菜单末尾的退出项：macOS 用 <code>{ role: 'close' }</code>（关窗），其他平台用 <code>{ role: 'quit' }</code>（退出应用）。</li>
      <li>窗口菜单里，macOS 额外加 <code>{ role: 'front' }</code>，其他平台用 <code>{ role: 'close' }</code>。</li>
    </ol>
    <p>
      第三步才轮到自定义动作。只有系统没有内置的动作——比如"新建文件""打开文件…"——才自己写 <code>click</code>，并配上跨平台的 <code>accelerator</code>，例如 <code>'CmdOrCtrl+N'</code>、<code>'CmdOrCtrl+Shift+S'</code>；前缀用 <code>CmdOrCtrl</code>，就能在 macOS 上自动显示成 ⌘、在 Windows/Linux 上显示成 Ctrl。
    </p>
    <p>
      第四步处理窗口的安全取用。<code>click</code> 里不要直接用某个保存下来的窗口变量（它可能已销毁），而是调用 <code>BrowserWindow.getFocusedWindow()</code> 取当前聚焦窗口并判空，取不到就安全返回。
    </p>
    <p>
      最后补上下文菜单。右键菜单同样是<strong>一份模板</strong>，只是用 <code>menu.popup({ window, x, y })</code> 在指定位置弹出。渲染进程拿不到 <code>Menu</code>，所以流程是：渲染进程把坐标通过 IPC 发给主进程，主进程用 <code>BrowserWindow.fromWebContents(event.sender)</code> 找到发起请求的窗口再弹出。还有一个容易忽略的点：<strong>菜单的更新是"重建再挂载"</strong>——要改菜单时，重新 <code>buildFromTemplate</code> 一份新的再 <code>setApplicationMenu</code>，而不是去改已挂载的那个实例。
    </p>
    <div class="lesson-box warn">
      <strong>两个边界：</strong><code>accelerator</code> 只在应用聚焦（菜单栏可见）时生效；要让应用未聚焦时也响应按键，得改用 <code>globalShortcut</code>，两者职责别混。另外，菜单栏归属有平台差异——<strong>macOS 的菜单栏属于应用整体，Windows 与 Linux 的菜单栏属于某个窗口</strong>，这决定了你更新菜单时的影响范围。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>把鼠标移到菜单条上的"文件 / 编辑 / 视图 / 帮助"逐项展开，点任意一项，看它落进下方的"点击了: xxx"——这一刻对应的就是主进程里那项 <code>click</code> 回调被触发。</figcaption>
      <E06NativeMenu />
    </figure>

    <h2>总结</h2>
    <p>
      原生菜单的关键，是把"菜单长什么样、点了做什么"交还给系统：用 <code>buildFromTemplate</code> 声明结构、用 <code>setApplicationMenu</code> 挂载，标准动作交给 <code>role</code>，平台差异用 <code>process.platform</code> 单独补，自定义动作才写 <code>click</code> 和 <code>accelerator</code>。它必须住在主进程——渲染进程只发一句"请求弹菜单"，真正的构建与系统绑定都发生在主进程。
    </p>
    <div class="lesson-term">
      <span class="term-name">「role（角色）」</span>是 MenuItem 上声明"这一项是系统标准命令"的字段，例如 <code>copy</code>、<code>paste</code>、<code>undo</code>、<code>quit</code>。它会由系统实现行为、本地化文案并绑定默认快捷键。两条边界要记住：<strong>设了 <code>role</code> 就不该再指望自己的 <code>click</code> 生效</strong>（标准行为已经接管）；而且不是所有动作都有 role，业务动作必须自己写 <code>click</code>。
    </div>
  </LessonArticle>
</template>
