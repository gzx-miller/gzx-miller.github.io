const n=`<script setup lang="ts">
import SC15CustomProperties from './SC15CustomProperties.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我想让用户能实时换主题色，于是写下 <code>:root { --brand: $brand; }</code>，结果页面一点颜色都没变，浏览器像是把这条声明当成了无效值——为什么 Sass 变量放进自定义属性里就「失灵」了？
    </div>

    <h2>变量与自定义属性</h2>
    <p>
      你手里有两套颜色命名方式：一套是 Sass 变量 <code>$brand</code>，在编译期求值、编译完就从产物里消失；另一套是 CSS 自定义属性 <code>var(--brand)</code>，浏览器认识它，能参与级联与继承，也能被脚本随时改写。
    </p>
    <p>
      可业务的诉求是分裂的：「品牌色、间距」这类设计令牌希望编译期就固定下来；而「用户切主题、跟随系统深色、从本地存储读回用户偏好」这些必须在<strong>浏览器运行时</strong>才决定。Sass 变量天生做不到后者——它不会留在 CSS 里，JS 根本看不见它。
    </p>
    <p>
      不用自定义属性的代价同样清楚：要么放弃运行时切换，每换一次主题就重新编译一次 Sass；要么把品牌色硬编码进 JavaScript，让同一个色值在样式和脚本两处各维护一份，改一处忘一处。
    </p>

    <h2>直接手写CSS变量</h2>
    <p>
      最朴素的做法：干脆不用 Sass 变量，直接在样式里手写 CSS 变量。
    </p>
    <p>
      <code>:root { --brand: #c45125; } .button { background: var(--brand); }</code>
    </p>
    <p>
      这个方案做对了最关键的一件事：<strong>运行时体系是对的</strong>。浏览器认识 <code>var()</code>，变量能继承、能级联、能被 <code>element.style.setProperty</code> 覆盖，不需要重新编译，主题切换立刻生效。
    </p>

    <h2>色值双来源分叉</h2>
    <ul>
      <li>品牌色如今有两个来源：Sass 里的 <code>$brand</code> 和 CSS 里的 <code>#c45125</code>，改一处忘一处，色值悄悄分叉。</li>
      <li>设计令牌一多起来，把它们一个个手抄进 <code>:root</code> 既枯燥又容易抄错。</li>
      <li>想让 Sass 的计算结果——比如 <code>color.scale</code> 派生出的深色——也变成运行时变量，纯手写 CSS 根本表达不了这层计算。</li>
    </ul>

    <h2>插值写入自定义属性</h2>
    <p>
      关键的一步是让 Sass 去「写」这些自定义属性。但要注意一个坑：自定义属性的值在 Sass 眼里是<strong>任意 CSS 文本</strong>，默认会原样输出，不会替你求值。所以写 Sass 值进去时必须用插值 <code>#{$brand}</code>，把它显式地求出来：
    </p>
    <p>
      <code>:root { --brand: #{$brand}; } .button { background: var(--brand); color: var(--brand); }</code>
    </p>
    <p>
      这样品牌色只有一个来源 <code>$brand</code>，编译后自动落到 <code>:root</code>，而浏览器仍然可以在运行时改写它。派生色同理——先算出来，再插值进变量。
    </p>
    <p>
      第二个坑来自字符串。如果被插值的值是带引号的字符串（最典型的是字体栈 <code>"Inter", sans-serif</code>），插值会<strong>把引号剥掉</strong>，得到没有引号的 <code>Inter, sans-serif</code>，声明可能因此失效。这时用 <code>meta.inspect()</code> 保留它的字面表示：
    </p>
    <p>
      <code>--font-stack: #{meta.inspect($font-stack)};</code>
    </p>
    <p>
      接着理清运行时那一侧：浏览器通过级联、继承或脚本改变量值。在 <code>:root</code> 上声明的是<strong>全局默认值</strong>；在组件作用域内重声明同名变量，就能做<strong>局部主题覆盖</strong>，不必牵动全局。主题切换只改值、不需要重新编译 Sass，这正是把令牌写进自定义属性的意义。
    </p>
    <div class="lesson-box hint">
      <strong>两个容易忽略的细节：</strong>自定义属性名<strong>大小写敏感</strong>，<code>--Main</code> 与 <code>--main</code> 是两个不同的变量；此外，插值通常会移除字符串引号，凡是依赖引号的声明都要用 <code>meta.inspect</code> 兜底。
    </div>
    <p>
      回到最初那个问题，整条链路其实已经把它回答了：Sass 变量在编译期被求值后就从产物里消失，它根本进不了浏览器的运行时环境；而自定义属性的值会被原样保留进 CSS，所以必须由你亲手用插值把 Sass 的结果写进去。分不清这两者，就会一次次写出 <code>--brand: $brand;</code> 这种「看着对、编译后无效」的声明。
    </p>
    <p>
      最后别忘验证：用浏览器开发者工具查看该自定义属性在运行时的<strong>最终值</strong>——它经过级联与覆盖之后是什么，只有元素检查器能告诉你，编译产物里看到的只是初始值。
    </p>

    <h2>改色免重新编译</h2>
    <figure class="lesson-figure">
      <figcaption>切换运行时品牌色，看背景与文字如何随变量实时变化，全程不重新编译。</figcaption>
      <SC15CustomProperties />
    </figure>

    <h2>编译期与运行时接力</h2>
    <p>
      Sass 变量和 CSS 自定义属性各守一段：前者在编译期定义令牌、参与计算，后者在运行时承载主题、参与级联。让两者接力的方式就是插值——把 Sass 值显式写进自定义属性；遇到带引号的字符串再用 <code>meta.inspect</code> 保住表示。分清「编译期常量」与「运行时变量」，这套协作才不会互相打架。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CSS 自定义属性」</span>是运行时可读写的 CSS 变量，参与级联与继承、能被脚本覆盖，而 Sass 变量只存在于编译期。把 Sass 值写进自定义属性必须用插值 <code>#{$brand}</code>；带引号字符串要用 <code>meta.inspect()</code> 保留引号，否则会被剥掉导致声明失效。变量名大小写敏感，主题切换只改值、无需重新编译。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
