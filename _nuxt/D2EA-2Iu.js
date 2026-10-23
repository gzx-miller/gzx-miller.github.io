const o=`<script setup lang="ts">
import F09Pad from './F09Pad.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一段竖屏 1080×1920 的视频要塞进 16:9 的横屏播放器。直接 <code>scale=1920:1080</code>，人被压成了矮胖子；你想只加黑边、不拉伸，于是写下 <code>pad=1920:1080:(ow-iw)/2:(oh-ih)/2</code>，结果命令直接报错，说输出尺寸不能比输入小——黑边一根都没加上。「补边」和「缩放」，到底谁该先谁该后？
    </div>

    <h2>比例不符适配</h2>
    <p>
      播放器、广告位、社交平台对宽高比的要求各不相同：横屏 16:9、竖屏 9:16、方形 1:1。把一段素材放进比例不同的容器，本该有个不损失内容的办法——<strong>不裁剪、不拉伸，只在边上留出空白</strong>，这就是常说的 letterbox（上下留边）与 pillarbox（左右留边）。
    </p>
    <p>
      旧办法是让播放器自己加黑边。它有两个必须由人承担的隐藏成本：<strong>一是不可控</strong>，边补在哪儿、什么颜色，全由播放器决定，文件一旦交给别人、换一个播放器，可能就被拉伸铺满了；<strong>二是不可批处理</strong>，你没法把「补边」这一步固化进流水线，更没法在补边之后再接别的处理。所以真正的问题是：<strong>怎样在不裁剪、不拉伸内容的前提下，把画面放进一个比例不同的容器，并且保证输出尺寸合法、比例显示正确？</strong>
    </p>

    <h2>画布扩容与补边</h2>
    <p>
      最直接的写法是用 <code>pad</code> 滤镜，它不去动原始画面，只是<strong>把画布换大一点</strong>，把原画面摆到新画布的某个位置上：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "pad=1920:1440:(ow-iw)/2:(oh-ih)/2" output.mp4</code>
    </p>
    <p>
      语法是 <code>pad=w:h:x:y:color</code>：<code>w</code> / <code>h</code> 是<strong>输出的新画布尺寸</strong>，<code>x</code> / <code>y</code> 是<strong>原始画面在新画布上的左上角位置</strong>，<code>color</code> 是填充色（默认黑色）。上面这行把 16:9 的 1920×1080 放进 4:3 的 1920×1440 画布，用 <code>(ow-iw)/2 : (oh-ih)/2</code> 让原画面居中，左右各留出黑边。
    </p>
    <p>
      它做对了一件事：<strong>原画面的每一个像素都被原样保留</strong>，只靠扩大画布来改变整体比例，既没裁掉内容、也没把内容拉变形。对「源比目标小」这种情形，这就够了。
    </p>

    <h2>输出尺寸下限</h2>
    <ul>
      <li><code>pad</code> 只会把画布<strong>变大</strong>：输出尺寸不能小于输入尺寸。竖屏 1080×1920 想 <code>pad</code> 成 1920×1080，高度反而变小了，命令直接报错——这正是开场那一幕的根因。</li>
      <li>它<strong>不负责缩放</strong>。源是 1080×1920、目标是 1920×1080 时，真正需要的「先把画面缩小到能放进去的尺寸」这一步，<code>pad</code> 自己做不到，内容是挤在画布一角还是铺满，取决于上游。</li>
      <li>源尺寸是<strong>奇数</strong>时，居中表达式 <code>(ow-iw)/2</code> 会算出半像素，取整后一边比另一边多一像素，补出来的边左右不对称。</li>
      <li>它按<strong>像素个数</strong>布局。碰到非方形像素的素材，画面的实际显示比例和存储比例对不上，光按像素补边会让内容看起来被压扁或拉长。</li>
    </ul>

    <h2>缩放补边串联</h2>
    <p>
      不推翻 <code>pad</code>，而是先补上它前面缺的那一步——<strong>先缩放、再补边</strong>。既然 <code>pad</code> 只能扩大画布，那就用 <code>scale</code> 把内容先缩到画布能容纳的大小，两者在同一条滤镜链里依次执行：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "scale=1920:-2,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4</code>
    </p>
    <p>
      这段的效果等价于 CSS 里的 <code>object-fit: contain</code>：先把画面等比缩进目标区域，剩下的空隙用黑边填满。<strong>注意 <code>scale</code> 必须排在 <code>pad</code> 前面</strong>——反过来就是在一个还没缩小的画面上补边，结果完全不同。整套宽高比转换其实就靠这两个滤镜的先后组合：
    </p>
    <ol class="lesson-steps">
      <li><strong>contain（适配并加黑边）</strong>：<code>scale</code> 等比缩小 → <code>pad</code> 补边居中，用来把任意素材塞进固定画布。</li>
      <li><strong>cover（填满并裁切）</strong>：<code>scale</code> 等比放大到盖住画布 → <code>crop</code> 裁掉溢出部分，用来让画面铺满、宁可裁掉边缘。</li>
      <li><strong>纯补边</strong>：仅当源本来就比目标小时，单独用 <code>pad</code> 即可。</li>
    </ol>
    <p>
      第二步要专门说 <code>scale</code> 里的 <code>-2</code>，它和 <code>pad</code> 的取偶是一回事。当只想指定一维、让另一维按比例自动算时，可以把它写成 <code>-1</code> 或 <code>-2</code>：<code>-1</code> 只保证算出来的值是整数，<code>-2</code> 则会<strong>再把结果就近取到偶数</strong>。为什么非要偶数？因为大多数编码器采用色度下采样，宽高能被 2 整除才不报错、不产生条纹。<code>scale=1920:-2</code> 就是「宽度定死 1920，高度按比例算、并取偶」，这一步替下游挡掉了奇数尺寸的麻烦。
    </p>
    <p>
      万一 <code>pad</code> 本身是最后一步、没人帮忙取偶，也可以让它自己对齐，用取整表达式把输出尺寸顶到偶数上：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" output.mp4</code>
    </p>
    <p>
      填充颜色不用另外做滤镜，<code>pad</code> 的 <code>color</code> 参数直接接受颜色名、十六进制值和表达式，例如把它换成 <code>white</code> 或品牌色。默认黑边在深色背景里几乎看不出来，但放到<strong>浅色背景</strong>下，一条纯黑的边就会很突兀，这时换成白边或品牌色更自然。
    </p>
    <p>
      最后是那个最容易被忽略、也最容易解释「为什么补完边画面还是变扁了」的问题：<strong>SAR 与 DAR</strong>。<code>SAR</code>（样本宽高比）是<strong>单个像素</strong>的宽高比，<code>DAR</code>（显示宽高比）是你<strong>眼睛看到的</strong>画面宽高比，两者满足 <code>DAR = SAR × 存储宽高比</code>。关键点在于：<strong><code>scale</code> 和 <code>pad</code> 改变的都只是像素尺寸，不会自动校正 SAR</strong>。方形像素的素材 SAR 是 <code>1:1</code>，这时像素比例就是显示比例；但老式标清或变形宽银幕素材的 SAR 并不是 <code>1:1</code>，你按像素数补完边，播放器仍会按它自己的 SAR 去解释，于是画面看起来还是不对。遇到这类素材，要么先确认并统一 SAR（例如把它规整成方形像素），要么在流程里显式设置采样比例，别默认「像素对齐了，显示就对齐了」。
    </p>
    <div class="lesson-box warn">
      <strong>两条必须记住的边界：</strong><code>pad</code> 只能扩大画布，<strong>输出尺寸不能小于输入尺寸</strong>，源比目标大时必须先用 <code>scale</code> 缩下来；<code>-1</code> 只保证整除、<code>-2</code> 才保证偶数，凡是交给编码器的尺寸尽量走 <code>-2</code>。另外补边之后最好用 <code>ffprobe</code> 核对分辨率与宽高比，必要时检查 <code>sample_aspect_ratio</code>，避免「像素对了、显示却变形」。
    </div>

    <h2>常见补边命令</h2>
    <figure class="lesson-figure">
      <figcaption>「基础用法」页签给出加黑边、加白边、加边留白等常见命令；「宽高比转换」页签列出横屏↔竖屏↔方形的补边方案并标注了推荐与不推荐的做法；「实战内容」页签则把补边接进竖屏、方形、画中画等真实场景，看它是怎么和 <code>scale</code>、<code>crop</code> 配合的。</figcaption>
      <F09Pad />
    </figure>

    <h2>内容摆位与取偶</h2>
    <p>
      补边要回答的是「画布怎么换、内容往哪摆」。记住两条：<code>pad</code> 只能把画布变大，所以源比目标大时<strong>必须先用 <code>scale</code> 缩</strong>；尺寸一律用 <code>-2</code> 或取整表达式<strong>顶到偶数</strong>，别让编码器替你冒险。最后别被像素骗了——<code>scale</code> / <code>pad</code> 动的是像素尺寸，真正决定显示胖瘦的是 SAR 与 DAR。
    </p>
    <div class="lesson-term">
      <span class="term-name">「SAR / DAR」</span><code>SAR</code>（Sample Aspect Ratio，样本宽高比）描述<strong>单个像素</strong>的宽高比，<code>DAR</code>（Display Aspect Ratio，显示宽高比）是<strong>观众看到</strong>的画面宽高比，二者关系为 <code>DAR = SAR × 存储宽高比</code>。方形像素素材的 SAR 为 <code>1:1</code>，此时像素比例即显示比例。边界与例外：<code>scale</code> 与 <code>pad</code> 只改变像素尺寸，<strong>不会自动校正 SAR</strong>，老式标清或变形宽银幕素材按像素补边后仍可能显示变形；处理这类素材要先确认或统一采样比例，必要时显式规整为方形像素，再用 <code>ffprobe</code> 核对 <code>sample_aspect_ratio</code>。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
