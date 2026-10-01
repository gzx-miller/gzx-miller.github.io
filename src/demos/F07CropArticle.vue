<script setup lang="ts">
import F07Crop from './F07Crop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一段 1080p 视频上方压着 60 像素黑边，你写下 <code>crop=1920:960:0:60</code>，一跑果然裁得干干净净。可当你想把这行参数复用到另一段素材上——不是偏了几十像素、黑边还留一条，就是编码器直接报错说尺寸不能被 2 整除。同一个「去掉黑边」的诉求，参数为什么不能通用？
    </div>

    <h2>矩形区域的提取</h2>
    <p>
      裁剪要干的是一件很朴素的事：从画面里<strong>取出一块矩形</strong>。拿掉多余的黑边、把注意力收进某个角落、或者把横屏画面切出中间的竖屏区域，「裁剪」都是它们的共同动作。
    </p>
    <p>
      旧办法是让人来框选：打开剪辑软件、拖动四条边、导出。它有两个必须由人扛的隐藏成本：<strong>一是不可脚本化</strong>，今天框一次，明天换一批素材还得再框一遍，无法批量；<strong>二是口径不一致</strong>，黑边到底从第几像素开始，全凭眼睛估，两段素材、两个人做，结果就对不齐。所以真正的问题是：<strong>怎样用一组可以计算、可以复用的参数，精确地切出任意一块区域，并且保证结果符合编码器的尺寸要求？</strong>
    </p>

    <h2>固定四参数写法</h2>
    <p>
      最直接的写法是把四个数字写死，这就是 <code>crop</code> 滤镜的基本语法：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf crop=1280:720:0:0 output.mp4</code>
    </p>
    <p>
      四个参数依次是 <code>w:h:x:y</code>：<strong>输出宽、输出高、以及裁剪起点相对于原始画面左上角的坐标</strong>。它做对了一件事：位置和尺寸都被明确写了出来，没有歧义，一眼就能看懂你在切哪一块。对一段尺寸固定、黑边已知的素材，这一行永远有效。
    </p>

    <h2>源尺寸变化失准</h2>
    <ul>
      <li>一旦<strong>源尺寸变了</strong>，写死的数字立刻失效：源是 3840×2160，同样的 <code>1280:720:0:0</code> 只取到了左上角一小块，而不是你想要的等比区域。</li>
      <li><strong>黑边尺寸不是整数</strong>时手填的坐标会偏：真实黑边是 62 像素，你按整数写了 <code>y=60</code>，结果顶端留下 2 像素的一条黑边，怎么放大都看得见。</li>
      <li><strong>偶数对齐</strong>是个硬要求：如果源高度是 1081，写 <code>ih-120</code> 得到 961，是奇数——很多编码器的色度采样要求宽高能被 2 整除，轻则报警告、重则直接失败，勉强编出来两侧还会有条纹。</li>
      <li>想切一个<strong>居中的竖屏或方形</strong>区域时，起点得自己拿计算器算，算错一个括号就整体偏移，而且换一段素材又要重算。</li>
    </ul>

    <h2>表达式参数计算</h2>
    <p>
      不推翻「写参数」这件事，而是让参数<strong>自己算</strong>——<code>crop</code> 的 <code>w/h/x/y</code> 都支持表达式，可以直接引用当前画面的尺寸变量：<code>in_w</code> / <code>in_h</code> 是输入宽高，<code>iw</code> / <code>ih</code> 是它们的简写，<code>out_w</code> / <code>ow</code> 是输出（裁剪后）的宽。
    </p>
    <p>
      用这些变量，居中裁剪就不用再手算坐标了。比如裁一个居中的 9:16 竖屏：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf crop=ih*9/16:ih:(in_w-ih*9/16)/2:0 output.mp4</code>
    </p>
    <p>
      这里高度保留原始 <code>ih</code>，宽度按竖屏比例算成 <code>ih*9/16</code>，<code>x</code> 用 <code>(in_w - 裁剪宽)/2</code> 把画面推到水平正中。换成方形就是 <code>crop=ih:ih:(in_w-ih)/2:0</code>，逻辑完全一样。<strong>表达式让「居中」这件事跟源尺寸解耦了</strong>：无论素材多宽多高，居中永远是居中的。
    </p>
    <p>
      去黑边也是同理。假如你确认上下各有 60 像素黑边，可以写成：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf crop=iw:ih-120:0:60 output.mp4</code>
    </p>
    <p>
      宽度不动（<code>iw</code>），高度砍掉 <code>120</code>，起点下移 <code>60</code>。可是「上下各 60」这个前提靠肉眼并不可靠，所以更稳妥的做法是<strong>先让工具自己量</strong>——用 <code>cropdetect</code> 扫一遍：
    </p>
    <ol class="lesson-steps">
      <li>先探测：<code>ffmpeg -i input.mp4 -vf cropdetect -f null -</code>，它会在控制台反复打印候选参数。</li>
      <li>从日志里挑出现次数最多的那一组 <code>crop=w:h:x:y</code>，那才是稳定的黑边边界。</li>
      <li>把探测结果直接填回真正要跑的裁剪命令：<code>ffmpeg -i input.mp4 -vf crop=1920:960:0:60 output.mp4</code>。</li>
      <li>导出后用 <code>ffprobe</code> 复核输出分辨率，确认尺寸没偏、宽高都是你预期的值。</li>
    </ol>
    <p>
      最后要专门处理<strong>奇偶对齐</strong>这个问题——它既是坑，也有干净的解法。裁剪后的宽高最好都是偶数：一方面多数编码器的色度下采样要求尺寸能被 2 整除，奇数尺寸轻则报警告、重则直接失败，勉强编出来两侧还有条纹；另一方面它保证了之后拼接、缩放时不会出现半像素的错位。既然 <code>w/h</code> 也支持表达式，就可以把结果直接<strong>压到偶数上</strong>。比如把上面那段高度对齐成偶数：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf crop=iw:floor((ih-120)/2)*2:0:60 output.mp4</code>
    </p>
    <p>
      读法是「先减掉要裁的黑边，再除以 2 向下取整、乘回 2」——无论源高是奇是偶，算出来的高度都会是偶数。这是一个可以一直带在身边的习惯：<strong>凡是交给编码器的宽高，都顺手取个偶</strong>。
    </p>
    <p>
      裁剪还经常和缩放连着用，此时用逗号把两个滤镜串起来，前一个的输出就是后一个的输入：
    </p>
    <p>
      <code>ffmpeg -i input.mp4 -vf "crop=1920:800:0:140,scale=1280:720" output.mp4</code>
    </p>
    <div class="lesson-box warn">
      <strong>三个容易踩的边界：</strong>视频裁剪用的是 <code>-vf crop</code>，别顺手写成 <code>-af</code>（<code>-af</code> 处理的是音频，同名参数对不上）；<code>x/y</code> 里的表达式如果含逐帧变化的量，会<strong>每一帧都重算一次</strong>，固定值能省下不必要的开销；<code>cropdetect</code> 给出的只是<strong>建议值</strong>，遇到画面本身就有纯色边框（比如白底视频）时可能误判，务必人眼复核一遍。
    </div>

    <h2>参数生成器交互</h2>
    <figure class="lesson-figure">
      <figcaption>「基础裁剪」页签里拖四个数字，下方的「裁剪参数生成器」会实时拼出对应命令，拿它体会 w/h/x/y 各改一格画布怎么变；「自动检测」页签走一遍 cropdetect 探测黑边的两步；「宽高比转换」页签则给出横竖屏、方形互转的套用命令。</figcaption>
      <F07Crop />
    </figure>

    <h2>可计算参数描述</h2>
    <p>
      裁剪的核心是「用可计算的参数描述一块矩形」。写死 <code>w:h:x:y</code> 能跑，但只要源尺寸一变就会错位；把坐标换成基于 <code>in_w</code> / <code>in_h</code> 的表达式，「居中」和「等比」就能跨素材复用。搭配 <code>cropdetect</code> 让工具替你量黑边，并始终让裁出的宽高落在偶数上——这块区域才既准又稳。
    </p>
    <div class="lesson-term">
      <span class="term-name">「crop 滤镜」</span>用于从画面中裁出一块矩形，语法为 <code>crop=w:h:x:y</code>，<code>x</code> / <code>y</code> 是裁剪起点相对原图左上角的坐标，并支持 <code>in_w</code> / <code>in_h</code> / <code>out_w</code> 等表达式变量实现居中与等比裁剪。边界与例外：裁剪后的宽高<strong>建议取偶数</strong>，否则部分编码器的色度采样会失败或产生条纹；黑边起点应先用 <code>cropdetect</code> 探测而非肉眼估；视频要用 <code>-vf</code> 而非 <code>-af</code>；含逐帧变量的 <code>x/y</code> 表达式会每帧重算，固定值更省性能。
    </div>
  </LessonArticle>
</template>
