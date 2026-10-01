<script setup lang="ts">
import WB15SharedMemoryAtomics from './WB15SharedMemoryAtomics.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>两个顾客各自拼命点「赞」，后台明明执行了 200 次自增，最终点赞数却停在 187——少的那些赞去哪儿了？多线程环境下，同一个计数器怎么就越加越少？
    </div>

    <h2>读改写三步</h2>
    <p>
      你让多个 Worker 共享同一个计数器。问题的根子在「加一」这件事本身不是一步：普通写法是 <code>load</code> 读当前值、加一、再 <code>store</code> 写回，三步之间随时可能被另一个线程插进来。两个线程都读到 5，各自算成 6，又各自写回 6——一次点赞就这么丢了。读得越频繁、线程越多，丢得越狠，最终结果总是小于预期。
    </p>
    <p>
      旧办法也都不趁手：靠加锁——可 JS 里没有原生的共享锁，自己用标志位拼一个同样会踩到同一类竞态；退成单线程——那等于直接放弃并行的意义。问题于是收敛成一句：<strong>怎么让多个线程安全地对同一块内存里的同一个位置做「读-改-写」，而不互相覆盖？</strong>
    </p>

    <h2>共享内存与原子</h2>
    <p>
      有两件东西要一起用。第一件是<strong>共享内存</strong>：模块把内存声明成 <code>(memory (export "memory") 1 1 shared)</code>，它的 <code>buffer</code> 就是一个 <code>SharedArrayBuffer</code>，多个 Worker 看到的是同一块内存。第二件是<strong>原子指令</strong>：累加时不再用普通 load/store，改用原子的「读-改-写」。
    </p>
    <p>
      这个方案做对了一件事：<strong>它让「读-改-写」在一条指令里一气呵成，中途不允许别的线程插进来</strong>。别的线程要么看到加之前的值，要么看到加之后的值，绝不会看到「加到一半」的中间状态。
    </p>

    <h2>原子性适用范围</h2>
    <ul>
      <li>普通 load/store <strong>依旧会丢更新</strong>——原子性只属于原子指令，共享内存本身不会自动帮你加锁。</li>
      <li>光在模块里写 <code>shared</code> 还不够：页面必须启用<strong>跨源隔离</strong>（COOP/COEP 响应头），否则 <code>SharedArrayBuffer</code> 根本创建不出来，<code>crossOriginIsolated</code> 是 <code>false</code>。</li>
      <li>原子访问要求<strong>自然对齐</strong>：地址没落在 4 的倍数上，会直接 trap，而不是悄悄降级。</li>
      <li>共享内存<strong>不能增长</strong>：<code>(memory 1 1 shared)</code> 里最小值必须等于最大值，容量得在声明时就把上限定死。</li>
      <li>原子指令比普通读写慢，别把它当默认选项到处用。</li>
    </ul>

    <h2>不可中断的累加</h2>
    <p>
      先补<strong>原子读-改-写</strong>。核心是 <code>i32.atomic.rmw.add</code>——即演示里的 <code>atomicAdd</code>：它原子地把某个地址上的 <code>i32</code> 加一。整条操作不可分割，正是它把「读、加、写」三步合成了一步，丢更新随之消失。
    </p>
    <p>
      再补<strong>返回值语义</strong>，这一点最容易记反：<code>rmw.add</code> 返回的是<strong>操作前的旧值</strong>，不是加完之后的新值。所以想显示「当前点赞数」，不能拿它的返回值当读数——要么用 <code>atomic.load</code>，要么建一个 <code>Int32Array</code> 视图直接读这块共享内存，演示里就是用后者拿最终值的。
    </p>
    <p>
      接着补<strong>常用的指令族</strong>：<code>atomic.load</code> / <code>store</code> / <code>add</code> / <code>sub</code> 覆盖了基本的原子读写与增减；再往上是 <code>wait</code> / <code>notify</code>，让一个线程能在某个地址上阻塞等待、由另一个线程把它唤醒——这是自己实现锁、以及线程间发信号的基础。
    </p>
    <p>
      最后补<strong>两个必须先满足的环境前提</strong>，缺一不可：模块侧，memory 必须标 <code>shared</code> 且 <code>min = max</code>，buffer 才会是 <code>SharedArrayBuffer</code>；页面侧，必须处于<strong>跨源隔离</strong>状态（响应头带 COOP/COEP），<code>SharedArrayBuffer</code> 才可用。任一条件不成立，要么 buffer 不是 SAB，要么累加又退化成非原子，前面的功夫全白费。
    </p>
    <div class="lesson-box warn">
      <strong>两个高频误区：</strong>其一，以为「用了共享内存就并发安全」——不是，共享内存只负责「同一块」，安全靠的是你每一步都走原子指令；其二，以为 <code>atomicAdd</code> 返回的是自增后的值——它返回<strong>旧值</strong>，要读当前计数请用 <code>atomic.load</code> 或类型化数组视图。
    </div>

    <h2>连点百次计数</h2>
    <figure class="lesson-figure">
      <figcaption>点「连点 100 次」，看点赞数精确地增加 100（而不是少几个）；再看下面两个标记，确认 <code>memory.buffer</code> 确实是 <code>SharedArrayBuffer</code>、页面处于跨源隔离状态。</figcaption>
      <WB15SharedMemoryAtomics />
    </figure>

    <h2>可见性与原子性</h2>
    <p>
      多线程共享计数器会丢更新，是因为「读-改-写」三步可能被打断。共享内存（<code>SharedArrayBuffer</code>）只解决「同一块内存」，真正的安全来自原子指令：<code>i32.atomic.rmw.add</code> 把读改写合成一气呵成的操作。前提是模块声明 <code>shared</code> 且 <code>min = max</code>、页面启用 COOP/COEP 跨源隔离；并且要记住它返回的是旧值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「原子读-改-写（atomic read-modify-write）」</span>指在共享内存上以单条不可分割的指令完成「读值、修改、写回」，从而在多线程并发下不丢更新。Wasm 中以 <code>i32.atomic.rmw.add</code> 实现 <code>atomicAdd</code>，返回<strong>操作前的旧值</strong>。边界：共享内存需在模块声明为 <code>(memory … shared)</code> 且 <code>min = max</code>（不可增长），页面还必须启用 COOP/COEP 跨源隔离 <code>SharedArrayBuffer</code> 才可用；原子访问要求自然对齐，未对齐会 trap；普通 load/store 仍会丢更新；常用指令还包括 <code>atomic.load</code> / <code>store</code> / <code>sub</code> 以及 <code>wait</code> / <code>notify</code>，且原子指令比普通读写慢。
    </div>
  </LessonArticle>
</template>
