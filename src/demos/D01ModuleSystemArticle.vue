<script setup lang="ts">
import D01ModuleSystem from './D01ModuleSystem.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同样是「导出一个计数器，再在模块内部自增」的写法：ESM 里 <code>import</code> 进来读到的值会跟着变大，CommonJS 里读到的却永远是初始值——变量明明改了，为什么引用方看不到？
    </div>

    <h2>提出问题</h2>
    <p>
      你把程序拆成一个个文件，每个文件管一块逻辑。可拆分之后马上冒出一个新问题：文件之间要怎么共享一个函数、一个配置？如果没有任何机制，办法只剩「把东西挂到全局」——于是名字互相覆盖，谁先加载谁后加载全凭记忆，你还说不清某个文件到底用了别人哪几样东西。
    </p>
    <p>
      这就得有一个模块系统，它必须同时回答两件事：<strong>一是导出和导入时共享的到底是什么——值，还是引用；二是依赖关系在什么时候被确定——跑起来才知道，还是读代码就知道。</strong>这两个问题的答案不同，代码的行为就完全不同。开场那个「改了却看不到」的现象，正是第一个问题的答案在两种模块格式里相反所致。
    </p>

    <h2>最小方案</h2>
    <p>
      Node 最早给的答案叫 <strong>CommonJS</strong>：一个文件用 <code>require()</code> 同步读入另一个文件、执行它，再把它的 <code>module.exports</code> 返回给你；文件里想暴露什么，就挂到 <code>module.exports</code> 上。写起来很直接——<code>const { add } = require('./math')</code> 拿进来就能用。
    </p>
    <p>
      这个方案做对了一件根本的事：<strong>它给每个文件划出了独立作用域</strong>，模块里的变量不再污染全局，也不会互相撞名；而依赖关系出现在 <code>require()</code> 出现的位置，读代码大致能看出谁用了谁。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li><code>require()</code> 是<strong>运行时同步解析</strong>的：只有代码真的执行到那一行，才知道依赖是谁。工具无法在不动代码的前提下画出完整依赖图，也就没法做 Tree Shaking。</li>
      <li><code>module.exports</code> 交出的是<strong>赋值那一刻的值拷贝</strong>。模块内部后续把变量改大，引用方读到的仍是当初那个数——这就是开场那个计数器的由来。</li>
      <li>同步意味着<strong>阻塞</strong>：想加载一个大模块，只能停下来等它读完，做不到「用到时再异步拉取」。</li>
      <li>顶层 <code>this</code> 在 CommonJS 里指向 <code>module.exports</code>，和你在普通函数里对 <code>this</code> 的直觉不一致，容易写出意外结果。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「模块」这件事，而是换掉上面两个问题的答案。首先是<strong>依赖确定时机</strong>：ES Modules 把 <code>import</code> / <code>export</code> 提升到语法层，编译期就能静态确定整张依赖图，不用真正执行代码。依赖关系一旦静态可见，工具就能判断哪些导出没被用到，把它们安全地删掉。
    </p>
    <p>
      接着是<strong>导出语义</strong>：ESM 导出的是<strong>实时绑定</strong>，<code>export let count</code> 交出去的是对变量的引用，模块内部把 <code>count</code> 改大，引用方读到的就是最新值——正好补上 CommonJS 值拷贝的短板。换来的是约束：<code>import</code> 是<strong>只读绑定</strong>，你不能给导入的名字重新赋值。
    </p>
    <p>
      静态 <code>import</code> 必须在顶层，那「用到时才加载」怎么办？用动态 <code>import()</code>——它是函数调用、返回 Promise，可以放在任何位置，补上了按需异步加载这层能力。
    </p>
    <p>
      接下来要解决两种格式怎么共存。<strong>文件扩展名</strong>是硬规则：<code>.mjs</code> 恒为 ESM，<code>.cjs</code> 恒为 CommonJS；而 <code>.js</code> 看同目录 <code>package.json</code> 里有没有 <code>"type": "module"</code>——有就按 ESM，没有就按 CommonJS。想让一个包同时服务两种格式，可以在 <code>package.json</code> 的 <code>exports</code> 字段里为同一个子路径分别提供 CJS 与 ESM 入口。
    </p>
    <p>
      最后是边界处的互操作。ESM 导入 CommonJS 时，<strong>默认导出即 <code>module.exports</code></strong>，命名导出需要从中解构；反过来，CommonJS 无法同步 <code>require()</code> 一个 ESM 模块，只能 <code>await import()</code>，因为 ESM 的加载本身是异步的。
    </p>
    <ol class="lesson-steps">
      <li>先用 <code>package.json</code> 的 <code>type</code> 字段或 <code>.mjs</code> / <code>.cjs</code> 后缀，把每个文件的模块格式固定下来。</li>
      <li>ESM 一侧用 <code>import</code> / <code>export</code> 组织命名导出与默认导出，需要按需加载时改用动态 <code>import()</code>。</li>
      <li>跨格式互相引用时，统一走动态 <code>import()</code>；引用内置模块统一加 <code>node:</code> 前缀，避免和 npm 包同名混淆。</li>
      <li>用 <code>node -p</code> 或最小脚本分别验证「谁加载谁」，把两种格式的行为跑一遍再下结论。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>两个常见误区：</strong>不要让同一个目录里的 <code>.js</code> 同时以两种隐式格式被解释——格式必须由 <code>type</code> 字段或扩展名明确指定，否则同一份代码在不同机器上行为可能不同。另外，ESM 里没有 <code>__dirname</code> / <code>__filename</code>，它们属于 CommonJS 的注入变量，要用模块自身的 URL 去换算（这是下一课展开的话题）。
    </div>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>切到「ESM vs CJS」看两种格式在各个维度上的分歧，再翻到「互操作」看两种格式互相加载时该走哪条路。</figcaption>
      <D01ModuleSystem />
    </figure>

    <h2>总结</h2>
    <p>
      模块系统其实只在回答两件事：共享的<strong>是值还是引用</strong>，依赖<strong>何时被确定</strong>。CommonJS 运行时同步解析、交出值拷贝；ESM 编译期静态确定、交出实时绑定。格式靠扩展名与 <code>type</code> 字段钉死，两种格式之间的桥则是动态 <code>import()</code>。
    </p>
    <div class="lesson-term">
      <span class="term-name">「实时绑定（live binding）」</span>是 ESM 导出的语义：导出的是对变量的<strong>引用</strong>而非某一刻的拷贝，模块内部修改后，导入方读到的是最新值。边界与例外：导入绑定是只读的，不能给它重新赋值；CommonJS 的 <code>module.exports</code> 恰恰相反，它是赋值那一刻的值拷贝，之后内部再改引用方也看不到。
    </div>
  </LessonArticle>
</template>
