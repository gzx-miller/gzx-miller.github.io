const n=`<script setup lang="ts">
import WB01WhatIsWasm from './WB01WhatIsWasm.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同事丢给你一个 <code>codec.wasm</code>，说「直接调就行，比 JS 快十倍」。你用编辑器打开它——满屏十六进制，没有一行能读的代码，连里面有哪些函数、各要什么参数都看不出来。这段二进制凭什么能被浏览器执行，又凭什么能在没有源码的情况下被安全调用？
    </div>

    <h2>源码依赖成本</h2>
    <p>
      你想把一段计算密集的逻辑交给别人写好的模块去跑。最直接的办法是拿源码，复制进项目。但这条路夹着几件必须由你扛的成本：源码一旦分发就暴露了实现；同一份逻辑要为不同语言各写一遍；源码的体积和启动开销通常也远大于编译后的形式。
    </p>
    <p>
      于是你盼着一种中间形态：它不是任何高级语言的源码，而是一份浏览器能直接读懂、执行的「可移植机器码」，体积小、加载快、和具体 CPU 解耦，还得让宿主在执行前就能确认它规规矩矩。问题落到：<strong>这份中间形态到底长什么样，浏览器凭什么敢执行一段来路不明的字节？</strong>
    </p>

    <h2>模块黑盒调用</h2>
    <p>
      最省事的做法：把它当黑盒。<code>await WebAssembly.instantiate(bytes)</code> 拿到实例，然后照着文档调 <code>instance.exports.add(2, 3)</code>。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>字节码可以被引擎安全地编译执行，调用方根本不需要源码</strong>。你交出的是编译产物而不是实现，这既省下了分发源码的成本，又让跨语言复用成为可能。
    </p>

    <h2>导出接口不透明</h2>
    <ul>
      <li><code>instance.exports</code> 里到底有什么，只能靠 <code>console.log(Object.keys(instance.exports))</code> 猜；签名文档没写，就只能试。</li>
      <li>实例化失败时只抛一句 <code>CompileError</code> 或 <code>LinkError</code>，它不会告诉你究竟是哪几个字节坏了。</li>
      <li>模块声明的导入如果宿主没提供，错误要等到运行时才炸，事前无法自查。</li>
      <li>文件为什么是这个体积、哪些段能省、能不能再小，全无判断依据。</li>
    </ul>

    <h2>魔数与分段结构</h2>
    <p>
      不推翻「黑盒调用」，而是把这只黑盒拆开，一层层看进去。先认得开头那两个东西：<strong>魔数</strong>与<strong>版本号</strong>。
    </p>
    <p>
      前 4 字节 <code>00 61 73 6d</code> 是魔数，它正好是 ASCII 的 <code>\\0asm</code>（一个 NUL 字节，后跟 <code>a</code> <code>s</code> <code>m</code>）；紧接着 4 字节 <code>01 00 00 00</code> 是小端存储的版本号，当前固定为 1。引擎读到这里就知道「这是一份 v1 的 Wasm 模块」，否则直接拒收——<strong>魔数的作用，就是让引擎在解析前先确认身份</strong>。
    </p>
    <ol class="lesson-steps">
      <li>校验：先扫描各段的类型信息，确认指令与签名自洽，非法模块当场抛 <code>CompileError</code>。</li>
      <li>编译：把字节码翻译成宿主机器码。</li>
      <li>实例化：分配内存、绑定导入，产出实例对象。</li>
      <li>调用：经 <code>exports.add</code> 触发编译好的函数。</li>
    </ol>
    <p>
      魔数之后是<strong>段（section）</strong>。每个段以一个 id 字节开头，随后是长度和内容：id=1 是类型段，声明函数签名；id=2 是导入段，声明要外部提供的依赖；id=7 是导出段，把内部函数挂成一个对外名字；id=10 是代码段，存放函数体的指令。你那个 <code>codec.wasm</code> 之所以「读不出函数」，正是因为没按段去读——函数名藏在导出段，签名藏在类型段。
    </p>
    <div class="lesson-box warn">
      <strong>别把段当成随意排列：</strong>每个段的 id 决定用途，多个段还要按规范给定顺序出现，漏掉或错序都会让校验失败；魔数写错哪怕一个字节，整个文件就是垃圾。
    </div>
    <div class="lesson-box hint">
      Wasm 的指令运行在一个<strong>虚拟 ISA</strong> 上，不绑定任何具体 CPU 的寄存器，所以同一份文件能在 x86、ARM、浏览器里跑——这才是「可移植」真正的含义。
    </div>

    <h2>十六进制拆解</h2>
    <figure class="lesson-figure">
      <figcaption>左侧是 <code>add</code> 模块的真实十六进制，右侧把它的每一段拆开标注；页面加载时会真的实例化一次，看到 <code>add(2, 3)</code> 的返回值。</figcaption>
      <WB01WhatIsWasm />
    </figure>

    <h2>可移植二进制格式</h2>
    <p>
      WebAssembly 不是一门语言，而是一份可移植的二进制格式：开头是魔数与版本，后面是按 id 分段的类型、导入、导出与代码。引擎先校验、再编译、再实例化，最后交给你一组可调用的导出函数。你不需要源码，也能安全地执行一份来路不明的字节。
    </p>
    <div class="lesson-term">
      <span class="term-name">「段（section）」</span>指 <code>.wasm</code> 文件中按用途切分的二进制单元，每段以一个 id 字节开头（类型段=1、导入段=2、函数段=3、导出段=7、代码段=10），后跟长度与内容。边界：段可缺省（空模块合法），但顺序与长度必须自洽，否则校验阶段就会失败；函数名与签名分散在导出段、类型段里，所以读二进制要按段读，而不是从头顺序扫。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
