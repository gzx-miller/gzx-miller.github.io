const o=`<script setup lang="ts">
import CPP06ArraysStrings from './CPP06ArraysStrings.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个只做「复制字符串」的小函数，源码里就是一句 <code>strcpy</code>，平时运行得好好的；可某次输入变长之后，程序悄悄改掉了隔壁某个变量，甚至直接崩溃——写一段文字，怎么会写到别的变量头上？
    </div>

    <h2>字符串与数组同源</h2>
    <p>
      你要处理的是一串文本：用户输入的名字、一段报文、一组编号。在 C 的世界里根本没有独立的「字符串类型」，字符串和数组是同一件事——<strong>一块连续内存</strong>。于是你必须先回答：多长？哪里结束？
    </p>
    <p>
      把文本当成 <code>char</code> 数组、末尾放一个 <code>\\0</code> 做结束标记，是最早的答案。但它把两三个成本悄悄转嫁给了你：
    </p>
    <ul>
      <li>数组<strong>不记录自己多大</strong>。数组名一旦传进函数就退化成指针，大小信息当场丢失，你只能另传一个长度参数，或者指望调用方别越界。</li>
      <li>越界<strong>不报错</strong>。写 <code>arr[10]</code> 编译照过，运行时悄悄读坏或写坏相邻内存，这就是未定义行为。</li>
      <li><code>strcpy</code> / <code>strcat</code> <strong>不检查目标缓冲区多大</strong>。目标 10 字节、源 12 字节，多出来的那两个字节就覆盖到相邻变量上了。</li>
    </ul>
    <p>
      所以真正要回答的是：能不能让「一块字符内存」和「它有多长」绑在同一个东西里，让谁都不会算错？
    </p>

    <h2>裸缓冲区管理</h2>
    <p>
      最朴素但真的能跑的做法：手动开一个足够大的缓冲区，用 <code>\\0</code> 结尾，用 <code>strlen</code> 数长度。
    </p>
    <p>
      <code>char buf[64];</code><br />
      <code>strcpy(buf, "Hello");</code><br />
      <code>std::cout &lt;&lt; buf &lt;&lt; std::endl;</code>
    </p>
    <p>
      这个方案做对了一件很扎实的事：它立起了<strong>「字符串 = 一串字符 + 一个结束标记」</strong>这个模型。<code>strlen</code> 只要一路扫到 <code>\\0</code> 就知道长度，输出函数也靠它知道何时停。在没有更好工具的年代，这套约定撑起了无数 C 程序。
    </p>

    <h2>越界写入后果</h2>
    <ul>
      <li><code>char s[5] = "Hello";</code> 里源串是 5 个字符加一个 <code>\\0</code>、共 6 字节，塞进 5 字节数组后 <code>\\0</code> 被挤掉，之后任何按 C 字符串进行的操作都会一路读到数组外。</li>
      <li><code>strcpy(dst, src)</code> 在 <code>strlen(src) + 1 &gt; sizeof(dst)</code> 时照写不误，直接覆盖相邻内存——正是开场那个 bug。</li>
      <li>数组传给函数后退化：<code>void foo(int a[])</code> 等价于 <code>void foo(int* a)</code>，函数里 <code>sizeof(a)</code> 得到的是指针大小，不是数组字节数，依赖它的循环全算错。</li>
      <li>想拼接两段字符串，得自己 <code>strlen</code> 两边、算总长、确认缓冲区够大、再 <code>strcat</code>——每一步都能算错，且错一步就是内存被破坏。</li>
    </ul>

    <h2>缓冲区长度封装</h2>
    <p>
      不推翻「字符 + 结束标记」，而是把「缓冲区」和「长度」封进一个对象里。这就是 <code>std::string</code>：容量不够时它自己扩容，拼接用 <code>+</code>、比较用 <code>==</code>，长度随时 <code>size()</code> 可取。
    </p>
    <p>
      <code>std::string s1 = "Hello";</code><br />
      <code>std::string s2 = "World";</code><br />
      <code>std::string s3 = s1 + ", " + s2 + "!";</code><br />
      <code>std::cout &lt;&lt; s3.size() &lt;&lt; std::endl; // 13</code>
    </p>
    <p>
      长度跟着对象走，再也不用单独传。<code>s3.substr(0, 5)</code> 取出前 5 个字符、<code>s3.find("World")</code> 返回第一次出现的位置，这些都是 <code>std::string</code> 的成员函数。短字符串还有 <strong>SSO（短字符串优化）</strong>：内容足够短时直接存在对象自身缓冲里，连堆分配都省了。
    </p>
    <p>
      接着补「和旧接口打交道的桥」。很多老 API 只认 <code>const char*</code>，于是有了 <code>s3.c_str()</code>——返回一个以 <code>\\0</code> 结尾的 <code>const char*</code>。C++11 起，<code>data()</code> 与 <code>c_str()</code> 都保证返回 <code>\\0</code> 结尾的连续缓冲区。
    </p>
    <p>
      再补数组这一侧：内置数组「定长、易退化」的毛病并没消失，所以现代写法用 <code>std::array</code>（固定大小、带 <code>size()</code>、不退化）和 <code>std::vector</code>（动态大小）来替代。
    </p>
    <p>
      但这里必须补一条边界，否则很容易从一种错觉掉进另一种：<strong><code>std::string</code> 的 <code>operator[]</code> 并不检查越界</strong>，<code>s[100]</code> 同样是未定义行为；要检查就用 <code>.at()</code>，越界会抛异常。换成 <code>std::string</code> 只是把最容易出错的容量管理接管了，界限判断仍要你自己守。另一个坑是字符串字面量：<code>"Hello"</code> 的类型是 <code>const char[N]</code>，能隐式转成 <code>const char*</code>，却<strong>不能转成 <code>char*</code></strong>——<code>char* p = "Hello";</code> 在现代 C++ 里就该报错，因为改写它指向的字面量是未定义行为。
    </p>
    <div class="lesson-box warn">
      <strong>别再用 <code>strcpy</code> / <code>strcat</code>：</strong>它们完全不看目标缓冲区多大。退而求其次可用 <code>strncpy</code> / <code>strncat</code>，但要记得自己补 <code>\\0</code>；更省心的做法是根本不用它们，直接用 <code>std::string</code>。
    </div>

    <h2>数组退化代价</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码逐行核对：内置数组如何用初始化列表补零、数组退化到底丢掉了什么、C 风格字符串靠什么求长度，以及 <code>std::string</code> 的拼接、查找与 <code>c_str()</code>。</figcaption>
      <CPP06ArraysStrings />
    </figure>

    <h2>类型接管长度</h2>
    <p>
      数组与字符串这件事，说到底就是把「容量」和「长度」从人的记忆里搬进类型里。裸数组和 C 风格字符串把这两件事全交给你，<code>std::string</code> 与 <code>std::array</code> / <code>std::vector</code> 把它们接管过去——只要不与 C 风格接口打交道，你几乎不必再手算长度。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数组到指针退化」</span>指在多数表达式语境里，数组名会隐式转换（退化）为指向首元素的指针，转换之后不再携带数组长度；只有 <code>sizeof</code> 与取地址 <code>&amp;</code> 作用于数组名本身时例外。正因如此，<code>int a[10]</code> 传给 <code>void f(int a[])</code> 后，函数内 <code>sizeof(a)</code> 得到的是指针大小而非 40，必须额外传入元素个数。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
