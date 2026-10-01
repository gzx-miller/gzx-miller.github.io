<script setup lang="ts">
import WB13ImportCallbacks from './WB13ImportCallbacks.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个 <code>counter.wasm</code>，收银台 A 要打印「库存量 3」这样的明细，收银台 B 要打印「第 3 件已入账」。你不想为了两套日志把二进制编译两份——同一份字节，凭什么能表现成两种完全不同的行为？
    </div>

    <h2>宿主绑定风险</h2>
    <p>
      模块自己也常常需要「打印」「写存储」「发网络」这类能力。可要是把它依赖的那个具体实现写进 Wasm，模块就被绑死在一台宿主机上了：编译给浏览器用的产物未必能跑在 Node 里；改一行日志文案都要重编译整个 Wasm；想写单元测试时，也没办法把 <code>console.log</code> 换成一个默默收集日志的数组。
    </p>
    <p>
      手工绕路的成本同样不低：把日志逻辑用导出函数暴露给 JS、让 JS 反复轮询去取——调用方要额外维护一套同步协议，模块一多就乱；或者干脆放弃，把宿主能力全留在 JS 侧，那模块又够不着了。核心问题于是很清楚：<strong>模块要怎么声明「我需要某个能力」，却完全不关心这个能力由谁、以什么方式提供？</strong>
    </p>

    <h2>导入声明写法</h2>
    <p>
      答案是<strong>导入（import）</strong>。模块开头写一句 <code>(import "env" "log" (func $log (param i32)))</code>，意思只是「我会调用一个叫 <code>env.log</code>、签名是 <code>(i32) -&gt; ()</code> 的函数」，实现一个字都不写。真正的 JS 函数，由宿主在实例化那一刻填进去。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「要做什么」和「谁来做」拆开了</strong>——模块只依赖一个签名，行为由注入的实现决定。同一份二进制，注入明细日志就是收银台 A，注入累计入账就是收银台 B。
    </p>

    <h2>签名不符崩溃</h2>
    <ul>
      <li><strong>签名必须完全对得上</strong>：模块声明的是 <code>(i32) -&gt; ()</code>，你递进去一个要返回值的函数，实例化会当场失败，抛 <code>LinkError</code>。</li>
      <li>回调是<strong>同步</strong>的：<code>emit()</code> 里的 <code>call $log</code> 会立刻执行 JS，如果 JS 里干了重活，整个 Wasm 就被卡在这一句上。</li>
      <li>能直接过的只有数字：想回传一个对象或字符串，塞不进 <code>i32</code>，只能写进内存再传指针，接口立刻变复杂。</li>
      <li>高频回调有<strong>跨边界开销</strong>：每件商品都调一次 <code>log</code>，n 件就是 n 次 JS↔Wasm 往返，性能敏感处会拖慢。</li>
    </ul>

    <h2>链接依赖签名</h2>
    <p>
      先补<strong>签名匹配</strong>。导入不是按名字「随便挂上」的，而是按<strong>签名</strong>链接：参数个数、类型、返回类型都要一致。名字对、类型不对，实例化直接失败。所以注入前先看清模块声明的类型，再照它写 JS 函数。
    </p>
    <p>
      再补<strong>用 <code>WebAssembly.Function</code> 显式声明签名</strong>。普通 JS 函数没有可读的类型信息，引擎只能猜；碰上多返回值、<code>i64</code>（要用 BigInt）、引用类型（<code>funcref</code> / <code>externref</code>）这些表达不出来的签名，就得把类型写清楚：
    </p>
    <p>
      <code>new WebAssembly.Function({ parameters: ['i32'], results: [] }, fn)</code> —— 把参数与返回类型显式标出来，引擎才知道该按哪套类型来传值。这一步补上之后，复杂的导入签名也能对得上号。
    </p>
    <p>
      接着补<strong>跨边界数据</strong>。既然只能直接传数字，那对象、字符串这类就要走线性内存：把数据写进去、传一个指针（外加长度）过去，模块按约定读。再进一步，如果只是想把某个宿主对象的「引用」交给模块保管，还可以用引用类型（下一课会展开），完全绕开拷贝。
    </p>
    <p>
      最后补<strong>复用与可测</strong>，这才是导入真正的价值所在。同一份二进制注入不同实现，等于把宿主能力做成了参数——这就是依赖注入：测试时注入一个把调用记进数组的桩函数，模块行为立刻可断言；生产时换成真实日志或网络实现，一行模块代码都不用改。高频回调的性能顾虑，也顺手靠「批量传数据、减少跨界次数」化解。
    </p>
    <div class="lesson-box warn">
      <strong>忘了会痛的一点：</strong>导入是<strong>同步</strong>调用且要求签名严格一致。别在回调里做异步或重活（会堵住 Wasm），也别指望引擎帮你把类型「修一修」——签名不匹配就是实例化失败，不是运行时容错。
    </div>

    <h2>两实例日志差异</h2>
    <figure class="lesson-figure">
      <figcaption>分别点 A 侧的「入库 / 出库」和 B 侧的「加购 / 取消」，看同一份 <code>counter</code> 二进制在两个实例里，因为注入了不同的 <code>env.log</code>，吐出的是两套完全不同的日志。</figcaption>
      <WB13ImportCallbacks />
    </figure>

    <h2>实现推迟到实例化</h2>
    <p>
      导入让模块只声明「我依赖某个签名的函数」，把实现推迟到宿主实例化的那一刻。同一份二进制配上不同的 JS 实现就能得到不同行为，宿主能力（日志、存储、网络）因此和业务逻辑解耦；签名不匹配会直接实例化失败，回调是同步的，复杂数据则要经内存或引用类型传递。
    </p>
    <div class="lesson-term">
      <span class="term-name">「导入函数（import）与宿主注入」</span>指 Wasm 模块通过 <code>(import "env" "log" (func …))</code> 声明它需要的外部函数及其签名，实现由宿主在实例化时提供，模块不关心具体是谁——这正是依赖注入。边界：导入按<strong>签名</strong>链接，参数或返回类型不匹配会抛 <code>LinkError</code>；回调是<strong>同步</strong>的，重活会阻塞模块；只能直接传数字，对象需经线性内存（指针 + 长度）或引用类型传递；多返回值、<code>i64</code>、引用类型等签名可用 <code>new WebAssembly.Function({ parameters, results }, fn)</code> 显式标注；高频回调有跨边界开销，应合并批量。
    </div>
  </LessonArticle>
</template>
