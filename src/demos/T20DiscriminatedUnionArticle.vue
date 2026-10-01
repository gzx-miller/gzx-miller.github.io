<script setup lang="ts">
import T20DiscriminatedUnion from './T20DiscriminatedUnion.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>订单有五种状态，每种状态各自带着不同的字段。你在某个 <code>switch</code> 里漏掉了一种，代码照常编译、照常上线，直到那条状态的数据在页面上显示成空白——编译器为什么没能提醒你？
    </div>

    <h2>各状态独立字段</h2>
    <p>
      你在做一个订单详情页，订单有「待支付、已支付、已发货、已送达、已取消」五种状态，每种状态带的字段都不一样：已支付有支付方式，已发货有运单号，已取消有取消原因。于是你写了 <code>switch</code>，挨个处理。
    </p>
    <p>
      麻烦在于：<code>switch</code> 天生是「写几个 <code>case</code> 就处理几个」。业务方今天加一个「退款中」状态，你改了类型、也改了大部分逻辑，唯独漏掉了页面上的某一处 <code>switch</code>。编译器不会拦你，这个遗漏会一直潜伏着，直到某条真实数据走到那个分支，才以空白或崩溃的形式冒出来。
    </p>

    <h2>字符串状态判断</h2>
    <p>
      最省事的做法：给对象定义一个 <code>status</code> 字段，用字符串类型表示状态，业务代码里用 <code>if</code> 或 <code>switch</code> 判断它的取值。
    </p>
    <p>
      这个做法承认了一个关键事实：<strong>状态是业务模型里最重要的信息，值得被单独表达出来</strong>。状态驱动着界面的分支和可执行的操作，先把它写清楚，是建模的第一步。
    </p>

    <h2>字段堆叠的弊端</h2>
    <ul>
      <li><code>string</code> 太宽了，写错一个字母、传入一个根本不存在的状态，编译器都不会报错。</li>
      <li>各状态特有的字段只能都堆在同一个对象上、个个可选，访问前永远要判断「它到底有没有值」。</li>
      <li><code>switch</code> 漏写分支，编译器毫无反应，遗漏只能靠人工发现。</li>
      <li>新增状态时受影响的位置散落各处，没有一个清单告诉你「还有哪里没改」。</li>
    </ul>

    <h2>判别字段的收窄</h2>
    <p>
      不推翻「用状态分流」，而是做两件事：<strong>让每个状态成为独立的类型、让各自的字段归位</strong>；再让编译器替我们盯住分支有没有漏。
    </p>
    <p>
      第一步，给每种状态定义独立的接口，并让它们共享一个<strong>同名、同为字面量类型的判别字段</strong>：
      <code>interface PendingOrder { status: 'pending'; ... }</code>、
      <code>interface PaidOrder { status: 'paid'; payMethod: string; ... }</code>，
      再把它们联合成 <code>type Order = PendingOrder | PaidOrder | ...</code>。
    </p>
    <p>
      这一步带来的变化是：<strong>只有已支付状态能访问支付方式</strong>。在 <code>switch (order.status)</code> 的某个 <code>case</code> 里，TypeScript 会依据判别字段把值收窄成对应的成员类型，你能安全地访问它独有的字段，也会被拦住访问不该存在的字段。
    </p>
    <p>
      第二步，请出穷尽性检查。在 <code>switch</code> 的 <code>default</code> 分支里，把剩下的值赋给 <code>never</code>：若所有成员都已被处理，这个确实是 <code>never</code>，赋值合法；<strong>一旦漏掉某个 <code>case</code>，剩余类型就不再是 <code>never</code>，赋值会立刻报错</strong>。于是「新增状态忘了处理」从运行时问题变成了编译期错误。完整做法可以拆成四步。
    </p>
    <ol class="lesson-steps">
      <li>为每种状态定义接口，并加上相同名字的判别属性（如 <code>status</code>），值写成字面量类型。</li>
      <li>把所有成员联合成一个类型，作为函数的参数，调用方只能传入合法的组合。</li>
      <li>在 <code>switch</code> / <code>case</code> 里依据判别属性收窄类型，各分支只访问本状态特有的字段。</li>
      <li>在 <code>default</code> 分支把剩余值赋给 <code>never</code>；新增成员后遗漏的 <code>case</code> 会立即报错。</li>
    </ol>
    <p>
      除了 <code>switch</code>，<code>in</code> 操作符和自定义类型守卫（如 <code>shape is Circle</code>）同样能基于判别字段收窄；想把某一类成员从数组里筛出来时，配一个 <code>is</code> 守卫就能得到精确的元素类型，而不是模糊的联合。
    </p>
    <div class="lesson-box warn">
      <strong>判别属性的名字必须统一。</strong>所有成员都叫 <code>status</code>，收窄才成立；有的写 <code>type</code>、有的写 <code>kind</code>、有的写 <code>status</code>，TypeScript 就失去了区分它们的依据，收窄会静默失效。另外判别属性的值要写成<strong>字面量类型</strong>（<code>'pending'</code> 而不是 <code>string</code>），否则同样无法区分成员。
    </div>
    <p>
      这套建模方式几乎可以套在任何有明确状态流转的地方：订单、支付、工作流的节点、聊天消息的类型（文本、图片、语音）、表单的步骤。它的价值不在语法本身，而在于<strong>让「状态有哪些、每种状态带什么、处理是否齐全」这三件事同时被类型系统管起来</strong>。
    </p>

    <h2>穷尽性检查兜底</h2>
    <figure class="lesson-figure">
      <figcaption>切换订单的各个状态，再看穷尽性检查与常见模式，体会 <code>default</code> 里的 <code>never</code> 如何兜底。</figcaption>
      <T20DiscriminatedUnion />
    </figure>

    <h2>状态集合的建模</h2>
    <p>
      可辨识联合把「一个值可能处于哪些状态、每种状态带什么数据」写进了类型。判别属性让每个分支都能被精确收窄，<code>never</code> 让遗漏的分支在编译期就暴露。状态越多、流转越复杂，这套写法的收益越大。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可辨识联合」</span>指联合的每个成员都持有一个同名、同类型的<strong>判别属性</strong>（通常取 <code>type</code>、<code>kind</code> 或 <code>status</code>，值为字面量类型），TypeScript 据此在 <code>switch</code> 或 <code>if</code> 中把值收窄到具体成员。在 <code>default</code> 分支把剩余值赋给 <code>never</code> 即构成<strong>穷尽性检查</strong>：新增成员导致遗漏 <code>case</code> 时，编译器立即报错。除 <code>switch</code> 外，<code>in</code> 与 <code>is</code> 类型守卫同样可用，判别属性名称必须全局统一。
    </div>
  </LessonArticle>
</template>
