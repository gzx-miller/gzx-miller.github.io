const o=`<script setup lang="ts">
import SC10Math from './SC10Math.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>算栅格列宽写下 <code>$col: 1000px / 3</code>，编译报错；改用 <code>math.div(1000px, 3)</code> 通过了，可换成百分比 <code>math.div(100%, 3)</code> 又不对——问题到底出在除法语法，还是百分比根本不能这么算？
    </div>

    <h2>栅格列宽计算</h2>
    <p>
      你要做一个可配置的栅格：容器 1000px、3 列、列间距 16px，理想的单列宽就是 <code>(1000px − 16px × 2) / 3</code>。你希望列数和间距都是变量，改一个数就能重算全部，于是很自然地把这条公式写进 Sass，盼着编译期就把结果算好。
    </p>
    <p>
      结果编译器先拦住了斜杠除法，改写成函数后，又被「百分比」这一项难住。这不只是语法问题——它逼你想清楚一件事：<strong>哪些数学是编译期就能算完的，哪些必须留给浏览器运行时</strong>。分不清这条界线，你要么算错，要么把本可静态计算的数字变成散落各处的魔法值。
    </p>

    <h2>手算写死数值</h2>
    <p>
      最朴素的两种办法：一是把结果手算出来写死，比如 <code>width: 322.666px</code>；二是凭直觉手写系数，既然整宽对应 100%，那三分之一列就是 <code>33.333%</code>。
    </p>
    <p>
      它们都做对了同一件事：<strong>把「列宽」当成一个可以被表达式描述的结果</strong>，而不是碰运气调出来的数。只要列数不变，两种写法都能跑起来。
    </p>

    <h2>参数变更数值失效</h2>
    <ul>
      <li>写死 <code>322.666px</code> 后，间距一改数字全废，容器尺寸一变更是无从下手。</li>
      <li>手写 <code>33.333%</code> 时忘了减去列间距，列与列直接挤在一起。</li>
      <li>斜杠除法语义已经弃用，<code>$a / $b</code> 现在不再稳定地代表除法，写法必须升级。</li>
      <li>百分比、<code>vw</code>、<code>env()</code>、<code>var()</code> 这些值在编译期根本不存在，Sass 无从计算。</li>
      <li>浮点结果不加处理就直接输出，会出现 <code>33.3333333333%</code> 这种长尾。</li>
    </ul>

    <h2>求值时机拆分</h2>
    <p>
      不推翻「用表达式算列宽」，而是按<strong>求值时机</strong>把计算拆成两半。第一半是编译期就确定的量——固定长度、纯数字，交给 <code>sass:math</code> 用明确的函数算清楚，其中除法统一写 <code>math.div</code>，不再用斜杠。第二半是依赖浏览器运行上下文的量——<code>100%</code>、<code>vw</code>、<code>env()</code>、<code>var()</code>，它们要等页面真正渲染时才知道值，Sass 不能也不该替它们求值，应当原样保留成 CSS <code>calc()</code> 表达式。
    </p>
    <p>
      这两半还能安全地混用：<strong><code>calc()</code> 里可以放 Sass 变量</strong>，编译时变量被替换成字面量，剩下的运算交给浏览器。而 <code>sass:math</code> 提供了一整套数字工具：<code>math.div</code> 做明确的除法、<code>math.pow</code> 求幂、<code>math.round</code> / <code>math.ceil</code> / <code>math.floor</code> 负责舍入、<code>math.min</code> / <code>math.max</code> 取最值、<code>math.compatible</code> 检查单位是否可换算。把魔法数字换成这些函数，公式的意图才真正留在代码里。
    </p>
    <p>
      落到栅格这个场景，可以按下面的顺序实现：
    </p>
    <ol class="lesson-steps">
      <li>在函数入口用 <code>@error</code> 校验输入约束，例如列数必须为正整数。</li>
      <li>用 <code>math.div</code> 执行明确的除法，替代已弃用的斜杠写法。</li>
      <li>编译期无法确定的部分（如百分比关系）保留成 <code>calc()</code>，交给浏览器求值。</li>
      <li>把常用换算沉淀成函数，避免在业务样式中散落魔法数字。</li>
    </ol>
    <p>
      举例来说，减去间距的部分是纯长度运算，可以在编译期算完；而「占容器几分之几」这种相对关系必须留在 <code>calc()</code> 中。把两者写在一起，Sass 负责前半段，浏览器负责后半段，各自的职责清晰分明，列数一改也不用重算任何系数。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的边界：</strong>浮点结果要依据 CSS 的真实需要决定是否舍入，别让长尾小数进入产物；百分比与单位的换算规则以 <code>sass:math</code> 文档为准，不要凭直觉手写转换系数——直觉算出来的数，往往就是布局在极端尺寸下错位的原因。
    </div>

    <h2>列宽随参数变化</h2>
    <figure class="lesson-figure">
      <figcaption>拖动列数与间距滑块，看单列宽度按 <code>math.div</code> 的公式如何变化。</figcaption>
      <SC10Math />
    </figure>

    <h2>编译与运行时分野</h2>
    <p>
      设计数学的可靠做法，是先分清「编译期算得出」和「只有运行时才算得出」。前者用 <code>sass:math</code> 明确求值，除法一律写 <code>math.div</code>；后者保留成 <code>calc()</code> 交给浏览器。把这条界线划清楚，公式既不会被写死，也不会在错误的地方求值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「sass:math」</span>是 Sass 的数字运算模块，提供 <code>math.div</code>（明确除法，替代已弃用的斜杠）、<code>math.pow</code>、<code>math.round</code> / <code>math.ceil</code> / <code>math.floor</code>、<code>math.min</code> / <code>math.max</code> 与单位检查 <code>math.compatible</code>。Sass 只能处理<strong>编译期已知</strong>的量，<code>100%</code>、<code>vw</code>、<code>env()</code>、<code>var()</code> 等运行时值应保留为 <code>calc()</code>，其中可混用 Sass 变量，编译后变量被替换为字面量。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
