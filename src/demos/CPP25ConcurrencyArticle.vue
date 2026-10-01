<script setup lang="ts">
import CPP25Concurrency from './CPP25Concurrency.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你开了十个线程，每个线程只做一件事——把同一个计数器加一。十次加法，结果当然是十。可反复运行，结果在 7 到 10 之间跳，偶尔还会是 8——同一个程序、同一份输入，为什么每次的答案都不一样？
    </div>

    <h2>提出问题</h2>
    <p>
      多线程的目的是让几件事真的同时进行。但一旦两个线程访问<strong>同一块内存</strong>，事情就变了：<code>++counter</code> 在你眼里是一条语句，在机器眼里却是三步——读出来、加一、写回去。两个线程各自读到 7，各自算出 8，各自写回 8，于是一次加法凭空消失了。
    </p>
    <p>
      在 C++11 之前，想用线程只能直接用平台 API，三笔成本都压在写代码的人身上：
    </p>
    <ul>
      <li><strong>平台各异。</strong>类 Unix 上是 <code>pthread</code>，Windows 上是另一套接口，同一份逻辑要写两遍、分平台编译。</li>
      <li><strong>锁没有 RAII。</strong>手动 <code>lock</code> / <code>unlock</code>，中间一旦抛出异常或提前返回，锁就永远不解开，其他线程全部陪葬。</li>
      <li><strong>编译器和语言对线程一无所知。</strong>它不认为这段代码会被并发执行，也不会帮你发现共享数据的访问冲突。</li>
      <li><strong>线程自身的生死要人管。</strong>一个线程该等它结束还是让它自己跑，忘了处理就是崩溃。</li>
    </ul>
    <p>
      所以问题是：<strong>能不能让「开一个线程」「保护一块共享数据」「等某个条件成立」都有类型安全、能自动清理的语言级原语？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：<code>std::thread t(func, args...);</code> 启动一个线程，然后在主线程里 <code>t.join();</code> 等它跑完。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「线程」变成了一个普通的对象</strong>。既然是个对象，就能用对象的那套办法管它——这条思路和前面几课的 RAII、移动语义是同一个方向。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>两个线程同时执行 <code>++counter</code>，读到同一个旧值再各自写回，一次自增被覆盖掉，十次加法只加出了 7 或 8。</li>
      <li>一个 <code>std::thread</code> 对象如果既没 <code>join</code> 也没 <code>detach</code> 就被销毁，析构函数会直接调用 <code>std::terminate</code>，整个进程当场结束。</li>
      <li>手动 <code>mtx.lock()</code> / <code>mtx.unlock()</code> 时，中间抛出异常就永远不解锁，其它等这把锁的线程会无限期阻塞——这是最难排查的一类 bug。</li>
      <li>一个线程要等「队列里来数据了」，用 <code>while (queue.empty()) {}</code> 空转轮询，CPU 被它一个人跑满，白白耗电。</li>
      <li>想让后台任务算完并把结果拿回来，<code>std::thread</code> 根本没有「取结果」这个接口。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用对象管线程」，而是承认线程最大的危险在于<strong>共享数据的访问顺序</strong>，然后一个一个问题去补。
    </p>
    <p>
      第一件要补的是<strong>互斥</strong>。用 <code>std::mutex</code> 保护共享数据：访问前加锁，访问后解锁。但手写 <code>lock</code> / <code>unlock</code> 会重蹈 RAII 课里的覆辙，所以应该用 <code>std::lock_guard</code>——它在构造时加锁、析构时解锁，即使临界区里抛异常也保证解锁。<code>std::unique_lock</code> 更灵活：可以手动 <code>lock</code> / <code>unlock</code>，因此能用于条件变量和下面要说的 <code>std::lock</code>。
    </p>
    <p>
      第二件要补的是<strong>线程对象的收尾</strong>。每个 <code>std::thread</code> 在销毁前必须在 <code>join()</code>（等它跑完）和 <code>detach()</code>（放它自己跑）之间二选一，而几乎所有场景都应该选 <code>join</code>：你需要知道它跑完了、需要它别在你还用着共享数据时就消失。忘了处理就会 <code>std::terminate</code>。
    </p>
    <p>
      第三件要补的是<strong>同时锁多把锁时的死锁风险</strong>。线程 A 先锁 m1 再锁 m2，线程 B 先锁 m2 再锁 m1，两边各持一把、都在等对方放手，谁也走不了。正确做法是用 <code>std::lock(m1, m2)</code> 一次性把多把互斥量锁住，它内部使用能避免死锁的算法；已经锁住之后再交给 <code>lock_guard</code> 接管，用 <code>std::adopt_lock</code> 告诉它「锁已经上过了，你只负责到时候解锁」。
    </p>
    <p>
      第四件是<strong>让线程能等待，而不是空转</strong>。这就是条件变量 <code>std::condition_variable</code> 的用途：一个线程在条件不满足时 <code>wait</code> 挂起，另一个线程改变状态后 <code>notify_one()</code> 或 <code>notify_all()</code> 唤醒它。等待的表达方式是关键——必须放在循环里反复检查条件：
    </p>
    <ol class="lesson-steps">
      <li>先判断条件是否已经成立，成立就直接往下做，不必等待。</li>
      <li>不成立才调用 <code>wait</code>，它会原子地释放锁并挂起当前线程。</li>
      <li>被唤醒后<strong>重新检查条件</strong>，仍不满足就继续等——所以外面要套 <code>while</code>，或直接使用 <code>cv.wait(lock, pred)</code> 这个自带循环的重载。</li>
      <li>另一个线程修改完共享状态，再调用 <code>notify_one</code> / <code>notify_all</code> 唤醒等待者。</li>
    </ol>
    <p>
      为什么非要循环？因为存在<strong>虚假唤醒</strong>：即使没有任何人调用 <code>notify</code>，等待的线程也可能被系统莫名其妙地唤醒。如果只写一次 <code>if (queue.empty()) wait(lock);</code>，被虚假唤醒后它会在队列还是空的时候继续往下跑，直接崩溃。
    </p>
    <p>
      第五件是<strong>带返回值的异步任务</strong>。开线程干活常常是为了「算一个东西并拿回来」，而这正是 <code>std::thread</code> 做不到的。<code>std::async</code> 补上了这一块：<code>auto fut = std::async(std::launch::async, func, args...);</code> 立刻启动（或按调度启动）任务并返回一个 <code>std::future</code>，调用 <code>fut.get()</code> 时阻塞等待结果。它还顺手把上一课的异常传播接了过来——<strong>如果任务内部抛了异常，这个异常会被存进 future，并在你 <code>get()</code> 的那一刻重新抛出</strong>，跨线程也能正常报错。
    </p>
    <p>
      最后两个边界要记清楚。<code>std::future</code> 的 <code>get()</code> <strong>只能调用一次</strong>，调用之后这个 future 就失效了；如果确实需要多个地方读到同一个结果，改用 <code>std::shared_future</code>。另外，C++20 又补了一批并发原语——信号量（<code>std::counting_semaphore</code>、<code>std::binary_semaphore</code>）、闩（<code>std::latch</code>）、屏障（<code>std::barrier</code>），它们解决的是「多个线程互相等对方到某个点」这类更复杂的问题。
    </p>
    <div class="lesson-box warn">
      <strong>三条最容易踩的线：</strong>没有任何同步就并发读写同一块内存，是<strong>数据竞争</strong>，在标准里属于未定义行为；别把耗时操作放进临界区，锁内的每一毫秒都在让其他线程排队；<code>std::lock_guard</code> 不能在作用域中途手动 <code>unlock</code>，需要这种灵活性就换 <code>std::unique_lock</code>。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>看代码里两种保护方式的分工：<code>printThreadId</code> 用 <code>std::lock_guard&lt;std::mutex&gt;</code> 保证多线程打印不交错，十个线程各自 <code>++counter</code> 也被同一把锁包住，最后计数器稳定输出 10 而不是 7、8。</figcaption>
      <CPP25Concurrency />
    </figure>

    <h2>总结</h2>
    <p>
      并发的难点从来不是「怎么开线程」，而是<strong>多个线程碰到同一块内存时，谁先谁后由不得你</strong>。C++11 的答案是把这件事交给几个各有分工的 RAII 原语：用 <code>std::mutex</code> 配 <code>lock_guard</code> 圈出临界区，用 <code>std::lock</code> 一次性锁多把锁避免死锁，用条件变量带循环地等条件，用 <code>std::async</code> 拿回带异常的返回值。剩下的规矩就三条：有共享就有同步、别忘了 join、别在锁里干重活。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数据竞争」</span>指两个及以上线程同时访问同一内存位置，其中至少有一个是写操作，且它们之间没有任何同步关系。在 C++ 标准里这是<strong>未定义行为</strong>——不是「结果可能不对」这么轻，而是编译器可以做任何假设、优化出任何结果。边界：只读的并发访问不算数据竞争；用互斥量或原子操作建立起 happens-before 关系才能消除它。要特别注意的是，加了锁并不等于就没竞争，必须保证<strong>该内存的所有访问路径都被同一把锁覆盖</strong>。
    </div>
  </LessonArticle>
</template>
