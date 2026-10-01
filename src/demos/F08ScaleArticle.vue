<script setup lang="ts">
import F08Scale from './F08Scale.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一段 480p 老素材，要放大到 1080p，你分别用 <code>flags=neighbor</code>、<code>flags=bilinear</code>、<code>flags=lanczos</code> 各导一版。目标分辨率一模一样，可 neighbor 那版人脸像马赛克方块，bilinear 那版糊成一团，lanczos 那版却明显更锐利。输出尺寸完全相同，画面凭什么差这么多？
    </div>

    <h2>新像素插值填充</h2>
    <p>
      缩放要回答的是一个很具体的问题：把一张小图铺成一张大图时，<strong>那些原本不存在的、夹在原像素之间的新像素，该填什么颜色？</strong>大图里绝大多数像素都不是原图里本来就有的，它们全靠「猜」，而怎么猜，就是缩放算法的全部内容。
    </p>
    <p>
      旧办法是把这件事交给播放器：媒体文件保持原尺寸，让播放窗口自己拉伸。它有两个必须由人承担的隐藏成本：<strong>一是算法不可选</strong>，播放器通常只用最省 CPU 的双线性，放大出来天然发软，你没法换成更锐的算法；<strong>二是无法批处理</strong>，视频有一百个、还要顺手做别的处理时，你没地方插进去，也留不下可复现的参数。
    </p>
    <p>
      所以真正的问题是：<strong>当画面被重新采样时，「缺失的像素」由谁来定、按什么规则定？而缩放又往往只是流水线上的一步，多步处理怎样串成一条可控的链条？</strong>
    </p>

    <h2>目标尺寸直接指定</h2>
    <p>
      最直接的写法是指定目标宽高：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf scale=1920:1080 output.mp4</code>
    </p>
    <p>
      它做对了一件事：<strong>能把画面拉到任意目标尺寸，并且这件事是可脚本化的</strong>。你写下的 1920×1080 就是最终成片的尺寸，一万个文件都能用同一行命令跑，结果一致。
    </p>

    <h2>双线性插值偏软</h2>
    <ul>
      <li>它用的是<strong>默认插值算法（bilinear）</strong>，放大时会把锐利的边缘摊平，越放大越软——这正是开场里那版「糊成一团」的来源。</li>
      <li>它<strong>只管尺寸，不管比例</strong>：源是 4:3、目标是 16:9 时，画面会被直接拉伸，人脸变胖、logo 变扁，而你并不知道该在哪里补上「保持比例」这一步。</li>
      <li>它<strong>不关心位深和色彩空间</strong>：把 10-bit 或 HDR 素材直接一缩，输出可能落回 8-bit 或丢掉色彩元数据，播放器按错的方式解析，画面发灰。</li>
      <li>真实需求往往不止一步——「先裁掉黑边，再等比缩到 720p，再补边到目标画布」——单个 <code>scale</code> 摆不平，你还得知道怎么把这些动作<strong>接成一条链</strong>。</li>
    </ul>

    <h2>滤镜图串联顺序</h2>
    <p>
      不推翻 <code>scale</code>，而是先补上「多步怎么串」这一层，因为它决定了后面每一个参数的落点。FFmpeg 把一串滤镜连成的处理链叫<strong>滤镜图（filtergraph）</strong>，在 <code>-vf</code> 里用逗号分隔，<strong>前一个滤镜的输出就是后一个的输入</strong>，像水管一样依次流过：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "crop=1920:800:0:140,scale=1280:720" output.mp4</code>
    </p>
    <p>
      这里先裁后缩，顺序不能反——反了就是在更小的画面上裁，结果完全不同。链条也可以给两端起名字，用方括号标出输入输出，这在后面接多路输入时会派上用场：<code>[in]scale=1280:720[out]</code>。理解「滤镜图是一条有方向的链」，你就知道每个滤镜该插在哪一步、参数作用在多大的画面上。
    </p>
    <p>
      链条理顺之后，回到缩放本身，就要挑<strong>插值算法</strong>了。算法通过 <code>flags</code> 指定，它们其实是同一条权衡曲线上的不同档位：
    </p>
    <ol class="lesson-steps">
      <li><code>bilinear</code>：默认，速度最快，放大时最软。</li>
      <li><code>bicubic</code>：质量与速度平衡，是日常缩放的稳妥选择。</li>
      <li><code>lanczos</code>：放大画质最好，锐度高，代价是慢，且在强对比边缘可能有轻微振铃。</li>
      <li><code>neighbor</code>：最近邻，几乎不「猜」，直接把最近的像素复制过去，放大后是硬邦邦的方块——它恰好是像素风游戏最想要的锐利，却是实拍画面的灾难。</li>
      <li><code>spline</code>：样条插值，画质接近 lanczos，是另一条可选路径。</li>
    </ol>
    <p>
      选法的规律很简单：<strong>放大用 <code>lanczos</code> 或 <code>bicubic</code>，缩小用哪个差异都不明显</strong>（缩小本身就在丢信息，算法区分度小），像素艺术用 <code>neighbor</code>。想切身感受差别，就用同一段素材跑一遍对比：
    </p>
    <p>
      <code>ffmpeg -i input_480p.mp4 -vf "scale=1920:1080:flags=lanczos" lanczos.mp4</code>
    </p>
    <p>
      接着补上「不拉伸」这一层。想让画面保持原始比例、只缩不放，有两种写法：把其中一维写成 <code>-2</code>，让 FFmpeg 按比例算出另一维并取偶，例如 <code>scale=1280:-2</code>；或者用 <code>force_original_aspect_ratio</code> 显式约束：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" output.mp4</code>
    </p>
    <p>
      最后是<strong>位深与色彩</strong>这一层。有一条容易想当然的边界必须说清：<strong><code>scale</code> 本身不做色彩空间转换</strong>。它的 <code>out_color_matrix</code> / <code>out_range</code> 只是把「这段画面是 bt2020、是 tv 范围」的标记改掉，不会真的把颜色换算过去。所以处理 10-bit 或 HDR 素材时，保持位深靠输出端 <code>-pix_fmt yuv420p10le</code>，而真正的色彩转换要交给 <code>colorspace</code> 或 <code>zscale</code> 滤镜：
    </p>
    <p>
      <code>ffmpeg -i input_hdr.mp4 -vf "zscale=w=1920:h=1080:f=lanczos:m=bt2020:p=bt2020:r=tv,format=yuv420p10le" output.mp4</code>
    </p>
    <p>
      注意 <code>zscale</code> 是基于 zimg 库的另一套滤镜，参数名和 <code>scale</code> 不一样——缩放算法写 <code>f=</code>、矩阵写 <code>m=</code>、原色写 <code>p=</code>、范围写 <code>r=</code>，不能把 <code>scale</code> 的写法照搬过来。
    </p>
    <div class="lesson-box warn">
      <strong>两条最容易踩的边界：</strong><code>scale</code> 的 <code>out_color_matrix</code> / <code>out_range</code> <strong>只改写标记、不做换算</strong>，指望用它完成 HDR 到 SDR 的转换只会得到颜色错乱的结果，真正转换用 <code>colorspace</code> 或 <code>zscale</code>；HDR 素材缩放后一定要用 <code>ffprobe</code> 复查 <code>color_space</code> 与位深标记，元数据一旦缺失，播放器就会按 SDR 解析，画面整片发灰。
    </div>

    <h2>六种插值算法对照</h2>
    <figure class="lesson-figure">
      <figcaption>在「缩放算法」页签里对照六种算法（bilinear / bicubic / lanczos / spline / neighbor / gaussian）的速度、质量与适用场景，再用下面的对比命令亲自跑一遍 480p 放大到 1080p；「HDR 缩放」与「高级用法」两个页签则展示保持位深、指定色彩空间以及 <code>force_original_aspect_ratio</code> 的写法。</figcaption>
      <F08Scale />
    </figure>

    <h2>插值算法选型</h2>
    <p>
      缩放真正要决定的，是「新像素按什么规则猜出来」。把滤镜图理解成一条有方向的链，先想清楚是哪一步在做缩放、作用在多大的画面上；再按用途挑插值算法——放大用 <code>lanczos</code> / <code>bicubic</code>，缩小随便，像素风用 <code>neighbor</code>；最后记住 <code>scale</code> 只管尺寸、不改色彩，位深和 HDR 得用 <code>-pix_fmt</code> 与 <code>zscale</code> 另外照料。
    </p>
    <div class="lesson-term">
      <span class="term-name">「插值算法（flags）」</span>指 <code>scale</code> 在重采样新像素时采用的数学规则，由 <code>flags</code> 指定：<code>bilinear</code>（默认，最快最软）、<code>bicubic</code>（质量速度平衡）、<code>lanczos</code>（放大画质最好）、<code>spline</code>（接近 lanczos）、<code>neighbor</code>（最近邻，保留硬边，适合像素艺术）、<code>gaussian</code>（模糊效果）。边界与例外：<strong>放大时算法差异明显、缩小时几乎无差别</strong>；<code>neighbor</code> 对实拍画面是灾难、对像素画是优点；<code>flags</code> 只影响像素如何插值，<strong>不负责色彩空间转换</strong>，HDR/10-bit 要另配 <code>-pix_fmt</code> 或 <code>zscale</code>。
    </div>
  </LessonArticle>
</template>
