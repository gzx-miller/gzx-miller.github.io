<script setup lang="ts">
import VF06CustomNodes from './VF06CustomNodes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想让流程图上每个节点直接显示课程名、讲师、课时和「基础／进阶」徽标，可默认节点只有一行文字——难道要把这些信息拼成一长串塞进那行标签里？
    </div>

    <h2>提出问题</h2>
    <p>
      默认节点的长相很朴素：它就是 <code>node.data.label</code> 里那行文本，撑起一个方块。现在业务要的是一张课程卡片——标题、讲师、课时、阶段徽标各有各的位置和样式。如果不动渲染，只往数据里堆字符串，得到的永远只是「一行字」。
    </p>
    <p>
      这不是排版好不好看的问题，而是<strong>默认节点的表达能力有硬上限</strong>：它压根没打算承载结构化的业务信息。继续凑合，凡是带卡片、带徽标、带状态的需求，一个都做不了。
    </p>

    <h2>最小方案</h2>
    <p>
      最朴素的做法，是把信息拼成一串文本塞进 label：<code>组合式 API · 小松鼠 · 12 节 · 基础</code>。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它证明 node.data 可以携带任意业务信息</strong>，数据层根本不用改——title、teacher、lessons、stage 这些字段照存不误。问题只出在显示层完全没跟上。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>一行纯文本没有排版，讲师、课时、阶段挤在一起，扫读成本很高。</li>
      <li>「基础／进阶」本该用不同颜色的徽标区分，字符串做不到。</li>
      <li>选中态只能沿用默认方框，和业务想要的描边高亮对不上。</li>
      <li>想再放图标、进度条、按钮这类结构时，字符串方案彻底到顶。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「信息放在 data 里」，而是把<strong>数据与外观彻底分开</strong>：数据照旧进 <code>node.data</code>，外观则交给一个属于我们自己的模板。
    </p>
    <p>
      第一步，给节点 <code>type</code> 起一个自定义名，比如 <code>course</code>。第二步，在 <code>VueFlow</code> 里写一个同名插槽 <code>#node-course</code>——只要类型名对得上，Vue Flow 就把这一类节点的渲染权整个交给你。插槽参数会带出一组上下文：<code>id</code>、<code>data</code>、<code>selected</code>、<code>dragging</code> 等，够用了。
    </p>
    <ul>
      <li><code>data</code> 就是节点上的业务对象，用类型化结构建模，例如 <code>{ title, teacher, lessons, stage }</code>，模板里按字段排版卡片。</li>
      <li><code>selected</code> 是当前选中态，直接绑到卡片的 class 上，就能画出业务自己的描边与高光。</li>
      <li><code>dragging</code> 是拖拽进行态，可以据此加投影或降低透明度，拖动手感更明确。</li>
    </ul>
    <p>
      第三步，把交互接上。给画布加 <code>@node-click</code>，一点卡片就把它记成当前选中项，右侧详情栏随之刷新——这就是「点击画布节点 → 联动外部面板」的最小闭环。
    </p>
    <p>
      第四步，卡片内部照常放连接点。左缘放 <code>&lt;Handle&gt;</code> 声明 <code>target</code>，右缘声明 <code>source</code>。<strong>自定义节点和内置节点的连接行为完全一致</strong>，连线的读取与新建都照常工作，只是外壳换成了你画的那张卡片。
    </p>
    <div class="lesson-box warn">
      <strong>四个必须记住的细节：</strong>
      <ul>
        <li>没放 Handle 的卡片连不上任何线——连线的出入口只认声明过的桩位。</li>
        <li>Handle 要摆在卡片外缘并留足命中尺寸，别被文字盖住，否则拖线时老是抓不到。</li>
        <li><code>data</code> 尽量用可序列化的普通对象，方便保存、持久化与快照回放。</li>
        <li>不要在自定义节点里再嵌一整张 VueFlow 画布；真要嵌套得单独实例并显式给定尺寸，属于高级用法。</li>
      </ul>
    </div>
    <p>
      最后一个容易被忽略的是尺寸规划：卡片宽度、层间距要预先定好（本课约 180 宽的卡片、明显大于卡片高度的层距），否则连线会在卡片之间斜穿，观感很乱。把尺寸当成布局契约的一部分，图才耐看。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点任意课程卡片，看选中描边与右侧详情栏如何联动。</figcaption>
      <VF06CustomNodes />
    </figure>

    <h2>总结</h2>
    <p>
      自定义节点的要害，是把「数据」和「长什么样」拆开：业务字段留在 <code>node.data</code>，外观交给同名插槽 <code>#node-类型名</code>，选中与拖拽态从插槽参数里读。再在卡片边缘声明 Handle，连接行为与内置节点无缝衔接——一行文字的节点，就此长成了能承载业务的卡片。
    </p>
    <div class="lesson-term">
      <span class="term-name">「自定义节点」</span>指给节点 <code>type</code> 起自定义名（如 <code>course</code>），并用同名插槽 <code>#node-course</code> 接管渲染。插槽参数提供 <code>id</code> / <code>data</code> / <code>selected</code> / <code>dragging</code>：业务信息放进 <code>data</code>，选中态绑 class，连接点由卡片内的 <code>&lt;Handle&gt;</code> 声明——没有 Handle 就出不了线。
    </div>
  </LessonArticle>
</template>
