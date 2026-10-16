<script setup lang="ts">
import PY10Generators from './PY10Generators.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>需要一个「一直往下数」的序列，用 <code>range</code> 或列表显然写不完——内存根本装不下无穷多个数。但下面这个函数却能正常返回、还能一直取值：<code>def count(): while True: yield n</code>。一个死循环里藏着的 <code>yield</code>，凭什么没让程序卡死？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      要遍历一串数据，最直观的做法是先造好一个列表：<code>numbers = [1, 2, 3, 4, 5]</code>，再 <code>for n in numbers</code>。列表能一次装下所有元素，索引、切片、长度都方便，对几十上百个元素的小数据完全够用。
    </p>
    <p>
      可一旦数据量巨大，或者<strong>根本就是无限的</strong>，列表这条路就走不通了：建列表意味着所有元素必须同时存在于内存里。更尴尬的是，很多时候我们只是想把它们<strong>一路用过去</strong>（求和、过滤、取前几个），压根不需要同时持有全部。问题不在数据本身，而在「先全部造好」这个前提。
    </p>

    <h2>可迭代对象与迭代器</h2>
    <p>
      要绕开「先全部造好」，得先分清两个容易混的概念：
    </p>
    <ul>
      <li><strong>可迭代对象</strong>：能被 <code>for</code> 遍历的东西，比如列表、字符串、字典。它实现了 <code>__iter__</code>，能<strong>交出一个迭代器</strong>。</li>
      <li><strong>迭代器</strong>：真正负责「一次给一个」的东西。它实现了 <code>__next__</code>，每次被调用就返回下一个元素，取完再被调用则抛 <code>StopIteration</code>。</li>
    </ul>
    <p>
      <code>for</code> 循环做的事其实很朴素：先拿到迭代器，然后反复调用它的 <code>__next__</code>，把返回的值交给循环变量；直到 <code>StopIteration</code> 被抛出，循环自然结束。理解了这一步，「一次只给一个」的机制就立起来了。
    </p>

    <h2>yield 与生成器函数</h2>
    <p>
      手写一个迭代器类又长又啰嗦。Python 给了一条捷径：函数体里只要出现 <code>yield</code>，这个函数就变成了<strong>生成器函数</strong>。调用它不会立刻执行函数体，而是返回一个<strong>生成器对象</strong>——一个现成的迭代器。
    </p>
    <p>
      每次对这个生成器调用 <code>next()</code>，函数就从上次暂停的地方继续跑，直到碰到下一个 <code>yield</code>，把值交出去后再次<strong>暂停</strong>，连局部变量的状态都原样保留。<code>yield</code>的关键就在这个「暂停并记住现场」：它把「算一半、给一个、接着算」写成了普通代码的线性流程。
    </p>

    <h2>惰性求值：无限序列为什么可行</h2>
    <p>
      生成器的核心收益是<strong>惰性求值</strong>：值在被 <code>next()</code> 请求的那一刻才计算，而不是一开始全算好。于是无限序列变得顺手——<code>while True: yield n</code> 并不真的会跑一亿次，它只在每次被取用时算一步，内存里始终只保留「当前到几」这一个状态。
    </p>
    <ul>
      <li>占用恒定：无论取到第 10 个还是第 1000 万个，状态几乎不变。</li>
      <li>按需计算：用 <code>takewhile</code>、<code>islice</code> 可以只取前几个就停手，后面的永远不产生。</li>
      <li>可以表示流：读超大文件时可以一行一行产出，而不必整份读进内存。</li>
    </ul>

    <h2>yield from 与生成器表达式</h2>
    <p>
      需要在一个生成器里「转发」另一个可迭代对象的全部元素时，不必手写循环，直接用 <code>yield from</code>：它会依次产出后面那个可迭代对象的每个值，常用的写法比手写 <code>for ... yield</code> 更短，也更清晰。
    </p>
    <p>
      另一种更紧凑的写法是<strong>生成器表达式</strong>，外形像列表推导，但外层是圆括号：<code>(x * x for x in range(10))</code>。它与列表推导的区别正在于「惰性」——列表推导会立刻造出整个列表，生成器表达式只在你迭代时才逐个计算。
    </p>

    <h2>迭代器一次性：耗尽后不可重用</h2>
    <p>
      生成器有个必须记住的脾气：它<strong>只能走一趟</strong>。迭代到 <code>StopIteration</code> 之后，它就停在终点，再调用 <code>next()</code> 只会继续抛 <code>StopIteration</code>，不会从头开始。第二次 <code>for</code> 遍历同一个生成器，什么也拿不到。
    </p>
    <p>
      原因还是那个「保留现场」：现场已经走到了尽头。需要重复使用，就得重新调用生成器函数拿到一个<strong>新的生成器对象</strong>，或者干脆把结果落成一个列表（代价是失去惰性）。也正因如此，把生成器当作「可反复遍历的序列」来用，是一个常见误区。
    </p>

    <h2>看一遍生成器的产出与耗尽</h2>
    <figure class="lesson-figure">
      <figcaption>连续点「next(gen)」观察值一个一个被吐出；在「有限生成器」里把它点到耗尽，看 <code>StopIteration</code> 的出现；再切到「无限生成器」，体会取之不尽却不占内存。</figcaption>
      <PY10Generators />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      可迭代对象负责交出迭代器，迭代器负责一次给一个；<code>for</code> 不过是反复 <code>next()</code> 直到 <code>StopIteration</code>。含 <code>yield</code> 的函数会返回一个生成器，它靠「暂停并记住现场」实现惰性求值，因而无限序列、大数据流都能从容应对。<code>yield from</code> 与生成器表达式是两种更省笔墨的写法。最后记牢：迭代器一趟用完即止，想再来一次得新建一个。
    </p>
    <div class="lesson-term">
      <span class="term-name">「生成器」</span>指用 <code>yield</code> 产出值的函数所返回的对象，它既是可迭代对象也是迭代器，每次取值时才计算下一个元素并暂停。边界与例外：生成器只能遍历一次，耗尽后不会复位；需要重复使用时必须重新调用生成器函数或改用容器保存结果。
    </div>
  </LessonArticle>
</template>
