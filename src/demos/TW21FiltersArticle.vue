<script setup lang="ts">
import TW21Filters from './TW21Filters.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程封面想做成「未解锁就变灰、悬停时盖一层毛玻璃标题栏」，我以为得让设计师再出两套图，可用户上传的封面根本没法定制——这类效果真的只能靠图片资源吗？
    </div>

    <h2>封面滤镜需求</h2>
    <p>
      你在做课程列表：封面图来自后台上传，谁也不知道会是哪张。产品给了三条视觉要求——<strong>未解锁的课程，封面整体降饱和变灰</strong>；<strong>每张卡底部压一条半透明的毛玻璃标题栏</strong>，让白字在任意封面上都读得清；<strong>鼠标悬停时封面稍微提亮、加饱和</strong>，让人有「可点」的感觉。
    </p>
    <p>
      这三条需求看似都是「对图片做处理」，其实底层机理完全不同：变灰是<strong>对元素本身</strong>应用滤镜；毛玻璃是<strong>对元素背后的内容</strong>做模糊；而叠加出层次感还可能用到<strong>混合模式</strong>。分不清这三者，就会以为是缺图片、缺素材。
    </p>

    <h2>换图与遮罩方案</h2>
    <p>
      最朴素的做法是改颜色：给灰掉的封面加一层半透明灰色遮罩，再让设计师针对「灰版」单独出一套图。悬停提亮就换一张调过色的图，毛玻璃就先截图做成 PNG 贴上去。
    </p>
    <p>
      它做对的是<strong>表达了「同一张图在不同状态下要有不同观感」这个意图</strong>，在素材固定、数量很少的静态页面上也确实能跑通。但它把「视觉处理」外包给了设计资源，一旦图片来源变成用户上传，或者状态从两种变成四五种，这条路立刻走不通。
    </p>

    <h2>状态增多资源翻倍</h2>
    <ul>
      <li>每个状态都要一份图片资源，状态一多资源成倍增长，维护成本失控。</li>
      <li>用户上传的图片无法逐张再加工，遮罩方案又会把原始细节一起压暗。</li>
      <li>毛玻璃是「把背景模糊掉」，普通的半透明遮罩只能变淡，透不出那种磨砂质感。</li>
      <li>图层之间的叠色关系（比如暖色叠出秋日滤镜）用纯色遮罩表达不准确。</li>
      <li>悬停提亮若换图，还会多一次资源加载，反而更卡。</li>
    </ul>

    <h2>自身与背后滤镜</h2>
    <p>
      先把「作用于元素自身」的滤镜用起来：<code>blur</code> 模糊、<code>brightness</code> 提亮压暗、<code>contrast</code> 对比度、<code>saturate</code> 饱和度、<code>grayscale</code> 灰度、<code>sepia</code> 复古、<code>invert</code> 反色。<strong>多个滤镜写在同一个元素的多个类上会合并成一条 <code>filter</code> 声明</strong>，所以「悬停时提亮又加饱和」直接写 <code>hover:brightness-110 hover:saturate-125</code> 就行，互不打架。
    </p>
    <p>
      再处理毛玻璃，它靠的是 <code>backdrop-filter</code> 这一族 <code>backdrop-*</code> 工具类：<code>backdrop-blur-md</code> 把元素<strong>背后</strong>的内容模糊掉。要记住一个必要条件——<strong>光有模糊是看不出来的，必须配上半透明背景色或边框</strong>，比如 <code>bg-white/30 border border-white/40</code>，磨砂层才有厚度感。它和 <code>filter</code> 的区别正在于作用对象：一个是模糊「自己」，一个是模糊「自己背后」。
    </p>
    <div class="lesson-box warn">
      <strong>注意浏览器支持：</strong><code>backdrop-filter</code> 并非所有环境都支持，降级时背景会直接露出来。稳妥的做法是给这一层再配一个纯色或半透明兜底背景，保证即使在最差情况下文字依然可读。
    </div>
    <p>
      图层叠色则交给混合模式 <code>mix-blend-*</code>：<code>mix-blend-multiply</code> 让上层和下层做正片叠底，暖色压在图片上就像加了一层统一色调的滤镜；<code>mix-blend-screen</code> 适合做光晕，<code>mix-blend-overlay</code> 适合加质感。它描述的是「这一层和它下面那层如何合成」，与滤镜、背景滤镜各管一段。
    </p>
    <p>
      最后是取值的边界。默认档位不够用时，用任意值表达：<code>blur-[8px]</code>、<code>brightness-[1.2]</code>，方括号里写的就是真实 CSS 值，不必为了一个特殊数值去改配置。
    </p>
    <ol class="lesson-steps">
      <li>对元素本体用 <code>blur-*</code> / <code>brightness-*</code> 等滤镜工具类，可并发叠加多个效果。</li>
      <li>对元素背后内容用 <code>backdrop-blur-*</code>，配半透明背景色实现毛玻璃质感。</li>
      <li>文字或图层叠放用 <code>mix-blend-*</code> 控制与背景的混合关系。</li>
      <li>在元素面板核对 <code>filter</code> 与 <code>backdrop-filter</code> 的合成结果是否符合预期。</li>
    </ol>

    <h2>同图的多重质感</h2>
    <figure class="lesson-figure">
      <figcaption>切换「滤镜」「混合」「背景滤镜」三个页签，拖动参数看同一张图能变出多少种质感。</figcaption>
      <TW21Filters />
    </figure>

    <h2>特效不换素材</h2>
    <p>
      图片特效不必依赖额外素材：作用于元素自身的用 <code>filter</code>（多个类合并成一条声明），作用在元素背后的用 <code>backdrop-filter</code>（记得配半透明背景才看得见），图层之间叠色用 <code>mix-blend-*</code>。默认档位不够就上任意值，同时别忘了给 <code>backdrop</code> 留一个降级兜底。
    </p>
    <div class="lesson-term">
      <span class="term-name">「filter 与 backdrop-filter」</span><code>filter</code> 作用于元素<strong>自身</strong>的渲染结果，工具类是 <code>blur-*</code>、<code>brightness-*</code>、<code>grayscale</code> 等；<code>backdrop-filter</code> 作用于元素<strong>背后</strong>的内容，工具类是 <code>backdrop-blur-*</code>、<code>backdrop-brightness-*</code> 等，必须配合半透明背景或边框才能看到毛玻璃效果。二者的合成结果不叠加混淆，可以同时使用。
    </div>
  </LessonArticle>
</template>
