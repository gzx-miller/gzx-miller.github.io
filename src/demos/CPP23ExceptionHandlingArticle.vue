<script setup lang="ts">
import CPP23ExceptionHandling from './CPP23ExceptionHandling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个读取配置的函数，失败时返回 <code>-1</code>。调用方忘了写 <code>if</code> 判断，程序就带着这个 <code>-1</code> 一路往下跑——它不会在这里报错，而是过一会儿在完全不相干的另一行以崩溃的形式暴露出来。错误为什么要跑这么远才被发现？
    </div>

    <h2>失败报告的机制</h2>
    <p>
      函数经常会失败：文件打不开、内存不够、参数越界。于是每个函数都得面对一个问题：<strong>我怎么把自己失败了这件事告诉调用者？</strong>
    </p>
    <p>
      在没有异常的老办法里，答案是「返回一个特殊值」——返回 <code>-1</code>、返回 <code>nullptr</code>、或者查全局的 <code>errno</code>。它能工作，但把三笔隐藏成本推给了写代码的人：
    </p>
    <ul>
      <li><strong>错误可以被无声忽略。</strong>错误码只是一个普通返回值，调用方忘了检查，编译器不会拦，程序带着错误状态继续跑。</li>
      <li><strong>错误信息会丢失。</strong>一个 <code>-1</code> 说不清「哪个文件、哪一行、为什么」，想保留细节就得额外维护全局变量，而全局变量在多线程下又是一场灾难。</li>
      <li><strong>每一层中间函数都得搬运。</strong>错误要从出事的深处传到你手上，沿途每个函数都得检查、再原样往上返回，中间漏掉一层，链条就断了。</li>
      <li><strong>构造函数没有返回值。</strong>对象构造到一半失败了，你没有任何通道把它报出去，只能造出一个状态可疑的对象让调用方去查。</li>
    </ul>
    <p>
      所以真正的问题是：<strong>能不能让「出错」变成一件无法被顺手忽略的事，并且让它自动沿着调用栈往上传，直到遇到愿意处理它的人？</strong>
    </p>

    <h2>错误码的逐层传递</h2>
    <p>
      最朴素的做法：定义一个约定的错误码，函数出错时返回它，每一层都 <code>if</code> 一下，不是成功值就往上返回。
    </p>
    <p>
      这个做法做对了一件重要的事：<strong>它把「会失败」写进了接口</strong>。调用者从签名和文档里就知道「这个函数是有可能失败的」，而不是误以为它一定成功。这份「错误是正常流程的一部分」的诚实态度，必须保留。
    </p>

    <h2>漏判错误码的后果</h2>
    <ul>
      <li>调用方漏写判断时，<code>int n = parse(text);</code> 拿到 <code>-1</code> 也照常参与后面的运算，得到一个荒谬的结果，而且崩在离现场很远的地方。</li>
      <li>错误码占用了返回值的通道。一个既想返回计算结果、又想报告失败状态的函数，被逼着把结果改成出参，或者不得不引入全局变量。</li>
      <li>构造函数这条路直接堵死：它没有返回值，你没法用 <code>-1</code> 告诉外面「这个对象没造出来」。</li>
      <li>想区分多种错误只能靠约定几个数字，<code>-1</code>、<code>-2</code>、<code>-3</code>……一旦文档没跟上，就没人读得懂这些数字了。</li>
    </ul>

    <h2>抛出后的自动传播</h2>
    <p>
      不推翻「失败必须被报告」，而是换一种报告方式：<strong>不去「返回」错误，而是让错误沿着调用栈自己往上冲，直到有人接住它。</strong>
    </p>
    <p>
      机制有三个关键词。<code>throw</code> 抛出一个异常对象——它可以是任何类型，但通常继承自 <code>std::exception</code>，从而带上 <code>what()</code> 这样的描述信息。<code>try</code> 块圈出「可能出事的代码」。<code>catch</code> 块负责接住并处理。异常一旦被抛出，控制流立刻离开当前函数，开始向外层逐级寻找类型匹配的 <code>catch</code>；中间那些不需要处理它的函数<strong>一行代码都不用写</strong>。这正是相比错误码最大的进步：错误不会被中间层顺手吞掉。
    </p>
    <p>
      传播过程中，局部对象的析构由上一课的<strong>栈展开</strong>负责，所以只要资源是 RAII 管理的，哪怕抛异常也不会泄漏。两门课在这里正好咬合上。
    </p>
    <p>
      把机制用对，还要补上四层细节：
    </p>
    <ol class="lesson-steps">
      <li><strong>catch 按出现顺序匹配，所以必须从派生类排到基类。</strong>把自定义的 <code>MyException</code> 写在 <code>std::exception</code> 之前；顺序反了，具体异常会被基类那个 <code>catch</code> 提前截走，你精心写的处理逻辑永远不执行。</li>
      <li><strong>抛标准异常类型，或自定义继承 <code>std::exception</code> 的类。</strong><code>std::runtime_error</code> 表示运行时错误，<code>std::invalid_argument</code> 表示参数非法。标准库的异常层次——<code>std::bad_alloc</code>（<code>new</code> 失败）、<code>std::bad_cast</code>（<code>dynamic_cast</code> 失败）、<code>std::runtime_error</code>、<code>std::logic_error</code>——都是以 <code>std::exception</code> 为根的，统一接在基类上就能兜底。</li>
      <li><strong>不需要处理的异常不要写空 catch 吞掉。</strong><code>catch (...)</code> 能接住所有异常，正确用途是「先做清理，再用 <code>throw;</code> 原样重新抛出」或「记完日志后终止程序」，而不是假装没发生继续跑。</li>
      <li><strong>用 <code>noexcept</code> 声明不抛异常的函数。</strong>编译器得以据此优化；C++17 起 <code>noexcept</code> 还成为函数类型的一部分，影响函数指针类型与重载决议。更实际的是，标准库看到某个移动操作是 <code>noexcept</code>，容器扩容时才会放心走移动路径。</li>
    </ol>
    <p>
      那么「我的函数到底承诺到什么程度」？这就是<strong>异常安全保证</strong>的三级标准：<strong>基本承诺</strong>是出错后程序仍处于有效状态、不泄漏资源；<strong>强承诺</strong>是操作要么完全成功、要么完全回滚，就像从没被调用过；<strong>不抛异常承诺</strong>是保证永不抛出，对应 <code>noexcept</code>。写代码时你要明确自己在提供哪一级，而不是含糊地「尽量别出问题」。
    </p>
    <p>
      最后是那个必须刻进本能的规定：<strong>不要在析构函数里抛异常</strong>。如果析构函数抛异常时恰好还有另一个异常正在栈展开，程序会立即 <code>std::terminate</code>。
    </p>
    <div class="lesson-box hint">
      <strong>性能的真相：</strong>现代实现遵循「零开销原则」——只要异常不抛出，几乎没有任何运行时代价，代价只在真正 <code>throw</code> 的那一刻付出。所以「异常慢」并不是拒绝它的理由；但异常也不该被当作普通的流程控制频繁使用，那会让代码体积膨胀、分支预测变差。
    </div>

    <h2>多级捕获的匹配序</h2>
    <figure class="lesson-figure">
      <figcaption>看三层 <code>catch</code> 的排列：<code>processFile</code> 抛出自定义的 <code>MyException</code> 后，最先被 <code>const MyException&amp;</code> 这一层接住；把它的顺序和下面的 <code>std::exception</code> 对调，就会看到更泛的那一层把具体异常截走。</figcaption>
      <CPP23ExceptionHandling />
    </figure>

    <h2>异常的上升通道</h2>
    <p>
      异常处理把「失败」从一个可以被人忽略的返回值，变成了一条会自己闯到处理者面前的通道。错误一旦抛出就离开现场，沿途的中间函数无需搬运，RAII 顺手把资源收拾干净；到了 <code>catch</code> 这一层，你按从派生类到基类的顺序接住它，并明确自己提供的是基本、强还是不抛异常承诺。要记住的底线只有一条：构造函数可以抛，析构函数绝不能抛。
    </p>
    <div class="lesson-term">
      <span class="term-name">「异常安全保证」</span>指一个操作对「万一抛异常，程序状态会怎样」给出的承诺，分三级：<strong>基本承诺</strong>保证不泄漏资源、对象仍处于有效状态；<strong>强承诺</strong>保证操作要么完全成功、要么完全回滚，如同从未调用；<strong>不抛异常承诺</strong>（<code>noexcept</code>）保证永不抛出。边界：强承诺通常要靠「先构造副本、成功后再交换」的写法实现，代价是一次额外拷贝；而析构函数只应提供不抛异常承诺，因为它在栈展开期间再抛会直接终止程序。
    </div>
  </LessonArticle>
</template>
