<script setup lang="ts">
import T02UnionNarrowing from './T02UnionNarrowing.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>订单卡片按状态显示「待付款 / 待发货 / 运输中」，可同事把判断写成 <code>status === 'payed'</code>，分支静默失效，界面卡在旧文案上——有没有办法让这种拼写错误根本进不了编译器？
    </div>

    <h2>状态字符串硬编码</h2>
    <p>
      订单有一套状态：待付款、待发货、运输中。最自然的写法，是在比较、赋值、传给接口时到处写字符串 <code>'pending'</code>、<code>'paid'</code>、<code>'shipped'</code>，各写各的。
    </p>
    <p>
      代价在第一个人手滑时就会显现：<strong>状态是一个有限的集合，但字符串是无限的</strong>。你无法阻止有人写入 <code>'refunded'</code>、<code>'PAID'</code> 或 <code>'payed'</code>。更糟的是，一个拼错的字符串不会报错，它只会让某个分支永远不生效——订单静静停在错误的文案里，而代码看起来一切正常。所以真正要解决的是：<strong>如何让非法的业务状态无法被创建，并在每个分支里被安全地处理</strong>。
    </p>

    <h2>直接比较字符串</h2>
    <p>
      最省事的做法，就是直接拿字符串当状态用：<code>let status = 'pending'</code>，再配一句 <code>if (status === 'paid') {}</code>。
    </p>
    <p>
      它做对了一件朴素的事：<strong>状态在运行时确实就是字符串</strong>，不需要额外概念，读写都直观，传给后端也能直接用。只要状态只有一个人维护、只在一处出现，这种写法看不出问题。
    </p>

    <h2>非法取值放行</h2>
    <ul>
      <li>非法状态可以随意创建：<code>status = 'payed'</code> 编译照样通过，只是运行时永远匹配不上。</li>
      <li>魔法字符串散落各处，改一次名要全局搜索替换，漏掉一处就是一颗雷。</li>
      <li>每个分支里 <code>status</code> 仍是宽泛的 <code>string</code>，编辑器给不出「这个状态独有的值」的提示。</li>
      <li>新增一个状态后，遗漏处理的分支不会被指出来，只能靠人自己数。</li>
    </ul>

    <h2>字面量联合类型</h2>
    <p>
      不推翻「状态就是一个值」，而是<strong>收窄它的取值范围</strong>。用字面量联合类型把订单的所有合法状态明确列举出来：
    </p>
    <p>
      <code>type OrderStatus = 'pending' | 'paid' | 'shipped'</code>
    </p>
    <p>
      这一行把状态的合法取值收拢成了<strong>单一来源</strong>。此后 <code>let status: OrderStatus = 'paid'</code> 合法，而 <code>status = 'payed'</code> 会直接在编译期标红——非法状态再也进不了业务逻辑。
    </p>
    <p>
      第二步是<strong>控制流收窄</strong>。TypeScript 会基于条件分支里对成员的相等比较，把参数类型逐步收窄到具体成员，于是每个分支都按该成员独有的类型与业务逻辑来写：
    </p>
    <p>
      <code>function describe(status: OrderStatus) {</code><br />
      <code>&nbsp;&nbsp;if (status === 'pending') { /* 此处 status 为 'pending' */ }</code><br />
      <code>&nbsp;&nbsp;else if (status === 'paid') { /* 此处 status 为 'paid' */ }</code><br />
      <code>&nbsp;&nbsp;else { /* 其余成员由编译器保证不会失配 */ }</code><br />
      <code>}</code>
    </p>
    <ol class="lesson-steps">
      <li>用字面量联合类型列举全部合法状态，禁用散落的魔法字符串。</li>
      <li>在函数内对状态参数做相等判断，让编译器在分支内把类型收窄为具体成员。</li>
      <li>在收窄后的分支中安全调用该状态专属逻辑，其余分支由编译器保证不会失配。</li>
      <li>新增一个状态值，验证所有未处理的代码位置都被编译器一一点出。</li>
    </ol>
    <p>
      如果分支改写成 <code>switch</code>，效果完全同理：<code>case</code> 里比较到的成员同样被收窄，而在每个 <code>case</code> 之外，<code>status</code> 会被一步步缩小到「还没被处理过的成员」。这正是「新增状态后所有未处理位置都能被点出」的底气——它不靠额外工具扫描，而是类型收窄顺带给出的保证。
    </p>
    <p>
      还有两处必须记住的细节。其一，<strong>收窄依靠相等比较</strong>，控制流越简单（<code>if/else</code>、<code>switch</code>），收窄结果越可预期，所以别在中间穿插会打断推断的写法。其二，<strong>不要在收窄之后又把它还原成宽泛类型</strong>，否则辛苦收来的精确信息当场丢失。最后，状态值的来源要收敛到一处：<strong>类型、常量与校验函数共享同一份字面量联合</strong>，任何人改状态都只改这一个地方。
    </p>

    <h2>订单状态流转</h2>
    <figure class="lesson-figure">
      <figcaption>点「流转到下一状态」，看联合类型如何把订单状态限制在合法取值之间循环。</figcaption>
      <T02UnionNarrowing />
    </figure>

    <h2>取值清单与收窄</h2>
    <p>
      联合类型做的事情，是把「这个值可能是什么」从散落各处的字符串收拢成一份清单；收窄做的事情，是让编译器顺着条件分支，把你带到一个又一个精确的分支里。合法状态只有一处定义，非法取值在编译期就被拦下，新增状态时遗漏的分支也无所遁形。
    </p>
    <div class="lesson-term">
      <span class="term-name">「字面量联合类型与收窄」</span>指用 <code>'pending' | 'paid' | 'shipped'</code> 把一个值可能取到的状态显式列举出来，作为合法取值的唯一来源；TypeScript 再依据条件分支中对成员的相等比较，把参数逐步收窄到具体成员，使每个分支按该成员独有的类型编写。控制流越简单收窄越可预期，且不要在收窄后还原成宽泛类型。
    </div>
  </LessonArticle>
</template>
