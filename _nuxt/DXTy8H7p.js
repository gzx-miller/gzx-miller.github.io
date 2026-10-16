const e=`<script setup lang="ts">
import K26EffectScope from './K26EffectScope.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>工作台里切换了工作区，旧工作区的监听日志还在往外冒，后台定时器还在每秒加数——明明已经「退出」了，它为什么还在工作？
    </div>

    <h2>工作区副作用聚合</h2>
    <p>
      你在做一个后台工作台。进入某个工作区时，它要做三件事：监听「当前工作区」这个状态，一旦变化就记录订阅目标；起一个定时器，每秒把同步次数加一；将来还要接一个 WebSocket 推送。离开工作区时，这三样东西都应该停掉。
    </p>
    <p>
      麻烦在于这三样东西并不是同一类东西。<code>watchEffect</code> 是响应式副作用，Vue 知道它存在；而定时器、WebSocket、第三方订阅属于外部资源，Vue 完全不知道。于是一个很自然的问题浮出来：<strong>一组互相牵连的副作用，怎么才能被当成一个整体来启动和停止？</strong>
    </p>

    <h2>卸载钩子逐一清理</h2>
    <p>
      最省事的做法：在组件的 <code>setup</code> 里写 <code>watchEffect</code>，再起一个 <code>setInterval</code>，然后在 <code>onUnmounted</code> 里逐个清理——清定时器、停止监听。代码直白，一眼能看懂每个资源在哪创建、在哪释放。
    </p>
    <p>
      这个方案做对了一件事：<strong>它意识到了「创建时必须配一份清理」</strong>。对于只有一个监听、一个定时器的小场景，这已经足够，而且没有任何额外概念要学。
    </p>

    <h2>组件外副作用泄漏</h2>
    <ul>
      <li>组件 <code>setup</code> 之外根本没有 <code>onUnmounted</code>：写在 service、可复用状态模块或插件里的 <code>watch</code>，找不到地方停掉它。</li>
      <li>「切换工作区」发生在同一个组件内部，组件并没有被卸载，<code>onUnmounted</code> 只在组件彻底消失时触发一次，切换那一下什么都清不掉。</li>
      <li>副作用一多，清理清单就变成了人工维护的台账，漏掉一个就留下泄漏，而且顺序还容易写错。</li>
      <li>停止的粒度是「一个个停」，没有「这一组属于同一个业务模块」的表达，读代码的人无法一眼判断哪些副作用是绑在一起的。</li>
    </ul>

    <h2>作用域整体启停</h2>
    <p>
      把「一组副作用」变成一个可以整体启停的对象，对应的工具就是 <code>effectScope</code>。调用 <code>effectScope()</code> 得到一个作用域，在它内部创建的 <code>computed</code>、<code>watch</code>、<code>watchEffect</code> 都会被收集进去；调用一次 <code>scope.stop()</code>，这一组副作用一起停止。
    </p>
    <ol class="lesson-steps">
      <li>进入工作区时创建作用域：<code>workspaceScope = effectScope()</code>，并记下它，供离开时使用。</li>
      <li>在 <code>workspaceScope.run(() =&gt; { ... })</code> 里启动监听与同步定时器，它们自动归属这个作用域。</li>
      <li>运行期间切换工作区，内部那个监听会自动响应并记录新的订阅目标，不需要额外处理。</li>
      <li>离开时调用 <code>workspaceScope.stop()</code>，监听与作用域内的清理逻辑一起收尾，再把引用置空以免重复使用。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>一个关键分工：</strong><code>effectScope</code> 只能收走响应式副作用。定时器、WebSocket、第三方订阅必须用 <code>onScopeDispose</code> 注册清理函数——它在作用域停止时执行，正好和响应式副作用同步收尾，这样「一组资源同时启停」才真正成立。
    </div>
    <p>
      还有两个容易踩的细节。第一，<strong>不要重复运行已经停止的作用域</strong>：一个 scope 停掉之后就作废了，重新进入业务模块应该创建一个新的，而不是把旧的再 <code>run</code> 一次。第二，<strong>组件 <code>setup</code> 本身已经运行在一个作用域里</strong>，组件卸载时它会自动停止，所以在组件内部再包一层 <code>effectScope</code> 通常没有收益——它的价值恰恰在组件之外，比如一个跨组件共享的状态模块、一个需要按需启动的服务。此外要清楚：作用域停止后其内的 <code>watch</code> 不再触发，但已经占用的外部资源仍需通过 <code>onScopeDispose</code> 显式释放，两者缺一不可。
    </p>

    <p>
      换个角度对比会更清楚：<code>onUnmounted</code> 回答的是「组件什么时候消失」，它绑定的是<strong>渲染生命周期</strong>；而 <code>effectScope</code> 回答的是「这组副作用什么时候该结束」，它绑定的是<strong>业务生命周期</strong>。两者很多时候恰好重合，所以组件内的小场景看不出差别；但只要出现「组件还在、业务已经结束」或「组件早已不在、业务仍在别处运行」的情况，前者就无能为力了。判断该不该引入作用域，看的就是这组副作用是否拥有独立的业务生命周期。
    </p>

    <h2>启停与清理对照</h2>
    <figure class="lesson-figure">
      <figcaption>点「启动作用域」再切换工作区，最后点「停止并清理」，看监听与定时器是否一起收尾。</figcaption>
      <K26EffectScope />
    </figure>

    <h2>副作用生命周期</h2>
    <p>
      生命周期管理的难点从来不是「怎么停掉一个监听」，而是「怎么保证一组该一起生一起死的东西不会漏」。<code>effectScope</code> 把散落的副作用收进一个边界，<code>scope.stop()</code> 提供整体停止，<code>onScopeDispose</code> 补齐外部资源的清理——三者合起来，才让「进入业务模块时启动、退出时清理」成为一件可以放心交给代码的事。
    </p>
    <div class="lesson-term">
      <span class="term-name">「副作用作用域」</span>指 <code>effectScope</code> 收集其内部创建的 <code>computed</code>、<code>watch</code>、<code>watchEffect</code>，调用 <code>stop</code> 后统一停止这些副作用；<code>onScopeDispose</code> 用于注册同一作用域内的额外清理逻辑（如定时器、WebSocket）。组件 <code>setup</code> 本身已在作用域中，所以它更适合组件外的服务与可复用状态模块；已停止的作用域不应重复运行。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
