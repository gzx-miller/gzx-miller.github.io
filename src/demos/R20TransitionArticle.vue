<script setup lang="ts">
import R20Transition from './R20Transition.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在一个有一百多门课程的搜索框里连着敲「并发」两个字，手指明明很快，输入框却像被拖住——第一个字的结果还没渲染完，第二个字已经打上去了，于是框里的字符迟迟不肯出现。
    </div>

    <h2>提出问题</h2>
    <p>
      输入框是受控的，每次 <code>onChange</code> 都用 <code>setKeyword</code> 更新状态，而这个关键词同时驱动两件事：<strong>输入框自己要显示这个值，结果区域要拿它去过滤一百多条数据</strong>。两件事由同一次状态更新引发，也就落在了同一个优先级上，必须一起同步走完——输入框想立刻更新，却被排在它后面的昂贵筛选拖住了。
    </p>
    <p>
      退一步看，你要区分的其实是两种更新：<strong>输入反馈关乎手感，必须立刻；列表结果慢一拍完全可以接受。</strong>可默认模型不区分它们，于是两笔成本压到业务代码上：其一，你没法在框架层面告诉 React「这次更新不重要」，只能眼看着输入被拖慢；其二，想缓解就得自己引入防抖、节流，把调度问题从框架手里接回到自己手里，而这套调度还认不出「谁更紧急」。
    </p>
    <p>
      问题于是明确：<strong>当一次输入会触发昂贵的列表渲染时，怎么让输入框始终保持流畅响应？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的一招是把两件事拆开：输入框的值用一次 <code>setState</code> 同步更新，保证键入即时可见；昂贵的列表筛选则用 <code>setTimeout(() =&gt; setFiltered(...), 0)</code> 推到下一个宏任务，先让浏览器把输入框画出来，再去做重活。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它承认了「输入」和「结果」可以有不同的更新节奏</strong>，并且优先把最小的那一笔（输入框）先提交出去。方向是对的。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>延迟是<strong>固定</strong>的：快机器上一会儿就干完了，却还要白等；慢机器上即使延迟是 0 也照样卡住下一次输入。</li>
      <li>无法被抢占。连打几个字，之前的筛选任务一个个排着队，<strong>新的输入并不能把它们叫停</strong>，结果只会越来越滞后。</li>
      <li>界面不知道「正在进行」：没有内建的状态告诉你筛选还没结束，你只能再手搓一个 loading 布尔值。</li>
      <li>定时器要自己清理：组件卸载、快速连打、路由切换，漏一次就是对已卸载组件更新。</li>
      <li>换成 <code>requestAnimationFrame</code> 也不解决根子——它只是把活挪到某个时机，<strong>并没有区分更新的紧急程度</strong>。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「两个节奏」，而是把「手动延迟」换成 React 内建的优先级调度。React 给出的是 <code>useTransition()</code>，它返回一对值 <code>[isPending, startTransition]</code>。用法是：<strong>把那次昂贵、但不紧急的状态更新包进 <code>startTransition</code> 里</strong>，告诉 React「这次更新可以低优先级、慢慢来」；而文本框自身的状态更新留在外面，保持紧急同步。
    </p>
    <ol class="lesson-steps">
      <li><code>onChange</code> 里同步 <code>setKeyword</code>，键入必须即时可见——这一步<strong>绝不放进 Transition</strong>。</li>
      <li>由关键词推导出的筛选结果照常在渲染阶段计算，结果区域据此展示。</li>
      <li>把驱动结果更新的那次 <code>setState</code> 包进 <code>startTransition</code>，把它标记为<strong>低优先级的过渡更新</strong>。</li>
      <li>一旦有更紧急的更新（比如又一次键入）到来，React 会<strong>中断</strong>过渡更新、优先推进输入，等空闲了再接着算结果。</li>
    </ol>
    <p>
      它和之前那套手写延迟的差别在于：<strong>延迟是死的，优先级是活的</strong>。<code>startTransition</code> 不谈毫秒，只谈紧急程度——紧急的输入一到，正在进行的过渡就让路。而且要记住：过渡更新<strong>可以被中断，却不会被丢弃</strong>，React 保证最终一定会提交出一个一致的状态，你不会看到半成品的结果。
    </p>
    <p>
      顺势还能拿到一个免费的反馈：<code>isPending</code> 会在过渡进行时为 <code>true</code>，拿它给结果区域降低透明度、或把标题换成「正在更新列表…」，用户就知道列表正在追赶，而不是卡死了。
    </p>
    <div class="lesson-box warn">
      <strong>最容易踩反的一处：</strong>控制文本输入的那个 <code>setState</code> <strong>必须保持紧急同步，绝不能包进 <code>startTransition</code></strong>，否则连键入都会失去即时反馈，输入框开始「吃字」——这恰好把要解决的问题反了过来。另外，<code>useDeferredValue</code> 是 <code>useTransition</code> 的声明式替代，适合不需要显式控制触发时机的场景；过渡更新的收益要以实际测量为准，若拆细后反而失去批处理优势，就该回退。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在 150 门课程的搜索框里快速输入：列表标题会临时变成「正在更新列表…」、面板整体变淡，而输入框里的字符始终即时出现，验证紧急输入没有被低优先级的筛选挡住。</figcaption>
      <R20Transition />
    </figure>

    <h2>总结</h2>
    <p>
      <code>useTransition</code> 补上的不是「怎么把活做快」，而是「<strong>哪笔更新更紧急</strong>」：把昂贵而不急的更新交给 <code>startTransition</code>，React 便会在紧急输入到来时中断它、给它让路，事后再把结果补齐。输入保持紧急、结果降级为过渡，界面就流畅了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「过渡更新（Transition）」</span>指通过 <code>startTransition</code> 标记的低优先级状态更新，可被更高优先级的更新（如文本键入）中断并稍后继续；<code>useTransition</code> 返回的 <code>isPending</code> 用于标识它是否仍在进行。边界与例外：控制输入的 <code>setState</code> 必须保持在紧急更新中，不可放进 Transition；过渡更新会被中断但不会被丢弃，最终提交一致状态；它是调度层面的优化，<strong>不减少计算量</strong>，收益需以实测为准，<code>useDeferredValue</code> 是其声明式替代。
    </div>
  </LessonArticle>
</template>
