const e=`<script setup lang="ts">
import CPP08DynamicMemory from './CPP08DynamicMemory.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>服务跑了一整晚，内存占用只涨不降，重启一下就恢复；你翻遍代码，每一处 <code>new</code> 看起来都写对了——那这些借出去的内存，到底去哪了？
    </div>

    <h2>动态内存需求</h2>
    <p>
      有些对象的大小要等运行时才知道：用户输入多长、这次读到多少条记录。有些对象的生命周期又不能跟着某一个作用域走：它要在多个函数甚至多个对象之间共享。栈上的自动变量这两件事都做不到——大小编译期固定、离开作用域就销毁。
    </p>
    <p>
      于是你需要一块「手动借、手动还」的内存，也就是堆。可这块内存也把责任原封不动交给了你：
    </p>
    <ul>
      <li>栈变量离开作用域会自动销毁，<strong>堆内存不会</strong>。你不还，它就一直被占着。</li>
      <li>销毁时机全靠人记：谁借的、什么时候还、有没有哪条分支忘了还，全在你脑子里。</li>
      <li>释放之后指针本身还在：指针不会因为 <code>delete</code> 而消失，误用它就是悬垂。</li>
    </ul>
    <p>
      所以问题落成一句：怎样才能安全地借还堆内存，既拿到「运行时才定的大小」和「跨作用域的生命周期」，又不把「记得还」变成人的负担？
    </p>

    <h2>手动分配释放</h2>
    <p>
      最直接的做法：<code>new</code> 要一块，<code>delete</code> 还回去。
    </p>
    <p>
      <code>int* p = new int(42);</code><br />
      <code>std::cout &lt;&lt; *p &lt;&lt; std::endl;</code><br />
      <code>delete p;</code>
    </p>
    <p>
      <code>new int(42)</code> 分配一块 <code>int</code> 并初始化为 42，返回指向它的指针；用完 <code>delete p</code> 释放。这个方案做对了一件栈变量给不了的事：<strong>把分配时机第一次交给了程序自己</strong>——大小可以运行时算，生命周期可以跨函数。
    </p>

    <h2>数组配对释放</h2>
    <ul>
      <li>数组要用 <code>new int[5]</code> 分配，释放却必须写成 <code>delete[] arr</code>；写成 <code>delete arr</code> 就是未定义行为——分配与释放必须配对：<code>new</code> 对 <code>delete</code>，<code>new[]</code> 对 <code>delete[]</code>。</li>
      <li>忘记 <code>delete</code> 就内存泄漏，程序占的内存只涨不降，正是开场那一幕。</li>
      <li><code>delete p</code> 之后 <code>p</code> 仍指向那块已归还的内存，再解引用就是悬垂指针，读到什么全凭运气。</li>
      <li>对同一个指针 <code>delete</code> 两次是重复释放，同样是未定义行为。</li>
    </ul>

    <h2>置空与智能指针</h2>
    <p>
      先立一条几乎零成本的规矩：<strong><code>delete</code> 之后立刻把指针置为 <code>nullptr</code></strong>。因为 <code>delete nullptr</code> 是安全的（什么也不做），重复释放这条就被堵住了。但要清醒：这只保护了这一个指针，其它指向同一块内存的指针照样悬垂。
    </p>
    <p>
      再补「分配失败」。默认情况下 <code>new</code> 失败会抛 <code>std::bad_alloc</code>；如果不想用异常，可以写 <code>new (std::nothrow)</code>，失败时返回 <code>nullptr</code>，由你自己判空。
    </p>
    <p>
      接着把「记得还」这件事从人身上挪走，也就是智能指针。<code>std::unique_ptr</code> 管独占所有权，离开作用域自动 <code>delete</code>；<code>std::shared_ptr</code> 用引用计数管共享所有权，最后一个持有者销毁时释放。改用它们之后，「配对」由类型系统来保证，失配、泄漏、悬垂这几类大头一并消掉。
    </p>
    <p>
      再补「一大块连续内存」：要动态数组，直接用 <code>std::vector</code>；固定大小用 <code>std::array</code>。它们把容量和释放都接管了。于是现代 C++ 的经验法则变得很干脆——<strong>几乎不要直接写裸 <code>new</code> / <code>delete</code></strong>。
    </p>
    <p>
      最后有一个特殊技法必须单独交代，因为它把上面的规矩整个翻转过来：<strong>placement new</strong>，写法是 <code>new (addr) T(...)</code>，在一块<strong>已经分配好</strong>的地址上构造对象（内存池等场景常用）。它的清理方式和其它 <code>new</code> 完全不同：必须手动调用析构 <code>obj-&gt;~T()</code>，<strong>绝不能</strong>对它 <code>delete</code>——<code>operator delete</code> 并不会释放这块内存，而内存本身要按当初怎么来的怎么还。
    </p>
    <div class="lesson-box warn">
      <strong><code>new[]</code> 一定要配 <code>delete[]</code>：</strong>对 <code>new[]</code> 出来的数组写 <code>delete arr</code>，不会正确地逐个析构元素，既漏掉了后面的对象，又可能破坏堆结构。此外，怀疑泄漏时可用工具定位：Linux 上的 Valgrind、Windows 上的 Dr. Memory，或编译期插桩的 AddressSanitizer。
    </div>

    <h2>配对悬垂验证</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码走一遍单个对象的「分配 → 释放 → 置空」，再看数组的 <code>new[]</code> / <code>delete[]</code> 如何配对，最后看被注释掉的悬垂与重复释放为什么会出事。</figcaption>
      <CPP08DynamicMemory />
    </figure>

    <h2>内存释放责任</h2>
    <p>
      动态内存把「大小」和「生命周期」的决定权交给程序，代价是把「记得还」也交给你。<code>delete</code> 后置空只堵住一种误用，真正把这责任接过去的是智能指针和容器——所以现代 C++ 的答案不是「更小心地写 <code>new</code> / <code>delete</code>」，而是「尽量不写它们」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「悬垂指针」</span>指仍然保存着某个地址、但该地址上的对象已经被销毁（最典型的是 <code>delete</code> 之后）的指针。此时对它解引用、读写或再次 <code>delete</code> 都是未定义行为。边界：<code>delete p; p = nullptr;</code> 只让这一个指针失效，其它指向同一块内存的指针仍然是悬垂的。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
