<script setup lang="ts">
import F14Screenshot from './F14Screenshot.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你要给视频截「第 10 秒」的封面，写下 <code>ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.jpg</code>，打开一看却是第 6 秒左右的画面；把 <code>-ss</code> 挪到 <code>-i</code> 后面，同一个时间点又精确命中了——同一个 10 秒，为什么位置一换，截出来的帧就变了？
    </div>

    <h2>帧间依赖关系</h2>
    <p>
      截图看似最简单，其实里面藏着两个字：<strong>定位</strong>。视频画面不是一帧帧独立存放的，为了压缩体积，编码器把它拆成一串<strong>互相依赖的帧</strong>——只有少数帧可以独立解码，其余的都要参考前面的帧才能还原。想取「第 10 秒」那一帧，FFmpeg 得先<strong>找到合适的位置</strong>，再把它解出来。
    </p>
    <p>
      旧办法只有两种极端：一种是从头<strong>逐帧解码数到第 10 秒</strong>，准，但片子越长等得越久；另一种是<strong>随便跳到最近的地方就取</strong>，快，但出来的可能根本不是你要的那一秒。真正的问题是：<strong>怎样在「快」和「准」之间，自己决定要哪一种？</strong>
    </p>

    <h2>时间点与取帧</h2>
    <p>
      最直接的写法是用 <code>-ss</code> 指定时间位置，再用 <code>-vframes 1</code>（等价写法是 <code>-frames:v 1</code>）表示「只要一帧」：
    </p>
    <p>
      <code>ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 output.jpg</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「跳到某时刻」和「取几帧」拆成了两件可分别控制的事</strong>——<code>-ss</code> 管定位，<code>-vframes 1</code> 管输出数量。输出格式则由扩展名决定：<code>.jpg</code>、<code>.png</code>、<code>.webp</code> 各走各的编码器。
    </p>

    <h2>参数位置差异</h2>
    <ul>
      <li><code>-ss</code> 放在 <code>-i</code> <strong>之前</strong>是<strong>输入选项</strong>，FFmpeg 会直接跳到时间点附近的<strong>关键帧</strong>再开始解码，速度极快，但落点取决于关键帧在哪——这就是开场「要第 10 秒却截到第 6 秒」的原因。</li>
      <li><code>-ss</code> 放在 <code>-i</code> <strong>之后</strong>是<strong>输出选项</strong>，精度高，但 FFmpeg 要从头（或从上一个解码位置）一路解到那一帧，<strong>越靠后的时间点越慢</strong>。</li>
      <li>截图时间<strong>超出视频总时长</strong>时会得到空文件甚至报错，而不是给你最后一帧。</li>
      <li>批量截图时如果输出名里没有<strong>序号占位符</strong>（如 <code>%04d</code>），几十张图会<strong>互相覆盖，最后只剩一张</strong>。</li>
      <li>不问格式就随手存：<code>.png</code> 无损但体积大，<code>.jpg</code> 体积小却有损，<strong>拿 JPEG 当无损归档会一直丢细节</strong>。</li>
    </ul>

    <h2>精度开关位置</h2>
    <p>
      不推翻这个骨架，而是先补上「<strong>精度的开关到底在哪</strong>」这一层——它完全由 <code>-ss</code> 相对 <code>-i</code> 的位置决定。要快、能接受偏差，就写在前面；要准、不在乎多等一会儿，就写在后面：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -ss 00:00:10 -vframes 1 output.jpg</code>
    </p>
    <p>
      第二层，<strong>把单张截图扩成批量</strong>。与其手动算出几十个时间点，不如用 <code>fps</code> 滤镜按固定间隔均匀取样，配一个带序号的输出名：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf fps=1/10 thumb_%04d.jpg</code>
    </p>
    <p>
      <code>fps=1/10</code> 表示「每 10 秒取一帧」，<code>%04d</code> 会让序号自增补零，从而生成 <code>thumb_0001.jpg</code>、<code>thumb_0002.jpg</code> 一串文件。这正是批量截图那条「不覆盖」规矩的由来。
    </p>
    <p>
      第三层，<strong>按用途挑格式与质量</strong>。封面对画质敏感就用 <code>.png</code>；要控制体积就用 JPEG 的 <code>-q:v</code>（取值 1 到 31，<strong>值越小质量越高</strong>，2 接近高质量，10 左右适合缩略图）；想在质量和体积间折中，<code>.webp</code> 是很好的选择：
    </p>
    <p>
      <code>ffmpeg -ss 00:00:10 -i input.mp4 -vframes 1 -q:v 2 output.jpg</code>
    </p>
    <p>
      第四层，<strong>给时间点做边界校验</strong>。既然超时长会得到空输出，脚本里就该先用 <code>ffprobe</code> 问出时长，再对截图时间做一次比较，把越界的时间点挡在命令之外——这样批量任务才不会因为某一条越界而整体失败。
    </p>
    <div class="lesson-box warn">
      <strong>两个关键判断：</strong>第一，<code>-ss</code> 的位置决定精度与速度的取舍——<strong>写在 <code>-i</code> 前快但不精确（对齐关键帧），写在 <code>-i</code> 后精确但慢</strong>；第二，批量截图必须用 <code>%04d</code> 这类 printf 风格文件名，否则后面的图会覆盖前面的。<code>-vframes 1</code> 与 <code>-frames:v 1</code> 是同一个意思，看到哪一种都不必惊讶。
    </div>

    <h2>前后写法差异</h2>
    <figure class="lesson-figure">
      <figcaption>「基础截图」页签把 <code>-ss</code> 在 <code>-i</code> 前/后两种写法的精度差异并列出来，还给出 PNG 与 WebP 的导出命令；「批量截图」页签演示 <code>fps=1/10</code> 与 <code>select</code> 按时间点、按帧号抽帧；「质量设置」页签则列出 JPEG 的 <code>-q:v</code>、PNG 的 <code>-compression_level</code> 与 WebP 的 <code>-quality</code> 取值。</figcaption>
      <F14Screenshot />
    </figure>

    <h2>速度与精度取舍</h2>
    <p>
      截图的两个动作要分开想：<code>-ss</code> 负责定位，<code>-vframes 1</code>（或 <code>-frames:v 1</code>）负责只取一帧。定位的精度由 <code>-ss</code> 相对 <code>-i</code> 的位置决定——放前面求快但只能对齐关键帧、可能偏几秒，放后面求准但要从头解码；批量输出一定用 <code>%04d</code> 命名，时间点再用 <code>ffprobe</code> 校一次边界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「关键帧（I 帧 / Keyframe）」</span>是视频里<strong>可以独立解码、不依赖其它帧</strong>的完整画面，其余帧（P 帧、B 帧）都要参考它或别的帧才能还原。它们把视频切成一段段 GOP，正是这个结构决定了 <code>-ss</code> 的两种行为：放在 <code>-i</code> 前，FFmpeg 直接跳到目标时间<strong>之前最近的关键帧</strong>开始解码，所以快、但落点会被关键帧位置带偏；放在 <code>-i</code> 后，则从定位点一路精确解码到目标时间，所以准、但更慢。边界与例外：关键帧间隔越大，输入定位的偏差可能越明显；需要既快又准时，可先用输入定位跳到目标附近，再用输出定位做一次微调。
    </div>
  </LessonArticle>
</template>
