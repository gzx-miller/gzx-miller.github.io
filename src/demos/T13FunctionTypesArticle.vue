<script setup lang="ts">
import T13FunctionTypes from './T13FunctionTypes.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个 <code>fetchCourse</code>，传单个 id 时返回课程详情、传 id 数组时返回列表，可返回值类型只能写成两者的联合——调用处每次都要再判断一次，编译器为什么帮不上忙？
    </div>

    <h2>提出问题</h2>
    <p>
      你要写一个查询函数：传单个 <code>id</code> 时返回一份课程详情（带 <code>teacher</code>、<code>duration</code>），传 <code>id</code> 数组时返回一个课程列表。参数写成联合 <code>number | number[]</code> 当然能编译通过，但返回类型就变成了 <code>CourseDetail | Course[]</code>：拿到结果的一方根本不知道这次会得到哪一种，只能自己写判断，或者干脆断言。<strong>输入与输出之间的对应关系，在这里彻底丢失了。</strong>
    </p>
    <p>
      还有一类更常见的问题：数据来自接口或本地 JSON，类型是 <code>unknown</code>。你想在校验通过之后把它安全地当业务类型使用，可写一个返回 <code>boolean</code> 的检查函数，编译器并不会因为「你检查过了」就改变对它的看法。
    </p>

    <h2>最小方案</h2>
    <p>
      先把函数形状本身写好。函数类型最简单的写法是类型表达式 <code>(x: number) =&gt; CourseDetail</code>；如果这个函数还得挂载额外属性（比如缓存、元信息），就换成调用签名：
      <code>interface Fetcher { (id: number): CourseDetail; cache: Map&lt;number, CourseDetail&gt; }</code>。后者描述的是「可调用的对象」，比单纯的箭头类型多了一层属性。
    </p>
    <p>
      至于两种输入形态的查询，先用一个更宽的类型顶上去：<code>function fetchCourse(input: number | number[]): CourseDetail | Course[]</code>。它做对了一件事：<strong>承认这个函数确实有两种输入与两种输出</strong>，实现里再按 <code>typeof input === 'number'</code> 分支处理，逻辑本身并没有错。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>返回值被合并成联合，调用方拿到结果后无法直接确定是哪一种，输入与输出的对应关系丢失了。</li>
      <li>想访问 <code>result.teacher</code> 还得先判断，或者退化成类型断言，安全边界又被绕了过去。</li>
      <li>校验函数若只返回 <code>boolean</code>，<code>unknown</code> 依旧是 <code>unknown</code>，检查结果没有被编译器采纳。</li>
      <li>判断逻辑散落在每个调用点，重复、易漏，还难以统一维护。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      第一步，把「输入形状 → 输出类型」的对应关系写成多条<strong>重载签名</strong>：先声明 <code>function fetchCourse(id: number): CourseDetail</code>，再声明 <code>function fetchCourse(ids: number[]): Course[]</code>，最后才写真正带分支的实现签名。实现签名对外不可见，调用时命中的是前面那些签名——传单个 id 就精确得到 <code>CourseDetail</code>，传数组就精确得到 <code>Course[]</code>。
    </p>
    <div class="lesson-box warn">
      <strong>顺序是有意义的：</strong>匹配严格按照声明顺序进行，<strong>重载签名必须从最具体排到最宽泛</strong>。若把宽泛的签名写在前面，后面的具体签名就永远轮不到，等于白写。另外重载数量不宜过多，超过三四个就该考虑改用联合参数或对象配置，可读性会好得多。
    </div>
    <p>
      第二步，解决 <code>unknown</code> 的收窄。写一个返回类型为<strong>断言签名</strong>的函数：<code>function assertCourse(obj: unknown): asserts obj is Course</code>。它的返回值不再是 <code>boolean</code>，而是在运行时真的做检查，一旦不满足就直接抛错；只要这次调用没有抛异常，之后的代码里编译器就把 <code>obj</code> 当作 <code>Course</code>。<strong>它的价值不在于返回了什么，而在于调用之后类型被收窄了</strong>——这正是把不可信数据安全引入类型系统的钥匙。
    </p>
    <p>
      第三步，把 <code>this</code> 的约束也纳入函数类型。函数的第一个参数位置可以放一个伪参数 <code>this: T</code>，用来精确限定方法内 <code>this</code> 的形状，避免在回调或方法被抽取时 <code>this</code> 悄悄退化。
    </p>
    <p>
      回头看，这三个工具其实在回答同一件事：<strong>如何让「类型」与「运行时的真实行为」保持一致</strong>。重载把编译期的输入输出关系写准，断言函数则把运行时的校验结果反馈回编译期，两者一前一后，把函数边界上的不确定性收拾干净。
    </p>
    <table>
      <thead>
        <tr>
          <th>写法</th>
          <th>适用场景</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>(x: T) =&gt; R</code> 类型表达式</td>
          <td>普通函数形状，最常见</td>
        </tr>
        <tr>
          <td>调用签名 <code>{ (x: T): R }</code></td>
          <td>需要在函数上附加属性</td>
        </tr>
        <tr>
          <td>重载签名</td>
          <td>同一函数按输入返回不同精确类型</td>
        </tr>
        <tr>
          <td>断言函数 <code>asserts x is T</code></td>
          <td>运行时校验，并让后续代码自动收窄</td>
        </tr>
      </tbody>
    </table>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>点两个按钮分别走重载的两个分支，再输入一段 JSON 触发断言函数，感受调用前后类型的差别。</figcaption>
      <T13FunctionTypes />
    </figure>

    <h2>总结</h2>
    <p>
      函数类型的核心，是把「输入与输出的对应关系」写进签名里：需要附加属性就用调用签名，多种输入各自对应不同输出就用重载并按由具体到宽泛排序，消费 <code>unknown</code> 就用断言函数把校验与收窄合成一步。签名一旦精确，调用处的判断逻辑就都省下来了。
    </p>
    <div class="lesson-term">
      <span class="term-name">「函数重载与断言函数」</span>用多条重载签名描述同一函数名在不同输入下返回的精确类型，签名须<strong>由最具体到最宽泛排列</strong>，实现签名对外不可见；断言函数返回 <code>asserts value is T</code>，在运行时校验并让编译器在调用后自动收窄参数类型。函数形状可用 <code>(x: T) =&gt; R</code> 或调用签名表达，<code>this: T</code> 伪参数用于约束方法内的 <code>this</code>。
    </div>
  </LessonArticle>
</template>
