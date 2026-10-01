<script setup lang="ts">
import V10Lib from './V10Lib.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你发布了一个 Vue 组件库。同事装进项目后，组件能显示但交互全乱——点按钮没反应。排查半天才发现：页面上同时加载了<strong>两份 Vue</strong>，一份是他的应用自带的，一份是你的库打包进去的。
    </div>

    <h2>未知消费环境</h2>
    <p>
      你要写一个「给别人用」的库，而别人的环境是未知的：有人用 Vite/webpack 按 ESM 引入，有人直接在 HTML 里挂 CDN 的 <code>&lt;script&gt;</code>，还有人在 Node 里 <code>require</code>。同时，一个 Vue 组件库有个绝不能踩的雷——<strong>Vue 不能被你自己打进库里</strong>，否则使用方的应用和你的库各带一份 Vue，两套响应式系统互不认识，交互就会像开头那样全部错乱。
    </p>
    <p>
      若照搬打包应用的方式去构建库，人要付出的隐藏成本是：产物格式单一，只有一种引用方式能用；框架依赖被整份打进去，制造多实例；类型声明与包入口字段要人手工对齐，漏一个使用者就报错。于是问题变成：<strong>怎么一次构建同时产出多种模块格式，并把框架依赖留给使用方提供？</strong>
    </p>

    <h2>应用式打包</h2>
    <p>
      最直接的想法：像打包应用一样构建，产出一个 bundle 发出去。
    </p>
    <p>
      这个方案做对了一件事：<strong>库的代码确实被收敛成了可发布的文件</strong>，能装进任意项目里被引用。
    </p>

    <h2>单一格式局限</h2>
    <ul>
      <li>格式单一：产物若是 CJS，CDN 的 <code>&lt;script&gt;</code> 用不了；若是 UMD，Node 的 <code>require</code> 又要绕。使用者被格式绑死。</li>
      <li>框架重复：<code>vue</code> 被打进库产物，使用方自己也有一份，页面上出现两个 Vue 实例，响应式与插件注册全部错乱。</li>
      <li>UMD 全局名没映射：库内部 <code>import 'vue'</code>，打到 UMD 里得去全局找一个叫 <code>Vue</code> 的变量，不告诉它名字就报 <code>Vue is not defined</code>。</li>
      <li>类型与入口对不上：有产物却没有 <code>.d.ts</code>，或 <code>package.json</code> 的入口字段指向不存在的文件，使用者一装就红。</li>
    </ul>

    <h2>多格式并行输出</h2>
    <p>
      先补「一次输出多种格式」。Vite 的 <code>build.lib</code> 让你一次构建产出多种模块格式，用 <code>formats</code> 列出 <code>['es', 'cjs', 'umd']</code>，用 <code>fileName</code> 按格式生成文件名。三种格式各有归属：<strong>ESM</strong> 给现代打包器按需引入，<strong>UMD</strong> 给 CDN 的 <code>&lt;script&gt;</code> 直接用，<strong>CJS</strong> 给 Node 的 <code>require</code>。一份源码，三种消费方式。
    </p>
    <p>
      接着补「把框架外部化」。要解决多实例，就得告诉 Rollup：<code>vue</code> 不要打进来，交给使用方提供。这就是 <code>rollupOptions.external</code>，把 <code>vue</code> 填进去它就不再进入产物；UMD 场景下还要配 <code>output.globals</code>，把库里的模块名 <code>vue</code> 映射成全局变量 <code>Vue</code>，否则 CDN 引用时会报 <code>Vue is not defined</code>。映射关系就是「模块名 → 全局变量名」。
    </p>
    <p>
      再补「告诉使用方这是依赖，而不是塞给他」。产物的入口字段要写清楚，让构建工具知道去哪找不同格式，并声明框架由使用方提供：用 <code>package.json</code> 的 <code>module</code> 指向 ESM 产物、<code>main</code> 指向 CJS/UMD，用 <code>exports</code> 的条件映射分别对应 <code>import</code> / <code>require</code> / <code>types</code>；再用 <code>peerDependencies</code> 声明 <code>vue</code>，从声明层面杜绝多实例。
    </p>
    <p>
      最后补「类型声明与 CSS」。类型声明 Rollup 不会自动生成，要用 <code>vite-plugin-dts</code> 生成 <code>.d.ts</code>，并保证 <code>exports</code> 的 <code>types</code> 指向它；而库里的 CSS 会被单独产出一个文件，需要使用者手动引入，例如 <code>import 'my-lib/dist/style.css'</code>——这一条一定要写进文档，否则使用者会看到一堆没有样式的组件。
    </p>
    <div class="lesson-box warn">
      <strong>两条必守的线：</strong>框架依赖要用 <code>external</code> 加 <code>peerDependencies</code> 双保险，绝不能打进产物，否则使用方页面会出现两份 Vue；库的 CSS 不会随 JS 自动生效，必须由使用方手动引入，务必写进文档。
    </div>

    <h2>格式与发布字段</h2>
    <figure class="lesson-figure">
      <figcaption>切 config / output / publish 三个页签，看 <code>lib</code> 配置怎么写、会产出哪几种格式，以及发布到 npm 需要哪些 <code>package.json</code> 字段。</figcaption>
      <V10Lib />
    </figure>

    <h2>消费环境适配</h2>
    <p>
      库模式做的事，是让一份源码适配所有消费环境：用 <code>build.lib</code> 一次输出 ESM / UMD / CJS 三种格式，用 <code>external</code> 加 <code>globals</code> 把框架依赖让给使用方，用 <code>package.json</code> 的入口字段与 <code>peerDependencies</code> 把「从哪引、谁提供依赖」交代清楚。库不是应用，它的产物要服务于你见不到的使用者。
    </p>
    <div class="lesson-term">
      <span class="term-name">「外部化（external）」</span>指打包时把某个依赖排除出产物、交由使用方提供；UMD 场景再配合 <code>output.globals</code> 把模块名映射为全局变量，避免同一依赖被打包多份。边界：<code>external</code> 只保证「不打包」，<strong>并不保证运行时能找到</strong>——使用方必须自行安装并正确引入；框架类依赖还应同时在 <code>peerDependencies</code> 里声明。
    </div>
  </LessonArticle>
</template>
