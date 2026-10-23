const n=`<script setup lang="ts">
import E19Progress from './E19Progress.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程的完成度只写了一句「已完成 55%」，用户盯着这几个字，完全感受不到自己离学完还有多远。
    </div>

    <h2>数字读取与换算</h2>
    <p>
      你在做一个学习数据看板。每门课程都有一个完成度，取值从 0 到 100。如果只把数字打印成文字，用户需要先读数字、再在脑子里换算成「大概一半」，最后还要自己比较几门课谁快谁慢——每一步都在消耗注意力。看板的意义是<strong>让人一眼看出差距</strong>，而纯文字恰恰做不到这一点。
    </p>
    <p>
      更棘手的是，进度并不是千篇一律的。有的场景想用一条横向的条，有的想用一个圆环，有的想要仪表盘那种带刻度的弧。如果每种形态都自己造，代码会迅速膨胀，而且几种形态的视觉细节还很难对齐。
    </p>

    <h2>轨道与填充实现</h2>
    <p>
      最省事的做法：用一个 <code>div</code> 当轨道，里面放一个内层 <code>div</code>，把它的宽度设成百分比——55% 就写 <code>width: 55%</code>。数字一变，宽度跟着变，进度条就动起来了。
    </p>
    <p>
      这个方案方向是对的：<strong>它把抽象的百分比翻译成了长度，让「多少」变成可以看见的东西</strong>。几条并排摆开，谁长谁短一目了然。但它只做了一条线形条，覆盖面很窄。
    </p>

    <h2>圆环与分段配色</h2>
    <ul>
      <li>圆环、仪表盘得自己画，涉及 <code>SVG</code> 或渐变绘制，门槛不低。</li>
      <li>分段配色要自己算：低于某个阈值标红、中段标黄、快完成标绿，逻辑一多就散。</li>
      <li>粗细、尺寸这些外观参数没有统一入口，改一处要动好几处样式。</li>
      <li>异常数据没人兜底：数值传了 120 或负数，条会画出边界甚至反向。</li>
      <li>进度到 100% 之后没有任何提示，用户不知道是不是卡住了。</li>
    </ul>

    <h2>组件参数驱动外观</h2>
    <p>
      不推翻「把百分比变成可见长度」，而是把各种形态收敛到同一个组件。Element Plus 的 <code>el-progress</code> 用一个数字驱动外观：<code>percentage</code> 就是进度数值，其余属性只决定「长什么样」。
    </p>
    <p>
      先看形态。<code>type</code> 可以切换线形、环形、仪表盘三种。线形适合并排比较多个任务；环形适合在卡片里突出一个数字；仪表盘则自带刻度感，适合强调「完成度」这种整体指标。
    </p>
    <p>
      再看尺寸与粗细，这两个参数容易混，要分清楚：
    </p>
    <ul>
      <li><code>width</code> 控制<strong>圆形与仪表盘的整体尺寸</strong>，也就是整块画布多大。</li>
      <li><code>stroke-width</code> 控制<strong>进度条本身的粗细</strong>，也就是那条弧线或直线多厚。</li>
    </ul>
    <p>
      配色的灵活性也值得说。<code>color</code> 支持三种写法：写一个固定颜色值、给一个<strong>按百分比分段的数组</strong>（形如「颜色加阈值」的若干段）、或者给一个<strong>函数</strong>按当前数值返回颜色。想实现「低分标红、中段标黄、高分标绿」，一段分段数组就够，不必自己写判断。
    </p>
    <p>
      然后是两个必须自己把关的边界。第一，<strong>把 <code>percentage</code> 裁剪到 <span class="lesson-kv">0 到 100</span> 之间再传进去</strong>：接口偶尔会返回异常数据，越界的数值会让进度条绘制溢出甚至反向，看起来像渲染坏了。数据还会变化，所以要监听它动态更新，并顺势处理「已完成」和「异常」这两种终态。第二，<strong>当进度到达 100% 时要给出下一步引导</strong>，比如提示「可以继续学习下一门」，而不是让条静静地停在满格，用户还以为卡住了。
    </p>
    <p>
      最后是信息组织。多任务场景下，与其让用户逐个去看，不如<strong>把各任务的进度汇总成一个总进度展示</strong>，一眼掌握全局。
    </p>
    <div class="lesson-box warn">
      <strong>别把 <code>width</code> 和 <code>stroke-width</code> 混着用：</strong>在仪表盘形态下，<code>width</code> 决定的是整块画布的尺寸，不是线的粗细；线的粗细始终归 <code>stroke-width</code> 管。弄反了就会得到「尺寸没变、线条莫名变粗」这类莫名其妙的效果。
    </div>

    <h2>四种形态同步增长</h2>
    <figure class="lesson-figure">
      <figcaption>点「模拟学习推进」看四个进度条与仪表盘同步增长，注意不同颜色与粗细的搭配。</figcaption>
      <E19Progress />
    </figure>

    <h2>进度数值与形态</h2>
    <p>
      进度条把「完成了多少」从一句文字变成了看得见的长度或弧度，让比较和感知都变快。用法上记住三点：一个 <code>percentage</code> 驱动数值，<code>type</code> 决定线形、环形还是仪表盘，<code>color</code> 可以用固定值、分段数组或函数取色。别混淆 <code>width</code> 与 <code>stroke-width</code>，传值前裁剪到合法区间，到达终点时补上下一步引导，这条「仪表」才算真正可用。
    </p>
    <div class="lesson-term">
      <span class="term-name">「进度条」</span>用 <code>el-progress</code> 展示完成度：<code>percentage</code> 是进度数值，<code>type</code> 切换线形 / 环形 / 仪表盘，<code>width</code> 控制圆形与仪表盘的整体尺寸，<code>stroke-width</code> 控制进度条粗细，<code>color</code> 支持固定颜色、按百分比分段的数组或返回颜色的函数。传入前应把 <code>percentage</code> 裁剪到 0 到 100 的合法区间，并在满 100% 时给出下一步引导。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
