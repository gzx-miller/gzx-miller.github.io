const o=`<script setup lang="ts">
import CPP04ControlFlow from './CPP04ControlFlow.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想删掉数组里所有偶数，用 C++11 的范围 for 写得很顺手：<code>for (int x : nums) { if (x % 2 == 0) nums.erase(...); }</code>，结果程序要么直接崩、要么漏删一部分——明明只是「边遍历边筛选」，为什么这个看起来更安全的新语法反而出了事？
    </div>

    <h2>非结构化跳转</h2>
    <p>
      程序不能只会从上往下执行，它得能「按条件走不同的路」和「重复做同一件事」。最原始的控制靠 <code>goto</code> 加标签，但用多了代码会变成一张跳来跳去的网，读的人根本追不上执行流从哪来、到哪去。于是语言提供了结构化的分支与循环：<code>if/else</code> 二选一、<code>switch</code> 多路选一、<code>while</code> 与 <code>for</code> 重复执行。
    </p>
    <p>
      可结构化只解决了「跳转清楚」，没解决「边界正确」。手工控制下标时，你要自己承担这些成本：<code>for (int i = 0; i &lt;= n; i++)</code> 这种差一错误你每写一次都要数一遍；容器大小随时可能变，你手写的大小边界可能在上一次删除之后就过期了；<code>switch</code> 忘了 <code>break</code> 会「穿透」到下一个分支，执行你根本没打算执行的代码。
    </p>
    <p>
      所以问题落到：<strong>怎么让「按条件重复」这件事，既不用手数边界，又不容易在容器变动时踩空？</strong>
    </p>

    <h2>手写分支循环</h2>
    <p>
      最朴素的做法：用 <code>if/else</code> 做分支、用 <code>switch</code> 做多路、用 <code>for (int i = 0; i &lt; size; i++)</code> 或 <code>while</code> 做循环，全部手动控制。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把控制流显式写了出来，执行路径一眼可读</strong>，而且它其实是所有循环的基础形态——不管上层语法多花哨，最后都会落回到这套「判断条件、执行、更新」的骨架。基础形态必须先站稳。
    </p>
    <p>
      问题在于，每一处边界都由你亲手维护，漏掉任何一处都不会报错，只会让程序在某个特定输入下静默出错。
    </p>

    <h2>贯穿执行越界</h2>
    <ul>
      <li><code>switch (day)</code> 里 <code>case 1:</code> 后面忘了 <code>break</code>，就会连同 <code>case 2:</code> 一起执行——你以为只打印「周一」，实际打印出一串。</li>
      <li><code>for (int i = 0; i &lt;= nums.size(); i++)</code> 手滑写成 <code>&lt;=</code>，最后一次循环访问的下标已经越界，读到的是不存在的元素。</li>
      <li>迭代器版本 <code>for (auto it = v.begin(); it != v.end(); ++it) { if (bad(*it)) v.erase(it); }</code>，在 <code>erase</code> 之后 <code>it</code> 立刻失效，下一次 <code>++it</code> 就是在操作一个悬空的迭代器，直接崩。</li>
      <li><code>for (;;)</code> 忘了写出跳出口，程序永远出不来，只能强杀。</li>
      <li>遍历时用 <code>auto x</code> 取值，每个元素都被复制一份，容器里装大对象时代价明显——而且你改 <code>x</code> 改的是副本，容器里的元素纹丝不动。</li>
    </ul>

    <h2>条件分支完善</h2>
    <p>
      不推翻「结构化控制流」，而是把常见的边界判断一步步交给语法去兜底。先补分支这一层，因为它最容易出现「结构性错误」而不是「算错值」。
    </p>
    <p>
      <code>if/else if/else</code> 用于条件分支；<code>switch</code> 用于「基于整型常量多路选一」。留意 <code>switch</code> 的两个硬约束：<code>case</code> 标签<strong>必须是整型常量表达式</strong>，字符串和浮点数都不行；默认每个 <code>case</code> 末尾都要 <code>break</code>。<strong>穿透</strong>本身不是错误，只是一种容易被遗忘的行为——如果你确实想故意穿透，C++17 提供了 <code>[[fallthrough]]</code>，写出来告诉编译器这是你有意为之。
    </p>
    <p>
      补完分支，接着补循环形态的选择：<code>for</code> 适合已知迭代次数，<code>while</code> 适合条件驱动（可能一次都不执行），<code>do-while</code> 保证至少执行一次，范围 for 用于遍历容器。按「是否预知次数 / 是否至少执行一次」来选，很多边界问题自然就消失了。
    </p>
    <p>
      这一节真正的新东西是第三层——<strong>C++11 的范围 for</strong>。写法 <code>for (auto&amp; x : container)</code> 是一层<strong>语法糖</strong>：它被编译器展开成「用 <code>begin()</code> 拿起点、用 <code>end()</code> 拿终点、每次 <code>++</code> 前进」的迭代器循环。它替你省掉了下标和终点条件，让差一错误无从发生，但<strong>语义并没有变</strong>——它仍然依赖容器的 <code>begin()</code> / <code>end()</code>。
    </p>
    <p>
      正因为只是语法糖，取值范围方式的差别就直接决定了行为：<code>const auto&amp; x</code> 是只读引用、不复制，应作为默认选择；<code>auto&amp; x</code> 是可修改的引用；<code>auto x</code> 会复制每个元素。而最重要的一条边界是——<strong>遍历过程中不能增删容器元素</strong>。因为 <code>erase</code> 会让后面的迭代器失效，范围 for 手里那个「当前位置」就悬空了，这正是开场崩溃的原因。要在遍历中改变大小，就得退回传统 <code>for</code> 或 <code>while</code>，并且在每次修改后重新取回迭代器，比如 <code>it = v.erase(it);</code>。
    </p>
    <p>
      最后收一个作用域的尾：C++17 起，<code>if</code> 和 <code>switch</code> 允许在条件位置初始化变量，写成 <code>if (auto it = m.find(k); it != m.end()) {...}</code>，<code>it</code> 只在 <code>if</code> 内部存活，用完即弃，也就减少了和外面重名的机会。
    </p>
    <div class="lesson-box warn">
      <strong>范围 for 最该记住的一条：</strong>它只是迭代器循环的语法糖，帮你免掉了手写下标，但<strong>没有</strong>替你处理「遍历中容器被修改」这件事。凡是循环体里可能 <code>erase</code> / <code>push_back</code>，就应该改用传统循环并手动管理迭代器。
    </div>

    <h2>循环分支写法对照</h2>
    <figure class="lesson-figure">
      <figcaption>在「分支 / 循环 / 范围 for」三个页签里，对照 <code>if-else</code> 与 <code>switch</code> 的写法、四种循环各自适用的场景，以及范围 for 三种取值写法（复制 / 只读引用 / 可改引用）的区别。</figcaption>
      <CPP04ControlFlow />
    </figure>

    <h2>结构化控制流</h2>
    <p>
      结构化控制流把 <code>goto</code> 的乱跳换成了清晰的分支与循环；选 <code>if</code> 还是 <code>switch</code>、<code>for</code> 还是 <code>while</code> 看场景。范围 for 让边界不必再手数，但它是语法糖不是护身符——<strong>遍历过程中容器被改，那条线依然要你自己守</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「范围 for」</span>是 C++11 的语法糖，<code>for (auto&amp; x : c)</code> 会展开为基于 <code>c.begin()</code> 与 <code>c.end()</code> 的迭代器遍历，要求容器提供这对接口（内置数组也可用）。取值方式决定语义：<code>const auto&amp;</code> 只读且不复制（推荐默认）、<code>auto&amp;</code> 可改原元素、<code>auto</code> 复制元素。例外：遍历中增删元素会使迭代器失效，此时必须改用传统循环并重新获取迭代器。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
