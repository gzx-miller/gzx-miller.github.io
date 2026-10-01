<script setup lang="ts">
import TW24Preset from './TW24Preset.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>公司三条产品线各写了一份 Tailwind 配置，本来说好都用同一套品牌色；半年后品牌色微调，我改了三遍——而且三份配置里同名的颜色，值还悄悄不一样了。
    </div>

    <h2>跨项目共享视觉规范</h2>
    <p>
      你所在团队有好几个项目共用一套视觉规范：主品牌色、中性灰阶、正文字体、等宽字体、几个特殊的间距和圆角，还有两个入场动画。规范本身是统一的，但落地时是「每个项目在自己的配置文件里各写一份」。起初三份内容一模一样，看起来也没问题。
    </p>
    <p>
      随着时间推移，问题开始显现：某个项目为了赶进度临时调了一个色值，另一个项目加了一个自己才用的字重，第三份配置还停留在半年前。等设计真要统一改品牌色时，你发现自己面对的不是一套设计系统，而是三份<strong>已经产生漂移、并且互相不知道对方存在</strong>的配置。这时要问的是：规范应该以什么形态存在，才能被多个项目共享而不是复制。
    </p>

    <h2>各项目独立配置</h2>
    <p>
      最省事的做法就是复制——把一份配置拷到每个项目里，需要改就各自改。它带来的好处很实在：<strong>项目之间彼此独立</strong>，某个项目想临时试验一个色值，不会影响别人，改动范围完全可控。
    </p>
    <p>
      对单个项目来说，这份方案几乎没有学习成本。问题出在「多个项目」这个前提上：复制的不是规范，而是规范的<strong>一次快照</strong>，快照之间不会自动同步。真正的设计系统需要的是单一事实来源，而不是若干份随时可能分叉的副本。
    </p>

    <h2>规范漂移与升级成本</h2>
    <ul>
      <li>规范漂移：三份配置各自演进，同名令牌的值慢慢不一致，界面开始「长得像但不一样」。</li>
      <li>升级困难：统一调整一次品牌色，要在每个仓库里手动改一遍，改漏一处就埋了隐患。</li>
      <li>令牌重复维护：字体栈、间距、圆角这些公共部分被抄了三份，任何一处修改都要重复三次。</li>
      <li>项目特有的值容易混进公共配置，久了没人说得清哪些是规范、哪些是某个项目的一次性妥协。</li>
      <li>动画这类需要 <code>@keyframes</code> 的令牌，复制时最容易漏掉一半，出现「类名在但动画不动」。</li>
    </ul>

    <h2>公共令牌抽取复用</h2>
    <p>
      思路是把公共令牌抽成一个<strong>可复用的共享单元</strong>，项目只引用它、再覆盖差异。在 v4 的 CSS-first 体系里，推荐的做法是写成一份带 <code>@theme</code> 的共享 CSS 文件：里面用带命名空间的变量定义设计令牌（<code>--color-*</code>、<code>--font-*</code>、<code>--spacing-*</code>、<code>--radius-*</code>、<code>--animate-*</code> 等），项目通过 <code>@import</code> 引入即可，编译器据此生成对应的工具类。
    </p>
    <p>
      如果项目仍在用旧式的 JavaScript 配置，则把 <code>theme</code> 抽成一个<strong>预设对象</strong>，经 <code>presets</code> 数组引入。预设同样可以包含自定义插件。这样一套令牌被「引用」而不是「复制」，改一处、所有项目同步受益。把它发布成 npm 包，还能用语义化版本做版本化迭代——需要尝鲜的项目升版本，需要稳定的项目锁版本。
    </p>
    <div class="lesson-box hint">
      <strong>项目层只写差异：</strong>项目自己的配置里只 <code>extend</code> 需要新增或覆盖的令牌，例如加一个项目特有的强调色。公共规范与局部个性并存，既不会污染全局，也不会为了一个特殊值把整套令牌又抄一遍。
    </div>
    <p>
      有几条约定必须记住。第一，<strong>v4 默认不再自动读取 <code>tailwind.config.js</code></strong>，遗留的 JS 配置必须在 CSS 里用 <code>@config</code> 显式加载，否则预设不会被应用。第二，CSS-first 下更推荐把设计系统写成一份共用 CSS 再 <code>@import</code>，而不是拆成多份独立 JS 配置——单一入口更容易维护。第三，预设可以嵌套与组合，令牌应由设计与开发<strong>共同定义</strong>，并配合语义化版本发布。
    </p>
    <p>
      最后一个容易踩的坑与构建有关：共享主题文件在构建时是被<strong>静态内联</strong>进最终产物的。所以改造完成后，务必复核产物里的变量值确实变成了新的——不要只看源码里引对了没有。
    </p>
    <ol class="lesson-steps">
      <li>把设计令牌从项目样式提炼为独立共享文件（CSS 的 <code>@theme</code> 文件，或 JS 的 preset 对象）。</li>
      <li>在项目里 <code>@import</code> 该主题 CSS，或经 <code>presets</code> 数组引入；需要时发布成 npm 包做版本化迭代。</li>
      <li>项目层只覆盖或扩展差异项，保持全局一致与局部个性并存。</li>
      <li>在项目中覆盖一个令牌值，验证派生工具类随之变化。</li>
    </ol>

    <h2>一套令牌多套主题</h2>
    <figure class="lesson-figure">
      <figcaption>切换「颜色」「令牌」「预设」三个页签，看同一套令牌如何驱动多套主题配置。</figcaption>
      <TW24Preset />
    </figure>

    <h2>配置形态与共享能力</h2>
    <p>
      设计系统的落地形态，决定了它能被共享还是只能被复制。把颜色、字体、间距、圆角、动画抽成一份共享配置——v4 用带 <code>@theme</code> 的 CSS 文件与 <code>@import</code>，旧式配置用 preset 与 <code>presets</code>——项目只补差异。记住 v4 要经 <code>@config</code> 加载遗留 JS 配置，以及共享主题在构建时会被内联，改完要复核产物。
    </p>
    <div class="lesson-term">
      <span class="term-name">「主题预设与共享令牌」</span>指把设计令牌抽成可跨项目复用的单一来源：v4 推荐写成带 <code>@theme</code> 的共享 CSS 并用 <code>@import</code> 引入；旧式 JavaScript 配置则把 <code>theme</code> 抽成 preset 对象，经 <code>presets</code> 数组引用（须由 <code>@config</code> 加载）。预设可嵌套、可含插件，项目层只 <code>extend</code> 差异项，从而在保持全局一致的同时允许局部个性。
    </div>
  </LessonArticle>
</template>
