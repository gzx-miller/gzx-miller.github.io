<script setup lang="ts">
import CPP19LambdaExpressions from './CPP19LambdaExpressions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想给 <code>std::sort</code> 传一条「按成绩降序」的规则，按老办法要么在类外另写一个只被调用一次的函数，要么专门定义一个只为了塞进参数列表的仿函数类 —— 有没有办法把这一小段逻辑就地写出来，还顺带带上外部的阈值？
    </div>

    <h2>先朴素做法：命名函数与函数对象</h2>
    <p>
      算法需要的从来不是一个「值」，而是一段<strong>可调用对象</strong>（callable）。最直接的朴素做法有两种。
    </p>
    <ul>
      <li><strong>单独写一个命名函数</strong>：把比较规则写成顶层函数，把函数名（会退化成函数指针）传给 <code>std::sort</code>。</li>
      <li><strong>写一个函数对象</strong>：定义一个重载了 <code>operator()</code> 的类，实例化后传进去。</li>
    </ul>
    <p>
      朴素做法做对了两件事：规则可以复用，也能携带状态（仿函数把阈值存成成员）。但不足同样明显：为了一个只用一次、只写三行的规则，你被迫在类外多造一个名字或一整个类；逻辑离使用现场很远，读代码时要来回跳转。更麻烦的是，函数指针无法携带运行时状态，想带上阈值就只能上仿函数，样板代码随之膨胀。
    </p>

    <h2>Lambda：就地写出可调用对象</h2>
    <p>
      C++11 想解决的正是「就地定义一小段逻辑」这件事，于是给出 lambda 表达式，语法为 <code>[capture](params) -&gt; ret { body }</code>：<code>[capture]</code> 是捕获列表，后面依次是参数列表、可选的返回类型和函数体。<code>[]() { ... }</code> 就是一个匿名函数。
    </p>
    <p>
      关键要认识到：<strong>lambda 不是一个函数，而是一个对象的字面量</strong> —— 编译器为它生成一个唯一的<strong>闭包类型</strong>（closure type），该类型重载了 <code>operator()</code>。因此每个 lambda 的类型都独一无二且写不出来，只能交给 <code>auto</code> 去接收，或用 <code>std::function</code> 包装成统一类型。也正因为它本质是对象，lambda 才能被拷贝、被存进容器、被当作成员。
    </p>
    <p>
      把 lambda 传给算法时，它等价于那个手写的仿函数 —— 只不过这个类由编译器替你生成，没有名字，也不能再被别人复用。这正是它「就地」的代价与收益。
    </p>

    <h2>捕获列表：值捕获、引用捕获与 this</h2>
    <p>
      lambda 的一大能力是访问外部变量，但外部变量不会自动进入函数体，必须在捕获列表里显式声明。捕获方式决定了 lambda 与外部世界的连接是「快照」还是「通道」。
    </p>
    <ul>
      <li><code>[x]</code>：<strong>值捕获</strong>，在 lambda 创建时复制一份 <code>x</code>。之后外部 <code>x</code> 怎么变都与它无关，副本在 lambda 内默认是 <code>const</code> 的。</li>
      <li><code>[&amp;x]</code>：<strong>引用捕获</strong>，捕获的是 <code>x</code> 的引用，调用时读到的永远是外部的最新值。</li>
      <li><code>[=]</code> / <code>[&amp;]</code>：默认按值 / 按引用捕获所有用到的自动变量。</li>
      <li><code>[x, &amp;y]</code>：混合捕获，按需分别指定，往往比 <code>[=]</code> / <code>[&amp;]</code> 更清晰、更安全。</li>
      <li><code>[this]</code>：在成员函数里捕获 <code>this</code> 指针，从而访问成员；C++17 起还可写 <code>[*this]</code> 按值捕获整个对象的副本。</li>
    </ul>
    <p>
      选择的原则很简单：需要「记住当下的值、之后不随外部变化」就用值捕获；需要「实时读改写外部状态」才用引用捕获。默认捕获 <code>[=]</code> / <code>[&amp;]</code> 虽然省事，却会把用到的所有变量一并捕获，其中 <code>[=]</code> 在成员函数里会隐式捕获 <code>this</code>，是最常见的隐患来源，因此能显式列出就不要偷懒。
    </p>

    <h2>mutable、返回类型推导与泛型 lambda</h2>
    <p>
      值捕获的副本默认不可修改：若 lambda 体内要改写它，必须把 lambda 声明为 <code>mutable</code>。这里要特别留意，<code>mutable</code> 改的是<strong>副本</strong>，外部的原变量纹丝不动 —— 这与「用引用捕获去真正修改外部变量」是两回事，二者目的不同。
    </p>
    <p>
      返回类型通常无需写出：函数体只有一条 <code>return</code> 语句时编译器按该表达式推导；有多条返回语句且类型不一致时，则需用 <code>-&gt; ret</code> 显式指定。C++14 起函数体里可以写任意复杂语句，推导规则也放宽，但「返回类型要能唯一确定」这条约束始终成立。
    </p>
    <p>
      另一个 C++14 能力是<strong>泛型 lambda</strong>：把参数写成 <code>auto</code>，如 <code>[](auto a, auto b) { return a + b; }</code>。它等价于一个模板化的 <code>operator()</code>，同一个 lambda 可对不同参数类型分别实例化。代价是它不再有单一的调用签名，无法直接转成函数指针去传给按具体类型取回调的接口。
    </p>

    <h2>生命周期陷阱与 std::function 的配合</h2>
    <p>
      lambda 最容易踩的坑几乎都出在<strong>捕获与生命周期的错位</strong>。引用捕获只是借用外部变量，一旦 lambda 活过了被捕获变量的生命周期，调用它就会访问已销毁的对象，属于未定义行为。危险往往不在立即调用，而在 lambda 逃逸：被存进 <code>std::function</code>、放进容器，或在函数返回后才异步执行时，栈上的局部变量早已析构。相较之下值捕获是自持副本，逃逸后依然安全。
    </p>
    <p>
      当接口需要一个固定的可调用类型时，可以用 <code>std::function&lt;int(int)&gt;</code> 做类型擦除，把任意签名匹配的 lambda 装进去，代价是一次间接调用开销，且被包装的 lambda 一旦跨出作用域，就必须靠值捕获或初始化捕获来保证安全。C++14 的<strong>初始化捕获</strong> <code>[ptr = std::move(owner)]</code> 允许在捕获时就地构造新变量、把 <code>unique_ptr</code> 之类移动独占的资源搬进 lambda，正好补齐了值捕获不能转移所有权的短板。
    </p>
    <p>
      实践结论：能就地用就用 lambda，能用 <code>auto</code> 接收就用 <code>auto</code>，确实需要统一回调类型或跨作用域保存时再上 <code>std::function</code>；捕获列表尽量显式列出，避开 <code>[=]</code> 在成员函数里对 <code>this</code> 的隐式捕获，并让 lambda 的存活期短于它所引用的一切。
    </p>

    <h2>看一遍 lambda 的各种写法</h2>
    <figure class="lesson-figure">
      <figcaption>示例并列出基本 lambda、带参数 lambda、值捕获、引用捕获（配合 std::for_each 求和）与泛型 lambda 的写法；可对照捕获列表逐条验证捕获语义，并确认值捕获默认是 const、需要 mutable 才能修改这一约定。</figcaption>
      <CPP19LambdaExpressions />
    </figure>

    <h2>把 lambda 当成一个匿名的函数对象</h2>
    <p>
      一旦把 lambda 理解成「编译器现场生成的、唯一类型的函数对象」，它的诸多特性就都有了解释：为什么必须用 <code>auto</code> 接收、为什么泛型 lambda 没有单一签名、为什么捕获本质是往这个对象的成员里塞数据。用好它的关键不在语法，而在每次写捕获列表时都想清楚一件事 —— 我需要的是外部变量的<strong>快照</strong>，还是一条随时可用的<strong>通道</strong>？想清楚这一点，绝大多数悬垂陷阱就能在源头避免。
    </p>
    <div class="lesson-term">
      <span class="term-name">「闭包」</span>指 lambda 表达式在运行期生成的那个对象，它把捕获到的外部变量存成自身成员；<span class="term-name">「闭包类型」</span>是这个对象的唯一匿名类型，由编译器生成。<span class="term-name">「捕获列表」</span>决定这些成员是按值（快照）还是按引用（通道）绑定到外部变量。
    </div>
  </LessonArticle>
</template>
