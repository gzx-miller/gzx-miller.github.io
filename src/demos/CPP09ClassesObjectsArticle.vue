<script setup lang="ts">
import CPP09ClassesObjects from './CPP09ClassesObjects.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个「人」有姓名和年龄，最朴素的写法就是两个变量加几个函数：<code>std::string name;</code>、<code>int age;</code>，想改年龄就写 <code>age = -5;</code>。程序编译通过、界面上数字也变了，可一个「年龄为负」的对象就这么被造了出来。数据和行为为什么总是各管各的，能不能让它们绑在一起、并且不再随便被人改坏？
    </div>

    <h2>从散装数据到封装：类是什么</h2>
    <p>
      回到上面那两行变量。它能用，问题也清楚：<code>name</code> 和 <code>age</code> 是两件互不相干的数据，任何拿到它们的地方都能随手改，没有一个地方愿意对「年龄必须非负」这条规则负责。
    </p>
    <p>
      自然的下一步，是把「描述同一个东西的数据」和「操作这些数据的函数」收进一个整体，这个整体就是 <strong>类</strong>（class）。它由两部分组成：
    </p>
    <ul>
      <li><strong>数据成员</strong>（member variable）：描述对象状态的变量，例如 <code>std::string name;</code> 与 <code>int age;</code>。</li>
      <li><strong>成员函数</strong>（member function）：定义在类内部、可以读写本类数据成员的行为，例如 <code>introduce()</code>、<code>setAge(int)</code>。</li>
    </ul>
    <p>
      用类「造」出来的具体个体叫 <strong>对象</strong>（object）。类像一张图纸，对象是按图纸造出的一栋栋房子——每个对象都有自己独立的一份数据成员。把数据和操作包在一起，就迈出了<strong>封装</strong>的第一步：外界不再直接碰数据，而是通过类选定的成员函数来访问。
    </p>

    <h2>成员函数、this 指针与 const 承诺</h2>
    <p>
      一个成员函数被调用时，凭什么是「这个对象的」数据成员在变？因为它背后藏着一个隐含参数——<code>this</code> 指针。在每个非静态成员函数内部，<code>this</code> 指向「调用该函数的那个对象」；直接写 <code>age = a;</code>，等价于 <code>this-&gt;age = a;</code>。
    </p>
    <p>
      <code>this</code> 也带来两个实用写法：一是用同名参数消歧，<code>void setAge(int age) { this-&gt;age = age; }</code> 里左边的 <code>this-&gt;age</code> 是数据成员、右边是形参；二是返回 <code>*this</code> 以支持链式调用。
    </p>
    <p>
      另一件挂在对象身上的事是 <strong>const 成员函数</strong>。在函数声明末尾写 <code>const</code>，如 <code>void introduce() const</code>，等于承诺「这个函数不会修改对象的任何数据成员」。它不只是修辞，作用有两层：
    </p>
    <ul>
      <li>编译器会替你<strong>检查</strong>：在 <code>const</code> 成员函数里直接改数据成员，编译就不过。</li>
      <li>它扩大了可调用的范围：<code>const</code> 对象只能调用 <code>const</code> 成员函数。像 getter 这类只读行为都应标成 <code>const</code>，否则 <code>const</code> 对象连查询都做不了。</li>
    </ul>
    <p>
      顺带一提初始化：数据成员应当用<strong>初始化列表</strong> <code>: name(n), age(a)</code> 完成，而不是进函数体再赋值。对 <code>const</code> 成员和引用成员来说，后者根本无法完成初始化；对普通成员，列表也少一次「先默认构造、再覆盖」的浪费。
    </p>

    <h2>访问控制：public / private / protected</h2>
    <p>
      有了成员函数，接下来决定「谁可以看、谁可以改」，靠的是<strong>访问说明符</strong>。
    </p>
    <ul>
      <li><code>public</code>：谁都能访问，是类对外承诺的接口。</li>
      <li><code>private</code>：只有本类自身的成员函数与友元能访问，是类藏起来的内部实现。</li>
      <li><code>protected</code>：本类成员与<strong>派生类</strong>能访问，外部不行，是为继承预留的中间地带。</li>
    </ul>
    <p>
      典型的分工是：数据成员放 <code>private</code>，只读查询与受控修改放 <code>public</code>。这样 <code>age</code> 就不会被外部随手改成负数，修改只能走 <code>setAge()</code>，校验逻辑被收拢在一处。这正是封装的收益——<strong>把「不许破坏的规则」变成一条无法绕过的通道</strong>。
    </p>
    <p>
      访问说明符还可以成段出现：从 <code>public:</code> 开始、到下一个说明符之前的成员都是公共的，可以按需切换段落。这也正是常见的写法——先摆 <code>private</code> 数据，再开 <code>public</code> 接口。
    </p>

    <h2>静态成员与友元：类规则的两个例外</h2>
    <p>
      多数成员属于对象，但有成员是例外。<strong>静态成员</strong>用 <code>static</code> 声明，属于<strong>整个类</strong>而不是某个对象：所有对象共用同一份静态数据成员，静态成员函数没有 <code>this</code>，因此也不能访问非静态成员。它适合放「与本类相关、但只有一个」的信息，比如这个类已经创建了多少个对象。静态数据成员还要在类外单独给出定义，才算真正分配了存储。
    </p>
    <p>
      另一个例外是 <strong>友元</strong>（<code>friend</code>）。被声明为友元的函数或类，可以越权访问本类的 <code>private</code> 与 <code>protected</code> 成员。它解决的是「两个类需要紧密协作、但走公开接口又嫌繁琐」的场景。代价是友元<strong>破坏了封装</strong>，用得越多，类的边界就越模糊，所以应当有节制地使用。
    </p>

    <h2>struct 与 class：只差一个默认访问权限</h2>
    <p>
      C++ 里还有一个关键字 <code>struct</code>，它同样能定义类，同样有成员函数与访问说明符。二者的差别只有一个：<strong>默认访问权限不同</strong>。
    </p>
    <ul>
      <li><code>struct</code> 的成员默认是 <code>public</code>，适合「主要用来装数据」的聚合类型。</li>
      <li><code>class</code> 的成员默认是 <code>private</code>，适合「向外提供接口、向内藏实现」的封装类型。</li>
    </ul>
    <p>
      另外，<code>struct</code> 的公有继承默认也是 <code>public</code>，而 <code>class</code> 默认是 <code>private</code>。因为差异仅此一项，工程里往往按用途约定：只装数据就用 <code>struct</code>，有行为与不变式就用 <code>class</code>，并不是语言上的强制。
    </p>

    <h2>看图对照：封装的取舍</h2>
    <figure class="lesson-figure">
      <figcaption>这份示例用一个 <code>Person</code> 类展示数据成员放 <code>private</code>、经 <code>public</code> 的 getter/setter 受控访问，并用初始化列表构造、用 <code>const</code> 成员函数做只读输出，可对照体会私有数据与公开接口的分工。</figcaption>
      <CPP09ClassesObjects />
    </figure>

    <h2>把规则写进类型里</h2>
    <p>
      从散装变量到类，解决的其实不是「写起来更整齐」，而是<strong>把不变量交给类型来守护</strong>：数据被 <code>private</code> 收起来，修改只能穿过带着校验的成员函数；状态查询被 <code>const</code> 标记出来，编译器帮忙确认它不会偷改对象。回头再看开头那个「年龄为负的对象」——它之所以能被造出来，不是因为校验难写，而是因为当时压根没有一个地方负责校验。
    </p>
    <div class="lesson-term">
      <span class="term-name">「封装」</span>指把数据与操作数据的行为组织为一个类，并通过访问控制隐藏内部实现、只暴露必要接口；<span class="term-name">「this 指针」</span>是成员函数中指向当前对象的隐含指针；<span class="term-name">「const 成员函数」</span>承诺不修改对象状态，可被 <code>const</code> 对象调用；<span class="term-name">「友元」</span>是被授予访问私有成员权限的外部函数或类。
    </div>
  </LessonArticle>
</template>
