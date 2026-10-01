<script setup lang="ts">
import T10Conditional from './T10Conditional.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>接口响应有成功和失败两种形状，我想写一个类型只把「成功时的数据」取出来，结果它对着整个联合一起判断，一个成员都没提取到——为什么没有逐个成员分别处理？
    </div>

    <h2>提出问题</h2>
    <p>
      响应类型往往是个联合：成功时是 <code>{ ok: true; data: T }</code>，失败时是 <code>{ ok: false; error: string }</code>。业务里真正关心的是「成功分支里那份 <code>data</code> 到底是什么类型」。你很自然地想为它写一个派生类型，把成功数据挖出来，可是一动手就发现：这件事得<strong>按类型形状做分支</strong>——如果它是这种形状就取 A，否则取 B。
    </p>
    <p>
      类型层面过去没有这种能力，代价就是手工展开。每一种响应都手写一个提取类型，<code>UserResponse</code> 配一个 <code>UserData</code>，<code>CourseResponse</code> 再配一个 <code>CourseData</code>，逻辑完全一样却抄了无数遍。更麻烦的是遇到联合时，手写的类型根本不知道该针对哪个成员。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：为每种响应单独定义一个提取类型，把成功数据的形状直接写死。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「提取」这件事明确表达了</strong>。类型名字本身就说明了意图，使用处也能得到正确的数据形状。在响应种类很少、又不怎么变化时，这样写清楚、直接，够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>每新增一种响应就要重抄一份提取类型，逻辑重复且容易抄错。</li>
      <li>面对联合类型时，手写类型无法「逐个成员分别判断」，要么全中要么全不中。</li>
      <li>提取规则一旦变化（比如成功标记改名），所有手写类型都要跟着改。</li>
      <li>它无法对内层未知类型做捕获，遇到泛型容器只能放弃。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「按形状分支」，而是把这个分支动作<strong>交给语言本身</strong>。条件类型就是类型层面的 if-else，写作 <code>T extends U ? X : Y</code>：先判断 <code>T</code> 能否赋值给 <code>U</code>，是则取 <code>X</code>，否则取 <code>Y</code>。把它写成一个具名的类型别名，就得到了可以反复复用的判断规则。
    </p>
    <p>
      真正有意思的地方在遇到联合类型时。当 <code>extends</code> 左边的 <code>T</code> 是一个<strong>裸类型参数</strong>、而实参又是联合类型时，条件类型会<strong>把分支逐个应用到每个成员</strong>，再把结果重新拼成联合——这就是分布式条件类型。所以同样是判断，它天然就懂得「分别处理」。
    </p>
    <p>
      但如果你的本意恰恰是<strong>把整个联合当成一个整体</strong>来判断呢？只要用方括号把 <code>T</code> 包起来写成 <code>[T] extends [U]</code>，那个「裸」的条件就被打破了，分发随之被抑制，判断对象重新变成整个联合。<code>[T]</code> 这个包裹，正是在「逐个成员」与「整体判断」之间切换的开关。
    </p>
    <ul>
      <li><code>[T] extends [never]</code> 用来判断联合是否为空——因为裸判断会让 <code>never</code> 直接返回 <code>never</code>，必须包裹才能得到真值。</li>
      <li>嵌套的条件类型读起来费劲时，拆成几个具名的类型别名，比堆在一行里强得多。</li>
    </ul>
    <p>
      而当我们想在匹配到的分支里<strong>捕获那份未知的子类型</strong>时，就用 <code>infer</code>——它声明一个待推断的变量，让编译器在匹配时反向把它的取值推出来。把条件类型与 <code>infer</code>、映射类型组合起来，那些耳熟能详的内置工具就都能自己实现：<code>Exclude</code> 用分发把能匹配上的成员剔除，<code>Extract</code> 反过来只保留匹配上的成员，<code>NonNullable</code> 则把 <code>null</code> 与 <code>undefined</code> 分发掉。它们本质上都是同一个机制的不同产物。
    </p>
    <div class="lesson-box warn">
      <strong>三个提醒：</strong>并非所有条件类型都会分发，<strong>只有当 <code>extends</code> 的左操作数是裸类型参数时才会分发</strong>；条件类型的分支只表达类型推导，千万别在里面写运行时代码；<code>infer</code> 的专项内容见本板块 T_21，那里会讲清它如何从函数、容器中提取内层类型。
    </div>
    <p>
      回头再看开场那个提取成功数据的类型，就能写得又短又准：判断 <code>R</code> 是否满足「成功形状」，在匹配的分支里用 <code>infer</code> 把 <code>data</code> 捕获出来，其余情况归到 <code>never</code>。联合响应经过一分布式判断，成功数据自然就被摘了出来。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮切换成功与失败响应，看条件类型提取出的数据如何被使用。</figcaption>
      <T10Conditional />
    </figure>

    <h2>总结</h2>
    <p>
      条件类型把「按类型形状分支」变成了语言内置的能力：<code>T extends U ? X : Y</code> 做判断，裸类型参数遇到联合会逐个分发，用 <code>[T]</code> 包裹即可切回整体判断，配合 <code>infer</code> 还能捕获内层类型。<code>Exclude</code>、<code>Extract</code>、<code>NonNullable</code> 这些工具，都是这套机制结出的果。
    </p>
    <div class="lesson-term">
      <span class="term-name">「条件类型」</span>用 <code>T extends U ? X : Y</code> 在类型层面做分支选择。当裸类型参数收到联合类型时，分支会逐个应用到每个成员，即<strong>分布式条件类型</strong>；用 <code>[T]</code> 包裹可把整个联合作为整体判断。<code>infer</code> 在匹配分支中捕获未知子类型，<code>Exclude</code>、<code>Extract</code>、<code>NonNullable</code> 等工具正是这一机制的产物。
    </div>
  </LessonArticle>
</template>
