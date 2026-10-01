<script setup lang="ts">
import CPP09ClassesObjects from './CPP09ClassesObjects.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个 <code>setAge</code> 函数，<code>p1.setAge(4)</code> 只改了 <code>p1</code>，<code>p2</code> 纹丝不动——函数体里明明只写了一句 <code>age = a</code>，它凭什么知道该改哪个对象的 <code>age</code>？
    </div>

    <h2>数据与规则绑定</h2>
    <p>
      你想把「数据 + 操作数据的规则」绑在一起。就拿一个「人」来说：名字、年龄，外加一条规矩——年龄不能为负、也不能超过 150。
    </p>
    <p>
      如果只是把数据摊成散变量、再写一堆函数去操作，会背上几笔隐藏的账：
    </p>
    <ul>
      <li><strong>规矩没人守</strong>：任何人都能直接写 <code>age = -5</code>，那条「年龄非负」的约定形同虚设。</li>
      <li><strong>改动面失控</strong>：字段一旦改名或多出一个，所有直接访问它的地方都得跟着改。</li>
      <li><strong>没有「同一个东西」的边界</strong>：谈不上「这个人」和「那个人」，数据之间没有归属。</li>
    </ul>
    <p>
      所以真正要回答的是：怎样把数据和守护数据的规则封成一个整体，让外部只能通过与规矩一致的入口来改它？
    </p>

    <h2>类与访问权限</h2>
    <p>
      最直接的做法：用 <code>class</code> 造一个自定义类型，把数据成员和操作它们的成员函数写在一起，再用访问权限挡住直接访问。
    </p>
    <p>
      <code>class Person {</code><br />
      <code>&nbsp;&nbsp;private:</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;std::string name;</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;int age;</code><br />
      <code>&nbsp;&nbsp;public:</code><br />
      <code>&nbsp;&nbsp;&nbsp;&nbsp;void setAge(int a) { if (a &gt;= 0 &amp;&amp; a &lt;= 150) age = a; }</code><br />
      <code>};</code>
    </p>
    <p>
      <code>private</code> 的数据外部碰不到，只能走 <code>public</code> 的 <code>setAge</code>，那条「年龄在 0 到 150」的规矩就被守住了。这个方案做对了一件事：<strong>把「能怎么改」从每个调用者的自觉，变成了类型的定义</strong>。
    </p>

    <h2>多对象的指向问题</h2>
    <ul>
      <li>光有访问权限还不够：<code>setAge</code> 里只写了 <code>age = a</code>，可同一个类能创建很多个对象，这句赋值到底改的是哪一个的 <code>age</code>？</li>
      <li><code>struct</code> 成员默认 <code>public</code>，<code>class</code> 成员默认 <code>private</code>；混用会让人对「这一行到底能不能访问」判断失误。</li>
      <li>有的成员函数只是「看一眼」，却也没被约束住，照样可能被误写成会改状态。</li>
      <li>类多起来之后 getter / setter 满天飞，成员函数放到类外定义时，限定写法还容易写错。</li>
    </ul>

    <h2>隐式对象指针</h2>
    <p>
      先补上「到底是哪个对象」。每个非静态成员函数都有一个隐式的 <code>this</code> 指针，指向调用它的那个对象：<code>p1.setAge(4)</code> 里 <code>this</code> 就是 <code>&amp;p1</code>，<code>p2.setAge(4)</code> 里就是 <code>&amp;p2</code>。所以同一份函数代码能作用到不同对象上，<code>this-&gt;age = a</code> 不过是 <code>(*this).age = a</code>。
    </p>
    <p>
      由此还有一个推论：<code>this</code> 的类型是「指向本类对象的 const 指针」——指针本身不能改（不能让它指到别的对象），但它指向的对象是可修改的。正因如此，把 <code>*this</code> 返回出去就能链式调用：<code>obj.setX(1).setY(2)</code>。
    </p>
    <p>
      接着补 const 成员函数。在函数签名末尾写 <code>const</code>（如 <code>int getAge() const</code>），等于承诺「我不修改这个对象」。此时 <code>this</code> 的类型变成「指向 const 本类对象的 const 指针」，于是里面只能调用其它 const 成员函数——<code>getAge() const</code> 里就调不了 <code>setAge</code>。判断一个函数要不要加 <code>const</code>，只须问一句：它改不改对象状态。
    </p>
    <p>
      再补初始化和访问的细节。带参构造用初始化列表 <code>Person(const std::string&amp; n, int a) : name(n), age(a) {}</code> 一次性把成员初始化好，这也是初始化 const 成员和引用成员的唯一途径。另外，成员函数在类外定义时要用 <code>类名::成员名</code> 的限定语法；<code>struct</code> 与 <code>class</code> 的默认权限差异也要记牢，别靠运气。
    </p>
    <p>
      还有两个常被忽略的点。其一，C++11 起可以在类里给非静态数据成员直接写默认值（in-class 初始化器），省掉构造函数里的重复赋值。其二，友元 <code>friend</code> 可以访问 private 成员，但友元关系<strong>不传递、不继承</strong>：A 是 B 的友元、B 是 C 的友元，并不代表 A 能碰 C 的私有成员。
    </p>
    <div class="lesson-box warn">
      <strong>给只读的 getter 都加上 <code>const</code>：</strong>const 成员函数里不能修改对象状态，也不能调用非 const 成员函数。加上 <code>const</code> 之后，它既能被 const 对象调用，也能被非 const 对象调用——少写一个 <code>const</code>，反而会限制住自己。
    </div>

    <h2>访问控制与校验</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码看数据如何被 <code>private</code> 挡住、<code>setAge</code> 如何守住「年龄在 0 到 150」的规矩，以及 const 成员函数能做什么、不能做什么。</figcaption>
      <CPP09ClassesObjects />
    </figure>

    <h2>封装与守护职责</h2>
    <p>
      类是「数据 + 守护数据的规则」的一个整体：访问权限决定谁能进哪个门，<code>this</code> 让同一份成员函数知道自己正作用于哪个对象，const 成员函数则把「我只读」写进类型。封装不只是把变量藏起来，而是让对象始终待在自己定义的合法状态里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「封装」</span>指把数据与操作数据的成员函数组织在一个类中，并用访问控制（<code>public</code> / <code>protected</code> / <code>private</code>）约束外部只能通过公开接口访问对象，从而在类型内部维护对象的不变量（如「年龄非负」）。边界：<code>private</code> 只是编译期的名字访问限制，挡不住 <code>friend</code> 这类越权通道；另外 <code>class</code> 默认 <code>private</code>、<code>struct</code> 默认 <code>public</code>。
    </div>
  </LessonArticle>
</template>
