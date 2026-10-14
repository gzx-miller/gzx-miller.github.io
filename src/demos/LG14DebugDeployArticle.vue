<script setup lang="ts">
import LG14DebugDeploy from './LG14DebugDeploy.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>助手在测试环境一切正常，上线后偶发「推荐了完全不相关的课程」。你打开日志——只有一行 <code>200 OK</code>。图跑了哪些节点、每个节点写了什么、tool 调用传了什么参数，全都看不见。图越复杂，这行日志越像谜语。
    </div>

    <h2>黑盒执行的排障困境</h2>
    <p>
      普通函数的 bug 可以用断点一步步走；图的 bug 却藏在「节点之间」——上游写错了字段、条件边选错了分支、工具收到了错参数，最终表现在很远的下游。没有执行记录，你只能猜。而且图还多一层特殊变量：<strong>状态是逐节点合并出来的</strong>，「哪个节点覆盖了哪个字段」这种问题光看代码根本看不出来。
    </p>
    <p>
      要回答的是：<strong>怎么让一次图运行像浏览器开发者工具里的网络请求那样，可以逐条查看、逐层展开、随时回放？</strong>
    </p>

    <h2>三重可观测性：Studio、日志、追踪平台</h2>
    <p>
      从近到远、从开发到生产，配三件工具：
    </p>
    <ol class="lesson-steps">
      <li><strong>langgraph dev + Studio（开发期）</strong>：写一份 <code>langgraph.json</code> 声明图入口，<code>npx @langchain/langgraph-cli dev</code> 启动调试服务，浏览器打开即得可视化画布——输入初始状态、逐节点回放、展开每个节点的输入与输出、还能<strong>「从这里重跑」</strong>：改掉中间某个状态，从断点处继续，不必从头再来。</li>
      <li><strong>结构化日志（本地与 CI）</strong>：没有 Studio 的环境用 <code>stream({ streamMode: 'updates' })</code> 逐节点打印「节点名 + 耗时 + 更新字段 + 消息条数」——排障三件套。流式本身就自带一条现成的执行时间线。</li>
      <li><strong>LangSmith（生产）</strong>：设置 <code>LANGCHAIN_TRACING_V2</code> 与 API Key 环境变量，<strong>代码零改动</strong>，每次运行自动上报成树形 trace：「节点 → 模型调用 → 工具调用」，附带完整输入输出、token 用量、失败堆栈。线上问题有了第一手的复现材料。</li>
    </ol>
    <div class="lesson-box warn">
      <strong>上线前把「调试配置」换成「生产配置」：</strong>开发期的 <code>MemorySaver</code> 检查点重启即丢，生产必须换成持久化后端（Postgres / Redis）；Studio 只是开发工具，部署产物只需要「编译好的图 + 环境变量」；追踪数据可能含用户输入，上报前按合规要求做脱敏或采样。
    </div>

    <h2>运行追踪面板演示</h2>
    <figure class="lesson-figure">
      <figcaption>点「回放一次运行」：时间线逐条出现节点与工具调用，耗时条的长短一眼看出瓶颈在生成节点；点任一条目查看它的输入输出——线上排障时，你查的正是这份面板。</figcaption>
      <LG14DebugDeploy />
    </figure>

    <h2>从开发回放到生产追踪</h2>
    <p>
      调试与部署解决的是「图执行的可观测性与生产化」：开发期用 Studio 逐节点回放与重跑，本地用 updates 流打结构化日志，生产用 LangSmith 自动追踪；检查点换持久化实现，调试配置不上生产。图不再黑盒，问题才有据可查。
    </p>
    <div class="lesson-term">
      <span class="term-name">「可观测性三件套」</span>覆盖图执行的全生命周期：<strong>Studio</strong>（<code>langgraph dev</code>，可视化回放、状态编辑与断点重跑）、<strong>updates 流日志</strong>（节点名 / 耗时 / 更新字段，适合本地与 CI）、<strong>LangSmith</strong>（环境变量开启，生产树形追踪含输入输出与 token）。要记住的边界：MemorySaver 只适合开发，生产换持久化检查点；追踪数据可能含隐私，注意脱敏与采样；调试页监听在本地，别把 Studio 带进部署产物。
    </div>
  </LessonArticle>
</template>
