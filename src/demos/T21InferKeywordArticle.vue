<script setup lang="ts">
import T21InferKeyword from './T21InferKeyword.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>函数写完了，我只想拿到它的「返回值类型」给别处复用，可照着实现再抄一遍类型总会和代码跑偏——有没有办法让类型自己去函数签名里，把那个类型抠出来？
    </div>

    <h2>请求层类型复用</h2>
    <p>
      你的项目里有一层请求函数：<code>fetchUser</code> 返回用户对象，<code>getOrders</code> 返回订单数组，<code>createProduct</code> 返回商品。接下来你会发现，这些「返回的东西的类型」到处都要用——接口层缓存要标注它、表单回填要接收它、单元测试要断言它、Mock 数据要造一份符合它的。
    </p>
    <p>
      麻烦在于：这个类型是「推」出来的，不该是「抄」出来的。你一旦照着实现把返回值结构手写成一个新类型，代码与类型就变成了两份互相独立的事实：函数今天多返回一个 <code>email</code> 字段，你手写的那份不会跟着变，编辑器却依然当它是旧结构——<strong>类型检查带来的安全感成了假的</strong>。更别扭的是，有些类型压根抄不出来：<code>Promise</code> 里包着什么、数组里装的是什么、构造函数的实例长什么样，都得从别处的类型里反推。
    </p>

    <h2>类型副本手抄</h2>
    <p>
      最朴素的做法：手动复制。函数返回 <code>{ id: number; name: string }</code>，我就在旁边写一份 <code>type UserResult = { id: number; name: string }</code>；返回值是 <code>Promise&lt;User&gt;</code>，我就把 <code>User</code> 再单独定义一遍。
    </p>
    <p>
      这个方案做对了最基础的一层：<strong>它承认「返回值类型」是一个值得被命名、被复用的东西</strong>，也确实让调用方有类型可用。只要函数不再变，这份手写类型就是对的；项目规模很小的时候，它甚至够用。
    </p>

    <h2>副本漂移风险</h2>
    <ul>
      <li>两份事实必然漂移：实现改了返回值，手写的那份类型不会跟着改，编译期不报错，运行时结构却已经对不上。</li>
      <li>写法重复：同一个函数的返回类型，在缓存、表单、测试里各抄一遍，改一次要改四处。</li>
      <li>包装类型抠不出来：<code>Promise&lt;User&gt;</code> 里的 <code>User</code>、<code>User[]</code> 里的元素、构造函数的实例类型，都不在函数体里，抄不出来。</li>
      <li>无法表达「关系」：手写的类型是死的，它不随入参变化，也无法从泛型参数派生，丢掉了类型之间本应有的关联。</li>
    </ul>

    <h2>编译器匹配提取</h2>
    <p>
      不推翻「从函数签名取类型」，而是换一种取法：既然函数的形状在类型里是清晰的，就让编译器去<strong>匹配这个形状，并把匹配到的那部分反推出来</strong>。这就是条件类型加 <code>infer</code> 的写法：
    </p>
    <p>
      <code>type MyReturnType&lt;T&gt; = T extends (...args: any[]) =&gt; infer R ? R : never</code>
    </p>
    <p>
      读法是：先判断 <code>T</code> 是不是一个函数类型；如果匹配，就把它的返回位置用 <code>infer R</code> 这个「占位符」占住。形状一旦对上，TypeScript 便反向推导出 <code>R</code> 的真实类型，并把它填进真分支返回。所以说，<code>infer</code> 的本质就是<strong>在条件类型的模式里挖一个洞，让编译器往里填它推出来的类型</strong>。
    </p>
    <p>
      理解了这一点，剩下的只是「换洞的位置」。不同的容器，无非是把 <code>infer</code> 放进不同的形状里：
    </p>
    <table>
      <thead>
        <tr><th>想提取的东西</th><th>匹配模式</th><th>对应内置工具</th></tr>
      </thead>
      <tbody>
        <tr><td>函数返回类型</td><td><code>(...args: any[]) =&gt; infer R</code></td><td><code>ReturnType</code></td></tr>
        <tr><td>函数参数元组</td><td><code>(...args: infer P) =&gt; any</code></td><td><code>Parameters</code></td></tr>
        <tr><td>数组元素类型</td><td><code>(infer E)[]</code></td><td>可自行封装</td></tr>
        <tr><td>Promise 内部类型</td><td><code>Promise&lt;infer U&gt;</code></td><td><code>Awaited</code></td></tr>
        <tr><td>构造函数实例类型</td><td><code>new (...args: any[]) =&gt; infer I</code></td><td><code>InstanceType</code></td></tr>
      </tbody>
    </table>
    <p>
      接着是第二层：当匹配到的类型本身还是同一个容器时，递归即可。以解包 Promise 为例，把 <code>infer U</code> 捕获到的类型再喂回自己，直到它不再是 Promise 为止，<code>Promise&lt;Promise&lt;string&gt;&gt;</code> 就能一路剥到 <code>string</code>。这就把一次性的提取，泛化成了一个可复用的解包工具。
    </p>
    <p>
      <code>infer</code> 还能用在字符串与元组里：形如 <code>T extends `${infer P}:${string}` ? P : never</code> 可以从 <code>'click:button'</code> 中抠出 <code>'click'</code>；而 <code>[infer A, infer B]</code> 能在同一个模式里同时捕获元组两端，一次交换成 <code>[B, A]</code>。也就是说，<strong>同一个模式里可以放多个 <code>infer</code> 变量</strong>，只要形状对得上。
    </p>
    <div class="lesson-box warn">
      <strong>四个必须记住的坑：</strong>第一，<code>infer</code> 只能出现在条件类型的 <code>extends</code> 分支里，不能脱离条件类型单独声明使用。第二，同一模式里可以有多个 <code>infer</code> 变量，各捕获一段。第三，<code>infer</code> 遇到函数重载时，取到的是<strong>最后一个实现签名的返回类型</strong>，用之前要留意。第四，<code>infer</code> 捕获到的变量只存在于条件类型的<strong>真分支</strong>内，在假分支里引用它会直接报错。
    </div>

    <h2>四种提取模式对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「返回类型 / Promise 解包 / 数组元素 / 参数类型」标签，对照看每种 <code>infer</code> 模式最终抠出来的结果。</figcaption>
      <T21InferKeyword />
    </figure>

    <h2>内置工具依赖推导</h2>
    <p>
      <code>infer</code> 把「从既有类型里取出子类型」这件事，从手抄变成了推导：把待提取的位置写成模式，编译器匹配后把 <code>infer</code> 反填进去，换不同的形状就能提取返回类型、参数元组、数组元素、Promise 内部类型与构造函数实例。它和递归一组合，正是 <code>ReturnType</code>、<code>Parameters</code>、<code>InstanceType</code>、<code>Awaited</code> 这一票内置工具的共同底座。
    </p>
    <div class="lesson-term">
      <span class="term-name">「infer」</span>是条件类型 <code>extends</code> 分支中声明的待推断类型变量，用来「占住」匹配到的类型位置，由编译器反向推导其取值，常写作 <code>T extends (...args: any[]) =&gt; infer R ? R : never</code>。它只能出现在条件类型内，同一模式可有多个；遇到重载取最后一个实现签名；捕获到的变量只在真分支可用。
    </div>
  </LessonArticle>
</template>
