const e=`<script setup lang="ts">
import LG07McpServer from './LG07McpServer.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>课程助手要接入公司内部的课程库，读写本地笔记要接文件系统，查汇率要接第三方 API——每接一个数据源，你的 <code>tool()</code> 定义就多一份：参数怎么传、鉴权怎么做、错误怎么报，各家一套写法。第三个数据源还没接完，你已经不想维护了。
    </div>

    <h2>工具集成的重复劳动</h2>
    <p>
      工具本身不难写，难的是「接谁都要重写一遍」。这类集成的痛点在缩放时集中爆发：
    </p>
    <ul>
      <li>协议各写各的：每个数据源的连接、鉴权、错误格式都要单独适配，代码里没有统一约定。</li>
      <li>换个客户端就重写：同一批工具要让 IDE、桌面应用和你的 Agent 都能用，得各接一遍。</li>
      <li>发现机制缺失：工具藏在私有代码里，Agent 运行时才知道有哪些能力可用。</li>
    </ul>
    <p>
      要回答的是：<strong>有没有一种标准协议，让「提供工具」和「消费工具」解耦——服务按协议暴露能力，Agent 按协议发现并调用？</strong>
    </p>

    <h2>MCP：给工具定一份通用接口</h2>
    <p>
      <strong>MCP（Model Context Protocol）</strong>就是这个标准：任何服务只要按协议实现一个 <strong>MCP Server</strong>，就能对外声明自己有哪些工具（名称、描述、参数 Schema）；任何客户端按协议连上它，就能列出并调用这些工具——服务与消费者之间不再互写适配代码。
    </p>
    <p>
      在 LangGraph 侧接 MCP 只要三步：
    </p>
    <ol class="lesson-steps">
      <li><strong>配置 Server 清单</strong>：用 <code>MultiServerMCPClient</code> 声明要连哪些 Server——本地的用 <code>stdio</code> 拉起子进程，远端的用 <code>http</code> 连服务地址，两种可以混用。</li>
      <li><strong>一次拉取全部工具</strong>：<code>client.getTools()</code> 返回标准的 LangChain 工具数组，每个工具名自带 <strong>Server 前缀</strong>（如 <code>courseDb__query</code>），与原生 <code>tool()</code> 定义的工具用法完全一致。</li>
      <li><strong>照常交给 Agent</strong>：把工具数组传进 <code>createReactAgent</code> 即可——模型侧看到的就是普通工具，谁来提供、走什么传输，它一概不需要知道。</li>
    </ol>
    <div class="lesson-box hint">
      <strong>值得记住的两个细节：</strong>工具名前缀不是装饰，日志里看到 <code>math__calculate</code> 就知道这次调用跨了哪个服务；用完 <code>client.close()</code> 释放 stdio 子进程与 HTTP 连接，长驻服务尤其要注意，否则连接会悄悄泄漏。
    </div>

    <h2>跨 Server 调用轨迹演示</h2>
    <figure class="lesson-figure">
      <figcaption>左侧是两个已连接的 MCP Server 及其工具清单；点「运行提问」，看 Agent 先向 courseDb 查课程元数据、再请 math 做除法——两次调用横跨两个服务，工具名前缀标明了归属。</figcaption>
      <LG07McpServer />
    </figure>

    <h2>协议解耦替代逐个适配</h2>
    <p>
      MCP 解决的是「工具如何标准化接入」：服务按协议暴露能力，Agent 按协议发现并调用。接一个新数据源不再写适配代码——换个 MCP Server 就是换一套工具，Agent 的代码一行不用改。
    </p>
    <div class="lesson-term">
      <span class="term-name">「MCP（Model Context Protocol）」</span>是工具提供方与消费方之间的标准协议：Server 声明工具（名称、描述、参数 Schema），客户端（LangGraph 用 <code>MultiServerMCPClient</code>）发现并调用，支持 stdio 与 http 传输混用。要记住的边界：MCP 工具进上下文后，工具描述的质量同样决定调用准确率；工具名冲突靠 Server 前缀隔离；stdio 子进程与 HTTP 连接要显式关闭；远程 Server 的鉴权信息属于密钥，走环境变量而非代码。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
