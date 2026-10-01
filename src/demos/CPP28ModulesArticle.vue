<script setup lang="ts">
import CPP28Modules from './CPP28Modules.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>某个头文件里藏着一句参数宏，另一个源文件只是 <code>#include</code> 了它，里面一个重名的变量忽然编译报错——你根本没碰那行代码，它怎么就坏了？
    </div>

    <h2>文本粘贴式复用</h2>
    <p>
      根源在于 C++ 复用代码的方式：<code>#include</code> 不是「引用一个文件」，而是<strong>在预处理阶段把这个文件的全部文本原样粘进来</strong>。粘进来的东西不分你我，于是三笔成本全落到写代码的人身上。
    </p>
    <ul>
      <li><strong>宏会泄漏。</strong><code>#define</code> 一旦展开，就作用于<strong>整个翻译单元</strong>剩下的所有代码，别人的标识符只要重名就会被替换掉。</li>
      <li><strong>包含顺序敏感。</strong>头文件 A 用到了 B 里的类型，就必须先 <code>#include B</code> 再 <code>#include A</code>；顺序错了就报「未定义」，而顺序对不对往往是试出来的。</li>
      <li><strong>重复包含与重复解析。</strong>同一个头文件被多条路径包含，要么靠 include guard 去重，要么重复定义；更要命的是<strong>每个 <code>.cpp</code> 都要把这棵头文件树重新解析一遍</strong>，工程一大，编译时间几乎全耗在这里。</li>
    </ul>
    <p>
      所以问题是：<strong>能不能有一种「导入代码」的方式，只暴露你明确要分享的东西，既不泄漏宏，也不用重复解析？</strong>
    </p>

    <h2>重复包含的防护</h2>
    <p>
      最省事的补丁：给每个头文件套上 <code>#pragma once</code>（或传统的 include guard），保证它在同一个翻译单元里只被包含一次。
    </p>
    <p>
      这个方案做对了一件事：<strong>它解决了「自己重复包含自己」这一类问题</strong>。同一个头文件被两条路径引到，也只会展开一次，重复定义立刻消失；成本也低，加一行就见效。
    </p>

    <h2>宏泄漏与顺序依赖</h2>
    <ul>
      <li><strong>宏照样泄漏。</strong><code>#pragma once</code> 只防重复包含，管不住 <code>#define</code>——它已经展开进整片翻译单元了。</li>
      <li><strong>顺序依赖还在。</strong>该先包含谁、后包含谁的约束一点没变，换个包含顺序仍然可能「未定义」。</li>
      <li><strong>编译还是慢。</strong>去重只保证「同一个文件不被包含两次」，但每个 <code>.cpp</code> 仍要各自解析一遍头文件，跨文件的重复解析没有被消除。</li>
      <li><strong>封装全靠约定。</strong>头文件里写的所有声明一律暴露给使用者，想藏起来的实现细节只能靠「别去用」来约束。</li>
    </ul>

    <h2>模块的导出边界</h2>
    <p>
      不推翻「复用代码」这个目标，而是把「文本粘贴」换成一种<strong>有边界、有导出声明</strong>的结构——这就是 C++20 的模块。它分成两种文件角色：模块接口文件（习惯叫 <code>.cppm</code> 或 <code>.ixx</code>）负责声明「我导出什么」，模块实现可以就写在接口文件里，也可以拆成实现分区。
    </p>
    <ol class="lesson-steps">
      <li>在接口文件里用 <code>export module math;</code> 声明一个模块，给它起个名字。</li>
      <li>用 <code>export</code> 标记要对外提供的函数、类、变量；<strong>没加 <code>export</code> 的声明只在本模块内部可见</strong>。</li>
      <li>使用方写 <code>import math;</code> 导入，只能看到被 <code>export</code> 出来的名字，其它一律不可见。</li>
      <li>需要组织大型模块层次时，用 <code>export import A;</code> 把导入的模块再重新导出；模块内部还可以用 <code>module math:part;</code> 做分区。</li>
    </ol>
    <p>
      这一换，开场那三个问题各自被对症解决：<strong>宏不再泄漏</strong>，因为模块实现里 <code>#define</code> 的东西不会影响导入它的人（反过来说，也不能再用宏去影响模块接口——这恰恰说明封装性变强了）；<strong>顺序依赖消失</strong>，<code>import</code> 与书写位置无关，导入了就可用；<strong>编译变快</strong>，模块接口只被解析并编译成模块产物<strong>一次</strong>，之后各个翻译单元直接读这份产物，不必重新解析整棵树。
    </p>
    <p>
      迁移时还有两个现实边界必须知道。第一是<strong>与头文件互操作</strong>：可以把旧头文件 <code>#include</code> 进模块实现里，也可以用「头文件单元」<code>import "header.h";</code> 把现有头文件当模块导入；标准库也有了自己的模块形式 <code>import std;</code>（C++23 起）。第二是<strong>编译器支持与 ABI</strong>：MSVC 支持最好，GCC 从 11 起需要 <code>-fmodules-ts</code> 和模块映射，Clang 仍在推进中；模块还会改变名称修饰（name mangling），不同编译器或版本产出的模块可能互不兼容，而标准库模块正是用来缓解这一点的。所以头文件会长期与模块共存，新项目可以优先用模块，老项目也不必急着全量迁移。
    </p>
    <div class="lesson-box warn">
      <strong>容易踩的一点：</strong>别再指望用宏给模块接口做条件编译来「影响使用者」——宏被隔离在模块实现内部，使用方既看不到也改不了。反过来，如果你把某个辅助声明<strong>忘了加 <code>export</code></strong>，模块外就是访问不到，报错会写成「未声明的标识符」。排查这类错误时，第一步永远是确认那个名字到底有没有被 <code>export</code>。
    </div>

    <h2>接口与使用方分工</h2>
    <figure class="lesson-figure">
      <figcaption>对照 <code>math.cppm</code> 与 <code>main.cpp</code> 两份文件：接口文件里 <code>export module math;</code> 声明模块、<code>export</code> 标出 <code>add</code> 与 <code>multiply</code>，使用方一句 <code>import math;</code> 就能调用——注意它<strong>看不到</strong>任何未被导出的内部细节。</figcaption>
      <CPP28Modules />
    </figure>

    <h2>命名边界与单次解析</h2>
    <p>
      头文件的问题，是它把「复用」实现成了「文本粘贴」，于是宏泄漏、顺序敏感、重复解析全都躲不开。模块把同一件事换成了<strong>有名字、有导出边界、只解析一次</strong>的导入：导出的才可见，内部的外不外泄，接口只编译一遍。理解这一层，就明白 C++20 为什么要费这么大力气给「include 的替代品」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模块接口单元」</span>指以 <code>export module 名字;</code> 声明模块、用 <code>export</code> 标记对外可见声明的那个翻译单元（文件通常命名为 <code>.cppm</code> 或 <code>.ixx</code>），它是模块对外的唯一门面。边界：只有被 <code>export</code> 的声明对 <code>import</code> 方可见；宏不会跨模块边界泄漏；模块可以用 <code>export import</code> 分层组织；C++20 的模块依赖编译器支持（MSVC 较好，GCC/Clang 仍在完善），并可能带来跨编译器、跨版本的 ABI 差异。
    </div>
  </LessonArticle>
</template>
