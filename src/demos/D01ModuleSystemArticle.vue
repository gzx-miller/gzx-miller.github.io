<script setup lang="ts">
import D01ModuleSystem from './D01ModuleSystem.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个「模块内部自增计数器」的写法：ESM 里 <code>import</code> 进来读到的 <code>count</code> 会跟着变大，CommonJS 里读到的却永远停在 0——变量明明改了，为什么引用方看不到？
    </div>

    <h2>Node.js 到底提供了什么</h2>
    <p>
      JavaScript 原本只在浏览器里跑，它被设计成一段段短小的脚本：响应用户点击、改一改页面。可当你想让它去读写文件、监听端口、扛住成千上万的并发连接时，浏览器那套环境就不再合适——它不仅没有这些能力，也不允许随便访问本机资源。
    </p>
    <p>
      Node.js 给出的答案是<strong>一个把 JavaScript 引擎搬出浏览器的运行时</strong>：它用 V8 负责把 JS 编译并执行，用 <strong>libuv</strong> 补上文件、网络、定时器等异步能力，并在两者之间架起<strong>事件循环</strong>。于是同一门语言，既能在页面上操作 DOM，也能在服务器上处理请求。
    </p>

    <h2>从一段脚本到一个程序</h2>
    <p>
      运行时解决了「能不能跑」，接下来要解决「怎么组织」。当代码从几十行涨到几千行，最朴素的做法是把所有函数、常量、配置都挂到<strong>全局</strong>上，谁都能取、谁都能改。
    </p>
    <ul>
      <li>两个文件各自定义一个 <code>config</code>，后加载的那个把前面的<strong>覆盖</strong>掉，而你在读代码时几乎发现不了。</li>
      <li>依赖关系散落在各处的全局变量里，<strong>谁用了谁无法静态判断</strong>，想删掉「没被用到」的代码只能靠猜。</li>
      <li>加载顺序变成隐式契约：<code>a.js</code> 必须在 <code>b.js</code> 之前，否则某个全局还没赋值，程序就跑不起来。</li>
    </ul>
    <p>
      问题的根子在于：<strong>缺少一个「文件之间如何共享、共享的到底是什么」的约定</strong>。这个约定就是模块系统，而它必须同时回答两件事——共享的<strong>是值还是引用</strong>，依赖关系<strong>何时被确定</strong>。开场那个「改了却看不到」的现象，正是这两个问题在两种模块格式里给出了相反的答案。
    </p>

    <h2>CommonJS：同步载入方案</h2>
    <p>
      Node 最早给出的方案叫 <strong>CommonJS</strong>：一个文件用 <code>require()</code> 同步读入另一个文件、执行它，再把它的 <code>module.exports</code> 返回给你；文件里想暴露什么，就挂到 <code>module.exports</code> 上。写起来很直接——<code>const { add } = require('./math')</code> 拿进来就能用。
    </p>
    <p>
      它做对了一件根本的事：<strong>给每个文件划出独立作用域</strong>，模块内的变量不再污染全局，也不再互相撞名；依赖关系出现在 <code>require()</code> 出现的位置，读代码大致能看出谁用了谁。在「服务端运行、磁盘就在手边」的场景下，同步读文件的代价可以接受，这也是它能成为 Node 默认格式多年的原因。
    </p>

    <h2>同步方案的三处代价</h2>
    <ul>
      <li><code>require()</code> 是<strong>运行时同步解析</strong>的：只有代码真的执行到那一行，才知道依赖是谁。工具无法在不动代码的前提下画出完整依赖图，也就没法做 Tree Shaking。</li>
      <li><code>module.exports</code> 交出的是<strong>赋值那一刻的值拷贝</strong>。模块内部后续把变量改大，引用方读到的仍是当初那个数——这就是开场那个计数器的由来。</li>
      <li>同步意味着<strong>阻塞</strong>：想加载一个大模块，只能停下来等它读完，做不到「用到时再异步拉取」，也拿不到「依赖就绪后再执行」的表达能力。</li>
    </ul>

    <h2>ES Modules：换掉两个答案</h2>
    <p>
      不推翻「模块」这件事，而是换掉前面两个问题的答案。先看<strong>依赖确定时机</strong>：ES Modules 把 <code>import</code> / <code>export</code> 提升到语法层，编译期就能静态确定整张依赖图，无需真正执行代码。依赖关系一旦静态可见，工具就能判断哪些导出没被用到，把它们安全地删掉。
    </p>
    <p>
      再看<strong>导出语义</strong>：ESM 导出的是<strong>实时绑定</strong>，<code>export let count</code> 交出去的是对变量的引用，模块内部把 <code>count</code> 改大，引用方读到的就是最新值——正好补上 CommonJS 值拷贝的短板。换来的是约束：<code>import</code> 是<strong>只读绑定</strong>，你不能给导入的名字重新赋值。
    </p>
    <p>
      静态 <code>import</code> 必须在顶层，那「用到时才加载」怎么办？用动态 <code>import()</code>——它是函数调用、返回 Promise，可以放在任何位置，补上了按需异步加载这层能力。
    </p>

    <h2>两种格式如何共存</h2>
    <p>
      真实项目里两种格式往往并存，规则必须钉死，不能靠猜。<strong>文件扩展名</strong>是硬规则：<code>.mjs</code> 恒为 ESM，<code>.cjs</code> 恒为 CommonJS；而 <code>.js</code> 看同目录 <code>package.json</code> 里有没有 <code>"type": "module"</code>——有就按 ESM，没有就按 CommonJS。想让一个包同时服务两种格式，可以在 <code>package.json</code> 的 <code>exports</code> 字段里为同一子路径分设 <code>import</code> 与 <code>require</code> 入口。
    </p>
    <p>
      边界处的互操作也有定论：ESM 导入 CommonJS 时，<strong>默认导出即 <code>module.exports</code></strong>，命名导出需要从中解构；反过来，CommonJS 无法同步 <code>require()</code> 一个 ESM 模块，只能 <code>await import()</code>，因为 ESM 的加载本身是异步的。
    </p>
    <ol class="lesson-steps">
      <li>先用 <code>package.json</code> 的 <code>type</code> 字段或 <code>.mjs</code> / <code>.cjs</code> 后缀，把每个文件的模块格式固定下来。</li>
      <li>ESM 一侧用 <code>import</code> / <code>export</code> 组织命名导出与默认导出，需要按需加载时改用动态 <code>import()</code>。</li>
      <li>跨格式互相引用时统一走动态 <code>import()</code>；引用内置模块统一加 <code>node:</code> 前缀，避免和 npm 包同名混淆。</li>
      <li>用 <code>node -p</code> 或最小脚本分别验证「谁加载谁」，把两种格式的行为跑一遍再下结论。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>不要让同一个目录里的 <code>.js</code> 同时以两种隐式格式被解释——格式必须由 <code>type</code> 字段或扩展名明确指定，否则同一份代码在不同机器上行为可能不同。另外，ESM 里没有 <code>__dirname</code> / <code>__filename</code>，它们属于 CommonJS 注入的变量，要用模块自身的 URL 去换算（这是下一课展开的话题）。
    </div>

    <h2>看一遍两种模块格式的差异</h2>
    <figure class="lesson-figure">
      <figcaption>切到「ESM vs CJS」看两种格式在各个维度上的分歧，再翻到「互操作」看两种格式互相加载时该走哪条路。</figcaption>
      <D01ModuleSystem />
    </figure>

    <h2>只在回答两个问题</h2>
    <p>
      运行时负责把 JavaScript 跑起来，模块系统负责把代码组织起来——而模块系统其实只在回答两件事：共享的<strong>是值还是引用</strong>，依赖<strong>何时被确定</strong>。CommonJS 运行时同步解析、交出值拷贝；ESM 编译期静态确定、交出实时绑定。格式靠扩展名与 <code>type</code> 字段钉死，两种格式之间的桥则是动态 <code>import()</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「实时绑定（live binding）」</span>是 ESM 导出的语义：导出的是对变量的<strong>引用</strong>而非某一刻的拷贝，模块内部修改后，导入方读到的是最新值。边界与例外：导入绑定是只读的，不能给它重新赋值；CommonJS 的 <code>module.exports</code> 恰恰相反，它是赋值那一刻的值拷贝，之后内部再改引用方也看不到。
    </div>
  </LessonArticle>
</template>
