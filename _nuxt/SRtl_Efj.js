const e=`<script setup lang="ts">
import CPP16StlSequenceContainers from './CPP16StlSequenceContainers.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>要存一列会不断追加的数据，用内置数组就得自己判断容量、<code>malloc</code>、<code>realloc</code> 搬家——这些重复劳动每次都要重写一遍。有没有一个容器既省心，又保留随机访问？
    </div>

    <h2>朴素做法：内置数组加手写扩容</h2>
    <p>
      起点可以是一个内置数组配一个 <code>size</code> 变量。它「做对了」最关键的一点：内存<strong>连续</strong>，所以 <code>a[i]</code> 是常数时间的随机访问，对缓存也友好。
    </p>
    <p>
      但它的容量是写死的。要装得更多，只能手动 <code>malloc</code> 一块更大的内存、把旧数据逐个搬过去、再 <code>free</code> 旧块；还得额外维护「用了多少、还能装多少」两个计数。这套扩张逻辑一旦散落在多处，漏一次就越界或泄漏。
    </p>

    <h2>vector：会自动扩容的动态数组</h2>
    <p>
      <code>std::vector</code> 把「容量管理」封进了容器内部。它依然是一段连续内存，随机访问 O(1)；<code>push_back</code> 追加在尾部，<strong>均摊</strong> O(1)。关键在于它扩容的时机与代价：当 <code>size()</code> 撞上 <code>capacity()</code>，它会申请一块更大的内存（常见按倍数增长），把旧元素搬过去再释放旧块。
    </p>
    <p>
      因为每次触发扩容是 O(n)，但扩容次数被倍数增长摊薄，总体仍是均摊 O(1)。可以用 <code>reserve(n)</code> 提前声明预计规模，避免反复搬家；而 <code>capacity()</code> 与 <code>size()</code> 则是理解这一机制的两个读数。
    </p>

    <h2>deque、list、array：另外三种结构</h2>
    <p>
      不同需求对应不同底层结构：
    </p>
    <ul>
      <li><code>std::deque</code>（双端队列）：用分页（多段连续）的方式存储，<code>push_front</code> 与 <code>push_back</code> 都是 O(1)，也支持随机访问，只是常数略大于 <code>vector</code>；中间插入仍是 O(n)。</li>
      <li><code>std::list</code>（双向链表）：节点分散、靠两个指针相连，任意位置插入删除都是 O(1)，但不支持随机访问，每个元素额外带两个指针，缓存不友好。</li>
      <li><code>std::array</code>（C++11）：封装内置数组，大小编译期固定、无堆分配、零额外开销，同时补上 <code>size()</code>、<code>at()</code> 边界检查与迭代器。</li>
    </ul>

    <h2>emplace_back 与 push_back</h2>
    <p>
      两者都往尾部加元素，差别在「怎么构造」：<code>push_back(Item(...))</code> 先在容器外构造一个临时对象，再把它移动/拷贝进容器；<code>emplace_back("梨", 2)</code> 把参数完美转发到容器内，<strong>就地构造</strong>元素，省掉一次临时对象的构造与搬家。对构造成本高的类型，这个差别实打实。
    </p>

    <h2>迭代器失效：换容器最先要摸清的规则</h2>
    <p>
      容器内部一搬家，先前拿到的迭代器、指针、引用就可能指向被释放的旧内存，再解引用就是未定义行为。
    </p>
    <ul>
      <li><code>vector</code>：一旦触发扩容，<strong>所有</strong>迭代器/指针/引用一律失效；即便没扩容，中间插入也可能让插入点之后的失效。</li>
      <li><code>deque</code>：首尾插入通常只让部分失效，规则比 <code>vector</code> 复杂，稳妥做法是别在修改后继续用旧迭代器。</li>
      <li><code>list</code>：插入不影响其它元素的迭代器；删除只让「指向被删元素」的那个失效。</li>
    </ul>
    <p>
      记住一条经验：<strong>改完容器就重新取 begin()/end()</strong>，不要跨修改点复用迭代器。
    </p>

    <h2>看一遍四种顺序容器</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中 <code>vector</code> 的中间插入、<code>deque</code> 的双端插入与 <code>list</code> 的头部插入，观察不同结构在不同位置增删时的代价差异。</figcaption>
      <CPP16StlSequenceContainers />
    </figure>

    <h2>按访问方式选结构</h2>
    <p>
      顺序容器的选择其实是在回答三个问题：<strong>要不要随机访问、增删主要发生在哪一端、在不在意内存局部性</strong>。默认选 <code>vector</code>——连续内存、随机访问、缓存友好；头部频繁增删又需要随机访问就换 <code>deque</code>；中间频繁插删且不需要随机访问才轮到 <code>list</code>；大小编译期固定就上 <code>array</code>。选对了容器，往往比事后优化算法更省力。
    </p>
    <div class="lesson-term">
      <span class="term-name">「顺序容器」</span>按位置而非键存储元素，包括 <code>vector</code>、<code>deque</code>、<code>list</code>、<code>array</code>；<span class="term-name">「capacity」</span>是已分配内存能容纳的元素数，<span class="term-name">「size」</span>是实际元素数，二者在 <code>vector</code> 这类容器上并不相等。<span class="term-name">「均摊复杂度」</span>指单次可能很贵、但多次平均下来是常数；<span class="term-name">「迭代器失效」</span>指容器内部变动后旧迭代器不再可用。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
