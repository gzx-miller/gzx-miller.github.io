<script setup lang="ts">
import C09MediaQuery from './C09MediaQuery.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>按桌面稿把卡片排成三列，到了手机上挤成一团，于是我补一条 <code>max-width</code> 改成两列，再补一条改成单列——断点越加越多，可样式为什么越来越难猜？
    </div>

    <h2>多端布局适配</h2>
    <p>
      同一套 HTML，要在手机、平板、桌面上呈现出不同的布局：宽屏并排四张卡片，窄屏收成一列。你无法为每种设备各写一个页面，只能用一份结构配上会"看尺寸做事"的样式。这就是媒体查询要解决的问题。
    </p>
    <p>
      代价藏在「覆盖」两个字里。屏幕尺寸是连续变化的，而断点是离散的；每多一个断点，就有更多规则在同一个元素上竞争，你越来越说不清「在某个宽度下，最终是哪条规则赢了」。一旦断点的书写方向不统一，样式表就会变成一场谁覆盖谁的猜谜——而 CSS 只按顺序和权重裁决，从不替你兜底。
    </p>

    <h2>桌面优先写法</h2>
    <p>
      最朴素的做法是<strong>桌面优先</strong>：先按最宽的设计稿把三列布局写好，再用 <code>@media (max-width: …)</code> 逐级往下收，窄屏时把列数减少。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>让规则随尺寸条件性地生效</strong>。宽屏体验被优先保证——毕竟在大屏幕上开发、看得最多的也是大屏，桌面优先对"以 PC 为主"的项目是很自然的心智模型。
    </p>

    <h2>递减式覆盖负担</h2>
    <ul>
      <li>它从<strong>最复杂的形态起步</strong>，小屏要一路写覆盖回退，越往下补丁越多。</li>
      <li>每条 <code>max-width</code> 都在「减」东西，删不准、漏一处，窄屏就露出没收回来的样式。</li>
      <li>靠书写先后决定胜负，两条断点顺序一旦颠倒，结果就悄悄变了。</li>
      <li>新增一种尺寸要不断往回打补丁，断点之间还容易重叠、互相打架。</li>
    </ul>

    <h2>移动优先与递增</h2>
    <p>
      不推翻「条件生效」，只把书写方向反转过来——这就是<strong>移动优先</strong>。先写小屏的默认样式（最简单的单列布局），再用 <code>@media (min-width: …)</code> 逐级<strong>增强</strong>：
    </p>
    <p>
      基础样式 <code>.card-list { grid-template-columns: 1fr; }</code>；接着 <code>@media (min-width: 768px)</code> 改两列、<code>@media (min-width: 1024px)</code> 改三列、<code>@media (min-width: 1280px)</code> 改四列。每条只"加"不"减"，屏幕越宽、规则越叠越丰富，后写的自然覆盖前面的，顺序天然稳定。手机这一端拿到的是最简布局，也从不需要为它单独写回退。
    </p>
    <p>典型的断点可以按用途收敛成一张简表，别绑死在具体机型上。</p>
    <table>
      <thead>
        <tr><th>断点</th><th>典型值</th><th>用途</th></tr>
      </thead>
      <tbody>
        <tr><td><code>sm</code></td><td><code>640px</code></td><td>宽屏手机，单列起步</td></tr>
        <tr><td><code>md</code></td><td><code>768px</code></td><td>平板，开始并排</td></tr>
        <tr><td><code>lg</code></td><td><code>1024px</code></td><td>小桌面，多列布局</td></tr>
        <tr><td><code>xl</code></td><td><code>1280px</code></td><td>大桌面，充分铺开</td></tr>
      </tbody>
    </table>
    <p>
      为什么 <code>min-width</code> 能越叠越顺、而 <code>max-width</code> 容易打架？因为屏幕越宽、命中的 <code>min-width</code> 条件越多，规则被<strong>逐条追加</strong>，后写的覆盖前面的，生效顺序和尺寸增长的方向天然一致；而 <code>max-width</code> 是屏幕越窄命中越多，规则的生效顺序与尺寸方向相反，稍有错位就会互相盖住。写完别急着提交，用开发者工具的设备模拟在几个宽度之间来回切，逐一核对每一档断点是否都命中了预期的那条规则。
    </p>
    <p>
      媒体查询不只查询宽度，还能查询设备特性，并且可以叠加使用：<code>@media (prefers-color-scheme: dark)</code> 做暗色适配，<code>@media (prefers-reduced-motion: reduce)</code> 关闭动画与过渡，<code>@media (min-width: 768px) and (max-width: 1023px)</code> 精确定位某一段区间，<code>@media (orientation: landscape)</code> 区分横竖屏。
    </p>
    <div class="lesson-box warn">
      <strong>加断点的纪律：</strong>不要把断点绑死在具体设备型号上，而应依据<strong>内容开始"不好看"的临界宽度</strong>来定义——是布局先撑不住了，而不是某款手机到了。断点数量保持精简，2 到 3 档覆盖主要形态即可，每多一个断点，需要验证的尺寸组合都会成倍增加。
    </div>

    <h2>列数随视口递增</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块改变视口宽度，看卡片列数从 1 列逐级增强到 2 列、再到 4 列。</figcaption>
      <C09MediaQuery />
    </figure>

    <h2>媒体查询书写方向</h2>
    <p>
      媒体查询让一套 HTML 能随尺寸条件性地应用样式；而移动优先把它的书写方向理清了：小屏是最简的默认样式，向上用 <code>min-width</code> 逐级增强，只加不减、顺序天然稳定。再叠加深色、减弱动态等媒体特性，断点收敛成少量变量，响应式规则就能既好读又好维护。困扰你的从来不是断点本身，而是「谁覆盖谁」的方向——把方向定成自小向大，混乱自然就散了大半。
    </p>
    <div class="lesson-term">
      <span class="term-name">「移动优先与媒体查询」</span><code>@media</code> 依据视口尺寸与设备特性条件性地应用规则；<strong>移动优先</strong>指先写小屏默认样式，再用 <code>@media (min-width: …)</code> 逐级增强，避免桌面优先下 <code>max-width</code> 反复覆盖的混乱。断点应依据内容临界宽度定义并保持精简，还可叠加 <code>prefers-color-scheme</code>、<code>prefers-reduced-motion</code> 做无障碍适配。
    </div>
  </LessonArticle>
</template>
