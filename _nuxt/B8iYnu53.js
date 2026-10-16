const n=`<script setup lang="ts">
import F03VideoInfo from './F03VideoInfo.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写的批量压缩脚本对自家相机拍的视频一直跑得好好的，同事丢来一批手机视频，脚本跑到一半全报错——原来里头有的分辨率是奇数、有的是 29.97 这种非整数帧率，你以为「都一样」的参数根本套不上。
    </div>

    <h2>源文件规格差异</h2>
    <p>
      批量处理最怕的不是算错，而是「我以为它们规格相同」。每个源文件的分辨率、帧率、编码、像素格式都可能不一样，而你写下的那一条命令，往往只对其中一部分成立。
    </p>
    <p>
      旧办法的隐藏成本都压在你自己身上：靠文件名和后缀，只知道容器、不知道里面的规格；靠人工一个个打开看，文件一多就不可行；靠「先跑、报错再调」，两条命令之间是黑盒，批量跑到一半失败，还得回头清理一堆半成品。于是真正要解决的是：<strong>怎么在处理之前，先把每个文件的真实规格可靠地读出来？</strong>
    </p>

    <h2>命令流信息输出</h2>
    <p>
      最省事的做法，是直接用 <code>ffmpeg -i input.mp4</code> 看它打印的流信息。它会输出一段以 <code>Input #0</code> 开头的说明，把容器、时长和每条流的编码、分辨率列出来。
    </p>
    <p>
      这个做法做对了一件实实在在的事：<strong>信息确实拿得到，人眼看完全够用</strong>。你想确认一个文件是不是 1080p，扫一眼就有了答案。
    </p>

    <h2>日志解析脆弱性</h2>
    <ul>
      <li>它是给<strong>人</strong>看的日志，不是稳定的机器接口：字段顺序和措辞会随版本变，脚本按固定位置去截取，升级一次就可能解析错。</li>
      <li>输出里混着编译配置、版本、进度等噪声，想只要一个时长，却得在一大段文本里翻找。</li>
      <li>想看某一条特定流的某个字段（比如只想知道帧率）时，它不做筛选，你得自己在输出里找。</li>
      <li>它和「转码」共用同一条命令入口，顺手改错一个参数就可能真去转码，而不是只看一眼。</li>
    </ul>

    <h2>ffprobe探测</h2>
    <p>
      不推翻「先看再处理」，而是换一个专为探测而生的工具：<code>ffprobe</code>。它是 FFmpeg 套件里专做媒体分析的命令行工具，只报告、不处理，天生就是给脚本用的：
    </p>
    <p>
      <code>ffprobe -v error -show_format -show_streams input.mp4</code>
    </p>
    <p>
      其中 <code>-show_format</code> 给出容器层面的信息（如时长、总码率、流数量），<code>-show_streams</code> 给出每条流的细节（编码、宽高、帧率、采样率等），而 <code>-v error</code> 只保留媒体信息、把日志噪声压到最低。
    </p>
    <p>
      第二步，让它吐出<strong>结构化数据</strong>。加上 <code>-print_format json</code>，输出就变成标准 JSON，字段有了稳定名字，Python、Node.js 都能直接取用——这正是它和「人看的日志」最本质的区别。此时你就能按名取值：<code>format.duration</code> 是时长，<code>streams</code> 里每条流的 <code>codec_name</code>、<code>width</code>、<code>height</code> 一一定位。
    </p>
    <p>
      第三步，只取你要的字段，避免输出爆炸。<code>-select_streams v:0</code> 只看第一条视频流，<code>-show_entries</code> 限定只要哪些字段，<code>-of</code> 决定输出的排版方式。例如只取时长：
    </p>
    <p>
      <code>ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4</code>
    </p>
    <p>
      最后一步，把它接进自动化脚本，形成「<strong>先探测、再据此生成处理命令</strong>」的固定套路。这样就不会因为源文件规格差异导致批量任务失败——比如探测到宽高是奇数，就改用 <code>-2</code> 让缩放自动取偶；探测到帧率不一致，就先统一帧率再拼接。
    </p>
    <div class="lesson-box warn">
      <strong>慎用的两个开关：</strong><code>-show_frames</code> 会输出每一帧的详细信息，<code>-show_packets</code> 会输出每个数据包，两者的量都极大，别顺手加进批量脚本里。
    </div>

    <h2>三页签字段说明</h2>
    <figure class="lesson-figure">
      <figcaption>切「ffprobe 基础 / 容器信息 / 流信息」三个页签：看常用探测命令、容器字段与视频/音频流字段分别有哪些，理解脚本该去取哪些值。</figcaption>
      <F03VideoInfo />
    </figure>

    <h2>先探测再生成命令</h2>
    <p>
      自动化媒体处理的第一步永远是探测，而不是直接下命令。用 <code>ffprobe</code> 把文件的真实规格读成结构化数据，再据它生成处理命令，批量任务才不会被源文件差异绊倒。
    </p>
    <div class="lesson-term">
      <span class="term-name">「ffprobe」</span>是 FFmpeg 套件中专用于媒体分析的命令行工具，只报告而不转码，可输出 JSON、XML、Flat 等多种格式，精确给出容器与每条流的编码参数、时长、码率、帧率等。边界与例外：它输出的是「探测结果」，需要配合 <code>-select_streams</code> 与 <code>-show_entries</code> 精简；而 <code>-show_frames</code>、<code>-show_packets</code> 的输出量极大，不宜在批量场景中随手使用。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
