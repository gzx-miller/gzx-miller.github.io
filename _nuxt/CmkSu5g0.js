const n=`<script setup lang="ts">
import T09IntersectionMixin from './T09IntersectionMixin.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程卡片既要 <code>id</code>、又要创建与更新时间、还要发布状态，而「带 id」「带时间戳」这些能力在别的模型里也要用——难道每种模型都得把这几个字段再抄一遍？
    </div>

    <h2>跨模型能力复用</h2>
    <p>
      领域对象很少从零长成。课程卡片上「有 id」是一种能力，「有时间戳」是一种能力，「能发布」又是一种能力，这些能力往往是跨模型复用的：文章、用户、订单身上也各自需要时间戳和标识。描述这类对象时，我们想要的其实不是「继承自某个基类」，而是<strong>把几块能力拼装到一起</strong>。
    </p>
    <p>
      而继承只能表达「是一个」。用 <code>extends</code> 层层向下，一层 BaseEntity、一层 Timestamped、一层 Publishable，链条一长，改动基类就会波及所有后继者；更尴尬的是，一个对象既要是 A 又要是 B 时，单继承根本插不进去。建模卡壳的地方，往往不是字段写不出来，而是<strong>关系的表达方式选错了</strong>。
    </p>

    <h2>单一巨型接口</h2>
    <p>
      最省事的做法：把所有字段一股脑塞进一个大 <code>interface</code>，需要什么就在里面写什么。
    </p>
    <p>
      这个方案做对了一件事：<strong>单文件里它非常直白</strong>。结构一眼看全，不需要理解任何组合规则，改字段也只需在一个地方动手。对只出现一次、又不打算复用的模型，这就是最合适的写法。
    </p>

    <h2>继承链脆弱性</h2>
    <ul>
      <li>一整块字段无法按能力拆开复用，「时间戳」要在每个模型里各抄一遍。</li>
      <li>换成继承链又会变得脆弱——改基类会牵连所有子类，且无法同时继承两个基类。</li>
      <li>想在运行时给对象叠加一段行为，纯类型结构无能为力。</li>
      <li>当两个来源都定义了同名属性、而类型又对不上时，冲突不会显式暴露。</li>
    </ul>

    <h2>交叉类型拼装</h2>
    <p>
      不推翻「把能力拼到一起」，而是换一种更贴合语义的拼装方式。先把可复用的能力各自拆成小接口：<code>WithId</code> 负责标识，<code>Timestamped</code> 负责创建与更新时间，<code>Publishable</code> 负责发布状态与发布日期。
    </p>
    <p>
      再用<strong>交叉类型</strong>把它们合并：<code>CourseCard = WithId &amp; Timestamped &amp; Publishable &amp; { title; teacher }</code>。交叉类型的要求是结果<strong>同时满足所有成员</strong>——它表达的是「既是…也是…」的组合关系，而不是继承那种「是一个」的层级关系。想让一个类型只有某个字段被删掉、被否决，交叉类型做不到，因为它只增不减，这正是它语义清晰的地方。
    </p>
    <table>
      <thead>
        <tr><th>方式</th><th>表达的语义</th><th>改动影响</th></tr>
      </thead>
      <tbody>
        <tr><td><code>extends</code> 继承</td><td>「是一个」子类型关系</td><td>改基类牵连所有子类</td></tr>
        <tr><td>交叉类型 <code>&amp;</code></td><td>「既是…也是…」的组合</td><td>只影响组合出的一方</td></tr>
      </tbody>
    </table>
    <div class="lesson-box warn">
      <strong>一个重要的信号：</strong>当两个成员定义了同名属性、而它们的类型没有交集时，交叉结果会把该属性收窄成 <code>never</code>。这不是报错噪音，而是<strong>建模冲突的显式暴露</strong>——它逼你去正视「同一个字段为什么出现了两种互斥的定义」。
    </div>
    <p>
      类型拼好了，行为也可以在运行时拼。用 <strong>Mixin 函数</strong>接收一个基础对象或基类构造函数，返回叠加了新能力的新类，配合泛型约束（形如 <code>TBase extends Constructor</code>）保留原有的构造签名，从而在类型层面也不丢信息。这样每一层能力都是一段可以独立测试、独立复用的增强。
    </p>
    <div class="lesson-box hint">
      <strong>克制一点：</strong>Mixin 链超过两层之后，类型推导会明显变慢，调试也更绕。能用组合表达的关系，优先用组合，而不是继续往链上叠。
    </div>

    <h2>多块能力叠加</h2>
    <figure class="lesson-figure">
      <figcaption>点按钮切换发布状态，感受交叉类型拼出的卡片同时具备多块能力。</figcaption>
      <T09IntersectionMixin />
    </figure>

    <h2>组合与继承取舍</h2>
    <p>
      交叉类型与 Mixin 解决的是同一件事的两面：类型层面用 <code>&amp;</code> 把多个小接口组合成「兼具所有能力」的模型，实现层面用函数逐层叠加行为。它比多层继承更灵活，也把「既是…也是…」这种关系表达得恰到好处——只是别忘了，同名属性的 <code>never</code> 是在提醒你回头检查建模。
    </p>
    <div class="lesson-term">
      <span class="term-name">「交叉类型」</span>用 <code>&amp;</code> 把多个对象类型合并，要求结果同时满足所有成员的约束；同名属性类型无交集时退化为 <code>never</code>，用以暴露冲突。与之配套的 <strong>Mixin</strong> 用函数接收基类构造函数、返回增强后的新类来组合能力，配合 <code>TBase extends Constructor</code> 保留构造签名，比多层继承更灵活。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
