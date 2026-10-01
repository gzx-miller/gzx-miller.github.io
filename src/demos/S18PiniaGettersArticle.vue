<script setup lang="ts">
import S18PiniaGetters from './S18PiniaGetters.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>商品总数、均价、低库存、购物车合计，四五个组件各自算了一遍同样的结果——为什么同一份「派生数据」要重复计算这么多次？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做「秋日森林小铺」的商品页：顶部要显示商品总数与均价，侧栏要看低库存商品，购物车要算合计金额，分类筛选还要按类别把商品分组。这些数字有个共同点——<strong>它们都不是新的状态，而是从已有的商品与购物车数据里算出来的</strong>。
    </p>
    <p>
      于是你很自然地在每个用到它的组件里各写了一个 <code>computed</code>：商品列表页算一遍总数，统计卡片又算一遍，购物车再算一遍合计。刚开始没问题，直到某天「均价」的规则从「四舍五入」改成「保留两位小数」——你不得不在好几个文件里翻找同一段算法。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：把派生逻辑留在组件层，谁需要就在谁的 <code>computed</code> 里算一次。
    </p>
    <p>
      这个方案抓住了一个正确的前提：<strong>派生数据确实是纯计算，在组件里用 <code>computed</code> 表达完全合法</strong>。而且 <code>computed</code> 自带缓存，只要它依赖的状态没变，重复读取也不会真的重算。问题出在「谁来拥有这份计算」——当同一份派生被多个组件需要时，把它放在某一个组件里，就等于把公共规则私有化了。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>同一套算法在多个组件里重复，规则一改就要满项目找。</li>
      <li>各组件各自实现，稍有不一致就会出现「同一个总数显示成两个值」。</li>
      <li>跨组件共享同一份派生结果很别扭，可能要靠 props 层层传下去。</li>
      <li>派生逻辑和组件渲染耦合在一起，脱离了界面就测不了。</li>
      <li>组件一多，谁依赖了哪份状态变得难以追踪。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「派生要用 <code>computed</code>」，而是<strong>把它从组件里搬到 store 里</strong>。在 Setup Store 中，你直接用 <code>computed</code> 定义派生结果，它就成了一份全项目共享、且依然自带缓存的 getter。
    </p>
    <p>
      搬到 store 之后，好处是连锁出现的。第一，<strong>缓存语义没有变</strong>：依赖的状态没变时，无论多少个组件读取这个 getter，都只算一次；一旦依赖变化，缓存会自动失效并重算，不用你手动清理。第二，组件侧的读取方式更干净：可以直接 <code>store.getterName</code>，也可以用 <code>storeToRefs</code> 解构出响应式引用。
    </p>
    <p>
      getter 之间还能互相引用，形成<strong>派生链</strong>。比如「购物车合计」依赖「购物车明细」，而明细又是从购物车条目和商品列表算出来的；当商品价格变化时，这条链会自上而下一层层自动重算。把复杂结果拆成几层小的派生，比堆在一个巨型 computed 里更好读、也更好维护。
    </p>
    <div class="lesson-box hint">
      <strong>保持 getter 是纯函数：</strong>getter 只应「读状态、算结果」，<strong>不要在内部发请求或修改状态</strong>。一旦掺入副作用，缓存语义和可预测性同时被破坏，getter 会从「结果」变成「动作」，这是最难查的一类 bug。
    </div>
    <p>
      最后一个要权衡的点是带参数的查询。有时你想「按分类取出商品列表」，直觉是给 getter 传参，但 getter 本身不接受参数——只能让它<strong>返回一个函数</strong>。这样做能拿到参数，代价是<strong>每次调用都会重新执行，缓存就失效了</strong>。所以要按调用频率来决定：高频读取的用普通 getter 保住缓存，偶尔按参数查询的才用返回函数的写法。
    </p>

    <div class="lesson-box hint">
      <strong>解构时的小提醒：</strong>直接从 store 上解构状态会丢掉响应式，取状态与 getter 要用 <code>storeToRefs</code>；而 action 是普通函数，直接解构即可。分不清时记住一句——<strong>需要保持响应式的用 <code>storeToRefs</code>，只是调用动作的直接取</strong>。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换分类、加购商品，观察 store 里的 getter 如何自动更新统计与购物车合计。</figcaption>
      <S18PiniaGetters />
    </figure>

    <h2>总结</h2>
    <p>
      Pinia 的 Getter 本质上就是计算属性：它把「从状态派生出的结果」集中放进 store，让统计、筛选、分组、金额这些结果只定义一次、处处共享，还天然带着缓存。记住三条——依赖不变不重算、保持纯函数无副作用、返回函数的 getter 会失去缓存。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Getters」</span>是 Pinia 里定义派生状态的方式，在 Setup Store 中即 <code>computed</code>。<strong>它自动缓存</strong>，依赖未变化时多次读取不会重复计算，依赖变化时自动失效重算；getter 之间可互相引用形成派生链，但必须保持无副作用。需要按参数取值时让 getter 返回函数，代价是每次访问都会重新执行、缓存失效。
    </div>
  </LessonArticle>
</template>
