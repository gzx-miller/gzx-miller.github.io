<script setup lang="ts">
import D08Concurrency from './D08Concurrency.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要给五千个用户批量发通知，一句 <code>Promise.all(users.map(send))</code> 让它们全部同时出发，结果短信网关当场限流、本机还因为打开的句柄太多报了 <code>EMFILE</code>；把并发压到「同时最多十个」，总耗时却几乎没变——为什么并发调低不但没变慢，反而更快也更稳？
    </div>

    <h2>批量异步任务的两端</h2>
    <p>
      你手上有一批彼此独立的异步任务：批量发通知、批量读文件、批量调下游接口。逐个 <code>await</code> 要等上一个结束才轮到下一个，太慢；索性一把交给 <code>Promise.all</code> 让它们同时出发，又换来另一头的问题。
    </p>
    <p>
      问题的关键在于「<strong>同时有多少件事在做</strong>」这个数字没有上限。<code>Promise.all</code> 只负责把任务全部发起、再把结果汇总，它并不关心这些任务背后各自占着什么资源。
    </p>

    <h2>无界并发的隐藏账单</h2>
    <ul>
      <li><strong>稀缺资源被瞬间抢空</strong>：每个在途任务都握着一份句柄——socket、文件描述符、数据库连接，几千个一起抢，很快就见底。</li>
      <li><strong>下游有容量天花板</strong>：超出它承受范围的请求轻则排队变慢，重则触发限流甚至引发雪崩。</li>
      <li><strong>一处失败就全体收场</strong>：<code>Promise.all</code> 只要有一个任务 reject，整批立刻 reject，已经成功的结果也一起作废。</li>
      <li><strong>中间状态全堆在内存里</strong>：同时在途的任务越多，占用越大，压力反而不在自己预估的那一头。</li>
    </ul>
    <p>
      所以问题其实是：怎样在不牺牲太多吞吐的前提下，把「同时在做的事」压进一个安全的数量以内？
    </p>

    <h2>固定 worker 的任务池</h2>
    <p>
      换个思路，用<strong>任务池</strong>：准备一条任务队列，起固定数量的 worker（比如 2 个或 10 个），每个 worker 循环「从队列领一个任务 → <code>await</code> 它完成 → 再领下一个」，直到队列取空。
    </p>
    <p>
      这套结构做对了一件根本的事：<strong>它把「无界并发」变成了「有界并发」</strong>。任意时刻在途任务数恰好等于 worker 数，与队里还剩多少任务毫不相干——开场那个「同时十个」正是这么来的。
    </p>
    <p>
      worker 之所以要「<strong>完成一个、再领下一个</strong>」而不是事先把任务平均切开分给各人，是因为任务耗时长短不一：固定切分会让有人早早干完、有人还在排长队；领一个做一个（pull 模型）则让快的自然多干，负载自动被摊平。
    </p>

    <h2>上限要靠压测来定</h2>
    <p>
      有界并发并不能替你回答「到底多少才算合适」。worker 数设太大会照样打垮下游，设太小又白白浪费吞吐。正确的做法是固定队列不变、逐步上调并发，观察下游的错误率与延迟怎么变化，找到「再往上就开始明显变差」的拐点，把上限守在它之前——而不是凭感觉拍一个数字。
    </p>

    <h2>毒丸任务与失败隔离</h2>
    <p>
      并发的收益有一半来自提速，另一半来自<strong>稳健</strong>。要让一个坏任务不至于拖垮整条流水线，需要三处配套：
    </p>
    <ol class="lesson-steps">
      <li>worker 内部用 <code>try ... catch</code> 包住每个任务，出错就记录、然后继续领下一个，绝不让一次失败熔断整批。</li>
      <li>把每个任务包一层、返回成功值或失败原因，整批跑完后统一汇总——这正是 <code>Promise.allSettled</code> 的思路：收集结果，而不是一遇到失败就短路。</li>
      <li>收敛队列与 worker 的收尾：队列空了要让 worker 正常退出，别留下一群空转等待的循环。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>这类池子只接等待型任务：</strong>它是为 I/O 设计的，任务在等网络、等磁盘时会把线程让给别的任务。<strong>CPU 密集</strong>的计算塞进来非但不会更「并发」，还会同步占满线程、把事件循环一起堵死——那种活儿要交给 Worker 线程或子进程。
    </div>

    <h2>在途任务数对照</h2>
    <figure class="lesson-figure">
      <figcaption>点「以并发 2 执行任务」，盯着「执行中」这个数字——它始终不超过 2，说明同时在途的任务被 worker 数量卡住了，而不是 6 个任务一起冲出去。</figcaption>
      <D08Concurrency />
    </figure>

    <h2>并发是个可配置的数字</h2>
    <p>
      任务池把「并发」从一个形容词变成了一个能写进配置的数字：<strong>固定 worker 数、领一个做一个、失败不中断、上限按下游容量定</strong>。它的第一诉求不是跑得最快，而是先保护下游、再谈吞吐。
    </p>
    <div class="lesson-term">
      <span class="term-name">「有界并发（bounded concurrency）」</span>指用固定数量的 worker 从队列领取任务，使任意时刻在途任务数不超过该上限，从而限制对文件句柄、数据库连接与下游带宽的占用。边界与例外：上限应结合下游容量压测确定，并非越大越好；单个任务失败要记录后继续，避免毒丸任务阻塞整条流水线；它适合等待型 I/O，CPU 密集任务应交给 Worker 线程或子进程。
    </div>
  </LessonArticle>
</template>
