<script setup lang="ts">
import CPP14OperatorOverloading from './CPP14OperatorOverloading.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个二维向量类，很想直接写 <code>v1 + v2</code>，还想让 <code>std::cout &lt;&lt; v1</code> 能打印它，可 <code>+</code> 一写出来编译器就报错——变量明明是你亲手定义的类，为什么 <code>+</code> 的直觉在这里不成立？
    </div>

    <h2>提出问题</h2>
    <p>
      你希望自定义类型用起来像内置类型：分数能相加、日期能比较、向量能打印。最朴素的方式是给类加成员函数：<code>v.add(other)</code> 做加法、<code>v.print()</code> 做输出。
    </p>
    <p>
      这套写法能跑，但把成本留给了使用者：
    </p>
    <ul>
      <li>调用处读起来是"方法调用"而不是表达式，<code>a + b + c</code> 得拆成 <code>a.add(b).add(c)</code>，可读性明显下降。</li>
      <li><code>std::cout &lt;&lt; v</code> 这种写法根本没法做成成员函数——成员函数的左操作数必须是本类对象，而这里左边是 <code>std::ostream</code>。</li>
      <li>默认的 <code>v1 == v2</code> 比较的是对象地址而不是内容，得到的是"是不是同一个对象"，不是"值是否相等"。</li>
      <li>每种类型都有一批各自命名的方法，用户得逐个记住，无法沿用内置类型的经验。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能让自定义类型也支持 <code>+</code>、<code>==</code>、<code>&lt;&lt;</code> 这些运算符，而且行为符合大家对这个运算符的直觉？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，就是把运算都写成普通成员函数：<code>Vector add(const Vector&amp; other) const</code>、<code>bool equals(const Vector&amp; other) const</code>、<code>void print() const</code>。
    </p>
    <p>
      它做对了一件实实在在的事：<strong>把运算的语义收进了类型自己的接口里</strong>——逻辑正确、可以复用，也不需要用户去碰私有成员。问题只在于，这些接口没有"长成运算符的样子"。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>v1.add(v2)</code> 缺失表达力；连续运算如 <code>a + b + c</code> 写成 <code>a.add(b).add(c)</code>，一眼看不出是"三数相加"。</li>
      <li><code>std::cout &lt;&lt; x</code> 无法写成成员函数，因为左操作数是 <code>std::ostream</code> 而不是你的类型。</li>
      <li><code>v1 == v2</code> 走的是内置的地址比较，结果几乎总是 <code>false</code>，与"两向量相等"的本意完全不符。</li>
      <li>用户要面对一长串方法名，使用体验和内置类型割裂开来。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这些函数，只是给它们换上运算符的"外壳"：把函数名从 <code>add</code> 改成 <code>operator+</code>，语言就允许你用 <code>v1 + v2</code> 来调用它。这就是<strong>运算符重载</strong>——不是发明新语法，而是让自定义类型接入已有的运算符。
    </p>
    <p>
      第一步，先做能做成成员的那些：
    </p>
    <p>
      <code>Vector operator+(const Vector&amp; other) const { return Vector(x + other.x, y + other.y); }</code>
    </p>
    <p>
      注意它返回的是一个<strong>新对象</strong>，不修改任何一个操作数——这正符合 <code>+</code> 的直觉：<code>a + b</code> 不该让 <code>a</code> 或 <code>b</code> 发生变化。末尾的 <code>const</code> 表示"加法不改自己"。
    </p>
    <p>
      第二步，判断哪些运算符<strong>不能</strong>写成成员，只能写成<strong>全局函数</strong>。规则很朴素：成员函数的左操作数必须是本类对象。凡是左操作数不是你的类型、或者两边地位需要对称的运算符，都只能放在类外：
    </p>
    <ul>
      <li><code>operator&lt;&lt;</code> 与 <code>operator&gt;&gt;</code>：左操作数是 <code>std::ostream</code> / <code>std::istream</code>，所以必须写成全局函数。它要访问私有成员，就在类里把它声明为 <code>friend</code>。</li>
      <li><code>==</code>、<code>&lt;</code>、<code>+</code> 这类两边对等的运算符：写成全局函数才能让 <code>1 + v</code>（左操作数不是本类）也匹配得上，同时保证对称性成立。</li>
    </ul>
    <p>
      <code>friend std::ostream&amp; operator&lt;&lt;(std::ostream&amp; os, const Vector&amp; v) { os &lt;&lt; "(" &lt;&lt; v.x &lt;&lt; ", " &lt;&lt; v.y &lt;&lt; ")"; return os; }</code>
    </p>
    <p>
      这里有个细节：它<strong>返回 <code>os</code> 的引用</strong>，而不是 <code>void</code>，否则 <code>std::cout &lt;&lt; a &lt;&lt; b</code> 就没法链式连着写。
    </p>
    <p>
      第三步，也是重载最容易翻车的地方——<strong>守住所重载运算符的约定语义</strong>。换了语法，但大家对这个运算符的期待没变：
    </p>
    <ul>
      <li>比较运算符返回 <code>bool</code>；算术运算符返回新对象、不修改操作数；复合赋值（<code>+=</code>）返回引用、修改左操作数；下标 <code>operator[]</code> 返回引用。</li>
      <li><code>==</code> 与 <code>!=</code> 成对实现（通常用 <code>==</code> 写出 <code>!=</code>），<code>&lt;</code> 与 <code>&gt;</code> 成对；<code>&lt;</code> 用于排序时必须满足<strong>严格弱序</strong>。</li>
      <li>反面例子：把 <code>operator+</code> 写成"修改自己并返回引用"，<code>v1 + v2</code> 会偷偷改掉 <code>v1</code>——能编译，但语义全错，这类 bug 极难查。</li>
    </ul>
    <p>
      第四步，补两个高频惯用法：
    </p>
    <ol class="lesson-steps">
      <li>递增 / 递减要区分前缀和后缀：前缀 <code>T&amp; operator++()</code> 返回引用（支持 <code>++obj</code>）；后缀 <code>T operator++(int)</code> 用一个占位 <code>int</code> 参数区分，返回<strong>旧状态的副本</strong>。</li>
      <li>下标运算符提供两个版本：非 const 版本返回普通引用（可写），const 版本返回 const 引用（只读）——因为 const 对象调不到非 const 的重载。</li>
    </ol>
    <p>
      还有几条边界要记牢。<code>operator=</code> 必须定义为成员函数，不能是全局函数；<code>operator()</code> 让对象能像函数一样被调用（仿函数），标准库算法大量用它；<code>operator*</code> 与 <code>operator-&gt;</code> 用于实现智能指针和迭代器，给自定义类型以指针语义；转换运算符 <code>operator 类型()</code> 要谨慎，它会造成意外的隐式转换，C++11 起可用 <code>explicit</code> 加以限制。至于 <code>::</code>、<code>.*</code>、<code>.</code>、<code>?:</code> 这四个，语言干脆不允许重载。
    </p>
    <div class="lesson-box warn">
      <strong>重载不能改变运算符的"规则"，只能改变它的"作用对象"：</strong>优先级、结合性、操作数个数都不能动——<code>+</code> 永远是二元、<code>*</code> 的优先级永远高于 <code>+</code>；也不能给内置类型重新定义含义。所以不要为了炫技而给无意义的运算符安排反直觉的语义，使用者会因此踩坑。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码看清四个运算符的分工：<code>v1 + v2</code> 返回新向量、<code>v1 * v2</code>（点积）返回一个 <code>double</code>、<code>v1[0]</code> 按下标取分量、<code>std::cout &lt;&lt; v1</code> 走的是类外的 <code>friend operator&lt;&lt;</code>——想想后两个为什么不能做成成员函数。</figcaption>
      <CPP14OperatorOverloading />
    </figure>

    <h2>总结</h2>
    <p>
      运算符重载不是造语法，而是给自定义类型一个和内置类型一致的表达方式。选对它该做成员还是全局（看左操作数是不是本类、要不要对称性），守住每个运算符约定俗成的语义（算术返回新对象、复合赋值返回引用、比较成对实现、<code>&lt;</code> 满足严格弱序），你的类型就能自然地融进 <code>+</code>、<code>==</code>、<code>&lt;&lt;</code> 这些表达式里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「严格弱序」</span>指用 <code>&lt;</code> 为元素定义排序时，这个比较必须满足的一组性质：任何元素都不小于自身（不可自反），比较结果在传递上保持自洽，且"互不小于"构成等价关系。它是 <code>std::sort</code>、<code>std::map</code>、<code>std::set</code> 等有序算法的前提——一旦违反（例如写成一个会随状态变化的比较），行为是未定义的，可能直接崩溃；与它相对，<code>operator==</code> 只需要表达"值相等"这一点。
    </div>
  </LessonArticle>
</template>
