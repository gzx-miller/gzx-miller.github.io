<script setup lang="ts">
import T04Generics from './T04Generics.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>同一个响应包装函数，既要装课程列表、又要装用户信息，写成 <code>any</code> 什么都能装，可调用方却再也拿不到字段提示——能不能既只写一份实现，又保住 <code>result.data</code> 的精确类型？
    </div>

    <h2>提出问题</h2>
    <p>
      课程页和用户页都需要一层 <code>{ data, message }</code> 的响应外壳：请求成功时把负载塞进 <code>data</code>，再附一句提示。实现逻辑完全相同，你自然想把它抽成一个工具函数复用。
    </p>
    <p>
      可一旦抽出来，问题就来了：课程列表是 <code>Course[]</code>，用户信息是另一个形状，这个函数该怎么描述它的输入输出？退一步用 <code>any</code> 最省事，但通用性是用<strong>丢掉全部类型信息</strong>换来的——调用方拿到 <code>any</code> 之后，<code>result.data</code> 里有什么全靠记忆。所以真正要解决的是：<strong>如何复用 API、列表与工具函数的实现，同时不丢失类型之间的精确关联</strong>。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法，是让函数不关心负载类型，直接收 <code>any</code>：
    </p>
    <p>
      <code>function success(data: any) { return { data, message: '读取成功' } }</code>
    </p>
    <p>
      它做对了一件实实在在的事：<strong>实现只有一份</strong>，课程、用户乃至任何数据都能复用它，不需要为每种数据类型复制粘贴一遍。这正是「复用」最核心的诉求。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>返回的 <code>data</code> 是 <code>any</code>，元素的类型、字段名全部丢失。</li>
      <li>调用方对 <code>any</code> 做任何操作都不报错，写法再错也要等到运行时才暴露。</li>
      <li>想换成 <code>unknown</code> 更安全，却更啰嗦：每次使用前都得先做类型判断。</li>
      <li>若为课程、用户各写一份实现，就退回了复制粘贴，复用性荡然无存。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「一份实现多处复用」，而是让<strong>类型本身也变成一个变量</strong>——这就是泛型。把会随调用而变的负载类型抽成类型参数 <code>T</code>，让它同时出现在参数与返回类型里：
    </p>
    <p>
      <code>interface ApiResult&lt;T&gt; { data: T; message: string }</code><br />
      <code>function success&lt;T&gt;(data: T): ApiResult&lt;T&gt; {</code><br />
      <code>&nbsp;&nbsp;return { data, message: '读取成功' }</code><br />
      <code>}</code>
    </p>
    <p>
      这里的 <code>T</code> 像函数的参数一样，只是一个占位。调用 <code>success(courses)</code> 时，实参类型 <code>Course[]</code> 会自动推导出 <code>T</code>，返回值就是 <code>ApiResult&lt;Course[]&gt;</code>，于是 <code>result.data[0].title</code> 精确可用。泛型的要害正在于它<strong>保住了输入与输出之间的关系</strong>：入参是什么元素类型，返回值就是什么元素类型。
    </p>
    <ul>
      <li>类型参数名应表达角色，如 <code>T</code>、<code>Item</code>、<code>Key</code>、<code>Value</code>；单字母仅用于最常见的泛型场景。</li>
      <li>仅在定义一个位置出现、与其他类型无关的参数通常没有价值，可用具体类型替代。</li>
      <li>泛型约束（如 <code>T extends object</code>）让实现侧能安全访问传入类型的公共属性。</li>
      <li>把重复出现的具体类型抽成类型参数，是重构泛型最常用的切入点。</li>
    </ul>
    <p>
      如果实现内部需要访问传入类型的公共属性，就得给类型参数加上<strong>泛型约束</strong>，写成 <code>T extends object</code> 之类：形状满足约束的实参才允许传入，实现侧也才敢安全地读取这些属性。而日常重构里最常用的切入点，是把反复出现的具体类型抽成类型参数——当同一段逻辑里 <code>Course</code>、<code>User</code> 各写了一遍，那个位置往往就该是一个 <code>T</code>。
    </p>
    <p>
      对比最小方案就能看清收益：它同样是「一次实现、处处复用」，却避开了退化成 <code>any</code> 或 <code>unknown</code> 后丢失类型信息的老路。泛型并不神秘，它只是把「此处类型由调用方决定」写进签名，让编译器沿着参数与返回值把这份关系串起来。
    </p>

    <h2>动手试试</h2>
    <p>
      最直接的验证方式是：故意传一个类型不符的实参，观察报错是否顺着泛型链路出现在调用处，而不是等到运行时才暴露。链路一旦成立，类型错误就止步于调用边界。
    </p>
    <figure class="lesson-figure">
      <figcaption>看同一份成功响应如何装下课程列表，并让 <code>result.data</code> 保持精确类型。</figcaption>
      <T04Generics />
    </figure>

    <h2>总结</h2>
    <p>
      泛型是把类型当作变量来建模的手段：函数、类与容器复用同一份实现，而具体的类型参数在调用时由实参自动推出。它让「入参的元素类型」与「返回值里的元素类型」保持一致，既留下了复用的便利，又没有付出丢掉类型信息的代价。
    </p>
    <div class="lesson-term">
      <span class="term-name">「泛型」</span>指把类型本身当作参与建模的变量：函数、类与容器复用同一份实现，调用时由实参自动推导出具体的类型参数（如 <code>success&lt;T&gt;</code>），从而保持输入与输出之间的精确关系，避免为换取通用性而退化为 <code>any</code> 或 <code>unknown</code> 后丢失全部类型信息。类型参数名应表达角色，仅在单处出现且无关联的参数通常可用具体类型替代。
    </div>
  </LessonArticle>
</template>
