const e=`<script setup lang="ts">
import CPP07PointersReferences from './CPP07PointersReferences.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>手里有一个指向数组首元素的指针 <code>q</code>，你写下 <code>*(q + 1)</code>，本以为是把地址往后挪一个字节，结果它直接读到了第二个元素——这个「加一」，加的到底是什么？
    </div>

    <h2>按值传参限制</h2>
    <p>
      你经常需要让函数去操作调用方的数据。可 C++ 默认<strong>按值传参</strong>，函数拿到的只是一份副本，在函数里改副本，原件纹丝不动。于是「怎么让函数真正操作到那个对象」成了必须回答的问题。
    </p>
    <p>
      直觉上最省事的答案是「把对象复制一份给函数」。但这份「省事」背后压着几笔必须由人承担的账：
    </p>
    <ul>
      <li><strong>复制本身有代价</strong>：对象越大，每次调用拷贝一次，开销随规模增长。</li>
      <li><strong>表达不了「没有」</strong>：有些参数本来就可能不存在，纯副本无法如实描述这种「可选」。</li>
      <li><strong>改不到「指针本身」</strong>：有时函数要换掉调用方手里那个地址，副本做不到。</li>
    </ul>
    <p>
      所以真正要回答的是：怎样用「指向某对象」或「某对象的别名」来表达，既不复制，又能分清「必然存在」与「可能为空 / 可重定向」？
    </p>

    <h2>记录对象地址</h2>
    <p>
      最直接的做法：记下对象的位置，也就是地址。
    </p>
    <p>
      <code>int x = 42;</code><br />
      <code>int* p = &amp;x;</code><br />
      <code>*p = 100;</code>
    </p>
    <p>
      <code>p</code> 里存的是 <code>x</code> 的地址，<code>*p</code> 解引用就拿到 <code>x</code> 本身，对它赋值等于直接改 <code>x</code>。函数只要改成收 <code>int* p</code>、调用时传 <code>&amp;x</code>，函数里 <code>*p = 100</code> 就能改到原对象。
    </p>
    <p>
      这个方案做对了一件事：它把<strong>「对象本身」和「对象的位置」分开了</strong>。传一个地址很便宜（一个指针大小），解引用之后又能直达原件，「复制太贵」和「改不到原件」两个问题一起解掉。
    </p>

    <h2>空指针与野指针</h2>
    <ul>
      <li>指针可以指向「什么都没有」：<code>int* p;</code> 未初始化时存的是随机值，解引用就是未定义行为。</li>
      <li>用法不顺手：每次访问都得写 <code>*p</code>，想让「像普通变量一样直接用」就做不到。</li>
      <li>算术不直观：<code>p + 1</code> 加的不是一个字节，凭直觉就会算错。</li>
      <li>类型上看不出「一定非空」：函数签名 <code>void f(int* p)</code> 根本没说明 <code>p</code> 能不能是 <code>nullptr</code>。</li>
    </ul>

    <h2>引用别名机制</h2>
    <p>
      先补「别名」这一层，这就是引用：
    </p>
    <p>
      <code>int y = 5;</code><br />
      <code>int&amp; r = y;</code><br />
      <code>r = 10; // y 也变成 10</code>
    </p>
    <p>
      <code>r</code> 是 <code>y</code> 的别名，用起来和普通变量一模一样，不用写 <code>*</code>。引用必须<strong>定义时初始化</strong>，之后不能改绑——所以不存在「空引用」。于是分工清晰了：需要一个必然存在的别名、且想当变量用时，用引用（函数参数首选 <code>Type&amp;</code>）；需要表达「可能为空」或「函数要改指针本身」时，才用指针。
    </p>
    <p>
      接着把指针算术说清楚。<code>int arr[] = {10, 20, 30}; int* q = arr;</code>（等价于 <code>&amp;arr[0]</code>）。这里的 <code>q + n</code> 不是地址加 <code>n</code> 个字节，而是加 <code>n * sizeof(int)</code> 个字节，所以 <code>*(q + 1)</code> 得的是 20。这也正是 <code>arr[i]</code> 等价于 <code>*(arr + i)</code> 的原因。
    </p>
    <p>
      再补几条必须记住的边界。第一，比较：<code>==</code> / <code>!=</code> 对指向不同对象的指针是良定义的（通常为假）；但 <code>&lt;</code>、<code>&lt;=</code> 这类关系比较，只有两个指针指向同一数组的元素时才有意义，否则结果是未指定或实现定义的。第二，引用不是独立对象：既然它不单独占存储，就既没有「引用的引用」，也没有「指向引用的指针」——<code>int&amp; *p</code> 是非法语法，想拿 r 所绑定对象的指针要写 <code>int* p = &amp;r;</code>（<code>&amp;r</code> 得到的正是那个对象的地址）。第三，声明别被骗：<code>int* p, q;</code> 里只有 <code>p</code> 是指针，<code>q</code> 是普通的 <code>int</code>，推荐分行声明或写成 <code>int *p, q;</code>。
    </p>
    <p>
      最后把「空」和「const」补上。C++11 的 <code>nullptr</code> 取代了 <code>NULL</code>（后者往往是宏 <code>0</code> 或 <code>(void*)0</code>）：<code>nullptr</code> 能隐式转换成任何指针类型，却不能转成 <code>int</code>，从而消除了 <code>NULL</code> 带来的重载二义性；解引用前记得先判 <code>if (p != nullptr)</code>。const 则分两层：<code>int* const p</code> 是顶层 const，<code>p</code> 自己不能再改指向；<code>const int* p</code> 是底层 const，指向的内容不能改；两者叠加的 <code>const int* const p</code> 就都锁死了。
    </p>
    <div class="lesson-box warn">
      <strong>「引用不能重新绑定」这句要分清：</strong><code>r = 10</code> 并不是让 <code>r</code> 改去指向 10，而是把 10 赋给 <code>r</code> 所绑定的那个对象。想「改指向」只能用指针。
    </div>

    <h2>解引用指针算术</h2>
    <figure class="lesson-figure">
      <figcaption>对照代码看解引用与指针算术的实际结果，再把下方对照表里指针与引用的差异一项项验过去。</figcaption>
      <CPP07PointersReferences />
    </figure>

    <h2>地址与别名分工</h2>
    <p>
      指针和引用是同一件事的两副面孔：都在描述「别处的某个对象」。指针是「可以换、可以为空的地址」，引用是「装成变量、不能改绑的别名」。要改原件又不复制，用引用；要表达可选或重定向，用指针；而 <code>p + n</code>、<code>p-&gt;m</code>、const 的先后顺序，都是围绕这个地址做文章。
    </p>
    <div class="lesson-term">
      <span class="term-name">「解引用」</span>指对指针使用一元 <code>*</code> 运算符，取得它所指向的对象本身，结果是一个左值，可以直接被赋值（<code>*p = 100</code> 即修改目标对象）。边界：只能对指向有效对象的指针解引用，对 <code>nullptr</code>、未初始化指针或已释放内存的指针解引用都是未定义行为；<code>p-&gt;member</code> 只是 <code>(*p).member</code> 的简写。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
