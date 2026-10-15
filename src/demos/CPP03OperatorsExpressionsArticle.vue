<script setup lang="ts">
import CPP03OperatorsExpressions from './CPP03OperatorsExpressions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>下面这个判断想筛出「掩码位为 0」的情况，逻辑上没错，可它永远得不到你想要的结果：<code>if (a &amp; mask == 0)</code>。同样的两个运算符、同样的操作数，为什么多加一对括号 <code>if ((a &amp; mask) == 0)</code> 就对了？
    </div>

    <h2>先朴素做法：把式子照直觉写下来</h2>
    <p>
      写表达式时，多数人是照数学直觉直译的：加法先于乘法、先算括号，比较给出真假，<code>&amp;&amp;</code> 与 <code>||</code> 连着两个条件。这套直觉在小学算术范围内基本不出错，也解释了一个事实——C++ 的运算符<strong>确实有一套确定的优先级与结合律</strong>，表达式不是从左到右随便算的。
    </p>
    <p>
      但直觉覆盖不到的地方恰恰是出错的地方。C++ 的运算符一共几十个，优先级表比四则运算长得多；<code>&amp;</code> 既可能是「按位与」，也可能是「取地址」；<code>&lt;&lt;</code> 既可能是「位移」，也可能是「流插入」。当人凭感觉把这些符号连起来时，编译器却严格按优先级表解析，两边一错位，就出现开场那种「看起来对、结果不对」的表达式。
    </p>
    <p>
      要解决它，得先把运算符分类理清，再谈优先级。
    </p>

    <h2>按用途分类：算术、关系、逻辑与位运算</h2>
    <p>
      把常用运算符按用途摊开：
    </p>
    <ul>
      <li><strong>算术</strong>：<code>+ - * / %</code>。其中 <code>/</code> 对整数是向零取整，<code>%</code> 取余且只能作用于整数。</li>
      <li><strong>关系</strong>：<code>&lt; &lt;= &gt; &gt;=</code> 与 <code>== !=</code>，结果是 <code>bool</code>。</li>
      <li><strong>逻辑</strong>：<code>! &amp;&amp; ||</code>，同样给出 <code>bool</code>，其中 <code>&amp;&amp;</code> 与 <code>||</code> 具有短路性质。</li>
      <li><strong>位运算</strong>：<code>&amp; | ^ ~</code> 与 <code>&lt;&lt; &gt;&gt;</code>，直接操作二进制位，只对整数类型有效。</li>
    </ul>
    <p>
      这里最容易混淆的是「按位」与「逻辑」两组的写法：<code>&amp;</code> 与 <code>&amp;&amp;</code>、<code>|</code> 与 <code>||</code>。它们做的事完全不同——<code>a &amp; b</code> 逐位相与，<code>a &amp;&amp; b</code> 先判断 <code>a</code> 的真假再决定要不要看 <code>b</code>。写条件判断时若手滑少打一个符号，程序可能照样能编译，却做了截然不同的事。
    </p>

    <h2>短路求值：逻辑运算的隐性顺序</h2>
    <p>
      朴素写法里，逻辑运算符常被当成「两个条件都算一遍再合起来」。但 <code>&amp;&amp;</code> 与 <code>||</code> 的真正价值在于<strong>短路求值</strong>：
    </p>
    <ul>
      <li><code>a &amp;&amp; b</code>：先算 <code>a</code>，若 <code>a</code> 为假，整个表达式已确定为假，<code>b</code> <strong>根本不会求值</strong>。</li>
      <li><code>a || b</code>：先算 <code>a</code>，若 <code>a</code> 为真，整个表达式已确定为真，<code>b</code> <strong>根本不会求值</strong>。</li>
    </ul>
    <p>
      这既是优化，也是安全边界。它让「先判空、再解引用」成为一种可靠写法：<code>if (p != nullptr &amp;&amp; *p &gt; 0)</code>——只要前半段不成立，后半段对空指针的解引用就绝不会被执行。反过来也埋了一个坑：如果 <code>b</code> 带着副作用（比如自增），而你以为它总会执行，那么短路发生时副作用就被静默跳过了；<code>if (a &gt; b &amp;&amp; ++x)</code> 里 <code>x</code> 到底加没加，取决于 <code>a &gt; b</code> 的真假。
    </p>

    <h2>优先级、结合律与「直接加括号」</h2>
    <p>
      回到开场的谜题。<code>==</code> 的优先级<strong>高于</strong> <code>&amp;</code>，所以编译器把 <code>a &amp; mask == 0</code> 解析成了 <code>a &amp; (mask == 0)</code>：先算出 <code>mask == 0</code> 这个布尔值，再拿它跟 <code>a</code> 按位与。这跟写代码的人心里想的 <code>(a &amp; mask) == 0</code> 完全不是一回事。加一对括号，就恢复了本意。
    </p>
    <p>
      这类错位的根源是：优先级表很长，但人的短期记忆装不下。<code>==</code> 与 <code>&amp;</code>、<code>&lt;&lt;</code> 与 <code>+ -</code>、<code>?:</code> 与赋值，这几组的相对顺序都反直觉。与其背表，不如把工程习惯定下来：<strong>只要一个表达式里混用了三个以上运算符，就主动加括号显式表达意图</strong>。括号的代价为零，读代码的人（包括三个月后的自己）却能一眼看懂。
    </p>

    <h2>整数提升、算术转换与显式转换</h2>
    <p>
      朴素做法常假定「运算结果就是参与运算的那个类型」。但两个不同类型的值放在一起运算时，C++ 会先做一组隐式转换，这叫<strong>通常算术转换</strong>。它分两步：
    </p>
    <ul>
      <li><strong>整数提升</strong>：比 <code>int</code> 窄的整数类型（<code>char</code>、<code>short</code>、<code>bool</code>）先被提升为 <code>int</code>。所以 <code>char c1 = 100, c2 = 200;</code> 时，<code>c1 + c2</code> 是按 <code>int</code> 算的，结果是 300；若把它塞回 <code>char</code> 才会截断。</li>
      <li><strong>类型对齐</strong>：若一方是有符号、另一方是无符号且宽度相同，有符号的一方会被转成无符号。这正是「<code>-1 &lt; 0u</code> 为假」的由来。</li>
    </ul>
    <p>
      隐式转换方便，却把意图藏了起来。C++ 的迭代是提供一组<strong>命名的显式转换</strong>，让「这里发生了转换」在代码里可见：<code>static_cast</code>（相关类型间的转换、去掉 <code>const</code> 以外的大多数场景）、<code>const_cast</code>（增删 <code>const</code>）、<code>reinterpret_cast</code>（重新解释位模式）、<code>dynamic_cast</code>（多态类型的安全向下转换）。日常最常用的是 <code>static_cast</code>：<code>static_cast&lt;double&gt;(sum) / count</code> 一眼就表明「这里要把整数转成浮点」，比 C 风格的 <code>(double)sum</code> 更容易被搜到、也更安全。
    </p>

    <h2>自增前后缀、求值顺序与未定义行为</h2>
    <p>
      先看自增。朴素理解是「<code>i++</code> 和 <code>++i</code> 都让 <code>i</code> 加 1」，差别只在返回值：<code>i++</code> 返回加之前的旧值，<code>++i</code> 返回加之后的新值。这个理解在单独成句时没问题——<code>i++;</code> 与 <code>++i;</code> 效果一样。差别只在「拿它当表达式的值」时才显现，比如 <code>int a = i++;</code> 与 <code>int a = ++i;</code> 得到的 <code>a</code> 不同，后者也更直接、少一次临时拷贝。
    </p>
    <p>
      更严重的问题在求值顺序。多数运算符（包括 <code>+</code>）<strong>不规定</strong>两侧操作数的求值先后，由编译器自行安排。于是 <code>i = i++;</code> 这种写法里，「读 <code>i</code> 的旧值」和「给 <code>i</code> 加 1」两件事的先后没有保证；若它们在同一表达式里交错，标准将其定义为<strong>未定义行为</strong>——结果可以是任何值，程序也可能直接崩溃。<code>int x = INT_MAX + 1;</code> 则是另一种未定义行为：<strong>有符号整数溢出</strong>在 C++ 中是未定义的，不能指望它回绕成负数；要回绕语义就改用无符号类型。这类问题的共同点是「编译不一定报错、运行结果不可预期」，只能靠写法规避：一条语句里只修改一个变量一次。
    </p>

    <h2>看一遍优先级与陷阱的对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「优先级 / 代码示例 / 常见陷阱」三个标签，核对运算符优先级表，并对照优先级错位、整数提升、未定义行为与有符号溢出这四类典型错误及其修正写法。</figcaption>
      <CPP03OperatorsExpressions />
    </figure>

    <h2>把表达式当成一场「有规则的解析」</h2>
    <p>
      运算符与表达式，说到底是一场<strong>有规则的解析</strong>：编译器按优先级与结合律把符号串拆成树，再按类型规则插入隐式转换。人的直觉与这张规则表不总是一致，所以稳妥的做法是——混用运算符时主动加括号，逻辑运算善用短路特性，涉及不同类型时用 <code>static_cast</code> 把转换写明白，且永远不要在一条语句里重复修改同一个变量。把这些习惯固定下来，表达式就从「碰运气」变成了可预期的确定行为。
    </p>
    <div class="lesson-term">
      <span class="term-name">「优先级」</span>决定相邻运算符谁先结合，<span class="term-name">「结合律」</span>决定同优先级运算符从哪一侧开始；<span class="term-name">「短路求值」</span>指逻辑运算在结果已定时跳过后续操作数的求值；<span class="term-name">「整数提升」</span>把窄于 <code>int</code> 的类型抬到 <code>int</code> 再运算；<span class="term-name">「未定义行为」</span>指标准未规定结果的情形，必须靠写法规避而非依赖。
    </div>
  </LessonArticle>
</template>
