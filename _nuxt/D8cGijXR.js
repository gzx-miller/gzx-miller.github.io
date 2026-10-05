const n=`<script setup lang="ts">
import T23TypeLevelProgramming from './T23TypeLevelProgramming.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>前端用 <code>userName</code>、后端要 <code>user-name</code>，运行时写个转换函数谁都会；可我要的是「转换之后那套键」在<strong>类型上</strong>也精确存在，让写错字段名当场报错——类型层面怎么写一段转换逻辑？
    </div>

    <h2>编译期类型转换</h2>
    <p>
      前后端联调时总有一批机械转换：字段名要在 camelCase 与 kebab-case 之间来回、字符串要裁掉空格、字符串 <code>'5'</code> 有时要当成数字类型 <code>5</code> 用、两个数字类型要比较大小。这些逻辑用 JavaScript 写起来毫不费力，你却希望它们的<strong>产物也能被类型系统精确描述</strong>——只有那样，调用方写错字段名才会在编译期报错。
    </p>
    <p>
      如果做不到，代价立刻显现：转换后的结构只能靠 <code>Record&lt;string, unknown&gt;</code> 之类的宽类型兜底，键名拼错、大小写写反都不会被拦下；数值比较、字符串裁剪这类约束也只能留到运行时判断，错误被推迟到了生产环境。你真正想要的，是<strong>把校验从运行时前移到编译期</strong>。
    </p>

    <h2>函数与手写类型</h2>
    <p>
      最省事的做法：运行时函数加手写类型。写一个 <code>convertKeys</code> 在运行时把键改成 kebab-case，再在旁边手动抄一份转换后的对象类型，告诉调用方「大概是这些键」。
    </p>
    <p>
      这个方案并非全错：<strong>它至少承认了「转换后的结构应该有一个类型」</strong>，调用方也算有了提示。只要字段不多、改动不频繁，它能撑住。
    </p>

    <h2>实现与类型分叉</h2>
    <ul>
      <li>两份事实必然漂移：运行时函数改了转换规则，手写的那份类型不会跟着改。</li>
      <li>数值比较、字符串去空格、字符串数字转数字这类逻辑，手写类型根本没地方表达。</li>
      <li>新增一个字段，要同时改转换函数和手写类型，漏改时编译期不会报错。</li>
      <li>无法沉淀成可复用、可测试的类型工具，每个文件各写各的。</li>
    </ul>

    <h2>条件类型与映射</h2>
    <p>
      不推翻「类型要有转换」，而是让<strong>类型自己去执行这段逻辑</strong>。把运行时的 <code>if-else</code> 翻译成条件类型，就是类型层面的三元表达式：
    </p>
    <p>
      <code>type If&lt;C extends boolean, T, F&gt; = C extends true ? T : F</code>
    </p>
    <p>
      类型层面没有循环，就用<strong>递归</strong>代替；没有整数，就用<strong>元组的长度</strong>充当计数器。用 <code>Count extends any[] = []</code> 一路累积，再判断 <code>Count['length'] extends N</code> 是否到达目标数——这套「元组当计数器」的手法是类型级算术的通用套路，靠它就能实现大小比较、重复拼接与字符串数字转数字。
    </p>
    <ol class="lesson-steps">
      <li>类型层面的判断：用条件类型 <code>T extends U ? X : Y</code> 做分支，等价于运行时的 if-else。</li>
      <li>类型层面的循环：用递归调用自身来「迭代」，用到达边界时返回常量来退出。</li>
      <li>类型层面的数字：用一个元组的长度表示数值，<code>[...Count, 0]</code> 就是加一。</li>
      <li>类型层面的字符串：用模板字面量配 <code>infer</code> 逐段拆解与重组。</li>
    </ol>
    <p>
      元组本身也能当数据结构用：<code>Length</code> 取长度、<code>Head</code> 取头部、<code>Tail</code> 取尾部、<code>Concat</code> 拼接，这些操作组合起来，就是类型层面的列表处理。字符串则靠模板字面量递归：<code>type TrimLeft&lt;S extends string&gt; = S extends \` \${infer R}\` ? TrimLeft&lt;R&gt; : S</code> 每次削掉一个左侧空格，直到没有再匹配；把大小写判断叠进递归，就能写出 camelCase 转 kebab-case、snake_case 这类逐字符变换。
    </p>
    <p>
      把映射类型、键重命名与递归组合起来，还能对对象做整体转换：遍历每个键、用模板字面量把键改成目标格式、再递归处理值，一次就把嵌套对象的键统统换成 kebab-case。再往深一层，还有 <code>UnionToIntersection</code> 把联合转成交叉——<code>{ a: 1 } | { b: 2 }</code> 会变成 <code>{ a: 1 } &amp; { b: 2 }</code>，<code>LastOf</code> 取出联合的最后一个成员，<code>UnionToTuple</code> 把联合转成元组。它们都属于同一类「类型体操」：用类型系统的规则，把逻辑在编译期跑完。
    </p>
    <div class="lesson-box warn">
      <strong>别为了炫技写体操。</strong>类型体操是手段不是目的，可读性永远优先，业务代码里要克制使用；复杂类型会受实例化深度限制，务必给出可读的具名别名并补上注释；为类型工具的输入输出各写一组类型断言用例，把行为锁住、防止后续改动让它悄悄退化；真正好用的技巧应该沉淀进团队的类型工具库，而不是在各个业务文件里重复实现。
    </div>

    <h2>工具类型实现对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「映射类型 / 条件类型 / 模板字面量 / 进阶技巧」标签，看同一批工具类型的内置实现与手写推导结果。</figcaption>
      <T23TypeLevelProgramming />
    </figure>

    <h2>类型级编程能力</h2>
    <p>
      类型级编程，是把条件类型、映射类型、模板字面量类型、递归与 <code>infer</code> 组合起来，在编译期完成判断、循环、字符串变换乃至算术（借元组长度当数字）。它让类型本身承担校验与派生，把错误挡在编译阶段；但它是手段而非目的，越复杂的类型越要衡量可读性，能写成直白声明的，就不要写成体操。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型级编程」</span>指在类型层面实现计算与逻辑：用条件类型做分支、用递归做循环、用元组长度当数字、用模板字面量与 <code>infer</code> 做字符串拆解重组。它能表达大小比较、键名转换、联合与交叉互转等复杂约束。使用原则是<strong>可读性优先</strong>，注意实例化深度限制，并为工具类型补上类型断言用例。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
