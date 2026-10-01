<script setup lang="ts">
import TW06ArbitraryValues from './TW06ArbitraryValues.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我给卡片拼了个动态类名 <code>bg-${color}-600</code>，开发时切换颜色好好的，一上线所有卡片全变透明——为什么明明写进模板的类名，样式却没有生成？
    </div>

    <h2>内置档位取值不足</h2>
    <p>
      你在做课程卡：设计稿要求某个区块的圆角和阴影是精确值，既不是内置档位、也不适合当成设计令牌；统计面板还需要根据输入框的 <code>data-state</code> 切换边框颜色。这些都是「内置工具类表达不了、却又确实需要」的约束。
    </p>
    <p>
      更棘手的是最后那种：颜色来自一个变量，看起来得在运行时拼出来。你希望既保留工具类的组合能力，又能表达这些一次性的、特殊的 CSS。
    </p>

    <h2>内联样式方案</h2>
    <p>
      最快的办法是用内联样式或临时补一段全局 CSS：<code>style="border-radius: 18px"</code>，或者给这个卡片单独写个类。它当然能显示出来，也确实解决了「这个值不在档位里」的问题。
    </p>
    <p>
      它做对的是<strong>承认特殊约束的存在</strong>，而不是硬把精确值塞进最近的档位。但代价很快显现：一旦这些值要跟着状态、断点变化，手写的这一层就脱离了整套工具类体系。
    </p>

    <h2>拼接类名失效</h2>
    <ul>
      <li>内联样式无法叠加变体：要在窄屏换另一个值，就得再补一遍媒体查询。</li>
      <li>数量一多，这些零散的精确值就变成了没人管理的魔法数字，设计一致性无从谈起。</li>
      <li>用变量拼类名时，比如 <code>bg-${color}-600</code>，构建期根本看不到完整类名，产物里自然不会生成这条规则。</li>
      <li>因为「反正能内联」，大家会绕过设计尺度，样式系统慢慢被掏空。</li>
    </ul>

    <h2>方括号任意值</h2>
    <p>
      Tailwind 用<strong>方括号语法</strong>把一次性值接回工具类体系：<code>w-[327px]</code> 表示任意宽度，<code>rounded-[18px]</code> 表示任意圆角。方括号里的值会原样生成声明，同时它<strong>仍然是一个工具类</strong>，所以可以照常加变体前缀——<code>md:rounded-[18px]</code> 这类组合完全能用。
    </p>
    <p>
      除了「任意值」，还有<strong>任意属性</strong>和<strong>自定义变体</strong>两种形态。<code>[mask-type:luminance]</code> 直接写一条不在内置工具里的属性；<code>data-[state=open]:</code> 则把 <code>data-state</code> 这个自定义属性变成可用的变体前缀，让「根据数据状态切换样式」也纳入同一套写法。
    </p>
    <p>
      接下来是最关键的一段：构建器<strong>把源码当纯文本扫描候选类</strong>。它不会运行你的代码，只是找出「看起来像类名」的完整字符串。所以只要类名是运行时拼出来的、在源码里从没完整出现过，扫描就看不见它，产物里也就不会有这条样式。<strong>写全、写死，才能被生成</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>这就是开场那个 bug 的根因：</strong>不要写 <code>bg-${color}-600</code> 这种碎片拼接。正确做法是把动态取值映射成<strong>完整、静态可扫描的类名</strong>，例如用一张对照表把颜色名换成完整的类名字符串，让每个可能用到的类都实打实地出现在源码里。
    </div>
    <p>
      还有一层判断标准：任意值不是「万能逃生舱」。某个精确值如果<strong>开始反复出现，说明它已经是一条约定</strong>，就该把它提升为 <code>@theme</code> 令牌或受控映射；如果任意值在代码评审里越来越多，那通常不是工具不够用，而是设计约束还没有收敛。
    </p>
    <p>
      所以实践口径是：把任意值当作<strong>需要集中评审的例外</strong>。偶尔用一次完全可以，但一旦它在代码里随处可见，就该停下来问一句——到底是内置尺度真的不够，还是大家在悄悄绕开规范。
    </p>
    <ol class="lesson-steps">
      <li>先确认这个值确实不属于既有设计令牌。</li>
      <li>以完整、静态可扫描的类名写进源码，包含方括号与变体前缀。</li>
      <li>当某个任意值开始重复出现时，把它提升为 <code>@theme</code> 令牌或受控映射。</li>
      <li>在产物里确认方括号类名被原样生成，而不是被静默丢弃。</li>
    </ol>

    <h2>滑杆调节类名变化</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑杆改变圆角与阴影，看方括号类名里的字符串如何随参数变化。</figcaption>
      <TW06ArbitraryValues />
    </figure>

    <h2>静态文本硬边界</h2>
    <p>
      任意值把特殊约束接回工具类体系：方括号里可以是值、属性或变体，写法统一、还能叠前缀。但它有一条硬边界——构建器只认源码里完整出现的类名，动态拼接等于没写。值偶尔特殊用方括号，值开始重复，就该升级成令牌。
    </p>
    <div class="lesson-term">
      <span class="term-name">「任意值」</span>是方括号语法，把内置档位覆盖不到的一次性约束接回工具类体系：<code>w-[327px]</code> 是任意值、<code>[mask-type:luminance]</code> 是任意属性、<code>data-[state=open]:</code> 是自定义变体。它仍可叠加变体前缀；但构建器按源码文本扫描，<strong>运行时拼出的类名不会被生成</strong>，动态取值必须映射为完整静态字符串。
    </div>
  </LessonArticle>
</template>
