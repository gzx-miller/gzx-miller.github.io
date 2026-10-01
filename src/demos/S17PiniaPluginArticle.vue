<script setup lang="ts">
import S17PiniaPlugin from './S17PiniaPlugin.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>项目里有八个 store，每个都要写日志、每个都要存 localStorage、出了错都要上报——难道这些和业务无关的代码，真的要在每个 store 里各抄一遍吗？
    </div>

    <h2>横切能力散落</h2>
    <p>
      你在做一个学习平台的登录日志与错误追踪：只要用户执行了关键操作（报名、退课、切换语言），就记一条日志；某个 store 的数据还要在刷新后保持住。最初只有一两个 store，你在它们各自内部写了点日志和持久化代码，还觉得挺顺手。
    </p>
    <p>
      可当 store 长到第八个，事情变味了：<strong>日志逻辑被复制了八份，持久化代码被复制了八份，错误上报又被复制了八份</strong>。它们和「报名」「退课」这些真正的业务逻辑混在同一个文件里，谁改了公共格式，就得挨个改一遍，还总会漏掉某个新加的 store。你需要的其实是同一种东西，只是希望它能被「附加」到所有 store 上。
    </p>

    <h2>逐仓库重复写</h2>
    <p>
      最直接的做法：在每个 store 内部，各自写一份日志与持久化的代码。谁需要就在谁那里加一遍。
    </p>
    <p>
      它说对了一件关键的事：<strong>日志、持久化、错误上报确实是横切的关注点，每一个 store 都真的需要它</strong>。问题不在于需求本身，而在于实现位置——你把「所有 store 共有的能力」写成了「每个 store 各自的能力」，重复只是表象，真正的病根是这段逻辑没有一个统一的挂载点。
    </p>

    <h2>重复代码漏改</h2>
    <ul>
      <li>相同代码在多个 store 里重复，改一处要同步改很多处，必然漏改。</li>
      <li>新增 store 时很容易忘了加日志，行为悄悄不一致。</li>
      <li>业务逻辑与基础设施逻辑混在一起，store 越来越难读。</li>
      <li>想临时关掉某个 store 的持久化，只能进源码里改，没有统一的开关。</li>
      <li>这段横切逻辑本身没有被单独测过，出问题只能逐个 store 排查。</li>
    </ul>

    <h2>统一插件挂点</h2>
    <p>
      不推翻「每个 store 都要这些能力」，而是<strong>给它一个统一的挂载点</strong>。Pinia 提供的挂载点就是插件：用 <code>pinia.use(plugin)</code> 注册一个函数，<strong>这个函数会在每一个 store 被创建时执行一次</strong>，于是你可以在里面一次性为所有 store 接上增强逻辑。
    </p>
    <p>
      插件函数的参数是插件上下文，里面包含 <code>pinia</code>、<code>app</code>、当前 <code>store</code> 以及该 store 的 <code>options</code>。有了这个上下文，就能对该 store 做两件事：用 <code>store.$subscribe</code> 观察状态变化，用 <code>store.$onAction</code> 拦截 action 的调用。
    </p>
    <ol class="lesson-steps">
      <li>写一个插件函数，从上下文里解构出 <code>pinia</code> 与当前 <code>store</code>。</li>
      <li>在函数内调用 <code>store.$subscribe</code>，把状态变更写进 localStorage 或日志。</li>
      <li>用 <code>store.$onAction</code> 挂上 <code>before</code>、<code>after</code>、<code>onError</code> 三个回调，记录调用与上报异常。</li>
      <li>在入口先 <code>createPinia()</code>，再 <code>pinia.use(plugin)</code> 完成注册。</li>
      <li>新建一个 store，验证日志与持久化无需手写就已生效。</li>
    </ol>
    <p>
      这套结构最妙的一点在 <code>$onAction</code> 的 <code>after</code> 回调：它<strong>能拿到 action 的返回值，包括异步 action 的结果</strong>。所以「调用开始」「调用成功并返回了什么」「调用失败并抛了什么」这三件事，可以在插件里被统一收口，业务 action 里不必再掺任何日志代码。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须留意的点：</strong>持久化插件通常靠 <code>$subscribe</code> 监听变更写入本地存储，但在 SSR 场景下要看清楚当前跑在服务端还是客户端，<strong>等水合完成后再回填本地状态</strong>，否则服务端渲染与客户端首屏会对不上。另外，插件可以通过 <code>options</code> 读取每个 store 的配置，<strong>据此实现「按 store 开关某项能力」</strong>，而不是一刀切。
    </div>
    <div class="lesson-box hint">
      <strong>一个实用约定：</strong>插件里只放「所有 store 都需要」的通用能力，比如日志、持久化、错误上报；只对个别 store 生效的逻辑，更适合写成普通函数或直接放进 store 内部。插件越通用，越不容易在日后变成难以理解的隐式行为。
    </div>
    <p>
      回到开头的困境：现在日志、持久化、错误上报都只写了一份，挂在统一的入口上。新增 store 会自动带上这些能力，横切关注点也终于和业务逻辑分开了。
    </p>

    <h2>调用日志自动生成</h2>
    <figure class="lesson-figure">
      <figcaption>点一下按钮触发 action，看插件如何自动为所有 store 打上调用日志。</figcaption>
      <S17PiniaPlugin />
    </figure>

    <h2>公共逻辑外移</h2>
    <p>
      Pinia 插件解决的是「横切关注点该写在哪」的问题：既然每个 store 都需要日志、持久化与错误处理，就不该把它们复制到每个 store 里，而应在 <code>pinia.use()</code> 处统一挂载。插件在 store 创建时执行，借助 <code>$subscribe</code> 监听状态、借助 <code>$onAction</code> 拦截 action，让增强逻辑只写一次、处处生效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Pinia 插件」</span>是用 <code>pinia.use()</code> 注册的函数，<strong>每个 store 创建时执行一次</strong>，参数为包含 <code>pinia</code>、<code>app</code>、<code>store</code>、<code>options</code> 的上下文。在其中用 <code>$subscribe</code> 监听状态变化、用 <code>$onAction</code> 拦截 action 的 <code>before</code>、<code>after</code>、<code>onError</code>（<code>after</code> 可取到含异步结果的返回值），从而为所有 store 统一注入持久化、日志与错误上报。
    </div>
  </LessonArticle>
</template>
