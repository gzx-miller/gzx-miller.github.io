const n=`<script setup lang="ts">
import CPP15TemplatesBasics from './CPP15TemplatesBasics.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong><code>max(int, int)</code>、<code>max(double, double)</code>、<code>max(string, string)</code> 的比较逻辑一模一样，难道要为每种类型都抄一遍函数体？有没有办法只写一次，让编译器自己补出各类型版本？
    </div>

    <h2>朴素做法：按类型逐个函数重载</h2>
    <p>
      不加抽象时，只能为每种类型各写一个同名重载：<code>int max(int, int)</code>、<code>double max(double, double)</code>、<code>string max(...)</code>……这当然「做对了」——它是类型安全的，每个版本各自检查各自的类型。
    </p>
    <p>
      可它不是抽象。函数体是<strong>逐字重复</strong>的；每支持一个新类型就要新增一份；更麻烦的是当实参类型不匹配时，编译器可能悄悄做隐式转换，选到一个你以为不会选的重载。重复的地方越多，一致性越难保证。
    </p>

    <h2>函数模板与类型推导</h2>
    <p>
      把「类型」本身变成参数，重复就消失了：
    </p>
    <ul>
      <li><code>template &lt;typename T&gt; T maxValue(T a, T b) { return a &gt; b ? a : b; }</code>——这里 <code>T</code> 是类型参数。</li>
      <li>调用 <code>maxValue(3, 7)</code> 时，编译器从实参推导出 <code>T = int</code>，并据此生成一份函数实体，这一过程叫<strong>实例化</strong>。</li>
    </ul>
    <p>
      推导规则值得记牢：值参数按「去掉引用、保留顶层 const」推导，引用参数保留引用与 const，多个参数推导出不同 <code>T</code> 时会失败。<code>maxValue(3, 7.0)</code> 就是典型——<code>T</code> 一会儿 <code>int</code>、一会儿 <code>double</code>，编译器直接报错，需要显式写 <code>maxValue&lt;double&gt;(3, 7.0)</code> 把它统一。
    </p>

    <h2>类模板：把类型参数化到类上</h2>
    <p>
      同样的思路可以套在类上。类模板用起来必须<strong>显式指定</strong>类型参数：<code>Box&lt;int&gt;</code>、<code>Box&lt;std::string&gt;</code>。成员函数定义在类外时，要重复写一遍 <code>template &lt;typename T&gt;</code> 前缀，因为模板参数的作用域不会跨定义自动延续。
    </p>
    <p>
      一个重要的补充：类模板的成员函数<strong>只有被真正调用时才实例化</strong>。这意味着即使某个成员函数对当前类型不合法，只要不用它，这个类模板依然可以正常实例化——这是后面更高级技巧的基础。
    </p>

    <h2>特化与偏特化：为特定类型开小灶</h2>
    <p>
      模板的「一刀切」有时不适用，就可以针对特定类型替换实现：
    </p>
    <ul>
      <li><strong>全特化</strong>：<code>template &lt;&gt; class Box&lt;bool&gt;</code>，为 <code>bool</code> 完整替换一套实现。</li>
      <li><strong>偏特化</strong>：只固定部分参数，如 <code>template &lt;typename U&gt; class Pair&lt;int, U&gt;</code>。偏特化<strong>只有类模板可以</strong>。</li>
      <li>函数模板没有偏特化，遇到「只为某几类参数特事特办」的需求，直接用函数重载代替即可。</li>
    </ul>

    <h2>非类型参数、默认参数与代码膨胀</h2>
    <p>
      模板参数不一定非是类型。<code>template &lt;typename T, int N&gt;</code> 里的 <code>N</code> 是<strong>非类型模板参数</strong>，必须是编译期常量（整型、枚举、指针等），常用来固定数组大小。参数也可以给默认值：<code>template &lt;typename T = int&gt;</code>，于是 <code>Stack&lt;&gt;</code> 就等价于 <code>Stack&lt;int&gt;</code>。
    </p>
    <p>
      代价要讲清：模板是「用到多少类型，就生成多少份实体」，滥用会带来<strong>代码膨胀</strong>，也让编译变慢。所以模板定义通常直接放在头文件里——编译器必须看到完整定义才能实例化，若只把定义放进 <code>.cpp</code>，其它翻译单元就会在链接时找不到符号。最后，<code>template &lt;typename... Args&gt;</code> 形式的<strong>可变参数模板</strong>能接受任意个参数，是元组、完美转发等能力的底座，先有个整体印象即可。
    </p>

    <h2>看一遍函数模板与类模板</h2>
    <figure class="lesson-figure">
      <figcaption>对照 demo 中的 <code>maxValue</code> 函数模板、<code>Pair</code> 类模板与 <code>Pair&lt;std::string&gt;</code> 全特化，观察同一份模板如何为不同类型生成各自的实现。</figcaption>
      <CPP15TemplatesBasics />
    </figure>

    <h2>一份代码，多种类型</h2>
    <p>
      泛型编程的核心动作就一个：<strong>把类型从「写死」变成「参数」</strong>。函数模板靠推导替你填类型，类模板靠显式指定，特化在必要时开小灶，非类型参数进一步把编译期常量也参数化。理解了实例化这份「编译期生成代码」的本质，模板的威力与它的编译时间、代码体积代价就都能解释了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数模板」</span>以类型参数写算法、靠实参推导出具体类型；<span class="term-name">「类模板」</span>把类型参数化到类，使用时需显式指定。<span class="term-name">「实例化」</span>指编译器用具体类型替换模板参数、生成真实代码的过程；<span class="term-name">「全特化」</span>替换全部参数，<span class="term-name">「偏特化」</span>只固定部分参数（仅类模板可用）；<span class="term-name">「非类型模板参数」</span>是编译期常量形态的参数。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
