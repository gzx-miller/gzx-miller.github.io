const o=`<script setup lang="ts">
import CPP06ArraysStrings from './CPP06ArraysStrings.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写了一个参数是 <code>int arr[]</code> 的函数想遍历数组，可函数里 <code>sizeof(arr)</code> 得到的是指针大小而不是数组大小——同样一个 <code>arr</code>，为什么在函数外面「是数组」，一进函数就「变成了指针」？
    </div>

    <h2>先朴素做法：用内置数组把一串数装起来</h2>
    <p>
      要存五个学员的成绩，最直接的做法是声明一个内置数组：<code>int scores[5] = {90, 85, 60};</code>。它做对了什么？用一段连续内存存下<strong>同类型</strong>的一组元素，并用下标 <code>scores[0]</code>、<code>scores[1]</code> 直接访问——元素在内存里紧挨着排布，靠「起始地址 + 下标 × 元素大小」就能定位任意一个。
    </p>
    <p>
      但内置数组也有它「朴素」的代价。第一，<strong>它不记录自己的长度</strong>：<code>scores</code> 这个名字只知道首地址，长度 5 是你心里记着、编译器不会替你保存。第二，越界访问不报错——<code>scores[10] = 5;</code> 语法合法，却写到数组之外，属于未定义行为。第三，一旦把它交给函数，长度信息就彻底丢失了，这正是开场那个现象的来源。
    </p>

    <h2>数组退化：为什么长度会「消失」</h2>
    <p>
      在多数表达式里，数组名会被<strong>隐式转换成指向其首元素的指针</strong>，这个转换叫<strong>数组退化（decay）</strong>。于是 <code>void foo(int a[])</code> 在编译器眼里和 <code>void foo(int* a)</code> 完全等价——形参 <code>a</code> 只是一个 <code>int*</code>，而 <code>sizeof(a)</code> 得到的自然是指针大小，不是数组总大小。
    </p>
    <p>
      这个机制带来一个必须遵守的约定：<strong>把数组传给函数时，长度要额外用一个参数传过去</strong>，比如 <code>void foo(int a[], int n)</code>，或让调用方与函数约定一个哨兵值。它初看像是设计缺陷，其实是数组退化的必然结果——函数只知道「从哪里开始」，不知道「到哪里结束」。换句话说，<strong>数组做了对的事（连续存储、随机访问），却在跨函数边界时丢掉了元信息</strong>，需要由调用约定补上。
    </p>

    <h2>C 风格字符串与 '\\0' 终止符</h2>
    <p>
      字符串在 C 里的朴素表示，就是「字符的数组」。为了让长度信息不再丢失，C 风格字符串采用了<strong>哨兵</strong>方案：用一个特殊字符表示结束，约定字符串以 <code>'\\0'</code>（空字符，编码值 0）结尾。于是 <code>char greeting[] = "Hello";</code> 实际占 6 个字节——5 个可见字符加末尾一个 <code>'\\0'</code>。<code>strlen(greeting)</code> 就是<strong>从头数到 <code>'\\0'</code> 之前的字符个数</strong>，得到 5。
    </p>
    <p>
      这种做法用「多存一个字节」换来了「长度自描述」，函数不必再额外接收长度参数。但代价也很实在：一切依赖 <code>'\\0'</code> 的库函数都会<strong>一直往后扫</strong>，如果忘了写终止符，或字符串在中间被截断，<code>strlen</code>、字符串拷贝就会越过真实边界、读到不属于自己的内存。这类问题在 C 代码里长期是主要的安全隐患来源。
    </p>

    <h2>std::string：把「字符串」当成一个自管理对象</h2>
    <p>
      与其让使用方处处操心 <code>'\\0'</code> 与边界，C++ 选择把字符串封装成一个类：<code>std::string</code>。它做对了什么？<strong>自己记住字符个数、自己管理内存、自己维护终止符</strong>，使用方拿到的就是一个「完整的字符串对象」，长度随时可查（<code>s.size()</code>），不用再传额外参数。常用的操作也一并内聚进来：
    </p>
    <ul>
      <li>拼接：<code>s1 + ", " + s2 + "!"</code>，用运算符表达连接，比手工拼 C 字符串清爽得多。</li>
      <li>取长度：<code>s.size()</code>，常数时间返回。</li>
      <li>取子串：<code>s.substr(pos, len)</code>。</li>
      <li>查找：<code>s.find("World")</code>，返回首次出现的下标，找不到时返回 <code>npos</code>。</li>
    </ul>
    <p>
      有两种访问方式需要注意区别：<code>s[i]</code>（<code>operator[]</code>）<strong>不检查越界</strong>，追求速度；<code>s.at(i)</code> 会检查越界并抛出异常 <code>std::out_of_range</code>，追求安全。选哪个取决于这段代码对边界的信任程度。
    </p>

    <h2>string 与 char* 互转，以及 std::array、std::vector 的取舍</h2>
    <p>
      现实里 C++ 常要和 C 接口打交道，于是需要互转：
    </p>
    <ul>
      <li><strong>string → const char*</strong>：调用 <code>s.c_str()</code>，得到一个指向内部缓冲区的只读指针。注意这个指针<strong>只在 <code>s</code> 存在且未被改动期间有效</strong>，<code>s</code> 一旦修改或销毁，它就可能悬垂。</li>
      <li><strong>C 风格字符串 → string</strong>：直接用 <code>std::string s = greeting;</code>，类会把 <code>'\\0'</code> 之前的部分拷贝进来。</li>
    </ul>
    <p>
      数组这边，C++ 也给了两个封装。取舍原则是<strong>「长度固定就用 std::array，长度可变就用 std::vector」</strong>：
    </p>
    <ul>
      <li><code>std::array&lt;T, N&gt;</code>：长度是<strong>编译期常量</strong>，元素存在栈或对象内部，没有堆分配开销；代价是长度不可变。</li>
      <li><code>std::vector&lt;T&gt;</code>：长度运行期可变，能 <code>push_back</code>、能扩容、能自动管理堆内存；代价是可能多一次动态分配，且扩容时元素要搬移、已有迭代器会失效。</li>
    </ul>
    <p>
      无论用哪个，都提供了一致的<strong>范围遍历</strong>接口，配合范围 for（<code>for (const auto&amp; x : v)</code>）就能安全地读、<code>for (auto&amp; x : v)</code> 就能安全地改，而不用再操心下标与长度。
    </p>

    <h2>看一遍数组、C 字符串与 string 的对照</h2>
    <figure class="lesson-figure">
      <figcaption>对照这段代码，观察内置数组未初始化元素如何补 0、数组交给函数后退化成指针、C 风格字符串如何靠 '\\0' 让 strlen 数出长度，以及 std::string 的拼接、size、substr、find 与 c_str() 的用法。</figcaption>
      <CPP06ArraysStrings />
    </figure>

    <h2>把「一串数据」交给合适的容器</h2>
    <p>
      数组、C 风格字符串与 <code>std::string</code>，讲的是同一件事在三个抽象层级上的权衡：内置数组最短小、最贴近内存，却不带长度、易越界；C 风格字符串用 <code>'\\0'</code> 哨兵换来自描述长度，却把安全责任留给了使用者；<code>std::string</code> 与 <code>std::array</code>、<code>std::vector</code> 则把长度管理与内存管理收进对象，用一点点封装换来边界安全与统一遍历。写新代码时优先选容器，只在需要对接 C 接口、或追求极致布局控制时才退回裸数组——<strong>「谁来记住长度、谁来管内存」这两个问题一旦交给类型本身，一大类错误就消失了</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数组退化」</span>指数组名在表达式中被隐式转换成指向首元素的指针，从而丢失长度信息；<span class="term-name">「哨兵」</span>指用特殊值（此处是 <code>'\\0'</code>）标记序列结束的做法；<span class="term-name">「npos」</span>是 <code>std::string::find</code> 未找到时的返回值；<span class="term-name">「越界访问」</span>指用超出有效范围的下标读写元素，属于未定义行为。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
