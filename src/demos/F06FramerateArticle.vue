<script setup lang="ts">
import F06Framerate from './F06Framerate.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>手机拍了一段 60 FPS 的素材，想压成 30 FPS 省体积，分别用 <code>-r 30</code> 和 <code>-vf fps=30</code> 各导一遍。两条命令的输出时长一样、体积也差不多，可你逐帧步进一看：一版每两帧就夹着一张重复画面，另一版却是干净地少了一半——同样写着 30，为什么结果对不上？
    </div>

    <h2>提出问题</h2>
    <p>
      视频的帧率（FPS）指每秒显示多少张画面。<strong>现实里的素材帧率是五花八门的</strong>：手机录像常见 60，电影是 24，北美电视是 29.97，欧洲与中国电视是 25。当你要把这些素材发布到同一个平台、或者把它们剪进同一条时间线时，第一步往往就是把帧率<strong>统一到同一个目标值</strong>。
    </p>
    <p>
      旧办法是把这个活丢给播放器：播放器发现素材帧率和屏幕刷新率对不上，就自己丢几张、补几张。但这套做法有两个必须由人承担的隐藏成本：第一，<strong>谁被丢掉完全不可控</strong>，一个关键动作的瞬间可能正好落在被丢弃的那一帧上；第二，<strong>不可逆</strong>，播放器丢掉的帧事后无法找回，等你发现某段慢动作不对劲，素材已经没救了。所以真正的问题是：<strong>怎样才能精确、可控地把画面重新采样到目标帧率，并且知道自己到底丢了什么、补了什么？</strong>
    </p>

    <h2>最小方案</h2>
    <p>
      最直接的写法是在输出端加一个 <code>-r</code>，指定目标帧率：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -r 30 output.mp4</code>
    </p>
    <p>
      它做对了一件事：<strong>任何输入的帧率都能被强制对齐到 30</strong>。不管上游是 60、24 还是 29.97，出来的文件就是一个规规矩矩的 30 FPS 流，播放器不用再操心适配。对「只要能播就行」的场景，这一行就够用。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>-r</code> 在输出端只做<strong>粗略的丢帧 / 复制帧</strong>来对齐帧数，它按第几帧去凑，不按时间戳去挑——60 转 30 就是机械地隔一帧丢一帧，落在关键动作上的那一帧照样会被扔掉。</li>
      <li>它会顺带重排时间戳（PTS）。当一个文件里音频不动、视频被抽帧，两者的时长就不再对齐，处理不当轻则画面一顿一顿，重则音画不同步。</li>
      <li>面对<strong>可变帧率（VFR）</strong>素材——比如录屏或手机视频里帧间隔忽长忽短——<code>-r</code> 的一刀切会把原本就不均匀的时间信息抹平。</li>
      <li>它<strong>无法让画面更流畅</strong>：24 转 30 时它只是把已有帧复制一份，每秒的「画面数」多了，但每秒的「新信息」一帧没多。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「设目标帧率」这件事，而是把这一步从输出端挪进滤镜链，换成 <strong><code>fps</code> 滤镜</strong>：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf fps=30 output.mp4</code>
    </p>
    <p>
      它的机制和 <code>-r</code> 的本质区别在于：<strong><code>fps</code> 滤镜是按时间戳重采样，而不是按帧序号凑数</strong>。它把输出时间轴按 <code>1/30</code> 秒切成一个个采样点，再去输入里找那个时间点对应的帧，整个过程的先后是这样的：
    </p>
    <ol class="lesson-steps">
      <li>按目标帧率算出一串采样时刻：0、1/30、2/30 ……</li>
      <li>对每个采样时刻，在输入里找<strong>时间戳最接近</strong>的那一帧作为这一格的画面。</li>
      <li>如果相邻两个采样点落到了<strong>同一张输入帧</strong>上（补帧场景），就复制这一帧，于是出现重复画面。</li>
      <li>如果某个采样点跳过了一帧的输入（抽帧场景），那一帧就被永久丢弃。</li>
    </ol>
    <p>
      这就解释了开场那一幕：60 转 30 时两者都在丢帧，但 <code>fps</code> 是按时间点去挑、<code>-r</code> 是按序号去凑，所以一个挑得准、一个只是草草对齐。也正是因为是按时间戳算的，官方推荐统一帧率时优先用 <code>fps</code> 滤镜而不是输出端 <code>-r</code>。
    </p>
    <p>
      补帧这一段还有一层要知道的事：<strong><code>fps=30</code> 把 24 变 30，画面并不会变流畅</strong>，它只是复制已有帧。要真正在两张原帧之间<strong>算出</strong>一张过渡帧，得用运动插值滤镜 <code>minterpolate</code>：
    </p>
    <p>
      <code>ffmpeg -i input_24fps.mp4 -vf minterpolate=fps=60 output_60fps.mp4</code>
    </p>
    <p>
      它会估计相邻帧之间的运动，再生成中间帧。代价是这些帧是「猜」出来的，快速运动或遮挡边缘容易出现伪影，所以适合做慢动作补帧，不适合硬套到动作大片上。如果只想<strong>抽取关键帧</strong>，可以用 <code>select</code> 配合可变帧率输出：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "select=eq(pict_type\,I)" -vsync vfr output_keyframes.mp4</code>
    </p>
    <div class="lesson-box warn">
      <strong>三条必须记住的边界：</strong>降低帧率是<strong>不可逆</strong>的，帧一旦丢掉就找不回来，动手前先留一份原始高帧率文件；NTSC 体系的帧率是分数，<code>29.97</code> 的真实值是 <code>30000/1001</code>、<code>23.976</code> 是 <code>24000/1001</code>，用小数写会有微小漂移；帧率越高，同样画质需要的码率越高，60 FPS 大约要 30 FPS 的 1.5 到 2 倍，所以统一帧率时别顺手把目标值抬得比源还高。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切「基础操作 / fps 滤镜 / 注意事项」三个页签：在「fps 滤镜」里对比 60 转 30 的抽帧与 24 转 30 的补帧命令，再对照「常用帧率标准」表按用途挑目标值，最后到「注意事项」里过一遍踩坑清单。</figcaption>
      <F06Framerate />
    </figure>

    <h2>总结</h2>
    <p>
      统一帧率的钥匙是「按时间戳重采样，而不是按帧序号凑数」。想做常规的抽帧、统一不同来源的帧率，用 <code>-vf fps=30</code>；输出端 <code>-r</code> 只在粗对齐时够用，且会牵连时间戳。记住 24 转 30 只是在复制帧，真正凭空造出过渡帧要靠 <code>minterpolate</code>，而丢掉的那一半帧，永远回不来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「fps 滤镜」</span>是 FFmpeg 用来重采样帧率的视频滤镜，按输出时间轴上的采样时刻去输入里挑<strong>时间戳最接近</strong>的帧，因此抽帧（如 60 转 30）比输出端 <code>-r</code> 的丢帧精细，是统一帧率的推荐做法。边界与例外：它<strong>只复制、不创造</strong>，24 转 30 不会更流畅，要生成真实过渡帧需改用 <code>minterpolate</code> 运动插值；降低帧率不可逆，帧被丢弃后无法恢复；NTSC 帧率是 <code>30000/1001</code> 这类分数，写小数会有漂移。
    </div>
  </LessonArticle>
</template>
