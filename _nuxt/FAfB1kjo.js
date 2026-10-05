const e=`<script setup lang="ts">
import R06Reducer from './R06Reducer.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>审批页上你点了「重置」，流程确实退回了第一步——可「已通过」那行绿字还挂在页面上，屏幕同时显示出「第 1 步 · 已通过」这种根本不该存在的组合。你明明只改了一个地方，另一个字段怎么没跟着回退？
    </div>

    <h2>字段关联与约束</h2>
    <p>
      这个入组流程里有两个字段：<code>step</code>（走到第几步）和 <code>approved</code>（是否通过）。它们不是各自独立的——<code>approved</code> 只有在走到最后一步之后才有意义，重置的时候两者必须一起回退。像这样<strong>彼此关联</strong>的状态，一旦用多个 <code>useState</code> 分开存、再让每个事件处理器各改各的，你就得在每个处理器里手动维护它们之间的一致性。
    </p>
    <p>
      旧办法的隐藏成本很具体：改一个 handler 时很容易漏掉另一个字段；「哪些字段必须一起变」这件事<strong>没有任何一处地方写着</strong>，全凭记忆；想知道整条流程一共允许哪几种变化，得把所有按钮的 onClick 翻一遍。于是问句落在这里：<strong>能不能给「状态如何变化」一个唯一、集中、还能脱离组件单独测试的定义？</strong>
    </p>

    <h2>两份状态各自维护</h2>
    <p>
      最朴素的做法：用两个 <code>useState</code> 分别存 <code>step</code> 与 <code>approved</code>，每写一个按钮就在对应的 handler 里 set 一次。
    </p>
    <p>
      这个方案做对了一件事：<strong>状态被拆成了最小的可读单元</strong>，组件渲染时各取所需，一眼能看出界面依赖了哪些数据。
    </p>

    <h2>重置遗漏与非法组合</h2>
    <ul>
      <li><code>reset</code> 的处理器里只写了 <code>setStep(0)</code>，忘了把 <code>approved</code> 一起置回 <code>false</code>，重置后就冒出「第 1 步 · 已通过」这个非法组合。</li>
      <li>「下一步」的边界逻辑被抄了两遍：按钮的 <code>disabled</code> 里判断一次 <code>step === steps.length - 1</code>，handler 里又用 <code>Math.min</code> 兜一次，两处一旦改得不一致就会互相打架。</li>
      <li>想知道「这个流程允许哪些操作」，只能去翻所有按钮的 onClick，没有一处集中的状态转移表。</li>
      <li>想给这些转移写测试，逻辑却粘在组件内部，不把整个组件渲染起来就没法测。</li>
    </ul>

    <h2>状态转移纯函数化</h2>
    <p>
      不推翻 <code>useState</code>，而是把「状态如何变化」整体抽出来，集中到一个纯函数里——这就是 <code>useReducer</code>。事件处理器从此只负责表达意图，不再负责计算新状态。
    </p>
    <ol class="lesson-steps">
      <li>定义状态与 action 词汇表：初始状态是 <code>{ step: 0, approved: false }</code>，reducer 认识 <code>next</code> / <code>approve</code> / <code>reset</code> 三种 action。</li>
      <li>写一个纯 reducer：<code>reducer(state, action)</code> 只读入参、只返回下一个 state，不请求接口、不改外部变量。</li>
      <li>组件里用 <code>const [state, dispatch] = useReducer(reducer, initialState)</code> 接线；按钮不再自己算状态，只 <code>dispatch({ type: 'next' })</code> 表达意图。</li>
      <li>补上边界：<code>default</code> 分支对未知 action 主动 <code>throw</code>，把拼错的 action 变成一次立刻可见的报错，而不是静默返回 <code>undefined</code>。</li>
      <li>渲染仍然靠派生：<code>step</code> 决定哪一步高亮，<code>approved</code> 控制确认文案，都由 state 现算，不额外存字段。</li>
      <li>最后给 reducer 写纯函数测试，逐个覆盖三种 action 的状态转移——它不依赖 React，测试成本极低。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>reducer 必须保持纯函数：</strong>不要在它内部发请求或修改外部变量，StrictMode 会把 reducer 跑两遍，任何副作用都会被放大成两份。也不是所有状态都值得上 reducer——彼此独立的简单状态用 <code>useState</code> 更轻，只有当字段互相关联、多条更新路径交织时才划算。另外，把状态转移表写进注释或文档，评审时最容易发现「少了一个 action」。
    </div>

    <h2>派发动作驱动转移</h2>
    <figure class="lesson-figure">
      <figcaption>依次点「下一步」「确认通过」，再点「重置」——每个按钮只派发一个 action，状态怎么转移全部由同一个 reducer 决定，像「第 1 步就通过」这样的非法组合根本构造不出来。</figcaption>
      <R06Reducer />
    </figure>

    <h2>更新规则单一来源</h2>
    <p>
      当几个状态字段彼此关联、或有多条更新路径交织时，把「怎么变」从「在哪儿点」里抽出来，集中成一个纯 reducer，让事件处理器只说意图、不写规则——更新逻辑就有了唯一出处，也第一次变得可以脱离界面单独验证。
    </p>
    <div class="lesson-term">
      <span class="term-name">「action」</span>是一个描述「发生了什么」的普通对象，至少含一个 <code>type</code> 字段，由事件处理器 dispatch 给 reducer，reducer 据此决定下一个状态。边界与例外：action 只表达意图，不携带更新逻辑本身；reducer 应对未知 <code>type</code> 有明确处理（通常是主动抛错），而不是悄悄返回旧状态。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
