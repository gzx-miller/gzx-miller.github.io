<script setup lang="ts">
import D25Timers from './D25Timers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在接口末尾写了 <code>setTimeout(() =&gt; metrics.flush(), 0)</code>，想让「本次请求一处理完就尽快把指标刷出去」。结果这个回调排在了 <code>process.nextTick</code> 和 <code>Promise.then</code> 后面，还跟你另一处的 <code>setImmediate</code> 顺序对不上。同样是「尽快执行」，为什么时机完全不同？
    </div>

    <h2>延时写法的分档</h2>
    <p>
      「等一会儿再执行」在 Node 里有一堆写法，可它们并不等价，各自落在事件循环的不同阶段。最省事的理解——「延时设成 0 就是最快」——把三笔成本留给了你：
    </p>
    <ul>
      <li>把 <code>setTimeout(fn, 0)</code> 当成「立即执行」，忽略了它至少要等一个 timers 阶段的轮次，而且精度根本不保证。</li>
      <li>分不清两种「稍后」：一种是<strong>插当前操作的队</strong>（<code>process.nextTick</code>、<code>Promise.then</code>），另一种是<strong>等本轮回合走完</strong>（<code>setTimeout</code>、<code>setImmediate</code>）。混着用，顺序就只能靠猜。</li>
      <li>在 I/O 回调里，<code>setImmediate</code> 与 <code>setTimeout(fn, 0)</code> 的顺序和顶层脚本里还不一样，凭直觉写必然出错。</li>
    </ul>
    <p>
      <strong>面对不同的「需要什么时机执行」，到底该挑哪一个定时器？</strong>
    </p>

    <h2>无差别使用定时器</h2>
    <p>
      最偷懒的做法：不区分场景，凡是「稍后」都用 <code>setTimeout</code>，需要立即就用 <code>setTimeout(fn, 0)</code>。
    </p>
    <p>
      它做对了一件事：<code>setTimeout</code> 是唯一能直白表达「延迟一段真实时间后执行」的 API，语义清楚，而且只要不 <code>clearTimeout</code>，回调总会被安排执行。作为「延时」的基本工具，它没有错。
    </p>

    <h2>零延时的假象</h2>
    <ul>
      <li><code>setTimeout(fn, 0)</code> 的实际延迟至少是 1ms 量级，还会被前面的任务拖后，它并不「立即」。</li>
      <li>它排在 <code>process.nextTick</code> 和 <code>Promise.then</code> 之后——因为后两者是微任务，会在当前操作一结束就被整体清空。</li>
      <li>在 I/O 回调里，<code>setImmediate</code> 会先于 <code>setTimeout(fn, 0)</code> 执行，靠「延迟 0」根本排不出确定顺序。</li>
      <li><code>setInterval</code> 的回调若执行时间超过间隔，任务会堆积、触发时刻越走越偏。</li>
      <li>传入一个巨大的毫秒数（超过 32 位整数上限）会溢出，反倒变成「立即执行」——本想延后很久，结果马上跑了。</li>
    </ul>

    <h2>按时机选择工具</h2>
    <p>
      不推翻 <code>setTimeout</code>，而是先把「时机」分成几档，再按需选工具。选择前的第一句话不是「用哪个 API」，而是<strong>「我需要它在什么时机执行」</strong>：
    </p>
    <ol class="lesson-steps">
      <li>要插到「当前操作刚结束、别的 I/O 回调还没跑」的位置 → <code>process.nextTick</code>（微任务，优先级最高，甚至高于 <code>Promise.then</code>）。</li>
      <li>要在微任务序列里排队、和 Promise 一致 → <code>Promise.then</code> / <code>queueMicrotask</code>。</li>
      <li>要延迟一段真实时间 → <code>setTimeout</code> / <code>setInterval</code>，回调在 timers 阶段执行。</li>
      <li>在 I/O 回调里要「本轮回合尽量早」 → <code>setImmediate</code>，它在 check 阶段执行，比 <code>setTimeout(fn, 0)</code> 更确定。</li>
    </ol>
    <p>
      先补 <code>setImmediate</code>，因为 I/O 回调里「立即」是最常见的需求，而 <code>setTimeout(fn, 0)</code> 在这里顺序不确定；<code>setImmediate</code> 正是专治这个场景，语义也直白。
    </p>
    <p>
      再补 <code>process.nextTick</code> 的边界：它优先级最高，但<strong>只能用于极短的内部逻辑</strong>。nextTick 队列清空之前，事件循环不会继续往下走，你若拿它包一个耗时任务，会把整个循环卡住，甚至饿死 I/O 回调——这比慢一点危险得多。
    </p>
    <p>
      接着补 <code>setInterval</code> 的替代方案：如果回调耗时可能超过间隔，长周期任务改用<strong>递归 <code>setTimeout</code></strong>（这次回调执行完，再排下一次），而不是固定间隔的 <code>setInterval</code>，这样就不会堆积、也不会漂移。
    </p>
    <p>
      最后补大延时这一条：需要延后很久时，别用单个巨大的毫秒值（会溢出），改成记录一个目标时间点、用小步长去检查，或配合其它调度手段。
    </p>
    <div class="lesson-box warn">
      <strong>记住这句：<code>setTimeout(fn, 0)</code> 不等于「立即执行」</strong>，它只是「尽快排进 timers 阶段」；真正执行的时刻还要等前面的微任务和当前阶段走完。<code>setImmediate</code> 的名字里有「immediate」，但在顶层脚本里它和 <code>setTimeout(fn, 0)</code> 的先后其实不确定，只有在 I/O 回调内部才稳定地更早。
    </div>

    <h2>实际执行顺序的观察</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行定时器演示」，看日志区按真实执行顺序逐条落下：同步代码最先，接着是 nextTick 与 Promise 回调，然后是 setTimeout / setInterval，最后才是 setImmediate——亲手验证「尽快执行」其实分好几个档次。</figcaption>
      <D25Timers />
    </figure>

    <h2>回调所属的阶段</h2>
    <p>
      Node 的定时器差异，本质上不是「谁更快」，而是「回调落在事件循环的哪个阶段、属于微任务还是宏任务」。写之前先问一句「我需要什么时机执行」，再对号入座：插队的归微任务，延时的归 timers 阶段，I/O 回调里的「立即」归 check 阶段的 <code>setImmediate</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「定时器漂移」</span>指 <code>setInterval</code> 这类周期任务，因为回调执行时间与调度延迟不断累积，实际触发时刻逐渐偏离理论间隔（越走越晚，甚至出现堆积）的现象。边界：漂移只影响「由同一个定时器反复触发」的周期任务，单次 <code>setTimeout</code> 不受其影响；要消除漂移，应改用「回调执行完后重新排一次 <code>setTimeout</code>」的递归写法；无论哪种方式，实际触发时刻都取决于事件循环的拥挤程度，高精度的长周期调度不能只依赖 <code>setInterval</code>。
    </div>
  </LessonArticle>
</template>
