<script setup lang="ts">
import CPP08DynamicMemory from './CPP08DynamicMemory.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个数组的长度要等运行起来读到配置才知道，栈上定长的 <code>int arr[10]</code> 显然不够用；于是用 <code>new int[n]</code> 在运行时向堆申请，程序跑起来看着完全正常，可跑久了内存越吃越多，最后被系统杀掉——明明每次都分配成功了，为什么内存却像凭空消失了一样？
    </div>

    <h2>内存的地图：全局区、栈区与堆区</h2>
    <p>
      先捋清楚程序把变量放在哪里。抛开具体实现，一个运行中的程序可以粗略看成三块存储区，它们最本质的差别是<strong>生命周期由谁决定</strong>。
    </p>
    <ul>
      <li><strong>全局区</strong>：全局变量与静态变量住在这里，程序启动时建立、结束时才回收，生命周期与整个进程一致。</li>
      <li><strong>栈区</strong>：函数内的局部变量与函数调用现场放在这里，随函数进入而分配、随函数返回而自动回收，由编译器负责，快而不用管。</li>
      <li><strong>堆区</strong>：一块供程序自由取用的内存池，容量比栈大得多，生命周期<strong>完全由程序员自己掌握</strong>——申请时建立，释放时回收，编译器不会替你做任何事。</li>
    </ul>
    <p>
      栈的优点是省心，缺点是容量有限、生命周期被函数边界框死；堆的优点是灵活，容量大、长度可到运行时确定、还能跨函数存活，缺点就一个字：<strong>累</strong>。谁申请、谁释放、什么时候释放，全部要自己记账。
    </p>

    <h2>new 与 delete：一次分配必须对应一次释放</h2>
    <p>
      要在堆上拿一块内存，用 <code>new</code>；要还回去，用 <code>delete</code>。朴素写法是：
    </p>
    <ul>
      <li><code>int* p = new int;</code>：分配一块 <code>int</code> 大小的内存，内容未初始化。</li>
      <li><code>int* p = new int(42);</code>：分配并直接把内容初始化为 42，返回值是这块内存的地址。</li>
      <li><code>delete p;</code>：释放 <code>p</code> 指向的那块内存，把使用权还给系统。</li>
    </ul>
    <p>
      <code>new</code> 做对的事有两件：一是让<strong>长度可以到运行时才确定</strong>，二是给出一个可传递的<strong>地址</strong>，让这块内存在函数之间流转。代价是它把「什么时候还」这个责任一并交了出来。只 <code>new</code> 不 <code>delete</code>，那块内存就一直被占着，程序再也拿不回来，这就是<strong>内存泄漏</strong>。
    </p>
    <p>
      一个合适的判断标准是：<strong>每个 <code>new</code> 都应在代码里找到一处对应的 <code>delete</code></strong>，而且执行路径上恰好走到一次。做不到这一点，多半就要出问题。
    </p>

    <h2>new[] 与 delete[]：数组是另一本账</h2>
    <p>
      申请数组要写成 <code>new int[n]</code>，释放时必须用 <code>delete[] arr</code>，而不是 <code>delete arr</code>。这对符号看起来只差一对方括号，却是两条独立的规则。
    </p>
    <ul>
      <li><code>int* arr = new int[5]{1, 2, 3, 4, 5};</code>：分配 <code>5</code> 个 <code>int</code> 并逐个初始化。</li>
      <li><code>delete[] arr;</code>：告诉运行时「这是一整个数组，请把每个元素都按数组的方式回收」。</li>
    </ul>
    <p>
      为什么不能混用？因为 <code>new[]</code> 申请时，运行时会额外记录数组长度（实现上常藏在首个元素之前），<code>delete[]</code> 才知道该回收多大一块、该调用多少次元素的析构函数。写成 <code>delete arr</code> 等于只回收了一个元素，其余长度信息被忽略——分配器的记账与释放时的记账对不上，后续再申请内存就可能踩到那块没被正确归还的区域，产生难以复现的内存错乱。
    </p>
    <p>
      简记一句话：<strong>单个对象的 <code>new</code> 配 <code>delete</code>，数组的 <code>new[]</code> 配 <code>delete[]</code></strong>，两者不可互换。
    </p>

    <h2>三类高频事故：泄漏、悬垂与重复释放</h2>
    <p>
      掌握了配对规则，剩下的错误基本集中在三种情形上，它们各自对应指针生命周期的不同阶段。
    </p>
    <ul>
      <li><strong>内存泄漏</strong>：<code>new</code> 之后因为提前 <code>return</code>、抛异常或单纯忘记，迟迟没有 <code>delete</code>。它表现得最安静——程序照常跑，只是占用慢慢涨上去。</li>
      <li><strong>悬垂指针</strong>：<code>delete p</code> 之后再通过 <code>p</code> 读写。此时 <code>p</code> 里存的地址仍指向那块已经归还的内存，但内容随时可能被别处覆盖，<code>*p</code> 取到什么完全无法预料，这类行为在标准里属于<strong>未定义行为</strong>。</li>
      <li><strong>重复释放</strong>：同一块内存 <code>delete</code> 两次（或经两条指针路径各释放一次）。分配器会认为这块内存被归还了两次，内部结构被破坏，往往在后续某次 <code>new</code> 时才突然崩溃，离现场很远。</li>
    </ul>
    <p>
      对付它们的共同习惯很朴素：指针一旦 <code>delete</code>，<strong>立刻把它置为 <code>nullptr</code></strong>。<code>delete nullptr</code> 是安全的空操作，置空之后即使误判、误删也能被挡住，悬垂与重复释放这两类事故的概率会大幅下降；再把「谁拥有这块内存」写进代码结构里（谁申请谁负责释放），则能从源头减少泄漏。
    </p>

    <h2>越界访问：编译器看不见的边界</h2>
    <p>
      还有一类错误与 <code>new/delete</code> 无关，却同样致命。数组 <code>new int[n]</code> 之后，合法下标只有 <code>0</code> 到 <code>n - 1</code>，可 C++ 出于性能考虑<strong>不做运行时越界检查</strong>：<code>arr[n]</code> 或 <code>arr[-1]</code> 在语法上完全合法，编译器不拦，运行时也不报，只是悄悄写坏了相邻的内存——可能是别的变量，也可能是分配器的记账数据。
    </p>
    <p>
      越界是<strong>不可移植、不可预测</strong>的：同一份代码在不同编译器、不同优化级别下表现可能完全不同，定位成本极高。预防手段是明确的：用常量或变量守住循环上界，把数组长度与访问边界放在一起维护；更稳妥的做法是改用 <code>std::vector</code> 这类自带长度、能用 <code>at()</code> 做边界检查的容器。
    </p>

    <h2>看图对照：正确写法与常见陷阱</h2>
    <figure class="lesson-figure">
      <figcaption>这份示例把单个对象的 <code>new/delete</code>、数组的 <code>new[]/delete[]</code>，以及悬垂指针、重复释放、越界这些错误并排放在一起，可逐行对照正确写法，并看到现代 C++ 推荐用智能指针与 <code>std::vector</code> 替代裸 <code>new/delete</code> 的理由。</figcaption>
      <CPP08DynamicMemory />
    </figure>

    <h2>把释放交给析构函数</h2>
    <p>
      一路看下来，栈与堆的根本差别，其实就是<strong>释放这件事由谁负责</strong>：栈交给编译器，堆交给程序员。裸 <code>new/delete</code> 的根本痛点是「人可能忘」。既然如此，能不能让「释放」也变回自动的？答案是把资源<strong>托付给一个对象的生命周期</strong>：在构造函数里 <code>new</code>，在析构函数里 <code>delete</code>。这样不论函数是正常返回还是中途抛异常，只要对象离开作用域，析构函数就一定被调用，释放就一定会发生——这正是 <strong>RAII</strong> 的思路雏形，也是智能指针能把裸指针取而代之的基础。
    </p>
    <div class="lesson-term">
      <span class="term-name">「堆」</span>指程序运行期间可动态申请与释放的内存区域，其生命周期手动管理；<span class="term-name">「内存泄漏」</span>指已申请的内存在失去所有指针引用前未被释放，程序无法再回收；<span class="term-name">「悬垂指针」</span>指指向已释放内存的指针，解引用它属于未定义行为；<span class="term-name">「RAII」</span>即「资源获取即初始化」，把资源的取得放在构造、释放放在析构，借助对象作用域实现自动管理。
    </div>
  </LessonArticle>
</template>
