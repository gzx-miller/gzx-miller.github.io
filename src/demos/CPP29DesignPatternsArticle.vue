<script setup lang="ts">
import CPP29DesignPatterns from './CPP29DesignPatterns.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个数据模块在「值变了」之后，要通知日志、界面、缓存三块各自更新。你直接在数据类里挨个调用它们的方法，功能也确实跑通了——可下周产品说「再加一个统计模块」，你就得回头改数据类的源码、重新编译。加一个听众而已，凭什么要动到它？
    </div>

    <h2>通知与变更耦合</h2>
    <p>
      你原本只想做一件小事：「数据变了，让关心它的人知道」。但一旦把「通知谁」和「谁在变化」写死在一起，变化的一方和响应的一方就捆死了：新增一个响应者，要去改发布者；想临时停掉某个响应者，得进去改代码；想复用时，发现这段通知逻辑和具体业务缠在一起，根本拆不出来。
    </p>
    <p>
      要把它解开，得先问一个问题：<strong>变化的一方，能不能只管「通知」，而完全不知道有哪些人在听？</strong>只要它不知道听众是谁，增删听众就不再需要动它。这正是「设计模式」要对付的形状——它不是要你背招式，而是<strong>把会变化的那一部分从稳定结构里剥出来</strong>。
    </p>

    <h2>发布者观察者清单</h2>
    <p>
      最朴素的答案是用<strong>观察者模式</strong>：让发布者（<code>Subject</code>）持有一份观察者清单，提供 <code>attach</code> 登记、<code>notify</code> 广播两个方法；每个关心数据的人把自己登记进去，变化发生时统一收到通知。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「谁在听」从发布者的代码里拿走了</strong>。发布者只面对一份清单，「加一个模块」变成调用一次 <code>attach</code>，发布者的源码一行都不用改。
    </p>

    <h2>观察者形式局限</h2>
    <ul>
      <li><strong>观察者的形式太窄。</strong>如果沿用「定义一个抽象 <code>Observer</code> 基类、每个观察者继承它」的经典写法，就会出现大量只写一个方法的空壳类——明明只是一段逻辑，却被迫建一个类来承载它。</li>
      <li><strong>对象的生死没人管。</strong>清单里放裸指针时，若某个观察者在没有 <code>detach</code> 的情况下被销毁，下一次 <code>notify</code> 就会调用到一块已经释放的内存。</li>
      <li><strong>创建对象的地方在漏内存。</strong>发布者、观察者、以及将来要产生的各种「产品」对象，如果都用 <code>new</code> 手工建、手工 <code>delete</code>，任何一条提前返回或抛异常的路径漏掉一次 <code>delete</code>，就是一处泄漏。</li>
      <li><strong>「谁来创建」的决策散落各处。</strong>到底 new 出哪一种具体类型，如果写在业务代码里，那么新增一种类型就要去找所有 new 的地方一起改。</li>
    </ul>

    <h2>可调用对象放宽</h2>
    <p>
      不推翻观察者，而是一层层往上补，先补最紧的那步。
    </p>
    <ol class="lesson-steps">
      <li><strong>先把观察者的形式放宽。</strong>观察者本来只需要「能被调用一次」，那就用 <code>std::function&lt;void(int)&gt;</code> 表示：清单类型换成 <code>std::vector&lt;std::function&lt;void(int)&gt;&gt;</code>，登记时直接塞一个 lambda 进去。这样就<strong>不必再定义 <code>Observer</code> 接口</strong>，一段行为就能当观察者用——这正是现代 C++ 带来的简化：许多经典模式不再需要靠接口继承。</li>
      <li><strong>再管住对象的生死。</strong>沿用前面 RAII 的思路，把动态分配的对象交给智能指针。工厂返回 <code>std::unique_ptr&lt;Base&gt;</code>，调用方拿到的是「独占所有权」的句柄，用完自动释放，提前返回或抛异常都不会泄漏——把「谁负责删」从人的记忆里挪进类型里。</li>
      <li><strong>把「创建哪一种」从业务里剥出去。</strong>这就是<strong>工厂模式</strong>：业务只写「给我一个能 <code>use()</code> 的东西」，具体是 A 还是 B 由工厂按参数决定，新增类型只用改工厂，不用改调用点。调用方甚至不需要知道具体类型，只需要它满足产品接口。</li>
      <li><strong>需要「全局唯一」的登记中心时，再加单例。</strong>比如进程内唯一的配置或注册表，用 <code>static Singleton&amp; instance() { static Singleton s; return s; }</code>——把实例放进函数局部的 <code>static</code> 里，<strong>C++11 保证局部 <code>static</code> 的初始化是线程安全的</strong>，而且天然懒初始化，用到才建。</li>
      <li><strong>最后处理「算法可替换」。</strong>当通知之外还需要选择用哪套算法，就是<strong>策略模式</strong>：把算法抽成一个可替换的对象。现代 C++ 里同样可以用 <code>std::function</code>，或者干脆用模板参数指定策略，让「选哪套算法」在编译期就定下来，做到零开销。</li>
    </ol>
    <p>
      回头看这条链，每一步都不是「为了用某个模式」，而是<strong>为了补上上一步暴露的一个具体缺口</strong>：接口太窄就用可调用对象，生死没人管就交给智能指针，创建决策散落就用工厂，需要唯一实例才用单例，算法要换才用策略。模式是结果，不是起点。
    </p>
    <p>
      还有几个同类思路值得一并记住：<strong>模板方法</strong>是在基类里定好算法骨架、把某些步骤留给子类，C++ 的「非虚接口（NVI）」惯用法就是它的一种形态——公有的非虚函数在内部调用受保护的虚函数；<strong>访问者</strong>把「对一组对象做什么」从对象结构中分离出来，经典做法是双重分派，在 <code>accept(visitor)</code> 里再调 <code>visitor.visit(*this)</code>，但 C++17 的 <code>std::variant</code> 配 <code>std::visit</code> 提供了不必继承、类型也更安全的替代；<strong>原型</strong>是用克隆来创建对象，C++ 里可以写一个返回 <code>std::unique_ptr&lt;Base&gt;</code> 的虚 <code>clone()</code> 来实现。
    </p>
    <div class="lesson-box warn">
      <strong>两个真实边界：</strong>单例虽然方便，但它把「全局状态」引进来了——测试时难以隔离，并行使用时又成了共享可变状态，能用依赖注入就别动不动上单例；另外用 lambda 或 <code>std::function</code> 当观察者时，要留意<strong>它捕获了什么</strong>：若捕获了某个已被销毁对象的引用，<code>notify</code> 时同样会访问到悬垂数据，形式变了，生命周期问题并没有自动消失。
    </div>

    <h2>三种模式职责对照</h2>
    <figure class="lesson-figure">
      <figcaption>看这三个模式各自解决什么：<code>Singleton::getInstance()</code> 演示函数局部 <code>static</code> 的懒初始化单例，<code>createProduct('A')</code> 用工厂返回 <code>unique_ptr&lt;Product&gt;</code> 隐藏具体类型，<code>Subject</code> 用 <code>std::vector&lt;std::function&lt;void(int)&gt;&gt;</code> 让两个 lambda 都能当观察者。</figcaption>
      <CPP29DesignPatterns />
    </figure>

    <h2>稳定与变化分离</h2>
    <p>
      设计模式不是要先背熟的招式，而是<strong>把「会变化的那部分」从稳定结构里剥出来的结果</strong>。以「数据变化要通知谁」为例：观察者拿走了「谁在听」，智能指针拿走了「谁负责删」，工厂拿走了「创建哪一类」，单例只在确实需要唯一实例时才出现，策略则拿走了「用哪套算法」。你先把耦合逼到墙角，模式的名字往往自己就浮出来了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「观察者模式」</span>让一个被观察者（Subject）维护一份观察者清单，并在自身状态变化时逐个通知，从而<strong>把「发布者」与「订阅者」解耦</strong>：发布者不知道、也不需要知道订阅者的具体类型。边界：清单里对象的生命周期必须显式管理，否则销毁后仍被通知会导致悬垂访问；通知有同步与异步之分，同步通知里若某个观察者耗时过长会拖住发布者；还要防止「通知—被通知—再通知」形成的循环。
    </div>
  </LessonArticle>
</template>
