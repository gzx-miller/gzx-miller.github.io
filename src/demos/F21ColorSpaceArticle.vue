<script setup lang="ts">
import F21ColorSpace from './F21ColorSpace.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一份 MP4，你在本机播放器里看肤色正常，发给同事或传到手机上一播，画面却发灰、饱和度掉了一截——文件一个字节都没改，颜色怎么说变就变？
    </div>

    <h2>亮度色度分离存储</h2>
    <p>
      你以为视频里的颜色就是一堆 RGB 像素。实际上，为了省带宽，视频把颜色拆成<strong>亮度</strong>和<strong>色度</strong>两路来存，并且只记录「相对于某个基准」的数值。这就留下一个必须回答的问题：<strong>这套数值该以什么标准解释，才能还原成正确的颜色？</strong>
    </p>
    <p>
      旧办法很朴素：自己拿眼睛校色，调对比度、拉饱和度，导出一个「看着对」的版本。代价却全压在你身上——换台设备、换个平台就未必还对；目标平台只认某种像素格式，你还得为它单独导一份；渐变天空一出现色带，也只能靠加噪点之类的土办法掩饰。真正欠着的，是把「颜色怎么存」和「颜色怎么被解释」这两件事说清楚。
    </p>

    <h2>编码器默认参数</h2>
    <p>
      最省事的做法：参数一个都不加，让 FFmpeg 用编码器的默认值，例如 <code>ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4</code>。
    </p>
    <p>
      这个方案做对了一件事：<strong>默认值是为「最多播放器能正常播」挑的</strong>。libx264 默认输出 <code>yuv420p</code>——那是 4:2:0 色度抽样、8 位色深的像素格式，几乎所有播放器、平台和剪辑软件都认。你本机播放正常，就是因为它恰好按这套默认规则解释了数据。
    </p>

    <h2>色彩标记三处空缺</h2>
    <ul>
      <li>那三个「告诉播放器怎么解释」的标记——<code>color_primaries</code>、<code>color_trc</code>、<code>colorspace</code>——常常是<strong>空的</strong>。此时播放器只能按自己的默认值（多半是更老的 BT.601）来猜；而高清内容本该按 BT.709 解释，猜错就整体发灰、偏色，正是开场那一幕。</li>
      <li><code>yuv420p</code> 的色度只有亮度的四分之一分辨率。做绿幕抠像、给红蓝文字描边这类需要精细色度的活儿，边缘会出现混色与色度溢出，颜色糊成一团。</li>
      <li>改成 <code>yuv444p</code>（不做色度抽样）能保住色度精度，可很多播放器与视频平台<strong>不认 444</strong>，上传后要么被转码要么直接黑屏。</li>
      <li>8 位色深最怕天空、烟雾、暗部这类渐变——量化台阶肉眼可见，形成一条条色带。</li>
      <li>HDR 素材更极端：它用感知量化（PQ）这类传输函数编码，若直接当 SDR 处理，高光会过曝、颜色整体漂移，而不是「稍微不对」。</li>
    </ul>

    <h2>标记读取与核对</h2>
    <p>
      不推翻默认值，而是补上缺失的信息。第一件事先别看命令——<strong>先把现状读出来</strong>：
    </p>
    <ol class="lesson-steps">
      <li>用 <code>ffprobe -v error -select_streams v:0 -show_entries stream=color_space,color_transfer,color_primaries -of default=noprint_wrappers=1 input.mp4</code>，看这三个标记有没有值、各是什么。</li>
      <li>同时看 <code>pix_fmt</code> 字段，确认它到底是 <code>yuv420p</code> 还是别的。</li>
      <li>依据内容定目标：普通交付守 <code>yuv420p</code>，需要色度精度的中间素材用 <code>yuv444p</code>，有渐变色带的用 10 位。</li>
      <li>写完之后，用同一条 <code>ffprobe</code> 命令核对输出，标记与格式都对了才收工。</li>
    </ol>
    <p>
      第二层补「像素格式」。<code>-pix_fmt</code> 决定颜色怎么编码进码流：<code>yuv420p</code> 是 4:2:0 色度抽样加 8 位，兼容性最好；<code>yuv444p</code> 不做色度抽样，色度精度最高，但兼容性差；<code>yuv420p10le</code> 是 4:2:0 加 10 位色深，能显著减少渐变色带。<strong>10 位需要编码器支持</strong>（如 <code>libx265</code>），而且它只是「更细的台阶」，并不会自动把 SDR 内容变成 HDR。
    </p>
    <p>
      第三层，也是最容易被混淆的一层：把<strong>「标记」和「转换」分开</strong>。标记只是改写元数据，告诉播放器「这些数值本来就该按 BT.709 解释」，一个像素都不动——
      <code>ffmpeg -i input.mp4 -color_primaries bt709 -color_trc bt709 -colorspace 1 -c:v libx264 output.mp4</code>，其中 <code>-colorspace 1</code> 就是矩阵系数 BT.709 的编号（BT.2020 是 <code>9</code>）。内容本来就是 709，只是没标，补标就能修好开场的偏色。
    </p>
    <p>
      可如果内容<strong>真的是</strong>另一套色彩空间，光打标记就等于撒谎，必须真转换。这时用 <code>colorspace</code> 或 <code>zscale</code> 滤镜，把源和目标都写清楚：<code>-vf "colorspace=all=bt709:range=tv:ispace=bt601:irange=tv"</code>。这里 <code>all</code> 是输出目标，一次性设定输出的原色、传输函数与矩阵；<code>ispace</code>、<code>irange</code> 则是对<strong>输入</strong>的假设——换句话说，输入是 601 这件事必须你来告诉滤镜。另外 <code>range</code> 还要区分有限范围（TV）与全范围（PC），选错了会整体压暗或发白。
    </p>
    <p>
      第四层补 HDR 与 SDR 的互转。二者不只是色域宽窄的差别，还差着<strong>传输函数</strong>：HDR10 用 PQ（<code>smpte2084</code>），广播 HDR 用 HLG。把 HDR 硬压成 SDR，必须做<strong>色调映射</strong>，把高动态范围重新映射进 SDR 的亮度窗口，例如 <code>-vf "zscale=t=linear:npl=203,zscale=p=bt709:tonemap=clip,zscale=m=bt709:r=tv,format=yuv420p"</code>，其中 <code>tonemap</code> 是关键一步。反过来，SDR 转 HDR 只是给画面贴了 HDR 的标签，并不会凭空多出亮度层次，观感往往还不如原样交付。
    </p>
    <div class="lesson-box warn">
      <strong>两个高频误区：</strong>把「打标记」当成「转换」——内容没变却贴上 <code>bt2020</code>、<code>smpte2084</code> 的标记，播放器会按错误假设渲染，颜色反而更糟；以及把 <code>yuv444p</code> 当作「更高级所以更好」——它色度精度确实高，但大量播放器与平台不收，交付前务必先确认目标环境能不能播。
    </div>
    <p>
      还有两个细节值得记住：色深的台阶是「精度」而不是「动态范围」，8 位与 10 位能表示同一组颜色，只是 10 位更细；而 HDR10 用的是静态元数据（MaxCLL、MaxFALL），HDR10+ 与 Dolby Vision 用的是会逐帧变化的动态元数据，处理方式并不通用。
    </p>

    <h2>概念与转换对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「基础概念 / HDR 处理 / 色彩转换」三个页签：先在基础概念里对照色彩空间与色深两张表，再到后面两个页签读命令，体会「改标记」和「真转换」是两回事。</figcaption>
      <F21ColorSpace />
    </figure>

    <h2>像素格式与色彩标记</h2>
    <p>
      颜色能不能还原，取决于两件事都被交代清楚：像素用什么格式编码（<code>-pix_fmt</code>，4:2:0 保兼容、4:4:4 保精度、10 位防色带），以及内容该按哪套色彩空间解释（<code>-color_primaries</code> 等三个标记）。标记只是声明，改标记不改变像素；真要换色彩空间得靠 <code>colorspace</code> / <code>zscale</code> 转换，HDR 与 SDR 之间还必须过一遍色调映射。
    </p>
    <div class="lesson-term">
      <span class="term-name">「色度抽样」</span>指人眼对亮度远比色度敏感，于是视频对色度通道降采样存储以省带宽：<code>yuv420p</code> 的 4:2:0 让色度在横竖两个方向都只保留一半，色度数据量只有亮度的四分之一；<code>yuv444p</code> 则不抽样，色度与亮度同样精细。边界：4:2:0 几乎处处兼容，但在高饱和红蓝边缘与精细合成处会出现混色；4:4:4 精度高却不被多数播放器与平台接受，通常只用于中间处理环节。
    </div>
  </LessonArticle>
</template>
