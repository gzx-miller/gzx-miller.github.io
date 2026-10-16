const e=`<script setup lang="ts">
import J14MapSetWeakRef from './J14MapSetWeakRef.vue'
import J12IteratorsGenerators from './J12IteratorsGenerators.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想用对象给「标签」做计数，写下 <code>counts[tag] = 0</code>；某天 <code>tag</code> 是两个内容相同的对象，结果两次赋值只留下一条记录——对象键被悄悄转成了同一个 <code>'[object Object]'</code>，计数从此对不上号。
    </div>

    <h2>用对象当字典</h2>
    <p>
      需要「键指向值」时，第一反应通常是拿对象当字典：<code>const counts = {}</code>，然后 <code>counts[key] = n</code>。它确实顺手——字面量写法、能直接交给 JSON、取值也直观，简单的字符串键场景完全够用。
    </p>
    <p>
      问题出在键的规则上。对象的键<strong>只能是字符串或 Symbol</strong>：数字键会被转成字符串，对象键会被转成 <code>'[object Object]'</code>，于是不同的对象写进去只会互相覆盖；键的遍历顺序对整数键也有特殊排序，未必是你插入的次序。这些限制，正是 Map 和 Set 要补上的口子。
    </p>

    <h2>Map 与 Set 补齐的语义</h2>
    <p>
      <code>Map</code> 允许<strong>任意类型做键</strong>，对象、函数、甚至 <code>NaN</code> 都能原样保留，并且<strong>按插入顺序</strong>遍历；<code>size</code> 直接给出条目数，<code>has</code> / <code>get</code> / <code>delete</code> 是一套完整的接口。注意对象键比较的是引用，只有同一个对象才能命中，这恰好解决了上面「两个对象撞成一个键」的问题。
    </p>
    <p>
      <code>Set</code> 则是「值的集合」，它保证<strong>值唯一</strong>，重复添加会被忽略，判断归属用 <code>has</code>，展开成数组写 <code>[...set]</code>。它同样按 SameValueZero 比较，所以 <code>NaN</code> 只会存一个。列表去重、标签多选、已读标记这类场景，用它比用数组省心得多。
    </p>

    <h2>弱引用：WeakMap 与 WeakSet</h2>
    <p>
      Map 和 Set 会<strong>持有键的强引用</strong>：只要这个 Map 还活着，进去的键对象就永远不会被回收。如果拿它给 DOM 节点挂元数据，节点从页面上移除后仍被 Map 锁住，内存就漏了。
    </p>
    <p>
      <code>WeakMap</code> 与 <code>WeakSet</code> 的键是<strong>弱引用</strong>：当键没有其他强引用时，会被垃圾回收，对应的条目自动消失，不会阻止回收。代价是键必须是对象，且集合<strong>不可枚举、没有 size</strong>，所以它们只适合「给对象挂一份私有元数据」，而不是用来做遍历或统计。典型用法就是给 DOM 元素或组件实例关联内部状态。
    </p>

    <h2>可迭代协议</h2>
    <p>
      那 <code>for...of</code> 为什么能同时遍历数组、字符串、Map、Set？因为它们都实现了<strong>可迭代协议</strong>：在 <code>Symbol.iterator</code> 这个符号属性上提供一个方法，调用它返回一个迭代器；迭代器上再有一个 <code>next()</code>，每调用一次返回一个对象 <code>{ value, done }</code>，<code>done</code> 为 <code>true</code> 表示取完了。
    </p>
    <p>
      这套约定的价值在于「统一」：<code>for...of</code>、展开运算符 <code>...</code>、数组解构、<code>Array.from</code> 全都依赖它。也就是说，任何对象只要自己实现了 <code>[Symbol.iterator]</code>，就能被这些语法一视同仁地消费，不需要为每种语法单独适配。
    </p>

    <h2>生成器与惰性序列</h2>
    <p>
      手写迭代器得自己维护「当前到哪了」的状态，很容易写乱。生成器函数 <code>function*</code> 把这件事接管了：函数体里写一个 <code>yield</code> 就暂停一次，调用方每 <code>next()</code> 一下才恢复执行到下一个 <code>yield</code>；<code>next(value)</code> 还能把值回传给上一个 <code>yield</code> 表达式，形成双向通信。<code>yield*</code> 则把当前生成器的产出委托给另一个可迭代对象，逐个转发。
    </p>
    <p>
      好处是<strong>惰性</strong>：序列不必一次性全部生成，可以按需产出——无限序列、逐行读大文件、分页拉取都能用流式方式表达，用到多少算多少。下面两个演示分别展示 Set/Map/WeakMap 与生成器逐次产出。
    </p>
    <figure class="lesson-figure">
      <figcaption>用 Set 自动去重、Map 建立映射、WeakMap 给节点挂私有元数据，点标签切换筛选课程。</figcaption>
      <J14MapSetWeakRef />
    </figure>
    <figure class="lesson-figure">
      <figcaption>生成器函数 <code>yield</code> 逐个产出课程，调用方按需 <code>next()</code> 拉取，直到 <code>done</code> 为 true。</figcaption>
      <J12IteratorsGenerators />
    </figure>

    <h2>迭代协议的价值</h2>
    <p>
      迭代协议把「逐个取值」与「何时结束」抽象成统一接口，于是一套消费语法能覆盖数组、字符串、Map、Set、生成器乃至自定义对象；Map/Set/WeakMap 则补齐了对象和数组缺失的语义。选择的依据很清楚：要任意类型键、稳定顺序、快速归属判断，用 Map；要去重与集合运算，用 Set；要挂私有元数据又不妨碍回收，用 WeakMap/WeakSet。
    </p>
    <div class="lesson-term">
      <span class="term-name">「迭代协议」</span>指对象在 <code>[Symbol.iterator]</code> 上提供方法、返回带 <code>next()</code> 的迭代器，且 <code>next()</code> 每次返回 <code>{ value, done }</code> 的约定。<code>for...of</code>、展开运算符、解构、<code>Array.from</code> 都依赖它；生成器函数用 <code>function*</code> 与 <code>yield</code> 自动实现这套协议。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
