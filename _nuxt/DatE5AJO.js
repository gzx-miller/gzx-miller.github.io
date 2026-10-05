const n=`<script setup lang="ts">
import W02Shaders from './W02Shaders.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你在顶点着色器里给三个顶点分别喂了红、绿、蓝，本以为画出的是三个纯色角，屏幕上却是一个内部平滑过渡的彩色渐变——你一行「过渡」的代码都没写，中间那些颜色是谁替你算出来的？
    </div>

    <h2>顶点颜色到像素</h2>
    <p>
      你想做一件很直接的事：<strong>让每个顶点各自带一种颜色，并把这份颜色一路显示到屏幕上</strong>。在 Canvas 2D 的心智模型里，一个三角形就是「一个形状」，你设一次颜色它就整体上色；可在这里，颜色是长在<strong>顶点</strong>上的，而你要看到的却是<strong>像素</strong>。
    </p>
    <p>
      这个断层的成本必须由你承担，因为它夹在两段你必须亲手写的程序之间：
    </p>
    <ul>
      <li><strong>顶点着色器只按顶点跑</strong>：三个顶点就执行三次，它从没见过「像素」这种东西，自然也没法在它那里决定某个像素的颜色。</li>
      <li><strong>片段着色器不知道顶点的事</strong>：它按像素跑，却读不到逐顶点输入的 <code>attribute</code>——那是顶点着色器专属的入口。</li>
      <li><strong>没人负责「搬运」</strong>：CPU 到 GPU 的数据能传，但顶点上算出的值要怎么越过这两段程序之间的鸿沟，得有个明确的通道。</li>
    </ul>
    <p>
      于是问题落到一句话上：<strong>顶点上的数据，究竟怎么变成像素上的数据？</strong>
    </p>

    <h2>跨着色器传值</h2>
    <p>
      最朴素的尝试：既然颜色就在顶点上，那就在顶点着色器里把它「输出」出来，再让片段着色器「接收」。给同一个值取名 <code>vColor</code>，声明成 <code>varying</code>，在顶点着色器里赋成顶点自己的颜色，片段着色器里直接当成自己的输入来用。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它承认了顶点与像素之间需要一条显式的通道</strong>。<code>varying</code> 就是这条通道——名字、类型在两端对齐之后，颜色确实从顶点流到了像素，三角形也真的带上了颜色。
    </p>

    <h2>链接失败后果</h2>
    <ul>
      <li>如果只在顶点着色器里声明 <code>varying vColor</code>，片段着色器里漏了声明或类型不一致，<code>linkProgram</code> 会直接失败，画面全黑。</li>
      <li>当你其实想要「整个三角形一个纯色」时，用逐顶点颜色反而做不到：中间每个像素拿到的都是三个顶点颜色混出来的值，没有任何一个像素是纯红、纯绿或纯蓝。</li>
      <li>把颜色改用一个 <code>uniform</code> 单色，三角形又丢掉了顶点之间的差异，变成一整块死板的颜色。</li>
      <li>就算你想在顶点着色器里算「逐像素」的效果，它每个顶点只跑一次，根本没有逐像素的上下文，算不出那种细密的变化。</li>
    </ul>

    <h2>两段着色器分工</h2>
    <p>
      不推翻这条通道，而是先把两段程序的分工说清楚，再看通道里到底发生了什么。这是理解 GLSL 的第一道坎：<strong>两个着色器执行次数不同、职责也不同</strong>。
    </p>
    <ol class="lesson-steps">
      <li>顶点着色器对<strong>每个顶点</strong>执行一次（三个顶点就是三次），职责是「定位置」，把顶点算好后必须写入 <code>gl_Position</code>；本课它读入 <code>aPosition</code>、<code>aColor</code> 与 <code>uRotation</code>，用旋转公式算出新坐标。</li>
      <li>顶点着色器把 <code>aColor</code> 赋给 <code>varying vColor</code> 输出——它管不了像素，只负责在<strong>顶点</strong>上把这个值交出去。</li>
      <li>光栅化阶段（固定管线）把三角形离散成一堆片元，并在三个顶点之间对 <code>vColor</code> <strong>自动做线性插值</strong>：每个像素拿到的是三个顶点颜色按它在三角形中所处位置混合出的值。</li>
      <li>片段着色器对<strong>每个像素</strong>执行一次，读入插值后的 <code>vColor</code> 并写入 <code>gl_FragColor</code>，于是三角形内部出现了平滑渐变。</li>
    </ol>
    <p>
      这样开场那个「颜色自己冒出来」的谜就解开了：渐变不是哪段代码画上去的，而是 <strong><code>varying</code> 在光栅化阶段被自动插值的结果</strong>。顶点着色器只交出三个顶点的颜色，中间那一大片过渡色，是硬件替你补的。本课用一个随 <code>uniform uRotation</code> 旋转的三角形来演示这套分工——<code>uniform</code> 是单次绘制内所有顶点与像素共享的只读全局量，传时间、角度这类数据最合适。
    </p>
    <div class="lesson-box warn">
      <strong>两个常被忽略的点：</strong>其一，<code>varying</code> 必须在顶点与片段着色器里<strong>同时声明且类型一致</strong>，否则链接失败；其二，插值完全由光栅化自动完成，你不需要、也无法在着色器里手写插值——想让某个值参与渐变，让它成为 <code>varying</code> 即可。
    </div>
    <p>
      想验证「渐变确实是插值带来的」，最直接的办法是对比一个平涂版：关掉颜色插值，改用 <code>uniform</code> 传一个单一颜色，三角形立刻变成一整块纯色。顶点数据没变，变的是「有没有让一个逐顶点量穿过那条插值通道」。
    </p>

    <h2>插值与纯色对比</h2>
    <figure class="lesson-figure">
      <figcaption>拖动旋转速度让三角形转起来，再勾选/取消「启用颜色插值」，对比「三个顶点各自传色、GPU 自动插值出的平滑渐变」与「uniform 单色平涂」两种效果，同时看下方两段着色器源码与 varying 的数据流示意。</figcaption>
      <W02Shaders />
    </figure>

    <h2>逐顶点与逐像素</h2>
    <p>
      GLSL 里两段程序的分工是：顶点着色器逐顶点执行、负责定位置并写 <code>gl_Position</code>；片段着色器逐像素执行、负责定颜色并写 <code>gl_FragColor</code>。顶点想把数据交给像素，只能走 <code>varying</code> 这条通道，而它穿过光栅化时会被自动插值——中间那些过渡色就是这么来的。
    </p>
    <div class="lesson-term">
      <span class="term-name">「光栅化（Rasterization）」</span>是固定管线里把图元离散成屏幕像素（片元）、并对跨越图元的 <code>varying</code> 逐片元插值的阶段。记住三个边界：插值发生在片段着色器之前、由硬件自动完成；只有逐顶点输出（<code>varying</code>）会被插值，<code>uniform</code> 与常量不参与插值、每个像素拿到的都是同一份；<code>varying</code> 默认按重心坐标做透视校正插值。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
