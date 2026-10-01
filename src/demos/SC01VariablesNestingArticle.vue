<script setup lang="ts">
import SC01VariablesNesting from './SC01VariablesNesting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>设计稿换了一版主色，我在三个样式文件里逐个替换颜色值，唯独漏掉某处 <code>:hover</code> 的描边——直到上线后才被用户截图指出来。为什么改一个颜色，要冒这么大的风险？
    </div>

    <h2>重复定义之痛</h2>
    <p>
      课程卡这个组件你一眼就能写完：主色、圆角、内边距、悬浮态的阴影。问题从来不在写得对不对，而在<strong>同一个值会被写第二遍、第三遍</strong>。卡片本身用主色，卡片上的按钮用主色，卡片标题在深色模式下还是同一种暖橙。只要这个值不是「只有一处定义」，它就必然拥有几条会各自漂移的副本。
    </p>
    <p>
      代价非常具体：一次主题调整要翻若干个文件、改若干处位置，而漏改的地方<strong>不会有任何报错</strong>——它依然是一个合法颜色，只是不再属于这套设计。样式代码里最贵的从来不是写，而是「改的时候你得知道有哪些地方在引用它」。变量要解决的正是这件事：把「值」和「用值的地方」解耦。
    </p>

    <h2>自定义属性收纳</h2>
    <p>
      不引入 Sass，最朴素的做法是 CSS 自定义属性：在 <code>:root</code> 上声明 <code>--accent: #c45125</code> 与 <code>--radius: 12px</code>，需要的地方写 <code>var(--accent)</code> 与 <code>border-radius: var(--radius)</code>。
    </p>
    <p>
      这个方案确实做对了一件关键的事：<strong>它真的把值收敛到了一处</strong>。改一次 <code>:root</code>，整站跟着变；而且它还带着 Sass 变量没有的好处——自定义属性是运行时概念，参与级联与继承，JavaScript 可以在浏览器里直接改写它，做「一键换肤」格外顺手。只要你的需求是「运行时能变的主题值」，这条路就是正解。
    </p>

    <h2>运行时求值特性</h2>
    <ul>
      <li>自定义属性由浏览器在<strong>运行时</strong>求值，编译期拿不到它的值。想写类似 <code>math.div(var(--gap), 2)</code> 的计算，行不通。</li>
      <li>它不能参与生成结构。你没法用它拼出一段选择器名或属性名，因为插值发生在编译期，而它那时还不存在。</li>
      <li>它没有「私有」的概念。<code>--accent</code> 与 <code>--accent-hover</code> 摊在同一个全局命名空间里，谁都能覆盖谁，拼错一个字母只是静默失效，不会中断构建。</li>
      <li>它带不了逻辑。像「深色模式下自动换一整套派生色」这种编译期就该定下来的分支，它给不了 <code>@if</code>。</li>
      <li>反过来也成立：Sass 变量做不了运行时主题切换，它编译完就消失了，产物里只剩字面量。两者是两种东西，谁也替代不了谁。</li>
    </ul>

    <h2>两类值分工</h2>
    <p>
      于是把「值」拆成两类。<strong>编译期就定下来的设计常量</strong>——品牌色、圆角、间距基准——用 Sass 变量 <code>$accent: #c45125</code>、<code>$radius: 12px</code> 写在令牌文件顶层；<strong>运行时才切换的主题值</strong>仍旧留给 CSS 自定义属性。这条分界线是本节最要紧的一句话。
    </p>
    <p>
      Sass 变量在编译期求值，并遵守词法作用域：变量只在声明它的嵌套块内可见，内层同名变量会<strong>遮蔽</strong>外层，离开这个块就恢复成外层的值。这让「局部覆盖」变得可靠——组件内部可以把 <code>$radius</code> 临时收紧成小圆角，而完全不影响别处。需要让某个变量能被外部定制时，用 <code>!default</code> 声明默认值：已有值就保留原值，没有值才赋值。<code>!global</code> 会把局部赋值提升到全局作用域，属于主动打开作用域边界的操作，除非明确知道后果，否则不要用。
    </p>
    <p>
      值收敛之后，第二个问题是结构：选择器怎么写才不重复。Sass 用嵌套把父子上下文并在一处书写，<code>&amp;</code> 代表当前外层选择器，于是子元素与状态能够贴着写。推荐的落地顺序是：
    </p>
    <ol class="lesson-steps">
      <li>先在顶层令牌文件里提取稳定的颜色与圆角变量。</li>
      <li>组件内用 <code>&amp;__title</code>、<code>&amp;__desc</code> 表达子元素，用 <code>&amp;:hover</code>、<code>&amp;:focus-visible</code> 表达状态与伪类。</li>
      <li>运行时才切换的主题值单独交给 CSS 自定义属性，不混进这一层。</li>
      <li>编译后复查产物的选择器长度与嵌套深度，而不是只看源文件缩进好不好看。</li>
    </ol>
    <p>
      这里有一个最容易踩的坑：<strong>嵌套只是书写形式，编译产物依旧是普通的后代选择器</strong>。你按完整 DOM 树逐层缩进写出的 <code>.page .main .list .item .title</code>，真的会生成一条五层后代选择器——越长越难覆盖、特异性越高、与 DOM 结构耦合越紧，结构一调整就牵一发而动全身。因此嵌套建议<strong>控制在三层以内</strong>；再深就该改用独立类名，或用 <code>@at-root</code> 把结构拉平，而不是继续往里缩进。
    </p>
    <div class="lesson-box warn">
      <strong>别把两种变量混为一谈：</strong>Sass 变量是编译期常量，改了必须重新构建，浏览器运行时不会更新；CSS 自定义属性是可被脚本改写的运行时值，却不能参与编译期计算与选择器生成。主题切换用后者，设计常量与编译期计算用前者。
    </div>

    <h2>变量作用辐射</h2>
    <figure class="lesson-figure">
      <figcaption>拖动主题色与圆角，看一个变量如何从单点定义辐射到整张卡片。</figcaption>
      <SC01VariablesNesting />
    </figure>

    <h2>工具边界各异</h2>
    <p>
      变量解决的是「同一个值只该定义一次」，嵌套解决的是「同一个组件的关系该写在一起」，而两者都有边界：变量只活在编译期，嵌套只该浅。把边界守住，样式代码就从「一改就漏」变成「一改全对」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「编译期变量」</span>指 Sass 的 <code>$name</code>：它在编译时求值并替换为字面量，遵守词法作用域，内层同名变量会遮蔽外层，<code>!default</code> 允许外部覆盖，<code>!global</code> 会把赋值提升到全局作用域（慎用）。它无法在浏览器运行时更新，需要运行时切换的主题值请交给 CSS 自定义属性。嵌套把父子上下文合并书写，但产物仍是后代选择器，深度控制在三层以内，更深的层级改用独立类名或 <code>@at-root</code> 拉平。
    </div>
  </LessonArticle>
</template>
