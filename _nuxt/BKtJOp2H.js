const n=`<script setup lang="ts">
import F15Thumbnail from './F15Thumbnail.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你为了给一个长视频做目录页，用 <code>fps=1/60</code> 每 60 秒抽一帧，六十张缩略图里第一张是开场黑场、第五张正好卡在转场淡入的半黑画面——你盯着屏幕一张张挑代表帧，越挑越怀疑：有没有办法让 FFmpeg 自己挑出「最有代表性」的那一帧？
    </div>

    <h2>均匀覆盖与总览</h2>
    <p>
      缩略图其实承载着两种不同的诉求。一种是<strong>均匀覆盖</strong>：按时间等距抽一批图，让人一眼看清全片结构；另一种是<strong>一张总览</strong>：要么把若干帧拼成一张网格（Contact Sheet），要么做成悬停预览那样的「一张大图 + 索引」。它们看起来都是「抽帧」，实现方式却不一样。
    </p>
    <p>
      旧办法只能靠人：先<strong>均匀截一大堆 jpg</strong>，再<strong>逐张目检挑代表帧</strong>，最后还得用图像软件<strong>手动拼图</strong>做成总览。三个环节全压在人工上，长视频更是没法看——覆盖是否均匀全凭手感，代表帧挑到眼花，拼图的间距、行列还要一格格对。真正的问题是：<strong>怎样既均匀覆盖全片、又能自动挑出代表帧，还把结果拼成一张总览图？</strong>
    </p>

    <h2>等间隔抽帧写法</h2>
    <p>
      最直接的写法是用 <code>fps</code> 滤镜按固定间隔抽帧，配一个带序号的输出名：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf fps=1/60 thumbnail_%04d.jpg</code>
    </p>
    <p>
      这个方案做对了一件事：<strong>它把「覆盖全片」变成了一个可复现的采样过程</strong>——每 60 秒取一帧，长片短片都用同一套参数，还能直接塞进脚本批量跑，不再靠人一帧帧数。
    </p>

    <h2>纯色与黑场干扰</h2>
    <ul>
      <li>均匀采样<strong>撞上黑场、转场、纯色帧就毫无代表性</strong>。开场里第一张黑场、第五张半黑画面，正是「时间点踩对了、内容却没用」的典型结果。</li>
      <li>输出是一堆散落的 jpg，<strong>总览要另想办法</strong>。想看「全片长什么样」，还得自己把几十张图拼起来。</li>
      <li>用 <code>tile</code> 拼网格时，若<strong>帧数与行列数对不上</strong>，末行会留出空块或干脆填不满，得到的图右上角残缺。</li>
      <li>长视频按固定间隔抽帧，<strong>时间点并不均匀</strong>——比如片子中途有广告段或节奏差异时，靠一个固定间隔算出的时间点未必落在有意义的画面上。</li>
      <li>间隔设得太小，一个长视频能抽<strong>几百上千张</strong>，磁盘占用和后续处理量都失控。</li>
    </ul>

    <h2>网格总览图拼合</h2>
    <p>
      不推翻 <code>fps</code> 抽帧，而是先补上「<strong>把一堆图收成一张总览</strong>」这一层，这就是 <code>tile</code> 滤镜要做的事——它把连续的多帧按行列排成一张网格图。把 <code>fps</code>、<code>scale</code>、<code>tile</code> 串起来，最后只输出一帧：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "fps=1/60,scale=320:-1,tile=5x4" -vframes 1 thumbnail_sheet.jpg</code>
    </p>
    <p>
      读法是：每 60 秒取一帧、缩到宽 320、再排成 5 列 4 行共 20 张，最后 <code>-vframes 1</code> 只写出这一张拼好的总览图。<code>tile=5x4</code> 里的数字是「列 × 行」，行列一变，布局和适用片长也跟着变——短视频用 <code>4x3</code>，一小时的长片可以铺到 <code>8x6</code>。
    </p>
    <p>
      第二层，<strong>让选中的帧更有代表性</strong>。均匀采样会踩到黑场，那就换用专门的 <code>thumbnail</code> 滤镜：它把输入按每若干帧分一批，在每一批里<strong>挑出最能代表该批内容的一帧</strong>（依据帧的直方图特征判断），再交给后续滤镜：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "thumbnail=100,scale=320:-1,tile=5x4" -vframes 1 sheet.jpg</code>
    </p>
    <p>
      这里 <code>thumbnail=100</code> 表示每 100 帧里选一帧代表，它天然会绕开纯黑或纯色的过渡帧，比死按时间点采样更能挑到「有内容」的画面。
    </p>
    <p>
      第三层，<strong>把总览扩展到「悬停预览」</strong>。要做到类似 YouTube 那样鼠标滑过显示缩略图，需要的不止一张拼图，而是<strong>一张雪碧图（Sprite）配一份 WebVTT 索引</strong>：雪碧图把许多缩略图合并成一张大图，WebVTT 再用 <code>#xywh</code> 坐标告诉播放器「哪个时间段该切大图的哪一块」。大致是三步：
    </p>
    <ol class="lesson-steps">
      <li>按间隔抽出缩略图，例如 <code>fps=1/10</code> 配 <code>%04d</code> 命名。</li>
      <li>把缩略图合并为一张雪碧图（可用 ImageMagick 或脚本完成）。</li>
      <li>生成 WebVTT 索引，为每个时间段写入形如 <code>/sprite.jpg#xywh=320,0,320,180</code> 的坐标。</li>
      <li>在网页里用 <code>&lt;video&gt;</code> 配合 <code>&lt;track&gt;</code> 加载这份 WebVTT，实现悬停预览。</li>
    </ol>
    <p>
      最后，别忘了<strong>先算间隔再抽帧</strong>：从 <code>ffprobe</code> 拿到总时长，除以你想要的张数，让时间点真正均匀铺满全片，而不是随手拍一个间隔。
    </p>
    <div class="lesson-box warn">
      <strong>两个容易忽略的边界：</strong>一是 <code>tile=5x4</code> 是「列 × 行」共 20 格，<strong>抽帧数量要对得上行列</strong>，否则末行会出现空块或拼不满；二是均匀 <code>fps</code> 采样不保证内容有意义，踩黑场或转场时改用 <code>thumbnail</code> 滤镜挑代表帧更稳妥。长视频先按时长算好间隔，别一次抽出几百张图占满磁盘。
    </div>

    <h2>联系表拼合流程</h2>
    <figure class="lesson-figure">
      <figcaption>「批量截图」页签给出 <code>fps</code> 与 <code>select</code> 两种抽帧节奏和限制张数的写法；「缩略图网格」页签演示 <code>fps + scale + tile</code> 拼成联系表，并列出 4x3、5x4、8x6、10x1 等常用布局各自适合的片长；「雪碧图」页签则把「抽帧、合并成雪碧图、生成 WebVTT 索引」三步和一份 WebVTT 示例摆出来。</figcaption>
      <F15Thumbnail />
    </figure>

    <h2>按用途选滤镜</h2>
    <p>
      做缩略图先分清目的：只要均匀覆盖，就用 <code>fps</code> 按间隔抽帧并配 <code>%04d</code>；想一眼看全片，就用 <code>tile</code> 把帧拼成一张网格总览；担心均匀采样踩到黑场，就改用 <code>thumbnail</code> 滤镜让它<strong>自动挑代表帧</strong>；要做悬停预览，则把缩略图汇成一张雪碧图再补一份 WebVTT 索引。无论哪种，都先按时长算好间隔、让张数与行列对得上。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Contact Sheet（缩略图网格）」</span>源自暗房时代把一整卷胶片印在一张相纸上的「联系表」，在视频里指<strong>把多个时间点的帧按行列排列在同一张图上</strong>，用 <code>tile</code> 滤镜配合 <code>fps</code>、<code>scale</code> 一次生成，常用于快速浏览长视频。它与单张缩略图的区别在于「多帧同图」，与雪碧图的区别在于<strong>不附带 WebVTT 索引</strong>——雪碧图要靠 <code>#xywh</code> 坐标按需切图才能做悬停预览。边界与例外：<code>tile=列x行</code> 的格数要与抽帧数量匹配，否则末行会空块；均匀采样可能选中黑场或转场帧，需要代表帧时应改用 <code>thumbnail</code> 滤镜。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
