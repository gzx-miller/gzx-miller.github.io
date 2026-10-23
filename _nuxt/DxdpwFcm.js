const n=`<script setup lang="ts">
import CPP11CopyControl from './CPP11CopyControl.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong><code>Box b = a;</code> 这行代码谁也没写拷贝相关的函数，却编译通过、也能跑；可一旦 <code>Box</code> 里藏着一个指针成员，程序就在析构时崩了。既然拷贝是编译器自动给的能力，为什么它会崩，又该由谁来接管？
    </div>

    <h2>拷贝为什么是默认就有的</h2>
    <p>
      <code>Box b = a;</code> 之所以能运行，是因为只要类没有自己声明，编译器会自动生成两个特殊的成员函数：
    </p>
    <ul>
      <li><strong>拷贝构造函数</strong>：<code>Box(const Box&amp; other)</code>，在「用已有对象初始化新对象」时被调用，包括 <code>Box b = a;</code> 以及按值传参、按值返回。</li>
      <li><strong>拷贝赋值运算符</strong>：<code>Box&amp; operator=(const Box&amp; other)</code>，在「两个已存在对象之间赋值」时被调用，如 <code>b = a;</code>。</li>
    </ul>
    <p>
      编译器生成的版本做的是<strong>逐成员拷贝</strong>：把源对象每个成员的值原样复制过去。对 <code>int</code>、<code>std::string</code> 这类成员，这样复制没问题；麻烦出在指针成员上。
    </p>

    <h2>浅拷贝与深拷贝：默认拷贝到底做了什么</h2>
    <p>
      回到 <code>new</code> 出来的指针成员 <code>int* data</code>。逐成员拷贝复制的是<strong>指针本身的值</strong>，也就是那块内存的地址，而不是内存里的内容。
    </p>
    <ul>
      <li><strong>浅拷贝</strong>：只复制指针，两个对象指向<strong>同一块</strong>内存。</li>
      <li><strong>深拷贝</strong>：为新对象<strong>另外分配一块内存</strong>，再把内容复制过去，两个对象各自独立。</li>
    </ul>
    <p>
      浅拷贝留下的隐患有两处：一是两个对象共享一块内存，任何一方改动都会「隔空」影响另一方；二是析构时两个对象都会去 <code>delete</code> 同一个地址，第二次释放会触发<strong>重复释放</strong>。所以只要类持有需要手动释放的资源，就必须自己接管拷贝，把它改成深拷贝——这正是开头程序崩溃的原因。
    </p>

    <h2>拷贝构造函数与拷贝赋值运算符</h2>
    <p>
      两者要处理的情形不同，写法也有区别。
    </p>
    <p>
      <strong>拷贝构造函数</strong>面对的是「一块全新的、还没持有资源的内存」，直接申请并复制即可：<code>Box(const Box&amp; other) : data(new int(*other.data)) {}</code>。
    </p>
    <p>
      <strong>拷贝赋值运算符</strong>面对的是「一个早就持有资源、需要先腾空再装满的对象」，因此要比拷贝构造多两步：先释放自己原有的资源，再按新内容申请。它还有两个固定要求——返回 <code>*this</code> 以支持链式赋值，参数用 <code>const</code> 引用以避免多余拷贝。
    </p>

    <h2>自赋值检查与异常安全</h2>
    <p>
      拷贝赋值里最容易忽略的一步是<strong>自赋值检查</strong>：<code>a = a;</code> 这种写法虽古怪，却完全合法，还可能通过别名间接发生。如果不检查就「先 <code>delete</code> 自己，再读对方的 <code>data</code>」，而对方恰恰就是自己，那么读到的就是刚被释放的悬垂指针。
    </p>
    <p>
      应对方式有两种：
    </p>
    <ul>
      <li>入口处写 <code>if (this == &amp;other) return *this;</code>，直接挡住自赋值。</li>
      <li>更稳的顺序（异常安全）：<strong>先分配新资源，确认成功后再释放旧资源</strong>。这样即使 <code>new</code> 失败抛异常，对象仍保持原状，不会留下「旧资源已释放、新资源没拿到」的半截状态。</li>
    </ul>

    <h2>Rule of Three / Five / Zero 与 =default、=delete</h2>
    <p>
      拷贝控制的经验被总结成几组规则：
    </p>
    <ul>
      <li><strong>Rule of Three</strong>：如果类需要自定义<strong>析构函数、拷贝构造函数、拷贝赋值运算符</strong>中的任何一个，通常三个都需要。因为它们都在回答同一个问题——「怎么管理这份资源」，只补其中一两个，往往留下不一致的漏洞。</li>
      <li><strong>Rule of Five</strong>：C++11 增加<strong>移动构造函数</strong>与<strong>移动赋值运算符</strong>后，规则扩展为五个一起考虑。</li>
      <li><strong>Rule of Zero</strong>：反过来，如果类不直接持有裸资源、一切交给 RAII 类型（如 <code>std::string</code>、<code>std::vector</code>、智能指针）管理，那就<strong>什么特殊成员函数都不用写</strong>，编译器生成的版本已经足够正确。</li>
    </ul>
    <p>
      还有两个控制默认行为的写法：<code>= default</code> 显式要求编译器生成默认版本；<code>= delete</code> 显式禁用某个函数（例如禁止拷贝）。写出来不仅表达了意图，也让错误在编译期而不是运行期就暴露出来。
    </p>

    <h2>看图对照：Rule of Three 三件套</h2>
    <figure class="lesson-figure">
      <figcaption>这份示例用一个持有 <code>char*</code> 的 <code>String</code> 类，完整写出析构函数、深拷贝的拷贝构造函数与带自赋值检查的拷贝赋值运算符，可对照看到浅拷贝的问题与深拷贝如何逐项解决。</figcaption>
      <CPP11CopyControl />
    </figure>

    <h2>让「资源怎么复制」由类自己说了算</h2>
    <p>
      拷贝控制的全部工作，其实就是回答一个问题：<strong>当一个对象要从另一个同类对象复制而来时，这份资源该怎么处理</strong>。编译器默认给的是「逐字节搬运」，对普通数据正确、对持有的资源却是灾难。接手书写拷贝构造与拷贝赋值，就是把这条默认规则替换成符合本类语义的规则；而 <code>= default</code>、<code>= delete</code> 则让你在「默认够用」与「根本不许」之间也留出明确的表达。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅拷贝」</span>只复制指针值，使两个对象共享同一份资源；<span class="term-name">「深拷贝」</span>为新对象另行分配资源并复制内容，使对象彼此独立；<span class="term-name">「自赋值检查」</span>指拷贝赋值中先判断源对象是否即自身，避免先释放后读取；<span class="term-name">「Rule of Three / Five / Zero」</span>分别指需要自定义析构、拷贝构造、拷贝赋值三者时一并考虑、C++11 起的五项扩展，以及全交给 RAII 类型从而一项都不用写的理想情形。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
