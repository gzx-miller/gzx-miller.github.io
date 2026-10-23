const n=`<script setup lang="ts">
import CPP23ExceptionHandling from './CPP23ExceptionHandling.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个可能失败的函数用返回码报告错误，只要有一层调用忘了检查，错误就被悄悄吞掉；而构造函数根本没有返回值可用 —— 怎么让「出错」这件事无法被忽略，同时又保证资源一定被释放？
    </div>

    <h2>先朴素做法：返回错误码</h2>
    <p>
      最传统的方式是让函数返回一个状态码（或设置 <code>errno</code>），由调用者判断是否成功。
    </p>
    <ul>
      <li>做对的地方：正常值就是返回值，调用成本低，也没有任何隐藏控制流。</li>
      <li>不足：错误检查是<strong>调用者的义务</strong>，只要有一处忘看返回值，错误就被静默地传播下去；错误无法自动跨越多层调用冒泡，往往要逐层判断、逐层上抛；<strong>构造函数无法用返回值报告失败</strong>；而且若函数还要返回真正的计算结果，错误码就得额外用一个出参或全局变量来腾位置。</li>
    </ul>
    <p>
      根本矛盾在于：错误信息与正常返回值挤在同一个通道里，且没有任何机制强制调用者处理它。异常机制正是把「错误通道」独立出来的方案。
    </p>

    <h2>throw、try、catch 与匹配顺序</h2>
    <p>
      <code>throw</code> 表达式抛出一个异常对象，它可以是任意类型，但工程惯例是抛 <code>std::exception</code> 的派生类。<code>try</code> 块包住可能抛异常的代码，紧随其后的一个或多个 <code>catch</code> 块负责处理。
    </p>
    <ul>
      <li>catch 按<strong>书写顺序</strong>依次匹配，因此必须把<strong>派生类异常放在基类之前</strong>；否则基类的 catch 会抢先截获，更具体的分支永远进不去。</li>
      <li>捕获通常写 <code>catch (const SomeError&amp; e)</code>：<strong>按引用</strong>以避免对象切片与多余拷贝，<code>const</code> 表示不修改异常对象。</li>
      <li><code>catch (...)</code> 捕获所有异常，用于兜底、记录日志后 <code>throw;</code> 重新抛出当前异常；它会连未知类型一起吞下，应谨慎使用。</li>
    </ul>
    <p>
      只要抛出的对象能匹配上某个 catch 的形参类型（含继承关系下的向上转型），异常就由该处接管；这也是为什么「类型」在异常里格外重要 —— 它同时承担了「是否需要处理、由谁处理」的分派职责。
    </p>

    <h2>栈展开：异常发生时资源怎么被释放</h2>
    <p>
      抛出异常后，若当前函数没有对应的 catch，控制权会<strong>沿调用栈向上回退</strong>，去寻找能处理的 <code>try</code>。回退的每一步都会销毁该作用域内已经构造完成的局部对象，这个过程叫作<strong>栈展开</strong>（stack unwinding）。
    </p>
    <ul>
      <li>正是靠栈展开，RAII 对象在异常路径上与正常路径一样会被析构，资源因此不会泄漏 —— 这是异常能与 RAII 配合得如此自然的原因。</li>
      <li>局部对象的析构按<strong>构造顺序的逆序</strong>进行。</li>
      <li>由此引出一条铁律：<strong>析构函数不应抛出异常</strong>。若析构函数在栈展开期间又抛出异常而未能就地处理，程序会调用 <code>std::terminate</code> 直接终止。</li>
    </ul>

    <h2>noexcept 与三级异常安全保证</h2>
    <p>
      <code>noexcept</code> 声明一个函数<strong>不会抛出异常</strong>。它不只是文档：C++17 起它是函数类型的一部分，会影响重载决议与函数指针类型；对不抛异常的实现，标准库在移动、容器重分配等场合会走更高效的路径。需要记住，若被标记 <code>noexcept</code> 的函数真的抛了异常，将直接调用 <code>std::terminate</code>，不会进行栈展开。
    </p>
    <p>
      与之配套的是一套「异常安全保证」的分级描述：
    </p>
    <ul>
      <li><strong>基本承诺</strong>：异常抛出后，程序仍处于<strong>有效状态</strong>，不泄漏资源、不破坏不变量，但具体状态可能已改变。</li>
      <li><strong>强承诺</strong>：操作要么完全成功、要么完全失败，状态如同调用从未发生（事务性）。常见实现手法是「先复制一份副本，改副本，最后用不抛异常的 swap 一次性替换」。</li>
      <li><strong>不抛异常承诺</strong>：函数保证永不抛出异常，用 <code>noexcept</code> 标注。</li>
    </ul>

    <h2>标准异常体系与自定义异常类</h2>
    <p>
      C++ 标准库提供了一套异常类型层次，根节点是 <code>std::exception</code>，其主要分支及常见成员如下。
    </p>
    <ul>
      <li><code>std::logic_error</code> 分支：程序逻辑错误，如 <code>std::invalid_argument</code>、<code>std::out_of_range</code>、<code>std::length_error</code>。</li>
      <li><code>std::runtime_error</code> 分支：运行时才能发现的错误，如 <code>std::range_error</code>、<code>std::overflow_error</code>。</li>
      <li>非 <code>logic_error</code> / <code>runtime_error</code> 的直接派生：<code>std::bad_alloc</code>（内存分配失败）、<code>std::bad_cast</code>（<code>dynamic_cast</code> 失败）等。</li>
      <li>所有类型都提供虚函数 <code>what()</code> 返回错误说明。</li>
    </ul>
    <p>
      自定义异常类通常继承 <code>std::runtime_error</code> 或 <code>std::logic_error</code>，在构造函数里把错误信息转发给基类，从而自动复用 <code>what()</code>；这样既携带了业务语义，又能被 <code>catch (const std::exception&amp;)</code> 统一兜底。此外，<strong>构造函数抛异常是报告对象构造失败的唯一合理方式</strong> —— 因为对象一旦未能完整构造，析构函数不会执行，资源必须由已成功构造的成员各自负责。
    </p>

    <h2>看一遍异常的分派与处理顺序</h2>
    <figure class="lesson-figure">
      <figcaption>示例定义了一个继承自 std::runtime_error 的自定义异常，演示 try/catch 按「派生类在前、基类在后、catch(...) 兜底」的顺序匹配，并给出 noexcept 函数的写法；可对照捕获顺序验证异常分派规则。</figcaption>
      <CPP23ExceptionHandling />
    </figure>

    <h2>把「出错」变成一条独立的控制流</h2>
    <p>
      异常的价值不是「多了一种 if」，而是把<strong>错误的发生</strong>与<strong>错误的处理</strong>分离开：抛出点只负责把问题交出去，处理点可能在很上层的调用里；沿途所有资源由 RAII 在栈展开时自动收拾。写好异常安全的关键因此收敛为两件事 —— 用 RAII 管住每一个资源，让析构函数永不抛异常。做到这两点，正常路径与异常路径就共享同一套释放逻辑，代码不再需要为「万一中间失败」单独铺应急分支。
    </p>
    <div class="lesson-term">
      <span class="term-name">「栈展开」</span>指异常沿调用栈向上寻找处理者时，逐层逆序销毁局部对象的过程。<span class="term-name">「异常安全保证」</span>描述函数在抛出异常后对状态的承诺，分为基本、强、不抛异常三级。<span class="term-name">「noexcept」</span>是声明函数不抛出异常的关键字，C++17 起成为函数类型的一部分。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
