<script setup lang="ts">
import R14LazySuspense from './R14LazySuspense.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>首页首屏白屏了整整两秒，可那两秒里下载的绝大部分代码，都属于一个只有极少数人才会点开的「学习报告」页面。
    </div>

    <h2>首屏体积与可交互时间</h2>
    <p>
      你的应用里总有一些「重但不常用」的功能：图表编辑器、富文本、数据看板。如果它们和首页一起被打进同一个入口文件，那么<strong>每一个访问首页的人都要为它们买单</strong>——首屏体积变大，可交互时间被整体拖后，而真正需要这个功能的人可能不到百分之一。
    </p>
    <p>
      想让代码晚一点来，就得把这段组件从主包里拆出去，等用到时再拉取。可手动做这件事会带来三笔要人扛的成本：你得自己维护「加载中 / 加载完成 / 加载失败」的状态机；得处理同一组件被多次渲染时重复发起加载的竞态；还得在组件卸载后收拾那些「回来太晚」的 Promise，免得对已卸载组件更新。抽象成一个问句就是：<strong>不常用的大型功能，如何延后加载，并在等待期间给出稳定的反馈？</strong>
    </p>

    <h2>状态驱动动态导入</h2>
    <p>
      最直接的做法：用一个状态存「已加载的组件」，在需要时手动触发加载，用 <code>useEffect</code> 发起 <code>import('./Report')</code>，等 Promise 回来后把拿到的组件塞进状态，再渲染它；加载期间先自己渲染一句「加载中」。
    </p>
    <p>
      这个方案做对了一件事：<strong>它真的把这段代码从主包里拆了出去，只有用到时才去拉取</strong>，首屏不必再为它付出体积代价。当只有一个地方用到、且加载逻辑简单时，这套写法是能跑的。
    </p>

    <h2>三态维护与重复请求</h2>
    <ul>
      <li>三态要自己维护：加载中、成功、失败各写一遍判断，散落在各处，稍有遗漏界面就会停在空白或错误状态。</li>
      <li>组件被反复渲染或重复挂载时，<code>import</code> 可能被触发多次，产生<strong>重复请求</strong>，还得自己加缓存。</li>
      <li>没有统一的等待界面：每个用到它的地方都要重写一份「加载中」，风格与语义（如 <code>role="status"</code>）很难保持一致。</li>
      <li>组件已卸载、Promise 才回来时，往旧状态里写值会触发对已卸载组件的更新警告。</li>
      <li>如果加载的 Promise 永远不返回或直接失败，界面上没有任何兜底，用户只能干等或看到崩溃。</li>
    </ul>

    <h2>加载挂起声明化</h2>
    <p>
      不推翻「按需加载」，而是让 React 内建地认识「一个组件还在加载」这件事。第一步把加载动作声明化：<code>lazy(() =&gt; import('./Report'))</code>。它把加载函数<strong>延后到组件第一次真的需要渲染时才调用</strong>，并把结果缓存下来，避免重复执行。
    </p>
    <p>
      第二步是等待期间的兜底：用 <code>&lt;Suspense&gt;</code> 包住这个懒组件，并给它一个 <code>fallback</code>。于是「组件还没准备好」变成一种框架认识的状态。
    </p>
    <ol class="lesson-steps">
      <li>初始不渲染报告组件，因此 <code>lazy</code> 的加载函数<strong>尚未被调用</strong>。</li>
      <li>点击「查看报告」后首次渲染该组件，React 立刻让最近的 <code>&lt;Suspense&gt;</code> 边界显示 <code>fallback</code>。</li>
      <li>返回的 Promise 解析出带 <code>default</code> 的组件后，React 用真实报告替换掉后备界面。</li>
      <li>在网络面板里可以确认组件代码被拆成了独立 chunk，直到点击那一刻才下载。</li>
    </ol>
    <p>
      这里有一个要精确记住的说法：组件在等待代码时并不是「返回了一个 loading」，而是<strong>「挂起」（suspend）</strong>——它在渲染过程中抛出一个 Promise。React 捕获到这个 Promise，就向上寻找最近的 <code>&lt;Suspense&gt;</code> 边界，显示它的 <code>fallback</code>，等 Promise 完成后重新渲染。实际工程里，<code>lazy</code> 通常和动态 <code>import()</code> 配合，让构建工具据此把它切成一个独立的代码块。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须分清的边界：</strong><code>lazy</code> 的声明要放在<strong>组件外部</strong>，放进组件体内会每次渲染都重建一个新组件，导致它的状态被意外重置；另外 <code>&lt;Suspense&gt;</code> 只捕获渲染期间抛出的 Promise，<strong>不捕获 Effect 或普通事件处理器里的常规数据请求</strong>，那些仍需你自己管加载状态。
    </div>
    <p>
      还有两条收尾的规则：加载的 Promise <strong>被拒绝</strong>时，错误会交给最近的错误边界处理，所以懒组件最好始终待在错误边界的保护范围内；而当页面上有多个 <code>&lt;Suspense&gt;</code> 边界时，可以让不同区域各自展示后备界面，实现<strong>渐进式加载</strong>，而不是整页一起等。
    </p>

    <h2>后备提示与内容替换</h2>
    <figure class="lesson-figure">
      <figcaption>点一下「查看报告」，注意后备提示怎样短暂出现、再被真实报告替换；按钮在加载后会被禁用。</figcaption>
      <R14LazySuspense />
    </figure>

    <h2>取码时机与占位声明</h2>
    <p>
      <code>lazy</code> 把「什么时候去拿这段代码」从你手里接管过来，交给组件第一次渲染的时机；<code>&lt;Suspense&gt;</code> 则把「还没拿到的时候显示什么」变成一句声明。两者合起来，让按需加载不再需要手写状态机，等待期间也始终有一个稳定的界面。
    </p>
    <div class="lesson-term">
      <span class="term-name">「挂起」</span>指组件在<strong>渲染过程中</strong>抛出 Promise，表示「我依赖的代码或数据还没准备好」；React 捕获后向上寻找最近的 <code>&lt;Suspense&gt;</code> 边界显示 <code>fallback</code>，待 Promise 完成再重新渲染。<strong>边界必须记住</strong>：Suspense 只处理渲染期间抛出的 Promise，不捕获 Effect 或事件处理器里的异步请求；Promise 被拒绝时走的是错误边界，不是 Suspense。
    </div>
  </LessonArticle>
</template>
