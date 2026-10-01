<script setup lang="ts">
import F20Fade from './F20Fade.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你想给视频结尾加两秒淡出，写了 <code>fade=t=out:st=58:d=2</code>，可这段素材其实只有 30 秒——结果一点淡出都没有，画面一直到最后一帧还是亮的，然后硬生生切黑。
    </div>

    <h2>画面过渡需求</h2>
    <p>
      你想要的只是「别那么生硬」：开头从黑场缓缓浮现，结尾缓缓隐去，不要咔嚓一下跳进去、又咔嚓一下跳出来。旧办法要么在剪辑软件里手动拉不透明度关键帧——一次性还好，批量处理根本做不动；要么做一段纯黑视频前后拼上去——得额外准备素材，还常常和正片的时长对不齐。
    </p>
    <p>
      这两种办法背后都有成本落在你身上：淡出要<strong>按内容的实际时长</strong>算出起点，把时间硬编码进命令，换个素材就失效；画面淡出和声音淡出是<strong>两件分开要做</strong>的事，只顾了画面，就会出现「画面在渐暗、声音却啪地断掉」；淡出还经常和裁剪（<code>-ss</code> / <code>-t</code>）一起用，时间轴一旦错位，淡出位置就全跑了。
    </p>
    <p>
      所以要回答的是：<strong>怎么用滤镜让画面和声音都平滑过渡，并且在裁剪或拼接之后，时间点仍然对得上？</strong>
    </p>

    <h2>淡入滤镜命令</h2>
    <p>
      最短的一条淡入命令只多一个滤镜：<code>ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=2" -c:a copy output.mp4</code>。
    </p>
    <p>
      它做对了一件很干净的事：<strong>把「从黑场渐显」抽象成按时间插值的渐变</strong>。<code>t</code> 指定方向（<code>in</code> 淡入 / <code>out</code> 淡出），<code>st</code> 是起始时间，<code>d</code> 是持续时长；画面这一侧渐变的是亮度与不透明度。只要 <code>st</code> 落在素材范围内，它就能稳定生效。
    </p>

    <h2>秒数硬编码</h2>
    <ul>
      <li><code>st</code> 是<strong>写死的秒数</strong>。素材从 60 秒变成 30 秒，<code>st=58</code> 就落在范围之外，淡出直接不生效，而且<strong>不会报错</strong>——这正是开场那一幕。</li>
      <li>只加了 <code>-vf fade</code>，音频完全没有跟着淡，于是画面渐暗、声音却在最后一帧「啪」地切断。</li>
      <li>既要淡入又要淡出时，两个 <code>fade</code> 必须串在同一条 <code>-vf</code> 里，用逗号连接，顺序就是它们在时间上的先后。</li>
      <li>淡出常和 <code>-ss</code>/<code>-t</code> 一起用，而 <code>-ss</code> 放在 <code>-i</code> 之前还是之后，时间戳的基准不一样，<code>st</code> 的「起点」含义随之改变，淡出位置会对不上。</li>
      <li>时长没节制：五秒的淡入淡出会显得拖沓，观众的耐心其实撑不了多久。</li>
    </ul>

    <h2>滤镜时间轴语义</h2>
    <p>
      不推翻 <code>fade</code>，而是先把它的<strong>时间轴语义</strong>讲清楚：<code>st</code> 和 <code>d</code> 都是相对滤镜输入的时间轴来算的，默认从输出的 0 秒起。想清楚「起点是谁的起点」，后面所有坑都好解释。
    </p>
    <p>
      第一层补「按内容算时间」。不要抄教程里的数字，先用 <code>ffprobe</code> 取到素材时长 T，淡出的起点就写成 <code>T - d</code>。素材换了，时间自然跟着变。
    </p>
    <p>
      第二层补「声音」。音频是另一套滤镜 <code>afade</code>，参数同名 <code>t</code>/<code>st</code>/<code>d</code>，但它作用的是<strong>音量包络</strong>：<code>-af "afade=t=in:st=0:d=3,afade=t=out:st=57:d=3"</code>。这里要记牢，画面 <code>fade</code> 淡向的是黑场（或指定的颜色），音频 <code>afade</code> 淡向的是静音——两者是两套独立的机制，必须分开写。
    </p>
    <p>
      第三层补「和裁剪配合的注意点」。用 <code>-ss</code>/<code>-t</code> 截取片段时，把 <code>-ss</code> 放在 <code>-i</code> <strong>之后</strong>（输出侧定位）行为更好预测，此时时间轴以截取出来的那段输出为准，淡出的 <code>st</code> 就从新的 0 秒重新算；放在 <code>-i</code> 之前属于输入侧定位，精度与行为都不同，<code>st</code> 的含义要按实际时间轴重新推。稳妥的做法是：先截取，再按截取后的时长去设淡入淡出。
    </p>
    <p>
      第四层补「跨片段转场」。真正的「两段之间交叉淡化」不是单条 <code>fade</code> 能做的：画面用 <code>xfade</code>，音频用 <code>acrossfade</code>，由 <code>offset</code> 指定从哪个时间点开始切换，而且要求两路输入的时间轴<strong>对齐</strong>，否则转场会跳。
    </p>
    <p>
      最后补「观感」：视频 <code>fade</code> 默认是线性渐变，视觉上两头慢、中间快往往更自然；音频侧可以用 <code>afade</code> 的 <code>curve</code> 参数（如 <code>tri</code>、<code>qsin</code>、<code>hsin</code>）调节曲线形状；画面侧则可以用 <code>color</code> 参数淡到白色，做出闪白效果。
    </p>
    <div class="lesson-box warn">
      <strong>节奏提醒：</strong>淡入淡出时长要和内容节奏匹配，通常 <strong>2 秒以内</strong>最自然；淡出的起点务必用<strong>实际时长</strong>算出来，别把教程里的数字原样照抄——那是别人素材的时长。
    </div>

    <h2>音画过渡页签</h2>
    <figure class="lesson-figure">
      <figcaption>切换「视频淡入淡出 / 音频淡入淡出 / xfade 转场」三个页签，对照命令看画面与声音是怎么各管一段的，再翻到曲线表理解不同渐变的形状差别。</figcaption>
      <F20Fade />
    </figure>

    <h2>包络插值机制</h2>
    <p>
      <code>fade</code> 与 <code>afade</code> 的本质都是「在时间轴上按一条包络做插值」：画面那条包络通向黑场，声音那条通向静音，所以要分开写。把 <code>st</code> 用实际时长算出来，并在裁剪之后按新的时间轴重新对齐，淡入淡出就不会再无声无息地失效。
    </p>
    <div class="lesson-term">
      <span class="term-name">「音量包络」</span>指音频在一段时间内增益随时间变化的曲线，<code>afade</code> 正是通过对增益逐点求值来实现淡入淡出的。它与画面 <code>fade</code> 对亮度/透明度的渐变是两套机制：音频淡出通向静音，画面淡出通向黑场（或 <code>color</code> 指定的颜色）。边界：<code>afade</code> 的 <code>st</code> 同样从 0 秒起算、指向滤镜输入的时间轴，裁剪后必须重新对齐。
    </div>
  </LessonArticle>
</template>
