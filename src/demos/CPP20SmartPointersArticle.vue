<script setup lang="ts">
import CPP20SmartPointers from './CPP20SmartPointers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个函数，<code>new</code> 出一个对象，中间几条分支各有各的提前 <code>return</code>。上线后，进程的内存占用随着这个函数的调用次数一路往上爬——你回头数了数，每一处 <code>new</code> 明明都配了 <code>delete</code>，那内存到底是怎么漏出去的？
    </div>

    <h2>堆对象创建与释放</h2>
    <p>
      你要在运行时<strong>按需创建</strong>对象——大小、数量、时机都要等程序跑起来才知道，所以只能在堆上 <code>new</code>，并且得在想清楚「用完了」时把这块内存还回去。最朴素的老办法就是手动 <code>new</code> / <code>delete</code> 配对。它能跑，但代价全压在人身上：
    </p>
    <ul>
      <li><strong>释放点分散</strong>：每一处提前 <code>return</code>、每一次抛出异常、每一个中途分支，都可能<strong>跳过</strong>那行 <code>delete</code>，函数正常跑没问题，一旦走上别的路径就漏了。</li>
      <li><strong>释放时机靠记忆</strong>：哪儿申请、哪儿释放，得靠人记住并保证一定走到，代码一长就没人敢打包票。</li>
      <li><strong>容易重复释放</strong>：两个对象各自持有一份<strong>浅拷贝</strong>的指针，析构时都去 <code>delete</code> 同一块内存，就是 <code>double free</code>。</li>
      <li><strong>所有权不明</strong>：一个函数返回裸指针，调用方根本看不出「这块内存该我 <code>delete</code>，还是别人管」。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能让「释放」这件事不再依赖你手写的那几行，而是自动地、在所有退出路径上都发生？</strong>
    </p>

    <h2>手动配对申请释放</h2>
    <p>
      最直接的做法是继续 <code>new</code> / <code>delete</code> 配对，或者用 <code>try</code> / <code>catch</code> 把 <code>delete</code> 保证执行一遍。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「申请」和「释放」都摊在了明面上</strong>，你完全掌控时机，看得见每一次分配和回收。问题只在于——它把「保证每一步都成对」这个责任，整个交还给了人，而人恰恰是最不可靠的一环。
    </p>

    <h2>提前返回释放漏洞</h2>
    <ul>
      <li>任意一条提前 <code>return</code> 或者中途抛出的异常，都能让那行 <code>delete</code> 彻底走不到。</li>
      <li>默认的拷贝是<strong>浅拷贝</strong>，两个对象析构时对同一块内存各 <code>delete</code> 一次，直接双重释放崩溃。</li>
      <li>如果拿<strong>同一个裸指针</strong>去构造两个 <code>shared_ptr</code>，会生成两个各自独立的控制块，对象会被释放两次。</li>
      <li>函数交了裸指针出来，所有权归属完全靠文档和口头约定，调用方一不小心就漏删或者错删。</li>
    </ul>

    <h2>RAII与所有权划分</h2>
    <p>
      第一层要补的不是「更小心地写 delete」，而是换一个思路：<strong>让某个对象来替你看管那块堆内存，靠它自己的析构自动释放</strong>。这就是 RAII，而 <code>unique_ptr</code> 是它在动态内存上的最基本形态。你把 <code>unique_ptr</code> 当成一个<strong>栈对象</strong>来持有，它内部存着真正的堆指针；无论函数是正常返回、提前 <code>return</code>，还是抛异常退出，栈对象都会被析构，析构函数里替你 <code>delete</code>。<strong>释放时机从此挂在对象生命周期上，不再挂在某一行代码上。</strong>
    </p>
    <p>
      <code>unique_ptr</code> 体现的是<strong>独占所有权</strong>：同一时刻只能有<strong>一个</strong> <code>unique_ptr</code> 拥有那个对象，所以它<strong>不能拷贝、只能移动</strong>。把所有权交出去要显式写 <code>std::move</code>，转移之后原来那个 <code>unique_ptr</code> 变成 <code>nullptr</code>，再去用它就是访问空指针。它的体积和裸指针一样，没有任何额外开销——所以它是<strong>默认首选</strong>。用 <code>std::make_unique&lt;T&gt;(args)</code>（C++14）创建最省事。
    </p>
    <p>
      第二层要补的是「<strong>确实有多个地方要共享同一个对象</strong>」。这就轮到 <code>shared_ptr</code>，它体现<strong>共享所有权</strong>：多个 <code>shared_ptr</code> 可以指向同一个对象，靠一份共享的<strong>控制块</strong>里的引用计数来记「现在有几个持有者」。每拷贝一个计数加一，每销毁一个计数减一，<strong>减到零时才真正释放对象</strong>。用 <code>std::make_shared&lt;T&gt;(args)</code> 创建（C++11），它会把对象和控制块一次分配出来，比其他写法更高效。
    </p>
    <p>
      但共享所有权会引出一个经典死角——<strong>循环引用</strong>。假如对象 A 里有个 <code>shared_ptr</code> 指向 B，B 里又有个 <code>shared_ptr</code> 指回 A，那么它俩的引用计数永远至少是 1，谁都降不到零，最后谁都释放不掉，整块内存静静地泄漏。补这个洞的是 <code>weak_ptr</code>：它是 <code>shared_ptr</code> 的<strong>弱引用</strong>，指向同一个对象却<strong>不增加引用计数</strong>，因此不会阻止对象被释放。要用的时候通过 <code>lock()</code> 把它「提升」成一个临时的 <code>shared_ptr</code>——对象还活着就拿到一个非空的 <code>shared_ptr</code>，已经销毁了就拿到空的。于是双向引用、父子互相引用这类结构，就把其中一侧改成 <code>weak_ptr</code>，环就断开了。
    </p>
    <p>
      补充几条日常写法上的安全边界。创建时<strong>始终用 <code>make_unique</code> / <code>make_shared</code>，或从已有的智能指针构造</strong>，绝不用同一个裸指针去构造多个 <code>shared_ptr</code>。<code>unique_ptr</code> 作为函数<strong>返回值</strong>时不需要显式 <code>std::move</code>（编译器会处理），作为<strong>参数</strong>要转移所有权时才写 <code>std::move</code>。<code>shared_ptr</code> 的<strong>引用计数增减是原子的、线程安全</strong>的，但要注意——它只保护计数本身，<strong>被指向的对象并不是线程安全的</strong>，多线程读写那个对象仍然得你自己加同步。
    </p>
    <div class="lesson-box warn">
      <strong>两个高频陷阱：</strong>其一，<code>unique_ptr</code> 允许带<strong>自定义删除器</strong>（比如关闭文件句柄、断开网络连接），而删除器是<strong>类型的一部分</strong>（模板的第二个参数），所以 <code>unique_ptr&lt;T, D1&gt;</code> 和 <code>unique_ptr&lt;T, D2&gt;</code> 是两个<strong>不同的类型</strong>，不能随意互相赋值。其二，在类内部想把 <code>this</code> 变成 <code>shared_ptr</code> 时，<strong>千万不要用 <code>this</code> 裸指针去构造</strong>（会凭空多出一个独立控制块，最终双重释放），正确做法是让这个类继承 <code>std::enable_shared_from_this&lt;T&gt;</code>，再调用 <code>shared_from_this()</code>。
    </div>
    <p>
      顺着这套逻辑，现代 C++ 的内存策略可以一句话概括：<strong>优先用栈对象</strong>（本来就不需要手动释放）；确实需要堆对象时用 <code>unique_ptr</code>；确实需要共享所有权时才升级到 <code>shared_ptr</code>；共享里出现了环，就用 <code>weak_ptr</code> 打断。而<strong>原始指针退回它该待的位置</strong>——只做「不拥有、只观察」的引用，几乎不再用它来管理资源。
    </p>

    <h2>引用计数与指针置空</h2>
    <figure class="lesson-figure">
      <figcaption>对着代码和选择表看：<code>unique_ptr</code> 为什么被 <code>std::move</code> 之后原指针就成了 <code>nullptr</code>，<code>shared_ptr</code> 的 <code>use_count()</code> 在作用域进出时如何从 1 变成 2 再落回 1，以及 <code>weak_ptr</code> 如何在不加计数的情况下经 <code>lock()</code> 拿到对象。</figcaption>
      <CPP20SmartPointers />
    </figure>

    <h2>所有权归属判定</h2>
    <p>
      智能指针把「释放内存」从你手写的某一行，搬到了对象的生命周期上，于是所有退出路径都被自动覆盖。默认用栈对象；需要堆对象就用 <code>unique_ptr</code>；确实要共享所有权才用 <code>shared_ptr</code>；共享里一旦成环，就用 <code>weak_ptr</code> 断环。原始指针从此只负责「看」，不负责「管」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「引用计数」</span>是 <code>shared_ptr</code> 用来管理共享所有权的一门记账方式：一份共享的控制块记录着「当前有多少个 <code>shared_ptr</code> 指向这个对象」，每拷贝一个就加一、每销毁一个就减一，<strong>减到零时自动析构并释放对象</strong>。边界：计数的增减是原子的、线程安全，但被指向的<strong>对象本身不是线程安全</strong>的，并发读写仍需自行同步；更要当心<strong>循环引用</strong>——两个对象互相持有 <code>shared_ptr</code> 会让计数永远降不到零、内存无法回收，此时应把其中一侧改为 <code>weak_ptr</code>（它不计入引用计数，需要时才用 <code>lock()</code> 提升为 <code>shared_ptr</code>）。
    </div>
  </LessonArticle>
</template>
