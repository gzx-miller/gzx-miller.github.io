<script setup lang="ts">
import CPP15TemplatesBasics from './CPP15TemplatesBasics.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你先写了 <code>int max(int a, int b)</code>，用来取两个整数里大的那个；第二天要比较两个 <code>double</code>，就把函数复制一份、把 <code>int</code> 全换成 <code>double</code>；再过几天又要比较两个字符串，又复制一份——同一个"取较大值"的算法，为什么每换一种类型都得重抄一遍？
    </div>

    <h2>多类型逻辑重复</h2>
    <p>
      你想写一段"取较大值"的代码，它能用在 int 上、double 上，甚至用在你自己定义的日期或金额上。最朴素的做法就是给每种类型各写一个同名函数（函数重载）。
    </p>
    <p>
      它能跑，代价却落在你身上：
    </p>
    <ul>
      <li>算法逻辑被复制成多份，改一处就得把所有副本一起改，漏一处就是某类型上行为不一致的 bug。</li>
      <li>每支持一种新类型，就要再抄一份实现，工作量随用到的类型数线性增长。</li>
      <li>很多类型你事先根本不知道——库作者不可能穷举用户明天才会定义的类型，所以"重载"这条路注定走不完。</li>
      <li>多份实现之间还要靠人保证语义一致，稍有不慎，同一个名字在不同类型上的表现就差之毫厘。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能只写一份与类型无关的实现，让编译器为每种实际用到的类型自动生成对应版本？</strong>
    </p>

    <h2>重载多份实现</h2>
    <p>
      最省事的办法是老老实实写重载：<code>int max(int, int)</code>、<code>double max(double, double)</code>、字符串版本各来一份。
    </p>
    <p>
      这个方案做对了一件事：<strong>调用语法是统一的</strong>——<code>max(3, 7)</code> 和 <code>max(3.14, 2.71)</code> 用的是同一个名字，调用方不必关心底层是哪份实现。剩下的问题，全在"实现被复制了多份"上。
    </p>

    <h2>新增类型成本</h2>
    <ul>
      <li>几份实现里算法一模一样，只有类型不同；这本身就是一种重复，违反"改一处、生效一处"。</li>
      <li>新增类型要再抄一份，抄的时候还容易抄错（把某处的 <code>int</code> 漏改成 <code>double</code>）。</li>
      <li>覆盖不了未知类型：用户自定义的类型，库没法提前替它写重载。</li>
      <li>重载决议全靠人维护，每个版本的比较语义必须手动保持一致，编译器帮不上忙。</li>
    </ul>

    <h2>类型作为模板参数</h2>
    <p>
      不推翻"一份逻辑服务多种类型"，而是让<strong>类型本身也变成一个参数</strong>——这就是模板。先看函数模板：
    </p>
    <p>
      <code>template &lt;typename T&gt; T max(T a, T b) { return a &gt; b ? a : b; }</code>
    </p>
    <p>
      这里的 <code>T</code> 是一个占位的类型，写的时候你不知道它最终是什么。真正决定它的是<strong>调用</strong>：编译器看到 <code>max(3, 7)</code>，从实参推出 <code>T = int</code>，于是为你生成一份专门的整数版本；看到 <code>max(3.14, 2.71)</code>，推出 <code>T = double</code>，再生成一份浮点版本。这个过程叫<strong>模板实例化</strong>——你只写了一次逻辑，编译器替你生成了若干个具体函数。
    </p>
    <p>
      这里有个必须记住的边界：推导是"从实参来"的。<code>max(3, 3.14)</code> 会让编译器左右为难——第一个实参说要 <code>int</code>，第二个说要 <code>double</code>，<code>T</code> 到底取哪个？推导失败，编译报错。想通过就得显式指定，写成 <code>max&lt;double&gt;(3, 3.14)</code>，把第二个实参隐式转成 double。这是模板推导最常见的报错来源。
    </p>
    <p>
      接着看类模板。它和函数模板有个关键差别：<strong>类模板不能靠推导，定义对象时必须显式写出类型参数</strong>，比如 <code>Pair&lt;int&gt; p(10, 20);</code>。因为编译器无法从一个构造实参反推出你想要的类——<code>Pair&lt;int&gt;</code> 和 <code>Pair&lt;double&gt;</code> 根本是两个不同的类型。
    </p>
    <p>
      类模板还有一个省事又重要的事实：<strong>它的成员函数只有被使用时才实例化</strong>。只要你不调用某个成员，哪怕那个成员对当前类型并不合法，这个类模板的实例化依然是合法的——这正是后来 SFINAE（替换失败并非错误）的基础。
    </p>
    <p>
      再补一个工程上最常踩的坑：<strong>模板的定义通常要放在头文件里。</strong>原因是编译器必须<strong>看到完整的函数体</strong>，才能为具体类型生成代码。若把定义藏在 .cpp 里，另一个源文件只 include 到声明、看不到函数体，就实例化不出来，最后在链接阶段报"找不到符号"。所以模板一般整体写在头文件。
    </p>
    <p>
      然后是<strong>模板特化</strong>：通用版本照顾大多数类型，但个别类型需要特殊处理。例如 <code>Pair&lt;std::string&gt;</code> 想把两个字符串拼起来而不是简单取第一个，就给这个类型单独写一份实现：
    </p>
    <ol class="lesson-steps">
      <li>全特化：把所有模板参数都定下来，<code>template &lt;&gt; class Pair&lt;std::string&gt; { ... };</code>，函数模板和类模板都支持。</li>
      <li>偏特化：只指定部分模板参数，<strong>只有类模板可以，函数模板不行</strong>——函数模板若想要类似效果，得改用重载。</li>
    </ol>
    <p>
      最后是几条语言细节。<code>typename</code> 和 <code>class</code> 在模板参数列表里完全等价，随便用哪个；但在模板内部，引用一个<strong>依赖模板参数的类型的成员</strong>时（例如 <code>typename T::value_type</code>），必须加 <code>typename</code> 前缀，否则编译器会默认把它当成值来解析。函数模板可以和普通函数（乃至别的函数模板）一起重载，重载决议<strong>优先普通函数</strong>，其次才轮到模板实例化的版本。C++11 还引入了别名模板 <code>template &lt;typename T&gt; using Vec = vector&lt;T&gt;;</code>，用来给复杂类型名起短名；以及变长模板，让模板接受任意数量、任意类型的参数，它是 tuple、bind 和完美转发的基础。当返回类型依赖模板参数时，可以用 trailing return type，或直接用 C++14 的 <code>auto</code> 返回类型推导。
    </p>
    <div class="lesson-box warn">
      <strong>模板不会替你把类型"猜圆"：</strong>实参类型不一致（如 <code>max(3, 3.14)</code>）会直接推导失败，必须显式指定模板参数或先统一类型；另外模板定义别拆进 .cpp 单独编译，那样非常容易变成链接错误，而不是你预期中的编译错误。
    </div>

    <h2>模板实例化产物</h2>
    <figure class="lesson-figure">
      <figcaption>看同一份 <code>max</code> 如何被 <code>max(3, 7)</code> 与 <code>max(3.14, 2.71)</code> 分别实例化成整数版和浮点版，以及 <code>Pair&lt;int&gt;</code> 和特化后的 <code>Pair&lt;std::string&gt;</code> 各自长什么样——一份模板，实例出多份具体代码。</figcaption>
      <CPP15TemplatesBasics />
    </figure>

    <h2>泛型参数机制</h2>
    <p>
      模板把"类型"也变成了参数。函数模板在调用时由实参推导出类型、由编译器实例化出具体函数；类模板必须显式写出参数，且成员函数按需实例化。它换来的是一份逻辑服务无数类型，代价则是定义必须让编译器看见（因此放在头文件），并且推导、特化各有各的规则和边界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模板实例化」</span>指模板本身不是可直接使用的代码，编译器在看到具体类型的使用（函数模板由调用实参推导、类模板由你显式指定）时，用该类型替换模板参数、生成一份真正可编译的具体函数或类的过程。边界：函数模板类型由实参推导，实参类型不一致会推导失败；类模板不能推导，必须显式指定参数，且其成员函数只有在被使用时才实例化；正因实例化发生在使用处，模板定义必须让编译器看到（通常整体写在头文件），否则会在链接阶段报找不到符号。
    </div>
  </LessonArticle>
</template>
