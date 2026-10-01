<script setup lang="ts">
import R19Composition from './R19Composition.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你封装了一个漂亮的「面板」外壳，在课程页里用了三处：一处放说明文字、一处放两个按钮、一处放一排统计卡片。结果是同一个外壳被你复制了三份，只因为里面的内容不一样——明明长得一模一样的东西，为什么复用不了？
    </div>

    <h2>外壳与内容的分离</h2>
    <p>
      这三处的差别其实很清楚：<strong>外壳（边框、标题、间距）完全相同，内容各不相同</strong>。在面向对象的世界里，你会想到用继承去复用这个外壳；可 React 的组件之间靠的是属性传递，没有「继承一个组件再覆盖它的 render」这套接口。于是「怎么让一个组件把外壳留下来、把内容交出去」就成了必须解决的问题。
    </p>
    <p>
      旧办法有三笔隐藏成本。第一，把某种内容写死进组件里，换一处用途就只能复制一份，样式一改要改好几遍。第二，想用一个组件覆盖所有内容形态，就得不停地加布尔 prop 区分分支——今天 <code>showButtons</code>、明天 <code>showStats</code>，组件很快膨胀成一张条件表。第三，如果内容需要用到容器内部的数据，这层数据还得一层层透传下去，中间每一层都被迫认识自己根本用不到的东西。
    </p>
    <p>
      问题于是收敛成一句：<strong>如何让容器只负责结构与布局，而内容完全由调用方决定？</strong>
    </p>

    <h2>内容属性传参的做法</h2>
    <p>
      最省事的一步是给容器加几个内容 prop，比如 <code>&lt;Panel title="秋季特惠" body="所有课程限时八折" /&gt;</code>，让标题和正文都由调用方传进来。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它第一次把「外壳」和「内容」拆开了</strong>——容器不再假设自己装的是什么，谁调用谁负责给文字。对纯文本内容，这样就够了。
    </p>

    <h2>结构型内容的限制</h2>
    <ul>
      <li>内容一旦是<strong>结构</strong>而不是字符串——两个按钮、一行可点击的课程卡片、一段带条件渲染的列表——<code>body</code> 这种字符串 prop 根本装不下。</li>
      <li>为了兼顾各种内容，容器会不断新增布尔 prop，形如 <code>{hasButtons &amp;&amp; ...}{hasStats &amp;&amp; ...}</code>，容器被迫认识所有调用方的细节。</li>
      <li>若内容需要容器内部算出的数据（比如统计项），用普通 prop 无法把数据「反向」交给内容，只能再补一个回调，接口越描越复杂。</li>
      <li>层层嵌套时，中间组件为了把内容传到底部，硬生生多出好几个用不到的透传 prop。</li>
    </ul>

    <h2>子元素插槽的接入</h2>
    <p>
      先补上最直接的一层组合：<strong><code>children</code> 插槽</strong>。父组件写在容器标签里的所有子元素，会作为 <code>props.children</code> 被容器接收，再摆到它留好的位置：<code>&lt;Card&gt;...任意内容...&lt;/Card&gt;</code>。容器只管在哪个位置放，至于放进去的是文字、按钮还是列表，它一无所知。这一层就足以解决「外壳相同、内容各异」的大多数场景。
    </p>
    <p>
      再补上「内容需要用到容器数据」这一层。当渲染内容依赖容器提供的数据或状态、而调用方又想保留决定权时，就用一个<strong>函数类型的 prop</strong>——也就是 <strong>render props</strong>：容器把数据当作参数去调这个函数，函数返回要渲染的元素。像 <code>renderStats={() =&gt; [...]}</code> 这样，统计面板把统计项交给调用方，由调用方决定用哪些指标、怎么排版。于是容器彻底与具体数据解耦：<strong>它只负责结构，内容和数据都由调用方提供</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>一个性能细节：</strong>render props 函数不要在父组件渲染时<strong>每次新建</strong>，否则每次渲染都是一个新函数，会连累接收它的子组件的 <code>memo</code> 判断——它以为 prop 变了，只好重渲染。这类场景可以用 <code>useCallback</code> 稳定引用。另外要认识到：多数「状态逻辑复用」的需求如今已由自定义 Hook 解决，render props 的适用面相应收窄，不必逢事就用。
    </div>

    <h2>数据回传与外部渲染</h2>
    <figure class="lesson-figure">
      <figcaption>点「新增报名」「完成课程」，看统计面板如何通过 render props 拿到容器里的数据、再由调用方渲染出在学人数与完成率；同时留意上半部分 Card 用同一个外壳分别装下了说明文字和操作按钮。</figcaption>
      <R19Composition />
    </figure>

    <h2>组合优先于继承</h2>
    <p>
      组件复用的路子不是继承，而是组合。<code>children</code> 让容器把「放什么」交给父组件，render props 让容器把「数据怎么渲染」也交给父组件；两者都把复用点落在<strong>外壳</strong>上，把可变点让给调用方。容器越是不认识内容，它就越能被用在你当初没想到的地方。
    </p>
    <div class="lesson-term">
      <span class="term-name">「render props」</span>指把「渲染哪些内容」交给一个函数类型的 prop：容器调用该函数并把内部数据作为参数传入，由调用方返回要渲染的元素，从而在复用外壳的同时让调用方掌握内容与数据。边界与例外：简单插槽用 <code>children</code> 即可，渲染依赖容器状态时才用 render props；函数型 prop 应保持引用稳定（配合 <code>useCallback</code>），否则会破坏子组件的 <code>memo</code> 判断；多数状态逻辑复用场景已被自定义 Hook 替代。
    </div>
  </LessonArticle>
</template>
