<script setup lang="ts">
import WB03ValueTypes from './WB03ValueTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>结算代码把 <code>0.1</code> 连加十次。用 <code>f64</code> 算，得到 1；同一段逻辑换成 <code>f32</code>，结果是 <code>0.99999994</code>。更让人意外的是，你把一个 64 位订单号塞进 <code>i64</code> 参数，浏览器直接抛 <code>TypeError</code>——同样是「一个数」，为什么换个类型结果就变了，甚至根本传不进去？
    </div>

    <h2>数值类型的多样</h2>
    <p>
      你要让 JS 和 Wasm 交换数值。JS 只有一种数字类型（双精度 <code>number</code>），Wasm 却有好几种，而且<strong>每一种都必须显式声明</strong>。旧办法是「反正都是数，随便传」，成本有三：类型对不上时，模块在实例化阶段就被验证器拒绝；有些值用 <code>number</code> 根本表达不了，硬传会静默丢位；浮点精度被降级时，没有任何提示。
    </p>
    <p>
      所以真正要解决的是：<strong>在两种类型系统之间，什么值配什么类型、边界上又会发生什么换算？</strong>
    </p>

    <h2>统一双精度方案</h2>
    <p>
      最朴素的做法：凡是小数都用 <code>f64</code>，反正在 JS 里 <code>number</code> 就是 64 位双精度。
    </p>
    <p>
      这个方案做对了一件事：<strong><code>f64</code> 与 JS 的 <code>number</code> 位宽一致，能无损互传</strong>，绝大多数普通计算交给它确实没问题。
    </p>

    <h2>双精度的边界</h2>
    <ul>
      <li><code>i64</code> 参数或返回值不能用 <code>number</code> 传，必须用 <code>BigInt</code>，否则当场抛 <code>TypeError</code>。</li>
      <li>整数一旦超过 <code>2^53</code>，放进 <code>number</code> 就已经丢了精度，而 <code>f64</code> 也装不下这么大的整数。</li>
      <li><code>f32</code> 是 32 位单精度，累加这类操作会明显累积误差（<code>0.1</code> 加十次不等于 1）。</li>
      <li>Wasm 没有字符串、对象、<code>null</code> 这些高层类型，它们都得绕道内存或引用类型来表达。</li>
    </ul>

    <h2>四种标量类型</h2>
    <p>
      不推翻「用数值沟通」，而是先认清手里到底有几块积木。Wasm 的标量数值类型只有四种：<code>i32</code>、<code>i64</code>、<code>f32</code>、<code>f64</code>（此外还有 128 位向量 <code>v128</code> 与引用类型，那是后话）。所有签名、局部变量、内存读写，都只能在这几种里选。
    </p>
    <p>
      第一层要补的是<strong>类型声明的位置</strong>。类型不写在函数体里，而是集中在<strong>类型段</strong>：函数签名按索引去引用类型段里的条目。这样设计，验证器只需看类型层，就能快速判断参数个数与类型是否自洽，不必逐条执行指令——这正是类型系统能高效做安全检查的原因。
    </p>
    <ol class="lesson-steps">
      <li>类型段集中声明一条 <code>(i32, i32) -&gt; i32</code> 的签名。</li>
      <li>函数的参数与局部变量都按这个类型来。</li>
      <li>内存读写按给定类型解释字节宽度。</li>
      <li>宿主按导出签名把入参做数值换算后传入。</li>
    </ol>
    <p>
      第二层要补的是<strong>局部变量与内存的类型</strong>。局部变量声明时必须写类型，<code>local.get</code> / <code>local.set</code> 按那个类型取值；内存里同一段字节，用 <code>i32.load</code> 读和用 <code>f32.load</code> 读会得到完全不同的解释——<strong>类型决定了「这几个字节怎么理解」</strong>。
    </p>
    <p>
      第三层是<strong>跨边界的换算规则</strong>。JS 的 <code>number</code> 进 <code>i32</code> 参数会被截断；进 <code>f32</code> 参数会被降精度；<code>i64</code> 则必须用 <code>BigInt</code> 一一对应，一位都不能少。反过来，Wasm 把 <code>i64</code> 返回给 JS，拿到的也是 <code>BigInt</code>。
    </p>
    <p>
      于是选型就有了规则：金额这类不能出错的量，用「整数分」存 <code>i64</code>，或至少用 <code>f64</code>；只在明确需要省内存、且能接受单精度误差时才用 <code>f32</code>；只要涉及 <code>i64</code>，边界两端都写 <code>BigInt</code>。之所以要有类型系统，也不只是为了算得准，更是为了让编译器能生成高效的机器码、让验证器能快速拒收非法模块。
    </p>
    <div class="lesson-box warn">
      <strong>「反正都是数」是这里最大的坑：</strong><code>i64</code> 不用 <code>BigInt</code> 会直接报错；<code>f32</code> 不是「小一号的 <code>f64</code>」，它的误差会在累加里越滚越大；而 <code>f64</code> 也扛不住超过 <code>2^53</code> 的整数。
    </div>

    <h2>真实返回值的验证</h2>
    <figure class="lesson-figure">
      <figcaption>四张类型卡片列出 <code>i32</code> / <code>i64</code> / <code>f32</code> / <code>f64</code> 的位数与用途，下方真调用一次模块里的 <code>mul(6, 7)</code> 与 <code>fadd(1.5, 2.25)</code>，对比整数与浮点两条路径。</figcaption>
      <WB03ValueTypes />
    </figure>

    <h2>类型位宽与用途</h2>
    <p>
      Wasm 的标量类型只有 <code>i32</code>、<code>i64</code>、<code>f32</code>、<code>f64</code> 四种，且所有签名、局部变量、内存读写都必须显式声明。类型集中在类型段，函数按索引引用，验证器据此做安全检查。跨边界时记住三条：<code>i64</code> 必须配 <code>BigInt</code>，<code>f32</code> 会丢精度，超过 <code>2^53</code> 的整数别指望 <code>number</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「标量类型」</span>指 Wasm 的四种数值类型 <code>i32</code>、<code>i64</code>、<code>f32</code>、<code>f64</code>（不含 128 位向量 <code>v128</code> 与引用类型），它们构成所有函数签名、局部变量与内存读写的基础。边界：<code>i64</code> 与 JS 互操作必须用 <code>BigInt</code>，否则抛 <code>TypeError</code>；<code>f32</code> 是单精度、存在舍入误差，累加场景应改用 <code>f64</code> 或 <code>i64</code>；Wasm 没有字符串、对象、<code>null</code>，需通过内存或引用类型表达。
    </div>
  </LessonArticle>
</template>
