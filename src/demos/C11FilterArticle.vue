<script setup lang="ts">
import C11Filter from './C11Filter.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程封面悬停时要变灰，我准备了两张图来回切换；结果产品又要「略微变暗」和「模糊一点」，图片数量眼看就要失控了。
    </div>

    <h2>效果图资源膨胀</h2>
    <p>
      你在给图片做各种视觉效果：悬停时变灰、加载时模糊、强调时提高对比度、封面图上叠一行会与背景"融"在一起的大标题。过去的路子只有两条——要么提前把每种效果导成一张图，要么在元素上盖一层半透明遮罩。
    </p>
    <p>
      两条路都有天花板。重出图意味着<strong>状态一多，资源就成倍膨胀</strong>：彩色、灰度、暗化、模糊，每种组合一张；而遮罩只能压明暗、调色调倾向，它改不了像素本身——你没法用一层盖色实现真正的"灰度"，也做不出围绕图片轮廓的柔和阴影。真正的办法，是让浏览器<strong>在渲染时对像素做运算</strong>。
    </p>

    <h2>半透明遮罩叠加</h2>
    <p>
      最朴素的做法：在图片上叠一层半透明遮罩，或者干脆换一张预先处理好的图。
    </p>
    <p>
      这个方案确实做对了一件事：<strong>它不改变原图，就能叠加一层统一的效果</strong>。遮罩实现简单、可控，做"变暗""加一层色偏"这类明暗与色调调整时，成本极低。
    </p>

    <h2>遮罩逐像素局限</h2>
    <ul>
      <li>遮罩只能变暗变亮、加色偏，做不出灰度、对比度、饱和度、色相旋转这类<strong>逐像素色彩运算</strong>。</li>
      <li>每种状态都要单独出图，图片状态组合一多，资源数量迅速失控。</li>
      <li>想要贴合透明图片轮廓的阴影，<code>box-shadow</code> 只会套上一层矩形。</li>
      <li>文字与背景的融合只能靠透明度接近，做不到真正的像素级混色。</li>
    </ul>

    <h2>逐像素滤镜能力</h2>
    <p>
      <strong>filter（滤镜）</strong>是第一件工具，它对元素整体施加逐像素效果，还能多个叠加：<code>filter: blur(4px)</code> 模糊、<code>grayscale(100%)</code> 灰度、<code>brightness(1.2)</code> 亮度、<code>contrast(1.5)</code> 对比度、<code>saturate(2)</code> 饱和度、<code>hue-rotate(90deg)</code> 色相旋转、<code>invert(100%)</code> 反相、<code>opacity(50%)</code> 透明度。叠加时写在前面、效果更贴近原图：<code>filter: brightness(1.1) contrast(1.1) saturate(1.2)</code>。
    </p>
    <p>
      其中一个特别值得单独记：<code>drop-shadow(2px 4px 6px rgba(0,0,0,0.3))</code>。<strong>它不同于 <code>box-shadow</code>——会沿着元素实际的不透明轮廓投影</strong>，所以能给抠出透明背景的图片加上贴合的阴影，而 <code>box-shadow</code> 只会画一个矩形外框。
    </p>
    <p>
      第二件工具是 <strong>mix-blend-mode（混合模式）</strong>，它决定元素与<strong>下方内容</strong>之间怎么进行像素级色彩混合：<code>multiply</code> 正片叠底、<code>screen</code> 滤色、<code>overlay</code> 叠加、<code>difference</code> 差值。把一行白色文字叠到渐变背景上，<code>mix-blend-mode: difference</code> 能让它在深色处变亮、在浅色处变暗，自然地"融"进背景里。
    </p>
    <p>
      第三件工具是 <strong>backdrop-filter</strong>，它<strong>只对元素后方的区域</strong>做滤镜，常见于毛玻璃：<code>backdrop-filter: blur(10px); background: rgba(255,255,255,0.7);</code>。三者作用对象不同，务必分清。
    </p>
    <p>
      三者还能叠着用。做一张毛玻璃卡片：<code>backdrop-filter: blur(10px)</code> 让背景虚化，<code>background: rgba(255,255,255,0.7)</code> 铺一层半透明白，卡片内再放文字——背景糊了、文字仍然清晰，这正是毛玻璃能既透出内容又不牺牲可读性的原因。反过来，一旦给元素上了 <code>filter</code>，它就成了新的包含块，内部的 <code>fixed</code> 定位会相对它而不是视口定位；调试「定位突然偏移」时，先检查祖先上有没有无意加上的滤镜或变换。
    </p>
    <table>
      <thead>
        <tr><th>属性</th><th>作用对象</th><th>典型用途</th></tr>
      </thead>
      <tbody>
        <tr><td><code>filter</code></td><td>元素自身</td><td>图片模糊、灰度、阴影</td></tr>
        <tr><td><code>mix-blend-mode</code></td><td>元素与下方内容</td><td>文字与背景融合</td></tr>
        <tr><td><code>backdrop-filter</code></td><td>元素后方区域</td><td>毛玻璃卡片</td></tr>
        <tr><td><code>background-blend-mode</code></td><td>多背景图之间</td><td>多层背景的混色</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>两个连带影响：</strong><code>filter</code> 会创建新的<strong>层叠上下文与包含块</strong>，可能影响内部元素的 <code>fixed</code> 定位——定位突然"跑偏"时，记得把祖先上的 <code>transform</code>、<code>filter</code> 纳入排查。另外，<code>mix-blend-mode</code> 要靠下方不透明内容才显得出混色，用的时候要<strong>盯住文字的可读性</strong>，别让它和背景糊在一起。
    </div>

    <h2>滤镜与混合对照</h2>
    <figure class="lesson-figure">
      <figcaption>下拉切换 filter 与 mix-blend-mode，观察图片逐像素变化、文字在渐变上如何融合。</figcaption>
      <C11Filter />
    </figure>

    <h2>三者职责边界</h2>
    <p>
      滤镜与混合模式把视觉效果从"预处理的图片"交还给了渲染过程：<code>filter</code> 改元素自身，<code>mix-blend-mode</code> 与下方内容混色，<code>backdrop-filter</code> 只处理后方的背景。分清三者各自的作用对象，再留意它们会创建层叠上下文，就能安全地用纯 CSS 做出过去必须切图或写脚本的效果。下次再遇到「变灰、模糊、融合」这类需求，先别急着出图或叠遮罩，想想该交给哪一个属性来做。
    </p>
    <div class="lesson-term">
      <span class="term-name">「filter 与混合模式」</span><code>filter</code> 对元素整体施加 blur、grayscale、brightness、contrast、saturate、hue-rotate、invert、opacity、drop-shadow 等效果，可多个叠加；<code>mix-blend-mode</code> 决定元素与下方内容的像素混合；<code>backdrop-filter</code> 只对元素后方区域做滤镜（毛玻璃）。三者作用对象不同，且 <code>filter</code> 会创建新的层叠上下文与包含块，可能影响内部 <code>fixed</code> 定位。
    </div>
  </LessonArticle>
</template>
