<script setup lang="ts">
import V18Esbuild from './V18Esbuild.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一份 TypeScript，用 <code>tsc</code> 编译要等好几秒，而你在 Vite 里保存文件几乎立刻就热更新了。可与此同时你发现：代码里明明写着一个类型错误，开发服务器照样跑得好好的，页面也正常渲染。为什么它这么快，又为什么它「假装没看见」错误？
    </div>

    <h2>转译与检查耗时</h2>
    <p>
      开发时每改一个文件，工具都得把 TypeScript 和 JSX 转成浏览器能跑的 JavaScript。转译本身没多难，难的是「顺带做多少事」：如果让一个全能编译器一次完成转译、类型检查、打包，它每次都要把整套类型系统重跑一遍，改一行就要等几秒。而热更新追求的是「保存即刷新」，这几秒的等待是不可接受的。
    </p>
    <p>
      于是问题变成：<strong>开发阶段真的需要每次转译都做完整类型检查吗？</strong>转译要的其实是「让代码能被浏览器执行」，而类型检查要的是「保证代码在类型上说得通」——这本来就是两件事，能不能把它们拆开？
    </p>

    <h2>只转译不检查</h2>
    <p>
      最直接的做法：只管转译，不管检查。把类型标注擦掉、把 JSX 转成函数调用、按目标环境降级语法，然后立刻交给浏览器。
    </p>
    <p>
      这个方案做对了一件事：<strong>它换来了速度</strong>。esbuild 用 Go 编写、多个核心并行，比传统用 JavaScript 实现的转换工具快上一到两个数量级，模块请求能在毫秒级返回，这正是开场里「保存即刷新」的来源——它压根没做类型检查。
    </p>

    <h2>漏检与语法盲区</h2>
    <ul>
      <li>不做类型检查，类型错误不会被拦截。你把一个字符串传进了只接受数字的函数，转译照样通过，直到运行时才炸。</li>
      <li>它不认识某些 TypeScript 特性。<code>const enum</code> 跨模块的内联行为与 <code>tsc</code> 不同，用了可能在内联处取值异常。</li>
      <li><code>export =</code> 与 <code>import =</code> 这种 CommonJS 风格的写法也不在其中。</li>
      <li>依赖装饰器元数据的框架会卡住：esbuild 不支持 <code>emitDecoratorMetadata</code>，靠反射读类型的地方拿不到信息。</li>
    </ul>

    <h2>双流水线分工</h2>
    <p>
      先补「职责分离」。既然转译和检查是两件事，就把它们拆成两条独立流水线：esbuild 负责<strong>随时转译</strong>，追求快；类型检查交给 <code>vue-tsc --noEmit</code>（或 <code>tsc --noEmit</code>），追求准，放在构建前或 CI 里跑。这样开发不被检查拖慢，类型安全也不会丢。<code>package.json</code> 里把它接在 <code>build</code> 前面，或单独留一个 <code>type-check</code> 脚本给 CI。
    </p>
    <p>
      接着补「JSX 怎么转」。浏览器不认识 JSX 语法，esbuild 把它转成函数调用。经典模式会转成 <code>React.createElement(...)</code>；在 Vue 里则配置 <code>jsxFactory: 'h'</code>、<code>jsxFragment: 'Fragment'</code>，再用 <code>jsxInject</code> 自动注入一行 <code>import { h, Fragment } from 'vue'</code>，省去每个文件手写。<code>tsconfig.json</code> 里那把 <code>jsx</code> 设成 <code>"preserve"</code>，意思就是「别让 <code>tsc</code> 动 JSX，保留原样交给 Vite/esbuild 处理」。
    </p>
    <p>
      再补「按目标降级」。<code>target</code> 决定语法降级到哪个版本，比如 <code>es2020</code>；<code>drop: ['console', 'debugger']</code> 让构建时把调试代码抹掉；<code>platform</code> 区分 <code>browser</code> / <code>node</code> / <code>neutral</code>。这是一处权衡：<strong>目标越现代，产物越小、跑得越快，但能兼容的浏览器越窄</strong>，要按你的用户来决定。
    </p>
    <p>
      最后补「遇到不支持的 TS 特性怎么办」。思路是<strong>顺着 esbuild 能理解的语法写</strong>：<code>const enum</code> 换成普通 <code>enum</code>；<code>export =</code> / <code>import =</code> 改成 ES Module 语法；依赖 <code>emitDecoratorMetadata</code> 的场景，转交给 Babel 插件链或官方插件处理。
    </p>
    <div class="lesson-box warn">
      <strong>两条必记的线：</strong>转译通过<strong>不等于</strong>类型正确，构建成功也别当类型没问题——类型回归得靠 <code>vue-tsc --noEmit</code> 在构建前或 CI 里拦；写代码时避开 <code>const enum</code>、<code>export =</code> 与装饰器元数据这几类 esbuild 不支持的写法。
    </div>

    <h2>实时转换页签</h2>
    <figure class="lesson-figure">
      <figcaption>切 核心特性 / TypeScript / JSX / 实时转换 四个页签，在「实时转换」里编辑左侧的 TypeScript，看右侧怎样一层层剥掉类型标注、只留下能跑的 JavaScript。</figcaption>
      <V18Esbuild />
    </figure>

    <h2>速度与正确性取舍</h2>
    <p>
      Vite 之所以快，是因为 esbuild 走的是一条「只转译、不检查」的快速通道：擦掉类型、转好 JSX、按目标降级，然后立刻交给浏览器。类型安全则交给 <code>vue-tsc</code> 在另一条线上把关。把这两件事彻底分开，再用能兼容的语法避开 esbuild 的盲区，速度与正确性就能同时拿到。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型擦除（type erasure）」</span>指转译时把 TypeScript 的类型标注、<code>interface</code> 等只在编译期存在的信息整段删掉，产出不含任何类型信息的 JavaScript。esbuild 的转译本质就是类型擦除加语法降级。边界：擦除之后类型在运行时<strong>完全不存在</strong>，任何靠类型做运行时判断的写法都得不到信息；也正因为不做检查，类型错误只会在独立跑 <code>tsc</code> / <code>vue-tsc</code> 时才暴露。
    </div>
  </LessonArticle>
</template>
