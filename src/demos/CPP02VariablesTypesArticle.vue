<script setup lang="ts">
import CPP02VariablesTypes from './CPP02VariablesTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong><code>int x = 3.14;</code> 编译器一声不吭，<code>x</code> 悄悄变成 3；可你把同样的意思写成 <code>int x{3.14};</code>，编译直接报错、拒绝生成程序——同一个 3.14 塞进 <code>int</code>，为什么两种写法一个静默截断、一个当场翻脸？
    </div>

    <h2>提出问题</h2>
    <p>
      你要在程序里存一个价格，很自然地写 <code>double price = 19.9;</code>；要存一个数量，写 <code>int count = 10;</code>。C++ 是<strong>静态类型语言</strong>：每个变量在写下来的那一刻就要定死类型，编译器据此分配固定大小的内存、决定这串二进制到底该按整数还是按浮点去解释。静态类型最大的好处是很多错误在编译期就能发现，而不是等你运行到那一行才崩。
    </p>
    <p>
      但这份好处是有代价的：<strong>类型是你亲手选的，编译器只会照着你的选择走</strong>。坑大多出现在「两种类型相遇」的时候。你在算式里混着用 <code>int</code> 和 <code>double</code>，语言为了让你少写转换，会自动做隐式转换。可当自动转换发生在「收窄」的方向上——把浮点塞进整数、把 64 位塞进 32 位——它不会报错，只会悄悄丢掉一部分信息。等你发现金额差了 0.9，已经找不到是哪一步丢的。
    </p>
    <p>
      旧办法（随手用一个 <code>=</code> 声明、转换全交给编译器）要人承担的成本：第一，窄化转换静默发生，没有警告你就不会察觉；第二，有符号与无符号混用时，负数会被悄悄转成一个巨大的正数，后面所有比较都错；第三，类型选得随意，等到数据装不下才在运行时发现。
    </p>
    <p>
      所以问题落到：<strong>面对一堆内置类型，我该怎么选、怎么初始化、怎么转换，才能让编译器替我把「丢信息」的风险挡在编译期？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：声明变量时统一用一个 <code>=</code>，类型和转换都交给编译器去配。<code>int x = 3.14;</code> 编译通过、能跑；<code>unsigned u = -1;</code> 也能通过，只是 <code>u</code> 变成了一个大正数。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它足够宽松，让安全和危险的转换在写法上看起来一样</strong>，早期代码可以很快写出来。而且大部分「安全方向」的转换（<code>int</code> 到 <code>double</code>）确实不需要你操心，这也正是语言愿意自动做隐式转换的原因。
    </p>
    <p>
      问题在于，它把「这里其实丢了一个小数位」「这里其实把负数翻成了正数」这两件完全不同的事，写成了和普通赋值一模一样的形式。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>int x = 3.14;</code> 得到 3——小数点后全丢，而编译器默认连个警告都不给（除非你开 <code>-Wconversion</code>）。</li>
      <li><code>unsigned u = -1;</code> 得到 <code>4294967295</code>——负数翻成一个巨大的正数，后续所有参与它的大小判断都错。</li>
      <li><code>-1 &lt; 0u</code> 判断为假——因为比较时 <code>-1</code> 先被转成无符号，成了 4294967295，比 0 还大。你以为在判断「负数小于零」，实际在比一个大正数。</li>
      <li><code>char</code> 到底是有符号还是无符号由实现决定，同一段处理小整数的代码换一个平台，结果可能不同。</li>
      <li>把一个超过 <code>2^31-1</code> 的 <code>long long</code> 塞进 <code>int</code>，高位被直接截掉，得到的值和你预期的毫无关系。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「类型由你自己选」，而是给「选」和「转」各加一道编译期闸门。先补的那一步是<strong>换一种初始化语法</strong>，因为它能立刻挡住最常见的窄化，成本最小。
    </p>
    <p>
      C++11 引入的<strong>统一初始化</strong>用花括号：<code>int x{5};</code>。它和 <code>=</code> 的关键差别在于——<strong>花括号初始化禁止窄化转换</strong>。<code>int x{3.14};</code> 会直接编译报错，编译器宁可让你改代码，也不让你偷偷丢数据。这就是开场两种写法差异的全部来源：<code>=</code> 允许窄化，<code>{}</code> 不允许。花括号还有个附带好处，它能初始化任何类型（数组、结构体、容器），语法统一，减少记忆负担。
    </p>
    <p>
      补完初始化，接着要补的是<strong>「类型该怎么选」的规则</strong>，否则你只是把危险写法换了个皮。能用 <code>int</code> 就用 <code>int</code>，它与机器字长匹配、通常性能最好；<code>short</code> 很少有必要；确定要 64 位大整数才用 <code>long long</code>；要小数且在意精度用 <code>double</code>，别用 <code>float</code>；处理单个字符用 <code>char</code>，但如果当小整数用，就明确写 <code>signed char</code> 或 <code>unsigned char</code>。
    </p>
    <p>
      再往下补的一层是<strong>把转换显式化</strong>。需要截断就写 <code>static_cast&lt;int&gt;(pi)</code>，而不是让编译器替你决定。<code>(int)pi</code> 这种 C 风格转换也能用，但它可能在你不注意时做出更危险的重新解释；C++ 风格的四兄弟——<code>static_cast</code>、<code>dynamic_cast</code>、<code>const_cast</code>、<code>reinterpret_cast</code>——把「我想做的是哪一种转换」写在了脸上，读代码的人一眼能分辨。
    </p>
    <p>
      最后补上<strong>作用域</strong>这一步：变量不是声明了就永远活着。块作用域 <code>{ }</code> 内的变量出了大括号就消失，让它活得尽量短能减少误用。C++17 起还可以把变量直接声明在 <code>if</code> 或 <code>switch</code> 的条件里，写成 <code>if (int x = foo(); x &gt; 0) {...}</code>，<code>x</code> 就只在 <code>if</code> 内部可见，用完即弃。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在「基本类型 / 初始化方式 / 类型转换」三个页签里，对照每种类型的大小与范围、三种初始化写法的差别，以及转换表里那几行「危险示例」各自会得到什么结果。</figcaption>
      <CPP02VariablesTypes />
    </figure>

    <h2>总结</h2>
    <p>
      静态类型把「每个变量是什么」的权力交给你，也把责任交给你。选类型按范围和用途来，初始化优先用花括号让编译器挡住窄化，转换一律显式——这三条合起来，隐式转换带来的「静默丢数据」就被堵在了编译期，而不是留到你翻账单的时候才发现。
    </p>
    <div class="lesson-term">
      <span class="term-name">「窄化转换」</span>指目标类型无法无损容纳源值的转换，例如 <code>double</code> 到 <code>int</code>、<code>long long</code> 到 <code>int</code>、有符号到无符号。C++11 的统一初始化 <code>{}</code> 会在编译期禁止窄化（<code>int x{3.14};</code> 报错），而 <code>=</code> 与 <code>()</code> 形式允许它静默发生。边界：编译器默认不拦窄化，只有 <code>{}</code> 和 <code>-Wconversion</code> 会提醒你。
    </div>
  </LessonArticle>
</template>
