const o=`<script setup lang="ts">
import WB05LinearMemory from './WB05LinearMemory.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 JS 里改了一个数组的第 3 个元素，然后把它交给 Wasm 的函数处理。处理完你发现，Wasm 读到的正是你刚改过的值；你又回头在 JS 里改一次，Wasm 立刻也能看到。两个人、两份代码，<strong>凭什么共享同一份数据，而且不需要来回拷贝？</strong>
    </div>

    <h2>序列化拷贝开销</h2>
    <p>
      你想让宿主和模块交换可变数据——图片像素、字符串字节、数组。最自然的做法是每次调用都序列化一份传过去，但成本有三：大数组每调用一次就拷贝一遍，来回两趟；拷贝出的副本在两边各改各的，最后对不上；没有一个「可写的地址」概念，模块没法原地修改数据。
    </p>
    <p>
      于是问题变成：<strong>能不能给模块一块双方都能直接读写、且不用拷贝的存储？</strong>
    </p>

    <h2>线性内存寻址</h2>
    <p>
      最朴素的做法：让模块持有一块自己的连续字节数组，JS 通过地址去读写它。这块内存叫<strong>线性内存</strong>，从地址 0 开始按字节连续编号。<code>store8(addr, val)</code> 在地址 <code>addr</code> 写一个字节，<code>load8(addr)</code> 从 <code>addr</code> 读一个字节。
    </p>
    <p>
      这个方案做对了一件事：<strong>模块有了一块可以用整数地址直接访问的连续存储</strong>，数据不再需要拆成一个个参数传进传出。
    </p>

    <h2>字节序与越界</h2>
    <ul>
      <li>只有地址还不够——JS 怎么找到这块内存？它不能凭空访问模块内部。</li>
      <li>一个字节装不下一个 <code>i32</code>，多字节的值该怎么摆、按什么顺序。</li>
      <li>读写越界（比如写到第 65536 个字节之外）会怎样，会不会把宿主搞崩？</li>
      <li>数据变多、内存不够用了，能长大吗？</li>
    </ul>

    <h2>导出内存与视图</h2>
    <p>
      不推翻「字节数组」，而是把这块内存和 JS 连起来。第一层，解决「JS 怎么访问」。模块用 <code>(memory (export "memory") 1)</code> 声明一块内存并把它<strong>导出</strong>；JS 实例化后拿到 <code>instance.exports.memory</code>，它的 <code>buffer</code> 属性是一个 ArrayBuffer。用 <code>new Uint8Array(memory.buffer)</code> 建一个视图，就能像看普通数组一样逐个看字节。这一步是共享的关键：<strong>JS 和 Wasm 看的是同一个 buffer，不是副本</strong>，所以 JS 写完 Wasm 立刻能读到。
    </p>
    <p>
      第二层，解决「多大」。内存按<strong>页</strong>分配，1 页 = 64KiB = 65536 字节，<code>(memory 1)</code> 就是 1 页。这也解释了为什么地址范围是 0 到 65535。
    </p>
    <p>
      第三层，解决「多个字节怎么放」。load/store 有不同宽度：<code>i32.store8</code> 只写 1 个字节，不带宽度后缀的 <code>i32.store</code> 写 4 个字节，<code>i32.load</code> 读 4 个字节。同一段字节用不同宽度去读会得到不同的数；所有多字节的值都按<strong>小端序</strong>摆放，低位字节在低地址。
    </p>
    <p>
      第四层，越界。访问当前页数之外的地址会触发 <code>RuntimeError</code>（trap），而不是安静地写坏别处——这正是 Wasm「天然防缓冲区溢出」的来源：越界会当场停下，不会破坏宿主进程。
    </p>
    <p>
      最后补上增长。内存可以按页增长（<code>memory.grow</code>），但要记住：<strong>一旦增长，引擎会换一块新的 ArrayBuffer</strong>，你之前用 <code>new Uint8Array(memory.buffer)</code> 建的那个视图就失效了，必须重新创建——这是最常见的踩坑点。
    </p>
    <div class="lesson-box hint">
      Wasm 侧只能通过 <code>load</code> / <code>store</code> 指令访问线性内存，JS 侧则通过导出的 <code>memory.buffer</code> 摸到同一块存储，两边看到的是同一份数据，不存在「传进去」这个动作。
    </div>

    <h2>点选地址读写验证</h2>
    <figure class="lesson-figure">
      <figcaption>在字节网格里点选地址，或用 <code>store8</code> 写入、<code>load8</code> 读出，亲手验证 JS 与 Wasm 共享的是同一块内存。</figcaption>
      <WB05LinearMemory />
    </figure>

    <h2>内存分页与增长</h2>
    <p>
      线性内存是一块从地址 0 连续编号的字节数组，按页增长（1 页 = 64KiB）。模块内只能经 load/store 访问它，宿主 JS 则通过导出的 <code>memory.buffer</code> 访问<strong>同一块</strong>存储，因此双方共享而非拷贝。越界读写触发 <code>RuntimeError</code>，多字节小端排列，内存一旦增长，旧的 JS 视图就会失效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「线性内存（linear memory）」</span>指 Wasm 模块持有的一块从地址 0 连续编号的字节数组，按页分配与增长（1 页 = 64KiB = 65536 字节）；模块内只能用 load/store 指令访问，宿主 JS 通过导出的 <code>memory.buffer</code> 取得同一块 ArrayBuffer，因此两边共享而非拷贝。边界：越界读写触发 <code>RuntimeError</code>（不破坏宿主进程）；多字节值采用小端序；内存增长后 buffer 被替换，旧的类型化数组视图失效，必须重建。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
