<script setup lang="ts">
import CPP30CodingStandards from './CPP30CodingStandards.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一段代码你反复读过，<code>new</code> 出来的指针在函数结尾老老实实 <code>delete</code> 了，挑不出毛病。可压测时进程的内存却一直在涨——问题不在你看到的那条 <code>delete</code>，而在它<strong>上面几行</strong>你没太在意的地方。
    </div>

    <h2>释放语句的位置</h2>
    <p>
      那段代码大概是这个形状：先 <code>int* p = new int[100];</code>，紧接着做几步可能失败的检查，最后 <code>delete[] p;</code>。看起来对称，其实中间只要有一条<strong>提前返回</strong>或<strong>抛出异常</strong>的路径，后面的 <code>delete</code> 就走不到，这块内存就再也回不来了。这正是「编码规范」真正要对付的东西：它不是审美偏好，而是<strong>人靠自觉永远守不住的一类错误</strong>。
    </p>
    <p>
      把这类错误拆开看，会发现它们有共同点——都靠「记得做某件事」来保证正确：记得 <code>delete</code>、记得别写窄化转换、记得给宏的参数加括号、记得别漏掉某个分支。可人的记忆在分支一多、路径一长时就不可靠。所以要问的其实是：<strong>能不能把「必须记得做的事」，改成「机制替你保证、工具替你检查」？</strong>
    </p>

    <h2>人工自觉与评审</h2>
    <p>
      最朴素的补救：写代码时更小心——每个 <code>new</code> 都配上 <code>delete</code>，每条提前返回之前都记得释放，然后靠 code review 互相盯。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「资源必须被释放」这个约束</strong>。有了这个意识，简单函数里经常真的能写对——在没有异常、没有多条返回路径的情况下，对称的 new/delete 也确实工作正常。
    </p>

    <h2>异常展开的盲区</h2>
    <ul>
      <li><strong>异常一抛，<code>delete</code> 就没机会执行。</strong>中间那步检查抛出异常时，栈会向上展开，函数末尾的 <code>delete[]</code> 根本不会运行——你读代码时看到的「释放」，在异常路径上并不存在。</li>
      <li><strong>多条返回路径各有各的漏洞。</strong>函数里有三个 <code>if</code> 提前 <code>return</code>，你就得在四处各写一次释放；漏掉任何一处，都是只在特定输入下才暴露的泄漏。</li>
      <li><strong>靠 review 抓不住全部。</strong>这类错误在正常路径上完全不显形，评审时看到的是一段干净、对称的代码，问题要等某条边界输入或异常才被触发。</li>
      <li><strong>「记得」这种事还会在别处重复。</strong>窄化转换、宏的副作用、忘记初始化的变量，全都是同一类「忘了就出事、还特别难查」的坑——对着清单逐条背，成本高且不可靠。</li>
    </ul>

    <h2>类型与工具链的接管</h2>
    <p>
      不推翻「资源要释放」，而是换一个思路：<strong>不再让人的记忆负责，改让类型系统和工具链负责</strong>。一层层补。
    </p>
    <ol class="lesson-steps">
      <li><strong>先把资源交给对象管（RAII）。</strong>这是 C++ Core Guidelines 里排在最前面的建议 R.1：把资源的获取与释放绑定在对象的构造与析构上，函数无论从哪条路径退出——正常返回还是抛异常——栈上对象的析构函数都会执行。原先那段代码只要把 <code>new</code> 的结果直接存进智能指针（例如成员里放一个 <code>std::unique_ptr&lt;int[]&gt;</code>），就再也不用写 <code>delete</code> 了。</li>
      <li><strong>再把「所有权」写进类型。</strong>换成 <code>std::unique_ptr</code>/<code>std::shared_ptr</code> 之后，「谁拥有这块资源」从注释里的约定变成了类型上的一部分：<code>unique_ptr</code> 独占、<code>shared_ptr</code> 引用计数共享，转移所有权要显式 <code>std::move</code>。所有权一目了然，就不用再靠「我记得这里该由谁释放」。</li>
      <li><strong>把意图写进签名（const 正确）。</strong>承诺「我不改这个参数」就写 <code>const</code> 引用，承诺「这个成员函数不改对象」就在函数后面加 <code>const</code>。<code>const</code> 不只是自文档，它还是<strong>编译期约束</strong>：真有一次误改，编译会直接拦下，而不是留到运行时。传参也遵循 F.15——按 <code>const</code> 引用传入、按值返回，避免无谓拷贝。</li>
      <li><strong>能不用宏就不用宏。</strong>宏是文本替换，没有类型、没有作用域，参数还可能被意外求值多次。多数需求都有更好的替代：常量用 <code>constexpr</code>、限定取值用 <code>enum class</code>、需要泛化用 <code>template</code>。</li>
      <li><strong>把「靠人检查」换成「靠工具检查」。</strong>静态分析工具 <code>clang-tidy</code>（基于 LLVM/Clang，可查现代规范、性能与正确性）、<code>Cppcheck</code> 能在不运行程序时就指出问题；运行期则用 sanitizer 按住：<code>AddressSanitizer</code> 抓内存错误、<code>UndefinedBehaviorSanitizer</code> 抓未定义行为、<code>ThreadSanitizer</code> 抓数据竞争。这一步的关键转变是——<strong>前面那些规范不再靠你记住，而是由工具强制发现</strong>。</li>
      <li><strong>最后把这一切固化进工程流程。</strong>用 CMake 统一构建、用 Google Test 或 Catch2 写测试、用 vcpkg/Conan 管依赖，再让 CI（如 GitHub Actions）在每次提交时自动跑构建、测试、静态分析与 sanitizer。<strong>规范只有进了流程，才不会随某个人的疏忽而失效。</strong></li>
    </ol>
    <p>
      走到这里就能看清「编码规范」的本质了：那些条款（RAII、const 正确、避免宏）不是要你去背诵的规矩，而是<strong>把约束从「人的自律」搬进「类型系统加工具加流程」的手段</strong>。C++ 提供的正是这种能力，它管这叫<strong>零开销抽象</strong>：用模板、内联这些东西把高层写法编译成和手写底层代码一样快的机器码，而且<strong>你不需要的抽象不会带来任何运行期开销</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>别把这些当成「老规矩」：</strong>C++ 的抽象还在持续变强，C++11、17、20 各自是一次大更新（结构化绑定、if constexpr、折叠表达式、文件系统库、模块、概念、协程、范围库等），C++14/23 是较小的补充，跟着新标准更新工具链本身就能消掉一批旧坑。另外<strong>跨平台</strong>时还要单独留心：字节序用 <code>&lt;bit&gt;</code> 里的 <code>std::endian</code> 判断，字符编码用 <code>u8""</code> 字面量、<code>std::u8string</code> 与 <code>std::filesystem::path</code> 处理，尽量使用标准特性，只对确有的编译器差异用预定义宏兜底。
    </div>

    <h2>好写法与坏写法</h2>
    <figure class="lesson-figure">
      <figcaption>对照看「好做法」和「坏做法」：<code>Resource</code> 把数组放进 <code>std::unique_ptr&lt;int[]&gt;</code>，连析构函数都不用写；旁边的 <code>badPractice()</code> 用裸 <code>new</code> 配 <code>delete[]</code>，中间一旦抛异常就会泄漏。<code>const std::vector&lt;int&gt; vec</code> 那两行则演示了 <code>const</code> 怎样把一次误改变成编译错误。</figcaption>
      <CPP30CodingStandards />
    </figure>

    <h2>内存责任的转移</h2>
    <p>
      那段压测下持续上涨的内存，根子不是某个 <code>delete</code> 写错了，而是<strong>「释放」这件事交给了人的记忆去保证</strong>。C++ 的办法是把约束前移：用 RAII 与智能指针让释放随对象析构自动发生，用 <code>const</code> 让误改在编译期被拦下，用 <code>constexpr</code>/<code>enum class</code>/模板替掉有副作用的宏，最后用 clang-tidy、sanitizer 和 CI 把这些规则变成每次提交都自动执行的检查。规范的价值不在于「写得好看」，而在于让正确性不再依赖你记不记得。
    </p>
    <div class="lesson-term">
      <span class="term-name">「零开销抽象」</span>C++ 的核心设计原则之一，指面向抽象写出的代码<strong>不该比人手写的底层代码慢</strong>，并且<strong>没用到的特性不产生任何运行期开销</strong>（只可能影响编译期）。模板、内联、<code>constexpr</code> 都是实现它的工具。边界要分清：它承诺的是「不额外变慢」，不是「一定更快」；而且这种优化依赖编译器<strong>真的把抽象看穿</strong>（内联、常量折叠等），一旦抽象边界挡住了优化，收益就不一定兑现。
    </div>
  </LessonArticle>
</template>
