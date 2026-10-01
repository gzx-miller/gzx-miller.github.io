<script setup lang="ts">
import D07ProcessEnv from './D07ProcessEnv.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>你的服务用 <code>process.env.PORT</code> 取端口，本地一直好好的；某次生产部署漏配了这个变量，服务却在错误的端口上「正常」起来了，直到第一笔请求打进来才出问题——为什么配置缺失不会在启动时立刻报错？
    </div>

    <h2>环境变量即时读取</h2>
    <p>
      同一份代码要跑在本地、测试、生产好几套环境里，每套的端口、数据库地址、密钥都不一样。最直接的做法是用环境变量：需要什么，就当场 <code>process.env.XXX</code> 取什么。
    </p>
    <p>
      这种写法把几笔成本留给了未来：<strong>取值点散落各处</strong>，某处把 <code>PORT</code> 拼成 <code>PROT</code>，只会得到一个 <code>undefined</code>，语言不会提醒你；<strong>默认值也散落各处</strong>，不同模块对同一个变量可能约定不同的兜底值；<strong>环境变量的真实类型永远是字符串</strong>——<code>process.env.PORT</code> 是 <code>'3000'</code> 而不是 <code>3000</code>，忘了转换就会在运算里出怪结果；而且<strong>缺项不会在启动时暴露</strong>，要等真的运行到那一行才炸，排查成本陡增。
    </p>
    <p>
      问题落到一句话：怎样让「配置」在程序真正开始干活之前，就被完整、正确地确定下来？
    </p>

    <h2>启动期集中读取</h2>
    <p>
      在启动脚本里把需要的变量一次读出来，逐个给兜底：<code>const port = process.env.PORT || 3000</code>，再把它当作参数传给需要用它的地方。
    </p>
    <p>
      这个方案做对了一件事：<strong>配置有了一个明确的来源</strong>，业务逻辑里不再满天飞地读环境变量。但 <code>|| 3000</code> 这个兜底，会顺手把「忘记配置」这件事故意藏起来。
    </p>

    <h2>兜底掩盖缺失配置</h2>
    <ul>
      <li>漏配时用 <code>||</code> 兜底：服务不报错，却跑在错误端口、连错数据库，问题被推迟到运行时才爆。</li>
      <li><code>NODE_ENV</code> 没设置时是 <code>undefined</code>，它<strong>不等于</strong> <code>'production'</code>，于是代码悄悄走了「非生产」那条分支。</li>
      <li><code>process.env.PORT</code> 是字符串，直接参与运算会得到 <code>'30001'</code> 这种拼接结果。</li>
      <li>密钥之类的值被直接读出来、又被打进日志，很容易泄漏。</li>
      <li>业务代码到处读 <code>process.env</code>，测试时想替换成假值也无从下手。</li>
    </ul>

    <h2>集中配置与快速失败</h2>
    <p>
      先做<strong>配置收口</strong>：建一个配置模块，在启动阶段一次性读取所有需要的变量。为什么先做它——「字符串、分散、可能缺失」这三个乱源，只有收进一个地方，才能一次解决。
    </p>
    <p>
      再补<strong>快速失败</strong>：必填项缺失就抛出并拒绝启动，而不是用默认值蒙混。启动即失败，比运行到一半才出错好排查一个数量级。
    </p>
    <p>
      再补<strong>类型转换</strong>：显式把字符串转成真实类型，比如端口用 <code>Number()</code> 转换、再用 <code>Number.isInteger</code> 校验是否落在合法范围。因为环境变量的类型永远是字符串，<strong>类型是你在边界上补出来的，不是它自然带的</strong>。
    </p>
    <p>
      接着处理「退出」这一面——优雅退出。进程收到 <code>SIGTERM</code>（容器编排停止进程时发来的信号）或 <code>SIGINT</code>（你在终端按 Ctrl+C）时，不能立刻消失，而要按顺序收尾：
    </p>
    <ol class="lesson-steps">
      <li>先停止接收新连接，让上游的负载均衡把流量导向别的实例。</li>
      <li>再等待仍在处理的存量请求跑完——这正是「优雅」的含义：对外不失败任何一笔。</li>
      <li>然后释放资源：关闭数据库连接池、断开与下游的连接。</li>
      <li>最后才设置退出码、结束进程。</li>
    </ol>
    <p>
      这个顺序不能颠倒。如果先关连接池，正在处理的请求会因为取不到连接而失败；如果用 <code>process.exit()</code> 直接强制截断，还没跑完的异步清理会被丢掉，在途请求全部丢失。
    </p>
    <div class="lesson-box warn">
      <strong>别用 <code>process.exit()</code> 抢跑：</strong>它会立刻终止进程，正在进行的异步清理与在途请求都来不及完成。正确做法是让清理流程自然跑完、进程因没有待办而自行退出；只有在兜底超时到点时才强制退出。
    </div>
    <p>
      再补<strong>兜底超时</strong>：优雅退出本身也要有上限。K8s 默认给 30 秒（terminationGracePeriodSeconds），超过这个窗口还在清理的进程会被强杀，所以业务侧要自己设一个更早的兜底超时，到点强制退出，避免进程无限挂起。
    </p>

    <h2>开发生产解析差异</h2>
    <figure class="lesson-figure">
      <figcaption>切换 <code>NODE_ENV</code>，看同一份配置代码在 development 与 production 下解析出不同的端口与日志级别——这就是「配置集中在启动时读取并校验」的效果。</figcaption>
      <D07ProcessEnv />
    </figure>

    <h2>读取与退出时机</h2>
    <p>
      配置与退出，共同点是「<strong>时机</strong>」：配置要在启动阶段一次性读全、校验、定型，缺项就拒绝启动；退出要在收到信号后先停止接流量、再等存量完成、最后释放资源。把这两头的时机守住，服务在部署滚动时才不会「悄悄跑错」或「丢请求」。
    </p>
    <div class="lesson-term">
      <span class="term-name">「优雅退出（graceful shutdown）」</span>指进程收到停止信号（如 <code>SIGTERM</code>）后，先停止接收新请求、再等存量任务处理完、最后释放数据库连接池等资源，才结束进程，使退出对外表现为「无请求失败、无连接泄漏」。边界与例外：不要用 <code>process.exit()</code> 强行截断异步清理，会丢失未完成的请求；优雅退出本身要设兜底超时（K8s 默认给 30 秒），超时后强制退出，避免进程无限挂起。
    </div>
  </LessonArticle>
</template>
