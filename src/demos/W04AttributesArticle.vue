<script setup lang="ts">
import W04Attributes from './W04Attributes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想让形状随时间上下起伏，于是把「时间」当成顶点属性，给每个顶点都存了一份一模一样的时间值。形状确实动了，可它每帧都要把整块顶点缓冲重新上传——明明只是改了一个数，却搬运了上千个顶点的数据，这活儿是不是干反了？
    </div>

    <h2>顶点数据粒度</h2>
    <p>
      在把数据送进着色器时，你手上其实混着好几种性质完全不同的数据：位置、颜色是<strong>每个顶点各不一样</strong>的；时间、变换矩阵、一个开关是<strong>这一次绘制里所有顶点和像素都一样</strong>的；还有顶点算出来的中间量，需要交给像素阶段接着用。如果不先分清它们的性质，就会用错通道、付错代价：
    </p>
    <ul>
      <li>把逐顶点数据当全局量传，一个值只能表达一个顶点，别的顶点只能拿到同一个坐标，图形直接塌掉。</li>
      <li>把全局量当逐顶点数据传，就得给每个顶点各存一份相同的值，每帧更新要整块重传，白白浪费带宽。</li>
      <li>顶点阶段算出的结果想给像素阶段用，若没有一条通道，要么重算一遍，要么根本传不过去。</li>
    </ul>
    <p>
      所以问题的核心不是「怎么把值传进去」，而是：<strong>面对一份数据，怎么一眼判断它该走哪条通道？</strong>
    </p>

    <h2>统一变量适用</h2>
    <p>
      最省事的做法：全当全局量传，反正 <code>uniform</code> 设一次就处处可用。对时间、角度、颜色这类整个图形共享的数据，这确实是最划算的选择——设一次，所有顶点和像素都拿到同一个值。
    </p>
    <p>
      这个方案做对了一件事：<strong>它认出了「全局共享」这一种粒度</strong>，并把它的成本压到了最低。当一份数据整次绘制都保持不变时，用 <code>uniform</code> 就是标准答案。
    </p>

    <h2>全局量逐顶点盲区</h2>
    <ul>
      <li>逐顶点的位置或颜色用 <code>uniform</code> 根本表达不了：三个顶点会拿到同一个坐标，三角形退化成一个点，颜色也只剩一块。</li>
      <li>想把逐顶点数据硬塞进一个 <code>uniform</code> 数组，还得在着色器里自己按下标取值，绕了一大圈，远不如属性直观。</li>
      <li>把时间这种全局量当逐顶点数据传，每帧都要重传整块缓冲，正是开场那个「搬运上千个顶点」的浪费。</li>
      <li>顶点着色器算出的量（例如波浪后的颜色）片段着色器读不到，缺一条跨阶段的通道。</li>
    </ul>

    <h2>数据通道分流</h2>
    <p>
      不推翻「全局量用 uniform」，而是按<strong>数据出现的粒度</strong>把输入分成两类，再补上一条连接两个阶段的通道。三者的分工，就是这一课真正要记住的东西。
    </p>
    <ol class="lesson-steps">
      <li><strong>attribute——逐顶点输入。</strong>每个顶点各一份，由 CPU 端的缓冲加上 <code>vertexAttribPointer</code> 提供。位置 <code>aPosition</code>、颜色 <code>aColor</code> 都属于它。边界很硬：<code>attribute</code> 只能在<strong>顶点着色器</strong>里声明，个数受 <code>GL_MAX_VERTEX_ATTRIBS</code> 限制（WebGL1 通常至少 8 个）。</li>
      <li><strong>uniform——全局只读量。</strong>单次 <code>draw call</code> 内所有顶点与像素共享同一份值，时间 <code>uTime</code>、开关 <code>uUseAttributeColor</code> 都属于它。它可以在每次绘制前更新，适合传时间、矩阵、颜色这类全局状态。</li>
      <li><strong>varying——跨阶段的插值通道。</strong>顶点着色器把 <code>aColor</code> 赋给 <code>vColor</code>，片段着色器读到的就是插值后的值；光栅化会自动完成插值，你不用手写。</li>
    </ol>
    <p>
      本课把这三种粒度放进同一个形状里各司其职：顶点着色器读入 <code>aPosition</code>、<code>aColor</code> 和 <code>uTime</code>，按 <code>uTime</code> 与<strong>各顶点自身的 <code>aPosition</code></strong> 算出波浪位移，写进 <code>gl_Position</code>；片段着色器则在「属性色」与「按 <code>uTime</code> 动态算出的颜色」之间用 <code>mix</code> 按 <code>uUseAttributeColor</code> 混合。于是逐顶点的差异与全局的统一，恰好各自走对了通道。
    </p>
    <div class="lesson-box warn">
      <strong>两个易错点：</strong><code>uniform</code> 必须在 <code>useProgram</code> <strong>之后</strong>设置才会生效，顺序反了它就不会作用到当前程序上；另外要留意 <code>attribute</code> / <code>varying</code> 是 WebGL1 的旧关键字，WebGL2 的 <code>#version 300 es</code> 已改用 <code>in</code> / <code>out</code>，入门阶段先按 WebGL1 的写法对照更直观。
    </div>

    <h2>两种手法对比</h2>
    <figure class="lesson-figure">
      <figcaption>拖动「Uniform 时间」滑杆或开启自动动画，看同一个 uTime 如何驱动所有顶点一起波动；再勾选/取消「使用 attribute 顶点颜色」，对比「顶点各自带色、插值出的渐变」与「按时间动态计算的全局色」，并对照下方的三张变量卡片与数据流向图。</figcaption>
      <W04Attributes />
    </figure>

    <h2>输入通道选择依据</h2>
    <p>
      往着色器里送数据，先看它的粒度：每个顶点都不一样，就用 <code>attribute</code>；整次绘制都相同，就用 <code>uniform</code>；要从顶点阶段交到像素阶段、还希望它自动过渡，就用 <code>varying</code>。选对通道，值既传得进去，也不会有多余的重复上传。
    </p>
    <div class="lesson-term">
      <span class="term-name">「数据粒度（Data Granularity）」</span>指一份数据在渲染中被复用的最小单位——<strong>逐顶点</strong>、<strong>逐绘制调用</strong>还是<strong>逐片元</strong>。它决定数据该走 <code>attribute</code>、<code>uniform</code> 还是 <code>varying</code>。记住两个边界：同一份数据在跨越阶段后粒度可能变化（顶点阶段的 <code>varying</code> 到了片段阶段是插值后的逐片元值）；逐实例渲染还会额外引入「逐实例」这层粒度，属于进阶话题。
    </div>
  </LessonArticle>
</template>
