const o=`<script setup lang="ts">
import CPP26ModernCppCore from './CPP26ModernCppCore.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong><code>std::map&lt;std::string, int&gt;::iterator it = m.find(k);</code> 这样的类型名又长又容易敲错，用 <code>NULL</code> 表示空指针还可能让重载选错版本 —— 有没有办法让编译器替我记住类型、让「空指针」真正是一个指针，顺便把遍历和取值也写得更短？
    </div>

    <h2>先朴素做法：显式类型、NULL、typedef 与下标循环</h2>
    <p>
      C++11 之前，这些事都靠手工完成，每一样都能用，但也各有代价。
    </p>
    <ul>
      <li><strong>写全类型名</strong>：迭代器类型尤其长，改动容器就得改一串声明，转录时极易出错。</li>
      <li><strong>用 <code>NULL</code> 表示空指针</strong>：它本质是宏，通常是 <code>0</code> 或 <code>(void*)0</code>，因此会与整数 <code>0</code> 混淆，在重载决议时可能选中期望整数的版本。</li>
      <li><strong>用 <code>typedef</code> 起别名</strong>：能简化类型，但语法别扭，且<strong>无法定义模板别名</strong>。</li>
      <li><strong>用下标循环遍历</strong>：<code>for (int i = 0; i &lt; n; ++i)</code>，边界、类型容易写错，也依赖容器支持随机访问。</li>
    </ul>
    <p>
      这些做法的共同不足是：把「本可由编译器或语言保证」的义务留给了人手 —— 类型记不住、空指针的类型不安全、别名不够灵活、边界要自己守。现代 C++ 的对应特性正是冲着这些来的。
    </p>

    <h2>auto 与 decltype 的推导规则</h2>
    <p>
      <code>auto</code> 用初始化表达式推导变量类型，省去冗长类型名，也保证变量类型与初始化式一致。但它的推导规则与模板参数一致，有两条必须记牢：
    </p>
    <ul>
      <li>用 <code>auto</code>（不带修饰）推导时，会<strong>丢弃顶层 <code>const</code> 和引用</strong>，并产生一次拷贝。<code>auto a = cr;</code>（<code>cr</code> 是 <code>const int&amp;</code>）得到的是 <code>int</code>，而不是引用。</li>
      <li>要保留引用与 <code>const</code>，必须显式写 <code>auto&amp;</code> 或 <code>const auto&amp;</code>；<code>auto&amp;&amp;</code> 则是转发引用，可绑定任意值类别。</li>
    </ul>
    <p>
      <code>decltype</code> 是另一种推导：<code>decltype(名称)</code> 直接取该名字的<strong>声明类型</strong>（保留 <code>const</code> 与引用）；<code>decltype((表达式))</code>（多加一层括号）取的是<strong>表达式类型</strong>，左值会得到引用类型。C++14 起还可用 <code>auto</code> 作为函数返回类型，由 <code>return</code> 语句推导，但所有返回语句的类型必须一致。
    </p>

    <h2>范围 for 与结构化绑定</h2>
    <p>
      <strong>范围 for</strong> 把「遍历整个容器」写成一个直观形式：<code>for (auto&amp; x : c)</code>。它底层展开为对 <code>begin()</code> / <code>end()</code> 的迭代，因此对数组、标准容器、初始化列表都适用。
    </p>
    <ul>
      <li>需要<strong>修改</strong>元素时用 <code>auto&amp;</code>；<strong>只读</strong>时用 <code>const auto&amp;</code>，避免拷贝大对象；<code>auto</code>（值）会复制每个元素，通常不是本意。</li>
      <li>遍历期间不要增删元素，否则迭代器可能失效。</li>
    </ul>
    <p>
      <strong>结构化绑定</strong>（C++17）更进一步：<code>auto [a, b] = pair;</code> 把聚合对象一次拆成多个具名变量，可用于 <code>pair</code>、<code>tuple</code>、结构体与数组。与范围 for 结合时特别顺手：<code>for (const auto&amp; [key, value] : map)</code> 直接拿到键值对，其中用 <code>&amp;</code> 可避免逐对拷贝。
    </p>

    <h2>nullptr、using 与 enum class</h2>
    <p>
      这三者各自修掉一个「语言层面的隐患」。
    </p>
    <ul>
      <li><code>nullptr</code> 是类型安全的空指针常量，类型为 <code>std::nullptr_t</code>，<strong>不会</strong>被当成整数 <code>0</code>，从而消除 <code>NULL</code> 带来的重载二义，语义也更清晰。</li>
      <li><code>using</code> 起别名比 <code>typedef</code> 可读性更好，且支持<strong>模板别名</strong>：<code>template &lt;typename T&gt; using Vec = std::vector&lt;T&gt;;</code>，这是 <code>typedef</code> 做不到的。</li>
      <li><code>enum class</code> 是<strong>强类型、有作用域</strong>的枚举：枚举值必须加 <code>Color::</code> 前缀，不会泄漏到外层作用域，也不隐式转换成整数，需显式 <code>static_cast</code>，还能指定底层类型。相比裸 <code>enum</code> 更不容易撞名、也不易被误当数字运算。</li>
    </ul>

    <h2>统一初始化、initializer_list 与 constexpr</h2>
    <p>
      <strong>花括号初始化</strong>提供了一套统一语法：它可初始化任意对象（含容器、聚合、动态数组），并且<strong>禁止窄化转换</strong>（<code>int i{3.14}</code> 直接编译报错），把原先运行时才暴露的截断提前到编译期。
    </p>
    <ul>
      <li>需要注意一个<strong>优先级陷阱</strong>：当一个类既有 <code>std::initializer_list</code> 构造函数、又有其它构造函数时，花括号会<strong>优先匹配</strong> <code>initializer_list</code> 版本。于是 <code>std::vector&lt;int&gt; a(10, 20)</code> 是「10 个值 20」，而 <code>std::vector&lt;int&gt; b{10, 20}</code> 是「两个元素 10 和 20」，含义完全不同。</li>
      <li><code>constexpr</code> 声明<strong>编译期的常量与函数</strong>：<code>constexpr int area = square(4);</code> 在编译期算好结果，既能提升运行时性能，也让结果可用于数组长度、模板参数等「必须是常量」的位置。</li>
    </ul>
    <p>
      这些特性单看都是小便利，合起来改变的是一种书写习惯：让编译器承担记忆类型、检查类型、处理边界的工作，人只负责表达意图。
    </p>

    <h2>看一遍这些特性的实际写法</h2>
    <figure class="lesson-figure">
      <figcaption>示例集中展示 auto 类型推导、范围 for 遍历、花括号统一初始化、nullptr 空指针、using 类型别名与 C++17 结构化绑定解构 map 键值对；可逐条对照，验证「让编译器记住类型」这一主线。</figcaption>
      <CPP26ModernCppCore />
    </figure>

    <h2>把重复劳动交还给编译器</h2>
    <p>
      这批特性共享同一条思路：<strong>凡是编译器能推出来、能检查出来的，就不要让人手去重复</strong>。类型记不住就交给 <code>auto</code>；空指针语义模糊就换成 <code>nullptr</code>；别名受限于语法就用 <code>using</code>；枚举容易撞名、被误当整数就用 <code>enum class</code>；足以在编译期确定的值就交给 <code>constexpr</code>。熟练之后，代码会更短，但更短的代码并没有少表达信息 —— 只是把信息交给了语言本身去表达。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型推导」</span>指由初始化表达式或既有类型反推出变量类型，<code>auto</code> 与 <code>decltype</code> 的规则不同。<span class="term-name">「结构化绑定」</span>指把一个聚合对象一次拆成多个具名变量。<span class="term-name">「窄化转换」</span>是可能丢失信息的隐式数值转换，花括号初始化会将其拒于编译期之外。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
