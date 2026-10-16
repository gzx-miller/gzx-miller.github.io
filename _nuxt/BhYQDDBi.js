const e=`<script setup lang="ts">
import CPP25Concurrency from './CPP25Concurrency.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>有一段互不依赖的计算，顺序跑要好几秒 —— 想「同时」跑几件，可一旦多个执行流同时读写同一块内存，结果就不再由代码顺序决定。怎么开线程，又怎么保证它们不互相踩踏？
    </div>

    <h2>先朴素做法：单线程顺序执行</h2>
    <p>
      最初一切都在一条执行流里顺序发生：先算完一件事，再算下一件。
    </p>
    <ul>
      <li>做对的地方：<strong>可预测</strong>。语句的执行顺序、变量的读写次序都由代码唯一确定，调试也简单。</li>
      <li>不足：当任务之间本就没有依赖时，顺序执行白白浪费了多核 CPU；而并行执行会立刻带来一个新问题 —— 共享数据被多个执行流同时访问，行为不再确定。</li>
    </ul>
    <p>
      因此并发编程要同时解决两件事：<strong>如何创建并行执行流</strong>，以及<strong>如何让并发访问共享数据仍然确定</strong>。C++11 把这两件事都做进了标准库。
    </p>

    <h2>std::thread 的创建与生命周期</h2>
    <p>
      <code>std::thread</code> 表示一条线程，<strong>构造时即启动</strong>：把可调用对象和它的参数交给构造函数，新线程马上开始执行。<code>&lt;thread&gt;</code> 是它所在的头文件。
    </p>
    <ul>
      <li>参数默认<strong>按值拷贝</strong>进新线程；若要真正传引用，必须用 <code>std::ref</code> 显式包装，否则编译器会复制一份副本，改动不会反映到原变量。</li>
      <li>线程对象的生命周期需要明确收尾：<code>t.join()</code> 等待它结束，或 <code>t.detach()</code> 把它放走、后台独立运行。</li>
      <li>铁律：<strong>在线程对象析构前，必须已经 join 或 detach</strong>，否则析构会调用 <code>std::terminate</code> 终止程序。可用 <code>joinable()</code> 判断是否尚未收尾。</li>
    </ul>
    <p>
      这条铁律背后还是 RAII 式的思路：线程也是一种需要「接手」的资源，谁创建，谁就得负责在销毁前处理好它。
    </p>

    <h2>数据竞争、mutex 与原子操作</h2>
    <p>
      多个线程在<strong>无同步</strong>的情况下同时访问同一内存、且至少有一个在写，就叫<strong>数据竞争</strong>（data race），其行为是未定义的 —— 不是「结果可能不对」，而是「程序的行为没有保证」。解决方式有两类。
    </p>
    <ul>
      <li><strong>互斥量 <code>std::mutex</code></strong>：用 <code>lock</code> / <code>unlock</code> 把临界区保护起来。手工配对太危险，因此用 RAII 锁包装：<code>std::lock_guard</code> 在构造时加锁、析构时解锁，是绝大多数场景的首选；<code>std::unique_lock</code> 更灵活，可以手动 <code>lock</code> / <code>unlock</code>，也是配合条件变量所必需的。</li>
      <li>需要同时锁住多个互斥量时，用 <code>std::lock</code> 一次性加锁，它以能避免死锁的算法处理加锁顺序，再配 <code>std::adopt_lock</code> 把已加好的锁交给 <code>lock_guard</code> 接管。</li>
      <li><strong>原子类型 <code>std::atomic</code></strong>：对计数、标志位这类简单变量的读写，可以用原子操作直接完成，无需互斥量，往往更轻量。例如 <code>std::atomic&lt;int&gt;</code> 上的自增是原子的。</li>
    </ul>
    <p>
      使用锁有一条容易被忽略的原则：<strong>锁的临界区越小越好</strong>，尤其不要在持锁期间做耗时操作，否则并发会退化成排队。
    </p>

    <h2>条件变量：等待与通知</h2>
    <p>
      有时线程需要等待「某个条件成立」，比如队列非空。用锁加轮询来等既浪费 CPU 又不好写，<code>std::condition_variable</code> 正是为此设计：一个线程在条件不满足时挂起等待，另一个线程在改变条件后通知它。
    </p>
    <ul>
      <li>等待必须配合 <code>std::unique_lock</code>，形式为 <code>cv.wait(lock, pred)</code>：它在等待期间释放锁，被唤醒后重新持锁，并<strong>循环检查谓词</strong>。</li>
      <li>一定要用带谓词的重载（或自己写 <code>while (!pred) cv.wait(lock);</code>），因为条件变量存在<strong>虚假唤醒</strong>：即使无人通知，等待也可能被系统提前唤醒，不加检查就会读到未成立的条件。</li>
      <li>改变条件后调用 <code>notify_one()</code> 唤醒一个等待者，或 <code>notify_all()</code> 唤醒全部。通知通常在释放锁之后进行，减少被唤醒线程立即再次阻塞的概率。</li>
    </ul>

    <h2>std::async、future 与 promise</h2>
    <p>
      若只是想把一个任务丢到后台异步执行、之后取回结果，用 <code>std::async</code> 比手工 <code>std::thread</code> + 共享变量更省心。<code>&lt;future&gt;</code> 是它所在的头文件。
    </p>
    <ul>
      <li><code>std::async</code> 启动任务并返回 <code>std::future</code>，<code>fut.get()</code> 阻塞直到任务完成并取回结果。</li>
      <li>它的一个重要优点是<strong>异常传播</strong>：任务里抛出的异常会被保存，在调用 <code>get()</code> 时重新抛出，从而把「后台发生的错误」带回主线程处理。</li>
      <li><code>get()</code> 只能调用一次，之后 <code>future</code> 失效；需要多次取值就用 <code>std::shared_future</code>。</li>
      <li>启动策略 <code>std::launch::async</code> 表示立刻新建线程执行；<code>std::launch::deferred</code> 则推迟到首次 <code>get</code> 时才在当前线程执行。此外 <code>std::promise</code> 允许在任意时刻手动设置值，与 <code>future</code> 配成一对生产/消费的接口。</li>
    </ul>

    <h2>看一遍线程、锁与异步任务</h2>
    <figure class="lesson-figure">
      <figcaption>示例演示多条 std::thread 的创建与 join、用 std::lock_guard 保护共享计数器，以及 std::async 启动任务后通过 std::future::get 取回结果；可对照输出验证互斥保护与异步取值的写法。</figcaption>
      <CPP25Concurrency />
    </figure>

    <h2>先想清楚「谁和谁共享什么」</h2>
    <p>
      并发代码的复杂度几乎都来自共享：一旦有共享且可写的数据，就必须有同步，否则就是未定义行为。因此写并发程序的第一步不是「开线程」，而是先问清楚 —— 哪些数据会被多个线程碰到？它们之间需要互斥量保护，还是用原子操作就够了？需要彼此等待时，条件变量要配哪个谓词？把这些问题答清楚，<code>std::thread</code>、<code>std::mutex</code>、<code>std::condition_variable</code>、<code>std::async</code> 不过是把答案写下来的工具而已。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数据竞争」</span>指多个线程无同步地访问同一内存且至少一个在写，其行为是未定义的。<span class="term-name">「互斥量」</span>用于保护临界区，<code>lock_guard</code> / <code>unique_lock</code> 以 RAII 方式自动加解锁。<span class="term-name">「条件变量」</span>让线程在条件不满足时挂起、条件改变后被通知，必须循环检查谓词以应对虚假唤醒。<span class="term-name">「future」</span>代表一个尚未就绪的异步结果，<code>get()</code> 等待并取值、同时传播异常。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
