const n=`<script setup lang="ts">
import F05Bitrate from './F05Bitrate.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个源文件，用 <code>-crf 18</code> 和 <code>-crf 28</code> 各导一遍，画面上几乎分不出差别，文件大小却差了一大截。<code>crf</code> 这个既不是分辨率、也不是码率的数字，到底在控制什么？为什么不直接填一个目标码率？
    </div>

    <h2>画质体积与码率</h2>
    <p>
      导出视频时，真正被权衡的其实只有三样东西：<strong>画质、体积、码率</strong>。码率指每秒用多少比特来存储画面，码率越高画质越好、文件也越大。听起来只要「想要什么画质就填多少码率」就够了，但码率并不是一个能直接填准的旋钮。
    </p>
    <p>
      原因在于<strong>画面复杂度是变化的</strong>：一段静止的风景每秒可能几百 Kbps 就够了，紧接的爆炸镜头同一秒却需要好几 Mbps。如果写死一个码率，简单的场景会把多余的比特浪费掉，复杂的场景又不够用、出现块状模糊。所以真正的问题是：<strong>怎么在有限的存储空间和带宽下，选对码率策略，让画质稳定又可控？</strong>
    </p>

    <h2>指定目标平均码率</h2>
    <p>
      最直接的写法是指定一个目标平均码率，用 <code>-b:v</code>（<code>b</code> 是 bitrate，<code>v</code> 指视频）：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -c:v libx264 -b:v 2M output.mp4</code>
    </p>
    <p>
      它做对了一件事：<strong>结果可预期</strong>。你大概知道输出会有多大、需要多大带宽，这对「文件必须塞进某个上限」的场景很实用。
    </p>

    <h2>恒定码率固有缺陷</h2>
    <ul>
      <li>它把简单和复杂场景一视同仁，简单处浪费比特、复杂处又不够，画质在片段之间忽好忽坏。</li>
      <li>它只是「平均」达到目标，实际码率会上下波动，遇到高复杂度瞬间出现峰值，弱网下容易卡顿。</li>
      <li>它回答不了「我要固定的画质」这个问题——你填的是比特数，而不是你想要的好看程度。</li>
      <li>单遍的码率控制对文件大小只是「大致」命中，想精确卡到某个体积往往还差一截。</li>
    </ul>

    <h2>CRF质量导向编码</h2>
    <p>
      不推翻它，而是先换一个<strong>以质量为档位的旋钮</strong>——CRF（恒定速率因子）。用 <code>-crf</code> 指定一个质量等级，编码器会按画面复杂度自动分配码率：复杂处多给、简单处少给，最终整段的<strong>感知画质保持一致</strong>，而不是码率保持一致。
    </p>
    <p>
      对 x264/x265，CRF 的取值范围是 <code>0-51</code>，默认 <code>23</code>，<strong>值越小质量越高、文件越大</strong>。日常常用的区间是 <code>18-28</code>：<code>18</code> 接近视觉无损，<code>23</code> 是默认值，<code>28</code> 是仍可接受、体积更小的折中。想更省体积可以换成 H.265，同等画质文件更小，代价是它默认 CRF 为 <code>28</code> 且转码更慢。
    </p>
    <p>
      CRF 有一个副作用：遇到复杂场景它会让码率飙得很高。如果既要 CRF 的质量、又不想让峰值失控（比如给网络播放用），就叠加一个<strong>峰值上限</strong>，用 <code>-maxrate</code> 限定最大码率、<code>-bufsize</code> 给一个缓冲窗口：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -c:v libx264 -crf 23 -maxrate 3M -bufsize 6M output.mp4</code>
    </p>
    <p>
      再往下走，会遇到两类明确要求「码率必须稳定」的场景。真正常见的做法有两种：
    </p>
    <ol class="lesson-steps">
      <li><strong>CBR（恒定码率）</strong>：把目标、上限、下限都钉死在同一个值上，用 <code>-b:v 3M -maxrate 3M -minrate 3M -bufsize 6M</code>。码率被强制恒定，最适合直播推流这类带宽固定、不能容忍波动的传输。</li>
      <li><strong>VBR（可变码率）</strong>：只指定目标平均码率与峰值，用 <code>-b:v 2M -maxrate 3M -bufsize 4M</code>，让码率在区间内浮动，在质量与体积之间取得平衡。</li>
    </ol>
    <p>
      如果对文件大小要求很精确，还可以用<strong>两遍编码</strong>：先扫一遍分析复杂度，再编一遍分配码率，落在目标体积上会更准。而确定参数之前，稳妥的做法是先剪<strong>10 秒有代表性的样片</strong>分别试几个 CRF，比过画质与体积再定最终值。
    </p>
    <div class="lesson-box warn">
      <strong>三条容易踩的边界：</strong><code>-crf</code> 只作用于视频，音频要另外用 <code>-b:a</code> 控制，否则音频体积不受影响；码率不是越高越好，超过源本身的信息量只是白白撑大文件；动画内容的画面比实拍更「平坦」，通常用更低的码率就能达到同等观感。
    </div>

    <h2>三种模式对照</h2>
    <figure class="lesson-figure">
      <figcaption>切「CRF / CBR / VBR」三个页签，对比各自的命令示例与参数含义，再对照下方「视频码率参考指南」，按目标分辨率和用途挑一组起始值。</figcaption>
      <F05Bitrate />
    </figure>

    <h2>质量恒定与码率上限</h2>
    <p>
      码率控制的核心是「让固定的量是质量还是码率」。要画质稳定、体积随内容浮动，用 CRF（常用 <code>18-28</code>，越小越好）；担心峰值太高就加 <code>-maxrate</code> 与 <code>-bufsize</code>；要码率恒定适配直播就用 CBR；想在两者之间平衡就用 VBR。归档前先用样片对比，再定参数。
    </p>
    <div class="lesson-term">
      <span class="term-name">「CRF（恒定速率因子）」</span>是 x264/x265 的一种码率控制模式：不指定码率，而是指定一个质量档位，让编码器按画面复杂度自动决定每个瞬间用多少比特，从而让整段的感知画质保持一致。取值范围 <code>0-51</code>，默认 <code>23</code>，值越小质量越高、文件越大，常用区间为 <code>18-28</code>。边界与例外：CRF 只影响视频，音频需另用 <code>-b:a</code> 控制；它会让复杂场景码率飙升，需要配合 <code>-maxrate</code>/<code>-bufsize</code> 限峰；不同编码器的编号不通用（H.265 默认 <code>28</code>），跨编码器不能直接照搬同一个数值。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
