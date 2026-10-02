const n=`<script setup lang="ts">
import K11Composable from './K11Composable.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>「发送验证码」的倒计时逻辑，登录页要用、报名页也要用，但两处界面长得不一样——难道只能把这段逻辑复制一份？
    </div>

    <h2>验证码倒计时逻辑</h2>
    <p>
      你在做一个多页面的产品：登录、报名、找回密码，处处都有「点击发送验证码，然后 60 秒内不能重发」的功能。共同点很清楚——一个剩余秒数、一个「是否结束」的判断、一个启动方法、一个重置方法；不同点也很清楚——每个页面把它渲染成的样子不一样。
    </p>
    <p>
      真正要复用的是<strong>那段有状态的逻辑</strong>，而不是那一块界面。可状态一旦散落在组件里，就只能连着 UI 一起复制，问题随之而来。
    </p>

    <h2>就地重复实现</h2>
    <p>
      最省事的做法：哪个页面要用，就把这段倒计时逻辑在组件里重新写一遍——定义秒数、开 <code>setInterval</code>、判断归零、清理定时器。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>逻辑就放在它被使用的地方</strong>，不用抽象，改起来一眼能定位。
    </p>

    <h2>跨组件逻辑漂移</h2>
    <ul>
      <li>同一段逻辑在多个组件里各存一份，修一个 bug 得改很多处，久而久之就漂移了。</li>
      <li>定时器清理这类细节靠人肉复制，漏一处就是一次泄漏。</li>
      <li>逻辑和 UI 混在同一个组件里，想单独验证倒计时行为几乎无从下手。</li>
      <li>组件体积越滚越大，最后又变回「什么都往里塞」的大杂烩。</li>
    </ul>

    <h2>组合式函数封装</h2>
    <p>
      不推翻「就地写逻辑」，而是把它<strong>抽成一个普通函数</strong>：把响应式状态、派生值、方法和生命周期钩子一起封装进去，在外面看只暴露一组可以直接使用的状态与行为。这样的函数就是<strong>组合式函数</strong>（composable）。
    </p>
    <ol class="lesson-steps">
      <li>组件调用 <code>useCountdown</code>，并传入初始秒数。</li>
      <li>函数内部管理 <code>seconds</code>、<code>isFinished</code> 以及 <code>start</code>、<code>reset</code> 等方法。</li>
      <li>组件只负责渲染倒计时、触发按钮动作，不再关心计时细节。</li>
      <li>把它接到第二个组件上，验证逻辑无需复制就能复用。</li>
    </ol>
    <p>
      它能成立的关键在于：组合式函数借助<strong>组合式 API 的运行时上下文</strong>，内部创建的 <code>ref</code> 与副作用会自动挂载到调用它的那个组件实例上。所以同一份函数被两个组件调用，得到的是两份互不干扰的独立状态——这正是它替代旧 mixin 的地方：<strong>复用逻辑，而不复用 UI，也不制造隐式的命名冲突</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>两条纪律：</strong>其一，函数内的 <code>ref</code> 与生命周期钩子依赖调用上下文，<strong>必须在 setup 的同步阶段调用</strong>，不能塞进异步回调或事件里延后执行；其二，返回值要少而明确，把状态和方法收窄成清晰的接口，别让调用方又拿到一袋什么都有的东西。
    </div>
    <p>
      命名上也藏着一层约定：以 <code>use</code> 开头，等于告诉读代码的人「这里可能用到响应式和生命周期能力」。逻辑一旦被抽出来成为独立单元，就应当<strong>优先为它补上单元测试</strong>——这正是复用带来的额外红利。
    </p>

    <h2>同一逻辑重复调用</h2>
    <figure class="lesson-figure">
      <figcaption>点「发送验证码」再点「重置」，观察同一套逻辑如何被界面反复调用。</figcaption>
      <K11Composable />
    </figure>

    <h2>状态逻辑抽取复用</h2>
    <p>
      组合式函数把「一段有状态的逻辑」打包成一个普通函数：状态、派生值、方法和生命周期钩子都在里面，组件调用它就能拿到一组可直接使用的行为。它复用的是逻辑而非 UI，是 mixin 的现代替代方案。
    </p>
    <div class="lesson-term">
      <span class="term-name">「组合式函数」</span>是以 <code>use</code> 开头、把响应式状态、派生值、方法与生命周期钩子封装起来的普通函数。借助组合式 API 的运行时上下文，函数内的 <code>ref</code> 与副作用能挂载到调用它的组件实例上，因此多个组件调用同一函数会得到各自独立的状态。它须在 setup 同步阶段调用，用于复用逻辑而非 UI。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
