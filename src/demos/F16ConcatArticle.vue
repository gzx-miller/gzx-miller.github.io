<script setup lang="ts">
import F16Concat from './F16Concat.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把两段分辨率、帧率看着都一样的 MP4 用 <code>concat</code> 拼在一起，第一段播得好好的，第二段一开始就音画不同步、画面还闪一下——参数明明「一模一样」，拼出来为什么会坏？
    </div>

    <h2>提出问题</h2>
    <p>
      拼接的需求很朴素：把片头、正片、片尾三段合成一个文件。可你很快发现，「合起来」在视频里不像复制粘贴文本那样直接。文件不是一串连续字节，而是一堆带<strong>时间戳</strong>的压缩帧，容器还额外记着「哪一帧在什么时刻播、音视频怎么对齐」。于是旧办法把成本都压在了你身上：用剪辑软件重新导出，快是快不起来，画质还要掉一轮；靠肉眼判断两段「像不像」，却看不出编码参数里的时基、像素格式是否真的一致；直接手写命令，又常常分不清几种拼接方式各自的前提。
    </p>
    <p>
      真正要回答的是：<strong>什么情况下可以「原样粘」，什么情况下必须「拆开重编」，而这两条路又各自要求输入满足什么前提？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的是 <code>concat</code> 协议：<code>ffmpeg -i "concat:input1.ts|input2.ts" -c copy output.ts</code>。它把多个文件用竖线连成一个「虚拟输入」，再交给 FFmpeg 按顺序读出来。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>它用的是 <code>-c copy</code>，不重新编码</strong>。数据包只是被按顺序搬运并重新封装，速度极快、画质零损失。当所有片段本来就是同一套编码参数、又是 TS 这类「适合直接粘」的容器时，这一条命令就够了。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>两段的编码参数只要差一点点——码率、分辨率、时基、像素格式，甚至编码器写进码流的头信息不同——拼出来的第二段就会花屏、音画不同步，而且<strong>命令不会报错</strong>，你得播到那一段才发现。</li>
      <li><code>concat:</code> 协议只对少数容器友好，TS 最稳；拿两个 MP4 直接这样拼，结果经常是坏的。</li>
      <li>片段一多，一条命令里排满竖线既难读也难维护；文件名里带空格或特殊字符时特别容易翻车。</li>
      <li>它没法给每一段指定入点、出点，想剪掉片头几秒，只能先把每段各自裁好再拼。</li>
      <li>每段的时间戳都是从 0 各自开始的，直接首尾相接，第二段的时间戳会「往回跳」，播放器可能卡住或跳帧。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「原样粘」，而是先把拼接这件事分成两条本质不同的路：<strong>「粘数据包」和「重新编码」</strong>。前者快而无损，但要求输入规格一致；后者通吃一切，但要付出时间与画质。选哪种，只取决于你的片段参数是否一致、以及能不能接受重编码。
    </p>
    <p>
      第一层先补「更好用的粘法」。把要拼的文件写成一份列表 <code>list.txt</code>，每行一条 <code>file 'xxx.mp4'</code>，然后用 <strong>concat 分离器</strong>读取：<code>ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4</code>。它和协议一样不做重编码，但更灵活：片段可以来自不同的容器，还能给每条加 <code>inpoint</code> / <code>outpoint</code> 指定入点、出点，不用再单独裁剪。
    </p>
    <p>
      第二层补「参数一致性」这道门槛。无论协议还是分离器，都要求所有片段的<strong>分辨率、帧率、编码格式、时基、像素格式</strong>完全一致。所以稳妥的做法是先统一再拼：
    </p>
    <ol class="lesson-steps">
      <li>把每段都转成同一规格，例如统一到 <code>-vf scale=1920:1080,fps=30 -c:v libx264 -c:a aac</code>。</li>
      <li>确认所有片段都是 H.264 + AAC 这类「同款」编码，像素格式也一致。</li>
      <li>用 concat 分离器 <code>-c copy</code> 把它们无损拼起来。</li>
    </ol>
    <p>
      第三层留给「参数就是没法统一」的情况——素材来源各异，硬要统一反而麻烦。这时改用 <strong>concat 滤镜</strong>，它把每段解码成帧后重新编码输出，因此能吃下任意组合：<code>-filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]"</code>。这里的 <code>n=2</code> 表示两段输入，<code>v=1:a=1</code> 表示输出同时带一路视频和一路音频；每段都要按「先视频、后音频」成对写进滤镜图。代价是它必然重编码，慢，而且有一次画质损失。
    </p>
    <div class="lesson-box warn">
      <strong>两个最容易踩的点：</strong>拼接不同<strong>帧率</strong>的素材时，一定先用 <code>fps</code> 滤镜统一帧率，否则时间戳错乱会导致音画不同步；列表文件里的路径含空格或特殊字符时容易失败，建议用相对路径并逐行检查。
    </div>
    <p>
      拼完别急着交付，用 <code>ffprobe</code> 查一下总时长，确认它等于各片段之和——差得多，多半就是某一段没被正确读入。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切换「协议拼接 / 分离器拼接 / 滤镜拼接」三个页签看各自的写法，再对照下方的对比表，判断手上的片段到底该用哪一种。</figcaption>
      <F16Concat />
    </figure>

    <h2>总结</h2>
    <p>
      拼接只有两种本质选择：参数一致、又能接受不加修饰，就用 concat 协议或分离器 <code>-c copy</code> 无损直拼；参数不一致、又必须合到一起，才动用 concat 滤镜重编码。判断顺序永远是「先看参数、再看是否允许重编码」，而不是记住某一条命令。
    </p>
    <div class="lesson-term">
      <span class="term-name">「concat 分离器」</span>指用 <code>-f concat -i list.txt</code> 读取一份文件列表来顺序拼接的输入格式。它比 <code>concat:</code> 协议更灵活：可指定每段的 <code>inpoint</code>/<code>outpoint</code>、可混合不同容器，但<strong>仍要求各片段的编码参数完全一致</strong>，且不做重编码——参数不一致时必须改用 concat 滤镜重编码。
    </div>
  </LessonArticle>
</template>
