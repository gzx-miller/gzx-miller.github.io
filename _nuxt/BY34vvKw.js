const n=`<script setup lang="ts">
import F02FormatConversion from './F02FormatConversion.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你把一个两分钟的 4K MP4 换成 MKV 容器，已经做好等十分钟的准备，结果命令两秒就结束了，画质放大看也毫无差别——凭什么这么快？
    </div>

    <h2>转格式三重含义</h2>
    <p>
      「转格式」其实是三件被混在一起的事：换成别的容器、换成别的编解码器、以及为了让老设备能放而调整参数。它们看起来都叫「转一下」，成本却差着几个数量级——只换外壳可以两三秒完成，动到编码就得按分钟算，而且有损。
    </p>
    <p>
      如果你把这三件事当成同一个动作，代价是隐形的：明明只想换盒子，却把每条流都重编一遍，慢得离谱还白白损失画质；反过来，明明必须重编，却以为加个参数就行，结果报错。落到一个问句上：<strong>同样是「转格式」，什么时候只是换个盒子，什么时候必须把内容推倒重做？</strong>
    </p>

    <h2>默认编码器行为</h2>
    <p>
      最省事的写法是不指定任何编码：<code>ffmpeg -i input.mp4 output.mkv</code>。
    </p>
    <p>
      它做对了一件事：<strong>总能给你一个能播的文件</strong>。因为不指定编码时 FFmpeg 会走默认编码器，把每条流都重新编一遍，兼容性最稳。当你不管质量、只想「先拿到一个能用文件」时，这个方案是够用的。
    </p>

    <h2>全流重编码开销</h2>
    <ul>
      <li>只是想把 MP4 换成 MKV 这种「换盒子」的活，它却把 4K 的每条流都重编，十分钟起步，画质还降了一档。</li>
      <li>默认编码器的选择不透明，你既不知道它挑了什么，也控制不了输出体积——同一个源可能一会儿暴涨、一会儿暴跌。</li>
      <li>源里有两条音轨和一条字幕时，这套默认映射可能只留下一条，其余在输出里消失。</li>
      <li>反过来，当源编码其实与目标容器并不兼容时，不报错的假象会让你以为成功了，实际文件放不出来。</li>
    </ul>

    <h2>转封装与转码</h2>
    <p>
      不推翻它，而是先把「换盒子」和「换内容」拆成两种确定的动作。
    </p>
    <p>
      第一种叫<strong>转封装</strong>（Remuxing），用 <code>-c copy</code>：<code>ffmpeg -i input.mp4 -c copy output.mkv</code>。<code>copy</code> 的意思是「原样搬运」——FFmpeg 只把原来的压缩数据包按新容器重新封装，既不解码也不编码。所以它速度极快，而且<strong>速度几乎不随编码复杂度变化</strong>（4K 和 720p 都是几秒），画质无损，多音轨、字幕也一并保留。开场那个两秒完成的转换，走的就是这条路。
    </p>
    <p>
      第二种叫<strong>转码</strong>（Transcoding），不写 <code>copy</code>、或者显式指定编码器，比如 <code>-c:v libx264 -c:a aac</code>：它把数据解码再重新编码，可以换任意编码、调分辨率与码率，代价是耗时且有损。只有当你需要换编码、或目标容器不支持源编码时，才必须走它。
    </p>
    <p>
      那么什么时候不能 <code>copy</code>？这取决于「容器兼容矩阵」。每个容器能装的编码是有限的：MP4 对音频编码的兼容性就有限，例如 FLAC 无损音频在 MP4 里不被广泛支持，这时要么换用 MKV 容器，要么把音频转成 AAC。当容器不支持源编码时，<code>-c copy</code> 会<strong>直接报错</strong>，而不是默默产出坏文件。所以判断的口诀是：<strong>不确定就先试 <code>-c copy</code>，报错再改成转码</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>两个边界要记住：</strong><code>-c copy</code> 搭配 <code>-ss</code> 裁剪时，定位依赖关键帧、并不精确，需要精确裁剪就得重新编码；另外，<code>-c copy</code> 只搬运数据包却不动参数，所以它<strong>无法</strong>顺带调整分辨率或码率——真要动这些，必须转码。
    </div>

    <h2>两套命令对照</h2>
    <figure class="lesson-figure">
      <figcaption>切「转换示例 / 转封装 / 转码」三个页签，在命令生成器里改源格式、目标格式与是否转封装，观察命令在 <code>-c copy</code> 和 <code>-c:v libx264</code> 之间怎么切换。</figcaption>
      <F02FormatConversion />
    </figure>

    <h2>无损与有损取舍</h2>
    <p>
      「转格式」要先分清是换盒子还是换内容：<code>-c copy</code> 只重新封装，快而无损但受容器兼容性约束；不写 <code>copy</code> 就会重编码，慢而有损却能换任意编码、调任意参数。不确定就先试 copy，报错再转码。
    </p>
    <div class="lesson-term">
      <span class="term-name">「转封装」</span>指用 <code>-c copy</code> 把原始压缩数据包按新容器重新封装、不做解码与编码的操作，因此速度极快、画质无损，并保留全部流。边界与例外：它要求目标容器支持源流的编码格式，不支持时会直接报错；它也不能顺带修改分辨率、码率等参数，且配合 <code>-ss</code> 时定位依赖关键帧、并不精确。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
