const e=`<script setup lang="ts">
import R10Memoization from './R10Memoization.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>点「刷新外观」，只不过改了个和列表毫无关系的计数器，可整块课程列表跟着重渲染，渲染次数还往上跳。你给它套上 <code>memo</code> 再点一次——列表居然照旧重渲染。排查半天才发现：父组件每次渲染都新建了一个 <code>onChoose</code> 函数，浅比较永远不相等，memo 形同虚设。
    </div>

    <h2>父渲染引发级联</h2>
    <p>
      React 的默认行为是：<strong>父组件一渲染，它的所有子组件都重新执行</strong>。当父组件里有一点无关的更新（比如只改了主题计数），昂贵子树也会被牵连重算。旧办法要么完全不动、接受重复计算，要么把结果缓存在模块级变量里。
    </p>
    <p>
      隐藏成本很具体：昂贵子树反复渲染会拖慢交互；大数组的筛选、排序每次渲染重算一遍；而用模块级变量缓存结果，不仅多实例会串台，还无法随输入变化而失效。所以要回答的是：<strong>能不能让「输入没变」的那部分工作被跳过，同时不改动程序的正确性？</strong>
    </p>

    <h2>浅比较与跳过渲染</h2>
    <p>
      最朴素的一步：给子组件套上 <code>React.memo</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>当 props 用浅比较判断没有变化时，跳过这个子组件的重渲染</strong>——恰好命中「父组件更新、而子组件输入没变」这个场景。
    </p>

    <h2>新建引用导致失效</h2>
    <ul>
      <li>只要 props 里有「每次渲染新建」的对象、函数或数组，浅比较就永远为 <code>false</code>，<code>memo</code> 完全失效——这正是开场里 <code>onChoose</code> 那个坑。</li>
      <li><code>useMemo</code> 的依赖数组写错（漏了 <code>level</code>），会把过期结果缓存下来：<code>level</code> 变了列表却不更新，界面看起来「卡住了」。</li>
      <li>把不需要记忆化的东西也包一圈，白白多出比较与缓存开销，可读性还下降。</li>
      <li>把 <code>useMemo</code> 当成「保证只在依赖变化时才执行」的正确性工具——React 有权为省内存丢弃缓存重算，它只是性能提示。</li>
    </ul>

    <h2>先测量后缓存次序</h2>
    <p>
      按「先测量、再稳定、后缓存」的因果顺序分三层补上——顺序不能颠倒，否则容易白做。
    </p>
    <ol class="lesson-steps">
      <li>先测量，再动手：用 React DevTools Profiler 录一段交互，确认到底是哪棵子树耗时。没有实测瓶颈就别优化，这一步决定了后面值不值得做。</li>
      <li>第一层，缓存计算用 <code>useMemo</code>：<code>const visibleCourses = useMemo(() =&gt; level === '全部' ? courses : courses.filter(item =&gt; item.level === level), [level])</code>，只在 <code>level</code> 变时重算，与无关的 <code>themeCount</code> 无关。</li>
      <li>第二层，缓存引用用 <code>useCallback</code>：<code>const chooseCourse = useCallback(title =&gt; setChosen(title), [])</code>，让传给列表的 <code>onChoose</code> 引用稳定，浅比较才可能命中。</li>
      <li>第三层，组件级 <code>memo</code>：<code>const CourseList = memo(function CourseList({ items, onChoose }) { /* … */ })</code>。前两层把 props 稳定住，这一层才真正生效——三者是配套的，单用 memo 常常白费。</li>
      <li>验证：点「刷新外观」只改 <code>themeCount</code>，列表渲染次数不再增长，因为 <code>items</code> 与 <code>onChoose</code> 都没变，<code>memo</code> 跳过了它。</li>
      <li>边界：<code>memo</code> 默认只做浅比较，把 props 拆开、传原始值，比传一个打包对象更容易命中；如果去掉记忆化后组件逻辑就不正确，那你要先修的是状态与 Effect 的设计，而不是加缓存。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>别把 memo / useMemo / useCallback 当正确性工具：</strong>它们是优化提示，React 可以为了回收内存丢弃 <code>useMemo</code> 的缓存；任何「必须靠缓存才正确」的写法都是隐患。先有实测瓶颈，再谈记忆化。
    </div>

    <h2>渲染次数停止增长</h2>
    <figure class="lesson-figure">
      <figcaption>先切换一次筛选级别，看列表确实重算；再反复点「刷新外观」——列表渲染次数停在原地，因为 items 和 onChoose 的引用都没变，memo 把这次无关更新挡在了外面。</figcaption>
      <R10Memoization />
    </figure>

    <h2>缓存组件与缓存计算</h2>
    <p>
      <code>memo</code>、<code>useMemo</code>、<code>useCallback</code> 是同一件事的三个层次：缓存组件、缓存计算、缓存引用。它们不改变正确性，只改变「哪些工作被跳过」；而跳过能不能命中，取决于你传下去的引用稳不稳定。顺序永远是先测量、再优化。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅比较（shallow compare）」</span>是 <code>memo</code> 用来判断 props 是否变化的比较方式：只逐层比较每个 prop 的顶层值是否<code>Object.is</code> 相等，不深入嵌套对象内部。边界与例外：只要有一个 prop 是本次渲染新建的对象、函数或数组，浅比较立刻判定「变了」，跳过随之失效——所以稳定引用（用 <code>useMemo</code> / <code>useCallback</code> 缓存，或提升到组件外）才是命中缓存的前提。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
