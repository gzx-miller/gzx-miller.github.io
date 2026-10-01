<script setup lang="ts">
import D28Os from './D28Os.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给服务加了「健康检查」接口，永远回一句 <code>{ status: 'ok' }</code>，负载均衡据此一直认为它很健康；直到进程内存涨到被系统杀掉的前一刻，这个接口仍然在回 <code>ok</code>——一个从不预警的健康检查，问题出在哪？
    </div>

    <h2>提出问题</h2>
    <p>
      你要让编排系统、负载均衡知道某个实例「现在还能不能服务」，同时还要让同一份代码在不同操作系统上都跑得起来。这两件事都要求进程先能<strong>看清自己所处的运行环境</strong>。
    </p>
    <p>
      如果不主动去取这些事实，就有几笔成本要人扛：<strong>只能靠人盯日志、盯监控面板</strong>，等你看见的时候通常已经出事了；<strong>要在代码里到处硬编码平台差异</strong>——不同系统的路径分隔符、打开文件的命令，散落各处，换个平台就崩；<strong>出问题前没有任何「提前量」</strong>，只能等业务报错再回头反查。
    </p>
    <p>
      问题落到一句话：进程要如实说明自己的平台、资源与运行时长，<strong>这些事实从哪里取，取到的又能不能信？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      用 Node 内置的 <code>node:os</code>。它把运行环境的事实直接暴露成函数：<code>os.platform()</code> 给平台名，<code>os.arch()</code> 给 CPU 架构，<code>os.cpus().length</code> 给核心数，<code>os.totalmem()</code> 与 <code>os.freemem()</code> 给总内存和空闲内存（字节），<code>os.uptime()</code> 给系统运行秒数。把它们组装进一个 <code>/health</code> 接口返回 JSON。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>它把「环境事实」变成了程序可读的数字</strong>，服务得以主动上报自己的状态，而不是等人去外部测量。跨平台差异也第一次有了统一的读取入口。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>把接口写成永远返回 <code>ok</code>，等于<strong>没有阈值可言</strong>：内存占用已经 95%，它照样回 <code>ok</code>，负载均衡不会把它摘掉。</li>
      <li>在容器里，<code>os.totalmem()</code> 与 <code>os.freemem()</code> 读到的是<strong>宿主机</strong>的内存，<strong>不是</strong> cgroup 分配给这个容器的限额——进程会误以为「还有大把内存」，直到被容器级 OOM 杀掉。</li>
      <li><code>os.loadavg()</code> 在 Windows 上恒等于 <code>[0, 0, 0]</code>，拿它做跨平台负载判断会永远读到 0。</li>
      <li>按平台<strong>硬编码</strong>路径分隔符或命令——写死一个反斜杠或写死某个系统的命令——换个平台立刻出错，应当用 <code>os.platform()</code> 判断、用 <code>path.sep</code> 取分隔符。</li>
      <li>健康检查本身如果很重（每次请求都遍历 CPU、做同步 I/O），反而给系统额外加负担，检查成了坏消息。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先给健康检查补上<strong>可判断的阈值</strong>，因为「会不会出事」要提前说，就得有量化标准。内存占用率用 <code>1 - freemem / totalmem</code> 算，系统运行时长用 <code>os.uptime()</code> 看，超过约定阈值就把状态置为 <code>not ready</code>，让上游把实例摘掉。指标只有配上阈值，才能从「一句 ok」变成「能预警的信号」。
    </p>
    <p>
      再补<strong>容器这个边界</strong>。容器的出现打破了「os 读到的就是本进程可用资源」这个假设：这些函数返回的是宿主视角的数字，真实限额以 cgroup 为准。所以在容器里，基于 <code>os</code> 的内存判断只能当<strong>粗指标</strong>；要拿来做硬决策，还得再叠加对 cgroup 限额的读取。理解这一点，才不会把「宿主还有内存」误当成「我还有内存」。
    </p>
    <p>
      接着补<strong>平台适配</strong>。把散落各处的平台判断收敛到 <code>os.platform()</code> 的返回值（<code>'darwin'</code> / <code>'linux'</code> / <code>'win32'</code>）上，用 <code>path.sep</code> 取路径分隔符，而不是自己写死一个。多核利用这一块，<code>os.cpus().length</code> 是决定起多少个工作进程的常见依据——进程池的规模不该是拍脑袋写下的常量。
    </p>
    <p>
      最后让检查<strong>足够轻</strong>。健康检查接口的职责是「快速给个结论」，不该每次请求都去做重活：指标可以在别处定时采集、算好之后缓存，接口只读缓存。否则检查频率一高，检查本身就把系统拖慢了，得不偿失。
    </p>
    <div class="lesson-box warn">
      <strong>三个前提要记牢：</strong>容器里 <code>os</code> 读到的是宿主视角的资源，真实限额看 cgroup，别据此做硬判断；<code>os.loadavg()</code> 在 Windows 上恒为 0，不能跨平台依赖；健康检查要轻，重活应挪到后台定时任务，别放在请求路径上。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>看页面里「浏览器端能获取的系统信息」与「Node 里 <code>os</code> 能取到什么」的对照——注意总内存、空闲内存、系统运行时长这些指标只有服务端 <code>os</code> 才给，浏览器只能拿到平台与核心数的近似值。</figcaption>
      <D28Os />
    </figure>

    <h2>总结</h2>
    <p>
      <code>os</code> 把运行环境的事实——平台、架构、核心数、内存、运行时长——变成程序可读的数字，是资源监控、健康检查与平台适配的共同数据源。真正让它有用的不是「能读到数」，而是<strong>给这些数配上阈值、认清容器下它只是宿主视角、并把检查做成轻量的读缓存</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「健康检查」</span>指由服务对外暴露、供负载均衡或编排系统探测实例是否可服务的接口，通常分「存活」（进程还在）与「就绪」（能接流量）两种语义。边界与例外：只回固定 <code>ok</code> 而不设阈值等于形同虚设；容器里基于 <code>os</code> 的资源判断是宿主视角，须配合 cgroup 限额；接口自身必须足够轻量，重活应移到后台定时采集再读缓存，否则检查本身会成为负担。
    </div>
  </LessonArticle>
</template>
