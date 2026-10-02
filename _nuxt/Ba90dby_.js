const n=`<script setup lang="ts">
import W19Particles from './W19Particles.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想做一片星云，让几万个粒子在引力中心周围盘旋。你写的物理简单到不能再简单：每帧给速度加上一点朝向中心的加速度，位置再按速度前进一步。就这两步，却怎么也跑不到 60 帧——几万个粒子在 CPU 的一个核上排着队算，而 GPU 里几千个核心在旁边闲着。为什么算法简单到这个地步，一上量还是会崩？
    </div>

    <h2>粒子更新并行性</h2>
    <p>
      粒子系统里藏着一个天生的并行结构：每个粒子只根据自己的旧状态更新自己的新状态，粒子之间互不干扰。拿 CPU 的顺序循环去啃这种数据，要付两笔沉重的账：
    </p>
    <ul>
      <li><strong>算力错配。</strong>CPU 只有一个或几个核，几万次加减乘除要顺序排完，一帧的预算根本不够；</li>
      <li><strong>数据来回搬。</strong>算完还得把几万个位置从 CPU 内存<strong>上传</strong>到 GPU 才能显示；若中途想读回来判断点什么，回读（readback）还会让整条 GPU 管线停下来等 CPU。</li>
    </ul>
    <p>
      说到底是两件事：<strong>谁来算，算完的数据放在哪。</strong>把计算留在 CPU、把数据搬来搬去，无论物理多简单都扛不住。于是问题变成：<strong>能不能不把粒子搬回 CPU，就在 GPU 上原地把它们的状态更新掉？</strong>
    </p>

    <h2>状态纹理化存储</h2>
    <p>
      把粒子的状态<strong>存进一张纹理</strong>。每个粒子占一个纹素，用一个 <code>RGBA</code> 存下它此刻的全部状态：<code>xy</code> 是位置，<code>zw</code> 是速度。每帧不再碰 CPU，而是渲染一块覆盖整张纹理的全屏四边形——片段着色器读到「旧状态」那个纹素的颜色，按物理规则算出新位置、新速度，再输出出去。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它把「循环」换成了「一次绘制」</strong>。GPU 会为这张纹理的每个纹素并行跑一遍同一个片段着色器，几万次更新被摊到几千个核心上；同时，数据从出生到消亡都待在显存里，不再来回搬运。
    </p>

    <h2>同帧读写冲突</h2>
    <ul>
      <li><strong>不能原地读写同一张纹理。</strong>如果输出的目标正是正在采样的那张纹理，同一次绘制里「读」和「写」会落在同一块内存上，结果错乱甚至未定义。</li>
      <li><strong>更新完还是看不见。</strong>更新这一步产出的是一张<strong>数据纹理</strong>——存的是位置和速度，不是颜色。要把它显示出来，还得有单独一遍把它读成屏幕上的点。</li>
      <li><strong>点精灵默认是硬方块。</strong><code>gl.POINTS</code> 画出来的默认是一个个硬边小方块。要做出圆形、边缘柔和的粒子，得在片段里用 <code>gl_PointCoord</code> 自己判断到中心的距离并淡出。</li>
      <li><strong>精度选错会抖。</strong>位置和速度被压进纹理，如果用了 8 位的格式，几万个粒子会在画面上明显地抖动、粘滞，看起来像在卡。</li>
    </ul>

    <h2>双纹理轮换机制</h2>
    <p>
      先解决读写冲突——用 <strong>ping-pong</strong>。准备两张纹理和对应的两个 FBO，一张当「读」、一张当「写」。每帧更新时从读纹理采样，把结果写进另一个 FBO；画完把两者的身份对调，新状态就成了下一帧的输入。这样读写永远落在不同纹理上，冲突消失。
    </p>
    <p>
      再看更新着色器里到底算什么。它读到的 <code>posData</code> 里 <code>.xy</code> 是位置、<code>.zw</code> 是速度，于是可以一口气把物理算完：
    </p>
    <ol class="lesson-steps">
      <li>朝引力中心加速：算出指向中心的方向 <code>normalize(toCenter)</code>，按 <code>force / max(dist, 0.1)</code> 加进速度——距离越近吸引力越强，同时用一个下限保护过近的距离。</li>
      <li>阻尼衰减：<code>vel *= 0.98</code>，让运动慢慢稳下来，不至于越飞越快。</li>
      <li>位移积分：<code>pos += vel * 0.01</code>，按速度推进位置。</li>
      <li>边界折叠：<code>pos = fract(pos + 1.0)</code>，跑出边界的粒子从另一侧回来，画面不会越跑越空。</li>
      <li>写出去：<code>gl_FragColor = vec4(pos, vel)</code>，把新状态放回纹理。</li>
    </ol>
    <p>
      然后解决显示——加一个渲染 pass，用点精灵把数据纹理画成粒子。给每个粒子一个索引 attribute <code>a_index</code>，顶点着色器里按它在纹理中的行列位置（<code>mod</code> 取列、<code>floor</code> 取行）换算成 UV，采样位置纹理拿到坐标，映射到 NDC 后写进 <code>gl_Position</code>；再用 <code>gl_PointSize</code> 设置粒子大小。
    </p>
    <p>
      最后把点精灵修圆。片段里用 <code>gl_PointCoord</code>（范围 <code>[0,1]</code>）算出当前片元到点中心的距离 <code>d</code>，<code>d &gt; 0.5</code> 直接 <code>discard</code> 掉；否则按距离把 alpha 衰减，得到中间亮、边缘淡的圆形粒子。
    </p>
    <p>
      到这里整条链路就闭环了：初始化状态纹理 → 每帧 Update Pass 更新 → ping-pong 交换 → Render Pass 用 <code>gl.POINTS</code> 画出来。<strong>CPU 全程只负责发几条绘制命令，一次也没有逐粒子回算。</strong>
    </p>
    <div class="lesson-box warn">
      <strong>三条必须守住的线：</strong>更新时读写同一张纹理一定会出问题，必须用 ping-pong 两张纹理交替；GPGPU 的要点是「把纹理当数据显示、把片段着色器当并行计算核」，适合位置、速度这类逐点数据；点精灵的圆形软边靠 <code>gl_PointCoord</code> 判断，别忘了 <code>discard</code> 掉角上的片元。还有一条隐含的前提：所有更新都在显存内完成，一旦把数据回读给 CPU，规模优势就没了。
    </div>

    <h2>上万粒子流畅度</h2>
    <figure class="lesson-figure">
      <figcaption>把「粒子数量」一路拖到上万，再调粒子大小与力场强度，勾选「显示移动力场中心」看引力点如何游走、几万个粒子依旧顺滑跟随——位置更新全程在 GPU 上完成，CPU 不参与逐粒子计算。</figcaption>
      <W19Particles />
    </figure>

    <h2>计算迁移到显卡</h2>
    <p>
      粒子系统教给我们的，不只是怎么画很多点，而是一种把计算搬到 GPU 上的思路：把每个粒子的状态当「像素」存进纹理，把物理公式写成片段着色器，用两张纹理轮流读写（ping-pong），几万个粒子的实时更新就能一次绘制完成。CPU 只发指令，不再逐点回算。
    </p>
    <div class="lesson-term">
      <span class="term-name">「GPGPU（General-Purpose computing on GPU，GPU 通用计算）」</span>指把 GPU 当作并行处理器，用来做图形之外的计算。本课中的体现是「用纹理当数据显示、用片段着色器当并行计算核」——把粒子状态编码进纹理，让每个纹素并行执行同一段物理更新。边界与例外：更新的输入与输出必须落在不同纹理上（用 ping-pong 交替），否则读写冲突；点精灵的圆形柔边需用 <code>gl_PointCoord</code> 手动裁剪与衰减；数据全程留在显存内，一旦读取回 CPU 就会造成管线停顿。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
