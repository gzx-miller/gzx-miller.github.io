<script setup lang="ts">
import WB09JsInteropNumbers from './WB09JsInteropNumbers.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>下单页上用户选了 <code>3.9</code> 件（半份商品），你把这个数交给 Wasm 的计价函数，签名是 <code>(i32, i32) -&gt; i32</code>。没报错，函数也正常返回了——可算出来的小计和手算的对不上。<strong>3.9 到底变成了几？</strong>
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一件很普通的事：把界面上的数字交给模块去算。JS 这边只有<strong>一种</strong>数字类型 <code>number</code>，双精度浮点，既能表示小数也能表示很大范围的整数；而 Wasm 把数字拆成 <code>i32</code>、<code>i64</code>、<code>f32</code>、<code>f64</code> 四种，每种位宽固定、语义明确。跨边界时，两边必须按<strong>目标参数的表示法把值翻译一遍</strong>。
    </p>
    <p>
      如果不管这套规则、直接把 <code>number</code> 扔进去，成本是隐蔽而昂贵的：你以为传进去的是 <code>3.9</code>，模块收到的却是另一个数；这种错误<strong>不会抛异常</strong>，只在最终结果上悄悄偏了一点。金额、库存、坐标这类地方，等到对不上账时再回头查，代价远比一开始就搞懂换算规则大。所以真正要问的是：<strong>一个 number 跨过边界时，究竟会被怎样改写？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      按目标参数的类型做强制换算，最典型的是 <code>i32</code>。JS 的 number 进入 <code>i32</code> 参数时，引擎执行 <strong>ToInt32</strong>：先把小数部分<strong>向零截断</strong>丢掉，再只保留低 32 位。于是 <code>3.9</code> 变 <code>3</code>、<code>3.1</code> 也变 <code>3</code>、<code>-2.7</code> 变 <code>-2</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它给任何跨类型的值都规定了一套确定的换算规则</strong>——无论你丢进来的是什么 number，都能得到一个对应的 <code>i32</code>，调用不会失败。确定性本身，就是这套规则的立足点。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>小数是<strong>截断</strong>而不是四舍五入：<code>3.9</code> 得到 <code>3</code>、<code>2.99</code> 也是 <code>2</code>，指望它进位会把金额算少。</li>
      <li>超出 32 位的整数只留低 32 位：<code>4294967296</code>（即 2³²）传进去直接变成 <code>0</code>。</li>
      <li>负数、<code>NaN</code>、<code>Infinity</code> 进 <code>i32</code> 各有各的结果，而且全程一声不吭。</li>
      <li>换成 <code>f32</code> 参数呢？<code>0.1</code> 在 f32 里根本存不下精确值，会悄悄变成一个「接近 0.1」的数。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先把 <code>i32</code> 这条路认清楚：它走 <strong>ToInt32</strong>——先向零截断小数，再对 2³² 取模落到 32 位有符号的范围。所以 <code>3.9 → 3</code>、<code>-3.9 → -3</code>、<code>4294967296 → 0</code>。要躲开这个坑，正确的做法不是指望模块帮你取整，而是<strong>在传入之前自己决定取整策略</strong>：要向下取整就显式 <code>Math.floor</code>，要四舍五入就 <code>Math.round</code>。换算规则留在引擎里，取整决策留在你能看见的 JS 侧。
    </p>
    <p>
      再补 <code>f32</code> 这条路——它是<strong>精度降级</strong>。f32 只有 24 位有效数字（大约 7 位十进制），而 JS 的 number（即 f64）有 53 位。把 <code>0.1</code> 作为 <code>f32</code> 参数传进去，它会被舍入到最接近的 f32 值（约 0.100000001490116…），再读回来和 <code>0.1</code> 已经不再相等。所以涉及金额、坐标这类要精确的场景，优先选 <code>f64</code>，别为了省几个字节用 <code>f32</code>。
    </p>
    <p>
      接着补 <code>i64</code> 这条路，它和前面两条都不一样：<strong>必须用 BigInt</strong>。JS 的 number 只有 53 位整数精度，装不下完整的 64 位，所以 Wasm 的 <code>i64</code> 参数要求 JS 传 <strong>BigInt</strong>（写作 <code>10n</code>），返回的也是 BigInt。它和 <code>i64</code> 是<strong>一一对应</strong>的，64 位一位不丢——这是四条路里唯一无损的一条。代价是忘了在字面量后面加 <code>n</code>、传了普通 number 时，调用会直接抛 <code>TypeError</code>。
    </p>
    <p>
      最后一条是<strong>引用类型</strong>：对象、数组这些不能作为参数直接跨边界。要传就得要么写进线性内存、传一个指针进去，要么用 <code>externref</code> 引用。把四条路数一遍你就会发现：<strong>能直接传过去的只有 <code>number</code> 和 <code>BigInt</code></strong>，其余都得绕道内存。
    </p>
    <div class="lesson-box warn">
      <strong>最该警惕的一种 bug：</strong>把 number 传进 <code>i32</code> 参数<strong>不会报错，只会悄悄截断</strong>——<code>3.9</code> 变 <code>3</code>，程序照常跑完，错误只藏在结果里。要幂等的取整，就在 JS 侧显式做，别把决策交给引擎的隐式规则。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>改一改「件数 A / B」，同时看三张卡片：你 JS 侧填进去的值、Wasm 按 <code>ToInt32</code> 实际接收到的值、以及 <code>add</code> 返回的结果，对比它们之间的差。</figcaption>
      <WB09JsInteropNumbers />
    </figure>

    <h2>总结</h2>
    <p>
      JS 的 number 跨到 Wasm 时会按目标签名被改写：进 <code>i32</code> 走 ToInt32（向零截断、只留低 32 位），进 <code>f32</code> 会精度降级，进 <code>i64</code> 则必须换成 BigInt 且一位不丢；对象这类引用类型只能经内存指针或 <code>externref</code> 传递。
    </p>
    <div class="lesson-term">
      <span class="term-name">「ToInt32」</span>指 JS 的 number 传入 Wasm 的 <code>i32</code> 参数时引擎执行的换算：先向零截断小数，再对 2³² 取模落到 32 位有符号范围，<strong>不是四舍五入</strong>。边界：<code>3.9 → 3</code>、<code>-3.9 → -3</code>、<code>4294967296 → 0</code>，整个过程不抛异常，误差只体现在结果上；与之对照，<code>f32</code> 参数会做精度降级（<code>0.1</code> 存不准），<code>i64</code> 参数必须用 BigInt 一对一传输、不丢任何位。
    </div>
  </LessonArticle>
</template>
