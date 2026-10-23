<script setup lang="ts">
import W08Textures from './W08Textures.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一张带文字的 Logo 贴到正方形上，运行时发现整张图上下颠倒，字全反了。你在图片软件里把它翻正再传，本地看着好了，可换个设备或换个 WebGL 环境又反了回来——你改的是「图」，错的却是「坐标」。
    </div>

    <h2>逐顶点颜色局限</h2>
    <p>
      你已经学会用颜色填满一个网格：每个顶点带一个颜色，光栅化时插值，片段着色器直接输出。现在想让网格显示一张图片。最直接的做法是把图片的像素颜色一个个写进顶点数据——但这条路会立刻暴露三笔隐藏成本：
    </p>
    <ul>
      <li><strong>数据量随分辨率爆炸。</strong>图片越大，要塞进顶点的数据越多，可网格形状一点没变。</li>
      <li><strong>图像内容被焊死在几何里。</strong>想换一张图、想让图挪一挪，就等于重做整个网格。</li>
      <li><strong>无法表达平铺。</strong>想让图重复铺满整块表面，你得先准备一张已经拼好的大图。</li>
    </ul>
    <p>
      真正的问题是：<strong>怎么让「网格长什么样」和「图长什么样」这两件事解耦，各管各的？</strong>
    </p>

    <h2>UV坐标引入</h2>
    <p>
      给每个顶点除了位置之外再加一个二维坐标 <code>aUV</code>，取值范围 <code>0</code> 到 <code>1</code>。顶点着色器把它作为 varying <code>vUV</code> 转发给片段着色器，光栅化时硬件会<strong>在多个顶点的 UV 之间自动插值</strong>；片段着色器拿插值出来的 UV 去采样纹理：
    </p>
    <p>
      <code>gl_FragColor = texture2D(uTexture, vUV);</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>图片只上传一次进 GPU 显存</strong>，之后每个像素按自己那份 UV 去取色。换一个网格，纹理本身不用动；换一张图，几何也不用重做。纹理是上传到显存、通过 UV 坐标贴到几何体表面的图像数据，像素与顶点从此各归各位。
    </p>

    <h2>轴向颠倒成因</h2>
    <ul>
      <li><strong>方向颠倒。</strong>UV 的 <code>(0, 0)</code> 在左下、V 向上；但 DOM 图片按自上而下存储，WebGL 默认把图像首行传到 <code>v = 0</code>（纹理底行），直接把 UV 用上去，图就是上下颠倒的。</li>
      <li><strong>边缘拉伸。</strong>UV 超出 <code>[0, 1]</code> 时由 wrap 参数决定取色；默认 <code>REPEAT</code> 会环绕，只有显式设为 <code>CLAMP_TO_EDGE</code> 才会把坐标夹到边缘，形成拖尾条纹。</li>
      <li><strong>平铺出缝。</strong><code>REPEAT</code> 只负责坐标环绕；如果纹理左右或上下边缘的内容不连续，UV 乘 2 平铺后接缝处仍会出现明显折线或错位。</li>
      <li><strong>采样到空白。</strong>图片是异步加载的，如果没等解码完成就调用 <code>texImage2D</code> 上传，可能拿到 0×0 或未完成的图像数据，纹理呈黑或白。</li>
    </ul>

    <h2>越界采样处理</h2>
    <p>
      问题不是「UV 用错了」，而是「越界的 UV 该怎么算」和「UV 怎么变换」这两件事没说清。一层层补上：
    </p>
    <ol class="lesson-steps">
      <li>创建纹理对象并绑定到 <code>TEXTURE_2D</code>，用 <code>texImage2D</code> 上传图片数据。</li>
      <li>设置纹理参数——<strong>wrap 环绕</strong>与 <strong>filter 过滤</strong>，确保任何 UV 都能完整采到色。</li>
      <li>顶点带上 <code>aUV</code>，顶点着色器作为 varying <code>vUV</code> 转发给片段着色器。</li>
      <li>片段着色器先对 <code>vUV</code> 做平铺与偏移，再调用 <code>texture2D(uTexture, uv)</code> 采样输出。</li>
    </ol>
    <p>
      先补 <strong>wrap（环绕）参数</strong>，它专门管「UV 越界时怎么办」：<code>CLAMP_TO_EDGE</code> 把越界坐标夹紧到最近的边缘像素，适合单张图、不希望重复的情形；<code>REPEAT</code> 则会环绕回绕，让 UV 取 <code>1.2</code> 时自动采样到 <code>0.2</code> 的位置，从而实现坐标层面的平铺。
    </p>
    <p>
      有了 <code>REPEAT</code>，平铺就成了对 UV 的简单缩放：采样前算一次 <code>uv = vUV * tile + offset</code>。<code>tile</code> 大于 1 就重复铺满，<code>offset</code> 负责把图像整体挪位——<strong>不改网格、不重传图片，只改两个 uniform</strong>。纹理边缘能否无缝衔接取决于图像内容本身，<code>REPEAT</code> 不会自动消除接缝。演示里叠的 UV 网格，就是让你看到每个屏幕像素其实是在问「我对应的 UV 是多少」。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易踩的坑：</strong>其一，UV 原点在左下，而 DOM 图片默认按自上而下存储，所以上传时通常设置 <code>UNPACK_FLIP_Y_WEBGL = true</code> 把像素翻成自下而上，或在采样时用 <code>1.0 - v</code>；其二，图片是异步加载的，<strong>务必在 <code>texImage2D</code> 之前确认解码完成</strong>，否则可能上传未完成的数据，画面会一片黑或一片白。
    </div>

    <h2>平铺与偏移观察</h2>
    <figure class="lesson-figure">
      <figcaption>拖动 UV 平铺滑杆让图片重复铺满整块四边形，再用偏移滑杆移动画面，勾选 UV 网格就能看到每个像素实际用了哪一组 UV 取色。</figcaption>
      <W08Textures />
    </figure>

    <h2>纹理映射职责</h2>
    <p>
      纹理映射把「图长什么样」和「网格长什么样」拆开了：顶点只负责带上 <code>0</code> 到 <code>1</code> 的 UV，光栅化时插值，片段着色器按 UV 采样。<strong>方向颠倒、边缘拉伸、平铺出缝，几乎都能归到 UV 与 wrap 这两处没对齐。</strong>
    </p>
    <div class="lesson-term">
      <span class="term-name">「UV 坐标」</span>是归一化的二维纹理坐标，通常取值 <code>0</code> 到 <code>1</code>，<code>(0, 0)</code> 在左下、U 向右、V 向上，用来把纹理像素映射到几何表面。牢记两点：DOM 图片默认自上而下，和 UV 的 V 方向相反，需翻转或取 <code>1.0 - v</code>；越界 UV 的行为由 wrap 决定（<code>CLAMP_TO_EDGE</code> 夹紧、<code>REPEAT</code> 环绕平铺）。
    </div>
  </LessonArticle>
</template>
