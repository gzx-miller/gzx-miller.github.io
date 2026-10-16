<script setup lang="ts">
import PY20Asyncio from './PY20Asyncio.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用 <code>time.sleep(1)</code> 写了 3 次等待，程序老老实实花了 3 秒。把 <code>sleep</code> 换成 <code>await asyncio.sleep(1)</code> 后，总耗时竟然只剩 1 秒——同样的「睡 3 次」，为什么 <code>await</code> 能让它们重叠起来？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      阻塞式写法最好理解：调用一个会耗时的函数，就一直等到它返回，才执行下一行。
    </p>
    <pre class="code-block"><code>import time

def fetch(name):
    time.sleep(1)          # 整个线程被卡在这里
    return name

for n in ["A", "B", "C"]:
    fetch(n)               # 三次相加，约 3 秒</code></pre>
    <p>
      它的问题和上一章一样——大量时间花在<strong>等待</strong>上，而线程被 <code>sleep</code> 死死占住，什么也做不了。这时有人会想到开线程，但如果请求多达成百上千个，线程的创建与切换成本就不可忽视。于是 Python 提供了另一条路：让<strong>单个线程</strong>在等待时去干别的活。
    </p>

    <h2>协程：可以暂停和恢复的函数</h2>
    <p>
      <strong>协程</strong>（coroutine）是一种特殊的函数，用 <code>async def</code> 定义。它和普通函数最大的区别是：可以被<strong>暂停</strong>，把控制权交出去，之后再从暂停处<strong>恢复</strong>。触发暂停的关键字是 <code>await</code>——它后面通常跟一个「可等待对象」，表示「我在这里等，先让别人跑」。
    </p>
    <pre class="code-block"><code>async def fetch(name, delay):
    await asyncio.sleep(delay)   # 挂起本协程，事件循环可去调度别的协程
    return name</code></pre>
    <p>
      请注意：<code>await</code> 暂停的是<strong>这个协程</strong>，而不是整个线程。线程本身仍由事件循环使用着，随即将它交给另一个准备好的协程——这正是开场问题里「3 次 sleep 只花 1 秒」的原因：三个协程几乎同时开始等待，谁先醒谁先被唤醒。
    </p>

    <h2>事件循环与 asyncio.run</h2>
    <p>
      谁在负责「暂停了就去跑别人、到点了再唤醒」？答案是<strong>事件循环</strong>（event loop）。它维护着一堆就绪/等待的任务，持续检查哪些 I/O 或定时器已经完成，再把控制权交还给对应的协程。入口很简单：
    </p>
    <pre class="code-block"><code>import asyncio

async def main():
    ...

asyncio.run(main())      # 创建事件循环、运行到底、最后关闭</code></pre>
    <p>
      <code>asyncio.run()</code> 负责起一个事件循环并把入口协程跑完，是脚本级异步程序的<strong>唯一入口</strong>。它的位置通常在顶层，而不是嵌在别的协程里。
    </p>

    <h2>并发多个任务：gather 与 create_task</h2>
    <p>
      有了协程，怎么让它们「一起开始」？两种常用手段：
    </p>
    <ul>
      <li><code>asyncio.gather(*coros)</code>：把多个协程<strong>同时</strong>交给事件循环并发执行，等全部完成后按<strong>传入顺序</strong>返回结果列表。写起来最像「一次性并发」。</li>
      <li><code>asyncio.create_task(coro)</code>：把协程包装成一个<strong>任务</strong>并立刻排入事件循环，不等它也能继续往下写；之后可再 <code>await task</code> 取结果。适合「先启动、后处理」的场景。</li>
    </ul>
    <p>
      一个常见误区：只调用 <code>fetch()</code> 而不 <code>await</code> 也不 <code>create_task</code>，只是<strong>创建了协程对象，并不会执行</strong>它，还会收到「coroutine was never awaited」的警告。要跑起来，必须交给事件循环。
    </p>

    <h2>为什么并发 I/O 更快，以及一个致命陷阱</h2>
    <p>
      异步的优势来自<strong>等待期间不浪费线程</strong>：一个线程就能管理成百上千个并发的网络请求，开销远小于等量线程。前提是这些任务确实是 I/O 等待（网络、磁盘），因为你等的正是「可等待」的外部事件。
    </p>
    <div class="lesson-box warn">
      <strong>别在协程里调用同步阻塞函数：</strong>如果协程里调用了 <code>time.sleep()</code>、同步的 <code>requests.get()</code> 或 <code>open()</code>，<strong>整个事件循环会被卡住</strong>——所有协程都停摆，异步等于白写。要用异步库（<code>aiohttp</code>、<code>aiofiles</code>）或把阻塞操作交给线程池执行。这是异步代码最容易踩的坑。
    </div>

    <h2>超时与取消：wait_for</h2>
    <p>
      异步任务等的是外部响应，就可能迟迟不回。若任由它挂着，程序会一直卡住。<code>asyncio.wait_for(coro, timeout)</code> 给等待设上限：超过时限还没完成，就<strong>取消该协程</strong>并抛出 <code>asyncio.TimeoutError</code>，由你决定重试还是报错。给所有外部调用都加上超时，是异步程序的必备防御。
    </p>

    <h2>看一遍事件循环调度</h2>
    <figure class="lesson-figure">
      <figcaption>点「逐个 await」看串行等待如何累加总耗时；点「asyncio.gather」看多个协程如何交错开始、按各自耗时先后唤醒；点「wait_for 超时」看超过上限的协程如何被取消。</figcaption>
      <PY20Asyncio />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      用 <code>async def</code> 定义协程、<code>await</code> 在等待点交出控制权，由<strong>事件循环</strong>在单个线程里调度成百上千个并发 I/O；<code>asyncio.run</code> 启动循环，<code>gather</code> 一次性并发、<code>create_task</code> 先启动后等待，<code>wait_for</code> 为等待设上限。切记不要在协程里调用同步阻塞函数，否则事件循环会被一起卡死。
    </p>
    <div class="lesson-term">
      <span class="term-name">「事件循环」</span>是 asyncio 的核心调度器，负责在单线程内维护就绪与等待中的协程，在 I/O 就绪或定时到期时唤醒对应的协程继续执行。边界与例外：事件循环本身跑在一个线程里，任何同步阻塞调用都会让它停摆；协程必须被 await 或包装成 task 才会真正执行；并发只对 I/O 等待有效，对纯计算没有帮助。
    </div>
  </LessonArticle>
</template>
