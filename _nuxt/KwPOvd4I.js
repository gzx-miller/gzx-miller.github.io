const e=`<script setup lang="ts">
import W17WebGL2 from './W17WebGL2.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给场景里的每个着色器都设置同一组 uniform——时间、视口分辨率、强度。程序一多，性能分析里 CPU 侧的大头全花在一条条 <code>gl.uniform*</code> 调用上。你心想：数据明明就这三个数，打包成一块缓冲、上传一次、所有着色器共享，不就行了？可你在 WebGL1 里翻遍 API，也找不到「把一组 uniform 装进缓冲区」的接口。同一份数据，为什么只能一个字段一个字段地重复搬运？
    </div>

    <h2>逐条设置开销</h2>
    <p>
      这批能力的缺失不是偶然——WebGL1 定格在 OpenGL ES 2.0 那一代，很多后来成为标配的东西，它要么没有，要么得靠扩展拼凑。
    </p>
    <p>
      沿用「逐个 <code>gl.uniform*</code> 设置 + 到处查扩展」的老办法，要人承担这些成本：
    </p>
    <ul>
      <li><strong>状态切换开销。</strong>每帧、每个程序逐条调用 <code>gl.uniform*</code>，每一次都是 CPU 到 GPU 的提交，程序一多就成了 CPU 侧的瓶颈；</li>
      <li><strong>数据要重复声明。</strong>「时间 / 分辨率 / 强度」这组数据被多个着色器共享，可每个程序里都得各声明一遍、各设置一遍，改一处要动 N 处，还容易不一致；</li>
      <li><strong>基础设施全靠扩展。</strong>VAO 要 <code>OES_vertex_array_object</code>，3D 纹理干脆没有，代码里到处都是「有没有这个扩展」的分支判断。</li>
    </ul>
    <p>
      问题由此落到一个很朴素的地方：<strong>能不能让一组 uniform 像顶点数据那样，被打包进一块缓冲区，一次上传、多个着色器共享？</strong>
    </p>

    <h2>渲染上下文升级</h2>
    <p>
      把上下文升级到 WebGL2：用 <code>canvas.getContext('webgl2')</code> 拿到基于 OpenGL ES 3.0 的上下文。它一次性解锁了一整批能力——统一缓冲区（UBO）、3D 纹理、原生 VAO、整数纹理、Transform Feedback、多目标渲染（MRT）。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「要什么能力就得先找什么扩展」变成了「一个版本全部内置」</strong>。但升级不是把 <code>'webgl'</code> 改成 <code>'webgl2'</code> 就完事：着色器也得跟着换用 GLSL 3.0 方言。
    </p>

    <h2>着色器语法迁移</h2>
    <ul>
      <li><strong>语法不对就编不过。</strong>把 WebGL1 的 <code>attribute</code> / <code>varying</code> / <code>gl_FragColor</code> 原样塞进 <code>#version 300 es</code>，编译会直接报错——属性要写 <code>in</code>，跨阶段变量顶点出用 <code>out</code>、片段的入用 <code>in</code>，片段输出要自己声明一个 <code>out</code> 变量。</li>
      <li><strong>UBO 不是随手排的。</strong>它按 <code>std140</code> 布局，成员有对齐规则——<code>vec2</code> 要 8 字节对齐、矩阵按列分段、数组元素补齐到 16 字节。按 C 的直觉紧凑排布，数据就会错位，GPU 读到的全是垃圾。</li>
      <li><strong>建了缓冲还得绑定。</strong>UBO 创建之后，要 <code>getUniformBlockIndex</code> 找到块、<code>uniformBlockBinding</code> 指定绑定点，再把缓冲绑到那个点上，少一步着色器里的块就是空的。</li>
      <li><strong>不是拿到 webgl2 就万事大吉。</strong>浮点 / 整数渲染目标仍要 <code>EXT_color_buffer_float</code> 之类扩展，老设备可能根本拿不到 webgl2 上下文，还得准备回退。</li>
    </ul>

    <h2>统一缓冲区布局</h2>
    <p>
      先把 UBO 这条主线打通。在顶点和片段着色器里声明<strong>同名、同布局</strong>的块：<code>layout(std140) uniform SharedData { float u_time; vec2 u_resolution; float u_intensity; };</code>。两个阶段共享这一块数据，缓冲区只创建一块、每帧只更新一次，着色器里直接按成员名使用即可。对接它需要按顺序做对四步：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>getUniformBlockIndex(program, 'SharedData')</code> 拿到块的索引，再用 <code>uniformBlockBinding</code> 把它绑定到绑定点 0。</li>
      <li>把存好数据的缓冲用 <code>bindBufferBase(UNIFORM_BUFFER, 0, ubo)</code> 绑到同一个套接点上，两者就对接上了。</li>
      <li>按 <code>std140</code> 的对齐规则排布缓冲内容——<code>vec2</code> 之后的成员要落在 8 字节边界上，别按紧凑顺序硬填。</li>
      <li>更新时只需一次 <code>bufferSubData</code>，不再逐个 uniform 调用。</li>
    </ol>
    <p>
      顺手把状态切换也解决掉。WebGL2 原生提供 <code>gl.createVertexArray</code>，把「绑定缓冲 + 配置属性指针」这组状态一次性缓存进 VAO，之后绘制前只 <code>bindVertexArray</code> 一句，省掉每次重新配置属性——不再需要那个 <code>OES_vertex_array_object</code> 扩展。
    </p>
    <p>
      再往前一步，用同一代提供的 3D 纹理做色彩分级：用 <code>texImage3D</code> 建一张 <code>16×16×16</code> 的体积纹理当查找表（LUT），着色器里声明 <code>sampler3D</code>，用三维坐标 <code>texture(u_lut, vec3(u, v, w))</code> 取样，把输入颜色映射成另一套色调。共享的 UBO 里那个 <code>u_intensity</code>，正好拿来控制 LUT 与原色的混合比例。
    </p>
    <p>
      最后对照 WebGL1 那份实现：同一画面在 WebGL1 里不能用 <code>#version 300 es</code>、没有 UBO、也没有 3D 纹理，只能逐个设置 uniform、用二维纹理去模拟。演示里的切换按钮，就是让你看到两套实现跑出相近的画面，但底层机制完全不同。
    </p>
    <div class="lesson-box warn">
      <strong>三个容易翻车的点：</strong>换了上下文就必须换语法——<code>attribute</code> 改 <code>in</code>、<code>varying</code> 改 <code>out</code> / <code>in</code>、<code>gl_FragColor</code> 改成自定义的 <code>out</code> 变量；<code>std140</code> 对齐是 UBO 最常见的坑，成员顺序或类型一变就要重新核对偏移；部分能力（浮点渲染目标等）仍需扩展，而且上线前要检测 webgl2 是否可用并准备回退。
    </div>

    <h2>六项新特性对比</h2>
    <figure class="lesson-figure">
      <figcaption>在 WebGL1 与 WebGL2 之间点按钮切换，再在 WebGL2 下点选「UBO 统一缓冲区 / 3D 纹理 / 原生 VAO / 整数纹理 / Transform Feedback / 多目标渲染」六个特性按钮，对照下方弹出的关键代码，看同一段渲染在两套 API 下的写法差异。</figcaption>
      <W17WebGL2 />
    </figure>

    <h2>扩展能力内置化</h2>
    <p>
      WebGL2 的意义不是「多了几个函数」，而是把一批原本要靠扩展拼凑、甚至根本做不到的能力，变成语言本身的一部分。核心的那个转变最先发生：一组共享的 uniform 从「逐个搬运」变成「一块缓冲、一次上传」，语法随之换代，UBO、3D 纹理、原生 VAO 都在这一代成了标配。
    </p>
    <div class="lesson-term">
      <span class="term-name">「统一缓冲区对象（Uniform Buffer Object，UBO）」</span>是 WebGL2 中的一种缓冲，把多个 uniform 变量打包成一块内存，供多个着色器程序共享，通过绑定点与着色器里的 uniform 块对接；它替代了逐条 <code>gl.uniform*</code> 的设置方式，减少 CPU 到 GPU 的调用与重复声明。边界与例外：布局遵循 <code>std140</code>，成员有对齐规则（<code>vec2</code> 8 字节对齐、矩阵按列分段、数组元素补齐到 16 字节），排布错误会读到错位的垃圾数据；使用时必须 <code>getUniformBlockIndex</code> + <code>uniformBlockBinding</code> + <code>bindBufferBase</code> 三步对接。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
