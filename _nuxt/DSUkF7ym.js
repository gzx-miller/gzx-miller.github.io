const o=`<script setup lang="ts">
import WB04Operators from './WB04Operators.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你读一段 WAT，函数体只有三行：<code>local.get $a</code>、<code>local.get $b</code>、<code>i32.add</code>。没有赋值，没有 <code>a + b</code> 这样的表达式，也没有一行写着「结果存到哪」。可它就是算出了两数之和——<strong>这些值从哪来，算完又去了哪？</strong>
    </div>

    <h2>无变量运算形式</h2>
    <p>
      你要看懂（或写出）一段 WAT 的运算。别的语言里，表达式自带中间结果的名字，你能一眼追踪每一步；Wasm 不这么写。旧办法是「把它当普通算式照抄」，成本有三：找不到中间值存在哪，读起来像断了链；分不清二元指令的左右操作数（<code>a</code>、<code>b</code> 谁被减）；不知道除零、移位越界这些边界会发生什么。
    </p>
    <p>
      问题由此落到：<strong>不写中间变量的指令序列，凭什么能算出结果？</strong>
    </p>

    <h2>栈式求值方式</h2>
    <p>
      最朴素的做法：把函数体当成按顺序执行的一串命令，每读一条，就在脑子里维护一个「栈」。<code>local.get $a</code> 把 <code>a</code> 压上去；<code>local.get $b</code> 把 <code>b</code> 压上去；<code>i32.add</code> 弹掉栈顶两个、把和压回去。
    </p>
    <p>
      这个方案做对了一件事：<strong>用一个隐式的栈代替了所有中间变量</strong>，指令序列本身就是计算过程，不需要给每一步起名字。
    </p>

    <h2>操作数顺序与除零</h2>
    <ul>
      <li>二元指令的操作数顺序固定：<code>local.get $a</code> <code>local.get $b</code> <code>i32.sub</code> 得到的是 <code>a - b</code>，先压栈的作左操作数，写反结果就错。</li>
      <li>除零没有定义：<code>i32.div_s</code> 遇到除数为 0 会触发运行时陷阱（<code>RuntimeError</code>），不是返回 0 也不是 NaN。</li>
      <li>整除向零取整：<code>-7 / 2</code> 得到 <code>-3</code>，不是数学上向下取整的 <code>-4</code>。</li>
      <li>移位量越界不报错：<code>i32.shl</code> 会把移位数按位宽取模（等价于 <code>shift &amp; 31</code>），得到看似奇怪但完全确定的结果。</li>
      <li>整数与浮点是两套独立指令，<code>i32.add</code> 和 <code>f32.add</code> 操作码不同，混用会让验证失败。</li>
    </ul>

    <h2>求值规则推演</h2>
    <p>
      不推翻「栈」，而是把它的规则说清，并逐条推演。规则只有两条：指令从<strong>栈顶</strong>取操作数，把结果<strong>压回栈顶</strong>；函数返回时以当前栈顶值为结果。
    </p>
    <p>
      用这个规则推一遍 <code>(a + b) * c</code> 怎么编：压 <code>a</code>、压 <code>b</code>，<code>i32.add</code>（栈顶变成 <code>a + b</code>），再压 <code>c</code>，最后 <code>i32.mul</code>。你会发现<strong>运算符出现的顺序，就是计算的顺序</strong>——不需要括号，也不需要给中间结果起名。
    </p>
    <ol class="lesson-steps">
      <li><code>i32.const 10</code> 把常量 10 压栈。</li>
      <li><code>i32.const 4</code> 再压一个 4，此时栈顶是 4、下面是 10。</li>
      <li><code>i32.mul</code> 弹出两个、相乘，把 40 压回栈顶。</li>
      <li>函数以 <code>end</code> 收尾，栈顶的 40 作为返回值。</li>
    </ol>
    <p>
      补上「供给源」这一步：有两类指令专门往栈里放值，短小但关键——<code>i32.const</code> 压常量，<code>local.get</code> 从函数局部空间取值压栈。没有它们，栈永远是空的。
    </p>
    <p>
      再补指令的分族。整数族（<code>i32.*</code> / <code>i64.*</code>）与浮点族（<code>f32.*</code> / <code>f64.*</code>）各有自己的操作码：<code>i32.add</code> 是 <code>0x6a</code>、<code>i32.mul</code> 是 <code>0x6c</code>、<code>i32.div_s</code> 是 <code>0x6d</code>、<code>i32.xor</code> 是 <code>0x73</code>、<code>i32.shl</code> 是 <code>0x74</code>，而 <code>f32.add</code> 是 <code>0x92</code>——<strong>浮点指令是独立命名空间</strong>，不会和整数混用。
    </p>
    <p>
      别忘了比较指令也在这套体系里。<code>i32.lt_s</code>、<code>i64.gt_u</code> 这类指令同样消费两个操作数，但压回的不是原类型，而是一个 <code>i32</code> 的 0 或 1，充当布尔结果。
    </p>
    <p>
      最后记住两条边界：一是<strong>运算指令不直接访问内存</strong>，要碰内存必须走显式的 <code>load</code> / <code>store</code>；二是除零会 trap、位移量会被取模，这些不是 bug，而是规范写死的确定行为。
    </p>
    <div class="lesson-box warn">
      <strong>读完就记住这两条：</strong>操作数的左右顺序由压栈顺序决定，<code>i32.sub</code> 尤其容易写反；<code>i32.div_s</code> 除零触发 <code>RuntimeError</code>，而位移量超过位宽不报错、只会按位宽取模。
    </div>

    <h2>五种运算指令对比</h2>
    <figure class="lesson-figure">
      <figcaption>输入两个操作数，切换乘法 / 整除 / 异或 / 左移 / 浮点加，看同一个 <code>calc</code> 模块里的五种运算指令各给出什么结果。</figcaption>
      <WB04Operators />
    </figure>

    <h2>栈顶取值规则</h2>
    <p>
      Wasm 的运算指令作用在一个显式的操作数栈上：常量与局部值压栈，运算符从栈顶弹出所需操作数、把结果压回，函数返回栈顶值。运算符的出现顺序就是计算顺序，整数族与浮点族各自独立；除零 trap、位移取模、指令不直接碰内存，是必须记住的三条边界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「操作数栈」</span>指 Wasm 指令执行时操作的隐式栈——<code>i32.const</code>、<code>local.get</code> 等把值压入，运算符从栈顶弹出固定数量的操作数、把结果压回，函数返回时取栈顶值。边界：二元指令先压入者作左操作数（<code>i32.sub</code> 顺序写反结果就错）；<code>i32.div_s</code> 除零触发 <code>RuntimeError</code>、且向零取整；<code>i32.shl</code> 等移位指令对移位数按位宽取模。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
