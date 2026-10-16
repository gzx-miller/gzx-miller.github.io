<script setup lang="ts">
import PY19Concurrency from './PY19Concurrency.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你的程序要做 4 次网络请求，串行跑要 2 秒。于是你起了 4 个线程，本以为会缩短到 0.5 秒，结果<strong>时间几乎没变</strong>。线程明明「同时」在跑，为什么没有变快？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      串行是最容易写对的方案：一个循环，做完一件再做下一件，逻辑清晰、没有共享状态、结果确定。4 个请求就是 <code>req1 → req2 → req3 → req4</code>，总耗时等于各自耗时相加。
    </p>
    <p>
      可当任务多起来，串行就显得浪费——每个网络请求大部分时间都在<strong>等待</strong>，而 CPU 只能干瞪眼等第一个返回。直觉告诉我们「同时发起不就好了」，于是就有了多线程。问题是：加线程真的能变快吗？答案取决于这些任务<strong>在等什么</strong>。
    </p>

    <h2>GIL：为什么线程常常加了个寂寞</h2>
    <p>
      CPython 有一把<strong>全局解释器锁</strong>（Global Interpreter Lock，GIL）：在任意时刻，只有<strong>一个线程</strong>能执行 Python 字节码。这意味着即便你起 10 个线程，纯 Python 计算也只能一个个排队跑——多线程在这种场景下不带来加速，甚至因为切换开销更慢。
    </p>
    <p>
      但 GIL 并非「一票否决」多线程。关键在于：线程执行<strong>阻塞式 I/O</strong>（等网络、等磁盘、等锁）时，会主动<strong>释放 GIL</strong>，别的线程可以趁机运行。所以 GIL 限制的是「纯计算的并行」，而不是「等待的重叠」。这正好解释了开场问题——如果那 4 个请求是 I/O 等待，多线程应当明显变快；若时间没变，多半是你测的其实是 CPU 计算。
    </p>

    <h2>threading：I/O 密集的第一选择</h2>
    <p>
      判断依据是任务的<strong>瓶颈在哪</strong>：任务大部分时间在等外部资源（I/O 密集），就用 <code>threading</code>。线程创建开销小，能共享同一进程内存，写起来也直接：
    </p>
    <ul>
      <li>用 <code>Thread(target=func, args=(...))</code> 建立线程，<code>start()</code> 启动，<code>join()</code> 等它结束。</li>
      <li>多个线程同时读写同一份数据，必须用 <code>Lock</code> 保护，否则会出现竞态。</li>
      <li>线程适合「等待型」任务：抓取网页、批量读文件、数据库查询。</li>
    </ul>

    <h2>multiprocessing：CPU 密集靠多进程</h2>
    <p>
      当瓶颈是<strong>计算本身</strong>（大量循环、数值运算、图像处理），线程受 GIL 限制帮不上忙，就改用 <code>multiprocessing</code>：每个进程有自己独立的解释器和 GIL，因此可以真正同时计算，把多核吃满。
    </p>
    <p>
      代价也要认清楚：进程不共享内存，<strong>数据要序列化（pickle）后传递</strong>，因此传大对象、频繁通信会很慢；进程启动也有可观开销。这也是 CPU 密集任务「进程数不是越多越好」的原因——超过核数只会增加调度与序列化成本。
    </p>

    <h2>concurrent.futures：两种池的统一入口</h2>
    <p>
      手写 <code>Thread</code> / <code>Process</code> 太底层，标准库提供了更高级的封装——<strong>执行器</strong>。<code>ThreadPoolExecutor</code> 管线程池，<code>ProcessPoolExecutor</code> 管进程池，接口几乎一致，切换只需换一个类名：
    </p>
    <ol class="lesson-steps">
      <li><code>executor.map(func, items)</code>：把任务逐个分发，返回结果顺序与输入一致，写起来最像普通循环。</li>
      <li><code>futures = [executor.submit(func, x) for x in items]</code>：提交后立刻拿到 <code>Future</code> 句柄，可稍后取结果。</li>
      <li><code>concurrent.futures.as_completed(futures)</code>：<strong>谁先完成就先产出谁</strong>，适合「先到先处理」，不必等最慢的那个。</li>
    </ol>
    <p>
      用 <code>with</code> 语句包住执行器，退出时会自动等待并回收线程/进程，和文件一样不用手动清理。
    </p>

    <h2>线程安全：共享数据必须上锁</h2>
    <p>
      多线程最容易出错的地方，是「读—改—写」不是原子的。比如 <code>counter += 1</code> 会被拆成读值、加一、写回三步，两个线程交错执行就可能丢掉一次加一。解药是 <code>Lock</code>：进入临界区前 <code>acquire()</code>（或用 <code>with lock:</code>），改完再释放，保证同一时刻只有一个线程在改。
    </p>
    <div class="lesson-box warn">
      <strong>能用消息传递，就别共享状态：</strong>共享变量越多、越复杂，越难保证线程安全。优先让每个任务只处理自己的数据，把结果汇总到一处；必须共享时才加锁，并尽量缩小临界区范围。
    </div>

    <h2>怎么选：一句话判断</h2>
    <p>
      先问瓶颈是「等」还是「算」：<strong>等一下就用线程，算得多就用进程，两者都要就组合起来</strong>。I/O 密集的任务用 <code>ThreadPoolExecutor</code>；CPU 密集的任务用 <code>ProcessPoolExecutor</code>；数量不大又要求先到先处理时，顺带用上 <code>as_completed</code>。不确定时，先做小规模计时实验再决定，别凭感觉。
    </p>

    <h2>看一遍对比与耗时</h2>
    <figure class="lesson-figure">
      <figcaption>上方表格对比线程与进程的适用场景；下方切换「I/O 密集 / CPU 密集」，再点「串行 / 线程并发 / 进程并发」，观察总耗时如何随瓶颈不同而改变。</figcaption>
      <PY19Concurrency />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      GIL 让纯 Python 计算无法靠线程并行，所以<strong>I/O 密集用 <code>threading</code>（等待时释放 GIL），CPU 密集用 <code>multiprocessing</code>（绕开 GIL）</strong>；<code>concurrent.futures</code> 用 <code>ThreadPoolExecutor</code> / <code>ProcessPoolExecutor</code> 统一了两种池的接口，<code>as_completed</code> 让先完成的先产出；共享状态必须加 <code>Lock</code>，进程间传参要承受序列化成本。
    </p>
    <div class="lesson-term">
      <span class="term-name">「GIL」</span>即全局解释器锁，保证 CPython 同一时刻只有一个线程执行字节码。边界与例外：它限制的是纯 Python 计算的并行，不阻止 I/O 等待的重叠；执行阻塞 I/O 时会释放锁，因此线程仍能加速 I/O 密集任务；想真正并行计算必须改用多进程或原生扩展。
    </div>
  </LessonArticle>
</template>
