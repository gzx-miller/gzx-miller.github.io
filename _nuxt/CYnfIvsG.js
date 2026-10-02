const e=`<script setup lang="ts">
import V03Plugins from './V03Plugins.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了个插件想给源码里的某个函数名做替换，注册进 <code>plugins</code> 数组后毫无反应；同事几乎一样的插件却生效了。把两份配置一对比，唯一的差别是注册的先后位置。
    </div>

    <h2>日常重复自动化</h2>
    <p>
      日常开发里重复劳动很多：每写一个组件都要手写一行 <code>import</code>；<code>ref</code>、<code>computed</code> 每次都得从 <code>vue</code> 里引；想让某个功能只在开发阶段生效，又得手动增删代码。你希望把这些重复动作<strong>交给工具自动完成</strong>，同时保留「按阶段启用」的能力。
    </p>
    <p>
      但真正的难点不在「怎么挂上插件」，而在<strong>「谁先谁后」</strong>。Vite 内部本身就有一批核心插件，负责编译 Vue、处理样式与资源。如果你的插件想在它们之前读到原始源码、或在它们之后修改产物，靠数组里的位置去排是很脆弱的：以后加一个插件，顺序就变了。所以问题是：<strong>插件的执行顺序，能不能被显式声明？</strong>
    </p>

    <h2>插件数组声明</h2>
    <p>
      最直接的做法：往配置的 <code>plugins</code> 数组里塞插件即可。例如 <code>plugins: [vue()]</code> 就能让 <code>.vue</code> 文件被正确编译；需要 JSX 就再加一个 <code>vueJsx()</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「扩展 Vite」统一成了「往一个数组里加东西」</strong>，不需要改 Vite 源码，插件的组合因此是可插拔的。
    </p>

    <h2>注册位置敏感</h2>
    <ul>
      <li>顺序敏感：把转换插件写在 <code>vue()</code> 后面，拿到的可能已经是 SFC 编译后的代码，结果和预期不符。</li>
      <li>想「跑在核心插件之前」只能靠数组位置表达，加一个插件就可能把顺序撞乱。</li>
      <li>自动按需引入会生成 <code>auto-imports.d.ts</code> / <code>components.d.ts</code>，没加进 <code>tsconfig</code> 的 <code>include</code>，编辑器会报「变量未定义」。</li>
      <li>插件一旦抛错会中断整个 dev server，报错里往往只有插件名，定位只能靠猜。</li>
    </ul>

    <h2>三段执行排序</h2>
    <p>
      先解决顺序。Vite 借用了 Rollup 的插件接口，并加了几个特有钩子；同时每个插件可以声明 <code>enforce</code> 字段。于是插件被分成三段排序：<code>enforce: 'pre'</code> 的排在 Vite 核心插件<strong>之前</strong>，未声明的普通插件排在核心插件<strong>之后</strong>，<code>enforce: 'post'</code> 的排在所有这些<strong>之后</strong>。你的转换插件该站哪一段，用 <code>enforce</code> 一句话声明，不再依赖数组下标。
    </p>
    <ol class="lesson-steps">
      <li>pre 阶段：在所有核心插件之前执行，适合最早接触原始源码。</li>
      <li>核心阶段：Vite 内置插件，负责编译 Vue、处理样式与资源。</li>
      <li>普通阶段：未声明 enforce 的插件，在核心插件之后运行。</li>
      <li>post 阶段：最后由 <code>enforce: 'post'</code> 的插件收尾。</li>
    </ol>
    <p>
      再解决「按阶段启用」。既然配置能写成函数，就能按 <code>command</code> 判断：<code>command === 'serve'</code> 时只 push 开发插件，<code>command === 'build'</code> 时只 push 构建插件，启用与否变成了普通的分支逻辑。
    </p>
    <p>
      最后一块拼图是「为什么插件能通用」。Vite 插件<strong>兼容 Rollup 的插件接口</strong>——<code>transform</code>、<code>resolveId</code> 这些钩子含义一致，所以一个 Rollup 插件稍作调整就能用在 Vite 上。社区里大量插件用 <code>vite-plugin-</code> 或 <code>unplugin-</code> 前缀分发，后者还能同时适配多个打包器；自动按需引入组件与 API 的 <code>unplugin-vue-components</code>、<code>unplugin-auto-import</code> 就是这类。
    </p>
    <div class="lesson-box warn">
      <strong>记得补类型文件：</strong>自动引入生成的 <code>dts</code> 声明文件要加进 <code>tsconfig.json</code> 的 <code>include</code>，否则编辑器不认识自动引入的变量。插件执行出错会中断 dev server，报错信息里的插件名就是最快的定位线索。
    </div>

    <h2>清单与数组对照</h2>
    <figure class="lesson-figure">
      <figcaption>翻一遍插件清单，认出哪些是你项目里已经在用的；再看下面那段注册代码，对照 <code>plugins</code> 数组的写法，想清楚每个插件大致站在哪一段。</figcaption>
      <V03Plugins />
    </figure>

    <h2>钩子顺序与接口</h2>
    <p>
      插件机制把「扩展 Vite」变成了往 <code>plugins</code> 数组里加东西，而顺序这个最容易出错的部分，被 <code>enforce</code> 显式化成了 pre / 普通 / post 三段。又因为接口与 Rollup 兼容，你写一次的转换逻辑，往往能跨越打包器复用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「enforce」</span>是插件上的一个字段，用来声明执行阶段：<code>enforce: 'pre'</code> 排在 Vite 核心插件之前，<code>enforce: 'post'</code> 排在所有插件之后，不声明则位于核心插件之后。边界：它只调整「同一阶段内」的相对顺序，不能越过阶段；它本身也不启用或禁用插件，只负责排序。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
