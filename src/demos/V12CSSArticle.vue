<script setup lang="ts">
import V12CSS from './V12CSS.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只在登录按钮的样式里写了 <code>.btn { border-radius: 8px }</code>，本意是只改那一个按钮；结果整个站点里所有用 <code>.btn</code> 的按钮全变了圆角——你改的是「一个组件」，却动了「一份全局规则」。
    </div>

    <h2>提出问题</h2>
    <p>
      样式里有三种反复出现的诉求：<strong>把品牌色、间距收进变量</strong>，改一处生效全局；<strong>用嵌套写清层级</strong>，不再手写一长串选择器；<strong>让组件之间互不污染</strong>，一个按钮的改动不牵连别人。可惜浏览器早年对这三种诉求都不给支持——CSS 里没有变量也没有嵌套，而「隔离」只能靠人肉约定命名前缀。
    </p>
    <p>
      于是需要引入一条<strong>「样式编译管线」</strong>：源码里写「给人看的样式」，经过一串转换，输出「浏览器认识、兼容各版本、类名已隔离」的 CSS。旧办法要人承担的成本很明确：每个兼容前缀都得手写一遍；变量要在每个文件里手动 import；类名全靠自觉，谁写错了前缀谁就制造全局污染。
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的入口是 <strong>PostCSS</strong>：它本身不处理任何语法，只负责「把 CSS 喂给一串插件、再把插件处理过的 CSS 吐出来」。Vite 会自动读取项目根目录的 <code>postcss.config.js</code>（或 <code>vite.config.ts</code> 里的 <code>css.postcss</code>），把里面的插件链应用到<strong>所有</strong>样式上。例如挂上 <code>autoprefixer</code>，它会按目标浏览器自动补齐 <code>-webkit-</code>、<code>-moz-</code> 前缀。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「写给人看的 CSS」和「发给浏览器的 CSS」拆成了两步</strong>。你只管写，兼容与生成交给插件链。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>PostCSS 只认识 CSS。你在样式里写 <code>$brand</code>，或者写 <code>&amp;:hover</code> 这种嵌套语法，它既不认识，浏览器也不认识。</li>
      <li>变量想在组件之间共享，仍只能每个样式文件手动 import 一次，漏一个就报 <code>$brand is undefined</code>。</li>
      <li>类名依旧全局：登录页的 <code>.btn</code> 和后台的 <code>.btn</code> 会互相覆盖，正是开场那场「改一个按钮，全站变圆角」。</li>
      <li>若把实际样式（而不是变量）塞进 <code>additionalData</code>，它会被重复注入到每一个样式文件，产物里同一段规则出现几十遍。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      先补「预处理器」。装一个 <code>sass</code>，就能直接在 <code>&lt;style lang="scss"&gt;</code> 里写变量与嵌套，Vite 会自动把它编译成 CSS 再交给 PostCSS。注意这是一条<strong>两级管线</strong>：预处理器在前（Sass/Less 编译成 CSS），PostCSS 在后（普通 CSS 变成兼容 CSS）。也正因为 Vite 不内置编译器，预处理器必须自己安装，没装 <code>sass</code> 时写 <code>&lt;style lang="scss"&gt;</code> 会直接报错。
    </p>
    <p>
      再补「全局变量注入」。用 <code>css.preprocessorOptions.scss.additionalData</code> 在每个样式文件<strong>开头自动插入</strong>一行 <code>@use "@/styles/variables" as *;</code>，这样任何组件都能直接用 <code>$brand</code>，不必逐个 import。
    </p>
    <div class="lesson-box warn">
      <strong>一条硬边界：</strong><code>additionalData</code> 只该放<strong>变量与 mixin 定义</strong>。放实际样式会被重复输出到每个文件，产物凭空膨胀；要注入的是「定义」，不是「规则」。
    </div>
    <p>
      接着补「隔离」。组件级隔离其实 Vite 早就给了：<code>&lt;style scoped&gt;</code> 会为选择器附加唯一属性，天然把样式框在当前组件内，<strong>普通项目用它就够了，不必上 CSS Modules</strong>。只有当你要把类名当数据传给 JS、或需要更明确的局部命名时，才用 <code>&lt;style module&gt;</code>：样式在 <code>:class="$style.xxx"</code> 里引用，Vite 会生成 <code>[name]__[local]___[hash]</code> 形式的局部类名，全局绝不会撞车。
    </p>
    <p>
      最后补「可调试」。开发阶段打开 <code>css.devSourcemap</code>，浏览器 DevTools 里看到的样式就能直接定位回源码文件，而不是编译后的中间产物。另外，Tailwind 这类工具链<strong>走 PostCSS 接入即可</strong>，不需要再额外安装专门的 Vite 插件。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切 postcss / preprocessor / modules 三个页签：先看 PostCSS 插件链怎么写，再看 Sass 变量如何全局注入，最后看 CSS Modules 的类名是怎么被隔离的。</figcaption>
      <V12CSS />
    </figure>

    <h2>总结</h2>
    <p>
      样式这件事，Vite 给的是<strong>一条可插拔的编译管线</strong>：预处理器把 Sass/Less 变成 CSS，PostCSS 插件链再把 CSS 变成兼容可用的 CSS，而隔离则由 <code>scoped</code> 或 <code>module</code> 承担。你要做的判断很简单——<strong>变量与嵌套交给人写，兼容与隔离交给管线</strong>，别把实际样式塞进注入配置里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「PostCSS」</span>是一个用 JavaScript 插件转换 CSS 的工具：它本身不做任何事，能力全部来自插件链（<code>autoprefixer</code> 补齐前缀、<code>tailwindcss</code> 生成原子类等）。Vite 会自动读取 <code>postcss.config.js</code> 或 <code>css.postcss</code>，把插件链应用到所有样式。边界：它处理的是 CSS，<strong>不认识 Sass/Less 语法</strong>，所以预处理器必须排在它前面先编译；而 <code>additionalData</code> 只该放变量与 mixin，放规则会被重复输出。
    </div>
  </LessonArticle>
</template>
