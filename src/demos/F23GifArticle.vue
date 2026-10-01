<script setup lang="ts">
import F23Gif from './F23Gif.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一段 6 秒的视频直接转成 GIF，原片明明很干净，转出来人脸却发绿、天空的渐变碎成一块块噪点——转换命令没报任何错，颜色却说烂就烂了。
    </div>

    <h2>颜色数量上限</h2>
    <p>
      你想把一小段画面做成动图，发到聊天里、贴进文档。视频文件太大，GIF 到处都能直接显示，看起来顺理成章。
    </p>
    <p>
      可 GIF 是 1987 年定下来的格式，每张图<strong>最多只允许 256 种颜色</strong>，而且每一帧都是一张完整的像素图。于是成本全落到你身上：颜色得由工具自己压到 256 种，压不好就发花；帧率和画面尺寸直接决定文件大小，稍不注意就是几十 MB；很多聊天工具还有体积上限（比如 10MB），超了根本发不出去。所以要回答的是：<strong>怎么在 256 色的硬约束下，既保住观感又把体积压进限制里？</strong>
    </p>

    <h2>帧率尺寸压缩</h2>
    <p>
      最短的转换命令只有一行：<code>ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1" output.gif</code>。
    </p>
    <p>
      它做对了一件最要紧的事：<strong>先砍掉体积的两个乘数</strong>。GIF 的大小几乎正比于「帧数 × 单帧像素数」，而这两项都由你说了算。<code>fps=10</code> 把 30 帧/秒压到 10 帧/秒，帧数直接变成三分之一；<code>scale=320:-1</code> 把宽度缩到 320（<code>-1</code> 表示高度按原比例自动算），像素数掉一大截。两刀下去，文件通常就从几十 MB 降到几 MB。
    </p>

    <h2>人脸发绿成因</h2>
    <ul>
      <li>颜色不对。不指定调色板时，FFmpeg 会拿一张通用色表去套所有画面，人脸的红、树叶的绿最先被牺牲，于是出现开场那种发绿的肤色和成块的噪点。</li>
      <li>不写 <code>fps</code> 就继承源帧率。一段 30 帧/秒的素材会老老实实生成 30 张/秒的 GIF，体积是 10 帧/秒时的三倍，而肉眼看不出差别。</li>
      <li>缩放算法没指定。默认算法在大幅缩小时边缘发糊，文字与小图标最容易看出来。</li>
      <li>从中间截一段时要留意 <code>-ss</code> 的位置：放在 <code>-i</code> 之前是快速定位、可能落在关键帧上，放在之后才逐帧精确——位置不同，起点会差几帧。</li>
      <li>调色板是「为这一段内容统计出来的」。换了素材还复用上一次的调色板文件，颜色会明显偏。</li>
      <li>循环次数不在你能精细控制的范围内，而渠道对体积和播放方式都有要求，发布前不实测就不知道能不能用。</li>
    </ul>

    <h2>两遍调色板法</h2>
    <p>
      不推翻「砍帧率、砍尺寸」，而是先解决最刺眼的那件事：颜色。核心思路是<strong>别让 FFmpeg 自己猜 256 色，而是从这段画面里统计出一张最合适的调色板</strong>——这一步叫色彩量化，分两遍完成。
    </p>
    <p>
      第一遍，扫过整段画面，挑出最有代表性的 256 种颜色，存成一张调色板图片：<code>ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,palettegen" palette.png</code>。注意这里的滤镜链要和最终输出<strong>完全一致</strong>——调色板是按缩放后的画面统计的，尺寸不一致就白统计了。
    </p>
    <p>
      第二遍，把原视频按这张调色板逐帧映射成 GIF：<code>ffmpeg -i input.mp4 -i palette.png -lavfi "[0:v]fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" output.gif</code>。这里 <code>[0:v]</code> 是第一路输入的视频、<code>[1:v]</code> 是调色板，<code>paletteuse</code> 负责映射；<code>dither</code> 是<strong>抖动</strong>，用相邻像素颜色交错来「假装」出 256 色之外的颜色，<code>bayer</code> 快、<code>floyd_steinberg</code> 观感更细腻但慢。
    </p>
    <p>
      两遍法还有个更省事的写法：不落中间那张 PNG，用 <code>split</code> 在同一条命令里把输入分两路，一路去 <code>palettegen</code>、一路等着 <code>paletteuse</code>：<code>ffmpeg -i input.mp4 -filter_complex "[0:v]fps=10,scale=320:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" output.gif</code>。它的本质<strong>仍然是两遍</strong>，只是都在内存里完成。反过来，留着那张 PNG 便于反复调参：调好一次，后续可以复用它多试几种 <code>paletteuse</code> 的写法。
    </p>
    <p>
      颜色解决后，再回头继续压体积。既然 256 色就是天花板，干脆主动降到更少：<code>palettegen=max_colors=128</code> 把色数砍半，文件更小，代价是渐变更容易断带——这一步属于<strong>画质换体积</strong>，要看着画面做取舍。同理，<code>stats_mode=diff</code> 让统计更偏向画面变化的部分，做界面录屏这类「大块静止、局部在动」的素材会更干净。
    </p>
    <p>
      接着处理「怎么播」和「取多长」：<code>-loop 0</code> 表示无限循环，也是 FFmpeg 输出 GIF 的默认行为；想让动图只播一次或指定次数，循环次数是记在 GIF 内部的 Netscape 扩展里的，不同工具的写法并不统一，要精确控制得借助专门工具。截取片段时用 <code>-ss 00:00:10 -t 5</code> 取出你要的那 5 秒，再套上面整条滤镜链——<strong>先截取再降帧缩放</strong>，统计出来的调色板才对得上这一小段。
    </p>
    <p>
      如果机器上装了 <code>gifsicle</code>，还能再收一道尾：<code>gifsicle -O3 --colors 128 input.gif -o output.gif</code>。<code>-O3</code> 会做帧间差分，只保存与上一帧不同的区域，并重建全局色表——不改内容，纯省体积。没装这个工具就跳过，前面的手段已经够用。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的点：</strong>调色板和内容强绑定，换了片段一定要重新生成 <code>palette.png</code>，否则颜色会明显偏；帧率不是越高越好，GIF 用 <strong>10 到 15 帧/秒</strong>通常足够，再往上是体积成倍涨、观感几乎没变。发布前把成品在浏览器或目标聊天工具里实际播一遍，确认循环行为与体积都满足渠道限制。如果怎么压都下不来，认真考虑改用无声 MP4 或 WebP 动图——同等质量下它们小得多。
    </div>

    <h2>调色板优化页签</h2>
    <figure class="lesson-figure">
      <figcaption>切换「基础生成 / 调色板 / 优化技巧」三个页签，对照直接转与两遍法的命令差别，再翻到优化技巧逐条体会体积与画质的取舍。</figcaption>
      <F23Gif />
    </figure>

    <h2>抖动补偿颜色</h2>
    <p>
      GIF 的一切限制都来自「每帧 256 色」这个天花板：先用 <code>fps</code> 与 <code>scale</code> 把体积的两个乘数压下来，再用 <code>palettegen</code> + <code>paletteuse</code> 两遍法把 256 色用在刀刃上，必要时减色、抖动、上 <code>gifsicle</code> 继续抠体积。调色板只对当前片段有效，这是它最容易被忽略也最容易翻车的边界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「色彩量化」</span>指把真彩色图像减少到有限种代表色的过程，GIF 的上限是 256 色，所以量化不可避免、且一定有损。<code>palettegen</code> 负责从画面中统计出这 256 种代表色，<code>paletteuse</code> 负责按调色板逐帧映射，并用<strong>抖动</strong>让相邻像素交错的颜色在视觉上合成为中间色。边界：调色板与具体内容强相关，换片段必须重新生成；减色与抖动都能压体积，但前者会带来断带、后者会增加噪点。
    </div>
  </LessonArticle>
</template>
