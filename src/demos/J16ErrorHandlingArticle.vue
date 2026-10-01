<script setup lang="ts">
import J16ErrorHandling from './J16ErrorHandling.vue'
</script>

<template>
  <LessonArticle>
    <div class="lesson-question">
      <strong>开场问题：</strong>表单提交失败时界面只弹一句「操作失败」，你怎么分辨这次到底是「姓名太短」还是「服务器 503」？
    </div>

    <h2>失败的多种来源</h2>
    <p>
      真实程序里，失败来自四面八方：<code>JSON.parse()</code> 拿到坏数据会抛错、网络请求会超时、业务规则校验会不通过。你希望它们能被<strong>分别处理</strong>，并且在向上传递时保留「到底哪一步出的错」，好在界面上给出准确的提示。
    </p>
    <p>
      不做统一处理的代价是：错误散落各处，有的被静默吞掉，有的只剩一句笼统的「失败」，排查时只能靠猜。
    </p>
    <p>
      更麻烦的是，同一个错误往往要在多层函数之间传递：底层知道原因，上层要给用户提示，中间几层只负责转发。如果没有一种能承载上下文的载体，信息会在每一层被压扁成一句笼统的话，等真正要处理时，原始原因早就丢失了。
    </p>

    <h2>返回值携带错误</h2>
    <p>
      最省事的做法：用返回值表达错误——函数失败就 <code>return</code> 一个错误字符串或 <code>false</code>，让调用方自己判断。
    </p>
    <p>
      这个方案做对了一件事：<strong>不打断执行流程</strong>，逻辑线性、简单直接，适合纯粹的、可预期的失败分支。
    </p>
    <p>
      但它有个隐含前提：调用方足够自觉。只要有一个人少写一个判断，错误就顺着返回值一路漂过去，最后在别处爆发成更难查的问题——那时你已经看不到它最初是从哪冒出来的了。
    </p>

    <h2>单条消息的分流障碍</h2>
    <ul>
      <li>可被无视：调用方完全可以不检查返回值继续往下跑，错误被悄悄吞掉。</li>
      <li>只有一条消息：拿到的是一句字符串，没法按「类型」分流，只能去解析 <code>message</code> 文本，脆弱又难维护。</li>
      <li>丢上下文：原始错误（哪个字段、哪次请求）在层层传参途中就丢了。</li>
      <li>异步更别扭：Promise 与 <code>await</code> 的结果里混着错误，用返回值表达非常难受。</li>
    </ul>

    <h2>异常对象的一等化</h2>
    <p>
      不推翻「判断失败」，而是让失败升级为一种<strong>可抛、可捕获、可携带信息的一等对象</strong>。
    </p>
    <p>
      核心是 <code>try/catch/finally</code>。用 <code>try</code> 包住可能抛错的代码，<code>catch</code> 捕获抛出的异常，<code>finally</code> 无论成功失败都执行——适合放清理逻辑（关闭连接、复位状态）。关键的一点是，<code>catch</code> 不只捕获同步异常，也能捕获 <code>async/await</code> 中被<strong>拒绝的 Promise</strong>，于是同步与异步边界的失败可以汇入同一处来处理。
    </p>
    <p>
      接着把错误<strong>分类</strong>：继承 <code>Error</code> 定义自定义异常类，比如 <code>class ValidationError extends Error</code>，在构造函数里塞进业务字段（哪个字段不合法），并设置 <code>this.name</code>。处理时就可以用 <code>instanceof</code> 或 <code>err.name</code> 分支，而不再去解析 <code>message</code> 字符串这种脆弱做法。这样一来，「姓名太短」和「服务器 503」就是两种能被程序分辨的类型，界面自然给得出不同文案。
    </p>
    <p>
      再解决上下文丢失：<code>Error</code> 构造器支持 <code>cause</code> 选项（ES2022），<code>super(message, { cause: err })</code> 能把原始错误挂到新错误上，形成<strong>错误链</strong>——你在外层抛出更友好的错误，同时底层原因完整保留。
    </p>
    <p>
      自定义异常还有个实际好处：调用方可以用 <code>instanceof</code> 精确判断「这是我关心的业务错误」还是「意料之外的崩溃」。前者给用户一句友好提示，后者记录日志并上报，两条处理路径泾渭分明。反观只拿一句 <code>message</code> 字符串去判断，靠的是文本比对，改动一处文案就可能让分支逻辑失效。
    </p>
    <div class="lesson-box warn">
      两个边界要知道：<code>try/catch</code> 捕获不到 <code>setTimeout</code> 这类<strong>异步回调内部</strong>的同步抛出，因为回调在另一个任务里执行，调用栈早已不同；Promise 链连续 <code>then</code> 时用最后的 <code>catch</code> 兜底，未处理的拒绝还要配置全局监听，否则会静默丢失。
    </div>

    <h2>类型分流与上下文</h2>
    <figure class="lesson-figure">
      <figcaption>分别点三个按钮，观察 <code>instanceof</code> 如何分流错误类型，以及 <code>cause</code> 怎样把字段信息带出来。</figcaption>
      <J16ErrorHandling />
    </figure>

    <h2>错误边界的设计原则</h2>
    <p>
      错误处理的关键，是把失败当成设计对象而非意外：在系统边界统一收口，用类型清晰分流，用 <code>cause</code> 保留底层上下文。这样「失败」才是一条可追踪、可恢复的路径。
    </p>
    <p>
      从一个笼统的字符串，到一条带类型、带原因、可被精确捕获的错误链，中间差的不是语法，而是把「失败」纳入设计的态度。
    </p>
    <div class="lesson-term">
      <span class="term-name">「异常与错误链」</span><code>try/catch</code> 捕获同步异常以及 <code>async/await</code> 中被拒绝的 Promise，<code>finally</code> 无论成败都执行清理；继承 <code>Error</code> 可定义携带业务字段的自定义异常，按类型或 <code>name</code> 分流；<code>super(message, { cause: err })</code> 用 <code>cause</code>（ES2022）把原始错误挂到新错误上，形成错误链、保留底层上下文。
    </div>
  </LessonArticle>
</template>
