<script setup lang="ts">
import CPP24FileIO from './CPP24FileIO.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用 C 的 <code>fopen</code> / <code>fclose</code> 读写文件，既要记得成对关闭，又得用格式串和类型码对齐 —— 一个不留神就漏关文件或格式对不上。C++ 的流能不能让文件像 <code>cin</code> / <code>cout</code> 一样自然，还能在内存里做同样的读写？
    </div>

    <h2>先朴素做法：fopen、fclose 与格式串</h2>
    <p>
      C 风格的文件操作由一组函数完成：<code>fopen</code> 打开、<code>fread</code>/<code>fwrite</code> 或 <code>fprintf</code> 读写、<code>fclose</code> 关闭。
    </p>
    <ul>
      <li>做对的地方：贴近系统调用，控制精细，性能直接。</li>
      <li>不足：<strong>打开与关闭要人工配对</strong>，中间任何一条提前返回的路径都可能漏掉 <code>fclose</code>；格式化函数使用类型码（<code>%d</code>、<code>%s</code>）描述数据，一旦类型码与实际类型不一致，就是未定义行为，编译器也帮不上忙；读取时还要自己判断文件尾与错误。</li>
    </ul>
    <p>
      问题的核心在于：资源管理靠人记得关、类型安全靠人写对格式串。C++ 的流（stream）抽象，正是把这两件事分别交给析构函数和类型系统。
    </p>

    <h2>三个文件流类与打开模式</h2>
    <p>
      头文件 <code>&lt;fstream&gt;</code> 提供三个类，它们都是 RAII 类型，构造时打开、析构时自动关闭。
    </p>
    <ul>
      <li><code>std::ifstream</code>：输入文件流，用于读取。</li>
      <li><code>std::ofstream</code>：输出文件流，用于写入。</li>
      <li><code>std::fstream</code>：同时支持读写。</li>
    </ul>
    <p>
      打开模式用 <code>std::ios::</code> 下的标志组合指定，主要几种：
    </p>
    <ul>
      <li><code>in</code> 读取、<code>out</code> 写入、<code>app</code> 追加、<code>ate</code> 打开后定位到末尾、<code>trunc</code> 截断、<code>binary</code> 二进制。</li>
      <li><code>ofstream</code> 默认隐含 <code>out | trunc</code>，因此<strong>打开即清空</strong>；要追加必须显式加 <code>app</code>。</li>
      <li>模式可在构造时传入，也可事后用 <code>open</code> 打开；但先 <code>close</code> 再以新模式 <code>open</code> 是更清晰的写法。</li>
    </ul>

    <h2>读取、写入与状态检查</h2>
    <p>
      流的读写和 <code>cin</code> / <code>cout</code> 完全一致：<code>&lt;&lt;</code> 写入，<code>&gt;&gt;</code> 做格式化读取，<code>std::getline</code> 读取整行。<code>&gt;&gt;</code> 会<strong>跳过前导空白</strong>并按空白分界，需要读含空格的一行时必须用 <code>getline</code>。
    </p>
    <p>
      与读写同等重要的是<strong>状态检查</strong>。每个流都维护一组状态位：
    </p>
    <ul>
      <li><code>good()</code>：一切正常；<code>eof()</code>：到达文件尾；<code>fail()</code>：格式化读取失败（如期望数字却遇到字母），或打开失败；<code>bad()</code>：严重错误（如磁盘故障）。</li>
      <li>流对象可隐式转换为 <code>bool</code> —— 为真表示没有失败，因此常写 <code>if (!in.is_open())</code> 或 <code>if (in)</code> 来判断。</li>
      <li>进入失败状态后，后续读写会「短路」，需调用 <code>clear()</code> 复位状态位才能继续；<code>while (std::getline(in, line))</code> 正是靠这个返回值在读到 EOF 时结束循环。</li>
    </ul>

    <h2>字符串流：解析与格式化</h2>
    <p>
      <code>&lt;sstream&gt;</code> 里的字符串流把流抽象用到了内存字符串上，能替代 C 的格式化 I/O 且类型安全。
    </p>
    <ul>
      <li><code>std::istringstream</code>：从字符串读取，用于<strong>解析</strong>，可替代 <code>sscanf</code>：把整句导进去，再像 <code>cin</code> 一样依次提取。</li>
      <li><code>std::ostringstream</code>：向字符串写入，用于<strong>格式化拼接</strong>，可替代 <code>sprintf</code>；它比 <code>std::to_string</code> 更灵活，因为能自由混合不同类型、设置进制与精度，<code>oss.str()</code> 取回结果。</li>
      <li><code>std::stringstream</code>：兼具读写能力。</li>
    </ul>
    <p>
      一个易错点：在循环里反复用同一个字符串流解析多行时，必须每轮 <code>clear()</code> 复位并重新设置读取位置（<code>seekg(0)</code>），否则上一轮的 EOF / fail 状态会残留，后续解析直接失效。
    </p>

    <h2>二进制读写与文件流的移动</h2>
    <p>
      处理图片、结构体等非文本数据时，需要以 <code>binary</code> 模式打开，并用成员函数 <code>read</code> / <code>write</code> 按字节搬运。
    </p>
    <ul>
      <li>它们接收 <code>char*</code> 与字节数，因此要把数据地址 <code>reinterpret_cast</code> 成 <code>char*</code>；<code>gcount()</code> 返回上一次 <code>read</code> 实际读取的字节数。</li>
      <li>二进制模式避免了文本模式下对换行等字符的隐式转换，能原样保存与还原字节。</li>
    </ul>
    <p>
      此外，文件流<strong>不可拷贝、但可移动</strong>（C++11 起）：这意味着可以把它作为函数返回值、放进容器或转移给另一个对象；移动之后源对象不再拥有文件，析构时也不会重复关闭 —— 这与智能指针的所有权转移思路是一致的。
    </p>

    <h2>看一遍文件与字符串流的读写</h2>
    <figure class="lesson-figure">
      <figcaption>示例演示用 ofstream 写文件、用 ifstream 配合 std::getline 逐行读取，以及用 istringstream 把一行文本解析成 int、double、string；可对照输出验证流模式的默认行为与「流式解析」的写法。</figcaption>
      <CPP24FileIO />
    </figure>

    <h2>用同一套流抽象处理文件与内存</h2>
    <p>
      C++ 的 I/O 库把「从哪里读、往哪里写」抽象成流，文件、字符串、标准输入输出只是流的三种来源，读写语法完全一致。资源释放交给析构函数，类型转换交给运算符重载，状态检查交给状态位 —— 于是原本要人工守护的三件事都被语言接了过去。迁移到文件与字符串流时，你几乎只需换一个流对象，其余写法不变。
    </p>
    <div class="lesson-term">
      <span class="term-name">「流」</span>是 C++ I/O 库对「有序数据来源或去向」的抽象，文件、字符串、标准输入输出都是它的实例。<span class="term-name">「打开模式」</span>决定流的读写方式与是否截断、追加或按二进制处理。<span class="term-name">「状态位」</span>记录流的健康状况，由 <code>good</code> / <code>eof</code> / <code>fail</code> / <code>bad</code> 查询，失败后需 <code>clear()</code> 复位。
    </div>
  </LessonArticle>
</template>
