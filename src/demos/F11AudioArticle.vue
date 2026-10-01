<script setup lang="ts">
import F11Audio from './F11Audio.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只想把视频里音频的采样率从 48000 改成 44100，顺手写下 <code>ffmpeg -i input.mp4 -ar 44100 output.mp4</code>，跑完后发现文件比原片大了将近三倍，画面也比原来糊了——你明明只动了音频，画质为什么会跟着掉？
    </div>

    <h2>提出问题</h2>
    <p>
      一个音视频文件里，画面和声音是<strong>两条各自独立的流（stream）</strong>，彼此不知道对方的参数。视频流有分辨率、帧率、码率；音频流也有自己的一整套：<strong>采样率</strong>（每秒采样多少次，常见 44100Hz 或 48000Hz）、<strong>声道数</strong>（单声道、立体声、5.1 环绕声）、<strong>编码格式</strong>（AAC、MP3、Opus）与<strong>码率</strong>（决定音质和体积）。这四样凑齐，才算把一段声音描述清楚。
    </p>
    <p>
      麻烦在于「统一」这件事必须由人扛。旧办法无非两条：一条是<strong>整段重新编码</strong>——为了改一个采样率，把好好的 H.264 画面也重压一遍，耗时翻倍、画质还掉了；另一条是<strong>干脆不处理</strong>——可不同来源的素材采样率、声道数五花八门，拼在一起就忽左忽右、忽大忽小。所以真正的问题是：<strong>怎样只改音频的参数，同时让视频原封不动？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      FFmpeg 给音频参数各配了一个开关：<code>-ar</code> 设采样率、<code>-ac</code> 设声道数、<code>-b:a</code> 设音频码率、<code>-c:a</code> 指定音频编码器。想改哪一样就写哪一样：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -ar 44100 -c:v copy output.mp4</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>它把音视频分开对待</strong>——你想动的是声音，那就只让音频这一路干活，画面走旁路。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>漏写 <code>-c:v copy</code>，视频就会被<strong>连带重新编码</strong>。这正是开场那个「只改音频、画质却掉了」的结果：你没有对视频编码作任何声明，FFmpeg 默认把所有流都重新编一遍。</li>
      <li>改 <code>-ar</code> / <code>-ac</code> <strong>一定会触发音频重采样并重新编码</strong>，它做不到像 <code>-c copy</code> 那样「只搬家、不重做」。想无损只改这两个参数，技术上是不可能的。</li>
      <li>把多声道直接降成单声道时，<code>-ac 1</code> 会把各声道简单相加，<strong>原本接近满幅的声音可能直接削波失真</strong>；这种场合更该用 <code>pan</code> 或 <code>aresample</code> 控制混音增益。</li>
      <li>用 <code>-c:a copy</code> 抽音轨时，若只换了扩展名却没换编码，<strong>文件的外表会和内容对不上</strong>——把 AAC 硬叫成 <code>.mp3</code>，播放器能出声，但标签全错，后续脚本按扩展名判断就会踩坑。</li>
      <li>想让容器收下一段它不支持的音频编码，比如把 FLAC 塞进 MP4，<code>-c copy</code> 会<strong>直接报错退出</strong>，而不是帮你悄悄转码。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻这套参数，而是按顺序一层层补齐。第一层，<strong>先探测再动手</strong>。你不知道源文件是 48000 还是 44100、是双声道还是 5.1，就不该拍脑袋写命令，先让 <code>ffprobe</code> 把音频流参数报出来：
    </p>
    <p>
      <code>ffprobe -v error -select_streams a:0 -show_streams input.mp4</code>
    </p>
    <p>
      其中 <code>-select_streams a:0</code> 只挑第 0 条音频流，免得视频流的信息混进来干扰判断。看清了再决定改什么。
    </p>
    <p>
      第二层，<strong>锁定视频不动</strong>。只要这次任务与画面无关，命令里就永远写上 <code>-c:v copy</code>。这不是可有可无的优化，而是防止「改音频把画面拖下水」的保险。
    </p>
    <p>
      第三层，<strong>挑对音频编码器</strong>。同一段声音换成不同编码，体积和兼容性差得很远：<code>aac</code> 兼容性最好，几乎所有设备和平台都认，是最稳妥的默认；<code>libmp3lame</code> 老设备通吃；<code>libopus</code> 在低码率（如 96k）下音质明显优于 AAC，适合语音通话和 WebRTC；<code>flac</code> 与 <code>pcm_s16le</code> 是无损，文件大，留给归档。
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -c:a aac -b:a 128k -c:v copy output.mp4</code>
    </p>
    <p>
      第四层，<strong>只留声音或换掉声音</strong>。用 <code>-vn</code>（no video）丢掉视频流，就得到一条纯音轨；保留原编码直接抽出来用 <code>-c:a copy</code>，速度最快：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -c:a copy -vn output.aac</code>
    </p>
    <p>
      反过来，要把一条新音轨换进视频，思路是「先决定留哪条流，再写出去」：用 <code>-map</code> 显式点名视频流与目标音频流，其余一律不输出。
    </p>
    <ol class="lesson-steps">
      <li>用 <code>ffprobe -select_streams a:0</code> 读出源音频的采样率、声道数与编码。</li>
      <li>按目标设备或平台的要求，用 <code>-ar</code> / <code>-ac</code> / <code>-c:a</code> / <code>-b:a</code> 补齐参数。</li>
      <li>一律附上 <code>-c:v copy</code>，确保画面不被重编码。</li>
      <li>输出后再用 <code>ffprobe</code> 复核采样率与声道数，确认参数真的生效。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>三个常见误区：</strong>一是以为 <code>-ar</code> / <code>-ac</code> 能无损，其实它们必然重采样重编码；二是改完音频忘了 <code>-c:v copy</code>，白白把画面重压一遍；三是把 <code>-c:a copy</code> 抽出的音轨随便起扩展名，内容和文件名对不上。想把立体声降到单声道又不想削波，别硬用 <code>-ac 1</code>，交给 <code>pan</code> 控制混音增益更稳。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>「基础操作」页签把改采样率、改声道、改码率、换编码与抽音轨的命令排成一张对照表；切到「编码格式」可以看到 aac、libfdk_aac、libmp3lame、libopus、flac 在质量与速度上的取舍，以及单声道到 7.1 的声道布局与对应 <code>-ac</code> 参数；「高级处理」页签再补上音频延迟、响度标准化与合并多音轨的写法。</figcaption>
      <F11Audio />
    </figure>

    <h2>总结</h2>
    <p>
      音频处理的关键，是先把音视频当成两条独立的流：要改声音，就用 <code>-ar</code> / <code>-ac</code> / <code>-c:a</code> / <code>-b:a</code> 精确点名改什么，同时用 <code>-c:v copy</code> 把画面钉死不动。记住改采样率或声道一定伴随重采样与重编码，想无损只搬不重做，只有 <code>-c copy</code> 这一条路。
    </p>
    <div class="lesson-term">
      <span class="term-name">「音频重采样（Resampling）」</span>指在改变采样率或声道布局时，把离散采样点重新换算到新时间网格上的过程——例如 48000Hz 降到 44100Hz，必须重新计算每一个采样值，因此一定伴随重新编码，无法用 <code>-c copy</code> 无损完成。边界与例外：只改 <code>-b:a</code>（码率）而编码器不变，同样要重编码；<code>-ac</code> 改变声道数时会先做声道混合，降声道可能因简单相加而削波，需要 <code>pan</code> 或 <code>aresample</code> 精细控制增益；只有在原样提取音轨时才用 <code>-c:a copy</code>，且输出扩展名要与真实编码一致。
    </div>
  </LessonArticle>
</template>
