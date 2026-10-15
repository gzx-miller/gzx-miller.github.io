<script setup lang="ts">
import D17EventLoop from './D17EventLoop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个脚本里，把 <code>setTimeout(() =&gt; log('timer'), 0)</code> 写在 <code>setImmediate(() =&gt; log('immediate'))</code> 前面，直接跑，两次运行谁先打日志居然会变；可只要把这两行一起塞进一个 <code>fs.readFile</code> 的回调里，<code>immediate</code> 就每次都赢——它们不都是「尽快执行」吗，顺序为什么会浮动？
    </div>

    <h2>宏任务与微任务解释不了</h2>
    <p>
      在浏览器那套事件循环里，你已经记住一条朴素结论：同步代码先跑，然后清空微任务，再取下一个宏任务。可搬进 Node.js，它当场卡壳：<code>setTimeout(fn, 0)</code> 和 <code>setImmediate</code> 同为宏任务，顺序为什么会翻转？<code>process.nextTick</code> 凭什么总排在 <code>Promise.then</code> 前面？你写的 <code>setTimeout(fn, 10)</code>，又怎么会拖到几十甚至上百毫秒才响？
    </p>
    <p>
      根子在于：Node 要同时照看定时器、网络 I/O、文件 I/O、子进程退出、连接关闭这么多类事情，它的事件循环就不是「一条队列轮着取」，而是<strong>一圈一圈扫过的若干阶段</strong>。只拿宏任务 / 微任务两层去套，必然会卡住。
    </p>

    <h2>把循环拆成六个阶段</h2>
    <p>
      不推翻「微任务优先」，而是先把这一圈拆成六个首尾相接的阶段，按顺序走：
    </p>
    <ol class="lesson-steps">
      <li><strong>Timers（定时器）</strong>：执行已经到期的 <code>setTimeout</code> / <code>setInterval</code> 回调。</li>
      <li><strong>Pending callbacks（待处理回调）</strong>：处理上一轮遗留的系统级回调，比如某些 TCP 错误。</li>
      <li><strong>Idle / Prepare</strong>：Node 内部使用，业务代码基本不碰。</li>
      <li><strong>Poll（轮询）</strong>：核心阶段。取回并执行 I/O 回调；队列空了就在这里稍作等待。</li>
      <li><strong>Check（检查）</strong>：执行 <code>setImmediate</code> 的回调。这是 Node 特有的一站，浏览器里没有。</li>
      <li><strong>Close callbacks（关闭回调）</strong>：处理 <code>close</code> 这类事件，例如 <code>socket.on('close')</code>。</li>
    </ol>
    <p>
      六个阶段排好之后，开场那句「不都是尽快执行吗」就有了新的落点：所谓「尽快」，指的其实是「落在六个阶段里的哪一站」，而不是「延迟写了多少毫秒」。
    </p>

    <h2>阶段之间先清空两条微任务队列</h2>
    <p>
      光有阶段还不够，还要记住「回调之间怎么插队」的规则：<strong>在每个阶段结束、进入下一阶段之前，先把 <code>process.nextTick</code> 队列清空，再清空 Promise 微任务队列</strong>。注意这是两条独立队列，且 nextTick 优先。
    </p>
    <p>
      这就解释了第二个现象：<code>process.nextTick(fn)</code> 永远跑在 <code>Promise.then</code> 之前——它不在 Promise 那条队伍里，而是一条优先级更高的队列。另外，一条宏任务回调中新增的微任务，也会在这次清空里被一并处理掉，不会留到下一圈，这正是你在演示里看到「每两个宏任务之间微任务被一口气清空」的原因。
    </p>

    <h2>I/O 回调里 setImmediate 必然更早</h2>
    <p>
      现在回头看开场那个反复横跳的例子。顶层脚本刚进入事件循环时，能不能在第一个 Timers 阶段就命中这个定时器，取决于「脚本自己跑了多久」——跑得快就命中、跑得慢就错过，于是 <code>setTimeout(fn, 0)</code> 与 <code>setImmediate</code> 谁先谁后并不确定。
    </p>
    <p>
      但把这两行一起放进 <code>fs.readFile</code> 的回调里，情况就固定了：I/O 回调发生在 Poll 阶段，而 Poll 的下一站正是 Check，所以 <code>setImmediate</code> 必然先执行；<code>setTimeout(fn, 0)</code> 得再等一整圈绕回 Timers。<strong>决定顺序的不是写在前后，而是它们落在环形阶段里的哪一站。</strong>
    </p>
    <p>
      顺带钉住两个容易背错的事实：<code>setImmediate</code> 是 <strong>Node.js 特有的 API</strong>，浏览器里根本不存在；至于「定时器不按时」，同样是阶段模型的自然结果——<code>setTimeout(fn, 10)</code> 只保证「至少 10 毫秒后进入可执行状态」，真正执行还要等前面各阶段和微任务队列都走完。
    </p>
    <div class="lesson-box warn">
      <strong>一个能把服务拖死的坑：</strong>不要在 <code>process.nextTick</code> 里再调度一个 <code>process.nextTick</code>。它会在「本阶段结束前」被反复清空，形成一个永远填不满的队列，事件循环被饿死，I/O 与定时器再也轮不上。需要让出控制权时，改用 <code>setImmediate</code>，把后续丢到下一个 Check 阶段。
    </div>

    <h2>看一遍真实的执行顺序</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮，看日志按「nextTick → Promise → setTimeout → setImmediate」的顺序依次落下，重点观察每两个宏任务之间微任务是怎样被一口气清空的。</figcaption>
      <D17EventLoop />
    </figure>

    <h2>顺序取决于落在哪一站</h2>
    <p>
      理论讲完，还得和实测对照着看：先给出一段脚本预测顺序，再跑起来比对，错了就回到六个阶段的模型里找原因。Node 的事件循环不是一层「宏任务队列」，而是 Timers、Pending、Poll、Check、Close 首尾相接的一圈；每走过一个阶段，先清 <code>nextTick</code>、再清 Promise 微任务。看懂阶段之后，<code>setImmediate</code> 与 <code>setTimeout(fn, 0)</code> 的顺序之谜、定时器为何不守时，就都变成了同一个问题——它落在哪一站。
    </p>
    <div class="lesson-term">
      <span class="term-name">「process.nextTick 队列」</span>是 Node 在事件循环每个阶段之间优先清空的一条微任务队列，优先级<strong>高于</strong> Promise 微任务，因此 <code>process.nextTick(fn)</code> 总排在 <code>Promise.then</code> 之前。边界与例外：<code>nextTick</code> 里递归调度 <code>nextTick</code> 会让队列无限清空、饿死事件循环；要「让出一次执行权」让 I/O 有机会推进，应改用 <code>setImmediate</code>。
    </div>
  </LessonArticle>
</template>
