<script setup lang="ts">
import C13ViewportUnits from './C13ViewportUnits.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>移动端用 <code>height: 100vh</code> 做整屏首屏，底部却总有一截被浏览器地址栏盖住——明明写的是「一整屏高度」，为什么到手却不满？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做一个落地页：首屏 hero 区要占满整屏，下面是一个「刚好能放下 20 个字符」的搜索框，再往上还有一套按钮尺寸，希望用户放大字号时整体跟着变大。三件小事，全都卡在同一个决定上——<strong>长度的基准取谁</strong>。
    </p>
    <p>
      拿 <code>16px</code> 这样的定值去写，屏幕一变、设备一换就追不上；可一旦换成相对单位，又得先回答「相对于什么」。单位选择不是记忆题，而是一道基准题：<strong>基准定错，算出来的尺寸就永远差一口气</strong>。不掌握它，你会得到被遮挡的首屏、靠猜宽度的输入框，以及一改字号就散架的布局。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：所有尺寸一律用像素。<code>height: 640px</code>、<code>width: 300px</code>、<code>font-size: 16px</code>。这个方案做对了一件事：<strong>基准是死的，结果就确定</strong>。设计稿标多少就写多少，屏幕上量出来分毫不差。
    </p>
    <p>
      在固定尺寸的屏幕上，这套写法完全够用。麻烦出在「屏幕不是固定的」这个前提上。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>设备宽度从 320px 到 1440px 不等，写死 300px 的卡片在宽屏里显得孤零零，在窄屏里又可能溢出。</li>
      <li>「占满一整屏」这个需求用像素根本表达不了——你并不知道对方屏幕有多高。</li>
      <li>「刚好容纳 20 个字符」更是写不出来，因为字符宽度随字号变化。</li>
      <li>用户把浏览器默认字号调大以看得更清楚时，你写死的 16px 纹丝不动，可访问性直接失守。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用数值描述尺寸」，而是把「基准」从常量换成环境。第一个自然的想法是百分比，但百分比量的是<strong>包含块</strong>，遇到「想要视口的高度」这种诉求时，根元素本身就没有一个更高的参照物了。所以需要一组直接以视口为基准的单位：<code>vw</code> 与 <code>vh</code>，各占视口宽度、视口高度的 <span class="lesson-kv">1%</span>。<code>width: 100vw</code> 就是整屏宽，<code>height: 100vh</code> 就是整屏高。
    </p>
    <p>
      但整屏高这个诉求在移动端立刻翻车：<code>vh</code> 参照的是<strong>工具栏收起时的最大视口</strong>，可地址栏一展开，可见区域就矮了一截，元素底部被顶出屏幕。为此 CSS 补了三个动态单位：<code>dvh</code> 是<strong>动态视口高度</strong>，跟随工具栏的收起与展开实时变化；<code>svh</code> 取工具栏展开时的最小高度；<code>lvh</code> 取工具栏收起时的最大高度。移动端全屏内容优先用 <code>dvh</code>，就是让「一整屏」真正对齐你眼睛看到的那一屏。
    </p>
    <p>
      还有一对与视口相关的单位值得记住：<code>vmin</code> 取视口较短边的 1%、<code>vmax</code> 取较长边。让一个正方形始终铺满缩放，就写 <code>width: 50vmin</code> 配 <code>height: 50vmin</code>，它跟着较短边缩放，横竖屏切换都不会溢出。
    </p>
    <p>
      接着解决「全局缩放」和「定字符宽」。<code>rem</code> 相对于<strong>根元素字号</strong>，只要在 <code>:root</code> 上写 <code>font-size: 16px</code>，全套尺寸改用 <code>rem</code> 后，改这一处就能整体缩放——用户偏好被尊重，设计稿的倍数关系也保住了。<code>em</code> 则相对于<strong>当前元素字号</strong>，适合「内边距随字号成比例」这类局部关系，但要小心它逐层继承会累乘。<code>ch</code> 是字符 <code>0</code> 的宽度，约等于一个汉字的宽度，用它做输入框宽度就能恰好容纳指定字符数；正文段落限制在 <span class="lesson-kv">60ch ~ 75ch</span>，正是最舒服的阅读行宽。<code>ex</code> 是字母 <code>x</code> 的高度，做细小的垂直对齐时很有用。
    </p>
    <p>
      最后是容器单位 <code>cqw</code> / <code>cqh</code>：它们不看向视口，而看向<strong>最近的容器查询容器</strong>，需要祖先先声明 <code>container-type: inline-size</code>。同一个组件放进宽容器就是大尺寸、放进窄容器就自动变小，这正是组件级自适应的关键——视口没变，容器变了，样式就该跟着变。
    </p>
    <table>
      <thead>
        <tr><th>单位</th><th>基准</th><th>典型用途</th></tr>
      </thead>
      <tbody>
        <tr><td><code>vw</code> / <code>vh</code></td><td>视口宽 / 视口高</td><td>整屏布局、视口相关的比例</td></tr>
        <tr><td><code>dvh</code> / <code>svh</code> / <code>lvh</code></td><td>动态 / 最小 / 最大视口高</td><td>移动端全屏，避开工具栏遮挡</td></tr>
        <tr><td><code>vmin</code> / <code>vmax</code></td><td>视口较短 / 较长边</td><td>随屏幕缩放的正方形</td></tr>
        <tr><td><code>rem</code> / <code>em</code></td><td>根字号 / 当前元素字号</td><td>可全局缩放的尺寸、随字号成比例的内距</td></tr>
        <tr><td><code>ch</code> / <code>ex</code></td><td>字符 0 宽 / 字母 x 高</td><td>输入框定字符宽、正文最佳行宽</td></tr>
        <tr><td><code>cqw</code> / <code>cqh</code></td><td>容器宽 / 容器高</td><td>组件级响应式，随宿主容器变化</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>一条实践红线：</strong>字号与间距尽量不要用绝对单位。缩放与用户偏好场景下，绝对单位会让布局彻底失去弹性——该跟着字号走的地方，请交给 <code>rem</code> 与 <code>em</code>。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>逐项切换单位按钮，看同一个盒子在不同基准下的实际尺寸差在哪。</figcaption>
      <C13ViewportUnits />
    </figure>

    <h2>总结</h2>
    <p>
      选单位的本质是选基准：视口相关的交给 <code>vw</code> / <code>vh</code>，移动端全屏改用 <code>dvh</code>；可全局缩放的用 <code>rem</code>，随字号联动的内距用 <code>em</code>；要定字符数就交给 <code>ch</code>；组件要看的是容器而不是视口，那就用 <code>cqw</code> / <code>cqh</code>。基准选对，自适应几乎是自动发生的。
    </p>
    <div class="lesson-term">
      <span class="term-name">「视口单位与容器单位」</span>是一组以环境尺寸为基准的长度单位：<code>vw</code> / <code>vh</code> 以视口宽高为基准各占 1%，其中 <code>dvh</code> 会随移动端工具栏动态变化，比固定的 <code>vh</code> 更贴近可见区域；<code>cqw</code> / <code>cqh</code> 以最近的容器查询容器为基准，需配合 <code>container-type</code> 使用。搭配 <code>rem</code>（相对根字号）与 <code>ch</code>（字符 0 宽度），即可分别覆盖可缩放的全局尺寸与定字符宽的输入框。移动端全屏优先 <code>dvh</code>，绝对单位避免用于字号与间距。
    </div>
  </LessonArticle>
</template>
