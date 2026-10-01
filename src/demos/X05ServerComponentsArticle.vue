<script setup lang="ts">
import X05ServerComponents from './X05ServerComponents.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>在 <code>app/</code> 的页面里写 <code>useState</code> 或 <code>onClick</code>，编辑器立刻报错说不认识；可同一个文件里直接 <code>await</code> 查数据库却完全正常——这些组件到底跑在哪里，凭什么有的能力有、有的能力没有？
    </div>

    <h2>数据获取与渲染分离</h2>
    <p>
      你写一个课程列表页，需要先从数据库或内容文件里把课程取出来，再渲染成列表。在过去的前端开发里，这件事有两步固定的仪式：组件挂载后发起请求（<code>useEffect</code> 里 <code>fetch</code>），再用一个状态存返回结果，期间还要处理加载中和报错。数据拿回来之前，页面是一片空白。
    </p>
    <p>
      更别扭的是，查数据库要用到连接串这类密钥，而前端代码会被下载到用户浏览器里，密钥不能下发。于是你不得不在中间再搭一层 API 服务转发。问题就变成：<strong>如果组件本来就在服务器上跑，它能不能直接取数据，省掉这一整圈绕路？</strong>
    </p>

    <h2>客户端取数流程</h2>
    <p>
      最朴素的做法，是承认「组件只在浏览器里跑」这个前提，老老实实走客户端取数：页面先渲染空壳，挂载后发请求，拿到数据再 <code>setState</code> 更新。这套做法做对了一件事——<strong>它把数据获取变成了组件生命周期的一部分</strong>，逻辑是自洽的。
    </p>
    <p>
      但它的前提是「组件一定在浏览器里」。一旦接受这个前提，你就注定要多花一趟网络往返、多写一套加载态，还得为「浏览器做不到的事」额外加一层服务端。
    </p>

    <h2>首屏空白与请求瀑布</h2>
    <ul>
      <li>首屏必然先空后填：HTML 先到、数据后到，用户看到的是一段等待过程。</li>
      <li>访问数据库或文件系统的密钥不能下发到浏览器，只能多搭一层 API 中转。</li>
      <li>每个需要数据的组件都要重复「挂载 → 请求 → 存状态 → 处理错误」的样板代码。</li>
      <li>数据逻辑被打包进前端 bundle，代码体积增大，且服务端能力（如 Prisma、Stripe SDK）无法直接使用。</li>
      <li>敏感逻辑若写在客户端，等于把实现细节摊开给所有人看。</li>
    </ul>

    <h2>默认服务端组件</h2>
    <p>
      不推翻「组件」这个概念，而是给组件<strong>多一种运行环境</strong>。在 App Router 里，<code>app/</code> 目录下的组件<strong>默认就是 Server Component（服务端组件）</strong>，不需要任何声明。它们在服务器上渲染，产出的结果才发给浏览器，代码本身<strong>不进入前端 bundle</strong>。
    </p>
    <p>
      这个设定直接解锁了两类能力。第一类是<strong>数据获取</strong>：组件可以写成 <code>async</code>，内部 <code>await</code> 数据库查询或文件读取，用结果直接渲染，不需要 <code>useEffect</code>，也不需要中间状态。
    </p>
    <p>
      第二类是<strong>服务端专属能力</strong>：可以直接访问数据库、读取文件系统、使用服务端 SDK，以及安全地读取只在服务端存在的环境变量与密钥，因为这些代码根本不会被打包给浏览器。把密钥和敏感逻辑留在这一层，是它最实在的价值。
    </p>
    <p>
      有得必有失，能力边界同样清晰。Server Component <strong>不能</strong>使用 <code>useState</code>、<code>useEffect</code> 这类客户端 Hook，不能绑定 <code>onClick</code>、<code>onChange</code> 等事件处理器，也不能访问浏览器的 <code>window</code>、<code>document</code>。原因是这些能力都依赖一个持续活着的浏览器环境，而服务端组件渲染完就结束，既没有浏览器对象，也没有反复交互的时机。
    </p>
    <table>
      <thead>
        <tr><th>能力</th><th>Server Component</th></tr>
      </thead>
      <tbody>
        <tr><td>直接 <code>await</code> 取数据</td><td>可以</td></tr>
        <tr><td>访问数据库／文件系统／密钥</td><td>可以</td></tr>
        <tr><td>使用 <code>useState</code>／<code>useEffect</code></td><td>不可以</td></tr>
        <tr><td>绑定 <code>onClick</code> 等事件</td><td>不可以</td></tr>
        <tr><td>访问 <code>window</code>／<code>document</code></td><td>不可以</td></tr>
      </tbody>
    </table>
    <p>
      那需要交互的部分怎么办？用<strong>组合</strong>：外层 Server Component 负责取数据，把数据通过 <code>props</code> 传给内层的 Client Component，由后者接管点击、输入等交互。这样既保住了服务端取数的优势，又满足了交互需求。
    </p>
    <div class="lesson-box hint">
      <strong>一条重要的实践原则：</strong>尽量把 <code>"use client"</code> 的边界<strong>下推到叶子组件</strong>。边界越靠下，留在服务端的代码就越多，客户端 bundle 就越小。理想形态是「大片服务端组件里，嵌着几个小而独立的交互组件」，而不是把一个整页都标成客户端。
    </div>
    <div class="lesson-box warn">
      <strong>调试小技巧：</strong>在组件里写一句 <code>console.log</code>，日志出现在终端就是服务端渲染，出现在浏览器控制台就是客户端渲染，比猜测可靠得多。
    </div>

    <h2>两端组件能力对照</h2>
    <figure class="lesson-figure">
      <figcaption>对比服务端与客户端组件各自的能力清单，看看哪些操作会直接被拦下。</figcaption>
      <X05ServerComponents />
    </figure>

    <h2>服务端取数与渲染</h2>
    <p>
      Server Component 把「取数据」和「渲染」重新合并回了一处：组件默认在服务端运行，可以 <code>await</code> 数据、访问数据库与密钥，且不占用前端 bundle；代价是不能使用客户端 Hook、事件与浏览器 API。需要交互时，就用 Server 取数、Client 接管的组合模式把两者拼起来。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Server Component」</span>是 App Router 中默认的组件形态，在服务端运行、渲染结果才发给浏览器，代码不进入前端 bundle。它可以直接 <code>await</code> 获取数据，访问数据库、文件系统、服务端 SDK 与环境密钥，但不能使用 <code>useState</code>／<code>useEffect</code> 等客户端 Hook、事件处理器或 <code>window</code>／<code>document</code>。实践上应把 <code>"use client"</code> 边界尽量下推到叶子组件，让更多代码留在服务端，敏感逻辑与密钥也应保留在这一层。
    </div>
  </LessonArticle>
</template>
