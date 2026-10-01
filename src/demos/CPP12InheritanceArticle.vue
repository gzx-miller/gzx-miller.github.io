<script setup lang="ts">
import CPP12Inheritance from './CPP12Inheritance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个按动物描述的函数 <code>void describe(Animal a)</code>，把一只 <code>Dog</code> 传进去，函数里让它叫一声，叫出来却是基类那句"发出声音"，而且函数里再也读不到狗自己的数据——一只 Dog 装进 Animal 之后，怎么像被削掉了一半？
    </div>

    <h2>字段与行为复用</h2>
    <p>
      你遇到的是复用问题：<code>Dog</code> 和 <code>Animal</code> 共享同一套字段（名字）与行为（构造、析构、说话的方式），只是狗要多一点自己的东西。最省事的办法，是把 <code>Animal</code> 的代码整段复制进 <code>Dog</code>，改掉类名。
    </p>
    <p>
      但这个"复制粘贴"里藏着三笔要人自己扛的成本：
    </p>
    <ul>
      <li>基类里一个字段改名、一个函数改逻辑，你得把所有复制出来的类都改一遍，漏一个就埋下一个不一致的 bug。</li>
      <li>两个类在语言层面彼此<strong>没有关系</strong>，编译器不知道"Dog 也是一种 Animal"，于是任何"接受 Animal、统一处理一批动物"的函数都没法把 Dog 收进来。</li>
      <li>想让一段逻辑同时作用于多种类型，只能靠重载或模板把每种类型各写一遍，代码条数随类型数线性增长。</li>
    </ul>
    <p>
      所以要问的是：<strong>能不能让一个新类型"基于"已有类型去定义，既继承它的成员，又和它建立起可替换的关系？</strong>
    </p>

    <h2>公有继承写法</h2>
    <p>
      最直接的写法是 <code>class Dog : public Animal { ... }</code>。这样 Dog 自动拥有了 Animal 的全部成员，还能往上添加自己的成员和自己的函数。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把"是一种"这层关系写进了类型系统</strong>——<code>public</code> 继承表达的正是 is-a。于是凡需要 Animal 的地方（函数参数、容器元素）都能放 Dog，复用不必再靠复制粘贴。剩下要弄清的，是这份关系在内存和生命周期里究竟怎么运转。
    </p>

    <h2>构造顺序陷阱</h2>
    <ul>
      <li>派生类构造函数体里想用基类的 <code>name</code>，可它的值从哪来、什么时候就绪，说不清——构造顺序一旦弄反，就会读到未初始化的成员。</li>
      <li>用基类对象接住派生对象：<code>Animal a = dog;</code>，Dog 特有的成员被"切掉"，<code>a</code> 里只剩基类那部分——开场"少了一半"的现象就是这么来的。</li>
      <li>通过基类指针 <code>delete</code> 一个派生对象时，若基类析构函数不是虚的，就只执行基类析构，Dog 自己的资源没人回收。</li>
      <li>指望派生类改写基类行为，基类那个函数却是普通（非虚）函数，通过基类指针调用时调到的仍是基类版本。</li>
    </ul>

    <h2>派生对象内存布局</h2>
    <p>
      不推翻"派生"，而是把这份关系一层层讲清楚。先看内存：<strong>派生类对象 = 基类子对象 + 派生类新增成员</strong>。正因为 Dog 内部真的"装"了一块完整的 Animal，<code>Animal* p = &amp;dog;</code> 才合法——指针只是记下地址，指向的仍是那只完整的狗。
    </p>
    <p>
      接着理清生命周期，这是继承最常出错的地方：<strong>构造顺序是基类 → 派生类成员 → 派生类构造体，析构顺序与它完全相反</strong>。为什么？构造时派生类可能要用基类已经建好的成员，所以基类必须先就绪；析构时反过来，是因为派生类的清理可能还要用到基类资源。派生类构造函数用初始化列表显式调用基类构造即可：
    </p>
    <p>
      <code>Dog(const std::string&amp; n) : Animal(n) { ... }</code>
    </p>
    <p>
      如果不写，编译器会去调用基类的默认构造函数；基类若没有默认构造，这段代码直接编译不过。
    </p>
    <p>
      再补上"通过基类指针删除派生对象"的正确性：只要有人可能这么干，基类的析构函数就必须声明为 <code>virtual</code>。否则 <code>delete animal;</code> 只会调用 <code>~Animal()</code>，Dog 的析构被直接跳过，它持有的资源全部泄漏。
    </p>
    <p>
      然后是"重写"这件事的两个工具。C++11 的 <code>override</code> 让你在派生类里显式标记"这是在重写基类虚函数"，一旦签名没对上（比如漏了 <code>const</code>），编译器就报错；没有它，签名不匹配会悄悄变成<strong>隐藏</strong>而非重写，调用时莫名其妙走了基类版本。<code>final</code> 则相反，用来禁止某个类被继承、或某个虚函数被继续重写。
    </p>
    <p>
      最后回到开场那个"被削掉一半"的现象，它的正式名字叫<strong>对象切片</strong>：<code>Animal a = dog;</code> 触发的是"按基类那部分"的一次拷贝构造，Dog 新增的成员根本没有落脚之地，被就地切掉。正解是<strong>始终用基类指针或引用</strong>去接派生对象——<code>Animal* p = &amp;dog;</code> 或 <code>Animal&amp; r = dog;</code>，它们只保存地址，指向的依旧是完整的 Dog。
    </p>
    <p>
      还有三处继承的边界值得记住。访问控制上，<code>protected</code> 继承会把基类的 public / protected 成员变成 protected（只在继承层次内部可见），<code>private</code> 继承则把它们全部变成 private，只借用实现、不暴露 is-a；日常表达"是一个"关系，几乎都用 <code>public</code>。若派生类需要把基类某个被保护的名字引入自己的作用域，可以写 <code>using Base::method;</code>。而一个类同时继承多个基类（多重继承）虽然合法，却可能带来菱形继承问题，通常要靠虚继承化解——当能用组合表达关系时，就先别急着上多重继承。
    </p>
    <div class="lesson-box warn">
      <strong>按值传递会切片：</strong><code>void describe(Animal a)</code> 这种按值接收基类对象的函数，会把传进来的 Dog 切成 Animal；把派生对象放进存放基类对象的容器也一样。要保留派生身份或使用多态，参数和容器里都应该放<strong>基类的指针或引用</strong>，而不是基类对象本身。
    </div>

    <h2>基类指针调用</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码里构造与析构的打印：<code>Dog dog("旺财")</code> 是先打印基类构造还是派生类构造？<code>delete</code> 时析构顺序又怎样？再留意通过基类指针调用 <code>speak()</code> 的结果。</figcaption>
      <CPP12Inheritance />
    </figure>

    <h2>继承与类型关系</h2>
    <p>
      继承先回答"两个类型是什么关系"：公有继承表达 is-a，派生对象在内存里就是"基类子对象 + 新增成员"。构造从基类走到派生、析构反过来；要让基类指针正确清理和改写行为，析构要是虚的、重写要用 <code>override</code>；要保住派生对象的完整身份，就只能用指针或引用，一旦用基类对象按值接收，它就会被切片。
    </p>
    <div class="lesson-term">
      <span class="term-name">「对象切片」</span>指把一个派生类对象<strong>按值</strong>赋给基类对象（或按值传参）时，只有基类那一部分被拷贝过去，派生类新增的成员被丢弃的现象。它静默发生、不报错，却让你以为在用派生对象，实际调用的全是基类行为。避免的办法是始终用基类的指针或引用指向派生对象；需要按基类类型成批处理时，容器里也应存指针（或智能指针）而非对象本身。
    </div>
  </LessonArticle>
</template>
