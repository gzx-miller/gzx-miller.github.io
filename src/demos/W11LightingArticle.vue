<script setup lang="ts">
import W11Lighting from './W11Lighting.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给球体设好模型、相机、投影，球确实是个正圆；又传了一个材质色的 uniform，结果屏幕上是一个通体同色的橙圆片，像贴在屏幕上的圆贴纸。你把光源方向从左边拖到右边，那片颜色纹丝不动——明明有光，物体为什么对它「毫无反应」？
    </div>

    <h2>提出问题</h2>
    <p>
      你已经能让一个球体正确地出现在屏幕上：几何有了、<code>MVP</code> 有了、材质色也能传进去。现在要给表面「上色」，如果只是让每个像素都输出同一个材质色，问题就暴露了：<strong>物体和光源之间没有任何关系</strong>。光在左边还是右边、在上面还是在下面，画出来的颜色完全一样。
    </p>
    <p>
      这正是「通体一色像剪影」的根源。纯色填充有几笔必须由人买单的账：它<strong>表达不了朝向</strong>，曲面再怎么转也是一块平的色块；它<strong>区分不出亮面与暗面</strong>，正对光的区域和背光的区域长得一模一样；它<strong>接不住光源的变化</strong>，你调光也好、挪物体也好，画面永远停在原地。所以真正要回答的是：<strong>怎么让每个像素的颜色，取决于它所在表面的朝向与光的方向之间的夹角？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素但真的能跑的一步：给每个顶点带一个法线 <code>aNormal</code>（球体天然有——每个顶点的法线就是从球心指向该点的方向），把光当成一束方向固定的平行光、用一个方向向量 <code>L</code> 表示，然后逐像素算一个点积。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「亮度」和「表面朝向与光的夹角」绑定了</strong>。法线正对光源时点积最大，表面最亮；法线垂直于光源时点积为 0，表面最暗。你终于能从明暗里看出球的曲面起伏和光从哪来。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><strong>背光面直接变全黑。</strong>只输出漫反射时，背面 <code>NdotL</code> 被截成 0，整块背面是纯黑，像被挖掉一块；真实世界里背光面仍有来自天空、地面的微弱亮度。</li>
      <li><strong>不归一化就亮度失真。</strong>模型若做了缩放，法线可能被拉长；若 <code>N</code> 或 <code>L</code> 不是单位向量，点积结果会整体放大或缩小，正对光的面可能直接过曝成白色。</li>
      <li><strong>背光面出现「负的光」。</strong>若忘了用 <code>max</code> 把负值截为 0，点积为负会把颜色往下减，暗面变得更黑甚至出现异常黑块。</li>
      <li><strong>逐顶点算会显钝。</strong>如果只在顶点上算一次强度、再插值，曲面上的高光过渡会显得生硬，转起来能看到明显的棱状阶梯。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「用点积定亮度」，而是先补上最刺眼的那一笔——<strong>环境光 Ambient</strong>。它用与方向无关的常量 <code>uAmbient</code> 近似间接光（天空、地面到处反射回来的那部分），写成 <code>ambient = uAmbient * 材质色</code>。先补它，是因为它最简单，又正好治好「背面全黑」——哪怕一点方向光都没照到，物体依然有轮廓。
    </p>
    <p>
      接着把光照改成<strong>逐像素</strong>。顶点着色器把法线经法线矩阵变换到世界空间，作为 varying <code>vNormalWorld</code> 交给片段着色器；光栅化阶段法线会在顶点之间自动插值，片段着色器拿到后重新归一化，再算 <code>N·L</code>。这就是逐像素光照比逐顶点光照平滑的原因：明暗是每个像素各算一次，而不是插值出来的。
    </p>
    <p>
      还有一处要交代清楚：为什么光源用<strong>方向向量</strong>而不是位置？因为这里用的是平行光——把它视为来自无穷远的大光源（比如太阳），场景里各点的光照方向一致，用一个 <code>uniform vec3 uLightDir</code> 就够了，不必每帧传位置再反算方向。整条流程是：
    </p>
    <ol class="lesson-steps">
      <li>顶点着色器把模型法线经 <code>uNormalMatrix</code> 变换到世界空间，随 varying 传给片段着色器。</li>
      <li>片段着色器对法线 <code>N</code> 与光源方向 <code>L</code> 归一化。</li>
      <li>计算 <code>NdotL = max(dot(N, L), 0.0)</code> 得到漫反射强度。</li>
      <li><code>ambient = uAmbient × 材质色</code>，<code>diffuse = 材质色 × NdotL</code>，二者相加输出。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个容易漏掉的点：</strong>其一，<code>N</code> 与 <code>L</code> 都必须归一化为单位向量，点积结果才落在 <code>[0, 1]</code>，否则强度会被悄悄放缩。其二，<code>NdotL</code> 一定要用 <code>max(..., 0.0)</code> 截负，否则背光面会得到「负的光」，把颜色减暗甚至减出异常。另外平行光是方向量、与位置无关，别把它当点光源来传坐标。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动环境光强度与光源方位、仰角，给这盏平行光换个方向；再勾选 N·L 可视化，看球面上的明暗如何随点积同步变化。</figcaption>
      <W11Lighting />
    </figure>

    <h2>总结</h2>
    <p>
      环境光加漫反射，把「物体是一块剪影」变成了「曲面有起伏、能看出光从哪来」。核心只有一个点积：<strong>表面越正对光源越亮</strong>。平行光用方向向量表达，环境光用一个与方向无关的常量补上背光面，逐像素计算让过渡更平滑。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Lambert 漫反射」</span>指理想漫反射表面（朗伯面）的亮度正比于法线 <code>N</code> 与光源方向 <code>L</code> 夹角的余弦，即 <code>max(dot(N, L), 0.0)</code>，且在各方向看亮度相同、与观察角度无关。边界：<code>N</code>、<code>L</code> 必须归一化；背光面（点积为负）要截为 0；它需要另加环境光，否则背光面一片全黑。
    </div>
  </LessonArticle>
</template>
