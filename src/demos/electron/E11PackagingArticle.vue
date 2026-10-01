<script setup lang="ts">
import E11Packaging from './E11Packaging.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在本机 <code>electron .</code> 跑得好好的应用，打包发给同事，他双击安装包——Windows 上弹出「未知发布者」，macOS 上直接说「应用已损坏，打不开」。你在 Windows 机器上敲 <code>electron-builder --mac</code>，它还当场报错退出。
    </div>

    <h2>交付形态落差</h2>
    <p>
      开发态的运行方式（直接加载源码目录）和用户拿到的产物之间，隔着一条你平时看不见的鸿沟。用户不会 <code>git clone</code> 再 <code>npm install</code>，他要的是「双击就能装、装完能用、能卸载」的东西。
    </p>
    <p>
      如果直接把源码交出去，问题立刻来：源码里带着完整的 <code>node_modules</code>，动辄几百 MB，还把你没打算公开的实现原样交出去；没有图标、没有版本号、没有系统识别用的应用标识，双击后图标还是默认的 Electron 图标，窗口名字还是开发目录名；更麻烦的是每个系统的「安装」形态根本不一样——macOS 认 <code>dmg</code> 与 <code>app</code>，Windows 认 <code>nsis</code> 安装程序，Linux 认 <code>AppImage</code> / <code>deb</code> / <code>rpm</code>，同一份源码你得手工拼三套。
    </p>
    <p>
      于是问题落到：怎样把开发态的项目，变成各平台「可安装、可分发的产物」，而且最好只写一份配置？
    </p>

    <h2>打包配置落地</h2>
    <p>
      先给一个真的能跑的办法：装 <code>electron-builder</code>，在 <code>package.json</code> 里加一个 <code>build</code> 字段声明 <code>appId</code>、<code>productName</code> 与 <code>mac</code> / <code>win</code> / <code>linux</code> 各自的 <code>target</code>，然后跑一条 <code>electron-builder</code> 命令。它会自动收集应用代码、生成对应平台的安装包，送进 <code>directories.output</code> 指定的目录。
    </p>
    <p>
      这个方案做对了一件事：<strong>把「平台差异」从一堆手工命令收敛成一份声明式配置</strong>。三个平台字段各管自己要出什么产物、用哪个图标，底层那些格式与打包细节由工具替你处理。
    </p>

    <h2>体积与签名的门槛</h2>
    <ul>
      <li>打包默认会把整个 <code>node_modules</code> 收进去，体积远超实际需要；源码原样躺进产物目录，也等于把实现全暴露。</li>
      <li>产物散落成成千上万个小文件，安装和启动时逐个读盘，首启明显变慢。</li>
      <li>macOS 包没签名、没公证：Gatekeeper 直接拦下，用户看到的就是那句「应用已损坏」。</li>
      <li>Windows 包没做 Authenticode 签名：SmartScreen 提示「未知发布者」，装完还可能被安全软件误杀。</li>
      <li>想跨平台一把梭：<code>electron-builder --mac</code> 在 Windows 上会失败，macOS 产物必须在 macOS（或跑在 macOS 的 CI）上构建。</li>
      <li>版本号、<code>productName</code>、<code>appId</code> 打包前没定稳：后续升级靠版本号判定、系统靠 <code>appId</code> 识别，改一次就要付迁移成本。</li>
    </ul>

    <h2>源码归档形态</h2>
    <p>
      先从「产物形态」补起，因为它决定后面所有平台配置的底色。默认情况下，应用源码会被打进一个叫 <strong>asar</strong> 的归档（<code>resources/app.asar</code>），上万个小文件合并成一个——源码不再裸露、读盘的小 IO 也少了。但 asar 里的文件是只读的，外部进程拿不到真实路径去执行，随包携带的原生二进制（比如 ffmpeg）这类东西要单独放出来：用 <code>extraResources</code> 复制到 resources 目录下、或用 <code>asarUnpack</code> 从归档里解出。先记住这条边界：<strong>能待在 asar 里的就待着，需要被原生程序按真实路径访问的才解出来</strong>。
    </p>
    <p>
      接着按平台声明 <code>target</code>，这是「一份配置出三种产物」的核心：macOS 出 <code>dmg</code> 与 <code>zip</code>；Windows 出 <code>nsis</code> 安装程序，也可以再给一个便携的 <code>portable</code> exe；Linux 同时给 <code>AppImage</code>、<code>deb</code>、<code>rpm</code>，兼顾免安装与发行版安装。
    </p>
    <p>
      再补签名与公证，它决定了「装了敢不敢用」。macOS 要在打包机（一定是 macOS）上配置 Developer ID 证书、打开 <code>hardenedRuntime</code>，并做 <code>notarization</code> 公证；Windows 要配置 Authenticode 证书。回头看开场那句「应用已损坏」——产物本身没坏，是系统不敢认它。
    </p>
    <p>
      最后补流程。在 <code>scripts</code> 里定义 <code>pack</code>（配 <code>--dir</code>，只出免安装目录，便于本地快速走查）和一组 <code>dist:mac</code> / <code>dist:win</code> / <code>dist:linux</code>；真正的跨平台构建交给 CI，用 GitHub Actions 起三台不同系统的机器分别打包。产物拿到手后本地完整走一遍：<strong>安装 → 启动 → 升级覆盖 → 卸载</strong>，确认图标、菜单、文件关联都对。
    </p>

    <h2>三平台配置对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 macOS / Windows / Linux 三个平台，对照上方 electron-builder 的 build 配置与「打包要点」，看每个平台各自需要什么 target、什么图标、什么签名准备。</figcaption>
      <E11Packaging />
    </figure>

    <h2>用户所得产物</h2>
    <p>
      打包分发要回答的其实是「用户拿到的到底是什么」。用一份 electron-builder 配置声明各平台产物，把源码收进 asar、把需要原生访问的文件用 <code>extraResources</code> 放出来，再用签名与公证让系统愿意认——这条链走完，开发态才算真正变成可分发的应用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「asar」</span>是 Electron 的归档格式，把应用源码合并成单个文件打包进 <code>resources</code> 目录，避免源码直接暴露、减少小文件读盘开销。边界：asar 内文件<strong>只读</strong>，需要被外部进程按真实路径访问的文件（原生二进制等）要用 <code>extraResources</code> 或 <code>asarUnpack</code> 解出来；而且 asar <strong>不等于加密</strong>，防篡改要靠代码签名。
    </div>
  </LessonArticle>
</template>
