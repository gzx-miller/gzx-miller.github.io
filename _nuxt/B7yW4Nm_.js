const e=`<script setup lang="ts">
import D03FileSystem from './D03FileSystem.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一句 <code>await readFile(path)</code>，只是少写了第二个参数 <code>'utf8'</code>，返回值就从字符串变成了 <code>Buffer</code>，后面那句 <code>JSON.parse</code> 立刻抛错——明明读的是同一个文件，凭什么少写一个编码就全变了样？
    </div>

    <h2>文件操作的两副面孔</h2>
    <p>
      运行时总要碰文件：启动时读配置、运行中把结果落盘、闲下来遍历一个目录。为此 <code>node:fs</code> 备了<strong>两套 API</strong>——一套是名字带 <code>Sync</code> 后缀的同步版，喊完当场拿返回值；另一套是异步版，既包括老式回调风格，也有 <code>node:fs/promises</code> 的 Promise 风格，发起之后等结果好了再续上。
    </p>
    <p>
      两套 API 能读能写的是同一批文件，差别只在<strong>「等结果的那段时间，进程在干什么」</strong>。这一个差别，决定了它们各自适合什么场合，也正是「读一个文件卡住整个服务」那类事故的源头。
    </p>

    <h2>同步读写的三笔账</h2>
    <p>
      你要在运行时读写文件，同步 API 早就摆在那儿，写下 <code>readFileSync</code> 就能直接拿到内容，为什么还要费劲用异步的？
    </p>
    <p>
      因为同步读写要你自己买单：<strong>它会占住事件循环</strong>——Node 等磁盘返回的这段时间里，别的请求、定时器、回调全得排队，文件越大、等得越久，其它活就越晚；<strong>它也没法并发</strong>，读三个文件只能一个接一个地等；更现实的是，<strong>「文件不存在」「没有权限」是常态而不是 bug</strong>，若一律当成崩溃抛出去，调用方拿不到任何可区分的信号去做补救。
    </p>
    <p>
      于是问题落到一句话：怎样读写文件，<strong>既不占住事件循环，又能把可预期的失败分类处理</strong>？
    </p>

    <h2>fs/promises 把等待还回去</h2>
    <p>
      用内置的 <code>node:fs/promises</code>（也可以写成 <code>fs.promises</code>）。它的文件 API 一律返回 Promise：<code>await readFile(path, 'utf8')</code> 拿到文本，<code>writeFile</code> 写文件，<code>mkdir</code> / <code>readdir</code> / <code>stat</code> 管目录与文件信息。
    </p>
    <p>
      这个方案做对了一件本质的事：<strong>把「等磁盘」的过程交还给事件循环</strong>。发起读取后 Node 不会干等，而是去处理别的任务，磁盘好了再回来接着跑 <code>await</code> 之后的代码。你还能把多个读取用 <code>Promise.all</code> 交叠起来，总耗时贴近最慢的那一个，而不是它们之和。
    </p>

    <h2>数据形态与失败分类的坑</h2>
    <ul>
      <li><code>readFile</code> 不传编码时返回的是 <code>Buffer</code>、不是字符串——顺手拿去拼接或喂给 <code>JSON.parse</code>，会报错或得到乱码。</li>
      <li><code>readFile</code> 会把<strong>整个文件读进内存</strong>：拿它读一个 2GB 的日志，内存直接飙升，重则被 OOM 杀掉。</li>
      <li>错误<strong>没有分类</strong>：文件不存在和没权限都抛异常，若只写一个 <code>catch</code> 当成「炸了」，用户最终看到一句毫无信息量的报错。</li>
      <li><code>writeFile</code> 默认是<strong>覆盖</strong>（<code>flag: 'w'</code>）：想追加却忘了换成追加标志，历史内容会被整段抹掉。</li>
      <li>目标目录不存在时 <code>writeFile</code> 直接失败（<code>ENOENT</code>）——它不会顺手帮你把目录建出来。</li>
    </ul>

    <h2>编码、并发、错误码与目录语义</h2>
    <p>
      先把<strong>数据形态</strong>说清楚。读文本就显式传 <code>'utf8'</code>，让返回值直接是字符串；读二进制（图片、压缩包）就不传编码，老老实实接住 <code>Buffer</code>。这一层不做，「拿 Buffer 当字符串」的隐性错误迟早找上门。
    </p>
    <p>
      接着把<strong>等待变成并发</strong>。多个互不依赖的文件，用 <code>Promise.all</code> 一起读，把串行等待压成并行；也别忘了它「一个失败全体失败」的性格——若你要「谁成功就先用谁」，就换成收集式的做法，别让一个坏文件毁掉整批结果。演示里那句 <code>names.map(name =&gt; readFile(name, 'utf8'))</code> 套的正是这个模式。
    </p>
    <p>
      然后补上最关键的一层：<strong>按错误码分支</strong>。文件系统抛出的错误对象上挂着一个稳定的字符串标记 <code>err.code</code>：<code>ENOENT</code> 表示文件不存在，可以走默认值兜底；<code>EACCES</code> 表示没有权限，可以给出「检查目录权限」这类可操作的提示；<code>EEXIST</code> 出现在用 <code>'wx'</code> 标志只想新建不覆盖、而目标已存在时；其余再向上抛。用 <code>code</code> 判断比匹配错误消息可靠得多——消息文本会随平台和版本变。
    </p>
    <p>
      再把<strong>目录与写入语义</strong>补齐。写文件前用 <code>mkdir(dir, { recursive: true })</code> 保证目录存在，已存在也不会报错；删除时用 <code>rm(path, { recursive: true, force: true })</code> 一次处理递归与「本来就没有」；遍历目录用 <code>readdir(dir, { withFileTypes: true })</code> 直接区分文件与子目录，省掉逐项 <code>stat</code>，需要大小、时间时再用 <code>stat</code>。移动、复制则交给 <code>rename</code> / <code>copyFile</code> / <code>cp</code>。至于覆盖还是追加，按业务语义在 <code>writeFile</code> 与 <code>appendFile</code>（<code>flag: 'a'</code>）之间明确选择，别让「忘了改 flag」变成数据丢失。
    </p>
    <p>
      最后留一道分水岭：<strong>大文件不要走 <code>readFile</code></strong>，改用流逐块处理，让内存占用与文件大小脱钩。这一步的展开在「流与背压」那一课，这里只需记住判断标准——<strong>数据大到不该整个进内存时，就是该用流的时候</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>三条要守住的边界：</strong>同步文件 API 会占住事件循环，只适合启动初始化阶段少量使用，别放进请求路径；大文件一律走流；<code>readFile</code> 不传编码拿到的是 <code>Buffer</code>，不是字符串。
    </div>

    <h2>并发发起与统一收口</h2>
    <figure class="lesson-figure">
      <figcaption>点「读取配置目录」，看状态怎么从「并发读取」走到完成，体会一次并发发起、统一收口的过程。</figcaption>
      <D03FileSystem />
    </figure>

    <h2>文件读写三要点</h2>
    <p>
      异步文件操作要同时做对三件事：<strong>把等待交给事件循环</strong>（用 <code>fs/promises</code> 而不是同步 API）、<strong>把互不依赖的读取并发起来</strong>（<code>Promise.all</code>）、<strong>把失败按 <code>err.code</code> 分类</strong>（<code>ENOENT</code> 兜底、<code>EACCES</code> 提示）。数据太大时，再换流。
    </p>
    <div class="lesson-term">
      <span class="term-name">「错误码 <code>err.code</code>」</span>是文件系统调用失败时挂在错误对象上的稳定字符串标记（如 <code>ENOENT</code> 不存在、<code>EACCES</code> 权限不足、<code>EEXIST</code> 已存在、<code>ENOSPC</code> 磁盘写满），底层来自 POSIX 的 errno。边界与例外：判断请用 <code>code</code> 而不是 <code>message</code>，后者会随平台与版本变化；也并非所有错误都带 <code>code</code>，分支里要留一条兜底路径。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
