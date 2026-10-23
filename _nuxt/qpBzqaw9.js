const n=`<script setup lang="ts">
import CPP21MoveSemantics from './CPP21MoveSemantics.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>把一个装着上万条数据的 <code>std::vector</code> 从函数返回出来，深拷贝一步步把每条数据都复制到新对象，再立刻把源对象销毁——源内存刚复制完就没人要了。既然源对象马上就要消失，这次复制凭什么还要发生？
    </div>

    <h2>从一次无谓的深拷贝说起</h2>
    <p>
      上一章的深拷贝解决了「两个对象共享一块内存」的问题，却也带来了新代价。复盘一次按值返回大对象的全过程：如果每一步都老老实实深拷贝，就得为新对象再分配同样大的内存、逐条复制，然后立刻把源对象销毁，那块源内存刚复制完就被回收。
    </p>
    <p>
      这次拷贝做对了什么？它保证了新对象拥有独立资源。不足在哪？<strong>源对象马上就要消失，它的资源本可以直接交出去</strong>，却被完整复制了一遍，白白付出时间与内存。迭代的方向由此清晰：与其复制，不如<strong>搬走</strong>——把资源的所有权从源对象转移到目标对象。
    </p>

    <h2>左值与右值：为什么需要区分</h2>
    <p>
      想「搬走」，前提是能判断一个表达式所代表的资源<strong>是否还有人会用</strong>。C++ 用<strong>值类别</strong>来回答这个问题：
    </p>
    <ul>
      <li><strong>左值</strong>（lvalue）：有名字、有确定地址、还会被继续使用的表达式，如变量 <code>a</code>。它的资源不能随便搬走，因为后面还指望它。</li>
      <li><strong>右值</strong>（rvalue）：临时结果、没有名字、表达式结束后就消失的表达式，如 <code>2 + 3</code>、函数返回的临时对象。它的资源已经没人再要，可以放心搬走。</li>
    </ul>
    <p>
      朴素的拷贝语义把二者一视同仁，都得复制。真正缺少的是一条规则：<strong>对「马上要消失的源对象」，允许把资源偷过来</strong>。这就是移动语义要补上的缺口，而区分左右值正是它的判断依据。
    </p>

    <h2>右值引用与 std::move</h2>
    <p>
      为了能专门给右值写重载，C++11 引入了一种新类型——<strong>右值引用</strong>，写作 <code>T&amp;&amp;</code>。它只能绑定到右值（临时对象），与绑定左值的 <code>T&amp;</code> 形成两组可区分的重载：<code>f(T&amp;)</code> 走拷贝路线，<code>f(T&amp;&amp;)</code> 走移动路线。
    </p>
    <p>
      但现实里经常是「手里有个左值变量，明知它之后不用了，却仍是个有名字的左值」，无法直接匹配 <code>T&amp;&amp;</code>。为此有了 <code>std::move</code>：它<strong>并不移动任何东西</strong>，只是把左值<strong>转换</strong>成一个右值引用，好让它匹配到移动重载——<code>std::string t = std::move(s);</code> 里真正的搬运由移动构造函数完成。
    </p>
    <p>
      有一处必须记住：<strong>被移动后的对象仍是一个合法对象，但内容处于「有效但不确定」的状态</strong>，最稳妥的处理是随即给它赋新值、或不再使用，不能假设它还留着原值。
    </p>

    <h2>移动构造与移动赋值</h2>
    <p>
      移动版的拷贝控制函数与拷贝版一一对应，但参数换成右值引用，做的事从「复制资源」变成「<strong>接管资源</strong>」：
    </p>
    <ul>
      <li><strong>移动构造函数</strong>：<code>Vec(Vec&amp;&amp; other)</code>，把 <code>other</code> 的指针直接接过来，再把 <code>other</code> 的指针置空，让它安全地脱离资源。</li>
      <li><strong>移动赋值运算符</strong>：<code>Vec&amp; operator=(Vec&amp;&amp; other)</code>，比移动构造多两步——先释放自己原有的资源，同样做自赋值检查。</li>
    </ul>
    <p>
      关键在于<strong>源对象必须被置为可析构的安全状态</strong>（通常把裸指针设为 <code>nullptr</code>、长度归零）。否则源对象析构时会去 <code>delete</code> 那块已经被交出去的内存，又变成重复释放。移动的实质是<strong>一次指针交换</strong>，摊还成本几乎是常数，这也是它比深拷贝快得多的原因。
    </p>

    <h2>noexcept、返回值优化与完美转发</h2>
    <p>
      三件事都与「移动能否被采纳」有关。
    </p>
    <p>
      <strong>noexcept</strong>：移动构造与移动赋值应尽量标为 <code>noexcept</code>，明确承诺不抛异常。<code>std::vector</code> 扩容时要搬走旧元素，若移动可能抛异常，它<strong>为了强异常安全会退而选择拷贝</strong>；标上 <code>noexcept</code>，才会放心走移动，性能差异相当可观。
    </p>
    <p>
      <strong>返回值优化</strong>（RVO/NRVO）：函数按值返回局部对象时，编译器往往<strong>直接在调用方位置构造</strong>该对象，连一次拷贝或移动都省掉，这叫返回值优化（RVO，含具名的 NRVO）。因此别为了「减少拷贝」而提前 <code>std::move(局部对象)</code> 再返回，那样反而会阻碍这项优化。
    </p>
    <p>
      <strong>完美转发</strong>：把接收到的参数<strong>原封不动</strong>地转交给下一层函数，左值仍是左值、右值仍是右值。它靠模板中的 <code>Args&amp;&amp;...</code> 配合 <code>std::forward&lt;Args&gt;(args)...</code> 完成，是 <code>std::make_unique</code> 这类工厂函数「不额外拷贝就能构造出目标对象」的动机。
    </p>

    <h2>看图对照：移动、搬空与 RVO</h2>
    <figure class="lesson-figure">
      <figcaption>这份示例用 <code>std::string</code> 与 <code>std::vector</code> 演示移动构造与移动赋值如何把源对象搬空，并用一个按值返回 <code>vector</code> 的 lambda 展示返回值优化带来「通常无拷贝」的效果，可对照运行输出验证。</figcaption>
      <CPP21MoveSemantics />
    </figure>

    <h2>从「都会复制」到「能搬则搬」</h2>
    <p>
      移动语义并没有推翻拷贝控制，而是在它旁边补上了一条更聪明的分支：拷贝版照顾「源对象还要继续用」，移动版照顾「源对象马上要消失」。判断走哪条分支的依据不是代码写在哪，而是<strong>实参是左值还是右值</strong>；<code>std::move</code> 只负责把这个判断结果调整成「可以搬」，真正的搬运仍由移动构造函数落实。至此，一条资源从申请、复制到转移的完整路径才算了然。
    </p>
    <div class="lesson-term">
      <span class="term-name">「左值 / 右值」</span>按表达式是否还有名字与地址、是否会被继续使用来区分，右值的资源可以安全搬走；<span class="term-name">「右值引用」</span>写作 <code>T&amp;&amp;</code>，只能绑定右值，用于为移动语义提供可区分的重载；<span class="term-name">「移动构造 / 移动赋值」</span>以右值引用为参数，接管而非复制源对象的资源，并把源对象置为可安全析构的状态；<span class="term-name">「完美转发」</span>指把实参的左/右值属性原样传递给下一层函数。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
