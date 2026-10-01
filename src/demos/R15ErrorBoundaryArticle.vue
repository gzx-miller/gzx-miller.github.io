<script setup lang="ts">
import R15ErrorBoundary from './R15ErrorBoundary.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程列表里有一张卡片的数据少了一个字段，渲染时读它的属性抛了错——结果不是那一张卡片出问题，而是<strong>整个页面瞬间变白</strong>，连顶部导航都没了。
    </div>

    <h2>整树卸载的连锁反应</h2>
    <p>
      这是 React 一个容易让人愣住的行为：<strong>渲染期间抛出的错误若无人接管，React 会把整棵组件树卸载掉</strong>。可现实里，一颗坏掉的数据只属于一张卡片，用户却因此失去了整个界面。你想做的其实很朴素——「让坏掉的那一块单独降级，其他部分照常可用」。
    </p>
    <p>
      想靠 <code>try/catch</code> 兜住它，方向并不对：渲染是由 React 在内部调度的，子组件的 <code>render</code> 并不受你外层代码的控制，你没法用一个 <code>try</code> 把别人的渲染包起来。退而求其次用 <code>window.onerror</code> 全局兜底，粒度又太粗——它只能告诉你「出错了」，既拦不住 React 卸载树，也没有地方让你渲染一块局部降级界面。抽象成一个问句就是：<strong>局部组件渲染失败时，如何避免整个 React 根节点失去界面？</strong>
    </p>

    <h2>渲染前的数据防御</h2>
    <p>
      最朴素但真的能跑的做法是<strong>数据防御</strong>：在渲染之前先把数据检查一遍，读字段前判空，缺失就渲染一句「暂无数据」，把可能出错的输入挡在渲染之外。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认「坏数据不该直接进入渲染」</strong>，对自己能预见的字段缺失确实有效，改动也小。当组件树简单、错误来源都在你掌控之内时，它能消除相当一部分崩溃。
    </p>

    <h2>数据防御的覆盖盲区</h2>
    <ul>
      <li>它只能防<strong>你能预见</strong>的字段。第三方组件内部、深层子组件里那些你没写的代码，一旦抛错就完全兜不住。</li>
      <li>检查逻辑会蔓延到每个消费数据的地方，越写越重，还是免不了遗漏。</li>
      <li>它拦不住<strong>已经发生的渲染错误</strong>：只要有一处漏网，整棵根树依旧会被卸载，页面照样白屏。</li>
      <li>即使检查通过了，业务规则上的「不该出现」也未必是数据问题——你想表达的是「这块坏了」，而不是「数据空」。</li>
      <li>它提供不了统一的降级界面，也无处安放错误上报，出问题了只能靠用户截图。</li>
    </ul>

    <h2>错误边界的兜底机制</h2>
    <p>
      不推翻「提前防御」，而是在它够不到的地方补一层真正的机制：<strong>错误边界</strong>。它必须用一个类组件实现，因为要用到两个当时只有类才有的钩子。
    </p>
    <ol class="lesson-steps">
      <li>点击「模拟卡片故障」，让课程卡片在<strong>下一次渲染</strong>中抛出错误。</li>
      <li>错误边界捕获到子树里的渲染错误，用 <code>static getDerivedStateFromError</code> 把状态切到失败，改为渲染局部降级内容，其余页面保持可用。</li>
      <li>「重试」按钮先重置触发故障的那个状态，再清除边界自己的失败标记，让子树重新渲染并恢复。</li>
      <li>故意在<strong>事件处理器</strong>里抛错，会发现边界抓不到它，只能用 <code>try/catch</code> 单独兜底。</li>
    </ol>
    <p>
      两个钩子分工明确：<code>static getDerivedStateFromError</code> 只负责<strong>在渲染出错时切换后备界面</strong>，它必须是静态的、纯的，不能有副作用；<code>componentDidCatch</code> 则在提交阶段拿到错误与组件栈，用来<strong>记录错误信息</strong>——接监控上报就写在这里。
    </p>
    <div class="lesson-box warn">
      <strong>边界到底在哪里——这是最容易记错的一点：</strong>错误边界<strong>只捕获子树的渲染期错误</strong>。它捕获不到自己抛出的错误、普通事件处理器里的错误、服务端渲染的错误，以及大多数异步回调里的错误。事件处理器里的问题，请用 <code>try/catch</code> 配一个错误状态来处理，别指望边界替你接住。
    </div>
    <p>
      落地上还有两条讲究：边界应当<strong>按功能区域布置</strong>——一颗坏卡片只影响它所在的那块，全站一个边界等于没有隔离，但细到每个小组件又会让代码难以维护；另外 <code>componentDidCatch</code> 里的上报要注意<strong>不要记录敏感用户数据</strong>，而恢复路径也必须是明确的，比如那个「重试」按钮，别让用户被困在降级界面里出不来。
    </p>

    <h2>局部降级与重试</h2>
    <figure class="lesson-figure">
      <figcaption>点「模拟卡片故障」，看卡片区域怎样单独降级、页面其余部分是否照常；再点「重试」把它救回来。</figcaption>
      <R15ErrorBoundary />
    </figure>

    <h2>区域化的兜底布局</h2>
    <p>
      渲染期的错误如果不能被局部接管，代价就是整棵树的卸载。错误边界把「出错之后显示什么」从全局兜底变成了一块可以按区域布置的能力，让一处故障只是一处故障。但要记牢它的半径：只有子树的渲染错误归它管，事件与异步的错误得你自己兜。
    </p>
    <div class="lesson-term">
      <span class="term-name">「优雅降级」</span>指局部功能失败时，用一个能力受限但<strong>仍然可用</strong>的后备界面替代它，而不是让整块功能甚至整个页面消失。错误边界是它在 React 渲染层的实现：<code>getDerivedStateFromError</code> 切换降级界面，<code>componentDidCatch</code> 上报错误。<strong>注意边界</strong>：它只对子树渲染期错误生效，事件处理器与异步回调中的错误需要用 <code>try/catch</code> 另行处理。
    </div>
  </LessonArticle>
</template>
