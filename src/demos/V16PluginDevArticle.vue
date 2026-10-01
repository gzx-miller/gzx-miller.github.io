<script setup lang="ts">
import V16PluginDev from './V16PluginDev.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想在构建时把版本号注入代码，顺手写了个只在 <code>transform</code> 里做一次字符串替换的插件。挂上去之后本地开发从秒开变成了十几秒才响应，改一行样式要转半天——这个插件明明只替换了<strong>一个</strong>占位符，怎么会把整个项目拖垮？
    </div>

    <h2>构建期信息注入</h2>
    <p>
      你遇到的需求都很具体：想在代码里直接 <code>import</code> 一个 <code>.md</code> 文件把它当组件渲染，想把版本号这类信息在构建时注进去，想给开发服务器加一个自定义接口。这些事现有插件都办不到，因为它们不在别人的设计目标里。
    </p>
    <p>
      退回到「手写一个构建脚本」的老办法，人要承担的隐藏成本有三样：脚本逻辑散落在各个文件里，改一处要满仓库找；它只能跑在命令行里，<strong>进不了开发服务器</strong>，于是 dev 和 build 的行为各写一套、迟早对不上；而且它没法像插件那样挂到 Vite 的流程里，别人也复用不了。于是问题落在一句话上：<strong>能不能有一种统一的东西，既能改配置、又能改代码、还能挂到开发服务器上？</strong>
    </p>

    <h2>插件函数结构</h2>
    <p>
      最直接的想法：写一个函数，返回一个带 <code>name</code> 和 <code>transform</code> 的对象，塞进 <code>plugins</code> 数组。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「对模块代码的批量改写」收进了一个标准接口</strong>。开发时每个模块请求都会经过它，构建时也会经过它；不再需要脚本、不再需要两套逻辑。
    </p>

    <h2>逐模块转换成本</h2>
    <ul>
      <li><code>transform</code> 会被<strong>每个模块</strong>调用一次。只按后缀判断就处理，等于连 <code>node_modules</code> 里的依赖也要过一遍正则——这正是开场里开发服务器变慢的原因。</li>
      <li>光改代码不够：想给 <code>resolve.extensions</code> 加一项、想加一个开发接口，<code>transform</code> 全都做不到。</li>
      <li>想 <code>import</code> 一个磁盘上根本不存在的路径，<code>transform</code> 也没地方把它的内容吐出来。</li>
      <li>插件没写 <code>name</code> 或与别人重名，报错时日志里只有一句无名的 warning，根本定位不到是谁干的。</li>
    </ul>

    <h2>两类钩子职责</h2>
    <p>
      先补「钩子分类」。插件对象能挂两类钩子，各管一摊：<strong>Vite 独有钩子</strong>服务于开发服务器、HTML 与 HMR——<code>config</code> 改配置、<code>configResolved</code> 拿最终配置、<code>configureServer</code> 加中间件、<code>transformIndexHtml</code> 改 HTML、<code>handleHotUpdate</code> 处理热更新；<strong>Rollup 兼容钩子</strong>服务于模块的解析、加载与转换——<code>resolveId</code>、<code>load</code>、<code>transform</code>。一次模块请求流经的先后顺序大致是：
    </p>
    <ol class="lesson-steps">
      <li>模块请求进来，先由 <code>resolveId</code> 决定这个 <code>id</code> 到底指向谁。</li>
      <li>再由 <code>load</code> 给出这个模块的源码。</li>
      <li>最后由 <code>transform</code> 把源码改写一遍。</li>
      <li>开发服务器启动与 HTML 处理这些事，则由 <code>configureServer</code>、<code>transformIndexHtml</code> 等 Vite 独有钩子负责。</li>
    </ol>
    <p>
      接着补「虚拟模块」。要 <code>import</code> 一个并不存在的路径，就用 <code>resolveId</code> 拦截这个 <code>id</code>，返回一个以 <code>\0</code> 开头的虚拟 id；再用 <code>load</code> 识别这个 id、直接返回它的源码字符串。那个 <code>\0</code> 前缀是给其它插件看的约定标记——<strong>表示这是一个虚拟模块，别去磁盘上找</strong>。
    </p>
    <p>
      再补「性能边界」。既然 <code>transform</code> 是高频钩子，它必须<strong>第一行就过滤</strong>：先看 <code>id</code> 是否命中目标后缀，不命中的立刻 <code>return null</code> 交回默认流程。开场那个慢，缺的就是这一步——一个不做过滤的 <code>transform</code>，会让每个请求、每个模块都白跑一遍。
    </p>
    <p>
      最后补「命名与调试」。插件按 <code>vite-plugin-xxx</code> 的规范命名，导出函数返回插件对象，<code>name</code> 字段与之同名；排查钩子是否被调用、按什么顺序调用，用 <code>vite --debug</code> 看调用日志，比在钩子里到处打 <code>console</code> 快得多。
    </p>
    <div class="lesson-box warn">
      <strong>两条必守的线：</strong><code>transform</code> 是高频钩子，务必先按 <code>id</code> 过滤、非目标文件立即 <code>return null</code>，否则一个无关插件就能拖慢整个开发服务器；插件 <code>name</code> 必须唯一，否则报错时你根本分不清是哪个插件出的问题。
    </div>

    <h2>骨架结构与发布</h2>
    <figure class="lesson-figure">
      <figcaption>切 hooks / example / publish 三个页签，看一个插件骨架里有哪些钩子、注入版本号的最小示例怎么写，以及发布到 npm 的命名与包结构规范。</figcaption>
      <V16PluginDev />
    </figure>

    <h2>函数式插件实现</h2>
    <p>
      自定义插件就是「返回一个带 <code>name</code> 与钩子对象的函数」：Vite 独有钩子管开发服务器、HTML 与 HMR，Rollup 兼容钩子管模块的解析、加载与转换。写它的关键不在堆钩子，而在两件事——用 <code>resolveId</code> 加 <code>load</code> 造出虚拟模块，以及让高频的 <code>transform</code> 先把无关文件挡在门外。
    </p>
    <div class="lesson-term">
      <span class="term-name">「虚拟模块」</span>指由插件在 <code>resolveId</code> 与 <code>load</code> 里凭空「造」出来的模块，它不对应磁盘上的任何真实文件，通常以 <code>\0</code> 前缀作为标识，让其它插件跳过它。边界：虚拟模块只有在登记它的插件上下文里才存在，那个 <code>id</code> 不能当作文件路径去读；<code>load</code> 必须能对同一个 <code>id</code> 返回内容，否则解析得到、加载不到，依然报错。
    </div>
  </LessonArticle>
</template>
