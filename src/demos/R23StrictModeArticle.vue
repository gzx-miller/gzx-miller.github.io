<script setup lang="ts">
import R23StrictMode from './R23StrictMode.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个最普通的计数器组件，Effect 里只干一件事：把「执行」或「清理」记进日志。组件刚挂载、你还没点任何按钮，日志里就已经排着三条——「Effect 执行（count=0）」「Effect 清理」「Effect 执行（count=0）」。界面一切正常，你也从没写过任何「跑两遍」的代码。到底是谁，把同一个 Effect 执行了两次？
    </div>

    <h2>提出问题</h2>
    <p>
      有些 bug 天生难缠，因为它们只在特定路径上才会现形：Effect 忘记返回清理函数，你本地跑一遍、组件只挂载一次，看不出问题；渲染函数里不小心写了副作用（比如直接改一个外部变量），单跑一次结果也是对的；订阅、计时器漏了拆除，功能照样能用。这些代码在评审时常常「看着没问题」，等到线上被反复挂载、卸载、更新时才开始出错。
    </p>
    <p>
      旧办法都得靠人主动盯：<strong>寄希望于代码评审</strong>，人会累会漏；<strong>靠上线后看日志、看用户反馈</strong>，等发现时已经付出代价；<strong>自己手写「执行两遍」的测试脚手架</strong>，又重又容易漏掉真正的路径。共同的问题是：检查的力度取决于某个人的自觉，而不是机制。
    </p>
    <p>
      所以要回答的是：<strong>能不能让框架自己，在开发阶段就把「多跑一遍」塞进那些容易出错的路径，把不纯的渲染和漏掉的清理当场逼出来？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：用 <code>&lt;React.StrictMode&gt;</code> 把应用树包起来——<code>&lt;StrictMode&gt;&lt;App /&gt;&lt;/StrictMode&gt;</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给「开发阶段」单独加了一层额外检查</strong>。它本身不渲染任何可见内容，也不会改变生产环境的行为；它做的是让某些函数在开发构建里<strong>多执行一次</strong>，从而把你平时看不见的问题放大出来。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>只把它包上去，界面不会有任何可见变化——它不是 UI 组件，你不去读日志、观察副作用，根本不知道它在不在工作。</li>
      <li>「多跑一次」只覆盖开发构建：它不会替你在生产环境兜底，也不能当成对运行行为的一种保证。</li>
      <li>它只会<strong>放大问题</strong>，不会<strong>修问题</strong>：清理没写对的组件，在双重执行下会真的多出一个订阅、多起一个计时器，看起来像冒出个新 bug。</li>
      <li>最大的误区是<strong>为了消掉重复执行而把 StrictMode 删掉</strong>：那等于拆掉开发期的报警器，把问题留到线上去炸。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先把「多执行一次」的<strong>范围</strong>说准，再谈怎么用它。StrictMode 在开发构建下会让这几处各额外执行一次：
    </p>
    <ol class="lesson-steps">
      <li><strong>组件函数体</strong>——整个渲染逻辑跑第二遍，用来暴露不纯的渲染（比如渲染中改了外部变量、或读了会变的东西）。</li>
      <li><strong><code>useState</code> 的初始化函数</strong>与 <strong>reducer</strong>——验证它们是否真的无副作用、可以安全地重复计算。</li>
      <li><strong>Effect 的 setup 与 cleanup</strong>——挂载时执行的顺序是 <code>setup → cleanup → setup</code>，中间那次 cleanup 是「模拟卸载」，用来检验你写的清理是否完整对称。</li>
    </ol>
    <p>
      拿开场那份日志对照就通了：那三条 <code>执行 → 清理 → 执行</code> 不是业务逻辑跑了两遍，而是 React 在开发环境刻意把 Effect 拆开又接上，专门看你的清理函数写得对不对。演示里点「关闭 StrictMode」，日志立刻只剩一条「执行」，恰好和生产环境一致——这也说明双重调用<strong>只属于开发阶段</strong>。
    </p>
    <p>
      所以正确的用法不是消除重复，而是<strong>让重复执行也不出问题</strong>：清理函数与 setup 严格对称（建了监听就拆监听、起了计时器就清计时器），渲染函数保持纯（只在渲染里算，不在渲染里改外部世界），初始化保持可重复且廉价（把重活挪出 <code>useState</code> 的初始化函数，或改成惰性求值）。改完这些，日志里的双重执行会照旧出现，但副作用不再累积——这才是它想教给你的。
    </p>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>看到 Effect 在开发里重复执行，先别怀疑 React——这恰恰说明它在替你验证清理逻辑，要去看<strong>清理函数是否对称</strong>，而不是想办法按掉它。另外，依赖「副作用执行顺序」才能成立的代码（比如 A 的 Effect 一定晚于 B）本身就是设计问题，StrictMode 会把它暴露出来；正确做法是靠数据流或显式依赖表达先后，而不是靠副作用碰巧的时序。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>先别点按钮，直接看挂载时就排好的日志：开启 StrictMode 时是「执行 → 清理 → 执行」，拨一下开关关掉后只剩一条「执行」；再点几次计数，分辨哪些日志是业务更新、哪一条是开发环境额外加的检查。</figcaption>
      <R23StrictMode />
    </figure>

    <h2>总结</h2>
    <p>
      StrictMode 是开发阶段的一面照妖镜：它不渲染任何东西，只是让渲染、初始化与 Effect 多跑一遍，把不纯的渲染和漏写的清理当场逼出来。看到它重复执行时，正确反应是去把清理写对、把渲染写纯，而不是把它关掉。
    </p>
    <div class="lesson-term">
      <span class="term-name">「StrictMode（严格模式）」</span>是 React 提供的<strong>仅开发环境</strong>检查工具，包裹应用树后不渲染任何可见内容，而是让组件函数体、<code>useState</code> 初始化函数、reducer 以及 Effect 的 setup / cleanup 各额外执行一次（挂载时为 <code>setup → cleanup → setup</code>），以暴露不纯渲染、缺少清理的订阅和不合规的 ref 用法。边界：双重调用只发生在开发构建，生产环境不受影响；它只负责放大问题、不负责修复，因此不应为消除重复而移除它，而应修复被它指出的根本代码。
    </div>
  </LessonArticle>
</template>
