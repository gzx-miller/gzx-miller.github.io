<script setup lang="ts">
import N20Modules from './N20Modules.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想在项目里用 Pinia，按以往在 Vue 里的经验，脑子里已经开始盘算 <code>app.use(createPinia())</code> 该写在哪。结果文档只说：往 <code>nuxt.config.ts</code> 的 <code>modules</code> 数组里加一行 <code>'@pinia/nuxt'</code> 就行。你照做了，store 竟然真的能用，连 <code>import</code> 都没写——这一行字符串，在构建的时候到底替你做了什么？
    </div>

    <h2>能力接入手工装配</h2>
    <p>
      给项目加一项能力（状态管理、图片优化、国际化），本质上都要做同一套「胶水」：装依赖、注册插件、配置自动导入的目录、往运行时的配置里塞值、必要时挂上构建钩子。换一个库，这套动作换汤不换药，但每一步的写法都不太一样。
    </p>
    <p>
      旧办法是<strong>每个项目各写一遍接线</strong>。成本有三。第一，<strong>重复且分散</strong>：加一个库就要改插件、改配置、改导入目录，散落在好几个文件里，新同事根本不知道哪些文件是「胶水」。第二，<strong>升级即返工</strong>：库的大版本改了接线方式，你得把每个用过它的项目挨个改一遍。第三，<strong>时序没人约束</strong>：接线代码什么时候执行、和其他库的初始化谁先谁后，全靠约定，很容易「本地能跑、构建报错」。
    </p>
    <p>
      于是问题落到：<strong>能不能把这套接线封装成一个可安装、可发布的包，让使用者只写一行配置？</strong>
    </p>

    <h2>一行安装接入方式</h2>
    <p>
      用 Nuxt 模块。先 <code>pnpm add</code> 装上模块依赖，再在 <code>nuxt.config.ts</code> 的 <code>modules</code> 数组里加一项（如 <code>'@pinia/nuxt'</code>）。模块的 <code>setup</code> 会在<strong>构建期</strong>执行，替你把插件、组件、自动导入这些接线登记好。
    </p>
    <p>
      这个方案做对了一件事：<strong>把「接线」从每个项目里提了出来，做成可复用、可发布的包</strong>。使用者只面对一个自己理解和信任的「一行配置」，剩下的事情交回给模块作者去维护和升级。
    </p>

    <h2>数组顺序隐式依赖</h2>
    <ul>
      <li>只写一行，顺序却没人管：<code>modules</code> 数组的顺序决定注册先后，两个有依赖关系的模块顺序颠倒了就会出错，而且是那种难复现的错。</li>
      <li>模块里既有构建期的部分（<code>setup</code>、<code>hook</code>），也有要随应用一起跑的部分（插件、composable、组件），全写在一个文件里，运行时代码会被搅进构建配置。</li>
      <li>使用者想改模块行为（比如换个组件前缀），没有统一入口，只能去改模块源码。</li>
      <li>生态里模块质量参差，选到一个维护不活跃的，某次升级 Nuxt 时它会最先出问题。</li>
    </ul>

    <h2>模块结构与配置入口</h2>
    <p>
      不推翻「一行安装」，而是把<strong>模块的结构、运行时代码的位置、配置入口与生态经验逐一理清</strong>。
    </p>
    <p>
      先写清模块结构。用 <code>defineNuxtModule</code> 声明模块的 <code>meta</code>（<code>name</code> 与 <code>configKey</code>）和 <code>defaults</code>，再写 <code>setup(options, nuxt)</code>——它只在<strong>构建期</strong>运行。在 <code>setup</code> 里用 <code>createResolver(import.meta.url)</code> 解析模块内的路径，然后通过 Kit API 扩展 Nuxt：用 <code>addPlugin</code> 注册插件，用 <code>nuxt.hook('imports:dirs', ...)</code> 把 composable 目录加进自动导入，还可以往 <code>nuxt.options.runtimeConfig</code> 里注入值。
    </p>
    <ol class="lesson-steps">
      <li>安装依赖，并在 <code>nuxt.config.ts</code> 的 <code>modules</code> 数组中按需排列注册顺序。</li>
      <li>模块的 <code>setup</code> 在构建期运行，通过 <code>addPlugin</code>、<code>addComponent</code>、<code>hook</code> 等 Kit API 扩展 Nuxt。</li>
      <li>把需要随应用运行的功能（插件、composable、组件）放进模块的 <code>runtime/</code> 目录。</li>
      <li>模块选项写在 <code>nuxt.config.ts</code> 中与模块 <code>configKey</code> 同名的配置项下。</li>
    </ol>
    <p>
      接着把「随应用运行」的代码分离出去。构建期的 <code>setup</code> 只负责<strong>登记</strong>，真正的运行时插件、composable 与组件放进模块的 <code>runtime/</code> 目录（例如 <code>src/runtime/plugin.ts</code>、<code>src/runtime/composables/</code>、<code>src/runtime/components/</code>）。分开之后，构建期不再背负运行时代码，职责也一目了然。
    </p>
    <p>
      再规范用户的配置入口。模块把选项读成 <code>configKey</code> 同名的键：若 <code>configKey</code> 是 <code>'myModule'</code>，使用者在 <code>nuxt.config.ts</code> 里就写 <code>myModule: { ... }</code>，未填的项由 <code>defaults</code> 兜底。这就是「一行安装」之外仍然留给使用者的那个旋钮。
    </p>
    <p>
      最后是使用生态时该守的几条经验。优先在 <code>nuxt.com/modules</code> 里挑选官方或高星的社区模块；本地开发或调试模块时，可以用 <code>modulesDir</code> 或直接引用本地路径；构建期靠 <code>nuxt prepare</code> 生成 <code>.nuxt/</code> 下的类型声明，辅助模块开发；<strong>注册顺序即执行顺序</strong>，依赖其他模块能力的模块应放在其后注册。
    </p>
    <div class="lesson-box warn">
      <strong>顺序不是小事：</strong><code>modules</code> 数组的顺序决定注册先后，也决定<strong>钩子与插件的执行次序</strong>。依赖别的模块的模块必须排在它之后——否则会出现在某台机器上偶发失败、换个环境又好了这类极难复现的问题，排查成本远高于当初多看一眼顺序。
    </div>

    <h2>常用模块与生态指南</h2>
    <figure class="lesson-figure">
      <figcaption>三个页签分别是「常用模块 / 开发模块 / 生态指南」：常用模块页签列出 <code>@pinia/nuxt</code>、<code>@nuxtjs/tailwindcss</code>、<code>@nuxt/content</code> 等模块各自的核心能力；开发模块页签并排展示模块的目录结构与 <code>defineNuxtModule</code> 入口代码；生态指南页签则是一份「查找、安装、排序、本地加载」的经验清单。对照着看，能明白「一行安装」背后被封装了什么。</figcaption>
      <N20Modules />
    </figure>

    <h2>构建期模块执行</h2>
    <p>
      Nuxt 模块是「构建期执行的接线包」：<code>setup</code> 在构建时通过 Kit API 替你注册插件、组件、自动导入与运行时配置，随应用运行的代码则被收进 <code>runtime/</code>，用户选项放在与 <code>configKey</code> 同名的键下。你自己装模块时只需一行，自己写模块时才需要关心结构、顺序与这套 Kit API——也正是在那一刻，你才真正看清那一行字符串到底做了什么。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Nuxt 模块（Nuxt Module）」</span>一个在<strong>构建期</strong>通过 <code>setup</code> 执行的包，用 <code>@nuxt/kit</code> 的 API 扩展 Nuxt：注册插件与组件、加入自动导入目录、注入运行时配置、挂载构建钩子。<strong>边界</strong>：<code>setup</code> 只在构建期运行，任何需要随应用运行的功能必须放进模块的 <code>runtime/</code> 目录；模块选项通过 <code>nuxt.config.ts</code> 中与 <code>configKey</code> 同名的键传入；<code>modules</code> 数组的顺序即注册顺序，会影响钩子与插件的执行次序，存在依赖关系的模块必须注意先后。
    </div>
  </LessonArticle>
</template>
