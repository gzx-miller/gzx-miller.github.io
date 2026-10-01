<script setup lang="ts">
import F01Basics from './F01Basics.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个 <code>.mp4</code> 文件的后缀直接改成 <code>.mkv</code>，播放器照样能放，画质一点没变——那 FFmpeg 里那句「转格式」，到底在转什么东西？
    </div>

    <h2>提出问题</h2>
    <p>
      你以为 <code>.mp4</code> 是一种「视频格式」，可它其实只是一个<strong>盒子</strong>。同一个 MP4 文件里，可能装着 H.264 的视频加 AAC 的音频，也可能装着 H.265 加另一条音轨。真正决定画面怎么被压缩的，是盒子里的<strong>编码</strong>，而不是盒子的名字。
    </p>
    <p>
      于是问题就来了：拿到一个陌生文件时，你往往说不清它内部到底是什么。旧办法有三笔隐藏成本落在你身上——靠后缀判断，只能看到盒子，看不到里面的编码；靠播放器右键属性，字段少、还不精确，更没法塞进脚本；不看结构就直接下命令，多音轨、多字幕时该保留哪条全靠猜。所以要回答的是：<strong>一个媒体文件由哪几层组成，而一条 FFmpeg 命令又是怎么把「读什么、做什么、写到哪」讲清楚的？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的写法只占两个位置：<code>ffmpeg -i input.mp4 output.avi</code>。FFmpeg 会根据输出后缀自动推断目标容器，再自动挑一组默认编码器把文件转出来。
    </p>
    <p>
      这个写法做对了一件实实在在的事：<strong>它用 <code>-i</code> 把「输入」和「其余指令」分开了</strong>，让你不用记一堆开关也能得到一个能播的文件。只求「先转出来再说」的时候，它完全够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>把输出后缀写成一个 FFmpeg 不认识的扩展名，命令会直接报 <code>Unable to find a suitable output format</code>——它认不出你想要的盒子。</li>
      <li>后缀改成 <code>.mkv</code> 但内容仍是 MP4 的那次实验说明，<strong>改名字只换了标签、没有换盒子</strong>，更没碰过里面的编码。</li>
      <li>文件里有两条音频流（比如普通话和粤语）时，它默认只取第一条，另一条被悄悄丢掉，你从输出里看不出来。</li>
      <li>不知道 <code>-i</code> 前后选项含义不同，把「作用于输入」的参数写到输出位置，命令的行为会完全变样。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这条命令，而是先把「文件由什么组成」想清楚，再看命令为什么这样排。一个媒体文件从上到下分三层：<strong>容器</strong>（Container，如 MP4、MKV、AVI）只负责封装；<strong>编解码器</strong>（Codec，如 H.264、H.265）负责压缩与解压；<strong>流</strong>（Stream）是容器里的独立轨道，通常一条视频流、一到多条音频流、零到多条字幕流。再往上还有两个尺度：<strong>帧</strong>是单张画面，<strong>码率</strong>是每秒平均数据量——它们和容器、编解码器一起，构成你理解 FFmpeg 的几大核心概念，本课先建立直觉，具体的帧率与码率调节留到后面几课。
    </p>
    <p>
      带着这层认知看命令结构就顺了：<code>ffmpeg [全局选项] [输入选项] -i 输入 [输出选项] 输出</code>。<code>-i</code> 是一条分界线。拆一条命令时可以按顺序读它：
    </p>
    <ol class="lesson-steps">
      <li>最前面是<strong>全局选项</strong>，管的是整个进程，比如 <code>-hide_banner</code> 能让输出更整洁。</li>
      <li><code>-i</code> 之前是<strong>输入选项</strong>，描述「这个输入该怎么读」。</li>
      <li><code>-i</code> 指出输入文件，它后面跟着<strong>输出选项</strong>，描述「结果该怎么写」。</li>
      <li>最后一个位置是输出文件，它的后缀决定了要封装成哪种容器。</li>
    </ol>
    <p>
      再补上「先看一眼」的习惯。要看清一个文件里到底有哪些流、各是什么编码，用同套件里的分析工具：<code>ffprobe -v error -show_streams input.mp4</code>。它不转码，只报告，能把上面几条信息一条条列出来。有了它，你才敢决定该保留哪条流、该不该动编码。
    </p>
    <div class="lesson-box warn">
      <strong>最容易混的一处：</strong>容器格式不等于编码格式。MP4 这个盒子今天装 H.264、明天也能装 H.265。看到后缀只能知道盒子，想知道内容必须去查流。另外，Windows 上装完 FFmpeg 要把 <code>bin</code> 目录加进 PATH 环境变量，否则命令行根本找不到 <code>ffmpeg</code> 这个命令。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换「核心概念 / 安装方法 / 命令结构」三个页签：先建立容器、编解码器、流的直觉，再看一条命令是怎么被拆开的。</figcaption>
      <F01Basics />
    </figure>

    <h2>总结</h2>
    <p>
      一个媒体文件是「容器装流、流有编码」的分层结构，而 <code>-i</code> 前后的选项分别管读和写。把这两件事记牢，你再看任何一条 FFmpeg 命令，都能说清每个参数站在哪一边、管的是输入还是输出。
    </p>
    <div class="lesson-term">
      <span class="term-name">「容器」</span>指 MP4、MKV、AVI、MOV 这类负责封装音视频流、字幕与元数据的文件格式，它只做「包装」，不做压缩。边界与例外：容器格式与里面的编码格式是两回事——同一个 MP4 可以装 H.264 也可以装 H.265；判断一个文件的真实内容要用 <code>ffprobe</code> 看流，而不是看后缀。
    </div>
  </LessonArticle>
</template>
