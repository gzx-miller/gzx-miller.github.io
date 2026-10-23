const o=`<script setup lang="ts">
import WB07FunctionsLocals from './WB07FunctionsLocals.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给购物车写了一个 Wasm 函数 <code>sum</code>，签名明明声明返回 <code>i32</code>，调用后却拿到一个跟总价毫无关系的数——像是数组的个数。代码逐行看着没错，问题到底出在哪几个槽位上？
    </div>

    <h2>名称与索引差异</h2>
    <p>
      你想把「算一段商品总价」封装成一个可复用的函数。在 JS 里这件事很轻松：参数和局部变量都靠<strong>名字</strong>，编译器替你管理它们在内存里放哪。可 Wasm 是贴近机器码的栈式目标，函数一被调用，它需要一套<strong>固定、可索引的存储布局</strong>——参数要按位置落进确定的槽，函数体里临时用的中间值也要有槽可放。
    </p>
    <p>
      如果不用这些槽，把所有中间结果都留在操作数栈上会怎样？代价有两个，而且都很硬：栈只能后进先出，你在循环里想回头取一个早先算好的值，就得靠 <code>dup</code> 和反复调整顺序来「记住」它，稍不留神就把栈搞乱；更糟的是栈上的数没有名字，读代码时根本不知道此刻栈顶那个数代表「结束地址」还是「累加器」。所以真正的问题是：<strong>函数调用时，参数和临时变量该落在哪里、又怎样被稳定地取回来？</strong>
    </p>

    <h2>本地槽位编号</h2>
    <p>
      给函数一块<strong>按索引编号的本地槽位</strong>：参数先占靠前的槽，局部变量接着占后面的槽，用 <code>local.get &lt;索引&gt;</code> 读、<code>local.set &lt;索引&gt;</code> 写。于是 <code>sum(ptr, n)</code> 里 <code>ptr</code> 是 0 号槽、<code>n</code> 是 1 号槽，后面再加两个局部变量。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「操作数栈上转瞬即逝的临时值」提升成了「有编号、可随时取回的本地存储」</strong>。你在函数的任何位置都能按索引重新拿到一个值，不必再小心翼翼地维护栈顺序。
    </p>

    <h2>索引空间共用</h2>
    <ul>
      <li>参数和局部变量<strong>共享同一个索引空间</strong>，很容易数错：<code>ptr</code> 是 0、<code>n</code> 是 1，第一个局部变量其实是 2 号，不是一个独立的「1 号局部」。</li>
      <li>光有索引没有名字，<code>local.get 2</code> 读代码时完全不知道它是什么。</li>
      <li>如果函数体最后留在栈顶的值类型，和签名声明的 <code>result</code> 对不上，整个模块校验就会失败。</li>
      <li>局部变量只活在这次调用里，函数一返回就没了，不能指望它跨调用保留状态。</li>
    </ul>

    <h2>参数局部命名</h2>
    <p>
      先补「编号与命名」。WAT 允许给参数和局部变量起名字：
      <code>(func $sum (param $ptr i32) (param $n i32) (result i32) (local $end i32) (local $acc i32) …)</code>。
      编号规则是<strong>参数在前、局部变量在后、从 0 连续排</strong>：<code>$ptr=0</code>、<code>$n=1</code>、<code>$end=2</code>、<code>$acc=3</code>。源码里写名字、机器码里用索引，只要记住这个排序，就不会取错槽。
    </p>
    <p>
      再补「拿什么变量算一段循环」。用局部变量 <code>$end</code> 记录结束地址：<code>ptr + n * 4</code>——因为数组里每个 <code>i32</code> 占 4 字节，<code>n</code> 个元素就跨 <code>n * 4</code> 字节。再用 <code>$acc</code> 作累加器，先 <code>local.set</code> 成 0。
    </p>
    <p>
      接着补「怎么循环」。Wasm 没有 <code>for</code>，用 <code>(block $exit (loop $loop … ))</code> 表达：每轮开头先比 <code>$ptr</code> 与 <code>$end</code>，若 <code>$ptr &gt;= $end</code> 就 <code>br_if $exit</code> 跳出；否则把 <code>$acc + i32.load($ptr)</code> 写回 <code>$acc</code>，再把 <code>$ptr</code> 加 4，最后 <code>br $loop</code> 回到循环开头。累加与指针推进这两件事合起来，正好走完整个数组。
    </p>
    <p>
      最后补「怎么把结果交出去」。函数体收尾时把 <code>local.get $acc</code> 留在操作数栈顶，函数以 <code>0x0b</code>（即 <code>end</code>）结束，栈顶那个值就是返回值。要记住一条硬规则：<strong>返回值类型必须与签名里声明的 <code>result</code> 一致</strong>，声明 <code>i32</code> 却留了个 <code>f64</code> 在栈顶，校验器会直接拒绝这个模块。
    </p>
    <div class="lesson-box warn">
      <strong>一个最容易踩的坑：</strong>参数与局部变量共用同一个索引空间，<strong>序号是「参数在前、局部变量在后」连着数的</strong>。此外 <code>local.get</code> / <code>local.set</code> 的取值类型必须和槽位声明的类型匹配，拿 <code>i32</code> 的指令去取一个 <code>f64</code> 的槽，同样会被拒绝。
    </div>

    <h2>累加循环执行演示</h2>
    <figure class="lesson-figure">
      <figcaption>改一改商品价格再点「结算」，看 <code>sum</code> 如何用两个局部变量循环累加出合计，同时对照左侧 WAT 源码认出参数、局部变量与返回值各在哪。</figcaption>
      <WB07FunctionsLocals />
    </figure>

    <h2>槽空间与栈帧</h2>
    <p>
      Wasm 函数由签名、参数、局部变量和指令体组成，参数与局部变量共用一个<strong>从 0 开始连续编号的本地槽空间</strong>。调用时这些槽在栈帧里分配，函数体用 <code>local.get</code> / <code>local.set</code> 按索引读写，而返回值就是函数体留在操作数栈上的那个值——它的类型必须与签名声明的 <code>result</code> 一致。
    </p>
    <div class="lesson-term">
      <span class="term-name">「局部索引空间（local index space）」</span>指每个 Wasm 函数持有的一组从 0 连续编号的本地槽位，<strong>参数占前几个槽，局部变量紧接其后</strong>，用 <code>local.get</code> / <code>local.set</code> 按索引（或 WAT 里的名字）读写。边界：索引顺序是「参数在前、局部变量在后」；取数指令的类型必须与槽位声明一致；局部变量在调用时分配于栈帧、返回即回收；函数体以 <code>end</code> 收尾，栈顶留下的返回值类型必须匹配签名里的 <code>result</code>。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
