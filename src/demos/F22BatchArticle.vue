<script setup lang="ts">
import F22Batch from './F22Batch.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你写了 for 循环批量转 200 个视频，挂机去吃饭；回来发现脚本停在第 12 个不动了，终端光标一闪一闪，像有什么东西在等输入。你在键盘上敲了几下回车，它才慢吞吞地继续往下走。
    </div>

    <h2>批量处理需求</h2>
    <p>
      批量处理的需求听起来毫无技术含量：同一套参数，套用到一堆文件上。可手工做就是 200 遍命令，改一次参数还得从头再来，于是你想把它交给一个循环。
    </p>
    <p>
      一旦交给脚本，成本就换了地方：命令里写死的部分要变成<strong>变量</strong>，输出文件名得从输入名派生出来；<strong>一个文件出错不能拖垮整批</strong>，而默认的循环偏偏会在失败或等待输入时停住；<strong>重跑必须安全</strong>，否则转过一遍的文件会被再转一遍、后缀越叠越长；单机串行跑 200 个文件时，多核 CPU 大部分时间在闲着。所以要回答的是：<strong>怎么让这批任务既跑得完、出错看得见，还能重复执行而不捅娄子？</strong>
    </p>

    <h2>最简循环写法</h2>
    <p>
      最朴素也真的能跑的一条：<code>for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -crf 23 "${f%.mp4}_converted.mp4"; done</code>。
    </p>
    <p>
      它做对了一件很干净的事：<strong>把「一条命令」变成了「一条规则」</strong>。<code>*.mp4</code> 由 shell 展开成文件列表，<code>$f</code> 是当前文件，<code>${f%.mp4}</code> 表示「去掉 .mp4 后缀」的前缀替换，再拼上新后缀就成了输出名。文件名怎么变，规则都不用改。
    </p>

    <h2>六处脚本隐患</h2>
    <ul>
      <li><code>$f</code> 忘了加引号就完了：文件名含空格或中文时会被 shell 拆成好几个参数，FFmpeg 把后半截当成另一个输入，报出莫名其妙的错。</li>
      <li>没加 <code>-nostdin</code> 时，FFmpeg 会去抢标准输入；在循环或后台任务里它可能一直等不到输入而<strong>卡住整批</strong>，就是开场那一幕。</li>
      <li>输出名要是写成 <code>${f%.mp4}.mp4</code>，等于<strong>覆盖原文件</strong>，转坏一个就永久丢了源素材。</li>
      <li>某个文件损坏时，默认循环要么中断、要么静默跳过，跑完你根本不知道有谁没转成功——直到有人去播放那个文件。</li>
      <li>串行执行：200 个文件一个接一个，多核机器上大部分核心空转。</li>
      <li>重跑不安全：脚本再跑一遍，已转好的文件被重转一次，<code>_converted</code> 后缀还可能被再叠一层。</li>
    </ul>

    <h2>补漏洞的顺序</h2>
    <p>
      不推翻循环，而是一层层补它的漏洞。顺序很讲究，因为「命令本身对不对」比「跑得快不快」重要得多。
    </p>
    <p>
      第一层先补<strong>命令验证</strong>。把要套用的那条 FFmpeg 命令，先对一个文件跑通，而且<strong>不产出任何文件</strong>——把输出丢进空设备：<code>ffmpeg -i input.mp4 -vf scale=-2:720 -f null -</code>。<code>-f null -</code> 表示输出格式为空、写向标准输出：它照常解码、照常跑完整条滤镜链，却一个字节都不落盘，只把参数错误、滤镜语法错误暴露出来。用几十秒换来「确认这条命令是对的」，再进循环就安心了。
    </p>
    <p>
      第二层补<strong>文件名安全</strong>。所有变量一律加双引号：<code>"$f"</code>、<code>"${f%.mp4}_720p.mp4"</code>，带空格、中文甚至换行的文件名都不会被拆断。输出名一定要和输入名不同，加个后缀是又便宜又稳妥的办法。
    </p>
    <p>
      第三层补<strong>不卡住</strong>。批量场景里统一加 <code>-nostdin</code>，让 FFmpeg 不去碰标准输入；要覆盖已有输出就显式加 <code>-y</code>，别让它停下来问「是否覆盖」。
    </p>
    <p>
      第四层补<strong>出错可见、可重跑</strong>。每个任务把输出写进各自日志，失败的记一份清单，顺手记下耗时，方便事后定位：
    </p>
    <ol class="lesson-steps">
      <li>逐条执行，把这次的输出重定向到文件：命令末尾接 <code>&gt; "log/$f.log" 2&gt;&amp;1</code>。</li>
      <li>执行后看上一条命令的退出码，非 0 就把文件名记进 <code>failed.txt</code>，一条失败不中断整批。</li>
      <li>重跑前先做<strong>幂等检查</strong>：输出文件已存在就跳过，例如 <code>[ -f "${f%.mp4}_720p.mp4" ] &amp;&amp; continue</code>。</li>
      <li>跑完统计成功、跳过、失败各多少，对不上再回头翻日志。</li>
    </ol>
    <p>
      第五层才轮到<strong>并行</strong>。既然文件之间互不依赖，就一次放几个同时跑。最省事的是 GNU parallel：<code>parallel -j 4 ffmpeg -nostdin -i {} -c:v libx264 -crf 23 {.}_converted.mp4 ::: *.mp4</code>，其中 <code>{}</code> 是原文件名、<code>{.}</code> 是去掉扩展名；退一步可以用 <code>ls *.mp4 | xargs -P 4 -I {} bash -c 'ffmpeg -nostdin -i "{}" -c:v libx264 "{}_out.mp4"'</code>，或者干脆在 Bash 里把每个任务丢到后台，最后 <code>wait</code> 等它们全部结束。在 Windows 上思路一样，只是换成 PowerShell 的管道写法：<code>Get-ChildItem *.mp4 | ForEach-Object { ffmpeg -nostdin -i $_.Name -c:v libx264 ($_.BaseName + "_converted.mp4") }</code>，<code>$_.Name</code> 是文件名、<code>$_.BaseName</code> 是去掉扩展名的名字。
    </p>
    <div class="lesson-box warn">
      <strong>并行数不是越大越好：</strong>转码同时吃 CPU 和磁盘，并行开太多会一起堵在磁盘 I/O 上，反而更慢，通常 <strong>2 到 4 个</strong>就够了。另外永远记得<strong>先拿两三个文件小批量试跑</strong>，确认输出名、参数、日志都对，再对全量下手。
    </div>

    <h2>跨平台写法切换</h2>
    <figure class="lesson-figure">
      <figcaption>切换「Bash 脚本 / PowerShell / 并行处理」三个页签，对照同一件事在三种写法下的差别，再翻到注意事项，逐条对上上面讲的坑。</figcaption>
      <F22Batch />
    </figure>

    <h2>批处理规则化</h2>
    <p>
      批量的本质不是「循环」这两个字，而是把一条命令变成一条可重复执行的规则：变量加引号保文件名安全，<code>-nostdin</code> 防卡住，<code>-f null -</code> 先验证命令，日志与失败清单让错误现形，幂等检查让重跑无害，最后一层才是用 <code>parallel</code> 或 <code>xargs -P</code> 把并发放出去。顺序反了，快也是白快。
    </p>
    <div class="lesson-term">
      <span class="term-name">「幂等」</span>指同一个操作执行一次和执行多次，结果相同：批量脚本的幂等性来自「输出已存在就跳过」这类判断，重跑时既不会重复转码，也不会叠出 <code>_converted_converted</code> 这种名字。边界：幂等检查只看输出是否存在——若上次用参数 A 转换、这次改用参数 B，跳过就会留下旧结果，所以还要把参数版本写进输出名或输出目录，重跑才是真安全。
    </div>
  </LessonArticle>
</template>
