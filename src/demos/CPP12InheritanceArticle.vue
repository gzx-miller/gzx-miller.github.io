<script setup lang="ts">
import CPP12Inheritance from './CPP12Inheritance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>已经写好了 <code>Animal</code> 类，现在还需要一个 <code>Dog</code>：它拥有 <code>Animal</code> 的全部数据与行为，只多出几项自己的。最直接的办法是把 <code>Animal</code> 的代码整段复制过来再改，可两处几乎一样的代码各自维护，改一处漏一处。有没有一种写法，既能完整复用，又能表达「Dog 是一种 Animal」？
    </div>

    <h2>从复制代码到继承</h2>
    <p>
      复制代码做对的事是：让 <code>Dog</code> 确实拥有 <code>Animal</code> 的一切。不足也很明显：两份代码没有关联，无法从关系上表达「Dog 是一种 Animal」，也无法在不改动 <code>Dog</code> 的前提下统一升级 <code>Animal</code> 的公共部分。
    </p>
    <p>
      <strong>继承</strong>正是为了消除这层重复：让 <code>Dog</code> 直接<strong>复用</strong> <code>Animal</code> 的成员，只声明自己新增或需要改变的部分。被继承的类叫<strong>基类</strong>（父类），继承它的叫<strong>派生类</strong>（子类）。当派生类与基类满足「派生类 is-a 基类」（Dog is-a Animal）时，继承表达的就是这种<strong>是一种</strong>关系。
    </p>

    <h2>继承语法与三种继承方式</h2>
    <p>
      继承写在类名之后：<code>class Dog : public Animal</code>。冒号后面就是<strong>继承方式</strong>，它决定基类成员在派生类中的访问权限如何变化，共三种：
    </p>
    <ul>
      <li><code>public</code> 继承：保持原权限。<code>public</code> 成员在派生类中仍是 <code>public</code>，表达 is-a 关系，是最常用的方式。</li>
      <li><code>protected</code> 继承：基类的 <code>public</code> 与 <code>protected</code> 成员都降为 <code>protected</code>，只对继续派生的类开放。</li>
      <li><code>private</code> 继承：基类成员全部降为 <code>private</code>，外部与更下游的派生类都看不见。<code>class</code> 的默认继承方式就是它（<code>struct</code> 默认是 <code>public</code>）。</li>
    </ul>
    <p>
      以 <code>public</code> 继承为例：基类的 <code>public</code> 与 <code>protected</code> 成员在派生类里保持原样，<code>private</code> 成员则无论哪种继承方式都<strong>不可直接访问</strong>——派生类只能用基类提供的接口间接操作它们。
    </p>
    <p>
      那些为派生类预留、又不希望外部直接碰的成员，正是放在 <code>protected</code> 里的（上一章讲过它的定位），这样派生类能直接用，外部却够不着。
    </p>

    <h2>构造、析构顺序与名字隐藏</h2>
    <p>
      <strong>构造与析构顺序</strong>是继承里最确定的一条规定：构造时<strong>先基类、后派生类</strong>，析构时<strong>先派生类、后基类</strong>，恰好相反。原因在于派生类可能依赖基类的初始化结果，得等基类就位才能动；销毁时则要先把派生层拆掉，再交给基类收尾。因此派生类构造函数必须在初始化列表里显式调用基类构造。
    </p>
    <p>
      另一件常被误解的事是<strong>名字隐藏</strong>：派生类只要定义了与基类<strong>同名</strong>的成员，基类中所有同名成员就会被<strong>隐藏</strong>，不论参数是否相同，也不能靠重载「找回来」。想调用被隐藏的基类版本，必须用作用域限定，写成 <code>d.Base::show()</code> 这种形式。
    </p>

    <h2>对象切片与 is-a 关系</h2>
    <p>
      继承真正的价值在<strong>多态</strong>：通过基类指针或引用操作派生类对象，调用到派生类的行为。这里有一个陷阱值得单独说明——<strong>对象切片</strong>。
    </p>
    <p>
      当把一个派生类对象<strong>按值</strong>赋给基类对象时，如 <code>Animal a = dog;</code>，发生的是「切掉派生类独有的那部分、只保留基类子对象」的复制，得到一个 <strong>纯基类对象</strong>；此后通过它调用行为，只会走基类的版本，多态失效。这就是对象切片。
    </p>
    <ul>
      <li>切片发生在<strong>按值传递或按值赋值</strong>时，因为值语义只复制「基类那一部分」。</li>
      <li>避开的方法：用<strong>指针或引用</strong>传递，如 <code>Animal&amp; a = dog;</code>，被绑定的仍是完整的派生类对象，不发生切片。</li>
    </ul>
    <p>
      <strong>is-a 关系</strong>是判断继承是否合理的准绳：只有当「派生类确实是一种基类」时，<code>public</code> 继承才恰当。若只是为了借用基类的实现（has-a，或纯粹的实现复用），用<strong>组合</strong>（把基类对象作为成员）往往更合适，也更不易切片。
    </p>

    <h2>多继承与虚基类（基础）</h2>
    <p>
      C++ 允许一个类同时继承多个基类，写法是逗号分隔：<code>class Amphibian : public Land, public Water</code>。多继承能表达「兼具多种能力」，但它会带来一个典型问题——<strong>菱形继承</strong>：若 <code>Land</code> 与 <code>Water</code> 都继承自同一个 <code>Animal</code>，那么 <code>Amphibian</code> 里会出现<strong>两份</strong> <code>Animal</code> 子对象，访问 <code>Animal</code> 的成员就产生歧义。
    </p>
    <p>
      解决办法是<strong>虚继承</strong>：在继承时写 <code>class Land : virtual public Animal</code>，让这条继承链共享<strong>唯一一份</strong>基类子对象，菱形中被共享的那个基类就叫<strong>虚基类</strong>。相应地，虚基类的初始化由<strong>最派生类</strong>负责，不能只交给中间类。若把对象切片、名字隐藏、菱形多继承放在一起看，会发现它们都是「派生类与基类的关系没有摆正」在不同层面的表现。
    </p>

    <h2>看图对照：多态与切片</h2>
    <figure class="lesson-figure">
      <figcaption>这份示例用 <code>Animal</code> 与 <code>Dog</code> 展示 <code>public</code> 继承、虚函数重写与虚析构函数如何协作，可对照看到通过基类指针调用派生类行为（动态绑定）与按值赋值导致对象切片之间的差别。</figcaption>
      <CPP12Inheritance />
    </figure>

    <h2>用「是一种」而不是「像是一种」来决定继承</h2>
    <p>
      继承带来的最大收益，是让基类的接口成为一纸契约：所有派生类都得遵守它，调用方则可以统一地通过基类指针或引用来使用不同的派生对象。反过来，它也带来最容易被忽视的陷阱——切片与名字隐藏。判断继承是否该用的标准始终只有一条：派生对象<strong>确实是一种</strong>基类对象；只是「实现看起来能复用」时，组合才是更稳妥的选择。
    </p>
    <div class="lesson-term">
      <span class="term-name">「基类 / 派生类」</span>分别指被继承的类与继承它的类，公有继承表达 is-a 关系；<span class="term-name">「继承方式」</span>用 <code>public</code>、<code>protected</code>、<code>private</code> 决定基类成员在派生类中的访问权限；<span class="term-name">「名字隐藏」</span>指派生类的同名成员遮蔽了基类所有同名成员，需用作用域限定符访问；<span class="term-name">「对象切片」</span>指把派生类对象按值赋给基类对象时派生部分被切掉，多态随之失效；<span class="term-name">「虚基类」</span>是虚继承下被整条继承链共享的唯一基类子对象。
    </div>
  </LessonArticle>
</template>
