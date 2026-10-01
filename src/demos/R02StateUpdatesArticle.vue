<script setup lang="ts">
import R02StateUpdates from './R02StateUpdates.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把「加一」按钮的处理器写成 <code>setCount(count + 1)</code>，想让它连点两次就加二。可你连点两次，数量只从 0 变成了 1——少的那个 1 去哪了？
    </div>

    <h2>购物车数量联动</h2>
    <p>
      购物车里，「板栗拿铁 ¥22 × 1」「枫糖曲奇 ¥16 × 2」，你想让每件商品都能加减数量，合计金额跟着走。最朴素的写法是拿一个普通对象当数据：<code>item.count++</code> 改完，界面却一动不动；把整个数组 <code>push</code> 一项，列表也没多出一行。
    </p>
    <p>
      就算你改用了 <code>useState</code>，坑还在：一次点击里写两遍 <code>setCount(count + 1)</code>，最终只加了一。原因是这一整段代码运行在<strong>同一次渲染</strong>里，<code>count</code> 从头到尾是同一个快照，两次自增都基于旧值，结果自然覆盖成了同一个数。
    </p>
    <p>
      而且你很快会发现第三本账：合计金额要是也单独存一份、再手动跟数量同步，稍有一步忘记对齐，屏幕上就会出现「数量变了、合计没变」的分裂。于是问题收敛成一句：<strong>怎么让每次更新都基于最新状态，又让界面显示的值永远只有一个来源？</strong>
    </p>

    <h2>组件状态托管</h2>
    <p>
      第一步，把这份数据交给 React 保管：<code>const [cart, setCart] = useState(initialCart)</code>，需要改的时候调用 setter。这个方案做对了一件事：<strong>数据不再是你手里的普通变量，而是由 React 记账、负责重画的快照</strong>，值一变它就安排一次重新渲染。
    </p>

    <h2>引用比较与更新失效</h2>
    <ul>
      <li>直接 <code>cart.push(newItem)</code> 或 <code>item.count++</code>：数组和对象的<strong>引用没变</strong>，React 用 <code>Object.is</code> 一比认为「还是老样子」，直接跳过重渲染，界面纹丝不动。</li>
      <li>写 <code>setCount(count + 1)</code> 再 <code>setCount(count + 1)</code>：两次都读到同一个旧快照，最终只加一，你想要的「加二」凭空少了一。</li>
      <li>把合计金额也存成 state、再靠另一个 effect 去跟数量对齐：两处数值一旦慢半拍，就会闪出一个对不上的中间结果。</li>
      <li>更新函数里做了不纯的事——比如顺手修改了传入的对象——在开发模式的 StrictMode 下函数会被调用两次，这些副作用也会翻倍。</li>
    </ul>

    <h2>不可变更新与新引用</h2>
    <p>
      先补最要命的一层：<strong>不可变更新</strong>。既然 React 靠引用判断「变没变」，那每次更新就产出一个<strong>新引用</strong>，而不是原地改。改一件商品的数量，用 <code>map</code> 只替换命中的那一条，其余条目保持原引用：
    </p>
    <p>
      <code>setCart(items =&gt; items.map(item =&gt; item.id === id ? { ...item, count: item.count + step } : item))</code>。注意这里对命中的对象用了展开语法 <code>{ ...item, count: ... }</code> 造新对象——只有被改动的这条换了身份，未命中的条目原样返回，React 就能把重渲染的范围缩小到真正变化的那一行。
    </p>
    <p>
      接着补第二层：<strong>函数式更新</strong>。当新状态依赖旧状态时，不要把旧值读出来再算，而是把「怎么算」作为一个函数交给 setter：<code>setCart(items =&gt; ...)</code>。React 会把<strong>最新的状态</strong>作为参数传进来，于是即便你在一次点击里连调多次，每一次都基于上一次的结果，几次自增就会老老实实叠加。
    </p>
    <p>
      最后一层是<strong>派生数据</strong>：合计金额并不需要独立存活，它可以在每次渲染时由 <code>cart</code> 现算——<code>cart.reduce((sum, item) =&gt; sum + item.price * item.count, 0)</code>。数量一变，<code>cart</code> 换了新引用，渲染重新执行，合计自然跟着变，从此不存在「两个来源不同步」的问题。
    </p>
    <div class="lesson-box warn">
      <strong>别踩这些坑：</strong>不要对状态对象 <code>push</code> / <code>splice</code> / <code>item.count++</code>，引用不变界面就不会更新；能从现有状态推导出来的值（合计、筛选结果、是否为空）不要另存一份 state；更新函数要保持纯粹——它可能被调用不止一次，改动外部变量会让结果翻倍。
    </div>

    <h2>局部替换与引用不变</h2>
    <figure class="lesson-figure">
      <figcaption>点每件商品的加减按钮：只有被改动的那条记录换成了新对象，其余条目引用不动；合计金额随数量在渲染时实时推导出来。</figcaption>
      <R02StateUpdates />
    </figure>

    <h2>渲染请求与函数式更新</h2>
    <p>
      状态更新的本质是「<strong>请求下一次渲染</strong>」，而不是立刻改写你手里的那个变量——所以在同一次渲染里连读多次，读到的永远是同一个快照。要基于最新值更新，就用函数式 setter；要触发重渲染，就用新引用整体替换旧值。守住这两条，界面显示的值始终只有一个来源。
    </p>
    <div class="lesson-term">
      <span class="term-name">「不可变更新（immutable update）」</span>指不修改原有的对象或数组，而是产出一个<strong>新引用</strong>（如用 <code>map</code> / 展开语法重建）来替换它，从而让 React 通过引用比较发现变化。边界与例外：<code>Object.is</code> 只做浅比较，所以「改了内层属性但外层引用没变」依然不会触发更新；新状态依赖旧状态时必须用具名函数形式的 <code>setState(prev =&gt; next)</code>，而不是直接读取当前变量。
    </div>
  </LessonArticle>
</template>
