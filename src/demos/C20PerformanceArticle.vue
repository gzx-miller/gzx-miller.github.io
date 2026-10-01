<script setup lang="ts">
import C20Performance from './C20Performance.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只给一个小方块加了个悬停上浮效果，在你的机器上丝般顺滑，到同事的旧笔记本上却是整个列表都在抖——明明只动了一个小方块，为什么卡的是整页？
    </div>

    <h2>提出问题</h2>
    <p>
      设想你要给课程列表做一个「悬停轻微上浮」的交互：鼠标移到卡片上，卡片向上移 4px、稍微放大一点。你写了 <code>transition: all 0.3s</code>，再在 <code>:hover</code> 里改一下 <code>top</code> 或者 <code>margin</code>，本机跑起来完全没有问题。
    </p>
    <p>
      真正的代价出现在别的地方：列表有几百条数据，用户往下滚动时开始掉帧；切换主题时整页闪一下；首屏白屏的时间比预期长。你第一反应是「是不是 CSS 写太多了」，可压缩之后并没有变好。<strong>要找到原因，得先知道浏览器把一张网页画到屏幕上，中间到底做了哪几步。</strong>不知道这条流水线，就只能凭感觉乱试，改了半天也只是碰运气。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的诊断是「减体积」：压缩 CSS、删掉没用到的规则、把文件合并起来。
    </p>
    <p>
      这个方向确实做对了最基础的一层——<strong>样式规则越少，浏览器做样式计算时匹配的选择器就越少</strong>。在一个样式表极度臃肿的老项目里，删掉几万行无用规则，确确实实能换来肉眼可见的提升。所以「先瘦身」是合理的起手式，只是它不解决开场那个问题。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>大多数「滚动卡顿、动画掉帧」的瓶颈不在样式体积，而在每一帧都要重新计算布局。</li>
      <li>你分不清哪些属性改动会让浏览器做完整重排、哪些只是重绘，改起来全靠猜。</li>
      <li>听说 <code>will-change</code> 能开 GPU 加速，于是到处加，结果显存吃满、反而更卡。</li>
      <li>长列表里几百个屏幕外的元素仍然被逐个渲染，白白耗费算力。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      换个角度：先把渲染拆成<strong>四个阶段</strong>来看——<strong>样式计算 → 布局（Layout） → 绘制（Paint） → 合成（Composite）</strong>。改一个属性时，浏览器要重跑的起点各不相同：有的要从布局开始全量重算，这就是<strong>重排</strong>；有的只重新画像素，这是<strong>重绘</strong>；有的连像素都不用重画，只在合成阶段变换图层。成本从高到低，正好就是这个顺序。于是第一条原则浮出来了：<strong>尽量把变动按在流水线的末端</strong>。哪些属性落在哪一段，看这张表就清楚了。
    </p>
    <table>
      <thead>
        <tr>
          <th>改动的属性</th>
          <th>触发阶段</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>width</code>、<code>height</code>、<code>margin</code>、<code>padding</code>、<code>border-width</code></td>
          <td>重排</td>
          <td>盒子的尺寸与占位改变，需要重新计算布局</td>
        </tr>
        <tr>
          <td><code>top</code>、<code>left</code>、<code>right</code>、<code>bottom</code></td>
          <td>重排</td>
          <td>普通定位偏移会改变几何位置</td>
        </tr>
        <tr>
          <td><code>font-size</code>、<code>line-height</code></td>
          <td>重排</td>
          <td>文字盒尺寸变化，牵连整段流式布局</td>
        </tr>
        <tr>
          <td><code>display</code>、<code>position</code>、<code>float</code></td>
          <td>重排</td>
          <td>改变元素的布局参与方式，范围最大</td>
        </tr>
        <tr>
          <td><code>color</code>、<code>background-color</code>、<code>border-color</code></td>
          <td>重绘</td>
          <td>几何不变，只需重新画一遍像素</td>
        </tr>
        <tr>
          <td><code>box-shadow</code>、<code>outline</code>、<code>visibility</code></td>
          <td>重绘</td>
          <td>不改变占位，但像素结果变化</td>
        </tr>
        <tr>
          <td><code>background-image</code></td>
          <td>重绘</td>
          <td>重新绘制背景图层</td>
        </tr>
        <tr>
          <td><code>transform</code>、<code>opacity</code></td>
          <td>合成</td>
          <td>可直接由合成器处理，不重排也不重绘</td>
        </tr>
      </tbody>
    </table>
    <p>
      这张表直接解释了开场那个交互该怎么重写：把 <code>top: -4px</code> 换成 <code>transform: translateY(-4px)</code>，把 <code>margin</code> 的变化换成 <code>scale()</code>，位移和缩放就从「重排」降到了「合成」。同理，淡入淡出要动 <code>opacity</code>，而不是 <code>background</code> 或 <code>height</code>。<strong>动画只碰 <code>transform</code> 和 <code>opacity</code>，应当作为默认策略。</strong>
    </p>
    <p>
      想让某个元素的动画更稳，可以用 <code>will-change</code> 提前告诉浏览器「这个属性马上要变」，让它预先把这个元素提升为独立的合成层，省掉动画开始那一瞬的建层开销。但它是一把双刃剑：<strong><code>will-change</code> 会持续占用 GPU 内存，大面积滥用会让显存吃紧、帧率反而下降</strong>。正确用法是只在真正要开始动画前设置、动画结束就移除，而不是在全局样式里给所有元素都挂上。
    </p>
    <p>
      长列表的问题可以用同一套思路解决：屏幕外的内容根本没人看，为什么还要完整渲染？<code>content-visibility: auto</code> 会让浏览器跳过离屏元素的渲染工作，滚到附近再补上。但它有一个必须成对出现的搭档——<code>contain-intrinsic-size</code>，用来告诉浏览器「这块内容大概多高」。少了它，元素会在「被跳过」和「测出真实高度」之间来回切换，滚动条就会跳。注意这个值只是估算，填得太随意同样会导致滚动条轻微抖动，所以最好先测量再填。
    </p>
    <p>
      还有两类成本不发生在动画里，而发生在页面加载时。<strong>一是渲染阻塞</strong>：<code>@import</code> 会让浏览器串行地等一层层 CSS 下载完才开始渲染，尽量改用 <code>&lt;link&gt;</code> 或交给打包工具合并；非关键样式可以用 <code>media="print"</code> 配合 <code>onload</code> 切回 <code>all</code>，让它在首屏之外下载，关键 CSS 则用 <code>preload</code> 提前取。<strong>二是选择器匹配</strong>：浏览器解析选择器是<strong>从右往左</strong>的，<code>.page .content .list .item .link</code> 会先找出所有 <code>.link</code>，再逐级向上验证祖先，嵌套越深匹配越慢。所以能用一个类名直指目标，就别写五层后代；同理，尽量别把通配选择器和属性选择器放在关键位置。
    </p>
    <p>
      还有两个容易忽略的细节。字体加载时用 <code>font-display: swap</code>，可以让文字先用后备字体渲染、字体到位后再替换，避免「看不见文字」的 FOIT。而在脚本里连续读写布局属性——先改宽度、再读高度、再改宽度——会强制浏览器<strong>同步布局</strong>，一帧内反复重排，也就是常说的 layout thrashing；正确做法是批量读、批量写，中间不穿插。此外，<code>contain: strict</code> 可以直接告诉浏览器「这个元素内部的变化不会影响外部」，把渲染范围圈起来。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换 will-change、图层提升与 content-visibility 几页，对比「提升图层」和「滥用图层」的差别。</figcaption>
      <C20Performance />
    </figure>

    <h2>总结</h2>
    <p>
      CSS 性能的抓手可以归成一句话：<strong>让改动尽量落在渲染流水线的末端</strong>。动画优先 <code>transform</code> 与 <code>opacity</code>；<code>will-change</code> 按需取用而非滥用；长列表用 <code>content-visibility</code> 配 <code>contain-intrinsic-size</code> 跳过离屏渲染；样式层面避免 <code>@import</code> 与过深的选择器嵌套；操作层面避免频繁读写布局属性引发同步布局。
    </p>
    <div class="lesson-term">
      <span class="term-name">「重排与重绘」</span>描述属性变化之后，浏览器必须重跑渲染流水线的哪一段。改 <code>width</code>、<code>height</code>、<code>margin</code>、<code>top</code> 等尺寸与位置属性会触发<strong>重排</strong>（重新计算布局），改 <code>color</code>、<code>background-color</code>、<code>box-shadow</code> 只会触发<strong>重绘</strong>，而 <code>transform</code> 与 <code>opacity</code> 可以只走<strong>合成</strong>、不重排也不重绘。动画优先用后两者，是性能优化里最省力的一步。
    </div>
  </LessonArticle>
</template>
