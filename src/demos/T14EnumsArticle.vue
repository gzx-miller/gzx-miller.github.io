<script setup lang="ts">
import T14Enums from './T14Enums.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程状态写成 <code>enum CourseStatus { Draft, Review, Published, Archived }</code>，可打印出来是 <code>0</code>、<code>1</code>、<code>2</code>——日志里根本分不清哪个是「已发布」，枚举的名字去哪了？
    </div>

    <h2>状态集合与枚举</h2>
    <p>
      你要给课程的发布流程建模：草稿、审核中、已发布、已归档，一共四个状态。用字符串硬编码会让魔法字符串散落各处，于是你想到枚举——它看起来既能当类型用、又能当值用，还有自动补全。可用起来很快撞上两个疑问：为什么日志里打出的是数字而不是名字？为什么把状态存进接口之后，别人拿到 <code>2</code> 完全不知道对应哪个状态？
    </p>
    <p>
      <strong>枚举不只是「一组常量」，它同时产出运行时的对象。</strong>这层运行时代价与伴随的行为，才是选型真正要权衡的地方。
    </p>

    <h2>数字枚举的写法</h2>
    <p>
      先用<strong>数字枚举</strong>：<code>enum CourseStatus { Draft, Review, Published, Archived }</code>。成员依次是 0、1、2、3，写法最省事，比较大小也方便，<code>status &lt; CourseStatus.Archived</code> 这样的判断直接可用。
    </p>
    <p>
      它做对了一件事：<strong>把「一组合法状态」收敛成单一来源，类型与取值共用同一个名字</strong>。这个目标完全正确，后面的方案也都在保留它。
    </p>

    <h2>反向映射的代价</h2>
    <ul>
      <li>数字枚举的值是数字，序列化到接口或日志后只剩下 <code>2</code>，脱离代码就失去意义。</li>
      <li>它会生成<strong>反向映射</strong>：除了 <code>CourseStatus.Draft → 0</code>，还多了 <code>CourseStatus[0] → 'Draft'</code>；用 <code>Object.entries</code> 遍历时会同时拿到两组键，必须额外过滤。</li>
      <li>还有一个隐形陷阱：<strong>任何数字都能赋给数字枚举成员</strong>，<code>const s: CourseStatus = 99</code> 竟然不报错，状态的合法性并没有被真正约束住。</li>
      <li>枚举会产出运行时代码，虽然体积不大，但无法被树摇掉，作为库对外导出时还要考虑转译兼容性。</li>
    </ul>

    <h2>字符串枚举形式</h2>
    <p>
      把值换成字符串，就得到<strong>字符串枚举</strong>：<code>enum CourseLevel { Beginner = 'beginner', Advanced = 'advanced' }</code>。它只有正向映射，序列化出去就是可读的字符串，跨代码边界也不会失真；代价是失去自动递增与大小比较的能力。
    </p>
    <p>
      若在意产物体积，可以换成 <code>const enum</code>：它在编译期把成员直接<strong>内联</strong>成字面量，运行时完全不产出对象。但这里有两个必须记住的坑：<code>const enum</code> 依赖编译器看到使用现场才能完成内联，<strong>在库的 <code>.d.ts</code> 声明里、以及配合 <code>isolatedModules</code> 的单文件转译流程下都存在兼容风险</strong>——一块文件一块文件地转译时，编译器根本没有全局信息去内联。因此<strong>对外发布的类型中应避免导出 <code>const enum</code></strong>，也不要使用 <code>declare const enum</code> 这类 ambient 形式。
    </p>
    <p>
      更现代的选择是干脆不用枚举，改用 <code>as const</code> 对象配合联合字面量：
    </p>
    <p>
      <code>const STATUS = { Draft: 'draft', Published: 'published' } as const</code>，
      <code>type Status = typeof STATUS[keyof typeof STATUS]</code>。
    </p>
    <p>
      这样得到的对象就是一个普通常量，能被树摇；由它派生的联合类型既精确又轻量。若想给每个状态补一条中文说明，就用 <code>Record&lt;Status, string&gt;</code> 把映射收敛成一张表，保证「新增状态必须补上说明」，漏了就立刻报错——这正是 <code>satisfies</code> 与联合字面量配合起来最顺手的地方：既校验了完整性，又保住了字面量类型。
    </p>
    <p>
      选择 <code>as const</code> 还有一个常被忽略的好处：派生出来的对象就是普通值，可以直接参与逻辑判断、可以序列化、可以随手传进函数；而枚举成员在写法上处处受限，需要额外的转换才能参与比较。当状态还要与接口字段、路由参数一一对应时，这一点尤其省事。
    </p>
    <div class="lesson-box hint">
      <strong>一句话选型：</strong>需要运行时可枚举、且只在应用内部使用时，用字符串枚举；明确不对外发布又追求零运行时开销时，可用 <code>const enum</code>；更推荐 <code>as const</code> 加联合字面量——产物最轻、组合最灵活，再用 <code>satisfies</code> 与 <code>Record</code> 反过来校验配置是否完整。
    </div>
    <div class="lesson-box warn">
      用 <code>Object.entries</code> 遍历数字枚举时，<strong>记得过滤反向映射产生的键</strong>（例如用 <code>isNaN(Number(key))</code> 判断），否则状态列表里会混进一堆数字键。
    </div>

    <h2>取值与反向映射</h2>
    <figure class="lesson-figure">
      <figcaption>推进一步看看数字枚举的取值与反向映射，再切换难度，对照字符串枚举的可读性。</figcaption>
      <T14Enums />
    </figure>

    <h2>枚举与联合之别</h2>
    <p>
      枚举与联合字面量解决的是同一件事：把有限的状态集合收敛成单一来源，让非法取值无法通过编译。区别在于枚举会产出运行时对象，数字枚举还带着反向映射与「任意数字都能赋值」的漏洞；<code>const enum</code> 会内联但不适合对外发布；<code>as const</code> 加联合字面量产物最轻，配合 <code>satisfies</code> 与 <code>Record</code> 还能反过来校验配置的完整性。
    </p>
    <div class="lesson-term">
      <span class="term-name">「枚举与常量断言」</span><code>enum</code> 提供运行时值，<strong>数字枚举有正反双向映射</strong>且不阻止任意数字赋值，字符串枚举只有正向映射、更利于序列化；<code>const enum</code> 在编译期内联成员、不产出运行时对象，但在 <code>.d.ts</code> 与 <code>isolatedModules</code> 场景下有兼容风险，不应对外导出。用 <code>as const</code> 对象配合 <code>typeof</code> 与 <code>keyof</code> 可派生联合字面量，产物更轻，再用 <code>satisfies</code>、<code>Record</code> 反向校验配置完整性。
    </div>
  </LessonArticle>
</template>
