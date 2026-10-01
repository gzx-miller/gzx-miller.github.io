<script setup lang="ts">
import J07PromiseCombinators from './J07PromiseCombinators.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>看板要同时展示「课程、通知、进度」三块数据，你把三个请求依次 <code>await</code>，页面硬生生等了三次网络往返——它们明明互不依赖，为什么不能一起等？
    </div>

    <h2>三接口加载场景</h2>
    <p>
      你在做一个学习看板：顶部课程列表、右侧通知、底部学习进度，三份数据来自三个不同的接口，每个接口平均要 200 到 400 毫秒。如果按书写顺序一个接一个地请求，用户要盯着空白页等将近一秒。可这三份数据谁也不依赖谁，先拿通知并不会影响课程列表。
    </p>
    <p>
      <strong>「互不依赖的异步任务，本该同时进行」</strong>，这是并发要解决的核心。真正的难点不在「怎么发起」，而在「怎么把多个各自独立、各自可能成功或失败的未来结果，收敛成一个你能继续处理的值」。写这种聚合并发结果的代码，才是容易出错的地方。
    </p>

    <h2>顺序等待写法</h2>
    <p>
      最省事的做法：一个接一个地 <code>await</code>。第一句拿到课程，再发通知，再发进度，代码从上往下读，数据一步步到手，逻辑清晰，调试也直观。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它把「等待」变成了顺序可读的代码</strong>，你完全清楚哪一步在前、哪一步在后，不存在竞态。当任务之间真的存在依赖时，这就是唯一正确的写法。
    </p>

    <h2>串行耗时叠加</h2>
    <ul>
      <li>总耗时是三次请求之和（约 900 毫秒），而不是最慢那一次（约 400 毫秒），多出来的时间纯属白等。</li>
      <li>第二个请求抛错时，第三个请求根本没机会发出，明明它可以独立成功。</li>
      <li>任务越多，串行的代价线性叠加；接口一慢，整页就被拖垮。</li>
      <li>为了把「等待」写整齐，代码被拆成一长串赋值语句，中间态变量越堆越多。</li>
    </ul>

    <h2>失败容忍选型</h2>
    <p>
      保留「一步拿到结果」的写法，把「逐个等待」换成「一起发起、一起等」。为此要先认识 <code>Promise</code>：它表示一个<strong>未来会落定</strong>的结果，落定只有两种状态——成功（fulfilled）拿到值，或失败（rejected）拿到原因。并发要做的，就是同时启动多个 Promise，再在某个时刻统一汇总它们的落定结果。
    </p>
    <p>
      最常用的汇聚者是 <code>Promise.all</code>：传入一个 Promise 数组，它返回一个新的 Promise，等<strong>全部成功</strong>后用一个数组一次性给出结果。有两个细节必须记住：结果的顺序<strong>与传入顺序一一对应</strong>，而不是按谁先完成排序；只要有一个失败，整体立即拒绝。
    </p>
    <div class="lesson-box warn">
      <strong>坑：</strong><code>Promise.all</code> 在首个 reject 时立即整体拒绝，但其余任务<strong>并不会被取消，仍会继续执行</strong>。失败只是让你提前拿到错误，已经发出的请求收不回来。
    </div>
    <p>
      但现实里并不是所有失败都该让整块看板崩掉——通知接口挂了，课程列表没理由跟着消失。这时换成 <code>Promise.allSettled</code>：它一定等到<strong>全部结束</strong>才返回，每个元素都会告诉你这一路是成功还是失败，成功带 <code>value</code>、失败带 <code>reason</code>，绝不因为一个失败就整体拒绝。想让尽可能多的数据先显示出来，就用它。
    </p>
    <p>
      另外两个组合器语义更窄，但各有用处。<code>Promise.any</code> 只关心「谁最先成功」，返回第一个成功的结果；只有<strong>全部失败</strong>时，才以一个 <code>AggregateError</code>（把所有失败原因打包在一起的错误）拒绝。<code>Promise.race</code> 取<strong>最先落定</strong>的那一个，成功失败都算——它最典型的用法是「超时竞争」：把一个真实请求和一个定时器 Promise 一起放进 <code>race</code>，谁先落定谁决定结果。
    </p>
    <p>
      把四者的策略列成一张表，选择就成了一件看业务的事。
    </p>
    <table>
      <thead>
        <tr><th>组合器</th><th>什么时候返回</th><th>失败时</th></tr>
      </thead>
      <tbody>
        <tr><td><code>Promise.all</code></td><td>全部成功</td><td>首个失败立即整体拒绝</td></tr>
        <tr><td><code>Promise.allSettled</code></td><td>全部结束</td><td>不拒绝，逐项报告成败</td></tr>
        <tr><td><code>Promise.any</code></td><td>第一个成功</td><td>全部失败才拒绝（AggregateError）</td></tr>
        <tr><td><code>Promise.race</code></td><td>第一个落定</td><td>首个失败即拒绝</td></tr>
      </tbody>
    </table>
    <p>
      最后一个容易被忽略的现实约束：<strong>并发不等于无限并发</strong>。把几百个请求一次性丢进 <code>Promise.all</code>，浏览器会排满连接、服务端也可能被压垮，反而更慢甚至触发限流。真要做大规模并发，得自己控制并发数量，或分批发起。
    </p>

    <h2>三任务同时发起</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮，看三个互不依赖的任务如何同时发起、一起返回。</figcaption>
      <J07PromiseCombinators />
    </figure>

    <h2>并发组合器机制</h2>
    <p>
      并发组合器解决的，是「多个独立未来如何收敛成一个结果」。互不依赖就同时发起，再把「对失败的容忍度」翻译成选择：全部必须成功用 <code>all</code>，尽量都拿到用 <code>allSettled</code>，只求最先成功用 <code>any</code>，谁先落定算谁用 <code>race</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Promise 组合器」</span>指把多个 Promise 聚合成一个 Promise 的方法：<code>all</code> 全部成功才成功、首个失败即拒绝；<code>allSettled</code> 等全部结束并保留每项成败；<code>any</code> 取最先成功者、全败才以 <code>AggregateError</code> 拒绝；<code>race</code> 取最先落定者，常用于超时竞争。注意并发不等于无限并发，仍需考虑限流与承载。
    </div>
  </LessonArticle>
</template>
