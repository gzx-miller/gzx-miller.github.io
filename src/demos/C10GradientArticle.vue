<script setup lang="ts">
import C10Gradient from './C10Gradient.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>卡片背景只是一层橙色渐变，可设计师每调一次色值，我就得重新导出一张图、替换资源、再压一遍体积——明明只是两个颜色之间的一段过渡。
    </div>

    <h2>渐变背景切图</h2>
    <p>
      你在给课程卡片做一层从暖橙到明黄的背景。设计稿里它是平滑过渡的颜色，你顺手把它导出成 PNG 用 <code>background-image</code> 引了进来。第一次没问题，但配色方案一改，你就得回到设计工具重出图；要做深色模式，又得再备一套；窗口一大，图片还得面对缩放带来的模糊与体积。
    </p>
    <p>
      代价在于：<strong>把一个"算得出来的东西"固化成了"必须切图才有的资源"</strong>。颜色、角度、过渡方向，全都是可以用参数描述的规律，可一旦变成位图，就失去了随主题、随尺寸、随变量变化的能力。渐变色本身，其实是一种用规则生成图像的机制。
    </p>

    <h2>导出图片方案</h2>
    <p>
      最朴素的做法：继续用导出的渐变图片，写进 <code>background</code> 里。
    </p>
    <p>
      这个方案做对了一件事：<strong>它能精确还原任意设计稿效果</strong>。不管过渡多复杂、叠加多少光泽，导出的图片都能一五一十地呈现，控制力是最强的。
    </p>

    <h2>资源重导代价</h2>
    <ul>
      <li>改一个色值就要重新导出、重新压缩、重新替换，一条龙的重活只为两个颜色。</li>
      <li>要为不同倍率屏幕准备多套图，高清设备下体积和清晰度难以两全。</li>
      <li>元素尺寸变化时位图会被拉伸，过渡带糊掉或出现色阶。</li>
      <li>它无法参与主题变量，深色模式只能再备一张图。</li>
    </ul>

    <h2>规则生成图像</h2>
    <p>
      不推翻「用图片做背景」，而是换一种图片来源：渐变色属于 CSS 的 <code>&lt;image&gt;</code> 类型——它是一张<strong>由规则算出来的图</strong>，可以直接写进 <code>background</code>，无需任何文件。
    </p>
    <p>
      <strong>线性渐变</strong> <code>linear-gradient</code> 沿一条直线方向过渡：<code>linear-gradient(135deg, #e8590c, #d9480f)</code>，第一个参数是角度或方向关键字。注意 <code>0deg</code> 是<strong>垂直向上</strong>，并随角度顺时针旋转，所以 <code>90deg</code> 指向右；也可以用 <code>to right</code>、<code>to bottom</code> 这类关键字表达方向。
    </p>
    <p>
      <strong>径向渐变</strong> <code>radial-gradient</code> 从中心沿半径向外辐射：<code>radial-gradient(circle at center, #fff4e6, #e8590c)</code>，形状取 <code>circle</code> 或 <code>ellipse</code>，<code>at</code> 后面指明中心位置。<strong>锥形渐变</strong> <code>conic-gradient</code> 则绕中心沿角度扫过：<code>conic-gradient(from 0deg, #e8590c, #ffd43b, #e8590c)</code>，<code>from</code> 指定起始角度。
    </p>
    <p>三者适用的场景差别很大，对照着记最清楚。</p>
    <table>
      <thead>
        <tr><th>函数</th><th>过渡规律</th><th>适用场景</th></tr>
      </thead>
      <tbody>
        <tr><td><code>linear-gradient</code></td><td>沿直线方向过渡</td><td>按钮、卡片底色、遮罩</td></tr>
        <tr><td><code>radial-gradient</code></td><td>从中心向外辐射</td><td>光晕、聚光灯、圆形氛围</td></tr>
        <tr><td><code>conic-gradient</code></td><td>绕中心沿角度扫过</td><td>色轮、进度环、仪表盘</td></tr>
      </tbody>
    </table>
    <p>
      再往深一层，色标还可以带位置：<code>linear-gradient(to right, #e8590c 0%, #ff922b 50%, #ffd43b 100%)</code> 精确控制每段颜色落在哪。当<strong>相邻两个色标位置相同时</strong>，中间就没有过渡空间，会形成一条硬边——利用这点可以做出条纹色块。多个渐变用逗号叠加就成多重背景，<strong>先写的位于上层</strong>，例如 <code>linear-gradient(135deg, rgba(232,89,12,0.8), transparent), radial-gradient(circle at top right, #ffd43b, transparent)</code>；再配上 <code>background-size</code>，甚至能用渐变拼出重复图案。
    </p>
    <p>
      落到实际界面里，渐变的用法很集中：卡片和按钮用一层线性渐变做底色，图片上盖一层 <code>linear-gradient(180deg, transparent, rgba(0,0,0,0.6))</code> 做文字遮罩，色轮与进度环交给锥形渐变，光晕和聚光效果则用径向渐变。这些都统一走 <code>background</code> 简写，颜色、图片、重复、位置、尺寸一条声明写完：<code>background: #fff url('bg.png') no-repeat center / cover</code>；渐变也能像图片一样写进这个简写里，与背景图自由组合。
    </p>
    <div class="lesson-box warn">
      <strong>别把渐变当动画：</strong>渐变的动画与重绘开销很大，大面积渐变在动效里尤其吃力。需要动起来的大面积背景，优先考虑静态图或用合成层友好的属性替代，而不是让浏览器每帧重算整张渐变的每个像素。
    </div>

    <h2>三种渐变对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换线性、径向、锥形渐变，再拖动角度滑块，观察同一组色标在不同规律下的形态。</figcaption>
      <C10Gradient />
    </figure>

    <h2>背景规则与色标</h2>
    <p>
      渐变把「背景图」从需要切图的资源，变回了一条可描述的规则：线性沿方向、径向向外辐射、锥形绕圈扫过，色标控制颜色落点，逗号叠加出多重背景。改色只是改一个值，还能随主题与尺寸自由变化——为一层渐变单独切图的时代可以结束了。挑函数时先问它沿哪条路径过渡，方向对了，剩下的只是继续调色标。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CSS 渐变」</span>渐变色属于 CSS 的 <code>&lt;image&gt;</code> 类型，是可由规则生成的图像：<code>linear-gradient</code> 沿方向过渡（<code>0deg</code> 向上、顺时针旋转），<code>radial-gradient</code> 从中心向外辐射，<code>conic-gradient</code> 绕中心沿角度扫过。色标可带位置，相邻色标位置相同即形成硬边；多个渐变用逗号叠加时先写的在上层。
    </div>
  </LessonArticle>
</template>
