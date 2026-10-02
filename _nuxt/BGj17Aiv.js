const e=`<script setup lang="ts">
import D19ChildProcess from './D19ChildProcess.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把用户上传的视频转码写成一行 <code>exec('ffmpeg -i ' + filename + ' out.mp4')</code>。小文件测试通过，上线后大文件一律报 <code>maxBuffer exceeded</code>；更吓人的是，有一天用户把文件名改成 <code>a.mp4; rm -rf ~</code>，命令竟然照单全收。
    </div>

    <h2>字符串命令隐患</h2>
    <p>
      在 Node 里跑外部命令是很常见的需求：调用 <code>git</code>、<code>ffmpeg</code>、系统脚本，或者干脆把一段重活丢给另一个程序去扛。这本身没错，错在你<strong>把所有外部调用都当成「传一个命令字符串」</strong>。这条路藏着几笔你必须自己承担的账：
    </p>
    <ul>
      <li>字符串里一旦拼进用户输入，<code>;</code>、<code>&amp;&amp;</code>、<code>|</code>、<code>$(...)</code> 都会被 shell 当成语法执行——这就是命令注入。</li>
      <li>那种「跑完一次性拿输出」的接口会把整个 <code>stdout</code> 缓冲在内存里，默认上限约 <span class="lesson-kv">1 MB</span>，长输出直接超限报错或被截断。</li>
      <li>它拿不到实时输出，进度条、增量日志这类需求根本做不了。</li>
      <li>子进程崩了、卡死了没人管，父进程可能悄悄留下一个僵尸进程。</li>
    </ul>
    <p>
      <strong>执行外部命令到底有几种姿势，该怎么按场景选？</strong>
    </p>

    <h2>完整命令字符串</h2>
    <p>
      最直接的是 <code>exec(command, callback)</code>：扔进去一条完整的 shell 命令字符串，回调里拿到 <code>(error, stdout, stderr)</code>。
    </p>
    <p>
      它对在了一件事：<strong>对「一条短命令、小输出、只关心最终结果」的场景，它是最顺手的一行代码</strong>。你不必关心流、不必自己拼事件，命令跑完，结果就摆在回调里。
    </p>

    <h2>命令注入与缓冲上限</h2>
    <ul>
      <li><code>exec('convert ' + userInput)</code>，用户把 <code>userInput</code> 传成 <code>a.jpg; rm -rf ~</code>，后半句就被 shell 执行了——注入成立。</li>
      <li><code>exec</code> 默认把 <code>stdout</code> 攒到 <span class="lesson-kv">1 MB</span> 上限，<code>git log</code> 全量或 <code>ffmpeg</code> 的滚动日志一超就报错，你只看到一句 <code>maxBuffer exceeded</code>。</li>
      <li>要做实时进度，<code>exec</code> 的一次性回调结构天生给不了，只能整段等完。</li>
      <li>用 <code>spawn</code> 时 <code>stdout</code> / <code>stderr</code> 是<strong>流</strong>，<code>data</code> 事件给你的是 <code>Buffer</code>，直接当字符串用会出乱码。</li>
      <li>忘了监听 <code>error</code> 和 <code>exit</code>，命令根本不存在时父进程毫无察觉，任务静默消失。</li>
    </ul>

    <h2>四个API取舍</h2>
    <p>
      不推翻 <code>exec</code>，而是按「<strong>走不走 shell</strong>」和「<strong>输出是一整段还是流</strong>」这两个维度，把 API 拆成四种，各管一段：
    </p>
    <ol class="lesson-steps">
      <li><strong><code>exec</code></strong>：走 shell，参数是一整条命令字符串，输出被缓冲（受 <code>maxBuffer</code> 限制）。适合短命令、小输出。<strong>命令串里绝不能拼用户输入。</strong></li>
      <li><strong><code>execFile</code></strong>：<strong>绕过 shell</strong>，直接执行一个可执行文件，参数以数组形式传入。因为没有 shell，天然躲开注入，参数是数组，安全首选。</li>
      <li><strong><code>spawn</code></strong>：不经 shell，<code>stdout</code> / <code>stderr</code> 是流，边产边读，适合长输出、大文件、实时日志（要 shell 得显式加 <code>shell: true</code>，并慎用）。</li>
      <li><strong><code>fork</code></strong>：专为 Node.js 脚本设计，自带一条 <strong>IPC 通道</strong>，父子进程用 <code>child.send()</code> 和 <code>child.on('message')</code> 双向对话，最重但也最灵活。</li>
    </ol>
    <p>
      选型顺着这两条轴走就很清楚：短命令用 <code>exec</code>；参数里带用户输入、或要更强的可控性，用 <code>execFile</code>；输出长、要流式读取，用 <code>spawn</code>；要跑一段 Node 模块并且双方来回通信，用 <code>fork</code>。
    </p>
    <p>
      再补上运维侧的<strong>生命周期</strong>：给子进程设超时，到点 <code>kill()</code> 兜底，防止它挂死；<code>error</code> 事件管「启动失败」，<code>exit</code> 事件管「退出码」，两个都要监听；需要 Promise 风格就用 <code>node:child_process/promises</code>。此外要清醒一件事：每个子进程都有<strong>独立的内存与事件循环</strong>，它解决的是「执行外部程序」和「隔离崩溃」，而「把一台机器的多核吃满」不是它的强项——那是下一课 cluster 要干的事。
    </p>
    <div class="lesson-box warn">
      <strong>安全底线：</strong>只要命令里可能掺进外部输入，就不要用 <code>exec</code> 做字符串拼接，改用 <code>execFile</code> / <code>spawn</code> 的「可执行文件 + 参数数组」形式；如果非要用 shell，也必须对参数做严格白名单校验，而不是靠转义字符去赌。
    </div>

    <h2>三种跑法输出形态</h2>
    <figure class="lesson-figure">
      <figcaption>切换 spawn / fork / exec 三个页签，点运行，对比它们的代码与输出形态：流式逐行输出、IPC 一问一答、一次性返回结果，各自适合什么样的任务。</figcaption>
      <D19ChildProcess />
    </figure>

    <h2>外壳与缓冲取舍</h2>
    <p>
      <code>child_process</code> 的价值是把「执行外部程序」这件事拆成四种可控的姿势：<code>exec</code> 顺手但走 shell、缓冲输出，<code>execFile</code> 绕过 shell 最安全，<code>spawn</code> 流式读长输出，<code>fork</code> 靠 IPC 跑 Node 模块。选型的核心只有两条：<strong>要不要经过 shell</strong>、<strong>输出是一整段还是流</strong>；再配上超时与 <code>error</code> / <code>exit</code> 监听，子进程才不至于变成脱缰的野马或僵尸。
    </p>
    <div class="lesson-term">
      <span class="term-name">「IPC 通道」</span>指 <code>fork</code> 在父子进程之间自动建立的一条双向通信管道，父进程用 <code>child.send(msg)</code>、子进程用 <code>process.send(msg)</code>，双方各监听 <code>message</code> 事件接收；<code>cluster</code> 的工作进程分发也建立在它之上。它的边界是：消息必须可序列化（同样走结构化克隆），<strong>不能传函数、类实例方法或文件句柄</strong>，且消息往返有可感知的延迟，不适合当作高频共享内存来用。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
