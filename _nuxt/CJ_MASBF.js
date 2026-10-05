const o=`<script setup lang="ts">
import CPP21MoveSemantics from './CPP21MoveSemantics.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个装着几十万条日志的 <code>std::vector&lt;std::string&gt;</code> 从函数里返回、再赋给一个新变量，本以为只是「换个名字指向同一堆数据」，结果这一段肉眼可见地卡了两百毫秒——中间到底复制了什么？
    </div>

    <h2>默认拷贝高成本</h2>
    <p>
      C++ 的默认语义是<strong>拷贝</strong>。<code>T b = a;</code> 在编译器眼里没有任何歧义：它必须为 <code>b</code> 再准备一份和 <code>a</code> 一模一样的东西。如果 <code>T</code> 是持有堆内存的容器，这份「一模一样」意味着新申请一块同样大的内存，再把每个元素逐个复制过去。哪怕 <code>a</code> 只是函数里刚造出来、马上就销毁的临时对象，这份复制也照做不误。
    </p>
    <p>
      在 C++11 之前，想绕开这次复制只有几条笨路，每条都得由人自己承担代价：
    </p>
    <ul>
      <li>改用<strong>指针或引用</strong>传递，复制是省下了，但资源的<strong>归属</strong>没人替你记了：这块内存谁申请、什么时候释放、中途抛异常怎么办，全变成你脑子里的账。</li>
      <li>遇到「临时对象用完即弃」的场景，你没有任何办法告诉编译器「它要死了，资源直接搬走」，只能完整复制一遍再把原件销毁，纯粹白费一遍力气。</li>
      <li>想手动「偷」资源，就得给每个类手写一套 <code>swap</code> 或转移函数，写一个新类重复一遍；漏一个地方就退回复制，而程序照常运行，你根本看不出性能漏在哪。</li>
    </ul>
    <p>
      所以真正的问题是：<strong>能不能让语言区分「这个对象我后面还要用」和「这个对象用完就扔、资源你尽管拿走」，并让这条信息以类型的形式写进代码？</strong>
    </p>

    <h2>手写资源转移函数</h2>
    <p>
      最朴素但真的能跑的做法：给要转移资源的类手写一个成员函数，比如 <code>stealFrom(other)</code>，把 <code>other</code> 手里的指针接过来，再把 <code>other</code> 置空。用的时候显式写 <code>b.stealFrom(a);</code>，数据一个字节都不动，只搬了几个指针。
    </p>
    <p>
      这个方案做对了一件很关键的事：<strong>它证明了「转移资源」和「复制资源」是两种完全不同的操作</strong>，前者只需要搬指针并转移所有权，成本与数据量无关。这个认识是后面一切的起点。
    </p>

    <h2>隐式退化深拷贝</h2>
    <ul>
      <li>它完全依赖调用方记得写。<code>b.stealFrom(a);</code> 少写一次，代码不会报错，只是悄悄退化成深拷贝——你只会觉得「今天有点慢」，找不到原因。</li>
      <li>它对标准库类型毫无办法。你没法给 <code>std::vector</code> 或 <code>std::string</code> 添加成员函数，于是 <code>std::vector&lt;int&gt; v2 = v1;</code> 这条最常见的路径依旧只能拷贝。</li>
      <li>它在「函数返回大对象」时彻底失声。返回值要交给调用者，编译器压根不会去调用你的 <code>stealFrom</code>，该复制还是复制。</li>
      <li>它缺少安全网：如果 <code>stealFrom</code> 之后忘了把 <code>other</code> 置空，两个对象就指向同一块内存，析构时这块内存被释放两次，程序直接崩溃。</li>
    </ul>

    <h2>左值与右值分类</h2>
    <p>
      不推翻「偷资源比复制便宜」这个结论，而是解决它的前提问题：<strong>怎么让编译器自己判断一个对象「能不能被偷」。</strong>第一步是给表达式分类。
    </p>
    <p>
      语言把表达式分成两类值类别：<strong>左值</strong>指有名字、之后还可能被使用的对象，比如 <code>a</code>、<code>v1</code>；<strong>右值</strong>指临时的、马上就要消失的对象，比如字面量、函数返回的临时值。接着引入一种新的引用类型 <code>T&amp;&amp;</code>，叫<strong>右值引用</strong>，它<strong>只能绑定到右值</strong>。于是编译器有了一条明确规则：能匹配到右值引用的重载，说明传进来的对象「可以随便动」。
    </p>
    <p>
      有了这条规则，就能定义一对特殊的成员函数：
    </p>
    <ol class="lesson-steps">
      <li><strong>移动构造函数</strong> <code>T(T&amp;&amp; other) noexcept</code>：接管 <code>other</code> 的资源（通常是直接接过指针），然后把 <code>other</code> 置为「空」状态。</li>
      <li><strong>移动赋值运算符</strong> <code>T&amp; operator=(T&amp;&amp; other) noexcept</code>：先释放自己原来的资源，再接管 <code>other</code> 的，同样把 <code>other</code> 置空。</li>
      <li>两者都必须把源对象留在<strong>有效但不确定</strong>的状态——它还能被析构、被重新赋值，但你不能假设它还是原来的值。</li>
    </ol>
    <p>
      那么怎么把一个左值「标记」成右值，好触发移动？用 <code>std::move</code>。这里有个很容易误解的点：<strong><code>std::move</code> 什么也没移动</strong>，它只做一次类型转换，把左值无条件地转成右值引用，相当于对编译器说「这个对象我不要了」。真正的资源搬运发生在移动构造函数里。<code>std::move</code> 和后面要讲的 <code>std::forward</code> 都是纯编译期操作，不会生成任何运行时代码。
    </p>
    <p>
      补上移动之后，还有三处边界必须处理，顺序不能乱。第一处是 <code>noexcept</code>：标准库容器在扩容搬元素时，要先确认移动构造不会抛异常；如果它可能抛，容器为了保证「失败就当作没发生过」的强异常安全，会<strong>退回使用拷贝</strong>，你写的移动优化就白写了。所以移动构造和移动赋值都应该标记 <code>noexcept</code>。
    </p>
    <p>
      第二处是返回值。像 <code>std::vector&lt;int&gt; f() { std::vector&lt;int&gt; v = {1, 2, 3}; return v; }</code> 这样的函数，编译器会尝试<strong>返回值优化（RVO/NRVO）</strong>，直接在调用者的接收位置上构造 <code>v</code>，一次拷贝或移动都不会发生。因此<strong>不要</strong>画蛇添足地写成 <code>return std::move(v);</code>——那反而会把能原地构造的返回值变成一个需要移动的临时对象，阻止优化。C++17 更进一步，当返回的表达式是纯右值时，这种省略是被标准<strong>强制</strong>保证的。
    </p>
    <p>
      第三处是泛型代码。在模板里写 <code>T&amp;&amp;</code> 时，它往往不是右值引用，而是<strong>转发引用（也叫通用引用）</strong>——如果实参是左值，<code>T</code> 会被推导成左值引用，<code>T&amp;&amp;</code> 也就折叠成了左值引用。想把实参的值类别<strong>原样</strong>传下去，既不能直接传（会变回左值），也不能 <code>std::move</code>（会把左值也变成右值），得配 <code>std::forward&lt;T&gt;</code>，这才叫完美转发。
    </p>
    <div class="lesson-box warn">
      <strong>两个最常见的误区：</strong><code>T&amp;&amp;</code> 写在模板参数或 <code>auto&amp;&amp;</code> 里是转发引用，不是右值引用，它照样能绑定左值；而 <code>std::move</code> 不保证移动一定发生，它只是替你申请了「可以移动」的资格，最终是否移动取决于目标类型有没有移动构造——很多类型根本没有，此时它会安静地退回拷贝。
    </div>
    <p>
      最后把尺度放到整个类上：如果一个类自定义了析构、拷贝构造、拷贝赋值、移动构造、移动赋值中的任何一个，通常就要把五个都考虑一遍，这叫 <strong>Rule of Five</strong>。而更好的做法是 <strong>Rule of Zero</strong>——让所有成员都是已经管好资源的 RAII 类型（下一课的主角），于是这个类一个特殊成员函数都不用写，移动与拷贝语义由成员自动合成，还不会写错。
    </p>

    <h2>被移动对象状态</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码看 <code>std::move</code> 前后两个对象的状态：被移动的 <code>str1</code> 会变空、<code>vec1</code> 的 <code>size()</code> 归零，而 <code>str2</code>、<code>vec2</code> 拿到了全部数据。</figcaption>
      <CPP21MoveSemantics />
    </figure>

    <h2>移动语义类型化</h2>
    <p>
      移动语义把「这个对象可以随便动」从人的口头约定，变成了类型系统里的一个类别。左值代表还要用，右值代表马上就没；右值引用让你只对右值开放「偷资源」的重载，<code>std::move</code> 负责把左值标记成右值，<code>std::forward</code> 负责在模板里原样保持这个标记。守住三条底线：标记 <code>noexcept</code>、别对返回值写 <code>std::move</code>、被移动后的对象只能析构或重新赋值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「值类别」</span>指每个 C++ 表达式所属的分类，最常打交道的两类是<strong>左值</strong>（有名字、之后还可能被使用）与<strong>右值</strong>（临时、马上消失）。移动构造之所以能安全地搬走资源，前提正是编译器能确认实参是右值。要记住两个边界：<code>std::move</code> 只是类型转换，它不移动任何东西；而模板参数与 <code>auto&amp;&amp;</code> 里的 <code>T&amp;&amp;</code> 是转发引用，左值右值都能绑定。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
