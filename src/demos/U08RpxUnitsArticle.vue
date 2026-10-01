<script setup lang="ts">
import U08RpxUnits from './U08RpxUnits.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你照着一份宽 750 的设计稿，把标注原样写成 <code>px</code>：卡片宽 <code>690px</code>、圆角 <code>24px</code>、边距 <code>30px</code>。在 375 宽的模拟器里看着刚好，换到 414 宽的手机，卡片两侧各溢出一截被裁掉；再看平板，留白又宽得离谱。
    </div>

    <h2>提出问题</h2>
    <p>
      你想要的很朴素：同一套尺寸，在不同屏幕上「看起来一样」。最直接的做法是写死 <code>px</code>。可这样做，三份成本全落到你身上。
    </p>
    <p>
      第一，<strong>每个屏宽都得单独写一套值或媒体查询</strong>，设备型号一多就失控。第二，设计稿是 750 基准、设备是 375 或 414，标注和代码之间永远差一个 0.5 倍的比例，每次都要心算。第三，圆角、边距这些不能简单按比例乘的值，一缩放就走样。
    </p>
    <p>
      于是问题有了形状：<strong>有没有一个单位，能让「屏幕宽度 = 750」，从而让标注直接照抄、尺寸自动等比缩放？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的替代是用百分比：宽度写 <code>100%</code>，相对父容器算，天然随屏幕变化。
    </p>
    <p>
      这个方案做对了一件事：<strong>占比类尺寸确实不再写死</strong>，一个顶栏设成 <code>width: 100%</code>，在哪种屏幕上都能铺满。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>高度、字号、圆角、边框没法用百分比——百分比相对父容器算，圆角写成 <code>50%</code> 会变成随元素大小变化的椭圆，而不是固定的圆。</li>
      <li>百分比只跟父容器挂钩，跟「屏幕宽」没有直接关系，嵌套层级一变，比例就错。</li>
      <li>1px 细边框用百分比直接归零，线直接消失。</li>
      <li>想在 JS 里按屏幕宽算出一个像素值时，还得自己监听屏幕尺寸变化，绕远路。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      真正的答案是一个专门的单位：<code>rpx</code>。它规定<strong>任意设备上，屏幕宽度恒等于 750rpx</strong>。换句话说，<span class="lesson-kv">1rpx = 屏幕宽度 ÷ 750</span>。
    </p>
    <p>
      于是 750 宽的设计稿上，标注写 <code>690</code>，代码里就写 <code>690rpx</code>，一一对应，不用心算。屏幕变宽，1rpx 跟着变大，所有用 <code>rpx</code> 的尺寸同步放大，比例保持不变——这就是「等比缩放」。
    </p>
    <ol class="lesson-steps">
      <li>设备宽 375px 时，<code>1rpx = 375 ÷ 750 = 0.5px</code>，<code>690rpx</code> 实际渲染为 <code>345px</code>。</li>
      <li>设备宽 414px 时，<code>1rpx = 414 ÷ 750 ≈ 0.552px</code>，同一个 <code>690rpx</code> 自动放大到约 <code>380.9px</code>。</li>
    </ol>
    <p>
      不同端是怎么落地的也值得记一句：<strong>小程序与 App 端</strong>由框架在运行时按屏幕宽度解析 <code>rpx</code>；<strong>H5 端</strong>由编译器在编译期把 <code>rpx</code> 换算成 <code>rem</code>／<code>vw</code> 这类响应式单位。机制不同，效果一致——最终都随屏幕变化。
    </p>
    <p>
      那什么时候不该用 <code>rpx</code>？<strong>需要固定物理尺寸时用 <code>px</code></strong>。最典型的是 1px 细边框：用 <code>rpx</code> 缩放后可能变成 0.5px 这样的小数，在高分屏上会发虚。布局与占位仍然交给 <code>flex</code> 和百分比，<code>rpx</code> 主要负责的，是「绝对尺寸也能等比」。
    </p>
    <div class="lesson-box warn">
      <strong>混用风险：</strong>把 <code>px</code> 和 <code>rpx</code> 混在同一个元素上时，只有 <code>rpx</code> 那一半在缩放，视觉比例会被拉歪；字号若一律用 <code>rpx</code>，在超大屏上会大到失衡，通常要给字号设上限或直接用 <code>px</code>。需要在 JS 里拿到像素值写进样式时，用 <code>uni.upx2px(n)</code> 把 <code>rpx</code> 换算成当前设备的 <code>px</code>。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>拖动「模拟设备宽度」滑块，看三条不同 <code>rpx</code> 宽的色条如何随屏幕宽度整体等比缩放、相对比例始终不变。</figcaption>
      <U08RpxUnits />
    </figure>

    <h2>总结</h2>
    <p>
      <code>rpx</code> 把「屏幕宽度」固定切成 750 份，设计稿标注就能原样落地，尺寸随设备等比缩放。它解决的是绝对尺寸的适配，<code>px</code> 留给固定物理尺寸，<code>flex</code> 与百分比负责布局——三者各管一段，混用之前先想清楚谁在缩放。
    </p>
    <div class="lesson-term">
      <span class="term-name">「rpx」</span>uni-app 的响应式长度单位，规定任意设备上屏幕宽度恒等于 750rpx，因此 1rpx 等于屏宽除以 750，尺寸随设备宽度等比缩放；设计稿宽 750 时标注值与代码值一一对应。边界：需要固定物理尺寸（如 1px 细边框）时用 <code>px</code>；H5 端由编译器把 rpx 转成 rem／vw，App 与小程序端由运行时解析；动态换算用 <code>uni.upx2px()</code>。
    </div>
  </LessonArticle>
</template>
