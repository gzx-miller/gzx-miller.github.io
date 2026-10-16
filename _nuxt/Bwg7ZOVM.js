const o=`<script setup lang="ts">
import CPP02VariablesTypes from './CPP02VariablesTypes.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>要算一组成绩的平均分，<code>sum</code> 和 <code>count</code> 明明都没算错，可 <code>int average = sum / count;</code> 却把 <code>87.5</code> 写成了 <code>87</code>——数字没错、变量也没错，那小数点后面的 <code>0.5</code> 究竟被什么吞掉了？
    </div>

    <h2>从「丢失的 0.5」说起：先朴素地声明变量</h2>
    <p>
      最直接的做法，是给每个数据起个名字再往里放值：<code>int sum = 350;</code>、<code>int count = 4;</code>，最后 <code>int average = sum / count;</code>。这套写法几乎零门槛，也确实交代了一件重要的事——<strong>每个变量在编译期就必须有确定的类型</strong>，编译器据此决定为它分配几个字节、用整数指令还是浮点指令去运算。
    </p>
    <p>
      问题恰恰出在这个「类型」上。上面式子里的 <code>sum / count</code> 是两个 <code>int</code> 相除，C++ 对整数除法采用<strong>向零取整</strong>：<code>350 / 4</code> 得到 <code>87</code> 而不是 <code>87.5</code>，小数部分在除法进行的那一刻就已丢掉。这不是「算错了」，而是「类型选得不够精确」。想让结果保留小数，得让参与运算的对象里至少有一个是浮点类型——<code>double average = sum / count;</code> 依然不行（右边先按整数算完再赋值），要写成 <code>double average = static_cast&lt;double&gt;(sum) / count;</code>。
    </p>
    <p>
      可见「选类型」不是随手一写的小事。要把它做对，得先知道 C++ 究竟提供了哪些内置类型、各自能装多大的数。
    </p>

    <h2>基本内置类型：按位数与符号排布的一张清单</h2>
    <p>
      把内置类型摊开来看，它其实是两组坐标的组合：<strong>占多少位（宽度）</strong>决定能装下多大的数，<strong>是否有符号</strong>决定能不能装负数。
    </p>
    <ul>
      <li><strong>整数</strong>：<code>short</code>（至少 16 位）、<code>int</code>（通常 32 位）、<code>long</code>、<code>long long</code>（至少 64 位）。标准只规定最小宽度，具体字节数由平台决定，可用 <code>sizeof</code> 实测。</li>
      <li><strong>无符号整数</strong>：在类型名前加 <code>unsigned</code>，如 <code>unsigned int</code>。它只表示非负数，取值范围约为同宽度有符号类型正数部分的两倍。</li>
      <li><strong>浮点</strong>：<code>float</code>（约 6~7 位有效数字）、<code>double</code>（约 15~16 位）、<code>long double</code>。用 <code>double</code> 装整数时，超过 2 的 53 次方就未必能精确表示。</li>
      <li><strong>字符与布尔</strong>：<code>char</code> 占 1 字节，存的是字符编码值，如 <code>'A'</code> 实为 65；<code>bool</code> 取值只有 <code>true</code> 与 <code>false</code>。</li>
    </ul>
    <p>
      这里藏着一个典型坑：同一段代码在 32 位与 64 位平台上，<code>int</code> 可能都是 4 字节，但 <code>long</code> 的宽度会变。凡是对宽度敏感的逻辑（跨平台读写二进制、位运算掩码），都不要凭记忆假定字节数，而应基于标准保证的最小宽度，或直接用固定宽度类型 <code>int32_t</code>、<code>uint64_t</code>。
    </p>
    <p>
      无符号类型的另一个陷阱是「回绕」。<code>unsigned int u = -1;</code> 看着像把负数存进去了，实际是按 2 的 32 次方取模：<code>u</code> 变成 <code>4294967295</code>。更隐蔽的是比较运算——<code>-1 &lt; 0u</code> 的结果是 <code>false</code>，因为「有符号与无符号混用」时，有符号的一方会先被转换成无符号，<code>-1</code> 于是也变成一个极大的正数。类型选择上的一点疏忽，会在比较、循环边界这些地方变成难以察觉的错误。
    </p>

    <h2>声明、初始化与「窄化转换」</h2>
    <p>
      朴素做法通常是「先声明、后赋值」：<code>int x; x = 5;</code>，或用等号凑一步：<code>int x = 5;</code>。它做对了什么？把「分配空间」和「写入初值」两件事分开，语义直白。但它留下的隐患是：若只写 <code>int x;</code> 而忘记赋值，块作用域里的内置类型变量会得到一个<strong>不确定的值</strong>，读它属于未定义行为；而 <code>int x = 3.14;</code> 这种「拿小数初始化整数」会被静默截断成 <code>3</code>，编译器一声不吭。
    </p>
    <p>
      C++ 的迭代是引入<strong>列表初始化</strong>（也称统一初始化）：用花括号包住初值。
    </p>
    <ul>
      <li><code>int a = 5;</code>：拷贝初始化，传统写法。</li>
      <li><code>int b(5);</code>：直接初始化，用圆括号。</li>
      <li><code>int c{5};</code>：列表初始化，C++11 起引入。</li>
      <li><code>int d{};</code>：空花括号即<strong>值初始化</strong>，把对象初始化为 0，替代了容易漏的「忘记初始化」。</li>
    </ul>
    <p>
      花括号最实在的好处是<strong>拒绝窄化转换</strong>：凡是会丢失信息的转换，编译器都会报错。<code>int bad{3.14};</code> 直接编译失败，而同样的内容写成 <code>int bad = 3.14;</code> 只会默默截断。也就是说，花括号把「精度损失」从运行期的静默行为，提前成了编译期的显式报错。代价是多记一种语法形式，但对新代码而言，花括号初始化通常是更安全的首选。
    </p>

    <h2>const、constexpr 与生命周期</h2>
    <p>
      表示「常量」的最老做法是宏：<code>#define PI 3.14159</code>。它做对了什么？预处理器把 <code>PI</code> 原地替换成字面量，零运行时开销。但宏是<strong>纯文本替换</strong>：没有类型、不遵守作用域、也无法被调试器观察，一个拼写疏忽就会产生莫名其妙的编译错误。
    </p>
    <p>
      下一步是用 <code>const</code>。它给常量加上类型与作用域，初始化后不可修改；但「不可改」发生在运行期——<code>const int n = readInput();</code> 完全合法，<code>n</code> 要到程序跑起来才知道值。再进一步是 <code>constexpr</code>：它要求初始化必须是<strong>编译期常量表达式</strong>，于是这类常量能出现在数组长度、模板参数、<code>case</code> 标签等「必须在编译期确定」的位置。
    </p>
    <p>
      一句话区分：<code>const</code> 是「运行期不可改」，<code>constexpr</code> 是「编译期就能算出来」。凡是天然已知的常量，优先 <code>constexpr</code>。
    </p>
    <p>
      与之紧密相关的是<strong>作用域</strong>与<strong>生命周期</strong>。作用域决定「名字在哪儿可见」：块作用域的名字出块即不可见，全局作用域的名字整个程序可见。生命周期则由存储期决定：块里的局部变量是<strong>自动存储期</strong>，进入块时创建、离开块时销毁；全局变量和带 <code>static</code> 的局部变量是<strong>静态存储期</strong>，其中 <code>static</code> 局部变量只在第一次执行到声明时初始化一次，之后跨函数调用一直保留。把这两个概念分清，才能解释「为什么循环里创建的对象每轮都是新的」「为什么 static 计数器能记住上一次的值」。
    </p>

    <h2>auto 与 decltype：把类型交给编译器推导</h2>
    <p>
      手写完整类型有时极其啰嗦，比如 <code>std::vector&lt;int&gt;::iterator it = v.begin();</code>。这类类型不但长，而且一旦容器换了，还得逐处改。C++11 的 <code>auto</code> 让编译器从初始化式推导类型：<code>auto it = v.begin();</code>。
    </p>
    <p>
      <code>auto</code> 的推导规则里有一条必须记住：<strong>它按值推导时会丢弃顶层 <code>const</code> 和引用</strong>。给定 <code>const int ci = 42;</code>，写 <code>auto x = ci;</code> 得到的是 <code>int</code>（<code>const</code> 被丢掉），而 <code>auto&amp; r = ci;</code> 得到的是 <code>const int&amp;</code>（保留 <code>const</code>）。所以想保留限定符，就显式写成 <code>const auto&amp;</code> 或 <code>auto&amp;</code>。
    </p>
    <p>
      若连「按值」都不想要，而是要<strong>原样照抄</strong>表达式的类型，就用 <code>decltype</code>：<code>decltype(ci) w = 7;</code> 得到的是带 <code>const</code> 的 <code>const int</code>，引用与 <code>const</code> 全部保留。二者的分工可以概括为：<code>auto</code> 图省事、会做类型消解；<code>decltype</code> 要精确、会原样保留。
    </p>

    <h2>输入输出：类型安全的流与格式控制</h2>
    <p>
      早期的做法是 C 风格的 <code>printf</code> / <code>scanf</code>：优点是把格式写在一根字符串里、控制集中，缺点是<strong>格式串和参数类型各写各的</strong>，<code>%d</code> 对上一个 <code>double</code> 就是未定义行为，编译器也无从检查。
    </p>
    <p>
      C++ 的迭代是 <code>std::cout &lt;&lt;</code> 与 <code>std::cin &gt;&gt;</code>。这里的 <code>&lt;&lt;</code> 和 <code>&gt;&gt;</code> 不是位移运算，而是被重载出来的「输出流插入」与「输入流提取」运算符：编译器会按实参类型挑选对应的重载版本，因此类型不匹配会在编译期被拦下。链式书写 <code>std::cout &lt;&lt; a &lt;&lt; b;</code> 则是把前一次的输出流结果作为下一次的左操作数，逐段拼出整行。
    </p>
    <ul>
      <li><code>std::endl</code> 既换行又刷新缓冲区，而 <code>'\\n'</code> 只换行。频繁输出时用 <code>'\\n'</code> 可以减少不必要的刷新。</li>
      <li>格式控制由 <code>&lt;iomanip&gt;</code> 提供，例如 <code>std::fixed</code> 配合 <code>std::setprecision(2)</code> 把浮点固定输出两位小数。</li>
      <li>输入可能失败：当 <code>std::cin</code> 读不到符合类型的值时，会置位 <code>failbit</code>，此时 <code>if (std::cin &gt;&gt; x)</code> 判定为失败，需要 <code>std::cin.clear()</code> 清除状态才能继续读。</li>
    </ul>
    <p>
      最后回到最初那个坑：<code>std::cin</code> 向 <code>unsigned</code> 变量读入负数时会直接回绕成一个大正数——「输入输出的类型安全」与「类型选择」其实是同一件事的两面。
    </p>

    <h2>看一遍类型与转换的对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「基本类型 / 初始化方式 / 类型转换」三个标签，对照各类型的字节数与取值范围，观察统一初始化如何拦截窄化转换，以及有符号转无符号带来的意外结果。</figcaption>
      <CPP02VariablesTypes />
    </figure>

    <h2>把类型当成一份「值域台账」</h2>
    <p>
      变量、类型与输入输出，本质上是一份<strong>值域台账</strong>：每个对象都有确定的类型，类型划定它能装下什么、能参与哪种运算；声明决定名字可见的范围，存储期决定它活多久。写代码时先问「这个值可能多大、要不要负数、要不要小数」，再选类型；用花括号初始化把窄化转换挡在编译期；输出时交给重载的流、别用裸格式串。把这几条固定下来，前面那种「结果少了个 0.5」的问题，就会在编译阶段暴露，而不是悄悄溜进运行结果里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「对象」</span>指一块有名字、有类型的存储区域；<span class="term-name">「值域」</span>是类型能表示的数集，由宽度与符号共同决定；<span class="term-name">「窄化转换」</span>指会丢失信息的隐式转换，列表初始化会拒绝它；<span class="term-name">「存储期」</span>决定对象的生命周期，局部变量是自动存储期，全局与 <code>static</code> 变量是静态存储期。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
