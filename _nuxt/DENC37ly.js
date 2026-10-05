const n=`<script setup lang="ts">
import W05Matrices from './W05Matrices.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想让方块先放大两倍、再转 45 度、最后挪到右上角，三次操作都写好了，作用到顶点上却偏到了完全意想不到的位置——把「先平移后旋转」换成「先旋转后平移」，同一个方块又跑到了别处。同样三个操作，换个顺序为什么就不是一个结果？
    </div>

    <h2>三种变换合成</h2>
    <p>
      你想做的是把平移、旋转、缩放组合起来作用到物体上。最直接的做法，是对每个顶点按顺序手算三步：先乘缩放、再乘旋转、最后加上平移。能算对，但它在几件事上把成本留给了你：
    </p>
    <ul>
      <li><strong>平移和旋转缩放「不是一个量级」</strong>：平移是加法，旋转和缩放是乘法，两种运算没法揉成一个统一的表达式，代码里始终是三段并列。</li>
      <li><strong>顺序全靠自觉</strong>：先平移后旋转、与先旋转后平移结果天差地别，可手写公式里没有一个结构把「顺序」固定下来，极易弄反。</li>
      <li><strong>规模一上来就慢</strong>：每个顶点在 CPU 上一遍遍地乘加，顶点一多，本该由 GPU 并行完成的运算，全压在了 JavaScript 的单线程里。</li>
    </ul>
    <p>
      于是问题变成：<strong>能不能用一次统一的运算，把缩放、旋转、平移按指定顺序作用到每个顶点上，并让 GPU 来完成？</strong>
    </p>

    <h2>分步施加变换</h2>
    <p>
      最朴素的方案：老老实实写三步，对每个顶点依次做缩放、旋转、平移。它最大的价值在于<strong>把三次操作讲得明明白白</strong>——顺序是什么、每步做了什么，一眼可见。
    </p>
    <p>
      这个方案做对了一件事：<strong>它承认了「变换是一系列操作按顺序施加」这一事实</strong>。当只有一个顶点、顺序又固定时，手算完全够用。问题只出在，它没给这套顺序一个可组合、可交给 GPU 的载体。
    </p>

    <h2>顺序敏感与耦合</h2>
    <ul>
      <li>平移是加法、旋转缩放是乘法，三步无法合成一个统一表达式，顶点越多越难维护。</li>
      <li>顺序变了结果就变，但没有一个结构把顺序「固化」下来，改需求时很容易顺手改错。</li>
      <li>非等比缩放下，「先缩放再旋转」和「先旋转再缩放」会得到不同形状，光看代码很难立刻判断当前是哪一种。</li>
      <li>逐顶点运算全压在 CPU 上，而 GPU 本来就擅长对成千上万个顶点并行做同一步乘法。</li>
    </ul>

    <h2>齐次坐标与矩阵</h2>
    <p>
      不推翻「按顺序施加多个变换」，而是给它一个统一的载体：<strong>矩阵</strong>。这样多个变换就能相乘合并成一次运算，再把这一次运算交给顶点着色器，让 GPU 对每个顶点并行执行。
    </p>
    <ol class="lesson-steps">
      <li><strong>用齐次坐标把平移也变成乘法。</strong>给二维坐标 (x, y) 补上第三个分量 1，写成 <code>vec3(aPosition, 1.0)</code>。有了这个多出来的 1，平移就能像旋转、缩放一样写进 3×3 矩阵，三种变换统一成同一个 <code>mat3</code>。</li>
      <li><strong>分别建出三个矩阵。</strong>平移矩阵 <code>createTranslationMatrix</code> 把 (tx, ty) 放进第三列；旋转矩阵 <code>createRotationMatrix</code> 用 cos、sin 组成左上 2×2；缩放矩阵 <code>createScaleMatrix</code> 把 (sx, sy) 放在对角线上。</li>
      <li><strong>按 T × R × S 相乘合并。</strong>矩阵乘法把三个矩阵合成一个组合矩阵，作用到向量上时按<strong>从右往左</strong>的顺序依次发生：<code>M = T × R × S</code> 表示先缩放 S、再旋转 R、最后平移 T。</li>
      <li><strong>作为 uniform 传给着色器。</strong>把组合矩阵作为 <code>uniform mat3 uMatrix</code> 传入，顶点着色器只做一次 <code>uMatrix * vec3(aPosition, 1.0)</code>，取结果的前两维写进 <code>gl_Position</code>。矩阵在 CPU 端只算一次，GPU 端每个顶点各乘一下，正是它擅长的并行活。</li>
    </ol>
    <p>
      顺序为什么必须「从右往左」读，值得再掰一遍：向量在表达式的右端，最靠近它的矩阵最先作用到它身上。所以 <code>T × R × S</code> 作用到顶点 v 上，实际顺序是 S 先、R 次之、T 最后。矩阵乘法<strong>不满足交换律</strong>——交换因子顺序会得到不同结果，这也是开场「换个顺序位置就变」的根本原因。
    </p>
    <div class="lesson-box warn">
      <strong>还有一个容易踩的坑：存储顺序。</strong>GLSL 的 <code>mat3</code> / <code>mat4</code> 按<strong>列主序（column-major）</strong>存储，CPU 端传给它的数组也得按这个约定排布，和很多人习惯的行主序正好相反；排错了，画面会呈现出一种「被转置」的诡异变换。本课直接手写 3×3 矩阵是为了看清原理，工程中更常用 <code>gl-matrix</code> 这类库并统一升到 4×4，以便向 3D 兼容。
    </div>

    <h2>矩阵参数联动</h2>
    <figure class="lesson-figure">
      <figcaption>拖动平移、旋转、缩放滑杆，右侧 3×3 组合矩阵与三个分量矩阵会实时更新，观察 M = T × R × S 如何把多次变换压缩成一个矩阵作用到四边形/三角形/五边形上；点「重置变换」就能回到初始状态从头再试。</figcaption>
      <W05Matrices />
    </figure>

    <h2>变换不可交换性</h2>
    <p>
      多个变换的组合，本质上是把「一串按顺序做的操作」压缩成一个矩阵。齐次坐标让平移也能参与乘法，于是缩放、旋转、平移能合成同一个 <code>mat3</code>，作用时从右往左依次发生——顺序一旦变了，结果就跟着变。
    </p>
    <div class="lesson-term">
      <span class="term-name">「齐次坐标（Homogeneous Coordinates）」</span>用多一个分量来表示坐标：二维点写成 (x, y, 1)，二维方向/向量写成 (x, y, 0)。多出的那个 1 让<strong>平移也能写成矩阵乘法</strong>，从而把平移与旋转、缩放统一进同一个矩阵，也是投影变换的基础。记住它的边界：w 分量为 0 表示方向而非位置，平移对方向没有影响；GLSL 的 <code>mat3</code> / <code>mat4</code> 按列主序存储，CPU 数组须按其约定排布。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
