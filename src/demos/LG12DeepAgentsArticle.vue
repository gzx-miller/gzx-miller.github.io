<script setup lang="ts">
import LG12DeepAgents from './LG12DeepAgents.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>老板说：写一份调研报告，要查资料、要案例、要有结论。你把这句话发给普通 Agent——它要么一口气硬写出一篇没有依据的文章，要么查两步就声称「已完成」。而这份任务明明需要「先列计划、再逐项推进、中途还要落文件」。
    </div>

    <h2>短任务智能体的长任务短板</h2>
    <p>
      前面几颗栗子里的 Agent 都是「一问一答一循环」的形态，处理长任务时暴露三个短板：<strong>没有计划</strong>（不知道先干什么后干什么）、<strong>没有产出物</strong>（结果全在对话里，一轮结束即蒸发）、<strong>没有分工</strong>（一个人硬扛所有子任务）。把长任务塞给短任务框架，就像让没有清单的人去做大扫除——干到哪算哪。
    </p>
    <p>
      上一课的监督者模式解决了「分工」，但计划从哪来、材料往哪放，仍然要你自己搭。于是问题变成：<strong>这些长任务通用能力，能不能开箱即有？</strong>
    </p>

    <h2>Deep Agents：长任务四件套开箱</h2>
    <p>
      <strong>Deep Agents</strong> 是把「长任务所需的基础设施」预先装进一个智能体的组件。一次创建，它自带四件套：
    </p>
    <ol class="lesson-steps">
      <li><strong>规划工具（write_todos）</strong>：任务被拆成待办清单，执行过程中逐项勾选——模型看得见自己的进度，长任务的「记忆安全感」来自这里。</li>
      <li><strong>虚拟文件系统</strong>：<code>read_file / write_file / ls</code> 一套工具让中间产物落盘（<code>/research/notes.md</code>、<code>/report.md</code>），对话可以很长、文件始终在；上下文超了也不怕丢材料。</li>
      <li><strong>子智能体委派</strong>：<code>subagents</code> 数组里注册「专家」，主智能体用 <code>task</code> 工具把子任务派出去——就是上一课的监督者模式，但注册方式更快。</li>
      <li><strong>对话记忆</strong>：同 thread 持续对话，材料与结论跨轮延续。</li>
    </ol>
    <p>
      用法上它仍是「模型 + 工具 + 系统提示词」的组合，只是预置了一整套长任务装备：<code>createDeepAgent({ model, subagents, systemPrompt })</code>。
    </p>
    <div class="lesson-box warn">
      <strong>它不是万能升级包：</strong>四件套的代价是多轮工具调用——一次「简单推荐课程」也会被它拆成清单来跑，token 成本与延迟都显著高于普通 Agent。判断标准很简单：<strong>任务需要「计划 + 多个专家 + 产出文件」时才上 Deep Agents</strong>，普通问答与单工具任务保持轻量。
    </div>

    <h2>规划、委派、落文件全流程演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「运行 Deep Agent」：它先写待办清单，再依次委派 researcher 与 analyst；留意左侧待办逐项勾选、虚拟文件系统里文件逐个出现，最后报告落盘 /report.md。</figcaption>
      <LG12DeepAgents />
    </figure>

    <h2>长任务基础设施的预置</h2>
    <p>
      Deep Agents 解决的是「长任务的自我组织」：预置规划清单、虚拟文件系统、子智能体委派与对话记忆。它把监督者模式与文件沉淀打包成开箱组件——你出的是任务目标，它出的是计划、分工与产物。
    </p>
    <div class="lesson-term">
      <span class="term-name">「Deep Agents」</span>是面向长任务的预置智能体组件，自带四件套：<code>write_todos</code> 规划清单、虚拟文件系统（read_file / write_file / ls）、<code>subagents</code> 子智能体委派、对话记忆。要记住的边界：多轮工具调用带来显著的 token 成本，简单任务别用；虚拟文件系统在进程内，生产要换成持久化存储；子智能体越多、委派链越长，失败面越大——上线前先估预算、设步数上限。
    </div>
  </LessonArticle>
</template>
