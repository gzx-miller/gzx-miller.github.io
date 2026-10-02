const n=`<script setup lang="ts">
import W20Performance from './W20Performance.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>应用上线后，有用户在老手机上反馈卡顿。你打开代码，第一反应是「模型面数太多」，于是把三角形砍掉一半——帧率几乎没动。你又怀疑着色器太复杂，把它简化成只输出一个纯色——还是卡。折腾了半天，你甚至不知道下一步该改哪里。为什么「看起来最重」的地方，往往不是真正的瓶颈？
    </div>

    <h2>帧时间耗时分布</h2>
    <p>
      因为一帧的时间是被好几个<strong>相互独立</strong>的环节瓜分的，而「卡」只说了结果，没有说在哪一环：
    </p>
    <ul>
      <li><strong>CPU 侧</strong>要把这一帧的绘制指令、状态和数据准备好并提交，<strong>draw call 的数量</strong>直接决定这部分开销；</li>
      <li><strong>GPU 侧</strong>要跑顶点与片段的着色器、采样纹理，<strong>分辨率、着色器复杂度、采样次数</strong>影响这部分；</li>
      <li><strong>显存与带宽</strong>决定纹理和缓冲能被多快地喂进管线。</li>
    </ul>
    <p>
      沿用「凭感觉猜着优化」的老办法，要付的隐性成本很实在：优化错了对象，代码白改还可能引入新 bug；没有基线，改完也不知道是不是真的变好了；更麻烦的是瓶颈会<strong>转移</strong>——把 CPU 这一环压下去，原本藏在外面的 GPU 瓶颈才会露出来。
    </p>
    <p>
      所以问题不是「怎么优化」，而是先要回答：<strong>这一帧到底卡在哪一环，我凭什么这么判断？</strong>
    </p>

    <h2>帧率测量指标</h2>
    <p>
      先把「测量」建起来。用 <code>requestAnimationFrame</code> 驱动渲染循环，在循环里用相邻两帧的时间差算出帧时间与 FPS，同时统计三个关键数字：<strong>draw call 数</strong>、<strong>三角形总数</strong>、<strong>显存占用</strong>（缓冲与纹理的估算）。
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「感觉卡」变成了「哪个指标越界」</strong>。有了这几个数，判断就有了落点——draw call 高通常指向 CPU 瓶颈，三角形和采样量高通常指向 GPU 瓶颈，显存大则可能落进带宽瓶颈。
    </p>

    <h2>单一指标误判</h2>
    <ul>
      <li><strong>单看一个数说明不了问题。</strong>只看到 FPS 是 30，你分不清它是设备本该如此的 30，还是被拖累出来的 30，必须把优化开 / 关两种状态摆在一起对比。</li>
      <li><strong>draw call 的代价与三角形无关。</strong>这正是砍面数没用的原因——draw call 有固定的 CPU 与驱动开销，几十次提交，每次都要走一遍状态校验，不管你让每次画多少三角形。</li>
      <li><strong>显存占用不等于带宽。</strong>显存大只是个信号，真正疼的是每帧有没有反复采样大纹理、有没有用没压缩的格式白占带宽。</li>
      <li><strong>帧时间本身会抖。</strong>单帧耗时受调度影响很大，看一两帧没有意义，得看一段时间内的趋势。</li>
    </ul>

    <h2>绘制调用削减</h2>
    <p>
      先削最大头——draw call。它有两条路，本课都能亲手拨：<strong>实例化</strong>，把重复几何的逐实例差异做成属性，一次 draw 画完 N 个；<strong>合批（batching）</strong>，把多个分散的小网格合并进一个大的 index buffer，一次性画出来。两者都把 N 次提交压成 1 次，也正是本课 draw call 计数变化的来源。
    </p>
    <p>
      再砍显存与带宽。纹理改用压缩格式（WebGL1 的 S3TC、跨平台常用的 ETC2），再配合 <code>Mipmap</code>，能明显降低显存占用和采样带宽。注意压缩格式要看设备支持，先查扩展、备好回退路径。
    </p>
    <p>
      然后堵住「每帧重建」。不要在渲染循环里 <code>createBuffer</code> / <code>createTexture</code> 又随手丢掉——缓冲和纹理应当在初始化时建好、只上传一次，之后一直复用。每帧新建再丢弃，等于每帧都在制造垃圾并拖慢驱动。
    </p>
    <p>
      最后留意几个反直觉的开关。上下文属性 <code>preserveDrawingBuffer</code> 默认就是 <code>false</code>，这反而有利于性能，只有在需要截图这类场景才打开它——而一旦打开，会阻止驱动做优化。VSync 会把帧率压在显示器刷新率上，想测「设备真实上限」时也得先把它考虑进去。
    </p>
    <p>
      做完这些，仍要回到那两张实时柱状图。<strong>FPS 趋势</strong>与 <strong>draw call 趋势</strong>会随你拨动开关实时变化——每改一步，都该在图上看到对应指标往好的方向走，而不是凭感觉宣布「优化了」。
    </p>
    <div class="lesson-box warn">
      <strong>四条最常被忽略的规则：</strong>draw call 有固定的 CPU 与驱动开销，削减数量是移动端 WebGL 最直接有效的优化之一，手段是实例化、合批、图集；绝不要在渲染循环里反复 <code>createBuffer</code> / <code>createTexture</code> 再丢弃，优先预分配、复用、只上传一次；纹理压缩（S3TC / ETC2）要配合 <code>Mipmap</code> 使用，并先检测设备支持；<code>preserveDrawingBuffer</code> 默认 <code>false</code> 反而更利于性能，只有截图等场景才该开启。
    </div>

    <h2>四项指标联动</h2>
    <figure class="lesson-figure">
      <figcaption>拨动「实例化」「CPU 端合批」开关、拖动「渲染对象数」滑块，紧盯 FPS、帧时间、Draw Call、GPU 显存四个实时指标，以及下方 FPS 与 Draw Call 两条趋势柱状图，亲手验证哪一种优化把哪一项指标压了下去。</figcaption>
      <W20Performance />
    </figure>

    <h2>测改循环闭环</h2>
    <p>
      性能优化不是「哪里有代码就改哪里」，而是一个「先测、再改、再测」的闭环。先建立起 FPS、帧时间、draw call、显存这几个指标，确认瓶颈落在 CPU 提交、GPU 渲染还是带宽哪一环；再对症下手——最常见、最直接的一刀就是削减 draw call（实例化或合批），接着管好纹理的显存与带宽，最后拒绝每帧重建缓冲这类隐形浪费。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Draw Call（绘制调用）」</span>是向 GPU 提交一次绘制命令的开销单位，如 <code>drawArrays</code> / <code>drawElements</code>。它有相对固定的 CPU 与驱动开销，且与本次绘制的三角形数量无关——因此把大量相同物体逐个提交时，CPU 会成为瓶颈，而削减 draw call 数量是移动端 WebGL 最有效的优化之一。边界与例外：可通过实例化（一次 draw 画 N 个）、合批（合并几何到一次提交）、图集等方式减少；但它不是唯一瓶颈，还需同时关注 GPU 的着色器与采样成本、显存与带宽；<code>preserveDrawingBuffer</code> 默认为 <code>false</code> 才利于性能，仅在截图等场景开启。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
