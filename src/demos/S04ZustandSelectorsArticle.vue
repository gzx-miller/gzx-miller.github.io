<script setup lang="ts">
import S04ZustandSelectors from './S04ZustandSelectors.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>购物车页面上有一个「加入课程」按钮和旁边的件数，还有一个优惠码输入框。你在优惠码里敲字，每敲一个字母，那个只显示件数的面板都会跟着重新渲染一遍——可件数根本没变。改一次优惠码，就白白重渲染一次计数组件；敲几十下，就白跑几十次。
    </div>

    <h2>共享状态拆分</h2>
    <p>
      件数和优惠码是同一份业务状态的两半：加商品要改件数，填优惠码要改优惠码。它们得能被多个组件共享——「加入课程」按钮在一个组件里，件数显示在另一个组件里，优惠码输入在第三个组件里。共享之外还有一条不低的隐形要求：<strong>只关心件数的组件，不该被优惠码的变化连累</strong>。
    </p>
    <p>
      旧办法各有各的成本。<strong>用 Context 加一个 <code>useState</code> 存整份购物车</strong>：value 一变，所有消费这个 Context 的组件统统重渲染，哪怕它只读了其中一个字段；<strong>把状态提到共同父组件再一层层用 props 往下传</strong>：中间组件被迫充当透传管道，只要传的是一个大对象，新的重渲染又会顺着传下来；<strong>每个组件各自 <code>useState</code></strong>：数据根本没法共享，一个组件加了商品，另一个组件压根不知道。
    </p>
    <p>
      所以要回答的是：<strong>能不能有一个住在组件树之外的共享数据源，让每个组件只订阅它真正用到的那一小片，别的地方怎么变都不打扰它？</strong>
    </p>

    <h2>树外仓库创建</h2>
    <p>
      最朴素的做法：用 Zustand 的 <code>create</code> 在组件之外建一个 Store，把状态和改状态的方法放进去——<code>const useCartStore = create((set) =&gt; ({ items: 1, coupon: '', addItem: () =&gt; set((s) =&gt; ({ items: s.items + 1 })), setCoupon: (coupon) =&gt; set({ coupon }) }))</code>。组件里直接 <code>useCartStore((state) =&gt; state.items)</code> 就把件数取出来了。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把状态搬到了 React 树外面</strong>。任何组件都能直接读写这份状态，不需要 Provider，也不需要一层层透传——共享这一半需求，一行 import 就解决了。
    </p>

    <h2>全量订阅代价</h2>
    <ul>
      <li>把手上的 selector 写成 <code>useCartStore((s) =&gt; s)</code>，直接把整个 state 返回：任何一个字段变化，返回的对象引用就变了，组件照旧全都重渲染——selector 形同虚设。</li>
      <li>让 selector 每次返回一个<strong>新对象</strong>，比如 <code>useCartStore((s) =&gt; ({ items: s.items, coupon: s.coupon }))</code>：每次渲染都是新引用，默认的相等比较永远判定「变了」，轻则白渲染，重则触发无限循环，报出「getSnapshot 结果应该被缓存」之类的错误。</li>
      <li>把状态和 action 一起取出来：<code>useCartStore((s) =&gt; s)</code> 再 <code>const { items, addItem } = ...</code>，两者被绑在同一个切片上，件数一变，本来稳定的 <code>addItem</code> 也被当成「变了」。</li>
      <li>selector 返回派生数组（比如筛选后的列表）却每次新建数组：引用不稳定，同样会引起多余的甚至无限的重渲染。</li>
    </ul>

    <h2>细粒度切片订阅</h2>
    <p>
      不推翻「树外共享」，而是把每个组件和 Store 之间的连接收窄成一条只属于自己的<strong>细粒度订阅</strong>。Zustand 的 Hook API 接收一个 selector，这个函数把整个 state <strong>投影成组件真正要用的那一个最小切片</strong>；切片引用没变，组件就不重渲染。
    </p>
    <ol class="lesson-steps">
      <li>在模块顶层用 <code>create((set) =&gt; ...)</code> 定义 Store：<code>items</code>、<code>coupon</code> 是状态，<code>addItem</code>、<code>setCoupon</code> 是用 <code>set</code> 合并新状态的 action。</li>
      <li>每个组件只取自己要用的切片：计数组件取 <code>useCartStore((s) =&gt; s.items)</code>，优惠码组件取 <code>useCartStore((s) =&gt; s.coupon)</code>。</li>
      <li>action 也单独订阅：<code>useCartStore((s) =&gt; s.addItem)</code>。它在 Store 创建时就固定下来，是个稳定引用，永远不会因为状态变化而让组件重渲染。</li>
      <li>状态变化时，Zustand 用 <code>Object.is</code> 比较每个组件上一次拿到的切片：<code>items</code> 变了只有计数组件收到通知，<code>coupon</code> 变了只有优惠码组件收到通知，互不牵连。</li>
      <li>需要派生数组或对象时，要么把对象拆成几个基础切片分别订阅，要么用浅比较选择器（如 <code>useShallow</code>）让它按内容比较，避免「每次新建引用」被误判成变化。</li>
      <li>Store 自己不依赖 React 树：在事件回调里也能直接 <code>useCartStore.getState().addItem()</code>，在组件外用 <code>subscribe</code> 监听变化，都行。</li>
    </ol>
    <p>
      拿开场那幕收个尾：件数和优惠码被拆成了两条独立的订阅。<code>addItem</code> 只改 <code>items</code>，只有计数组件重渲染；<code>setCoupon</code> 只改 <code>coupon</code>，只有优惠码组件重渲染。你在优惠码里敲了多少个字母，计数组件都一动不动——这正是「切片引用不变就不重渲染」带来的隔离。
    </p>
    <div class="lesson-box warn">
      <strong>一条最容易翻车的边界：</strong>selector 必须返回<strong>稳定的切片</strong>。只要它每次调用都凭空造一个新对象或新数组，默认的相等比较就会一直判定「变了」——后果先是多余渲染，严重时因为每次都返回不同结果而陷入无限循环。要派生出新集合，就把基础字段分开订阅，或者显式使用浅比较选择器。
    </div>

    <h2>组件订阅隔离</h2>
    <figure class="lesson-figure">
      <figcaption>点「加入课程」，只有显示件数的面板在变；再去优惠码输入框里打字，件数依旧纹丝不动——两个组件各订各的切片，互不打扰。把两者的变化都看在眼里，就能体会「只订阅自己用到的那一小片」到底省下了什么。</figcaption>
      <S04ZustandSelectors />
    </figure>

    <h2>切片粒度与性能</h2>
    <p>
      Zustand 把共享状态挪出 React 树，用 <code>create</code> 一处定义、随处订阅；真正决定性能的，是每个组件交给 Hook 的那个 selector——它返回的最小切片引用不变，组件就不重渲染。选对 selector，等于给每个组件划出一条只属于自己的订阅线，别处的改动自然波及不到它。
    </p>
    <div class="lesson-term">
      <span class="term-name">「选择器订阅（selector subscription）」</span>指把整个 Store 状态经一个 selector 函数投影成组件所需的最小切片后再订阅，并默认用 <code>Object.is</code> 比较该切片的新旧引用——引用不变则组件不重渲染，从而把无关更新的影响隔离在真正读取它的组件内。边界：selector 必须返回<strong>稳定引用</strong>的切片，每次新建对象或数组会让比较永远判定「变了」，导致多余渲染甚至无限循环，此时应拆成基础切片分别订阅，或用 <code>useShallow</code> 之类的浅比较选择器；此外 Store 不依赖 React 树，可在组件外直接 <code>getState()</code> 调用 action。
    </div>
  </LessonArticle>
</template>
