<script setup lang="ts">
import V04HMR from './V04HMR.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在一个多步表单里填了半小时，最后只改了一行 CSS 的颜色，保存后整页刷新——所有输入、展开的折叠面板、滚到的位置，全部回到初始状态。
    </div>

    <h2>提出问题</h2>
    <p>
      这个体验的根源是传统刷新：文件一改，整个页面重新加载，运行时的所有状态随之清零。你只是想看一个颜色的变化，却被迫重新走一遍操作路径。更隐蔽的代价在调试上——复现一个偶发问题时，你通常要点开三四层菜单、填一堆值，页面一刷新，这些前置动作全部白做。
    </p>
    <p>
      能不能「只换掉改动的那个模块」，让页面其余部分和它的运行时状态原封不动？难点在于：一个模块被改动后，<strong>谁该被替换、谁必须保留、状态又该挂在哪里</strong>——没有一套边界规则，根本说不清替换的范围。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：文件保存后就让浏览器整页刷新（live reload）。新代码立刻可见，行为也完全可预期。
    </p>
    <p>
      这个方案做对了一件事：<strong>它保证了「你看到的永远是改完后的代码」</strong>，不会出现新旧代码混用的假象。只要你不介意丢失状态，它就够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>运行时状态全丢：<code>ref</code> 里的值、表单输入、滚动位置、弹窗开关，全部回到初始值。</li>
      <li>层级越深的页面刷新越慢，一个改样式的动作要等整棵树重建完。</li>
      <li>它无法只重建某个组件——哪怕你只动了 CSS，整个应用也要重来一遍。</li>
      <li>调试偶发问题时，每次刷新都得重做一遍前置操作，效率极低。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「替换成新代码」，而是把替换的<strong>粒度</strong>从「整页」缩小到「模块」。Vite 的 HMR 建立在原生 ESM 的模块边界上：每个模块都是一条边界，文件改动后，服务器沿着 <code>import</code> 链<strong>向上</strong>寻找最近的「接受者」。
    </p>
    <p>
      先补「谁来接受」。一个模块只要写下 <code>import.meta.hot.accept()</code>，就声明了自己可以被热替换；如果一路往上都找不到任何接受者，更新就会持续冒泡，最终退化成整页刷新。这是理解 HMR 的第一条规则：<strong>替换范围由接受者决定，而不是由文件决定</strong>。
    </p>
    <p>
      再补「框架为什么开箱即用」。你写 Vue 时从没手动写过 <code>accept</code>，是因为 <code>@vitejs/plugin-vue</code> 已经为每个 SFC 注入了接受逻辑；React 侧则由 <code>@vitejs/plugin-react</code> 的 Fast Refresh 负责。框架插件替你标好了边界。
    </p>
    <p>
      接着补「状态怎么跨更新存活」。新模块会生成新的导出，如果状态保存在模块级变量里，你需要用 <code>import.meta.hot.dispose()</code> 在替换前清理旧模块，再在 <code>accept</code> 回调里把新导出接到旧的引用上；更稳妥的做法是把状态放进 Pinia 这类独立 store，因为 <strong>store 不在被替换的模块里，自然不受影响</strong>。
    </p>
    <p>
      最后补不同文件类型的行为差异。Vue SFC 里，改 <code>&lt;template&gt;</code> 或 <code>&lt;style&gt;</code> 通常不丢状态；而改 <code>&lt;script setup&gt;</code> 的逻辑时会重建组件实例，模块级状态会重置。
    </p>
    <div class="lesson-box warn">
      <strong>两个必记的坑：</strong>手动 HMR 代码一定要包在 <code>if (import.meta.hot)</code> 守卫里，因为生产构建中 <code>import.meta.hot</code> 是 <code>undefined</code>，不加守卫会直接报错；其次，<code>accept</code> 的回调里要<strong>主动应用新模块的导出</strong>，只写个空回调，界面不会随更新变化。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换 hmr / vue / react 三个页签，看手动声明接受者的写法、Vue SFC 三种代码块的更新差异，以及 React Fast Refresh 的规则。</figcaption>
      <V04HMR />
    </figure>

    <h2>总结</h2>
    <p>
      热更新的本质，是给「替换」划一条边界。模块用 <code>accept</code> 声明自己可以接受更新，更新就沿 <code>import</code> 链向上冒泡到最近的边界为止；找不到边界，才退化成整页刷新。想让状态活下来，就把它放到边界之外——比如 Pinia store。
    </p>
    <div class="lesson-term">
      <span class="term-name">「HMR 边界」</span>指一个模块通过 <code>import.meta.hot.accept</code> 声明自己可被热替换（或可接受某个依赖的更新）后所形成的替换范围。边界：更新沿 import 链向上传播，遇到最近的边界即停止，没有边界就整页刷新；这套代码只在 <code>if (import.meta.hot)</code> 内有效，生产构建中该对象不存在。
    </div>
  </LessonArticle>
</template>
