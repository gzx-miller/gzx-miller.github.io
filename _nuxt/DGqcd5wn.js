const e=`<script setup lang="ts">
import V02Config from './V02Config.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>本地调试想要 sourcemap 和固定端口，线上却必须关掉 sourcemap、换个压缩器。每次发版前你都手动翻配置文件改这几行，直到有一次忘了关 sourcemap，把整份源码映射连同 <code>.map</code> 一起传上了 CDN。
    </div>

    <h2>多环境分支配置</h2>
    <p>
      这类需求看起来很小：开发时想要热更新友好、能定位到源码；生产时想要体积小、不暴露内部结构。可它们全落在同一个文件里——<code>vite.config.ts</code>。配置项少时你还能靠记忆改；一旦有了 <code>server</code>、<code>build</code>、<code>resolve</code>、<code>css</code> 几十个字段，<strong>「不同环境要不同设置」就变成了一场手工切换</strong>。
    </p>
    <p>
      手工切换的成本是隐性的：改配置容易漏掉某个字段；维护两份配置文件又得在命令里加 <code>--config</code> 切换，很容易跑错；把环境判断散写成一堆三元表达式，读起来也不知道哪段属于哪个环境。说到底，问题是：<strong>能不能用一份配置，按当前环境自动给出不同的结果？</strong>
    </p>

    <h2>配置对象导出</h2>
    <p>
      最直接的做法：在项目根目录建一个 <code>vite.config.ts</code>，导出一个普通对象，把 <code>server</code>、<code>build</code>、<code>resolve.alias</code>、<code>plugins</code> 一次写清楚。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把散落在命令行参数里的配置收拢到了一个入口</strong>。Vite 启动时会自动找到它，不需要你额外指定路径。配置项有了统一的归属，这是后面一切的前提。
    </p>

    <h2>静态取值局限</h2>
    <ul>
      <li>静态对象没法按环境分支：<code>build.sourcemap</code> 只能写死成 <code>true</code> 或 <code>false</code>，开发想要、生产不想要的需求直接卡住。</li>
      <li>写成 <code>sourcemap: process.env<span>.NODE_ENV !== 'production'</span></code> 这类表达式，会散落到每个字段上，字段一多就没人看得懂。</li>
      <li>手写对象没有类型约束，把 <code>outDir</code> 拼成 <code>outdir</code>，Vite 不报错，只会在构建时默默用了默认值。</li>
      <li>想「构建分析时才加可视化插件」，静态对象里根本没有地方放这段条件逻辑。</li>
    </ul>

    <h2>类型推导与分支</h2>
    <p>
      先解决「配置要有类型」。用 Vite 导出的 <code>defineConfig</code> 把对象包起来，返回值会获得完整的类型推导，字段拼错时编辑器当场标红，而不是等到构建才发现被静默忽略。
    </p>
    <p>
      接着解决「按环境分支」。把导出的值从对象换成一个函数，函数接收 <code>{ command, mode }</code>：<code>command</code> 区分是 <code>serve</code>（开发）还是 <code>build</code>（构建），<code>mode</code> 区分当前模式（如 <code>development</code> / <code>production</code>）。在函数体内判断这两个值，返回不同的配置。<strong>它返回的对象会与 Vite 的默认配置深度合并</strong>——这点很关键，你不必把默认值抄一遍，只写差异部分。
    </p>
    <ol class="lesson-steps">
      <li>写静态对象，先把通用配置摆好。</li>
      <li>套上 <code>defineConfig</code>，拿到类型提示。</li>
      <li>把对象改成 <code>({ command, mode }) =&gt; {...}</code> 形式的函数，函数内按环境返回分支配置。</li>
      <li>返回值与默认配置深度合并，只有你写到的字段会被覆盖。</li>
    </ol>
    <p>
      再解决「条件追加插件」。既然已经是函数，就能在里面写普通 JS：<code>if (process.env.ANALYZE) plugins.push(visualizer())</code>，只在需要分析包体积时才把可视化插件挂上去。环境差异写进函数、敏感值交给环境变量，配置文件里不该出现密钥或绝对路径。
    </p>
    <div class="lesson-box warn">
      <strong>常见误区：</strong>配置字段拼写错误不会报错，会被<strong>静默忽略</strong>。改完配置后用 <code>vite --debug</code> 查看最终解析结果，确认字段真的生效了。
    </div>
    <div class="lesson-box hint">
      <strong>两个高频字段：</strong><code>resolve.alias</code> 用来配 <code>@</code> 之类的路径别名；<code>css.preprocessorOptions</code> 可以往每个 SCSS 文件里注入全局变量或 <code>@use</code>。函数式配置返回空对象也不会丢默认行为，因为深度合并只在「你写了的字段」上覆盖。
    </div>

    <h2>基础进阶对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换 basic / advanced / env 三个页签，对照看基础配置、别名与分包这类进阶配置，以及环境变量是怎么接进配置里的。</figcaption>
      <V02Config />
    </figure>

    <h2>函数式配置返回</h2>
    <p>
      配置文件是 Vite 的项目级入口，真正让它灵活的转折，是从「导出一个对象」变成「导出一个函数」。函数接收 <code>{ command, mode }</code>，按环境返回不同配置，返回值再由 Vite 与默认配置深度合并。于是开发与生产的分歧集中在一个地方表达，不再散落成一堆没人看得懂的三元表达式。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数式配置」</span>指 <code>defineConfig</code> 接收一个 <code>({ command, mode }) =&gt; UserConfig</code> 形式的函数，Vite 在启动时执行它并深度合并返回值。边界：函数在每次启动（dev 或 build）时执行一次，只有返回值里写到的字段才会覆盖默认值；返回空对象是合法的，不会清空默认配置。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
