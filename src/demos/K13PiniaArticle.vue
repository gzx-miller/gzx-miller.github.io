<script setup lang="ts">
import K13Pinia from './K13Pinia.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>页头徽标要显示购物车总价，结算页也要显示同一份明细——可这是两个八竿子打不着的组件，一个在顶栏、一个在深层路由，它们怎么共用同一份数据？
    </div>

    <h2>购物车跨组件共享</h2>
    <p>
      你在做一个课程商城。顶栏有个购物车图标，角标上要显示「共几件、总价多少」；用户点进去到结算页，又要列出每一门课的数量和价格。这两处读的必须是<strong>同一份购物车</strong>：在结算页加一门课，回到列表页角标也应该同步变化。可它们在组件树上离得很远，中间隔了好几层布局和路由，彼此连父子关系都不是。
    </p>
    <p>
      更麻烦的是「改」这件事。加课、减课、删除、清空，这些操作可能从商品卡片触发、从结算页触发、也可能从顶栏的迷你购物车触发。如果每个组件都自己写一遍修改逻辑，那么「满 200 减 20」这类业务规则就有五个地方需要同步，改漏一处就是 bug。于是问题的本质浮出来了：<strong>如何让一份业务状态被多处读写，同时让修改流程只有一处说了算？</strong>
    </p>

    <h2>状态上提与透传</h2>
    <p>
      最省事的做法是把状态提到共同祖先：在根组件里放一份 <code>cart</code>，往下用 <code>props</code> 一层层传，子组件修改时用 <code>emit</code> 把意图抛回上层。如果嫌透传太烦，还可以用 <code>provide</code> / <code>inject</code> 让任意后代直接拿到底层的那份数据。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>数据只有一份，所有视图读的是同一个源</strong>。只要这一条成立，显示就不会自相矛盾。当组件层级浅、参与方只有两三个时，这样写完全够用，甚至比引入一个库更轻。
    </p>

    <h2>逐层透传与冗余</h2>
    <ul>
      <li>层级一深，<code>props</code> 就要逐层透传，中间那些组件根本不关心购物车，却被迫当二传手。</li>
      <li>跨路由页面拿不到 <code>props</code>——顶栏和结算页不在同一条父子链上，透传直接失效。</li>
      <li>修改逻辑散落在每个触发点，「满减」规则一改，五处都要动，漏改一处就错。</li>
      <li>状态藏在根组件的 <code>ref</code> 里，浏览器 devtools 看不到它，也追不到「这一次点击到底改了什么」。</li>
      <li>想给「加课」这条规则写单元测试，必须先把整个组件树挂起来，成本高得离谱。</li>
    </ul>

    <h2>Pinia状态模块</h2>
    <p>
      不推翻「数据只有一份」，而是把它从组件树里<strong>请出来，放进一个独立的 store</strong>。store 是一个普通模块，谁都能 <code>import</code>，不再受组件层级约束；同时它内部把状态拆成三种角色，各管一件事。这就是 Pinia。
    </p>
    <ol class="lesson-steps">
      <li><strong>state</strong>：保存原始数据，比如 <code>items</code> 这份课程清单。</li>
      <li><strong>getter</strong>：表达派生结果，比如 <code>total</code> 总价。它用 <code>computed</code> 的语义——依赖不变就不重算，自带缓存，也有完整的类型推导。</li>
      <li><strong>action</strong>：封装修改流程，比如 <code>addCourse</code>。它天然支持异步，复杂的「校验后再改」逻辑都放这里。</li>
      <li>组件通过 <code>useCartStore()</code> 拿到 store，列表读 <code>cart.items</code>、总价读 <code>cart.total</code>、点击调用 <code>cart.addCourse</code>，只表达意图，不关心内部怎么改。</li>
    </ol>
    <p>
      这样一拆，前面几条缺陷逐个消解：跨路由不再是问题，因为 store 是模块级单例；修改流程集中到 action，规则只有一处；getter 和 action 都是普通函数，写单元测试直接调用即可；而在 devtools 的 Pinia 面板里，每一次 action 触发的状态变更都被记录下来，可以逐帧回放。
    </p>
    <table>
      <thead>
        <tr><th>角色</th><th>职责</th><th>购物车里的例子</th></tr>
      </thead>
      <tbody>
        <tr><td>state</td><td>原始数据</td><td><code>items</code></td></tr>
        <tr><td>getter</td><td>派生结果（带缓存）</td><td><code>total</code></td></tr>
        <tr><td>action</td><td>修改流程（可异步）</td><td><code>addCourse</code></td></tr>
      </tbody>
    </table>
    <p>
      还有四条边界要记住。第一，<strong>只有跨组件或跨页面共享的状态才值得放进 Pinia</strong>——某个组件内部用的开合布尔值，留在 <code>ref</code> 里就好，塞进 store 只会让全局越来越臃肿。第二，复杂修改流程一律放进 action，组件只表达用户意图。第三，getter 和 action 都是纯函数式的，很适合写单元测试，别让它们依赖 DOM。第四，<strong>多个 store 之间可以直接互相引用</strong>，把状态按业务域拆成购物车、用户、课程等多个小 store，而不是维持一个巨型 store。
    </p>
    <div class="lesson-box hint">
      <strong>判断标准：</strong>当你发现某个状态「想让别的页面也看到」，或者「修改规则改一次要同步好几处」，它就是该搬进 store 的信号；反之，只在一个组件里用、生命周期跟着组件走的临时状态，留在本地即可。
    </div>

    <h2>动作驱动状态更新</h2>
    <figure class="lesson-figure">
      <figcaption>点「再买一份课程」，看 action 如何驱动 state 与 getter 一起更新。</figcaption>
      <K13Pinia />
    </figure>

    <h2>读写安全与三类角色</h2>
    <p>
      Pinia 解决的从来不是「怎么存数据」，而是「一份业务状态怎样被多处安全地读写」。state 是原始数据，getter 是带缓存的派生结果，action 是唯一的修改入口；组件只读 getter、只调用 action，既不知道内部细节，也不需要知道。状态的边界划清了，规则就不会散落，测试也变得顺手。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Store」</span>是 Pinia 里的状态容器，由三部分组成：<strong>state</strong> 保存原始数据，<strong>getter</strong> 用 <code>computed</code> 语义表达派生值（自带缓存与类型推导），<strong>action</strong> 封装修改流程且天然支持异步。只有跨组件、跨页面共享的状态才值得放入 store；多个 store 可互相引用，避免单个巨型 store。
    </div>
  </LessonArticle>
</template>
