<script setup lang="ts">
import C14ClipPath from './C14ClipPath.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>想把产品封面裁成六边形，可 <code>border-radius</code> 只能做圆角；想让它底部自然渐隐融入背景，圆角更是彻底没辙——<strong>把元素切成任意形状，到底该用哪个属性？</strong>
    </div>

    <h2>多种形状的裁剪需求</h2>
    <p>
      你在做一个展示页：卡片封面要做成斜切的六边形，标签要做成三角形小尖角，图片底部还要从实到透明地渐隐下去。三件事看起来都在「改形状」，可你越写越发现，它们其实在问两个不同的问题——<strong>一是「哪些像素可见」，二是「可见的像素有多不透明」</strong>。
    </p>
    <p>
      不掌握这两者的分工，你会陷入「用边框拼三角形、用定位盖住多余部分」的老套路：代码难懂、内容装不进去、换个尺寸就崩。更糟的是，你以为裁掉的部分就真的不存在了，可它只是「看不见」而已。
    </p>

    <h2>边框圆角的方案</h2>
    <p>
      最朴素的做法：圆角和圆形交给 <code>border-radius</code>。头像写 <code>border-radius: 50%</code> 就是正圆，卡片写 <code>border-radius: 12px</code> 就是圆角。配合 <code>overflow: hidden</code>，连里面的内容也会被裁到圆角以内。
    </p>
    <p>
      这个方案做对了一件重要的事：<strong>裁剪不改变布局尺寸</strong>。元素在文档流里占的位置分毫未动，只是四角被削圆了。这个「保留布局、只改可见」的思路，正是后面一切裁剪的基础。
    </p>

    <h2>圆角与硬边的局限</h2>
    <ul>
      <li>它只会圆角，做不出三角形、六边形、斜切边这类直边或折线形状。</li>
      <li>它只能给出「硬边」——边缘要么完全可见，要么完全不可见，实现不了从实到透明的渐隐。</li>
      <li>想用「透明边框拼三角形」的老技巧画尖角，得到的是一块空色块，塞不进图片或文字。</li>
      <li>面对「按一张图的透明度决定可见性」这种诉求，它连门都摸不到。</li>
    </ul>

    <h2>任意几何的裁剪</h2>
    <p>
      不推翻「保留布局、只改可见」，而是把裁剪形状从「圆角一种」扩展成<strong>任意几何图形</strong>。这就是 <code>clip-path</code>：给它一个形状，它就按这个形状把元素的可渲染区域裁出来。常用的形状各有各的写法：
    </p>
    <ul>
      <li><code>circle(50% at center)</code>：半径 50%、圆心居中的圆。</li>
      <li><code>ellipse(50% 40% at 50% 50%)</code>：水平半径 50%、垂直半径 40% 的椭圆。</li>
      <li><code>polygon(50% 0%, 0% 100%, 100% 100%)</code>：按顶点坐标列表围出的多边形，三个顶点就是三角形。</li>
      <li><code>inset(10px round 8px)</code>：向内缩进 10px 再带 8px 圆角，正好覆盖圆角矩形场景。</li>
    </ul>
    <p>
      六边形只需要把六个顶点按顺序列出来，例如 <code>polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)</code>。这里藏着一个必须先想清楚的性质：<strong>顶点坐标基于元素自身的百分比</strong>，所以元素放大缩小时，形状会跟着等比例缩放，而不是固定在某个像素位置。
    </p>
    <div class="lesson-box warn">
      <strong>两个必须记住的坑：</strong>其一，<code>clip-path</code> 会<strong>创建新的层叠上下文</strong>，它内部元素的 <code>z-index</code> 从此被隔离在这一层里比较；其二，被裁掉的区域虽然不可见，却<strong>无法接收点击事件</strong>——如果你把一个按钮裁小，露在外面的那部分才是真正可点的热区。
    </div>
    <p>
      顺带一个收益：<code>clip-path</code> 可以参与 <code>transition</code> 做形状动效，比如悬停时圆从 10% 扩到 50%。但形状补间有个前提——<strong>两个形状的顶点数量与顺序必须一致</strong>，否则浏览器无法一一对应，动画会直接跳变。
    </p>
    <p>
      现在回到「按透明度渐隐」这个需求。<code>clip-path</code> 只回答「可见或不可见」，答不了「半透明」，所以需要另一位主角：<code>mask</code>。它不读几何图形，而是读一张图像或一段渐变的<strong>透明通道</strong>——越不透明的地方越可见，越透明的地方越隐去。用 <code>mask: linear-gradient(to bottom, black 0%, transparent 100%)</code>，就能让元素顶部实、底部渐隐；换成 <code>radial-gradient</code>，则是中心实、边缘渐隐。
    </p>
    <p>
      <code>mask</code> 现在已获主流浏览器无前缀支持，<code>-webkit-mask</code> 只作为旧版 Safari 的兼容写法保留。把四个常被混用的属性并排一看，分工就清楚了：
    </p>
    <table>
      <thead>
        <tr><th>属性</th><th>裁剪依据</th><th>能否半透明</th><th>是否保留布局空间</th></tr>
      </thead>
      <tbody>
        <tr><td><code>border-radius</code></td><td>圆角几何</td><td>否</td><td>是</td></tr>
        <tr><td><code>overflow: hidden</code></td><td>内容盒边界</td><td>否</td><td>是（滚动/溢出被截断）</td></tr>
        <tr><td><code>clip-path</code></td><td>任意几何形状</td><td>否（硬边）</td><td>是</td></tr>
        <tr><td><code>mask</code></td><td>图像的透明通道</td><td>是（可渐隐）</td><td>是</td></tr>
      </tbody>
    </table>
    <p>
      一句话收束：<strong>要几何外形，用 <code>clip-path</code>；要透明度渐隐，用 <code>mask</code></strong>。两者都保留布局空间，所以放心：无论怎么裁，元素在页面里占的位置都不会变。
    </p>

    <h2>形状与渐隐的对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换圆形、椭圆、三角形、内嵌矩形与路径，再看 mask 如何按透明度渐隐，并试着点一点被裁掉的区域。</figcaption>
      <C14ClipPath />
    </figure>

    <h2>外形与渐隐分工</h2>
    <p>
      裁剪的本质是「保留布局、只改可见」。<code>clip-path</code> 用 <code>circle</code> / <code>ellipse</code> / <code>polygon</code> / <code>inset</code> 把元素切成任意几何形状，代价是会新建层叠上下文、且被裁区域不可交互；<code>mask</code> 则按透明度通道做渐隐。坐标基于百分比，形状会随尺寸缩放。
    </p>
    <div class="lesson-term">
      <span class="term-name">「裁剪路径」</span>指用 <code>clip-path</code> 以 <code>circle</code> / <code>ellipse</code> / <code>polygon</code> / <code>inset</code> / <code>path</code> 等几何形状，把元素的可渲染区域裁成非矩形：它<strong>保留布局空间</strong>，只裁剪可见与可交互的部分，被裁区域之外的点击不可达，同时会创建新的层叠上下文。与它互补的 <code>mask</code> 依据图片或渐变的 <strong>alpha 通道</strong>决定可见性，从而按透明度渐隐；两者都能配合 <code>transition</code> 做动效。
    </div>
  </LessonArticle>
</template>
