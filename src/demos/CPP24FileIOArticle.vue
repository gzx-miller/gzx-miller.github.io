<script setup lang="ts">
import CPP24FileIO from './CPP24FileIO.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个往日志文件追加内容的程序，每轮跑完都检查「写成功了吗」，全都成功。可跑了几轮之后打开文件一看，里面<strong>只剩最后一轮</strong>的记录，前面几轮凭空消失了——明明每一轮都写成功了，是谁把文件清空的？
    </div>

    <h2>提出问题</h2>
    <p>
      从文件读数据、往文件写数据，本质上是在跟一个<strong>外部设备</strong>打交道：它可能不存在、可能没权限、可能读到一半就到头了。这些情况都必须被感知和处理，否则你拿到的是「看起来正常、其实早就失败」的数据。
    </p>
    <p>
      在流抽象之前，用 C 的 <code>fopen</code> / <code>fread</code> / <code>fclose</code> 这一套也能干活，但代价同样落在人身上：
    </p>
    <ul>
      <li>每个文件句柄都要显式 <code>fclose</code>，中途 <code>return</code> 或抛异常就漏掉了，句柄一路泄漏到耗尽。</li>
      <li>打开模式靠拼字符串 flag（<code>"w"</code>、<code>"a"</code>、<code>"r+"</code>），拼错不会立刻报错，要等运行期行为不对才发现。</li>
      <li>类型安全为零：<code>fprintf(fp, "%d", x)</code> 里格式串和实参对不上，编译器完全不拦，运行起来才读出垃圾。</li>
      <li>解析文本全靠格式串，读一个整数要先 <code>fscanf</code> 再判返回值，格式稍有偏差整段逻辑就崩。</li>
    </ul>
    <p>
      所以问题是：<strong>能不能让文件读写拥有和内存操作一样的类型安全，并且让文件的打开与关闭自动跟着对象的生死走？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：用 <code>std::ifstream</code> 打开文件读、<code>std::ofstream</code> 打开文件写，读取用 <code>&gt;&gt;</code>，写入用 <code>&lt;&lt;</code>，用完就让对象自然离开作用域。
    </p>
    <p>
      这个方案做对了一件很漂亮的事：<strong>它让文件读写的语法和操作屏幕完全一样</strong>。<code>&lt;&lt;</code> 能写 <code>std::cout</code>，也能写文件；<code>&gt;&gt;</code> 能从 <code>std::cin</code> 读，也能从文件读。因为屏幕、键盘、文件在背后都是同一个抽象——<strong>流</strong>。类型安全和格式化也随这套抽象一起带了过来，不用再和格式串对赌。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>默认的 <code>std::ofstream</code> 用的是 <code>trunc</code>（截断）模式：<strong>每次打开都会把原文件清空</strong>。开场那个「只剩最后一轮」就是它干的——你想要的是追加，它给你的是覆盖。</li>
      <li>忘了检查是否真的打开了：文件不存在时打开失败，后面的 <code>&lt;&lt;</code> 全部静默丢弃，程序不报错、不崩溃，你写到一半才发现一个字节都没落盘。</li>
      <li><code>&gt;&gt;</code> 读字符串时遇到空白就停。<code>"Hello, C++!"</code> 读进来只剩 <code>Hello,</code>，后半截还留在流里，等着污染下一次读取。</li>
      <li>格式化读取失败时，<code>&gt;&gt;</code> 不抛异常，只是把流置为失败状态，目标变量保持原值不变——你以为读到了新数据，其实是一份脏值。</li>
      <li>「读到文件尾」和「真的读失败」是两件不同的事，想分清楚就得去看流的状态，光看变量看不出来。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用流读写文件」,而是把这套抽象的各个角落补齐。第一件要补的是<strong>打开模式</strong>，因为开场那个 bug 就出在这：<code>std::ios::in</code> 读、<code>std::ios::out</code> 写（默认带截断）、<code>std::ios::app</code> 追加、<code>std::ios::ate</code> 打开后定位到末尾、<code>std::ios::trunc</code> 截断、<code>std::ios::binary</code> 二进制。写日志要在后面接着写，就必须显式用 <code>app</code>。
    </p>
    <p>
      第二件是<strong>流状态</strong>。每个流对象内部维护着一组状态标志：<code>good()</code> 一切正常、<code>eof()</code> 到达文件尾、<code>fail()</code> 格式化操作失败（比如期望数字却读到字母）、<code>bad()</code> 严重错误（比如磁盘故障）。流对象还能隐式转换成 <code>bool</code>，所以判断成败可以直接写 <code>if (fs)</code>。这一步的意义是：<strong>失败不再沉默</strong>，你有了一个统一的、随时可查的失败信号。
    </p>
    <p>
      第三件是<strong>读取方式要按数据形状选</strong>。<code>&gt;&gt;</code> 会跳过前导空白、读到下一个空白为止，适合读一个个「词」；要读一整行（可能含空格）就用 <code>std::getline(fs, line)</code>。二者不能混着乱用来跳行，混用时要留意残留的换行符。逐行读的惯用写法是 <code>while (std::getline(inFile, line))</code>——它同时完成了「读一行」和「判断是否还有输入」。
    </p>
    <p>
      第四件是<strong>生命周期</strong>。文件流是 RAII 类型（上一课刚讲过）：打开在构造时，关闭在析构时，所以正常路径上根本不用写 <code>close()</code>。当然你也可以显式调用 <code>close()</code> 提前关闭并检查关闭是否成功，但默认交给析构就够了。
    </p>
    <p>
      第五件是<strong>二进制与非文本文件</strong>。读写图片、音频这类数据要用 <code>binary</code> 模式，配合成员函数 <code>read</code> / <code>write</code>，并把数据指针用 <code>reinterpret_cast&lt;const char*&gt;</code> 转成字节视图。
    </p>
    <p>
      到这里文件读写已经很顺了，但还有一类需求它不覆盖：<strong>我其实不需要文件，只想在内存里拼字符串或解析字符串</strong>。为此标准库把同一套流抽象搬进了内存，这就是<strong>字符串流</strong>：
    </p>
    <ol class="lesson-steps">
      <li><code>std::istringstream</code> 从字符串读，用来解析文本，替代 <code>sscanf</code>：把字符串倒进去，然后像用 <code>std::cin</code> 一样逐个提取。<code>std::istringstream iss(data); int num; double pi; std::string word; iss &gt;&gt; num &gt;&gt; pi &gt;&gt; word;</code> 就把 <code>"42 3.14 Hello"</code> 拆成了三份。</li>
      <li><code>std::ostringstream</code> 向字符串写，用来格式化，替代 <code>sprintf</code>：<code>&lt;&lt;</code> 进去的东西最后用 <code>.str()</code> 取出来。它比 <code>std::to_string</code> 更灵活，因为能控制格式、能拼接多种类型。</li>
      <li><code>std::stringstream</code> 同时支持读写，适合需要来回改的场景。</li>
    </ol>
    <p>
      最后两个边界值得记住。其一，文件流对象<strong>不能拷贝</strong>（拷贝构造和拷贝赋值都被删除了），但<strong>可以移动</strong>——用 <code>std::move</code> 把所有权转移给另一个流对象，这是第 21 课那套语义在标准库里的又一次落地。其二，C++17 起文件流的 <code>open</code> 可以接受 <code>std::filesystem::path</code>（来自 <code>&lt;filesystem&gt;</code>），对 Unicode 文件名的支持更好。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>看三段代码的对应关系：<code>ofstream</code> 用 <code>&lt;&lt;</code> 写两行、<code>ifstream</code> 配 <code>getline</code> 逐行读回来，最后 <code>istringstream</code> 把 <code>"42 3.14 Hello"</code> 一次拆成 int、double、string 三种类型。</figcaption>
      <CPP24FileIO />
    </figure>

    <h2>总结</h2>
    <p>
      文件 I/O 的核心不是那几个类，而是<strong>流</strong>这个统一抽象：屏幕、键盘、文件、内存字符串，统统是流，所以同一套 <code>&lt;&lt;</code> / <code>&gt;&gt;</code> 能通用的地方就通用，类型安全也就一并带上了。要用好它，只需盯住三件事——打开模式选对（追加别用成覆盖）、流状态随时查、生命周期交给 RAII。
    </p>
    <div class="lesson-term">
      <span class="term-name">「流状态位」</span>指每个流对象内部维护的一组失败标志：<code>goodbit</code> 一切正常、<code>eofbit</code> 到达文件尾、<code>failbit</code> 格式化操作失败（如期望数字却读到字母）、<code>badbit</code> 严重错误（如磁盘故障）。它可以用 <code>good()</code> / <code>eof()</code> / <code>fail()</code> / <code>bad()</code> 查询，流对象也能隐式转成 <code>bool</code>。边界：<code>&gt;&gt;</code> 失败时<strong>不抛异常</strong>，只置位且目标变量保持原值，容易读到脏数据；而 <code>failbit</code> 一旦置位，在显式 <code>clear()</code> 之前，该流上的后续操作都会直接失败。
    </div>
  </LessonArticle>
</template>
