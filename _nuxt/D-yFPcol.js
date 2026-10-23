const n=`<script setup lang="ts">
import CPP05Functions from './CPP05Functions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写了一个想「把传进来的数改成 100」的函数 <code>void set(int x) { x = 100; }</code>，调用后原变量纹丝不动；把形参改成 <code>int&amp; x</code> 之后却成功了。同样是把变量交给函数，为什么「传值」和「传引用」的结果完全相反？
    </div>

    <h2>先朴素做法：把函数当成一个「可复用的动作」</h2>
    <p>
      函数最朴素的动机是<strong>把重复的代码打包起来</strong>：一段「算两个数之和」的逻辑写一次，起个名字 <code>add</code>，之后到处调用。它做对了什么？函数做到了三样事——给动作命名、把参数收进一个明确的口子、把结果通过 <code>return</code> 送出来。这样调用方只关心「给什么、拿什么」，不必再关心内部怎么写。
    </p>
    <p>
      问题从「参数怎么进函数」开始。C++ 的形参默认是<strong>按值传递</strong>：调用时把实参<strong>复制</strong>一份给形参，函数体内操作的是这份副本，原变量不受影响。返回上面的例子——<code>set(int x)</code> 里改的是副本，所以外界看不到变化。要让函数改到调用方的原对象，就得换一种传递方式。
    </p>

    <h2>参数传递的四种方式</h2>
    <p>
      这是本章的核心，把四种方式摊开对照：
    </p>
    <ul>
      <li><strong>按值传递</strong> <code>void f(int x)</code>：复制实参。适合小对象（<code>int</code>、<code>double</code>、指针），也正因拷贝而天然与外界隔离，函数无法改到原值。</li>
      <li><strong>按引用传递</strong> <code>void f(int&amp; x)</code>：形参是实参的<strong>别名</strong>，不加拷贝，改形参即改实参。适合「函数需要修改调用方对象」的场景。</li>
      <li><strong>按 const 引用传递</strong> <code>void f(const std::string&amp; s)</code>：同样是别名，避免拷贝，但函数内不能修改它。大对象只读时这是<strong>推荐默认写法</strong>。</li>
      <li><strong>按指针传递</strong> <code>void f(int* p)</code>：传的是地址，函数内用 <code>*p</code> 访问原对象；指针可以是 <code>nullptr</code>，因此适合表达「这个参数可选」。</li>
    </ul>
    <p>
      选择逻辑一句话概括：<strong>不需要改原值、且对象小，用按值；不需要改、对象大，用 const 引用；需要改原值，用引用；「可能没有」这个参数，用指针</strong>。把默认写法定为 <code>const&amp;</code>，既省掉大对象的拷贝开销，又用 <code>const</code> 声明了「只读」的契约，出错时编译器会替我们拦下。
    </p>

    <h2>默认实参与返回值</h2>
    <p>
      朴素写法里，一个「打印问候」的函数常被写成两个版本：一个带称谓、一个用固定称谓。把两者合成一个，就用到<strong>默认实参</strong>：<code>void greet(const std::string&amp; name = "同学")</code>，调用 <code>greet()</code> 时自动套用默认值，<code>greet("小松鼠")</code> 时用传入值。它做对了什么？减少了重复声明，也让「常见的调用方式」写起来更短。
    </p>
    <p>
      它有一条限制：<strong>默认实参必须从右往左连续给</strong>。若 <code>void f(int a, int b = 2, int c = 3)</code> 合法，则中间或左边单给默认值就要出事——否则编译器无法知道某个实参该对上哪个形参。有关返回值：<code>return</code> 把控制权和结果一并交回调用处；函数返回类型决定了结果的类型，返回值会<strong>拷贝或移动</strong>给调用方的一个临时对象。若写成 <code>const&amp;</code> 返回引用，就要特别小心——绝不能返回指向局部变量的引用，那是个悬垂引用（在指针一章会展开）。
    </p>

    <h2>函数重载与重载决议</h2>
    <p>
      朴素想法是「一个函数名只能对应一种参数」。但「相加」这个动作，对 <code>int</code> 和对 <code>double</code> 在概念上是一回事，硬要起两个名字（<code>addInt</code>、<code>addDouble</code>）就很笨。C++ 的办法是<strong>函数重载</strong>：同名函数可以有多份，靠<strong>参数列表</strong>（个数、类型、顺序）来区分。
    </p>
    <p>
      决定「一次调用究竟命中哪个版本」的过程叫<strong>重载决议</strong>。编译器按「实参到形参转换的优劣」排序：完全匹配最好，需要一次「提升」（如 <code>short</code> 到 <code>int</code>）次之，需要「算术转换」（如 <code>int</code> 到 <code>double</code>）更差。于是 <code>add(1, 2)</code> 命中 <code>int</code> 版、<code>add(1.5, 2.5)</code> 命中 <code>double</code> 版。这里要注意两点：<strong>返回类型不参与重载区分</strong>（只有返回类型不同不构成重载），且当两个版本「一样好」时会出现<strong>二义性（ambiguous）</strong>编译错误。避免二义的常见手段是不给重载留「中间地带」，比如不要让 <code>int</code> 版和 <code>long</code> 版同时接受 <code>short</code>。
    </p>

    <h2>递归与调用栈</h2>
    <p>
      递归指的是<strong>函数直接或间接地调用自己</strong>。<code>factorial(n) = n * factorial(n - 1)</code> 这种写法把「阶乘」的定义原样搬进了代码，简洁得几乎和数学定义一模一样。它做对了什么：把一个大问题拆成「同样形式、但规模更小」的子问题，逻辑非常贴近人的思路。
    </p>
    <p>
      每次递归调用，系统都会在调用栈上压入一个新的<strong>栈帧</strong>，保存本次的局部变量与返回地址。因此递归必须配两个条件才不会出事：
    </p>
    <ul>
      <li><strong>递归基</strong>：一个明确的终止条件，如 <code>if (n &lt;= 1) return 1;</code>，没有它递归永不停止。</li>
      <li><strong>规模收敛</strong>：每次调用都必须让问题<strong>朝递归基靠近</strong>，比如 <code>n</code> 每次减 1。</li>
    </ul>
    <p>
      栈帧是有限的常量空间，递归层数太深会耗尽栈，表现为<strong>栈溢出</strong>崩溃。所以深度可能很大的问题（如遍历长链）应当改用迭代，或改成显式的栈结构。递归的长处是表达力（树、回溯、分治），短处是深度受限——<strong>要在「写得清楚」和「跑得下来」之间权衡</strong>。
    </p>

    <h2>inline 与函数指针基础</h2>
    <p>
      普通函数调用有一次「跳转——返回」的开销。对于那些<strong>很小且被频繁调用</strong>的函数（如取最大值），这点开销占比可观，于是有 <code>inline</code> 关键字：它建议编译器把函数体<strong>就地展开</strong>，省掉调用开销。要说清的是，<code>inline</code> 只是<strong>建议</strong>，编译器可以不采纳；它真正的标准化含义是「允许这个定义出现在多个翻译单元而不报重复定义」，这让「把函数定义写进头文件」成为可能。
    </p>
    <p>
      最后是<strong>函数指针</strong>：函数在程序里也有地址，<code>int (*fp)(int, int) = &amp;add;</code> 让 <code>fp</code> 指向那个函数，之后 <code>fp(1, 2)</code> 等价于 <code>add(1, 2)</code>。它做对了什么？让「函数本身」可以作为数据传递——这正是「对数组排序时传入一个自定义比较规则」这类需求的底层机制，也是回调与策略模式的原型。
    </p>

    <h2>看一遍参数传递与递归示例</h2>
    <figure class="lesson-figure">
      <figcaption>对照这段代码，观察按值、按引用、按 const 引用、按指针四种传参对原变量产生的不同影响，并看同名 add 如何按实参类型命中 int 版或 double 版，以及递归求阶乘的收敛过程。</figcaption>
      <CPP05Functions />
    </figure>

    <h2>把函数当成一份「接口契约」</h2>
    <p>
      函数、参数传递与重载，本质上是给调用方提供一份<strong>接口契约</strong>：名字加参数列表决定「怎么调」，返回类型决定「拿到什么」，传参方式决定「函数有没有权限碰原对象」，默认实参与重载决定「同一动作对不同输入的表现」。递归与函数指针则把这层契约往前推了一步——前者让定义自身可复用，后者让函数能像数据一样被传递。写函数时先定契约（参数用 <code>const&amp;</code> 还是引用、是否需要修改原值），再写实现，代码的边界就会清晰很多。
    </p>
    <div class="lesson-term">
      <span class="term-name">「形参」</span>是函数定义里的参数，<span class="term-name">「实参」</span>是调用时传入的值；<span class="term-name">「重载决议」</span>是按实参到形参的转换优劣挑选重载版本的过程；<span class="term-name">「栈帧」</span>是每次函数调用在调用栈上分配的一块空间，保存局部变量与返回地址；<span class="term-name">「二义性」</span>指多个候选版本优劣相同、编译器无法选择的重载错误。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
