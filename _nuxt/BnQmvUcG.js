const n=`<script setup lang="ts">
import J08EventLoop from './J08EventLoop.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>代码里明明先写 <code>setTimeout</code>、后写 <code>Promise.then</code>，运行时却是 <code>then</code> 先打印、定时器后打印——为什么输出顺序和书写顺序完全对不上？
    </div>

    <h2>读写时序错位</h2>
    <p>
      你在做一个「保存后立即读取」的流程：调用保存接口，接着在下一行读取最新列表。你以为接口已经写完了，读到的却是旧数据。类似地，你在状态更新后马上量取元素尺寸，拿到的是更新前的高度。代码看起来是自上而下执行的，结果却总在某个地方「慢了一拍」。
    </p>
    <p>
      根子在于：JavaScript 只有一个调用栈，同一时刻只执行一段代码。可它又必须处理网络、定时器、用户点击这些「等一会儿才发生」的事。如果一门单线程语言想同时干这两件事，就必然要有一套排程规则——<strong>谁先执行、谁排队、排几条队</strong>。这套规则就是事件循环。
    </p>

    <h2>逐行执行直觉模型</h2>
    <p>
      最省事的理解：把代码当成「从上往下、一行接一行」执行。同步语句立刻跑，异步回调「晚一点」再跑。
    </p>
    <p>
      这个理解做对了最基础的一层：<strong>它承认了同步与异步的区分</strong>。同步代码插队执行，回调被推后。当只有一个异步任务时，这个心智模型完全够用。
    </p>

    <h2>多回调时序失效</h2>
    <ul>
      <li>当「多条异步回调」同时待命时，谁先谁后说不清，模型直接失效。</li>
      <li>它解释不了为什么 <code>Promise.then</code> 总排在 <code>setTimeout(fn, 0)</code> 前面，哪怕定时器写得更早。</li>
      <li>它也无法解释「重活一多页面就卡住不渲染」——仿佛有什么东西把绘制堵住了。</li>
      <li>把回调简单理解为「稍后统一执行」，会漏掉回调之间还分等级这件事。</li>
    </ul>

    <h2>任务分级排队模型</h2>
    <p>
      不推翻「同步优先」，而是给异步任务<strong>分等级排队</strong>。于是有了三个角色：<strong>调用栈</strong>执行当前同步代码；<strong>宏任务队列</strong>放定时器回调、事件回调这类任务；<strong>微任务队列</strong>放 <code>Promise.then</code>、<code>queueMicrotask</code>、<code>MutationObserver</code> 这类回调。事件循环则是一段永不停止的循环，反复做同一件事。
    </p>
    <ol class="lesson-steps">
      <li>执行当前脚本里的同步代码，把它们压入并弹出调用栈。</li>
      <li>调用栈清空后，<strong>清空整个微任务队列</strong>，直到队列为空——注意是「清空」，不是只取一个。</li>
      <li>如果此刻到了浏览器该绘制的帧时机，就先渲染。</li>
      <li>从宏任务队列取出<strong>下一个</strong>宏任务执行，然后回到第 2 步，循环往复。</li>
    </ol>
    <p>
      拿着这套规则回头看开场那个例子就通了：同步的两条日志先跑完，调用栈清空；接着微任务队列里的 <code>then</code> 被清空，于是它先于宏任务里的 <code>setTimeout</code> 打印。所以「先写」并不等于「先跑」，<strong>决定顺序的是任务所处的队列，而不是它在文件里的位置</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong><code>setTimeout(fn, 0)</code> 并不代表立即执行，它只是「尽快排进宏任务队列」，真正执行还要等前面的微任务与渲染都结束，最小延迟受调度影响；而微任务队列是一口气清空的，<strong>大量微任务同样会阻塞渲染</strong>，要控制单次微任务的工作量。
    </div>
    <p>
      再回到开场的困惑：为什么「状态更新后立刻读取」会拿到旧值？因为更新的后续被排进了微任务，而你的读取是同步执行的，抢在它前面把旧值读了回去。想让自己的逻辑排在更新之后，就得把它也放进微任务队列——例如 <code>await Promise.resolve()</code> 主动让出一次执行权，等微任务队列轮到你再继续。
    </p>
    <p>
      还有两个进阶细节值得记住。其一，<code>async</code> 函数并不是整段异步：<strong><code>await</code> 之前的代码是同步执行的</strong>，<code>await</code> 之后的续写才进入微任务。其二，在 Node.js 里，<code>process.nextTick</code> 的优先级高于 Promise 微任务，排队的层级又多了一层。理解浏览器这套主干，再去记各运行时的差异就不容易乱。
    </p>

    <h2>三类任务日志顺序</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮，看同步代码、微任务与宏任务依次落进日志。</figcaption>
      <J08EventLoop />
    </figure>

    <h2>事件循环调度机制</h2>
    <p>
      事件循环把「单线程怎么协调同步与异步」这件事说清了：同步代码先跑完，微任务队列被整体清空，然后才轮到下一个宏任务，渲染夹在宏任务之间。异步日志的顺序，本质上是任务排队的顺序。
    </p>
    <div class="lesson-term">
      <span class="term-name">「事件循环」</span>是单线程 JavaScript 的排程机制：调用栈清空后，先<strong>清空整个微任务队列</strong>（<code>Promise.then</code>、<code>queueMicrotask</code>、<code>MutationObserver</code>），再取出下一个宏任务（如定时器回调）执行，浏览器到帧时机则在此之间绘制。记住 <code>setTimeout(fn, 0)</code> 不等于立即执行，且微任务过多同样会阻塞渲染。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
