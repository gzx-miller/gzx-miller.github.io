const n=`<script setup lang="ts">
import K19Suspense from './K19Suspense.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程详情页里有一块偏重、还要请求数据的学习报告，我想让它用到再加载，可每个异步组件都得自己写一遍 loading 分支——有没有办法在模板层面直接声明「这块内容在等，先显示什么」？
    </div>

    <h2>重模块按需加载</h2>
    <p>
      你在做课程详情页：顶部是标题和简介，下面挂着一块「学习报告」，里面有图表、有统计，体积明显比别的模块大，而且内容还要靠一次接口请求才能拿到。你不想让这块重内容拖慢首屏，别的页面也不该白白把它加载进来，于是决定「拆开、用到再拿」。
    </p>
    <p>
      麻烦在于：拆分之后，组件就多出一个「还没到」的时间段。这段时间里页面显示什么？谁来保证加载完成后能自动换成真正的内容？如果每个异步模块都各写各的，页面很快就会被一堆零散的加载判断填满。
    </p>

    <h2>异步组件按需加载</h2>
    <p>
      最直接的做法有两步：用 <code>defineAsyncComponent</code> 把组件包一层，让它变成按需加载；再在父组件里加一个 <code>loading</code> 布尔，配合 <code>v-if</code> 与 <code>v-else</code> 决定显示占位还是真实内容。
    </p>
    <p>
      这个做法做对了最关键的一点：<strong>它把「大组件」和「首屏」解耦了</strong>。组件被拆成独立 chunk，只有真正需要时才发起请求，首屏不必为它买单。同时它也承认了「加载中」是一个必须被表达的状态，而不是可以忽略的空白。
    </p>

    <h2>加载判断重复堆叠</h2>
    <ul>
      <li>每个异步组件都要在父级重复一份 <code>loading</code> 判断，模块一多，状态变量和分支就成倍增长。</li>
      <li>组件内部还是一个 <code>async setup</code>，取数据也要时间，父组件却只知道「组件到了没」，管不了「数据到了没」。</li>
      <li>页面上同时挂多个异步模块时，各自的占位会此起彼伏地闪烁，视觉上非常碎。</li>
      <li>「等待」这件事被拆散在组件模板里，没有一个统一的、可声明的异步边界来描述它。</li>
    </ul>

    <h2>等待状态提升到模板</h2>
    <p>
      不推翻「按需加载」，而是把「等待」从组件内部提升到模板层面。<code>defineAsyncComponent</code> 依然负责把组件拆成独立 chunk 按需加载；新引入的 <code>&lt;Suspense&gt;</code> 负责另一件事：<strong>它会等待其异步依赖全部落定</strong>——既包括异步组件本身，也包括组件里的 <code>async setup</code>——等待期间渲染 <code>fallback</code> 插槽，落定后再切换到真实内容。
    </p>
    <p>
      用法很直接：用一层 <code>&lt;Suspense&gt;</code> 包住目标组件，默认插槽写真实内容，<code>fallback</code> 插槽写占位。
    </p>
    <ol class="lesson-steps">
      <li><code>defineAsyncComponent</code> 返回一个延迟解析的组件，用到时才去取对应 chunk。</li>
      <li><code>&lt;Suspense&gt;</code> 捕获异步等待阶段，展示 <code>fallback</code> 插槽内容。</li>
      <li>组件解析完成、且内部 <code>async setup</code> 也落定后，占位被替换为真实学习报告。</li>
      <li>用网络面板查看组件 chunk 的按需加载请求与解析时机。</li>
    </ol>
    <p>
      这样一来，「加载中」不再散落在每个组件里，而是被收敛成一处<strong>可声明的异步边界</strong>：谁包在 <code>&lt;Suspense&gt;</code> 里，谁就共享同一套等待与切换逻辑。它还能同时等待多个 <code>async setup</code> 与异步组件，<strong>只要其中任何一个尚未落定，就保持 <code>fallback</code></strong>，直到全部就绪才一次性切换过去。
    </p>
    <p>
      再往深想一层：为什么要把等待放在模板层，而不是继续放在组件里？因为<strong>「异步」本质上是一个跨组件的协作问题</strong>。学习报告依赖数据，数据依赖接口，任何一层没就绪，都不该让用户看到半成品。如果等待逻辑写在组件内部，父级就永远无法知道「什么时候才算真正准备好」；把它提到模板层，等于把「准备好的标准」交给使用方来定义——你要等谁、等的时候看什么，都由这层边界统一拍板。
    </p>
    <div class="lesson-box warn">
      <strong>边界要拿捏：</strong>异步边界过细，会把页面切得七零八落，增加维护复杂度；过粗，又会把不该等的内容一起拖住，让用户长时间只看到占位。<strong>关键首屏内容不宜全部异步化</strong>，应优先保证首屏可见，把异步边界留给真正偏重、且非首屏的模块。此外，异步加载失败时必须有错误兜底，本课聚焦的是成功路径与等待态。
    </div>

    <h2>占位替换与刷新</h2>
    <figure class="lesson-figure">
      <figcaption>刷新页面，看 fallback 占位如何先出现，再被异步学习报告替换掉。</figcaption>
      <K19Suspense />
    </figure>

    <h2>拆分与等待分工</h2>
    <p>
      Suspense 与异步组件解决的是同一件事的两面：<code>defineAsyncComponent</code> 决定「什么时候去拿」，<code>&lt;Suspense&gt;</code> 决定「还没拿到时显示什么」。把加载态从组件内部手写的 <code>loading</code> 分支，提升为模板层面可声明的异步边界，等待逻辑就只写一次，页面也不会再各个模块各自闪烁。
    </p>
    <div class="lesson-term">
      <span class="term-name">「异步边界」</span>指由 <code>&lt;Suspense&gt;</code> 划定的等待范围：它会等待其内所有异步依赖（异步组件与 <code>async setup</code>）全部落定，期间渲染 <code>fallback</code>，全部就绪后统一切换到真实内容。它的价值在于把「加载中」从零散的组件内分支，收敛为模板层面可声明、可复用的等待逻辑。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
