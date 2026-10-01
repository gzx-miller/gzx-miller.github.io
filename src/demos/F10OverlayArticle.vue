<script setup lang="ts">
import F10Overlay from './F10Overlay.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想给视频右上角贴个台标，写下 <code>ffmpeg -i input.mp4 -i logo.png -vf overlay=W-w-20:20 output.mp4</code>，两个文件明明都在 <code>-i</code> 里给出来了，命令却报错说 <code>overlay</code> 的第二个输入没接上。为什么 <code>-vf</code> 只「看见」了一路画面？
    </div>

    <h2>提出问题</h2>
    <p>
      给视频加台标、做画中画、拼多画面，本质上是同一件事：<strong>把两路原本独立的画面合成到一路输出</strong>。一路当底图（背景），一路贴上去（前景），位置和出现时机由你说了算。
    </p>
    <p>
      旧办法是绕开命令行：用后期软件手动叠加、导出；或者在播放器里开画中画。这两条路都有必须由人扛的隐藏成本：<strong>一是不可脚本化</strong>，几百条视频、还要对每条应用同一个台标时，人工叠一遍毫无性价比；<strong>二是不可控</strong>，播放器的画中画根本无法导出成文件，水印什么时候出现、停在哪个角落，也不是你能指定的。所以真正的问题是：<strong>怎样让多个输入在同一张滤镜图里汇合，并精确控制前景贴在哪儿、什么时候出现？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的写法是用 <code>overlay</code> 滤镜，它的基本语法是<strong>用方括号写出背景与前景两路输入，再接滤镜本身</strong>：
    </p>
    <p>
      <code>[背景][前景]overlay=x:y</code>
    </p>
    <p>
      它做对了一件事：<strong>把前景画面贴到背景画面上，位置完全由 <code>x</code> / <code>y</code> 决定</strong>，坐标原点 <code>(0,0)</code> 在画面左上角，向右、向下为正。这正是所有叠加效果的最小骨架。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>它<strong>不能配 <code>-vf</code> 用</strong>。<code>-vf</code> 只会把滤镜作用在第一条视频流上，第二个输入压根没进入滤镜图，于是 <code>overlay</code> 找不到它的第二路输入，直接报错——这就是开场命令失败的原因。</li>
      <li>位置表达式里有两组尺寸变量，很容易取错：<code>W</code> / <code>H</code> 是<strong>背景（主输入）</strong>的宽高，<code>w</code> / <code>h</code> 是<strong>前景</strong>的宽高。取错一组，画中画就会贴偏甚至跑出画面。</li>
      <li>直接叠加<strong>透明水印并不会透明</strong>：PNG 里的 alpha 通道如果不先转成带 alpha 的像素格式，<code>overlay</code> 合成时会把水印当作一整块不透明图像贴上去。</li>
      <li>它只能决定「贴在哪」，<strong>决定不了「什么时候贴」</strong>。想让台标只在前 20 秒出现，光靠 <code>x</code> / <code>y</code> 做不到。</li>
      <li>两路输入长度不一样时，输出会跟着较长的那一路一直跑，短的那路结束后前景是消失、重复还是直接收尾，默认行为未必是你想要的。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻 <code>overlay</code>，而是先解决「两路怎么进同一张图」这个前提。答案是把滤镜写进<strong>复杂滤镜图 <code>-filter_complex</code></strong>，并且用<strong>流标签</strong>显式引用每一路输入：
    </p>
    <p>
      <code>ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[0:v][1:v]overlay=W-w-20:H-h-20" output.mp4</code>
    </p>
    <p>
      这里 <code>[0:v]</code> 表示「第 0 个输入的视频流」，<code>[1:v]</code> 表示「第 1 个输入的视频流」；<code>-filter_complex</code> 允许一张图里引用任意多路输入，而不像 <code>-vf</code> 那样只认第一路。必要的时候再用 <code>-map</code> 指定哪条流写进输出。理解「标签 = 某一路输入」这件事，后面所有的叠加写法都是它的组合。
    </p>
    <p>
      前提理顺后，画中画的写法就很自然了：先用 <code>scale</code> 把前景缩小，再接到 <code>overlay</code> 上，中间用一个自定义标签把它们串起来：
    </p>
    <p>
      <code>ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pip];[0:v][pip]overlay=W-w-20:H-h-20" output.mp4</code>
    </p>
    <p>
      读法是：把第 1 路视频缩成 320×180 并以 <code>[pip]</code> 命名，再用第 0 路作背景、<code>[pip]</code> 作前景执行 <code>overlay</code>。<code>W-w-20 : H-h-20</code> 借背景尺寸减去前景尺寸、再留 20 像素边距，把画面钉在右下角；写正数就是贴左上角，写成负值还能让前景故意探出画外。
    </p>
    <p>
      接着补上透明度。让水印半透明，不能只靠 <code>overlay</code>，要在前景进入 <code>overlay</code> 之前<strong>把它转成带 alpha 的像素格式</strong>，再调 alpha 系数：
    </p>
    <p>
      <code>ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180,format=rgba,colorchannelmixer=aa=0.5[pip];[0:v][pip]overlay" output.mp4</code>
    </p>
    <p>
      <code>format=rgba</code>（或 <code>yuva420p</code>）给前景补上 alpha 通道，<code>colorchannelmixer=aa=0.5</code> 把整体透明度压到 50%。只有带 alpha 的前景，<code>overlay</code> 才能做出正确的半透明合成。
    </p>
    <p>
      最后补上「什么时候出现」这一层——这是 <code>enable</code> 选项要解决的。它接受一个<strong>关于时间 <code>t</code>（单位秒）的表达式</strong>，只有表达式为真的那些时刻，叠加才生效：
    </p>
    <p>
      <code>ffmpeg -i main.mp4 -i pip.mp4 -filter_complex "[1:v]scale=320:180[pip];[0:v][pip]overlay=W-w-20:H-h-20:enable='between(t,10,20)'" output.mp4</code>
    </p>
    <p>
      上面这行让画中画只在第 10 秒到第 20 秒之间出现。<code>enable</code> 的表达式还可以用比较函数（<code>lt</code>、<code>gt</code> 等）拼出更复杂的时机，比如「开场 3 秒淡出、结尾 3 秒再现」；而滚动水印干脆把时间写进了坐标本身，让 <code>x</code> 随 <code>t</code> 变化：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=x=W-t*50:y=H-h-20" output.mp4</code>
    </p>
    <p>
      这里 <code>x</code> 每过一秒就减 50 像素，水印便从右向左匀速滑过画面。它和 <code>enable</code> 是同一个思路：<strong>把静态的坐标或开关，换成关于时间的表达式</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>三条容易踩的边界：</strong>两路输入必须走 <code>-filter_complex</code> 并用 <code>[0:v]</code> / <code>[1:v]</code> 打标签，<code>-vf</code> 只认第一路；<code>overlay</code> 的坐标原点在<strong>左上角</strong>，<code>W</code> / <code>H</code> 指背景、<code>w</code> / <code>h</code> 指前景，别混；想让输出在较短的那路结束时停止，加 <code>shortest=1</code>，需要控制辅助输入结束后的行为则用 <code>eof_action</code>。另外透明水印必须先 <code>format=rgba</code>，否则 alpha 会被丢弃。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>「基础叠加」页签给出右上、左下、居中以及带透明度的画中画命令；「画中画」页签展示动态移入、多路叠加与加边框的进阶写法；「水印添加」页签则把静态水印、半透明水印、限时显示和滚动水印一并列出，末尾还附了 <code>x</code> / <code>y</code>、<code>enable</code>、<code>shortest</code> 等参数释义。</figcaption>
      <F10Overlay />
    </figure>

    <h2>总结</h2>
    <p>
      叠加的关键是先想清楚「有几路输入、怎么在同一张滤镜图里汇合」。两路输入走 <code>-filter_complex</code> 并用 <code>[0:v]</code> / <code>[1:v]</code> 打标签，前景要先 <code>scale</code> 定大小、<code>format=rgba</code> 保透明，再用 <code>overlay=x:y</code> 定位在左上角原点的坐标系里；想控制时间，就用 <code>enable</code> 表达式或让坐标随 <code>t</code> 变化。记住 <code>W</code> / <code>H</code> 是背景、<code>w</code> / <code>h</code> 是前景，位置就不会算错。
    </p>
    <div class="lesson-term">
      <span class="term-name">「enable 时间表达式」</span>是 <code>overlay</code> 等滤镜的显隐开关，接受一个以 <code>t</code>（当前时间，单位秒）为变量的表达式，只有表达式为真的时刻该滤镜才生效，例如 <code>enable='between(t,10,20)'</code> 表示只在第 10 到 20 秒叠加。它常与比较函数 <code>lt</code> / <code>gt</code> 组合出复杂时机，也可用累加实现多段显示。边界与例外：<code>enable</code> 只控制「何时叠加」，位置仍由 <code>x</code> / <code>y</code> 决定；表达式里的时间基准是滤镜输入流的时间轴，多路输入时要注意各路时间戳是否对齐；透明合成需前景预先 <code>format=rgba</code>，<code>enable</code> 本身不处理 alpha。
    </div>
  </LessonArticle>
</template>
