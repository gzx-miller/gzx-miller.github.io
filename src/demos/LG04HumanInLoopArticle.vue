<script setup lang="ts">
import LG04HumanInLoop from './LG04HumanInLoop.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>退款 Agent 上线了：自动校验订单、自动执行退款，全程无人值守——直到一位用户申请退款 880 元，超过了财务规定的审批线。Agent 爽快地打了钱。你后知后觉：有些决定，机器不该自己拍板。
    </div>

    <h2>全自动流程的决策边界</h2>
    <p>
      前几课一直在给 Agent 加自主性：自己调工具、自己分支、自己循环。但自主性有个天花板——<strong>涉及钱的、不可逆的、合规要求留痕的决定，必须留一个人工关卡</strong>。天真的做法是「流程跑到临界点就抛异常退出，等人处理完再从头跑」：状态丢了、前面的步骤白跑、两次执行的输入还可能不一致。
    </p>
    <p>
      要回答的是：<strong>怎样让流程在关键节点主动「停住」，把决定权交给外部的人，人从断点处继续——而不是推倒重来？</strong>
    </p>

    <h2>无状态中断的两个断点</h2>
    <ul>
      <li>停不住：普通函数一路执行到底，「跑到一半等人」在没有状态持久化的前提下根本无法表达。</li>
      <li>接不上：就算手动保存了上下文，恢复时用什么把新的决定「送回」到原来那个节点，没有标准答案。</li>
      <li>接错人：中断时抛出的问题如果只是一段日志，审批人看不到结构化选项，恢复时的回传值也没有类型约束。</li>
      <li>丢现场：从异常退出到恢复之间，程序可能重启、刷新、换实例，内存里的中间结果全部蒸发。</li>
    </ul>

    <h2>中断、检查点、恢复三件套</h2>
    <p>
      不推翻「流程要停」，而是把「停」变成框架的一等公民。LangGraph 给出三个配套机制。
    </p>
    <ol class="lesson-steps">
      <li><strong>interrupt 主动中断</strong>：在节点里调用 <code>interrupt({ question, options })</code>，流程在这里<strong>挂起</strong>——不是抛异常，而是暂停。函数的参数就是抛给外部的问题描述，结构化的选项让前端能直接渲染成审批按钮。</li>
      <li><strong>checkpointer 保存现场</strong>：编译图时挂上 checkpointer（如 <code>MemorySaver</code>），每次状态变更都按 <code>thread_id</code> 存档。挂起期间的现场不在内存里，而在检查点里——进程重启也不丢。</li>
      <li><strong>Command 恢复执行</strong>：审批人做出决定后，用 <code>new Command({ resume: 'approved' })</code> 再次 invoke 同一个线程。框架从检查点重建状态，<strong>把 resume 的值作为 interrupt 的返回值</strong>注入节点，从断点继续往下跑。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>同一个节点两种命运：</strong>金额在阈值内时，<code>interrupt</code> 根本不会被调用，节点顺势往下走——「自动通过」与「人工审批」不是两条链路，而是同一个节点的两个分支。中断的条件留给业务逻辑，框架只管「停了能接回来」。
    </div>

    <h2>退款审批中断与恢复演示</h2>
    <figure class="lesson-figure">
      <figcaption>选 ￥880 提交申请：流程停在 review 节点挂起，检查点快照里 next 指向 review、decision 还是 null；点「批准」或「驳回」，看 Command 如何把决定送回断点并跑完 execute。再选 ￥368 对比——阈值内自动通过，interrupt 不会出现。</figcaption>
      <LG04HumanInLoop />
    </figure>

    <h2>把决定权交还给人的价值</h2>
    <p>
      人机交互解决的是「流程何时不该自动」：用 <code>interrupt</code> 在关键节点挂起，用 checkpointer 保住现场，用 <code>Command(resume)</code> 从断点接回。Agent 的自动化程度并没有降低——只是把不可逆的决定，停在了需要人的那一格。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Human-in-the-Loop（HITL）」</span>指在自动流程的关键节点插入人工决策：节点内调用 <code>interrupt(问题)</code> 暂停执行，checkpointer 按 <code>thread_id</code> 保存完整状态，外部用 <code>Command({ resume })</code> 传回决定并恢复。要记住的边界：没有 checkpointer 就没有中断能力（挂起即丢失）；resume 的值会原样成为 interrupt 的返回值，写法不同会错位；同一 thread 上不允许多个中断同时悬而未决。
    </div>
  </LessonArticle>
</template>
