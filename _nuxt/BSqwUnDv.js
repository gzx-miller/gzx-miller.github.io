const o=`<script setup lang="ts">
import CPP14OperatorOverloading from './CPP14OperatorOverloading.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>自定义的 <code>Vector</code> 相加，为什么不能像整数一样直接写 <code>a + b</code>，而非得写成长长一串 <code>a.add(b)</code>？有没有办法让自定义类型也「讲运算符这门语言」？
    </div>

    <h2>朴素做法：给每个操作起一个命名函数</h2>
    <p>
      最稳的起点是老老实实写函数：<code>add()</code> 做加法、<code>addEqual()</code> 累加、<code>equals()</code> 判等、<code>print()</code> 输出。这样做没有歧义，函数名把语义讲得清清楚楚。
    </p>
    <p>
      但随着类型变多，代价浮现出来：一是<strong>调用处啰嗦</strong>，<code>a.add(b).add(c)</code> 读起来不是数学表达式；二是<strong>无法参与通用代码</strong>——标准库排序要求类型支持 <code>&lt;</code>，容器要求支持 <code>==</code>，你的命名函数它们不认识，只能被排除在外。
    </p>

    <h2>运算符重载：本质是把函数换个名字</h2>
    <p>
      C++ 的解法是允许把函数「改名」成运算符。<code>operator+</code> 本质上就是一个名字特殊的函数：当编译器看到 <code>a + b</code>，若 <code>a</code> 是自定义类型，就翻译成调用 <code>a.operator+(b)</code>（成员形式）或 <code>operator+(a, b)</code>（非成员形式）。
    </p>
    <ul>
      <li>可重载的：绝大多数双目（<code>+ - * / == &lt; [] ()</code> …）与单目（<code>++ -- ! * &amp;</code>）运算符。</li>
      <li>不可重载的：<code>::</code>、<code>.</code>、<code>.*</code>、<code>?:</code>——它们要么与语言机制绑定，要么无法用函数模拟其求值语义。</li>
      <li>不能发明新符号：只能为已有运算符赋予自定义类型的含义。</li>
    </ul>

    <h2>成员还是非成员（friend）：看左操作数是谁</h2>
    <p>
      选择实现形式，先看左操作数。若左操作数必然是自定义类型（<code>v1 + v2</code>），就可以写成成员函数，隐式的 <code>this</code> 就是左操作数；若左操作数不是自定义类型（比如 <code>std::cout &lt;&lt; v</code>，左边是流对象），就只能写成非成员函数。
    </p>
    <p>
      <code>&lt;&lt;</code>、<code>&gt;&gt;</code> 属于后者，必须是非成员。当实现需要触碰私有成员时，把非成员声明为 <code>friend</code> 即可获得访问权。至于 <code>==</code>、<code>+</code> 这类讲究对称性的运算符，也常做成非成员，好让左右两边都能参与隐式转换。
    </p>

    <h2>返回值与 const 正确性</h2>
    <p>
      运算符重载最容易出错的地方不在语法，而在返回值形态：
    </p>
    <ul>
      <li>不修改操作数的（<code>+</code>、<code>-</code>、<code>*</code>）：返回<strong>新对象</strong>，成员函数加 <code>const</code>，这样 const 对象也能用。</li>
      <li>修改左操作数的复合赋值（<code>+=</code>）：返回 <code>Vector&amp;</code> 引用 <code>*this</code>，才能支持链式 <code>a += b += c</code>。</li>
      <li>比较运算符（<code>==</code>、<code>&lt;</code>）：返回 <code>bool</code>；<code>==</code> 与 <code>!=</code> 成对实现，<code>&lt;</code> 要满足严格弱序，才能配合排序算法。</li>
      <li>下标 <code>[]</code>：提供两个版本，非 const 返回可写引用，const 返回只读 const 引用。</li>
    </ul>

    <h2>前缀与后缀 ++：一个哑参数区分</h2>
    <p>
      自增有前缀 <code>++c</code> 与后缀 <code>c++</code> 两种写法，语义不同：前缀「先加后用」，后缀「先用后加」。C++ 用参数表区分它们：<code>T&amp; operator++()</code> 是前缀，返回 <code>*this</code> 的引用；<code>T operator++(int)</code> 是后缀，那个没人接收的 <code>int</code> 只是占位，函数先保存旧值副本、再自增、最后返回旧副本。
    </p>
    <p>
      顺带一提，重载 <code>operator()</code> 会让对象变得「可以像函数一样调用」，这类对象叫<strong>函数对象</strong>（仿函数），标准库算法大量依赖它来接收可调用对象。
    </p>

    <h2>看一遍自定义运算符的效果</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中 <code>Vector</code> 的 <code>operator+</code>、<code>operator*</code>、<code>operator&lt;&lt;</code> 与 <code>operator[]</code>，观察重载后自定义类型的使用是否和内置类型一样自然。</figcaption>
      <CPP14OperatorOverloading />
    </figure>

    <h2>赋予语义，而不是发明语义</h2>
    <p>
      运算符重载不是让你随意定义新语义，而是给某个符号绑定一个<strong>符合直觉的既有语义</strong>：<code>+</code> 就该是「合起来」，<code>&lt;</code> 就该是「排序依据」。守住「不改操作数者用 const、返回值/引用按语义选、<code>==</code> 与 <code>&lt;</code> 与通用算法兼容」这几条，自定义类型才能真正融入这门运算符语言。
    </p>
    <div class="lesson-term">
      <span class="term-name">「运算符重载」</span>是为自定义类型定义运算符行为的机制，写法为 <code>operator</code> 加符号；<span class="term-name">「成员形式」</span>把左操作数当作隐式 <code>this</code>，<span class="term-name">「非成员形式」</span>写成普通函数，必要时用 <span class="term-name">「friend」</span> 取得私有成员访问权。重载 <code>operator()</code> 得到的对象叫<span class="term-name">「函数对象」</span>（仿函数）；<code>&lt;</code> 需满足的<span class="term-name">「严格弱序」</span>是它能用于排序的前提。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
