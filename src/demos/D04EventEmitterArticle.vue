<script setup lang="ts">
import D04EventEmitter from './D04EventEmitter.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>订单支付成功后要通知库存、发邮件、加积分；某天运营说「再加一个发货提醒」，你不得不回去改那段早已上线的支付代码——明明只是多了一个「关心它的人」，凭什么要动支付本身？
    </div>

    <h2>提出问题</h2>
    <p>
      一个状态变了，好几个模块都想做出反应。最直接的写法是在变更发生的那一行，把后续动作逐个调过去：支付成功就调 <code>减库存()</code>、<code>发邮件()</code>、<code>加积分()</code>。
    </p>
    <p>
      这种写法把几笔成本都压在支付方身上：<strong>它必须知道所有关心者的存在</strong>，每多一个关心者就要改它一次；<strong>关心的先后顺序被写死在代码里</strong>，想调整得动同一段逻辑；<strong>某个关心者失败会牵连后面的人</strong>，可它俩本无关系；而且交易模块因此被迫背上「通知失败怎么办」的决策，尽管这根本不是它的职责。
    </p>
    <p>
      所以真正的问题是：怎样让「发生了一件事」和「谁来处理这件事」<strong>互相不认识，消息却还能送过去</strong>？
    </p>

    <h2>最小方案</h2>
    <p>
      Node 内置的 <code>node:events</code> 给出了 <code>EventEmitter</code>。变更方只负责广播一句话：<code>emit('order:paid', order)</code>；关心方各自订阅：<code>bus.on('order:paid', handler)</code>。写入 <code>order</code> 载荷，谁需要谁去取。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「发布者」与「订阅者」彻底对调了依赖方向</strong>。支付方只认事件名和载荷结构，不需要知道有几个订阅者、他们叫什么；订阅者彼此独立，加一个、删一个都不必碰发布方。也就是 <code>emit</code> 的那一行，从此可以长期不动。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>emit</code> 是<strong>同步</strong>的：所有监听器会在 <code>emit</code> 那一行里依次跑完，<code>emit</code> 返回时它们已经执行过了。某个监听器慢，支付流程就跟着慢。</li>
      <li>监听器里抛出的异常会<strong>顺着 <code>emit</code> 的调用栈往上抛</strong>：一个「发邮件」的监听器报错，可能把整段支付流程一起带崩。</li>
      <li>监听器<strong>不会自己消失</strong>：<code>on</code> 注册后就一直挂着。如果每次重建对象都 <code>on</code> 一次却从不移除，监听器会越积越多——这就是监听器泄漏。</li>
      <li>事件名 <code>'error'</code> 有<strong>特殊待遇</strong>：若 <code>emit('error')</code> 时没有任何监听器，Node 不会静默忽略，而是直接抛出异常，严重时终止整个进程。</li>
      <li>它是<strong>单进程</strong>的：<code>emit</code> 只在当前进程内广播，多实例部署时，另一个进程里的订阅者什么也收不到。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先立<strong>契约</strong>。解耦的前提是双方对「消息长什么样」有共同认识：事件名要稳定（比如 <code>order:paid</code>），载荷结构要固定（比如都传一个 <code>order</code>）。没有契约，订阅方就还是在猜，解耦只解了一半。
    </p>
    <p>
      接着区分<strong>注册方式</strong>。<code>on</code> 注册的是长期监听，触发多少次就执行多少次；<code>once</code> 注册的是<strong>一次性监听</strong>，触发一次后自动移除——非常适合「初始化只该做一次」的场景，顺带省掉一次手动清理。
    </p>
    <p>
      然后是必须补的<strong>生命周期</strong>。既然 <code>on</code> 不会自动消失，不再需要时就要用 <code>off</code>（或 <code>removeListener</code>）主动移除，再用 <code>listenerCount(name)</code> 确认真的没有残留。这一步是防泄漏的关键动作，尤其对长期存活的 emitter。
    </p>
    <p>
      接着补<strong>异常边界</strong>。因为监听器异常会沿 <code>emit</code> 的调用栈抛出去，就得决定「一个订阅者的失败能不能拖垮其它订阅者」：要么在监听器内部用 <code>try ... catch</code> 把错误收住，要么让发布方对 <code>emit</code> 做保护。核心原则是——<strong>别让一个关心者的错误变成所有人的错误</strong>。
    </p>
    <p>
      再单独处理 <code>'error'</code> 事件。它对没有监听器的情况零容忍，所以关键组件要么显式注册一个 <code>error</code> 监听器，要么别随手 <code>emit('error')</code>。想调大监听器数量上限可以用 <code>setMaxListeners</code>，但那只是抬高告警阈值，<strong>该做的仍是先查清为什么会有这么多订阅</strong>。
    </p>
    <p>
      最后认清它的<strong>能力边界</strong>。EventEmitter 是同进程内的同步派发：喊一声、本进程里关心的人当场响应。跨进程、跨服务的「可靠送达、失败重试、消息可重放」，它做不到——那类需求要靠消息队列之类的对外基础设施，别用它假装能扛。
    </p>
    <div class="lesson-box warn">
      <strong>三个最容易踩的点：</strong><code>emit</code> 是同步派发，监听器会在其中同步执行；监听器抛出的异常会沿 <code>emit</code> 栈向上抛，必要时包 <code>try ... catch</code>；<code>'error'</code> 事件没有监听器时会被抛出、乃至终止进程。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点「发布订单已支付事件」，看一条业务事件如何一次广播、同时把库存与邮件两个订阅者叫起来。</figcaption>
      <D04EventEmitter />
    </figure>

    <h2>总结</h2>
    <p>
      EventEmitter 把「状态变更」与「响应逻辑」拆开：发布方只广播事件名和载荷，订阅方各自 <code>on</code> / <code>once</code>。要真正用好它，还得记牢两件事——<strong>派发是同步的、异常会沿 <code>emit</code> 抛出</strong>，以及<strong>监听器要主动移除</strong>，否则会悄悄泄漏。
    </p>
    <div class="lesson-term">
      <span class="term-name">「监听器泄漏（listener leak）」</span>指在长期存活的 emitter 上不断用 <code>on</code> 注册监听器却不移除，导致监听器数量与内存持续增长，且每次 <code>emit</code> 都要遍历越来越多的回调。边界与例外：用 <code>once</code> 注册的监听器触发一次会自动移除，不会因此泄漏；<code>setMaxListeners</code> 只是调整数量告警阈值，并不能解决问题；该模式只作用于单个进程，跨进程不在其中。
    </div>
  </LessonArticle>
</template>
