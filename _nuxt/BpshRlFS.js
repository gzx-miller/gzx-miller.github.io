const e=`<script setup lang="ts">
import V13TypeScript from './V13TypeScript.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把 <code>user.name</code> 手滑写成了 <code>user.nmae</code>，编辑器里红波浪线一片；你以为构建铁定过不了，结果 <code>vite build</code> 一路绿灯，直到线上用户看到页面上一片空白——类型错误明明标出来了，为什么构建完全不理它？
    </div>

    <h2>全量类型检查</h2>
    <p>
      想用 TypeScript，图的就是类型安全：接口写错、字段拼错、传参不匹配，最好在<strong>运行之前</strong>就被拦下。但类型检查是要花时间的——它得把整个项目的类型图扫一遍，才能判断某处调用是否成立。如果每次你改一行代码，开发服务器都先做一次全量类型检查再响应，那「秒级热更新」就没了。
    </p>
    <p>
      于是 Vite 必须回答一个取舍：<strong>把 TypeScript 变成 JavaScript（转译）和判断类型对不对（检查），要不要合成一件事？</strong>旧的打包器把两者合在一起做——安全，但慢；而日常开发里，你绝大多数的编辑只是想刷新一下看看效果，为此每次都付出全量检查的代价并不划算。
    </p>

    <h2>esbuild只转译</h2>
    <p>
      最直接的做法：交给 <code>esbuild</code> 只做转译——把类型注解整体擦掉，输出纯 JavaScript，一个类型都不看。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「让代码能跑」这件事做到了毫秒级</strong>。esbuild 用 Go 编写、多核并行，转译速度远快于传统 JS 实现的工具，于是开发服务器可以做到改一行、几乎立刻响应。
    </p>

    <h2>构建跳过类型</h2>
    <ul>
      <li><code>user.nmae</code> 这种拼写错误，esbuild 压根不看，dev 不报、build 也不报——构建通过不等于类型无误。</li>
      <li>接口改了字段名，所有旧调用点都错了，但项目照常构建成功，问题一路留到线上才暴露。</li>
      <li>别名 <code>@/utils</code> 在 <code>tsconfig.json</code> 里配了、编辑器里能跳转，运行时却报找不到模块——因为两边配置没对齐。</li>
      <li><code>import.meta<span>.env</span>.VITE_XXX</code> 和 <code>.vue</code> 文件没有类型声明，编辑器满屏「找不到模块 / 属性不存在」。</li>
    </ul>

    <h2>转译与检查分离</h2>
    <p>
      先补「把检查找回来，但不拖慢转译」。这里不推翻最小方案，而是<strong>给转译和检查各自分派合适的工具</strong>：转译仍交给 esbuild 保速度，检查交给 <code>vue-tsc --noEmit</code> 保正确性。<code>--noEmit</code> 表示只报类型错误、不产出文件，正好补上 esbuild 留下的那块空白。
    </p>
    <p>
      再补「检查什么时候跑」。既然它慢，就不该压在每次热更新上，而要挂在两道关口：
    </p>
    <ol class="lesson-steps">
      <li>构建脚本：<code>"build": "vue-tsc --noEmit &amp;&amp; vite build"</code>，类型不过就不产出产物。</li>
      <li>CI 流水线：单独跑一条 <code>type-check</code>，类型不通过就不允许合入与部署。</li>
    </ol>
    <p>
      接着补「类型声明」。在 <code>vite-env.d.ts</code> 里加一行 <code>/// &lt;reference types="vite/client" /&gt;</code> 引入 Vite 自带的类型，再声明 <code>*.vue</code> 模块和 <code>ImportMetaEnv</code> 接口，编辑器对 <code>.vue</code> 导入与 <code>import.meta<span>.env</span></code> 才有补全和检查。
    </p>
    <p>
      最后补「一致性」。<code>tsconfig.json</code> 的 <code>paths</code> 别名必须和 <code>vite.config.ts</code> 的 <code>resolve.alias</code> <strong>指向同一处</strong>：只配一边，就会出现「编辑器能跳转、运行时找不到模块」的割裂。如果本地 <code>vue-tsc</code> 的报错和 IDE 对不上，先核对两者依赖与插件版本是否一致。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的限制：</strong>第一，<strong>构建成功不等于类型无误</strong>，务必把 <code>type-check</code> 接进构建或 CI；第二，esbuild 并非支持全部 TS 特性——<code>const enum</code>、<code>export =</code>、装饰器的 <code>emitDecoratorMetadata</code> 它都不支持，遇到要改成兼容写法。
    </div>

    <h2>三类检查对照</h2>
    <figure class="lesson-figure">
      <figcaption>切 config / vue / check 三个页签：先看 esbuild 的转译配置，再看 <code>&lt;script setup lang="ts"&gt;</code> 里怎么用接口与泛型，最后对比 <code>vue-tsc</code> 的三种类型检查方案。</figcaption>
      <V13TypeScript />
    </figure>

    <h2>工具与时机协作</h2>
    <p>
      Vite 对 TypeScript 的态度可以概括成一句：<strong>转译和检查是两件事，交给两个工具、跑在两个时刻</strong>。esbuild 负责把 TS 极速转成 JS（只擦类型、不检查），<code>vue-tsc --noEmit</code> 负责在构建与 CI 里把关类型。理解了这一点，你就不会再把「构建成功」当成「类型没问题」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型擦除（Type Erasure）」</span>指 TypeScript 的类型只存在于编译期，转译时被整体删除，运行时的 JavaScript 里不含任何类型信息。这正是 esbuild 能极速转译的根本原因，也解释了它为什么「不做类型检查」——类型在输出前就没了，运行时无从校验。边界：因为类型被擦除，你不能在运行时 <code>instanceof</code> 一个接口，也不能依赖 <code>const enum</code> 之类的实现细节；类型安全只能在构建前由 <code>vue-tsc</code> / <code>tsc</code> 保证。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
