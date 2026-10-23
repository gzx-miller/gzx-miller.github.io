const e=`<script setup lang="ts">
import F19Drawtext from './F19Drawtext.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你照着教程给视频加文字水印，命令一个字没改，回车却报 <code>No such filter: 'drawtext'</code>；好不容易换上带 libfreetype 的版本跑通了，中文又全部变成了一个个方块。
    </div>

    <h2>视频文字叠加需求</h2>
    <p>
      你想要的其实很常规：在视频上压一行标题、加一个台标、角落滚动一条公告，或者把当前时间码显示出来。旧办法各有各的别扭——用剪辑软件手动敲字，遇到成百上千个文件就废了，参数也没法脚本化；事先把文字做成 PNG 水印再用 overlay 叠上去，文字一改就得重做图，像实时时间码这种每帧都变的字，更是根本做不出来。
    </p>
    <p>
      这些方案背后藏着三笔成本：文字要显示出来得依赖<strong>字体</strong>，而字体又依赖运行时的渲染库；命令里文本内容和滤镜语法<strong>共用冒号</strong>，一不小心就把参数拆错；动态文字必须靠<strong>表达式</strong>逐帧求值，写死了就只能是静态的。
    </p>
    <p>
      所以要回答的是：<strong>怎么让 FFmpeg 直接在画面上画字，既能显示中文，又能随着时间变化？</strong>
    </p>

    <h2>文字滤镜基本写法</h2>
    <p>
      最基本的写法是在一条滤镜里把文字和位置交代清楚：<code>ffmpeg -i input.mp4 -vf "drawtext=text='Hello World':x=10:y=10:fontsize=24:fontcolor=white" output.mp4</code>。
    </p>
    <p>
      它做对了一件本质的事：<strong>把「文字」当成一个逐帧渲染的滤镜</strong>，跟着每一帧画面一起绘出来。不需要外部素材、不需要剪辑软件，也就意味着它可以被写进脚本、批量套用。前提是这份 FFmpeg 在编译时启用了 <code>libfreetype</code>，并且有可用的字体。
    </p>

    <h2>字形缺失与转义限制</h2>
    <ul>
      <li>编译时没带 <code>libfreetype</code>，滤镜根本不存在，直接报 <code>No such filter: 'drawtext'</code>。</li>
      <li>不指定 <code>fontfile</code>，默认字体的字库里没有中文字形，于是「你好」被画成一串方块。</li>
      <li>文本里的冒号、百分号在滤镜语法里有特殊含义，<code>text='a:b'</code> 会被当成参数分隔符拆错位置。</li>
      <li>像 <code>%{pts\\:hms}</code> 这样的占位符，里面那个冒号本身也要转义，写漏一个就解析失败。</li>
      <li>命令在 shell 里已经过一层转义，滤镜里还有一层，两层叠起来，报错信息往往只指向「语法错误」，很难定位。</li>
      <li>把跑马灯、时间码的值写死是不行的——它们必须随帧变化。</li>
    </ul>

    <h2>字体与转义补齐</h2>
    <p>
      不推翻这条命令，而是按「先让它显示对，再让它动起来」的顺序，一层层补。
    </p>
    <p>
      第一层解决「字体」。显式指定一个含中文字形的字体文件：<code>fontfile=/Windows/Fonts/msyh.ttc</code>（macOS、Linux 换成本机对应路径）。字体一给，方块立刻变成正常汉字。
    </p>
    <p>
      第二层解决「转义地狱」。与其在命令行里和冒号、百分号反复搏斗，不如把要显示的文字<strong>写进一个 UTF-8 文本文件</strong>，再用 <code>textfile=text.txt</code> 引进来。文字里的标点统统不用转义，长文本、含冒号的文本都应该走这条路。
    </p>
    <p>
      第三层补「定位」。<code>x</code>、<code>y</code> 支持表达式，而且能用上画面的宽高 <code>w</code>/<code>h</code> 和文字的宽高 <code>tw</code>/<code>th</code>：贴右下角写 <code>x=w-tw-10:y=h-th-10</code>，水平居中写 <code>x=(w-tw)/2</code>。位置的算法交给表达式，换分辨率也不用改。
    </p>
    <p>
      第四层补「动态」。把参数写成<strong>逐帧求值的表达式</strong>，用上内置变量 <code>t</code>（当前秒数）和 <code>n</code>（帧号）：跑马灯 <code>x=w-t*20</code> 让文字随时间从右向左移；时间码 <code>text='%{pts\\:hms}'</code> 显示成时:分:秒；帧号 <code>text='Frame: %{n}'</code> 直接打出第几帧。
    </p>
    <p>
      第五层补「时段控制」。用 <code>enable</code> 指定文字只在某段时间出现，或者用 <code>alpha</code> 表达式做淡入，例如 <code>alpha='if(lt(t,3),t/3,1)'</code> 让标题在前三秒从透明渐显。
    </p>
    <p>
      最后补「可读性」。给文字加描边 <code>bordercolor</code>/<code>borderw</code>，或者加背景框 <code>boxcolor</code>/<code>boxborderw</code>，这样不论压在亮画面还是暗画面上，字都看得清。
    </p>
    <div class="lesson-box warn">
      <strong>调试口诀：先简化文本。</strong>命令失败时，先把 <code>text</code> 里的冒号、百分号、反斜杠统统去掉，用一句纯字母试跑；确认链路通了，再逐段把特殊字符加回来。另外务必确认 <code>fontfile</code> 的路径真实存在——文件找不到时，报错不会直说是字体问题。
    </div>

    <h2>三类叠加写法对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「基础用法 / 样式参数 / 动态效果」三个页签：先看一条静态文字是怎么加上去的，再看样式参数表，最后看时间码与跑马灯这类随帧变化的写法。</figcaption>
      <F19Drawtext />
    </figure>

    <h2>逐帧渲染滤镜机制</h2>
    <p>
      <code>drawtext</code> 的本质是「一个逐帧在画面上渲染文字的滤镜」。把它用顺只需三件事：给它一个含所需字形的字体文件；文本复杂就改用 <code>textfile</code> 绕开转义；要动起来就用逐帧求值的表达式，而不是写死数值。
    </p>
    <div class="lesson-term">
      <span class="term-name">「滤镜表达式」</span>指 <code>drawtext</code> 的 <code>x</code>/<code>y</code>/<code>text</code>/<code>alpha</code> 等参数可以写成在每一帧求值的表达式，可用变量包括 <code>t</code>（秒）、<code>n</code>（帧号）、<code>w</code>/<code>h</code>（画面宽高）、<code>tw</code>/<code>th</code>（文字宽高）。边界：不是所有滤镜都逐帧求值，有些默认只算一次、需要 <code>eval=frame</code> 才每帧重算；表达式里的逗号、冒号在 shell 与滤镜两层都要转义。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
