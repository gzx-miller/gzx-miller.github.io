<script setup lang="ts">
import D09ErrorLogging from './D09ErrorLogging.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>用户传了一个不存在的课程 id，你的接口返回 500「服务器内部错误」；用户以为自己网不好、反复重试，运维却在告警群里排查一个根本不存在的「服务器故障」——一个再正常不过的业务错误，为什么会被当成系统崩溃？
    </div>

    <h2>错误分类的缺失</h2>
    <p>
      服务跑起来就会出错，出错后你要<strong>同时</strong>做两件事：给调用方一个合适的响应，给自己留一条能排查的线索。最省事的做法是在请求入口统一 <code>try ... catch</code>，把异常 <code>console.log</code> 出来，一律返回 500。
    </p>
    <p>
      这种「一锅端」留下了几笔账：<strong>调用方分不清</strong>「你参数传错了（重试没用）」和「我这边炸了（可以稍后再试）」，只能盲目重试；<strong>只记了错误本身、没记上下文</strong>，几十条并发日志里你看不出这是哪个用户、哪个请求、走到哪一步失败的；<strong>错误对象里可能混着内部路径、SQL 语句、库版本</strong>，直接打印或返回都有泄漏风险；还有，真正该被重视的 bug 被吞掉之后，<strong>进程可能带着不一致的状态继续处理后面的请求</strong>。
    </p>
    <p>
      问题落到一句话：错误该不该分出类别？给调用方的、和自己该留的，分别是什么？
    </p>

    <h2>入口层的统一捕获</h2>
    <p>
      在请求入口包一层 <code>try ... catch</code>：捕获所有异常，打一条日志，返回 <code>500 { message: 'Internal Server Error' }</code>。
    </p>
    <p>
      这个方案做对了一件最基础的事：<strong>给所有错误准备了统一出口</strong>——响应总能正常结束，进程也不会因为一个未捕获的异常直接挂掉。问题在于，它把「完全不同的两类错误」压成了同一种结果。
    </p>

    <h2>混淆的两类错误</h2>
    <ul>
      <li>参数缺失、资源不存在这类<strong>本来就会发生</strong>的错误，和代码 bug、依赖崩溃这类<strong>不该发生</strong>的错误，被一起返回成 500，调用方无从判断能否重试。</li>
      <li><code>console.log(err)</code> 只留下堆栈，缺请求 ID、用户 ID 和入参，事后根本串不起来。</li>
      <li>把 <code>err.message</code> 或堆栈直接返回给客户端，等于把内部结构告诉了外面。</li>
      <li><code>uncaughtException</code> / <code>unhandledRejection</code> 如果只是打印后继续跑，进程可能带着坏掉的状态，后面每一个请求都是错的。</li>
      <li>日志里混进 token、密码、手机号，排查没帮上忙，先造成了一次越权泄漏。</li>
    </ul>

    <h2>二分归类的依据</h2>
    <p>
      先把错误<strong>分成两类</strong>，因为后面所有处理都由这个分类决定：<strong>操作型错误</strong>是预期内、能对应调用方一个具体动作的问题——参数缺失、权限不足、资源不存在、下游超时；<strong>程序型错误</strong>是不该出现的 bug 或崩溃级故障。整个处理流程是这样的：
    </p>
    <ol class="lesson-steps">
      <li>在系统边界（请求入口、调用下游的出口）用 <code>try ... catch</code> 捕获异步错误。</li>
      <li>把内部错误映射成公开的错误码与合适的 HTTP 状态。</li>
      <li>用固定的结构化字段记录请求 ID 与内部原因。</li>
      <li>故意触发一次错误，核对返回的错误码与日志字段是否对得上。</li>
    </ol>
    <p>
      再给操作型错误建立<strong>「错误码 → HTTP 状态」的稳定映射</strong>：资源不存在用 404、参数不合法用 400、未认证用 401。调用方拿到错误码，就能决定是提示用户改参数、还是稍后重试，而不是对着一个笼统的 500 猜。
    </p>
    <p>
      再给程序型错误设计出口：<strong>捕获后记录完整堆栈和上下文，对外只回一个不带内部细节的笼统 500，然后把进程交给进程管理器去重启</strong>。不让它带病继续运行，是这里最重要的判断。
    </p>
    <p>
      再补<strong>结构化日志</strong>：日志以 JSON 输出，字段固定（时间、级别、错误码、请求 ID、用户 ID、简短原因），这样既能被人读、也能被检索和聚合。把请求 ID 从请求入口一路带到每个日志点，同一笔请求的所有日志就能串成一条线——这正是「事后查得动」的关键。
    </p>
    <p>
      再补<strong>脱敏</strong>：写日志前剔除 token、密码、身份证、手机号等敏感字段；序列化错误对象时只取进白名单的字段，而不是把整个对象原样打出去。
    </p>
    <p>
      最后补<strong>全局兜底</strong>：注册 <code>process.on('uncaughtException')</code> 与 <code>process.on('unhandledRejection')</code>。要记住它们不是「打印一下、接着跑」，而是捕获那些漏网的异常，记录后按既定策略退出或上报，防止进程在状态不一致时继续对外服务。
    </p>
    <div class="lesson-box warn">
      <strong>最容易被忽略的一点：</strong>未处理的 Promise 拒绝如果只是 <code>console.log</code> 后继续运行，等于把一个未知的坏状态留着不管；同样，任何时候都不要把 <code>err.stack</code> 或原始 <code>err.message</code> 直接返回给客户端——对外只给稳定错误码，堆栈留给服务端日志。
    </div>

    <h2>可查的日志线索</h2>
    <figure class="lesson-figure">
      <figcaption>点「模拟请求失败」，看这条日志——它有稳定的错误码和请求 ID，而不是一段裸堆栈；对外则只回错误码，不暴露内部细节。</figcaption>
      <D09ErrorLogging />
    </figure>

    <h2>分类与分别对待</h2>
    <p>
      错误处理的关键是「<strong>先分类、再分别对待</strong>」：操作型错误转成稳定的错误码和恰当的状态码，交给调用方去处理；程序型错误留下完整上下文后交给进程管理器重启；日志用固定字段的结构化形式记录，才查得动、也才追得下去。
    </p>
    <div class="lesson-term">
      <span class="term-name">「操作型错误（operational error）」</span>指运行时可预期、且调用方能理解并处理的问题，如参数缺失、权限不足、资源不存在、下游超时；它应被映射为稳定的错误码与合适的状态码（404 / 400 / 401 等），交给调用方决定是否重试。边界与例外：它与程序型错误（代码 bug、崩溃级故障）相对，后者应记录完整堆栈与上下文后交给进程管理器重启，不能伪装成 4xx 掩盖；错误对象可能携带敏感字段，落日志前必须脱敏。
    </div>
  </LessonArticle>
</template>
