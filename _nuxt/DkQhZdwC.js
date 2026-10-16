const n=`<script setup lang="ts">
import R01ComponentProps from './R01ComponentProps.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在课程卡片组件里写下 <code>seats = seats - 1</code>，想把剩余名额扣掉一个，结果界面纹丝不动——没有报错，值也没变，就像这行代码从未存在过。它去哪了？
    </div>

    <h2>重复结构组件化</h2>
    <p>
      你手上有一个课程列表，每一行都是「标题 · 级别 · 剩余名额 + 报名徽章」这同一套结构，只有数据不同。最直接的做法是把整段结构复制四份，把文字换一换。可一旦产品要求给徽章换个颜色，你就得挨个改四遍；四份代码还会慢慢漂移，改漏一处，页面上就出现两个风格不一致的卡片。
    </p>
    <p>
      换成在 JavaScript 里拼字符串再塞进 <code>innerHTML</code> 呢？重复是消掉了，但你换来了三笔必须由人扛的账：<strong>拼出来的字符串没法单独测试</strong>，一个引号写错整块界面就塌；<strong>数据从哪来、谁有权改，没有一处说得清</strong>；<strong>某个卡片要单独更新时，你只能整块重拼</strong>。
    </p>
    <p>
      真正的问题浮出来了：怎么把「一套结构」和「一份数据」拆开，让同一段界面能被反复使用，同时保证数据只有一个来源、子组件只负责显示？换来的是——谁碰数据、谁显示数据，必须有一道清楚的边界。
    </p>

    <h2>函数组件参数化</h2>
    <p>
      最小的一步：把这块界面写成一个<strong>接收参数、返回界面描述的函数</strong>，再把数据当参数喂进去。一个函数只描述「一张卡片长什么样」：
    </p>
    <p>
      <code>function CourseCard({ title, level, seats }) { ... }</code>。父组件持有一个数组，用 <code>map</code> 把它展开成多张卡片：<code>courses.map((course) =&gt; &lt;CourseCard {...course} /&gt;)</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>结构和数据彻底分了家</strong>。结构只写一遍，数据换了卡片就换了；再加一门课，只是往数组里多塞一个对象。React 把这种「返回界面描述的函数」叫<strong>组件</strong>，传给它的那组参数叫 <strong>props</strong>。
    </p>

    <h2>组件名大写约定</h2>
    <ul>
      <li>组件名写成了小写开头的 <code>courseCard</code>，React 会把它当成一个原生 HTML 标签，页面上什么都不显示——组件名必须以大写字母开头。</li>
      <li>在子组件里直接写 <code>seats = seats - 1</code>，界面不变：props 是调用时传进来的一次性输入快照，不是一块共享的可写变量。</li>
      <li>如果换成改对象本身——比如让所有卡片共用同一个对象引用再就地改——改一张卡片会连带影响另一张，数据的来源瞬间失控。</li>
      <li>就算子组件真的把值改了，父组件也毫不知情：谁负责「数据变化」这件事，在当前写法里根本没有指定给任何人。</li>
    </ul>

    <h2>属性只读与单向流</h2>
    <p>
      不推翻「函数组件」，而是给它立一条纪律：<strong>数据单向往一个方向流——从父组件通过 props 传给子组件，props 只读</strong>。父组件持有数据，子组件只读渲染；子组件想表达「我要改」，不是自己动手改，而是把这件事交回给数据的持有者。整条挂载与数据流动的链路是这样的。
    </p>
    <ol class="lesson-steps">
      <li><code>createRoot</code> 先拿到页面上那个 <code>#root</code> 容器，作为整棵组件树的落点。</li>
      <li><code>render(&lt;App /&gt;)</code> 把根组件挂载进去，React 开始向下渲染。</li>
      <li><code>App</code> 用一个数组 <code>courses</code> 配合 <code>map</code>，把每一项展开成一张 <code>&lt;CourseCard ... /&gt;</code>。</li>
      <li><code>CourseCard</code> 通过 props 读到 <code>title</code> / <code>level</code> / <code>seats</code>，把名称、级别、剩余名额和报名徽章渲染出来——它只读，不写。</li>
    </ol>
    <p>
      到了这一步，你可以对照组件树看清一件关键的事：<strong>子组件接收到的 props，恰好只有它渲染需要的那几个值</strong>，没有多余的、更没有可以回写父组件的通道。数据要变怎么办？把它提升到最近的公共父组件，由那个父组件持有，再用 props 发下去——「提升状态」的做法，正是这条只读纪律的自然结果。
    </p>
    <div class="lesson-box warn">
      <strong>三个常见坑：</strong>组件名首字母小写会被当成原生标签，界面直接空白；props 是只读快照，就地修改既不生效也不会给出提示；真正需要在运行时变化的数据不该藏在子组件的局部变量里，而应提升为持有者的状态，再向下传递。
    </div>

    <h2>不同参数渲染对比</h2>
    <figure class="lesson-figure">
      <figcaption>看父组件用数组 <code>map</code> 展开出的两张课程卡片——同一份 <code>CourseCard</code> 组件，喂进不同 props，就得到不同的名称、级别与报名徽章。</figcaption>
      <R01ComponentProps />
    </figure>

    <h2>只读输入与状态归属</h2>
    <p>
      组件就是一段「接收 props、返回界面描述」的可复用结构，props 则是父组件发给子组件的<strong>只读输入</strong>，单向向下流动。想改数据，就回到持有数据的那一层去改，再让新的 props 重新流下来——界面的每个显示值，都能顺着这条链一路追溯到唯一的来源。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Props（属性）」</span>是父组件传给子组件的一组只读输入，是单向下行的数据流，子组件不能就地修改它。它与「状态」的关键区别在于：props 由外部给定、组件自身无权变更；组件要变的数据应提升到公共父组件持有。注意两点边界——组件名必须大写开头，否则会被当成原生标签；props 是渲染输入而非可变变量，需要更新的值是状态，不是 props。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
