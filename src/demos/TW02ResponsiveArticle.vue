<script setup lang="ts">
import TW02Responsive from './TW02Responsive.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程卡片在手机上明明是一列，我把窗口拉到桌面宽度，它还是老老实实一条条往下堆——我写的「响应式」，为什么一换大屏就失效了？
    </div>

    <h2>提出问题</h2>
    <p>
      你在做课程列表页，一共三张课程卡片。需求说得很清楚：手机上一列排开，平板上并排两列，桌面上整整齐齐三列。结构只有一份，可用宽度却有好几种，难就难在这里。
    </p>
    <p>
      更麻烦的是屏幕宽度不是几档离散的值，而是一条连续变化的线。有人用 320px 的小手机，有人用 1440px 的宽屏显示器，还有人拖住窗口停在任意中间宽度。你要写的不是「三套页面」，而是<strong>一套会随宽度自动变化的规则</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最直觉的做法是手写媒体查询：默认让网格排一列，再在更宽的宽度上覆盖成两列、三列。
    </p>
    <p>
      默认写 <code>display: grid; grid-template-columns: 1fr;</code>，然后加一段 <code>@media (min-width: 768px)</code> 覆盖成两列，再写一段更宽的覆盖成三列。它做对了最关键的一步：<strong>用「最小宽度」逐级增强，屏幕越宽、规则越丰富</strong>。方向是对的，只是手写起来有几处会持续咬人。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>断点数值散落在各处媒体查询里，想整体调整一套断点，只能全局搜索替换。</li>
      <li>每加一档宽度就要把选择器重写一遍，声明重复，层数一多维护成本直线上升。</li>
      <li>覆盖关系依赖书写顺序与优先级，两段媒体查询的先后一颠倒，样式就互相压过。</li>
      <li>如果反过来先写桌面端、再用 <code>max-width</code> 往小屏覆盖，等于每一层都在「减回去」，漏掉一处就会在某个宽度上错位。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      Tailwind 把「宽度条件」做成前缀：<strong>无前缀的工具作用于所有尺寸，是基准；<code>sm:</code>、<code>md:</code>、<code>lg:</code>、<code>xl:</code> 表示「该断点及以上」的覆盖。</strong> 合起来天生就是逐级增强的层叠结构，正好对应上面那个正确方向。
    </p>
    <p>
      于是那张课程网格写成一串类名：<code>grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4</code>。默认一列，到了小断点变两列，再到大断点变三列。先写小屏基准，再逐级往上加前缀——这就是<strong>移动优先</strong>：小屏是「基准」，大屏是「增强」，而不是相反。
    </p>
    <table>
      <thead>
        <tr><th>写法</th><th>含义</th><th>常见误解</th></tr>
      </thead>
      <tbody>
        <tr><td><code>grid-cols-1</code></td><td>所有尺寸都生效的基准</td><td>以为它只作用于手机</td></tr>
        <tr><td><code>sm:grid-cols-2</code></td><td>小断点及以上覆盖为两列</td><td>以为 sm 是「仅手机」</td></tr>
        <tr><td><code>md:grid-cols-3</code></td><td>中断点及以上再覆盖为三列</td><td>以为它会重置前面的规则</td></tr>
      </tbody>
    </table>
    <p>
      这里有一个必须记牢的约定：<strong>前缀只做「覆盖」，不做「重置」</strong>。样式会从无前缀那一层开始，逐级叠加到当前断点为止，宽屏用户同时继承了小屏基准与所有中间层。正因为是叠加而不是重来，你才只需要写「这一档要改的那几个类」。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong><code>sm</code> 代表小断点<strong>及以上</strong>，不是「只在手机上」，把它理解成设备型号，就会写出互相打架的规则；另外断点应当<strong>服务内容</strong>——先确认卡片真的开始拥挤了，再加那一档断点，不要为每个设备型号各定制一套。
    </div>
    <p>
      还有一层维护上的取舍。移动优先不只是「先写小屏」的书写顺序，它决定了以后每次改动往哪加：小屏基准稳定，新需求通常只是在大屏上多覆盖一条。反过来先写桌面端，小屏规则永远是在做减法，越减越容易漏。
    </p>
    <ol class="lesson-steps">
      <li>先写出窄屏可用的基础布局，不加任何断点前缀。</li>
      <li>在内容开始拥挤的那个宽度上加断点前缀，只覆盖需要变化的那几个类。</li>
      <li>逐级检查间距、字号与可点击尺寸在更大屏幕上的表现。</li>
      <li>拖动窗口宽度跨过每一档断点，确认布局按预期平滑切换。</li>
    </ol>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动滑杆改变预览宽度，跨过断点，看课程网格从一列切到两列、三列。</figcaption>
      <TW02Responsive />
    </figure>

    <h2>总结</h2>
    <p>
      响应式的难点从来不是「写三段媒体查询」，而是让同一份结构随宽度连续变化。移动优先把这件事变简单：无前缀写基准，带前缀逐级覆盖，断点只服务内容本身，而不是设备型号。窗口一拖，布局就该自己长对。
    </p>
    <div class="lesson-term">
      <span class="term-name">「移动优先断点」</span>指先写不带前缀的小屏基准样式，再用 <code>sm:</code>、<code>md:</code>、<code>lg:</code> 等前缀在更大宽度上逐级<strong>覆盖</strong>。前缀是「该断点及以上生效」，不是「仅该设备」；样式层层叠加而非重置，所以每档只需写要改的那几个类。
    </div>
  </LessonArticle>
</template>
