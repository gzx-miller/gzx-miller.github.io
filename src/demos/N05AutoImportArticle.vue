<script setup lang="ts">
import N05AutoImport from './N05AutoImport.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在模板里写了 <code>&lt;Button /&gt;</code>，整个文件里却没有一行 import。接着你把组件文件从 <code>components/Button.vue</code> 挪进 <code>components/base/Button.vue</code>，文件没改名、内容也没改，可模板里的标签却必须跟着改成 <code>&lt;BaseButton /&gt;</code>——没人写 import，也没人改标签，这个名字究竟是谁替你定的？
    </div>

    <h2>提出问题</h2>
    <p>
      组件一旦多起来，「每个用到的地方都 import 一次」就成了纯粹的重复劳动。你真正想表达的是「这里用一个按钮」，而不是「请从某个相对路径把按钮文件拉进来」。
    </p>
    <p>
      手写 import 的成本随组件数增长：文件顶部一长串 import 成了噪声，路径一深就容易写错，删组件时还常常忘了清理。退一步用全局注册（<code>app.component</code>）能免掉 import，但代价是所有组件都被塞进主包，首屏体积跟着上涨，命名还可能互相冲突。自己写构建插件来做自动注册也行，但要额外维护扫描范围、命名规则和类型声明。于是问题变成：<strong>能不能把「import 组件」这件重复劳动交给构建工具，同时还保住按需加载？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：干脆把所有组件全局注册一遍，模板里就再也不用 import 了，写起来最顺手。
    </p>
    <p>
      这个方案做对了一件表面的事：<strong>它确实消灭了组件顶部的 import 噪声</strong>。但它换来的代价并不小，而且恰好丢掉了一件很重要的东西——按需加载。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>全局注册等于所有组件都进主包，用不到的也被打包，首屏体积白白变胖。</li>
      <li>全局命名空间没有隔离，两个组件重名就会互相覆盖，且不会报错。</li>
      <li>深层目录仍要手写注册语句，体力活并没有真正消除。</li>
      <li>得自己维护一份注册清单，新增组件忘了注册就用不了，编辑器也给不出提示。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「免 import」这个诉求，而是换一种实现方式：把自动导入做成「<strong>用到时才插入 import</strong>」，而不是「一次性全部注册」。前者既有免手写的手感，又天然保住按需加载。
    </p>
    <ol class="lesson-steps">
      <li>构建时扫描约定目录，为 Vue / Nuxt 内置 API、组件、composable 与工具函数批量生成<strong>自动导入声明</strong>，落到 <code>.nuxt/</code> 下的类型声明文件里。</li>
      <li>模板里直接写 <code>&lt;ComponentName /&gt;</code>，框架自动插入对应的 import 语句。</li>
      <li>脚本里，<code>composables/</code> 下以 use 开头的函数、<code>utils/</code> 下的具名导出，直接调用即可，无需手写 import。</li>
      <li>生成的声明文件同时供编辑器读取，因此免 import 的同时仍然有智能提示和类型检查。</li>
    </ol>
    <p>
      这里有个必须记住的命名规则：<code>components/</code> 下的组件是<strong>按路径前缀</strong>命名的。放在根目录的 <code>MyButton.vue</code> 就叫 <code>&lt;MyButton /&gt;</code>；每往下一层目录，就给名字加上这层目录的前缀——<code>components/base/Input.vue</code> 对应 <code>&lt;BaseInput /&gt;</code>，<code>components/admin/Table.vue</code> 对应 <code>&lt;AdminTable /&gt;</code>。这正是开场那件事的答案：<strong>目录本身也是组件名字的一部分</strong>，你换了目录，名字自然跟着变。
    </p>
    <p>
      想扩大扫描范围，用 <code>imports.dirs</code> 把自定义目录加进来即可；默认覆盖 <code>.vue</code>、<code>.ts</code>、<code>.js</code> 这类可编译文件。要注意的是，自动导入并非没有边界——<strong>约定目录之外的文件不会被自动导入</strong>，那些地方仍得老老实实写 import。
    </p>
    <div class="lesson-box warn">
      <strong>当心前缀命名出意外：</strong>组件文件名与所在目录名重复时（例如 <code>components/admin/Admin.vue</code>），前缀拼接出来的名字会出乎你的预料。稳妥的做法是保持<strong>一文件一组件、短名清晰</strong>，别让文件名和目录名撞车。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>依次切到 Vue / Nuxt / 组件 / Composables / 工具函数五个来源页签，逐项对照每个名字是「从哪来的、对应的标签或调用长什么样」。</figcaption>
      <N05AutoImport />
    </figure>

    <h2>总结</h2>
    <p>
      自动导入的核心不是「全局注册」，而是「用到时才插入 import」：构建时扫描约定目录生成声明，写代码时省掉 import，打包时又只带上真正用到的部分。记住两条边界——<strong>只有约定目录会被扫描，组件名还会带上目录前缀</strong>——就能把免 import 的便利稳稳用住。
    </p>
    <div class="lesson-term">
      <span class="term-name">「自动导入」</span>指构建期扫描约定目录，为 Vue / Nuxt 内置 API、组件、composable 与工具函数生成导入声明（落在 <code>.nuxt/</code> 下），使用时再自动插入 import。它的边界是：仅在 <code>components/</code>、<code>composables/</code>、<code>utils/</code> 等约定目录生效，约定之外的文件必须显式 import；组件按<strong>路径前缀</strong>命名（<code>base/Input.vue</code> → <code>&lt;BaseInput /&gt;</code>），且它是按需插入 import 而非运行时全局注册。
    </div>
  </LessonArticle>
</template>
