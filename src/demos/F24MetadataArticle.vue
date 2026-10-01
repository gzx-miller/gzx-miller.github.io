<script setup lang="ts">
import F24Metadata from './F24Metadata.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你只是用 <code>-c copy</code> 把一段测试视频转封装了一下，想缩点体积再发给外部；对方打开后告诉你，文件「标题」里还留着你本机的内部文件名和一段拍摄备注——你明明只搬了数据，这些东西是怎么跟着过去的？
    </div>

    <h2>容器元数据构成</h2>
    <p>
      媒体文件除了音视频码流，容器里还挂着一小块<strong>描述这件事本身的文字</strong>：标题、作者、版权、备注、语言、用的什么编码器。它们叫元数据，是一组键值对，和画面声音分开存放。你想做的无非三件事：给成品写上标题与版权；把不该带走的（拍摄设备、原始文件名、位置）清掉；给一段长视频加章节，让人能直接跳到第 3 节。
    </p>
    <p>
      手工改的代价在于：这些信息藏在你平时看不到的地方，改没改、改对没改对，眼睛都看不出来；而且它们<strong>会随转封装一起被继承</strong>，你以为在「精简文件」，其实是在「原样搬运」；同一个信息在不同容器里的叫法还不一样，写错名字命令不报错、结果也不生效。所以要回答的是：<strong>怎么把描述信息读出来、精确地改，并确认改的就是你以为的那一项？</strong>
    </p>

    <h2>标签写入命令</h2>
    <p>
      写一个标签只多一个参数：<code>ffmpeg -i input.mp4 -metadata title="My Video" -metadata artist="Director" -c copy output.mp4</code>。
    </p>
    <p>
      它做对了一件关键的事：<strong>元数据和音视频码流是分开存的，所以改它不需要重编码</strong>。配上 <code>-c copy</code>，几秒就输出完，画质一个像素都不动，标签却写进去了。
    </p>

    <h2>同名覆盖与继承</h2>
    <ul>
      <li><code>-c copy</code> 默认把原文件的元数据<strong>整个继承</strong>下来：你写的 <code>title</code> 只是覆盖了同名的那一项，原来的备注、内嵌文件名、编码器串照样在——这正是开场那次泄露。</li>
      <li>标签名跟着容器走：同一个信息在 MP4 里叫什么、在 MKV 里叫什么，未必一致。写了容器不认的名字，命令照样成功退出，播放器里却什么都没有。</li>
      <li>「改哪条流」很容易搞错：<code>-metadata language=chi</code> 改的是<strong>全局</strong>标签，不是音频流；要指定某条流必须写成 <code>-metadata:s:a:0 language=chi</code>。</li>
      <li>一上来就 <code>-map_metadata -1</code> 清空，会连你本想保留的标题也一起清掉。</li>
      <li>章节不是普通标签：它是一整套带时间轴的结构，光靠 <code>-metadata</code> 写不出来。</li>
      <li>就算写进去了，某些播放器也不显示章节；MP4 对章节的支持还很有限，MKV 才完整。</li>
    </ul>

    <h2>改写前后校验</h2>
    <p>
      不推翻 <code>-metadata</code>，而是补上它前后两端：改之前先把现状看清楚，改之后再把结果核对一遍。
    </p>
    <p>
      第一层先补「读」。用 ffprobe 把三类信息分别读出来：全局标签、每条流自己的标签、章节。
    </p>
    <ol class="lesson-steps">
      <li>看全局标签：<code>ffprobe -v error -show_entries format_tags input.mp4</code>。</li>
      <li>看流标签：把 <code>format_tags</code> 换成 <code>stream_tags</code>，语言、编码器这类信息挂在这里。</li>
      <li>看章节：<code>ffprobe -v error -show_chapters input.mkv</code>。</li>
      <li>想一次看全，就把 <code>-show_format -show_streams -show_chapters</code> 三条一起给。</li>
    </ol>
    <p>
      第二层补「写得精确」。要点有两个：标签名按<strong>目标容器</strong>的规范写，别照搬另一个容器的叫法；要作用在某条流上就带流说明符 <code>-metadata:s:a:0 key=value</code>，其中 <code>s</code> 是流、<code>a</code> 是音频、<code>0</code> 是序号。写完依旧配 <code>-c copy</code>。
    </p>
    <p>
      第三层补<strong>继承策略</strong>，这是最该想清楚的一步，由 <code>-map_metadata</code> 决定：<code>-map_metadata 0</code> 表示从第 0 个输入继承全局元数据，也是默认行为；<code>-map_metadata -1</code> 表示一条都不继承，等于把元数据清空。所以「匿名化」和「改一项、其余保留」是两条不同的路：
    </p>
    <ul>
      <li>要匿名化，先 <code>-map_metadata -1</code> 断掉继承，再按需用 <code>-metadata</code> 把你愿意公开的项重新写回去——清空之后写的，才是最后留下的。</li>
      <li>只改标题、其余照旧，就别动 <code>-map_metadata</code>，用默认继承，再用同名的 <code>-metadata</code> 覆盖即可。</li>
    </ul>
    <div class="lesson-box warn">
      <strong>隐私提醒：</strong>用 <span class="lesson-kv">-map_metadata -1</span> 剥离元数据，是对外发布素材时最直接的匿名化手段。但要记住它是<strong>全清</strong>：章节、语言、版权一并没了，清完得重新补上你有意保留的项，别把该有的信息也删掉。
    </div>
    <p>
      第四层补「章节」。章节要单独准备一份文本文件，描述每一节的起止时间与标题，再用它的输入序号去映射：
    </p>
    <ol class="lesson-steps">
      <li>写一份章节文件，首行固定是 <code>;FFMETADATA1</code>；之后每章一段，以 <code>[CHAPTER]</code> 起头，给出 <code>TIMEBASE</code>、<code>START</code>、<code>END</code> 和一个 <code>title</code>。</li>
      <li>把章节文件作为第二个输入：<code>ffmpeg -i input.mp4 -i chapters.txt -map_chapters 1 -c copy output.mkv</code>，这里的 <code>1</code> 就是章节文件的输入序号，换一个输入位置，这个数字也要跟着改。</li>
      <li>容器优先选 MKV，它对章节支持最完整；非要用 MP4，就做好「某些播放器不显示」的心理准备。</li>
    </ol>
    <p>
      最后一层补「校验」。写完别信命令没报错——把上面第一条里的 <code>ffprobe</code> 命令对着输出文件再跑一遍，确认三件事：想写的标签<strong>确实出现了</strong>，不想留的敏感项<strong>确实消失了</strong>，章节的起止时间与实际内容对得上。这一遍核对只要几秒，却能挡住大部分「以为改了其实没改」的返工。
    </p>

    <h2>查看编辑与章节标记</h2>
    <figure class="lesson-figure">
      <figcaption>切换「查看元数据 / 编辑元数据 / 章节标记」三个页签，先看 ffprobe 怎么把标签读出来，再看 <code>-metadata</code> 的写法与常用标签表，最后看章节文件的结构。</figcaption>
      <F24Metadata />
    </figure>

    <h2>元数据与码流分离</h2>
    <p>
      元数据是容器层的小块键值对，和码流分开存，所以用一个 <code>-metadata</code> 加 <code>-c copy</code> 就能零画质损失地改写。麻烦都在两端：改之前要看清有哪些标签，改之后要用 <code>ffprobe</code> 复核；而 <code>-map_metadata</code> 决定继承多少旧数据，是「清干净」还是「只改一项」，动手前必须先想明白。
    </p>
    <div class="lesson-term">
      <span class="term-name">「容器元数据」</span>指与音视频码流分开存放、描述整份文件的键值对（<code>title</code>、<code>artist</code>、<code>comment</code>、<code>language</code>、<code>encoder</code> 等），位于容器层：MP4 存在 moov atom 里，MKV 存在 Tags 元素里。它不影响编解码参数，所以 <code>-c copy</code> 就能改写或清空。边界：标签名随容器而异；不清除就会随 <code>-c copy</code> 被继承，涉及隐私时必须显式 <code>-map_metadata -1</code>；章节属于另一套结构，要用 <code>-map_chapters</code> 而不是 <code>-metadata</code> 来处理。
    </div>
  </LessonArticle>
</template>
