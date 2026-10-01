<script setup lang="ts">
import F04Resolution from './F04Resolution.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个 1080×1920 的竖屏视频缩到 720 高，按「自动算另一维」的写法写了 <code>scale=-1:720</code>，FFmpeg 却报错说宽度不能被 2 整除；把 <code>-1</code> 改成 <code>-2</code> 立刻就过了。同样表示「自动」，这两个数字差在哪？
    </div>

    <h2>宽高比与奇偶约束</h2>
    <p>
      不同设备要不同分辨率，缩放的诉求本身很直接。但「目标尺寸」从来不是一个孤立数字，它牵动两件事：一是保持原始的<strong>宽高比</strong>，否则画面会被拉伸变形；二是满足编码器对尺寸的<strong>奇偶约束</strong>，否则直接报错。
    </p>
    <p>
      手工对付这两件事的成本很容易被低估：源是 1920×1080，要缩到高 720，你得自己算出宽是 720 × 1920 ÷ 1080 = 1280，还得确认它是偶数；换一个源、宽高比变了，整套数字又得重算。更常见的是把一组写死的宽高套到所有源上，遇到宽高比不同的素材就必然变形。所以真正的问题是：<strong>怎么在不手算、不变形的前提下，把视频缩到想要的分辨率？</strong>
    </p>

    <h2>双维尺寸直写</h2>
    <p>
      最直接的写法是两个尺寸都写死：<code>ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4</code>。这是 <code>scale</code> 滤镜的基础语法 <code>scale=width:height</code>。
    </p>
    <p>
      它做对了一件事：<strong>目标尺寸完全可控</strong>。你要 1280×720，就精确得到 1280×720，没有任何含糊。只要源本身就是 16:9，这条命令既准又省事。
    </p>

    <h2>画面拉伸与失真</h2>
    <ul>
      <li>源不是 16:9 时，它把画面硬生生拉到 1280×720，人脸被压扁、圆形变椭圆。</li>
      <li>只想要「高 720、宽随便」时，宽度还得自己算，换一个源就要重算一次。</li>
      <li>手算出来的某一维可能是 1279 这样的奇数，编码器立刻报 <code>width not divisible by 2</code>。</li>
      <li>想「完整放进 1080×1080 又不裁掉任何内容」时，它只有拉伸这一条路，做不到适配。</li>
    </ul>

    <h2>自动推算另一维</h2>
    <p>
      不推翻它，而是<strong>把其中一维交给 FFmpeg</strong>，让它顺着原宽高比反推。写法是 <code>scale=-1:720</code>——负值表示「按原宽高比自动算这一维」。这样宽度不用手算，也不会变形。
    </p>
    <p>
      但 <code>-1</code> 还会算出一个奇数。根子在<strong>色度二次采样</strong>：像 <code>yuv420p</code> 这类常用像素格式，色度信息是按 2×2 的块存的，所以画面宽高必须为偶数，否则编码器拒绝。把 <code>-1</code> 换成 <code>-2</code>，就是在「自动反推」的基础上再<strong>把结果取整到偶数</strong>，一步解决报错。所以等比缩放推荐一律用 <code>-2</code>。
    </p>
    <p>
      再往下，会遇到「源宽高比和目标区域真的不一样」的场景——比如把竖屏塞进横屏播放区。这时要的是「在目标矩形内保持比例、又不放大」，用 <code>force_original_aspect_ratio=decrease</code> 让画面先缩进矩形里，再用 <code>pad</code> 把剩余部分补成黑边，得到「完整但不填满」的效果：
    </p>
    <p>
      <code>scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2</code>
    </p>
    <p>
      如果反过来想要「填满矩形、允许裁掉一些」，就把 <code>decrease</code> 换成 <code>increase</code>，再配合 <code>crop</code> 裁边。至于放大场景（小分辨率变大），可以顺手把算法从默认换成 <code>flags=lanczos</code>，画质会更好一些。
    </p>
    <div class="lesson-box warn">
      <strong>两条要记住的边界：</strong>上采样（把低分辨率放大）只会让画面更糊，并不能凭空补出细节，应尽量避免；<code>scale</code> 里若写出奇数尺寸会被编码器直接拒绝，宽高都要保持偶数，或用 <code>-2</code> 自动取偶。
    </div>

    <h2>参数联动与预览</h2>
    <figure class="lesson-figure">
      <figcaption>切「基础缩放 / 宽高比处理 / 高级缩放」三个页签，改输入输出数字并勾选「保持宽高比」，看预览命令从 <code>scale=W:H</code> 变成 <code>scale=-2:H</code>。</figcaption>
      <F04Resolution />
    </figure>

    <h2>等比缩放与取偶</h2>
    <p>
      缩放的关键不在「填一个尺寸」，而在「要不要保比例、要不要满足偶数」。只指定一维时用 <code>-2</code> 让 FFmpeg 自动取偶，比例不符时用 <code>force_original_aspect_ratio</code> 加补边或裁切，你就不用再手算，也不会变形或报错。
    </p>
    <div class="lesson-term">
      <span class="term-name">「色度二次采样」</span>指为节省带宽，把颜色（色度）信息以比亮度更低的采样率存储的做法，常见形式有 <code>yuv420p</code>、<code>yuv422p</code>。边界与例外：受它影响，4:2:0 通常要求宽高都为偶数、4:2:2 只要求宽为偶数，这也是等比缩放推荐写 <code>-2</code>（而非 <code>-1</code>）的原因——<code>-2</code> 会把自动反推的结果取整到偶数。若换成不降采样的 <code>yuv444p</code>，这一约束就基本消失。
    </div>
  </LessonArticle>
</template>
