const n=`<script setup lang="ts">
import D20Cluster from './D20Cluster.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把 Node 接口部署到一台 16 核的服务器上，结果 <code>top</code> 里只有一颗核跑到 100%，其余十五颗全程闲着，吞吐量怎么压都上不去。你试着把应用再起一个副本——可客户端得知道连哪个端口，负载均衡、会话语义又得从头做一遍。
    </div>

    <h2>单进程单核瓶颈</h2>
    <p>
      Node 的一个进程只有一个主线程、一个事件循环，也就是<strong>只吃一个核</strong>。在一台多核机器上，「多核」这份硬件红利，单进程天然拿不到。你以前想绕过它，通常有这么几条路：
    </p>
    <ul>
      <li>多开几个进程，各听各的端口，前面挂一层 Nginx 做转发——端口、健康检查、负载均衡、崩溃重启全得自己维护。</li>
      <li>用 PM2 的 cluster 模式——很好用，但它内部封装的其实就是接下来要讲的 <code>cluster</code> 模块。</li>
      <li>自己写多进程 + 手动分发连接——要处理惊群、连接派发、异常重启，坑一个接一个。</li>
    </ul>
    <p>
      <strong>能不能让多个进程共享同一个端口，由 Node 自己把连接分给还有余力的进程？</strong>
    </p>

    <h2>主从进程角色</h2>
    <p>
      <code>cluster</code> 模块就是干这个的。用 <code>cluster.isPrimary</code> 区分两种角色：主进程按 CPU 核数 <code>cluster.fork()</code> 出若干个工作进程；每个工作进程里照常 <code>http.createServer(...).listen(3000)</code>。
    </p>
    <p>
      它做对了一件很关键的事：<strong>多个工作进程可以直接 listen 同一个端口</strong>。在别的语言里，这通常要主进程 <code>accept</code> 之后自己把连接分发出去；Node 把这件事做进了运行时，你只要 fork 就够了。
    </p>

    <h2>进程内存不共享</h2>
    <ul>
      <li><strong>内存不共享</strong>：你在工作进程 A 里把 <code>count</code> 加一，进程 B 完全不知道。主进程里的缓存、会话、限流计数，各进程各有一份。</li>
      <li>默认的轮询（Round-Robin）分发是「挨个给」，不是「给最闲的」——请求耗时差异大时，负载可能并不均衡。</li>
      <li>工作进程崩了<strong>不会自动重启</strong>，得自己监听退出事件再补一个，否则处理能力会被悄悄削掉一块。</li>
      <li>如果换成 <code>SO_REUSEPORT</code> 那套「各进程自行 accept」的模式，行为与默认的轮询分发并不一样，不能想当然。</li>
      <li>没有优雅关闭：收到终止信号就一刀切，正在处理的请求直接断掉。</li>
    </ul>

    <h2>工作进程自动重启</h2>
    <p>
      先补<strong>崩溃自愈</strong>。主进程监听 <code>cluster.on('exit', ...)</code>，任何一个工作进程退出，就立刻再 <code>fork()</code> 一个补上。之所以先补它：单进程崩溃等于全站不可用，而「挂了能自己爬起来」正是多进程架构最直接的收益。
    </p>
    <p>
      再补<strong>共享状态外置</strong>。既然进程隔离是默认行为、改不掉，那就别在内存里存会话、缓存、计数器——把它们搬到 <code>Redis</code> 或数据库这类外部共享存储里，任何工作进程都能读到同一份。
    </p>
    <p>
      接着补<strong>优雅关闭</strong>。收到 <code>SIGTERM</code> 时，先停止接收新连接，把在途请求处理完，再用 <code>disconnect()</code> 断开；超过时限还没退出的，才强制 <code>kill</code>。这样滚动发布时才不会随机丢掉请求。
    </p>
    <p>
      最后补<strong>可观测</strong>。统计每个工作进程实际处理了多少请求、负载如何，确认轮询分发在真实流量下确实均衡；如果某个进程长期偏重，就该考虑调整分发策略，或检查是不是有请求在特定进程里卡住。至于数量，工作进程数一般取 <code>os.availableParallelism()</code>，但内存占用也会随之翻倍，在容器里要按 cgroup 的限额来定，别死记「等于核数」。
    </p>
    <div class="lesson-box hint">
      <strong>和子进程课的分工：</strong><code>child_process</code> 解决「执行外部命令、隔离单个任务」；<code>cluster</code> 解决「把一台机器的多核吃满、并且挂了能自愈」。两者都基于 <code>fork</code>，但目标不同，别混用。
    </div>

    <h2>请求分发轮转机制</h2>
    <figure class="lesson-figure">
      <figcaption>调整工作进程数，点「启动集群模拟」，看 12 个请求是怎么被轮流派到各工作进程的，以及结束后每个进程的处理计数是否均匀。</figcaption>
      <D20Cluster />
    </figure>

    <h2>多核利用与状态外置</h2>
    <p>
      <code>cluster</code> 用「主进程 fork 出一组共享同一端口的工作进程」这套架构，把单机 Node 服务从「吃一个核」变成「吃满多核」，同时借进程隔离把一次崩溃限制在单个工作进程，自己再把它拉起来。要带走的判断是：多核的前提是<strong>状态不能留在内存里</strong>——会话、缓存一旦外置成共享存储，横向扩展才真正成立。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Round-Robin 轮询分发」</span>是 <code>cluster</code> 在大多数平台上的默认负载均衡方式：由主进程接收连接，按顺序轮流分给各个工作进程，而不是按谁最空闲来分；另一套模式是让各进程用 <code>SO_REUSEPORT</code> 自行 accept。它的边界是：轮询只保证「分配次数」大体均匀，<strong>不保证负载均衡</strong>，请求耗时差异大时仍需按实际监控评估，必要时改用其它分发策略。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
