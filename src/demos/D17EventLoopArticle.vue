<script setup lang="ts">
import D17EventLoop from './D17EventLoop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个脚本里，<code>setTimeout(() =&gt; log('timer'))</code> 写在 <code>setImmediate(() =&gt; log('immediate'))</code> 前面，直接跑，两次运行输出顺序居然不一样；可把这两行塞进一个 <code>fs.readFile</code> 的回调里，<code>immediate</code> 就每次都赢。为什么顺序会「看心情」？
    </div>

    <h2>宏任务微任务局限</h2>
    <p>
      在浏览器那套事件循环里，你已经学过「同步先跑、微任务清空、再取一个宏任务」。可到了 Node.js，光有「宏任务 / 微任务」两层，有些现象就解释不了：同样是宏任务，为什么 <code>setTimeout(fn, 0)</code> 和 <code>setImmediate</code> 的先后会翻转？为什么 <code>process.nextTick</code> 排得比 <code>Promise.then</code> 还靠前？又为什么你写 <code>setTimeout(fn, 10)</code>，它却可能过了一百毫秒才响？
    </p>
    <p>
      根子在于：Node 作为服务端，要同时照看定时器、网络 I/O、文件 I/O、子进程退出、连接关闭这么多类事情，它的事件循环就不是「一个队列轮着取」，而是<strong>一圈一圈扫过的若干阶段</strong>。只按宏 / 微两层去套，必然会卡住。
    </p>

    <h2>浏览器结论移植</h2>
    <p>
      最省事的做法：把浏览器那套结论原样搬过来——「微任务优先于宏任务，<code>Promise.then</code> 总排在 <code>setTimeout</code> 前面」。
    </p>
    <p>
      这个结论做对了一件事：<strong>它抓住了「插队」这个核心</strong>。不管是浏览器还是 Node，微任务都会抢在「下一个定时器回调」之前执行。如果只让你记一句话，这句仍然管用。
    </p>

    <h2>阶段顺序失配</h2>
    <ul>
      <li>它解释不了阶段顺序：<code>timers</code> 和 <code>check</code> 都是宏任务，为什么 <code>setTimeout(0)</code> 和 <code>setImmediate</code> 的先后会翻转？</li>
      <li>它解释不了 <code>process.nextTick</code> 为什么总比 <code>Promise.then</code> 还早——那说明微任务里还分等级。</li>
      <li>它解释不了「定时器不按时」：<code>setTimeout(fn, 0)</code> 并不是延迟 0 毫秒执行，它只是「尽快排进 timers 阶段」。</li>
      <li>它解释不了为什么放进 I/O 回调后 <code>setImmediate</code> 就一定赢——它看起来像「另一个定时器」，其实不是。</li>
    </ul>

    <h2>事件循环六阶段</h2>
    <p>
      不推翻「微任务优先」，而是先把事件循环拆成<strong>六个阶段</strong>，一圈一轮地走：
    </p>
    <ol class="lesson-steps">
      <li><strong>Timers（定时器）</strong>：执行已经到期的 <code>setTimeout</code> / <code>setInterval</code> 回调。</li>
      <li><strong>Pending callbacks（待处理回调）</strong>：处理上一轮遗留的系统级回调，比如某些 TCP 错误。</li>
      <li><strong>Idle / Prepare</strong>：Node 内部使用，业务代码基本不碰。</li>
      <li><strong>Poll（轮询）</strong>：核心阶段。取回并执行 I/O 回调；队列空了就在这里等一会儿。</li>
      <li><strong>Check（检查）</strong>：执行 <code>setImmediate</code> 的回调。这是 Node 特有的一站，浏览器里没有。</li>
      <li><strong>Close callbacks（关闭回调）</strong>：处理 <code>close</code> 这类事件，比如 <code>socket.on('close')</code>。</li>
    </ol>
    <p>
      光有阶段还不够，还有「每条回调之间的插队规则」：<strong>在每个阶段结束前，先清空 <code>process.nextTick</code> 队列，再清空 Promise 微任务队列</strong>。这就是为什么 <code>nextTick</code> 永远跑在 Promise 前面——它是一条独立、且优先级更高的队列。
    </p>
    <p>
      现在回头看开场那个反复横跳的例子。顶层脚本刚进入事件循环时，能不能在第一个 Timers 阶段就命中等价于 <code>setTimeout(fn, 0)</code> 的定时器，取决于「脚本本身跑了多久」——跑得快就命中，跑得慢就错过，于是 <code>setTimeout(0)</code> 与 <code>setImmediate</code> 谁先谁后并不确定。但把这两行放进 <code>fs.readFile</code> 的回调里，情况就固定了：I/O 回调发生在 Poll 阶段，而 Poll 的下一站正是 Check，所以 <code>setImmediate</code> 必然先执行；<code>setTimeout(0)</code> 得再等一整圈回到 Timers。<strong>决定顺序的不是写在前后，而是它们落在环形阶段里的哪一站。</strong>
    </p>
    <div class="lesson-box warn">
      <strong>一个能把服务搞死的坑：</strong>不要在 <code>process.nextTick</code> 里再调度一个 <code>process.nextTick</code>。它会在「本阶段结束前」被反复清空，形成一个永远填不满的队列，事件循环被饿死，I/O 和定时器再也轮不上。需要让出控制权时，改用 <code>setImmediate</code>，把后续丢到下一个 Check 阶段。
    </div>
    <p>
      还有一个容易背错的事实：<code>setImmediate</code> 是 <strong>Node.js 特有的 API</strong>，浏览器里根本不存在，别指望把这段代码原样拷进前端。至于「定时器不按时」，也是阶段模型的自然结果——<code>setTimeout(fn, 10)</code> 只保证「至少 10 毫秒后进入可执行状态」，真正执行还要等前面各阶段和微任务队列都走完。
    </p>

    <h2>微任务清空时机</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮，看日志按「nextTick → Promise → setTimeout → setImmediate」的顺序依次落下，重点观察每两个宏任务之间微任务是怎么被一口气清空的。</figcaption>
      <D17EventLoop />
    </figure>

    <h2>回调阶段判定</h2>
    <p>
      Node 的事件循环不是一层「宏任务队列」，而是 Timers、Pending、Poll、Check、Close 等阶段首尾相接的一圈；每走过一个阶段，先清空 <code>nextTick</code> 队列、再清空 Promise 微任务队列。看懂阶段之后，<code>setImmediate</code> 与 <code>setTimeout(0)</code> 的顺序之谜、定时器为何不守时，都变成了一个「它落在哪一站」的问题。
    </p>
    <div class="lesson-term">
      <span class="term-name">「process.nextTick 队列」</span>是 Node 在事件循环每个阶段之间优先清空的一条微任务队列，优先级<strong>高于</strong> Promise 微任务，因此 <code>process.nextTick(fn)</code> 总排在 <code>Promise.then</code> 之前。它的边界在于：<code>nextTick</code> 里递归调度 <code>nextTick</code> 会无限清空、饿死事件循环；要「让出一次执行权」让 I/O 有机会推进，应改用 <code>setImmediate</code>。
    </div>
  </LessonArticle>
</template>
