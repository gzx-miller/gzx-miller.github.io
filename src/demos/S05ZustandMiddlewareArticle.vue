<script setup lang="ts">
import S05ZustandMiddleware from './S05ZustandMiddleware.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只想在课程进度跨过某个值那一刻上报一次埋点，于是写了 <code>useCourseStore.subscribe(cb)</code>。结果只要 Store 里任何一个字段动一下——未读数加一、弹窗开关切一次——回调都被调一遍，日志刷屏；更别扭的是回调只给你新状态，你根本不知道它是从多少跳上来的，也就判断不出「刚刚到底有没有跨过那条线」。
    </div>

    <h2>横切杂活归属</h2>
    <p>
      这份 Store 除了业务状态本身，还压着几件和业务无关的事：要能把数据存进 <code>localStorage</code>、要能接上 Redux DevTools 看每次改动、写更新时又想用 <code>state.progress += 20</code> 这种可变写法省掉一堆展开。这些能力有个共同点——它们和「进度是多少」这件事正交，几乎每个 Store 都要有，却都不属于某个具体的业务字段。
    </p>
    <p>
      旧办法各有各的代价。<strong>把持久化和调试逻辑手写进每个 action</strong>：一个 action 里既改状态又写存储又报 devtools，业务代码被横切逻辑淹掉，改一处存储键要翻遍所有 action；<strong>在组件里用 effect 手动订阅整个 Store</strong>：任何字段变化都触发回调，还只拿到新值，无从判断切片的前后差异；<strong>要接 DevTools 就自己调 <code>window.__REDUX_DEVTOOLS_EXTENSION__</code></strong>：样板代码散落各处，稍不留神就和 Store 的规范对不上。
    </p>
    <p>
      所以要回答的是：<strong>能不能在一个地方，给 Store 一次性挂上这些横切能力，而组件的消费方式一行都不用改；同时把「监听」收窄到某个切片，并能拿到它的前后两个值？</strong>
    </p>

    <h2>高阶包裹模式</h2>
    <p>
      最朴素的做法：<strong>中间件本质上是一个包裹 <code>create</code> 创建器的高阶函数</strong>。你写的业务创建器 <code>(set) =&gt; ({ progress: 0, advance: () =&gt; set(...) })</code> 原封不动，外面套一层 <code>subscribeWithSelector</code> 再交给 <code>create</code>：<code>create(subscribeWithSelector((set) =&gt; ({ ... })))</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把横切能力和业务状态解耦了</strong>。业务里只声明「有哪些状态、怎么改」，持久化、调试、选择性订阅这些能力，全部由中间件在外层统一追加——组件那边 <code>useCourseStore((s) =&gt; s.progress)</code> 照旧写，看不出 Store 外面裹了几层。
    </p>

    <h2>订阅粒度与顺序</h2>
    <ul>
      <li>裸的 <code>subscribe(listener)</code> 不认切片：未读数变一次也回调一次，「只有 <code>progress</code> 变化才通知我」这条根本不成立，埋点会重复上报。</li>
      <li>回调只给一个新状态：你会看到「现在是 40%」，却拿不到「刚才还是 20%」，跨阈值判断天然做不了。</li>
      <li><code>subscribe</code> 返回的取消函数如果没在 <code>useEffect</code> 清理阶段调用，组件卸载后回调还在跑；重复挂载会叠加多个监听，一次变化触发好几次。</li>
      <li>把中间件顺序写反，比如写成 <code>persist(devtools(...))</code>：DevTools 里动作名会带上 <code>persist/</code> 前缀，回放出来的状态和历史对不上，某些组合顺序还会让 TypeScript 类型推导直接崩掉。</li>
      <li><code>persist</code> 不给固定的 <code>key</code>、或改了 <code>key</code>：找不到旧的存储记录，等于每次刷新都从头开始，用户以为保存过的东西全没了。</li>
      <li>升级了状态结构却没写 <code>version</code> 与 <code>migrate</code>：用户浏览器里存的还是老结构，反序列化后新字段是 <code>undefined</code>，页面拿到就崩。</li>
    </ul>

    <h2>中间件层层叠加</h2>
    <p>
      不推翻「中间件包裹创建器」这条主线，而是一层一层把能力补上，并且记住<strong>越靠外层的中间件，看到的越接近最终 store 的完整行为</strong>。
    </p>
    <ol class="lesson-steps">
      <li>先补「选择性订阅」。用 <code>subscribeWithSelector</code> 包住创建器，<code>store.subscribe(selector, listener)</code> 这个重载才存在。中间件为每个订阅记下上一次的切片值，状态变化时先算一遍 selector，只有切片变了才通知回调，并把 <code>(value, previous)</code> 两个值一起交给你——「从 20% 跳到 40%」终于能判断了。</li>
      <li>再补「订阅的生命周期」。<code>subscribe</code> 会返回一个取消函数，把它放进 <code>useEffect</code> 的清理阶段调用。依赖数组写空，让这次订阅只在挂载时建立、卸载时拆掉，避免泄漏和重复监听。</li>
      <li>再补「持久化」。外面再套一层 <code>persist</code>，用<strong>常量</strong>的 <code>key</code> 指定存储位置；一旦状态结构会演进，就同时给出 <code>version</code> 和 <code>migrate</code>，让旧数据在反序列化时被升级到新结构。</li>
      <li>再补「调试与写法」。<code>devtools</code> 让每次 <code>set</code> 都出现在 Redux DevTools 的时间线里；<code>immer</code> 让你在 <code>set</code> 里直接写 <code>state.progress += 20</code>，由 immer 负责把它转成不可变更新，省掉手写展开。</li>
      <li>最后固定组合顺序。从内到外大致是：<strong>业务创建器 → immer / subscribeWithSelector（改变赋值与订阅行为的）→ persist（负责落盘的）→ devtools（最外层的记录者）</strong>。因为 devtools 在最外层，它记录到的才是经过所有中间件之后的最终命名与结构。</li>
    </ol>
    <p>
      拿着这套回头看开场那幕就通了：<code>advance</code> 只改 <code>progress</code>，而回调是「按 <code>progress</code> 这个切片」订阅的，所以别处字段怎么动它都不吭声；切片真变了，回调同时收到新旧两个值，跨没跨过那条线一目了然。刷新页面时，<code>persist</code> 把上次的进度从存储里读回来——而这一切都不需要组件多写一行。
    </p>
    <div class="lesson-box warn">
      <strong>两条最容易踩的边界：</strong>中间件的<strong>组合顺序会改变行为与类型推导</strong>，不要凭感觉叠，按「改行为的在内、落盘与记录在外」来排；<code>persist</code> 的 <code>key</code> 必须是常量，状态结构一旦调整就要升 <code>version</code> 并写好 <code>migrate</code>，否则老用户浏览器里的旧数据会让新代码直接崩溃。
    </div>

    <h2>快照逐条记录</h2>
    <figure class="lesson-figure">
      <figcaption>点「完成一阶段」，进度按 20% 一档往上加；右侧日志会逐条记下 <code>20% → 40%</code> 这样的前后快照。留意它是「按 progress 切片」订阅的——只有进度真的变了才出现一条新记录，其余状态怎么动都不会打扰它。</figcaption>
      <S05ZustandMiddleware />
    </figure>

    <h2>统一包裹管理</h2>
    <p>
      Zustand 中间件把持久化、DevTools、Immer、选择性订阅这些横切能力从业务状态里剥离出来，用一层包裹统一追加，组件消费方式保持不变。真正决定你「能不能只听某个字段」的，是 <code>subscribeWithSelector</code> 那层：它让订阅带上了 selector 和前后值。叠中间件时按职责排好顺序，再把存储的 Key 与版本迁移照顾到，这套机制就能既干净又可靠。
    </p>
    <div class="lesson-term">
      <span class="term-name">「横切关注点（cross-cutting concern）」</span>指那些与核心业务逻辑正交、却需要在多处统一处理的能力，例如日志、持久化、调试、鉴权、埋点。中间件正是把它从业务代码里抽出来、用一层包裹集中处理的手段。边界：横切层是<strong>隐式的调用栈</strong>，多个中间件的<strong>叠加顺序会改变结果与类型推导</strong>（越靠外层越接近最终行为，记录类中间件应放最外），因此顺序不能随意调换；持久化这类落到外部存储的能力，还要额外规划常量 Key 与版本迁移。
    </div>
  </LessonArticle>
</template>
