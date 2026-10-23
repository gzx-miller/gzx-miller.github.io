const n=`<script setup lang="ts">
import LG08Supervisor from './LG08Supervisor.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程助手功能越加越多：查课程、算价格、写文案、审表述——你把所有工具塞给一个 Agent，它的提示词长到快溢出，选错工具的概率肉眼可见地上升。你想拆成几个专职助手，可「谁来派活」又成了新问题。
    </div>

    <h2>单体智能体的过载</h2>
    <p>
      一个 Agent 背所有职责，会同时踩三个坑：<strong>工具列表太长导致选择变差</strong>、<strong>系统提示词互相打架</strong>（写作要求口语化、审核要求严谨）、<strong>迭代牵连全量回归</strong>（改了检索逻辑，写作流程也要重测）。
    </p>
    <p>
      自然的想法是按职责拆分：调研一个、写作一个、审校一个。但拆完立刻遇到编排问题——谁决定什么时候叫谁？谁来汇总结果？<strong>把「分派决策」也写进 if-else，你怎么保证新增成员不改调度代码？</strong>
    </p>

    <h2>子智能体当工具</h2>
    <p>
      这个模式非常朴素：<strong>先各自造好子智能体，再把每个子智能体包装成一个普通工具，交给监督者 Agent</strong>。子智能体是完整的 ReAct Agent（有自己的系统提示词、自己的工具），包装层只做一件事——把「任务描述」转发给它，把最终产出拿回来。
    </p>
    <ol class="lesson-steps">
      <li><strong>子智能体职责单一</strong>：调研员只有检索工具、输出要点清单；写作员没有工具、只做改写。各自的问题域小，提示词与工具列表都短。</li>
      <li><strong>包装成工具的关键是 description</strong>：工具描述写清「派给谁、适合什么任务、会返回什么」——监督者选人的唯一依据就是这段描述，含糊了就会误派。</li>
      <li><strong>监督者也是普通 Agent</strong>：它的工具就是团队成员，提示词里写清调度规则（先调研、后写作、附素材），分派过程就是它的一轮轮工具调用。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>为什么这招管用：</strong>分派决策从「你写的调度代码」转移到了「监督者的模型推理」——新增一个成员只是多注册一个工具，主干代码不动；加约束（比如「写作前必须有调研结果」）也只是改提示词。
    </div>

    <h2>团队委派接力演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行团队」：监督者先拆解、再派研究员收集要点、拿到结果后派写作员成文，最后自己汇总交付。注意每次委派都是一次带 Server 前缀的工具调用，左侧名册高亮当前工作的成员。</figcaption>
      <LG08Supervisor />
    </figure>

    <h2>分派交给推理而非调度代码</h2>
    <p>
      监督者模式解决的是「多个专家如何协作」：子智能体各自封装成工具，监督者按任务描述智能选派。扩展成本从「改调度图」降到「加一个工具」——分派的智慧在模型里，编排的骨架在代码里。
    </p>
    <div class="lesson-term">
      <span class="term-name">「监督者模式（Subagents-as-Tools）」</span>指把每个子智能体包装成一个工具交给监督者 Agent：子智能体各自持有独立提示词与工具，包装工具用 <code>description</code> 描述职责边界与适用场景，监督者通过「调用团队成员」完成任务拆解、分派与汇总。要记住的边界：分派准确率由工具描述质量决定；子智能体的 token 消耗会叠加（监督者一轮、子智能体数轮），复杂任务才划算；成员间不共享状态，交接靠工具调用的参数传递。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
