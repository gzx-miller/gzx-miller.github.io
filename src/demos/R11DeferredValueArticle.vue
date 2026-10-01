<script setup lang="ts">
import R11DeferredValue from './R11DeferredValue.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>搜索框里连着敲「性能」两个字，光标明明跟得上你的手指，结果列表却慢了半拍——第一个字的结果还没出现，第二个字已经打完了，于是列表干脆停住不动。
    </div>

    <h2>键入与筛选的绑定</h2>
    <p>
      你在做一个按关键词筛选的长列表：输入框是受控的，每次 <code>onChange</code> 都用 <code>setKeyword</code> 更新状态，再拿这个关键词去过滤几百上千条数据。数据少时一切正常，数据一多，问题就冒出来。
    </p>
    <p>
      退一步看，其实你想区分的是两件事：<strong>输入反馈必须立刻响应，而列表结果稍微慢一点完全可以接受</strong>。可默认的心智模型是「所有状态更新一视同仁、一起同步走完」，这会把三笔隐形代价压到你身上：其一，每次按键都触发一次全量重算，你只能眼看着它卡；其二，想缓解就得在自己的业务代码里引入节流或防抖，调度问题被从框架甩回给你；其三，一旦想让列表「慢一点」，输入框会被绑着一起慢，两者分不开。
    </p>
    <p>
      于是问题被逼成一个明确的问句：<strong>当昂贵的结果区域需要重新渲染时，怎么让文本输入始终保持流畅响应？</strong>
    </p>

    <h2>筛选防抖的做法</h2>
    <p>
      最省事的做法是给筛选加一个防抖：输入变化时不立刻重算，而是起一个定时器，例如停手 <code>300ms</code> 之后再执行筛选；期间新的按键就清掉旧定时器重新计时。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认了「输入」和「结果」可以有不同的更新节奏</strong>，把从键入到重算之间的耦合松开了。连续快速输入时，中间那些字符不会各触发一次昂贵计算。
    </p>

    <h2>固定时长的适配缺陷</h2>
    <ul>
      <li>防抖是<strong>固定时长</strong>，和机器快慢无关：快机器 50ms 就能算完，却还要白等 250ms；慢机器 300ms 又根本不够，照样卡。</li>
      <li>连续输入时定时器被反复重置，结果永远贴在「上一次停顿」上，<strong>输入与结果长期不一致</strong>，用户看到的是越来越滞后的列表。</li>
      <li>它丢弃中间值：输入「性能」时只在停顿后跳一次结果，中间过程完全看不到，缺少「正在更新」的反馈。</li>
      <li>手写的定时器还要自己清理：组件卸载、快速连打、路由切换，漏掉一次就是内存泄漏或对已卸载组件的更新。</li>
      <li>更隐蔽的是，一旦顺手把 <code>keyword</code> 本身也一起防抖，<strong>连键入都会失去即时反馈</strong>，输入框开始「吃字」。</li>
    </ul>

    <h2>内置调度的双值拆分</h2>
    <p>
      不推翻「两个节奏」，只是把「手动定时器」换成 React 内建的调度：把关键词拆成两个值——<code>keyword</code> 由受控输入<strong>同步更新</strong>，保证键入即时可见；另一个 <code>deferredKeyword</code> 由 <code>useDeferredValue(keyword)</code> 生成，它允许落后于最新值，并在后台慢慢追赶。列表的筛选只订阅后者。
    </p>
    <ol class="lesson-steps">
      <li>受控输入同步更新 <code>keyword</code>，输入框永远第一时间响应，先于列表提交。</li>
      <li><code>deferredKeyword</code> 落后一步，驱动结果筛选与 <code>useMemo</code> 的重算。</li>
      <li>后台那次渲染<strong>可被新的输入打断并丢弃</strong>，等有闲时再拿最新值从头渲染一次。</li>
      <li>用 <code>isStale = keyword !== deferredKeyword</code> 判断两值是否不一致，给结果区加 <code>aria-busy</code> 并降低透明度，明确告诉用户「正在追上」。</li>
    </ol>
    <p>
      它和防抖的本质差别在于：<strong>不是等固定时长，而是「一有空就往最新值追，被打断就扔掉重来」</strong>。所以它改善的是交互的流畅度，而<strong>不是减少计算量</strong>——同样的筛选仍然会算，只是被安排在了不挡路的时刻。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>不要把控制文本输入的 State 更新放进过渡或延迟里，键入必须同步更新，否则输入框会发木；另外 <code>useDeferredValue</code> 只优化渲染调度，<strong>它不会减少网络请求次数</strong>，请求去重与防抖仍需单独处理。
    </div>
    <p>
      还要记住收益的边界：只有当结果区域的渲染<strong>明显较慢</strong>时它才有价值，几十条数据的小列表用与不用几乎无感；而且旧值与新值不一致的那一小段时间里，界面展示的确实是旧结果，需要靠视觉弱化把这件事说清楚。
    </p>

    <h2>透明度变化与追赶</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里快速敲「状态」或「性能」，观察结果区的透明度先变淡、随后追上最新关键词的过程。</figcaption>
      <R11DeferredValue />
    </figure>

    <h2>紧急与不紧急的分离</h2>
    <p>
      输入卡顿的根源是「紧急的键入」和「不急的结果」被绑在同一个优先级上。<code>useDeferredValue</code> 让结果持有一个会落伍的旧值，把昂贵的重排推到你敲键的间隙里去做，还能被下一次输入打断。它优化的始终是<strong>调度</strong>，而不是工作量本身。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可中断渲染」</span>是 React 并发特性的一种：正在进行中的渲染在更高优先级的更新到来时可以被打断、丢弃，稍后拿最新状态重新开始。<code>useDeferredValue</code> 正是靠它让结果渲染给输入让路。注意它只改变渲染的调度优先级，<strong>不减少组件的工作量，也不减少网络请求</strong>。
    </div>
  </LessonArticle>
</template>
