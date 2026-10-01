<script setup lang="ts">
import CPP10CtorDtor from './CPP10CtorDtor.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个内部用 <code>new</code> 存着字符串的类，你只写了一句 <code>Student s2 = s1;</code> 做拷贝，程序结束时却在释放同一块内存——你只是想「复制一份」，怎么会变成「两次删除同一个东西」？
    </div>

    <h2>生命周期与资源</h2>
    <p>
      对象有「生」也有「死」。生：一块内存变成一个有意义、字段都合法的对象；死：对象占用的资源要还回去——堆内存、文件句柄、锁。
    </p>
    <p>
      如果只让程序员手动开关，就会背上几笔账：
    </p>
    <ul>
      <li><strong>忘记初始化</strong>：对象带着垃圾值就开始干活，行为无法预测。</li>
      <li><strong>忘记清理</strong>：堆内存泄漏、句柄耗尽，程序越跑越沉。</li>
      <li><strong>每一处创建 / 销毁点都要记得配对</strong>：分支路径一多，必漏。</li>
    </ul>
    <p>
      所以问题落成一句：能不能把「对象一出现就初始化好、一消失就清理干净」变成语言自动完成、且与生命周期严格绑定的行为？
    </p>

    <h2>构造析构接管</h2>
    <p>
      最直接的做法：用构造函数和析构函数把初值与清理写进类。
    </p>
    <p>
      <code>class Student {</code><br />
      <code>&nbsp;&nbsp;public:</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;Student(const std::string&amp; n) { name = new std::string(n); }</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;~Student() { delete name; }</code><br />
      <code>&nbsp;&nbsp;private:</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;std::string* name;</code><br />
      <code>};</code>
    </p>
    <p>
      对象一构造就把内部资源 <code>new</code> 好，一析构就 <code>delete</code> 掉，创建与清理配上了对。这个方案做对了一件事：<strong>构造与析构的调用时机由语言自动安排</strong>，不需要调用方记得手动调用——你把「生」和「死」的规则挂到了类型上。
    </p>

    <h2>默认浅拷贝风险</h2>
    <ul>
      <li>拷贝会出事：<code>Student s2 = s1;</code> 如果用的是编译器生成的默认拷贝构造，它只做<strong>浅拷贝</strong>——逐成员复制，于是 <code>s2.name</code> 和 <code>s1.name</code> 指向同一块内存。两个对象析构时各 <code>delete</code> 一次，就是重复释放。</li>
      <li>初始化顺序有陷阱：成员真正的初始化顺序由<strong>声明顺序</strong>决定，不是你写在初始化列表里的顺序；写反了就可能读到还没初始化的成员。</li>
      <li>参数一多，容易漏初始化某个成员，留下未定义状态。</li>
      <li>一旦类被继承，用基类指针删除派生类对象时可能只调到基类析构，派生类那部分资源就漏了。</li>
    </ul>

    <h2>深拷贝内存分配</h2>
    <p>
      先补「拷贝语义」。既然类自己管理资源，就必须自己定义拷贝构造函数做<strong>深拷贝</strong>——为新对象重新分配一块内存并复制内容，让两个对象各持各的资源：
    </p>
    <p>
      <code>Student(const Student&amp; other) { name = new std::string(*other.name); }</code>
    </p>
    <p>
      接着补「赋值」。拷贝构造管的是「用一个对象初始化另一个新对象」；给一个已经存在的对象赋值是另一回事，要写 <code>operator=</code>：
    </p>
    <p>
      <code>Student&amp; operator=(const Student&amp; other) {</code><br />
      <code>&nbsp;&nbsp;if (this != &amp;other) { delete name; name = new std::string(*other.name); }</code><br />
      <code>&nbsp;&nbsp;return *this;</code><br />
      <code>}</code>
    </p>
    <p>
      这里的自赋值检查 <code>this != &amp;other</code> 不能省：<code>s = s</code> 时若先 <code>delete name</code>，再去读 <code>*other.name</code>，读的就是已释放的内存；返回 <code>*this</code> 则支持连续赋值。
    </p>
    <p>
      走到这里，一条贯穿全局的法则就浮出来了：<strong>如果一个类需要自定义析构函数，通常也需要自定义拷贝构造和拷贝赋值</strong>——这就是「三法则（Rule of Three）」。理由很直接：会写析构，本身就说明这个类在管理资源，而编译器默认的拷贝是浅拷贝，配不上它。
    </p>
    <p>
      C++11 加入移动构造、移动赋值后，这条法则扩展成「五法则（Rule of Five）」：五个特殊成员函数要放在一起考虑。移动语义让临时对象里的资源可以<strong>转移</strong>而不是复制，省掉一次深拷贝。若确实想要编译器给的默认版本，用 <code>= default</code> 明确写出来；要禁用某个特殊成员函数，用 <code>= delete</code>。
    </p>
    <p>
      再补对象生命周期这张全景图：
    </p>
    <ol class="lesson-steps">
      <li><strong>自动对象</strong>（局部变量）：在定义处构造，离开作用域时析构。</li>
      <li><strong>动态对象</strong>：<code>new</code> 时构造，<code>delete</code> 时析构。</li>
      <li><strong>全局 / 静态对象</strong>：在 <code>main</code> 之前构造，<code>main</code> 返回之后析构；同一编译单元内按定义顺序构造，不同编译单元之间的顺序则未指定。</li>
    </ol>
    <p>
      构造与析构的顺序也有规律：构造时是「基类 → 成员 → 自身」，析构时正好反过来「自身 → 成员 → 基类」——先构造的后释放，资源的依赖关系才不会被破坏。
    </p>
    <p>
      最后补构造本身的几条性质：构造函数与类同名、无返回类型、可以有参数因而能重载；析构函数名为 <code>~类名()</code>、无参数无返回类型、不能重载。C++11 的委托构造函数让一个构造函数调用同类另一个构造函数，省掉重复代码；<code>constexpr</code> 构造函数能创建编译期常量对象（C++14 起其函数体允许非空，但初始化列表里的表达式仍须是常量表达式）。另外，如果类会被继承，析构函数通常应声明为 <code>virtual</code>，这样通过基类指针 <code>delete</code> 派生类对象时才能调到正确的析构函数。
    </p>
    <div class="lesson-box warn">
      <strong>初始化列表的顺序不等于初始化顺序：</strong>真正决定顺序的是成员在类里的<strong>声明顺序</strong>。如果成员之间有依赖，请按声明顺序排好，别指望列表里的书写顺序能起作用。
    </div>

    <h2>拷贝路径判定</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码看构造、拷贝构造、拷贝赋值、析构分别在什么时候被调用——重点盯住 <code>Student s2 = s1;</code> 到底走的是哪一个函数。</figcaption>
      <CPP10CtorDtor />
    </figure>

    <h2>三法则与五法则</h2>
    <p>
      构造函数与析构函数把对象的「生」与「死」钉在生命周期上：一出现就初始化、一消失就清理。可一旦类自己管资源，编译器默认的浅拷贝就会出问题，于是「三法则」乃至「五法则」逼着你把析构、拷贝、移动一并定义清楚——对象的边界，正靠这组函数来守。
    </p>
    <div class="lesson-term">
      <span class="term-name">「浅拷贝」</span>指编译器为类生成的默认拷贝构造 / 拷贝赋值只做逐成员复制：对指针成员，复制的是地址而不是它指向的内容，于是两个对象共享同一块资源，析构时重复释放。与之相对的<strong>深拷贝</strong>会为新对象重新分配资源并复制内容。边界：如果类不管理任何需要手动释放的资源，默认的浅拷贝通常就是正确行为。
    </div>
  </LessonArticle>
</template>
