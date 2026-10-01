<script setup lang="ts">
import T24AsyncReturnType from './T24AsyncReturnType.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>我在 <code>await</code> 之后拿到的确实是用户对象，可只要想把「这个 async 函数真正的返回类型」抽出来复用，<code>ReturnType&lt;typeof fetchUser&gt;</code> 给我的却还是 <code>Promise&lt;UserProfile&gt;</code>——外面那层 <code>Promise</code> 到底谁来剥？
    </div>

    <h2>接口层异步函数</h2>
    <p>
      接口层写满了 async 函数：<code>fetchUser</code>、<code>fetchOrder</code>、<code>fetchProduct</code>，每个都返回 <code>Promise</code>。可下游真正需要的是「<code>await</code> 之后那个东西的类型」——缓存里存它、状态仓库的初始值标注它、Mock 数据照着它造、单元测试按它断言。同样，当你用 <code>Promise.all</code> 并发拉几个请求，也希望结果的元组类型能自己推导出来，而不是手写一遍。
    </p>
    <p>
      还有错误这一面：async 函数里的 <code>try/catch</code>，<code>catch</code> 接到的 <code>error</code> 是 <code>unknown</code>，团队里有人图省事直接断言成 <code>any</code> 就用，字段取错了也不报错，风险被一路推到线上。类型写不准，解构时字段提示就缺失；错误不建模，<code>catch</code> 里拿到的数据结构就无从谈起。
    </p>

    <h2>函数签名显式标注</h2>
    <p>
      最省事的做法：在函数签名上手工标注返回类型，或者在调用处把手写的结果类型再抄一遍。函数返回什么，我就照着宣布一遍。
    </p>
    <p>
      这个方案做对了一件事：<strong>显式标注确实让「函数是否真的返回了它承诺的结构」被检查到</strong>，这是很好的边界习惯。单看一个函数，它没什么问题。
    </p>

    <h2>单层解包局限</h2>
    <ul>
      <li>手写返回类型与实现脱钩，实现一改就漂移，类型却仍然理直气壮。</li>
      <li><code>ReturnType</code> 拿到的是 <code>Promise&lt;...&gt;</code>，不是 <code>await</code> 之后的类型，还得手动再剥一层。</li>
      <li><code>Promise.all</code>、<code>allSettled</code>、<code>race</code> 组合出来的类型不会自动整理成你要的结构。</li>
      <li><code>catch</code> 里的 <code>error</code> 是 <code>unknown</code>，直接当对象用编译期就报错；有人用 <code>as any</code> 绕过，等于把风险留到运行时。</li>
    </ul>

    <h2>递归解包异步层级</h2>
    <p>
      不推翻「拿到真实返回类型」，而是让类型系统自己<strong>递归地把 Promise 剥掉</strong>。做这件事的内置工具就是 <code>Awaited&lt;T&gt;</code>：不是 Promise 就原样返回，是 Promise 就取它 resolve 出来的类型，如果那还是 Promise 就继续剥——一层层解到最里。手写一遍它的原理更好记：
    </p>
    <p>
      <code>type MyAwaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U extends Promise&lt;any&gt; ? MyAwaited&lt;U&gt; : U : T</code>
    </p>
    <p>
      拆开看：它先用 <code>infer U</code> 把 Promise 里的东西捕获出来；若捕获到的仍是 Promise，就把它再喂回自己，递归下去；直到某一层不再是 Promise，就把它作为结果返回；至于压根不是 Promise 的类型，走最后一支原样返回。<strong>正因为是递归的，嵌套多少层都只需要写一次</strong>，这就是「深层嵌套也能解包」的来源。这段实现还有一个值得记住的细节：现实中的 <code>Awaited</code> 判断的是带 <code>then</code> 方法的类型（thenable），而不是死认 <code>Promise</code> 这个类，所以自定义时遇到自定义的 thenable 也能正确解包。
    </p>
    <p>
      拼上 <code>ReturnType</code>，就是最常用的那记组合拳：<code>Awaited&lt;ReturnType&lt;typeof fetchUser&gt;&gt;</code> 一步拿到 async 函数的真实返回类型。想反复用，就封装成一个专用工具：
    </p>
    <p>
      <code>type AsyncReturnType&lt;T extends (...args: any) =&gt; Promise&lt;any&gt;&gt; = Awaited&lt;ReturnType&lt;T&gt;&gt;</code>
    </p>
    <p>
      组合请求同样交给它。用 <code>Promise.all</code> 并发拉取时，结果会被推导成元组，元素类型各就各位；<code>Promise.allSettled</code> 会给出一组带 <code>status</code> 的联合——成功的那支是 <code>fulfilled</code> 带 <code>value</code>，失败的那支是 <code>rejected</code> 带 <code>reason</code>；<code>race</code> 则给出最先完成的那个类型。用同一套解包方式，就能把它们还原成可读的具体结构。
    </p>
    <p>
      最后是错误这一侧。先守住底线：<code>catch</code> 捕获到的 <code>error</code> 类型是 <code>unknown</code>，必须配合类型守卫才能安全使用，<code>if (error instanceof Error)</code> 之后再去读 <code>message</code>。想让错误进入类型体系，就在返回值上做建模——用可辨识联合把「成功」与「失败」两种结构显式分开：
    </p>
    <p>
      <code>type ApiResult&lt;T&gt; = { success: true; data: T } | { success: false; error: string }</code>
    </p>
    <p>
      调用方只要在 <code>success</code> 上分支，就能拿到对应分支独有的字段：为真时有 <code>data</code>，为假时有 <code>error</code>、不会有 <code>data</code>。错误从一句模糊的「出事了」，变成了类型上一清二楚的两种状态。
    </p>
    <div class="lesson-box hint">
      <strong>四个要点：</strong><code>Awaited</code> 会递归解开深层嵌套的 Promise，不必手写多层；<code>catch</code> 捕获到的 <code>error</code> 是 <code>unknown</code>，务必配合类型守卫；它对带 <code>then</code> 方法的 thenable 同样适用，可作为自定义解包实现的参考；遇到嵌套 Promise 的类型问题，先检查是不是需要 <code>Awaited</code>，而不是直接断言。
    </div>

    <h2>返回类型解析对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换数据类型触发加载，看 <code>Awaited&lt;ReturnType&lt;...&gt;&gt;</code> 如何把每个 async 函数解析成具体的返回结构。</figcaption>
      <T24AsyncReturnType />
    </figure>

    <h2>解包前后两层</h2>
    <p>
      异步返回类型的关键，是分清「函数返回的 Promise」与「Promise 解开后的值」这两层。<code>Awaited</code> 负责递归剥开外层，<code>ReturnType</code> 负责抓住函数签名，两者一拼就得到 async 函数的真实返回类型；<code>Promise.all</code>、<code>allSettled</code>、<code>race</code> 的结果也能据此还原。而错误同样是一种返回值，用可辨识联合把它建模出来，<code>unknown</code> 的 <code>error</code> 配上类型守卫，编译期就能覆盖两条路径。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Awaited」</span>会递归解包 <code>Promise</code> 及带 <code>then</code> 的对象，返回最终 resolve 出的值类型，非 Promise 则原样返回。常与 <code>ReturnType&lt;typeof fn&gt;</code> 组合取得 async 函数的真实返回类型，也用于还原 <code>Promise.all</code>、<code>allSettled</code>、<code>race</code> 的结构。注意 <code>catch</code> 里的 <code>error</code> 是 <code>unknown</code>，需配合类型守卫；遇到嵌套 Promise 先想 <code>Awaited</code>，别急着断言。
    </div>
  </LessonArticle>
</template>
