<script setup lang="ts">
import WB10FunctionTable from './WB10FunctionTable.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>计价台要根据用户当前选的促销方式，在「加价、满减、打折、拆分」四个函数之间挑一个来调用。选哪个是<strong>运行时</strong>才知道的——用户点了按钮，模块拿到一个数字。函数名字没法写死在 WAT 里，那模块怎么凭一个运行时数字，找到并调用对应的函数？
    </div>

    <h2>运行时函数选择</h2>
    <p>
      静态调用从来不是问题：直接写 <code>call $add</code>，调用哪个函数编译期就定死了。麻烦在于促销方式是用户点击决定的，模块运行时手里只有一个数字 <code>op</code>（0/1/2/3），想知道它对应哪个函数。而 Wasm 里没有「可以把函数存进变量里的函数指针」，也没有反射可以按名字查函数。
    </p>
    <p>
      退一步，用一长串 <code>if</code> / <code>else</code> 分支，每个分支里 <code>call</code> 一个写死的函数行不行？代价一层层加：每新增一种运算就得改代码、重新编译；分支越铺越长，模块跟着膨胀；更要命的是，<strong>宿主完全没法在运行时替换某个实现</strong>——你想在不停机的情况下换成新算法，根本无从下手。问题于是收敛成一句：<strong>「调用哪个函数」这件事，能不能变成一个运行时可查、甚至可改的索引？</strong>
    </p>

    <h2>函数表结构与填充</h2>
    <p>
      造一张<strong>函数表</strong>——一个按索引存放函数引用的数组。<code>(table 4 funcref)</code> 声明 4 个槽，再用 <code>(elem (i32.const 0) $add $sub $mul $div)</code> 把四个函数依次填进去。调用时不写函数名，而是用 <code>call_indirect</code> 按索引去表里取函数执行。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「调用哪个函数」从编译期写死的名字，变成了运行时可以变化的索引</strong>。运行到哪一步、用哪个函数，全由那个数字决定。
    </p>

    <h2>表索引错位风险</h2>
    <ul>
      <li>索引对应哪个函数，纯靠约定——第 0 项是 <code>add</code>，全凭 <code>elem</code> 的填充顺序保证，一旦顺序写错就整体错位。</li>
      <li>表里各函数签名如果不一样呢？某个槽放的是 <code>(i32) -&gt; i32</code>，调用点却按 <code>(i32, i32) -&gt; i32</code> 去调，会发生什么？</li>
      <li>索引越界怎么办——表只有 4 项，却传进来一个 5？</li>
      <li>宿主能不能看见这张表，甚至直接改写其中一项？</li>
    </ul>

    <h2>引用类型表项</h2>
    <p>
      先补「表里放什么、怎么填」。表元素的类型统一是 <strong><code>funcref</code></strong>（函数引用，一种引用类型），用 <code>(elem …)</code> 段在实例化时填充：位置 0 到 3 依次是 <code>add</code>、<code>sub</code>、<code>mul</code>、<code>div</code>。<code>dispatch(op, a, b)</code> 里先把 <code>op</code> 压上操作数栈，它待会儿要当索引用。
    </p>
    <p>
      再补「怎么按索引调」。用 <code>call_indirect (type $binOp)</code>：它从操作数栈顶弹出一个<strong>索引</strong>，到表里取出对应的函数引用并调用它。关键在那个 <code>(type $binOp)</code>——<strong><code>call_indirect</code> 会在调用前校验目标函数的签名</strong>，槽里每个函数的参数和返回类型都必须与声明的类型匹配，不匹配就抛异常。注意这是<strong>运行时</strong>检查，不是编译期替你拦下的。
    </p>
    <p>
      接着补「越界」。索引超出表的当前大小，<code>call_indirect</code> 会触发 trap（<code>RuntimeError</code>），而不是随便读到一段垃圾代码去执行。所以调用前应当自己保证 <code>op</code> 落在 <code>[0, table.size)</code> 之内。
    </p>
    <p>
      最后补「宿主干预」，这才是函数表真正强大的地方。表可以导出，JS 侧用 <code>table.get(i)</code> 读到某个函数引用，用 <code>table.set(i, fn)</code> 改写表项。把第 0 项从 <code>add</code> 换成 <code>sub</code> 之后，<code>dispatch(0, …)</code> 立刻变成执行减法——<strong>不用重新编译模块</strong>，一次 <code>table.set</code> 就完成了热替换。多态、回调、运行时插件化，全都建立在这套「索引 + 可写表」的机制上。
    </p>
    <div class="lesson-box warn">
      <strong>别把它当静态调用看：</strong><code>call_indirect</code> 的类型校验发生在<strong>运行时</strong>——表里函数签名与声明的 <code>type</code> 不符、或索引越界，都会在那一刻抛异常，而不是像静态 <code>call</code> 那样由校验器提前挡下。用之前先确认索引合法、类型一致。
    </div>

    <h2>索引分发调用演示</h2>
    <figure class="lesson-figure">
      <figcaption>在四个促销运算之间切换、改一改 A / B，看 <code>dispatch(op, a, b)</code> 如何按索引分发；再点「改写第 0 项为 sub」，验证 JS 改表之后同一个 <code>dispatch(0, …)</code> 的行为也变了。</figcaption>
      <WB10FunctionTable />
    </figure>

    <h2>间接调用签名校验</h2>
    <p>
      函数表把函数引用按索引排成一列，模块用 <code>call_indirect</code> 在运行时按索引调用并顺手校验签名，于是「调用哪个函数」从编译期写死变成了运行时可定；表还能导出，宿主用 <code>table.get</code> / <code>table.set</code> 读写表项，热替换与插件化就建立在这一点上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数表（table）与 call_indirect」</span>指函数表是一组按索引排列的 <code>funcref</code>（函数引用），用 <code>(elem …)</code> 段填充；调用方用 <code>call_indirect</code> 从栈顶弹出索引，取出表内函数并在调用前校验其签名。边界：表元素类型统一为 <code>funcref</code>；索引越界或签名不匹配会抛异常，且这个检查发生在<strong>运行时</strong>；表可导出，宿主用 <code>table.get</code> / <code>table.set</code> 读写表项，从而实现热替换与插件机制。
    </div>
  </LessonArticle>
</template>
