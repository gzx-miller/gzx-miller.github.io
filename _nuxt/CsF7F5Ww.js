const o=`<script setup lang="ts">
import F12Volume from './F12Volume.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你给三条素材统一加上 <code>-af "volume=2.0"</code> 想把声音都提起来，导出后一条震得人耳朵疼、一条听着刚好、还有一条依然偏小——同一个「翻倍」，为什么结果差这么多？
    </div>

    <h2>采样值乘增益</h2>
    <p>
      音量滤镜的本质很朴素：<strong>把音频的每个采样值乘上一个系数</strong>。乘 0.5 是减半，乘 2.0 是翻倍，写成分贝就是 <code>-6dB</code> 与 <code>+6dB</code>。它处理的是「这一个文件相对它自己」的增减，压根不知道这段声音原本有多响。
    </p>
    <p>
      于是「让不同视频听起来一样大」这件事，只能让人来扛。旧办法无非两条：一条是<strong>逐条试听、手动试系数</strong>——素材一多就没法收场，而且换个人听结果又不一样；另一条是靠<strong>耳朵挑静音段来修剪</strong>——既慢又容易漏。真正的问题是：<strong>怎样让一批响度各异的素材，输出后听起来是同一个音量？</strong>
    </p>

    <h2>音量滤镜增益参数</h2>
    <p>
      最直接的写法就是用 <code>volume</code> 滤镜，参数既可以是倍数，也可以是分贝：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -af "volume=0.5" -c:v copy output.mp4</code>
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -af "volume=3dB" -c:v copy output.mp4</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>增益是精确、可复现的</strong>——你说乘多少就乘多少，同一段素材跑两遍结果完全一致，比在剪辑软件里凭手感拖音量条靠谱得多。
    </p>

    <h2>固定增益偏差</h2>
    <ul>
      <li><code>volume</code> 是<strong>固定增益，不是「听感对齐」</strong>。源文件本身偏小的那条，乘 2.0 之后仍然偏小；源文件本来就满的那条，乘 2.0 直接冲破上限——于是出现开场里「一条震耳、一条刚好、一条偏小」的分裂结果。</li>
      <li>增益过头会<strong>削波失真（Clipping）</strong>：采样值一旦越过最大值就被硬切平，波形被切掉的那部分<strong>永久无法还原</strong>。你没法靠「再调小一点」把已经切掉的声音补回来。</li>
      <li>倍数与分贝容易混。乘 2.0 约等于 <code>+6dB</code>，而 <code>+3dB</code> 只约等于乘 1.41；写成 <code>volume=-3dB</code> 是降低 3 分贝，不是「减到三分之一」。记错一个符号，方向就反了。</li>
      <li>只靠 <code>volume</code> 根本<strong>测不出「峰值到没到顶」</strong>。你不先量一遍就往上加，等于闭着眼睛往墙上撞。</li>
      <li>修剪静音也好不到哪去：没有现成的检测手段时，只能人肉快进，长视频里漏掉几段静音几乎不可避免。</li>
    </ul>

    <h2>峰值测量前置</h2>
    <p>
      不推翻 <code>volume</code>，而是先补上「<strong>动手之前先测量</strong>」这一层。调音量前，先用 <code>volumedetect</code> 把当前峰值报出来：
    </p>
    <p>
      <code>ffprobe -f lavfi -i "amovie=input.mp4,volumedetect" -f null -</code>
    </p>
    <p>
      它会告诉你最大音量和平均音量各是多少分贝。知道峰值离 0dB 还有多少余量，你才能决定「最多能加几 dB」而不削波。
    </p>
    <p>
      第二层，<strong>补上「按听感对齐」的能力</strong>，这就是 <code>loudnorm</code> 滤镜要解决的。它实现的是 <strong>EBU R128 响度标准化</strong>，参数只关心三件事：<code>I</code> 是目标整体响度、<code>TP</code> 是真实峰值上限、<code>LRA</code> 是允许的响度动态范围。
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:v copy output.mp4</code>
    </p>
    <p>
      它和 <code>volume</code> 的根本差别在于：<strong><code>volume</code> 只管「乘一个数」，<code>loudnorm</code> 管的是「最终落在多响」</strong>。无论源文件原本是 -30 LUFS 还是 -10 LUFS，经过它处理后都会收敛到 <code>I</code> 指定的目标附近，这才是「听起来一样响」的实现方式。网络视频常用 <code>-16 LUFS</code>，广播标准常用 <code>-24 LUFS</code>。
    </p>
    <p>
      第三层，<strong>把 <code>loudnorm</code> 做成两遍处理</strong>。单次运行是「边测边调」的动态过程，可能带来轻微的音量起伏；更稳的做法是先跑一遍量出实际的 <code>measured_I</code>、<code>measured_TP</code>、<code>measured_LRA</code>，再把这三个值回填进第二次命令并打开 <code>linear=true</code>，让增益变成一次平稳的整体缩放。
    </p>
    <p>
      第四层，<strong>补上静音检测</strong>。<code>silencedetect</code> 能找出低于阈值的静音片段，配合参数控制「多长才算静音」：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -af silencedetect=noise=-30dB:d=0.5 -f null -</code>
    </p>
    <p>
      它的时间戳输出在 stderr 里，常被脚本接走去自动切片或去掉空白段。
    </p>
    <div class="lesson-box warn">
      <strong>两条必须记住的边界：</strong>其一，<code>volume</code> 的分贝与倍数是两种不同单位，<code>volume=0.5</code> 是减半（约 -6dB），<code>volume=-3dB</code> 是降低 3 分贝，别把「倍」当「dB」；其二，<strong>削波不可逆</strong>，任何增益前都要先用 <code>volumedetect</code> 探峰值，必要时再串一个 <code>limiter</code> 兜住上限。想「让文件听起来一样响」时不要用 <code>volume</code> 硬拉，改用 <code>loudnorm</code>。
    </div>

    <h2>网络与广播响度</h2>
    <figure class="lesson-figure">
      <figcaption>「基础调整」页签列出 <code>volume</code> 的倍数与分贝写法；「响度标准化」页签给出 <code>loudnorm</code> 的网络视频（<code>-16 LUFS</code>）与广播（<code>-24 LUFS</code>）两套参数，并列出 YouTube、Netflix、Apple Music 等平台各自的响度标准；「高级处理」页签再补上动态范围压缩、降噪、语音增强与多音轨选择，末尾还有一条条踩坑提示。</figcaption>
      <F12Volume />
    </figure>

    <h2>相对增益与响度</h2>
    <p>
      音量这件事要分清两个层次：<code>volume</code> 是「对当前文件乘一个数」，是相对增益，改不了不同素材之间的响度差；<code>loudnorm</code> 是「把最终响度收敛到某个目标」，处理的是听感上的一致。要用 <code>volume</code> 就永远先测峰值、防止削波；要让一批视频听起来一样响，就把目标交给 <code>loudnorm</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「LUFS（Loudness Units Full Scale）」</span>是 EBU R128 等标准采用的<strong>响度</strong>计量单位，反映人耳感知到的整体音量，与只描述单点峰值的 dBFS 不同——同一段音频的 LUFS 值往往明显低于它的峰值 dBFS。它区别于 <code>volume</code> 的固定增益：<code>loudnorm</code> 用 <code>I</code> 设定目标 LUFS、<code>TP</code> 限制真实峰值、<code>LRA</code> 界定响度动态范围。边界与例外：网络视频常取 <code>-16 LUFS</code>、广播取 <code>-24 LUFS</code>；单次 <code>loudnorm</code> 是动态处理，追求稳定时应先测量再回填做第二遍两遍处理。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
