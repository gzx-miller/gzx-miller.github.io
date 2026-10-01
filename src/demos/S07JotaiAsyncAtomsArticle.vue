<script setup lang="ts">
import S07JotaiAsyncAtoms from './S07JotaiAsyncAtoms.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你照着上一课的思路，给课程列表写了个派生原子：<code>const coursesAtom = atom(async (get) =&gt; { const res = await fetch('/api/courses'); return res.json() })</code>。组件里一句 <code>useAtomValue(coursesAtom)</code> 跑起来，页面直接白了，控制台只冒出一句「A component suspended while responding to synchronous input」。你没写任何加载逻辑，它凭什么白屏？
    </div>

    <h2>异步取数三难</h2>
    <p>
      拉一份远程列表，实际要同时管三件事：值还没到的时候显示什么、请求失败了怎么办、什么时候该重新拉一次。而上一课的同步派生原子只管「读到就现算」，它默认值总是立刻可得——它不负责回答「值在路上时界面怎么办」。
    </p>
    <p>
      旧办法各有各的成本。<strong>用 <code>useState</code> 三件套（data / loading / error）加 <code>useEffect</code></strong>：每一个异步数据源都要复制这几行样板，刷新逻辑还得塞进 effect 的依赖数组。<strong>把 loading 手动存进 state 再在每个分支里复位</strong>：请求一多就是几个布尔值互相打架，漏掉一处复位界面就永远停在加载中。<strong>用「刷新计数器 + effect 依赖」触发重跑</strong>：本质还是手写依赖，和上一课漏列依赖是同一类错误。
    </p>
    <p>
      所以要回答的是：<strong>能不能让异步数据也像派生原子一样，由依赖图自动决定何时重算、何时失效；而「加载中 / 出错」这些状态，交给一个统一的边界去展示，而不是散落在每个组件里？</strong>
    </p>

    <h2>读取函数异步化</h2>
    <p>
      最朴素的做法：Jotai 允许读取函数<strong>返回一个 Promise</strong>——把上面的 <code>coursesAtom</code> 写成 <code>async</code> 函数就成了「异步原子」。就这么一行，异步这件事被收进了原子本身。
    </p>
    <p>
      这个方案做对了一件事：<strong>组件侧完全不用改</strong>。它依然只写 <code>useAtomValue(coursesAtom)</code>，不需要自己 <code>useEffect</code>、不需要自己维护 loading 字段。数据怎么来、什么时候该来，都归原子管。
    </p>

    <h2>边界缺失白屏</h2>
    <ul>
      <li>没有 <code>Suspense</code> 边界包着：Promise 未决时组件会「挂起」，而周围没人接手，于是就出现了开场那样的白屏。</li>
      <li>想在组件里手写 <code>if (!courses) return &lt;p&gt;加载中&lt;/p&gt;</code>：没用——挂起发生在渲染期间，你的判断语句根本没机会执行，控制权已经被上层的边界拿走了。</li>
      <li>把异步 atom 定义在组件内部：每次渲染都新建一个 atom，等于每次都是全新的、没有缓存的请求，不但重复拉取，还可能陷入反复挂起。</li>
      <li>想用「把组件卸载再挂回来」来刷新：这跟依赖图没关系，旧结果可能仍然被缓存，页面看起来「点了没反应」。</li>
      <li>只想着成功路径：一旦 <code>await fetch</code> 失败、Promise 被拒绝，错误不会被 fallback 吃下，而是继续往上抛。</li>
    </ul>

    <h2>等待与失效归属</h2>
    <p>
      不推翻「异步原子」这条主线，而是给它补上两块拼图：一块是<strong>等待期间的展示</strong>由谁负责，另一块是<strong>何时失效重算</strong>由谁决定。
    </p>
    <ol class="lesson-steps">
      <li>先补「Suspense 边界」。异步原子被读取时，只要值还没准备好，读取它的组件就进入<strong>挂起（suspend）</strong>状态；最近的 <code>&lt;Suspense fallback={...}&gt;</code> 边界立即显示后备界面。等 Promise resolve 出结果，React 再用真实内容替换掉 fallback。所以第一步永远是：给读异步原子的组件套一个 Suspense 边界，让「加载中」有地方可写。</li>
      <li>再补「依赖驱动的失效」。建一个 <code>refreshAtom = atom(0)</code> 当作刷新信号，然后在异步原子的读取函数里写一句 <code>get(refreshAtom)</code>——注意它不参与任何计算，只是「读了一下」，但这一读就建立了一条依赖边。点「重新读取」把 <code>refreshAtom</code> 加一，这条边下游的异步原子立刻<strong>失效并重新计算</strong>，请求自然又发了一次。</li>
      <li>想清楚这条边的分量：刷新不是「手动清缓存再调用一遍」，而是<strong>改变一个它依赖的值</strong>，重算交给依赖图自动完成。这跟上一课的同步派生是同一套机制，只不过读取函数里多了 <code>await</code>。</li>
      <li>再补「共享与去重」。同一个异步原子被多个组件读取时，Jotai 只执行一次，结果在所有消费者之间共享——同一个 Promise 被复用，不会因为「多读了几处」就多发几次请求。</li>
      <li>再补「失败兜底」。异步原子拒绝时，错误会向上交给最近的错误边界，而不是显示成 fallback；需要重试时，把它设计成「再次改变 <code>refreshAtom</code>」，让重试入口也走依赖图，而不是另起一套逻辑。</li>
      <li>最后划清边界。并发取消、按 key 去重、过期重取这些更完整的<strong>服务端缓存语义</strong>，异步原子并不负责——它擅长的是「以原子为依赖、天然可组合」的加载场景，更重的缓存策略应该交给专门的请求库。</li>
    </ol>
    <p>
      回到开场那幕：白屏不是 bug，而是组件正确地在「等数据」。只是你忘了给它一个边界。补上 Suspense 之后，同样的代码会先显示「异步 Atom 加载中…」，数据到了再切换到列表——你一个字都没写加载逻辑，它自己就有了。
    </p>
    <div class="lesson-box warn">
      <strong>两条必须记住的边界：</strong>异步原子一旦被读取就会<strong>挂起</strong>，必须配一个 <code>Suspense</code> 边界，否则页面白屏；atom 要<strong>定义在组件外部</strong>，若在渲染中新建，每次渲染都是一个新原子，缓存与去重全部失效，会反复发起请求。
    </div>

    <h2>后备界面的替换</h2>
    <figure class="lesson-figure">
      <figcaption>页面一进来会先显示「异步 Atom 加载中…」，约半秒后课程列表才出现——这就是 Suspense 后备界面被真实内容替换的过程。再点一次「重新读取」，观察它重新挂起又恢复：刷新靠的是把 <code>refreshAtom</code> 加一，让异步原子失效重算。</figcaption>
      <S07JotaiAsyncAtoms />
    </figure>

    <h2>取数与展示分工</h2>
    <p>
      异步原子把「取数据」也做成了一种派生：读取函数返回 Promise，求值时自然挂起，由外层的 Suspense 边界展示后备界面。重新加载不再是手动清缓存，而是改变一个被读取的刷新原子，让依赖图自动把它标为失效、重新执行。加载与失败的展示交给边界，重算的时机交给依赖，组件只需订阅结果。
    </p>
    <div class="lesson-term">
      <span class="term-name">「挂起（suspend）」</span>是 React 的一种渲染约定：组件在渲染期间抛出 Promise，表示「所需数据尚未就绪」，由最近的 <code>Suspense</code> 边界接管并展示 <code>fallback</code>，等 Promise resolve 后 React 再重试渲染。边界：挂起<strong>只在该组件位于 Suspense 边界内时可用</strong>，否则表现为白屏；异步 atom 必须<strong>定义在组件外</strong>才能共享缓存、避免重复请求；Promise 被拒绝时错误会被转交给<strong>错误边界</strong>而非 fallback。
    </div>
  </LessonArticle>
</template>
