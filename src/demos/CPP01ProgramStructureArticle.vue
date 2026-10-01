<script setup lang="ts">
import CPP01ProgramStructure from './CPP01ProgramStructure.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 <code>main.cpp</code> 里调用了一个写在 <code>helper.cpp</code> 里的函数，两个文件分别编译都不报错，可一旦链接就弹出 <code>undefined reference to 'helper()'</code>——为什么「每个文件都没错」，合起来却生成不了程序？
    </div>

    <h2>提出问题</h2>
    <p>
      你可能一直把「把 C++ 变成可执行文件」当成一步。但 C++ 不是解释型语言，编译器不能拿着源码边读边跑，它必须先把你写的东西翻译成机器能直接执行的二进制。而「翻译」这件事本身装着好几种性质完全不同的工作：有些只是纯文本替换——把 <code>#include &lt;iostream&gt;</code> 指向的头文件整段复制进来、把宏展开；有些需要理解语法——判断 <code>int x = "abc";</code> 是不是错的；还有些只有把好几个文件拼在一起才能判断——这个名字到底有没有人给它写过实现。
    </p>
    <p>
      如果把这些全塞进一个黑盒，出错时你只会收到一句「编译失败」，根本不知道该从哪一步查起。不拆流程，你要承担的隐藏成本很具体：报错信息全混在一起，语法错误和「符号找不到」糊在同一段输出里，只能靠经验猜；改一个头文件，整个项目可能要整体重编，等到怀疑人生；想单独验证一个函数，也得先把整个程序编译完。
    </p>
    <p>
      所以问题落到一句话上：<strong>从 <code>.cpp</code> 到可执行文件，中间到底发生了什么，我该在哪一步、用什么手段去查错？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法：把整件事当成一步走，<code>g++ main.cpp -o main</code>，源码进去、程序出来。这个方案确实做对了一件事：<strong>它给了你一个真的能跑的入口</strong>，小到几十行的练习程序，一条命令就够了。
    </p>
    <p>
      但它把四件性质不同的事打包成了一键，代价是出了问题你没法把责任定位到具体的某一步。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>把 <code>#include &lt;iostream&gt;</code> 误拼成 <code>&lt;iosteam&gt;</code>，报的是「找不到头文件」；把 <code>std::cout</code> 写成 <code>std::coutt</code>，报的是「未声明的标识符」——这两个错误发生在完全不同的阶段，却被糊在同一条命令的输出里。</li>
      <li>你把函数定义挪进 <code>helper.cpp</code>，只跑 <code>g++ main.cpp -o main</code>，会直接报 <code>undefined reference to 'helper()'</code>——因为这条命令根本没把 <code>helper.cpp</code> 交给编译器，而报错信息不会告诉你「你少给了一个文件」。</li>
      <li>两个 <code>.cpp</code> 里都定义了同一个函数，前面阶段的编译全都是通过的，只在最后一步才报「重复定义」，让人以为是写错了语法。</li>
      <li>你只是想看一眼宏展开后的样子，却没有办法「只做这一步、停下来」，只能整体编译再想办法翻找。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「一步编译」，而是把它拆成四个阶段：每一阶段只做一件事，而且各自可以单独停下来检查。拆开之后，报错会自然落到某一阶段上，你也就知道该看哪一类信息。
    </p>
    <ol class="lesson-steps">
      <li><strong>预处理</strong>：处理所有以 <code>#</code> 开头的指令——把 <code>#include</code> 指向的头文件内容原地展开进来、替换宏。产物仍然是纯文本。<code>g++ -E main.cpp -o main.i</code> 能让你亲眼看到展开后多出来的几万行。</li>
      <li><strong>编译</strong>：把预处理后的 C++ 文本翻译成汇编代码，这一步做真正的语法检查和类型检查，<code>int x = "abc";</code> 就是在这里被拦下的。用 <code>g++ -S</code> 得到汇编文件。</li>
      <li><strong>汇编</strong>：把汇编翻译成机器码，生成目标文件 <code>.o</code>（Windows 上是 <code>.obj</code>）。这一步只翻译，不做跨文件的事，所以单个目标文件里可以留着「我引用了某个还没见过的函数」这样的空位。用 <code>g++ -c</code> 可以停在这一步。</li>
      <li><strong>链接</strong>：把若干个目标文件和库文件拼在一起，给每一个空位找到真正的定义，生成可执行文件，例如 <code>g++ main.o helper.o -o main</code>。</li>
    </ol>
    <p>
      拿着这四步回头看开场就通了：每个 <code>.cpp</code> 单独编译只走前三个阶段，此时「<code>helper</code> 到底在哪」这个问题根本还没被提出来，所以单独编译永远不会报这个错；只有走到第四步链接，链接器才去凑齐所有符号，发现没人定义 <code>helper</code>，于是<code>undefined reference</code>。同理，<strong>重复定义</strong>也是在链接阶段才暴露的——前三个阶段各自只看自己的文件，看不见别人。
    </p>
    <p>
      顺着这条线，还有几个必须记住的边界。其一，<strong>头文件里通常只放声明、<code>.cpp</code> 里放实现</strong>，因为 <code>#include</code> 本质是文本替换而不是「导入模块」，同一个头文件被两个源文件包含就会把声明抄两遍，所以要用包含卫士或 <code>#pragma once</code> 挡住重复包含。其二，<code>main</code> 是程序的入口——链接器默认要找 <code>main</code> 的地址作为程序起点，没有它就不能生成可执行文件。
    </p>
    <div class="lesson-box warn">
      <strong>先分清错误属于哪一类：</strong>编译错误（语法错误、类型错误）出现在第二阶段，说明你某个文件本身写错了；链接错误（<code>undefined reference</code> 未定义引用、<code>multiple definition</code> 重复定义）出现在第四阶段，说明文件之间对不上——要么少给了一个目标文件，要么同一个符号被定义了两次。看到报错先判断它属于哪一类，能省掉一半排查时间。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换「程序结构 / 编译流程 / 代码示例」三个页签，对照程序的每个组成部分和四个编译阶段分别对应哪条 <code>g++</code> 命令、会产出什么文件。</figcaption>
      <CPP01ProgramStructure />
    </figure>

    <h2>总结</h2>
    <p>
      从源码到可执行文件是一条<strong>预处理 → 编译 → 汇编 → 链接</strong>的流水线。单独编译一个文件只走前三步，所以它查不出「符号缺失」；只有链接这一步才把各个文件拼在一起。下次看到报错，先问一句「它卡在哪一步」，答案往往就在问题本身里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「分离编译」</span>指把程序拆成多个 <code>.cpp</code> 各自独立编译成目标文件、最后统一链接的机制。每个 <code>.cpp</code> 的编译互不依赖，所以改一个文件只需重编它自己，能缩短编译时间、便于多人协作；代价是跨文件的符号问题只能推迟到链接阶段才暴露。记住：<strong>编译错误 ≠ 链接错误</strong>，前者是语法与类型问题，后者是未定义引用或重复定义。
    </div>
  </LessonArticle>
</template>
