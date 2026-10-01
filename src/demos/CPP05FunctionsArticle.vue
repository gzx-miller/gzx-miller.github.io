<script setup lang="ts">
import CPP05Functions from './CPP05Functions.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了 <code>void setTo100(int x) { x = 100; }</code>，调用之后外面那个变量纹丝不动；把签名改成 <code>void setTo100(int&amp; x)</code>，同一个调用点，外面的变量却变成了 100——同一份逻辑，只差函数签名里一个 <code>&amp;</code>，行为就完全相反。到底是谁在决定「改的是副本还是本体」？
    </div>

    <h2>参数传递的取舍</h2>
    <p>
      你把一段逻辑抽成函数，是为了复用、为了给这段逻辑起个名字。但函数和调用它的人之间要传数据，这就引出一个必须在写函数签名时就定下来的问题：<strong>调用方传进来的东西，函数里拿到的到底是「原件」还是「复印件」？</strong>
    </p>
    <p>
      旧办法（所有参数都按值传）看起来最安全：函数只操作自己的副本，改坏也波及不到外面。可它有两个必须由人承担的隐藏成本。第一，如果参数是一个装着几万个元素的容器，每次调用都要整体复制一份，程序会在你注意不到的线性开销上慢下来，而且这种慢不会报错、只会体现在性能曲线上。第二，有些函数<strong>本来就需要修改调用方的数据</strong>——比如交换两个变量的内容——按值传根本改不到，你写半天发现什么都没发生。
    </p>
    <p>
      反过来，如果为了避开复制而全改成引用，又会遇到新问题：有些参数本来就允许「没有」，比如「按名字查一个可能不存在的配置」；引用必须绑定到一个真实存在的对象，它没法表达「空」。于是你只能额外约定一个特殊值，把简单的事说复杂。
    </p>
    <p>
      所以问题落到：<strong>我该用什么方式把参数交给函数，才能同时管住「要不要复制」「能不能改原值」「是不是可有可无」这三件事？</strong>
    </p>

    <h2>按值传递副本</h2>
    <p>
      最朴素的做法：一律按值传。<code>void f(int x)</code>、<code>void g(std::string s)</code>，函数拿到的是副本，函数里怎么改都安全。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它把函数和调用方解耦了</strong>。函数不需要知道调用方手里有没有这个变量、会不会被改坏，它只对自己的副本负责；而且对于 <code>int</code>、<code>double</code> 这种很小的对象，复制的代价可以忽略不计。这份「互不干扰」正是函数本该给人的安全感。
    </p>
    <p>
      问题在于，一旦参数变大、或者函数本来就需要改动调用方，这条「一律按值」的规则就会在语义和性能上同时失效。
    </p>

    <h2>副本交换的失效</h2>
    <ul>
      <li><code>void swap(int a, int b)</code> 想交换两个数，结果什么都没发生——交换的是两份副本，函数返回后原件还在原位。</li>
      <li><code>void printAll(std::vector&lt;int&gt; v)</code> 每次调用都把整个容器复制一遍；把它放进循环里，就悄悄变成了平方级的开销。</li>
      <li>想让 <code>setTo100</code> 真正改到外面的变量，按值传根本做不到，只能靠返回值再赋回去，写起来别扭。</li>
      <li>如果参数真的可以「没有」，按值传一个空对象并不能表达「没有」——空对象和「没有对象」是两回事。</li>
      <li>把大对象按值传还会触发一次完整的复制构造，对象内部再持有别的资源时，代价会层层放大。</li>
    </ul>

    <h2>四类传递方式</h2>
    <p>
      不推翻「解耦」这个目标，而是给参数按语义分成几类，各配一种传递方式。先处理最常见、也最便宜的一类，再逐层往复杂走。
    </p>
    <p>
      第一层：<strong>小对象、不需要改原值 → 继续按值传</strong>。<code>int</code>、<code>double</code>、<code>char</code> 这些复制很便宜，语义也最简单，没必要为它们引入引用的复杂度。
    </p>
    <p>
      第二层：<strong>需要改调用方的原值 → 按引用传</strong>，<code>void setTo100(int&amp; x)</code>。引用是原变量的别名，函数里改 <code>x</code> 就是改外面那个变量。这就是开场那个 <code>&amp;</code> 的真正含义——它不是「我要复制」，而是「我直接操作原件」。
    </p>
    <p>
      第三层：<strong>大对象、只读、不希望复制 → 按 const 引用传</strong>，<code>void print(const std::string&amp; s)</code>。它一次复制都不做，所以大容器传进来几乎零成本；<code>const</code> 又保证函数改不动它。它还能绑定到临时对象和字面量，所以 <code>print("hello")</code> 也合法。这应该是你的默认选择。
    </p>
    <p>
      第四层：<strong>「可有可无」的参数 → 按指针传</strong>，<code>void f(int* p)</code>。指针和引用都能改原值，但指针可以是 <code>nullptr</code>，于是它天然能表达「这个参数可以不传」。代价是函数里必须先判空：<code>if (p != nullptr) *p = 100;</code>。
    </p>
    <p>
      把这四种选择收成一句话：<strong>小对象按值、要改按引用、大对象只读按 const 引用、可选按指针</strong>。
    </p>
    <p>
      再往下还有两件和「函数」本身相关的事。其一是<strong>重载</strong>：允许同名函数有不同参数列表，编译器按实参类型挑最合适的那个——<code>add(1, 2)</code> 走 <code>int</code> 版本、<code>add(1.5, 2.5)</code> 走 <code>double</code> 版本。注意重载只能靠参数列表区分，<strong>不能靠返回类型</strong>；而且它会考虑隐式转换，偶尔会挑到你没预料的那一个，必要时用 <code>explicit</code> 或 <code>= delete</code> 把不想要的重载堵掉。
    </p>
    <p>
      其二是<strong>递归</strong>：函数自己调用自己时，必须先写<strong>递归基</strong>（什么时候停），再写递归步骤（每次都要更靠近基）。<code>factorial(n) = n * factorial(n - 1)</code> 里，<code>if (n &lt;= 1) return 1;</code> 就是那个基；少了它，或者某一步没有更靠近它，就会无限递归直到栈溢出。深度很大的递归，还要考虑改成迭代，因为递归深度受栈空间限制。
    </p>
    <div class="lesson-box warn">
      <strong>别返回局部变量的引用或指针：</strong>函数内的局部变量在函数返回时就销毁了，把它取地址或引用后返回，调用方拿到的是一个悬垂引用或悬垂指针，读到的内容随时可能被覆盖。要返回对象就按值返回，让编译器做复制或移动。
    </div>

    <h2>三种传递结果对照</h2>
    <figure class="lesson-figure">
      <figcaption>看代码里同一个 <code>int</code> 分别按值、按引用、按指针传给三个函数之后各自变成什么，再对比 <code>add</code> 的 <code>int</code> 版本与 <code>double</code> 版本被调用时分别走了哪一条重载。</figcaption>
      <CPP05Functions />
    </figure>

    <h2>传递方式的选型</h2>
    <p>
      参数传递方式本质上是一道四选一的题：<strong>要不要复制、能不能改原值、是不是允许为空</strong>。默认用 const 引用（大对象）或按值（小对象），只有确实要改原值才用引用，确实允许缺省才用指针。重载靠参数列表区分，递归必须先有能停下来的基。
    </p>
    <div class="lesson-term">
      <span class="term-name">「按引用传递」</span>指形参是实参的别名（<code>int&amp; x</code>），函数内对形参的修改直接作用在调用方的原对象上，且不产生复制。与之相对的是按值传递（复制实参）和按指针传递（传地址、可以为 <code>nullptr</code>）。边界：<code>const</code> 引用可绑定临时对象与字面量，因此常作只读大对象的默认选择；不要返回局部变量的引用或指针（悬垂引用）；引用一旦绑定不能改绑，指针则可以重新指向。
    </div>
  </LessonArticle>
</template>
