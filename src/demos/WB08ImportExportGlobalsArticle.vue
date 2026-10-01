<script setup lang="ts">
import WB08ImportExportGlobals from './WB08ImportExportGlobals.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你希望 Wasm 模块打印一行日志，可它连 <code>console</code> 都碰不到——沙箱里根本没有 I/O。反过来，模块内部存着一个库存计数，你想在 JS 里读它、改它。两块互相看不见对方代码的代码，怎么临时借到彼此的能力？
    </div>

    <h2>沙箱与宿主能力</h2>
    <p>
      你要做的是一套库存管理：模块负责计数逻辑，而「打印」和「界面上显示的数字」这两件事必须落在宿主（浏览器）身上。问题是 Wasm 被设计成一个<strong>沙箱</strong>：它没有 <code>console</code>、没有 DOM、没有网络，只有自己的计算和线性内存。可真实程序离不开这些宿主能力，模块的内部状态也得能被外面看到、被外面驱动。
    </p>
    <p>
      于是问题被劈成对称的两半：<strong>模块怎么声明「我需要宿主给我什么」，以及模块怎么把东西「交给宿主用」</strong>。如果反过来，让模块自己去直接调用宿主 API——比如在 WAT 里写死 <code>console.log</code>——代价很清楚：同一份模块，C 编译出来、Rust 编译出来、跑在浏览器还是跑在 Node 上，宿主完全可能不同，把宿主硬编码进模块就等于绑死了平台；而且模块本没有宿主权限，允许它直接够到宿主，沙箱这层保护也就形同虚设。
    </p>

    <h2>导入清单声明依赖</h2>
    <p>
      让模块显式列一张<strong>导入清单</strong>来声明依赖：<code>(import "env" "log" (func $log (param i32)))</code> 读作「我要一个叫 <code>log</code> 的函数，来自 <code>env</code> 命名空间，形状是 <code>(i32) -&gt; ()</code>，实例化时你给我实现」。同一件事反过来，就是<strong>导出</strong>：<code>(export "get" (func $get))</code> 把内部函数交给宿主调用。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「依赖什么」和「提供什么」都变成了模块层面显式声明、可核对的契约</strong>。宿主不必猜模块想要什么，模块也不必知道宿主是谁。
    </p>

    <h2>可导出物类型</h2>
    <ul>
      <li>光在模块里声明导入还不够——JS 得知道往哪儿、按什么形状把这些实现塞进去。</li>
      <li>能导出的东西不止函数一种：函数、内存、表格、全局变量都是，宿主怎么区分它们？</li>
      <li>模块想存一个「库存数量」这种单值状态，放内存里要自己算地址，太笨拙。</li>
      <li>这个状态宿主到底能不能直接改？还是只能绕一圈经函数去改？</li>
    </ul>

    <h2>实例化注入实现</h2>
    <p>
      先补「JS 怎么把实现交进去」。实例化时传一个 <code>importObject</code>：<code>WebAssembly.instantiate(bytes, { env: { log: hostLog } })</code>。它的键路径要和导入声明对上——命名空间 <code>env</code>、名字 <code>log</code>——而且要记住一条硬约束：<strong>函数的签名必须与模块声明完全一致</strong>（参数个数、类型、返回值都对得上），否则实例化当场失败。
    </p>
    <p>
      再补「怎么区分导出项的种类」。导出项自带一个 <code>kind</code> 编码：<strong>函数 = 0、表格 = 1、内存 = 2、全局 = 3</strong>。一个导出段里可以混着导出这些，宿主按类型取用——<code>instance.exports.get</code> 拿到的是函数，<code>instance.exports.count</code> 拿到的是一个代表全局变量的对象。
    </p>
    <p>
      接着补「单值状态放哪」。用一个<strong>全局变量</strong>：<code>(global $count (mut i32) (i32.const 0))</code>。它不像内存那样要自己算地址，有名字、直接存放一个值，正适合计数器、配置标志这类单值状态。
    </p>
    <p>
      最后补「可变性」，这是最容易被忽略的一层。全局变量<strong>默认是不可变的</strong>，外部只能读，模块内部也不能改；要让它可以写，必须在类型前加 <code>mut</code>，写成 <code>(mut i32)</code>。加了 <code>mut</code> 之后，模块内用 <code>global.get</code> / <code>global.set</code> 读写，宿主侧则既可以经导出的全局对象 <code>.value</code> 属性改，也可以走你导出的函数间接改——<code>counter</code> 例子里的 <code>get</code> / <code>inc</code> / <code>dec</code> 就干这个。另外那个 <code>emit</code>，它内部调用导入的 <code>$log</code>，正好演示了反向的一跳：<strong>Wasm 调用宿主导入的函数是同步的</strong>，一层层 <code>call</code> 进去、执行完、再原路返回，中间没有排队。
    </p>
    <div class="lesson-box warn">
      <strong>两个高频报错：</strong>全局变量默认不可变，忘了在类型前写 <code>mut</code> 时，模块内的 <code>global.set</code> 会直接校验失败；导入函数的签名必须与声明一字不差，少一个参数或多一个返回值，实例化就会抛错。
    </div>

    <h2>库存计数与上报</h2>
    <figure class="lesson-figure">
      <figcaption>点「入库 / 出库」看导出的全局变量 <code>count</code> 如何变化，再点「上报」触发 Wasm 调用宿主注入的 <code>env.log</code>，右侧日志区会同步冒出一行。</figcaption>
      <WB08ImportExportGlobals />
    </figure>

    <h2>模块宿主能力对接</h2>
    <p>
      导入段让模块声明「我需要宿主给我什么能力」，导出段让模块说明「我能给宿主什么」，两边在实例化时用 <code>importObject</code> 对接；模块内部的单值状态可以用全局变量承载，而全局变量<strong>默认不可变，要允许写就必须加 <code>mut</code></strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「导入段与导出段（import / export section）」</span>指 Wasm 模块用来声明对外依赖与对外能力的两个段：导入段列出模块需要宿主提供的能力，实例化时由 JS 按命名空间和名字经 <code>importObject</code> 注入实现；导出段把内部函数、内存、表格、全局变量交给宿主使用。边界：导入函数的签名必须与声明完全一致，否则实例化失败；导出项带 <code>kind</code>（函数 0、表格 1、内存 2、全局 3）；全局变量默认不可变，需写入必须在类型前加 <code>mut</code>；Wasm 调用宿主导入的函数是同步的。
    </div>
  </LessonArticle>
</template>
