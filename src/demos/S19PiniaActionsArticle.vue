<script setup lang="ts">
import S19PiniaActions from './S19PiniaActions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>下单要请求接口、要点亮 loading、要处理失败、还要防止旧请求覆盖新订单——这些逻辑全塞在组件里，一个按钮点下去要牵扯十几行代码，真的没有更集中的写法吗？
    </div>

    <h2>订单流程散乱</h2>
    <p>
      你在做「秋日咖啡馆」的订单系统：用户点「提交订单」后要调接口下单，下单过程中按钮要显示「提交中」，成功后要切到订单列表，失败要弹提示；订单还要从「待处理」一路流转到「制作中」「配送中」「已完成」。此刻这些逻辑都写在组件的 <code>submitOrder</code> 里。
    </p>
    <p>
      麻烦很快显形：另一处「再来一单」按钮也要下单，于是同样的请求、loading、错误处理又被复制了一份；订单状态流转的规则也散在组件里，<strong>「什么状态能改成什么状态」这条业务规则，居然需要读组件模板才能还原</strong>。你开始怀疑：改状态这件事，是不是不该由组件来做？
    </p>

    <h2>组件直改状态</h2>
    <p>
      最直接的做法：组件里拿到 store 之后，直接改它的 <code>state</code>，请求逻辑也一并写在组件的方法里。
    </p>
    <p>
      它做对了一件事：<strong>组件本来就是表达用户意图的地方，点「提交订单」就该在这里被触发</strong>。但这只解决了「触发」，没有解决「谁负责改状态」。让组件直接写 store 的字段，等于把状态修改的入口开得到处都是，任何组件都能偷偷改一把，状态从哪来、为什么变，就再也说不清了。
    </p>

    <h2>修改入口分散</h2>
    <ul>
      <li>状态修改逻辑分散在各个组件，同一份业务被重复实现。</li>
      <li>loading、错误提示这类状态要在每个调用点各自维护。</li>
      <li>业务流程无法复用，也无法被单独测试。</li>
      <li>多个请求并发时容易竞态，旧请求返回后覆盖了新状态。</li>
      <li>没有统一入口，日志、埋点、监控无从挂接。</li>
    </ul>

    <h2>入口收拢一处</h2>
    <p>
      不推翻「组件表达意图」，而是<strong>把状态修改的入口收到一处</strong>。Pinia 里这个入口叫 action：它就是一个定义在 store 里的普通函数，<strong>通过赋值直接修改 state</strong>。注意，相比 Vuex 这里已经没有了 mutations 那一层——同步和异步的状态修改，统一都写在 action 里。
    </p>
    <p>
      带着这个前提重新组织下单流程：异步 action 用 <code>async</code> 与 <code>await</code> 完成请求，在内部维护 loading 并用 <code>finally</code> 保证它一定被关掉，同时把订单对象返回出去，让调用方可以 <code>await</code> 到结果。组件侧于是简化成一句话——调用 action，拿到返回后切页，剩下的都不再关心。
    </p>
    <ol class="lesson-steps">
      <li>在 store 中定义普通函数作为 action，通过赋值直接修改 state。</li>
      <li>异步 action 用 <code>async</code> 与 <code>await</code>，用 <code>finally</code> 统一关闭 loading。</li>
      <li>让 action 返回 Promise，调用方 <code>await</code> 之后再执行后续跳转。</li>
      <li>把下单、备餐、配送、完成拆成多个小 action，再互相调用组合成完整流程。</li>
      <li>组件只负责表达意图（提交订单），实际的数据操作与状态更新交给 action。</li>
    </ol>
    <p>
      这么做还有一个额外收获：action 的调用是可以被观察的。通过 <code>$onAction</code>，你能在 action 执行前、成功后与出错时挂上钩子——<code>before</code> 看参数，<code>after</code> 拿返回值（含异步结果），<code>onError</code> 收异常。日志、埋点和错误监控因此有了统一的挂载点，不必再散落在每个调用点。
    </p>
    <div class="lesson-box warn">
      <strong>异步 action 的两条底线：</strong>第一，做好 loading 与竞态处理，<strong>避免旧请求返回后覆盖新状态</strong>（可为请求打标记，只采纳最新一次的结果）；第二，复杂流程拆成小 action 组合复用，<strong>不要让单个 action 臃肿到既请求、又校验、又跳转</strong>，否则它会变成新的「上帝函数」，既难测也难读。
    </div>

    <div class="lesson-box hint">
      <strong>怎么判断逻辑该不该进 action：</strong>问一句「这段逻辑离开组件还成立吗」。下单、校验库存、流转状态这些与界面无关的规则，离开组件依然成立，属于 store；而「弹哪个提示、跳哪个路由」是界面的选择，留在组件。按这条线切，业务规则可复用也可测，界面只管表达。
    </div>

    <h2>整条流程驱动</h2>
    <figure class="lesson-figure">
      <figcaption>点几份餐提交订单，再逐步推进状态，观察 action 如何驱动整条订单流程。</figcaption>
      <S19PiniaActions />
    </figure>

    <h2>唯一修改入口</h2>
    <p>
      Pinia 的 Action 是修改状态的唯一入口：不再有 mutations，同步与异步的改动都写进 action。它让「组件表达意图、store 负责改数据」这条分工落到实处，也让 loading、错误处理、流程组合与调用拦截都有了统一的落脚点。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Actions」</span>是 Pinia 中修改状态的入口，本质是 store 里的普通函数，<strong>相比 Vuex 已移除 mutations，同步与异步改动都写在 action 里</strong>。异步 action 用 <code>async</code> 与 <code>await</code>，用 <code>finally</code> 关闭 loading，并返回 Promise 供调用方 <code>await</code>；action 之间可互相调用组合成流程，也可用 <code>$onAction</code> 的 <code>before</code>、<code>after</code>、<code>onError</code> 统一做日志与错误上报。
    </div>
  </LessonArticle>
</template>
