<script setup lang="ts">
import V08Build from './V08Build.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只改了一个页面的文案，重新构建上线；用户刷新后，浏览器却把整个 2MB 的入口包从头下载了一遍——为什么改一个字，要让所有人把整个应用重下？
    </div>

    <h2>开发生产差异</h2>
    <p>
      开发阶段 Vite 按模块加载源码，生产阶段要切换成 Rollup，把源码打包成少量静态文件。可一旦打包，所有代码就被塞进了少数几个 bundle，于是两个后果同时出现：<strong>任意一处改动都会改变整个 bundle 的内容哈希，用户手里的缓存全部失效</strong>；<strong>首屏必须下载整个 bundle</strong>，哪怕其中大部分页面和组件当前根本用不到。
    </p>
    <p>
      退回「全部打进一个 bundle」的老办法，人要付出的隐藏成本是：首屏体积随功能线性膨胀；一次小改动就让全局缓存作废；低频页面也没法延迟到真正访问时再加载。于是问题很清楚：怎么让「改动的部分」和「没改动的部分」，在产物层面对应成不同的文件？
    </p>

    <h2>单包默认行为</h2>
    <p>
      最直接的做法：交给 Rollup 的默认行为，把入口打包成一个 bundle 就行。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把散落的源码模块收敛成少数静态文件</strong>，浏览器不再为每个源码文件各发一次请求，加载变得可控。
    </p>

    <h2>整包缓存粒度</h2>
    <ul>
      <li>单一大 bundle：首屏必须把它整包下完才能渲染，里面却混着大量当前页面用不到的代码。</li>
      <li>缓存粒度是整包：改一行文案，bundle 的内容哈希就变，用户缓存全部作废。</li>
      <li>依赖与业务代码混在一起：升级一次业务逻辑，连没变的 <code>vue</code>、UI 库也要跟着重下。</li>
      <li>无法按需加载：像「关于我们」这类低频页面，没必要在首页就下载。</li>
    </ul>

    <h2>动态导入分割</h2>
    <p>
      先补「按需加载」。代码分割的入口是动态 <code>import()</code>：把路由组件改成 <code>() =&gt; import('./views/Home.vue')</code>，Rollup 就会为每个动态 import 生成一个独立 chunk，首屏只加载首屏需要的部分，其余页面等用户真正进入时再下。这是所有分割的前提——<strong>缺少动态 <code>import()</code>，Rollup 只能产出单一大 chunk</strong>。
    </p>
    <p>
      接着补「分包策略」。动态 import 按页面切了，可多个页面往往都要用 <code>vue</code>、UI 库这些公共依赖，若每个页面各自带一份就重复了。于是用 <code>rollupOptions.output.manualChunks</code> 把依赖按组拆开，例如把 <code>vue</code> 生态归入 <code>vue-vendor</code>、UI 库单列、工具库归入 <code>utils</code>。分完之后，<code>vue-vendor</code> 只有在框架真正升级、内容变化时哈希才变；平时改业务代码，用户浏览器里这份大依赖的缓存纹丝不动。
    </p>
    <p>
      再补「压缩」。分割决定「下多少个文件」，压缩决定「每个文件传多小」。默认 <code>minify: 'esbuild'</code>，胜在快；想要更高压缩率、还想顺手删掉 <code>console</code>，就切到 <code>minify: 'terser'</code> 并配 <code>terserOptions.compress.drop_console</code>。这是速度与体积的权衡：esbuild 快而够用，terser 慢一点但更小。
    </p>
    <p>
      最后定「阈值与目标」。<code>chunkSizeWarningLimit</code>（默认 500kb）只控制构建时的体积警告，<strong>并不改变分包行为</strong>，看到某个 chunk 超过阈值不等于它必须被拆——但要去查是哪个依赖把它撑起来的。<code>build.target</code> 决定语法降级的目标，面向现代浏览器时可以适当提高，少做降级，产物更小。
    </p>
    <div class="lesson-box warn">
      <strong>两点提醒：</strong>分包不是越细越好，拆得过散会让请求数暴涨，建议按「变更频率」归组（框架 / UI 库 / 工具库分开即可，不必每个包一个 chunk）；<code>chunkSizeWarningLimit</code> 只影响警告，不改实际产物，别把它当成分包开关。
    </div>

    <h2>分包与压缩取舍</h2>
    <figure class="lesson-figure">
      <figcaption>切 split / lazy / minify 三个页签，分别看手动分包怎么写、路由懒加载怎么配，以及 esbuild 与 terser 两种压缩方式怎么取舍。</figcaption>
      <V08Build />
    </figure>

    <h2>按变更频率分块</h2>
    <p>
      生产构建优化串起来是一条线：用动态 <code>import()</code> 让页面按需加载，用 <code>manualChunks</code> 把稳定的大依赖单独成块以便长期缓存，用 <code>minify</code> 决定每个文件的最终大小。核心判断只有一个——<strong>设法让「会变的东西」和「不变的东西」输出成不同的文件</strong>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「代码分割」</span>指把打包产物切成多个 chunk，让浏览器按需加载而不是一次性下载整个应用。触发方式是动态 <code>import()</code>，<code>manualChunks</code> 决定依赖如何归组。边界：每个动态 import 都会新增一次网络请求，<strong>分割不是越多越好</strong>；缓存收益的关键在于按「变更频率」归组，而不是把包拆到最细。
    </div>
  </LessonArticle>
</template>
