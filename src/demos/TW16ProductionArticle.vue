<script setup lang="ts">
import TW16Production from './TW16Production.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>开发时还好好的按钮样式，一上线就没了颜色；我去产物里搜类名，发现它压根没被生成——到底是我写错了，还是构建器「没看见」它？
    </div>

    <h2>主题标签配色</h2>
    <p>
      你在给课程卡片做主题标签：不同状态显示不同颜色，于是写了一段拼接逻辑，通过变量拼出 <code>bg-orange-600</code>、<code>bg-green-600</code> 这样的类名。本地开发一切正常，可打包上线后，标签全变成了「裸奔」的样式。你去构建产物里搜，发现这些类名根本没有出现在生成的 CSS 里。
    </p>
    <p>
      这就是生产的另一面：<strong>Tailwind 生成样式的方式，和你运行时怎么想没有关系。</strong>它不是去运行你的代码、观察你最终加了哪些类，而是在构建时把你的源码<strong>当作纯文本</strong>来「扫描」，找出其中出现的、完整的候选类名，再为这些类按需生成 CSS。理解这句话，就理解了生产排查的全部钥匙。
    </p>

    <h2>安全名单兜底</h2>
    <p>
      遇到「类名缺失」的第一个反应，通常是加一个安全名单（safelist），把所有可能用到的类名都列进去，一劳永逸。这个方案对的地方在于，<strong>它确实能让这些类名出现在产物里</strong>，问题立刻被「压」下去了。
    </p>
    <p>
      但它治标不治本，而且副作用很大：safelist 是一张静态清单，它会<strong>无条件地把列进去的类全部生成</strong>，无论页面是否真的用到。<code>bg-orange-600</code> 到 <code>bg-orange-900</code> 全列一遍，产物体积立刻膨胀，而你真正的设计问题——「为什么类名要让运行时来拼」——被完全掩盖了。
    </p>

    <h2>变量拼接扫描失效</h2>
    <ul>
      <li>用变量拼接出的类名，在扫描时不存在完整字符串，构建器看不见，自然不生成。</li>
      <li>大范围的 safelist 会掩盖架构问题，并让 CSS 产物无谓地膨胀。</li>
      <li>模板文件不在自动检测范围内（如 monorepo 里的外部包、特殊目录）时，里面的类名会被整体漏掉。</li>
      <li>内联来源写得过宽，扫描范围过大，构建速度明显变慢。</li>
      <li>类名缺失与体积过大这两类问题，往往被混在一起盲目试错，缺少系统定位顺序。</li>
    </ul>

    <h2>类名完整字符串</h2>
    <p>
      不推翻「按需生成」，而是顺着它的机制去解决问题。既然<strong>扫描的对象是文本、类名必须完整出现</strong>，那么第一个动作就是把动态拼接改成<strong>完整静态字符串</strong>。与其 <code>bg-${color}-600</code>，不如建一张受控映射表，把 <code>state</code> 映射到写死的完整类名字符串上——这样每个类名都在源码里「完整可见」，扫描器一眼就能找到。
    </p>
    <p>
      第二个动作是处理<strong>来源边界</strong>。Tailwind 会自动检测项目里的源文件，但遇到它管不到的地方，就需要 <code>@source</code> 显式注册。常见场景有三类：
    </p>
    <table>
      <thead>
        <tr><th>场景</th><th>做法</th></tr>
      </thead>
      <tbody>
        <tr><td>monorepo 里的外部包、组件库源码在 <code>node_modules</code></td><td>用 <code>@source "../shared-ui"</code> 显式纳入扫描</td></tr>
        <tr><td>明显无关的目录拖慢构建</td><td>用 <code>@source not "../legacy"</code> 排除</td></tr>
        <tr><td>需要直接注入候选类名</td><td>用 <code>@source inline</code> 内联</td></tr>
      </tbody>
    </table>
    <p>
      注意「组件库源码位于 <code>node_modules</code> 时，需用 <code>@source</code> 显式纳入扫描」这一条，这是 monorepo 项目最常见的「类名集体失踪」原因——库里的类名原本就在构建器的视野之外。
    </p>
    <p>
      第三个动作是<strong>分析产物体积并做优化</strong>。生产构建会负责压缩与缓存，但前提是你的扫描范围是收敛的。如果 <code>@source</code> 注册得过宽，扫描器要处理的文件就会激增，构建变慢、产物也可能混入用不上的样式。这时候可以用 <code>@source not</code> 排除掉那些明显无关的目录，把扫描范围收回到真正需要的部分。
    </p>
    <div class="lesson-box hint">
      <strong>一个通用的验证手段：</strong>在产物中直接搜索关键类名，确认它是否出现在生成的 CSS 里。搜到了，说明扫描没问题，问题在别处；搜不到，就顺着「源码里是否完整出现 → 所在文件是否在扫描范围内」这条链往回查，几乎总能定位到根因。
    </div>
    <p>
      把它串成一套排查顺序：<strong>确认模板文件位于自动检测范围内 → 对特殊来源用 <code>@source</code> 注册明确路径 → 分析产物体积，修复动态拼接与过宽的内联来源 → 在产物中搜索关键类名验证。</strong>这套顺序的价值在于，它让「类名缺失」和「体积过大」这两类问题，从靠猜变成有据可循。
    </p>

    <h2>扫描范围与产出</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑块增加扫描文件数量，观察候选源与最终生成 CSS 之间的关系。</figcaption>
      <TW16Production />
    </figure>

    <h2>源码文本扫描</h2>
    <p>
      生产排查的核心，是牢牢记住 Tailwind 的工作方式：<strong>扫描的是文本，类名必须完整出现</strong>。动态拼接要改成完整静态字符串，扫描不到的来源要用 <code>@source</code> 纳入，范围过宽要用 <code>@source not</code> 排除，而 safelist 只是掩盖问题的止痛药，不是解药。
    </p>
    <div class="lesson-term">
      <span class="term-name">「静态候选检测」</span>指 Tailwind 在构建时把源码当纯文本扫描，找出完整出现的候选类名并按需生成 CSS，而不解析运行时逻辑。约定：动态类名应映射为完整静态字符串而非拼接；<code>@source</code> 用于纳入自动检测范围之外的来源（如 <code>node_modules</code> 中的组件库），<code>@source not</code> 排除无关目录，<code>@source inline</code> 内联候选；大范围 safelist 会掩盖架构问题并膨胀产物。
    </div>
  </LessonArticle>
</template>
