<script setup lang="ts">
import F13Subtitle from './F13Subtitle.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用 <code>ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4</code> 把字幕封进 MP4，命令几秒就跑完、文件几乎没变大，你满心以为字幕「进去了」；换到一台老播放器和某个上传平台上，画面下方却空空如也——字幕到底进没进去？
    </div>

    <h2>提出问题</h2>
    <p>
      字幕这件事，和「给画面贴一张图」完全不是一回事。它有三种截然不同的落法：<strong>外挂字幕</strong>是独立文件，播放时加载；<strong>内嵌字幕（软字幕）</strong>是把字幕封装成容器里的一条独立流，能开关、能切语言；<strong>烧录字幕（硬字幕）</strong>则是把文字直接渲染进画面像素里，成为图像的一部分。
    </p>
    <p>
      旧办法往往只剩两条：要么<strong>直接烧录</strong>，可一旦烧进去就无法再移除，改一个字都得把整段视频重压一遍；要么<strong>干脆发外挂文件</strong>，可用户得自己找字幕、还得播放器肯加载。真正的问题是：<strong>怎样在「随时能关」与「一定看得到」之间做取舍，并为每种场景选对方式？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法是先把字幕<strong>封装成一条内嵌流</strong>，用 <code>-c copy</code> 原样搬运音视频、只给字幕换一个容器认可的编码，比如 MP4 里的 <code>mov_text</code>：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>字幕成了一条可开关的独立流</strong>——它不占画面、能多语言并存、代价极小（音视频走 <code>-c copy</code> 几乎不重编码），这正是「软字幕」的全部价值。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>软字幕<strong>依赖于播放器肯不肯认</strong>。这就是开场那一幕的真相：字幕其实已经封进去了，只是那台旧播放器和那个平台不支持 <code>mov_text</code> 这条轨道，于是它<strong>一个字都不显示</strong>，看起来就像「没进去」。</li>
      <li><code>mov_text</code> 只支持很基础的样式。<strong>ASS 字幕里的定位、描边、动画在 MP4 里会大面积丢失</strong>，换成 MKV 才保得住。</li>
      <li>烧录一旦完成<strong>无法移除</strong>，而且必须重新编码整段视频，处理几分钟的片子可能要等上很久——这是它相比软字幕最沉重的代价。</li>
      <li>中文字幕最常栽在<strong>编码</strong>上：SRT 文件若没存成 UTF-8，烧录出来后整段是乱码方框；这时要显式告诉滤镜文件编码。</li>
      <li>一个容器里塞了多条字幕轨时，默认导出哪一条并不确定，<strong>不显式指定就可能留下错误的那条</strong>。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这三种方式，而是先补上「<strong>先看清楚有什么</strong>」这一层。动手前用 <code>ffprobe</code> 把字幕流列出来，看源文件里已经封了几条、什么编码：
    </p>
    <p>
      <code>ffprobe -v error -select_streams s -show_streams input.mkv</code>
    </p>
    <p>
      <code>-select_streams s</code> 只看字幕流。看清之后再决定是新增一条、还是只保留其中某一条。
    </p>
    <p>
      第二层，<strong>先选对容器</strong>。容器对字幕的兼容性差别很大：<strong>MKV 对字幕支持最好</strong>，SRT、ASS、图像字幕都能装；MP4 只能用 <code>mov_text</code>，样式能力有限。所以有样式要求的多语言版本，优先封进 MKV：
    </p>
    <p>
      <code>ffmpeg -i input.mkv -i subtitle.srt -c copy -c:s srt output.mkv</code>
    </p>
    <p>
      第三层，<strong>多语言时用 <code>-map</code> 点名</strong>，再给每条轨贴上语言标签，播放器才能正确列出「中文」「English」：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -i zh.srt -i en.srt -map 0 -map 1 -map 2 -c copy -c:s mov_text -metadata:s:s:0 language=chi -metadata:s:s:1 language=eng output.mp4</code>
    </p>
    <p>
      第四层，<strong>确实需要「人人可见」时才烧录</strong>。用 <code>subtitles</code> 滤镜把文字渲染进画面，中文务必指明 UTF-8 编码：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "subtitles=filename=subtitle.srt:charenc=UTF-8" output.mp4</code>
    </p>
    <p>
      需要改样式时，还可以用 <code>force_style</code> 覆盖字号与颜色，例如 <code>force_style='Fontsize=24,PrimaryColour=&amp;Hffffff&amp;'</code>。它需要 FFmpeg 编译时启用 libass 支持，可以用 <code>ffmpeg -filters</code> 里有没有 <code>subtitles</code> 来确认。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>ffprobe -select_streams s</code> 查看现有字幕流，判断要新增还是替换。</li>
      <li>要「能开关、多语言」就选软字幕，按容器挑选 <code>-c:s</code>（MP4 用 <code>mov_text</code>，MKV 用 <code>srt</code> 或 <code>ass</code>）。</li>
      <li>多条轨时用 <code>-map</code> 指定保留哪些，并补上 language 标签。</li>
      <li>只有目标平台无法播放软字幕时，才用 <code>subtitles</code> 滤镜烧录，并指定 UTF-8 编码。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个常见误判：</strong>一是把「播放器没显示」当成「字幕没封进去」——多半只是该播放器不支持那条字幕流，用 <code>ffprobe</code> 一查便知；二是对 MP4 里的 <code>mov_text</code> 抱有样式的期待，ASS 的定位与动画在 MP4 中会丢，要保样式就换 MKV。另外，烧录字幕会增加编码工作量且不可逆，操作前一定留好原始文件。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>「外挂字幕」页签给出把独立 SRT/ASS 封装成内嵌流的写法，「内嵌字幕」页签演示多语言并列与选择特定轨道，「烧录字幕」页签则把 SRT 与 ASS 的烧录命令、内嵌字幕流烧录以及 <code>charenc=UTF-8</code> 编码处理一并列出；页面末尾还有一张 SRT、ASS、VobSub、WebVTT、TTML 的格式对比表。</figcaption>
      <F13Subtitle />
    </figure>

    <h2>总结</h2>
    <p>
      字幕先问一句「谁来看、要不要关」：要能开关、要多语言，就用软字幕把字幕封成独立流，并按容器选对编码（MP4 用 <code>mov_text</code>、MKV 用 <code>srt</code> 或 <code>ass</code>），多轨时用 <code>-map</code> 点名；只有目标平台完全不吃软字幕时，才用 <code>subtitles</code> 滤镜烧成硬字幕。别把播放器不显示误当成字幕没封进去，先 <code>ffprobe</code> 看一眼字幕流。
    </p>
    <div class="lesson-term">
      <span class="term-name">「软字幕与硬字幕（Softsub / Hardsub）」</span>软字幕指以独立流形式封装在容器里的字幕，播放时可开关、可切语言、可多轨并存，代价是依赖播放器支持；硬字幕指用 <code>subtitles</code> 滤镜把文字渲染进画面像素，任何播放器都能看到，代价是不可移除且必须重编码。边界与例外：MP4 的软字幕只有 <code>mov_text</code>，样式能力有限，ASS 的定位与动画会丢，保样式应改用 MKV；中文字幕文件必须是 UTF-8，烧录时用 <code>charenc=UTF-8</code> 兜底；<code>subtitles</code> 滤镜依赖编译时的 libass 支持。
    </div>
  </LessonArticle>
</template>
