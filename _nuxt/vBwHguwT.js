const n=`<script setup lang="ts">
import CPP07PointersReferences from './CPP07PointersReferences.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个函数接受指针 <code>int* p</code>，当你传进一个已经离开作用域的局部变量的地址时，函数里的 <code>*p</code> 有时能读出「正确」的值，有时却读到一堆垃圾。同样一段代码、同样的语法，为什么结果全凭运气？
    </div>

    <h2>先朴素做法：用变量名直接操作数据</h2>
    <p>
      一开始，我们只认识变量名：<code>int x = 42;</code>，之后 <code>x = 100;</code> 就改了它。这套做法做对了什么？变量名是数据的直接入口，读写都最直观。但有一个场景它办不到——<strong>函数之间想共享同一个对象</strong>。前面函数一章里，按值传递只能改副本，正说明「名字是各管各的」。要让两个地方操作<strong>同一个</strong>对象，就需要一种「指向某块内存」的东西，这便是指针与引用的动因。
    </p>

    <h2>取址与解引用：指针是什么</h2>
    <p>
      指针是一个<strong>存着地址的变量</strong>。要拿到地址，用取址运算符 <code>&amp;</code>：<code>int* p = &amp;x;</code> 让 <code>p</code> 保存 <code>x</code> 的地址。要访问它指向的那块内存，用解引用运算符 <code>*</code>：<code>*p</code> 就是 <code>x</code> 本身，读 <code>*p</code> 得到 42，写 <code>*p = 100;</code> 就把 <code>x</code> 改成了 100。
    </p>
    <p>
      这里有一个人容易混淆的地方：<code>*</code> 和 <code>&amp;</code> 在不同位置含义不同。声明 <code>int* p</code> 时，<code>*</code> 是类型的一部分（表示「指向 int 的指针」），不是运算；而表达式里的 <code>*p</code> 才是解引用运算。同理 <code>int&amp; r = x;</code> 里的 <code>&amp;</code> 表示「引用类型」，表达式里的 <code>&amp;x</code> 才是取址。判断歧义的简单办法是看它出现在<strong>声明</strong>里还是<strong>表达式</strong>里。
    </p>

    <h2>指针算术与数组的关系</h2>
    <p>
      指针不是孤立的地址，它可以做算术，而这正好和数组对上：<code>int arr[] = {10, 20, 30}; int* q = arr;</code>——数组名退化成指向首元素的指针，所以 <code>q</code> 指向 <code>arr[0]</code>。指针加 1 并<strong>不是地址加 1 个字节</strong>，而是<strong>前进一个元素</strong>，即偏移 <code>sizeof(int)</code> 个字节。于是 <code>*(q + 1)</code> 就等价于 <code>arr[1]</code>，得到 20。这也解释了为什么 <code>arr[i]</code> 与 <code>*(arr + i)</code> 是同一件事——下标运算本质就是「指针加偏移再解引用」。
    </p>
    <p>
      指针算术要守住一条边界：只能在<strong>同一数组</strong>（或同一分配块）的范围内移动，指针可以指向「最后一个元素之后」的位置，但越界解引用就是未定义行为。<strong>它做对了「用统一的方式在连续内存上移动」，做不足的仍是「不记录边界」</strong>，边界依旧需要程序员自己守着。
    </p>

    <h2>nullptr 与「const 指针 vs 指向 const 的指针」</h2>
    <p>
      指针有一个内置的「没有指向任何对象」的值：<strong>空指针</strong>。C++11 起用 <code>nullptr</code> 表示它——它是有明确类型的空指针常量，比老式的 <code>NULL</code>（本质是 <code>0</code>）更安全，因为它不会和整数 <code>0</code> 混淆。在解引用之前先判空，是使用指针的基本纪律：<code>if (p != nullptr) { ... *p ... }</code>。
    </p>
    <p>
      再往下一步，是把 <code>const</code> 加进来。指针和 <code>const</code> 组合有<strong>两种截然不同的含义</strong>，读法是从右往左看：
    </p>
    <ul>
      <li><code>const int* p</code>（也可写 <code>int const* p</code>）：「<strong>指向 const int 的指针</strong>」——<code>p</code> 自身可以改指向别处，但<strong>不能通过 <code>p</code> 修改</strong>它指向的值。</li>
      <li><code>int* const p</code>：「<strong>const 指针</strong>」——<code>p</code> 一旦初始化就不能再指向别处，但<strong>可以通过它修改</strong>所指的值。</li>
      <li><code>const int* const p</code>：两者兼有——指针不能重指向，值也不能改。</li>
    </ul>
    <p>
      记住口诀「<strong>const 修饰它左边最近的东西；若左边没有，则修饰右边</strong>」，就能一眼分清 <code>const</code> 约束的到底是「指针本身」还是「被指向的值」。
    </p>

    <h2>引用即别名，以及悬垂、野指针</h2>
    <p>
      引用是 C++ 为「共享同一对象」提供的更省心的工具。<code>int&amp; r = x;</code> 让 <code>r</code> 成为 <code>x</code> 的<strong>别名</strong>：此后对 <code>r</code> 的任何读写都直接作用在 <code>x</code> 上，不需要写 <code>*</code>。与指针相比，引用有三条天然的安全约定：<strong>必须初始化、不能重新绑定、不存在空引用</strong>。所以「引用更像一个改不了指向的、非空的指针」，语法上更轻。这也确立了工程里的取舍：<strong>能表达成引用就别用指针</strong>（函数参数、别名），只有需要「可为空」「可重新指向」「做数组式移动」时，指针才不可替代。
    </p>
    <p>
      指针真正危险的地方，是指向已经不存在的对象，分为两种：
    </p>
    <ul>
      <li><strong>悬垂指针（dangling pointer）</strong>：指针曾指向一个合法对象，但该对象已被销毁（局部变量出了作用域、堆内存被 <code>delete</code>），指针却还在。此时解引用就是未定义行为。</li>
      <li><strong>野指针（wild pointer）</strong>：指针从未被初始化，存着一个随机地址，直接解引用更是未定义行为。</li>
    </ul>
    <p>
      这正好解释了开场的现象：读一块<strong>已经归还、随时可能被复用</strong>的内存，内容自然不可预期，有时「恰好」还是旧值，有时已被覆盖。规避手段是固定成纪律——<strong>指针一律初始化（没有对象就赋 <code>nullptr</code>）、对象销毁后立刻把指针置空、解引用前判空、绝不让引用或指针活过它所指对象的生命周期</strong>。现代 C++ 更推荐用智能指针（<code>unique_ptr</code>、<code>shared_ptr</code>）把「谁负责释放、何时失效」交给类型去管。
    </p>

    <h2>看一遍指针与引用的对照</h2>
    <figure class="lesson-figure">
      <figcaption>对照这段代码，看取址 &amp; 与解引用 * 如何读写同一变量、指针算术如何通过偏移访问数组元素、引用如何作为别名直接修改变量，以及 nullptr 判空与「指针 vs 引用」特性的逐项对照。</figcaption>
      <CPP07PointersReferences />
    </figure>

    <h2>把地址当成一条「通往对象的路」</h2>
    <p>
      指针与引用讲的是同一件事——<strong>如何间接地指向并操作一个对象</strong>。指针保存地址、能算术、可为空、可重指向，是接近机器的灵活工具；引用是别名，必须绑定、不可空、不可重指向，把大多数常见用法表达得更安全。两者共享同一个责任：<strong>必须清楚它指向的对象是否仍然活着</strong>。把「初始化、判空、置空、不越生命周期」这四条当成纪律，悬垂与野指针这两类最难调试的错误就能在很大程度上被挡在门外。
    </p>
    <div class="lesson-term">
      <span class="term-name">「解引用」</span>指通过指针访问它所指向的对象，写作 <code>*p</code>；<span class="term-name">「引用」</span>是对象的别名，必须初始化且不可重新绑定；<span class="term-name">「悬垂指针」</span>指所指对象已销毁而指针未更新的指针；<span class="term-name">「野指针」</span>指未初始化的指针；<span class="term-name">「智能指针」</span>指以类型机制管理对象生命周期的指针封装。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
