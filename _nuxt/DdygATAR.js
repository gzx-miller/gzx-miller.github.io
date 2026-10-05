const e=`<script setup lang="ts">
import T16CompilerOptions from './T16CompilerOptions.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一份代码，同事那边编译顺利通过，你的编辑器却满屏飘红——查了半天才发现，问题不在代码，而在两个人手里的 <code>tsconfig.json</code> 根本不是同一份。
    </div>

    <h2>关闭严格检查</h2>
    <p>
      你在做一个多人协作的前端项目，用的是 TypeScript。为了让日子好过一点，你顺手把 <code>strict</code> 关掉，想着「少报点错、少点麻烦」。可接下来发生的事情是：有人传进来的函数参数根本没写类型，<code>any</code> 一路渗到业务深处；有人写了 <code>document.getElementById('app')</code>，编译期相安无事，运行到取属性那一步才崩——因为那个元素完全可能不存在。
    </p>
    <p>
      你会发现，TypeScript 的「严格」不是一句话，而是一整组开关。<code>tsconfig.json</code> 决定的不只是要不要报错，还包括：输出的 JavaScript 是哪个版本、哪些内置类型可用、模块按什么规则解析、路径别名怎么配。这些选项不讲清楚，团队里每个人拿到的其实是「不同的一门 TypeScript」，甚至同一个人在不同构建环节看到的结论也会互相打架。
    </p>

    <h2>依赖默认配置</h2>
    <p>
      最省事的做法：干脆不写配置，或者只留一行空的 <code>compilerOptions</code>，让编译器用它自带的默认值。默认值确实能让代码跑起来，而且它承认了一件合理的事——<strong>TypeScript 默认是宽松的</strong>，它想尽可能兼容大量已存在的 JavaScript，所以对隐式 <code>any</code>、空值赋值这类事并不过问。
    </p>
    <p>
      问题在于，类型系统的价值全部来自「检查」，而检查的强度恰恰由这些选项决定。默认值把它调到了最低档：代码能过，不代表它是对的。你付出的是写类型的成本，却没换到对应的保障。
    </p>

    <h2>宽松配置风险</h2>
    <ul>
      <li>参数不写类型也过得去，<code>any</code> 会悄悄扩散，等于类型系统在这一段完全失效。</li>
      <li><code>null</code>、<code>undefined</code> 能赋给任何类型，可能为空的结果被当成一定存在，崩溃被推迟到运行时。</li>
      <li>输出的目标版本没有约定，用到的语法在某些旧环境里可能直接跑不起来。</li>
      <li>模块解析策略不统一，同一行 <code>import</code> 在不同构建工具下可能找不到文件。</li>
    </ul>

    <h2>严格选项逐项开启</h2>
    <p>
      不推翻「一份配置统管编译」这件事，而是把「严格」拆成一组可逐项理解的开关，再把与运行环境相关的选项单独配置。第一个要打开的是总开关 <code>strict</code>：它本身不干活，而是<strong>一次性打开一整组严格检查</strong>，其中最关键的三项，开关效果对照如下。
    </p>
    <table>
      <thead>
        <tr><th>选项</th><th>关闭时</th><th>开启时</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><code>noImplicitAny</code></td>
          <td>参数不写类型即默认为 <code>any</code></td>
          <td>参数缺少类型注解直接报错</td>
        </tr>
        <tr>
          <td><code>strictNullChecks</code></td>
          <td><code>null</code> / <code>undefined</code> 可赋给任意类型</td>
          <td>空值必须显式写成联合，访问前需守卫</td>
        </tr>
        <tr>
          <td><code>strictFunctionTypes</code></td>
          <td>函数参数按更宽松的方式比较</td>
          <td>函数参数的比较更严格，隐患更早暴露</td>
        </tr>
      </tbody>
    </table>
    <p>
      打开 <code>strictNullChecks</code> 之后，你会第一次认真面对「这个值可能为空」。可空类型显式写成 <code>string | null</code>，取值前用可选链 <code>user.profile?.address?.city</code> 与空值合并 <code>?? '未知'</code> 兜底。这不是多写代码，而是把原本藏在运行时的不确定性，提前摊到了编译期。
    </p>
    <p>
      接着是与运行环境有关的那一组。<code>target</code> 决定输出的 JavaScript 版本：定为 <code>ES5</code> 时，箭头函数、模板字符串会被降级转译；定为 <code>ESNext</code> 则基本保留原样。<code>lib</code> 决定编译期能引用哪些内置类型，浏览器项目要补上 <code>DOM</code>、<code>DOM.Iterable</code>，纯 Node 项目则不需要这些。
    </p>
    <p>
      模块这一侧，<code>module</code> 决定产物的模块格式，<code>moduleResolution</code> 决定「去哪里找这个模块」。用 Vite、Webpack 这类打包器时，配置成 <code>bundler</code> 最贴合；再配合 <code>baseUrl</code> 与 <code>paths</code> 配好别名，就能把 <code>../../components/Button</code> 这类相对路径简写成 <code>@/components/Button</code>。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong><code>target</code> 只管产出语法，<strong>并不提供 API 的类型</strong>——即使目标是 ESNext，要用 <code>Promise</code>、<code>Map</code> 仍然需要 <code>lib</code> 里声明对应的标准库，两者是两回事。<code>declaration: true</code> 会顺带产出 <code>.d.ts</code> 声明文件，这是把项目当作库发布给别人消费时的必备项，业务应用通常不必开。
    </div>
    <p>
      最后一条是给多人协作准备的：开启 <code>isolatedModules</code>，保证 Babel、esbuild 这类单文件转译工具与 <code>tsc</code> 的行为一致，避免出现「编辑器不报错、打包却失败」的错位。新项目建议一步到位直接开 <code>strict</code>；存量项目如果报错太多，再<strong>逐项放开</strong>个别选项，而不是把整组关掉。
    </p>

    <h2>开关切换与检查</h2>
    <figure class="lesson-figure">
      <figcaption>切换 <code>strict</code>、<code>noImplicitAny</code>、<code>strictNullChecks</code>，看同一段代码的检查结果如何变化。</figcaption>
      <T16CompilerOptions />
    </figure>

    <h2>检查程度固化</h2>
    <p>
      <code>tsconfig.json</code> 是把「TypeScript 到底检查到什么程度」写成文件的地方。<code>strict</code> 是严格检查的总开关，<code>target</code> 与 <code>lib</code> 管输出语法与可用类型，<code>module</code>、<code>moduleResolution</code> 与 <code>paths</code> 管模块如何被找到。把这些选项配成一份明确、统一的约定，团队看到的才是同一门语言。
    </p>
    <div class="lesson-term">
      <span class="term-name">「编译选项」</span>指 <code>tsconfig.json</code> 中 <code>compilerOptions</code> 一节的配置，用于控制类型检查与产物生成。记忆要点：<code>strict</code> 一次性打开 <code>noImplicitAny</code>、<code>strictNullChecks</code>、<code>strictFunctionTypes</code> 等全部严格项；<code>target</code> 只决定输出语法，要用到的 API 仍需 <code>lib</code> 提供类型；打包器项目用 <code>moduleResolution: bundler</code>，并用 <code>paths</code> 配别名。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
