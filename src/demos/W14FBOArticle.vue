<script setup lang="ts">
import W14FBO from './W14FBO.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你画好了带光照的场景，现在想给它整体加一层「反相」滤镜。你第一反应是回每个物体的片段着色器里改：材质色取 <code>1</code> 减。可当效果要换成灰度、棕褐，甚至模糊时，你发现每加一种效果都得钻回十几个着色器里改一遍；而模糊这种要读「周围像素」的效果，单看某个物体的着色器根本不知道邻居画了什么。只是想给画完的画面再加一道处理，怎么就这么难？
    </div>

    <h2>屏幕渲染局限</h2>
    <p>
      到这里为止，你的渲染目标一直是<strong>屏幕</strong>。片段着色器算出的颜色直接写进屏幕的帧缓冲，画完就交出去了，你再也拿不回来、改不了。想做「全屏效果」，就必须能在整张画面<strong>画完之后</strong>，再把它整体取出来算一遍。
    </p>
    <p>
      把效果逻辑塞进每个物体的着色器，代价藏得很深：效果代码<strong>散落到所有材质里</strong>，改一次要动 N 个地方；邻域效果（模糊、描边）需要读周围像素，逐物体的着色器<strong>拿不到画面上下文</strong>；也没法做到「先照常画好、再统一加效果」。于是问题很清楚：<strong>怎么让渲染结果先落进一个可以再次被采样的地方，而不是直接冲上屏幕？</strong>
    </p>

    <h2>离屏渲染目标</h2>
    <p>
      引入<strong>帧缓冲对象（Framebuffer Object，FBO）</strong>——一个可以切换的渲染目标。绑定它之后，<code>draw</code> 的输出不再进屏幕，而是进这个 FBO。但要注意：FBO 本身不存像素，它只是个「附件的挂载点」，所以还得给它挂一张<strong>颜色纹理</strong>当附件（<code>COLOR_ATTACHMENT0</code>）。这样第一遍把场景渲进这张纹理，就完成了「<strong>渲染到纹理</strong>（render to texture）」。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它把「画面」变成了可以当普通纹理再采样的数据</strong>。有了这层数据，第二遍想怎么处理都行。
    </p>

    <h2>深度附件缺失</h2>
    <ul>
      <li><strong>只挂颜色会丢遮挡。</strong>场景开了深度测试，若 FBO 没有深度附件，深度值无处存放，前后物体的遮挡关系会错乱，后面的反而盖住前面的。</li>
      <li><strong>附件不匹配会静默失败。</strong>附件格式不对、尺寸不一致或漏挂，FBO 会处于不完整状态，此时对它的所有绘制都画不出来，而且往往不报错——不显式检查就查不出原因。</li>
      <li><strong>忘了切回屏幕就是一片空白。</strong>如果一直绑着 FBO，第二遍的绘制又画回了离屏纹理，屏幕上什么都看不到。</li>
      <li><strong>第二遍还得有块「画布」。</strong>要把离屏纹理铺满屏幕显示，需要一块能覆盖全屏的四边形——现在的零散几何体没法干这个。</li>
    </ul>

    <h2>附件配置顺序</h2>
    <p>
      先把 FBO 的「最小可工作配置」按顺序配齐。顺序很重要，少一步都会静默失败：
    </p>
    <ol class="lesson-steps">
      <li>创建 FBO 并绑定，创建一张颜色纹理作为 <code>COLOR_ATTACHMENT0</code> 附件：用 <code>texImage2D</code> 分配一张 RGBA 空纹理（数据传 <code>null</code>），并设好 <code>filter</code> 与 <code>wrap</code>。</li>
      <li>配齐深度附件（<code>DEPTH_ATTACHMENT</code>，用一个 renderbuffer），否则深度遮挡会错。</li>
      <li>用 <code>checkFramebufferStatus</code> 检查完整性，只有返回 <code>FRAMEBUFFER_COMPLETE</code> 才算配好。</li>
      <li>第一遍：绑定 FBO，把场景渲染到它的颜色纹理里。</li>
      <li>第二遍：<code>bindFramebuffer(FRAMEBUFFER, null)</code> 切回默认帧缓冲，用一块全屏四边形采样那张纹理显示出来。</li>
    </ol>
    <p>
      逐步解释几个关键选择。为什么颜色附件要用<strong>纹理</strong>、而不是渲染缓冲？因为纹理可以被后续采样复用——这正是「渲到纹理」的全部意义，若用渲染缓冲，这份颜色就没法再当输入来读。为什么必须查 <code>checkFramebufferStatus</code>？因为 FBO 完整性不满足时不会抛错，只是静默地什么都不画，不主动查就只能对着黑屏干瞪眼。
    </p>
    <p>
      第二遍的「画布」是一块<strong>全屏四边形</strong>：顶点直接在顶点着色器里输出 NDC 坐标（<code>gl_Position = vec4(aPosition, 0.0, 1.0)</code>），UV 由顶点位置换算，正好覆盖整屏。它的片段着色器 <code>texture2D</code> 采样 FBO 纹理，再对取到的颜色做逐像素处理——原样、反相、灰度、棕褐，想加哪种就加哪种。这样一来，同一份场景只要换一个处理分支，就能得到不同效果，<strong>完全不必回去改每个物体的着色器</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>三条别踩的线：</strong>FBO 不存储图像本身，它只是一组附件的挂载点，把颜色纹理挂上去，离屏结果才可被采样；切回屏幕一定要 <code>bindFramebuffer(null)</code>，否则会继续往离屏纹理上画；离屏纹理的尺寸通常取与屏幕分辨率一致（或按比例），第二遍映射时才不会被拉伸变形。
    </div>
    <p>
      最后记住一点格局：这条「渲到纹理、再读回来」的通道，是后处理、阴影映射、G-Buffer、镜像水面等一大批高级技术<strong>共用的地基</strong>。本课先把最基础的一步走通：把场景画进纹理，再从纹理里把它读出来。
    </p>

    <h2>四种滤镜对比</h2>
    <figure class="lesson-figure">
      <figcaption>开着 FBO 离屏渲染，用「分屏对比」把原图和处理结果并排，切换原样 / 反相 / 灰度 / 复古四种后处理；再取消勾选离屏渲染，看直接上屏与经过 FBO 的画面对照。</figcaption>
      <W14FBO />
    </figure>

    <h2>可重采样纹理</h2>
    <p>
      当渲染目标可以自由切换，画面就不再是「一次性的输出」。FBO 把场景画进一张可再次采样的纹理，第二遍再对它做处理——全屏滤镜、后处理、阴影都建立在同一条「渲到纹理再读回」的通道上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「帧缓冲对象（Framebuffer Object，FBO）」</span>是一个可切换的渲染目标，允许把绘制结果写入离屏的纹理或渲染缓冲，而不直接显示到屏幕。它<strong>自身不保存图像</strong>，必须挂接附件才有意义——颜色附件常用一张 RGBA 纹理（便于后续当普通纹理采样），深度可用 renderbuffer。边界与例外：用前须 <code>checkFramebufferStatus</code> 确认完整（不完整会静默失败），用完须 <code>bindFramebuffer(null)</code> 切回屏幕；正因为颜色附件是纹理，渲染结果才能被再次采样。
    </div>
  </LessonArticle>
</template>
