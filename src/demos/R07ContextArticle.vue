<script setup lang="ts">
import R07Context from './R07Context.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>工作台最深处那个「切换主题」按钮要按当前主题换色，可主题 <code>mode</code> 存在最顶层。你把它传下去才发现：中间四个布局组件根本没读过 theme，却被迫在签名里各加一个 theme prop，只为了当一根电线把它转递到底。
    </div>

    <h2>跨层级共享的数据</h2>
    <p>
      主题、当前登录用户、地区、语言——这类数据有个共同点：它们<strong>被树里很多层级的组件读取，却不属于任何一层</strong>。旧办法是 Props 逐层透传。隐藏成本有三条：中间层被迫声明并转发自己用不到的 prop，签名被污染；改一个数据要从顶层一路改到消费点，任何一个中间层漏写，链就断；中间组件因此和「是否转递某数据」绑死，想复用到别处还得先清理这些多余 prop。
    </p>
    <p>
      所以要回答的是：<strong>能不能让深层组件直接向上「取」它要的那份树级数据，而不经过中间层转手？</strong>
    </p>

    <h2>属性逐层传递的做法</h2>
    <p>
      最朴素也一定跑得通的做法：照样用 Props 一层层传下去。
    </p>
    <p>
      这个方案做对了一件事：<strong>数据流是显式、单向、可追踪的</strong>——顺着 props 你一定能追到值是从哪儿来的，没有任何「看不见的通道」。
    </p>

    <h2>中间层的传递断链</h2>
    <ul>
      <li>中间只要插一层新的布局组件，props 链就断了：theme 传不到按钮，按钮读到 <code>undefined</code>，换肤静默失效。</li>
      <li>同一个值被三四个中间层原样转发，任何一层改名或漏写，下游都会悄悄拿到 <code>undefined</code>，而且不报错、只是样式不对。</li>
      <li>中间组件多了一堆自己从不读取的 prop，签名越来越长，复用成本随之上升。</li>
      <li>想区分「深层组件被放到了主题之外」这种用法错误，Props 方案里只能一路传 <code>undefined</code>，没法把「忘了提供主题」变成一次显式报错。</li>
    </ul>

    <h2>提供与读取的直连</h2>
    <p>
      Context 要做的，是把「谁提供」和「谁读取」直接连起来，跳过中间层。补的顺序有讲究——先把通道搭通、再管默认值、最后管性能。
    </p>
    <ol class="lesson-steps">
      <li><code>createContext(null)</code> 建一条共享通道，参数是「找不到 Provider 时的默认值」。</li>
      <li>顶层 App 用 <code>&lt;ThemeContext.Provider&gt;</code> 提供当前主题 <code>mode</code> 与切换函数 <code>toggle</code>。</li>
      <li>深层 <code>ActionPanel</code> 直接 <code>useContext(ThemeContext)</code> 读取最近的 Provider，中间没有任何组件转发 props。</li>
      <li>补默认值路径：演示里默认值是 <code>null</code>，<code>ActionPanel</code> 读到 <code>null</code> 就主动 <code>throw</code>，把「忘了包 Provider」变成显式错误，而不是静默用错默认值。</li>
      <li>稳定 value：每次渲染都新建对象会让所有消费者无条件重渲染，把 value 用 <code>useMemo</code> 稳定住，或把状态与切换函数分开提供。</li>
      <li>划边界：只在 Props 要穿过很多「不关心它」的中间层时才用 Context；局部状态与常规组合仍然优先 Props——Context 是补充，不是替代。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>选择合适的场景：</strong>Context 适合低频变化的树级信息（主题、用户、地区）；高频变化的共享状态交给专用状态库更合适，否则每次变化都会让所有读取它的组件重渲染。也别拿 Context 当「全局变量桶」，什么都往里塞，会让依赖关系重新变得不可追踪。
    </div>

    <h2>深层组件的主题切换</h2>
    <figure class="lesson-figure">
      <figcaption>点「切换主题」，最深层的 ActionPanel 直接换肤——它和顶层 Provider 之间没有任何组件转发 props，值是一路「就近」读到的。</figcaption>
      <R07Context />
    </figure>

    <h2>默认值缺失的处理</h2>
    <p>
      Context 让提供方和读取方跳过中间层直接连线，代价是你要主动管好两件事：没有 Provider 时的默认值，以及 value 引用的稳定性。它把「穿过很多层的树级数据」从 Props 里解放出来，但常规的父子传值仍然交给 Props。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Provider 边界」</span>是由 <code>&lt;Context.Provider&gt;</code> 划定的子树范围，其中 <code>useContext</code> 读到的是离得最近的那个 Provider 的值。边界要点：多个 Provider 嵌套时按「就近覆盖」，内层遮住外层；<code>value</code> 的引用一变，边界内所有读取该 Context 的组件都会重渲染，因此要保持 value 稳定。
    </div>
  </LessonArticle>
</template>
