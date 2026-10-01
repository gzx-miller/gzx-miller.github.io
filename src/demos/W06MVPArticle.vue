<script setup lang="ts">
import W06MVP from './W06MVP.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了一个立方体，想让它出现在屏幕右下角，于是给每个顶点都加上 <code>(0.5, -0.5, 0)</code>。物体确实挪了地方，可当你接着想把「镜头拉远一点」让整个物体变小、好看全貌时，物体却没变小，反而被压扁了——你改的是物体的形状，可你想动的明明是相机。
    </div>

    <h2>顶点坐标三重需求</h2>
    <p>
      你手里只有一组写死的顶点坐标，比如立方体的八个角，范围都在 <code>[-0.6, 0.6]</code>。现在你要它同时满足三件事：摆在场景里的某个位置、自己转起来、还能用不同远近和不同镜头去看它。
    </p>
    <p>
      如果每次都直接在 CPU 上改顶点数组，你就得替三件本该由显卡操心的事买单：
    </p>
    <ul>
      <li><strong>改一次重传一次。</strong>换个摆放角度就要重算整块顶点数据再上传，顶点一多，帧率立刻掉下来。</li>
      <li><strong>顺序极易弄反。</strong>平移、旋转、缩放谁先谁后结果完全不同，手算时稍不留神就把顺序颠倒了。</li>
      <li><strong>把「观看方式」错当成「物体形状」。</strong>相机想拉远，你却在改物体的顶点，逻辑上根本不是一回事，改一处连累一片。</li>
    </ul>
    <p>
      于是问题落到一句话上：<strong>能不能让几何数据只上传一次，之后靠一组参数在显卡上完成摆放、观察和投影？</strong>
    </p>

    <h2>模型矩阵引入</h2>
    <p>
      先别急着一次解决三件事，只补一个 <strong>Model 矩阵</strong>：把它作为 <code>uniform mat4</code> 传到顶点着色器，让每个顶点自己乘一下。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「形状」和「摆放」拆开了</strong>。顶点数组只负责描述立方体长什么样、只上传一次；旋转、平移、缩放交给 Model 矩阵每帧现算现传，显卡里每个顶点各自相乘。改摆放不动几何数据，几何数据也不用重传。顶点着色器里的核心就一行：<code>gl_Position = uModel * vec4(aPosition, 1.0);</code>
    </p>

    <h2>相机视角缺失</h2>
    <ul>
      <li>只有 Model 时，<strong>相机没有位置可言</strong>。你想绕到物体背后看，只能反过来把物体转回去，而不是把眼睛挪过去。</li>
      <li>「物体自身转动」和「观看角度」被塞进同一组旋转角，两者耦合，改一个另一个就跟着乱。</li>
      <li>画出来的东西<strong>没有近大远小</strong>：不管相机在哪、离得多近，同一个面在屏幕上的尺寸都一样。</li>
      <li>长条形的画布会让物体横向被拉伸（宽高比没被处理），换个窗口尺寸形状就变形。</li>
    </ul>

    <h2>三级坐标变换</h2>
    <p>
      不推翻 Model，而是沿着「顶点从哪里来、被谁看、怎么落到屏幕」这条链路，一层层把缺的两级补上。顶点最终要经过三次坐标变换，依次是：
    </p>
    <ol class="lesson-steps">
      <li><strong>Model 矩阵</strong>：把顶点从它自己的<strong>局部空间</strong>变换到<strong>世界空间</strong>——管的是「物体摆在哪、朝向如何」。</li>
      <li><strong>View 矩阵</strong>：把世界空间变换到<strong>相机（观察）空间</strong>——管的是「从哪看」，本质是把相机搬到原点、视线对齐轴。</li>
      <li><strong>Projection 矩阵</strong>：把相机空间变换到<strong>裁剪空间</strong>——管的是「用哪种镜头」。透视投影用 fov、near、far 产生近大远小的真实感，正交投影保持平行关系，适合 2D 与工程制图。</li>
      <li>顶点着色器把三者级联起来：<code>gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);</code></li>
    </ol>
    <p>
      为什么是这个顺序、不能换？因为矩阵乘法从右往左作用在顶点上——<strong>写在最右边的 Model 最先碰到顶点，写在最左边的 Projection 最后作用</strong>。你其实是在读一本从里到外的套娃：先把物体摆进世界，再把世界塞进相机，最后把相机里的东西压进裁剪空间。顺序一调，投影结果就错。
    </p>
    <div class="lesson-box warn">
      <strong>容易忽略的一步：</strong>裁剪坐标并不直接就是屏幕坐标。硬件还要把裁剪坐标<strong>除以它的 w 分量</strong>（这一步叫透视除法），得到归一化设备坐标 NDC，再经过视口变换才落到屏幕像素上。这也解释了两个现象：透视投影下远处的顶点被压得更小，以及超出 <code>[-1, 1]</code> 范围的顶点会被直接裁掉、跑出画面。
    </div>
    <p>
      最后是一个工程习惯：三矩阵每帧分别传会产生更多 uniform 与乘法，实际项目里通常把三段<strong>预合成一个 MVP 矩阵</strong>再传入。本课故意保留三个独立矩阵，就是为了让你看清它们级联的先后关系。
    </p>

    <h2>透视与正交投影</h2>
    <figure class="lesson-figure">
      <figcaption>拖动旋转滑杆看 Model 矩阵实时变化，再切换透视与正交投影，对比同一立方体「近大远小」和「保持平行」的差别。</figcaption>
      <W06MVP />
    </figure>

    <h2>变换链路分层</h2>
    <p>
      把一个 3D 顶点送上屏幕，是三次坐标变换的接力：Model 把它摆进世界，View 把相机搬到原点，Projection 把它压进裁剪空间，最后由硬件做透视除法落到像素。<strong>位置不对、尺寸失真时，先问自己该调的是哪一级，而不是去动顶点数据。</strong>
    </p>
    <div class="lesson-term">
      <span class="term-name">「MVP 矩阵」</span>指 Model、View、Projection 三段矩阵按 <code>Projection × View × Model</code> 的顺序级联，作用在顶点上得到裁剪坐标。必须记住：<strong>顺序不可交换</strong>，最右侧的 Model 最先作用于顶点；Projection 之后硬件还会做一次透视除法（除以 w）才得到 NDC。
    </div>
  </LessonArticle>
</template>
