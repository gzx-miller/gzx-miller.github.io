const e=`<script setup lang="ts">
import W03Buffers from './W03Buffers.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一个立方体明明只有 8 个角，你却往顶点缓冲里塞了 36 个顶点——因为 6 个面各拆成两个三角形、每个三角形写 3 个顶点。顶点更少，显存里却存了四倍多的数据，而且改一个角的位置要同时改好几处，这不是自己给自己找麻烦吗？
    </div>

    <h2>按序上传惯性</h2>
    <p>
      你要做的是把一团顶点数据交给 GPU 去画。最直觉的做法：把每个三角形要用到的顶点，按绘制顺序挨个写进数组，上传，然后 <code>drawArrays</code> 顺序画下去。能用，但它在三件事上把成本悄悄压给了你：
    </p>
    <ul>
      <li><strong>共享顶点被复制</strong>：网格里相邻面共用的顶点会被重复写好几份，顶点数越多、重复越严重，显存与带宽就白白浪费。</li>
      <li><strong>描述不了「复用」</strong>：<code>drawArrays</code> 只能顺着数组往下取，你没法告诉它「这两个三角形共用第 3 号顶点」。</li>
      <li><strong>属性配置每次重来</strong>：每换一个网格，都要把 <code>enableVertexAttribArray</code> 与 <code>vertexAttribPointer</code> 重设一遍，几十个物体时这笔状态开销很可观。</li>
    </ul>
    <p>
      所以真正的问题是：<strong>顶点数据该怎么存、又该怎么被一次绘制调用消费，才能既不重复存，又不用反复重设状态？</strong>
    </p>

    <h2>顺序排列顶点</h2>
    <p>
      最朴素的方案：把所有顶点按绘制顺序排成一个数组，用 <code>createBuffer</code> 建缓冲、绑定到 <code>ARRAY_BUFFER</code>，<code>bufferData</code> 上传进显存，然后 <code>drawArrays(mode, 0, count)</code> 从头顺序取顶点画出来。
    </p>
    <p>
      这个方案做对了一件基础的事：<strong>它把「数据」和「绘制」分开了</strong>。顶点先一次性存进显存（这叫 VBO，顶点缓冲对象），之后每次绘制只是告诉 GPU「用哪个模式、从第几个开始取、取多少个」。同一串顶点，换个 <code>mode</code> 就能被解释成点、线或三角形——<code>mode</code> 决定 GPU 怎么把顶点串成图元，这本身就是一条值得记住的线索。
    </p>

    <h2>顶点复制代价</h2>
    <ul>
      <li>立方体的 8 个顶点被复制成 36 份，改一个角的位置要同步改多处，漏改一处网格就破面。</li>
      <li>绘制顺序完全由数组排列决定，你无法表达「第 0、1、2 号顶点组成这个三角形，第 0、2、3 号组成那个三角形」。</li>
      <li>顶点越多的网格，重复数据的显存占用和每次上传的带宽浪费越明显。</li>
      <li>每切换一次网格，属性指针配置都要重新执行一遍，状态没有地方可以缓存。</li>
    </ul>

    <h2>索引复用机制</h2>
    <p>
      不推翻「数据存进缓冲」，而是把「顶点数据」与「按什么顺序取用」这两件事拆开，再给属性配置找个落脚的地方。
    </p>
    <ol class="lesson-steps">
      <li><strong>先把顶点与索引分开存。</strong>顶点仍然放进 <code>ARRAY_BUFFER</code>（VBO），另外把「顶点编号」这串索引放进 <code>ELEMENT_ARRAY_BUFFER</code>（EBO，索引缓冲），绘制改用 <code>drawElements(mode, count, type, offset)</code> 按索引取顶点。8 个顶点只存一份，三角形由索引表来描述，共享的顶点被真正复用，显存与带宽都省了下来。</li>
      <li><strong>再把属性配置打包。</strong>用顶点数组对象（VAO）把「数据缓冲 + 每个 attribute 的指针配置」打包成一份状态：配置一次，之后切换到该网格只需绑定对应 VAO，不必再重复 <code>enableVertexAttribArray</code> 与 <code>vertexAttribPointer</code>。</li>
      <li><strong>最后用 mode 决定解释方式。</strong>同一串顶点，<code>POINTS</code> 画独立点、<code>LINES</code> 画成对线段、<code>LINE_STRIP</code> 画折线带、<code>TRIANGLES</code> 画独立三角形、<code>TRIANGLE_FAN</code> 画三角扇形。本课的圆环点阵就是在五种图元模式与两种取用方式之间来回切换，直观看到同一份数据的不同面貌。</li>
    </ol>
    <p>
      这里有两条边界必须记住。其一，<code>drawElements</code> <strong>必须先绑定 <code>ELEMENT_ARRAY_BUFFER</code></strong>，而且索引值不能越过顶点总数，否则轻则画错、重则报错。其二，<strong>VAO 保存的是「状态」而不是「数据」</strong>——它记录的是属性指针指向哪个缓冲、以什么步长与偏移读取，顶点数据本身仍在 VBO/EBO 里。VAO 在 WebGL1 里要通过 <code>OES_vertex_array_object</code> 扩展使用，WebGL2 才原生支持，本课就是走的扩展这条路。
    </p>
    <div class="lesson-box warn">
      <strong>别把 drawArrays 和 drawElements 当成「新老两代」：</strong>它们只是两种取用方式，没有谁替代谁。<code>drawArrays</code> 顺序取顶点，对不共享顶点的独立图元最直接；<code>drawElements</code> 多了一层按索引取用的机会，只有<strong>当索引真正复用了顶点时</strong>才省显存。本课那串索引恰好是顺序编号，两种方式的画面一致，正是想说明这一点。
    </div>

    <h2>五种图元差异</h2>
    <figure class="lesson-figure">
      <figcaption>切换 POINTS / LINES / LINE_STRIP / TRIANGLES / TRIANGLE_FAN 五种图元，看同一串顶点被解释成完全不同的形状；再勾选/取消「启用 EBO 索引缓冲」，对比 drawElements 按索引绘制与 drawArrays 顺序绘制，右侧代码区会同步显示当前这一次绘制调用的参数。</figcaption>
      <W03Buffers />
    </figure>

    <h2>三层职责归位</h2>
    <p>
      顶点数据的组织可以拆成三层：数据用 VBO/EBO 上传进显存并靠索引复用顶点，配置用 VAO 打包成一份可复用的状态，绘制时再由 <code>mode</code> 决定这串顶点被解释成点、线还是三角形。把这三件事分清，重复存储与重复设置状态就都被省掉了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「顶点数组对象（VAO）」</span>把「数据缓冲绑定 + 每个 attribute 的指针配置（步长、偏移、类型、是否归一化）」打包成一份顶点状态，切换网格时只绑定对应 VAO 即可，无需重设指针。记住它的边界：VAO 只保存<strong>状态</strong>不保存<strong>数据</strong>，顶点数据仍在 VBO/EBO 中；WebGL1 需经 <code>OES_vertex_array_object</code> 扩展，WebGL2 原生支持；同一时刻只能绑定一个 VAO。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
