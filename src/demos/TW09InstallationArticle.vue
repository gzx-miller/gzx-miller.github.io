<script setup lang="ts">
import TW09Installation from './TW09Installation.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我按文档装了 Tailwind，Vite 插件和 PostCSS 两套配置都配上了，结果产物里的样式体积翻了一倍——为什么「都配上」反而成了问题？
    </div>

    <h2>接入路径选择</h2>
    <p>
      你给一个已有项目接入 Tailwind v4。项目本身可能有不同的构建环境：有的是 Vite 的 SPA，有的是被临时压缩成一行 CSS 的老站点，还有的需要在命令行里单独产出样式文件。接入方式看着有好几种，到底该选哪条路？
    </p>
    <p>
      更现实的问题出现在升级时：项目里原本就有一套 PostCSS 配置，现在要换成 v4，新配置和旧配置会不会同时生效？如果会，会发生什么？
    </p>

    <h2>能配就配思路</h2>
    <p>
      最省事的思路是「能配的都配上」：装好核心包，Vite 插件配一套，PostCSS 插件再配一套，CSS 入口里把指令都写全，心想这样总不会漏。
    </p>
    <p>
      这个方案想对了一件事：<strong>Tailwind 需要有人把源码里的类名扫描出来、再生成最终样式</strong>，所以必须有一个「适配器」参与构建。方向没错，问题出在数量上。
    </p>

    <h2>双适配器重复编译</h2>
    <ul>
      <li>两套适配器同时处理同一个 CSS 入口，等于同一件事被做了两遍，样式被重复编译。</li>
      <li>旧的 PostCSS 配置没清干净，和新机制一起生效，可能出现互相覆盖的奇怪结果。</li>
      <li>非标准目录下的模板文件扫描不到，明明写了类名，产物里却没有对应样式。</li>
      <li>往往是生产构建时才发现问题，排查起来要从构建链一路往前翻。</li>
    </ul>

    <h2>核心包与适配器分工</h2>
    <p>
      先建立一个最小的心智模型：<strong>核心包提供工具与运行时，适配器负责把它接进你现有的构建流程</strong>。所以接入的复杂度并不来自 Tailwind 本身，而来自你的项目里已经存在几条 CSS 处理链。看清这一点，选路就收窄成了一个问题——我的项目靠什么打包。
    </p>
    <p>
      再具体到 v4 的结构：它由<strong>核心包</strong>和<strong>构建适配器</strong>两部分协作。CSS 入口只需要一行 <code>@import "tailwindcss";</code>，而扫描源码、生成最终样式这件事交给适配器完成。在 CSS-first 配置下，<strong>不再需要 <code>tailwind.config.js</code></strong>。
    </p>
    <p>
      适配器有三条路，按现有构建链<strong>选一条、且只选一条</strong>：
    </p>
    <table>
      <thead>
        <tr><th>路径</th><th>适用场景</th><th>接入方式</th></tr>
      </thead>
      <tbody>
        <tr><td>Vite 插件</td><td>Vite 项目（首选）</td><td>插件列表里加 <code>tailwindcss()</code></td></tr>
        <tr><td>PostCSS 插件</td><td>已有 PostCSS 管道</td><td>配置里加 <code>"@tailwindcss/postcss"</code></td></tr>
        <tr><td>独立 CLI</td><td>无构建工具、需单独产出</td><td>命令行指定输入与输出文件</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>一条铁律：不要让多个适配器处理同一个 CSS 入口。</strong>Vite 项目优先用官方 Vite 插件；从旧版本升级到 v4 时，<strong>先移除 PostCSS 插件链里的旧配置</strong>，再接入新方案，避免两套机制同时生效、重复编译。
    </div>
    <p>
      以一个 Vite 项目为例，实际步骤其实很短：装上核心包与 Vite 插件，在插件列表里注册它，再在全局样式入口写下那一行 <code>@import</code>，剩下的扫描与生成都由插件完成。不需要额外的配置文件，也不需要维护一串内容路径。
    </p>
    <p>
      再就是扫描范围。v4 默认会自动检测项目源文件，但<strong>非标准目录或来自外部包的内容</strong>不一定在范围内，这时需要用 <code>@source</code> 显式声明，否则模板里写了类名也会被漏掉。
    </p>
    <p>
      最后记住升级时的顺序：<strong>先拆旧、再装新</strong>。旧 PostCSS 配置还在的时候就直接加新方案，很容易得到两份重复的样式，而且这类问题往往要到比对产物体积时才暴露出来——已经在线上跑了很久才发现，就很被动了。
    </p>
    <ol class="lesson-steps">
      <li>按现有构建链选择<strong>唯一</strong>的适配器，Vite 项目就用官方 Vite 插件。</li>
      <li>在全局 CSS 入口导入 Tailwind，并保持这个入口唯一。</li>
      <li>验证开发热更新与生产构建都能正确扫描到模板源文件。</li>
      <li>在产物里确认样式只生成了一份，没有重复编译的入口。</li>
    </ol>

    <h2>三种适配生成结果</h2>
    <figure class="lesson-figure">
      <figcaption>切换 Vite、PostCSS、CLI 三种适配器，看同一份源码类名经由不同路径生成 CSS。</figcaption>
      <TW09Installation />
    </figure>

    <h2>单一入口原则</h2>
    <p>
      接入 Tailwind v4 的关键词是「唯一」。一份 CSS 入口、一个适配器，剩下的交给核心包去扫描和生成；配置能省则省，因为 CSS-first 本就不需要旧式配置文件。升级时最容易翻车的地方不是少配了，而是旧配置没清干净。
    </p>
    <div class="lesson-term">
      <span class="term-name">「构建适配器」</span>是负责扫描源码类名并生成最终样式的构建侧组件，v4 提供 Vite 插件、PostCSS 插件与独立 CLI 三条路径。原则是<strong>一个 CSS 入口只配一个适配器</strong>；入口只需 <code>@import "tailwindcss";</code>，非标准目录用 <code>@source</code> 显式声明，升级时先移除旧 PostCSS 配置，避免重复编译。
    </div>
  </LessonArticle>
</template>
