const o=`<script setup lang="ts">
import CPP03OperatorsExpressions from './CPP03OperatorsExpressions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想判断变量 <code>a</code> 里某些二进制位是否全为 0，写下 <code>if (a &amp; mask == 0)</code>，结果不管 <code>a</code>、<code>mask</code> 取什么，这个分支要么永远不进、要么永远进——代码看着像「先按位与、再比较」，编译器却按另一套理解执行。
    </div>

    <h2>运算符优先级规则</h2>
    <p>
      一行表达式里可以塞进很多运算符：<code>a + b * c</code>、<code>p &amp;&amp; q || r</code>、<code>x &lt;&lt; 1 &amp; 3</code>。人读的时候靠直觉——从左到右、按数学习惯来；但机器必须有一套毫不含糊的规则，否则同一行代码在不同编译器下能算出不同结果。
    </p>
    <p>
      这套规则的第一层是<strong>优先级</strong>：谁来先结合。第二层是<strong>结合律</strong>：优先级相同时从左还是从右。光这两层还不够，因为 C++ 还有两件事会让结果进一步偏离直觉：计算时数值用多少位（类型），以及子表达式谁先被真正求值（求值顺序）。你在脑子里默认「从左到右、位宽不变、谁先写谁先算」，可语言的默认并不是这样。
    </p>
    <p>
      旧办法（凭直觉写表达式、不加括号）要人承担的成本很具体：你得把整张优先级表背下来；就算背下来，位运算和相等运算谁高谁低也常常记反；即便优先级对上了，整数提升和求值顺序仍可能让同一个式子算出你没想到的值。
    </p>
    <p>
      所以问题落到：<strong>一行复杂表达式里同时出现算术、比较、位、逻辑、赋值，到底按什么顺序算成什么类型？哪些写法干脆是「没定义结果」的？</strong>
    </p>

    <h2>默认读法失效</h2>
    <p>
      最省事的做法：相信从左到右、相信数学直觉来读。<code>a &amp; mask == 0</code> 读起来就像 <code>(a &amp; mask) == 0</code>；<code>1/2</code> 读起来就该是 0.5。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>对于只用算术和关系、并且都加了括号的简单表达式，从左到右读是没问题的</strong>。大部分日常代码也确实落在这个范围内，所以「凭直觉」在小规模时够用。
    </p>
    <p>
      问题在于，一旦把位运算符、逻辑运算符和比较运算符混在一行，「直觉」会和真正的规则悄悄错开，而且错得毫无提示。
    </p>

    <h2>位运算优先级</h2>
    <ul>
      <li><code>a &amp; mask == 0</code> 实际等价于 <code>a &amp; (mask == 0)</code>——因为 <code>==</code> 的优先级高于 <code>&amp;</code>。<code>mask == 0</code> 先算出一个 0 或 1，再和 <code>a</code> 按位与，判断的语义就彻底变了味。</li>
      <li><code>char c1 = 100, c2 = 200; char sum = c1 + c2;</code>，<code>sum</code> 得不到 300——因为 <code>c1 + c2</code> 先被提升成 <code>int</code> 得到 300，再赋回 <code>char</code> 时才截断溢出，报错的位置和你以为的不一样。</li>
      <li><code>i = i++;</code> 的结果是<strong>未定义</strong>：同一个表达式里既读 <code>i</code> 又改 <code>i</code>，编译器怎么排都合法，不同编译器给出不同的值。</li>
      <li><code>int x = INT_MAX + 1;</code> 是<strong>未定义行为</strong>（有符号溢出），并不是「温和地回绕成负数」。</li>
      <li><code>1 &lt;&lt; 32</code> 对一个 32 位的 <code>int</code> 是未定义，因为位移位数超过了类型的位宽。</li>
    </ul>

    <h2>显式括号分组</h2>
    <p>
      不推翻「表达式能一行写完」，而是把这几条规则一层层补上，让每一层各自管住一类意外。先补的第一层是<strong>分组</strong>，因为它决定了后面两层在讨论什么。
    </p>
    <p>
      用括号把分组意图钉死。优先级从高到低大致是：<code>::</code>、成员与调用 <code>() [] -&gt; .</code> 与后缀自增、前缀运算符、<code>* / %</code>、<code>+ -</code>、<code>&lt;&lt; &gt;&gt;</code>、关系 <code>&lt; &lt;= &gt; &gt;=</code>、相等 <code>== !=</code>、<code>&amp;</code>、<code>^</code>、<code>|</code>、<code>&amp;&amp;</code>、<code>||</code>、<code>?:</code>、赋值、逗号最低。但你不需要背它——只要记住一条操作性的规则：<strong>只要位运算、逻辑运算、比较混在一行，就一律加括号</strong>。把 <code>a &amp; mask == 0</code> 写成 <code>(a &amp; mask) == 0</code>，括号是给你自己看的，不是给编译器看的。
    </p>
    <p>
      补完分组，接着要理解<strong>位宽会被悄悄改写</strong>，否则你加对了括号也算不对值。C++ 规定：小整数类型（<code>bool</code>、<code>char</code>、<code>short</code>）在参与表达式时先做<strong>整数提升</strong>，升成 <code>int</code>（只要 <code>int</code> 装得下原类型的全部取值），所以 <code>char + char</code> 的实际类型是 <code>int</code>。两个操作数类型不同时，再按<strong>算术转换</strong>统一到更高的那个类型，大致顺序是 <code>int → long → long long → float → double → long double</code>。这一层正好解释了 <code>c1 + c2</code> 为什么不会当场溢出——溢出发生在赋回 <code>char</code> 的那一刻；也解释了 <code>1/2</code> 为什么是 0 而不是 0.5（两个 <code>int</code> 相除，结果还是 <code>int</code>）。
    </p>
    <p>
      最后一层，也是唯一无法靠加括号解决的：<strong>求值顺序</strong>。C++17 起，只有少数运算符明确了左操作数先于右操作数求值——赋值、复合赋值、<code>&amp;&amp;</code>、<code>||</code>、<code>?:</code>、逗号。其余多数运算符的子表达式<strong>谁先算，标准没有规定</strong>。所以「别在同一表达式里既改一个变量又读它」不是风格建议，而是避免未定义行为的硬要求：把 <code>i = i++;</code> 拆成单独一行 <code>i++;</code>。
    </p>
    <p>
      把这些零碎规则串起来，还有几个在写表达式时天天用到的行为值得一起记住。<code>&amp;&amp;</code> 和 <code>||</code> 是<strong>短路</strong>的——左操作数已经能定结果，右边就不评估，所以 <code>if (p != nullptr &amp;&amp; p-&gt;ok())</code> 才安全，判空之后才解引用。前缀 <code>++i</code> 返回自增<em>后</em>的值，后缀 <code>i++</code> 返回自增<em>前</em>的旧值，对迭代器来说后缀还要多复制一份，性能上有差别。逗号运算符顺序求值，整个表达式的值和类型取最右边那一项，正好适合放在 <code>for</code> 里做多重初始化或更新。
    </p>
    <div class="lesson-box warn">
      <strong>位移的两个硬约束：</strong><code>&lt;&lt;</code> 和 <code>&gt;&gt;</code> 的操作数必须是整数类型，且右操作数必须非负、并且小于左操作数的位宽。违反这两条（例如对 32 位 <code>int</code> 写 <code>1 &lt;&lt; 32</code>）都是未定义行为，不是「结果为零」。
    </div>

    <h2>四类陷阱对照</h2>
    <figure class="lesson-figure">
      <figcaption>在「优先级 / 代码示例 / 常见陷阱」三个页签里，先对着优先级表看位运算排在哪个位置，再逐条对照四个陷阱的错误写法与修正写法。</figcaption>
      <CPP03OperatorsExpressions />
    </figure>

    <h2>表达式求值要素</h2>
    <p>
      一行表达式的结果由三件事共同决定：<strong>优先级决定怎么分组、整数提升与算术转换决定用多少位算、求值顺序决定谁先真的执行</strong>。别背优先级，混用场景一律加括号；别去依赖没被规定的求值顺序，同一个变量不要在一行里又读又改。
    </p>
    <div class="lesson-term">
      <span class="term-name">「未定义行为」</span>（undefined behavior，UB）指标准没有规定结果、编译器可以做任何事的代码，例如 <code>i = i++</code> 或有符号整数溢出。它不等于「结果随机」也不等于「回绕」——优化器甚至可以据此删掉整段分支。与之相近的是「未指定行为」，如多数运算符的求值顺序，结果由具体实现决定但不算非法。记住：能不写就不写，用括号和拆行消灭歧义。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
