<script setup lang="ts">
import W18Instancing from './W18Instancing.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想画一片草地：几百棵草，每棵都用同一份几何数据。你写了个循环，对每一棵设置一次它的位置和旋转 uniform，再调用一次 <code>drawElements</code>。草是长出来了，帧率却掉到了个位数。你第一反应是三角形太多，于是把草的三角形砍掉一半——帧率几乎没动。为什么把「看起来最重」的几何变少了，画面反而没变快？
    </div>

    <h2>逐次绘制开销</h2>
    <p>
      问题出在那个循环本身。当几何体完全相同、每个物体只有「位置和旋转」不同时，逐个 draw 让 CPU 承担了大量<strong>与几何无关</strong>的开销：
    </p>
    <ul>
      <li>每次绘制前都要重新设置 <code>u_offset</code> / <code>u_rot</code>，这是一次 CPU 到 GPU 的调用，跟这批画了多少三角形毫无关系；</li>
      <li>draw call 本身有固定的驱动与校验开销，即使它只画三个三角形，这笔成本也照收——这正是砍面数没用、砍循环才管用的原因；</li>
      <li>每个物体都要重新走一遍状态准备流程，开销完全无法摊薄到多个物体身上。</li>
    </ul>
    <p>
      问题于是落到：<strong>当几何完全一致、只有逐物体的变换不同时，怎么让 GPU 一次就把它们全画出来？</strong>
    </p>

    <h2>逐实例顶点属性</h2>
    <p>
      把「每个实例之间的不同」也变成一种顶点属性。给每个实例准备一份数据（位置、旋转），存进一块单独的缓冲；再用<strong>属性除数（divisor）</strong>告诉 GPU：这个属性前进一步的条件不是「画完一个顶点」，而是「画完一整个实例」——设成 <code>divisor = 1</code> 就是这个意思。最后用一次带实例数的绘制调用，把 N 个实例一次提交。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把 N 次重复的 draw call 压成了一次，并把逐实例的差异从「每次都要重设的 uniform」挪进了顶点属性</strong>。
    </p>

    <h2>属性除数缺失</h2>
    <ul>
      <li><strong>不设 divisor 会全叠在一起。</strong>如果实例属性仍按逐顶点（<code>divisor = 0</code>）推进，那么同一份几何的每个顶点读到的都是缓冲开头的几个值，N 个物体全部长到同一个位置、同一个角度上，看上去只画了一个。</li>
      <li><strong>WebGL1 里没有这个原生 API。</strong>得先 <code>getExtension('ANGLE_instanced_arrays')</code>，方法名还带 <code>ANGLE</code> 后缀（<code>vertexAttribDivisorANGLE</code> / <code>drawElementsInstancedANGLE</code>），拿不到扩展就只能退回逐个绘制。</li>
      <li><strong>属性槽位是有限的。</strong>实例属性也占用普通的 attribute 槽位，个数受 <code>GL_MAX_VERTEX_ATTRIBS</code> 限制——逐实例属性用得越多，留给逐顶点属性的槽位就越少。</li>
      <li><strong>不是所有场景都省钱。</strong>如果每个物体的几何各不相同，或实例数量很少，实例化带来的收益并不明显，有时还不如干脆把几何合并成一个大网格。</li>
    </ul>

    <h2>实例数据打包</h2>
    <p>
      先把逐实例数据打包好。把每个实例的「位置（3 个 float）+ 旋转（1 个 float）」按固定步长排进一块缓冲（本课每个实例一行 64 字节），一次加载进 <code>instVBO</code>。
    </p>
    <p>
      然后用 divisor 把属性分成两套。顶点属性 <code>a_position</code> / <code>a_color</code> 保持 <code>divisor = 0</code>，每画一个顶点前进一步；实例属性 <code>a_instance_pos</code> / <code>a_instance_rot</code> 设成 <code>divisor = 1</code>，每画完一个完整实例才前进一步。两类属性绑在同一份几何上，GPU 会自动为每个实例配上对应的那一行数据。
    </p>
    <p>
      接着换成一次绘制：<code>ext.drawElementsInstancedANGLE(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0, count)</code>，最后一个参数就是从 1 涨到 N 的实例数。draw call 数直接从 N 变成 1。
    </p>
    <p>
      顶点着色器里取该实例的差异：用 <code>a_instance_pos</code> 得到它的世界位置、用 <code>a_instance_rot</code> 得到它的转角，先把顶点绕 Y 轴旋转，再平移到该位置即可。（WebGL2 下还可以用内建的 <code>gl_InstanceID</code> 直接拿到实例序号，省去额外的实例属性。）
    </p>
    <p>
      最后做对照。关掉实例化、用同一个循环逐个 draw，盯着 draw call 计数——它会从 1 涨到实例数，帧率也跟着掉下来。整个差别就落在「一次提交」和「提交 N 次」这一处上。
    </p>
    <div class="lesson-box warn">
      <strong>四条边界：</strong><code>divisor = 1</code> 表示「每实例推进一次」、<code>divisor = 0</code> 表示逐顶点，两者由此把属性分成逐顶点与逐实例两类；WebGL1 必须走 <code>ANGLE_instanced_arrays</code> 扩展（API 带 <code>ANGLE</code> 后缀），WebGL2 才有同名原生 API，记得做扩展检测与回退；实例属性会占用 attribute 槽位，受 <code>GL_MAX_VERTEX_ATTRIBS</code> 约束；实例化适合草地、雨滴、粒子、网格阵列这类「大量相同几何」，几何各异时要另想办法（合批或图集）。
    </div>

    <h2>绘制次数的骤降</h2>
    <figure class="lesson-figure">
      <figcaption>拖动「实例数量」滑块看到数百个立方体，切换「实例化渲染 / 逐个绘制」，盯着画面右下角的 Draw Call 计数与 FPS——实例化时它恒为 1，逐个绘制时它等于实例数。</figcaption>
      <W18Instancing />
    </figure>

    <h2>一次提交多实例</h2>
    <p>
      实例化渲染把「N 个相同几何、N 次提交」变成「N 个相同几何、一次提交」。做法是把逐实例的差异做成顶点属性，再用属性除数把它标成「每实例推进一次」；一次 draw call 里，GPU 就替你把这份几何复制了 N 遍，只是每遍换了一行实例数据。
    </p>
    <div class="lesson-term">
      <span class="term-name">「属性除数（Vertex Attribute Divisor）」</span>是实例化渲染中用来区分逐顶点属性与逐实例属性的机制：<code>divisor = 0</code> 表示该属性每处理一个顶点前进一次（逐顶点），<code>divisor = 1</code> 表示每画完一个实例才前进一次（逐实例）。正是它让「一份几何、N 组实例数据」的绘制成为可能，从而把 N 次 draw call 压成一次。边界与例外：WebGL1 需 <code>ANGLE_instanced_arrays</code> 扩展且 API 带 <code>ANGLE</code> 后缀，WebGL2 为原生；实例属性占用 attribute 槽位，受 <code>GL_MAX_VERTEX_ATTRIBS</code> 限制；几何各异的物体不适用，需改用合批或图集。
    </div>
  </LessonArticle>
</template>
