const n=`<script setup lang="ts">
import D22PerfHooks from './D22PerfHooks.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>线上接口的 P99 从 80ms 涨到了 400ms。你翻代码，一眼揪出那段「在循环里用加号拼字符串」的祖传逻辑，认定就是它，花一下午改成数组 <code>join</code>。上线后 P99 只降了 3ms——真正吃掉时间的，是你从没怀疑过的一句 <code>JSON.parse</code>。
    </div>

    <h2>缺少数据盲目优化</h2>
    <p>
      你想做优化，手上却没有任何「哪段代码各自花了多久」的数据。只能靠「哪段看着复杂、哪段不像好代码」来猜。这套凭经验的做法，把三笔成本悄悄转嫁给了你：
    </p>
    <ul>
      <li>直觉指向的往往是显眼而非耗时的代码：循环拼接看着低效，实际可能只占总耗时的百分之一，改它等于白忙。</li>
      <li>改错地方不但没有收益，还得搭上回归测试与上线排期，甚至引入新 bug。</li>
      <li>没有优化前的基线，改完根本分不清那点变化是真的收益，还是机器抖动带来的噪声——有时候改慢了也无从察觉。</li>
    </ul>
    <p>
      <strong>能不能在不挂重型诊断器的前提下，把每段逻辑各自花了多少时间，准确地量出来？</strong>
    </p>

    <h2>手动计时测量</h2>
    <p>
      最朴素也真能跑的办法：在待测逻辑的前后各读一次 <code>performance.now()</code>，两个数一减就是这段代码的耗时。
    </p>
    <p>
      它做对了一件关键的事：<strong>把「感觉慢」变成了一个可比较的数字</strong>。而且 <code>performance.now()</code> 用的是单调递增的高精度时钟，不受系统时间被调整的影响，比 <code>Date.now()</code> 更适合做耗时测量。
    </p>

    <h2>测点散落混乱</h2>
    <ul>
      <li>点位一多就散：每段逻辑都要自己起名、自己用变量接住两次读数，测点越多，散落的临时变量越乱。</li>
      <li>只能量「一段代码」，产出不了带名字、带元数据、带类别的区间记录，别的模块也无法统一读取。</li>
      <li>并发一高就脏：两个请求同时走到这里，裸变量互相覆盖，你测到的那个 400ms 到底是哪一次调用，说不清。</li>
      <li>想在生产里长期采集，靠 <code>console.log</code> 既污染日志，又有同步 IO 开销，测量本身反倒成了负担。</li>
    </ul>

    <h2>性能条目标记测量</h2>
    <p>
      不推翻「前后取时间求差」，而是把这件事<strong>标准化成有名字的性能条目</strong>。Node 的 <code>perf_hooks</code> 提供了一套与浏览器 <code>performance</code> API 兼容的接口，先打点、再测量：
    </p>
    <ol class="lesson-steps">
      <li>在起点调用 <code>performance.mark('A')</code>，留下一个命名标记。</li>
      <li>执行待测逻辑。</li>
      <li>在终点再调 <code>performance.mark('B')</code>。</li>
      <li>用 <code>performance.measure('A到B', 'A', 'B')</code> 量出两点之间的区间，得到一条带 <code>name</code> 与 <code>duration</code> 的性能条目。</li>
    </ol>
    <p>
      之所以先补这一步：它一次性解决了「点位分散、没有名字、无法统一读取」三个毛病。有了结构化的条目，才谈得上自动化采集。接下来用 <code>PerformanceObserver</code> 监听 <code>entryTypes: ['measure']</code>，条目一产生就立刻拿到，统一汇总上报或画成面板，不必再手动收集。
    </p>
    <p>
      补完测量，还差三件事。第一，<strong>清理</strong>：mark 与 measure 条目会累积在内部缓冲区，进程长时间运行若从不清理，内存会缓慢增长，要周期性调用 <code>clearMarks()</code> / <code>clearMeasures()</code>。第二，<strong>采样</strong>：测量本身也有开销，生产环境不能全量采集，要按比例抽样并评估上报频率，否则观测手段自己会变成新的瓶颈。第三，<strong>下钻</strong>：mark/measure 只告诉你「哪个区间慢」，不告诉你「区间里到底哪个函数慢」。定位到函数级得换采样剖析工具，用 <code>clinic.js</code> 或 <code>0x</code> 生成火焰图继续看。
    </p>
    <p>
      最后一环常被忽略：优化前后要用<strong>同一段逻辑、同一台机器</strong>再打一次点做对比，确认收益是真的。刚启动的进程还有 JIT 预热和冷缓存，第一次测出来的数字天生偏慢，拿它当基线会得出错误结论。顺带一提，<code>perf_hooks</code> 是 Node 内置模块，无需安装，随时可用。
    </p>
    <div class="lesson-box warn">
      <strong>最常见的误区：</strong>跳过测量直接改代码。没有数据支撑的性能改动可能毫无收益——你以为的瓶颈和真实的瓶颈，往往根本不是同一段代码。顺序永远是「先量化，再优化，再验证」。
    </div>

    <h2>四段逻辑耗时排行</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行性能基准测试」，四段逻辑会依次执行，每段的耗时以条形长度直观展示——你会发现最慢的往往是排序，最快的可能是正则，和「哪段代码看起来复杂」并没有必然联系。</figcaption>
      <D22PerfHooks />
    </figure>

    <h2>先测量再决定优化</h2>
    <p>
      性能问题的第一性问题不是「怎么优化」，而是「怎么知道该优化哪里」。用 <code>mark</code> / <code>measure</code> 把一堆模糊的「慢」变成一组可对比的数字，先找到真正的大头，再决定要不要动手——这一步做对了，优化才不至于把力气花在错的地方。
    </p>
    <div class="lesson-term">
      <span class="term-name">「火焰图」</span>是采样剖析工具（如 <code>0x</code>、<code>clinic.js</code>）把运行期间采集到的调用栈样本按频率聚合后绘出的可视化图形，横条越宽表示该函数在采样中出现的次数越多、越可能是热点。边界：它展示的是<strong>采样占比而非精确耗时</strong>，且本身有采样开销，适合定位「哪个函数最费时」，不适合测量某段代码的准确毫秒数——要精确计时仍应使用 <code>performance.mark()</code> / <code>performance.measure()</code>。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
