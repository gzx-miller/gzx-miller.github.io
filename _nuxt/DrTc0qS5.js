const e=`<script setup lang="ts">
import PY17FileIO from './PY17FileIO.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你用 <code>'w'</code> 模式打开文件、写入几行、程序正常结束，可再去读时内容是空的；而把 <code>'w'</code> 改成 <code>'a'</code>，同样的代码却把旧内容也留住了。同样都是「写」，<code>'w'</code> 和 <code>'a'</code> 到底差在哪里？
    </div>

    <h2>先看最朴素的做法</h2>
    <p>
      读写文件最直接的方式，是 <code>open()</code> 拿到文件对象，再调它的方法：
    </p>
    <pre class="code-block"><code>f = open('data.txt', 'w')
f.write('hello\\n')
f.close()</code></pre>
    <p>
      这段代码能跑，写法也短。但它埋着两个隐患：一是<strong>忘了 <code>close()</code> 就会丢数据</strong>——写操作先进缓冲区，只有关闭（或显式 <code>flush</code>）才落盘，程序异常退出时缓冲区可能来不及写；二是<strong>没有指定编码</strong>，读写时的默认编码随平台不同，同一份文件在 Windows 与 Linux 之间来回搬，中文就可能变成乱码或者直接抛 <code>UnicodeDecodeError</code>。
    </p>

    <h2>模式决定「打开时就发生什么」</h2>
    <p>
      开场问题的答案藏在模式里。模式不只是「能不能写」，它决定了<strong>打开文件的那一刻</strong>对文件做了什么：
    </p>
    <ul>
      <li><code>'r'</code>：只读。文件必须已存在，否则抛 <code>FileNotFoundError</code>。</li>
      <li><code>'w'</code>：只写，且<strong>一打开就把文件清零</strong>（truncate）。文件不存在则新建。这就是「写完再读是空的」的原因——旧内容在打开瞬间就被抹掉了。</li>
      <li><code>'a'</code>：追加，指针停在末尾，原内容保留；文件不存在则新建。</li>
      <li><code>'r+'</code>：可读可写，指针在开头，且不清空原内容（写多少覆盖多少）。</li>
    </ul>
    <p>
      想要「保留旧内容」，就必须用 <code>'a'</code> 而不是 <code>'w'</code>；想把每次运行的结果都攒起来，也应当用追加。选错模式，是文件内容莫名消失的头号原因。
    </p>

    <h2>编码：显式写死，别赌默认值</h2>
    <p>
      处理文本文件时，<strong>永远显式指定 <code>encoding='utf-8'</code></strong>。Python 的默认编码取决于运行环境（某些系统上不是 utf-8），省略它等于把「文件能否正确读出」交给运气。写一个参数的成本，换取跨平台一致，非常划算。二进制文件（图片、压缩包）则用 <code>'rb'</code> / <code>'wb'</code>，此时不涉及编码。
    </p>

    <h2>\`with\`：让关闭这件事不再靠自觉</h2>
    <p>
      与其记得手动 <code>close()</code>，不如用<strong>上下文管理器</strong> <code>with</code> 把资源生命周期圈起来：
    </p>
    <pre class="code-block"><code>with open('data.txt', 'r', encoding='utf-8') as f:
    text = f.read()
# 离开 with 代码块时，f 已被自动关闭</code></pre>
    <p>
      <code>with</code> 的价值在于<strong>无论代码块里是否抛异常</strong>，退出时都会执行关闭。漏写 <code>close()</code>、异常导致提前跳出这些情况，它都替你兜住了。凡是「打开后需要释放」的资源（文件、网络连接、锁），都该用 <code>with</code>。
    </p>

    <h2>怎么读：read、readline 与逐行迭代</h2>
    <p>
      读有三种粒度：<code>read()</code> 一次读入全部内容返回一个字符串；<code>readline()</code> 每次读一行；<code>readlines()</code> 读成「一行的列表」。对小文件，<code>read()</code> 最省事。
    </p>
    <div class="lesson-box warn">
      <strong>大文件不要 <code>read()</code>：</strong>对上百 MB 的日志，<code>read()</code> 会把整份内容都塞进内存。正确做法是<strong>直接迭代文件对象</strong>——<code>for line in f:</code> 逐行读取，内存占用恒定，几乎总是优于 <code>readlines()</code>。
    </div>

    <h2>用 pathlib 做路径操作</h2>
    <p>
      拼路径别再用字符串 <code>+</code>，那会在 Windows 的反斜杠上翻车。标准库的 <code>pathlib.Path</code> 把路径当对象处理：
    </p>
    <ul>
      <li>拼接：<code>Path('data') / '2024' / 'log.txt'</code>，用 <code>/</code> 运算符，自动适配分隔符。</li>
      <li>拆解：<code>.name</code>、<code>.stem</code>、<code>.suffix</code>、<code>.parent</code> 分别取文件名、主干、后缀、父目录。</li>
      <li>判断与遍历：<code>.exists()</code> 是否存在，<code>.iterdir()</code> 遍历目录，<code>.glob('*.csv')</code> 按模式匹配。</li>
      <li>读写捷径：<code>.read_text(encoding='utf-8')</code>、<code>.write_text(text, encoding='utf-8')</code>，省去显式 open。</li>
    </ul>

    <h2>文件不存在时会发生什么</h2>
    <p>
      用 <code>'r'</code> 打开一个不存在的文件，会抛 <code>FileNotFoundError</code>。这不是坏事——它把问题明确定位在「文件这一层」，而不是让错误渗到后续逻辑。需要容错时，可以先用 <code>Path.exists()</code> 判断，或者用 <code>try / except FileNotFoundError</code> 捕获并给出友好提示。别用「先判断再打开」当作唯一方案，因为两步之间文件仍可能被删除，捕获异常才是最稳的。
    </p>

    <h2>看一遍模式、with 与 pathlib</h2>
    <figure class="lesson-figure">
      <figcaption>在「模式对照」里点 <code>'r'</code> / <code>'w'</code> / <code>'a'</code> / <code>'r+'</code> 比较打开行为；到「with 流程」逐步看清自动关闭；再在「pathlib」里改路径，观察名字、后缀、父目录的拆解与 <code>exists()</code>。</figcaption>
      <PY17FileIO />
    </figure>

    <h2>一句话收敛</h2>
    <p>
      文件读写要同时管好三件事：<strong>模式</strong>决定打开时的行为（<code>'w'</code> 清零、<code>'a'</code> 追加）、<strong>编码</strong>必须显式写成 <code>utf-8</code>、<strong>关闭</strong>交给 <code>with</code> 自动完成；读取大文件用逐行迭代而非 <code>read()</code>；路径操作交给 <code>pathlib.Path</code> 而不是字符串拼接。
    </p>
    <div class="lesson-term">
      <span class="term-name">「上下文管理器」</span>指支持 <code>with</code> 语法、能保证进入和退出时各执行一次固定动作的对象（文件对象、锁等），退出动作在异常时也照样执行。边界与例外：<code>'w'</code> 会在打开时清空文件，与是否写入无关；编码未指定时依赖平台默认值；<code>read()</code> 会把整个文件读入内存，大文件应改用逐行迭代。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
