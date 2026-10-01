<script setup lang="ts">
import V15Perf from './V15Perf.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>三个月里产物从 <code>800KB</code> 涨到了 <code>3MB</code>，首屏肉眼可见地变慢；你凭经验删掉几处 <code>console</code>、又把一张大图压小，重新构建，体积数字几乎没动——那两兆的增长，根本不在你以为的地方。
    </div>

    <h2>产物体积盲区</h2>
    <p>
      想优化体积，可 bundle 是一个（或几个）黑盒文件：你只看到总大小，看不到<strong>「哪一块占了多少」</strong>。于是只能凭经验猜——怀疑是 UI 库、怀疑是某张图、怀疑是压缩没开——猜中纯属运气。旧办法要人承担的成本有三项：没有数据只能反复试错；改完无法量化，不知道到底有没有变小；没有参照，也就无从判断「多大才算超标」。
    </p>
    <p>
      所以问题必须先转向测量：<strong>怎么先量出「哪个依赖占了多大」，再对症下药？</strong>不先归因就优化，等于蒙着眼睛修 bug。
    </p>

    <h2>体积报告生成</h2>
    <p>
      最直接的做法：先测量。用 <code>rollup-plugin-visualizer</code> 在构建后生成一份 <code>stats.html</code> 报告，它是张 treemap——每个模块用一块矩形的面积表示体积占比，一眼就能看出谁大谁小。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把黑盒拆成了可归因的构成</strong>。在此之前你只有「3MB」这一个数字；在此之后，你知道这 3MB 里有多少是框架、多少是被整包导入的工具库、多少是图片。优化这件事，从此有了靶子。
    </p>

    <h2>整包导入成因</h2>
    <ul>
      <li>报告只告诉你「谁大」，不告诉你「为什么大」——<code>lodash-es</code> 占了 500KB，是因为整包导入，而不是它本身必须这么大。</li>
      <li>测量本身有成本：visualizer 每次构建都跑，会拖慢日常开发和 CI。</li>
      <li>产物体积是压缩后的，只看总大小看不出 gzip / brotli 传输时到底多大。</li>
      <li>开发阶段「首次访问某页要等依赖转译」的慢，和构建产物的体积是两码事，用一套办法治不了。</li>
      <li>改完没有留底对比，下次只会重新猜一遍。</li>
    </ul>

    <h2>按需测量开关</h2>
    <p>
      先补「只在需要时测量」。把 visualizer 放进 <code>if (process.env.ANALYZE)</code> 里，日常构建不生成报告，避免拖慢 CI；要分析时执行 <code>ANALYZE=true vite build</code>。同时开启 <code>gzipSize</code>，报告里就能看到传输时更真实的压缩后大小。
    </p>
    <p>
      再补「读懂报告」。打开 <code>stats.html</code>，按面积从大到小往下找，通常就是两类问题：<strong>整包导入</strong>的大依赖，和<strong>被顺带打包</strong>、其实用不到的库。
    </p>
    <p>
      接着补「对症下药」，对应三种典型手段：
    </p>
    <ol class="lesson-steps">
      <li>改按需引入：把整包导入换成只引入用到的那一个函数，例如直接 import 单文件路径。</li>
      <li>换成更轻的替代库：如把体积偏大的 <code>moment</code> 换成 <code>dayjs</code>。</li>
      <li>外部化交给 CDN：用 <code>rollupOptions.external</code> 把大型库排除出产物，再配 <code>output.globals</code> 映射到全局变量。</li>
    </ol>
    <p>
      再补「复核」。改完用 <code>manualChunks</code> 重新分包，再跑一次报告，把优化前后两份<strong>并排对比</strong>，用数据确认收益；同时设 <code>chunkSizeWarningLimit</code> 作为体积警戒线，防止以后悄悄反弹。
    </p>
    <p>
      最后补「开发侧的那条线」。构建体积和开发启动是两回事：用 <code>server.warmup.clientFiles</code> 预热高频入口（如 <code>main.ts</code>、<code>App.vue</code>、<code>router/index.ts</code>），用 <code>optimizeDeps.include</code> 提前预构建常用依赖，把「首次访问某页要等转译」的等待压下去。
    </p>
    <div class="lesson-box warn">
      <strong>一条最容易被忽略的方法论：</strong>优化前先存一份报告，改完再存一份，<strong>用两份报告对比来证明收益</strong>，而不是凭感觉说「应该小了吧」。另外，visualizer 平时不要常驻插件数组——它是分析工具，不是构建必需品。
    </div>

    <h2>报告与三类手段</h2>
    <figure class="lesson-figure">
      <figcaption>切 analyze / optimize / metrics 三个页签：先看可视化报告怎么生成与阅读，再看三种体积优化手段怎么写，最后看构建与开发两侧的性能指标该如何监控。</figcaption>
      <V15Perf />
    </figure>

    <h2>测量与归因次序</h2>
    <p>
      性能优化这件事，顺序不能反：<strong>先测量，再归因，最后对症下药</strong>。visualizer 的 treemap 把黑盒拆成可归因的构成，你据此决定是改按需引入、换更轻的库，还是外部化交给 CDN；改完再用报告复核，用数据而不是感觉确认收益。别忘了一件事——构建体积和开发启动是两条独立的线，各有各的优化手段。
    </p>
    <div class="lesson-term">
      <span class="term-name">「treemap（矩形树图）」</span>是 <code>rollup-plugin-visualizer</code> 生成的报告形式：用嵌套矩形的<strong>面积</strong>表示各模块在 bundle 中的体积占比，面积越大说明它占得越多，便于从大到小定位「体积大户」。边界：它展示的是打包产物的体积构成，<strong>不等于运行时开销</strong>，也不代表某块大就一定该优化——要结合它是否真的被用到、能否按需引入来判断；<code>gzipSize</code> 打开后看到的是传输时的压缩大小，和磁盘上的原始体积并不相同。
    </div>
  </LessonArticle>
</template>
