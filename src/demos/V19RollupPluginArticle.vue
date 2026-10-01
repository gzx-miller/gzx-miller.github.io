<script setup lang="ts">
import V19RollupPlugin from './V19RollupPlugin.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你按文档装了 <code>rollup-plugin-visualizer</code>，想在开发时随时看看体积。结果本地跑了一下午，终端一条日志都没有，报告文件也没生成；直到你执行一次 <code>vite build</code>，报告立刻出现在 <code>dist</code> 里。同一份配置、同一个插件，为什么它在开发时「隐身」了？
    </div>

    <h2>现成插件的复用</h2>
    <p>
      你要在产物上加一道处理——生成体积报告、压缩图片、产出清单——而社区里早就有人把它写成了 Rollup 插件。可 Vite 的开发服务器根本不是 Rollup 在跑：开发阶段它基于原生 ESM 按需转换，只有生产构建才切换到 Rollup。
    </p>
    <p>
      如果为了同时支持两个阶段，就分别写两套插件，人要付出的隐藏成本是：逻辑重复维护两遍，两边的行为还容易悄悄跑偏；生态里现成的 Rollup 插件全都用不上，每个功能都从零写。于是问题落在：<strong>一套插件接口，怎么同时服务「开发服务器」和「生产构建」这两个形态完全不同的阶段？</strong>
    </p>

    <h2>接口直接兼容</h2>
    <p>
      最直接的做法：让 Vite 直接兼容 Rollup 的插件接口，Rollup 插件原样塞进 <code>plugins</code> 数组就能用。
    </p>
    <p>
      这个方案做对了一件事：<strong>生态复用</strong>。Rollup 上已经成熟的插件不用重写，拿来即用；你不必学两套体系，只学一套就能同时理解两边的插件。
    </p>

    <h2>产物钩子缺位</h2>
    <ul>
      <li>并不是所有钩子在两个阶段都会被调用。依赖「产物」的钩子——比如 <code>generateBundle</code>、<code>writeBundle</code>——只在构建时触发，开发时自然一声不响。这正是开场里插件「隐身」的原因。</li>
      <li>开发阶段 Vite 用 esbuild 做转换，与 Rollup 的 <code>transform</code> 路径并不完全等同，部分插件在 dev 下行为会和 build 不一致。</li>
      <li>一个只在构建才需要的重插件，如果无条件挂上，会把开发启动也一起拖慢。</li>
      <li>分不清哪些钩子属于 Vite、哪些属于 Rollup，就很容易把逻辑写在错误的阶段，调试时一头雾水。</li>
    </ul>

    <h2>两类钩子归属</h2>
    <p>
      先补「钩子分两类」。Vite 特有钩子服务于开发服务器与 HTML/HMR：<code>config</code>、<code>configResolved</code>、<code>configureServer</code>、<code>transformIndexHtml</code>、<code>handleHotUpdate</code>。Rollup 兼容钩子服务于模块与产物：<code>resolveId</code>、<code>load</code>、<code>transform</code> 在开发和构建都会跑；而 <code>options</code>、<code>buildStart</code>、<code>generateBundle</code>、<code>writeBundle</code>、<code>closeBundle</code> 这批「产物类」钩子只在构建时跑。记住这条分界，就能解释插件为什么会在某个阶段沉默。
    </p>
    <p>
      接着补「用 <code>apply</code> 控制生效阶段」。插件对象可以声明 <code>apply: 'serve'</code> 只在开发生效，或 <code>apply: 'build'</code> 只在构建生效；也可以写成一个函数 <code>apply(config, { command })</code> 返回布尔值，按条件决定挂不挂。这样，开场那个只在构建产出报告的插件，就该标上 <code>apply: 'build'</code>，开发它本就不该介入。
    </p>
    <p>
      再补「执行顺序」。当多个插件都想改写同一段代码，谁先谁后就有讲究了。同一个插件数组里，标了 <code>enforce: 'pre'</code> 的排在最前，普通插件居中，标了 <code>enforce: 'post'</code> 的排在最后。理解这个顺序，转换才能按你预期一层层叠上去，而不是被别人的输出盖掉。
    </p>
    <p>
      最后补「写一个两边都用的通用插件」。一个插件完全可以两种钩子都用：用 Vite 特有钩子做开发侧的事（比如 <code>configureServer</code> 挂个中间件），用 Rollup 钩子做构建侧的事（比如 <code>transform</code> 改代码、<code>generateBundle</code> 统计产物）。两边各司其职，互不干扰，一个插件就同时服务了两个阶段。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong>产物类钩子只在构建触发，开发时别指望它们有反应；接入社区插件前先核对它支持的最低 Vite 版本、以及是否需要限定阶段，用 <code>apply</code> 或条件判断把「只在 build 用」的重插件挡在 dev 之外，避免拖慢开发。
    </div>

    <h2>列表页签对照</h2>
    <figure class="lesson-figure">
      <figcaption>切 插件简介 / 钩子列表 / 自定义插件 / 交互演示 四个页签，在钩子列表里用「Vite 特有 / Rollup 通用」筛选，点开每一项看它属于哪个阶段；再运行插件演示，看哪些文件触发 <code>transform</code>、哪些被跳过。</figcaption>
      <V19RollupPlugin />
    </figure>

    <h2>插件系统双构成</h2>
    <p>
      Vite 的插件系统就是「Rollup 插件 + Vite 扩展」：Rollup 钩子负责构建期的模块处理与产物生成，Vite 独有钩子负责开发服务器、HTML 与 HMR；再用 <code>apply</code> 与 <code>enforce</code> 把插件放到正确的阶段和顺序上。这样既能白拿整个 Rollup 生态，又不会让「只在构建用」的东西拖慢开发。
    </p>
    <div class="lesson-term">
      <span class="term-name">「插件钩子（plugin hook）」</span>指插件对象上的一组约定方法，由 Rollup/Vite 在生命周期的特定时点回调，用来插入自定义逻辑；钩子分同步、异步、串行、并行等调用约定。边界：钩子的触发时机与所属阶段绑定——Rollup 兼容钩子在开发模式下<strong>并非全部执行</strong>（如 <code>generateBundle</code> 只在 build 触发），所以绝不能假设某个钩子在两种模式下都会跑。
    </div>
  </LessonArticle>
</template>
