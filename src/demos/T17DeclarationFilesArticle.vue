<script setup lang="ts">
import T17DeclarationFiles from './T17DeclarationFiles.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你导入了项目里那个老牌图表库，代码明明能跑，编辑器却提示「找不到模块的类型声明」并画上红线，类型提示一片空白——这行红线到底该怎么消掉？
    </div>

    <h2>缺类型时的红线</h2>
    <p>
      你在一个 TypeScript 项目里引入了一个只提供 JavaScript 的第三方库，或者读取了一个 <code>.css</code>、<code>.svg</code> 资源文件。运行时一切正常，可编辑器全程标红，属性没有提示，参数没有约束；<code>strict</code> 模式下甚至直接编译不过，构建流水线卡在这一步。
    </p>
    <p>
      根子在于：TypeScript 只认识「带类型信息的东西」。JavaScript 库、图片、样式这些模块在编译期没有任何类型声明，编译器无从判断它们导出的是什么。你要么给它补一份类型，要么就得把这段代码的检查整体关掉——而后者等于放弃类型安全，把风险留给运行时。
    </p>

    <h2>模块声明的应急</h2>
    <p>
      最省事的做法：在项目里加一行 <code>declare module 'some-js-lib'</code>，直接告诉编译器「这个模块存在，别管它导出什么」。红线立刻消失，编译也能通过。
    </p>
    <p>
      这个方案做对了一件最基本的事：<strong>它把「模块是否存在」和「模块里有什么类型」拆开了</strong>，先保证编译能过。对于实在来不及补类型的临时场景，它确实能救急，而且只需一行。
    </p>

    <h2>空声明的退化</h2>
    <ul>
      <li>这样声明的导出通通是 <code>any</code>，参数传错、属性拼错都不会报错，这段代码等于退回「没有类型」的状态。</li>
      <li>构建工具注入的全局变量、编译期替换的常量，编译器完全不知道它们存在。</li>
      <li>挂在 <code>window</code> 上的自定义属性、给内置对象加的方法，写了也没有类型，编辑器一片空白。</li>
      <li>图片、样式这类资源文件的导入没有统一约定，每一处都要单独处理。</li>
    </ul>

    <h2>声明文件的载体</h2>
    <p>
      不推翻「用声明补齐类型」，而是把声明写得<strong>有内容、有边界</strong>，并且分清它落在哪个作用域。这些声明的载体，就是声明文件 <code>.d.ts</code>——它<strong>只写类型，不含任何实现代码</strong>。
    </p>
    <p>
      第一类是对环境本身的声明。用 <code>declare const</code>、<code>declare function</code> 描述「运行时确实存在，但实现不在这个文件里」的东西，比如构建工具注入的 <code>__APP_VERSION__</code>，或全局的埋点函数 <code>ga</code>。这样你在业务里调用它们时，类型提示和检查都在。
    </p>
    <p>
      第二类是给第三方模块补类型，用 <code>declare module</code> 按模块声明导出。三种写法各有分工：
    </p>
    <ul>
      <li><strong>完整声明</strong>：在 <code>declare module 'lodash'</code> 里逐条写清导出的签名，类型提示和检查立刻到位。</li>
      <li><strong>资源文件</strong>：用通配符声明 <code>declare module '*.module.css'</code>，把样式导入约定成字符串到字符串的映射，一次配置全局生效。</li>
      <li><strong>优先装类型包</strong>：库有官方或社区维护的类型包时（如 <code>@types/xxx</code>），直接安装远比手写可靠，也更省事。</li>
    </ul>
    <p>
      第三类是要动全局类型的情况。给 <code>window</code> 挂初始化状态、给 <code>String</code> 或 <code>Array</code> 增补方法，用 <code>declare global</code> 追加成员。这里有一条硬规则必须记住。
    </p>
    <div class="lesson-box warn">
      <strong><code>declare global</code> 只在模块文件中生效</strong>——也就是文件顶部必须有 <code>import</code> 或 <code>export</code>。纯脚本文件里写它不会报错，却也不会起作用，这一点极其容易踩坑。扩展时以 <code>interface Window</code> 追加属性即可，声明文件里不要写任何实现。
    </div>
    <p>
      最后是让编译器「看见」这些声明：把声明文件放进 <code>tsconfig</code> 的 <code>include</code> 范围，或用 <code>types</code> 字段指定，编辑器才会加载它们。三斜线指令 <code>/// &lt;reference types="node" /&gt;</code> 是更早的引用方式，现代项目里优先用 <code>types</code> 与 <code>lib</code> 替代它。
    </p>
    <p>
      还有两个实践细节值得留意：声明文件与源码并置时注意命名约定，别被当成实现文件参与打包；第三方增强最好集中到统一的声明目录管理，散落在各处会很难追踪谁改了什么。
    </p>

    <h2>四类声明的分工</h2>
    <figure class="lesson-figure">
      <figcaption>切换环境模块声明、<code>declare global</code>、三斜线指令与模块简写，看每种声明各自适合什么场合。</figcaption>
      <T17DeclarationFiles />
    </figure>

    <h2>类型世界的接口层</h2>
    <p>
      声明文件是 TypeScript 与「没有类型的 JavaScript 世界」之间的接口层。用 <code>declare</code> 描述环境里存在的东西，用 <code>declare module</code> 为缺类型的模块补导出，用 <code>declare global</code> 扩展全局对象——它只承载类型，不产生任何运行时代码，补得越具体，收获的检查就越真实。
    </p>
    <div class="lesson-term">
      <span class="term-name">「声明文件」</span>指 <code>.d.ts</code> 文件，只包含类型信息、不含实现。<code>declare const</code> / <code>declare function</code> 描述环境中存在但实现别处的变量与函数；<code>declare module</code> 为无类型库或资源文件补导出，其中简写形式会把导出视为 <code>any</code>；<code>declare global</code> 用于扩展全局类型，且<strong>必须写在含 import 或 export 的模块文件里</strong>。第三方库优先安装 <code>@types</code> 类型包。
    </div>
  </LessonArticle>
</template>
