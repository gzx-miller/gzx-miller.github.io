<script setup lang="ts">
import WB11ControlFlow from './WB11ControlFlow.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在 WAT 里手写一个从 1 累加到 <code>n</code> 的函数。写完循环体，很自然地想敲一句「跳回上面再算一次」——才发现 Wasm 的指令集里<strong>根本没有 goto</strong>。可它明明能跑循环、能做分支。没有跳转语句，循环和 <code>if</code> 到底是怎么写出来的？
    </div>

    <h2>提出问题</h2>
    <p>
      Wasm 被设计成编译目标，汇编里的 <code>jmp</code> / <code>goto</code> 可以做任意跳转，看起来最省事。可「能跳到任何地方」这件事，恰好是它不敢要的。
    </p>
    <p>
      一旦允许任意跳转，代价就落到别人头上：验证器没法只看局部就确认代码安全，必须追着跳转目标把整张控制流图算出来，才能保证你不会跳进一段非法指令的中间；优化器难以把代码稳定地切成基本块，很多分析做不了；沙箱只靠边界检查兜底，跳转目标不可预测会让攻击面变大。而换个角度，循环又确实需要「跳回去」，分支也确实需要「按条件走不同的路」。于是问题收敛成一句：<strong>能不能有一种跳转，只允许在「看得见的块」里发生，跳出去之后就再也回不来？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      Wasm 给出的答案是<strong>结构化控制流</strong>：只有三种块——<code>block</code>、<code>loop</code>、<code>if/else</code>，再用 <code>br</code> / <code>br_if</code> 在这些块之间跳。跳转不写地址，只写标签所在的「深度」。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把跳转限定在嵌套的块结构里</strong>。<code>block</code> 定义一个块，<code>br</code> 一旦跳出这个块就直接落到块尾，再也回不去；<code>loop</code> 定义一个循环体，<code>br</code> 则跳到它的开头。控制流因此长成一棵可静态验证的树，验证和优化都能只看局部。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>br</code> 后面不写名字，写的是<strong>深度</strong>：<code>br 0</code> 指最近的外层块，嵌套一深就极容易数错，跳到错的块上。</li>
      <li><code>if</code> 必须以 <code>end</code> 收尾；想让分支返回一个值，还得写上 <code>result</code> 类型，漏掉就类型对不上。</li>
      <li><code>loop</code> 本身<strong>不判断条件</strong>——<code>br 0</code> 是无条件跳回开头，你忘了写退出条件，它就安静地变成死循环。</li>
      <li>递归是函数内部的 <code>call</code>，不在这套块结构里；每层递归占一个独立栈帧，<code>n</code> 稍大就可能触发栈溢出。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「块 + 跳转」，而是一层层把三种块补齐。先补 <code>block</code>：它的<strong>块尾就是跳出点</strong>，<code>block $exit … br $exit … end</code> 里那句 <code>br</code> 等价于 <code>break</code>，跳出去直接执行 <code>end</code> 之后的代码。
    </p>
    <p>
      再补 <code>loop</code>：它的<strong>块首就是跳转目标</strong>。在 <code>loop</code> 里执行 <code>br 0</code> 就回到循环体开头，配上 <code>br_if</code> 在条件满足时跳出外层 <code>block</code>，一个 <code>while</code> 就成形了。累加循环跑起来就是这三步：
    </p>
    <ol class="lesson-steps">
      <li>进入 <code>loop</code> 前先把结束边界准备好（例如 <code>ptr + n * 4</code> 存进一个局部变量）。</li>
      <li>循环体开头比较：已经到边界就用 <code>br_if $done</code> 跳去外层 <code>block</code> 的尾部，结束循环。</li>
      <li>否则执行一次累加、把指针往后挪一个元素，再 <code>br $loop</code> 跳回循环开头。</li>
    </ol>
    <p>
      接着补 <code>if/else</code> 的返回值。给 <code>if</code> 标上 <code>(result i32)</code>，两个分支各自把一个 <code>i32</code> 留在操作数栈上，整条 <code>if</code> 就等价于一个三目表达式——这正是递归函数书写基线条件的写法。
    </p>
    <p>
      最后补递归。三种块只能表达「在本函数内跳来跳去」，跨函数复用还得靠 <code>call</code>。斐波那契就是最小例子：用 <code>i32.lt_u</code> 比较 <code>n</code> 与 2 作为基线，<code>if</code> 的 then 分支在 <code>n &lt; 2</code> 时直接返回 <code>n</code>，else 分支分别 <code>call $fib(n-1)</code> 与 <code>call $fib(n-2)</code>，两个结果经 <code>i32.add</code> 相加返回。整段代码里没有一个 goto，分支靠 <code>if</code>，往来自靠 <code>call</code>。
    </p>
    <div class="lesson-box warn">
      <strong>同一个 <code>br 0</code>，含义完全相反：</strong>它跳到的是「最近的外层结构」，而这个结构是 <code>loop</code> 还是 <code>block</code>，结果正好掉个头——在 <code>loop</code> 里是跳回开头（继续迭代），在 <code>block</code> 里是跳到结尾（跳出）。写之前先看清它外面套的是哪一种块。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动输入框改变 <code>n</code>，看 <code>fib(n)</code> 的结果和这次递归总共调用了多少次 <code>fib</code>；再对照左边的 WAT，找到 <code>if/else</code> 是在哪一步判断基线条件的。</figcaption>
      <WB11ControlFlow />
    </figure>

    <h2>总结</h2>
    <p>
      Wasm 用 <code>block</code>、<code>loop</code>、<code>if/else</code> 三种结构化块替换掉了 goto，<code>br</code> 只按相对深度在块之间跳，控制流于是成为一棵可验证的树：分支交给 <code>if/else</code>，循环用 <code>loop</code> 加 <code>br_if</code>，跨函数复用交给 <code>call</code>，递归则是 <code>call</code> 自身。
    </p>
    <div class="lesson-term">
      <span class="term-name">「结构化控制流与 br 标签深度」</span>指 Wasm 没有 goto，仅提供 <code>block</code>（<code>br</code> 跳出，语义近 <code>break</code>）、<code>loop</code>（<code>br</code> 回跳，语义近 <code>continue</code>）与 <code>if/else</code> 三种块，<code>br</code> / <code>br_if</code> 按<strong>相对深度</strong>跳转，<code>br 0</code> 指最近的外层块。边界：深度数错会跳到错误的块；<code>if</code> 需 <code>end</code> 收尾、返回值要写 <code>result</code> 类型；<code>loop</code> 不自动判条件，漏写退出即成死循环；递归靠 <code>call</code>，深递归会耗尽栈帧而 trap。
    </div>
  </LessonArticle>
</template>
