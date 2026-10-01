<script setup lang="ts">
import D02PathUrl from './D02PathUrl.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你以为 <code>path.join</code> 会把用户输入「关」在数据目录里，可 <code>path.join('/app/data', '../../etc/passwd')</code> 老老实实还给你 <code>/etc/passwd</code>——一个负责拼接路径的函数，凭什么不帮你挡住向上跳的那两级？
    </div>

    <h2>提出问题</h2>
    <p>
      你要读一个文件，它的位置由几段拼出来：一个基准目录、一个子目录、一个来自配置或用户输入的文件名。最顺手的写法是用字符串接起来：<code>base + '/' + name</code>。在你本机上它一直能跑通。
    </p>
    <p>
      可一旦换到别的环境，这套拼法就要人自己扛下几笔隐藏成本：<strong>Windows 的分隔符是反斜杠、盘符还长成 <code>C:\</code>，POSIX 是正斜杠、根是 <code>/</code>，同一串字符在两边根本不是同一个位置；<code>..</code> 和 <code>.</code> 需要有人折叠，否则会拼出 <code>a/./b/../c</code> 这种没人看得懂的路径；相对的起点要靠「当前在哪个目录」来猜，而这个目录会随启动方式变化。</strong>拼错任何一处，报错往往只是一句 <code>ENOENT</code>，你还得自己反推路径到底算成了什么。
    </p>
    <p>
      所以问题落到一句话上：Node 里要怎样把一个文件的位置<strong>表示准确、且跨平台一致</strong>？
    </p>

    <h2>最小方案</h2>
    <p>
      用内置的 <code>node:path</code>。它替你做两件事：<code>path.join</code> 把给出的各段用<strong>当前平台的分隔符</strong>接起来，顺便规范化掉多余的分隔符和点；<code>path.resolve</code> 则从右往左解析，遇到绝对路径片段就停下，最后还你一个<strong>绝对路径</strong>。
    </p>
    <p>
      这个方案做对了一件关键的事：<strong>把「分隔符」和「规范化」交给运行时去处理</strong>，你只负责描述路径的各个片段，不再手写 <code>/</code> 或 <code>\</code>。于是 <code>path.resolve(baseDir, fileName)</code> 就能得到一条绝对路径，在哪个平台都成立。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>path.join</code> 只做拼接与规范化，<strong>不做「关在目录里」这件事</strong>：<code>path.join('/app/data', '../../etc/passwd')</code> 会得到 <code>/etc/passwd</code>，向上跳照跳不误。</li>
      <li>它对<strong>绝对片段</strong>的处理和 <code>path.resolve</code> 正好相反：<code>path.join('/app', '/etc')</code> 得到 <code>/app/etc</code>，而 <code>path.resolve('/app', '/etc')</code> 得到 <code>/etc</code>。</li>
      <li><code>path.resolve</code> 的相对起点是<strong>当前工作目录</strong>（<code>process.cwd()</code>），同一个脚本从不同目录启动，解析出的绝对路径会不一样。</li>
      <li>路径字符串和 URL 是<strong>两种表示</strong>：在 ESM 里拿模块自身位置得到的是 <code>file://</code> 开头的 URL，直接当路径传给 <code>fs</code> 会被拒绝，因为文件名里多了个协议前缀。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻 <code>path</code>，而是先把两个函数的<strong>语义分工</strong>钉清楚：要「把几段接起来」用 <code>join</code>，要「得到一个绝对路径」用 <code>resolve</code>；并且在脑海中记住 <code>resolve</code> 从右往左、碰到绝对片段就丢弃前面，<code>join</code> 只接不抛。分清了这一步，先前的第二种混乱就消失了。
    </p>
    <p>
      接着补上<strong>起点可控</strong>。既然 <code>resolve</code> 依赖当前工作目录，就别再让它去猜：先用 <code>path.resolve(baseDir)</code> 得出一个明确的绝对基准目录，再用 <code>path.join</code> 往上拼相对片段。基准来自配置或环境变量，而不是「代码碰巧在哪里被启动」。
    </p>
    <p>
      然后补上<strong>模块自身的位置</strong>。ESM 里没有 <code>__dirname</code>，但每个模块都有一个 <code>import.meta.url</code>，它是一条 <code>file://</code> URL。把「URL」翻译成「文件路径」用 <code>fileURLToPath()</code>，反过来用 <code>pathToFileURL()</code>。<strong>跨的是「表示形式」这道坎</strong>——URL 用正斜杠、带编码，路径按平台走，两者不能混着用。Node 20.11 以上还直接给了 <code>import.meta.dirname</code> 和 <code>import.meta.filename</code>，省掉手动换算。
    </p>
    <p>
      再补上<strong>跨平台核对</strong>。既然路径在两端表示不同，就要能在不换机器的情况下验证另一端的解析结果：<code>path.win32</code> 和 <code>path.posix</code> 让你显式指定按哪个平台的规则解析，在 Windows 上也能算出 POSIX 的答案。
    </p>
    <p>
      最后补上<strong>边界校验</strong>。既然 <code>join</code> 不负责安全，就得自己来：把用户输入规范化之后，确认结果仍然落在允许的基准目录内——用 <code>resolve</code> 得到绝对路径，再判断它是否以基准目录开头。演示里把 <code>..</code> 从输入中抹掉，做的是等价的判断：<strong>不许越出这一层</strong>。
    </p>
    <div class="lesson-box warn">
      <strong>别凭印象互换两个函数：</strong><code>path.join</code> 不是安全边界，<code>..</code> 该拦要你自己拦；<code>resolve</code> 与 <code>join</code> 遇到绝对片段的行为相反，用错了会悄悄改变目标路径却毫无报错。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里改这个相对文件名（试试打进 <code>..</code> 和反斜杠），看右侧「安全拼接」的结果怎么被规范化。</figcaption>
      <D02PathUrl />
    </figure>

    <h2>总结</h2>
    <p>
      文件定位的本质是：<strong>把「分隔符」和「起点」这两件平台相关的事，从你手里交给 <code>path</code></strong>。拼接用 <code>join</code>、求绝对路径用 <code>resolve</code>，起点显式指定而不是依赖工作目录，ESM 里用 <code>import.meta.url</code> 推出模块自身位置，最后再自己确认结果没有越界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「路径规范化（normalization）」</span>指把 <code>.</code>、<code>..</code>、重复分隔符折叠成规范形式的<strong>纯字符串操作</strong>，<code>path.join</code> 与 <code>path.resolve</code> 都会顺带完成它。必须记住的边界：它只看字符串、不查文件系统，所以 <code>..</code> 之后的结果照样可以越出你期望的目录，<strong>不提供任何安全保证</strong>；真正要防越界，得在规范化之后额外校验结果是否仍在允许的基准路径内。
    </div>
  </LessonArticle>
</template>
