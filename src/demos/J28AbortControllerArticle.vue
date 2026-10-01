<script setup lang="ts">
import J28AbortController from './J28AbortController.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在搜索框里飞快敲下「abc」，结果列表最后停在的却是「ab」的结果——明明后发的请求更晚出发，为什么旧结果反而盖住了新结果？
    </div>

    <h2>提出问题</h2>
    <p>
      假设你在做一个搜索联想。用户每敲一个字，你就发一次请求去拿候选列表。于是输入「abc」的过程中，实际会连续发出三个请求。问题就出在这里：<strong>你先发出的不一定先返回</strong>。网络里的路程各不相同，很可能「ab」的那次请求慢悠悠地最后才回来，把本该显示「abc」结果的列表覆盖掉。用户看到的就是一屏对不上的旧数据。
    </p>
    <p>
      更糟的是，这些已经「过期」的请求并不会自己消失。它们继续占用着网络，占着服务器的处理能力，返回后还要触发你的回调、更新界面——一次用户根本不需要的副作用。所以真正要解决的是：<strong>如何把一个已经出发、但已经没意义的操作中途取消掉</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最容易想到的补丁是「打个标记」。每次发请求前把当前请求编号记下来，比如用一个自增的数字存进变量；等结果回来时，先比对一下这个编号是不是当前最新的，不是就干脆不渲染。这个做法也确实做对了一件事：<strong>它把「谁是最新的一次操作」这件事显式地管理起来了</strong>，防止旧结果覆盖新结果，思路是对的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>标记只挡住了「渲染」这一步，请求本身还在飞。旧请求照样占着网络带宽和服务器资源，一个都没省下。</li>
      <li>它管不住请求内部真正的开销——响应体照样会被下载和解析，等解析完才发现「这个结果不要了」。</li>
      <li>它只适用于「我能拿到返回值再判断」的场景。可网络请求并不是唯一的耗时操作，事件监听、流读取这些都拿不到一个统一的编号来比对。</li>
      <li>每处请求都要各自维护一套计数逻辑，散落在业务代码里，容易漏、容易错。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      与其在结果回来时后悔，不如给操作一个<strong>随时可以按下、并且多方都能收到通知的取消按钮</strong>。浏览器给出的现成答案就是 <code>AbortController</code>。它的结构非常简单：创建一个控制器 <code>controller</code>，从它身上取出一枚「信号」<code>controller.signal</code>；把这个 <code>signal</code> 交给那些支持取消的异步接口；到了要中止的时候，调用 <code>controller.abort()</code>。
    </p>
    <p>
      关键在于 <code>signal</code> 的角色：它是一份<strong>订阅凭证</strong>。异步接口拿到它，就等于订阅了「被取消」这件事。当你调用 <code>abort()</code> 时，<code>signal</code> 会派发一个 <code>abort</code> 事件，同时它自己的 <code>aborted</code> 属性从 <code>false</code> 变成 <code>true</code>；所有订阅了它的监听器都会被触发。<code>fetch</code>、<code>addEventListener</code> 等接口都已经原生支持 <code>signal</code>，所以这套机制可以横跨多种异步操作，不需要你为每一种都写一套取消逻辑。
    </p>
    <p>
      落到代码上分三步。第一步，创建控制器并取出 <code>signal</code>。第二步，把 <code>signal</code> 传进去：给 <code>fetch</code> 时放进配置对象，即 <code>fetch(url, { signal })</code>；给事件监听时放进 options，即 <code>addEventListener(type, fn, { signal })</code>。第三步，需要中止时调用 <code>controller.abort()</code>——此时那个 <code>fetch</code> 会以 <code>AbortError</code> 拒绝，而带 <code>signal</code> 注册的监听器会被自动移除。
    </p>
    <p>
      有个非常好用的性质：<strong>同一枚 <code>signal</code> 可以同时关联多个请求和多个事件监听</strong>，一次 <code>abort()</code> 就能把它们全部取消。比如一个弹窗同时发起了两个请求，关闭弹窗时只需要一次调用。回到搜索联想的场景，做法就变成：每次发起新请求前，先把上一次的控制器 <code>abort()</code> 掉，再用新控制器发起本次请求——旧请求在传输中途就被掐断了，根本不会返回。
    </p>
    <p>
      最后是两个必须留意的边界。其一，<strong>取消要靠类型来区分</strong>：<code>abort</code> 会让 <code>fetch</code> 以 <code>AbortError</code> 拒绝，这和真正的网络故障长得很像，但含义完全不同。你必须在 <code>catch</code> 里先判断错误的名字是不是 <code>AbortError</code>，是的话就当「用户主动放弃」静默处理，绝不能再弹一个「请求失败」的错误提示去吓用户。其二，<strong>控制器是一次性的</strong>：调用过 <code>abort()</code> 之后，这枚 <code>signal</code> 就永久处于终止态，无法复用。下次要发新请求，必须重新 <code>new AbortController()</code>，这也正是「每次请求都配一个新控制器」这种写法的由来。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点击发送后立刻点「取消」，观察 <code>AbortError</code> 是怎样被单独识别、并与真实网络错误区分开的。</figcaption>
      <J28AbortController />
    </figure>

    <h2>总结</h2>
    <p>
      <code>AbortController</code> 解决的不是「结果对不对」，而是「这件事还该不该继续做」。它用一枚 <code>signal</code> 把「取消」变成一个可以订阅、可以广播的信号，让请求和监听都能在真正变得没意义的那一刻被立刻停下——省下的不只是正确性，还有实实在在的资源。
    </p>
    <div class="lesson-term">
      <span class="term-name">「AbortController」</span>是浏览器提供的取消机制，它持有 <code>signal</code>（一枚订阅凭证），支持取消的异步接口通过 <code>signal</code> 订阅中止信号。调用 <code>controller.abort()</code> 会派发 <code>signal</code> 的 <code>abort</code> 事件并使 <code>signal.aborted</code> 变为 <code>true</code>；<code>fetch</code>、<code>addEventListener</code> 等均原生支持 <code>signal</code>，传入后即可被取消——<code>fetch</code> 会以 <code>AbortError</code> 拒绝，带 <code>signal</code> 的监听会被移除。注意：同一枚 <code>signal</code> 可关联多个请求与监听，一次 <code>abort()</code> 全部取消；<code>AbortError</code> 需与真实网络失败区分处理；<code>abort()</code> 后该 <code>signal</code> 永久终止，新请求须重新创建控制器。
    </div>
  </LessonArticle>
</template>
