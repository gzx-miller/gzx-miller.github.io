const e=`<script setup lang="ts">
import D25Timers from './D25Timers.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在接口末尾写了 <code>setTimeout(() =&gt; metrics.flush(), 0)</code>，想让「本次请求一处理完就尽快刷指标」，结果它却排在 <code>process.nextTick</code> 和 <code>Promise.then</code> 后面，还跟你另一处的 <code>setImmediate</code> 顺序对不上——同样是「尽快执行」，为什么时机完全不同？
    </div>

    <h2>几种「稍后」并不等价</h2>
    <p>
      「等一会儿再执行」在 Node 里有一堆写法，但它们落在事件循环的不同阶段，并不等价。最省事的理解——「延时设成 0 就是最快」——把三笔必须自己承担的账留给了你：
    </p>
    <ul>
      <li>把 <code>setTimeout(fn, 0)</code> 当成「立即执行」，忽略了它至少要等一个 timers 阶段的轮次，而且精度根本不保证。</li>
      <li>分不清两种「稍后」：一种是<strong>插当前操作的队</strong>（<code>process.nextTick</code>、<code>Promise.then</code>），另一种是<strong>等本轮回合走完</strong>（<code>setTimeout</code>、<code>setImmediate</code>）。混着用，顺序就只能靠猜。</li>
      <li>在 I/O 回调里，<code>setImmediate</code> 与 <code>setTimeout(fn, 0)</code> 的先后和顶层脚本还不一样，凭直觉写必然出错。</li>
    </ul>
    <p>
      <strong>面对不同的「需要什么时机执行」，到底该挑哪一个定时器？</strong>
    </p>

    <h2>先认清回调落在哪个阶段</h2>
    <p>
      最偷懒的做法是不加区分，凡是「稍后」都用 <code>setTimeout</code>，需要尽快就 <code>setTimeout(fn, 0)</code>。它做对了一件事：<code>setTimeout</code> 是唯一能直白表达「延迟一段真实时间后执行」的 API，语义清楚，只要不取消就总会触发。作为「延时」的基本工具，它没有错。
    </p>
    <p>
      但要真正排对顺序，得先把回调的归属钉死：<strong><code>setTimeout</code> / <code>setInterval</code> 的回调在 Timers 阶段，<code>setImmediate</code> 的回调在 Check 阶段</strong>；而 <code>process.nextTick</code> 与 <code>Promise.then</code> 是微任务，<code>nextTick</code> 还排在最前面。先记住这张「谁在哪个阶段」的表，再谈选型。
    </p>

    <h2>零延时与周期任务的三处失真</h2>
    <ul>
      <li><code>setTimeout(fn, 0)</code> 实际至少按 1ms 处理，还会被前面的任务拖后，它并不「立即」。</li>
      <li>它排在 <code>process.nextTick</code> 与 <code>Promise.then</code> 之后——因为后两者是微任务，会在当前操作一结束时被整体清空。</li>
      <li>在 I/O 回调里，<code>setImmediate</code> 会先于 <code>setTimeout(fn, 0)</code>，靠「延迟 0」根本排不出确定顺序。</li>
      <li><code>setInterval</code> 的回调一旦耗时超过间隔，任务就会堆积、触发时刻越走越偏，这就是<strong>漂移</strong>。</li>
      <li>传入一个巨大的毫秒数（超过 32 位整数上限）会溢出，反倒变成「立即执行」——本想延后很久，结果马上跑了。</li>
    </ul>

    <h2>按需换工具：递归 setTimeout 与 unref</h2>
    <p>
      不推翻 <code>setTimeout</code>，而是补上几件工具。判断顺序很简单：先问自己「我需要它在什么时机执行」，再对号入座。
    </p>
    <ol class="lesson-steps">
      <li>要在整个微任务序列里排到最前、和 Promise 一致 → <code>process.nextTick</code>（优先级最高，但只能放极短的内部逻辑）。</li>
      <li>要在微任务里排队 → <code>Promise.then</code> / <code>queueMicrotask</code>。</li>
      <li>要延迟一段真实时间 → <code>setTimeout</code> / <code>setInterval</code>，回调在 Timers 阶段执行。</li>
      <li>在 I/O 回调里要「本轮回合尽量早」 → <code>setImmediate</code>，它在 Check 阶段，比 <code>setTimeout(fn, 0)</code> 更确定。</li>
    </ol>
    <p>
      再补<strong>漂移的解法</strong>：长周期任务不要用固定间隔的 <code>setInterval</code>，改用<strong>递归 <code>setTimeout</code></strong>——这次回调执行完，再排下一次，两次之间始终隔开，就不会堆积、也不漂移。
    </p>
    <p>
      接着补<strong>取消与保命</strong>：<code>clearTimeout</code> / <code>clearInterval</code> 用来停止定时器，防止它泄漏；<code>timeout.unref()</code> 让这个定时器不阻止进程退出（例如只做后台清理时），<code>timeout.ref()</code> 再把它拉回「阻止退出」。需要 Promise 风格时用 <code>node:timers/promises</code> 的 <code>setTimeout</code>，可以直接 <code>await</code>，也能配合 <code>AbortSignal</code> 取消。
    </p>
    <p>
      最后补大延时这一条：需要延后很久时，别用单个巨大的毫秒值（会溢出成 1ms），改成记录一个目标时间点、用小步长去检查，或换其它调度手段。
    </p>
    <div class="lesson-box warn">
      <strong>记住这句：<code>setTimeout(fn, 0)</code> 不等于「立即执行」</strong>，它只是「尽快排进 timers 阶段」，真正执行的时刻还要等前面的微任务和当前阶段走完；<code>setImmediate</code> 名字里有「immediate」，但在顶层脚本里它和 <code>setTimeout(fn, 0)</code> 的先后其实不确定，只有在 I/O 回调内部才稳定地更早。
    </div>

    <h2>运行看一看真实顺序</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行定时器演示」，看日志区按真实顺序逐条落下：同步代码最先，接着是 nextTick 与 Promise 回调，然后是 setTimeout / setInterval，最后才是 setImmediate——亲手验证「尽快执行」其实分好几个档次。</figcaption>
      <D25Timers />
    </figure>

    <h2>先问时机，再选工具</h2>
    <p>
      Node 的定时器差异，本质上不是「谁更快」，而是「回调落在事件循环的哪个阶段、属于微任务还是宏任务」。写之前先问一句「我需要什么时机执行」，再对号入座：插队的归微任务，延时的归 Timers 阶段，I/O 回调里的「立即」归 Check 阶段的 <code>setImmediate</code>；周期任务防漂移用递归 <code>setTimeout</code>，后台定时记得 <code>unref</code> 或及时 <code>clear</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「定时器漂移」</span>指 <code>setInterval</code> 这类周期任务，因回调执行时间与调度延迟不断累积，实际触发时刻逐渐偏离理论间隔（越走越晚，甚至堆积）的现象。边界与例外：漂移只影响「由同一个定时器反复触发」的周期任务，单次 <code>setTimeout</code> 不受其影响；要消除漂移，应改用「回调执行完后重新排一次 <code>setTimeout</code>」的写法；无论哪种方式，实际触发时刻都取决于事件循环的拥挤程度，高精度的长周期调度不能只依赖 <code>setInterval</code>。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
