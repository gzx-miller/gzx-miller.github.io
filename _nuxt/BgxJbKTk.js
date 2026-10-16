const n=`<script setup lang="ts">
import W10MultiTexture from './W10MultiTexture.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想给模型贴上「木纹底色 + 一块标识贴纸」，于是打开修图软件，把标识 P 到木纹图上，导出成一张新图。可几天后你只想把贴纸换个位置、或把叠加调淡一点，却发现只能重新 P 一遍——你合成的是「结果」，丢掉的是「可调性」。
    </div>

    <h2>离线合成局限</h2>
    <p>
      你已经能用一个 sampler 采样一张纹理。现在需要在一个物体上同时用上多种纹理——颜色底色叠一层贴纸，甚至还要加一张法线图、一张粗糙度图。离线把它们 P 成一张图看似省事，代价却藏得很深：
    </p>
    <ul>
      <li><strong>每种组合都要重做。</strong>换个叠加强度、换个贴纸位置，都得重新导出，运行时无法调节。</li>
      <li><strong>资源成倍增长。</strong>同一张底色配 N 张不同贴纸，就要存 N 份合成图。</li>
      <li><strong>表达不了非颜色信息。</strong>法线图、粗糙度图不是简单叠色能表达的，离线合成这条路根本走不通。</li>
    </ul>
    <p>
      于是问题落到：<strong>怎么在一次绘制里同时采样多张纹理，并在运行时按参数把它们合并？</strong>
    </p>

    <h2>片段着色器叠加</h2>
    <p>
      把合并从 CPU 挪进片段着色器：声明两个 <code>uniform sampler2D</code>，分别采样两张纹理，再把两个颜色直接相加。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它把「混合」变成了运行时的事</strong>。两张图各自保持原样上传一次，合并发生在每个像素上，改参数就能改效果，不必回头 P 图。
    </p>

    <h2>过曝与裁切隐患</h2>
    <ul>
      <li><strong>过曝。</strong>直接相加会让亮度超过 <code>1</code>，被硬件裁掉，叠加处变成刺眼的白块，也完全没法控制「叠多少」。</li>
      <li><strong>取到同一张图。</strong>两个 sampler 都声明好了，可它们各自该从哪取数据没人说清；若两张纹理都绑到同一个位置，后面绑定的会覆盖前面的，两个 sampler 拿到的是同一张图。</li>
      <li><strong>采样来源未表达。</strong>「这个 sampler 从哪个槽位取数据」这件事，还没被写进代码。</li>
      <li><strong>透明贴纸不对。</strong>贴纸带 alpha 时，直接相加会把底色也一起提亮，贴纸边缘没有正确的覆盖关系。</li>
    </ul>

    <h2>纹理单元引入</h2>
    <p>
      病根是「多张纹理怎么各就各位」。先补上承载它们的容器——<strong>纹理单元</strong>：GPU 提供的若干独立槽位（<code>TEXTURE0</code>、<code>TEXTURE1</code>……），每个槽位绑定「一个 sampler 对应一份纹理数据」。整条流程是：
    </p>
    <ol class="lesson-steps">
      <li>为每张纹理绑定一个纹理单元：<code>activeTexture(TEXTURE0)</code> 后绑定底色图，<code>activeTexture(TEXTURE1)</code> 后绑定叠加图。</li>
      <li>用 <code>uniform1i</code> 把该单元号指派给对应的 sampler：<code>uniform1i(uBaseTex, 0)</code>、<code>uniform1i(uOverlayTex, 1)</code>。</li>
      <li>顶点带 <code>aUV</code>，作为 varying <code>vUV</code> 传给片段着色器。</li>
      <li>片段着色器分别用 <code>texture2D</code> 采样 <code>uBaseTex</code> 与 <code>uOverlayTex</code> 得到两色。</li>
      <li>按选中的 mix / add / multiply / alpha 模式与 <code>uBlendFactor</code> 合并后输出。</li>
    </ol>
    <p>
      要理解第 2 步：<strong>sampler 本身不是数据容器，只是一个指向纹理单元号的整数</strong>。你把 <code>0</code> 塞给它，它就知道「去 TEXTURE0 取数据」。这也是为什么必须先 <code>activeTexture</code> 选好槽位、再 <code>bindTexture</code>，最后用 <code>uniform1i</code> 把号告诉 sampler。
    </p>
    <p>
      位置定好之后，再补「怎么合」。演示里给了四种模式，配一个 <code>uBlendFactor</code> 调节强度：
    </p>
    <ul>
      <li><strong>mix</strong>：<code>mix(base, overlay, f)</code> 在两张颜色之间线性插值，<code>f</code> 从 0 到 1 控制叠加多少，最通用。</li>
      <li><strong>add</strong>：<code>base + overlay * f</code>，让整体提亮，适合做光晕、发光。</li>
      <li><strong>multiply</strong>：<code>base * mix(1.0, overlay, f)</code>，让整体压暗，适合做阴影或染色。</li>
      <li><strong>alpha</strong>：按 overlay 的 alpha 与 <code>f</code> 做加权，用于贴纸这类带透明通道的图。</li>
    </ul>
    <div class="lesson-box warn">
      <strong>两个别混掉的概念：</strong>其一，纹理单元数量有上限，由 <code>GL_MAX_TEXTURE_IMAGE_UNITS</code> 决定，WebGL1 通常至少 8 个——不是想绑多少就绑多少。其二，本课的混色是<strong>在片段着色器内部</strong>完成的，属于「纹素对纹素」；如果你想让画出来的片元再和帧缓冲里<strong>已有</strong>的内容合成（比如真正的半透明物体叠在场景上），那是另一回事，需要启用 <code>gl.BLEND</code> 并配置 <code>blendFunc</code>，不是在着色器里 mix 就能了事。
    </div>
    <p>
      走到这里你会发现一个顺手的收获：<strong>一份网格配一套 attribute，通过多个 sampler 就能在单次 draw call 里组合多张纹理</strong>。同一组 UV 下采样多张图再按权重相加，正是法线贴图、粗糙度贴图这类 PBR 材质叠加的基础做法。
    </p>

    <h2>四种混合模式对比</h2>
    <figure class="lesson-figure">
      <figcaption>切换 MIX / 相加 / 相乘 / Alpha 四种混合模式，并拖动混合因子，看棋盘底色与圆形叠加两张纹理如何按不同规则融合。</figcaption>
      <W10MultiTexture />
    </figure>

    <h2>运行时加权混合</h2>
    <p>
      多纹理混合把「一张图搞定」拆成「多张图各自采样 + 运行时加权」。关键是给每个 sampler 指定一个纹理单元，再按模式在片段着色器里合并。<strong>换效果只改 uniform 参数，不用回头重新 P 图。</strong>
    </p>
    <div class="lesson-term">
      <span class="term-name">「纹理单元」</span>是 GPU 上用于绑定「采样器（sampler）↔ 纹理数据」的独立槽位（<code>TEXTURE0</code>、<code>TEXTURE1</code> ……），数量由 <code>GL_MAX_TEXTURE_IMAGE_UNITS</code> 决定，WebGL1 通常至少 8 个。注意 sampler 自身只是指向单元号的整数，不是数据容器；这里的混合发生在片元着色器内部，若要让结果与帧缓冲已有内容再合成，需另启用 <code>gl.BLEND</code>。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
