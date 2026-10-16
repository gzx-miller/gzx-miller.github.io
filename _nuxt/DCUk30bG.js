const o=`<script setup lang="ts">
import CPP04ControlFlow from './CPP04ControlFlow.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>成绩判定想输出「优秀 / 及格 / 不及格」，可 <code>if (score &gt;= 90) … if (score &gt;= 60) … else …</code> 这样写下去，一个 95 分的成绩会同时落进「优秀」和「及格」两个分支。问题不在条件，而在这几个 <code>if</code> 之间的<strong>连接方式</strong>——它们到底该怎么串？
    </div>

    <h2>先朴素做法：一个条件接一个条件地判</h2>
    <p>
      分支最朴素的形式就是「条件为真就做一件事」：<code>if (score &gt;= 90) { cout &lt;&lt; "优秀"; }</code>。它做对了什么？把「判断」和「动作」分开了，条件为真就执行花括号里的语句，为假就跳过——<code>if</code> 的本质是一个受布尔条件守卫的语句块。
    </p>
    <p>
      不足在于「多个条件」时容易写成相互独立的 <code>if</code>。若把上面那段写成两个并列的 <code>if</code>，95 分两个条件都为真，于是「优秀」「及格」都会被打印。真正的意图是<strong>互斥的多路选择</strong>：落进某一档就不再往下判。这就引出了 <code>else if</code>——它把后面的判断挂在前面条件为假的分支上，形成一条「只会命中一次」的链。
    </p>
    <p>
      把链写全就是 <code>if / else if / else</code>：条件从上到下依次求值，第一个为真的分支胜出，其后全部跳过；若都不满足，则落到 <code>else</code>。这块「守卫 + 跳链」的结构，是所有分支语法的共同骨架。
    </p>

    <h2>switch：把等值判断收敛成一张跳转表</h2>
    <p>
      当判断是「多个离散常量之间的等值比较」时，用一长串 <code>else if (x == A) …</code> 会显得冗余——每个条件都在重复写 <code>x ==</code>。朴素做法于是转向 <code>switch</code>：把表达式算一次，再和各个 <code>case</code> 标签比较。它做对了什么？语义上把「对同一个值做多路等值匹配」表达得非常集中，编译器也常能把它优化成一张跳转表。
    </p>
    <p>
      但 <code>switch</code> 有一个反直觉的默认行为：<strong>case 会「穿透」</strong>。当某个 <code>case</code> 匹配成功后，程序从这个标签往下<strong>依次执行</strong>，直到遇见 <code>break</code> 或到达 <code>switch</code> 末尾为止——它并不会自动停在下一个 <code>case</code> 前。所以朴素写法里最常见的 bug，就是忘了写 <code>break</code>，导致多个分支被连续执行。
    </p>
    <p>
      迭代的方向不是「记住每个 case 都要 break」，而是分清意图：<strong>要独立的就补 <code>break</code>；要故意合并的（多个 case 共享同一段逻辑）就让几个 <code>case</code> 空着、叠在一起</strong>。后者是合法且常见的写法，例如把 <code>case 1:</code> 和 <code>case 2:</code> 放在一起、共用后面一段代码。关键是让「穿透」成为<strong>有意为之</strong>，而不是遗漏。另有一条硬约束：<code>case</code> 标签必须是编译期的整型常量表达式，不能是变量。
    </p>

    <h2>循环三兄弟：while、do-while 与 for</h2>
    <p>
      循环的朴素动机很直接：把一件重复的事写一遍，让机器替我们重复执行。三种循环在结构上各有分工：
    </p>
    <ul>
      <li><code>while (cond) { ... }</code>：<strong>先判后做</strong>，条件可能一次都不成立，循环体一次都不执行。</li>
      <li><code>do { ... } while (cond);</code>：<strong>先做后判</strong>，循环体至少执行一次，适合「先试一次再决定要不要继续」的场景，如菜单输入。</li>
      <li><code>for (init; cond; step) { ... }</code>：把「初始化、条件、步进」三件事集中写在头部的括号里，适合已知迭代次数或需要显式计数器的场景。</li>
    </ul>
    <p>
      三者可以互相改写，但表达力并不等价。选择的标准是「循环的控制信息放在哪里最自然」：计数器驱动的用 <code>for</code>，状态驱动的用 <code>while</code>，至少执行一次的用 <code>do-while</code>。<strong>把 <code>for</code> 的三个部分写清楚，本身就是一种文档</strong>，读代码的人一眼就能看出循环的起点、终点与步长。
    </p>

    <h2>范围 for 与 break / continue</h2>
    <p>
      手动写下标遍历容器时，容易在边界上出错：<code>i &lt;= v.size()</code> 就多了最后一次越界访问。C++11 的<strong>范围 for</strong> 把「逐个取出元素」这件事交给语法：<code>for (auto x : container)</code>，无需自己维护下标与终止条件。
    </p>
    <p>
      但范围 for 里「取出的东西是什么」由写法决定，这决定了它的用途：
    </p>
    <ul>
      <li><code>for (auto x : container)</code>：每次<strong>拷贝</strong>一个元素，修改 <code>x</code> 不影响容器。读值可以，改值不行。</li>
      <li><code>for (const auto&amp; x : container)</code>：绑定到元素的<strong>只读引用</strong>，避免拷贝，大对象时性能更好，是只读遍历的推荐写法。</li>
      <li><code>for (auto&amp; x : container)</code>：绑定到元素的<strong>可写引用</strong>，改 <code>x</code> 即改容器中的元素。</li>
    </ul>
    <p>
      与循环体配合的两个流程控制是 <code>break</code> 与 <code>continue</code>：<code>break</code> 立即跳出<strong>整个</strong>循环或 <code>switch</code>；<code>continue</code> 只跳过<strong>本轮</strong>剩余语句，回到循环的条件判断处。需要提醒的是：范围 for 遍历时不要同时增删容器元素，容器结构一旦改变，迭代器就可能失效，行为随之变得不可预期。
    </p>

    <h2>C++17 的域内初始化：把变量关进它该在的作用域</h2>
    <p>
      朴素写法常为了一个「只在判断里用一次」的变量，在函数体开头先声明：<code>auto it = find(...); if (it != v.end()) { ... }</code>。它做对了什么？变量能用在条件里。不足是 <code>it</code> 的作用域<strong>泄漏</strong>到了整个函数——后面若同名复用或误用，编译器不会拦你。
    </p>
    <p>
      C++17 允许把初始化直接写进条件：<code>if (auto it = find(...); it != v.end()) { ... }</code>，<code>switch</code> 也支持同样的写法。分号前是初始化语句，分号后是条件。这样 <code>it</code> 的作用域被<strong>限制在 if / else 的两条分支之内</strong>，出了这段就不可见，既少一次变量提前声明，也避免名字污染。
    </p>
    <p>
      它体现的是一条贯穿 C++ 的原则：<strong>尽量缩小变量可见范围</strong>，让名字只在真正需要它的地方存在。
    </p>

    <h2>看一遍分支与循环的写法对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「分支 / 循环 / 范围 for」三个标签，对照 if-else 链与 switch 的结构，比较 while、do-while、for 的适用场景，并看清范围 for 中 auto、const auto&amp;、auto&amp; 三种写法的差别。</figcaption>
      <CPP04ControlFlow />
    </figure>

    <h2>把控制流当成一条「会分岔的路」</h2>
    <p>
      条件分支与循环，本质上是给程序的执行路径<strong>造分岔与回路</strong>：<code>if / else if / else</code> 负责互斥的多路选择，<code>switch</code> 把等值匹配收敛成跳转表（并提醒你 <code>break</code> 的穿透语义），三种循环按「判与做的先后」各司其职，范围 for 把容器遍历简化到只剩元素本身，C++17 的域内初始化则把临时变量的作用域收进分支。<code>break</code> 与 <code>continue</code> 再给出提前退出与跳过本轮的两个出口。把这些结构按「意图」而不是「惯性」来选，控制流就会既短又清晰。
    </p>
    <div class="lesson-term">
      <span class="term-name">「穿透（fallthrough）」</span>指 <code>switch</code> 中某 <code>case</code> 匹配后未遇 <code>break</code> 而继续执行其后各 <code>case</code> 的行为，可刻意利用也可因遗漏成错；<span class="term-name">「迭代语句」</span>是 <code>while</code>、<code>do-while</code>、<code>for</code> 与范围 for 的总称；<span class="term-name">「迭代器失效」</span>指遍历中增删容器元素导致迭代器不再可用。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
