const n=`<script setup lang="ts">
import LG06ContextEngineering from './LG06ContextEngineering.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>推荐节点上线后越来越臃肿：学生水平从环境变量读、浏览历史从数据库查、会话状态从参数传——同一个节点里三种取数方式混在一起。测试时想造一个「进阶水平」的用例，得同时改三个地方；上线后才发现，环境变量在某个实例上根本没配。
    </div>

    <h2>数据来源没有分工的混乱</h2>
    <p>
      上一课的记忆分成了两层，但「数据从哪来、节点怎么拿」还没有统一的约定。现实中节点要读取的东西至少有三类，它们的<strong>生命周期完全不同</strong>：这次运行才有的中间结果、每次调用注入的外部参数、跨会话常驻的用户档案。混在一起用全局变量传递，会带来两种典型事故：
    </p>
    <ul>
      <li><strong>串数据</strong>：用模块级变量盛放「用户水平」这类每次请求都可能不同的参数，并发一上来就互相污染。</li>
      <li><strong>测试难</strong>：节点直接依赖外部的数据库、环境变量，想单测只能整套环境一起搬。</li>
    </ul>
    <p>
      要回答的是：<strong>三类上下文各放哪里、节点按什么规矩读，才能既不出错又容易测试？</strong>
    </p>

    <h2>三层上下文各就各位</h2>
    <p>
      LangGraph 的答案是把数据按生命周期分配进三个明确的容器，节点拿到手的读取方式各不相同。
    </p>
    <ol class="lesson-steps">
      <li><strong>State——这一次运行的共享白板</strong>：随每次 <code>invoke</code> 创建，节点之间读写流转。放流程的临时结果：问题、草稿、中间日志。特点：会随检查点保存，因此别放密钥、别放超大对象。</li>
      <li><strong>Runtime Context——这一次调用的注入参数</strong>：用 Schema 声明形状（如 <code>grade</code>、<code>locale</code>），invoke 时传入，节点<strong>只读</strong>。放用户身份、环境配置、功能开关这类「外部决定、流程内消费」的参数——不参与状态流转，也就不受 reducer 与检查点的干扰。</li>
      <li><strong>Store——跨越所有运行的长期档案</strong>：节点通过 <code>runtime.store</code> 读写，和 thread 无关。放用户画像、偏好、可检索的知识补充。</li>
    </ol>
    <p>
      三条数据线在节点里各走各的门：State 在第一个参数 <code>state</code>，Context 与 Store 在第二个参数 <code>runtime</code>（<code>runtime.context</code> / <code>runtime.store</code>）。<strong>看着取数代码就知道数据的生命周期</strong>——这是上下文工程最直接的收益。
    </p>
    <div class="lesson-box hint">
      <strong>它们最终汇合在模型输入里：</strong>无论来源是哪一层，进入模型前都会被「装配」成消息文本——Context 的水平、Store 的浏览记录拼进 system 消息，State 的问题作为 human 消息。上下文工程的全部功夫，就是在装配这一步让<strong>该出现的信息出现、不该出现的绝不出现</strong>。
    </div>

    <h2>三层上下文组装演示</h2>
    <figure class="lesson-figure">
      <figcaption>同一个问题「接下来该学什么？」，试试切换学生水平、勾掉「读取浏览记录」，观察右侧装配出的消息列表与模型答案如何随之变化——数据来自哪一层，都标在了消息旁。</figcaption>
      <LG06ContextEngineering />
    </figure>

    <h2>按生命周期分层取数</h2>
    <p>
      上下文工程解决的是「数据放哪里、怎么读」：State 管一次运行的共享状态，Context 管一次调用的只读注入，Store 管跨会话的长期档案。节点按生命周期取数，装配成模型输入——职责清晰了，测试和并发问题自然消失。
    </p>
    <div class="lesson-term">
      <span class="term-name">「三层上下文（State / Context / Store）」</span>按生命周期分工：State 随单次运行创建、节点间读写、随检查点保存；Context 由调用方注入、节点只读、不参与状态合并；Store 跨运行持久、按命名空间存取。要记住的边界：把每次请求变化的参数放进模块级变量会串数据，应走 Context；把用户档案塞进 State 会撑大每个检查点，应走 Store；三层最终都要「装配」进模型消息，装什么、不装什么，是效果与成本的第一道闸门。
    </div>
  </LessonArticle>
</template>
`;export{n as default};
