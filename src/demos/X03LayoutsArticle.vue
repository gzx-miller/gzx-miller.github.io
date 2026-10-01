<script setup lang="ts">
import X03Layouts from './X03Layouts.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>在后台的侧边栏输入框里敲了半句话，切到另一个子页面再切回来，输入的内容居然没了——明明两次渲染的是同一个 <code>layout.tsx</code>，为什么状态会被清空？
    </div>

    <h2>持久外壳与状态</h2>
    <p>
      后台站点总有一些 UI 是「一直待在屏幕上」的：顶部导航、侧边栏菜单、底部版权。它们不该在每次点链接时闪烁重画一遍，更不该丢掉自己的状态。可同时也存在另一类需求：某些页面希望<strong>每次进入都重新开始</strong>——比如文章页的「本次阅读计数」、进入动画、或者需要在挂载时重新执行的副作用。
    </p>
    <p>
      这就引出一个必须想清楚的问题：当用户从 <code>/dashboard/orders</code> 跳到 <code>/dashboard/settings</code> 时，<strong>哪些部分应该原封不动地留着，哪些部分应该推倒重来？</strong>如果只有一种「共享外壳」的概念，这两类需求就会打架，你要么到处丢状态，要么该重置的偏不重置。
    </p>

    <h2>逐页手动引入</h2>
    <p>
      最朴素的做法，是把共享外壳当成普通组件，在每个页面里手动引入并包一层：<code>app/dashboard/orders/page.tsx</code> 里自己 import 侧边栏，再套住自己的内容。这做对了一件事——<strong>共享 UI 确实被复用起来了</strong>，你只写一份侧边栏代码。
    </p>
    <p>
      但它把「复用」和「生命周期」混为一谈：虽然每个页面用的都是同一个侧边栏组件，可它们各自渲染各自的一份实例。于是每次导航都等于旧的卸载、新的挂载，状态自然保不住。
    </p>

    <h2>重复引入成本</h2>
    <ul>
      <li>每个页面都要手动拼一遍外壳，页面一多就到处是重复的 import 与包裹。</li>
      <li>共享组件是按页面各自实例化的，导航时状态被重置，侧边栏里的输入、展开项、滚动位置全丢。</li>
      <li>没有「哪些页面归同一套外壳」的天然边界，靠人记，容易漏。</li>
      <li>需要「每次进入都重置」的场景没有专门位置，只能硬塞进页面组件里。</li>
    </ul>

    <h2>布局提升为约定</h2>
    <p>
      不推翻「共享外壳」，而是把它提升为目录级约定：在目录里放一个 <code>layout.tsx</code>，它自动包裹该目录及所有子目录下的页面，子页面通过 <code>children</code> 嵌进来。这样一来，「哪些页面共享同一外壳」由目录结构决定，而不是靠每个页面自觉引入。
    </p>
    <p>
      关键变化在于<strong>挂载时机</strong>：<code>layout</code> 在导航时<strong>保持挂载、不重新创建实例</strong>，所以它用 <code>useState</code> 存的状态会跨页面保留。这正是侧边栏输入框不再丢字的根本原因。而根布局 <code>app/layout.tsx</code> 是最外层，必须包含 <code>&lt;html&gt;</code> 和 <code>&lt;body&gt;</code>，全站字体与全局样式都在这里引入。
    </p>
    <p>
      布局是<strong>层层嵌套</strong>的：根布局在最外，<code>app/dashboard/layout.tsx</code> 嵌在它里面，dashboard 的页面又嵌在 dashboard 布局里。导航到 dashboard 的子页面时，只要路径仍在 <code>/dashboard</code> 之下，dashboard 布局就持续存在，只有 <code>children</code> 那部分在换。
    </p>
    <p>
      那么「每次进入都重置」该放哪？答案是 <code>template.tsx</code>：它的位置和用法跟布局一样，区别在于<strong>每次导航都会重新创建一个新实例</strong>，状态随之重置。于是判断标准变得很清晰：
    </p>
    <table>
      <thead>
        <tr><th>对比项</th><th><code>layout.tsx</code></th><th><code>template.tsx</code></th></tr>
      </thead>
      <tbody>
        <tr><td>导航时是否重新挂载</td><td>否，保持挂载</td><td>是，重新创建</td></tr>
        <tr><td>组件状态</td><td>保留</td><td>重置</td></tr>
        <tr><td>典型适用</td><td>顶部导航、侧边栏、底部等持久 UI</td><td>进入动画、每次都要重跑的副作用</td></tr>
      </tbody>
    </table>
    <p>
      还有一招值得记住：<strong>路由组可以各自定义布局</strong>，从而让「同一站点的不同路径区间」套上完全不同的外壳。例如 <code>app/(marketing)/layout.tsx</code> 给营销页配一套轻导航，<code>app/(dashboard)/layout.tsx</code> 给后台配一套侧边栏，URL 里却不出现分组名。
    </p>
    <div class="lesson-box warn">
      <strong>一个常被忽略的坑：</strong>不要把「需要按页面重新执行的数据请求」放进 <code>layout.tsx</code>。因为布局在导航时不重新挂载，里面的请求只会在首次加载时跑一次，之后切页面拿到的是旧数据。这类逻辑应该放到 <code>page</code> 或 <code>template</code> 里，让它在该刷新的时候刷新。
    </div>

    <h2>模板与布局状态</h2>
    <figure class="lesson-figure">
      <figcaption>切换子页面，观察持久布局里的状态与模板里的状态各自会怎样变化。</figcaption>
      <X03Layouts />
    </figure>

    <h2>挂载保持与重建</h2>
    <p>
      布局与模板这一课，核心是把「共享外壳」拆成两种生命周期：<code>layout</code> 保持挂载、状态跨导航保留，适合持久 UI；<code>template</code> 每次导航重建、状态重置，适合需要重跑的场合。布局按目录层层嵌套，路由组则让不同路径区间各用一套外壳。
    </p>
    <div class="lesson-term">
      <span class="term-name">「布局与模板」</span>都是目录级的包裹组件，用 <code>children</code> 嵌住子页面。区别在于生命周期：<code>layout.tsx</code> 导航时<strong>保持挂载</strong>，<code>useState</code> 等状态会保留，适合头部、侧边栏等持久 UI；<code>template.tsx</code> 每次导航<strong>重新创建实例</strong>，状态重置，适合进入动画或每次都要重跑的副作用。根布局必须含 <code>&lt;html&gt;</code> 与 <code>&lt;body&gt;</code>，且不要在布局里放需要按页面重跑的数据请求。
    </div>
  </LessonArticle>
</template>
