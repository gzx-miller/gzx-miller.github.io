<script setup lang="ts">
import SC08Architecture from './SC08Architecture.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>样式文件写到两千行，想改个按钮的圆角得在里面翻半天；更吓人的是，我把一条看起来没人用的规则删掉，整个首页的间距都塌了——样式到底该怎么「分家」，才不会互相牵连？
    </div>

    <h2>提出问题</h2>
    <p>
      项目刚起步时，一个 <code>main.css</code> 撑得住。但样式是<strong>只增不减</strong>的资产：功能越加越多，令牌、组件、页面各自的规则全堆在一起，文件越滚越大。
    </p>
    <p>
      真正的麻烦不是「文件大」，而是<strong>关系不可见</strong>：你无法回答「这个变量被谁用了」「这条规则删掉会影响哪些页面」，只能靠改完刷新页面看有没有坏。维护成本就这样从「读代码」变成了「反复试错」。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：把所有样式写进一个文件，或者用原生 <code>@import</code> 把几个文件按顺序拼起来。
    </p>
    <p>
      <code>@import "reset.css"; @import "button.css"; @import "home.css";</code>
    </p>
    <p>
      这个方案对在哪？小项目里它最简单：浏览器一次请求拿到全部样式，没有构建步骤，<strong>书写顺序就是层叠顺序</strong>，所见即所得。规模不大时，它确实是正确答案。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>顺序即依赖：样式结果取决于文件拼接顺序，依赖关系是隐式的，改顺序就可能出问题。</li>
      <li>全局命名空间：所有成员都在同一层，谁都能引用谁，边界形同虚设。</li>
      <li>无法回答「谁引用了它」——删除任何一条都可能踩到意料之外的页面。</li>
      <li>无法按页面裁剪产物：只想要 admin 的样式，却连 home 的规则一起打包进去。</li>
      <li>编译参数散落在各人的命令行里，本地和流水线的产物可能不一致。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      要解决「关系不可见」，就得把样式从「一串按顺序排列的文件」升级为<strong>一张显式的模块依赖图</strong>。先按职责分层，让每层只依赖它下面的一层：
    </p>
    <ol class="lesson-steps">
      <li><strong>abstracts</strong>：令牌与工具（变量、Mixin、函数），只提供内容、不输出 CSS。</li>
      <li><strong>components</strong>：按钮、卡片等可复用组件，依赖 abstracts，不依赖任何具体页面。</li>
      <li><strong>pages</strong>：页面级样式，可以组合组件，但不该被组件反向依赖。</li>
      <li><strong>入口文件</strong>：只负责装配，把上面各层按需 <code>@use</code> 进来。</li>
    </ol>
    <p>
      然后让依赖变得显式。库作者在 <code>_index.scss</code> 里用 <code>@forward</code> 汇总公共 API，需要时还用 <code>show</code> 收窄导出范围：
    </p>
    <p>
      <code>@forward "abstracts/tokens" show $brand, $space-unit;</code>
    </p>
    <p>
      <code>@forward "abstracts/mixins";</code>
    </p>
    <p>
      应用入口只做一件事——装配模块，绝不在这里写具体样式，保证依赖方向单一：
    </p>
    <p>
      <code>@use "index" as design; @use "base/reset"; @use "components/button"; @use "components/card"; @use "pages/home";</code>
    </p>
    <p>
      这样每个文件都只通过 <code>@use</code> 声明自己需要什么，「谁依赖谁」在源码里一查便知；由于依赖方向固定，也不存在组件反向牵着页面走的情况。注意 <code>@import</code> 已被弃用，新项目应当使用 <code>@use</code> 与 <code>@forward</code>。
    </p>
    <p>
      最后把编译也纳入工程。产物由编译器负责压缩并生成 Source Map，方便出问题时定位回源码：
    </p>
    <p>
      <code>sass --style=compressed --source-map styles/app.scss dist/app.css</code>
    </p>
    <p>
      这条命令应当<strong>固化进 npm script</strong>，让本地开发与 CI 用完全相同的参数，否则「我这边是好的」就会变成常态。
    </p>
    <div class="lesson-box hint">
      <strong>两条实践提醒：</strong>不要照搬目录模板——规模小的项目保持扁平反而更好，分层是为了解决规模问题，不是目的本身；迁移旧项目时，先用 <strong>Sass Migrator</strong> 完成机械改写（比如把 <code>@import</code> 换成 <code>@use</code>），再逐步收紧模块边界，不要一次动太多。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换构建入口，看目录树与最终编译命令如何随页面变化。</figcaption>
      <SC08Architecture />
    </figure>

    <h2>总结</h2>
    <p>
      架构这件事，说到底是在规模化之后<strong>把隐式的东西显式化</strong>：目录按职责分层，依赖用 <code>@use</code>／<code>@forward</code> 声明成图，入口只装配不写样式，编译命令用 npm script 固定下来。这样「谁用了谁」「删掉会怎样」才有答案，样式才敢在增长中继续演进。
    </p>
    <div class="lesson-term">
      <span class="term-name">「模块依赖图」</span>指用 <code>@use</code>／<code>@forward</code> 显式声明模块间关系的组织方式，取代 <code>@import</code> 时代的隐式全局顺序。入口文件只装配模块、不声明具体样式；库作者以 <code>_index.scss</code> 的 <code>@forward</code> 汇总公共 API，必要时用 <code>show</code> 收窄导出。编译命令（<code>--style=compressed --source-map</code>）应固化进 npm script，保证本地与 CI 产物一致；旧项目先跑 Sass Migrator 再收紧边界。
    </div>
  </LessonArticle>
</template>
