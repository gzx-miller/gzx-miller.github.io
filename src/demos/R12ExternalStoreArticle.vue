<script setup lang="ts">
import R12ExternalStore from './R12ExternalStore.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>导航栏的角标显示未读数 <code>3</code>，切到工作台统计却还是 <code>2</code>——同一份数据，同一个页面，两处显示的数字居然对不上。
    </div>

    <h2>外部数据源的来源</h2>
    <p>
      这类数据的源头根本不在 React 里：它可能是一个全局计数器、一个 <code>WebSocket</code> 连接推来的消息、浏览器 API 的状态，或者某个状态库自己在 React 之外维护的对象。React 只负责把它们画出来，可它<strong>无法感知这些值的改变</strong>——你改了外部变量，React 不会自动重渲染。
    </p>
    <p>
      于是你必须手动把外部的变化「搬」进 React。用 <code>useState</code> 加一个订阅的写法看似顺理成章，但它会带来几笔只有人才能兜住的成本：订阅和取消订阅的时机要自己配对，漏一次就是泄漏；并发渲染下，同一次界面里不同组件可能在<strong>不同时刻</strong>读到外部快照，于是出现上面那种两处数字对不上的画面；要是做服务端渲染，服务端根本拿不到浏览器里的那份值，水合时还会报错。
    </p>
    <p>
      抽象出来就是一个问句：<strong>React 如何可靠地读取自身状态系统之外、会随时间变化的数据？</strong>
    </p>

    <h2>各自订阅的副本</h2>
    <p>
      最直接的做法：让每个用到这份数据的组件各自 <code>useState</code> 存一份，再在 <code>useEffect</code> 里向外部数据源订阅，变化时调用 <code>setState</code> 把新值同步进来。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把外部变化通过 <code>setState</code> 拉进了 React 的更新循环</strong>，React 终于有机会重渲染了。当外部数据源只有一个消费者、更新也不频繁时，这套写法完全能跑。
    </p>

    <h2>读取版本的错位</h2>
    <ul>
      <li>两个组件各自订阅、各自 <code>setState</code>，更新先后不一，某一次渲染里它们可能读到外部值的<strong>不同时刻版本</strong>，界面自相矛盾。</li>
      <li>并发渲染会把一次渲染拆开、甚至中途作废，<code>useEffect</code> 的订阅时机与读取时机脱节，读到「半旧半新」的值。</li>
      <li>每次 <code>setState</code> 都可能触发一轮额外渲染，如果组件里顺手 <code>getSnapshot</code> 出一个新对象，等价判断永远为假，直接进入<strong>无限更新</strong>。</li>
      <li>服务端渲染时没有浏览器环境，服务端与客户端拿到的初始快照不一致，水合阶段内容对不上并报警告。</li>
      <li>取消订阅函数写错、忘了返回、或在错误的分支里返回，组件卸载后仍会收到通知，造成泄漏与报错。</li>
    </ul>

    <h2>专用接口的统一读取</h2>
    <p>
      不推翻「订阅」，而是把这件事交给一个专用接口，让 React 亲自管理读取时机：<code>useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)</code>。外部数据源只负责两件事——保存一份不可变快照、维护监听器集合。组件把 <code>subscribe</code> 和 <code>getSnapshot</code> 交给 React，由 React 决定在什么时刻、以什么方式读取。
    </p>
    <ol class="lesson-steps">
      <li>外部 Store 在 React 之外保存当前快照，以及一个监听器集合。</li>
      <li>两个展示组件用<strong>同一组</strong> <code>subscribe</code> / <code>getSnapshot</code> 订阅同一个 Store。</li>
      <li>更新时<strong>整体替换</strong>快照（而不是原地修改），再依次通知所有监听器。</li>
      <li>由于每个消费者都从同一个快照读取，它们在同一次渲染里得到<strong>完全一致</strong>的结果。</li>
    </ol>
    <p>
      这条链的关键是一份契约：<strong>只要数据没变，<code>getSnapshot</code> 返回的值必须保持 <code>Object.is</code> 相等</strong>。所以快照要用整体替换的做法（例如 <code>{...old, count: old.count + 1}</code>），绝不能每次调用都新建一个对象。React 正是靠这份契约，才能在并发渲染中给你一个不会撕裂的一致视图。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见坑：</strong><code>getSnapshot</code> 若每次都返回新对象，等价性被破坏，会触发无限循环的更新警告；<code>subscribe</code> 函数最好<strong>定义在组件外部</strong>，否则每次渲染都会生成新的函数引用，导致反复重新订阅。
    </div>
    <p>
      还有两处细节要一起补上：做服务端渲染时提供 <code>getServerSnapshot</code>，保证服务端与水合阶段拿到一致的初始内容；订阅返回的取消函数要<strong>真正生效</strong>，让组件卸载后不再收到通知。把这两点补齐，state 库、浏览器 API、框架级缓存这些场景就都能用同一套接口讲清楚。
    </p>

    <h2>双面板数值同步</h2>
    <figure class="lesson-figure">
      <figcaption>点几次「外部 Store +1」，看两个独立面板是否始终显示同一个数字、最近更新时间是否同步刷新。</figcaption>
      <R12ExternalStore />
    </figure>

    <h2>同份数据的读取时机</h2>
    <p>
      读取 React 之外的数据，难点不在「读」，而在「什么时候读、大家读到的是不是同一份」。<code>useSyncExternalStore</code> 用 <code>subscribe</code> 管变化、用 <code>getSnapshot</code> 管快照，再靠 <code>Object.is</code> 相等这份契约换来并发渲染下的一致视图——外部数据因此不会在界面上自相矛盾。
    </p>
    <div class="lesson-term">
      <span class="term-name">「撕裂」</span>指同一次渲染中，不同组件读到了外部数据源在<strong>不同时刻</strong>的不同快照，导致界面自相矛盾。它源于并发渲染允许一次渲染被中断、穿插执行。防止办法是让所有消费者通过 <code>useSyncExternalStore</code> 从同一份、引用稳定的快照读取——<code>getSnapshot</code> 在数据未变时必须返回同一个对象。
    </div>
  </LessonArticle>
</template>
