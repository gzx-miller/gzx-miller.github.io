const e=`<script setup lang="ts">
import J08EventLoop from './J08EventLoop.vue'
import J07PromiseCombinators from './J07PromiseCombinators.vue'
import J11AsyncAwait from './J11AsyncAwait.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>页面上三个数据——课程、通知、进度——要一起加载，最早写成三段 <code>await</code> 依次获取，正确是正确了，可整页非要等最慢的那段跑完才显示；改成并发之后不到两百毫秒就齐了。同样是三个请求，为什么「排队」和「一起发」差这么多？还有，加载状态为什么必须放进 <code>finally</code> 才靠谱？
    </div>

    <h2>单线程与事件循环</h2>
    <p>
      JavaScript 只有一个线程执行代码，同一时刻只有一段代码在跑，靠<strong>调用栈</strong>记住「现在执行到哪」。麻烦在于：网络请求、定时器这些慢活儿，绝不能堵住这唯一的一条线程。
    </p>
    <p>
      语言的办法是把慢活儿交出去，等它们好了再排队回来执行。等待执行的任务分成两类：<strong>微任务</strong>（Promise 的 <code>then</code> 回调、<code>queueMicrotask</code>）和<strong>宏任务</strong>（<code>setTimeout</code>、事件回调）。事件循环的规则是：每执行完一段同步代码，<strong>先把微任务队列清空，再去取下一个宏任务</strong>。
    </p>
    <p>
      顺序是固定的，所以 <code>Promise.resolve().then(...)</code> 里的回调，永远排在同一个脚本里的 <code>setTimeout</code> 之前打印。开头的困惑里，「一起发」之所以快，正是因为几个请求同时在等待队列里跑，而不是一个接一个占用时间。
    </p>

    <h2>Promise 的三种状态</h2>
    <p>
      要让「稍后回来的结果」能被写成一句可读的代码，语言给了 <code>Promise</code>。一个 Promise 只会处在三种状态之一：<code>pending</code>（未落定）、<code>fulfilled</code>（成功）、<code>rejected</code>（失败），而且一旦落定就再也不改变。
    </p>
    <ul>
      <li><code>then</code> 处理成功，拿到返回值。</li>
      <li><code>catch</code> 处理失败，接住拒绝原因。</li>
      <li><code>finally</code> 不改变结果，只做收尾——比如关闭加载状态，这正是开头第二个问题的答案。</li>
    </ul>
    <p>
      Promise 的贡献是把「回调套回调」的横向嵌套摊平成一条纵向的链；链上任何一步抛出或被拒绝，都会一路冒泡到最近的那个 <code>catch</code>。
    </p>

    <h2>组合器各管一段</h2>
    <p>
      多个请求常常要一起处理。Promise 提供了四个组合器，名字很像，行为却差得很远：
    </p>
    <ul>
      <li><code>all</code>：全部成功才成功，返回结果数组；只要有一个拒绝，整体立即拒绝。</li>
      <li><code>allSettled</code>：等全部结束，无论成败，返回每一项的 <code>{ status, value / reason }</code>，适合「谁挂了都不影响其余」。</li>
      <li><code>race</code>：取最先落定的那个，成功或失败都算。</li>
      <li><code>any</code>：取最先成功的那个；只有全部失败，才以 <code>AggregateError</code> 拒绝。</li>
    </ul>
    <p>
      选错组合器，等于选错了「一个失败该不该拖垮整批」的语义。<code>all</code> 与 <code>allSettled</code> 的差别，往往就是一处线上事故的差别。
    </p>

    <h2>async 函数的时机</h2>
    <p>
      Promise 链写长了还是难受，<code>async/await</code> 是它的语法糖，但有两个时机必须记住：
    </p>
    <ul>
      <li><strong><code>async</code> 函数总是返回 Promise</strong>：哪怕里面 <code>return 1</code>，拿到的也是包着 1 的 Promise。</li>
      <li><code>await</code> 之前的代码是<strong>同步执行</strong>的；<code>await</code> 处的等待会让函数暂挂，<code>await</code> 之后的代码被排进<strong>微任务队列</strong>，所以它不会阻塞当前的同步代码。</li>
    </ul>
    <p>
      换句话说，<code>await</code> 只「暂停」函数自己，不暂停整个线程——这解释了为什么它既保留了同步写法的可读性，又没牺牲单线程的响应性。
    </p>

    <h2>串行与并发的取舍</h2>
    <p>
      面对几个互不依赖的请求，写法直接决定耗时：
    </p>
    <ul>
      <li>串行 <code>for...of</code> + <code>await</code>：一个一个来，总耗时是它们之和，适合有先后依赖的步骤（先登录拿令牌，再用令牌取数据）。</li>
      <li>并发 <code>Promise.all</code>：一起发出，总耗时约等于最慢的那一个，适合彼此独立的数据。</li>
    </ul>
    <p>
      顺带两个边界。第一，用 <code>try/catch</code> 处理 <code>await</code> 链上的拒绝：<code>await</code> 一个被拒绝的 Promise，会当场抛出异常，被外层 <code>try/catch</code> 接住，比 <code>.catch</code> 更贴近同步写法。第二，没人处理的拒绝不会消失，它会变成 <code>unhandledrejection</code> 事件——如果全局没有监听，一般就只剩控制台里一行警告。
    </p>

    <h2>执行顺序当场验证</h2>
    <figure class="lesson-figure">
      <figcaption>先给「微任务优先、宏任务殿后」下个印象：观察同步代码、微任务与宏任务的打印顺序。</figcaption>
      <J08EventLoop />
    </figure>
    <figure class="lesson-figure">
      <figcaption>再看四个组合器在「部分失败」时的不同反应——用 <code>all</code> 与 <code>allSettled</code> 的对照，体会「一个拒绝是否拖垮整批」。</figcaption>
      <J07PromiseCombinators />
    </figure>
    <figure class="lesson-figure">
      <figcaption>最后对照串行与并发的耗时：同样是三段加载，并发用 <code>Promise.all</code> 一起发，串行用 <code>for...of</code> + <code>await</code> 逐个等，注意时间差是从哪来的。</figcaption>
      <J11AsyncAwait />
    </figure>

    <h2>先问依赖再定并发</h2>
    <p>
      异步的骨架其实是三件事：单线程的调用栈负责同步执行，事件循环用「先微任务、后宏任务」的规则安排那些回不来的活儿，Promise 把「稍后回来的结果」变成可链、可组合的值；<code>async/await</code> 则在此之上提供同步写法的糖。写并发时先问一句：<strong>这几件事彼此有没有依赖</strong>？没有就用 <code>Promise.all</code> 一起发，有就用 <code>for...of</code> + <code>await</code> 排好序；再顺手用 <code>finally</code> 收尾、用 <code>try/catch</code> 与 <code>unhandledrejection</code> 兜住拒绝。
    </p>
    <div class="lesson-term">
      <span class="term-name">「微任务」</span>指当前宏任务结束后、在下一个宏任务开始前被清空的队列，来源包括 <code>Promise.then</code> 的回调与 <code>queueMicrotask</code>。事件循环的规则是：执行完一段同步代码后<strong>先清空微任务队列</strong>，再取下一个宏任务（如定时器回调）。因此同一轮里，<code>then</code> 里的代码永远排在 <code>setTimeout</code> 之前。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
