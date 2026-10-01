<script setup lang="ts">
import V21MultiPage from './V21MultiPage.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你按上一课给多页面手工登记了入口，当时只有 3 个页面，一切正常。半年后页面涨到 20 个，每次加一页都要改配置、加 HTML、加脚本、加引用。最吓人的一次是：新人复制了一份页面模板，忘了在配置里登记——本地开发跑得好好的，直到上线后那个页面整页 404，因为它从来没进过构建产物。
    </div>

    <h2>手工入口表代价</h2>
    <p>
      手工维护入口表在页面少时没毛病，页面一多就变成一场「配置项和文件树对齐」的体力活，而且这种对齐<strong>没有任何机制保证</strong>：漏登记不会报错，只会在构建产物里静默缺席。与此同时，多个页面共享的依赖怎么分包，直接决定每个页面的首屏体积和缓存复用率。
    </p>
    <p>
      旧办法的隐藏成本有三样：入口与文件树靠人肉同步，必然漂移；共享依赖分包策略失控——要么每个页面各带一份 <code>vue</code>，总下载量不降反升，要么全塞进一个巨大 vendor，任何小依赖变动都让整包缓存失效；每个页面的 HTML、入口脚本、挂载节点还得一一对上，错一个就白屏。于是问题落在：<strong>能不能让入口表从目录结构自动「长出来」，并让共享依赖按一份清晰的策略分包？</strong>
    </p>

    <h2>目录扫描生成入口</h2>
    <p>
      最直接的做法：用 glob 扫描约定目录下的 HTML，把扫到的目录名当作入口名，动态拼出一张 <code>input</code> 表。
    </p>
    <p>
      这个方案做对了一件事：<strong>入口表不再靠人手写</strong>。因为配置文件可以导出异步函数，扫描能在配置阶段完成；新增页面只要把目录建出来，配置一个字都不用动。
    </p>

    <h2>误纳无关页面</h2>
    <ul>
      <li>扫描模式太宽会误纳：把测试页、废弃的 HTML 也扫进来，构建出一堆没人要的页面，白占体积。</li>
      <li>入口产物命名不加控制，JS 与 HTML 的名字会混乱，缓存策略和线上排查都变得困难。</li>
      <li>只解决入口还不够：共享依赖若不分包，每个页面各带一份 <code>vue</code>，总下载量反而更大。</li>
      <li>各页面若都把挂载节点写成 <code>#app</code>，多个入口混排时容易互相冲突；HTML 和入口脚本也要严格一一对应。</li>
    </ul>

    <h2>约定式动态入口</h2>
    <p>
      先补「动态入口」。约定每个页面独占一个目录、目录里有 <code>index.html</code>，然后用 <code>fast-glob</code> 扫描形如 <code>src/pages/*/index.html</code> 的文件；从每个路径里正则取出目录名作为 key，拼成一张 <code>main</code> / <code>admin</code> / <code>login</code> 之类的映射，整个传给 <code>build.rollupOptions.input</code>。因为 <code>vite.config.ts</code> 支持导出异步函数，这套扫描可以在配置被解析时同步完成，随后立刻参与构建。
    </p>
    <p>
      接着补「把边界收紧」。glob 的模式一定要精确到约定目录，比如只匹配 <code>src/pages/*/index.html</code>，把测试页、模板目录排除在外。约定目录之外哪怕有 HTML，也不会被误纳入构建——这正是防止「页面莫名其妙多出来」的那道闸。
    </p>
    <p>
      再补「共享 chunk 策略」。用 <code>manualChunks</code> 把跨页面共享的依赖按用途分组：<code>vue</code>、<code>vue-router</code>、<code>pinia</code> 归成 <code>vue-vendor</code>，UI 库归成 <code>ui-lib</code>。为什么按用途、而不按单个依赖来拆？因为拆分的依据是<strong>变更频率</strong>：框架版本很少动，单独成块就能长期命中浏览器缓存；业务代码常改，单独成块，改了只作废自己那一块。拆得过细会把一次请求变成好几次，反而更慢。
    </p>
    <p>
      再补「产物命名与目录结构」。用 <code>entryFileNames</code>、<code>chunkFileNames</code>、<code>assetFileNames</code> 把页面 JS、公共依赖、CSS 与图片分到 <code>assets/js</code>、<code>assets/css</code> 之类的子目录里，产物结构一目了然，也方便按目录制定缓存策略。
    </p>
    <p>
      最后补「每个入口的 HTML 与挂载点」。每个页面自己的 <code>index.html</code> 用 <code>&lt;script type="module" src="/src/pages/admin/main.ts"&gt;&lt;/script&gt;</code> 引自己的入口脚本，脚本再挂到各自独立的 DOM 节点（如 <code>#admin-app</code>），别都挤在 <code>#app</code> 上。<code>src</code> 路径要与 <code>input</code> 的键名对应；开发时访问子目录记得带尾部斜杠，才会命中它的 <code>index.html</code>。
    </p>
    <div class="lesson-box warn">
      <strong>两条容易踩的线：</strong>glob 模式务必精确到约定目录，否则测试页、废弃页面会被悄悄纳入构建；<code>manualChunks</code> 按「变更频率」分组、不是越细越好——把每个包都单开一块，会把一次请求打散成好几次。
    </div>

    <h2>构建四页产物</h2>
    <figure class="lesson-figure">
      <figcaption>切 适用场景 / 目录结构 / 配置示例 / 构建演示 四个页签；点「开始构建」，看 <code>dist</code> 里四个 HTML、各页面 JS、共享 vendor chunk 与提取出的 CSS 依次出现，底部三个统计数字正好对应「HTML 页面 / 页面脚本 / 共享依赖」。</figcaption>
      <V21MultiPage />
    </figure>

    <h2>入口自动生长</h2>
    <p>
      多页面进阶要解决的是「页面变多之后」的两件事：入口表用 glob 从目录里自动长出来，边界收在约定目录内，新增页面零改动配置；共享依赖用 <code>manualChunks</code> 按变更频率分组，让框架长期命中缓存、业务改动只作废自己那一块。入口自动化加上清晰的分包策略，MPA 才能在页面数量增长后依然可维护。
    </p>
    <div class="lesson-term">
      <span class="term-name">「manualChunks」</span>是 <code>rollupOptions.output</code> 下用来手动指定依赖归入哪个 chunk 的配置，可写成对象或函数，按「模块路径到 chunk 名」的规则把依赖分到不同产物中。边界：它做的是<strong>归组而非拆包命令</strong>，函数返回 <code>undefined</code> 时交回默认策略；分组粒度应按变更频率来定，而不是给每个包单开一块，否则请求数上升会抵消缓存收益。
    </div>
  </LessonArticle>
</template>
