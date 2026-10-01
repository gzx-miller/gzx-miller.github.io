<script setup lang="ts">
import F17Streaming from './F17Streaming.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用 <code>-i input.mp4 -f flv rtmp://...</code> 推流，服务器日志显示连接建立成功，可三秒钟后推流就结束了；观众端只看到画面一闪而过，像是播了个开头就没了。
    </div>

    <h2>实时推流诉求</h2>
    <p>
      你想做的其实是「直播」：一边产生画面一边送出去，而不是先转好一个文件再让人下载。旧办法在这个场景下全都不顺手——把文件传到服务器再让观众下载，根本没有实时性可言；自己写程序到网络层去分包，得先吃透整套流媒体协议；而只把文件转成另一种格式，也解决不了「持续、按时」这件事。
    </p>
    <p>
      这些麻烦背后是三笔必须由你承担的成本：<strong>文件是按磁盘速度读的，不是按播放速度读的</strong>，直接推会被瞬间灌完；网络需要一条<strong>均匀</strong>的码流，忽快忽慢会让观众端反复缓冲；播放端还希望<strong>边下边播、按带宽切换码率</strong>，单一路码流满足不了。所以要回答的是：<strong>怎么让 FFmpeg 持续、稳定地把码流送到远端，并让播放端能跟得上？</strong>
    </p>

    <h2>最短推流命令</h2>
    <p>
      最短的一条推流命令只比转码多两个开关：<code>ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream</code>。
    </p>
    <p>
      它做对了两件关键的事。<code>-re</code> 让 FFmpeg <strong>按原始帧率读取输入</strong>，把「磁盘速度」压成「播放速度」，于是 1 分钟的片子就用 1 分钟推完，而不是几秒；<code>-f flv</code> 把输出指定成 RTMP 需要的 FLV 封装。<code>-c copy</code> 不重新编码，CPU 几乎不动，是最省的一版。前提是源编码必须是这套协议认的——H.264 视频配 AAC 音频。
    </p>

    <h2>五处参数遗漏</h2>
    <ul>
      <li>忘了 <code>-re</code>：文件瞬间被读完、瞬间推完，直播变成「点播闪现」，服务器端连接只活了几秒。</li>
      <li><code>-c copy</code> 推流要求视频是 H.264、音频是 AAC；源若是 HEVC 或 Opus，直接推会被服务器拒掉，你却在本地看不到任何画面问题。</li>
      <li>它只解决了「推」。观众端要么装 RTMP 播放器，要么靠服务器再转成浏览器能播的协议。</li>
      <li>单路码流没法适配手机和电脑不同的带宽，弱网用户只能一直卡。</li>
      <li>直播完想留一份回看，还得另想办法切片存档。</li>
    </ul>

    <h2>输入端与输出端</h2>
    <p>
      不推翻这条命令，而是先把「实时」拆成输入端与输出端两件事：<strong>输入端节流，输出端匹配协议</strong>，然后一层层补齐。
    </p>
    <p>
      第一层补「源不兼容」的情况。源编码不是 H.264/AAC 时，就得重新编码，用低延迟预设压住延迟：<code>-c:v libx264 -preset ultrafast -c:a aac -f flv</code>。<code>ultrafast</code> 编得快、延迟低，代价是同等画质文件更大。
    </p>
    <p>
      第二层补「让浏览器直接能播」。把流切成一段段小文件，再配一份播放列表，就是 HLS：<code>-hls_time 10 -hls_list_size 0 -f hls output.m3u8</code>。观众端只需要普通的 HTTP 和一份 <code>.m3u8</code> 列表，兼容性最好。
    </p>
    <p>
      第三层是关键，也是很多人第一次做 HLS 会踩的坑：<strong>切片点并不由 <code>-hls_time</code> 精确决定，而由关键帧决定</strong>。如果源的关键帧间隔（默认可能长达 250 帧）远大于你想要的片段时长，切片会被硬生生拉到下一个关键帧那里，实际片长和 <code>-hls_time</code> 对不上。要让两者对齐，得主动压关键帧间隔：以 30fps 想要 2 秒一片为例，用 <code>-g 60 -force_key_frames "expr:gte(t,n_forced*2)" -hls_time 2</code>，让「每 2 秒必有一个关键帧」成为硬约束。
    </p>
    <p>
      第四层补「点播还是直播」。<code>-hls_list_size 0</code> 表示列表保留所有片段，是点播，列表末尾会带 <code>#EXT-X-ENDLIST</code>；直播则把 <code>-hls_list_size</code> 设成一个正数只保留最近 N 个片段，再加 <code>-hls_flags delete_segments</code> 边推边删旧片段，列表末尾<strong>没有</strong> <code>#EXT-X-ENDLIST</code>。
    </p>
    <p>
      最后一层补「自适应码率」。把源用 <code>-map</code> 和不同的 <code>-b:v</code> 拆成多路，各自切片，再写一份 master playlist 指向各变体的 <code>.m3u8</code>，播放器就能按带宽自动切换。想要开放标准，同样的思路换成 <code>-f dash</code> 生成 MPD 即可。
    </p>
    <p>
      切片生成后，用 hls.js 或本地播放器实际播一遍 <code>.m3u8</code>，确认列表和片段都能拉取、能正常播放，再交付。
    </p>
    <div class="lesson-box warn">
      <strong>一个安全习惯：</strong>推流地址里的流密钥不要直接写死在命令、脚本或仓库里，生产环境用环境变量注入，并限制访问来源，避免密钥泄露被人盗推。
    </div>

    <h2>推流协议切换</h2>
    <figure class="lesson-figure">
      <figcaption>切换「RTMP 推流 / HLS 切片 / DASH 切片」三个页签看对应命令，再对照下方的参数说明表，弄清 <code>-re</code>、<code>-hls_time</code>、<code>-hls_list_size</code> 各自管什么。</figcaption>
      <F17Streaming />
    </figure>

    <h2>直播推流三步</h2>
    <p>
      流媒体这件事只有三步：输入端用 <code>-re</code> 把速度压成实时，输出端用 <code>-f flv</code>、<code>-f hls</code> 匹配协议，切片时让关键帧间隔与目标片长对齐。记住最后一条，你就不会再遇到「<code>-hls_time</code> 写了 2 秒，切片却都是 8 秒」这种怪事。
    </p>
    <div class="lesson-term">
      <span class="term-name">「GOP（图像组）」</span>指从一个 I 帧（关键帧）到下一个 I 帧之间的帧序列，其长度就是关键帧间隔。HLS、DASH 这类切片协议<strong>只能从关键帧处切开</strong>，所以 GOP 长度直接决定了切片的精度与直播延迟。<code>-g</code> 设定的是最大间隔，场景切换时还可能插入额外的关键帧；GOP 太长会让切片变粗、拖动进度变慢。
    </div>
  </LessonArticle>
</template>
