const o=`<script setup lang="ts">
import D02PathUrl from './D02PathUrl.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>顺手写下 <code>path.resolve('config', '/etc/hosts')</code>，你多半以为结果是「config 目录下的 etc/hosts」，它却把先给的 <code>'config'</code> 整段丢掉，只还你一条 <code>/etc/hosts</code>——一个负责「把几段拼在一起」的函数，凭什么敢无视你先给的那一段？
    </div>

    <h2>同一个位置的两套写法</h2>
    <p>
      启动服务读配置、把上传的图片落盘、导出报表写文件——只要碰磁盘，「这个东西到底在哪」就是绕不开的第一问。位置算错，轻则一句 <code>ENOENT</code> 让你反推半天，重则内容被悄悄写到了别处。
    </p>
    <p>
      而「位置」本身在 Node 里有<strong>两套写法</strong>：一套是操作系统的<strong>文件路径</strong>，分隔符看平台脸色（Windows 走 <code>\\</code>、还带 <code>C:\\</code> 盘符，类 Unix 走 <code>/</code>）；另一套是以 <code>file://</code> 打头的 <strong>URL</strong>，固定用正斜杠，还要对特殊字符做百分号编码。开场那个「先给的段被吃掉」的怪事，根子就在这两套写法常常被当成同一件事。
    </p>

    <h2>字符串相加拼出来的路径</h2>
    <p>
      假设一个文件的位置由三段组成：一个基准目录、一个子目录、一个来自配置或用户输入的文件名。最省事的拼法就是字符串相加，<code>base + '/' + name</code>，在你本机上它一直老老实实地跑。
    </p>
    <p>
      一旦跨了环境，这套拼法就要你自己扛下好几笔账：<strong>分隔符换个平台就变脸，同一串字符在两端指的是两条路</strong>；<code>.</code> 与 <code>..</code> 没人折叠，能拼出 <code>a/./b/../c</code> 这种连你都读不懂的路径；相对路径的起点得靠「此刻在哪个目录」去猜，而这个目录会随启动方式飘移。任何一笔算错，报错往往只剩一句 <code>ENOENT</code>。
    </p>
    <p>
      于是真正的问题浮出来：怎么把一条文件位置写得<strong>准确，又不绑死在某个平台</strong>？
    </p>

    <h2>把拼接托管给 path</h2>
    <p>
      用内置的 <code>node:path</code>。它把两件憋屈事接了过去：<code>path.join</code> 用<strong>当前平台的分隔符</strong>把各段接起来，顺手修饰掉多余分隔符、<code>.</code> 与 <code>..</code>；<code>path.resolve</code> 则从右往左逐段解析，最后回你一条<strong>绝对路径</strong>。
    </p>
    <p>
      它做对了最要紧的一点：<strong>把分隔符和规范化从你手里拿走</strong>。你只描述路径的片段，再也不用亲手敲 <code>/</code> 或 <code>\\</code>，一条 <code>path.resolve(baseDir, fileName)</code> 在哪个平台都成立。
    </p>

    <h2>两个函数的隐藏分歧</h2>
    <p>
      但 join 和 resolve 并不是同一种「拼」。开场那个丢段的怪事，就出在它们面对<strong>绝对片段</strong>时的分歧：
    </p>
    <ul>
      <li><code>path.resolve('/app', '/etc')</code> 得到 <code>/etc</code>——从右向左一碰上绝对片段，<strong>左边全部丢弃</strong>。</li>
      <li><code>path.join('/app', '/etc')</code> 得到 <code>/app/etc</code>——它<strong>只接不丢</strong>，把片段一路拼下去。</li>
      <li><code>path.join</code> 也不负责「把人关在目录里」：<code>path.join('/app/data', '../../etc/passwd')</code> 照样能跳到 <code>/etc/passwd</code>。</li>
      <li><code>path.resolve</code> 的相对起点是<strong>当前工作目录</strong>（<code>process.cwd()</code>），换个目录启动，算出的绝对路径就换了地方。</li>
    </ul>
    <p>
      一句话把分工钉死：<strong>要拼接用 join，要绝对路径用 resolve</strong>；还得记住 resolve「遇绝对即弃前」，join 只接不抛。混淆两者，目标路径会被静默换掉却不报任何错。
    </p>

    <h2>起点、表示与跨平台补齐</h2>
    <p>
      不推翻 <code>path</code>，而是在它上面补几层。先补<strong>起点可控</strong>：既然 resolve 依赖当前工作目录，就别让它去猜——先用 <code>path.resolve(baseDir)</code> 得到一个明确的绝对基准，再拿 <code>path.join</code> 拼上相对片段，基准来自配置或环境变量，而不是「代码碰巧在哪被启动」。
    </p>
    <p>
      再补<strong>模块自身的位置</strong>。ESM 里没有 <code>__dirname</code> / <code>__filename</code>，但每个模块都带一个 <code>import.meta.url</code>，它是条 <code>file://</code> URL。把 URL 翻成路径用 <code>fileURLToPath()</code>，反过来用 <code>pathToFileURL()</code>——跨的正是「URL 与路径」那道表示形式的坎，两者不能混着丢给 <code>fs</code>。Node 20.11 以上更直接，<code>import.meta.dirname</code> 与 <code>import.meta.filename</code> 省掉了手动换算。
    </p>
    <p>
      再补<strong>跨平台核对</strong>。路径在两端表示不同，就该能在不换机器的情况下验另一端的解析结果：<code>path.win32</code> 与 <code>path.posix</code> 让你显式指定按哪边的规则算。至于 <code>basename</code> / <code>extname</code> / <code>parse</code> / <code>format</code>，则把一条路径拆开又能拼回去：取文件名、校验后缀、生成安全的下载名都靠它们。
    </p>
    <p>
      最后补<strong>查询串与 URL</strong>。当位置不只是磁盘路径、而是带参数的网址时，用 <code>URL</code> 类配合 <code>url.searchParams</code>（或 <code>node:querystring</code>）读写查询参数，比手写正则切字符串稳得多。
    </p>
    <div class="lesson-box warn">
      <strong>别凭感觉互换这两个函数：</strong><code>path.join</code> 不是「限制在目录内」的安全边界，越界的 <code>..</code> 该拦还得自己拦；<code>resolve</code> 与 <code>join</code> 遇到绝对片段的行为恰好相反，用错了会静默改掉目标路径。
    </div>

    <h2>相对路径的规范化结果</h2>
    <figure class="lesson-figure">
      <figcaption>在输入框里改这个相对文件名（试试打进 <code>..</code> 和反斜杠），看右侧「安全拼接」的结果怎么被规范化。</figcaption>
      <D02PathUrl />
    </figure>

    <h2>分隔符与起点都交给 path</h2>
    <p>
      文件定位的本质是：把「分隔符」和「起点」这两件平台相关的事，从你手里托管给 <code>path</code>。拼接用 <code>join</code>、求绝对路径用 <code>resolve</code>，起点显式指定而不依赖工作目录，ESM 里用 <code>import.meta.url</code> 推出模块自身位置，最后再自己确认结果没有越界。
    </p>
    <div class="lesson-term">
      <span class="term-name">「路径规范化（normalization）」</span>指把 <code>.</code>、<code>..</code>、重复分隔符折叠成规范形式的<strong>纯字符串操作</strong>，<code>path.join</code> 与 <code>path.resolve</code> 都会顺带完成。必须记牢的边界：它只认字符串、不查文件系统，所以折叠后的 <code>..</code> 照样能越出你期望的目录，<strong>不提供任何安全保证</strong>；真要防越界，得在规范化之后额外校验结果是否仍落在允许的基准路径内。
    </div>
  </LessonArticle>
</template>
`;export{o as default};
