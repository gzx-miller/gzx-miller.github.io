<script setup lang="ts">
import CPP11CopyControl from './CPP11CopyControl.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个自己管理字符串内存的类，主函数里只有两句 <code>String s1("Hello"); String s2 = s1;</code>，程序却在退出、两个对象析构的那一刻崩溃，报出 double free——一次看起来最无害的拷贝，怎么会在收尾时炸掉？
    </div>

    <h2>资源管理类拷贝</h2>
    <p>
      你希望类能自己管住一块堆内存：构造函数里 <code>new char[]</code>，对象拿着这个 <code>char* data</code>。这样的类写出来很自然，直到你把它拷贝一次——<strong>拷贝一个对象，到底应该拷贝什么？</strong>
    </p>
    <p>
      最省事的想法是：像普通结构体一样，把成员一个个复制过去就行，而这件事编译器早就替你做好了，它会生成默认的拷贝构造和拷贝赋值。可这个默认动作里藏着三笔必须由人自己承担的隐藏成本：
    </p>
    <ul>
      <li>你不知道编译器在"拷贝"时具体动了哪些东西；<code>data</code> 这个指针拷过去之后，两个对象指着同一块内存，你却看不出来。</li>
      <li>一旦类持有的是资源（堆内存、文件句柄、网络连接），"复制指针"就等于把同一份资源登记了两个主人。</li>
      <li>出错的时机在析构阶段，离写下那行拷贝的现场很远，报错只告诉你"释放了两次"，几乎指不到病根。</li>
    </ul>
    <p>
      所以要问的是：<strong>一个管理资源的类，该怎样定义"复制"这件事，才能让每个对象都有自己的一份资源？</strong>
    </p>

    <h2>默认逐成员拷贝</h2>
    <p>
      最省事的做法是：一个特殊成员函数都不写，完全交给编译器生成的默认版本。它的行为是<strong>逐成员拷贝</strong>——把 <code>length</code> 数值抄一份，把 <code>data</code> 指针值也抄一份。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>对不含资源的类，逐成员拷贝完全正确</strong>。比如一个只装 <code>int x, y</code> 的 <code>Point</code>，拷贝之后两个对象各有一份独立的坐标，你一辈子都不用为此操心。问题只出在"成员是资源"的类上。
    </p>

    <h2>浅拷贝双重释放</h2>
    <ul>
      <li>默认拷贝是<strong>浅拷贝</strong>：<code>s2 = s1</code> 之后，<code>s2.data</code> 和 <code>s1.data</code> 指向同一块堆内存。改 <code>s2</code> 的内容，<code>s1</code> 也跟着变。</li>
      <li>析构时 <code>s1</code> 先 <code>delete[] data</code> 释放了这块内存，<code>s2</code> 析构时又对同一地址再释放一次，得到 double free 或堆损坏——这就是开场那次崩溃。</li>
      <li>拷贝赋值同样浅：<code>s3 = s1</code> 先把 <code>s3.data</code> 覆盖掉，<code>s3</code> 原本持有的那块内存再也没人释放，直接泄漏。</li>
      <li>错误会成片出现：函数按值传参、返回临时对象、往容器里 <code>push_back</code>，每一次拷贝都在复制这枚"共享的指针"。</li>
    </ul>

    <h2>补齐拷贝三法则</h2>
    <p>
      不推翻"成员逐个处理"，而是把两个动作显式写出来：<strong>分配的资源要释放、拷贝的应该是内容而不是指针</strong>。
    </p>
    <p>
      先补释放。给类写一个析构函数 <code>~String() { delete[] data; }</code>。为什么先补它？因为一个类一旦在构造函数里拿了资源，最先必须确定的就是"谁在什么时候还"，析构函数就是那个统一的归还点。
    </p>
    <p>
      但只补析构还不够：析构函数保证每个对象都会还自己那块内存，可如果拷贝只复制指针、让两个对象登记同一块内存，归还就变成了两次。所以接着补<strong>深拷贝</strong>：
    </p>
    <ol class="lesson-steps">
      <li>拷贝构造函数 <code>String(const String&amp; other)</code>：不复制指针值，而是按 <code>other.length</code> 重新 <code>new</code> 一块内存，再把 <code>other</code> 的内容逐字节复制过来。这样两个对象各有一份自己的资源。</li>
      <li>拷贝赋值运算符 <code>String&amp; operator=(const String&amp; other)</code>：先检查自赋值，再释放自己原有的旧资源，然后分配新内存、复制数据，最后返回 <code>*this</code>。</li>
    </ol>
    <p>
      拷贝赋值这一步有两个容易忽略却必须守住的细节。第一是<strong>自赋值检查</strong>：写成 <code>if (this != &amp;other)</code>，就是为了挡住 <code>s = s</code> 这种情况——否则你先 <code>delete[] data</code>，紧接着又去读 <code>other.data</code>，而这两者本是同一块内存，等于把自己要读的数据提前释放了。第二是<strong>返回 <code>*this</code> 的引用</strong>：它让 <code>a = b = c</code> 这样的链式赋值成立，同时避免返回时又多出一次拷贝。
    </p>
    <p>
      走到这里你会发现，析构、拷贝构造、拷贝赋值这三个是绑在一起出现的——只要定义了其中任意一个，通常另外两个也得定义，这就是 <strong>Rule of Three</strong>。它们共同回答同一个问题：这个类持有资源时，怎么创建、怎么复制、怎么销毁。
    </p>
    <p>
      在此基础上还有两处能更进一步。其一，用 <strong>copy-and-swap</strong> 简化拷贝赋值：先写一个只交换所有成员、不碰资源的 <code>swap</code> 成员函数，然后把赋值运算符的参数改成<strong>按值传递</strong>（实参在传参时已经由拷贝构造生成了一份完整副本），函数体里只做一次 <code>swap(*this, rhs)</code>。它顺带把自赋值也处理了（即便 <code>s = s</code>，也是先换再析构副本，安全），而且异常安全——分配副本若失败，本对象还没被改动。其二，进入 C++11 就是 <strong>Rule of Five</strong>：再加上移动构造函数和移动赋值运算符，它们接收右值引用、直接"接管"源对象的资源指针再把它置空，省掉一次深拷贝；并且要用 <code>noexcept</code> 标记，因为标准库容器只有在移动构造是 <code>noexcept</code> 时才敢放心用它做扩容搬运。
    </p>
    <p>
      也别忘了两个反向工具：C++11 的 <code>= delete</code> 可以把拷贝构造和拷贝赋值声明为删除，明确表示这个类不允许被拷贝；<code>= default</code> 则相反，显式要求编译器生成默认版本。而最理想的形态是 <strong>Rule of Zero</strong>——如果类里只有 RAII 成员（<code>std::string</code>、<code>std::vector</code>、智能指针），那就一个特殊成员函数都不用写，编译器生成的版本天生就是对的。这其实也在暗示：<code>String</code> 这类类，直接用 <code>std::string</code> 往往比自己管 <code>char*</code> 更省心。
    </p>
    <div class="lesson-box warn">
      <strong>自赋值比你想的更常见：</strong>不要以为只有 <code>a = a</code> 才算。当 <code>*p = *q</code> 里的 <code>p</code> 和 <code>q</code> 恰好指向同一个对象时，赋值运算符收到的两个引用就是同一个对象。任何"先释放、后读取"的实现，都必须先做自赋值检查。
    </div>

    <h2>拷贝日志顺序</h2>
    <figure class="lesson-figure">
      <figcaption>顺着这段 String 代码看四类日志的先后：构造、拷贝构造、拷贝赋值、析构分别在什么时候打印，再对照拷贝赋值里那句自赋值检查，想清楚少了它会怎样。</figcaption>
      <CPP11CopyControl />
    </figure>

    <h2>复制语义自主定义</h2>
    <p>
      拷贝控制本质上是在回答"这个类的对象该怎么复制"。一旦类自己持有一份资源，就得亲手定下析构、拷贝构造、拷贝赋值三件事（Rule of Three）；把"释放旧资源、深拷贝新资源、处理自赋值、返回 <code>*this</code>"做对之后，再用 copy-and-swap 让它更稳、用移动语义让它更快，或者干脆让成员全是 RAII 类型，做到 Rule of Zero。
    </p>
    <div class="lesson-term">
      <span class="term-name">「深拷贝」</span>指拷贝对象时不仅复制指针本身，还复制指针所指的那块资源，使两个对象各自持有独立的副本。与它相对的是编译器默认生成的<strong>浅拷贝</strong>——只逐成员复制指针值，两个对象共享同一资源，析构时会重复释放。边界：管理资源的类几乎都需要深拷贝；但如果类里全是 RAII 成员（<code>std::string</code>、<code>std::vector</code>、智能指针），默认的逐成员拷贝就是正确的，无需自定义。
    </div>
  </LessonArticle>
</template>
