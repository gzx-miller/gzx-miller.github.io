<script setup lang="ts">
import X17NextImage from './X17NextImage.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>本地图片用得好好的，把 <code>src</code> 换成 CDN 地址却直接报错；而且明明给了宽高，图片加载时那块区域还是先塌下去再被撑开——明明就是放一张图，为什么要这么多讲究？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做课程站的详情页，一页里排着十几张封面图：首屏一张大图，下面跟着一串卡片。上线前你随手用了最朴素的 <code>&lt;img&gt;</code> 标签，本地开发一切正常，可到真机上总有人反馈「页面一开始是空的，图片一出来整页就往下跳」，还有人说流量跑得特别快。
    </p>
    <p>
      图片看起来只是「放一张图」，但它同时牵扯三件独立的事：<strong>文件多大</strong>、<strong>什么时候开始下载</strong>、<strong>没下载完时占多大位置</strong>。这三件事既决定加载快不快，也决定用户第一次看到页面时它稳不稳。原生标签把这三件事全部交给你手工拍板，而问题的根源恰恰就在这里。
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的做法是用原生标签：把地址和替代文本写进 <code>src</code> 与 <code>alt</code>，浏览器就会去取图并渲染。它简单、无依赖，浏览器对它的理解也最透彻，一张图确实能立刻显示出来。
    </p>
    <p>
      这个方案做对的是最底层的一层：<strong>图片能不能显示，只取决于 URL 和网络</strong>。但它把「优化」完全留给了你自己——尺寸是你选的、格式是你导出的、加载时机是浏览器猜的，占位高度则是「加载完才知道」。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>一张 2000px 宽的原图，在手机上只显示 360px，多出来的字节白白下载，浪费带宽与等待时间。</li>
      <li>源文件通常是 JPEG/PNG，不会按浏览器能力自动转成体积更小的 WebP/AVIF。</li>
      <li>不写宽高时，图片到达前占位高度是 0，加载完成后把下方内容往下顶，这就是布局抖动（CLS）。</li>
      <li>页面里几十张图默认同时开始下载，首屏之外的长列表也在抢带宽，拖慢真正重要的首图。</li>
      <li>想「手机上给窄图、桌面上给宽图」，得自己手写 <code>srcset</code> 与 <code>sizes</code>，容易写错也容易忘。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻原生标签，而是给「放一张图」补上一层自动化的优化：Next.js 的 <code>next/image</code>。你仍然只是写一个图片组件，但它会<strong>按设备生成合适尺寸的 AVIF/WebP、默认懒加载，并按你给的尺寸预留位置</strong>。
    </p>
    <p>
      第一步先区分图片来源。本地图片用 <code>import</code> 引入，导入对象自带宽高，组件就能自动防抖并自动生成模糊占位图；远程图片则要在 <code>next.config.js</code> 里配置 <code>remotePatterns</code> 域名白名单后才能用。
    </p>
    <p>
      为什么远程图要先「报备」？因为这套优化是靠服务端的图片处理端点完成的，它只会处理你明确信任的域名。这是一道安全边界：若不设限制，任何人都能拿你的站点当代理，去处理和缓存任意第三方图片。所以白名单没配好时，问题往往不在浏览器，而是运行时抛出的配置错误。
    </p>
    <p>
      第二步是告诉组件这张图占多大位置，这是消除抖动的关键。有两种写法：显式写 <code>width</code> 与 <code>height</code>；或尺寸不确定时用 <code>fill</code>，让图片铺满父容器——此时父元素要设成 <code>position: relative</code>，否则它不知道该填多大。
    </p>
    <p>
      第三步是把「什么时候加载」和「加载时显示什么」一并管起来。首屏大图加 <code>priority</code>，它会提前预加载，直接影响最大内容元素（LCP）的到达时间；其余图片保持默认懒加载，进入视口才开始下载。用 <code>placeholder="blur"</code> 可以先铺一层低质量模糊图，减少图片「啪」地跳出来的突兀感——本地导入的图片会自动生成这张占位图，远程图则要你提供 <code>blurDataURL</code>。
    </p>
    <p>
      最后是响应式。用 <code>sizes</code> 声明「不同视口下这张图实际显示多宽」，组件就会配合底层 <code>srcset</code> 生成多档尺寸，浏览器只下载当前视口真正需要的那一档。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>远程图片不配置 <code>remotePatterns</code> 会在运行时报错，而不是构建时就提醒你；另外 <code>width</code> 与 <code>height</code> 要按<strong>实际展示大小</strong>来设，源图再大也只按这个尺寸处理，设得过大等于白白增加带宽与处理开销。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>对照下面这份清单，看看一张图从「能显示」到「显示得好」还需要补哪些能力。</figcaption>
      <X17NextImage />
    </figure>

    <h2>总结</h2>
    <p>
      图片优化的本质，是把「多大、何时下、占多大位置」从人的手工决策，变成组件能自动完成的默认行为。本地图用 <code>import</code>、远程图配白名单，尺寸用 <code>width</code> 与 <code>height</code> 或 <code>fill</code> 交代清楚，首图加 <code>priority</code>、其余交给懒加载——加载变快，抖动也随之消失。
    </p>
    <div class="lesson-term">
      <span class="term-name">「按需图片优化」</span><code>next/image</code> 的 <code>Image</code> 组件会按设备生成合适尺寸的 AVIF/WebP、默认懒加载，并通过 <code>width</code> 与 <code>height</code> 或 <code>fill</code> 预留位置以消除 CLS；本地图片需 <code>import</code>（自带尺寸与模糊占位），远程图片需在 <code>next.config.js</code> 配置 <code>remotePatterns</code> 白名单，首屏 LCP 图片用 <code>priority</code> 预加载。
    </div>
  </LessonArticle>
</template>
