const e=`<script setup lang="ts">
import J16ErrorHandling from './J16ErrorHandling.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>报名表单里，姓名字段没填够两个字，和服务器返回 503，失败后进了同一个 <code>catch</code>，前端一律弹出「提交失败，请重试」。同事排查了半天才发现：一个是用户自己填错了，重试一百次也没用；一个是网络抖动，重试一次就好。两句完全不同的失败被同一句话糊住了——可它们本来就该被分开对待。
    </div>

    <h2>错误与抛出</h2>
    <p>
      你想做的是一件小事：出错时别让程序闷头崩掉，得有个地方把它接住。语言给的初版答案就是 <code>try/catch</code>——把可能出错的代码包进 <code>try</code>，一旦抛错就跳到 <code>catch</code> 里执行。
    </p>
    <p>
      先看清被接住的到底是什么。运行时抛出的错误不是一句字符串，而是对象，并且按来源分成几族：<code>SyntaxError</code>（代码本身没法解析）、<code>TypeError</code>（值的类型不对，比如对 <code>undefined</code> 取属性）、<code>ReferenceError</code>（引用了不存在的变量）、<code>RangeError</code>（数值或长度超出允许范围）。
    </p>
    <ul>
      <li>它们都继承自 <code>Error</code>，所以 <code>catch</code> 拿到的对象自带 <code>message</code> 与 <code>stack</code>——前者是文字说明，后者是调用栈。</li>
      <li>这套内置类型的好处是：<strong>光看 <code>name</code> 就能判断错误出在哪一类</strong>，不用去猜字符串内容。</li>
      <li>还有一个常见误解要纠正：<code>throw</code> 并不要求你抛 <code>Error</code>，抛数字、字符串、对象都合法。</li>
    </ul>
    <p>
      但合法不等于应该。一旦抛出的是字符串，<code>catch</code> 里既没有 <code>message</code> 也没有 <code>stack</code>，链路上每一层都只能靠猜。所以约定是：<strong><code>throw</code> 只抛 <code>Error</code> 或它的子类</strong>。
    </p>

    <h2>捕获与收尾的顺序</h2>
    <p>
      最省事的做法是：<code>try</code> 里写业务，<code>catch</code> 里写提示。它确实做对了一件事——错误被局部接住，后面的代码还能继续跑，不至于因为一次失败整页停摆。
    </p>
    <p>
      可它漏掉了「无论如何都要收尾」这件事：请求既然发出去了，不管成功还是失败，加载状态都得关掉、连接都得释放——而 <code>catch</code> 只在出错时才执行，正常返回时它根本轮不到。这时就需要 <code>finally</code>：它<strong>无条件</strong>在 <code>try</code> 与 <code>catch</code> 之后执行，即使 <code>try</code> 里已经 <code>return</code> 了也照样会跑。执行顺序固定为 <code>try</code> →（出错则）<code>catch</code> → <code>finally</code>。
    </p>
    <p>
      其中有两个细节最容易忽略：
    </p>
    <ul>
      <li><code>catch</code> 的绑定可以省略（ES2019 起）：<code>catch { ... }</code>，当你不关心错误对象、只想「接住并忽略」时更简洁。</li>
      <li><code>finally</code> 里写 <code>return</code> 会<strong>覆盖</strong> <code>try</code> 与 <code>catch</code> 的返回值——前面算好的结果会被直接丢弃。</li>
    </ul>
    <p>
      所以给 <code>finally</code> 划一条界线：只用它做清理，不要在里面写 <code>return</code>。
    </p>

    <h2>给错误起个名字</h2>
    <p>
      回到开头的困惑。默认的 <code>Error</code> 只有一个 <code>message</code>，<code>catch</code> 接到的无论是校验失败还是网络失败，都长得一模一样，只能靠字符串里有没有「503」去猜。
    </p>
    <p>
      更好的做法是<strong>继承 <code>Error</code>，定义业务异常类，并在构造函数里把 <code>name</code> 设成类名</strong>。这样 <code>err.name</code> 直接告诉你是哪一类，<code>instanceof</code> 也能精确区分：
    </p>
    <ul>
      <li><code>class ValidationError extends Error</code>，构造里 <code>this.name = 'ValidationError'</code>，并把业务字段（比如 <code>field</code>）一并挂上去。</li>
      <li>这样造出的实例仍然是 <code>Error</code>（<code>instanceof Error</code> 为真），所以兜底的 <code>catch</code> 也接得住它。</li>
      <li>分流时用 <code>instanceof</code>：是 <code>ValidationError</code> 就提示用户改输入，是 <code>NetworkError</code> 就提示稍后重试。</li>
    </ul>
    <p>
      于是「同一个 <code>catch</code> 里的两种失败」终于有了不同的后续处理——这正是开头那个问题需要的答案。
    </p>

    <h2>别丢掉原始错误</h2>
    <p>
      分层调用里，错误常常被「翻译」：底层抛的是 <code>SyntaxError</code>（配置文件没法解析），可你希望上层抛一句业务话「解析配置失败」，好让调用方读懂。于是你新建一个 <code>Error</code> 抛出去。
    </p>
    <p>
      可这样一来，底层那条原始错误就没了——排查时只看到业务话，根本不知道根因是解析失败。更准确地说，你把「是什么」替换成了「看起来像什么」。补救方式是 <code>cause</code> 选项：<code>new Error('解析配置失败', { cause: lowError })</code>，把原始错误挂在 <code>cause</code> 上。
    </p>
    <p>
      这样形成的是一条<strong>错误链</strong>：上层读 <code>err.message</code> 得到业务化的说明，顺着 <code>err.cause</code> 才能拿到根因；链可以一层层串下去，一直到最初那个错误。既保留了可读的提示文案，又不丢失排错线索。
    </p>

    <h2>异步边界的漏网</h2>
    <p>
      还有一个最容易踩的边界：<code>try/catch</code> <strong>接不住异步回调里抛出的同步错误</strong>。<code>try { setTimeout(() =&gt; { throw new Error() }, 0) } catch (e) { ... }</code> 里的 <code>catch</code> 根本不会执行——定时器回调是在当前调用栈清空之后才运行的，那时 <code>try/catch</code> 早就退出了。Promise 被拒绝同理，它不会自己走进 <code>try/catch</code>（除非你 <code>await</code> 它）。
    </p>
    <p>
      这类「谁都没接住」的错误，只能靠全局兜底：
    </p>
    <ul>
      <li><code>window.onerror</code> 或 <code>window.addEventListener('error', ...)</code> 接住未捕获的同步错误。</li>
      <li><code>window.addEventListener('unhandledrejection', ...)</code> 接住没有被任何 <code>catch</code> 处理的 Promise 拒绝。</li>
      <li>它们的作用是<strong>把漏网的错误送到日志或监控</strong>，而不是就地恢复流程——到那时出错的上下文早已不在。</li>
    </ul>

    <h2>异常链路逐步观察</h2>
    <figure class="lesson-figure">
      <figcaption>三个按钮分别是正常提交、触发校验错误、模拟网络异常。注意 <code>catch</code> 里用 <code>err.name</code> 区分了两类异常，又用 <code>err.cause</code> 读出了出错字段。先看 <code>try/catch/finally</code> 的执行顺序，再看 <code>name</code> 与 <code>cause</code> 如何把错误分层。</figcaption>
      <J16ErrorHandling />
    </figure>

    <h2>先分类再处理</h2>
    <p>
      错误处理从来不是「用一个 <code>catch</code> 包住所有东西」。内置错误类型族帮你认出错误来源，<code>try/catch/finally</code> 负责执行顺序与收尾，自定义 <code>Error</code> 子类配合 <code>name</code> 与 <code>instanceof</code> 让业务能按类型分流，<code>cause</code> 把原始错误串成链，全局兜底接住异步边界的漏网之鱼。写 <code>catch</code> 时先问一句：<strong>这个错误属于哪一类、原始错误又在哪里</strong>，再决定怎么处理。
    </p>
    <div class="lesson-term">
      <span class="term-name">「错误链」</span>指错误在被逐层「翻译」时，用 <code>new Error('上层说明', { cause: 原始错误 })</code> 把底层错误挂在 <code>cause</code> 属性上所形成的一条链。上层读到的是业务化的 <code>message</code>，沿着 <code>cause</code> 一路向下就能找到最初的根因——既保留了可读的提示，又不丢失排错线索。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
