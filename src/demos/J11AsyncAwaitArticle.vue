<script setup lang="ts">
import J11AsyncAwait from './J11AsyncAwait.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>三个接口用 <code>then</code> 链一拼，错误处理就散落在每一层——有没有一种写法，能让异步代码看起来和同步代码一样从上往下读？
    </div>

    <h2>回调嵌套困境</h2>
    <p>
      你已经会用 Promise 了，可一旦业务变复杂，<code>then</code> 的嵌套和链式调用就开始失控：取值要在回调里继续套回调，错误要在每一层或末尾单独兜，中间还想插一段清理逻辑。<strong>明明业务是「先拿课程、再拿进度、最后一起处理」，代码长出来的却是一层层的回调。</strong>
    </p>
    <p>
      async/await 要解决的，正是这个「同步语义」与「异步执行」之间的落差。它让你用一行赋值、一段 try/catch，写出读起来像同步、跑起来是异步的代码。但代价是——你得同时掌握串行与并发两种节奏，否则很容易把本该并发的操作写成慢吞吞的串行。
    </p>

    <h2>async函数语法</h2>
    <p>
      最省事的做法：给函数加 <code>async</code>，在需要等结果的地方加 <code>await</code>，剩下的逻辑照常写。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它把 Promise 的「落定结果」直接变成了一行赋值</strong>。<code>const data = await fetchData()</code> 里，<code>data</code> 就是成功后的值，不用再钻进 <code>then</code> 里找。错误也回到了熟悉的 try/catch 轨道上。
    </p>
    <p>
      但同样是两行 <code>await</code>，写法上只差一点，执行起来却差着一整段等待。<code>const a = await loadA()</code> 再 <code>const b = await loadB()</code>，是等完 A 才发出 B；而 <code>const [a, b] = await Promise.all([loadA(), loadB()])</code>，是两件事一起发出、一起等。这个差别，正是后面所有流控讨论的起点。
    </p>

    <h2>串行await退化</h2>
    <ul>
      <li>把多个互不依赖的 <code>await</code> 顺序写下去，就悄悄退化成了串行，总耗时变成各步之和。</li>
      <li>在循环里逐个 <code>await</code>，同样是一步等完再等下一步，明明可以一起发。</li>
      <li>以为加了 <code>async</code> 的错误会被自动捕获——其实函数返回的 Promise 若无人处理，里面的异常会变成未处理的拒绝。</li>
      <li><code>await</code> 写多了，清理逻辑散落各处，出错时资源没释放。</li>
    </ul>

    <h2>依赖关系判断依据</h2>
    <p>
      先记住两条底层事实。第一，<strong><code>async</code> 函数总是返回一个 Promise</strong>，函数里 <code>return</code> 的值会自动被包装成成功结果；第二，<strong><code>await</code> 会暂停当前函数的执行，直到 Promise 落定</strong>，成功就取出值、失败就抛出异常。正因为会「暂停」，连续几个 <code>await</code> 才天然是串行的——这正是问题的来源。
    </p>
    <p>
      于是流控的关键，是<strong>按依赖关系选择节奏</strong>：
    </p>
    <ul>
      <li><strong>有依赖就串行</strong>：后一步要用前一步的结果，那就老老实实逐个 <code>await</code>，或者用 <code>for ... of</code> 依次等待。</li>
      <li><strong>无依赖就并发</strong>：先把所有 Promise 发起、收进一个数组，再用 <code>await Promise.all(...)</code> 一起等。总耗时从「各步之和」降到「最慢一步」。</li>
    </ul>
    <div class="lesson-box warn">
      <strong>坑：</strong>在循环里直接写 <code>await</code> 会退化为串行。需要并发时，要先把每个任务发起成 Promise 收集起来，循环结束再 <code>await Promise.all</code> 统一等待，而不是在循环体内逐个等。
    </div>
    <p>
      想知道自己写的是串行还是并发，最直接的办法是打时间戳：串行的总耗时约等于各步之和，并发的总耗时约等于最慢的那一步。把两种写法的耗时并排看一眼，远比凭感觉判断可靠——这也是排查「页面加载为什么慢」时最快能落地的动作。
    </p>
    <p>
      接着把错误与清理收口。<code>await</code> 链上的任何一次拒绝，都会像同步异常一样在函数里抛出，所以用 <code>try / catch / finally</code> 把它们统一罩住：<code>catch</code> 处理失败，<code>finally</code> 执行清理（关掉 loading、释放资源），无论成败都会跑。这比在每一个 <code>then</code> 后面各写一份错误分支要集中得多。
    </p>
    <div class="lesson-box warn">
      <strong>另一个坑：</strong>给函数加了 <code>async</code> 并不代表调用方不用管错误。函数内部<strong>未捕获</strong>的异常会变成这个函数返回 Promise 的拒绝，若调用方既不 <code>await</code> 也不 <code>catch</code>，它就成了「未处理的拒绝」，在很多环境下只是安静地打印一句警告，很容易被忽略。
    </div>
    <p>
      还有两个使用边界要记牢：<code>await</code> 只能出现在 <code>async</code> 函数内部，或者在 ES Module 的顶层使用；并且<strong>并发不等于无限并发</strong>，即使改用 <code>Promise.all</code> 一起发，也要留意接口限流与服务端承载能力，必要时控制并发数量。
    </p>

    <h2>并发与串行对照</h2>
    <figure class="lesson-figure">
      <figcaption>分别点「并发加载」与「串行加载」，对比两种节奏下日志出现的先后与快慢。</figcaption>
      <J11AsyncAwait />
    </figure>

    <h2>执行节奏与并发控制</h2>
    <p>
      async/await 把异步流程写成了同步的样子：<code>async</code> 让函数返回 Promise，<code>await</code> 暂停并取出结果。真正决定性能的是节奏——有依赖就逐个 <code>await</code> 串行，无依赖就收集起来用 <code>Promise.all</code> 并发，再用 <code>try / catch / finally</code> 统一收口错误与清理。
    </p>
    <div class="lesson-term">
      <span class="term-name">「async / await」</span>是基于 Promise 的异步语法糖：<code>async</code> 函数总是返回 Promise，<code>await</code> 暂停该函数直到 Promise 落定并取出结果或抛出异常。串行用 <code>for ... of</code> 逐个 <code>await</code>，并发用 <code>Promise.all</code> 同时发起再一起等待，配合 <code>try / catch / finally</code> 统一处理错误与清理。<code>await</code> 仅能在 <code>async</code> 函数内或 ES Module 顶层使用。
    </div>
  </LessonArticle>
</template>
