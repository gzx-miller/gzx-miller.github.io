const e=`<script setup lang="ts">
import CPP13Polymorphism from './CPP13Polymorphism.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>手里拿着的是基类指针 <code>Shape*</code>，指向的明明是 <code>Circle</code> 对象，调用 <code>area()</code> 却算出基类的答案——指针「看到」的类型和对象的真实类型对不上，调用到底该听谁的？
    </div>

    <h2>朴素做法：用类型标签手工分派</h2>
    <p>
      先想最直接的办法。既然一个形状容器里装着不同种类的图形，那就给每个对象配一个类型标签，绘制时按标签挨个判断：
    </p>
    <ul>
      <li><code>if (tag == CIRCLE) drawCircle(...)</code></li>
      <li><code>else if (tag == RECT) drawRect(...)</code></li>
    </ul>
    <p>
      这个做法确实「做对了」一件事：它能根据真实类型走到正确的逻辑分支。但它的不足同样明显——<strong>每新增一种形状，都要回头修改所有分派点</strong>。加一个 <code>Triangle</code>，就得在所有 <code>if/else</code> 链上补一支；漏改任何一处，运行结果就会错。类型信息由人手维护，等于绕开了编译器这层检查。
    </p>

    <h2>让函数自己「认领」：virtual 与 override</h2>
    <p>
      换一个思路：不在调用方判断类型，而是让每个派生类各自提供一份实现，调用时由对象自己决定用哪一份。基类把函数声明为 <code>virtual</code>：
    </p>
    <ul>
      <li><code>virtual double area() const;</code>：约定「这个函数可以被子类改写」。</li>
      <li>派生类重写时加 <code>override</code>：让编译器帮助校验——函数名、参数、<code>const</code> 限定都必须与基类一致，否则直接报错。</li>
    </ul>
    <p>
      为什么强调 <code>override</code>？因为不加它，一次手误的重载（比如漏了 <code>const</code>、写错参数）会静默地「隐藏」基类函数而非重写它，多态悄悄失效却没有任何警告。<code>override</code> 把这颗雷在编译期就排除掉。
    </p>

    <h2>动态绑定：虚函数表与 vptr</h2>
    <p>
      为什么 <code>virtual</code> 能让调用「认对象而不认指针」？这要靠两张表。编译器为每个含虚函数的类生成一张<strong>虚函数表</strong>（vtable），表里按固定槽位存放这个类各个虚函数的地址；每个对象在构造时被写入一个指向本类 vtable 的<strong>指针</strong>（vptr），通常藏在对象内存的最前面。
    </p>
    <p>
      于是 <code>shape-&gt;area()</code> 不再编译成「跳到一个固定地址」，而是运行时先取对象的 vptr，顺着它找到 vtable，再从对应槽位取出真正要执行的函数地址，做一次<strong>间接调用</strong>——这就是动态绑定。代价是每次虚调用多一次间接寻址，可能影响分支预测；换来的是调用点完全不需要知道对象的真实类型。
    </p>

    <h2>纯虚函数与抽象类：把接口与实现分开</h2>
    <p>
      如果基类的 <code>area()</code> 本身没有合理实现，可以写成纯虚函数：
    </p>
    <ul>
      <li><code>virtual double area() const = 0;</code>：<code>= 0</code> 表示只声明契约、不提供实现。</li>
      <li>含纯虚函数的类是<strong>抽象类</strong>，不能直接实例化；派生类必须实现全部纯虚函数才能实例化，否则它自己仍是抽象类。</li>
    </ul>
    <p>
      这样基类就退化为一份纯粹的<strong>接口</strong>：只规定「有哪些能力」，不关心「怎么实现」。上层业务代码只依赖接口，新增实现时上层不必改动，这正是多态带来解耦的关键。
    </p>

    <h2>虚析构函数：多态删除的必修课</h2>
    <p>
      用了基类指针，就很可能用 <code>delete base_ptr</code> 释放派生对象。若基类析构函数不是虚的，<code>delete</code> 只会调用基类析构函数，派生类析构函数根本不执行，派生类持有的资源（文件句柄、堆内存）就此泄漏，标准把这种情况定为未定义行为。结论很硬：<strong>只要类含有虚函数，就把析构函数声明为 virtual</strong>。
    </p>
    <p>
      还有两个容易忽略的角落：构造函数体里调用的虚函数<strong>不会</strong>触发动态绑定（此时派生类部分尚未构造完），析构函数体里同理（派生类部分已经先被拆掉）。理解这一点，就不会在构造、析构里期待多态行为。
    </p>

    <h2>看一遍抽象类与动态绑定</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中的抽象基类 <code>Shape</code> 与 <code>Circle</code>、<code>Rectangle</code>，观察只写一次基类指针上的 <code>draw</code> / <code>area</code> 调用，运行时就分发到各派生类实现。</figcaption>
      <CPP13Polymorphism />
    </figure>

    <h2>调用点只依赖接口</h2>
    <p>
      多态这件事的主线其实只有一句话：<strong>调用点写死的是接口，运行期由对象的真实类型决定行为</strong>。围绕它配套的几条规矩——<code>override</code> 防手误、纯虚函数划接口、虚析构保清理、<code>final</code> 止重写——合起来才是一个可靠、可维护的多态体系。
    </p>
    <div class="lesson-term">
      <span class="term-name">「动态绑定」</span>指通过基类的指针或引用调用虚函数时，实际执行哪个版本在运行时才确定；<span class="term-name">「虚函数表（vtable）」</span>是每个含虚函数的类在编译期生成的函数地址表，对象里由 <span class="term-name">「vptr」</span>指向它。<span class="term-name">「抽象类」</span>是含纯虚函数、不能实例化的类；把派生对象按值传给基类参数会发生<span class="term-name">「对象切片」</span>，只保留基类部分，多态随之失效。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
