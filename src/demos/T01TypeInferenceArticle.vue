<script setup lang="ts">
import T01TypeInference from './T01TypeInference.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程表单里 <code>const name = 'Vue 3 实战'</code> 不写类型也能用，可剩余席位却得写成 <code>ref&lt;number | null&gt;(20)</code>——到底哪些类型可以让编译器自己猜，哪些必须亲手写明？
    </div>

    <h2>字面值的推断</h2>
    <p>
      你在做一个课程发布表单，字段有课程名、价格、剩余席位。写下 <code>const name = 'Vue 3 实战'</code> 时，编辑器立刻知道它是字符串；再写一个数组、一个对象，结构也照样被识别出来。于是你很自然地想：既然编译器什么都能看出来，那干脆一个类型都不写，代码最干净。
    </p>
    <p>
      麻烦在于，<strong>编译器猜的是「你此刻写下的那个值」，而不是「这个字段将来应该是什么」</strong>。当状态要在待付款、待发货、已完成之间切换，当席位可能为空，当函数要对外提供稳定接口时，靠初始值猜出来的类型要么窄得离谱，要么宽得离谱，错误会一路漏到运行时才发作。所以真正的问题不是「要不要类型」，而是<strong>哪条边界上必须由人来拍板</strong>。
    </p>

    <h2>省略类型标注</h2>
    <p>
      最省事的做法，是完全依赖推导，一个类型标注都不写：<code>const price = 99</code> 得到 <code>number</code>，<code>const tags = ['前端', 'Vue']</code> 得到 <code>string[]</code>，<code>const config = { host: 'localhost', port: 3000 }</code> 得到 <code>{ host: string; port: number }</code>。
    </p>
    <p>
      这个方案做对了一件很重要的事：<strong>显而易见的类型不必重复书写</strong>。局部变量由初始值就能算出准确结构，再手写一遍只是噪音，而且还可能与真实类型不一致。TypeScript 的便利正来自这里——它是从值推出类型，而不是逼你到处写注解。
    </p>

    <h2>边界处的失效</h2>
    <ul>
      <li>空数组推导成 <code>any[]</code>：<code>const list = []</code> 的元素类型彻底丢失，之后推入什么都放行。</li>
      <li><code>const</code> 推导出的是字面量类型：<code>const status = 'idle'</code> 被推成 <code>'idle'</code>，想让它承接 <code>'loading'</code>、<code>'done'</code> 根本做不到。</li>
      <li>初始值为空：<code>let user = null</code> 推成 <code>null</code>，后面想赋成用户对象就被拦下。</li>
      <li>函数参数没有标注就是隐式 <code>any</code>：<code>function fetch(id) {}</code> 里任何实参都能塞进来，错误到运行时才出现。</li>
      <li>返回值类型悄悄漂移：今天返回对象、明天返回数组，调用方毫无预警。</li>
    </ul>

    <h2>显式标注时机</h2>
    <p>
      不推翻「能推就推」，而是划出必须显式声明的边界。第一类是<strong>需要放宽为联合</strong>的值：状态要写成 <code>'idle' | 'loading' | 'done'</code>，可为空的席位要写成 <code>number | null</code>，把「可能取哪些值」明明白白交给编译器。
    </p>
    <p>
      第二类是<strong>类型边界</strong>本身：函数的参数与返回值。参数是一份协议——你提供什么、我保证返回什么，所以公共函数优先为它们标注，形成稳定的调用契约，例如 <code>function fetch(id: string): Promise&lt;Data&gt;</code>。这里也有个取舍：返回值类型可以交由推导，但参数通常值得显式标注，因为它才是调用方唯一看得见的入口。
    </p>
    <p>
      第三类是<strong>需要宽类型或需要补充信息</strong>的场景。<code>const</code> 推出来的是字面量类型，若确实要一个宽泛的 <code>string</code>，就显式写 <code>const name: string = 'Vue 3 实战'</code>；若想既保留精确的字面量推导、又校验对象结构，用 <code>satisfies</code> 在保留推导的同时做约束。空数组则补上元素类型：<code>const list: Course[] = []</code>。
    </p>
    <table>
      <thead>
        <tr><th>场景</th><th>交给推导</th><th>显式标注</th></tr>
      </thead>
      <tbody>
        <tr><td>局部常量</td><td><code>const price = 99</code></td><td>几乎不必</td></tr>
        <tr><td>空数组</td><td>会退成 <code>any[]</code></td><td><code>const list: Course[] = []</code></td></tr>
        <tr><td>联合状态</td><td>只会是初始那一个值</td><td><code>let status: 'idle' | 'done'</code></td></tr>
        <tr><td>可为空</td><td>只会是 <code>null</code></td><td><code>let user: User | null</code></td></tr>
        <tr><td>公共函数</td><td>返回值可以推导</td><td>参数与返回类型写明</td></tr>
      </tbody>
    </table>
    <p>
      需要强调的一点是：显式标注的目的不是「写得更全」，而是<strong>在边界上拦住错误</strong>。当这些交界处都写明了类型，编译器就会在每次赋值与调用时替你核对——把字符串塞进 <code>number | null</code> 会被拦下，把错误实参传给公共函数也会被拦下，你甚至不必等到运行才发现问题。
    </p>
    <p>
      反过来看，用 <code>any</code> 去「绕开」类型报错，只是把检查关掉，问题依旧留在代码里。遇到确实无法预先确定的数据，应当用 <code>unknown</code> 接收，再配类型守卫逐层验证，而不是提前放弃类型安全。
    </p>
    <p>
      一句话收束这套取舍：<strong>只对必要的类型边界做显式标注，局部变量不重复写显而易见的类型</strong>。标注一旦只落在交界处，编译器就能在这些边界上替你盯着每一次赋值。
    </p>

    <h2>写法差异对照</h2>
    <figure class="lesson-figure">
      <figcaption>切换「自动推导 / 何时标注 / 类型收窄」三个标签，对照同一份表单写与不写标注的差别。</figcaption>
      <T01TypeInference />
    </figure>

    <h2>推导与标注分工</h2>
    <p>
      类型推导与显式标注不是二选一，而是分工：编译器负责从初始值推断显而易见的类型，人负责在边界处拍板。局部常量放心交给推导，联合、可空、空数组与公共函数参数则显式写明——省下的注解是噪音，留下的标注才是契约。
    </p>
    <div class="lesson-term">
      <span class="term-name">「类型推导」</span>指 TypeScript 依据变量的初始值自动推断其类型，局部常量与绝大多数返回值都无需标注，且 <code>const</code> 推出来的是字面量类型。当类型需放宽为联合（如可为 <code>null</code>）、推断不足以表达真实意图，或作为公共 API 的输入输出需要稳定契约时，才应显式标注；需要宽类型可写 <code>const name: string</code>，需要保留推导又要校验结构则用 <code>satisfies</code>。
    </div>
  </LessonArticle>
</template>
