<script setup lang="ts">
import VF04Handles from './VF04Handles.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>一张报销单要按金额分流——小额走组长、大额走总监。可节点只有一个出口时，用户随手一拖就可能把大额单连进了普通审批，业务规则根本拦不住。
    </div>

    <h2>提出问题</h2>
    <p>
      前面的节点都只有一个出线口，连线方向由类型约束已经够用。但真实业务里，<strong>同一个环节常常需要多个出口或进口</strong>：报销单按金额分流、订单按渠道分发、任务按优先级走不同处理链。如果一张「报销单」节点只有一个连接点，那么「走组长」和「走总监」这两条线就会从同一个点出发、在视觉上纠缠在一起，用户根本分不清哪根是哪根。
    </p>
    <p>
      更严重的是规则问题。<strong>业务上「大额报销必须由总监审批」是一条硬规则</strong>，可画布上默认允许任意连接，用户可以把大额单拖向组长、也可以把一个节点连到它自己。如果这类非法连接能被画出来、甚至被保存进数据，那下游的审批逻辑就要拿一堆脏数据去兜底。
    </p>

    <h2>最小方案</h2>
    <p>
      最省事的做法：给节点一个连接点，连上就算数，至于连得对不对，事后人工核查。这个方案对在哪里？<strong>它承认了连接的合法性可以作为「事后校验」存在</strong>，至少规则是有定义的。但把校验放到事后，就等于默认允许用户先制造错误，再回头收拾。
    </p>

    <h2>发现不足</h2>
    <ul>
      <li>一个连接点无法表达「按金额分流」这种多出口语义，出口之间无法区分。</li>
      <li>业务规则拦不住乱接，非法连线照样能画出来并被保存。</li>
      <li>连接落下之后，你无法从数据层面知道这根线是从哪个出口出发的。</li>
      <li>用户没有实时反馈，只能靠猜「这根线接得对不对」。</li>
    </ul>

    <h2>迭代</h2>
    <p>
      不推翻「连接点」这个概念，而是给它补上三个属性。Vue Flow 里这个连接点叫 <code>Handle</code>：
    </p>
    <ol class="lesson-steps">
      <li><code>type</code> 区分进出：<code>target</code> 表示进、<code>source</code> 表示出。</li>
      <li><code>position</code> 决定它停靠在节点的哪条边上（左/右/上/下）。</li>
      <li><code>id</code> 用来<strong>在同一个节点上区分多个桩</strong>——这正是分流的关键。</li>
    </ol>
    <p>
      本课的自定义节点里摆了两个 source 桩，分别命名为 <code>small-out</code>（小额出）与 <code>large-out</code>（大额出），这就是「一个出口」到「多个具名出口」的升级。注意自定义节点用 <code>#node-类型名</code> 插槽渲染，内部可以摆放任意数量的 <code>Handle</code>。
    </p>
    <div class="lesson-box warn">
      <strong>最关键的联动规则：</strong><code>Handle</code> 一旦设置了 <code>id</code>，新建连线就<strong>必须</strong>在 <code>connection</code> 里带上 <code>sourceHandle</code> 与 <code>targetHandle</code>，否则对接不上——线会连出去，却挂不到指定的桩上。这是多桩场景最容易忽略、也最难排查的一条。
    </div>
    <p>
      接着解决校验。Vue Flow 提供了 <code>isValidConnection</code>，它会在<strong>拖线过程中实时触发</strong>，你根据 <code>sourceHandle</code> 与 <code>targetHandle</code> 编码业务规则：大额只能进「总监」、小额不能进「总监」、禁止节点自连（<code>source === target</code> 直接返回 <code>false</code>）。<strong>返回 <code>false</code> 的连线在松手瞬间就被丢弃</strong>，用户全程看得见线的合法性反馈。
    </p>
    <p>
      把校验放在 <code>isValidConnection</code> 而不是 <code>onConnect</code>，差别在于<strong>时机</strong>：前者在拖拽途中就给出拒绝反馈，后者是松手之后才处理，用户要等到连完才发现不行。所以校验逻辑优先放前者。
    </p>
    <p>
      连接被放行之后，才轮到 <code>onConnect</code> 落账：先验 <code>valid</code>，再 <code>addEdges</code>，并顺手记录 <code>sourceHandle</code> 到 <code>targetHandle</code> 的对应关系，分流日志就有了依据。还有一个观感细节：<code>Handle</code> 的 <code>position</code> 决定线从哪条边进出，<strong>桩位与停靠边不匹配时，连线会从节点内部斜穿过去</strong>，非常难看。建议按业务语义给多桩命名 id（如 <code>small-out</code>、<code>large-out</code>），校验、日志、排查都靠它定位。
    </p>

    <h2>动手试试</h2>
    <figure class="lesson-figure">
      <figcaption>从「报销单」右侧的两个连接桩分别拖线，试出非法组合松手即被丢弃的效果。</figcaption>
      <VF04Handles />
    </figure>

    <h2>总结</h2>
    <p>
      连接桩把「连哪里」从一个模糊的拖拽动作，变成了<strong>可命名、可校验、可记录的结构化信息</strong>：用 <code>id</code> 区分多出口，用 <code>isValidConnection</code> 在拖拽途中实时拦下违规连接，用 <code>onConnect</code> 落账并留下分流依据。记住「设了 id 就必须显式携带 handle id」这条联动规则，多桩连线才不会错位。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Handle 连接桩」</span>是节点上的连接点，用 <code>type</code> 区分 <code>source</code>（出）/ <code>target</code>（进），用 <code>position</code> 决定停靠边，用 <code>id</code> 在同一节点上区分多个桩。一旦 <code>Handle</code> 设了 <code>id</code>，新建连线必须携带 <code>sourceHandle</code> / <code>targetHandle</code> 才能精确对接；业务校验应放在 <code>isValidConnection</code> 里实时触发（返回 <code>false</code> 的连线松手即被丢弃），放行后再于 <code>onConnect</code> 中读取 handle id 落账。
    </div>
  </LessonArticle>
</template>
