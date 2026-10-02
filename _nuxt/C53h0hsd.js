const n=`<script setup lang="ts">
import SC16Diagnostics from './SC16Diagnostics.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个本该填 1-8 的参数被人传了 0，页面的圆角悄悄变成了负数、整块直接消失，构建却一路绿灯——样式明明出错了，编译器为什么一声不吭？
    </div>

    <h2>编译期静默风险</h2>
    <p>
      Sass 是一门编译语言，但「编译通过」从来不等于「结果正确」。一个越界的参数、一个拼错的 map 键、一个被插值成了字符串的单位，都可能让编译照常完成，产物却处处是坑。编译器的默认态度是：只要语法没错，它就把你的意思原样翻译出去。
    </p>
    <p>
      问题在于，这些错误在编译期其实<strong>是有机会被发现</strong>的——只要你在公共函数和 Mixin 的入口主动做一次断言。可一旦你什么都不检查，Sass 就会沉默地把错值编译进去，把发现问题的时刻一路推迟到视觉回归、甚至线上。
    </p>
    <p>
      这中间的成本落差极大：报错从「构建失败时的一行提示」变成「回归测试里的一处样式异常」，定位时间从几秒变成几小时。你需要的不是更聪明的大脑去记所有约束，而是一套让编译器替你表达的反馈机制。
    </p>

    <h2>人工核验最终产物</h2>
    <p>
      最朴素的做法：靠肉眼检查、靠截图比对、靠人脑记住每个参数该是什么范围。
    </p>
    <p>
      这个方案做对了一件事：<strong>最终产物确实是唯一标准</strong>。样式对不对，最后仍要由视觉回归说了算，任何工具都替代不了亲眼看一遍。承认这一点，才不会把诊断工具误当成质量保证的全部。
    </p>

    <h2>非法值静默生效</h2>
    <ul>
      <li>参数越界不会报错，只会在产物里悄悄生效，圆角变负数、间距变负值，没人当场拦下。</li>
      <li>map 里取不到的键可能返回 <code>null</code>，插值进属性后产出非法声明，编译却照样通过。</li>
      <li>弃用语法（如旧的全局颜色函数、斜杠除法）能编译成功，却会在未来版本里失效，风险被一路累积到升级那天。</li>
      <li>问题总是发现在最晚、最贵的环节——线上或视觉回归，而不是编译期。</li>
    </ul>

    <h2>三档诊断反馈</h2>
    <p>
      不推翻「人要看产物」，而是让编译器<strong>分级地替你开口</strong>。Sass 提供三档反馈，从提示到熔断，正好对应问题的严重程度：
    </p>
    <ol class="lesson-steps">
      <li><code>@debug</code> 输出开发期诊断值，在编译命令行可见，用来打印生成进度、值的类型——面向排查，不影响构建。</li>
      <li><code>@warn</code> 报告「可以继续但有隐患」的问题，比如参数超出预期范围：构建照常完成，但日志里留下一条警告。</li>
      <li><code>@error</code> 直接中断编译，阻止非法样式上线——用于公共 API 的硬约束，也就是绝不允许发生的情况。</li>
    </ol>
    <p>把这三档用在 Mixin 的入口做参数校验，最典型的写法是这样：</p>
    <p>
      <code>@mixin radius($r) { @if $r &lt; 0 { @error "圆角不能为负： #{$r}"; } @else if $r &gt; 40px { @warn "圆角超出常规范围： #{$r}"; } border-radius: $r; }</code>
    </p>
    <p>
      越界的硬错误当场熔断，可疑的软问题留下警告。这样问题就在<strong>编译期</strong>暴露，而不是等到样式静默出错才被人发现——关键是把 <code>@warn</code> 与 <code>@error</code> 放在公共 API 的入口，而不是散落在业务的每一行里。
    </p>
    <p>
      还有一半是「持续摆脱旧语法」。编译器在遇到弃用写法时会给出<strong>弃用警告（deprecation warning）</strong>，明确指出哪一行、该换成什么；依据它运行 <code>Sass Migrator</code> 工具，就能完成机械、成批的迁移。至于门禁，把<strong>弃用警告视为错误</strong>写进 CI，新语法问题就再也无法悄然混进主分支。
    </p>
    <div class="lesson-box warn">
      <strong>别制造噪声：</strong><code>@debug</code> 的输出会在构建日志里不断累积，排查完成后要及时移除，否则真正重要的警告会被淹没；也不要在正常构建流程中留下高噪声的 debug 语句。另外，自动迁移后仍要跑一遍视觉回归并检查 CSS 体积，工具只负责改语法，不负责替你判断样式是否等价。
    </div>

    <h2>导入迁移进度换算</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块，看遗留的 <code>@import</code> 用法如何换算成「待迁移」与「已模块化」的比例。</figcaption>
      <SC16Diagnostics />
    </figure>

    <h2>约束交给编译器</h2>
    <p>
      诊断的本质是让编译器替你把约束讲出来：<code>@debug</code> 给排查用的提示，<code>@warn</code> 标记可继续但有隐患的情况，<code>@error</code> 在非法时直接熔断。再配合弃用警告与 Sass Migrator 的分批迁移、以及 CI 里「警告即错误」的门禁，Sass 代码才能在出错时快速失败、并持续摆脱过时语法。
    </p>
    <div class="lesson-term">
      <span class="term-name">「分级反馈」</span>指 Sass 的三档诊断指令：<code>@debug</code> 输出开发期诊断值（命令行可见），<code>@warn</code> 报告可继续但有隐患的问题（如参数超范围），<code>@error</code> 直接中断编译阻止非法样式上线。它们常被放在公共函数与 Mixin 的入口做参数校验；再配合弃用警告、<code>Sass Migrator</code> 迁移与 CI 的「警告即错误」门禁，让问题在编译期而非线上暴露。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
