<script setup lang="ts">
import F18HardwareAccel from './F18HardwareAccel.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一段 4K 素材，用 CPU 软编码跑了二十来分钟，换成 <code>-c:v h264_nvenc</code> 两分钟就转完了——可文件反而更大、暗部还糊了点；更奇怪的是，你加上 <code>-hwaccel cuda</code> 想再快一截，速度几乎没变，有时候甚至更慢。
    </div>

    <h2>批量转码速度瓶颈</h2>
    <p>
      你遇到的场景通常是转码太慢：批量转一堆 4K 素材，CPU 所有核心跑满，进度条爬得让人绝望；又或者是实时转码，要求延迟足够低，纯 CPU 根本撑不住。旧办法只有两条——硬等，或者加机器，两样都要真金白银换时间。
    </p>
    <p>
      问题在于，你的机器上其实租着一块闲置的算力：<strong>GPU 里有专门做视频编码、解码的电路</strong>，一直没被用上。可它不像 CPU 那样「换个参数就更快」那么简单，有三笔隐藏成本：不确认驱动和 FFmpeg 编译配置就瞎试，命令直接报编码器不存在；各家的编码器名字和参数完全不同，抄错了跑不起来；最要命的是，速度和质量之间怎么取舍，没人提前告诉你。
    </p>
    <p>
      所以要回答的是：<strong>硬件加速到底加速了哪一步，什么情况该用，又什么情况用了反而更慢？</strong>
    </p>

    <h2>GPU硬件编码</h2>
    <p>
      最直接的一招，是把编码器从 CPU 换成 GPU：<code>ffmpeg -i input.mp4 -c:v h264_nvenc -preset p4 output.mp4</code>。NVIDIA 显卡上，这一条就能把「编码」这一步从 CPU 挪到 GPU 的专用电路。
    </p>
    <p>
      它做对了一件很实在的事：<strong>编码不再挤占 CPU 的通用算力</strong>。速度提升巨大、CPU 占用骤降，实时转码场景因此才成为可能。前提是：机器有对应厂商的 GPU、装好驱动、而且 FFmpeg 编译时带上了这个编码器。
    </p>

    <h2>硬编质量与预设参数</h2>
    <ul>
      <li>画质略逊：同等码率下，硬编通常不如 <code>libx264</code>，暗部、细节更容易糊，这就是开场里「文件更大、画面还软」的原因。</li>
      <li>参数各家不同，抄错就报错：NVENC 用 <code>-preset p1..p7</code> 和 <code>-rc</code>/<code>-cq</code>，QSV 用 <code>-preset veryslow</code> 或 <code>-global_quality</code>，VideoToolbox 用 <code>-q:v</code>，不能混用。</li>
      <li>换了平台，编码器的名字也变：NVIDIA 是 <code>nvenc</code>、Intel 是 <code>qsv</code>、AMD 是 <code>amf</code>、Apple 是 <code>videotoolbox</code>。</li>
      <li>只硬编不硬解时，<strong>解码仍然在 CPU</strong>跑，整体并没有「全速」。</li>
      <li>最反直觉的一条：<code>-hwaccel</code> 只加速<strong>解码</strong>。它解出来的帧默认留在显存里，一旦后面接了滤镜或软编码器，帧得先「回拷」到系统内存，这次拷贝是有开销的，可能把硬解省下的时间又吃掉，于是出现「加了 <code>-hwaccel</code> 反而更慢」。</li>
    </ul>

    <h2>解码编码独立选路</h2>
    <p>
      不推翻「换个编码器」这一步，而是先把一件事想清楚：<strong>解码和编码是两段彼此独立的工作</strong>，各自都可以指定走 CPU 还是走 GPU，选法不同，收益天差地别。
    </p>
    <p>
      第一层先补「确认有什么可用」。不要猜，直接问工具：<code>ffmpeg -hwaccels</code> 列出可用的硬件解码后端；<code>ffmpeg -encoders | grep -E "nvenc|qsv|amf|videotoolbox"</code> 列出可用的硬件编码器；<code>ffmpeg -h encoder=h264_nvenc</code> 则能查出这个编码器到底支持哪些参数——这一步能帮你避开大半「参数抄错」的坑。
    </p>
    <p>
      第二层补「按平台选对编码器」。NVIDIA 上用 <code>h264_nvenc</code> / <code>hevc_nvenc</code>，Intel 核显上用 <code>h264_qsv</code> / <code>hevc_qsv</code>，Apple 设备上用 <code>h264_videotoolbox</code>，AMD 显卡上用 <code>h264_amf</code>。名字对不上，命令一定跑不动。
    </p>
    <p>
      第三层补「完整硬件链路」。想真正省掉回拷，就要让解码和编码都待在 GPU 上、中间不落地，例如 <code>-hwaccel qsv -c:v h264_qsv -i input.mp4 -c:v h264_qsv</code>。只有当整条链路都不需要把帧拷回内存时，硬解的收益才是净赚的；夹了软编或重滤镜，就该先测一下到底有没有变快。
    </p>
    <p>
      第四层补「画质不够怎么救」。硬编偏软不是没辙：提高目标码率，或者换成更慢的预设（如 <code>-preset p6</code>），画质改善通常很明显——用一点速度换回观感，值。
    </p>
    <p>
      最后，切换编码器前，用同一段素材分别跑一遍软编和硬编，比较<strong>耗时与文件体积</strong>，确认加速收益真实存在、质量也在可接受范围内，再把它固化成批量流程里的默认选项。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的细节：</strong><code>-gpu N</code> 只有 NVIDIA NVENC 支持，用于多 GPU 机器指定设备，Intel / AMD / Apple 没有这个参数；另外 <code>-hwaccel</code> 指定的后端要与编码器配套（如 <code>qsv</code> 配 <code>h264_qsv</code>），配错了不会报错，却白跑一趟。
    </div>

    <h2>编解码器检测对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「检测硬件 / NVENC / QSV」三个页签，先学会用命令确认本机到底支持哪些编解码器，再对照表格比较软编与各家硬编的速度和质量。</figcaption>
      <F18HardwareAccel />
    </figure>

    <h2>硬解硬编与画质取舍</h2>
    <p>
      硬件加速不是一个开关，而是「解码」和「编码」两段可以分别指定的选择。要净赚速度，就让整条链路都留在 GPU 上、别让帧回拷；画质不够时，提码率或换慢预设，比死磕更实际。
    </p>
    <div class="lesson-term">
      <span class="term-name">「硬件解码回拷」</span>指用 <code>-hwaccel</code> 在 GPU 上完成解码后，帧仍留在显存中，若后续要交给 CPU 滤镜或软件编码器，就必须把帧拷贝回系统内存。这次拷贝按帧发生且有开销，可能抵消硬解带来的收益——这也是「单独加 <code>-hwaccel</code> 有时反而更慢」的根源。边界：只有让解码、滤镜、编码整条链路都留在 GPU 上（或用 <code>-hwaccel_output_format</code> 控制帧格式），才能避免回拷。
    </div>
  </LessonArticle>
</template>
