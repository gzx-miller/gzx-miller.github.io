const n=`<script setup lang="ts">
import SC12Configuration from './SC12Configuration.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>在入口写下 <code>@use "library" with ($radius: 20px)</code>，编译器却报错说这个模块已经被加载过、配置不生效——你明明只写了一处 <code>with</code>，到底是谁先加载了它？
    </div>

    <h2>样式库定制入口</h2>
    <p>
      你把公司的一整套按钮、表单、提示样式打包成内部样式库，希望使用方既不必改库源码，又能把它调成自己品牌的圆角、前缀和主色。这就是「可配置」的诉求：<strong>库要暴露少量开关，同时保护内部实现不被随意破坏</strong>。
    </p>
    <p>
      难点在于，Sass 的模块是<strong>只加载一次</strong>的。谁先加载、在哪加载、配置在哪个时刻生效，直接决定了这套定制机制能不能成立。搞不清加载顺序，就会出现「配置写了却报错」这种看起来毫无道理的失败。
    </p>

    <h2>缺省与全局变量</h2>
    <p>
      最朴素的做法是不给默认值，让使用方必须传；或者干脆把变量做成全局变量，谁都能改。前者让库变得难用——只想改圆角的人也得把所有变量填一遍；后者则回到 <code>@import</code> 时代的全局污染，任何一处赋值都可能影响别处的输出。
    </p>
    <p>
      这个方向想对了一件事：<strong>可复用的库需要留出定制入口</strong>，而不是要求使用方 fork 一份源码去改。问题只是入口的形态没选对。
    </p>

    <h2>全量配置暴露实现</h2>
    <ul>
      <li>把所有内部变量都做成配置项，等于把实现细节全部暴露，内部一改结构，所有使用方都要跟着改。</li>
      <li>全局变量没有作用域边界，一处赋值影响全局，很难追溯到底是哪次覆盖生效。</li>
      <li><code>with</code> 配置必须唯一，且必须发生在任何其他加载之前；一旦模块先被别的文件 <code>@use</code> 过，这里就会被忽略并报错。</li>
      <li>配置在首次加载时就冻结，之后不能二次修改，把它当成运行时主题开关会直接失败。</li>
      <li>复杂配置（比如按主题分别给一批值）用 <code>with</code> 表达起来很笨重。</li>
    </ul>

    <h2>可覆盖缺省值</h2>
    <p>
      不推翻「留出定制入口」，而是让入口<strong>有默认、有边界、且只在加载时生效一次</strong>。模块用 <code>!default</code> 声明「可被覆盖」的顶层变量：如果变量已经有值就保留原值，否则赋默认值。使用方在<strong>首次</strong> <code>@use</code> 的 <code>with</code> 子句里传值，即完成定制。
    </p>
    <p>
      一个样式库通常只暴露少量开关，下面这几项就是典型的可配置项：
    </p>
    <table>
      <thead>
        <tr><th>配置项</th><th>类型</th><th>默认值</th><th>作用</th></tr>
      </thead>
      <tbody>
        <tr><td><code>$prefix</code></td><td>string</td><td><code>"app"</code></td><td>生成类名的前缀</td></tr>
        <tr><td><code>$radius</code></td><td>number</td><td><code>12px</code></td><td>按钮与卡片的圆角</td></tr>
        <tr><td><code>$brand</code></td><td>color</td><td><code>#e85d04</code></td><td>主色令牌，供派生使用</td></tr>
        <tr><td><code>$density</code></td><td>number</td><td><code>1</code></td><td>尺寸缩放系数</td></tr>
      </tbody>
    </table>
    <p>
      实现顺序可以这样安排：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>!default</code> 为可配置的顶层变量提供默认值。</li>
      <li>在应用入口<strong>首次</strong> <code>@use</code> 的 <code>with</code> 子句传入配置。</li>
      <li>让配置驱动选择器前缀或令牌，产出期望的样式。</li>
      <li>把所有可配置项写成文档表格，说明类型、默认值与影响范围，方便使用者对照。</li>
    </ol>
    <p>
      回头看开场的报错就清楚了：<code>with</code> 之所以「被忽略」，几乎总是因为该模块在此处之前就已经被别的文件加载过。<strong>模块只有第一次加载时能配置</strong>，第二次想改已经晚了。排查这类问题时，要顺着整个依赖链检查加载顺序，看是谁抢先把它引入了。
    </p>
    <div class="lesson-box warn">
      <strong>三条边界：</strong>不要把所有内部变量都做成配置项，只暴露真正需要定制的少数开关；配置在首次 <code>@use</code> 的 <code>with</code> 中确定后<strong>无法二次修改</strong>，需要运行时切换的主题应交给 CSS 自定义属性；遇到 <code>with</code> 传值失败，优先检查依赖链里是否有更早的加载。
    </div>

    <h2>with配置即时生效</h2>
    <figure class="lesson-figure">
      <figcaption>改一改前缀与圆角，看 <code>with</code> 传进去的配置如何直接改变生成的样式。</figcaption>
      <SC12Configuration />
    </figure>

    <h2>配置一次即冻结</h2>
    <p>
      <code>!default</code> 与 <code>with</code> 共同回答了「库怎么既让使用方定制、又守住内部实现」：库用 <code>!default</code> 给出可覆盖的默认值，使用方在首次 <code>@use</code> 时传配置，配置一次冻结、只此一回。理解「模块只加载一次」这条规则，配置失败的原因就一目了然。
    </p>
    <div class="lesson-term">
      <span class="term-name">「!default 与 with」</span><code>!default</code> 为顶层变量声明「可被覆盖」的默认值：变量已有值则保留，否则取默认值。使用方在<strong>首次</strong> <code>@use</code> 的 <code>with</code> 子句中传值完成定制。由于模块<strong>只加载一次</strong>且配置在首次加载时冻结，同一模块的配置必须唯一、且必须发生在任何其他加载之前，否则会被忽略并报错；运行时可变主题应改用 CSS 自定义属性。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
