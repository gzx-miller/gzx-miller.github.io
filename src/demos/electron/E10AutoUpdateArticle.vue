<script setup lang="ts">
import E10AutoUpdate from './E10AutoUpdate.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给应用接好了自动更新，测试时一路顺利：发现新版本、下载、提示重启。可正式版发给用户后，macOS 用户点了"重启安装"，应用反而起不来了，系统提示"应用已损坏"。你在本机怎么都复现不出来——因为问题根本不在你那几行代码里。
    </div>

    <h2>提出问题</h2>
    <p>
      桌面应用一旦发出去，你就再也没法像网页那样"改一下就刷新"。想让用户拿到修复和新功能，只能靠更新。而让用户<strong>手动</strong>去官网下载新安装包重装，几乎等于没有更新——安全补丁发出去也没人装，旧版本会一直留在用户机器上。
    </p>
    <p>
      自己想办法推更新又会踩三笔成本：<strong>直接覆盖正在运行的程序文件</strong>在 Windows 上会被占用锁死，覆盖到一半断电就成了半损坏的安装；<strong>更新源不可信就无法验证来源</strong>，一旦服务器被劫持，你等于把任意代码安静地装进了用户机器，这是最严重的一条；<strong>升级时机不受控</strong>，下载完就强制重启会打断用户正在做的事。
    </p>
    <p>
      所以要问的是：怎样让应用自己发现新版本、安全地下载、验证来源、并在合适的时机完成升级？
    </p>

    <h2>最小方案</h2>
    <p>
      生产环境推荐用 electron-builder 配套的 <strong>electron-updater</strong>：主进程里用 <code>autoUpdater.setFeedURL(...)</code> 指向发布服务，再调 <code>checkForUpdatesAndNotify()</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把更新拆成了一条由事件驱动的流水线</strong>。应用会自己去发布服务读取 <code>latest.yml</code> 元数据、比对版本号、按需下载差量包——你不用像用 Electron 内置 <code>autoUpdater</code> 那样自建一套更新服务器。整条流程发生在主进程，渲染进程只负责展示进度、接收状态。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>在开发环境里调用：应用没打包时 <code>autoUpdater</code> 直接报错，本地根本走不通，容易误判成代码有问题。</li>
      <li>macOS 更新包没签名、没公证：下载完在安装阶段被系统拒绝，用户看到的就是那句"应用已损坏"。</li>
      <li>Windows 更新包没做 Authenticode 签名：既会被 SmartScreen 拦截，也无法检出被篡改的包。</li>
      <li>不处理下载进度：一个几十上百 MB 的包在后台静默下载，用户以为程序卡死了，只能强行结束进程。</li>
      <li>下载完立刻重启：用户正在编辑的内容被强制中断，这是最招骂的做法。</li>
      <li>不监听 <code>error</code>：网络断了、服务器返回 404，整条流程静默死掉，既不重试也不提示。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      第一步，<strong>先限定生效范围</strong>。用 <code>app.isPackaged</code> 判断，只有打包后的安装版才启用自动更新，开发环境直接跳过。这样既避免了报错，也让你明白：自动更新本来就不是给开发环境用的。
    </p>
    <p>
      第二步，确定更新源。<code>setFeedURL</code>（或在 electron-builder 的 <code>publish</code> 配置里）指向发布服务，服务端提供 <code>latest.yml</code>——里面有版本号、安装包哈希和增量更新的 blockmap。这就是"更新从哪里来、怎么判断有没有新版"的依据。
    </p>
    <p>
      第三步，把事件流水线按顺序串起来，这是本课的主干：
    </p>
    <ol class="lesson-steps">
      <li><code>checking-for-update</code>：开始检查。</li>
      <li><code>update-available</code>：发现新版本，<code>info.version</code> 给出目标版本；若无更新则走 <code>update-not-available</code>。</li>
      <li><code>download-progress</code>：下载中，<code>progress.percent</code> 与 <code>bytesPerSecond</code> 可以回传渲染进程做进度条。</li>
      <li><code>update-downloaded</code>：下载完成，此时才提示用户。</li>
      <li>用户确认后调用 <code>autoUpdater.quitAndInstall()</code>，退出并安装。</li>
    </ol>
    <p>
      第四步，补上安全校验——这是自动更新能不能"装了不害怕"的前提。更新包必须签名：<strong>macOS 要做代码签名并 notarization（公证），Windows 要做 Authenticode 签名</strong>。electron-updater 会结合签名与 <code>latest.yml</code> 中记录的哈希来判断包是否可信，拒绝不符的更新。回看开场那个"应用已损坏"，根子就在这里——不是你的逻辑错，而是包没通过系统的签名校验。
    </p>
    <p>
      最后补用户体验与失败处理。<code>update-downloaded</code> 之后不要直接重启，弹一个 <code>dialog</code> 让用户选"立即重启"还是"稍后"（<code>response === 0</code> 才调 <code>quitAndInstall</code>）；监听 <code>error</code> 把失败信息回传并允许重试；下载期间用进度事件给用户可见的反馈。
    </p>
    <p>
      发布侧的<strong>灰度与回滚</strong>也在这一步落地：灰度是不要一次把新版本推给所有人，而是先推给一小部分渠道或比例，观察崩溃率与反馈稳定后再逐步放量；回滚则是保留上一版本的安装包与版本元数据，一旦新版本出错率升高，就停止放量、把更新源切回旧版本，让用户能退回。这两件事由发布服务控制，应用端只负责按事件流水线去检查、下载、安装。
    </p>
    <div class="lesson-box warn">
      <strong>两个前提条件：</strong>自动更新只在打包后的安装版中生效，开发环境调用会直接报错，接入前先用 <code>app.isPackaged</code> 判断；另外，macOS 未签名、未公证的包，Windows 未做 Authenticode 签名的包，都会在安装阶段被系统拒绝——签名不是可选项。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「检查更新」，看事件日志按 <code>checking-for-update</code> → <code>update-available</code> → <code>download-progress</code> → <code>update-downloaded</code> 依次追加，状态色块同步变化——这正是主进程里那条更新流水线。</figcaption>
      <E10AutoUpdate />
    </figure>

    <h2>总结</h2>
    <p>
      自动更新是一条住在主进程里的事件流水线：用 <code>setFeedURL</code>（或 electron-builder 的 <code>publish</code>）定好更新源，按 <code>checking-for-update</code> → <code>update-available</code> → <code>download-progress</code> → <code>update-downloaded</code> 依次推进，最后由用户确认触发 <code>quitAndInstall</code>。而它真正的地基是签名与 <code>latest.yml</code> 校验——没有签名，更新根本装不上，装了也不敢用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「灰度发布（渐进式发布）」</span>指不把新版本一次性推给全部用户，而是先推给一小部分（按比例、渠道或人群），观察稳定后再逐步扩大范围的发布策略。它的边界是<strong>必须与回滚配套</strong>：要保留上一版本的安装包与版本元数据，一旦新版本出错率升高就停止放量、把更新源切回旧版本；而且灰度是发布侧（更新源给哪些版本）的控制手段，应用端只负责按事件流水线检查、下载、安装。
    </div>
  </LessonArticle>
</template>
