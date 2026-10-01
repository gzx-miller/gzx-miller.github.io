<script setup lang="ts">
import W01WebGLContext from './W01WebGLContext.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把 Canvas 2D 里那句 <code>ctx.fill()</code> 的思路原样搬进 WebGL，想画一个三角形，结果画布全黑、控制台却一个字都不报——代码没错、也没崩，为什么就是什么都没有？
    </div>

    <h2>提出问题</h2>
    <p>
      Canvas 2D 让你觉得「画东西」是理所当然的：<code>beginPath</code>、<code>moveTo</code>、<code>lineTo</code>、<code>fill</code>，四行就有了一个三角形。可换成 WebGL，同样一个三角形却要写上几十行：取上下文、写两段着色器源码、编译、链接、建缓冲、传数据，最后才敢调用一次 <code>drawArrays</code>。
    </p>
    <p>
      这不是 WebGL 故意为难你，而是它<strong>根本不认识「三角形」这个概念</strong>。Canvas 2D 里有一整套替你兜底的隐式成本，搬到 WebGL 上，这些成本必须由你自己承担：
    </p>
    <ul>
      <li><strong>它不懂图元</strong>：Canvas 2D 知道「路径」和「填充」是什么意思；WebGL 只认顶点和像素，中间「怎么把顶点变成带颜色的像素」要靠你写的程序规定。</li>
      <li><strong>它不在同一块内存里</strong>：Canvas 2D 拿到的坐标在 CPU 这一侧就画掉了；GPU 有自己的显存，你的顶点数据得显式拷贝过去，它才看得见。</li>
      <li><strong>它没有默认状态</strong>：<code>fillStyle</code> 设一次就全局生效，而 WebGL 需要你在每次绘制前，自己把程序、缓冲、属性、全局量一一就位。</li>
    </ul>
    <p>
      所以真正要问的是：<strong>一次绘制，到底要让哪些部件按什么顺序各就各位，GPU 才会画出东西？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的想法是：先把「入口」拿到手，剩下的以后再说。<code>canvas.getContext('webgl')</code> 会返回一个 <code>WebGLRenderingContext</code>，你就把它当成「那个什么都能干的对象」，需要什么都在它身上找。
    </p>
    <p>
      这个方案做对了一件很关键的事：<strong><code>WebGLRenderingContext</code> 确实是所有 GPU 操作的唯一入口</strong>。编译着色器、创建缓冲、上传数据、发起绘制，全都挂在同一个对象上。如果这里返回 <code>null</code>（浏览器不支持 WebGL），后面的一切都无从谈起，早点判空反而能省掉一堆迷惑。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>只拿到上下文，屏幕上仍然只有 <code>clearColor</code> 刷出的底色——GPU 不知道该在哪、用什么颜色画，它会直接跳过绘制。</li>
      <li>你把着色器源码当普通字符串传进去，<code>COMPILE_STATUS</code> 却是 <code>false</code>，而函数并不抛异常，错误被藏在 <code>getShaderInfoLog</code> 里。</li>
      <li>就算程序链接成功，顶点着色器没写 <code>gl_Position</code>，GPU 也拿不到顶点位置，三角形无从谈起。</li>
      <li>顶点坐标以一个普通 JavaScript 数组传进去，GPU 根本读不到——它只认显存里的缓冲对象。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「上下文是入口」这一点，而是沿着这条入口把管线一段段接起来。<strong>WebGL 的启动流程本质上是一条固定顺序的装配线</strong>，缺任何一环，最后的 <code>drawArrays</code> 都画不出东西。
    </p>
    <ol class="lesson-steps">
      <li>获取 Canvas，通过 <code>getContext('webgl')</code> 拿到 WebGL 上下文，它是后续所有调用的落点。</li>
      <li>编写两段着色器：顶点着色器把 <code>aPosition</code> 写入 <code>gl_Position</code>，片段着色器输出 <code>uColor</code>。</li>
      <li>把两段着色器分别 <code>compileShader</code>，再 <code>linkProgram</code> 链接成一个程序，随后用 <code>getAttribLocation</code> 与 <code>getUniformLocation</code> 取到变量位置。</li>
      <li>把顶点数据通过 <code>bufferData</code> 上传成缓冲对象，送入显存。</li>
      <li>绘制前设好属性与全局量，调用 <code>drawArrays(TRIANGLES, 0, 3)</code> 触发 GPU 跑完整条管线。</li>
    </ol>
    <p>
      接的过程中，你会看清这条管线里<strong>只有两段是可编程的</strong>。顶点着色器<strong>每个顶点执行一次</strong>，负责把顶点放到该在的位置，必须写 <code>gl_Position</code>；片段着色器<strong>每个像素执行一次</strong>，负责决定这个像素是什么颜色，写 <code>gl_FragColor</code>。二者之间的裁剪、图元装配、光栅化由硬件固定管线完成，你写不了、也不需要写。本课这个三角形，位置来自逐顶点的 <code>attribute</code>，颜色来自整次绘制共享的 <code>uniform</code>。
    </p>
    <p>
      还有几处容易被忽略、却会让画面直接变黑或报错的细节。顶点数据必须先经 Buffer 上传到显存，绘制前还要用 <code>enableVertexAttribArray</code> 与 <code>vertexAttribPointer</code> 把它连到 <code>aPosition</code> 上，否则着色器读到的是默认值。片段着色器里<strong>必须用 <code>precision</code> 声明浮点精度</strong>，<code>mediump</code> 省算力、<code>highp</code> 更精确但并非所有设备都保证支持——这是着色器写法与普通 JavaScript 最不一样的地方之一。
    </p>
    <div class="lesson-box warn">
      <strong>别把着色器当成「传个字符串」：</strong><code>compileShader</code> 与 <code>linkProgram</code> 失败时都不会抛异常，只把状态置为 <code>false</code>。务必检查 <code>COMPILE_STATUS</code> / <code>LINK_STATUS</code>，失败时用 <code>getShaderInfoLog</code> / <code>getProgramInfoLog</code> 读出诊断信息，否则你只会看到一块黑屏。
    </div>
    <p>
      顺带记一个不影响正确性、只影响表现与开销的设置：上下文的 <code>antialias</code>、<code>alpha</code>、<code>preserveDrawingBuffer</code> 这些属性只改变渲染行为，按需开启即可，别一律设成 <code>true</code>——它们各自都有代价。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>调一调画布背景色，再勾选/取消三个可见性开关，把「取上下文→写着色器→编译链接→上传缓冲→drawArrays」这条管线逐段看清楚，并注意三角形的颜色来自那个一直在变化的 uniform。</figcaption>
      <W01WebGLContext />
    </figure>

    <h2>总结</h2>
    <p>
      WebGL 画不出东西，几乎都不是「代码崩溃」，而是装配线上缺了一环。上下文是所有 GPU 操作的唯一入口，可编程的只有顶点与片段两段着色器，顶点数据必须显式上传进缓冲，最后由一次 <code>drawArrays</code> 把整条管线跑通。
    </p>
    <div class="lesson-term">
      <span class="term-name">「着色器程序（Shader Program）」</span>是顶点着色器与片段着色器各自编译后、经 <code>linkProgram</code> 链接而成的可执行单元，也是 <code>useProgram</code> 与 <code>drawArrays</code> 实际使用的对象；attribute、uniform 的位置都要从<strong>链接后的程序</strong>上查询。注意着色器对象（shader）只是中间产物，链接失败的程序不可用，且同一个着色器可以被链接进多个程序。
    </div>
  </LessonArticle>
</template>
