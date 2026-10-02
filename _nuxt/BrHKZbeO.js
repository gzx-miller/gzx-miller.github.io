const e=`<script setup lang="ts">
import SC09ValuesUnits from './SC09ValuesUnits.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>写下 <code>$gap: 100px + 1rem</code> 编译顺利通过，换成 <code>$dur: 100px + 1s</code> 却直接报错——同样是「数字加数字」，凭什么一个能算、一个不能？
    </div>

    <h2>数值携带单位</h2>
    <p>
      你在维护一套组件的间距系统，希望把设计稿的像素值和代码里的 rem 值统一成变量管理。于是这边写 <code>$space: 1rem</code>，那边写 <code>$radius: 8px</code>，心里把它们都当成「数字」——反正都要参与加减乘除。直到某天编译器用一行红字拦住了你。
    </p>
    <p>
      真正的问题不在运算符，而在「数字」这个词本身。<strong>Sass 眼里的数字不是裸露的量，而是「数值 + 单位」的组合</strong>，单位决定了这个数字属于哪个维度。搞不清这套规则，你会反复遇到两种相反的事故：明明该能加的却报错，明明该报错的却被悄悄绕过。
    </p>

    <h2>装饰性单位假设</h2>
    <p>
      最省事的假设是：Sass 的数字就是普通数字，单位只是贴在后面的装饰，运算时把数值算完、再随手拼个单位即可。这个假设确实对了一半——<strong>它承认了「值可以参与运算」</strong>。这正是 Sass 相对纯 CSS 的优势：设计常量能在编译期合并、推导，而不是靠人肉誊抄。
    </p>
    <p>
      只靠人工纪律也一样能撑住：所有间距都只用 px，所有字号都只用 rem，谁也不跟谁混着算。在短小的样式表里，这条约定能管用很久。
    </p>

    <h2>单位参与运算</h2>
    <ul>
      <li>如果单位只是装饰，<code>100px + 1s</code> 就该算成 <code>101</code>，可它偏偏报错——说明单位真的参与检查。</li>
      <li>如果数字只有一种类型，<code>10px * 0</code> 应当得到一个裸的 <code>0</code>，结果却仍带着单位。</li>
      <li>颜色、字符串与数字混在一起时会静默出错，说明不同类型之间的运算规则并不一致。</li>
      <li>用 <code>#{}</code> 把值拼成字符串能绕过检查，但换来的是无法再参与计算的死值。</li>
      <li>「只用 px」「只用 rem」的纪律一放进团队协作就会松动，没人能靠自觉守住全局。</li>
    </ul>

    <h2>Sass值类型系统</h2>
    <p>
      放弃「Sass 数字就是数字」这个假设，改成<strong>Sass 有一套带类型的值系统</strong>。每个值都归属一个类型：数字、字符串、颜色、布尔、<code>null</code>、List、Map，各自有各自的运算规则；而数字额外携带单位，参与运算时执行<strong>单位代数</strong>。不确定一个表达式实际是什么类型，就用 <code>meta.type-of</code> 直接问它：
    </p>
    <ul>
      <li><code>meta.type-of(1rem)</code> → <code>number</code></li>
      <li><code>meta.type-of(#e85d04)</code> → <code>color</code></li>
      <li><code>meta.type-of((a: 1))</code> → <code>map</code></li>
    </ul>
    <p>
      单位代数的核心是<strong>维度</strong>。<code>px</code> 与 <code>rem</code> 同属长度维度，<code>100px + 1rem</code> 可以换算到同一维度再相加（按浏览器默认根字号 16px 计，合 <code>116px</code>）；而 <code>px</code> 是长度、<code>s</code> 是时间，维度不同，相加没有意义，于是 Sass 在<strong>编译期</strong>就直接报错，而不是拖到运行时才暴露错位。
    </p>
    <p>
      单位还有一组守恒规则要记住。乘除会把单位组合或消去：<code>2 * 3px</code> 得 <code>6px</code>，<code>6px / 2px</code> 得无单位的 <code>3</code>；而<strong>零也可能携带单位</strong>——<code>10px * 0</code> 的结果仍是带单位的零，不是裸的 <code>0</code>。如果你依赖「结果无单位」去做后续判断，这里就会踩空。
    </p>
    <p>
      更进一步，别等报错才反应，而是<strong>在算之前先验证</strong>。<code>math.compatible($a, $b)</code> 能判断两个单位是否可换算，配合 <code>@error</code> 断言，把「不可加」拦在编译期。真要排查类型与单位问题时，<code>meta.inspect</code> 会打印值的字面表示，把它放进 <code>@debug</code> 里看一眼，比盯着代码猜快得多。
    </p>
    <div class="lesson-box warn">
      <strong>不要用 <code>#{}</code> 绕过本应失败的单位检查。</strong>一旦把不兼容的运算强行拼成字符串，错误就被藏进了产物里，你得到一个既无法再计算、也无法维护的死值。要让问题在编译期暴露，就得让它照常报错。
    </div>

    <h2>跨单位长度换算</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块改变 rem 值，观察 px 与 rem 如何在同一长度维度上换算。</figcaption>
      <SC09ValuesUnits />
    </figure>

    <h2>编译期类型校验</h2>
    <p>
      Sass 的值系统把「类型」和「单位」都变成编译期能检查的东西：同维度单位自动换算，异维度运算直接失败，零也保留单位。理解了单位代数，你就能区分「真的能算」和「只是看起来能算」，把维度错误挡在构建阶段。
    </p>
    <div class="lesson-term">
      <span class="term-name">「单位代数」</span>Sass 的数字由「数值 + 单位」组成，运算时按维度规则处理：同维度单位（如 <code>px</code> 与 <code>rem</code>）可换算相加，长度加时间这类异维度运算会在<strong>编译期</strong>报错；乘除会组合或消去单位，而 <code>10px * 0</code> 仍带单位。用 <code>meta.type-of</code> 查类型、<code>math.compatible</code> 验单位、<code>meta.inspect</code> 排查实际值，且不要用 <code>#{}</code> 绕过检查。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
