<script setup lang="ts">
import CPP20SmartPointers from './CPP20SmartPointers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用 <code>new</code> 申请的资源本该由 <code>delete</code> 释放，可只要中途有一次提前 <code>return</code>、或某一步抛出异常，<code>delete</code> 就被跳过 —— 有没有一种写法，能让「释放」像栈上的普通变量一样，无论如何都自动发生？
    </div>

    <h2>先朴素做法：new 与 delete 成对出现</h2>
    <p>
      最直接的管理方式是裸指针：<code>new</code> 返回一个指向堆对象的指针，用完再手动 <code>delete</code>。
    </p>
    <ul>
      <li>做对的地方：控制精确，何时申请、何时释放一清二楚，没有隐含成本。</li>
      <li>不足：释放点与申请点被代码路径隔开。函数中途 <code>return</code>、循环里的 <code>continue</code> / <code>break</code>、乃至抛出异常，都会绕过 <code>delete</code>；一旦漏写就是内存泄漏，重复写就是双重释放。</li>
    </ul>
    <p>
      问题的根源是：<strong>手动释放与所有退出路径没有绑定</strong>。只要退出路径多于一条，就总有一天会漏掉。真正需要的，是一种「无论怎么离开作用域都会被执行」的释放时机。
    </p>

    <h2>RAII：把释放交给析构函数</h2>
    <p>
      C++ 恰好提供了这样一个时机：<strong>局部对象离开作用域时，其析构函数一定会被调用</strong> —— 正常返回会，因异常而中断（栈展开）也会。RAII（Resource Acquisition Is Initialization，资源获取即初始化）就是把这个规律用起来：在构造函数中获取资源，在析构函数中释放资源。
    </p>
    <ul>
      <li>资源的生存期与对象的生存期绑定，两者同生共死。</li>
      <li>退出路径再多，也只会触发一次析构，因此不存在「漏掉某条分支」的可能。</li>
      <li>智能指针正是管理「指向对象的指针」的 RAII 包装：内部持有裸指针，析构时执行 <code>delete</code>。</li>
    </ul>
    <p>
      于是「用不用智能指针」不再是风格问题，而是正确性问题：只要资源需要成对地获取与释放，就应该交给一个 RAII 对象来托管。
    </p>

    <h2>unique_ptr：独占所有权</h2>
    <p>
      <code>std::unique_ptr</code> 表达<strong>独占所有权</strong>：同一时刻只有一个 <code>unique_ptr</code> 拥有该对象。这一语义由「不可拷贝」来保证 —— 它的拷贝构造与拷贝赋值被删除，只能通过 <code>std::move</code> 转移。
    </p>
    <ul>
      <li>移动后源指针变为空（<code>nullptr</code>），但对象仍然有效，只是不再拥有资源；转移的是所有权，不是对象本身。</li>
      <li>默认删除器下它是零额外开销的：大小与裸指针相同，几乎可优化到与手写 <code>delete</code> 等价。</li>
      <li>用 <code>std::make_unique&lt;T&gt;(args)</code> 创建（C++14 起），避免裸 <code>new</code>。</li>
      <li>所有权语义也体现在函数边界：作为返回值返回时无需显式 <code>move</code>（有返回值优化与隐式移动）；作为参数需要交出所有权时，才用 <code>std::move</code> 显式转移。</li>
    </ul>

    <h2>shared_ptr、引用计数与 weak_ptr</h2>
    <p>
      <code>std::shared_ptr</code> 表达<strong>共享所有权</strong>：多个 <code>shared_ptr</code> 可指向同一对象，内部用一块<strong>控制块</strong>记录引用计数。每拷贝一次计数加一，每析构一次计数减一，减到零时才真正释放对象。因此可安全地拷贝、放进容器、跨函数传递。
    </p>
    <ul>
      <li>优先用 <code>std::make_shared&lt;T&gt;(args)</code>：它把对象与控制块一次性分配，比 <code>shared_ptr&lt;T&gt;(new T)</code> 更快、更省内存。</li>
      <li>计数增减是原子的（线程安全），但<strong>对象本身不是</strong>：多线程访问同一对象仍要自己加同步。</li>
      <li><strong>循环引用</strong>是它最大的陷阱：A 持有 <code>shared_ptr&lt;B&gt;</code>、B 又持有 <code>shared_ptr&lt;A&gt;</code> 时，两边的计数永远不会归零，对象永不释放。</li>
    </ul>
    <p>
      <code>std::weak_ptr</code> 是配套的解法：它指向 <code>shared_ptr</code> 管理的对象，却<strong>不增加引用计数</strong>。把循环中的一个方向改成 <code>weak_ptr</code> 即可打破循环。要用时通过 <code>lock()</code> 临时提升为 <code>shared_ptr</code> —— 对象还活着就拿到非空指针，已销毁则得到空指针，从而避免了访问已释放对象。
    </p>

    <h2>make_* 与自定义删除器</h2>
    <p>
      创建阶段首选 <code>make_unique</code> / <code>make_shared</code>，除了简洁，更因为它在异常安全上一锤定音：临时对象的构造与智能指针的接管之间不再有可乘之隙。
    </p>
    <ul>
      <li><strong>自定义删除器</strong>：<code>unique_ptr&lt;T, D&gt;</code> 把删除器类型 <code>D</code> 作为模板第二参数，因此 <code>unique_ptr&lt;T, D1&gt;</code> 与 <code>unique_ptr&lt;T, D2&gt;</code> 是不同类型；它适合文件句柄、网络连接等非内存资源。带状态的删除器需作为构造参数传入。</li>
      <li><strong>控制块陷阱</strong>：绝不能用同一个裸指针构造多个 <code>shared_ptr</code>，否则会生成多块控制块，导致重复释放；始终从已有 <code>shared_ptr</code> / <code>unique_ptr</code> 派生。</li>
      <li><strong>this 陷阱</strong>：不要在对象内部用裸 <code>this</code> 构造 <code>shared_ptr</code>。需要返回自身时，让类继承 <code>std::enable_shared_from_this&lt;T&gt;</code> 并调用 <code>shared_from_this()</code>。</li>
    </ul>
    <p>
      选择策略可以一句话概括：能用栈对象就别上堆；确需堆对象就用 <code>unique_ptr</code>；确需共享所有权再上 <code>shared_ptr</code>；裸指针只保留为「非拥有」的观察者，不再用它管理资源。
    </p>

    <h2>看一遍三种所有权的实际行为</h2>
    <figure class="lesson-figure">
      <figcaption>示例在同一段程序里演示 unique_ptr 的创建与 std::move 转移、shared_ptr 的引用计数随作用域增减、以及 weak_ptr 通过 lock() 提升访问；可对照输出验证「独占可移动、共享可计数、弱引用不计入」这三种所有权语义。</figcaption>
      <CPP20SmartPointers />
    </figure>

    <h2>把所有权当作设计的一部分</h2>
    <p>
      智能指针不是「更安全的裸指针」，而是一套<strong>所有权声明</strong>：<code>unique_ptr</code> 说「这里唯一拥有」，<code>shared_ptr</code> 说「这里分享拥有」，<code>weak_ptr</code> 说「这里只观察、不拥有」。把所有权写进类型，编译器就能替你阻止拷贝独占资源、提醒你补充弱引用来切断循环。真正的内存安全，来自在写下每一个指针类型时都想清楚：这个资源，到底归谁管、什么时候放。
    </p>
    <div class="lesson-term">
      <span class="term-name">「RAII」</span>指把资源的获取放进构造函数、释放放进析构函数，使资源生存期与对象生存期绑定的惯用法。<span class="term-name">「所有权」</span>描述谁负责在何时释放资源，智能指针类型本身即是对所有权的声明。<span class="term-name">「控制块」</span>是 <code>shared_ptr</code> 内部记录引用计数与删除器的结构，<span class="term-name">「引用计数」</span>归零时才真正销毁对象。
    </div>
  </LessonArticle>
</template>
