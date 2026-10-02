const e=`<script setup lang="ts">
import S02PiniaSetupStore from './S02PiniaSetupStore.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>在组件里把课程列表从 Store 解构出来，勾选「已完成」之后页面纹丝不动，可打开开发者工具一看，Store 里的数据明明已经变了——为什么改了却不刷新？
    </div>

    <h2>跨组件共享需求</h2>
    <p>
      你在做一个学习计划模块。页面上要显示三门课程、总时长和一个完成率百分比，用户还能报名新课程、勾选某门课为已完成。数据放在一个 Store 里，多个页面都要用到它——这符合「跨组件共享的业务状态」这条标准。
    </p>
    <p>
      于是问题落在写法上。这个 Store 里既有依赖别的状态算出来的值（总时长、完成率），也有一组操作数据的方法（报名、切换完成）。它们在概念上是三类不同的东西，却要挤在同一个对象里描述。与此同时，组件里怎么把 Store 的数据取出来用，也决定了它还能不能跟着更新——这正是开场那个「数据变了页面不动」的来由。
    </p>

    <h2>选项式仓库定义</h2>
    <p>
      最省事的做法：用对象式 Store，把 <code>state</code>、<code>getters</code>、<code>actions</code> 三块分别写清楚；组件里则用解构取值，写出 <code>const { courses } = store</code>。
    </p>
    <p>
      这个方案做对了两件事：<strong>它把 state、getter、action 的边界摆得很清楚</strong>，新手一眼就知道哪块写数据、哪块写派生值、哪块写操作；同时，解构写法让模板里可以直接写 <code>courses</code>，不用到处带 <code>store.</code> 前缀，干净不少。
    </p>

    <h2>解构失去响应性</h2>
    <ul>
      <li>解构出来的 <code>courses</code> 只是一次性快照，它记下了当时的那个值，后续 Store 里的变更不再触发页面重新渲染。</li>
      <li>派生值同样中招：<code>totalMinutes</code>、<code>completionRate</code> 一起解构出来后，也失去了跟随变化的能力，页面显示的永远是第一次算出来的结果。</li>
      <li>对象式的组织方式与组件写法是两套语法，想复用一个现成的组合式函数（比如一个处理进度的逻辑）得绕路包一层，逻辑组织被割裂。</li>
      <li>组件里读写路径不统一：读的时候用解构变量，调用方法时又得切回 <code>store.enroll()</code>，看代码时要在两种风格之间来回切换。</li>
    </ul>

    <h2>函数式仓库定义</h2>
    <p>
      先修好组织方式：改用 <strong>Setup Store</strong>，也就是让 <code>defineStore</code> 的第二个参数变成一个函数，在函数体里用组合式 API 描述这个 Store，最后把要对外的东西返回出去。写法是 <code>defineStore('learning', () =&gt; { ... })</code>，回调里 <code>ref</code> 表达 state、<code>computed</code> 表达 getter、普通函数表达 action。它和写组件用的是同一套语法，现成的组合式函数可以直接搬进来，逻辑组织不再割裂。
    </p>
    <p>
      其中第一个参数是这个 Store 的 id，<strong>它在应用内必须唯一</strong>。组件里调用 <code>useLearningStore()</code> 时，Pinia 按 id 查找：第一次调用创建实例，之后重复调用返回的都是同一个，所以任何组件改动的都是同一份数据。
    </p>
    <p>
      再修好取数方式。要理解一个前提：Store 实例本身是响应式的，所以直接在模板里写 <code>store.courses</code> 是能跟随更新的；出问题的只是「解构」这个动作，它把响应式对象里的值取出来变成了普通变量。<code>storeToRefs</code> 正是为此而生，它把 state 和 getter 解构成<strong>仍然保留响应性的 ref</strong>。
    </p>
    <ul>
      <li>要用：<code>const { courses, totalMinutes, completionRate } = storeToRefs(store)</code>，得到的每一项都是 ref，模板里照常使用。</li>
      <li>反例：<code>const { courses } = store</code> 拿到的是一次性快照，后续变更不再触发重渲染。</li>
      <li><strong>action 不需要包裹</strong>：<code>storeToRefs</code> 只处理 state 和 getter，方法没有「响应性」可言，直接从 Store 上解构调用即可。</li>
    </ul>
    <div class="lesson-box hint">
      <strong>一句话记法：</strong>解构数据用 <code>storeToRefs</code>，解构方法直接解构。把方法也丢进 <code>storeToRefs</code> 不只是多余，还会让人误以为方法也需要响应式代理。当然，最省事的方案是根本不解构，全程写 <code>store.xxx</code>——它天然保持响应性，只是模板里会多几个前缀。
    </div>

    <p>
      顺便澄清一个常见混淆：state 与 getter 在组件里都不是「值」，而是可以持续读取的响应式来源。state 由你写入，getter 则由它依赖的 state 推导出来——完成率这类派生值不应该再单独存一份，否则就有了第二个事实来源，两边一旦不同步就会打架。<code>storeToRefs</code> 之所以把两者一起解构成 ref，正是因为它们都需要保留这种「持续读取」的能力；而 action 只是操作入口，调用一次就结束，本来就没有需要保留的状态。
    </p>

    <h2>报名联动统计刷新</h2>
    <figure class="lesson-figure">
      <figcaption>点「报名 Zustand 课程」看课程数、总时长与完成率是否同步刷新，再勾选一门课验证完成率变化。</figcaption>
      <S02PiniaSetupStore />
    </figure>

    <h2>组合式API写法</h2>
    <p>
      Setup Store 把 Store 的写法拉回到组合式 API 这一套：用 <code>ref</code> 写状态、用 <code>computed</code> 写派生值、用函数写操作，与组件保持同一心智模型。取数时只要记住那条分界线——<code>storeToRefs</code> 负责会变的 state 和 getter，方法直接解构——就不会再遇到「数据变了页面不动」这种看似灵异的现象。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Setup Store」</span>指用组合式 API 组织的 Pinia Store：<code>defineStore(id, () =&gt; { ... })</code> 的回调里 <code>ref</code> 表达 state、<code>computed</code> 表达 getter、普通函数表达 action，<code>id</code> 在应用内唯一且重复调用返回同一实例。Store 实例本身响应式，但直接解构会切断响应性，需用 <code>storeToRefs</code> 解构 state 与 getter，action 则直接解构调用。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
