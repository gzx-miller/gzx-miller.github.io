<script setup lang="ts">
import CPP27CompileTimeComputation from './CPP27CompileTimeComputation.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个递归计算阶乘的函数，然后拿它的结果当数组长度：<code>int arr[factorial(10)];</code>。编译器一口答应，程序运行时你也查不出任何「计算」的痕迹——这个递归到底在哪跑过？
    </div>

    <h2>提出问题</h2>
    <p>
      有些值必须在程序跑起来<strong>之前</strong>就定下来：数组的长度、模板的非类型参数、编译期就想建好的查找表。这些位置只接受「常量表达式」，运行期算出来的结果再对也填不进去。
    </p>
    <p>
      可普通函数给不了这个保证。编译器看一个普通函数，只知道「调用它会发生点什么」，无法确定它有没有副作用、能不能被提前算出来，于是只能把调用老实留到运行期。这样一来，你想在编译期算的东西全落空，还多背了三笔成本：
    </p>
    <ul>
      <li><strong>性能落在运行期。</strong>本该编译期算完的常量，每次启动都要重新算一遍。</li>
      <li><strong>常量位置用不了。</strong>想拿它当数组长度或模板参数，编译直接报错。</li>
      <li><strong>没有「算错就编译不过」的把关。</strong><code>#define</code> 宏能当常量用，但它没有类型、没有作用域，写错时编译器也无从检查。</li>
    </ul>
    <p>
      所以问题是：<strong>能不能让编译器明确知道「这个函数的结果可以在编译期算出来」，从而放心地提前求值？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的答案：给函数和变量加 <code>constexpr</code>。函数写成 <code>constexpr int factorial(int n)</code>，变量写成 <code>constexpr int N = 1024;</code>，就等于向编译器声明「如果参数都是编译期常量，你可以在编译期把它算完」。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给了函数一张「可以编译期求值」的资格证</strong>。有了这张证，<code>factorial(10)</code> 就能填进需要常量表达式的位置，编译期直接把结果烧进去；<code>constexpr</code> 变量同时也天然是 <code>const</code>，数值不可改。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>constexpr</code> 只是「<strong>可以</strong>」，不是「<strong>必须</strong>」：把运行期读到的值传进去，同一个函数就悄悄退回运行期调用——你以为算好了，其实没有。</li>
      <li>C++11 的 <code>constexpr</code> 函数体限制很死，<strong>基本上只能是一条 <code>return</code></strong>，想用循环就得改写成递归，写起来别扭。</li>
      <li>反过来，<code>constexpr int x = f(input);</code> 里若 <code>input</code> 是个运行期变量，编译器会直接报「不是常量表达式」，逼你改写法。</li>
      <li>想强制「这个函数只能在编译期跑」，<code>constexpr</code> 做不到——它拦不住运行期调用。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻 <code>constexpr</code>，而是把它「可以」的语义按需求往两头收紧，再把不该塞进 <code>constexpr</code> 的场景单独分出去。
    </p>
    <ol class="lesson-steps">
      <li><strong>先放宽函数体。</strong>C++14 起 <code>constexpr</code> 函数可以声明局部变量、写循环、用条件和 <code>switch</code>，几乎和普通函数一样，<code>factorial</code> 终于能用循环写。但底线仍在：函数里不能有 <code>new</code>/<code>delete</code>、<code>goto</code>、静态或局部静态变量这些会引入副作用、无法在编译期完成的操作（关于 <code>throw</code> 还有一处细微差别，见下面的提示）。</li>
      <li><strong>再收紧成「必须」。</strong>当一段逻辑（元编程、反射这类）<strong>只能在编译期完成</strong>时，用 C++20 的 <code>consteval</code>。它声明的是「立即函数」：任何让它在运行期求值的写法都是编译错误，把「确保编译期执行」从愿望变成了硬约束。</li>
      <li><strong>最后处理初始化时机。</strong>全局或静态变量有个老问题——不同翻译单元的静态变量<strong>初始化顺序没有保证</strong>，A 的构造函数里用到 B，B 却可能还没初始化，这就是「静态初始化顺序问题」。<code>constinit</code> 要求变量的初始化必须在编译期完成，把这个顺序依赖按死在编译前；但它只管<strong>初始化</strong>，变量本身在运行期照样可以改。</li>
    </ol>
    <p>
      把三者摆在一起，各自的分工就清楚了：<code>constexpr</code> 是「能编译期也能运行期」的宽松承诺，<code>consteval</code> 是「只能在编译期」的硬要求，<code>constinit</code> 管的是「初始化必须发生在编译期」、与变量可变性无关。拿这把握尺度，就不用再纠结「这里到底该不该加 constexpr」。
    </p>
    <p>
      编译期能算出来的东西也远不止整数。C++20 起 <code>std::vector</code>、<code>std::string</code> 的部分操作被标成 <code>constexpr</code>，配合 <code>constexpr</code> 构造函数，编译期就能构造出真正的容器对象；<code>std::bit_cast</code>（C++20）还能在编译期做位级别的类型重解释，比如把 <code>float</code> 的位表示原样看成 <code>int</code>。这些能力让「编译期计算」从只会算数学题，扩展到能在编译期搭出数据结构。
    </p>
    <div class="lesson-box warn">
      <strong>一个常见误解：</strong><code>constexpr</code> 函数里并不是完全不许出现 <code>throw</code>——C++14 起函数体可以包含 <code>throw</code> 语句和运行时才能判定的分支，但只要这次求值<strong>真的走到抛异常</strong>，它就不再是常量表达式，编译期求值失败。所以不是「写法不允许」，而是「这次求值不合法」。另外，<code>constexpr</code> 并不等于「一定被优化掉或内联」，它约束的是<strong>可求值性</strong>，而不是说这段代码一定在编译期执行。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>看这批代码里三种职责的写法：<code>square</code>、<code>factorial</code> 是能编译期求值的 <code>constexpr</code> 函数，<code>compileTimeOnly</code> 用 <code>consteval</code> 强制在编译期求值，<code>constinit static int y = 42;</code> 则把静态变量的初始化钉在编译期。</figcaption>
      <CPP27CompileTimeComputation />
    </figure>

    <h2>总结</h2>
    <p>
      编译期计算的关键不是「多写一个关键字」，而是<strong>把「这次求值能不能在编译期完成」显式地写进类型系统</strong>。<code>constexpr</code> 说「可以」，<code>consteval</code> 说「必须」，<code>constinit</code> 说「初始化必须在编译期」。先想清楚你要哪一种保证，剩下的交给编译器。
    </p>
    <div class="lesson-term">
      <span class="term-name">「立即函数（consteval）」</span>C++20 引入，指<strong>每一次调用都必须在编译期求值</strong>的函数：任何让它落到运行期的用法都是编译错误。它与 <code>constexpr</code> 的区别在于 <code>constexpr</code> 是「能编译期求值」，传运行期参数时允许退回运行期；<code>consteval</code> 断了这条退路。边界：<code>consteval</code> 函数不能在被取地址后当作运行期函数指针调用，也不能递归调用普通（非立即）函数，否则编译期求值链会断裂。
    </div>
  </LessonArticle>
</template>
