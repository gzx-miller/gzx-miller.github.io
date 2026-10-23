const e=`<script setup lang="ts">
import D07ProcessEnv from './D07ProcessEnv.vue'
<\/script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>本地用默认值把服务跑得好好的，生产环境却漏配了 <code>PORT</code>，服务照样「正常」起来了，直到第一笔流量打进来才暴露——为什么少了一个环境变量，程序不会在启动那一刻就当场拒绝运行？
    </div>

    <h2>进程自带的运行时输入</h2>
    <p>
      每个 Node 进程启动时都会拿到一张运行时视图，它就是全局的 <code>process</code> 对象。<code>process.argv</code> 是命令行参数数组，<code>process.env</code> 是环境变量表，<code>process.exitCode</code> 决定进程结束时报给操作系统的退出码——这几项把「程序本身」与「它运行在什么环境里」连了起来。
    </p>
    <p>
      最省事的做法不必任何封装：要端口就写 <code>process.env.PORT</code>，要密钥就读 <code>process.env.TOKEN</code>。改动最小，换环境也不用动代码。可这份便利只是把成本挪进了看不见的地方。
    </p>

    <h2>随处读取留下的三笔账</h2>
    <ul>
      <li><strong>取值点散落各处</strong>：一处把 <code>PORT</code> 敲成 <code>PROT</code>，拿到的只是 <code>undefined</code>，语言不会替你把关。</li>
      <li><strong>类型永远是字符串</strong>：<code>process.env.PORT</code> 拿到的是 <code>'3000'</code> 而非 <code>3000</code>，忘了转换就会出现字符串拼接这类怪结果。</li>
      <li><strong>缺项不报错</strong>：配上 <code>|| 3000</code> 兜底，漏配被悄悄咽下，服务跑在错误的端口或连错数据库，要等运行到那一行才炸。</li>
      <li><strong>测试没法替换</strong>：业务代码自己直接读环境变量，单元测试想塞一份假值都无从下手。</li>
    </ul>
    <p>
      问题收敛成一句：怎样让「配置」在程序真正开始干活之前，被完整、正确地确定下来？
    </p>

    <h2>启动阶段一次性读取并校验</h2>
    <p>
      把配置收进一个独立模块，在启动阶段一次性读完所有需要用到的变量，然后逐个处理：能转类型的转成真实类型，必填的检查是否真的存在。为什么先做收口——「分散、字符串、可能缺失」这三个乱源，只有集中到一处才能一次解决。
    </p>
    <p>
      收口还带来两个好处：业务代码从此只依赖一个配置对象，不再到处触碰 <code>process.env</code>；测试也可以注入一份假配置，把「环境」这件事从用例里隔离出去。
    </p>
    <p>
      再补上<strong>快速失败</strong>：必填项缺失就抛错、拒绝启动，而不是拿默认值蒙混。启动即失败，比运行到一半才出错少一个数量级的排查成本——这正是开场那个「悄悄跑错端口」的根治办法。
    </p>
    <p>
      再补上<strong>校验与转型</strong>：端口用 <code>Number()</code> 转换后再确认落在合法范围，布尔类开关显式解析成 <code>true</code> / <code>false</code>。记住一条前提：<strong>环境变量的类型是你在边界上补出来的，不是它自然带来的</strong>。
    </p>

    <h2>信号与退出码</h2>
    <p>
      进程不会无缘无故消失。容器编排停止实例时发来 <code>SIGTERM</code>，你在终端按下 Ctrl+C 时收到 <code>SIGINT</code>，调度系统还会发 <code>SIGHUP</code>。收到这些信号时，进程该做的是收尾，而不是立刻倒下。
    </p>
    <p>
      主动结束时要区分两种写法：设置 <code>process.exitCode = 1</code> 是「告诉进程该以什么码退出，然后让它自然结束」，异步清理能继续跑完；而 <code>process.exit(1)</code> 是「立刻掐断」，来不及完成任何在途工作。退出码本身也有约定：正常结束用 <code>0</code>，失败用非零，运维与 CI 都靠它判断这次运行是否成功。
    </p>

    <h2>优雅退出的顺序</h2>
    <p>
      收到停止信号之后，收尾动作要按固定次序执行，顺序错了就会对外制造失败：
    </p>
    <ol class="lesson-steps">
      <li>先停止接收新请求，让上游的负载均衡把流量导向别的实例。</li>
      <li>再等待仍在处理中的存量请求跑完——「优雅」二字正落在这里：不丢任何一笔在途请求。</li>
      <li>然后释放资源：关闭数据库连接池、断开与下游的连接。</li>
      <li>最后设置退出码、让进程结束。</li>
    </ol>
    <p>
      次序不能颠倒：先关连接池，正在处理的请求会因为借不到连接而失败；先用 <code>process.exit()</code> 抢跑，还没跑完的异步清理会被直接截断，在途请求一并丢失。
    </p>

    <h2>给清理留一条兜底</h2>
    <p>
      优雅退出也需要上限。K8s 默认给进程 30 秒（<code>terminationGracePeriodSeconds</code>），超过这个窗口还没退出的实例会被强杀。所以业务侧应当自己设一个更早的兜底超时：到点就强制退出，不让一个卡住的连接把自己无限挂起。
    </p>
    <div class="lesson-box warn">
      <strong>别让 <code>process.exit()</code> 抢在清理前面：</strong>它会立即终止进程，正在进行的异步清理和在途请求都来不及收尾。正确做法是设好 <code>exitCode</code>、让清理流程自然跑完、进程因没有待办而自行退出；只有在兜底超时到点时，才动用强制退出。
    </div>

    <h2>同一份配置的两种解析</h2>
    <figure class="lesson-figure">
      <figcaption>切换 <code>NODE_ENV</code>，看同一段配置代码在 development 与 production 下解析出不同的端口与日志级别——这正是「配置集中在启动阶段读取、校验、定型」之后的效果。</figcaption>
      <D07ProcessEnv />
    </figure>

    <h2>两头都要守住的时机</h2>
    <p>
      配置与退出，本质上是同一件事的两面：<strong>时机</strong>。配置要在启动阶段一次读全、转型、校验，缺项就拒绝启动；退出要在收到信号后先摘流量、再等存量跑完、最后释放资源。把这两端守住，滚动部署时才不会「悄悄跑错端口」，也不会「丢请求」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「优雅退出（graceful shutdown）」</span>指进程收到停止信号（常见为 <code>SIGTERM</code>）后，依次停止接收新请求、等待存量任务完成、释放数据库连接池等资源，最后才结束进程，使退出对外表现为「无失败请求、无连接泄漏」。边界与例外：不要用 <code>process.exit()</code> 强行截断异步清理，否则丢失未完成的请求；优雅退出自身要设兜底超时（K8s 默认给 30 秒），超时后强制退出，避免进程无限挂起。
    </div>
  </LessonArticle>
</template>
`;export{e as default};
