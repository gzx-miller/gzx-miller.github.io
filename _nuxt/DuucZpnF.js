const e=`<script setup lang="ts">
import S09XStateMachine from './S09XStateMachine.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>结算页你写了三个布尔值：<code>isSubmitting</code>、<code>isSuccess</code>、<code>isFailure</code>。上线后客服反馈：有人点完提交，按钮消失了，页面卡在那里。你一看日志——<code>isSubmitting</code> 是 <code>true</code> 的同时 <code>isSuccess</code> 也成了 <code>true</code>。按钮的渲染条件是 <code>!isSubmitting &amp;&amp; !isSuccess</code>，两边都不满足，界面就空了。三个布尔一共 8 种组合，你实际只写了其中 4 种。
    </div>

    <h2>布尔组合冲突</h2>
    <p>
      结算流程的本质是一串<strong>互斥的阶段</strong>：编辑中 → 提交中 → 成功或失败，同一时刻本该只处在其中一个。可当你用几个各自独立的布尔值去表达它时，语言并不会阻止它们同时为真。
    </p>
    <p>
      旧办法各有各的成本。<strong>用 n 个布尔值</strong>：名义上能表示 2 的 n 次方种组合，其中绝大多数是非法组合（提交中又成功），而类型系统拦不住任何一个。<strong>每加一个阶段就重新审一遍所有判断条件</strong>：漏掉一处，就冒出「按钮全消失」这类只有运行时才暴露的 bug。<strong>把「什么事件能从什么状态触发」散落在各个 <code>onClick</code> 里</strong>：产品问一句「成功之后还能不能重试」，没人能马上答上来，因为答案根本没被写在一个地方。
    </p>
    <p>
      所以要回答的是：<strong>能不能把「有哪几个状态」「每个状态接受哪些事件」显式写下来，让非法组合和非法转换从根上就构造不出来？</strong>
    </p>

    <h2>显式状态转移表</h2>
    <p>
      最朴素的做法：用 XState 的 <code>createMachine</code> 把状态和转移写成一张显式的表。<code>createMachine({ id: 'checkout', initial: 'editing', states: { editing: { on: { SUBMIT: 'submitting' } }, submitting: { on: { RESOLVE: 'success', REJECT: 'failure' } }, failure: { on: { RETRY: 'submitting', EDIT: 'editing' } }, success: { type: 'final' } } })</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>状态从「一堆各自为真的布尔」变成了「一个值」</strong>。快照里的 <code>snapshot.value</code> 要么是 <code>editing</code>，要么是 <code>submitting</code>，不可能同时是两个——「提交中又成功」这种组合在数据结构层面就不存在。组件用 <code>useMachine</code> 拿到 <code>[snapshot, send]</code>，按值渲染按钮、用 <code>send</code> 发事件。
    </p>

    <h2>非法转换拦截</h2>
    <ul>
      <li>只把状态换成字符串还不够：如果转换关系仍靠组件里的 <code>if</code> 判断拼出来，非法转换照样会发生——你完全可以在 <code>editing</code> 时 <code>send</code> 一个 <code>RESOLVE</code>，只要你自己没拦住。</li>
      <li>把 <code>success</code> 设成了 <code>type: 'final'</code>：它是终态，从此不再接受任何事件。如果你其实需要「成功之后再回到编辑」，这个设定就是错的。</li>
      <li>把副作用（提交请求）写在组件的 <code>onClick</code> 里、跟着点击走：状态机和真实请求就脱了钩，反复点击可能发出多次请求，而状态却只认第一次。</li>
      <li>想用「一个状态机包打天下」：状态一多，转移表会连成一张谁都读不完的大网，反而比布尔值更难维护。</li>
    </ul>

    <h2>副作用统一接管</h2>
    <p>
      不推翻「显式状态 + 显式事件」，而是把它从一个静态的表，逐层升级成一套能真正拦住非法流程、并接管副作用的模型。
    </p>
    <ol class="lesson-steps">
      <li>先补「转换必须落到事件上」。状态机不认「你想干嘛」，只认「你发了什么事件 + 当前是什么状态」。在 <code>editing</code> 下 <code>send({ type: 'RESOLVE' })</code>，因为 <code>editing</code> 的 <code>on</code> 里没有 <code>RESOLVE</code> 这条边，这个事件会被直接忽略，状态纹丝不动。<strong>非法转换是在建模阶段就被排除的，而不是靠运行时 if 去拦。</strong></li>
      <li>再补「组件的职责被压缩」。组件不再自己判断「现在能不能提交」，它只做两件事：按 <code>snapshot.value</code> 渲染对应的按钮、按事件调 <code>send</code>。「提交中能不能再提交」这类问题的答案写在状态图里，不在组件里。</li>
      <li>再补「副作用的归属」。真正的副作用（提交请求、失败重试）应当用 <code>invoke</code> / actor 建模，让「进入 <code>submitting</code> 就发起请求、请求成功发 <code>RESOLVE</code>、失败发 <code>REJECT</code>」成为状态机自身的一部分；组件只订阅快照。<strong>这样就不会因为组件重渲染而重复发请求。</strong></li>
      <li>再补「守卫与并行」。转移上可以挂守卫（guard），表达「只有满足条件才允许走这条边」；XState 还支持并行状态，让几个区域同时各自运转。这些都建立在「显式状态 + 显式事件」这块地基上。</li>
      <li>再补「测试的落点」。既然状态图已经把每条转移写清楚了，测试就可以直接从图上出发——<strong>为每条转移写一个用例，覆盖面一目了然</strong>；测试、产品与实现对着同一张图讨论，也就少了「非法组合」这类口角。</li>
      <li>最后划清「什么时候别用」。只有一两个布尔、状态很少的地方，<code>useState</code> 就够了——状态机的价值在于「多个互斥阶段 + 需要拦住非法转换」的场景，硬套只会增加阅读成本。</li>
    </ol>
    <p>
      回到开场那幕：三个布尔那 8 种组合，现在被压成了 4 个互斥状态；「提交中又成功」这种组合从数据结构上就无法构造，按钮再也不会两边都不满足。而「成功之后还能不能重试」，答案就写在 <code>success</code> 是 <code>final</code>、没有 <code>on</code> 这一点上——一句话说得清。
    </p>
    <div class="lesson-box warn">
      <strong>两条要记住的边界：</strong>状态机不是越多越好，<strong>简单的一两个布尔用 <code>useState</code> 即可</strong>，别为它引入整套模型；另外 <code>final</code> 是<strong>终态、不再接受任何事件</strong>，若成功之后仍需回到某个状态，就不要把它标成 <code>final</code>。
    </div>

    <h2>四个状态流转对照</h2>
    <figure class="lesson-figure">
      <figcaption>按流程依次点「提交」，再选「成功」或「失败」，看顶部状态在 <code>editing</code>、<code>submitting</code>、<code>success</code>、<code>failure</code> 之间跳动；失败后还能「重试」或「修改」。留意每一步只会出现当前状态允许的按钮——非法转换压根没有入口。</figcaption>
      <S09XStateMachine />
    </figure>

    <h2>结构层面约束</h2>
    <p>
      有限状态机把「互斥的状态」和「每个状态接受哪些事件」显式写下来，让非法组合在数据结构层面无法构造、非法转换在建模阶段就被排除。组件的职责随之压缩成「按当前状态渲染、按事件发消息」，副作用则挂到状态上。它适合结算、审批这类多步骤的关键流程，而不是所有状态。
    </p>
    <div class="lesson-term">
      <span class="term-name">「有限状态机（finite state machine, FSM）」</span>是一种把系统建模为「有限个互斥状态 + 一组在状态间触发转移的事件」的模型：任一时刻系统只处于一个状态，某个事件是否被接受，由当前状态决定。边界：<strong>状态有限且互斥</strong>是它能拦下非法组合的前提，因此像「加载到 37%」这类连续量不适合直接当作状态；副作用应通过 <code>invoke</code> / actor 挂到状态上，而不是散在组件里；终态（<code>final</code>）不再响应任何事件。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
