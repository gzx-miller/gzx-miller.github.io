const n=`<script setup lang="ts">
import R05EffectSync from './R05EffectSync.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>会议时钟每秒钟跳一次，看着挺对。可你切换几次时区、再切回来，秒针就开始疯跑——一秒钟跳两三下，越切越快。你不过是在下拉框里换了个城市，那个每秒计数的定时器怎么就多出来好几个？
    </div>

    <h2>外部同步与派生计算</h2>
    <p>
      你要做一个跨时区会议时钟：显示当前时刻，并且能在「上海 / 伦敦 / 纽约」之间切换。这里需要两件本质不同的事。第一件是<strong>与外部世界同步</strong>——电脑的系统时间不会自己通知 React，你必须挂一个每秒触发一次的计时器，主动把时间取回来。第二件是<strong>纯计算</strong>——把当前这个时刻按某个时区格式化成「时:分:秒」。
    </p>
    <p>
      麻烦在于，如果你把「起计时器」这类动作随手写进渲染里，每次重新渲染就会再建一个；旧的又没人管，于是计时器越堆越多。而如果你反过来，把本该现算的格式化结果也塞进一个「订阅」里、用 setState 存起来，你就会凭空多出一份需要同步的状态。界面上一个「慢半拍」或「越跑越快」，根子都在这里。
    </p>
    <p>
      所以要回答的是：<strong>哪些事必须在 React 之外发生、又该在什么时机建和拆；哪些事其实根本不该进这套机制？</strong>
    </p>

    <h2>副作用承载外部资源</h2>
    <p>
      最小的一步：凡是需要和 React 之外的世界打交道的事——计时器、事件监听、网络请求、第三方库——都放进 <code>useEffect</code>。它有两个关键能力：在组件提交到 DOM 之后执行，以及<strong>返回一个清理函数</strong>，把建出去的东西收回来。计时器这样写：<code>useEffect(() =&gt; { const timer = setInterval(() =&gt; setNow(new Date()), 1000); return () =&gt; clearInterval(timer) }, [])</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给「与外部系统同步」这件事划出了一块专门的、有始有终的区域</strong>——建的时候在这里，拆的时候也在这里。副作用不再散落在渲染逻辑中，谁建的、谁负责清，一目了然。
    </p>

    <h2>缺失清理引发泄漏</h2>
    <ul>
      <li>只写了 <code>setInterval</code> 却忘了返回清理函数：组件卸载后计时器还在跑，它继续对已经卸载的组件调用 setState，控制台报出「不要在未挂载的组件上更新状态」，切得越勤，残留的计时器越多。</li>
      <li>依赖数组漏写了 Effect 内部读到的响应式值：Effect 会一直读到那个值<strong>过期的快照</strong>，行为和你预期的不一致。</li>
      <li>为了「只在挂载时跑一次」而故意漏写依赖：这是在靠掩盖问题控次数，一旦相关值真的变了，Effect 却视而不见，bug 极难排查。</li>
      <li>把筛选、格式、合计这类<strong>纯计算</strong>搬进 Effect 再 setState：白白多一次渲染、多一份来源，依赖没写对还会自触发，绕进死循环。</li>
    </ul>

    <h2>Effect职责边界</h2>
    <p>
      先立一条边界：<strong>Effect 只负责「与外部系统同步」，派生数据留在渲染里算。</strong>这一句能挡掉一大半误用——格式化时区、统计数量这类事，直接写在渲染表达式中即可，根本不需要进 Effect。
    </p>
    <p>
      接着处理拆除。清理函数是 Effect 的「另一半」：<strong>建了什么，就在返回的函数里拆什么</strong>，而且两者要真正对称。整个执行顺序是这样的：
    </p>
    <ol class="lesson-steps">
      <li>组件挂载、提交到 DOM 之后，Effect 运行，创建 <code>setInterval</code>，把它登记为待清理资源。</li>
      <li>计时器每秒触发一次，通过 <code>setNow(new Date())</code> 更新当前时刻，触发一次重新渲染。</li>
      <li>当 Effect 即将再次运行、或组件被卸载时，React 先调用上一次返回的清理函数，<code>clearInterval</code> 把旧计时器停掉，然后再执行新的 Effect。</li>
      <li>切换时区时，只改变格式化所用的参数，<strong>并不需要重建计时器</strong>——所以这个 Effect 的依赖数组是空的，它只在挂载和卸载时各跑一次。</li>
    </ol>
    <p>
      这里藏着本课最实用的一条判断：<strong>「变化的东西」要落在依赖数组里，「不随之变化的东西」就不要放进去</strong>。演示里，时刻 <code>now</code> 靠计时器自己更新，时区只是最后格式化时用到的一个参数，两者都与「起不起计时器」无关，Effect 依赖自然为空；而格式化这一步放在渲染里，时区一变就重新算，不需要任何额外的同步代码。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>不要靠「故意漏写依赖」来控制 Effect 的运行次数，那是在用隐藏的 bug 换表面的效果；纯计算不属于 Effect——能用现有状态直接算出来的值，就留在渲染里，别用 setState 再存一份。另外，开发模式的 StrictMode 会额外跑一次「setup → cleanup」，这是帮你提前暴露清理缺陷，而不是故障。
    </div>

    <h2>时区切换与计时稳定</h2>
    <figure class="lesson-figure">
      <figcaption>切换时区下拉框：时钟只在挂载时建了一个计时器、卸载时被清掉，时区只是渲染阶段重新拿去格式化的参数——所以切来切去，秒针也不会变快。</figcaption>
      <R05EffectSync />
    </figure>

    <h2>资源清理与依赖数组</h2>
    <p>
      <code>useEffect</code> 的职责只有一件：让组件和<strong>React 之外的世界</strong>保持同步。同步的资源要成对地建和拆，依赖数组里如实写出它读到的响应式值；至于能从现有状态直接算出来的东西——格式化、筛选、合计——统统留在渲染里。分清这两类事，「越切越快」和「读到旧值」就不会再找上你。
    </p>
    <div class="lesson-term">
      <span class="term-name">「清理函数（cleanup function）」</span>是 Effect 回调在需要「拆除上一次同步」时返回的那个函数，用于撤销订阅、清除计时器、解绑事件等，让副作用不留残留。调用时机与边界：在 Effect 因依赖变化而<strong>重新运行之前</strong>调用一次，并在组件<strong>卸载时</strong>最后调用一次；它必须与前面的 setup 真正对称（建了什么就拆什么）；在开发模式的 StrictMode 下，挂载阶段会刻意多执行一次 setup 与 cleanup，用来检验清理是否完整。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
