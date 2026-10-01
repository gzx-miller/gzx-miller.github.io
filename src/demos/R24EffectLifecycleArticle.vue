<script setup lang="ts">
import R24EffectLifecycle from './R24EffectLifecycle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>计时器面板上，点「开始」，秒数开始跳；点「暂停」，秒数停了——看着一切正常。可如果你在 Effect 里打印日志，会发现「暂停」这一下不只关掉了计时器：React 先跑了一次<strong>清理</strong>，紧接着又执行了一遍 <strong>Effect</strong>，而这一次它什么都没建就退了出来。你只是把 <code>running</code> 从 <code>true</code> 改成 <code>false</code>，为什么要「先拆旧的、再跑一遍新的」？
    </div>

    <h2>提出问题</h2>
    <p>
      你需要的那几样东西——窗口尺寸的 <code>resize</code> 监听、每秒跳一次的计时器、网络在线的 <code>online</code> / <code>offline</code> 订阅——都是<strong>外部世界</strong>里的资源。它们不会自己跟着组件走：组件挂载了，没人替你加监听；组件卸载了，监听也不会自己消失。你得在合适的时候建、在合适的时候拆。
    </p>
    <p>
      麻烦在于「合适的时候」并不是你想的那个时候。旧办法里最常见的是<strong>只在挂载时建、从不拆</strong>：监听留在 <code>window</code> 上，回调继续对已经卸载的组件调 <code>setState</code>，控制台开始刷「不要在未挂载的组件上更新状态」。第二种是<strong>建了新的、忘了拆旧的</strong>：依赖一变，Effect 又跑一遍、再建一个计时器，旧的还在后台跑，于是出现双份更新。第三种是<strong>把互不相关的副作用塞进同一个 Effect</strong>：改一个依赖，把本来不用动的监听也连根拔起重来。第四种是<strong>用提前 <code>return</code> 控制启停</strong>，却误以为它也能拦住上一次的清理。
    </p>
    <p>
      所以要回答的是：<strong>在挂载、依赖更新、卸载这几个时刻上，Effect 与它的清理函数分别按什么顺序执行，又各自带着哪一次渲染的值？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      先把三条最基本的时机规则记牢：<strong>组件挂载并提交到 DOM 之后，Effect 跑第一次</strong>；<strong>依赖变化时，React 先跑上一次返回的清理函数，再跑新的 Effect</strong>；<strong>组件卸载时，跑最后一次清理</strong>。想让它只在挂载和卸载各跑一次，就把依赖数组写成空的 <code>[]</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给「与外部世界同步」的动作划出了有始有终的一段区间</strong>——建在这里，拆也在这里，谁建的谁负责清，责任不再散落。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>依赖写成空数组 <code>[]</code> 和干脆<strong>省略第二个参数</strong>是两回事：<code>useEffect(fn)</code> 每个渲染都会跑一次，和「只在挂载时跑」正好相反，很多人在这里踩坑。</li>
      <li>以为「某个值不影响要不要同步」就不写进依赖：可 Effect 体里读到的、清理函数里用到的响应式值都得列上，否则会读到<strong>过期的闭包</strong>。</li>
      <li>用提前 <code>return</code> 做条件启停时，误以为它连清理也一起跳过了：提前 <code>return</code> 只决定「这一次建不建」，而上次返回过的清理函数照样会先被调用。</li>
      <li>把 resize 监听、计时器、网络订阅塞进同一个 Effect：只想启停计时器，却把窗口监听也一起拆了重建，白白折腾。</li>
      <li>在清理函数里读取「最新」的状态：清理闭包绑定的是<strong>创建它的那次渲染</strong>的值，于是你打印出来的是旧值，容易误判成 bug。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻三条时机规则，而是按「这段同步什么时候该重来」把 Effect 分成三种模式，各自对应演示里的一个组件。
    </p>
    <ol class="lesson-steps">
      <li><strong>挂载 / 卸载型</strong>：依赖写空数组 <code>[]</code>，只在挂载时建、卸载时拆。<code>WindowSize</code> 挂载时添加 <code>resize</code> 监听、卸载时移除；<code>OnlineStatus</code> 挂载时订阅 <code>online</code> / <code>offline</code>、卸载时解除——两者都不依赖任何状态，所以只跑一次。</li>
      <li><strong>依赖更新型</strong>：把「影响这次同步要不要重来」的值放进依赖。<code>Timer</code> 依赖 <code>running</code>：每次开关切换，React 都先清掉旧计时器、再按新状态决定建不建，于是不会出现两个计时器并存。</li>
      <li><strong>条件启停型</strong>：在 Effect 里提前 <code>return</code>，让条件不满足时「这次什么都不建」。但要记住，上一次返回过的清理函数仍会先跑——停掉计时器的其实是它，而不是这次的 <code>return</code>。</li>
    </ol>
    <p>
      关键的因果在配对顺序上。React 在依赖变化时执行的这两步，用的并不是同一份值：<strong>清理函数用的是「创建它的那次渲染」里的值（旧值），新 Effect 用的是「刚刚这次渲染」里的值（新值）</strong>。所以一次更新看着像「先拆旧、再建新」，本质上就是「用旧值收尾、用新值开场」。这条规律一旦记住，两种困惑就都没了——为什么清理里打印的总是旧值，以及为什么条件 <code>return</code> 拦不住旧的拆除。
    </p>
    <p>
      还有一条拆分原则：<strong>互不相关的副作用要拆成独立的 Effect</strong>。把窗口尺寸、计时器、在线状态分成三个 Effect，各管各的依赖，切换计时器就只会动计时器那一个，不会误伤别处。反过来，凡是影响运行条件的值，都必须老老实实写进依赖数组，否则 Effect 会闭包到过期的那一份。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须记住的边界：</strong>依赖写空数组可以，但<strong>不能省略第二个参数本身</strong>——省略它意味着每次渲染都重新同步，和你的意图南辕北辙。清理函数会在「依赖变化、Effect 即将重新执行之前」和「组件卸载时」各跑一次：前者是给旧的收尾，后者是最后的告别，两次都要写。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖一拖浏览器窗口，看「窗口尺寸」跟着更新；点计时器的「开始 / 暂停 / 重置」，观察开关切换时旧计时器被清掉、新计时器才建起来；计时器标题旁那个在线徽章，则是挂载时订阅一次网络事件、卸载时解除。三块正好对应挂载 / 更新 / 卸载三种时机。</figcaption>
      <R24EffectLifecycle />
    </figure>

    <h2>总结</h2>
    <p>
      Effect 的一生就三个时刻：挂载后第一次执行、依赖变化时先清理再重新执行、卸载时最后清理一次。把「建和拆」写成对称的一对，把影响它重来的值如实写进依赖数组，再按「这段同步什么时候该重来」选对依赖形态——「监听忘清」和「旧逻辑还在跑」这两类问题，从时机这一层就被堵住了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Effect 的 setup / cleanup 配对」</span>指望的是每一次副作用都成对出现：Effect 回调（setup）负责建立与外部世界的同步并返回一个清理函数（cleanup），React 会在<strong>组件挂载后</strong>跑第一次 setup，在<strong>依赖变化、Effect 即将重新执行之前</strong>先跑上一次的 cleanup 再跑新 setup，在<strong>组件卸载时</strong>跑最后一次 cleanup。关键边界：cleanup 闭包绑定的是「创建它的那次渲染」的值，而新 setup 用的是最新渲染的值；空数组 <code>[]</code> 表示只在挂载与卸载各跑一次，但第二个参数本身不能省略。
    </div>
  </LessonArticle>
</template>
